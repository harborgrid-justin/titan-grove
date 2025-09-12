# Centralized Data Provider Usage Guide

## Overview

The Centralized Data Provider eliminates hardcoded mock data and provides a unified interface for all configurable business constants, demo data, and operational parameters throughout the Titan Grove application.

## Key Features

- **Singleton Pattern**: Single source of truth for all data
- **Environment Variable Support**: Override any value with `TG_*` environment variables
- **Type Safety**: Full TypeScript interfaces for all data structures
- **Backward Compatibility**: Graceful fallbacks when data provider isn't available
- **A/B Testing Support**: Programmatic overrides for testing different values
- **Production Ready**: Comprehensive validation and error handling

## Quick Start

### Basic Usage

```typescript
import { dataProvider } from '../utils/centralized-data-provider';

// Get service metrics
const metrics = dataProvider.getServiceMetrics();
console.log(`Active service requests: ${metrics.totalServiceRequests}`);

// Get competitive comparison data
const comparison = dataProvider.getCompetitiveComparison();
console.log(`Oracle EBS Rating: ${comparison.oracle.dashboardRating}`);
console.log(`Titan Grove Rating: ${comparison.titanGrove.dashboardRating}`);
```

### Environment Variable Configuration

Override any value using environment variables with the `TG_` prefix:

```bash
# Override service metrics
export TG_MOCK_TOTAL_SERVICE_REQUESTS=3000
export TG_MOCK_FIRST_TIME_FIX_RATE=95.5

# Override competitive ratings
export TG_ORACLE_EBS_DASHBOARD_RATING=7.0
export TG_TITAN_GROVE_DASHBOARD_RATING=9.8

# Override procurement data
export TG_PROCUREMENT_TOTAL_SPEND=8500000
export TG_PROCUREMENT_ACTIVE_SUPPLIERS=220
```

### Using in Services

Replace hardcoded values in service classes:

```typescript
// Before (hardcoded)
async getProcurementDashboard() {
  return {
    totalSpend: 5200000,
    activeSuppliers: 147,
    // ... more hardcoded values
  };
}

// After (centralized)
async getProcurementDashboard() {
  try {
    const { dataProvider } = require('../utils/centralized-data-provider');
    return dataProvider.getProcurementDashboard();
  } catch (error) {
    // Fallback to hardcoded values for backward compatibility
    return { /* fallback values */ };
  }
}
```

## Available Data Sources

### Service Metrics
- `getServiceMetrics()`: Service request counts, fix rates, satisfaction scores
- Environment prefix: `TG_MOCK_*`

### Competitive Analysis
- `getCompetitiveComparison()`: Oracle EBS vs Titan Grove feature ratings
- Environment prefix: `TG_ORACLE_EBS_*`, `TG_TITAN_GROVE_*`

### Predictive Analytics
- `getWorkloadForecast()`: 7-day workload predictions
- `getResourceDemand()`: Resource shortage forecasts
- `getQualityPrediction()`: Quality improvement predictions

### Command Center Data
- `getServiceCommandCenterData()`: Demo command center configuration
- Environment prefix: `TG_DEMO_*`

### Business Operations
- `getProcurementDashboard()`: Procurement spend and supplier data
- `getManufacturingRoutingDefaults()`: Manufacturing operation defaults
- Environment prefixes: `TG_PROCUREMENT_*`, `TG_MFG_*`

## Migration Guide

### Step 1: Identify Hardcoded Values

Look for hardcoded numbers in your services:
```bash
grep -r ": [0-9]\{3,\}" src/modules/ --include="*.ts"
```

### Step 2: Add to Data Provider

Add new data methods to `CentralizedDataProvider`:
```typescript
public getYourModuleData() {
  return {
    someValue: this.getConfigValue('YOUR_MODULE_SOME_VALUE', 1000),
    anotherValue: this.getConfigValue('YOUR_MODULE_ANOTHER_VALUE', 'default'),
  };
}
```

### Step 3: Update Service

Replace hardcoded values in your service:
```typescript
try {
  const { dataProvider } = require('../utils/centralized-data-provider');
  return dataProvider.getYourModuleData();
} catch (error) {
  // Fallback for backward compatibility
  return { /* hardcoded fallback */ };
}
```

### Step 4: Add Tests

Create tests for your new data methods:
```typescript
test('should return your module data', () => {
  const data = provider.getYourModuleData();
  expect(data.someValue).toBe(1000);
});
```

## Advanced Features

### Programmatic Overrides

```typescript
// For A/B testing or multi-tenant scenarios
dataProvider.setOverride('MOCK_TOTAL_SERVICE_REQUESTS', 5000);
const metrics = dataProvider.getServiceMetrics(); // Uses overridden value
dataProvider.clearOverride('MOCK_TOTAL_SERVICE_REQUESTS');
```

### Debugging

```typescript
// Get all current data values
const allData = dataProvider.getAllData();
console.log(JSON.stringify(allData, null, 2));
```

### Complex Data Types

The provider supports arrays and objects via JSON environment variables:
```bash
export TG_WORKLOAD_FORECAST_NEXT_7_DAYS='[40, 35, 45, 50, 42, 38, 44]'
export TG_PROCUREMENT_TOP_CATEGORIES='[{"category": "Materials", "spend": 3000000}]'
```

## Benefits

### Before Centralization
- ❌ Hardcoded values scattered across 50+ files
- ❌ No way to configure demo data for different environments
- ❌ Difficult to A/B test different business parameters
- ❌ Manual updates required in multiple places

### After Centralization
- ✅ Single source of truth for all configurable data
- ✅ Environment variable support for all values
- ✅ Type-safe interfaces prevent runtime errors
- ✅ Backward compatibility with existing code
- ✅ Easy testing and configuration management
- ✅ Production-ready with comprehensive error handling

## Integration with Existing Systems

The Centralized Data Provider integrates seamlessly with:
- **Business Configuration System** (`business-config.ts`)
- **Service Analytics Constants** (`constants/index.ts`)
- **Demo Files** (`.development/demos/`)
- **Service Factories** (`utils/service-factories.ts`)

## Environment Examples

### Development
```bash
# High demo values for impressive demos
export TG_DEMO_ACTIVE_SERVICES=500
export TG_DEMO_PERFORMANCE_SCORE=98.5
```

### Testing
```bash
# Predictable test values
export TG_MOCK_TOTAL_SERVICE_REQUESTS=1000
export TG_MOCK_FIRST_TIME_FIX_RATE=90.0
```

### Production
```bash
# Real production metrics
export TG_PROCUREMENT_TOTAL_SPEND=15000000
export TG_PROCUREMENT_ACTIVE_SUPPLIERS=350
```

This centralized approach provides production-grade configurability while maintaining backward compatibility and comprehensive test coverage.