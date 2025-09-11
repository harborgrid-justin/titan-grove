/**
 * Service Factory Functions
 * Factory pattern for creating configurable service instances
 */

import { BusinessConfig } from '../types/business-config';
import { loadBusinessConfig } from './business-config';
import { QuoteService } from '../modules/orders/business-logic/quote-management/quote-service';
import { OrderPromisingService } from '../modules/orders/business-logic/order-promising/order-promising-service';

// ================================
// WAREHOUSE MANAGEMENT FACTORY
// ================================

/**
 * Creates a configurable warehouse management service instance
 */
export function createWarehouseManagementService(config?: BusinessConfig) {
  const businessConfig = config || loadBusinessConfig();
  
  // Return configuration object that can be used by the service
  return {
    config: businessConfig.warehouseManagement,
    
    // Factory methods for creating configured default values
    getDefaultOperatingHours: () => ({
      monday: {
        startTime: businessConfig.warehouseManagement.operatingHours.weekday.startTime,
        endTime: businessConfig.warehouseManagement.operatingHours.weekday.endTime,
        timeZone: businessConfig.warehouseManagement.operatingHours.weekday.timeZone
      },
      tuesday: {
        startTime: businessConfig.warehouseManagement.operatingHours.weekday.startTime,
        endTime: businessConfig.warehouseManagement.operatingHours.weekday.endTime,
        timeZone: businessConfig.warehouseManagement.operatingHours.weekday.timeZone
      },
      wednesday: {
        startTime: businessConfig.warehouseManagement.operatingHours.weekday.startTime,
        endTime: businessConfig.warehouseManagement.operatingHours.weekday.endTime,
        timeZone: businessConfig.warehouseManagement.operatingHours.weekday.timeZone
      },
      thursday: {
        startTime: businessConfig.warehouseManagement.operatingHours.weekday.startTime,
        endTime: businessConfig.warehouseManagement.operatingHours.weekday.endTime,
        timeZone: businessConfig.warehouseManagement.operatingHours.weekday.timeZone
      },
      friday: {
        startTime: businessConfig.warehouseManagement.operatingHours.weekday.startTime,
        endTime: businessConfig.warehouseManagement.operatingHours.weekday.endTime,
        timeZone: businessConfig.warehouseManagement.operatingHours.weekday.timeZone
      },
      saturday: {
        startTime: businessConfig.warehouseManagement.operatingHours.saturday.startTime,
        endTime: businessConfig.warehouseManagement.operatingHours.saturday.endTime,
        timeZone: businessConfig.warehouseManagement.operatingHours.saturday.timeZone
      },
      holidays: []
    }),
    
    getDefaultShiftPattern: () => ([
      {
        shiftId: 'day',
        shiftName: 'Day Shift',
        startTime: businessConfig.warehouseManagement.shifts.day.startTime,
        endTime: businessConfig.warehouseManagement.shifts.day.endTime,
        staffCount: businessConfig.warehouseManagement.shifts.day.staffCount
      },
      {
        shiftId: 'evening',
        shiftName: 'Evening Shift',
        startTime: businessConfig.warehouseManagement.shifts.evening.startTime,
        endTime: businessConfig.warehouseManagement.shifts.evening.endTime,
        staffCount: businessConfig.warehouseManagement.shifts.evening.staffCount
      },
      {
        shiftId: 'night',
        shiftName: 'Night Shift',
        startTime: businessConfig.warehouseManagement.shifts.night.startTime,
        endTime: businessConfig.warehouseManagement.shifts.night.endTime,
        staffCount: businessConfig.warehouseManagement.shifts.night.staffCount
      }
    ]),
    
    getDefaultStorageAreaConfig: (_facility: any) => ([
      {
        areaId: 'bulk-1',
        areaName: 'Bulk Storage Area 1',
        areaType: 'BULK',
        dimensions: { 
          length: businessConfig.warehouseManagement.storageAreas.bulk.dimensions.length, 
          width: businessConfig.warehouseManagement.storageAreas.bulk.dimensions.width, 
          height: businessConfig.warehouseManagement.storageAreas.bulk.dimensions.height, 
          unit: 'FT' 
        },
        storageType: 'PALLET',
        totalPositions: businessConfig.warehouseManagement.storageAreas.bulk.totalPositions,
        availablePositions: Math.floor(businessConfig.warehouseManagement.storageAreas.bulk.totalPositions * 0.8),
        temperatureControlled: false,
        humidityControlled: false,
        specialRequirements: [],
        utilizationRate: businessConfig.warehouseManagement.storageAreas.bulk.utilizationRate,
        turnoverRate: businessConfig.warehouseManagement.storageAreas.bulk.turnoverRate,
        status: 'ACTIVE'
      },
      {
        areaId: 'rack-1',
        areaName: 'Selective Rack Area',
        areaType: 'RACK',
        dimensions: { 
          length: businessConfig.warehouseManagement.storageAreas.rack.dimensions.length, 
          width: businessConfig.warehouseManagement.storageAreas.rack.dimensions.width, 
          height: businessConfig.warehouseManagement.storageAreas.rack.dimensions.height, 
          unit: 'FT' 
        },
        storageType: 'CASE',
        totalPositions: businessConfig.warehouseManagement.storageAreas.rack.totalPositions,
        availablePositions: Math.floor(businessConfig.warehouseManagement.storageAreas.rack.totalPositions * 0.75),
        temperatureControlled: false,
        humidityControlled: false,
        specialRequirements: [],
        utilizationRate: businessConfig.warehouseManagement.storageAreas.rack.utilizationRate,
        turnoverRate: businessConfig.warehouseManagement.storageAreas.rack.turnoverRate,
        status: 'ACTIVE'
      }
    ]),
    
    getDefaultDockDoorConfig: () => ({
      count: businessConfig.warehouseManagement.dockDoors.defaultCount,
      height: businessConfig.warehouseManagement.dockDoors.doorHeight,
      width: businessConfig.warehouseManagement.dockDoors.doorWidth,
      levelingDock: businessConfig.warehouseManagement.dockDoors.levelingDockDefault
    })
  };
}

// ================================
// MANUFACTURING INTEGRATION FACTORY
// ================================

/**
 * Creates a configurable manufacturing integration service instance
 */
export function createManufacturingIntegrationService(config?: BusinessConfig) {
  const businessConfig = config || loadBusinessConfig();
  
  return {
    config: businessConfig.manufacturing,
    
    getIntegrationMetrics: () => ({
      dataVolumes: businessConfig.manufacturing.integration.dataVolumes,
      latencies: businessConfig.manufacturing.integration.latencies,
      reliability: businessConfig.manufacturing.integration.reliability,
      migrationValue: businessConfig.manufacturing.integration.migrationValue
    }),
    
    getIndustry40Config: () => businessConfig.manufacturing.industry40,
    
    getSensorLatencies: () => businessConfig.manufacturing.industry40.iot
  };
}

// ================================
// QUOTE MANAGEMENT FACTORY
// ================================

/**
 * Creates a configurable quote management service instance
 */
export function createQuoteManagementService(config?: BusinessConfig) {
  const businessConfig = config || loadBusinessConfig();
  return new QuoteService(businessConfig.quoteManagement);
}

// ================================
// ORDER PROMISING FACTORY
// ================================

/**
 * Creates a configurable order promising service instance
 */
export function createOrderPromisingService(config?: BusinessConfig) {
  const businessConfig = config || loadBusinessConfig();
  return new OrderPromisingService(businessConfig.orderPromising);
}

// ================================
// PROCUREMENT FACTORY
// ================================

/**
 * Creates configuration helpers for procurement services
 */
export function createProcurementServiceConfig(config?: BusinessConfig) {
  const businessConfig = config || loadBusinessConfig();
  
  return {
    config: businessConfig.procurement,
    
    getSupplierScoringThresholds: () => ({
      qualityThreshold: businessConfig.procurement.supplierQualityThreshold,
      deliveryThreshold: businessConfig.procurement.supplierDeliveryThreshold,
      costThreshold: businessConfig.procurement.supplierCostThreshold
    }),
    
    getPurchaseOrderLimits: () => ({
      approvalThreshold: businessConfig.procurement.poApprovalThreshold,
      maxValueWithoutApproval: businessConfig.procurement.maxPoValueWithoutApproval
    }),
    
    getRfqConfiguration: () => ({
      responseTimeoutDays: businessConfig.procurement.rfqResponseTimeoutDays,
      minimumSuppliers: businessConfig.procurement.minSuppliersForRfq
    }),
    
    getContractManagementConfig: () => ({
      renewalNotificationDays: businessConfig.procurement.contractRenewalNotificationDays,
      valueReviewThreshold: businessConfig.procurement.contractValueReviewThreshold
    })
  };
}

// ================================
// PROJECT MANAGEMENT FACTORY
// ================================

/**
 * Creates configurable project management service instances
 */
export function createProjectServices(config?: BusinessConfig) {
  const businessConfig = config || loadBusinessConfig();
  const projectConfig = businessConfig.project;
  
  // Import project services
  const { createProjectBillingService } = require('../modules/project/business-logic/billing/billing-service');
  
  return {
    billing: createProjectBillingService(projectConfig),
    config: projectConfig
  };
}

// Export singleton instances
export const warehouseManagementServiceFactory = createWarehouseManagementService();
export const manufacturingIntegrationServiceFactory = createManufacturingIntegrationService();
export const quoteManagementServiceFactory = createQuoteManagementService();
export const orderPromisingServiceFactory = createOrderPromisingService();
export const procurementServiceConfigFactory = createProcurementServiceConfig();
export const projectServicesFactory = createProjectServices();