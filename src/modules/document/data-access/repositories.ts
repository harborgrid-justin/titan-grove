/**
 * Document Data Access Layer
 * Repository implementations for document management
 */

import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';

/**
 * Document Repository
 */
export class DocumentRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Document-specific methods
  async getById(id: string) {
    return await this.findById(id);
  }

  async getAll() {
    return await this.findAll();
  }
}

/**
 * Document Version Repository
 */
export class DocumentVersionRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `version_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Document Metadata Repository
 */
export class DocumentMetadataRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `metadata_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export default instances
export const documentRepository = new DocumentRepository();
export const documentVersionRepository = new DocumentVersionRepository();
export const documentMetadataRepository = new DocumentMetadataRepository();
