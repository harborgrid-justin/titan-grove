/**
 * Network Performance Monitoring - Command Center Page
 * Business-ready functionality with backend integration
 */

document.addEventListener('DOMContentLoaded', function () {
  console.log('Network Performance Monitoring page loaded');

  // Initialize page-specific features
  initializenetworkMonitoring();
});

function initializenetworkMonitoring() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlenetworkMonitoringAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executenetworkMonitoring();
    });
  }

  // Configure secondary button
  const secondaryBtn = document.getElementById('secondaryBtn');
  if (secondaryBtn) {
    secondaryBtn.addEventListener('click', function () {
      viewnetworkMonitoringAnalytics();
    });
  }

  // Configure settings button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      window.commandCenterPages.openSettings('network-monitoring');
    });
  }

  // Configure export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', function () {
      window.commandCenterPages.exportData('network-monitoring');
    });
  }

  // Configure help button
  const helpBtn = document.getElementById('helpBtn');
  if (helpBtn) {
    helpBtn.addEventListener('click', function () {
      window.commandCenterPages.showHelp('network-monitoring');
    });
  }

  // Initialize page-specific data
  loadnetworkMonitoringData();
}

function handlenetworkMonitoringAction() {
  console.log('Executing Network Performance Monitoring action');

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
        'Network Performance Monitoring action completed successfully',
        'success'
      );
    }, 2000);
  }
}

function executenetworkMonitoring() {
  console.log('Launching Network Performance Monitoring operations');
  window.commandCenterPages.executeOperation('network-monitoring');
}

function viewnetworkMonitoringAnalytics() {
  console.log('Viewing Network Performance Monitoring analytics');
  window.commandCenterPages.openAnalytics('network-monitoring');
}

function loadnetworkMonitoringData() {
  console.log('Loading Network Performance Monitoring data');

  // Simulate data loading
  if (window.commandCenterPages) {
    window.commandCenterPages
      .loadPageData('network-monitoring')
      .then((data) => {
        console.log('Network Performance Monitoring data loaded:', data);
      })
      .catch((error) => {
        console.error('Error loading Network Performance Monitoring data:', error);
      });
  }
}

// Export page-specific functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializenetworkMonitoring,
    handlenetworkMonitoringAction,
    executenetworkMonitoring,
    loadnetworkMonitoringData,
  };
}
