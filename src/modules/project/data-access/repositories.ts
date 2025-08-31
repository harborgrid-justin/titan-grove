/**
 * Project Module Data Access Layer
 * Repositories for project entities
 */

import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';
import { generateId } from '../../../shared/utils/id-generator';
import type { 
  Project, 
  ProjectInvoice, 
  ProjectContract, 
  ProjectBudget, 
  ResourceAllocation,
  ProjectDocument,
  ProjectDeliverable,
  TimeSheet
} from '../types';

/**
 * Project Repository
 */
export class ProjectRepository extends BaseRepositoryImpl<Project> {
  protected generateId(): string {
    return generateId('project');
  }
}

/**
 * Project Contract Repository
 */
export class ProjectContractRepository extends BaseRepositoryImpl<ProjectContract> {
  protected generateId(): string {
    return generateId('contract');
  }
}

/**
 * Time Sheet Repository
 */
export class TimeSheetRepository extends BaseRepositoryImpl<TimeSheet> {
  protected generateId(): string {
    return generateId('timesheet');
  }
}

/**
 * Project Document Repository
 */
export class ProjectDocumentRepository extends BaseRepositoryImpl<ProjectDocument> {
  protected generateId(): string {
    return generateId('proj_doc');
  }
}

// Export singleton instances
export const projectRepository = new ProjectRepository();
export const projectContractRepository = new ProjectContractRepository();
export const timeSheetRepository = new TimeSheetRepository();
export const projectDocumentRepository = new ProjectDocumentRepository();