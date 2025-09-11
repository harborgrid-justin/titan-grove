/**
 * Titan Grove Main Application Engine - Advanced Interactive Business Logic
 * Enterprise-grade application orchestration with intelligent navigation,
 * real-time system monitoring, and integrated business logic using dependency injection patterns
 */

class TitanGroveMainEngine {
  constructor() {
    // Core service dependencies (dependency injection pattern)
    this.mainService = null;
    this.messageQueue = null;
    this.cacheManager = null;
    this.logger = null;

    // Application state management
    this.currentModule = 'home';
    this.activeModules = new Map();
    this.systemStatus = new Map();
    this.userPreferences = new Map();
    this.kpiData = new Map();

    // UI state
    this.isNavigating = false;
    this.realTimeUpdates = true;
    this.dashboardView = 'overview';

    // Module configurations
    this.moduleConfigs = {
      financial: { enabled: true, priority: 1, icon: 'fas fa-dollar-sign' },
      manufacturing: { enabled: true, priority: 2, icon: 'fas fa-industry' },
      'service-command-center': { enabled: true, priority: 3, icon: 'fas fa-satellite-dish' },
      'field-service': { enabled: true, priority: 4, icon: 'fas fa-tools' },
      maintenance: { enabled: true, priority: 5, icon: 'fas fa-cogs' },
      hr: { enabled: true, priority: 6, icon: 'fas fa-users' },
      crm: { enabled: true, priority: 7, icon: 'fas fa-handshake' },
      'supply-chain': { enabled: true, priority: 8, icon: 'fas fa-truck' },
      bi: { enabled: true, priority: 9, icon: 'fas fa-chart-bar' },
      'asset-management': { enabled: true, priority: 10, icon: 'fas fa-cubes' },
      'project-management': { enabled: true, priority: 11, icon: 'fas fa-project-diagram' },
      compliance: { enabled: true, priority: 12, icon: 'fas fa-shield-alt' },
    };

    // Charts and visualizations
    this.charts = new Map();

    this.initialize();
  }

  async initialize() {
    try {
      // Initialize service dependencies
      await this.initializeServices();

      // Setup event listeners
      this.setupEventListeners();

      // Load initial data
      await this.loadInitialData();

      // Initialize KPI dashboard
      this.initializeKPIDashboard();

      // Setup navigation
      this.setupNavigation();

      // Start real-time monitoring
      this.startRealTimeMonitoring();

      // Initialize competitive analysis
      this.initializeCompetitiveAnalysis();

      console.log('✅ Titan Grove Main Engine initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Main Engine:', error);
    }
  }

  // ==================== SERVICE INITIALIZATION ====================

  async initializeServices() {
    // Initialize logger
    this.logger = {
      info: (msg, data) => console.log(`[MAIN INFO] ${msg}`, data),
      warn: (msg, data) => console.warn(`[MAIN WARN] ${msg}`, data),
      error: (msg, data) => console.error(`[MAIN ERROR] ${msg}`, data),
    };

    // Initialize message queue pattern
    this.messageQueue = {
      publish: async (queue, type, data, options = {}) => {
        this.logger.info('Main application message published', { queue, type, data });
        return this.handleMessage(type, data, options);
      },
      subscribe: (queue, handler) => {
        this.logger.info('Subscribed to main queue', { queue });
      },
    };

    // Initialize cache manager
    this.cacheManager = new Map();

    // Initialize main service
    this.mainService = {
      getSystemStatus: async () => this.getSystemStatus(),
      getModuleStatus: async (moduleId) => this.getModuleStatus(moduleId),
      navigateToModule: async (moduleId) => this.navigateToModule(moduleId),
      getKPIData: async (period) => this.getKPIData(period),
      updateUserPreferences: async (preferences) => this.updateUserPreferences(preferences),
      generateSystemReport: async (reportType) => this.generateSystemReport(reportType),
    };
  }

  // ==================== EVENT HANDLERS ====================

  setupEventListeners() {
    // Navigation handling
    document.addEventListener('click', (e) => {
      if (e.target.matches('.nav-item[data-module]')) {
        const moduleId = e.target.dataset.module;
        this.navigateToModule(moduleId);
      }
      if (e.target.matches('.titan-nav-item')) {
        this.handleMainNavigation(e.target);
      }
      if (e.target.matches('.kpi-card')) {
        this.showKPIDetails(e.target.dataset.kpi);
      }
      if (e.target.matches('.module-card')) {
        const moduleId = e.target.dataset.module;
        this.navigateToModule(moduleId);
      }
      if (e.target.matches('.demo-button, .titan-button')) {
        this.showDashboardView();
      }
    });

    // Search functionality
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleGlobalSearch(e.target.value);
      });
    }

    // Settings and preferences
    document.addEventListener('change', (e) => {
      if (e.target.matches('.preference-setting')) {
        this.updateUserPreference(e.target.name, e.target.value);
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        this.focusGlobalSearch();
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        this.toggleDashboardView();
      }
    });
  }

  // ==================== DATA LOADING ====================

  async loadInitialData() {
    try {
      // Load system status
      await this.loadSystemStatusFromAPI();

      // Load KPI data
      await this.loadKPIDataFromAPI();

      // Load module status
      await this.loadModuleStatusFromAPI();

      // Update displays
      this.updateSystemStatusDisplay();
      this.updateKPIDisplay();
      this.updateModuleStatusDisplay();

      this.logger.info('✅ All initial data loaded successfully');
    } catch (error) {
      this.logger.error('❌ Failed to load initial data, using fallback', error);

      // Fallback to sample data
      this.loadSampleData();
      this.updateKPIDisplay();
      this.updateSystemStatusDisplay();
    }
  }

  async loadSystemStatusFromAPI() {
    try {
      const response = await fetch('/api/system/status');
      const result = await response.json();

      if (result.success) {
        result.data.forEach((status) => {
          this.systemStatus.set(status.component, status);
        });

        this.logger.info(`Loaded system status for ${result.data.length} components`);
      }
    } catch (error) {
      this.logger.error('Failed to load system status from API', error);
      throw error;
    }
  }

  async loadKPIDataFromAPI() {
    try {
      const response = await fetch('/api/main/kpis?period=current-month');
      const result = await response.json();

      if (result.success) {
        Object.entries(result.data).forEach(([kpi, value]) => {
          this.kpiData.set(kpi, value);
        });

        this.logger.info('Loaded KPI data from API');
      }
    } catch (error) {
      this.logger.error('Failed to load KPI data from API', error);
      throw error;
    }
  }

  async loadModuleStatusFromAPI() {
    try {
      const response = await fetch('/api/modules/status');
      const result = await response.json();

      if (result.success) {
        result.data.forEach((module) => {
          this.activeModules.set(module.id, module);
        });

        this.logger.info(`Loaded status for ${result.data.length} modules`);
      }
    } catch (error) {
      this.logger.error('Failed to load module status from API', error);
      throw error;
    }
  }

  // ==================== FALLBACK SAMPLE DATA ====================

  loadSampleData() {
    // Sample KPI data
    this.kpiData.set('totalRevenue', {
      value: 4850000,
      trend: 'up',
      trendValue: 12.5,
      target: 5000000,
      format: 'currency',
    });

    this.kpiData.set('operatingMargin', {
      value: 22.4,
      trend: 'up',
      trendValue: 3.7,
      target: 25,
      format: 'percentage',
    });

    this.kpiData.set('activeClients', {
      value: 347,
      trend: 'up',
      trendValue: 8.2,
      target: 400,
      format: 'number',
    });

    this.kpiData.set('manufacturingSites', {
      value: 127,
      trend: 'up',
      trendValue: 4.8,
      target: 150,
      format: 'number',
    });

    // Sample system status
    this.systemStatus.set('database', { status: 'HEALTHY', lastCheck: new Date(), response: 12 });
    this.systemStatus.set('cache', { status: 'HEALTHY', lastCheck: new Date(), response: 3 });
    this.systemStatus.set('api', { status: 'HEALTHY', lastCheck: new Date(), response: 45 });
    this.systemStatus.set('queue', { status: 'HEALTHY', lastCheck: new Date(), response: 8 });

    // Sample module status
    Object.keys(this.moduleConfigs).forEach((moduleId) => {
      this.activeModules.set(moduleId, {
        id: moduleId,
        status: 'ACTIVE',
        version: '1.0.0',
        lastUpdated: new Date(),
        health: 'GOOD',
      });
    });
  }

  // ==================== UI UPDATES ====================

  updateKPIDisplay() {
    const kpiMappings = {
      'revenue-kpi': 'totalRevenue',
      'profit-kpi': 'operatingMargin',
      'customers-kpi': 'activeClients',
      'projects-kpi': 'manufacturingSites',
    };

    Object.entries(kpiMappings).forEach(([containerId, kpiKey]) => {
      const container = document.getElementById(containerId);
      const kpiData = this.kpiData.get(kpiKey);

      if (container && kpiData) {
        this.createKPICard(container, kpiData, kpiKey);
      }
    });
  }

  createKPICard(container, data, kpiKey) {
    const titles = {
      totalRevenue: 'Enterprise Revenue',
      operatingMargin: 'Operating Margin',
      activeClients: 'Fortune 500 Clients',
      manufacturingSites: 'Manufacturing Sites',
    };

    const statusClass =
      data.value >= data.target * 0.9
        ? 'success'
        : data.value >= data.target * 0.75
          ? 'warning'
          : 'error';

    container.innerHTML = `
            <div class="titan-kpi-card" data-kpi="${kpiKey}">
                <div class="titan-kpi-header">
                    <h3 class="titan-kpi-title">${titles[kpiKey] || kpiKey}</h3>
                    <div class="titan-kpi-status ${statusClass}"></div>
                </div>
                
                <div class="titan-kpi-main">
                    <div class="titan-kpi-value-container">
                        <span class="titan-kpi-value">${this.formatValue(data.value, data.format)}</span>
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
                        <span class="titan-kpi-target-value">${this.formatValue(data.target, data.format)}</span>
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

  updateSystemStatusDisplay() {
    const statusContainer = document.getElementById('systemStatus');
    if (!statusContainer) return;

    let html = '<div class="system-status-grid">';

    this.systemStatus.forEach((status, component) => {
      const statusClass = status.status.toLowerCase();
      const statusIcon =
        status.status === 'HEALTHY' ? '✅' : status.status === 'WARNING' ? '⚠️' : '❌';

      html += `
                <div class="system-status-card ${statusClass}">
                    <div class="status-header">
                        <span class="status-icon">${statusIcon}</span>
                        <span class="component-name">${component.toUpperCase()}</span>
                    </div>
                    <div class="status-details">
                        <span class="status-text">${status.status}</span>
                        <span class="response-time">${status.response}ms</span>
                    </div>
                </div>
            `;
    });

    html += '</div>';
    statusContainer.innerHTML = html;
  }

  updateModuleStatusDisplay() {
    const container = document.getElementById('modulesOverview');
    if (!container) return;

    let html = '<div class="modules-grid">';

    // Sort modules by priority
    const sortedModules = Array.from(this.activeModules.keys())
      .filter((moduleId) => this.moduleConfigs[moduleId]?.enabled)
      .sort(
        (a, b) =>
          (this.moduleConfigs[a]?.priority || 999) - (this.moduleConfigs[b]?.priority || 999)
      );

    sortedModules.forEach((moduleId) => {
      const module = this.activeModules.get(moduleId);
      const config = this.moduleConfigs[moduleId];

      if (module && config) {
        const statusClass = module.status.toLowerCase();
        const healthClass = module.health?.toLowerCase() || 'unknown';

        html += `
                    <div class="module-card ${statusClass}" data-module="${moduleId}">
                        <div class="module-header">
                            <div class="module-icon">
                                <i class="${config.icon}"></i>
                            </div>
                            <div class="module-info">
                                <h4>${this.getModuleDisplayName(moduleId)}</h4>
                                <span class="module-version">v${module.version}</span>
                            </div>
                        </div>
                        <div class="module-status">
                            <div class="status-indicator ${statusClass}"></div>
                            <span class="status-text">${module.status}</span>
                        </div>
                        <div class="module-health">
                            <div class="health-indicator ${healthClass}"></div>
                            <span class="health-text">${module.health || 'Unknown'}</span>
                        </div>
                    </div>
                `;
      }
    });

    html += '</div>';
    container.innerHTML = html;
  }

  // ==================== NAVIGATION ====================

  setupNavigation() {
    // Initialize navigation state
    this.updateNavigationState();

    // Setup breadcrumbs
    this.updateBreadcrumbs();
  }

  async navigateToModule(moduleId) {
    if (this.isNavigating) return;

    this.isNavigating = true;
    this.logger.info('Navigating to module', { moduleId });

    try {
      // Validate module exists and is enabled
      if (!this.moduleConfigs[moduleId]?.enabled) {
        throw new Error(`Module ${moduleId} is not available`);
      }

      // Construct module URL
      const moduleUrls = {
        financial: '/src/ui/static/financials.html',
        manufacturing: '/src/ui/static/manufacturing.html',
        'service-command-center': '/src/ui/static/service-command-center.html',
        'field-service': '/src/ui/static/field-service.html',
        maintenance: '/src/ui/static/maintenance.html',
        hr: '/src/ui/static/hr-management.html',
        crm: '/src/ui/static/crm-management.html',
        'supply-chain': '/src/ui/static/supply-chain-management.html',
        bi: '/src/ui/static/business-intelligence.html',
        'asset-management': '/src/ui/static/asset-management.html',
        'project-management': '/src/ui/static/project-management.html',
        compliance: '/src/ui/static/compliance.html',
      };

      const url = moduleUrls[moduleId];
      if (url) {
        // Add navigation transition effect
        document.body.classList.add('navigating');

        // Small delay for visual effect
        setTimeout(() => {
          window.location.href = url;
        }, 300);
      } else {
        throw new Error(`URL not found for module: ${moduleId}`);
      }
    } catch (error) {
      this.logger.error('Navigation failed', error);
      this.showNavigationError(error.message);
    } finally {
      this.isNavigating = false;
    }
  }

  handleMainNavigation(navItem) {
    const href = navItem.getAttribute('href');

    // Remove active class from all nav items
    document.querySelectorAll('.titan-nav-item').forEach((item) => {
      item.classList.remove('active');
    });

    // Add active class to clicked item
    navItem.classList.add('active');

    // Handle different navigation targets
    if (href === '#dashboard') {
      this.showDashboardView();
    } else if (href === '#home') {
      this.showHomeView();
    } else {
      // Extract module ID from href if it's a module link
      const moduleMatch = href?.match(/#(\w+)/);
      if (moduleMatch) {
        const moduleId = moduleMatch[1];
        if (this.moduleConfigs[moduleId]) {
          this.navigateToModule(moduleId);
        }
      }
    }
  }

  showDashboardView() {
    // Hide hero section and features
    const heroSection = document.querySelector('.titan-hero');
    const featureGrid = document.querySelector('.titan-feature-grid');
    const comparison = document.querySelector('.titan-comparison');
    const dashboardView = document.getElementById('dashboard-view');

    if (heroSection) heroSection.style.display = 'none';
    if (featureGrid) featureGrid.style.display = 'none';
    if (comparison) comparison.style.display = 'none';
    if (dashboardView) dashboardView.style.display = 'flex';

    // Update navigation
    const executiveNav = document.querySelector('[href="#dashboard"]');
    if (executiveNav) executiveNav.classList.add('active');

    this.currentModule = 'dashboard';
    this.logger.info('Switched to dashboard view');
  }

  showHomeView() {
    // Show hero section and features
    const heroSection = document.querySelector('.titan-hero');
    const featureGrid = document.querySelector('.titan-feature-grid');
    const comparison = document.querySelector('.titan-comparison');
    const dashboardView = document.getElementById('dashboard-view');

    if (heroSection) heroSection.style.display = 'block';
    if (featureGrid) featureGrid.style.display = 'grid';
    if (comparison) comparison.style.display = 'block';
    if (dashboardView) dashboardView.style.display = 'none';

    this.currentModule = 'home';
    this.logger.info('Switched to home view');
  }

  updateNavigationState() {
    // Update navigation indicators based on current state
    const currentPath = window.location.pathname;
    const currentModule = this.extractModuleFromPath(currentPath);

    if (currentModule) {
      this.currentModule = currentModule;
    }
  }

  updateBreadcrumbs() {
    const breadcrumbsContainer = document.getElementById('breadcrumbs');
    if (!breadcrumbsContainer) return;

    const breadcrumbs = [
      { name: 'Titan Grove', url: '/src/ui/static/index.html', active: false },
      { name: this.getModuleDisplayName(this.currentModule), url: '', active: true },
    ];

    let html = '<div class="breadcrumbs">';
    breadcrumbs.forEach((crumb, index) => {
      if (index > 0) html += '<span class="breadcrumb-separator">/</span>';
      html += `<span class="breadcrumb-item ${crumb.active ? 'active' : ''}">${crumb.name}</span>`;
    });
    html += '</div>';

    breadcrumbsContainer.innerHTML = html;
  }

  // ==================== SEARCH AND FILTERING ====================

  handleGlobalSearch(searchTerm) {
    if (searchTerm.length < 2) {
      this.hideSearchSuggestions();
      return;
    }

    this.logger.info('Global search query', { searchTerm });

    // Search across modules, features, and content
    const suggestions = this.generateSearchSuggestions(searchTerm);
    this.showSearchSuggestions(suggestions);
  }

  generateSearchSuggestions(searchTerm) {
    const suggestions = [];
    const term = searchTerm.toLowerCase();

    // Search modules
    Object.keys(this.moduleConfigs).forEach((moduleId) => {
      const moduleName = this.getModuleDisplayName(moduleId);
      if (moduleName.toLowerCase().includes(term)) {
        suggestions.push({
          type: 'module',
          title: moduleName,
          description: `Navigate to ${moduleName}`,
          action: () => this.navigateToModule(moduleId),
          icon: this.moduleConfigs[moduleId].icon,
        });
      }
    });

    // Search features (sample)
    const features = [
      {
        name: 'Financial Reports',
        module: 'financial',
        description: 'Generate financial reports and analytics',
      },
      {
        name: 'Work Orders',
        module: 'field-service',
        description: 'Manage field service work orders',
      },
      {
        name: 'Asset Maintenance',
        module: 'maintenance',
        description: 'Schedule and track asset maintenance',
      },
      {
        name: 'Manufacturing Orders',
        module: 'manufacturing',
        description: 'Manage production and manufacturing',
      },
    ];

    features.forEach((feature) => {
      if (
        feature.name.toLowerCase().includes(term) ||
        feature.description.toLowerCase().includes(term)
      ) {
        suggestions.push({
          type: 'feature',
          title: feature.name,
          description: feature.description,
          action: () => this.navigateToModule(feature.module),
          icon: 'fas fa-star',
        });
      }
    });

    return suggestions.slice(0, 8); // Limit to 8 suggestions
  }

  showSearchSuggestions(suggestions) {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (!suggestionsContainer) return;

    if (suggestions.length === 0) {
      suggestionsContainer.innerHTML = '<div class="search-no-results">No results found</div>';
      suggestionsContainer.style.display = 'block';
      return;
    }

    let html = '<div class="search-suggestions-list">';
    suggestions.forEach((suggestion) => {
      html += `
                <div class="search-suggestion-item" data-type="${suggestion.type}">
                    <div class="suggestion-icon">
                        <i class="${suggestion.icon}"></i>
                    </div>
                    <div class="suggestion-content">
                        <div class="suggestion-title">${suggestion.title}</div>
                        <div class="suggestion-description">${suggestion.description}</div>
                    </div>
                </div>
            `;
    });
    html += '</div>';

    suggestionsContainer.innerHTML = html;
    suggestionsContainer.style.display = 'block';

    // Add click handlers
    suggestionsContainer.querySelectorAll('.search-suggestion-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        suggestions[index].action();
        this.hideSearchSuggestions();
      });
    });
  }

  hideSearchSuggestions() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
      suggestionsContainer.style.display = 'none';
    }
  }

  focusGlobalSearch() {
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
  }

  // ==================== REAL-TIME MONITORING ====================

  startRealTimeMonitoring() {
    // Start KPI updates
    setInterval(() => {
      this.updateKPIAnimations();
    }, 30000); // Every 30 seconds

    // Start system status monitoring
    setInterval(() => {
      this.checkSystemStatus();
    }, 60000); // Every minute

    // Start module health checks
    setInterval(() => {
      this.checkModuleHealth();
    }, 120000); // Every 2 minutes
  }

  updateKPIAnimations() {
    const kpiValues = document.querySelectorAll('.titan-kpi-value');
    kpiValues.forEach((value) => {
      // Add subtle pulsing animation to show "live" data
      value.style.animation = 'titan-pulse 2s ease-in-out';
      setTimeout(() => {
        value.style.animation = '';
      }, 2000);
    });
  }

  async checkSystemStatus() {
    try {
      const response = await fetch('/api/system/health');
      if (response.ok) {
        const healthData = await response.json();
        if (healthData.success) {
          this.processSystemHealthUpdate(healthData.data);
        }
      }
    } catch (error) {
      // Silently handle errors in background monitoring
      this.logger.warn('System health check failed', error);
    }
  }

  async checkModuleHealth() {
    try {
      const response = await fetch('/api/modules/health');
      if (response.ok) {
        const healthData = await response.json();
        if (healthData.success) {
          this.processModuleHealthUpdate(healthData.data);
        }
      }
    } catch (error) {
      // Silently handle errors in background monitoring
      this.logger.warn('Module health check failed', error);
    }
  }

  processSystemHealthUpdate(healthData) {
    let hasChanges = false;

    Object.entries(healthData).forEach(([component, status]) => {
      const currentStatus = this.systemStatus.get(component);
      if (!currentStatus || currentStatus.status !== status.status) {
        this.systemStatus.set(component, status);
        hasChanges = true;
      }
    });

    if (hasChanges) {
      this.updateSystemStatusDisplay();
      this.logger.info('System status updated');
    }
  }

  processModuleHealthUpdate(moduleHealthData) {
    let hasChanges = false;

    moduleHealthData.forEach((moduleHealth) => {
      const currentModule = this.activeModules.get(moduleHealth.id);
      if (
        currentModule &&
        (currentModule.health !== moduleHealth.health ||
          currentModule.status !== moduleHealth.status)
      ) {
        this.activeModules.set(moduleHealth.id, { ...currentModule, ...moduleHealth });
        hasChanges = true;
      }
    });

    if (hasChanges) {
      this.updateModuleStatusDisplay();
      this.logger.info('Module health updated');
    }
  }

  // ==================== COMPETITIVE ANALYSIS ====================

  initializeCompetitiveAnalysis() {
    const competitiveContainer = document.getElementById('competitiveAnalysis');
    if (!competitiveContainer) return;

    const features = [
      { name: 'User Experience', titan: 9.2, oracle: 5.5 },
      { name: 'Mobile Support', titan: 9.5, oracle: 4.8 },
      { name: 'Integration Capabilities', titan: 9.6, oracle: 6.2 },
      { name: 'Total Cost of Ownership', titan: 9.8, oracle: 4.0 },
      { name: 'Implementation Time', titan: 8.9, oracle: 5.2 },
      { name: 'Customization Flexibility', titan: 9.1, oracle: 6.8 },
    ];

    let html = '<div class="competitive-comparison">';
    html += '<h3>Titan Grove vs Oracle EBS 12</h3>';
    html += '<div class="comparison-grid">';

    features.forEach((feature) => {
      const advantage = feature.titan - feature.oracle;
      html += `
                <div class="comparison-feature">
                    <div class="feature-name">${feature.name}</div>
                    <div class="feature-scores">
                        <div class="score titan">
                            <span class="score-label">Titan Grove</span>
                            <span class="score-value">${feature.titan}/10</span>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${feature.titan * 10}%"></div>
                            </div>
                        </div>
                        <div class="score oracle">
                            <span class="score-label">Oracle EBS</span>
                            <span class="score-value">${feature.oracle}/10</span>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${feature.oracle * 10}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="advantage">+${advantage.toFixed(1)}</div>
                </div>
            `;
    });

    html += '</div></div>';
    competitiveContainer.innerHTML = html;
  }

  // ==================== UTILITY FUNCTIONS ====================

  formatValue(value, format) {
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
      case 'number':
        return new Intl.NumberFormat('en-US').format(value);
      default:
        return value.toString();
    }
  }

  getModuleDisplayName(moduleId) {
    const displayNames = {
      financial: 'Financial Management',
      manufacturing: 'Manufacturing',
      'service-command-center': 'Service Command Center',
      'field-service': 'Field Service',
      maintenance: 'Maintenance',
      hr: 'Human Resources',
      crm: 'Customer Relationship Management',
      'supply-chain': 'Supply Chain Management',
      bi: 'Business Intelligence',
      'asset-management': 'Asset Management',
      'project-management': 'Project Management',
      compliance: 'Compliance & Risk',
      dashboard: 'Executive Dashboard',
      home: 'Home',
    };

    return (
      displayNames[moduleId] || moduleId.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    );
  }

  extractModuleFromPath(path) {
    const matches = path.match(/\/([^\/]+)\.html$/);
    if (matches) {
      const filename = matches[1];
      // Map filenames to module IDs
      const fileToModule = {
        index: 'home',
        dashboard: 'dashboard',
        financials: 'financial',
        manufacturing: 'manufacturing',
        'service-command-center': 'service-command-center',
        'field-service': 'field-service',
        maintenance: 'maintenance',
        'hr-management': 'hr',
        'crm-management': 'crm',
        'supply-chain-management': 'supply-chain',
        'business-intelligence': 'bi',
        'asset-management': 'asset-management',
        'project-management': 'project-management',
        compliance: 'compliance',
      };
      return fileToModule[filename] || filename;
    }
    return 'home';
  }

  showKPIDetails(kpiKey) {
    const kpiData = this.kpiData.get(kpiKey);
    if (!kpiData) return;

    this.logger.info('Showing KPI details', { kpiKey, kpiData });

    // Could implement modal or drill-down view here
    // For now, just log the interaction
  }

  showNavigationError(message) {
    // Show user-friendly error message
    const errorContainer = document.getElementById('navigationError');
    if (errorContainer) {
      errorContainer.innerHTML = `
                <div class="navigation-error">
                    <div class="error-icon">⚠️</div>
                    <div class="error-message">Navigation Error: ${message}</div>
                    <button class="titan-btn titan-btn-sm" onclick="this.parentElement.remove()">Dismiss</button>
                </div>
            `;
      errorContainer.style.display = 'block';

      // Auto-hide after 5 seconds
      setTimeout(() => {
        if (errorContainer) {
          errorContainer.style.display = 'none';
        }
      }, 5000);
    }
  }

  toggleDashboardView() {
    if (this.currentModule === 'dashboard') {
      this.showHomeView();
    } else {
      this.showDashboardView();
    }
  }

  updateUserPreference(name, value) {
    this.userPreferences.set(name, value);
    this.logger.info('User preference updated', { name, value });

    // Apply preference changes
    this.applyUserPreferences();
  }

  updateUserPreferences(preferences) {
    Object.entries(preferences).forEach(([key, value]) => {
      this.userPreferences.set(key, value);
    });

    this.applyUserPreferences();
  }

  applyUserPreferences() {
    // Apply theme, layout, and other user preferences
    const theme = this.userPreferences.get('theme');
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }

    const realTimeUpdates = this.userPreferences.get('realTimeUpdates');
    if (realTimeUpdates !== undefined) {
      this.realTimeUpdates = realTimeUpdates;
    }
  }

  // ==================== MESSAGE HANDLING ====================

  async handleMessage(type, data, options = {}) {
    switch (type) {
      case 'NAVIGATE_TO_MODULE':
        return this.navigateToModule(data.moduleId);
      case 'UPDATE_KPI':
        return this.updateKPI(data.kpiKey, data.value);
      case 'REFRESH_SYSTEM_STATUS':
        return this.checkSystemStatus();
      case 'SHOW_NOTIFICATION':
        return this.showNotification(data.message, data.type);
      default:
        this.logger.warn('Unknown main application message type', { type, data });
        return { success: false, error: 'Unknown message type' };
    }
  }

  async updateKPI(kpiKey, newValue) {
    const existingKPI = this.kpiData.get(kpiKey);
    if (existingKPI) {
      this.kpiData.set(kpiKey, { ...existingKPI, ...newValue });
      this.updateKPIDisplay();
    }
    return { success: true };
  }

  showNotification(message, type = 'info') {
    this.logger.info('Showing notification', { message, type });

    // Could implement toast notifications here
    console.log(`[NOTIFICATION ${type.toUpperCase()}] ${message}`);
  }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new TitanGroveMainEngine();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TitanGroveMainEngine;
}
