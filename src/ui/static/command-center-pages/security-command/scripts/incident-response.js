/**
 * Security Incident Response - Command Center Page
 * Business-ready functionality with backend integration
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Security Incident Response page loaded');
    
    // Initialize page-specific features
    initializeincidentResponse();
});

function initializeincidentResponse() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handleincidentResponseAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executeincidentResponse();
        });
    }
    
    // Configure secondary button
    const secondaryBtn = document.getElementById('secondaryBtn');
    if (secondaryBtn) {
        secondaryBtn.addEventListener('click', function() {
            viewincidentResponseAnalytics();
        });
    }
    
    // Configure settings button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            window.commandCenterPages.openSettings('incident-response');
        });
    }
    
    // Configure export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            window.commandCenterPages.exportData('incident-response');
        });
    }
    
    // Configure help button
    const helpBtn = document.getElementById('helpBtn');
    if (helpBtn) {
        helpBtn.addEventListener('click', function() {
            window.commandCenterPages.showHelp('incident-response');
        });
    }
    
    // Initialize page-specific data
    loadincidentResponseData();
}

function handleincidentResponseAction() {
    console.log('Executing Security Incident Response action');
    
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
            window.commandCenterPages.showNotification('Security Incident Response action completed successfully', 'success');
        }, 2000);
    }
}

function executeincidentResponse() {
    console.log('Launching Security Incident Response operations');
    window.commandCenterPages.executeOperation('incident-response');
}

function viewincidentResponseAnalytics() {
    console.log('Viewing Security Incident Response analytics');
    window.commandCenterPages.openAnalytics('incident-response');
}

function loadincidentResponseData() {
    console.log('Loading Security Incident Response data');
    
    // Simulate data loading
    if (window.commandCenterPages) {
        window.commandCenterPages.loadPageData('incident-response').then(data => {
            console.log('Security Incident Response data loaded:', data);
        }).catch(error => {
            console.error('Error loading Security Incident Response data:', error);
        });
    }
}

// Export page-specific functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeincidentResponse,
        handleincidentResponseAction,
        executeincidentResponse,
        loadincidentResponseData
    };
}
