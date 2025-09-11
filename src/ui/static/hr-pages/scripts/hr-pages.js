/**
 * HR Pages - Main JavaScript functionality
 * Shared functionality for all HR pages
 */

// Global HR Pages namespace
window.hrPages = {
  // Configuration
  config: {
    apiBaseUrl: '/api/hr',
    notificationDuration: 3000,
    retryAttempts: 3,
    retryDelay: 1000,
  },

  // State management
  state: {
    currentPage: null,
    userData: null,
    notifications: [],
  },

  // Initialize HR Pages functionality
  init: function () {
    console.log('🏗️ Initializing HR Pages functionality...');

    // Set current page
    this.state.currentPage = this.getCurrentPageName();

    // Initialize common features
    this.initializeCommonFeatures();

    // Setup event listeners
    this.setupEventListeners();

    // Load user context
    this.loadUserContext();

    console.log('✅ HR Pages initialized successfully');
  },

  // Get current page name from URL
  getCurrentPageName: function () {
    const path = window.location.pathname;
    const segments = path.split('/');
    return segments[segments.length - 1].replace('.html', '');
  },

  // Initialize common features
  initializeCommonFeatures: function () {
    // Add loading indicators
    this.addLoadingIndicators();

    // Setup form validation
    this.setupFormValidation();

    // Initialize tooltips
    this.initializeTooltips();

    // Setup keyboard shortcuts
    this.setupKeyboardShortcuts();
  },

  // Setup global event listeners
  setupEventListeners: function () {
    // Handle notification clicks
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('notification')) {
        this.dismissNotification(e.target);
      }
    });

    // Handle escape key for modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModals();
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  },

  // Load user context and permissions
  loadUserContext: async function () {
    try {
      const response = await this.apiRequest('/user/context');
      if (response.success) {
        this.state.userData = response.data;
        this.updateUIForUser();
      }
    } catch (error) {
      console.warn('Could not load user context:', error);
    }
  },

  // Update UI based on user permissions
  updateUIForUser: function () {
    if (!this.state.userData) return;

    const { permissions, role } = this.state.userData;

    // Hide/show elements based on permissions
    document.querySelectorAll('[data-permission]').forEach((element) => {
      const requiredPermission = element.dataset.permission;
      if (!permissions.includes(requiredPermission)) {
        element.style.display = 'none';
      }
    });

    // Update role-specific content
    document.querySelectorAll('[data-role]').forEach((element) => {
      const requiredRole = element.dataset.role;
      if (role !== requiredRole) {
        element.style.display = 'none';
      }
    });
  },

  // API request wrapper with retry logic
  apiRequest: async function (endpoint, options = {}) {
    const url = this.config.apiBaseUrl + endpoint;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    };

    const requestOptions = { ...defaultOptions, ...options };

    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        console.warn(`API request attempt ${attempt} failed:`, error);

        if (attempt === this.config.retryAttempts) {
          throw error;
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, this.config.retryDelay * attempt));
      }
    }
  },

  // Show notification
  showNotification: function (message, type = 'info', duration = null) {
    const notification = document.createElement('div');
    notification.className = `notification ${type} fade-in`;
    notification.textContent = message;

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            margin-left: 1rem;
            cursor: pointer;
            padding: 0;
        `;
    closeBtn.onclick = () => this.dismissNotification(notification);
    notification.appendChild(closeBtn);

    document.body.appendChild(notification);
    this.state.notifications.push(notification);

    // Auto-dismiss
    const dismissDuration = duration || this.config.notificationDuration;
    setTimeout(() => {
      this.dismissNotification(notification);
    }, dismissDuration);

    return notification;
  },

  // Dismiss notification
  dismissNotification: function (notification) {
    if (notification && notification.parentNode) {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
        const index = this.state.notifications.indexOf(notification);
        if (index > -1) {
          this.state.notifications.splice(index, 1);
        }
      }, 300);
    }
  },

  // Test integration for a specific page
  testIntegration: async function (pageName) {
    this.showNotification(`Testing integration for ${pageName}...`, 'info');

    try {
      // Add loading state
      const testBtn = document.getElementById('testIntegrationBtn');
      if (testBtn) {
        testBtn.classList.add('loading');
        testBtn.disabled = true;
      }

      // Simulate integration test
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Test API connectivity
      const response = await this.apiRequest(`/test/${pageName}`);

      this.showNotification('Integration test completed successfully!', 'success');
    } catch (error) {
      console.error('Integration test failed:', error);
      this.showNotification('Integration test failed. Please check the logs.', 'error');
    } finally {
      // Remove loading state
      const testBtn = document.getElementById('testIntegrationBtn');
      if (testBtn) {
        testBtn.classList.remove('loading');
        testBtn.disabled = false;
      }
    }
  },

  // View data for a specific page
  viewData: async function (pageName) {
    this.showNotification(`Loading data for ${pageName}...`, 'info');

    try {
      const response = await this.apiRequest(`/data/${pageName}`);

      if (response.success) {
        this.showDataModal(response.data, pageName);
      } else {
        throw new Error(response.error || 'Failed to load data');
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      this.showNotification('Failed to load data. Please try again.', 'error');
    }
  },

  // Show data in modal
  showDataModal: function (data, pageName) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'data-modal-overlay';
    modal.innerHTML = `
            <div class="data-modal">
                <div class="data-modal-header">
                    <h3>Data for ${pageName.replace('-', ' ').replace(/\\b\\w/g, (l) => l.toUpperCase())}</h3>
                    <button class="modal-close" onclick="this.closest('.data-modal-overlay').remove()">&times;</button>
                </div>
                <div class="data-modal-content">
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                </div>
            </div>
        `;

    // Add modal styles
    modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;

    const modalContent = modal.querySelector('.data-modal');
    modalContent.style.cssText = `
            background: white;
            border-radius: 8px;
            width: 90%;
            max-width: 800px;
            max-height: 80%;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `;

    const modalHeader = modal.querySelector('.data-modal-header');
    modalHeader.style.cssText = `
            padding: 1rem 1.5rem;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

    const modalContentDiv = modal.querySelector('.data-modal-content');
    modalContentDiv.style.cssText = `
            padding: 1.5rem;
            max-height: 60vh;
            overflow-y: auto;
        `;

    document.body.appendChild(modal);

    // Close on click outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  },

  // Open settings for a page
  openSettings: function (pageName) {
    this.showNotification(`Opening settings for ${pageName}...`, 'info');

    // Simulate settings modal
    setTimeout(() => {
      this.showNotification('Settings functionality coming soon!', 'warning');
    }, 1000);
  },

  // Export data for a page
  exportData: async function (pageName) {
    this.showNotification(`Exporting data for ${pageName}...`, 'info');

    try {
      const response = await this.apiRequest(`/export/${pageName}`);

      if (response.success) {
        // Create download link
        const link = document.createElement('a');
        link.href = response.downloadUrl || '#';
        link.download = `${pageName}-export-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();

        this.showNotification('Data exported successfully!', 'success');
      } else {
        throw new Error(response.error || 'Export failed');
      }
    } catch (error) {
      console.error('Export failed:', error);
      this.showNotification('Export failed. Please try again.', 'error');
    }
  },

  // Add loading indicators to buttons
  addLoadingIndicators: function () {
    document.querySelectorAll('button[id*="Btn"]').forEach((button) => {
      button.addEventListener('click', function () {
        if (!this.disabled) {
          this.classList.add('loading');
          setTimeout(() => {
            this.classList.remove('loading');
          }, 2000);
        }
      });
    });
  },

  // Setup form validation
  setupFormValidation: function () {
    document.querySelectorAll('form').forEach((form) => {
      form.addEventListener('submit', (e) => {
        if (!this.validateForm(form)) {
          e.preventDefault();
          this.showNotification('Please correct the errors in the form.', 'error');
        }
      });
    });
  },

  // Validate form
  validateForm: function (form) {
    let isValid = true;

    form
      .querySelectorAll('input[required], select[required], textarea[required]')
      .forEach((field) => {
        if (!field.value.trim()) {
          field.classList.add('error');
          isValid = false;
        } else {
          field.classList.remove('error');
        }
      });

    return isValid;
  },

  // Initialize tooltips
  initializeTooltips: function () {
    document.querySelectorAll('[data-tooltip]').forEach((element) => {
      element.addEventListener('mouseenter', (e) => {
        this.showTooltip(e.target, e.target.dataset.tooltip);
      });

      element.addEventListener('mouseleave', () => {
        this.hideTooltip();
      });
    });
  },

  // Show tooltip
  showTooltip: function (element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
            position: absolute;
            background: #2d3748;
            color: white;
            padding: 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            z-index: 1000;
            pointer-events: none;
        `;

    document.body.appendChild(tooltip);

    const rect = element.getBoundingClientRect();
    tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';

    this.currentTooltip = tooltip;
  },

  // Hide tooltip
  hideTooltip: function () {
    if (this.currentTooltip) {
      this.currentTooltip.remove();
      this.currentTooltip = null;
    }
  },

  // Setup keyboard shortcuts
  setupKeyboardShortcuts: function () {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + E for export
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        const pageName = this.state.currentPage;
        if (pageName) {
          this.exportData(pageName);
        }
      }

      // Ctrl/Cmd + T for test
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        const pageName = this.state.currentPage;
        if (pageName) {
          this.testIntegration(pageName);
        }
      }
    });
  },

  // Close all modals
  closeModals: function () {
    document.querySelectorAll('.data-modal-overlay, .modal-overlay').forEach((modal) => {
      modal.remove();
    });
  },

  // Handle window resize
  handleResize: function () {
    // Update responsive layouts
    this.updateResponsiveLayouts();
  },

  // Update responsive layouts
  updateResponsiveLayouts: function () {
    const isMobile = window.innerWidth < 768;

    // Update header layout
    const header = document.querySelector('.hr-enterprise-header');
    if (header) {
      if (isMobile) {
        header.style.flexDirection = 'column';
      } else {
        header.style.flexDirection = 'row';
      }
    }

    // Update stats grid
    const statsGrid = document.querySelector('.hr-header-stats');
    if (statsGrid) {
      if (isMobile) {
        statsGrid.style.gridTemplateColumns = '1fr';
      } else {
        statsGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
      }
    }
  },

  // Format number for display
  formatNumber: function (num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  },

  // Format currency
  formatCurrency: function (amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  },

  // Format date
  formatDate: function (date, format = 'short') {
    const options = {
      short: { year: 'numeric', month: 'short', day: 'numeric' },
      long: { year: 'numeric', month: 'long', day: 'numeric' },
      time: { hour: '2-digit', minute: '2-digit' },
    };

    return new Intl.DateTimeFormat('en-US', options[format]).format(new Date(date));
  },
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  window.hrPages.init();
});

// Add slideOut animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .error {
        border-color: #f56565 !important;
        box-shadow: 0 0 0 3px rgba(245, 101, 101, 0.1) !important;
    }
`;
document.head.appendChild(style);

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.hrPages;
}
