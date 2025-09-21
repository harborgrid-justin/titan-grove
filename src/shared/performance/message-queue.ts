/**
 * Message Queuing and Event Handling - Enterprise Grade  
 * Implements Fix 35: Message queuing and event handling
 */

import { EventEmitter } from 'events';
import { getLogger } from '../../utils/enterprise-logger';

interface QueueMessage<T = any> {
  id: string;
  payload: T;
  priority: number;
  timestamp: Date;
  retryCount: number;
  maxRetries: number;
  delay: number;
  exchangeName?: string;
  routingKey?: string;
  headers: Record<string, any>;
}

interface QueueConfig {
  maxSize: number;
  retryInterval: number;
  deadLetterQueue: boolean;
  persistMessages: boolean;
  enablePriority: boolean;
  batchSize: number;
  processingTimeout: number;
}

interface MessageHandler<T = any> {
  (message: QueueMessage<T>): Promise<void>;
}

export class MessageQueueService extends EventEmitter {
  private logger = getLogger('MessageQueueService');
  private config: QueueConfig;
  private queues = new Map<string, QueueMessage[]>();
  private handlers = new Map<string, MessageHandler>();
  private deadLetterQueue: QueueMessage[] = [];
  private processingInterval?: NodeJS.Timeout;
  private isProcessing = false;

  constructor(config: QueueConfig) {
    super();
    this.config = config;
    this.startProcessing();

    this.logger.logBusinessOperation(
      'MESSAGE_QUEUE_INITIALIZED',
      'MessageQueueService',
      '',
      'SUCCESS',
      {
        maxSize: config.maxSize,
        enablePriority: config.enablePriority,
        deadLetterQueue: config.deadLetterQueue
      }
    );
  }

  public createQueue(queueName: string): boolean {
    if (this.queues.has(queueName)) {
      return false;
    }

    this.queues.set(queueName, []);
    
    this.logger.logBusinessOperation(
      'QUEUE_CREATED',
      'MessageQueueService',
      queueName,
      'SUCCESS'
    );

    return true;
  }

  public deleteQueue(queueName: string): boolean {
    const deleted = this.queues.delete(queueName);
    this.handlers.delete(queueName);

    if (deleted) {
      this.logger.logBusinessOperation(
        'QUEUE_DELETED',
        'MessageQueueService',
        queueName,
        'SUCCESS'
      );
    }

    return deleted;
  }

  public publish<T>(
    queueName: string, 
    payload: T, 
    options: {
      priority?: number;
      delay?: number;
      maxRetries?: number;
      exchangeName?: string;
      routingKey?: string;
      headers?: Record<string, any>;
    } = {}
  ): boolean {
    const queue = this.queues.get(queueName);
    if (!queue) {
      this.logger.logError('Attempted to publish to non-existent queue', new Error('Queue not found'), {
        queueName
      });
      return false;
    }

    if (queue.length >= this.config.maxSize) {
      this.logger.logError('Queue at maximum capacity', new Error('Queue full'), {
        queueName,
        currentSize: queue.length,
        maxSize: this.config.maxSize
      });
      return false;
    }

    const message: QueueMessage<T> = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      payload,
      priority: options.priority || 0,
      timestamp: new Date(),
      retryCount: 0,
      maxRetries: options.maxRetries || 3,
      delay: options.delay || 0,
      exchangeName: options.exchangeName,
      routingKey: options.routingKey,
      headers: options.headers || {}
    };

    // Insert based on priority if enabled
    if (this.config.enablePriority) {
      const insertIndex = queue.findIndex(msg => msg.priority < message.priority);
      if (insertIndex === -1) {
        queue.push(message);
      } else {
        queue.splice(insertIndex, 0, message);
      }
    } else {
      queue.push(message);
    }

    this.logger.logBusinessOperation(
      'MESSAGE_PUBLISHED',
      'MessageQueueService',
      message.id,
      'SUCCESS',
      {
        queueName,
        priority: message.priority,
        payloadSize: JSON.stringify(payload).length
      }
    );

    this.emit('messagePublished', { queueName, message });
    return true;
  }

  public subscribe<T>(queueName: string, handler: MessageHandler<T>): boolean {
    if (!this.queues.has(queueName)) {
      this.logger.logError('Attempted to subscribe to non-existent queue', new Error('Queue not found'), {
        queueName
      });
      return false;
    }

    this.handlers.set(queueName, handler);
    
    this.logger.logBusinessOperation(
      'QUEUE_SUBSCRIBED',
      'MessageQueueService',
      queueName,
      'SUCCESS'
    );

    return true;
  }

  public unsubscribe(queueName: string): boolean {
    const removed = this.handlers.delete(queueName);
    
    if (removed) {
      this.logger.logBusinessOperation(
        'QUEUE_UNSUBSCRIBED',
        'MessageQueueService',
        queueName,
        'SUCCESS'
      );
    }

    return removed;
  }

  public getQueueInfo(queueName: string) {
    const queue = this.queues.get(queueName);
    if (!queue) {
      return null;
    }

    return {
      name: queueName,
      messageCount: queue.length,
      hasHandler: this.handlers.has(queueName),
      oldestMessage: queue.length > 0 ? queue[0].timestamp : null
    };
  }

  public getQueueStats() {
    const stats = {
      totalQueues: this.queues.size,
      totalMessages: 0,
      subscribedQueues: this.handlers.size,
      deadLetterMessages: this.deadLetterQueue.length,
      queues: [] as any[]
    };

    for (const [name, queue] of this.queues.entries()) {
      const queueStats = {
        name,
        messageCount: queue.length,
        hasHandler: this.handlers.has(name),
        averagePriority: queue.length > 0 ? 
          queue.reduce((sum, msg) => sum + msg.priority, 0) / queue.length : 0
      };

      stats.totalMessages += queue.length;
      stats.queues.push(queueStats);
    }

    return stats;
  }

  private startProcessing(): void {
    this.processingInterval = setInterval(() => {
      this.processMessages();
    }, 100); // Process every 100ms
  }

  private async processMessages(): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      const promises: Promise<void>[] = [];

      for (const [queueName, queue] of this.queues.entries()) {
        const handler = this.handlers.get(queueName);
        if (!handler || queue.length === 0) {
          continue;
        }

        // Process batch of messages
        const batch = queue.splice(0, Math.min(this.config.batchSize, queue.length));
        
        for (const message of batch) {
          // Check if message should be delayed
          if (message.delay > 0 && Date.now() - message.timestamp.getTime() < message.delay) {
            queue.unshift(message); // Put back at front
            continue;
          }

          promises.push(this.processMessage(queueName, message, handler));
        }
      }

      await Promise.allSettled(promises);
    } finally {
      this.isProcessing = false;
    }
  }

  private async processMessage(queueName: string, message: QueueMessage, handler: MessageHandler): Promise<void> {
    const startTime = Date.now();

    try {
      // Set processing timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Processing timeout')), this.config.processingTimeout);
      });

      await Promise.race([
        handler(message),
        timeoutPromise
      ]);

      const processingTime = Date.now() - startTime;

      this.logger.logBusinessOperation(
        'MESSAGE_PROCESSED',
        'MessageQueueService',
        message.id,
        'SUCCESS',
        {
          queueName,
          processingTime,
          retryCount: message.retryCount
        }
      );

      this.emit('messageProcessed', { queueName, message, processingTime });

    } catch (error) {
      message.retryCount++;

      this.logger.logError('Message processing failed', error, {
        messageId: message.id,
        queueName,
        retryCount: message.retryCount,
        maxRetries: message.maxRetries
      });

      if (message.retryCount < message.maxRetries) {
        // Add delay for retry
        message.delay = this.config.retryInterval * Math.pow(2, message.retryCount - 1);
        
        // Put back in queue for retry
        const queue = this.queues.get(queueName);
        if (queue) {
          queue.unshift(message);
        }

        this.emit('messageRetry', { queueName, message, error });
      } else {
        // Move to dead letter queue
        if (this.config.deadLetterQueue) {
          this.deadLetterQueue.push(message);
          
          this.logger.logBusinessOperation(
            'MESSAGE_MOVED_TO_DLQ',
            'MessageQueueService',
            message.id,
            'WARNING',
            { queueName, finalRetryCount: message.retryCount }
          );
        }

        this.emit('messageFailed', { queueName, message, error });
      }
    }
  }

  public getDeadLetterMessages(): QueueMessage[] {
    return [...this.deadLetterQueue];
  }

  public reprocessDeadLetterMessage(messageId: string, targetQueueName?: string): boolean {
    const messageIndex = this.deadLetterQueue.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) {
      return false;
    }

    const message = this.deadLetterQueue.splice(messageIndex, 1)[0];
    message.retryCount = 0;
    message.delay = 0;

    const queueName = targetQueueName || 'default';
    const queue = this.queues.get(queueName);
    
    if (!queue) {
      this.deadLetterQueue.push(message); // Put back if target queue doesn't exist
      return false;
    }

    queue.push(message);

    this.logger.logBusinessOperation(
      'MESSAGE_REPROCESSED_FROM_DLQ',
      'MessageQueueService',
      messageId,
      'SUCCESS',
      { targetQueueName: queueName }
    );

    return true;
  }

  public async shutdown(): Promise<void> {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }

    // Wait for current processing to complete
    while (this.isProcessing) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    const totalMessages = Array.from(this.queues.values()).reduce((sum, queue) => sum + queue.length, 0);

    this.logger.logBusinessOperation(
      'MESSAGE_QUEUE_SHUTDOWN',
      'MessageQueueService',
      '',
      'SUCCESS',
      {
        totalQueues: this.queues.size,
        unprocessedMessages: totalMessages,
        deadLetterMessages: this.deadLetterQueue.length
      }
    );

    this.emit('shutdown');
  }
}

export { QueueMessage, QueueConfig, MessageHandler };