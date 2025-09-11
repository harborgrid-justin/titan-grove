/**
 * Asset Management Pages - Common Functionality
 * Shared JavaScript for all 32 asset management pages
 */

class AssetManagementPagesSystem {
  constructor() {
    this.apiBaseUrl = '/api/assets';
    this.currentUser = null;
    this.permissions = [];
    this.realTimeConnection = null;
    this.initialize();
  }

  async initialize() {
    try {
      await this.loadUserContext();
      this.setupEventListeners();
      this.initializeRealTimeUpdates();
      this.setupErrorHandling();
      console.log('Asset Management Pages System initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Asset Management Pages System:', error);
      this.showNotification('System initialization failed', 'error');
    }
  }

  async loadUserContext() {
    // Load current user and permissions
    this.currentUser = {
      id: 'user_001',
      name: 'Asset Manager',
      role: 'asset_manager',
      department: 'Operations',
    };

    this.permissions = [
      'asset_create',
      'asset_read',
      'asset_update',
      'asset_delete',
      'maintenance_schedule',
      'maintenance_track',
      'performance_view',
      'compliance_manage',
      'audit_access',
    ];
  }

  setupEventListeners() {
    // Back button functionality
    document.addEventListener('click', (e) => {
      if (e.target.closest('[onclick="history.back()"]')) {
        e.preventDefault();
        this.handleBackNavigation();
      }
    });

    // Action buttons
    document.addEventListener('click', (e) => {
      if (e.target.id === 'actionBtn' || e.target.closest('#actionBtn')) {
        this.handleActionButton();
      }
      if (e.target.id === 'primaryBtn' || e.target.closest('#primaryBtn')) {
        this.handlePrimaryButton();
      }
    });

    // Form submissions
    document.addEventListener('submit', (e) => {
      if (e.target.classList.contains('asset-form')) {
        e.preventDefault();
        this.handleFormSubmission(e.target);
      }
    });

    // Search and filter functionality
    document.addEventListener('input', (e) => {
      if (e.target.classList.contains('asset-search-input')) {
        this.debounce(this.handleSearch.bind(this), 300)(e.target.value);
      }
    });

    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('asset-filter-select')) {
        this.handleFilter(e.target);
      }
    });
  }

  initializeRealTimeUpdates() {
    // Initialize WebSocket connection for real-time updates
    if (typeof WebSocket !== 'undefined') {
      try {
        const wsUrl = `ws://${window.location.hostname}:3001/ws/assets`;
        this.realTimeConnection = new WebSocket(wsUrl);

        this.realTimeConnection.onopen = () => {
          console.log('Real-time asset updates connected');
          this.showNotification('Real-time updates enabled', 'success');
        };

        this.realTimeConnection.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.handleRealTimeUpdate(data);
        };

        this.realTimeConnection.onerror = () => {
          console.log('Real-time connection failed, using polling fallback');
          this.initializePollingUpdates();
        };
      } catch (error) {
        console.log('WebSocket not available, using polling fallback');
        this.initializePollingUpdates();
      }
    } else {
      this.initializePollingUpdates();
    }
  }

  initializePollingUpdates() {
    // Fallback to polling for updates
    setInterval(() => {
      this.checkForUpdates();
    }, 30000); // Check every 30 seconds
  }

  async checkForUpdates() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/updates/latest`);
      if (response.ok) {
        const updates = await response.json();
        if (updates.data && updates.data.length > 0) {
          updates.data.forEach((update) => this.handleRealTimeUpdate(update));
        }
      }
    } catch (error) {
      console.log('Update check failed:', error);
    }
  }

  handleRealTimeUpdate(data) {
    // Handle real-time updates from backend
    switch (data.type) {
      case 'asset_updated':
        this.updateAssetDisplay(data.assetId, data.changes);
        break;
      case 'maintenance_scheduled':
        this.updateMaintenanceDisplay(data.maintenanceId);
        break;
      case 'performance_alert':
        this.showPerformanceAlert(data.alert);
        break;
      case 'compliance_violation':
        this.showComplianceAlert(data.violation);
        break;
      default:
        console.log('Unknown update type:', data.type);
    }
  }

  updateAssetDisplay(assetId, changes) {
    // Update asset information in the current page
    const assetElements = document.querySelectorAll(`[data-asset-id="${assetId}"]`);
    assetElements.forEach((element) => {
      Object.keys(changes).forEach((field) => {
        const fieldElement = element.querySelector(`[data-field="${field}"]`);
        if (fieldElement) {
          fieldElement.textContent = changes[field];
          fieldElement.classList.add('updated');
          setTimeout(() => fieldElement.classList.remove('updated'), 2000);
        }
      });
    });
  }

  handleBackNavigation() {
    // Custom back navigation with state preservation
    if (document.referrer && document.referrer.includes('asset-management')) {
      history.back();
    } else {
      // Default back to main asset management
      window.location.href = '../asset-management.html';
    }
  }

  handleActionButton() {
    const currentPage = this.getCurrentPageType();

    switch (currentPage) {
      case 'create':
        this.showAssetTemplateDialog();
        break;
      case 'edit':
        this.showFieldValidationDialog();
        break;
      case 'view':
        this.showAssetOptionsDialog();
        break;
      case 'maintenance':
        this.showMaintenanceOptionsDialog();
        break;
      case 'performance':
        this.showPerformanceOptionsDialog();
        break;
      case 'compliance':
        this.showComplianceOptionsDialog();
        break;
      default:
        this.showConfigurationDialog();
    }
  }

  handlePrimaryButton() {
    const currentPage = this.getCurrentPageType();

    switch (currentPage) {
      case 'create':
        this.submitAssetCreation();
        break;
      case 'edit':
        this.submitAssetChanges();
        break;
      case 'import':
        this.processAssetImport();
        break;
      case 'export':
        this.processAssetExport();
        break;
      default:
        this.executePageAction();
    }
  }

  getCurrentPageType() {
    const path = window.location.pathname;
    if (path.includes('create')) return 'create';
    if (path.includes('edit')) return 'edit';
    if (path.includes('view')) return 'view';
    if (path.includes('import')) return 'import';
    if (path.includes('export')) return 'export';
    if (path.includes('maintenance')) return 'maintenance';
    if (path.includes('performance')) return 'performance';
    if (path.includes('compliance')) return 'compliance';
    return 'general';
  }

  async handleFormSubmission(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      this.showLoadingState(true);
      const endpoint = this.getEndpointForForm(form);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        this.showNotification('Operation completed successfully', 'success');
        this.handleSuccessfulSubmission(result);
      } else {
        throw new Error('Server returned error status');
      }
    } catch (error) {
      console.error('Form submission failed:', error);
      this.showNotification('Operation failed. Please try again.', 'error');
    } finally {
      this.showLoadingState(false);
    }
  }

  getEndpointForForm(form) {
    const formId = form.id || form.className;
    const currentPage = this.getCurrentPageType();

    return `${this.apiBaseUrl}/${currentPage}`;
  }

  getAuthToken() {
    return localStorage.getItem('authToken') || 'demo-token';
  }

  handleSearch(query) {
    console.log('Searching assets:', query);
    // Implement search functionality
    this.performAssetSearch(query);
  }

  async performAssetSearch(query) {
    if (!query || query.length < 2) return;

    try {
      const response = await fetch(`${this.apiBaseUrl}/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const results = await response.json();
        this.displaySearchResults(results.data);
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  }

  displaySearchResults(results) {
    const resultsContainer = document.querySelector('.search-results');
    if (resultsContainer) {
      resultsContainer.innerHTML = results
        .map(
          (asset) => `
                <div class="search-result-item" data-asset-id="${asset.id}">
                    <div class="result-title">${asset.name}</div>
                    <div class="result-meta">${asset.category} - ${asset.location}</div>
                </div>
            `
        )
        .join('');
    }
  }

  handleFilter(filterElement) {
    const filterType = filterElement.dataset.filter;
    const filterValue = filterElement.value;

    console.log(`Applying ${filterType} filter:`, filterValue);
    this.applyAssetFilter(filterType, filterValue);
  }

  showNotification(message, type = 'info') {
    // Create and show notification
    const notification = document.createElement('div');
    notification.className = `asset-notification asset-notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  getNotificationIcon(type) {
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
      info: 'info-circle',
    };
    return icons[type] || 'info-circle';
  }

  showLoadingState(show) {
    const loadingElements = document.querySelectorAll('.loading-indicator');
    const buttons = document.querySelectorAll('.asset-btn');

    if (show) {
      loadingElements.forEach((el) => (el.style.display = 'block'));
      buttons.forEach((btn) => (btn.disabled = true));
    } else {
      loadingElements.forEach((el) => (el.style.display = 'none'));
      buttons.forEach((btn) => (btn.disabled = false));
    }
  }

  setupErrorHandling() {
    // Global error handler
    window.addEventListener('error', (event) => {
      console.error('Asset Management Page Error:', event.error);
      this.showNotification('An unexpected error occurred', 'error');
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
      this.showNotification('A system error occurred', 'error');
    });
  }

  // Utility functions
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  // Placeholder methods for specific functionality
  showAssetTemplateDialog() {
    console.log('Asset template dialog opened');
  }
  showFieldValidationDialog() {
    console.log('Field validation dialog opened');
  }
  showAssetOptionsDialog() {
    console.log('Asset options dialog opened');
  }
  showMaintenanceOptionsDialog() {
    console.log('Maintenance options dialog opened');
  }
  showPerformanceOptionsDialog() {
    console.log('Performance options dialog opened');
  }
  showComplianceOptionsDialog() {
    console.log('Compliance options dialog opened');
  }
  showConfigurationDialog() {
    console.log('Configuration dialog opened');
  }

  submitAssetCreation() {
    console.log('Asset creation submitted');
  }
  submitAssetChanges() {
    console.log('Asset changes submitted');
  }
  processAssetImport() {
    console.log('Asset import processed');
  }
  processAssetExport() {
    console.log('Asset export processed');
  }
  executePageAction() {
    console.log('Page action executed');
  }

  updateMaintenanceDisplay() {
    console.log('Maintenance display updated');
  }
  showPerformanceAlert() {
    console.log('Performance alert shown');
  }
  showComplianceAlert() {
    console.log('Compliance alert shown');
  }
  handleSuccessfulSubmission() {
    console.log('Successful submission handled');
  }
  applyAssetFilter() {
    console.log('Asset filter applied');
  }
}

// Initialize the system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.assetManagementPages = new AssetManagementPagesSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AssetManagementPagesSystem;
}
