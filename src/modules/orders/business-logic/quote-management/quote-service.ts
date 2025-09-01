/**
 * Quote Management Service
 * Comprehensive sales quote lifecycle management with Oracle EBS competitive features
 */

import type { 
  Quote, 
  QuoteLineItem, 
  QuoteApproval, 
  QuoteWorkflow,
  CompetitorInfo,
  AlternativeItem,
  PricingRule,
  ProductConfiguration,
  OrderAddress,
  QuoteMetrics
} from '../../types';

import {
  QuoteStatus,
  Priority
} from '../../types';

import { QuoteManagementConfig } from '../../../../types/business-config';
import { BusinessMetricsUtils } from '../../../../shared/constants';

export class QuoteService {
  
  constructor(private config: QuoteManagementConfig) {}
  
  // ================================
  // CORE QUOTE MANAGEMENT
  // ================================

  /**
   * Create a new sales quote with comprehensive Oracle EBS features
   */
  async createQuote(quoteData: {
    customerId: string;
    customerName: string;
    opportunityId?: string;
    salesRepId: string;
    salesRepName: string;
    quoteType?: 'STANDARD' | 'BLANKET' | 'CONTRACT' | 'LEASE';
    priority?: Priority;
    expirationDays?: number;
    priceListId?: string;
    currency?: string;
    paymentTermsId?: string;
    shippingMethodId?: string;
    taxExempt?: boolean;
    shippingAddress: OrderAddress;
    billingAddress: OrderAddress;
    lineItems: Omit<QuoteLineItem, 'id'>[];
    competitorInfo?: CompetitorInfo[];
    notes?: string;
    internalNotes?: string;
    termsAndConditions?: string;
    winProbability?: number;
    estimatedCloseDate?: Date;
    customFields?: Record<string, any>;
  }): Promise<Quote> {
    
    const quoteId = `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const quoteNumber = `QT${Date.now().toString().slice(-8)}`;
    
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + (quoteData.expirationDays || this.config.defaultExpirationDays));
    
    const validUntil = new Date(expirationDate);
    
    // Calculate line item totals
    const processedLineItems: QuoteLineItem[] = quoteData.lineItems.map((item, index) => {
      const extendedPrice = (item.unitPrice * item.quantity) - item.discountAmount;
      const margin = item.unitPrice - (item.costOfGoodsSold || 0);
      const marginPercent = item.costOfGoodsSold ? (margin / item.unitPrice) * 100 : 0;
      
      return {
        ...item,
        id: `qli_${Date.now()}_${index}`,
        lineNumber: index + 1,
        extendedPrice,
        margin,
        marginPercent
      };
    });

    // Calculate quote totals
    const subtotal = processedLineItems.reduce((sum, item) => sum + item.extendedPrice, 0);
    const discountAmount = quoteData.lineItems.reduce((sum, item) => sum + (item.discountAmount || 0), 0);
    const taxAmount = this.calculateTax(subtotal - discountAmount, quoteData.taxExempt || false);
    const shippingAmount = await this.calculateShipping(processedLineItems, quoteData.shippingAddress);
    const totalAmount = subtotal - discountAmount + taxAmount + shippingAmount;

    const quote: Quote = {
      id: quoteId,
      quoteNumber,
      customerId: quoteData.customerId,
      customerName: quoteData.customerName,
      opportunityId: quoteData.opportunityId,
      status: QuoteStatus.DRAFT,
      quoteType: quoteData.quoteType || 'STANDARD',
      priority: quoteData.priority || Priority.MEDIUM,
      quoteDate: new Date(),
      expirationDate,
      validUntil,
      salesRepId: quoteData.salesRepId,
      salesRepName: quoteData.salesRepName,
      territory: await this.getTerritoryBySalesRep(quoteData.salesRepId),
      priceListId: quoteData.priceListId,
      currency: quoteData.currency || 'USD',
      exchangeRate: await this.getExchangeRate(quoteData.currency || 'USD'),
      paymentTermsId: quoteData.paymentTermsId,
      shippingMethodId: quoteData.shippingMethodId,
      taxExempt: quoteData.taxExempt || false,
      competitorInfo: quoteData.competitorInfo || [],
      shippingAddress: quoteData.shippingAddress,
      billingAddress: quoteData.billingAddress,
      lineItems: processedLineItems,
      alternativeItems: [],
      subtotal: Math.round(subtotal * 100) / 100,
      discountAmount: Math.round(discountAmount * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      shippingAmount: Math.round(shippingAmount * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      approvals: [],
      workflows: [],
      notes: quoteData.notes,
      internalNotes: quoteData.internalNotes,
      termsAndConditions: quoteData.termsAndConditions,
      customFields: quoteData.customFields,
      attachments: [],
      revisionNumber: 1,
      winProbability: quoteData.winProbability,
      estimatedCloseDate: quoteData.estimatedCloseDate,
      createdDate: new Date(),
      modifiedDate: new Date(),
      createdBy: quoteData.salesRepId,
      modifiedBy: quoteData.salesRepId
    };

    // Start quote workflow if needed
    if (this.requiresApproval(quote)) {
      await this.initiateQuoteApprovalWorkflow(quoteId);
    }

    return quote;
  }

  /**
   * Update existing quote
   */
  async updateQuote(
    quoteId: string, 
    updates: Partial<Quote>,
    updatedBy: string
  ): Promise<Quote> {
    const existingQuote = await this.getQuoteById(quoteId);
    if (!existingQuote) {
      throw new Error(`Quote with ID ${quoteId} not found`);
    }

    if (existingQuote.status === QuoteStatus.CONVERTED) {
      throw new Error('Cannot update converted quote');
    }

    // Increment revision number if line items changed
    let revisionNumber = existingQuote.revisionNumber;
    if (updates.lineItems && JSON.stringify(updates.lineItems) !== JSON.stringify(existingQuote.lineItems)) {
      revisionNumber += 1;
    }

    // Recalculate totals if line items changed
    if (updates.lineItems) {
      const subtotal = updates.lineItems.reduce((sum, item) => sum + item.extendedPrice, 0);
      const discountAmount = updates.lineItems.reduce((sum, item) => sum + (item.discountAmount || 0), 0);
      const taxAmount = this.calculateTax(subtotal - discountAmount, existingQuote.taxExempt);
      const shippingAmount = await this.calculateShipping(updates.lineItems, existingQuote.shippingAddress);
      const totalAmount = subtotal - discountAmount + taxAmount + shippingAmount;

      updates.subtotal = Math.round(subtotal * 100) / 100;
      updates.discountAmount = Math.round(discountAmount * 100) / 100;
      updates.taxAmount = Math.round(taxAmount * 100) / 100;
      updates.shippingAmount = Math.round(shippingAmount * 100) / 100;
      updates.totalAmount = Math.round(totalAmount * 100) / 100;
    }

    const updatedQuote: Quote = {
      ...existingQuote,
      ...updates,
      revisionNumber,
      modifiedDate: new Date(),
      modifiedBy: updatedBy
    };

    return updatedQuote;
  }

  /**
   * Submit quote for customer review
   */
  async submitQuote(quoteId: string, submittedBy: string): Promise<Quote> {
    const quote = await this.getQuoteById(quoteId);
    if (!quote) {
      throw new Error(`Quote with ID ${quoteId} not found`);
    }

    if (quote.status !== QuoteStatus.DRAFT && quote.status !== QuoteStatus.REJECTED) {
      throw new Error(`Quote status ${quote.status} cannot be submitted`);
    }

    // Validate quote before submission
    await this.validateQuote(quote);

    const updatedQuote: Quote = {
      ...quote,
      status: QuoteStatus.SUBMITTED,
      modifiedDate: new Date(),
      modifiedBy: submittedBy
    };

    // Initiate approval workflow if required
    if (this.requiresApproval(quote)) {
      await this.initiateQuoteApprovalWorkflow(quoteId);
    }

    return updatedQuote;
  }

  /**
   * Approve quote
   */
  async approveQuote(
    quoteId: string, 
    approverId: string, 
    comments?: string
  ): Promise<Quote> {
    const quote = await this.getQuoteById(quoteId);
    if (!quote) {
      throw new Error(`Quote with ID ${quoteId} not found`);
    }

    // Update approval record
    const approvals = quote.approvals.map(approval => 
      approval.approverId === approverId && approval.status === 'PENDING'
        ? {
            ...approval,
            status: 'APPROVED' as const,
            responseDate: new Date(),
            comments
          }
        : approval
    );

    // Check if all required approvals are complete
    const allApproved = approvals
      .filter(a => a.isRequired)
      .every(a => a.status === 'APPROVED');

    const updatedQuote: Quote = {
      ...quote,
      approvals,
      status: allApproved ? QuoteStatus.APPROVED : quote.status,
      modifiedDate: new Date(),
      modifiedBy: approverId
    };

    return updatedQuote;
  }

  /**
   * Convert approved quote to sales order
   */
  async convertQuoteToOrder(
    quoteId: string, 
    convertedBy: string,
    orderOptions?: {
      requestedDate?: Date;
      priority?: Priority;
      notes?: string;
    }
  ): Promise<{ orderId: string; orderNumber: string }> {
    const quote = await this.getQuoteById(quoteId);
    if (!quote) {
      throw new Error(`Quote with ID ${quoteId} not found`);
    }

    if (quote.status !== QuoteStatus.APPROVED) {
      throw new Error(`Only approved quotes can be converted to orders. Current status: ${quote.status}`);
    }

    // Create sales order from quote
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const orderNumber = `SO${Date.now().toString().slice(-8)}`;

    // Implementation would create actual sales order
    // This is a placeholder for the integration

    // Update quote status
    const updatedQuote: Quote = {
      ...quote,
      status: QuoteStatus.CONVERTED,
      convertedOrderId: orderId,
      conversionDate: new Date(),
      modifiedDate: new Date(),
      modifiedBy: convertedBy
    };

    return { orderId, orderNumber };
  }

  // ================================
  // QUOTE ANALYTICS AND REPORTING
  // ================================

  /**
   * Get quote performance metrics
   */
  async getQuoteMetrics(criteria?: {
    salesRepId?: string;
    territory?: string;
    customerId?: string;
    dateFrom?: Date;
    dateTo?: Date;
    quoteType?: string;
  }): Promise<QuoteMetrics> {
    // Implementation would query database based on criteria
    // This is a mock implementation using centralized configuration
    
    // Base mock data - would typically come from database
    const totalQuotes = 156;
    const totalQuoteValue = 2450000;
    
    // Generate metrics using centralized business configuration and utilities
    const mockMetrics = BusinessMetricsUtils.generateMockQuoteMetrics({
      totalQuotes,
      totalQuoteValue,
      conversionRate: this.config.mockMetrics.conversionRate,
      winRate: this.config.mockMetrics.winRate,
      averageQuoteToCloseTime: this.config.mockMetrics.averageQuoteToCloseTime,
      priceLossReasonPercentage: this.config.mockMetrics.priceLossReasonPercentage,
      competitorLossReasonPercentage: this.config.mockMetrics.competitorLossReasonPercentage,
      budgetLossReasonPercentage: this.config.mockMetrics.budgetLossReasonPercentage,
    });

    return mockMetrics;
  }

  // ================================
  // QUOTE CONFIGURATION AND PRICING
  // ================================

  /**
   * Generate alternative product recommendations
   */
  async generateAlternativeItems(
    quoteId: string,
    lineItemId: string,
    criteria?: {
      priceRange?: { min: number; max: number };
      category?: string;
      substituteOnly?: boolean;
    }
  ): Promise<AlternativeItem[]> {
    // Implementation would analyze product catalog and generate alternatives
    // This is a mock implementation
    
    return [
      {
        id: `alt_${Date.now()}_1`,
        quoteLineItemId: lineItemId,
        itemId: 'item_alt_001',
        itemCode: 'ALT-WIDGET-001',
        itemDescription: 'Alternative Premium Widget',
        quantity: 1,
        unitPrice: 120.00,
        extendedPrice: 120.00,
        reason: 'UPGRADE',
        availability: 'AVAILABLE',
        leadTime: 5,
        notes: 'Higher performance alternative with extended warranty'
      }
    ];
  }

  /**
   * Apply pricing rules to quote
   */
  async applyPricingRules(
    quote: Quote,
    pricingRules: PricingRule[]
  ): Promise<Quote> {
    // Implementation would apply complex pricing logic
    // This is a placeholder for the pricing engine integration
    
    let updatedQuote = { ...quote };
    
    for (const rule of pricingRules) {
      if (this.evaluatePricingConditions(quote, rule.conditions)) {
        updatedQuote = this.applyPricingActions(updatedQuote, rule.actions);
      }
    }

    return updatedQuote;
  }

  // ================================
  // HELPER METHODS
  // ================================

  private calculateTax(amount: number, taxExempt: boolean): number {
    if (taxExempt) return 0;
    return amount * this.config.standardTaxRate;
  }

  private async calculateShipping(lineItems: QuoteLineItem[], shippingAddress: OrderAddress): Promise<number> {
    // Implementation would integrate with shipping calculator
    const totalWeight = lineItems.length * this.config.mockWeightPerItem;
    return totalWeight * this.config.shippingRatePerPound;
  }

  private async getTerritoryBySalesRep(salesRepId: string): Promise<string | undefined> {
    // Implementation would lookup territory
    return 'WEST';
  }

  private async getExchangeRate(currency: string): Promise<number> {
    // Implementation would get current exchange rates
    return currency === 'USD' ? 1.0 : this.config.currencyConversionRate;
  }

  private requiresApproval(quote: Quote): boolean {
    // Implementation would check approval rules
    return quote.totalAmount > this.config.approvalThresholdAmount || 
           quote.lineItems.some(item => item.discountPercent > this.config.maxDiscountPercentWithoutApproval);
  }

  private async initiateQuoteApprovalWorkflow(quoteId: string): Promise<QuoteWorkflow> {
    // Implementation would start workflow engine
    return {
      id: `workflow_${Date.now()}`,
      quoteId,
      workflowType: 'QUOTE_APPROVAL',
      status: 'PENDING',
      currentStep: 'MANAGER_APPROVAL',
      assignedTo: 'sales_manager_001',
      startDate: new Date(),
      steps: []
    };
  }

  private async validateQuote(quote: Quote): Promise<void> {
    if (!quote.lineItems.length) {
      throw new Error('Quote must have at least one line item');
    }
    
    if (quote.totalAmount <= 0) {
      throw new Error('Quote total must be greater than zero');
    }
    
    if (new Date() > quote.validUntil) {
      throw new Error('Quote has expired');
    }
  }

  private evaluatePricingConditions(quote: Quote, conditions: any[]): boolean {
    // Implementation would evaluate pricing rule conditions
    return true;
  }

  private applyPricingActions(quote: Quote, actions: any[]): Quote {
    // Implementation would apply pricing rule actions
    return quote;
  }

  private async getQuoteById(quoteId: string): Promise<Quote | null> {
    // Implementation would retrieve from database
    return null;
  }
}

import { loadBusinessConfig } from '../../../../utils/business-config';

export const quoteService = new QuoteService(loadBusinessConfig().quoteManagement);