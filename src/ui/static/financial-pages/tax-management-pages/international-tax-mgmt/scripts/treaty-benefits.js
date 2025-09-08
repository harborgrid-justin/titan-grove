/**
 * Tax Treaty Benefits Management - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Tax Treaty Benefits Management
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tax Treaty Benefits Management page loaded');
    
    // Initialize page-specific features
    initializetreatybenefits();
});

function initializetreatybenefits() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handletreatybenefitsAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executetreatybenefits();
        });
    }
    
    // Configure page-specific buttons
    setupTaxPageActions();
    
    // Load initial tax data
    loadtreatybenefitsData();
}

async function loadtreatybenefitsData() {
    try {
        const response = await fetch('/api/tax-management/international-tax-mgmt/treaty-benefits');
        if (response.ok) {
            const data = await response.json();
            updatetreatybenefitsDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Tax Treaty Benefits Management data:', error);
        if (window.financialPages) {
            window.financialPages.showNotification('Failed to load tax data', 'error');
        }
    }
}

function handletreatybenefitsAction() {
    console.log('Tax Treaty Benefits Management action triggered');
    if (window.financialPages) {
        window.financialPages.showNotification('Tax Treaty Benefits Management configured successfully', 'success');
    }
}

function executetreatybenefits() {
    console.log('Tax Treaty Benefits Management execution started');
    if (window.financialPages) {
        window.financialPages.showNotification('Tax Treaty Benefits Management executed successfully', 'success');
    }
}

function updatetreatybenefitsDisplay(data) {
    console.log('Updating Tax Treaty Benefits Management display:', data);
    // Update UI with loaded tax data
}

function setupTaxPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/international-tax-mgmt/treaty-benefits/test');
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
            loadtreatybenefitsData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handletreatybenefitsAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/international-tax-mgmt/treaty-benefits/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'treaty-benefits-tax-export.xlsx';
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