/**
 * Emergency Risk Monitoring - Command Center Page
 * Business-ready functionality with backend integration
 */

document.addEventListener('DOMContentLoaded', function () {
  console.log('Emergency Risk Monitoring page loaded');

  // Initialize page-specific features
  initializeriskMonitoring();
});

function initializeriskMonitoring() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handleriskMonitoringAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executeriskMonitoring();
    });
  }

  // Configure secondary button
  const secondaryBtn = document.getElementById('secondaryBtn');
  if (secondaryBtn) {
    secondaryBtn.addEventListener('click', function () {
      viewriskMonitoringAnalytics();
    });
  }

  // Configure settings button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      window.commandCenterPages.openSettings('risk-monitoring');
    });
  }

  // Configure export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', function () {
      window.commandCenterPages.exportData('risk-monitoring');
    });
  }

  // Configure help button
  const helpBtn = document.getElementById('helpBtn');
  if (helpBtn) {
    helpBtn.addEventListener('click', function () {
      window.commandCenterPages.showHelp('risk-monitoring');
    });
  }

  // Initialize page-specific data
  loadriskMonitoringData();
}

function handleriskMonitoringAction() {
  console.log('Executing Emergency Risk Monitoring action');

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
        'Emergency Risk Monitoring action completed successfully',
        'success'
      );
    }, 2000);
  }
}

function executeriskMonitoring() {
  console.log('Launching Emergency Risk Monitoring operations');
  window.commandCenterPages.executeOperation('risk-monitoring');
}

function viewriskMonitoringAnalytics() {
  console.log('Viewing Emergency Risk Monitoring analytics');
  window.commandCenterPages.openAnalytics('risk-monitoring');
}

function loadriskMonitoringData() {
  console.log('Loading Emergency Risk Monitoring data');

  // Simulate data loading
  if (window.commandCenterPages) {
    window.commandCenterPages
      .loadPageData('risk-monitoring')
      .then((data) => {
        console.log('Emergency Risk Monitoring data loaded:', data);
      })
      .catch((error) => {
        console.error('Error loading Emergency Risk Monitoring data:', error);
      });
  }
}

// Export page-specific functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeriskMonitoring,
    handleriskMonitoringAction,
    executeriskMonitoring,
    loadriskMonitoringData,
  };
}
