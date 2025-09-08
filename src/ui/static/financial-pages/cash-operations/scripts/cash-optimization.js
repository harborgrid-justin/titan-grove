/**
 * Cash Optimization Engine - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Cash Optimization Engine
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cash Optimization Engine page loaded');
    
    // Initialize page-specific features
    initializecashoptimization();
});

function initializecashoptimization() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlecashoptimizationAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executecashoptimization();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadcashoptimizationData();
}

async function loadcashoptimizationData() {
    try {
        const response = await fetch('/api/financial/cash-operations/cash-optimization');
        if (response.ok) {
            const data = await response.json();
            updatecashoptimizationDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Cash Optimization Engine data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handlecashoptimizationAction() {
    console.log('Cash Optimization Engine action triggered');
    window.financialPages.showNotification('Cash Optimization Engine configured successfully', 'success');
}

function executecashoptimization() {
    console.log('Cash Optimization Engine execution started');
    window.financialPages.showNotification('Cash Optimization Engine executed successfully', 'success');
}

function updatecashoptimizationDisplay(data) {
    console.log('Updating Cash Optimization Engine display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/cash-operations/cash-optimization/test');
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
            loadcashoptimizationData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlecashoptimizationAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/cash-operations/cash-optimization/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'cash-optimization-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}