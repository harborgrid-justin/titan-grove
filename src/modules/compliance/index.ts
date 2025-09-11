/**
 * Compliance Management Module - Native NAPI-RS Implementation
 * High-performance compliance calculations using Rust backend
 */

// Import from native implementation
export * from './native-compliance';

// Re-export native functions directly for advanced users
export {
  calculateComplianceScore,
  determineComplianceRiskLevel,
  assessFrameworkCompliance,
  calculateTrainingComplianceRate,
  validateRequirementCompliance,
  generateComplianceMetrics,
  calculateAuditScore,
} from '../native';
