/**
 * Titan Grove Enterprise Dashboard JavaScript
 * Complete Oracle EBS Competitive UI System
 * Advanced Business Intelligence and Real-time Analytics
 */

class TitanEnterpriseDashboard {
    constructor() {
        this.charts = {};
        this.realTimeData = {};
        this.notifications = [];
        this.searchIndex = [];
        this.activeModule = 'dashboard';
        this.widgets = new Map();
        this.dataUpdateInterval = null;
        
        this.init();
    }

    async init() {
        console.log('🚀 Initializing Titan Grove Enterprise Dashboard...');
        
        try {
            await this.setupEventListeners();
            await this.initializeCharts();
            await this.loadInitialData();
            await this.setupRealTimeUpdates();
            await this.initializeSearch();
            await this.setupNotifications();
            await this.initializeWidgets();
            
            console.log('✅ Enterprise Dashboard Ready - Oracle EBS Alternative');
        } catch (error) {
            console.error('❌ Dashboard initialization failed:', error);
        }
    }

    setupEventListeners() {
        // Global Search
        const globalSearch = document.getElementById('globalSearch');
        if (globalSearch) {
            globalSearch.addEventListener('input', (e) => this.handleSearch(e.target.value));
            globalSearch.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.executeSearch(e.target.value);
                }
            });
        }

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e.currentTarget));
        });

        // Notifications
        const notificationBell = document.getElementById('notificationBell');
        if (notificationBell) {
            notificationBell.addEventListener('click', () => this.toggleNotifications());
        }

        // User Menu
        const userAvatar = document.getElementById('userAvatar');
        if (userAvatar) {
            userAvatar.addEventListener('click', () => this.toggleUserMenu());
        }

        // Widget Actions
        document.querySelectorAll('.widget-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleWidgetAction(e.currentTarget));
        });

        // Sidebar Navigation
        document.querySelectorAll('.nav-list-item a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSidebarNavigation(e.currentTarget);
            });
        });

        // Global Keyboard Shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Window Resize
        window.addEventListener('resize', () => this.handleResize());

        // Click outside to close dropdowns
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
    }

    async initializeCharts() {
        // Financial Performance Chart
        await this.createFinancialChart();
        
        // KPI Trend Charts
        await this.createKPITrendCharts();
        
        // Productivity Chart
        await this.createProductivityChart();
    }

    async createFinancialChart() {
        const ctx = document.getElementById('financialChart');
        if (!ctx) return;

        const financialData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Revenue',
                    data: [3200000, 3400000, 3100000, 3800000, 4200000, 3900000, 4100000, 4300000, 3800000, 4500000, 4700000, 4200000],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Costs',
                    data: [2400000, 2500000, 2300000, 2800000, 3100000, 2900000, 3000000, 3200000, 2800000, 3300000, 3400000, 3100000],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Profit',
                    data: [800000, 900000, 800000, 1000000, 1100000, 1000000, 1100000, 1100000, 1000000, 1200000, 1300000, 1100000],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }
            ]
        };

        this.charts.financial = new Chart(ctx, {
            type: 'line',
            data: financialData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: $${(context.raw / 1000000).toFixed(1)}M`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + (value / 1000000).toFixed(1) + 'M';
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    async createKPITrendCharts() {
        // Revenue Trend
        const revenueTrend = document.getElementById('revenueTrend');
        if (revenueTrend) {
            this.charts.revenueTrend = new Chart(revenueTrend, {
                type: 'line',
                data: {
                    labels: ['', '', '', '', '', '', ''],
                    datasets: [{
                        data: [42, 45, 43, 48, 47, 49, 47],
                        borderColor: '#10b981',
                        borderWidth: 2,
                        fill: false,
                        pointRadius: 0,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { display: false },
                        y: { display: false }
                    }
                }
            });
        }

        // Orders Trend
        const ordersTrend = document.getElementById('ordersTrend');
        if (ordersTrend) {
            this.charts.ordersTrend = new Chart(ordersTrend, {
                type: 'line',
                data: {
                    labels: ['', '', '', '', '', '', ''],
                    datasets: [{
                        data: [2400, 2600, 2500, 2800, 2750, 2900, 2847],
                        borderColor: '#3b82f6',
                        borderWidth: 2,
                        fill: false,
                        pointRadius: 0,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { display: false },
                        y: { display: false }
                    }
                }
            });
        }

        // Production Trend
        const productionTrend = document.getElementById('productionTrend');
        if (productionTrend) {
            this.charts.productionTrend = new Chart(productionTrend, {
                type: 'line',
                data: {
                    labels: ['', '', '', '', '', '', ''],
                    datasets: [{
                        data: [88, 92, 90, 94, 93, 96, 94],
                        borderColor: '#f59e0b',
                        borderWidth: 2,
                        fill: false,
                        pointRadius: 0,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { display: false },
                        y: { display: false }
                    }
                }
            });
        }

        // Inventory Trend
        const inventoryTrend = document.getElementById('inventoryTrend');
        if (inventoryTrend) {
            this.charts.inventoryTrend = new Chart(inventoryTrend, {
                type: 'line',
                data: {
                    labels: ['', '', '', '', '', '', ''],
                    datasets: [{
                        data: [9.2, 8.8, 9.1, 8.9, 8.5, 8.8, 8.7],
                        borderColor: '#ef4444',
                        borderWidth: 2,
                        fill: false,
                        pointRadius: 0,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { display: false },
                        y: { display: false }
                    }
                }
            });
        }
    }

    async createProductivityChart() {
        const ctx = document.getElementById('productivityChart');
        if (!ctx) return;

        this.charts.productivity = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Manufacturing', 'Quality Assurance', 'Supply Chain', 'Maintenance'],
                datasets: [{
                    data: [94.2, 98.7, 87.3, 91.8],
                    backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'],
                    borderWidth: 0,
                    cutout: '60%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                }
            }
        });
    }

    async loadInitialData() {
        // Load recent orders
        await this.loadRecentOrders();
        
        // Load notifications
        await this.loadNotifications();
        
        // Update KPIs
        await this.updateKPIs();
    }

    async loadRecentOrders() {
        const ordersTableBody = document.getElementById('ordersTableBody');
        if (!ordersTableBody) return;

        const sampleOrders = [
            {
                id: 'WO-2024-1847',
                customer: 'Ford Motor Company',
                product: 'Engine Block Assembly',
                quantity: 2500,
                value: 1247000,
                status: 'In Production',
                dueDate: '2024-02-28',
                priority: 'high'
            },
            {
                id: 'WO-2024-1848',
                customer: 'General Motors',
                product: 'Transmission Housing',
                quantity: 1800,
                value: 892400,
                status: 'Setup',
                dueDate: '2024-03-15',
                priority: 'medium'
            },
            {
                id: 'WO-2024-1849',
                customer: 'Tesla Inc.',
                product: 'Battery Module Case',
                quantity: 5000,
                value: 2100000,
                status: 'Quality Check',
                dueDate: '2024-02-25',
                priority: 'high'
            },
            {
                id: 'WO-2024-1850',
                customer: 'BMW Manufacturing',
                product: 'Cylinder Head',
                quantity: 1200,
                value: 634000,
                status: 'Scheduled',
                dueDate: '2024-03-20',
                priority: 'low'
            },
            {
                id: 'WO-2024-1851',
                customer: 'Caterpillar Inc.',
                product: 'Hydraulic Cylinder',
                quantity: 800,
                value: 1568000,
                status: 'In Production',
                dueDate: '2024-03-05',
                priority: 'high'
            }
        ];

        ordersTableBody.innerHTML = sampleOrders.map(order => `
            <tr data-order-id="${order.id}" class="animate-fade-in">
                <td><strong>${order.id}</strong></td>
                <td>${order.customer}</td>
                <td>${order.product}</td>
                <td>${order.quantity.toLocaleString()}</td>
                <td><strong>$${order.value.toLocaleString()}</strong></td>
                <td>
                    <span class="status-badge ${this.getStatusClass(order.status)}">
                        ${order.status}
                    </span>
                </td>
                <td>${this.formatDate(order.dueDate)}</td>
                <td>
                    <button class="widget-btn" onclick="titanDashboard.viewOrder('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="widget-btn" onclick="titanDashboard.editOrder('${order.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    async loadNotifications() {
        this.notifications = [
            {
                id: 1,
                type: 'critical',
                icon: 'fas fa-exclamation-circle',
                title: 'Production Line Down',
                message: 'Line C - Final Assembly has stopped due to equipment failure',
                time: new Date(Date.now() - 5 * 60 * 1000),
                read: false
            },
            {
                id: 2,
                type: 'warning',
                icon: 'fas fa-exclamation-triangle',
                title: 'Inventory Alert',
                message: 'Steel inventory below minimum threshold',
                time: new Date(Date.now() - 2 * 60 * 60 * 1000),
                read: false
            },
            {
                id: 3,
                type: 'info',
                icon: 'fas fa-info-circle',
                title: 'New Order Received',
                message: 'Large order from Ford Motor Company - $2.1M',
                time: new Date(Date.now() - 4 * 60 * 60 * 1000),
                read: false
            },
            {
                id: 4,
                type: 'success',
                icon: 'fas fa-check-circle',
                title: 'Quality Milestone',
                message: '99.8% quality rate achieved this week',
                time: new Date(Date.now() - 6 * 60 * 60 * 1000),
                read: true
            },
            {
                id: 5,
                type: 'warning',
                icon: 'fas fa-clock',
                title: 'Shipment Delay',
                message: 'Supplier ABC Corp delivery delayed by 2 days',
                time: new Date(Date.now() - 8 * 60 * 60 * 1000),
                read: false
            }
        ];

        this.updateNotificationDisplay();
    }

    updateNotificationDisplay() {
        const notificationList = document.getElementById('notificationList');
        const notificationCount = document.querySelector('.notification-count');
        
        if (!notificationList || !notificationCount) return;

        const unreadCount = this.notifications.filter(n => !n.read).length;
        notificationCount.textContent = unreadCount;
        notificationCount.style.display = unreadCount > 0 ? 'flex' : 'none';

        notificationList.innerHTML = this.notifications.map(notification => `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}" data-notification-id="${notification.id}">
                <div class="notification-icon ${notification.type}">
                    <i class="${notification.icon}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${this.timeAgo(notification.time)}</div>
                </div>
                ${!notification.read ? '<div class="notification-unread-indicator"></div>' : ''}
            </div>
        `).join('');
    }

    async updateKPIs() {
        // Simulate real-time KPI updates
        const kpis = {
            totalRevenue: { value: 47200000, change: 12.8, trend: 'up' },
            totalOrders: { value: 2847, change: 8.4, trend: 'up' },
            productionEfficiency: { value: 94.2, change: 2.1, trend: 'up' },
            inventoryTurnover: { value: 8.7, change: -1.2, trend: 'down' }
        };

        Object.entries(kpis).forEach(([key, data]) => {
            const element = document.getElementById(key);
            if (element) {
                if (key === 'totalRevenue') {
                    element.textContent = '$' + (data.value / 1000000).toFixed(1) + 'M';
                } else if (key === 'totalOrders') {
                    element.textContent = data.value.toLocaleString();
                } else if (key === 'productionEfficiency') {
                    element.textContent = data.value + '%';
                } else if (key === 'inventoryTurnover') {
                    element.textContent = data.value + 'x';
                }
            }
        });
    }

    async setupRealTimeUpdates() {
        // Simulate real-time data updates
        this.dataUpdateInterval = setInterval(() => {
            this.updateRealTimeData();
        }, 30000); // Update every 30 seconds
    }

    updateRealTimeData() {
        // Update KPI values with small variations
        this.updateKPIsWithVariation();
        
        // Update production line status
        this.updateProductionLineStatus();
        
        // Add new notifications occasionally
        if (Math.random() < 0.1) { // 10% chance
            this.addRandomNotification();
        }
    }

    updateKPIsWithVariation() {
        const variations = {
            totalRevenue: (Math.random() - 0.5) * 0.1, // ±5%
            totalOrders: Math.floor((Math.random() - 0.5) * 20), // ±10 orders
            productionEfficiency: (Math.random() - 0.5) * 2, // ±1%
            inventoryTurnover: (Math.random() - 0.5) * 0.4 // ±0.2x
        };

        Object.entries(variations).forEach(([key, variation]) => {
            const element = document.getElementById(key);
            if (element) {
                let currentValue = parseFloat(element.textContent.replace(/[^0-9.]/g, ''));
                let newValue;
                
                if (key === 'totalRevenue') {
                    newValue = Math.max(0, currentValue + variation);
                    element.textContent = '$' + newValue.toFixed(1) + 'M';
                } else if (key === 'totalOrders') {
                    newValue = Math.max(0, Math.round(currentValue + variation));
                    element.textContent = newValue.toLocaleString();
                } else if (key === 'productionEfficiency') {
                    newValue = Math.max(0, Math.min(100, currentValue + variation));
                    element.textContent = newValue.toFixed(1) + '%';
                } else if (key === 'inventoryTurnover') {
                    newValue = Math.max(0, currentValue + variation);
                    element.textContent = newValue.toFixed(1) + 'x';
                }
            }
        });
    }

    updateProductionLineStatus() {
        const lines = document.querySelectorAll('.line-item');
        lines.forEach(line => {
            const indicator = line.querySelector('.line-status-indicator');
            const efficiency = line.querySelector('.line-efficiency');
            
            if (Math.random() < 0.05) { // 5% chance of status change
                const statuses = ['running', 'maintenance', 'stopped'];
                const currentStatus = indicator.className.split(' ').pop();
                let newStatus = statuses[Math.floor(Math.random() * statuses.length)];
                
                indicator.className = `line-status-indicator ${newStatus}`;
                
                if (newStatus === 'running') {
                    efficiency.textContent = Math.floor(Math.random() * 15 + 85) + '%';
                } else if (newStatus === 'maintenance') {
                    efficiency.textContent = Math.floor(Math.random() * 30 + 20) + '%';
                } else {
                    efficiency.textContent = '0%';
                }
            }
        });
    }

    addRandomNotification() {
        const randomNotifications = [
            {
                type: 'info',
                icon: 'fas fa-info-circle',
                title: 'Order Update',
                message: 'Order WO-2024-' + Math.floor(Math.random() * 1000 + 1000) + ' has been updated'
            },
            {
                type: 'warning',
                icon: 'fas fa-exclamation-triangle',
                title: 'Maintenance Due',
                message: 'Equipment maintenance scheduled for tomorrow'
            },
            {
                type: 'success',
                icon: 'fas fa-check-circle',
                title: 'Quality Check Passed',
                message: 'Batch QC-' + Math.floor(Math.random() * 100 + 1000) + ' approved'
            }
        ];

        const newNotification = {
            id: Date.now(),
            ...randomNotifications[Math.floor(Math.random() * randomNotifications.length)],
            time: new Date(),
            read: false
        };

        this.notifications.unshift(newNotification);
        this.notifications = this.notifications.slice(0, 10); // Keep only latest 10
        this.updateNotificationDisplay();
    }

    async initializeSearch() {
        // Build search index
        this.searchIndex = [
            { type: 'module', name: 'Manufacturing', description: 'Production, MES, Quality Control', url: '#manufacturing' },
            { type: 'module', name: 'Financials', description: 'GL, AP, AR, Budgeting', url: '#financials' },
            { type: 'module', name: 'Supply Chain', description: 'Procurement, Inventory, Logistics', url: '#supply-chain' },
            { type: 'module', name: 'CRM', description: 'Customer Management, Sales, Marketing', url: '#crm' },
            { type: 'module', name: 'Human Resources', description: 'Payroll, Benefits, Performance', url: '#hr' },
            { type: 'module', name: 'Projects', description: 'Project Management, Resources, Tracking', url: '#projects' },
            { type: 'module', name: 'Analytics', description: 'BI, Reports, Dashboards', url: '#analytics' },
            { type: 'action', name: 'Create Work Order', description: 'New manufacturing work order', url: '#create-work-order' },
            { type: 'action', name: 'Purchase Order', description: 'Create new purchase order', url: '#create-purchase-order' },
            { type: 'action', name: 'Invoice', description: 'Generate customer invoice', url: '#create-invoice' },
            { type: 'report', name: 'Financial Performance', description: 'Revenue, costs, profit analysis', url: '#financial-performance' },
            { type: 'report', name: 'Production Report', description: 'Manufacturing metrics and OEE', url: '#production-report' },
            { type: 'report', name: 'Inventory Report', description: 'Stock levels and turnover', url: '#inventory-report' }
        ];
    }

    handleSearch(query) {
        if (query.length < 2) {
            document.getElementById('searchSuggestions').style.display = 'none';
            return;
        }

        const results = this.searchIndex.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8);

        const suggestionsElement = document.getElementById('searchSuggestions');
        if (results.length > 0) {
            suggestionsElement.innerHTML = results.map(result => `
                <div class="search-suggestion" data-url="${result.url}">
                    <div class="suggestion-icon">
                        <i class="fas fa-${this.getSearchIcon(result.type)}"></i>
                    </div>
                    <div class="suggestion-content">
                        <div class="suggestion-title">${result.name}</div>
                        <div class="suggestion-description">${result.description}</div>
                    </div>
                </div>
            `).join('');
            suggestionsElement.style.display = 'block';
            
            // Add click handlers
            suggestionsElement.querySelectorAll('.search-suggestion').forEach(suggestion => {
                suggestion.addEventListener('click', () => {
                    this.executeSearch(suggestion.dataset.url);
                    suggestionsElement.style.display = 'none';
                });
            });
        } else {
            suggestionsElement.style.display = 'none';
        }
    }

    executeSearch(query) {
        console.log('Executing search for:', query);
        // Implement search navigation logic here
    }

    getSearchIcon(type) {
        const icons = {
            module: 'cube',
            action: 'plus-circle',
            report: 'chart-bar',
            default: 'search'
        };
        return icons[type] || icons.default;
    }

    setupNotifications() {
        // Mark notification as read when clicked
        document.addEventListener('click', (e) => {
            if (e.target.closest('.notification-item')) {
                const notificationId = parseInt(e.target.closest('.notification-item').dataset.notificationId);
                this.markNotificationAsRead(notificationId);
            }
        });

        // Mark all as read
        document.addEventListener('click', (e) => {
            if (e.target.closest('.mark-all-read')) {
                this.markAllNotificationsAsRead();
            }
        });
    }

    markNotificationAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            this.updateNotificationDisplay();
        }
    }

    markAllNotificationsAsRead() {
        this.notifications.forEach(notification => {
            notification.read = true;
        });
        this.updateNotificationDisplay();
    }

    toggleNotifications() {
        const dropdown = document.getElementById('notificationDropdown');
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }
    }

    toggleUserMenu() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }
    }

    handleNavigation(navItem) {
        const module = navItem.dataset.module;
        if (module) {
            // Remove active class from all nav items
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked item
            navItem.classList.add('active');
            
            // Update active module
            this.activeModule = module;
            
            // Load module content (placeholder for now)
            console.log(`Loading ${module} module...`);
        }
    }

    handleSidebarNavigation(link) {
        const href = link.getAttribute('href');
        console.log(`Navigating to ${href}`);
        
        // Remove active class from all sidebar items
        document.querySelectorAll('.nav-list-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked item
        link.closest('.nav-list-item').classList.add('active');
    }

    handleWidgetAction(button) {
        const widget = button.closest('.dashboard-widget');
        const action = button.textContent.trim() || button.getAttribute('title');
        
        console.log(`Widget action: ${action} on widget:`, widget.dataset.widget);
        
        // Implement specific widget actions
        if (action.includes('Export')) {
            this.exportWidget(widget);
        } else if (action.includes('Full Screen')) {
            this.toggleFullScreen(widget);
        } else if (action.includes('Alert')) {
            this.showAlertDetails();
        }
    }

    exportWidget(widget) {
        const widgetType = widget.dataset.widget;
        console.log(`Exporting ${widgetType} widget...`);
        // Implement export functionality
    }

    toggleFullScreen(widget) {
        widget.classList.toggle('fullscreen');
        if (widget.classList.contains('fullscreen')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    showAlertDetails() {
        console.log('Showing supply chain alert details...');
        // Implement alert details modal
    }

    handleKeyboardShortcuts(e) {
        // Ctrl+K for search
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            document.getElementById('globalSearch').focus();
        }
        
        // Escape to close dropdowns
        if (e.key === 'Escape') {
            document.getElementById('notificationDropdown').style.display = 'none';
            document.getElementById('userDropdown').style.display = 'none';
            document.getElementById('searchSuggestions').style.display = 'none';
        }
    }

    handleResize() {
        // Resize charts
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.resize();
            }
        });
    }

    handleOutsideClick(e) {
        // Close dropdowns when clicking outside
        if (!e.target.closest('.titan-notifications')) {
            document.getElementById('notificationDropdown').style.display = 'none';
        }
        
        if (!e.target.closest('.titan-user-menu')) {
            document.getElementById('userDropdown').style.display = 'none';
        }
        
        if (!e.target.closest('.titan-global-search')) {
            document.getElementById('searchSuggestions').style.display = 'none';
        }
    }

    async initializeWidgets() {
        // Initialize draggable/resizable widgets (future feature)
        console.log('Initializing enterprise widgets...');
    }

    // Utility Methods
    getStatusClass(status) {
        const statusMap = {
            'In Production': 'success',
            'Setup': 'warning',
            'Quality Check': 'info',
            'Scheduled': 'info',
            'Completed': 'success',
            'Cancelled': 'error'
        };
        return statusMap[status] || 'info';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    timeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    }

    // Public API Methods
    viewOrder(orderId) {
        console.log(`Viewing order: ${orderId}`);
        // Implement order detail view
    }

    editOrder(orderId) {
        console.log(`Editing order: ${orderId}`);
        // Implement order edit functionality
    }

    destroy() {
        if (this.dataUpdateInterval) {
            clearInterval(this.dataUpdateInterval);
        }
        
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
    }
}

// Initialize Dashboard when DOM is loaded
let titanDashboard;

document.addEventListener('DOMContentLoaded', function() {
    titanDashboard = new TitanEnterpriseDashboard();
    
    // Make it globally accessible for debugging
    window.titanDashboard = titanDashboard;
});

// Handle page unload
window.addEventListener('beforeunload', function() {
    if (titanDashboard) {
        titanDashboard.destroy();
    }
});