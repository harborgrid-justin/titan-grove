/**
 * Test for @titan-grove/financial module
 * Tests all financial management functions and data structures
 */

const {
  createAccount,
  calculateAccountBalance,
  createJournalEntry,
  calculateCurrentRatio,
  calculateDebtToEquityRatio,
  calculateReturnOnAssets,
  calculateReturnOnEquity,
  calculateGrossProfitMargin,
  calculateNetProfitMargin,
  calculateDaysSalesOutstanding,
  calculateArAging,
  calculateCagr,
  calculatePresentValue,
  calculateFutureValue,
  generateFinancialStatement,
  calculateWorkingCapital,
  calculateQuickRatio,
  calculateInventoryTurnover,
  calculateBreakEvenPoint,
} = require('./index.js');

console.log('🧪 Testing @titan-grove/financial Module');
console.log('=====================================');

try {
  // Test account creation
  console.log('\n📝 Testing Account Creation:');
  const account = createAccount(
    '1000',
    'Cash',
    'Asset',
    null
  );
  console.log('✅ Account created:', {
    id: account.id.substring(0, 8) + '...',
    code: account.accountCode,
    name: account.accountName,
    type: account.accountType
  });

  // Test balance calculation
  console.log('\n💰 Testing Balance Calculations:');
  const balance = calculateAccountBalance(1000, 500, 'Asset');
  console.log('✅ Asset balance (1000 debit - 500 credit):', balance);

  const liability_balance = calculateAccountBalance(200, 800, 'Liability');
  console.log('✅ Liability balance (200 debit - 800 credit):', liability_balance);

  // Test financial ratios
  console.log('\n📊 Testing Financial Ratios:');
  const currentRatio = calculateCurrentRatio(50000, 30000);
  console.log('✅ Current Ratio (50k assets / 30k liabilities):', currentRatio.toFixed(2));

  const debtEquityRatio = calculateDebtToEquityRatio(40000, 60000);
  console.log('✅ Debt-to-Equity Ratio (40k debt / 60k equity):', debtEquityRatio.toFixed(2));

  const roa = calculateReturnOnAssets(10000, 100000);
  console.log('✅ Return on Assets (10k income / 100k assets):', roa.toFixed(2) + '%');

  const roe = calculateReturnOnEquity(10000, 50000);
  console.log('✅ Return on Equity (10k income / 50k equity):', roe.toFixed(2) + '%');

  // Test profitability ratios
  console.log('\n💹 Testing Profitability Ratios:');
  const grossMargin = calculateGrossProfitMargin(30000, 100000);
  console.log('✅ Gross Profit Margin (30k profit / 100k revenue):', grossMargin.toFixed(2) + '%');

  const netMargin = calculateNetProfitMargin(15000, 100000);
  console.log('✅ Net Profit Margin (15k income / 100k revenue):', netMargin.toFixed(2) + '%');

  // Test DSO calculation
  console.log('\n📅 Testing Days Sales Outstanding:');
  const dso = calculateDaysSalesOutstanding(25000, 1000);
  console.log('✅ DSO (25k receivables / 1k daily sales):', dso.toFixed(1), 'days');

  // Test CAGR calculation
  console.log('\n📈 Testing Growth Calculations:');
  const cagr = calculateCagr(100000, 150000, 3);
  console.log('✅ CAGR (100k to 150k over 3 years):', cagr.toFixed(2) + '%');

  // Test time value of money
  console.log('\n⏰ Testing Time Value of Money:');
  const presentValue = calculatePresentValue(10000, 5, 2);
  console.log('✅ Present Value (10k future, 5% rate, 2 periods):', presentValue.toFixed(2));

  const futureValue = calculateFutureValue(9070.29, 5, 2);
  console.log('✅ Future Value (9070.29 present, 5% rate, 2 periods):', futureValue.toFixed(2));

  // Test working capital
  console.log('\n🏭 Testing Working Capital:');
  const workingCapital = calculateWorkingCapital(75000, 45000);
  console.log('✅ Working Capital (75k current assets - 45k current liabilities):', workingCapital);

  // Test quick ratio
  const quickRatio = calculateQuickRatio(35000, 45000);
  console.log('✅ Quick Ratio (35k quick assets / 45k current liabilities):', quickRatio.toFixed(2));

  // Test inventory turnover
  const inventoryTurnover = calculateInventoryTurnover(120000, 20000);
  console.log('✅ Inventory Turnover (120k COGS / 20k avg inventory):', inventoryTurnover.toFixed(1) + 'x');

  // Test break-even analysis
  console.log('\n⚖️ Testing Break-Even Analysis:');
  const breakEven = calculateBreakEvenPoint(50000, 100, 60);
  console.log('✅ Break-Even Point (50k fixed costs, $100 price, $60 variable cost):', breakEven.toFixed(0), 'units');

  // Test accounts receivable aging
  console.log('\n📋 Testing AR Aging:');
  const arRecords = [
    {
      id: '1',
      customerId: 'C1',
      invoiceNumber: 'INV-001',
      invoiceAmount: 1000,
      amountPaid: 0,
      amountDue: 1000,
      dueDate: '2024-01-15',
      daysOverdue: 0,
      agingBucket: 'Current'
    },
    {
      id: '2',
      customerId: 'C2',
      invoiceNumber: 'INV-002',
      invoiceAmount: 2000,
      amountPaid: 0,
      amountDue: 2000,
      dueDate: '2023-12-15',
      daysOverdue: 45,
      agingBucket: '31-60 Days'
    }
  ];

  const aging = calculateArAging(arRecords);
  console.log('✅ AR Aging Analysis:', aging);

  // Test journal entry creation
  console.log('\n📚 Testing Journal Entry:');
  const lineItems = [
    {
      id: '1',
      journalEntryId: '',
      accountId: 'acc-1',
      description: 'Cash deposit',
      debitAmount: 1000,
      creditAmount: 0,
      referenceNumber: 'DEP-001'
    },
    {
      id: '2',
      journalEntryId: '',
      accountId: 'acc-2',
      description: 'Revenue earned',
      debitAmount: 0,
      creditAmount: 1000,
      referenceNumber: 'REV-001'
    }
  ];

  const journalEntry = createJournalEntry(
    'Cash received for services',
    '2024-01-15',
    lineItems
  );
  console.log('✅ Journal Entry created:', {
    entryNumber: journalEntry.entryNumber,
    totalDebit: journalEntry.totalDebit,
    totalCredit: journalEntry.totalCredit,
    isBalanced: journalEntry.isBalanced
  });

  // Test financial statement generation
  console.log('\n📊 Testing Financial Statement Generation:');
  const accounts = [
    createAccount('1000', 'Cash', 'Asset', null),
    createAccount('2000', 'Accounts Payable', 'Liability', null),
    createAccount('3000', 'Owner Equity', 'Equity', null),
    createAccount('4000', 'Sales Revenue', 'Revenue', null),
    createAccount('5000', 'Operating Expenses', 'Expense', null)
  ];

  // Set some balances for demo
  accounts[0].currentBalance = 25000; // Cash
  accounts[1].currentBalance = 15000; // A/P
  accounts[2].currentBalance = 50000; // Equity
  accounts[3].currentBalance = 75000; // Revenue
  accounts[4].currentBalance = 40000; // Expenses

  const statement = generateFinancialStatement(
    '2024-01-01',
    '2024-12-31',
    accounts
  );
  console.log('✅ Financial Statement generated:', {
    totalAssets: statement.totalAssets,
    totalLiabilities: statement.totalLiabilities,
    totalEquity: statement.totalEquity,
    totalRevenue: statement.totalRevenue,
    totalExpenses: statement.totalExpenses,
    netIncome: statement.netIncome
  });

  console.log('\n🎉 All Financial Module Tests Completed Successfully!');
  console.log('\n📈 Performance Benefits:');
  console.log('   • Native Rust calculations for maximum speed');
  console.log('   • Comprehensive double-entry bookkeeping support');
  console.log('   • Advanced financial ratio analysis');
  console.log('   • Enterprise-grade accounting features');
  console.log('   • Seamless TypeScript integration');

} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}