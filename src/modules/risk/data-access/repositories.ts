/**
 * Risk Data Access Layer
 * Database operations and data persistence for risk management
 */

import type { RiskEntity } from '../types';

export interface RiskRepository {
  create(entity: Omit<RiskEntity, 'id' | 'createdDate' | 'modifiedDate'>): Promise<RiskEntity>;
  getById(id: string): Promise<RiskEntity | null>;
  update(id: string, updates: Partial<RiskEntity>): Promise<RiskEntity>;
  delete(id: string): Promise<void>;
  getAll(): Promise<RiskEntity[]>;
}

// Mock implementation
export class MockRiskRepository implements RiskRepository {
  private entities: RiskEntity[] = [];

  async create(entity: Omit<RiskEntity, 'id' | 'createdDate' | 'modifiedDate'>): Promise<RiskEntity> {
    const newEntity: RiskEntity = {
      ...entity,
      id: `risk_${Date.now()}`,
      createdDate: new Date(),
      modifiedDate: new Date()
    };
    this.entities.push(newEntity);
    return newEntity;
  }

  async getById(id: string): Promise<RiskEntity | null> {
    return this.entities.find(entity => entity.id === id) || null;
  }

  async update(id: string, updates: Partial<RiskEntity>): Promise<RiskEntity> {
    const index = this.entities.findIndex(entity => entity.id === id);
    if (index === -1) {
      throw new Error(`Risk entity with id ${id} not found`);
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
      throw new Error(`Risk entity with id ${id} not found`);
    }
    this.entities.splice(index, 1);
  }

  async getAll(): Promise<RiskEntity[]> {
    return this.entities;
  }
}

export const riskRepository = new MockRiskRepository();
