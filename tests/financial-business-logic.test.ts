/**
 * Financial Business Logic Tests
 * Test the newly scaffolded financial sub-modules
 */

import { financialManager } from '../src/modules/financial';

describe('Financial Business Logic Sub-modules', () => {
  test('should have access to pricing service methods', async () => {
    const pricing = await financialManager.calculateLeasePricing(
      100000, // asset value
      36,     // term months
      'standard_pricing',
      'customer_123'
    );
    
    expect(pricing).toBeDefined();
    expect(pricing.assetValue).toBe(100000);
    expect(pricing.termMonths).toBe(36);
  });

  test('should have access to credit service methods', async () => {
    const businessInfo = {
      businessName: 'Test Company',
      businessType: 'CORPORATION' as const,
      yearsInBusiness: 10,
      annualRevenue: 2000000,
      numberOfEmployees: 50,
      industry: 'Technology',
      businessAddress: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'ST',
        zipCode: '12345',
        country: 'USA'
      },
      taxId: '123456789'
    };

    const financialInfo = {
      annualRevenue: 2000000,
      netIncome: 200000,
      totalAssets: 1000000,
      totalLiabilities: 500000,
      cashFlow: 300000,
      existingDebt: 400000,
      bankingRelationship: 'First National Bank'
    };

    const creditScore = await financialManager.calculateCreditScore(businessInfo, financialInfo);
    
    expect(creditScore).toBeDefined();
    expect(typeof creditScore.score).toBe('number');
    expect(creditScore.riskLevel).toBeDefined();
  });

  test('should have access to lease sales quote service methods', async () => {
    const assets = [{
      id: 'asset_1',
      description: 'Equipment Item 1',
      manufacturer: 'Test Manufacturer',
      model: 'Model X',
      assetValue: 50000,
      assetCategory: 'Equipment',
      quantity: 1
    }];

    const leaseTerms = {
      termMonths: 36,
      leaseType: 'OPERATING' as const,
      paymentFrequency: 'MONTHLY' as const,
      paymentTiming: 'ADVANCE' as const,
      firstPaymentDate: new Date(),
      lastPaymentDate: new Date(Date.now() + 36 * 30 * 24 * 60 * 60 * 1000),
      earlyTerminationAllowed: true
    };

    const quote = await financialManager.createLeaseSalesQuote(
      'customer_123',
      'sales_rep_456',
      assets,
      leaseTerms
    );

    expect(quote).toBeDefined();
    expect(quote.customerId).toBe('customer_123');
    expect(quote.assets).toHaveLength(1);
  });

  test('should have access to subsidy service methods', async () => {
    const subsidies = await financialManager.findApplicableSubsidies(
      'equipment',
      100000,
      'customer_123',
      'USA'
    );

    expect(Array.isArray(subsidies)).toBe(true);
  });

  test('should have access to tax service methods', async () => {
    const taxCalculation = await financialManager.calculateTax(
      'lease_123',
      100000,
      'California'
    );

    expect(taxCalculation).toBeDefined();
    expect(taxCalculation.leaseId).toBe('lease_123');
    expect(taxCalculation.assetValue).toBe(100000);
    expect(taxCalculation.totalTaxAmount).toBeGreaterThan(0);
  });

  test('should have access to billing service methods', async () => {
    const invoice = await financialManager.generateInvoice(
      'lease_123',
      new Date('2024-01-01'),
      new Date('2024-01-31')
    );

    expect(invoice).toBeDefined();
    expect(invoice.leaseId).toBe('lease_123');
    expect(invoice.lineItems.length).toBeGreaterThan(0);
    expect(invoice.totalAmount).toBeGreaterThan(0);
  });

  test('should have access to cash flow projection methods', async () => {
    const projection = await financialManager.generateCashFlowProjection(
      ['lease_123', 'lease_456'],
      12 // 12 months
    );

    expect(projection).toBeDefined();
    expect(projection.periodMonths).toBe(12);
    expect(Array.isArray(projection.inflows)).toBe(true);
    expect(Array.isArray(projection.outflows)).toBe(true);
  });
});