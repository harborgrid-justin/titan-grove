/**
 * Titan Grove Manufacturing Excellence System JavaScript
 * Complete Manufacturing Execution System (MES) and Production Management
 * Oracle EBS Manufacturing Competitive System
 */

class TitanManufacturingSystem {
    constructor() {
        this.charts = {};
        this.productionData = {};
        this.workOrders = [];
        this.equipmentStatus = {};
        this.qualityMetrics = {};
        this.realTimeInterval = null;
        this.productionLines = new Map();
        
        this.init();
    }

    async init() {
        console.log('🏭 Initializing Titan Manufacturing Excellence System...');
        
        try {
            await this.setupEventListeners();
            await this.initializeCharts();
            await this.loadProductionData();
            await this.loadWorkOrders();
            await this.loadEquipmentStatus();
            await this.initializeQualitySystem();
            await this.setupRealTimeMonitoring();
            
            console.log('✅ Manufacturing System Ready - Oracle EBS Alternative');
        } catch (error) {
            console.error('❌ Manufacturing system initialization failed:', error);
        }
    }

    setupEventListeners() {
        // Widget action handlers
        document.querySelectorAll('.widget-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleWidgetAction(e.currentTarget));
        });

        // Sidebar navigation
        document.querySelectorAll('.nav-list-item a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSidebarNavigation(e.currentTarget);
            });
        });

        // Filter controls
        document.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', (e) => this.handleFilterChange(e.currentTarget));
        });

        // Time period selectors
        document.querySelectorAll('.time-period-select').forEach(select => {
            select.addEventListener('change', (e) => this.handleTimePeriodChange(e.currentTarget));
        });

        // Production line card interactions
        document.querySelectorAll('.production-line-card').forEach(card => {
            card.addEventListener('click', () => this.showLineDetails(card));
        });
    }

    async initializeCharts() {
        await Promise.all([
            this.createProductionChart(),
            this.createOEEGauge(),
            this.createCycleTimeChart(),
            this.createProductionLineCharts(),
            this.createQualityTrendChart(),
            this.createCapacityChart()
        ]);
    }

    async createProductionChart() {
        const ctx = document.getElementById('productionChart');
        if (!ctx) return;

        const productionData = this.generateProductionTrendData();
        
        this.charts.production = new Chart(ctx, {
            type: 'line',
            data: {
                labels: productionData.labels,
                datasets: [{
                    data: productionData.values,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                    fill: true,
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
                },
                interaction: { intersect: false }
            }
        });
    }

    async createOEEGauge() {
        const ctx = document.getElementById('oeeGauge');
        if (!ctx) return;

        const oeeValue = 87.3;
        
        this.charts.oeeGauge = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [oeeValue, 100 - oeeValue],
                    backgroundColor: [
                        this.getOEEColor(oeeValue),
                        'rgba(226, 232, 240, 0.3)'
                    ],
                    borderWidth: 0,
                    cutout: '70%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            },
            plugins: [{
                id: 'centerText',
                beforeDraw: (chart) => {
                    const { ctx, width, height } = chart;
                    ctx.restore();
                    const fontSize = Math.min(width, height) * 0.15;
                    ctx.font = `${fontSize}px Inter`;
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#0f172a';
                    
                    const text = `${oeeValue}%`;
                    const textX = Math.round((width - ctx.measureText(text).width) / 2);
                    const textY = height / 2;
                    
                    ctx.fillText(text, textX, textY);
                    ctx.save();
                }
            }]
        });
    }

    async createCycleTimeChart() {
        const ctx = document.getElementById('cycleTimeChart');
        if (!ctx) return;

        const cycleTimeData = this.generateCycleTimeData();
        
        this.charts.cycleTime = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: cycleTimeData.labels,
                datasets: [{
                    data: cycleTimeData.values,
                    backgroundColor: 'rgba(245, 158, 11, 0.7)',
                    borderColor: '#f59e0b',
                    borderWidth: 1,
                    borderRadius: 2
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

    async createProductionLineCharts() {
        const lineCharts = ['lineAChart', 'lineBChart', 'lineDChart'];
        
        for (const chartId of lineCharts) {
            const ctx = document.getElementById(chartId);
            if (!ctx) continue;

            const lineData = this.generateLineProductionData();
            
            this.charts[chartId] = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: lineData.labels,
                    datasets: [{
                        data: lineData.values,
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        borderWidth: 2,
                        fill: true,
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

    async createQualityTrendChart() {
        const ctx = document.getElementById('qualityTrendChart');
        if (!ctx) return;

        const qualityData = this.generateQualityTrendData();
        
        this.charts.qualityTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: qualityData.labels,
                datasets: [{
                    data: qualityData.values,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    pointRadius: 2,
                    pointBackgroundColor: '#10b981',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: {
                        display: false,
                        min: 95,
                        max: 100
                    }
                }
            }
        });
    }

    async createCapacityChart() {
        const ctx = document.getElementById('capacityChart');
        if (!ctx) return;

        const capacityData = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'Planned Capacity',
                    data: [85, 87, 84, 89, 91, 76, 52],
                    backgroundColor: 'rgba(37, 99, 235, 0.3)',
                    borderColor: '#2563eb',
                    borderWidth: 2
                },
                {
                    label: 'Actual Utilization',
                    data: [88, 84, 87, 92, 89, 78, 55],
                    backgroundColor: 'rgba(16, 185, 129, 0.3)',
                    borderColor: '#10b981',
                    borderWidth: 2
                }
            ]
        };

        this.charts.capacity = new Chart(ctx, {
            type: 'bar',
            data: capacityData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    async loadProductionData() {
        // Load today's production data
        this.productionData = {
            todayProduction: 1247,
            targetProduction: 1200,
            oeeScore: 87.3,
            cycleTime: 14.2,
            throughputRate: 87.8,
            availability: 92.1,
            performance: 95.8,
            quality: 99.2
        };

        this.updateProductionKPIs();
    }

    updateProductionKPIs() {
        const elements = {
            todayProduction: document.getElementById('todayProduction'),
            oeeScore: document.getElementById('oeeScore'),
            cycleTime: document.getElementById('cycleTime'),
            throughputRate: document.getElementById('throughputRate')
        };

        if (elements.todayProduction) {
            elements.todayProduction.textContent = this.productionData.todayProduction.toLocaleString();
        }
        if (elements.oeeScore) {
            elements.oeeScore.textContent = this.productionData.oeeScore + '%';
        }
        if (elements.cycleTime) {
            elements.cycleTime.textContent = this.productionData.cycleTime.toFixed(1);
        }
        if (elements.throughputRate) {
            elements.throughputRate.textContent = this.productionData.throughputRate.toFixed(1);
        }
    }

    async loadWorkOrders() {
        this.workOrders = [
            {
                id: 'WO-2024-1847',
                product: 'Engine Block Assembly',
                partNumber: 'ENG-4571-A',
                quantity: 2500,
                completed: 1847,
                priority: 'high',
                dueDate: '2024-02-28',
                line: 'Line A',
                status: 'In Production',
                customer: 'Ford Motor Company',
                startDate: '2024-02-20'
            },
            {
                id: 'WO-2024-1848',
                product: 'Transmission Housing',
                partNumber: 'TRN-2841-B',
                quantity: 1800,
                completed: 340,
                priority: 'medium',
                dueDate: '2024-03-15',
                line: 'Line B',
                status: 'Setup',
                customer: 'General Motors',
                startDate: '2024-02-26'
            },
            {
                id: 'WO-2024-1849',
                product: 'Battery Module Case',
                partNumber: 'BAT-7821-C',
                quantity: 5000,
                completed: 4780,
                priority: 'high',
                dueDate: '2024-02-25',
                line: 'Line D',
                status: 'Quality Check',
                customer: 'Tesla Inc.',
                startDate: '2024-02-15'
            },
            {
                id: 'WO-2024-1850',
                product: 'Cylinder Head',
                partNumber: 'CYL-3921-D',
                quantity: 1200,
                completed: 0,
                priority: 'low',
                dueDate: '2024-03-20',
                line: 'Line A',
                status: 'Scheduled',
                customer: 'BMW Manufacturing',
                startDate: '2024-03-01'
            },
            {
                id: 'WO-2024-1851',
                product: 'Hydraulic Cylinder',
                partNumber: 'HYD-5471-E',
                quantity: 800,
                completed: 456,
                priority: 'high',
                dueDate: '2024-03-05',
                line: 'Line B',
                status: 'In Production',
                customer: 'Caterpillar Inc.',
                startDate: '2024-02-22'
            }
        ];

        this.renderWorkOrdersTable();
    }

    renderWorkOrdersTable() {
        const tableBody = document.getElementById('workOrdersTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = this.workOrders.map(order => `
            <tr data-order-id="${order.id}" class="work-order-row">
                <td><strong>${order.id}</strong></td>
                <td>
                    <div class="product-info">
                        <div class="product-name">${order.product}</div>
                        <div class="part-number">${order.partNumber}</div>
                    </div>
                </td>
                <td>${order.quantity.toLocaleString()}</td>
                <td>
                    <div class="progress-cell">
                        <div class="progress-circle" style="background: conic-gradient(#10b981 0deg ${(order.completed / order.quantity) * 360}deg, #e2e8f0 ${(order.completed / order.quantity) * 360}deg 360deg);">
                            ${Math.round((order.completed / order.quantity) * 100)}%
                        </div>
                        <span>${order.completed} / ${order.quantity}</span>
                    </div>
                </td>
                <td>
                    <span class="priority-badge ${order.priority}">
                        ${order.priority.toUpperCase()}
                    </span>
                </td>
                <td>${this.formatDate(order.dueDate)}</td>
                <td>${order.line}</td>
                <td>
                    <span class="status-badge ${this.getWorkOrderStatusClass(order.status)}">
                        ${order.status}
                    </span>
                </td>
                <td>
                    <button class="widget-btn" onclick="manufacturingSystem.viewWorkOrder('${order.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="widget-btn" onclick="manufacturingSystem.editWorkOrder('${order.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="widget-btn" onclick="manufacturingSystem.printWorkOrder('${order.id}')" title="Print">
                        <i class="fas fa-print"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    async loadEquipmentStatus() {
        this.equipmentStatus = {
            operational: 23,
            maintenance: 3,
            alerts: 2,
            upcomingMaintenance: [
                {
                    id: 'CNR-003',
                    name: 'CNC Milling Machine #3',
                    location: 'Production Line A',
                    type: 'Preventive',
                    date: '2024-02-28',
                    duration: 4,
                    priority: 'normal'
                },
                {
                    id: 'HYD-001',
                    name: 'Hydraulic Press #1',
                    location: 'Production Line B',
                    type: 'Corrective',
                    date: 'Today',
                    duration: 2,
                    priority: 'urgent'
                },
                {
                    id: 'CNV-002',
                    name: 'Conveyor System #2',
                    location: 'Final Assembly',
                    type: 'Calibration',
                    date: '2024-03-02',
                    duration: 1,
                    priority: 'normal'
                }
            ]
        };
    }

    async initializeQualitySystem() {
        this.qualityMetrics = {
            overallScore: 99.2,
            firstPassYield: 97.8,
            defectRate: 0.8,
            reworkRate: 1.4,
            scrapRate: 0.6,
            recentIssues: [
                {
                    id: 'QI-2024-001',
                    title: 'Dimensional Variation - Line B',
                    details: 'Part #TB-4847 - Tolerance exceeded',
                    severity: 'critical',
                    status: 'open',
                    time: new Date(Date.now() - 2 * 60 * 60 * 1000)
                },
                {
                    id: 'QI-2024-002',
                    title: 'Surface Finish - Line D',
                    details: 'Part #EN-2341 - Minor surface defects',
                    severity: 'warning',
                    status: 'investigating',
                    time: new Date(Date.now() - 4 * 60 * 60 * 1000)
                },
                {
                    id: 'QI-2024-003',
                    title: 'Material Hardness - Line A',
                    details: 'Part #EG-1123 - Heat treatment issue',
                    severity: 'resolved',
                    status: 'resolved',
                    time: new Date(Date.now() - 6 * 60 * 60 * 1000)
                }
            ]
        };
    }

    async setupRealTimeMonitoring() {
        // Update production data every 30 seconds
        this.realTimeInterval = setInterval(() => {
            this.updateRealTimeData();
        }, 30000);

        // Update production line status every 15 seconds
        setInterval(() => {
            this.updateProductionLineStatus();
        }, 15000);

        // Update quality metrics every 60 seconds
        setInterval(() => {
            this.updateQualityMetrics();
        }, 60000);
    }

    updateRealTimeData() {
        // Simulate real-time production updates
        const productionVariation = (Math.random() - 0.5) * 10; // ±5 units
        this.productionData.todayProduction = Math.max(0, this.productionData.todayProduction + productionVariation);

        const oeeVariation = (Math.random() - 0.5) * 2; // ±1%
        this.productionData.oeeScore = Math.max(70, Math.min(100, this.productionData.oeeScore + oeeVariation));

        const cycleTimeVariation = (Math.random() - 0.5) * 0.4; // ±0.2 minutes
        this.productionData.cycleTime = Math.max(10, this.productionData.cycleTime + cycleTimeVariation);

        this.updateProductionKPIs();
        this.updateChartData();
    }

    updateProductionLineStatus() {
        const lines = document.querySelectorAll('.production-line-card');
        
        lines.forEach(line => {
            const statusElement = line.querySelector('.line-status');
            const metricsElements = line.querySelectorAll('.metric-value');
            
            // Randomly update metrics with small variations
            if (Math.random() < 0.1) { // 10% chance of update
                metricsElements.forEach((metric, index) => {
                    const currentValue = parseFloat(metric.textContent);
                    let variation = 0;
                    
                    switch (index) {
                        case 0: // Output
                            variation = Math.floor((Math.random() - 0.5) * 10);
                            break;
                        case 1: // Efficiency
                            variation = (Math.random() - 0.5) * 2;
                            break;
                        case 2: // Quality
                            variation = (Math.random() - 0.5) * 0.4;
                            break;
                        case 3: // Speed
                            variation = (Math.random() - 0.5) * 1;
                            break;
                    }
                    
                    const newValue = Math.max(0, currentValue + variation);
                    
                    if (index === 0) {
                        metric.textContent = Math.round(newValue) + ' units';
                    } else if (index === 1 || index === 2) {
                        metric.textContent = newValue.toFixed(1) + '%';
                    } else if (index === 3) {
                        metric.textContent = newValue.toFixed(1) + ' units/hr';
                    }
                }
                
                // Add visual feedback for updates
                line.style.boxShadow = '0 0 20px rgba(37, 99, 235, 0.3)';
                setTimeout(() => {
                    line.style.boxShadow = '';
                }, 2000);
            }
        });
    }

    updateQualityMetrics() {
        // Simulate quality metric variations
        const qualityVariation = (Math.random() - 0.5) * 0.1;
        this.qualityMetrics.overallScore = Math.max(95, Math.min(100, 
            this.qualityMetrics.overallScore + qualityVariation));
        
        // Update quality score display
        const scoreElement = document.querySelector('.score-value');
        if (scoreElement) {
            scoreElement.textContent = this.qualityMetrics.overallScore.toFixed(1) + '%';
        }
    }

    updateChartData() {
        // Update production trend chart
        if (this.charts.production) {
            const currentData = this.charts.production.data.datasets[0].data;
            currentData.shift();
            currentData.push(this.productionData.todayProduction);
            this.charts.production.update('none');
        }

        // Update OEE gauge
        if (this.charts.oeeGauge) {
            const oeeValue = this.productionData.oeeScore;
            this.charts.oeeGauge.data.datasets[0].data = [oeeValue, 100 - oeeValue];
            this.charts.oeeGauge.data.datasets[0].backgroundColor[0] = this.getOEEColor(oeeValue);
            this.charts.oeeGauge.update('none');
        }
    }

    // Event Handlers
    handleWidgetAction(button) {
        const action = button.textContent.trim() || button.getAttribute('title');
        const widget = button.closest('.manufacturing-widget');
        
        console.log(`Manufacturing widget action: ${action}`);
        
        if (action.includes('New Work Order')) {
            this.showNewWorkOrderModal();
        } else if (action.includes('Schedule Production')) {
            this.showProductionSchedulingModal();
        } else if (action.includes('Export')) {
            this.exportManufacturingData(widget);
        } else if (action.includes('Alert')) {
            this.showAlertDetails();
        }
    }

    handleSidebarNavigation(link) {
        const href = link.getAttribute('href');
        const section = href.replace('#', '');
        
        // Remove active class from all sidebar items
        document.querySelectorAll('.nav-list-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked item
        link.closest('.nav-list-item').classList.add('active');
        
        // Load section content
        this.loadSectionContent(section);
    }

    handleFilterChange(select) {
        const filter = select.value;
        const widget = select.closest('.manufacturing-widget');
        
        if (widget && widget.classList.contains('work-orders-widget')) {
            this.filterWorkOrders(filter);
        }
    }

    handleTimePeriodChange(select) {
        const period = select.value;
        console.log(`Time period changed to: ${period}`);
        // Implement time period filtering logic
    }

    // Business Logic Methods
    showNewWorkOrderModal() {
        console.log('Opening New Work Order modal...');
        // Implement work order creation modal
    }

    showProductionSchedulingModal() {
        console.log('Opening Production Scheduling modal...');
        // Implement production scheduling interface
    }

    showLineDetails(lineCard) {
        const lineName = lineCard.querySelector('.line-name').textContent;
        console.log(`Showing details for ${lineName}`);
        // Implement line detail view
    }

    viewWorkOrder(orderId) {
        const order = this.workOrders.find(wo => wo.id === orderId);
        if (order) {
            console.log(`Viewing work order:`, order);
            // Implement work order detail view
        }
    }

    editWorkOrder(orderId) {
        const order = this.workOrders.find(wo => wo.id === orderId);
        if (order) {
            console.log(`Editing work order:`, order);
            // Implement work order edit interface
        }
    }

    printWorkOrder(orderId) {
        const order = this.workOrders.find(wo => wo.id === orderId);
        if (order) {
            console.log(`Printing work order: ${orderId}`);
            // Implement work order printing
        }
    }

    filterWorkOrders(filter) {
        let filteredOrders = this.workOrders;
        
        switch (filter) {
            case 'active':
                filteredOrders = this.workOrders.filter(order => 
                    order.status === 'In Production' || order.status === 'Setup');
                break;
            case 'completed':
                filteredOrders = this.workOrders.filter(order => 
                    order.status === 'Completed');
                break;
            case 'delayed':
                filteredOrders = this.workOrders.filter(order => 
                    new Date(order.dueDate) < new Date() && order.status !== 'Completed');
                break;
        }
        
        this.renderFilteredWorkOrders(filteredOrders);
    }

    renderFilteredWorkOrders(orders) {
        // Store original orders and render filtered set
        const originalOrders = this.workOrders;
        this.workOrders = orders;
        this.renderWorkOrdersTable();
        this.workOrders = originalOrders;
    }

    exportManufacturingData(widget) {
        const widgetType = widget.dataset.widget || widget.className;
        console.log(`Exporting manufacturing data for: ${widgetType}`);
        // Implement export functionality
    }

    showAlertDetails() {
        console.log('Showing equipment alert details...');
        // Implement alert detail modal
    }

    loadSectionContent(section) {
        console.log(`Loading manufacturing section: ${section}`);
        // Implement section content loading
        // This would typically load different views/interfaces for each section
    }

    // Utility Methods
    generateProductionTrendData() {
        const labels = Array.from({ length: 24 }, (_, i) => 
            new Date(Date.now() - (23 - i) * 60 * 60 * 1000).getHours() + ':00');
        
        const values = Array.from({ length: 24 }, () => 
            Math.floor(Math.random() * 50 + 40)); // 40-90 units per hour
        
        return { labels, values };
    }

    generateCycleTimeData() {
        const labels = Array.from({ length: 12 }, (_, i) => i + 1);
        const values = Array.from({ length: 12 }, () => 
            Math.random() * 5 + 12); // 12-17 minutes
        
        return { labels, values };
    }

    generateLineProductionData() {
        const labels = Array.from({ length: 20 }, (_, i) => i);
        const values = Array.from({ length: 20 }, () => 
            Math.floor(Math.random() * 30 + 15)); // 15-45 units
        
        return { labels, values };
    }

    generateQualityTrendData() {
        const labels = Array.from({ length: 12 }, (_, i) => i + 1);
        const values = Array.from({ length: 12 }, () => 
            Math.random() * 3 + 97); // 97-100%
        
        return { labels, values };
    }

    getOEEColor(value) {
        if (value >= 85) return '#10b981'; // Green
        if (value >= 70) return '#f59e0b'; // Orange
        return '#ef4444'; // Red
    }

    getWorkOrderStatusClass(status) {
        const statusMap = {
            'In Production': 'success',
            'Setup': 'warning',
            'Quality Check': 'info',
            'Scheduled': 'info',
            'Completed': 'success',
            'On Hold': 'warning',
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
    getProductionMetrics() {
        return this.productionData;
    }

    getWorkOrderById(orderId) {
        return this.workOrders.find(order => order.id === orderId);
    }

    updateWorkOrderStatus(orderId, status) {
        const order = this.getWorkOrderById(orderId);
        if (order) {
            order.status = status;
            this.renderWorkOrdersTable();
        }
    }

    addQualityIssue(issue) {
        this.qualityMetrics.recentIssues.unshift(issue);
        // Re-render quality issues if needed
    }

    destroy() {
        if (this.realTimeInterval) {
            clearInterval(this.realTimeInterval);
        }
        
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.destroy) {
                chart.destroy();
            }
        });
    }
}

// Initialize Manufacturing System when DOM is loaded
let manufacturingSystem;

document.addEventListener('DOMContentLoaded', function() {
    manufacturingSystem = new TitanManufacturingSystem();
    
    // Make it globally accessible
    window.manufacturingSystem = manufacturingSystem;
});

// Handle page unload
window.addEventListener('beforeunload', function() {
    if (manufacturingSystem) {
        manufacturingSystem.destroy();
    }
});