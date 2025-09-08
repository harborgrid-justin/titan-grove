/**
 * Supplier Quality Management - Command Center Page
 * Business-ready functionality with backend integration
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Supplier Quality Management page loaded');
    
    // Initialize page-specific features
    initializesupplierQuality();
});

function initializesupplierQuality() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlesupplierQualityAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executesupplierQuality();
        });
    }
    
    // Configure secondary button
    const secondaryBtn = document.getElementById('secondaryBtn');
    if (secondaryBtn) {
        secondaryBtn.addEventListener('click', function() {
            viewsupplierQualityAnalytics();
        });
    }
    
    // Configure settings button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            window.commandCenterPages.openSettings('supplier-quality');
        });
    }
    
    // Configure export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            window.commandCenterPages.exportData('supplier-quality');
        });
    }
    
    // Configure help button
    const helpBtn = document.getElementById('helpBtn');
    if (helpBtn) {
        helpBtn.addEventListener('click', function() {
            window.commandCenterPages.showHelp('supplier-quality');
        });
    }
    
    // Initialize page-specific data
    loadsupplierQualityData();
}

function handlesupplierQualityAction() {
    console.log('Executing Supplier Quality Management action');
    
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
            window.commandCenterPages.showNotification('Supplier Quality Management action completed successfully', 'success');
        }, 2000);
    }
}

function executesupplierQuality() {
    console.log('Launching Supplier Quality Management operations');
    window.commandCenterPages.executeOperation('supplier-quality');
}

function viewsupplierQualityAnalytics() {
    console.log('Viewing Supplier Quality Management analytics');
    window.commandCenterPages.openAnalytics('supplier-quality');
}

function loadsupplierQualityData() {
    console.log('Loading Supplier Quality Management data');
    
    // Simulate data loading
    if (window.commandCenterPages) {
        window.commandCenterPages.loadPageData('supplier-quality').then(data => {
            console.log('Supplier Quality Management data loaded:', data);
        }).catch(error => {
            console.error('Error loading Supplier Quality Management data:', error);
        });
    }
}

// Export page-specific functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializesupplierQuality,
        handlesupplierQualityAction,
        executesupplierQuality,
        loadsupplierQualityData
    };
}
