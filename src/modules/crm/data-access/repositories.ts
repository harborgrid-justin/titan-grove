/**
 * CRM Module Data Access Layer
 * Repositories for CRM entities
 */

import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';
import { generateId } from '../../../shared/utils/id-generator';
import type { 
  Customer, 
  Lead, 
  Opportunity, 
  SupportCase, 
  Activity 
} from '../types';

/**
 * Customer Repository
 */
export class CustomerRepository extends BaseRepositoryImpl<Customer> {
  protected generateId(): string {
    return generateId('customer');
  }
}

/**
 * Lead Repository
 */
export class LeadRepository extends BaseRepositoryImpl<Lead> {
  protected generateId(): string {
    return generateId('lead');
  }
}

/**
 * Opportunity Repository
 */
export class OpportunityRepository extends BaseRepositoryImpl<Opportunity> {
  protected generateId(): string {
    return generateId('opportunity');
  }
}

/**
 * Support Case Repository
 */
export class SupportCaseRepository extends BaseRepositoryImpl<SupportCase> {
  protected generateId(): string {
    return generateId('case');
  }
}

/**
 * Activity Repository
 */
export class ActivityRepository extends BaseRepositoryImpl<Activity> {
  protected generateId(): string {
    return generateId('activity');
  }
}

// Export singleton instances
export const customerRepository = new CustomerRepository();
export const leadRepository = new LeadRepository();
export const opportunityRepository = new OpportunityRepository();
export const supportCaseRepository = new SupportCaseRepository();
export const activityRepository = new ActivityRepository();