# Extended Business Configuration Environment Variables

This document lists all the environment variables for the extended business configuration system, including the newly centralized Quote Management, Order Promising, and Procurement services.

## Quote Management Settings (QM_*)

Configure quote management and sales quote calculations:

```bash
# Quote Calculation Settings
QM_DEFAULT_EXPIRATION_DAYS=30                    # Default days until quote expires
QM_SHIPPING_RATE_PER_POUND=5.50                  # Shipping rate per pound
QM_MOCK_WEIGHT_PER_ITEM=2                        # Mock weight per item in pounds

# Approval Thresholds  
QM_APPROVAL_THRESHOLD_AMOUNT=10000                # Dollar amount requiring approval
QM_MAX_DISCOUNT_PERCENT_WITHOUT_APPROVAL=15      # Max discount % without approval

# Tax and Currency
QM_STANDARD_TAX_RATE=0.085                       # Standard tax rate (8.5%)
QM_CURRENCY_CONVERSION_RATE=1.25                 # USD to other currency rate
```

## Order Promising Settings (OP_*)

Configure order promising, ATP (Available to Promise), and delivery scheduling:

```bash
# Lead Time Defaults (in days)
OP_MANUFACTURING_LEAD_TIME=10                     # Manufacturing lead time in days
OP_PROCUREMENT_LEAD_TIME=7                       # Procurement lead time in days  
OP_ITEM_LEAD_TIME=5                              # Standard item lead time in days

# Shipping Times by Method (in days)
OP_STANDARD_SHIPPING_TIME=10                     # Standard/Ground shipping time
OP_EXPRESS_SHIPPING_TIME=7                       # Express shipping time
OP_OVERNIGHT_SHIPPING_TIME=1                     # Overnight shipping time

# Buffer Days by Priority
OP_LOW_PRIORITY_BUFFER_DAYS=3                    # Buffer days for low priority
OP_MEDIUM_PRIORITY_BUFFER_DAYS=2                 # Buffer days for medium priority
OP_HIGH_PRIORITY_BUFFER_DAYS=1                   # Buffer days for high priority

# Confidence Levels
OP_MIN_CONFIDENCE_LEVEL=0.1                      # Minimum confidence level (10%)
OP_MAX_CONFIDENCE_LEVEL=1.0                      # Maximum confidence level (100%)
```

## Procurement Settings (PROC_*)

Configure procurement processes, supplier management, and purchasing workflows:

```bash
# Supplier Scoring Thresholds (0-100 scale)
PROC_SUPPLIER_QUALITY_THRESHOLD=70               # Minimum quality score
PROC_SUPPLIER_DELIVERY_THRESHOLD=80              # Minimum delivery performance
PROC_SUPPLIER_COST_THRESHOLD=75                  # Minimum cost competitiveness

# Purchase Order Limits
PROC_PO_APPROVAL_THRESHOLD=5000                  # Dollar amount requiring PO approval
PROC_MAX_PO_VALUE_WITHOUT_APPROVAL=50000         # Max PO value without approval

# RFQ Configuration  
PROC_RFQ_RESPONSE_TIMEOUT_DAYS=14                # Days to wait for RFQ responses
PROC_MIN_SUPPLIERS_FOR_RFQ=3                     # Minimum suppliers required for RFQ

# Contract Management
PROC_CONTRACT_RENEWAL_NOTIFICATION_DAYS=90       # Contract renewal notification days
PROC_CONTRACT_VALUE_REVIEW_THRESHOLD=100000      # Contract value review threshold
```

## Complete Environment Configuration Examples

### Development Environment (.env.development)
```bash
# Quote Management - Conservative Development Settings
QM_DEFAULT_EXPIRATION_DAYS=30
QM_SHIPPING_RATE_PER_POUND=5.50
QM_APPROVAL_THRESHOLD_AMOUNT=10000
QM_MAX_DISCOUNT_PERCENT_WITHOUT_APPROVAL=15
QM_STANDARD_TAX_RATE=0.085
QM_CURRENCY_CONVERSION_RATE=1.25

# Order Promising - Standard Development Lead Times
OP_MANUFACTURING_LEAD_TIME=10
OP_PROCUREMENT_LEAD_TIME=7
OP_ITEM_LEAD_TIME=5
OP_STANDARD_SHIPPING_TIME=10
OP_EXPRESS_SHIPPING_TIME=7
OP_OVERNIGHT_SHIPPING_TIME=1
OP_LOW_PRIORITY_BUFFER_DAYS=3
OP_MEDIUM_PRIORITY_BUFFER_DAYS=2
OP_HIGH_PRIORITY_BUFFER_DAYS=1
OP_MIN_CONFIDENCE_LEVEL=0.1
OP_MAX_CONFIDENCE_LEVEL=1.0

# Procurement - Relaxed Development Thresholds
PROC_SUPPLIER_QUALITY_THRESHOLD=70
PROC_SUPPLIER_DELIVERY_THRESHOLD=80
PROC_SUPPLIER_COST_THRESHOLD=75
PROC_PO_APPROVAL_THRESHOLD=5000
PROC_MAX_PO_VALUE_WITHOUT_APPROVAL=50000
PROC_RFQ_RESPONSE_TIMEOUT_DAYS=14
PROC_MIN_SUPPLIERS_FOR_RFQ=3
PROC_CONTRACT_RENEWAL_NOTIFICATION_DAYS=90
PROC_CONTRACT_VALUE_REVIEW_THRESHOLD=100000
```

### Production Environment (.env.production)
```bash
# Quote Management - Production Optimized Settings
QM_DEFAULT_EXPIRATION_DAYS=60
QM_SHIPPING_RATE_PER_POUND=6.25
QM_APPROVAL_THRESHOLD_AMOUNT=15000
QM_MAX_DISCOUNT_PERCENT_WITHOUT_APPROVAL=10
QM_STANDARD_TAX_RATE=0.0875
QM_CURRENCY_CONVERSION_RATE=1.15

# Order Promising - Optimized Production Lead Times  
OP_MANUFACTURING_LEAD_TIME=8
OP_PROCUREMENT_LEAD_TIME=5
OP_ITEM_LEAD_TIME=3
OP_STANDARD_SHIPPING_TIME=8
OP_EXPRESS_SHIPPING_TIME=5
OP_OVERNIGHT_SHIPPING_TIME=1
OP_LOW_PRIORITY_BUFFER_DAYS=2
OP_MEDIUM_PRIORITY_BUFFER_DAYS=1
OP_HIGH_PRIORITY_BUFFER_DAYS=0
OP_MIN_CONFIDENCE_LEVEL=0.15
OP_MAX_CONFIDENCE_LEVEL=0.98

# Procurement - Strict Production Standards
PROC_SUPPLIER_QUALITY_THRESHOLD=85
PROC_SUPPLIER_DELIVERY_THRESHOLD=90
PROC_SUPPLIER_COST_THRESHOLD=80
PROC_PO_APPROVAL_THRESHOLD=7500
PROC_MAX_PO_VALUE_WITHOUT_APPROVAL=75000
PROC_RFQ_RESPONSE_TIMEOUT_DAYS=10
PROC_MIN_SUPPLIERS_FOR_RFQ=5
PROC_CONTRACT_RENEWAL_NOTIFICATION_DAYS=120
PROC_CONTRACT_VALUE_REVIEW_THRESHOLD=150000
```

### Docker Configuration
```dockerfile
# Quote Management
ENV QM_DEFAULT_EXPIRATION_DAYS=45
ENV QM_SHIPPING_RATE_PER_POUND=6.00
ENV QM_APPROVAL_THRESHOLD_AMOUNT=12500

# Order Promising
ENV OP_MANUFACTURING_LEAD_TIME=9
ENV OP_PROCUREMENT_LEAD_TIME=6
ENV OP_STANDARD_SHIPPING_TIME=9

# Procurement
ENV PROC_SUPPLIER_QUALITY_THRESHOLD=80
ENV PROC_PO_APPROVAL_THRESHOLD=6000
ENV PROC_RFQ_RESPONSE_TIMEOUT_DAYS=12
```

### Kubernetes ConfigMap
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: titan-grove-business-config
data:
  # Quote Management
  QM_DEFAULT_EXPIRATION_DAYS: "45"
  QM_SHIPPING_RATE_PER_POUND: "6.00"
  QM_APPROVAL_THRESHOLD_AMOUNT: "12500"
  QM_MAX_DISCOUNT_PERCENT_WITHOUT_APPROVAL: "12"
  
  # Order Promising
  OP_MANUFACTURING_LEAD_TIME: "9"
  OP_PROCUREMENT_LEAD_TIME: "6"
  OP_ITEM_LEAD_TIME: "4"
  OP_STANDARD_SHIPPING_TIME: "9"
  
  # Procurement
  PROC_SUPPLIER_QUALITY_THRESHOLD: "80"
  PROC_SUPPLIER_DELIVERY_THRESHOLD: "85"
  PROC_PO_APPROVAL_THRESHOLD: "6000"
  PROC_RFQ_RESPONSE_TIMEOUT_DAYS: "12"
```

## Usage in Code

These environment variables are automatically loaded by the business configuration system:

```typescript
import { loadBusinessConfig } from './utils/business-config';
import { createQuoteManagementService, createOrderPromisingService } from './utils/service-factories';

// Load configuration with environment variable overrides
const config = loadBusinessConfig();

// Use configuration in services
const quoteService = createQuoteManagementService(config);
const orderPromisingService = createOrderPromisingService(config);

// Access specific configuration values
console.log('Quote expiration days:', config.quoteManagement.defaultExpirationDays);
console.log('Manufacturing lead time:', config.orderPromising.manufacturingLeadTime);
console.log('Supplier quality threshold:', config.procurement.supplierQualityThreshold);
```

## Migration from Hard-coded Values

The following hard-coded values have been centralized:

### Quote Management Service
- `5.50` → `QM_SHIPPING_RATE_PER_POUND`
- `10000` → `QM_APPROVAL_THRESHOLD_AMOUNT`  
- `15` → `QM_MAX_DISCOUNT_PERCENT_WITHOUT_APPROVAL`
- `1.25` → `QM_CURRENCY_CONVERSION_RATE`
- `0.08` → `QM_STANDARD_TAX_RATE`
- `30` → `QM_DEFAULT_EXPIRATION_DAYS`

### Order Promising Service
- `10` (manufacturing) → `OP_MANUFACTURING_LEAD_TIME`
- `7` (procurement) → `OP_PROCUREMENT_LEAD_TIME`
- `5` (item) → `OP_ITEM_LEAD_TIME`
- `1,2,5,7` (shipping times) → `OP_*_SHIPPING_TIME`
- `3,2,1` (buffer days) → `OP_*_PRIORITY_BUFFER_DAYS`
- `0.1, 1.0` (confidence) → `OP_MIN/MAX_CONFIDENCE_LEVEL`

### Procurement Services
- Various supplier thresholds → `PROC_SUPPLIER_*_THRESHOLD`
- PO approval limits → `PROC_PO_APPROVAL_THRESHOLD`
- RFQ timeouts → `PROC_RFQ_RESPONSE_TIMEOUT_DAYS`
- Contract notification periods → `PROC_CONTRACT_*`