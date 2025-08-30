/**
 * Asset Management Service
 * Business logic for asset lifecycle management
 */

import type { Asset, AssetCategory, AssetTransfer } from '../../types';
import { assetRepository, assetCategoryRepository, assetTransferRepository } from '../../data-access/repositories';

export class AssetManagementService {
  
  async createAsset(assetData: Omit<Asset, 'id' | 'createdDate' | 'modifiedDate'>): Promise<Asset> {
    // Validate asset data
    await this.validateAssetData(assetData);
    
    // Create the asset
    return await assetRepository.createAsset(assetData);
  }

  async updateAsset(assetId: string, updates: Partial<Asset>): Promise<Asset> {
    const existingAsset = await assetRepository.getAssetById(assetId);
    if (!existingAsset) {
      throw new Error(`Asset with ID ${assetId} not found`);
    }

    return await assetRepository.updateAsset(assetId, updates);
  }

  async transferAsset(assetId: string, transferData: Omit<AssetTransfer, 'id' | 'assetId'>): Promise<AssetTransfer> {
    const asset = await assetRepository.getAssetById(assetId);
    if (!asset) {
      throw new Error(`Asset with ID ${assetId} not found`);
    }

    if (asset.status !== 'ACTIVE') {
      throw new Error(`Asset must be ACTIVE to transfer. Current status: ${asset.status}`);
    }

    // Create transfer record
    const transfer = await assetTransferRepository.createTransfer({
      ...transferData,
      assetId
    });

    // Update asset location and department if transfer is approved
    if (transferData.status === 'APPROVED') {
      await assetRepository.updateAsset(assetId, {
        location: transferData.toLocation,
        department: transferData.toDepartment
      });
    }

    return transfer;
  }

  async disposeAsset(assetId: string, disposalData: any): Promise<void> {
    const asset = await assetRepository.getAssetById(assetId);
    if (!asset) {
      throw new Error(`Asset with ID ${assetId} not found`);
    }

    // Update asset status to disposed
    await assetRepository.updateAsset(assetId, {
      status: 'DISPOSED'
    });

    // Create disposal record (would use disposalRepository)
    console.log(`Asset ${assetId} disposed:`, disposalData);
  }

  async searchAssets(searchCriteria: {
    query?: string;
    category?: string;
    location?: string;
    department?: string;
    status?: Asset['status'];
  }): Promise<Asset[]> {
    let results: Asset[] = [];

    if (searchCriteria.query) {
      results = await assetRepository.searchAssets(searchCriteria.query);
    } else {
      // Start with all assets and filter
      results = await this.getAllAssets();
    }

    // Apply additional filters
    if (searchCriteria.category) {
      results = results.filter(asset => asset.category.id === searchCriteria.category);
    }

    if (searchCriteria.location) {
      results = results.filter(asset => asset.location === searchCriteria.location);
    }

    if (searchCriteria.department) {
      results = results.filter(asset => asset.department === searchCriteria.department);
    }

    if (searchCriteria.status) {
      results = results.filter(asset => asset.status === searchCriteria.status);
    }

    return results;
  }

  async getAssetById(assetId: string): Promise<Asset | null> {
    return await assetRepository.getAssetById(assetId);
  }

  async getAllAssets(): Promise<Asset[]> {
    // This is a simplified implementation - would typically have pagination
    return [];
  }

  async getAssetsByLocation(location: string): Promise<Asset[]> {
    return await assetRepository.getAssetsByLocation(location);
  }

  async getAssetsByDepartment(department: string): Promise<Asset[]> {
    return await assetRepository.getAssetsByDepartment(department);
  }

  async getAssetUtilization(assetId: string): Promise<any> {
    const asset = await assetRepository.getAssetById(assetId);
    if (!asset) {
      throw new Error(`Asset with ID ${assetId} not found`);
    }

    // Calculate utilization metrics
    const currentAge = new Date().getFullYear() - asset.purchaseDate.getFullYear();
    const utilizationPercentage = Math.min((currentAge / asset.usefulLife) * 100, 100);

    return {
      assetId,
      currentAge,
      usefulLife: asset.usefulLife,
      utilizationPercentage,
      remainingLife: Math.max(asset.usefulLife - currentAge, 0),
      currentValue: asset.currentValue,
      originalCost: asset.purchasePrice
    };
  }

  private async validateAssetData(assetData: Omit<Asset, 'id' | 'createdDate' | 'modifiedDate'>): Promise<void> {
    if (!assetData.name || assetData.name.trim() === '') {
      throw new Error('Asset name is required');
    }

    if (!assetData.assetNumber || assetData.assetNumber.trim() === '') {
      throw new Error('Asset number is required');
    }

    if (assetData.purchasePrice <= 0) {
      throw new Error('Purchase price must be greater than 0');
    }

    if (assetData.usefulLife <= 0) {
      throw new Error('Useful life must be greater than 0');
    }

    if (assetData.salvageValue < 0) {
      throw new Error('Salvage value cannot be negative');
    }
  }
}

export const assetManagementService = new AssetManagementService();