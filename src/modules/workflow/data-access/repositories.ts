/**
 * Workflow Data Access Layer
 * Database operations and data persistence for workflow management
 */

import type { WorkflowEntity } from '../types';

export interface WorkflowRepository {
  create(entity: Omit<WorkflowEntity, 'id' | 'createdDate' | 'modifiedDate'>): Promise<WorkflowEntity>;
  getById(id: string): Promise<WorkflowEntity | null>;
  update(id: string, updates: Partial<WorkflowEntity>): Promise<WorkflowEntity>;
  delete(id: string): Promise<void>;
  getAll(): Promise<WorkflowEntity[]>;
}

// Mock implementation
export class MockWorkflowRepository implements WorkflowRepository {
  private entities: WorkflowEntity[] = [];

  async create(entity: Omit<WorkflowEntity, 'id' | 'createdDate' | 'modifiedDate'>): Promise<WorkflowEntity> {
    const newEntity: WorkflowEntity = {
      ...entity,
      id: `workflow_${Date.now()}`,
      createdDate: new Date(),
      modifiedDate: new Date()
    };
    this.entities.push(newEntity);
    return newEntity;
  }

  async getById(id: string): Promise<WorkflowEntity | null> {
    return this.entities.find(entity => entity.id === id) || null;
  }

  async update(id: string, updates: Partial<WorkflowEntity>): Promise<WorkflowEntity> {
    const index = this.entities.findIndex(entity => entity.id === id);
    if (index === -1) {
      throw new Error(`Workflow entity with id ${id} not found`);
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
      throw new Error(`Workflow entity with id ${id} not found`);
    }
    this.entities.splice(index, 1);
  }

  async getAll(): Promise<WorkflowEntity[]> {
    return this.entities;
  }
}

export const workflowRepository = new MockWorkflowRepository();
