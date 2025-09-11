// Database Management Common JavaScript
// Shared functionality across all database management pages

// Global database management namespace
window.databasePages = {
  // Configuration
  config: {
    apiBaseUrl: '/api/database',
    refreshInterval: 30000, // 30 seconds
    maxRetries: 3,
    timeoutDuration: 10000, // 10 seconds
  },

  // State management
  state: {
    currentPage: null,
    isLoading: false,
    lastUpdate: null,
    activeConnections: new Map(),
  },

  // Utility functions
  utils: {
    formatDateTime: function (date) {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(date));
    },

    formatBytes: function (bytes, decimals = 2) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },

    formatNumber: function (num) {
      return new Intl.NumberFormat('en-US').format(num);
    },

    debounce: function (func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
  },

  // API functions
  api: {
    async get(endpoint, options = {}) {
      const url = `${window.databasePages.config.apiBaseUrl}${endpoint}`;
      const config = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        timeout: window.databasePages.config.timeoutDuration,
        ...options,
      };

      try {
        const response = await fetch(url, config);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error('API GET error:', error);
        throw error;
      }
    },

    async post(endpoint, data, options = {}) {
      const url = `${window.databasePages.config.apiBaseUrl}${endpoint}`;
      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(data),
        timeout: window.databasePages.config.timeoutDuration,
        ...options,
      };

      try {
        const response = await fetch(url, config);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error('API POST error:', error);
        throw error;
      }
    },

    async put(endpoint, data, options = {}) {
      const url = `${window.databasePages.config.apiBaseUrl}${endpoint}`;
      const config = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(data),
        timeout: window.databasePages.config.timeoutDuration,
        ...options,
      };

      try {
        const response = await fetch(url, config);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error('API PUT error:', error);
        throw error;
      }
    },

    async delete(endpoint, options = {}) {
      const url = `${window.databasePages.config.apiBaseUrl}${endpoint}`;
      const config = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        timeout: window.databasePages.config.timeoutDuration,
        ...options,
      };

      try {
        const response = await fetch(url, config);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error('API DELETE error:', error);
        throw error;
      }
    },
  },

  // Notification system
  showNotification: function (message, type = 'info', duration = 3000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.database-notification');
    existingNotifications.forEach((notification) => notification.remove());

    // Create new notification
    const notification = document.createElement('div');
    notification.className = `database-notification database-notification-${type}`;

    // Create notification content
    notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    <i class="fas ${this.getNotificationIcon(type)}"></i>
                </div>
                <div class="notification-message">${message}</div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

    // Add to page
    document.body.appendChild(notification);

    // Auto-remove after duration
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }
    }, duration);
  },

  getNotificationIcon: function (type) {
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle',
    };
    return icons[type] || icons.info;
  },

  // Loading state management
  setLoading: function (isLoading, element = null) {
    this.state.isLoading = isLoading;

    if (element) {
      if (isLoading) {
        element.classList.add('loading');
        const loader = document.createElement('div');
        loader.className = 'database-loader';
        loader.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        element.appendChild(loader);
      } else {
        element.classList.remove('loading');
        const loader = element.querySelector('.database-loader');
        if (loader) {
          loader.remove();
        }
      }
    }
  },

  // Real-time updates
  realTime: {
    connections: new Map(),

    connect: function (endpoint, onMessage, onError = null) {
      if ('WebSocket' in window) {
        const wsUrl = `ws://${window.location.host}/ws/database${endpoint}`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = function () {
          console.log('WebSocket connected:', endpoint);
          window.databasePages.showNotification('Real-time connection established', 'success');
        };

        ws.onmessage = function (event) {
          try {
            const data = JSON.parse(event.data);
            onMessage(data);
          } catch (error) {
            console.error('WebSocket message parse error:', error);
          }
        };

        ws.onerror = function (error) {
          console.error('WebSocket error:', error);
          if (onError) {
            onError(error);
          } else {
            window.databasePages.showNotification('Real-time connection error', 'error');
          }
        };

        ws.onclose = function () {
          console.log('WebSocket disconnected:', endpoint);
          window.databasePages.realTime.connections.delete(endpoint);
        };

        this.connections.set(endpoint, ws);
        return ws;
      } else {
        console.warn('WebSocket not supported, falling back to polling');
        return this.startPolling(endpoint, onMessage, onError);
      }
    },

    disconnect: function (endpoint) {
      const connection = this.connections.get(endpoint);
      if (connection) {
        if (connection.readyState === WebSocket.OPEN) {
          connection.close();
        }
        this.connections.delete(endpoint);
      }
    },

    disconnectAll: function () {
      this.connections.forEach((connection, endpoint) => {
        this.disconnect(endpoint);
      });
    },

    startPolling: function (endpoint, onMessage, onError, interval = 5000) {
      const pollId = setInterval(async () => {
        try {
          const data = await window.databasePages.api.get(endpoint);
          onMessage(data);
        } catch (error) {
          if (onError) {
            onError(error);
          }
        }
      }, interval);

      // Store poll ID for cleanup
      this.connections.set(endpoint, { type: 'polling', id: pollId });
      return pollId;
    },
  },

  // Chart and visualization helpers
  charts: {
    createLineChart: function (canvas, data, options = {}) {
      // Placeholder for Chart.js or similar library integration
      console.log('Line chart created:', { canvas, data, options });
    },

    createBarChart: function (canvas, data, options = {}) {
      // Placeholder for Chart.js or similar library integration
      console.log('Bar chart created:', { canvas, data, options });
    },

    createPieChart: function (canvas, data, options = {}) {
      // Placeholder for Chart.js or similar library integration
      console.log('Pie chart created:', { canvas, data, options });
    },
  },

  // Data export functionality
  exportData: function (data, filename, format = 'json') {
    let content, mimeType;

    switch (format.toLowerCase()) {
      case 'json':
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
        filename += '.json';
        break;
      case 'csv':
        content = this.convertToCSV(data);
        mimeType = 'text/csv';
        filename += '.csv';
        break;
      case 'xml':
        content = this.convertToXML(data);
        mimeType = 'application/xml';
        filename += '.xml';
        break;
      default:
        throw new Error('Unsupported export format');
    }

    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    this.showNotification(`Data exported as ${format.toUpperCase()}`, 'success');
  },

  convertToCSV: function (data) {
    if (!Array.isArray(data) || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((field) => {
            const value = row[field];
            return typeof value === 'string' && value.includes(',')
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          })
          .join(',')
      ),
    ].join('\\n');

    return csvContent;
  },

  convertToXML: function (data) {
    const xmlContent =
      '<?xml version="1.0" encoding="UTF-8"?>\\n<data>\\n' +
      data
        .map((item) => {
          const itemXml = Object.entries(item)
            .map(([key, value]) => `  <${key}>${value}</${key}>`)
            .join('\\n');
          return `<item>\\n${itemXml}\\n</item>`;
        })
        .join('\\n') +
      '\\n</data>';

    return xmlContent;
  },

  // Initialize common functionality
  init: function () {
    console.log('Database Pages Common Library Initialized');

    // Set up global error handling
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      this.showNotification('An unexpected error occurred', 'error');
    });

    // Set up unhandled promise rejection handling
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.showNotification('A network error occurred', 'error');
    });

    // Clean up connections when page unloads
    window.addEventListener('beforeunload', () => {
      this.realTime.disconnectAll();
    });

    // Initialize notification styles
    this.injectNotificationStyles();
  },

  injectNotificationStyles: function () {
    const styles = `
            .database-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                min-width: 300px;
                max-width: 500px;
                z-index: 10000;
                animation: slideIn 0.3s ease;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                border-radius: 0.75rem;
                overflow: hidden;
            }
            
            .database-notification-success { background: linear-gradient(135deg, #10b981, #059669); }
            .database-notification-error { background: linear-gradient(135deg, #ef4444, #dc2626); }
            .database-notification-warning { background: linear-gradient(135deg, #f59e0b, #d97706); }
            .database-notification-info { background: linear-gradient(135deg, #3b82f6, #2563eb); }
            
            .notification-content {
                display: flex;
                align-items: center;
                padding: 1rem 1.5rem;
                color: white;
            }
            
            .notification-icon {
                margin-right: 0.75rem;
                font-size: 1.25rem;
            }
            
            .notification-message {
                flex: 1;
                font-weight: 500;
            }
            
            .notification-close {
                background: transparent;
                border: none;
                color: white;
                cursor: pointer;
                padding: 0.25rem;
                margin-left: 0.75rem;
                opacity: 0.8;
                transition: opacity 0.2s ease;
            }
            
            .notification-close:hover {
                opacity: 1;
            }
            
            .database-loader {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 1.5rem;
                color: #667eea;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  },
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  window.databasePages.init();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.databasePages;
}
