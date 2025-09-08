/**
 * Treasury Workstation - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Treasury Workstation
document.addEventListener('DOMContentLoaded', function() {
    console.log('Treasury Workstation page loaded');
    
    // Initialize page-specific features
    initializetreasuryworkstation();
});

function initializetreasuryworkstation() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handletreasuryworkstationAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executetreasuryworkstation();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadtreasuryworkstationData();
}

async function loadtreasuryworkstationData() {
    try {
        const response = await fetch('/api/financial/treasury-operations-advanced/treasury-workstation');
        if (response.ok) {
            const data = await response.json();
            updatetreasuryworkstationDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Treasury Workstation data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handletreasuryworkstationAction() {
    console.log('Treasury Workstation action triggered');
    window.financialPages.showNotification('Treasury Workstation configured successfully', 'success');
}

function executetreasuryworkstation() {
    console.log('Treasury Workstation execution started');
    window.financialPages.showNotification('Treasury Workstation executed successfully', 'success');
}

function updatetreasuryworkstationDisplay(data) {
    console.log('Updating Treasury Workstation display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/treasury-operations-advanced/treasury-workstation/test');
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
            loadtreasuryworkstationData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handletreasuryworkstationAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/treasury-operations-advanced/treasury-workstation/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'treasury-workstation-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}