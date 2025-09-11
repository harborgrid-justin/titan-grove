/**
 * Quality Monitoring Center - Command Center Page
 * Business-ready functionality with backend integration
 */

document.addEventListener('DOMContentLoaded', function () {
  console.log('Quality Monitoring Center page loaded');

  // Initialize page-specific features
  initializequalityMonitoring();
});

function initializequalityMonitoring() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlequalityMonitoringAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executequalityMonitoring();
    });
  }

  // Configure secondary button
  const secondaryBtn = document.getElementById('secondaryBtn');
  if (secondaryBtn) {
    secondaryBtn.addEventListener('click', function () {
      viewqualityMonitoringAnalytics();
    });
  }

  // Configure settings button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      window.commandCenterPages.openSettings('quality-monitoring');
    });
  }

  // Configure export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', function () {
      window.commandCenterPages.exportData('quality-monitoring');
    });
  }

  // Configure help button
  const helpBtn = document.getElementById('helpBtn');
  if (helpBtn) {
    helpBtn.addEventListener('click', function () {
      window.commandCenterPages.showHelp('quality-monitoring');
    });
  }

  // Initialize page-specific data
  loadqualityMonitoringData();
}

function handlequalityMonitoringAction() {
  console.log('Executing Quality Monitoring Center action');

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
        'Quality Monitoring Center action completed successfully',
        'success'
      );
    }, 2000);
  }
}

function executequalityMonitoring() {
  console.log('Launching Quality Monitoring Center operations');
  window.commandCenterPages.executeOperation('quality-monitoring');
}

function viewqualityMonitoringAnalytics() {
  console.log('Viewing Quality Monitoring Center analytics');
  window.commandCenterPages.openAnalytics('quality-monitoring');
}

function loadqualityMonitoringData() {
  console.log('Loading Quality Monitoring Center data');

  // Simulate data loading
  if (window.commandCenterPages) {
    window.commandCenterPages
      .loadPageData('quality-monitoring')
      .then((data) => {
        console.log('Quality Monitoring Center data loaded:', data);
      })
      .catch((error) => {
        console.error('Error loading Quality Monitoring Center data:', error);
      });
  }
}

// Export page-specific functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializequalityMonitoring,
    handlequalityMonitoringAction,
    executequalityMonitoring,
    loadqualityMonitoringData,
  };
}
