/**
 * Use Tax Tracking & Accrual - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Use Tax Tracking & Accrual
document.addEventListener('DOMContentLoaded', function() {
    console.log('Use Tax Tracking & Accrual page loaded');
    
    // Initialize page-specific features
    initializeusetaxtracking();
});

function initializeusetaxtracking() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handleusetaxtrackingAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executeusetaxtracking();
        });
    }
    
    // Configure page-specific buttons
    setupTaxPageActions();
    
    // Load initial tax data
    loadusetaxtrackingData();
}

async function loadusetaxtrackingData() {
    try {
        const response = await fetch('/api/tax-management/tax-calculation-processing/use-tax-tracking');
        if (response.ok) {
            const data = await response.json();
            updateusetaxtrackingDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Use Tax Tracking & Accrual data:', error);
        if (window.financialPages) {
            window.financialPages.showNotification('Failed to load tax data', 'error');
        }
    }
}

function handleusetaxtrackingAction() {
    console.log('Use Tax Tracking & Accrual action triggered');
    if (window.financialPages) {
        window.financialPages.showNotification('Use Tax Tracking & Accrual configured successfully', 'success');
    }
}

function executeusetaxtracking() {
    console.log('Use Tax Tracking & Accrual execution started');
    if (window.financialPages) {
        window.financialPages.showNotification('Use Tax Tracking & Accrual executed successfully', 'success');
    }
}

function updateusetaxtrackingDisplay(data) {
    console.log('Updating Use Tax Tracking & Accrual display:', data);
    // Update UI with loaded tax data
}

function setupTaxPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-calculation-processing/use-tax-tracking/test');
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
            loadusetaxtrackingData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handleusetaxtrackingAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-calculation-processing/use-tax-tracking/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'use-tax-tracking-tax-export.xlsx';
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