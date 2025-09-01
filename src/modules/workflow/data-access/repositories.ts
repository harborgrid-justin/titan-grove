import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';

export class WorkflowRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const workflowRepository = new WorkflowRepository();
