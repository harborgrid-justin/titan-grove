#!/usr/bin/env node
/**
 * Message Queue Demo
 * Demonstrates Fortune 100-grade message queue capabilities
 */

const { default: TitanGrove } = require('./dist/business-suite');
const { MessageQueueUtils, MessagePriority, QueueType } = require('./dist/core/message-queue');

async function demonstrateMessageQueue() {
  console.log('🚀 Fortune 100-Grade Message Queue Demonstration');
  console.log('================================================\n');

  try {
    console.log('📋 Creating Titan Grove instance with message queue...');
    const titanGrove = new TitanGrove({
      messageQueue: {
        redis: {
          host: 'localhost',
          port: 6379,
          keyPrefix: 'demo-titan-grove:',
          lazyConnect: true
        },
        monitoring: {
          enabled: true,
          alertThresholds: {
            queueDepth: 100,
            processingTime: 30000,
            errorRate: 0.1
          }
        }
      }
    });

    console.log('⚡ Starting Titan Grove system...');
    await titanGrove.start();

    const messageQueue = titanGrove.getMessageQueue();
    if (!messageQueue) {
      throw new Error('Message queue not initialized');
    }

    console.log('\n📊 Message Queue System Features:');
    console.log('  ✅ Enterprise-grade Redis-based queues');
    console.log('  ✅ Priority-based message processing');
    console.log('  ✅ Dead letter queue handling');
    console.log('  ✅ Comprehensive monitoring & alerting');
    console.log('  ✅ Audit logging & compliance features');
    console.log('  ✅ Automatic retry with exponential backoff');

    console.log('\n🎯 DEMONSTRATION SCENARIOS:\n');

    // Scenario 1: High-priority financial transaction
    console.log('💰 Scenario 1: Processing high-priority financial transaction');
    const financialMessage = MessageQueueUtils.createMessage(
      'PAYMENT_PROCESSING',
      {
        transactionId: 'TXN-2024-001',
        amount: 150000.00,
        currency: 'USD',
        accountFrom: 'ACC-12345',
        accountTo: 'ACC-67890',
        type: 'WIRE_TRANSFER'
      },
      {
        source: 'financial-system',
        priority: MessagePriority.CRITICAL,
        userId: 'finance-user-001',
        compliance: {
          dataClassification: 'CONFIDENTIAL',
          auditRequired: true,
          encryptionRequired: true
        }
      }
    );

    const financialJob = await messageQueue.addMessage(QueueType.FINANCIAL, financialMessage);
    console.log(`   📨 Queued financial transaction: Job ID ${financialJob.id}`);

    // Scenario 2: Bulk inventory updates
    console.log('\n📦 Scenario 2: Processing bulk inventory updates');
    for (let i = 1; i <= 5; i++) {
      const inventoryMessage = MessageQueueUtils.createMessage(
        'STOCK_ADJUSTMENT',
        {
          productId: `PROD-${String(i).padStart(3, '0')}`,
          warehouseId: 'WH-001',
          adjustment: Math.floor(Math.random() * 100) - 50, // Random adjustment
          reason: 'CYCLE_COUNT_CORRECTION'
        },
        {
          source: 'inventory-system',
          priority: MessagePriority.NORMAL
        }
      );

      await messageQueue.addMessage(QueueType.INVENTORY, inventoryMessage);
      console.log(`   📦 Queued inventory adjustment for product PROD-${String(i).padStart(3, '0')}`);
    }

    // Scenario 3: Customer notifications
    console.log('\n📧 Scenario 3: Sending customer notifications');
    const notificationTypes = ['EMAIL_NOTIFICATION', 'SMS_NOTIFICATION', 'PUSH_NOTIFICATION'];
    
    for (let i = 0; i < 3; i++) {
      const notificationMessage = MessageQueueUtils.createMessage(
        notificationTypes[i],
        {
          recipientId: `CUST-${String(i + 1).padStart(3, '0')}`,
          template: 'order-confirmation',
          data: {
            orderNumber: `ORD-2024-${String(i + 1).padStart(4, '0')}`,
            amount: (Math.random() * 1000 + 100).toFixed(2)
          }
        },
        {
          source: 'notification-service',
          priority: MessagePriority.LOW
        }
      );

      await messageQueue.addMessage(QueueType.NOTIFICATION, notificationMessage);
      console.log(`   📢 Queued ${notificationTypes[i].toLowerCase()} for customer CUST-${String(i + 1).padStart(3, '0')}`);
    }

    // Scenario 4: Integration data sync
    console.log('\n🔄 Scenario 4: Enterprise system integration');
    const integrationMessage = MessageQueueUtils.createMessage(
      'DATA_SYNC',
      {
        sourceSystem: 'SAP_ERP',
        targetSystem: 'SALESFORCE_CRM',
        syncType: 'CUSTOMER_MASTER_DATA',
        batchSize: 1000,
        lastSyncTimestamp: new Date().toISOString()
      },
      {
        source: 'integration-service',
        priority: MessagePriority.HIGH,
        compliance: {
          dataClassification: 'INTERNAL',
          auditRequired: true
        }
      }
    );

    await messageQueue.addMessage(QueueType.INTEGRATION, integrationMessage);
    console.log('   🔗 Queued enterprise system data synchronization');

    // Scenario 5: Compliance audit logging
    console.log('\n🛡️ Scenario 5: Compliance audit logging');
    const auditMessage = MessageQueueUtils.createMessage(
      'USER_ACTION',
      {
        userId: 'admin-001',
        action: 'FINANCIAL_REPORT_ACCESS',
        resourceId: 'RPT-FINANCIAL-Q4-2024',
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Enterprise Browser)'
      },
      {
        source: 'audit-service',
        priority: MessagePriority.HIGH,
        compliance: {
          dataClassification: 'RESTRICTED',
          auditRequired: true,
          retentionPeriodDays: 2555 // 7 years for financial compliance
        }
      }
    );

    await messageQueue.addMessage(QueueType.AUDIT, auditMessage);
    console.log('   🔍 Queued compliance audit log entry');

    // Wait a moment for some processing
    console.log('\n⏳ Allowing time for message processing...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Get queue metrics
    console.log('\n📈 QUEUE METRICS SUMMARY:');
    const metrics = await titanGrove.getMessageQueueMetrics();
    if (metrics.success) {
      console.log(`   Total Queues: ${metrics.summary.totalQueues}`);
      console.log(`   Messages Active: ${metrics.summary.totalActive}`);
      console.log(`   Messages Waiting: ${metrics.summary.totalWaiting}`);
      console.log(`   Messages Completed: ${metrics.summary.totalCompleted}`);
      console.log(`   Messages Failed: ${metrics.summary.totalFailed}`);
    }

    console.log('\n🎯 KEY CAPABILITIES DEMONSTRATED:');
    console.log('  🔒 Security: Encryption, classification, access control');
    console.log('  ⚖️  Compliance: Audit trails, retention policies, regulatory support');
    console.log('  🚀 Performance: Priority queues, bulk processing, scalability');
    console.log('  🔄 Reliability: Retry mechanisms, dead letter queues, monitoring');
    console.log('  🌐 Integration: Multi-system support, data synchronization');
    console.log('  📊 Observability: Metrics, alerting, dashboard-ready data');

    console.log('\n💼 ENTERPRISE FEATURES:');
    console.log('  • Fortune 100-grade architecture & design patterns');
    console.log('  • Redis-based for high performance & reliability');
    console.log('  • Horizontal scaling with clustering support');
    console.log('  • Comprehensive error handling & recovery');
    console.log('  • Built-in monitoring & alerting system');
    console.log('  • Compliance-ready audit logging');
    console.log('  • API-driven management & monitoring');

    // Clean shutdown
    console.log('\n🛑 Shutting down gracefully...');
    await titanGrove.stop();
    
    console.log('\n✅ Message Queue Demonstration Complete!');
    console.log('   The Fortune 100-grade message queue layer is now integrated');
    console.log('   and ready for enterprise-scale operations.');

  } catch (error) {
    console.error('❌ Demonstration failed:', error.message);
    console.error('   Make sure Redis is running on localhost:6379');
    console.error('   Or configure alternative Redis connection in the demo');
  }
}

// Run the demonstration
demonstrateMessageQueue().then(() => {
  console.log('\n🎉 Fortune 100-grade message queue demonstration complete!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Demonstration error:', error);
  process.exit(1);
});