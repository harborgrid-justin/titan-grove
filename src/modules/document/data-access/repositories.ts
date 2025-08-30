/**
 * Document Data Access Layer
 * Database operations and data persistence for document management
 */

import type { DocumentEntity } from '../types';

export interface DocumentRepository {
  create(entity: Omit<DocumentEntity, 'id' | 'createdDate' | 'modifiedDate'>): Promise<DocumentEntity>;
  getById(id: string): Promise<DocumentEntity | null>;
  update(id: string, updates: Partial<DocumentEntity>): Promise<DocumentEntity>;
  delete(id: string): Promise<void>;
  getAll(): Promise<DocumentEntity[]>;
}

// Mock implementation
export class MockDocumentRepository implements DocumentRepository {
  private entities: DocumentEntity[] = [];

  async create(entity: Omit<DocumentEntity, 'id' | 'createdDate' | 'modifiedDate'>): Promise<DocumentEntity> {
    const newEntity: DocumentEntity = {
      ...entity,
      id: `document_${Date.now()}`,
      createdDate: new Date(),
      modifiedDate: new Date()
    };
    this.entities.push(newEntity);
    return newEntity;
  }

  async getById(id: string): Promise<DocumentEntity | null> {
    return this.entities.find(entity => entity.id === id) || null;
  }

  async update(id: string, updates: Partial<DocumentEntity>): Promise<DocumentEntity> {
    const index = this.entities.findIndex(entity => entity.id === id);
    if (index === -1) {
      throw new Error(`Document entity with id ${id} not found`);
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
      throw new Error(`Document entity with id ${id} not found`);
    }
    this.entities.splice(index, 1);
  }

  async getAll(): Promise<DocumentEntity[]> {
    return this.entities;
  }
}

export const documentRepository = new MockDocumentRepository();