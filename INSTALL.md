# Titan Grove Installation Guide

Welcome to Titan Grove, the modern Oracle EBS 12 competitor - a comprehensive Enterprise Business Suite with integrated business applications.

## Table of Contents

- [System Requirements](#system-requirements)
- [Quick Installation](#quick-installation)
- [Manual Installation](#manual-installation)
- [Configuration](#configuration)
- [Deployment Options](#deployment-options)
- [Troubleshooting](#troubleshooting)
- [Post-Installation](#post-installation)

## System Requirements

### Minimum Requirements

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0
- **Memory**: 2GB RAM (4GB+ recommended)
- **Disk Space**: 5GB free space
- **Operating System**: Linux, macOS, or Windows 10+

### Recommended Requirements

- **Node.js**: Latest LTS version
- **Memory**: 8GB+ RAM
- **CPU**: 4+ cores
- **Database**: PostgreSQL 12+, MySQL 8+, or MongoDB 5+
- **Cache**: Redis 6+ (optional but recommended)
- **Container**: Docker + Docker Compose (for containerized deployment)

### Production Requirements

- **Memory**: 16GB+ RAM
- **CPU**: 8+ cores  
- **Storage**: SSD with 50GB+ free space
- **Network**: Load balancer for high availability
- **Monitoring**: Prometheus + Grafana recommended

## Quick Installation

### Automated Installation

The fastest way to get started is using our automated installation script:

```bash
# Clone the repository
git clone https://github.com/harborgrid-justin/titan-grove.git
cd titan-grove

# Run the automated installer
./scripts/install.sh
```

The installer will:
1. Check system requirements
2. Install dependencies
3. Build the application
4. Setup configuration files
5. Run initial tests
6. Create startup scripts

### Docker Installation

For containerized deployment:

```bash
# Using Docker Compose (recommended)
docker-compose up -d

# Or using Docker directly
docker build -t titan-grove .
docker run -p 3000:3000 titan-grove
```

## Manual Installation

If you prefer manual installation or need custom configuration:

### Step 1: Clone Repository

```bash
git clone https://github.com/harborgrid-justin/titan-grove.git
cd titan-grove
```

### Step 2: Install Dependencies

```bash
# Install with npm
npm install --force

# Or with yarn
yarn install
```

**Note**: We use `--force` flag to handle peer dependency conflicts from legacy packages.

### Step 3: Environment Configuration

```bash
# Copy example environment files
cp .env.example .env
cp .env.production.example .env.production
cp .env.business.example .env.business
```

Edit the `.env` files according to your environment needs.

### Step 4: Build Application

```bash
# Development build
npm run build

# Production build
NODE_ENV=production npm run build
```

### Step 5: Start Application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Configuration

### Environment Variables

Titan Grove uses multiple environment files for different aspects:

- **`.env`** - General application configuration
- **`.env.business`** - Business logic configuration
- **`.env.production`** - Production-specific settings

#### Key Configuration Options

```bash
# Application
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/titangrove
MONGODB_URI=mongodb://localhost:27017/titangrove

# Cache
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your-secure-jwt-secret
ENCRYPTION_KEY=your-32-character-encryption-key

# Business Configuration
CTO_DEFAULT_BASE_PRICE=1500
CTO_ENGINEERING_HOURLY_RATE=175
CAM_ROI_BASE_CASE_PROBABILITY=55
```

### Business Configuration System

Titan Grove features a centralized business configuration system:

```typescript
// Example business configuration
export interface BusinessConfig {
  pricing: {
    defaultBasePrice: number;
    engineeringHourlyRate: number;
    costRatio: number;
  };
  manufacturing: {
    defaultEfficiency: number;
    qualityThreshold: number;
  };
  financial: {
    defaultCurrency: string;
    taxRate: number;
  };
}
```

## Deployment Options

### 1. Traditional Server Deployment

```bash
# Using PM2 for process management
npm install -g pm2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

### 2. Docker Deployment

#### Single Container

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production --force
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Docker Compose

```yaml
version: '3.8'
services:
  titan-grove:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - postgres
      - redis
  
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: titangrove
      POSTGRES_USER: titan
      POSTGRES_PASSWORD: secure-password
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    
volumes:
  postgres_data:
```

### 3. Kubernetes Deployment

See `k8s/` directory for Kubernetes manifests and Helm charts.

### 4. Cloud Deployment

#### AWS
- **ECS**: Use provided task definitions
- **EKS**: Use Kubernetes manifests
- **Lambda**: Serverless deployment options available

#### Azure
- **Container Instances**: Direct container deployment
- **AKS**: Kubernetes deployment

#### Google Cloud
- **Cloud Run**: Serverless containers
- **GKE**: Kubernetes deployment

## Troubleshooting

### Common Issues

#### Build Errors

```bash
# TypeScript compilation errors
npm run build 2>&1 | tee build.log

# Check for missing dependencies
npm audit
npm install --force
```

#### Memory Issues

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

#### Port Conflicts

```bash
# Check what's using port 3000
lsof -i :3000
kill -9 <PID>

# Use different port
PORT=3001 npm start
```

#### Database Connection Issues

```bash
# Test database connectivity
npm run db:test

# Reset database
npm run db:reset
npm run db:migrate
```

### Performance Optimization

#### Production Settings

```bash
# Enable clustering
CLUSTER_MODE=true npm start

# Enable compression
ENABLE_COMPRESSION=true npm start

# Configure caching
CACHE_TTL=3600 npm start
```

#### Memory Optimization

```bash
# Garbage collection optimization
NODE_OPTIONS="--max-old-space-size=8192 --optimize-for-size" npm start
```

### Security Hardening

```bash
# Update dependencies
npm audit fix

# Enable security headers
SECURITY_HEADERS=true npm start

# Configure HTTPS
SSL_CERT_PATH=/path/to/cert.pem
SSL_KEY_PATH=/path/to/key.pem
```

## Post-Installation

### 1. Verify Installation

```bash
# Check application status
curl http://localhost:3000/health

# Run diagnostics
npm run diagnostics

# Verify all modules
npm run verify
```

### 2. Setup Admin User

```bash
# Create initial admin user
npm run setup:admin

# Or via API
curl -X POST http://localhost:3000/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"secure-password"}'
```

### 3. Load Sample Data (Optional)

```bash
# Load demonstration data
npm run data:demo

# Load specific module data
npm run data:load -- --module=financial
```

### 4. Configure Monitoring

```bash
# Enable metrics collection
ENABLE_METRICS=true npm start

# Setup health checks
HEALTH_CHECK_INTERVAL=30000 npm start
```

### 5. Setup Backups

```bash
# Database backup
npm run backup:db

# Full system backup
npm run backup:full

# Schedule automated backups
npm run backup:schedule
```

## Next Steps

After successful installation:

1. **Read the Documentation**: Explore the `docs/` directory
2. **Configure Business Logic**: Customize business rules and workflows
3. **Setup Integrations**: Connect with external systems
4. **Train Users**: Provide user training and documentation
5. **Monitor Performance**: Setup monitoring and alerting
6. **Plan Maintenance**: Schedule regular updates and maintenance

## Support

- **Documentation**: `/docs` directory
- **GitHub Issues**: https://github.com/harborgrid-justin/titan-grove/issues
- **Community**: Join our community discussions
- **Enterprise Support**: Contact for enterprise support options

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.