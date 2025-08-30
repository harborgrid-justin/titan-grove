/**
 * Integration Management Module Types
 * Core interfaces and types for system integration and data synchronization
 */

// Core Integration Types (extending the existing types)
export interface IntegrationEndpoint {
  id: string;
  name: string;
  description: string;
  type: 'REST_API' | 'SOAP' | 'DATABASE' | 'FILE' | 'MESSAGE_QUEUE' | 'WEBHOOK';
  url: string;
  authentication: EndpointAuth;
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'TESTING';
  connectionTimeout: number;
  retryAttempts: number;
  connectionRetries: number;
  healthCheckUrl?: string;
  createdDate: Date;
  lastHealthCheck?: Date;
  metadata: Record<string, any>;
}

export interface EndpointAuth {
  type: 'NONE' | 'BASIC' | 'BEARER_TOKEN' | 'API_KEY' | 'OAUTH2' | 'CERTIFICATE';
  credentials: Record<string, string>;
  tokenRefreshUrl?: string;
  expirationDate?: Date;
}

export interface DataMapping {
  id: string;
  mappingName: string;
  sourceEndpointId: string;
  targetEndpointId: string;
  sourceSchema: string;
  targetSchema: string;
  fieldMappings: FieldMapping[];
  transformationRules: TransformationRule[];
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  createdDate: Date;
  validationRules: ValidationRule[];
}

export interface FieldMapping {
  sourceField: string;
  targetField: string;
  dataType: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'DATE' | 'OBJECT';
  required: boolean;
  defaultValue?: any;
  transformation?: string;
}

export interface TransformationRule {
  ruleId: string;
  ruleName: string;
  ruleType: 'FORMAT' | 'CALCULATE' | 'LOOKUP' | 'CONDITIONAL';
  expression: string;
  parameters?: Record<string, any>;
}

export interface ValidationRule {
  ruleId: string;
  field: string;
  ruleType: 'REQUIRED' | 'FORMAT' | 'RANGE' | 'CUSTOM';
  parameters: Record<string, any>;
  errorMessage: string;
}

export interface IntegrationJob {
  id: string;
  name: string;
  description: string;
  type: 'EXTRACT' | 'TRANSFORM' | 'LOAD' | 'SYNC' | 'BATCH' | 'REAL_TIME';
  mappingId: string;
  schedule: JobSchedule;
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'RUNNING';
  lastExecution?: Date;
  nextExecution?: Date;
  executionHistory: JobExecution[];
  errorHandling: ErrorHandlingConfig;
  createdDate: Date;
}

export interface JobSchedule {
  type: 'ONE_TIME' | 'RECURRING' | 'EVENT_DRIVEN';
  cronExpression?: string;
  interval?: number;
  intervalUnit?: 'MINUTES' | 'HOURS' | 'DAYS';
  startDate: Date;
  endDate?: Date;
  timeZone: string;
  enabled: boolean;
}

export interface JobExecution {
  id: string;
  jobId: string;
  startTime: Date;
  endTime?: Date;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  recordsProcessed: number;
  recordsSuccessful: number;
  recordsFailed: number;
  duration?: number;
  errorMessage?: string;
  logs: ExecutionLog[];
}

export interface ExecutionLog {
  timestamp: Date;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  message: string;
  details?: Record<string, any>;
}

export interface ErrorHandlingConfig {
  maxRetries: number;
  retryDelay: number;
  continueOnError: boolean;
  notificationEmails: string[];
  escalationThreshold: number;
}

export interface DataQualityRule {
  id: string;
  name: string;
  description: string;
  ruleType: 'COMPLETENESS' | 'ACCURACY' | 'CONSISTENCY' | 'VALIDITY' | 'UNIQUENESS';
  sourceField: string;
  expression: string;
  threshold: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isActive: boolean;
}

export interface DataQualityReport {
  id: string;
  mappingId: string;
  reportDate: Date;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  qualityScore: number;
  ruleResults: QualityRuleResult[];
  issues: DataQualityIssue[];
}

export interface QualityRuleResult {
  ruleId: string;
  ruleName: string;
  passed: boolean;
  score: number;
  recordsAffected: number;
  details: string;
}

export interface DataQualityIssue {
  id: string;
  ruleId: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  recordId?: string;
  fieldName?: string;
  actualValue?: any;
  expectedValue?: any;
  detectedDate: Date;
  status: 'OPEN' | 'RESOLVED' | 'IGNORED';
}

export interface IntegrationMonitoring {
  endpointId: string;
  jobId?: string;
  metrics: {
    uptime: number;
    responseTime: number;
    throughput: number;
    errorRate: number;
    lastSuccessfulSync: Date;
  };
  alerts: IntegrationAlert[];
  timestamp: Date;
}

export interface IntegrationAlert {
  id: string;
  type: 'ENDPOINT_DOWN' | 'JOB_FAILED' | 'HIGH_ERROR_RATE' | 'PERFORMANCE_DEGRADED';
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  message: string;
  details: Record<string, any>;
  createdDate: Date;
  resolvedDate?: Date;
  acknowledgedBy?: string;
}

export interface APIRateLimit {
  endpointId: string;
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  currentUsage: {
    minute: number;
    hour: number;
    day: number;
  };
  resetTime: Date;
}

export interface IntegrationSecurity {
  encryptionEnabled: boolean;
  certificateValidation: boolean;
  ipWhitelist: string[];
  auditLogging: boolean;
  dataClassification: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
  complianceFrameworks: string[];
}