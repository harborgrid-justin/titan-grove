/**
 * Standard Service Base
 * Extended base class that provides message queue and cache integration
 * for all business modules following a standardized pattern
 */

import { BaseManager } from './base-manager';
import type { MessageQueueManager } from '../../core/message-queue/MessageQueueManager';
import type { CacheManager } from '../../cache/CacheManager';
import type { Logger } from 'winston';
import {
  IQueueableService,
  ICacheableService,
  IMonitorableService,
  ServiceIntegrationContext,
  StandardServiceConfig,
  MessageQueueOptions,
  ServiceHealthCheck,
  ServiceMetrics
} from '../interfaces/service-integration';
import { MessagePayload, QueueType, MessagePriority } from '../../core/message-queue/types';
import { MessageQueueUtils } from '../../core/message-queue/utils';

/**
 * Standard service base class that provides integrated message queue and cache functionality
 * Extends BaseManager to maintain compatibility with existing modules
 */
export abstract class StandardServiceBase 
  extends BaseManager 
  implements IQueueableService, ICacheableService, IMonitorableService {

  protected messageQueue: MessageQueueManager;
  protected cache: CacheManager;
  protected logger: Logger;
  protected serviceConfig: StandardServiceConfig;
  
  // Metrics tracking
  private metrics = {
    operations: { total: 0, success: 0, failed: 0, totalTime: 0 },
    cache: { hits: 0, misses: 0 },
    messageQueue: { sent: 0, processed: 0, failed: 0 }
  };

  constructor(context: ServiceIntegrationContext) {
    super();
    this.messageQueue = context.messageQueue;
    this.cache = context.cache;
    this.logger = context.logger;
    this.serviceConfig = context.config;
  }

  // ==================== Message Queue Integration ====================

  /**
   * Send a message to the message queue
   */
  async sendMessage(
    queueType: QueueType, 
    messageType: string, 
    data: any, 
    options?: MessageQueueOptions
  ): Promise<void> {
    try {
      const message = MessageQueueUtils.createMessage(
        messageType,
        data,
        {
          source: this.serviceConfig.serviceName,
          priority: options?.priority || this.serviceConfig.messageQueueConfig?.defaultPriority || MessagePriority.NORMAL,
          correlationId: options?.correlationId,
          compliance: {
            dataClassification: options?.compliance?.dataClassification || 
              this.serviceConfig.messageQueueConfig?.compliance.dataClassification || 'INTERNAL',
            auditRequired: options?.compliance?.auditRequired || 
              this.serviceConfig.messageQueueConfig?.compliance.auditRequired || false,
            encryptionRequired: options?.compliance?.encryptionRequired || false
          }
        }
      );

      await this.messageQueue.addMessage(queueType, message, {
        delay: options?.delay,
        attempts: options?.attempts || this.serviceConfig.messageQueueConfig?.retryAttempts || 3
      });

      this.metrics.messageQueue.sent++;
      this.logger.debug(`Message sent to ${queueType} queue`, { 
        messageType, 
        messageId: message.id,
        serviceName: this.serviceConfig.serviceName 
      });
    } catch (error) {
      this.metrics.messageQueue.failed++;
      this.logger.error(`Failed to send message to ${queueType} queue`, { 
        messageType, 
        error: error instanceof Error ? error.message : 'Unknown error',
        serviceName: this.serviceConfig.serviceName 
      });
      throw error;
    }
  }

  /**
   * Process incoming messages - to be implemented by subclasses
   */
  abstract processMessage(message: MessagePayload): Promise<any>;

  /**
   * Get the queue types this service handles - to be implemented by subclasses
   */
  abstract getHandledQueueTypes(): QueueType[];

  // ==================== Cache Integration ====================

  /**
   * Get data from cache
   */
  async getCached(key: string): Promise<any> {
    try {
      const fullKey = this.generateCacheKey('get', { key });
      const result = await this.cache.get(fullKey);
      
      if (result !== null) {
        this.metrics.cache.hits++;
        this.logger.debug(`Cache hit for key: ${fullKey}`, { serviceName: this.serviceConfig.serviceName });
        return result;
      } else {
        this.metrics.cache.misses++;
        this.logger.debug(`Cache miss for key: ${fullKey}`, { serviceName: this.serviceConfig.serviceName });
        return null;
      }
    } catch (error) {
      this.logger.error(`Cache get error for key: ${key}`, { 
        error: error instanceof Error ? error.message : 'Unknown error',
        serviceName: this.serviceConfig.serviceName 
      });
      return null;
    }
  }

  /**
   * Set data in cache
   */
  async setCached(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const fullKey = this.generateCacheKey('set', { key });
      const effectiveTTL = ttl || this.getCacheTTL('default');
      
      await this.cache.set(fullKey, value, effectiveTTL);
      this.logger.debug(`Cache set for key: ${fullKey}`, { 
        ttl: effectiveTTL,
        serviceName: this.serviceConfig.serviceName 
      });
    } catch (error) {
      this.logger.error(`Cache set error for key: ${key}`, { 
        error: error instanceof Error ? error.message : 'Unknown error',
        serviceName: this.serviceConfig.serviceName 
      });
      throw error;
    }
  }

  /**
   * Delete data from cache
   */
  async deleteCached(key: string): Promise<void> {
    try {
      const fullKey = this.generateCacheKey('delete', { key });
      await this.cache.del(fullKey);
      this.logger.debug(`Cache delete for key: ${fullKey}`, { serviceName: this.serviceConfig.serviceName });
    } catch (error) {
      this.logger.error(`Cache delete error for key: ${key}`, { 
        error: error instanceof Error ? error.message : 'Unknown error',
        serviceName: this.serviceConfig.serviceName 
      });
      throw error;
    }
  }

  /**
   * Generate cache key with service prefix
   */
  generateCacheKey(operation: string, params: any): string {
    const prefix = this.serviceConfig.cacheConfig?.keyPrefix || this.serviceConfig.serviceName;
    const paramString = typeof params === 'object' ? JSON.stringify(params) : String(params);
    return `${prefix}:${operation}:${paramString}`;
  }

  /**
   * Get cache TTL for operation type
   */
  getCacheTTL(operationType: string): number {
    if (this.serviceConfig.cacheConfig?.operationTTLs?.[operationType]) {
      return this.serviceConfig.cacheConfig.operationTTLs[operationType];
    }
    return this.serviceConfig.cacheConfig?.defaultTTL || 300; // 5 minutes default
  }

  // ==================== Monitoring Integration ====================

  /**
   * Check service health
   */
  async healthCheck(): Promise<ServiceHealthCheck> {
    const healthCheck: ServiceHealthCheck = {
      serviceName: this.serviceConfig.serviceName,
      status: 'healthy',
      timestamp: new Date(),
      details: {}
    };

    try {
      // Check message queue health
      if (this.messageQueue) {
        const queueHealth = await this.messageQueue.getSystemHealth();
        healthCheck.details.messageQueue = queueHealth.status === 'HEALTHY' ? 'connected' : 'error';
        if (queueHealth.status !== 'HEALTHY') {
          healthCheck.status = 'degraded';
        }
      } else {
        healthCheck.details.messageQueue = 'disconnected';
        healthCheck.status = 'degraded';
      }

      // Check cache health
      if (this.cache) {
        const cacheHealth = await this.cache.healthCheck();
        healthCheck.details.cache = cacheHealth.status === 'healthy' ? 'connected' : 'error';
        if (cacheHealth.status !== 'healthy') {
          healthCheck.status = 'degraded';
        }
      } else {
        healthCheck.details.cache = 'disconnected';
        healthCheck.status = 'degraded';
      }

      // Additional service-specific health checks can be implemented by subclasses
      const serviceSpecificHealth = await this.performServiceSpecificHealthCheck();
      if (serviceSpecificHealth) {
        healthCheck.details = { ...healthCheck.details, ...serviceSpecificHealth };
      }

    } catch (error) {
      healthCheck.status = 'unhealthy';
      (healthCheck.details as any).error = error instanceof Error ? error.message : 'Unknown error';
    }

    return healthCheck;
  }

  /**
   * Get service metrics
   */
  async getMetrics(): Promise<ServiceMetrics> {
    return {
      serviceName: this.serviceConfig.serviceName,
      timestamp: new Date(),
      operations: {
        total: this.metrics.operations.total,
        success: this.metrics.operations.success,
        failed: this.metrics.operations.failed,
        averageResponseTime: this.metrics.operations.total > 0 
          ? this.metrics.operations.totalTime / this.metrics.operations.total 
          : 0
      },
      cache: {
        hits: this.metrics.cache.hits,
        misses: this.metrics.cache.misses,
        hitRate: (this.metrics.cache.hits + this.metrics.cache.misses) > 0 
          ? this.metrics.cache.hits / (this.metrics.cache.hits + this.metrics.cache.misses) 
          : 0
      },
      messageQueue: {
        sent: this.metrics.messageQueue.sent,
        processed: this.metrics.messageQueue.processed,
        failed: this.metrics.messageQueue.failed
      }
    };
  }

  // ==================== Utility Methods ====================

  /**
   * Execute operation with metrics tracking
   */
  protected async executeWithMetrics<T>(operation: () => Promise<T>): Promise<T> {
    const startTime = Date.now();
    this.metrics.operations.total++;

    try {
      const result = await operation();
      this.metrics.operations.success++;
      this.metrics.operations.totalTime += Date.now() - startTime;
      return result;
    } catch (error) {
      this.metrics.operations.failed++;
      this.metrics.operations.totalTime += Date.now() - startTime;
      throw error;
    }
  }

  /**
   * Execute operation with caching support
   */
  protected async executeWithCache<T>(
    cacheKey: string,
    operation: () => Promise<T>,
    ttl?: number,
    operationType = 'default'
  ): Promise<T> {
    // Try to get from cache first
    const cached = await this.getCached(cacheKey);
    if (cached !== null) {
      return cached;
    }

    // Execute operation and cache result
    const result = await operation();
    await this.setCached(cacheKey, result, ttl || this.getCacheTTL(operationType));
    
    return result;
  }

  /**
   * Override in subclasses for service-specific health checks
   */
  protected async performServiceSpecificHealthCheck(): Promise<Record<string, any> | null> {
    return null;
  }

  /**
   * Override in subclasses to handle message processing completion
   */
  protected markMessageProcessed(): void {
    this.metrics.messageQueue.processed++;
  }
}