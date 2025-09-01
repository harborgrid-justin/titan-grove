/**
 * Message Queue Utilities
 * Helper functions and utilities for message queue operations
 */

import { createHash } from 'crypto';
import { MessagePayload, MessagePriority } from './types';
import { MessageQueueConfig } from '../../types/business-config';

export class MessageQueueUtils {
  /**
   * Generate a unique message ID
   */
  static generateMessageId(prefix: string = 'msg'): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * Generate a correlation ID for message tracing
   */
  static generateCorrelationId(): string {
    return createHash('sha256')
      .update(`${Date.now()}-${Math.random()}-${process.pid}`)
      .digest('hex')
      .substring(0, 16);
  }

  /**
   * Create a standardized message payload
   */
  static createMessage(
    type: string,
    data: any,
    options: {
      source: string;
      priority?: MessagePriority;
      userId?: string;
      correlationId?: string;
      targetQueue?: string;
      compliance?: {
        dataClassification?: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
        auditRequired?: boolean;
        encryptionRequired?: boolean;
        retentionPeriodDays?: number;
      };
    }
  ): MessagePayload {
    const message: MessagePayload = {
      id: this.generateMessageId(),
      type,
      data,
      metadata: {
        source: options.source,
        correlationId: options.correlationId || this.generateCorrelationId(),
        userId: options.userId,
        timestamp: new Date(),
        version: '1.0.0',
        priority: options.priority || MessagePriority.NORMAL
      }
    };

    if (options.targetQueue) {
      message.routing = {
        targetQueue: options.targetQueue
      };
    }

    if (options.compliance) {
      message.compliance = {
        dataClassification: options.compliance.dataClassification || 'INTERNAL',
        auditRequired: options.compliance.auditRequired || false,
        encryptionRequired: options.compliance.encryptionRequired || false,
        retentionPeriodDays: options.compliance.retentionPeriodDays || 90
      };
    }

    return message;
  }

  /**
   * Validate message payload structure
   */
  static validateMessage(message: MessagePayload): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!message.id) {
      errors.push('Message ID is required');
    }

    if (!message.type) {
      errors.push('Message type is required');
    }

    if (!message.metadata) {
      errors.push('Message metadata is required');
    } else {
      if (!message.metadata.source) {
        errors.push('Message source is required');
      }
      if (!message.metadata.timestamp) {
        errors.push('Message timestamp is required');
      }
      if (!message.metadata.version) {
        errors.push('Message version is required');
      }
      if (!Object.values(MessagePriority).includes(message.metadata.priority)) {
        errors.push('Invalid message priority');
      }
    }

    if (message.compliance) {
      const validClassifications = ['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED'];
      if (message.compliance.dataClassification && 
          !validClassifications.includes(message.compliance.dataClassification)) {
        errors.push('Invalid data classification');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Serialize message for storage or transmission
   */
  static serializeMessage(message: MessagePayload): string {
    try {
      return JSON.stringify(message, this.replacer);
    } catch (error) {
      throw new Error(`Failed to serialize message: ${(error as Error).message}`);
    }
  }

  /**
   * Deserialize message from storage or transmission
   */
  static deserializeMessage(serialized: string): MessagePayload {
    try {
      return JSON.parse(serialized, this.reviver);
    } catch (error) {
      throw new Error(`Failed to deserialize message: ${(error as Error).message}`);
    }
  }

  /**
   * Calculate message priority score for queue ordering
   */
  static calculatePriorityScore(message: MessagePayload): number {
    let score = message.metadata.priority;

    // Adjust score based on message age
    const ageHours = (Date.now() - message.metadata.timestamp.getTime()) / (1000 * 60 * 60);
    score -= Math.min(ageHours * 0.1, 2); // Increase priority as message ages

    // Adjust score based on data classification
    if (message.compliance?.dataClassification) {
      switch (message.compliance.dataClassification) {
        case 'RESTRICTED':
          score -= 1;
          break;
        case 'CONFIDENTIAL':
          score -= 0.5;
          break;
        case 'INTERNAL':
          score -= 0.2;
          break;
        // PUBLIC gets no adjustment
      }
    }

    return Math.max(1, score);
  }

  /**
   * Encrypt sensitive message data
   */
  static encryptMessage(message: MessagePayload, key: string): MessagePayload {
    if (!message.compliance?.encryptionRequired) {
      return message;
    }

    const encryptedMessage = { ...message };
    
    // Simple encryption for demo - in production, use proper encryption
    const encrypted = Buffer.from(JSON.stringify(message.data)).toString('base64');
    encryptedMessage.data = {
      encrypted: true,
      data: encrypted,
      algorithm: 'base64' // In production, use AES-256-GCM or similar
    };

    return encryptedMessage;
  }

  /**
   * Decrypt message data
   */
  static decryptMessage(message: MessagePayload, key: string): MessagePayload {
    if (!message.data?.encrypted) {
      return message;
    }

    const decryptedMessage = { ...message };
    
    // Simple decryption for demo
    try {
      const decrypted = Buffer.from(message.data.data, 'base64').toString();
      decryptedMessage.data = JSON.parse(decrypted);
    } catch (error) {
      throw new Error(`Failed to decrypt message: ${(error as Error).message}`);
    }

    return decryptedMessage;
  }

  /**
   * Create audit trail entry for message processing
   */
  static createAuditEntry(
    message: MessagePayload,
    action: string,
    result: 'SUCCESS' | 'FAILURE' | 'PENDING',
    details?: any
  ): any {
    return {
      messageId: message.id,
      correlationId: message.metadata.correlationId,
      action,
      result,
      timestamp: new Date(),
      userId: message.metadata.userId,
      source: message.metadata.source,
      dataClassification: message.compliance?.dataClassification,
      details: details || {}
    };
  }

  /**
   * Calculate message processing metrics
   */
  static calculateProcessingMetrics(
    startTime: Date,
    endTime: Date,
    message: MessagePayload
  ): {
    processingTimeMs: number;
    queueTimeMs: number;
    totalTimeMs: number;
  } {
    const processingTimeMs = endTime.getTime() - startTime.getTime();
    const queueTimeMs = startTime.getTime() - message.metadata.timestamp.getTime();
    const totalTimeMs = endTime.getTime() - message.metadata.timestamp.getTime();

    return {
      processingTimeMs,
      queueTimeMs,
      totalTimeMs
    };
  }

  /**
   * Generate queue configuration based on business requirements
   */
  static generateQueueConfig(
    queueType: string,
    businessRequirements: {
      priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      throughputRequirement: 'LOW' | 'MEDIUM' | 'HIGH';
      latencyRequirement: 'LOW' | 'MEDIUM' | 'HIGH';
      reliabilityRequirement: 'STANDARD' | 'HIGH' | 'CRITICAL';
    },
    queueConfig?: MessageQueueConfig
  ): {
    concurrency: number;
    attempts: number;
    backoffDelay: number;
    removeOnComplete: number;
    removeOnFail: number;
  } {
    // Use defaults if no configuration provided
    const dynamicConfig = queueConfig?.dynamicConfig || {
      lowConcurrency: 5,
      mediumConcurrency: 10,
      highConcurrency: 20,
      standardAttempts: 2,
      highAttempts: 3,
      criticalAttempts: 5,
      standardBackoffDelay: 1000,
      highBackoffDelay: 1500,
      criticalBackoffDelay: 2000,
      mediumRetention: 100,
      highRetention: 200,
      criticalRetention: 500,
    };
    
    const config = {
      concurrency: 1,
      attempts: 1,
      backoffDelay: dynamicConfig.standardBackoffDelay,
      removeOnComplete: dynamicConfig.mediumRetention,
      removeOnFail: 50
    };

    // Adjust concurrency based on throughput requirements
    switch (businessRequirements.throughputRequirement) {
      case 'HIGH':
        config.concurrency = dynamicConfig.highConcurrency;
        break;
      case 'MEDIUM':
        config.concurrency = dynamicConfig.mediumConcurrency;
        break;
      case 'LOW':
        config.concurrency = dynamicConfig.lowConcurrency;
        break;
    }

    // Adjust retry attempts based on reliability requirements
    switch (businessRequirements.reliabilityRequirement) {
      case 'CRITICAL':
        config.attempts = dynamicConfig.criticalAttempts;
        config.backoffDelay = dynamicConfig.criticalBackoffDelay;
        config.removeOnFail = dynamicConfig.criticalRetention;
        break;
      case 'HIGH':
        config.attempts = dynamicConfig.highAttempts;
        config.backoffDelay = dynamicConfig.highBackoffDelay;
        config.removeOnFail = dynamicConfig.highRetention;
        break;
      case 'STANDARD':
        config.attempts = dynamicConfig.standardAttempts;
        break;
    }

    // Adjust job retention based on priority
    switch (businessRequirements.priority) {
      case 'CRITICAL':
        config.removeOnComplete = dynamicConfig.criticalRetention;
        config.removeOnFail = dynamicConfig.criticalRetention;
        break;
      case 'HIGH':
        config.removeOnComplete = dynamicConfig.highRetention;
        config.removeOnFail = dynamicConfig.highRetention;
        break;
      case 'MEDIUM':
        config.removeOnComplete = dynamicConfig.mediumRetention;
        config.removeOnFail = dynamicConfig.mediumRetention;
        break;
      case 'LOW':
        config.removeOnComplete = 50;
        config.removeOnFail = 50;
        break;
    }

    return config;
  }

  /**
   * Create dead letter queue message
   */
  static createDeadLetterMessage(
    originalMessage: MessagePayload,
    error: Error,
    attemptCount: number
  ): any {
    return {
      id: this.generateMessageId('dlq'),
      originalMessage,
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      attemptCount,
      failedAt: new Date(),
      canRetry: attemptCount < 5, // Allow up to 5 total attempts
      metadata: {
        correlationId: originalMessage.metadata.correlationId,
        originalSource: originalMessage.metadata.source,
        failureReason: 'PROCESSING_FAILED'
      }
    };
  }

  /**
   * Format queue statistics for reporting
   */
  static formatQueueStats(stats: {
    active: number;
    waiting: number;
    completed: number;
    failed: number;
    delayed: number;
  }): string {
    const total = stats.active + stats.waiting + stats.completed + stats.failed + stats.delayed;
    
    return `Queue Stats: ${total} total (${stats.active} active, ${stats.waiting} waiting, ${stats.completed} completed, ${stats.failed} failed, ${stats.delayed} delayed)`;
  }

  /**
   * Check if message has expired based on TTL
   */
  static isMessageExpired(message: MessagePayload, ttlHours: number = 24): boolean {
    const expiryTime = new Date(message.metadata.timestamp.getTime() + ttlHours * 60 * 60 * 1000);
    return new Date() > expiryTime;
  }

  /**
   * Sanitize message data for logging
   */
  static sanitizeForLogging(message: MessagePayload): any {
    const sanitized = { ...message };
    
    // Remove sensitive data
    if (message.compliance?.dataClassification === 'RESTRICTED' || 
        message.compliance?.dataClassification === 'CONFIDENTIAL') {
      sanitized.data = '[REDACTED]';
    }

    // Remove large data payloads
    if (typeof sanitized.data === 'object' && JSON.stringify(sanitized.data).length > 1000) {
      sanitized.data = '[LARGE_PAYLOAD_TRUNCATED]';
    }

    return sanitized;
  }

  /**
   * Create batch processing summary
   */
  static createBatchSummary(
    batchId: string,
    messages: MessagePayload[],
    results: { success: number; failed: number; skipped: number }
  ): any {
    return {
      batchId,
      totalMessages: messages.length,
      results,
      startTime: Math.min(...messages.map(m => m.metadata.timestamp.getTime())),
      endTime: Date.now(),
      successRate: (results.success / messages.length) * 100,
      avgMessageSize: messages.reduce((sum, m) => sum + JSON.stringify(m.data).length, 0) / messages.length
    };
  }

  // Private helper methods

  private static replacer(_key: string, value: any): any {
    if (value instanceof Date) {
      return { __type: 'Date', value: value.toISOString() };
    }
    return value;
  }

  private static reviver(_key: string, value: any): any {
    if (typeof value === 'object' && value !== null && value.__type === 'Date') {
      return new Date(value.value);
    }
    return value;
  }
}

/**
 * Message Queue Error Classes
 */
export class MessageQueueError extends Error {
  constructor(message: string, public code: string, public details?: any) {
    super(message);
    this.name = 'MessageQueueError';
  }
}

export class MessageValidationError extends MessageQueueError {
  constructor(message: string, public validationErrors: string[]) {
    super(message, 'VALIDATION_ERROR', { validationErrors });
    this.name = 'MessageValidationError';
  }
}

export class MessageProcessingError extends MessageQueueError {
  constructor(message: string, public originalError: Error) {
    super(message, 'PROCESSING_ERROR', { originalError });
    this.name = 'MessageProcessingError';
  }
}

export class QueueConfigurationError extends MessageQueueError {
  constructor(message: string, public queueName: string) {
    super(message, 'CONFIGURATION_ERROR', { queueName });
    this.name = 'QueueConfigurationError';
  }
}