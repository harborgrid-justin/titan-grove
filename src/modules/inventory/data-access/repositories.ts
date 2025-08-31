/**
 * Inventory Module Data Access Layer
 * Repositories for inventory entities
 */

import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';
import { generateId } from '../../../shared/utils/id-generator';
import type { 
  InventoryItem, 
  StockLevel, 
  InventoryTransaction, 
  Warehouse, 
  ReplenishmentRecommendation 
} from '../types';

/**
 * Inventory Item Repository
 */
export class InventoryItemRepository extends BaseRepositoryImpl<InventoryItem> {
  protected generateId(): string {
    return generateId('item');
  }
}

/**
 * Warehouse Repository
 */
export class WarehouseRepository extends BaseRepositoryImpl<Warehouse> {
  protected generateId(): string {
    return generateId('warehouse');
  }
}

/**
 * Inventory Transaction Repository
 */
export class InventoryTransactionRepository extends BaseRepositoryImpl<InventoryTransaction> {
  protected generateId(): string {
    return generateId('inv_trans');
  }
}

// Export singleton instances
export const inventoryItemRepository = new InventoryItemRepository();
export const warehouseRepository = new WarehouseRepository();
export const inventoryTransactionRepository = new InventoryTransactionRepository();