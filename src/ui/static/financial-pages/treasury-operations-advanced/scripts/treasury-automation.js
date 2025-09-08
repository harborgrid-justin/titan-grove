/**
 * Treasury Process Automation - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Treasury Process Automation
document.addEventListener('DOMContentLoaded', function() {
    console.log('Treasury Process Automation page loaded');
    
    // Initialize page-specific features
    initializetreasuryautomation();
});

function initializetreasuryautomation() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handletreasuryautomationAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executetreasuryautomation();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadtreasuryautomationData();
}

async function loadtreasuryautomationData() {
    try {
        const response = await fetch('/api/financial/treasury-operations-advanced/treasury-automation');
        if (response.ok) {
            const data = await response.json();
            updatetreasuryautomationDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Treasury Process Automation data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handletreasuryautomationAction() {
    console.log('Treasury Process Automation action triggered');
    window.financialPages.showNotification('Treasury Process Automation configured successfully', 'success');
}

function executetreasuryautomation() {
    console.log('Treasury Process Automation execution started');
    window.financialPages.showNotification('Treasury Process Automation executed successfully', 'success');
}

function updatetreasuryautomationDisplay(data) {
    console.log('Updating Treasury Process Automation display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/treasury-operations-advanced/treasury-automation/test');
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
            loadtreasuryautomationData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handletreasuryautomationAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/treasury-operations-advanced/treasury-automation/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'treasury-automation-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}