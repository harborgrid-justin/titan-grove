/**
 * Compliance Management Service
 * Business logic for compliance management operations
 */

import type { ComplianceEntity } from '../../types';
import { complianceRepository } from '../../data-access/repositories';

export class ComplianceService {
  async createCompliance(
    data: Omit<ComplianceEntity, 'id' | 'createdDate' | 'modifiedDate'>
  ): Promise<ComplianceEntity> {
    this.validateComplianceData(data);
    return await complianceRepository.create(data);
  }

  async getComplianceById(id: string): Promise<ComplianceEntity | null> {
    return await complianceRepository.getById(id);
  }

  async updateCompliance(
    id: string,
    updates: Partial<ComplianceEntity>
  ): Promise<ComplianceEntity> {
    const existing = await complianceRepository.getById(id);
    if (!existing) {
      throw new Error(`Compliance with ID ${id} not found`);
    }

    return await complianceRepository.update(id, updates);
  }

  async deleteCompliance(id: string): Promise<void> {
    const existing = await complianceRepository.getById(id);
    if (!existing) {
      throw new Error(`Compliance with ID ${id} not found`);
    }

    await complianceRepository.delete(id);
  }

  async getAllCompliances(): Promise<ComplianceEntity[]> {
    return await complianceRepository.getAll();
  }

  private validateComplianceData(
    data: Omit<ComplianceEntity, 'id' | 'createdDate' | 'modifiedDate'>
  ): void {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Name is required');
    }
  }
}

export const complianceService = new ComplianceService();
