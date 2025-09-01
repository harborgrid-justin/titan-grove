/**
 * Manufacturing Data Access Layer
 * Production-grade repositories for manufacturing entities
 */

import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';
import { generateId } from '../../../shared/utils/id-generator';
import type {
  Product,
  BillOfMaterials,
  BOMComponent,
  WorkOrder,
  Routing,
  RoutingOperation,
  WorkCenter,
  ProductionSchedule,
  ScheduledWorkOrder,
  QualityInspection,
  QualityDefect
} from '../index';

/**
 * Product Repository
 * Manages product master data and lifecycle
 */
export class ProductRepository extends BaseRepositoryImpl<Product> {
  protected generateId(): string {
    return generateId('product');
  }

  /**
   * Find products by category
   */
  async findByCategory(category: string): Promise<Product[]> {
    return this.items.filter(product => product.category === category);
  }

  /**
   * Find products by status
   */
  async findByStatus(status: Product['status']): Promise<Product[]> {
    return this.items.filter(product => product.status === status);
  }

  /**
   * Search products by name or code
   */
  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return this.items.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.productCode.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Find products with BOMs
   */
  async findProductsWithBOMs(): Promise<Product[]> {
    return this.items.filter(product => product.bomId);
  }

  /**
   * Find products with routings
   */
  async findProductsWithRoutings(): Promise<Product[]> {
    return this.items.filter(product => product.routingId);
  }
}

/**
 * Bill of Materials Repository
 * Manages BOM structure and component relationships
 */
export class BillOfMaterialsRepository extends BaseRepositoryImpl<BillOfMaterials> {
  protected generateId(): string {
    return generateId('bom');
  }

  /**
   * Find BOMs by product
   */
  async findByProductId(productId: string): Promise<BillOfMaterials[]> {
    return this.items.filter(bom => bom.productId === productId);
  }

  /**
   * Find active BOMs
   */
  async findActiveBOMs(): Promise<BillOfMaterials[]> {
    return this.items.filter(bom => bom.status === 'ACTIVE');
  }

  /**
   * Find BOMs by effective date range
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<BillOfMaterials[]> {
    return this.items.filter(bom => 
      bom.effectiveDate >= startDate &&
      (!bom.expirationDate || bom.expirationDate <= endDate)
    );
  }

  /**
   * Get current active BOM for product
   */
  async getCurrentBOMForProduct(productId: string): Promise<BillOfMaterials | null> {
    const now = new Date();
    const boms = this.items.filter(bom => 
      bom.productId === productId &&
      bom.status === 'ACTIVE' &&
      bom.effectiveDate <= now &&
      (!bom.expirationDate || bom.expirationDate > now)
    );

    if (boms.length === 0) return null;

    // Return the most recent version
    return boms.reduce((latest, current) => 
      current.effectiveDate > latest.effectiveDate ? current : latest
    );
  }

  /**
   * Find BOMs containing specific component
   */
  async findBOMsWithComponent(componentId: string): Promise<BillOfMaterials[]> {
    return this.items.filter(bom => 
      bom.components.some(component => component.componentId === componentId)
    );
  }
}

/**
 * Work Order Repository
 * Manages production work orders and execution
 */
export class WorkOrderRepository extends BaseRepositoryImpl<WorkOrder> {
  protected generateId(): string {
    return generateId('work_order');
  }

  /**
   * Find work orders by status
   */
  async findByStatus(status: WorkOrder['status']): Promise<WorkOrder[]> {
    return this.items.filter(wo => wo.status === status);
  }

  /**
   * Find work orders by product
   */
  async findByProductId(productId: string): Promise<WorkOrder[]> {
    return this.items.filter(wo => wo.productId === productId);
  }

  /**
   * Find work orders by priority
   */
  async findByPriority(priority: WorkOrder['priority']): Promise<WorkOrder[]> {
    return this.items.filter(wo => wo.priority === priority);
  }

  /**
   * Find work orders by cost center
   */
  async findByCostCenter(costCenter: string): Promise<WorkOrder[]> {
    return this.items.filter(wo => wo.costCenter === costCenter);
  }

  /**
   * Find overdue work orders
   */
  async findOverdueWorkOrders(): Promise<WorkOrder[]> {
    const now = new Date();
    return this.items.filter(wo => 
      wo.plannedEndDate < now &&
      wo.status !== 'COMPLETED' &&
      wo.status !== 'CANCELLED'
    );
  }

  /**
   * Find work orders by date range
   */
  async findByPlannedDateRange(startDate: Date, endDate: Date): Promise<WorkOrder[]> {
    return this.items.filter(wo => 
      wo.plannedStartDate >= startDate && wo.plannedStartDate <= endDate
    );
  }

  /**
   * Get work order completion metrics
   */
  async getCompletionMetrics(workOrderId: string): Promise<{
    completionRate: number;
    scrapRate: number;
    efficiencyRate: number;
  } | null> {
    const workOrder = await this.findById(workOrderId);
    if (!workOrder) return null;

    const completionRate = (workOrder.completedQuantity / workOrder.quantity) * 100;
    const scrapRate = (workOrder.scrapQuantity / workOrder.quantity) * 100;
    const efficiencyRate = completionRate - scrapRate;

    return {
      completionRate,
      scrapRate,
      efficiencyRate
    };
  }
}

/**
 * Routing Repository
 * Manages manufacturing routings and operations
 */
export class RoutingRepository extends BaseRepositoryImpl<Routing> {
  protected generateId(): string {
    return generateId('routing');
  }

  /**
   * Find routings by product
   */
  async findByProductId(productId: string): Promise<Routing[]> {
    return this.items.filter(routing => routing.productId === productId);
  }

  /**
   * Find active routings
   */
  async findActiveRoutings(): Promise<Routing[]> {
    return this.items.filter(routing => routing.status === 'ACTIVE');
  }

  /**
   * Get current routing for product
   */
  async getCurrentRoutingForProduct(productId: string): Promise<Routing | null> {
    const routings = this.items.filter(routing => 
      routing.productId === productId && 
      routing.status === 'ACTIVE'
    );

    if (routings.length === 0) return null;

    // Return the most recent version
    return routings.reduce((latest, current) => 
      current.effectiveDate > latest.effectiveDate ? current : latest
    );
  }

  /**
   * Find routings using specific work center
   */
  async findRoutingsUsingWorkCenter(workCenterCode: string): Promise<Routing[]> {
    return this.items.filter(routing => 
      routing.operations.some(operation => operation.workCenterCode === workCenterCode)
    );
  }
}

/**
 * Work Center Repository
 * Manages manufacturing work centers and capacity
 */
export class WorkCenterRepository extends BaseRepositoryImpl<WorkCenter> {
  protected generateId(): string {
    return generateId('work_center');
  }

  /**
   * Find work centers by department
   */
  async findByDepartment(department: string): Promise<WorkCenter[]> {
    return this.items.filter(wc => wc.department === department);
  }

  /**
   * Find work centers by status
   */
  async findByStatus(status: WorkCenter['status']): Promise<WorkCenter[]> {
    return this.items.filter(wc => wc.status === status);
  }

  /**
   * Find active work centers
   */
  async findActiveWorkCenters(): Promise<WorkCenter[]> {
    return this.items.filter(wc => wc.status === 'ACTIVE');
  }

  /**
   * Find work centers with low utilization
   */
  async findUnderUtilizedWorkCenters(threshold: number = 70): Promise<WorkCenter[]> {
    return this.items.filter(wc => wc.utilizationRate < threshold);
  }

  /**
   * Calculate total capacity for department
   */
  async getTotalCapacityByDepartment(department: string): Promise<number> {
    const workCenters = await this.findByDepartment(department);
    return workCenters
      .filter(wc => wc.status === 'ACTIVE')
      .reduce((total, wc) => total + wc.capacity, 0);
  }
}

/**
 * Production Schedule Repository
 * Manages production scheduling and resource allocation
 */
export class ProductionScheduleRepository extends BaseRepositoryImpl<ProductionSchedule> {
  protected generateId(): string {
    return generateId('production_schedule');
  }

  /**
   * Find schedules by work center
   */
  async findByWorkCenter(workCenterCode: string): Promise<ProductionSchedule[]> {
    return this.items.filter(schedule => schedule.workCenterCode === workCenterCode);
  }

  /**
   * Find schedules by date
   */
  async findByDate(date: Date): Promise<ProductionSchedule[]> {
    const scheduleDate = new Date(date);
    scheduleDate.setHours(0, 0, 0, 0);
    
    return this.items.filter(schedule => {
      const sDate = new Date(schedule.scheduleDate);
      sDate.setHours(0, 0, 0, 0);
      return sDate.getTime() === scheduleDate.getTime();
    });
  }

  /**
   * Find schedules by date range
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<ProductionSchedule[]> {
    return this.items.filter(schedule => 
      schedule.scheduleDate >= startDate && schedule.scheduleDate <= endDate
    );
  }

  /**
   * Find schedules with available capacity
   */
  async findSchedulesWithCapacity(minCapacity: number = 0): Promise<ProductionSchedule[]> {
    return this.items.filter(schedule => schedule.availableCapacity >= minCapacity);
  }

  /**
   * Get capacity utilization for work center
   */
  async getCapacityUtilization(workCenterCode: string, date: Date): Promise<number> {
    const schedules = await this.findByWorkCenter(workCenterCode);
    const daySchedule = schedules.find(s => {
      const sDate = new Date(s.scheduleDate);
      const dDate = new Date(date);
      sDate.setHours(0, 0, 0, 0);
      dDate.setHours(0, 0, 0, 0);
      return sDate.getTime() === dDate.getTime();
    });

    if (!daySchedule || daySchedule.totalCapacityHours === 0) return 0;

    return (daySchedule.scheduledHours / daySchedule.totalCapacityHours) * 100;
  }
}

/**
 * Quality Inspection Repository
 * Manages quality inspections and defect tracking
 */
export class QualityInspectionRepository extends BaseRepositoryImpl<QualityInspection> {
  protected generateId(): string {
    return generateId('quality_inspection');
  }

  /**
   * Find inspections by work order
   */
  async findByWorkOrderId(workOrderId: string): Promise<QualityInspection[]> {
    return this.items.filter(inspection => inspection.workOrderId === workOrderId);
  }

  /**
   * Find inspections by product
   */
  async findByProductId(productId: string): Promise<QualityInspection[]> {
    return this.items.filter(inspection => inspection.productId === productId);
  }

  /**
   * Find inspections by type
   */
  async findByInspectionType(type: QualityInspection['inspectionType']): Promise<QualityInspection[]> {
    return this.items.filter(inspection => inspection.inspectionType === type);
  }

  /**
   * Find inspections by status
   */
  async findByStatus(status: QualityInspection['status']): Promise<QualityInspection[]> {
    return this.items.filter(inspection => inspection.status === status);
  }

  /**
   * Find inspections by inspector
   */
  async findByInspectorId(inspectorId: string): Promise<QualityInspection[]> {
    return this.items.filter(inspection => inspection.inspectorId === inspectorId);
  }

  /**
   * Find inspections by date range
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<QualityInspection[]> {
    return this.items.filter(inspection => 
      inspection.inspectionDate >= startDate && inspection.inspectionDate <= endDate
    );
  }

  /**
   * Get pass/fail rate for product
   */
  async getPassFailRateForProduct(
    productId: string, 
    startDate?: Date, 
    endDate?: Date
  ): Promise<{
    totalInspections: number;
    passedInspections: number;
    failedInspections: number;
    passRate: number;
    failRate: number;
  }> {
    let inspections = await this.findByProductId(productId);
    
    if (startDate && endDate) {
      inspections = inspections.filter(inspection => 
        inspection.inspectionDate >= startDate && inspection.inspectionDate <= endDate
      );
    }

    const totalInspections = inspections.length;
    const passedInspections = inspections.filter(i => i.status === 'COMPLETED' && i.rejectedQuantity === 0).length;
    const failedInspections = inspections.filter(i => i.status === 'FAILED' || i.rejectedQuantity > 0).length;

    return {
      totalInspections,
      passedInspections,
      failedInspections,
      passRate: totalInspections > 0 ? (passedInspections / totalInspections) * 100 : 0,
      failRate: totalInspections > 0 ? (failedInspections / totalInspections) * 100 : 0
    };
  }

  /**
   * Get defect summary by severity
   */
  async getDefectSummaryBySeverity(startDate?: Date, endDate?: Date): Promise<{
    minor: number;
    major: number;
    critical: number;
    totalDefects: number;
  }> {
    let inspections = [...this.items];
    
    if (startDate && endDate) {
      inspections = inspections.filter(inspection => 
        inspection.inspectionDate >= startDate && inspection.inspectionDate <= endDate
      );
    }

    const allDefects = inspections.flatMap(inspection => inspection.defects);

    return {
      minor: allDefects.filter(d => d.severity === 'MINOR').length,
      major: allDefects.filter(d => d.severity === 'MAJOR').length,
      critical: allDefects.filter(d => d.severity === 'CRITICAL').length,
      totalDefects: allDefects.length
    };
  }

  /**
   * Find most common defects
   */
  async getMostCommonDefects(limit: number = 10): Promise<Array<{
    defectCode: string;
    description: string;
    occurrences: number;
    totalQuantity: number;
  }>> {
    const allDefects = this.items.flatMap(inspection => inspection.defects);
    
    const defectMap = new Map<string, {
      description: string;
      occurrences: number;
      totalQuantity: number;
    }>();

    allDefects.forEach(defect => {
      if (defectMap.has(defect.defectCode)) {
        const existing = defectMap.get(defect.defectCode)!;
        existing.occurrences++;
        existing.totalQuantity += defect.quantity;
      } else {
        defectMap.set(defect.defectCode, {
          description: defect.description,
          occurrences: 1,
          totalQuantity: defect.quantity
        });
      }
    });

    return Array.from(defectMap.entries())
      .map(([defectCode, data]) => ({
        defectCode,
        ...data
      }))
      .sort((a, b) => b.occurrences - a.occurrences)
      .slice(0, limit);
  }
}

// Export singleton instances for use throughout the application
export const productRepository = new ProductRepository();
export const billOfMaterialsRepository = new BillOfMaterialsRepository();
export const workOrderRepository = new WorkOrderRepository();
export const routingRepository = new RoutingRepository();
export const workCenterRepository = new WorkCenterRepository();
export const productionScheduleRepository = new ProductionScheduleRepository();
export const qualityInspectionRepository = new QualityInspectionRepository();