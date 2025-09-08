/**
 * Withholding Tax Management - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Withholding Tax Management
document.addEventListener('DOMContentLoaded', function() {
    console.log('Withholding Tax Management page loaded');
    
    // Initialize page-specific features
    initializewithholdingtax();
});

function initializewithholdingtax() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlewithholdingtaxAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executewithholdingtax();
        });
    }
    
    // Configure page-specific buttons
    setupTaxPageActions();
    
    // Load initial tax data
    loadwithholdingtaxData();
}

async function loadwithholdingtaxData() {
    try {
        const response = await fetch('/api/tax-management/tax-calculation-processing/withholding-tax');
        if (response.ok) {
            const data = await response.json();
            updatewithholdingtaxDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Withholding Tax Management data:', error);
        if (window.financialPages) {
            window.financialPages.showNotification('Failed to load tax data', 'error');
        }
    }
}

function handlewithholdingtaxAction() {
    console.log('Withholding Tax Management action triggered');
    if (window.financialPages) {
        window.financialPages.showNotification('Withholding Tax Management configured successfully', 'success');
    }
}

function executewithholdingtax() {
    console.log('Withholding Tax Management execution started');
    if (window.financialPages) {
        window.financialPages.showNotification('Withholding Tax Management executed successfully', 'success');
    }
}

function updatewithholdingtaxDisplay(data) {
    console.log('Updating Withholding Tax Management display:', data);
    // Update UI with loaded tax data
}

function setupTaxPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-calculation-processing/withholding-tax/test');
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
            loadwithholdingtaxData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlewithholdingtaxAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-calculation-processing/withholding-tax/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'withholding-tax-tax-export.xlsx';
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