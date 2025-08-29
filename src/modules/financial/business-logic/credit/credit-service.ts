/**
 * Credit Service
 * Manages customer credit evaluation, scoring, and approval processes
 */

export interface CreditApplication {
  id: string;
  customerId: string;
  applicationDate: Date;
  requestedCreditLimit: number;
  businessInfo: BusinessInformation;
  financialInfo: FinancialInformation;
  creditReferences: CreditReference[];
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'DENIED' | 'CONDITIONAL';
  creditDecision?: CreditDecision;
  reviewedBy?: string;
  reviewDate?: Date;
}

export interface BusinessInformation {
  businessName: string;
  businessType: 'CORPORATION' | 'LLC' | 'PARTNERSHIP' | 'SOLE_PROPRIETORSHIP';
  yearsInBusiness: number;
  annualRevenue: number;
  numberOfEmployees: number;
  industry: string;
  businessAddress: CreditAddress;
  taxId: string;
  dunsNumber?: string;
}

export interface FinancialInformation {
  annualRevenue: number;
  netIncome: number;
  totalAssets: number;
  totalLiabilities: number;
  cashFlow: number;
  existingDebt: number;
  bankingRelationship: string;
  accountingFirmName?: string;
}

export interface CreditReference {
  companyName: string;
  contactName: string;
  contactPhone: string;
  creditLimit: number;
  paymentTerms: string;
  paymentHistory: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  yearsOfRelationship: number;
}

export interface CreditAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CreditDecision {
  decision: 'APPROVED' | 'DENIED' | 'CONDITIONAL';
  approvedCreditLimit?: number;
  interestRate?: number;
  paymentTerms?: string;
  conditions?: string[];
  expirationDate?: Date;
  reasonCodes?: string[];
}

export interface CreditScore {
  score: number;
  scoreRange: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  factors: CreditScoreFactor[];
  scoreDate: Date;
}

export interface CreditScoreFactor {
  factor: string;
  impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  description: string;
  weight: number;
}

export class CreditService {
  /**
   * Submit a new credit application
   */
  async submitCreditApplication(
    application: Omit<CreditApplication, 'id' | 'applicationDate' | 'status'>
  ): Promise<CreditApplication> {
    const applicationId = `ca_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      ...application,
      id: applicationId,
      applicationDate: new Date(),
      status: 'PENDING',
    };
  }

  /**
   * Calculate credit score based on financial information
   */
  async calculateCreditScore(
    businessInfo: BusinessInformation,
    financialInfo: FinancialInformation
  ): Promise<CreditScore> {
    let score = 600; // Base score
    const factors: CreditScoreFactor[] = [];
    
    // Years in business factor
    if (businessInfo.yearsInBusiness > 5) {
      score += 50;
      factors.push({
        factor: 'Years in Business',
        impact: 'POSITIVE',
        description: 'Business established for more than 5 years',
        weight: 15,
      });
    }
    
    // Revenue factor
    if (financialInfo.annualRevenue > 1000000) {
      score += 40;
      factors.push({
        factor: 'Annual Revenue',
        impact: 'POSITIVE',
        description: 'Strong annual revenue over $1M',
        weight: 20,
      });
    }
    
    // Debt-to-income ratio
    const debtToIncome = financialInfo.existingDebt / financialInfo.annualRevenue;
    if (debtToIncome < 0.3) {
      score += 30;
      factors.push({
        factor: 'Debt to Income Ratio',
        impact: 'POSITIVE',
        description: 'Low debt-to-income ratio',
        weight: 25,
      });
    } else if (debtToIncome > 0.6) {
      score -= 50;
      factors.push({
        factor: 'Debt to Income Ratio',
        impact: 'NEGATIVE',
        description: 'High debt-to-income ratio',
        weight: 25,
      });
    }
    
    // Determine risk level
    let riskLevel: CreditScore['riskLevel'];
    if (score >= 750) riskLevel = 'LOW';
    else if (score >= 650) riskLevel = 'MEDIUM';
    else riskLevel = 'HIGH';
    
    return {
      score: Math.min(850, Math.max(300, score)),
      scoreRange: '300-850',
      riskLevel,
      factors,
      scoreDate: new Date(),
    };
  }

  /**
   * Process credit decision based on score and application
   */
  async processCreditDecision(applicationId: string): Promise<CreditDecision> {
    // Implementation would fetch application and score, then make decision
    const decision: CreditDecision = {
      decision: 'APPROVED',
      approvedCreditLimit: 100000,
      interestRate: 6.5,
      paymentTerms: 'Net 30',
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    };
    
    return decision;
  }

  /**
   * Check credit references
   */
  async verifyCreditReferences(references: CreditReference[]): Promise<boolean> {
    // Implementation would contact references and verify information
    // For now, return true as placeholder
    return true;
  }

  /**
   * Update customer credit limit
   */
  async updateCreditLimit(customerId: string, newLimit: number, reason: string): Promise<void> {
    // Implementation would update customer record with new credit limit
    console.log(`Updated credit limit for customer ${customerId} to ${newLimit}. Reason: ${reason}`);
  }

  /**
   * Generate credit report
   */
  async generateCreditReport(customerId: string): Promise<any> {
    return {
      customerId,
      creditScore: 720,
      creditLimit: 100000,
      availableCredit: 75000,
      paymentHistory: 'EXCELLENT',
      lastReviewDate: new Date(),
      nextReviewDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
      riskAssessment: 'LOW',
      recommendations: [
        'Customer maintains excellent payment history',
        'Consider credit limit increase opportunity'
      ],
    };
  }
}

// Export singleton instance
export const creditService = new CreditService();