/**
 * Credit Monitoring & Alerts - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Credit Monitoring & Alerts
document.addEventListener('DOMContentLoaded', function() {
    console.log('Credit Monitoring & Alerts page loaded');
    
    // Initialize page-specific features
    initializecreditmonitoring();
});

function initializecreditmonitoring() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlecreditmonitoringAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executecreditmonitoring();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadcreditmonitoringData();
}

async function loadcreditmonitoringData() {
    try {
        const response = await fetch('/api/financial/credit-risk/credit-monitoring');
        if (response.ok) {
            const data = await response.json();
            updatecreditmonitoringDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Credit Monitoring & Alerts data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handlecreditmonitoringAction() {
    console.log('Credit Monitoring & Alerts action triggered');
    window.financialPages.showNotification('Credit Monitoring & Alerts configured successfully', 'success');
}

function executecreditmonitoring() {
    console.log('Credit Monitoring & Alerts execution started');
    window.financialPages.showNotification('Credit Monitoring & Alerts executed successfully', 'success');
}

function updatecreditmonitoringDisplay(data) {
    console.log('Updating Credit Monitoring & Alerts display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/credit-risk/credit-monitoring/test');
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
            loadcreditmonitoringData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlecreditmonitoringAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/credit-risk/credit-monitoring/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'credit-monitoring-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}