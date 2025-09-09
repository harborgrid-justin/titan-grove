/**
 * Support API Routes
 * Backend API endpoints for all support management pages
 */

import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validation';
import { supportController } from './support-controller';
import type { Router as RouterType } from 'express';

const router: RouterType = Router();

// Apply authentication middleware to all support routes
router.use(authenticate);

// Support Operations Routes
router.get('/support-operations/support-desk-management', supportController.getSupportDeskManagement);
router.post('/support-operations/support-desk-management', validateRequest, supportController.createSupportDeskRecord);
router.put('/support-operations/support-desk-management/:id', validateRequest, supportController.updateSupportDeskRecord);
router.delete('/support-operations/support-desk-management/:id', supportController.deleteSupportDeskRecord);

router.get('/support-operations/ticket-lifecycle-management', supportController.getTicketLifecycleManagement);
router.post('/support-operations/ticket-lifecycle-management', validateRequest, supportController.createTicketLifecycleRecord);

router.get('/support-operations/multi-channel-support', supportController.getMultiChannelSupport);
router.post('/support-operations/multi-channel-support', validateRequest, supportController.createMultiChannelRecord);

router.get('/support-operations/escalation-management', supportController.getEscalationManagement);
router.post('/support-operations/escalation-management', validateRequest, supportController.createEscalationRecord);

router.get('/support-operations/support-team-collaboration', supportController.getSupportTeamCollaboration);
router.post('/support-operations/support-team-collaboration', validateRequest, supportController.createCollaborationRecord);

router.get('/support-operations/customer-communication', supportController.getCustomerCommunication);
router.post('/support-operations/customer-communication', validateRequest, supportController.createCommunicationRecord);

router.get('/support-operations/support-automation', supportController.getSupportAutomation);
router.post('/support-operations/support-automation', validateRequest, supportController.createAutomationRecord);

// Incident Management Routes
router.get('/incident-management/incident-tracking', supportController.getIncidentTracking);
router.post('/incident-management/incident-tracking', validateRequest, supportController.createIncident);

router.get('/incident-management/incident-classification', supportController.getIncidentClassification);
router.post('/incident-management/incident-classification', validateRequest, supportController.classifyIncident);

router.get('/incident-management/incident-response', supportController.getIncidentResponse);
router.post('/incident-management/incident-response', validateRequest, supportController.initiateIncidentResponse);

router.get('/incident-management/major-incident-management', supportController.getMajorIncidentManagement);
router.post('/incident-management/major-incident-management', validateRequest, supportController.createMajorIncident);

router.get('/incident-management/incident-resolution', supportController.getIncidentResolution);
router.post('/incident-management/incident-resolution', validateRequest, supportController.resolveIncident);

router.get('/incident-management/post-incident-review', supportController.getPostIncidentReview);
router.post('/incident-management/post-incident-review', validateRequest, supportController.createPostIncidentReview);

router.get('/incident-management/incident-analytics', supportController.getIncidentAnalytics);

// Problem Management Routes
router.get('/problem-management/problem-identification', supportController.getProblemIdentification);
router.post('/problem-management/problem-identification', validateRequest, supportController.identifyProblem);

router.get('/problem-management/root-cause-analysis', supportController.getRootCauseAnalysis);
router.post('/problem-management/root-cause-analysis', validateRequest, supportController.performRootCauseAnalysis);

router.get('/problem-management/problem-prioritization', supportController.getProblemPrioritization);
router.post('/problem-management/problem-prioritization', validateRequest, supportController.prioritizeProblem);

router.get('/problem-management/solution-development', supportController.getSolutionDevelopment);
router.post('/problem-management/solution-development', validateRequest, supportController.developSolution);

router.get('/problem-management/known-error-database', supportController.getKnownErrorDatabase);
router.post('/problem-management/known-error-database', validateRequest, supportController.addKnownError);

router.get('/problem-management/proactive-problem-management', supportController.getProactiveProblemManagement);
router.post('/problem-management/proactive-problem-management', validateRequest, supportController.createProactiveTask);

router.get('/problem-management/problem-analytics', supportController.getProblemAnalytics);

// Change Management Routes
router.get('/change-management/change-request-management', supportController.getChangeRequestManagement);
router.post('/change-management/change-request-management', validateRequest, supportController.createChangeRequest);

router.get('/change-management/change-advisory-board', supportController.getChangeAdvisoryBoard);
router.post('/change-management/change-advisory-board', validateRequest, supportController.scheduleCABMeeting);

router.get('/change-management/change-risk-assessment', supportController.getChangeRiskAssessment);
router.post('/change-management/change-risk-assessment', validateRequest, supportController.assessChangeRisk);

router.get('/change-management/change-implementation', supportController.getChangeImplementation);
router.post('/change-management/change-implementation', validateRequest, supportController.implementChange);

router.get('/change-management/emergency-changes', supportController.getEmergencyChanges);
router.post('/change-management/emergency-changes', validateRequest, supportController.createEmergencyChange);

router.get('/change-management/change-calendar', supportController.getChangeCalendar);
router.post('/change-management/change-calendar', validateRequest, supportController.scheduleChange);

router.get('/change-management/change-analytics', supportController.getChangeAnalytics);

// Knowledge Management Routes
router.get('/knowledge-management/knowledge-base-authoring', supportController.getKnowledgeBaseAuthoring);
router.post('/knowledge-management/knowledge-base-authoring', validateRequest, supportController.createKnowledgeArticle);

router.get('/knowledge-management/content-optimization', supportController.getContentOptimization);
router.post('/knowledge-management/content-optimization', validateRequest, supportController.optimizeContent);

router.get('/knowledge-management/knowledge-search', supportController.getKnowledgeSearch);
router.post('/knowledge-management/knowledge-search', validateRequest, supportController.searchKnowledge);

router.get('/knowledge-management/content-lifecycle', supportController.getContentLifecycle);
router.post('/knowledge-management/content-lifecycle', validateRequest, supportController.manageContentLifecycle);

router.get('/knowledge-management/expert-collaboration', supportController.getExpertCollaboration);
router.post('/knowledge-management/expert-collaboration', validateRequest, supportController.facilitateExpertCollaboration);

router.get('/knowledge-management/knowledge-analytics', supportController.getKnowledgeAnalytics);

router.get('/knowledge-management/ai-knowledge-assistant', supportController.getAIKnowledgeAssistant);
router.post('/knowledge-management/ai-knowledge-assistant', validateRequest, supportController.queryAIAssistant);

// Service Level Management Routes
router.get('/service-level-management/sla-definition', supportController.getSLADefinition);
router.post('/service-level-management/sla-definition', validateRequest, supportController.createSLA);

router.get('/service-level-management/sla-monitoring', supportController.getSLAMonitoring);
router.post('/service-level-management/sla-monitoring', validateRequest, supportController.startSLAMonitoring);

router.get('/service-level-management/performance-analytics', supportController.getPerformanceAnalytics);

router.get('/service-level-management/sla-reporting', supportController.getSLAReporting);
router.post('/service-level-management/sla-reporting', validateRequest, supportController.generateSLAReport);

router.get('/service-level-management/service-catalog', supportController.getServiceCatalog);
router.post('/service-level-management/service-catalog', validateRequest, supportController.addServiceToCatalog);

router.get('/service-level-management/capacity-management', supportController.getCapacityManagement);
router.post('/service-level-management/capacity-management', validateRequest, supportController.planCapacity);

router.get('/service-level-management/availability-management', supportController.getAvailabilityManagement);
router.post('/service-level-management/availability-management', validateRequest, supportController.manageAvailability);

// Support Analytics Routes
router.get('/support-analytics/support-dashboard', supportController.getSupportDashboard);

router.get('/support-analytics/agent-performance', supportController.getAgentPerformance);

router.get('/support-analytics/customer-satisfaction', supportController.getCustomerSatisfaction);
router.post('/support-analytics/customer-satisfaction', validateRequest, supportController.recordSatisfactionScore);

router.get('/support-analytics/operational-metrics', supportController.getOperationalMetrics);

router.get('/support-analytics/predictive-analytics', supportController.getPredictiveAnalytics);

router.get('/support-analytics/business-intelligence', supportController.getBusinessIntelligence);

router.get('/support-analytics/custom-reporting', supportController.getCustomReporting);
router.post('/support-analytics/custom-reporting', validateRequest, supportController.createCustomReport);

// Configuration endpoints
router.get('/config', supportController.getGlobalConfig);
router.put('/config', validateRequest, supportController.updateGlobalConfig);

router.get('/support-operations/config', supportController.getSupportOperationsConfig);
router.get('/incident-management/config', supportController.getIncidentManagementConfig);
router.get('/problem-management/config', supportController.getProblemManagementConfig);
router.get('/change-management/config', supportController.getChangeManagementConfig);
router.get('/knowledge-management/config', supportController.getKnowledgeManagementConfig);
router.get('/service-level-management/config', supportController.getServiceLevelManagementConfig);
router.get('/support-analytics/config', supportController.getSupportAnalyticsConfig);

// Analytics endpoints for each category
router.get('/support-operations/analytics', supportController.getSupportOperationsAnalytics);
router.get('/incident-management/analytics', supportController.getIncidentManagementAnalytics);
router.get('/problem-management/analytics', supportController.getProblemManagementAnalytics);
router.get('/change-management/analytics', supportController.getChangeManagementAnalytics);
router.get('/knowledge-management/analytics', supportController.getKnowledgeManagementAnalytics);
router.get('/service-level-management/analytics', supportController.getServiceLevelManagementAnalytics);
router.get('/support-analytics/analytics', supportController.getSupportAnalyticsAnalytics);

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'support-api',
        version: '1.0.0',
        pages: 49,
        categories: 7
    });
});

export { router as supportRoutes };