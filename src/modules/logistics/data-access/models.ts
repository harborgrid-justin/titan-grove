/**
 * Logistics Data Models
 * Comprehensive data models for logistics management with Oracle EBS competitive features
 */

// Base model interface
export interface BaseModel {
  id: string;
  createdDate: Date;
  lastUpdated: Date;
  version: number;
  status: string;
}

// Transportation Models
export interface TransportationOrderModel extends BaseModel {
  orderNumber: string;
  orderType: string;
  priority: string;
  originLocationId: string;
  destinationLocationId: string;
  scheduledPickupDate: Date;
  scheduledDeliveryDate: Date;
  actualPickupDate?: Date;
  actualDeliveryDate?: Date;
  assignedCarrierId?: string;
  totalWeight: number;
  totalVolume: number;
  totalValue: number;
  estimatedCost: number;
  actualCost?: number;
}

export interface CarrierModel extends BaseModel {
  name: string;
  code: string;
  carrierType: string;
  isActive: boolean;
  accountNumber?: string;
  contractRates: boolean;
  operatingRegions: string[];
  performanceRating: number;
}

// Warehouse Models
export interface WarehouseFacilityModel extends BaseModel {
  facilityName: string;
  facilityCode: string;
  facilityType: string;
  locationId: string;
  totalSquareFootage: number;
  throughputCapacity: number;
  accuracyRate: number;
  utilizationRate: number;
  totalStaff: number;
}

export interface WarehouseOperationModel extends BaseModel {
  operationType: string;
  warehouseId: string;
  orderId?: string;
  priority: string;
  assignedWorker?: string;
  scheduledStartTime: Date;
  scheduledEndTime: Date;
  actualStartTime?: Date;
  actualEndTime?: Date;
  expectedDuration: number;
  actualDuration?: number;
  accuracyRate?: number;
}

// Route Optimization Models
export interface RouteOptimizationRequestModel extends BaseModel {
  optimizationType: string;
  depotLocationId: string;
  totalVehicles: number;
  totalStops: number;
  solutionTime?: number;
  improvementPercent?: number;
  qualityScore?: number;
  convergenceAchieved: boolean;
}

export interface OptimizedRouteModel extends BaseModel {
  requestId: string;
  vehicleId: string;
  totalDistance: number;
  totalTime: number;
  totalCost: number;
  utilizationRate: number;
  isFeasible: boolean;
}

// Freight Models
export interface FreightShipmentModel extends BaseModel {
  shipmentNumber: string;
  shipmentType: string;
  originLocationId: string;
  destinationLocationId: string;
  assignedCarrierId: string;
  totalWeight: number;
  totalValue: number;
  pieces: number;
  pickupDate: Date;
  deliveryDate: Date;
  proNumber: string;
  totalCost: number;
}

// Location Model
export interface LocationModel extends BaseModel {
  name?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  locationType: string;
  timeZone: string;
}

// Performance Metrics Models
export interface LogisticsKPIModel extends BaseModel {
  kpiName: string;
  kpiCategory: string;
  description: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  trend: string;
  calculationMethod: string;
  updateFrequency: string;
  dataSource: string;
  lastCalculated: Date;
}

// Export all models
export {
  TransportationOrderModel,
  CarrierModel,
  WarehouseFacilityModel,
  WarehouseOperationModel,
  RouteOptimizationRequestModel,
  OptimizedRouteModel,
  FreightShipmentModel,
  LocationModel,
  LogisticsKPIModel
};