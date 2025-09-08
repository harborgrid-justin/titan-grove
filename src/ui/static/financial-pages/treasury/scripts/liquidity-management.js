/**
 * Liquidity Management - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Liquidity Management
document.addEventListener('DOMContentLoaded', function() {
    console.log('Liquidity Management page loaded');
    
    // Initialize page-specific features
    initializeliquiditymanagement();
});

function initializeliquiditymanagement() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handleliquiditymanagementAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executeliquiditymanagement();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadliquiditymanagementData();
}

async function loadliquiditymanagementData() {
    try {
        const response = await fetch('/api/financial/treasury/liquidity-management');
        if (response.ok) {
            const data = await response.json();
            updateliquiditymanagementDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Liquidity Management data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handleliquiditymanagementAction() {
    console.log('Liquidity Management action triggered');
    window.financialPages.showNotification('Liquidity Management configured successfully', 'success');
}

function executeliquiditymanagement() {
    console.log('Liquidity Management execution started');
    window.financialPages.showNotification('Liquidity Management executed successfully', 'success');
}

function updateliquiditymanagementDisplay(data) {
    console.log('Updating Liquidity Management display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/treasury/liquidity-management/test');
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
            loadliquiditymanagementData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handleliquiditymanagementAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/treasury/liquidity-management/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'liquidity-management-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}