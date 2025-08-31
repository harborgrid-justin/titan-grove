/**
 * Equipment Cost Analysis Module
 * Fortune 100 grade total cost of ownership and equipment cost optimization
 * 
 * Provides comprehensive cost analysis capabilities including:
 * - Total Cost of Ownership (TCO) calculations
 * - Equipment cost benchmarking and optimization
 * - Lifecycle cost analysis and planning
 * - Cost-benefit analysis for equipment decisions
 * - Procurement cost optimization
 * - Operating cost tracking and reduction
 * - Maintenance cost optimization
 */

export * from './business-logic/equipment-cost-service';
export * from './types';

// Core equipment cost analysis functionality
export { EquipmentCostService, equipmentCostService } from './business-logic/equipment-cost-service';

// Types
export type {
  EquipmentCostProfile,
  TotalCostOfOwnership,
  CostBenchmark,
  LifecycleCostAnalysis,
  CostOptimization,
  CostBreakdown,
  CostVarianceAnalysis,
  CostForecast,
  CostCenter,
  CostDriver,
  CostReduction,
  EquipmentProcurementCost,
  OperatingCostAnalysis,
  MaintenanceCostAnalysis,
  CostPerformanceIndicator
} from './types';