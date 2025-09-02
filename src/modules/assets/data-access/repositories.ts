/**
 * Assets Data Access Layer
 * Repository implementations for asset management
 */

import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';

/**
 * Asset Repository
 * Handles CRUD operations for assets
 */
export class AssetRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Asset-specific methods that match service expectations
  async createAsset(assetData: any) {
    return await this.create(assetData);
  }

  async getAssetById(id: string) {
    return await this.findById(id);
  }

  async updateAsset(id: string, updates: any) {
    return await this.update(id, updates);
  }

  async searchAssets(criteria: any) {
    // Basic search implementation
    return await this.findAll();
  }

  async getAssetsByLocation(locationId: string) {
    return this.items.filter(item => item.locationId === locationId);
  }

  async getAssetsByDepartment(departmentId: string) {
    return this.items.filter(item => item.departmentId === departmentId);
  }
}

/**
 * Asset Category Repository
 */
export class AssetCategoryRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Asset Transfer Repository
 */
export class AssetTransferRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `transfer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Asset-specific method that matches service expectations
  async createTransfer(transferData: any) {
    return await this.create(transferData);
  }
}

/**
 * Asset Location Repository
 */
export class AssetLocationRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `location_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Asset History Repository
 */
export class AssetHistoryRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export default instances
export const assetRepository = new AssetRepository();
export const assetCategoryRepository = new AssetCategoryRepository();
export const assetTransferRepository = new AssetTransferRepository();
export const assetLocationRepository = new AssetLocationRepository();
export const assetHistoryRepository = new AssetHistoryRepository();