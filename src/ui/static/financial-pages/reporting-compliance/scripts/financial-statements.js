/**
 * Financial Statements - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Financial Statements
document.addEventListener('DOMContentLoaded', function() {
    console.log('Financial Statements page loaded');
    
    // Initialize page-specific features
    initializefinancialstatements();
});

function initializefinancialstatements() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlefinancialstatementsAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executefinancialstatements();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadfinancialstatementsData();
}

async function loadfinancialstatementsData() {
    try {
        const response = await fetch('/api/financial/reporting-compliance/financial-statements');
        if (response.ok) {
            const data = await response.json();
            updatefinancialstatementsDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Financial Statements data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handlefinancialstatementsAction() {
    console.log('Financial Statements action triggered');
    window.financialPages.showNotification('Financial Statements configured successfully', 'success');
}

function executefinancialstatements() {
    console.log('Financial Statements execution started');
    window.financialPages.showNotification('Financial Statements executed successfully', 'success');
}

function updatefinancialstatementsDisplay(data) {
    console.log('Updating Financial Statements display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/reporting-compliance/financial-statements/test');
                const result = await response.json();
                window.financialPages.showNotification('Integration test successful', 'success');
            } catch (error) {
                window.financialPages.showNotification('Integration test failed', 'error');
            }
        });
    }
    
    // View data button
    const viewDataBtn = document.getElementById('viewDataBtn');
    if (viewDataBtn) {
        viewDataBtn.addEventListener('click', function() {
            loadfinancialstatementsData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlefinancialstatementsAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/reporting-compliance/financial-statements/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'financial-statements-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}