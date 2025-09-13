# Titan Grove - Enterprise SOA Architecture

This repository has been restructured following enterprise Service-Oriented Architecture (SOA) patterns to support scalable microservices deployment.

## 🏗️ Architecture Overview

```
titan-grove/
├── frontend/                    # Presentation Layer
│   ├── web-portal/             # Next.js 15+ main web app
│   ├── mobile-app/             # React Native mobile app  
│   ├── admin-console/          # Vite + React admin dashboard
│   └── shared/                 # Shared frontend libraries
├── backend/                     # Business Services Layer
│   ├── services/               # Microservices (Node.js & Rust)
│   ├── shared/                 # Shared backend libraries
│   └── gateway/                # API Gateway options
├── data/                        # Data Layer
│   ├── databases/              # PostgreSQL, MongoDB, TimeSeries
│   ├── cache/                  # Redis, KeyDB
│   ├── search/                 # Elasticsearch, Meilisearch
│   └── data-warehouse/         # Analytics & ETL
├── messaging/                   # Integration Layer
│   ├── kafka/                  # Event streaming
│   ├── redis-streams/          # Simple messaging
│   └── nats/                   # NATS messaging
└── infrastructure/             # DevOps Layer
    ├── kubernetes/             # K8s manifests & Helm charts
    ├── terraform/              # Infrastructure as Code
    ├── docker/                 # Containerization
    └── monitoring/             # Prometheus, Grafana, Jaeger
```

## 🚀 Quick Start

### Development Setup

1. **Install all dependencies:**
   ```bash
   npm install
   npm run install:rust  # For Rust services
   ```

2. **Start development environment:**
   ```bash
   # Legacy monolith (existing functionality)
   npm run dev

   # New microservices architecture
   npm run dev:services
   
   # Or with Docker Compose
   npm run start:services
   ```

3. **Build all services:**
   ```bash
   npm run build
   npm run build:rust  # For Rust services
   ```

### Service URLs (Development)

- **Web Portal:** http://localhost:3000
- **Admin Console:** http://localhost:3001  
- **API Gateway:** http://localhost:8080
- **User Service:** http://localhost:3001/api
- **Order Service:** http://localhost:3002/api

## 🎯 Services

### Frontend Services
- **Web Portal** (Next.js): Main business user interface
- **Admin Console** (Vite/React): System administration
- **Mobile App** (React Native): Cross-platform mobile access

### Backend Services  
- **User Service** (Node.js): Authentication & user management
- **Product Service** (Node.js): Product catalog management
- **Order Service** (Rust): High-performance order processing
- **Payment Service** (Rust): Secure payment processing
- **Notification Service** (Node.js): Multi-channel notifications
- **Analytics Service** (Rust): Data processing & reporting
- **Audit Service** (Rust): Compliance & audit logging
- **Config Service** (Node.js): Configuration management

## 🧪 Testing

```bash
# Test all services
npm test
npm run test:services

# End-to-end testing
npm run test:e2e
```

## 🐳 Docker Support

```bash
# Build all service containers
npm run docker:services

# Start full stack with Docker Compose
docker-compose -f docker-compose.dev.yml up
```

## 📈 Monitoring & Observability

- **Metrics:** Prometheus (http://localhost:9090)
- **Dashboards:** Grafana (http://localhost:3003) 
- **Distributed Tracing:** Jaeger
- **Centralized Logging:** ELK Stack

## 🔄 Migration Status

This is an incremental migration from monolithic to microservices architecture:

- ✅ **Phase 1:** Directory structure created
- ✅ **Phase 2:** Frontend applications scaffolded  
- ✅ **Phase 3:** Core backend services created
- ✅ **Phase 4:** Shared libraries established
- 🔄 **Phase 5:** Data layer implementation (in progress)
- ⏳ **Phase 6:** Messaging layer setup
- ⏳ **Phase 7:** Infrastructure automation

## 💡 Key Benefits

- **Scalability:** Independent service scaling
- **Technology Diversity:** Node.js for rapid development, Rust for performance
- **Resilience:** Service isolation and fault tolerance
- **Developer Experience:** Clear separation of concerns
- **Deployment Flexibility:** Container-based deployment options

## 📚 Documentation

- [Architecture Guide](./ARCHITECTURE.md)
- [API Documentation](./docs/api/)
- [Deployment Guide](./docs/deployment/)
- [Development Guide](./docs/development/)

## 🤝 Contributing

1. Choose the appropriate service layer for your changes
2. Follow service-specific development patterns
3. Ensure proper testing at service and integration levels
4. Update documentation for architecture changes

---

**Legacy Support:** The original monolithic structure remains available during the transition period via `npm run dev` and `npm run build:legacy`.