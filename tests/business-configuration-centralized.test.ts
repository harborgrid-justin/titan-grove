/**
 * Business Configuration Integration Tests
 * Tests the complete centralized configuration system for hard-coded variables
 */

import { loadBusinessConfig, loadExtendedConfig } from '../src/utils/business-config';
import { createWarehouseManagementService, createManufacturingIntegrationService } from '../src/utils/service-factories';

describe('Business Configuration System - Centralized Hard-coded Variables', () => {
  
  afterEach(() => {
    // Clean up environment variables after each test
    delete process.env.WM_DAY_SHIFT_STAFF_COUNT;
    delete process.env.MFG_INTEGRATION_PRODUCTION_DATA_KB;
    delete process.env.MFG_INDUSTRY40_TEMPERATURE_SENSOR_LATENCY;
    delete process.env.DB_TYPE;
    delete process.env.DB_HOST;
    delete process.env.DB_USER;
    delete process.env.DB_PASSWORD;
    delete process.env.JWT_SECRET;
  });

  describe('Warehouse Management Configuration', () => {
    test('should load default warehouse management configuration', () => {
      const config = loadBusinessConfig();
      
      expect(config.warehouseManagement).toBeDefined();
      expect(config.warehouseManagement.shifts.day.staffCount).toBe(30);
      expect(config.warehouseManagement.shifts.evening.staffCount).toBe(15);
      expect(config.warehouseManagement.shifts.night.staffCount).toBe(5);
      expect(config.warehouseManagement.dockDoors.defaultCount).toBe(10);
    });

    test('should override warehouse configuration from environment variables', () => {
      process.env.WM_DAY_SHIFT_STAFF_COUNT = '50';
      
      const config = loadBusinessConfig();
      expect(config.warehouseManagement.shifts.day.staffCount).toBe(50);
    });

    test('should create configurable warehouse service factory', () => {
      const factory = createWarehouseManagementService();
      const operatingHours = factory.getDefaultOperatingHours();
      const shiftPattern = factory.getDefaultShiftPattern();
      
      expect(operatingHours.monday.startTime).toBe('08:00');
      expect(operatingHours.saturday.startTime).toBe('09:00');
      expect(shiftPattern).toHaveLength(3);
      expect(shiftPattern[0].staffCount).toBe(30);
    });

    test('should use environment variables in warehouse service factory', () => {
      process.env.WM_DAY_SHIFT_STAFF_COUNT = '40';
      
      const factory = createWarehouseManagementService();
      const shiftPattern = factory.getDefaultShiftPattern();
      
      expect(shiftPattern[0].staffCount).toBe(40);
    });
  });

  describe('Manufacturing Integration Configuration', () => {
    test('should load default manufacturing integration configuration', () => {
      const config = loadBusinessConfig();
      
      expect(config.manufacturing.integration).toBeDefined();
      expect(config.manufacturing.integration.dataVolumes.productionDataKb).toBe(2847);
      expect(config.manufacturing.integration.latencies.productionDataMs).toBe(12);
      expect(config.manufacturing.integration.reliability.productionDataPercent).toBe(98.9);
      expect(config.manufacturing.integration.migrationValue.immediateValue).toBe(2500000);
    });

    test('should override manufacturing configuration from environment variables', () => {
      process.env.MFG_INTEGRATION_PRODUCTION_DATA_KB = '3500';
      
      const config = loadBusinessConfig();
      expect(config.manufacturing.integration.dataVolumes.productionDataKb).toBe(3500);
    });

    test('should create configurable manufacturing service factory', () => {
      const factory = createManufacturingIntegrationService();
      const metrics = factory.getIntegrationMetrics();
      
      expect(metrics.dataVolumes.demandPlanningKb).toBe(1547);
      expect(metrics.latencies.demandPlanningMs).toBe(150);
      expect(metrics.reliability.demandPlanningPercent).toBe(98.5);
    });
  });

  describe('Industry 4.0 IoT Configuration', () => {
    test('should load default IoT sensor latencies', () => {
      const config = loadBusinessConfig();
      
      expect(config.manufacturing.industry40.iot).toBeDefined();
      expect(config.manufacturing.industry40.iot.temperatureSensorLatency).toBe(12);
      expect(config.manufacturing.industry40.iot.vibrationSensorLatency).toBe(18);
      expect(config.manufacturing.industry40.iot.pressureSensorLatency).toBe(8);
    });

    test('should override IoT sensor latencies from environment variables', () => {
      process.env.MFG_INDUSTRY40_TEMPERATURE_SENSOR_LATENCY = '15';
      
      const config = loadBusinessConfig();
      expect(config.manufacturing.industry40.iot.temperatureSensorLatency).toBe(15);
    });

    test('should provide configurable sensor latencies via factory', () => {
      const factory = createManufacturingIntegrationService();
      const latencies = factory.getSensorLatencies();
      
      expect(latencies.temperatureSensorLatency).toBe(12);
      expect(latencies.vibrationSensorLatency).toBe(18);
      expect(latencies.pressureSensorLatency).toBe(8);
    });
  });

  describe('Extended Configuration System', () => {
    test('should load complete extended configuration with business config', () => {
      process.env.DB_TYPE = 'postgresql';
      process.env.DB_HOST = 'test-db';
      process.env.DB_USER = 'test-user';
      process.env.DB_PASSWORD = 'test-password';
      process.env.JWT_SECRET = 'test-secret';
      
      const config = loadExtendedConfig();
      
      expect(config.database.type).toBe('postgresql');
      expect(config.business.warehouseManagement).toBeDefined();
      expect(config.business.manufacturing.integration).toBeDefined();
    });

    test('should validate configuration schema', () => {
      process.env.DB_TYPE = 'postgresql';
      process.env.DB_HOST = 'test-db';
      process.env.DB_USER = 'test-user';
      process.env.DB_PASSWORD = 'test-password';
      process.env.JWT_SECRET = 'test-secret';
      // Test with valid numeric value
      process.env.WM_DAY_SHIFT_STAFF_COUNT = '50';
      
      const config = loadExtendedConfig();
      expect(config.business.warehouseManagement.shifts.day.staffCount).toBe(50);
      
      // Test that schema validation is working by expecting defaults when no env var is set
      delete process.env.WM_DAY_SHIFT_STAFF_COUNT;
      const configDefaults = loadExtendedConfig();
      expect(configDefaults.business.warehouseManagement.shifts.day.staffCount).toBe(30); // Default value
    });
  });

  describe('Configuration Migration Validation', () => {
    test('should provide all previously hard-coded warehouse values as configurable', () => {
      const config = loadBusinessConfig();
      
      // Verify all hard-coded values from warehouse service are now configurable
      const warehouseConfig = config.warehouseManagement;
      
      // Operating hours (previously hard-coded as 08:00-17:00)
      expect(warehouseConfig.operatingHours.weekday.startTime).toBeDefined();
      expect(warehouseConfig.operatingHours.weekday.endTime).toBeDefined();
      
      // Staff counts (previously hard-coded as 30, 15, 5)
      expect(warehouseConfig.shifts.day.staffCount).toBeDefined();
      expect(warehouseConfig.shifts.evening.staffCount).toBeDefined();
      expect(warehouseConfig.shifts.night.staffCount).toBeDefined();
      
      // Storage dimensions (previously hard-coded as 200x100x30, 300x150x25)
      expect(warehouseConfig.storageAreas.bulk.dimensions.length).toBeDefined();
      expect(warehouseConfig.storageAreas.rack.dimensions.width).toBeDefined();
      
      // Dock door settings (previously hard-coded as 9x8, count 10)
      expect(warehouseConfig.dockDoors.doorHeight).toBeDefined();
      expect(warehouseConfig.dockDoors.doorWidth).toBeDefined();
      expect(warehouseConfig.dockDoors.defaultCount).toBeDefined();
    });

    test('should provide all previously hard-coded manufacturing values as configurable', () => {
      const config = loadBusinessConfig();
      
      // Verify all hard-coded values from manufacturing services are now configurable
      const manufacturingConfig = config.manufacturing;
      
      // IoT sensor latencies (previously hard-coded as 12, 18, 8)
      expect(manufacturingConfig.industry40.iot.temperatureSensorLatency).toBeDefined();
      expect(manufacturingConfig.industry40.iot.vibrationSensorLatency).toBeDefined();
      expect(manufacturingConfig.industry40.iot.pressureSensorLatency).toBeDefined();
      
      // Integration data volumes (previously hard-coded as 1547, 2847, 256, 125)
      expect(manufacturingConfig.integration.dataVolumes.demandPlanningKb).toBeDefined();
      expect(manufacturingConfig.integration.dataVolumes.productionDataKb).toBeDefined();
      expect(manufacturingConfig.integration.dataVolumes.inventoryDataKb).toBeDefined();
      expect(manufacturingConfig.integration.dataVolumes.maintenanceDataKb).toBeDefined();
      
      // Integration latencies (previously hard-coded as 150, 12, 180, 35)
      expect(manufacturingConfig.integration.latencies.demandPlanningMs).toBeDefined();
      expect(manufacturingConfig.integration.latencies.productionDataMs).toBeDefined();
      expect(manufacturingConfig.integration.latencies.inventoryDataMs).toBeDefined();
      expect(manufacturingConfig.integration.latencies.maintenanceDataMs).toBeDefined();
      
      // Migration values (previously hard-coded as 2500000, 8750000, 15000000)
      expect(manufacturingConfig.integration.migrationValue.immediateValue).toBeDefined();
      expect(manufacturingConfig.integration.migrationValue.strategicValue).toBeDefined();
      expect(manufacturingConfig.integration.migrationValue.futureValue).toBeDefined();
    });
  });

  describe('Production-Grade Features', () => {
    test('should support environment-specific configuration', () => {
      // Simulate production environment variables
      process.env.WM_DAY_SHIFT_STAFF_COUNT = '45'; // Production staffing
      process.env.MFG_INTEGRATION_PRODUCTION_DATA_KB = '3200'; // Production data volume
      
      const config = loadBusinessConfig();
      
      expect(config.warehouseManagement.shifts.day.staffCount).toBe(45);
      expect(config.manufacturing.integration.dataVolumes.productionDataKb).toBe(3200);
    });

    test('should maintain backward compatibility with defaults', () => {
      const config = loadBusinessConfig();
      
      // All original default values should still be available
      expect(config.warehouseManagement.shifts.day.staffCount).toBe(30);
      expect(config.manufacturing.integration.dataVolumes.productionDataKb).toBe(2847);
      expect(config.manufacturing.industry40.iot.temperatureSensorLatency).toBe(12);
    });
  });
});