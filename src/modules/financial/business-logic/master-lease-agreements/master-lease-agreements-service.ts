/**
 * Master Lease Agreements Service
 * Manages master lease agreement templates, terms, and conditions
 */

export interface MasterLeaseAgreement {
  id: string;
  agreementNumber: string;
  templateName: string;
  version: string;
  customerId: string;
  customerName: string;
  effectiveDate: Date;
  expirationDate?: Date;
  status: 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED' | 'SUSPENDED';
  standardTerms: StandardTerms;
  customTerms?: CustomTerm[];
  creditTerms: CreditTerms;
  operationalTerms: OperationalTerms;
  complianceRequirements: LeaseComplianceRequirement[];
  approvals: AgreementApproval[];
  createdDate: Date;
  modifiedDate: Date;
}

export interface StandardTerms {
  defaultLeaseType: 'CAPITAL' | 'OPERATING' | 'SYNTHETIC';
  defaultTermMonths: number;
  paymentFrequency: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL';
  paymentTiming: 'ADVANCE' | 'ARREARS';
  interestRateStructure: 'FIXED' | 'VARIABLE' | 'INDEXED';
  defaultInterestRate: number;
  latePaymentFee: number;
  earlyTerminationPolicy: string;
  insuranceRequirements: string[];
  maintenanceResponsibility: 'LESSOR' | 'LESSEE' | 'SHARED';
}

export interface CustomTerm {
  id: string;
  category: 'PAYMENT' | 'INSURANCE' | 'MAINTENANCE' | 'TERMINATION' | 'OTHER';
  description: string;
  value: string;
  effectiveDate: Date;
  expirationDate?: Date;
}

export interface CreditTerms {
  creditLimit: number;
  paymentTerms: string;
  securityDepositRequired: boolean;
  securityDepositAmount?: number;
  guarantorRequired: boolean;
  personalGuaranteeRequired: boolean;
  financialCovenantsRequired: boolean;
  financialReportingFrequency?: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
}

export interface OperationalTerms {
  assetCategories: string[];
  geographicRestrictions?: string[];
  useRestrictions?: string[];
  sublettingAllowed: boolean;
  modificationsAllowed: boolean;
  transferRights: 'NONE' | 'WITH_CONSENT' | 'UNRESTRICTED';
  returnConditionRequirements: string[];
}

export interface LeaseComplianceRequirement {
  id: string;
  type: 'REGULATORY' | 'ENVIRONMENTAL' | 'SAFETY' | 'FINANCIAL';
  description: string;
  frequency: 'ONGOING' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  responsibleParty: 'LESSOR' | 'LESSEE' | 'BOTH';
  penaltyForNonCompliance?: string;
}

export interface AgreementApproval {
  id: string;
  approvalType: 'LEGAL' | 'CREDIT' | 'OPERATIONS' | 'MANAGEMENT';
  approver: string;
  approvalDate: Date;
  status: 'APPROVED' | 'REJECTED' | 'CONDITIONAL';
  comments?: string;
  conditions?: string[];
}

export class MasterLeaseAgreementsService {
  /**
   * Create a new master lease agreement
   */
  async createMasterLeaseAgreement(
    agreement: Omit<MasterLeaseAgreement, 'id' | 'agreementNumber' | 'createdDate' | 'modifiedDate' | 'approvals'>
  ): Promise<MasterLeaseAgreement> {
    const agreementId = `mla_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const agreementNumber = `MLA-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    
    return {
      ...agreement,
      id: agreementId,
      agreementNumber,
      approvals: [],
      createdDate: new Date(),
      modifiedDate: new Date(),
    };
  }

  /**
   * Update master lease agreement terms
   */
  async updateMasterLeaseAgreement(
    agreementId: string,
    updates: Partial<Pick<MasterLeaseAgreement, 'standardTerms' | 'customTerms' | 'creditTerms' | 'operationalTerms'>>
  ): Promise<MasterLeaseAgreement> {
    // Implementation would fetch existing agreement and apply updates
    const existingAgreement = await this.getMasterLeaseAgreement(agreementId);
    
    return {
      ...existingAgreement,
      ...updates,
      version: this.incrementVersion(existingAgreement.version),
      modifiedDate: new Date(),
    };
  }

  /**
   * Submit master lease agreement for approval
   */
  async submitForApproval(
    agreementId: string,
    approvalTypes: AgreementApproval['approvalType'][]
  ): Promise<AgreementApproval[]> {
    const approvals: AgreementApproval[] = approvalTypes.map(type => ({
      id: `aa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      approvalType: type,
      approver: 'pending_assignment',
      approvalDate: new Date(),
      status: 'APPROVED', // Would be 'PENDING' in real implementation
    }));
    
    return approvals;
  }

  /**
   * Generate individual lease from master agreement
   */
  async generateLeaseFromMaster(
    masterAgreementId: string,
    assetDetails: any,
    specificTerms: any
  ): Promise<string> {
    // Implementation would create individual lease based on master template
    const leaseId = `lease_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return leaseId;
  }

  /**
   * Get master lease agreement by ID
   */
  async getMasterLeaseAgreement(agreementId: string): Promise<MasterLeaseAgreement> {
    // Mock implementation - would fetch from database
    return {
      id: agreementId,
      agreementNumber: 'MLA-2024-123456',
      templateName: 'Standard Equipment Lease',
      version: '1.0',
      customerId: 'cust_001',
      customerName: 'Sample Customer',
      effectiveDate: new Date(),
      status: 'ACTIVE',
      standardTerms: {
        defaultLeaseType: 'OPERATING',
        defaultTermMonths: 36,
        paymentFrequency: 'MONTHLY',
        paymentTiming: 'ADVANCE',
        interestRateStructure: 'FIXED',
        defaultInterestRate: 0.05,
        latePaymentFee: 50,
        earlyTerminationPolicy: 'Penalty applies',
        insuranceRequirements: ['General Liability', 'Property Insurance'],
        maintenanceResponsibility: 'LESSEE',
      },
      creditTerms: {
        creditLimit: 100000,
        paymentTerms: 'Net 30',
        securityDepositRequired: false,
        guarantorRequired: false,
        personalGuaranteeRequired: false,
        financialCovenantsRequired: true,
        financialReportingFrequency: 'QUARTERLY',
      },
      operationalTerms: {
        assetCategories: ['Equipment', 'Vehicles'],
        sublettingAllowed: false,
        modificationsAllowed: false,
        transferRights: 'WITH_CONSENT',
        returnConditionRequirements: ['Good working condition', 'Normal wear acceptable'],
      },
      complianceRequirements: [],
      approvals: [],
      createdDate: new Date(),
      modifiedDate: new Date(),
    };
  }

  /**
   * Track agreement utilization and performance
   */
  async getAgreementUtilization(agreementId: string): Promise<any> {
    return {
      agreementId,
      totalCreditLimit: 100000,
      creditUtilized: 75000,
      creditAvailable: 25000,
      activeLeases: 15,
      totalAssetValue: 500000,
      paymentPerformance: 'EXCELLENT',
      utilizationPercent: 75,
      lastUtilizationDate: new Date(),
    };
  }

  private incrementVersion(currentVersion: string): string {
    const parts = currentVersion.split('.');
    const minor = parseInt(parts[1]) + 1;
    return `${parts[0]}.${minor}`;
  }
}

// Export singleton instance
export const masterLeaseAgreementsService = new MasterLeaseAgreementsService();