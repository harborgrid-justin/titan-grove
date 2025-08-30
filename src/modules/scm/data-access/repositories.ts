/**
 * Scm Data Access Layer
 * Database operations and data persistence for scm management
 */

import type { ScmEntity } from '../types';

export interface ScmRepository {
  create(entity: Omit<ScmEntity, 'id' | 'createdDate' | 'modifiedDate'>): Promise<ScmEntity>;
  getById(id: string): Promise<ScmEntity | null>;
  update(id: string, updates: Partial<ScmEntity>): Promise<ScmEntity>;
  delete(id: string): Promise<void>;
  getAll(): Promise<ScmEntity[]>;
}

// Mock implementation
export class MockScmRepository implements ScmRepository {
  private entities: ScmEntity[] = [];

  async create(entity: Omit<ScmEntity, 'id' | 'createdDate' | 'modifiedDate'>): Promise<ScmEntity> {
    const newEntity: ScmEntity = {
      ...entity,
      id: `scm_${Date.now()}`,
      createdDate: new Date(),
      modifiedDate: new Date()
    };
    this.entities.push(newEntity);
    return newEntity;
  }

  async getById(id: string): Promise<ScmEntity | null> {
    return this.entities.find(entity => entity.id === id) || null;
  }

  async update(id: string, updates: Partial<ScmEntity>): Promise<ScmEntity> {
    const index = this.entities.findIndex(entity => entity.id === id);
    if (index === -1) {
      throw new Error(`Scm entity with id ${id} not found`);
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
      throw new Error(`Scm entity with id ${id} not found`);
    }
    this.entities.splice(index, 1);
  }

  async getAll(): Promise<ScmEntity[]> {
    return this.entities;
  }
}

export const scmRepository = new MockScmRepository();
