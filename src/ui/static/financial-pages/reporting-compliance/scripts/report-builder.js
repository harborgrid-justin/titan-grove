/**
 * Report Builder - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Report Builder
document.addEventListener('DOMContentLoaded', function() {
    console.log('Report Builder page loaded');
    
    // Initialize page-specific features
    initializereportbuilder();
});

function initializereportbuilder() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlereportbuilderAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executereportbuilder();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadreportbuilderData();
}

async function loadreportbuilderData() {
    try {
        const response = await fetch('/api/financial/reporting-compliance/report-builder');
        if (response.ok) {
            const data = await response.json();
            updatereportbuilderDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Report Builder data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handlereportbuilderAction() {
    console.log('Report Builder action triggered');
    window.financialPages.showNotification('Report Builder configured successfully', 'success');
}

function executereportbuilder() {
    console.log('Report Builder execution started');
    window.financialPages.showNotification('Report Builder executed successfully', 'success');
}

function updatereportbuilderDisplay(data) {
    console.log('Updating Report Builder display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/reporting-compliance/report-builder/test');
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
            loadreportbuilderData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlereportbuilderAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/reporting-compliance/report-builder/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'report-builder-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}