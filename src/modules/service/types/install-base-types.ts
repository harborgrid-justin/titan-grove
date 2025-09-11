/**
 * Install Base Management Types
 * Comprehensive Oracle EBS competitive install base and asset management types
 */

// ================================
// CORE ENUMS
// ================================

export enum AssetStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  RETIRED = 'RETIRED',
  DISPOSED = 'DISPOSED',
  MAINTENANCE = 'MAINTENANCE',
  REPAIR = 'REPAIR',
  WARRANTY = 'WARRANTY',
  LOANED = 'LOANED',
  STOLEN = 'STOLEN',
  LOST = 'LOST',
}

export enum AssetCondition {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR',
  NON_FUNCTIONAL = 'NON_FUNCTIONAL',
  UNKNOWN = 'UNKNOWN',
}

export enum MaintenanceType {
  PREVENTIVE = 'PREVENTIVE',
  CORRECTIVE = 'CORRECTIVE',
  PREDICTIVE = 'PREDICTIVE',
  CONDITION_BASED = 'CONDITION_BASED',
  TIME_BASED = 'TIME_BASED',
  USAGE_BASED = 'USAGE_BASED',
}

export enum ConfigurationChangeType {
  ADDITION = 'ADDITION',
  REMOVAL = 'REMOVAL',
  MODIFICATION = 'MODIFICATION',
  REPLACEMENT = 'REPLACEMENT',
  UPGRADE = 'UPGRADE',
  DOWNGRADE = 'DOWNGRADE',
}

export enum WarrantyStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  VOID = 'VOID',
  TRANSFERRED = 'TRANSFERRED',
  EXTENDED = 'EXTENDED',
}

// ================================
// INSTALL BASE & ASSET MANAGEMENT
// ================================

export interface InstallBase {
  id: string;
  installBaseNumber: string;
  name: string;
  description?: string;

  // Customer Information
  customerId: string;
  customerName: string;
  billToCustomerId?: string;
  shipToCustomerId?: string;

  // Location Information
  siteId: string;
  siteName: string;
  address: InstallAddress;

  // Asset Hierarchy
  parentInstallBaseId?: string;
  childInstallBases: string[];
  assets: Asset[];
  assetCount: number;

  // Contract & Service Information
  serviceContracts: string[];
  supportLevel: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
  preferredServiceProvider?: string;

  // Status & Lifecycle
  status: 'ACTIVE' | 'INACTIVE' | 'DECOMMISSIONED';
  installationDate: Date;
  commissioningDate?: Date;
  decommissioningDate?: Date;

  // Financial Information
  totalValue: number;
  totalMaintenanceCost: number;
  totalServiceCost: number;

  // Contact Information
  technicalContact: ContactPerson;
  businessContact: ContactPerson;

  // Tracking & Audit
  createdBy: string;
  createdDate: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
  version: number;

  // Custom Fields
  customAttributes: Record<string, any>;
}

export interface Asset {
  id: string;
  assetNumber: string;
  serialNumber?: string;
  name: string;
  description?: string;

  // Product Information
  productId: string;
  modelNumber: string;
  partNumber: string;
  manufacturerName: string;
  manufacturerPartNumber?: string;

  // Hierarchy & Relationships
  parentAssetId?: string;
  childAssets: string[];
  installBaseId: string;
  locationId?: string;

  // Status & Condition
  status: AssetStatus;
  condition: AssetCondition;
  operationalStatus: 'OPERATIONAL' | 'NON_OPERATIONAL' | 'DEGRADED' | 'TESTING';

  // Installation Information
  installationDate: Date;
  installLocation: AssetLocation;
  installationNotes?: string;
  installedBy?: string;
  commissioningDate?: Date;
  commissionedBy?: string;

  // Specifications & Configuration
  specifications: AssetSpecification[];
  configuration: AssetConfiguration;
  configurationVersion: string;

  // Warranty Information
  warranties: AssetWarranty[];
  currentWarrantyStatus: WarrantyStatus;

  // Service Information
  serviceContracts: string[];
  maintenanceSchedule: MaintenanceSchedule;
  serviceHistory: ServiceRecord[];

  // Usage & Performance
  usageMetrics: UsageMetrics;
  performanceMetrics: PerformanceMetrics;

  // Financial Information
  acquisitionCost: number;
  currentValue: number;
  depreciationMethod: 'STRAIGHT_LINE' | 'DECLINING_BALANCE' | 'SUM_OF_YEARS' | 'CUSTOM';
  depreciationRate: number;
  residualValue: number;

  // Lifecycle Information
  expectedLifespan: number; // years
  remainingLife: number; // years
  retirementDate?: Date;
  disposalMethod?: 'SALE' | 'TRADE_IN' | 'RECYCLE' | 'DISPOSAL' | 'DONATION';

  // Documentation
  manuals: AssetDocument[];
  drawings: AssetDocument[];
  certificates: AssetDocument[];
  photos: string[];

  // Compliance & Safety
  complianceRequirements: ComplianceRequirement[];
  safetyClassification?: string;
  hazardousClassification?: string;

  // Tracking & Audit
  createdBy: string;
  createdDate: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
  lastVerifiedDate?: Date;
  lastVerifiedBy?: string;

  // Custom Fields
  tags: string[];
  customAttributes: Record<string, any>;
}

export interface AssetLocation {
  building?: string;
  floor?: string;
  room?: string;
  aisle?: string;
  rack?: string;
  position?: string;
  coordinates?: GeoLocation;
  locationCode?: string;
  locationDescription?: string;
}

export interface AssetSpecification {
  specId: string;
  name: string;
  value: string;
  unit?: string;
  category: string;
  isKey: boolean;
  validFrom: Date;
  validTo?: Date;
}

export interface AssetConfiguration {
  configurationId: string;
  name: string;
  version: string;
  description?: string;
  components: ConfigurationComponent[];
  parameters: ConfigurationParameter[];
  changeHistory: ConfigurationChange[];
  approvedBy?: string;
  approvedDate?: Date;
  isActive: boolean;
  effectiveDate: Date;
}

export interface ConfigurationComponent {
  componentId: string;
  name: string;
  type: string;
  partNumber?: string;
  serialNumber?: string;
  version?: string;
  quantity: number;
  parentComponentId?: string;
  isRemovable: boolean;
  isCritical: boolean;
  supplier?: string;
  installDate?: Date;
  expectedLife?: number; // years
}

export interface ConfigurationParameter {
  parameterId: string;
  name: string;
  value: string;
  unit?: string;
  dataType: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'DATE' | 'LIST';
  isEditable: boolean;
  validationRules?: ValidationRule[];
  lastModified: Date;
  modifiedBy: string;
}

export interface ValidationRule {
  ruleId: string;
  type: 'RANGE' | 'LIST' | 'REGEX' | 'CUSTOM';
  parameters: Record<string, any>;
  errorMessage: string;
}

export interface ConfigurationChange {
  changeId: string;
  changeNumber: string;
  changeType: ConfigurationChangeType;
  description: string;
  reason: string;

  // Change Details
  fromConfiguration: string;
  toConfiguration: string;
  componentsAffected: string[];
  parametersAffected: string[];

  // Planning & Approval
  plannedDate: Date;
  actualDate?: Date;
  approvalRequired: boolean;
  approvedBy?: string;
  approvedDate?: Date;

  // Implementation
  implementedBy?: string;
  implementationNotes?: string;
  rollbackPlan?: string;
  testingRequired: boolean;
  testResults?: string;

  // Impact Assessment
  downtime: number; // minutes
  impactLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affectedCustomers: string[];
  businessImpact: string;

  // Tracking
  status: 'PLANNED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  createdBy: string;
  createdDate: Date;

  // Documentation
  attachments: string[];
  photos: string[];
}

export interface AssetWarranty {
  warrantyId: string;
  type: 'MANUFACTURER' | 'EXTENDED' | 'SERVICE_PROVIDER' | 'INSURANCE';
  providerId: string;
  providerName: string;

  // Coverage
  coverageType: 'PARTS' | 'LABOR' | 'PARTS_AND_LABOR' | 'COMPREHENSIVE';
  coverageDescription: string;
  exclusions: string[];

  // Terms
  startDate: Date;
  endDate: Date;
  duration: number; // months
  transferable: boolean;
  proRated: boolean;

  // Status
  status: WarrantyStatus;
  isActive: boolean;
  remainingDays: number;

  // Financial
  cost: number;
  deductible?: number;
  maxCoverage?: number;

  // Claims
  claimsHistory: WarrantyClaim[];
  totalClaims: number;
  totalClaimAmount: number;

  // Terms & Conditions
  warrantyNumber: string;
  policyNumber?: string;
  terms: string;

  // Documentation
  warrantyDocument?: string;
  certificateNumber?: string;

  createdDate: Date;
  lastUpdated: Date;
}

export interface WarrantyClaim {
  claimId: string;
  claimNumber: string;
  assetId: string;
  warrantyId: string;

  // Claim Information
  issueDescription: string;
  failureDate: Date;
  claimDate: Date;
  reportedBy: string;

  // Resolution
  resolutionType: 'REPAIR' | 'REPLACEMENT' | 'REFUND' | 'CREDIT';
  resolutionDescription?: string;
  resolvedDate?: Date;
  resolvedBy?: string;

  // Financial
  claimAmount: number;
  approvedAmount: number;
  deductibleAmount: number;

  // Status
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'PAID' | 'CANCELLED';
  approvedBy?: string;
  approvedDate?: Date;
  rejectionReason?: string;

  // Documentation
  workOrderId?: string;
  serviceTicketId?: string;
  attachments: string[];
  photos: string[];
}

// ================================
// MAINTENANCE & SERVICE
// ================================

export interface MaintenanceSchedule {
  assetId: string;
  scheduleId: string;
  name: string;
  description?: string;

  // Schedule Type
  type: MaintenanceType;
  frequency: MaintenanceFrequency;

  // Timing
  nextDueDate: Date;
  lastCompletedDate?: Date;
  averageInterval: number; // days
  tolerance: number; // days early/late allowed

  // Requirements
  requiredSkills: string[];
  estimatedDuration: number; // minutes
  requiredParts: ScheduledPart[];
  requiredTools: string[];

  // Tasks
  maintenanceTasks: MaintenanceTask[];
  checklist: MaintenanceChecklistItem[];

  // Status
  isActive: boolean;
  suspended: boolean;
  suspensionReason?: string;

  // Performance
  completionRate: number; // percentage
  avgActualDuration: number; // minutes
  costPerMaintenance: number;

  // Tracking
  createdBy: string;
  createdDate: Date;
  lastUpdated: Date;
}

export interface MaintenanceFrequency {
  type: 'TIME_BASED' | 'USAGE_BASED' | 'CONDITION_BASED' | 'EVENT_BASED';
  interval: number;
  unit: 'DAYS' | 'WEEKS' | 'MONTHS' | 'YEARS' | 'HOURS' | 'MILES' | 'CYCLES' | 'EVENTS';
  condition?: string; // for condition-based maintenance
  threshold?: number; // for condition-based maintenance
}

export interface ScheduledPart {
  partId: string;
  partNumber: string;
  description: string;
  quantity: number;
  unitOfMeasure: string;
  estimatedCost: number;
  stockLocation?: string;
  leadTime: number; // days
  isCritical: boolean;
}

export interface MaintenanceTask {
  taskId: string;
  name: string;
  description: string;
  sequenceOrder: number;
  type:
    | 'INSPECTION'
    | 'CLEANING'
    | 'LUBRICATION'
    | 'CALIBRATION'
    | 'REPLACEMENT'
    | 'TEST'
    | 'ADJUSTMENT';
  estimatedTime: number; // minutes
  requiredSkills: string[];
  safetyRequirements: string[];
  tools: string[];
  parts: TaskPart[];
  instructions: string;
  acceptanceCriteria: string;
  isCritical: boolean;
}

export interface TaskPart {
  partId: string;
  quantity: number;
  consumable: boolean;
  optional: boolean;
}

export interface MaintenanceChecklistItem {
  itemId: string;
  category: string;
  item: string;
  required: boolean;
  sequenceNumber: number;
  passFailCriteria?: string;
  measurementRequired: boolean;
  unit?: string;
  minValue?: number;
  maxValue?: number;
}

export interface ServiceRecord {
  recordId: string;
  assetId: string;
  serviceDate: Date;
  serviceType: 'MAINTENANCE' | 'REPAIR' | 'INSPECTION' | 'CALIBRATION' | 'INSTALLATION' | 'UPGRADE';

  // Service Details
  description: string;
  workOrderId?: string;
  technicianId?: string;
  technicianName?: string;
  serviceProvider?: string;

  // Work Performed
  workPerformed: string;
  partsReplaced: ServicePart[];
  laborHours: number;

  // Results
  issuesFound: string[];
  issuesResolved: string[];
  recommendations: string[];
  nextServiceDue?: Date;

  // Quality
  qualityScore?: number;
  customerSatisfaction?: number;
  completionStatus: 'COMPLETED' | 'INCOMPLETE' | 'DEFERRED';

  // Financial
  laborCost: number;
  partsCost: number;
  totalCost: number;

  // Documentation
  serviceReport?: string;
  photos: string[];
  attachments: string[];

  // Follow-up
  followUpRequired: boolean;
  followUpDate?: Date;
  followUpNotes?: string;

  createdDate: Date;
  lastUpdated: Date;
}

export interface ServicePart {
  partId: string;
  partNumber: string;
  description: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  serialNumber?: string;
  lotNumber?: string;

  // Action
  action: 'REPLACED' | 'REPAIRED' | 'CLEANED' | 'ADJUSTED' | 'INSPECTED';
  condition: 'GOOD' | 'FAIR' | 'POOR' | 'FAILED';

  // Warranty
  warrantyPeriod?: number; // months
  warrantyStartDate?: Date;

  // Disposal
  oldPartDisposition: 'RETURNED' | 'RECYCLED' | 'DISPOSED' | 'CREDIT' | 'CORE_EXCHANGE';
}

// ================================
// USAGE & PERFORMANCE MONITORING
// ================================

export interface UsageMetrics {
  assetId: string;
  period: DateRange;

  // Usage Statistics
  totalOperatingHours: number;
  averageDailyHours: number;
  peakUsagePeriod: string;
  utilizationRate: number; // percentage

  // Operational Metrics
  cycleCount?: number;
  throughput?: number;
  efficiency: number; // percentage

  // Condition Indicators
  vibrationLevel?: number;
  temperature?: number;
  pressure?: number;
  noiseLevel?: number;

  // Performance Trends
  performanceTrend: 'IMPROVING' | 'STABLE' | 'DECLINING' | 'UNKNOWN';
  reliabilityScore: number; // 1-100
  availabilityPercent: number;

  // Maintenance Impact
  downtimeHours: number;
  maintenanceInterruptions: number;
  meanTimeBetweenFailures: number; // hours
  meanTimeToRepair: number; // hours

  lastUpdated: Date;
}

export interface PerformanceMetrics {
  assetId: string;
  period: DateRange;

  // Key Performance Indicators
  availability: number; // percentage
  reliability: number; // percentage
  maintainability: number; // percentage
  overallEquipmentEffectiveness: number; // percentage

  // Failure Metrics
  meanTimeBetweenFailures: number; // hours
  meanTimeToRepair: number; // hours
  meanTimeToFailure: number; // hours
  failureRate: number; // failures per hour

  // Cost Metrics
  totalCostOfOwnership: number;
  maintenanceCostRatio: number; // percentage of asset value
  costPerOperatingHour: number;

  // Trend Analysis
  performanceTrends: PerformanceTrend[];
  benchmarkComparison: BenchmarkData;

  // Predictive Indicators
  healthScore: number; // 1-100
  riskScore: number; // 1-100
  predictedFailureDate?: Date;
  recommendedActions: string[];

  lastCalculated: Date;
}

export interface PerformanceTrend {
  metricName: string;
  values: TrendDataPoint[];
  trendDirection: 'IMPROVING' | 'STABLE' | 'DECLINING';
  changeRate: number; // percentage change per period
  seasonality?: SeasonalPattern;
}

export interface TrendDataPoint {
  date: Date;
  value: number;
  anomaly?: boolean;
  annotation?: string;
}

export interface SeasonalPattern {
  pattern: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  peakPeriods: string[];
  lowPeriods: string[];
  variation: number; // percentage
}

export interface BenchmarkData {
  industryAverage: number;
  peerAverage: number;
  bestInClass: number;
  percentile: number; // where this asset ranks (0-100)
  benchmarkDate: Date;
  source: string;
}

// ================================
// CUSTOMER HIERARCHY
// ================================

export interface CustomerHierarchy {
  customerId: string;
  customerName: string;
  hierarchyLevel: number;
  parentCustomerId?: string;
  childCustomers: string[];

  // Hierarchy Information
  hierarchyPath: string;
  rootCustomerId: string;
  isLeafNode: boolean;

  // Install Base Summary
  totalInstallBases: number;
  totalAssets: number;
  totalAssetValue: number;

  // Service Summary
  activeContracts: number;
  totalServiceRevenue: number;
  serviceLevel: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';

  // Relationship Information
  relationshipType: 'DIRECT' | 'SUBSIDIARY' | 'DIVISION' | 'DEPARTMENT' | 'LOCATION';
  effectiveDate: Date;
  expirationDate?: Date;

  lastUpdated: Date;
}

// ================================
// COMMON TYPES
// ================================

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface InstallAddress {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  accessibility?: string;
  specialInstructions?: string;
}

export interface ContactPerson {
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  preferredContactMethod: 'EMAIL' | 'PHONE' | 'MOBILE' | 'ANY';
  availableHours?: string;
  languagePreference?: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: Date;
}

export interface AssetDocument {
  documentId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  category: 'MANUAL' | 'DRAWING' | 'SPECIFICATION' | 'CERTIFICATE' | 'WARRANTY' | 'OTHER';
  description?: string;
  version?: string;
  language?: string;
  uploadedBy: string;
  uploadedDate: Date;
  isPublic: boolean;
}

export interface ComplianceRequirement {
  requirementId: string;
  name: string;
  description: string;
  regulatoryBody: string;
  standard: string;
  requiredDate: Date;
  complianceDate?: Date;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING' | 'EXEMPT';
  evidenceRequired: boolean;
  evidence: string[];
  renewalRequired: boolean;
  renewalPeriod?: number; // months
  nextRenewalDate?: Date;
}
