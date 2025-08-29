/**
 * Lease Sales Quotes Service
 * Manages the creation, modification, and tracking of lease sales quotes
 */

export interface LeaseSalesQuote {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  salesRepId: string;
  assets: QuotedAsset[];
  leaseTerms: LeaseTerms;
  pricing: QuotePricing;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'CONVERTED';
  validUntil: Date;
  createdDate: Date;
  modifiedDate: Date;
  approvedBy?: string;
  approvedDate?: Date;
  notes?: string;
}

export interface QuotedAsset {
  id: string;
  description: string;
  manufacturer: string;
  model: string;
  serialNumber?: string;
  assetValue: number;
  residualValue?: number;
  assetCategory: string;
  quantity: number;
}

export interface LeaseTerms {
  termMonths: number;
  leaseType: 'CAPITAL' | 'OPERATING' | 'SYNTHETIC';
  paymentFrequency: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL';
  paymentTiming: 'ADVANCE' | 'ARREARS';
  firstPaymentDate: Date;
  lastPaymentDate: Date;
  purchaseOptionType?: 'FAIR_MARKET' | 'FIXED_PRICE' | 'DOLLAR_BUYOUT';
  purchaseOptionAmount?: number;
  earlyTerminationAllowed: boolean;
}

export interface QuotePricing {
  totalAssetValue: number;
  downPayment?: number;
  monthlyPayment: number;
  totalPayments: number;
  totalCost: number;
  implicitRate: number;
  subsidies?: number;
  taxes?: number;
  fees?: number;
}

export interface QuoteApproval {
  id: string;
  quoteId: string;
  approvalLevel: 'SALES_MANAGER' | 'CREDIT_MANAGER' | 'SENIOR_MANAGEMENT';
  approverId: string;
  approverName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvalDate?: Date;
  comments?: string;
  conditions?: string[];
}

export class LeaseSalesQuotesService {
  /**
   * Create a new lease sales quote
   */
  async createLeaseSalesQuote(
    customerId: string,
    salesRepId: string,
    assets: QuotedAsset[],
    leaseTerms: LeaseTerms
  ): Promise<LeaseSalesQuote> {
    const quoteId = `lsq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const quoteNumber = `Q-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    
    const totalAssetValue = assets.reduce((sum, asset) => sum + (asset.assetValue * asset.quantity), 0);
    
    // Calculate pricing (simplified calculation)
    const monthlyRate = 0.04 / 12; // 4% annual rate
    const monthlyPayment = (totalAssetValue * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -leaseTerms.termMonths));
    
    const pricing: QuotePricing = {
      totalAssetValue,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPayments: Math.round(monthlyPayment * leaseTerms.termMonths * 100) / 100,
      totalCost: Math.round(monthlyPayment * leaseTerms.termMonths * 100) / 100,
      implicitRate: 0.04,
    };
    
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30); // Valid for 30 days
    
    return {
      id: quoteId,
      quoteNumber,
      customerId,
      customerName: 'Customer Name', // Would be fetched from customer service
      salesRepId,
      assets,
      leaseTerms,
      pricing,
      status: 'DRAFT',
      validUntil,
      createdDate: new Date(),
      modifiedDate: new Date(),
    };
  }

  /**
   * Update an existing quote with new assets or terms
   */
  async updateLeaseSalesQuote(
    quoteId: string,
    updates: Partial<Pick<LeaseSalesQuote, 'assets' | 'leaseTerms' | 'notes'>>
  ): Promise<LeaseSalesQuote> {
    // Implementation would fetch existing quote and apply updates
    // For now, return a mock updated quote
    const existingQuote = await this.getLeaseSalesQuote(quoteId);
    
    return {
      ...existingQuote,
      ...updates,
      modifiedDate: new Date(),
    };
  }

  /**
   * Submit quote for approval
   */
  async submitQuoteForApproval(quoteId: string): Promise<QuoteApproval[]> {
    // Implementation would determine required approval levels based on quote value
    const approvals: QuoteApproval[] = [
      {
        id: `qa_${Date.now()}_1`,
        quoteId,
        approvalLevel: 'SALES_MANAGER',
        approverId: 'mgr_001',
        approverName: 'Sales Manager',
        status: 'PENDING',
      }
    ];
    
    return approvals;
  }

  /**
   * Convert approved quote to lease agreement
   */
  async convertQuoteToLease(quoteId: string): Promise<string> {
    // Implementation would create a lease agreement from the quote
    const leaseId = `lease_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Update quote status to converted
    // Create lease agreement record
    
    return leaseId;
  }

  /**
   * Get quote by ID
   */
  async getLeaseSalesQuote(quoteId: string): Promise<LeaseSalesQuote> {
    // Mock implementation - would fetch from database
    return {
      id: quoteId,
      quoteNumber: 'Q-2024-123456',
      customerId: 'cust_001',
      customerName: 'Sample Customer',
      salesRepId: 'rep_001',
      assets: [],
      leaseTerms: {
        termMonths: 36,
        leaseType: 'OPERATING',
        paymentFrequency: 'MONTHLY',
        paymentTiming: 'ADVANCE',
        firstPaymentDate: new Date(),
        lastPaymentDate: new Date(),
        earlyTerminationAllowed: true,
      },
      pricing: {
        totalAssetValue: 100000,
        monthlyPayment: 3000,
        totalPayments: 108000,
        totalCost: 108000,
        implicitRate: 0.04,
      },
      status: 'DRAFT',
      validUntil: new Date(),
      createdDate: new Date(),
      modifiedDate: new Date(),
    };
  }

  /**
   * Generate quote document (PDF/Word)
   */
  async generateQuoteDocument(quoteId: string, format: 'PDF' | 'WORD'): Promise<Buffer> {
    // Implementation would generate formatted quote document
    return Buffer.from('Quote document content');
  }
}

// Export singleton instance
export const leaseSalesQuotesService = new LeaseSalesQuotesService();