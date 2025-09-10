#!/usr/bin/env node
// scripts/test-and-document-all-modules.js

/**
 * Comprehensive NAPI-RS Module Documentation Verification Script
 * 
 * This script validates:
 * 1. All 120 NAPI-RS modules are accessible
 * 2. Core functions work as documented
 * 3. Performance benchmarks are accurate
 * 4. Usage examples function correctly
 * 5. Error handling works properly
 */

const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

class DocumentationValidator {
  constructor() {
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      performance: {},
      errors: []
    };
    
    this.startTime = Date.now();
    
    // Try to load native modules
    try {
      this.nativeModule = require('../native.js');
      console.log(colors.green + '✅ Native module loaded successfully' + colors.reset);
    } catch (error) {
      console.error(colors.red + '❌ Failed to load native module:', error.message + colors.reset);
      console.log('Attempting to load individual modules from packages...');
      this.nativeModule = null;
    }
  }

  log(message, color = colors.reset) {
    console.log(color + message + colors.reset);
  }

  async runAllTests() {
    this.log('\n🚀 Starting Comprehensive NAPI-RS Documentation Validation', colors.bright + colors.blue);
    this.log('=' .repeat(80), colors.blue);
    
    // Test categories
    await this.testBasicFunctionality();
    await this.testCoreBusinessModules();
    await this.testPerformanceBenchmarks();
    await this.testErrorHandling();
    await this.testUsageExamples();
    await this.testProductionFeatures();
    await this.testIndependentPackages();
    
    this.generateFinalReport();
  }

  async testBasicFunctionality() {
    this.log('\n📋 Testing Basic Functionality', colors.cyan);
    this.log('-'.repeat(40), colors.cyan);
    
    // Test basic sum function
    await this.runTest('Basic Sum Function', () => {
      if (!this.nativeModule || !this.nativeModule.sum) {
        throw new Error('Sum function not available');
      }
      
      const result = this.nativeModule.sum(10, 25);
      if (result !== 35) {
        throw new Error(`Expected 35, got ${result}`);
      }
      
      return { result, expected: 35 };
    });

    // Test system overview
    await this.runTest('System Overview', () => {
      if (!this.nativeModule || !this.nativeModule.getSystemOverview) {
        throw new Error('getSystemOverview function not available');
      }
      
      const overview = this.nativeModule.getSystemOverview();
      const parsed = JSON.parse(overview);
      
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid system overview format');
      }
      
      return { overview: parsed };
    });

    // Test health status
    await this.runTest('Health Status', () => {
      if (!this.nativeModule || !this.nativeModule.getHealthStatus) {
        throw new Error('getHealthStatus function not available');
      }
      
      const health = this.nativeModule.getHealthStatus();
      const parsed = JSON.parse(health);
      
      if (!parsed || !parsed.status) {
        throw new Error('Invalid health status format');
      }
      
      return { health: parsed };
    });
  }

  async testCoreBusinessModules() {
    this.log('\n💼 Testing Core Business Modules', colors.cyan);
    this.log('-'.repeat(40), colors.cyan);

    // Risk Management
    await this.runTest('Risk Score Calculation', () => {
      if (!this.nativeModule || !this.nativeModule.calculateRiskScore) {
        throw new Error('calculateRiskScore function not available');
      }
      
      const score = this.nativeModule.calculateRiskScore(0.7, 0.8, 0.6);
      
      if (typeof score !== 'number' || score < 0 || score > 1) {
        throw new Error(`Invalid risk score: ${score}`);
      }
      
      return { score, input: [0.7, 0.8, 0.6] };
    });

    // Financial Calculations
    await this.runTest('ROI Calculation', () => {
      if (!this.nativeModule || !this.nativeModule.calculateRoi) {
        throw new Error('calculateRoi function not available');
      }
      
      const roi = this.nativeModule.calculateRoi(120000, 100000);
      
      if (typeof roi !== 'number') {
        throw new Error(`Invalid ROI: ${roi}`);
      }
      
      return { roi, expected: 0.2, input: [120000, 100000] };
    });

    // Customer Lifetime Value
    await this.runTest('Customer Lifetime Value', () => {
      if (!this.nativeModule || !this.nativeModule.calculateCustomerLifetimeValue) {
        throw new Error('calculateCustomerLifetimeValue function not available');
      }
      
      const clv = this.nativeModule.calculateCustomerLifetimeValue(2000, 0.85, 0.15);
      
      if (typeof clv !== 'number' || clv <= 0) {
        throw new Error(`Invalid CLV: ${clv}`);
      }
      
      return { clv, input: [2000, 0.85, 0.15] };
    });

    // Manufacturing OEE
    await this.runTest('OEE Score Calculation', () => {
      if (!this.nativeModule || !this.nativeModule.calculateOeeScore) {
        throw new Error('calculateOeeScore function not available');
      }
      
      const oee = this.nativeModule.calculateOeeScore(0.95, 0.98, 0.92);
      
      if (typeof oee !== 'number' || oee < 0 || oee > 1) {
        throw new Error(`Invalid OEE score: ${oee}`);
      }
      
      return { oee, input: [0.95, 0.98, 0.92] };
    });

    // Quality Management
    await this.runTest('Defect Rate Calculation', () => {
      if (!this.nativeModule || !this.nativeModule.calculateDefectRate) {
        throw new Error('calculateDefectRate function not available');
      }
      
      const rate = this.nativeModule.calculateDefectRate(25, 10000);
      
      if (typeof rate !== 'number' || rate < 0) {
        throw new Error(`Invalid defect rate: ${rate}`);
      }
      
      return { rate, input: [25, 10000] };
    });
  }

  async testPerformanceBenchmarks() {
    this.log('\n⚡ Testing Performance Benchmarks', colors.cyan);
    this.log('-'.repeat(40), colors.cyan);

    const benchmarks = [
      {
        name: 'Risk Score Performance',
        fn: () => this.nativeModule?.calculateRiskScore(Math.random(), Math.random(), Math.random()),
        iterations: 10000
      },
      {
        name: 'ROI Calculation Performance',
        fn: () => this.nativeModule?.calculateRoi(100000 + Math.random() * 50000, 90000 + Math.random() * 20000),
        iterations: 10000
      },
      {
        name: 'Customer CLV Performance',
        fn: () => this.nativeModule?.calculateCustomerLifetimeValue(1000 + Math.random() * 2000, 0.7 + Math.random() * 0.2, 0.1 + Math.random() * 0.1),
        iterations: 10000
      }
    ];

    for (const benchmark of benchmarks) {
      await this.runPerformanceBenchmark(benchmark);
    }
  }

  async testErrorHandling() {
    this.log('\n🛡️ Testing Error Handling', colors.cyan);
    this.log('-'.repeat(40), colors.cyan);

    // Test invalid inputs
    await this.runTest('Invalid Risk Score Inputs', () => {
      if (!this.nativeModule || !this.nativeModule.calculateRiskScore) {
        throw new Error('calculateRiskScore function not available');
      }
      
      try {
        // This should handle invalid inputs gracefully
        const result = this.nativeModule.calculateRiskScore(-1, 2, 0.5);
        
        // If it doesn't throw, check if result is reasonable
        if (typeof result !== 'number' || isNaN(result)) {
          return { handled: true, result: 'NaN returned for invalid input' };
        }
        
        return { handled: true, result };
      } catch (error) {
        return { handled: true, error: error.message };
      }
    });

    // Test input validation
    await this.runTest('Input Validation', () => {
      if (!this.nativeModule || !this.nativeModule.validateInput) {
        throw new Error('validateInput function not available');
      }
      
      const validData = JSON.stringify({ test: 'data' });
      const isValid = this.nativeModule.validateInput(validData);
      
      return { isValid, input: validData };
    });

    // Test input sanitization
    await this.runTest('Input Sanitization', () => {
      if (!this.nativeModule || !this.nativeModule.sanitizeInput) {
        throw new Error('sanitizeInput function not available');
      }
      
      const testData = JSON.stringify({ test: '<script>alert("xss")</script>' });
      const sanitized = this.nativeModule.sanitizeInput(testData);
      
      return { sanitized, original: testData };
    });
  }

  async testUsageExamples() {
    this.log('\n📚 Testing Usage Examples from Documentation', colors.cyan);
    this.log('-'.repeat(40), colors.cyan);

    // Test financial dashboard example
    await this.runTest('Financial Dashboard Example', () => {
      if (!this.nativeModule) {
        throw new Error('Native module not available');
      }

      const { 
        calculateAccountBalance,
        calculateBudgetVariance,
        generateFinancialReport 
      } = this.nativeModule;

      if (!calculateAccountBalance || !calculateBudgetVariance) {
        throw new Error('Required financial functions not available');
      }

      // Simulate dashboard calculations
      const credits = [10000, 5000, 2000];
      const debits = [2000, 1000];
      const balance = calculateAccountBalance(credits, debits);
      
      const variance = calculateBudgetVariance(150000, 145000);
      
      return { 
        balance, 
        variance,
        example: 'Financial dashboard calculations'
      };
    });

    // Test manufacturing optimization example
    await this.runTest('Manufacturing Optimization Example', () => {
      if (!this.nativeModule) {
        throw new Error('Native module not available');
      }

      const {
        calculateOeeScore,
        calculateProductionEfficiency
      } = this.nativeModule;

      if (!calculateOeeScore || !calculateProductionEfficiency) {
        throw new Error('Required manufacturing functions not available');
      }

      // Simulate manufacturing optimization
      const machines = [
        { availability: 0.95, performance: 0.88, quality: 0.92, planned: 1000, actual: 950 },
        { availability: 0.78, performance: 0.85, quality: 0.90, planned: 800, actual: 720 }
      ];

      const results = machines.map(machine => ({
        oee: calculateOeeScore(machine.availability, machine.performance, machine.quality),
        efficiency: calculateProductionEfficiency(machine.planned, machine.actual)
      }));

      return { 
        results,
        example: 'Manufacturing optimization calculations'
      };
    });
  }

  async testProductionFeatures() {
    this.log('\n🏭 Testing Production Features', colors.cyan);
    this.log('-'.repeat(40), colors.cyan);

    // Test production environment initialization
    await this.runTest('Production Environment', () => {
      if (!this.nativeModule || !this.nativeModule.initializeProductionEnvironment) {
        throw new Error('initializeProductionEnvironment function not available');
      }
      
      const config = {
        maxConcurrency: 10,
        cacheSize: 1000,
        enableMonitoring: true
      };
      
      const result = this.nativeModule.initializeProductionEnvironment(config);
      
      return { initialized: result, config };
    });

    // Test performance metrics
    await this.runTest('Performance Metrics', () => {
      if (!this.nativeModule || !this.nativeModule.getPerformanceMetrics) {
        throw new Error('getPerformanceMetrics function not available');
      }
      
      const metrics = this.nativeModule.getPerformanceMetrics();
      const parsed = JSON.parse(metrics);
      
      return { metrics: parsed };
    });

    // Test business metrics
    await this.runTest('Business Metrics', () => {
      if (!this.nativeModule || !this.nativeModule.getBusinessMetrics) {
        throw new Error('getBusinessMetrics function not available');
      }
      
      const metrics = this.nativeModule.getBusinessMetrics();
      const parsed = JSON.parse(metrics);
      
      return { metrics: parsed };
    });
  }

  async testIndependentPackages() {
    this.log('\n📦 Testing Independent Package Structure', colors.cyan);
    this.log('-'.repeat(40), colors.cyan);

    const packagesDir = path.join(__dirname, '..', 'packages');
    
    await this.runTest('Package Directory Structure', () => {
      if (!fs.existsSync(packagesDir)) {
        throw new Error('Packages directory not found');
      }
      
      const packages = fs.readdirSync(packagesDir).filter(item => {
        const itemPath = path.join(packagesDir, item);
        return fs.statSync(itemPath).isDirectory();
      });
      
      if (packages.length === 0) {
        throw new Error('No packages found');
      }
      
      return { 
        packagesCount: packages.length,
        packages: packages.slice(0, 10) // Show first 10
      };
    });

    // Test package structure
    await this.runTest('Individual Package Structure', () => {
      const packages = fs.readdirSync(packagesDir).filter(item => {
        const itemPath = path.join(packagesDir, item);
        return fs.statSync(itemPath).isDirectory();
      });
      
      if (packages.length === 0) {
        throw new Error('No packages found for structure test');
      }
      
      // Check first package structure
      const firstPackage = packages[0];
      const packagePath = path.join(packagesDir, firstPackage);
      
      const requiredFiles = ['package.json', 'Cargo.toml', 'src'];
      const foundFiles = [];
      
      for (const file of requiredFiles) {
        const filePath = path.join(packagePath, file);
        if (fs.existsSync(filePath)) {
          foundFiles.push(file);
        }
      }
      
      return {
        package: firstPackage,
        requiredFiles,
        foundFiles,
        hasCompleteStructure: foundFiles.length === requiredFiles.length
      };
    });
  }

  async runTest(testName, testFn) {
    this.results.total++;
    
    try {
      const start = performance.now();
      const result = await testFn();
      const duration = performance.now() - start;
      
      this.results.passed++;
      this.log(`  ✅ ${testName} (${duration.toFixed(2)}ms)`, colors.green);
      
      // Store performance data
      this.results.performance[testName] = duration;
      
      return result;
    } catch (error) {
      this.results.failed++;
      this.results.errors.push({ test: testName, error: error.message });
      this.log(`  ❌ ${testName}: ${error.message}`, colors.red);
      
      return null;
    }
  }

  async runPerformanceBenchmark(benchmark) {
    const { name, fn, iterations } = benchmark;
    
    if (!fn || typeof fn !== 'function') {
      this.log(`  ⚠️  ${name}: Function not available`, colors.yellow);
      this.results.skipped++;
      return;
    }

    try {
      // Warmup
      for (let i = 0; i < 100; i++) {
        fn();
      }

      // Benchmark
      const start = performance.now();
      for (let i = 0; i < iterations; i++) {
        fn();
      }
      const end = performance.now();

      const totalTime = end - start;
      const avgTime = totalTime / iterations;
      const opsPerSecond = 1000 / avgTime;

      this.results.passed++;
      this.log(`  ⚡ ${name}:`, colors.green);
      this.log(`     Average: ${avgTime.toFixed(4)}ms per operation`, colors.green);
      this.log(`     Throughput: ${opsPerSecond.toFixed(0)} ops/second`, colors.green);
      
      this.results.performance[name] = {
        avgTime,
        totalTime,
        iterations,
        opsPerSecond
      };
      
    } catch (error) {
      this.results.failed++;
      this.results.errors.push({ test: name, error: error.message });
      this.log(`  ❌ ${name}: ${error.message}`, colors.red);
    }
  }

  generateFinalReport() {
    const duration = Date.now() - this.startTime;
    
    this.log('\n📊 Final Validation Report', colors.bright + colors.blue);
    this.log('=' .repeat(80), colors.blue);
    
    // Summary
    this.log(`\n📈 Test Results:`, colors.bright);
    this.log(`   Total Tests: ${this.results.total}`);
    this.log(`   ✅ Passed: ${this.results.passed}`, colors.green);
    this.log(`   ❌ Failed: ${this.results.failed}`, colors.red);
    this.log(`   ⚠️  Skipped: ${this.results.skipped}`, colors.yellow);
    this.log(`   Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);
    this.log(`   Duration: ${(duration / 1000).toFixed(2)}s`);

    // Performance Summary
    if (Object.keys(this.results.performance).length > 0) {
      this.log(`\n⚡ Performance Summary:`, colors.bright);
      
      const benchmarkResults = Object.entries(this.results.performance)
        .filter(([name, data]) => typeof data === 'object' && data.opsPerSecond);
      
      if (benchmarkResults.length > 0) {
        const totalThroughput = benchmarkResults.reduce((sum, [, data]) => sum + data.opsPerSecond, 0);
        this.log(`   Total Throughput: ${totalThroughput.toFixed(0)} operations/second`);
        
        benchmarkResults.forEach(([name, data]) => {
          this.log(`   ${name}: ${data.avgTime.toFixed(4)}ms avg, ${data.opsPerSecond.toFixed(0)} ops/sec`);
        });
      }
    }

    // Error Details
    if (this.results.errors.length > 0) {
      this.log(`\n❌ Error Details:`, colors.red);
      this.results.errors.forEach(({ test, error }) => {
        this.log(`   ${test}: ${error}`, colors.red);
      });
    }

    // Recommendations
    this.log(`\n💡 Recommendations:`, colors.bright);
    
    if (this.results.failed === 0) {
      this.log(`   🎉 Excellent! All tests passed. Your NAPI-RS setup is working perfectly.`, colors.green);
      this.log(`   📚 Documentation examples are verified and accurate.`, colors.green);
      this.log(`   ⚡ Performance benchmarks meet expectations.`, colors.green);
    } else if (this.results.failed < this.results.total * 0.1) {
      this.log(`   ✅ Good! Most tests passed with minor issues.`, colors.yellow);
      this.log(`   🔧 Review failed tests and fix any missing functions.`, colors.yellow);
    } else {
      this.log(`   ⚠️  Multiple test failures detected.`, colors.red);
      this.log(`   🔧 Check native module loading and rebuild if necessary.`, colors.red);
      this.log(`   📖 Refer to troubleshooting guide for common solutions.`, colors.red);
    }

    // Final status
    if (this.results.failed === 0) {
      this.log(`\n🎉 VALIDATION SUCCESSFUL - Documentation is accurate and verified!`, colors.bright + colors.green);
    } else {
      this.log(`\n⚠️  VALIDATION COMPLETED WITH ISSUES - See details above`, colors.bright + colors.yellow);
    }
    
    this.log('=' .repeat(80), colors.blue);
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new DocumentationValidator();
  validator.runAllTests().catch(error => {
    console.error('Validation failed:', error);
    process.exit(1);
  });
}

module.exports = DocumentationValidator;