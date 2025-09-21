/**
 * Production-Grade Business Logic API Integration
 * Comprehensive REST API endpoints for enhanced NAPI-RS business functionality
 */

import express, { Request, Response, NextFunction } from 'express';
import {
  // Business Rules Engine
  evaluateBusinessRules,
  createFinancialApprovalRule,
  createInventoryReorderRule,
  createDynamicPricingRule,
  validateBusinessRule,
  calculateRulePerformanceMetrics,

  // Data Standardization
  standardizeBusinessData,
  createCustomerDataProfile,
  createFinancialTransactionProfile,
  generateDataQualityReport,
  applyAdvancedDataTransformations,

  // Advanced Workflow Management
  createFinancialApprovalWorkflow,
  createCustomerOnboardingWorkflow,
  startWorkflowInstance,
  completeWorkflowStep,
  calculateWorkflowAnalytics,
  getWorkflowsRequiringEscalation,
  // optimizeWorkflowPerformance, // Removed unused function

  // Enhanced Business Intelligence
  calculateAdvancedBusinessKpis,
  performPredictiveAnalysis,
  generateBusinessIntelligenceReport,
  detectBusinessAnomalies,
} from '../native.js';

const router = express.Router();

// Middleware for enhanced request validation and logging
router.use(async (req: Request, res: Response, next: NextFunction) => {
  // Add correlation ID for request tracking
  req.correlationId =
    (req.headers['x-correlation-id'] as string) ||
    `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Enhanced security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // API versioning support
  req.apiVersion = (req.headers['api-version'] as string) || 'v1';

  // Request logging with performance timing
  req.startTime = Date.now();
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.path} - Correlation ID: ${req.correlationId}`
  );

  next();
});

// ============================================================================
// BUSINESS RULES ENGINE API ENDPOINTS
// ============================================================================

router.post('/api/v1/business-rules/evaluate', async (req: Request, res: Response) => {
  try {
    const { rules, inputData } = req.body;

    if (!Array.isArray(rules) || !inputData || typeof inputData !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid request format. Expected rules array and inputData object.',
        correlationId: req.correlationId,
      });
    }

    const results = evaluateBusinessRules(rules, inputData);
    const performanceMetrics = calculateRulePerformanceMetrics(results);

    res.json({
      success: true,
      data: {
        evaluationResults: results,
        performanceMetrics,
        totalRulesEvaluated: results.length,
        executionTimeMs: Date.now() - req.startTime,
      },
      correlationId: req.correlationId,
    });
  } catch (error) {
    console.error(`Error evaluating business rules - ${req.correlationId}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to evaluate business rules',
      correlationId: req.correlationId,
    });
  }
});

router.post('/api/v1/business-rules/financial-approval', async (req: Request, res: Response) => {
  try {
    const { amountThreshold, approvalLevel, department } = req.body;

    if (!amountThreshold || !approvalLevel || !department) {
      return res.status(400).json({
        success: false,
        error: 'Required fields: amountThreshold, approvalLevel, department',
        correlationId: req.correlationId,
      });
    }

    const rule = createFinancialApprovalRule(amountThreshold, approvalLevel, department);
    const validationErrors = validateBusinessRule(rule);

    res.json({
      success: true,
      data: {
        rule,
        validationErrors,
        isValid: validationErrors.length === 0,
      },
      correlationId: req.correlationId,
    });
  } catch (error) {
    console.error(`Error creating financial approval rule - ${req.correlationId}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to create financial approval rule',
      correlationId: req.correlationId,
    });
  }
});

router.post('/api/v1/business-rules/inventory-reorder', async (req: Request, res: Response) => {
  try {
    const { minimumStockLevel, reorderQuantity, supplierLeadTimeDays } = req.body;

    const rule = createInventoryReorderRule(
      minimumStockLevel,
      reorderQuantity,
      supplierLeadTimeDays
    );

    res.json({
      success: true,
      data: { rule },
      correlationId: req.correlationId,
    });
  } catch (error) {
    console.error(`Error creating inventory reorder rule - ${req.correlationId}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to create inventory reorder rule',
      correlationId: req.correlationId,
    });
  }
});

router.post('/api/v1/business-rules/dynamic-pricing', async (req: Request, res: Response) => {
  try {
    const { basePrice, demandMultiplier, competitorPriceThreshold } = req.body;

    const rule = createDynamicPricingRule(basePrice, demandMultiplier, competitorPriceThreshold);

    res.json({
      success: true,
      data: { rule },
      correlationId: req.correlationId,
    });
  } catch (error) {
    console.error(`Error creating dynamic pricing rule - ${req.correlationId}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to create dynamic pricing rule',
      correlationId: req.correlationId,
    });
  }
});

// ============================================================================
// DATA STANDARDIZATION API ENDPOINTS
// ============================================================================

router.post('/api/v1/data/standardize', async (req: Request, res: Response) => {
  try {
    const { data, rules } = req.body;

    if (!data || !rules) {
      return res.status(400).json({
        success: false,
        error: 'Required fields: data, rules',
        correlationId: req.correlationId,
      });
    }

    const validationResults = standardizeBusinessData(data, rules);
    const qualityReport = generateDataQualityReport(validationResults);

    res.json({
      success: true,
      data: {
        validationResults,
        qualityReport,
        standardizedData: validationResults.reduce(
          (acc, result) => {
            acc[result.fieldName] = result.standardizedValue;
            return acc;
          },
          {} as Record<string, string>
        ),
      },
      correlationId: req.correlationId,
    });
  } catch (error) {
    console.error(`Error standardizing data - ${req.correlationId}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to standardize data',
      correlationId: req.correlationId,
    });
  }
});

router.get('/api/v1/data/profiles/customer', async (req: Request, res: Response) => {
  try {
    const profile = createCustomerDataProfile();

    res.json({
      success: true,
      data: { profile },
      correlationId: req.correlationId,
    });
  } catch (error) {
    console.error(`Error getting customer data profile - ${req.correlationId}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to get customer data profile',
      correlationId: req.correlationId,
    });
  }
});

router.get('/api/v1/data/profiles/financial-transaction', async (req: Request, res: Response) => {
  try {
    const profile = createFinancialTransactionProfile();

    res.json({
      success: true,
      data: { profile },
      correlationId: req.correlationId,
    });
  } catch (error) {
    console.error(`Error getting financial transaction profile - ${req.correlationId}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to get financial transaction profile',
      correlationId: req.correlationId,
    });
  }
});

router.post('/api/v1/data/transform', async (req: Request, res: Response) => {
  try {
    const { data, transformationType } = req.body;

    if (!data || !transformationType) {
      return res.status(400).json({
        success: false,
        error: 'Required fields: data, transformationType',
        correlationId: req.correlationId,
      });
    }

    const transformedData = applyAdvancedDataTransformations(data, transformationType);

    res.json({
      success: true,
      data: {
        originalData: data,
        transformedData,
        transformationType,
      },
      correlationId: req.correlationId,
    });
  } catch (error) {
    console.error(`Error transforming data - ${req.correlationId}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to transform data',
      correlationId: req.correlationId,
    });
  }
});

// ============================================================================
// ADVANCED WORKFLOW MANAGEMENT API ENDPOINTS
// ============================================================================

router.post('/api/v1/workflows/financial-approval', async (req: Request, res: Response) => {
  try {
    const { amountThreshold, department, approvalHierarchy } = req.body;

    const workflow = createFinancialApprovalWorkflow(
      amountThreshold,
      department,
      approvalHierarchy
    );

    res.json({
      success: true,
      data: { workflow },
      correlationId: req.correlationId,
    });
  } catch (error) {
    console.error(`Error creating financial approval workflow - ${req.correlationId}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to create financial approval workflow',
      correlationId: req.correlationId,
    });
  }
});

router.post('/api/v1/workflows/customer-onboarding', async (req: Request, res: Response) => {
  try {
    const workflow = createCustomerOnboardingWorkflow();

    res.json({
      success: true,
      data: { workflow },
      correlationId: req.correlationId,
    });
  } catch (error) {
    console.error(`Error creating customer onboarding workflow - ${req.correlationId}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to create customer onboarding workflow',
      correlationId: req.correlationId,
    });
  }
});

router.post('/api/v1/workflows/:workflowId/instances', async (req: Request, res: Response) => {
  try {
    const { workflowId } = req.params;
    const { initiatedBy, initialData } = req.body;

    if (!initiatedBy || !initialData) {
      return res.status(400).json({
        success: false,
        error: 'Required fields: initiatedBy, initialData',
        correlationId: req.correlationId,
      });
    }

    const instance = startWorkflowInstance(workflowId, initiatedBy, initialData);

    res.json({
      success: true,
      data: { instance },
      correlationId: req.correlationId,
    });
  } catch (error) {
    console.error(`Error starting workflow instance - ${req.correlationId}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to start workflow instance',
      correlationId: req.correlationId,
    });
  }
});

router.post(
  '/api/v1/workflows/instances/:instanceId/steps/:stepId/complete',
  async (req: Request, res: Response) => {
    try {
      const { instanceId, stepId } = req.params;
      const { assignedTo, decision, comments, instance } = req.body;
      
      console.log(`Completing step ${stepId} for instance ${instanceId}`);

      if (!assignedTo || !instance) {
        return res.status(400).json({
          success: false,
          error: 'Required fields: assignedTo, instance',
          correlationId: req.correlationId,
        });
      }

      const updatedInstance = completeWorkflowStep(
        instance,
        stepId,
        assignedTo,
        decision,
        comments
      );

      res.json({
        success: true,
        data: { instance: updatedInstance },
        correlationId: req.correlationId,
      });
    } catch (error) {
      console.error(`Error completing workflow step - ${req.correlationId}:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to complete workflow step',
        correlationId: req.correlationId,
      });
    }
  }
);

router.post('/api/v1/workflows/:workflowId/analytics', async (req: Request, res: Response) => {
  try {
    const { workflowId } = req.params;
    const { instances } = req.body;

    if (!Array.isArray(instances)) {
      return res.status(400).json({
        success: false,
        error: 'instances must be an array',
        correlationId: req.correlationId,
      });
    }

    const analytics = calculateWorkflowAnalytics(workflowId, instances);

    res.json({
      success: true,
      data: { analytics },
      correlationId: req.correlationId,
    });
  } catch (error) {
    console.error(`Error calculating workflow analytics - ${req.correlationId}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate workflow analytics',
      correlationId: req.correlationId,
    });
  }
});

router.get('/api/v1/workflows/escalations', async (req: Request, res: Response) => {
  try {
    const { instances, currentTime } = req.query;

    if (!instances || !currentTime) {
      return res.status(400).json({
        success: false,
        error: 'Required query parameters: instances, currentTime',
        correlationId: req.correlationId,
      });
    }

    const parsedInstances = JSON.parse(instances as string);
    const escalationWorkflows = getWorkflowsRequiringEscalation(
      parsedInstances,
      currentTime as string
    );

    res.json({
      success: true,
      data: {
        escalationWorkflows,
        totalEscalations: escalationWorkflows.length,
      },
      correlationId: req.correlationId,
    });
  } catch (error) {
    console.error(`Error getting workflow escalations - ${req.correlationId}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to get workflow escalations',
      correlationId: req.correlationId,
    });
  }
});

// ============================================================================
// ENHANCED BUSINESS INTELLIGENCE API ENDPOINTS
// ============================================================================

router.post('/api/v1/bi/kpis/calculate', async (req: Request, res: Response) => {
  try {
    const { revenueData, costData, customerData, employeeData } = req.body;

    if (!Array.isArray(revenueData) || !Array.isArray(costData)) {
      return res.status(400).json({
        success: false,
        error: 'revenueData and costData must be arrays',
        correlationId: req.correlationId,
      });
    }

    const dashboard = calculateAdvancedBusinessKpis(
      revenueData,
      costData,
      customerData || [],
      employeeData || []
    );

    res.json({
      success: true,
      data: { dashboard },
      correlationId: req.correlationId,
    });
  } catch (error) {
    console.error(`Error calculating business KPIs - ${req.correlationId}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate business KPIs',
      correlationId: req.correlationId,
    });
  }
});

router.post('/api/v1/bi/predictive-analysis', async (req: Request, res: Response) => {
  try {
    const { historicalData, metricName, predictionPeriods } = req.body;

    if (!Array.isArray(historicalData) || !metricName) {
      return res.status(400).json({
        success: false,
        error: 'Required fields: historicalData (array), metricName',
        correlationId: req.correlationId,
      });
    }

    const analysis = performPredictiveAnalysis(historicalData, metricName, predictionPeriods || 12);

    res.json({
      success: true,
      data: { analysis },
      correlationId: req.correlationId,
    });
  } catch (error) {
    console.error(`Error performing predictive analysis - ${req.correlationId}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to perform predictive analysis',
      correlationId: req.correlationId,
    });
  }
});

router.post('/api/v1/bi/reports/generate', async (req: Request, res: Response) => {
  try {
    const { metrics, periodStart, periodEnd, reportType } = req.body;

    if (!Array.isArray(metrics) || !periodStart || !periodEnd) {
      return res.status(400).json({
        success: false,
        error: 'Required fields: metrics (array), periodStart, periodEnd',
        correlationId: req.correlationId,
      });
    }

    const report = generateBusinessIntelligenceReport(
      metrics,
      periodStart,
      periodEnd,
      reportType || 'executive'
    );

    res.json({
      success: true,
      data: { report },
      correlationId: req.correlationId,
    });
  } catch (error) {
    console.error(`Error generating BI report - ${req.correlationId}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate business intelligence report',
      correlationId: req.correlationId,
    });
  }
});

router.post('/api/v1/bi/anomalies/detect', async (req: Request, res: Response) => {
  try {
    const { currentMetrics, historicalBaselines, sensitivity } = req.body;

    if (!Array.isArray(currentMetrics) || !Array.isArray(historicalBaselines)) {
      return res.status(400).json({
        success: false,
        error: 'currentMetrics and historicalBaselines must be arrays',
        correlationId: req.correlationId,
      });
    }

    const alerts = detectBusinessAnomalies(
      currentMetrics,
      historicalBaselines,
      sensitivity || 20.0
    );

    res.json({
      success: true,
      data: {
        alerts,
        anomaliesDetected: alerts.length,
        criticalAnomalies: alerts.filter((a) => a.severity === 'critical').length,
      },
      correlationId: req.correlationId,
    });
  } catch (error) {
    console.error(`Error detecting business anomalies - ${req.correlationId}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to detect business anomalies',
      correlationId: req.correlationId,
    });
  }
});

// ============================================================================
// HEALTH CHECK AND STATUS ENDPOINTS
// ============================================================================

router.get('/api/v1/health', async (req: Request, res: Response) => {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        businessRulesEngine: 'operational',
        dataStandardization: 'operational',
        workflowManagement: 'operational',
        businessIntelligence: 'operational',
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      correlationId: req.correlationId,
    };

    res.json(healthStatus);
  } catch (error) {
    console.error(`Health check error - ${req.correlationId}:`, error);
    res.status(503).json({
      status: 'unhealthy',
      error: 'Service health check failed',
      correlationId: req.correlationId,
    });
  }
});

// Error handling middleware
router.use((error: any, req: Request, res: Response, _next: NextFunction) => {
  console.error(`Unhandled error - ${req.correlationId}:`, error);

  res.status(500).json({
    success: false,
    error: 'An unexpected error occurred',
    correlationId: req.correlationId,
    timestamp: new Date().toISOString(),
  });
});

// Add TypeScript interface extensions
declare global {
  namespace Express {
    interface Request {
      correlationId: string;
      apiVersion: string;
      startTime: number;
    }
  }
}

export default router;
