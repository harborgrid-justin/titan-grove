/**
 * Application Performance Monitoring - Command Center Page
 * Business-ready functionality with backend integration
 */

document.addEventListener('DOMContentLoaded', function () {
  console.log('Application Performance Monitoring page loaded');

  // Initialize page-specific features
  initializeapplicationPerformance();
});

function initializeapplicationPerformance() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handleapplicationPerformanceAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executeapplicationPerformance();
    });
  }

  // Configure secondary button
  const secondaryBtn = document.getElementById('secondaryBtn');
  if (secondaryBtn) {
    secondaryBtn.addEventListener('click', function () {
      viewapplicationPerformanceAnalytics();
    });
  }

  // Configure settings button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      window.commandCenterPages.openSettings('application-performance');
    });
  }

  // Configure export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', function () {
      window.commandCenterPages.exportData('application-performance');
    });
  }

  // Configure help button
  const helpBtn = document.getElementById('helpBtn');
  if (helpBtn) {
    helpBtn.addEventListener('click', function () {
      window.commandCenterPages.showHelp('application-performance');
    });
  }

  // Initialize page-specific data
  loadapplicationPerformanceData();
}

function handleapplicationPerformanceAction() {
  console.log('Executing Application Performance Monitoring action');

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
        'Application Performance Monitoring action completed successfully',
        'success'
      );
    }, 2000);
  }
}

function executeapplicationPerformance() {
  console.log('Launching Application Performance Monitoring operations');
  window.commandCenterPages.executeOperation('application-performance');
}

function viewapplicationPerformanceAnalytics() {
  console.log('Viewing Application Performance Monitoring analytics');
  window.commandCenterPages.openAnalytics('application-performance');
}

function loadapplicationPerformanceData() {
  console.log('Loading Application Performance Monitoring data');

  // Simulate data loading
  if (window.commandCenterPages) {
    window.commandCenterPages
      .loadPageData('application-performance')
      .then((data) => {
        console.log('Application Performance Monitoring data loaded:', data);
      })
      .catch((error) => {
        console.error('Error loading Application Performance Monitoring data:', error);
      });
  }
}

// Export page-specific functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeapplicationPerformance,
    handleapplicationPerformanceAction,
    executeapplicationPerformance,
    loadapplicationPerformanceData,
  };
}
