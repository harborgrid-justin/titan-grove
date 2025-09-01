/**
 * Field Service Management Module
 * Oracle Field Service competitive implementation
 * 
 * Provides comprehensive field service capabilities including:
 * - Service request and work order management
 * - Technician scheduling and dispatch optimization
 * - Mobile workforce management
 * - Service contract and warranty management
 * - Parts inventory and logistics
 * - Customer communication and portal
 * - Service performance analytics
 */

export * from './business-logic/field-service-service';
export * from './types';

// Core field service functionality
export { 
  FieldServiceService, 
  fieldServiceService, 
  createFieldServiceService 
} from './business-logic/field-service-service';

// Types
export type {
  ServiceRequest,
  WorkOrder,
  ServiceTechnician,
  ServiceContract,
  ServiceAppointment,
  FieldInventory,
  ServicePerformance,
  CustomerPortal,
  ServiceAnalytics,
  MobileWorkforce,
  DispatchOptimization,
  ServiceWarranty
} from './types';