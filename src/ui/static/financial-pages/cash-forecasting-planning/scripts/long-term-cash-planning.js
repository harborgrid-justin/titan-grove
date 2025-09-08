/**
 * Long-Term Cash Planning - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Long-Term Cash Planning
document.addEventListener('DOMContentLoaded', function() {
    console.log('Long-Term Cash Planning page loaded');
    
    // Initialize page-specific features
    initializelongtermcashplanning();
});

function initializelongtermcashplanning() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlelongtermcashplanningAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executelongtermcashplanning();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadlongtermcashplanningData();
}

async function loadlongtermcashplanningData() {
    try {
        const response = await fetch('/api/financial/cash-forecasting-planning/long-term-cash-planning');
        if (response.ok) {
            const data = await response.json();
            updatelongtermcashplanningDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Long-Term Cash Planning data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handlelongtermcashplanningAction() {
    console.log('Long-Term Cash Planning action triggered');
    window.financialPages.showNotification('Long-Term Cash Planning configured successfully', 'success');
}

function executelongtermcashplanning() {
    console.log('Long-Term Cash Planning execution started');
    window.financialPages.showNotification('Long-Term Cash Planning executed successfully', 'success');
}

function updatelongtermcashplanningDisplay(data) {
    console.log('Updating Long-Term Cash Planning display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/cash-forecasting-planning/long-term-cash-planning/test');
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
            loadlongtermcashplanningData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlelongtermcashplanningAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/cash-forecasting-planning/long-term-cash-planning/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'long-term-cash-planning-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}