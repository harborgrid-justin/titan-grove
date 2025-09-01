import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';

export class IntegrationRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `integration_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const integrationRepository = new IntegrationRepository();
