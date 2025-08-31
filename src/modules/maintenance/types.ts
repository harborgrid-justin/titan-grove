/**
 * Maintenance Management Module Types
 * Core interfaces and types for maintenance management system
 */

// Core Maintenance Types
export interface MaintenanceEntity {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'COMPLETED';
  createdDate: Date;
  modifiedDate: Date;
  createdBy: string;
  modifiedBy: string;
}

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
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  specifications: Record<string, any>;
  maintenanceHistory: MaintenanceRecord[];
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
  materialsRequired: MaintenancePart[];
  laborCharges: Array<{
    technicianId: string;
    hours: number;
    rate: number;
    description: string;
  }>;
  safetyRequirements: string[];
  createdDate: Date;
}

export interface MaintenancePart {
  id: string;
  partNumber: string;
  description: string;
  quantityRequired: number;
  unitCost: number;
  supplier?: string;
  leadTime?: number;
}

export interface MaintenanceRecord {
  id: string;
  assetId: string;
  workOrderId: string;
  maintenanceDate: Date;
  maintenanceType: 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY' | 'PREDICTIVE';
  description: string;
  technicianId: string;
  hoursSpent: number;
  cost: number;
  partsUsed: MaintenancePart[];
  notes: string;
  nextMaintenanceDate?: Date;
}

export interface MaintenanceSchedule {
  id: string;
  assetId: string;
  maintenanceType: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY' | 'USAGE_BASED';
  intervalValue: number;
  lastPerformed?: Date;
  nextDue: Date;
  estimatedDuration: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface MaintenanceTechnician {
  id: string;
  employeeId: string;
  name: string;
  skills: TechnicianSkill[];
  certifications: string[];
  availabilitySchedule: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }>;
  currentAssignments: string[];
  hourlyRate: number;
}

export interface TechnicianSkill {
  skillName: string;
  proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  certificationRequired: boolean;
  lastAssessment?: Date;
}

export interface MaintenanceKPI {
  id: string;
  name: string;
  description: string;
  category: 'EFFICIENCY' | 'COST' | 'QUALITY' | 'SAFETY';
  targetValue: number;
  currentValue: number;
  unit: string;
  reportingPeriod: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  lastCalculated: Date;
}
