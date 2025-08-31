# Shared Utility Libraries Documentation

## Overview

This document describes the reusable utility libraries created to centralize common patterns and eliminate code duplication across the Titan Grove codebase.

## Libraries Created

### 1. Constants and Utilities (`src/shared/constants/index.ts`)

#### Time Constants
```typescript
export const TIME_CONSTANTS = {
  MILLISECONDS_PER_DAY: 24 * 60 * 60 * 1000,
  DAYS_PER_MONTH: 30,
  DAYS_PER_YEAR: 365,
} as const;
```

#### Date Utilities
```typescript
export const DateUtils = {
  addDays: (date: Date, days: number): Date,
  addMonths: (date: Date, months: number): Date,
  getPaymentDueDate: (invoiceDate: Date, paymentTermsDays: number): Date,
  getForecastDate: (baseDate: Date, forecastDays: number): Date
};

// Usage Examples:
const dueDate = DateUtils.getPaymentDueDate(new Date(), 30); // Net 30 payment
const forecastDate = DateUtils.getForecastDate(new Date(), 45); // 45-day forecast
```

#### ID Generation Utilities
```typescript
export const IdUtils = {
  generateProjectId: (): string,
  generateContractId: (): string,
  generateInvoiceId: (): string,
  generateTimeSheetId: (): string,
  generateContractNumber: (): string,
  generateInvoiceNumber: (): string,
  generateProjectNumber: (): string
};

// Usage Examples:
const projectId = IdUtils.generateProjectId(); // "proj_1693524123456_abc123def"
const invoice = IdUtils.generateInvoiceNumber(); // "INV524123"
```

#### Financial Calculation Utilities
```typescript
export const FinancialUtils = {
  calculateTax: (amount: number, taxRate: number): number,
  calculateOverhead: (totalCost: number, overheadRatio: number): number,
  calculateProfitMargin: (revenue: number, costs: number): number,
  roundToCents: (amount: number): number
};

// Usage Examples:
const tax = FinancialUtils.calculateTax(1000, 0.08); // $80
const overhead = FinancialUtils.calculateOverhead(10000, 0.15); // $1,500
const margin = FinancialUtils.calculateProfitMargin(12000, 10000); // 0.167 (16.7%)
```

#### Performance Calculation Utilities
```typescript
export const PerformanceUtils = {
  calculateHealthScore: (metrics: {
    schedule: number;
    cost: number; 
    scope: number;
    quality: number;
    risk: number;
    satisfaction: number;
  }): number,
  isOverAllocated: (allocatedHours: number, totalCapacity: number, threshold?: number): boolean,
  calculateUtilization: (allocatedHours: number, totalCapacity: number): number
};

// Usage Examples:
const healthScore = PerformanceUtils.calculateHealthScore({
  schedule: 0.95, cost: 1.02, scope: 0.65,
  quality: 0.92, risk: 0.15, satisfaction: 0.88
}); // Returns weighted score 0-100

const overAllocated = PerformanceUtils.isOverAllocated(160, 150, 0.95); // true
```

### 2. Validation Utilities (`src/shared/validation/index.ts`)

#### Business Validation
```typescript
export const ValidationUtils = {
  isValidAmount: (amount: number): boolean,
  isValidPercentage: (value: number): boolean,
  isValidRatio: (ratio: number): boolean,
  isValidDateRange: (startDate: Date, endDate: Date): boolean,
  isValidProjectStatus: (status: string): boolean,
  isWithinThreshold: (actual: number, target: number, thresholdPercent: number): boolean
};
```

#### Error Message Generators
```typescript
export const ErrorMessages = {
  INVALID_AMOUNT: (field: string) => `${field} must be a valid positive number`,
  INVALID_PERCENTAGE: (field: string) => `${field} must be between 0 and 100`,
  THRESHOLD_EXCEEDED: (field: string, threshold: number) => 
    `${field} exceeds acceptable threshold of ${threshold}%`
};
```

#### Business Rule Validators
```typescript
export const BusinessRules = {
  validateProjectBudget: (budget: number, actualCost?: number): ValidationResult,
  validateResourceAllocation: (allocation: number): ValidationResult,
  validateProfitMargin: (revenue: number, costs: number): ValidationResult & { margin: number }
};
```

## Integration Examples

### Before Refactoring (Hard-coded)
```typescript
// Old approach - scattered constants
const dueDate = new Date(invoiceDate.getTime() + 30 * 24 * 60 * 60 * 1000);
const taxAmount = subtotal * 0.08;
const projectId = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
```

### After Refactoring (Centralized)
```typescript
// New approach - centralized utilities
import { DateUtils, FinancialUtils, IdUtils } from '../shared/constants';
import { loadBusinessConfig } from '../utils/business-config';

const config = loadBusinessConfig().project;
const dueDate = DateUtils.getPaymentDueDate(invoiceDate, config.billing.paymentTermsDays);
const taxAmount = FinancialUtils.calculateTax(subtotal, config.billing.standardTaxRate);
const projectId = IdUtils.generateProjectId();
```

## Benefits

### 1. **Consistency**
- Standardized ID generation patterns across all modules
- Consistent date calculations using shared constants
- Uniform financial calculations with proper rounding

### 2. **Maintainability**
- Single source of truth for common calculations
- Easy to update calculation logic in one place
- Reduced code duplication across 20+ service files

### 3. **Testability**
- Isolated utility functions are easy to unit test
- Configurable values can be easily mocked for testing
- Clear separation between business logic and calculations

### 4. **Type Safety**
- Full TypeScript support with proper typing
- Compile-time validation of utility usage
- IDE autocomplete for all utility functions

## Migration Guide

### For New Services
Always import and use the shared utilities:
```typescript
import { DateUtils, FinancialUtils, IdUtils, PerformanceUtils } from '../../shared/constants';
import { ValidationUtils, BusinessRules } from '../../shared/validation';
```

### For Existing Services
Replace hard-coded patterns with utility calls:
- Replace `new Date(Date.now() + days * 24 * 60 * 60 * 1000)` with `DateUtils.addDays(new Date(), days)`
- Replace `amount * taxRate` with `FinancialUtils.calculateTax(amount, taxRate)`
- Replace manual ID generation with `IdUtils.generate*Id()` methods
- Use `ValidationUtils` for input validation before processing

## Configuration Integration

All utilities work seamlessly with the centralized business configuration system:

```typescript
const config = loadBusinessConfig();

// Use config values with utilities
const dueDate = DateUtils.getPaymentDueDate(invoiceDate, config.project.billing.paymentTermsDays);
const tax = FinancialUtils.calculateTax(amount, config.project.billing.standardTaxRate);
const healthScore = PerformanceUtils.calculateHealthScore(config.project.healthScoreThresholds);
```