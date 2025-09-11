/**
 * Yard Management Module
 * Oracle Yard Management competitive implementation
 *
 * Provides comprehensive yard and dock management capabilities including:
 * - Dock door scheduling and management
 * - Yard space optimization and allocation
 * - Trailer tracking and management
 * - Appointment scheduling and coordination
 * - Gate operations and security
 * - Yard equipment management
 */

export * from './business-logic/yard-management-service';
export * from './types';

// Export data access layer
export * from './data-access';

// Core yard management functionality
export {
  YardManagementService,
  yardManagementService,
} from './business-logic/yard-management-service';

// Types
export type {
  YardFacility,
  DockDoor,
  YardSpace,
  TrailerManagement,
  AppointmentSchedule,
  GateOperation,
  YardEquipment,
  YardOptimization,
  YardPerformanceMetrics,
} from './types';
