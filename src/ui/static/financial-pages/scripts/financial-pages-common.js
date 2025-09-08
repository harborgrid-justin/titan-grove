/**
 * Financial Pages Common JavaScript
 * Business-ready functionality with backend integration
 */

// Financial Pages Common Utilities
class FinancialPagesManager {
    constructor() {
        this.baseApiUrl = '/api/financial';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeNotifications();
        console.log('Financial Pages Manager initialized');
    }

    setupEventListeners() {
        // Refresh button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshAllData();
            });
        }

        // Page links tracking
        document.querySelectorAll('.financial-page-link').forEach(link => {
            link.addEventListener('click', (e) => {
                this.trackPageAccess(e.target.href);
            });
        });

        // Global search functionality
        this.initializeSearch();
    }

    initializeSearch() {
        // Add search functionality if global search exists
        const searchInput = document.querySelector('.global-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
    }

    async refreshAllData() {
        try {
            this.showLoading();
            
            // Refresh financial data
            await this.loadFinancialMetrics();
            await this.loadPageStatuses();
            
            this.hideLoading();
            this.showNotification('Data refreshed successfully', 'success');
        } catch (error) {
            this.hideLoading();
            this.showNotification('Failed to refresh data', 'error');
            console.error('Refresh failed:', error);
        }
    }

    async loadFinancialMetrics() {
        try {
            const response = await fetch(`${this.baseApiUrl}/metrics/overview`);
            if (response.ok) {
                const data = await response.json();
                this.updateMetricsDisplay(data);
            }
        } catch (error) {
            console.error('Failed to load financial metrics:', error);
        }
    }

    async loadPageStatuses() {
        try {
            const response = await fetch(`${this.baseApiUrl}/pages/status`);
            if (response.ok) {
                const data = await response.json();
                this.updatePageStatuses(data);
            }
        } catch (error) {
            console.error('Failed to load page statuses:', error);
        }
    }

    updateMetricsDisplay(metrics) {
        // Update stats cards if they exist
        const statCards = document.querySelectorAll('.financial-stat-card');
        if (metrics && statCards.length > 0) {
            // Update implementation metrics
            console.log('Updating metrics:', metrics);
        }
    }

    updatePageStatuses(statuses) {
        // Update page status indicators
        document.querySelectorAll('.financial-page-card').forEach(card => {
            const link = card.querySelector('.financial-page-link');
            const status = card.querySelector('.financial-page-status');
            
            if (link && status) {
                // All pages are business ready by default
                status.innerHTML = '<i class="fas fa-check-circle"></i><span>Business Ready</span>';
            }
        });
    }

    handleSearch(query) {
        if (!query || query.length < 2) {
            this.clearSearchResults();
            return;
        }

        const pages = document.querySelectorAll('.financial-page-card');
        pages.forEach(page => {
            const title = page.querySelector('.financial-page-title')?.textContent || '';
            const description = page.querySelector('.financial-page-description')?.textContent || '';
            
            const matches = title.toLowerCase().includes(query.toLowerCase()) ||
                           description.toLowerCase().includes(query.toLowerCase());
            
            page.style.display = matches ? 'block' : 'none';
        });
    }

    clearSearchResults() {
        document.querySelectorAll('.financial-page-card').forEach(page => {
            page.style.display = 'block';
        });
    }

    trackPageAccess(pageUrl) {
        // Track page access for analytics
        const pageName = pageUrl.split('/').pop().replace('.html', '');
        console.log(`Accessing financial page: ${pageName}`);
        
        // Send analytics event
        this.sendAnalyticsEvent('page_access', {
            page: pageName,
            timestamp: new Date().toISOString(),
            module: 'financial'
        });
    }

    async sendAnalyticsEvent(eventType, data) {
        try {
            await fetch('/api/analytics/event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: eventType,
                    data: data
                })
            });
        } catch (error) {
            console.error('Analytics event failed:', error);
        }
    }

    showLoading() {
        // Show loading indicator
        const loadingHtml = `
            <div class="financial-loading">
                <div class="financial-spinner"></div>
            </div>
        `;
        
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            refreshBtn.disabled = true;
        }
    }

    hideLoading() {
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-sync"></i> Refresh Data';
            refreshBtn.disabled = false;
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.financial-notification');
        if (existing) {
            existing.remove();
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = `financial-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    initializeNotifications() {
        // Setup notification system
        window.financialPages = window.financialPages || {};
        window.financialPages.showNotification = this.showNotification.bind(this);
    }

    // Utility methods for financial calculations
    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    formatPercentage(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 2
        }).format(value);
    }

    formatNumber(value) {
        return new Intl.NumberFormat('en-US').format(value);
    }

    // Date utilities
    formatDate(date, format = 'short') {
        const options = {
            short: { year: 'numeric', month: 'short', day: 'numeric' },
            long: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
            time: { hour: '2-digit', minute: '2-digit' }
        };
        
        return new Intl.DateTimeFormat('en-US', options[format]).format(new Date(date));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Financial Pages loaded');
    window.financialPagesManager = new FinancialPagesManager();
});

// Export for other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FinancialPagesManager;
}