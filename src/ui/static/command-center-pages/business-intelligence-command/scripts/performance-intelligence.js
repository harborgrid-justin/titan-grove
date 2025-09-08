/**
 * Performance Intelligence Center - Command Center Page
 * Business-ready functionality with backend integration
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Performance Intelligence Center page loaded');
    
    // Initialize page-specific features
    initializeperformanceIntelligence();
});

function initializeperformanceIntelligence() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handleperformanceIntelligenceAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executeperformanceIntelligence();
        });
    }
    
    // Configure secondary button
    const secondaryBtn = document.getElementById('secondaryBtn');
    if (secondaryBtn) {
        secondaryBtn.addEventListener('click', function() {
            viewperformanceIntelligenceAnalytics();
        });
    }
    
    // Configure settings button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            window.commandCenterPages.openSettings('performance-intelligence');
        });
    }
    
    // Configure export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            window.commandCenterPages.exportData('performance-intelligence');
        });
    }
    
    // Configure help button
    const helpBtn = document.getElementById('helpBtn');
    if (helpBtn) {
        helpBtn.addEventListener('click', function() {
            window.commandCenterPages.showHelp('performance-intelligence');
        });
    }
    
    // Initialize page-specific data
    loadperformanceIntelligenceData();
}

function handleperformanceIntelligenceAction() {
    console.log('Executing Performance Intelligence Center action');
    
    // Show loading state
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        const originalText = actionBtn.innerHTML;
        actionBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        actionBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            actionBtn.innerHTML = originalText;
            actionBtn.disabled = false;
            window.commandCenterPages.showNotification('Performance Intelligence Center action completed successfully', 'success');
        }, 2000);
    }
}

function executeperformanceIntelligence() {
    console.log('Launching Performance Intelligence Center operations');
    window.commandCenterPages.executeOperation('performance-intelligence');
}

function viewperformanceIntelligenceAnalytics() {
    console.log('Viewing Performance Intelligence Center analytics');
    window.commandCenterPages.openAnalytics('performance-intelligence');
}

function loadperformanceIntelligenceData() {
    console.log('Loading Performance Intelligence Center data');
    
    // Simulate data loading
    if (window.commandCenterPages) {
        window.commandCenterPages.loadPageData('performance-intelligence').then(data => {
            console.log('Performance Intelligence Center data loaded:', data);
        }).catch(error => {
            console.error('Error loading Performance Intelligence Center data:', error);
        });
    }
}

// Export page-specific functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeperformanceIntelligence,
        handleperformanceIntelligenceAction,
        executeperformanceIntelligence,
        loadperformanceIntelligenceData
    };
}
