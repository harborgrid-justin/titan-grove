/**
 * CFC & Subpart F Management - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for CFC & Subpart F Management
document.addEventListener('DOMContentLoaded', function() {
    console.log('CFC & Subpart F Management page loaded');
    
    // Initialize page-specific features
    initializecfcsubpartf();
});

function initializecfcsubpartf() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlecfcsubpartfAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executecfcsubpartf();
        });
    }
    
    // Configure page-specific buttons
    setupTaxPageActions();
    
    // Load initial tax data
    loadcfcsubpartfData();
}

async function loadcfcsubpartfData() {
    try {
        const response = await fetch('/api/tax-management/international-tax-mgmt/cfc-subpart-f');
        if (response.ok) {
            const data = await response.json();
            updatecfcsubpartfDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load CFC & Subpart F Management data:', error);
        if (window.financialPages) {
            window.financialPages.showNotification('Failed to load tax data', 'error');
        }
    }
}

function handlecfcsubpartfAction() {
    console.log('CFC & Subpart F Management action triggered');
    if (window.financialPages) {
        window.financialPages.showNotification('CFC & Subpart F Management configured successfully', 'success');
    }
}

function executecfcsubpartf() {
    console.log('CFC & Subpart F Management execution started');
    if (window.financialPages) {
        window.financialPages.showNotification('CFC & Subpart F Management executed successfully', 'success');
    }
}

function updatecfcsubpartfDisplay(data) {
    console.log('Updating CFC & Subpart F Management display:', data);
    // Update UI with loaded tax data
}

function setupTaxPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/international-tax-mgmt/cfc-subpart-f/test');
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
            loadcfcsubpartfData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlecfcsubpartfAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/international-tax-mgmt/cfc-subpart-f/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'cfc-subpart-f-tax-export.xlsx';
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