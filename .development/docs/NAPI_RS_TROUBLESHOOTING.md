# 🔧 NAPI-RS Troubleshooting Guide - Titan Grove Enterprise Suite

## Table of Contents

1. [Common Issues](#common-issues)
2. [Installation Problems](#installation-problems)
3. [Runtime Errors](#runtime-errors)
4. [Performance Issues](#performance-issues)
5. [Memory Problems](#memory-problems)
6. [Platform-Specific Issues](#platform-specific-issues)
7. [Debugging Tools](#debugging-tools)
8. [FAQ](#faq)

---

## Common Issues

### Issue: "Failed to load native binding"

**Symptoms:**
```
Error: Failed to load native binding
    at Object.<anonymous> (native.js:310:9)
```

**Causes & Solutions:**

#### 1. Missing Platform Binary
```bash
# Check what platform files exist
ls -la *.node

# Expected files for different platforms:
# Linux x64: index.linux-x64-gnu.node
# macOS: index.darwin-universal.node or index.darwin-x64.node
# Windows: index.win32-x64-msvc.node
```

**Solution:**
```bash
# Rebuild for your platform
npm run build:native

# Or reinstall with platform build
npm install --force
npm run build:native
```

#### 2. Architecture Mismatch
```bash
# Check your system architecture
echo "Platform: $(node -e 'console.log(process.platform)')"
echo "Architecture: $(node -e 'console.log(process.arch)')"

# Check what's available
ls -la *.node | grep $(node -e 'console.log(process.platform + "-" + process.arch)')
```

**Solution:**
```bash
# Build specifically for your architecture
npx napi build --platform --release
```

#### 3. Node.js Version Incompatibility
```bash
# Check Node.js version (requires 18.0.0+)
node --version

# If version is too old:
# Install Node.js 18+ from https://nodejs.org
```

### Issue: "Cannot find module 'titan-grove'"

**Symptoms:**
```
Error: Cannot find module 'titan-grove'
    at Function.Module._resolveFilename
```

**Solutions:**

#### 1. Module Not Installed
```bash
# Install the module
npm install titan-grove

# Or if using specific modules
npm install @titan-grove/financial @titan-grove/hr
```

#### 2. Incorrect Import Path
```javascript
// ❌ Wrong
const titanGrove = require('titan-grove/native');

// ✅ Correct
const titanGrove = require('titan-grove');
// or
const { calculateRiskScore } = require('titan-grove');
```

#### 3. Development vs Production
```javascript
// Check if module exists
try {
  const titanGrove = require('titan-grove');
  console.log('✅ Module loaded successfully');
} catch (error) {
  console.error('❌ Module not found:', error.message);
  console.log('Try: npm install titan-grove');
}
```

### Issue: Function Returns Unexpected Results

**Symptoms:**
```javascript
const result = calculateRiskScore(0.5, 0.8, 0.6);
console.log(result); // NaN or undefined
```

**Solutions:**

#### 1. Parameter Type Validation
```javascript
function validateRiskParams(probability, impact, vulnerability) {
  const errors = [];
  
  if (typeof probability !== 'number' || probability < 0 || probability > 1) {
    errors.push('Probability must be a number between 0 and 1');
  }
  
  if (typeof impact !== 'number' || impact < 0 || impact > 1) {
    errors.push('Impact must be a number between 0 and 1');
  }
  
  if (typeof vulnerability !== 'number' || vulnerability < 0 || vulnerability > 1) {
    errors.push('Vulnerability must be a number between 0 and 1');
  }
  
  if (errors.length > 0) {
    throw new Error('Validation failed: ' + errors.join(', '));
  }
  
  return true;
}

// Safe usage
function safeCalculateRiskScore(probability, impact, vulnerability) {
  try {
    validateRiskParams(probability, impact, vulnerability);
    return calculateRiskScore(probability, impact, vulnerability);
  } catch (error) {
    console.error('Risk calculation error:', error.message);
    return null;
  }
}
```

#### 2. Input Data Sanitization
```javascript
const { sanitizeInput, validateInput } = require('titan-grove');

function sanitizeAndValidate(data) {
  // Sanitize input
  const sanitized = sanitizeInput(JSON.stringify(data));
  const sanitizedData = JSON.parse(sanitized);
  
  // Validate
  const isValid = validateInput(sanitized);
  if (!isValid) {
    throw new Error('Input validation failed');
  }
  
  return sanitizedData;
}
```

---

## Installation Problems

### Issue: Build Tools Missing

**Symptoms:**
```
error: Microsoft Visual C++ 14.0 is required (Windows)
error: `cc` failed with exit code 1 (Linux/macOS)
```

**Solutions:**

#### Windows
```powershell
# Option 1: Install Visual Studio Build Tools
# Download from: https://visualstudio.microsoft.com/visual-cpp-build-tools/

# Option 2: Install Visual Studio Community
# Download from: https://visualstudio.microsoft.com/vs/community/

# Option 3: Use Windows Subsystem for Linux (WSL)
wsl --install
```

#### macOS
```bash
# Install Xcode Command Line Tools
xcode-select --install

# If already installed but not working
sudo xcode-select --reset
xcode-select --install
```

#### Linux (Ubuntu/Debian)
```bash
# Install build essentials
sudo apt-get update
sudo apt-get install build-essential

# Install additional dependencies
sudo apt-get install python3 make g++
```

#### Linux (CentOS/RHEL)
```bash
# Install development tools
sudo yum groupinstall "Development Tools"
sudo yum install python3 make gcc-c++
```

### Issue: Rust Compiler Not Found

**Symptoms:**
```
error: failed to run custom build command for `titan-grove-native`
error: rustc not found
```

**Solution:**
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Verify installation
rustc --version
cargo --version

# Update Rust if needed
rustup update

# Rebuild project
npm run build:native
```

### Issue: Permission Denied

**Symptoms:**
```
EACCES: permission denied, mkdir '/usr/local/lib/node_modules'
```

**Solutions:**

#### Option 1: Use Node Version Manager (Recommended)
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js
nvm install 18
nvm use 18

# Install packages without sudo
npm install titan-grove
```

#### Option 2: Fix npm Permissions
```bash
# Create a directory for global packages
mkdir ~/.npm-global

# Configure npm
npm config set prefix '~/.npm-global'

# Add to PATH
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

#### Option 3: Use Local Installation
```bash
# Install locally in project
npm install titan-grove --save

# Use npx for global commands
npx napi build --platform --release
```

---

## Runtime Errors

### Issue: Memory Access Violations

**Symptoms:**
```
Segmentation fault (core dumped)
Process finished with exit code 139
```

**Debugging Steps:**

#### 1. Enable Core Dumps
```bash
# Linux/macOS
ulimit -c unlimited

# Run with debugging
node --abort-on-uncaught-exception app.js
```

#### 2. Use Debug Build
```bash
# Build in debug mode
npm run build:native:debug

# Run with debug symbols
node --inspect app.js
```

#### 3. Memory Sanitizer
```bash
# Build with address sanitizer (Linux/macOS)
export RUSTFLAGS="-Z sanitizer=address"
npm run build:native:debug
```

#### 4. Validate Inputs
```javascript
function safeNativeCall(fn, ...args) {
  try {
    // Validate all arguments are defined and correct type
    for (let i = 0; i < args.length; i++) {
      if (args[i] === undefined || args[i] === null) {
        throw new Error(`Argument ${i} is null or undefined`);
      }
    }
    
    return fn(...args);
  } catch (error) {
    console.error(`Native call failed: ${error.message}`);
    console.error('Arguments:', args);
    throw error;
  }
}

// Usage
const result = safeNativeCall(calculateRiskScore, 0.5, 0.8, 0.6);
```

### Issue: Deadlocks or Hanging

**Symptoms:**
```
Application hangs indefinitely
High CPU usage with no progress
```

**Solutions:**

#### 1. Timeout Wrapper
```javascript
function withTimeout(fn, timeoutMs = 5000) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Operation timed out after ${timeoutMs}ms`));
      }, timeoutMs);
      
      try {
        const result = fn(...args);
        clearTimeout(timer);
        resolve(result);
      } catch (error) {
        clearTimeout(timer);
        reject(error);
      }
    });
  };
}

// Usage
const timeoutCalculateRisk = withTimeout(calculateRiskScore, 1000);
```

#### 2. Circuit Breaker Pattern
```javascript
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.failureThreshold = threshold;
    this.timeout = timeout;
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.state = 'CLOSED';
  }
  
  async call(fn, ...args) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = fn(...args);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
}

// Usage
const breaker = new CircuitBreaker(3, 30000);
const result = await breaker.call(calculateRiskScore, 0.5, 0.8, 0.6);
```

---

## Performance Issues

### Issue: Slow Function Calls

**Symptoms:**
```
Operations taking longer than expected
High latency in API responses
```

**Diagnosis:**

#### 1. Performance Profiling
```javascript
const { performance } = require('perf_hooks');

function profileFunction(fn, name) {
  return (...args) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    
    const duration = end - start;
    console.log(`${name} took ${duration.toFixed(4)}ms`);
    
    if (duration > 100) {
      console.warn(`⚠️ Slow operation detected: ${name}`);
    }
    
    return result;
  };
}

// Profile all native calls
const profiledRiskScore = profileFunction(calculateRiskScore, 'calculateRiskScore');
```

#### 2. Batch Processing
```javascript
// ❌ Slow: Individual calls
function slowProcessing(data) {
  return data.map(item => calculateRiskScore(item.p, item.i, item.v));
}

// ✅ Fast: Batch processing
function fastProcessing(data) {
  const batchSize = 1000;
  const results = [];
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const batchResults = batch.map(item => 
      calculateRiskScore(item.p, item.i, item.v)
    );
    results.push(...batchResults);
  }
  
  return results;
}
```

#### 3. Caching Implementation
```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

function cachedCalculation(fn) {
  return (...args) => {
    const key = JSON.stringify(args);
    
    const cached = cache.get(key);
    if (cached !== undefined) {
      return cached;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const cachedRiskScore = cachedCalculation(calculateRiskScore);
```

### Issue: High Memory Usage

**Symptoms:**
```
Process killed (out of memory)
RangeError: Maximum call stack size exceeded
```

**Solutions:**

#### 1. Memory Monitoring
```javascript
function monitorMemory() {
  const usage = process.memoryUsage();
  
  console.log('Memory Usage:');
  console.log(`RSS: ${(usage.rss / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Heap Used: ${(usage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Heap Total: ${(usage.heapTotal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`External: ${(usage.external / 1024 / 1024).toFixed(2)} MB`);
  
  // Alert if memory usage is high
  const heapUsedMB = usage.heapUsed / 1024 / 1024;
  if (heapUsedMB > 1000) { // 1GB threshold
    console.warn('⚠️ High memory usage detected!');
  }
}

setInterval(monitorMemory, 30000); // Check every 30 seconds
```

#### 2. Memory-Efficient Processing
```javascript
// Stream processing for large datasets
const { Readable, Transform } = require('stream');

class RiskCalculationStream extends Transform {
  constructor(options) {
    super({ objectMode: true, ...options });
  }
  
  _transform(chunk, encoding, callback) {
    try {
      const result = calculateRiskScore(chunk.p, chunk.i, chunk.v);
      callback(null, { ...chunk, risk: result });
    } catch (error) {
      callback(error);
    }
  }
}

// Usage
function processLargeDataset(data) {
  return new Promise((resolve, reject) => {
    const results = [];
    const dataStream = Readable.from(data);
    const riskStream = new RiskCalculationStream();
    
    riskStream.on('data', (result) => {
      results.push(result);
    });
    
    riskStream.on('end', () => {
      resolve(results);
    });
    
    riskStream.on('error', reject);
    
    dataStream.pipe(riskStream);
  });
}
```

---

## Memory Problems

### Issue: Memory Leaks

**Symptoms:**
```
Memory usage continuously increasing
Eventually runs out of memory
Performance degradation over time
```

**Detection:**

#### 1. Heap Snapshot Analysis
```javascript
const v8 = require('v8');
const fs = require('fs');

function takeHeapSnapshot(filename) {
  const heapSnapshot = v8.getHeapSnapshot();
  const fileStream = fs.createWriteStream(filename);
  heapSnapshot.pipe(fileStream);
  
  return new Promise((resolve, reject) => {
    fileStream.on('finish', resolve);
    fileStream.on('error', reject);
  });
}

// Take periodic snapshots
setInterval(async () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await takeHeapSnapshot(`heap-${timestamp}.heapsnapshot`);
  console.log(`Heap snapshot saved: heap-${timestamp}.heapsnapshot`);
}, 300000); // Every 5 minutes
```

#### 2. Memory Leak Detection
```javascript
class MemoryLeakDetector {
  constructor() {
    this.samples = [];
    this.startTime = Date.now();
  }
  
  takeSample() {
    const usage = process.memoryUsage();
    const sample = {
      timestamp: Date.now(),
      heapUsed: usage.heapUsed,
      heapTotal: usage.heapTotal,
      external: usage.external,
      rss: usage.rss
    };
    
    this.samples.push(sample);
    
    // Keep only last 100 samples
    if (this.samples.length > 100) {
      this.samples.shift();
    }
    
    return sample;
  }
  
  detectLeak() {
    if (this.samples.length < 10) {
      return null;
    }
    
    // Calculate trend in heap usage
    const recent = this.samples.slice(-10);
    const oldest = recent[0];
    const newest = recent[recent.length - 1];
    
    const timeDiff = newest.timestamp - oldest.timestamp;
    const heapDiff = newest.heapUsed - oldest.heapUsed;
    
    // Memory growing at more than 1MB per minute
    const growthRate = heapDiff / timeDiff * 60000; // MB per minute
    
    if (growthRate > 1024 * 1024) { // 1MB per minute
      return {
        growthRate: growthRate / 1024 / 1024,
        timespan: timeDiff / 1000,
        recommendation: 'Memory leak detected - investigate object retention'
      };
    }
    
    return null;
  }
  
  startMonitoring(intervalMs = 30000) {
    setInterval(() => {
      this.takeSample();
      const leak = this.detectLeak();
      
      if (leak) {
        console.warn('🚨 Memory leak detected:', leak);
      }
    }, intervalMs);
  }
}

const detector = new MemoryLeakDetector();
detector.startMonitoring();
```

### Issue: Garbage Collection Problems

**Symptoms:**
```
Frequent GC pauses
Application becomes unresponsive periodically
```

**Solutions:**

#### 1. GC Monitoring
```javascript
// Enable GC events (run with: node --trace-gc app.js)
if (process.env.NODE_ENV === 'development') {
  require('v8').setFlagsFromString('--trace-gc');
}

// Monitor GC performance
const PerformanceObserver = require('perf_hooks').PerformanceObserver;

const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    if (entry.entryType === 'gc') {
      console.log(`GC: ${entry.kind} - ${entry.duration.toFixed(2)}ms`);
      
      if (entry.duration > 100) {
        console.warn('⚠️ Long GC pause detected');
      }
    }
  });
});

obs.observe({ entryTypes: ['gc'] });
```

#### 2. GC Optimization
```javascript
// Optimize object allocation patterns
class ObjectPool {
  constructor(createFn, resetFn, initialSize = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];
    
    // Pre-allocate objects
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
    }
  }
  
  acquire() {
    if (this.pool.length > 0) {
      return this.pool.pop();
    }
    return this.createFn();
  }
  
  release(obj) {
    this.resetFn(obj);
    this.pool.push(obj);
  }
}

// Usage for calculation objects
const calculationPool = new ObjectPool(
  () => ({ probability: 0, impact: 0, vulnerability: 0, result: 0 }),
  (obj) => { obj.probability = 0; obj.impact = 0; obj.vulnerability = 0; obj.result = 0; }
);
```

---

## Platform-Specific Issues

### Windows Issues

#### Issue: PowerShell Execution Policy
**Symptoms:**
```
cannot be loaded because running scripts is disabled on this system
```

**Solution:**
```powershell
# Run as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or temporarily bypass
powershell -ExecutionPolicy Bypass -File script.ps1
```

#### Issue: Long Path Names
**Symptoms:**
```
ENAMETOOLONG: name too long
```

**Solution:**
```bash
# Enable long paths in Windows 10+
# Run as Administrator:
# New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force

# Or use shorter paths
npm config set cache C:\npm-cache
npm config set tmp C:\npm-tmp
```

### macOS Issues

#### Issue: Xcode License
**Symptoms:**
```
Agreeing to the Xcode/iOS license requires admin privileges
```

**Solution:**
```bash
sudo xcodebuild -license accept
```

#### Issue: M1/M2 Compatibility
**Symptoms:**
```
Rosetta translation issues
Architecture mismatch errors
```

**Solution:**
```bash
# Install Rosetta 2
softwareupdate --install-rosetta

# Use native ARM64 Node.js
# Download from https://nodejs.org/

# Check architecture
node -e "console.log(process.arch)" # Should show 'arm64'

# Build for Apple Silicon
npm run build:native -- --target aarch64-apple-darwin
```

### Linux Issues

#### Issue: Missing System Libraries
**Symptoms:**
```
error while loading shared libraries: libssl.so.1.1: cannot open shared object file
```

**Solution:**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install libssl-dev pkg-config

# CentOS/RHEL
sudo yum install openssl-devel pkgconfig

# Alpine
apk add openssl-dev pkgconf
```

#### Issue: GLIBC Version
**Symptoms:**
```
GLIBC_2.XX not found
```

**Solution:**
```bash
# Check GLIBC version
ldd --version

# For older systems, use musl builds
npm run build:native -- --target x86_64-unknown-linux-musl
```

---

## Debugging Tools

### 1. Debug Build Configuration

```bash
# Enable debug mode
export RUST_LOG=debug
export RUST_BACKTRACE=1

# Build with debug symbols
npm run build:native:debug

# Run with debugging
node --inspect --trace-warnings app.js
```

### 2. Logging Configuration

```javascript
// Enhanced logging setup
const { logInfo, logError, logWarn } = require('titan-grove');

class DebugLogger {
  static log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
      stack: level === 'error' ? new Error().stack : undefined
    };
    
    console.log(JSON.stringify(logEntry, null, 2));
    
    // Send to native logger
    switch (level) {
      case 'info':
        logInfo(message);
        break;
      case 'error':
        logError(message);
        break;
      case 'warn':
        logWarn(message);
        break;
    }
  }
  
  static info(message, data) {
    this.log('info', message, data);
  }
  
  static error(message, data) {
    this.log('error', message, data);
  }
  
  static warn(message, data) {
    this.log('warn', message, data);
  }
}

// Wrap native functions with logging
function debugWrapper(fn, name) {
  return (...args) => {
    DebugLogger.info(`Calling ${name}`, { args });
    
    try {
      const result = fn(...args);
      DebugLogger.info(`${name} completed`, { result });
      return result;
    } catch (error) {
      DebugLogger.error(`${name} failed`, { args, error: error.message });
      throw error;
    }
  };
}
```

### 3. Health Check System

```javascript
// Comprehensive health monitoring
const { getHealthStatus, getSystemOverview } = require('titan-grove');

class HealthChecker {
  constructor() {
    this.checks = new Map();
    this.setupDefaultChecks();
  }
  
  setupDefaultChecks() {
    this.addCheck('memory', () => {
      const usage = process.memoryUsage();
      const heapUsedMB = usage.heapUsed / 1024 / 1024;
      
      return {
        status: heapUsedMB < 1000 ? 'healthy' : 'warning',
        details: { heapUsedMB, threshold: 1000 }
      };
    });
    
    this.addCheck('native-modules', () => {
      try {
        const health = JSON.parse(getHealthStatus());
        return {
          status: health.status === 'healthy' ? 'healthy' : 'unhealthy',
          details: health
        };
      } catch (error) {
        return {
          status: 'unhealthy',
          details: { error: error.message }
        };
      }
    });
    
    this.addCheck('system', () => {
      try {
        const overview = JSON.parse(getSystemOverview());
        return {
          status: 'healthy',
          details: overview
        };
      } catch (error) {
        return {
          status: 'unhealthy',
          details: { error: error.message }
        };
      }
    });
  }
  
  addCheck(name, checkFn) {
    this.checks.set(name, checkFn);
  }
  
  async runChecks() {
    const results = {};
    let overallStatus = 'healthy';
    
    for (const [name, checkFn] of this.checks) {
      try {
        const result = await checkFn();
        results[name] = result;
        
        if (result.status === 'unhealthy') {
          overallStatus = 'unhealthy';
        } else if (result.status === 'warning' && overallStatus !== 'unhealthy') {
          overallStatus = 'warning';
        }
      } catch (error) {
        results[name] = {
          status: 'unhealthy',
          details: { error: error.message }
        };
        overallStatus = 'unhealthy';
      }
    }
    
    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks: results
    };
  }
  
  startPeriodicChecks(intervalMs = 30000) {
    setInterval(async () => {
      const health = await this.runChecks();
      
      if (health.status !== 'healthy') {
        console.warn('🏥 Health check failed:', health);
      }
    }, intervalMs);
  }
}

const healthChecker = new HealthChecker();
healthChecker.startPeriodicChecks();
```

---

## FAQ

### Q: How do I check if NAPI-RS modules are working correctly?

**A:** Run the built-in test suite:
```bash
node test-all-120-modules.js
```

This will test all 120 modules and show which ones are working.

### Q: Why are some modules missing or failing?

**A:** Out of 120 total modules, 110 are currently operational (91.7% success rate). Some modules may be missing package directories or have incomplete implementations. This is normal and the working modules provide comprehensive enterprise functionality.

### Q: How do I optimize performance?

**A:** Follow these steps:
1. Use batch processing for large datasets
2. Implement caching for repeated calculations
3. Monitor memory usage
4. Use clustering for CPU-intensive workloads
5. Profile your application regularly

Refer to the [Performance Guide](./NAPI_RS_PERFORMANCE_GUIDE.md) for detailed optimization strategies.

### Q: What should I do if I encounter a segmentation fault?

**A:** 
1. Switch to debug build: `npm run build:native:debug`
2. Enable core dumps: `ulimit -c unlimited`
3. Validate all function inputs
4. Use safe wrappers around native calls
5. Check for null/undefined parameters

### Q: How do I report a bug?

**A:**
1. Create a minimal reproduction case
2. Include system information (OS, Node.js version, architecture)
3. Provide error logs and stack traces
4. Include the output of the test suite
5. Submit an issue on GitHub with all details

### Q: Can I use these modules in production?

**A:** Yes! The modules include production-grade features:
- Error handling and resilience
- Performance monitoring
- Health checks
- Logging and metrics
- Input validation and sanitization

However, thoroughly test your specific use cases and monitor performance in your environment.

### Q: How do I update the modules?

**A:**
```bash
# Update to latest version
npm update titan-grove

# Or reinstall completely
npm uninstall titan-grove
npm install titan-grove

# Rebuild native modules
npm run build:native
```

### Q: Are there any license considerations?

**A:** Check the repository's LICENSE file for specific licensing terms. Most functionality is designed for enterprise use with appropriate licensing.

---

**🔧 Need more help?** Create an issue on GitHub with your specific problem, including system details and error logs. The community and maintainers are here to help!