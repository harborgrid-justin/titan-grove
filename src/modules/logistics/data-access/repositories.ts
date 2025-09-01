import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';

export class LogisticsRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `logistics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const logisticsRepository = new LogisticsRepository();
