/**
 * Orders Data Access Layer
 * Database operations and data persistence for orders management
 */

import type { OrdersEntity } from '../types';

export interface OrdersRepository {
  create(entity: Omit<OrdersEntity, 'id' | 'createdDate' | 'modifiedDate'>): Promise<OrdersEntity>;
  getById(id: string): Promise<OrdersEntity | null>;
  update(id: string, updates: Partial<OrdersEntity>): Promise<OrdersEntity>;
  delete(id: string): Promise<void>;
  getAll(): Promise<OrdersEntity[]>;
}

// Mock implementation
export class MockOrdersRepository implements OrdersRepository {
  private entities: OrdersEntity[] = [];

  async create(entity: Omit<OrdersEntity, 'id' | 'createdDate' | 'modifiedDate'>): Promise<OrdersEntity> {
    const newEntity: OrdersEntity = {
      ...entity,
      id: `orders_${Date.now()}`,
      createdDate: new Date(),
      modifiedDate: new Date()
    };
    this.entities.push(newEntity);
    return newEntity;
  }

  async getById(id: string): Promise<OrdersEntity | null> {
    return this.entities.find(entity => entity.id === id) || null;
  }

  async update(id: string, updates: Partial<OrdersEntity>): Promise<OrdersEntity> {
    const index = this.entities.findIndex(entity => entity.id === id);
    if (index === -1) {
      throw new Error(`Orders entity with id ${id} not found`);
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
      throw new Error(`Orders entity with id ${id} not found`);
    }
    this.entities.splice(index, 1);
  }

  async getAll(): Promise<OrdersEntity[]> {
    return this.entities;
  }
}

export const ordersRepository = new MockOrdersRepository();
