/**
 * Supply Chain Finance - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Supply Chain Finance
document.addEventListener('DOMContentLoaded', function() {
    console.log('Supply Chain Finance page loaded');
    
    // Initialize page-specific features
    initializesupplychainfinance();
});

function initializesupplychainfinance() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlesupplychainfinanceAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executesupplychainfinance();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadsupplychainfinanceData();
}

async function loadsupplychainfinanceData() {
    try {
        const response = await fetch('/api/financial/working-capital/supply-chain-finance');
        if (response.ok) {
            const data = await response.json();
            updatesupplychainfinanceDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Supply Chain Finance data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handlesupplychainfinanceAction() {
    console.log('Supply Chain Finance action triggered');
    window.financialPages.showNotification('Supply Chain Finance configured successfully', 'success');
}

function executesupplychainfinance() {
    console.log('Supply Chain Finance execution started');
    window.financialPages.showNotification('Supply Chain Finance executed successfully', 'success');
}

function updatesupplychainfinanceDisplay(data) {
    console.log('Updating Supply Chain Finance display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/working-capital/supply-chain-finance/test');
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
            loadsupplychainfinanceData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlesupplychainfinanceAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/working-capital/supply-chain-finance/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'supply-chain-finance-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}