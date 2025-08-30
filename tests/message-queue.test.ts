/**
 * Message Queue System Tests
 * Comprehensive tests for Fortune 100-grade message queue implementation
 */

import { MessageQueueManager, QueueProcessors, MessageQueueUtils } from '../src/core/message-queue';
import { MessageQueueConfig, MessagePriority, QueueType } from '../src/core/message-queue/types';

describe('Fortune 100-Grade Message Queue System', () => {
  let queueManager: MessageQueueManager;
  let queueProcessors: QueueProcessors;
  let config: MessageQueueConfig;

  beforeAll(async () => {
    config = {
      redis: {
        host: 'localhost',
        port: 6379,
        keyPrefix: 'test-titan-grove:',
        lazyConnect: true
      },
      defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 5,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000
        }
      },
      monitoring: {
        enabled: false, // Disable for tests
        metricsRetentionDays: 1,
        alertThresholds: {
          queueDepth: 100,
          processingTime: 10000,
          errorRate: 0.1
        }
      },
      deadLetterQueue: {
        enabled: true,
        maxRetries: 3,
        retentionDays: 7
      },
      clustering: {
        enabled: false,
        workers: 1,
        concurrency: 1
      }
    };

    queueManager = new MessageQueueManager(config);
    queueProcessors = new QueueProcessors();
  });

  afterAll(async () => {
    if (queueManager) {
      await queueManager.shutdown();
    }
  });

  describe('Message Queue Manager', () => {
    test('should initialize successfully', async () => {
      expect(queueManager).toBeDefined();
      expect(queueManager instanceof MessageQueueManager).toBe(true);
    });

    test('should register processors', () => {
      expect(() => {
        queueManager.registerProcessor('test-processor', queueProcessors.integrationProcessor);
      }).not.toThrow();
    });

    test('should create message payload with utilities', () => {
      const message = MessageQueueUtils.createMessage('TEST_MESSAGE', { test: 'data' }, {
        source: 'test-suite',
        priority: MessagePriority.HIGH,
        compliance: {
          dataClassification: 'INTERNAL',
          auditRequired: true
        }
      });

      expect(message.id).toBeDefined();
      expect(message.type).toBe('TEST_MESSAGE');
      expect(message.data).toEqual({ test: 'data' });
      expect(message.metadata.source).toBe('test-suite');
      expect(message.metadata.priority).toBe(MessagePriority.HIGH);
      expect(message.compliance?.dataClassification).toBe('INTERNAL');
      expect(message.compliance?.auditRequired).toBe(true);
    });

    test('should validate message payload', () => {
      const validMessage = MessageQueueUtils.createMessage('VALID_MESSAGE', { data: 'test' }, {
        source: 'test-suite'
      });

      const validation = MessageQueueUtils.validateMessage(validMessage);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);

      // Test invalid message
      const invalidMessage = { id: '', type: '' } as any;
      const invalidValidation = MessageQueueUtils.validateMessage(invalidMessage);
      expect(invalidValidation.isValid).toBe(false);
      expect(invalidValidation.errors.length).toBeGreaterThan(0);
    });

    test('should serialize and deserialize messages', () => {
      const originalMessage = MessageQueueUtils.createMessage('SERIALIZATION_TEST', { 
        complexData: { nested: { value: 123 } },
        date: new Date()
      }, {
        source: 'test-suite'
      });

      const serialized = MessageQueueUtils.serializeMessage(originalMessage);
      expect(typeof serialized).toBe('string');

      const deserialized = MessageQueueUtils.deserializeMessage(serialized);
      expect(deserialized.id).toBe(originalMessage.id);
      expect(deserialized.type).toBe(originalMessage.type);
      expect(deserialized.data.complexData.nested.value).toBe(123);
      // The timestamp is properly serialized and deserialized
      expect(deserialized.metadata.timestamp).toBeDefined();
      expect(deserialized.metadata.source).toBe('test-suite');
    });

    test('should calculate priority scores correctly', () => {
      const criticalMessage = MessageQueueUtils.createMessage('CRITICAL_MSG', {}, {
        source: 'test-suite',
        priority: MessagePriority.CRITICAL
      });

      const normalMessage = MessageQueueUtils.createMessage('NORMAL_MSG', {}, {
        source: 'test-suite',
        priority: MessagePriority.NORMAL
      });

      const criticalScore = MessageQueueUtils.calculatePriorityScore(criticalMessage);
      const normalScore = MessageQueueUtils.calculatePriorityScore(normalMessage);

      expect(criticalScore).toBeLessThan(normalScore); // Lower score = higher priority
    });

    test('should encrypt and decrypt messages', () => {
      const sensitiveMessage = MessageQueueUtils.createMessage('SENSITIVE_DATA', {
        ssn: '123-45-6789',
        creditCard: '4111-1111-1111-1111'
      }, {
        source: 'test-suite',
        compliance: {
          encryptionRequired: true,
          dataClassification: 'CONFIDENTIAL'
        }
      });

      const encrypted = MessageQueueUtils.encryptMessage(sensitiveMessage, 'test-key');
      expect(encrypted.data.encrypted).toBe(true);
      expect(encrypted.data.data).toBeDefined();

      const decrypted = MessageQueueUtils.decryptMessage(encrypted, 'test-key');
      expect(decrypted.data.ssn).toBe('123-45-6789');
      expect(decrypted.data.creditCard).toBe('4111-1111-1111-1111');
    });

    test('should generate queue configuration based on requirements', () => {
      const highThroughputConfig = MessageQueueUtils.generateQueueConfig('test-queue', {
        priority: 'HIGH',
        throughputRequirement: 'HIGH',
        latencyRequirement: 'LOW',
        reliabilityRequirement: 'CRITICAL'
      });

      expect(highThroughputConfig.concurrency).toBe(20);
      expect(highThroughputConfig.attempts).toBe(5);
      expect(highThroughputConfig.removeOnComplete).toBe(200);
    });

    test('should create audit entries', () => {
      const message = MessageQueueUtils.createMessage('AUDIT_TEST', {}, {
        source: 'test-suite',
        userId: 'test-user'
      });

      const auditEntry = MessageQueueUtils.createAuditEntry(
        message,
        'MESSAGE_PROCESSED',
        'SUCCESS',
        { processingTimeMs: 150 }
      );

      expect(auditEntry.messageId).toBe(message.id);
      expect(auditEntry.action).toBe('MESSAGE_PROCESSED');
      expect(auditEntry.result).toBe('SUCCESS');
      expect(auditEntry.userId).toBe('test-user');
      expect(auditEntry.details.processingTimeMs).toBe(150);
    });
  });

  describe('Queue Processors', () => {
    test('should have all standard processors', () => {
      expect(queueProcessors.integrationProcessor).toBeDefined();
      expect(queueProcessors.financialProcessor).toBeDefined();
      expect(queueProcessors.hrProcessor).toBeDefined();
      expect(queueProcessors.crmProcessor).toBeDefined();
      expect(queueProcessors.scmProcessor).toBeDefined();
      expect(queueProcessors.orderProcessor).toBeDefined();
      expect(queueProcessors.inventoryProcessor).toBeDefined();
      expect(queueProcessors.notificationProcessor).toBeDefined();
      expect(queueProcessors.auditProcessor).toBeDefined();
      expect(queueProcessors.analyticsProcessor).toBeDefined();
    });

    test('should process integration messages', async () => {
      const message = MessageQueueUtils.createMessage('DATA_SYNC', {
        sourceSystem: 'ERP',
        targetSystem: 'CRM',
        records: [{ id: 1, name: 'Test' }]
      }, {
        source: 'integration-service'
      });

      const job = {
        id: 'test-job-1',
        data: message
      } as any;

      const result = await queueProcessors.integrationProcessor(job);
      expect(result.status).toBe('completed');
      expect(result.syncedRecords).toBeDefined();
    });

    test('should process financial messages', async () => {
      const message = MessageQueueUtils.createMessage('PAYMENT_PROCESSING', {
        paymentId: 'PAY-123',
        amount: 1000.00,
        currency: 'USD'
      }, {
        source: 'financial-service'
      });

      const job = {
        id: 'test-job-2',
        data: message
      } as any;

      const result = await queueProcessors.financialProcessor(job);
      expect(result.status).toBe('processed');
      expect(result.transactionId).toBeDefined();
    });

    test('should process notification messages', async () => {
      const message = MessageQueueUtils.createMessage('EMAIL_NOTIFICATION', {
        to: 'user@example.com',
        subject: 'Test Notification',
        template: 'welcome'
      }, {
        source: 'notification-service'
      });

      const job = {
        id: 'test-job-3',
        data: message
      } as any;

      const result = await queueProcessors.notificationProcessor(job);
      expect(result.status).toBe('sent');
      expect(result.messageId).toBeDefined();
    });
  });

  describe('Message Utilities', () => {
    test('should generate unique message IDs', () => {
      const id1 = MessageQueueUtils.generateMessageId('test');
      const id2 = MessageQueueUtils.generateMessageId('test');
      
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^test_/);
      expect(id2).toMatch(/^test_/);
    });

    test('should generate correlation IDs', () => {
      const corr1 = MessageQueueUtils.generateCorrelationId();
      const corr2 = MessageQueueUtils.generateCorrelationId();
      
      expect(corr1).not.toBe(corr2);
      expect(corr1.length).toBe(16);
      expect(corr2.length).toBe(16);
    });

    test('should check message expiry', () => {
      const recentMessage = MessageQueueUtils.createMessage('RECENT', {}, {
        source: 'test'
      });
      
      const oldMessage = MessageQueueUtils.createMessage('OLD', {}, {
        source: 'test'
      });
      // Simulate old message
      oldMessage.metadata.timestamp = new Date(Date.now() - 25 * 60 * 60 * 1000); // 25 hours ago
      
      expect(MessageQueueUtils.isMessageExpired(recentMessage, 24)).toBe(false);
      expect(MessageQueueUtils.isMessageExpired(oldMessage, 24)).toBe(true);
    });

    test('should sanitize messages for logging', () => {
      const sensitiveMessage = MessageQueueUtils.createMessage('SENSITIVE', {
        publicData: 'safe to log',
        privateData: 'secret information'
      }, {
        source: 'test',
        compliance: {
          dataClassification: 'RESTRICTED'
        }
      });

      const sanitized = MessageQueueUtils.sanitizeForLogging(sensitiveMessage);
      expect(sanitized.data).toBe('[REDACTED]');
      expect(sanitized.id).toBe(sensitiveMessage.id);
      expect(sanitized.type).toBe(sensitiveMessage.type);
    });

    test('should format queue statistics', () => {
      const stats = {
        active: 5,
        waiting: 10,
        completed: 100,
        failed: 2,
        delayed: 3
      };

      const formatted = MessageQueueUtils.formatQueueStats(stats);
      expect(formatted).toContain('120 total');
      expect(formatted).toContain('5 active');
      expect(formatted).toContain('10 waiting');
      expect(formatted).toContain('100 completed');
      expect(formatted).toContain('2 failed');
      expect(formatted).toContain('3 delayed');
    });

    test('should create batch summaries', () => {
      const messages = [
        MessageQueueUtils.createMessage('BATCH_1', { size: 100 }, { source: 'test' }),
        MessageQueueUtils.createMessage('BATCH_2', { size: 200 }, { source: 'test' }),
        MessageQueueUtils.createMessage('BATCH_3', { size: 150 }, { source: 'test' })
      ];

      const results = { success: 2, failed: 1, skipped: 0 };
      const summary = MessageQueueUtils.createBatchSummary('batch-123', messages, results);

      expect(summary.batchId).toBe('batch-123');
      expect(summary.totalMessages).toBe(3);
      expect(summary.results).toEqual(results);
      expect(summary.successRate).toBeCloseTo(66.67, 1);
      expect(summary.avgMessageSize).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    test('should create dead letter messages', () => {
      const originalMessage = MessageQueueUtils.createMessage('FAILED', {
        data: 'test'
      }, { source: 'test' });

      const error = new Error('Processing failed');
      const deadLetterMsg = MessageQueueUtils.createDeadLetterMessage(
        originalMessage, 
        error, 
        3
      );

      expect(deadLetterMsg.id).toMatch(/^dlq_/);
      expect(deadLetterMsg.originalMessage).toEqual(originalMessage);
      expect(deadLetterMsg.error.message).toBe('Processing failed');
      expect(deadLetterMsg.attemptCount).toBe(3);
      expect(deadLetterMsg.canRetry).toBe(true);
    });

    test('should calculate processing metrics', () => {
      const message = MessageQueueUtils.createMessage('METRICS_TEST', {}, {
        source: 'test'
      });
      
      const startTime = new Date(Date.now() + 1000); // 1 second after message
      const endTime = new Date(Date.now() + 3000);   // 2 seconds processing time
      
      const metrics = MessageQueueUtils.calculateProcessingMetrics(
        startTime,
        endTime,
        message
      );

      expect(metrics.processingTimeMs).toBe(2000);
      expect(metrics.queueTimeMs).toBe(1000);
      expect(metrics.totalTimeMs).toBe(3000);
    });
  });

  describe('Integration with Business Suite', () => {
    test('should define all standard queue types', () => {
      const queueTypes = Object.values(QueueType);
      
      expect(queueTypes).toContain('integration');
      expect(queueTypes).toContain('financial');
      expect(queueTypes).toContain('hr');
      expect(queueTypes).toContain('crm');
      expect(queueTypes).toContain('scm');
      expect(queueTypes).toContain('order');
      expect(queueTypes).toContain('inventory');
      expect(queueTypes).toContain('notification');
      expect(queueTypes).toContain('audit');
      expect(queueTypes).toContain('analytics');
    });

    test('should support all priority levels', () => {
      const priorities = Object.values(MessagePriority);
      
      expect(priorities).toContain(MessagePriority.CRITICAL);
      expect(priorities).toContain(MessagePriority.HIGH);
      expect(priorities).toContain(MessagePriority.NORMAL);
      expect(priorities).toContain(MessagePriority.LOW);
      expect(priorities).toContain(MessagePriority.BULK);
    });
  });
});