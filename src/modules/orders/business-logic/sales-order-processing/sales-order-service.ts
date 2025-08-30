/**
 * Sales Order Processing Service
 * Comprehensive order entry, validation, and lifecycle management with Oracle EBS competitive features
 */

import type { 
  SalesOrder, 
  OrderLineItem, 
  OrderStatus, 
  OrderType,
  Priority,
  OrderHold,
  OrderApproval,
  OrderWorkflow,
  OrderAddress,
  HoldType,
  OrderMetrics
} from '../../types';

export class SalesOrderService {
  
  // ================================
  // CORE ORDER MANAGEMENT
  // ================================

  /**
   * Create a new sales order with comprehensive Oracle EBS features
   */
  async createSalesOrder(orderData: {
    customerId: string;
    customerName: string;
    customerPoNumber?: string;
    orderType?: OrderType;
    priority?: Priority;
    requestedDate: Date;
    salesChannelId?: string;
    salesRepId?: string;
    salesRepName?: string;
    territory?: string;
    priceListId?: string;
    currency?: string;
    exchangeRate?: number;
    paymentTermsId?: string;
    paymentTerms?: string;
    paymentMethodId?: string;
    shippingMethodId?: string;
    shippingMethod?: string;
    freightTerms?: string;
    taxExempt?: boolean;
    taxRegistrationNumber?: string;
    sourceSystemId?: string;
    sourceOrderId?: string;
    originalOrderId?: string;
    blanketOrderId?: string;
    contractId?: string;
    shippingAddress: OrderAddress;
    billingAddress: OrderAddress;
    lineItems: Omit<OrderLineItem, 'id' | 'lineStatus'>[];
    notes?: string;
    internalNotes?: string;
    customFields?: Record<string, any>;
    createdBy: string;
  }): Promise<SalesOrder> {
    
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const orderNumber = `SO${Date.now().toString().slice(-8)}`;
    
    // Process line items
    const processedLineItems: OrderLineItem[] = orderData.lineItems.map((item, index) => {
      const extendedPrice = (item.unitPrice * item.quantity) - (item.discountAmount || 0);
      const lineTotal = extendedPrice + (item.taxAmount || 0);
      
      return {
        ...item,
        id: `oli_${Date.now()}_${index}`,
        lineNumber: index + 1,
        extendedPrice: Math.round(extendedPrice * 100) / 100,
        lineTotal: Math.round(lineTotal * 100) / 100,
        scheduledShipDate: item.scheduledShipDate || orderData.requestedDate,
        lineStatus: OrderStatus.ENTERED
      };
    });

    // Calculate order totals
    const subtotal = processedLineItems.reduce((sum, item) => sum + item.extendedPrice, 0);
    const discountAmount = processedLineItems.reduce((sum, item) => sum + (item.discountAmount || 0), 0);
    const taxAmount = processedLineItems.reduce((sum, item) => sum + (item.taxAmount || 0), 0);
    const shippingAmount = await this.calculateShippingCost(processedLineItems, orderData.shippingAddress, orderData.shippingMethodId);
    const totalAmount = subtotal + taxAmount + shippingAmount;

    const salesOrder: SalesOrder = {
      id: orderId,
      orderNumber,
      customerId: orderData.customerId,
      customerName: orderData.customerName,
      customerPoNumber: orderData.customerPoNumber,
      status: OrderStatus.ENTERED,
      orderType: orderData.orderType || OrderType.STANDARD,
      priority: orderData.priority || Priority.MEDIUM,
      orderDate: new Date(),
      requestedDate: orderData.requestedDate,
      bookingDate: undefined,
      salesChannelId: orderData.salesChannelId,
      salesRepId: orderData.salesRepId,
      salesRepName: orderData.salesRepName,
      territory: orderData.territory,
      priceListId: orderData.priceListId,
      currency: orderData.currency || 'USD',
      exchangeRate: orderData.exchangeRate || await this.getExchangeRate(orderData.currency || 'USD'),
      paymentTermsId: orderData.paymentTermsId,
      paymentTerms: orderData.paymentTerms,
      paymentMethodId: orderData.paymentMethodId,
      shippingMethodId: orderData.shippingMethodId,
      shippingMethod: orderData.shippingMethod,
      freightTerms: orderData.freightTerms,
      taxExempt: orderData.taxExempt || false,
      taxRegistrationNumber: orderData.taxRegistrationNumber,
      sourceSystemId: orderData.sourceSystemId,
      sourceOrderId: orderData.sourceOrderId,
      originalOrderId: orderData.originalOrderId,
      blanketOrderId: orderData.blanketOrderId,
      contractId: orderData.contractId,
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress,
      lineItems: processedLineItems,
      subtotal: Math.round(subtotal * 100) / 100,
      discountAmount: Math.round(discountAmount * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      shippingAmount: Math.round(shippingAmount * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      paidAmount: 0,
      balanceAmount: Math.round(totalAmount * 100) / 100,
      holds: [],
      allocations: [],
      shipments: [],
      returns: [],
      workflows: [],
      notes: orderData.notes,
      internalNotes: orderData.internalNotes,
      customFields: orderData.customFields,
      approvals: [],
      createdDate: new Date(),
      modifiedDate: new Date(),
      createdBy: orderData.createdBy,
      modifiedBy: orderData.createdBy,
      version: 1
    };

    // Perform order validation
    await this.validateOrder(salesOrder);

    // Check for credit holds
    if (await this.requiresCreditCheck(salesOrder)) {
      const creditCheckResult = await this.performCreditCheck(salesOrder);
      if (!creditCheckResult.passed) {
        await this.applyOrderHold(orderId, HoldType.CREDIT, creditCheckResult.reason, orderData.createdBy);
      }
      salesOrder.creditCheckStatus = creditCheckResult.passed ? 'PASSED' : 'FAILED';
    }

    // Start order processing workflow
    await this.initiateOrderWorkflow(orderId, 'ORDER_PROCESSING');

    return salesOrder;
  }

  /**
   * Update existing sales order
   */
  async updateSalesOrder(
    orderId: string,
    updates: Partial<SalesOrder>,
    updatedBy: string
  ): Promise<SalesOrder> {
    const existingOrder = await this.getOrderById(orderId);
    if (!existingOrder) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    // Check if order can be modified
    if (!this.canModifyOrder(existingOrder)) {
      throw new Error(`Order ${existingOrder.orderNumber} cannot be modified in status ${existingOrder.status}`);
    }

    // Recalculate totals if line items changed
    if (updates.lineItems) {
      const subtotal = updates.lineItems.reduce((sum, item) => sum + item.extendedPrice, 0);
      const discountAmount = updates.lineItems.reduce((sum, item) => sum + (item.discountAmount || 0), 0);
      const taxAmount = updates.lineItems.reduce((sum, item) => sum + (item.taxAmount || 0), 0);
      const shippingAmount = await this.calculateShippingCost(updates.lineItems, existingOrder.shippingAddress, existingOrder.shippingMethodId);
      const totalAmount = subtotal + taxAmount + shippingAmount;

      updates.subtotal = Math.round(subtotal * 100) / 100;
      updates.discountAmount = Math.round(discountAmount * 100) / 100;
      updates.taxAmount = Math.round(taxAmount * 100) / 100;
      updates.shippingAmount = Math.round(shippingAmount * 100) / 100;
      updates.totalAmount = Math.round(totalAmount * 100) / 100;
      updates.balanceAmount = Math.round((totalAmount - existingOrder.paidAmount) * 100) / 100;
    }

    const updatedOrder: SalesOrder = {
      ...existingOrder,
      ...updates,
      version: existingOrder.version + 1,
      modifiedDate: new Date(),
      modifiedBy: updatedBy
    };

    // Validate updated order
    await this.validateOrder(updatedOrder);

    return updatedOrder;
  }

  /**
   * Book/Confirm a sales order
   */
  async bookOrder(orderId: string, bookedBy: string): Promise<SalesOrder> {
    const order = await this.getOrderById(orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    if (order.status !== OrderStatus.ENTERED) {
      throw new Error(`Only entered orders can be booked. Current status: ${order.status}`);
    }

    // Check for active holds
    const activeHolds = order.holds.filter(hold => hold.status === 'ACTIVE');
    if (activeHolds.length > 0) {
      throw new Error(`Order has active holds: ${activeHolds.map(h => h.holdType).join(', ')}`);
    }

    // Perform availability check
    const availabilityResult = await this.checkAvailability(order);
    if (!availabilityResult.available) {
      // Create back orders for unavailable items
      await this.createBackOrders(order, availabilityResult.shortfalls);
    }

    // Book the order
    const bookedOrder: SalesOrder = {
      ...order,
      status: availabilityResult.available ? OrderStatus.BOOKED : OrderStatus.CONFIRMED,
      bookingDate: new Date(),
      modifiedDate: new Date(),
      modifiedBy: bookedBy
    };

    // Start fulfillment workflow
    if (bookedOrder.status === OrderStatus.BOOKED) {
      await this.initiateOrderWorkflow(orderId, 'FULFILLMENT');
    }

    return bookedOrder;
  }

  /**
   * Cancel a sales order
   */
  async cancelOrder(
    orderId: string, 
    cancellationReason: string, 
    cancelledBy: string
  ): Promise<SalesOrder> {
    const order = await this.getOrderById(orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    if (!this.canCancelOrder(order)) {
      throw new Error(`Order ${order.orderNumber} cannot be cancelled in status ${order.status}`);
    }

    // Release any allocations
    await this.releaseOrderAllocations(orderId);

    // Cancel any active shipments
    await this.cancelOrderShipments(orderId);

    const cancelledOrder: SalesOrder = {
      ...order,
      status: OrderStatus.CANCELLED,
      internalNotes: `${order.internalNotes || ''}\nCancelled: ${cancellationReason}`.trim(),
      modifiedDate: new Date(),
      modifiedBy: cancelledBy
    };

    return cancelledOrder;
  }

  // ================================
  // ORDER HOLDS MANAGEMENT
  // ================================

  /**
   * Apply hold to order
   */
  async applyOrderHold(
    orderId: string,
    holdType: HoldType,
    reason: string,
    appliedBy: string,
    autoReleaseDate?: Date
  ): Promise<OrderHold> {
    const hold: OrderHold = {
      id: `hold_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      orderId,
      holdType,
      reason,
      description: this.getHoldDescription(holdType, reason),
      appliedDate: new Date(),
      appliedBy,
      status: 'ACTIVE',
      priority: this.getHoldPriority(holdType),
      autoReleaseDate,
      escalationDate: this.calculateEscalationDate(holdType)
    };

    return hold;
  }

  /**
   * Release order hold
   */
  async releaseOrderHold(
    holdId: string,
    releasedBy: string,
    releaseNotes?: string
  ): Promise<OrderHold> {
    // Implementation would update hold record
    const hold: OrderHold = {
      id: holdId,
      orderId: '',
      holdType: HoldType.MANUAL,
      reason: '',
      appliedDate: new Date(),
      appliedBy: '',
      releasedDate: new Date(),
      releasedBy,
      status: 'RELEASED',
      priority: Priority.MEDIUM
    };

    return hold;
  }

  // ================================
  // ORDER APPROVAL WORKFLOW
  // ================================

  /**
   * Submit order for approval
   */
  async submitOrderForApproval(
    orderId: string,
    approvalType: 'PRICING' | 'CREDIT' | 'DISCOUNT' | 'TERMS' | 'SPECIAL_ORDER' | 'MANAGER',
    submittedBy: string
  ): Promise<OrderApproval[]> {
    const order = await this.getOrderById(orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    const requiredApprovals = this.getRequiredApprovals(order, approvalType);
    const approvals: OrderApproval[] = requiredApprovals.map((approval, index) => ({
      id: `oa_${Date.now()}_${index}`,
      orderId,
      approvalType,
      approvalLevel: approval.level,
      requiredApprover: approval.approverId,
      status: 'PENDING',
      requestDate: new Date(),
      escalationDate: this.calculateApprovalEscalationDate(approval.level)
    }));

    return approvals;
  }

  /**
   * Process order approval
   */
  async processOrderApproval(
    approvalId: string,
    approverId: string,
    decision: 'APPROVED' | 'REJECTED',
    comments?: string
  ): Promise<OrderApproval> {
    // Implementation would update approval record and check if all approvals complete
    const approval: OrderApproval = {
      id: approvalId,
      orderId: '',
      approvalType: 'MANAGER',
      approvalLevel: 1,
      requiredApprover: approverId,
      actualApprover: approverId,
      status: decision,
      requestDate: new Date(),
      responseDate: new Date(),
      reason: comments
    };

    return approval;
  }

  // ================================
  // ORDER ANALYTICS AND REPORTING
  // ================================

  /**
   * Get order performance metrics
   */
  async getOrderMetrics(criteria?: {
    salesRepId?: string;
    territory?: string;
    customerId?: string;
    dateFrom?: Date;
    dateTo?: Date;
    orderType?: OrderType;
  }): Promise<OrderMetrics> {
    // Implementation would query database based on criteria
    // This is a mock implementation
    
    const mockMetrics: OrderMetrics = {
      totalOrders: 1245,
      totalRevenue: 8750000,
      averageOrderValue: 7028.11,
      orderFulfillmentRate: 0.94,
      averageFulfillmentTime: 2.3,
      returnRate: 0.025,
      onTimeDeliveryRate: 0.91,
      orderAccuracyRate: 0.985,
      backOrderRate: 0.08,
      periodComparison: {
        ordersGrowth: 0.15,
        revenueGrowth: 0.22,
        fulfillmentImprovement: 0.05
      }
    };

    return mockMetrics;
  }

  // ================================
  // HELPER METHODS
  // ================================

  private async calculateShippingCost(
    lineItems: OrderLineItem[], 
    shippingAddress: OrderAddress, 
    shippingMethodId?: string
  ): Promise<number> {
    // Implementation would integrate with shipping calculator
    const totalWeight = lineItems.reduce((sum, item) => sum + (item.quantity * 2), 0);
    const baseRate = shippingMethodId === 'EXPRESS' ? 15.00 : 8.50;
    return totalWeight * baseRate;
  }

  private async getExchangeRate(currency: string): Promise<number> {
    // Implementation would get current exchange rates
    return currency === 'USD' ? 1.0 : 1.25;
  }

  private async validateOrder(order: SalesOrder): Promise<void> {
    if (!order.lineItems.length) {
      throw new Error('Order must have at least one line item');
    }

    if (order.totalAmount <= 0) {
      throw new Error('Order total must be greater than zero');
    }

    // Validate addresses
    if (!order.shippingAddress.addressLine1) {
      throw new Error('Shipping address is required');
    }

    if (!order.billingAddress.addressLine1) {
      throw new Error('Billing address is required');
    }

    // Validate line items
    for (const item of order.lineItems) {
      if (item.quantity <= 0) {
        throw new Error(`Line item ${item.lineNumber}: Quantity must be greater than zero`);
      }
      if (item.unitPrice < 0) {
        throw new Error(`Line item ${item.lineNumber}: Unit price cannot be negative`);
      }
    }
  }

  private async requiresCreditCheck(order: SalesOrder): Promise<boolean> {
    // Implementation would check credit policy rules
    return order.totalAmount > 5000;
  }

  private async performCreditCheck(order: SalesOrder): Promise<{
    passed: boolean;
    reason?: string;
    creditLimit?: number;
    availableCredit?: number;
  }> {
    // Implementation would integrate with credit management system
    return {
      passed: true,
      creditLimit: 50000,
      availableCredit: 25000
    };
  }

  private canModifyOrder(order: SalesOrder): boolean {
    return [OrderStatus.DRAFT, OrderStatus.ENTERED].includes(order.status);
  }

  private canCancelOrder(order: SalesOrder): boolean {
    return ![OrderStatus.SHIPPED, OrderStatus.CLOSED, OrderStatus.CANCELLED].includes(order.status);
  }

  private async checkAvailability(order: SalesOrder): Promise<{
    available: boolean;
    shortfalls: Array<{ lineItemId: string; itemId: string; shortfall: number }>;
  }> {
    // Implementation would check inventory availability
    return {
      available: true,
      shortfalls: []
    };
  }

  private async createBackOrders(order: SalesOrder, shortfalls: any[]): Promise<void> {
    // Implementation would create back order records
  }

  private async initiateOrderWorkflow(orderId: string, workflowType: string): Promise<OrderWorkflow> {
    // Implementation would start workflow engine
    return {
      id: `workflow_${Date.now()}`,
      orderId,
      workflowType: workflowType as any,
      status: 'PENDING',
      currentStep: 'VALIDATION',
      totalSteps: 5,
      completedSteps: 0,
      startDate: new Date(),
      priority: Priority.MEDIUM,
      steps: [],
      createdDate: new Date(),
      modifiedDate: new Date()
    };
  }

  private async releaseOrderAllocations(orderId: string): Promise<void> {
    // Implementation would release inventory allocations
  }

  private async cancelOrderShipments(orderId: string): Promise<void> {
    // Implementation would cancel active shipments
  }

  private getHoldDescription(holdType: HoldType, reason: string): string {
    const descriptions = {
      [HoldType.CREDIT]: 'Credit limit exceeded or poor payment history',
      [HoldType.PRICING]: 'Pricing approval required',
      [HoldType.INVENTORY]: 'Inventory allocation issue',
      [HoldType.SHIPPING]: 'Shipping validation required',
      [HoldType.CUSTOMER]: 'Customer-specific hold',
      [HoldType.MANUAL]: reason,
      [HoldType.QUALITY]: 'Quality assurance hold'
    };
    return descriptions[holdType] || reason;
  }

  private getHoldPriority(holdType: HoldType): Priority {
    const priorities = {
      [HoldType.CREDIT]: Priority.HIGH,
      [HoldType.PRICING]: Priority.MEDIUM,
      [HoldType.INVENTORY]: Priority.HIGH,
      [HoldType.SHIPPING]: Priority.MEDIUM,
      [HoldType.CUSTOMER]: Priority.HIGH,
      [HoldType.MANUAL]: Priority.MEDIUM,
      [HoldType.QUALITY]: Priority.HIGH
    };
    return priorities[holdType] || Priority.MEDIUM;
  }

  private calculateEscalationDate(holdType: HoldType): Date | undefined {
    const escalationHours = {
      [HoldType.CREDIT]: 24,
      [HoldType.PRICING]: 4,
      [HoldType.INVENTORY]: 8,
      [HoldType.SHIPPING]: 12,
      [HoldType.CUSTOMER]: 48,
      [HoldType.MANUAL]: 24,
      [HoldType.QUALITY]: 12
    };

    const hours = escalationHours[holdType];
    if (!hours) return undefined;

    const escalationDate = new Date();
    escalationDate.setHours(escalationDate.getHours() + hours);
    return escalationDate;
  }

  private getRequiredApprovals(order: SalesOrder, approvalType: string): Array<{
    level: number;
    approverId: string;
  }> {
    // Implementation would determine required approvals based on business rules
    return [
      { level: 1, approverId: 'manager_001' }
    ];
  }

  private calculateApprovalEscalationDate(level: number): Date {
    const escalationDate = new Date();
    escalationDate.setHours(escalationDate.getHours() + (level * 24));
    return escalationDate;
  }

  private async getOrderById(orderId: string): Promise<SalesOrder | null> {
    // Implementation would retrieve from database
    return null;
  }
}

export const salesOrderService = new SalesOrderService();