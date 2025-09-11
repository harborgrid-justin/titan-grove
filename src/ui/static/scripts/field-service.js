/**
 * Field Service Management - Advanced Interactive Business Logic
 * Enterprise field operations with intelligent scheduling, mobile workforce management,
 * and real-time customer service optimization using dependency injection patterns
 */

class FieldServiceManagementEngine {
  constructor() {
    // Service dependencies (dependency injection pattern)
    this.fieldServiceService = null;
    this.messageQueue = null;
    this.cacheManager = null;
    this.logger = null;

    // Core business entities
    this.technicians = new Map();
    this.workOrders = new Map();
    this.customers = new Map();
    this.inventory = new Map();
    this.schedules = new Map();
    this.serviceAreas = new Map();

    // UI state management
    this.currentView = 'dashboard';
    this.selectedTechnician = null;
    this.selectedWorkOrder = null;
    this.fieldMap = null;
    this.realTimeTracking = true;

    // Scheduling and optimization
    this.optimizationEngine = null;
    this.scheduleConstraints = {
      maxTravelTime: 30, // minutes
      maxWorkingHours: 8, // hours per day
      skillMatching: true,
      customerPreferences: true,
    };

    // Charts and visualizations
    this.charts = new Map();

    this.initialize();
  }

  async initialize() {
    try {
      // Initialize service dependencies
      await this.initializeServices();

      // Setup UI interactions
      this.setupEventListeners();

      // Load initial business data
      await this.loadInitialData();

      // Initialize field operations map
      this.initializeFieldMap();

      // Start real-time monitoring
      this.startRealTimeMonitoring();

      // Initialize optimization engine
      this.initializeOptimizationEngine();

      console.log('✅ Field Service Management Engine initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Field Service Management:', error);
    }
  }

  // ==================== SERVICE INITIALIZATION (DEPENDENCY INJECTION) ====================

  async initializeServices() {
    // Logger service
    this.logger = {
      info: (msg, data) => console.log(`[FIELD INFO] ${msg}`, data),
      warn: (msg, data) => console.warn(`[FIELD WARN] ${msg}`, data),
      error: (msg, data) => console.error(`[FIELD ERROR] ${msg}`, data),
    };

    // Message queue service for enterprise integration
    this.messageQueue = {
      publish: async (queue, type, data, options = {}) => {
        this.logger.info('Publishing message', { queue, type, data });
        await this.handleMessage(type, data, options);
        return Promise.resolve();
      },
      subscribe: (queue, handler) => {
        this.logger.info('Subscribed to queue', { queue });
      },
    };

    // Cache manager for performance optimization
    this.cacheManager = new Map();

    // Field Service business service
    this.fieldServiceService = {
      createWorkOrder: async (orderData) => this.createWorkOrder(orderData),
      assignTechnician: async (orderId, technicianId) =>
        this.assignTechnician(orderId, technicianId),
      optimizeSchedule: async (criteria) => this.optimizeSchedule(criteria),
      updateWorkOrderStatus: async (orderId, status) => this.updateWorkOrderStatus(orderId, status),
      trackTechnicianLocation: async (technicianId, location) =>
        this.updateTechnicianLocation(technicianId, location),
      calculateServiceMetrics: async () => this.calculateServiceMetrics(),
      generateScheduleRecommendations: async (constraints) =>
        this.generateScheduleRecommendations(constraints),
    };
  }

  // ==================== EVENT HANDLING ====================

  setupEventListeners() {
    // Navigation events
    document.addEventListener('click', (e) => {
      if (e.target.matches('.field-nav-item')) {
        this.switchView(e.target.dataset.view);
      }
      if (e.target.matches('#createWorkOrder, #newWorkOrder')) {
        this.openCreateWorkOrderModal();
      }
      if (e.target.matches('#scheduleOptimization, #runScheduleOptimization')) {
        this.runScheduleOptimization();
      }
      if (e.target.matches('#quickDispatch')) {
        this.openQuickDispatchModal();
      }
      if (e.target.matches('#emergencyDispatch')) {
        this.handleEmergencyDispatch();
      }
      if (e.target.matches('#addTechnician')) {
        this.openAddTechnicianModal();
      }
      if (e.target.matches('#optimizeToday')) {
        this.optimizeTodaysSchedule();
      }
      if (e.target.matches('.work-order-item')) {
        this.showWorkOrderDetails(e.target.dataset.orderId);
      }
      if (e.target.matches('.technician-card')) {
        this.showTechnicianDetails(e.target.dataset.technicianId);
      }
      if (e.target.matches('.map-toggle')) {
        this.toggleMapLayer(e.target.dataset.layer);
      }
      if (e.target.matches('.assign-technician-btn')) {
        this.showTechnicianAssignment(e.target.dataset.orderId);
      }
      if (e.target.matches('.complete-work-order-btn')) {
        this.completeWorkOrder(e.target.dataset.orderId);
      }
    });

    // Form and filter events
    document.addEventListener('change', (e) => {
      if (e.target.matches('#priorityFilter')) {
        this.filterWorkOrdersByPriority(e.target.value);
      }
      if (e.target.matches('#statusFilter')) {
        this.filterWorkOrdersByStatus(e.target.value);
      }
      if (e.target.matches('#technicianFilter')) {
        this.filterScheduleByTechnician(e.target.value);
      }
      if (e.target.matches('#dateRange')) {
        this.updateDateRange(e.target.value);
      }
    });

    // Real-time search
    document.addEventListener('input', (e) => {
      if (e.target.matches('#fieldServiceGlobalSearch')) {
        this.handleGlobalSearch(e.target.value);
      }
      if (e.target.matches('#workOrderSearch')) {
        this.searchWorkOrders(e.target.value);
      }
    });

    // Mobile-responsive interactions
    document.addEventListener('touchstart', (e) => {
      if (e.target.matches('.technician-location-marker')) {
        this.showTechnicianLocationDetails(e.target.dataset.technicianId);
      }
    });
  }

  // ==================== BUSINESS LOGIC OPERATIONS ====================

  async createWorkOrder(orderData) {
    try {
      // Call backend API to create work order
      const response = await fetch('/api/field-service/work-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        const workOrder = result.data;

        // Store locally for quick access
        this.workOrders.set(workOrder.id, workOrder);

        // Cache for quick access
        this.cacheManager.set(`work-order:${workOrder.id}`, workOrder);

        // Publish message for enterprise integration
        await this.messageQueue.publish('FIELD_SERVICE', 'WORK_ORDER_CREATED', {
          workOrderId: workOrder.id,
          priority: workOrder.priority || 'MEDIUM',
          customerId: workOrder.customerId,
          serviceType: workOrder.serviceType,
          timestamp: new Date(),
        });

        // Auto-assign if smart assignment is enabled
        if (this.shouldAutoAssign(workOrder)) {
          await this.intelligentTechnicianAssignment(workOrder.id);
        }

        this.logger.info('Work order created', {
          workOrderId: workOrder.id,
          priority: workOrder.priority,
        });
        this.refreshWorkOrdersDisplay();

        return workOrder;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      this.logger.error('Failed to create work order', error);
      throw error;
    }
  }

  async assignTechnician(workOrderId, technicianId) {
    const workOrder = this.workOrders.get(workOrderId);
    const technician = this.technicians.get(technicianId);

    if (!workOrder || !technician) {
      throw new Error('Work order or technician not found');
    }

    // Check technician availability and skills
    const isAvailable = await this.checkTechnicianAvailability(
      technicianId,
      workOrder.scheduledDate
    );
    const hasSkills = this.validateTechnicianSkills(technician, workOrder.requiredSkills);

    if (!isAvailable) {
      throw new Error('Technician is not available at the requested time');
    }

    if (!hasSkills) {
      throw new Error('Technician does not have required skills');
    }

    // Update work order
    workOrder.assignedTechnicianId = technicianId;
    workOrder.status = 'ASSIGNED';
    workOrder.assignedDate = new Date();
    workOrder.updatedDate = new Date();

    // Update technician schedule
    await this.addToTechnicianSchedule(technicianId, workOrder);

    // Calculate optimized route if multiple assignments exist
    await this.optimizeTechnicianRoute(technicianId, workOrder.scheduledDate);

    // Send notifications
    await this.messageQueue.publish('NOTIFICATION', 'WORK_ORDER_ASSIGNED', {
      workOrderId,
      technicianId,
      technicianName: technician.name,
      customerAddress: workOrder.serviceAddress,
      scheduledDate: workOrder.scheduledDate,
    });

    this.logger.info('Work order assigned', {
      workOrderId,
      technicianId,
      technicianName: technician.name,
    });
    this.updateDashboardMetrics();

    return workOrder;
  }

  async optimizeSchedule(criteria) {
    this.logger.info('Starting schedule optimization', { criteria });

    try {
      // Call backend API for schedule optimization
      const response = await fetch('/api/field-service/optimize-schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ criteria }),
      });

      const result = await response.json();

      if (result.success) {
        const optimizedSchedule = result.data;

        // Update UI with optimization results
        this.displayOptimizationResults(optimizedSchedule);

        await this.messageQueue.publish('FIELD_SERVICE', 'SCHEDULE_OPTIMIZED', {
          optimizationScore: optimizedSchedule.efficiency,
          criteria,
          timestamp: new Date(),
        });

        return optimizedSchedule;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      this.logger.error('Schedule optimization failed', error);
      throw error;
    }
  }

  async runScheduleOptimization() {
    try {
      const criteria = {
        optimizeFor: 'TRAVEL_TIME',
        maxTravelTime: 30,
        prioritizeSkills: true,
      };
      await this.optimizeSchedule(criteria);
    } catch (error) {
      this.logger.error('Schedule optimization failed', error);
    }
  }

  async updateWorkOrderStatus(workOrderId, status) {
    const workOrder = this.workOrders.get(workOrderId);
    if (!workOrder) {
      throw new Error(`Work order ${workOrderId} not found`);
    }

    const oldStatus = workOrder.status;
    workOrder.status = status;
    workOrder.updatedDate = new Date();

    // Handle status-specific business logic
    switch (status) {
      case 'IN_PROGRESS':
        workOrder.startTime = new Date();
        break;
      case 'COMPLETED':
        workOrder.completionTime = new Date();
        workOrder.actualDuration = this.calculateActualDuration(workOrder);
        await this.processWorkOrderCompletion(workOrder);
        break;
      case 'CANCELLED':
        await this.handleWorkOrderCancellation(workOrder);
        break;
    }

    // Update cache
    this.cacheManager.set(`work-order:${workOrderId}`, workOrder);

    // Send status update notification
    await this.messageQueue.publish('NOTIFICATION', 'WORK_ORDER_STATUS_CHANGED', {
      workOrderId,
      oldStatus,
      newStatus: status,
      timestamp: new Date(),
    });

    this.logger.info('Work order status updated', { workOrderId, oldStatus, newStatus: status });
    this.refreshWorkOrdersDisplay();

    return workOrder;
  }

  // ==================== INTELLIGENT SCHEDULING ====================

  async calculateOptimalSchedule(workOrders, technicians, criteria) {
    const assignments = [];
    let totalTravelTime = 0;
    let totalCost = 0;

    // Sort work orders by priority and urgency
    const prioritizedOrders = workOrders.sort((a, b) => {
      const priorityWeight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      const urgencyScore = this.calculateUrgencyScore(a) - this.calculateUrgencyScore(b);
      return priorityWeight[b.priority] - priorityWeight[a.priority] || urgencyScore;
    });

    for (const workOrder of prioritizedOrders) {
      const optimalTechnician = await this.findOptimalTechnician(
        workOrder,
        technicians,
        criteria,
        assignments
      );

      if (optimalTechnician) {
        const assignment = {
          workOrderId: workOrder.workOrderId,
          technicianId: optimalTechnician.technicianId,
          estimatedTravelTime: this.calculateTravelTime(
            optimalTechnician.currentLocation,
            workOrder.serviceAddress
          ),
          estimatedStartTime: this.calculateOptimalStartTime(optimalTechnician, workOrder),
          optimizationReason: this.generateOptimizationReason(
            optimalTechnician,
            workOrder,
            criteria
          ),
        };

        assignments.push(assignment);
        totalTravelTime += assignment.estimatedTravelTime;
        totalCost += this.calculateAssignmentCost(optimalTechnician, workOrder);

        // Mark technician as temporarily assigned for subsequent calculations
        optimalTechnician.tempAssigned = true;
      }
    }

    // Reset temporary assignments
    technicians.forEach((tech) => delete tech.tempAssigned);

    const optimizationScore = this.calculateOptimizationScore(
      assignments,
      totalTravelTime,
      totalCost
    );

    return {
      assignments,
      metrics: {
        totalTravelTime,
        totalCost,
        averageResponseTime: this.calculateAverageResponseTime(assignments),
        utilizationRate: this.calculateUtilizationRate(assignments, technicians),
      },
      score: optimizationScore,
    };
  }

  async findOptimalTechnician(workOrder, availableTechnicians, criteria, existingAssignments) {
    const eligibleTechnicians = availableTechnicians.filter(
      (tech) =>
        !tech.tempAssigned &&
        this.validateTechnicianSkills(tech, workOrder.requiredSkills) &&
        this.checkTechnicianAvailability(tech.technicianId, workOrder.scheduledDate) &&
        this.isWithinServiceArea(tech, workOrder.serviceAddress)
    );

    if (eligibleTechnicians.length === 0) return null;

    // Apply optimization criteria
    switch (criteria.priority) {
      case 'RESPONSE_TIME':
        return this.optimizeForResponseTime(workOrder, eligibleTechnicians);
      case 'COST':
        return this.optimizeForCost(workOrder, eligibleTechnicians);
      case 'QUALITY':
        return this.optimizeForQuality(workOrder, eligibleTechnicians);
      case 'BALANCED':
      default:
        return this.optimizeBalanced(workOrder, eligibleTechnicians);
    }
  }

  // ==================== REAL-TIME MONITORING ====================

  startRealTimeMonitoring() {
    if (!this.realTimeTracking) return;

    // Update technician locations every 30 seconds
    setInterval(() => {
      this.updateTechnicianLocations();
    }, 30000);

    // Update work order statuses every 45 seconds
    setInterval(() => {
      this.refreshWorkOrderStatuses();
    }, 45000);

    // Update performance metrics every 60 seconds
    setInterval(() => {
      this.updatePerformanceMetrics();
    }, 60000);

    // Update field map markers every 15 seconds
    setInterval(() => {
      this.updateFieldMapMarkers();
    }, 15000);
  }

  async updateTechnicianLocations() {
    // Simulate real-time GPS tracking
    for (const [technicianId, technician] of this.technicians) {
      if (technician.status === 'ACTIVE' && technician.currentLocation) {
        // Simulate location updates (in real implementation, this would come from GPS)
        const locationUpdate = this.simulateLocationUpdate(technician.currentLocation);

        technician.currentLocation = locationUpdate;
        technician.lastLocationUpdate = new Date();

        // Update cache
        this.cacheManager.set(`technician-location:${technicianId}`, locationUpdate);

        // Publish location update
        await this.messageQueue.publish('LOCATION_TRACKING', 'TECHNICIAN_LOCATION_UPDATE', {
          technicianId,
          location: locationUpdate,
          timestamp: new Date(),
        });
      }
    }

    // Update map if visible
    if (this.fieldMap && this.currentView === 'dashboard') {
      this.updateFieldMapMarkers();
    }
  }

  updatePerformanceMetrics() {
    const metrics = this.calculateServiceMetrics();

    // Update UI elements
    document.getElementById('avgResponseTime').textContent = metrics.averageResponseTime.toFixed(1);
    document.getElementById('firstTimeFix').textContent = `${metrics.firstTimeFixRate.toFixed(1)}%`;
    document.getElementById('techUtilization').textContent =
      `${metrics.technicianUtilization.toFixed(1)}%`;
    document.getElementById('customerSat').textContent = metrics.customerSatisfaction.toFixed(1);

    // Update header metrics
    document.getElementById('activeTechniciansCount').textContent = metrics.activeTechnicians;
    document.getElementById('pendingOrdersCount').textContent = metrics.pendingOrders;
    document.getElementById('slaCompliance').textContent = `${metrics.slaCompliance}%`;
  }

  // ==================== MAP FUNCTIONALITY ====================

  initializeFieldMap() {
    const mapContainer = document.getElementById('fieldOperationsMap');
    if (!mapContainer) return;

    // Initialize Leaflet map
    this.fieldMap = L.map('fieldOperationsMap').setView([40.7128, -74.006], 11);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.fieldMap);

    // Initialize map layers
    this.initializeMapLayers();

    // Add markers
    this.updateFieldMapMarkers();
  }

  initializeMapLayers() {
    // Create layer groups for different data types
    this.mapLayers = {
      technicians: L.layerGroup().addTo(this.fieldMap),
      workOrders: L.layerGroup(),
      customers: L.layerGroup(),
      serviceAreas: L.layerGroup(),
    };
  }

  updateFieldMapMarkers() {
    if (!this.fieldMap) return;

    // Clear existing markers
    Object.values(this.mapLayers).forEach((layer) => layer.clearLayers());

    // Add technician markers
    this.technicians.forEach((technician) => {
      if (technician.currentLocation) {
        const marker = L.marker([
          technician.currentLocation.lat,
          technician.currentLocation.lng,
        ]).bindPopup(this.createTechnicianPopupContent(technician));

        const iconColor = this.getTechnicianStatusColor(technician.status);
        marker.setIcon(this.createTechnicianIcon(iconColor, technician.name));

        this.mapLayers.technicians.addLayer(marker);
      }
    });

    // Add work order markers
    this.workOrders.forEach((workOrder) => {
      if (workOrder.serviceAddress && workOrder.serviceAddress.coordinates) {
        const coords = workOrder.serviceAddress.coordinates;
        const marker = L.marker([coords.lat, coords.lng]).bindPopup(
          this.createWorkOrderPopupContent(workOrder)
        );

        const iconColor = this.getWorkOrderPriorityColor(workOrder.priority);
        marker.setIcon(this.createWorkOrderIcon(iconColor, workOrder.priority));

        this.mapLayers.workOrders.addLayer(marker);
      }
    });
  }

  toggleMapLayer(layerName) {
    document.querySelectorAll('.map-toggle').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.layer === layerName);
    });

    // Remove all layers
    Object.values(this.mapLayers).forEach((layer) => {
      this.fieldMap.removeLayer(layer);
    });

    // Add selected layer
    if (this.mapLayers[layerName]) {
      this.fieldMap.addLayer(this.mapLayers[layerName]);
    }
  }

  // ==================== UI UPDATES ====================

  switchView(viewName) {
    // Update navigation
    document.querySelectorAll('.field-nav-item').forEach((item) => {
      item.classList.toggle('active', item.dataset.view === viewName);
    });

    // Update content sections
    document.querySelectorAll('.content-section').forEach((section) => {
      section.classList.toggle('active', section.id === this.getViewSectionId(viewName));
    });

    this.currentView = viewName;

    // Load view-specific data
    this.loadViewData(viewName);
  }

  refreshWorkOrdersDisplay() {
    const workOrdersContainer = document.getElementById('workOrdersQueue');
    if (!workOrdersContainer) return;

    const pendingOrders = Array.from(this.workOrders.values())
      .filter((order) => order.status === 'PENDING' || order.status === 'ASSIGNED')
      .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
      .slice(0, 10);

    workOrdersContainer.innerHTML = pendingOrders
      .map(
        (order) => `
            <div class="work-order-item" data-order-id="${order.workOrderId}">
                <div class="work-order-header">
                    <span class="work-order-id">#${order.workOrderId}</span>
                    <span class="priority-badge ${order.priority.toLowerCase()}">${order.priority}</span>
                </div>
                <div class="work-order-description">${order.description}</div>
                <div class="work-order-meta">
                    <span class="customer">Customer: ${this.getCustomerName(order.customerId)}</span>
                    <span class="created-date">${this.formatDate(order.createdDate)}</span>
                </div>
                <div class="work-order-actions">
                    ${
                      !order.assignedTechnicianId
                        ? `<button class="assign-technician-btn" data-order-id="${order.workOrderId}">
                            <i class="fas fa-user-plus"></i> Assign
                        </button>`
                        : `<span class="assigned-tech">Assigned to: ${this.getTechnicianName(order.assignedTechnicianId)}</span>`
                    }
                </div>
            </div>
        `
      )
      .join('');
  }

  displayScheduleTimeline() {
    const scheduleContainer = document.getElementById('scheduleTimeline');
    if (!scheduleContainer) return;

    const today = new Date();
    const todaysSchedule = Array.from(this.workOrders.values())
      .filter((order) => {
        return (
          order.scheduledDate &&
          this.isSameDay(new Date(order.scheduledDate), today) &&
          order.status !== 'CANCELLED'
        );
      })
      .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

    scheduleContainer.innerHTML = todaysSchedule
      .map(
        (order) => `
            <div class="schedule-item ${order.status.toLowerCase()}">
                <div class="schedule-time">${this.formatTime(order.scheduledDate)}</div>
                <div class="schedule-content">
                    <div class="schedule-header">
                        <span class="work-order-id">#${order.workOrderId}</span>
                        <span class="priority-indicator ${order.priority.toLowerCase()}"></span>
                    </div>
                    <div class="schedule-description">${order.description}</div>
                    <div class="schedule-technician">
                        ${
                          order.assignedTechnicianId
                            ? `<i class="fas fa-user"></i> ${this.getTechnicianName(order.assignedTechnicianId)}`
                            : '<i class="fas fa-user-slash"></i> Unassigned'
                        }
                    </div>
                </div>
                <div class="schedule-actions">
                    ${
                      order.status === 'ASSIGNED'
                        ? `<button class="start-work-btn" data-order-id="${order.workOrderId}">Start</button>`
                        : order.status === 'IN_PROGRESS'
                          ? `<button class="complete-work-order-btn" data-order-id="${order.workOrderId}">Complete</button>`
                          : ''
                    }
                </div>
            </div>
        `
      )
      .join('');
  }

  // ==================== BUSINESS CALCULATIONS ====================

  calculateServiceMetrics() {
    const allOrders = Array.from(this.workOrders.values());
    const activeTechnicians = Array.from(this.technicians.values()).filter(
      (t) => t.status === 'ACTIVE'
    );
    const completedOrders = allOrders.filter((o) => o.status === 'COMPLETED');
    const pendingOrders = allOrders.filter((o) => o.status === 'PENDING');

    const averageResponseTime =
      completedOrders.length > 0
        ? completedOrders.reduce((sum, order) => {
            const responseTime = this.calculateResponseTime(order);
            return sum + responseTime;
          }, 0) / completedOrders.length
        : 0;

    const firstTimeFixOrders = completedOrders.filter(
      (order) => !order.reworkRequired && order.customerSatisfactionRating >= 4
    );
    const firstTimeFixRate =
      completedOrders.length > 0 ? (firstTimeFixOrders.length / completedOrders.length) * 100 : 0;

    const technicianUtilization =
      activeTechnicians.length > 0
        ? activeTechnicians.reduce((sum, tech) => sum + (tech.utilizationRate || 0), 0) /
          activeTechnicians.length
        : 0;

    const customerSatisfaction =
      completedOrders.length > 0
        ? completedOrders.reduce(
            (sum, order) => sum + (order.customerSatisfactionRating || 4.5),
            0
          ) / completedOrders.length
        : 4.5;

    const slaCompliantOrders = completedOrders.filter((order) => {
      const slaTime = this.getSLATimeForPriority(order.priority);
      const actualTime = this.calculateActualResponseTime(order);
      return actualTime <= slaTime;
    });
    const slaCompliance =
      completedOrders.length > 0
        ? Math.round((slaCompliantOrders.length / completedOrders.length) * 100)
        : 100;

    return {
      averageResponseTime,
      firstTimeFixRate,
      technicianUtilization,
      customerSatisfaction,
      activeTechnicians: activeTechnicians.length,
      pendingOrders: pendingOrders.length,
      slaCompliance,
    };
  }

  // ==================== DATA MANAGEMENT ====================

  async loadInitialData() {
    try {
      // Load data from APIs
      await this.loadTechniciansFromAPI();
      await this.loadWorkOrdersFromAPI();

      // Load sample customers (keeping local for now)
      this.loadSampleCustomers();

      // Update initial displays
      this.updatePerformanceMetrics();
      this.refreshWorkOrdersDisplay();
      this.displayScheduleTimeline();
    } catch (error) {
      this.logger.error('Failed to load initial data', error);
      // Fallback to sample data
      this.loadSampleTechnicians();
      this.loadSampleWorkOrders();
      this.loadSampleCustomers();
      this.updatePerformanceMetrics();
      this.refreshWorkOrdersDisplay();
      this.displayScheduleTimeline();
    }
  }

  async loadTechniciansFromAPI() {
    try {
      const response = await fetch('/api/field-service/technicians');
      const result = await response.json();

      if (result.success) {
        result.data.forEach((technician) => {
          this.technicians.set(technician.id, technician);
        });
        this.logger.info('Loaded technicians from API', { count: result.data.length });
      }
    } catch (error) {
      this.logger.error('Failed to load technicians from API', error);
      throw error;
    }
  }

  async loadWorkOrdersFromAPI() {
    try {
      const response = await fetch('/api/field-service/work-orders');
      const result = await response.json();

      if (result.success) {
        result.data.forEach((workOrder) => {
          this.workOrders.set(workOrder.id, workOrder);
        });
        this.logger.info('Loaded work orders from API', { count: result.data.length });
      }
    } catch (error) {
      this.logger.error('Failed to load work orders from API', error);
      throw error;
    }
  }

  loadSampleTechnicians() {
    const sampleTechnicians = [
      {
        technicianId: 'TECH001',
        name: 'John Smith',
        email: 'john.smith@company.com',
        phone: '+1-555-0101',
        status: 'ACTIVE',
        skills: ['electrical', 'plumbing', 'hvac'],
        certifications: ['EPA Universal', 'Electrical License'],
        currentLocation: { lat: 40.7589, lng: -73.9851 },
        homeLocation: { lat: 40.7505, lng: -73.9934 },
        serviceArea: 'Manhattan',
        utilizationRate: 78.5,
        customerRating: 4.8,
        completionRate: 94.2,
        hourlyRate: 85,
        availability: {
          monday: { start: '08:00', end: '17:00' },
          tuesday: { start: '08:00', end: '17:00' },
          wednesday: { start: '08:00', end: '17:00' },
          thursday: { start: '08:00', end: '17:00' },
          friday: { start: '08:00', end: '17:00' },
        },
      },
      {
        technicianId: 'TECH002',
        name: 'Maria Garcia',
        email: 'maria.garcia@company.com',
        phone: '+1-555-0102',
        status: 'ACTIVE',
        skills: ['mechanical', 'electrical', 'refrigeration'],
        certifications: ['HVAC License', 'Refrigeration Cert'],
        currentLocation: { lat: 40.7614, lng: -73.9776 },
        homeLocation: { lat: 40.7488, lng: -73.9857 },
        serviceArea: 'Manhattan',
        utilizationRate: 82.1,
        customerRating: 4.6,
        completionRate: 91.8,
        hourlyRate: 78,
        availability: {
          monday: { start: '07:00', end: '16:00' },
          tuesday: { start: '07:00', end: '16:00' },
          wednesday: { start: '07:00', end: '16:00' },
          thursday: { start: '07:00', end: '16:00' },
          friday: { start: '07:00', end: '16:00' },
        },
      },
    ];

    sampleTechnicians.forEach((technician) => {
      this.technicians.set(technician.technicianId, technician);
    });
  }

  loadSampleWorkOrders() {
    const sampleOrders = [
      {
        workOrderId: 'WO001',
        priority: 'HIGH',
        status: 'PENDING',
        description: 'Air conditioning unit not cooling properly',
        customerId: 'CUST001',
        serviceAddress: {
          street: '123 Business Ave',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          coordinates: { lat: 40.7505, lng: -73.9934 },
        },
        requiredSkills: ['hvac', 'electrical'],
        estimatedDuration: 120,
        scheduledDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        serviceType: 'HVAC Repair',
        equipment: 'Commercial AC Unit - Model XYZ',
        customerNotes: 'Unit has been making strange noises',
        internalNotes: 'Check refrigerant levels and compressor',
        createdDate: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        updatedDate: new Date(Date.now() - 30 * 60 * 1000),
      },
      {
        workOrderId: 'WO002',
        priority: 'MEDIUM',
        status: 'ASSIGNED',
        description: 'Electrical outlet not working in conference room',
        customerId: 'CUST002',
        serviceAddress: {
          street: '456 Corporate Blvd',
          city: 'New York',
          state: 'NY',
          zipCode: '10002',
          coordinates: { lat: 40.7614, lng: -73.9776 },
        },
        requiredSkills: ['electrical'],
        estimatedDuration: 90,
        scheduledDate: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
        assignedTechnicianId: 'TECH001',
        serviceType: 'Electrical Repair',
        equipment: 'Wall outlet',
        customerNotes: 'Located in main conference room',
        createdDate: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        updatedDate: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      },
    ];

    sampleOrders.forEach((order) => {
      this.workOrders.set(order.workOrderId, order);
    });
  }

  loadSampleCustomers() {
    const sampleCustomers = [
      {
        customerId: 'CUST001',
        name: 'Acme Corporation',
        type: 'Commercial',
        contact: {
          name: 'Jane Doe',
          email: 'jane.doe@acme.com',
          phone: '+1-555-0201',
        },
        serviceLevel: 'Premium',
        preferredTechnician: null,
        serviceHistory: [],
      },
      {
        customerId: 'CUST002',
        name: 'Tech Innovations LLC',
        type: 'Commercial',
        contact: {
          name: 'Bob Johnson',
          email: 'bob.johnson@techinnovations.com',
          phone: '+1-555-0202',
        },
        serviceLevel: 'Standard',
        preferredTechnician: 'TECH001',
        serviceHistory: [],
      },
    ];

    sampleCustomers.forEach((customer) => {
      this.customers.set(customer.customerId, customer);
    });
  }

  // ==================== UTILITY METHODS ====================

  getCustomerName(customerId) {
    const customer = this.customers.get(customerId);
    return customer ? customer.name : 'Unknown Customer';
  }

  getTechnicianName(technicianId) {
    const technician = this.technicians.get(technicianId);
    return technician ? technician.name : 'Unknown Technician';
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString();
  }

  formatTime(date) {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  isSameDay(date1, date2) {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  getTechnicianStatusColor(status) {
    const colors = {
      ACTIVE: '#28a745',
      BUSY: '#ffc107',
      OFFLINE: '#dc3545',
      BREAK: '#6c757d',
    };
    return colors[status] || '#6c757d';
  }

  getWorkOrderPriorityColor(priority) {
    const colors = {
      CRITICAL: '#dc3545',
      HIGH: '#fd7e14',
      MEDIUM: '#ffc107',
      LOW: '#28a745',
    };
    return colors[priority] || '#6c757d';
  }

  createTechnicianIcon(color, name) {
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; position: relative;">
                      <div style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px; white-space: nowrap;">${name}</div>
                   </div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  }

  createWorkOrderIcon(color, priority) {
    const icon = priority === 'CRITICAL' ? 'fa-exclamation-triangle' : 'fa-wrench';
    return L.divIcon({
      html: `<div style="color: ${color}; font-size: 16px;"><i class="fas ${icon}"></i></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  }

  async handleMessage(type, data, options) {
    switch (type) {
      case 'WORK_ORDER_CREATED':
        this.logger.info('Work order created message processed', data);
        break;
      case 'WORK_ORDER_ASSIGNED':
        this.logger.info('Work order assigned message processed', data);
        break;
      case 'SCHEDULE_OPTIMIZED':
        this.logger.info('Schedule optimization message processed', data);
        break;
      default:
        this.logger.info('Message processed', { type, data });
    }
  }

  getViewSectionId(viewName) {
    const viewMap = {
      dashboard: 'field-dashboard',
      'work-orders': 'work-orders-management',
      technicians: 'technician-management',
      scheduling: 'scheduling-dispatch',
      inventory: 'inventory-management',
      customers: 'customer-management',
      reports: 'reports-analytics',
    };
    return viewMap[viewName] || 'field-dashboard';
  }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new FieldServiceManagementEngine();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FieldServiceManagementEngine;
}
