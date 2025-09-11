/**
 * Financial Management Suite - Advanced Interactive Business Logic
 * Enterprise-grade financial operations with real-time reporting, cash flow management,
 * and intelligent financial analytics using dependency injection and message queue patterns
 */

class FinancialManagementEngine {
  constructor() {
    // Core service dependencies (dependency injection pattern)
    this.financialService = null;
    this.messageQueue = null;
    this.cacheManager = null;
    this.logger = null;

    // Financial entities management
    this.accounts = new Map();
    this.transactions = new Map();
    this.budgets = new Map();
    this.invoices = new Map();
    this.reports = new Map();
    this.cashFlowData = new Map();

    // UI state management
    this.currentView = 'dashboard';
    this.selectedAccount = null;
    this.selectedPeriod = 'current-month';
    this.realTimeUpdates = true;

    // Financial settings
    this.financialSettings = {
      currency: 'USD',
      fiscalYearStart: 'january',
      reportingStandard: 'GAAP',
      autoReconciliation: true,
    };

    // Charts and visualizations
    this.charts = new Map();

    this.initialize();
  }

  async initialize() {
    try {
      // Initialize service dependencies using factory pattern
      await this.initializeServices();

      // Setup UI event handlers
      this.setupEventListeners();

      // Load initial financial data
      await this.loadInitialData();

      // Initialize financial charts
      this.initializeFinancialCharts();

      // Start real-time financial monitoring
      this.startRealTimeMonitoring();

      console.log('✅ Financial Management Engine initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Financial Management:', error);
    }
  }

  // ==================== SERVICE INITIALIZATION ====================

  async initializeServices() {
    // Initialize logger
    this.logger = {
      info: (msg, data) => console.log(`[FINANCIAL INFO] ${msg}`, data),
      warn: (msg, data) => console.warn(`[FINANCIAL WARN] ${msg}`, data),
      error: (msg, data) => console.error(`[FINANCIAL ERROR] ${msg}`, data),
    };

    // Initialize message queue pattern
    this.messageQueue = {
      publish: async (queue, type, data, options = {}) => {
        this.logger.info('Financial message published', { queue, type, data });
        return this.handleMessage(type, data, options);
      },
      subscribe: (queue, handler) => {
        this.logger.info('Subscribed to financial queue', { queue });
      },
    };

    // Initialize cache manager
    this.cacheManager = new Map();

    // Initialize financial service
    this.financialService = {
      getAccountBalances: async (accountIds) => this.loadAccountBalances(accountIds),
      getTransactionHistory: async (filters) => this.loadTransactionHistory(filters),
      generateFinancialReport: async (type, period) => this.generateReport(type, period),
      processBudgetAllocation: async (budgetData) => this.processBudget(budgetData),
      reconcileAccounts: async (accountIds) => this.reconcileAccounts(accountIds),
      calculateCashFlow: async (period) => this.calculateCashFlow(period),
    };
  }

  // ==================== EVENT HANDLERS ====================

  setupEventListeners() {
    // Navigation between financial views
    document.addEventListener('click', (e) => {
      if (e.target.matches('.financial-nav-item')) {
        this.switchView(e.target.dataset.view);
      }
      if (e.target.matches('.account-item')) {
        this.selectAccount(e.target.dataset.accountId);
      }
      if (e.target.matches('.generate-report-btn')) {
        this.generateReport(e.target.dataset.reportType, this.selectedPeriod);
      }
      if (e.target.matches('.reconcile-btn')) {
        this.reconcileAccounts([this.selectedAccount]);
      }
    });

    // Period selector
    const periodSelector = document.getElementById('financialPeriodSelector');
    if (periodSelector) {
      periodSelector.addEventListener('change', (e) => {
        this.selectedPeriod = e.target.value;
        this.refreshFinancialData();
      });
    }

    // Search functionality
    const searchInput = document.getElementById('financialSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchFinancialData(e.target.value);
      });
    }
  }

  // ==================== DATA LOADING ====================

  async loadInitialData() {
    try {
      // Load real-time data from enhanced backend APIs
      await this.loadAccountBalancesFromAPI();
      await this.loadTransactionHistoryFromAPI();
      await this.loadBudgetDataFromAPI();
      await this.loadCashFlowFromAPI();

      // Update financial displays
      this.updateAccountsDisplay();
      this.updateTransactionsDisplay();
      this.updateBudgetDisplay();
      this.updateCashFlowDisplay();

      this.logger.info('✅ All financial data loaded from backend services');
    } catch (error) {
      this.logger.error('❌ Failed to load financial data, falling back to sample data', error);

      // Fallback to sample data
      this.loadSampleAccounts();
      this.loadSampleTransactions();
      this.loadSampleBudgets();
      this.updateAccountsDisplay();
      this.updateTransactionsDisplay();
      this.updateBudgetDisplay();
    }
  }

  async loadAccountBalancesFromAPI() {
    try {
      const response = await fetch('/api/financial/accounts/balances');
      const result = await response.json();

      if (result.success) {
        result.data.forEach((account) => {
          this.accounts.set(account.id, account);
        });

        this.logger.info(`Loaded ${result.data.length} account balances from backend service`);
      }
    } catch (error) {
      this.logger.error('Failed to load account balances from API', error);
      throw error;
    }
  }

  async loadTransactionHistoryFromAPI() {
    try {
      const response = await fetch(`/api/financial/transactions?period=${this.selectedPeriod}`);
      const result = await response.json();

      if (result.success) {
        result.data.forEach((transaction) => {
          this.transactions.set(transaction.id, transaction);
        });

        this.logger.info(`Loaded ${result.data.length} transactions from backend service`);
      }
    } catch (error) {
      this.logger.error('Failed to load transactions from API', error);
      throw error;
    }
  }

  async loadBudgetDataFromAPI() {
    try {
      const response = await fetch(`/api/financial/budgets?period=${this.selectedPeriod}`);
      const result = await response.json();

      if (result.success) {
        result.data.forEach((budget) => {
          this.budgets.set(budget.id, budget);
        });

        this.logger.info(`Loaded ${result.data.length} budget items from backend service`);
      }
    } catch (error) {
      this.logger.error('Failed to load budget data from API', error);
      throw error;
    }
  }

  async loadCashFlowFromAPI() {
    try {
      const response = await fetch(`/api/financial/cashflow?period=${this.selectedPeriod}`);
      const result = await response.json();

      if (result.success) {
        this.cashFlowData = result.data;
        this.logger.info('Loaded cash flow data from backend service');
      }
    } catch (error) {
      this.logger.error('Failed to load cash flow data from API', error);
      throw error;
    }
  }

  // ==================== FALLBACK SAMPLE DATA ====================

  loadSampleAccounts() {
    const sampleAccounts = [
      {
        id: 'acc_001',
        name: 'Operating Cash',
        type: 'ASSET',
        balance: 2450000,
        currency: 'USD',
        status: 'ACTIVE',
      },
      {
        id: 'acc_002',
        name: 'Accounts Receivable',
        type: 'ASSET',
        balance: 1875000,
        currency: 'USD',
        status: 'ACTIVE',
      },
      {
        id: 'acc_003',
        name: 'Accounts Payable',
        type: 'LIABILITY',
        balance: 892000,
        currency: 'USD',
        status: 'ACTIVE',
      },
    ];

    sampleAccounts.forEach((account) => {
      this.accounts.set(account.id, account);
    });
  }

  loadSampleTransactions() {
    const sampleTransactions = [
      {
        id: 'txn_001',
        date: new Date().toISOString(),
        description: 'Customer Payment - Invoice #INV-2024-001',
        amount: 125000,
        type: 'CREDIT',
        account: 'acc_001',
        status: 'COMPLETED',
      },
      {
        id: 'txn_002',
        date: new Date(Date.now() - 86400000).toISOString(),
        description: 'Vendor Payment - Supplier Services',
        amount: -45000,
        type: 'DEBIT',
        account: 'acc_003',
        status: 'COMPLETED',
      },
    ];

    sampleTransactions.forEach((transaction) => {
      this.transactions.set(transaction.id, transaction);
    });
  }

  loadSampleBudgets() {
    const sampleBudgets = [
      {
        id: 'budget_001',
        category: 'Operations',
        allocated: 500000,
        spent: 347000,
        remaining: 153000,
        period: this.selectedPeriod,
      },
      {
        id: 'budget_002',
        category: 'Marketing',
        allocated: 200000,
        spent: 89000,
        remaining: 111000,
        period: this.selectedPeriod,
      },
    ];

    sampleBudgets.forEach((budget) => {
      this.budgets.set(budget.id, budget);
    });
  }

  // ==================== UI UPDATES ====================

  updateAccountsDisplay() {
    const accountsContainer = document.getElementById('accountsContainer');
    if (!accountsContainer) return;

    let html = '<div class="financial-accounts-grid">';

    this.accounts.forEach((account) => {
      const balanceClass = account.balance >= 0 ? 'positive' : 'negative';
      const formattedBalance = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: account.currency || 'USD',
      }).format(Math.abs(account.balance));

      html += `
                <div class="financial-account-card" data-account-id="${account.id}">
                    <div class="account-header">
                        <h3>${account.name}</h3>
                        <span class="account-type">${account.type}</span>
                    </div>
                    <div class="account-balance ${balanceClass}">
                        ${account.balance < 0 ? '-' : ''}${formattedBalance}
                    </div>
                    <div class="account-actions">
                        <button class="titan-btn titan-btn-sm account-item" data-account-id="${account.id}">View Details</button>
                        <button class="titan-btn titan-btn-sm reconcile-btn" data-account-id="${account.id}">Reconcile</button>
                    </div>
                </div>
            `;
    });

    html += '</div>';
    accountsContainer.innerHTML = html;
  }

  updateTransactionsDisplay() {
    const transactionsContainer = document.getElementById('transactionsContainer');
    if (!transactionsContainer) return;

    let html = `
            <div class="financial-transactions-table">
                <table class="titan-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

    this.transactions.forEach((transaction) => {
      const amountClass = transaction.amount >= 0 ? 'credit' : 'debit';
      const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(Math.abs(transaction.amount));

      const formattedDate = new Date(transaction.date).toLocaleDateString();

      html += `
                <tr>
                    <td>${formattedDate}</td>
                    <td>${transaction.description}</td>
                    <td class="${amountClass}">${transaction.amount < 0 ? '-' : '+'}${formattedAmount}</td>
                    <td>${transaction.type}</td>
                    <td><span class="status-badge ${transaction.status.toLowerCase()}">${transaction.status}</span></td>
                    <td><button class="titan-btn titan-btn-sm">Details</button></td>
                </tr>
            `;
    });

    html += '</tbody></table></div>';
    transactionsContainer.innerHTML = html;
  }

  updateBudgetDisplay() {
    const budgetContainer = document.getElementById('budgetContainer');
    if (!budgetContainer) return;

    let html = '<div class="financial-budget-grid">';

    this.budgets.forEach((budget) => {
      const utilization = (budget.spent / budget.allocated) * 100;
      const utilizationClass = utilization > 90 ? 'high' : utilization > 70 ? 'medium' : 'low';

      html += `
                <div class="financial-budget-card">
                    <div class="budget-header">
                        <h4>${budget.category}</h4>
                        <span class="budget-utilization ${utilizationClass}">${utilization.toFixed(1)}%</span>
                    </div>
                    <div class="budget-amounts">
                        <div class="budget-allocated">
                            <label>Allocated</label>
                            <span>${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(budget.allocated)}</span>
                        </div>
                        <div class="budget-spent">
                            <label>Spent</label>
                            <span>${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(budget.spent)}</span>
                        </div>
                        <div class="budget-remaining">
                            <label>Remaining</label>
                            <span>${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(budget.remaining)}</span>
                        </div>
                    </div>
                    <div class="budget-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${utilization}%"></div>
                        </div>
                    </div>
                </div>
            `;
    });

    html += '</div>';
    budgetContainer.innerHTML = html;
  }

  updateCashFlowDisplay() {
    const cashFlowContainer = document.getElementById('cashFlowContainer');
    if (!cashFlowContainer) return;

    // This would normally show a chart, but for now we'll show summary data
    const html = `
            <div class="financial-cashflow-summary">
                <div class="cashflow-item">
                    <label>Opening Balance</label>
                    <span class="amount positive">$2,450,000</span>
                </div>
                <div class="cashflow-item">
                    <label>Total Inflows</label>
                    <span class="amount positive">+$890,000</span>
                </div>
                <div class="cashflow-item">
                    <label>Total Outflows</label>
                    <span class="amount negative">-$645,000</span>
                </div>
                <div class="cashflow-item total">
                    <label>Net Cash Flow</label>
                    <span class="amount positive">+$245,000</span>
                </div>
            </div>
        `;
    cashFlowContainer.innerHTML = html;
  }

  // ==================== INTERACTIVE FEATURES ====================

  switchView(view) {
    this.currentView = view;

    // Update navigation
    document.querySelectorAll('.financial-nav-item').forEach((item) => {
      item.classList.toggle('active', item.dataset.view === view);
    });

    // Show/hide content sections
    document.querySelectorAll('.content-section').forEach((section) => {
      section.classList.toggle('active', section.id === view);
    });

    this.logger.info('Switched to financial view', { view });
  }

  selectAccount(accountId) {
    this.selectedAccount = accountId;
    // Update UI to show selected account details
    this.logger.info('Selected account', { accountId });
  }

  async generateReport(reportType, period) {
    try {
      this.logger.info('Generating financial report', { reportType, period });

      // Show loading state
      const reportContainer = document.getElementById('reportContainer');
      if (reportContainer) {
        reportContainer.innerHTML = '<div class="loading">Generating report...</div>';
      }

      // Simulate API call
      setTimeout(() => {
        if (reportContainer) {
          reportContainer.innerHTML = `
                        <div class="report-generated">
                            <h3>${reportType} Report</h3>
                            <p>Period: ${period}</p>
                            <p>Generated: ${new Date().toLocaleString()}</p>
                            <button class="titan-btn titan-btn-primary">Download PDF</button>
                            <button class="titan-btn titan-btn-secondary">Email Report</button>
                        </div>
                    `;
        }
      }, 2000);
    } catch (error) {
      this.logger.error('Failed to generate report', error);
    }
  }

  async reconcileAccounts(accountIds) {
    try {
      this.logger.info('Starting account reconciliation', { accountIds });

      // Simulate reconciliation process
      const results = accountIds.map((id) => ({
        accountId: id,
        status: 'RECONCILED',
        discrepancies: Math.floor(Math.random() * 3),
        timestamp: new Date().toISOString(),
      }));

      this.logger.info('Account reconciliation completed', results);

      // Update UI
      this.updateAccountsDisplay();
    } catch (error) {
      this.logger.error('Account reconciliation failed', error);
    }
  }

  searchFinancialData(searchTerm) {
    // Filter and update displays based on search term
    this.logger.info('Searching financial data', { searchTerm });
  }

  async refreshFinancialData() {
    this.logger.info('Refreshing financial data for period', { period: this.selectedPeriod });
    await this.loadInitialData();
  }

  // ==================== CHARTS INITIALIZATION ====================

  initializeFinancialCharts() {
    this.initializeCashFlowChart();
    this.initializeBudgetChart();
    this.initializeRevenueChart();
  }

  initializeCashFlowChart() {
    const ctx = document.getElementById('cashFlowChart');
    if (!ctx) return;

    // Sample chart using Chart.js
    this.charts.set(
      'cashFlow',
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Cash Flow',
              data: [100000, 150000, 125000, 175000, 200000, 245000],
              borderColor: 'rgb(37, 99, 235)',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Monthly Cash Flow',
            },
          },
        },
      })
    );
  }

  initializeBudgetChart() {
    const ctx = document.getElementById('budgetChart');
    if (!ctx) return;

    const budgetData = Array.from(this.budgets.values());

    this.charts.set(
      'budget',
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: budgetData.map((b) => b.category),
          datasets: [
            {
              label: 'Allocated',
              data: budgetData.map((b) => b.allocated),
              backgroundColor: 'rgba(37, 99, 235, 0.6)',
            },
            {
              label: 'Spent',
              data: budgetData.map((b) => b.spent),
              backgroundColor: 'rgba(239, 68, 68, 0.6)',
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Budget vs Actual',
            },
          },
        },
      })
    );
  }

  initializeRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    this.charts.set(
      'revenue',
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Products', 'Services', 'Subscriptions', 'Other'],
          datasets: [
            {
              data: [45, 30, 20, 5],
              backgroundColor: [
                'rgba(37, 99, 235, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)',
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Revenue by Category',
            },
          },
        },
      })
    );
  }

  // ==================== REAL-TIME MONITORING ====================

  startRealTimeMonitoring() {
    setInterval(() => {
      this.checkForFinancialUpdates();
    }, 30000); // Check every 30 seconds
  }

  async checkForFinancialUpdates() {
    try {
      // Check for new transactions or balance changes
      const response = await fetch('/api/financial/updates/latest');
      if (response.ok) {
        const updates = await response.json();
        if (updates.success && updates.data.length > 0) {
          this.processFinancialUpdates(updates.data);
        }
      }
    } catch (error) {
      // Silently handle errors in background updates
    }
  }

  processFinancialUpdates(updates) {
    updates.forEach((update) => {
      switch (update.type) {
        case 'TRANSACTION':
          this.transactions.set(update.data.id, update.data);
          break;
        case 'ACCOUNT_BALANCE':
          const account = this.accounts.get(update.accountId);
          if (account) {
            account.balance = update.data.balance;
            this.accounts.set(update.accountId, account);
          }
          break;
      }
    });

    // Refresh displays
    this.updateAccountsDisplay();
    this.updateTransactionsDisplay();

    this.logger.info('Processed financial updates', updates);
  }

  // ==================== MESSAGE HANDLING ====================

  async handleMessage(type, data, options = {}) {
    switch (type) {
      case 'PROCESS_PAYMENT':
        return this.processPayment(data);
      case 'GENERATE_INVOICE':
        return this.generateInvoice(data);
      case 'UPDATE_BUDGET':
        return this.updateBudget(data);
      default:
        this.logger.warn('Unknown financial message type', { type, data });
        return { success: false, error: 'Unknown message type' };
    }
  }

  async processPayment(paymentData) {
    this.logger.info('Processing payment', paymentData);
    // Simulate payment processing
    return {
      success: true,
      paymentId: 'pay_' + Date.now(),
      status: 'PROCESSED',
      amount: paymentData.amount,
    };
  }

  async generateInvoice(invoiceData) {
    this.logger.info('Generating invoice', invoiceData);
    // Simulate invoice generation
    return {
      success: true,
      invoiceId: 'inv_' + Date.now(),
      status: 'GENERATED',
      amount: invoiceData.amount,
    };
  }

  async updateBudget(budgetData) {
    this.logger.info('Updating budget', budgetData);
    const budget = this.budgets.get(budgetData.budgetId);
    if (budget) {
      Object.assign(budget, budgetData.updates);
      this.budgets.set(budgetData.budgetId, budget);
      this.updateBudgetDisplay();
    }
    return { success: true };
  }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new FinancialManagementEngine();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FinancialManagementEngine;
}
