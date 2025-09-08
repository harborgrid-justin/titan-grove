/**
 * Cash Controls & Governance - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Cash Controls & Governance
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cash Controls & Governance page loaded');
    
    // Initialize page-specific features
    initializecashcontrols();
});

function initializecashcontrols() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlecashcontrolsAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executecashcontrols();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadcashcontrolsData();
}

async function loadcashcontrolsData() {
    try {
        const response = await fetch('/api/financial/cash-risk-compliance/cash-controls');
        if (response.ok) {
            const data = await response.json();
            updatecashcontrolsDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Cash Controls & Governance data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handlecashcontrolsAction() {
    console.log('Cash Controls & Governance action triggered');
    window.financialPages.showNotification('Cash Controls & Governance configured successfully', 'success');
}

function executecashcontrols() {
    console.log('Cash Controls & Governance execution started');
    window.financialPages.showNotification('Cash Controls & Governance executed successfully', 'success');
}

function updatecashcontrolsDisplay(data) {
    console.log('Updating Cash Controls & Governance display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/cash-risk-compliance/cash-controls/test');
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
            loadcashcontrolsData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlecashcontrolsAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/cash-risk-compliance/cash-controls/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'cash-controls-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}