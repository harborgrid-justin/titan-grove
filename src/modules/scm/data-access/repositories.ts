import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';

export class ScmRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `scm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const scmRepository = new ScmRepository();
