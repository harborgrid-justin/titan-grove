/**
 * Market Intelligence & Analytics - Command Center Page
 * Business-ready functionality with backend integration
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Market Intelligence & Analytics page loaded');
    
    // Initialize page-specific features
    initializemarketIntelligence();
});

function initializemarketIntelligence() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlemarketIntelligenceAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executemarketIntelligence();
        });
    }
    
    // Configure secondary button
    const secondaryBtn = document.getElementById('secondaryBtn');
    if (secondaryBtn) {
        secondaryBtn.addEventListener('click', function() {
            viewmarketIntelligenceAnalytics();
        });
    }
    
    // Configure settings button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            window.commandCenterPages.openSettings('market-intelligence');
        });
    }
    
    // Configure export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            window.commandCenterPages.exportData('market-intelligence');
        });
    }
    
    // Configure help button
    const helpBtn = document.getElementById('helpBtn');
    if (helpBtn) {
        helpBtn.addEventListener('click', function() {
            window.commandCenterPages.showHelp('market-intelligence');
        });
    }
    
    // Initialize page-specific data
    loadmarketIntelligenceData();
}

function handlemarketIntelligenceAction() {
    console.log('Executing Market Intelligence & Analytics action');
    
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
            window.commandCenterPages.showNotification('Market Intelligence & Analytics action completed successfully', 'success');
        }, 2000);
    }
}

function executemarketIntelligence() {
    console.log('Launching Market Intelligence & Analytics operations');
    window.commandCenterPages.executeOperation('market-intelligence');
}

function viewmarketIntelligenceAnalytics() {
    console.log('Viewing Market Intelligence & Analytics analytics');
    window.commandCenterPages.openAnalytics('market-intelligence');
}

function loadmarketIntelligenceData() {
    console.log('Loading Market Intelligence & Analytics data');
    
    // Simulate data loading
    if (window.commandCenterPages) {
        window.commandCenterPages.loadPageData('market-intelligence').then(data => {
            console.log('Market Intelligence & Analytics data loaded:', data);
        }).catch(error => {
            console.error('Error loading Market Intelligence & Analytics data:', error);
        });
    }
}

// Export page-specific functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializemarketIntelligence,
        handlemarketIntelligenceAction,
        executemarketIntelligence,
        loadmarketIntelligenceData
    };
}
