# Customer Relationship Management Module

## Overview

The CRM module provides comprehensive customer relationship management including lead tracking, contact management, sales pipeline, and customer analytics.

## Structure

```
crm/
├── business-logic/     # Core business logic
│   ├── customer-management/
│   ├── lead-management/
│   ├── sales-pipeline/
│   └── index.ts
├── data-access/        # Data access layer
│   ├── repositories.ts
│   └── index.ts
├── types.ts           # Module-specific types
├── index.ts           # Module entry point
└── README.md          # This documentation
```

## Key Features

- Customer and contact management
- Lead tracking and conversion
- Sales pipeline management
- Opportunity management
- Customer analytics
- Sales reporting

## Domain Organization

This module is part of the **Customer & Sales Domain** which consolidates:
- Customer relationship management
- Sales operations
- Order management
- Pricing engine

## Usage

```typescript
import { crmManager } from '../modules/crm';

// Create a customer
const customer = await crmManager.createCustomer({
  companyName: 'Acme Corp',
  contactEmail: 'contact@acmecorp.com',
  industry: 'Manufacturing',
  size: 'MEDIUM'
});

// Create a lead
const lead = await crmManager.createLead({
  customerId: customer.id,
  source: 'WEB',
  value: 50000,
  probability: 0.7
});
```

## Business Logic

The CRM module implements sophisticated business logic including:
- Lead scoring algorithms
- Sales forecasting
- Customer segmentation
- Pipeline analytics
- Conversion tracking

See the business-logic directory for detailed implementation.