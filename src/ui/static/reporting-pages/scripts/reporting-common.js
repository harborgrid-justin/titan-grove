/**
 * Common functionality for all Reporting Pages
 * Shared business logic and utilities
 */

// Global reporting page manager
class ReportingPageManager {
  constructor() {
    this.apiBase = '/api/reporting';
    this.currentUser = null;
    this.currentSession = null;
    this.realTimeEnabled = true;
    this.refreshInterval = 30000; // 30 seconds

    this.initializeCommonFeatures();
  }

  initializeCommonFeatures() {
    this.initializeAuthentication();
    this.initializeWebSocket();
    this.initializeErrorHandling();
    this.initializeBusinessLogic();
    this.setupRealTimeUpdates();

    console.log('Reporting Page Manager initialized with business logic');
  }

  initializeAuthentication() {
    // Initialize authentication and session management
    this.currentUser = {
      id: 'user_001',
      name: 'Business User',
      role: 'Executive',
      permissions: ['view_reports', 'export_reports', 'configure_reports'],
      businessUnit: 'Corporate',
    };

    this.currentSession = {
      sessionId: this.generateSessionId(),
      startTime: new Date(),
      lastActivity: new Date(),
    };
  }

  initializeWebSocket() {
    // Initialize WebSocket connection for real-time updates
    if (typeof WebSocket !== 'undefined') {
      try {
        this.websocket = new WebSocket(`ws://localhost:3000/reporting-updates`);

        this.websocket.onopen = () => {
          console.log('Real-time reporting connection established');
        };

        this.websocket.onmessage = (event) => {
          this.handleRealTimeUpdate(JSON.parse(event.data));
        };

        this.websocket.onerror = (error) => {
          console.log('WebSocket error - using polling fallback');
        };
      } catch (error) {
        console.log('WebSocket not available - using polling updates');
      }
    }
  }

  initializeErrorHandling() {
    // Global error handling for reporting pages
    window.addEventListener('error', (event) => {
      this.logError('JavaScript Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.logError('Unhandled Promise Rejection', {
        reason: event.reason,
      });
    });
  }

  initializeBusinessLogic() {
    // Initialize core business logic components
    this.businessLogic = {
      reportingEngine: {
        dataProcessing: true,
        realTimeAnalytics: true,
        businessIntelligence: true,
        predictiveAnalytics: true,
      },
      securityFeatures: {
        authentication: true,
        authorization: true,
        dataEncryption: true,
        auditTrails: true,
      },
      enterpriseFeatures: {
        multiTenancy: true,
        scalability: true,
        highAvailability: true,
        disasterRecovery: true,
      },
      integrationCapabilities: {
        apiIntegration: true,
        databaseConnectors: true,
        cloudServices: true,
        legacySystems: true,
      },
    };
  }

  setupRealTimeUpdates() {
    // Setup real-time data updates
    if (this.realTimeEnabled) {
      setInterval(() => {
        this.updateRealTimeData();
      }, this.refreshInterval);
    }
  }

  // API Methods
  async makeApiCall(endpoint, options = {}) {
    try {
      const defaultOptions = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAuthToken()}`,
          'X-Session-ID': this.currentSession.sessionId,
          'X-Business-Unit': this.currentUser.businessUnit,
        },
      };

      const response = await fetch(`${this.apiBase}${endpoint}`, {
        ...defaultOptions,
        ...options,
        headers: { ...defaultOptions.headers, ...options.headers },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      this.updateLastActivity();

      return data;
    } catch (error) {
      this.handleApiError(endpoint, error);
      throw error;
    }
  }

  async getReportData(reportType, parameters = {}) {
    const endpoint = `/data/${reportType}`;
    const options = {
      method: 'POST',
      body: JSON.stringify({
        parameters,
        userContext: this.currentUser,
        sessionInfo: this.currentSession,
      }),
    };

    return await this.makeApiCall(endpoint, options);
  }

  async exportReport(reportType, format, parameters = {}) {
    const endpoint = `/export/${reportType}`;
    const options = {
      method: 'POST',
      body: JSON.stringify({
        format,
        parameters,
        userContext: this.currentUser,
      }),
    };

    return await this.makeApiCall(endpoint, options);
  }

  async saveReportConfiguration(reportType, configuration) {
    const endpoint = `/config/${reportType}`;
    const options = {
      method: 'PUT',
      body: JSON.stringify({
        configuration,
        userContext: this.currentUser,
      }),
    };

    return await this.makeApiCall(endpoint, options);
  }

  // Real-time Updates
  handleRealTimeUpdate(updateData) {
    console.log('Real-time update received:', updateData);

    // Dispatch custom event for page-specific handling
    const event = new CustomEvent('reportingUpdate', {
      detail: updateData,
    });
    document.dispatchEvent(event);

    // Show notification
    this.showNotification(`Real-time update: ${updateData.message}`, 'info');
  }

  updateRealTimeData() {
    // Trigger real-time data refresh
    const event = new CustomEvent('realTimeRefresh', {
      detail: { timestamp: new Date() },
    });
    document.dispatchEvent(event);
  }

  // Utility Methods
  generateSessionId() {
    return 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  getAuthToken() {
    // In a real implementation, this would return the actual JWT token
    return 'reporting_token_' + this.currentUser.id;
  }

  updateLastActivity() {
    this.currentSession.lastActivity = new Date();
  }

  // Error Handling
  handleApiError(endpoint, error) {
    console.error(`API Error for ${endpoint}:`, error);

    this.logError('API Error', {
      endpoint,
      error: error.message,
      timestamp: new Date(),
      userContext: this.currentUser,
    });

    this.showNotification('There was an error loading data. Please try again.', 'error');
  }

  logError(type, details) {
    const errorLog = {
      type,
      details,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      user: this.currentUser?.id,
    };

    // In a real implementation, this would send to logging service
    console.error('Error logged:', errorLog);
  }

  // UI Utilities
  showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.reporting-notification');
    existingNotifications.forEach((notification) => notification.remove());

    // Create new notification
    const notification = document.createElement('div');
    notification.className = `reporting-notification reporting-notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  getNotificationIcon(type) {
    const icons = {
      info: 'fa-info-circle',
      success: 'fa-check-circle',
      warning: 'fa-exclamation-triangle',
      error: 'fa-exclamation-circle',
    };
    return icons[type] || icons.info;
  }

  showLoadingState(element) {
    if (element) {
      element.style.opacity = '0.6';
      element.style.pointerEvents = 'none';
    }
  }

  hideLoadingState(element) {
    if (element) {
      element.style.opacity = '1';
      element.style.pointerEvents = 'auto';
    }
  }

  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  formatNumber(number, decimals = 0) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(number);
  }

  formatPercentage(value, decimals = 1) {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value / 100);
  }

  formatDate(date, options = {}) {
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };

    return new Intl.DateTimeFormat('en-US', {
      ...defaultOptions,
      ...options,
    }).format(new Date(date));
  }

  // Business Logic Validation
  validateUserPermissions(requiredPermissions) {
    if (!this.currentUser || !this.currentUser.permissions) {
      return false;
    }

    return requiredPermissions.every((permission) =>
      this.currentUser.permissions.includes(permission)
    );
  }

  validateBusinessRules(ruleSet, data) {
    // Implement business rule validation
    const validationResults = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    // Add specific business rule validations here
    return validationResults;
  }

  // Export/Import functionality
  async exportToExcel(data, filename) {
    // Simulate Excel export
    console.log('Exporting to Excel:', filename);
    return new Promise((resolve) => {
      setTimeout(() => {
        this.showNotification(`Excel file "${filename}" exported successfully!`, 'success');
        resolve({ success: true, filename });
      }, 2000);
    });
  }

  async exportToPDF(data, filename) {
    // Simulate PDF export
    console.log('Exporting to PDF:', filename);
    return new Promise((resolve) => {
      setTimeout(() => {
        this.showNotification(`PDF file "${filename}" exported successfully!`, 'success');
        resolve({ success: true, filename });
      }, 2000);
    });
  }

  async exportToPowerPoint(data, filename) {
    // Simulate PowerPoint export
    console.log('Exporting to PowerPoint:', filename);
    return new Promise((resolve) => {
      setTimeout(() => {
        this.showNotification(`PowerPoint file "${filename}" exported successfully!`, 'success');
        resolve({ success: true, filename });
      }, 2000);
    });
  }
}

// Initialize global reporting manager
const reportingManager = new ReportingPageManager();

// Global utility functions for all reporting pages
function initializeReportingPage(pageConfig) {
  console.log(`Initializing reporting page: ${pageConfig.pageName}`);

  // Validate user access
  if (pageConfig.requiredPermissions) {
    if (!reportingManager.validateUserPermissions(pageConfig.requiredPermissions)) {
      reportingManager.showNotification(
        'You do not have permission to access this report.',
        'error'
      );
      return false;
    }
  }

  // Set up page-specific event listeners
  if (pageConfig.realTimeUpdates) {
    document.addEventListener('reportingUpdate', (event) => {
      if (pageConfig.handleRealTimeUpdate) {
        pageConfig.handleRealTimeUpdate(event.detail);
      }
    });
  }

  return true;
}

function createReportingChart(containerId, chartConfig) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Create placeholder for chart
  container.innerHTML = `
        <div class="chart-placeholder">
            <div class="chart-message">
                <i class="fas fa-chart-${chartConfig.type || 'line'}"></i>
                <p>${chartConfig.title || 'Chart'} would be displayed here</p>
                <small>Chart Type: ${chartConfig.type || 'line'}</small>
            </div>
        </div>
    `;
}

function setupCommonReportingControls() {
  // Setup common date range picker
  const dateRangeInputs = document.querySelectorAll('input[type="date"]');
  dateRangeInputs.forEach((input) => {
    if (!input.value) {
      input.value = new Date().toISOString().split('T')[0];
    }
  });

  // Setup common export buttons
  const exportButtons = document.querySelectorAll('[data-export]');
  exportButtons.forEach((button) => {
    button.addEventListener('click', async (e) => {
      const format = button.dataset.export;
      const reportType = button.dataset.reportType || 'general';

      button.disabled = true;
      const originalText = button.innerHTML;
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting...';

      try {
        let result;
        switch (format) {
          case 'excel':
            result = await reportingManager.exportToExcel({}, `${reportType}-report.xlsx`);
            break;
          case 'pdf':
            result = await reportingManager.exportToPDF({}, `${reportType}-report.pdf`);
            break;
          case 'powerpoint':
            result = await reportingManager.exportToPowerPoint({}, `${reportType}-report.pptx`);
            break;
        }
      } catch (error) {
        reportingManager.showNotification('Export failed. Please try again.', 'error');
      } finally {
        button.disabled = false;
        button.innerHTML = originalText;
      }
    });
  });
}

// Initialize common controls when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  setupCommonReportingControls();
});

// CSS for notifications
const notificationStyles = `
<style>
.reporting-notification {
    position: fixed;
    top: 24px;
    right: 24px;
    min-width: 300px;
    max-width: 500px;
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    animation: slideInRight 0.3s ease;
}

.reporting-notification-info {
    background: #e0f2fe;
    color: #0277bd;
    border: 1px solid #b3e5fc;
}

.reporting-notification-success {
    background: #e8f5e8;
    color: #2e7d32;
    border: 1px solid #c8e6c9;
}

.reporting-notification-warning {
    background: #fff3e0;
    color: #ef6c00;
    border: 1px solid #ffcc02;
}

.reporting-notification-error {
    background: #ffebee;
    color: #c62828;
    border: 1px solid #ffcdd2;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
}

.notification-close {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.notification-close:hover {
    opacity: 1;
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(100%);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
</style>
`;

// Inject notification styles
document.head.insertAdjacentHTML('beforeend', notificationStyles);
