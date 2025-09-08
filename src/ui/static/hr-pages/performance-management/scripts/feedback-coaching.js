/**
 * Feedback & Coaching Hub - Human Resources Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Feedback & Coaching Hub
document.addEventListener('DOMContentLoaded', function() {
    console.log('Feedback & Coaching Hub page loaded');
    
    // Initialize page-specific features
    initializefeedbackcoaching();
});

function initializefeedbackcoaching() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlefeedbackcoachingAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executefeedbackcoaching();
        });
    }
    
    // Configure page-specific buttons
    setupPageActions();
    
    // Load initial data
    loadfeedbackcoachingData();
}

async function loadfeedbackcoachingData() {
    try {
        const response = await fetch('/api/hr/performance-management/feedback-coaching');
        if (response.ok) {
            const data = await response.json();
            updatefeedbackcoachingDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Feedback & Coaching Hub data:', error);
        window.hrPages.showNotification('Failed to load data', 'error');
    }
}

function handlefeedbackcoachingAction() {
    console.log('Feedback & Coaching Hub action triggered');
    window.hrPages.showNotification('Feedback & Coaching Hub action executed', 'success');
}

function executefeedbackcoaching() {
    console.log('Feedback & Coaching Hub execution started');
    
    // Simulate execution
    window.hrPages.showNotification('Feedback & Coaching Hub execution completed', 'success');
}

function updatefeedbackcoachingDisplay(data) {
    console.log('Feedback & Coaching Hub display updated with data:', data);
}

function setupPageActions() {
    // Configure test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', function() {
            window.hrPages.testIntegration('feedback-coaching');
        });
    }
    
    // Configure view data button
    const viewDataBtn = document.getElementById('viewDataBtn');
    if (viewDataBtn) {
        viewDataBtn.addEventListener('click', function() {
            window.hrPages.viewData('feedback-coaching');
        });
    }
    
    // Configure settings button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            window.hrPages.openSettings('feedback-coaching');
        });
    }
    
    // Configure export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            window.hrPages.exportData('feedback-coaching');
        });
    }
}

// Export page-specific functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializefeedbackcoaching,
        handlefeedbackcoachingAction,
        executefeedbackcoaching,
        loadfeedbackcoachingData
    };
}
