# New Environment Variables Added

## Project Management Configuration

The following environment variables have been added to support the centralized project management configuration system:

### Project Billing Settings
```bash
PROJ_DEFAULT_HOURLY_RATE=125           # Default hourly billing rate
PROJ_STANDARD_TAX_RATE=0.08           # Standard tax rate (8%)
PROJ_PAYMENT_TERMS_DAYS=30            # Net payment terms in days
```

### Project Financial Defaults
```bash
PROJ_DEFAULT_LABOR_RATE=150           # Default labor rate for senior resources
PROJ_DEFAULT_MATERIAL_COST=5000       # Baseline material cost per project
PROJ_OVERHEAD_RATIO=0.15              # Overhead as ratio of total cost (15%)
PROJ_PROFIT_MARGIN_TARGET=0.29        # Target profit margin (29%)
```

### Project Health Score Thresholds
```bash
PROJ_SCHEDULE_PERFORMANCE_TARGET=0.95 # Target schedule performance (95%)
PROJ_COST_PERFORMANCE_TARGET=1.02     # Target cost performance (102% allows 2% over)
PROJ_SCOPE_COMPLETION_TARGET=0.65     # Target scope completion ratio (65%)
PROJ_QUALITY_METRICS_TARGET=0.92      # Target quality metrics (92%)
PROJ_RISK_SCORE_THRESHOLD=0.15        # Maximum acceptable risk score (15%)
PROJ_TEAM_SATISFACTION_TARGET=0.88    # Target team satisfaction (88%)
```

### Project Resource Management
```bash
PROJ_UTILIZATION_TARGET=78            # Target resource utilization percentage
PROJ_OVERALLOCATION_THRESHOLD=0.95    # Overallocation threshold (95% of capacity)
PROJ_CAPACITY_BUFFER_RATIO=0.15       # Buffer ratio for capacity planning (15%)
```

### Project Reporting Defaults
```bash
PROJ_FORECAST_CONFIDENCE_DEFAULT=0.85 # Default forecast confidence level (85%)
PROJ_REPORTING_PERIOD_DAYS=45         # Standard reporting period in days
PROJ_SCHEDULE_VARIANCE_DAYS=5         # Default schedule variance in days
PROJ_BUDGET_VARIANCE_AMOUNT=7000      # Default budget variance amount in dollars
```

## Environment-Specific Examples

### Development Environment
```bash
# .env.development
PROJ_DEFAULT_HOURLY_RATE=125
PROJ_DEFAULT_LABOR_RATE=150
PROJ_STANDARD_TAX_RATE=0.08
PROJ_DEFAULT_MATERIAL_COST=5000
```

### Production Environment
```bash
# .env.production
PROJ_DEFAULT_HOURLY_RATE=175          # Higher production rates
PROJ_DEFAULT_LABOR_RATE=200           # Higher senior rates
PROJ_STANDARD_TAX_RATE=0.085          # Adjusted tax rate
PROJ_DEFAULT_MATERIAL_COST=7500       # Higher material costs
```

## Usage in Services

### Before (Hard-coded)
```typescript
const dueDate = new Date(invoiceDate.getTime() + 30 * 24 * 60 * 60 * 1000);
const taxAmount = subtotal * 0.08;
const hourlyRate = 150;
```

### After (Configurable)
```typescript
const config = loadBusinessConfig().project;
const dueDate = DateUtils.getPaymentDueDate(invoiceDate, config.billing.paymentTermsDays);
const taxAmount = FinancialUtils.calculateTax(subtotal, config.billing.standardTaxRate);
const hourlyRate = config.financials.defaultLaborRate;
```

## Benefits

1. **Zero-Downtime Configuration Changes**: Adjust rates without code deployment
2. **Environment-Specific Settings**: Different values for dev/staging/production
3. **A/B Testing Ready**: Easy to test different parameter sets
4. **Audit Trail**: All configuration changes tracked via environment variables
5. **Type Safety**: Full TypeScript validation of all configuration values