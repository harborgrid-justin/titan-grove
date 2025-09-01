import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';

export class ProcurementRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `procurement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const procurementRepository = new ProcurementRepository();
