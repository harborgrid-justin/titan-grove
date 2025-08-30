/**
 * Project Management Module
 * Comprehensive project portfolio management, resource planning, and project costing
 */

import { Priority } from '../../types/common';
import { ProjectRecommendationGenerator } from './utils/project-recommendation-generator';

export interface Project {
  id: string;
  projectNumber: string;
  name: string;
  description: string;
  type: 'INTERNAL' | 'CUSTOMER' | 'PRODUCT_DEVELOPMENT' | 'MAINTENANCE';
  status: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  priority: Priority;
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
  priority: Exclude<Priority, 'CRITICAL'>;
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

// Project Billing Interfaces
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

// Project Collaboration Interfaces
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

// Project Portfolio Analysis Interfaces
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

// Project Resource Management Interfaces
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

export class ProjectManager {
  private recommendationGenerator = new ProjectRecommendationGenerator();
  /**
   * Project Billing Business Logic
   */
  async createProjectContract(contract: Omit<ProjectContract, 'id' | 'contractNumber'>): Promise<ProjectContract> {
    const id = `contract_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const contractNumber = `CON${Date.now().toString().slice(-6)}`;
    
    return {
      ...contract,
      id,
      contractNumber
    };
  }

  async generateProjectInvoice(
    projectId: string, 
    billingType: ProjectInvoice['billingType'],
    billingPeriod?: { startDate: Date; endDate: Date }
  ): Promise<ProjectInvoice> {
    const id = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const invoiceNumber = `INV${Date.now().toString().slice(-6)}`;
    const invoiceDate = new Date();
    const dueDate = new Date(invoiceDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
    
    let lineItems: ProjectInvoiceItem[] = [];
    let subtotal = 0;
    
    // Generate line items based on billing type
    switch (billingType) {
      case 'TIME_AND_MATERIALS':
        lineItems = await this.generateTimeAndMaterialsLineItems(projectId, billingPeriod);
        break;
      case 'MILESTONE':
        lineItems = await this.generateMilestoneLineItems(projectId);
        break;
      case 'FIXED_PRICE':
        lineItems = await this.generateFixedPriceLineItems(projectId);
        break;
      case 'RECURRING':
        lineItems = await this.generateRecurringLineItems(projectId);
        break;
    }
    
    subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = subtotal * 0.08; // 8% tax rate
    const totalAmount = subtotal + taxAmount;
    
    return {
      id,
      invoiceNumber,
      projectId,
      customerId: 'cust_001', // Would fetch from project
      billingType,
      invoiceDate,
      dueDate,
      subtotal,
      taxAmount,
      totalAmount,
      status: 'DRAFT',
      lineItems,
      paymentTerms: 'Net 30'
    };
  }

  private async generateTimeAndMaterialsLineItems(
    projectId: string, 
    period?: { startDate: Date; endDate: Date }
  ): Promise<ProjectInvoiceItem[]> {
    // In real implementation, would query timesheet data
    const laborHours = 120;
    const hourlyRate = 150;
    const materialCosts = 5000;
    
    return [
      {
        id: `li_${Date.now()}_1`,
        description: `Professional Services - ${period ? 'Period' : 'To Date'}`,
        quantity: laborHours,
        unitPrice: hourlyRate,
        amount: laborHours * hourlyRate,
        billableHours: laborHours
      },
      {
        id: `li_${Date.now()}_2`,
        description: 'Materials and Equipment',
        quantity: 1,
        unitPrice: materialCosts,
        amount: materialCosts
      }
    ];
  }

  private async generateMilestoneLineItems(projectId: string): Promise<ProjectInvoiceItem[]> {
    // Would fetch completed milestones
    return [
      {
        id: `li_${Date.now()}_1`,
        description: 'Milestone 1: Requirements Analysis Complete',
        quantity: 1,
        unitPrice: 25000,
        amount: 25000
      }
    ];
  }

  private async generateFixedPriceLineItems(projectId: string): Promise<ProjectInvoiceItem[]> {
    // Would calculate percentage complete and bill accordingly
    const totalProjectValue = 100000;
    const percentComplete = 0.3; // 30% complete
    const billingAmount = totalProjectValue * percentComplete;
    
    return [
      {
        id: `li_${Date.now()}_1`,
        description: 'Project Development - Progress Billing (30%)',
        quantity: 1,
        unitPrice: billingAmount,
        amount: billingAmount
      }
    ];
  }

  private async generateRecurringLineItems(projectId: string): Promise<ProjectInvoiceItem[]> {
    return [
      {
        id: `li_${Date.now()}_1`,
        description: 'Monthly Support and Maintenance',
        quantity: 1,
        unitPrice: 5000,
        amount: 5000
      }
    ];
  }

  async calculateProjectCashFlow(projectId: string): Promise<any> {
    // Calculate cash flow projection based on invoicing schedule and payments
    const cashFlowProjection = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const month = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const inflow = this.calculateMonthlyInflow(projectId, month);
      const outflow = this.calculateMonthlyOutflow(projectId, month);
      
      cashFlowProjection.push({
        month: month.toISOString().substring(0, 7),
        inflow: await inflow,
        outflow: await outflow,
        netFlow: (await inflow) - (await outflow)
      });
    }
    
    return {
      projectId,
      projectionPeriod: '12 months',
      totalInflow: cashFlowProjection.reduce((sum, item) => sum + item.inflow, 0),
      totalOutflow: cashFlowProjection.reduce((sum, item) => sum + item.outflow, 0),
      netCashFlow: cashFlowProjection.reduce((sum, item) => sum + item.netFlow, 0),
      monthlyProjection: cashFlowProjection
    };
  }

  private async calculateMonthlyInflow(projectId: string, month: Date): Promise<number> {
    // Would calculate expected payments for the month based on invoicing schedule
    return 15000; // Example amount
  }

  private async calculateMonthlyOutflow(projectId: string, month: Date): Promise<number> {
    // Would calculate expected costs for the month
    return 12000; // Example amount
  }

  async measureProjectProfitability(projectId: string): Promise<any> {
    const revenue = 120000;
    const laborCosts = await this.calculateProjectLaborCost(projectId);
    const materialCosts = 15000;
    const overheadCosts = 8000;
    const totalCosts = laborCosts + materialCosts + overheadCosts;
    
    const grossProfit = revenue - totalCosts;
    const grossMargin = grossProfit / revenue;
    const profitMargin = grossProfit / totalCosts;
    
    return {
      projectId,
      revenue,
      costs: {
        labor: laborCosts,
        materials: materialCosts,
        overhead: overheadCosts,
        total: totalCosts
      },
      grossProfit,
      grossMargin,
      profitMargin,
      profitabilityIndex: revenue / totalCosts,
      earningsBeforeInterest: grossProfit,
      returnOnInvestment: grossProfit / totalCosts
    };
  }

  /**
   * Project Collaboration Business Logic
   */
  async createProjectDocument(document: Omit<ProjectDocument, 'id' | 'version' | 'createdDate' | 'modifiedDate'>): Promise<ProjectDocument> {
    const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const currentDate = new Date();
    
    return {
      ...document,
      id,
      version: '1.0',
      createdDate: currentDate,
      modifiedDate: currentDate
    };
  }

  async updateDocumentVersion(documentId: string, updatedBy: string, changes: string): Promise<ProjectDocument> {
    // Would fetch existing document, increment version, and create new version
    const currentDate = new Date();
    
    return {
      id: documentId,
      projectId: 'proj_123',
      name: 'Updated Document',
      description: `Updated: ${changes}`,
      type: 'SPECIFICATION',
      version: '1.1', // Incremented version
      createdBy: 'original_user',
      createdDate: new Date(Date.now() - 86400000), // Yesterday
      modifiedBy: updatedBy,
      modifiedDate: currentDate,
      filePath: '/projects/docs/updated_doc.pdf',
      fileSize: 2048576,
      status: 'DRAFT',
      tags: ['updated', 'specification']
    };
  }

  async manageProjectDeliverables(projectId: string): Promise<ProjectDeliverable[]> {
    // Would fetch all deliverables for the project
    const deliverables: ProjectDeliverable[] = [
      {
        id: `del_${Date.now()}_1`,
        projectId,
        name: 'System Design Document',
        description: 'Comprehensive system architecture and design',
        type: 'DOCUMENT',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'IN_PROGRESS',
        assignedTo: 'emp_001',
        documents: ['doc_001', 'doc_002']
      },
      {
        id: `del_${Date.now()}_2`,
        projectId,
        name: 'Beta Version Release',
        description: 'First beta version of the software',
        type: 'SOFTWARE',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'PLANNED',
        assignedTo: 'emp_002',
        documents: ['doc_003']
      }
    ];
    
    return deliverables;
  }

  async trackDeliverableProgress(deliverableId: string): Promise<any> {
    return {
      deliverableId,
      progressPercentage: 65,
      milestonesCompleted: 3,
      totalMilestones: 5,
      lastUpdated: new Date(),
      remainingTasks: [
        'Final review',
        'Client approval',
        'Documentation'
      ],
      blockers: [],
      estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
  }

  async createCentralizedRepository(projectId: string): Promise<any> {
    return {
      projectId,
      repositoryStructure: {
        documents: {
          specifications: [],
          designs: [],
          contracts: [],
          reports: []
        },
        deliverables: {
          planned: [],
          inProgress: [],
          completed: []
        },
        communications: {
          meetings: [],
          emails: [],
          decisions: []
        }
      },
      accessControl: {
        readAccess: ['all_team_members'],
        writeAccess: ['project_manager', 'tech_lead'],
        adminAccess: ['project_manager']
      },
      versionControl: {
        enabled: true,
        maxVersions: 10,
        autoBackup: true
      }
    };
  }

  /**
   * Project Costing Business Logic
   */
  async implementActivityBasedCosting(projectId: string): Promise<any> {
    // Activity-based costing allocates costs based on activities and their cost drivers
    const activities = [
      {
        activityId: 'act_001',
        name: 'Requirements Analysis',
        costDriver: 'analysis_hours',
        costDriverQuantity: 40,
        costPerUnit: 120,
        totalCost: 4800,
        resources: ['business_analyst', 'senior_developer']
      },
      {
        activityId: 'act_002',
        name: 'System Design',
        costDriver: 'design_hours',
        costDriverQuantity: 60,
        costPerUnit: 150,
        totalCost: 9000,
        resources: ['architect', 'senior_developer']
      },
      {
        activityId: 'act_003',
        name: 'Development',
        costDriver: 'development_hours',
        costDriverQuantity: 200,
        costPerUnit: 100,
        totalCost: 20000,
        resources: ['developer', 'junior_developer']
      },
      {
        activityId: 'act_004',
        name: 'Testing',
        costDriver: 'testing_hours',
        costDriverQuantity: 80,
        costPerUnit: 90,
        totalCost: 7200,
        resources: ['qa_engineer', 'test_automation']
      }
    ];
    
    const totalProjectCost = activities.reduce((sum, activity) => sum + activity.totalCost, 0);
    
    return {
      projectId,
      costingMethod: 'Activity-Based Costing',
      activities,
      totalCost: totalProjectCost,
      costBreakdown: {
        directLabor: totalProjectCost * 0.75,
        overhead: totalProjectCost * 0.15,
        materials: totalProjectCost * 0.10
      },
      costPerformanceMetrics: {
        costPerHour: totalProjectCost / activities.reduce((sum, act) => sum + act.costDriverQuantity, 0),
        efficiencyRatio: 0.92 // Actual vs planned efficiency
      }
    };
  }

  async trackProjectBasedCosts(projectId: string): Promise<any> {
    const costCategories = [
      {
        category: 'LABOR',
        budgeted: 50000,
        actual: 47500,
        committed: 52000,
        variance: -2500,
        variancePercentage: -5.0
      },
      {
        category: 'MATERIALS',
        budgeted: 15000,
        actual: 16200,
        committed: 15800,
        variance: 1200,
        variancePercentage: 8.0
      },
      {
        category: 'EQUIPMENT',
        budgeted: 8000,
        actual: 7800,
        committed: 8000,
        variance: -200,
        variancePercentage: -2.5
      },
      {
        category: 'TRAVEL',
        budgeted: 5000,
        actual: 4200,
        committed: 4500,
        variance: -800,
        variancePercentage: -16.0
      }
    ];
    
    const totalBudgeted = costCategories.reduce((sum, cat) => sum + cat.budgeted, 0);
    const totalActual = costCategories.reduce((sum, cat) => sum + cat.actual, 0);
    const totalVariance = totalActual - totalBudgeted;
    
    return {
      projectId,
      costTrackingDate: new Date(),
      costCategories,
      summary: {
        totalBudgeted,
        totalActual,
        totalCommitted: costCategories.reduce((sum, cat) => sum + cat.committed, 0),
        totalVariance,
        variancePercentage: (totalVariance / totalBudgeted) * 100,
        costPerformanceIndex: totalBudgeted / totalActual
      },
      alerts: this.generateCostAlerts(costCategories)
    };
  }

  private generateCostAlerts(costCategories: any[]): any[] {
    const alerts = [];
    
    for (const category of costCategories) {
      if (Math.abs(category.variancePercentage) > 10) {
        alerts.push({
          type: category.variancePercentage > 0 ? 'OVER_BUDGET' : 'UNDER_BUDGET',
          category: category.category,
          variancePercentage: category.variancePercentage,
          message: `${category.category} is ${Math.abs(category.variancePercentage).toFixed(1)}% ${
            category.variancePercentage > 0 ? 'over' : 'under'
          } budget`
        });
      }
    }
    
    return alerts;
  }

  async analyzeExpenditureVsForecast(projectId: string): Promise<any> {
    const monthlyData = [];
    const startDate = new Date(2024, 0, 1); // January 2024
    
    for (let i = 0; i < 12; i++) {
      const month = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      const forecasted = 10000 + (Math.random() * 2000 - 1000); // Base forecast with variation
      const actual = forecasted + (Math.random() * 4000 - 2000); // Actual with variance
      
      monthlyData.push({
        month: month.toISOString().substring(0, 7),
        forecasted: Math.round(forecasted),
        actual: Math.round(actual),
        variance: Math.round(actual - forecasted),
        variancePercentage: ((actual - forecasted) / forecasted * 100).toFixed(1)
      });
    }
    
    const totalForecasted = monthlyData.reduce((sum, item) => sum + item.forecasted, 0);
    const totalActual = monthlyData.reduce((sum, item) => sum + item.actual, 0);
    
    return {
      projectId,
      analysisType: 'Expenditure vs Forecast Analysis',
      monthlyData,
      summary: {
        totalForecasted,
        totalActual,
        totalVariance: totalActual - totalForecasted,
        forecastAccuracy: (1 - Math.abs(totalActual - totalForecasted) / totalForecasted) * 100,
        trendAnalysis: this.analyzeCostTrend(monthlyData)
      }
    };
  }

  private analyzeCostTrend(monthlyData: any[]): string {
    const recentMonths = monthlyData.slice(-3);
    const averageVariance = recentMonths.reduce((sum, item) => sum + parseFloat(item.variancePercentage), 0) / 3;
    
    if (averageVariance > 5) return 'OVER_BUDGET_TREND';
    if (averageVariance < -5) return 'UNDER_BUDGET_TREND';
    return 'ON_TRACK';
  }

  async trackProgressAndProfitability(projectId: string): Promise<any> {
    const currentProgress = await this.calculateProjectProgress(projectId);
    const budgetUtilization = 0.68; // 68% of budget used
    const timeElapsed = 0.75; // 75% of project timeline elapsed
    
    const performanceIndicators = {
      schedulePerformanceIndex: currentProgress / (timeElapsed * 100), // SPI
      costPerformanceIndex: (currentProgress / 100) / budgetUtilization, // CPI
      estimateAtCompletion: 100000 / (currentProgress / 100), // EAC
      estimateToComplete: (100000 / (currentProgress / 100)) - (100000 * budgetUtilization) // ETC
    };
    
    const profitabilityMetrics = await this.measureProjectProfitability(projectId);
    
    return {
      projectId,
      progressTracking: {
        currentProgress,
        budgetUtilization,
        timeElapsed,
        performanceIndicators
      },
      profitabilityTracking: {
        currentProfitMargin: profitabilityMetrics.profitMargin,
        projectedFinalMargin: profitabilityMetrics.profitMargin * performanceIndicators.costPerformanceIndex,
        riskFactors: this.assessProfitabilityRisk(performanceIndicators)
      },
      recommendations: this.generateCostRecommendations(performanceIndicators)
    };
  }

  private assessProfitabilityRisk(indicators: any): string[] {
    const risks = [];
    
    if (indicators.costPerformanceIndex < 0.9) {
      risks.push('Cost overrun risk - CPI below 0.9');
    }
    
    if (indicators.schedulePerformanceIndex < 0.9) {
      risks.push('Schedule delay risk - SPI below 0.9');
    }
    
    if (indicators.estimateAtCompletion > 110000) {
      risks.push('Budget overrun risk - EAC exceeds approved budget');
    }
    
    return risks;
  }

  /**
   * Project Planning and Control Business Logic
   */
  async planProjectWork(projectId: string): Promise<any> {
    // Work Breakdown Structure (WBS) planning
    const workPackages = [
      {
        id: 'wp_001',
        name: 'Project Initiation',
        level: 1,
        parentId: null,
        estimatedHours: 40,
        dependencies: [],
        milestones: ['Project Charter Approved']
      },
      {
        id: 'wp_002',
        name: 'Requirements Analysis',
        level: 1,
        parentId: null,
        estimatedHours: 120,
        dependencies: ['wp_001'],
        milestones: ['Requirements Document Approved']
      },
      {
        id: 'wp_003',
        name: 'System Design',
        level: 1,
        parentId: null,
        estimatedHours: 160,
        dependencies: ['wp_002'],
        milestones: ['Design Review Complete']
      },
      {
        id: 'wp_004',
        name: 'Development',
        level: 1,
        parentId: null,
        estimatedHours: 400,
        dependencies: ['wp_003'],
        milestones: ['Code Complete', 'Unit Tests Pass']
      }
    ];
    
    const totalEstimatedHours = workPackages.reduce((sum, wp) => sum + wp.estimatedHours, 0);
    const criticalPath = await this.calculateCriticalPath(projectId);
    
    return {
      projectId,
      workBreakdownStructure: workPackages,
      totalEstimatedHours,
      criticalPath,
      plannedDuration: Math.ceil(totalEstimatedHours / 40), // weeks assuming 40 hours/week
      resourceRequirements: await this.calculateResourceRequirements(workPackages)
    };
  }

  private async calculateResourceRequirements(workPackages: any[]): Promise<any> {
    const skillRequirements = {
      'Business Analyst': 80,
      'Solution Architect': 100,
      'Senior Developer': 200,
      'Developer': 300,
      'QA Engineer': 120,
      'Project Manager': 40
    };
    
    return {
      skillRequirements,
      totalResourceHours: Object.values(skillRequirements).reduce((sum, hours) => sum + hours, 0),
      peakResourcePeriod: 'Month 3-4',
      resourceConstraints: ['Limited Senior Developer availability', 'QA Engineer needed part-time']
    };
  }

  async assignProjectResources(projectId: string, assignments: ResourceAllocation[]): Promise<any> {
    const resourceAssignments = [];
    const conflicts = [];
    
    for (const assignment of assignments) {
      const availability = await this.checkResourceAvailability(
        assignment.resourceId, 
        assignment.startDate, 
        assignment.endDate
      );
      
      if (availability >= assignment.allocationPercentage) {
        resourceAssignments.push({
          ...assignment,
          status: 'ASSIGNED',
          confirmedDate: new Date()
        });
      } else {
        conflicts.push({
          ...assignment,
          status: 'CONFLICT',
          availablePercentage: availability,
          requestedPercentage: assignment.allocationPercentage
        });
      }
    }
    
    return {
      projectId,
      successfulAssignments: resourceAssignments,
      conflicts,
      resourceUtilization: await this.calculateProjectResourceUtilization(projectId),
      recommendations: this.generateResourceRecommendations(conflicts)
    };
  }

  private async calculateProjectResourceUtilization(projectId: string): Promise<any> {
    return {
      averageUtilization: 82,
      byResource: [
        { resourceId: 'res_001', name: 'John Smith', utilization: 95, role: 'Senior Developer' },
        { resourceId: 'res_002', name: 'Jane Doe', utilization: 75, role: 'Business Analyst' }
      ],
      overallocated: ['res_001'],
      underutilized: ['res_002']
    };
  }

  private generateResourceRecommendations(conflicts: any[]): string[] {
    const recommendations = [];
    
    if (conflicts.length > 0) {
      recommendations.push('Consider adjusting project timeline to resolve resource conflicts');
      recommendations.push('Evaluate alternative resources with similar skill sets');
      recommendations.push('Implement resource leveling to smooth allocation peaks');
    }
    
    return recommendations;
  }

  async forecastToCompletion(projectId: string): Promise<any> {
    const currentProgress = await this.calculateProjectProgress(projectId);
    const currentDate = new Date();
    const projectStartDate = new Date(currentDate.getTime() - 60 * 24 * 60 * 60 * 1000); // 60 days ago
    const daysElapsed = Math.floor((currentDate.getTime() - projectStartDate.getTime()) / (24 * 60 * 60 * 1000));
    
    // Calculate forecasting metrics
    const schedulePerformanceIndex = currentProgress / (daysElapsed / 90 * 100); // Assuming 90-day project
    const forecastDuration = 90 / schedulePerformanceIndex;
    const remainingDays = forecastDuration - daysElapsed;
    
    const estimatedCompletionDate = new Date(currentDate.getTime() + remainingDays * 24 * 60 * 60 * 1000);
    
    // Cost forecasting
    const budgetSpent = 0.68; // 68% of budget spent
    const costPerformanceIndex = currentProgress / 100 / budgetSpent;
    const estimatedTotalCost = 100000 / costPerformanceIndex;
    
    return {
      projectId,
      forecastingDate: currentDate,
      currentProgress,
      scheduleForecasting: {
        schedulePerformanceIndex,
        estimatedCompletionDate,
        varianceInDays: remainingDays - (90 - daysElapsed),
        confidence: this.calculateForecastConfidence(schedulePerformanceIndex)
      },
      costForecasting: {
        costPerformanceIndex,
        estimatedTotalCost,
        budgetVariance: estimatedTotalCost - 100000,
        remainingBudget: estimatedTotalCost - (100000 * budgetSpent)
      },
      riskFactors: this.identifyForecastRisks(schedulePerformanceIndex, costPerformanceIndex),
      recommendations: this.generateForecastRecommendations(schedulePerformanceIndex, costPerformanceIndex)
    };
  }

  private calculateForecastConfidence(spi: number): number {
    // Higher confidence when SPI is close to 1.0
    const deviation = Math.abs(1.0 - spi);
    return Math.max(0.5, 1.0 - deviation * 2);
  }

  private identifyForecastRisks(spi: number, cpi: number): string[] {
    const risks = [];
    
    if (spi < 0.9) risks.push('Schedule delay risk - project may finish late');
    if (cpi < 0.9) risks.push('Budget overrun risk - project may exceed budget');
    if (spi < 0.8 || cpi < 0.8) risks.push('Project in critical condition - immediate action required');
    
    return risks;
  }

  private generateForecastRecommendations(spi: number, cpi: number): string[] {
    return this.recommendationGenerator.generateForecastRecommendations(spi, cpi);
  }

  async facilitateStakeholderCommunication(projectId: string): Promise<any> {
    const stakeholders = [
      {
        id: 'stakeholder_001',
        name: 'John Executive',
        role: 'Project Sponsor',
        communicationPreference: 'EXECUTIVE_SUMMARY',
        frequency: 'WEEKLY',
        interests: ['budget', 'timeline', 'risks']
      },
      {
        id: 'stakeholder_002',
        name: 'Jane Customer',
        role: 'Customer Representative',
        communicationPreference: 'DETAILED_PROGRESS',
        frequency: 'BI_WEEKLY',
        interests: ['deliverables', 'quality', 'timeline']
      },
      {
        id: 'stakeholder_003',
        name: 'Tech Team',
        role: 'Development Team',
        communicationPreference: 'TECHNICAL_DETAILS',
        frequency: 'DAILY',
        interests: ['tasks', 'blockers', 'technical_decisions']
      }
    ];
    
    const communicationPlan = stakeholders.map(stakeholder => ({
      stakeholderId: stakeholder.id,
      name: stakeholder.name,
      nextCommunication: this.calculateNextCommunicationDate(stakeholder.frequency),
      reportType: stakeholder.communicationPreference,
      customizedContent: this.generateStakeholderContent(projectId, stakeholder)
    }));
    
    return {
      projectId,
      stakeholders,
      communicationPlan,
      upcomingCommunications: communicationPlan.filter(plan => 
        plan.nextCommunication <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      )
    };
  }

  private calculateNextCommunicationDate(frequency: string): Date {
    const today = new Date();
    switch (frequency) {
      case 'DAILY': return new Date(today.getTime() + 24 * 60 * 60 * 1000);
      case 'WEEKLY': return new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'BI_WEEKLY': return new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
      default: return new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    }
  }

  /**
   * Project Portfolio Analysis Business Logic
   */
  async evaluateProjectPortfolio(projects: string[]): Promise<any> {
    const projectEvaluations = [];
    
    for (const projectId of projects) {
      const financialAnalysis = await this.analyzeProjectFinancials(projectId);
      const strategicScore = await this.assessStrategicAlignment(projectId);
      const riskAssessment = await this.evaluateProjectRisk(projectId);
      const resourceAssessment = await this.assessResourceAvailability(projectId);
      
      const overallScore = (
        financialAnalysis.score * 0.35 +
        strategicScore * 0.25 +
        (100 - riskAssessment.score) * 0.25 + // Lower risk = higher score
        resourceAssessment.score * 0.15
      );
      
      projectEvaluations.push({
        projectId,
        scores: {
          financial: financialAnalysis.score,
          strategic: strategicScore,
          risk: riskAssessment.score,
          resource: resourceAssessment.score,
          overall: Math.round(overallScore)
        },
        details: {
          financialAnalysis,
          riskAssessment,
          resourceAssessment
        }
      });
    }
    
    // Sort by overall score (highest first)
    projectEvaluations.sort((a, b) => b.scores.overall - a.scores.overall);
    
    return {
      portfolioEvaluation: projectEvaluations,
      recommendations: this.generatePortfolioRecommendations(projectEvaluations),
      portfolioMetrics: this.calculatePortfolioMetrics(projectEvaluations)
    };
  }

  private async analyzeProjectFinancials(projectId: string): Promise<any> {
    const initialInvestment = 100000;
    const projectedCashFlows = [15000, 25000, 35000, 40000, 30000]; // 5 years
    const discountRate = 0.10;
    
    // Calculate NPV
    let npv = -initialInvestment;
    projectedCashFlows.forEach((cashFlow, year) => {
      npv += cashFlow / Math.pow(1 + discountRate, year + 1);
    });
    
    // Calculate IRR (simplified approximation)
    const totalCashFlow = projectedCashFlows.reduce((sum, cf) => sum + cf, 0);
    const irr = (totalCashFlow - initialInvestment) / initialInvestment / projectedCashFlows.length;
    
    // Calculate ROI
    const roi = (totalCashFlow - initialInvestment) / initialInvestment;
    
    // Calculate payback period
    let cumulativeCashFlow = 0;
    let paybackPeriod = 0;
    for (let i = 0; i < projectedCashFlows.length; i++) {
      cumulativeCashFlow += projectedCashFlows[i];
      if (cumulativeCashFlow >= initialInvestment) {
        paybackPeriod = i + 1 - (cumulativeCashFlow - initialInvestment) / projectedCashFlows[i];
        break;
      }
    }
    
    // Score based on financial metrics (0-100)
    let score = 0;
    if (npv > 0) score += 30;
    if (irr > 0.15) score += 25;
    if (roi > 0.20) score += 25;
    if (paybackPeriod < 3) score += 20;
    
    return {
      projectId,
      initialInvestment,
      npv: Math.round(npv),
      irr: Math.round(irr * 100) / 100,
      roi: Math.round(roi * 100) / 100,
      paybackPeriod: Math.round(paybackPeriod * 10) / 10,
      score: Math.min(100, score)
    };
  }

  private async assessStrategicAlignment(projectId: string): Promise<number> {
    // Strategic alignment assessment (0-100 score)
    const strategicCriteria = [
      { criterion: 'Market Opportunity', weight: 0.25, score: 85 },
      { criterion: 'Technology Innovation', weight: 0.20, score: 75 },
      { criterion: 'Competitive Advantage', weight: 0.20, score: 80 },
      { criterion: 'Customer Value', weight: 0.20, score: 90 },
      { criterion: 'Organizational Fit', weight: 0.15, score: 70 }
    ];
    
    const weightedScore = strategicCriteria.reduce((sum, item) => 
      sum + (item.score * item.weight), 0
    );
    
    return Math.round(weightedScore);
  }

  private async evaluateProjectRisk(projectId: string): Promise<any> {
    const riskCategories = [
      {
        category: 'Technical Risk',
        probability: 0.3, // 30% chance
        impact: 0.7, // 70% impact if occurs
        mitigation: 'Proof of concept development'
      },
      {
        category: 'Market Risk',
        probability: 0.4,
        impact: 0.8,
        mitigation: 'Market research and customer validation'
      },
      {
        category: 'Resource Risk',
        probability: 0.2,
        impact: 0.5,
        mitigation: 'Resource backup plan'
      },
      {
        category: 'Schedule Risk',
        probability: 0.5,
        impact: 0.6,
        mitigation: 'Agile methodology with regular checkpoints'
      }
    ];
    
    // Calculate overall risk score
    const overallRisk = riskCategories.reduce((sum, risk) => 
      sum + (risk.probability * risk.impact), 0
    ) / riskCategories.length;
    
    const riskScore = Math.round(overallRisk * 100);
    
    return {
      projectId,
      riskCategories,
      overallRiskLevel: riskScore > 50 ? 'HIGH' : riskScore > 25 ? 'MEDIUM' : 'LOW',
      score: riskScore,
      mitigationStrategies: riskCategories.map(r => r.mitigation)
    };
  }

  private async assessResourceAvailability(projectId: string): Promise<any> {
    const resourceRequirements = [
      { skill: 'Senior Developer', required: 2, available: 1.5, score: 75 },
      { skill: 'Business Analyst', required: 1, available: 1.2, score: 100 },
      { skill: 'UI/UX Designer', required: 1, available: 0.8, score: 80 },
      { skill: 'Project Manager', required: 1, available: 1.0, score: 100 }
    ];
    
    const averageScore = resourceRequirements.reduce((sum, req) => sum + req.score, 0) / resourceRequirements.length;
    
    return {
      projectId,
      resourceRequirements,
      overallAvailability: averageScore > 90 ? 'EXCELLENT' : averageScore > 75 ? 'GOOD' : averageScore > 50 ? 'ADEQUATE' : 'POOR',
      score: Math.round(averageScore),
      constraints: resourceRequirements.filter(req => req.score < 100).map(req => 
        `${req.skill}: Need ${req.required}, have ${req.available}`
      )
    };
  }

  async prioritizeProjects(projects: any[], constraints: {
    totalBudget: number;
    resourceConstraints: any[];
    strategicObjectives: string[];
  }): Promise<any> {
    const prioritizedProjects = projects
      .sort((a, b) => b.scores.overall - a.scores.overall)
      .map((project, index) => ({
        ...project,
        priority: index + 1,
        recommended: index < Math.ceil(projects.length * 0.6) // Top 60%
      }));
    
    const selectedProjects = this.optimizeProjectSelection(prioritizedProjects, constraints);
    
    return {
      totalProjects: projects.length,
      prioritizedProjects,
      selectedProjects,
      budgetUtilization: selectedProjects.reduce((sum: number, p: any) => sum + p.estimatedBudget, 0),
      unselectedProjects: prioritizedProjects.filter(p => !selectedProjects.includes(p)),
      portfolioBalance: this.analyzePortfolioBalance(selectedProjects)
    };
  }

  private optimizeProjectSelection(projects: any[], constraints: any): any[] {
    // Simplified optimization - select highest scoring projects within budget
    const selected = [];
    let remainingBudget = constraints.totalBudget;
    
    for (const project of projects) {
      const estimatedBudget = project.details?.financialAnalysis?.initialInvestment || 100000;
      if (remainingBudget >= estimatedBudget && selected.length < 5) { // Max 5 projects
        selected.push({
          ...project,
          estimatedBudget
        });
        remainingBudget -= estimatedBudget;
      }
    }
    
    return selected;
  }

  private analyzePortfolioBalance(selectedProjects: any[]): any {
    const riskDistribution = {
      low: selectedProjects.filter(p => p.details.riskAssessment.overallRiskLevel === 'LOW').length,
      medium: selectedProjects.filter(p => p.details.riskAssessment.overallRiskLevel === 'MEDIUM').length,
      high: selectedProjects.filter(p => p.details.riskAssessment.overallRiskLevel === 'HIGH').length
    };
    
    const averageROI = selectedProjects.reduce((sum, p) => 
      sum + (p.details?.financialAnalysis?.roi || 0), 0
    ) / selectedProjects.length;
    
    return {
      riskDistribution,
      averageROI: Math.round(averageROI * 100) / 100,
      totalProjects: selectedProjects.length,
      balanceScore: this.calculateBalanceScore(riskDistribution, averageROI)
    };
  }

  private calculateBalanceScore(riskDist: any, avgROI: number): number {
    // Balanced portfolio should have mix of risks and good ROI
    const riskBalance = Math.min(riskDist.low, riskDist.medium, riskDist.high) > 0 ? 25 : 0;
    const roiScore = avgROI > 0.25 ? 25 : avgROI > 0.15 ? 20 : 15;
    
    return riskBalance + roiScore;
  }

  private generatePortfolioRecommendations(evaluations: any[]): string[] {
    return this.recommendationGenerator.generatePortfolioRecommendations(evaluations);
  }

  /**
   * Project Resource Management Business Logic
   */
  async optimizeResourceUtilization(timeframe: { startDate: Date; endDate: Date }): Promise<any> {
    const resources = await this.getResourceCapacityData(timeframe);
    const projects = await this.getActiveProjectsInTimeframe(timeframe);
    
    // Calculate current utilization
    const utilizationData = resources.map(resource => {
      const totalAllocatedHours = this.calculateAllocatedHours(resource.id, timeframe);
      const utilizationPercentage = (totalAllocatedHours / resource.totalCapacity) * 100;
      
      return {
        resourceId: resource.id,
        name: resource.name,
        skill: resource.primarySkill,
        totalCapacity: resource.totalCapacity,
        allocatedHours: totalAllocatedHours,
        availableHours: resource.totalCapacity - totalAllocatedHours,
        utilizationPercentage: Math.round(utilizationPercentage),
        status: this.determineUtilizationStatus(utilizationPercentage)
      };
    });
    
    // Identify optimization opportunities
    const underutilized = utilizationData.filter(r => r.utilizationPercentage < 70);
    const overutilized = utilizationData.filter(r => r.utilizationPercentage > 95);
    const optimal = utilizationData.filter(r => r.utilizationPercentage >= 70 && r.utilizationPercentage <= 95);
    
    return {
      timeframe,
      resourceUtilization: utilizationData,
      summary: {
        totalResources: resources.length,
        averageUtilization: Math.round(
          utilizationData.reduce((sum, r) => sum + r.utilizationPercentage, 0) / utilizationData.length
        ),
        underutilized: underutilized.length,
        overutilized: overutilized.length,
        optimal: optimal.length
      },
      optimizationOpportunities: this.generateOptimizationRecommendations(underutilized, overutilized),
      rebalancingStrategies: await this.generateRebalancingStrategies(underutilized, overutilized)
    };
  }

  private async getResourceCapacityData(timeframe: any): Promise<any[]> {
    // Mock data - in real implementation would fetch from database
    return [
      {
        id: 'res_001',
        name: 'John Smith',
        primarySkill: 'Senior Developer',
        totalCapacity: 160, // hours per month
        hourlyRate: 150,
        location: 'New York'
      },
      {
        id: 'res_002',
        name: 'Jane Doe',
        primarySkill: 'Business Analyst',
        totalCapacity: 160,
        hourlyRate: 120,
        location: 'Remote'
      },
      {
        id: 'res_003',
        name: 'Mike Johnson',
        primarySkill: 'UI/UX Designer',
        totalCapacity: 160,
        hourlyRate: 100,
        location: 'San Francisco'
      }
    ];
  }

  private async getActiveProjectsInTimeframe(timeframe: any): Promise<string[]> {
    return ['proj_001', 'proj_002', 'proj_003'];
  }

  private calculateAllocatedHours(resourceId: string, timeframe: any): number {
    // Mock calculation - in real implementation would query allocations
    const allocations = {
      'res_001': 152, // 95% utilized
      'res_002': 96,  // 60% utilized
      'res_003': 128  // 80% utilized
    };
    return allocations[resourceId as keyof typeof allocations] || 80;
  }

  private determineUtilizationStatus(percentage: number): string {
    if (percentage < 70) return 'UNDERUTILIZED';
    if (percentage > 95) return 'OVERUTILIZED';
    return 'OPTIMAL';
  }

  private generateOptimizationRecommendations(underutilized: any[], overutilized: any[]): string[] {
    const recommendations = [];
    
    if (underutilized.length > 0) {
      recommendations.push(`${underutilized.length} resources are underutilized - consider additional project assignments`);
      underutilized.forEach(resource => {
        recommendations.push(`Assign ${resource.availableHours} additional hours to ${resource.name} (${resource.skill})`);
      });
    }
    
    if (overutilized.length > 0) {
      recommendations.push(`${overutilized.length} resources are overutilized - redistribute workload to prevent burnout`);
      overutilized.forEach(resource => {
        const excessHours = resource.allocatedHours - (resource.totalCapacity * 0.95);
        recommendations.push(`Reduce ${resource.name}'s allocation by ${Math.round(excessHours)} hours`);
      });
    }
    
    return recommendations;
  }

  private async generateRebalancingStrategies(underutilized: any[], overutilized: any[]): Promise<any[]> {
    const strategies = [];
    
    // Strategy 1: Direct reallocation
    for (const overRes of overutilized) {
      for (const underRes of underutilized) {
        if (this.skillsMatch(overRes.skill, underRes.skill)) {
          const transferHours = Math.min(
            overRes.allocatedHours - overRes.totalCapacity * 0.95,
            underRes.availableHours
          );
          
          if (transferHours > 0) {
            strategies.push({
              type: 'DIRECT_REALLOCATION',
              fromResource: overRes.name,
              toResource: underRes.name,
              hours: Math.round(transferHours),
              description: `Transfer ${Math.round(transferHours)} hours from ${overRes.name} to ${underRes.name}`
            });
          }
        }
      }
    }
    
    // Strategy 2: Resource pooling
    if (underutilized.length > 1) {
      strategies.push({
        type: 'RESOURCE_POOLING',
        resources: underutilized.map(r => r.name),
        availableHours: underutilized.reduce((sum, r) => sum + r.availableHours, 0),
        description: 'Create shared resource pool for new project assignments'
      });
    }
    
    return strategies;
  }

  private skillsMatch(skill1: string, skill2: string): boolean {
    // Simplified skill matching - in real implementation would be more sophisticated
    const skillGroups = [
      ['Senior Developer', 'Developer', 'Junior Developer'],
      ['Business Analyst', 'System Analyst'],
      ['UI/UX Designer', 'Graphic Designer']
    ];
    
    return skillGroups.some(group => group.includes(skill1) && group.includes(skill2));
  }

  async planResourceCapacity(planningHorizon: { months: number }): Promise<any> {
    const currentDate = new Date();
    const capacityPlan = [];
    
    for (let i = 0; i < planningHorizon.months; i++) {
      const month = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const monthStr = month.toISOString().substring(0, 7);
      
      const projectedDemand = await this.projectResourceDemand(month);
      const availableCapacity = await this.calculateAvailableCapacity(month);
      const gap = projectedDemand.totalHours - availableCapacity.totalHours;
      
      capacityPlan.push({
        month: monthStr,
        demand: projectedDemand,
        supply: availableCapacity,
        gap: gap,
        gapPercentage: Math.round((gap / projectedDemand.totalHours) * 100),
        recommendations: this.generateCapacityRecommendations(gap, month)
      });
    }
    
    return {
      planningHorizon,
      capacityPlan,
      summary: {
        averageUtilization: Math.round(
          capacityPlan.reduce((sum, plan) => sum + (plan.supply.totalHours / plan.demand.totalHours * 100), 0) / capacityPlan.length
        ),
        criticalMonths: capacityPlan.filter(plan => Math.abs(plan.gapPercentage) > 20).length,
        totalGap: capacityPlan.reduce((sum, plan) => sum + Math.abs(plan.gap), 0)
      }
    };
  }

  private async projectResourceDemand(month: Date): Promise<any> {
    // Project resource demand for the month
    const baselineHours = 2000; // Base monthly demand
    const seasonalFactor = Math.sin((month.getMonth() / 12) * 2 * Math.PI) * 0.2 + 1; // Seasonal variation
    const totalHours = Math.round(baselineHours * seasonalFactor);
    
    return {
      totalHours,
      bySkill: {
        'Senior Developer': Math.round(totalHours * 0.3),
        'Developer': Math.round(totalHours * 0.4),
        'Business Analyst': Math.round(totalHours * 0.15),
        'UI/UX Designer': Math.round(totalHours * 0.15)
      }
    };
  }

  private async calculateAvailableCapacity(month: Date): Promise<any> {
    const workingDaysInMonth = 22; // Average working days
    const hoursPerDay = 8;
    const resourceCount = {
      'Senior Developer': 3,
      'Developer': 5,
      'Business Analyst': 2,
      'UI/UX Designer': 2
    };
    
    const totalHours = Object.values(resourceCount).reduce((sum, count) => sum + count, 0) * workingDaysInMonth * hoursPerDay;
    
    return {
      totalHours,
      bySkill: Object.entries(resourceCount).reduce((acc, [skill, count]) => {
        acc[skill] = count * workingDaysInMonth * hoursPerDay;
        return acc;
      }, {} as any)
    };
  }

  private generateCapacityRecommendations(gap: number, month: Date): string[] {
    const recommendations = [];
    
    if (gap > 0) {
      // Demand exceeds supply
      recommendations.push('Consider hiring additional resources');
      recommendations.push('Evaluate contractor/freelancer options');
      recommendations.push('Prioritize projects and defer non-critical work');
    } else if (gap < -200) {
      // Significant oversupply
      recommendations.push('Opportunity for additional project work');
      recommendations.push('Consider training/upskilling initiatives');
      recommendations.push('Evaluate resource reallocation to other projects');
    }
    
    return recommendations;
  }

  async measureResourcePerformance(): Promise<any> {
    const resources = await this.getResourceCapacityData({ startDate: new Date(), endDate: new Date() });
    
    const performanceMetrics = resources.map(resource => {
      const productivity = this.calculateProductivity(resource.id);
      const satisfaction = this.getResourceSatisfaction(resource.id);
      const utilization = this.calculateAllocatedHours(resource.id, {}) / resource.totalCapacity;
      
      return {
        resourceId: resource.id,
        name: resource.name,
        skill: resource.primarySkill,
        productivity: productivity,
        satisfaction: satisfaction,
        utilization: Math.round(utilization * 100),
        overallPerformance: Math.round((productivity + satisfaction + (utilization * 100)) / 3),
        recommendations: this.generatePerformanceRecommendations(productivity, satisfaction, utilization)
      };
    });
    
    return {
      resourcePerformance: performanceMetrics,
      summary: {
        averageProductivity: Math.round(
          performanceMetrics.reduce((sum, r) => sum + r.productivity, 0) / performanceMetrics.length
        ),
        averageSatisfaction: Math.round(
          performanceMetrics.reduce((sum, r) => sum + r.satisfaction, 0) / performanceMetrics.length
        ),
        topPerformers: performanceMetrics.filter(r => r.overallPerformance > 85).length,
        improvementOpportunities: performanceMetrics.filter(r => r.overallPerformance < 70).length
      }
    };
  }

  private calculateProductivity(resourceId: string): number {
    // Mock productivity calculation based on tasks completed, quality metrics, etc.
    const productivityScores = {
      'res_001': 88,
      'res_002': 92,
      'res_003': 75
    };
    return productivityScores[resourceId as keyof typeof productivityScores] || 80;
  }

  private getResourceSatisfaction(resourceId: string): number {
    // Mock satisfaction scores from surveys, feedback, etc.
    const satisfactionScores = {
      'res_001': 85,
      'res_002': 90,
      'res_003': 78
    };
    return satisfactionScores[resourceId as keyof typeof satisfactionScores] || 80;
  }

  private generatePerformanceRecommendations(productivity: number, satisfaction: number, utilization: number): string[] {
    return this.recommendationGenerator.generateProjectPerformanceRecommendations(productivity, satisfaction, utilization);
  }

  private generateCostRecommendations(indicators: any): string[] {
    return this.recommendationGenerator.generateCostRecommendations(indicators);
  }

  private generateStakeholderContent(projectId: string, stakeholder: any): any {
    const baseContent = {
      projectId,
      reportDate: new Date(),
      stakeholder: stakeholder.name
    };
    
    switch (stakeholder.communicationPreference) {
      case 'EXECUTIVE_SUMMARY':
        return {
          ...baseContent,
          summary: 'Project is 65% complete and on track',
          keyMetrics: { budget: '68% utilized', timeline: '75% elapsed', risks: 'Low' },
          nextMilestones: ['Beta Release - Next Month']
        };
      
      case 'DETAILED_PROGRESS':
        return {
          ...baseContent,
          completedTasks: 15,
          inProgressTasks: 8,
          upcomingDeliverables: ['System Design Document', 'Prototype Demo'],
          qualityMetrics: { defectRate: '2%', testCoverage: '85%' }
        };
      
      case 'TECHNICAL_DETAILS':
        return {
          ...baseContent,
          technicalProgress: 'API development 80% complete',
          currentBlockers: ['Database migration pending'],
          codeReviewStatus: 'All PRs reviewed and merged',
          upcomingTechnicalMilestones: ['Integration testing phase']
        };
      
      default:
        return baseContent;
    }
  }

  private calculatePortfolioMetrics(evaluations: any[]): any {
    return {
      averageScore: Math.round(evaluations.reduce((sum, e) => sum + e.scores.overall, 0) / evaluations.length),
      highPerformingProjects: evaluations.filter(e => e.scores.overall > 75).length,
      riskDistribution: {
        low: evaluations.filter(e => e.details.riskAssessment.overallRiskLevel === 'LOW').length,
        medium: evaluations.filter(e => e.details.riskAssessment.overallRiskLevel === 'MEDIUM').length,
        high: evaluations.filter(e => e.details.riskAssessment.overallRiskLevel === 'HIGH').length
      },
      totalPortfolioValue: evaluations.reduce((sum, e) => sum + (e.details?.financialAnalysis?.npv || 0), 0)
    };
  }

  /**
   * Existing Project Management Methods
   */
  /**
   * Project Management
   */
  async createProject(project: Omit<Project, 'id' | 'projectNumber' | 'actualCost'>): Promise<Project> {
    const id = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const projectNumber = `PROJ${Date.now().toString().slice(-6)}`;
    
    return {
      ...project,
      id,
      projectNumber,
      actualCost: 0,
      status: 'PLANNING'
    };
  }

  async updateProjectStatus(projectId: string, status: Project['status'], notes?: string): Promise<void> {
    console.log(`Updating project ${projectId} status to ${status}. Notes: ${notes || 'None'}`);
  }

  async calculateProjectProgress(projectId: string): Promise<number> {
    // Implementation would calculate overall project completion percentage
    return 65; // Example: 65% complete
  }

  /**
   * Task Management
   */
  async createTask(task: Omit<Task, 'id' | 'actualHours' | 'percentComplete' | 'subtasks'>): Promise<Task> {
    const id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      ...task,
      id,
      actualHours: 0,
      percentComplete: 0,
      subtasks: []
    };
  }

  async updateTaskProgress(taskId: string, percentComplete: number, actualHours: number): Promise<void> {
    console.log(`Updating task ${taskId}: ${percentComplete}% complete, ${actualHours} hours worked`);
  }

  async calculateCriticalPath(projectId: string): Promise<Task[]> {
    // Implementation would calculate critical path tasks
    return [];
  }

  /**
   * Resource Management
   */
  async allocateResource(allocation: ResourceAllocation): Promise<void> {
    console.log(`Allocating resource ${allocation.resourceId} to project ${allocation.projectId} as ${allocation.role}`);
  }

  async checkResourceAvailability(resourceId: string, startDate: Date, endDate: Date): Promise<number> {
    // Implementation would check resource availability percentage
    return 75; // Example: 75% available
  }

  async findAvailableResources(skillsRequired: string[], startDate: Date, endDate: Date): Promise<Resource[]> {
    // Implementation would find resources with required skills and availability
    return [];
  }

  /**
   * Time Tracking
   */
  async submitTimeSheet(timeSheet: Omit<TimeSheet, 'id' | 'approved' | 'approvedBy' | 'approvedDate'>): Promise<TimeSheet> {
    const id = `ts_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      ...timeSheet,
      id,
      approved: false
    };
  }

  async approveTimeSheet(timeSheetId: string, approverId: string): Promise<void> {
    console.log(`Time sheet ${timeSheetId} approved by ${approverId}`);
  }

  async calculateProjectLaborCost(projectId: string): Promise<number> {
    // Implementation would calculate total labor cost for project
    return 45000; // Example cost
  }

  /**
   * Budget Management
   */
  async createProjectBudget(projectId: string, budgetItems: Omit<ProjectBudget, 'projectId' | 'actualAmount' | 'remainingBudget' | 'variance' | 'variancePercentage'>[]): Promise<ProjectBudget[]> {
    return budgetItems.map(item => ({
      ...item,
      projectId,
      actualAmount: 0,
      remainingBudget: item.budgetedAmount,
      variance: 0,
      variancePercentage: 0
    }));
  }

  async updateProjectCosts(projectId: string, category: ProjectBudget['category'], actualAmount: number): Promise<void> {
    console.log(`Updating ${category} costs for project ${projectId}: $${actualAmount}`);
  }

  async calculateBudgetVariance(projectId: string): Promise<ProjectBudget[]> {
    // Implementation would calculate budget vs actual variance
    return [];
  }

  /**
   * Project Portfolio Management
   */
  async getPortfolioOverview(): Promise<any> {
    return {
      totalProjects: 0,
      activeProjects: 0,
      projectsByStatus: {
        planning: 0,
        active: 0,
        onHold: 0,
        completed: 0,
        cancelled: 0
      },
      totalBudget: 0,
      totalActualCost: 0,
      budgetVariance: 0,
      resourceUtilization: 0
    };
  }

  async getProjectHealthScore(projectId: string): Promise<any> {
    return {
      projectId,
      overallScore: 85, // 0-100 scale
      metrics: {
        schedulePerformance: 0.95, // 1.0 = on schedule
        costPerformance: 1.02, // 1.0 = on budget
        scopeCompletion: 0.65, // 0-1 scale
        qualityMetrics: 0.92, // 0-1 scale
        riskScore: 0.15, // 0-1 scale (lower is better)
        teamSatisfaction: 0.88 // 0-1 scale
      }
    };
  }

  /**
   * Project Reporting
   */
  async generateProjectStatusReport(projectId: string): Promise<any> {
    return {
      projectId,
      reportDate: new Date(),
      summary: {
        overallStatus: 'ON_TRACK',
        percentComplete: 65,
        daysRemaining: 45,
        budgetUtilized: 0.58
      },
      milestones: {
        upcoming: [],
        completed: [],
        overdue: []
      },
      risks: [],
      issues: [],
      achievements: []
    };
  }

  async generateResourceUtilizationReport(startDate: Date, endDate: Date): Promise<any> {
    return {
      reportPeriod: { startDate, endDate },
      overallUtilization: 78,
      byResource: [],
      byProject: [],
      underutilizedResources: [],
      overallocatedResources: []
    };
  }

  async generateProjectProfitabilityReport(projectId: string): Promise<any> {
    return {
      projectId,
      revenue: 120000,
      totalCosts: 85000,
      grossProfit: 35000,
      grossMargin: 0.29,
      costBreakdown: {
        labor: 65000,
        materials: 15000,
        equipment: 3000,
        other: 2000
      },
      profitabilityIndex: 1.41
    };
  }

  async getForecastCompletion(projectId: string): Promise<any> {
    return {
      projectId,
      currentProgress: 65,
      estimatedCompletionDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      estimatedTotalCost: 92000,
      estimatedVariance: {
        schedule: 5, // days
        budget: 7000 // dollars
      },
      confidence: 0.85 // 0-1 scale
    };
  }
}

export const projectManager = new ProjectManager();