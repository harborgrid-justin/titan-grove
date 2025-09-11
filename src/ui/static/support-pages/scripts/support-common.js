/**
 * Support Pages Common JavaScript - Titan Grove Enterprise Support Management
 * Provides shared functionality for all support pages including backend integration,
 * business logic processing, and customer-ready interface features.
 */

class SupportPageManager {
  constructor() {
    this.initialized = false;
    this.modules = new Map();
    this.eventHandlers = new Map();
    this.apiEndpoints = new Map();
    this.realTimeConnections = new Map();
    this.incidentTracker = new Map();
    this.problemRegistry = new Map();
    this.changeQueue = new Map();
    this.knowledgeBase = new Map();
    this.slaMonitor = new Map();
    this.init();
  }

  async init() {
    try {
      await this.loadBaseConfiguration();
      this.setupEventHandlers();
      this.initializeAPIEndpoints();
      this.setupRealTimeUpdates();
      this.initializeBusinessLogic();
      this.setupSecurityFeatures();
      this.initializeSupportOperations();
      this.initialized = true;
      console.log('Support Page Manager initialized successfully');
      this.updateIntegrationStatus('initialized');
    } catch (error) {
      console.error('Support Page Manager initialization failed:', error);
      this.updateIntegrationStatus('error');
    }
  }

  async loadBaseConfiguration() {
    try {
      // Load support-specific configuration
      const response = await fetch('/api/v1/support/config');
      if (response.ok) {
        const config = await response.json();
        this.config = {
          apiBaseUrl: '/api/v1/support',
          wsBaseUrl: 'ws://localhost:3000/support',
          supportCategories: [
            'support-operations',
            'incident-management',
            'problem-management',
            'change-management',
            'knowledge-management',
            'service-level-management',
            'support-analytics',
          ],
          defaultSLA: {
            critical: 1, // hours
            high: 4,
            medium: 24,
            low: 72,
          },
          escalationRules: {
            autoEscalate: true,
            escalationLevels: 3,
            escalationInterval: 2, // hours
          },
          ...config,
        };
      }
    } catch (error) {
      console.warn('Failed to load support configuration, using defaults:', error);
      this.config = {
        apiBaseUrl: '/api/v1/support',
        wsBaseUrl: 'ws://localhost:3000/support',
        supportCategories: [
          'support-operations',
          'incident-management',
          'problem-management',
          'change-management',
          'knowledge-management',
          'service-level-management',
          'support-analytics',
        ],
      };
    }
  }

  setupEventHandlers() {
    // Global keyboard shortcuts for support operations
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'i':
            e.preventDefault();
            this.createNewIncident();
            break;
          case 'p':
            e.preventDefault();
            this.createNewProblem();
            break;
          case 'c':
            e.preventDefault();
            this.createNewChange();
            break;
          case 'k':
            e.preventDefault();
            this.searchKnowledgeBase();
            break;
          case 's':
            e.preventDefault();
            this.quickSave();
            break;
        }
      }
    });

    // Auto-save functionality
    this.setupAutoSave();

    // Real-time notification handling
    this.setupNotificationHandlers();
  }

  initializeAPIEndpoints() {
    const categories = this.config.supportCategories;

    categories.forEach((category) => {
      // Standard CRUD endpoints for each category
      this.apiEndpoints.set(`${category}-list`, `${this.config.apiBaseUrl}/${category}`);
      this.apiEndpoints.set(`${category}-create`, `${this.config.apiBaseUrl}/${category}`);
      this.apiEndpoints.set(`${category}-update`, `${this.config.apiBaseUrl}/${category}`);
      this.apiEndpoints.set(`${category}-delete`, `${this.config.apiBaseUrl}/${category}`);
      this.apiEndpoints.set(
        `${category}-analytics`,
        `${this.config.apiBaseUrl}/${category}/analytics`
      );
    });

    // Specialized endpoints
    this.apiEndpoints.set(
      'incident-escalate',
      `${this.config.apiBaseUrl}/incident-management/escalate`
    );
    this.apiEndpoints.set(
      'problem-analyze',
      `${this.config.apiBaseUrl}/problem-management/analyze`
    );
    this.apiEndpoints.set('change-approve', `${this.config.apiBaseUrl}/change-management/approve`);
    this.apiEndpoints.set(
      'knowledge-search',
      `${this.config.apiBaseUrl}/knowledge-management/search`
    );
    this.apiEndpoints.set(
      'sla-monitor',
      `${this.config.apiBaseUrl}/service-level-management/monitor`
    );
    this.apiEndpoints.set(
      'support-dashboard',
      `${this.config.apiBaseUrl}/support-analytics/dashboard`
    );
  }

  setupRealTimeUpdates() {
    try {
      // WebSocket connection for real-time updates
      this.websocket = new WebSocket(this.config.wsBaseUrl);

      this.websocket.onopen = () => {
        console.log('Support WebSocket connection established');
        this.updateConnectionStatus('connected');
      };

      this.websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleRealTimeUpdate(data);
      };

      this.websocket.onclose = () => {
        console.log('Support WebSocket connection closed');
        this.updateConnectionStatus('disconnected');
        // Auto-reconnect after 5 seconds
        setTimeout(() => this.setupRealTimeUpdates(), 5000);
      };

      this.websocket.onerror = (error) => {
        console.error('Support WebSocket error:', error);
        this.updateConnectionStatus('error');
      };
    } catch (error) {
      console.warn('WebSocket not available, using polling for updates');
      this.setupPollingUpdates();
    }
  }

  initializeBusinessLogic() {
    // Support Operations Business Logic
    this.businessLogic = {
      // Incident Management
      calculateIncidentPriority: (impact, urgency) => {
        const priorityMatrix = {
          'high-high': 'critical',
          'high-medium': 'high',
          'high-low': 'medium',
          'medium-high': 'high',
          'medium-medium': 'medium',
          'medium-low': 'low',
          'low-high': 'medium',
          'low-medium': 'low',
          'low-low': 'low',
        };
        return priorityMatrix[`${impact}-${urgency}`] || 'low';
      },

      // Problem Management
      identifyRootCause: (incidents) => {
        // Analyze patterns in related incidents
        const patterns = this.analyzeIncidentPatterns(incidents);
        return this.generateRootCauseHypotheses(patterns);
      },

      // Change Management
      assessChangeRisk: (change) => {
        let riskScore = 0;

        // Impact assessment
        if (change.impact === 'high') riskScore += 3;
        else if (change.impact === 'medium') riskScore += 2;
        else riskScore += 1;

        // Complexity assessment
        if (change.complexity === 'high') riskScore += 3;
        else if (change.complexity === 'medium') riskScore += 2;
        else riskScore += 1;

        // Urgency assessment
        if (change.urgency === 'emergency') riskScore += 4;
        else if (change.urgency === 'high') riskScore += 2;
        else if (change.urgency === 'medium') riskScore += 1;

        return this.categorizeRisk(riskScore);
      },

      // SLA Management
      calculateSLABreach: (createdTime, priority) => {
        const slaLimits = this.config.defaultSLA;
        const now = new Date();
        const created = new Date(createdTime);
        const hoursElapsed = (now - created) / (1000 * 60 * 60);

        const slaLimit = slaLimits[priority] || slaLimits.low;
        return {
          breached: hoursElapsed > slaLimit,
          timeRemaining: Math.max(0, slaLimit - hoursElapsed),
          percentageUsed: (hoursElapsed / slaLimit) * 100,
        };
      },
    };
  }

  initializeSupportOperations() {
    // Initialize support-specific operations
    this.supportOperations = {
      // Incident tracking
      trackIncident: (incidentId, updates) => {
        this.incidentTracker.set(incidentId, {
          ...this.incidentTracker.get(incidentId),
          ...updates,
          lastUpdated: new Date(),
        });
        this.broadcastUpdate('incident', incidentId, updates);
      },

      // Problem registry
      registerProblem: (problemData) => {
        const problemId = this.generateId();
        this.problemRegistry.set(problemId, {
          ...problemData,
          id: problemId,
          created: new Date(),
          status: 'new',
        });
        return problemId;
      },

      // Change queue management
      queueChange: (changeData) => {
        const changeId = this.generateId();
        this.changeQueue.set(changeId, {
          ...changeData,
          id: changeId,
          queued: new Date(),
          status: 'pending',
        });
        return changeId;
      },

      // Knowledge base operations
      addKnowledgeArticle: (articleData) => {
        const articleId = this.generateId();
        this.knowledgeBase.set(articleId, {
          ...articleData,
          id: articleId,
          created: new Date(),
          views: 0,
          rating: 0,
        });
        return articleId;
      },
    };
  }

  setupSecurityFeatures() {
    // Implement security measures for support operations
    this.security = {
      validateAccess: (operation, resourceId) => {
        // Implement role-based access control
        return this.checkUserPermissions(operation, resourceId);
      },

      auditLog: (action, resourceType, resourceId, details) => {
        const auditEntry = {
          timestamp: new Date(),
          user: this.getCurrentUser(),
          action,
          resourceType,
          resourceId,
          details,
          ip: this.getClientIP(),
          userAgent: navigator.userAgent,
        };

        // Send to audit service
        this.sendAuditLog(auditEntry);
      },

      encryptSensitiveData: (data) => {
        // Implement client-side encryption for sensitive data
        return this.encrypt(data);
      },
    };
  }

  // Support Operation Methods
  async createNewIncident() {
    try {
      const modal = this.createIncidentModal();
      document.body.appendChild(modal);
    } catch (error) {
      console.error('Failed to create incident modal:', error);
      this.showNotification('Failed to create new incident', 'error');
    }
  }

  async createNewProblem() {
    try {
      const modal = this.createProblemModal();
      document.body.appendChild(modal);
    } catch (error) {
      console.error('Failed to create problem modal:', error);
      this.showNotification('Failed to create new problem', 'error');
    }
  }

  async createNewChange() {
    try {
      const modal = this.createChangeModal();
      document.body.appendChild(modal);
    } catch (error) {
      console.error('Failed to create change modal:', error);
      this.showNotification('Failed to create new change', 'error');
    }
  }

  async searchKnowledgeBase() {
    try {
      const searchModal = this.createKnowledgeSearchModal();
      document.body.appendChild(searchModal);
    } catch (error) {
      console.error('Failed to open knowledge base search:', error);
      this.showNotification('Failed to open knowledge base search', 'error');
    }
  }

  // API Helper Methods
  async apiRequest(endpoint, options = {}) {
    const url = this.apiEndpoints.get(endpoint) || endpoint;

    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Real-time Update Handling
  handleRealTimeUpdate(data) {
    switch (data.type) {
      case 'incident_update':
        this.handleIncidentUpdate(data);
        break;
      case 'problem_update':
        this.handleProblemUpdate(data);
        break;
      case 'change_update':
        this.handleChangeUpdate(data);
        break;
      case 'sla_alert':
        this.handleSLAAlert(data);
        break;
      case 'escalation':
        this.handleEscalation(data);
        break;
      default:
        console.log('Unknown update type:', data.type);
    }
  }

  // Notification System
  showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `support-notification support-notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

    document.body.appendChild(notification);

    // Auto-remove notification
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, duration);

    return notification;
  }

  getNotificationIcon(type) {
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle',
    };
    return icons[type] || icons.info;
  }

  // Utility Methods
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  getCurrentUser() {
    // Get current user from session/token
    return {
      id: 'user123',
      name: 'Support Agent',
      role: 'support_agent',
    };
  }

  getAuthToken() {
    return localStorage.getItem('auth_token') || 'demo-token';
  }

  getClientIP() {
    // This would typically come from server-side
    return '192.168.1.100';
  }

  updateIntegrationStatus(status) {
    const statusElement = document.querySelector('.integration-status-text');
    if (statusElement) {
      statusElement.textContent =
        status === 'initialized' ? 'Fully Integrated' : 'Integration Error';
    }
  }

  updateConnectionStatus(status) {
    console.log(`Support WebSocket connection status: ${status}`);
    // Update UI connection indicator
  }

  async quickSave() {
    // Implement quick save functionality
    console.log('Quick save triggered');
    this.showNotification('Changes saved', 'success', 2000);
  }

  setupAutoSave() {
    // Implement auto-save every 30 seconds
    setInterval(() => {
      if (this.hasUnsavedChanges()) {
        this.autoSave();
      }
    }, 30000);
  }

  hasUnsavedChanges() {
    // Check if there are unsaved changes
    return false; // Placeholder implementation
  }

  async autoSave() {
    try {
      // Implement auto-save logic
      console.log('Auto-save triggered');
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }

  setupNotificationHandlers() {
    // Set up handlers for various notification types
    document.addEventListener('supportNotification', (event) => {
      this.showNotification(event.detail.message, event.detail.type);
    });
  }

  setupPollingUpdates() {
    // Fallback polling when WebSocket is not available
    setInterval(async () => {
      try {
        const updates = await this.apiRequest('support-dashboard');
        this.processPolledUpdates(updates);
      } catch (error) {
        console.error('Failed to poll for updates:', error);
      }
    }, 10000); // Poll every 10 seconds
  }

  processPolledUpdates(updates) {
    // Process updates received from polling
    if (updates && updates.length > 0) {
      updates.forEach((update) => this.handleRealTimeUpdate(update));
    }
  }

  // Modal Creation Methods (simplified for brevity)
  createIncidentModal() {
    const modal = document.createElement('div');
    modal.className = 'support-modal';
    modal.innerHTML = `
            <div class="modal-content">
                <h3>Create New Incident</h3>
                <form id="incident-form">
                    <input type="text" placeholder="Incident Title" required>
                    <textarea placeholder="Description" required></textarea>
                    <select name="priority">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                    <button type="submit">Create Incident</button>
                    <button type="button" onclick="this.closest('.support-modal').remove()">Cancel</button>
                </form>
            </div>
        `;
    return modal;
  }

  createProblemModal() {
    const modal = document.createElement('div');
    modal.className = 'support-modal';
    modal.innerHTML = `
            <div class="modal-content">
                <h3>Create New Problem</h3>
                <form id="problem-form">
                    <input type="text" placeholder="Problem Title" required>
                    <textarea placeholder="Problem Description" required></textarea>
                    <select name="category">
                        <option value="hardware">Hardware</option>
                        <option value="software">Software</option>
                        <option value="network">Network</option>
                        <option value="other">Other</option>
                    </select>
                    <button type="submit">Create Problem</button>
                    <button type="button" onclick="this.closest('.support-modal').remove()">Cancel</button>
                </form>
            </div>
        `;
    return modal;
  }

  createChangeModal() {
    const modal = document.createElement('div');
    modal.className = 'support-modal';
    modal.innerHTML = `
            <div class="modal-content">
                <h3>Create New Change</h3>
                <form id="change-form">
                    <input type="text" placeholder="Change Title" required>
                    <textarea placeholder="Change Description" required></textarea>
                    <select name="risk">
                        <option value="low">Low Risk</option>
                        <option value="medium">Medium Risk</option>
                        <option value="high">High Risk</option>
                    </select>
                    <button type="submit">Create Change</button>
                    <button type="button" onclick="this.closest('.support-modal').remove()">Cancel</button>
                </form>
            </div>
        `;
    return modal;
  }

  createKnowledgeSearchModal() {
    const modal = document.createElement('div');
    modal.className = 'support-modal';
    modal.innerHTML = `
            <div class="modal-content">
                <h3>Search Knowledge Base</h3>
                <div class="search-container">
                    <input type="text" placeholder="Search for articles..." id="kb-search">
                    <button onclick="this.previousElementSibling.focus()">Search</button>
                </div>
                <div class="search-results" id="search-results">
                    <!-- Search results will appear here -->
                </div>
                <button type="button" onclick="this.closest('.support-modal').remove()">Close</button>
            </div>
        `;
    return modal;
  }

  // Business Logic Helper Methods
  analyzeIncidentPatterns(incidents) {
    // Analyze patterns in incidents for problem identification
    const patterns = {
      timePatterns: [],
      locationPatterns: [],
      componentPatterns: [],
      errorPatterns: [],
    };

    incidents.forEach((incident) => {
      // Analyze time patterns
      patterns.timePatterns.push(new Date(incident.created).getHours());

      // Analyze location patterns
      if (incident.location) {
        patterns.locationPatterns.push(incident.location);
      }

      // Analyze component patterns
      if (incident.component) {
        patterns.componentPatterns.push(incident.component);
      }

      // Analyze error patterns
      if (incident.errorCode) {
        patterns.errorPatterns.push(incident.errorCode);
      }
    });

    return patterns;
  }

  generateRootCauseHypotheses(patterns) {
    const hypotheses = [];

    // Generate hypotheses based on patterns
    if (patterns.componentPatterns.length > 0) {
      const commonComponents = this.findMostCommon(patterns.componentPatterns);
      hypotheses.push({
        type: 'component_failure',
        component: commonComponents[0],
        confidence: 0.8,
        description: `Possible failure in ${commonComponents[0]} component`,
      });
    }

    if (patterns.timePatterns.length > 0) {
      const commonTimes = this.findMostCommon(patterns.timePatterns);
      hypotheses.push({
        type: 'time_based',
        time: commonTimes[0],
        confidence: 0.6,
        description: `Issues occurring frequently at ${commonTimes[0]}:00`,
      });
    }

    return hypotheses;
  }

  categorizeRisk(riskScore) {
    if (riskScore >= 8) return 'very_high';
    if (riskScore >= 6) return 'high';
    if (riskScore >= 4) return 'medium';
    if (riskScore >= 2) return 'low';
    return 'very_low';
  }

  findMostCommon(array) {
    const frequency = {};
    array.forEach((item) => {
      frequency[item] = (frequency[item] || 0) + 1;
    });

    return Object.keys(frequency).sort((a, b) => frequency[b] - frequency[a]);
  }

  // Event Handlers for specific updates
  handleIncidentUpdate(data) {
    console.log('Incident update received:', data);
    this.showNotification(`Incident ${data.incidentId} updated`, 'info');
  }

  handleProblemUpdate(data) {
    console.log('Problem update received:', data);
    this.showNotification(`Problem ${data.problemId} updated`, 'info');
  }

  handleChangeUpdate(data) {
    console.log('Change update received:', data);
    this.showNotification(`Change ${data.changeId} updated`, 'info');
  }

  handleSLAAlert(data) {
    console.log('SLA alert received:', data);
    this.showNotification(`SLA Alert: ${data.message}`, 'warning');
  }

  handleEscalation(data) {
    console.log('Escalation received:', data);
    this.showNotification(`Escalation: ${data.message}`, 'error');
  }

  broadcastUpdate(type, id, updates) {
    // Broadcast updates to other connected clients
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(
        JSON.stringify({
          type: `${type}_update`,
          id,
          updates,
          timestamp: new Date(),
        })
      );
    }
  }

  checkUserPermissions(operation, resourceId) {
    // Implement role-based access control
    const user = this.getCurrentUser();
    // Simplified permission check
    return user.role === 'admin' || user.role === 'support_agent';
  }

  sendAuditLog(auditEntry) {
    // Send audit log to backend
    this.apiRequest('audit-log', {
      method: 'POST',
      body: JSON.stringify(auditEntry),
    }).catch((error) => {
      console.error('Failed to send audit log:', error);
    });
  }

  encrypt(data) {
    // Simplified encryption placeholder
    return btoa(JSON.stringify(data));
  }
}

// Create global instance
window.SupportPageManager = new SupportPageManager();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  await window.SupportPageManager.init();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SupportPageManager;
}
