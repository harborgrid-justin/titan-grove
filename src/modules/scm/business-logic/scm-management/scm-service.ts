/**
 * Scm Management Service
 * Business logic for scm management operations
 */

import type { ScmEntity } from '../../types';
import { scmRepository } from '../../data-access/repositories';

export class ScmService {
  
  async createScm(data: Omit<ScmEntity, 'id' | 'createdDate' | 'modifiedDate'>): Promise<ScmEntity> {
    this.validateScmData(data);
    return await scmRepository.create(data);
  }

  async getScmById(id: string): Promise<ScmEntity | null> {
    return await scmRepository.getById(id);
  }

  async updateScm(id: string, updates: Partial<ScmEntity>): Promise<ScmEntity> {
    const existing = await scmRepository.getById(id);
    if (!existing) {
      throw new Error(`Scm with ID ${id} not found`);
    }
    
    return await scmRepository.update(id, updates);
  }

  async deleteScm(id: string): Promise<void> {
    const existing = await scmRepository.getById(id);
    if (!existing) {
      throw new Error(`Scm with ID ${id} not found`);
    }
    
    await scmRepository.delete(id);
  }

  async getAllScms(): Promise<ScmEntity[]> {
    return await scmRepository.getAll();
  }

  private validateScmData(data: Omit<ScmEntity, 'id' | 'createdDate' | 'modifiedDate'>): void {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Name is required');
    }
  }
}

export const scmService = new ScmService();
