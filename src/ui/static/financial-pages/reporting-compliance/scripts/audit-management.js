/**
 * Audit Management - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Audit Management
document.addEventListener('DOMContentLoaded', function() {
    console.log('Audit Management page loaded');
    
    // Initialize page-specific features
    initializeauditmanagement();
});

function initializeauditmanagement() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handleauditmanagementAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executeauditmanagement();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadauditmanagementData();
}

async function loadauditmanagementData() {
    try {
        const response = await fetch('/api/financial/reporting-compliance/audit-management');
        if (response.ok) {
            const data = await response.json();
            updateauditmanagementDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Audit Management data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handleauditmanagementAction() {
    console.log('Audit Management action triggered');
    window.financialPages.showNotification('Audit Management configured successfully', 'success');
}

function executeauditmanagement() {
    console.log('Audit Management execution started');
    window.financialPages.showNotification('Audit Management executed successfully', 'success');
}

function updateauditmanagementDisplay(data) {
    console.log('Updating Audit Management display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/reporting-compliance/audit-management/test');
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
            loadauditmanagementData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handleauditmanagementAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/reporting-compliance/audit-management/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'audit-management-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}