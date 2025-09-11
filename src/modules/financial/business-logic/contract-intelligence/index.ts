/**
 * Contract Intelligence Module - Index
 * Exports all services and types for contract intelligence
 */

// Export all types
export * from './types';

// Export all services
export { DashboardService, dashboardService } from './dashboard-service';
export { KPIService, kpiService } from './kpi-service';
export { ComplianceService, complianceService } from './compliance-service';
export {
  OperationalMetricsService,
  operationalMetricsService,
} from './operational-metrics-service';
export { ContractIntelligenceService, contractIntelligenceService } from './main-service';

// Legacy compatibility - re-export main service as the original name
export {
  ContractIntelligenceService as ContractIntelligenceServiceLegacy,
  contractIntelligenceService as contractIntelligenceServiceLegacy,
} from './main-service';
