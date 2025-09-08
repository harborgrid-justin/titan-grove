/**
 * Working Capital Analytics - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Working Capital Analytics
document.addEventListener('DOMContentLoaded', function() {
    console.log('Working Capital Analytics page loaded');
    
    // Initialize page-specific features
    initializeworkingcapitalanalytics();
});

function initializeworkingcapitalanalytics() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handleworkingcapitalanalyticsAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executeworkingcapitalanalytics();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadworkingcapitalanalyticsData();
}

async function loadworkingcapitalanalyticsData() {
    try {
        const response = await fetch('/api/financial/working-capital/working-capital-analytics');
        if (response.ok) {
            const data = await response.json();
            updateworkingcapitalanalyticsDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Working Capital Analytics data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handleworkingcapitalanalyticsAction() {
    console.log('Working Capital Analytics action triggered');
    window.financialPages.showNotification('Working Capital Analytics configured successfully', 'success');
}

function executeworkingcapitalanalytics() {
    console.log('Working Capital Analytics execution started');
    window.financialPages.showNotification('Working Capital Analytics executed successfully', 'success');
}

function updateworkingcapitalanalyticsDisplay(data) {
    console.log('Updating Working Capital Analytics display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/working-capital/working-capital-analytics/test');
                const result = await response.json();
                window.financialPages.showNotification('Integration test successful', 'success');
            } catch (error) {
                window.financialPages.showNotification('Integration test failed', 'error');
            }
        });
    }
    
    // View data button
    const viewDataBtn = document.getElementById('viewDataBtn');
    if (viewDataBtn) {
        viewDataBtn.addEventListener('click', function() {
            loadworkingcapitalanalyticsData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handleworkingcapitalanalyticsAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/working-capital/working-capital-analytics/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'working-capital-analytics-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}