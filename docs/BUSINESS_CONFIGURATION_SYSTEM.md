# Business Configuration System Documentation

## Overview

This document describes the centralized business configuration system implemented to replace hard-coded variables throughout the Titan Grove codebase. This system provides production-grade configurability for all business logic constants.

## Problem Statement

Previously, the codebase contained numerous hard-coded values scattered across different service classes:

- **Configure-to-Order Service**: Base prices (1000, 650), cost ratios (0.65), lead times (14, 7), engineering rates (150)
- **Capital Asset Management**: ROI scenario probabilities (60%, 20%, 20%), budget allocations (40%, 20%, 15%)
- **Manufacturing**: BOM complexity (0.65), production lead times
- **Message Queue**: Worker counts (4), concurrency (10), retry attempts (3), timeouts (30000)
- **Project Management**: Performance thresholds, billing rates
- **Analytics**: Credit utilization (0.65), performance thresholds

## Solution Architecture

### 1. Configuration Types (`src/types/business-config.ts`)

Comprehensive TypeScript interfaces defining all configurable business parameters:

```typescript
export interface ConfigureToOrderConfig {
  defaultBasePrice: number;           // Replaces: 1000
  defaultBaseCost: number;            // Replaces: 650
  defaultCostRatio: number;           // Replaces: 0.65
  defaultLeadTimeBase: number;        // Replaces: 14
  standardComplexityMaxOptions: number; // Replaces: 3
  complexComplexityMaxOptions: number;  // Replaces: 8
  engineeringHourlyRate: number;      // Replaces: 150
  // ... additional fields
}

export interface CapitalAssetConfig {
  roiScenarios: {
    baseCase: { probability: number };     // Replaces: 60
    optimistic: { probability: number };   // Replaces: 20
    pessimistic: { probability: number };  // Replaces: 20
  };
  budgetAllocations: {
    productionEquipment: number;      // Replaces: 40
    regulatoryCompliance: number;     // Replaces: 20
    digitalTransformation: number;    // Replaces: 15
  };
  // ... additional fields
}
```

### 2. Configuration Loader (`src/utils/business-config.ts`)

Production-grade configuration loader with:
- **Joi Schema Validation**: Ensures all values meet business constraints
- **Environment Variable Support**: All settings configurable via env vars
- **Sensible Defaults**: Maintains backward compatibility
- **Type Safety**: Full TypeScript support

```typescript
export function loadBusinessConfig(): BusinessConfig {
  // Load from environment with fallbacks to defaults
  const config = {
    configureToOrder: {
      defaultBasePrice: process.env.CTO_DEFAULT_BASE_PRICE 
        ? parseInt(process.env.CTO_DEFAULT_BASE_PRICE, 10) 
        : undefined, // Uses schema default: 1000
    },
    // ... other configurations
  };

  const { value } = businessConfigSchema.validate(config);
  return value as BusinessConfig;
}
```

### 3. Service Class Updates

Services now accept configuration through constructor dependency injection:

```typescript
// Before: Hard-coded values
export class ConfigureToOrderService {
  private async getConfigurableProduct(productId: string) {
    return {
      basePrice: 1000,        // Hard-coded
      baseCost: 650,          // Hard-coded
      leadTimeBase: 14,       // Hard-coded
    };
  }
}

// After: Configurable values
export class ConfigureToOrderService {
  constructor(private config: ConfigureToOrderConfig) {}
  
  private async getConfigurableProduct(productId: string) {
    return {
      basePrice: this.config.defaultBasePrice,
      baseCost: this.config.defaultBaseCost,
      leadTimeBase: this.config.defaultLeadTimeBase,
    };
  }
}
```

## Environment Variable Configuration

All business constants are configurable via environment variables:

### Configure-to-Order Settings
```bash
# Product Configuration Defaults
CTO_DEFAULT_BASE_PRICE=1000
CTO_DEFAULT_BASE_COST=650
CTO_DEFAULT_COST_RATIO=0.65
CTO_DEFAULT_LEAD_TIME_BASE=14

# Manufacturing Complexity Thresholds
CTO_STANDARD_COMPLEXITY_MAX_OPTIONS=3
CTO_COMPLEX_COMPLEXITY_MAX_OPTIONS=8

# Engineering Configuration
CTO_ENGINEERING_HOURLY_RATE=150
CTO_DEFAULT_ENGINEERING_DURATION=15
CTO_PROTOTYPE_DEVELOPMENT_DURATION=10
```

### Capital Asset Management Settings
```bash
# ROI Analysis Scenarios (percentages)
CAM_ROI_BASE_CASE_PROBABILITY=60
CAM_ROI_OPTIMISTIC_PROBABILITY=20
CAM_ROI_PESSIMISTIC_PROBABILITY=20

# Budget Allocation Recommendations (percentages)
CAM_BUDGET_PRODUCTION_EQUIPMENT=40
CAM_BUDGET_REGULATORY_COMPLIANCE=20
CAM_BUDGET_DIGITAL_TRANSFORMATION=15
```

### Manufacturing Settings
```bash
# BOM Management
MFG_DEFAULT_BOM_COMPLEXITY=0.65

# Production Lead Times (days)
MFG_STANDARD_PRODUCTION_LEAD_TIME=7
MFG_CUSTOM_PRODUCTION_LEAD_TIME=21
```

### Message Queue Settings
```bash
# Clustering
MQ_CLUSTER_WORKERS=4
MQ_CLUSTER_CONCURRENCY=10

# Monitoring Thresholds
MQ_QUEUE_DEPTH_THRESHOLD=1000
MQ_PROCESSING_TIME_THRESHOLD=30000
MQ_ERROR_RATE_THRESHOLD=0.1
```

### Warehouse Management Settings
```bash
# Operating Hours
WM_WEEKDAY_START_TIME=08:00
WM_WEEKDAY_END_TIME=17:00
WM_SATURDAY_START_TIME=09:00
WM_SATURDAY_END_TIME=13:00

# Shift Configuration
WM_DAY_SHIFT_START_TIME=08:00
WM_DAY_SHIFT_END_TIME=16:00
WM_DAY_SHIFT_STAFF_COUNT=30

WM_EVENING_SHIFT_START_TIME=16:00
WM_EVENING_SHIFT_END_TIME=24:00
WM_EVENING_SHIFT_STAFF_COUNT=15

WM_NIGHT_SHIFT_START_TIME=00:00
WM_NIGHT_SHIFT_END_TIME=08:00
WM_NIGHT_SHIFT_STAFF_COUNT=5

# Storage Area Configuration
WM_BULK_STORAGE_LENGTH=200
WM_BULK_STORAGE_WIDTH=100
WM_BULK_STORAGE_HEIGHT=30
WM_BULK_TOTAL_POSITIONS=1000
WM_BULK_UTILIZATION_RATE=80
WM_BULK_TURNOVER_RATE=12

WM_RACK_STORAGE_LENGTH=300
WM_RACK_STORAGE_WIDTH=150
WM_RACK_STORAGE_HEIGHT=25
WM_RACK_TOTAL_POSITIONS=2000
WM_RACK_UTILIZATION_RATE=75
WM_RACK_TURNOVER_RATE=24

# Dock Door Configuration
WM_DOCK_DOOR_COUNT=10
WM_DOCK_DOOR_HEIGHT=9
WM_DOCK_DOOR_WIDTH=8
WM_DOCK_LEVELING_DEFAULT=true
```

### Manufacturing Integration Settings
```bash
# Industry 4.0 IoT Sensor Latencies (milliseconds)
MFG_INDUSTRY40_DEFAULT_SENSOR_LATENCY=125
MFG_INDUSTRY40_TEMPERATURE_SENSOR_LATENCY=12
MFG_INDUSTRY40_VIBRATION_SENSOR_LATENCY=18
MFG_INDUSTRY40_PRESSURE_SENSOR_LATENCY=8

# Supply Chain Integration Data Volumes (KB)
MFG_INTEGRATION_DEMAND_PLANNING_KB=1547
MFG_INTEGRATION_PRODUCTION_DATA_KB=2847
MFG_INTEGRATION_INVENTORY_DATA_KB=256
MFG_INTEGRATION_MAINTENANCE_DATA_KB=125

# Supply Chain Integration Latencies (milliseconds)
MFG_INTEGRATION_DEMAND_PLANNING_MS=150
MFG_INTEGRATION_PRODUCTION_DATA_MS=12
MFG_INTEGRATION_INVENTORY_DATA_MS=180
MFG_INTEGRATION_MAINTENANCE_DATA_MS=35

# Supply Chain Integration Reliability (percentage)
MFG_INTEGRATION_DEMAND_PLANNING_RELIABILITY=98.5
MFG_INTEGRATION_PRODUCTION_DATA_RELIABILITY=98.9
MFG_INTEGRATION_INVENTORY_DATA_RELIABILITY=99.2
MFG_INTEGRATION_MAINTENANCE_DATA_RELIABILITY=97.8

# Migration Business Value (USD)
MFG_INTEGRATION_IMMEDIATE_VALUE=2500000
MFG_INTEGRATION_STRATEGIC_VALUE=8750000
MFG_INTEGRATION_FUTURE_VALUE=15000000
```

## Service Factory Pattern

Services can be created with custom configuration:

```typescript
import { createConfigureToOrderService } from './modules/orders';
import { createWarehouseManagementService, createManufacturingIntegrationService } from './utils/service-factories';
import { loadBusinessConfig } from './utils/business-config';

// Use default configuration
const defaultService = configureToOrderService;

// Use warehouse management factory
const warehouseFactory = createWarehouseManagementService();
const operatingHours = warehouseFactory.getDefaultOperatingHours();
const shiftPattern = warehouseFactory.getDefaultShiftPattern();

// Use manufacturing integration factory
const manufacturingFactory = createManufacturingIntegrationService();
const integrationMetrics = manufacturingFactory.getIntegrationMetrics();
const sensorLatencies = manufacturingFactory.getSensorLatencies();

// Use custom configuration
const customConfig = loadBusinessConfig();
customConfig.configureToOrder.defaultBasePrice = 2000;
const customService = createConfigureToOrderService(customConfig.configureToOrder);

// Use environment-specific configuration
const prodService = createConfigureToOrderService({
  defaultBasePrice: parseInt(process.env.PROD_BASE_PRICE || '1500'),
  defaultCostRatio: parseFloat(process.env.PROD_COST_RATIO || '0.70'),
  // ... other production settings
});
```

## Migration Guide

### For Existing Services

1. **Add Configuration Interface**
   ```typescript
   import { YourServiceConfig } from '../../../types/business-config';
   ```

2. **Update Constructor**
   ```typescript
   export class YourService {
     constructor(private config: YourServiceConfig) {}
   }
   ```

3. **Replace Hard-coded Values**
   ```typescript
   // Before
   const threshold = 100;
   
   // After
   const threshold = this.config.defaultThreshold;
   ```

4. **Update Service Export**
   ```typescript
   // Create factory function
   export function createYourService(config: YourServiceConfig): YourService {
     return new YourService(config);
   }
   
   // Export configured instance
   export const yourService = createYourService(defaultConfig);
   ```

### For New Services

1. Define configuration interface in `src/types/business-config.ts`
2. Add environment variable mappings in `src/utils/business-config.ts`
3. Add schema validation with defaults
4. Implement service with configuration injection
5. Create factory function and export configured instance

## Configuration Schema Validation

All configurations are validated using Joi schemas:

```typescript
const configSchema = Joi.object({
  defaultBasePrice: Joi.number().min(0).default(1000),
  defaultCostRatio: Joi.number().min(0).max(1).default(0.65),
  standardComplexityMaxOptions: Joi.number().integer().min(1).default(3),
  // ... additional validations
});
```

### Validation Rules
- **Price values**: Must be non-negative numbers
- **Ratios**: Must be between 0 and 1
- **Counts**: Must be positive integers
- **Percentages**: Must be between 0 and 100
- **Time values**: Must be positive numbers

## Testing

Comprehensive test suite validates:

```typescript
describe('Business Configuration System', () => {
  test('loads business configuration with defaults', () => {
    const config = loadBusinessConfig();
    expect(config.configureToOrder.defaultBasePrice).toBe(1000);
  });

  test('validates environment variable override', () => {
    process.env.CTO_DEFAULT_BASE_PRICE = '1500';
    const config = loadBusinessConfig();
    expect(config.configureToOrder.defaultBasePrice).toBe(1500);
  });

  test('creates configurable service instances', () => {
    const service = createConfigureToOrderService(customConfig);
    expect(service).toBeInstanceOf(ConfigureToOrderService);
  });
});
```

## Production Deployment

### Configuration Files

1. **Development** (`.env.development`)
   ```bash
   CTO_DEFAULT_BASE_PRICE=1000
   CTO_ENGINEERING_HOURLY_RATE=150
   ```

2. **Staging** (`.env.staging`)
   ```bash
   CTO_DEFAULT_BASE_PRICE=1200
   CTO_ENGINEERING_HOURLY_RATE=160
   ```

3. **Production** (`.env.production`)
   ```bash
   CTO_DEFAULT_BASE_PRICE=1500
   CTO_ENGINEERING_HOURLY_RATE=175
   ```

### Docker Configuration

```dockerfile
ENV CTO_DEFAULT_BASE_PRICE=1500
ENV CTO_ENGINEERING_HOURLY_RATE=175
ENV CAM_ROI_BASE_CASE_PROBABILITY=65
```

### Kubernetes ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: titan-grove-business-config
data:
  CTO_DEFAULT_BASE_PRICE: "1500"
  CTO_ENGINEERING_HOURLY_RATE: "175"
  CAM_ROI_BASE_CASE_PROBABILITY: "65"
```

## Benefits

### 1. Production-Grade Configurability
- All business constants configurable via environment variables
- No code changes required for parameter adjustments
- Environment-specific configurations (dev/staging/prod)

### 2. Type Safety
- Full TypeScript support with interfaces
- Compile-time validation of configuration usage
- IDE autocomplete and refactoring support

### 3. Validation & Defaults
- Joi schema validation ensures data integrity
- Sensible defaults maintain backward compatibility
- Clear error messages for invalid configurations

### 4. Maintainability
- Centralized configuration reduces duplication
- Single source of truth for all business constants
- Easy to track and audit configuration changes

### 5. Testing
- Easy to test with different configuration scenarios
- Mocking and stubbing configurations for unit tests
- Integration testing with various parameter sets

## Future Enhancements

1. **Dynamic Configuration Updates**: Runtime configuration reloading
2. **Configuration UI**: Admin interface for parameter management
3. **A/B Testing Support**: Feature flags and gradual rollouts
4. **Configuration Versioning**: Track changes and rollback capability
5. **Multi-tenant Configuration**: Tenant-specific parameter sets

## Implementation Status

### ✅ Completed
- [x] Core configuration system architecture
- [x] Configure-to-Order service refactoring (all hard-coded values)
- [x] Capital Asset Management service refactoring
- [x] Manufacturing service configuration (Industry 4.0, Supply Chain Integration)
- [x] Warehouse Management service configuration (operating hours, shifts, storage areas)
- [x] Environment variable mappings and validation
- [x] Service factory pattern implementation
- [x] Comprehensive test suite
- [x] Documentation and examples

### 🔄 In Progress
- [ ] Order Analytics service configuration
- [ ] Message Queue service configuration
- [ ] Project Management service configuration

### 📋 Planned
- [ ] UI configuration management interface
- [ ] Configuration change auditing
- [ ] Performance monitoring for config-driven features
- [ ] Multi-environment deployment automation