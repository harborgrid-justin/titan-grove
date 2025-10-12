/**
 * Enterprise-grade structured logging system
 * Replaces console.log statements with proper Winston-based logging
 */

import winston, { Logger, LogEntry } from 'winston';

export interface LogContext {
  module?: string;
  operation?: string;
  userId?: string;
  requestId?: string;
  correlationId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  [key: string]: any;
}

export class EnterpriseLogger {
  private logger: Logger;
  private serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
        winston.format.printf((info: any) => {
          const { timestamp, level, message, ...meta } = info;
          return JSON.stringify({
            timestamp,
            level,
            service: this.serviceName,
            message,
            ...meta,
          });
        })
      ),
      defaultMeta: { service: serviceName },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
        new winston.transports.File({ 
          filename: 'logs/error.log', 
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
        new winston.transports.File({ 
          filename: 'logs/combined.log',
          maxsize: 5242880, // 5MB  
          maxFiles: 10,
        }),
      ],
    });
  }

  info(message: string, context?: LogContext): void {
    this.logger.info(message, { 
      ...context,
      category: 'INFO'
    });
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.logger.error(message, { 
      ...context,
      category: 'ERROR',
      error: error ? {
        name: error.name,
        message: (error as Error).message,
        stack: error.stack
      } : undefined
    });
  }

  // Alias for error method for backward compatibility
  logError(message: string, error?: Error, context?: LogContext): void {
    this.error(message, error, context);
  }

  warn(message: string, context?: LogContext): void {
    this.logger.warn(message, {
      ...context,
      category: 'WARNING'
    });
  }

  debug(message: string, context?: LogContext): void {
    this.logger.debug(message, {
      ...context,
      category: 'DEBUG'
    });
  }

  // Business operation logging
  logBusinessOperation(
    operation: string,
    entityType: string,
    entityId: string,
    result: 'SUCCESS' | 'FAILURE' | 'PARTIAL',
    context?: LogContext & { duration?: number; metadata?: any }
  ): void {
    this.info(`Business operation completed`, {
      ...context,
      operation,
      entityType,
      entityId,
      result,
      category: 'BUSINESS_OPERATION'
    });
  }

  // Performance logging
  logPerformance(
    operation: string,
    duration: number,
    context?: LogContext & { metrics?: any }
  ): void {
    this.info(`Performance metric`, {
      ...context,
      operation,
      duration,
      category: 'PERFORMANCE'
    });
  }

  // Security logging
  logSecurityEvent(
    event: string,
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    context?: LogContext & { securityData?: any }
  ): void {
    this.warn(`Security event detected`, {
      ...context,
      event,
      severity,
      category: 'SECURITY'
    });
  }

  // Audit logging for compliance
  logAuditEvent(
    action: string,
    resource: string,
    outcome: 'SUCCESS' | 'FAILURE',
    context?: LogContext & { auditData?: any }
  ): void {
    this.info(`Audit event`, {
      ...context,
      action,
      resource,
      outcome,
      category: 'AUDIT',
      compliance: true
    });
  }

  // API request/response logging
  logApiRequest(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    context?: LogContext
  ): void {
    this.info(`API request completed`, {
      ...context,
      method,
      path,
      statusCode,
      duration,
      category: 'API'
    });
  }

  // Database operation logging
  logDatabaseOperation(
    operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE',
    table: string,
    duration: number,
    rowsAffected?: number,
    context?: LogContext
  ): void {
    this.debug(`Database operation`, {
      ...context,
      operation,
      table,
      duration,
      rowsAffected,
      category: 'DATABASE'
    });
  }

  // Integration logging
  logIntegration(
    system: string,
    operation: string,
    status: 'SUCCESS' | 'FAILURE',
    duration: number,
    context?: LogContext
  ): void {
    this.info(`External system integration`, {
      ...context,
      system,
      operation,
      status,
      duration,
      category: 'INTEGRATION'
    });
  }

  // Workflow logging
  logWorkflow(
    workflowId: string,
    step: string,
    status: 'STARTED' | 'COMPLETED' | 'FAILED' | 'SKIPPED',
    context?: LogContext
  ): void {
    this.info(`Workflow step`, {
      ...context,
      workflowId,
      step,
      status,
      category: 'WORKFLOW'
    });
  }
}

// Singleton instances for different services
const loggers: Map<string, EnterpriseLogger> = new Map();

export function getLogger(serviceName: string): EnterpriseLogger {
  if (!loggers.has(serviceName)) {
    loggers.set(serviceName, new EnterpriseLogger(serviceName));
  }
  return loggers.get(serviceName)!;
}

// Default logger instance
export const defaultLogger = getLogger('titan-grove');

// Convenience functions for backward compatibility
export const logger = {
  info: (message: string, context?: LogContext) => defaultLogger.info(message, context),
  error: (message: string, error?: Error, context?: LogContext) => defaultLogger.error(message, error, context),
  warn: (message: string, context?: LogContext) => defaultLogger.warn(message, context),
  debug: (message: string, context?: LogContext) => defaultLogger.debug(message, context),
};

export default EnterpriseLogger;