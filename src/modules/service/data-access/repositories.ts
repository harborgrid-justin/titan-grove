import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';
import { v4 as uuidv4 } from 'uuid';

export class ServiceRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `service_${uuidv4()}`;
  }
}

export const serviceRepository = new ServiceRepository();
