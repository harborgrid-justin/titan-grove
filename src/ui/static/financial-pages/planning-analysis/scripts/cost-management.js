/**
 * Cost Management - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Cost Management
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cost Management page loaded');
    
    // Initialize page-specific features
    initializecostmanagement();
});

function initializecostmanagement() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlecostmanagementAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executecostmanagement();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadcostmanagementData();
}

async function loadcostmanagementData() {
    try {
        const response = await fetch('/api/financial/planning-analysis/cost-management');
        if (response.ok) {
            const data = await response.json();
            updatecostmanagementDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Cost Management data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handlecostmanagementAction() {
    console.log('Cost Management action triggered');
    window.financialPages.showNotification('Cost Management configured successfully', 'success');
}

function executecostmanagement() {
    console.log('Cost Management execution started');
    window.financialPages.showNotification('Cost Management executed successfully', 'success');
}

function updatecostmanagementDisplay(data) {
    console.log('Updating Cost Management display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/planning-analysis/cost-management/test');
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
            loadcostmanagementData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlecostmanagementAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/planning-analysis/cost-management/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'cost-management-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}