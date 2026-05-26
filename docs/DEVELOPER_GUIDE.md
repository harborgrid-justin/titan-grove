# Titan Grove Development Guide

This guide provides detailed information for developers working on Titan Grove.

> **Using Claude / Claude Code?** Start with [`CLAUDE.md`](../CLAUDE.md) (session
> memory) and the [`LLM Development Guide`](CLAUDE_BEST_PRACTICES.md) for the
> enterprise agent setup: subagents, path-scoped rules, permissions, and token
> discipline.

## Table of Contents

- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [API Development](#api-development)
- [Database Management](#database-management)
- [Debugging](#debugging)
- [Performance Optimization](#performance-optimization)

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- Git
- Docker (optional)
- PostgreSQL/MySQL/MongoDB (for database development)

### Environment Setup

```bash
# Clone and setup
git clone https://github.com/harborgrid-justin/titan-grove.git
cd titan-grove

# Install dependencies
npm install --force

# Setup environment
cp .env.example .env
cp .env.business.example .env.business

# Start development server
npm run dev
```

### Development Workflow

1. Create feature branch from `main`
2. Make changes following coding standards
3. Add/update tests
4. Run linting and tests
5. Submit pull request

## Project Structure

```
src/
├── domains/                 # Domain-organized business logic
│   ├── financial-administrative/
│   ├── supply-chain-operations/
│   ├── manufacturing-production/
│   └── index.ts
├── modules/                 # Business modules
│   ├── financial/
│   ├── hr/
│   ├── crm/
│   └── ...
├── shared/                  # Shared utilities
│   ├── data-access/
│   ├── utils/
│   └── interfaces/
├── core/                    # Core infrastructure
│   ├── message-queue/
│   ├── error-handling/
│   └── TitanGrove.ts
└── types/                   # TypeScript definitions
```

## Architecture Overview

### Domain-Driven Design

Titan Grove follows Domain-Driven Design principles:

- **Domains**: High-level business areas
- **Modules**: Specific business capabilities
- **Services**: Business logic implementation
- **Repositories**: Data access abstraction

### Business Logic Organization

```typescript
// Example domain structure
export class FinancialDomain {
  private generalLedger: GeneralLedgerService;
  private accountsPayable: AccountsPayableService;
  private fixedAssets: FixedAssetsService;

  async executeFinancialAnalysis() {
    // Cross-service business logic
  }
}
```

### Configuration System

Centralized business configuration with environment variables:

```typescript
// Business configuration interface
interface BusinessConfig {
  financial: {
    defaultCurrency: string;
    taxRate: number;
  };
  manufacturing: {
    defaultEfficiency: number;
    qualityThreshold: number;
  };
}
```

## Coding Standards

### TypeScript Guidelines

- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use proper typing for all functions
- Avoid `any` type unless absolutely necessary

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

async function getUser(id: string): Promise<User | null> {
  // Implementation
}

// Avoid
function getUser(id): any {
  // Implementation
}
```

### Naming Conventions

- **Classes**: PascalCase (`UserService`)
- **Functions/Variables**: camelCase (`getUserData`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **Files**: kebab-case (`user-service.ts`)
- **Directories**: kebab-case (`user-management/`)

### Code Organization

- Keep functions small and focused
- Use meaningful names
- Write self-documenting code
- Add comments for complex business logic

```typescript
/**
 * Calculate depreciation using straight-line method
 * @param assetValue - Initial value of the asset
 * @param usefulLife - Useful life in years
 * @param salvageValue - Expected salvage value
 */
function calculateStraightLineDepreciation(
  assetValue: number,
  usefulLife: number,
  salvageValue: number = 0
): number {
  return (assetValue - salvageValue) / usefulLife;
}
```

## Testing Guidelines

### Test Structure

```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
├── e2e/           # End-to-end tests
└── fixtures/      # Test data
```

### Writing Tests

```typescript
// Unit test example
describe('CalculationService', () => {
  let service: CalculationService;

  beforeEach(() => {
    service = new CalculationService();
  });

  describe('calculateTax', () => {
    it('should calculate tax correctly', () => {
      const result = service.calculateTax(1000, 0.1);
      expect(result).toBe(100);
    });

    it('should handle zero tax rate', () => {
      const result = service.calculateTax(1000, 0);
      expect(result).toBe(0);
    });
  });
});
```

### Test Commands

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --grep "CalculationService"

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## API Development

### REST API Guidelines

- Use RESTful conventions
- Proper HTTP status codes
- Consistent error handling
- Request/response validation

```typescript
// API endpoint example
@Controller('/api/financial')
export class FinancialController {
  @Get('/ledger/:id')
  async getLedgerEntry(
    @Param('id') id: string
  ): Promise<LedgerEntry> {
    const entry = await this.ledgerService.getEntry(id);
    if (!entry) {
      throw new NotFoundException('Ledger entry not found');
    }
    return entry;
  }

  @Post('/transactions')
  async createTransaction(
    @Body() data: CreateTransactionDto
  ): Promise<Transaction> {
    return await this.transactionService.create(data);
  }
}
```

### Error Handling

```typescript
// Custom error classes
export class BusinessLogicError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'BusinessLogicError';
  }
}

// Usage
if (balance < withdrawAmount) {
  throw new BusinessLogicError(
    'Insufficient funds',
    'INSUFFICIENT_FUNDS',
    400
  );
}
```

## Database Management

### Repository Pattern

```typescript
export class UserRepository extends BaseRepositoryImpl<User> {
  protected generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.items.find(user => user.email === email) || null;
  }

  async findActiveUsers(): Promise<User[]> {
    return this.items.filter(user => user.status === 'active');
  }
}
```

### Database Migrations

```typescript
// Migration example
export class CreateUsersTable {
  async up(): Promise<void> {
    // Create table logic
  }

  async down(): Promise<void> {
    // Rollback logic
  }
}
```

### Connection Management

```typescript
// Database configuration
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  poolSize?: number;
}
```

## Debugging

### Logging

```typescript
// Use structured logging
import { logger } from '../utils/logger';

export class PayrollService {
  async processPayroll(employeeId: string) {
    logger.info('Starting payroll processing', {
      employeeId,
      timestamp: new Date(),
      module: 'payroll'
    });

    try {
      const result = await this.calculatePay(employeeId);
      
      logger.info('Payroll processed successfully', {
        employeeId,
        amount: result.grossPay
      });

      return result;
    } catch (error) {
      logger.error('Payroll processing failed', {
        employeeId,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
}
```

### Debug Configuration

```json
// launch.json for VS Code
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Titan Grove",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/index.ts",
      "outDir": "${workspaceFolder}/dist",
      "runtimeArgs": ["-r", "ts-node/register"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

### Performance Monitoring

```typescript
// Performance monitoring
export class PerformanceMonitor {
  static measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    
    return fn().finally(() => {
      const duration = Date.now() - start;
      logger.info(`Performance: ${name} took ${duration}ms`);
    });
  }
}

// Usage
await PerformanceMonitor.measure('payroll-calculation', async () => {
  return await payrollService.calculate(employeeId);
});
```

## Performance Optimization

### Caching Strategies

```typescript
export class CachedService {
  private cache = new Map<string, any>();
  private cacheTTL = 60000; // 1 minute

  async getData(key: string): Promise<any> {
    const cached = this.cache.get(key);
    if (cached && cached.timestamp > Date.now() - this.cacheTTL) {
      return cached.data;
    }

    const data = await this.fetchData(key);
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });

    return data;
  }
}
```

### Database Optimization

```typescript
// Use indexes for frequently queried fields
// Implement connection pooling
// Use query optimization

export class OptimizedRepository {
  async findWithPagination(
    page: number,
    limit: number,
    filters?: any
  ): Promise<PaginatedResult<T>> {
    const offset = (page - 1) * limit;
    
    // Use efficient queries with proper indexing
    const [items, count] = await Promise.all([
      this.findWithOffset(offset, limit, filters),
      this.count(filters)
    ]);

    return {
      items,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    };
  }
}
```

### Memory Management

```typescript
// Avoid memory leaks
export class MemoryEfficientService {
  private subscriptions: Subscription[] = [];

  subscribe(observable: Observable<any>) {
    const subscription = observable.subscribe(/* handler */);
    this.subscriptions.push(subscription);
  }

  destroy() {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }
}
```

## Best Practices

### Error Handling

- Always handle errors appropriately
- Use custom error types for business logic errors
- Log errors with context
- Return meaningful error messages to clients

### Security

- Validate all inputs
- Use parameterized queries
- Implement proper authentication and authorization
- Keep dependencies updated

### Code Quality

- Write tests for all business logic
- Use linting tools
- Keep functions and classes small
- Document complex business rules

### Performance

- Profile code regularly
- Use appropriate data structures
- Implement caching where beneficial
- Monitor memory usage

## Contributing

1. Follow the coding standards
2. Write comprehensive tests
3. Update documentation
4. Submit clean pull requests
5. Participate in code reviews

For more detailed information, see [CONTRIBUTING.md](../CONTRIBUTING.md).