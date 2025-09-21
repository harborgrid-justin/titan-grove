/**
 * Business System Architecture
 * Handles internal business operations, back-office functions, and enterprise logic
 */

import { BaseService, ServiceContext, ServiceResult } from './service-layer';
import { Logger } from 'winston';
import { memoryLimits } from '../config';

export interface BusinessSystemConfig {
  enableAuditLog: boolean;
  enableWorkflowApproval: boolean;
  enableDataValidation: boolean;
  securityLevel: 'standard' | 'elevated' | 'maximum';
  complianceMode: boolean;
}

export interface BusinessOperation<TInput = any, TOutput = any> {
  operationId: string;
  category: 'financial' | 'hr' | 'operations' | 'manufacturing' | 'compliance';
  requiresApproval: boolean;
  securityLevel: 'standard' | 'elevated' | 'maximum';
  auditRequired: boolean;
  execute(input: TInput, context: ServiceContext): Promise<ServiceResult<TOutput>>;
}

export interface AuditLogEntry {
  timestamp: Date;
  operationId: string;
  userId?: string;
  tenantId?: string;
  category: string;
  action: string;
  inputData?: any;
  outputData?: any;
  success: boolean;
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
}

export class BusinessSystemService extends BaseService {
  private config: BusinessSystemConfig;
  private operations: Map<string, BusinessOperation> = new Map();
  private auditLog: AuditLogEntry[] = [];

  constructor(config: BusinessSystemConfig, logger: Logger) {
    super('BusinessSystem', logger);
    this.config = config;
  }

  /**
   * Register a business operation
   */
  registerOperation(operation: BusinessOperation): void {
    this.operations.set(operation.operationId, operation);
    this.logger.info(`Registered business operation: ${operation.operationId}`, {
      category: operation.category,
      requiresApproval: operation.requiresApproval,
      securityLevel: operation.securityLevel,
    });
  }

  /**
   * Execute a business operation with full business logic, audit, and security
   */
  async executeBusinessOperation<TInput, TOutput>(
    operationId: string,
    input: TInput,
    context: ServiceContext
  ): Promise<ServiceResult<TOutput>> {
    const operation = this.operations.get(operationId);
    if (!operation) {
      return {
        success: false,
        error: {
          code: 'OPERATION_NOT_FOUND',
          message: `Business operation ${operationId} not found`,
        },
      };
    }

    // Security check
    const securityCheck = this.validateSecurity(operation, context);
    if (!securityCheck.success) {
      return securityCheck;
    }

    // Compliance validation
    if (this.config.complianceMode) {
      const complianceCheck = this.validateCompliance(operation, input, context);
      if (!complianceCheck.success) {
        return complianceCheck;
      }
    }

    // Execute with audit logging
    return this.executeWithMetrics(async () => {
      const startTime = Date.now();

      try {
        const result = await operation.execute(input, context);

        // Log successful operation
        if (this.config.enableAuditLog && operation.auditRequired) {
          this.logAuditEntry({
            timestamp: new Date(),
            operationId,
            userId: context.userId,
            tenantId: context.tenantId,
            category: operation.category,
            action: 'EXECUTE',
            inputData: this.sanitizeForAudit(input),
            outputData: this.sanitizeForAudit(result.data),
            success: result.success,
            errorMessage: result.error?.message,
          });
        }

        return result.data;
      } catch (error) {
        // Log failed operation
        if (this.config.enableAuditLog && operation.auditRequired) {
          this.logAuditEntry({
            timestamp: new Date(),
            operationId,
            userId: context.userId,
            tenantId: context.tenantId,
            category: operation.category,
            action: 'EXECUTE',
            inputData: this.sanitizeForAudit(input),
            success: false,
            errorMessage: error instanceof Error ? (error as Error).message : String(error),
          });
        }
        throw error;
      }
    }, context);
  }

  /**
   * Validate security requirements
   */
  private validateSecurity(operation: BusinessOperation, context: ServiceContext): ServiceResult {
    // Check if user has required permissions
    if (!context.permissions || context.permissions.length === 0) {
      return {
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'User does not have required permissions',
        },
      };
    }

    // Check security level requirements
    const requiredPermission = `${operation.category}:${operation.securityLevel}`;
    if (operation.securityLevel === 'maximum' && !context.permissions.includes('admin')) {
      return {
        success: false,
        error: {
          code: 'INSUFFICIENT_SECURITY_LEVEL',
          message: 'Operation requires maximum security clearance',
        },
      };
    }

    return { success: true };
  }

  /**
   * Validate compliance requirements
   */
  private validateCompliance(
    operation: BusinessOperation,
    input: any,
    context: ServiceContext
  ): ServiceResult {
    // Basic compliance checks
    if (!context.userId) {
      return {
        success: false,
        error: {
          code: 'COMPLIANCE_VIOLATION',
          message: 'User identification required for compliance',
        },
      };
    }

    // Financial operations compliance
    if (operation.category === 'financial') {
      // Add specific financial compliance checks
      if (
        input.amount &&
        input.amount > 10000 &&
        !context.permissions?.includes('financial:high-value')
      ) {
        return {
          success: false,
          error: {
            code: 'FINANCIAL_COMPLIANCE_VIOLATION',
            message: 'High-value financial operations require special authorization',
          },
        };
      }
    }

    return { success: true };
  }

  /**
   * Log audit entry
   */
  private logAuditEntry(entry: AuditLogEntry): void {
    this.auditLog.push(entry);

    // Keep only configured number of entries in memory
    if (this.auditLog.length > memoryLimits.audit.maxLogEntries) {
      this.auditLog.splice(0, memoryLimits.audit.cleanupBatchSize);
    }

    this.logger.info('Business operation audit', entry);
  }

  /**
   * Sanitize data for audit logging (remove sensitive information)
   */
  private sanitizeForAudit(data: any): any {
    if (!data) return data;

    const sanitized = { ...data };

    // Remove common sensitive fields
    const sensitiveFields = ['password', 'ssn', 'creditCard', 'bankAccount', 'apiKey', 'token'];
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  /**
   * Get audit log entries for a specific operation or user
   */
  getAuditLog(filters?: {
    operationId?: string;
    userId?: string;
    category?: string;
    startDate?: Date;
    endDate?: Date;
  }): AuditLogEntry[] {
    let filteredLog = this.auditLog;

    if (filters) {
      filteredLog = this.auditLog.filter((entry) => {
        if (filters.operationId && entry.operationId !== filters.operationId) return false;
        if (filters.userId && entry.userId !== filters.userId) return false;
        if (filters.category && entry.category !== filters.category) return false;
        if (filters.startDate && entry.timestamp < filters.startDate) return false;
        if (filters.endDate && entry.timestamp > filters.endDate) return false;
        return true;
      });
    }

    return filteredLog;
  }

  /**
   * Get business system health metrics
   */
  getBusinessSystemHealth(): {
    operationsRegistered: number;
    auditLogSize: number;
    recentFailures: number;
    complianceStatus: 'compliant' | 'warning' | 'violation';
  } {
    const recentFailures = this.auditLog.filter(
      (entry) => !entry.success && entry.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length;

    let complianceStatus: 'compliant' | 'warning' | 'violation' = 'compliant';
    if (recentFailures > 10) {
      complianceStatus = 'violation';
    } else if (recentFailures > 5) {
      complianceStatus = 'warning';
    }

    return {
      operationsRegistered: this.operations.size,
      auditLogSize: this.auditLog.length,
      recentFailures,
      complianceStatus,
    };
  }
}

/**
 * Business Operation Factory
 * Creates standardized business operations
 */
export class BusinessOperationFactory {
  static createFinancialOperation<TInput, TOutput>(
    operationId: string,
    handler: (input: TInput, context: ServiceContext) => Promise<ServiceResult<TOutput>>,
    options: {
      requiresApproval?: boolean;
      securityLevel?: 'standard' | 'elevated' | 'maximum';
    } = {}
  ): BusinessOperation<TInput, TOutput> {
    return {
      operationId,
      category: 'financial',
      requiresApproval: options.requiresApproval ?? true,
      securityLevel: options.securityLevel ?? 'elevated',
      auditRequired: true,
      execute: handler,
    };
  }

  static createHROperation<TInput, TOutput>(
    operationId: string,
    handler: (input: TInput, context: ServiceContext) => Promise<ServiceResult<TOutput>>,
    options: {
      requiresApproval?: boolean;
      securityLevel?: 'standard' | 'elevated' | 'maximum';
    } = {}
  ): BusinessOperation<TInput, TOutput> {
    return {
      operationId,
      category: 'hr',
      requiresApproval: options.requiresApproval ?? false,
      securityLevel: options.securityLevel ?? 'standard',
      auditRequired: true,
      execute: handler,
    };
  }

  static createManufacturingOperation<TInput, TOutput>(
    operationId: string,
    handler: (input: TInput, context: ServiceContext) => Promise<ServiceResult<TOutput>>,
    options: {
      requiresApproval?: boolean;
      securityLevel?: 'standard' | 'elevated' | 'maximum';
    } = {}
  ): BusinessOperation<TInput, TOutput> {
    return {
      operationId,
      category: 'manufacturing',
      requiresApproval: options.requiresApproval ?? false,
      securityLevel: options.securityLevel ?? 'standard',
      auditRequired: false,
      execute: handler,
    };
  }
}
