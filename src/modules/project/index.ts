/**
 * Project Management Module
 * Main orchestrator that delegates to specialized business logic services
 */

// Export all types
export * from './types';

// Export data access layer
export * from './data-access';

// Export business logic services for direct access
export * from './business-logic/billing/billing-service';
export * from './business-logic/collaboration/collaboration-service';
export * from './business-logic/costing/costing-service';
export * from './business-logic/planning/planning-service';
export * from './business-logic/portfolio/portfolio-service';
export * from './business-logic/resources/resources-service';

// Import shared utilities
import { BaseManager } from '../../shared/utils/base-manager';

// Import business logic services
import { projectBillingService } from './business-logic/billing/billing-service';
import { projectCollaborationService } from './business-logic/collaboration/collaboration-service';
import { projectCostingService } from './business-logic/costing/costing-service';
import { projectPlanningService } from './business-logic/planning/planning-service';
import { projectPortfolioService } from './business-logic/portfolio/portfolio-service';
import { projectResourcesService } from './business-logic/resources/resources-service';

import type { 
  Project, 
  ProjectInvoice, 
  ProjectContract, 
  ProjectBudget, 
  ResourceAllocation,
  ProjectDocument,
  ProjectDeliverable,
  TimeSheet
} from './types';

export class ProjectManager extends BaseManager {
  
  // Project Billing Methods - delegate to billing service
  async createProjectContract(contract: Omit<ProjectContract, 'id' | 'contractNumber'>): Promise<ProjectContract> {
    return projectBillingService.createProjectContract(contract);
  }

  async generateProjectInvoice(
    projectId: string, 
    billingType: ProjectInvoice['billingType'],
    billingPeriod?: { startDate: Date; endDate: Date }
  ): Promise<ProjectInvoice> {
    return projectBillingService.generateProjectInvoice(projectId, billingType, billingPeriod);
  }

  async calculateProjectCashFlow(projectId: string): Promise<any> {
    return projectBillingService.calculateProjectCashFlow(projectId);
  }

  async measureProjectProfitability(projectId: string): Promise<any> {
    return projectBillingService.measureProjectProfitability(projectId);
  }

  async calculateProjectLaborCost(projectId: string): Promise<number> {
    return projectBillingService.calculateProjectLaborCost(projectId);
  }

  async createProjectBudget(
    projectId: string, 
    budgetItems: Omit<ProjectBudget, 'projectId' | 'actualAmount' | 'remainingBudget' | 'variance' | 'variancePercentage'>[]
  ): Promise<ProjectBudget[]> {
    return projectBillingService.createProjectBudget(projectId, budgetItems);
  }

  async updateProjectCosts(projectId: string, category: ProjectBudget['category'], actualAmount: number): Promise<void> {
    return projectBillingService.updateProjectCosts(projectId, category, actualAmount);
  }

  async calculateBudgetVariance(projectId: string): Promise<ProjectBudget[]> {
    return projectBillingService.calculateBudgetVariance(projectId);
  }

  // Project Collaboration Methods - delegate to collaboration service
  async createProjectDocument(document: Omit<ProjectDocument, 'id' | 'version' | 'createdDate' | 'modifiedDate'>): Promise<ProjectDocument> {
    return projectCollaborationService.createProjectDocument(document);
  }

  async updateDocumentVersion(documentId: string, updatedBy: string, changes: string): Promise<ProjectDocument> {
    return projectCollaborationService.updateDocumentVersion(documentId, updatedBy, changes);
  }

  async manageProjectDeliverables(projectId: string): Promise<ProjectDeliverable[]> {
    return projectCollaborationService.manageProjectDeliverables(projectId);
  }

  async trackDeliverableProgress(deliverableId: string): Promise<any> {
    return projectCollaborationService.trackDeliverableProgress(deliverableId);
  }

  async createCentralizedRepository(projectId: string): Promise<any> {
    return projectCollaborationService.createCentralizedRepository(projectId);
  }

  // Project Costing Methods - delegate to costing service
  async implementActivityBasedCosting(projectId: string): Promise<any> {
    return projectCostingService.implementActivityBasedCosting(projectId);
  }

  async trackProjectBasedCosts(projectId: string): Promise<any> {
    return projectCostingService.trackProjectBasedCosts(projectId);
  }

  async analyzeExpenditureVsForecast(projectId: string): Promise<any> {
    return projectCostingService.analyzeExpenditureVsForecast(projectId);
  }

  async trackProgressAndProfitability(projectId: string): Promise<any> {
    return projectCostingService.trackProgressAndProfitability(projectId);
  }

  // Project Planning Methods - delegate to planning service
  async planProjectWork(projectId: string): Promise<any> {
    return projectPlanningService.planProjectWork(projectId);
  }

  async assignProjectResources(projectId: string, assignments: ResourceAllocation[]): Promise<any> {
    return projectPlanningService.assignProjectResources(projectId, assignments);
  }

  async forecastToCompletion(projectId: string): Promise<any> {
    return projectPlanningService.forecastToCompletion(projectId);
  }

  async facilitateStakeholderCommunication(projectId: string): Promise<any> {
    return projectPlanningService.facilitateStakeholderCommunication(projectId);
  }

  // Project Portfolio Methods - delegate to portfolio service
  async evaluateProjectPortfolio(projects: string[]): Promise<any> {
    return projectPortfolioService.evaluateProjectPortfolio(projects);
  }

  async prioritizeProjects(projects: any[], constraints: {
    totalBudget: number;
    resourceConstraints: any[];
    strategicObjectives: string[];
  }): Promise<any> {
    return projectPortfolioService.prioritizeProjects(projects, constraints);
  }

  // Project Resources Methods - delegate to resources service
  async optimizeResourceUtilization(timeframe: { startDate: Date; endDate: Date }): Promise<any> {
    return projectResourcesService.optimizeResourceUtilization(timeframe);
  }

  async planResourceCapacity(planningHorizon: { months: number }): Promise<any> {
    return projectResourcesService.planResourceCapacity(planningHorizon);
  }

  async measureResourcePerformance(): Promise<any> {
    return projectResourcesService.measureResourcePerformance();
  }

  async getResourceSkillMatrix(): Promise<any> {
    return projectResourcesService.getResourceSkillMatrix();
  }

  // Core Project Management Methods (kept in main class for basic operations)
  async createProject(project: Omit<Project, 'id' | 'projectNumber' | 'actualCost'>): Promise<Project> {
    const id = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const projectNumber = `PRJ${Date.now().toString().slice(-6)}`;
    
    return {
      ...project,
      id,
      projectNumber,
      actualCost: 0
    };
  }

  async getProject(projectId: string): Promise<Project | null> {
    // Would fetch from database
    return null;
  }

  async updateProject(projectId: string, updates: Partial<Project>): Promise<Project | null> {
    // Would update in database
    return null;
  }

  async deleteProject(projectId: string): Promise<void> {
    // Would delete from database
    console.log(`Project ${projectId} deleted`);
  }

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
        schedulePerformance: 0.95,
        costPerformance: 1.02,
        scopeCompletion: 0.65,
        qualityMetrics: 0.92,
        riskScore: 0.15,
        teamSatisfaction: 0.88
      }
    };
  }

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
        schedule: 5,
        budget: 7000
      },
      confidence: 0.85
    };
  }

  // Time sheet management
  async createTimeSheet(timeSheet: Omit<TimeSheet, 'id' | 'approved' | 'approvedBy' | 'approvedDate'>): Promise<TimeSheet> {
    return {
      ...timeSheet,
      id: `ts_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      approved: false
    };
  }

  async approveTimeSheet(timeSheetId: string, approverId: string): Promise<void> {
    console.log(`Time sheet ${timeSheetId} approved by ${approverId}`);
  }
}

export const projectManager = new ProjectManager();

// Export business logic services for direct access if needed
export {
  projectBillingService,
  projectCollaborationService,
  projectCostingService,
  projectPlanningService,
  projectPortfolioService,
  projectResourcesService
};