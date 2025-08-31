/**
 * Contract Management Service
 * Business logic for contract lifecycle management
 */

import { 
  Contract, 
  ContractStatus,
  ContractType,
  ContractPerformance,
  ProcurementSearchCriteria
} from '../../types';
import { contractRepository } from '../../data-access/repositories';
import { PaginatedResponse, SearchParams, PerformanceLevel } from '../../../../types/common';
import type { ProcurementConfig } from '../../../../types/business-config';
import { DateUtils } from '../../../../shared/constants';

export class ContractService {
  
  /**
   * Create a new contract
   */
  async createContract(
    data: Omit<Contract, 'id' | 'contractNumber' | 'status' | 'amendments' | 'performance' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>
  ): Promise<Contract> {
    this.validateContractData(data);
    
    const contractNumber = await this.generateContractNumber();
    
    const contractData = {
      ...data,
      contractNumber,
      status: ContractStatus.DRAFT,
      amendments: [],
      performance: {
        overallRating: PerformanceLevel.MEDIUM,
        deliveryPerformance: 0,
        qualityRating: PerformanceLevel.MEDIUM,
        costSavings: { amount: 0, currency: 'USD' },
        issueCount: 0,
        lastReviewDate: new Date(),
        nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
      },
      createdBy: 'system',
      updatedBy: 'system'
    };
    
    return await contractRepository.create(contractData);
  }

  async getContractById(id: string): Promise<Contract | null> {
    return await contractRepository.getById(id);
  }

  async updateContract(id: string, updates: Partial<Contract>): Promise<Contract> {
    const existing = await contractRepository.getById(id);
    if (!existing) {
      throw new Error(`Contract with ID ${id} not found`);
    }
    
    return await contractRepository.update(id, updates);
  }

  async activateContract(contractId: string): Promise<Contract> {
    const contract = await this.getContractById(contractId);
    if (!contract) {
      throw new Error(`Contract with ID ${contractId} not found`);
    }
    
    if (contract.status !== ContractStatus.PENDING_SIGNATURE) {
      throw new Error('Only contracts pending signature can be activated');
    }
    
    return await this.updateContract(contractId, {
      status: ContractStatus.ACTIVE
    });
  }

  async monitorContractPerformance(contractId: string): Promise<ContractPerformance> {
    const contract = await this.getContractById(contractId);
    if (!contract) {
      throw new Error(`Contract with ID ${contractId} not found`);
    }
    
    // Mock performance monitoring - in real implementation would analyze:
    // - Delivery performance
    // - Quality metrics
    // - Cost savings
    // - Issue tracking
    
    const performance: ContractPerformance = {
      overallRating: PerformanceLevel.HIGH,
      deliveryPerformance: 95.5,
      qualityRating: PerformanceLevel.HIGH,
      costSavings: { amount: 25000, currency: 'USD' },
      issueCount: 2,
      lastReviewDate: new Date(),
      nextReviewDate: DateUtils.addDays(new Date(), 30) // Use standard 30-day review period
    };
    
    // Update contract with new performance data
    await this.updateContract(contractId, { performance });
    
    return performance;
  }

  async getExpiringContracts(daysAhead: number = 30): Promise<Contract[]> {
    return await contractRepository.getExpiringContracts(daysAhead);
  }

  async searchContracts(
    criteria: ProcurementSearchCriteria, 
    params?: SearchParams
  ): Promise<PaginatedResponse<Contract>> {
    return await contractRepository.search(criteria, params);
  }

  private validateContractData(data: Partial<Contract>): void {
    if (!data.title || data.title.trim() === '') {
      throw new Error('Contract title is required');
    }
    
    if (!data.supplierId) {
      throw new Error('Supplier ID is required');
    }
    
    if (!data.effectiveDate) {
      throw new Error('Effective date is required');
    }
    
    if (!data.expirationDate) {
      throw new Error('Expiration date is required');
    }
    
    if (data.expirationDate <= data.effectiveDate) {
      throw new Error('Expiration date must be after effective date');
    }
  }

  private async generateContractNumber(): Promise<string> {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `CTR${timestamp.toString().slice(-6)}${random}`;
  }
}

export const contractService = new ContractService();