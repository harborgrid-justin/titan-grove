/**
 * Workflow Management Service
 * Business logic for workflow management operations
 */

import type { WorkflowEntity } from '../../types';
import { workflowRepository } from '../../data-access/repositories';

export class WorkflowService {
  
  async createWorkflow(data: Omit<WorkflowEntity, 'id' | 'createdDate' | 'modifiedDate'>): Promise<WorkflowEntity> {
    this.validateWorkflowData(data);
    return await workflowRepository.create(data);
  }

  async getWorkflowById(id: string): Promise<WorkflowEntity | null> {
    return await workflowRepository.getById(id);
  }

  async updateWorkflow(id: string, updates: Partial<WorkflowEntity>): Promise<WorkflowEntity> {
    const existing = await workflowRepository.getById(id);
    if (!existing) {
      throw new Error(`Workflow with ID ${id} not found`);
    }
    
    return await workflowRepository.update(id, updates);
  }

  async deleteWorkflow(id: string): Promise<void> {
    const existing = await workflowRepository.getById(id);
    if (!existing) {
      throw new Error(`Workflow with ID ${id} not found`);
    }
    
    await workflowRepository.delete(id);
  }

  async getAllWorkflows(): Promise<WorkflowEntity[]> {
    return await workflowRepository.getAll();
  }

  private validateWorkflowData(data: Omit<WorkflowEntity, 'id' | 'createdDate' | 'modifiedDate'>): void {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Name is required');
    }
  }
}

export const workflowService = new WorkflowService();
