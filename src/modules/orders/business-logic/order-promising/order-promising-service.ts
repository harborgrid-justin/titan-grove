/**
 * Order Promising Service
 * ATP (Available to Promise) and delivery scheduling with Oracle EBS competitive features
 */

import type { 
  SalesOrder,
  OrderLineItem,
  Quote,
  QuoteLineItem,
  Priority
} from '../../types';

export interface AvailabilityCheck {
  itemId: string;
  itemCode: string;
  requestedQuantity: number;
  requestedDate: Date;
  availableQuantity: number;
  availabilityDate: Date;
  leadTime: number;
  shortage: number;
  substitutes: ItemSubstitute[];
  alternativeSources: AlternativeSource[];
  constraints: AvailabilityConstraint[];
}

export interface ItemSubstitute {
  itemId: string;
  itemCode: string;
  itemDescription: string;
  substitutionType: 'EXACT' | 'FUNCTIONAL' | 'UPGRADE' | 'DOWNGRADE';
  availableQuantity: number;
  availabilityDate: Date;
  priceDifference: number;
  approvalRequired: boolean;
  leadTime: number;
  preferenceRank: number;
}

export interface AlternativeSource {
  sourceType: 'WAREHOUSE' | 'SUPPLIER' | 'MANUFACTURING' | 'DROP_SHIP' | 'TRANSFER';
  sourceId: string;
  sourceName: string;
  availableQuantity: number;
  availabilityDate: Date;
  leadTime: number;
  cost: number;
  transitTime?: number;
  reliability: number;
  preferenceRank: number;
}

export interface AvailabilityConstraint {
  type: 'INVENTORY' | 'CAPACITY' | 'SUPPLIER' | 'QUALITY' | 'ALLOCATION' | 'HOLD';
  description: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  impact: string;
  resolution?: string;
  estimatedResolutionDate?: Date;
}

export interface PromiseDate {
  requestedDate: Date;
  promisedDate: Date;
  confidence: number;
  components: PromiseDateComponent[];
  assumptions: string[];
  risks: PromiseRisk[];
}

export interface PromiseDateComponent {
  component: 'PROCUREMENT' | 'MANUFACTURING' | 'INVENTORY' | 'SHIPPING' | 'BUFFER';
  description: string;
  duration: number;
  startDate: Date;
  endDate: Date;
  criticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface PromiseRisk {
  type: 'SUPPLY_SHORTAGE' | 'CAPACITY_CONSTRAINT' | 'QUALITY_ISSUE' | 'SHIPPING_DELAY' | 'SUPPLIER_ISSUE';
  description: string;
  probability: number;
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  mitigation?: string;
  contingencyPlan?: string;
}

export interface DeliverySchedule {
  orderId: string;
  customerId: string;
  totalLineItems: number;
  scheduledLineItems: number;
  deliveries: ScheduledDelivery[];
  consolidationOpportunities: ConsolidationOpportunity[];
  shippingCost: number;
  estimatedTotalDeliveryTime: number;
}

export interface ScheduledDelivery {
  deliveryNumber: string;
  plannedShipDate: Date;
  estimatedDeliveryDate: Date;
  deliveryMethod: string;
  warehouseId: string;
  lineItems: DeliveryLineItem[];
  shipmentWeight: number;
  shipmentVolume: number;
  shippingCost: number;
  priority: Priority;
  specialRequirements?: string[];
}

export interface DeliveryLineItem {
  orderLineItemId: string;
  itemId: string;
  itemCode: string;
  quantity: number;
  promisedDate: Date;
  confidence: number;
}

export interface ConsolidationOpportunity {
  type: 'DATE_CONSOLIDATION' | 'LOCATION_CONSOLIDATION' | 'CARRIER_CONSOLIDATION';
  description: string;
  affectedLineItems: string[];
  costSavings: number;
  deliveryImpact: number;
  customerImpact: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  recommendation: string;
}

export class OrderPromisingService {
  
  // ================================
  // AVAILABILITY CHECKING
  // ================================

  /**
   * Perform comprehensive ATP check for quote
   */
  async checkQuoteAvailability(
    quote: Quote,
    options?: {
      includeSubstitutes?: boolean;
      includeAlternativeSources?: boolean;
      maxLeadTime?: number;
      acceptPartialFulfillment?: boolean;
    }
  ): Promise<AvailabilityCheck[]> {
    
    const availabilityChecks: AvailabilityCheck[] = [];
    
    for (const lineItem of quote.lineItems) {
      const availabilityCheck = await this.performItemAvailabilityCheck(
        lineItem.itemId,
        lineItem.quantity,
        lineItem.requestedDate || quote.quoteDate,
        {
          customerId: quote.customerId,
          priority: quote.priority,
          territory: quote.territory,
          ...options
        }
      );
      
      availabilityChecks.push(availabilityCheck);
    }
    
    return availabilityChecks;
  }

  /**
   * Perform comprehensive ATP check for sales order
   */
  async checkOrderAvailability(
    order: SalesOrder,
    options?: {
      includeSubstitutes?: boolean;
      includeAlternativeSources?: boolean;
      maxLeadTime?: number;
      acceptPartialFulfillment?: boolean;
    }
  ): Promise<AvailabilityCheck[]> {
    
    const availabilityChecks: AvailabilityCheck[] = [];
    
    for (const lineItem of order.lineItems) {
      const availabilityCheck = await this.performItemAvailabilityCheck(
        lineItem.itemId,
        lineItem.quantity,
        lineItem.requestedDate,
        {
          customerId: order.customerId,
          priority: order.priority,
          territory: order.territory,
          contractId: order.contractId,
          ...options
        }
      );
      
      availabilityChecks.push(availabilityCheck);
    }
    
    return availabilityChecks;
  }

  /**
   * Perform detailed availability check for individual item
   */
  async performItemAvailabilityCheck(
    itemId: string,
    quantity: number,
    requestedDate: Date,
    context?: {
      customerId?: string;
      priority?: Priority;
      territory?: string;
      contractId?: string;
      warehouseId?: string;
      includeSubstitutes?: boolean;
      includeAlternativeSources?: boolean;
      maxLeadTime?: number;
    }
  ): Promise<AvailabilityCheck> {
    
    // Get current inventory levels
    const inventoryLevels = await this.getInventoryLevels(itemId, context?.warehouseId);
    
    // Calculate available quantity considering reservations and allocations
    const availableQuantity = this.calculateAvailableQuantity(inventoryLevels, requestedDate);
    
    // Determine availability date if quantity not available
    const availabilityDate = availableQuantity >= quantity ? 
      requestedDate : 
      await this.calculateAvailabilityDate(itemId, quantity, requestedDate, context);

    // Calculate shortage
    const shortage = Math.max(0, quantity - availableQuantity);

    // Find substitutes if requested and shortage exists
    const substitutes = (context?.includeSubstitutes && shortage > 0) ?
      await this.findItemSubstitutes(itemId, shortage, requestedDate, context) : [];

    // Find alternative sources if requested and shortage exists
    const alternativeSources = (context?.includeAlternativeSources && shortage > 0) ?
      await this.findAlternativeSources(itemId, shortage, requestedDate, context) : [];

    // Identify constraints
    const constraints = await this.identifyAvailabilityConstraints(itemId, quantity, requestedDate, context);

    // Calculate lead time
    const leadTime = this.calculateLeadTime(availabilityDate, requestedDate);

    return {
      itemId,
      itemCode: await this.getItemCode(itemId),
      requestedQuantity: quantity,
      requestedDate,
      availableQuantity: Math.max(0, availableQuantity),
      availabilityDate,
      leadTime,
      shortage,
      substitutes,
      alternativeSources,
      constraints
    };
  }

  // ================================
  // PROMISE DATE CALCULATION
  // ================================

  /**
   * Calculate promise dates for order line items
   */
  async calculatePromiseDates(
    order: SalesOrder,
    options?: {
      bufferDays?: number;
      confidenceLevel?: number;
      includeMakeToOrder?: boolean;
      optimizeForCost?: boolean;
      optimizeForSpeed?: boolean;
    }
  ): Promise<PromiseDate[]> {
    
    const promiseDates: PromiseDate[] = [];
    
    for (const lineItem of order.lineItems) {
      const promiseDate = await this.calculateLineItemPromiseDate(
        lineItem,
        order,
        options
      );
      promiseDates.push(promiseDate);
    }
    
    return promiseDates;
  }

  /**
   * Calculate promise date for individual line item
   */
  async calculateLineItemPromiseDate(
    lineItem: OrderLineItem,
    order: SalesOrder,
    options?: {
      bufferDays?: number;
      confidenceLevel?: number;
      includeMakeToOrder?: boolean;
      optimizeForCost?: boolean;
      optimizeForSpeed?: boolean;
    }
  ): Promise<PromiseDate> {
    
    const components: PromiseDateComponent[] = [];
    const risks: PromiseRisk[] = [];
    const assumptions: string[] = [];
    
    let currentDate = new Date();
    
    // Check if item is available in inventory
    const availabilityCheck = await this.performItemAvailabilityCheck(
      lineItem.itemId,
      lineItem.quantity,
      lineItem.requestedDate,
      { customerId: order.customerId, priority: order.priority }
    );

    if (availabilityCheck.shortage > 0) {
      // Item needs to be procured or manufactured
      if (await this.isItemManufactured(lineItem.itemId)) {
        // Manufacturing lead time
        const mfgLeadTime = await this.getManufacturingLeadTime(lineItem.itemId, availabilityCheck.shortage);
        components.push({
          component: 'MANUFACTURING',
          description: `Manufacturing time for ${availabilityCheck.shortage} units`,
          duration: mfgLeadTime,
          startDate: currentDate,
          endDate: new Date(currentDate.getTime() + mfgLeadTime * 24 * 60 * 60 * 1000),
          criticality: 'HIGH'
        });
        currentDate = new Date(currentDate.getTime() + mfgLeadTime * 24 * 60 * 60 * 1000);
        
        risks.push({
          type: 'CAPACITY_CONSTRAINT',
          description: 'Manufacturing capacity may be limited',
          probability: 0.3,
          impact: 'MEDIUM',
          mitigation: 'Monitor production schedule closely'
        });
      } else {
        // Procurement lead time
        const procurementLeadTime = await this.getProcurementLeadTime(lineItem.itemId, availabilityCheck.shortage);
        components.push({
          component: 'PROCUREMENT',
          description: `Procurement time for ${availabilityCheck.shortage} units`,
          duration: procurementLeadTime,
          startDate: currentDate,
          endDate: new Date(currentDate.getTime() + procurementLeadTime * 24 * 60 * 60 * 1000),
          criticality: 'HIGH'
        });
        currentDate = new Date(currentDate.getTime() + procurementLeadTime * 24 * 60 * 60 * 1000);
        
        risks.push({
          type: 'SUPPLIER_ISSUE',
          description: 'Supplier delivery may be delayed',
          probability: 0.2,
          impact: 'HIGH',
          mitigation: 'Maintain alternative supplier relationships'
        });
      }
    } else {
      // Item available in inventory
      components.push({
        component: 'INVENTORY',
        description: 'Item available in inventory',
        duration: 0,
        startDate: currentDate,
        endDate: currentDate,
        criticality: 'LOW'
      });
      assumptions.push('Inventory levels remain available until order processing');
    }

    // Add shipping time
    const shippingTime = await this.calculateShippingTime(
      order.shippingAddress,
      order.shippingMethod || 'GROUND'
    );
    components.push({
      component: 'SHIPPING',
      description: `Shipping time to ${order.shippingAddress.city}, ${order.shippingAddress.state}`,
      duration: shippingTime,
      startDate: currentDate,
      endDate: new Date(currentDate.getTime() + shippingTime * 24 * 60 * 60 * 1000),
      criticality: 'MEDIUM'
    });
    currentDate = new Date(currentDate.getTime() + shippingTime * 24 * 60 * 60 * 1000);

    // Add buffer time
    const bufferDays = options?.bufferDays || this.getDefaultBufferDays(order.priority);
    if (bufferDays > 0) {
      components.push({
        component: 'BUFFER',
        description: `Safety buffer for ${order.priority} priority order`,
        duration: bufferDays,
        startDate: currentDate,
        endDate: new Date(currentDate.getTime() + bufferDays * 24 * 60 * 60 * 1000),
        criticality: 'LOW'
      });
      currentDate = new Date(currentDate.getTime() + bufferDays * 24 * 60 * 60 * 1000);
    }

    // Calculate confidence based on risks and constraints
    const confidence = this.calculateConfidence(components, risks, availabilityCheck.constraints);

    return {
      requestedDate: lineItem.requestedDate,
      promisedDate: currentDate,
      confidence,
      components,
      assumptions,
      risks
    };
  }

  // ================================
  // DELIVERY SCHEDULING
  // ================================

  /**
   * Create optimized delivery schedule for order
   */
  async createDeliverySchedule(
    order: SalesOrder,
    options?: {
      allowSplitDelivery?: boolean;
      optimizeForCost?: boolean;
      consolidateShipments?: boolean;
      maxDeliveries?: number;
    }
  ): Promise<DeliverySchedule> {
    
    // Calculate promise dates for all line items
    const promiseDates = await this.calculatePromiseDates(order, {
      optimizeForCost: options?.optimizeForCost,
      optimizeForSpeed: !options?.optimizeForCost
    });

    // Group line items by availability date and warehouse
    const deliveryGroups = this.groupLineItemsForDelivery(order.lineItems, promiseDates, options);

    // Create scheduled deliveries
    const deliveries: ScheduledDelivery[] = [];
    for (const group of deliveryGroups) {
      const delivery = await this.createScheduledDelivery(group, order);
      deliveries.push(delivery);
    }

    // Sort deliveries by ship date
    deliveries.sort((a, b) => a.plannedShipDate.getTime() - b.plannedShipDate.getTime());

    // Find consolidation opportunities
    const consolidationOpportunities = options?.consolidateShipments ?
      await this.findConsolidationOpportunities(deliveries) : [];

    // Calculate total shipping cost
    const shippingCost = deliveries.reduce((sum, delivery) => sum + delivery.shippingCost, 0);

    // Calculate total delivery time
    const firstShipDate = deliveries[0]?.plannedShipDate;
    const lastDeliveryDate = deliveries[deliveries.length - 1]?.estimatedDeliveryDate;
    const estimatedTotalDeliveryTime = firstShipDate && lastDeliveryDate ?
      Math.ceil((lastDeliveryDate.getTime() - firstShipDate.getTime()) / (24 * 60 * 60 * 1000)) : 0;

    return {
      orderId: order.id,
      customerId: order.customerId,
      totalLineItems: order.lineItems.length,
      scheduledLineItems: deliveries.reduce((sum, delivery) => sum + delivery.lineItems.length, 0),
      deliveries,
      consolidationOpportunities,
      shippingCost,
      estimatedTotalDeliveryTime
    };
  }

  // ================================
  // HELPER METHODS
  // ================================

  private async getInventoryLevels(itemId: string, warehouseId?: string): Promise<any> {
    // Implementation would query inventory system
    return {
      onHand: 100,
      available: 85,
      reserved: 10,
      allocated: 5,
      onOrder: 50,
      inTransit: 20
    };
  }

  private calculateAvailableQuantity(inventoryLevels: any, requestedDate: Date): number {
    // Implementation would consider scheduled receipts and commitments
    return inventoryLevels.available;
  }

  private async calculateAvailabilityDate(itemId: string, quantity: number, requestedDate: Date, context?: any): Promise<Date> {
    // Implementation would consider supply schedule and lead times
    const leadTimeDays = await this.getItemLeadTime(itemId);
    const availabilityDate = new Date(requestedDate);
    availabilityDate.setDate(availabilityDate.getDate() + leadTimeDays);
    return availabilityDate;
  }

  private async findItemSubstitutes(itemId: string, shortage: number, requestedDate: Date, context?: any): Promise<ItemSubstitute[]> {
    // Implementation would query substitute items and their availability
    return [];
  }

  private async findAlternativeSources(itemId: string, shortage: number, requestedDate: Date, context?: any): Promise<AlternativeSource[]> {
    // Implementation would query alternative warehouses, suppliers, etc.
    return [];
  }

  private async identifyAvailabilityConstraints(itemId: string, quantity: number, requestedDate: Date, context?: any): Promise<AvailabilityConstraint[]> {
    // Implementation would identify various constraints
    return [];
  }

  private calculateLeadTime(availabilityDate: Date, requestedDate: Date): number {
    return Math.max(0, Math.ceil((availabilityDate.getTime() - requestedDate.getTime()) / (24 * 60 * 60 * 1000)));
  }

  private async getItemCode(itemId: string): Promise<string> {
    return `ITEM_${itemId}`;
  }

  private async isItemManufactured(itemId: string): Promise<boolean> {
    // Implementation would check if item is manufactured vs purchased
    return false;
  }

  private async getManufacturingLeadTime(itemId: string, quantity: number): Promise<number> {
    // Implementation would calculate manufacturing lead time
    return 10;
  }

  private async getProcurementLeadTime(itemId: string, quantity: number): Promise<number> {
    // Implementation would calculate procurement lead time
    return 7;
  }

  private async getItemLeadTime(itemId: string): Promise<number> {
    // Implementation would get standard lead time for item
    return 5;
  }

  private async calculateShippingTime(shippingAddress: any, shippingMethod: string): Promise<number> {
    // Implementation would calculate shipping time based on address and method
    const shippingTimes = {
      'OVERNIGHT': 1,
      'EXPRESS': 2,
      'GROUND': 5,
      'FREIGHT': 7
    };
    return shippingTimes[shippingMethod as keyof typeof shippingTimes] || 5;
  }

  private getDefaultBufferDays(priority: Priority): number {
    const bufferDays = {
      [Priority.LOW]: 3,
      [Priority.MEDIUM]: 2,
      [Priority.HIGH]: 1,
      [Priority.URGENT]: 0,
      [Priority.CRITICAL]: 0
    };
    return bufferDays[priority] || 2;
  }

  private calculateConfidence(components: PromiseDateComponent[], risks: PromiseRisk[], constraints: AvailabilityConstraint[]): number {
    // Implementation would calculate confidence score based on various factors
    let confidence = 0.9;
    
    // Reduce confidence based on risks
    for (const risk of risks) {
      const riskImpact = { LOW: 0.02, MEDIUM: 0.05, HIGH: 0.1, CRITICAL: 0.2 };
      confidence -= risk.probability * riskImpact[risk.impact];
    }

    // Reduce confidence based on constraints
    for (const constraint of constraints) {
      if (constraint.severity === 'ERROR' || constraint.severity === 'CRITICAL') {
        confidence -= 0.1;
      }
    }

    return Math.max(0.1, Math.min(1.0, confidence));
  }

  private groupLineItemsForDelivery(lineItems: OrderLineItem[], promiseDates: PromiseDate[], options?: any): any[] {
    // Implementation would group line items for optimal delivery
    return [{ lineItems, promiseDates }];
  }

  private async createScheduledDelivery(group: any, order: SalesOrder): Promise<ScheduledDelivery> {
    // Implementation would create a scheduled delivery from grouped items
    return {
      deliveryNumber: `DEL${Date.now().toString().slice(-6)}`,
      plannedShipDate: new Date(),
      estimatedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      deliveryMethod: order.shippingMethod || 'GROUND',
      warehouseId: 'WH001',
      lineItems: [],
      shipmentWeight: 0,
      shipmentVolume: 0,
      shippingCost: 0,
      priority: order.priority
    };
  }

  private async findConsolidationOpportunities(deliveries: ScheduledDelivery[]): Promise<ConsolidationOpportunity[]> {
    // Implementation would find opportunities to consolidate shipments
    return [];
  }
}

export const orderPromisingService = new OrderPromisingService();