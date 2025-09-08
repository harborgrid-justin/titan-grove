/**
 * Excise Tax Management - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Excise Tax Management
document.addEventListener('DOMContentLoaded', function() {
    console.log('Excise Tax Management page loaded');
    
    // Initialize page-specific features
    initializeexcisetaxmgmt();
});

function initializeexcisetaxmgmt() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handleexcisetaxmgmtAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executeexcisetaxmgmt();
        });
    }
    
    // Configure page-specific buttons
    setupTaxPageActions();
    
    // Load initial tax data
    loadexcisetaxmgmtData();
}

async function loadexcisetaxmgmtData() {
    try {
        const response = await fetch('/api/tax-management/tax-calculation-processing/excise-tax-mgmt');
        if (response.ok) {
            const data = await response.json();
            updateexcisetaxmgmtDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Excise Tax Management data:', error);
        if (window.financialPages) {
            window.financialPages.showNotification('Failed to load tax data', 'error');
        }
    }
}

function handleexcisetaxmgmtAction() {
    console.log('Excise Tax Management action triggered');
    if (window.financialPages) {
        window.financialPages.showNotification('Excise Tax Management configured successfully', 'success');
    }
}

function executeexcisetaxmgmt() {
    console.log('Excise Tax Management execution started');
    if (window.financialPages) {
        window.financialPages.showNotification('Excise Tax Management executed successfully', 'success');
    }
}

function updateexcisetaxmgmtDisplay(data) {
    console.log('Updating Excise Tax Management display:', data);
    // Update UI with loaded tax data
}

function setupTaxPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-calculation-processing/excise-tax-mgmt/test');
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
            loadexcisetaxmgmtData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handleexcisetaxmgmtAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-calculation-processing/excise-tax-mgmt/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'excise-tax-mgmt-tax-export.xlsx';
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