/**
 * Enterprise Asset Management Module
 * Oracle Enterprise Asset Management competitive implementation
 * 
 * Provides comprehensive asset management capabilities including:
 * - Asset lifecycle management and tracking
 * - Preventive and predictive maintenance
 * - Work order management and scheduling
 * - Asset performance monitoring
 * - Maintenance cost optimization
 * - Asset reliability and availability
 * - Maintenance inventory management
 */

export * from './business-logic/asset-management-service';
export * from './types';

// Core asset management functionality
export { AssetManagementService, assetManagementService } from './business-logic/asset-management-service';

// Types
export type {
  Asset,
  AssetHierarchy,
  MaintenanceSchedule,
  WorkOrder,
  AssetPerformance,
  MaintenancePlan,
  AssetCondition,
  MaintenanceHistory,
  AssetAnalytics,
  PredictiveMaintenance,
  AssetReliability,
  MaintenanceInventory
} from './types';