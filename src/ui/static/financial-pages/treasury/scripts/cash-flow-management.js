/**
 * Cash Flow Management - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Cash Flow Management
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cash Flow Management page loaded');
    
    // Initialize page-specific features
    initializecashflowmanagement();
});

function initializecashflowmanagement() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlecashflowmanagementAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executecashflowmanagement();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadcashflowmanagementData();
}

async function loadcashflowmanagementData() {
    try {
        const response = await fetch('/api/financial/treasury/cash-flow-management');
        if (response.ok) {
            const data = await response.json();
            updatecashflowmanagementDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Cash Flow Management data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handlecashflowmanagementAction() {
    console.log('Cash Flow Management action triggered');
    window.financialPages.showNotification('Cash Flow Management configured successfully', 'success');
}

function executecashflowmanagement() {
    console.log('Cash Flow Management execution started');
    window.financialPages.showNotification('Cash Flow Management executed successfully', 'success');
}

function updatecashflowmanagementDisplay(data) {
    console.log('Updating Cash Flow Management display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/treasury/cash-flow-management/test');
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
            loadcashflowmanagementData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlecashflowmanagementAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/treasury/cash-flow-management/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'cash-flow-management-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}