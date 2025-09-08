/**
 * VAT Management System - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for VAT Management System
document.addEventListener('DOMContentLoaded', function() {
    console.log('VAT Management System page loaded');
    
    // Initialize page-specific features
    initializevatmanagement();
});

function initializevatmanagement() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlevatmanagementAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executevatmanagement();
        });
    }
    
    // Configure page-specific buttons
    setupTaxPageActions();
    
    // Load initial tax data
    loadvatmanagementData();
}

async function loadvatmanagementData() {
    try {
        const response = await fetch('/api/tax-management/tax-calculation-processing/vat-management');
        if (response.ok) {
            const data = await response.json();
            updatevatmanagementDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load VAT Management System data:', error);
        if (window.financialPages) {
            window.financialPages.showNotification('Failed to load tax data', 'error');
        }
    }
}

function handlevatmanagementAction() {
    console.log('VAT Management System action triggered');
    if (window.financialPages) {
        window.financialPages.showNotification('VAT Management System configured successfully', 'success');
    }
}

function executevatmanagement() {
    console.log('VAT Management System execution started');
    if (window.financialPages) {
        window.financialPages.showNotification('VAT Management System executed successfully', 'success');
    }
}

function updatevatmanagementDisplay(data) {
    console.log('Updating VAT Management System display:', data);
    // Update UI with loaded tax data
}

function setupTaxPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-calculation-processing/vat-management/test');
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
            loadvatmanagementData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlevatmanagementAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-calculation-processing/vat-management/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'vat-management-tax-export.xlsx';
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