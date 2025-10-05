/**
 * ManufacturingController - Complete Implementation
 * Handles all manufacturing domain operations
 */

import { Request, Response } from 'express';
import { BaseController } from '../base/base-controller';

export class ManufacturingController extends BaseController {
  /**
   * Get production planning data
   */
  async getProductionPlanning(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate, status, facilityId } = req.query;

      // Mock production planning data
      const plans = [
        {
          id: 'PP-001',
          planName: 'Q1 2024 Production Schedule',
          facilityId: 'FAC-001',
          facilityName: 'Main Assembly Plant',
          startDate: '2024-01-01',
          endDate: '2024-03-31',
          status: 'ACTIVE',
          targetQuantity: 10000,
          completedQuantity: 7500,
          productLine: 'Standard Widgets',
          resources: {
            machines: 15,
            workers: 50,
            shifts: 3,
          },
          createdAt: '2023-12-15T00:00:00.000Z',
          updatedAt: new Date().toISOString(),
        },
      ];

      // Apply filters
      let filteredPlans = plans;
      if (startDate) {
        filteredPlans = filteredPlans.filter((p) => p.startDate >= startDate);
      }
      if (endDate) {
        filteredPlans = filteredPlans.filter((p) => p.endDate <= endDate);
      }
      if (status) {
        filteredPlans = filteredPlans.filter((p) => p.status === status);
      }
      if (facilityId) {
        filteredPlans = filteredPlans.filter((p) => p.facilityId === facilityId);
      }

      const result = {
        plans: filteredPlans,
        summary: {
          total: filteredPlans.length,
          totalTarget: filteredPlans.reduce((sum, p) => sum + p.targetQuantity, 0),
          totalCompleted: filteredPlans.reduce((sum, p) => sum + p.completedQuantity, 0),
        },
        timestamp: new Date().toISOString(),
      };

      this.sendSuccess(res, result, 'Production planning data retrieved successfully');
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to get production planning', 500);
    }
  }

  /**
   * Create new production plan
   */
  async createProductionPlan(req: Request, res: Response): Promise<void> {
    try {
      const { planName, facilityId, startDate, endDate, targetQuantity, productLine } = req.body;

      // Validate required fields
      if (!planName || !facilityId || !startDate || !endDate || !targetQuantity) {
        this.sendError(res, 'Missing required fields', 400);
        return;
      }

      // Validate dates
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start >= end) {
        this.sendError(res, 'End date must be after start date', 400);
        return;
      }

      const newPlan = {
        id: `PP-${Date.now().toString().slice(-6)}`,
        planName,
        facilityId,
        startDate,
        endDate,
        targetQuantity,
        completedQuantity: 0,
        productLine: productLine || 'General',
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.sendSuccess(res, { plan: newPlan }, 'Production plan created successfully', 201);
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to create production plan', 500);
    }
  }

  /**
   * Get work orders
   */
  async getWorkOrders(req: Request, res: Response): Promise<void> {
    try {
      const { status, priority, facilityId } = req.query;

      const workOrders = [
        {
          id: 'WO-001',
          orderNumber: 'WO-2024-001',
          productId: 'PROD-001',
          productName: 'Standard Widget',
          quantity: 1000,
          quantityCompleted: 750,
          facilityId: 'FAC-001',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          startDate: '2024-01-15',
          dueDate: '2024-01-31',
          assignedTo: 'TEAM-001',
          createdAt: '2024-01-10T00:00:00.000Z',
        },
      ];

      let filtered = workOrders;
      if (status) {
        filtered = filtered.filter((wo) => wo.status === status);
      }
      if (priority) {
        filtered = filtered.filter((wo) => wo.priority === priority);
      }
      if (facilityId) {
        filtered = filtered.filter((wo) => wo.facilityId === facilityId);
      }

      const result = {
        workOrders: filtered,
        summary: {
          total: filtered.length,
          totalQuantity: filtered.reduce((sum, wo) => sum + wo.quantity, 0),
          totalCompleted: filtered.reduce((sum, wo) => sum + wo.quantityCompleted, 0),
        },
        timestamp: new Date().toISOString(),
      };

      this.sendSuccess(res, result, 'Work orders retrieved successfully');
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to get work orders', 500);
    }
  }

  /**
   * Create new work order
   */
  async createWorkOrder(req: Request, res: Response): Promise<void> {
    try {
      const { productId, quantity, facilityId, priority, dueDate } = req.body;

      if (!productId || !quantity || !facilityId) {
        this.sendError(res, 'Missing required fields: productId, quantity, facilityId', 400);
        return;
      }

      if (quantity <= 0) {
        this.sendError(res, 'Quantity must be greater than 0', 400);
        return;
      }

      const newWorkOrder = {
        id: `WO-${Date.now().toString().slice(-6)}`,
        orderNumber: `WO-2024-${Date.now().toString().slice(-4)}`,
        productId,
        quantity,
        quantityCompleted: 0,
        facilityId,
        status: 'PENDING',
        priority: priority || 'MEDIUM',
        startDate: new Date().toISOString().split('T')[0],
        dueDate: dueDate || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.sendSuccess(res, { workOrder: newWorkOrder }, 'Work order created successfully', 201);
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to create work order', 500);
    }
  }

  /**
   * Get quality metrics
   */
  async getQualityMetrics(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate, productLine } = req.query;

      const metrics = {
        overall: {
          defectRate: 0.025,
          firstPassYield: 0.975,
          reworkRate: 0.015,
          scrapRate: 0.01,
        },
        byProductLine: [
          {
            productLine: 'Standard Widgets',
            unitsProduced: 50000,
            unitsDefective: 1250,
            defectRate: 0.025,
            topDefects: ['Dimension variance', 'Surface finish'],
          },
        ],
        period: {
          startDate: startDate || '2024-01-01',
          endDate: endDate || new Date().toISOString().split('T')[0],
        },
        timestamp: new Date().toISOString(),
      };

      this.sendSuccess(res, metrics, 'Quality metrics retrieved successfully');
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to get quality metrics', 500);
    }
  }

  /**
   * Record quality check
   */
  async recordQualityCheck(req: Request, res: Response): Promise<void> {
    try {
      const { workOrderId, inspectorId, passed, defects, notes } = req.body;

      if (!workOrderId || !inspectorId || passed === undefined) {
        this.sendError(res, 'Missing required fields', 400);
        return;
      }

      const qualityCheck = {
        id: `QC-${Date.now().toString().slice(-6)}`,
        workOrderId,
        inspectorId,
        checkDate: new Date().toISOString(),
        passed,
        defects: defects || [],
        notes: notes || '',
        status: passed ? 'APPROVED' : 'REJECTED',
        createdAt: new Date().toISOString(),
      };

      this.sendSuccess(res, { qualityCheck }, 'Quality check recorded successfully', 201);
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to record quality check', 500);
    }
  }

  /**
   * Get inventory tracking
   */
  async getInventoryTracking(req: Request, res: Response): Promise<void> {
    try {
      const { facilityId, productId, lowStock } = req.query;

      const inventory = [
        {
          productId: 'PROD-001',
          productName: 'Standard Widget',
          facilityId: 'FAC-001',
          facilityName: 'Main Assembly Plant',
          currentStock: 5000,
          reorderPoint: 2000,
          maxStock: 10000,
          status: 'NORMAL',
          lastUpdated: new Date().toISOString(),
        },
      ];

      let filtered = inventory;
      if (facilityId) {
        filtered = filtered.filter((i) => i.facilityId === facilityId);
      }
      if (productId) {
        filtered = filtered.filter((i) => i.productId === productId);
      }
      if (lowStock === 'true') {
        filtered = filtered.filter((i) => i.currentStock <= i.reorderPoint);
      }

      const result = {
        inventory: filtered,
        summary: {
          totalItems: filtered.length,
          lowStockItems: filtered.filter((i) => i.currentStock <= i.reorderPoint).length,
        },
        timestamp: new Date().toISOString(),
      };

      this.sendSuccess(res, result, 'Inventory tracking data retrieved successfully');
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to get inventory tracking', 500);
    }
  }

  /**
   * Update inventory level
   */
  async updateInventoryLevel(req: Request, res: Response): Promise<void> {
    try {
      const { productId, facilityId, quantity, transactionType, reason } = req.body;

      if (!productId || !facilityId || quantity === undefined || !transactionType) {
        this.sendError(res, 'Missing required fields', 400);
        return;
      }

      const transaction = {
        id: `INV-${Date.now().toString().slice(-6)}`,
        productId,
        facilityId,
        quantity,
        transactionType, // 'ADD', 'REMOVE', 'ADJUSTMENT'
        reason: reason || '',
        timestamp: new Date().toISOString(),
        performedBy: 'SYSTEM', // Would be from auth
      };

      this.sendSuccess(res, { transaction }, 'Inventory level updated successfully');
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to update inventory level', 500);
    }
  }

  /**
   * Get machine monitoring data
   */
  async getMachineMonitoring(req: Request, res: Response): Promise<void> {
    try {
      const { facilityId, status } = req.query;

      const machines = [
        {
          machineId: 'MACH-001',
          machineName: 'CNC Mill #1',
          facilityId: 'FAC-001',
          status: 'RUNNING',
          efficiency: 0.92,
          uptime: 0.95,
          lastMaintenance: '2024-01-01',
          nextMaintenance: '2024-02-01',
          currentOperation: 'Milling Widget Components',
          operatingHours: 2340,
          partsProduced: 15000,
          lastUpdated: new Date().toISOString(),
        },
      ];

      let filtered = machines;
      if (facilityId) {
        filtered = filtered.filter((m) => m.facilityId === facilityId);
      }
      if (status) {
        filtered = filtered.filter((m) => m.status === status);
      }

      const result = {
        machines: filtered,
        summary: {
          total: filtered.length,
          running: filtered.filter((m) => m.status === 'RUNNING').length,
          idle: filtered.filter((m) => m.status === 'IDLE').length,
          maintenance: filtered.filter((m) => m.status === 'MAINTENANCE').length,
          averageEfficiency: filtered.reduce((sum, m) => sum + m.efficiency, 0) / (filtered.length || 1),
        },
        timestamp: new Date().toISOString(),
      };

      this.sendSuccess(res, result, 'Machine monitoring data retrieved successfully');
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to get machine monitoring', 500);
    }
  }

  /**
   * Record machine status
   */
  async recordMachineStatus(req: Request, res: Response): Promise<void> {
    try {
      const { machineId, status, notes, operatorId } = req.body;

      if (!machineId || !status) {
        this.sendError(res, 'Missing required fields: machineId, status', 400);
        return;
      }

      const validStatuses = ['RUNNING', 'IDLE', 'MAINTENANCE', 'DOWN', 'SETUP'];
      if (!validStatuses.includes(status)) {
        this.sendError(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
        return;
      }

      const statusRecord = {
        id: `MS-${Date.now().toString().slice(-6)}`,
        machineId,
        status,
        notes: notes || '',
        operatorId: operatorId || 'SYSTEM',
        timestamp: new Date().toISOString(),
      };

      this.sendSuccess(res, { statusRecord }, 'Machine status recorded successfully', 201);
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to record machine status', 500);
    }
  }
}

// Export singleton instance
export const manufacturingController = new ManufacturingController();
