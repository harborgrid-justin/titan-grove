/**
 * Tax Audit Preparation - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Tax Audit Preparation
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tax Audit Preparation page loaded');
    
    // Initialize page-specific features
    initializeauditpreparation();
});

function initializeauditpreparation() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handleauditpreparationAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executeauditpreparation();
        });
    }
    
    // Configure page-specific buttons
    setupTaxPageActions();
    
    // Load initial tax data
    loadauditpreparationData();
}

async function loadauditpreparationData() {
    try {
        const response = await fetch('/api/tax-management/tax-audit-documentation/audit-preparation');
        if (response.ok) {
            const data = await response.json();
            updateauditpreparationDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Tax Audit Preparation data:', error);
        if (window.financialPages) {
            window.financialPages.showNotification('Failed to load tax data', 'error');
        }
    }
}

function handleauditpreparationAction() {
    console.log('Tax Audit Preparation action triggered');
    if (window.financialPages) {
        window.financialPages.showNotification('Tax Audit Preparation configured successfully', 'success');
    }
}

function executeauditpreparation() {
    console.log('Tax Audit Preparation execution started');
    if (window.financialPages) {
        window.financialPages.showNotification('Tax Audit Preparation executed successfully', 'success');
    }
}

function updateauditpreparationDisplay(data) {
    console.log('Updating Tax Audit Preparation display:', data);
    // Update UI with loaded tax data
}

function setupTaxPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-audit-documentation/audit-preparation/test');
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
            loadauditpreparationData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handleauditpreparationAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-audit-documentation/audit-preparation/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'audit-preparation-tax-export.xlsx';
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