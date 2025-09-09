/**
 * Risk Management Module - Native NAPI-RS Implementation
 * High-performance risk calculations using Rust backend
 */

// Import from native implementation
export * from './native-risk';

// Re-export native functions directly for advanced users
export {
  calculateRiskScore,
  determineRiskLevel,
  createRiskAssessment,
  calculateResidualRisk,
  generateRiskMetrics,
  assessPortfolioRisk
} from '../native';