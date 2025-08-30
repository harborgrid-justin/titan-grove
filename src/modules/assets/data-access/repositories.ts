/**
 * Asset Management Data Access Layer
 * Database operations and data persistence for asset management
 */

import type {
  Asset,
  AssetCategory,
  AssetWarranty,
  AssetMaintenance,
  AssetDepreciation,
  AssetTransfer,
  AssetDisposal,
  AssetAudit,
  AssetDiscrepancy,
  AssetInsurance
} from '../types';

export interface AssetRepository {
  // Asset CRUD operations
  createAsset(asset: Omit<Asset, 'id' | 'createdDate' | 'modifiedDate'>): Promise<Asset>;
  getAssetById(id: string): Promise<Asset | null>;
  updateAsset(id: string, updates: Partial<Asset>): Promise<Asset>;
  deleteAsset(id: string): Promise<void>;
  
  // Asset queries
  getAssetsByCategory(categoryId: string): Promise<Asset[]>;
  getAssetsByLocation(location: string): Promise<Asset[]>;
  getAssetsByDepartment(department: string): Promise<Asset[]>;
  getAssetsByStatus(status: Asset['status']): Promise<Asset[]>;
  searchAssets(query: string): Promise<Asset[]>;
  
  // Depreciation operations
  calculateDepreciation(assetId: string, period: string): Promise<AssetDepreciation>;
  getDepreciationHistory(assetId: string): Promise<AssetDepreciation[]>;
  createDepreciationEntry(depreciation: Omit<AssetDepreciation, 'id'>): Promise<AssetDepreciation>;
}

export interface AssetCategoryRepository {
  createCategory(category: Omit<AssetCategory, 'id'>): Promise<AssetCategory>;
  getCategoryById(id: string): Promise<AssetCategory | null>;
  updateCategory(id: string, updates: Partial<AssetCategory>): Promise<AssetCategory>;
  deleteCategory(id: string): Promise<void>;
  getAllCategories(): Promise<AssetCategory[]>;
  getCategoriesByParent(parentId: string): Promise<AssetCategory[]>;
}

export interface AssetMaintenanceRepository {
  scheduleMaintenance(maintenance: Omit<AssetMaintenance, 'id'>): Promise<AssetMaintenance>;
  getMaintenanceById(id: string): Promise<AssetMaintenance | null>;
  updateMaintenance(id: string, updates: Partial<AssetMaintenance>): Promise<AssetMaintenance>;
  getMaintenanceByAsset(assetId: string): Promise<AssetMaintenance[]>;
  getUpcomingMaintenance(days: number): Promise<AssetMaintenance[]>;
  getOverdueMaintenance(): Promise<AssetMaintenance[]>;
}

export interface AssetTransferRepository {
  createTransfer(transfer: Omit<AssetTransfer, 'id'>): Promise<AssetTransfer>;
  getTransferById(id: string): Promise<AssetTransfer | null>;
  updateTransfer(id: string, updates: Partial<AssetTransfer>): Promise<AssetTransfer>;
  getTransfersByAsset(assetId: string): Promise<AssetTransfer[]>;
  getPendingTransfers(): Promise<AssetTransfer[]>;
}

export interface AssetAuditRepository {
  createAudit(audit: Omit<AssetAudit, 'id'>): Promise<AssetAudit>;
  getAuditById(id: string): Promise<AssetAudit | null>;
  updateAudit(id: string, updates: Partial<AssetAudit>): Promise<AssetAudit>;
  getAuditsByLocation(location: string): Promise<AssetAudit[]>;
  addDiscrepancy(auditId: string, discrepancy: AssetDiscrepancy): Promise<void>;
  resolveDiscrepancy(auditId: string, assetId: string, resolution: string): Promise<void>;
}

// Default implementations using mock data
export class MockAssetRepository implements AssetRepository {
  private assets: Asset[] = [];

  async createAsset(asset: Omit<Asset, 'id' | 'createdDate' | 'modifiedDate'>): Promise<Asset> {
    const newAsset: Asset = {
      ...asset,
      id: `asset_${Date.now()}`,
      createdDate: new Date(),
      modifiedDate: new Date()
    };
    this.assets.push(newAsset);
    return newAsset;
  }

  async getAssetById(id: string): Promise<Asset | null> {
    return this.assets.find(asset => asset.id === id) || null;
  }

  async updateAsset(id: string, updates: Partial<Asset>): Promise<Asset> {
    const assetIndex = this.assets.findIndex(asset => asset.id === id);
    if (assetIndex === -1) {
      throw new Error(`Asset with id ${id} not found`);
    }
    
    this.assets[assetIndex] = {
      ...this.assets[assetIndex],
      ...updates,
      modifiedDate: new Date()
    };
    
    return this.assets[assetIndex];
  }

  async deleteAsset(id: string): Promise<void> {
    const assetIndex = this.assets.findIndex(asset => asset.id === id);
    if (assetIndex === -1) {
      throw new Error(`Asset with id ${id} not found`);
    }
    this.assets.splice(assetIndex, 1);
  }

  async getAssetsByCategory(categoryId: string): Promise<Asset[]> {
    return this.assets.filter(asset => asset.category.id === categoryId);
  }

  async getAssetsByLocation(location: string): Promise<Asset[]> {
    return this.assets.filter(asset => asset.location === location);
  }

  async getAssetsByDepartment(department: string): Promise<Asset[]> {
    return this.assets.filter(asset => asset.department === department);
  }

  async getAssetsByStatus(status: Asset['status']): Promise<Asset[]> {
    return this.assets.filter(asset => asset.status === status);
  }

  async searchAssets(query: string): Promise<Asset[]> {
    const lowerQuery = query.toLowerCase();
    return this.assets.filter(asset => 
      asset.name.toLowerCase().includes(lowerQuery) ||
      asset.assetNumber.toLowerCase().includes(lowerQuery) ||
      asset.description.toLowerCase().includes(lowerQuery)
    );
  }

  async calculateDepreciation(assetId: string, period: string): Promise<AssetDepreciation> {
    const asset = await this.getAssetById(assetId);
    if (!asset) {
      throw new Error(`Asset with id ${assetId} not found`);
    }

    // Simple straight-line depreciation calculation
    const annualDepreciation = (asset.purchasePrice - asset.salvageValue) / asset.usefulLife;
    
    return {
      id: `depreciation_${Date.now()}`,
      assetId,
      year: new Date().getFullYear(),
      period,
      depreciationAmount: annualDepreciation,
      accumulatedDepreciation: annualDepreciation,
      bookValue: asset.currentValue,
      method: asset.depreciationMethod,
      createdDate: new Date()
    };
  }

  async getDepreciationHistory(assetId: string): Promise<AssetDepreciation[]> {
    // Mock implementation - would query depreciation table
    return [];
  }

  async createDepreciationEntry(depreciation: Omit<AssetDepreciation, 'id'>): Promise<AssetDepreciation> {
    const newDepreciation: AssetDepreciation = {
      ...depreciation,
      id: `depreciation_${Date.now()}`
    };
    return newDepreciation;
  }
}

// Repository instances
export const assetRepository = new MockAssetRepository();
export const assetCategoryRepository = {} as AssetCategoryRepository;
export const assetMaintenanceRepository = {} as AssetMaintenanceRepository;
export const assetTransferRepository = {} as AssetTransferRepository;
export const assetAuditRepository = {} as AssetAuditRepository;