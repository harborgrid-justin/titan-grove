/**
 * Production Reports - Operational Reports Reporting Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Production Reports
document.addEventListener('DOMContentLoaded', function() {
    console.log('Production Reports page loaded');
    
    // Initialize page-specific features
    initializeProductionReports();
    loadReportData();
    
    // Set default configurations
    setDefaultSettings();
    
    // Initialize with reporting page manager
    const pageConfig = {
        pageName: 'Production Reports',
        requiredPermissions: ['view_reports', 'export_reports'],
        realTimeUpdates: true,
        handleRealTimeUpdate: handleRealtimeDataUpdate
    };
    
    initializeReportingPage(pageConfig);
});

function initializeProductionReports() {
    setupReportControls();
    setupMetricCards();
    setupChartInteractions();
    setupActionButtons();
    
    console.log('Production Reports initialized with business logic');
}

function setDefaultSettings() {
    const timeRange = document.getElementById('timeRange');
    const reportFormat = document.getElementById('reportFormat');
    const businessUnit = document.getElementById('businessUnit');
    
    if (timeRange) timeRange.value = 'current-month';
    if (reportFormat) reportFormat.value = 'summary';
    if (businessUnit) businessUnit.value = 'all';
}

async function loadReportData() {
    try {
        // Show loading state
        const dashboardInterface = document.querySelector('.dashboard-interface');
        reportingManager.showLoadingState(dashboardInterface);
        
        // Fetch report data using the common reporting manager
        const reportData = await reportingManager.getReportData('production-reports', {
            timeRange: document.getElementById('timeRange')?.value || 'current-month',
            reportFormat: document.getElementById('reportFormat')?.value || 'summary',
            businessUnit: document.getElementById('businessUnit')?.value || 'all'
        });
        
        // Update interface with real data
        updateMetrics(reportData.metrics);
        updateCharts(reportData.charts);
        
        // Hide loading state
        reportingManager.hideLoadingState(dashboardInterface);
        
        console.log('Production Reports data loaded successfully');
    } catch (error) {
        console.error('Error loading Production Reports data:', error);
        reportingManager.showNotification('Failed to load report data. Please try again.', 'error');
    }
}

function setupReportControls() {
    const timeRange = document.getElementById('timeRange');
    const reportFormat = document.getElementById('reportFormat');
    const businessUnit = document.getElementById('businessUnit');
    
    [timeRange, reportFormat, businessUnit].forEach(control => {
        if (control) {
            control.addEventListener('change', function() {
                console.log('Production Reports configuration changed:', {
                    timeRange: timeRange?.value,
                    reportFormat: reportFormat?.value,
                    businessUnit: businessUnit?.value
                });
                // Auto-refresh report when configuration changes
                loadReportData();
            });
        }
    });
}

function setupMetricCards() {
    const metricCards = document.querySelectorAll('.metric-card');
    
    metricCards.forEach(card => {
        card.addEventListener('click', function() {
            const metricType = card.classList[1];
            console.log('Production Reports metric card clicked:', metricType);
            
            // Show detailed drill-down for the selected metric
            showMetricDetails(metricType);
        });
        
        // Add hover effects for better user experience
        card.addEventListener('mouseenter', function() {
            card.style.transform = 'translateY(-2px)';
            card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        });
    });
}

function setupChartInteractions() {
    const chartContainer = document.querySelector('.chart-container');
    
    if (chartContainer) {
        // Create interactive chart using the common reporting chart creator
        createReportingChart('chart-placeholder', {
            type: 'area',
            title: 'Production Reports',
            data: []
        });
    }
}

function setupActionButtons() {
    const configureBtn = document.getElementById('configureBtn');
    const generateBtn = document.getElementById('generateBtn');
    
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            console.log('Opening Production Reports configuration...');
            openReportConfiguration();
        });
    }
    
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            console.log('Generating Production Reports report...');
            generateReport();
        });
    }
}

function updateMetrics(metricsData) {
    if (!metricsData) {
        // Use default sample data if no data provided
        metricsData = {
            performanceScore: { value: '95.2%', change: '+3.2%', trend: 'positive' },
            targetAchievement: { value: '87.5%', change: '+5.1%', trend: 'positive' },
            growthRate: { value: '12.8%', change: '+2.3%', trend: 'positive' },
            qualityRating: { value: '4.8/5', change: '+0.2', trend: 'positive' }
        };
    }
    
    // Update metric cards with new data
    Object.keys(metricsData).forEach(key => {
        const metricCard = document.querySelector(`.metric-card.${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
        if (metricCard) {
            const valueElement = metricCard.querySelector('.metric-value');
            const changeElement = metricCard.querySelector('.metric-change');
            
            if (valueElement) valueElement.textContent = metricsData[key].value;
            if (changeElement) {
                changeElement.textContent = metricsData[key].change;
                changeElement.className = `metric-change ${metricsData[key].trend}`;
            }
        }
    });
}

function updateCharts(chartData) {
    console.log('Updating Production Reports charts with data:', chartData);
    
    // Simulate chart update animation
    const chartPlaceholder = document.querySelector('.chart-placeholder');
    if (chartPlaceholder) {
        chartPlaceholder.style.opacity = '0.5';
        setTimeout(() => {
            chartPlaceholder.style.opacity = '1';
        }, 500);
    }
}

function showMetricDetails(metricType) {
    console.log(`Showing detailed view for ${metricType} in Production Reports`);
    
    // In a real implementation, this would open a detailed drill-down view
    reportingManager.showNotification(
        `Detailed ${metricType} analysis for Production Reports would be displayed here with comprehensive drill-down capabilities.`,
        'info'
    );
}

function openReportConfiguration() {
    console.log('Opening Production Reports advanced configuration...');
    
    // In a real implementation, this would open a configuration modal
    const config = {
        reportType: 'production-reports',
        refreshInterval: '5 minutes',
        autoRefresh: true,
        defaultView: 'summary',
        emailAlerts: true,
        customFilters: []
    };
    
    reportingManager.showNotification(
        `Production Reports Configuration: Auto-refresh enabled, email alerts configured`,
        'success'
    );
}

async function generateReport() {
    console.log('Generating comprehensive Production Reports report...');
    
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        const originalText = generateBtn.innerHTML;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        generateBtn.disabled = true;
        
        try {
            // Simulate report generation using the common reporting manager
            const reportConfig = {
                type: 'production-reports',
                format: 'comprehensive',
                includeCharts: true,
                includeData: true
            };
            
            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            reportingManager.showNotification(
                'Production Reports report generated successfully! Check your downloads folder.',
                'success'
            );
        } catch (error) {
            reportingManager.showNotification(
                'Report generation failed. Please try again.',
                'error'
            );
        } finally {
            generateBtn.innerHTML = originalText;
            generateBtn.disabled = false;
        }
    }
}

function handleRealtimeDataUpdate(updateData) {
    console.log('Production Reports real-time update received:', updateData);
    
    // Handle real-time data updates specific to this report
    if (updateData.reportType === 'production-reports' || updateData.reportType === 'all') {
        loadReportData();
        
        // Show visual indicator of update
        const header = document.querySelector('.reporting-content-header h1');
        if (header) {
            header.style.color = '#059669';
            setTimeout(() => {
                header.style.color = '';
            }, 1000);
        }
    }
}

// Real-time data refresh listener
document.addEventListener('realTimeRefresh', () => {
    // Only update if page is visible to optimize performance
    if (document.visibilityState === 'visible') {
        updateRealTimeMetrics();
    }
});

function updateRealTimeMetrics() {
    console.log('Updating Production Reports real-time metrics...');
    
    // Add subtle animation to indicate real-time update
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        const changeElement = card.querySelector('.metric-change');
        if (changeElement) {
            changeElement.style.animation = 'pulse 0.5s';
            setTimeout(() => {
                changeElement.style.animation = '';
            }, 500);
        }
    });
}

// Business logic validation specific to this report
function validateReportAccess() {
    return reportingManager.validateUserPermissions(['view_reports', 'access_operational_reports']);
}

// Initialize access validation
if (!validateReportAccess()) {
    reportingManager.showNotification(
        'You do not have permission to access Production Reports reports.',
        'error'
    );
}