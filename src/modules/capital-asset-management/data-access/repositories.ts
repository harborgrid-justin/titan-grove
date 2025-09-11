/**
 * Production-Grade Data Access Layer Template
 * Standardized repository pattern for all modules
 */

import { generateId } from '../../../shared/utils/id-generator';

/**
 * Base Repository Implementation
 * Provides consistent CRUD operations and business query methods
 */
export abstract class BaseModuleRepository<T extends Record<string, any>> {
  protected items: T[] = [];

  async create(entity: Omit<T, 'id'>): Promise<T> {
    const id = this.generateId();
    const newItem = { ...entity, id } as unknown as unknown as T;
    this.items.push(newItem);
    return newItem;
  }

  async findById(id: string): Promise<T | null> {
    return this.items.find((item) => item.id === id) || null;
  }

  async findAll(): Promise<T[]> {
    return [...this.items];
  }

  async update(id: string, updates: Partial<T>): Promise<T | null> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return null;

    this.items[index] = { ...this.items[index], ...updates };
    return this.items[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  async findByField(field: keyof T, value: any): Promise<T[]> {
    return this.items.filter((item) => item[field] === value);
  }

  async count(): Promise<number> {
    return this.items.length;
  }

  protected abstract generateId(): string;
}

/**
 * Capital Asset Repository
 */
export class CapitalAssetRepository extends BaseModuleRepository<any> {
  protected generateId(): string {
    return generateId('capital_asset');
  }

  async findByCapitalClass(capitalClass: string): Promise<any[]> {
    return this.findByField('capitalClass', capitalClass);
  }

  async findAssetsNearingReplacement(): Promise<any[]> {
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

    return this.items.filter(
      (asset) =>
        asset.plannedReplacementDate && new Date(asset.plannedReplacementDate) <= sixMonthsFromNow
    );
  }

  async getTotalAssetValue(): Promise<number> {
    return this.items.reduce((total, asset) => total + (asset.currentValue || 0), 0);
  }
}

export const capitalAssetRepository = new CapitalAssetRepository();
