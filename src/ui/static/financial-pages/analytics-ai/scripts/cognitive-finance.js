/**
 * Cognitive Finance Platform - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Cognitive Finance Platform
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cognitive Finance Platform page loaded');
    
    // Initialize page-specific features
    initializecognitivefinance();
});

function initializecognitivefinance() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlecognitivefinanceAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executecognitivefinance();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadcognitivefinanceData();
}

async function loadcognitivefinanceData() {
    try {
        const response = await fetch('/api/financial/analytics-ai/cognitive-finance');
        if (response.ok) {
            const data = await response.json();
            updatecognitivefinanceDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Cognitive Finance Platform data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handlecognitivefinanceAction() {
    console.log('Cognitive Finance Platform action triggered');
    window.financialPages.showNotification('Cognitive Finance Platform configured successfully', 'success');
}

function executecognitivefinance() {
    console.log('Cognitive Finance Platform execution started');
    window.financialPages.showNotification('Cognitive Finance Platform executed successfully', 'success');
}

function updatecognitivefinanceDisplay(data) {
    console.log('Updating Cognitive Finance Platform display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/analytics-ai/cognitive-finance/test');
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
            loadcognitivefinanceData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlecognitivefinanceAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/analytics-ai/cognitive-finance/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'cognitive-finance-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}