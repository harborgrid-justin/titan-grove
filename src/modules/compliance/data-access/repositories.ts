/**
 * Compliance Data Access Layer
 * Database operations and data persistence for compliance management
 */

import type { ComplianceEntity } from '../types';

export interface ComplianceRepository {
  create(entity: Omit<ComplianceEntity, 'id' | 'createdDate' | 'modifiedDate'>): Promise<ComplianceEntity>;
  getById(id: string): Promise<ComplianceEntity | null>;
  update(id: string, updates: Partial<ComplianceEntity>): Promise<ComplianceEntity>;
  delete(id: string): Promise<void>;
  getAll(): Promise<ComplianceEntity[]>;
}

// Mock implementation
export class MockComplianceRepository implements ComplianceRepository {
  private entities: ComplianceEntity[] = [];

  async create(entity: Omit<ComplianceEntity, 'id' | 'createdDate' | 'modifiedDate'>): Promise<ComplianceEntity> {
    const newEntity: ComplianceEntity = {
      ...entity,
      id: `compliance_${Date.now()}`,
      createdDate: new Date(),
      modifiedDate: new Date()
    };
    this.entities.push(newEntity);
    return newEntity;
  }

  async getById(id: string): Promise<ComplianceEntity | null> {
    return this.entities.find(entity => entity.id === id) || null;
  }

  async update(id: string, updates: Partial<ComplianceEntity>): Promise<ComplianceEntity> {
    const index = this.entities.findIndex(entity => entity.id === id);
    if (index === -1) {
      throw new Error(`Compliance entity with id ${id} not found`);
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
      throw new Error(`Compliance entity with id ${id} not found`);
    }
    this.entities.splice(index, 1);
  }

  async getAll(): Promise<ComplianceEntity[]> {
    return this.entities;
  }
}

export const complianceRepository = new MockComplianceRepository();