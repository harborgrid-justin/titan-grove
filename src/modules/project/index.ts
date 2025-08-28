/**
 * Project Management Module
 * Comprehensive project portfolio management, resource planning, and project costing
 */

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

export class ProjectManager {
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