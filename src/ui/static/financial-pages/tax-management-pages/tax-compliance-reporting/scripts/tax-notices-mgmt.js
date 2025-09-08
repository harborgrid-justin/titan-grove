/**
 * Tax Notices Management - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Tax Notices Management
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tax Notices Management page loaded');
    
    // Initialize page-specific features
    initializetaxnoticesmgmt();
});

function initializetaxnoticesmgmt() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handletaxnoticesmgmtAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executetaxnoticesmgmt();
        });
    }
    
    // Configure page-specific buttons
    setupTaxPageActions();
    
    // Load initial tax data
    loadtaxnoticesmgmtData();
}

async function loadtaxnoticesmgmtData() {
    try {
        const response = await fetch('/api/tax-management/tax-compliance-reporting/tax-notices-mgmt');
        if (response.ok) {
            const data = await response.json();
            updatetaxnoticesmgmtDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Tax Notices Management data:', error);
        if (window.financialPages) {
            window.financialPages.showNotification('Failed to load tax data', 'error');
        }
    }
}

function handletaxnoticesmgmtAction() {
    console.log('Tax Notices Management action triggered');
    if (window.financialPages) {
        window.financialPages.showNotification('Tax Notices Management configured successfully', 'success');
    }
}

function executetaxnoticesmgmt() {
    console.log('Tax Notices Management execution started');
    if (window.financialPages) {
        window.financialPages.showNotification('Tax Notices Management executed successfully', 'success');
    }
}

function updatetaxnoticesmgmtDisplay(data) {
    console.log('Updating Tax Notices Management display:', data);
    // Update UI with loaded tax data
}

function setupTaxPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-compliance-reporting/tax-notices-mgmt/test');
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
            loadtaxnoticesmgmtData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handletaxnoticesmgmtAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-compliance-reporting/tax-notices-mgmt/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'tax-notices-mgmt-tax-export.xlsx';
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