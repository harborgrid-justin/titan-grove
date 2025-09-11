/**
 * Spend Analysis JavaScript
 * Handles spend analytics, charts, and interactive features
 */

class SpendAnalysisManager {
  constructor() {
    this.spendData = null;
    this.charts = {};
    this.init();
  }

  async init() {
    await this.loadSpendData();
    this.setupCharts();
    this.setupEventListeners();
    this.updateKPIs();
    console.log('📊 Spend Analysis Manager initialized');
  }

  async loadSpendData() {
    // Mock spend data - in real app would fetch from API
    this.spendData = {
      totalSpend: 12500000,
      monthlySpend: 1250000,
      costSavings: 485000,
      targetSavings: 600000,
      supplierCount: 247,
      categories: [
        {
          name: 'Manufacturing',
          amount: 4500000,
          percentage: 36,
          previousYear: 4100000,
          suppliers: 45,
          avgOrderValue: 25500,
        },
        {
          name: 'Technology',
          amount: 3200000,
          percentage: 25.6,
          previousYear: 2950000,
          suppliers: 28,
          avgOrderValue: 35800,
        },
        {
          name: 'Services',
          amount: 2800000,
          percentage: 22.4,
          previousYear: 2750000,
          suppliers: 67,
          avgOrderValue: 18200,
        },
        {
          name: 'Materials',
          amount: 2000000,
          percentage: 16,
          previousYear: 2100000,
          suppliers: 107,
          avgOrderValue: 12800,
        },
      ],
      suppliers: [
        {
          name: 'Acme Manufacturing Inc.',
          category: 'Manufacturing',
          amount: 2500000,
          percentage: 20,
          trend: 8,
        },
        {
          name: 'Global Tech Solutions',
          category: 'Technology',
          amount: 1800000,
          percentage: 14.4,
          trend: 12,
        },
        {
          name: 'Industrial Parts Corp',
          category: 'Parts',
          amount: 1500000,
          percentage: 12,
          trend: -3,
        },
        {
          name: 'Quality Components Ltd',
          category: 'Components',
          amount: 1200000,
          percentage: 9.6,
          trend: 5,
        },
        { name: 'Others', category: 'Various', amount: 5500000, percentage: 44, trend: 0 },
      ],
      monthlyTrend: [
        { month: 'Jan', spend: 980000 },
        { month: 'Feb', spend: 1050000 },
        { month: 'Mar', spend: 1150000 },
        { month: 'Apr', spend: 1200000 },
        { month: 'May', spend: 1100000 },
        { month: 'Jun', spend: 1300000 },
        { month: 'Jul', spend: 1250000 },
        { month: 'Aug', spend: 1180000 },
        { month: 'Sep', spend: 1250000 },
        { month: 'Oct', spend: 1350000 },
        { month: 'Nov', spend: 1400000 },
        { month: 'Dec', spend: 1250000 },
      ],
      savings: {
        negotiated: 360000,
        costAvoidance: 125000,
      },
    };
  }

  setupCharts() {
    this.setupCategoryChart();
    this.setupTrendChart();
  }

  setupCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    this.charts.category = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.spendData.categories.map((cat) => cat.name),
        datasets: [
          {
            data: this.spendData.categories.map((cat) => cat.amount),
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
            borderWidth: 0,
            hoverBorderWidth: 2,
            hoverBorderColor: '#ffffff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.parsed;
                const percentage = ((value / this.spendData.totalSpend) * 100).toFixed(1);
                return `${context.label}: $${(value / 1000000).toFixed(1)}M (${percentage}%)`;
              },
            },
          },
        },
        cutout: '60%',
      },
    });
  }

  setupTrendChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;

    this.charts.trend = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.spendData.monthlyTrend.map((item) => item.month),
        datasets: [
          {
            label: 'Monthly Spend',
            data: this.spendData.monthlyTrend.map((item) => item.spend),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `Spend: $${(context.parsed.y / 1000000).toFixed(2)}M`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: function (value) {
                return '$' + (value / 1000000).toFixed(1) + 'M';
              },
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  setupEventListeners() {
    // Chart control buttons
    document.querySelectorAll('.btn-chart').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        this.handleChartPeriodChange(e.target);
      });
    });

    // Export button
    document.querySelectorAll('.procurement-btn').forEach((btn) => {
      if (btn.textContent.includes('Export')) {
        btn.addEventListener('click', () => {
          this.exportSpendReport();
        });
      }
    });

    // Table search
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleTableSearch(e.target.value);
      });
    }

    // Category filter
    const categoryFilter = document.querySelector('.table-controls select');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', (e) => {
        this.handleCategoryFilter(e.target.value);
      });
    }

    // Supplier items click
    document.querySelectorAll('.supplier-spend-item').forEach((item) => {
      item.addEventListener('click', () => {
        this.showSupplierDetails(item);
      });
    });
  }

  updateKPIs() {
    // Calculate year-over-year growth
    const previousYearTotal = this.spendData.categories.reduce(
      (sum, cat) => sum + cat.previousYear,
      0
    );
    const yoyGrowth = (
      ((this.spendData.totalSpend - previousYearTotal) / previousYearTotal) *
      100
    ).toFixed(1);

    // Update KPI cards
    const kpiCards = document.querySelectorAll('.spend-kpi-card');
    if (kpiCards.length >= 4) {
      // Total Spend
      kpiCards[0].querySelector('.spend-kpi-value').textContent =
        `$${(this.spendData.totalSpend / 1000000).toFixed(1)}M`;
      kpiCards[0].querySelector('.spend-kpi-change').innerHTML =
        `<i class="fas fa-arrow-up"></i> ${yoyGrowth}% vs last year`;

      // Monthly Spend
      kpiCards[1].querySelector('.spend-kpi-value').textContent =
        `$${(this.spendData.monthlySpend / 1000000).toFixed(2)}M`;

      // Cost Savings
      kpiCards[2].querySelector('.spend-kpi-value').textContent =
        `$${(this.spendData.costSavings / 1000).toFixed(0)}K`;
      const savingsRate = (
        (this.spendData.costSavings / this.spendData.targetSavings) *
        100
      ).toFixed(1);
      kpiCards[2].querySelector('.spend-kpi-change').innerHTML =
        `<i class="fas fa-arrow-up"></i> ${savingsRate}% achieved`;

      // Suppliers
      kpiCards[3].querySelector('.spend-kpi-value').textContent = this.spendData.supplierCount;
    }
  }

  handleChartPeriodChange(button) {
    // Update active button
    document.querySelectorAll('.btn-chart').forEach((btn) => {
      btn.classList.remove('active');
    });
    button.classList.add('active');

    // Update chart based on selection
    const period = button.textContent.toLowerCase();
    if (period === 'quarterly') {
      this.updateTrendChartToQuarterly();
    } else {
      this.updateTrendChartToMonthly();
    }
  }

  updateTrendChartToQuarterly() {
    const quarterlyData = [
      { quarter: 'Q1', spend: 3180000 },
      { quarter: 'Q2', spend: 3600000 },
      { quarter: 'Q3', spend: 3680000 },
      { quarter: 'Q4', spend: 4000000 },
    ];

    this.charts.trend.data.labels = quarterlyData.map((item) => item.quarter);
    this.charts.trend.data.datasets[0].data = quarterlyData.map((item) => item.spend);
    this.charts.trend.update();
  }

  updateTrendChartToMonthly() {
    this.charts.trend.data.labels = this.spendData.monthlyTrend.map((item) => item.month);
    this.charts.trend.data.datasets[0].data = this.spendData.monthlyTrend.map((item) => item.spend);
    this.charts.trend.update();
  }

  handleTableSearch(query) {
    const rows = document.querySelectorAll('.spend-table tbody tr');
    const searchTerm = query.toLowerCase();

    rows.forEach((row) => {
      const categoryText = row.querySelector('.category-cell').textContent.toLowerCase();
      const matches = categoryText.includes(searchTerm);
      row.style.display = matches ? '' : 'none';
    });

    console.log(`🔍 Table search: "${query}"`);
  }

  handleCategoryFilter(category) {
    const rows = document.querySelectorAll('.spend-table tbody tr');

    rows.forEach((row) => {
      const categoryText = row.querySelector('.category-cell').textContent.trim();
      const matches = category === 'All Categories' || categoryText.includes(category);
      row.style.display = matches ? '' : 'none';
    });

    console.log(`🔽 Category filter: ${category}`);
  }

  showSupplierDetails(item) {
    const supplierName = item.querySelector('.supplier-name').textContent;
    const supplier = this.spendData.suppliers.find((s) => s.name === supplierName);

    if (!supplier) return;

    const modal = this.createModal(
      'Supplier Spend Details',
      `
            <div class="supplier-spend-details">
                <div class="supplier-header">
                    <h3>${supplier.name}</h3>
                    <span class="supplier-category">${supplier.category}</span>
                </div>
                
                <div class="spend-metrics">
                    <div class="metric-item">
                        <div class="metric-label">Total Spend</div>
                        <div class="metric-value">$${(supplier.amount / 1000000).toFixed(1)}M</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-label">% of Total Spend</div>
                        <div class="metric-value">${supplier.percentage}%</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-label">YoY Growth</div>
                        <div class="metric-value ${supplier.trend >= 0 ? 'positive' : 'negative'}">
                            ${supplier.trend >= 0 ? '+' : ''}${supplier.trend}%
                        </div>
                    </div>
                </div>
                
                <div class="spend-breakdown">
                    <h4>Spend Breakdown (Last 12 Months)</h4>
                    <div class="breakdown-chart">
                        <!-- Mini chart would go here -->
                        <canvas id="supplierBreakdownChart" width="300" height="150"></canvas>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="spendManager.closeModal()">
                        Close
                    </button>
                    <button class="btn btn-primary" onclick="spendManager.viewSupplierProfile('${supplier.name}')">
                        View Full Profile
                    </button>
                </div>
            </div>
        `
    );

    this.showModal(modal);

    // Setup mini chart for supplier
    setTimeout(() => {
      this.setupSupplierBreakdownChart(supplier);
    }, 100);
  }

  setupSupplierBreakdownChart(supplier) {
    const ctx = document.getElementById('supplierBreakdownChart');
    if (!ctx) return;

    // Generate mock monthly data for supplier
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const baseAmount = supplier.amount / 12;
      const variation = (Math.random() - 0.5) * 0.3;
      return Math.round(baseAmount * (1 + variation));
    });

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        datasets: [
          {
            data: monthlyData,
            backgroundColor: '#3b82f6',
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            display: false,
          },
          x: {
            display: false,
          },
        },
      },
    });
  }

  viewSupplierProfile(supplierName) {
    this.closeModal();
    // In real app, would navigate to supplier profile page
    console.log(`🔗 Navigate to supplier profile: ${supplierName}`);
    this.showNotification(`Navigating to ${supplierName} profile...`, 'info');
  }

  exportSpendReport() {
    // Generate comprehensive spend report
    const reportData = {
      summary: {
        totalSpend: this.spendData.totalSpend,
        monthlySpend: this.spendData.monthlySpend,
        costSavings: this.spendData.costSavings,
        supplierCount: this.spendData.supplierCount,
      },
      categories: this.spendData.categories,
      suppliers: this.spendData.suppliers,
      monthlyTrend: this.spendData.monthlyTrend,
      generatedAt: new Date().toISOString(),
    };

    // Convert to CSV format
    const csvContent = this.generateSpendReportCSV(reportData);
    this.downloadCSV(csvContent, 'spend-analysis-report.csv');

    this.showNotification('Spend analysis report exported successfully!', 'success');
    console.log('📊 Spend report exported');
  }

  generateSpendReportCSV(data) {
    let csv = 'Spend Analysis Report\n\n';

    // Summary section
    csv += 'Summary\n';
    csv += 'Metric,Value\n';
    csv += `Total Spend,$${(data.summary.totalSpend / 1000000).toFixed(2)}M\n`;
    csv += `Monthly Spend,$${(data.summary.monthlySpend / 1000000).toFixed(2)}M\n`;
    csv += `Cost Savings,$${(data.summary.costSavings / 1000).toFixed(0)}K\n`;
    csv += `Supplier Count,${data.summary.supplierCount}\n\n`;

    // Categories section
    csv += 'Spend by Category\n';
    csv += 'Category,Current Spend,Previous Year,Change %,% of Total,Suppliers,Avg Order Value\n';
    data.categories.forEach((cat) => {
      const change = (((cat.amount - cat.previousYear) / cat.previousYear) * 100).toFixed(1);
      csv += `${cat.name},$${(cat.amount / 1000000).toFixed(2)}M,$${(cat.previousYear / 1000000).toFixed(2)}M,${change}%,${cat.percentage}%,${cat.suppliers},$${cat.avgOrderValue.toLocaleString()}\n`;
    });

    csv += '\n';

    // Top suppliers section
    csv += 'Top Suppliers\n';
    csv += 'Supplier,Category,Spend,% of Total,YoY Growth\n';
    data.suppliers.forEach((supplier) => {
      csv += `${supplier.name},${supplier.category},$${(supplier.amount / 1000000).toFixed(2)}M,${supplier.percentage}%,${supplier.trend}%\n`;
    });

    return csv;
  }

  // Utility methods
  createModal(title, content) {
    return `
            <div class="modal-overlay" onclick="spendManager.closeModal()">
                <div class="modal-dialog" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <button class="modal-close" onclick="spendManager.closeModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                </div>
            </div>
        `;
  }

  showModal(modalHtml) {
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
      existingModal.remove();
    }

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
      modal.remove();
      document.body.style.overflow = '';
    }
  }

  showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const spendManager = new SpendAnalysisManager();

  // Make available globally for HTML onclick handlers
  window.spendManager = spendManager;

  console.log('🚀 Spend Analysis System Ready');
});

// Add spend analysis specific styles
const spendStyles = `
<style>
/* Spend Analysis Specific Styles */
.spend-kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.spend-kpi-card {
    background: linear-gradient(135deg, #ffffff, #f8fafc);
    border-radius: 1rem;
    padding: 1.5rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.spend-kpi-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.spend-kpi-header h3 {
    margin: 0;
    color: #64748b;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
}

.spend-kpi-header i {
    color: #3b82f6;
    font-size: 1.25rem;
}

.spend-kpi-value {
    font-size: 2rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.5rem;
}

.spend-kpi-change {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
}

.spend-kpi-change.positive {
    color: #059669;
}

.spend-kpi-change.negative {
    color: #dc2626;
}

.spend-kpi-change.neutral {
    color: #64748b;
}

.spend-analytics-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 2rem;
}

.chart-card {
    grid-column: span 6;
}

.spend-table-card {
    grid-column: span 12;
}

.chart-container {
    position: relative;
    height: 300px;
    margin: 1rem 0;
}

.chart-controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.btn-chart {
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-chart.active,
.btn-chart:hover {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
}

.category-legend {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: #f8fafc;
    border-radius: 0.5rem;
    justify-content: space-between;
}

.legend-color {
    width: 1rem;
    height: 1rem;
    border-radius: 0.25rem;
}

.legend-item span {
    flex: 1;
    font-size: 0.875rem;
    color: #64748b;
}

.legend-item strong {
    color: #1e293b;
    font-weight: 600;
}

.supplier-spend-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.supplier-spend-item {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    align-items: center;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
}

.supplier-spend-item:hover {
    background: #e2e8f0;
    transform: translateY(-1px);
}

.supplier-name {
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.25rem;
}

.supplier-category {
    font-size: 0.875rem;
    color: #64748b;
}

.spend-amount {
    font-weight: 600;
    color: #1e293b;
    text-align: right;
}

.spend-percentage {
    color: #64748b;
    text-align: right;
}

.spend-trend {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.25rem;
    font-weight: 500;
}

.spend-trend.positive {
    color: #059669;
}

.spend-trend.negative {
    color: #dc2626;
}

.spend-trend.neutral {
    color: #64748b;
}

.savings-progress {
    margin: 1rem 0;
}

.savings-bar {
    height: 0.75rem;
    background: #e2e8f0;
    border-radius: 0.375rem;
    overflow: hidden;
    margin-bottom: 0.5rem;
}

.savings-achieved {
    height: 100%;
    background: linear-gradient(135deg, #10b981, #059669);
    transition: width 0.3s ease;
}

.savings-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    color: #64748b;
}

.savings-breakdown {
    margin-top: 1rem;
}

.savings-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #e2e8f0;
}

.savings-item:last-child {
    border-bottom: none;
}

.savings-type {
    color: #64748b;
}

.savings-value {
    font-weight: 600;
    color: #1e293b;
}

.savings-percent {
    font-size: 0.875rem;
    color: #10b981;
}

.table-controls {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.search-input {
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    min-width: 200px;
}

.spend-table {
    width: 100%;
    border-collapse: collapse;
}

.spend-table th,
.spend-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
}

.spend-table th {
    background: #f8fafc;
    font-weight: 600;
    color: #374151;
    font-size: 0.875rem;
}

.category-cell {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.category-cell i {
    color: #3b82f6;
    width: 1.25rem;
}

.change.positive {
    color: #059669;
    font-weight: 600;
}

.change.negative {
    color: #dc2626;
    font-weight: 600;
}

.supplier-spend-details {
    max-width: 500px;
}

.supplier-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e2e8f0;
}

.supplier-category {
    background: #e0e7ff;
    color: #3730a3;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
    font-weight: 500;
}

.spend-metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.metric-item {
    text-align: center;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 0.5rem;
}

.metric-label {
    font-size: 0.75rem;
    color: #64748b;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    font-weight: 600;
}

.metric-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
}

.metric-value.positive {
    color: #059669;
}

.metric-value.negative {
    color: #dc2626;
}

.breakdown-chart {
    height: 150px;
    margin-top: 1rem;
}

@media (max-width: 768px) {
    .spend-analytics-grid .chart-card {
        grid-column: span 12;
    }
    
    .supplier-spend-item {
        grid-template-columns: 1fr;
        gap: 0.5rem;
        text-align: left;
    }
    
    .spend-metrics {
        grid-template-columns: 1fr;
    }
    
    .category-legend {
        grid-template-columns: 1fr;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', spendStyles);
