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

    // Utility Methods
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `manufacturing-toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close">&times;</button>
        `;
        
        // Add to page
        document.body.appendChild(toast);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 4000);
        
        // Manual close
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        });
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
        
        // Create and show modal for new work order
        const modal = document.createElement('div');
        modal.className = 'manufacturing-modal-overlay';
        modal.innerHTML = `
            <div class="manufacturing-modal">
                <div class="modal-header">
                    <h3>Create New Work Order</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="workOrderForm">
                        <div class="form-group">
                            <label>Work Order Number</label>
                            <input type="text" name="orderNumber" value="WO-${Date.now()}" readonly>
                        </div>
                        <div class="form-group">
                            <label>Product</label>
                            <select name="product" required>
                                <option value="">Select Product</option>
                                <option value="Widget A">Widget A</option>
                                <option value="Component B">Component B</option>
                                <option value="Assembly C">Assembly C</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Quantity</label>
                            <input type="number" name="quantity" min="1" required>
                        </div>
                        <div class="form-group">
                            <label>Production Line</label>
                            <select name="productionLine" required>
                                <option value="">Select Line</option>
                                <option value="Line 1">Production Line 1</option>
                                <option value="Line 2">Production Line 2</option>
                                <option value="Line 3">Production Line 3</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Due Date</label>
                            <input type="date" name="dueDate" required>
                        </div>
                        <div class="form-group">
                            <label>Priority</label>
                            <select name="priority">
                                <option value="Low">Low</option>
                                <option value="Medium" selected>Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Create Work Order</button>
                            <button type="button" class="btn btn-secondary modal-close">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle modal close
        modal.addEventListener('click', (e) => {
            if (e.target.matches('.modal-close') || e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // Handle form submission
        modal.querySelector('#workOrderForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const workOrderData = Object.fromEntries(formData);
            console.log('Creating work order:', workOrderData);
            
            // Add to work orders list (if exists)
            if (this.workOrders) {
                this.workOrders.push({
                    ...workOrderData,
                    id: 'wo-' + Date.now(),
                    status: 'Pending',
                    createdDate: new Date().toLocaleDateString()
                });
                this.renderWorkOrdersTable();
            }
            
            document.body.removeChild(modal);
            this.showToast('Work order created successfully', 'success');
        });
    }

    showProductionSchedulingModal() {
        console.log('Opening Production Scheduling modal...');
        
        // Create and show production scheduling modal
        const modal = document.createElement('div');
        modal.className = 'manufacturing-modal-overlay';
        modal.innerHTML = `
            <div class="manufacturing-modal large">
                <div class="modal-header">
                    <h3>Production Scheduling</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="scheduling-container">
                        <div class="schedule-filters">
                            <div class="filter-group">
                                <label>Production Line</label>
                                <select id="scheduleLineFilter">
                                    <option value="all">All Lines</option>
                                    <option value="Line 1">Production Line 1</option>
                                    <option value="Line 2">Production Line 2</option>
                                    <option value="Line 3">Production Line 3</option>
                                </select>
                            </div>
                            <div class="filter-group">
                                <label>Date Range</label>
                                <input type="date" id="scheduleStartDate">
                                <span>to</span>
                                <input type="date" id="scheduleEndDate">
                            </div>
                            <button class="btn btn-primary" id="loadSchedule">Load Schedule</button>
                        </div>
                        
                        <div class="schedule-timeline">
                            <div class="timeline-header">
                                <div class="timeline-dates">
                                    <div class="date-column">Mon 9/2</div>
                                    <div class="date-column">Tue 9/3</div>
                                    <div class="date-column">Wed 9/4</div>
                                    <div class="date-column">Thu 9/5</div>
                                    <div class="date-column">Fri 9/6</div>
                                </div>
                            </div>
                            <div class="timeline-body">
                                <div class="production-line">
                                    <div class="line-label">Line 1</div>
                                    <div class="schedule-slots">
                                        <div class="schedule-item" style="width: 40%; left: 10%;">
                                            <span>WO-001: Widget A (100 units)</span>
                                        </div>
                                        <div class="schedule-item" style="width: 30%; left: 55%;">
                                            <span>WO-002: Component B (50 units)</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="production-line">
                                    <div class="line-label">Line 2</div>
                                    <div class="schedule-slots">
                                        <div class="schedule-item" style="width: 60%; left: 20%;">
                                            <span>WO-003: Assembly C (200 units)</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="production-line">
                                    <div class="line-label">Line 3</div>
                                    <div class="schedule-slots">
                                        <div class="schedule-item" style="width: 35%; left: 0%;">
                                            <span>WO-004: Widget A (75 units)</span>
                                        </div>
                                        <div class="schedule-item" style="width: 25%; left: 70%;">
                                            <span>WO-005: Component B (30 units)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="schedule-actions">
                            <button class="btn btn-success">Save Schedule</button>
                            <button class="btn btn-warning">Auto-Schedule</button>
                            <button class="btn btn-info">Export Schedule</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Set default dates
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        modal.querySelector('#scheduleStartDate').value = today.toISOString().split('T')[0];
        modal.querySelector('#scheduleEndDate').value = nextWeek.toISOString().split('T')[0];
        
        // Handle modal close
        modal.addEventListener('click', (e) => {
            if (e.target.matches('.modal-close') || e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // Handle schedule loading
        modal.querySelector('#loadSchedule').addEventListener('click', () => {
            this.showToast('Schedule loaded successfully', 'success');
        });
        
        // Make schedule items draggable
        modal.querySelectorAll('.schedule-item').forEach(item => {
            item.draggable = true;
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.textContent);
            });
        });
    }

    showLineDetails(lineCard) {
        const lineName = lineCard.querySelector('.line-name').textContent;
        console.log(`Showing details for ${lineName}`);
        
        // Create and show line details modal
        const modal = document.createElement('div');
        modal.className = 'manufacturing-modal-overlay';
        modal.innerHTML = `
            <div class="manufacturing-modal large">
                <div class="modal-header">
                    <h3>${lineName} - Production Line Details</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="line-details-container">
                        <div class="line-overview">
                            <div class="overview-grid">
                                <div class="overview-card">
                                    <h4>Current Status</h4>
                                    <span class="status-badge operational">Operational</span>
                                </div>
                                <div class="overview-card">
                                    <h4>Efficiency</h4>
                                    <span class="metric-value">87.5%</span>
                                </div>
                                <div class="overview-card">
                                    <h4>Output Today</h4>
                                    <span class="metric-value">142 units</span>
                                </div>
                                <div class="overview-card">
                                    <h4>Target</h4>
                                    <span class="metric-value">160 units</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="line-tabs">
                            <button class="tab-btn active" data-tab="performance">Performance</button>
                            <button class="tab-btn" data-tab="equipment">Equipment</button>
                            <button class="tab-btn" data-tab="quality">Quality</button>
                            <button class="tab-btn" data-tab="maintenance">Maintenance</button>
                        </div>
                        
                        <div class="tab-content">
                            <div class="tab-panel active" id="performance">
                                <div class="performance-metrics">
                                    <canvas id="linePerformanceChart" width="400" height="200"></canvas>
                                </div>
                                <div class="performance-summary">
                                    <h4>Performance Summary</h4>
                                    <ul>
                                        <li>Average cycle time: 12.3 seconds</li>
                                        <li>Downtime today: 45 minutes</li>
                                        <li>Quality rate: 96.8%</li>
                                        <li>OEE (Overall Equipment Effectiveness): 84.2%</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div class="tab-panel" id="equipment">
                                <div class="equipment-list">
                                    <div class="equipment-item">
                                        <span class="equipment-name">Conveyor Belt A1</span>
                                        <span class="equipment-status operational">Running</span>
                                        <span class="equipment-temp">Normal (68°F)</span>
                                    </div>
                                    <div class="equipment-item">
                                        <span class="equipment-name">Assembly Robot R2</span>
                                        <span class="equipment-status operational">Running</span>
                                        <span class="equipment-temp">Normal (72°F)</span>
                                    </div>
                                    <div class="equipment-item">
                                        <span class="equipment-name">Quality Scanner Q1</span>
                                        <span class="equipment-status warning">Maintenance Due</span>
                                        <span class="equipment-temp">Normal (70°F)</span>
                                    </div>
                                    <div class="equipment-item">
                                        <span class="equipment-name">Packaging Unit P1</span>
                                        <span class="equipment-status operational">Running</span>
                                        <span class="equipment-temp">Normal (69°F)</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="tab-panel" id="quality">
                                <div class="quality-metrics">
                                    <div class="quality-stat">
                                        <h4>Defect Rate</h4>
                                        <span class="stat-value">3.2%</span>
                                        <span class="stat-trend positive">↓ 0.5%</span>
                                    </div>
                                    <div class="quality-stat">
                                        <h4>First Pass Yield</h4>
                                        <span class="stat-value">96.8%</span>
                                        <span class="stat-trend positive">↑ 1.2%</span>
                                    </div>
                                    <div class="quality-stat">
                                        <h4>Rework Rate</h4>
                                        <span class="stat-value">2.1%</span>
                                        <span class="stat-trend positive">↓ 0.3%</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="tab-panel" id="maintenance">
                                <div class="maintenance-schedule">
                                    <h4>Upcoming Maintenance</h4>
                                    <div class="maintenance-item">
                                        <span class="maintenance-type">Preventive</span>
                                        <span class="maintenance-equipment">Quality Scanner Q1</span>
                                        <span class="maintenance-date">Oct 15, 2024</span>
                                    </div>
                                    <div class="maintenance-item">
                                        <span class="maintenance-type">Calibration</span>
                                        <span class="maintenance-equipment">Assembly Robot R2</span>
                                        <span class="maintenance-date">Oct 22, 2024</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="line-actions">
                            <button class="btn btn-warning">Emergency Stop</button>
                            <button class="btn btn-primary">Adjust Speed</button>
                            <button class="btn btn-success">Export Report</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle modal close
        modal.addEventListener('click', (e) => {
            if (e.target.matches('.modal-close') || e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // Handle tab switching
        modal.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab;
                
                // Remove active classes
                modal.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                modal.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
                
                // Add active classes
                e.target.classList.add('active');
                modal.querySelector(`#${tabId}`).classList.add('active');
            });
        });
        
        // Initialize performance chart (if Chart.js is available)
        if (typeof Chart !== 'undefined') {
            const ctx = modal.querySelector('#linePerformanceChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM'],
                    datasets: [{
                        label: 'Units Produced',
                        data: [25, 45, 38, 42, 35, 28],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
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
        
        // Determine export type based on widget
        let exportData, filename;
        
        if (widgetType.includes('production-overview')) {
            exportData = this.generateProductionReport();
            filename = 'production-overview.csv';
        } else if (widgetType.includes('efficiency')) {
            exportData = this.generateEfficiencyReport();
            filename = 'efficiency-metrics.csv';
        } else if (widgetType.includes('quality')) {
            exportData = this.generateQualityReport();
            filename = 'quality-metrics.csv';
        } else {
            exportData = this.generateGeneralReport();
            filename = 'manufacturing-data.csv';
        }
        
        // Create and download CSV
        this.downloadCSV(exportData, filename);
        this.showToast(`Exported ${filename} successfully`, 'success');
    }

    generateProductionReport() {
        return [
            ['Production Line', 'Units Produced', 'Target', 'Efficiency', 'Status'],
            ['Line 1', '142', '160', '88.8%', 'Operational'],
            ['Line 2', '95', '120', '79.2%', 'Maintenance'],
            ['Line 3', '178', '180', '98.9%', 'Operational']
        ];
    }

    generateEfficiencyReport() {
        return [
            ['Time', 'Line 1', 'Line 2', 'Line 3', 'Average'],
            ['8:00 AM', '85%', '92%', '88%', '88.3%'],
            ['10:00 AM', '88%', '89%', '91%', '89.3%'],
            ['12:00 PM', '92%', '87%', '94%', '91.0%'],
            ['2:00 PM', '89%', '85%', '96%', '90.0%'],
            ['4:00 PM', '91%', '88%', '93%', '90.7%']
        ];
    }

    generateQualityReport() {
        return [
            ['Product', 'Total Produced', 'Defects', 'Quality Rate', 'Rework'],
            ['Widget A', '250', '8', '96.8%', '3'],
            ['Component B', '180', '5', '97.2%', '2'],
            ['Assembly C', '120', '4', '96.7%', '2']
        ];
    }

    generateGeneralReport() {
        return [
            ['Metric', 'Value', 'Target', 'Status'],
            ['Overall Efficiency', '89.2%', '90%', 'Below Target'],
            ['Quality Rate', '96.9%', '95%', 'Above Target'],
            ['Downtime', '2.5 hours', '2 hours', 'Above Target'],
            ['Units Produced', '415', '460', 'Below Target']
        ];
    }

    downloadCSV(data, filename) {
        const csvContent = data.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    showAlertDetails() {
        console.log('Showing equipment alert details...');
        
        // Create alert details modal
        const modal = document.createElement('div');
        modal.className = 'manufacturing-modal-overlay';
        modal.innerHTML = `
            <div class="manufacturing-modal">
                <div class="modal-header">
                    <h3>Equipment Alert Details</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="alert-details">
                        <div class="alert-summary">
                            <div class="alert-icon critical">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                            <div class="alert-info">
                                <h4>High Temperature Warning</h4>
                                <p>Equipment: Assembly Robot R2 - Line 1</p>
                                <p>Detected: ${new Date().toLocaleString()}</p>
                            </div>
                        </div>
                        
                        <div class="alert-metrics">
                            <div class="metric-card">
                                <h5>Current Temperature</h5>
                                <span class="metric-value critical">85°F</span>
                                <span class="metric-threshold">Threshold: 80°F</span>
                            </div>
                            <div class="metric-card">
                                <h5>Operating Hours</h5>
                                <span class="metric-value">127.5</span>
                                <span class="metric-threshold">Since Last Maintenance</span>
                            </div>
                            <div class="metric-card">
                                <h5>Performance Impact</h5>
                                <span class="metric-value warning">-12%</span>
                                <span class="metric-threshold">Efficiency Loss</span>
                            </div>
                        </div>
                        
                        <div class="alert-recommendations">
                            <h4>Recommended Actions</h4>
                            <ul>
                                <li>Reduce operational speed by 15%</li>
                                <li>Increase cooling system ventilation</li>
                                <li>Schedule preventive maintenance within 24 hours</li>
                                <li>Monitor temperature every 15 minutes</li>
                            </ul>
                        </div>
                        
                        <div class="alert-history">
                            <h4>Recent History</h4>
                            <div class="history-item">
                                <span class="history-time">2 hours ago</span>
                                <span class="history-event">Temperature reached 82°F</span>
                            </div>
                            <div class="history-item">
                                <span class="history-time">4 hours ago</span>
                                <span class="history-event">Performance dropped to 88%</span>
                            </div>
                            <div class="history-item">
                                <span class="history-time">1 day ago</span>
                                <span class="history-event">Last maintenance completed</span>
                            </div>
                        </div>
                        
                        <div class="alert-actions">
                            <button class="btn btn-danger">Emergency Stop</button>
                            <button class="btn btn-warning">Reduce Speed</button>
                            <button class="btn btn-primary">Schedule Maintenance</button>
                            <button class="btn btn-success">Acknowledge Alert</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle modal close
        modal.addEventListener('click', (e) => {
            if (e.target.matches('.modal-close') || e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // Handle action buttons
        modal.querySelector('.alert-actions').addEventListener('click', (e) => {
            if (e.target.matches('button')) {
                const action = e.target.textContent.trim();
                this.handleAlertAction(action);
                
                if (action === 'Acknowledge Alert') {
                    document.body.removeChild(modal);
                }
            }
        });
    }

    handleAlertAction(action) {
        switch (action) {
            case 'Emergency Stop':
                this.showToast('Emergency stop initiated - Line 1 stopped', 'warning');
                break;
            case 'Reduce Speed':
                this.showToast('Production speed reduced by 15%', 'info');
                break;
            case 'Schedule Maintenance':
                this.showToast('Maintenance scheduled for tomorrow 8:00 AM', 'success');
                break;
            case 'Acknowledge Alert':
                this.showToast('Alert acknowledged and logged', 'success');
                break;
        }
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