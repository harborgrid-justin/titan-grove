/**
 * Service Integration Interfaces
 * Standard interfaces for message queue and cache integration across all modules
 */

import type { MessageQueueManager } from '../../core/message-queue/MessageQueueManager';
import type { CacheManager } from '../../cache/CacheManager';
import type { MessagePayload, QueueType } from '../../core/message-queue/types';
import type { Logger } from 'winston';

/**
 * Message queue integration interface
 */
export interface IQueueableService {
  /**
   * Send a message to the appropriate queue
   */
  sendMessage(queueType: QueueType, messageType: string, data: any, options?: MessageQueueOptions): Promise<void>;
  
  /**
   * Process incoming messages for this service
   */
  processMessage(message: MessagePayload): Promise<any>;
  
  /**
   * Get the queue types this service handles
   */
  getHandledQueueTypes(): QueueType[];
}

/**
 * Cache integration interface
 */
export interface ICacheableService {
  /**
   * Get cached data
   */
  getCached(key: string): Promise<any>;
  
  /**
   * Set cached data
   */
  setCached(key: string, value: any, ttl?: number): Promise<void>;
  
  /**
   * Delete cached data
   */
  deleteCached(key: string): Promise<void>;
  
  /**
   * Generate cache key for this service
   */
  generateCacheKey(operation: string, params: any): string;
  
  /**
   * Get cache TTL for different operation types
   */
  getCacheTTL(operationType: string): number;
}

/**
 * Service health monitoring interface
 */
export interface IMonitorableService {
  /**
   * Check service health
   */
  healthCheck(): Promise<ServiceHealthCheck>;
  
  /**
   * Get service metrics
   */
  getMetrics(): Promise<ServiceMetrics>;
}

/**
 * Options for message queue operations
 */
export interface MessageQueueOptions {
  priority?: number;
  delay?: number;
  attempts?: number;
  correlationId?: string;
  source?: string;
  compliance?: {
    dataClassification?: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
    auditRequired?: boolean;
    encryptionRequired?: boolean;
  };
}

/**
 * Service health check result
 */
export interface ServiceHealthCheck {
  serviceName: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: Date;
  details: {
    messageQueue?: 'connected' | 'disconnected' | 'error';
    cache?: 'connected' | 'disconnected' | 'error';
    database?: 'connected' | 'disconnected' | 'error';
    dependencies?: Record<string, string>;
  };
}

/**
 * Service metrics data
 */
export interface ServiceMetrics {
  serviceName: string;
  timestamp: Date;
  operations: {
    total: number;
    success: number;
    failed: number;
    averageResponseTime: number;
  };
  cache: {
    hits: number;
    misses: number;
    hitRate: number;
  };
  messageQueue: {
    sent: number;
    processed: number;
    failed: number;
  };
}

/**
 * Service configuration for standardized services
 */
export interface StandardServiceConfig {
  serviceName: string;
  queueTypes?: QueueType[];
  cacheConfig?: {
    defaultTTL: number;
    keyPrefix: string;
    operationTTLs?: Record<string, number>;
  };
  messageQueueConfig?: {
    defaultPriority: number;
    retryAttempts: number;
    compliance: {
      dataClassification: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
      auditRequired: boolean;
    };
  };
}

/**
 * Service integration context containing shared resources
 */
export interface ServiceIntegrationContext {
  messageQueue: MessageQueueManager;
  cache: CacheManager;
  logger: Logger;
  config: StandardServiceConfig;
}