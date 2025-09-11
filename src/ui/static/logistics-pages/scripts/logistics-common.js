/**
 * Logistics Pages Common JavaScript
 * Shared functionality for all logistics management pages
 */

// Global logistics pages namespace
window.logisticsPages = {
  // Configuration
  config: {
    apiBaseUrl: '/api/logistics',
    notificationDuration: 3000,
    animationDuration: 300,
  },

  // Utility functions
  showNotification: function (message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `logistics-notification ${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

    // Add styles if not already present
    if (!document.getElementById('logistics-notification-styles')) {
      const styles = document.createElement('style');
      styles.id = 'logistics-notification-styles';
      styles.textContent = this.getNotificationStyles();
      document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Auto-remove after duration
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, this.config.notificationDuration);

    // Add animation
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
      notification.style.opacity = '1';
    });
  },

  getNotificationIcon: function (type) {
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-triangle',
      warning: 'fa-exclamation-circle',
      info: 'fa-info-circle',
    };
    return icons[type] || icons.info;
  },

  getNotificationStyles: function () {
    return `
            .logistics-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.3s ease;
            }
            
            .logistics-notification.success {
                border-left: 4px solid #27ae60;
            }
            
            .logistics-notification.error {
                border-left: 4px solid #e74c3c;
            }
            
            .logistics-notification.warning {
                border-left: 4px solid #f39c12;
            }
            
            .logistics-notification.info {
                border-left: 4px solid #3498db;
            }
            
            .notification-content {
                padding: 16px;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .notification-content i {
                font-size: 18px;
            }
            
            .logistics-notification.success .notification-content i {
                color: #27ae60;
            }
            
            .logistics-notification.error .notification-content i {
                color: #e74c3c;
            }
            
            .logistics-notification.warning .notification-content i {
                color: #f39c12;
            }
            
            .logistics-notification.info .notification-content i {
                color: #3498db;
            }
            
            .notification-content span {
                flex: 1;
                color: #2c3e50;
                font-size: 14px;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: #7f8c8d;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: background-color 0.2s;
            }
            
            .notification-close:hover {
                background: #f8f9fa;
            }
        `;
  },

  // API helper functions
  apiCall: async function (endpoint, options = {}) {
    const url = `${this.config.apiBaseUrl}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
    };

    const finalOptions = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, finalOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      this.showNotification(`API Error: ${error.message}`, 'error');
      throw error;
    }
  },

  getAuthToken: function () {
    // In a real implementation, this would get the token from localStorage or a secure cookie
    return localStorage.getItem('authToken') || 'demo-token';
  },

  // Common page actions
  testIntegration: function (pageName) {
    this.showNotification('Testing integration...', 'info');

    // Simulate API test
    setTimeout(() => {
      this.showNotification(`${pageName} integration test completed successfully`, 'success');
    }, 2000);
  },

  viewData: function (pageName) {
    this.showNotification('Loading data view...', 'info');

    // Simulate data loading
    setTimeout(() => {
      this.showNotification('Data view opened successfully', 'success');
    }, 1000);
  },

  openSettings: function (pageName) {
    this.showNotification('Opening settings panel...', 'info');

    // Simulate settings panel
    setTimeout(() => {
      this.showNotification('Settings panel opened', 'success');
    }, 500);
  },

  exportData: function (pageName) {
    this.showNotification('Preparing data export...', 'info');

    // Simulate export
    setTimeout(() => {
      this.showNotification('Data export completed successfully', 'success');
      // In a real implementation, this would trigger a file download
    }, 1500);
  },

  // Data validation helpers
  validateInput: function (value, type, required = false) {
    if (required && (!value || value.trim() === '')) {
      return { valid: false, message: 'This field is required' };
    }

    if (!value || value.trim() === '') {
      return { valid: true, message: '' };
    }

    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
          valid: emailRegex.test(value),
          message: emailRegex.test(value) ? '' : 'Please enter a valid email address',
        };

      case 'phone':
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        return {
          valid: phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10,
          message:
            phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10
              ? ''
              : 'Please enter a valid phone number',
        };

      case 'number':
        const numValue = parseFloat(value);
        return {
          valid: !isNaN(numValue) && isFinite(numValue),
          message: !isNaN(numValue) && isFinite(numValue) ? '' : 'Please enter a valid number',
        };

      case 'url':
        try {
          new URL(value);
          return { valid: true, message: '' };
        } catch {
          return { valid: false, message: 'Please enter a valid URL' };
        }

      default:
        return { valid: true, message: '' };
    }
  },

  // Form handling helpers
  serializeForm: function (form) {
    const formData = new FormData(form);
    const data = {};

    for (let [key, value] of formData.entries()) {
      if (data[key]) {
        // Handle multiple values (like checkboxes)
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    }

    return data;
  },

  // Date and time utilities
  formatDate: function (date, format = 'MM/DD/YYYY') {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();

    switch (format) {
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      default:
        return d.toLocaleDateString();
    }
  },

  formatTime: function (date, format = '12') {
    const d = new Date(date);

    if (format === '24') {
      return d.toLocaleTimeString('en-US', { hour12: false });
    } else {
      return d.toLocaleTimeString('en-US', { hour12: true });
    }
  },

  // Number formatting utilities
  formatCurrency: function (amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  },

  formatNumber: function (number, decimals = 0) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(number);
  },

  // Local storage helpers
  setLocalData: function (key, data) {
    try {
      localStorage.setItem(`logistics_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  getLocalData: function (key, defaultValue = null) {
    try {
      const data = localStorage.getItem(`logistics_${key}`);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return defaultValue;
    }
  },

  removeLocalData: function (key) {
    try {
      localStorage.removeItem(`logistics_${key}`);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },

  // Loading state management
  showLoading: function (element, message = 'Loading...') {
    if (typeof element === 'string') {
      element = document.getElementById(element);
    }

    if (!element) return;

    element.style.position = 'relative';

    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'logistics-loading-overlay';
    loadingOverlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <span>${message}</span>
            </div>
        `;

    // Add loading styles if not present
    if (!document.getElementById('logistics-loading-styles')) {
      const styles = document.createElement('style');
      styles.id = 'logistics-loading-styles';
      styles.textContent = `
                .logistics-loading-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255, 255, 255, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    border-radius: inherit;
                }
                
                .loading-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                    color: #2c3e50;
                }
                
                .loading-spinner {
                    width: 32px;
                    height: 32px;
                    border: 3px solid #ecf0f1;
                    border-top: 3px solid #3498db;
                    border-radius: 50%;
                    animation: logistics-spin 1s linear infinite;
                }
                
                @keyframes logistics-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
      document.head.appendChild(styles);
    }

    element.appendChild(loadingOverlay);
  },

  hideLoading: function (element) {
    if (typeof element === 'string') {
      element = document.getElementById(element);
    }

    if (!element) return;

    const loadingOverlay = element.querySelector('.logistics-loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.remove();
    }
  },
};

// Initialize common functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  console.log('Logistics Pages Common JavaScript loaded');

  // Add global error handler
  window.addEventListener('error', function (event) {
    console.error('Global error:', event.error);
    if (window.logisticsPages) {
      window.logisticsPages.showNotification('An unexpected error occurred', 'error');
    }
  });

  // Add global unhandled promise rejection handler
  window.addEventListener('unhandledrejection', function (event) {
    console.error('Unhandled promise rejection:', event.reason);
    if (window.logisticsPages) {
      window.logisticsPages.showNotification('An unexpected error occurred', 'error');
    }
    event.preventDefault();
  });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.logisticsPages;
}
