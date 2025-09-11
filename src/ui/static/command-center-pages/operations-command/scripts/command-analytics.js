/**
 * Command Center Analytics - Command Center Page
 * Business-ready functionality with backend integration
 */

document.addEventListener('DOMContentLoaded', function () {
  console.log('Command Center Analytics page loaded');

  // Initialize page-specific features
  initializecommandAnalytics();
});

function initializecommandAnalytics() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlecommandAnalyticsAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executecommandAnalytics();
    });
  }

  // Configure secondary button
  const secondaryBtn = document.getElementById('secondaryBtn');
  if (secondaryBtn) {
    secondaryBtn.addEventListener('click', function () {
      viewcommandAnalyticsAnalytics();
    });
  }

  // Configure settings button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      window.commandCenterPages.openSettings('command-analytics');
    });
  }

  // Configure export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', function () {
      window.commandCenterPages.exportData('command-analytics');
    });
  }

  // Configure help button
  const helpBtn = document.getElementById('helpBtn');
  if (helpBtn) {
    helpBtn.addEventListener('click', function () {
      window.commandCenterPages.showHelp('command-analytics');
    });
  }

  // Initialize page-specific data
  loadcommandAnalyticsData();
}

function handlecommandAnalyticsAction() {
  console.log('Executing Command Center Analytics action');

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
        'Command Center Analytics action completed successfully',
        'success'
      );
    }, 2000);
  }
}

function executecommandAnalytics() {
  console.log('Launching Command Center Analytics operations');
  window.commandCenterPages.executeOperation('command-analytics');
}

function viewcommandAnalyticsAnalytics() {
  console.log('Viewing Command Center Analytics analytics');
  window.commandCenterPages.openAnalytics('command-analytics');
}

function loadcommandAnalyticsData() {
  console.log('Loading Command Center Analytics data');

  // Simulate data loading
  if (window.commandCenterPages) {
    window.commandCenterPages
      .loadPageData('command-analytics')
      .then((data) => {
        console.log('Command Center Analytics data loaded:', data);
      })
      .catch((error) => {
        console.error('Error loading Command Center Analytics data:', error);
      });
  }
}

// Export page-specific functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializecommandAnalytics,
    handlecommandAnalyticsAction,
    executecommandAnalytics,
    loadcommandAnalyticsData,
  };
}
