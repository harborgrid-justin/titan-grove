/**
 * Common interfaces and types for business rules and compliance services
 * Centralized type definitions to maximize reuse and consistency
 */

export enum ComplianceStatus {
  COMPLIANT = 'COMPLIANT',
  NON_COMPLIANT = 'NON_COMPLIANT',
  PENDING = 'PENDING',
  WAIVED = 'WAIVED',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
}

export enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum AlertType {
  COMPLIANCE = 'COMPLIANCE',
  PERFORMANCE = 'PERFORMANCE',
  COST = 'COST',
  SCHEDULE = 'SCHEDULE',
  SECURITY = 'SECURITY',
  OPERATIONAL = 'OPERATIONAL',
}

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
  version: number;
  metadata?: Record<string, any>;
}

export interface ComplianceRule extends BaseEntity {
  ruleType: string;
  name: string;
  description: string;
  regulationType: 'FAR' | 'DFARS' | 'AGENCY_SPECIFIC' | 'CFR' | 'USC' | 'DOD_FMR' | 'INTERNAL';
  regulationReference: string;
  effectiveDate: Date;
  expirationDate?: Date;
  isActive: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  scope: string[];
  validationCriteria: ValidationCriteria[];
  exemptions?: ExemptionCriteria[];
}

export interface ValidationCriteria {
  criteriaType: 'DOCUMENT' | 'CERTIFICATION' | 'PROCESS' | 'DATA' | 'THRESHOLD';
  field: string;
  operator:
    | 'EQUALS'
    | 'NOT_EQUALS'
    | 'GREATER_THAN'
    | 'LESS_THAN'
    | 'CONTAINS'
    | 'REGEX'
    | 'EXISTS';
  value: any;
  isRequired: boolean;
  errorMessage?: string;
}

export interface ExemptionCriteria {
  exemptionType: string;
  conditions: ValidationCriteria[];
  justification: string;
  approvalRequired: boolean;
  approverRole?: string;
}

export interface ComplianceCheck extends BaseEntity {
  entityId: string;
  entityType: string;
  ruleId: string;
  status: ComplianceStatus;
  checkDate: Date;
  checkedBy: string;
  findings?: ComplianceFinding[];
  evidence?: ComplianceEvidence[];
  correctiveActions?: CorrectiveAction[];
  nextReviewDate?: Date;
  exemptionApplied?: {
    exemptionId: string;
    justification: string;
    approvedBy: string;
    approvalDate: Date;
  };
}

export interface ComplianceFinding {
  findingType: 'VIOLATION' | 'WARNING' | 'RECOMMENDATION' | 'OBSERVATION';
  severity: AlertSeverity;
  description: string;
  recommendation?: string;
  regulation?: string;
  requiresAction: boolean;
  dueDate?: Date;
}

export interface ComplianceEvidence extends BaseEntity {
  checkId: string;
  evidenceType: 'DOCUMENT' | 'CERTIFICATION' | 'AUDIT_REPORT' | 'ATTESTATION' | 'DATA_EXTRACT';
  fileName?: string;
  contentHash?: string;
  uploadedBy: string;
  verifiedBy?: string;
  verificationDate?: Date;
  description: string;
  isValid: boolean;
  expirationDate?: Date;
}

export interface CorrectiveAction extends BaseEntity {
  checkId: string;
  actionType: 'IMMEDIATE' | 'PLANNED' | 'PREVENTIVE';
  description: string;
  assignedTo: string;
  dueDate: Date;
  priority: AlertSeverity;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'DEFERRED' | 'CANCELLED';
  completedDate?: Date;
  completionNotes?: string;
}

export interface SystemAlert extends BaseEntity {
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  entityId?: string;
  entityType?: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  resolutionNotes?: string;
  autoResolvable: boolean;
  escalationLevel: number;
}

export interface AuditTrail extends BaseEntity {
  entityId: string;
  entityType: string;
  action: string;
  performedBy: string;
  performedDate: Date;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  transactionId?: string;
  regulatoryContext?: string;
  businessJustification?: string;
}

export interface BusinessMetrics {
  metricId: string;
  metricType: 'COUNT' | 'PERCENTAGE' | 'AMOUNT' | 'DURATION' | 'RATIO';
  name: string;
  value: number;
  unit?: string;
  timestamp: Date;
  period: 'REAL_TIME' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  tags?: Record<string, string>;
  dimensions?: Record<string, string>;
}

export interface PerformanceMetrics {
  serviceHealth: ServiceHealthMetrics;
  businessMetrics: BusinessMetrics[];
  complianceMetrics: ComplianceMetrics;
  alertMetrics: AlertMetrics;
}

export interface ServiceHealthMetrics {
  serviceName: string;
  uptime: number;
  responseTime: {
    p50: number;
    p95: number;
    p99: number;
  };
  errorRate: number;
  throughput: number;
  memoryUsage: number;
  cpuUsage: number;
}

export interface ComplianceMetrics {
  totalRules: number;
  activeRules: number;
  complianceRate: number;
  criticalViolations: number;
  pendingChecks: number;
  overdueActions: number;
}

export interface AlertMetrics {
  totalAlerts: number;
  criticalAlerts: number;
  unacknowledgedAlerts: number;
  averageResolutionTime: number;
  alertsByType: Record<AlertType, number>;
  alertsBySeverity: Record<AlertSeverity, number>;
}

export interface PaginationRequest {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface FilterCriteria {
  field: string;
  operator:
    | 'EQUALS'
    | 'NOT_EQUALS'
    | 'IN'
    | 'NOT_IN'
    | 'CONTAINS'
    | 'STARTS_WITH'
    | 'ENDS_WITH'
    | 'BETWEEN'
    | 'IS_NULL'
    | 'IS_NOT_NULL';
  value: any;
  values?: any[];
}

export interface SearchRequest extends PaginationRequest {
  query?: string;
  filters?: FilterCriteria[];
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

export type ServiceResponse<T> =
  | {
      success: true;
      data: T;
      timestamp: Date;
      correlationId?: string;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
        details?: Record<string, any>;
      };
      timestamp: Date;
      correlationId?: string;
    };

export interface CacheConfig {
  ttl?: number;
  maxSize?: number;
  keyPrefix?: string;
}

export interface ServiceOperation<TInput, TOutput> {
  name: string;
  description?: string;
  inputSchema?: any;
  outputSchema?: any;
  cacheConfig?: CacheConfig;
  rateLimit?: {
    requests: number;
    windowMs: number;
  };
  requiresAuth?: boolean;
  requiredPermissions?: string[];
}
