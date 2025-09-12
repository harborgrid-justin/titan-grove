# Enterprise SOA Architecture - Titan Grove

## Overview

This repository has been restructured to follow enterprise Service-Oriented Architecture (SOA) patterns, separating concerns into distinct layers and services for better scalability, maintainability, and deployment flexibility.

## Architecture Layers

### 1. Frontend Layer (`frontend/`)

**Web Portal** (`frontend/web-portal/`)
- Next.js 15+ application with App Router
- Main web interface for business users
- TypeScript + Tailwind CSS
- Server-side rendering and static generation

**Mobile App** (`frontend/mobile-app/`)
- React Native application
- Cross-platform mobile support (iOS/Android)
- Shared navigation and components

**Admin Console** (`frontend/admin-console/`)
- Vite + React admin dashboard
- System administration and monitoring
- TypeScript support with modern tooling

**Shared Frontend Libraries** (`frontend/shared/`)
- `ui-components/`: Reusable React components
- `api-client/`: TypeScript API client libraries
- `types/`: Shared TypeScript type definitions
- `utils/`: Common utility functions

### 2. Backend Services Layer (`backend/`)

**Microservices** (`backend/services/`)

*Node.js Services:*
- `user-service/`: User management, authentication, profiles
- `product-service/`: Product catalog and management
- `notification-service/`: Email, SMS, push notifications
- `config-service/`: Configuration management

*Rust Services:*
- `order-service/`: Order processing and management
- `payment-service/`: Payment processing with security
- `analytics-service/`: Data analytics and reporting
- `audit-service/`: Compliance and audit logging

**Shared Backend Libraries** (`backend/shared/`)
- `node-common/`: Shared Node.js utilities, middleware, authentication
- `rust-common/`: Shared Rust libraries for common functionality
- `api-contracts/`: OpenAPI, GraphQL, and gRPC contracts
- `types/`: Shared TypeScript type definitions

**API Gateway** (`backend/gateway/`)
- `nodejs-gateway/`: Express.js-based gateway
- `rust-gateway/`: High-performance Rust gateway
- `kong/`: Kong API Gateway configuration

### 3. Data Layer (`data/`)

**Databases** (`data/databases/`)
- `postgresql/`: Relational databases for services
- `mongodb/`: Document databases for catalogs and analytics
- `timeseries/`: InfluxDB and Prometheus for metrics

**Cache** (`data/cache/`)
- `redis/`: Primary caching layer
- `keydb/`: Redis-compatible alternative

**Search** (`data/search/`)
- `elasticsearch/`: Full-text search
- `meilisearch/`: Rust-based search engine
- `typesense/`: Alternative search solution

**Data Warehouse** (`data/data-warehouse/`)
- `clickhouse/`: Analytics database
- `etl/`: ETL jobs in Node.js and Rust

### 4. Messaging Layer (`messaging/`)

**Event Streaming** (`messaging/kafka/`)
- Apache Kafka for event streaming
- Node.js and Rust client libraries
- Schema registry integration

**Message Queues**
- `redis-streams/`: Redis Streams for simple messaging
- `nats/`: NATS messaging system
- `event-store/`: Event sourcing implementation

### 5. Infrastructure Layer (`infrastructure/`)

**Container Orchestration** (`infrastructure/kubernetes/`)
- Kubernetes manifests for all services
- Helm charts for easy deployment
- Environment-specific configurations

**Infrastructure as Code** (`infrastructure/terraform/`)
- AWS/Azure/GCP resource provisioning
- Environment-specific modules
- Networking and security configurations

**Containerization** (`infrastructure/docker/`)
- Multi-stage Dockerfiles for all services
- Docker Compose for development
- Base images for consistency

**Monitoring** (`infrastructure/monitoring/`)
- Prometheus metrics collection
- Grafana dashboards
- Jaeger distributed tracing
- ELK stack for centralized logging

## Development Workflow

### Getting Started

1. **Install Dependencies**
   ```bash
   npm run install:all
   ```

2. **Start Development Environment**
   ```bash
   npm run dev
   ```

3. **Run Tests**
   ```bash
   npm test
   ```

### Building Services

- **Frontend**: `npm run build:frontend`
- **Backend**: `npm run build:backend`
- **All**: `npm run build`

### Service Development

Each service is independently deployable with its own:
- Package configuration
- Database schema
- API documentation
- Test suite
- Docker configuration

### Adding New Services

1. Create service directory in appropriate layer
2. Initialize with appropriate package manager
3. Add to workspace configuration
4. Update build and deployment scripts
5. Create service documentation

## Migration Notes

This structure represents a migration from a monolithic architecture to microservices. The migration approach:

1. **Incremental**: Services are extracted gradually
2. **Backward Compatible**: Legacy endpoints maintained during transition
3. **Database Per Service**: Each service owns its data
4. **API-First**: Well-defined contracts between services

## Deployment

Services can be deployed:
- **Individually**: Each service as separate containers
- **Together**: Using Docker Compose for development
- **Orchestrated**: Using Kubernetes for production

See `infrastructure/` directory for deployment configurations.