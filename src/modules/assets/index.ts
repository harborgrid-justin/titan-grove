/**
 * Asset Management Module
 * Comprehensive asset lifecycle tracking, install base management, and enterprise asset management
 * Oracle Install Base competitor with advanced tracking capabilities
 */

// Export all types (includes both existing and new types)
export * from './types';

// Export data access layer
export * from './data-access/repositories';

// Export business logic services
export * from './business-logic/asset-management/asset-management-service';

// ============================================================================
// CORE ASSET INTERFACES (Existing - maintained for backward compatibility)
// ============================================================================

export interface Asset {
  id: string;
  assetNumber: string;
  assetName: string;
  description: string;
  category: 'EQUIPMENT' | 'FACILITY' | 'VEHICLE' | 'IT_HARDWARE' | 'INFRASTRUCTURE' | 'OTHER';
  assetType: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'DISPOSED' | 'RETIRED' | 'LOST' | 'STOLEN';
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';
  acquisitionDate: Date;
  purchasePrice: number;
  currentValue: number;
  depreciationMethod: 'STRAIGHT_LINE' | 'DECLINING_BALANCE' | 'UNITS_OF_PRODUCTION';
  usefulLife: number; // in years
  location: AssetLocation;
  assignedTo?: string; // Employee ID
  parentAssetId?: string;
  childAssets: string[];
  warrantyInfo: WarrantyInfo;
  specifications: Record<string, any>;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface AssetLocation {
  locationId: string;
  locationName: string;
  building?: string;
  floor?: string;
  room?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface WarrantyInfo {
  warrantyNumber?: string;
  startDate?: Date;
  endDate?: Date;
  coverage: string;
  provider: string;
  isActive: boolean;
}

// ============================================================================
// INSTALL BASE INTERFACES
// ============================================================================

export interface InstallBase {
  id: string;
  instanceNumber: string;
  assetId: string;
  customerId: string;
  customerName: string;
  installationDate: Date;
  configurationId: string;
  status: 'INSTALLED' | 'OPERATIONAL' | 'DOWN' | 'MAINTENANCE' | 'REMOVED';
  location: AssetLocation;
  configuration: ItemConfiguration[];
  serviceHistory: ServiceRecord[];
  supportLevel: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
  contractId?: string;
  nextServiceDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemConfiguration {
  itemId: string;
  itemName: string;
  quantity: number;
  serialNumbers: string[];
  version?: string;
  installDate: Date;
  isActive: boolean;
}

export interface ServiceRecord {
  id: string;
  serviceDate: Date;
  serviceType: 'INSTALLATION' | 'MAINTENANCE' | 'REPAIR' | 'UPGRADE' | 'INSPECTION' | 'REMOVAL';
  description: string;
  technicianId: string;
  technicianName: string;
  duration: number; // in hours
  cost: number;
  partsUsed: ServicePart[];
  outcome: 'SUCCESSFUL' | 'PARTIAL' | 'FAILED' | 'DEFERRED';
  notes?: string;
  nextServiceRecommended?: Date;
}

export interface ServicePart {
  partId: string;
  partName: string;
  quantity: number;
  cost: number;
  serialNumber?: string;
}

// ============================================================================
// ASSET LIFECYCLE INTERFACES
// ============================================================================

export interface AssetLifecycleEvent {
  id: string;
  assetId: string;
  eventType: 'ACQUISITION' | 'DEPLOYMENT' | 'TRANSFER' | 'MAINTENANCE' | 'UPGRADE' | 'DISPOSAL' | 'AUDIT';
  eventDate: Date;
  fromStatus?: string;
  toStatus: string;
  fromLocation?: AssetLocation;
  toLocation?: AssetLocation;
  reason: string;
  description: string;
  cost?: number;
  documents: Document[];
  approvedBy: string;
  executedBy: string;
  createdAt: Date;
}

export interface Document {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: Date;
  uploadedBy: string;
  url: string;
}

// ============================================================================
// MAINTENANCE MANAGEMENT INTERFACES
// ============================================================================

export interface MaintenanceSchedule {
  id: string;
  assetId: string;
  maintenanceType: 'PREVENTIVE' | 'CORRECTIVE' | 'PREDICTIVE' | 'EMERGENCY';
  title: string;
  description: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY' | 'ON_CONDITION';
  intervalDays?: number;
  lastPerformed?: Date;
  nextDue: Date;
  estimatedDuration: number; // in hours
  estimatedCost: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  assignedTechnicianId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssetWorkOrder {
  id: string;
  workOrderNumber: string;
  assetId: string;
  maintenanceScheduleId?: string;
  title: string;
  description: string;
  type: 'PREVENTIVE' | 'CORRECTIVE' | 'PREDICTIVE' | 'EMERGENCY' | 'PROJECT';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  requestedBy: string;
  assignedTo?: string;
  requestDate: Date;
  scheduledStartDate?: Date;
  actualStartDate?: Date;
  estimatedCompletionDate?: Date;
  actualCompletionDate?: Date;
  estimatedCost: number;
  actualCost: number;
  laborHours: number;
  materials: AssetWorkOrderMaterial[];
  instructions?: string;
  completionNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssetWorkOrderMaterial {
  materialId: string;
  materialName: string;
  quantityRequired: number;
  quantityUsed: number;
  unitCost: number;
  totalCost: number;
  reservedQuantity: number;
}

// ============================================================================
// AUDIT AND COMPLIANCE INTERFACES
// ============================================================================

export interface AssetAudit {
  id: string;
  auditNumber: string;
  auditType: 'PHYSICAL' | 'FINANCIAL' | 'COMPLIANCE' | 'LIFECYCLE';
  auditDate: Date;
  auditorId: string;
  auditorName: string;
  scope: 'SINGLE_ASSET' | 'LOCATION' | 'CATEGORY' | 'ENTERPRISE';
  targetAssetIds?: string[];
  targetLocations?: string[];
  targetCategories?: string[];
  findings: AuditFinding[];
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  completionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditFinding {
  id: string;
  assetId: string;
  findingType: 'DISCREPANCY' | 'MISSING' | 'UNAUTHORIZED' | 'CONDITION' | 'COMPLIANCE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  recommendedAction: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'ACCEPTED';
  assignedTo?: string;
  dueDate?: Date;
  resolutionDate?: Date;
  resolutionNotes?: string;
  createdAt: Date;
}

export interface ComplianceRequirement {
  id: string;
  requirementName: string;
  regulatoryBody: string;
  description: string;
  applicableAssetTypes: string[];
  inspectionFrequency: string;
  renewalFrequency?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ComplianceRecord {
  id: string;
  assetId: string;
  requirementId: string;
  complianceDate: Date;
  expirationDate?: Date;
  certificationNumber?: string;
  inspectorId: string;
  inspectorName: string;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING' | 'EXPIRED';
  findings?: string;
  corrective_actions?: string;
  documents: Document[];
  nextInspectionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// ANALYTICS AND REPORTING INTERFACES
// ============================================================================

export interface AssetMetrics {
  totalAssets: number;
  assetsByCategory: Record<string, number>;
  assetsByStatus: Record<string, number>;
  assetsByCondition: Record<string, number>;
  totalValue: number;
  averageAge: number;
  utilizationRate: number;
  maintenanceCosts: number;
  depreciationRate: number;
}

export interface MaintenanceMetrics {
  totalWorkOrders: number;
  completedWorkOrders: number;
  overdueWorkOrders: number;
  averageCompletionTime: number;
  maintenanceCostsByType: Record<string, number>;
  mtbf: number; // Mean Time Between Failures
  mttr: number; // Mean Time To Repair
  scheduleCompliance: number;
}

// ============================================================================
// ASSET MANAGER CLASS
// ============================================================================

// Import shared utilities
import { BaseManager } from '../../shared/utils/base-manager';

export class AssetManager extends BaseManager {
  /**
   * Asset Lifecycle Management
   */
  async createAsset(asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt' | 'childAssets'>): Promise<Asset> {
    const id = this.generateId('asset');
    const now = new Date();
    
    const newAsset: Asset = {
      ...asset,
      id,
      createdAt: now,
      updatedAt: now,
      childAssets: []
    };

    // Create lifecycle event for acquisition
    await this.recordLifecycleEvent({
      assetId: id,
      eventType: 'ACQUISITION',
      eventDate: asset.acquisitionDate,
      toStatus: asset.status,
      reason: 'Asset acquisition',
      description: `Asset ${asset.assetName} acquired`,
      cost: asset.purchasePrice,
      documents: [],
      approvedBy: asset.createdBy,
      executedBy: asset.createdBy
    });

    console.log(`Created asset: ${newAsset.assetName} (${newAsset.assetNumber})`);
    return newAsset;
  }

  async updateAsset(assetId: string, updates: Partial<Asset>): Promise<Asset> {
    const updatedAsset = {
      ...updates,
      id: assetId,
      updatedAt: new Date()
    } as Asset;

    console.log(`Updated asset ${assetId}:`, updates);
    return updatedAsset;
  }

  async transferAsset(assetId: string, fromLocation: AssetLocation, toLocation: AssetLocation, transferredBy: string, reason: string): Promise<void> {
    await this.recordLifecycleEvent({
      assetId,
      eventType: 'TRANSFER',
      eventDate: new Date(),
      fromLocation,
      toLocation,
      toStatus: 'ACTIVE',
      reason,
      description: `Asset transferred from ${fromLocation.locationName} to ${toLocation.locationName}`,
      documents: [],
      approvedBy: transferredBy,
      executedBy: transferredBy
    });

    console.log(`Asset ${assetId} transferred from ${fromLocation.locationName} to ${toLocation.locationName}`);
  }

  async disposeAsset(assetId: string, disposalReason: string, disposalValue: number, disposedBy: string): Promise<void> {
    await this.updateAsset(assetId, { 
      status: 'DISPOSED',
      currentValue: disposalValue,
      updatedBy: disposedBy
    });

    await this.recordLifecycleEvent({
      assetId,
      eventType: 'DISPOSAL',
      eventDate: new Date(),
      fromStatus: 'ACTIVE',
      toStatus: 'DISPOSED',
      reason: disposalReason,
      description: `Asset disposed: ${disposalReason}`,
      cost: disposalValue,
      documents: [],
      approvedBy: disposedBy,
      executedBy: disposedBy
    });

    console.log(`Asset ${assetId} disposed with value ${disposalValue}`);
  }

  async recordLifecycleEvent(event: Omit<AssetLifecycleEvent, 'id' | 'createdAt'>): Promise<AssetLifecycleEvent> {
    const id = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const lifecycleEvent: AssetLifecycleEvent = {
      ...event,
      id,
      createdAt: new Date()
    };

    console.log(`Recorded lifecycle event for asset ${event.assetId}: ${event.eventType}`);
    return lifecycleEvent;
  }

  /**
   * Asset Tracking and Visibility
   */
  async trackAssetLocation(assetId: string): Promise<AssetLocation> {
    // Implementation would integrate with RFID, GPS, or other tracking systems
    const mockLocation: AssetLocation = {
      locationId: 'loc_001',
      locationName: 'Main Facility',
      building: 'Building A',
      floor: '2nd Floor',
      room: 'Room 205',
      address: {
        street: '123 Business Ave',
        city: 'Business City',
        state: 'BC',
        postalCode: '12345',
        country: 'USA'
      }
    };

    console.log(`Tracking asset ${assetId} location:`, mockLocation);
    return mockLocation;
  }

  async getAssetHistory(assetId: string): Promise<AssetLifecycleEvent[]> {
    // Implementation would retrieve complete asset history
    console.log(`Retrieving history for asset ${assetId}`);
    return [];
  }

  async searchAssets(criteria: {
    category?: string;
    status?: string;
    location?: string;
    assignedTo?: string;
    tags?: string[];
  }): Promise<Asset[]> {
    console.log('Searching assets with criteria:', criteria);
    return [];
  }

  async getAssetUtilization(assetId: string, startDate: Date, endDate: Date): Promise<number> {
    // Implementation would calculate asset utilization percentage
    console.log(`Calculating utilization for asset ${assetId} from ${startDate} to ${endDate}`);
    return 75; // Mock 75% utilization
  }

  /**
   * Install Base Management
   */
  /**
   * Generate a unique ID with a given prefix.
   */
  async createInstallBase(installBase: Omit<InstallBase, 'id' | 'createdAt' | 'updatedAt'>): Promise<InstallBase> {
    const id = this.generateId('install');
    const now = new Date();

    const newInstallBase: InstallBase = {
      ...installBase,
      id,
      createdAt: now,
      updatedAt: now
    };

    console.log(`Created install base: ${newInstallBase.instanceNumber} for customer ${newInstallBase.customerName}`);
    return newInstallBase;
  }

  async updateInstallBaseStatus(installBaseId: string, status: InstallBase['status']): Promise<void> {
    console.log(`Updated install base ${installBaseId} status to ${status}`);
  }

  async scheduleService(installBaseId: string, serviceType: ServiceRecord['serviceType'], scheduledDate: Date, technicianId: string): Promise<string> {
    const serviceId = `service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`Scheduled ${serviceType} service for install base ${installBaseId} on ${scheduledDate}`);
    return serviceId;
  }

  async recordServiceActivity(installBaseId: string, serviceRecord: Omit<ServiceRecord, 'id'>): Promise<ServiceRecord> {
    const id = `service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newServiceRecord: ServiceRecord = { ...serviceRecord, id };

    console.log(`Recorded service activity for install base ${installBaseId}:`, serviceRecord.serviceType);
    return newServiceRecord;
  }

  async getInstallBaseConfiguration(installBaseId: string): Promise<ItemConfiguration[]> {
    // Implementation would return current configuration
    console.log(`Retrieving configuration for install base ${installBaseId}`);
    return [];
  }

  /**
   * Enterprise Asset Management
   */
  async identifyObsoleteAssets(criteria: {
    lastUsedBefore?: Date;
    condition?: Asset['condition'];
    utilizationThreshold?: number;
  }): Promise<Asset[]> {
    console.log('Identifying obsolete assets with criteria:', criteria);
    // Implementation would analyze asset data to find obsolete items
    return [];
  }

  async optimizeSparePartsInventory(locationId: string): Promise<{
    excess: Array<{itemId: string, excessQuantity: number, estimatedValue: number}>;
    shortages: Array<{itemId: string, shortageQuantity: number, criticality: string}>;
  }> {
    console.log(`Optimizing spare parts inventory for location ${locationId}`);
    // Implementation would analyze usage patterns and recommend inventory adjustments
    return {
      excess: [],
      shortages: []
    };
  }

  async createMaintenanceSchedule(schedule: Omit<MaintenanceSchedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<MaintenanceSchedule> {
    const id = `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();

    const newSchedule: MaintenanceSchedule = {
      ...schedule,
      id,
      createdAt: now,
      updatedAt: now
    };

    console.log(`Created maintenance schedule for asset ${schedule.assetId}: ${schedule.title}`);
    return newSchedule;
  }

  async createWorkOrder(workOrder: Omit<AssetWorkOrder, 'id' | 'workOrderNumber' | 'createdAt' | 'updatedAt'>): Promise<AssetWorkOrder> {
    const id = `wo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const workOrderNumber = `WO-${Date.now()}`;
    const now = new Date();

    const newWorkOrder: AssetWorkOrder = {
      ...workOrder,
      id,
      workOrderNumber,
      createdAt: now,
      updatedAt: now
    };

    console.log(`Created work order ${workOrderNumber} for asset ${workOrder.assetId}`);
    return newWorkOrder;
  }

  async completeWorkOrder(workOrderId: string, completionData: {
    actualCompletionDate: Date;
    actualCost: number;
    laborHours: number;
    materialsUsed: AssetWorkOrderMaterial[];
    completionNotes: string;
  }): Promise<void> {
    console.log(`Completed work order ${workOrderId}:`, completionData);
  }

  async generateMaintenanceSchedule(assetId: string, scheduleType: 'PREVENTIVE' | 'PREDICTIVE'): Promise<MaintenanceSchedule[]> {
    console.log(`Generating ${scheduleType} maintenance schedule for asset ${assetId}`);
    // Implementation would create maintenance schedules based on asset type and manufacturer recommendations
    return [];
  }

  /**
   * Compliance and Audit Management
   */
  async createComplianceRequirement(requirement: Omit<ComplianceRequirement, 'id' | 'createdAt' | 'updatedAt'>): Promise<ComplianceRequirement> {
    const id = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();

    const newRequirement: ComplianceRequirement = {
      ...requirement,
      id,
      createdAt: now,
      updatedAt: now
    };

    console.log(`Created compliance requirement: ${requirement.requirementName}`);
    return newRequirement;
  }

  async recordComplianceInspection(record: Omit<ComplianceRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<ComplianceRecord> {
    const id = `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();

    const newRecord: ComplianceRecord = {
      ...record,
      id,
      createdAt: now,
      updatedAt: now
    };

    console.log(`Recorded compliance inspection for asset ${record.assetId}`);
    return newRecord;
  }

  async scheduleAudit(audit: Omit<AssetAudit, 'id' | 'createdAt' | 'updatedAt' | 'findings'>): Promise<AssetAudit> {
    const id = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();

    const newAudit: AssetAudit = {
      ...audit,
      id,
      findings: [],
      createdAt: now,
      updatedAt: now
    };

    console.log(`Scheduled ${audit.auditType} audit: ${audit.auditNumber}`);
    return newAudit;
  }

  async recordAuditFinding(auditId: string, finding: Omit<AuditFinding, 'id' | 'createdAt'>): Promise<AuditFinding> {
    const id = `finding_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newFinding: AuditFinding = {
      ...finding,
      id,
      createdAt: new Date()
    };

    console.log(`Recorded audit finding for asset ${finding.assetId}: ${finding.findingType}`);
    return newFinding;
  }

  /**
   * Analytics and Reporting
   */
  async getAssetMetrics(): Promise<AssetMetrics> {
    // Implementation would aggregate asset data for metrics
    return {
      totalAssets: 0,
      assetsByCategory: {},
      assetsByStatus: {},
      assetsByCondition: {},
      totalValue: 0,
      averageAge: 0,
      utilizationRate: 0,
      maintenanceCosts: 0,
      depreciationRate: 0
    };
  }

  async getMaintenanceMetrics(): Promise<MaintenanceMetrics> {
    // Implementation would calculate maintenance KPIs
    return {
      totalWorkOrders: 0,
      completedWorkOrders: 0,
      overdueWorkOrders: 0,
      averageCompletionTime: 0,
      maintenanceCostsByType: {},
      mtbf: 0,
      mttr: 0,
      scheduleCompliance: 0
    };
  }

  async generateAssetReport(reportType: 'INVENTORY' | 'LIFECYCLE' | 'MAINTENANCE' | 'COMPLIANCE', filters?: any): Promise<any> {
    console.log(`Generating ${reportType} report with filters:`, filters);
    // Implementation would generate comprehensive reports
    return {
      reportType,
      generatedAt: new Date(),
      data: []
    };
  }

  async calculateAssetDepreciation(assetId: string, asOfDate: Date): Promise<{
    originalValue: number;
    depreciatedValue: number;
    accumulatedDepreciation: number;
    remainingValue: number;
  }> {
    console.log(`Calculating depreciation for asset ${assetId} as of ${asOfDate}`);
    // Implementation would calculate depreciation based on method and useful life
    return {
      originalValue: 0,
      depreciatedValue: 0,
      accumulatedDepreciation: 0,
      remainingValue: 0
    };
  }
}

export const assetManager = new AssetManager();