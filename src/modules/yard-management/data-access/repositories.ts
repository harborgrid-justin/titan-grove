/**
 * Yard Management Module Data Access Layer
 * Repositories for yard management entities
 */

import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';
import { generateId } from '../../../shared/utils/id-generator';

// Note: Add specific type imports when types are standardized
// import type { YardFacility, YardSpace, DockDoor } from '../types';

/**
 * Yard Facility Repository
 */
export class YardFacilityRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return generateId('yard_facility');
  }
}

// Export singleton instances
export const yardFacilityRepository = new YardFacilityRepository();