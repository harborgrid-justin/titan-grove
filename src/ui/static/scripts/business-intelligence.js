/**
 * Titan Grove Enterprise Business Intelligence & Analytics Engine
 * Advanced data visualization and analytics for enterprise decision making
 * Oracle EBS competitive alternative with modern BI capabilities
 */

class TitanBusinessIntelligenceEngine {
    constructor() {
        this.charts = new Map();
        this.dashboards = new Map();
        this.dataConnections = new Map();
        this.reportCache = new Map();
        this.realTimeConnections = new Set();
        this.kpis = new Map();
        this.analytics = {
            predictive: new PredictiveAnalytics(),
            descriptive: new DescriptiveAnalytics(),
            prescriptive: new PrescriptiveAnalytics()
        };
        this.initialize();
    }

    async initialize() {
        try {
            this.setupEventListeners();
            this.initializeRealTimeUpdates();
            this.loadDashboardConfiguration();
            this.setupDataConnections();
            this.initializeKPIEngine();
            this.startAnalyticsEngine();
            console.log('✅ Titan BI Engine initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize BI Engine:', error);
        }
    }

    setupEventListeners() {
        // Dashboard navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('.bi-dashboard-tab')) {
                this.switchDashboard(e.target.dataset.dashboard);
            }
            if (e.target.matches('.bi-report-action')) {
                this.executeReportAction(e.target.dataset.action, e.target.dataset.reportId);
            }
            if (e.target.matches('.bi-filter-apply')) {
                this.applyFilters(e.target.closest('.bi-filter-panel'));
            }
            if (e.target.matches('.bi-export-btn')) {
                this.exportReport(e.target.dataset.format, e.target.dataset.reportId);
            }
        });

        // Real-time controls
        document.addEventListener('change', (e) => {
            if (e.target.matches('.bi-realtime-toggle')) {
                this.toggleRealTimeUpdates(e.target.checked);
            }
            if (e.target.matches('.bi-time-range-selector')) {
                this.updateTimeRange(e.target.value);
            }
            if (e.target.matches('.bi-metric-selector')) {
                this.updateSelectedMetrics(e.target);
            }
        });

        // Search and filtering
        document.addEventListener('input', (e) => {
            if (e.target.matches('.bi-search-input')) {
                this.handleSearch(e.target.value);
            }
            if (e.target.matches('.bi-filter-input')) {
                this.handleFilterInput(e.target);
            }
        });

        // Window resize for responsive charts
        window.addEventListener('resize', () => {
            this.resizeCharts();
        });
    }

    async switchDashboard(dashboardId) {
        try {
            const dashboard = this.dashboards.get(dashboardId);
            if (!dashboard) {
                await this.loadDashboard(dashboardId);
            }

            // Hide current dashboard
            document.querySelectorAll('.bi-dashboard-content').forEach(content => {
                content.classList.add('hidden');
            });

            // Show selected dashboard
            const targetDashboard = document.getElementById(`dashboard-${dashboardId}`);
            if (targetDashboard) {
                targetDashboard.classList.remove('hidden');
                this.refreshDashboard(dashboardId);
            }

            // Update navigation
            document.querySelectorAll('.bi-dashboard-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            document.querySelector(`[data-dashboard="${dashboardId}"]`).classList.add('active');

        } catch (error) {
            console.error('Failed to switch dashboard:', error);
            this.showNotification('Failed to load dashboard', 'error');
        }
    }

    async loadDashboard(dashboardId) {
        const dashboards = {
            executive: () => this.createExecutiveDashboard(),
            financial: () => this.createFinancialDashboard(),
            operational: () => this.createOperationalDashboard(),
            sales: () => this.createSalesDashboard(),
            hr: () => this.createHRDashboard(),
            supply_chain: () => this.createSupplyChainDashboard()
        };

        if (dashboards[dashboardId]) {
            const dashboard = await dashboards[dashboardId]();
            this.dashboards.set(dashboardId, dashboard);
            return dashboard;
        }
        throw new Error(`Unknown dashboard: ${dashboardId}`);
    }

    async createExecutiveDashboard() {
        const container = document.getElementById('dashboard-executive');
        if (!container) return null;

        // KPI Overview Section
        const kpiSection = this.createKPISection([
            { id: 'revenue', title: 'Total Revenue', value: '$45.2M', change: '+12.5%', trend: 'up' },
            { id: 'profit_margin', title: 'Profit Margin', value: '23.4%', change: '+2.1%', trend: 'up' },
            { id: 'customer_satisfaction', title: 'Customer Satisfaction', value: '94.2%', change: '+1.8%', trend: 'up' },
            { id: 'employee_engagement', title: 'Employee Engagement', value: '87.3%', change: '-0.5%', trend: 'down' }
        ]);

        // Revenue Trend Chart
        const revenueChart = await this.createChart('revenue-trend', {
            type: 'line',
            data: await this.fetchRevenueData(),
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Revenue Trend (12 Months)' }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: { callback: (value) => `$${value}M` }
                    }
                }
            }
        });

        // Performance Matrix
        const performanceMatrix = this.createPerformanceMatrix();

        // Business Health Score
        const healthScore = this.createBusinessHealthScore();

        return {
            id: 'executive',
            components: { kpiSection, revenueChart, performanceMatrix, healthScore }
        };
    }

    async createFinancialDashboard() {
        const container = document.getElementById('dashboard-financial');
        if (!container) return null;

        // Financial KPIs
        const financialKPIs = this.createKPISection([
            { id: 'cash_flow', title: 'Cash Flow', value: '$8.4M', change: '+15.2%', trend: 'up' },
            { id: 'accounts_receivable', title: 'Accounts Receivable', value: '$12.1M', change: '-5.3%', trend: 'down' },
            { id: 'debt_ratio', title: 'Debt to Equity', value: '0.42', change: '-0.08', trend: 'up' },
            { id: 'roa', title: 'Return on Assets', value: '8.7%', change: '+1.2%', trend: 'up' }
        ]);

        // P&L Statement Visualization
        const plChart = await this.createChart('pl-statement', {
            type: 'waterfall',
            data: await this.fetchPLData(),
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Profit & Loss Statement' }
                }
            }
        });

        // Budget vs Actual
        const budgetChart = await this.createChart('budget-actual', {
            type: 'bar',
            data: await this.fetchBudgetData(),
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Budget vs Actual' }
                },
                scales: {
                    y: {
                        ticks: { callback: (value) => `$${value}K` }
                    }
                }
            }
        });

        // Financial Ratios Radar
        const ratiosChart = await this.createChart('financial-ratios', {
            type: 'radar',
            data: await this.fetchRatiosData(),
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Financial Ratios Analysis' }
                }
            }
        });

        return {
            id: 'financial',
            components: { financialKPIs, plChart, budgetChart, ratiosChart }
        };
    }

    async createOperationalDashboard() {
        const container = document.getElementById('dashboard-operational');
        if (!container) return null;

        // Operational Metrics
        const operationalKPIs = this.createKPISection([
            { id: 'production_efficiency', title: 'Production Efficiency', value: '92.4%', change: '+3.1%', trend: 'up' },
            { id: 'quality_score', title: 'Quality Score', value: '98.2%', change: '+0.8%', trend: 'up' },
            { id: 'oee', title: 'Overall Equipment Efficiency', value: '87.5%', change: '+2.3%', trend: 'up' },
            { id: 'delivery_performance', title: 'On-Time Delivery', value: '94.7%', change: '-1.2%', trend: 'down' }
        ]);

        // Production Volume Chart
        const productionChart = await this.createChart('production-volume', {
            type: 'line',
            data: await this.fetchProductionData(),
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Production Volume Trends' }
                }
            }
        });

        // Quality Metrics
        const qualityChart = await this.createChart('quality-metrics', {
            type: 'doughnut',
            data: await this.fetchQualityData(),
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Quality Distribution' }
                }
            }
        });

        return {
            id: 'operational',
            components: { operationalKPIs, productionChart, qualityChart }
        };
    }

    async createSalesDashboard() {
        // Sales pipeline visualization
        const pipelineChart = await this.createChart('sales-pipeline', {
            type: 'funnel',
            data: await this.fetchPipelineData(),
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Sales Pipeline' }
                }
            }
        });

        // Sales performance by region
        const regionChart = await this.createChart('sales-regions', {
            type: 'polarArea',
            data: await this.fetchRegionalSalesData(),
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Sales by Region' }
                }
            }
        });

        return {
            id: 'sales',
            components: { pipelineChart, regionChart }
        };
    }

    createKPISection(kpis) {
        const section = document.createElement('div');
        section.className = 'bi-kpi-section';

        kpis.forEach(kpi => {
            const kpiCard = document.createElement('div');
            kpiCard.className = 'bi-kpi-card';
            kpiCard.innerHTML = `
                <div class="kpi-header">
                    <h3 class="kpi-title">${kpi.title}</h3>
                    <div class="kpi-trend ${kpi.trend}">
                        <i class="fas fa-arrow-${kpi.trend === 'up' ? 'up' : 'down'}"></i>
                        ${kpi.change}
                    </div>
                </div>
                <div class="kpi-value">${kpi.value}</div>
                <div class="kpi-sparkline" data-kpi="${kpi.id}"></div>
            `;
            section.appendChild(kpiCard);

            // Add sparkline chart
            this.createSparkline(kpi.id, kpiCard.querySelector('.kpi-sparkline'));
        });

        return section;
    }

    async createChart(chartId, config) {
        const canvas = document.getElementById(chartId) || this.createChartCanvas(chartId);
        const ctx = canvas.getContext('2d');

        // Destroy existing chart if it exists
        if (this.charts.has(chartId)) {
            this.charts.get(chartId).destroy();
        }

        const chart = new Chart(ctx, config);
        this.charts.set(chartId, chart);
        return chart;
    }

    createChartCanvas(chartId) {
        const canvas = document.createElement('canvas');
        canvas.id = chartId;
        canvas.className = 'bi-chart';
        return canvas;
    }

    async createSparkline(kpiId, container) {
        const data = await this.fetchSparklineData(kpiId);
        const sparklineHtml = `
            <svg class="sparkline" viewBox="0 0 100 20">
                <polyline points="${this.generateSparklinePoints(data)}" 
                         stroke="#4ade80" stroke-width="1" fill="none"/>
            </svg>
        `;
        container.innerHTML = sparklineHtml;
    }

    generateSparklinePoints(data) {
        if (!data || data.length === 0) return "";
        
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;
        
        return data.map((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 20 - ((value - min) / range) * 20;
            return `${x},${y}`;
        }).join(' ');
    }

    async fetchRevenueData() {
        // Simulate API call
        return {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Revenue',
                data: [3.2, 3.8, 4.1, 4.5, 4.2, 4.8, 5.1, 4.9, 5.3, 5.0, 4.7, 5.2],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.3
            }]
        };
    }

    async fetchPLData() {
        return {
            labels: ['Revenue', 'COGS', 'Gross Profit', 'Operating Exp', 'EBITDA', 'Tax', 'Net Income'],
            datasets: [{
                data: [45200, -28400, 16800, -8900, 7900, -1400, 6500],
                backgroundColor: [
                    '#10b981', '#ef4444', '#10b981', '#ef4444', 
                    '#10b981', '#ef4444', '#10b981'
                ]
            }]
        };
    }

    async fetchBudgetData() {
        return {
            labels: ['Sales', 'Marketing', 'R&D', 'Operations', 'Admin', 'IT'],
            datasets: [{
                label: 'Budget',
                data: [1200, 800, 600, 1500, 400, 300],
                backgroundColor: 'rgba(59, 130, 246, 0.6)'
            }, {
                label: 'Actual',
                data: [1350, 750, 680, 1420, 380, 320],
                backgroundColor: 'rgba(16, 185, 129, 0.6)'
            }]
        };
    }

    async fetchRatiosData() {
        return {
            labels: ['Liquidity', 'Profitability', 'Efficiency', 'Leverage', 'Growth'],
            datasets: [{
                label: 'Current',
                data: [85, 78, 92, 65, 88],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.2)'
            }, {
                label: 'Industry Avg',
                data: [75, 70, 80, 70, 75],
                borderColor: '#6b7280',
                backgroundColor: 'rgba(107, 114, 128, 0.2)'
            }]
        };
    }

    async fetchProductionData() {
        return {
            labels: Array.from({length: 30}, (_, i) => `Day ${i + 1}`),
            datasets: [{
                label: 'Units Produced',
                data: Array.from({length: 30}, () => Math.floor(Math.random() * 100) + 450),
                borderColor: '#10b981',
                tension: 0.3
            }]
        };
    }

    async fetchQualityData() {
        return {
            labels: ['Excellent', 'Good', 'Acceptable', 'Poor'],
            datasets: [{
                data: [65, 25, 8, 2],
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']
            }]
        };
    }

    async fetchSparklineData(kpiId) {
        // Generate sample sparkline data
        return Array.from({length: 10}, () => Math.random() * 100);
    }

    createPerformanceMatrix() {
        const matrix = document.createElement('div');
        matrix.className = 'bi-performance-matrix';
        
        const departments = ['Sales', 'Marketing', 'Operations', 'Finance', 'HR', 'IT'];
        const metrics = ['Performance', 'Efficiency', 'Quality', 'Innovation'];
        
        let matrixHtml = `
            <h3>Department Performance Matrix</h3>
            <div class="matrix-grid">
                <div class="matrix-header"></div>
        `;
        
        metrics.forEach(metric => {
            matrixHtml += `<div class="matrix-metric">${metric}</div>`;
        });
        
        departments.forEach(dept => {
            matrixHtml += `<div class="matrix-department">${dept}</div>`;
            metrics.forEach(() => {
                const score = Math.floor(Math.random() * 40) + 60;
                const color = score > 85 ? 'excellent' : score > 75 ? 'good' : score > 65 ? 'average' : 'poor';
                matrixHtml += `<div class="matrix-cell ${color}">${score}%</div>`;
            });
        });
        
        matrixHtml += '</div>';
        matrix.innerHTML = matrixHtml;
        
        return matrix;
    }

    createBusinessHealthScore() {
        const healthScore = document.createElement('div');
        healthScore.className = 'bi-health-score';
        
        const score = 87;
        const status = score > 85 ? 'excellent' : score > 75 ? 'good' : score > 65 ? 'average' : 'poor';
        
        healthScore.innerHTML = `
            <h3>Business Health Score</h3>
            <div class="health-score-circle ${status}">
                <div class="score-number">${score}</div>
                <div class="score-label">Overall Health</div>
            </div>
            <div class="health-factors">
                <div class="factor">
                    <span class="factor-name">Financial Stability</span>
                    <span class="factor-score">92%</span>
                </div>
                <div class="factor">
                    <span class="factor-name">Operational Efficiency</span>
                    <span class="factor-score">84%</span>
                </div>
                <div class="factor">
                    <span class="factor-name">Market Position</span>
                    <span class="factor-score">88%</span>
                </div>
                <div class="factor">
                    <span class="factor-name">Innovation Index</span>
                    <span class="factor-score">81%</span>
                </div>
            </div>
        `;
        
        return healthScore;
    }

    async executeReportAction(action, reportId) {
        switch (action) {
            case 'refresh':
                await this.refreshReport(reportId);
                break;
            case 'export':
                await this.exportReport('pdf', reportId);
                break;
            case 'schedule':
                await this.scheduleReport(reportId);
                break;
            case 'share':
                await this.shareReport(reportId);
                break;
            default:
                console.warn('Unknown report action:', action);
        }
    }

    async refreshReport(reportId) {
        const reportElement = document.getElementById(`report-${reportId}`);
        if (reportElement) {
            reportElement.classList.add('refreshing');
            try {
                await this.loadReportData(reportId);
                this.showNotification('Report refreshed successfully', 'success');
            } catch (error) {
                this.showNotification('Failed to refresh report', 'error');
            } finally {
                reportElement.classList.remove('refreshing');
            }
        }
    }

    async exportReport(format, reportId) {
        try {
            const reportData = await this.getReportData(reportId);
            const fileName = `report_${reportId}_${new Date().toISOString().split('T')[0]}.${format}`;
            
            switch (format) {
                case 'pdf':
                    await this.exportToPDF(reportData, fileName);
                    break;
                case 'excel':
                    await this.exportToExcel(reportData, fileName);
                    break;
                case 'csv':
                    await this.exportToCSV(reportData, fileName);
                    break;
                default:
                    throw new Error('Unsupported export format');
            }
            
            this.showNotification(`Report exported as ${format.toUpperCase()}`, 'success');
        } catch (error) {
            this.showNotification('Export failed', 'error');
        }
    }

    applyFilters(filterPanel) {
        const filters = {};
        filterPanel.querySelectorAll('.bi-filter-input').forEach(input => {
            if (input.value) {
                filters[input.dataset.filter] = input.value;
            }
        });

        this.updateDashboardWithFilters(filters);
    }

    async updateDashboardWithFilters(filters) {
        // Apply filters to all visible charts
        this.charts.forEach((chart, chartId) => {
            this.updateChartWithFilters(chartId, filters);
        });
    }

    async updateChartWithFilters(chartId, filters) {
        const chart = this.charts.get(chartId);
        if (!chart) return;

        // Fetch filtered data
        const newData = await this.fetchFilteredData(chartId, filters);
        
        // Update chart
        chart.data = newData;
        chart.update();
    }

    initializeRealTimeUpdates() {
        setInterval(() => {
            if (this.realTimeConnections.size > 0) {
                this.updateRealTimeData();
            }
        }, 30000); // Update every 30 seconds
    }

    async updateRealTimeData() {
        for (const connectionId of this.realTimeConnections) {
            try {
                await this.updateConnectionData(connectionId);
            } catch (error) {
                console.error(`Failed to update real-time data for ${connectionId}:`, error);
            }
        }
    }

    toggleRealTimeUpdates(enabled) {
        if (enabled) {
            this.enableRealTimeUpdates();
        } else {
            this.disableRealTimeUpdates();
        }
    }

    enableRealTimeUpdates() {
        // Add current dashboard to real-time updates
        const activeDashboard = document.querySelector('.bi-dashboard-content:not(.hidden)');
        if (activeDashboard) {
            this.realTimeConnections.add(activeDashboard.id);
        }
        
        this.showNotification('Real-time updates enabled', 'info');
    }

    disableRealTimeUpdates() {
        this.realTimeConnections.clear();
        this.showNotification('Real-time updates disabled', 'info');
    }

    handleSearch(query) {
        if (query.length < 2) return;

        const searchResults = this.searchDashboardContent(query);
        this.displaySearchResults(searchResults);
    }

    searchDashboardContent(query) {
        const results = [];
        
        // Search in KPIs
        this.kpis.forEach((kpi, id) => {
            if (kpi.title.toLowerCase().includes(query.toLowerCase())) {
                results.push({
                    type: 'kpi',
                    id: id,
                    title: kpi.title,
                    relevance: this.calculateRelevance(query, kpi.title)
                });
            }
        });

        // Search in dashboard names
        this.dashboards.forEach((dashboard, id) => {
            if (id.toLowerCase().includes(query.toLowerCase())) {
                results.push({
                    type: 'dashboard',
                    id: id,
                    title: id.replace('_', ' ').toUpperCase(),
                    relevance: this.calculateRelevance(query, id)
                });
            }
        });

        return results.sort((a, b) => b.relevance - a.relevance);
    }

    calculateRelevance(query, text) {
        const queryLower = query.toLowerCase();
        const textLower = text.toLowerCase();
        
        if (textLower === queryLower) return 100;
        if (textLower.includes(queryLower)) return 80;
        
        // Calculate partial matches
        const words = queryLower.split(' ');
        let score = 0;
        words.forEach(word => {
            if (textLower.includes(word)) {
                score += 20;
            }
        });
        
        return score;
    }

    displaySearchResults(results) {
        const searchResults = document.getElementById('biSearchSuggestions');
        if (!searchResults) return;

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">No results found</div>';
            searchResults.classList.add('visible');
            return;
        }

        const resultsHtml = results.map(result => `
            <div class="search-result" data-type="${result.type}" data-id="${result.id}">
                <div class="result-title">${result.title}</div>
                <div class="result-type">${result.type.toUpperCase()}</div>
            </div>
        `).join('');

        searchResults.innerHTML = resultsHtml;
        searchResults.classList.add('visible');
    }

    resizeCharts() {
        this.charts.forEach(chart => {
            chart.resize();
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `bi-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">×</button>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);

        // Click to close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    async loadReportData(reportId) {
        // Simulate API call
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ reportId, data: 'sample data', timestamp: new Date() });
            }, 1000);
        });
    }

    async getReportData(reportId) {
        return this.reportCache.get(reportId) || await this.loadReportData(reportId);
    }

    async exportToPDF(data, fileName) {
        // Implementation would use a PDF library like jsPDF
        console.log('Exporting to PDF:', fileName, data);
    }

    async exportToExcel(data, fileName) {
        // Implementation would use a library like SheetJS
        console.log('Exporting to Excel:', fileName, data);
    }

    async exportToCSV(data, fileName) {
        const csv = this.convertToCSV(data);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    convertToCSV(data) {
        // Simple CSV conversion
        if (Array.isArray(data)) {
            return data.map(row => Object.values(row).join(',')).join('\n');
        }
        return 'No data available';
    }
}

// Predictive Analytics Engine
class PredictiveAnalytics {
    constructor() {
        this.models = new Map();
        this.predictions = new Map();
    }

    async generateForecast(dataSet, periods = 12) {
        // Simple linear regression forecast
        const trend = this.calculateTrend(dataSet);
        const forecast = [];
        
        for (let i = 1; i <= periods; i++) {
            const predictedValue = dataSet[dataSet.length - 1] + (trend * i);
            forecast.push({
                period: i,
                value: Math.max(0, predictedValue),
                confidence: Math.max(0.5, 0.95 - (i * 0.05))
            });
        }
        
        return forecast;
    }

    calculateTrend(data) {
        if (data.length < 2) return 0;
        
        const n = data.length;
        const sumX = (n * (n - 1)) / 2;
        const sumY = data.reduce((a, b) => a + b, 0);
        const sumXY = data.reduce((sum, y, x) => sum + (x * y), 0);
        const sumX2 = data.reduce((sum, _, x) => sum + (x * x), 0);
        
        return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    }

    async detectAnomalies(data, threshold = 2) {
        const mean = data.reduce((a, b) => a + b) / data.length;
        const stdDev = Math.sqrt(data.reduce((a, b) => a + Math.pow(b - mean, 2)) / data.length);
        
        return data.map((value, index) => ({
            index,
            value,
            isAnomaly: Math.abs(value - mean) > threshold * stdDev,
            zScore: (value - mean) / stdDev
        })).filter(item => item.isAnomaly);
    }
}

// Descriptive Analytics Engine  
class DescriptiveAnalytics {
    constructor() {
        this.summaryStats = new Map();
    }

    calculateSummaryStats(data) {
        const sorted = [...data].sort((a, b) => a - b);
        const n = data.length;
        
        return {
            count: n,
            min: Math.min(...data),
            max: Math.max(...data),
            mean: data.reduce((a, b) => a + b) / n,
            median: n % 2 === 0 
                ? (sorted[n/2 - 1] + sorted[n/2]) / 2
                : sorted[Math.floor(n/2)],
            mode: this.calculateMode(data),
            standardDeviation: this.calculateStandardDeviation(data),
            variance: this.calculateVariance(data),
            range: Math.max(...data) - Math.min(...data),
            q1: sorted[Math.floor(n * 0.25)],
            q3: sorted[Math.floor(n * 0.75)]
        };
    }

    calculateMode(data) {
        const frequency = {};
        let maxFreq = 0;
        let mode = null;

        data.forEach(value => {
            frequency[value] = (frequency[value] || 0) + 1;
            if (frequency[value] > maxFreq) {
                maxFreq = frequency[value];
                mode = value;
            }
        });

        return mode;
    }

    calculateStandardDeviation(data) {
        const mean = data.reduce((a, b) => a + b) / data.length;
        const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2)) / data.length;
        return Math.sqrt(variance);
    }

    calculateVariance(data) {
        const mean = data.reduce((a, b) => a + b) / data.length;
        return data.reduce((a, b) => a + Math.pow(b - mean, 2)) / data.length;
    }

    generateCorrelationMatrix(datasets) {
        const matrix = {};
        const keys = Object.keys(datasets);

        keys.forEach(key1 => {
            matrix[key1] = {};
            keys.forEach(key2 => {
                matrix[key1][key2] = this.calculateCorrelation(datasets[key1], datasets[key2]);
            });
        });

        return matrix;
    }

    calculateCorrelation(x, y) {
        const n = Math.min(x.length, y.length);
        if (n === 0) return 0;

        const meanX = x.slice(0, n).reduce((a, b) => a + b) / n;
        const meanY = y.slice(0, n).reduce((a, b) => a + b) / n;

        let numerator = 0;
        let denomX = 0;
        let denomY = 0;

        for (let i = 0; i < n; i++) {
            const dx = x[i] - meanX;
            const dy = y[i] - meanY;
            numerator += dx * dy;
            denomX += dx * dx;
            denomY += dy * dy;
        }

        return numerator / Math.sqrt(denomX * denomY);
    }
}

// Prescriptive Analytics Engine
class PrescriptiveAnalytics {
    constructor() {
        this.optimizationModels = new Map();
        this.recommendations = new Map();
    }

    async generateRecommendations(scenario, constraints = {}) {
        const recommendations = [];

        // Cost optimization recommendations
        if (scenario.type === 'cost_optimization') {
            recommendations.push(...this.generateCostOptimizationRecommendations(scenario, constraints));
        }

        // Revenue optimization recommendations
        if (scenario.type === 'revenue_optimization') {
            recommendations.push(...this.generateRevenueOptimizationRecommendations(scenario, constraints));
        }

        // Resource optimization recommendations
        if (scenario.type === 'resource_optimization') {
            recommendations.push(...this.generateResourceOptimizationRecommendations(scenario, constraints));
        }

        return recommendations.sort((a, b) => b.impact - a.impact);
    }

    generateCostOptimizationRecommendations(scenario, constraints) {
        return [
            {
                id: 'reduce_operational_costs',
                title: 'Optimize Operational Expenses',
                description: 'Identify and eliminate inefficiencies in operational processes',
                impact: 85,
                effort: 60,
                timeframe: '3-6 months',
                expectedSavings: '$2.4M annually'
            },
            {
                id: 'supplier_negotiation',
                title: 'Renegotiate Supplier Contracts',
                description: 'Leverage bulk purchasing and long-term contracts for better rates',
                impact: 70,
                effort: 40,
                timeframe: '1-3 months',
                expectedSavings: '$1.2M annually'
            }
        ];
    }

    generateRevenueOptimizationRecommendations(scenario, constraints) {
        return [
            {
                id: 'pricing_optimization',
                title: 'Implement Dynamic Pricing',
                description: 'Use market data and demand patterns to optimize pricing strategy',
                impact: 90,
                effort: 75,
                timeframe: '6-12 months',
                expectedRevenue: '$5.8M annually'
            },
            {
                id: 'cross_selling',
                title: 'Enhance Cross-Selling Programs',
                description: 'Identify opportunities to sell complementary products to existing customers',
                impact: 65,
                effort: 45,
                timeframe: '2-4 months',
                expectedRevenue: '$1.9M annually'
            }
        ];
    }

    generateResourceOptimizationRecommendations(scenario, constraints) {
        return [
            {
                id: 'workforce_optimization',
                title: 'Optimize Workforce Allocation',
                description: 'Reallocate staff based on demand patterns and skill sets',
                impact: 75,
                effort: 55,
                timeframe: '3-6 months',
                expectedSavings: '$1.8M annually'
            },
            {
                id: 'technology_automation',
                title: 'Implement Process Automation',
                description: 'Automate repetitive tasks to free up resources for strategic activities',
                impact: 80,
                effort: 85,
                timeframe: '6-12 months',
                expectedSavings: '$3.2M annually'
            }
        ];
    }

    async optimizeResourceAllocation(resources, demands, constraints = {}) {
        // Simple resource allocation optimization
        const allocation = {};
        const totalDemand = demands.reduce((sum, demand) => sum + demand.amount, 0);
        const totalResources = resources.reduce((sum, resource) => sum + resource.capacity, 0);

        if (totalDemand <= totalResources) {
            // Sufficient resources - optimize for efficiency
            demands.forEach(demand => {
                const bestResource = resources
                    .filter(r => r.type === demand.type && r.available >= demand.amount)
                    .sort((a, b) => a.cost - b.cost)[0];
                
                if (bestResource) {
                    allocation[demand.id] = {
                        resourceId: bestResource.id,
                        amount: demand.amount,
                        cost: bestResource.cost * demand.amount
                    };
                    bestResource.available -= demand.amount;
                }
            });
        } else {
            // Insufficient resources - prioritize by importance
            const sortedDemands = demands.sort((a, b) => b.priority - a.priority);
            sortedDemands.forEach(demand => {
                const availableResource = resources.find(r => 
                    r.type === demand.type && r.available > 0
                );
                
                if (availableResource) {
                    const allocatedAmount = Math.min(demand.amount, availableResource.available);
                    allocation[demand.id] = {
                        resourceId: availableResource.id,
                        amount: allocatedAmount,
                        cost: availableResource.cost * allocatedAmount,
                        shortfall: demand.amount - allocatedAmount
                    };
                    availableResource.available -= allocatedAmount;
                }
            });
        }

        return allocation;
    }
}

// Initialize the BI Engine when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.titanBI = new TitanBusinessIntelligenceEngine();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        TitanBusinessIntelligenceEngine,
        PredictiveAnalytics,
        DescriptiveAnalytics,
        PrescriptiveAnalytics
    };
}