import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';

export class MaintenanceRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `maintenance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const maintenanceRepository = new MaintenanceRepository();
