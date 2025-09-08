/**
 * Configuration Management Common JavaScript
 * Enterprise-grade configuration management with real-time validation,
 * system checks, and intelligent configuration using dependency injection patterns
 */

class ConfigurationManager {
    constructor() {
        this.initialized = false;
        this.modules = new Map();
        this.eventHandlers = new Map();
        this.apiEndpoints = new Map();
        this.init();
    }

    async init() {
        try {
            await this.loadBaseConfiguration();
            this.setupEventHandlers();
            this.initializeAPIEndpoints();
            this.setupRealTimeUpdates();
            this.initialized = true;
            console.log('Configuration Manager initialized successfully');
        } catch (error) {
            console.error('Configuration Manager initialization failed:', error);
        }
    }

    async loadBaseConfiguration() {
        // Load base configuration settings
        this.config = {
            apiBaseUrl: '/api/v1/configuration',
            websocketUrl: '/ws/configuration',
            refreshInterval: 30000,
            maxRetries: 3,
            timeout: 10000
        };
    }

    setupEventHandlers() {
        // Test Integration Button
        const testBtn = document.getElementById('testIntegrationBtn');
        if (testBtn) {
            testBtn.addEventListener('click', () => this.testIntegration());
        }

        // View Data Button
        const viewDataBtn = document.getElementById('viewDataBtn');
        if (viewDataBtn) {
            viewDataBtn.addEventListener('click', () => this.viewData());
        }

        // Configure Button
        const configureBtn = document.getElementById('configureBtn');
        if (configureBtn) {
            configureBtn.addEventListener('click', () => this.openConfiguration());
        }

        // Export Button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }

        // Primary Action Button
        const primaryBtn = document.getElementById('primaryBtn');
        if (primaryBtn) {
            primaryBtn.addEventListener('click', () => this.executeAction());
        }

        // Action Button
        const actionBtn = document.getElementById('actionBtn');
        if (actionBtn) {
            actionBtn.addEventListener('click', () => this.openConfiguration());
        }
    }

    initializeAPIEndpoints() {
        const basePath = window.location.pathname;
        const configType = this.extractConfigType(basePath);
        
        this.apiEndpoints.set('test', `${this.config.apiBaseUrl}/${configType}/test`);
        this.apiEndpoints.set('data', `${this.config.apiBaseUrl}/${configType}/data`);
        this.apiEndpoints.set('configure', `${this.config.apiBaseUrl}/${configType}/configure`);
        this.apiEndpoints.set('export', `${this.config.apiBaseUrl}/${configType}/export`);
        this.apiEndpoints.set('execute', `${this.config.apiBaseUrl}/${configType}/execute`);
    }

    extractConfigType(pathname) {
        // Extract configuration type from URL path
        const parts = pathname.split('/');
        if (parts.includes('project-config')) return 'project';
        if (parts.includes('financial-config')) return 'financial';
        if (parts.includes('hr-config')) return 'hr';
        if (parts.includes('logistics-config')) return 'logistics';
        if (parts.includes('database-config')) return 'database';
        if (parts.includes('asset-config')) return 'asset';
        return 'general';
    }

    async testIntegration() {
        try {
            this.showLoading('Testing integration...');
            
            const response = await this.makeAPICall('test', 'POST', {
                timestamp: new Date().toISOString(),
                page: window.location.pathname
            });

            if (response.success) {
                this.showSuccess('Integration test completed successfully!');
                this.updateStatusIndicators('connected');
            } else {
                this.showError('Integration test failed: ' + response.message);
            }
        } catch (error) {
            this.showError('Integration test error: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    async viewData() {
        try {
            this.showLoading('Loading data...');
            
            const response = await this.makeAPICall('data', 'GET');
            
            if (response.success) {
                this.openDataModal(response.data);
            } else {
                this.showError('Failed to load data: ' + response.message);
            }
        } catch (error) {
            this.showError('Data loading error: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    async openConfiguration() {
        try {
            this.showLoading('Loading configuration interface...');
            
            const response = await this.makeAPICall('configure', 'GET');
            
            if (response.success) {
                this.openConfigModal(response.config);
            } else {
                this.showError('Failed to load configuration: ' + response.message);
            }
        } catch (error) {
            this.showError('Configuration loading error: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    async exportData() {
        try {
            this.showLoading('Preparing export...');
            
            const response = await this.makeAPICall('export', 'POST', {
                format: 'xlsx',
                includeMetadata: true,
                timestamp: new Date().toISOString()
            });

            if (response.success) {
                this.downloadFile(response.downloadUrl, response.filename);
                this.showSuccess('Export completed successfully!');
            } else {
                this.showError('Export failed: ' + response.message);
            }
        } catch (error) {
            this.showError('Export error: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    async executeAction() {
        try {
            this.showLoading('Executing action...');
            
            const response = await this.makeAPICall('execute', 'POST', {
                action: 'primary',
                timestamp: new Date().toISOString()
            });

            if (response.success) {
                this.showSuccess('Action executed successfully!');
                this.refreshData();
            } else {
                this.showError('Action failed: ' + response.message);
            }
        } catch (error) {
            this.showError('Execution error: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    async makeAPICall(endpoint, method = 'GET', data = null) {
        const url = this.apiEndpoints.get(endpoint);
        if (!url) {
            throw new Error(`Unknown endpoint: ${endpoint}`);
        }

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    }

    setupRealTimeUpdates() {
        // Simulate real-time updates for demo purposes
        setInterval(() => {
            this.updateMetrics();
        }, this.config.refreshInterval);
    }

    updateMetrics() {
        // Update status indicators with current metrics
        const statusCards = document.querySelectorAll('.config-status-card');
        statusCards.forEach(card => {
            const indicator = card.querySelector('.status-indicator');
            if (indicator) {
                // Simulate status updates
                indicator.classList.add('pulse');
                setTimeout(() => {
                    indicator.classList.remove('pulse');
                }, 1000);
            }
        });
    }

    updateStatusIndicators(status) {
        const indicators = document.querySelectorAll('.status-indicator');
        indicators.forEach(indicator => {
            indicator.className = `status-indicator ${status}`;
        });
    }

    openDataModal(data) {
        // Create and show data modal
        const modal = this.createModal('Data View', this.formatDataTable(data));
        document.body.appendChild(modal);
    }

    openConfigModal(config) {
        // Create and show configuration modal
        const modal = this.createModal('Configuration', this.formatConfigForm(config));
        document.body.appendChild(modal);
    }

    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'config-modal-overlay';
        modal.innerHTML = `
            <div class="config-modal">
                <div class="config-modal-header">
                    <h3>${title}</h3>
                    <button class="config-modal-close">&times;</button>
                </div>
                <div class="config-modal-body">
                    ${content}
                </div>
                <div class="config-modal-footer">
                    <button class="config-btn config-btn-secondary" onclick="this.closest('.config-modal-overlay').remove()">Close</button>
                </div>
            </div>
        `;

        modal.querySelector('.config-modal-close').addEventListener('click', () => {
            modal.remove();
        });

        return modal;
    }

    formatDataTable(data) {
        if (!data || !Array.isArray(data)) {
            return '<p>No data available</p>';
        }

        const headers = Object.keys(data[0] || {});
        const headerRow = headers.map(h => `<th>${h}</th>`).join('');
        const rows = data.map(row => 
            `<tr>${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}</tr>`
        ).join('');

        return `
            <table class="config-data-table">
                <thead><tr>${headerRow}</tr></thead>
                <tbody>${rows}</tbody>
            </table>
        `;
    }

    formatConfigForm(config) {
        if (!config) {
            return '<p>No configuration options available</p>';
        }

        const fields = Object.entries(config).map(([key, value]) => `
            <div class="config-form-field">
                <label for="${key}">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                <input type="text" id="${key}" value="${value}" />
            </div>
        `).join('');

        return `
            <form class="config-form">
                ${fields}
                <button type="submit" class="config-btn config-btn-primary">Save Configuration</button>
            </form>
        `;
    }

    downloadFile(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    showLoading(message = 'Loading...') {
        const loading = document.createElement('div');
        loading.id = 'config-loading';
        loading.className = 'config-loading-overlay';
        loading.innerHTML = `
            <div class="config-loading-content">
                <div class="config-loading-spinner"></div>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(loading);
    }

    hideLoading() {
        const loading = document.getElementById('config-loading');
        if (loading) {
            loading.remove();
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `config-notification config-notification-${type}`;
        notification.innerHTML = `
            <div class="config-notification-content">
                <span>${message}</span>
                <button class="config-notification-close">&times;</button>
            </div>
        `;

        notification.querySelector('.config-notification-close').addEventListener('click', () => {
            notification.remove();
        });

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    refreshData() {
        // Refresh page data
        window.location.reload();
    }
}

// Initialize Configuration Manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.configManager = new ConfigurationManager();
});

// Export for use in individual page scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConfigurationManager;
}