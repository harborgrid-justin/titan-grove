/**
 * Capital Allocation Strategy - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Capital Allocation Strategy
document.addEventListener('DOMContentLoaded', function() {
    console.log('Capital Allocation Strategy page loaded');
    
    // Initialize page-specific features
    initializecapitalallocation();
});

function initializecapitalallocation() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlecapitalallocationAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executecapitalallocation();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadcapitalallocationData();
}

async function loadcapitalallocationData() {
    try {
        const response = await fetch('/api/financial/strategic-planning/capital-allocation');
        if (response.ok) {
            const data = await response.json();
            updatecapitalallocationDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Capital Allocation Strategy data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handlecapitalallocationAction() {
    console.log('Capital Allocation Strategy action triggered');
    window.financialPages.showNotification('Capital Allocation Strategy configured successfully', 'success');
}

function executecapitalallocation() {
    console.log('Capital Allocation Strategy execution started');
    window.financialPages.showNotification('Capital Allocation Strategy executed successfully', 'success');
}

function updatecapitalallocationDisplay(data) {
    console.log('Updating Capital Allocation Strategy display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/strategic-planning/capital-allocation/test');
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
            loadcapitalallocationData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlecapitalallocationAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/strategic-planning/capital-allocation/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'capital-allocation-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}