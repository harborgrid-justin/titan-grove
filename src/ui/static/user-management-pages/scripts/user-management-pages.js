// User Management Pages Common JavaScript
// Provides shared functionality for all user management pages

window.userManagement = window.userManagement || {
  initialized: false,

  // Initialize common functionality
  init: function () {
    if (this.initialized) return;

    console.log('Initializing User Management system...');

    // Set up global event listeners
    this.setupGlobalListeners();

    // Initialize notifications system
    this.initNotifications();

    // Set up real-time updates
    this.setupRealTimeUpdates();

    this.initialized = true;
    console.log('User Management system initialized successfully');
  },

  // Set up global event listeners
  setupGlobalListeners: function () {
    // Handle back button functionality
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        history.back();
      }
    });

    // Handle action button clicks
    document.addEventListener('click', function (e) {
      if (e.target.matches('#actionBtn, #primaryBtn')) {
        e.preventDefault();
        window.userManagement.handleGlobalAction(e.target.id);
      }
    });
  },

  // Initialize notifications system
  initNotifications: function () {
    // Create notifications container if it doesn't exist
    if (!document.getElementById('notifications-container')) {
      const container = document.createElement('div');
      container.id = 'notifications-container';
      container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            `;
      document.body.appendChild(container);
    }
  },

  // Set up real-time updates
  setupRealTimeUpdates: function () {
    // Simulate real-time updates with periodic refresh
    setInterval(() => {
      this.updateSystemStatus();
    }, 30000); // Update every 30 seconds
  },

  // Update system status
  updateSystemStatus: function () {
    const statusElements = document.querySelectorAll('.user-management-stat-value');
    statusElements.forEach((element) => {
      // Add a subtle animation to indicate data refresh
      element.style.transition = 'opacity 0.3s';
      element.style.opacity = '0.7';
      setTimeout(() => {
        element.style.opacity = '1';
      }, 300);
    });
  },

  // Handle global actions
  handleGlobalAction: function (buttonId) {
    switch (buttonId) {
      case 'actionBtn':
        this.showNotification('Configuration mode activated', 'info');
        break;
      case 'primaryBtn':
        this.showNotification('Execution started', 'success');
        break;
    }
  },

  // Show notification
  showNotification: function (message, type = 'info', duration = 3000) {
    const container = document.getElementById('notifications-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            margin-bottom: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: slideInRight 0.3s ease-out;
            pointer-events: auto;
            cursor: pointer;
            font-weight: 500;
            max-width: 300px;
            word-wrap: break-word;
        `;

    // Add click to dismiss
    notification.addEventListener('click', () => {
      this.dismissNotification(notification);
    });

    container.appendChild(notification);

    // Auto dismiss after duration
    setTimeout(() => {
      this.dismissNotification(notification);
    }, duration);
  },

  // Get notification color based on type
  getNotificationColor: function (type) {
    const colors = {
      success: '#48bb78',
      error: '#f56565',
      warning: '#ed8936',
      info: '#4299e1',
    };
    return colors[type] || colors.info;
  },

  // Dismiss notification
  dismissNotification: function (notification) {
    if (!notification || !notification.parentNode) return;

    notification.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  },

  // Export data functionality
  exportData: function (pageType) {
    this.showNotification(`Exporting ${pageType} data...`, 'info');

    // Simulate export process
    setTimeout(() => {
      this.showNotification(`${pageType} data exported successfully`, 'success');
    }, 2000);
  },

  // Common API call wrapper
  apiCall: async function (endpoint, method = 'GET', data = null) {
    try {
      const options = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      };

      if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(endpoint, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      this.showNotification('API call failed. Please try again.', 'error');
      throw error;
    }
  },

  // Format numbers for display
  formatNumber: function (number) {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + 'M';
    }
    if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'K';
    }
    return number.toString();
  },

  // Format date for display
  formatDate: function (date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  },

  // Debounce function for search and input handlers
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
};

// CSS animations for notifications
const notificationStyles = `
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  window.userManagement.init();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.userManagement;
}
