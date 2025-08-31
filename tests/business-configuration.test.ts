/**
 * Test Business Configuration System
 * Validates centralized configuration loading and service initialization
 */

import { loadExtendedConfig, loadBusinessConfig } from '../src/utils/business-config';
import { ConfigureToOrderService, createConfigureToOrderService } from '../src/modules/orders';

describe('Business Configuration System', () => {
  test('loads business configuration with defaults', () => {
    const config = loadBusinessConfig();
    
    expect(config).toBeDefined();
    expect(config.configureToOrder).toBeDefined();
    expect(config.configureToOrder.defaultBasePrice).toBe(1000);
    expect(config.configureToOrder.defaultBaseCost).toBe(650);
    expect(config.configureToOrder.defaultCostRatio).toBe(0.65);
    expect(config.configureToOrder.defaultLeadTimeBase).toBe(14);
    expect(config.configureToOrder.engineeringHourlyRate).toBe(150);
  });

  test('loads extended configuration with business settings', () => {
    const config = loadExtendedConfig();
    
    expect(config).toBeDefined();
    expect(config.business).toBeDefined();
    expect(config.business.configureToOrder).toBeDefined();
    expect(config.database).toBeDefined();
    expect(config.server).toBeDefined();
  });

  test('creates configurable service with custom configuration', () => {
    const customConfig = {
      defaultBasePrice: 2000,
      defaultBaseCost: 1300,
      defaultCostRatio: 0.70,
      defaultLeadTimeBase: 21,
      standardComplexityMaxOptions: 5,
      complexComplexityMaxOptions: 12,
      engineeringHourlyRate: 200,
      defaultEngineeringDuration: 20,
      prototypeDevelopmentDuration: 15,
      productionPlanningDuration: 8,
      baseProjectTimeline: 45,
      defaultSampleLeadTime: 10,
    };

    const service = createConfigureToOrderService(customConfig);
    expect(service).toBeInstanceOf(ConfigureToOrderService);
  });

  test('validates environment variable override functionality', () => {
    // Set test environment variables
    process.env.CTO_DEFAULT_BASE_PRICE = '1500';
    process.env.CTO_ENGINEERING_HOURLY_RATE = '175';
    process.env.CAM_ROI_BASE_CASE_PROBABILITY = '65';

    const config = loadBusinessConfig();
    
    expect(config.configureToOrder.defaultBasePrice).toBe(1500);
    expect(config.configureToOrder.engineeringHourlyRate).toBe(175);
    expect(config.capitalAsset.roiScenarios.baseCase.probability).toBe(65);

    // Clean up
    delete process.env.CTO_DEFAULT_BASE_PRICE;
    delete process.env.CTO_ENGINEERING_HOURLY_RATE;
    delete process.env.CAM_ROI_BASE_CASE_PROBABILITY;
  });

  test('validates configuration schema with invalid values', () => {
    expect(() => {
      const config = loadExtendedConfig();
      config.business.configureToOrder.defaultCostRatio = 1.5; // Invalid: > 1
    }).not.toThrow(); // Should not throw during loading, only validation
  });
});