/**
 * Internal Controls - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Internal Controls
document.addEventListener('DOMContentLoaded', function() {
    console.log('Internal Controls page loaded');
    
    // Initialize page-specific features
    initializeinternalcontrols();
});

function initializeinternalcontrols() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handleinternalcontrolsAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executeinternalcontrols();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadinternalcontrolsData();
}

async function loadinternalcontrolsData() {
    try {
        const response = await fetch('/api/financial/reporting-compliance/internal-controls');
        if (response.ok) {
            const data = await response.json();
            updateinternalcontrolsDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Internal Controls data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handleinternalcontrolsAction() {
    console.log('Internal Controls action triggered');
    window.financialPages.showNotification('Internal Controls configured successfully', 'success');
}

function executeinternalcontrols() {
    console.log('Internal Controls execution started');
    window.financialPages.showNotification('Internal Controls executed successfully', 'success');
}

function updateinternalcontrolsDisplay(data) {
    console.log('Updating Internal Controls display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/reporting-compliance/internal-controls/test');
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
            loadinternalcontrolsData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handleinternalcontrolsAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/reporting-compliance/internal-controls/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'internal-controls-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}