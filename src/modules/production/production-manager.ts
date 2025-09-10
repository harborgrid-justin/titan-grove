/**
 * Production-Grade NAPI-RS Integration Layer
 * Provides comprehensive error handling, monitoring, and business logic integration
 */

import {
  initializeProductionEnvironment,
  logInfo,
  logError,
  logWarn,
  generateCorrelationId,
  recordPerformanceMetric,
  recordBusinessMetric,
  getHealthStatus,
  updateHealthStatus,
  getPerformanceMetrics,
  getBusinessMetrics,
  validateInput,
  sanitizeInput,
  executeWithResilience,
  getProductionConfig,
  updateProductionConfig,
  clearMetrics,
  getSystemOverview,
} from '../../native';

export interface ProductionError {
  code: string;
  message: string;
  module: string;
  timestamp: string;
  correlationId: string;
  stackTrace?: string;
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: ProductionError;
  timestamp: string;
  correlationId: string;
  executionTimeMs: number;
}

export interface PerformanceMetrics {
  operation: string;
  module: string;
  executionTimeMs: number;
  memoryUsageBytes: number;
  cpuUsagePercent: number;
  timestamp: string;
  correlationId: string;
}

export interface BusinessMetrics {
  metricName: string;
  metricValue: number;
  metricUnit: string;
  module: string;
  timestamp: string;
  correlationId: string;
  tags: string[];
}

export interface HealthStatus {
  component: string;
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  lastCheck: string;
  responseTimeMs: number;
  errorRatePercent: number;
  availabilityPercent: number;
}

export interface ProductionConfig {
  logLevel: string;
  enableMetrics: boolean;
  enableTracing: boolean;
  maxRetryAttempts: number;
  timeoutMs: number;
  circuitBreakerThreshold: number;
  rateLimitPerMinute: number;
}

/**
 * Production-grade wrapper for NAPI-RS functions
 */
export class ProductionManager {
  private static instance: ProductionManager;
  private initialized = false;

  private constructor() {}

  static getInstance(): ProductionManager {
    if (!ProductionManager.instance) {
      ProductionManager.instance = new ProductionManager();
    }
    return ProductionManager.instance;
  }

  /**
   * Initialize production environment with configuration
   */
  async initialize(config?: Partial<ProductionConfig>): Promise<boolean> {
    const defaultConfig: ProductionConfig = {
      logLevel: 'INFO',
      enableMetrics: true,
      enableTracing: true,
      maxRetryAttempts: 3,
      timeoutMs: 30000,
      circuitBreakerThreshold: 10,
      rateLimitPerMinute: 1000,
    };

    const finalConfig = { ...defaultConfig, ...config };
    
    try {
      const result = await initializeProductionEnvironment(finalConfig);
      this.initialized = result;
      
      if (this.initialized) {
        await this.logInfo('PRODUCTION_MANAGER', 'Production environment initialized successfully');
      }
      
      return result;
    } catch (error) {
      await this.logError('PRODUCTION_MANAGER', `Failed to initialize production environment: ${error}`);
      return false;
    }
  }

  /**
   * Execute operation with production-grade error handling and monitoring
   */
  async executeOperation<T>(
    operation: () => Promise<T>,
    operationName: string,
    moduleName: string,
    correlationId?: string
  ): Promise<ServiceResponse<T>> {
    if (!this.initialized) {
      await this.initialize();
    }

    const id = correlationId || this.generateCorrelationId();
    const startTime = Date.now();

    try {
      await this.logInfo(moduleName, `Starting operation: ${operationName}`, id);
      
      const result = await operation();
      const executionTime = Date.now() - startTime;
      
      // Record performance metrics
      await this.recordPerformanceMetric(operationName, moduleName, executionTime, id);
      
      await this.logInfo(moduleName, `Operation completed successfully: ${operationName}`, id);
      
      return {
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
        correlationId: id,
        executionTimeMs: executionTime,
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      await this.logError(moduleName, `Operation failed: ${operationName} - ${errorMessage}`, id);
      
      return {
        success: false,
        error: {
          code: 'OPERATION_FAILED',
          message: errorMessage,
          module: moduleName,
          timestamp: new Date().toISOString(),
          correlationId: id,
          stackTrace: error instanceof Error ? error.stack : undefined,
        },
        timestamp: new Date().toISOString(),
        correlationId: id,
        executionTimeMs: executionTime,
      };
    }
  }

  /**
   * Enhanced logging methods
   */
  async logInfo(module: string, message: string, correlationId?: string): Promise<void> {
    const id = correlationId || this.generateCorrelationId();
    await logInfo(module, message, id);
  }

  async logError(module: string, message: string, correlationId?: string): Promise<void> {
    const id = correlationId || this.generateCorrelationId();
    await logError(module, message, id);
  }

  async logWarn(module: string, message: string, correlationId?: string): Promise<void> {
    const id = correlationId || this.generateCorrelationId();
    await logWarn(module, message, id);
  }

  /**
   * Generate correlation ID for request tracing
   */
  generateCorrelationId(): string {
    return generateCorrelationId();
  }

  /**
   * Record performance metrics
   */
  async recordPerformanceMetric(
    operation: string,
    module: string,
    executionTimeMs: number,
    correlationId?: string
  ): Promise<void> {
    const id = correlationId || this.generateCorrelationId();
    await recordPerformanceMetric(operation, module, executionTimeMs, id);
  }

  /**
   * Record business metrics
   */
  async recordBusinessMetric(
    metricName: string,
    metricValue: number,
    metricUnit: string,
    module: string,
    tags: string[] = [],
    correlationId?: string
  ): Promise<void> {
    const id = correlationId || this.generateCorrelationId();
    await recordBusinessMetric(metricName, metricValue, metricUnit, module, tags, id);
  }

  /**
   * Get system health status
   */
  async getHealthStatus(): Promise<HealthStatus[]> {
    return await getHealthStatus();
  }

  /**
   * Update component health status
   */
  async updateHealthStatus(
    component: string,
    status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY',
    responseTimeMs: number,
    errorRatePercent: number,
    availabilityPercent: number
  ): Promise<void> {
    await updateHealthStatus(component, status, responseTimeMs, errorRatePercent, availabilityPercent);
  }

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics(limit?: number): Promise<PerformanceMetrics[]> {
    return await getPerformanceMetrics(limit);
  }

  /**
   * Get business metrics
   */
  async getBusinessMetrics(limit?: number): Promise<BusinessMetrics[]> {
    return await getBusinessMetrics(limit);
  }

  /**
   * Validate input with comprehensive validation
   */
  validateInput(input: string, validationType: 'email' | 'uuid' | 'non_empty'): boolean {
    try {
      return validateInput(input, validationType);
    } catch (error) {
      return false;
    }
  }

  /**
   * Sanitize input to prevent injection attacks
   */
  sanitizeInput(input: string): string {
    return sanitizeInput(input);
  }

  /**
   * Get production configuration
   */
  async getProductionConfig(): Promise<ProductionConfig> {
    return await getProductionConfig();
  }

  /**
   * Update production configuration
   */
  async updateProductionConfig(config: ProductionConfig): Promise<boolean> {
    return await updateProductionConfig(config);
  }

  /**
   * Clear all metrics (for maintenance)
   */
  async clearMetrics(): Promise<void> {
    await clearMetrics();
  }

  /**
   * Get comprehensive system overview
   */
  async getSystemOverview(): Promise<any> {
    const overview = await getSystemOverview();
    return JSON.parse(overview);
  }

  /**
   * Health check for the production manager itself
   */
  async performHealthCheck(): Promise<HealthStatus> {
    const startTime = Date.now();
    
    try {
      const config = await this.getProductionConfig();
      const metrics = await this.getPerformanceMetrics(1);
      const responseTime = Date.now() - startTime;
      
      const healthStatus: HealthStatus = {
        component: 'PRODUCTION_MANAGER',
        status: 'HEALTHY',
        lastCheck: new Date().toISOString(),
        responseTimeMs: responseTime,
        errorRatePercent: 0,
        availabilityPercent: 100,
      };
      
      await this.updateHealthStatus(
        'PRODUCTION_MANAGER',
        'HEALTHY',
        responseTime,
        0,
        100
      );
      
      return healthStatus;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      const healthStatus: HealthStatus = {
        component: 'PRODUCTION_MANAGER',
        status: 'UNHEALTHY',
        lastCheck: new Date().toISOString(),
        responseTimeMs: responseTime,
        errorRatePercent: 100,
        availabilityPercent: 0,
      };
      
      await this.updateHealthStatus(
        'PRODUCTION_MANAGER',
        'UNHEALTHY',
        responseTime,
        100,
        0
      );
      
      return healthStatus;
    }
  }
}

// Export singleton instance
export const productionManager = ProductionManager.getInstance();

// Enhanced wrapper functions for easier usage
export const withProductionLogging = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  moduleName: string,
  operationName: string
) => {
  return async (...args: T): Promise<ServiceResponse<R>> => {
    return productionManager.executeOperation(
      () => fn(...args),
      operationName,
      moduleName
    );
  };
};

export const withMetrics = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  metricName: string,
  moduleName: string
) => {
  return async (...args: T): Promise<R> => {
    const startTime = Date.now();
    const correlationId = productionManager.generateCorrelationId();
    
    try {
      const result = await fn(...args);
      const executionTime = Date.now() - startTime;
      
      await productionManager.recordPerformanceMetric(
        metricName,
        moduleName,
        executionTime,
        correlationId
      );
      
      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      await productionManager.recordPerformanceMetric(
        metricName,
        moduleName,
        executionTime,
        correlationId
      );
      
      throw error;
    }
  };
};

export default productionManager;