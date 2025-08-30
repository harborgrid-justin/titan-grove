/**
 * Procurement Data Access Layer
 * Database operations and data persistence for procurement management
 */

import type { ProcurementEntity } from '../types';

export interface ProcurementRepository {
  create(entity: Omit<ProcurementEntity, 'id' | 'createdDate' | 'modifiedDate'>): Promise<ProcurementEntity>;
  getById(id: string): Promise<ProcurementEntity | null>;
  update(id: string, updates: Partial<ProcurementEntity>): Promise<ProcurementEntity>;
  delete(id: string): Promise<void>;
  getAll(): Promise<ProcurementEntity[]>;
}

// Mock implementation
export class MockProcurementRepository implements ProcurementRepository {
  private entities: ProcurementEntity[] = [];

  async create(entity: Omit<ProcurementEntity, 'id' | 'createdDate' | 'modifiedDate'>): Promise<ProcurementEntity> {
    const newEntity: ProcurementEntity = {
      ...entity,
      id: `procurement_${Date.now()}`,
      createdDate: new Date(),
      modifiedDate: new Date()
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
      modifiedDate: new Date()
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

export const procurementRepository = new MockProcurementRepository();
