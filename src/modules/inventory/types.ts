/**
 * Inventory Management Module Types
 * Core interfaces and types for inventory management system
 */

import { Priority } from '../../types/common';

// Core Inventory Types
export interface InventoryItem {
  id: string;
  itemCode: string;
  description: string;
  category: string;
  unitOfMeasure: string;
  standardCost: number;
  averageCost: number;
  lastCost: number;
  status: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';
  trackingMethod: 'STANDARD' | 'SERIALIZED' | 'LOT_BATCH';
  reorderPoint: number;
  maximumStock: number;
  safetyStock: number;
  leadTime: number; // days
  abcClass: 'A' | 'B' | 'C';
  createdDate: Date;
}

export interface StockLevel {
  itemId: string;
  warehouseId: string;
  onHandQuantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  allocatedQuantity: number;
  inTransitQuantity: number;
  backOrderQuantity: number;
  lastCountDate?: Date;
  lastMovementDate?: Date;
}

export interface InventoryTransaction {
  id: string;
  transactionNumber: string;
  type: 'RECEIPT' | 'ISSUE' | 'TRANSFER' | 'ADJUSTMENT' | 'RESERVATION' | 'ALLOCATION';
  itemId: string;
  warehouseId: string;
  quantity: number;
  unitCost?: number;
  referenceDocument?: string;
  reasonCode?: string;
  transactionDate: Date;
  userId: string;
  notes?: string;
}

// Warehouse Management Types
export interface Warehouse {
  id: string;
  warehouseCode: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  type: 'DISTRIBUTION_CENTER' | 'MANUFACTURING' | 'RETAIL' | 'TRANSIT';
  status: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  locations: WarehouseLocation[];
  capacity: number;
  utilizationRate: number;
}

export interface WarehouseLocation {
  locationCode: string;
  description: string;
  zone: string;
  aisle?: string;
  bay?: string;
  level?: string;
  locationType: 'RECEIVING' | 'STORAGE' | 'PICKING' | 'PACKING' | 'SHIPPING';
  capacity: number;
  currentItems: LocationItem[];
}

export interface LocationItem {
  itemId: string;
  quantity: number;
  lotNumber?: string;
  serialNumbers?: string[];
  expirationDate?: Date;
}

// Replenishment Types (from business logic services)
export interface ReplenishmentRule {
  id: string;
  itemId: string;
  warehouseId: string;
  ruleType: 'REORDER_POINT' | 'MIN_MAX' | 'PERIODIC' | 'FORECAST_DRIVEN';
  reorderPoint: number;
  minimumStock: number;
  maximumStock: number;
  economicOrderQuantity: number;
  reviewPeriodDays: number;
  leadTimeDays: number;
  safetyStock: number;
  isActive: boolean;
}

export interface ReplenishmentRecommendation {
  id: string;
  itemId: string;
  itemCode: string;
  itemDescription: string;
  warehouseId: string;
  warehouseName: string;
  currentStock: number;
  projectedStock: number;
  reorderPoint: number;
  suggestedOrderQuantity: number;
  economicOrderQuantity: number;
  priority: Priority;
  reasonCode: string;
  projectedStockoutDate?: Date;
  supplierLeadTime: number;
  estimatedCost: number;
  annualDemand: number;
  demandVariability: number;
  serviceLevel: number;
}

export interface DemandForecastData {
  itemId: string;
  warehouseId: string;
  forecastPeriod: Date;
  forecastQuantity: number;
  actualDemand?: number;
  forecastError?: number;
  trendFactor: number;
  seasonalFactor: number;
  forecastMethod:
    | 'MOVING_AVERAGE'
    | 'EXPONENTIAL_SMOOTHING'
    | 'LINEAR_REGRESSION'
    | 'SEASONAL_DECOMPOSITION';
  confidence: number;
}

export interface InventoryOptimizationResult {
  itemId: string;
  currentPolicy: {
    reorderPoint: number;
    orderQuantity: number;
    safetyStock: number;
  };
  optimizedPolicy: {
    reorderPoint: number;
    orderQuantity: number;
    safetyStock: number;
  };
  projectedImprovements: {
    inventoryReduction: number; // percentage
    serviceLevelImprovement: number; // percentage
    costSavings: number; // annual amount
  };
  riskFactors: string[];
}

// Cycle Counting Types
export interface CycleCountPlan {
  id: string;
  planName: string;
  warehouseId: string;
  countFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  abcClassPriority: {
    classA: number; // counts per year
    classB: number;
    classC: number;
  };
  countMethod: 'LOCATION_BASED' | 'ITEM_BASED' | 'RANDOM_SAMPLING';
  tolerance: {
    percentage: number;
    absoluteValue: number;
  };
  isActive: boolean;
}

export interface CycleCount {
  id: string;
  countNumber: string;
  planId: string;
  warehouseId: string;
  countDate: Date;
  countType: 'SCHEDULED' | 'EXCEPTION' | 'SPECIAL';
  countedItems: CountedItem[];
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  totalVariance: number;
  varianceValue: number;
  adjustmentRequired: boolean;
}

export interface CountedItem {
  itemId: string;
  locationCode: string;
  systemQuantity: number;
  countedQuantity: number;
  variance: number;
  variancePercentage: number;
  withinTolerance: boolean;
  countedBy: string;
  notes?: string;
  serialNumbers?: string[];
  lotNumbers?: string[];
}

export interface CountVariance {
  id: string;
  countId: string;
  itemId: string;
  variance: number;
  varianceValue: number;
  investigationRequired: boolean;
  rootCause?: string;
  correctionAction?: string;
  approvedBy?: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'APPROVED';
}

// Stock Control Types
export interface StockReservation {
  id: string;
  itemId: string;
  warehouseId: string;
  reservedQuantity: number;
  reservationType: 'SALES_ORDER' | 'WORK_ORDER' | 'TRANSFER' | 'ALLOCATION';
  referenceDocument: string;
  expirationDate?: Date;
  status: 'ACTIVE' | 'FULFILLED' | 'CANCELLED' | 'EXPIRED';
  createdBy: string;
  createdDate: Date;
}

export interface StockAllocation {
  id: string;
  itemId: string;
  fromWarehouseId: string;
  toWarehouseId?: string;
  allocatedQuantity: number;
  allocationType: 'PICK' | 'WAVE' | 'BATCH' | 'SINGLE_ORDER';
  referenceDocument: string;
  allocationDate: Date;
  expirationDate?: Date;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'CANCELLED';
  pickedQuantity: number;
  shippedQuantity: number;
}

export interface InventoryMovement {
  id: string;
  itemId: string;
  fromLocationId?: string;
  toLocationId?: string;
  fromWarehouseId?: string;
  toWarehouseId?: string;
  movementType: 'INTERNAL_TRANSFER' | 'WAREHOUSE_TRANSFER' | 'ADJUSTMENT' | 'PICK' | 'PUTAWAY';
  quantity: number;
  movementDate: Date;
  reason: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
  trackingNumber?: string;
  createdBy: string;
  completedBy?: string;
  completedDate?: Date;
}

// Lot and Serial Tracking Types
export interface LotNumber {
  id: string;
  lotNumber: string;
  itemId: string;
  warehouseId: string;
  quantity: number;
  manufactureDate?: Date;
  expirationDate?: Date;
  supplierLotNumber?: string;
  qualityStatus: 'APPROVED' | 'HOLD' | 'REJECTED';
  notes?: string;
  createdDate: Date;
}

export interface SerialNumber {
  id: string;
  serialNumber: string;
  itemId: string;
  warehouseId: string;
  locationCode?: string;
  status: 'AVAILABLE' | 'RESERVED' | 'SHIPPED' | 'RETURNED' | 'SCRAPPED';
  manufactureDate?: Date;
  warrantyExpirationDate?: Date;
  lastTransactionId?: string;
  currentOwner?: string;
  createdDate: Date;
}

export interface TraceabilityRecord {
  id: string;
  serialNumber?: string;
  lotNumber?: string;
  itemId: string;
  transactionType: 'RECEIPT' | 'SHIPMENT' | 'TRANSFER' | 'RETURN' | 'SCRAP';
  fromLocation?: string;
  toLocation?: string;
  documentReference?: string;
  timestamp: Date;
  userId: string;
  notes?: string;
}

// Analytics and Reporting Types
export interface InventoryAnalytics {
  totalInventoryValue: number;
  totalOnHandQuantity: number;
  averageInventoryTurns: number;
  daysOfInventoryOnHand: number;
  inventoryAccuracy: number;
  fillRate: number;
  stockoutRate: number;
  inventoryByClass: {
    classA: { items: number; value: number; percentage: number };
    classB: { items: number; value: number; percentage: number };
    classC: { items: number; value: number; percentage: number };
  };
  slowMovingItems: number;
  excessInventory: number;
  obsoleteInventory: number;
}

export interface InventoryKPI {
  metric: string;
  currentValue: number;
  targetValue: number;
  previousPeriodValue: number;
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  status: 'ON_TARGET' | 'WARNING' | 'CRITICAL';
  unit: string;
  lastUpdated: Date;
}

export interface InventoryReport {
  id: string;
  reportType:
    | 'STOCK_STATUS'
    | 'MOVEMENT_HISTORY'
    | 'VARIANCE_ANALYSIS'
    | 'ABC_ANALYSIS'
    | 'AGING_ANALYSIS';
  parameters: Record<string, any>;
  generatedDate: Date;
  generatedBy: string;
  data: any[];
  summary: Record<string, any>;
  filters: Record<string, any>;
}

// Exception Handling Types
export interface InventoryException {
  id: string;
  exceptionType:
    | 'NEGATIVE_STOCK'
    | 'EXCEEDED_MAX_STOCK'
    | 'STOCKOUT'
    | 'DISCREPANCY'
    | 'EXPIRED_LOT';
  itemId: string;
  warehouseId: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  detectedDate: Date;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'IGNORED';
  assignedTo?: string;
  resolution?: string;
  resolvedDate?: Date;
  systemGenerated: boolean;
}

export interface InventoryAlert {
  id: string;
  alertType: 'REORDER_POINT' | 'MAX_STOCK' | 'EXPIRATION_WARNING' | 'SLOW_MOVING' | 'HIGH_VARIANCE';
  itemId: string;
  warehouseId: string;
  message: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  triggerValue: number;
  currentValue: number;
  threshold: number;
  alertDate: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedDate?: Date;
  dismissed: boolean;
}

// Configuration Types
export interface InventoryConfiguration {
  id: string;
  warehouseId: string;
  defaultUnitOfMeasure: string;
  costingMethod: 'FIFO' | 'LIFO' | 'AVERAGE_COST' | 'STANDARD_COST';
  negativesAllowed: boolean;
  autoReorderEnabled: boolean;
  cycleCountFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  varianceTolerance: {
    percentage: number;
    absoluteValue: number;
  };
  serialTrackingRequired: string[]; // item categories
  lotTrackingRequired: string[]; // item categories
  expirationTrackingRequired: string[]; // item categories
  autoAllocateInventory: boolean;
  reservationDuration: number; // hours
  isActive: boolean;
}
