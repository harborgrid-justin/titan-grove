/**
 * Maintenance Management Service
 * Business logic for maintenance management operations
 */

import type { MaintenanceEntity } from '../../types';
import { maintenanceRepository } from '../../data-access/repositories';

export class MaintenanceService {
  
  async createMaintenance(data: Omit<MaintenanceEntity, 'id' | 'createdDate' | 'modifiedDate'>): Promise<MaintenanceEntity> {
    this.validateMaintenanceData(data);
    return await maintenanceRepository.create(data);
  }

  async getMaintenanceById(id: string): Promise<MaintenanceEntity | null> {
    return await maintenanceRepository.getById(id);
  }

  async updateMaintenance(id: string, updates: Partial<MaintenanceEntity>): Promise<MaintenanceEntity> {
    const existing = await maintenanceRepository.getById(id);
    if (!existing) {
      throw new Error(`Maintenance with ID ${id} not found`);
    }
    
    return await maintenanceRepository.update(id, updates);
  }

  async deleteMaintenance(id: string): Promise<void> {
    const existing = await maintenanceRepository.getById(id);
    if (!existing) {
      throw new Error(`Maintenance with ID ${id} not found`);
    }
    
    await maintenanceRepository.delete(id);
  }

  async getAllMaintenances(): Promise<MaintenanceEntity[]> {
    return await maintenanceRepository.getAll();
  }

  private validateMaintenanceData(data: Omit<MaintenanceEntity, 'id' | 'createdDate' | 'modifiedDate'>): void {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Name is required');
    }
  }
}

export const maintenanceService = new MaintenanceService();
