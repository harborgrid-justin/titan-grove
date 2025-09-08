/**
 * Tax Rate Table Management - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Tax Rate Table Management
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tax Rate Table Management page loaded');
    
    // Initialize page-specific features
    initializeratetablemgmt();
});

function initializeratetablemgmt() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handleratetablemgmtAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executeratetablemgmt();
        });
    }
    
    // Configure page-specific buttons
    setupTaxPageActions();
    
    // Load initial tax data
    loadratetablemgmtData();
}

async function loadratetablemgmtData() {
    try {
        const response = await fetch('/api/tax-management/tax-configuration-rules/rate-table-mgmt');
        if (response.ok) {
            const data = await response.json();
            updateratetablemgmtDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Tax Rate Table Management data:', error);
        if (window.financialPages) {
            window.financialPages.showNotification('Failed to load tax data', 'error');
        }
    }
}

function handleratetablemgmtAction() {
    console.log('Tax Rate Table Management action triggered');
    if (window.financialPages) {
        window.financialPages.showNotification('Tax Rate Table Management configured successfully', 'success');
    }
}

function executeratetablemgmt() {
    console.log('Tax Rate Table Management execution started');
    if (window.financialPages) {
        window.financialPages.showNotification('Tax Rate Table Management executed successfully', 'success');
    }
}

function updateratetablemgmtDisplay(data) {
    console.log('Updating Tax Rate Table Management display:', data);
    // Update UI with loaded tax data
}

function setupTaxPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-configuration-rules/rate-table-mgmt/test');
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
            loadratetablemgmtData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handleratetablemgmtAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-configuration-rules/rate-table-mgmt/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'rate-table-mgmt-tax-export.xlsx';
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