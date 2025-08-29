/**
 * Service Management Module
 * Customer service, field service, and support management
 */

export interface ServiceRequest {
  id: string;
  ticketNumber: string;
  customerId: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'PENDING_CUSTOMER' | 'RESOLVED' | 'CLOSED';
  category: string;
  subcategory: string;
  subject: string;
  description: string;
  assignedTechnicianId?: string;
  estimatedResolutionTime?: Date;
  actualResolutionTime?: Date;
  customerSatisfactionRating?: number;
  createdDate: Date;
}

export interface FieldService {
  id: string;
  workOrderNumber: string;
  serviceType: 'INSTALLATION' | 'MAINTENANCE' | 'REPAIR' | 'INSPECTION';
  assetId: string;
  customerId: string;
  technicianId: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  scheduledDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  laborHours: number;
  partsUsed: Array<{ partId: string; quantity: number }>;
  serviceNotes: string;
}

export class ServiceManager {
  async createServiceRequest(request: Omit<ServiceRequest, 'id' | 'ticketNumber' | 'status' | 'createdDate'>): Promise<ServiceRequest> {
    const id = `sr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const ticketNumber = `SR${Date.now().toString().slice(-6)}`;
    
    return {
      ...request,
      id,
      ticketNumber,
      status: 'NEW',
      createdDate: new Date()
    };
  }

  async scheduleFieldService(service: Omit<FieldService, 'id' | 'workOrderNumber' | 'status'>): Promise<FieldService> {
    const id = `fs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const workOrderNumber = `WO${Date.now().toString().slice(-6)}`;
    
    return {
      ...service,
      id,
      workOrderNumber,
      status: 'SCHEDULED'
    };
  }
}

export const serviceManager = new ServiceManager();