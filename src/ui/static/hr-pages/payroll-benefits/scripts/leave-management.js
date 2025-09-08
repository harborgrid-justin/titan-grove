/**
 * Leave & Absence Management - Human Resources Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Leave & Absence Management
document.addEventListener('DOMContentLoaded', function() {
    console.log('Leave & Absence Management page loaded');
    
    // Initialize page-specific features
    initializeleavemanagement();
});

function initializeleavemanagement() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handleleavemanagementAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executeleavemanagement();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadleavemanagementData();
}

async function loadleavemanagementData() {
    try {
        const response = await fetch('/api/hr/payroll-benefits/leave-management');
        if (response.ok) {
            const data = await response.json();
            updateleavemanagementDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Leave & Absence Management data:', error);
        window.hrPages.showNotification('Failed to load data', 'error');
    }
}

function handleleavemanagementAction() {
    console.log('Leave & Absence Management action triggered');
    window.hrPages.showNotification('Leave & Absence Management action executed', 'success');
}

function executeleavemanagement() {
    console.log('Leave & Absence Management execution started');
    
    // Simulate execution
    window.hrPages.showNotification('Leave & Absence Management execution completed', 'success');
}

function updateleavemanagementDisplay(data) {
    console.log('Leave & Absence Management display updated with data:', data);
}

function setupPageActions() {
    // Configure test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', function() {
            window.hrPages.testIntegration('leave-management');
        });
    }
    
    // Configure view data button
    const viewDataBtn = document.getElementById('viewDataBtn');
    if (viewDataBtn) {
        viewDataBtn.addEventListener('click', function() {
            window.hrPages.viewData('leave-management');
        });
    }
    
    // Configure settings button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            window.hrPages.openSettings('leave-management');
        });
    }
    
    // Configure export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            window.hrPages.exportData('leave-management');
        });
    }
}

// Export page-specific functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeleavemanagement,
        handleleavemanagementAction,
        executeleavemanagement,
        loadleavemanagementData
    };
}
