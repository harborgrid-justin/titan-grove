/**
 * Base Manager Class
 * Provides common patterns and utilities for all module managers
 */

import { generateId, generateNumericId } from './id-generator';
import { BusinessEntityUtils } from './business-entity-utils';

/**
 * Base class for all module managers
 * Provides common patterns like ID generation, audit fields, etc.
 */
export abstract class BaseManager {
  /**
   * Generate a unique ID with the manager's prefix
   */
  protected generateId(prefix: string): string {
    return generateId(prefix);
  }

  /**
   * Generate a numeric ID with the manager's prefix
   */
  protected generateNumericId(prefix: string): string {
    return generateNumericId(prefix);
  }

  /**
   * Create audit fields for a new entity
   */
  protected createAuditFields(createdBy: string) {
    return BusinessEntityUtils.createAuditFields(createdBy);
  }

  /**
   * Update audit fields for an existing entity
   */
  protected updateAuditFields(updatedBy: string) {
    return BusinessEntityUtils.updateAuditFields(updatedBy);
  }

  /**
   * Get the manager name for logging/debugging
   */
  protected getManagerName(): string {
    return this.constructor.name;
  }

  /**
   * Log manager action (can be overridden by subclasses)
   */
  protected logAction(action: string, details?: any): void {
    console.log(`[${this.getManagerName()}] ${action}`, details ? details : '');
  }
}