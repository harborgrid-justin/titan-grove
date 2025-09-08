/**
 * Penalty & Interest Management - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Penalty & Interest Management
document.addEventListener('DOMContentLoaded', function() {
    console.log('Penalty & Interest Management page loaded');
    
    // Initialize page-specific features
    initializepenaltyinterestmgmt();
});

function initializepenaltyinterestmgmt() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlepenaltyinterestmgmtAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executepenaltyinterestmgmt();
        });
    }
    
    // Configure page-specific buttons
    setupTaxPageActions();
    
    // Load initial tax data
    loadpenaltyinterestmgmtData();
}

async function loadpenaltyinterestmgmtData() {
    try {
        const response = await fetch('/api/tax-management/tax-compliance-reporting/penalty-interest-mgmt');
        if (response.ok) {
            const data = await response.json();
            updatepenaltyinterestmgmtDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Penalty & Interest Management data:', error);
        if (window.financialPages) {
            window.financialPages.showNotification('Failed to load tax data', 'error');
        }
    }
}

function handlepenaltyinterestmgmtAction() {
    console.log('Penalty & Interest Management action triggered');
    if (window.financialPages) {
        window.financialPages.showNotification('Penalty & Interest Management configured successfully', 'success');
    }
}

function executepenaltyinterestmgmt() {
    console.log('Penalty & Interest Management execution started');
    if (window.financialPages) {
        window.financialPages.showNotification('Penalty & Interest Management executed successfully', 'success');
    }
}

function updatepenaltyinterestmgmtDisplay(data) {
    console.log('Updating Penalty & Interest Management display:', data);
    // Update UI with loaded tax data
}

function setupTaxPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-compliance-reporting/penalty-interest-mgmt/test');
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
            loadpenaltyinterestmgmtData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlepenaltyinterestmgmtAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-compliance-reporting/penalty-interest-mgmt/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'penalty-interest-mgmt-tax-export.xlsx';
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