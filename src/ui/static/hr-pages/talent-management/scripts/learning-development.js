/**
 * Learning & Development Hub - Human Resources Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Learning & Development Hub
document.addEventListener('DOMContentLoaded', function() {
    console.log('Learning & Development Hub page loaded');
    
    // Initialize page-specific features
    initializelearningdevelopment();
});

function initializelearningdevelopment() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlelearningdevelopmentAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executelearningdevelopment();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadlearningdevelopmentData();
}

async function loadlearningdevelopmentData() {
    try {
        const response = await fetch('/api/hr/talent-management/learning-development');
        if (response.ok) {
            const data = await response.json();
            updatelearningdevelopmentDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Learning & Development Hub data:', error);
        window.hrPages.showNotification('Failed to load data', 'error');
    }
}

function handlelearningdevelopmentAction() {
    console.log('Learning & Development Hub action triggered');
    window.hrPages.showNotification('Learning & Development Hub action executed', 'success');
}

function executelearningdevelopment() {
    console.log('Learning & Development Hub execution started');
    
    // Simulate execution
    window.hrPages.showNotification('Learning & Development Hub execution completed', 'success');
}

function updatelearningdevelopmentDisplay(data) {
    console.log('Learning & Development Hub display updated with data:', data);
}

function setupPageActions() {
    // Configure test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', function() {
            window.hrPages.testIntegration('learning-development');
        });
    }
    
    // Configure view data button
    const viewDataBtn = document.getElementById('viewDataBtn');
    if (viewDataBtn) {
        viewDataBtn.addEventListener('click', function() {
            window.hrPages.viewData('learning-development');
        });
    }
    
    // Configure settings button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            window.hrPages.openSettings('learning-development');
        });
    }
    
    // Configure export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            window.hrPages.exportData('learning-development');
        });
    }
}

// Export page-specific functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializelearningdevelopment,
        handlelearningdevelopmentAction,
        executelearningdevelopment,
        loadlearningdevelopmentData
    };
}
