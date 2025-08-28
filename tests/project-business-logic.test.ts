/**
 * Project Business Logic Tests
 * Tests for the enhanced project management business logic
 */

import { ProjectManager } from '../src/modules/project';

describe('Project Business Logic', () => {
  let projectManager: ProjectManager;

  beforeEach(() => {
    projectManager = new ProjectManager();
  });

  describe('Project Billing', () => {
    test('should generate time and materials invoice', async () => {
      const invoice = await projectManager.generateProjectInvoice('proj_001', 'TIME_AND_MATERIALS');
      
      expect(invoice).toHaveProperty('id');
      expect(invoice).toHaveProperty('invoiceNumber');
      expect(invoice.billingType).toBe('TIME_AND_MATERIALS');
      expect(invoice.lineItems).toHaveLength(2);
      expect(invoice.subtotal).toBeGreaterThan(0);
      expect(invoice.totalAmount).toBeGreaterThan(invoice.subtotal);
      expect(invoice.status).toBe('DRAFT');
    });

    test('should calculate project cash flow', async () => {
      const cashFlow = await projectManager.calculateProjectCashFlow('proj_001');
      
      expect(cashFlow).toHaveProperty('projectId');
      expect(cashFlow).toHaveProperty('totalInflow');
      expect(cashFlow).toHaveProperty('totalOutflow');
      expect(cashFlow).toHaveProperty('netCashFlow');
      expect(cashFlow.monthlyProjection).toHaveLength(12);
      expect(cashFlow.totalInflow).toBeGreaterThan(0);
    });

    test('should measure project profitability', async () => {
      const profitability = await projectManager.measureProjectProfitability('proj_001');
      
      expect(profitability).toHaveProperty('projectId');
      expect(profitability).toHaveProperty('revenue');
      expect(profitability).toHaveProperty('grossProfit');
      expect(profitability).toHaveProperty('grossMargin');
      expect(profitability).toHaveProperty('profitabilityIndex');
      expect(profitability.revenue).toBeGreaterThan(profitability.costs.total);
    });
  });

  describe('Project Collaboration', () => {
    test('should create project document', async () => {
      const document = await projectManager.createProjectDocument({
        projectId: 'proj_001',
        name: 'Test Document',
        description: 'Test document for collaboration',
        type: 'SPECIFICATION',
        createdBy: 'user_001',
        modifiedBy: 'user_001',
        filePath: '/path/to/doc.pdf',
        fileSize: 1024,
        status: 'DRAFT',
        tags: ['test']
      });
      
      expect(document).toHaveProperty('id');
      expect(document.version).toBe('1.0');
      expect(document.name).toBe('Test Document');
      expect(document.type).toBe('SPECIFICATION');
    });

    test('should manage project deliverables', async () => {
      const deliverables = await projectManager.manageProjectDeliverables('proj_001');
      
      expect(Array.isArray(deliverables)).toBe(true);
      expect(deliverables.length).toBeGreaterThan(0);
      
      const deliverable = deliverables[0];
      expect(deliverable).toHaveProperty('id');
      expect(deliverable).toHaveProperty('name');
      expect(deliverable).toHaveProperty('status');
      expect(deliverable).toHaveProperty('assignedTo');
    });

    test('should track deliverable progress', async () => {
      const progress = await projectManager.trackDeliverableProgress('del_001');
      
      expect(progress).toHaveProperty('deliverableId');
      expect(progress).toHaveProperty('progressPercentage');
      expect(progress).toHaveProperty('milestonesCompleted');
      expect(progress).toHaveProperty('remainingTasks');
      expect(progress.progressPercentage).toBeGreaterThanOrEqual(0);
      expect(progress.progressPercentage).toBeLessThanOrEqual(100);
    });
  });

  describe('Project Costing', () => {
    test('should implement activity-based costing', async () => {
      const costing = await projectManager.implementActivityBasedCosting('proj_001');
      
      expect(costing).toHaveProperty('costingMethod', 'Activity-Based Costing');
      expect(costing).toHaveProperty('activities');
      expect(costing).toHaveProperty('totalCost');
      expect(Array.isArray(costing.activities)).toBe(true);
      expect(costing.activities.length).toBeGreaterThan(0);
      expect(costing.totalCost).toBeGreaterThan(0);
    });

    test('should track project-based costs', async () => {
      const costTracking = await projectManager.trackProjectBasedCosts('proj_001');
      
      expect(costTracking).toHaveProperty('projectId');
      expect(costTracking).toHaveProperty('costCategories');
      expect(costTracking).toHaveProperty('summary');
      expect(Array.isArray(costTracking.costCategories)).toBe(true);
      expect(costTracking.summary).toHaveProperty('totalBudgeted');
      expect(costTracking.summary).toHaveProperty('totalActual');
    });

    test('should analyze expenditure vs forecast', async () => {
      const analysis = await projectManager.analyzeExpenditureVsForecast('proj_001');
      
      expect(analysis).toHaveProperty('projectId');
      expect(analysis).toHaveProperty('monthlyData');
      expect(analysis).toHaveProperty('summary');
      expect(Array.isArray(analysis.monthlyData)).toBe(true);
      expect(analysis.monthlyData.length).toBe(12);
      expect(analysis.summary).toHaveProperty('forecastAccuracy');
    });
  });

  describe('Project Planning and Control', () => {
    test('should plan project work', async () => {
      const workPlan = await projectManager.planProjectWork('proj_001');
      
      expect(workPlan).toHaveProperty('projectId');
      expect(workPlan).toHaveProperty('workBreakdownStructure');
      expect(workPlan).toHaveProperty('totalEstimatedHours');
      expect(workPlan).toHaveProperty('plannedDuration');
      expect(Array.isArray(workPlan.workBreakdownStructure)).toBe(true);
      expect(workPlan.totalEstimatedHours).toBeGreaterThan(0);
    });

    test('should forecast to completion', async () => {
      const forecast = await projectManager.forecastToCompletion('proj_001');
      
      expect(forecast).toHaveProperty('projectId');
      expect(forecast).toHaveProperty('scheduleForecasting');
      expect(forecast).toHaveProperty('costForecasting');
      expect(forecast.scheduleForecasting).toHaveProperty('estimatedCompletionDate');
      expect(forecast.costForecasting).toHaveProperty('estimatedTotalCost');
    });
  });

  describe('Project Portfolio Analysis', () => {
    test('should evaluate project portfolio', async () => {
      const projects = ['proj_001', 'proj_002', 'proj_003'];
      const evaluation = await projectManager.evaluateProjectPortfolio(projects);
      
      expect(evaluation).toHaveProperty('portfolioEvaluation');
      expect(evaluation).toHaveProperty('recommendations');
      expect(evaluation).toHaveProperty('portfolioMetrics');
      expect(Array.isArray(evaluation.portfolioEvaluation)).toBe(true);
      expect(evaluation.portfolioEvaluation.length).toBe(projects.length);
    });

    test('should prioritize projects', async () => {
      const mockProjects = [
        { 
          projectId: 'proj_001', 
          scores: { overall: 85 },
          details: {
            riskAssessment: { overallRiskLevel: 'MEDIUM' },
            financialAnalysis: { roi: 0.25 }
          }
        },
        { 
          projectId: 'proj_002', 
          scores: { overall: 70 },
          details: {
            riskAssessment: { overallRiskLevel: 'LOW' },
            financialAnalysis: { roi: 0.20 }
          }
        },
        { 
          projectId: 'proj_003', 
          scores: { overall: 95 },
          details: {
            riskAssessment: { overallRiskLevel: 'HIGH' },
            financialAnalysis: { roi: 0.35 }
          }
        }
      ];
      
      const prioritization = await projectManager.prioritizeProjects(mockProjects, {
        totalBudget: 500000,
        resourceConstraints: [],
        strategicObjectives: ['growth', 'innovation']
      });
      
      expect(prioritization).toHaveProperty('prioritizedProjects');
      expect(prioritization).toHaveProperty('selectedProjects');
      expect(prioritization.prioritizedProjects[0].scores.overall).toBe(95); // Highest score first
    });
  });

  describe('Project Resource Management', () => {
    test('should optimize resource utilization', async () => {
      const timeframe = {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31')
      };
      
      const optimization = await projectManager.optimizeResourceUtilization(timeframe);
      
      expect(optimization).toHaveProperty('resourceUtilization');
      expect(optimization).toHaveProperty('summary');
      expect(optimization).toHaveProperty('optimizationOpportunities');
      expect(Array.isArray(optimization.resourceUtilization)).toBe(true);
      expect(optimization.summary).toHaveProperty('averageUtilization');
    });

    test('should plan resource capacity', async () => {
      const capacityPlan = await projectManager.planResourceCapacity({ months: 6 });
      
      expect(capacityPlan).toHaveProperty('capacityPlan');
      expect(capacityPlan).toHaveProperty('summary');
      expect(Array.isArray(capacityPlan.capacityPlan)).toBe(true);
      expect(capacityPlan.capacityPlan.length).toBe(6);
      expect(capacityPlan.summary).toHaveProperty('averageUtilization');
    });

    test('should measure resource performance', async () => {
      const performance = await projectManager.measureResourcePerformance();
      
      expect(performance).toHaveProperty('resourcePerformance');
      expect(performance).toHaveProperty('summary');
      expect(Array.isArray(performance.resourcePerformance)).toBe(true);
      expect(performance.summary).toHaveProperty('averageProductivity');
      expect(performance.summary).toHaveProperty('averageSatisfaction');
    });
  });
});