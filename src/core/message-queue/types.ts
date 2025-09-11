/**
 * Message Queue Types
 * Comprehensive type definitions for enterprise message queue system
 */

import { Job, JobOptions, Queue, QueueOptions } from 'bull';

export interface MessageQueueConfig {
  redis: {
    host: string;
    port: number;
    password?: string;
    db?: number;
    family?: number;
    keyPrefix?: string;
    retryDelayOnFailover?: number;
    maxRetriesPerRequest?: number;
    lazyConnect?: boolean;
  };
  defaultJobOptions: JobOptions;
  monitoring: {
    enabled: boolean;
    metricsRetentionDays: number;
    alertThresholds: {
      queueDepth: number;
      processingTime: number;
      errorRate: number;
    };
  };
  deadLetterQueue: {
    enabled: boolean;
    maxRetries: number;
    retentionDays: number;
  };
  clustering: {
    enabled: boolean;
    workers: number;
    concurrency: number;
  };
}

export interface QueueDefinition {
  name: string;
  concurrency: number;
  processor: string | ProcessorFunction;
  options?: QueueOptions;
  jobOptions?: JobOptions;
  priority?: number;
  rateLimit?: {
    max: number;
    duration: number;
  };
}

export interface MessagePayload {
  id: string;
  type: string;
  data: any;
  metadata: {
    source: string;
    correlationId?: string;
    userId?: string;
    timestamp: Date;
    version: string;
    priority: MessagePriority;
  };
  routing?: {
    targetQueue?: string;
    deadLetterQueue?: string;
    retryQueue?: string;
  };
  compliance?: {
    dataClassification: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
    auditRequired: boolean;
    encryptionRequired: boolean;
    retentionPeriodDays: number;
  };
}

export enum MessagePriority {
  CRITICAL = 1,
  HIGH = 2,
  NORMAL = 3,
  LOW = 4,
  BULK = 5,
}

export enum QueueType {
  INTEGRATION = 'integration',
  FINANCIAL = 'financial',
  HR = 'hr',
  CRM = 'crm',
  SCM = 'scm',
  PROJECT = 'project',
  MANUFACTURING = 'manufacturing',
  PROCUREMENT = 'procurement',
  ORDER = 'order',
  INVENTORY = 'inventory',
  QUALITY = 'quality',
  SERVICE = 'service',
  SERVICE_COMMAND_CENTER = 'service-command-center',
  MAINTENANCE = 'maintenance',
  RISK = 'risk',
  COMPLIANCE = 'compliance',
  DOCUMENT = 'document',
  WORKFLOW = 'workflow',
  AUDIT = 'audit',
  NOTIFICATION = 'notification',
  REPORTING = 'reporting',
  ANALYTICS = 'analytics',
  SYSTEM = 'system',
}

export interface ProcessorFunction {
  (job: Job<MessagePayload>): Promise<any>;
}

export interface QueueMetrics {
  name: string;
  active: number;
  waiting: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: boolean;
  throughput: {
    messagesPerSecond: number;
    averageProcessingTime: number;
    peakThroughput: number;
  };
  health: {
    status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
    lastHealthCheck: Date;
    consecutiveFailures: number;
  };
  performance: {
    cpuUsage: number;
    memoryUsage: number;
    redisConnections: number;
  };
}

export interface DeadLetterMessage {
  originalMessage: MessagePayload;
  failureReason: string;
  failureCount: number;
  firstFailureTime: Date;
  lastFailureTime: Date;
  stackTrace?: string;
  canRetry: boolean;
}

export interface QueueAlert {
  id: string;
  queueName: string;
  alertType:
    | 'QUEUE_DEPTH'
    | 'HIGH_ERROR_RATE'
    | 'PROCESSING_DELAY'
    | 'QUEUE_STALLED'
    | 'RESOURCE_EXHAUSTED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  details: Record<string, any>;
  triggeredAt: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  acknowledgedBy?: string;
}

export interface ScheduledMessage {
  id: string;
  message: MessagePayload;
  scheduleType: 'DELAY' | 'CRON' | 'INTERVAL';
  scheduleConfig: {
    delay?: number;
    cronExpression?: string;
    intervalMs?: number;
    repeatCount?: number;
    endDate?: Date;
  };
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  createdAt: Date;
  nextRunAt: Date;
}

export interface QueueProcessor {
  name: string;
  queueName: string;
  concurrency: number;
  processor: ProcessorFunction;
  options: {
    removeOnComplete?: number;
    removeOnFail?: number;
    attempts?: number;
    backoff?: {
      type: 'fixed' | 'exponential';
      delay: number;
    };
  };
}

export interface MessageBatch {
  id: string;
  messages: MessagePayload[];
  batchType: 'SEQUENTIAL' | 'PARALLEL' | 'PIPELINE';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'PARTIAL';
  completedCount: number;
  failedCount: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface QueueSecurity {
  authentication: {
    enabled: boolean;
    method: 'API_KEY' | 'JWT' | 'OAUTH2';
    credentials: Record<string, string>;
  };
  encryption: {
    atRest: boolean;
    inTransit: boolean;
    algorithm: string;
    keyRotationDays: number;
  };
  audit: {
    enabled: boolean;
    logAllOperations: boolean;
    retentionDays: number;
    complianceFrameworks: string[];
  };
  accessControl: {
    enabled: boolean;
    roles: string[];
    permissions: Record<string, string[]>;
  };
}
