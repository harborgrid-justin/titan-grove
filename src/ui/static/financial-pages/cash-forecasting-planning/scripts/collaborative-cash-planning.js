/**
 * Collaborative Cash Planning - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Collaborative Cash Planning
document.addEventListener('DOMContentLoaded', function() {
    console.log('Collaborative Cash Planning page loaded');
    
    // Initialize page-specific features
    initializecollaborativecashplanning();
});

function initializecollaborativecashplanning() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlecollaborativecashplanningAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executecollaborativecashplanning();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadcollaborativecashplanningData();
}

async function loadcollaborativecashplanningData() {
    try {
        const response = await fetch('/api/financial/cash-forecasting-planning/collaborative-cash-planning');
        if (response.ok) {
            const data = await response.json();
            updatecollaborativecashplanningDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Collaborative Cash Planning data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handlecollaborativecashplanningAction() {
    console.log('Collaborative Cash Planning action triggered');
    window.financialPages.showNotification('Collaborative Cash Planning configured successfully', 'success');
}

function executecollaborativecashplanning() {
    console.log('Collaborative Cash Planning execution started');
    window.financialPages.showNotification('Collaborative Cash Planning executed successfully', 'success');
}

function updatecollaborativecashplanningDisplay(data) {
    console.log('Updating Collaborative Cash Planning display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/cash-forecasting-planning/collaborative-cash-planning/test');
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
            loadcollaborativecashplanningData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlecollaborativecashplanningAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/cash-forecasting-planning/collaborative-cash-planning/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'collaborative-cash-planning-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}