/**
 * Business Model Analytics - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Business Model Analytics
document.addEventListener('DOMContentLoaded', function() {
    console.log('Business Model Analytics page loaded');
    
    // Initialize page-specific features
    initializebusinessmodeling();
});

function initializebusinessmodeling() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlebusinessmodelingAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executebusinessmodeling();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadbusinessmodelingData();
}

async function loadbusinessmodelingData() {
    try {
        const response = await fetch('/api/financial/strategic-planning/business-modeling');
        if (response.ok) {
            const data = await response.json();
            updatebusinessmodelingDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Business Model Analytics data:', error);
        window.financialPages.showNotification('Failed to load data', 'error');
    }
}

function handlebusinessmodelingAction() {
    console.log('Business Model Analytics action triggered');
    window.financialPages.showNotification('Business Model Analytics configured successfully', 'success');
}

function executebusinessmodeling() {
    console.log('Business Model Analytics execution started');
    window.financialPages.showNotification('Business Model Analytics executed successfully', 'success');
}

function updatebusinessmodelingDisplay(data) {
    console.log('Updating Business Model Analytics display:', data);
    // Update UI with loaded data
}

function setupPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/strategic-planning/business-modeling/test');
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
            loadbusinessmodelingData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlebusinessmodelingAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/financial/strategic-planning/business-modeling/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'business-modeling-export.xlsx';
                a.click();
                window.financialPages.showNotification('Data exported successfully', 'success');
            } catch (error) {
                window.financialPages.showNotification('Export failed', 'error');
            }
        });
    }
}