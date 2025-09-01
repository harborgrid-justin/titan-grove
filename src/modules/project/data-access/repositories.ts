import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';

export class ProjectRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const projectRepository = new ProjectRepository();
