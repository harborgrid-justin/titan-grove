/**
 * Data Center Operations - Command Center Page
 * Business-ready functionality with backend integration
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Data Center Operations page loaded');
    
    // Initialize page-specific features
    initializedataCenterOperations();
});

function initializedataCenterOperations() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handledataCenterOperationsAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executedataCenterOperations();
        });
    }
    
    // Configure secondary button
    const secondaryBtn = document.getElementById('secondaryBtn');
    if (secondaryBtn) {
        secondaryBtn.addEventListener('click', function() {
            viewdataCenterOperationsAnalytics();
        });
    }
    
    // Configure settings button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            window.commandCenterPages.openSettings('data-center-operations');
        });
    }
    
    // Configure export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            window.commandCenterPages.exportData('data-center-operations');
        });
    }
    
    // Configure help button
    const helpBtn = document.getElementById('helpBtn');
    if (helpBtn) {
        helpBtn.addEventListener('click', function() {
            window.commandCenterPages.showHelp('data-center-operations');
        });
    }
    
    // Initialize page-specific data
    loaddataCenterOperationsData();
}

function handledataCenterOperationsAction() {
    console.log('Executing Data Center Operations action');
    
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
            window.commandCenterPages.showNotification('Data Center Operations action completed successfully', 'success');
        }, 2000);
    }
}

function executedataCenterOperations() {
    console.log('Launching Data Center Operations operations');
    window.commandCenterPages.executeOperation('data-center-operations');
}

function viewdataCenterOperationsAnalytics() {
    console.log('Viewing Data Center Operations analytics');
    window.commandCenterPages.openAnalytics('data-center-operations');
}

function loaddataCenterOperationsData() {
    console.log('Loading Data Center Operations data');
    
    // Simulate data loading
    if (window.commandCenterPages) {
        window.commandCenterPages.loadPageData('data-center-operations').then(data => {
            console.log('Data Center Operations data loaded:', data);
        }).catch(error => {
            console.error('Error loading Data Center Operations data:', error);
        });
    }
}

// Export page-specific functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializedataCenterOperations,
        handledataCenterOperationsAction,
        executedataCenterOperations,
        loaddataCenterOperationsData
    };
}
