/**
 * Document Management Module - Native NAPI-RS Implementation
 * High-performance document operations using Rust backend
 */

// Import from native implementation
export * from './native-document';

// Re-export native functions directly for advanced users
export {
  calculateDocumentRelevanceScore,
  searchDocuments,
  calculateContentHash,
  validateDocumentTitle,
  generateDocumentNumber,
  calculateRetentionExpiryDate,
  analyzeDocumentMetrics,
  classifyDocumentByContent,
} from '../native';
