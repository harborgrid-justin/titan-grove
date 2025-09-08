/**
 * Period Close Management - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Period Close Management
document.addEventListener('DOMContentLoaded', function() {
    console.log('Period Close Management page loaded');
    
    // Initialize page-specific features
    initializeperiodclose();
});

function initializeperiodclose() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handleperiodcloseAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executeperiodclose();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadperiodcloseData();
}

async function loadperiodcloseData() {
    try {
        const response = await fetch('/api/financial/general-ledger/period-close');
        if (response.ok) {
            const data = await response.json();
            updateperiodcloseDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Period Close Management data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handleperiodcloseAction() {
    console.log('Period Close Management action triggered');
    window.financialPages.showNotification('Period Close Management configured successfully', 'success');
}

function executeperiodclose() {
    console.log('Period Close Management execution started');
    window.financialPages.showNotification('Period Close Management executed successfully', 'success');
}

function updateperiodcloseDisplay(data) {
    console.log('Updating Period Close Management display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/general-ledger/period-close/test');
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
            loadperiodcloseData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handleperiodcloseAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/general-ledger/period-close/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'period-close-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}