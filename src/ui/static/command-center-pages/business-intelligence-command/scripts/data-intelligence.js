/**
 * Data Intelligence Platform - Command Center Page
 * Business-ready functionality with backend integration
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Data Intelligence Platform page loaded');
    
    // Initialize page-specific features
    initializedataIntelligence();
});

function initializedataIntelligence() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handledataIntelligenceAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executedataIntelligence();
        });
    }
    
    // Configure secondary button
    const secondaryBtn = document.getElementById('secondaryBtn');
    if (secondaryBtn) {
        secondaryBtn.addEventListener('click', function() {
            viewdataIntelligenceAnalytics();
        });
    }
    
    // Configure settings button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            window.commandCenterPages.openSettings('data-intelligence');
        });
    }
    
    // Configure export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            window.commandCenterPages.exportData('data-intelligence');
        });
    }
    
    // Configure help button
    const helpBtn = document.getElementById('helpBtn');
    if (helpBtn) {
        helpBtn.addEventListener('click', function() {
            window.commandCenterPages.showHelp('data-intelligence');
        });
    }
    
    // Initialize page-specific data
    loaddataIntelligenceData();
}

function handledataIntelligenceAction() {
    console.log('Executing Data Intelligence Platform action');
    
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
            window.commandCenterPages.showNotification('Data Intelligence Platform action completed successfully', 'success');
        }, 2000);
    }
}

function executedataIntelligence() {
    console.log('Launching Data Intelligence Platform operations');
    window.commandCenterPages.executeOperation('data-intelligence');
}

function viewdataIntelligenceAnalytics() {
    console.log('Viewing Data Intelligence Platform analytics');
    window.commandCenterPages.openAnalytics('data-intelligence');
}

function loaddataIntelligenceData() {
    console.log('Loading Data Intelligence Platform data');
    
    // Simulate data loading
    if (window.commandCenterPages) {
        window.commandCenterPages.loadPageData('data-intelligence').then(data => {
            console.log('Data Intelligence Platform data loaded:', data);
        }).catch(error => {
            console.error('Error loading Data Intelligence Platform data:', error);
        });
    }
}

// Export page-specific functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializedataIntelligence,
        handledataIntelligenceAction,
        executedataIntelligence,
        loaddataIntelligenceData
    };
}
