/**
 * Risk Management Service
 * Business logic for risk management operations
 */

import type { RiskEntity } from '../../types';
import { riskRepository } from '../../data-access/repositories';

export class RiskService {
  
  async createRisk(data: Omit<RiskEntity, 'id' | 'createdDate' | 'modifiedDate'>): Promise<RiskEntity> {
    this.validateRiskData(data);
    return await riskRepository.create(data);
  }

  async getRiskById(id: string): Promise<RiskEntity | null> {
    return await riskRepository.getById(id);
  }

  async updateRisk(id: string, updates: Partial<RiskEntity>): Promise<RiskEntity> {
    const existing = await riskRepository.getById(id);
    if (!existing) {
      throw new Error(`Risk with ID ${id} not found`);
    }
    
    return await riskRepository.update(id, updates);
  }

  async deleteRisk(id: string): Promise<void> {
    const existing = await riskRepository.getById(id);
    if (!existing) {
      throw new Error(`Risk with ID ${id} not found`);
    }
    
    await riskRepository.delete(id);
  }

  async getAllRisks(): Promise<RiskEntity[]> {
    return await riskRepository.getAll();
  }

  private validateRiskData(data: Omit<RiskEntity, 'id' | 'createdDate' | 'modifiedDate'>): void {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Name is required');
    }
  }
}

export const riskService = new RiskService();
