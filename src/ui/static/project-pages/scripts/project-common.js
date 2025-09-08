// Project Pages Common JavaScript - Titan Grove Enterprise
// Shared functionality for all project execution pages

class ProjectCommon {
    constructor() {
        this.initialized = false;
        this.config = {
            baseApiUrl: '/api/v1/projects',
            version: '1.0.0',
            features: {
                realTimeUpdates: true,
                autoSave: true,
                offlineMode: false
            }
        };
        this.notifications = [];
        this.activeConnections = new Map();
    }

    async initialize() {
        if (this.initialized) return;
        
        try {
            await this.loadGlobalConfiguration();
            this.setupGlobalEventListeners();
            this.initializeNotificationSystem();
            this.startHealthMonitoring();
            this.initialized = true;
            console.log('Project Common initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Project Common:', error);
            throw error;
        }
    }

    async loadGlobalConfiguration() {
        try {
            const response = await fetch('/api/v1/config/project-pages');
            if (response.ok) {
                const config = await response.json();
                this.config = { ...this.config, ...config };
            }
        } catch (error) {
            console.warn('Failed to load global configuration, using defaults:', error);
        }
    }

    setupGlobalEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        this.triggerSave();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.refreshCurrentPage();
                        break;
                    case '/':
                        e.preventDefault();
                        this.focusGlobalSearch();
                        break;
                }
            }
        });

        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-project-navigation]')) {
                e.preventDefault();
                this.handleNavigation(e.target.getAttribute('data-project-navigation'));
            }
        });

        // Handle form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.matches('.project-form')) {
                e.preventDefault();
                this.handleFormSubmission(e.target);
            }
        });
    }

    initializeNotificationSystem() {
        // Create notification container if it doesn't exist
        if (!document.getElementById('project-notifications')) {
            const container = document.createElement('div');
            container.id = 'project-notifications';
            container.className = 'project-notifications-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                max-width: 400px;
            `;
            document.body.appendChild(container);
        }
    }

    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `project-notification project-notification-${type}`;
        notification.style.cssText = `
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            margin-bottom: 0.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        const icon = this.getNotificationIcon(type);
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
            <button class="close-notification" style="
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                margin-left: auto;
                opacity: 0.7;
            ">
                <i class="fas fa-times"></i>
            </button>
        `;

        const container = document.getElementById('project-notifications');
        container.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Handle close button
        notification.querySelector('.close-notification').addEventListener('click', () => {
            this.removeNotification(notification);
        });

        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                this.removeNotification(notification);
            }, duration);
        }

        this.notifications.push(notification);
        return notification;
    }

    removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        }, 300);
    }

    getNotificationColor(type) {
        const colors = {
            info: '#3b82f6',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444'
        };
        return colors[type] || colors.info;
    }

    getNotificationIcon(type) {
        const icons = {
            info: 'fa-info-circle',
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            error: 'fa-times-circle'
        };
        return icons[type] || icons.info;
    }

    async apiRequest(endpoint, options = {}) {
        const url = endpoint.startsWith('http') ? endpoint : `${this.config.baseApiUrl}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        };

        const requestOptions = { ...defaultOptions, ...options };
        
        try {
            const response = await fetch(url, requestOptions);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return await response.text();
        } catch (error) {
            console.error('API Request failed:', error);
            this.showNotification(`API Error: ${error.message}`, 'error');
            throw error;
        }
    }

    async triggerSave() {
        // Trigger save on current page if it has a save method
        if (window.currentPageManager && typeof window.currentPageManager.save === 'function') {
            try {
                await window.currentPageManager.save();
                this.showNotification('Data saved successfully', 'success');
            } catch (error) {
                this.showNotification('Failed to save data', 'error');
            }
        }
    }

    refreshCurrentPage() {
        if (window.currentPageManager && typeof window.currentPageManager.refresh === 'function') {
            window.currentPageManager.refresh();
        } else {
            window.location.reload();
        }
    }

    focusGlobalSearch() {
        const searchInput = document.querySelector('#pmGlobalSearch, .global-search-input');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }

    handleNavigation(url) {
        // Handle client-side navigation
        window.location.href = url;
    }

    async handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        try {
            const endpoint = form.getAttribute('data-endpoint') || '/submit';
            const method = form.getAttribute('method') || 'POST';
            
            await this.apiRequest(endpoint, {
                method: method,
                body: JSON.stringify(data)
            });
            
            this.showNotification('Form submitted successfully', 'success');
        } catch (error) {
            this.showNotification('Form submission failed', 'error');
        }
    }

    startHealthMonitoring() {
        // Monitor API health
        setInterval(async () => {
            try {
                await this.apiRequest('/health');
            } catch (error) {
                console.warn('Health check failed:', error);
            }
        }, 60000); // Check every minute
    }

    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        
        return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(new Date(date));
    }

    formatNumber(number, options = {}) {
        return new Intl.NumberFormat('en-US', options).format(number);
    }

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

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    generateId() {
        return 'project_' + Math.random().toString(36).substr(2, 9);
    }

    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    validateRequired(value) {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    }

    sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    exportToCSV(data, filename = 'export.csv') {
        const csv = this.convertToCSV(data);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    convertToCSV(data) {
        if (!Array.isArray(data) || data.length === 0) {
            return '';
        }

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => {
                const value = row[header];
                return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
            }).join(','))
        ].join('\n');

        return csvContent;
    }

    // Storage utilities
    saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(`project_${key}`, JSON.stringify(data));
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
        }
    }

    loadFromLocalStorage(key) {
        try {
            const data = localStorage.getItem(`project_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.warn('Failed to load from localStorage:', error);
            return null;
        }
    }

    removeFromLocalStorage(key) {
        try {
            localStorage.removeItem(`project_${key}`);
        } catch (error) {
            console.warn('Failed to remove from localStorage:', error);
        }
    }
}

// Create global instance
window.ProjectCommon = new ProjectCommon();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    await window.ProjectCommon.initialize();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectCommon;
}