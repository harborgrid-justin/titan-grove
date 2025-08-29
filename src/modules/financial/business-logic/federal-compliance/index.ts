/**
 * Federal Compliance Module - Index
 * Exports all services and types for federal compliance
 */

// Export all types
export * from './types';

// Export main service
export { FederalComplianceService, federalComplianceService } from './main-service';

// Legacy compatibility - re-export main service as the original name
export {
  FederalComplianceService as FederalComplianceServiceLegacy,
  federalComplianceService as federalComplianceServiceLegacy
} from './main-service';