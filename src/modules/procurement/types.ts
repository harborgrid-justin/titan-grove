/**
 * Procurement Management Module Types
 * Core interfaces and types for procurement management system
 */

import {
  CommonStatus,
  AuditFields,
  Address,
  ContactInfo,
  Money,
  Attachment,
  ApprovalStatus,
  Priority,
  RiskLevel,
  PerformanceLevel,
} from '../../types/common';

// Re-export common types for convenience
export {
  CommonStatus,
  AuditFields,
  Address,
  ContactInfo,
  Money,
  Attachment,
  ApprovalStatus,
  Priority,
  RiskLevel,
  PerformanceLevel,
};

// Core Procurement Types
export interface ProcurementEntity extends AuditFields {
  id: string;
  name: string;
  description: string;
  status: CommonStatus;
}

// =============================================================================
// SUPPLIER MANAGEMENT TYPES
// =============================================================================

export interface Supplier extends AuditFields {
  id: string;
  supplierNumber: string;
  legalName: string;
  displayName: string;
  status: SupplierStatus;
  category: SupplierCategory;
  taxId: string;
  dunsNumber?: string;
  website?: string;
  yearEstablished?: number;
  employeeCount?: number;
  annualRevenue?: Money;

  // Contact Information
  primaryContact: SupplierContact;
  contacts: SupplierContact[];

  // Addresses
  businessAddress: SupplierAddress;
  addresses: SupplierAddress[];

  // Financial Information
  bankDetails: BankDetails[];
  taxInfo: TaxInfo;

  // Performance & Risk
  performanceRating: PerformanceLevel;
  riskRating: RiskLevel;
  creditRating?: string;

  // Certifications & Compliance
  certifications: SupplierCertification[];
  insurancePolicies: InsurancePolicy[];

  // Business Relationship
  preferredSupplier: boolean;
  approvedCategories: string[];
  contractTerms?: string;
  paymentTerms: string;
}

export enum SupplierStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  SUSPENDED = 'SUSPENDED',
  BLACKLISTED = 'BLACKLISTED',
}

export enum SupplierCategory {
  GOODS = 'GOODS',
  SERVICES = 'SERVICES',
  CONSTRUCTION = 'CONSTRUCTION',
  PROFESSIONAL_SERVICES = 'PROFESSIONAL_SERVICES',
  IT_SERVICES = 'IT_SERVICES',
  MAINTENANCE = 'MAINTENANCE',
  CONSULTING = 'CONSULTING',
}

export interface SupplierContact extends ContactInfo {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  isPrimary: boolean;
  department?: string;
}

export interface SupplierAddress extends Address {
  id: string;
  addressType: 'BUSINESS' | 'BILLING' | 'SHIPPING' | 'REMIT_TO';
  isPrimary: boolean;
}

export interface BankDetails {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  swiftCode?: string;
  iban?: string;
  currency: string;
  isPrimary: boolean;
}

export interface TaxInfo {
  taxId: string;
  taxIdType: 'EIN' | 'SSN' | 'VAT' | 'GST' | 'OTHER';
  vatNumber?: string;
  taxExempt: boolean;
  taxExemptionCertificate?: Attachment;
}

export interface SupplierCertification {
  id: string;
  certificationType: string;
  certificateNumber: string;
  issuingAuthority: string;
  issuedDate: Date;
  expirationDate: Date;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  certificate?: Attachment;
}

export interface InsurancePolicy {
  id: string;
  policyType: string;
  policyNumber: string;
  insuranceCompany: string;
  coverageAmount: Money;
  effectiveDate: Date;
  expirationDate: Date;
  status: 'ACTIVE' | 'EXPIRED';
  certificate?: Attachment;
}

// =============================================================================
// PURCHASE REQUISITION TYPES
// =============================================================================

export interface PurchaseRequisition extends AuditFields {
  id: string;
  requisitionNumber: string;
  title: string;
  description?: string;
  status: RequisitionStatus;
  priority: Priority;
  requestorId: string;
  departmentId: string;
  costCenterId?: string;
  budgetCode?: string;

  // Line Items
  lineItems: RequisitionLineItem[];

  // Totals
  subtotal: Money;
  tax: Money;
  total: Money;

  // Dates
  requestedDeliveryDate?: Date;

  // Approval
  approvals: ApprovalRecord[];
  currentApprovalLevel: number;

  // Justification
  businessJustification: string;
  attachments: Attachment[];
}

export enum RequisitionStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  CONVERTED_TO_PO = 'CONVERTED_TO_PO',
}

export interface RequisitionLineItem {
  id: string;
  lineNumber: number;
  itemNumber?: string;
  description: string;
  category: string;
  quantity: number;
  unitOfMeasure: string;
  unitPrice: Money;
  totalPrice: Money;
  requestedDeliveryDate?: Date;
  suggestedSupplier?: string;
  specifications?: string;
  attachments: Attachment[];
}

export interface ApprovalRecord extends ApprovalStatus {
  id: string;
  approverRole: string;
  delegatedFrom?: string;
}

// =============================================================================
// PURCHASE ORDER TYPES
// =============================================================================

export interface PurchaseOrder extends AuditFields {
  id: string;
  poNumber: string;
  title: string;
  description?: string;
  status: PurchaseOrderStatus;
  type: POType;

  // Supplier Information
  supplierId: string;
  supplierContact?: string;

  // Requestor Information
  requestorId: string;
  departmentId: string;
  costCenterId?: string;

  // Line Items
  lineItems: PurchaseOrderLineItem[];

  // Totals
  subtotal: Money;
  tax: Money;
  shipping: Money;
  discount: Money;
  total: Money;

  // Terms and Conditions
  paymentTerms: string;
  deliveryTerms: string;
  shippingMethod?: string;

  // Addresses
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;

  // Dates
  orderDate: Date;
  requestedDeliveryDate?: Date;
  promisedDeliveryDate?: Date;

  // Approval and Revisions
  approvals: ApprovalRecord[];
  revisions: PORevision[];

  // Attachments
  attachments: Attachment[];
}

export enum PurchaseOrderStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  SENT_TO_SUPPLIER = 'SENT_TO_SUPPLIER',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
  FULLY_RECEIVED = 'FULLY_RECEIVED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

export enum POType {
  STANDARD = 'STANDARD',
  BLANKET = 'BLANKET',
  CONTRACT = 'CONTRACT',
  PLANNED = 'PLANNED',
}

export interface PurchaseOrderLineItem {
  id: string;
  lineNumber: number;
  requisitionLineId?: string;
  itemNumber?: string;
  description: string;
  category: string;
  quantity: number;
  unitOfMeasure: string;
  unitPrice: Money;
  totalPrice: Money;
  taxAmount: Money;
  requestedDeliveryDate?: Date;
  promisedDeliveryDate?: Date;
  quantityReceived: number;
  quantityInvoiced: number;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  attachments: Attachment[];
}

export interface ShippingAddress extends Address {
  contactName?: string;
  contactPhone?: string;
  specialInstructions?: string;
}

export interface BillingAddress extends Address {
  contactName?: string;
  contactPhone?: string;
}

export interface PORevision {
  id: string;
  revisionNumber: number;
  revisionDate: Date;
  revisedBy: string;
  changes: ChangeRecord[];
  reason: string;
}

export interface ChangeRecord {
  field: string;
  oldValue: string;
  newValue: string;
  lineNumber?: number;
}

// =============================================================================
// RFQ (REQUEST FOR QUOTE) TYPES
// =============================================================================

export interface RFQ extends AuditFields {
  id: string;
  rfqNumber: string;
  title: string;
  description: string;
  status: RFQStatus;
  category: string;

  // Supplier Information
  invitedSuppliers: RFQSupplier[];

  // Line Items
  lineItems: RFQLineItem[];

  // Evaluation Criteria
  evaluationCriteria: EvaluationCriteria[];

  // Dates
  publishedDate?: Date;
  responseDeadline: Date;
  evaluationDate?: Date;
  awardDate?: Date;

  // Terms and Conditions
  termsAndConditions: string;
  paymentTerms: string;
  deliveryTerms: string;

  // Attachments
  attachments: Attachment[];

  // Responses
  responses: RFQResponse[];
}

export enum RFQStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  RESPONSE_PERIOD = 'RESPONSE_PERIOD',
  EVALUATION = 'EVALUATION',
  AWARDED = 'AWARDED',
  CANCELLED = 'CANCELLED',
}

export interface RFQSupplier {
  supplierId: string;
  invitedDate: Date;
  responseReceived: boolean;
  responseDate?: Date;
  notes?: string;
}

export interface RFQLineItem {
  id: string;
  lineNumber: number;
  itemNumber?: string;
  description: string;
  category: string;
  quantity: number;
  unitOfMeasure: string;
  specifications?: string;
  requestedDeliveryDate?: Date;
  attachments: Attachment[];
}

export interface RFQResponse extends AuditFields {
  id: string;
  rfqId: string;
  supplierId: string;
  submittedDate: Date;
  status: 'DRAFT' | 'SUBMITTED' | 'WITHDRAWN';

  // Response Line Items
  responseLineItems: RFQResponseLineItem[];

  // Alternative Proposals
  alternativeProposals: AlternativeProposal[];

  // Totals
  totalAmount: Money;

  // Terms
  paymentTerms?: string;
  deliveryTerms?: string;
  validityPeriod: number; // days

  // Additional Information
  comments?: string;
  attachments: Attachment[];
}

export interface RFQResponseLineItem {
  id: string;
  rfqLineItemId: string;
  unitPrice: Money;
  totalPrice: Money;
  promisedDeliveryDate?: Date;
  leadTime?: number; // days
  comments?: string;
  attachments: Attachment[];
}

export interface AlternativeProposal {
  id: string;
  title: string;
  description: string;
  totalAmount: Money;
  advantages: string[];
  considerations: string[];
  attachments: Attachment[];
}

export interface EvaluationCriteria {
  id: string;
  criteriaName: string;
  description: string;
  weight: number; // percentage
  type: 'PRICE' | 'TECHNICAL' | 'DELIVERY' | 'SERVICE' | 'QUALITY';
}

// =============================================================================
// CONTRACT MANAGEMENT TYPES
// =============================================================================

export interface Contract extends AuditFields {
  id: string;
  contractNumber: string;
  title: string;
  description?: string;
  status: ContractStatus;
  type: ContractType;

  // Parties
  supplierId: string;
  contractManager: string;

  // Contract Terms
  terms: ContractTerms;

  // Financial
  totalValue: Money;
  actualSpend: Money;
  remainingValue: Money;

  // Dates
  effectiveDate: Date;
  expirationDate: Date;
  noticePeriod: number; // days

  // Performance
  performance: ContractPerformance;

  // Amendments
  amendments: ContractAmendment[];

  // Attachments
  attachments: Attachment[];

  // Compliance
  complianceChecks: ComplianceCheck[];
}

export enum ContractStatus {
  DRAFT = 'DRAFT',
  UNDER_NEGOTIATION = 'UNDER_NEGOTIATION',
  PENDING_SIGNATURE = 'PENDING_SIGNATURE',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  TERMINATED = 'TERMINATED',
  CANCELLED = 'CANCELLED',
}

export enum ContractType {
  MASTER_AGREEMENT = 'MASTER_AGREEMENT',
  PURCHASE_AGREEMENT = 'PURCHASE_AGREEMENT',
  SERVICE_AGREEMENT = 'SERVICE_AGREEMENT',
  BLANKET_ORDER = 'BLANKET_ORDER',
  FRAMEWORK_AGREEMENT = 'FRAMEWORK_AGREEMENT',
}

export interface ContractTerms {
  paymentTerms: string;
  deliveryTerms: string;
  warrantyPeriod?: number; // days
  penaltyClause?: string;
  terminationClause: string;
  renewalOptions?: string;
  serviceLevel?: ServiceLevel[];
  customClauses: CustomClause[];
}

export interface ServiceLevel {
  id: string;
  metric: string;
  target: string;
  penalty?: string;
  measurement: string;
}

export interface CustomClause {
  id: string;
  clauseTitle: string;
  clauseText: string;
  category: string;
}

export interface ContractPerformance {
  overallRating: PerformanceLevel;
  deliveryPerformance: number; // percentage
  qualityRating: PerformanceLevel;
  costSavings: Money;
  issueCount: number;
  lastReviewDate: Date;
  nextReviewDate: Date;
}

export interface ContractAmendment extends AuditFields {
  id: string;
  amendmentNumber: number;
  title: string;
  description: string;
  effectiveDate: Date;
  changes: ChangeRecord[];
  attachments: Attachment[];
}

export interface ComplianceCheck {
  id: string;
  checkType: string;
  checkDate: Date;
  result: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING';
  findings?: string;
  remedialActions?: string;
}

// =============================================================================
// PROCUREMENT ANALYTICS TYPES
// =============================================================================

export interface ProcurementAnalytics {
  period: {
    startDate: Date;
    endDate: Date;
    periodType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  };

  // Spend Analytics
  totalSpend: Money;
  spendByCategory: CategorySpend[];
  spendBySupplier: SupplierSpend[];
  spendTrend: SpendTrend[];

  // Savings Analytics
  totalSavings: Money;
  savingsByCategory: CategorySavings[];
  savingsFromNegotiation: Money;
  savingsFromCompetition: Money;

  // Performance Metrics
  cycleTimeMetrics: CycleTimeMetrics;
  qualityMetrics: QualityMetrics;
  complianceMetrics: ComplianceMetrics;

  // Risk Analytics
  riskAnalytics: RiskAnalytics;
}

export interface CategorySpend {
  category: string;
  spend: Money;
  percentage: number;
  change: number; // percentage change from previous period
}

export interface SupplierSpend {
  supplierId: string;
  supplierName: string;
  spend: Money;
  percentage: number;
  transactionCount: number;
}

export interface SpendTrend {
  date: Date;
  amount: Money;
  category?: string;
}

export interface CategorySavings {
  category: string;
  savings: Money;
  percentage: number;
}

export interface CycleTimeMetrics {
  averageRequisitionToApproval: number; // days
  averagePOProcessingTime: number; // days
  averageRFQResponseTime: number; // days
  averageContractNegotiation: number; // days
}

export interface QualityMetrics {
  supplierDefectRate: number; // percentage
  onTimeDeliveryRate: number; // percentage
  orderAccuracyRate: number; // percentage
  supplierRatingAverage: number;
}

export interface ComplianceMetrics {
  policyComplianceRate: number; // percentage
  contractComplianceRate: number; // percentage
  auditFindingsCount: number;
  correctiveActionsOpen: number;
}

export interface RiskAnalytics {
  supplierRiskDistribution: SupplierRiskDistribution[];
  singleSourceRisk: SingleSourceRisk[];
  geographicRisk: GeographicRisk[];
  financialRisk: FinancialRisk[];
}

export interface SupplierRiskDistribution {
  riskLevel: RiskLevel;
  count: number;
  percentage: number;
  totalSpend: Money;
}

export interface SingleSourceRisk {
  category: string;
  supplierId: string;
  supplierName: string;
  riskLevel: RiskLevel;
  spend: Money;
  mitigation?: string;
}

export interface GeographicRisk {
  region: string;
  country: string;
  riskLevel: RiskLevel;
  supplierCount: number;
  totalSpend: Money;
}

export interface FinancialRisk {
  supplierId: string;
  supplierName: string;
  creditRating: string;
  riskLevel: RiskLevel;
  totalExposure: Money;
}

// =============================================================================
// SEARCH AND FILTERING TYPES
// =============================================================================

export interface SupplierSearchCriteria {
  name?: string;
  category?: SupplierCategory;
  status?: SupplierStatus;
  location?: string;
  minRevenue?: number;
  maxRevenue?: number;
  certifications?: string[];
  performanceRating?: PerformanceLevel;
  riskRating?: RiskLevel;
}

export interface ProcurementSearchCriteria {
  dateFrom?: Date;
  dateTo?: Date;
  status?: string;
  category?: string;
  supplierId?: string;
  requestorId?: string;
  departmentId?: string;
  minAmount?: number;
  maxAmount?: number;
}
