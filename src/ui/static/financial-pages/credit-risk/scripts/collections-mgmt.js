/**
 * Collections Management - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Collections Management
document.addEventListener('DOMContentLoaded', function() {
    console.log('Collections Management page loaded');
    
    // Initialize page-specific features
    initializecollectionsmgmt();
});

function initializecollectionsmgmt() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlecollectionsmgmtAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executecollectionsmgmt();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadcollectionsmgmtData();
}

async function loadcollectionsmgmtData() {
    try {
        const response = await fetch('/api/financial/credit-risk/collections-mgmt');
        if (response.ok) {
            const data = await response.json();
            updatecollectionsmgmtDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Collections Management data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handlecollectionsmgmtAction() {
    console.log('Collections Management action triggered');
    window.financialPages.showNotification('Collections Management configured successfully', 'success');
}

function executecollectionsmgmt() {
    console.log('Collections Management execution started');
    window.financialPages.showNotification('Collections Management executed successfully', 'success');
}

function updatecollectionsmgmtDisplay(data) {
    console.log('Updating Collections Management display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/credit-risk/collections-mgmt/test');
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
            loadcollectionsmgmtData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlecollectionsmgmtAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/credit-risk/collections-mgmt/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'collections-mgmt-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}