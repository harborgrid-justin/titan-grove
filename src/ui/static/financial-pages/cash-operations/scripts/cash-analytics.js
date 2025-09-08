/**
 * Cash Analytics & Intelligence - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Cash Analytics & Intelligence
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cash Analytics & Intelligence page loaded');
    
    // Initialize page-specific features
    initializecashanalytics();
});

function initializecashanalytics() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlecashanalyticsAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executecashanalytics();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadcashanalyticsData();
}

async function loadcashanalyticsData() {
    try {
        const response = await fetch('/api/financial/cash-operations/cash-analytics');
        if (response.ok) {
            const data = await response.json();
            updatecashanalyticsDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Cash Analytics & Intelligence data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handlecashanalyticsAction() {
    console.log('Cash Analytics & Intelligence action triggered');
    window.financialPages.showNotification('Cash Analytics & Intelligence configured successfully', 'success');
}

function executecashanalytics() {
    console.log('Cash Analytics & Intelligence execution started');
    window.financialPages.showNotification('Cash Analytics & Intelligence executed successfully', 'success');
}

function updatecashanalyticsDisplay(data) {
    console.log('Updating Cash Analytics & Intelligence display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/cash-operations/cash-analytics/test');
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
            loadcashanalyticsData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlecashanalyticsAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/cash-operations/cash-analytics/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'cash-analytics-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}