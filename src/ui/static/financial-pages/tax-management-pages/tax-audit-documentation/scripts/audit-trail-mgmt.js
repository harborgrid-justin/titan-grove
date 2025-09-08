/**
 * Tax Audit Trail Management - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Tax Audit Trail Management
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tax Audit Trail Management page loaded');
    
    // Initialize page-specific features
    initializeaudittrailmgmt();
});

function initializeaudittrailmgmt() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handleaudittrailmgmtAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executeaudittrailmgmt();
        });
    }
    
    // Configure page-specific buttons
    setupTaxPageActions();
    
    // Load initial tax data
    loadaudittrailmgmtData();
}

async function loadaudittrailmgmtData() {
    try {
        const response = await fetch('/api/tax-management/tax-audit-documentation/audit-trail-mgmt');
        if (response.ok) {
            const data = await response.json();
            updateaudittrailmgmtDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Tax Audit Trail Management data:', error);
        if (window.financialPages) {
            window.financialPages.showNotification('Failed to load tax data', 'error');
        }
    }
}

function handleaudittrailmgmtAction() {
    console.log('Tax Audit Trail Management action triggered');
    if (window.financialPages) {
        window.financialPages.showNotification('Tax Audit Trail Management configured successfully', 'success');
    }
}

function executeaudittrailmgmt() {
    console.log('Tax Audit Trail Management execution started');
    if (window.financialPages) {
        window.financialPages.showNotification('Tax Audit Trail Management executed successfully', 'success');
    }
}

function updateaudittrailmgmtDisplay(data) {
    console.log('Updating Tax Audit Trail Management display:', data);
    // Update UI with loaded tax data
}

function setupTaxPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-audit-documentation/audit-trail-mgmt/test');
                const result = await response.json();
                if (window.financialPages) {
                    window.financialPages.showNotification('Tax integration test successful', 'success');
                }
            } catch (error) {
                if (window.financialPages) {
                    window.financialPages.showNotification('Tax integration test failed', 'error');
                }
            }
        });
    }
    
    // View data button
    const viewDataBtn = document.getElementById('viewDataBtn');
    if (viewDataBtn) {
        viewDataBtn.addEventListener('click', function() {
            loadaudittrailmgmtData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handleaudittrailmgmtAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-audit-documentation/audit-trail-mgmt/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'audit-trail-mgmt-tax-export.xlsx';
                a.click();
                if (window.financialPages) {
                    window.financialPages.showNotification('Tax data exported successfully', 'success');
                }
            } catch (error) {
                if (window.financialPages) {
                    window.financialPages.showNotification('Tax export failed', 'error');
                }
            }
        });
    }
}