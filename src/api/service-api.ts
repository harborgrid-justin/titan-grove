/**
 * Service API - TypeScript Implementation
 * Real backend connection for service pages
 * Connects frontend UI to actual TypeScript business services
 */

import express, { Request, Response, Router } from 'express';
import { ServiceCommandCenterService } from '../modules/service-command-center/business-logic/service-command-center-service';
import { ServiceDashboardService, serviceDashboardService } from '../modules/service-command-center/business-logic/service-dashboard-service';
import { FieldServiceService } from '../modules/field-service/business-logic/field-service-service';
import { assetManagementService } from '../modules/enterprise-asset-management/business-logic/asset-management-service';
import { ServiceIntegrationContext } from '../shared/interfaces/service-integration';

const router: Router = express.Router();

// Initialize services with minimal context for standalone API usage
const initializeApiServices = () => {
  const context: ServiceIntegrationContext = {
    messageQueue: null as any,
    cache: null as any,
    logger: {
      info: (message: string, ...args: any[]) => console.log(`[API INFO] ${message}`, ...args),
      warn: (message: string, ...args: any[]) => console.warn(`[API WARN] ${message}`, ...args),
      error: (message: string, ...args: any[]) => console.error(`[API ERROR] ${message}`, ...args),
      debug: (message: string, ...args: any[]) => console.debug(`[API DEBUG] ${message}`, ...args)
    } as any, // Type assertion to bypass Logger type mismatch
    config: {
      serviceName: 'service-api',
      cacheConfig: { defaultTTL: 300, keyPrefix: 'api' },
      messageQueueConfig: { 
        defaultPriority: 1, 
        retryAttempts: 3,
        compliance: { dataClassification: 'INTERNAL', auditRequired: false }
      }
    }
  };

  return {
    serviceCommandCenter: new ServiceCommandCenterService(context),
    serviceDashboard: serviceDashboardService,
    fieldService: new FieldServiceService(context)
  };
};

const services = initializeApiServices();

// ==================== SERVICE COMMAND CENTER ENDPOINTS ====================

/**
 * Get service dashboard KPIs with real backend data
 */
router.get('/service-command/kpis/:commandCenterId?', async (req: Request, res: Response) => {
  try {
    const commandCenterId = req.params.commandCenterId || 'default-command-center';
    const kpis = await services.serviceDashboard.generateRealTimeKPIs(commandCenterId);
    
    res.json({ 
      success: true, 
      data: {
        avgResponseTime: kpis.averageResponseTime,
        activeWorkOrders: kpis.totalActiveWorkOrders,
        technicianUtilization: kpis.technicianUtilization / 100, // Convert to decimal
        customerSatisfaction: kpis.customerSatisfactionScore,
        emergencyTickets: 3, // This would come from emergency tracking
        completionRate: kpis.firstTimeFixRate,
        assetAvailability: kpis.assetAvailability,
        serviceRevenue: kpis.serviceRevenue,
        profitMargin: kpis.profitMargin
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Create service dashboard with real backend service
 */
router.post('/service-command/dashboard', async (req: Request, res: Response) => {
  try {
    const { userId, role, commandCenterId, customWidgets } = req.body;
    
    const dashboard = await services.serviceDashboard.createServiceDashboard({
      userId: userId || 'api-user',
      role: role || 'MANAGER',
      commandCenterId: commandCenterId || 'default',
      customWidgets
    });
    
    res.json({ success: true, data: dashboard });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Run dispatch optimization using real algorithm
 */
router.post('/service-command/optimize-dispatch', async (req: Request, res: Response) => {
  try {
    const { commandCenterId, criteria } = req.body;
    
    const optimization = await services.serviceCommandCenter.optimizeServiceDispatch(
      commandCenterId || 'default',
      criteria || 'response-time'
    );
    
    res.json({ success: true, data: optimization });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Activate emergency response with real coordination
 */
router.post('/service-command/emergency-response', async (req: Request, res: Response) => {
  try {
    const { commandCenterId, emergency } = req.body;
    
    const response = await services.serviceCommandCenter.coordinateEmergencyResponse(
      commandCenterId || 'default',
      emergency || { level: 'HIGH', type: 'EQUIPMENT_FAILURE' }
    );
    
    res.json({ success: true, data: response });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Execute service workflow
 */
router.post('/service-command/workflow/execute', async (req: Request, res: Response) => {
  try {
    const { workflowId, triggerId, context } = req.body;
    
    const result = await services.serviceCommandCenter.executeServiceWorkflow(
      workflowId,
      triggerId,
      context
    );
    
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== FIELD SERVICE ENDPOINTS ====================

/**
 * Get work orders using real backend service
 */
router.get('/field-service/work-orders', async (req: Request, res: Response) => {
  try {
    const { status, priority, technicianId } = req.query;
    
    const workOrders = await services.fieldService.getWorkOrders({
      status: status as string,
      priority: priority as string,
      technicianId: technicianId as string
    });
    
    res.json({ success: true, data: workOrders });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Create work order with real business logic
 */
router.post('/field-service/work-orders', async (req: Request, res: Response) => {
  try {
    const workOrderData = req.body;
    
    const workOrder = await services.fieldService.createWorkOrder(workOrderData);
    
    res.json({ success: true, data: workOrder });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get technicians with real data
 */
router.get('/field-service/technicians', async (req: Request, res: Response) => {
  try {
    const { status, skills, location } = req.query;
    
    const technicians = await services.fieldService.getTechnicians({
      status: status as string,
      skills: skills ? (skills as string).split(',') : undefined,
      location: location as string
    });
    
    res.json({ success: true, data: technicians });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Optimize schedule with real optimization engine
 */
router.post('/field-service/optimize-schedule', async (req: Request, res: Response) => {
  try {
    const { criteria, constraints, timeHorizon } = req.body;
    
    const optimization = await services.fieldService.optimizeSchedule({
      criteria: criteria || 'minimize_travel_time',
      constraints: constraints || {},
      timeHorizon: timeHorizon || '24h'
    });
    
    res.json({ success: true, data: optimization });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Assign technician to work order
 */
router.post('/field-service/work-orders/:workOrderId/assign', async (req: Request, res: Response) => {
  try {
    const { workOrderId } = req.params;
    const { technicianId, scheduledDate } = req.body;
    
    const assignment = await services.fieldService.assignTechnician(
      workOrderId,
      technicianId,
      scheduledDate
    );
    
    res.json({ success: true, data: assignment });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get real-time technician locations
 */
router.get('/field-service/technicians/locations', async (req: Request, res: Response) => {
  try {
    const locations = await services.fieldService.getTechnicianLocations();
    
    res.json({ success: true, data: locations });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Update technician status
 */
router.put('/field-service/technicians/:technicianId/status', async (req: Request, res: Response) => {
  try {
    const { technicianId } = req.params;
    const { status, location, currentWorkOrder } = req.body;
    
    const updatedTechnician = await services.fieldService.updateTechnicianStatus(
      technicianId,
      {
        status,
        location,
        currentWorkOrder
      }
    );
    
    res.json({ success: true, data: updatedTechnician });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== REAL-TIME DATA ENDPOINTS ====================

/**
 * Get live service area map data
 */
router.get('/service-command/map-data', async (req: Request, res: Response) => {
  try {
    const { layers } = req.query;
    const requestedLayers = layers ? (layers as string).split(',') : ['technicians', 'work-orders'];
    
    const mapData = await services.serviceDashboard.getMapData({ layers: requestedLayers });
    
    res.json({ success: true, data: mapData });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get service analytics data
 */
router.get('/service-command/analytics', async (req: Request, res: Response) => {
  try {
    const { timeRange, metrics } = req.query;
    
    const analytics = await services.serviceDashboard.getAnalyticsData({
      timeRange: timeRange as string || '7d',
      metrics: metrics ? (metrics as string).split(',') : undefined
    });
    
    res.json({ success: true, data: analytics });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ASSET MANAGEMENT ENDPOINTS ====================
// Extended with 32 additional business-ready API endpoints

// Asset Analytics & Intelligence APIs
router.get('/assets/datavisualization', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getDataVisualization(req.query.assetId as string);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assets/predictiveinsights', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getPredictiveInsights(req.query.assetId as string);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assets/machinelearning', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getMachineLearningModels();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assets/businessintelligence', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getBusinessIntelligence();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assets/datamining', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getDataMining();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assets/performancemodeling', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getPerformanceModeling();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assets/realtimeanalytics', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getRealTimeAnalytics();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assets/advancedreporting', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getAdvancedReporting();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Asset Financial Management APIs
router.get('/assets/costtracking', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getCostTracking(req.query.assetId as string);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assets/roianalysis', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getROIAnalysis(req.query.assetId as string);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assets/depreciationmanagement', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getDepreciationManagement();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assets/budgetplanning', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getBudgetPlanning();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assets/financialplanning', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getFinancialPlanning();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assets/costoptimization', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getCostOptimization();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assets/financialreporting', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getFinancialReporting();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assets/investmenttracking', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getInvestmentTracking();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Asset Integration & Workflow APIs
router.get('/assets/apimanagement', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getApiManagement();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assets/workflowautomation', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getWorkflowAutomation();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assets/datasynchronization', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getDataSynchronization();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assets/systemintegration', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getSystemIntegration();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assets/processorchestration', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getProcessOrchestration();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assets/integrationmonitoring', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getIntegrationMonitoring();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assets/datatransformation', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getDataTransformation();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assets/workflowdesigner', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getWorkflowDesigner();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Asset Strategic Planning APIs
router.get('/assets/strategicplanning', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getStrategicPlanning();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assets/portfoliooptimization', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getPortfolioOptimization();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assets/investmentplanning', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getInvestmentPlanning();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assets/resourceallocation', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getResourceAllocation();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assets/marketanalysis', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getMarketAnalysis();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assets/riskmanagement', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getRiskManagement();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assets/performancestrategy', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getPerformanceStrategy();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assets/scenarioplanning', async (req: Request, res: Response) => {
  try {
    const data = await assetManagementService.getScenarioPlanning();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export { router as serviceApiRouter };