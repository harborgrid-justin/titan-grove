/**
 * Order Management Module
 * Complete order-to-cash lifecycle management including sales orders, fulfillment, and shipping
 */

// Export all types
export * from './types';

// Export data access layer
export * from './data-access/repositories';

// Export business logic services
export * from './business-logic/orders-management/orders-service';

// Re-export existing interfaces for backward compatibility

// Core Order Management Interfaces
export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPO?: string;
  status: 'DRAFT' | 'CONFIRMED' | 'ALLOCATED' | 'PICKED' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'INVOICED' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  orderType: 'STANDARD' | 'RUSH' | 'DROPSHIP' | 'BACKORDER';
  orderDate: Date;
  requestedDate: Date;
  promisedDate?: Date;
  shippedDate?: Date;
  deliveredDate?: Date;
  salesRepId: string;
  territory: string;
  currency: string;
  exchangeRate: number;
  paymentTerms: string;
  shippingMethod: string;
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  lineItems: OrderLineItem[];
  allocations: OrderAllocation[];
  shipments: Shipment[];
  notes?: string;
  createdDate: Date;
  lastModified: Date;
}

export interface OrderLineItem {
  id: string;
  lineNumber: number;
  itemId: string;
  itemCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unitCost?: number;
  margin?: number;
  taxRate: number;
  taxAmount: number;
  discountPercent: number;
  discountAmount: number;
  netAmount: number;
  requestedDate: Date;
  promisedDate?: Date;
  allocatedQuantity: number;
  shippedQuantity: number;
  unitOfMeasure: string;
  warehouseId: string;
  reservationId?: string;
  projectId?: string;
  customAttributes?: Record<string, any>;
}

export interface OrderAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  instructions?: string;
}

export interface OrderAllocation {
  id: string;
  orderLineItemId: string;
  warehouseId: string;
  warehouseName: string;
  allocatedQuantity: number;
  allocationDate: Date;
  allocationStatus: 'RESERVED' | 'ALLOCATED' | 'PICKED' | 'SHIPPED';
  batchNumber?: string;
  serialNumbers?: string[];
  expirationDate?: Date;
}

export interface Shipment {
  id: string;
  shipmentNumber: string;
  orderId: string;
  warehouseId: string;
  carrierId: string;
  carrierName: string;
  shippingMethod: string;
  trackingNumber?: string;
  status: 'PLANNED' | 'PICKED' | 'PACKED' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED' | 'EXCEPTION';
  plannedShipDate: Date;
  actualShipDate?: Date;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  shippingAddress: OrderAddress;
  packageDetails: PackageDetail[];
  totalWeight: number;
  totalVolume: number;
  shippingCost: number;
  insuredValue?: number;
  specialInstructions?: string;
  createdDate: Date;
}

export interface PackageDetail {
  packageNumber: string;
  packageType: 'BOX' | 'ENVELOPE' | 'PALLET' | 'CRATE';
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  items: PackageItem[];
  trackingNumber?: string;
}

export interface PackageItem {
  orderLineItemId: string;
  itemCode: string;
  quantity: number;
  serialNumbers?: string[];
  batchNumbers?: string[];
}

export interface Quote {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'EXPIRED' | 'CONVERTED' | 'CANCELLED';
  quoteDate: Date;
  expirationDate: Date;
  salesRepId: string;
  currency: string;
  exchangeRate: number;
  paymentTerms: string;
  shippingTerms: string;
  validityPeriod: number; // days
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  lineItems: QuoteLineItem[];
  terms: string[];
  notes?: string;
  competitorInfo?: CompetitorInfo[];
  conversionProbability?: number;
  createdDate: Date;
}

export interface QuoteLineItem {
  id: string;
  lineNumber: number;
  itemId: string;
  itemCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  leadTime: number; // days
  unitOfMeasure: string;
  taxRate: number;
  discountPercent: number;
  alternativeItems?: AlternativeItem[];
}

export interface AlternativeItem {
  itemId: string;
  itemCode: string;
  description: string;
  unitPrice: number;
  leadTime: number;
  benefits: string;
}

export interface CompetitorInfo {
  competitorName: string;
  competitorPrice?: number;
  competitorAdvantages?: string[];
  ourAdvantages?: string[];
}

export interface Return {
  id: string;
  returnNumber: string;
  originalOrderId: string;
  customerId: string;
  customerName: string;
  status: 'REQUESTED' | 'AUTHORIZED' | 'RECEIVED' | 'PROCESSED' | 'REFUNDED' | 'EXCHANGED' | 'REJECTED';
  returnType: 'DEFECTIVE' | 'WRONG_ITEM' | 'CUSTOMER_CHANGE' | 'DAMAGED_IN_TRANSIT' | 'WARRANTY';
  reason: string;
  requestDate: Date;
  authorizedDate?: Date;
  receivedDate?: Date;
  processedDate?: Date;
  returnAddress: OrderAddress;
  lineItems: ReturnLineItem[];
  resolution: 'REFUND' | 'EXCHANGE' | 'CREDIT' | 'REPAIR';
  refundAmount?: number;
  restockingFee?: number;
  disposition: string;
  notes?: string;
  createdDate: Date;
}

export interface ReturnLineItem {
  id: string;
  originalOrderLineItemId: string;
  itemId: string;
  itemCode: string;
  description: string;
  returnQuantity: number;
  unitPrice: number;
  totalRefund: number;
  condition: 'NEW' | 'USED' | 'DAMAGED' | 'DEFECTIVE';
  returnReason: string;
  disposition: 'RESTOCK' | 'SCRAP' | 'REPAIR' | 'RETURN_TO_VENDOR';
  serialNumbers?: string[];
}

export interface BackOrder {
  id: string;
  backOrderNumber: string;
  originalOrderId: string;
  customerId: string;
  status: 'ACTIVE' | 'ALLOCATED' | 'SHIPPED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  createdDate: Date;
  expectedDate?: Date;
  lineItems: BackOrderLineItem[];
}

export interface BackOrderLineItem {
  orderLineItemId: string;
  itemId: string;
  itemCode: string;
  backOrderQuantity: number;
  expectedDate?: Date;
  allocationStatus: 'WAITING' | 'PARTIAL' | 'ALLOCATED';
}

export class OrderManager {
  /**
   * Quote Management
   */
  async createQuote(quote: Omit<Quote, 'id' | 'quoteNumber' | 'status' | 'createdDate'>): Promise<Quote> {
    const id = `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const quoteNumber = `QT${Date.now().toString().slice(-6)}`;
    
    return {
      ...quote,
      id,
      quoteNumber,
      status: 'DRAFT',
      createdDate: new Date()
    };
  }

  async convertQuoteToOrder(quoteId: string): Promise<SalesOrder> {
    console.log(`Converting quote ${quoteId} to sales order`);
    // Implementation would create sales order from quote
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const orderNumber = `SO${Date.now().toString().slice(-6)}`;
    
    // This would be populated from the quote data
    return {
      id: orderId,
      orderNumber,
      customerId: 'customer_123',
      customerName: 'Sample Customer',
      status: 'CONFIRMED',
      priority: 'MEDIUM',
      orderType: 'STANDARD',
      orderDate: new Date(),
      requestedDate: new Date(),
      salesRepId: 'rep_123',
      territory: 'WEST',
      currency: 'USD',
      exchangeRate: 1.0,
      paymentTerms: 'Net 30',
      shippingMethod: 'Ground',
      shippingAddress: {} as OrderAddress,
      billingAddress: {} as OrderAddress,
      subtotal: 0,
      taxAmount: 0,
      shippingAmount: 0,
      discountAmount: 0,
      totalAmount: 0,
      lineItems: [],
      allocations: [],
      shipments: [],
      createdDate: new Date(),
      lastModified: new Date()
    };
  }

  /**
   * Sales Order Management
   */
  async createSalesOrder(order: Omit<SalesOrder, 'id' | 'orderNumber' | 'status' | 'allocations' | 'shipments' | 'createdDate' | 'lastModified'>): Promise<SalesOrder> {
    const id = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const orderNumber = `SO${Date.now().toString().slice(-6)}`;
    
    return {
      ...order,
      id,
      orderNumber,
      status: 'DRAFT',
      allocations: [],
      shipments: [],
      createdDate: new Date(),
      lastModified: new Date()
    };
  }

  async confirmOrder(orderId: string): Promise<{
    status: 'CONFIRMED' | 'BACKORDER' | 'REJECTED';
    availabilityCheck: Array<{ itemId: string; available: number; shortfall: number }>;
    estimatedShipDate?: Date;
  }> {
    console.log(`Confirming order ${orderId}`);
    // Implementation would check inventory availability
    return {
      status: 'CONFIRMED',
      availabilityCheck: [],
      estimatedShipDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days
    };
  }

  async allocateOrder(orderId: string, warehouseId?: string): Promise<OrderAllocation[]> {
    console.log(`Allocating inventory for order ${orderId}`);
    // Implementation would allocate inventory to order lines
    return [];
  }

  async calculateOrderTotal(order: Partial<SalesOrder>): Promise<{
    subtotal: number;
    taxAmount: number;
    shippingAmount: number;
    discountAmount: number;
    totalAmount: number;
  }> {
    // Implementation would calculate order totals including taxes and shipping
    const subtotal = order.lineItems?.reduce((sum, item) => sum + item.totalPrice, 0) || 0;
    const taxAmount = subtotal * 0.08; // Example 8% tax
    const shippingAmount = 25.00; // Example shipping cost
    const discountAmount = 0;
    const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount;

    return {
      subtotal,
      taxAmount,
      shippingAmount,
      discountAmount,
      totalAmount
    };
  }

  /**
   * Order Fulfillment
   */
  async pickOrder(orderId: string, warehouseId: string): Promise<{
    pickListId: string;
    status: 'GENERATED' | 'ERROR';
    estimatedPickTime: number; // minutes
    pickInstructions: Array<{ itemCode: string; location: string; quantity: number }>;
  }> {
    console.log(`Generating pick list for order ${orderId}`);
    return {
      pickListId: `pick_${Date.now()}`,
      status: 'GENERATED',
      estimatedPickTime: 45,
      pickInstructions: []
    };
  }

  async packOrder(orderId: string, packagingDetails: Partial<PackageDetail>[]): Promise<Shipment> {
    console.log(`Packing order ${orderId}`);
    const shipmentId = `ship_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const shipmentNumber = `SH${Date.now().toString().slice(-6)}`;
    
    return {
      id: shipmentId,
      shipmentNumber,
      orderId,
      warehouseId: 'WH001',
      carrierId: 'carrier_001',
      carrierName: 'Sample Carrier',
      shippingMethod: 'Ground',
      status: 'PACKED',
      plannedShipDate: new Date(),
      shippingAddress: {} as OrderAddress,
      packageDetails: packagingDetails as PackageDetail[],
      totalWeight: 0,
      totalVolume: 0,
      shippingCost: 0,
      createdDate: new Date()
    };
  }

  async shipOrder(shipmentId: string): Promise<{
    status: 'SHIPPED' | 'ERROR';
    trackingNumber?: string;
    estimatedDeliveryDate?: Date;
    shippingLabel?: string; // base64 encoded
  }> {
    console.log(`Shipping order ${shipmentId}`);
    return {
      status: 'SHIPPED',
      trackingNumber: `TRK${Date.now()}`,
      estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      shippingLabel: 'base64EncodedLabel'
    };
  }

  /**
   * Return Management
   */
  async createReturn(returnData: Omit<Return, 'id' | 'returnNumber' | 'status' | 'createdDate'>): Promise<Return> {
    const id = `return_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const returnNumber = `RT${Date.now().toString().slice(-6)}`;
    
    return {
      ...returnData,
      id,
      returnNumber,
      status: 'REQUESTED',
      createdDate: new Date()
    };
  }

  async authorizeReturn(returnId: string, authorized: boolean, reason?: string): Promise<void> {
    console.log(`${authorized ? 'Authorizing' : 'Rejecting'} return ${returnId}`);
    if (!authorized && reason) {
      console.log(`Rejection reason: ${reason}`);
    }
  }

  async processReturnReceipt(returnId: string, receivedItems: Array<{
    returnLineItemId: string;
    receivedQuantity: number;
    condition: string;
    notes?: string;
  }>): Promise<void> {
    console.log(`Processing return receipt for ${returnId}`);
  }

  /**
   * Back Order Management
   */
  async createBackOrder(orderId: string, backOrderItems: Array<{
    orderLineItemId: string;
    backOrderQuantity: number;
  }>): Promise<BackOrder> {
    const id = `bo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const backOrderNumber = `BO${Date.now().toString().slice(-6)}`;
    
    return {
      id,
      backOrderNumber,
      originalOrderId: orderId,
      customerId: 'customer_123', // Would be retrieved from original order
      status: 'ACTIVE',
      priority: 'MEDIUM',
      createdDate: new Date(),
      lineItems: backOrderItems.map(item => ({
        ...item,
        itemId: 'item_123',
        itemCode: 'ITEM-001',
        allocationStatus: 'WAITING'
      }))
    };
  }

  async fulfillBackOrder(backOrderId: string): Promise<{
    status: 'FULFILLED' | 'PARTIALLY_FULFILLED' | 'NO_INVENTORY';
    fulfilledItems: Array<{ itemId: string; fulfilledQuantity: number }>;
    remainingBackOrders: Array<{ itemId: string; remainingQuantity: number }>;
  }> {
    console.log(`Attempting to fulfill back order ${backOrderId}`);
    return {
      status: 'FULFILLED',
      fulfilledItems: [],
      remainingBackOrders: []
    };
  }

  /**
   * Order Analytics
   */
  async getOrderMetrics(startDate: Date, endDate: Date): Promise<{
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    orderFulfillmentRate: number;
    averageFulfillmentTime: number; // hours
    onTimeDeliveryRate: number;
    returnRate: number;
    backOrderRate: number;
    topProducts: Array<{ itemCode: string; quantity: number; revenue: number }>;
  }> {
    // Implementation would analyze order data
    return {
      totalOrders: 1250,
      totalRevenue: 2850000,
      averageOrderValue: 2280,
      orderFulfillmentRate: 95.5,
      averageFulfillmentTime: 18.5,
      onTimeDeliveryRate: 92.3,
      returnRate: 2.1,
      backOrderRate: 4.5,
      topProducts: []
    };
  }
}

export const orderManager = new OrderManager();