/**
 * Procurement Management Service
 * Business logic for procurement management operations
 */

import { ProcurementEntity } from '../../types';
import { procurementRepository } from '../../data-access/repositories';

export class ProcurementService {
  async createProcurement(
    data: Omit<ProcurementEntity, 'id' | 'createdDate' | 'modifiedDate'>
  ): Promise<ProcurementEntity> {
    this.validateProcurementData(data);
    return await procurementRepository.create(data);
  }

  async getProcurementById(id: string): Promise<ProcurementEntity | null> {
    return await procurementRepository.getById(id);
  }

  async updateProcurement(
    id: string,
    updates: Partial<ProcurementEntity>
  ): Promise<ProcurementEntity> {
    const existing = await procurementRepository.getById(id);
    if (!existing) {
      throw new Error(`Procurement with ID ${id} not found`);
    }

    return await procurementRepository.update(id, updates);
  }

  async deleteProcurement(id: string): Promise<void> {
    const existing = await procurementRepository.getById(id);
    if (!existing) {
      throw new Error(`Procurement with ID ${id} not found`);
    }

    await procurementRepository.delete(id);
  }

  async getAllProcurements(): Promise<ProcurementEntity[]> {
    return await procurementRepository.getAll();
  }

  private validateProcurementData(
    data: Omit<ProcurementEntity, 'id' | 'createdDate' | 'modifiedDate'>
  ): void {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Name is required');
    }
  }
}

export const procurementService = new ProcurementService();
