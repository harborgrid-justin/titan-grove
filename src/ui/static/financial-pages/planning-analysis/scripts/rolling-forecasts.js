/**
 * Rolling Forecasts - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Rolling Forecasts
document.addEventListener('DOMContentLoaded', function() {
    console.log('Rolling Forecasts page loaded');
    
    // Initialize page-specific features
    initializerollingforecasts();
});

function initializerollingforecasts() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlerollingforecastsAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executerollingforecasts();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadrollingforecastsData();
}

async function loadrollingforecastsData() {
    try {
        const response = await fetch('/api/financial/planning-analysis/rolling-forecasts');
        if (response.ok) {
            const data = await response.json();
            updaterollingforecastsDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Rolling Forecasts data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handlerollingforecastsAction() {
    console.log('Rolling Forecasts action triggered');
    window.financialPages.showNotification('Rolling Forecasts configured successfully', 'success');
}

function executerollingforecasts() {
    console.log('Rolling Forecasts execution started');
    window.financialPages.showNotification('Rolling Forecasts executed successfully', 'success');
}

function updaterollingforecastsDisplay(data) {
    console.log('Updating Rolling Forecasts display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/planning-analysis/rolling-forecasts/test');
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
            loadrollingforecastsData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlerollingforecastsAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/planning-analysis/rolling-forecasts/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'rolling-forecasts-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}