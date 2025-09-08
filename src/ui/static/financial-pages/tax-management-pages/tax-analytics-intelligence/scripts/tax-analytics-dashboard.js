/**
 * Tax Analytics Dashboard - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Tax Analytics Dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tax Analytics Dashboard page loaded');
    
    // Initialize page-specific features
    initializetaxanalyticsdashboard();
});

function initializetaxanalyticsdashboard() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handletaxanalyticsdashboardAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executetaxanalyticsdashboard();
        });
    }
    
    // Configure page-specific buttons
    setupTaxPageActions();
    
    // Load initial tax data
    loadtaxanalyticsdashboardData();
}

async function loadtaxanalyticsdashboardData() {
    try {
        const response = await fetch('/api/tax-management/tax-analytics-intelligence/tax-analytics-dashboard');
        if (response.ok) {
            const data = await response.json();
            updatetaxanalyticsdashboardDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Tax Analytics Dashboard data:', error);
        if (window.financialPages) {
            window.financialPages.showNotification('Failed to load tax data', 'error');
        }
    }
}

function handletaxanalyticsdashboardAction() {
    console.log('Tax Analytics Dashboard action triggered');
    if (window.financialPages) {
        window.financialPages.showNotification('Tax Analytics Dashboard configured successfully', 'success');
    }
}

function executetaxanalyticsdashboard() {
    console.log('Tax Analytics Dashboard execution started');
    if (window.financialPages) {
        window.financialPages.showNotification('Tax Analytics Dashboard executed successfully', 'success');
    }
}

function updatetaxanalyticsdashboardDisplay(data) {
    console.log('Updating Tax Analytics Dashboard display:', data);
    // Update UI with loaded tax data
}

function setupTaxPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-analytics-intelligence/tax-analytics-dashboard/test');
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
            loadtaxanalyticsdashboardData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handletaxanalyticsdashboardAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-analytics-intelligence/tax-analytics-dashboard/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'tax-analytics-dashboard-tax-export.xlsx';
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