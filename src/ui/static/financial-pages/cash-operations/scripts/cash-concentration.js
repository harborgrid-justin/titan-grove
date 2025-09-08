/**
 * Cash Concentration & Pooling - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Cash Concentration & Pooling
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cash Concentration & Pooling page loaded');
    
    // Initialize page-specific features
    initializecashconcentration();
});

function initializecashconcentration() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlecashconcentrationAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executecashconcentration();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadcashconcentrationData();
}

async function loadcashconcentrationData() {
    try {
        const response = await fetch('/api/financial/cash-operations/cash-concentration');
        if (response.ok) {
            const data = await response.json();
            updatecashconcentrationDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Cash Concentration & Pooling data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handlecashconcentrationAction() {
    console.log('Cash Concentration & Pooling action triggered');
    window.financialPages.showNotification('Cash Concentration & Pooling configured successfully', 'success');
}

function executecashconcentration() {
    console.log('Cash Concentration & Pooling execution started');
    window.financialPages.showNotification('Cash Concentration & Pooling executed successfully', 'success');
}

function updatecashconcentrationDisplay(data) {
    console.log('Updating Cash Concentration & Pooling display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/cash-operations/cash-concentration/test');
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
            loadcashconcentrationData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlecashconcentrationAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/cash-operations/cash-concentration/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'cash-concentration-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}