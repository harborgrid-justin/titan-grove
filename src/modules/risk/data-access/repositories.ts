import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';

export class RiskRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `risk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const riskRepository = new RiskRepository();
