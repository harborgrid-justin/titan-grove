import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';

export class SupplyChainPlanRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `scp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class DemandForecastRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `df_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class SupplyPlanRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `sp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export default instances
export const supplyChainPlanRepository = new SupplyChainPlanRepository();
export const demandForecastRepository = new DemandForecastRepository();
export const supplyPlanRepository = new SupplyPlanRepository();
