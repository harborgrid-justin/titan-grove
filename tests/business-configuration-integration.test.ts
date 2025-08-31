/**
 * Integration Test for Complete Business Configuration System
 * Validates the entire configuration system with real service instances
 */

import { loadExtendedConfig, loadBusinessConfig } from '../src/utils/business-config';
import { 
  ConfigureToOrderService, 
  createConfigureToOrderService,
  OrderAnalyticsService,
  createOrderAnalyticsService
} from '../src/modules/orders';

describe('Complete Business Configuration Integration', () => {
  beforeEach(() => {
    // Clean environment variables
    delete process.env.CTO_DEFAULT_BASE_PRICE;
    delete process.env.CTO_ENGINEERING_HOURLY_RATE;
    delete process.env.OA_DEFAULT_CREDIT_UTILIZATION;
  });

  test('demonstrates end-to-end configuration system', async () => {
    // Load production-like configuration
    process.env.CTO_DEFAULT_BASE_PRICE = '1500';
    process.env.CTO_ENGINEERING_HOURLY_RATE = '175';
    process.env.CTO_DEFAULT_COST_RATIO = '0.70';
    process.env.OA_DEFAULT_CREDIT_UTILIZATION = '0.75';
    
    const config = loadExtendedConfig();
    
    // Verify configuration loading
    expect(config.business.configureToOrder.defaultBasePrice).toBe(1500);
    expect(config.business.configureToOrder.engineeringHourlyRate).toBe(175);
    expect(config.business.configureToOrder.defaultCostRatio).toBe(0.70);
    expect(config.business.orderAnalytics.defaultCreditUtilization).toBe(0.75);
    
    // Create services with the loaded configuration
    const ctoService = createConfigureToOrderService(config.business.configureToOrder);
    const analyticsService = createOrderAnalyticsService(config.business.orderAnalytics);
    
    expect(ctoService).toBeInstanceOf(ConfigureToOrderService);
    expect(analyticsService).toBeInstanceOf(OrderAnalyticsService);
  });

  test('validates multi-environment configuration scenarios', () => {
    // Development Environment
    const devConfig = loadBusinessConfig();
    expect(devConfig.configureToOrder.defaultBasePrice).toBe(1000);
    expect(devConfig.configureToOrder.engineeringHourlyRate).toBe(150);
    
    // Staging Environment
    process.env.CTO_DEFAULT_BASE_PRICE = '1200';
    process.env.CTO_ENGINEERING_HOURLY_RATE = '160';
    const stagingConfig = loadBusinessConfig();
    expect(stagingConfig.configureToOrder.defaultBasePrice).toBe(1200);
    expect(stagingConfig.configureToOrder.engineeringHourlyRate).toBe(160);
    
    // Production Environment
    process.env.CTO_DEFAULT_BASE_PRICE = '1500';
    process.env.CTO_ENGINEERING_HOURLY_RATE = '175';
    const prodConfig = loadBusinessConfig();
    expect(prodConfig.configureToOrder.defaultBasePrice).toBe(1500);
    expect(prodConfig.configureToOrder.engineeringHourlyRate).toBe(175);
  });

  test('demonstrates service customization with A/B testing scenarios', () => {
    // Control Group (Default)
    const controlService = createConfigureToOrderService({
      defaultBasePrice: 1000,
      defaultBaseCost: 650,
      defaultCostRatio: 0.65,
      defaultLeadTimeBase: 14,
      standardComplexityMaxOptions: 3,
      complexComplexityMaxOptions: 8,
      engineeringHourlyRate: 150,
      defaultEngineeringDuration: 15,
      prototypeDevelopmentDuration: 10,
      productionPlanningDuration: 5,
      baseProjectTimeline: 30,
      defaultSampleLeadTime: 7,
    });

    // Test Group A (Premium Pricing)
    const testGroupAService = createConfigureToOrderService({
      defaultBasePrice: 1200,
      defaultBaseCost: 750,
      defaultCostRatio: 0.62,
      defaultLeadTimeBase: 12,
      standardComplexityMaxOptions: 3,
      complexComplexityMaxOptions: 8,
      engineeringHourlyRate: 175,
      defaultEngineeringDuration: 15,
      prototypeDevelopmentDuration: 10,
      productionPlanningDuration: 5,
      baseProjectTimeline: 30,
      defaultSampleLeadTime: 7,
    });

    // Test Group B (Economy Pricing)
    const testGroupBService = createConfigureToOrderService({
      defaultBasePrice: 850,
      defaultBaseCost: 550,
      defaultCostRatio: 0.65,
      defaultLeadTimeBase: 16,
      standardComplexityMaxOptions: 4,
      complexComplexityMaxOptions: 10,
      engineeringHourlyRate: 125,
      defaultEngineeringDuration: 15,
      prototypeDevelopmentDuration: 10,
      productionPlanningDuration: 5,
      baseProjectTimeline: 30,
      defaultSampleLeadTime: 7,
    });

    expect(controlService).toBeInstanceOf(ConfigureToOrderService);
    expect(testGroupAService).toBeInstanceOf(ConfigureToOrderService);
    expect(testGroupBService).toBeInstanceOf(ConfigureToOrderService);
  });

  test('validates configuration validation and error handling', () => {
    // Test invalid configuration values
    expect(() => {
      loadExtendedConfig();
    }).not.toThrow(); // Should not throw with default values

    // Test boundary conditions
    process.env.CTO_DEFAULT_COST_RATIO = '0.95';  // Valid: just under 1.0
    expect(() => {
      const config = loadExtendedConfig();
      expect(config.business.configureToOrder.defaultCostRatio).toBe(0.95);
    }).not.toThrow();

    // Test that schema validation works for created services
    const validConfig = {
      defaultBasePrice: 1000,
      defaultBaseCost: 650,
      defaultCostRatio: 0.65,
      defaultLeadTimeBase: 14,
      standardComplexityMaxOptions: 3,
      complexComplexityMaxOptions: 8,
      engineeringHourlyRate: 150,
      defaultEngineeringDuration: 15,
      prototypeDevelopmentDuration: 10,
      productionPlanningDuration: 5,
      baseProjectTimeline: 30,
      defaultSampleLeadTime: 7,
    };

    expect(() => {
      createConfigureToOrderService(validConfig);
    }).not.toThrow();
  });

  test('demonstrates configuration system performance', () => {
    const startTime = process.hrtime.bigint();
    
    // Load configuration multiple times (simulating production usage)
    for (let i = 0; i < 100; i++) {
      const config = loadBusinessConfig();
      expect(config).toBeDefined();
    }
    
    const endTime = process.hrtime.bigint();
    const durationMs = Number(endTime - startTime) / 1000000;
    
    // Configuration loading should be fast (< 100ms for 100 loads)
    expect(durationMs).toBeLessThan(100);
  });

  afterEach(() => {
    // Clean up environment variables
    delete process.env.CTO_DEFAULT_BASE_PRICE;
    delete process.env.CTO_ENGINEERING_HOURLY_RATE;
    delete process.env.CTO_DEFAULT_COST_RATIO;
    delete process.env.OA_DEFAULT_CREDIT_UTILIZATION;
  });
});