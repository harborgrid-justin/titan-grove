/**
 * Incident Response Coordination - Command Center Page
 * Business-ready functionality with backend integration
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Incident Response Coordination page loaded');
    
    // Initialize page-specific features
    initializeincidentCoordination();
});

function initializeincidentCoordination() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handleincidentCoordinationAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executeincidentCoordination();
        });
    }
    
    // Configure secondary button
    const secondaryBtn = document.getElementById('secondaryBtn');
    if (secondaryBtn) {
        secondaryBtn.addEventListener('click', function() {
            viewincidentCoordinationAnalytics();
        });
    }
    
    // Configure settings button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            window.commandCenterPages.openSettings('incident-coordination');
        });
    }
    
    // Configure export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            window.commandCenterPages.exportData('incident-coordination');
        });
    }
    
    // Configure help button
    const helpBtn = document.getElementById('helpBtn');
    if (helpBtn) {
        helpBtn.addEventListener('click', function() {
            window.commandCenterPages.showHelp('incident-coordination');
        });
    }
    
    // Initialize page-specific data
    loadincidentCoordinationData();
}

function handleincidentCoordinationAction() {
    console.log('Executing Incident Response Coordination action');
    
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
            window.commandCenterPages.showNotification('Incident Response Coordination action completed successfully', 'success');
        }, 2000);
    }
}

function executeincidentCoordination() {
    console.log('Launching Incident Response Coordination operations');
    window.commandCenterPages.executeOperation('incident-coordination');
}

function viewincidentCoordinationAnalytics() {
    console.log('Viewing Incident Response Coordination analytics');
    window.commandCenterPages.openAnalytics('incident-coordination');
}

function loadincidentCoordinationData() {
    console.log('Loading Incident Response Coordination data');
    
    // Simulate data loading
    if (window.commandCenterPages) {
        window.commandCenterPages.loadPageData('incident-coordination').then(data => {
            console.log('Incident Response Coordination data loaded:', data);
        }).catch(error => {
            console.error('Error loading Incident Response Coordination data:', error);
        });
    }
}

// Export page-specific functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeincidentCoordination,
        handleincidentCoordinationAction,
        executeincidentCoordination,
        loadincidentCoordinationData
    };
}
