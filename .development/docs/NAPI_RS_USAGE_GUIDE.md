# 📘 NAPI-RS Usage Guide - Titan Grove Enterprise Suite

## Table of Contents

1. [Getting Started](#getting-started)
2. [Basic Usage Patterns](#basic-usage-patterns)
3. [Module-Specific Examples](#module-specific-examples)
4. [Advanced Usage](#advanced-usage)
5. [Integration Patterns](#integration-patterns)
6. [Performance Optimization](#performance-optimization)
7. [Error Handling](#error-handling)
8. [Best Practices](#best-practices)

## Getting Started

### Your First NAPI-RS Module Call

```javascript
// Import Titan Grove native modules
const titanGrove = require('titan-grove');

// Simple calculation example
const result = titanGrove.sum(10, 25);
console.log('Sum result:', result); // Output: Sum result: 35

// Business calculation example
const riskScore = titanGrove.calculateRiskScore(0.75, 0.6, 0.8);
console.log('Risk Score:', riskScore); // Output: Risk Score: 0.72
```

### Environment Setup Verification

```javascript
// Verify your NAPI-RS setup
const { getSystemOverview } = require('titan-grove');

try {
  const systemInfo = getSystemOverview();
  console.log('✅ NAPI-RS modules loaded successfully');
  console.log('System Info:', systemInfo);
} catch (error) {
  console.error('❌ NAPI-RS setup issue:', error.message);
}
```

## Basic Usage Patterns

### 1. Simple Function Calls

```javascript
const { 
  calculateRiskScore,
  calculateCustomerLifetimeValue,
  calculateProductionCapacity 
} = require('titan-grove');

// Risk management
const risk = calculateRiskScore(0.8, 0.6, 0.9);

// Customer analytics
const clv = calculateCustomerLifetimeValue(2000, 0.85, 0.12);

// Manufacturing metrics
const capacity = calculateProductionCapacity(150, 8, 0.92);
```

### 2. Data Structure Handling

```javascript
const { 
  generateFinancialReport,
  analyzeDefectPatterns,
  optimizeInventoryItem 
} = require('titan-grove');

// Complex data processing
const financialData = [10000, 12000, 9500, 11000];
const report = generateFinancialReport(financialData);

// Array processing
const defectData = [0.02, 0.015, 0.03, 0.01];
const analysis = analyzeDefectPatterns(defectData);

// Object-based operations
const inventoryResult = optimizeInventoryItem({
  id: "ITEM001",
  currentStock: 100,
  demandRate: 50,
  leadTime: 7
});
```

### 3. Configuration Management

```javascript
const { 
  getProductionConfig,
  updateProductionConfig,
  initializeProductionEnvironment 
} = require('titan-grove');

// Get current configuration
const config = getProductionConfig();
console.log('Current config:', config);

// Update configuration
const newConfig = {
  maxConcurrency: 10,
  cacheSize: 1000,
  enableMonitoring: true
};
updateProductionConfig(JSON.stringify(newConfig));

// Initialize environment
const success = initializeProductionEnvironment(newConfig);
console.log('Environment initialized:', success);
```

## Module-Specific Examples

### Financial Management

```javascript
const financial = require('@titan-grove/financial');

// Budget variance analysis
const budgetVariance = financial.calculateBudgetVariance(100000, 95000);
console.log('Budget variance:', budgetVariance); // -5000 (under budget)

// ROI calculation
const roi = financial.calculateRoi(150000, 120000);
console.log('ROI:', roi); // 25%

// Cash flow projection
const cashFlow = financial.calculateCashFlowProjection([10000, 12000, 15000]);
console.log('Cash flow projection:', cashFlow);

// Financial ratios
const ratios = financial.calculateFinancialRatios({
  currentAssets: 500000,
  currentLiabilities: 300000,
  totalAssets: 1000000,
  totalLiabilities: 600000
});
console.log('Financial ratios:', ratios);
```

### Human Resources

```javascript
const hr = require('@titan-grove/hr');

// Payroll calculation
const payroll = hr.calculatePayroll({
  baseSalary: 60000,
  hoursWorked: 2080,
  overtimeHours: 100,
  benefits: 15000
});

// Performance scoring
const performance = hr.calculatePerformanceScore({
  goals: 0.85,
  collaboration: 0.90,
  innovation: 0.75,
  reliability: 0.95
});

// Turnover analysis
const turnover = hr.calculateTurnoverRate(150, 12); // 150 employees, 12 left
console.log('Annual turnover rate:', turnover);

// Training ROI
const trainingROI = hr.calculateTrainingRoi(50000, 75000);
console.log('Training ROI:', trainingROI);
```

### Customer Relationship Management

```javascript
const crm = require('@titan-grove/crm');

// Customer lifetime value
const clv = crm.calculateCustomerLifetimeValue(2500, 0.80, 0.15);
console.log('Customer Lifetime Value:', clv);

// Lead scoring
const leadScore = crm.calculateLeadScore({
  emailEngagement: 0.8,
  websiteActivity: 0.6,
  demographicFit: 0.9,
  behaviorScore: 0.7
});

// Churn prediction
const churnProbability = crm.calculateChurnProbability({
  lastPurchase: 90, // days ago
  supportTickets: 3,
  engagementScore: 0.4,
  contractValue: 10000
});

// Sales conversion
const conversion = crm.calculateSalesConversionRate(1000, 150);
console.log('Conversion rate:', conversion);
```

### Manufacturing Operations

```javascript
const manufacturing = require('@titan-grove/manufacturing');

// OEE (Overall Equipment Effectiveness)
const oee = manufacturing.calculateOeeScore(0.95, 0.98, 0.92);
console.log('OEE Score:', oee); // 85.6%

// Production capacity
const capacity = manufacturing.calculateProductionCapacity(100, 8, 0.85);
console.log('Daily capacity:', capacity);

// Material requirements
const materials = manufacturing.calculateMaterialRequirements({
  productionPlan: [100, 150, 200],
  billOfMaterials: {
    steel: 2.5,
    plastic: 1.2,
    electronics: 0.8
  }
});

// Cycle time optimization
const cycleTime = manufacturing.calculateCycleTime({
  setupTime: 30,
  processingTime: 120,
  waitTime: 15,
  transportTime: 10
});
```

### Supply Chain Management

```javascript
const scm = require('@titan-grove/scm');

// Inventory optimization
const inventory = scm.optimizeInventoryLevels({
  items: [
    { id: 'A001', demand: 100, leadTime: 5, cost: 50 },
    { id: 'B002', demand: 200, leadTime: 3, cost: 25 }
  ],
  serviceLevel: 0.95
});

// Demand forecasting
const forecast = scm.calculateDemandForecast([100, 120, 115, 130, 125]);
console.log('Next period forecast:', forecast);

// Supplier performance
const supplierScore = scm.calculateScmVendorPerformanceScore({
  onTimeDelivery: 0.95,
  qualityRating: 0.98,
  costCompetitiveness: 0.85,
  responsiveness: 0.90
});

// Route optimization
const route = scm.calculateOptimalRoute([
  { lat: 40.7128, lng: -74.0060 }, // New York
  { lat: 34.0522, lng: -118.2437 }, // Los Angeles
  { lat: 41.8781, lng: -87.6298 }  // Chicago
]);
```

### Business Intelligence

```javascript
const bi = require('@titan-grove/bi');

// KPI calculations
const kpiVariance = bi.calculateKpiVariance(85, 90); // actual vs target

// Trend analysis
const trend = bi.calculateTrendStrength([100, 105, 110, 108, 115, 120]);
console.log('Trend strength:', trend);

// Anomaly detection
const anomalies = bi.detectAnomalies([
  100, 102, 98, 105, 99, 250, 101, 103 // 250 is an anomaly
]);

// Cohort retention
const retention = bi.calculateCohortRetention({
  initialUsers: 1000,
  month1: 800,
  month2: 650,
  month3: 520
});

// Performance index
const perfIndex = bi.calculatePerformanceIndex({
  revenue: 1000000,
  costs: 750000,
  efficiency: 0.85,
  customerSat: 0.92
});
```

## Advanced Usage

### Async Operations with Production Features

```javascript
const { 
  executeWithResilience,
  recordPerformanceMetric,
  getHealthStatus 
} = require('titan-grove');

// Resilient execution with retry logic
async function robustCalculation() {
  try {
    const result = executeWithResilience('calculateComplexMetrics', {
      maxRetries: 3,
      backoffMs: 1000,
      circuitBreakerThreshold: 5
    });
    
    // Record performance metrics
    recordPerformanceMetric('complex_calculation', result.executionTime);
    
    return result;
  } catch (error) {
    console.error('Calculation failed after retries:', error);
    throw error;
  }
}

// Health monitoring
function monitorSystemHealth() {
  const health = getHealthStatus();
  
  if (health.status !== 'healthy') {
    console.warn('System health issue:', health);
    // Implement alerting logic
  }
  
  return health;
}
```

### Batch Processing

```javascript
const { 
  bulkCreateAdvancedManufacturingRecords,
  analyzeAdvancedManufacturingPerformance 
} = require('titan-grove');

// Batch data processing
async function processBatchData(records) {
  // Create records in bulk for better performance
  const result = bulkCreateAdvancedManufacturingRecords(records);
  
  // Analyze performance across all records
  const analysis = analyzeAdvancedManufacturingPerformance(result.ids);
  
  return {
    processed: result.count,
    analysis: analysis,
    processingTime: result.executionTime
  };
}

// Example usage
const manufacturingData = [
  { productId: 'P001', quantity: 100, quality: 0.98 },
  { productId: 'P002', quantity: 150, quality: 0.95 },
  { productId: 'P003', quantity: 200, quality: 0.97 }
];

processBatchData(manufacturingData)
  .then(result => console.log('Batch processing complete:', result))
  .catch(error => console.error('Batch processing failed:', error));
```

### Real-time Analytics

```javascript
const { 
  calculateRealTimeAnalyticsMetrics,
  processRealTimeAnalyticsData 
} = require('titan-grove');

// Real-time data stream processing
class RealTimeAnalytics {
  constructor() {
    this.buffer = [];
    this.windowSize = 100;
  }
  
  processDataPoint(dataPoint) {
    this.buffer.push(dataPoint);
    
    // Maintain sliding window
    if (this.buffer.length > this.windowSize) {
      this.buffer.shift();
    }
    
    // Calculate real-time metrics
    const metrics = calculateRealTimeAnalyticsMetrics(this.buffer);
    
    // Process for insights
    const insights = processRealTimeAnalyticsData(JSON.stringify(metrics));
    
    return {
      currentMetrics: metrics,
      insights: JSON.parse(insights),
      bufferSize: this.buffer.length
    };
  }
}

// Usage
const analytics = new RealTimeAnalytics();

// Simulate real-time data
setInterval(() => {
  const dataPoint = {
    timestamp: Date.now(),
    value: Math.random() * 100,
    category: 'sensor_reading'
  };
  
  const result = analytics.processDataPoint(dataPoint);
  console.log('Real-time analysis:', result);
}, 1000);
```

## Integration Patterns

### Express.js API Integration

```javascript
const express = require('express');
const { 
  calculateRiskScore,
  generateFinancialReport,
  calculateCustomerLifetimeValue 
} = require('titan-grove');

const app = express();
app.use(express.json());

// Risk assessment endpoint
app.post('/api/risk/assess', (req, res) => {
  try {
    const { probability, impact, vulnerability } = req.body;
    const riskScore = calculateRiskScore(probability, impact, vulnerability);
    
    res.json({
      success: true,
      riskScore,
      riskLevel: riskScore > 0.7 ? 'High' : riskScore > 0.4 ? 'Medium' : 'Low'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Financial reporting endpoint
app.post('/api/financial/report', (req, res) => {
  try {
    const { financialData } = req.body;
    const report = generateFinancialReport(financialData);
    
    res.json({
      success: true,
      report: JSON.parse(report),
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### React Component Integration

```jsx
import React, { useState, useEffect } from 'react';

// Custom hook for NAPI-RS operations
function useNativeCalculations() {
  const [calculations, setCalculations] = useState({});
  const [loading, setLoading] = useState(false);
  
  const calculateMetrics = async (data) => {
    setLoading(true);
    try {
      // Call backend API that uses NAPI-RS
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      setCalculations(result);
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return { calculations, loading, calculateMetrics };
}

// React component using native calculations
function FinancialDashboard() {
  const { calculations, loading, calculateMetrics } = useNativeCalculations();
  
  useEffect(() => {
    // Initialize with sample data
    calculateMetrics({
      revenue: [100000, 120000, 110000],
      expenses: [70000, 80000, 75000]
    });
  }, []);
  
  return (
    <div className="dashboard">
      <h2>Financial Dashboard</h2>
      {loading ? (
        <div>Calculating metrics...</div>
      ) : (
        <div>
          <div>ROI: {calculations.roi}%</div>
          <div>Profit Margin: {calculations.profitMargin}%</div>
          <div>Growth Rate: {calculations.growthRate}%</div>
        </div>
      )}
    </div>
  );
}
```

### Database Integration

```javascript
const mysql = require('mysql2/promise');
const { 
  calculateInventoryTurnover,
  optimizeInventoryItem,
  generateInventoryMetrics 
} = require('titan-grove');

class InventoryService {
  constructor(dbConfig) {
    this.db = mysql.createConnection(dbConfig);
  }
  
  async analyzeInventoryPerformance() {
    try {
      // Fetch inventory data from database
      const [rows] = await this.db.execute(`
        SELECT item_id, avg_inventory, cogs, lead_time, demand_rate
        FROM inventory_items
        WHERE active = 1
      `);
      
      const results = [];
      
      for (const item of rows) {
        // Use native NAPI-RS calculations
        const turnover = calculateInventoryTurnover(
          item.avg_inventory, 
          item.cogs
        );
        
        const optimization = optimizeInventoryItem({
          id: item.item_id,
          currentStock: item.avg_inventory,
          demandRate: item.demand_rate,
          leadTime: item.lead_time
        });
        
        results.push({
          itemId: item.item_id,
          turnover,
          optimization: JSON.parse(optimization),
          calculatedAt: new Date()
        });
        
        // Update database with calculated metrics
        await this.db.execute(`
          UPDATE inventory_metrics 
          SET turnover_ratio = ?, 
              optimal_stock = ?,
              last_calculated = NOW()
          WHERE item_id = ?
        `, [turnover, optimization.optimalStock, item.item_id]);
      }
      
      // Generate overall inventory metrics
      const overallMetrics = generateInventoryMetrics(
        results.map(r => r.turnover)
      );
      
      return {
        itemResults: results,
        overallMetrics: JSON.parse(overallMetrics),
        processedItems: results.length
      };
    } catch (error) {
      console.error('Inventory analysis failed:', error);
      throw error;
    }
  }
}
```

## Performance Optimization

### Optimizing Function Calls

```javascript
const { performance } = require('perf_hooks');

// Batch operations for better performance
function optimizedBatchCalculation(data) {
  const start = performance.now();
  
  // Process data in batches rather than individual calls
  const batchSize = 1000;
  const results = [];
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const batchResult = processBatchData(batch);
    results.push(...batchResult);
  }
  
  const duration = performance.now() - start;
  console.log(`Processed ${data.length} items in ${duration.toFixed(2)}ms`);
  
  return results;
}

// Memory-efficient streaming
function streamingCalculation(dataStream) {
  let processed = 0;
  const results = [];
  
  return new Promise((resolve, reject) => {
    dataStream.on('data', (chunk) => {
      try {
        const result = processDataChunk(chunk);
        results.push(result);
        processed++;
        
        // Log progress every 1000 items
        if (processed % 1000 === 0) {
          console.log(`Processed ${processed} items`);
        }
      } catch (error) {
        reject(error);
      }
    });
    
    dataStream.on('end', () => {
      resolve({
        results,
        totalProcessed: processed
      });
    });
    
    dataStream.on('error', reject);
  });
}
```

### Caching Strategies

```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

function cachedCalculation(key, calculationFn, ...args) {
  // Check cache first
  const cached = cache.get(key);
  if (cached) {
    console.log('Cache hit for:', key);
    return cached;
  }
  
  // Perform calculation
  console.log('Cache miss, calculating:', key);
  const result = calculationFn(...args);
  
  // Cache the result
  cache.set(key, result);
  
  return result;
}

// Usage example
const riskScore = cachedCalculation(
  'risk_score_0.75_0.6_0.8',
  calculateRiskScore,
  0.75, 0.6, 0.8
);
```

## Error Handling

### Comprehensive Error Handling

```javascript
const { 
  calculateRiskScore,
  validateInput,
  logError 
} = require('titan-grove');

function safeRiskCalculation(probability, impact, vulnerability) {
  try {
    // Validate inputs using native validation
    const validation = validateInput(JSON.stringify({
      probability,
      impact,
      vulnerability
    }));
    
    if (!validation) {
      throw new Error('Invalid input parameters');
    }
    
    // Perform calculation
    const result = calculateRiskScore(probability, impact, vulnerability);
    
    // Validate result
    if (isNaN(result) || result < 0 || result > 1) {
      throw new Error('Invalid calculation result');
    }
    
    return {
      success: true,
      riskScore: result,
      calculatedAt: new Date().toISOString()
    };
    
  } catch (error) {
    // Log error using native logging
    logError(`Risk calculation failed: ${error.message}`);
    
    return {
      success: false,
      error: error.message,
      fallbackScore: 0.5 // Safe default
    };
  }
}

// Error recovery with fallback
function resilientCalculation(fn, fallbackValue) {
  return (...args) => {
    try {
      return fn(...args);
    } catch (error) {
      console.warn('Calculation failed, using fallback:', error.message);
      return fallbackValue;
    }
  };
}

// Usage
const safeCalculateROI = resilientCalculation(calculateRoi, 0);
const roi = safeCalculateROI(invalidData1, invalidData2); // Returns 0 instead of throwing
```

### Error Monitoring and Alerting

```javascript
const { 
  logError,
  recordBusinessMetric,
  getHealthStatus 
} = require('titan-grove');

class ErrorMonitor {
  constructor() {
    this.errorCount = 0;
    this.errorThreshold = 10;
  }
  
  handleError(error, context = {}) {
    this.errorCount++;
    
    // Log error with native logging
    logError(`Error in ${context.operation}: ${error.message}`);
    
    // Record business metric
    recordBusinessMetric('error_count', this.errorCount);
    
    // Check if we need to alert
    if (this.errorCount >= this.errorThreshold) {
      this.triggerAlert('High error rate detected');
      this.errorCount = 0; // Reset counter
    }
  }
  
  triggerAlert(message) {
    console.error('🚨 ALERT:', message);
    
    // Get system health status
    const health = getHealthStatus();
    console.error('System Health:', health);
    
    // Implement your alerting logic here
    // e.g., send email, Slack notification, etc.
  }
}

const errorMonitor = new ErrorMonitor();

// Wrapper function with error monitoring
function monitoredFunction(fn, operation) {
  return (...args) => {
    try {
      return fn(...args);
    } catch (error) {
      errorMonitor.handleError(error, { operation });
      throw error; // Re-throw if needed
    }
  };
}
```

## Best Practices

### 1. Input Validation

```javascript
const { validateInput, sanitizeInput } = require('titan-grove');

function validateAndSanitize(data) {
  // Sanitize input first
  const sanitized = sanitizeInput(JSON.stringify(data));
  const sanitizedData = JSON.parse(sanitized);
  
  // Validate using native validation
  const isValid = validateInput(sanitized);
  
  if (!isValid) {
    throw new Error('Data validation failed');
  }
  
  return sanitizedData;
}
```

### 2. Performance Monitoring

```javascript
const { recordPerformanceMetric } = require('titan-grove');

function withPerformanceTracking(fn, metricName) {
  return (...args) => {
    const start = performance.now();
    const result = fn(...args);
    const duration = performance.now() - start;
    
    recordPerformanceMetric(metricName, duration);
    
    return result;
  };
}

// Wrap your functions
const trackedRiskCalculation = withPerformanceTracking(
  calculateRiskScore, 
  'risk_calculation'
);
```

### 3. Resource Management

```javascript
// Implement connection pooling for database operations
class NativeCalculationPool {
  constructor(maxConcurrency = 10) {
    this.maxConcurrency = maxConcurrency;
    this.activeOperations = 0;
    this.queue = [];
  }
  
  async execute(operation) {
    if (this.activeOperations >= this.maxConcurrency) {
      await this.waitForSlot();
    }
    
    this.activeOperations++;
    
    try {
      const result = await operation();
      return result;
    } finally {
      this.activeOperations--;
      this.processQueue();
    }
  }
  
  waitForSlot() {
    return new Promise(resolve => {
      this.queue.push(resolve);
    });
  }
  
  processQueue() {
    if (this.queue.length > 0 && this.activeOperations < this.maxConcurrency) {
      const resolve = this.queue.shift();
      resolve();
    }
  }
}
```

### 4. Configuration Management

```javascript
const config = {
  development: {
    enableLogging: true,
    cacheSize: 100,
    batchSize: 100
  },
  production: {
    enableLogging: false,
    cacheSize: 1000,
    batchSize: 1000
  }
};

const currentConfig = config[process.env.NODE_ENV || 'development'];

// Apply configuration to native modules
const { updateProductionConfig } = require('titan-grove');
updateProductionConfig(JSON.stringify(currentConfig));
```

---

This usage guide provides comprehensive examples and patterns for effectively using the Titan Grove NAPI-RS modules. For specific module documentation, refer to the [Module Reference Guide](./NAPI_RS_MODULE_REFERENCE.md).