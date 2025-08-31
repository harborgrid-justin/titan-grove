/**
 * Tests for Shared Utility Libraries
 * Validates the reusable utilities created for constants and calculations
 */

import {
  TIME_CONSTANTS,
  BUSINESS_CONSTANTS,
  DateUtils,
  IdUtils,
  FinancialUtils,
  PerformanceUtils
} from '../src/shared/constants';

import {
  ValidationUtils,
  BusinessRules,
  ErrorMessages
} from '../src/shared/validation';

describe('Shared Utility Libraries', () => {
  
  describe('Constants', () => {
    it('should provide time constants', () => {
      expect(TIME_CONSTANTS.MILLISECONDS_PER_DAY).toBe(86400000);
      expect(TIME_CONSTANTS.DAYS_PER_MONTH).toBe(30);
      expect(TIME_CONSTANTS.DAYS_PER_YEAR).toBe(365);
    });

    it('should provide business constants', () => {
      expect(BUSINESS_CONSTANTS.STANDARD_PAYMENT_TERMS_DAYS).toBe(30);
      expect(BUSINESS_CONSTANTS.OVERALLOCATION_THRESHOLD).toBe(0.95);
      expect(BUSINESS_CONSTANTS.OVERHEAD_RATIO_DEFAULT).toBe(0.15);
    });
  });

  describe('DateUtils', () => {
    const baseDate = new Date('2023-01-01');

    it('should add days correctly', () => {
      const result = DateUtils.addDays(baseDate, 5);
      expect(result.getDate()).toBe(6);
    });

    it('should calculate payment due dates', () => {
      const dueDate = DateUtils.getPaymentDueDate(baseDate, 30);
      expect(dueDate.getDate()).toBe(31);
    });

    it('should add months correctly', () => {
      const result = DateUtils.addMonths(baseDate, 2);
      expect(result.getMonth()).toBe(2); // March (0-indexed)
    });
  });

  describe('IdUtils', () => {
    it('should generate unique project IDs', () => {
      const id1 = IdUtils.generateProjectId();
      const id2 = IdUtils.generateProjectId();
      
      expect(id1).toMatch(/^proj_\d+_[a-z0-9]+$/);
      expect(id2).toMatch(/^proj_\d+_[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });

    it('should generate invoice numbers', () => {
      const invoiceNumber = IdUtils.generateInvoiceNumber();
      expect(invoiceNumber).toMatch(/^INV\d{6}$/);
    });

    it('should generate contract numbers', () => {
      const contractNumber = IdUtils.generateContractNumber();
      expect(contractNumber).toMatch(/^CON\d{6}$/);
    });
  });

  describe('FinancialUtils', () => {
    it('should calculate tax correctly', () => {
      const tax = FinancialUtils.calculateTax(1000, 0.08);
      expect(tax).toBe(80);
    });

    it('should calculate overhead', () => {
      const overhead = FinancialUtils.calculateOverhead(10000, 0.15);
      expect(overhead).toBe(1500);
    });

    it('should calculate profit margin', () => {
      const margin = FinancialUtils.calculateProfitMargin(12000, 10000);
      expect(margin).toBeCloseTo(0.167, 3);
    });

    it('should round to cents', () => {
      const rounded = FinancialUtils.roundToCents(123.456789);
      expect(rounded).toBe(123.46);
    });
  });

  describe('PerformanceUtils', () => {
    it('should calculate health score', () => {
      const score = PerformanceUtils.calculateHealthScore({
        schedule: 0.95,
        cost: 1.02,
        scope: 0.65,
        quality: 0.92,
        risk: 0.15,
        satisfaction: 0.88
      });
      
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
      expect(typeof score).toBe('number');
    });

    it('should detect overallocation', () => {
      expect(PerformanceUtils.isOverAllocated(160, 150, 0.95)).toBe(true);
      expect(PerformanceUtils.isOverAllocated(140, 150, 0.95)).toBe(false);
    });

    it('should calculate utilization', () => {
      const utilization = PerformanceUtils.calculateUtilization(120, 160);
      expect(utilization).toBe(75);
    });
  });

  describe('ValidationUtils', () => {
    it('should validate amounts', () => {
      expect(ValidationUtils.isValidAmount(100)).toBe(true);
      expect(ValidationUtils.isValidAmount(-50)).toBe(false);
      expect(ValidationUtils.isValidAmount(NaN)).toBe(false);
    });

    it('should validate percentages', () => {
      expect(ValidationUtils.isValidPercentage(50)).toBe(true);
      expect(ValidationUtils.isValidPercentage(150)).toBe(false);
      expect(ValidationUtils.isValidPercentage(-10)).toBe(false);
    });

    it('should validate ratios', () => {
      expect(ValidationUtils.isValidRatio(0.5)).toBe(true);
      expect(ValidationUtils.isValidRatio(1.5)).toBe(false);
      expect(ValidationUtils.isValidRatio(-0.1)).toBe(false);
    });
  });

  describe('BusinessRules', () => {
    it('should validate project budgets', () => {
      const result1 = BusinessRules.validateProjectBudget(10000, 8000);
      expect(result1.valid).toBe(true);

      const result2 = BusinessRules.validateProjectBudget(10000, 13000); // 30% over
      expect(result2.valid).toBe(false);
      expect(result2.message).toContain('20%');
    });

    it('should validate resource allocation', () => {
      const result1 = BusinessRules.validateResourceAllocation(80);
      expect(result1.valid).toBe(true);

      const result2 = BusinessRules.validateResourceAllocation(150);
      expect(result2.valid).toBe(false);
    });

    it('should validate profit margins', () => {
      const result = BusinessRules.validateProfitMargin(12000, 10000);
      expect(result.valid).toBe(true);
      expect(result.margin).toBeCloseTo(0.167, 3);
    });
  });
});

describe('Configuration Integration', () => {
  it('should load business config and use with utilities', async () => {
    const { loadBusinessConfig } = require('../src/utils/business-config');
    const config = loadBusinessConfig();
    
    // Test that config values work with utilities
    const tax = FinancialUtils.calculateTax(1000, config.project.billing.standardTaxRate);
    expect(tax).toBeGreaterThan(0);
    
    const dueDate = DateUtils.getPaymentDueDate(new Date(), config.project.billing.paymentTermsDays);
    expect(dueDate > new Date()).toBe(true);
  });
});