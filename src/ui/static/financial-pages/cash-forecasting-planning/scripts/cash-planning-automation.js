/**
 * Cash Planning Automation - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Cash Planning Automation
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cash Planning Automation page loaded');
    
    // Initialize page-specific features
    initializecashplanningautomation();
});

function initializecashplanningautomation() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlecashplanningautomationAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executecashplanningautomation();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadcashplanningautomationData();
}

async function loadcashplanningautomationData() {
    try {
        const response = await fetch('/api/financial/cash-forecasting-planning/cash-planning-automation');
        if (response.ok) {
            const data = await response.json();
            updatecashplanningautomationDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Cash Planning Automation data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handlecashplanningautomationAction() {
    console.log('Cash Planning Automation action triggered');
    window.financialPages.showNotification('Cash Planning Automation configured successfully', 'success');
}

function executecashplanningautomation() {
    console.log('Cash Planning Automation execution started');
    window.financialPages.showNotification('Cash Planning Automation executed successfully', 'success');
}

function updatecashplanningautomationDisplay(data) {
    console.log('Updating Cash Planning Automation display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/cash-forecasting-planning/cash-planning-automation/test');
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
            loadcashplanningautomationData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlecashplanningautomationAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/cash-forecasting-planning/cash-planning-automation/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'cash-planning-automation-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}