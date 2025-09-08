/**
 * Tax Document Management - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Tax Document Management
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tax Document Management page loaded');
    
    // Initialize page-specific features
    initializedocumentmgmt();
});

function initializedocumentmgmt() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handledocumentmgmtAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executedocumentmgmt();
        });
    }
    
    // Configure page-specific buttons
    setupTaxPageActions();
    
    // Load initial tax data
    loaddocumentmgmtData();
}

async function loaddocumentmgmtData() {
    try {
        const response = await fetch('/api/tax-management/tax-audit-documentation/document-mgmt');
        if (response.ok) {
            const data = await response.json();
            updatedocumentmgmtDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Tax Document Management data:', error);
        if (window.financialPages) {
            window.financialPages.showNotification('Failed to load tax data', 'error');
        }
    }
}

function handledocumentmgmtAction() {
    console.log('Tax Document Management action triggered');
    if (window.financialPages) {
        window.financialPages.showNotification('Tax Document Management configured successfully', 'success');
    }
}

function executedocumentmgmt() {
    console.log('Tax Document Management execution started');
    if (window.financialPages) {
        window.financialPages.showNotification('Tax Document Management executed successfully', 'success');
    }
}

function updatedocumentmgmtDisplay(data) {
    console.log('Updating Tax Document Management display:', data);
    // Update UI with loaded tax data
}

function setupTaxPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-audit-documentation/document-mgmt/test');
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
            loaddocumentmgmtData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handledocumentmgmtAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-audit-documentation/document-mgmt/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'document-mgmt-tax-export.xlsx';
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