// Updated Document Management Module - Using NAPI-RS Native Functions
import {
  calculateDocumentRelevanceScore,
  searchDocuments,
  calculateContentHash,
  validateDocumentTitle,
  generateDocumentNumber,
  calculateRetentionExpiryDate,
  analyzeDocumentMetrics,
  classifyDocumentByContent,
} from '../native';

// Re-export native types and functions
export * from '../native';

export class DocumentManager {
  /**
   * Search documents using high-performance native search algorithms
   */
  async searchDocuments(
    documents: any[],
    searchQuery: string,
    criteria: any,
    limit: number = 50
  ): Promise<any> {
    console.log(`Searching ${documents.length} documents using native implementation`);
    return searchDocuments(documents, searchQuery, criteria, limit);
  }

  /**
   * Calculate document relevance score using native algorithms
   */
  calculateDocumentRelevanceScore(document: any, searchQuery: string, criteria: any): number {
    return calculateDocumentRelevanceScore(document, searchQuery, criteria);
  }

  /**
   * Calculate content hash using native implementation
   */
  calculateContentHash(content: string): string {
    return calculateContentHash(content);
  }

  /**
   * Validate document title using native validation
   */
  validateDocumentTitle(title: string): boolean {
    return validateDocumentTitle(title);
  }

  /**
   * Generate document number using native implementation
   */
  generateDocumentNumber(documentType: string, sequence: number): string {
    return generateDocumentNumber(documentType, sequence);
  }

  /**
   * Calculate retention expiry date using native date calculations
   */
  async calculateRetentionExpiryDate(
    creationDate: string,
    retentionPeriodMonths: number
  ): Promise<string> {
    try {
      return await calculateRetentionExpiryDate(creationDate, retentionPeriodMonths);
    } catch (error) {
      throw new Error(`Failed to calculate retention expiry date: ${error}`);
    }
  }

  /**
   * Analyze document metrics using native analytics
   */
  async analyzeDocumentMetrics(documents: any[]): Promise<any> {
    console.log(`Analyzing metrics for ${documents.length} documents using native implementation`);
    return analyzeDocumentMetrics(documents);
  }

  /**
   * Classify document by content using native machine learning algorithms
   */
  classifyDocumentByContent(content: string, title: string): string {
    return classifyDocumentByContent(content, title);
  }

  /**
   * Create document with native optimizations
   */
  async createDocument(document: any): Promise<any> {
    const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const documentNumber = this.generateDocumentNumber(document.documentType, Date.now());
    const contentHash = document.content ? this.calculateContentHash(document.content) : undefined;

    return {
      ...document,
      id,
      documentNumber,
      version: '1.0',
      status: 'DRAFT',
      createdDate: new Date(),
      lastModified: new Date(),
      contentHash,
    };
  }
}

export const documentManager = new DocumentManager();
