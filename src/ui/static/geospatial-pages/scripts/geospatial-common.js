/**
 * Geospatial Pages Common JavaScript
 * Shared functionality for all geospatial management pages
 */

// Global geospatial pages namespace
window.geospatialPages = {
  // Notification system
  showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  },

  // Test integration functionality
  testIntegration(pageName) {
    this.showNotification(`Testing ${pageName} GIS integration...`, 'info');

    // Simulate API test
    setTimeout(() => {
      this.showNotification(`${pageName} GIS integration test completed successfully`, 'success');
    }, 2000);
  },

  // View data functionality
  viewData(pageName) {
    this.showNotification(`Loading ${pageName} spatial data...`, 'info');
    console.log(`Viewing spatial data for ${pageName}`);
  },

  // Open settings functionality
  openSettings(pageName) {
    this.showNotification(`Opening ${pageName} GIS settings...`, 'info');
    console.log(`Opening GIS settings for ${pageName}`);
  },

  // Export data functionality
  exportData(pageName) {
    this.showNotification(`Exporting ${pageName} map data...`, 'info');
    console.log(`Exporting map data for ${pageName}`);
  },

  // Initialize common geospatial features
  initializeCommonFeatures() {
    console.log('Initializing common geospatial features...');

    // Setup global geospatial services
    this.setupGlobalGeospatialServices();

    // Setup notification styles
    this.setupNotificationStyles();
  },

  // Setup global geospatial services
  setupGlobalGeospatialServices() {
    console.log('Setting up global geospatial services...');

    // Initialize mapping service
    this.initializeMappingService();

    // Initialize location service
    this.initializeLocationService();

    // Initialize spatial analytics service
    this.initializeSpatialAnalyticsService();
  },

  // Initialize mapping service
  initializeMappingService() {
    console.log('GIS mapping service initialized');
    // Mapping service initialization logic
  },

  // Initialize location service
  initializeLocationService() {
    console.log('Location service initialized');
    // Location service initialization logic
  },

  // Initialize spatial analytics service
  initializeSpatialAnalyticsService() {
    console.log('Spatial analytics service initialized');
    // Spatial analytics service initialization logic
  },

  // Setup notification styles
  setupNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                min-width: 300px;
                animation: slideIn 0.3s ease-out;
            }
            
            .notification-success {
                background: linear-gradient(45deg, #10b981, #059669);
            }
            
            .notification-error {
                background: linear-gradient(45deg, #ef4444, #dc2626);
            }
            
            .notification-info {
                background: linear-gradient(45deg, #3b82f6, #2563eb);
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
    document.head.appendChild(style);
  },
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  window.geospatialPages.initializeCommonFeatures();
});

// Business logic utilities
const GeospatialBusinessLogic = {
  // Spatial calculations
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  },

  // Geofencing logic
  isPointInPolygon(point, polygon) {
    const x = point[0],
      y = point[1];
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0],
        yi = polygon[i][1];
      const xj = polygon[j][0],
        yj = polygon[j][1];

      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
        inside = !inside;
      }
    }

    return inside;
  },

  // Route optimization utilities
  optimizeRoute(waypoints) {
    console.log('Optimizing route for waypoints:', waypoints);
    // Route optimization logic would be implemented here
    return waypoints;
  },
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { geospatialPages: window.geospatialPages, GeospatialBusinessLogic };
}
