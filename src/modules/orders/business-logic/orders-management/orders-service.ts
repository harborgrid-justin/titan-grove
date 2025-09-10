/**
 * Orders Management Service
 * Business logic for orders management operations
 */

import type { OrdersEntity } from '../../types';
import { orderRepository } from '../../data-access/repositories';

export class OrdersService {
  
  async createOrders(data: Omit<OrdersEntity, 'id' | 'createdDate' | 'modifiedDate'>): Promise<OrdersEntity> {
    this.validateOrdersData(data);
    return await ordersRepository.create(data);
  }

  async getOrdersById(id: string): Promise<OrdersEntity | null> {
    return await ordersRepository.getById(id);
  }

  async updateOrders(id: string, updates: Partial<OrdersEntity>): Promise<OrdersEntity> {
    const existing = await ordersRepository.getById(id);
    if (!existing) {
      throw new Error(`Orders with ID ${id} not found`);
    }
    
    return await ordersRepository.update(id, updates);
  }

  async deleteOrders(id: string): Promise<void> {
    const existing = await ordersRepository.getById(id);
    if (!existing) {
      throw new Error(`Orders with ID ${id} not found`);
    }
    
    await ordersRepository.delete(id);
  }

  async getAllOrderss(): Promise<OrdersEntity[]> {
    return await ordersRepository.getAll();
  }

  private validateOrdersData(data: Omit<OrdersEntity, 'id' | 'createdDate' | 'modifiedDate'>): void {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Name is required');
    }
  }
}

export const ordersService = new OrdersService();
