/**
 * Service Command Center API Integration
 * RESTful API endpoints for Service Command Center operations
 * Oracle EBS Service Command Center competitive APIs
 */

import { Router } from 'express';
import { 
  serviceCommandCenterService,
  serviceDashboardService,
  serviceAnalyticsService,
  mobileCommandService
} from './index';

const router = Router();

// ================================
// COMMAND CENTER OPERATIONS
// ================================

/**
 * Initialize new service command center
 * POST /api/service-command-center/initialize
 */
router.post('/initialize', async (req, res) => {
  try {
    const { name, region, serviceAreas, initialResources } = req.body;
    
    const commandCenter = await serviceCommandCenterService.initializeCommandCenter({
      name,
      region,
      serviceAreas,
      initialResources
    });
    
    res.json({
      success: true,
      data: commandCenter,
      message: `Service Command Center '${name}' initialized successfully`
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get command center status
 * GET /api/service-command-center/:commandCenterId/status
 */
router.get('/:commandCenterId/status', async (req, res) => {
  try {
    const { commandCenterId } = req.params;
    
    const status = await serviceCommandCenterService.getCommandCenterStatus(commandCenterId);
    
    res.json({
      success: true,
      data: status
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Optimize service dispatch
 * POST /api/service-command-center/:commandCenterId/optimize-dispatch
 */
router.post('/:commandCenterId/optimize-dispatch', async (req, res) => {
  try {
    const { commandCenterId } = req.params;
    const { priority, serviceArea, emergencyMode } = req.body;
    
    const optimization = await serviceCommandCenterService.optimizeServiceDispatch(
      commandCenterId,
      { priority, serviceArea, emergencyMode }
    );
    
    res.json({
      success: true,
      data: optimization,
      message: `Dispatch optimization completed for ${optimization.optimizedAssignments.length} assignments`
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Coordinate emergency response
 * POST /api/service-command-center/:commandCenterId/emergency-response
 */
router.post('/:commandCenterId/emergency-response', async (req, res) => {
  try {
    const { commandCenterId } = req.params;
    const emergency = req.body;
    
    const response = await serviceCommandCenterService.coordinateEmergencyResponse(
      commandCenterId,
      emergency
    );
    
    res.json({
      success: true,
      data: response,
      message: `Emergency response coordinated - ETA: ${response.responseTeam.estimatedArrival}`
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Register service resource
 * POST /api/service-command-center/:commandCenterId/resources
 */
router.post('/:commandCenterId/resources', async (req, res) => {
  try {
    const { commandCenterId } = req.params;
    const resourceData = req.body;
    
    const resource = await serviceCommandCenterService.registerServiceResource(
      commandCenterId,
      resourceData
    );
    
    res.json({
      success: true,
      data: resource,
      message: `Resource '${resource.name}' registered successfully`
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// ================================
// DASHBOARD OPERATIONS
// ================================

/**
 * Create service dashboard
 * POST /api/service-command-center/dashboard/create
 */
router.post('/dashboard/create', async (req, res) => {
  try {
    const config = req.body;
    
    const dashboard = await serviceDashboardService.createServiceDashboard(config);
    
    res.json({
      success: true,
      data: dashboard,
      message: `Dashboard created for ${config.role} role`
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get real-time KPIs
 * GET /api/service-command-center/:commandCenterId/kpis
 */
router.get('/:commandCenterId/kpis', async (req, res) => {
  try {
    const { commandCenterId } = req.params;
    
    const kpis = await serviceDashboardService.generateRealTimeKPIs(commandCenterId);
    
    res.json({
      success: true,
      data: kpis
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Generate service heat map
 * POST /api/service-command-center/:commandCenterId/heat-map
 */
router.post('/:commandCenterId/heat-map', async (req, res) => {
  try {
    const { commandCenterId } = req.params;
    const { timeRange, metric, granularity } = req.body;
    
    const heatMap = await serviceDashboardService.generateServiceHeatMap(
      commandCenterId,
      { timeRange, metric, granularity }
    );
    
    res.json({
      success: true,
      data: heatMap
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// ================================
// ANALYTICS OPERATIONS
// ================================

/**
 * Generate service analytics report
 * POST /api/service-command-center/analytics/generate
 */
router.post('/analytics/generate', async (req, res) => {
  try {
    const config = req.body;
    
    const analytics = await serviceAnalyticsService.generateServiceAnalytics(config);
    
    res.json({
      success: true,
      data: analytics,
      message: `${config.reportType} analytics generated with ${analytics.insights.length} insights`
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get Oracle EBS competitive comparison
 * GET /api/service-command-center/oracle-comparison
 */
router.get('/oracle-comparison', async (req, res) => {
  try {
    const comparison = await serviceAnalyticsService.generateOracleEBSServiceComparison();
    
    res.json({
      success: true,
      data: comparison,
      message: `Competitive advantage: +${comparison.overallRating.competitiveAdvantage.toFixed(1)} points`
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Generate predictive insights
 * POST /api/service-command-center/:commandCenterId/predictive-insights
 */
router.post('/:commandCenterId/predictive-insights', async (req, res) => {
  try {
    const { commandCenterId } = req.params;
    const { predictionHorizon } = req.body;
    
    const insights = await serviceAnalyticsService.generatePredictiveInsights(
      commandCenterId,
      predictionHorizon || 30
    );
    
    res.json({
      success: true,
      data: insights
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get performance benchmarks
 * GET /api/service-command-center/:commandCenterId/benchmarks
 */
router.get('/:commandCenterId/benchmarks', async (req, res) => {
  try {
    const { commandCenterId } = req.params;
    
    const benchmarks = await serviceAnalyticsService.generatePerformanceBenchmarks(commandCenterId);
    
    res.json({
      success: true,
      data: benchmarks,
      message: `Performance ranking: ${benchmarks.overallRanking.competitivePosition} (${benchmarks.overallRanking.percentile}th percentile)`
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// ================================
// MOBILE OPERATIONS
// ================================

/**
 * Initialize mobile command session
 * POST /api/service-command-center/mobile/initialize
 */
router.post('/mobile/initialize', async (req, res) => {
  try {
    const config = req.body;
    
    const session = await mobileCommandService.initializeMobileSession(config);
    
    res.json({
      success: true,
      data: session,
      message: `Mobile session initialized for ${config.deviceInfo.platform} device`
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get mobile command dashboard
 * GET /api/service-command-center/mobile/:sessionId/dashboard
 */
router.get('/mobile/:sessionId/dashboard', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const dashboard = await mobileCommandService.getMobileCommandDashboard(sessionId);
    
    res.json({
      success: true,
      data: dashboard
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Execute mobile emergency dispatch
 * POST /api/service-command-center/mobile/:sessionId/emergency-dispatch
 */
router.post('/mobile/:sessionId/emergency-dispatch', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const emergency = req.body;
    
    const dispatch = await mobileCommandService.executeEmergencyDispatch(sessionId, emergency);
    
    res.json({
      success: true,
      data: dispatch,
      message: `Emergency dispatch ${dispatch.dispatchId} initiated - ETA: ${dispatch.estimatedResponseTime} minutes`
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Update mobile location
 * PUT /api/service-command-center/mobile/:sessionId/location
 */
router.put('/mobile/:sessionId/location', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { location } = req.body;
    
    const update = await mobileCommandService.updateMobileLocation(sessionId, location);
    
    res.json({
      success: true,
      data: update,
      message: `Location updated - ${update.nearbyResources.length} nearby resources found`
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Enable mobile offline mode
 * POST /api/service-command-center/mobile/:sessionId/offline-mode
 */
router.post('/mobile/:sessionId/offline-mode', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const offlineMode = await mobileCommandService.enableOfflineMode(sessionId);
    
    res.json({
      success: true,
      data: offlineMode,
      message: `Offline mode enabled with ${offlineMode.offlineCapabilities.length} capabilities`
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

export default router;