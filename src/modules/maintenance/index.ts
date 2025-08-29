/**
 * Maintenance Management Module  
 * Asset maintenance, preventive maintenance, and work order management
 */

export interface MaintenanceAsset {
  id: string;
  assetNumber: string;
  name: string;
  description: string;
  category: string;
  location: string;
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_SERVICE' | 'RETIRED';
  criticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  installationDate: Date;
  warrantyExpirationDate?: Date;
  lastMaintenanceDate?: Date;
  nextScheduledMaintenance?: Date;
}

export interface MaintenanceWorkOrder {
  id: string;
  workOrderNumber: string;
  assetId: string;
  workOrderType: 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY' | 'PREDICTIVE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PLANNED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  description: string;
  assignedTechnicianId?: string;
  estimatedHours: number;
  actualHours?: number;
  scheduledDate: Date;
  completionDate?: Date;
  totalCost?: number;
  createdDate: Date;
}

export class MaintenanceManager {
  async createMaintenanceAsset(asset: Omit<MaintenanceAsset, 'id'>): Promise<MaintenanceAsset> {
    const id = `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { ...asset, id };
  }

  async schedulePreventiveMaintenance(assetId: string, maintenanceType: string, intervalDays: number): Promise<MaintenanceWorkOrder[]> {
    console.log(`Scheduling preventive maintenance for asset ${assetId}`);
    return [];
  }

  async createWorkOrder(workOrder: Omit<MaintenanceWorkOrder, 'id' | 'workOrderNumber' | 'status' | 'createdDate'>): Promise<MaintenanceWorkOrder> {
    const id = `mwo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const workOrderNumber = `MWO${Date.now().toString().slice(-6)}`;
    
    return {
      ...workOrder,
      id,
      workOrderNumber,
      status: 'PLANNED',
      createdDate: new Date()
    };
  }
}

export const maintenanceManager = new MaintenanceManager();