/**
 * Titan Grove Enterprise Asset Management System
 * Complete asset lifecycle management with maintenance scheduling, compliance tracking,
 * and performance analytics - Oracle EBS competitive alternative
 */

class TitanAssetManagementSystem {
  constructor() {
    this.assets = new Map();
    this.workOrders = new Map();
    this.maintenanceSchedules = new Map();
    this.locations = new Map();
    this.vendors = new Map();
    this.currentView = 'overview';
    this.selectedAsset = null;
    this.filters = {
      status: 'all',
      category: 'all',
      location: 'all',
      criticality: 'all',
    };
    this.dashboardCharts = {};
    this.realTimeUpdates = false;
    this.notifications = [];
    this.initialize();
  }

  async initialize() {
    try {
      this.setupEventListeners();
      this.loadInitialData();
      this.initializeDashboardCharts();
      this.setupAssetTracking();
      this.startMaintenanceScheduler();
      this.initializeRealTimeMonitoring();
      console.log('✅ Titan Asset Management System initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Asset Management:', error);
    }
  }

  setupEventListeners() {
    // Navigation events
    document.addEventListener('click', (e) => {
      if (e.target.matches('.asset-nav-item')) {
        this.switchView(e.target.dataset.view);
      }
      if (e.target.matches('.asset-btn-create')) {
        this.openCreateAssetModal();
      }
      if (e.target.matches('.asset-btn-maintenance')) {
        this.openMaintenanceModal();
      }
      if (e.target.matches('.asset-action-btn')) {
        this.handleAssetAction(e.target.dataset.action, e.target.dataset.assetId);
      }
      if (e.target.matches('.work-order-action')) {
        this.handleWorkOrderAction(e.target.dataset.action, e.target.dataset.orderId);
      }
      if (e.target.matches('.asset-detail-btn')) {
        this.showAssetDetails(e.target.dataset.assetId);
      }
      if (e.target.matches('.maintenance-schedule-btn')) {
        this.showMaintenanceSchedule(e.target.dataset.assetId);
      }
      if (e.target.matches('.qr-code-btn')) {
        this.generateAssetQRCode(e.target.dataset.assetId);
      }
      if (e.target.matches('.asset-modal-close') || e.target.matches('.asset-modal-overlay')) {
        this.closeModal();
      }
    });

    // Form events
    document.addEventListener('submit', (e) => {
      if (e.target.matches('#assetForm')) {
        e.preventDefault();
        this.submitAssetForm(new FormData(e.target));
      }
      if (e.target.matches('#workOrderForm')) {
        e.preventDefault();
        this.submitWorkOrderForm(new FormData(e.target));
      }
      if (e.target.matches('#maintenanceForm')) {
        e.preventDefault();
        this.submitMaintenanceSchedule(new FormData(e.target));
      }
    });

    // Filter events
    document.addEventListener('change', (e) => {
      if (e.target.matches('.asset-filter-select')) {
        this.applyFilters();
      }
      if (e.target.matches('.asset-status-toggle')) {
        this.updateAssetStatus(e.target.dataset.assetId, e.target.checked);
      }
    });

    // Search events
    document.addEventListener('input', (e) => {
      if (e.target.matches('#assetGlobalSearch')) {
        this.handleAssetSearch(e.target.value);
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'a':
            e.preventDefault();
            this.openCreateAssetModal();
            break;
          case 'm':
            e.preventDefault();
            this.openMaintenanceModal();
            break;
          case 'f':
            e.preventDefault();
            document.querySelector('#assetGlobalSearch')?.focus();
            break;
        }
      }
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  }

  async loadInitialData() {
    try {
      // Load sample data - in production this would come from API
      const sampleAssets = this.generateSampleAssets();
      const sampleWorkOrders = this.generateSampleWorkOrders();
      const sampleLocations = this.generateSampleLocations();
      const sampleVendors = this.generateSampleVendors();

      sampleAssets.forEach((asset) => this.assets.set(asset.id, asset));
      sampleWorkOrders.forEach((order) => this.workOrders.set(order.id, order));
      sampleLocations.forEach((location) => this.locations.set(location.id, location));
      sampleVendors.forEach((vendor) => this.vendors.set(vendor.id, vendor));

      this.updateOverviewDashboard();
      this.updateAssetGrid();
      this.updateMaintenanceCalendar();
      this.updateWorkOrdersTable();
    } catch (error) {
      console.error('Failed to load asset data:', error);
      this.showNotification('Failed to load asset data', 'error');
    }
  }

  generateSampleAssets() {
    return [
      {
        id: 'asset-001',
        assetTag: 'EQ-001',
        name: 'CNC Machining Center #1',
        category: 'Manufacturing Equipment',
        status: 'Operational',
        criticality: 'Critical',
        location: 'Production Floor A',
        manufacturer: 'Haas Automation',
        model: 'VF-2SS',
        serialNumber: 'HA2024001',
        acquisitionDate: new Date('2022-03-15'),
        acquisitionCost: 125000,
        currentValue: 95000,
        expectedLife: 15,
        condition: 'Good',
        lastMaintenance: new Date('2024-08-15'),
        nextMaintenance: new Date('2024-12-15'),
        maintenanceCost: 15000,
        operatingHours: 12500,
        efficiency: 92.5,
        assignedTechnician: 'Mike Rodriguez',
        warrantyExpiry: new Date('2025-03-15'),
        documents: ['Manual_VF2SS.pdf', 'Warranty_EQ001.pdf'],
        specifications: {
          dimensions: '84" x 58" x 82"',
          weight: '7,500 lbs',
          power: '30 HP',
          capacity: '20" x 16" x 20"',
        },
      },
      {
        id: 'asset-002',
        assetTag: 'EQ-002',
        name: 'Industrial Compressor Unit',
        category: 'HVAC Equipment',
        status: 'Maintenance Required',
        criticality: 'High',
        location: 'Utility Room B',
        manufacturer: 'Carrier',
        model: '30XA1002',
        serialNumber: 'CR2023045',
        acquisitionDate: new Date('2023-01-20'),
        acquisitionCost: 35000,
        currentValue: 28000,
        expectedLife: 20,
        condition: 'Fair',
        lastMaintenance: new Date('2024-06-20'),
        nextMaintenance: new Date('2024-09-20'),
        maintenanceCost: 4500,
        operatingHours: 8760,
        efficiency: 85.2,
        assignedTechnician: 'Sarah Johnson',
        warrantyExpiry: new Date('2026-01-20'),
        documents: ['Manual_30XA.pdf', 'Service_Record.pdf'],
        specifications: {
          cooling: '100 Tons',
          refrigerant: 'R-410A',
          voltage: '460V/3Ph',
          efficiency: '11.5 EER',
        },
      },
      {
        id: 'asset-003',
        assetTag: 'IT-003',
        name: 'Enterprise Server Rack',
        category: 'IT Equipment',
        status: 'Operational',
        criticality: 'Critical',
        location: 'Data Center',
        manufacturer: 'Dell Technologies',
        model: 'PowerEdge R750',
        serialNumber: 'DL2024789',
        acquisitionDate: new Date('2024-02-10'),
        acquisitionCost: 45000,
        currentValue: 40000,
        expectedLife: 5,
        condition: 'Excellent',
        lastMaintenance: new Date('2024-08-10'),
        nextMaintenance: new Date('2024-11-10'),
        maintenanceCost: 2500,
        operatingHours: 5760,
        efficiency: 98.5,
        assignedTechnician: 'David Chen',
        warrantyExpiry: new Date('2027-02-10'),
        documents: ['Dell_Manual.pdf', 'Config_Guide.pdf'],
        specifications: {
          cpu: '2x Intel Xeon Silver 4314',
          memory: '128GB DDR4',
          storage: '4TB SSD RAID',
          network: '4x 25GbE',
        },
      },
      {
        id: 'asset-004',
        assetTag: 'VH-004',
        name: 'Forklift - Toyota 8FGU25',
        category: 'Material Handling',
        status: 'Out of Service',
        criticality: 'Medium',
        location: 'Warehouse',
        manufacturer: 'Toyota',
        model: '8FGU25',
        serialNumber: 'TY2022156',
        acquisitionDate: new Date('2022-06-01'),
        acquisitionCost: 28000,
        currentValue: 22000,
        expectedLife: 10,
        condition: 'Poor',
        lastMaintenance: new Date('2024-07-01'),
        nextMaintenance: new Date('2024-10-01'),
        maintenanceCost: 3200,
        operatingHours: 4200,
        efficiency: 75.0,
        assignedTechnician: 'Mark Thompson',
        warrantyExpiry: new Date('2024-06-01'),
        documents: ['Toyota_Manual.pdf', 'Safety_Cert.pdf'],
        specifications: {
          capacity: '5,000 lbs',
          liftHeight: '12 feet',
          fuel: 'Propane',
          tires: 'Pneumatic',
        },
      },
      {
        id: 'asset-005',
        assetTag: 'FB-005',
        name: 'Fire Suppression System',
        category: 'Safety Equipment',
        status: 'Operational',
        criticality: 'Critical',
        location: 'Building Wide',
        manufacturer: 'Tyco Fire Protection',
        model: 'TFP-2000',
        serialNumber: 'TF2023892',
        acquisitionDate: new Date('2023-05-15'),
        acquisitionCost: 75000,
        currentValue: 68000,
        expectedLife: 25,
        condition: 'Excellent',
        lastMaintenance: new Date('2024-05-15'),
        nextMaintenance: new Date('2025-05-15'),
        maintenanceCost: 5000,
        operatingHours: 8760,
        efficiency: 99.8,
        assignedTechnician: 'Lisa Martinez',
        warrantyExpiry: new Date('2028-05-15'),
        documents: ['Fire_System_Manual.pdf', 'Inspection_Cert.pdf'],
        specifications: {
          coverage: '50,000 sq ft',
          zones: '12 Detection Zones',
          sprinklers: '200 Sprinkler Heads',
          pumpCapacity: '1,500 GPM',
        },
      },
    ];
  }

  generateSampleWorkOrders() {
    return [
      {
        id: 'wo-001',
        assetId: 'asset-001',
        orderNumber: 'WO-2024-001',
        title: 'Quarterly Preventive Maintenance',
        description:
          'Complete quarterly maintenance including lubrication, calibration, and safety checks',
        priority: 'Medium',
        status: 'In Progress',
        type: 'Preventive',
        createdDate: new Date('2024-08-01'),
        scheduledDate: new Date('2024-08-15'),
        estimatedHours: 8,
        actualHours: 6,
        assignedTechnician: 'Mike Rodriguez',
        requestedBy: 'Production Manager',
        estimatedCost: 1200,
        actualCost: 950,
        materials: [
          { name: 'Hydraulic Oil', quantity: 5, cost: 150 },
          { name: 'Air Filters', quantity: 2, cost: 80 },
        ],
        notes: 'Replaced worn belts, calibrated sensors, updated software',
      },
      {
        id: 'wo-002',
        assetId: 'asset-002',
        orderNumber: 'WO-2024-002',
        title: 'Compressor Refrigerant Leak Repair',
        description: 'Repair refrigerant leak in condenser unit and recharge system',
        priority: 'High',
        status: 'Scheduled',
        type: 'Corrective',
        createdDate: new Date('2024-08-20'),
        scheduledDate: new Date('2024-09-05'),
        estimatedHours: 12,
        actualHours: 0,
        assignedTechnician: 'Sarah Johnson',
        requestedBy: 'Facilities Manager',
        estimatedCost: 2500,
        actualCost: 0,
        materials: [
          { name: 'R-410A Refrigerant', quantity: 25, cost: 600 },
          { name: 'Condenser Coil', quantity: 1, cost: 800 },
        ],
        notes: 'Leak detected during routine inspection, parts ordered',
      },
      {
        id: 'wo-003',
        assetId: 'asset-004',
        orderNumber: 'WO-2024-003',
        title: 'Forklift Engine Overhaul',
        description: 'Complete engine overhaul including cylinder rebuild and fuel system cleaning',
        priority: 'High',
        status: 'Pending Approval',
        type: 'Major Repair',
        createdDate: new Date('2024-08-25'),
        scheduledDate: new Date('2024-09-10'),
        estimatedHours: 24,
        actualHours: 0,
        assignedTechnician: 'Mark Thompson',
        requestedBy: 'Warehouse Supervisor',
        estimatedCost: 5500,
        actualCost: 0,
        materials: [
          { name: 'Engine Rebuild Kit', quantity: 1, cost: 2800 },
          { name: 'Fuel Injectors', quantity: 4, cost: 400 },
        ],
        notes: 'Major overhaul required due to excessive engine wear',
      },
    ];
  }

  generateSampleLocations() {
    return [
      {
        id: 'loc-001',
        name: 'Production Floor A',
        type: 'Manufacturing',
        building: 'Main Plant',
        floor: 1,
        area: 5000,
        manager: 'John Smith',
        assetCount: 15,
      },
      {
        id: 'loc-002',
        name: 'Utility Room B',
        type: 'Utility',
        building: 'Main Plant',
        floor: 'Basement',
        area: 800,
        manager: 'Jane Doe',
        assetCount: 8,
      },
      {
        id: 'loc-003',
        name: 'Data Center',
        type: 'IT',
        building: 'Office Building',
        floor: 2,
        area: 1200,
        manager: 'Bob Wilson',
        assetCount: 25,
      },
    ];
  }

  generateSampleVendors() {
    return [
      {
        id: 'vendor-001',
        name: 'Industrial Maintenance Corp',
        type: 'Service Provider',
        specialties: ['HVAC', 'Electrical', 'Plumbing'],
        rating: 4.5,
        contractValue: 150000,
        activeContracts: 3,
      },
      {
        id: 'vendor-002',
        name: 'MachineWorks Parts Supply',
        type: 'Parts Supplier',
        specialties: ['CNC Parts', 'Hydraulics', 'Pneumatics'],
        rating: 4.8,
        contractValue: 75000,
        activeContracts: 2,
      },
    ];
  }

  initializeDashboardCharts() {
    // Asset Status Distribution Chart
    const statusCtx = document.getElementById('assetStatusChart')?.getContext('2d');
    if (statusCtx) {
      this.dashboardCharts.statusChart = new Chart(statusCtx, {
        type: 'doughnut',
        data: {
          labels: ['Operational', 'Maintenance Required', 'Out of Service', 'Retired'],
          datasets: [
            {
              data: [65, 20, 10, 5],
              backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#6b7280'],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
          },
        },
      });
    }

    // Asset Value Trend Chart
    const valueTrendCtx = document.getElementById('assetValueTrendChart')?.getContext('2d');
    if (valueTrendCtx) {
      this.dashboardCharts.valueTrendChart = new Chart(valueTrendCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
          datasets: [
            {
              label: 'Asset Value ($M)',
              data: [12.5, 12.3, 12.1, 11.9, 11.8, 11.6, 11.5, 11.4],
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: false,
            },
          },
        },
      });
    }

    // Maintenance Cost Chart
    const costCtx = document.getElementById('maintenanceCostChart')?.getContext('2d');
    if (costCtx) {
      this.dashboardCharts.costChart = new Chart(costCtx, {
        type: 'bar',
        data: {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          datasets: [
            {
              label: 'Planned Maintenance',
              data: [45000, 52000, 38000, 41000],
              backgroundColor: '#10b981',
            },
            {
              label: 'Unplanned Maintenance',
              data: [15000, 22000, 18000, 12000],
              backgroundColor: '#ef4444',
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
            },
          },
        },
      });
    }
  }

  switchView(viewName) {
    this.currentView = viewName;

    // Hide all views
    document.querySelectorAll('.asset-view').forEach((view) => {
      view.style.display = 'none';
    });

    // Show selected view
    const targetView = document.getElementById(`${viewName}View`);
    if (targetView) {
      targetView.style.display = 'block';
    }

    // Update navigation
    document.querySelectorAll('.asset-nav-item').forEach((nav) => {
      nav.classList.remove('active');
    });
    document.querySelector(`[data-view="${viewName}"]`)?.classList.add('active');

    // Load view-specific data
    this.loadViewData(viewName);
  }

  loadViewData(viewName) {
    switch (viewName) {
      case 'overview':
        this.updateOverviewDashboard();
        break;
      case 'assets':
        this.updateAssetGrid();
        break;
      case 'maintenance':
        this.updateMaintenanceCalendar();
        break;
      case 'workorders':
        this.updateWorkOrdersTable();
        break;
      case 'reports':
        this.updateReportsView();
        break;
    }
  }

  updateOverviewDashboard() {
    // Update KPI cards
    const totalAssets = this.assets.size;
    const operationalAssets = Array.from(this.assets.values()).filter(
      (a) => a.status === 'Operational'
    ).length;
    const criticalAssets = Array.from(this.assets.values()).filter(
      (a) => a.criticality === 'Critical'
    ).length;
    const pendingMaintenance = Array.from(this.workOrders.values()).filter(
      (wo) => wo.status === 'Scheduled'
    ).length;

    const totalAssetsEl = document.querySelector('.kpi-total-assets .kpi-value');
    if (totalAssetsEl) totalAssetsEl.textContent = totalAssets;

    const operationalEl = document.querySelector('.kpi-operational .kpi-value');
    if (operationalEl)
      operationalEl.textContent = `${Math.round((operationalAssets / totalAssets) * 100)}%`;

    const criticalEl = document.querySelector('.kpi-critical .kpi-value');
    if (criticalEl) criticalEl.textContent = criticalAssets;

    const maintenanceEl = document.querySelector('.kpi-maintenance .kpi-value');
    if (maintenanceEl) maintenanceEl.textContent = pendingMaintenance;

    // Update recent activities
    this.updateRecentActivities();
  }

  updateRecentActivities() {
    const activitiesContainer = document.querySelector('.recent-activities-list');
    if (!activitiesContainer) return;

    const activities = [
      {
        type: 'maintenance',
        icon: 'fa-wrench',
        title: 'Maintenance Completed',
        description: 'CNC Machining Center #1 quarterly maintenance completed successfully',
        time: '2 hours ago',
        status: 'success',
      },
      {
        type: 'alert',
        icon: 'fa-exclamation-triangle',
        title: 'High Temperature Alert',
        description: 'Industrial Compressor Unit temperature exceeds normal range',
        time: '4 hours ago',
        status: 'warning',
      },
      {
        type: 'workorder',
        icon: 'fa-clipboard-list',
        title: 'Work Order Created',
        description: 'New work order created for Forklift engine overhaul',
        time: '1 day ago',
        status: 'info',
      },
    ];

    activitiesContainer.innerHTML = activities
      .map(
        (activity) => `
            <div class="activity-item ${activity.status}">
                <div class="activity-icon">
                    <i class="fas ${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <h4 class="activity-title">${activity.title}</h4>
                    <p class="activity-description">${activity.description}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `
      )
      .join('');
  }

  updateAssetGrid() {
    const assetGrid = document.querySelector('.asset-grid');
    if (!assetGrid) return;

    const filteredAssets = this.getFilteredAssets();

    assetGrid.innerHTML = filteredAssets
      .map(
        (asset) => `
            <div class="asset-card" data-asset-id="${asset.id}">
                <div class="asset-card-header">
                    <div class="asset-status ${asset.status.toLowerCase().replace(' ', '-')}">
                        ${asset.status}
                    </div>
                    <div class="asset-criticality ${asset.criticality.toLowerCase()}">
                        ${asset.criticality}
                    </div>
                </div>
                <div class="asset-card-content">
                    <div class="asset-image">
                        <i class="fas fa-cogs"></i>
                    </div>
                    <h3 class="asset-name">${asset.name}</h3>
                    <p class="asset-tag">${asset.assetTag}</p>
                    <p class="asset-location">${asset.location}</p>
                </div>
                <div class="asset-card-metrics">
                    <div class="metric">
                        <span class="metric-label">Condition</span>
                        <span class="metric-value">${asset.condition}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Next Maintenance</span>
                        <span class="metric-value">${asset.nextMaintenance.toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="asset-card-actions">
                    <button class="asset-btn asset-btn-sm asset-detail-btn" data-asset-id="${asset.id}">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="asset-btn asset-btn-sm maintenance-schedule-btn" data-asset-id="${asset.id}">
                        <i class="fas fa-calendar"></i> Schedule
                    </button>
                    <button class="asset-btn asset-btn-sm qr-code-btn" data-asset-id="${asset.id}">
                        <i class="fas fa-qrcode"></i> QR
                    </button>
                </div>
            </div>
        `
      )
      .join('');
  }

  getFilteredAssets() {
    let filtered = Array.from(this.assets.values());

    if (this.filters.status !== 'all') {
      filtered = filtered.filter((asset) => asset.status === this.filters.status);
    }
    if (this.filters.category !== 'all') {
      filtered = filtered.filter((asset) => asset.category === this.filters.category);
    }
    if (this.filters.location !== 'all') {
      filtered = filtered.filter((asset) => asset.location === this.filters.location);
    }
    if (this.filters.criticality !== 'all') {
      filtered = filtered.filter((asset) => asset.criticality === this.filters.criticality);
    }

    return filtered;
  }

  updateWorkOrdersTable() {
    const tableBody = document.querySelector('#workOrdersTableBody');
    if (!tableBody) return;

    const workOrders = Array.from(this.workOrders.values());

    tableBody.innerHTML = workOrders
      .map((order) => {
        const asset = this.assets.get(order.assetId);
        return `
                <tr>
                    <td>${order.orderNumber}</td>
                    <td>${asset ? asset.name : 'Unknown Asset'}</td>
                    <td>${order.title}</td>
                    <td>
                        <span class="status-badge ${order.priority.toLowerCase()}">${order.priority}</span>
                    </td>
                    <td>
                        <span class="status-badge ${order.status.toLowerCase().replace(' ', '-')}">${order.status}</span>
                    </td>
                    <td>${order.assignedTechnician}</td>
                    <td>${order.scheduledDate.toLocaleDateString()}</td>
                    <td>$${order.estimatedCost.toLocaleString()}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="asset-btn asset-btn-sm work-order-action" data-action="view" data-order-id="${order.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="asset-btn asset-btn-sm work-order-action" data-action="edit" data-order-id="${order.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
      })
      .join('');
  }

  updateMaintenanceCalendar() {
    // This would integrate with a calendar library
    console.log('Updating maintenance calendar view...');
    // For now, just update the maintenance overview
    this.updateMaintenanceOverview();
  }

  updateMaintenanceOverview() {
    const upcomingContainer = document.querySelector('.upcoming-maintenance');
    if (!upcomingContainer) return;

    const upcomingMaintenance = Array.from(this.assets.values())
      .filter((asset) => asset.nextMaintenance > new Date())
      .sort((a, b) => a.nextMaintenance - b.nextMaintenance)
      .slice(0, 5);

    upcomingContainer.innerHTML = upcomingMaintenance
      .map(
        (asset) => `
            <div class="maintenance-item">
                <div class="maintenance-asset">
                    <h4>${asset.name}</h4>
                    <span class="asset-tag">${asset.assetTag}</span>
                </div>
                <div class="maintenance-date">
                    ${asset.nextMaintenance.toLocaleDateString()}
                </div>
                <div class="maintenance-type">
                    Preventive
                </div>
                <div class="maintenance-actions">
                    <button class="asset-btn asset-btn-sm" onclick="assetManagement.scheduleMaintenanceNow('${asset.id}')">
                        Schedule Now
                    </button>
                </div>
            </div>
        `
      )
      .join('');
  }

  showAssetDetails(assetId) {
    const asset = this.assets.get(assetId);
    if (!asset) return;

    const modal = document.getElementById('assetDetailsModal');
    if (!modal) return;

    // Populate modal with asset details
    const titleEl = modal.querySelector('.asset-modal-title');
    if (titleEl) titleEl.textContent = asset.name;

    const contentEl = modal.querySelector('.asset-detail-content');
    if (contentEl) {
      contentEl.innerHTML = `
                <div class="asset-detail-grid">
                    <div class="detail-section">
                        <h3>Basic Information</h3>
                        <div class="detail-row">
                            <span class="detail-label">Asset Tag:</span>
                            <span class="detail-value">${asset.assetTag}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Category:</span>
                            <span class="detail-value">${asset.category}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Status:</span>
                            <span class="detail-value status-${asset.status.toLowerCase().replace(' ', '-')}">${asset.status}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Location:</span>
                            <span class="detail-value">${asset.location}</span>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Financial Information</h3>
                        <div class="detail-row">
                            <span class="detail-label">Acquisition Cost:</span>
                            <span class="detail-value">$${asset.acquisitionCost.toLocaleString()}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Current Value:</span>
                            <span class="detail-value">$${asset.currentValue.toLocaleString()}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Annual Maintenance:</span>
                            <span class="detail-value">$${asset.maintenanceCost.toLocaleString()}</span>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Maintenance Information</h3>
                        <div class="detail-row">
                            <span class="detail-label">Last Maintenance:</span>
                            <span class="detail-value">${asset.lastMaintenance.toLocaleDateString()}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Next Maintenance:</span>
                            <span class="detail-value">${asset.nextMaintenance.toLocaleDateString()}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Assigned Technician:</span>
                            <span class="detail-value">${asset.assignedTechnician}</span>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Performance Metrics</h3>
                        <div class="detail-row">
                            <span class="detail-label">Operating Hours:</span>
                            <span class="detail-value">${asset.operatingHours.toLocaleString()}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Efficiency:</span>
                            <span class="detail-value">${asset.efficiency}%</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Condition:</span>
                            <span class="detail-value">${asset.condition}</span>
                        </div>
                    </div>
                </div>
            `;
    }

    this.showModal(modal);
  }

  generateAssetQRCode(assetId) {
    const asset = this.assets.get(assetId);
    if (!asset) return;

    const qrData = JSON.stringify({
      id: asset.id,
      tag: asset.assetTag,
      name: asset.name,
      location: asset.location,
    });

    // Generate QR code using QRCode library
    if (typeof QRCode !== 'undefined') {
      const canvas = document.createElement('canvas');
      QRCode.toCanvas(canvas, qrData, function (error) {
        if (error) {
          console.error('QR Code generation failed:', error);
          return;
        }

        // Create download link
        const link = document.createElement('a');
        link.download = `QR_${asset.assetTag}.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    } else {
      this.showNotification('QR Code library not loaded', 'error');
    }
  }

  openCreateAssetModal() {
    const modal = document.getElementById('createAssetModal');
    if (modal) {
      this.showModal(modal);
    }
  }

  openMaintenanceModal() {
    const modal = document.getElementById('maintenanceModal');
    if (modal) {
      this.showModal(modal);
    }
  }

  showModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    document.querySelectorAll('.asset-modal-overlay.active').forEach((modal) => {
      modal.classList.remove('active');
    });
    document.body.style.overflow = '';
  }

  submitAssetForm(formData) {
    // Process new asset creation
    const assetData = {
      id: 'asset-' + Date.now(),
      assetTag: formData.get('assetTag'),
      name: formData.get('name'),
      category: formData.get('category'),
      status: 'Operational',
      criticality: formData.get('criticality'),
      location: formData.get('location'),
      manufacturer: formData.get('manufacturer'),
      model: formData.get('model'),
      serialNumber: formData.get('serialNumber'),
      acquisitionDate: new Date(formData.get('acquisitionDate')),
      acquisitionCost: parseFloat(formData.get('acquisitionCost')),
      currentValue: parseFloat(formData.get('acquisitionCost')),
      expectedLife: parseInt(formData.get('expectedLife')),
      condition: 'Excellent',
      lastMaintenance: null,
      nextMaintenance: this.calculateNextMaintenance(new Date()),
      operatingHours: 0,
      efficiency: 100,
      assignedTechnician: formData.get('assignedTechnician'),
    };

    this.assets.set(assetData.id, assetData);
    this.updateAssetGrid();
    this.closeModal();
    this.showNotification('Asset created successfully', 'success');
  }

  calculateNextMaintenance(startDate) {
    // Calculate next maintenance date (90 days from start)
    const nextDate = new Date(startDate);
    nextDate.setDate(nextDate.getDate() + 90);
    return nextDate;
  }

  handleAssetAction(action, assetId) {
    const asset = this.assets.get(assetId);
    if (!asset) return;

    switch (action) {
      case 'edit':
        this.editAsset(assetId);
        break;
      case 'delete':
        this.deleteAsset(assetId);
        break;
      case 'duplicate':
        this.duplicateAsset(assetId);
        break;
      case 'maintenance':
        this.scheduleMaintenanceNow(assetId);
        break;
    }
  }

  editAsset(assetId) {
    console.log('Editing asset:', assetId);
    // Implementation for asset editing
    this.showNotification('Asset edit functionality coming soon', 'info');
  }

  deleteAsset(assetId) {
    if (confirm('Are you sure you want to delete this asset?')) {
      this.assets.delete(assetId);
      this.updateAssetGrid();
      this.showNotification('Asset deleted successfully', 'success');
    }
  }

  duplicateAsset(assetId) {
    const asset = this.assets.get(assetId);
    if (asset) {
      const duplicatedAsset = {
        ...asset,
        id: 'asset-' + Date.now(),
        assetTag: asset.assetTag + '-COPY',
        name: asset.name + ' (Copy)',
      };
      this.assets.set(duplicatedAsset.id, duplicatedAsset);
      this.updateAssetGrid();
      this.showNotification('Asset duplicated successfully', 'success');
    }
  }

  scheduleMaintenanceNow(assetId) {
    const asset = this.assets.get(assetId);
    if (!asset) return;

    // Create immediate work order
    const workOrder = {
      id: 'wo-' + Date.now(),
      assetId: assetId,
      orderNumber:
        'WO-' + new Date().getFullYear() + '-' + String(this.workOrders.size + 1).padStart(3, '0'),
      title: 'Scheduled Maintenance - ' + asset.name,
      description: 'Regular maintenance scheduled through asset management system',
      priority: 'Medium',
      status: 'Scheduled',
      type: 'Preventive',
      createdDate: new Date(),
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      estimatedHours: 4,
      actualHours: 0,
      assignedTechnician: asset.assignedTechnician,
      requestedBy: 'Asset Management System',
      estimatedCost: 500,
      actualCost: 0,
      materials: [],
      notes: 'Auto-generated maintenance work order',
    };

    this.workOrders.set(workOrder.id, workOrder);
    this.showNotification('Maintenance scheduled successfully', 'success');
  }

  handleWorkOrderAction(action, orderId) {
    const workOrder = this.workOrders.get(orderId);
    if (!workOrder) return;

    switch (action) {
      case 'view':
        this.viewWorkOrder(orderId);
        break;
      case 'edit':
        this.editWorkOrder(orderId);
        break;
      case 'complete':
        this.completeWorkOrder(orderId);
        break;
      case 'cancel':
        this.cancelWorkOrder(orderId);
        break;
    }
  }

  viewWorkOrder(orderId) {
    console.log('Viewing work order:', orderId);
    // Implementation for work order details
    this.showNotification('Work order details view coming soon', 'info');
  }

  editWorkOrder(orderId) {
    console.log('Editing work order:', orderId);
    // Implementation for work order editing
    this.showNotification('Work order edit functionality coming soon', 'info');
  }

  applyFilters() {
    // Get filter values
    this.filters.status = document.querySelector('#statusFilter')?.value || 'all';
    this.filters.category = document.querySelector('#categoryFilter')?.value || 'all';
    this.filters.location = document.querySelector('#locationFilter')?.value || 'all';
    this.filters.criticality = document.querySelector('#criticalityFilter')?.value || 'all';

    // Update asset grid with filtered results
    this.updateAssetGrid();
  }

  handleAssetSearch(query) {
    if (!query.trim()) {
      this.updateAssetGrid();
      return;
    }

    const filtered = Array.from(this.assets.values()).filter(
      (asset) =>
        asset.name.toLowerCase().includes(query.toLowerCase()) ||
        asset.assetTag.toLowerCase().includes(query.toLowerCase()) ||
        asset.location.toLowerCase().includes(query.toLowerCase()) ||
        asset.category.toLowerCase().includes(query.toLowerCase())
    );

    // Update grid with search results
    const assetGrid = document.querySelector('.asset-grid');
    if (assetGrid && filtered.length === 0) {
      assetGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No assets found</h3>
                    <p>Try adjusting your search terms</p>
                </div>
            `;
    } else {
      // Use filtered results
      const originalAssets = this.assets;
      this.assets = new Map(filtered.map((asset) => [asset.id, asset]));
      this.updateAssetGrid();
      this.assets = originalAssets;
    }
  }

  setupAssetTracking() {
    // Initialize asset tracking and monitoring
    console.log('Setting up real-time asset tracking...');
    this.startAssetHealthMonitoring();
  }

  startAssetHealthMonitoring() {
    // Simulate real-time asset health monitoring
    setInterval(() => {
      Array.from(this.assets.values()).forEach((asset) => {
        // Simulate random condition changes
        if (Math.random() < 0.01) {
          // 1% chance per interval
          this.updateAssetCondition(asset.id);
        }
      });
    }, 30000); // Check every 30 seconds
  }

  updateAssetCondition(assetId) {
    const asset = this.assets.get(assetId);
    if (!asset) return;

    // Simulate condition degradation
    const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];
    const currentIndex = conditions.indexOf(asset.condition);

    if (currentIndex < conditions.length - 1 && Math.random() < 0.5) {
      asset.condition = conditions[currentIndex + 1];

      // Update efficiency based on condition
      asset.efficiency = Math.max(60, asset.efficiency - Math.random() * 5);

      // Create alert for poor condition
      if (asset.condition === 'Poor') {
        this.createMaintenanceAlert(asset);
      }

      // Update displays
      this.updateAssetGrid();
      this.updateOverviewDashboard();
    }
  }

  createMaintenanceAlert(asset) {
    const alert = {
      id: 'alert-' + Date.now(),
      type: 'maintenance',
      severity: 'high',
      assetId: asset.id,
      message: `Asset ${asset.name} requires immediate maintenance - condition is poor`,
      timestamp: new Date(),
      acknowledged: false,
    };

    this.notifications.push(alert);
    this.showNotification(alert.message, 'warning');
  }

  startMaintenanceScheduler() {
    // Check for due maintenance daily
    setInterval(
      () => {
        this.checkMaintenanceDue();
      },
      24 * 60 * 60 * 1000
    ); // Daily check
  }

  checkMaintenanceDue() {
    const today = new Date();
    const threeDaysAhead = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);

    Array.from(this.assets.values()).forEach((asset) => {
      if (asset.nextMaintenance <= threeDaysAhead && asset.nextMaintenance > today) {
        this.createMaintenanceReminder(asset);
      }
    });
  }

  createMaintenanceReminder(asset) {
    const reminder = {
      id: 'reminder-' + Date.now(),
      type: 'maintenance_due',
      severity: 'medium',
      assetId: asset.id,
      message: `Maintenance due for ${asset.name} on ${asset.nextMaintenance.toLocaleDateString()}`,
      timestamp: new Date(),
      acknowledged: false,
    };

    this.notifications.push(reminder);
    this.showNotification(reminder.message, 'info');
  }

  initializeRealTimeMonitoring() {
    // Initialize WebSocket connection for real-time updates
    // This would connect to the backend WebSocket server
    console.log('Initializing real-time asset monitoring...');
    this.realTimeUpdates = true;
  }

  updateReportsView() {
    // Generate and display various asset reports
    console.log('Updating asset reports view...');
    this.generateAssetUtilizationReport();
    this.generateMaintenanceCostReport();
    this.generateAssetPerformanceReport();
  }

  generateAssetUtilizationReport() {
    // Calculate asset utilization metrics
    const utilization = Array.from(this.assets.values()).map((asset) => ({
      name: asset.name,
      utilization: Math.random() * 100, // Simulated data
      efficiency: asset.efficiency,
      operatingHours: asset.operatingHours,
    }));

    console.log('Asset Utilization Report:', utilization);
  }

  generateMaintenanceCostReport() {
    // Calculate maintenance cost analysis
    const totalCost = Array.from(this.assets.values()).reduce(
      (sum, asset) => sum + asset.maintenanceCost,
      0
    );
    const avgCost = totalCost / this.assets.size;

    console.log('Maintenance Cost Analysis:', {
      totalAnnualCost: totalCost,
      averageCostPerAsset: avgCost,
      costByCategory: this.calculateCostByCategory(),
    });
  }

  calculateCostByCategory() {
    const costByCategory = {};
    Array.from(this.assets.values()).forEach((asset) => {
      if (!costByCategory[asset.category]) {
        costByCategory[asset.category] = 0;
      }
      costByCategory[asset.category] += asset.maintenanceCost;
    });
    return costByCategory;
  }

  generateAssetPerformanceReport() {
    // Generate performance metrics report
    const performanceMetrics = {
      averageEfficiency: this.calculateAverageEfficiency(),
      topPerformers: this.getTopPerformingAssets(5),
      underPerformers: this.getUnderPerformingAssets(5),
      conditionDistribution: this.getConditionDistribution(),
    };

    console.log('Asset Performance Report:', performanceMetrics);
  }

  calculateAverageEfficiency() {
    const assets = Array.from(this.assets.values());
    const totalEfficiency = assets.reduce((sum, asset) => sum + asset.efficiency, 0);
    return totalEfficiency / assets.length;
  }

  getTopPerformingAssets(count) {
    return Array.from(this.assets.values())
      .sort((a, b) => b.efficiency - a.efficiency)
      .slice(0, count)
      .map((asset) => ({ name: asset.name, efficiency: asset.efficiency }));
  }

  getUnderPerformingAssets(count) {
    return Array.from(this.assets.values())
      .sort((a, b) => a.efficiency - b.efficiency)
      .slice(0, count)
      .map((asset) => ({ name: asset.name, efficiency: asset.efficiency }));
  }

  getConditionDistribution() {
    const distribution = {};
    Array.from(this.assets.values()).forEach((asset) => {
      distribution[asset.condition] = (distribution[asset.condition] || 0) + 1;
    });
    return distribution;
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

    // Add to notification container
    const container = document.querySelector('.notification-container') || document.body;
    container.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);

    // Allow manual close
    notification.querySelector('.notification-close')?.addEventListener('click', () => {
      notification.remove();
    });
  }
}

// Initialize the Asset Management System when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.assetManagement = new TitanAssetManagementSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TitanAssetManagementSystem;
}
