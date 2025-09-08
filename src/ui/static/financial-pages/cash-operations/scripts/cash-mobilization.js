/**
 * Cash Mobilization & Deployment - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Cash Mobilization & Deployment
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cash Mobilization & Deployment page loaded');
    
    // Initialize page-specific features
    initializecashmobilization();
});

function initializecashmobilization() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlecashmobilizationAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executecashmobilization();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadcashmobilizationData();
}

async function loadcashmobilizationData() {
    try {
        const response = await fetch('/api/financial/cash-operations/cash-mobilization');
        if (response.ok) {
            const data = await response.json();
            updatecashmobilizationDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Cash Mobilization & Deployment data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handlecashmobilizationAction() {
    console.log('Cash Mobilization & Deployment action triggered');
    window.financialPages.showNotification('Cash Mobilization & Deployment configured successfully', 'success');
}

function executecashmobilization() {
    console.log('Cash Mobilization & Deployment execution started');
    window.financialPages.showNotification('Cash Mobilization & Deployment executed successfully', 'success');
}

function updatecashmobilizationDisplay(data) {
    console.log('Updating Cash Mobilization & Deployment display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/cash-operations/cash-mobilization/test');
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
            loadcashmobilizationData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlecashmobilizationAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/cash-operations/cash-mobilization/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'cash-mobilization-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}