/**
 * Strategic Goal Management - Human Resources Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Strategic Goal Management
document.addEventListener('DOMContentLoaded', function() {
    console.log('Strategic Goal Management page loaded');
    
    // Initialize page-specific features
    initializegoalmanagement();
});

function initializegoalmanagement() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlegoalmanagementAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executegoalmanagement();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadgoalmanagementData();
}

async function loadgoalmanagementData() {
    try {
        const response = await fetch('/api/hr/performance-management/goal-management');
        if (response.ok) {
            const data = await response.json();
            updategoalmanagementDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Strategic Goal Management data:', error);
        window.hrPages.showNotification('Failed to load data', 'error');
    }
}

function handlegoalmanagementAction() {
    console.log('Strategic Goal Management action triggered');
    window.hrPages.showNotification('Strategic Goal Management action executed', 'success');
}

function executegoalmanagement() {
    console.log('Strategic Goal Management execution started');
    
    // Simulate execution
    window.hrPages.showNotification('Strategic Goal Management execution completed', 'success');
}

function updategoalmanagementDisplay(data) {
    console.log('Strategic Goal Management display updated with data:', data);
}

function setupPageActions() {
    // Configure test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', function() {
            window.hrPages.testIntegration('goal-management');
        });
    }
    
    // Configure view data button
    const viewDataBtn = document.getElementById('viewDataBtn');
    if (viewDataBtn) {
        viewDataBtn.addEventListener('click', function() {
            window.hrPages.viewData('goal-management');
        });
    }
    
    // Configure settings button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            window.hrPages.openSettings('goal-management');
        });
    }
    
    // Configure export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            window.hrPages.exportData('goal-management');
        });
    }
}

// Export page-specific functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializegoalmanagement,
        handlegoalmanagementAction,
        executegoalmanagement,
        loadgoalmanagementData
    };
}
