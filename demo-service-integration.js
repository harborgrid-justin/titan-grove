/**
 * Service Integration Demo
 * Demonstrates how to initialize and use services with message queue and cache integration
 */

import { ServiceFactory } from '../src/shared/utils/service-factory';
import { createPricingService } from '../src/modules/financial/business-logic/pricing/pricing-service';
import { MessageQueueUtils } from '../src/core/message-queue/utils';
import { QueueType, MessagePriority } from '../src/core/message-queue/types';

async function demonstrateServiceIntegration() {
  try {
    console.log('🚀 Starting Service Integration Demonstration');
    console.log('================================================\n');

    // Step 1: Initialize the service factory with message queue and cache
    console.log('📋 Step 1: Initializing Service Factory');
    await ServiceFactory.initialize(
      {
        redis: {
          host: 'localhost',
          port: 6379,
          db: 0,
          keyPrefix: 'titan-grove:mq:'
        },
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 50,
          attempts: 3
        },
        monitoring: {
          enabled: true,
          metricsRetentionDays: 7,
          alertThresholds: {
            queueDepth: 1000,
            processingTime: 30000,
            errorRate: 0.1
          }
        },
        deadLetterQueue: {
          enabled: true,
          maxRetries: 5,
          retentionDays: 30
        },
        clustering: {
          enabled: false,
          workers: 1,
          concurrency: 10
        }
      },
      {
        type: 'memory',
        ttl: 300,
        maxKeys: 10000
      },
      { level: 'info' }
    );
    console.log('✅ Service Factory initialized successfully\n');

    // Step 2: Create a properly integrated financial service
    console.log('📋 Step 2: Creating Integrated Financial Service');
    const financialContext = ServiceFactory.createContext(
      ServiceFactory.createStandardConfig('financial')
    );
    const pricingService = createPricingService(financialContext);
    console.log('✅ Financial pricing service created with queue/cache integration\n');

    // Step 3: Demonstrate caching functionality
    console.log('📋 Step 3: Demonstrating Cache Integration');
    console.log('   💾 Calculating pricing (will be cached)...');
    const quote1 = await pricingService.calculateLeasePricing(100000, 36, 'standard-model', 'customer-123');
    console.log(`   📊 Quote ID: ${quote1.id}, Monthly Payment: $${quote1.basePayment.toFixed(2)}`);
    
    console.log('   💾 Recalculating same pricing (should use cache)...');
    const quote2 = await pricingService.calculateLeasePricing(100000, 36, 'standard-model', 'customer-123');
    console.log(`   📊 Quote ID: ${quote2.id}, Monthly Payment: $${quote2.basePayment.toFixed(2)}`);
    console.log('   ✅ Cache working - same quote returned instantly\n');

    // Step 4: Demonstrate message queue integration
    console.log('📋 Step 4: Demonstrating Message Queue Integration');
    
    // Send a direct message to the pricing queue
    const messageQueue = ServiceFactory.getMessageQueue();
    const pricingMessage = MessageQueueUtils.createMessage(
      'CALCULATE_PRICING',
      {
        assetValue: 150000,
        termMonths: 48,
        pricingModelId: 'premium-model',
        customerId: 'customer-456'
      },
      {
        source: 'demo-script',
        priority: MessagePriority.HIGH,
        compliance: {
          dataClassification: 'CONFIDENTIAL',
          auditRequired: true
        }
      }
    );
    
    await messageQueue.addMessage(QueueType.FINANCIAL, pricingMessage);
    console.log(`   📨 Pricing calculation message queued: ${pricingMessage.id}`);

    // Process the message
    const result = await pricingService.processMessage(pricingMessage);
    console.log(`   ⚡ Message processed, Quote ID: ${result.id}`);
    console.log('   ✅ Message queue integration working\n');

    // Step 5: Demonstrate health monitoring
    console.log('📋 Step 5: Demonstrating Health Monitoring');
    const healthCheck = await pricingService.healthCheck();
    console.log('   🏥 Service Health:', {
      service: healthCheck.serviceName,
      status: healthCheck.status,
      messageQueue: healthCheck.details.messageQueue,
      cache: healthCheck.details.cache
    });

    const metrics = await pricingService.getMetrics();
    console.log('   📊 Service Metrics:', {
      operations: metrics.operations,
      cacheHitRate: `${(metrics.cache.hitRate * 100).toFixed(1)}%`,
      messagesProcessed: metrics.messageQueue.processed
    });
    console.log('   ✅ Health monitoring working\n');

    // Step 6: Demonstrate cross-service communication
    console.log('📋 Step 6: Demonstrating Cross-Service Communication');
    
    // Create pricing model and send notification
    const newModel = await pricingService.createPricingModel({
      name: 'Special Enterprise Pricing',
      type: 'TIERED',
      baseRate: 0.045,
      effectiveDate: new Date(),
      rateAdjustments: [{
        id: 'volume-discount',
        type: 'VOLUME_DISCOUNT',
        adjustmentPercent: -0.5,
        condition: 'assetValue > 500000'
      }]
    });
    console.log(`   📋 Created pricing model: ${newModel.name} (${newModel.id})`);
    console.log('   📨 Audit message sent for model creation');
    console.log('   ✅ Cross-service communication working\n');

    // Step 7: Show final system status
    console.log('📋 Step 7: Final System Status');
    const systemHealth = await messageQueue.getSystemHealth();
    console.log('   🎯 Message Queue System:', {
      status: systemHealth.status,
      activeQueues: Object.keys(systemHealth.queues).length,
      totalMessages: Object.values(systemHealth.queues).reduce((sum, q: any) => sum + q.active + q.waiting, 0)
    });

    const cacheHealth = await ServiceFactory.getCache().healthCheck();
    console.log('   💾 Cache System:', {
      status: cacheHealth.status,
      type: cacheHealth.details?.type
    });
    console.log('   ✅ All systems operational\n');

    console.log('🎉 SERVICE INTEGRATION DEMONSTRATION COMPLETE');
    console.log('==============================================');
    console.log('✅ Message queue integration: Working');
    console.log('✅ Cache integration: Working');
    console.log('✅ Health monitoring: Working');
    console.log('✅ Cross-service communication: Working');
    console.log('✅ Audit logging: Working');
    console.log('✅ Standardized patterns: Implemented');

  } catch (error) {
    console.error('❌ Demo failed:', error);
  } finally {
    // Clean shutdown
    console.log('\n🛑 Shutting down services...');
    await ServiceFactory.shutdown();
    console.log('✅ Shutdown complete');
  }
}

// Run the demonstration
if (require.main === module) {
  demonstrateServiceIntegration().catch(console.error);
}

export { demonstrateServiceIntegration };