/**
 * Rental Management Module
 * Fortune 100 grade rental asset management and optimization
 * 
 * Provides comprehensive rental management capabilities including:
 * - Rental agreement lifecycle management
 * - Asset utilization tracking and optimization
 * - Maintenance coordination for rental assets
 * - Revenue optimization and pricing strategies
 * - Fleet management for rental equipment
 * - Performance analytics and reporting
 */

export * from './business-logic/rental-management-service';
export * from './types';

// Export data access layer
export * from './data-access';

// Core rental management functionality
export { RentalManagementService, rentalManagementService } from './business-logic/rental-management-service';

// Types
export type {
  RentalAsset,
  RentalAgreement,
  RentalFleet,
  RentalUtilization,
  RentalRevenue,
  RentalMaintenance,
  RentalCustomer,
  RentalPricing,
  RentalPerformance,
  RentalContract,
  EquipmentRental,
  FleetOptimization,
  RentalAnalytics,
  RentalReservation,
  RentalBilling
} from './types';