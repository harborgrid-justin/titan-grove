/**
 * Procure-to-Pay Integration Types
 * Type definitions for the procure-to-pay process integration
 */

export interface ProcureToPayProcess {
  id: string;
  processType:
    | 'STANDARD_PROCUREMENT'
    | 'SIMPLIFIED_ACQUISITION'
    | 'EMERGENCY_PROCUREMENT'
    | 'BLANKET_PURCHASE';
  initiatedBy: string;
  initiationDate: Date;
  currentStage: ProcessStage;
  stages: ProcessStage[];
  totalValue: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'INITIATED' | 'IN_PROGRESS' | 'APPROVED' | 'EXECUTED' | 'COMPLETED' | 'CANCELLED';
  integrationPoints: IntegrationPoint[];
  auditTrail: ProcessAuditEvent[];
}

export interface ProcessStage {
  stageId: string;
  stageName: string;
  stageType: 'REQUISITION' | 'SOURCING' | 'CONTRACTING' | 'RECEIVING' | 'INVOICING' | 'PAYMENT';
  sequence: number;
  startDate?: Date;
  endDate?: Date;
  duration?: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED' | 'SKIPPED';
  assignedTo: string[];
  requiredDocuments: string[];
  systemIntegrations: string[];
  automationLevel: 'MANUAL' | 'SEMI_AUTOMATED' | 'FULLY_AUTOMATED';
}

export interface IntegrationPoint {
  integrationId: string;
  systemName: string;
  integrationType: 'REAL_TIME' | 'BATCH' | 'EVENT_DRIVEN' | 'MANUAL';
  dataExchanged: string[];
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'SYNCING';
  lastSyncTime?: Date;
  errorDetails?: string;
}

export interface ProcessAuditEvent {
  eventId: string;
  eventType:
    | 'STAGE_TRANSITION'
    | 'APPROVAL'
    | 'REJECTION'
    | 'MODIFICATION'
    | 'SYSTEM_INTEGRATION'
    | 'ERROR';
  timestamp: Date;
  userId: string;
  description: string;
  systemSource: string;
  dataChanged: any;
  complianceImpact: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface Requisition {
  id: string;
  requisitionNumber: string;
  requestorId: string;
  organizationCode: string;
  requestDate: Date;
  requiredDate: Date;
  priority: 'ROUTINE' | 'URGENT' | 'EMERGENCY';
  items: RequisitionItem[];
  totalAmount: number;
  budgetSource: string;
  justification: string;
  approvals: RequisitionApproval[];
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CONVERTED_TO_PO';
}

export interface RequisitionItem {
  itemId: string;
  description: string;
  quantity: number;
  unitOfMeasure: string;
  unitPrice: number;
  totalPrice: number;
  categoryCode: string;
  specifications: string;
  suggestedSupplier?: string;
  accountCode: string;
}

export interface RequisitionApproval {
  approvalId: string;
  approverLevel: number;
  approverId: string;
  approverRole: string;
  approvalDate?: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DELEGATED';
  comments?: string;
  delegatedTo?: string;
}

export interface SourcingEvent {
  id: string;
  eventType: 'RFQ' | 'RFP' | 'IFB' | 'AUCTION' | 'NEGOTIATION';
  eventNumber: string;
  title: string;
  description: string;
  requisitionIds: string[];
  publishDate: Date;
  responseDeadline: Date;
  evaluationCriteria: EvaluationCriteria[];
  invitedSuppliers: string[];
  responses: SupplierResponse[];
  selectedResponse?: string;
  awardDate?: Date;
  status: 'DRAFT' | 'PUBLISHED' | 'RESPONSE_PERIOD' | 'EVALUATION' | 'AWARDED' | 'CANCELLED';
}

export interface EvaluationCriteria {
  criteriaId: string;
  criteriaName: string;
  weight: number;
  type: 'PRICE' | 'TECHNICAL' | 'PAST_PERFORMANCE' | 'DELIVERY' | 'COMPLIANCE';
  passFail: boolean;
  description: string;
}

export interface SupplierResponse {
  responseId: string;
  supplierId: string;
  supplierName: string;
  submitDate: Date;
  totalPrice: number;
  lineItems: ResponseLineItem[];
  technicalProposal?: string;
  certifications: string[];
  evaluationScores: { [criteriaId: string]: number };
  overallScore?: number;
  ranking?: number;
}

export interface ResponseLineItem {
  itemId: string;
  unitPrice: number;
  leadTime: number;
  alternativeOffered: boolean;
  alternativeDescription?: string;
  compliance: boolean;
  exceptions?: string[];
}

export interface ContractExecution {
  id: string;
  contractId: string;
  requisitionIds: string[];
  sourcingEventId: string;
  supplierId: string;
  contractValue: number;
  deliverySchedule: DeliverySchedule[];
  paymentTerms: PaymentTerms;
  performanceMetrics: PerformanceMetric[];
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'BREACHED' | 'TERMINATED';
  signedDate?: Date;
  effectiveDate: Date;
  expirationDate: Date;
}

export interface DeliverySchedule {
  deliveryId: string;
  itemId: string;
  quantity: number;
  requestedDeliveryDate: Date;
  confirmedDeliveryDate?: Date;
  deliveryLocation: string;
  status: 'SCHEDULED' | 'IN_TRANSIT' | 'DELIVERED' | 'DELAYED';
}

export interface PaymentTerms {
  termsId: string;
  paymentMethod: 'NET_30' | 'NET_60' | 'NET_90' | 'IMMEDIATE' | 'MILESTONE_BASED';
  discountTerms?: string;
  penaltyTerms?: string;
  currencyCode: string;
  specialInstructions?: string;
}

export interface PerformanceMetric {
  metricId: string;
  metricName: string;
  targetValue: number;
  actualValue?: number;
  unit: string;
  measurementPeriod: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  status: 'ON_TARGET' | 'AT_RISK' | 'OFF_TARGET';
}

export interface ReceiptProcessing {
  id: string;
  receiptNumber: string;
  contractId: string;
  deliveryId: string;
  receivedBy: string;
  receivedDate: Date;
  receivedItems: ReceivedItem[];
  qualityInspection: QualityInspection;
  discrepancies: Discrepancy[];
  status: 'RECEIVED' | 'INSPECTED' | 'ACCEPTED' | 'REJECTED' | 'PARTIAL';
  notes?: string;
}

export interface ReceivedItem {
  itemId: string;
  quantityOrdered: number;
  quantityReceived: number;
  condition: 'NEW' | 'DAMAGED' | 'DEFECTIVE' | 'INCOMPLETE';
  serialNumbers?: string[];
  lotNumbers?: string[];
  acceptanceStatus: 'ACCEPTED' | 'REJECTED' | 'CONDITIONAL';
}

export interface QualityInspection {
  inspectionId: string;
  inspectorId: string;
  inspectionDate: Date;
  inspectionType: 'VISUAL' | 'FUNCTIONAL' | 'PERFORMANCE' | 'COMPLIANCE';
  inspectionResults: InspectionCheckpoint[];
  overallRating: 'PASS' | 'FAIL' | 'CONDITIONAL';
  certificationRequired: boolean;
  certificationProvided: boolean;
}

export interface InspectionCheckpoint {
  checkpointId: string;
  checkpointName: string;
  requirement: string;
  actualResult: string;
  status: 'PASS' | 'FAIL' | 'N_A';
}

export interface Discrepancy {
  discrepancyId: string;
  discrepancyType: 'QUANTITY' | 'QUALITY' | 'SPECIFICATION' | 'DELIVERY' | 'DOCUMENTATION';
  description: string;
  severity: 'MINOR' | 'MAJOR' | 'CRITICAL';
  reportedBy: string;
  reportedDate: Date;
  resolution?: string;
  resolvedBy?: string;
  resolvedDate?: Date;
  supplierNotified: boolean;
}

export interface PaymentProcessing {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  paymentAmount: number;
  paymentDate: Date;
  paymentMethod: 'ACH' | 'WIRE' | 'CHECK' | 'CARD' | 'EFT';
  paymentReference: string;
  bankAccount: string;
  approvals: PaymentApproval[];
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  transactionId?: string;
}

export interface PaymentApproval {
  approvalId: string;
  approverLevel: number;
  approverId: string;
  approverRole: string;
  approvalDate?: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DELEGATED';
  comments?: string;
  signatureRequired: boolean;
}

export interface InvoiceValidation {
  validationId: string;
  validationType: 'TWO_WAY_MATCH' | 'THREE_WAY_MATCH' | 'FOUR_WAY_MATCH';
  validationDate: Date;
  validatedBy: string;
  matchingResults: MatchingResult[];
  overallResult: 'MATCHED' | 'EXCEPTION' | 'VARIANCE';
  requiresManualReview: boolean;
  reviewComments?: string;
}

export interface MatchingResult {
  matchType: 'PRICE' | 'QUANTITY' | 'TERMS' | 'SPECIFICATIONS';
  contractValue: number;
  receiptValue: number;
  invoiceValue: number;
  matched: boolean;
  variance: number;
  toleranceExceeded: boolean;
}

export interface InvoiceLineItem {
  lineItemId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxAmount: number;
  accountCode: string;
  projectCode?: string;
}

export interface InvoiceApproval {
  approvalId: string;
  approverLevel: number;
  approverId: string;
  approverRole: string;
  approvalDate?: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DELEGATED';
  comments?: string;
  delegatedTo?: string;
}
