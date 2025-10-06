# Naming Consistency Guide

## Overview

This document provides guidance on file naming conventions used in the Titan Grove project after the comprehensive naming consistency fix.

## File Naming Convention

### Standard: kebab-case

All TypeScript and JavaScript files in the project should use **kebab-case** naming:
- All lowercase letters
- Words separated by hyphens (-)
- No underscores (_) except in specific cases

### Examples

✅ **Correct:**
```
accounting-api.ts
advanced-manufacturing-api.ts
production-planning-api.ts
user-service.ts
payment-processing.ts
```

❌ **Incorrect:**
```
accounting_api.ts              // underscores
advancedManufacturing-api.ts   // camelCase
ProductionPlanning-api.ts      // PascalCase
advanced_manufacturing-api.ts  // mixed underscore and hyphen
```

## API Files Naming Pattern

All API wrapper files follow this pattern:
```
{module-name}-api.ts
```

Examples:
- `manufacturing-api.ts`
- `human-resources-api.ts`
- `supply-chain-api.ts`
- `customer-relationship-api.ts`

## Import Statements

When importing API modules, the import path should match the file name exactly:

```typescript
// Correct
import { manufacturingApi } from './manufacturing-api';
import { advancedManufacturingApi } from './advanced-manufacturing-api';

// Incorrect
import { manufacturingApi } from './manufacturing_api';
import { advancedManufacturingApi } from './advanced_manufacturing-api';
```

## Module Export Names

While file names use kebab-case, the exported variable names should use camelCase:

```typescript
// File: advanced-manufacturing-api.ts
export const advancedManufacturingApi = {
  // ...
};
```

## Why kebab-case?

1. **Industry Standard**: kebab-case is the standard for TypeScript/JavaScript files
2. **URL-friendly**: Works well when files are served via HTTP
3. **Consistent with npm**: Matches npm package naming conventions
4. **Better Readability**: Easier to read than snake_case or camelCase in file names
5. **Cross-platform**: Works on all operating systems without issues

## Historical Context

Prior to the naming consistency fix (2024), the codebase had:
- 37 files using mixed naming (underscores with hyphens)
- 44 files using pure kebab-case
- 54% naming consistency

After the fix:
- 81 files using pure kebab-case
- 100% naming consistency

## Files Renamed

The following files were renamed from snake_case to kebab-case:

| Old Name | New Name |
|----------|----------|
| `advanced_manufacturing-api.ts` | `advanced-manufacturing-api.ts` |
| `advisory_consulting-api.ts` | `advisory-consulting-api.ts` |
| `algorithmic_trading-api.ts` | `algorithmic-trading-api.ts` |
| `augmented_reality-api.ts` | `augmented-reality-api.ts` |
| `autonomous_systems-api.ts` | `autonomous-systems-api.ts` |
| `business_continuity-api.ts` | `business-continuity-api.ts` |
| `capital_asset-api.ts` | `capital-asset-api.ts` |
| `computer_vision-api.ts` | `computer-vision-api.ts` |
| `corporate_governance-api.ts` | `corporate-governance-api.ts` |
| `credit_risk-api.ts` | `credit-risk-api.ts` |
| `digital_forensics-api.ts` | `digital-forensics-api.ts` |
| `digital_twin-api.ts` | `digital-twin-api.ts` |
| `edge_computing-api.ts` | `edge-computing-api.ts` |
| `enterprise_asset-api.ts` | `enterprise-asset-api.ts` |
| `equipment_cost-api.ts` | `equipment-cost-api.ts` |
| `factory_automation-api.ts` | `factory-automation-api.ts` |
| `field_service-api.ts` | `field-service-api.ts` |
| `international_trade-api.ts` | `international-trade-api.ts` |
| `investment_portfolio-api.ts` | `investment-portfolio-api.ts` |
| `lean_manufacturing-api.ts` | `lean-manufacturing-api.ts` |
| `multi_currency-api.ts` | `multi-currency-api.ts` |
| `neural_networks-api.ts` | `neural-networks-api.ts` |
| `payment_processing-api.ts` | `payment-processing-api.ts` |
| `predictive_analytics-api.ts` | `predictive-analytics-api.ts` |
| `product_lifecycle-api.ts` | `product-lifecycle-api.ts` |
| `production_planning-api.ts` | `production-planning-api.ts` |
| `professional_services-api.ts` | `professional-services-api.ts` |
| `quantum_computing-api.ts` | `quantum-computing-api.ts` |
| `real_estate-api.ts` | `real-estate-api.ts` |
| `regulatory_compliance-api.ts` | `regulatory-compliance-api.ts` |
| `regulatory_reporting-api.ts` | `regulatory-reporting-api.ts` |
| `research_development-api.ts` | `research-development-api.ts` |
| `resource_optimization-api.ts` | `resource-optimization-api.ts` |
| `smart_city-api.ts` | `smart-city-api.ts` |
| `smart_grid-api.ts` | `smart-grid-api.ts` |
| `testing_validation-api.ts` | `testing-validation-api.ts` |
| `yard_management-api.ts` | `yard-management-api.ts` |

## Enforcement

To maintain naming consistency going forward:

1. **Code Review**: Check file names during PR reviews
2. **Linting**: Consider adding ESLint rules for file naming
3. **CI/CD**: Add automated checks in the build pipeline
4. **Documentation**: Keep this guide updated with any new conventions

## Exception Cases

In rare cases, underscores may be used:
- Test files: `*.test.ts` or `*.spec.ts`
- Private/internal files: `_internal-helper.ts`
- Build artifacts: `*.d.ts` files generated by TypeScript

## Questions?

For questions about naming conventions, refer to:
- [CODE_REVIEW_NAMING_FIX_REPORT.md](CODE_REVIEW_NAMING_FIX_REPORT.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)
- TypeScript/JavaScript style guides

---

**Last Updated**: 2024  
**Maintained by**: Development Team
