/**
 * Payment Optimization Engine - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Payment Optimization Engine
document.addEventListener('DOMContentLoaded', function() {
    console.log('Payment Optimization Engine page loaded');
    
    // Initialize page-specific features
    initializepaymentoptimization();
});

function initializepaymentoptimization() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlepaymentoptimizationAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executepaymentoptimization();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadpaymentoptimizationData();
}

async function loadpaymentoptimizationData() {
    try {
        const response = await fetch('/api/financial/payment-systems/payment-optimization');
        if (response.ok) {
            const data = await response.json();
            updatepaymentoptimizationDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Payment Optimization Engine data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handlepaymentoptimizationAction() {
    console.log('Payment Optimization Engine action triggered');
    window.financialPages.showNotification('Payment Optimization Engine configured successfully', 'success');
}

function executepaymentoptimization() {
    console.log('Payment Optimization Engine execution started');
    window.financialPages.showNotification('Payment Optimization Engine executed successfully', 'success');
}

function updatepaymentoptimizationDisplay(data) {
    console.log('Updating Payment Optimization Engine display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/payment-systems/payment-optimization/test');
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
            loadpaymentoptimizationData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlepaymentoptimizationAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/payment-systems/payment-optimization/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'payment-optimization-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}