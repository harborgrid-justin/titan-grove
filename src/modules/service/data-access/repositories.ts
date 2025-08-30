/**
 * Service Data Access Layer
 * Database operations and data persistence for service management
 */

import type { ServiceEntity } from '../types';

export interface ServiceRepository {
  create(entity: Omit<ServiceEntity, 'id' | 'createdDate' | 'modifiedDate'>): Promise<ServiceEntity>;
  getById(id: string): Promise<ServiceEntity | null>;
  update(id: string, updates: Partial<ServiceEntity>): Promise<ServiceEntity>;
  delete(id: string): Promise<void>;
  getAll(): Promise<ServiceEntity[]>;
}

// Mock implementation
export class MockServiceRepository implements ServiceRepository {
  private entities: ServiceEntity[] = [];

  async create(entity: Omit<ServiceEntity, 'id' | 'createdDate' | 'modifiedDate'>): Promise<ServiceEntity> {
    const newEntity: ServiceEntity = {
      ...entity,
      id: `service_${Date.now()}`,
      createdDate: new Date(),
      modifiedDate: new Date()
    };
    this.entities.push(newEntity);
    return newEntity;
  }

  async getById(id: string): Promise<ServiceEntity | null> {
    return this.entities.find(entity => entity.id === id) || null;
  }

  async update(id: string, updates: Partial<ServiceEntity>): Promise<ServiceEntity> {
    const index = this.entities.findIndex(entity => entity.id === id);
    if (index === -1) {
      throw new Error(`Service entity with id ${id} not found`);
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
      throw new Error(`Service entity with id ${id} not found`);
    }
    this.entities.splice(index, 1);
  }

  async getAll(): Promise<ServiceEntity[]> {
    return this.entities;
  }
}

export const serviceRepository = new MockServiceRepository();
