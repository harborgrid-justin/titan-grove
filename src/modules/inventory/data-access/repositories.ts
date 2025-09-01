import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';

export class InventoryRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `inventory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const inventoryRepository = new InventoryRepository();
