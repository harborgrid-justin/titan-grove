/**
 * Production-Grade NAPI-RS Enhancement Tests
 * Comprehensive testing for all production features and integrations
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach, jest } from '@jest/globals';
import { 
  evaluateBusinessRule,
  evaluateMultipleRules,
  validateBusinessRule,
  createStandardBusinessRules,
  standardizeDataRecord,
  validateEmail,
  validatePhoneNumber,
  standardizeAddress,
  validateCurrencyAmount,
  generateDataQualityReport,
  calculateCompoundInterest,
  calculateNetPresentValue,
  calculateEconomicOrderQuantity,
  calculateWeightedAverageCostOfCapital,
  calculateValueAtRisk,
  calculateSharpeRatio,
  calculateBeta
} from '../native';

import { ProductionIntegrationService } from '../src/services/production-integration-service';
import { ServiceIntegrationContext } from '../src/shared/interfaces/service-integration';

describe('Production-Grade Business Rules Engine', () => {
  let integrationService: ProductionIntegrationService;
  let testContext: ServiceIntegrationContext;

  beforeAll(async () => {
    integrationService = new ProductionIntegrationService();
    testContext = {
      userId: 'test_user_001',
      sessionId: 'test_session_001',
      permissions: ['read', 'write', 'calculate'],
      correlationId: 'test_corr_001',
      requestTimestamp: new Date(),
    };
  });

  afterAll(async () => {
    // Cleanup
  });

  describe('Business Rules Engine', () => {
    test('should evaluate single business rule successfully', () => {
      const rule = {
        id: 'TEST_RULE_001',
        name: 'Test Rule',
        description: 'Test rule for validation',
        category: 'Test',
        rule_type: 'validation',
        conditions: [
          {
            field: 'amount',
            operator: 'greater_than',
            value: '1000',
            data_type: 'number',
          }
        ],
        actions: [
          {
            action_type: 'create_task',
            target: 'manager',
            value: 'Review large amount',
            parameters: {},
          }
        ],
        priority: 100,
        enabled: true,
        effective_date: '2024-01-01',
        expiry_date: null,
      };

      const context = {
        entity_type: 'transaction',
        entity_id: 'txn_001',
        data: { amount: '5000' },
        user_id: 'user_001',
        timestamp: new Date().toISOString(),
      };

      const result = evaluateBusinessRule(rule, context);

      expect(result.rule_id).toBe('TEST_RULE_001');
      expect(result.matched).toBe(true);
      expect(result.executed_actions).toHaveLength(1);
      expect(result.errors).toHaveLength(0);
      expect(result.execution_time_ms).toBeGreaterThan(0);
    });

    test('should validate business rule structure', () => {
      const invalidRule = {
        id: '',
        name: '',
        description: 'Invalid rule',
        category: 'Test',
        rule_type: 'validation',
        conditions: [],
        actions: [],
        priority: 100,
        enabled: true,
        effective_date: '2024-01-01',
        expiry_date: null,
      };

      const errors = validateBusinessRule(invalidRule);

      expect(errors).toContain('Rule ID cannot be empty');
      expect(errors).toContain('Rule name cannot be empty');
      expect(errors).toContain('Rule must have at least one condition');
      expect(errors).toContain('Rule must have at least one action');
    });

    test('should create standard business rules', () => {
      const standardRules = createStandardBusinessRules();

      expect(standardRules).toHaveLength(3);
      expect(standardRules[0].id).toBe('INVOICE_APPROVAL_001');
      expect(standardRules[1].id).toBe('INVENTORY_REORDER_001');
      expect(standardRules[2].id).toBe('CREDIT_LIMIT_001');
    });

    test('should evaluate multiple rules in priority order', () => {
      const rules = createStandardBusinessRules();
      const context = {
        entity_type: 'order',
        entity_id: 'ord_001',
        data: { 
          order_total: '15000',
          available_credit: '10000',
          current_stock: '5',
          reorder_point: '10'
        },
        user_id: 'user_001',
        timestamp: new Date().toISOString(),
      };

      const results = evaluateMultipleRules(rules, context);

      expect(results).toHaveLength(3);
      // Results should be sorted by priority (higher first)
      expect(results[0].rule_id).toBe('INVOICE_APPROVAL_001'); // priority 100
      expect(results[1].rule_id).toBe('CREDIT_LIMIT_001'); // priority 95
      expect(results[2].rule_id).toBe('INVENTORY_REORDER_001'); // priority 90
    });
  });

  describe('Data Standardization Engine', () => {
    test('should standardize customer data', () => {
      const customerData = {
        email: 'TEST@EXAMPLE.COM',
        phone: '(555) 123-4567',
        name: 'john doe',
        address: '123 Main Street Suite 100'
      };

      const rules = [
        {
          field_name: 'email',
          rule_type: 'validate',
          pattern: null,
          transformation: 'lowercase',
          validation_rules: ['required', 'email'],
          default_value: null,
          allowed_values: [],
          min_length: null,
          max_length: null,
          min_value: null,
          max_value: null,
        },
        {
          field_name: 'name',
          rule_type: 'format',
          pattern: null,
          transformation: 'title_case',
          validation_rules: ['required'],
          default_value: null,
          allowed_values: [],
          min_length: 2,
          max_length: 100,
          min_value: null,
          max_value: null,
        }
      ];

      const results = standardizeDataRecord(customerData, rules);

      expect(results).toHaveLength(2);
      
      const emailResult = results.find(r => r.field_name === 'email');
      expect(emailResult?.is_valid).toBe(true);
      expect(emailResult?.standardized_value).toBe('test@example.com');
      
      const nameResult = results.find(r => r.field_name === 'name');
      expect(nameResult?.is_valid).toBe(true);
      expect(nameResult?.standardized_value).toBe('John Doe');
    });

    test('should validate email addresses', () => {
      const validResult = validateEmail('test@example.com');
      expect(validResult.is_valid).toBe(true);
      expect(validResult.standardized_value).toBe('test@example.com');

      const invalidResult = validateEmail('invalid-email');
      expect(invalidResult.is_valid).toBe(false);
      expect(invalidResult.errors).toContain('Invalid email format');
    });

    test('should validate and format phone numbers', () => {
      const phoneResult = validatePhoneNumber('(555) 123-4567');
      expect(phoneResult.is_valid).toBe(true);
      expect(phoneResult.standardized_value).toBe('(555) 123-4567');

      const internationalResult = validatePhoneNumber('1-555-123-4567');
      expect(internationalResult.is_valid).toBe(true);
      expect(internationalResult.standardized_value).toBe('+1 (555) 123-4567');
    });

    test('should standardize addresses', () => {
      const addressResult = standardizeAddress('123 Main Street Suite 100');
      expect(addressResult.is_valid).toBe(true);
      expect(addressResult.standardized_value).toBe('123 MAIN ST STE 100');
    });

    test('should validate currency amounts', () => {
      const validResult = validateCurrencyAmount('$1,234.56');
      expect(validResult.is_valid).toBe(true);
      expect(validResult.standardized_value).toBe('1234.56');

      const invalidResult = validateCurrencyAmount('not-a-number');
      expect(invalidResult.is_valid).toBe(false);
    });

    test('should generate data quality report', () => {
      const validationResults = [
        {
          field_name: 'email',
          is_valid: true,
          original_value: 'test@example.com',
          standardized_value: 'test@example.com',
          errors: [],
          warnings: [],
          transformations_applied: ['lowercase'],
        },
        {
          field_name: 'phone',
          is_valid: false,
          original_value: 'invalid-phone',
          standardized_value: 'invalid-phone',
          errors: ['Invalid phone number format'],
          warnings: [],
          transformations_applied: [],
        }
      ];

      const report = generateDataQualityReport(validationResults);

      expect(report.total_records).toBe(2);
      expect(report.valid_records).toBe(1);
      expect(report.invalid_records).toBe(1);
      expect(report.data_quality_score).toBe(50.0);
      expect(report.field_quality_scores.email).toBe(100.0);
      expect(report.field_quality_scores.phone).toBe(0.0);
    });
  });

  describe('Advanced Financial Calculations', () => {
    test('should calculate compound interest', () => {
      const result = calculateCompoundInterest(1000, 5, 12, 1);
      expect(result).toBeCloseTo(1051.16, 2);
    });

    test('should calculate net present value', () => {
      const cashFlows = [-1000, 300, 400, 500, 600];
      const result = calculateNetPresentValue(cashFlows, 10);
      expect(result).toBeGreaterThan(0);
    });

    test('should calculate economic order quantity', () => {
      const result = calculateEconomicOrderQuantity(1000, 50, 2);
      expect(result).toBeCloseTo(223.61, 2);
    });

    test('should calculate weighted average cost of capital', () => {
      const result = calculateWeightedAverageCostOfCapital(60, 12, 40, 8, 30);
      expect(result).toBeCloseTo(9.44, 2);
    });

    test('should calculate value at risk', () => {
      const result = calculateValueAtRisk(1000000, 95, 0.15, 1);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(200000);
    });

    test('should calculate Sharpe ratio', () => {
      const result = calculateSharpeRatio(15, 3, 10);
      expect(result).toBe(1.2);
    });

    test('should calculate beta', () => {
      const assetReturns = [0.1, 0.15, -0.05, 0.2, 0.08];
      const marketReturns = [0.08, 0.12, -0.03, 0.15, 0.06];
      const result = calculateBeta(assetReturns, marketReturns);
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('Production Integration Service', () => {
    test('should process business data through complete pipeline', async () => {
      const request = {
        data: {
          entityType: 'customer',
          entityId: 'cust_001',
          data: {
            email: 'TEST@EXAMPLE.COM',
            phone: '5551234567',
            name: 'john doe'
          }
        },
        correlationId: 'test_001',
        timestamp: new Date(),
      };

      const result = await integrationService.processBusinessData(request, testContext);

      expect(result.success).toBe(true);
      expect(result.data?.processId).toBe('test_001');
      expect(result.data?.results).toHaveLength(4);
      expect(result.data?.executionMetrics.totalTime).toBeGreaterThan(0);
    });

    test('should perform health check', async () => {
      const healthResult = await integrationService.healthCheck();

      expect(healthResult.success).toBe(true);
      expect(healthResult.data?.status).toBe('healthy');
      expect(healthResult.data?.nativeModules).toBe('operational');
      expect(typeof healthResult.data?.testCalculation).toBe('number');
    });

    test('should handle processing errors gracefully', async () => {
      const invalidRequest = {
        data: null, // Invalid data
        correlationId: 'error_test',
        timestamp: new Date(),
      };

      const result = await integrationService.processBusinessData(invalidRequest, testContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('BUSINESS_PROCESS_ERROR');
      expect(result.correlationId).toBe('error_test');
    });
  });

  describe('Performance and Scalability', () => {
    test('should handle large datasets efficiently', () => {
      const startTime = Date.now();
      
      // Generate large dataset
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        field_name: `field_${i}`,
        is_valid: i % 10 !== 0, // 90% valid
        original_value: `value_${i}`,
        standardized_value: `standardized_value_${i}`,
        errors: i % 10 === 0 ? [`Error in field ${i}`] : [],
        warnings: [],
        transformations_applied: ['test_transformation'],
      }));

      const report = generateDataQualityReport(largeDataset);
      const executionTime = Date.now() - startTime;

      expect(report.total_records).toBe(1000);
      expect(report.valid_records).toBe(900);
      expect(report.data_quality_score).toBe(90.0);
      expect(executionTime).toBeLessThan(1000); // Should complete in under 1 second
    });

    test('should handle complex business rule evaluation efficiently', () => {
      const startTime = Date.now();
      
      const rules = createStandardBusinessRules();
      const context = {
        entity_type: 'complex_entity',
        entity_id: 'entity_001',
        data: { 
          amount: '50000',
          category: 'high_value',
          region: 'US',
          customer_type: 'enterprise'
        },
        user_id: 'user_001',
        timestamp: new Date().toISOString(),
      };

      // Execute multiple times to test performance
      for (let i = 0; i < 100; i++) {
        evaluateMultipleRules(rules, context);
      }

      const executionTime = Date.now() - startTime;
      expect(executionTime).toBeLessThan(5000); // Should complete 100 evaluations in under 5 seconds
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle invalid rule conditions', () => {
      const rule = {
        id: 'INVALID_RULE',
        name: 'Invalid Rule',
        description: 'Rule with invalid condition',
        category: 'Test',
        rule_type: 'validation',
        conditions: [
          {
            field: 'amount',
            operator: 'invalid_operator',
            value: '1000',
            data_type: 'number',
          }
        ],
        actions: [
          {
            action_type: 'log_event',
            target: 'system',
            value: 'Invalid condition detected',
            parameters: {},
          }
        ],
        priority: 100,
        enabled: true,
        effective_date: '2024-01-01',
        expiry_date: null,
      };

      const context = {
        entity_type: 'test',
        entity_id: 'test_001',
        data: { amount: '1500' },
        user_id: 'user_001',
        timestamp: new Date().toISOString(),
      };

      const result = evaluateBusinessRule(rule, context);
      expect(result.matched).toBe(false); // Should not match due to invalid operator
    });

    test('should handle missing data fields gracefully', () => {
      const customerData = {
        email: 'test@example.com',
        // Missing phone and name fields
      };

      const rules = [
        {
          field_name: 'phone',
          rule_type: 'validate',
          pattern: null,
          transformation: null,
          validation_rules: ['required'],
          default_value: null,
          allowed_values: [],
          min_length: null,
          max_length: null,
          min_value: null,
          max_value: null,
        }
      ];

      const results = standardizeDataRecord(customerData, rules);
      expect(results).toHaveLength(1);
      
      const phoneResult = results.find(r => r.field_name === 'phone');
      expect(phoneResult?.is_valid).toBe(false);
      expect(phoneResult?.errors).toContain('Field is required but missing');
    });

    test('should handle division by zero in financial calculations', () => {
      expect(() => calculateSharpeRatio(10, 5, 0)).not.toThrow();
      const result = calculateSharpeRatio(10, 5, 0);
      expect(result).toBe(0); // Should return 0 instead of infinity
    });
  });

  describe('Integration and API Compatibility', () => {
    test('should maintain backward compatibility with existing APIs', () => {
      // Test that existing API contracts are maintained
      const legacyCalculation = calculateCompoundInterest(1000, 5, 12, 1);
      expect(typeof legacyCalculation).toBe('number');
      expect(legacyCalculation).toBeGreaterThan(1000);
    });

    test('should provide consistent error response format', async () => {
      const invalidRequest = {
        data: { entityType: 'unknown' },
        correlationId: 'consistency_test',
        timestamp: new Date(),
      };

      const result = await integrationService.processBusinessData(invalidRequest, testContext);

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('correlationId');
      if (!result.success) {
        expect(result).toHaveProperty('error');
        expect(result.error).toHaveProperty('code');
        expect(result.error).toHaveProperty('message');
      }
    });
  });

  describe('Security and Validation', () => {
    test('should validate user permissions in context', async () => {
      const restrictedContext = {
        ...testContext,
        permissions: ['read'], // No write or calculate permissions
      };

      const request = {
        data: {
          entityType: 'financial_transaction',
          data: { amount: '10000' }
        },
        correlationId: 'security_test',
        timestamp: new Date(),
      };

      // Should still process but may limit certain operations
      const result = await integrationService.processBusinessData(request, restrictedContext);
      expect(result).toBeDefined();
      expect(result.correlationId).toBe('security_test');
    });

    test('should sanitize input data', () => {
      const maliciousData = {
        email: '<script>alert("xss")</script>@example.com',
        name: 'Robert\'; DROP TABLE users; --',
      };

      const rules = [
        {
          field_name: 'email',
          rule_type: 'validate',
          pattern: null,
          transformation: 'lowercase',
          validation_rules: ['email'],
          default_value: null,
          allowed_values: [],
          min_length: null,
          max_length: null,
          min_value: null,
          max_value: null,
        }
      ];

      const results = standardizeDataRecord(maliciousData, rules);
      const emailResult = results.find(r => r.field_name === 'email');
      
      // Should fail validation due to invalid email format
      expect(emailResult?.is_valid).toBe(false);
    });
  });
});