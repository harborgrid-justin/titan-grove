/**
 * Titan Grove Fortune 100 Enterprise UI Application
 * Enhanced Oracle EBS Competitor Interface
 */

document.addEventListener('DOMContentLoaded', function () {
  console.log('🚀 Titan Grove Fortune 100 Enterprise UI Loading...');

  // Initialize demo components
  initializeDemoKPIs();
  initializeDemoTable();

  // Add interactivity
  setupNavigation();
  setupAnimations();

  console.log('✅ Fortune 100 Enterprise UI Ready');
});

function initializeDemoKPIs() {
  console.log('📊 Initializing Fortune 100 KPIs...');

  // Revenue KPI
  const revenueContainer = document.getElementById('revenue-kpi');
  if (revenueContainer) {
    createDemoKPI(revenueContainer, {
      title: 'Enterprise Revenue',
      value: 4850000,
      format: 'currency',
      trend: 'up',
      trendValue: 12.5,
      target: 5000000,
      status: 'success',
    });
  }

  // Profit KPI
  const profitContainer = document.getElementById('profit-kpi');
  if (profitContainer) {
    createDemoKPI(profitContainer, {
      title: 'Operating Margin',
      value: 22.4,
      format: 'percentage',
      trend: 'up',
      trendValue: 3.7,
      target: 25,
      status: 'warning',
    });
  }

  // Customers KPI
  const customersContainer = document.getElementById('customers-kpi');
  if (customersContainer) {
    createDemoKPI(customersContainer, {
      title: 'Fortune 500 Clients',
      value: 347,
      format: 'number',
      trend: 'up',
      trendValue: 8.2,
      target: 400,
      status: 'info',
    });
  }

  // Projects KPI
  const projectsContainer = document.getElementById('projects-kpi');
  if (projectsContainer) {
    createDemoKPI(projectsContainer, {
      title: 'Manufacturing Sites',
      value: 127,
      format: 'number',
      trend: 'up',
      trendValue: 4.8,
      target: 150,
      status: 'success',
    });
  }
}

function createDemoKPI(container, data) {
  container.innerHTML = `
        <div class="titan-kpi-card">
            <div class="titan-kpi-header">
                <h3 class="titan-kpi-title">${data.title}</h3>
                <div class="titan-kpi-status ${data.status}"></div>
            </div>
            
            <div class="titan-kpi-main">
                <div class="titan-kpi-value-container">
                    <span class="titan-kpi-value">${formatValue(data.value, data.format)}</span>
                    <span class="titan-kpi-unit">${data.unit || ''}</span>
                </div>
                
                <div class="titan-kpi-trend ${data.trend}">
                    <span class="titan-kpi-trend-icon">${data.trend === 'up' ? '↗' : data.trend === 'down' ? '↘' : '→'}</span>
                    <span class="titan-kpi-trend-value">${data.trendValue > 0 ? '+' : ''}${data.trendValue.toFixed(1)}%</span>
                    <span class="titan-kpi-trend-label">vs previous</span>
                </div>
            </div>
            
            <div class="titan-kpi-footer">
                <div class="titan-kpi-target">
                    <span class="titan-kpi-target-label">Target</span>
                    <span class="titan-kpi-target-value">${formatValue(data.target, data.format)}</span>
                </div>
                
                <div class="titan-kpi-progress">
                    <div class="titan-kpi-progress-bar">
                        <div class="titan-kpi-progress-fill" style="width: ${Math.min((data.value / data.target) * 100, 100)}%"></div>
                    </div>
                    <span class="titan-kpi-progress-text">${Math.round((data.value / data.target) * 100)}%</span>
                </div>
            </div>
        </div>
    `;
}

function formatValue(value, format) {
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    case 'percentage':
      return `${value}%`;
    default:
      return new Intl.NumberFormat('en-US').format(value);
  }
}

function initializeDemoTable() {
  console.log('📋 Initializing Fortune 100 Data Tables...');

  const tableContainer = document.getElementById('data-table-widget');
  if (tableContainer) {
    tableContainer.innerHTML = `
            <div class="titan-table-container">
                <div class="titan-table-header">
                    <div class="titan-table-actions">
                        <div class="titan-table-search">
                            <input type="text" placeholder="Search enterprise data..." class="titan-search-input">
                            <button class="titan-search-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.35-4.35"></path>
                                </svg>
                            </button>
                        </div>
                        <div class="titan-table-tools">
                            <button class="titan-btn titan-btn-secondary">Filter</button>
                            <button class="titan-btn titan-btn-secondary">Export</button>
                            <button class="titan-btn titan-btn-primary">Real-time Sync</button>
                        </div>
                    </div>
                    <div class="titan-table-info">
                        <span class="titan-table-count">Fortune 100 Manufacturing Orders</span>
                    </div>
                </div>
                
                <div class="titan-table-wrapper">
                    <table class="titan-table">
                        <thead class="titan-table-head">
                            <tr>
                                <th><input type="checkbox"></th>
                                <th class="sortable">Work Order</th>
                                <th class="sortable">Product Config</th>
                                <th class="sortable">Site</th>
                                <th class="sortable">Value</th>
                                <th class="sortable">Due Date</th>
                                <th>MES Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody class="titan-table-body">
                            <tr>
                                <td><input type="checkbox"></td>
                                <td><strong>WO-2024-001</strong></td>
                                <td>Custom Engine Config-A47</td>
                                <td>Detroit Plant #1</td>
                                <td><strong>$1,245,000</strong></td>
                                <td>2024-02-15</td>
                                <td><span class="titan-status-indicator titan-status-success">In Production</span></td>
                                <td><button class="titan-btn titan-btn-sm">View MES</button></td>
                            </tr>
                            <tr>
                                <td><input type="checkbox"></td>
                                <td><strong>WO-2024-002</strong></td>
                                <td>Process Batch-B832</td>
                                <td>Texas Facility #3</td>
                                <td><strong>$892,400</strong></td>
                                <td>2024-02-18</td>
                                <td><span class="titan-status-indicator titan-status-warning">Setup</span></td>
                                <td><button class="titan-btn titan-btn-sm">Configure</button></td>
                            </tr>
                            <tr>
                                <td><input type="checkbox"></td>
                                <td><strong>WO-2024-003</strong></td>
                                <td>Assembly Config-C19</td>
                                <td>Ohio Manufacturing</td>
                                <td><strong>$2,156,800</strong></td>
                                <td>2024-02-12</td>
                                <td><span class="titan-status-indicator titan-status-success">Completed</span></td>
                                <td><button class="titan-btn titan-btn-sm">E-Record</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="titan-table-pagination">
                    <div class="titan-pagination-info">
                        Showing 3 of 1,247 Fortune 100 orders
                    </div>
                    <div class="titan-pagination-controls">
                        <button class="titan-btn titan-btn-sm">First</button>
                        <button class="titan-btn titan-btn-sm">Previous</button>
                        <span class="titan-page-numbers">
                            <span class="titan-page-number active">1</span>
                            <span class="titan-page-number">2</span>
                            <span class="titan-page-number">3</span>
                        </span>
                        <button class="titan-btn titan-btn-sm">Next</button>
                        <button class="titan-btn titan-btn-sm">Last</button>
                    </div>
                </div>
            </div>
        `;
  }
}

function setupNavigation() {
  console.log('🧭 Setting up Fortune 100 Navigation...');

  const navItems = document.querySelectorAll('.titan-nav-item');
  const heroSection = document.querySelector('.titan-hero');
  const featureGrid = document.querySelector('.titan-feature-grid');
  const comparison = document.querySelector('.titan-comparison');
  const dashboardView = document.getElementById('dashboard-view');

  navItems.forEach((item) => {
    item.addEventListener('click', function (e) {
      e.preventDefault();

      // Remove active class from all items
      navItems.forEach((nav) => nav.classList.remove('active'));

      // Add active class to clicked item
      this.classList.add('active');

      if (this.getAttribute('href') === '#dashboard') {
        // Show main landing view
        if (heroSection) heroSection.style.display = 'block';
        if (featureGrid) featureGrid.style.display = 'grid';
        if (comparison) comparison.style.display = 'block';
        if (dashboardView) dashboardView.style.display = 'none';
      } else {
        // Show dashboard view for other modules
        if (heroSection) heroSection.style.display = 'none';
        if (featureGrid) featureGrid.style.display = 'none';
        if (comparison) comparison.style.display = 'none';
        if (dashboardView) dashboardView.style.display = 'flex';
      }
    });
  });

  // Enterprise Dashboard button
  const demoButton = document.querySelector('.titan-hero .titan-button');
  if (demoButton) {
    demoButton.addEventListener('click', function () {
      console.log('🎯 Entering Fortune 100 Enterprise Dashboard...');

      if (heroSection) heroSection.style.display = 'none';
      if (featureGrid) featureGrid.style.display = 'none';
      if (comparison) comparison.style.display = 'none';
      if (dashboardView) dashboardView.style.display = 'flex';

      // Update nav
      navItems.forEach((nav) => nav.classList.remove('active'));
      const executiveNav = document.querySelector('[href="#dashboard"]');
      if (executiveNav) executiveNav.classList.add('active');
    });
  }
}

function setupAnimations() {
  console.log('✨ Setting up Fortune 100 Animations...');

  // Add intersection observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in, .slide-in-left').forEach((el) => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
}

// Add some interactivity to demonstrate real-time updates
setInterval(() => {
  const kpiValues = document.querySelectorAll('.titan-kpi-value');
  kpiValues.forEach((value) => {
    // Add subtle pulsing animation to show "live" data
    value.style.animation = 'titan-pulse 2s ease-in-out';
    setTimeout(() => {
      value.style.animation = '';
    }, 2000);
  });
}, 30000); // Every 30 seconds

// Real-time data simulation for Fortune 100 enterprise
function simulateRealTimeUpdates() {
  console.log('📡 Starting Fortune 100 Real-time Updates...');

  setInterval(() => {
    // Simulate manufacturing data updates
    const statusIndicators = document.querySelectorAll('.titan-status-indicator');
    statusIndicators.forEach((indicator) => {
      // Add subtle glow effect to show live updates
      indicator.style.boxShadow = '0 0 8px rgba(37, 99, 235, 0.3)';
      setTimeout(() => {
        indicator.style.boxShadow = '';
      }, 1000);
    });
  }, 15000); // Every 15 seconds
}

// Initialize real-time updates
setTimeout(simulateRealTimeUpdates, 5000);
