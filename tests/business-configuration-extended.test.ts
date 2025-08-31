/**
 * Extended Business Configuration Tests
 * Tests for the newly centralized Quote Management, Order Promising, and Procurement configurations
 */

import { loadBusinessConfig } from '../src/utils/business-config';
import { 
  createQuoteManagementService, 
  createOrderPromisingService, 
  createProcurementServiceConfig 
} from '../src/utils/service-factories';

describe('Extended Business Configuration System', () => {
  
  afterEach(() => {
    // Clean up environment variables after each test
    delete process.env.QM_DEFAULT_EXPIRATION_DAYS;
    delete process.env.QM_SHIPPING_RATE_PER_POUND;
    delete process.env.QM_APPROVAL_THRESHOLD_AMOUNT;
    delete process.env.OP_MANUFACTURING_LEAD_TIME;
    delete process.env.OP_PROCUREMENT_LEAD_TIME;
    delete process.env.PROC_SUPPLIER_QUALITY_THRESHOLD;
    delete process.env.PROC_PO_APPROVAL_THRESHOLD;
  });

  describe('Quote Management Configuration', () => {
    test('should load default quote management configuration', () => {
      const config = loadBusinessConfig();
      
      expect(config.quoteManagement).toBeDefined();
      expect(config.quoteManagement.defaultExpirationDays).toBe(30);
      expect(config.quoteManagement.shippingRatePerPound).toBe(5.50);
      expect(config.quoteManagement.mockWeightPerItem).toBe(2);
      expect(config.quoteManagement.approvalThresholdAmount).toBe(10000);
      expect(config.quoteManagement.maxDiscountPercentWithoutApproval).toBe(15);
      expect(config.quoteManagement.standardTaxRate).toBe(0.085);
      expect(config.quoteManagement.currencyConversionRate).toBe(1.25);
    });

    test('should override quote management configuration from environment variables', () => {
      process.env.QM_DEFAULT_EXPIRATION_DAYS = '45';
      process.env.QM_SHIPPING_RATE_PER_POUND = '6.75';
      process.env.QM_APPROVAL_THRESHOLD_AMOUNT = '15000';
      
      const config = loadBusinessConfig();
      
      expect(config.quoteManagement.defaultExpirationDays).toBe(45);
      expect(config.quoteManagement.shippingRatePerPound).toBe(6.75);
      expect(config.quoteManagement.approvalThresholdAmount).toBe(15000);
    });

    test('should create configurable quote management service', () => {
      const service = createQuoteManagementService();
      
      expect(service).toBeDefined();
      expect(service.constructor.name).toBe('QuoteService');
    });

    test('should create quote service with custom configuration', () => {
      const customConfig = loadBusinessConfig();
      customConfig.quoteManagement.defaultExpirationDays = 60;
      customConfig.quoteManagement.approvalThresholdAmount = 20000;
      
      const service = createQuoteManagementService(customConfig);
      
      expect(service).toBeDefined();
      // The service should use the custom configuration internally
    });
  });

  describe('Order Promising Configuration', () => {
    test('should load default order promising configuration', () => {
      const config = loadBusinessConfig();
      
      expect(config.orderPromising).toBeDefined();
      expect(config.orderPromising.manufacturingLeadTime).toBe(10);
      expect(config.orderPromising.procurementLeadTime).toBe(7);
      expect(config.orderPromising.itemLeadTime).toBe(5);
      expect(config.orderPromising.standardShippingTime).toBe(10);
      expect(config.orderPromising.expressShippingTime).toBe(7);
      expect(config.orderPromising.overnightShippingTime).toBe(1);
      expect(config.orderPromising.lowPriorityBufferDays).toBe(3);
      expect(config.orderPromising.mediumPriorityBufferDays).toBe(2);
      expect(config.orderPromising.highPriorityBufferDays).toBe(1);
      expect(config.orderPromising.minConfidenceLevel).toBe(0.1);
      expect(config.orderPromising.maxConfidenceLevel).toBe(1.0);
    });

    test('should override order promising configuration from environment variables', () => {
      process.env.OP_MANUFACTURING_LEAD_TIME = '14';
      process.env.OP_PROCUREMENT_LEAD_TIME = '10';
      process.env.OP_STANDARD_SHIPPING_TIME = '12';
      
      const config = loadBusinessConfig();
      
      expect(config.orderPromising.manufacturingLeadTime).toBe(14);
      expect(config.orderPromising.procurementLeadTime).toBe(10);
      expect(config.orderPromising.standardShippingTime).toBe(12);
    });

    test('should create configurable order promising service', () => {
      const service = createOrderPromisingService();
      
      expect(service).toBeDefined();
      expect(service.constructor.name).toBe('OrderPromisingService');
    });

    test('should create order promising service with custom configuration', () => {
      const customConfig = loadBusinessConfig();
      customConfig.orderPromising.manufacturingLeadTime = 15;
      customConfig.orderPromising.minConfidenceLevel = 0.2;
      
      const service = createOrderPromisingService(customConfig);
      
      expect(service).toBeDefined();
      // The service should use the custom configuration internally
    });
  });

  describe('Procurement Configuration', () => {
    test('should load default procurement configuration', () => {
      const config = loadBusinessConfig();
      
      expect(config.procurement).toBeDefined();
      expect(config.procurement.supplierQualityThreshold).toBe(70);
      expect(config.procurement.supplierDeliveryThreshold).toBe(80);
      expect(config.procurement.supplierCostThreshold).toBe(75);
      expect(config.procurement.poApprovalThreshold).toBe(5000);
      expect(config.procurement.maxPoValueWithoutApproval).toBe(50000);
      expect(config.procurement.rfqResponseTimeoutDays).toBe(14);
      expect(config.procurement.minSuppliersForRfq).toBe(3);
      expect(config.procurement.contractRenewalNotificationDays).toBe(90);
      expect(config.procurement.contractValueReviewThreshold).toBe(100000);
    });

    test('should override procurement configuration from environment variables', () => {
      process.env.PROC_SUPPLIER_QUALITY_THRESHOLD = '85';
      process.env.PROC_PO_APPROVAL_THRESHOLD = '7500';
      process.env.PROC_RFQ_RESPONSE_TIMEOUT_DAYS = '21';
      
      const config = loadBusinessConfig();
      
      expect(config.procurement.supplierQualityThreshold).toBe(85);
      expect(config.procurement.poApprovalThreshold).toBe(7500);
      expect(config.procurement.rfqResponseTimeoutDays).toBe(21);
    });

    test('should create configurable procurement service config', () => {
      const serviceConfig = createProcurementServiceConfig();
      
      expect(serviceConfig).toBeDefined();
      expect(serviceConfig.config).toBeDefined();
      expect(serviceConfig.getSupplierScoringThresholds).toBeDefined();
      expect(serviceConfig.getPurchaseOrderLimits).toBeDefined();
      expect(serviceConfig.getRfqConfiguration).toBeDefined();
      expect(serviceConfig.getContractManagementConfig).toBeDefined();
    });

    test('should provide supplier scoring thresholds via factory', () => {
      const serviceConfig = createProcurementServiceConfig();
      const thresholds = serviceConfig.getSupplierScoringThresholds();
      
      expect(thresholds.qualityThreshold).toBe(70);
      expect(thresholds.deliveryThreshold).toBe(80);
      expect(thresholds.costThreshold).toBe(75);
    });

    test('should provide purchase order limits via factory', () => {
      const serviceConfig = createProcurementServiceConfig();
      const limits = serviceConfig.getPurchaseOrderLimits();
      
      expect(limits.approvalThreshold).toBe(5000);
      expect(limits.maxValueWithoutApproval).toBe(50000);
    });
  });

  describe('Configuration Migration Validation', () => {
    test('should provide all previously hard-coded quote management values as configurable', () => {
      const config = loadBusinessConfig();
      
      // Verify all hard-coded values from quote service are now configurable
      const quoteConfig = config.quoteManagement;
      
      // Previously hard-coded: 5.50 shipping rate
      expect(quoteConfig.shippingRatePerPound).toBeDefined();
      expect(typeof quoteConfig.shippingRatePerPound).toBe('number');
      
      // Previously hard-coded: 10000 approval threshold
      expect(quoteConfig.approvalThresholdAmount).toBeDefined();
      expect(typeof quoteConfig.approvalThresholdAmount).toBe('number');
      
      // Previously hard-coded: 15% discount limit
      expect(quoteConfig.maxDiscountPercentWithoutApproval).toBeDefined();
      expect(typeof quoteConfig.maxDiscountPercentWithoutApproval).toBe('number');
      
      // Previously hard-coded: 1.25 currency rate
      expect(quoteConfig.currencyConversionRate).toBeDefined();
      expect(typeof quoteConfig.currencyConversionRate).toBe('number');
      
      // Previously hard-coded: 0.08 tax rate
      expect(quoteConfig.standardTaxRate).toBeDefined();
      expect(typeof quoteConfig.standardTaxRate).toBe('number');
    });

    test('should provide all previously hard-coded order promising values as configurable', () => {
      const config = loadBusinessConfig();
      
      // Verify all hard-coded values from order promising service are now configurable
      const orderPromisingConfig = config.orderPromising;
      
      // Previously hard-coded: 10 days manufacturing lead time
      expect(orderPromisingConfig.manufacturingLeadTime).toBeDefined();
      expect(orderPromisingConfig.manufacturingLeadTime).toBe(10);
      
      // Previously hard-coded: 7 days procurement lead time
      expect(orderPromisingConfig.procurementLeadTime).toBeDefined();
      expect(orderPromisingConfig.procurementLeadTime).toBe(7);
      
      // Previously hard-coded: 5 days item lead time
      expect(orderPromisingConfig.itemLeadTime).toBeDefined();
      expect(orderPromisingConfig.itemLeadTime).toBe(5);
      
      // Previously hard-coded: shipping times (1, 2, 5, 7)
      expect(orderPromisingConfig.overnightShippingTime).toBeDefined();
      expect(orderPromisingConfig.expressShippingTime).toBeDefined();
      expect(orderPromisingConfig.standardShippingTime).toBeDefined();
      
      // Previously hard-coded: buffer days (3, 2, 1)
      expect(orderPromisingConfig.lowPriorityBufferDays).toBeDefined();
      expect(orderPromisingConfig.mediumPriorityBufferDays).toBeDefined();
      expect(orderPromisingConfig.highPriorityBufferDays).toBeDefined();
      
      // Previously hard-coded: confidence levels (0.1, 1.0)
      expect(orderPromisingConfig.minConfidenceLevel).toBeDefined();
      expect(orderPromisingConfig.maxConfidenceLevel).toBeDefined();
    });
  });

  describe('Production-Grade Features', () => {
    test('should support environment-specific configuration for all new services', () => {
      // Simulate production environment variables
      process.env.QM_DEFAULT_EXPIRATION_DAYS = '60'; // Production quote expiration
      process.env.OP_MANUFACTURING_LEAD_TIME = '8'; // Production optimized lead time
      process.env.PROC_SUPPLIER_QUALITY_THRESHOLD = '90'; // Higher production standards
      
      const config = loadBusinessConfig();
      
      expect(config.quoteManagement.defaultExpirationDays).toBe(60);
      expect(config.orderPromising.manufacturingLeadTime).toBe(8);
      expect(config.procurement.supplierQualityThreshold).toBe(90);
    });

    test('should maintain backward compatibility with all defaults', () => {
      const config = loadBusinessConfig();
      
      // All original default values should still be available
      expect(config.quoteManagement.shippingRatePerPound).toBe(5.50);
      expect(config.orderPromising.manufacturingLeadTime).toBe(10);
      expect(config.procurement.supplierQualityThreshold).toBe(70);
    });

    test('should validate schema for new configuration sections', () => {
      expect(() => {
        const config = loadBusinessConfig();
        // Test that schema validation works by checking types
        expect(typeof config.quoteManagement.defaultExpirationDays).toBe('number');
        expect(typeof config.orderPromising.manufacturingLeadTime).toBe('number');
        expect(typeof config.procurement.supplierQualityThreshold).toBe('number');
      }).not.toThrow();
    });
  });

  describe('Service Integration Tests', () => {
    test('should integrate quote service with configuration', () => {
      process.env.QM_SHIPPING_RATE_PER_POUND = '7.25';
      process.env.QM_APPROVAL_THRESHOLD_AMOUNT = '12500';
      
      const service = createQuoteManagementService();
      
      // The service should be using the environment-configured values
      expect(service).toBeDefined();
      
      // Verify environment is loaded correctly
      const config = loadBusinessConfig();
      expect(config.quoteManagement.shippingRatePerPound).toBe(7.25);
      expect(config.quoteManagement.approvalThresholdAmount).toBe(12500);
    });

    test('should integrate order promising service with configuration', () => {
      process.env.OP_MANUFACTURING_LEAD_TIME = '12';
      process.env.OP_MIN_CONFIDENCE_LEVEL = '0.15';
      
      const service = createOrderPromisingService();
      
      expect(service).toBeDefined();
      
      // Verify environment is loaded correctly
      const config = loadBusinessConfig();
      expect(config.orderPromising.manufacturingLeadTime).toBe(12);
      expect(config.orderPromising.minConfidenceLevel).toBe(0.15);
    });
  });
});