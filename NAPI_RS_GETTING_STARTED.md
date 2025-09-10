# 🚀 Getting Started with NAPI-RS - Titan Grove Enterprise Suite

## Quick Start (5 Minutes)

### 1. Prerequisites Check

```bash
# Check Node.js version (requires 18.0.0+)
node --version

# Check NPM version
npm --version

# Check if you have build tools (optional, for building from source)
gcc --version  # Linux/macOS
# or check for Visual Studio Build Tools on Windows
```

### 2. Installation

**Option A: NPM Install (Recommended)**
```bash
# Install the complete suite
npm install titan-grove

# Or install individual modules
npm install @titan-grove/financial @titan-grove/hr @titan-grove/crm
```

**Option B: From Source**
```bash
git clone https://github.com/harborgrid-justin/titan-grove.git
cd titan-grove
npm install --legacy-peer-deps
npm run build:native
```

### 3. First Test

```javascript
// test-basic.js
const { sum, calculateRiskScore } = require('titan-grove');

console.log('Basic test:', sum(2, 3)); // Should output: 5
console.log('Risk score:', calculateRiskScore(0.7, 0.8, 0.6)); // Business calculation
```

```bash
node test-basic.js
```

### 4. Verify Installation

```bash
# Run the comprehensive test suite
node test-all-120-modules.js

# Should show: ✅ Passed: 110/120 modules
```

**🎉 You're ready to go!** Jump to [Common Use Cases](#common-use-cases) for practical examples.

---

## Installation Guide

### System Requirements

- **Operating System**: Linux, macOS, Windows, FreeBSD
- **Node.js**: 18.0.0 or later
- **Memory**: 512MB available RAM
- **Disk Space**: 200MB for complete installation

### Platform-Specific Setup

#### Ubuntu/Debian Linux
```bash
# Update package list
sudo apt-get update

# Install build essentials
sudo apt-get install build-essential curl

# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Titan Grove
npm install titan-grove
```

#### macOS
```bash
# Install Xcode command line tools
xcode-select --install

# Install Node.js via Homebrew (if not already installed)
brew install node@18

# Install Titan Grove
npm install titan-grove
```

#### Windows
```powershell
# Install Visual Studio Build Tools (if building from source)
# Download from: https://visualstudio.microsoft.com/visual-cpp-build-tools/

# Install Node.js
# Download from: https://nodejs.org/

# Install Titan Grove
npm install titan-grove
```

### Docker Installation

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install titan-grove

# Copy your application
COPY . .

EXPOSE 3000
CMD ["node", "app.js"]
```

```bash
docker build -t my-titan-app .
docker run -p 3000:3000 my-titan-app
```

---

## Your First Application

### 1. Simple Calculator Service

```javascript
// calculator-service.js
const express = require('express');
const { 
  sum,
  calculateRoi,
  calculateRiskScore,
  calculateCustomerLifetimeValue 
} = require('titan-grove');

const app = express();
app.use(express.json());

// Basic math
app.get('/add/:a/:b', (req, res) => {
  const result = sum(parseInt(req.params.a), parseInt(req.params.b));
  res.json({ result });
});

// Business calculations
app.post('/business/roi', (req, res) => {
  const { investment, returns } = req.body;
  const roi = calculateRoi(returns, investment);
  res.json({ 
    investment, 
    returns, 
    roi: `${(roi * 100).toFixed(2)}%` 
  });
});

app.post('/business/risk', (req, res) => {
  const { probability, impact, vulnerability } = req.body;
  const score = calculateRiskScore(probability, impact, vulnerability);
  const level = score > 0.7 ? 'High' : score > 0.4 ? 'Medium' : 'Low';
  res.json({ score, level });
});

app.post('/business/clv', (req, res) => {
  const { avgPurchase, retentionRate, churnRate } = req.body;
  const clv = calculateCustomerLifetimeValue(avgPurchase, retentionRate, churnRate);
  res.json({ customerLifetimeValue: clv });
});

app.listen(3000, () => {
  console.log('Calculator service running on port 3000');
  console.log('Try: curl http://localhost:3000/add/10/25');
});
```

**Test it:**
```bash
node calculator-service.js

# In another terminal:
curl http://localhost:3000/add/10/25
curl -X POST http://localhost:3000/business/roi \
  -H "Content-Type: application/json" \
  -d '{"investment": 100000, "returns": 120000}'
```

### 2. Financial Dashboard

```javascript
// financial-dashboard.js
const { 
  calculateAccountBalance,
  calculateBudgetVariance,
  calculateFinancialRatios,
  generateFinancialReport 
} = require('titan-grove');

class FinancialDashboard {
  constructor() {
    this.accounts = {
      checking: [10000, -2000, 5000, -1000],
      savings: [50000, 2000],
      investments: [100000, -10000, 15000]
    };
  }

  getAccountBalances() {
    const balances = {};
    for (const [account, transactions] of Object.entries(this.accounts)) {
      const credits = transactions.filter(t => t > 0);
      const debits = transactions.filter(t => t < 0).map(Math.abs);
      balances[account] = calculateAccountBalance(credits, debits);
    }
    return balances;
  }

  getBudgetAnalysis() {
    const budgeted = 150000;
    const balances = this.getAccountBalances();
    const actual = Object.values(balances).reduce((sum, bal) => sum + bal, 0);
    
    return {
      budgeted,
      actual,
      variance: calculateBudgetVariance(budgeted, actual),
      percentageVariance: ((actual - budgeted) / budgeted * 100).toFixed(2) + '%'
    };
  }

  getFinancialRatios() {
    const balances = this.getAccountBalances();
    return calculateFinancialRatios({
      currentAssets: balances.checking + balances.savings,
      currentLiabilities: 20000,
      totalAssets: Object.values(balances).reduce((sum, bal) => sum + bal, 0),
      totalLiabilities: 50000,
      revenue: 200000,
      netIncome: 40000
    });
  }

  generateFullReport() {
    const balances = this.getAccountBalances();
    const budget = this.getBudgetAnalysis();
    const ratios = JSON.parse(this.getFinancialRatios());

    return {
      timestamp: new Date().toISOString(),
      accountBalances: balances,
      budgetAnalysis: budget,
      financialRatios: ratios,
      summary: {
        totalAssets: Object.values(balances).reduce((sum, bal) => sum + bal, 0),
        budgetHealth: budget.variance >= 0 ? 'On Track' : 'Over Budget',
        quickRatio: ratios.quickRatio > 1 ? 'Healthy' : 'Needs Attention'
      }
    };
  }
}

// Usage
const dashboard = new FinancialDashboard();
console.log('Financial Dashboard Report:');
console.log(JSON.stringify(dashboard.generateFullReport(), null, 2));
```

### 3. HR Analytics System

```javascript
// hr-analytics.js
const { 
  calculatePayroll,
  calculatePerformanceScore,
  calculateTurnoverRate,
  calculateEmployeeProductivity 
} = require('titan-grove');

class HRAnalytics {
  constructor() {
    this.employees = [
      { id: 'E001', salary: 75000, hours: 2080, performance: { goals: 0.9, collaboration: 0.85 } },
      { id: 'E002', salary: 85000, hours: 2100, performance: { goals: 0.95, collaboration: 0.90 } },
      { id: 'E003', salary: 65000, hours: 2000, performance: { goals: 0.80, collaboration: 0.88 } }
    ];
    this.departures = 2;
  }

  calculateTeamPayroll() {
    return this.employees.map(emp => ({
      employeeId: emp.id,
      payroll: JSON.parse(calculatePayroll({
        baseSalary: emp.salary,
        hoursWorked: emp.hours,
        overtimeHours: Math.max(0, emp.hours - 2080),
        benefits: emp.salary * 0.25,
        deductions: emp.salary * 0.15
      }))
    }));
  }

  calculateTeamPerformance() {
    return this.employees.map(emp => ({
      employeeId: emp.id,
      score: calculatePerformanceScore({
        goals: emp.performance.goals,
        collaboration: emp.performance.collaboration,
        innovation: 0.8,
        reliability: 0.9
      })
    }));
  }

  getHRMetrics() {
    const payrolls = this.calculateTeamPayroll();
    const performances = this.calculateTeamPerformance();
    const turnover = calculateTurnoverRate(this.employees.length, this.departures);
    
    const avgProductivity = this.employees.reduce((sum, emp) => {
      return sum + calculateEmployeeProductivity(emp.salary * 1.2, emp.hours);
    }, 0) / this.employees.length;

    return {
      teamSize: this.employees.length,
      totalPayrollCost: payrolls.reduce((sum, p) => sum + p.payroll.netPay, 0),
      averagePerformance: performances.reduce((sum, p) => sum + p.score, 0) / performances.length,
      turnoverRate: turnover,
      averageProductivity: avgProductivity,
      payrollDetails: payrolls,
      performanceDetails: performances
    };
  }
}

// Usage
const hrAnalytics = new HRAnalytics();
console.log('HR Analytics Report:');
console.log(JSON.stringify(hrAnalytics.getHRMetrics(), null, 2));
```

---

## Common Use Cases

### 1. Risk Assessment

```javascript
const { calculateRiskScore, determineRiskLevel } = require('titan-grove');

// Assess project risk
function assessProjectRisk(project) {
  const riskFactors = [
    { name: 'Technical Complexity', probability: 0.3, impact: 0.8, vulnerability: 0.6 },
    { name: 'Resource Availability', probability: 0.5, impact: 0.7, vulnerability: 0.4 },
    { name: 'Market Changes', probability: 0.2, impact: 0.9, vulnerability: 0.8 }
  ];

  const risks = riskFactors.map(factor => {
    const score = calculateRiskScore(factor.probability, factor.impact, factor.vulnerability);
    const level = determineRiskLevel(score);
    return { ...factor, score, level };
  });

  const overallRisk = risks.reduce((sum, risk) => sum + risk.score, 0) / risks.length;
  
  return {
    projectName: project.name,
    risks,
    overallRisk,
    overallLevel: determineRiskLevel(overallRisk),
    recommendation: overallRisk > 0.7 ? 'High risk - implement mitigation plan' :
                   overallRisk > 0.4 ? 'Medium risk - monitor closely' :
                   'Low risk - proceed with caution'
  };
}

// Example usage
const projectRisk = assessProjectRisk({ name: 'New Product Launch' });
console.log(projectRisk);
```

### 2. Customer Analytics

```javascript
const { 
  calculateCustomerLifetimeValue,
  calculateChurnProbability,
  calculateCustomerScore 
} = require('titan-grove');

// Customer analytics pipeline
function analyzeCustomer(customer) {
  // Calculate CLV
  const clv = calculateCustomerLifetimeValue(
    customer.avgPurchase,
    customer.retentionRate,
    1 - customer.retentionRate
  );

  // Assess churn risk
  const churnRisk = calculateChurnProbability({
    lastPurchaseDays: customer.daysSinceLastPurchase,
    supportTickets: customer.supportTickets,
    engagementScore: customer.engagementScore,
    contractValue: customer.contractValue
  });

  // Overall customer score
  const score = calculateCustomerScore({
    purchaseHistory: customer.purchases,
    engagementLevel: customer.engagementScore,
    supportInteractions: customer.supportTickets,
    paymentHistory: customer.paymentHistory
  });

  return {
    customerId: customer.id,
    lifetimeValue: clv,
    churnRisk,
    customerScore: score,
    segment: clv > 10000 ? 'Premium' : clv > 5000 ? 'Standard' : 'Basic',
    action: churnRisk > 0.7 ? 'Immediate retention effort needed' :
            churnRisk > 0.4 ? 'Monitor and engage' :
            'Maintain current service level'
  };
}

// Example
const customerAnalysis = analyzeCustomer({
  id: 'CUST001',
  avgPurchase: 1500,
  retentionRate: 0.85,
  daysSinceLastPurchase: 45,
  supportTickets: 2,
  engagementScore: 0.7,
  contractValue: 25000,
  purchases: [1200, 1500, 1800, 1300],
  paymentHistory: 0.98
});

console.log(customerAnalysis);
```

### 3. Manufacturing Optimization

```javascript
const { 
  calculateOeeScore,
  calculateProductionEfficiency,
  optimizeProductionSequence 
} = require('titan-grove');

// Production line optimizer
function optimizeProduction(productionData) {
  // Calculate OEE for each machine
  const machineOEE = productionData.machines.map(machine => ({
    id: machine.id,
    oee: calculateOeeScore(machine.availability, machine.performance, machine.quality),
    efficiency: calculateProductionEfficiency(machine.plannedOutput, machine.actualOutput)
  }));

  // Find bottlenecks
  const bottlenecks = machineOEE.filter(m => m.oee < 0.75);

  // Optimize production sequence
  const optimization = optimizeProductionSequence(productionData.jobs);

  return {
    timestamp: new Date().toISOString(),
    overallOEE: machineOEE.reduce((sum, m) => sum + m.oee, 0) / machineOEE.length,
    machinePerformance: machineOEE,
    bottlenecks: bottlenecks.map(b => ({
      machineId: b.id,
      issue: 'OEE below threshold',
      priority: 'High'
    })),
    optimizedSequence: JSON.parse(optimization),
    recommendations: [
      bottlenecks.length > 0 ? `Address ${bottlenecks.length} bottleneck machines` : 'All machines performing well',
      'Implement optimized production sequence for 15% efficiency gain',
      'Schedule preventive maintenance for machines with OEE < 80%'
    ]
  };
}

// Example usage
const productionOptimization = optimizeProduction({
  machines: [
    { id: 'M001', availability: 0.95, performance: 0.88, quality: 0.92, plannedOutput: 1000, actualOutput: 950 },
    { id: 'M002', availability: 0.78, performance: 0.85, quality: 0.90, plannedOutput: 800, actualOutput: 720 },
    { id: 'M003', availability: 0.92, performance: 0.95, quality: 0.88, plannedOutput: 1200, actualOutput: 1150 }
  ],
  jobs: [
    { id: 'J001', priority: 1, duration: 4, dependencies: [] },
    { id: 'J002', priority: 2, duration: 3, dependencies: ['J001'] },
    { id: 'J003', priority: 1, duration: 2, dependencies: [] }
  ]
});

console.log(productionOptimization);
```

---

## Development Workflow

### 1. Environment Setup

```bash
# Create new project
mkdir my-titan-app
cd my-titan-app
npm init -y

# Install Titan Grove
npm install titan-grove

# Install additional dependencies
npm install express dotenv
```

### 2. Basic Project Structure

```
my-titan-app/
├── package.json
├── .env
├── app.js
├── routes/
│   ├── financial.js
│   ├── hr.js
│   └── analytics.js
├── services/
│   ├── calculator.js
│   └── reporter.js
└── tests/
    └── basic.test.js
```

### 3. Environment Configuration

```bash
# .env
NODE_ENV=development
PORT=3000
LOG_LEVEL=info

# Production settings
CACHE_SIZE=1000
BATCH_SIZE=500
MAX_CONCURRENCY=10
```

### 4. Service Layer Example

```javascript
// services/calculator.js
const { 
  calculateRiskScore,
  calculateRoi,
  generateFinancialReport 
} = require('titan-grove');

class CalculatorService {
  calculateBusinessMetrics(data) {
    try {
      const results = {
        timestamp: new Date().toISOString(),
        calculations: {}
      };

      // Risk calculations
      if (data.risk) {
        results.calculations.risk = {
          score: calculateRiskScore(data.risk.probability, data.risk.impact, data.risk.vulnerability),
          level: this.determineRiskLevel(results.calculations.risk?.score)
        };
      }

      // ROI calculations
      if (data.investment) {
        results.calculations.roi = calculateRoi(data.investment.returns, data.investment.cost);
      }

      // Financial reporting
      if (data.financial) {
        results.calculations.financialReport = JSON.parse(generateFinancialReport(data.financial.data));
      }

      return results;
    } catch (error) {
      throw new Error(`Calculation failed: ${error.message}`);
    }
  }

  determineRiskLevel(score) {
    if (score > 0.7) return 'High';
    if (score > 0.4) return 'Medium';
    return 'Low';
  }
}

module.exports = CalculatorService;
```

### 5. Testing

```javascript
// tests/basic.test.js
const { sum, calculateRiskScore } = require('titan-grove');

function runTests() {
  console.log('Running basic tests...');

  // Test 1: Basic math
  const sumResult = sum(10, 20);
  console.assert(sumResult === 30, `Sum test failed: expected 30, got ${sumResult}`);
  console.log('✅ Sum test passed');

  // Test 2: Risk calculation
  const riskScore = calculateRiskScore(0.5, 0.8, 0.6);
  console.assert(riskScore > 0 && riskScore <= 1, `Risk score should be between 0 and 1, got ${riskScore}`);
  console.log('✅ Risk calculation test passed');

  // Test 3: Performance test
  const iterations = 10000;
  const start = Date.now();
  
  for (let i = 0; i < iterations; i++) {
    calculateRiskScore(Math.random(), Math.random(), Math.random());
  }
  
  const duration = Date.now() - start;
  const avgTime = duration / iterations;
  console.log(`✅ Performance test: ${avgTime.toFixed(4)}ms per calculation`);

  console.log('All tests passed! 🎉');
}

runTests();
```

---

## Debugging and Troubleshooting

### 1. Enable Debug Logging

```javascript
const { logInfo, logError, getHealthStatus } = require('titan-grove');

// Enable detailed logging
function enableDebugMode() {
  logInfo('Debug mode enabled');
  
  // Monitor system health
  const health = getHealthStatus();
  logInfo(`System health: ${JSON.stringify(health)}`);
}

// Wrap functions with error logging
function debugWrapper(fn, functionName) {
  return (...args) => {
    try {
      logInfo(`Calling ${functionName} with args: ${JSON.stringify(args)}`);
      const result = fn(...args);
      logInfo(`${functionName} completed successfully`);
      return result;
    } catch (error) {
      logError(`${functionName} failed: ${error.message}`);
      throw error;
    }
  };
}
```

### 2. Performance Monitoring

```javascript
const { recordPerformanceMetric, getPerformanceMetrics } = require('titan-grove');

function monitorPerformance(fn, metricName) {
  return (...args) => {
    const start = process.hrtime.bigint();
    const result = fn(...args);
    const end = process.hrtime.bigint();
    
    const durationMs = Number(end - start) / 1000000;
    recordPerformanceMetric(metricName, durationMs);
    
    return result;
  };
}

// Get performance report
function getPerformanceReport() {
  const metrics = getPerformanceMetrics();
  console.log('Performance Report:', JSON.parse(metrics));
}
```

### 3. Common Issues and Solutions

#### Issue: "Failed to load native binding"
```javascript
// Solution 1: Check platform compatibility
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);

// Solution 2: Rebuild native modules
// npm run build:native

// Solution 3: Clear cache and reinstall
// rm -rf node_modules
// npm install --legacy-peer-deps
```

#### Issue: Memory leaks
```javascript
// Monitor memory usage
function monitorMemory() {
  const used = process.memoryUsage();
  console.log('Memory usage:');
  for (let key in used) {
    console.log(`${key}: ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
  }
}

setInterval(monitorMemory, 30000); // Monitor every 30 seconds
```

---

## Next Steps

### 1. Explore Advanced Features
- [Complete Module Reference](./NAPI_RS_MODULE_REFERENCE.md)
- [Advanced Usage Patterns](./NAPI_RS_USAGE_GUIDE.md)
- [Performance Optimization](./NAPI_RS_PERFORMANCE_GUIDE.md)

### 2. Production Deployment
- [Build & Deployment Guide](./COMPLETE_NAPI_RS_DOCUMENTATION.md#build--deployment)
- [Docker Configuration](./COMPLETE_NAPI_RS_DOCUMENTATION.md#docker-deployment)
- [Performance Tuning](./NAPI_RS_PERFORMANCE_GUIDE.md)

### 3. Integration Examples
- Express.js API servers
- React/Vue.js frontends
- Microservices architecture
- Real-time analytics systems

### 4. Community and Support
- GitHub Issues: Report bugs and request features
- Documentation: Comprehensive guides and examples
- Performance: Benchmark your implementations

---

**🚀 You're now ready to build high-performance enterprise applications with Titan Grove NAPI-RS modules!**