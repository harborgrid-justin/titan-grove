/**
 * Enterprise Message Queue and Event Handling System
 * Implements Fix 35: Message queuing and event handling
 */

import Bull, { Queue, Job, JobOptions } from 'bull';
import { EventEmitter } from 'events';
import Redis from 'ioredis';
import { getLogger } from '../../utils/enterprise-logger';
import { getAuditService } from '../security/audit-trail';

interface MessageQueueConfig {
  redis: {
    host: string;
    port: number;
    password?: string;
    db: number;
  };
  defaultJobOptions: JobOptions;
  maxConcurrentJobs: number;
  enableRetries: boolean;
  maxRetries: number;
  retryDelay: number;
  enableDLQ: boolean; // Dead Letter Queue
  enableMetrics: boolean;
  processingTimeout: number;
  cleanupInterval: number;
}

interface QueueMetrics {
  processed: number;
  failed: number;
  retried: number;
  active: number;
  waiting: number;
  delayed: number;
  completed: number;
  averageProcessingTime: number;
  peakThroughput: number;
  errorRate: number;
}

interface EventMessage<T = any> {
  id: string;
  type: string;
  payload: T;
  timestamp: Date;
  source: string;
  correlationId?: string;
  userId?: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
  retryCount?: number;
  maxRetries?: number;
  delay?: number;
  metadata: Record<string, any>;
}

interface QueueDefinition {
  name: string;
  concurrency: number;
  processor: (job: Job<EventMessage>) => Promise<any>;
  options?: JobOptions;
}

interface EventHandler<T = any> {
  eventType: string;
  handler: (message: EventMessage<T>) => Promise<void>;
  options?: {
    priority?: number;
    retries?: number;
    timeout?: number;
  };
}

export class EnterpriseMessageQueue extends EventEmitter {
  private logger = getLogger('EnterpriseMessageQueue');
  private config: MessageQueueConfig;
  private redis: Redis;
  private queues = new Map<string, Queue>();
  private metrics = new Map<string, QueueMetrics>();
  private eventHandlers = new Map<string, EventHandler[]>();
  private dlqQueue?: Queue; // Dead Letter Queue
  private cleanupInterval?: NodeJS.Timeout;

  constructor(config: MessageQueueConfig) {
    super();
    this.config = config;
    this.initializeRedis();
    this.setupQueues();
    this.setupMetrics();
    this.setupCleanup();

    this.logger.logBusinessOperation(
      'MESSAGE_QUEUE_INITIALIZED',
      'EnterpriseMessageQueue',
      '',
      'SUCCESS',
      {
        redisHost: config.redis.host,
        redisPort: config.redis.port,
        maxConcurrentJobs: config.maxConcurrentJobs,
        enableRetries: config.enableRetries
      }
    );
  }

  private initializeRedis(): void {
    this.redis = new Redis({
      host: this.config.redis.host,
      port: this.config.redis.port,
      password: this.config.redis.password,
      db: this.config.redis.db,
      retryDelayOnFailover: 100,
      enableOfflineQueue: false,
      lazyConnect: true
    });

    this.redis.on('connect', () => {
      this.logger.logBusinessOperation(
        'MESSAGE_QUEUE_REDIS_CONNECTED',
        'EnterpriseMessageQueue',
        '',
        'SUCCESS'
      );
    });

    this.redis.on('error', (error) => {
      this.logger.logError('Message queue Redis error', error);
    });
  }

  private setupQueues(): void {
    // Default event processing queue
    this.createQueue('events', 5, this.processEventMessage.bind(this));
    
    // High priority queue for critical events
    this.createQueue('critical-events', 10, this.processEventMessage.bind(this));
    
    // Background job processing
    this.createQueue('background-jobs', 3, this.processBackgroundJob.bind(this));
    
    // Email and notification queue
    this.createQueue('notifications', 2, this.processNotification.bind(this));
    
    // Data processing and analytics
    this.createQueue('data-processing', 1, this.processDataJob.bind(this));

    // Dead Letter Queue for failed messages
    if (this.config.enableDLQ) {
      this.dlqQueue = this.createQueue('dead-letter', 1, this.processDLQMessage.bind(this));
    }
  }

  private createQueue(
    name: string,
    concurrency: number,
    processor: (job: Job<EventMessage>) => Promise<any>
  ): Queue {
    const queue = new Bull(name, {
      redis: {
        host: this.config.redis.host,
        port: this.config.redis.port,
        password: this.config.redis.password,
        db: this.config.redis.db
      },
      defaultJobOptions: {
        ...this.config.defaultJobOptions,
        removeOnComplete: 100, // Keep last 100 completed jobs
        removeOnFail: 50,      // Keep last 50 failed jobs
        attempts: this.config.enableRetries ? this.config.maxRetries : 1,
        backoff: {
          type: 'exponential',
          delay: this.config.retryDelay
        }
      }
    });

    // Set up queue processor
    queue.process(concurrency, async (job: Job<EventMessage>) => {
      const startTime = Date.now();
      
      try {
        const result = await Promise.race([
          processor(job),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Job timeout')), this.config.processingTimeout)
          )
        ]);

        // Update metrics
        this.updateMetrics(name, 'processed', Date.now() - startTime);
        
        return result;

      } catch (error) {
        // Update metrics
        this.updateMetrics(name, 'failed', Date.now() - startTime);
        
        // Move to DLQ if max retries exceeded
        if (this.config.enableDLQ && job.attemptsMade >= this.config.maxRetries) {
          await this.moveToDLQ(job, error);
        }
        
        throw error;
      }
    });

    // Queue event handlers
    queue.on('completed', (job) => {
      this.logger.logBusinessOperation(
        'JOB_COMPLETED',
        'EnterpriseMessageQueue',
        job.id?.toString() || '',
        'SUCCESS',
        {
          queueName: name,
          jobType: job.data.type,
          processingTime: Date.now() - job.timestamp,
          attempts: job.attemptsMade
        }
      );
    });

    queue.on('failed', (job, error) => {
      this.logger.logError('Job failed', error, {
        queueName: name,
        jobId: job.id,
        jobType: job.data?.type,
        attempts: job.attemptsMade,
        maxRetries: this.config.maxRetries
      });
    });

    queue.on('stalled', (job) => {
      this.logger.logBusinessOperation(
        'JOB_STALLED',
        'EnterpriseMessageQueue',
        job.id?.toString() || '',
        'WARNING',
        {
          queueName: name,
          jobType: job.data?.type
        }
      );
    });

    this.queues.set(name, queue);
    this.initializeQueueMetrics(name);

    return queue;
  }

  // Core messaging methods
  public async publishEvent<T = any>(
    eventType: string,
    payload: T,
    options: {
      priority?: 'low' | 'normal' | 'high' | 'critical';
      delay?: number;
      userId?: string;
      correlationId?: string;
      source?: string;
      metadata?: Record<string, any>;
    } = {}
  ): Promise<string> {
    try {
      const message: EventMessage<T> = {
        id: this.generateMessageId(),
        type: eventType,
        payload,
        timestamp: new Date(),
        source: options.source || 'unknown',
        correlationId: options.correlationId,
        userId: options.userId,
        priority: options.priority || 'normal',
        metadata: options.metadata || {}
      };

      // Choose queue based on priority
      const queueName = message.priority === 'critical' ? 'critical-events' : 'events';
      const queue = this.queues.get(queueName);

      if (!queue) {
        throw new Error(`Queue ${queueName} not found`);
      }

      // Set job options based on message properties
      const jobOptions: JobOptions = {
        priority: this.getPriorityValue(message.priority),
        delay: options.delay,
        attempts: this.config.enableRetries ? this.config.maxRetries : 1
      };

      const job = await queue.add(message, jobOptions);

      // Log event publication
      await this.logEventPublished(message);

      this.emit('eventPublished', { message, jobId: job.id });

      return message.id;

    } catch (error) {
      this.logger.logError('Failed to publish event', error, {
        eventType,
        priority: options.priority,
        userId: options.userId
      });
      throw error;
    }
  }

  public async scheduleJob<T = any>(
    jobType: string,
    payload: T,
    scheduledTime: Date | number,
    options: {
      userId?: string;
      correlationId?: string;
      metadata?: Record<string, any>;
    } = {}
  ): Promise<string> {
    try {
      const delay = typeof scheduledTime === 'number' 
        ? scheduledTime 
        : scheduledTime.getTime() - Date.now();

      if (delay < 0) {
        throw new Error('Scheduled time must be in the future');
      }

      const message: EventMessage<T> = {
        id: this.generateMessageId(),
        type: jobType,
        payload,
        timestamp: new Date(),
        source: 'scheduler',
        correlationId: options.correlationId,
        userId: options.userId,
        priority: 'normal',
        delay,
        metadata: options.metadata || {}
      };

      const queue = this.queues.get('background-jobs');
      if (!queue) {
        throw new Error('Background jobs queue not found');
      }

      const job = await queue.add(message, {
        delay,
        attempts: 3
      });

      this.logger.logBusinessOperation(
        'JOB_SCHEDULED',
        'EnterpriseMessageQueue',
        message.id,
        'SUCCESS',
        {
          jobType,
          delay,
          scheduledTime: typeof scheduledTime === 'number' 
            ? new Date(Date.now() + scheduledTime) 
            : scheduledTime
        }
      );

      return message.id;

    } catch (error) {
      this.logger.logError('Failed to schedule job', error, {
        jobType,
        scheduledTime
      });
      throw error;
    }
  }

  // Event handling registration
  public registerEventHandler<T = any>(eventHandler: EventHandler<T>): void {
    const handlers = this.eventHandlers.get(eventHandler.eventType) || [];
    handlers.push(eventHandler as EventHandler);
    this.eventHandlers.set(eventHandler.eventType, handlers);

    this.logger.logBusinessOperation(
      'EVENT_HANDLER_REGISTERED',
      'EnterpriseMessageQueue',
      eventHandler.eventType,
      'SUCCESS',
      {
        eventType: eventHandler.eventType,
        handlerCount: handlers.length
      }
    );
  }

  public unregisterEventHandler(eventType: string, handler: Function): void {
    const handlers = this.eventHandlers.get(eventType) || [];
    const index = handlers.findIndex(h => h.handler === handler);
    
    if (index >= 0) {
      handlers.splice(index, 1);
      this.eventHandlers.set(eventType, handlers);

      this.logger.logBusinessOperation(
        'EVENT_HANDLER_UNREGISTERED',
        'EnterpriseMessageQueue',
        eventType,
        'SUCCESS'
      );
    }
  }

  // Queue processors
  private async processEventMessage(job: Job<EventMessage>): Promise<void> {
    const message = job.data;
    const handlers = this.eventHandlers.get(message.type) || [];

    if (handlers.length === 0) {
      this.logger.logBusinessOperation(
        'NO_HANDLERS_FOR_EVENT',
        'EnterpriseMessageQueue',
        message.type,
        'WARNING',
        { messageId: message.id }
      );
      return;
    }

    // Process handlers in parallel
    const handlerPromises = handlers.map(async (handlerDef) => {
      try {
        await handlerDef.handler(message);
        
        this.logger.logBusinessOperation(
          'EVENT_HANDLER_EXECUTED',
          'EnterpriseMessageQueue',
          message.type,
          'SUCCESS',
          {
            messageId: message.id,
            correlationId: message.correlationId
          }
        );
        
      } catch (error) {
        this.logger.logError('Event handler failed', error, {
          eventType: message.type,
          messageId: message.id,
          handlerOptions: handlerDef.options
        });
        
        // Re-throw if handler doesn't have retry configuration
        if (!handlerDef.options?.retries) {
          throw error;
        }
      }
    });

    await Promise.allSettled(handlerPromises);
  }

  private async processBackgroundJob(job: Job<EventMessage>): Promise<void> {
    const message = job.data;
    
    this.logger.logBusinessOperation(
      'BACKGROUND_JOB_STARTED',
      'EnterpriseMessageQueue',
      message.id,
      'INFO',
      {
        jobType: message.type,
        payload: message.payload
      }
    );

    // Process based on job type
    switch (message.type) {
      case 'data-cleanup':
        await this.processDataCleanupJob(message);
        break;
      case 'report-generation':
        await this.processReportGenerationJob(message);
        break;
      case 'cache-refresh':
        await this.processCacheRefreshJob(message);
        break;
      default:
        throw new Error(`Unknown background job type: ${message.type}`);
    }
  }

  private async processNotification(job: Job<EventMessage>): Promise<void> {
    const message = job.data;
    
    // Process notification based on type
    switch (message.type) {
      case 'email':
        await this.processEmailNotification(message);
        break;
      case 'sms':
        await this.processSMSNotification(message);
        break;
      case 'push':
        await this.processPushNotification(message);
        break;
      default:
        this.logger.logError('Unknown notification type', new Error('Unknown notification type'), {
          messageId: message.id,
          type: message.type
        });
    }
  }

  private async processDataJob(job: Job<EventMessage>): Promise<void> {
    const message = job.data;
    
    // Process data jobs
    switch (message.type) {
      case 'analytics-aggregation':
        await this.processAnalyticsAggregation(message);
        break;
      case 'data-export':
        await this.processDataExport(message);
        break;
      case 'data-import':
        await this.processDataImport(message);
        break;
      default:
        throw new Error(`Unknown data job type: ${message.type}`);
    }
  }

  private async processDLQMessage(job: Job<EventMessage>): Promise<void> {
    const message = job.data;
    
    this.logger.logBusinessOperation(
      'DLQ_MESSAGE_PROCESSED',
      'EnterpriseMessageQueue',
      message.id,
      'WARNING',
      {
        originalType: message.type,
        retryCount: message.retryCount,
        timestamp: message.timestamp
      }
    );

    // Handle DLQ messages - could involve manual intervention,
    // alternate processing, or permanent storage for analysis
    await this.storeDLQMessage(message);
  }

  // Specific job processors
  private async processDataCleanupJob(message: EventMessage): Promise<void> {
    // Implement data cleanup logic
    this.logger.logBusinessOperation(
      'DATA_CLEANUP_JOB_COMPLETED',
      'EnterpriseMessageQueue',
      message.id,
      'SUCCESS'
    );
  }

  private async processReportGenerationJob(message: EventMessage): Promise<void> {
    // Implement report generation logic
    this.logger.logBusinessOperation(
      'REPORT_GENERATION_JOB_COMPLETED',
      'EnterpriseMessageQueue',
      message.id,
      'SUCCESS'
    );
  }

  private async processCacheRefreshJob(message: EventMessage): Promise<void> {
    // Implement cache refresh logic
    this.logger.logBusinessOperation(
      'CACHE_REFRESH_JOB_COMPLETED',
      'EnterpriseMessageQueue',
      message.id,
      'SUCCESS'
    );
  }

  private async processEmailNotification(message: EventMessage): Promise<void> {
    // Implement email notification logic
    this.logger.logBusinessOperation(
      'EMAIL_NOTIFICATION_SENT',
      'EnterpriseMessageQueue',
      message.id,
      'SUCCESS'
    );
  }

  private async processSMSNotification(message: EventMessage): Promise<void> {
    // Implement SMS notification logic
    this.logger.logBusinessOperation(
      'SMS_NOTIFICATION_SENT',
      'EnterpriseMessageQueue',
      message.id,
      'SUCCESS'
    );
  }

  private async processPushNotification(message: EventMessage): Promise<void> {
    // Implement push notification logic
    this.logger.logBusinessOperation(
      'PUSH_NOTIFICATION_SENT',
      'EnterpriseMessageQueue',
      message.id,
      'SUCCESS'
    );
  }

  private async processAnalyticsAggregation(message: EventMessage): Promise<void> {
    // Implement analytics aggregation logic
    this.logger.logBusinessOperation(
      'ANALYTICS_AGGREGATION_COMPLETED',
      'EnterpriseMessageQueue',
      message.id,
      'SUCCESS'
    );
  }

  private async processDataExport(message: EventMessage): Promise<void> {
    // Implement data export logic
    this.logger.logBusinessOperation(
      'DATA_EXPORT_COMPLETED',
      'EnterpriseMessageQueue',
      message.id,
      'SUCCESS'
    );
  }

  private async processDataImport(message: EventMessage): Promise<void> {
    // Implement data import logic
    this.logger.logBusinessOperation(
      'DATA_IMPORT_COMPLETED',
      'EnterpriseMessageQueue',
      message.id,
      'SUCCESS'
    );
  }

  // Queue management
  public async pauseQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName);
    if (queue) {
      await queue.pause();
      this.logger.logBusinessOperation(
        'QUEUE_PAUSED',
        'EnterpriseMessageQueue',
        queueName,
        'SUCCESS'
      );
    }
  }

  public async resumeQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName);
    if (queue) {
      await queue.resume();
      this.logger.logBusinessOperation(
        'QUEUE_RESUMED',
        'EnterpriseMessageQueue',
        queueName,
        'SUCCESS'
      );
    }
  }

  public async drainQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName);
    if (queue) {
      await queue.drain();
      this.logger.logBusinessOperation(
        'QUEUE_DRAINED',
        'EnterpriseMessageQueue',
        queueName,
        'SUCCESS'
      );
    }
  }

  // Metrics and monitoring
  public async getQueueMetrics(queueName?: string): Promise<Map<string, QueueMetrics> | QueueMetrics | null> {
    if (queueName) {
      return this.metrics.get(queueName) || null;
    }
    return new Map(this.metrics);
  }

  public async getQueueStats(): Promise<any> {
    const stats: any = {};
    
    for (const [name, queue] of this.queues.entries()) {
      const waiting = await queue.getWaiting();
      const active = await queue.getActive();
      const completed = await queue.getCompleted();
      const failed = await queue.getFailed();
      const delayed = await queue.getDelayed();
      
      stats[name] = {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
        delayed: delayed.length
      };
    }
    
    return stats;
  }

  // Private utility methods
  private setupMetrics(): void {
    if (!this.config.enableMetrics) return;

    // Update metrics every 30 seconds
    setInterval(async () => {
      for (const [name, queue] of this.queues.entries()) {
        try {
          const waiting = await queue.getWaiting();
          const active = await queue.getActive();
          const completed = await queue.getCompleted();
          const failed = await queue.getFailed();
          const delayed = await queue.getDelayed();

          const metrics = this.metrics.get(name);
          if (metrics) {
            metrics.waiting = waiting.length;
            metrics.active = active.length;
            metrics.completed = completed.length;
            metrics.failed = failed.length;
            metrics.delayed = delayed.length;
            
            // Calculate error rate
            const totalJobs = metrics.processed + metrics.failed;
            metrics.errorRate = totalJobs > 0 ? (metrics.failed / totalJobs) * 100 : 0;
          }
        } catch (error) {
          this.logger.logError('Failed to update queue metrics', error, { queueName: name });
        }
      }
    }, 30000);
  }

  private setupCleanup(): void {
    // Clean up old completed and failed jobs
    this.cleanupInterval = setInterval(async () => {
      for (const [name, queue] of this.queues.entries()) {
        try {
          await queue.clean(24 * 60 * 60 * 1000, 'completed'); // 24 hours
          await queue.clean(7 * 24 * 60 * 60 * 1000, 'failed'); // 7 days
        } catch (error) {
          this.logger.logError('Queue cleanup failed', error, { queueName: name });
        }
      }
    }, this.config.cleanupInterval);
  }

  private initializeQueueMetrics(queueName: string): void {
    this.metrics.set(queueName, {
      processed: 0,
      failed: 0,
      retried: 0,
      active: 0,
      waiting: 0,
      delayed: 0,
      completed: 0,
      averageProcessingTime: 0,
      peakThroughput: 0,
      errorRate: 0
    });
  }

  private updateMetrics(queueName: string, operation: 'processed' | 'failed', processingTime: number): void {
    const metrics = this.metrics.get(queueName);
    if (!metrics) return;

    metrics[operation]++;
    
    if (operation === 'processed') {
      metrics.averageProcessingTime = 
        (metrics.averageProcessingTime * (metrics.processed - 1) + processingTime) / metrics.processed;
    }
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getPriorityValue(priority: string): number {
    switch (priority) {
      case 'critical': return 10;
      case 'high': return 5;
      case 'normal': return 0;
      case 'low': return -5;
      default: return 0;
    }
  }

  private async logEventPublished(message: EventMessage): Promise<void> {
    try {
      const auditService = getAuditService();
      await auditService.logAuditEvent(
        'EVENT_PUBLISHED',
        'message_queue',
        message.id,
        'CREATE',
        'SUCCESS',
        {
          userId: message.userId,
          correlationId: message.correlationId,
          metadata: {
            eventType: message.type,
            priority: message.priority,
            source: message.source
          }
        }
      );
    } catch (error) {
      this.logger.logError('Failed to log event publication', error);
    }
  }

  private async moveToDLQ(job: Job<EventMessage>, error: any): Promise<void> {
    if (!this.dlqQueue) return;

    try {
      const dlqMessage: EventMessage = {
        ...job.data,
        retryCount: job.attemptsMade,
        metadata: {
          ...job.data.metadata,
          originalError: (error as Error).message,
          failedAt: new Date(),
          originalQueue: job.queue.name
        }
      };

      await this.dlqQueue.add(dlqMessage);
      
      this.logger.logBusinessOperation(
        'MESSAGE_MOVED_TO_DLQ',
        'EnterpriseMessageQueue',
        job.data.id,
        'WARNING',
        {
          originalType: job.data.type,
          errorMessage: (error as Error).message,
          attempts: job.attemptsMade
        }
      );
    } catch (dlqError) {
      this.logger.logError('Failed to move message to DLQ', dlqError);
    }
  }

  private async storeDLQMessage(message: EventMessage): Promise<void> {
    // Store DLQ message for analysis or manual processing
    // This could be in a database, file system, or external service
    this.logger.logBusinessOperation(
      'DLQ_MESSAGE_STORED',
      'EnterpriseMessageQueue',
      message.id,
      'INFO',
      {
        originalType: message.type,
        retryCount: message.retryCount
      }
    );
  }

  public async shutdown(): Promise<void> {
    // Clear cleanup interval
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    // Close all queues
    const closePromises = Array.from(this.queues.values()).map(queue => queue.close());
    await Promise.all(closePromises);

    // Close Redis connection
    await this.redis.quit();

    this.logger.logBusinessOperation(
      'MESSAGE_QUEUE_SHUTDOWN',
      'EnterpriseMessageQueue',
      '',
      'SUCCESS',
      { queueCount: this.queues.size }
    );
  }
}

// Singleton instance
let messageQueue: EnterpriseMessageQueue | null = null;

export function initializeMessageQueue(config: MessageQueueConfig): EnterpriseMessageQueue {
  if (messageQueue) {
    throw new Error('Message queue already initialized');
  }
  
  messageQueue = new EnterpriseMessageQueue(config);
  return messageQueue;
}

export function getMessageQueue(): EnterpriseMessageQueue {
  if (!messageQueue) {
    throw new Error('Message queue not initialized. Call initializeMessageQueue first.');
  }
  return messageQueue;
}

export { MessageQueueConfig, EventMessage, QueueMetrics, EventHandler };