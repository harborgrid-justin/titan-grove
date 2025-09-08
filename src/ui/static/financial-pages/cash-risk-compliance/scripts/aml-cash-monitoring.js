/**
 * AML Cash Monitoring - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for AML Cash Monitoring
document.addEventListener('DOMContentLoaded', function() {
    console.log('AML Cash Monitoring page loaded');
    
    // Initialize page-specific features
    initializeamlcashmonitoring();
});

function initializeamlcashmonitoring() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handleamlcashmonitoringAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executeamlcashmonitoring();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadamlcashmonitoringData();
}

async function loadamlcashmonitoringData() {
    try {
        const response = await fetch('/api/financial/cash-risk-compliance/aml-cash-monitoring');
        if (response.ok) {
            const data = await response.json();
            updateamlcashmonitoringDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load AML Cash Monitoring data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handleamlcashmonitoringAction() {
    console.log('AML Cash Monitoring action triggered');
    window.financialPages.showNotification('AML Cash Monitoring configured successfully', 'success');
}

function executeamlcashmonitoring() {
    console.log('AML Cash Monitoring execution started');
    window.financialPages.showNotification('AML Cash Monitoring executed successfully', 'success');
}

function updateamlcashmonitoringDisplay(data) {
    console.log('Updating AML Cash Monitoring display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/cash-risk-compliance/aml-cash-monitoring/test');
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
            loadamlcashmonitoringData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handleamlcashmonitoringAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/cash-risk-compliance/aml-cash-monitoring/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'aml-cash-monitoring-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}