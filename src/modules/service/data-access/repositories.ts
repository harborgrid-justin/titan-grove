import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';

export class ServiceRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const serviceRepository = new ServiceRepository();
