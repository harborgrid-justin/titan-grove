/**
 * Financial Management Module
 * Provides complete financial management capabilities including GL, AP, AR, Fixed Assets
 * Enhanced with Oracle Lease and Finance Management sub-modules
 */

// Export all types
export * from './types';

// Export data access layer
export * from './data-access';

// Import business logic services
import { pricingService } from './business-logic/pricing/pricing-service';
import { subsidiesService } from './business-logic/subsidies/subsidies-service';
import { leaseSalesQuotesService } from './business-logic/lease-sales-quotes/lease-sales-quotes-service';
import { creditService } from './business-logic/credit/credit-service';
import { masterLeaseAgreementsService } from './business-logic/master-lease-agreements/master-lease-agreements-service';
import { contractAuthoringService } from './business-logic/contract-authoring/contract-authoring-service';
import { streamsService } from './business-logic/streams/streams-service';
import { taxService } from './business-logic/tax/tax-service';
import { billingService } from './business-logic/billing/billing-service';

// Export all business logic services for direct access
export * from './business-logic/pricing/pricing-service';
export * from './business-logic/subsidies/subsidies-service';
export * from './business-logic/lease-sales-quotes/lease-sales-quotes-service';
export * from './business-logic/credit/credit-service';
export * from './business-logic/master-lease-agreements/master-lease-agreements-service';
export * from './business-logic/contract-authoring/contract-authoring-service';
export * from './business-logic/streams/streams-service';
export * from './business-logic/tax/tax-service';
export * from './business-logic/billing/billing-service';

// Import shared utilities
import { BaseManager } from '../../shared/utils/base-manager';

import type { GeneralLedgerEntry, Account, Invoice, InvoiceItem } from './types';

export class FinancialManager extends BaseManager {
  /**
   * General Ledger Operations
   */
  async createGLEntry(entry: Omit<GeneralLedgerEntry, 'id'>): Promise<GeneralLedgerEntry> {
    const id = this.generateId('gl');
    const glEntry: GeneralLedgerEntry = { ...entry, id };

    // Validate double-entry bookkeeping
    if (entry.debit !== 0 && entry.credit !== 0) {
      throw new Error('Entry must have either debit or credit, not both');
    }

    this.logAction('createGLEntry', { id, accountCode: entry.accountCode });
    return glEntry;
  }

  async getTrialBalance(asOfDate: Date): Promise<Account[]> {
    // Implementation would aggregate all GL entries to calculate trial balance
    return [];
  }

  /**
   * Accounts Receivable Operations
   */
  async createInvoice(invoice: Omit<Invoice, 'id'>): Promise<Invoice> {
    const id = this.generateId('inv');
    const newInvoice: Invoice = { ...invoice, id };

    // Calculate totals
    const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);
    const taxTotal = invoice.items.reduce(
      (sum, item) => sum + (item.amount * item.taxRate) / 100,
      0
    );

    newInvoice.amount = subtotal;
    newInvoice.taxAmount = taxTotal;
    newInvoice.totalAmount = subtotal + taxTotal;

    this.logAction('createInvoice', { id, amount: newInvoice.totalAmount });
    return newInvoice;
  }

  async processPayment(invoiceId: string, amount: number, paymentDate: Date): Promise<void> {
    // Implementation would record payment and update invoice status
    console.log(`Processing payment of ${amount} for invoice ${invoiceId} on ${paymentDate}`);
  }

  /**
   * Financial Reporting
   */
  async generateProfitLossStatement(startDate: Date, endDate: Date): Promise<any> {
    return {
      period: `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`,
      revenue: {
        totalRevenue: 0,
        breakdown: [],
      },
      expenses: {
        totalExpenses: 0,
        breakdown: [],
      },
      netIncome: 0,
    };
  }

  async generateBalanceSheet(asOfDate: Date): Promise<any> {
    return {
      asOfDate: asOfDate.toISOString().split('T')[0],
      assets: {
        currentAssets: 0,
        fixedAssets: 0,
        totalAssets: 0,
      },
      liabilities: {
        currentLiabilities: 0,
        longTermLiabilities: 0,
        totalLiabilities: 0,
      },
      equity: {
        totalEquity: 0,
      },
    };
  }

  // Lease and Finance Management Business Logic Methods - delegate to specialized services

  /**
   * Pricing Management
   */
  async calculateLeasePricing(
    assetValue: number,
    termMonths: number,
    pricingModelId: string,
    customerId?: string
  ) {
    return pricingService.calculateLeasePricing(assetValue, termMonths, pricingModelId, customerId);
  }

  async createPricingModel(model: any) {
    return pricingService.createPricingModel(model);
  }

  async generatePricingComparison(assetValue: number, termMonths: number, modelIds: string[]) {
    return pricingService.generatePricingComparison(assetValue, termMonths, modelIds);
  }

  /**
   * Subsidies Management
   */
  async findApplicableSubsidies(
    assetType: string,
    assetValue: number,
    customerId: string,
    location: string
  ) {
    return subsidiesService.findApplicableSubsidies(assetType, assetValue, customerId, location);
  }

  async applyForSubsidy(subsidyId: string, leaseId: string, customerId: string) {
    return subsidiesService.applyForSubsidy(subsidyId, leaseId, customerId);
  }

  async calculateSubsidyAmount(subsidy: any, assetValue: number) {
    return subsidiesService.calculateSubsidyAmount(subsidy, assetValue);
  }

  /**
   * Lease Sales Quotes
   */
  async createLeaseSalesQuote(
    customerId: string,
    salesRepId: string,
    assets: any[],
    leaseTerms: any
  ) {
    return leaseSalesQuotesService.createLeaseSalesQuote(
      customerId,
      salesRepId,
      assets,
      leaseTerms
    );
  }

  async submitQuoteForApproval(quoteId: string) {
    return leaseSalesQuotesService.submitQuoteForApproval(quoteId);
  }

  async convertQuoteToLease(quoteId: string) {
    return leaseSalesQuotesService.convertQuoteToLease(quoteId);
  }

  /**
   * Credit Management
   */
  async submitCreditApplication(application: any) {
    return creditService.submitCreditApplication(application);
  }

  async calculateCreditScore(businessInfo: any, financialInfo: any) {
    return creditService.calculateCreditScore(businessInfo, financialInfo);
  }

  async processCreditDecision(applicationId: string) {
    return creditService.processCreditDecision(applicationId);
  }

  /**
   * Master Lease Agreements
   */
  async createMasterLeaseAgreement(agreement: any) {
    return masterLeaseAgreementsService.createMasterLeaseAgreement(agreement);
  }

  async generateLeaseFromMaster(masterAgreementId: string, assetDetails: any, specificTerms: any) {
    return masterLeaseAgreementsService.generateLeaseFromMaster(
      masterAgreementId,
      assetDetails,
      specificTerms
    );
  }

  async getAgreementUtilization(agreementId: string) {
    return masterLeaseAgreementsService.getAgreementUtilization(agreementId);
  }

  /**
   * Contract Authoring
   */
  async createContractFromTemplate(
    templateId: string,
    variables: Record<string, any>,
    createdBy: string
  ) {
    return contractAuthoringService.createContractFromTemplate(templateId, variables, createdBy);
  }

  async saveContractTemplate(template: any) {
    return contractAuthoringService.saveContractTemplate(template);
  }

  async generateContractDocument(contractId: string, format: 'PDF' | 'WORD' | 'HTML') {
    return contractAuthoringService.generateContractDocument(contractId, format);
  }

  /**
   * Streams and Cash Flow
   */
  async createPaymentStream(stream: any) {
    return streamsService.createPaymentStream(stream);
  }

  async generateCashFlowProjection(leaseIds: string[], periodMonths: number) {
    return streamsService.generateCashFlowProjection(leaseIds, periodMonths);
  }

  /**
   * Tax Management
   */
  async calculateTax(leaseId: string, assetValue: number, jurisdiction: string) {
    return taxService.calculateTax(leaseId, `tx_${Date.now()}`, assetValue, jurisdiction);
  }

  async generateTaxReport(startDate: Date, endDate: Date) {
    return taxService.generateTaxReport(startDate, endDate);
  }

  /**
   * Billing Management
   */
  async createLeaseBilling(billing: any) {
    return billingService.createLeaseBilling(billing);
  }

  async generateInvoice(leaseId: string, billingPeriodStart: Date, billingPeriodEnd: Date) {
    return billingService.generateInvoice(leaseId, billingPeriodStart, billingPeriodEnd);
  }

  async processAutomaticBilling(date: Date) {
    return billingService.processAutomaticBilling(date);
  }
}

export const financialManager = new FinancialManager();

// Export business logic services for direct access if needed
export {
  pricingService,
  subsidiesService,
  leaseSalesQuotesService,
  creditService,
  masterLeaseAgreementsService,
  contractAuthoringService,
  streamsService,
  taxService,
  billingService,
};
