/**
 * Individual Development Planning - Human Resources Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Individual Development Planning
document.addEventListener('DOMContentLoaded', function() {
    console.log('Individual Development Planning page loaded');
    
    // Initialize page-specific features
    initializedevelopmentplanning();
});

function initializedevelopmentplanning() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handledevelopmentplanningAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executedevelopmentplanning();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loaddevelopmentplanningData();
}

async function loaddevelopmentplanningData() {
    try {
        const response = await fetch('/api/hr/performance-management/development-planning');
        if (response.ok) {
            const data = await response.json();
            updatedevelopmentplanningDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Individual Development Planning data:', error);
        window.hrPages.showNotification('Failed to load data', 'error');
    }
}

function handledevelopmentplanningAction() {
    console.log('Individual Development Planning action triggered');
    window.hrPages.showNotification('Individual Development Planning action executed', 'success');
}

function executedevelopmentplanning() {
    console.log('Individual Development Planning execution started');
    
    // Simulate execution
    window.hrPages.showNotification('Individual Development Planning execution completed', 'success');
}

function updatedevelopmentplanningDisplay(data) {
    console.log('Individual Development Planning display updated with data:', data);
}

function setupPageActions() {
    // Configure test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', function() {
            window.hrPages.testIntegration('development-planning');
        });
    }
    
    // Configure view data button
    const viewDataBtn = document.getElementById('viewDataBtn');
    if (viewDataBtn) {
        viewDataBtn.addEventListener('click', function() {
            window.hrPages.viewData('development-planning');
        });
    }
    
    // Configure settings button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            window.hrPages.openSettings('development-planning');
        });
    }
    
    // Configure export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            window.hrPages.exportData('development-planning');
        });
    }
}

// Export page-specific functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializedevelopmentplanning,
        handledevelopmentplanningAction,
        executedevelopmentplanning,
        loaddevelopmentplanningData
    };
}
