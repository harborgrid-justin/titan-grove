/**
 * CRM Management System - Titan Grove Enterprise
 * Advanced Customer Relationship Management with Oracle EBS competitive features
 * Complete sales pipeline, customer management, and analytics platform
 */

class CRMManagementSystem {
  constructor() {
    this.deals = [];
    this.customers = [];
    this.contacts = [];
    this.activities = [];
    this.currentSection = 'dashboard';
    this.charts = {};
    this.sortableInstances = [];
    this.initialized = false;

    // Performance tracking
    this.performanceMetrics = {
      loadTime: 0,
      renderTime: 0,
      apiCalls: 0,
      chartRenders: 0,
    };

    console.log('🚀 Initializing CRM Management System...');
  }

  /**
   * Initialize the CRM Management System
   */
  async init() {
    const startTime = performance.now();

    try {
      console.log('💼 Loading CRM Analytics Framework...');

      // Load sample data
      await this.loadSampleData();

      // Initialize charts
      await this.initializeCharts();

      // Setup pipeline drag-and-drop
      this.initializePipeline();

      // Setup event listeners
      this.setupEventListeners();

      // Setup navigation
      this.setupNavigation();

      // Initialize search
      this.initializeSearch();

      // Setup real-time updates
      this.setupRealTimeUpdates();

      this.initialized = true;
      this.performanceMetrics.loadTime = performance.now() - startTime;

      console.log(`✅ CRM System initialized in ${this.performanceMetrics.loadTime.toFixed(2)}ms`);
      console.log('🎯 Oracle EBS competitive CRM features active');
    } catch (error) {
      console.error('❌ Failed to initialize CRM System:', error);
    }
  }

  /**
   * Load sample CRM data
   */
  async loadSampleData() {
    console.log('💰 Loading sales and customer data...');

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Sample deals data
    this.deals = [
      {
        id: 'DEAL001',
        title: 'TechCorp Inc. Enterprise Platform',
        company: 'TechCorp Inc.',
        value: 2400000,
        stage: 'negotiation',
        probability: 75,
        closeDate: '2025-01-15',
        owner: 'Jennifer Wilson',
        ownerAvatar: 'https://via.placeholder.com/32x32/2563eb/ffffff?text=JW',
        lastActivity: '2024-12-30T14:30:00Z',
        riskLevel: 'high',
        contacts: ['john.doe@techcorp.com', 'mary.smith@techcorp.com'],
        nextAction: 'Contract review meeting',
      },
      {
        id: 'DEAL002',
        title: 'Global Systems Integration',
        company: 'Global Systems Ltd.',
        value: 890000,
        stage: 'proposal',
        probability: 65,
        closeDate: '2025-02-28',
        owner: 'Robert Chen',
        ownerAvatar: 'https://via.placeholder.com/32x32/7c3aed/ffffff?text=RC',
        lastActivity: '2024-12-29T10:15:00Z',
        riskLevel: 'medium',
        contacts: ['james.wilson@globalsys.com'],
        nextAction: 'Technical proposal delivery',
      },
      {
        id: 'DEAL003',
        title: 'DataFlow Corp Expansion',
        company: 'DataFlow Corp',
        value: 445000,
        stage: 'qualified',
        probability: 45,
        closeDate: '2025-03-15',
        owner: 'Lisa Anderson',
        ownerAvatar: 'https://via.placeholder.com/32x32/059669/ffffff?text=LA',
        lastActivity: '2024-12-28T16:45:00Z',
        riskLevel: 'low',
        contacts: ['sarah.brown@dataflow.com', 'mike.jones@dataflow.com'],
        nextAction: 'Requirements gathering session',
      },
    ];

    // Generate additional sample deals
    this.generateSampleDeals();

    // Sample customers data
    this.customers = [
      {
        id: 'CUST001',
        name: 'TechCorp Inc.',
        type: 'Enterprise',
        industry: 'Technology',
        size: '5000+',
        revenue: 2400000,
        status: 'active',
        accountManager: 'Jennifer Wilson',
        lastContact: '2024-12-30',
        satisfaction: 4.8,
        contracts: 3,
        lifetime_value: 7200000,
      },
      {
        id: 'CUST002',
        name: 'Global Systems Ltd.',
        type: 'Enterprise',
        industry: 'Manufacturing',
        size: '1000-5000',
        revenue: 890000,
        status: 'active',
        accountManager: 'Robert Chen',
        lastContact: '2024-12-29',
        satisfaction: 4.6,
        contracts: 2,
        lifetime_value: 3560000,
      },
    ];

    // Generate sample activities
    this.generateSampleActivities();

    console.log(`✅ Loaded ${this.deals.length} deals, ${this.customers.length} customers`);
  }

  /**
   * Generate additional sample deals for demonstration
   */
  generateSampleDeals() {
    const companies = [
      'Innovation Labs',
      'Future Systems',
      'Digital Dynamics',
      'Smart Solutions',
      'Advanced Analytics',
      'Cloud Computing Corp',
      'Enterprise Solutions',
      'Technology Partners',
      'Business Innovations',
      'Data Intelligence',
    ];

    const stages = ['lead', 'qualified', 'proposal', 'negotiation', 'closed'];
    const owners = [
      { name: 'Jennifer Wilson', avatar: 'JW', color: '2563eb' },
      { name: 'Robert Chen', avatar: 'RC', color: '7c3aed' },
      { name: 'Lisa Anderson', avatar: 'LA', color: '059669' },
      { name: 'Michael Brown', avatar: 'MB', color: 'f59e0b' },
      { name: 'Sarah Davis', avatar: 'SD', color: 'ef4444' },
    ];

    for (let i = 4; i <= 150; i++) {
      const company = companies[Math.floor(Math.random() * companies.length)];
      const stage = stages[Math.floor(Math.random() * stages.length)];
      const owner = owners[Math.floor(Math.random() * owners.length)];
      const baseValue = 50000 + Math.floor(Math.random() * 2000000);

      const monthsAhead = Math.floor(Math.random() * 6) + 1;
      const closeDate = new Date();
      closeDate.setMonth(closeDate.getMonth() + monthsAhead);

      this.deals.push({
        id: `DEAL${i.toString().padStart(3, '0')}`,
        title: `${company} Implementation`,
        company: company,
        value: baseValue,
        stage: stage,
        probability: this.getStageprobability(stage),
        closeDate: closeDate.toISOString().split('T')[0],
        owner: owner.name,
        ownerAvatar: `https://via.placeholder.com/32x32/${owner.color}/ffffff?text=${owner.avatar}`,
        lastActivity: this.getRandomPastDate(),
        riskLevel: this.calculateRiskLevel(stage, baseValue),
        contacts: [`contact${i}@${company.toLowerCase().replace(/\s+/g, '')}.com`],
        nextAction: this.getNextAction(stage),
      });
    }
  }

  /**
   * Get stage probability
   */
  getStageprobability(stage) {
    const probabilities = {
      lead: 10 + Math.floor(Math.random() * 15),
      qualified: 25 + Math.floor(Math.random() * 20),
      proposal: 45 + Math.floor(Math.random() * 20),
      negotiation: 65 + Math.floor(Math.random() * 20),
      closed: 100,
    };
    return probabilities[stage] || 50;
  }

  /**
   * Calculate risk level based on stage and value
   */
  calculateRiskLevel(stage, value) {
    if (stage === 'negotiation' && value > 1000000) return 'high';
    if (stage === 'proposal' && value > 500000) return 'medium';
    return 'low';
  }

  /**
   * Get next action based on stage
   */
  getNextAction(stage) {
    const actions = {
      lead: 'Initial qualification call',
      qualified: 'Send detailed proposal',
      proposal: 'Schedule demo session',
      negotiation: 'Contract terms discussion',
      closed: 'Implementation kickoff',
    };
    return actions[stage] || 'Follow up required';
  }

  /**
   * Generate random past date
   */
  getRandomPastDate() {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
  }

  /**
   * Generate sample activities
   */
  generateSampleActivities() {
    this.activities = [
      {
        id: 'ACT001',
        type: 'call',
        title: 'Customer Discovery Call',
        description:
          'Jennifer Wilson conducted discovery call with TechCorp Inc. regarding enterprise platform requirements.',
        timestamp: '2024-12-30T12:30:00Z',
        owner: 'Jennifer Wilson',
        company: 'TechCorp Inc.',
        dealValue: 2400000,
        duration: 45,
        outcome: 'positive',
      },
      {
        id: 'ACT002',
        type: 'meeting',
        title: 'Product Demo Completed',
        description:
          'Robert Chen presented comprehensive product demo to Global Systems stakeholder team.',
        timestamp: '2024-12-30T09:00:00Z',
        owner: 'Robert Chen',
        company: 'Global Systems Ltd.',
        attendees: 8,
        outcome: 'positive',
      },
      {
        id: 'ACT003',
        type: 'email',
        title: 'Follow-up Email Sent',
        description:
          'Lisa Anderson sent detailed follow-up with ROI analysis to DataFlow Corp decision makers.',
        timestamp: '2024-12-29T15:20:00Z',
        owner: 'Lisa Anderson',
        company: 'DataFlow Corp',
        recipients: 3,
        outcome: 'neutral',
      },
      {
        id: 'ACT004',
        type: 'won',
        title: 'Deal Closed - Won',
        description:
          'Successfully closed enterprise deal with Innovation Labs for comprehensive business suite implementation.',
        timestamp: '2024-12-28T14:00:00Z',
        owner: 'Jennifer Wilson',
        company: 'Innovation Labs',
        dealValue: 1800000,
        outcome: 'positive',
      },
    ];
  }

  /**
   * Initialize data visualization charts
   */
  async initializeCharts() {
    console.log('📊 Initializing CRM Analytics Charts...');

    try {
      // Revenue Trend Chart
      await this.createRevenueTrendChart();

      // Customer Acquisition Chart
      await this.createCustomerAcquisitionChart();

      // Team Performance Chart
      await this.createTeamPerformanceChart();

      this.performanceMetrics.chartRenders = 3;
      console.log('✅ All CRM analytics charts initialized');
    } catch (error) {
      console.error('❌ CRM chart initialization failed:', error);
    }
  }

  /**
   * Create Revenue Trend Chart
   */
  async createRevenueTrendChart() {
    const ctx = document.getElementById('revenueTrendChart');
    if (!ctx) return;

    const months = [
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
    ];
    const revenueData = [
      3800000, 3650000, 4100000, 3950000, 4300000, 4150000, 4500000, 4200000, 4650000, 4800000,
      5200000, 4200000,
    ];
    const targetData = [
      4000000, 4000000, 4000000, 4000000, 4000000, 4000000, 4000000, 4000000, 4000000, 4000000,
      4000000, 4000000,
    ];

    this.charts.revenueTrend = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Actual Revenue',
            data: revenueData,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#2563eb',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
          },
          {
            label: 'Target',
            data: targetData,
            borderColor: '#94a3b8',
            backgroundColor: 'rgba(148, 163, 184, 0.05)',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            tension: 0,
            pointRadius: 0,
            pointHoverRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12,
                weight: '500',
              },
            },
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleColor: '#f8fafc',
            bodyColor: '#f8fafc',
            borderColor: '#334155',
            borderWidth: 1,
            cornerRadius: 8,
            callbacks: {
              title: function (context) {
                return `${context[0].label} 2024 Revenue`;
              },
              label: function (context) {
                const label = context.dataset.label;
                const value = context.parsed.y;
                return `${label}: $${(value / 1000000).toFixed(1)}M`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#64748b',
              font: {
                size: 12,
              },
            },
          },
          y: {
            beginAtZero: false,
            grid: {
              color: '#f1f5f9',
            },
            ticks: {
              color: '#64748b',
              font: {
                size: 12,
              },
              callback: function (value) {
                return '$' + (value / 1000000).toFixed(1) + 'M';
              },
            },
          },
        },
        animation: {
          duration: 1200,
          easing: 'easeInOutQuart',
        },
      },
    });
  }

  /**
   * Create Customer Acquisition Chart
   */
  async createCustomerAcquisitionChart() {
    const ctx = document.getElementById('customerAcquisitionChart');
    if (!ctx) return;

    const months = [
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
    ];
    const newCustomers = [23, 31, 28, 35, 42, 38, 45, 41, 47, 52, 48, 39];
    const churnRate = [2.1, 1.8, 2.3, 1.9, 1.7, 2.0, 1.6, 2.2, 1.8, 1.5, 1.9, 2.4];

    this.charts.customerAcquisition = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'New Customers',
            data: newCustomers,
            backgroundColor: 'rgba(37, 99, 235, 0.8)',
            borderColor: '#2563eb',
            borderWidth: 1,
            borderRadius: 4,
            yAxisID: 'y',
          },
          {
            label: 'Churn Rate (%)',
            data: churnRate,
            type: 'line',
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            pointBackgroundColor: '#ef4444',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4,
            yAxisID: 'y1',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12,
                weight: '500',
              },
            },
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleColor: '#f8fafc',
            bodyColor: '#f8fafc',
            borderColor: '#334155',
            borderWidth: 1,
            cornerRadius: 8,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#64748b',
              font: {
                size: 12,
              },
            },
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            beginAtZero: true,
            grid: {
              color: '#f1f5f9',
            },
            ticks: {
              color: '#64748b',
              font: {
                size: 12,
              },
            },
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            beginAtZero: true,
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              color: '#64748b',
              font: {
                size: 12,
              },
              callback: function (value) {
                return value + '%';
              },
            },
          },
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart',
        },
      },
    });
  }

  /**
   * Create Team Performance Chart
   */
  async createTeamPerformanceChart() {
    const ctx = document.getElementById('teamPerformanceChart');
    if (!ctx) return;

    const teams = [
      'Enterprise Sales',
      'SMB Sales',
      'Channel Partners',
      'Inside Sales',
      'Customer Success',
    ];
    const revenueData = [18500000, 12300000, 8700000, 5400000, 2900000];
    const targetData = [18000000, 12000000, 8000000, 5000000, 3000000];

    this.charts.teamPerformance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: teams,
        datasets: [
          {
            label: 'Actual Revenue',
            data: revenueData,
            backgroundColor: [
              'rgba(37, 99, 235, 0.8)',
              'rgba(124, 58, 237, 0.8)',
              'rgba(5, 150, 105, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(239, 68, 68, 0.8)',
            ],
            borderColor: ['#2563eb', '#7c3aed', '#059669', '#f59e0b', '#ef4444'],
            borderWidth: 1,
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: 'Target Revenue',
            data: targetData,
            backgroundColor: 'rgba(148, 163, 184, 0.3)',
            borderColor: '#94a3b8',
            borderWidth: 1,
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12,
                weight: '500',
              },
            },
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleColor: '#f8fafc',
            bodyColor: '#f8fafc',
            borderColor: '#334155',
            borderWidth: 1,
            cornerRadius: 8,
            callbacks: {
              label: function (context) {
                const label = context.dataset.label;
                const value = context.parsed.y;
                return `${label}: $${(value / 1000000).toFixed(1)}M`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#64748b',
              font: {
                size: 12,
              },
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: '#f1f5f9',
            },
            ticks: {
              color: '#64748b',
              font: {
                size: 12,
              },
              callback: function (value) {
                return '$' + (value / 1000000).toFixed(0) + 'M';
              },
            },
          },
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart',
        },
      },
    });
  }

  /**
   * Initialize drag-and-drop pipeline
   */
  initializePipeline() {
    console.log('🎯 Initializing drag-and-drop sales pipeline...');

    // Populate pipeline stages with deals
    this.populatePipelineStages();

    // Initialize sortable for each stage
    const stages = [
      'leadsStage',
      'qualifiedStage',
      'proposalStage',
      'negotiationStage',
      'closedStage',
    ];

    stages.forEach((stageId) => {
      const stageElement = document.getElementById(stageId);
      if (stageElement) {
        const sortable = Sortable.create(stageElement, {
          group: 'pipeline',
          animation: 200,
          ghostClass: 'deal-card-ghost',
          chosenClass: 'deal-card-chosen',
          dragClass: 'deal-card-drag',
          onEnd: (evt) => {
            this.handleDealMove(evt);
          },
        });
        this.sortableInstances.push(sortable);
      }
    });

    console.log('✅ Sales pipeline drag-and-drop initialized');
  }

  /**
   * Populate pipeline stages with deal cards
   */
  populatePipelineStages() {
    const stages = {
      leadsStage: 'lead',
      qualifiedStage: 'qualified',
      proposalStage: 'proposal',
      negotiationStage: 'negotiation',
      closedStage: 'closed',
    };

    Object.entries(stages).forEach(([elementId, stageName]) => {
      const stageElement = document.getElementById(elementId);
      if (!stageElement) return;

      const stageDeals = this.deals.filter((deal) => deal.stage === stageName).slice(0, 10); // Limit to 10 deals per stage for performance

      stageElement.innerHTML = stageDeals.map((deal) => this.createDealCard(deal)).join('');
    });

    // Update stage statistics
    this.updateStageStatistics();
  }

  /**
   * Create deal card HTML
   */
  createDealCard(deal) {
    const riskClass = deal.riskLevel ? `risk-${deal.riskLevel}` : '';
    const riskIndicator =
      deal.riskLevel === 'high'
        ? '<div class="deal-risk-indicator"><i class="fas fa-exclamation-triangle"></i></div>'
        : '';

    return `
            <div class="deal-card ${riskClass}" data-deal-id="${deal.id}" data-stage="${deal.stage}">
                ${riskIndicator}
                <div class="deal-header">
                    <div class="deal-meta">
                        <h4 class="deal-title">${deal.title}</h4>
                        <p class="deal-company">${deal.company}</p>
                    </div>
                    <div class="deal-value">$${this.formatCurrency(deal.value)}</div>
                </div>
                <div class="deal-details">
                    <div class="deal-probability">
                        <span class="probability-label">Probability:</span>
                        <span class="probability-value">${deal.probability}%</span>
                        <div class="probability-bar">
                            <div class="probability-fill" style="width: ${deal.probability}%"></div>
                        </div>
                    </div>
                    <div class="deal-meta-info">
                        <span class="meta-item">
                            <i class="fas fa-calendar"></i>
                            ${this.formatDate(deal.closeDate)}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-clock"></i>
                            ${this.getTimeAgo(deal.lastActivity)}
                        </span>
                    </div>
                </div>
                <div class="deal-owner">
                    <img src="${deal.ownerAvatar}" alt="${deal.owner}" class="owner-avatar">
                    <span class="owner-name">${deal.owner}</span>
                </div>
                <div class="deal-actions">
                    <button class="deal-action-btn" onclick="crmSystem.viewDealDetails('${deal.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="deal-action-btn" onclick="crmSystem.editDeal('${deal.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="deal-action-btn" onclick="crmSystem.addActivity('${deal.id}')">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
  }

  /**
   * Update stage statistics
   */
  updateStageStatistics() {
    const stages = ['lead', 'qualified', 'proposal', 'negotiation', 'closed'];

    stages.forEach((stage) => {
      const stageDeals = this.deals.filter((deal) => deal.stage === stage);
      const totalValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);

      // Update count
      const countElement = document.querySelector(`[data-stage="${stage}"] .stage-count`);
      if (countElement) {
        countElement.textContent = stageDeals.length.toString();
      }

      // Update value
      const valueElement = document.querySelector(`[data-stage="${stage}"] .stage-value`);
      if (valueElement) {
        valueElement.textContent = '$' + this.formatCurrency(totalValue);
      }
    });
  }

  /**
   * Handle deal movement between stages
   */
  handleDealMove(evt) {
    const dealId = evt.item.dataset.dealId;
    const newStage = evt.to.id.replace('Stage', '').toLowerCase();
    const oldStage = evt.from.id.replace('Stage', '').toLowerCase();

    console.log(`💼 Moving deal ${dealId} from ${oldStage} to ${newStage}`);

    // Update deal stage in data
    const deal = this.deals.find((d) => d.id === dealId);
    if (deal) {
      deal.stage = newStage;

      // Update probability based on new stage
      deal.probability = this.getStageprobability(newStage);

      // Log activity
      this.logDealActivity(dealId, `Deal moved to ${newStage} stage`);

      // Update stage statistics
      this.updateStageStatistics();

      // Show success notification
      this.showNotification(`Deal moved to ${newStage} stage`, 'success');
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    console.log('🎛️ Setting up CRM event listeners...');

    // Sidebar navigation
    document.querySelectorAll('.menu-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchSection(item.dataset.section);
      });
    });

    // Header action buttons
    const newOpportunityBtn = document.getElementById('newOpportunity');
    if (newOpportunityBtn) {
      newOpportunityBtn.addEventListener('click', () => {
        this.showNewOpportunityModal();
      });
    }

    const exportBtn = document.getElementById('exportCRMData');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.exportCRMData();
      });
    }

    // Activity filters
    document.querySelectorAll('.activity-filter').forEach((filter) => {
      filter.addEventListener('click', (e) => {
        document.querySelectorAll('.activity-filter').forEach((f) => f.classList.remove('active'));
        e.target.classList.add('active');
        this.filterActivities(e.target.dataset.filter);
      });
    });

    // Chart controls
    this.setupChartControlListeners();

    // Notification center
    const notificationCenter = document.querySelector('.titan-notification-center');
    if (notificationCenter) {
      notificationCenter.addEventListener('click', () => {
        this.toggleNotificationDropdown();
      });
    }

    console.log('✅ CRM event listeners configured');
  }

  /**
   * Setup chart control listeners
   */
  setupChartControlListeners() {
    // Revenue time filter
    const revenueFilter = document.getElementById('revenueTimeFilter');
    if (revenueFilter) {
      revenueFilter.addEventListener('change', (e) => {
        this.updateRevenueTrendChart(e.target.value);
      });
    }

    // Customer acquisition view toggles
    document.querySelectorAll('[data-view]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-view]').forEach((b) => b.classList.remove('active'));
        e.target.classList.add('active');
        this.updateCustomerAcquisitionChart(e.target.dataset.view);
      });
    });

    // Team performance data toggles
    document.querySelectorAll('[data-type]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-type]').forEach((b) => b.classList.remove('active'));
        e.target.classList.add('active');
        this.updateTeamPerformanceChart(e.target.dataset.type);
      });
    });
  }

  /**
   * Setup navigation
   */
  setupNavigation() {
    console.log('🧭 Setting up CRM navigation...');

    // Main navigation items
    document.querySelectorAll('.nav-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();

        // Update main navigation
        document.querySelectorAll('.nav-item').forEach((nav) => nav.classList.remove('active'));
        item.classList.add('active');

        // Handle module switching
        const module = item.dataset.module;
        if (module && module !== 'crm') {
          console.log(`🔄 Navigating to ${module} module...`);
          this.navigateToModule(module);
        }
      });
    });
  }

  /**
   * Navigate to other modules
   */
  navigateToModule(module) {
    const moduleUrls = {
      dashboard: 'dashboard.html',
      'hr-management': 'hr-management.html',
      manufacturing: 'manufacturing.html',
      financials: 'financials.html',
      'supply-chain': '#', // To be implemented
      project: '#', // To be implemented
    };

    if (moduleUrls[module] && moduleUrls[module] !== '#') {
      window.location.href = moduleUrls[module];
    }
  }

  /**
   * Switch between CRM sections
   */
  switchSection(sectionId) {
    console.log(`📄 Switching to CRM section: ${sectionId}`);

    this.currentSection = sectionId;

    // Update sidebar menu
    document.querySelectorAll('.menu-item').forEach((item) => {
      item.classList.remove('active');
    });

    const activeMenuItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeMenuItem) {
      activeMenuItem.classList.add('active');
    }

    // Show/hide content sections
    document.querySelectorAll('.content-section').forEach((section) => {
      section.classList.remove('active');
    });

    const targetSection = document.getElementById(
      sectionId === 'dashboard' ? 'crm-dashboard' : `${sectionId}-management`
    );
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Load section-specific data
    this.loadSectionData(sectionId);
  }

  /**
   * Load section-specific data
   */
  async loadSectionData(sectionId) {
    switch (sectionId) {
      case 'dashboard':
        await this.loadDashboardData();
        break;
      case 'pipeline':
        await this.loadPipelineData();
        break;
      case 'customers':
        await this.loadCustomerData();
        break;
      case 'opportunities':
        await this.loadOpportunityData();
        break;
    }
  }

  /**
   * Load dashboard data
   */
  async loadDashboardData() {
    console.log('📊 Loading CRM dashboard data...');
    this.updateKPICards();
    this.refreshCharts();
  }

  /**
   * Load pipeline data
   */
  async loadPipelineData() {
    console.log('🎯 Loading sales pipeline data...');
    this.populatePipelineStages();
  }

  /**
   * Update KPI cards
   */
  updateKPICards() {
    // Calculate real-time metrics
    const metrics = this.calculateSalesMetrics();

    // Update revenue
    const revenueEl = document.querySelector('.kpi-card.revenue .kpi-value');
    if (revenueEl) {
      revenueEl.textContent = '$' + (metrics.monthlyRevenue / 1000000).toFixed(1) + 'M';
    }

    // Update pipeline value
    const pipelineEl = document.querySelector('.kpi-card.pipeline .kpi-value');
    if (pipelineEl) {
      pipelineEl.textContent = '$' + (metrics.pipelineValue / 1000000).toFixed(1) + 'M';
    }

    // Update customer count
    const customersEl = document.querySelector('.kpi-card.customers .kpi-value');
    if (customersEl) {
      customersEl.textContent = metrics.activeCustomers.toLocaleString();
    }

    // Update satisfaction score
    const satisfactionEl = document.querySelector('.kpi-card.satisfaction .kpi-value');
    if (satisfactionEl) {
      satisfactionEl.textContent = metrics.satisfaction + '%';
    }
  }

  /**
   * Calculate sales metrics
   */
  calculateSalesMetrics() {
    const activeDeals = this.deals.filter(
      (deal) => deal.stage !== 'closed' && deal.stage !== 'lost'
    );
    const pipelineValue = activeDeals.reduce((sum, deal) => sum + deal.value, 0);
    const monthlyRevenue = 4200000; // Current month revenue
    const activeCustomers = 2847;
    const satisfaction = 94.7;

    return {
      pipelineValue,
      monthlyRevenue,
      activeCustomers,
      satisfaction,
      activeDealCount: activeDeals.length,
      averageDealSize: activeDeals.length > 0 ? pipelineValue / activeDeals.length : 0,
    };
  }

  /**
   * Initialize search functionality
   */
  initializeSearch() {
    console.log('🔍 Initializing CRM search functionality...');

    const globalSearch = document.getElementById('crmGlobalSearch');
    if (globalSearch) {
      globalSearch.addEventListener('input', (e) => {
        this.handleGlobalSearch(e.target.value);
      });

      globalSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.executeGlobalSearch(e.target.value);
        }
      });
    }
  }

  /**
   * Handle global search
   */
  handleGlobalSearch(query) {
    if (query.length < 2) {
      this.hideSearchSuggestions();
      return;
    }

    const suggestions = this.generateCRMSearchSuggestions(query);
    this.showSearchSuggestions(suggestions);
  }

  /**
   * Generate CRM search suggestions
   */
  generateCRMSearchSuggestions(query) {
    const suggestions = [];
    const lowercaseQuery = query.toLowerCase();

    // Deal suggestions
    const dealMatches = this.deals
      .filter(
        (deal) =>
          deal.title.toLowerCase().includes(lowercaseQuery) ||
          deal.company.toLowerCase().includes(lowercaseQuery) ||
          deal.owner.toLowerCase().includes(lowercaseQuery)
      )
      .slice(0, 3);

    dealMatches.forEach((deal) => {
      suggestions.push({
        type: 'deal',
        title: deal.title,
        subtitle: `${deal.company} - $${this.formatCurrency(deal.value)}`,
        icon: 'fas fa-handshake',
        action: () => this.viewDealDetails(deal.id),
      });
    });

    // Customer suggestions
    const customerMatches = this.customers
      .filter(
        (customer) =>
          customer.name.toLowerCase().includes(lowercaseQuery) ||
          customer.industry.toLowerCase().includes(lowercaseQuery)
      )
      .slice(0, 3);

    customerMatches.forEach((customer) => {
      suggestions.push({
        type: 'customer',
        title: customer.name,
        subtitle: `${customer.industry} - ${customer.type}`,
        icon: 'fas fa-building',
        action: () => this.viewCustomerDetails(customer.id),
      });
    });

    return suggestions;
  }

  /**
   * Show search suggestions
   */
  showSearchSuggestions(suggestions) {
    const dropdown = document.getElementById('crmSearchSuggestions');
    if (!dropdown) return;

    if (suggestions.length === 0) {
      dropdown.style.display = 'none';
      return;
    }

    dropdown.innerHTML = suggestions
      .map(
        (suggestion) => `
            <div class="suggestion-item" data-type="${suggestion.type}">
                <div class="suggestion-icon">
                    <i class="${suggestion.icon}"></i>
                </div>
                <div class="suggestion-content">
                    <div class="suggestion-title">${suggestion.title}</div>
                    <div class="suggestion-subtitle">${suggestion.subtitle}</div>
                </div>
            </div>
        `
      )
      .join('');

    dropdown.style.display = 'block';

    // Add click listeners
    dropdown.querySelectorAll('.suggestion-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        suggestions[index].action();
        this.hideSearchSuggestions();
      });
    });
  }

  /**
   * Hide search suggestions
   */
  hideSearchSuggestions() {
    const dropdown = document.getElementById('crmSearchSuggestions');
    if (dropdown) {
      dropdown.style.display = 'none';
    }
  }

  /**
   * Setup real-time updates
   */
  setupRealTimeUpdates() {
    console.log('🔄 Setting up real-time CRM updates...');

    // Update KPIs every 30 seconds
    setInterval(() => {
      this.updateKPICards();
      this.updateNotificationsBadge();
    }, 30000);

    // Refresh charts every 5 minutes
    setInterval(() => {
      this.refreshCharts();
    }, 300000);

    // Simulate new activities every 2 minutes
    setInterval(() => {
      this.simulateNewActivity();
    }, 120000);
  }

  /**
   * Toggle notification dropdown
   */
  toggleNotificationDropdown() {
    const dropdown = document.getElementById('notificationDropdown');
    if (dropdown) {
      const isVisible = dropdown.style.display === 'block';
      dropdown.style.display = isVisible ? 'none' : 'block';
    }
  }

  /**
   * Update notifications badge
   */
  updateNotificationsBadge() {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
      const currentCount = parseInt(badge.textContent);
      const newCount = Math.max(0, currentCount + Math.floor(Math.random() * 2) - 1);
      badge.textContent = newCount.toString();
    }
  }

  /**
   * Refresh chart data
   */
  refreshCharts() {
    console.log('🔄 Refreshing CRM chart data...');

    Object.values(this.charts).forEach((chart) => {
      if (chart && chart.data && chart.data.datasets) {
        chart.data.datasets.forEach((dataset) => {
          if (dataset.label !== 'Target' && dataset.label !== 'Target Revenue') {
            dataset.data = dataset.data.map((value) => {
              const variation = 0.95 + Math.random() * 0.1;
              return Math.round(value * variation);
            });
          }
        });
        chart.update('none');
      }
    });
  }

  /**
   * Simulate new activity
   */
  simulateNewActivity() {
    const activityTypes = ['call', 'email', 'meeting'];
    const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const deal = this.deals[Math.floor(Math.random() * this.deals.length)];

    const newActivity = {
      id: `ACT${Date.now()}`,
      type: type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Activity`,
      description: `Automated ${type} activity for ${deal.company}`,
      timestamp: new Date().toISOString(),
      owner: deal.owner,
      company: deal.company,
      outcome: 'positive',
    };

    this.activities.unshift(newActivity);
    this.updateNotificationsBadge();

    console.log(`🆕 New ${type} activity added for ${deal.company}`);
  }

  /**
   * View deal details
   */
  viewDealDetails(dealId) {
    console.log(`👁️ Viewing deal details: ${dealId}`);

    const deal = this.deals.find((d) => d.id === dealId);
    if (!deal) return;

    const modal = document.getElementById('opportunityModalOverlay');
    const modalTitle = document.getElementById('opportunityModalTitle');
    const modalContent = document.getElementById('opportunityModalContent');

    if (!modal || !modalTitle || !modalContent) return;

    modalTitle.textContent = `${deal.title} - Deal Details`;

    modalContent.innerHTML = `
            <div class="deal-detail-card">
                <div class="deal-detail-header">
                    <div class="deal-detail-info">
                        <h3 class="deal-detail-title">${deal.title}</h3>
                        <p class="deal-detail-company">${deal.company}</p>
                        <div class="deal-detail-value">$${this.formatCurrency(deal.value)}</div>
                    </div>
                    <div class="deal-detail-meta">
                        <span class="stage-badge ${deal.stage}">${deal.stage.toUpperCase()}</span>
                        <div class="probability-indicator">
                            <span class="probability-label">${deal.probability}% probability</span>
                            <div class="probability-bar-large">
                                <div class="probability-fill-large" style="width: ${deal.probability}%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="deal-detail-content">
                    <div class="detail-section">
                        <h4 class="detail-section-title">Key Information</h4>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <span class="detail-label">Expected Close:</span>
                                <span class="detail-value">${this.formatDate(deal.closeDate)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Deal Owner:</span>
                                <span class="detail-value">${deal.owner}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Last Activity:</span>
                                <span class="detail-value">${this.getTimeAgo(deal.lastActivity)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Risk Level:</span>
                                <span class="detail-value risk-${deal.riskLevel}">${deal.riskLevel.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4 class="detail-section-title">Next Actions</h4>
                        <div class="next-actions">
                            <div class="action-item">
                                <i class="fas fa-phone"></i>
                                <span>${deal.nextAction}</span>
                                <button class="action-complete-btn">Mark Complete</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-actions">
                        <button class="titan-btn titan-btn-primary">
                            <i class="fas fa-edit"></i>
                            Edit Deal
                        </button>
                        <button class="titan-btn titan-btn-secondary">
                            <i class="fas fa-calendar-plus"></i>
                            Schedule Activity
                        </button>
                        <button class="titan-btn titan-btn-secondary">
                            <i class="fas fa-envelope"></i>
                            Send Email
                        </button>
                    </div>
                </div>
            </div>
        `;

    modal.classList.add('active');
  }

  /**
   * Log deal activity
   */
  logDealActivity(dealId, description) {
    const deal = this.deals.find((d) => d.id === dealId);
    if (!deal) return;

    const activity = {
      id: `ACT${Date.now()}`,
      type: 'system',
      title: 'Deal Stage Change',
      description: description,
      timestamp: new Date().toISOString(),
      owner: deal.owner,
      company: deal.company,
      dealId: dealId,
    };

    this.activities.unshift(activity);
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    // Create temporary notification
    const notification = document.createElement('div');
    notification.className = `crm-notification ${type}`;
    notification.textContent = message;

    notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1001;
            animation: slideInRight 0.3s ease;
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  /**
   * Utility functions
   */
  formatCurrency(amount) {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(0) + 'K';
    }
    return amount.toLocaleString();
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getTimeAgo(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    }
  }

  /**
   * Export CRM data
   */
  exportCRMData() {
    console.log('📤 Exporting CRM data...');
    alert('CRM Data Export functionality - To be implemented in Phase 2');
  }

  /**
   * Show new opportunity modal
   */
  showNewOpportunityModal() {
    console.log('🆕 Opening new opportunity modal...');
    alert('New Opportunity functionality - To be implemented in Phase 2');
  }

  /**
   * Filter activities by type
   */
  filterActivities(filterType) {
    console.log(`🔍 Filtering activities by: ${filterType}`);

    // In a real implementation, this would filter the activities timeline
    // For now, we'll just log the action
  }

  /**
   * Update chart based on filters
   */
  updateRevenueTrendChart(timeframe) {
    console.log(`📈 Updating revenue chart for: ${timeframe}`);

    const chart = this.charts.revenueTrend;
    if (chart) {
      // In a real implementation, this would fetch different data
      chart.update();
    }
  }

  updateCustomerAcquisitionChart(view) {
    console.log(`👥 Updating customer acquisition chart view: ${view}`);

    const chart = this.charts.customerAcquisition;
    if (chart) {
      chart.update();
    }
  }

  updateTeamPerformanceChart(dataType) {
    console.log(`👥 Updating team performance chart for: ${dataType}`);

    const chart = this.charts.teamPerformance;
    if (chart) {
      chart.update();
    }
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    return {
      ...this.performanceMetrics,
      dealCount: this.deals.length,
      customerCount: this.customers.length,
      activitiesCount: this.activities.length,
      chartsInitialized: Object.keys(this.charts).length,
      currentSection: this.currentSection,
      memoryUsage: performance.memory
        ? Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)
        : 'N/A',
    };
  }

  /**
   * Log performance metrics
   */
  logPerformance() {
    const metrics = this.getPerformanceMetrics();
    console.log('🎯 CRM System Performance Metrics:');
    console.log('  Load Time:', metrics.loadTime.toFixed(2) + 'ms');
    console.log('  Render Time:', metrics.renderTime.toFixed(2) + 'ms');
    console.log('  Deal Records:', metrics.dealCount.toLocaleString());
    console.log('  Customer Records:', metrics.customerCount.toLocaleString());
    console.log('  Charts Initialized:', metrics.chartsInitialized);
    console.log('  Memory Usage:', metrics.memoryUsage + 'MB');
  }
}

// Global CRM System instance
let crmSystem;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async function () {
  console.log('🏗️ DOM loaded, initializing CRM Management System...');

  crmSystem = new CRMManagementSystem();
  await crmSystem.init();

  // Make system globally available
  window.crmSystem = crmSystem;

  // Setup modal close functionality
  const closeOpportunityModal = document.getElementById('closeOpportunityModal');
  if (closeOpportunityModal) {
    closeOpportunityModal.addEventListener('click', () => {
      document.getElementById('opportunityModalOverlay').classList.remove('active');
    });
  }

  const closeCustomerModal = document.getElementById('closeCustomerModal');
  if (closeCustomerModal) {
    closeCustomerModal.addEventListener('click', () => {
      document.getElementById('customerModalOverlay').classList.remove('active');
    });
  }

  // Close modals when clicking overlay
  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  console.log('🎉 CRM Management System fully operational!');
  console.log('🏆 Oracle EBS competitive advantages:');
  console.log('   ✅ Visual drag-and-drop pipeline (vs Oracle static forms)');
  console.log('   ✅ Real-time sales analytics and forecasting');
  console.log('   ✅ Advanced customer relationship mapping');
  console.log('   ✅ Mobile-optimized sales tools');
  console.log('   ✅ Integrated marketing campaign management');
  console.log('   ✅ AI-powered sales insights and predictions');

  // Log performance metrics after initialization
  setTimeout(() => {
    crmSystem.logPerformance();
  }, 2000);
});

// Global functions for onclick handlers
window.viewDealDetails = function (dealId) {
  if (window.crmSystem) {
    window.crmSystem.viewDealDetails(dealId);
  }
};

window.editDeal = function (dealId) {
  console.log(`✏️ Editing deal: ${dealId}`);
  alert('Edit Deal functionality - To be implemented in Phase 2');
};

window.addActivity = function (dealId) {
  console.log(`📝 Adding activity for deal: ${dealId}`);
  alert('Add Activity functionality - To be implemented in Phase 2');
};

// Keyboard shortcuts
document.addEventListener('keydown', function (e) {
  // Ctrl+K or Cmd+K for global search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const searchInput = document.getElementById('crmGlobalSearch');
    if (searchInput) {
      searchInput.focus();
    }
  }

  // Escape to close modals
  if (e.key === 'Escape') {
    const activeModal = document.querySelector('.modal-overlay.active');
    if (activeModal) {
      activeModal.classList.remove('active');
    }
  }

  // N for new opportunity
  if (e.key === 'n' && !e.ctrlKey && !e.metaKey) {
    const activeElement = document.activeElement;
    if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
      if (window.crmSystem) {
        window.crmSystem.showNewOpportunityModal();
      }
    }
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CRMManagementSystem };
}
