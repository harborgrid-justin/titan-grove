/**
 * Production-Grade NAPI-RS Test Suite
 * Comprehensive testing for enhanced business logic and production features
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { productionManager } from '../src/modules/production/production-manager';
import {
  calculateRiskScore,
  determineRiskLevel,
  createRiskAssessment,
  calculateSixSigmaLevel,
  performSixSigmaAnalysis,
  calculateNetPresentValue,
  calculateIrr,
  calculateEOQ,
  performABCAnalysis,
  calculateSafetyStock,
  performMaintenancePriority,
  calculateEquipmentUptime,
  calculateStraightLineDepreciation,
  calculateDecliningBalanceDepreciation,
  analyzeAssetReplacement,
  calculateROA,
} from '../native';

// Extend Request interface for testing
declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
    }
  }
}

describe('Production-Grade NAPI-RS Enhancement Tests', () => {
  beforeAll(async () => {
    // Initialize production environment for testing
    await productionManager.initialize({
      logLevel: 'INFO',
      enableMetrics: true,
      enableTracing: true,
      maxRetryAttempts: 3,
      timeoutMs: 30000,
      circuitBreakerThreshold: 10,
      rateLimitPerMinute: 1000,
    });
  });

  afterAll(async () => {
    // Clean up test metrics
    await productionManager.clearMetrics();
  });

  beforeEach(async () => {
    // Clear metrics before each test for clean state
    await productionManager.clearMetrics();
  });

  describe('Production Manager Core Functionality', () => {
    test('should initialize production environment successfully', async () => {
      const config = await productionManager.getProductionConfig();
      
      expect(config).toBeDefined();
      expect(config.enableMetrics).toBe(true);
      expect(config.enableTracing).toBe(true);
      expect(config.logLevel).toBe('INFO');
    });

    test('should generate unique correlation IDs', () => {
      const id1 = productionManager.generateCorrelationId();
      const id2 = productionManager.generateCorrelationId();
      
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });

    test('should record and retrieve performance metrics', async () => {
      const correlationId = productionManager.generateCorrelationId();
      
      await productionManager.recordPerformanceMetric(
        'test_operation',
        'TEST_MODULE',
        100,
        correlationId
      );
      
      const metrics = await productionManager.getPerformanceMetrics(10);
      
      expect(metrics).toHaveLength(1);
      expect(metrics[0].operation).toBe('test_operation');
      expect(metrics[0].module).toBe('TEST_MODULE');
      expect(metrics[0].executionTimeMs).toBe(100);
      expect(metrics[0].correlationId).toBe(correlationId);
    });

    test('should record and retrieve business metrics', async () => {
      const correlationId = productionManager.generateCorrelationId();
      
      await productionManager.recordBusinessMetric(
        'revenue',
        50000,
        'USD',
        'FINANCIAL',
        ['quarterly', 'sales'],
        correlationId
      );
      
      const metrics = await productionManager.getBusinessMetrics(10);
      
      expect(metrics).toHaveLength(1);
      expect(metrics[0].metricName).toBe('revenue');
      expect(metrics[0].metricValue).toBe(50000);
      expect(metrics[0].metricUnit).toBe('USD');
      expect(metrics[0].module).toBe('FINANCIAL');
      expect(metrics[0].tags).toEqual(['quarterly', 'sales']);
    });

    test('should perform health checks', async () => {
      const healthStatus = await productionManager.performHealthCheck();
      
      expect(healthStatus).toBeDefined();
      expect(healthStatus.component).toBe('PRODUCTION_MANAGER');
      expect(healthStatus.status).toBe('HEALTHY');
      expect(healthStatus.responseTimeMs).toBeGreaterThan(0);
      expect(healthStatus.availabilityPercent).toBe(100);
    });

    test('should execute operations with monitoring', async () => {
      const testOperation = async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
        return { result: 'success', value: 42 };
      };

      const response = await productionManager.executeOperation(
        testOperation,
        'test_operation',
        'TEST_MODULE'
      );

      expect(response.success).toBe(true);
      expect(response.data).toEqual({ result: 'success', value: 42 });
      expect(response.executionTimeMs).toBeGreaterThan(40);
      expect(response.correlationId).toBeDefined();
    });
  });

  describe('Enhanced Risk Management with Production Features', () => {
    test('should create risk assessment with monitoring', async () => {
      const correlationId = productionManager.generateCorrelationId();
      
      const operation = async () => {
        return createRiskAssessment(
          'Supply Chain Disruption',
          'OPERATIONAL',
          'HIGH',
          'MAJOR',
          'Potential supply chain disruption due to geopolitical events',
          'Diversify suppliers across multiple regions'
        );
      };

      const response = await productionManager.executeOperation(
        operation,
        'create_risk_assessment',
        'RISK_MANAGEMENT',
        correlationId
      );

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data.assessmentName).toBe('Supply Chain Disruption');
      expect(response.data.riskCategory).toBe('OPERATIONAL');
      expect(response.correlationId).toBe(correlationId);
      expect(response.executionTimeMs).toBeGreaterThan(0);
    });

    test('should calculate risk scores with business metrics', async () => {
      const riskScore = calculateRiskScore(8, 7, 3);
      const riskLevel = determineRiskLevel(riskScore);
      
      // Record business metric
      await productionManager.recordBusinessMetric(
        'risk_score_calculated',
        riskScore,
        'score',
        'RISK_MANAGEMENT',
        ['high_risk']
      );
      
      expect(riskScore).toBeGreaterThan(0);
      expect(riskLevel).toBeDefined();
      expect(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).toContain(riskLevel);
      
      // Verify business metric was recorded
      const metrics = await productionManager.getBusinessMetrics(1);
      expect(metrics).toHaveLength(1);
      expect(metrics[0].metricName).toBe('risk_score_calculated');
      expect(metrics[0].metricValue).toBe(riskScore);
    });
  });

  describe('Enhanced Quality Management with Production Features', () => {
    test('should perform Six Sigma analysis with monitoring', async () => {
      const operation = async () => {
        return performSixSigmaAnalysis('Assembly Line A', 45, 10000, 5);
      };

      const response = await productionManager.executeOperation(
        operation,
        'six_sigma_analysis',
        'QUALITY_MANAGEMENT'
      );

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data.processName).toBe('Assembly Line A');
      expect(response.data.defectsPerMillionOpportunities).toBeDefined();
      expect(response.data.sigmaLevel).toBeGreaterThan(0);
      expect(response.data.processYield).toBeGreaterThan(0);
    });

    test('should calculate sigma levels accurately', () => {
      const testCases = [
        { dpmo: 3400, expectedSigmaApprox: 4.0 },
        { dpmo: 66800, expectedSigmaApprox: 3.0 },
        { dpmo: 233000, expectedSigmaApprox: 2.5 },
      ];

      testCases.forEach(({ dpmo, expectedSigmaApprox }) => {
        const sigmaLevel = calculateSixSigmaLevel(dpmo);
        expect(sigmaLevel).toBeCloseTo(expectedSigmaApprox, 0.5);
      });
    });
  });

  describe('Enhanced Financial Calculations with Production Features', () => {
    test('should calculate NPV with business metrics tracking', async () => {
      const cashFlows = [-10000, 3000, 4000, 5000, 6000];
      const discountRate = 10;
      
      const operation = async () => {
        const npv = calculateNetPresentValue(cashFlows, discountRate);
        
        // Record business metric
        await productionManager.recordBusinessMetric(
          'npv_calculated',
          npv,
          'USD',
          'FINANCIAL',
          ['investment_analysis']
        );
        
        return { npv, cashFlows, discountRate };
      };

      const response = await productionManager.executeOperation(
        operation,
        'calculate_npv',
        'FINANCIAL'
      );

      expect(response.success).toBe(true);
      expect(response.data.npv).toBeGreaterThan(0);
      expect(response.data.cashFlows).toEqual(cashFlows);
      
      // Verify business metric was recorded
      const metrics = await productionManager.getBusinessMetrics(1);
      expect(metrics).toHaveLength(1);
      expect(metrics[0].metricName).toBe('npv_calculated');
    });

    test('should calculate IRR with performance monitoring', async () => {
      const cashFlows = [-10000, 3000, 4000, 5000, 6000];
      
      const operation = async () => {
        return calculateIrr(cashFlows, 15);
      };

      const response = await productionManager.executeOperation(
        operation,
        'calculate_irr',
        'FINANCIAL'
      );

      expect(response.success).toBe(true);
      expect(response.data).toBeGreaterThan(0);
      expect(response.data).toBeLessThan(100); // Reasonable IRR range
      expect(response.executionTimeMs).toBeGreaterThan(0);
    });
  });

  describe('Enhanced Inventory Management with Production Features', () => {
    test('should calculate EOQ with optimization tracking', async () => {
      const operation = async () => {
        const eoq = calculateEOQ(12000, 50, 2);
        
        // Record business metric for inventory optimization
        await productionManager.recordBusinessMetric(
          'eoq_optimized',
          eoq,
          'units',
          'INVENTORY',
          ['optimization']
        );
        
        return eoq;
      };

      const response = await productionManager.executeOperation(
        operation,
        'calculate_eoq',
        'INVENTORY'
      );

      expect(response.success).toBe(true);
      expect(response.data).toBeGreaterThan(0);
      
      // Verify business metric was recorded
      const metrics = await productionManager.getBusinessMetrics(1);
      expect(metrics).toHaveLength(1);
      expect(metrics[0].metricName).toBe('eoq_optimized');
    });

    test('should perform ABC analysis with comprehensive monitoring', async () => {
      const items = ['Item A', 'Item B', 'Item C', 'Item D', 'Item E'];
      const values = [5000, 3000, 1500, 800, 200];
      
      const operation = async () => {
        return performABCAnalysis(items, values);
      };

      const response = await productionManager.executeOperation(
        operation,
        'abc_analysis',
        'INVENTORY'
      );

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data.length).toBe(items.length);
      
      // Verify classification logic
      const classifications = response.data.map((item: any) => item.classification);
      expect(classifications).toContain('A');
      expect(classifications).toContain('B');
      expect(classifications).toContain('C');
    });
  });

  describe('Enhanced Maintenance Management with Production Features', () => {
    test('should calculate maintenance priority with tracking', async () => {
      const operation = async () => {
        const priority = performMaintenancePriority('PUMP_001', 85, 65, 75);
        
        // Record business metric for maintenance optimization
        await productionManager.recordBusinessMetric(
          'maintenance_priority_calculated',
          priority.priorityScore,
          'score',
          'MAINTENANCE',
          ['preventive']
        );
        
        return priority;
      };

      const response = await productionManager.executeOperation(
        operation,
        'calculate_maintenance_priority',
        'MAINTENANCE'
      );

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data.equipmentId).toBe('PUMP_001');
      expect(response.data.priorityScore).toBeGreaterThan(0);
      expect(response.data.priorityLevel).toBeDefined();
    });

    test('should calculate equipment uptime accurately', () => {
      const uptime = calculateEquipmentUptime(8760, 168); // 8760 hours total, 168 hours downtime
      
      expect(uptime).toBeCloseTo(98.08, 1); // ~98% uptime
    });
  });

  describe('Enhanced Asset Management with Production Features', () => {
    test('should calculate depreciation with business tracking', async () => {
      const operation = async () => {
        const depreciation = calculateStraightLineDepreciation(100000, 10000, 10);
        
        // Record business metric for asset management
        await productionManager.recordBusinessMetric(
          'asset_depreciation_calculated',
          depreciation.annualDepreciation,
          'USD',
          'ASSET_MANAGEMENT',
          ['straight_line']
        );
        
        return depreciation;
      };

      const response = await productionManager.executeOperation(
        operation,
        'calculate_depreciation',
        'ASSET_MANAGEMENT'
      );

      expect(response.success).toBe(true);
      expect(response.data.annualDepreciation).toBe(9000);
      expect(response.data.monthlyDepreciation).toBe(750);
      expect(response.data.depreciationRate).toBe(9);
    });

    test('should calculate ROA with performance monitoring', async () => {
      const operation = async () => {
        return calculateROA(50000, 500000);
      };

      const response = await productionManager.executeOperation(
        operation,
        'calculate_roa',
        'ASSET_MANAGEMENT'
      );

      expect(response.success).toBe(true);
      expect(response.data).toBe(10); // 10% ROA
      expect(response.executionTimeMs).toBeGreaterThan(0);
    });
  });

  describe('System Monitoring and Health Checks', () => {
    test('should track system health across all components', async () => {
      // Simulate component health updates
      await productionManager.updateHealthStatus('RISK_MODULE', 'HEALTHY', 50, 0, 100);
      await productionManager.updateHealthStatus('QUALITY_MODULE', 'HEALTHY', 75, 2, 98);
      await productionManager.updateHealthStatus('FINANCIAL_MODULE', 'DEGRADED', 150, 5, 95);
      
      const healthStatus = await productionManager.getHealthStatus();
      
      expect(healthStatus).toHaveLength(4); // Including PRODUCTION_MANAGER
      expect(healthStatus.some(h => h.component === 'RISK_MODULE')).toBe(true);
      expect(healthStatus.some(h => h.component === 'QUALITY_MODULE')).toBe(true);
      expect(healthStatus.some(h => h.component === 'FINANCIAL_MODULE')).toBe(true);
    });

    test('should provide comprehensive system overview', async () => {
      // Record some test metrics
      await productionManager.recordPerformanceMetric('test_op', 'TEST', 100);
      await productionManager.recordBusinessMetric('test_metric', 50, 'count', 'TEST');
      
      const overview = await productionManager.getSystemOverview();
      
      expect(overview).toBeDefined();
      expect(overview.timestamp).toBeDefined();
      expect(overview.total_performance_metrics).toBeGreaterThan(0);
      expect(overview.total_business_metrics).toBeGreaterThan(0);
      expect(overview.config).toBeDefined();
    });
  });

  describe('Input Validation and Security', () => {
    test('should validate email addresses correctly', () => {
      expect(productionManager.validateInput('user@example.com', 'email')).toBe(true);
      expect(productionManager.validateInput('invalid-email', 'email')).toBe(false);
      expect(productionManager.validateInput('user@', 'email')).toBe(false);
    });

    test('should validate UUIDs correctly', () => {
      const validUuid = productionManager.generateCorrelationId();
      expect(productionManager.validateInput(validUuid, 'uuid')).toBe(true);
      expect(productionManager.validateInput('not-a-uuid', 'uuid')).toBe(false);
      expect(productionManager.validateInput('', 'uuid')).toBe(false);
    });

    test('should validate non-empty strings', () => {
      expect(productionManager.validateInput('valid string', 'non_empty')).toBe(true);
      expect(productionManager.validateInput('', 'non_empty')).toBe(false);
      expect(productionManager.validateInput('   ', 'non_empty')).toBe(false);
    });

    test('should sanitize input to prevent injection attacks', () => {
      const maliciousInput = '<script>alert("xss")</script>';
      const sanitized = productionManager.sanitizeInput(maliciousInput);
      
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('</script>');
      expect(sanitized).toContain('&lt;script&gt;');
    });
  });
});

describe('Integration Tests', () => {
  test('should handle end-to-end risk assessment workflow', async () => {
    const correlationId = productionManager.generateCorrelationId();
    
    // Step 1: Create risk assessment
    const assessment = await productionManager.executeOperation(
      () => createRiskAssessment(
        'Cybersecurity Threat',
        'TECHNOLOGY',
        'HIGH',
        'CRITICAL',
        'Potential cybersecurity breach',
        'Implement multi-factor authentication'
      ),
      'create_risk_assessment',
      'RISK_MANAGEMENT',
      correlationId
    );
    
    expect(assessment.success).toBe(true);
    
    // Step 2: Calculate risk score
    const riskScore = calculateRiskScore(9, 9, 2);
    
    // Step 3: Record business metrics
    await productionManager.recordBusinessMetric(
      'cybersecurity_risk_assessed',
      riskScore,
      'score',
      'RISK_MANAGEMENT',
      ['cybersecurity', 'critical'],
      correlationId
    );
    
    // Step 4: Verify metrics were recorded
    const metrics = await productionManager.getBusinessMetrics(10);
    const cyberMetric = metrics.find(m => m.metricName === 'cybersecurity_risk_assessed');
    
    expect(cyberMetric).toBeDefined();
    expect(cyberMetric?.correlationId).toBe(correlationId);
    expect(cyberMetric?.tags).toContain('cybersecurity');
  });

  test('should handle comprehensive financial analysis workflow', async () => {
    const correlationId = productionManager.generateCorrelationId();
    const cashFlows = [-100000, 25000, 30000, 35000, 40000, 20000];
    
    // Step 1: Calculate NPV
    const npvResponse = await productionManager.executeOperation(
      () => {
        const npv = calculateNetPresentValue(cashFlows, 12);
        return { npv, analysis: 'investment_project_a' };
      },
      'npv_analysis',
      'FINANCIAL',
      correlationId
    );
    
    expect(npvResponse.success).toBe(true);
    
    // Step 2: Calculate IRR
    const irrResponse = await productionManager.executeOperation(
      () => {
        const irr = calculateIrr(cashFlows, 15);
        return { irr, analysis: 'investment_project_a' };
      },
      'irr_analysis',
      'FINANCIAL',
      correlationId
    );
    
    expect(irrResponse.success).toBe(true);
    
    // Step 3: Record comprehensive business metrics
    await productionManager.recordBusinessMetric(
      'investment_analysis_completed',
      1,
      'count',
      'FINANCIAL',
      ['investment', 'npv', 'irr'],
      correlationId
    );
    
    // Step 4: Verify all operations used the same correlation ID
    const performanceMetrics = await productionManager.getPerformanceMetrics(10);
    const correlatedMetrics = performanceMetrics.filter(m => m.correlationId === correlationId);
    
    expect(correlatedMetrics.length).toBeGreaterThanOrEqual(2);
  });
});