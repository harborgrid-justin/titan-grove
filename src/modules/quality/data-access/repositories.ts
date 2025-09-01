import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';

export class QualityRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `quality_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const qualityRepository = new QualityRepository();
