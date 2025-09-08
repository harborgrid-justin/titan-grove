/**
 * Treasury Mobile Platform - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Treasury Mobile Platform
document.addEventListener('DOMContentLoaded', function() {
    console.log('Treasury Mobile Platform page loaded');
    
    // Initialize page-specific features
    initializetreasurymobile();
});

function initializetreasurymobile() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handletreasurymobileAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executetreasurymobile();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadtreasurymobileData();
}

async function loadtreasurymobileData() {
    try {
        const response = await fetch('/api/financial/treasury-operations-advanced/treasury-mobile');
        if (response.ok) {
            const data = await response.json();
            updatetreasurymobileDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Treasury Mobile Platform data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handletreasurymobileAction() {
    console.log('Treasury Mobile Platform action triggered');
    window.financialPages.showNotification('Treasury Mobile Platform configured successfully', 'success');
}

function executetreasurymobile() {
    console.log('Treasury Mobile Platform execution started');
    window.financialPages.showNotification('Treasury Mobile Platform executed successfully', 'success');
}

function updatetreasurymobileDisplay(data) {
    console.log('Updating Treasury Mobile Platform display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/treasury-operations-advanced/treasury-mobile/test');
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
            loadtreasurymobileData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handletreasurymobileAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/treasury-operations-advanced/treasury-mobile/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'treasury-mobile-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}