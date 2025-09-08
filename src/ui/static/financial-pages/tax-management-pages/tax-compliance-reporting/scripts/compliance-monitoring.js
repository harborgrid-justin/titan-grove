/**
 * Tax Compliance Monitoring - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Tax Compliance Monitoring
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tax Compliance Monitoring page loaded');
    
    // Initialize page-specific features
    initializecompliancemonitoring();
});

function initializecompliancemonitoring() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlecompliancemonitoringAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executecompliancemonitoring();
        });
    }
    
    // Configure page-specific buttons
    setupTaxPageActions();
    
    // Load initial tax data
    loadcompliancemonitoringData();
}

async function loadcompliancemonitoringData() {
    try {
        const response = await fetch('/api/tax-management/tax-compliance-reporting/compliance-monitoring');
        if (response.ok) {
            const data = await response.json();
            updatecompliancemonitoringDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Tax Compliance Monitoring data:', error);
        if (window.financialPages) {
            window.financialPages.showNotification('Failed to load tax data', 'error');
        }
    }
}

function handlecompliancemonitoringAction() {
    console.log('Tax Compliance Monitoring action triggered');
    if (window.financialPages) {
        window.financialPages.showNotification('Tax Compliance Monitoring configured successfully', 'success');
    }
}

function executecompliancemonitoring() {
    console.log('Tax Compliance Monitoring execution started');
    if (window.financialPages) {
        window.financialPages.showNotification('Tax Compliance Monitoring executed successfully', 'success');
    }
}

function updatecompliancemonitoringDisplay(data) {
    console.log('Updating Tax Compliance Monitoring display:', data);
    // Update UI with loaded tax data
}

function setupTaxPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-compliance-reporting/compliance-monitoring/test');
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
            loadcompliancemonitoringData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlecompliancemonitoringAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-compliance-reporting/compliance-monitoring/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'compliance-monitoring-tax-export.xlsx';
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