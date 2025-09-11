/**
 * Project Management Module Types
 * Core interfaces and types for project management system
 */

// Core Project Types
export interface Project {
  id: string;
  projectNumber: string;
  name: string;
  description: string;
  type: 'INTERNAL' | 'CUSTOMER' | 'PRODUCT_DEVELOPMENT' | 'MAINTENANCE';
  status: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  startDate: Date;
  plannedEndDate: Date;
  actualEndDate?: Date;
  budget: number;
  actualCost: number;
  projectManager: string;
  customerId?: string;
  sponsor: string;
  team: ProjectTeamMember[];
  phases: ProjectPhase[];
}

export interface ProjectTeamMember {
  employeeId: string;
  employeeName: string;
  role: string;
  allocationPercentage: number;
  startDate: Date;
  endDate?: Date;
  hourlyRate: number;
}

export interface ProjectPhase {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
  budget: number;
  actualCost: number;
  dependencies: string[];
  tasks: Task[];
}

export interface Task {
  id: string;
  name: string;
  description: string;
  assignedTo: string;
  startDate: Date;
  dueDate: Date;
  completedDate?: Date;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  estimatedHours: number;
  actualHours: number;
  percentComplete: number;
  dependencies: string[];
  parentTaskId?: string;
  subtasks: Task[];
}

export interface TimeSheet {
  id: string;
  employeeId: string;
  projectId: string;
  taskId?: string;
  date: Date;
  hoursWorked: number;
  description: string;
  billable: boolean;
  approved: boolean;
  approvedBy?: string;
  approvedDate?: Date;
}

export interface ProjectBudget {
  projectId: string;
  category: 'LABOR' | 'MATERIALS' | 'EQUIPMENT' | 'TRAVEL' | 'OTHER';
  budgetedAmount: number;
  actualAmount: number;
  remainingBudget: number;
  variance: number;
  variancePercentage: number;
}

export interface Resource {
  id: string;
  name: string;
  type: 'EMPLOYEE' | 'CONTRACTOR' | 'EQUIPMENT' | 'FACILITY';
  skillSet: string[];
  hourlyRate: number;
  availability: number; // percentage
  location: string;
  isActive: boolean;
}

export interface ResourceAllocation {
  resourceId: string;
  projectId: string;
  taskId?: string;
  startDate: Date;
  endDate: Date;
  allocationPercentage: number;
  role: string;
}

// Project Billing Types
export interface ProjectInvoice {
  id: string;
  invoiceNumber: string;
  projectId: string;
  customerId: string;
  billingType: 'TIME_AND_MATERIALS' | 'FIXED_PRICE' | 'MILESTONE' | 'RECURRING';
  invoiceDate: Date;
  dueDate: Date;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  lineItems: ProjectInvoiceItem[];
  paymentTerms: string;
}

export interface ProjectInvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  billableHours?: number;
  resourceId?: string;
  taskId?: string;
}

export interface ProjectContract {
  id: string;
  projectId: string;
  contractNumber: string;
  customerId: string;
  contractType: 'FIXED_PRICE' | 'TIME_AND_MATERIALS' | 'COST_PLUS';
  totalValue: number;
  startDate: Date;
  endDate: Date;
  billingSchedule: 'MONTHLY' | 'MILESTONE' | 'WEEKLY' | 'UPON_COMPLETION';
  paymentTerms: string;
  retentionPercentage: number;
  milestones: ProjectMilestone[];
}

export interface ProjectMilestone {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  billingAmount: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
  deliverables: string[];
}

// Project Collaboration Types
export interface ProjectDocument {
  id: string;
  projectId: string;
  name: string;
  description: string;
  type: 'SPECIFICATION' | 'DESIGN' | 'CONTRACT' | 'REPORT' | 'DRAWING' | 'OTHER';
  version: string;
  createdBy: string;
  createdDate: Date;
  modifiedBy: string;
  modifiedDate: Date;
  filePath: string;
  fileSize: number;
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'ARCHIVED';
  tags: string[];
}

export interface ProjectDeliverable {
  id: string;
  projectId: string;
  name: string;
  description: string;
  type: 'DOCUMENT' | 'SOFTWARE' | 'HARDWARE' | 'SERVICE';
  dueDate: Date;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
  assignedTo: string;
  approvedBy?: string;
  deliveredDate?: Date;
  documents: string[]; // Document IDs
}

// Project Portfolio Analysis Types
export interface ProjectPortfolioScore {
  projectId: string;
  strategicAlignment: number; // 0-100
  financialViability: number; // 0-100
  riskAssessment: number; // 0-100
  resourceAvailability: number; // 0-100
  overallScore: number; // 0-100
  ranking: number;
}

export interface ProjectFinancialAnalysis {
  projectId: string;
  initialInvestment: number;
  estimatedRevenue: number;
  estimatedCosts: number;
  npv: number; // Net Present Value
  irr: number; // Internal Rate of Return
  roi: number; // Return on Investment
  paybackPeriod: number; // months
  riskAdjustedReturn: number;
}

// Project Resource Management Types
export interface ResourceCapacity {
  resourceId: string;
  totalCapacity: number; // hours per period
  allocatedCapacity: number;
  availableCapacity: number;
  utilizationPercentage: number;
  period: string; // e.g., '2024-01', 'Q1-2024'
}

export interface ResourceSkill {
  resourceId: string;
  skill: string;
  proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  yearsOfExperience: number;
  certified: boolean;
}
