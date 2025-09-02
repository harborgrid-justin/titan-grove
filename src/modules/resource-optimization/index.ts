/**
 * Resource Optimization Module
 * Fortune 100 grade resource assignment optimization and capacity planning
 * 
 * Provides comprehensive resource optimization capabilities including:
 * - Intelligent resource assignment and matching
 * - Capacity planning and optimization
 * - Skill-based resource allocation
 * - Resource utilization optimization
 * - Workforce planning and forecasting
 * - Multi-project resource optimization
 * - Resource cost optimization
 */

export * from './business-logic/resource-optimization-service';
export * from './types';

// Export data access layer
export * from './data-access';

// Core resource optimization functionality
export { ResourceOptimizationService, resourceOptimizationService } from './business-logic/resource-optimization-service';

// Types
export type {
  ResourceOptimization,
  ResourceAssignment,
  CapacityPlan,
  ResourceUtilization,
  SkillMatrix,
  WorkforceAnalytics,
  ResourceForecast,
  ResourcePool,
  AllocationStrategy,
  ResourceConstraint,
  OptimizationScenario,
  ResourcePerformance,
  CapacityAnalysis,
  ResourceBenchmark,
  WorkloadDistribution
} from './types';