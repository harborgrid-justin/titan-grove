/**
 * Order Management Module Types
 * Comprehensive Oracle EBS competitive types and interfaces
 */

// ================================
// CORE ENUMS AND TYPES
// ================================

export enum OrderStatus {
  DRAFT = 'DRAFT',
  ENTERED = 'ENTERED',
  BOOKED = 'BOOKED',
  CONFIRMED = 'CONFIRMED',
  AWAITING_SHIPPING = 'AWAITING_SHIPPING',
  PARTIALLY_SHIPPED = 'PARTIALLY_SHIPPED',
  SHIPPED = 'SHIPPED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD',
}

export enum QuoteStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  CONVERTED = 'CONVERTED',
  CANCELLED = 'CANCELLED',
}

export enum OrderType {
  STANDARD = 'STANDARD',
  RUSH = 'RUSH',
  DROP_SHIP = 'DROP_SHIP',
  BLANKET = 'BLANKET',
  RELEASE = 'RELEASE',
  INTERNAL = 'INTERNAL',
  RMA = 'RMA',
  CREDIT = 'CREDIT',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  CRITICAL = 'CRITICAL',
}

export enum ShipmentStatus {
  PLANNED = 'PLANNED',
  PICKED = 'PICKED',
  PACKED = 'PACKED',
  SHIPPED = 'SHIPPED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  EXCEPTION = 'EXCEPTION',
}

export enum ReturnStatus {
  REQUESTED = 'REQUESTED',
  AUTHORIZED = 'AUTHORIZED',
  RECEIVED = 'RECEIVED',
  INSPECTED = 'INSPECTED',
  CREDIT_ISSUED = 'CREDIT_ISSUED',
  RESTOCKED = 'RESTOCKED',
  DISPOSED = 'DISPOSED',
}

export enum HoldType {
  CREDIT = 'CREDIT',
  PRICING = 'PRICING',
  INVENTORY = 'INVENTORY',
  SHIPPING = 'SHIPPING',
  CUSTOMER = 'CUSTOMER',
  MANUAL = 'MANUAL',
  QUALITY = 'QUALITY',
}

// ================================
// CORE INTERFACES
// ================================

export interface OrderAddress {
  id: string;
  type: 'SHIP_TO' | 'BILL_TO' | 'DELIVER_TO';
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  email?: string;
  contactPerson?: string;
  instructions?: string;
}

export interface OrderLineItem {
  id: string;
  lineNumber: number;
  itemId: string;
  itemCode: string;
  itemDescription: string;
  itemType: 'PRODUCT' | 'SERVICE' | 'KIT' | 'OPTION';
  quantity: number;
  unitOfMeasure: string;
  unitPrice: number;
  listPrice: number;
  discountPercent: number;
  discountAmount: number;
  extendedPrice: number;
  taxAmount: number;
  lineTotal: number;
  requestedDate: Date;
  scheduledShipDate?: Date;
  promisedDate?: Date;
  categoryId?: string;
  warehouseId?: string;
  locationId?: string;
  salesRepId?: string;
  commissionAmount?: number;
  costOfGoodsSold?: number;
  margin?: number;
  configurationId?: string;
  parentLineId?: string;
  lineStatus: OrderStatus;
  lineType: 'REGULAR' | 'RETURN' | 'CREDIT' | 'OPTION' | 'COMPONENT';
  notes?: string;
  customFields?: Record<string, any>;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPoNumber?: string;
  status: OrderStatus;
  orderType: OrderType;
  priority: Priority;
  orderDate: Date;
  requestedDate: Date;
  promisedDate?: Date;
  bookingDate?: Date;
  salesChannelId?: string;
  salesRepId?: string;
  salesRepName?: string;
  territory?: string;
  priceListId?: string;
  currency: string;
  exchangeRate: number;
  paymentTermsId?: string;
  paymentTerms?: string;
  paymentMethodId?: string;
  shippingMethodId?: string;
  shippingMethod?: string;
  freightTerms?: string;
  taxExempt: boolean;
  taxRegistrationNumber?: string;
  sourceSystemId?: string;
  sourceOrderId?: string;
  originalOrderId?: string;
  blanketOrderId?: string;
  contractId?: string;
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  lineItems: OrderLineItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  holds: OrderHold[];
  allocations: OrderAllocation[];
  shipments: Shipment[];
  returns: Return[];
  workflows: OrderWorkflow[];
  notes?: string;
  internalNotes?: string;
  customFields?: Record<string, any>;
  approvals: OrderApproval[];
  creditCheckStatus?: 'PASSED' | 'FAILED' | 'PENDING';
  creditLimit?: number;
  availableCredit?: number;
  createdDate: Date;
  modifiedDate: Date;
  createdBy: string;
  modifiedBy: string;
  version: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  opportunityId?: string;
  status: QuoteStatus;
  quoteType: 'STANDARD' | 'BLANKET' | 'CONTRACT' | 'LEASE';
  priority: Priority;
  quoteDate: Date;
  expirationDate: Date;
  validUntil: Date;
  salesRepId: string;
  salesRepName: string;
  territory?: string;
  priceListId?: string;
  currency: string;
  exchangeRate: number;
  paymentTermsId?: string;
  shippingMethodId?: string;
  taxExempt: boolean;
  sourceSystemId?: string;
  competitorInfo?: CompetitorInfo[];
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  lineItems: QuoteLineItem[];
  alternativeItems: AlternativeItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  approvals: QuoteApproval[];
  workflows: QuoteWorkflow[];
  notes?: string;
  internalNotes?: string;
  termsAndConditions?: string;
  customFields?: Record<string, any>;
  attachments: QuoteAttachment[];
  revisionNumber: number;
  parentQuoteId?: string;
  convertedOrderId?: string;
  conversionDate?: Date;
  winProbability?: number;
  estimatedCloseDate?: Date;
  lostReason?: string;
  createdDate: Date;
  modifiedDate: Date;
  createdBy: string;
  modifiedBy: string;
}

export interface QuoteLineItem {
  id: string;
  lineNumber: number;
  itemId: string;
  itemCode: string;
  itemDescription: string;
  itemType: 'PRODUCT' | 'SERVICE' | 'KIT' | 'OPTION';
  quantity: number;
  unitOfMeasure: string;
  listPrice: number;
  unitPrice: number;
  discountPercent: number;
  discountAmount: number;
  extendedPrice: number;
  margin: number;
  marginPercent: number;
  costOfGoodsSold?: number;
  requestedDate?: Date;
  availabilityDate?: Date;
  leadTime?: number;
  categoryId?: string;
  warehouseId?: string;
  salesRepId?: string;
  commissionAmount?: number;
  configurationId?: string;
  parentLineId?: string;
  lineType: 'REGULAR' | 'OPTION' | 'COMPONENT' | 'ALTERNATIVE';
  notes?: string;
  customFields?: Record<string, any>;
}

export interface OrderAllocation {
  id: string;
  orderId: string;
  lineItemId: string;
  itemId: string;
  warehouseId: string;
  locationId?: string;
  requestedQuantity: number;
  allocatedQuantity: number;
  reservedQuantity: number;
  backorderedQuantity: number;
  allocationDate: Date;
  expirationDate?: Date;
  priority: Priority;
  allocationRule: string;
  lotNumber?: string;
  serialNumber?: string;
  status: 'PENDING' | 'ALLOCATED' | 'RESERVED' | 'EXPIRED' | 'CANCELLED';
  createdDate: Date;
  createdBy: string;
}

export interface Shipment {
  id: string;
  shipmentNumber: string;
  orderId: string;
  status: ShipmentStatus;
  shipmentType: 'STANDARD' | 'PARTIAL' | 'SPLIT' | 'CONSOLIDATED';
  warehouseId: string;
  carrierId?: string;
  carrierName?: string;
  carrierAccountId?: string;
  shippingMethod: string;
  serviceLevel?: string;
  trackingNumber?: string;
  billOfLading?: string;
  freightBill?: string;
  plannedShipDate: Date;
  actualShipDate?: Date;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  shippingAddress: OrderAddress;
  packageDetails: PackageDetail[];
  lineItems: ShipmentLineItem[];
  totalWeight: number;
  totalVolume: number;
  shippingCost: number;
  insuredValue?: number;
  insuredAmount?: number;
  hazardousMaterial: boolean;
  specialInstructions?: string;
  deliverySignature?: string;
  proofOfDelivery?: string;
  customFields?: Record<string, any>;
  createdDate: Date;
  modifiedDate: Date;
  createdBy: string;
  modifiedBy: string;
}

export interface PackageDetail {
  packageNumber: string;
  packageType: 'BOX' | 'ENVELOPE' | 'PALLET' | 'CRATE' | 'TUBE' | 'BAG';
  weight: number;
  weightUnit: 'LBS' | 'KG' | 'OZ' | 'GRAMS';
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: 'IN' | 'CM' | 'FT' | 'M';
  };
  items: PackageItem[];
  trackingNumber?: string;
  insuredValue?: number;
  specialHandling?: string[];
  hazardousClass?: string;
}

export interface PackageItem {
  orderLineItemId: string;
  itemCode: string;
  itemDescription: string;
  quantity: number;
  serialNumbers?: string[];
  batchNumbers?: string[];
  lotNumbers?: string[];
  expirationDates?: Date[];
}

export interface ShipmentLineItem {
  orderLineItemId: string;
  itemId: string;
  itemCode: string;
  shippedQuantity: number;
  unitOfMeasure: string;
  lotNumber?: string;
  serialNumbers?: string[];
  expirationDate?: Date;
  condition?: 'NEW' | 'USED' | 'REFURBISHED' | 'DAMAGED';
}

export interface Return {
  id: string;
  rmaNumber: string;
  orderId?: string;
  shipmentId?: string;
  customerId: string;
  customerName: string;
  status: ReturnStatus;
  returnType: 'DEFECTIVE' | 'WRONG_ITEM' | 'EXCESS' | 'CREDIT_ONLY' | 'WARRANTY' | 'GOODWILL';
  reason: string;
  returnDate: Date;
  receivedDate?: Date;
  inspectionDate?: Date;
  dispositionDate?: Date;
  authorizationDate?: Date;
  creditDate?: Date;
  returnAddress: OrderAddress;
  lineItems: ReturnLineItem[];
  totalReturnValue: number;
  restockingFee: number;
  creditAmount: number;
  replacementOrderId?: string;
  dispositionInstructions?: string;
  inspectionNotes?: string;
  customerNotes?: string;
  internalNotes?: string;
  approvals: ReturnApproval[];
  attachments: ReturnAttachment[];
  workflows: ReturnWorkflow[];
  createdDate: Date;
  modifiedDate: Date;
  createdBy: string;
  modifiedBy: string;
}

export interface ReturnLineItem {
  id: string;
  orderLineItemId?: string;
  itemId: string;
  itemCode: string;
  itemDescription: string;
  returnQuantity: number;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  unitOfMeasure: string;
  unitPrice: number;
  returnValue: number;
  restockingFee: number;
  creditAmount: number;
  disposition: 'RESTOCK' | 'REPAIR' | 'REPLACE' | 'SCRAP' | 'RETURN_TO_VENDOR';
  condition: 'NEW' | 'USED' | 'DAMAGED' | 'DEFECTIVE' | 'UNKNOWN';
  defectCode?: string;
  defectDescription?: string;
  lotNumber?: string;
  serialNumbers?: string[];
  expirationDate?: Date;
  notes?: string;
}

export interface BackOrder {
  id: string;
  orderId: string;
  lineItemId: string;
  customerId: string;
  itemId: string;
  itemCode: string;
  backorderedQuantity: number;
  originalQuantity: number;
  allocatedQuantity: number;
  priority: Priority;
  requestedDate: Date;
  promisedDate?: Date;
  estimatedAvailableDate?: Date;
  backorderDate: Date;
  reason: 'INSUFFICIENT_INVENTORY' | 'ALLOCATION_RULE' | 'HOLD' | 'QUALITY_ISSUE';
  warehouseId?: string;
  supplierOrderId?: string;
  purchaseOrderId?: string;
  status: 'ACTIVE' | 'PARTIALLY_FULFILLED' | 'FULFILLED' | 'CANCELLED' | 'EXPIRED';
  fulfillmentRule: 'FIFO' | 'LIFO' | 'PRIORITY' | 'CUSTOMER_CLASS';
  substitutionAllowed: boolean;
  alternativeItems: string[];
  customerNotified: boolean;
  notificationDate?: Date;
  notes?: string;
  createdDate: Date;
  modifiedDate: Date;
  createdBy: string;
  modifiedBy: string;
}

export interface BackOrderLineItem {
  backOrderId: string;
  lineNumber: number;
  itemId: string;
  quantity: number;
  unitOfMeasure: string;
  unitPrice: number;
  priority: Priority;
  requestedDate: Date;
  promisedDate?: Date;
  status: 'PENDING' | 'ALLOCATED' | 'SHIPPED' | 'CANCELLED';
}

// ================================
// SUPPORTING INTERFACES
// ================================

export interface CompetitorInfo {
  id: string;
  competitorName: string;
  competitorPrice?: number;
  competitorProduct?: string;
  winProbability?: number;
  strengths?: string[];
  weaknesses?: string[];
  strategy?: string;
  notes?: string;
}

export interface AlternativeItem {
  id: string;
  quoteLineItemId: string;
  itemId: string;
  itemCode: string;
  itemDescription: string;
  quantity: number;
  unitPrice: number;
  extendedPrice: number;
  reason: 'SUBSTITUTE' | 'UPGRADE' | 'DOWNGRADE' | 'ALTERNATIVE';
  availability: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE';
  leadTime?: number;
  notes?: string;
}

export interface OrderHold {
  id: string;
  orderId: string;
  holdType: HoldType;
  reason: string;
  description?: string;
  appliedDate: Date;
  appliedBy: string;
  releasedDate?: Date;
  releasedBy?: string;
  status: 'ACTIVE' | 'RELEASED' | 'EXPIRED';
  priority: Priority;
  escalationDate?: Date;
  autoReleaseDate?: Date;
  customFields?: Record<string, any>;
}

export interface OrderApproval {
  id: string;
  orderId: string;
  approvalType: 'PRICING' | 'CREDIT' | 'DISCOUNT' | 'TERMS' | 'SPECIAL_ORDER' | 'MANAGER';
  approvalLevel: number;
  requiredApprover: string;
  actualApprover?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  requestDate: Date;
  responseDate?: Date;
  reason?: string;
  comments?: string;
  escalationDate?: Date;
  delegatedTo?: string;
}

export interface QuoteApproval {
  id: string;
  quoteId: string;
  approvalType: 'PRICING' | 'DISCOUNT' | 'TERMS' | 'MANAGER' | 'LEGAL';
  approvalLevel: 'SALES_REP' | 'SALES_MANAGER' | 'DIRECTOR' | 'VP_SALES' | 'EXECUTIVE';
  approverId: string;
  approverName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DELEGATED';
  requestDate: Date;
  responseDate?: Date;
  reason?: string;
  comments?: string;
  sequenceNumber: number;
  isRequired: boolean;
}

export interface ReturnApproval {
  id: string;
  returnId: string;
  approvalType: 'CREDIT' | 'RESTOCKING_FEE' | 'DISPOSAL' | 'MANAGER';
  approverId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestDate: Date;
  responseDate?: Date;
  reason?: string;
  comments?: string;
}

// ================================
// WORKFLOW AND PROCESS INTERFACES
// ================================

export interface OrderWorkflow {
  id: string;
  orderId: string;
  workflowType: 'ORDER_PROCESSING' | 'APPROVAL' | 'FULFILLMENT' | 'SHIPPING' | 'BILLING';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ERROR' | 'CANCELLED';
  currentStep: string;
  totalSteps: number;
  completedSteps: number;
  assignedTo?: string;
  startDate: Date;
  endDate?: Date;
  dueDate?: Date;
  priority: Priority;
  steps: WorkflowStep[];
  variables?: Record<string, any>;
  errorMessage?: string;
  createdDate: Date;
  modifiedDate: Date;
}

export interface QuoteWorkflow {
  id: string;
  quoteId: string;
  workflowType: 'QUOTE_APPROVAL' | 'PRICING_REVIEW' | 'LEGAL_REVIEW' | 'MANAGEMENT_REVIEW';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ERROR' | 'CANCELLED';
  currentStep: string;
  assignedTo?: string;
  startDate: Date;
  endDate?: Date;
  steps: WorkflowStep[];
}

export interface ReturnWorkflow {
  id: string;
  returnId: string;
  workflowType: 'RMA_PROCESSING' | 'INSPECTION' | 'DISPOSITION' | 'CREDIT_PROCESSING';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ERROR' | 'CANCELLED';
  currentStep: string;
  assignedTo?: string;
  startDate: Date;
  endDate?: Date;
  steps: WorkflowStep[];
}

export interface WorkflowStep {
  stepId: string;
  stepName: string;
  stepType: 'MANUAL' | 'AUTOMATIC' | 'APPROVAL' | 'VALIDATION' | 'INTEGRATION';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED' | 'ERROR';
  assignedTo?: string;
  startDate?: Date;
  endDate?: Date;
  duration?: number;
  instructions?: string;
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
  errorMessage?: string;
  notes?: string;
}

// ================================
// ATTACHMENT INTERFACES
// ================================

export interface QuoteAttachment {
  id: string;
  quoteId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  description?: string;
  category: 'SPECIFICATION' | 'DRAWING' | 'CERTIFICATE' | 'TERMS' | 'OTHER';
  uploadedBy: string;
  uploadedDate: Date;
}

export interface ReturnAttachment {
  id: string;
  returnId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  description?: string;
  category: 'PHOTO' | 'INSPECTION_REPORT' | 'AUTHORIZATION' | 'RECEIPT' | 'OTHER';
  uploadedBy: string;
  uploadedDate: Date;
}

// ================================
// PRICING AND CONFIGURATION
// ================================

export interface PricingRule {
  id: string;
  name: string;
  description: string;
  ruleType: 'DISCOUNT' | 'SURCHARGE' | 'FIXED_PRICE' | 'FORMULA';
  conditions: PricingCondition[];
  actions: PricingAction[];
  priority: number;
  effectiveDate: Date;
  expirationDate?: Date;
  isActive: boolean;
  customFields?: Record<string, any>;
}

export interface PricingCondition {
  field: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'IN' | 'NOT_IN' | 'CONTAINS';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface PricingAction {
  actionType: 'SET_PRICE' | 'ADD_DISCOUNT' | 'ADD_SURCHARGE' | 'SET_MARGIN';
  value: number;
  valueType: 'AMOUNT' | 'PERCENTAGE';
  applyTo: 'UNIT_PRICE' | 'EXTENDED_PRICE' | 'ORDER_TOTAL';
}

export interface ProductConfiguration {
  id: string;
  baseItemId: string;
  configurationName: string;
  selectedOptions: ConfigurationOption[];
  totalPrice: number;
  totalCost: number;
  leadTime: number;
  validity: Date;
  rules: ConfigurationRule[];
  bomId?: string;
  routingId?: string;
}

export interface ConfigurationOption {
  optionId: string;
  optionName: string;
  optionValue: string;
  quantity: number;
  unitPrice: number;
  extendedPrice: number;
  isRequired: boolean;
  dependentOptions?: string[];
  conflictingOptions?: string[];
}

export interface ConfigurationRule {
  id: string;
  ruleType: 'REQUIRED' | 'EXCLUDED' | 'DEPENDENT' | 'PRICING';
  conditions: any[];
  actions: any[];
  errorMessage?: string;
}

// ================================
// REPORTING AND ANALYTICS
// ================================

export interface OrderMetrics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  orderFulfillmentRate: number;
  averageFulfillmentTime: number;
  returnRate: number;
  customerSatisfactionScore?: number;
  onTimeDeliveryRate: number;
  orderAccuracyRate: number;
  backOrderRate: number;
  periodComparison?: {
    ordersGrowth: number;
    revenueGrowth: number;
    fulfillmentImprovement: number;
  };
}

export interface QuoteMetrics {
  totalQuotes: number;
  totalQuoteValue: number;
  conversionRate: number;
  averageQuoteValue: number;
  averageQuoteToCloseTime: number;
  winRate: number;
  topLossReasons: Array<{
    reason: string;
    count: number;
    percentage: number;
  }>;
}

// ================================
// INTEGRATION INTERFACES
// ================================

export interface ERPIntegrationData {
  systemId: string;
  transactionId: string;
  transactionType: 'ORDER' | 'QUOTE' | 'SHIPMENT' | 'INVOICE' | 'RETURN';
  payload: any;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'ERROR';
  errorMessage?: string;
  retryCount: number;
  maxRetries: number;
  createdDate: Date;
  processedDate?: Date;
}

export interface InventoryIntegration {
  itemId: string;
  warehouseId: string;
  availableQuantity: number;
  reservedQuantity: number;
  onOrderQuantity: number;
  allocatedQuantity: number;
  lastUpdated: Date;
}

export interface FinancialIntegration {
  transactionType: 'INVOICE' | 'CREDIT' | 'PAYMENT' | 'RECEIVABLE';
  referenceId: string;
  amount: number;
  currency: string;
  accountingDate: Date;
  glAccount?: string;
  costCenter?: string;
  project?: string;
  status: 'PENDING' | 'POSTED' | 'ERROR';
}

// ================================
// LEGACY COMPATIBILITY
// ================================

export interface OrdersEntity {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'COMPLETED';
  createdDate: Date;
  modifiedDate: Date;
  createdBy: string;
  modifiedBy: string;
}
