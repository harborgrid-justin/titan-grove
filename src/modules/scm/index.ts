/**
 */

// Export all types
export * from './types';

// Export data access layer
export * from './data-access/repositories';

// Export business logic services
export * from './business-logic/scm-management/scm-service';
export * from './business-logic/mobile-supply-chain/mobile-supply-chain-service';
export * from './supply-chain-coordination-service';

// Re-export existing interfaces for backward compatibility

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  unitOfMeasure: string;
  unitCost: number;
  listPrice: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  isActive: boolean;
  supplier?: string;
  minimumStockLevel: number;
  maximumStockLevel: number;
}

export interface InventoryItem {
  productId: string;
  locationId: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;
  lastUpdated: Date;
  averageCost: number;
  serialNumbers?: string[];
  expirationDate?: Date;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  orderDate: Date;
  expectedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  status: 'DRAFT' | 'SENT' | 'CONFIRMED' | 'RECEIVED' | 'INVOICED' | 'PAID' | 'CANCELLED';
  items: PurchaseOrderItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  createdBy: string;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  description: string;
  quantityOrdered: number;
  quantityReceived: number;
  unitPrice: number;
  totalAmount: number;
  needByDate?: Date;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  orderDate: Date;
  requestedDeliveryDate: Date;
  promisedDeliveryDate?: Date;
  actualShipDate?: Date;
  status: 'DRAFT' | 'CONFIRMED' | 'PICKED' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'INVOICED' | 'CANCELLED';
  items: SalesOrderItem[];
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  salesRep: string;
}

export interface SalesOrderItem {
  id: string;
  productId: string;
  productName: string;
  quantityOrdered: number;
  quantityShipped: number;
  unitPrice: number;
  discount: number;
  totalAmount: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: SCMAddress;
  paymentTerms: string;
  isActive: boolean;
  rating: number;
  leadTime: number; // in days
}

export interface SCMAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  productId: string;
  productName: string;
  quantityToProduce: number;
  quantityProduced: number;
  startDate: Date;
  targetCompletionDate: Date;
  actualCompletionDate?: Date;
  status: 'PLANNED' | 'RELEASED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  materials: WorkOrderMaterial[];
}

export interface WorkOrderMaterial {
  productId: string;
  productName: string;
  quantityRequired: number;
  quantityIssued: number;
  unitCost: number;
}

export class SCMManager {
  /**
   * Product Management
   */
  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const id = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { ...product, id };
  }

  async updateProduct(productId: string, updates: Partial<Product>): Promise<Product> {
    console.log(`Updating product ${productId} with`, updates);
    return {} as Product;
  }

  /**
   * Inventory Management
   */
  async getInventoryLevel(productId: string, locationId: string): Promise<InventoryItem | null> {
    // Implementation would retrieve current inventory levels
    return {
      productId,
      locationId,
      quantityOnHand: 100,
      quantityReserved: 20,
      quantityAvailable: 80,
      lastUpdated: new Date(),
      averageCost: 25.50
    };
  }

  async adjustInventory(productId: string, locationId: string, adjustmentQuantity: number, reason: string): Promise<void> {
    console.log(`Adjusting inventory for product ${productId} at location ${locationId} by ${adjustmentQuantity}. Reason: ${reason}`);
  }

  async reserveInventory(productId: string, locationId: string, quantity: number, orderId: string): Promise<boolean> {
    // Implementation would reserve inventory for a sales order
    console.log(`Reserving ${quantity} units of product ${productId} at location ${locationId} for order ${orderId}`);
    return true;
  }

  async checkLowStockItems(): Promise<Product[]> {
    // Implementation would return products below minimum stock level
    return [];
  }

  /**
   * Purchase Order Management
   */
  async createPurchaseOrder(po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'subtotal' | 'totalAmount'>): Promise<PurchaseOrder> {
    const id = `po_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const poNumber = `PO${Date.now().toString().slice(-6)}`;
    
    const subtotal = po.items.reduce((sum, item) => sum + item.totalAmount, 0);
    const totalAmount = subtotal + po.taxAmount;
    
    return {
      ...po,
      id,
      poNumber,
      subtotal,
      totalAmount,
      status: 'DRAFT'
    };
  }

  async receivePurchaseOrder(poId: string, receivedItems: Array<{itemId: string, quantityReceived: number}>): Promise<void> {
    console.log(`Receiving purchase order ${poId}`, receivedItems);
    // Implementation would update inventory and PO status
  }

  /**
   * Sales Order Management
   */
  async createSalesOrder(so: Omit<SalesOrder, 'id' | 'orderNumber' | 'subtotal' | 'totalAmount'>): Promise<SalesOrder> {
    const id = `so_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const orderNumber = `SO${Date.now().toString().slice(-6)}`;
    
    const subtotal = so.items.reduce((sum, item) => sum + item.totalAmount, 0);
    const totalAmount = subtotal + so.taxAmount + so.shippingAmount;
    
    return {
      ...so,
      id,
      orderNumber,
      subtotal,
      totalAmount,
      status: 'DRAFT'
    };
  }

  async pickSalesOrder(salesOrderId: string): Promise<void> {
    console.log(`Picking sales order ${salesOrderId}`);
    // Implementation would create pick list and update order status
  }

  async shipSalesOrder(salesOrderId: string, trackingNumber: string, carrier: string): Promise<void> {
    console.log(`Shipping sales order ${salesOrderId} via ${carrier} with tracking ${trackingNumber}`);
  }

  /**
   * Supplier Management
   */
  async createSupplier(supplier: Omit<Supplier, 'id'>): Promise<Supplier> {
    const id = `supp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { ...supplier, id };
  }

  async evaluateSupplierPerformance(supplierId: string): Promise<any> {
    return {
      supplierId,
      onTimeDeliveryRate: 95,
      qualityRating: 4.5,
      averageLeadTime: 7,
      priceCompetitiveness: 'GOOD',
      totalPurchaseVolume: 50000,
      issuesCount: 2
    };
  }

  /**
   * Manufacturing Management
   */
  async createWorkOrder(workOrder: Omit<WorkOrder, 'id' | 'workOrderNumber' | 'quantityProduced'>): Promise<WorkOrder> {
    const id = `wo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const workOrderNumber = `WO${Date.now().toString().slice(-6)}`;
    
    return {
      ...workOrder,
      id,
      workOrderNumber,
      quantityProduced: 0,
      status: 'PLANNED'
    };
  }

  async startProduction(workOrderId: string): Promise<void> {
    console.log(`Starting production for work order ${workOrderId}`);
    // Implementation would issue materials and update status
  }

  async recordProduction(workOrderId: string, quantityProduced: number): Promise<void> {
    console.log(`Recording production of ${quantityProduced} units for work order ${workOrderId}`);
  }

  /**
   * Supply Chain Analytics
   */
  async getInventoryTurnover(productId?: string): Promise<any> {
    return {
      productId,
      turnoverRatio: 6.5,
      averageInventoryValue: 15000,
      costOfGoodsSold: 97500,
      daysInInventory: 56
    };
  }

  async getSupplierPerformanceMetrics(): Promise<any> {
    return {
      averageLeadTime: 8.5,
      onTimeDeliveryRate: 92,
      qualityMetrics: {
        defectRate: 0.02,
        returnRate: 0.01
      },
      costSavings: 25000
    };
  }

  async getOrderFulfillmentMetrics(): Promise<any> {
    return {
      orderFillRate: 96,
      perfectOrderRate: 89,
      averageOrderCycleTime: 3.5,
      backorderRate: 4,
      onTimeShipmentRate: 94
    };
  }

  async getMaterialRequirementsPlanning(days: number = 30): Promise<any> {
    return {
      planningHorizon: days,
      requirements: [],
      suggestedPurchases: [],
      criticalShortages: []
    };
  }
}

export const scmManager = new SCMManager();