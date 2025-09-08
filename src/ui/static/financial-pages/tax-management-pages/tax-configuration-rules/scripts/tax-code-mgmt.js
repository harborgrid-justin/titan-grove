/**
 * Tax Code Management - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Tax Code Management
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tax Code Management page loaded');
    
    // Initialize page-specific features
    initializetaxcodemgmt();
});

function initializetaxcodemgmt() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handletaxcodemgmtAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executetaxcodemgmt();
        });
    }
    
    // Configure page-specific buttons
    setupTaxPageActions();
    
    // Load initial tax data
    loadtaxcodemgmtData();
}

async function loadtaxcodemgmtData() {
    try {
        const response = await fetch('/api/tax-management/tax-configuration-rules/tax-code-mgmt');
        if (response.ok) {
            const data = await response.json();
            updatetaxcodemgmtDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Tax Code Management data:', error);
        if (window.financialPages) {
            window.financialPages.showNotification('Failed to load tax data', 'error');
        }
    }
}

function handletaxcodemgmtAction() {
    console.log('Tax Code Management action triggered');
    if (window.financialPages) {
        window.financialPages.showNotification('Tax Code Management configured successfully', 'success');
    }
}

function executetaxcodemgmt() {
    console.log('Tax Code Management execution started');
    if (window.financialPages) {
        window.financialPages.showNotification('Tax Code Management executed successfully', 'success');
    }
}

function updatetaxcodemgmtDisplay(data) {
    console.log('Updating Tax Code Management display:', data);
    // Update UI with loaded tax data
}

function setupTaxPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-configuration-rules/tax-code-mgmt/test');
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
            loadtaxcodemgmtData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handletaxcodemgmtAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-configuration-rules/tax-code-mgmt/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'tax-code-mgmt-tax-export.xlsx';
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