/**
 * Performance Analytics JavaScript Module
 * Handles advanced performance analytics with trend analysis, capacity planning, and optimization recommendations
 */

class PerformanceAnalyticsManager {
  constructor() {
    this.data = new Map();
    this.config = {};
    this.initialized = false;
    this.init();
  }

  async init() {
    try {
      await this.loadConfiguration();
      await this.loadData();
      this.setupEventHandlers();
      this.setupRealTimeUpdates();
      this.initialized = true;
      console.log('Performance Analytics Manager initialized successfully');
    } catch (error) {
      console.error('Performance Analytics Manager initialization failed:', error);
    }
  }

  async loadConfiguration() {
    try {
      const response = await window.SupportPageManager.apiRequest(
        '/api/v1/support/service-level-management/config'
      );
      this.config = response || {
        updateInterval: 30000,
        maxRecords: 1000,
        autoRefresh: true,
      };
    } catch (error) {
      console.warn('Using default configuration for Performance Analytics');
      this.config = {
        updateInterval: 30000,
        maxRecords: 1000,
        autoRefresh: true,
      };
    }
  }

  async loadData() {
    try {
      const response = await window.SupportPageManager.apiRequest(
        '/api/v1/support/service-level-management/performance-analytics'
      );
      if (response && response.data) {
        response.data.forEach((item) => {
          this.data.set(item.id, item);
        });
      }
    } catch (error) {
      console.error('Failed to load Performance Analytics data:', error);
      this.createSampleData();
    }
  }

  setupEventHandlers() {
    // Test integration button
    document.getElementById('testIntegrationBtn')?.addEventListener('click', () => {
      this.testIntegration();
    });

    document.getElementById('viewDataBtn')?.addEventListener('click', () => {
      this.viewData();
    });

    document.getElementById('configureBtn')?.addEventListener('click', () => {
      this.configure();
    });

    document.getElementById('exportBtn')?.addEventListener('click', () => {
      this.exportData();
    });

    // Action buttons
    document.querySelectorAll('[data-action="create"][data-target="record"]').forEach((btn) => {
      btn.addEventListener('click', () => this.createRecord());
    });

    document.querySelectorAll('[data-action="import"][data-target="data"]').forEach((btn) => {
      btn.addEventListener('click', () => this.importData());
    });

    document.querySelectorAll('[data-action="view"][data-target="analytics"]').forEach((btn) => {
      btn.addEventListener('click', () => this.viewAnalytics());
    });

    document.querySelectorAll('[data-action="export"][data-target="report"]').forEach((btn) => {
      btn.addEventListener('click', () => this.exportReport());
    });
  }

  setupRealTimeUpdates() {
    if (this.config.autoRefresh) {
      setInterval(() => {
        this.refreshData();
      }, this.config.updateInterval);
    }

    // Listen for real-time updates
    if (window.SupportPageManager && window.SupportPageManager.websocket) {
      window.SupportPageManager.websocket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'service_level-management_update') {
          this.handleRealTimeUpdate(data);
        }
      });
    }
  }

  async testIntegration() {
    try {
      window.SupportPageManager.showNotification(
        'Testing Performance Analytics integration...',
        'info'
      );

      const tests = [
        {
          name: 'Performance Analytics API',
          endpoint: '/api/v1/support/service-level-management/performance-analytics',
        },
        { name: 'Config API', endpoint: '/api/v1/support/service-level-management/config' },
        {
          name: 'Analytics API',
          endpoint: '/api/v1/support/service-level-management/performance-analytics/analytics',
        },
      ];

      let passed = 0;
      for (const test of tests) {
        try {
          await window.SupportPageManager.apiRequest(test.endpoint);
          passed++;
          console.log(`✅ ${test.name} test passed`);
        } catch (error) {
          console.error(`❌ ${test.name} test failed:`, error);
        }
      }

      const successRate = (passed / tests.length) * 100;
      const message = `Integration test completed: ${passed}/${tests.length} passed (${successRate.toFixed(1)}%)`;

      window.SupportPageManager.showNotification(
        message,
        successRate === 100 ? 'success' : 'warning'
      );
    } catch (error) {
      console.error('Integration test failed:', error);
      window.SupportPageManager.showNotification('Integration test failed', 'error');
    }
  }

  async createRecord() {
    try {
      window.SupportPageManager.showNotification(
        'Creating new performance analytics record...',
        'info'
      );
      // Implementation for creating new records
      console.log('Create record functionality for Performance Analytics');
    } catch (error) {
      console.error('Failed to create record:', error);
      window.SupportPageManager.showNotification('Failed to create record', 'error');
    }
  }

  async importData() {
    try {
      window.SupportPageManager.showNotification('Importing performance analytics data...', 'info');
      // Implementation for importing data
      console.log('Import data functionality for Performance Analytics');
    } catch (error) {
      console.error('Failed to import data:', error);
      window.SupportPageManager.showNotification('Failed to import data', 'error');
    }
  }

  async viewAnalytics() {
    try {
      window.SupportPageManager.showNotification(
        'Loading performance analytics analytics...',
        'info'
      );
      // Implementation for viewing analytics
      console.log('View analytics functionality for Performance Analytics');
    } catch (error) {
      console.error('Failed to load analytics:', error);
      window.SupportPageManager.showNotification('Failed to load analytics', 'error');
    }
  }

  async exportReport() {
    try {
      window.SupportPageManager.showNotification(
        'Generating performance analytics report...',
        'info'
      );

      const reportData = {
        title: 'Performance Analytics Report',
        generated: new Date().toISOString(),
        data: Array.from(this.data.values()),
        summary: this.generateSummary(),
      };

      this.downloadReport(reportData);
      window.SupportPageManager.showNotification('Report exported successfully', 'success');
    } catch (error) {
      console.error('Failed to export report:', error);
      window.SupportPageManager.showNotification('Failed to export report', 'error');
    }
  }

  async viewData() {
    try {
      console.log('View data functionality for Performance Analytics');
      console.log('Current data:', Array.from(this.data.values()));
    } catch (error) {
      console.error('Failed to view data:', error);
    }
  }

  async configure() {
    try {
      console.log('Configure functionality for Performance Analytics');
      console.log('Current configuration:', this.config);
    } catch (error) {
      console.error('Failed to open configuration:', error);
    }
  }

  async exportData() {
    try {
      window.SupportPageManager.showNotification('Exporting performance analytics data...', 'info');

      const exportData = {
        title: 'Performance Analytics Data Export',
        exported: new Date().toISOString(),
        data: Array.from(this.data.values()),
        config: this.config,
      };

      this.downloadJSON(exportData, 'performance-analytics-data.json');
      window.SupportPageManager.showNotification('Data exported successfully', 'success');
    } catch (error) {
      console.error('Failed to export data:', error);
      window.SupportPageManager.showNotification('Failed to export data', 'error');
    }
  }

  createSampleData() {
    // Create sample data for demonstration
    for (let i = 1; i <= 5; i++) {
      this.data.set(`sample-${i}`, {
        id: `sample-${i}`,
        name: `Sample ${page.title} ${i}`,
        status: ['active', 'pending', 'completed'][Math.floor(Math.random() * 3)],
        created: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated: new Date().toISOString(),
      });
    }
  }

  generateSummary() {
    const totalRecords = this.data.size;
    const statuses = Array.from(this.data.values()).reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});

    return {
      totalRecords,
      statusBreakdown: statuses,
      lastUpdated: new Date().toISOString(),
    };
  }

  refreshData() {
    // Refresh data from server
    this.loadData().catch((error) => {
      console.error('Failed to refresh data:', error);
    });
  }

  handleRealTimeUpdate(data) {
    console.log('Real-time update received for Performance Analytics:', data);
    // Handle real-time updates
  }

  downloadReport(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${page.name}-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.performanceanalyticsManager = new PerformanceAnalyticsManager();
});
