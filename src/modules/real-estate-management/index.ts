/**
 * Real Estate Management Module
 * Fortune 100 grade real estate portfolio management and advanced forecasting
 * 
 * Provides comprehensive real estate management capabilities including:
 * - Property portfolio management and tracking
 * - Lease management and administration
 * - Facility management and space optimization
 * - Real estate market analysis and forecasting
 * - Occupancy optimization and space planning
 * - Property valuation and investment analysis
 * - Maintenance and capital improvement tracking
 */

export * from './business-logic/real-estate-service';
export * from './types';

// Export data access layer
export * from './data-access';

// Core real estate management functionality
export { RealEstateService, realEstateService } from './business-logic/real-estate-service';

// Types
export type {
  RealEstateProperty,
  LeaseAgreement,
  PropertyPortfolio,
  FacilityManagement,
  SpaceOptimization,
  MarketAnalysis,
  PropertyValuation,
  OccupancyAnalysis,
  RealEstateForecast,
  PropertyInvestment,
  MaintenanceContract,
  CapitalImprovement,
  PropertyPerformance,
  LocationAnalysis,
  RentalYield
} from './types';