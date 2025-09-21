/**
 * Enterprise-grade TypeScript interfaces to eliminate 'any' types
 * Comprehensive type definitions for business entities and operations
 */

// ============================================================================
// BASE AND UTILITY TYPES
// ============================================================================

export type UUID = string;
export type ISODateString = string;
export type EmailAddress = string;
export type PhoneNumber = string;
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD';
export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'zh' | 'ja';

export interface BaseEntity {
  id: UUID;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  createdBy: UUID;
  updatedBy: UUID;
  version: number;
  isDeleted?: boolean;
}

export interface AuditableEntity extends BaseEntity {
  auditTrail: AuditEntry[];
}

export interface AuditEntry {
  timestamp: ISODateString;
  userId: UUID;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'EXPORT';
  changes: Record<string, { from: any; to: any }>;
  ipAddress: string;
  userAgent: string;
}

// ============================================================================
// API AND REQUEST/RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  metadata?: {
    totalCount?: number;
    pageInfo?: PaginationInfo;
    executionTime?: number;
    correlationId?: string;
  };
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaginationRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterRequest {
  filters: FilterCriteria[];
  operator?: 'AND' | 'OR';
}

export interface FilterCriteria {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'startsWith' | 'endsWith';
  value: any;
}

// ============================================================================
// DATABASE AND REPOSITORY TYPES
// ============================================================================

export interface DatabaseConnection {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  connectionTimeout?: number;
  queryTimeout?: number;
  maxConnections?: number;
}

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
  executionTime: number;
  queryHash?: string;
}

export interface RepositoryOptions {
  transaction?: DatabaseTransaction;
  caching?: CacheOptions;
  auditing?: boolean;
}

export interface DatabaseTransaction {
  id: UUID;
  startedAt: ISODateString;
  isolationLevel: 'READ_UNCOMMITTED' | 'READ_COMMITTED' | 'REPEATABLE_READ' | 'SERIALIZABLE';
}

export interface CacheOptions {
  ttl?: number;
  key?: string;
  tags?: string[];
  compression?: boolean;
}

// ============================================================================
// BUSINESS ENTITY TYPES
// ============================================================================

export interface Customer extends AuditableEntity {
  customerNumber: string;
  companyName: string;
  contactPerson: ContactInformation;
  billingAddress: Address;
  shippingAddress?: Address;
  creditLimit: number;
  currency: CurrencyCode;
  paymentTerms: PaymentTerms;
  customerType: 'INDIVIDUAL' | 'BUSINESS' | 'GOVERNMENT' | 'NON_PROFIT';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PROSPECT';
  creditRating: CreditRating;
  accountManager: UUID;
  contracts: Contract[];
  salesHistory: SalesTransaction[];
}

export interface ContactInformation {
  firstName: string;
  lastName: string;
  title?: string;
  email: EmailAddress;
  phone: PhoneNumber;
  mobile?: PhoneNumber;
  fax?: PhoneNumber;
  preferredContact: 'EMAIL' | 'PHONE' | 'MOBILE';
  language: LanguageCode;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface PaymentTerms {
  code: string;
  description: string;
  daysNet: number;
  discountPercent?: number;
  discountDays?: number;
}

export interface CreditRating {
  score: number;
  rating: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC' | 'CC' | 'C' | 'D';
  assessedDate: ISODateString;
  assessedBy: string;
  notes?: string;
}

// ============================================================================
// FINANCIAL TYPES
// ============================================================================

export interface FinancialTransaction extends AuditableEntity {
  transactionNumber: string;
  transactionType: 'DEBIT' | 'CREDIT' | 'TRANSFER';
  amount: MonetaryAmount;
  fromAccount: UUID;
  toAccount: UUID;
  description: string;
  reference?: string;
  category: TransactionCategory;
  status: 'PENDING' | 'PROCESSED' | 'FAILED' | 'CANCELLED' | 'REVERSED';
  processedAt?: ISODateString;
  approvedBy?: UUID;
  batchId?: UUID;
  reconciliationStatus: 'PENDING' | 'RECONCILED' | 'EXCEPTION';
}

export interface MonetaryAmount {
  value: number;
  currency: CurrencyCode;
  exchangeRate?: number;
  baseCurrencyValue?: number;
}

export interface TransactionCategory {
  code: string;
  name: string;
  type: 'REVENUE' | 'EXPENSE' | 'ASSET' | 'LIABILITY' | 'EQUITY';
  taxCategory?: string;
}

export interface Account extends AuditableEntity {
  accountNumber: string;
  accountName: string;
  accountType: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  parentAccount?: UUID;
  balance: MonetaryAmount;
  isActive: boolean;
  allowPosting: boolean;
  taxReporting?: TaxReportingInfo;
}

export interface TaxReportingInfo {
  taxId: string;
  reportingCategory: string;
  isSubjectToTax: boolean;
  taxRate?: number;
}

// ============================================================================
// MANUFACTURING TYPES
// ============================================================================

export interface ProductionOrder extends AuditableEntity {
  orderNumber: string;
  productId: UUID;
  quantity: number;
  unitOfMeasure: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PLANNED' | 'RELEASED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD';
  scheduledStartDate: ISODateString;
  scheduledEndDate: ISODateString;
  actualStartDate?: ISODateString;
  actualEndDate?: ISODateString;
  workCenter: UUID;
  billOfMaterials: BillOfMaterialsItem[];
  routing: RoutingOperation[];
  qualityPlan: QualityPlan;
  costEstimate: ProductionCostEstimate;
}

export interface BillOfMaterialsItem {
  itemId: UUID;
  quantity: number;
  unitOfMeasure: string;
  componentType: 'RAW_MATERIAL' | 'SUB_ASSEMBLY' | 'FINISHED_GOOD';
  scrapPercentage: number;
  substitutions?: UUID[];
}

export interface RoutingOperation {
  operationNumber: number;
  workCenter: UUID;
  description: string;
  setupTime: number;
  runTime: number;
  machineTime: number;
  laborTime: number;
  dependencies: number[];
}

export interface QualityPlan {
  planId: UUID;
  inspectionPoints: QualityInspectionPoint[];
  acceptanceCriteria: QualityAcceptanceCriteria[];
  samplingPlan: SamplingPlan;
}

export interface QualityInspectionPoint {
  stepNumber: number;
  inspectionType: 'VISUAL' | 'MEASUREMENT' | 'FUNCTIONAL' | 'DESTRUCTIVE';
  characteristic: string;
  tolerance: ToleranceSpec;
  frequency: 'FIRST_PIECE' | 'LAST_PIECE' | 'RANDOM' | 'ALL_PIECES';
}

export interface ToleranceSpec {
  nominal: number;
  upperLimit: number;
  lowerLimit: number;
  unitOfMeasure: string;
}

export interface QualityAcceptanceCriteria {
  characteristic: string;
  acceptableQualityLevel: number;
  rejectQualityLevel: number;
}

export interface SamplingPlan {
  sampleSize: number;
  acceptanceNumber: number;
  rejectionNumber: number;
  inspectionLevel: 'I' | 'II' | 'III';
}

// ============================================================================
// HUMAN RESOURCES TYPES
// ============================================================================

export interface Employee extends AuditableEntity {
  employeeNumber: string;
  personalInfo: PersonalInformation;
  contactInfo: ContactInformation;
  employmentInfo: EmploymentInformation;
  compensationInfo: CompensationInformation;
  performanceHistory: PerformanceReview[];
  skills: EmployeeSkill[];
  certifications: Certification[];
  trainingRecords: TrainingRecord[];
}

export interface PersonalInformation {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: ISODateString;
  gender: 'M' | 'F' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  nationality: string;
  socialSecurityNumber?: string;
  emergencyContact: EmergencyContact;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: PhoneNumber;
  alternatePhone?: PhoneNumber;
  address: Address;
}

export interface EmploymentInformation {
  hireDate: ISODateString;
  terminationDate?: ISODateString;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMP' | 'INTERN';
  employmentStatus: 'ACTIVE' | 'INACTIVE' | 'TERMINATED' | 'ON_LEAVE' | 'SUSPENDED';
  department: UUID;
  position: UUID;
  reportingManager: UUID;
  workLocation: UUID;
  costCenter: string;
}

export interface CompensationInformation {
  baseSalary: MonetaryAmount;
  payFrequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'ANNUALLY';
  overtime: OvertimeRules;
  benefits: BenefitPlan[];
  bonusEligible: boolean;
  equityParticipation?: EquityPlan;
}

export interface OvertimeRules {
  isEligible: boolean;
  rate: number;
  threshold: number;
  timeUnit: 'HOURS' | 'DAYS';
}

export interface BenefitPlan {
  planId: UUID;
  planType: 'HEALTH' | 'DENTAL' | 'VISION' | 'RETIREMENT' | 'DISABILITY' | 'LIFE';
  enrollmentStatus: 'ENROLLED' | 'DECLINED' | 'PENDING';
  effectiveDate: ISODateString;
  premium: MonetaryAmount;
  employerContribution: number;
}

// ============================================================================
// WORKFLOW AND PROCESS TYPES
// ============================================================================

export interface WorkflowDefinition extends BaseEntity {
  name: string;
  description: string;
  version: string;
  category: string;
  status: 'DRAFT' | 'ACTIVE' | 'DEPRECATED' | 'ARCHIVED';
  triggerEvents: TriggerEvent[];
  steps: WorkflowStep[];
  variables: WorkflowVariable[];
  permissions: WorkflowPermission[];
}

export interface TriggerEvent {
  eventType: string;
  conditions: WorkflowCondition[];
  parameters: Record<string, any>;
}

export interface WorkflowStep {
  stepId: string;
  stepType: 'HUMAN_TASK' | 'SYSTEM_TASK' | 'DECISION' | 'PARALLEL' | 'LOOP' | 'SUBPROCESS';
  name: string;
  description: string;
  assignmentRules: AssignmentRule[];
  preconditions: WorkflowCondition[];
  postconditions: WorkflowCondition[];
  timeoutSettings: TimeoutSettings;
  nextSteps: string[];
}

export interface WorkflowCondition {
  field: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS' | 'IN' | 'EXISTS';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface AssignmentRule {
  type: 'USER' | 'ROLE' | 'POOL' | 'EXPRESSION';
  value: string;
  priority: number;
}

export interface TimeoutSettings {
  duration: number;
  unit: 'MINUTES' | 'HOURS' | 'DAYS';
  escalationAction: 'REASSIGN' | 'NOTIFY' | 'COMPLETE' | 'CANCEL';
}

export interface WorkflowInstance extends BaseEntity {
  workflowDefinitionId: UUID;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'SUSPENDED';
  currentStep: string;
  initiatedBy: UUID;
  businessKey: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  variables: Record<string, any>;
  stepHistory: WorkflowStepExecution[];
}

export interface WorkflowStepExecution {
  stepId: string;
  startTime: ISODateString;
  endTime?: ISODateString;
  assignedTo?: UUID;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
  outcome?: any;
  comments?: string;
}

// ============================================================================
// INTEGRATION AND MESSAGING TYPES
// ============================================================================

export interface IntegrationEndpoint extends BaseEntity {
  name: string;
  description: string;
  endpointType: 'REST' | 'SOAP' | 'GRAPHQL' | 'MESSAGE_QUEUE' | 'DATABASE' | 'FILE';
  url: string;
  authentication: AuthenticationConfig;
  headers: Record<string, string>;
  requestFormat: 'JSON' | 'XML' | 'CSV' | 'FORM_DATA';
  responseFormat: 'JSON' | 'XML' | 'CSV' | 'TEXT';
  timeout: number;
  retryPolicy: RetryPolicy;
  healthCheck: HealthCheckConfig;
}

export interface AuthenticationConfig {
  type: 'NONE' | 'BASIC' | 'BEARER_TOKEN' | 'API_KEY' | 'OAUTH2' | 'CERTIFICATE';
  credentials: Record<string, string>;
  tokenEndpoint?: string;
  refreshToken?: string;
}

export interface RetryPolicy {
  maxAttempts: number;
  backoffStrategy: 'FIXED' | 'LINEAR' | 'EXPONENTIAL';
  baseDelay: number;
  maxDelay: number;
  retryableErrors: string[];
}

export interface HealthCheckConfig {
  enabled: boolean;
  interval: number;
  timeout: number;
  endpoint?: string;
  expectedResponse?: any;
}

// ============================================================================
// REPORTING AND ANALYTICS TYPES
// ============================================================================

export interface ReportDefinition extends BaseEntity {
  name: string;
  description: string;
  category: string;
  reportType: 'TABULAR' | 'CHART' | 'DASHBOARD' | 'CROSSTAB' | 'SUBREPORT';
  dataSource: DataSourceConfig;
  parameters: ReportParameter[];
  columns: ReportColumn[];
  filters: ReportFilter[];
  sorting: SortingRule[];
  formatting: ReportFormatting;
  schedule?: ReportSchedule;
}

export interface DataSourceConfig {
  type: 'DATABASE' | 'API' | 'FILE' | 'CACHE';
  connectionInfo: Record<string, any>;
  query: string;
  refreshInterval?: number;
}

export interface ReportParameter {
  name: string;
  label: string;
  type: 'STRING' | 'NUMBER' | 'DATE' | 'BOOLEAN' | 'LIST';
  required: boolean;
  defaultValue?: any;
  validValues?: any[];
}

export interface ReportColumn {
  name: string;
  label: string;
  dataType: 'STRING' | 'NUMBER' | 'DATE' | 'BOOLEAN' | 'CURRENCY';
  width?: number;
  alignment: 'LEFT' | 'CENTER' | 'RIGHT';
  formatting?: ColumnFormatting;
  aggregation?: 'SUM' | 'COUNT' | 'AVG' | 'MIN' | 'MAX';
}

export interface ColumnFormatting {
  pattern?: string;
  prefix?: string;
  suffix?: string;
  decimalPlaces?: number;
  thousandsSeparator?: boolean;
}

export interface ReportFilter {
  column: string;
  operator: FilterCriteria['operator'];
  value: any;
  userConfigurable: boolean;
}

export interface SortingRule {
  column: string;
  direction: 'ASC' | 'DESC';
  priority: number;
}

export interface ReportFormatting {
  pageSize: 'A4' | 'LETTER' | 'LEGAL' | 'A3';
  orientation: 'PORTRAIT' | 'LANDSCAPE';
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  header?: string;
  footer?: string;
  showPageNumbers: boolean;
}

export interface ReportSchedule {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  startDate: ISODateString;
  endDate?: ISODateString;
  recipients: EmailAddress[];
  format: 'PDF' | 'EXCEL' | 'CSV' | 'HTML';
}

// ============================================================================
// GENERIC REPOSITORY AND SERVICE INTERFACES
// ============================================================================

export interface Repository<T extends BaseEntity> {
  findById(id: UUID, options?: RepositoryOptions): Promise<T | null>;
  findAll(filter?: FilterRequest, pagination?: PaginationRequest, options?: RepositoryOptions): Promise<QueryResult<T>>;
  create(entity: Omit<T, keyof BaseEntity>, options?: RepositoryOptions): Promise<T>;
  update(id: UUID, updates: Partial<T>, options?: RepositoryOptions): Promise<T>;
  delete(id: UUID, options?: RepositoryOptions): Promise<void>;
  exists(id: UUID, options?: RepositoryOptions): Promise<boolean>;
  count(filter?: FilterRequest, options?: RepositoryOptions): Promise<number>;
}

export interface Service<T extends BaseEntity> {
  get(id: UUID): Promise<ApiResponse<T>>;
  list(filter?: FilterRequest, pagination?: PaginationRequest): Promise<ApiResponse<T[]>>;
  create(data: Omit<T, keyof BaseEntity>): Promise<ApiResponse<T>>;
  update(id: UUID, data: Partial<T>): Promise<ApiResponse<T>>;
  delete(id: UUID): Promise<ApiResponse<void>>;
  validate(data: Partial<T>): Promise<ValidationResult>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
  value?: any;
}

// ============================================================================
// UTILITY TYPE HELPERS
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type EntityUpdate<T extends BaseEntity> = Omit<Partial<T>, keyof BaseEntity | 'id'>;

export type EntityCreate<T extends BaseEntity> = Omit<T, keyof BaseEntity>;

export type SearchableFields<T> = {
  [K in keyof T]: T[K] extends string | number ? K : never;
}[keyof T];

export type SortableFields<T> = {
  [K in keyof T]: T[K] extends string | number | Date ? K : never;
}[keyof T];

// ============================================================================
// DOMAIN-SPECIFIC TYPE UNIONS
// ============================================================================

export type BusinessEntity = Customer | Employee | ProductionOrder | FinancialTransaction | Account;

export type WorkflowEntity = WorkflowDefinition | WorkflowInstance;

export type IntegrationEntity = IntegrationEndpoint;

export type ReportingEntity = ReportDefinition;

export type AnyEntity = BusinessEntity | WorkflowEntity | IntegrationEntity | ReportingEntity;

// ============================================================================
// MODULE EXPORTS
// ============================================================================

export * from './business-constants';

export default {
  // Types
  ApiResponse,
  BaseEntity,
  AuditableEntity,
  
  // Business entities
  Customer,
  Employee, 
  ProductionOrder,
  FinancialTransaction,
  Account,
  
  // Workflow
  WorkflowDefinition,
  WorkflowInstance,
  
  // Integration
  IntegrationEndpoint,
  
  // Reporting
  ReportDefinition,
  
  // Interfaces
  Repository,
  Service,
};