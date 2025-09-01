# Titan Grove Project Structure

This document describes the organization of the Titan Grove repository and the purpose of each directory and file.

## Repository Root

```
titan-grove/
├── .development/           # Development files (demos, tests, validation)
├── .github/               # GitHub workflows and templates
├── docs/                  # Documentation
├── scripts/               # Installation and deployment scripts
├── src/                   # Source code
├── tests/                 # Test suites
├── bin/                   # CLI executables
├── examples/              # Usage examples
└── k8s/                   # Kubernetes manifests
```

## Development Files (.development/)

**Purpose**: Contains all development-related files that are not needed in production but useful for development and testing.

```
.development/
├── demos/                 # Demo scripts and examples
│   ├── demo-19-modules.js
│   ├── demo-domain-organization.js
│   ├── demo-enterprise-service-integration.js
│   ├── demo-message-queue.js
│   ├── demo-service-command-center.js
│   └── demo-service-integration.js
├── tests/                 # Development test files
│   ├── test-business-suite.js
│   ├── test-integration.js
│   ├── test-order-management.ts
│   ├── test-service-command-center.js
│   └── test-supply-chain-manufacturing.ts
├── validation/            # Validation and verification scripts
│   ├── validate-oracle-ebs-competitive.js
│   ├── validate-service-command-center.js
│   ├── verify-modules-fixed.js
│   └── verify-modules.js
├── docs/                  # Development documentation
│   ├── CONFIGURATION_IMPLEMENTATION_SUMMARY.md
│   ├── DOMAIN_IMPLEMENTATION_SUMMARY.md
│   ├── IMPLEMENTATION_SUMMARY.md
│   ├── ORACLE_EBS_COMPETITIVE_IMPLEMENTATION.md
│   ├── ORACLE_EBS_FORTUNE_100_IMPLEMENTATION.md
│   ├── SERVICE_COMMAND_CENTER_IMPLEMENTATION.md
│   ├── SERVICE_INTEGRATION_GUIDE.md
│   └── SUPPLY_CHAIN_MANUFACTURING_IMPLEMENTATION.md
└── README.md              # Development environment guide
```

## Source Code (src/)

**Purpose**: Contains all production source code organized by domains and modules.

```
src/
├── domains/               # Domain-organized business logic
│   ├── financial-administrative/
│   ├── supply-chain-operations/
│   ├── manufacturing-production/
│   ├── human-capital/
│   ├── customer-sales/
│   ├── asset-maintenance/
│   ├── project-service/
│   ├── technology-integration/
│   └── index.ts           # Domain orchestrator
├── modules/               # Business modules
│   ├── financial/         # Financial management
│   ├── hr/               # Human resources
│   ├── crm/              # Customer relationship management
│   ├── scm/              # Supply chain management
│   ├── manufacturing/     # Manufacturing operations
│   ├── project/          # Project management
│   ├── bi/               # Business intelligence
│   ├── assets/           # Asset management
│   ├── procurement/      # Procurement
│   ├── inventory/        # Inventory management
│   ├── quality/          # Quality management
│   ├── service/          # Service management
│   ├── maintenance/      # Maintenance management
│   ├── risk/            # Risk management
│   ├── compliance/      # Compliance management
│   ├── document/        # Document management
│   ├── workflow/        # Workflow management
│   ├── integration/     # Integration management
│   └── ...
├── shared/              # Shared utilities and components
│   ├── data-access/     # Database access layer
│   ├── utils/          # Utility functions
│   ├── interfaces/     # Shared interfaces
│   └── constants/      # Application constants
├── core/               # Core application infrastructure
│   ├── message-queue/  # Message queue system
│   ├── error-handling/ # Error handling
│   └── TitanGrove.ts   # Main application class
├── types/              # TypeScript type definitions
├── server/            # Server management
├── database/          # Database management
├── cache/             # Caching layer
├── security/          # Security components
├── analytics/         # Analytics engine
├── ui/                # User interface components
└── index.ts           # Application entry point
```

## Documentation (docs/)

**Purpose**: Production documentation for users and developers.

```
docs/
├── BUSINESS_CONFIGURATION_SYSTEM.md  # Business configuration guide
├── DOMAIN_ORGANIZATION.md             # Domain architecture
├── DEVELOPER_GUIDE.md                 # Developer documentation
├── TROUBLESHOOTING.md                 # Troubleshooting guide
├── SHARED_UTILITIES.md                # Shared utilities documentation
├── ENVIRONMENT_VARIABLES_EXTENDED.md  # Environment configuration
├── PROJECT_BUSINESS_LOGIC.md          # Business logic documentation
├── HR_FORTUNE_100_FEATURES.md         # HR features documentation
├── oracle-clm-competitive-features.md # Oracle CLM competitive analysis
└── api/                               # API documentation
    ├── rest-api.md
    ├── graphql-schema.md
    └── websocket-events.md
```

## Scripts (scripts/)

**Purpose**: Installation, deployment, and utility scripts.

```
scripts/
├── install.sh          # Main installation script
├── start-dev.sh        # Development server startup
├── start-prod.sh       # Production server startup
├── deploy.sh           # Deployment script
├── backup.sh           # Backup script
└── maintenance.sh      # Maintenance tasks
```

## Tests (tests/)

**Purpose**: Production test suites for quality assurance.

```
tests/
├── unit/               # Unit tests
│   ├── services/
│   ├── utils/
│   └── domains/
├── integration/        # Integration tests
│   ├── api/
│   ├── database/
│   └── services/
├── e2e/               # End-to-end tests
│   ├── workflows/
│   └── user-journeys/
└── fixtures/          # Test data and fixtures
```

## Configuration Files

### Root Configuration Files

- **package.json**: Project dependencies and scripts
- **tsconfig.json**: TypeScript configuration
- **jest.config.js**: Test configuration
- **eslint.config.js**: Code linting rules
- **.prettierrc**: Code formatting rules
- **ecosystem.config.js**: PM2 process management configuration
- **docker-compose.yml**: Docker development environment
- **Dockerfile**: Container configuration

### Environment Files

- **.env.example**: Example environment configuration
- **.env.business.example**: Business logic configuration template
- **.env.production.example**: Production environment template

### Documentation Files

- **README.md**: Main project documentation
- **INSTALL.md**: Installation guide
- **CONTRIBUTING.md**: Contribution guidelines
- **LICENSE**: Software license

## Module Structure

Each business module follows a consistent structure:

```
src/modules/[module-name]/
├── business-logic/     # Core business logic
│   ├── [feature-1]/
│   ├── [feature-2]/
│   └── index.ts
├── data-access/        # Data access layer
│   ├── repositories.ts
│   └── models.ts
├── types.ts           # Module-specific types
├── index.ts           # Module entry point
└── README.md          # Module documentation
```

## Domain Structure

Each domain contains multiple related modules:

```
src/domains/[domain-name]/
├── business-logic/     # Domain business logic
├── configuration/      # Domain configuration
├── types.ts           # Domain types
├── index.ts           # Domain entry point
└── README.md          # Domain documentation
```

## File Naming Conventions

- **TypeScript files**: `kebab-case.ts` (e.g., `payroll-service.ts`)
- **Test files**: `*.test.ts` or `*.spec.ts`
- **Configuration files**: `kebab-case.config.js`
- **Documentation**: `UPPER_CASE.md` for major docs, `kebab-case.md` for specific guides
- **Scripts**: `kebab-case.sh` for shell scripts

## Best Practices

### Organization Principles

1. **Domain-Driven Design**: Code is organized by business domains
2. **Separation of Concerns**: Clear separation between business logic, data access, and presentation
3. **Reusability**: Shared utilities and components are centralized
4. **Testability**: Test files are co-located with source code or in dedicated test directories

### Development Workflow

1. **Development Files**: Use `.development/` for experiments, demos, and development-specific tools
2. **Production Code**: Keep `src/` clean and production-ready
3. **Documentation**: Maintain up-to-date documentation in `docs/`
4. **Testing**: Write tests alongside development

### File Management

- Keep development files separate from production code
- Use consistent naming conventions
- Maintain clear directory structures
- Document complex business logic
- Keep configuration files organized and well-commented

This structure supports both development productivity and production reliability while maintaining clear separation between experimental/development code and production-ready business logic.