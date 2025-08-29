/**
 * Procurement Planning Module - Index
 * Exports all services and types for procurement planning
 */

// Export all types
export * from './types';

// Export main service
export { ProcurementPlanningService, procurementPlanningService } from './main-service';

// Legacy compatibility - re-export main service as the original name
export {
  ProcurementPlanningService as ProcurementPlanningServiceLegacy,
  procurementPlanningService as procurementPlanningServiceLegacy
} from './main-service';