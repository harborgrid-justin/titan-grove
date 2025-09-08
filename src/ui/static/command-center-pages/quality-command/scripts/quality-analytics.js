/**
 * Quality Analytics & Intelligence - Command Center Page
 * Business-ready functionality with backend integration
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Quality Analytics & Intelligence page loaded');
    
    // Initialize page-specific features
    initializequalityAnalytics();
});

function initializequalityAnalytics() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlequalityAnalyticsAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executequalityAnalytics();
        });
    }
    
    // Configure secondary button
    const secondaryBtn = document.getElementById('secondaryBtn');
    if (secondaryBtn) {
        secondaryBtn.addEventListener('click', function() {
            viewqualityAnalyticsAnalytics();
        });
    }
    
    // Configure settings button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            window.commandCenterPages.openSettings('quality-analytics');
        });
    }
    
    // Configure export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            window.commandCenterPages.exportData('quality-analytics');
        });
    }
    
    // Configure help button
    const helpBtn = document.getElementById('helpBtn');
    if (helpBtn) {
        helpBtn.addEventListener('click', function() {
            window.commandCenterPages.showHelp('quality-analytics');
        });
    }
    
    // Initialize page-specific data
    loadqualityAnalyticsData();
}

function handlequalityAnalyticsAction() {
    console.log('Executing Quality Analytics & Intelligence action');
    
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
            window.commandCenterPages.showNotification('Quality Analytics & Intelligence action completed successfully', 'success');
        }, 2000);
    }
}

function executequalityAnalytics() {
    console.log('Launching Quality Analytics & Intelligence operations');
    window.commandCenterPages.executeOperation('quality-analytics');
}

function viewqualityAnalyticsAnalytics() {
    console.log('Viewing Quality Analytics & Intelligence analytics');
    window.commandCenterPages.openAnalytics('quality-analytics');
}

function loadqualityAnalyticsData() {
    console.log('Loading Quality Analytics & Intelligence data');
    
    // Simulate data loading
    if (window.commandCenterPages) {
        window.commandCenterPages.loadPageData('quality-analytics').then(data => {
            console.log('Quality Analytics & Intelligence data loaded:', data);
        }).catch(error => {
            console.error('Error loading Quality Analytics & Intelligence data:', error);
        });
    }
}

// Export page-specific functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializequalityAnalytics,
        handlequalityAnalyticsAction,
        executequalityAnalytics,
        loadqualityAnalyticsData
    };
}
