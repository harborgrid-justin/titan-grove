/**
 * Work Order Management Types
 * Comprehensive Oracle EBS competitive work order types and interfaces
 */

// ================================
// CORE ENUMS
// ================================

export enum WorkOrderType {
  CORRECTIVE = 'CORRECTIVE',
  PREVENTIVE = 'PREVENTIVE', 
  INSTALLATION = 'INSTALLATION',
  INSPECTION = 'INSPECTION',
  CALIBRATION = 'CALIBRATION',
  MODIFICATION = 'MODIFICATION',
  EMERGENCY = 'EMERGENCY',
  WARRANTY = 'WARRANTY',
  PROJECT = 'PROJECT'
}

export enum WorkOrderStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  DISPATCHED = 'DISPATCHED',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  CLOSED = 'CLOSED',
  REQUIRES_APPROVAL = 'REQUIRES_APPROVAL'
}

export enum WorkOrderPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  CRITICAL = 'CRITICAL',
  EMERGENCY = 'EMERGENCY'
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export enum MaterialStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  ISSUED = 'ISSUED',
  BACKORDERED = 'BACKORDERED',
  RETURNED = 'RETURNED'
}

// ================================
// WORK ORDER MANAGEMENT
// ================================

export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  title: string;
  description: string;
  type: WorkOrderType;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  
  // Customer & Asset Information
  customerId: string;
  customerName: string;
  assetId?: string;
  installBaseId?: string;
  serialNumber?: string;
  
  // Service Information
  serviceType: string;
  problemCode?: string;
  symptomCode?: string;
  causeCode?: string;
  resolutionCode?: string;
  
  // Scheduling Information
  requestedDate: Date;
  scheduledStartDate?: Date;
  scheduledEndDate?: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  estimatedDuration: number; // minutes
  actualDuration?: number; // minutes
  
  // Location & Contact
  serviceAddress: ServiceAddress;
  siteContactName?: string;
  siteContactPhone?: string;
  siteContactEmail?: string;
  accessInstructions?: string;
  specialInstructions?: string;
  
  // Resource Assignment
  assignedTechnicianId?: string;
  assignedTeamId?: string;
  backupTechnicianId?: string;
  assignedDate?: Date;
  assignedBy?: string;
  
  // Tasks & Procedures
  tasks: WorkOrderTask[];
  procedures: ServiceProcedure[];
  checklist: ChecklistItem[];
  
  // Materials & Parts
  materials: WorkOrderMaterial[];
  laborCharges: LaborCharge[];
  
  // SLA & Contract Information
  contractId?: string;
  slaDeadline?: Date;
  responseTimeTarget?: number; // minutes
  resolutionTimeTarget?: number; // minutes
  
  // Financial Information
  estimatedCost: number;
  actualCost: number;
  laborCost: number;
  materialCost: number;
  travelCost: number;
  billable: boolean;
  billingStatus?: 'PENDING' | 'INVOICED' | 'PAID' | 'DISPUTED';
  
  // Quality & Completion
  completionNotes?: string;
  customerSignature?: string;
  customerSatisfactionRating?: number;
  followUpRequired: boolean;
  followUpDate?: Date;
  
  // Tracking & Audit
  createdBy: string;
  createdDate: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
  version: number;
  
  // Related Records
  parentWorkOrderId?: string;
  childWorkOrderIds: string[];
  relatedWorkOrderIds: string[];
  serviceRequestId?: string;
  
  // Attachments & Documentation
  attachments: WorkOrderAttachment[];
  photos: string[];
  documents: string[];
  
  // Workflow & Approvals
  workflowStatus?: string;
  approvals: WorkOrderApproval[];
  
  // Analytics
  tags: string[];
  customFields: Record<string, any>;
}

export interface WorkOrderTask {
  id: string;
  workOrderId: string;
  sequenceNumber: number;
  name: string;
  description: string;
  status: TaskStatus;
  type: 'STANDARD' | 'SAFETY' | 'DIAGNOSTIC' | 'REPAIR' | 'TESTING' | 'DOCUMENTATION';
  
  // Timing
  estimatedDuration: number; // minutes
  actualDuration?: number; // minutes
  startTime?: Date;
  endTime?: Date;
  
  // Assignment
  assignedTo?: string;
  completedBy?: string;
  verifiedBy?: string;
  
  // Requirements
  skillsRequired: string[];
  toolsRequired: string[];
  materialsRequired: TaskMaterial[];
  safetyRequirements: string[];
  
  // Results
  result?: string;
  notes?: string;
  qualityScore?: number;
  
  // Dependencies
  dependsOnTasks: string[];
  blocksTasks: string[];
  
  // Documentation
  attachments: string[];
  photos: string[];
  
  createdDate: Date;
  lastUpdated: Date;
}

export interface TaskMaterial {
  materialId: string;
  quantity: number;
  unitOfMeasure: string;
  consumed: boolean;
  actualQuantityUsed?: number;
}

export interface ServiceProcedure {
  id: string;
  name: string;
  version: string;
  description: string;
  steps: ProcedureStep[];
  estimatedDuration: number; // minutes
  requiredSkills: string[];
  requiredTools: string[];
  safetyNotes: string[];
  lastUpdated: Date;
}

export interface ProcedureStep {
  stepNumber: number;
  title: string;
  description: string;
  type: 'ACTION' | 'VERIFICATION' | 'DECISION' | 'DOCUMENTATION';
  estimatedTime: number; // minutes
  criticalStep: boolean;
  safetyNote?: string;
  expectedResult?: string;
  troubleshooting?: TroubleshootingInfo[];
}

export interface TroubleshootingInfo {
  issue: string;
  possibleCauses: string[];
  recommendations: string[];
}

export interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  required: boolean;
  completed: boolean;
  completedBy?: string;
  completedDate?: Date;
  notes?: string;
  photosRequired: boolean;
  photos: string[];
}

export interface WorkOrderMaterial {
  id: string;
  workOrderId: string;
  materialId: string;
  partNumber: string;
  description: string;
  quantityRequired: number;
  quantityIssued: number;
  quantityUsed: number;
  quantityReturned: number;
  unitOfMeasure: string;
  unitCost: number;
  totalCost: number;
  status: MaterialStatus;
  
  // Inventory Information
  warehouseId?: string;
  locationId?: string;
  lotNumber?: string;
  serialNumbers: string[];
  
  // Procurement
  supplierId?: string;
  purchaseOrderId?: string;
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  
  // Tracking
  issuedBy?: string;
  issuedDate?: Date;
  returnedBy?: string;
  returnedDate?: Date;
  
  // Warranty
  warrantyPeriod?: number; // months
  warrantyStartDate?: Date;
  warrantyEndDate?: Date;
}

export interface LaborCharge {
  id: string;
  workOrderId: string;
  technicianId: string;
  technicianName: string;
  
  // Time Tracking
  startTime: Date;
  endTime: Date;
  duration: number; // minutes
  breakTime: number; // minutes
  billableTime: number; // minutes
  
  // Rates
  regularRate: number;
  overtimeRate: number;
  premiumRate: number;
  
  // Costs
  regularHours: number;
  overtimeHours: number;
  premiumHours: number;
  totalLaborCost: number;
  
  // Classification
  laborType: 'TRAVEL' | 'SERVICE' | 'DIAGNOSTIC' | 'REPAIR' | 'TESTING' | 'DOCUMENTATION';
  billable: boolean;
  
  // Approval
  approved: boolean;
  approvedBy?: string;
  approvedDate?: Date;
  
  notes?: string;
  createdDate: Date;
}

export interface ServiceAddress {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  formattedAddress?: string;
  accessInstructions?: string;
  parkingInstructions?: string;
}

export interface WorkOrderAttachment {
  id: string;
  workOrderId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  description?: string;
  category: 'PHOTO' | 'DOCUMENT' | 'SIGNATURE' | 'DIAGRAM' | 'VIDEO' | 'AUDIO' | 'OTHER';
  uploadedBy: string;
  uploadedDate: Date;
  isPublic: boolean;
}

export interface WorkOrderApproval {
  id: string;
  workOrderId: string;
  approvalType: 'COST' | 'SCHEDULE' | 'SCOPE' | 'COMPLETION' | 'MANAGER';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  requestedBy: string;
  requestedDate: Date;
  approverId?: string;
  approvalDate?: Date;
  reason?: string;
  comments?: string;
  threshold?: number;
}

// ================================
// DISPATCH & SCHEDULING
// ================================

export interface DispatchBoard {
  id: string;
  name: string;
  description: string;
  dateRange: DateRange;
  filters: DispatchFilter[];
  technicians: TechnicianSchedule[];
  workOrders: DispatchWorkOrder[];
  metrics: DispatchMetrics;
  lastRefreshed: Date;
}

export interface DispatchFilter {
  field: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'CONTAINS' | 'GREATER_THAN' | 'LESS_THAN' | 'IN' | 'NOT_IN';
  value: any;
  isActive: boolean;
}

export interface TechnicianSchedule {
  technicianId: string;
  technicianName: string;
  status: 'AVAILABLE' | 'BUSY' | 'OFFLINE' | 'ON_BREAK';
  currentLocation?: GeoLocation;
  schedule: ScheduleSlot[];
  capacity: CapacityInfo;
  metrics: TechnicianMetrics;
}

export interface ScheduleSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  type: 'WORK_ORDER' | 'TRAVEL' | 'BREAK' | 'LUNCH' | 'TRAINING' | 'ADMINISTRATIVE' | 'AVAILABLE';
  workOrderId?: string;
  description?: string;
  location?: GeoLocation;
  travelTime?: number; // minutes
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface CapacityInfo {
  dailyHours: number;
  utilization: number; // percentage
  availableSlots: number;
  overtimeHours: number;
  efficiency: number; // percentage
}

export interface TechnicianMetrics {
  completedToday: number;
  scheduledToday: number;
  overdueCount: number;
  avgResponseTime: number; // minutes
  customerRating: number; // 1-5 scale
}

export interface DispatchWorkOrder {
  workOrderId: string;
  workOrderNumber: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  assignedTechnicianId?: string;
  scheduledDate?: Date;
  estimatedDuration: number;
  customerName: string;
  address: string;
  urgencyScore: number;
  slaRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  requiredSkills: string[];
  distance?: number; // from current technician location
  travelTime?: number; // minutes
}

export interface DispatchMetrics {
  totalWorkOrders: number;
  scheduledWorkOrders: number;
  unassignedWorkOrders: number;
  overdueWorkOrders: number;
  avgUtilization: number; // percentage
  slaCompliance: number; // percentage
  customerSatisfaction: number; // 1-5 scale
}

// ================================
// COST TRACKING & BILLING
// ================================

export interface CostBreakdown {
  workOrderId: string;
  
  // Labor Costs
  totalLaborHours: number;
  regularLaborCost: number;
  overtimeLaborCost: number;
  premiumLaborCost: number;
  totalLaborCost: number;
  
  // Material Costs
  partsCount: number;
  totalPartsCost: number;
  shippingCost: number;
  totalMaterialCost: number;
  
  // Travel Costs
  travelDistance: number;
  travelTime: number; // minutes
  mileageRate: number;
  totalTravelCost: number;
  
  // Other Costs
  equipmentRentalCost: number;
  subcontractorCost: number;
  miscellaneousCost: number;
  
  // Totals
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalCost: number;
  
  // Billing Information
  billable: boolean;
  invoiceId?: string;
  billingDate?: Date;
  paymentDate?: Date;
  
  costCenter?: string;
  projectCode?: string;
  budgetCategory?: string;
}

export interface TimeEntry {
  id: string;
  workOrderId: string;
  technicianId: string;
  entryDate: Date;
  startTime: Date;
  endTime: Date;
  duration: number; // minutes
  description: string;
  activityType: 'TRAVEL' | 'SERVICE' | 'WAIT' | 'ADMINISTRATIVE';
  billable: boolean;
  approved: boolean;
  approvedBy?: string;
  approvedDate?: Date;
  notes?: string;
}

// ================================
// ANALYTICS & REPORTING
// ================================

export interface WorkOrderMetrics {
  period: DateRange;
  totalWorkOrders: number;
  completedWorkOrders: number;
  cancelledWorkOrders: number;
  avgCompletionTime: number; // hours
  avgResponseTime: number; // minutes
  firstCallResolution: number; // percentage
  slaCompliance: number; // percentage
  customerSatisfaction: number; // 1-5 scale
  totalCost: number;
  totalRevenue: number;
  profitMargin: number; // percentage
  utilization: number; // percentage
  productivity: number; // work orders per technician
}

export interface WorkOrderAnalytics {
  id: string;
  reportType: 'SUMMARY' | 'DETAILED' | 'TREND' | 'COMPARISON';
  dateRange: DateRange;
  filters: AnalyticsFilter[];
  metrics: WorkOrderMetrics;
  trends: TrendData[];
  breakdowns: BreakdownData[];
  insights: string[];
  recommendations: string[];
  generatedDate: Date;
  generatedBy: string;
}

export interface AnalyticsFilter {
  dimension: string;
  values: any[];
  exclude: boolean;
}

export interface TrendData {
  metric: string;
  dataPoints: DataPoint[];
  trendDirection: 'UP' | 'DOWN' | 'STABLE';
  changePercent: number;
}

export interface DataPoint {
  date: Date;
  value: number;
  label?: string;
}

export interface BreakdownData {
  category: string;
  values: CategoryValue[];
}

export interface CategoryValue {
  name: string;
  value: number;
  percentage: number;
  trend?: 'UP' | 'DOWN' | 'STABLE';
}

// ================================
// COMMON TYPES
// ================================

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: Date;
}

export interface NotificationRule {
  id: string;
  name: string;
  description: string;
  trigger: 'STATUS_CHANGE' | 'SLA_BREACH' | 'ASSIGNMENT' | 'COMPLETION' | 'COST_THRESHOLD';
  conditions: NotificationCondition[];
  recipients: NotificationRecipient[];
  messageTemplate: string;
  isActive: boolean;
  createdDate: Date;
}

export interface NotificationCondition {
  field: string;
  operator: string;
  value: any;
}

export interface NotificationRecipient {
  type: 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP';
  address: string;
  name?: string;
}

export interface QualityControl {
  id: string;
  workOrderId: string;
  inspectorId: string;
  inspectorName: string;
  inspectionDate: Date;
  overallScore: number; // 1-100
  criteria: QualityCriterion[];
  passed: boolean;
  defects: QualityDefect[];
  correctiveActions: CorrectiveAction[];
  reinspectionRequired: boolean;
  notes?: string;
  photos: string[];
}

export interface QualityCriterion {
  criterionId: string;
  name: string;
  description: string;
  weight: number; // importance
  score: number; // 1-10
  passed: boolean;
  notes?: string;
}

export interface QualityDefect {
  defectId: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  location?: string;
  causeCode?: string;
  correctiveAction?: string;
  photos: string[];
}

export interface CorrectiveAction {
  actionId: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  completedBy?: string;
  completedDate?: Date;
  verifiedBy?: string;
  verificationDate?: Date;
}

export interface WorkOrderTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  serviceType: string;
  estimatedDuration: number;
  tasks: WorkOrderTaskTemplate[];
  materials: MaterialTemplate[];
  procedures: string[]; // procedure IDs
  checklist: ChecklistTemplate[];
  requiredSkills: string[];
  isActive: boolean;
  version: number;
  createdBy: string;
  createdDate: Date;
  lastUpdated: Date;
}

export interface WorkOrderTaskTemplate {
  name: string;
  description: string;
  sequenceNumber: number;
  type: string;
  estimatedDuration: number;
  requiredSkills: string[];
  requiredTools: string[];
  safetyRequirements: string[];
  isOptional: boolean;
}

export interface MaterialTemplate {
  materialId: string;
  partNumber: string;
  description: string;
  quantity: number;
  unitOfMeasure: string;
  estimatedCost: number;
  isOptional: boolean;
}

export interface ChecklistTemplate {
  category: string;
  item: string;
  required: boolean;
  photosRequired: boolean;
  sequenceNumber: number;
}