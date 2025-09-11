import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';

export class EnterpriseAssetRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `ea_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class AssetMaintenanceRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `am_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class AssetWorkOrderRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `awo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export default instances
export const enterpriseAssetRepository = new EnterpriseAssetRepository();
export const assetMaintenanceRepository = new AssetMaintenanceRepository();
export const assetWorkOrderRepository = new AssetWorkOrderRepository();
