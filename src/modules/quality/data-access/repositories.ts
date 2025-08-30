/**
 * Quality Data Access Layer
 * Database operations and data persistence for quality management
 */

import type { QualityEntity } from '../types';

export interface QualityRepository {
  create(entity: Omit<QualityEntity, 'id' | 'createdDate' | 'modifiedDate'>): Promise<QualityEntity>;
  getById(id: string): Promise<QualityEntity | null>;
  update(id: string, updates: Partial<QualityEntity>): Promise<QualityEntity>;
  delete(id: string): Promise<void>;
  getAll(): Promise<QualityEntity[]>;
}

// Mock implementation
export class MockQualityRepository implements QualityRepository {
  private entities: QualityEntity[] = [];

  async create(entity: Omit<QualityEntity, 'id' | 'createdDate' | 'modifiedDate'>): Promise<QualityEntity> {
    const newEntity: QualityEntity = {
      ...entity,
      id: `quality_${Date.now()}`,
      createdDate: new Date(),
      modifiedDate: new Date()
    };
    this.entities.push(newEntity);
    return newEntity;
  }

  async getById(id: string): Promise<QualityEntity | null> {
    return this.entities.find(entity => entity.id === id) || null;
  }

  async update(id: string, updates: Partial<QualityEntity>): Promise<QualityEntity> {
    const index = this.entities.findIndex(entity => entity.id === id);
    if (index === -1) {
      throw new Error(`Quality entity with id ${id} not found`);
    }
    
    this.entities[index] = {
      ...this.entities[index],
      ...updates,
      modifiedDate: new Date()
    };
    
    return this.entities[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.entities.findIndex(entity => entity.id === id);
    if (index === -1) {
      throw new Error(`Quality entity with id ${id} not found`);
    }
    this.entities.splice(index, 1);
  }

  async getAll(): Promise<QualityEntity[]> {
    return this.entities;
  }
}

export const qualityRepository = new MockQualityRepository();
