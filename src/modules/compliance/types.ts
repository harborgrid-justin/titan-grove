/**
 * Compliance Management Module Types
 * Core interfaces and types for regulatory compliance and audit management
 */

// Core Compliance Types
export interface ComplianceEntity {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'COMPLETED';
  createdDate: Date;
  modifiedDate: Date;
  createdBy: string;
  modifiedBy: string;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  code: string;
  description: string;
  type: 'REGULATORY' | 'INDUSTRY' | 'INTERNAL' | 'INTERNATIONAL';
  status: 'ACTIVE' | 'DEPRECATED' | 'DRAFT';
  version: string;
  effectiveDate: Date;
  requirements: ComplianceRequirement[];
  createdDate: Date;
  modifiedDate: Date;
}

export interface ComplianceRequirement {
  id: string;
  frameworkId: string;
  requirementNumber: string;
  title: string;
  description: string;
  category: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  controlType: 'PREVENTIVE' | 'DETECTIVE' | 'CORRECTIVE';
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY' | 'AD_HOC';
  owner: string;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIALLY_COMPLIANT' | 'NOT_APPLICABLE';
  lastAssessmentDate?: Date;
  nextAssessmentDate: Date;
  evidence: ComplianceEvidence[];
}

export interface ComplianceEvidence {
  id: string;
  requirementId: string;
  type: 'DOCUMENT' | 'SCREENSHOT' | 'LOG' | 'CERTIFICATION' | 'ATTESTATION';
  title: string;
  description: string;
  filePath?: string;
  url?: string;
  collectedDate: Date;
  collectedBy: string;
  status: 'VALID' | 'EXPIRED' | 'UNDER_REVIEW' | 'REJECTED';
  expirationDate?: Date;
}

export interface ComplianceAssessment {
  id: string;
  frameworkId: string;
  assessmentName: string;
  type: 'INTERNAL' | 'EXTERNAL' | 'SELF_ASSESSMENT' | 'THIRD_PARTY';
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startDate: Date;
  endDate: Date;
  assessor: string;
  scope: string;
  findings: ComplianceFinding[];
  overallRating: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIALLY_COMPLIANT';
  reportPath?: string;
}

export interface ComplianceFinding {
  id: string;
  assessmentId: string;
  requirementId: string;
  type: 'DEFICIENCY' | 'OBSERVATION' | 'BEST_PRACTICE' | 'RECOMMENDATION';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';
  title: string;
  description: string;
  impact: string;
  recommendation: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'ACCEPTED_RISK' | 'DEFERRED';
  assignedTo: string;
  dueDate: Date;
  remediation?: ComplianceRemediation;
}

export interface ComplianceRemediation {
  id: string;
  findingId: string;
  remediationPlan: string;
  assignedTo: string;
  startDate: Date;
  targetDate: Date;
  actualCompletionDate?: Date;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  progress: number;
  comments: string;
}

export interface CompliancePolicy {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  status: 'DRAFT' | 'ACTIVE' | 'UNDER_REVIEW' | 'DEPRECATED';
  approvedBy: string;
  approvedDate: Date;
  effectiveDate: Date;
  reviewDate: Date;
  content: string;
  relatedFrameworks: string[];
}

export interface ComplianceAudit {
  id: string;
  auditName: string;
  type: 'INTERNAL' | 'EXTERNAL' | 'REGULATORY' | 'CUSTOMER';
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  auditor: string;
  auditScope: string;
  startDate: Date;
  endDate: Date;
  frameworks: string[];
  checklistItems: ComplianceChecklistItem[];
  finalReport?: string;
  recommendations: string[];
}

export interface ComplianceChecklistItem {
  id: string;
  auditId: string;
  itemNumber: string;
  description: string;
  category: string;
  status: 'NOT_STARTED' | 'COMPLIANT' | 'NON_COMPLIANT' | 'NOT_APPLICABLE';
  evidence?: string;
  comments?: string;
  reviewedBy?: string;
  reviewedDate?: Date;
}

export interface ComplianceRisk {
  id: string;
  title: string;
  description: string;
  category: string;
  probability: 'LOW' | 'MEDIUM' | 'HIGH';
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  owner: string;
  mitigationStrategy: string;
  status: 'IDENTIFIED' | 'ASSESSED' | 'MITIGATED' | 'MONITORED' | 'CLOSED';
  relatedRequirements: string[];
}

export interface ComplianceTraining {
  id: string;
  title: string;
  description: string;
  type: 'ONLINE' | 'CLASSROOM' | 'WORKSHOP' | 'CERTIFICATION';
  duration: number;
  frequency: 'ONCE' | 'ANNUAL' | 'BIANNUAL' | 'QUARTERLY';
  requiredForRoles: string[];
  relatedFrameworks: string[];
  completions: TrainingCompletion[];
}

export interface TrainingCompletion {
  id: string;
  trainingId: string;
  employeeId: string;
  completionDate: Date;
  score?: number;
  certificateUrl?: string;
  expirationDate?: Date;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'EXPIRED' | 'OVERDUE';
}
