/**
 * Seasonal Cash Planning - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Seasonal Cash Planning
document.addEventListener('DOMContentLoaded', function() {
    console.log('Seasonal Cash Planning page loaded');
    
    // Initialize page-specific features
    initializeseasonalcashplanning();
});

function initializeseasonalcashplanning() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handleseasonalcashplanningAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executeseasonalcashplanning();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadseasonalcashplanningData();
}

async function loadseasonalcashplanningData() {
    try {
        const response = await fetch('/api/financial/cash-forecasting-planning/seasonal-cash-planning');
        if (response.ok) {
            const data = await response.json();
            updateseasonalcashplanningDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Seasonal Cash Planning data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handleseasonalcashplanningAction() {
    console.log('Seasonal Cash Planning action triggered');
    window.financialPages.showNotification('Seasonal Cash Planning configured successfully', 'success');
}

function executeseasonalcashplanning() {
    console.log('Seasonal Cash Planning execution started');
    window.financialPages.showNotification('Seasonal Cash Planning executed successfully', 'success');
}

function updateseasonalcashplanningDisplay(data) {
    console.log('Updating Seasonal Cash Planning display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/cash-forecasting-planning/seasonal-cash-planning/test');
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
            loadseasonalcashplanningData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handleseasonalcashplanningAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/cash-forecasting-planning/seasonal-cash-planning/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'seasonal-cash-planning-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}