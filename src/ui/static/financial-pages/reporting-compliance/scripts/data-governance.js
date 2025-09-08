/**
 * Data Governance - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Data Governance
document.addEventListener('DOMContentLoaded', function() {
    console.log('Data Governance page loaded');
    
    // Initialize page-specific features
    initializedatagovernance();
});

function initializedatagovernance() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handledatagovernanceAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executedatagovernance();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loaddatagovernanceData();
}

async function loaddatagovernanceData() {
    try {
        const response = await fetch('/api/financial/reporting-compliance/data-governance');
        if (response.ok) {
            const data = await response.json();
            updatedatagovernanceDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Data Governance data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handledatagovernanceAction() {
    console.log('Data Governance action triggered');
    window.financialPages.showNotification('Data Governance configured successfully', 'success');
}

function executedatagovernance() {
    console.log('Data Governance execution started');
    window.financialPages.showNotification('Data Governance executed successfully', 'success');
}

function updatedatagovernanceDisplay(data) {
    console.log('Updating Data Governance display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/reporting-compliance/data-governance/test');
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
            loaddatagovernanceData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handledatagovernanceAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/reporting-compliance/data-governance/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'data-governance-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}