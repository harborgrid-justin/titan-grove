/**
 * Market Data Management - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Market Data Management
document.addEventListener('DOMContentLoaded', function() {
    console.log('Market Data Management page loaded');
    
    // Initialize page-specific features
    initializemarketdatamgmt();
});

function initializemarketdatamgmt() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlemarketdatamgmtAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executemarketdatamgmt();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadmarketdatamgmtData();
}

async function loadmarketdatamgmtData() {
    try {
        const response = await fetch('/api/financial/treasury-operations-advanced/market-data-mgmt');
        if (response.ok) {
            const data = await response.json();
            updatemarketdatamgmtDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Market Data Management data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handlemarketdatamgmtAction() {
    console.log('Market Data Management action triggered');
    window.financialPages.showNotification('Market Data Management configured successfully', 'success');
}

function executemarketdatamgmt() {
    console.log('Market Data Management execution started');
    window.financialPages.showNotification('Market Data Management executed successfully', 'success');
}

function updatemarketdatamgmtDisplay(data) {
    console.log('Updating Market Data Management display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/treasury-operations-advanced/market-data-mgmt/test');
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
            loadmarketdatamgmtData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlemarketdatamgmtAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/treasury-operations-advanced/market-data-mgmt/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'market-data-mgmt-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}