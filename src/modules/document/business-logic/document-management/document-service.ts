/**
 * Document Management Service
 * Business logic for document management operations
 */

import type { DocumentEntity } from '../../types';
import { documentRepository } from '../../data-access/repositories';

export class DocumentService {
  
  async createDocument(data: Omit<DocumentEntity, 'id' | 'createdDate' | 'modifiedDate'>): Promise<DocumentEntity> {
    this.validateDocumentData(data);
    return await documentRepository.create(data);
  }

  async getDocumentById(id: string): Promise<DocumentEntity | null> {
    return await documentRepository.getById(id);
  }

  async updateDocument(id: string, updates: Partial<DocumentEntity>): Promise<DocumentEntity> {
    const existing = await documentRepository.getById(id);
    if (!existing) {
      throw new Error(`Document with ID ${id} not found`);
    }
    
    return await documentRepository.update(id, updates);
  }

  async deleteDocument(id: string): Promise<void> {
    const existing = await documentRepository.getById(id);
    if (!existing) {
      throw new Error(`Document with ID ${id} not found`);
    }
    
    await documentRepository.delete(id);
  }

  async getAllDocuments(): Promise<DocumentEntity[]> {
    return await documentRepository.getAll();
  }

  private validateDocumentData(data: Omit<DocumentEntity, 'id' | 'createdDate' | 'modifiedDate'>): void {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Name is required');
    }
  }
}

export const documentService = new DocumentService();