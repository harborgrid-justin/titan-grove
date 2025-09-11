/**
 * Quality Management Service
 * Business logic for quality management operations
 */

import type { QualityEntity } from '../../types';
import { qualityRepository } from '../../data-access/repositories';

export class QualityService {
  async createQuality(
    data: Omit<QualityEntity, 'id' | 'createdDate' | 'modifiedDate'>
  ): Promise<QualityEntity> {
    this.validateQualityData(data);
    return await qualityRepository.create(data);
  }

  async getQualityById(id: string): Promise<QualityEntity | null> {
    return await qualityRepository.getById(id);
  }

  async updateQuality(id: string, updates: Partial<QualityEntity>): Promise<QualityEntity> {
    const existing = await qualityRepository.getById(id);
    if (!existing) {
      throw new Error(`Quality with ID ${id} not found`);
    }

    return await qualityRepository.update(id, updates);
  }

  async deleteQuality(id: string): Promise<void> {
    const existing = await qualityRepository.getById(id);
    if (!existing) {
      throw new Error(`Quality with ID ${id} not found`);
    }

    await qualityRepository.delete(id);
  }

  async getAllQualitys(): Promise<QualityEntity[]> {
    return await qualityRepository.getAll();
  }

  private validateQualityData(
    data: Omit<QualityEntity, 'id' | 'createdDate' | 'modifiedDate'>
  ): void {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Name is required');
    }
  }
}

export const qualityService = new QualityService();
