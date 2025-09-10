/**
 * Production-Grade API Routes for NAPI-RS Enhanced Business Suite
 * Provides comprehensive REST API endpoints with monitoring and error handling
 */

import express, { Request, Response, NextFunction } from 'express';
import { productionManager, withProductionLogging, ServiceResponse } from '../modules/production/production-manager';

// Import enhanced NAPI-RS modules
import {
  calculateRiskScore,
  determineRiskLevel,
  createRiskAssessment,
  calculateSixSigmaLevel,
  performSixSigmaAnalysis,
  calculateNetPresentValue,
  calculateIrr,
  calculateCompoundInterest,
  calculatePresentValue,
  calculateEOQ,
  performABCAnalysis,
  calculateSafetyStock,
  performMaintenancePriority,
  calculateEquipmentUptime,
  optimizeMaintenanceSchedule,
  calculateStraightLineDepreciation,
  calculateDecliningBalanceDepreciation,
  analyzeAssetReplacement,
  calculateROA,
} from '../native';

const router = express.Router();

// Middleware for request correlation and logging
router.use(async (req: Request, res: Response, next: NextFunction) => {
  const correlationId = req.headers['x-correlation-id'] as string || productionManager.generateCorrelationId();
  req.correlationId = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);
  
  await productionManager.logInfo('API_GATEWAY', `${req.method} ${req.path}`, correlationId);
  next();
});

// Risk Management API Endpoints
router.post('/api/risk/assessment', async (req: Request, res: Response) => {
  const operation = withProductionLogging(
    async () => {
      const { assessmentName, riskCategory, likelihood, impact, description, mitigation } = req.body;
      
      // Input validation
      if (!assessmentName || !riskCategory || !likelihood || !impact) {
        throw new Error('Missing required fields: assessmentName, riskCategory, likelihood, impact');
      }
      
      // Sanitize inputs
      const sanitizedName = productionManager.sanitizeInput(assessmentName);
      const sanitizedCategory = productionManager.sanitizeInput(riskCategory);
      
      // Create risk assessment using native NAPI-RS function
      const assessment = createRiskAssessment(
        sanitizedName,
        sanitizedCategory,
        likelihood,
        impact,
        description || '',
        mitigation || ''
      );
      
      // Record business metrics
      await productionManager.recordBusinessMetric(
        'risk_assessments_created',
        1,
        'count',
        'RISK_MANAGEMENT',
        [riskCategory, likelihood, impact],
        req.correlationId
      );
      
      return assessment;
    },
    'RISK_MANAGEMENT',
    'create_risk_assessment'
  );
  
  const result = await operation();
  res.status(result.success ? 200 : 500).json(result);
});

router.post('/api/risk/score', async (req: Request, res: Response) => {
  const operation = withProductionLogging(
    async () => {
      const { likelihood, impact, mitigation } = req.body;
      
      if (typeof likelihood !== 'number' || typeof impact !== 'number') {
        throw new Error('Likelihood and impact must be numbers');
      }
      
      const riskScore = calculateRiskScore(likelihood, impact, mitigation || 0);
      const riskLevel = determineRiskLevel(riskScore);
      
      return { riskScore, riskLevel };
    },
    'RISK_MANAGEMENT',
    'calculate_risk_score'
  );
  
  const result = await operation();
  res.status(result.success ? 200 : 500).json(result);
});

// Quality Management API Endpoints
router.post('/api/quality/six-sigma/analysis', async (req: Request, res: Response) => {
  const operation = withProductionLogging(
    async () => {
      const { processName, defects, units, opportunities } = req.body;
      
      if (!processName || typeof defects !== 'number' || typeof units !== 'number' || typeof opportunities !== 'number') {
        throw new Error('Missing or invalid required fields');
      }
      
      const sanitizedProcessName = productionManager.sanitizeInput(processName);
      const analysis = performSixSigmaAnalysis(sanitizedProcessName, defects, units, opportunities);
      
      // Record business metrics
      await productionManager.recordBusinessMetric(
        'six_sigma_analyses',
        1,
        'count',
        'QUALITY_MANAGEMENT',
        ['six_sigma'],
        req.correlationId
      );
      
      return analysis;
    },
    'QUALITY_MANAGEMENT',
    'six_sigma_analysis'
  );
  
  const result = await operation();
  res.status(result.success ? 200 : 500).json(result);
});

router.get('/api/quality/sigma-level/:dpmo', async (req: Request, res: Response) => {
  const operation = withProductionLogging(
    async () => {
      const dpmo = parseInt(req.params.dpmo);
      
      if (isNaN(dpmo) || dpmo < 0) {
        throw new Error('DPMO must be a non-negative number');
      }
      
      const sigmaLevel = calculateSixSigmaLevel(dpmo);
      return { dpmo, sigmaLevel };
    },
    'QUALITY_MANAGEMENT',
    'calculate_sigma_level'
  );
  
  const result = await operation();
  res.status(result.success ? 200 : 500).json(result);
});

// Financial Calculations API Endpoints
router.post('/api/financial/npv', async (req: Request, res: Response) => {
  const operation = withProductionLogging(
    async () => {
      const { cashFlows, discountRate } = req.body;
      
      if (!Array.isArray(cashFlows) || typeof discountRate !== 'number') {
        throw new Error('Invalid cash flows or discount rate');
      }
      
      const npv = calculateNetPresentValue(cashFlows, discountRate);
      
      // Record business metrics
      await productionManager.recordBusinessMetric(
        'npv_calculations',
        npv,
        'currency',
        'FINANCIAL',
        ['npv'],
        req.correlationId
      );
      
      return { npv, cashFlows, discountRate };
    },
    'FINANCIAL',
    'calculate_npv'
  );
  
  const result = await operation();
  res.status(result.success ? 200 : 500).json(result);
});

router.post('/api/financial/irr', async (req: Request, res: Response) => {
  const operation = withProductionLogging(
    async () => {
      const { cashFlows, initialGuess } = req.body;
      
      if (!Array.isArray(cashFlows)) {
        throw new Error('Cash flows must be an array');
      }
      
      const irr = calculateIrr(cashFlows, initialGuess || 10);
      
      // Record business metrics
      await productionManager.recordBusinessMetric(
        'irr_calculations',
        irr,
        'percentage',
        'FINANCIAL',
        ['irr'],
        req.correlationId
      );
      
      return { irr, cashFlows };
    },
    'FINANCIAL',
    'calculate_irr'
  );
  
  const result = await operation();
  res.status(result.success ? 200 : 500).json(result);
});

// Inventory Management API Endpoints
router.post('/api/inventory/eoq', async (req: Request, res: Response) => {
  const operation = withProductionLogging(
    async () => {
      const { annualDemand, orderingCost, holdingCost } = req.body;
      
      if (typeof annualDemand !== 'number' || typeof orderingCost !== 'number' || typeof holdingCost !== 'number') {
        throw new Error('All parameters must be numbers');
      }
      
      const eoq = calculateEOQ(annualDemand, orderingCost, holdingCost);
      
      // Record business metrics
      await productionManager.recordBusinessMetric(
        'eoq_calculations',
        eoq,
        'units',
        'INVENTORY',
        ['eoq'],
        req.correlationId
      );
      
      return { eoq, annualDemand, orderingCost, holdingCost };
    },
    'INVENTORY',
    'calculate_eoq'
  );
  
  const result = await operation();
  res.status(result.success ? 200 : 500).json(result);
});

router.post('/api/inventory/abc-analysis', async (req: Request, res: Response) => {
  const operation = withProductionLogging(
    async () => {
      const { items, values } = req.body;
      
      if (!Array.isArray(items) || !Array.isArray(values) || items.length !== values.length) {
        throw new Error('Items and values must be arrays of equal length');
      }
      
      const analysis = performABCAnalysis(items, values);
      
      // Record business metrics
      await productionManager.recordBusinessMetric(
        'abc_analyses',
        items.length,
        'items',
        'INVENTORY',
        ['abc_analysis'],
        req.correlationId
      );
      
      return analysis;
    },
    'INVENTORY',
    'abc_analysis'
  );
  
  const result = await operation();
  res.status(result.success ? 200 : 500).json(result);
});

// Maintenance Management API Endpoints
router.post('/api/maintenance/priority', async (req: Request, res: Response) => {
  const operation = withProductionLogging(
    async () => {
      const { equipmentId, criticalityScore, conditionScore, riskScore } = req.body;
      
      if (!equipmentId || typeof criticalityScore !== 'number' || typeof conditionScore !== 'number' || typeof riskScore !== 'number') {
        throw new Error('Missing required fields or invalid types');
      }
      
      const sanitizedEquipmentId = productionManager.sanitizeInput(equipmentId);
      const priority = performMaintenancePriority(sanitizedEquipmentId, criticalityScore, conditionScore, riskScore);
      
      // Record business metrics
      await productionManager.recordBusinessMetric(
        'maintenance_priorities',
        priority.priorityScore,
        'score',
        'MAINTENANCE',
        ['priority'],
        req.correlationId
      );
      
      return priority;
    },
    'MAINTENANCE',
    'calculate_priority'
  );
  
  const result = await operation();
  res.status(result.success ? 200 : 500).json(result);
});

// Asset Management API Endpoints
router.post('/api/assets/depreciation/straight-line', async (req: Request, res: Response) => {
  const operation = withProductionLogging(
    async () => {
      const { assetCost, salvageValue, usefulLife } = req.body;
      
      if (typeof assetCost !== 'number' || typeof salvageValue !== 'number' || typeof usefulLife !== 'number') {
        throw new Error('All parameters must be numbers');
      }
      
      const depreciation = calculateStraightLineDepreciation(assetCost, salvageValue, usefulLife);
      
      // Record business metrics
      await productionManager.recordBusinessMetric(
        'depreciation_calculations',
        depreciation.annualDepreciation,
        'currency',
        'ASSET_MANAGEMENT',
        ['straight_line'],
        req.correlationId
      );
      
      return depreciation;
    },
    'ASSET_MANAGEMENT',
    'straight_line_depreciation'
  );
  
  const result = await operation();
  res.status(result.success ? 200 : 500).json(result);
});

// System Health and Monitoring Endpoints
router.get('/api/system/health', async (req: Request, res: Response) => {
  const operation = withProductionLogging(
    async () => {
      const healthStatus = await productionManager.getHealthStatus();
      const systemOverview = await productionManager.getSystemOverview();
      
      return {
        status: 'OPERATIONAL',
        components: healthStatus,
        overview: systemOverview,
        timestamp: new Date().toISOString(),
      };
    },
    'SYSTEM',
    'health_check'
  );
  
  const result = await operation();
  res.status(result.success ? 200 : 500).json(result);
});

router.get('/api/system/metrics/performance', async (req: Request, res: Response) => {
  const operation = withProductionLogging(
    async () => {
      const limit = parseInt(req.query.limit as string) || 100;
      const metrics = await productionManager.getPerformanceMetrics(limit);
      
      return {
        metrics,
        count: metrics.length,
        timestamp: new Date().toISOString(),
      };
    },
    'SYSTEM',
    'get_performance_metrics'
  );
  
  const result = await operation();
  res.status(result.success ? 200 : 500).json(result);
});

router.get('/api/system/metrics/business', async (req: Request, res: Response) => {
  const operation = withProductionLogging(
    async () => {
      const limit = parseInt(req.query.limit as string) || 100;
      const metrics = await productionManager.getBusinessMetrics(limit);
      
      return {
        metrics,
        count: metrics.length,
        timestamp: new Date().toISOString(),
      };
    },
    'SYSTEM',
    'get_business_metrics'
  );
  
  const result = await operation();
  res.status(result.success ? 200 : 500).json(result);
});

// Configuration Management
router.get('/api/system/config', async (req: Request, res: Response) => {
  const operation = withProductionLogging(
    async () => {
      const config = await productionManager.getProductionConfig();
      return config;
    },
    'SYSTEM',
    'get_config'
  );
  
  const result = await operation();
  res.status(result.success ? 200 : 500).json(result);
});

router.put('/api/system/config', async (req: Request, res: Response) => {
  const operation = withProductionLogging(
    async () => {
      const success = await productionManager.updateProductionConfig(req.body);
      
      if (!success) {
        throw new Error('Failed to update configuration');
      }
      
      return { success: true, message: 'Configuration updated successfully' };
    },
    'SYSTEM',
    'update_config'
  );
  
  const result = await operation();
  res.status(result.success ? 200 : 500).json(result);
});

// Error handling middleware
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  productionManager.logError('API_GATEWAY', err.message, req.correlationId);
  
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
      module: 'API_GATEWAY',
      timestamp: new Date().toISOString(),
      correlationId: req.correlationId,
    },
  });
});

export default router;