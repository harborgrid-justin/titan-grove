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

// Export data access layer
export * from './data-access';

// Import shared utilities
import { BaseManager } from '../../shared/utils/base-manager';

// Import business logic services
import { assetManagementService } from './business-logic/asset-management-service';

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

/**
 * Enterprise Asset Manager
 * Provides unified interface for all enterprise asset management operations
 */
export class EnterpriseAssetManager extends BaseManager {
  /**
   * Create a new asset
   */
  async createAsset(assetData: any): Promise<any> {
    const id = this.generateId('ea');
    const asset = {
      id,
      ...assetData,
      ...this.createAuditFields('system')
    };
    this.logAction('createAsset', { id });
    return asset;
  }

  /**
   * Get asset by ID
   */
  async getAsset(assetId: string): Promise<any> {
    this.logAction('getAsset', { assetId });
    return assetManagementService.getAssetPerformanceMetrics(assetId);
  }

  /**
   * Update asset
   */
  async updateAsset(assetId: string, updates: any): Promise<any> {
    this.logAction('updateAsset', { assetId, updates });
    return { id: assetId, ...updates, ...this.updateAuditFields('system') };
  }

  /**
   * Delete asset
   */
  async deleteAsset(assetId: string): Promise<void> {
    this.logAction('deleteAsset', { assetId });
    // Implementation would delete from data store
  }

  /**
   * List assets
   */
  async listAssets(criteria?: any): Promise<any[]> {
    this.logAction('listAssets', criteria);
    return [];
  }

  /**
   * Create maintenance schedule
   */
  async createMaintenanceSchedule(scheduleData: any): Promise<any> {
    return await assetManagementService.createPreventiveMaintenancePlan(scheduleData);
  }

  /**
   * Create work order
   */
  async createWorkOrder(workOrderData: any): Promise<any> {
    return await assetManagementService.createWorkOrder(workOrderData);
  }
}

export const enterpriseAssetManager = new EnterpriseAssetManager();