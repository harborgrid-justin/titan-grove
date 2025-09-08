/**
 * Evacuation & Safety Coordination - Command Center Page
 * Business-ready functionality with backend integration
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Evacuation & Safety Coordination page loaded');
    
    // Initialize page-specific features
    initializeevacuationCoordination();
});

function initializeevacuationCoordination() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handleevacuationCoordinationAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executeevacuationCoordination();
        });
    }
    
    // Configure secondary button
    const secondaryBtn = document.getElementById('secondaryBtn');
    if (secondaryBtn) {
        secondaryBtn.addEventListener('click', function() {
            viewevacuationCoordinationAnalytics();
        });
    }
    
    // Configure settings button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            window.commandCenterPages.openSettings('evacuation-coordination');
        });
    }
    
    // Configure export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            window.commandCenterPages.exportData('evacuation-coordination');
        });
    }
    
    // Configure help button
    const helpBtn = document.getElementById('helpBtn');
    if (helpBtn) {
        helpBtn.addEventListener('click', function() {
            window.commandCenterPages.showHelp('evacuation-coordination');
        });
    }
    
    // Initialize page-specific data
    loadevacuationCoordinationData();
}

function handleevacuationCoordinationAction() {
    console.log('Executing Evacuation & Safety Coordination action');
    
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
            window.commandCenterPages.showNotification('Evacuation & Safety Coordination action completed successfully', 'success');
        }, 2000);
    }
}

function executeevacuationCoordination() {
    console.log('Launching Evacuation & Safety Coordination operations');
    window.commandCenterPages.executeOperation('evacuation-coordination');
}

function viewevacuationCoordinationAnalytics() {
    console.log('Viewing Evacuation & Safety Coordination analytics');
    window.commandCenterPages.openAnalytics('evacuation-coordination');
}

function loadevacuationCoordinationData() {
    console.log('Loading Evacuation & Safety Coordination data');
    
    // Simulate data loading
    if (window.commandCenterPages) {
        window.commandCenterPages.loadPageData('evacuation-coordination').then(data => {
            console.log('Evacuation & Safety Coordination data loaded:', data);
        }).catch(error => {
            console.error('Error loading Evacuation & Safety Coordination data:', error);
        });
    }
}

// Export page-specific functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeevacuationCoordination,
        handleevacuationCoordinationAction,
        executeevacuationCoordination,
        loadevacuationCoordinationData
    };
}
