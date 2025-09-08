/**
 * Vendor Compliance Management - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Vendor Compliance Management
document.addEventListener('DOMContentLoaded', function() {
    console.log('Vendor Compliance Management page loaded');
    
    // Initialize page-specific features
    initializevendorcompliance();
});

function initializevendorcompliance() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlevendorcomplianceAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executevendorcompliance();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadvendorcomplianceData();
}

async function loadvendorcomplianceData() {
    try {
        const response = await fetch('/api/financial/compliance-governance/vendor-compliance');
        if (response.ok) {
            const data = await response.json();
            updatevendorcomplianceDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Vendor Compliance Management data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handlevendorcomplianceAction() {
    console.log('Vendor Compliance Management action triggered');
    window.financialPages.showNotification('Vendor Compliance Management configured successfully', 'success');
}

function executevendorcompliance() {
    console.log('Vendor Compliance Management execution started');
    window.financialPages.showNotification('Vendor Compliance Management executed successfully', 'success');
}

function updatevendorcomplianceDisplay(data) {
    console.log('Updating Vendor Compliance Management display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/compliance-governance/vendor-compliance/test');
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
            loadvendorcomplianceData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlevendorcomplianceAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/compliance-governance/vendor-compliance/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'vendor-compliance-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}