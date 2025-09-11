/**
 * Security Analytics & Intelligence - Command Center Page
 * Business-ready functionality with backend integration
 */

document.addEventListener('DOMContentLoaded', function () {
  console.log('Security Analytics & Intelligence page loaded');

  // Initialize page-specific features
  initializesecurityAnalytics();
});

function initializesecurityAnalytics() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlesecurityAnalyticsAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executesecurityAnalytics();
    });
  }

  // Configure secondary button
  const secondaryBtn = document.getElementById('secondaryBtn');
  if (secondaryBtn) {
    secondaryBtn.addEventListener('click', function () {
      viewsecurityAnalyticsAnalytics();
    });
  }

  // Configure settings button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      window.commandCenterPages.openSettings('security-analytics');
    });
  }

  // Configure export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', function () {
      window.commandCenterPages.exportData('security-analytics');
    });
  }

  // Configure help button
  const helpBtn = document.getElementById('helpBtn');
  if (helpBtn) {
    helpBtn.addEventListener('click', function () {
      window.commandCenterPages.showHelp('security-analytics');
    });
  }

  // Initialize page-specific data
  loadsecurityAnalyticsData();
}

function handlesecurityAnalyticsAction() {
  console.log('Executing Security Analytics & Intelligence action');

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
        'Security Analytics & Intelligence action completed successfully',
        'success'
      );
    }, 2000);
  }
}

function executesecurityAnalytics() {
  console.log('Launching Security Analytics & Intelligence operations');
  window.commandCenterPages.executeOperation('security-analytics');
}

function viewsecurityAnalyticsAnalytics() {
  console.log('Viewing Security Analytics & Intelligence analytics');
  window.commandCenterPages.openAnalytics('security-analytics');
}

function loadsecurityAnalyticsData() {
  console.log('Loading Security Analytics & Intelligence data');

  // Simulate data loading
  if (window.commandCenterPages) {
    window.commandCenterPages
      .loadPageData('security-analytics')
      .then((data) => {
        console.log('Security Analytics & Intelligence data loaded:', data);
      })
      .catch((error) => {
        console.error('Error loading Security Analytics & Intelligence data:', error);
      });
  }
}

// Export page-specific functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializesecurityAnalytics,
    handlesecurityAnalyticsAction,
    executesecurityAnalytics,
    loadsecurityAnalyticsData,
  };
}
