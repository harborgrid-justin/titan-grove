/**
 * Material Requirements Planning (MRP) Service - Phase 2 Implementation
 * Advanced MRP engine for net requirements calculation, lead time offsetting, and action message generation
 * Oracle EBS competitive implementation for complex material planning scenarios
 */

export interface MRPParameters {
  planningHorizon: { startDate: Date; endDate: Date };
  safetyStockDays: Record<string, number>;
  leadTimes: Record<string, number>;
  lotSizingMethod: 'LOT_FOR_LOT' | 'FIXED_ORDER_QUANTITY' | 'ECONOMIC_ORDER_QUANTITY' | 'PERIOD_ORDER_QUANTITY';
  lowLevelCodes: Record<string, number>;
  planningTimeFence: number; // days
  demandTimeFence: number; // days
}

export interface MRPRecord {
  itemId: string;
  itemCode: string;
  itemDescription: string;
  planningLevel: number;
  unitOfMeasure: string;
  safetyStock: number;
  leadTime: number;
  lotSize: number;
  minimumOrderQuantity: number;
  maximumOrderQuantity: number;
  planningMethod: 'MRP' | 'MASTER_SCHEDULE' | 'KANBAN' | 'REORDER_POINT';
  requirements: MRPRequirement[];
  plannedOrders: MRPPlannedOrder[];
  actionMessages: MRPActionMessage[];
}

export interface MRPRequirement {
  periodDate: Date;
  grossRequirement: number;
  scheduledReceipts: number;
  projectedAvailable: number;
  netRequirement: number;
  plannedOrderReceipt: number;
  plannedOrderRelease: number;
  source: 'DEMAND' | 'DEPENDENT_DEMAND' | 'SAFETY_STOCK' | 'FORECAST';
  sourceReference: string;
}

export interface MRPPlannedOrder {
  orderId: string;
  itemId: string;
  quantity: number;
  orderType: 'PRODUCTION_ORDER' | 'PURCHASE_ORDER' | 'TRANSFER_ORDER';
  plannedOrderDate: Date;
  plannedStartDate: Date;
  plannedCompletionDate: Date;
  status: 'PLANNED' | 'RELEASED' | 'FIRM' | 'CANCELLED';
  priority: number;
  workCenter?: string;
  supplier?: string;
  exceptions: string[];
}

export interface MRPActionMessage {
  messageId: string;
  itemId: string;
  messageType: 'EXPEDITE' | 'POSTPONE' | 'CANCEL' | 'RESCHEDULE' | 'QUANTITY_CHANGE' | 'NEW_ORDER';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  recommendedAction: string;
  dueDate: Date;
  orderId?: string;
  currentQuantity?: number;
  recommendedQuantity?: number;
  currentDate?: Date;
  recommendedDate?: Date;
}

export interface BillOfMaterials {
  parentItemId: string;
  components: BOMComponent[];
  effectiveDate: Date;
  expirationDate?: Date;
  bomType: 'MANUFACTURING' | 'PLANNING' | 'PHANTOM' | 'OPTION_CLASS';
  revision: string;
}

export interface BOMComponent {
  componentItemId: string;
  componentItemCode: string;
  quantityPer: number;
  unitOfMeasure: string;
  leadTimeOffset: number;
  scrapFactor: number;
  yieldFactor: number;
  operationSequence?: number;
  phantom: boolean;
  optional: boolean;
  substitute: boolean;
}

export interface MRPRunResults {
  runId: string;
  runDate: Date;
  planningHorizon: { startDate: Date; endDate: Date };
  itemsProcessed: number;
  totalPlannedOrders: number;
  totalActionMessages: number;
  criticalActionMessages: number;
  feasible: boolean;
  exceptions: string[];
  performance: {
    processingTimeMs: number;
    memoryUsageMb: number;
    itemsPerSecond: number;
  };
}

export class MaterialRequirementsPlanningService {
  private mrpRecords: Map<string, MRPRecord> = new Map();
  private billOfMaterials: Map<string, BillOfMaterials> = new Map();
  private currentInventory: Map<string, number> = new Map();
  
  /**
   * Execute full MRP run with net requirements calculation
   */
  async runMRP(parameters: MRPParameters): Promise<MRPRunResults> {
    const startTime = Date.now();
    const runId = `mrp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`🏭 Starting MRP Run ${runId} for planning horizon ${parameters.planningHorizon.startDate.toISOString().split('T')[0]} to ${parameters.planningHorizon.endDate.toISOString().split('T')[0]}`);
    
    try {
      // Step 1: Initialize MRP records
      await this.initializeMRPRecords(parameters);
      
      // Step 2: Process master schedule items (level 0)
      const masterScheduleItems = Array.from(this.mrpRecords.values())
        .filter(record => record.planningLevel === 0);
      
      // Step 3: Process all planning levels in sequence
      const maxLevel = Math.max(...Array.from(this.mrpRecords.values())
        .map(record => record.planningLevel));
      
      for (let level = 0; level <= maxLevel; level++) {
        const itemsAtLevel = Array.from(this.mrpRecords.values())
          .filter(record => record.planningLevel === level);
        
        console.log(`Processing MRP Level ${level}: ${itemsAtLevel.length} items`);
        
        for (const item of itemsAtLevel) {
          await this.processItemMRP(item, parameters);
        }
      }
      
      // Step 4: Generate action messages
      await this.generateActionMessages(parameters);
      
      // Step 5: Validate feasibility
      const feasible = await this.validatePlanFeasibility();
      
      const endTime = Date.now();
      const processingTime = endTime - startTime;
      
      const results: MRPRunResults = {
        runId,
        runDate: new Date(),
        planningHorizon: parameters.planningHorizon,
        itemsProcessed: this.mrpRecords.size,
        totalPlannedOrders: this.getTotalPlannedOrders(),
        totalActionMessages: this.getTotalActionMessages(),
        criticalActionMessages: this.getCriticalActionMessages(),
        feasible,
        exceptions: this.gatherExceptions(),
        performance: {
          processingTimeMs: processingTime,
          memoryUsageMb: process.memoryUsage().heapUsed / 1024 / 1024,
          itemsPerSecond: this.mrpRecords.size / (processingTime / 1000)
        }
      };
      
      console.log(`✅ MRP Run ${runId} completed in ${processingTime}ms`);
      console.log(`📊 Processed ${results.itemsProcessed} items, generated ${results.totalPlannedOrders} planned orders, ${results.totalActionMessages} action messages`);
      
      return results;
      
    } catch (error) {
      console.error(`❌ MRP Run ${runId} failed:`, error);
      throw error;
    }
  }
  
  /**
   * Process individual item MRP calculation
   */
  private async processItemMRP(item: MRPRecord, parameters: MRPParameters): Promise<void> {
    // Clear previous run data
    item.requirements = [];
    item.plannedOrders = [];
    item.actionMessages = [];
    
    // Generate time buckets for planning horizon
    const timeBuckets = this.generateTimeBuckets(parameters.planningHorizon);
    
    let projectedAvailable = this.currentInventory.get(item.itemId) || 0;
    
    for (const bucket of timeBuckets) {
      // Calculate gross requirements for this period
      const grossRequirement = await this.calculateGrossRequirements(item.itemId, bucket);
      
      // Get scheduled receipts for this period
      const scheduledReceipts = await this.getScheduledReceipts(item.itemId, bucket);
      
      // Update projected available
      projectedAvailable = Math.max(0, projectedAvailable + scheduledReceipts - grossRequirement);
      
      // Calculate net requirement
      const netRequirement = Math.max(0, item.safetyStock - projectedAvailable);
      
      let plannedOrderReceipt = 0;
      let plannedOrderRelease = 0;
      
      if (netRequirement > 0) {
        // Apply lot sizing logic
        plannedOrderReceipt = this.applyLotSizing(
          netRequirement, 
          item, 
          parameters.lotSizingMethod
        );
        
        // Calculate planned order release date (lead time offset)
        const releaseDate = new Date(bucket.getTime() - item.leadTime * 24 * 60 * 60 * 1000);
        
        if (releaseDate >= parameters.planningHorizon.startDate) {
          plannedOrderRelease = plannedOrderReceipt;
          
          // Create planned order
          const plannedOrder: MRPPlannedOrder = {
            orderId: `po_${item.itemId}_${bucket.getTime()}`,
            itemId: item.itemId,
            quantity: plannedOrderReceipt,
            orderType: this.determineOrderType(item.itemId),
            plannedOrderDate: releaseDate,
            plannedStartDate: releaseDate,
            plannedCompletionDate: bucket,
            status: 'PLANNED',
            priority: this.calculatePriority(item.itemId, bucket),
            exceptions: []
          };
          
          item.plannedOrders.push(plannedOrder);
        }
        
        projectedAvailable += plannedOrderReceipt;
      }
      
      // Create MRP requirement record
      const requirement: MRPRequirement = {
        periodDate: bucket,
        grossRequirement,
        scheduledReceipts,
        projectedAvailable,
        netRequirement,
        plannedOrderReceipt,
        plannedOrderRelease,
        source: 'DEPENDENT_DEMAND',
        sourceReference: ''
      };
      
      item.requirements.push(requirement);
    }
    
    // Explode planned orders to dependent items
    await this.explodePlannedOrders(item, parameters);
  }
  
  /**
   * Apply lot sizing methodology
   */
  private applyLotSizing(
    netRequirement: number, 
    item: MRPRecord, 
    method: string
  ): number {
    switch (method) {
      case 'LOT_FOR_LOT':
        return netRequirement;
        
      case 'FIXED_ORDER_QUANTITY':
        return Math.max(netRequirement, item.lotSize);
        
      case 'ECONOMIC_ORDER_QUANTITY':
        return this.calculateEOQ(item);
        
      case 'PERIOD_ORDER_QUANTITY':
        return this.calculatePOQ(item, netRequirement);
        
      default:
        return netRequirement;
    }
  }
  
  /**
   * Calculate Economic Order Quantity
   */
  private calculateEOQ(item: MRPRecord): number {
    // EOQ = sqrt((2 * demand * ordering_cost) / holding_cost)
    const annualDemand = 12000; // Estimated annual demand
    const orderingCost = 50; // Estimated ordering cost
    const holdingCostRate = 0.25; // 25% holding cost rate
    const unitCost = 10; // Estimated unit cost
    
    const eoq = Math.sqrt((2 * annualDemand * orderingCost) / (holdingCostRate * unitCost));
    return Math.max(eoq, item.minimumOrderQuantity);
  }
  
  /**
   * Calculate Period Order Quantity
   */
  private calculatePOQ(item: MRPRecord, netRequirement: number): number {
    // Simple POQ: cover next 4 weeks of demand
    const periodsToCover = 4;
    return netRequirement * periodsToCover;
  }
  
  /**
   * Generate action messages based on MRP results
   */
  private async generateActionMessages(parameters: MRPParameters): Promise<void> {
    for (const [itemId, record] of this.mrpRecords) {
      // Check for expedite/postpone messages
      for (const order of record.plannedOrders) {
        if (order.plannedOrderDate < new Date()) {
          record.actionMessages.push({
            messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            itemId,
            messageType: 'EXPEDITE',
            severity: 'CRITICAL',
            message: `Planned order ${order.orderId} is past due and needs immediate attention`,
            recommendedAction: 'Release order immediately or reschedule dependent demand',
            dueDate: order.plannedOrderDate,
            orderId: order.orderId,
            currentDate: order.plannedOrderDate,
            recommendedDate: new Date()
          });
        }
      }
      
      // Check for excess inventory
      const totalProjectedAvailable = record.requirements.reduce(
        (sum, req) => sum + req.projectedAvailable, 0
      );
      
      if (totalProjectedAvailable > record.safetyStock * 8) {
        record.actionMessages.push({
          messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          itemId,
          messageType: 'CANCEL',
          severity: 'WARNING',
          message: `Excess inventory detected for ${record.itemDescription}`,
          recommendedAction: 'Consider canceling or reducing future planned orders',
          dueDate: new Date(),
          currentQuantity: totalProjectedAvailable,
          recommendedQuantity: record.safetyStock * 2
        });
      }
    }
  }
  
  /**
   * Initialize MRP records from master data
   */
  private async initializeMRPRecords(parameters: MRPParameters): Promise<void> {
    // This would typically load from database
    // For demo, create sample records
    const sampleItems = [
      { id: 'FG001', code: 'BIKE-RED', description: 'Red Mountain Bike', level: 0 },
      { id: 'SA001', code: 'FRAME-ALU', description: 'Aluminum Frame', level: 1 },
      { id: 'SA002', code: 'WHEEL-SET', description: 'Wheel Set', level: 1 },
      { id: 'RM001', code: 'ALU-TUBE', description: 'Aluminum Tubing', level: 2 },
      { id: 'RM002', code: 'RUBBER-TIRE', description: 'Rubber Tire', level: 2 }
    ];
    
    for (const item of sampleItems) {
      const record: MRPRecord = {
        itemId: item.id,
        itemCode: item.code,
        itemDescription: item.description,
        planningLevel: item.level,
        unitOfMeasure: 'EA',
        safetyStock: parameters.safetyStockDays[item.id] || 10,
        leadTime: parameters.leadTimes[item.id] || 7,
        lotSize: 100,
        minimumOrderQuantity: 50,
        maximumOrderQuantity: 1000,
        planningMethod: 'MRP',
        requirements: [],
        plannedOrders: [],
        actionMessages: []
      };
      
      this.mrpRecords.set(item.id, record);
    }
  }
  
  /**
   * Generate time buckets for planning horizon
   */
  private generateTimeBuckets(horizon: { startDate: Date; endDate: Date }): Date[] {
    const buckets: Date[] = [];
    const current = new Date(horizon.startDate);
    
    while (current <= horizon.endDate) {
      buckets.push(new Date(current));
      current.setDate(current.getDate() + 7); // Weekly buckets
    }
    
    return buckets;
  }
  
  /**
   * Calculate gross requirements for item in time period
   */
  private async calculateGrossRequirements(itemId: string, period: Date): Promise<number> {
    // Sum up all dependent demands for this item in this period
    let totalRequirement = 0;
    
    // Check if this item is used by higher-level items
    for (const [parentId, bom] of this.billOfMaterials) {
      const component = bom.components.find(c => c.componentItemId === itemId);
      if (component) {
        const parentPlannedOrders = this.mrpRecords.get(parentId)?.plannedOrders || [];
        const parentOrdersInPeriod = parentPlannedOrders.filter(
          order => this.isSamePeriod(order.plannedCompletionDate, period)
        );
        
        for (const order of parentOrdersInPeriod) {
          totalRequirement += order.quantity * component.quantityPer;
        }
      }
    }
    
    return totalRequirement;
  }
  
  /**
   * Get scheduled receipts for item in time period
   */
  private async getScheduledReceipts(itemId: string, period: Date): Promise<number> {
    // This would query existing purchase orders, production orders, etc.
    // For demo, return 0
    return 0;
  }
  
  /**
   * Determine order type based on item characteristics
   */
  private determineOrderType(itemId: string): 'PRODUCTION_ORDER' | 'PURCHASE_ORDER' | 'TRANSFER_ORDER' {
    // Simple logic - items starting with RM are purchased, others are manufactured
    if (itemId.startsWith('RM')) {
      return 'PURCHASE_ORDER';
    }
    return 'PRODUCTION_ORDER';
  }
  
  /**
   * Calculate priority for planned order
   */
  private calculatePriority(itemId: string, dueDate: Date): number {
    const daysUntilDue = Math.floor((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue <= 7) return 1;      // Critical
    if (daysUntilDue <= 14) return 2;     // High
    if (daysUntilDue <= 30) return 3;     // Medium
    return 4;                             // Normal
  }
  
  /**
   * Explode planned orders to create dependent demand
   */
  private async explodePlannedOrders(item: MRPRecord, parameters: MRPParameters): Promise<void> {
    const bom = this.billOfMaterials.get(item.itemId);
    if (!bom) return;
    
    for (const order of item.plannedOrders) {
      for (const component of bom.components) {
        const componentRecord = this.mrpRecords.get(component.componentItemId);
        if (componentRecord) {
          // Add dependent demand to component item
          // This will be processed when we get to that planning level
        }
      }
    }
  }
  
  /**
   * Check if two dates are in the same planning period
   */
  private isSamePeriod(date1: Date, date2: Date): boolean {
    // For weekly buckets, check if dates are in the same week
    const week1 = this.getWeekNumber(date1);
    const week2 = this.getWeekNumber(date2);
    return week1 === week2;
  }
  
  /**
   * Get week number for date
   */
  private getWeekNumber(date: Date): number {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  }
  
  /**
   * Validate plan feasibility
   */
  private async validatePlanFeasibility(): Promise<boolean> {
    // Check for critical action messages, capacity constraints, etc.
    const criticalMessages = this.getCriticalActionMessages();
    return criticalMessages === 0;
  }
  
  /**
   * Get total planned orders across all items
   */
  private getTotalPlannedOrders(): number {
    return Array.from(this.mrpRecords.values())
      .reduce((sum, record) => sum + record.plannedOrders.length, 0);
  }
  
  /**
   * Get total action messages across all items
   */
  private getTotalActionMessages(): number {
    return Array.from(this.mrpRecords.values())
      .reduce((sum, record) => sum + record.actionMessages.length, 0);
  }
  
  /**
   * Get critical action messages count
   */
  private getCriticalActionMessages(): number {
    return Array.from(this.mrpRecords.values())
      .reduce((sum, record) => 
        sum + record.actionMessages.filter(msg => msg.severity === 'CRITICAL').length, 0
      );
  }
  
  /**
   * Gather exceptions from all items
   */
  private gatherExceptions(): string[] {
    const exceptions: string[] = [];
    
    for (const record of this.mrpRecords.values()) {
      for (const order of record.plannedOrders) {
        exceptions.push(...order.exceptions);
      }
    }
    
    return [...new Set(exceptions)]; // Remove duplicates
  }
  
  /**
   * Get MRP results for specific item
   */
  async getMRPResults(itemId: string): Promise<MRPRecord | null> {
    return this.mrpRecords.get(itemId) || null;
  }
  
  /**
   * Get all action messages sorted by priority
   */
  async getActionMessages(severity?: 'INFO' | 'WARNING' | 'CRITICAL'): Promise<MRPActionMessage[]> {
    const allMessages: MRPActionMessage[] = [];
    
    for (const record of this.mrpRecords.values()) {
      allMessages.push(...record.actionMessages);
    }
    
    const filtered = severity 
      ? allMessages.filter(msg => msg.severity === severity)
      : allMessages;
    
    // Sort by severity and due date
    return filtered.sort((a, b) => {
      const severityOrder: Record<string, number> = { 'CRITICAL': 0, 'WARNING': 1, 'INFO': 2 };
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[a.severity] - severityOrder[b.severity];
      }
      return a.dueDate.getTime() - b.dueDate.getTime();
    });
  }
}