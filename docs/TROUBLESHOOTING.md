# Titan Grove Troubleshooting Guide

This guide helps resolve common issues when installing, configuring, and running Titan Grove.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Build Problems](#build-problems)
- [Runtime Errors](#runtime-errors)
- [Database Issues](#database-issues)
- [Performance Problems](#performance-problems)
- [Configuration Issues](#configuration-issues)
- [Docker Problems](#docker-problems)
- [Getting Help](#getting-help)

## Installation Issues

### Node.js Version Conflicts

**Problem**: TypeScript compilation fails with Node.js version errors.

**Solution**:
```bash
# Check Node.js version
node --version

# Update to Node.js 18+ using nvm
nvm install 18
nvm use 18

# Or download from nodejs.org
```

### npm Install Failures

**Problem**: `npm install` fails with peer dependency conflicts.

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Install with force flag
npm install --force

# Alternative: Use legacy peer deps
npm install --legacy-peer-deps
```

### Permission Issues

**Problem**: Permission denied errors during installation.

**Solution**:
```bash
# Fix npm permissions (Linux/macOS)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use npx instead of global installs
npx titan-grove
```

## Build Problems

### TypeScript Compilation Errors

**Problem**: Build fails with numerous TypeScript errors.

**Solution**:
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Build with type checking disabled temporarily
npm run build -- --skipLibCheck

# Fix specific type errors:
# 1. Add missing @types packages
npm install --save-dev @types/node @types/express

# 2. Update tsconfig.json for stricter typing
{
  "compilerOptions": {
    "strict": false,  // Temporarily disable for complex migrations
    "skipLibCheck": true
  }
}
```

### Missing Dependencies

**Problem**: Module not found errors during build.

**Solution**:
```bash
# Install missing dependencies
npm install

# For specific missing modules
npm install <module-name>

# Check for outdated packages
npm outdated

# Update packages
npm update
```

### Memory Issues During Build

**Problem**: Build process runs out of memory.

**Solution**:
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Or set in package.json
"scripts": {
  "build": "NODE_OPTIONS='--max-old-space-size=4096' tsc"
}

# Use incremental builds
npm run build:watch
```

## Runtime Errors

### Port Already in Use

**Problem**: Server fails to start - port 3000 already in use.

**Solution**:
```bash
# Find process using port
lsof -i :3000
# or on Windows
netstat -ano | findstr :3000

# Kill process
kill -9 <PID>

# Use different port
PORT=3001 npm start

# Set in environment
echo "PORT=3001" >> .env
```

### Database Connection Failures

**Problem**: Cannot connect to database.

**Solution**:
```bash
# Check database status
pg_isready -h localhost -p 5432  # PostgreSQL
mysqladmin ping                   # MySQL

# Verify connection string
echo $DATABASE_URL

# Test connection
npm run db:test

# Reset database
npm run db:reset
npm run db:migrate
```

### Authentication Errors

**Problem**: JWT authentication fails.

**Solution**:
```bash
# Generate new JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Update .env
JWT_SECRET=your-new-secret-key

# Clear existing sessions
redis-cli FLUSHDB  # If using Redis for sessions
```

### Module Loading Errors

**Problem**: Cannot resolve module paths.

**Solution**:
```bash
# Check TypeScript path mapping in tsconfig.json
{
  "baseUrl": "./src",
  "paths": {
    "@/*": ["*"],
    "@core/*": ["core/*"]
  }
}

# Update require/import statements
// Instead of relative paths
import { Service } from '../../../core/Service';

// Use absolute paths
import { Service } from '@core/Service';
```

## Database Issues

### Migration Failures

**Problem**: Database migrations fail to run.

**Solution**:
```bash
# Check migration status
npm run db:status

# Rollback failed migration
npm run db:rollback

# Run specific migration
npm run db:migrate -- --to 001_initial

# Reset and rebuild
npm run db:reset
npm run db:migrate
```

### Connection Pool Exhaustion

**Problem**: Too many database connections.

**Solution**:
```bash
# Update database configuration
DATABASE_POOL_SIZE=20
DATABASE_POOL_TIMEOUT=10000

# Monitor connections
SELECT count(*) FROM pg_stat_activity; -- PostgreSQL
SHOW PROCESSLIST;                      -- MySQL
```

### Query Performance Issues

**Problem**: Slow database queries.

**Solution**:
```sql
-- Enable query logging
-- PostgreSQL
ALTER SYSTEM SET log_statement = 'all';

-- Add indexes for frequently queried columns
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_transaction_date ON transactions(created_at);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM large_table WHERE condition;
```

## Performance Problems

### High Memory Usage

**Problem**: Application consumes too much memory.

**Solution**:
```bash
# Monitor memory usage
node --inspect src/index.ts
# Open chrome://inspect in browser

# Profile memory
npm install -g clinic
clinic doctor -- node src/index.ts

# Implement memory limits
NODE_OPTIONS="--max-old-space-size=2048"

# Check for memory leaks
const memwatch = require('memwatch-next');
memwatch.on('leak', (info) => {
  console.log('Memory leak detected:', info);
});
```

### Slow Response Times

**Problem**: API responses are slow.

**Solution**:
```javascript
// Implement caching
const cache = new Map();
app.get('/api/data', (req, res) => {
  const key = req.path + JSON.stringify(req.query);
  if (cache.has(key)) {
    return res.json(cache.get(key));
  }
  
  const data = getExpensiveData();
  cache.set(key, data);
  res.json(data);
});

// Add database indexes
// Enable compression
app.use(compression());

// Implement pagination
app.get('/api/items', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 100);
  // Implementation
});
```

### High CPU Usage

**Problem**: CPU usage is consistently high.

**Solution**:
```bash
# Profile CPU usage
node --prof src/index.ts
node --prof-process isolate-*.log

# Use clustering
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // Start application
}
```

## Configuration Issues

### Environment Variables Not Loading

**Problem**: Environment variables are not being read.

**Solution**:
```bash
# Check .env file location
ls -la .env*

# Verify dotenv is loaded early
// At the top of your main file
require('dotenv').config();

# Check environment
node -e "console.log(process.env.NODE_ENV)"

# Debug environment loading
console.log('Environment variables:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL ? '[REDACTED]' : 'undefined'
});
```

### Business Configuration Errors

**Problem**: Business logic configuration is incorrect.

**Solution**:
```typescript
// Validate configuration at startup
const config = {
  CTO_DEFAULT_BASE_PRICE: parseFloat(process.env.CTO_DEFAULT_BASE_PRICE) || 1500,
  CTO_ENGINEERING_HOURLY_RATE: parseFloat(process.env.CTO_ENGINEERING_HOURLY_RATE) || 175
};

// Add validation
if (config.CTO_DEFAULT_BASE_PRICE <= 0) {
  throw new Error('CTO_DEFAULT_BASE_PRICE must be positive');
}

// Log configuration (without secrets)
console.log('Business Configuration:', config);
```

## Docker Problems

### Build Failures

**Problem**: Docker build fails.

**Solution**:
```dockerfile
# Dockerfile optimization
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production --force

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

### Container Startup Issues

**Problem**: Container exits immediately.

**Solution**:
```bash
# Check container logs
docker logs <container-id>

# Run interactively for debugging
docker run -it titan-grove /bin/sh

# Check process
docker exec <container-id> ps aux

# Verify environment
docker exec <container-id> env
```

### Database Connection in Docker

**Problem**: Cannot connect to database from container.

**Solution**:
```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/titangrove
    depends_on:
      - db
  
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: titangrove
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Common Error Messages

### "Cannot find module"

```bash
# Module resolution issue
Error: Cannot find module '@/types/user'

# Solutions:
1. Check tsconfig.json paths configuration
2. Verify file exists at expected location
3. Restart TypeScript service in IDE
4. Clear node_modules and reinstall
```

### "Port EADDRINUSE"

```bash
# Port already in use
Error: listen EADDRINUSE: address already in use :::3000

# Solutions:
1. Kill process using port: lsof -i :3000
2. Use different port: PORT=3001 npm start
3. Check for zombie processes
```

### "Connection terminated unexpectedly"

```bash
# Database connection issue
Error: Connection terminated unexpectedly

# Solutions:
1. Check database service status
2. Verify connection credentials
3. Check firewall settings
4. Increase connection timeout
```

### "Maximum call stack size exceeded"

```bash
# Stack overflow error
RangeError: Maximum call stack size exceeded

# Solutions:
1. Check for circular references
2. Implement proper recursion limits
3. Use iterative solutions for deep structures
4. Increase stack size: --stack-size=2000
```

## Debugging Tools

### Logging

```javascript
// Enhanced logging setup
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});
```

### Health Checks

```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: 'checking...'
  };

  // Check database connection
  db.query('SELECT 1')
    .then(() => {
      health.database = 'connected';
      res.json(health);
    })
    .catch(err => {
      health.database = 'error';
      health.status = 'error';
      res.status(503).json(health);
    });
});
```

### Monitoring

```bash
# System monitoring commands
top                    # CPU and memory usage
htop                   # Enhanced top
iostat                 # I/O statistics
netstat -tulpn         # Network connections
df -h                  # Disk usage
free -h               # Memory usage

# Application monitoring
pm2 status            # PM2 process status
pm2 logs             # View logs
pm2 monit            # Real-time monitoring
```

## Getting Help

### Before Asking for Help

1. Check this troubleshooting guide
2. Search existing GitHub issues
3. Review application logs
4. Try the suggested solutions

### Information to Provide

When seeking help, include:

- Operating system and version
- Node.js and npm versions
- Complete error messages
- Steps to reproduce the issue
- Environment configuration (without secrets)
- Log output

### Support Channels

- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: Community Q&A
- **Documentation**: Check `/docs` directory
- **Stack Overflow**: Tag with `titan-grove`

### Emergency Issues

For critical production issues:

1. Check application health endpoints
2. Review monitoring dashboards
3. Check system resources
4. Review recent deployments
5. Implement immediate workarounds
6. Document for post-mortem

Remember: Most issues have been encountered before. Check the documentation and community resources first, then ask specific questions with relevant details.