/**
 * Maintenance Data Access Layer
 * Database operations and data persistence for maintenance management
 */

import type { MaintenanceEntity } from '../types';

export interface MaintenanceRepository {
  create(entity: Omit<MaintenanceEntity, 'id' | 'createdDate' | 'modifiedDate'>): Promise<MaintenanceEntity>;
  getById(id: string): Promise<MaintenanceEntity | null>;
  update(id: string, updates: Partial<MaintenanceEntity>): Promise<MaintenanceEntity>;
  delete(id: string): Promise<void>;
  getAll(): Promise<MaintenanceEntity[]>;
}

// Mock implementation
export class MockMaintenanceRepository implements MaintenanceRepository {
  private entities: MaintenanceEntity[] = [];

  async create(entity: Omit<MaintenanceEntity, 'id' | 'createdDate' | 'modifiedDate'>): Promise<MaintenanceEntity> {
    const newEntity: MaintenanceEntity = {
      ...entity,
      id: `maintenance_${Date.now()}`,
      createdDate: new Date(),
      modifiedDate: new Date()
    };
    this.entities.push(newEntity);
    return newEntity;
  }

  async getById(id: string): Promise<MaintenanceEntity | null> {
    return this.entities.find(entity => entity.id === id) || null;
  }

  async update(id: string, updates: Partial<MaintenanceEntity>): Promise<MaintenanceEntity> {
    const index = this.entities.findIndex(entity => entity.id === id);
    if (index === -1) {
      throw new Error(`Maintenance entity with id ${id} not found`);
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
      throw new Error(`Maintenance entity with id ${id} not found`);
    }
    this.entities.splice(index, 1);
  }

  async getAll(): Promise<MaintenanceEntity[]> {
    return this.entities;
  }
}

export const maintenanceRepository = new MockMaintenanceRepository();
