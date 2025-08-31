/**
 * HR Module Data Access Layer
 * Repositories for HR entities
 */

import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';
import { generateId } from '../../../shared/utils/id-generator';
import type { 
  Employee, 
  PayrollRecord, 
  Benefit, 
  TimeEntry 
} from '../types';

/**
 * Employee Repository
 */
export class EmployeeRepository extends BaseRepositoryImpl<Employee> {
  protected generateId(): string {
    return generateId('emp');
  }
}

/**
 * Payroll Repository
 */
export class PayrollRepository extends BaseRepositoryImpl<PayrollRecord> {
  protected generateId(): string {
    return generateId('payroll');
  }
}

/**
 * Benefits Repository
 */
export class BenefitsRepository extends BaseRepositoryImpl<Benefit> {
  protected generateId(): string {
    return generateId('benefit');
  }
}

/**
 * Time Entry Repository
 */
export class TimeEntryRepository extends BaseRepositoryImpl<TimeEntry> {
  protected generateId(): string {
    return generateId('time');
  }
}

// Export singleton instances
export const employeeRepository = new EmployeeRepository();
export const payrollRepository = new PayrollRepository();
export const benefitsRepository = new BenefitsRepository();
export const timeEntryRepository = new TimeEntryRepository();