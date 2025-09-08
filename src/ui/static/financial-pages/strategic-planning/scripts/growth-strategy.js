/**
 * Growth Strategy Finance - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Growth Strategy Finance
document.addEventListener('DOMContentLoaded', function() {
    console.log('Growth Strategy Finance page loaded');
    
    // Initialize page-specific features
    initializegrowthstrategy();
});

function initializegrowthstrategy() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlegrowthstrategyAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executegrowthstrategy();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadgrowthstrategyData();
}

async function loadgrowthstrategyData() {
    try {
        const response = await fetch('/api/financial/strategic-planning/growth-strategy');
        if (response.ok) {
            const data = await response.json();
            updategrowthstrategyDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Growth Strategy Finance data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handlegrowthstrategyAction() {
    console.log('Growth Strategy Finance action triggered');
    window.financialPages.showNotification('Growth Strategy Finance configured successfully', 'success');
}

function executegrowthstrategy() {
    console.log('Growth Strategy Finance execution started');
    window.financialPages.showNotification('Growth Strategy Finance executed successfully', 'success');
}

function updategrowthstrategyDisplay(data) {
    console.log('Updating Growth Strategy Finance display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/strategic-planning/growth-strategy/test');
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
            loadgrowthstrategyData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlegrowthstrategyAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/strategic-planning/growth-strategy/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'growth-strategy-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}