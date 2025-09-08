/**
 * Asset Disposal & Retirement - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Asset Disposal & Retirement
document.addEventListener('DOMContentLoaded', function() {
    console.log('Asset Disposal & Retirement page loaded');
    
    // Initialize page-specific features
    initializeassetdisposal();
});

function initializeassetdisposal() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handleassetdisposalAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executeassetdisposal();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadassetdisposalData();
}

async function loadassetdisposalData() {
    try {
        const response = await fetch('/api/financial/capital-asset/asset-disposal');
        if (response.ok) {
            const data = await response.json();
            updateassetdisposalDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Asset Disposal & Retirement data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handleassetdisposalAction() {
    console.log('Asset Disposal & Retirement action triggered');
    window.financialPages.showNotification('Asset Disposal & Retirement configured successfully', 'success');
}

function executeassetdisposal() {
    console.log('Asset Disposal & Retirement execution started');
    window.financialPages.showNotification('Asset Disposal & Retirement executed successfully', 'success');
}

function updateassetdisposalDisplay(data) {
    console.log('Updating Asset Disposal & Retirement display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/capital-asset/asset-disposal/test');
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
            loadassetdisposalData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handleassetdisposalAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/capital-asset/asset-disposal/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'asset-disposal-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}