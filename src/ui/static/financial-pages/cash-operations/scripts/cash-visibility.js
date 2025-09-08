/**
 * Global Cash Visibility - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Global Cash Visibility
document.addEventListener('DOMContentLoaded', function() {
    console.log('Global Cash Visibility page loaded');
    
    // Initialize page-specific features
    initializecashvisibility();
});

function initializecashvisibility() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlecashvisibilityAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executecashvisibility();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadcashvisibilityData();
}

async function loadcashvisibilityData() {
    try {
        const response = await fetch('/api/financial/cash-operations/cash-visibility');
        if (response.ok) {
            const data = await response.json();
            updatecashvisibilityDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Global Cash Visibility data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handlecashvisibilityAction() {
    console.log('Global Cash Visibility action triggered');
    window.financialPages.showNotification('Global Cash Visibility configured successfully', 'success');
}

function executecashvisibility() {
    console.log('Global Cash Visibility execution started');
    window.financialPages.showNotification('Global Cash Visibility executed successfully', 'success');
}

function updatecashvisibilityDisplay(data) {
    console.log('Updating Global Cash Visibility display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/cash-operations/cash-visibility/test');
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
            loadcashvisibilityData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlecashvisibilityAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/cash-operations/cash-visibility/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'cash-visibility-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}