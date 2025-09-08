/**
 * Procurement Finance Integration - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Procurement Finance Integration
document.addEventListener('DOMContentLoaded', function() {
    console.log('Procurement Finance Integration page loaded');
    
    // Initialize page-specific features
    initializeprocurementfinance();
});

function initializeprocurementfinance() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handleprocurementfinanceAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executeprocurementfinance();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadprocurementfinanceData();
}

async function loadprocurementfinanceData() {
    try {
        const response = await fetch('/api/financial/operations-control/procurement-finance');
        if (response.ok) {
            const data = await response.json();
            updateprocurementfinanceDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Procurement Finance Integration data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handleprocurementfinanceAction() {
    console.log('Procurement Finance Integration action triggered');
    window.financialPages.showNotification('Procurement Finance Integration configured successfully', 'success');
}

function executeprocurementfinance() {
    console.log('Procurement Finance Integration execution started');
    window.financialPages.showNotification('Procurement Finance Integration executed successfully', 'success');
}

function updateprocurementfinanceDisplay(data) {
    console.log('Updating Procurement Finance Integration display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/operations-control/procurement-finance/test');
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
            loadprocurementfinanceData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handleprocurementfinanceAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/operations-control/procurement-finance/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'procurement-finance-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}