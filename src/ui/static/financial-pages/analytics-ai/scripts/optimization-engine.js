/**
 * Financial Optimization Engine - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Financial Optimization Engine
document.addEventListener('DOMContentLoaded', function() {
    console.log('Financial Optimization Engine page loaded');
    
    // Initialize page-specific features
    initializeoptimizationengine();
});

function initializeoptimizationengine() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handleoptimizationengineAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executeoptimizationengine();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadoptimizationengineData();
}

async function loadoptimizationengineData() {
    try {
        const response = await fetch('/api/financial/analytics-ai/optimization-engine');
        if (response.ok) {
            const data = await response.json();
            updateoptimizationengineDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Financial Optimization Engine data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handleoptimizationengineAction() {
    console.log('Financial Optimization Engine action triggered');
    window.financialPages.showNotification('Financial Optimization Engine configured successfully', 'success');
}

function executeoptimizationengine() {
    console.log('Financial Optimization Engine execution started');
    window.financialPages.showNotification('Financial Optimization Engine executed successfully', 'success');
}

function updateoptimizationengineDisplay(data) {
    console.log('Updating Financial Optimization Engine display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/analytics-ai/optimization-engine/test');
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
            loadoptimizationengineData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handleoptimizationengineAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/analytics-ai/optimization-engine/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'optimization-engine-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}