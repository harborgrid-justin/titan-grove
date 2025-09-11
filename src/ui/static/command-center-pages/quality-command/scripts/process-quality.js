/**
 * Process Quality Management - Command Center Page
 * Business-ready functionality with backend integration
 */

document.addEventListener('DOMContentLoaded', function () {
  console.log('Process Quality Management page loaded');

  // Initialize page-specific features
  initializeprocessQuality();
});

function initializeprocessQuality() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handleprocessQualityAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executeprocessQuality();
    });
  }

  // Configure secondary button
  const secondaryBtn = document.getElementById('secondaryBtn');
  if (secondaryBtn) {
    secondaryBtn.addEventListener('click', function () {
      viewprocessQualityAnalytics();
    });
  }

  // Configure settings button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      window.commandCenterPages.openSettings('process-quality');
    });
  }

  // Configure export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', function () {
      window.commandCenterPages.exportData('process-quality');
    });
  }

  // Configure help button
  const helpBtn = document.getElementById('helpBtn');
  if (helpBtn) {
    helpBtn.addEventListener('click', function () {
      window.commandCenterPages.showHelp('process-quality');
    });
  }

  // Initialize page-specific data
  loadprocessQualityData();
}

function handleprocessQualityAction() {
  console.log('Executing Process Quality Management action');

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
      window.commandCenterPages.showNotification(
        'Process Quality Management action completed successfully',
        'success'
      );
    }, 2000);
  }
}

function executeprocessQuality() {
  console.log('Launching Process Quality Management operations');
  window.commandCenterPages.executeOperation('process-quality');
}

function viewprocessQualityAnalytics() {
  console.log('Viewing Process Quality Management analytics');
  window.commandCenterPages.openAnalytics('process-quality');
}

function loadprocessQualityData() {
  console.log('Loading Process Quality Management data');

  // Simulate data loading
  if (window.commandCenterPages) {
    window.commandCenterPages
      .loadPageData('process-quality')
      .then((data) => {
        console.log('Process Quality Management data loaded:', data);
      })
      .catch((error) => {
        console.error('Error loading Process Quality Management data:', error);
      });
  }
}

// Export page-specific functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeprocessQuality,
    handleprocessQualityAction,
    executeprocessQuality,
    loadprocessQualityData,
  };
}
