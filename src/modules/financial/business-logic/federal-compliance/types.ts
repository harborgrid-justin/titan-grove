/**
 * Federal Compliance Types
 * Type definitions for federal compliance and regulation management
 */

export interface FederalRegulation {
  id: string;
  regulationType: 'FAR' | 'DFARS' | 'AGENCY_SPECIFIC' | 'CFR' | 'USC';
  regulationNumber: string;
  title: string;
  description: string;
  effectiveDate: Date;
  expirationDate?: Date;
  applicableContracts: string[];
  complianceRequirements: ComplianceRequirement[];
  isActive: boolean;
}

export interface ComplianceRequirement {
  id: string;
  requirementType: 'DOCUMENTATION' | 'CERTIFICATION' | 'PROCESS' | 'REPORTING' | 'AUDIT';
  description: string;
  mandatory: boolean;
  dueDate?: Date;
  responsibleParty: 'CONTRACTOR' | 'CONTRACTING_OFFICER' | 'AGENCY' | 'BOTH';
  validationCriteria: string[];
  exemptions?: string[];
}

export interface ComplianceCheck {
  id: string;
  contractId: string;
  regulationId: string;
  requirementId: string;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING' | 'WAIVED' | 'NOT_APPLICABLE';
  checkDate: Date;
  checkedBy: string;
  findings?: string;
  correctionActions?: string[];
  nextReviewDate?: Date;
  evidence: ComplianceEvidence[];
}

export interface ComplianceEvidence {
  id: string;
  evidenceType: 'DOCUMENT' | 'CERTIFICATION' | 'AUDIT_REPORT' | 'ATTESTATION';
  fileName: string;
  uploadDate: Date;
  uploadedBy: string;
  verifiedBy?: string;
  verificationDate?: Date;
  description: string;
}

export interface FederalContractingRequirement {
  id: string;
  contractType: 'FIXED_PRICE' | 'COST_REIMBURSEMENT' | 'TIME_AND_MATERIALS' | 'INDEFINITE_DELIVERY';
  dollarThreshold: number;
  competitionType: 'FULL_AND_OPEN' | 'LIMITED_SOURCES' | 'SOLE_SOURCE' | 'SMALL_BUSINESS_SET_ASIDE';
  requiredClauses: string[];
  requiredCertifications: string[];
  approvalLevels: ApprovalLevel[];
  socioeconomicRequirements: SocioeconomicRequirement[];
}

export interface ApprovalLevel {
  threshold: number;
  approverRole: 'CONTRACTING_OFFICER' | 'SENIOR_CONTRACTING_OFFICIAL' | 'HCA' | 'SPE';
  requiredCertifications: string[];
  delegationLimits?: number;
}

export interface SocioeconomicRequirement {
  type: 'SMALL_BUSINESS' | 'WOMAN_OWNED' | 'VETERAN_OWNED' | 'HUB_ZONE' | '8A_PROGRAM' | 'SDVO';
  percentage?: number;
  mandatory: boolean;
  applicableContracts: string[];
}

export interface FARAuditTrail {
  id: string;
  contractId: string;
  action: string;
  performedBy: string;
  performedDate: Date;
  regulatoryJustification: string;
  impactAssessment: string;
  approvalRequired: boolean;
  approvedBy?: string;
  approvalDate?: Date;
}