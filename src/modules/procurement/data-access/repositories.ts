/**
 * Procurement Data Access Layer
 * Database operations and data persistence for procurement management
 */

import type { 
  ProcurementEntity,
  Supplier,
  SupplierSearchCriteria,
  PurchaseRequisition,
  PurchaseOrder,
  RFQ,
  RFQResponse,
  Contract,
  ProcurementAnalytics,
  ProcurementSearchCriteria
} from '../types';
import { PaginatedResponse, SearchParams } from '../../../types/common';

// =============================================================================
// CORE PROCUREMENT REPOSITORY
// =============================================================================

export interface ProcurementRepository {
  create(entity: Omit<ProcurementEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProcurementEntity>;
  getById(id: string): Promise<ProcurementEntity | null>;
  update(id: string, updates: Partial<ProcurementEntity>): Promise<ProcurementEntity>;
  delete(id: string): Promise<void>;
  getAll(): Promise<ProcurementEntity[]>;
}

// =============================================================================
// SUPPLIER REPOSITORY
// =============================================================================

export interface SupplierRepository {
  // Basic CRUD operations
  create(supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<Supplier>;
  getById(id: string): Promise<Supplier | null>;
  getBySupplierNumber(supplierNumber: string): Promise<Supplier | null>;
  update(id: string, updates: Partial<Supplier>): Promise<Supplier>;
  delete(id: string): Promise<void>;
  
  // Search and filtering
  search(criteria: SupplierSearchCriteria, params?: SearchParams): Promise<PaginatedResponse<Supplier>>;
  getByCategory(category: string): Promise<Supplier[]>;
  getByStatus(status: string): Promise<Supplier[]>;
  getPreferredSuppliers(): Promise<Supplier[]>;
  
  // Performance and risk operations
  updatePerformanceRating(id: string, rating: string): Promise<void>;
  updateRiskRating(id: string, rating: string): Promise<void>;
  getSuppliersForReview(daysOverdue?: number): Promise<Supplier[]>;
  
  // Analytics support
  getSpendBySupplier(startDate: Date, endDate: Date): Promise<Array<{supplierId: string; totalSpend: number}>>;
}

// =============================================================================
// PURCHASE REQUISITION REPOSITORY
// =============================================================================

export interface PurchaseRequisitionRepository {
  // Basic CRUD operations
  create(requisition: Omit<PurchaseRequisition, 'id' | 'createdAt' | 'updatedAt'>): Promise<PurchaseRequisition>;
  getById(id: string): Promise<PurchaseRequisition | null>;
  getByRequisitionNumber(requisitionNumber: string): Promise<PurchaseRequisition | null>;
  update(id: string, updates: Partial<PurchaseRequisition>): Promise<PurchaseRequisition>;
  delete(id: string): Promise<void>;
  
  // Status and workflow operations
  getByStatus(status: string): Promise<PurchaseRequisition[]>;
  getByRequestor(requestorId: string): Promise<PurchaseRequisition[]>;
  getByDepartment(departmentId: string): Promise<PurchaseRequisition[]>;
  getPendingApprovals(approverId?: string): Promise<PurchaseRequisition[]>;
  
  // Search and reporting
  search(criteria: ProcurementSearchCriteria, params?: SearchParams): Promise<PaginatedResponse<PurchaseRequisition>>;
  getRequisitionsByDateRange(startDate: Date, endDate: Date): Promise<PurchaseRequisition[]>;
}

// =============================================================================
// PURCHASE ORDER REPOSITORY
// =============================================================================

export interface PurchaseOrderRepository {
  // Basic CRUD operations
  create(po: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<PurchaseOrder>;
  getById(id: string): Promise<PurchaseOrder | null>;
  getByPONumber(poNumber: string): Promise<PurchaseOrder | null>;
  update(id: string, updates: Partial<PurchaseOrder>): Promise<PurchaseOrder>;
  delete(id: string): Promise<void>;
  
  // Status and workflow operations
  getByStatus(status: string): Promise<PurchaseOrder[]>;
  getBySupplier(supplierId: string): Promise<PurchaseOrder[]>;
  getByRequestor(requestorId: string): Promise<PurchaseOrder[]>;
  getPendingApprovals(): Promise<PurchaseOrder[]>;
  getOverdueDeliveries(): Promise<PurchaseOrder[]>;
  
  // Search and reporting
  search(criteria: ProcurementSearchCriteria, params?: SearchParams): Promise<PaginatedResponse<PurchaseOrder>>;
  getPOsByDateRange(startDate: Date, endDate: Date): Promise<PurchaseOrder[]>;
  
  // Analytics support
  getSpendAnalytics(startDate: Date, endDate: Date): Promise<any>;
}

// =============================================================================
// RFQ REPOSITORY
// =============================================================================

export interface RFQRepository {
  // Basic CRUD operations
  create(rfq: Omit<RFQ, 'id' | 'createdAt' | 'updatedAt'>): Promise<RFQ>;
  getById(id: string): Promise<RFQ | null>;
  getByRFQNumber(rfqNumber: string): Promise<RFQ | null>;
  update(id: string, updates: Partial<RFQ>): Promise<RFQ>;
  delete(id: string): Promise<void>;
  
  // Status operations
  getByStatus(status: string): Promise<RFQ[]>;
  getActiveRFQs(): Promise<RFQ[]>;
  getClosingRFQs(daysAhead?: number): Promise<RFQ[]>;
  
  // Response management
  addResponse(rfqId: string, response: Omit<RFQResponse, 'id' | 'createdAt' | 'updatedAt'>): Promise<RFQResponse>;
  getResponsesByRFQ(rfqId: string): Promise<RFQResponse[]>;
  getResponsesBySupplier(supplierId: string): Promise<RFQResponse[]>;
  
  // Search and analytics
  search(criteria: ProcurementSearchCriteria, params?: SearchParams): Promise<PaginatedResponse<RFQ>>;
}

// =============================================================================
// CONTRACT REPOSITORY
// =============================================================================

export interface ContractRepository {
  // Basic CRUD operations
  create(contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contract>;
  getById(id: string): Promise<Contract | null>;
  getByContractNumber(contractNumber: string): Promise<Contract | null>;
  update(id: string, updates: Partial<Contract>): Promise<Contract>;
  delete(id: string): Promise<void>;
  
  // Status and lifecycle operations
  getByStatus(status: string): Promise<Contract[]>;
  getBySupplier(supplierId: string): Promise<Contract[]>;
  getActiveContracts(): Promise<Contract[]>;
  getExpiringContracts(daysAhead?: number): Promise<Contract[]>;
  getContractsForRenewal(): Promise<Contract[]>;
  
  // Performance tracking
  updatePerformance(id: string, performance: any): Promise<void>;
  getContractsForReview(): Promise<Contract[]>;
  
  // Search and analytics
  search(criteria: ProcurementSearchCriteria, params?: SearchParams): Promise<PaginatedResponse<Contract>>;
  getContractsByDateRange(startDate: Date, endDate: Date): Promise<Contract[]>;
  getContractAnalytics(startDate: Date, endDate: Date): Promise<any>;
}

// =============================================================================
// PROCUREMENT ANALYTICS REPOSITORY
// =============================================================================

export interface ProcurementAnalyticsRepository {
  // Spend analytics
  getSpendByCategory(startDate: Date, endDate: Date): Promise<any[]>;
  getSpendBySupplier(startDate: Date, endDate: Date): Promise<any[]>;
  getSpendTrend(startDate: Date, endDate: Date, granularity: 'DAILY' | 'WEEKLY' | 'MONTHLY'): Promise<any[]>;
  
  // Savings analytics
  getSavingsAnalytics(startDate: Date, endDate: Date): Promise<any>;
  
  // Performance metrics
  getCycleTimeMetrics(startDate: Date, endDate: Date): Promise<any>;
  getQualityMetrics(startDate: Date, endDate: Date): Promise<any>;
  getComplianceMetrics(startDate: Date, endDate: Date): Promise<any>;
  
  // Risk analytics
  getRiskAnalytics(startDate: Date, endDate: Date): Promise<any>;
  
  // Dashboard data
  getDashboardData(startDate: Date, endDate: Date): Promise<ProcurementAnalytics>;
}

// =============================================================================
// MOCK IMPLEMENTATIONS
// =============================================================================

export class MockProcurementRepository implements ProcurementRepository {
  private entities: ProcurementEntity[] = [];

  async create(entity: Omit<ProcurementEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProcurementEntity> {
    const newEntity: ProcurementEntity = {
      ...entity,
      id: `procurement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system',
      updatedBy: 'system'
    };
    this.entities.push(newEntity);
    return newEntity;
  }

  async getById(id: string): Promise<ProcurementEntity | null> {
    return this.entities.find(entity => entity.id === id) || null;
  }

  async update(id: string, updates: Partial<ProcurementEntity>): Promise<ProcurementEntity> {
    const index = this.entities.findIndex(entity => entity.id === id);
    if (index === -1) {
      throw new Error(`Procurement entity with id ${id} not found`);
    }
    
    this.entities[index] = {
      ...this.entities[index],
      ...updates,
      updatedAt: new Date(),
      updatedBy: 'system'
    };
    
    return this.entities[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.entities.findIndex(entity => entity.id === id);
    if (index === -1) {
      throw new Error(`Procurement entity with id ${id} not found`);
    }
    this.entities.splice(index, 1);
  }

  async getAll(): Promise<ProcurementEntity[]> {
    return this.entities;
  }
}

export class MockSupplierRepository implements SupplierRepository {
  private suppliers: Supplier[] = [];

  async create(supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<Supplier> {
    const newSupplier: Supplier = {
      ...supplier,
      id: `supplier_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system',
      updatedBy: 'system'
    };
    this.suppliers.push(newSupplier);
    return newSupplier;
  }

  async getById(id: string): Promise<Supplier | null> {
    return this.suppliers.find(s => s.id === id) || null;
  }

  async getBySupplierNumber(supplierNumber: string): Promise<Supplier | null> {
    return this.suppliers.find(s => s.supplierNumber === supplierNumber) || null;
  }

  async update(id: string, updates: Partial<Supplier>): Promise<Supplier> {
    const index = this.suppliers.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Supplier with id ${id} not found`);
    }
    
    this.suppliers[index] = {
      ...this.suppliers[index],
      ...updates,
      updatedAt: new Date(),
      updatedBy: 'system'
    };
    
    return this.suppliers[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.suppliers.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Supplier with id ${id} not found`);
    }
    this.suppliers.splice(index, 1);
  }

  async search(criteria: SupplierSearchCriteria, params?: SearchParams): Promise<PaginatedResponse<Supplier>> {
    // Mock implementation - return empty paginated response
    return {
      items: [],
      totalCount: 0,
      page: params?.page || 1,
      pageSize: params?.pageSize || 10,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false
    };
  }

  async getByCategory(category: string): Promise<Supplier[]> {
    return this.suppliers.filter(s => s.category === category);
  }

  async getByStatus(status: string): Promise<Supplier[]> {
    return this.suppliers.filter(s => s.status === status);
  }

  async getPreferredSuppliers(): Promise<Supplier[]> {
    return this.suppliers.filter(s => s.preferredSupplier);
  }

  async updatePerformanceRating(id: string, rating: string): Promise<void> {
    await this.update(id, { performanceRating: rating as any });
  }

  async updateRiskRating(id: string, rating: string): Promise<void> {
    await this.update(id, { riskRating: rating as any });
  }

  async getSuppliersForReview(daysOverdue?: number): Promise<Supplier[]> {
    return [];
  }

  async getSpendBySupplier(startDate: Date, endDate: Date): Promise<Array<{supplierId: string; totalSpend: number}>> {
    return [];
  }
}

// Repository instances
export const procurementRepository = new MockProcurementRepository();
export const supplierRepository = new MockSupplierRepository();

// Mock instances for other repositories - these would have full implementations in a real system
export const purchaseRequisitionRepository: PurchaseRequisitionRepository = {} as PurchaseRequisitionRepository;
export const purchaseOrderRepository: PurchaseOrderRepository = {} as PurchaseOrderRepository;
export const rfqRepository: RFQRepository = {} as RFQRepository;
export const contractRepository: ContractRepository = {} as ContractRepository;
export const procurementAnalyticsRepository: ProcurementAnalyticsRepository = {} as ProcurementAnalyticsRepository;
