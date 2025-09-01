/**
 * Service Factory
 * Provides standardized service initialization with message queue and cache integration
 */

import { MessageQueueManager } from '../../core/message-queue/MessageQueueManager';
import { CacheManager } from '../../cache/CacheManager';
import { createLogger } from '../../utils/logger';
import type { Logger } from 'winston';
import {
  ServiceIntegrationContext,
  StandardServiceConfig
} from '../interfaces/service-integration';
import { QueueType } from '../../core/message-queue/types';

/**
 * Factory for creating standardized services with integrated queue and cache support
 */
export class ServiceFactory {
  private static messageQueue: MessageQueueManager | null = null;
  private static cache: CacheManager | null = null;
  private static logger: Logger | null = null;

  /**
   * Initialize the service factory with shared resources
   */
  static async initialize(
    messageQueueConfig: any,
    cacheConfig: any,
    loggerConfig?: { level?: string }
  ): Promise<void> {
    // Initialize logger
    this.logger = createLogger({ level: loggerConfig?.level || 'info' });

    // Initialize message queue
    this.messageQueue = new MessageQueueManager(messageQueueConfig);
    await this.messageQueue.initialize();

    // Initialize cache
    this.cache = new CacheManager(cacheConfig, this.logger);
    await this.cache.initialize();

    this.logger.info('ServiceFactory initialized successfully');
  }

  /**
   * Create a service integration context for a specific service
   */
  static createContext(config: StandardServiceConfig): ServiceIntegrationContext {
    if (!this.messageQueue || !this.cache || !this.logger) {
      throw new Error('ServiceFactory must be initialized before creating contexts');
    }

    return {
      messageQueue: this.messageQueue,
      cache: this.cache,
      logger: this.logger,
      config
    };
  }

  /**
   * Create standard configuration for common business modules
   */
  static createStandardConfig(moduleName: string): StandardServiceConfig {
    const configs: Record<string, StandardServiceConfig> = {
      financial: {
        serviceName: 'financial-service',
        queueTypes: [QueueType.FINANCIAL, QueueType.AUDIT],
        cacheConfig: {
          defaultTTL: 600, // 10 minutes
          keyPrefix: 'fin',
          operationTTLs: {
            'balance': 300,      // 5 minutes for balance data
            'transaction': 1800, // 30 minutes for transaction data
            'report': 3600       // 1 hour for reports
          }
        },
        messageQueueConfig: {
          defaultPriority: 1, // High priority for financial operations
          retryAttempts: 3,
          compliance: {
            dataClassification: 'CONFIDENTIAL',
            auditRequired: true
          }
        }
      },
      hr: {
        serviceName: 'hr-service',
        queueTypes: [QueueType.HR, QueueType.AUDIT],
        cacheConfig: {
          defaultTTL: 1800, // 30 minutes
          keyPrefix: 'hr',
          operationTTLs: {
            'employee': 900,     // 15 minutes for employee data
            'payroll': 300,      // 5 minutes for payroll data
            'benefits': 3600     // 1 hour for benefits data
          }
        },
        messageQueueConfig: {
          defaultPriority: 2,
          retryAttempts: 3,
          compliance: {
            dataClassification: 'CONFIDENTIAL',
            auditRequired: true
          }
        }
      },
      crm: {
        serviceName: 'crm-service',
        queueTypes: [QueueType.CRM, QueueType.NOTIFICATION],
        cacheConfig: {
          defaultTTL: 900, // 15 minutes
          keyPrefix: 'crm',
          operationTTLs: {
            'customer': 1800,    // 30 minutes for customer data
            'opportunity': 600,  // 10 minutes for opportunity data
            'activity': 300      // 5 minutes for activity data
          }
        },
        messageQueueConfig: {
          defaultPriority: 2,
          retryAttempts: 2,
          compliance: {
            dataClassification: 'INTERNAL',
            auditRequired: false
          }
        }
      },
      scm: {
        serviceName: 'scm-service',
        queueTypes: [QueueType.SCM, QueueType.INVENTORY],
        cacheConfig: {
          defaultTTL: 600, // 10 minutes
          keyPrefix: 'scm',
          operationTTLs: {
            'inventory': 120,    // 2 minutes for inventory levels
            'supplier': 1800,    // 30 minutes for supplier data
            'procurement': 600   // 10 minutes for procurement data
          }
        },
        messageQueueConfig: {
          defaultPriority: 2,
          retryAttempts: 3,
          compliance: {
            dataClassification: 'INTERNAL',
            auditRequired: false
          }
        }
      },
      procurement: {
        serviceName: 'procurement-service',
        queueTypes: [QueueType.PROCUREMENT, QueueType.FINANCIAL, QueueType.AUDIT],
        cacheConfig: {
          defaultTTL: 900, // 15 minutes
          keyPrefix: 'proc',
          operationTTLs: {
            'vendor': 1800,      // 30 minutes for vendor data
            'contract': 3600,    // 1 hour for contract data
            'purchase': 600      // 10 minutes for purchase data
          }
        },
        messageQueueConfig: {
          defaultPriority: 1, // High priority for procurement
          retryAttempts: 3,
          compliance: {
            dataClassification: 'CONFIDENTIAL',
            auditRequired: true
          }
        }
      },
      manufacturing: {
        serviceName: 'manufacturing-service',
        queueTypes: [QueueType.MANUFACTURING, QueueType.INVENTORY, QueueType.QUALITY],
        cacheConfig: {
          defaultTTL: 300, // 5 minutes
          keyPrefix: 'mfg',
          operationTTLs: {
            'production': 60,    // 1 minute for production data
            'quality': 600,      // 10 minutes for quality data
            'schedule': 300      // 5 minutes for schedule data
          }
        },
        messageQueueConfig: {
          defaultPriority: 1, // High priority for manufacturing
          retryAttempts: 2,
          compliance: {
            dataClassification: 'INTERNAL',
            auditRequired: false
          }
        }
      },
      inventory: {
        serviceName: 'inventory-service',
        queueTypes: [QueueType.INVENTORY, QueueType.SCM],
        cacheConfig: {
          defaultTTL: 120, // 2 minutes
          keyPrefix: 'inv',
          operationTTLs: {
            'stock-level': 60,   // 1 minute for stock levels
            'location': 600,     // 10 minutes for location data
            'movement': 300      // 5 minutes for movement data
          }
        },
        messageQueueConfig: {
          defaultPriority: 2,
          retryAttempts: 3,
          compliance: {
            dataClassification: 'INTERNAL',
            auditRequired: false
          }
        }
      },
      'service-command-center': {
        serviceName: 'service-command-center-service',
        queueTypes: [QueueType.SERVICE_COMMAND_CENTER, QueueType.SERVICE, QueueType.MAINTENANCE, QueueType.NOTIFICATION],
        cacheConfig: {
          defaultTTL: 300, // 5 minutes
          keyPrefix: 'scc',
          operationTTLs: {
            'command-center': 900,    // 15 minutes for command center data
            'resource': 300,          // 5 minutes for resource data
            'status': 60,             // 1 minute for status data
            'analytics': 600,         // 10 minutes for analytics
            'emergency': 30           // 30 seconds for emergency data
          }
        },
        messageQueueConfig: {
          defaultPriority: 1, // High priority for service command center
          retryAttempts: 3,
          compliance: {
            dataClassification: 'INTERNAL',
            auditRequired: true // Audit critical service operations
          }
        }
      }
    };

    return configs[moduleName] || {
      serviceName: `${moduleName}-service`,
      queueTypes: [QueueType.SYSTEM],
      cacheConfig: {
        defaultTTL: 600,
        keyPrefix: moduleName.substring(0, 3),
      },
      messageQueueConfig: {
        defaultPriority: 3,
        retryAttempts: 2,
        compliance: {
          dataClassification: 'INTERNAL',
          auditRequired: false
        }
      }
    };
  }

  /**
   * Get the shared message queue instance
   */
  static getMessageQueue(): MessageQueueManager {
    if (!this.messageQueue) {
      throw new Error('MessageQueue not initialized. Call ServiceFactory.initialize() first');
    }
    return this.messageQueue;
  }

  /**
   * Get the shared cache instance
   */
  static getCache(): CacheManager {
    if (!this.cache) {
      throw new Error('Cache not initialized. Call ServiceFactory.initialize() first');
    }
    return this.cache;
  }

  /**
   * Get the shared logger instance
   */
  static getLogger(): Logger {
    if (!this.logger) {
      throw new Error('Logger not initialized. Call ServiceFactory.initialize() first');
    }
    return this.logger;
  }

  /**
   * Shutdown all services gracefully
   */
  static async shutdown(): Promise<void> {
    if (this.logger) {
      this.logger.info('ServiceFactory shutting down...');
    }

    if (this.messageQueue) {
      await this.messageQueue.shutdown();
      this.messageQueue = null;
    }

    if (this.cache) {
      await this.cache.stop();
      this.cache = null;
    }

    if (this.logger) {
      this.logger.info('ServiceFactory shutdown complete');
      this.logger = null;
    }
  }
}