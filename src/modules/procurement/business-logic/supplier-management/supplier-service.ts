/**
 * Supplier Management Service
 * Business logic for supplier management operations
 */

import {
  Supplier,
  SupplierSearchCriteria,
  SupplierStatus,
  PerformanceLevel,
  RiskLevel,
} from '../../types';
import { supplierRepository } from '../../data-access/repositories';
import { PaginatedResponse, SearchParams } from '../../../../types/common';

export class SupplierService {
  /**
   * Create a new supplier
   */
  async createSupplier(
    data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>
  ): Promise<Supplier> {
    this.validateSupplierData(data);

    // Generate supplier number
    const supplierNumber = await this.generateSupplierNumber();

    const supplierData = {
      ...data,
      supplierNumber,
      status: data.status || SupplierStatus.PENDING_APPROVAL,
      performanceRating: data.performanceRating || PerformanceLevel.MEDIUM,
      riskRating: data.riskRating || RiskLevel.MEDIUM,
      preferredSupplier: data.preferredSupplier || false,
      approvedCategories: data.approvedCategories || [],
      contacts: data.contacts || [],
      addresses: data.addresses || [],
      bankDetails: data.bankDetails || [],
      certifications: data.certifications || [],
      insurancePolicies: data.insurancePolicies || [],
      createdBy: 'system',
      updatedBy: 'system',
    };

    return await supplierRepository.create(supplierData);
  }

  /**
   * Get supplier by ID
   */
  async getSupplierById(id: string): Promise<Supplier | null> {
    return await supplierRepository.getById(id);
  }

  /**
   * Get supplier by supplier number
   */
  async getSupplierByNumber(supplierNumber: string): Promise<Supplier | null> {
    return await supplierRepository.getBySupplierNumber(supplierNumber);
  }

  /**
   * Update supplier information
   */
  async updateSupplier(id: string, updates: Partial<Supplier>): Promise<Supplier> {
    const existing = await supplierRepository.getById(id);
    if (!existing) {
      throw new Error(`Supplier with ID ${id} not found`);
    }

    // Validate updates if they include critical fields
    if (updates.legalName || updates.taxId || updates.category) {
      this.validateSupplierData({ ...existing, ...updates } as any);
    }

    return await supplierRepository.update(id, updates);
  }

  /**
   * Delete supplier
   */
  async deleteSupplier(id: string): Promise<void> {
    const existing = await supplierRepository.getById(id);
    if (!existing) {
      throw new Error(`Supplier with ID ${id} not found`);
    }

    // Check if supplier has active contracts or orders
    const hasActiveRelationships = await this.checkActiveRelationships(id);
    if (hasActiveRelationships) {
      throw new Error('Cannot delete supplier with active contracts or purchase orders');
    }

    await supplierRepository.delete(id);
  }

  /**
   * Search suppliers with criteria and pagination
   */
  async searchSuppliers(
    criteria: SupplierSearchCriteria,
    params?: SearchParams
  ): Promise<PaginatedResponse<Supplier>> {
    return await supplierRepository.search(criteria, params);
  }

  /**
   * Get suppliers by category
   */
  async getSuppliersByCategory(category: string): Promise<Supplier[]> {
    return await supplierRepository.getByCategory(category);
  }

  /**
   * Get preferred suppliers
   */
  async getPreferredSuppliers(): Promise<Supplier[]> {
    return await supplierRepository.getPreferredSuppliers();
  }

  /**
   * Evaluate supplier performance
   */
  async evaluateSupplierPerformance(supplierId: string): Promise<{
    overallRating: PerformanceLevel;
    qualityScore: number;
    deliveryScore: number;
    costScore: number;
    serviceScore: number;
    recommendations: string[];
  }> {
    const supplier = await this.getSupplierById(supplierId);
    if (!supplier) {
      throw new Error(`Supplier with ID ${supplierId} not found`);
    }

    // Mock performance evaluation - in real implementation, this would analyze:
    // - Delivery performance data
    // - Quality metrics
    // - Cost competitiveness
    // - Service levels

    return {
      overallRating: PerformanceLevel.HIGH,
      qualityScore: 8.5,
      deliveryScore: 9.2,
      costScore: 7.8,
      serviceScore: 8.9,
      recommendations: [
        'Consider for preferred supplier status',
        'Negotiate better pricing terms',
        'Expand to additional categories',
      ],
    };
  }

  /**
   * Conduct supplier risk assessment
   */
  async conductSupplierRiskAssessment(supplierId: string): Promise<{
    riskRating: RiskLevel;
    riskFactors: Array<{ factor: string; severity: string; mitigation: string }>;
    overallScore: number;
  }> {
    const supplier = await this.getSupplierById(supplierId);
    if (!supplier) {
      throw new Error(`Supplier with ID ${supplierId} not found`);
    }

    // Mock risk assessment - in real implementation, this would analyze:
    // - Financial stability
    // - Geographic risks
    // - Regulatory compliance
    // - Operational risks
    // - Cyber security risks

    return {
      riskRating: RiskLevel.LOW,
      riskFactors: [
        {
          factor: 'Financial Stability',
          severity: 'LOW',
          mitigation: 'Monitor quarterly financial reports',
        },
        {
          factor: 'Geographic Concentration',
          severity: 'MEDIUM',
          mitigation: 'Develop alternative suppliers in different regions',
        },
      ],
      overallScore: 7.5,
    };
  }

  /**
   * Update supplier performance rating
   */
  async updatePerformanceRating(supplierId: string, rating: PerformanceLevel): Promise<void> {
    await supplierRepository.updatePerformanceRating(supplierId, rating);
  }

  /**
   * Update supplier risk rating
   */
  async updateRiskRating(supplierId: string, rating: RiskLevel): Promise<void> {
    await supplierRepository.updateRiskRating(supplierId, rating);
  }

  /**
   * Get suppliers due for review
   */
  async getSuppliersForReview(daysOverdue?: number): Promise<Supplier[]> {
    return await supplierRepository.getSuppliersForReview(daysOverdue);
  }

  /**
   * Approve supplier for business
   */
  async approveSupplier(supplierId: string, approvedCategories: string[]): Promise<Supplier> {
    const supplier = await this.getSupplierById(supplierId);
    if (!supplier) {
      throw new Error(`Supplier with ID ${supplierId} not found`);
    }

    if (supplier.status !== SupplierStatus.PENDING_APPROVAL) {
      throw new Error('Supplier is not in pending approval status');
    }

    return await this.updateSupplier(supplierId, {
      status: SupplierStatus.ACTIVE,
      approvedCategories,
    });
  }

  /**
   * Suspend supplier
   */
  async suspendSupplier(supplierId: string, reason: string): Promise<Supplier> {
    const supplier = await this.getSupplierById(supplierId);
    if (!supplier) {
      throw new Error(`Supplier with ID ${supplierId} not found`);
    }

    return await this.updateSupplier(supplierId, {
      status: SupplierStatus.SUSPENDED,
    });
  }

  // Private helper methods

  private validateSupplierData(data: Partial<Supplier>): void {
    if (!data.legalName || data.legalName.trim() === '') {
      throw new Error('Legal name is required');
    }

    if (!data.taxId || data.taxId.trim() === '') {
      throw new Error('Tax ID is required');
    }

    if (!data.category) {
      throw new Error('Supplier category is required');
    }

    if (!data.primaryContact || !data.primaryContact.firstName || !data.primaryContact.lastName) {
      throw new Error('Primary contact information is required');
    }

    if (!data.businessAddress || !data.businessAddress.street || !data.businessAddress.city) {
      throw new Error('Business address is required');
    }
  }

  private async generateSupplierNumber(): Promise<string> {
    // In real implementation, this would generate a unique sequential number
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `SUP${timestamp.toString().slice(-6)}${random}`;
  }

  private async checkActiveRelationships(supplierId: string): Promise<boolean> {
    // In real implementation, this would check:
    // - Active purchase orders
    // - Active contracts
    // - Pending RFQs
    // - Outstanding invoices

    return false; // Mock implementation
  }
}

export const supplierService = new SupplierService();
