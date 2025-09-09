/**
 * Standardized Service Layer
 * Provides consistent service patterns across all domains
 */

import { Logger } from 'winston';
import { performanceThresholds } from '../config';

export interface ServiceContext {
  logger: Logger;
  userId?: string;
  tenantId?: string;
  requestId?: string;
  permissions?: string[];
}

export interface ServiceResult<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    executionTime?: number;
    cacheHit?: boolean;
    warnings?: string[];
    handlersExecuted?: number;
    failures?: number;
    stepsExecuted?: number;
    workflowId?: string;
    executionId?: string;
  };
}

export interface ServiceMetrics {
  requestCount: number;
  averageResponseTime: number;
  errorRate: number;
  lastExecuted: Date;
}

export abstract class BaseService {
  protected readonly logger: Logger;
  protected readonly serviceName: string;
  protected metrics: ServiceMetrics;

  constructor(serviceName: string, logger: Logger) {
    this.serviceName = serviceName;
    this.logger = logger;
    this.metrics = {
      requestCount: 0,
      averageResponseTime: 0,
      errorRate: 0,
      lastExecuted: new Date()
    };
  }

  protected async executeWithMetrics<T>(
    operation: () => Promise<T>,
    context: ServiceContext
  ): Promise<ServiceResult<T>> {
    const startTime = Date.now();
    this.metrics.requestCount++;

    try {
      this.logger.debug(`Executing ${this.serviceName} operation`, {
        requestId: context.requestId,
        userId: context.userId,
        tenantId: context.tenantId
      });

      const result = await operation();
      const executionTime = Date.now() - startTime;
      
      // Update metrics
      this.metrics.averageResponseTime = 
        (this.metrics.averageResponseTime + executionTime) / 2;
      this.metrics.lastExecuted = new Date();

      return {
        success: true,
        data: result,
        metadata: {
          executionTime,
          cacheHit: false
        }
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.metrics.errorRate = (this.metrics.errorRate + 1) / this.metrics.requestCount;

      this.logger.error(`Error in ${this.serviceName}`, {
        error: error instanceof Error ? error.message : String(error),
        requestId: context.requestId,
        executionTime
      });

      return {
        success: false,
        error: {
          code: error instanceof Error ? error.constructor.name : 'UNKNOWN_ERROR',
          message: error instanceof Error ? error.message : String(error),
          details: error
        },
        metadata: {
          executionTime
        }
      };
    }
  }

  public getMetrics(): ServiceMetrics {
    return { ...this.metrics };
  }

  public getHealthStatus(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    metrics: ServiceMetrics;
    issues: string[];
  } {
    const issues: string[] = [];
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    // Check error rate
    if (this.metrics.errorRate > performanceThresholds.errorRate.errorThreshold) {
      issues.push('High error rate detected');
      status = 'unhealthy';
    } else if (this.metrics.errorRate > performanceThresholds.errorRate.warningThreshold) {
      issues.push('Elevated error rate');
      status = 'degraded';
    }

    // Check response time
    if (this.metrics.averageResponseTime > performanceThresholds.responseTime.errorThreshold) {
      issues.push('High response time detected');
      status = status === 'healthy' ? 'degraded' : status;
    }

    return {
      status,
      metrics: this.metrics,
      issues
    };
  }
}

export interface ValidationRule<T = any> {
  field: keyof T;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export class ValidationService {
  static validate<T>(data: T, rules: ValidationRule<T>[]): ServiceResult<T> {
    const errors: string[] = [];

    for (const rule of rules) {
      const value = data[rule.field];

      // Required check
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`${String(rule.field)} is required`);
        continue;
      }

      // Skip further validation if value is not provided and not required
      if (!rule.required && (value === undefined || value === null)) {
        continue;
      }

      // Type check
      if (rule.type && typeof value !== rule.type) {
        errors.push(`${String(rule.field)} must be of type ${rule.type}`);
        continue;
      }

      // String-specific validations
      if (rule.type === 'string' && typeof value === 'string') {
        if (rule.minLength && value.length < rule.minLength) {
          errors.push(`${String(rule.field)} must be at least ${rule.minLength} characters`);
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push(`${String(rule.field)} must be no more than ${rule.maxLength} characters`);
        }
        if (rule.pattern && !rule.pattern.test(value)) {
          errors.push(`${String(rule.field)} format is invalid`);
        }
      }

      // Custom validation
      if (rule.custom) {
        const customResult = rule.custom(value);
        if (typeof customResult === 'string') {
          errors.push(customResult);
        } else if (!customResult) {
          errors.push(`${String(rule.field)} failed custom validation`);
        }
      }
    }

    if (errors.length > 0) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors
        }
      };
    }

    return {
      success: true,
      data
    };
  }
}