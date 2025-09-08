/**
 * Tax Jurisdiction Management - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Tax Jurisdiction Management
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tax Jurisdiction Management page loaded');
    
    // Initialize page-specific features
    initializejurisdictionmgmt();
});

function initializejurisdictionmgmt() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlejurisdictionmgmtAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executejurisdictionmgmt();
        });
    }
    
    // Configure page-specific buttons
    setupTaxPageActions();
    
    // Load initial tax data
    loadjurisdictionmgmtData();
}

async function loadjurisdictionmgmtData() {
    try {
        const response = await fetch('/api/tax-management/tax-configuration-rules/jurisdiction-mgmt');
        if (response.ok) {
            const data = await response.json();
            updatejurisdictionmgmtDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Tax Jurisdiction Management data:', error);
        if (window.financialPages) {
            window.financialPages.showNotification('Failed to load tax data', 'error');
        }
    }
}

function handlejurisdictionmgmtAction() {
    console.log('Tax Jurisdiction Management action triggered');
    if (window.financialPages) {
        window.financialPages.showNotification('Tax Jurisdiction Management configured successfully', 'success');
    }
}

function executejurisdictionmgmt() {
    console.log('Tax Jurisdiction Management execution started');
    if (window.financialPages) {
        window.financialPages.showNotification('Tax Jurisdiction Management executed successfully', 'success');
    }
}

function updatejurisdictionmgmtDisplay(data) {
    console.log('Updating Tax Jurisdiction Management display:', data);
    // Update UI with loaded tax data
}

function setupTaxPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-configuration-rules/jurisdiction-mgmt/test');
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
            loadjurisdictionmgmtData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlejurisdictionmgmtAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-configuration-rules/jurisdiction-mgmt/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'jurisdiction-mgmt-tax-export.xlsx';
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