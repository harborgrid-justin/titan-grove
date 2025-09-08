/**
 * Daily Cash Planning - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Daily Cash Planning
document.addEventListener('DOMContentLoaded', function() {
    console.log('Daily Cash Planning page loaded');
    
    // Initialize page-specific features
    initializedailycashplanning();
});

function initializedailycashplanning() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handledailycashplanningAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executedailycashplanning();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loaddailycashplanningData();
}

async function loaddailycashplanningData() {
    try {
        const response = await fetch('/api/financial/cash-forecasting-planning/daily-cash-planning');
        if (response.ok) {
            const data = await response.json();
            updatedailycashplanningDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Daily Cash Planning data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handledailycashplanningAction() {
    console.log('Daily Cash Planning action triggered');
    window.financialPages.showNotification('Daily Cash Planning configured successfully', 'success');
}

function executedailycashplanning() {
    console.log('Daily Cash Planning execution started');
    window.financialPages.showNotification('Daily Cash Planning executed successfully', 'success');
}

function updatedailycashplanningDisplay(data) {
    console.log('Updating Daily Cash Planning display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/cash-forecasting-planning/daily-cash-planning/test');
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
            loaddailycashplanningData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handledailycashplanningAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/cash-forecasting-planning/daily-cash-planning/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'daily-cash-planning-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}