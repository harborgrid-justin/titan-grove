import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';

export class FinancialRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `financial_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const financialRepository = new FinancialRepository();
