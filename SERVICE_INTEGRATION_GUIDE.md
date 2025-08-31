# Service Integration Guide

## Standardized Message Queue and Cache Integration for All Modules

This guide explains how to integrate message queue and cache services into business modules using the new standardized pattern.

## Overview

The standardized service integration provides:
- **Message Queue Integration**: Async processing with Redis-backed queues
- **Cache Integration**: High-performance caching with Redis or in-memory options
- **Health Monitoring**: Built-in service health checks and metrics
- **Audit Logging**: Compliance-aware message processing
- **Standardized Patterns**: Consistent implementation across all modules

## Quick Start

### 1. Initialize Service Factory

```typescript
import { ServiceFactory } from './src/shared/utils/service-factory';

// Initialize shared services
await ServiceFactory.initialize(
  {
    redis: { host: 'localhost', port: 6379 },
    // ... message queue config
  },
  {
    type: 'redis', // or 'memory'
    host: 'localhost',
    port: 6379
  },
  { level: 'info' }
);
```

### 2. Create Standardized Services

```typescript
import { StandardServiceBase } from './src/shared/utils/standard-service-base';
import { ServiceFactory } from './src/shared/utils/service-factory';

class MyBusinessService extends StandardServiceBase {
  constructor(context?: ServiceIntegrationContext) {
    super(context || ServiceFactory.createContext(
      ServiceFactory.createStandardConfig('my-module')
    ));
  }

  // Implement required abstract methods
  async processMessage(message: MessagePayload): Promise<any> {
    this.markMessageProcessed();
    // Handle different message types
    switch (message.type) {
      case 'PROCESS_DATA':
        return this.processData(message.data);
      default:
        throw new Error(`Unknown message type: ${message.type}`);
    }
  }

  getHandledQueueTypes(): QueueType[] {
    return [QueueType.SYSTEM]; // or specific queues like FINANCIAL, HR, etc.
  }

  // Business logic with integrated caching
  async fetchData(id: string): Promise<any> {
    return this.executeWithCache(
      `data:${id}`,
      () => this.actualDataFetch(id),
      300 // TTL in seconds
    );
  }

  // Business logic with metrics tracking
  async processBusinessOperation(data: any): Promise<any> {
    return this.executeWithMetrics(async () => {
      // Your business logic here
      const result = await this.doBusinessLogic(data);
      
      // Send audit message if needed
      await this.sendMessage(
        QueueType.AUDIT,
        'OPERATION_COMPLETED',
        { operationId: result.id, status: 'success' },
        { compliance: { auditRequired: true } }
      );
      
      return result;
    });
  }
}
```

## Features

### Cache Integration

```typescript
// Get cached data
const cached = await this.getCached('my-key');

// Set cached data with TTL
await this.setCached('my-key', data, 600); // 10 minutes

// Delete cached data
await this.deleteCached('my-key');

// Execute with automatic caching
const result = await this.executeWithCache(
  'operation:param1:param2',
  () => expensiveOperation(),
  300 // TTL
);
```

### Message Queue Integration

```typescript
// Send messages to queues
await this.sendMessage(
  QueueType.FINANCIAL,
  'PROCESS_PAYMENT',
  { amount: 100, customerId: '123' },
  {
    priority: MessagePriority.HIGH,
    compliance: {
      dataClassification: 'CONFIDENTIAL',
      auditRequired: true
    }
  }
);

// Process incoming messages (implement in processMessage method)
async processMessage(message: MessagePayload): Promise<any> {
  switch (message.type) {
    case 'PROCESS_PAYMENT':
      return await this.processPayment(message.data);
    // ... other message types
  }
}
```

### Health Monitoring

```typescript
// Check service health
const health = await service.healthCheck();
console.log(health.status); // 'healthy', 'degraded', or 'unhealthy'

// Get service metrics
const metrics = await service.getMetrics();
console.log(`Cache hit rate: ${metrics.cache.hitRate * 100}%`);
console.log(`Messages processed: ${metrics.messageQueue.processed}`);
```

## Pre-configured Modules

The system includes pre-configured settings for common business modules:

- **Financial**: High priority, confidential data, audit required
- **HR**: Confidential data, audit required, longer cache TTL
- **CRM**: Internal data, moderate caching, notification integration
- **SCM**: Fast cache expiry, inventory integration
- **Manufacturing**: Real-time data, quality integration
- **Procurement**: High priority, audit required, financial integration

## Example: Financial Service Integration

```typescript
import { createPricingService } from './modules/financial/business-logic/pricing/pricing-service';

// Create properly integrated service
const financialContext = ServiceFactory.createContext(
  ServiceFactory.createStandardConfig('financial')
);
const pricingService = createPricingService(financialContext);

// Use with automatic caching and audit logging
const quote = await pricingService.calculateLeasePricing(100000, 36, 'model-1');
// Automatically cached and audit message sent
```

## Configuration Options

### Cache Configuration

```typescript
{
  defaultTTL: 600, // 10 minutes default
  keyPrefix: 'mymodule',
  operationTTLs: {
    'balance': 300,      // 5 minutes for balance data
    'transaction': 1800, // 30 minutes for transaction data
    'report': 3600       // 1 hour for reports
  }
}
```

### Message Queue Configuration

```typescript
{
  defaultPriority: 1, // 1=High, 2=Normal, 3=Low
  retryAttempts: 3,
  compliance: {
    dataClassification: 'CONFIDENTIAL', // PUBLIC, INTERNAL, CONFIDENTIAL, RESTRICTED
    auditRequired: true
  }
}
```

## Migration Guide

### Existing Services

1. **Extend StandardServiceBase** instead of BaseManager
2. **Add constructor** that accepts ServiceIntegrationContext
3. **Implement abstract methods** (processMessage, getHandledQueueTypes)
4. **Use integrated methods** (executeWithCache, sendMessage, etc.)

### Example Migration

```typescript
// Before
class MyService extends BaseManager {
  async processData(id: string) {
    const result = this.expensiveOperation(id);
    this.logAction('processData', { id });
    return result;
  }
}

// After
class MyService extends StandardServiceBase {
  async processData(id: string) {
    return this.executeWithCache(
      `data:${id}`,
      () => this.expensiveOperation(id),
      300
    );
  }
  
  async processMessage(message: MessagePayload): Promise<any> {
    this.markMessageProcessed();
    switch (message.type) {
      case 'PROCESS_DATA':
        return this.processData(message.data.id);
      default:
        throw new Error(`Unknown message type: ${message.type}`);
    }
  }
  
  getHandledQueueTypes(): QueueType[] {
    return [QueueType.SYSTEM];
  }
}
```

## Best Practices

1. **Use appropriate cache TTLs**: Short for frequently changing data, longer for stable data
2. **Set proper data classification**: Follow compliance requirements
3. **Handle message failures gracefully**: Implement proper error handling in processMessage
4. **Monitor service health**: Regularly check health endpoints
5. **Use metrics for optimization**: Monitor cache hit rates and queue processing times

## Testing

```typescript
// Test cache integration
const testCache = async () => {
  await service.setCached('test', { data: 'test' });
  const result = await service.getCached('test');
  assert(result.data === 'test');
};

// Test health monitoring
const testHealth = async () => {
  const health = await service.healthCheck();
  assert(health.status === 'healthy');
};
```

## Troubleshooting

### Common Issues

1. **"ServiceFactory not initialized"**: Call `ServiceFactory.initialize()` before creating services
2. **Cache misses**: Check TTL settings and key generation patterns
3. **Message queue errors**: Verify Redis connection and queue configuration
4. **Health check failures**: Check dependencies and service connectivity

### Debug Commands

```bash
# Test cache integration
node test-integration.js

# Check message queue status
# Access Redis CLI to inspect queues

# Monitor service health
# Check service.healthCheck() responses
```