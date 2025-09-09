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

// Export business logic services  
import { BaseManager } from '../../shared/utils/base-manager';

// Import business logic services
import { fieldServiceService } from './business-logic/field-service-service';

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

/**
 * Field Service Manager
 * Provides unified interface for all field service management operations
 */
export class FieldServiceManager extends BaseManager {
  /**
   * Create a new service request
   */
  async createServiceRequest(requestData: any): Promise<any> {
    const id = this.generateId('sr');
    const serviceRequest = {
      id,
      ...requestData,
      createdAt: new Date(),
      status: 'OPEN'
    };
    this.logAction('createServiceRequest', { id });
    return serviceRequest;
  }

  /**
   * Get service request by ID
   */
  async getServiceRequest(requestId: string): Promise<any> {
    this.logAction('getServiceRequest', { requestId });
    // Implementation would retrieve from data store
    return { id: requestId, status: 'OPEN', createdAt: new Date() };
  }

  /**
   * Update service request
   */
  async updateServiceRequest(requestId: string, updates: any): Promise<any> {
    this.logAction('updateServiceRequest', { requestId, updates });
    return { id: requestId, ...updates, updatedAt: new Date() };
  }

  /**
   * Delete service request
   */
  async deleteServiceRequest(requestId: string): Promise<void> {
    this.logAction('deleteServiceRequest', { requestId });
    // Implementation would delete from data store
  }

  /**
   * List service requests
   */
  async listServiceRequests(criteria?: any): Promise<any[]> {
    this.logAction('listServiceRequests', criteria);
    return [];
  }

  /**
   * Create work order from service request
   */
  async createWorkOrder(serviceRequestId: string, workOrderData: any): Promise<any> {
    return await fieldServiceService.createWorkOrder(serviceRequestId);
  }

  /**
   * Schedule service appointment
   */
  async scheduleServiceAppointment(workOrderId: string, appointmentData: any): Promise<any> {
    return await fieldServiceService.scheduleAppointment(appointmentData);
  }
}

export const fieldServiceManager = new FieldServiceManager();