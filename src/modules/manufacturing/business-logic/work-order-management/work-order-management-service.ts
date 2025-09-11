/**
 * Work Order Management Service
 * Oracle WIP (Work in Process) competitive implementation
 */

import type { WorkOrder } from '../../index';

export interface WorkOrderMaterial {
  materialId: string;
  materialName: string;
  requiredQuantity: number;
  issuedQuantity: number;
  unitCost: number;
  extendedCost: number;
}

export interface WorkOrderStatus {
  workOrderId: string;
  currentStatus: WorkOrder['status'];
  completionPercentage: number;
  actualCost: number;
  standardCost: number;
  variance: number;
}

export interface WorkOrderCostAnalysis {
  workOrderId: string;
  standardCosts: {
    materialCost: number;
    laborCost: number;
    overheadCost: number;
    totalStandardCost: number;
  };
  actualCosts: {
    materialCost: number;
    laborCost: number;
    overheadCost: number;
    totalActualCost: number;
  };
  variances: {
    materialVariance: number;
    laborVariance: number;
    overheadVariance: number;
    totalVariance: number;
  };
}

export class WorkOrderManagementService {
  async createWorkOrder(
    workOrderData: Omit<WorkOrder, 'id' | 'workOrderNumber' | 'completedQuantity' | 'scrapQuantity'>
  ): Promise<WorkOrder> {
    const id = `wo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const workOrderNumber = `WO${Date.now().toString().slice(-6)}`;

    const workOrder: WorkOrder = {
      ...workOrderData,
      id,
      workOrderNumber,
      completedQuantity: 0,
      scrapQuantity: 0,
    };

    console.log(
      `Created work order: ${workOrder.workOrderNumber} for product ${workOrder.productId}`
    );
    return workOrder;
  }

  async getWorkOrderStatus(workOrderId: string): Promise<WorkOrderStatus> {
    console.log(`Getting status for work order: ${workOrderId}`);

    return {
      workOrderId,
      currentStatus: 'IN_PROGRESS',
      completionPercentage: 65,
      actualCost: 1875.25,
      standardCost: 1750.0,
      variance: 125.25,
    };
  }

  async calculateWorkOrderCosts(workOrderId: string): Promise<WorkOrderCostAnalysis> {
    console.log(`Calculating costs for work order: ${workOrderId}`);

    return {
      workOrderId,
      standardCosts: {
        materialCost: 1500.0,
        laborCost: 400.0,
        overheadCost: 300.0,
        totalStandardCost: 2200.0,
      },
      actualCosts: {
        materialCost: 1575.0,
        laborCost: 450.0,
        overheadCost: 337.5,
        totalActualCost: 2362.5,
      },
      variances: {
        materialVariance: 75.0,
        laborVariance: 50.0,
        overheadVariance: 37.5,
        totalVariance: 162.5,
      },
    };
  }

  async getWorkOrderPerformanceAnalytics(
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalWorkOrders: number;
    completedWorkOrders: number;
    completionRate: number;
    averageCycleTime: number;
    onTimeDeliveryRate: number;
    costVariance: number;
  }> {
    console.log(`Generating work order performance analytics`);

    return {
      totalWorkOrders: 145,
      completedWorkOrders: 132,
      completionRate: 91.0,
      averageCycleTime: 52.3,
      onTimeDeliveryRate: 87.5,
      costVariance: 4.2,
    };
  }
}

export const workOrderManagementService = new WorkOrderManagementService();
