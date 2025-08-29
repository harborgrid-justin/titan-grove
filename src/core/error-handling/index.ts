/**
 * Error Handling Framework - Main Export
 * Centralized error boundaries, circuit breakers, and service registry
 */

export * from './CircuitBreaker';
export * from './ErrorBoundary';
export * from './ServiceRegistry';
export * from './CommonTypes';

// Re-export commonly used types and classes
export {
  CircuitBreaker,
  CircuitBreakerState,
  CircuitBreakerError,
  type CircuitBreakerConfig,
  type CircuitBreakerMetrics
} from './CircuitBreaker';

export {
  ErrorBoundary,
  ErrorBoundaryError,
  ErrorSeverity,
  withErrorBoundary,
  type ErrorBoundaryConfig,
  type ErrorContext,
  type ErrorBoundaryMetrics,
  type RetryConfig,
  type FallbackConfig
} from './ErrorBoundary';

export {
  ServiceRegistry,
  BaseService,
  type ServiceMetadata,
  type ServiceConfig,
  type ServiceHealth
} from './ServiceRegistry';

export {
  ComplianceStatus,
  AlertSeverity,
  AlertType,
  type BaseEntity,
  type ComplianceRule,
  type ComplianceCheck,
  type SystemAlert,
  type AuditTrail,
  type ServiceResponse,
  type PaginationRequest,
  type PaginationResponse,
  type PerformanceMetrics
} from './CommonTypes';