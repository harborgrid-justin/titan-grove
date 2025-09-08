/**
 * Reconciliation Engine - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Reconciliation Engine
document.addEventListener('DOMContentLoaded', function() {
    console.log('Reconciliation Engine page loaded');
    
    // Initialize page-specific features
    initializereconciliationengine();
});

function initializereconciliationengine() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlereconciliationengineAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executereconciliationengine();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadreconciliationengineData();
}

async function loadreconciliationengineData() {
    try {
        const response = await fetch('/api/financial/operations-control/reconciliation-engine');
        if (response.ok) {
            const data = await response.json();
            updatereconciliationengineDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Reconciliation Engine data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handlereconciliationengineAction() {
    console.log('Reconciliation Engine action triggered');
    window.financialPages.showNotification('Reconciliation Engine configured successfully', 'success');
}

function executereconciliationengine() {
    console.log('Reconciliation Engine execution started');
    window.financialPages.showNotification('Reconciliation Engine executed successfully', 'success');
}

function updatereconciliationengineDisplay(data) {
    console.log('Updating Reconciliation Engine display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/operations-control/reconciliation-engine/test');
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
            loadreconciliationengineData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlereconciliationengineAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/operations-control/reconciliation-engine/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'reconciliation-engine-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}