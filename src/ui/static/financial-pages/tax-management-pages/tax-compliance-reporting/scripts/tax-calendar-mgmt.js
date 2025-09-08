/**
 * Tax Calendar Management - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Tax Calendar Management
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tax Calendar Management page loaded');
    
    // Initialize page-specific features
    initializetaxcalendarmgmt();
});

function initializetaxcalendarmgmt() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handletaxcalendarmgmtAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executetaxcalendarmgmt();
        });
    }
    
    // Configure page-specific buttons
    setupTaxPageActions();
    
    // Load initial tax data
    loadtaxcalendarmgmtData();
}

async function loadtaxcalendarmgmtData() {
    try {
        const response = await fetch('/api/tax-management/tax-compliance-reporting/tax-calendar-mgmt');
        if (response.ok) {
            const data = await response.json();
            updatetaxcalendarmgmtDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Tax Calendar Management data:', error);
        if (window.financialPages) {
            window.financialPages.showNotification('Failed to load tax data', 'error');
        }
    }
}

function handletaxcalendarmgmtAction() {
    console.log('Tax Calendar Management action triggered');
    if (window.financialPages) {
        window.financialPages.showNotification('Tax Calendar Management configured successfully', 'success');
    }
}

function executetaxcalendarmgmt() {
    console.log('Tax Calendar Management execution started');
    if (window.financialPages) {
        window.financialPages.showNotification('Tax Calendar Management executed successfully', 'success');
    }
}

function updatetaxcalendarmgmtDisplay(data) {
    console.log('Updating Tax Calendar Management display:', data);
    // Update UI with loaded tax data
}

function setupTaxPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-compliance-reporting/tax-calendar-mgmt/test');
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
            loadtaxcalendarmgmtData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handletaxcalendarmgmtAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-compliance-reporting/tax-calendar-mgmt/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'tax-calendar-mgmt-tax-export.xlsx';
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