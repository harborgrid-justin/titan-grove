/**
 * Asset Management Module Types
 * Core interfaces and types for asset management system
 */

// Core Asset Types
export interface Asset {
  id: string;
  assetNumber: string;
  name: string;
  description: string;
  category: AssetCategory;
  type: 'TANGIBLE' | 'INTANGIBLE' | 'FIXED' | 'CURRENT';
  status: 'ACTIVE' | 'INACTIVE' | 'DISPOSED' | 'UNDER_MAINTENANCE';
  location: string;
  department: string;
  costCenter: string;
  purchaseDate: Date;
  purchasePrice: number;
  currentValue: number;
  depreciationMethod: 'STRAIGHT_LINE' | 'DECLINING_BALANCE' | 'UNITS_OF_PRODUCTION';
  usefulLife: number;
  salvageValue: number;
  warranty?: AssetWarranty;
  maintenance?: AssetMaintenance[];
  createdDate: Date;
  modifiedDate: Date;
}

export interface AssetCategory {
  id: string;
  name: string;
  code: string;
  parentCategoryId?: string;
  depreciationRate: number;
  glAccount: string;
}

export interface AssetWarranty {
  id: string;
  assetId: string;
  provider: string;
  startDate: Date;
  endDate: Date;
  terms: string;
  contactInfo: string;
}

export interface AssetMaintenance {
  id: string;
  assetId: string;
  type: 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY';
  scheduledDate: Date;
  completedDate?: Date;
  cost: number;
  description: string;
  performedBy: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface AssetDepreciation {
  id: string;
  assetId: string;
  year: number;
  period: string;
  depreciationAmount: number;
  accumulatedDepreciation: number;
  bookValue: number;
  method: string;
  createdDate: Date;
}

export interface AssetTransfer {
  id: string;
  assetId: string;
  fromLocation: string;
  toLocation: string;
  fromDepartment: string;
  toDepartment: string;
  transferDate: Date;
  requestedBy: string;
  approvedBy: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
}

export interface AssetDisposal {
  id: string;
  assetId: string;
  disposalDate: Date;
  disposalMethod: 'SALE' | 'DONATION' | 'SCRAP' | 'RETURN';
  disposalValue: number;
  reason: string;
  approvedBy: string;
  documentation: string[];
}

export interface AssetAudit {
  id: string;
  auditDate: Date;
  auditor: string;
  location: string;
  assetsCount: number;
  discrepancies: AssetDiscrepancy[];
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface AssetDiscrepancy {
  assetId: string;
  type: 'MISSING' | 'DAMAGED' | 'LOCATION_MISMATCH' | 'DATA_ERROR';
  description: string;
  resolvedDate?: Date;
  resolvedBy?: string;
  resolution?: string;
}

export interface AssetInsurance {
  id: string;
  assetId: string;
  provider: string;
  policyNumber: string;
  coverageAmount: number;
  premium: number;
  startDate: Date;
  endDate: Date;
  coverageType: string[];
}