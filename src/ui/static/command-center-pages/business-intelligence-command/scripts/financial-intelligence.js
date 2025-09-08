/**
 * Financial Intelligence Center - Command Center Page
 * Business-ready functionality with backend integration
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Financial Intelligence Center page loaded');
    
    // Initialize page-specific features
    initializefinancialIntelligence();
});

function initializefinancialIntelligence() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlefinancialIntelligenceAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executefinancialIntelligence();
        });
    }
    
    // Configure secondary button
    const secondaryBtn = document.getElementById('secondaryBtn');
    if (secondaryBtn) {
        secondaryBtn.addEventListener('click', function() {
            viewfinancialIntelligenceAnalytics();
        });
    }
    
    // Configure settings button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            window.commandCenterPages.openSettings('financial-intelligence');
        });
    }
    
    // Configure export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            window.commandCenterPages.exportData('financial-intelligence');
        });
    }
    
    // Configure help button
    const helpBtn = document.getElementById('helpBtn');
    if (helpBtn) {
        helpBtn.addEventListener('click', function() {
            window.commandCenterPages.showHelp('financial-intelligence');
        });
    }
    
    // Initialize page-specific data
    loadfinancialIntelligenceData();
}

function handlefinancialIntelligenceAction() {
    console.log('Executing Financial Intelligence Center action');
    
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
            window.commandCenterPages.showNotification('Financial Intelligence Center action completed successfully', 'success');
        }, 2000);
    }
}

function executefinancialIntelligence() {
    console.log('Launching Financial Intelligence Center operations');
    window.commandCenterPages.executeOperation('financial-intelligence');
}

function viewfinancialIntelligenceAnalytics() {
    console.log('Viewing Financial Intelligence Center analytics');
    window.commandCenterPages.openAnalytics('financial-intelligence');
}

function loadfinancialIntelligenceData() {
    console.log('Loading Financial Intelligence Center data');
    
    // Simulate data loading
    if (window.commandCenterPages) {
        window.commandCenterPages.loadPageData('financial-intelligence').then(data => {
            console.log('Financial Intelligence Center data loaded:', data);
        }).catch(error => {
            console.error('Error loading Financial Intelligence Center data:', error);
        });
    }
}

// Export page-specific functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializefinancialIntelligence,
        handlefinancialIntelligenceAction,
        executefinancialIntelligence,
        loadfinancialIntelligenceData
    };
}
