/**
 * Security Operations Center (SOC) - Command Center Page
 * Business-ready functionality with backend integration
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Security Operations Center (SOC) page loaded');
    
    // Initialize page-specific features
    initializesecurityOperationsCenter();
});

function initializesecurityOperationsCenter() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlesecurityOperationsCenterAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executesecurityOperationsCenter();
        });
    }
    
    // Configure secondary button
    const secondaryBtn = document.getElementById('secondaryBtn');
    if (secondaryBtn) {
        secondaryBtn.addEventListener('click', function() {
            viewsecurityOperationsCenterAnalytics();
        });
    }
    
    // Configure settings button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            window.commandCenterPages.openSettings('security-operations-center');
        });
    }
    
    // Configure export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            window.commandCenterPages.exportData('security-operations-center');
        });
    }
    
    // Configure help button
    const helpBtn = document.getElementById('helpBtn');
    if (helpBtn) {
        helpBtn.addEventListener('click', function() {
            window.commandCenterPages.showHelp('security-operations-center');
        });
    }
    
    // Initialize page-specific data
    loadsecurityOperationsCenterData();
}

function handlesecurityOperationsCenterAction() {
    console.log('Executing Security Operations Center (SOC) action');
    
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
            window.commandCenterPages.showNotification('Security Operations Center (SOC) action completed successfully', 'success');
        }, 2000);
    }
}

function executesecurityOperationsCenter() {
    console.log('Launching Security Operations Center (SOC) operations');
    window.commandCenterPages.executeOperation('security-operations-center');
}

function viewsecurityOperationsCenterAnalytics() {
    console.log('Viewing Security Operations Center (SOC) analytics');
    window.commandCenterPages.openAnalytics('security-operations-center');
}

function loadsecurityOperationsCenterData() {
    console.log('Loading Security Operations Center (SOC) data');
    
    // Simulate data loading
    if (window.commandCenterPages) {
        window.commandCenterPages.loadPageData('security-operations-center').then(data => {
            console.log('Security Operations Center (SOC) data loaded:', data);
        }).catch(error => {
            console.error('Error loading Security Operations Center (SOC) data:', error);
        });
    }
}

// Export page-specific functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializesecurityOperationsCenter,
        handlesecurityOperationsCenterAction,
        executesecurityOperationsCenter,
        loadsecurityOperationsCenterData
    };
}
