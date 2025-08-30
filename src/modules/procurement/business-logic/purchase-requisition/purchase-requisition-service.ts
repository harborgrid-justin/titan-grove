/**
 * Purchase Requisition Service
 * Business logic for purchase requisition management
 */

import { 
  PurchaseRequisition, 
  RequisitionStatus,
  RequisitionLineItem,
  ApprovalRecord,
  ProcurementSearchCriteria
} from '../../types';
import { purchaseRequisitionRepository } from '../../data-access/repositories';
import { PaginatedResponse, SearchParams, Priority } from '../../../../types/common';

export class PurchaseRequisitionService {
  
  /**
   * Create a new purchase requisition
   */
  async createPurchaseRequisition(
    data: Omit<PurchaseRequisition, 'id' | 'requisitionNumber' | 'status' | 'approvals' | 'currentApprovalLevel' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>
  ): Promise<PurchaseRequisition> {
    this.validateRequisitionData(data);
    
    // Generate requisition number
    const requisitionNumber = await this.generateRequisitionNumber();
    
    // Calculate totals
    const { subtotal, tax, total } = this.calculateTotals(data.lineItems);
    
    const requisitionData = {
      ...data,
      requisitionNumber,
      status: RequisitionStatus.DRAFT,
      approvals: [],
      currentApprovalLevel: 0,
      subtotal,
      tax,
      total,
      priority: data.priority || Priority.MEDIUM,
      createdBy: 'system',
      updatedBy: 'system'
    };
    
    return await purchaseRequisitionRepository.create(requisitionData);
  }

  /**
   * Get requisition by ID
   */
  async getRequisitionById(id: string): Promise<PurchaseRequisition | null> {
    return await purchaseRequisitionRepository.getById(id);
  }

  /**
   * Get requisition by requisition number
   */
  async getRequisitionByNumber(requisitionNumber: string): Promise<PurchaseRequisition | null> {
    return await purchaseRequisitionRepository.getByRequisitionNumber(requisitionNumber);
  }

  /**
   * Update requisition
   */
  async updateRequisition(id: string, updates: Partial<PurchaseRequisition>): Promise<PurchaseRequisition> {
    const existing = await purchaseRequisitionRepository.getById(id);
    if (!existing) {
      throw new Error(`Purchase requisition with ID ${id} not found`);
    }
    
    // Don't allow updates to submitted or approved requisitions
    if (existing.status !== RequisitionStatus.DRAFT) {
      throw new Error('Cannot modify requisition that has been submitted');
    }
    
    // Recalculate totals if line items are updated
    if (updates.lineItems) {
      const { subtotal, tax, total } = this.calculateTotals(updates.lineItems);
      updates.subtotal = subtotal;
      updates.tax = tax;
      updates.total = total;
    }
    
    return await purchaseRequisitionRepository.update(id, updates);
  }

  /**
   * Delete requisition
   */
  async deleteRequisition(id: string): Promise<void> {
    const existing = await purchaseRequisitionRepository.getById(id);
    if (!existing) {
      throw new Error(`Purchase requisition with ID ${id} not found`);
    }
    
    // Only allow deletion of draft requisitions
    if (existing.status !== RequisitionStatus.DRAFT) {
      throw new Error('Cannot delete requisition that has been submitted');
    }
    
    await purchaseRequisitionRepository.delete(id);
  }

  /**
   * Submit requisition for approval
   */
  async submitRequisitionForApproval(requisitionId: string): Promise<{
    status: 'SUBMITTED' | 'ERROR';
    nextApprover?: string;
    estimatedApprovalTime: number; // hours
  }> {
    const requisition = await this.getRequisitionById(requisitionId);
    if (!requisition) {
      throw new Error(`Purchase requisition with ID ${requisitionId} not found`);
    }
    
    if (requisition.status !== RequisitionStatus.DRAFT) {
      throw new Error('Requisition has already been submitted');
    }
    
    // Validate requisition before submission
    this.validateRequisitionForSubmission(requisition);
    
    // Determine approval workflow
    const approvalWorkflow = await this.determineApprovalWorkflow(requisition);
    const nextApprover = approvalWorkflow.approvers[0];
    
    // Update status
    await this.updateRequisition(requisitionId, {
      status: RequisitionStatus.SUBMITTED,
      currentApprovalLevel: 1
    });
    
    // Create approval record
    await this.createApprovalRecord(requisitionId, nextApprover, 'PENDING');
    
    return {
      status: 'SUBMITTED',
      nextApprover: nextApprover,
      estimatedApprovalTime: approvalWorkflow.estimatedHours
    };
  }

  /**
   * Approve requisition
   */
  async approveRequisition(
    requisitionId: string, 
    approverId: string, 
    comments?: string
  ): Promise<void> {
    const requisition = await this.getRequisitionById(requisitionId);
    if (!requisition) {
      throw new Error(`Purchase requisition with ID ${requisitionId} not found`);
    }
    
    // Find pending approval record
    const pendingApproval = requisition.approvals.find(
      a => a.status === 'PENDING' && a.approverRole === approverId
    );
    
    if (!pendingApproval) {
      throw new Error('No pending approval found for this approver');
    }
    
    // Update approval record
    pendingApproval.status = 'APPROVED';
    pendingApproval.approvedBy = approverId;
    pendingApproval.approvedAt = new Date();
    pendingApproval.comments = comments;
    
    // Check if all required approvals are complete
    const workflow = await this.determineApprovalWorkflow(requisition);
    const allApproved = workflow.approvers.every(approver =>
      requisition.approvals.some(a => a.approverRole === approver && a.status === 'APPROVED')
    );
    
    if (allApproved) {
      // Final approval - update status
      await this.updateRequisition(requisitionId, {
        status: RequisitionStatus.APPROVED,
        approvals: requisition.approvals
      });
    } else {
      // More approvals needed
      const nextApproverIndex = workflow.approvers.findIndex(a => a === approverId) + 1;
      const nextApprover = workflow.approvers[nextApproverIndex];
      
      await this.createApprovalRecord(requisitionId, nextApprover, 'PENDING');
      await this.updateRequisition(requisitionId, {
        currentApprovalLevel: nextApproverIndex + 1,
        approvals: requisition.approvals
      });
    }
  }

  /**
   * Reject requisition
   */
  async rejectRequisition(
    requisitionId: string, 
    rejectorId: string, 
    reason: string
  ): Promise<void> {
    const requisition = await this.getRequisitionById(requisitionId);
    if (!requisition) {
      throw new Error(`Purchase requisition with ID ${requisitionId} not found`);
    }
    
    // Find pending approval record
    const pendingApproval = requisition.approvals.find(
      a => a.status === 'PENDING' && a.approverRole === rejectorId
    );
    
    if (!pendingApproval) {
      throw new Error('No pending approval found for this approver');
    }
    
    // Update approval record
    pendingApproval.status = 'REJECTED';
    pendingApproval.rejectedBy = rejectorId;
    pendingApproval.rejectedAt = new Date();
    pendingApproval.comments = reason;
    
    // Update requisition status
    await this.updateRequisition(requisitionId, {
      status: RequisitionStatus.REJECTED,
      approvals: requisition.approvals
    });
  }

  /**
   * Convert approved requisition to purchase order
   */
  async convertToPurchaseOrder(requisitionId: string): Promise<string> {
    const requisition = await this.getRequisitionById(requisitionId);
    if (!requisition) {
      throw new Error(`Purchase requisition with ID ${requisitionId} not found`);
    }
    
    if (requisition.status !== RequisitionStatus.APPROVED) {
      throw new Error('Only approved requisitions can be converted to purchase orders');
    }
    
    // In real implementation, this would create a purchase order
    // For now, just update the status
    await this.updateRequisition(requisitionId, {
      status: RequisitionStatus.CONVERTED_TO_PO
    });
    
    // Return mock PO ID
    return `po_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Search requisitions
   */
  async searchRequisitions(
    criteria: ProcurementSearchCriteria, 
    params?: SearchParams
  ): Promise<PaginatedResponse<PurchaseRequisition>> {
    return await purchaseRequisitionRepository.search(criteria, params);
  }

  /**
   * Get requisitions by status
   */
  async getRequisitionsByStatus(status: RequisitionStatus): Promise<PurchaseRequisition[]> {
    return await purchaseRequisitionRepository.getByStatus(status);
  }

  /**
   * Get pending approvals for approver
   */
  async getPendingApprovals(approverId?: string): Promise<PurchaseRequisition[]> {
    return await purchaseRequisitionRepository.getPendingApprovals(approverId);
  }

  /**
   * Get requisitions by requestor
   */
  async getRequisitionsByRequestor(requestorId: string): Promise<PurchaseRequisition[]> {
    return await purchaseRequisitionRepository.getByRequestor(requestorId);
  }

  // Private helper methods
  
  private validateRequisitionData(data: Partial<PurchaseRequisition>): void {
    if (!data.title || data.title.trim() === '') {
      throw new Error('Requisition title is required');
    }
    
    if (!data.requestorId) {
      throw new Error('Requestor ID is required');
    }
    
    if (!data.departmentId) {
      throw new Error('Department ID is required');
    }
    
    if (!data.businessJustification || data.businessJustification.trim() === '') {
      throw new Error('Business justification is required');
    }
    
    if (!data.lineItems || data.lineItems.length === 0) {
      throw new Error('At least one line item is required');
    }
    
    // Validate line items
    data.lineItems.forEach((item, index) => {
      if (!item.description || item.description.trim() === '') {
        throw new Error(`Line item ${index + 1}: Description is required`);
      }
      
      if (item.quantity <= 0) {
        throw new Error(`Line item ${index + 1}: Quantity must be greater than 0`);
      }
      
      if (item.unitPrice.amount <= 0) {
        throw new Error(`Line item ${index + 1}: Unit price must be greater than 0`);
      }
    });
  }

  private validateRequisitionForSubmission(requisition: PurchaseRequisition): void {
    // Additional validations for submission
    if (requisition.total.amount <= 0) {
      throw new Error('Requisition total must be greater than 0');
    }
    
    // Check for required approvals based on amount
    const totalAmount = requisition.total.amount;
    if (totalAmount > 10000 && !requisition.costCenterId) {
      throw new Error('Cost center is required for requisitions over $10,000');
    }
  }

  private calculateTotals(lineItems: RequisitionLineItem[]): {
    subtotal: any;
    tax: any;
    total: any;
  } {
    const subtotalAmount = lineItems.reduce((sum, item) => sum + item.totalPrice.amount, 0);
    const taxAmount = subtotalAmount * 0.08; // 8% tax rate
    const totalAmount = subtotalAmount + taxAmount;
    
    // Use the currency from the first line item (assuming all items use same currency)
    const currency = lineItems[0]?.totalPrice?.currency || 'USD';
    
    return {
      subtotal: { amount: subtotalAmount, currency },
      tax: { amount: taxAmount, currency },
      total: { amount: totalAmount, currency }
    };
  }

  private async generateRequisitionNumber(): Promise<string> {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `PR${timestamp.toString().slice(-6)}${random}`;
  }

  private async determineApprovalWorkflow(requisition: PurchaseRequisition): Promise<{
    approvers: string[];
    estimatedHours: number;
  }> {
    const totalAmount = requisition.total.amount;
    
    // Simple approval workflow based on amount
    if (totalAmount < 1000) {
      return {
        approvers: ['manager'],
        estimatedHours: 4
      };
    } else if (totalAmount < 10000) {
      return {
        approvers: ['manager', 'director'],
        estimatedHours: 24
      };
    } else {
      return {
        approvers: ['manager', 'director', 'vp'],
        estimatedHours: 48
      };
    }
  }

  private async createApprovalRecord(
    requisitionId: string, 
    approverId: string, 
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
  ): Promise<void> {
    // In real implementation, this would create an approval record
    // For now, this is a placeholder
  }
}

export const purchaseRequisitionService = new PurchaseRequisitionService();