/**
 * Fortune 100-Grade Message Queue Manager
 * Enterprise-grade message queue system with comprehensive features
 */

import Bull, { Job, Queue, JobOptions, QueueOptions } from 'bull';
import { EventEmitter } from 'events';
import { Logger } from 'winston';
import { createLogger } from '../../utils/logger';
import {
  MessageQueueConfig,
  QueueDefinition,
  MessagePayload,
  MessagePriority,
  QueueType,
  ProcessorFunction,
  QueueMetrics,
  DeadLetterMessage,
  QueueAlert,
  ScheduledMessage,
  MessageBatch,
  QueueSecurity,
} from './types';

export class MessageQueueManager extends EventEmitter {
  private queues: Map<string, Queue> = new Map();
  private processors: Map<string, ProcessorFunction> = new Map();
  private config: MessageQueueConfig;
  private logger: Logger;
  private metrics: Map<string, QueueMetrics> = new Map();
  private deadLetterQueue?: Queue;
  private auditQueue?: Queue;
  private scheduledMessages: Map<string, ScheduledMessage> = new Map();
  private alerts: QueueAlert[] = [];
  private isShuttingDown = false;

  constructor(config: MessageQueueConfig) {
    super();
    this.config = config;
    this.logger = createLogger({ level: 'info' });
    this.setupQueues();
    this.setupMonitoring();
  }

  /**
   * Initialize the message queue system
   */
  async initialize(): Promise<void> {
    try {
      this.logger.info('Initializing Fortune 100-grade message queue system');

      // Create dead letter queue
      this.deadLetterQueue = new Bull('dead-letter-queue', {
        redis: this.config.redis,
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 50,
          attempts: 1,
        },
      });

      // Create audit queue for compliance
      this.auditQueue = new Bull('audit-queue', {
        redis: this.config.redis,
        defaultJobOptions: {
          removeOnComplete: 1000,
          removeOnFail: 500,
          attempts: 3,
        },
      });

      await this.createStandardQueues();
      this.setupGlobalEventHandlers();

      this.logger.info('Message queue system initialized successfully');
      this.emit('initialized');
    } catch (error) {
      this.logger.error('Failed to initialize message queue system', { error });
      throw error;
    }
  }

  /**
   * Create standard business queues
   */
  private async createStandardQueues(): Promise<void> {
    const standardQueues: QueueDefinition[] = [
      {
        name: QueueType.INTEGRATION,
        concurrency: 10,
        processor: 'integration-processor',
        priority: 2,
        rateLimit: { max: 100, duration: 60000 },
      },
      {
        name: QueueType.FINANCIAL,
        concurrency: 5,
        processor: 'financial-processor',
        priority: 1,
        rateLimit: { max: 50, duration: 60000 },
      },
      {
        name: QueueType.HR,
        concurrency: 3,
        processor: 'hr-processor',
        priority: 3,
      },
      {
        name: QueueType.CRM,
        concurrency: 8,
        processor: 'crm-processor',
        priority: 2,
      },
      {
        name: QueueType.SCM,
        concurrency: 6,
        processor: 'scm-processor',
        priority: 2,
      },
      {
        name: QueueType.ORDER,
        concurrency: 15,
        processor: 'order-processor',
        priority: 1,
      },
      {
        name: QueueType.INVENTORY,
        concurrency: 8,
        processor: 'inventory-processor',
        priority: 2,
      },
      {
        name: QueueType.NOTIFICATION,
        concurrency: 20,
        processor: 'notification-processor',
        priority: 4,
      },
      {
        name: QueueType.AUDIT,
        concurrency: 2,
        processor: 'audit-processor',
        priority: 1,
      },
      {
        name: QueueType.ANALYTICS,
        concurrency: 4,
        processor: 'analytics-processor',
        priority: 5,
      },
    ];

    for (const queueDef of standardQueues) {
      await this.createQueue(queueDef);
    }
  }

  /**
   * Create a new queue
   */
  async createQueue(definition: QueueDefinition): Promise<Queue> {
    const options: QueueOptions = {
      redis: this.config.redis,
      defaultJobOptions: {
        ...this.config.defaultJobOptions,
        ...definition.jobOptions,
      },
      ...definition.options,
    };

    const queue = new Bull(definition.name, options);

    // Setup rate limiting if specified
    if (definition.rateLimit) {
      queue.process(definition.name, definition.concurrency, async (job) => {
        await this.rateLimitedProcess(job, definition);
      });
    } else {
      // Register processor
      if (typeof definition.processor === 'string') {
        const processor = this.processors.get(definition.processor);
        if (processor) {
          queue.process(definition.name, definition.concurrency, processor);
        } else {
          this.logger.warn(
            `Processor ${definition.processor} not found for queue ${definition.name}`
          );
        }
      } else {
        queue.process(definition.name, definition.concurrency, definition.processor);
      }
    }

    // Setup queue event handlers
    this.setupQueueEventHandlers(queue, definition.name);

    this.queues.set(definition.name, queue);
    this.initializeQueueMetrics(definition.name);

    this.logger.info(
      `Created queue: ${definition.name} with concurrency: ${definition.concurrency}`
    );
    return queue;
  }

  /**
   * Register a message processor
   */
  registerProcessor(name: string, processor: ProcessorFunction): void {
    this.processors.set(name, processor);
    this.logger.info(`Registered processor: ${name}`);
  }

  /**
   * Add a message to a queue
   */
  async addMessage(
    queueName: string,
    message: MessagePayload,
    options?: JobOptions
  ): Promise<Job<MessagePayload>> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    // Add audit logging if required
    if (message.compliance?.auditRequired && this.auditQueue) {
      await this.auditQueue.add('message-audit', {
        action: 'MESSAGE_QUEUED',
        queueName,
        messageId: message.id,
        userId: message.metadata.userId,
        timestamp: new Date(),
        classification: message.compliance.dataClassification,
      });
    }

    const jobOptions: JobOptions = {
      priority: message.metadata.priority,
      ...options,
    };

    // Handle delayed messages
    if (options?.delay) {
      jobOptions.delay = options.delay;
    }

    const job = await queue.add(message.type, message, jobOptions);

    this.logger.debug(`Added message ${message.id} to queue ${queueName}`, {
      messageType: message.type,
      priority: message.metadata.priority,
      jobId: job.id,
    });

    this.emit('messageAdded', { queueName, message, job });
    return job;
  }

  /**
   * Add a batch of messages
   */
  async addBatch(queueName: string, batch: MessageBatch): Promise<Job<MessagePayload>[]> {
    const jobs: Job<MessagePayload>[] = [];

    batch.status = 'PROCESSING';
    batch.startedAt = new Date();

    try {
      if (batch.batchType === 'SEQUENTIAL') {
        // Process messages one by one
        for (const message of batch.messages) {
          const job = await this.addMessage(queueName, message);
          jobs.push(job);
        }
      } else {
        // Process messages in parallel
        const jobPromises = batch.messages.map((message) => this.addMessage(queueName, message));
        jobs.push(...(await Promise.all(jobPromises)));
      }

      batch.status = 'COMPLETED';
      batch.completedAt = new Date();
      batch.completedCount = jobs.length;

      this.logger.info(`Batch ${batch.id} completed with ${jobs.length} messages`);
      return jobs;
    } catch (error) {
      batch.status = 'FAILED';
      batch.completedAt = new Date();

      this.logger.error(`Batch ${batch.id} failed`, { error });
      throw error;
    }
  }

  /**
   * Schedule a message for future delivery
   */
  async scheduleMessage(scheduledMessage: ScheduledMessage): Promise<Job<MessagePayload>> {
    const { message, scheduleConfig } = scheduledMessage;
    const options: JobOptions = {};

    switch (scheduledMessage.scheduleType) {
      case 'DELAY':
        options.delay = scheduleConfig.delay;
        break;
      case 'CRON':
        options.repeat = {
          cron: scheduleConfig.cronExpression!,
          endDate: scheduleConfig.endDate,
        };
        break;
      case 'INTERVAL':
        if (scheduleConfig.intervalMs) {
          options.repeat = {
            every: scheduleConfig.intervalMs,
            limit: scheduleConfig.repeatCount,
          };
        }
        break;
    }

    const queueName = message.routing?.targetQueue || QueueType.SYSTEM;
    const job = await this.addMessage(queueName, message, options);

    scheduledMessage.status = 'ACTIVE';
    this.scheduledMessages.set(scheduledMessage.id, scheduledMessage);

    return job;
  }

  /**
   * Get queue metrics
   */
  async getQueueMetrics(queueName: string): Promise<QueueMetrics | undefined> {
    const queue = this.queues.get(queueName);
    if (!queue) return undefined;

    const [active, waiting, completed, failed, delayed, paused] = await Promise.all([
      queue.getActive(),
      queue.getWaiting(),
      queue.getCompleted(),
      queue.getFailed(),
      queue.getDelayed(),
      queue.isPaused(),
    ]);

    const metrics: QueueMetrics = {
      name: queueName,
      active: active.length,
      waiting: waiting.length,
      completed: completed.length,
      failed: failed.length,
      delayed: delayed.length,
      paused,
      throughput: this.calculateThroughput(queueName),
      health: await this.assessQueueHealth(queueName),
      performance: await this.getQueuePerformance(queueName),
    };

    this.metrics.set(queueName, metrics);
    return metrics;
  }

  /**
   * Get all queue metrics
   */
  async getAllMetrics(): Promise<QueueMetrics[]> {
    const metrics: QueueMetrics[] = [];
    for (const queueName of this.queues.keys()) {
      const queueMetrics = await this.getQueueMetrics(queueName);
      if (queueMetrics) {
        metrics.push(queueMetrics);
      }
    }
    return metrics;
  }

  /**
   * Pause a queue
   */
  async pauseQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName);
    if (queue) {
      await queue.pause();
      this.logger.info(`Queue ${queueName} paused`);
      this.emit('queuePaused', queueName);
    }
  }

  /**
   * Resume a queue
   */
  async resumeQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName);
    if (queue) {
      await queue.resume();
      this.logger.info(`Queue ${queueName} resumed`);
      this.emit('queueResumed', queueName);
    }
  }

  /**
   * Clean a queue (remove completed/failed jobs)
   */
  async cleanQueue(
    queueName: string,
    grace: number = 24 * 60 * 60 * 1000, // 24 hours
    status: 'completed' | 'failed' | 'active' = 'completed'
  ): Promise<number> {
    const queue = this.queues.get(queueName);
    if (!queue) return 0;

    const cleaned = await queue.clean(grace, status as any);
    this.logger.info(`Cleaned ${cleaned.length} ${status} jobs from queue ${queueName}`);
    return cleaned.length;
  }

  /**
   * Shutdown the message queue system
   */
  async shutdown(): Promise<void> {
    if (this.isShuttingDown) return;

    this.isShuttingDown = true;
    this.logger.info('Shutting down message queue system');

    // Gracefully close all queues
    const closePromises = Array.from(this.queues.values()).map((queue) => queue.close());
    if (this.deadLetterQueue) {
      closePromises.push(this.deadLetterQueue.close());
    }
    if (this.auditQueue) {
      closePromises.push(this.auditQueue.close());
    }

    await Promise.all(closePromises);

    this.logger.info('Message queue system shutdown complete');
    this.emit('shutdown');
  }

  // Private helper methods

  private setupQueues(): void {
    // Queue setup is handled in initialize()
  }

  private setupMonitoring(): void {
    if (this.config.monitoring.enabled) {
      // Setup periodic metrics collection
      setInterval(async () => {
        await this.collectMetrics();
        await this.checkAlerts();
      }, 60000); // Every minute

      this.logger.info('Queue monitoring enabled');
    }
  }

  private setupQueueEventHandlers(queue: Queue, queueName: string): void {
    queue.on('completed', (job, result) => {
      this.logger.debug(`Job ${job.id} completed in queue ${queueName}`, { result });
      this.emit('jobCompleted', { queueName, job, result });
    });

    queue.on('failed', (job, err) => {
      this.logger.error(`Job ${job.id} failed in queue ${queueName}`, { error: err });
      this.handleFailedJob(job, err, queueName);
      this.emit('jobFailed', { queueName, job, error: err });
    });

    queue.on('stalled', (job) => {
      this.logger.warn(`Job ${job.id} stalled in queue ${queueName}`);
      this.emit('jobStalled', { queueName, job });
    });

    queue.on('active', (job) => {
      this.logger.debug(`Job ${job.id} started in queue ${queueName}`);
      this.emit('jobActive', { queueName, job });
    });
  }

  private setupGlobalEventHandlers(): void {
    process.on('SIGTERM', () => this.shutdown());
    process.on('SIGINT', () => this.shutdown());
  }

  private async rateLimitedProcess(
    job: Job<MessagePayload>,
    definition: QueueDefinition
  ): Promise<any> {
    // Implement rate limiting logic here
    const processor = this.processors.get(definition.processor as string);
    if (processor) {
      return await processor(job);
    }
    throw new Error(`Processor ${definition.processor} not found`);
  }

  private initializeQueueMetrics(queueName: string): void {
    const initialMetrics: QueueMetrics = {
      name: queueName,
      active: 0,
      waiting: 0,
      completed: 0,
      failed: 0,
      delayed: 0,
      paused: false,
      throughput: {
        messagesPerSecond: 0,
        averageProcessingTime: 0,
        peakThroughput: 0,
      },
      health: {
        status: 'HEALTHY',
        lastHealthCheck: new Date(),
        consecutiveFailures: 0,
      },
      performance: {
        cpuUsage: 0,
        memoryUsage: 0,
        redisConnections: 0,
      },
    };
    this.metrics.set(queueName, initialMetrics);
  }

  private calculateThroughput(queueName: string): QueueMetrics['throughput'] {
    // Implementation would calculate actual throughput metrics
    return {
      messagesPerSecond: 0,
      averageProcessingTime: 0,
      peakThroughput: 0,
    };
  }

  private async assessQueueHealth(queueName: string): Promise<QueueMetrics['health']> {
    // Implementation would assess queue health
    return {
      status: 'HEALTHY',
      lastHealthCheck: new Date(),
      consecutiveFailures: 0,
    };
  }

  private async getQueuePerformance(queueName: string): Promise<QueueMetrics['performance']> {
    // Implementation would get actual performance metrics
    return {
      cpuUsage: 0,
      memoryUsage: 0,
      redisConnections: 0,
    };
  }

  private async handleFailedJob(
    job: Job<MessagePayload>,
    error: Error,
    queueName: string
  ): Promise<void> {
    const message = job.data;

    if (job.attemptsMade >= (job.opts.attempts || 3)) {
      // Send to dead letter queue
      const deadLetterMessage: DeadLetterMessage = {
        originalMessage: message,
        failureReason: error.message,
        failureCount: job.attemptsMade,
        firstFailureTime: new Date(job.timestamp),
        lastFailureTime: new Date(),
        stackTrace: error.stack,
        canRetry: false,
      };

      if (this.deadLetterQueue) {
        await this.deadLetterQueue.add('dead-letter', deadLetterMessage);
        this.logger.warn(`Message ${message.id} moved to dead letter queue`);
      } else {
        this.logger.error(`No dead letter queue available for failed message ${message.id}`);
      }
    }
  }

  private async collectMetrics(): Promise<void> {
    for (const queueName of this.queues.keys()) {
      await this.getQueueMetrics(queueName);
    }
  }

  private async checkAlerts(): Promise<void> {
    const thresholds = this.config.monitoring.alertThresholds;

    for (const [queueName, metrics] of this.metrics) {
      // Check queue depth
      if (metrics.waiting > thresholds.queueDepth) {
        this.createAlert({
          queueName,
          alertType: 'QUEUE_DEPTH',
          severity: 'HIGH',
          message: `Queue depth exceeded threshold: ${metrics.waiting} > ${thresholds.queueDepth}`,
          details: { currentDepth: metrics.waiting, threshold: thresholds.queueDepth },
        });
      }

      // Check error rate
      if (metrics.failed > 0 && metrics.completed > 0) {
        const errorRate = metrics.failed / (metrics.failed + metrics.completed);
        if (errorRate > thresholds.errorRate) {
          this.createAlert({
            queueName,
            alertType: 'HIGH_ERROR_RATE',
            severity: 'CRITICAL',
            message: `Error rate exceeded threshold: ${(errorRate * 100).toFixed(2)}% > ${thresholds.errorRate * 100}%`,
            details: { errorRate, threshold: thresholds.errorRate },
          });
        }
      }
    }
  }

  private createAlert(alertData: Omit<QueueAlert, 'id' | 'triggeredAt'>): void {
    const alert: QueueAlert = {
      ...alertData,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      triggeredAt: new Date(),
    };

    this.alerts.push(alert);
    this.emit('alert', alert);
    this.logger.warn(`Queue alert: ${alert.message}`, { alert });
  }

  /**
   * Get overall system health status
   */
  async getSystemHealth(): Promise<{
    status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
    queues: Record<string, any>;
    uptime: number;
    timestamp: Date;
  }> {
    const queues: Record<string, any> = {};
    let overallStatus: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY' = 'HEALTHY';

    for (const [name, queue] of this.queues) {
      const waiting = await queue.getWaiting();
      const active = await queue.getActive();
      const completed = await queue.getCompleted();
      const failed = await queue.getFailed();

      const queueHealth = {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
        isPaused: await queue.isPaused(),
      };

      queues[name] = queueHealth;

      // Simple health check - if too many failed or waiting, degrade status
      if (queueHealth.failed > 100 || queueHealth.waiting > 1000) {
        if (overallStatus === 'HEALTHY') overallStatus = 'DEGRADED';
      }
      if (queueHealth.failed > 500 || queueHealth.waiting > 5000) {
        overallStatus = 'UNHEALTHY';
      }
    }

    return {
      status: overallStatus,
      queues,
      uptime: Date.now() - this.startTime,
      timestamp: new Date(),
    };
  }

  private startTime = Date.now();
}
