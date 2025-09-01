import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';

export class HrRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `hr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const hrRepository = new HrRepository();
