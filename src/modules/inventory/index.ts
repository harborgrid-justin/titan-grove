/**
 * Inventory Management Module
 * Main orchestrator that delegates to specialized business logic services
 */

import { Priority } from '../../types/common';

// Export all types
export * from './types';

// Export data access layer
export * from './data-access';

// Export business logic services for direct access
export * from './business-logic/pim-data-hub/pim-data-hub-service';

// Import shared utilities
import { BaseManager } from '../../shared/utils/base-manager';

// Import business logic services
import { inventoryReplenishmentService } from './business-logic/replenishment/replenishment-service';

import type {
  InventoryItem,
  StockLevel,
  InventoryTransaction,
  Warehouse,
  ReplenishmentRecommendation,
} from './types';

export class InventoryManager extends BaseManager {
  // Core Inventory Methods
  async createInventoryItem(
    item: Omit<InventoryItem, 'id' | 'createdDate' | 'averageCost' | 'lastCost'>
  ): Promise<InventoryItem> {
    const id = this.generateId('item');
    const result = {
      ...item,
      id,
      averageCost: item.standardCost,
      lastCost: item.standardCost,
      createdDate: new Date(),
    };

    this.logAction('createInventoryItem', { id, itemCode: item.itemCode });
    return result;
  }

  async getStockLevel(itemId: string, warehouseId: string): Promise<StockLevel | null> {
    console.log(`Getting stock level for item ${itemId} in warehouse ${warehouseId}`);
    return {
      itemId,
      warehouseId,
      onHandQuantity: 100,
      availableQuantity: 85,
      reservedQuantity: 10,
      allocatedQuantity: 5,
      inTransitQuantity: 20,
      backOrderQuantity: 3,
    };
  }

  async recordInventoryTransaction(
    transaction: Omit<InventoryTransaction, 'id' | 'transactionNumber'>
  ): Promise<InventoryTransaction> {
    const id = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const transactionNumber = `TXN${Date.now().toString().slice(-6)}`;

    return {
      ...transaction,
      id,
      transactionNumber,
    };
  }

  // Cycle Counting Methods
  async performCycleCount(
    warehouseId: string,
    items: Array<{
      itemId: string;
      countedQuantity: number;
      location?: string;
    }>
  ): Promise<{
    totalVariance: number;
    adjustments: Array<{ itemId: string; variance: number; adjustmentAmount: number }>;
  }> {
    console.log(`Performing cycle count in warehouse ${warehouseId}`);
    return {
      totalVariance: 15,
      adjustments: [],
    };
  }

  // Replenishment Methods - delegate to replenishment service
  async generateReplenishmentPlan(criteria?: {
    warehouseId?: string;
    itemCategory?: string;
    abcClass?: 'A' | 'B' | 'C';
    priority?: Priority;
    planningHorizon?: number;
  }): Promise<ReplenishmentRecommendation[]> {
    return inventoryReplenishmentService.generateReplenishmentPlan(criteria || {});
  }

  async generateDemandForecast(
    itemId: string,
    warehouseId: string,
    forecastMethod:
      | 'MOVING_AVERAGE'
      | 'EXPONENTIAL_SMOOTHING'
      | 'LINEAR_REGRESSION'
      | 'SEASONAL_DECOMPOSITION',
    periodsToForecast: number = 12
  ): Promise<any[]> {
    return inventoryReplenishmentService.generateDemandForecast(
      itemId,
      warehouseId,
      forecastMethod,
      periodsToForecast
    );
  }

  async optimizeInventoryPolicies(criteria: {
    warehouseId?: string;
    itemCategory?: string;
    abcClass?: 'A' | 'B' | 'C';
    targetServiceLevel?: number;
  }): Promise<any[]> {
    return inventoryReplenishmentService.optimizeInventoryPolicies(criteria);
  }

  // Legacy compatibility method
  async generateReplenishmentPlanLegacy(warehouseId?: string): Promise<
    Array<{
      itemId: string;
      itemCode: string;
      currentStock: number;
      reorderPoint: number;
      suggestedOrderQuantity: number;
      priority: Exclude<Priority, 'CRITICAL'>;
    }>
  > {
    console.log('Generating replenishment plan');
    const recommendations = await this.generateReplenishmentPlan({ warehouseId });

    // Convert to legacy format
    return recommendations.map((rec) => ({
      itemId: rec.itemId,
      itemCode: rec.itemCode,
      currentStock: rec.currentStock,
      reorderPoint: rec.reorderPoint,
      suggestedOrderQuantity: rec.suggestedOrderQuantity,
      priority:
        rec.priority === Priority.CRITICAL
          ? Priority.HIGH
          : (rec.priority as Exclude<Priority, 'CRITICAL'>),
    }));
  }

  // Analytics Methods
  async getInventoryAnalytics(warehouseId?: string): Promise<{
    totalValue: number;
    totalItems: number;
    turnoverRate: number;
    fillRate: number;
    stockoutItems: number;
    excessItems: number;
  }> {
    console.log(`Getting inventory analytics for warehouse ${warehouseId || 'all'}`);

    return {
      totalValue: 2450000,
      totalItems: 1247,
      turnoverRate: 4.2,
      fillRate: 96.5,
      stockoutItems: 12,
      excessItems: 34,
    };
  }

  async getSlowMovingItems(
    warehouseId: string,
    daysSinceLastMovement: number = 90
  ): Promise<
    Array<{
      itemId: string;
      itemCode: string;
      onHandQuantity: number;
      value: number;
      daysSinceLastMovement: number;
    }>
  > {
    console.log(
      `Getting slow moving items in warehouse ${warehouseId} (${daysSinceLastMovement} days)`
    );
    return [];
  }

  async getExcessInventory(
    warehouseId: string,
    excessThresholdDays: number = 180
  ): Promise<
    Array<{
      itemId: string;
      itemCode: string;
      onHandQuantity: number;
      excessQuantity: number;
      excessValue: number;
    }>
  > {
    console.log(
      `Getting excess inventory in warehouse ${warehouseId} (${excessThresholdDays} days threshold)`
    );
    return [];
  }
}

export const inventoryManager = new InventoryManager();

// Export business logic services for direct access if needed
export { inventoryReplenishmentService };
