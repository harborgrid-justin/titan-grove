/**
 * Service Management Service
 * Business logic for service management operations
 */

import type { ServiceEntity } from '../../types';
import { serviceRepository } from '../../data-access/repositories';

export class ServiceService {
  async createService(
    data: Omit<ServiceEntity, 'id' | 'createdDate' | 'modifiedDate'>
  ): Promise<ServiceEntity> {
    this.validateServiceData(data);
    return await serviceRepository.create(data);
  }

  async getServiceById(id: string): Promise<ServiceEntity | null> {
    return await serviceRepository.getById(id);
  }

  async updateService(id: string, updates: Partial<ServiceEntity>): Promise<ServiceEntity> {
    const existing = await serviceRepository.getById(id);
    if (!existing) {
      throw new Error(`Service with ID ${id} not found`);
    }

    return await serviceRepository.update(id, updates);
  }

  async deleteService(id: string): Promise<void> {
    const existing = await serviceRepository.getById(id);
    if (!existing) {
      throw new Error(`Service with ID ${id} not found`);
    }

    await serviceRepository.delete(id);
  }

  async getAllServices(): Promise<ServiceEntity[]> {
    return await serviceRepository.getAll();
  }

  private validateServiceData(
    data: Omit<ServiceEntity, 'id' | 'createdDate' | 'modifiedDate'>
  ): void {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Name is required');
    }
  }
}

export const serviceService = new ServiceService();
