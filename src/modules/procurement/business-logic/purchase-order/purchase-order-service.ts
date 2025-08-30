/**
 * Purchase Order Service
 * Business logic for purchase order management
 */

import type { 
  PurchaseOrder, 
  PurchaseOrderStatus,
  POType,
  ProcurementSearchCriteria
} from '../../types';
import { purchaseOrderRepository } from '../../data-access/repositories';
import { PaginatedResponse, SearchParams } from '../../../../types/common';

export class PurchaseOrderService {
  
  /**
   * Create a new purchase order
   */
  async createPurchaseOrder(
    data: Omit<PurchaseOrder, 'id' | 'poNumber' | 'status' | 'approvals' | 'revisions' | 'orderDate' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>
  ): Promise<PurchaseOrder> {
    this.validatePOData(data);
    
    const poNumber = await this.generatePONumber();
    const { subtotal, tax, total } = this.calculateTotals(data.lineItems);
    
    const poData = {
      ...data,
      poNumber,
      status: PurchaseOrderStatus.DRAFT,
      approvals: [],
      revisions: [],
      orderDate: new Date(),
      subtotal,
      tax,
      total: {
        amount: subtotal.amount + tax.amount + (data.shipping?.amount || 0) - (data.discount?.amount || 0),
        currency: subtotal.currency
      }
    };
    
    return await purchaseOrderRepository.create(poData);
  }

  async getPurchaseOrderById(id: string): Promise<PurchaseOrder | null> {
    return await purchaseOrderRepository.getById(id);
  }

  async updatePurchaseOrder(id: string, updates: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    const existing = await purchaseOrderRepository.getById(id);
    if (!existing) {
      throw new Error(`Purchase order with ID ${id} not found`);
    }
    
    return await purchaseOrderRepository.update(id, updates);
  }

  async sendToSupplier(poId: string): Promise<{ status: 'SENT' | 'ERROR'; sentDate: Date }> {
    const po = await this.getPurchaseOrderById(poId);
    if (!po) {
      throw new Error(`Purchase order with ID ${poId} not found`);
    }
    
    if (po.status !== PurchaseOrderStatus.APPROVED) {
      throw new Error('Only approved purchase orders can be sent to suppliers');
    }
    
    await this.updatePurchaseOrder(poId, {
      status: PurchaseOrderStatus.SENT_TO_SUPPLIER
    });
    
    return {
      status: 'SENT',
      sentDate: new Date()
    };
  }

  async searchPurchaseOrders(
    criteria: ProcurementSearchCriteria, 
    params?: SearchParams
  ): Promise<PaginatedResponse<PurchaseOrder>> {
    return await purchaseOrderRepository.search(criteria, params);
  }

  private validatePOData(data: Partial<PurchaseOrder>): void {
    if (!data.title || data.title.trim() === '') {
      throw new Error('Purchase order title is required');
    }
    
    if (!data.supplierId) {
      throw new Error('Supplier ID is required');
    }
    
    if (!data.lineItems || data.lineItems.length === 0) {
      throw new Error('At least one line item is required');
    }
  }

  private calculateTotals(lineItems: any[]): { subtotal: any; tax: any } {
    const subtotalAmount = lineItems.reduce((sum, item) => sum + item.totalPrice.amount, 0);
    const taxAmount = subtotalAmount * 0.08;
    const currency = lineItems[0]?.totalPrice?.currency || 'USD';
    
    return {
      subtotal: { amount: subtotalAmount, currency },
      tax: { amount: taxAmount, currency }
    };
  }

  private async generatePONumber(): Promise<string> {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `PO${timestamp.toString().slice(-6)}${random}`;
  }
}

export const purchaseOrderService = new PurchaseOrderService();