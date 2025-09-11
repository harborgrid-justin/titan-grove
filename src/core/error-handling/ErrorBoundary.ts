/**
 * Error Boundary implementation for service isolation and graceful error handling
 * Provides error isolation, recovery mechanisms, and fallback strategies
 */

import { CircuitBreaker, CircuitBreakerConfig } from './CircuitBreaker';
import type { Logger } from 'winston';

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface ErrorContext {
  service: string;
  operation: string;
  correlationId?: string;
  userId?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface ErrorBoundaryConfig {
  serviceName: string;
  logger?: Logger;
  circuitBreakerConfig?: CircuitBreakerConfig;
  retryConfig?: RetryConfig;
  fallbackConfig?: FallbackConfig;
  monitoringEnabled?: boolean;
  errorClassification?: (error: Error) => ErrorSeverity;
}

export interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableErrors?: (error: Error) => boolean;
}

export interface FallbackConfig {
  enabled: boolean;
  fallbackHandler?: <T>(context: ErrorContext, error: Error) => Promise<T> | T;
  degradedModeHandler?: <T>(context: ErrorContext) => Promise<T> | T;
}

export interface ErrorBoundaryMetrics {
  totalRequests: number;
  totalErrors: number;
  errorRate: number;
  retryAttempts: number;
  fallbackActivations: number;
  lastError?: {
    error: Error;
    context: ErrorContext;
    severity: ErrorSeverity;
    timestamp: Date;
  };
}

export class ErrorBoundaryError extends Error {
  constructor(
    message: string,
    public readonly originalError: Error,
    public readonly context: ErrorContext,
    public readonly severity: ErrorSeverity
  ) {
    super(message);
    this.name = 'ErrorBoundaryError';
  }
}

export class ErrorBoundary {
  private circuitBreaker?: CircuitBreaker;
  private metrics: ErrorBoundaryMetrics = {
    totalRequests: 0,
    totalErrors: 0,
    errorRate: 0,
    retryAttempts: 0,
    fallbackActivations: 0,
  };

  constructor(private readonly config: ErrorBoundaryConfig) {
    if (config.circuitBreakerConfig) {
      this.circuitBreaker = new CircuitBreaker(
        `${config.serviceName}_circuit_breaker`,
        config.circuitBreakerConfig
      );
    }
  }

  async execute<T>(operation: () => Promise<T>, context: ErrorContext): Promise<T> {
    this.metrics.totalRequests++;

    const executeWithRetry = async (): Promise<T> => {
      if (this.config.retryConfig) {
        return await this.executeWithRetry(operation, context);
      }
      return await operation();
    };

    try {
      if (this.circuitBreaker) {
        return await this.circuitBreaker.execute(executeWithRetry);
      }
      return await executeWithRetry();
    } catch (error) {
      return await this.handleError(error as Error, context, operation);
    }
  }

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: ErrorContext
  ): Promise<T> {
    const retryConfig = this.config.retryConfig!;
    let lastError: Error;

    for (let attempt = 1; attempt <= retryConfig.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (attempt === retryConfig.maxAttempts) {
          break;
        }

        if (retryConfig.retryableErrors && !retryConfig.retryableErrors(lastError)) {
          break;
        }

        this.metrics.retryAttempts++;
        const delay = Math.min(
          retryConfig.initialDelay * Math.pow(retryConfig.backoffMultiplier, attempt - 1),
          retryConfig.maxDelay
        );

        this.config.logger?.warn(
          `Retry attempt ${attempt}/${retryConfig.maxAttempts} for ${context.service}:${context.operation} after ${delay}ms`,
          { context, error: lastError.message }
        );

        await this.delay(delay);
      }
    }

    throw lastError!;
  }

  private async handleError<T>(
    error: Error,
    context: ErrorContext,
    originalOperation: () => Promise<T>
  ): Promise<T> {
    this.metrics.totalErrors++;
    this.updateErrorRate();

    const severity = this.config.errorClassification?.(error) || ErrorSeverity.MEDIUM;

    this.metrics.lastError = {
      error,
      context,
      severity,
      timestamp: new Date(),
    };

    this.config.logger?.error(`Error in ${context.service}:${context.operation}`, {
      error: error.message,
      stack: error.stack,
      context,
      severity,
    });

    // Try fallback strategies
    if (this.config.fallbackConfig?.enabled) {
      try {
        return await this.executeFallback(error, context);
      } catch (fallbackError) {
        this.config.logger?.error(`Fallback failed for ${context.service}:${context.operation}`, {
          originalError: error.message,
          fallbackError: (fallbackError as Error).message,
        });
      }
    }

    throw new ErrorBoundaryError(
      `Error boundary caught error in ${context.service}:${context.operation}: ${error.message}`,
      error,
      context,
      severity
    );
  }

  private async executeFallback<T>(error: Error, context: ErrorContext): Promise<T> {
    this.metrics.fallbackActivations++;

    const fallbackConfig = this.config.fallbackConfig!;

    if (fallbackConfig.fallbackHandler) {
      this.config.logger?.info(
        `Executing fallback handler for ${context.service}:${context.operation}`,
        { context }
      );
      return await fallbackConfig.fallbackHandler(context, error);
    }

    if (fallbackConfig.degradedModeHandler) {
      this.config.logger?.info(
        `Executing degraded mode handler for ${context.service}:${context.operation}`,
        { context }
      );
      return await fallbackConfig.degradedModeHandler(context);
    }

    throw new Error('No fallback handler configured');
  }

  private updateErrorRate(): void {
    if (this.metrics.totalRequests > 0) {
      this.metrics.errorRate = (this.metrics.totalErrors / this.metrics.totalRequests) * 100;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getMetrics(): ErrorBoundaryMetrics {
    return { ...this.metrics };
  }

  getCircuitBreakerMetrics() {
    return this.circuitBreaker?.getMetrics();
  }

  reset(): void {
    this.metrics = {
      totalRequests: 0,
      totalErrors: 0,
      errorRate: 0,
      retryAttempts: 0,
      fallbackActivations: 0,
    };
    this.circuitBreaker?.reset();
  }
}

export function withErrorBoundary<T extends any[], R>(
  target: any,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<(...args: T) => Promise<R>>
): void {
  const originalMethod = descriptor.value!;

  descriptor.value = async function (this: any, ...args: T): Promise<R> {
    const errorBoundary = this.errorBoundary as ErrorBoundary;

    if (!errorBoundary) {
      throw new Error(`Error boundary not configured for ${target.constructor.name}`);
    }

    const context: ErrorContext = {
      service: target.constructor.name,
      operation: propertyKey,
      timestamp: new Date(),
      correlationId: this.correlationId || crypto.randomUUID?.() || Math.random().toString(36),
    };

    return await errorBoundary.execute(() => originalMethod.apply(this, args), context);
  };
}
