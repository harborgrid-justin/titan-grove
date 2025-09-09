/**
 * Customer System Architecture
 * Handles customer-facing operations, self-service, and user experience
 */

import { BaseService, ServiceContext, ServiceResult } from './service-layer';
import { Logger } from 'winston';

export interface CustomerSystemConfig {
  enableSelfService: boolean;
  enableNotifications: boolean;
  enableAnalytics: boolean;
  rateLimitRequests: boolean;
  maxRequestsPerMinute: number;
  cacheEnabled: boolean;
  cacheTTL: number;
}

export interface CustomerOperation<TInput = any, TOutput = any> {
  operationId: string;
  category: 'self-service' | 'support' | 'portal' | 'mobile';
  publicAccess: boolean;
  rateLimited: boolean;
  cacheable: boolean;
  execute(input: TInput, context: ServiceContext): Promise<ServiceResult<TOutput>>;
}

export interface CustomerInteraction {
  sessionId: string;
  customerId?: string;
  timestamp: Date;
  operationId: string;
  category: string;
  responseTime: number;
  success: boolean;
  userAgent?: string;
  ipAddress?: string;
  geolocation?: {
    country: string;
    region: string;
    city: string;
  };
}

export interface NotificationPreferences {
  customerId: string;
  email: boolean;
  sms: boolean;
  push: boolean;
  channels: {
    orders: boolean;
    support: boolean;
    marketing: boolean;
    system: boolean;
  };
}

export class CustomerSystemService extends BaseService {
  private config: CustomerSystemConfig;
  private operations: Map<string, CustomerOperation> = new Map();
  private interactions: CustomerInteraction[] = [];
  private rateLimitTracker: Map<string, { count: number; resetTime: number }> = new Map();
  private cache: Map<string, { data: any; expires: number }> = new Map();

  constructor(config: CustomerSystemConfig, logger: Logger) {
    super('CustomerSystem', logger);
    this.config = config;
    
    // Setup cache cleanup interval
    if (this.config.cacheEnabled) {
      setInterval(() => this.cleanupExpiredCache(), 60000); // Every minute
    }
  }

  /**
   * Register a customer operation
   */
  registerOperation(operation: CustomerOperation): void {
    this.operations.set(operation.operationId, operation);
    this.logger.info(`Registered customer operation: ${operation.operationId}`, {
      category: operation.category,
      publicAccess: operation.publicAccess,
      rateLimited: operation.rateLimited,
      cacheable: operation.cacheable
    });
  }

  /**
   * Execute a customer operation with rate limiting, caching, and analytics
   */
  async executeCustomerOperation<TInput, TOutput>(
    operationId: string,
    input: TInput,
    context: ServiceContext & { sessionId?: string; ipAddress?: string; userAgent?: string }
  ): Promise<ServiceResult<TOutput>> {
    const operation = this.operations.get(operationId);
    if (!operation) {
      return {
        success: false,
        error: {
          code: 'OPERATION_NOT_FOUND',
          message: `Customer operation ${operationId} not found`
        }
      };
    }

    // Rate limiting check
    if (this.config.rateLimitRequests && operation.rateLimited) {
      const rateLimitCheck = this.checkRateLimit(context.ipAddress || 'unknown', context);
      if (!rateLimitCheck.success) {
        return rateLimitCheck;
      }
    }

    // Check cache if enabled and operation is cacheable
    if (this.config.cacheEnabled && operation.cacheable) {
      const cacheKey = this.generateCacheKey(operationId, input, context);
      const cachedResult = this.getFromCache<TOutput>(cacheKey);
      if (cachedResult) {
        this.trackInteraction(operationId, operation, context, 0, true);
        return {
          success: true,
          data: cachedResult,
          metadata: {
            cacheHit: true,
            executionTime: 0
          }
        };
      }
    }

    // Execute operation with metrics and interaction tracking
    return this.executeWithMetrics(async () => {
      const startTime = Date.now();
      
      try {
        const result = await operation.execute(input, context);
        const responseTime = Date.now() - startTime;
        
        // Cache result if applicable
        if (this.config.cacheEnabled && operation.cacheable && result.success) {
          const cacheKey = this.generateCacheKey(operationId, input, context);
          this.setCache(cacheKey, result.data);
        }

        // Track interaction
        this.trackInteraction(operationId, operation, context, responseTime, result.success);

        return result.data;
      } catch (error) {
        const responseTime = Date.now() - startTime;
        this.trackInteraction(operationId, operation, context, responseTime, false);
        throw error;
      }
    }, context);
  }

  /**
   * Check rate limiting
   */
  private checkRateLimit(identifier: string, context: ServiceContext): ServiceResult {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute window
    
    let tracker = this.rateLimitTracker.get(identifier);
    if (!tracker || now > tracker.resetTime) {
      tracker = { count: 0, resetTime: now + windowMs };
    }

    tracker.count++;
    this.rateLimitTracker.set(identifier, tracker);

    if (tracker.count > this.config.maxRequestsPerMinute) {
      this.logger.warn('Rate limit exceeded', {
        identifier,
        requestId: context.requestId,
        count: tracker.count,
        limit: this.config.maxRequestsPerMinute
      });

      return {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please try again later.',
          details: {
            retryAfter: Math.ceil((tracker.resetTime - now) / 1000)
          }
        }
      };
    }

    return { success: true };
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(operationId: string, input: any, context: ServiceContext): string {
    const keyData = {
      operationId,
      input,
      userId: context.userId,
      tenantId: context.tenantId
    };
    
    // Simple hash function for cache key
    return Buffer.from(JSON.stringify(keyData)).toString('base64');
  }

  /**
   * Get from cache
   */
  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && cached.expires > Date.now()) {
      return cached.data as T;
    }
    
    // Remove expired entry
    if (cached) {
      this.cache.delete(key);
    }
    
    return null;
  }

  /**
   * Set cache
   */
  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + (this.config.cacheTTL * 1000)
    });
  }

  /**
   * Cleanup expired cache entries
   */
  private cleanupExpiredCache(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    for (const [key, value] of this.cache.entries()) {
      if (value.expires <= now) {
        expiredKeys.push(key);
      }
    }
    
    for (const key of expiredKeys) {
      this.cache.delete(key);
    }

    if (expiredKeys.length > 0) {
      this.logger.debug(`Cleaned up ${expiredKeys.length} expired cache entries`);
    }
  }

  /**
   * Track customer interaction
   */
  private trackInteraction(
    operationId: string,
    operation: CustomerOperation,
    context: ServiceContext & { sessionId?: string; ipAddress?: string; userAgent?: string },
    responseTime: number,
    success: boolean
  ): void {
    const interaction: CustomerInteraction = {
      sessionId: context.sessionId || 'unknown',
      customerId: context.userId,
      timestamp: new Date(),
      operationId,
      category: operation.category,
      responseTime,
      success,
      userAgent: context.userAgent,
      ipAddress: context.ipAddress
    };

    this.interactions.push(interaction);

    // Keep only last 50000 interactions in memory
    if (this.interactions.length > 50000) {
      this.interactions.splice(0, 10000);
    }

    this.logger.info('Customer interaction tracked', {
      operationId,
      category: operation.category,
      responseTime,
      success,
      sessionId: context.sessionId
    });
  }

  /**
   * Get customer analytics
   */
  getCustomerAnalytics(filters?: {
    customerId?: string;
    category?: string;
    startDate?: Date;
    endDate?: Date;
  }): {
    totalInteractions: number;
    averageResponseTime: number;
    successRate: number;
    topOperations: { operationId: string; count: number }[];
    categoryBreakdown: { [category: string]: number };
  } {
    let filteredInteractions = this.interactions;

    if (filters) {
      filteredInteractions = this.interactions.filter(interaction => {
        if (filters.customerId && interaction.customerId !== filters.customerId) return false;
        if (filters.category && interaction.category !== filters.category) return false;
        if (filters.startDate && interaction.timestamp < filters.startDate) return false;
        if (filters.endDate && interaction.timestamp > filters.endDate) return false;
        return true;
      });
    }

    const totalInteractions = filteredInteractions.length;
    const successfulInteractions = filteredInteractions.filter(i => i.success).length;
    const averageResponseTime = filteredInteractions.reduce((sum, i) => sum + i.responseTime, 0) / totalInteractions || 0;
    const successRate = totalInteractions > 0 ? successfulInteractions / totalInteractions : 0;

    // Top operations
    const operationCounts = new Map<string, number>();
    filteredInteractions.forEach(interaction => {
      const count = operationCounts.get(interaction.operationId) || 0;
      operationCounts.set(interaction.operationId, count + 1);
    });

    const topOperations = Array.from(operationCounts.entries())
      .map(([operationId, count]) => ({ operationId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Category breakdown
    const categoryBreakdown: { [category: string]: number } = {};
    filteredInteractions.forEach(interaction => {
      categoryBreakdown[interaction.category] = (categoryBreakdown[interaction.category] || 0) + 1;
    });

    return {
      totalInteractions,
      averageResponseTime,
      successRate,
      topOperations,
      categoryBreakdown
    };
  }

  /**
   * Get customer system health metrics
   */
  getCustomerSystemHealth(): {
    operationsRegistered: number;
    cacheSize: number;
    cacheHitRate: number;
    rateLimitViolations: number;
    avgResponseTime: number;
  } {
    const recentInteractions = this.interactions.filter(
      i => i.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );

    const cacheHits = recentInteractions.filter(i => i.responseTime === 0).length;
    const cacheHitRate = recentInteractions.length > 0 ? cacheHits / recentInteractions.length : 0;
    
    const avgResponseTime = recentInteractions.length > 0 
      ? recentInteractions.reduce((sum, i) => sum + i.responseTime, 0) / recentInteractions.length 
      : 0;

    return {
      operationsRegistered: this.operations.size,
      cacheSize: this.cache.size,
      cacheHitRate,
      rateLimitViolations: 0, // Would track from rate limit logs
      avgResponseTime
    };
  }
}

/**
 * Customer Operation Factory
 * Creates standardized customer operations
 */
export class CustomerOperationFactory {
  static createSelfServiceOperation<TInput, TOutput>(
    operationId: string,
    handler: (input: TInput, context: ServiceContext) => Promise<ServiceResult<TOutput>>,
    options: {
      publicAccess?: boolean;
      rateLimited?: boolean;
      cacheable?: boolean;
    } = {}
  ): CustomerOperation<TInput, TOutput> {
    return {
      operationId,
      category: 'self-service',
      publicAccess: options.publicAccess ?? false,
      rateLimited: options.rateLimited ?? true,
      cacheable: options.cacheable ?? true,
      execute: handler
    };
  }

  static createSupportOperation<TInput, TOutput>(
    operationId: string,
    handler: (input: TInput, context: ServiceContext) => Promise<ServiceResult<TOutput>>,
    options: {
      publicAccess?: boolean;
      rateLimited?: boolean;
      cacheable?: boolean;
    } = {}
  ): CustomerOperation<TInput, TOutput> {
    return {
      operationId,
      category: 'support',
      publicAccess: options.publicAccess ?? false,
      rateLimited: options.rateLimited ?? false,
      cacheable: options.cacheable ?? false,
      execute: handler
    };
  }

  static createPortalOperation<TInput, TOutput>(
    operationId: string,
    handler: (input: TInput, context: ServiceContext) => Promise<ServiceResult<TOutput>>,
    options: {
      publicAccess?: boolean;
      rateLimited?: boolean;
      cacheable?: boolean;
    } = {}
  ): CustomerOperation<TInput, TOutput> {
    return {
      operationId,
      category: 'portal',
      publicAccess: options.publicAccess ?? false,
      rateLimited: options.rateLimited ?? true,
      cacheable: options.cacheable ?? true,
      execute: handler
    };
  }
}