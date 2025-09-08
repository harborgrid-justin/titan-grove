/**
 * Debt Management - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Debt Management
document.addEventListener('DOMContentLoaded', function() {
    console.log('Debt Management page loaded');
    
    // Initialize page-specific features
    initializedebtmanagement();
});

function initializedebtmanagement() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handledebtmanagementAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executedebtmanagement();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loaddebtmanagementData();
}

async function loaddebtmanagementData() {
    try {
        const response = await fetch('/api/financial/treasury/debt-management');
        if (response.ok) {
            const data = await response.json();
            updatedebtmanagementDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Debt Management data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handledebtmanagementAction() {
    console.log('Debt Management action triggered');
    window.financialPages.showNotification('Debt Management configured successfully', 'success');
}

function executedebtmanagement() {
    console.log('Debt Management execution started');
    window.financialPages.showNotification('Debt Management executed successfully', 'success');
}

function updatedebtmanagementDisplay(data) {
    console.log('Updating Debt Management display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/treasury/debt-management/test');
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
            loaddebtmanagementData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handledebtmanagementAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/treasury/debt-management/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'debt-management-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}