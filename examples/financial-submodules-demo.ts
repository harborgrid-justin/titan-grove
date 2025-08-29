/**
 * Financial Business Logic Demo
 * Demonstrates the Oracle Lease and Finance Management sub-modules
 */

import { financialManager } from '../src/modules/financial';

async function demonstrateFinancialSubmodules() {
  console.log('🏢 Titan Grove Financial Module - Oracle Lease & Finance Management Demo');
  console.log('=' .repeat(80));

  try {
    // 1. Pricing Module Demo
    console.log('\n💰 Pricing Module Demo:');
    const pricing = await financialManager.calculateLeasePricing(
      250000, // $250K asset
      48,     // 4 year term
      'premium_pricing',
      'customer_enterprise_001'
    );
    console.log(`- Asset Value: $${pricing.assetValue.toLocaleString()}`);
    console.log(`- Monthly Payment: $${pricing.basePayment.toLocaleString()}`);
    console.log(`- Total Cost: $${pricing.totalCost.toLocaleString()}`);
    console.log(`- Effective Rate: ${(pricing.effectiveRate * 100).toFixed(2)}%`);

    // 2. Credit Management Demo
    console.log('\n🏦 Credit Management Demo:');
    const businessInfo = {
      businessName: 'Tech Innovations LLC',
      businessType: 'LLC' as const,
      yearsInBusiness: 7,
      annualRevenue: 5000000,
      numberOfEmployees: 125,
      industry: 'Technology Services',
      businessAddress: {
        street: '456 Innovation Drive',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'USA'
      },
      taxId: '98-7654321'
    };

    const financialInfo = {
      annualRevenue: 5000000,
      netIncome: 750000,
      totalAssets: 2500000,
      totalLiabilities: 1000000,
      cashFlow: 900000,
      existingDebt: 800000,
      bankingRelationship: 'Silicon Valley Bank'
    };

    const creditScore = await financialManager.calculateCreditScore(businessInfo, financialInfo);
    console.log(`- Credit Score: ${creditScore.score} (${creditScore.riskLevel} risk)`);
    console.log(`- Key Factors: ${creditScore.factors.map(f => f.factor).join(', ')}`);

    // 3. Lease Sales Quote Demo
    console.log('\n📋 Lease Sales Quote Demo:');
    const assets = [
      {
        id: 'server_rack_001',
        description: 'Dell PowerEdge Server Rack',
        manufacturer: 'Dell Technologies',
        model: 'PowerEdge R750',
        assetValue: 45000,
        residualValue: 9000,
        assetCategory: 'IT Equipment',
        quantity: 2
      },
      {
        id: 'network_switch_001',
        description: 'Cisco Network Switch',
        manufacturer: 'Cisco Systems',
        model: 'Catalyst 9300',
        assetValue: 12000,
        assetCategory: 'Network Equipment',
        quantity: 4
      }
    ];

    const leaseTerms = {
      termMonths: 36,
      leaseType: 'OPERATING' as const,
      paymentFrequency: 'MONTHLY' as const,
      paymentTiming: 'ADVANCE' as const,
      firstPaymentDate: new Date(),
      lastPaymentDate: new Date(Date.now() + 36 * 30 * 24 * 60 * 60 * 1000),
      purchaseOptionType: 'FAIR_MARKET' as const,
      earlyTerminationAllowed: true
    };

    const quote = await financialManager.createLeaseSalesQuote(
      'customer_enterprise_001',
      'sales_rep_johnson',
      assets,
      leaseTerms
    );

    console.log(`- Quote Number: ${quote.quoteNumber}`);
    console.log(`- Total Asset Value: $${quote.pricing.totalAssetValue.toLocaleString()}`);
    console.log(`- Monthly Payment: $${quote.pricing.monthlyPayment.toLocaleString()}`);
    console.log(`- Assets: ${quote.assets.length} items`);

    // 4. Subsidies Demo
    console.log('\n💸 Subsidies Management Demo:');
    const subsidies = await financialManager.findApplicableSubsidies(
      'energy_efficient_equipment',
      150000,
      'customer_enterprise_001',
      'California'
    );
    
    if (subsidies.length > 0) {
      const subsidy = subsidies[0];
      console.log(`- Found Subsidy: ${subsidy.name}`);
      console.log(`- Type: ${subsidy.type}`);
      console.log(`- Potential Savings: ${subsidy.subsidyPercent}% (max $${subsidy.maxSubsidyAmount?.toLocaleString()})`);
      
      const subsidyAmount = await financialManager.calculateSubsidyAmount(subsidy, 150000);
      console.log(`- Calculated Subsidy: $${subsidyAmount.toLocaleString()}`);
    } else {
      console.log('- No applicable subsidies found for this scenario');
    }

    // 5. Tax Calculation Demo
    console.log('\n📊 Tax Management Demo:');
    const taxCalc = await financialManager.calculateTax(
      'lease_demo_001',
      150000,
      'California'
    );
    console.log(`- Taxable Amount: $${taxCalc.assetValue.toLocaleString()}`);
    console.log(`- Tax Jurisdiction: ${taxCalc.jurisdiction}`);
    console.log(`- Total Tax: $${taxCalc.totalTaxAmount.toLocaleString()}`);
    console.log(`- Tax Breakdown: ${taxCalc.applicableTaxes.map(t => `${t.taxType} (${(t.rate * 100).toFixed(2)}%)`).join(', ')}`);

    // 6. Billing Demo
    console.log('\n🧾 Billing Management Demo:');
    const invoice = await financialManager.generateInvoice(
      'lease_demo_001',
      new Date('2024-01-01'),
      new Date('2024-01-31')
    );
    console.log(`- Invoice Number: ${invoice.invoiceNumber}`);
    console.log(`- Billing Period: ${invoice.billingPeriodStart.toLocaleDateString()} - ${invoice.billingPeriodEnd.toLocaleDateString()}`);
    console.log(`- Line Items: ${invoice.lineItems.length}`);
    console.log(`- Subtotal: $${invoice.subtotal.toLocaleString()}`);
    console.log(`- Total Amount: $${invoice.totalAmount.toLocaleString()}`);

    // 7. Cash Flow Projection Demo
    console.log('\n💹 Cash Flow Projection Demo:');
    const projection = await financialManager.generateCashFlowProjection(
      ['lease_demo_001', 'lease_demo_002', 'lease_demo_003'],
      24 // 24 months
    );
    console.log(`- Projection Period: ${projection.periodMonths} months`);
    console.log(`- Net Cash Flow: $${projection.netCashFlow.toLocaleString()}`);
    console.log(`- Cumulative Cash Flow: $${projection.cumulativeCashFlow.toLocaleString()}`);

    console.log('\n✅ Financial Sub-modules Demo Complete!');
    console.log('\n📦 Available Sub-modules:');
    console.log('   • Pricing Management        • Subsidies Management');
    console.log('   • Lease Sales Quotes        • Credit Management');
    console.log('   • Master Lease Agreements   • Contract Authoring');
    console.log('   • Streams & Cash Flow       • Tax Management');
    console.log('   • Billing Management        • Receipt of Payments');
    console.log('   • Disbursements            • Quote Management');
    console.log('   • Contract Lifecycle       • Asset Management');
    console.log('   • Portfolio Management     • Accounting Integration');
    console.log('   • Customer/Vendor Portals   • Business Reporting');
    console.log('   • And 15+ more specialized modules...');

  } catch (error) {
    console.error('Demo failed:', error);
  }
}

// Run the demo
if (require.main === module) {
  demonstrateFinancialSubmodules();
}

export { demonstrateFinancialSubmodules };