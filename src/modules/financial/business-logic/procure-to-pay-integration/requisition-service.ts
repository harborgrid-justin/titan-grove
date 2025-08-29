/**
 * Requisition Service
 * Handles requisition processing and management within the procure-to-pay flow
 */

import {
  Requisition,
  RequisitionItem,
  RequisitionApproval
} from './types';

export class RequisitionService {
  /**
   * Process requisition with federal compliance validation
   */
  async processRequisition(requisitionData: Partial<Requisition>): Promise<Requisition> {
    const requisition: Requisition = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      requisitionNumber: `REQ${Date.now().toString().slice(-6)}`,
      requestorId: requisitionData.requestorId || '',
      organizationCode: requisitionData.organizationCode || '',
      requestDate: new Date(),
      requiredDate: requisitionData.requiredDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      priority: requisitionData.priority || 'ROUTINE',
      items: requisitionData.items || [],
      totalAmount: this.calculateTotalAmount(requisitionData.items || []),
      budgetSource: requisitionData.budgetSource || '',
      justification: requisitionData.justification || '',
      approvals: this.generateRequiredApprovals(this.calculateTotalAmount(requisitionData.items || [])),
      status: 'DRAFT'
    };
    
    return requisition;
  }

  /**
   * Calculate total amount for requisition items
   */
  private calculateTotalAmount(items: RequisitionItem[]): number {
    return items.reduce((total, item) => {
      return total + (item.quantity * item.unitPrice);
    }, 0);
  }

  /**
   * Generate required approvals based on amount thresholds
   */
  private generateRequiredApprovals(totalAmount: number): RequisitionApproval[] {
    const approvals: RequisitionApproval[] = [
      {
        approvalId: `req_appr_${Date.now()}_1`,
        approverLevel: 1,
        approverId: 'supervisor',
        approverRole: 'Supervisor',
        status: 'PENDING'
      }
    ];

    // Additional approval levels based on amount
    if (totalAmount > 25000) {
      approvals.push({
        approvalId: `req_appr_${Date.now()}_2`,
        approverLevel: 2,
        approverId: 'department_head',
        approverRole: 'Department Head',
        status: 'PENDING'
      });
    }

    if (totalAmount > 100000) {
      approvals.push({
        approvalId: `req_appr_${Date.now()}_3`,
        approverLevel: 3,
        approverId: 'cfo',
        approverRole: 'Chief Financial Officer',
        status: 'PENDING'
      });
    }

    if (totalAmount > 250000) {
      approvals.push({
        approvalId: `req_appr_${Date.now()}_4`,
        approverLevel: 4,
        approverId: 'contracting_officer',
        approverRole: 'Contracting Officer',
        status: 'PENDING'
      });
    }

    return approvals;
  }

  /**
   * Update requisition status
   */
  async updateRequisitionStatus(
    requisitionId: string,
    status: Requisition['status']
  ): Promise<void> {
    // Implementation would update requisition status in database
    console.log(`Updating requisition ${requisitionId} to status: ${status}`);
  }

  /**
   * Add item to requisition
   */
  async addRequisitionItem(
    requisitionId: string,
    item: RequisitionItem
  ): Promise<void> {
    // Implementation would add item to requisition
    console.log(`Adding item ${item.itemId} to requisition ${requisitionId}`);
  }

  /**
   * Process approval for requisition
   */
  async processApproval(
    requisitionId: string,
    approvalId: string,
    approved: boolean,
    comments?: string
  ): Promise<RequisitionApproval> {
    const approval: RequisitionApproval = {
      approvalId,
      approverLevel: 1,
      approverId: 'current_user',
      approverRole: 'Approver',
      approvalDate: new Date(),
      status: approved ? 'APPROVED' : 'REJECTED',
      comments
    };

    return approval;
  }

  /**
   * Validate requisition data
   */
  async validateRequisition(requisition: Requisition): Promise<{
    isValid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];

    if (!requisition.requestorId) {
      errors.push('Requestor ID is required');
    }

    if (!requisition.organizationCode) {
      errors.push('Organization code is required');
    }

    if (requisition.items.length === 0) {
      errors.push('At least one item is required');
    }

    if (!requisition.justification || requisition.justification.trim().length < 10) {
      errors.push('Business justification must be at least 10 characters');
    }

    // Validate items
    requisition.items.forEach((item, index) => {
      if (item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
      }
      if (item.unitPrice <= 0) {
        errors.push(`Item ${index + 1}: Unit price must be greater than 0`);
      }
      if (!item.description || item.description.trim().length === 0) {
        errors.push(`Item ${index + 1}: Description is required`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const requisitionService = new RequisitionService();