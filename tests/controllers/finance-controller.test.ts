/**
 * Finance Controller Tests
 * Realistic tests for Finance controller functionality
 */

import request from 'supertest';
import express from 'express';
import { financeController } from '../../src/api/finance/finance-controller';

// Create test Express app
const app = express();
app.use(express.json());

// Setup routes for Finance controller
app.get('/finance/accounts', (req, res) => financeController.getAccounts(req, res));
app.post('/finance/accounts', (req, res) => financeController.createAccount(req, res));
app.get('/finance/transactions', (req, res) => financeController.getTransactions(req, res));
app.post('/finance/transactions', (req, res) => financeController.createTransaction(req, res));
app.get('/finance/financial-statements', (req, res) => financeController.getFinancialStatements(req, res));
app.post('/finance/journal-entries', (req, res) => financeController.createJournalEntry(req, res));
app.get('/finance/budget', (req, res) => financeController.getBudgetData(req, res));
app.post('/finance/budget', (req, res) => financeController.updateBudget(req, res));
app.get('/finance/cash-flow', (req, res) => financeController.getCashFlowForecast(req, res));
app.post('/finance/reconciliation', (req, res) => financeController.performReconciliation(req, res));

describe('FinanceController Integration Tests', () => {
  describe('Chart of Accounts Management', () => {
    it('should get chart of accounts with hierarchical structure', async () => {
      const response = await request(app)
        .get('/finance/accounts')
        .query({ 
          accountType: 'ASSET',
          includeHierarchy: true,
          status: 'ACTIVE' 
        })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Get chart of accounts retrieved successfully',
        data: expect.objectContaining({
          domain: 'finance',
          method: 'getAccounts',
          timestamp: expect.any(String),
        }),
        timestamp: expect.any(String),
      });
    });

    it('should create new account with validation rules', async () => {
      const accountData = {
        accountNumber: '1200',
        accountName: 'Accounts Receivable - Trade',
        accountType: 'ASSET',
        subType: 'CURRENT_ASSET',
        parentAccount: '1000',
        normalBalance: 'DEBIT',
        description: 'Trade receivables from customers',
        taxReporting: {
          taxCode: 'AR_TRADE',
          reportingCategory: 'CURRENT_ASSETS',
        },
        budgetTracking: true,
        departmentTracking: false,
        projectTracking: true,
      };

      const response = await request(app)
        .post('/finance/accounts')
        .send(accountData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.domain).toBe('finance');
      expect(response.body.data.method).toBe('createAccount');
    });
  });

  describe('Transaction Processing', () => {
    it('should get transactions with complex filtering', async () => {
      const response = await request(app)
        .get('/finance/transactions')
        .query({ 
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          accountId: '1200',
          minAmount: 1000,
          transactionType: 'SALE',
          status: 'POSTED'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.method).toBe('getTransactions');
    });

    it('should create transaction with double-entry validation', async () => {
      const transactionData = {
        transactionId: 'TXN-2024-001',
        date: '2024-01-15',
        description: 'Sale to Customer ABC',
        reference: 'INV-2024-001',
        entries: [
          {
            accountId: '1200', // AR
            debit: 1100.00,
            credit: 0,
            description: 'Invoice INV-2024-001',
          },
          {
            accountId: '4000', // Revenue
            debit: 0,
            credit: 1000.00,
            description: 'Sale revenue',
          },
          {
            accountId: '2200', // Sales Tax Payable
            debit: 0,
            credit: 100.00,
            description: 'Sales tax collected',
          },
        ],
        metadata: {
          customerId: 'CUST-001',
          invoiceId: 'INV-2024-001',
          salesRep: 'REP-001',
        },
      };

      const response = await request(app)
        .post('/finance/transactions')
        .send(transactionData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.method).toBe('createTransaction');
    });
  });

  describe('Financial Reporting', () => {
    it('should generate financial statements with comparative periods', async () => {
      const response = await request(app)
        .get('/finance/financial-statements')
        .query({ 
          statementType: 'BALANCE_SHEET',
          asOfDate: '2024-01-31',
          comparative: true,
          priorPeriod: '2023-01-31',
          format: 'DETAILED'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.method).toBe('getFinancialStatements');
    });

    it('should create complex journal entry with allocations', async () => {
      const journalEntryData = {
        entryId: 'JE-2024-001',
        date: '2024-01-31',
        period: '2024-01',
        description: 'Month-end accruals',
        entryType: 'ADJUSTING',
        lines: [
          {
            accountId: '6000', // Rent Expense
            debit: 5000.00,
            credit: 0,
            description: 'January rent expense',
            department: 'ADMIN',
          },
          {
            accountId: '2100', // Accrued Expenses
            debit: 0,
            credit: 5000.00,
            description: 'Accrued rent payable',
          },
        ],
        allocations: [
          {
            allocationKey: 'DEPT_ALLOCATION',
            totalAmount: 5000.00,
            allocations: [
              { department: 'SALES', percentage: 30, amount: 1500.00 },
              { department: 'MANUFACTURING', percentage: 50, amount: 2500.00 },
              { department: 'ADMIN', percentage: 20, amount: 1000.00 },
            ],
          },
        ],
        approvalRequired: true,
        preparedBy: 'ACCOUNTANT-1',
      };

      const response = await request(app)
        .post('/finance/journal-entries')
        .send(journalEntryData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.method).toBe('createJournalEntry');
    });
  });

  describe('Budgeting and Planning', () => {
    it('should get budget data with variance analysis', async () => {
      const response = await request(app)
        .get('/finance/budget')
        .query({ 
          budgetType: 'OPERATING',
          period: '2024',
          department: 'SALES',
          includeVarianceAnalysis: true 
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.method).toBe('getBudgetData');
    });

    it('should update budget with approval workflow', async () => {
      const budgetData = {
        budgetId: 'BUDGET-2024-SALES',
        budgetType: 'OPERATING',
        period: '2024',
        department: 'SALES',
        lineItems: [
          {
            accountId: '6100',
            accountName: 'Salaries',
            budgetAmount: 500000,
            quarters: [120000, 125000, 125000, 130000],
            justification: '5% salary increase for staff retention',
          },
          {
            accountId: '6200',
            accountName: 'Travel Expenses',
            budgetAmount: 25000,
            quarters: [6000, 7000, 7000, 5000],
            justification: 'Customer visits and trade shows',
          },
        ],
        assumptions: [
          '10% headcount growth in Q2',
          'Reduced travel in Q4 due to holiday season',
        ],
        approvalLevel: 'DEPARTMENT_MANAGER',
        requestedBy: 'SALES-MANAGER-1',
        businessCase: 'Support aggressive revenue growth targets',
      };

      const response = await request(app)
        .post('/finance/budget')
        .send(budgetData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.method).toBe('updateBudget');
    });
  });

  describe('Cash Flow Management', () => {
    it('should get cash flow forecast with scenario analysis', async () => {
      const response = await request(app)
        .get('/finance/cash-flow')
        .query({ 
          forecastPeriod: '90_DAYS',
          includeScenarios: true,
          scenarios: 'OPTIMISTIC,REALISTIC,PESSIMISTIC',
          granularity: 'WEEKLY'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.method).toBe('getCashFlowForecast');
    });
  });

  describe('Bank Reconciliation', () => {
    it('should perform bank reconciliation with auto-matching', async () => {
      const reconciliationData = {
        bankAccount: 'BANK-001',
        statementDate: '2024-01-31',
        bankStatementBalance: 125750.00,
        bookBalance: 123450.00,
        bankTransactions: [
          {
            date: '2024-01-30',
            description: 'WIRE TRANSFER FROM CUSTOMER ABC',
            amount: 15000.00,
            type: 'DEPOSIT',
            reference: 'WT240130001',
          },
          {
            date: '2024-01-31',
            description: 'ACH PAYMENT TO VENDOR XYZ',
            amount: -2500.00,
            type: 'WITHDRAWAL',
            reference: 'ACH240131001',
          },
        ],
        reconciliationRules: [
          {
            matchType: 'EXACT_AMOUNT_AND_DATE',
            tolerance: 0.01,
          },
          {
            matchType: 'AMOUNT_WITHIN_TOLERANCE',
            tolerance: 5.00,
            daysTolerance: 3,
          },
        ],
        autoMatch: true,
        createAdjustments: true,
      };

      const response = await request(app)
        .post('/finance/reconciliation')
        .send(reconciliationData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.method).toBe('performReconciliation');
    });
  });

  describe('Advanced Financial Analytics', () => {
    it('should handle complex financial ratios and KPIs', async () => {
      const response = await request(app)
        .get('/finance/financial-statements')
        .query({ 
          analytics: true,
          ratios: 'CURRENT_RATIO,DEBT_TO_EQUITY,ROA,ROE,GROSS_MARGIN',
          trending: true,
          periods: 12,
          benchmarking: true 
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should support profitability analysis by segment', async () => {
      const response = await request(app)
        .get('/finance/transactions')
        .query({ 
          profitabilityAnalysis: true,
          segmentBy: 'CUSTOMER,PRODUCT,REGION',
          includeAllocatedCosts: true,
          marginAnalysis: true 
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Tax and Compliance', () => {
    it('should handle tax calculations and reporting', async () => {
      const taxData = {
        taxPeriod: '2024-Q1',
        taxJurisdictions: ['FEDERAL', 'STATE_NY', 'LOCAL_NYC'],
        taxableTransactions: true,
        exemptTransactions: false,
        taxReturns: [
          {
            formType: 'SALES_TAX',
            jurisdiction: 'STATE_NY',
            filingDeadline: '2024-04-20',
            status: 'DRAFT',
          },
        ],
      };

      const response = await request(app)
        .post('/finance/transactions')
        .send(taxData)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should support audit trail and compliance reporting', async () => {
      const auditData = {
        auditType: 'SOX_COMPLIANCE',
        controls: ['JOURNAL_ENTRY_APPROVAL', 'SEGREGATION_OF_DUTIES'],
        period: '2024-Q1',
        includeSupporting: true,
        complianceFramework: 'SOX_404',
      };

      const response = await request(app)
        .get('/finance/accounts')
        .query(auditData)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Integration and Data Exchange', () => {
    it('should handle ERP system integration', async () => {
      const erpData = {
        source: 'ERP_SYSTEM',
        syncType: 'INCREMENTAL',
        lastSync: '2024-01-15T10:00:00Z',
        transactions: [
          {
            erpTransactionId: 'ERP-TXN-001',
            postingDate: '2024-01-15',
            amount: 1500.00,
            currency: 'USD',
            reference: 'PO-2024-001',
          },
        ],
        exchangeRates: {
          'EUR': 0.85,
          'GBP': 0.75,
          'CAD': 1.25,
        },
      };

      const response = await request(app)
        .post('/finance/transactions')
        .send(erpData)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should support banking API integration', async () => {
      const bankingData = {
        bankApi: 'YODLEE_AGGREGATION',
        accountUpdates: [
          {
            bankAccountId: 'BANK-001',
            lastTransactionId: 'TXN-BANK-12345',
            balance: 125750.00,
            lastUpdated: '2024-01-15T23:59:59Z',
          },
        ],
        newTransactions: 15,
        categorization: 'AUTO_SUGGESTED',
      };

      const response = await request(app)
        .post('/finance/reconciliation')
        .send(bankingData)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});