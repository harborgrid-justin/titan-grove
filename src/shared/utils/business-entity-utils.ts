/**
 * Shared Business Entity Utilities
 * Common patterns for business entities across modules
 */

import { AuditFields, CommonStatus, Priority } from '../../types/common';

/**
 * Base interface for all business entities
 */
export interface BaseBusinessEntity extends AuditFields {
  id: string;
  name: string;
  description?: string;
  status: CommonStatus;
}

/**
 * Base interface for prioritized entities
 */
export interface PrioritizedEntity extends BaseBusinessEntity {
  priority: Priority;
}

/**
 * Base interface for entities with financial information
 */
export interface FinancialEntity extends BaseBusinessEntity {
  totalValue: number;
  currency: string;
}

/**
 * Utility functions for business entities
 */
export class BusinessEntityUtils {
  
  /**
   * Create audit fields for a new entity
   */
  static createAuditFields(createdBy: string): AuditFields {
    const now = new Date();
    return {
      createdAt: now,
      updatedAt: now,
      createdBy,
      updatedBy: createdBy
    };
  }
  
  /**
   * Update audit fields for an existing entity
   */
  static updateAuditFields(updatedBy: string): Pick<AuditFields, 'updatedAt' | 'updatedBy'> {
    return {
      updatedAt: new Date(),
      updatedBy
    };
  }
  
  /**
   * Check if entity is active
   */
  static isActive(entity: BaseBusinessEntity): boolean {
    return entity.status === CommonStatus.ACTIVE;
  }
  
  /**
   * Filter entities by status
   */
  static filterByStatus<T extends BaseBusinessEntity>(
    entities: T[], 
    status: CommonStatus
  ): T[] {
    return entities.filter(entity => entity.status === status);
  }
  
  /**
   * Sort entities by priority (highest first)
   */
  static sortByPriority<T extends PrioritizedEntity>(entities: T[]): T[] {
    const priorityOrder = {
      [Priority.CRITICAL]: 0,
      [Priority.HIGH]: 1,
      [Priority.MEDIUM]: 2,
      [Priority.LOW]: 3
    };
    
    return entities.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }
}