/**
 * Enterprise Error Handling System
 * Standardized error classes and error handling patterns
 */

import { v4 as uuidv4 } from 'uuid';
import { getLogger } from '../utils/enterprise-logger';

// ============================================================================
// BASE ERROR CLASSES
// ============================================================================

export abstract class BaseError extends Error {
  public readonly id: string;
  public readonly timestamp: Date;
  public readonly code: string;
  public readonly category: string;
  public readonly severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  public readonly context?: Record<string, any>;
  public readonly userMessage: string;
  public readonly isRetryable: boolean;
  public readonly correlationId?: string;

  constructor(
    message: string,
    code: string,
    category: string,
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM',
    context?: Record<string, any>,
    userMessage?: string,
    isRetryable: boolean = false,
    correlationId?: string
  ) {
    super(message);
    
    this.id = uuidv4();
    this.timestamp = new Date();
    this.code = code;
    this.category = category;
    this.severity = severity;
    this.context = context;
    this.userMessage = userMessage || this.getDefaultUserMessage();
    this.isRetryable = isRetryable;
    this.correlationId = correlationId;
    this.name = this.constructor.name;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);

    // Log error automatically
    this.logError();
  }

  abstract getDefaultUserMessage(): string;

  private logError(): void {
    const logger = getLogger('error-handler');
    const logContext = {
      errorId: this.id,
      errorCode: this.code,
      category: this.category,
      severity: this.severity,
      correlationId: this.correlationId,
      context: this.context,
      stack: this.stack
    };

    switch (this.severity) {
      case 'CRITICAL':
        logger.error(`Critical error occurred: ${this.message}`, this, logContext);
        break;
      case 'HIGH':
        logger.error(`High severity error: ${this.message}`, this, logContext);
        break;
      case 'MEDIUM':
        logger.warn(`Medium severity error: ${this.message}`, logContext);
        break;
      case 'LOW':
        logger.info(`Low severity error: ${this.message}`, logContext);
        break;
    }
  }

  toJSON() {
    return {
      id: this.id,
      timestamp: this.timestamp.toISOString(),
      name: this.name,
      message: this.message,
      code: this.code,
      category: this.category,
      severity: this.severity,
      userMessage: this.userMessage,
      isRetryable: this.isRetryable,
      correlationId: this.correlationId,
      context: this.context
    };
  }
}

// ============================================================================
// BUSINESS LOGIC ERRORS
// ============================================================================

export class ValidationError extends BaseError {
  constructor(
    message: string,
    validationDetails?: Record<string, any>,
    correlationId?: string
  ) {
    super(
      message,
      'VALIDATION_ERROR',
      'BUSINESS_LOGIC',
      'MEDIUM',
      validationDetails,
      'The provided data is invalid. Please check your input and try again.',
      false,
      correlationId
    );
  }

  getDefaultUserMessage(): string {
    return 'The provided data is invalid. Please check your input and try again.';
  }
}

export class BusinessRuleError extends BaseError {
  constructor(
    message: string,
    ruleCode: string,
    context?: Record<string, any>,
    correlationId?: string
  ) {
    super(
      message,
      ruleCode,
      'BUSINESS_RULE',
      'HIGH',
      context,
      undefined,
      false,
      correlationId
    );
  }

  getDefaultUserMessage(): string {
    return 'This operation violates a business rule and cannot be completed.';
  }
}

export class AuthorizationError extends BaseError {
  constructor(
    message: string,
    requiredPermissions?: string[],
    correlationId?: string
  ) {
    super(
      message,
      'AUTHORIZATION_ERROR',
      'SECURITY',
      'HIGH',
      { requiredPermissions },
      'You do not have permission to perform this operation.',
      false,
      correlationId
    );
  }

  getDefaultUserMessage(): string {
    return 'You do not have permission to perform this operation.';
  }
}

export class AuthenticationError extends BaseError {
  constructor(
    message: string,
    context?: Record<string, any>,
    correlationId?: string
  ) {
    super(
      message,
      'AUTHENTICATION_ERROR',
      'SECURITY',
      'HIGH',
      context,
      'Authentication failed. Please log in and try again.',
      false,
      correlationId
    );
  }

  getDefaultUserMessage(): string {
    return 'Authentication failed. Please log in and try again.';
  }
}

// ============================================================================
// SYSTEM ERRORS
// ============================================================================

export class DatabaseError extends BaseError {
  constructor(
    message: string,
    operation: string,
    query?: string,
    correlationId?: string
  ) {
    super(
      message,
      'DATABASE_ERROR',
      'SYSTEM',
      'CRITICAL',
      { operation, query },
      'A database error occurred. Please try again later.',
      true,
      correlationId
    );
  }

  getDefaultUserMessage(): string {
    return 'A database error occurred. Please try again later.';
  }
}

export class ExternalServiceError extends BaseError {
  constructor(
    message: string,
    serviceName: string,
    endpoint?: string,
    statusCode?: number,
    correlationId?: string
  ) {
    super(
      message,
      'EXTERNAL_SERVICE_ERROR',
      'INTEGRATION',
      'HIGH',
      { serviceName, endpoint, statusCode },
      'An external service is currently unavailable. Please try again later.',
      true,
      correlationId
    );
  }

  getDefaultUserMessage(): string {
    return 'An external service is currently unavailable. Please try again later.';
  }
}

export class ConfigurationError extends BaseError {
  constructor(
    message: string,
    configKey: string,
    correlationId?: string
  ) {
    super(
      message,
      'CONFIGURATION_ERROR',
      'SYSTEM',
      'CRITICAL',
      { configKey },
      'A system configuration error has occurred.',
      false,
      correlationId
    );
  }

  getDefaultUserMessage(): string {
    return 'A system configuration error has occurred.';
  }
}

export class RateLimitError extends BaseError {
  constructor(
    message: string,
    limit: number,
    windowSeconds: number,
    correlationId?: string
  ) {
    super(
      message,
      'RATE_LIMIT_EXCEEDED',
      'SYSTEM',
      'MEDIUM',
      { limit, windowSeconds },
      'Rate limit exceeded. Please try again later.',
      true,
      correlationId
    );
  }

  getDefaultUserMessage(): string {
    return 'Rate limit exceeded. Please try again later.';
  }
}

// ============================================================================
// DOMAIN-SPECIFIC ERRORS
// ============================================================================

export class PaymentProcessingError extends BaseError {
  constructor(
    message: string,
    paymentId: string,
    gatewayResponse?: any,
    correlationId?: string
  ) {
    super(
      message,
      'PAYMENT_PROCESSING_ERROR',
      'FINANCIAL',
      'HIGH',
      { paymentId, gatewayResponse },
      'Payment processing failed. Please check your payment information and try again.',
      false,
      correlationId
    );
  }

  getDefaultUserMessage(): string {
    return 'Payment processing failed. Please check your payment information and try again.';
  }
}

export class InsufficientInventoryError extends BaseError {
  constructor(
    message: string,
    productId: string,
    requestedQuantity: number,
    availableQuantity: number,
    correlationId?: string
  ) {
    super(
      message,
      'INSUFFICIENT_INVENTORY',
      'INVENTORY',
      'MEDIUM',
      { productId, requestedQuantity, availableQuantity },
      'Insufficient inventory available for this request.',
      false,
      correlationId
    );
  }

  getDefaultUserMessage(): string {
    return 'Insufficient inventory available for this request.';
  }
}

export class ManufacturingError extends BaseError {
  constructor(
    message: string,
    productionOrderId: string,
    workCenter?: string,
    correlationId?: string
  ) {
    super(
      message,
      'MANUFACTURING_ERROR',
      'MANUFACTURING',
      'HIGH',
      { productionOrderId, workCenter },
      'A manufacturing error has occurred.',
      true,
      correlationId
    );
  }

  getDefaultUserMessage(): string {
    return 'A manufacturing error has occurred.';
  }
}

// ============================================================================
// ERROR HANDLER UTILITY
// ============================================================================

export class ErrorHandler {
  private static instance: ErrorHandler;
  private logger = getLogger('error-handler');

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Handle and transform unknown errors into standardized errors
   */
  handleError(error: any, context?: Record<string, any>, correlationId?: string): BaseError {
    // If it's already a BaseError, return as-is
    if (error instanceof BaseError) {
      return error;
    }

    // Transform common error types
    if (error.name === 'ValidationError' || error.code === 'VALIDATION_ERROR') {
      return new ValidationError((error as Error).message, context, correlationId);
    }

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return new ExternalServiceError(
        (error as Error).message,
        'unknown-service',
        undefined,
        undefined,
        correlationId
      );
    }

    if (error.code?.startsWith('ER_') || error.code?.startsWith('SQLITE_')) {
      return new DatabaseError((error as Error).message, 'unknown', error.sql, correlationId);
    }

    // Default to generic system error
    return new SystemError(
      (error as Error).message || 'An unexpected error occurred',
      context,
      correlationId
    );
  }

  /**
   * Create error response for API endpoints
   */
  createErrorResponse(error: BaseError, includeStack: boolean = false) {
    return {
      success: false,
      error: {
        id: error.id,
        code: error.code,
        message: error.userMessage,
        category: error.category,
        severity: error.severity,
        timestamp: error.timestamp.toISOString(),
        isRetryable: error.isRetryable,
        correlationId: error.correlationId,
        ...(includeStack && { stack: error.stack })
      }
    };
  }

  /**
   * Async error handler wrapper for try-catch blocks
   */
  async executeWithErrorHandling<T>(
    operation: () => Promise<T>,
    context?: Record<string, any>,
    correlationId?: string
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      throw this.handleError(error, context, correlationId);
    }
  }

  /**
   * Sync error handler wrapper
   */
  executeWithErrorHandlingSync<T>(
    operation: () => T,
    context?: Record<string, any>,
    correlationId?: string
  ): T {
    try {
      return operation();
    } catch (error) {
      throw this.handleError(error, context, correlationId);
    }
  }
}

export class SystemError extends BaseError {
  constructor(
    message: string,
    context?: Record<string, any>,
    correlationId?: string
  ) {
    super(
      message,
      'SYSTEM_ERROR',
      'SYSTEM',
      'HIGH',
      context,
      'A system error occurred. Please try again later.',
      true,
      correlationId
    );
  }

  getDefaultUserMessage(): string {
    return 'A system error occurred. Please try again later.';
  }
}

// ============================================================================
// ERROR BOUNDARY FOR REACT COMPONENTS
// ============================================================================

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: BaseError;
  errorInfo?: any;
}

export class ErrorBoundaryHandler {
  static handleComponentError(error: Error, errorInfo: any): ErrorBoundaryState {
    const handler = ErrorHandler.getInstance();
    const standardizedError = handler.handleError(error, {
      componentStack: errorInfo.componentStack
    });

    return {
      hasError: true,
      error: standardizedError,
      errorInfo
    };
  }

  static getErrorDisplayInfo(error: BaseError) {
    return {
      title: this.getErrorTitle(error),
      message: error.userMessage,
      canRetry: error.isRetryable,
      severity: error.severity,
      timestamp: error.timestamp.toISOString()
    };
  }

  private static getErrorTitle(error: BaseError): string {
    switch (error.category) {
      case 'BUSINESS_LOGIC':
      case 'BUSINESS_RULE':
        return 'Business Rule Violation';
      case 'SECURITY':
        return 'Security Error';
      case 'SYSTEM':
        return 'System Error';
      case 'INTEGRATION':
        return 'Service Unavailable';
      case 'FINANCIAL':
        return 'Payment Error';
      case 'INVENTORY':
        return 'Inventory Error';
      case 'MANUFACTURING':
        return 'Manufacturing Error';
      default:
        return 'Error';
    }
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Type guard to check if an error is a BaseError
 */
export function isBaseError(error: any): error is BaseError {
  return error instanceof BaseError;
}

/**
 * Extract error information for logging
 */
export function extractErrorInfo(error: any) {
  if (isBaseError(error)) {
    return {
      id: error.id,
      code: error.code,
      category: error.category,
      severity: error.severity,
      message: (error as Error).message,
      correlationId: error.correlationId,
      context: error.context
    };
  }

  return {
    name: error.name || 'Unknown',
    message: (error as Error).message || 'Unknown error',
    code: error.code,
    stack: error.stack
  };
}

/**
 * Create a correlation ID for tracking related operations
 */
export function createCorrelationId(): string {
  return uuidv4();
}

// ============================================================================
// EXPORTS
// ============================================================================

export const errorHandler = ErrorHandler.getInstance();

export default {
  // Base classes
  BaseError,
  SystemError,
  
  // Business errors
  ValidationError,
  BusinessRuleError,
  AuthorizationError,
  AuthenticationError,
  
  // System errors
  DatabaseError,
  ExternalServiceError,
  ConfigurationError,
  RateLimitError,
  
  // Domain errors
  PaymentProcessingError,
  InsufficientInventoryError,
  ManufacturingError,
  
  // Utilities
  ErrorHandler,
  ErrorBoundaryHandler,
  errorHandler,
  isBaseError,
  extractErrorInfo,
  createCorrelationId
};