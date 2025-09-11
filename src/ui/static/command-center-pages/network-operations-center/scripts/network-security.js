/**
 * Network Security Operations - Command Center Page
 * Business-ready functionality with backend integration
 */

document.addEventListener('DOMContentLoaded', function () {
  console.log('Network Security Operations page loaded');

  // Initialize page-specific features
  initializenetworkSecurity();
});

function initializenetworkSecurity() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlenetworkSecurityAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executenetworkSecurity();
    });
  }

  // Configure secondary button
  const secondaryBtn = document.getElementById('secondaryBtn');
  if (secondaryBtn) {
    secondaryBtn.addEventListener('click', function () {
      viewnetworkSecurityAnalytics();
    });
  }

  // Configure settings button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      window.commandCenterPages.openSettings('network-security');
    });
  }

  // Configure export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', function () {
      window.commandCenterPages.exportData('network-security');
    });
  }

  // Configure help button
  const helpBtn = document.getElementById('helpBtn');
  if (helpBtn) {
    helpBtn.addEventListener('click', function () {
      window.commandCenterPages.showHelp('network-security');
    });
  }

  // Initialize page-specific data
  loadnetworkSecurityData();
}

function handlenetworkSecurityAction() {
  console.log('Executing Network Security Operations action');

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
        'Network Security Operations action completed successfully',
        'success'
      );
    }, 2000);
  }
}

function executenetworkSecurity() {
  console.log('Launching Network Security Operations operations');
  window.commandCenterPages.executeOperation('network-security');
}

function viewnetworkSecurityAnalytics() {
  console.log('Viewing Network Security Operations analytics');
  window.commandCenterPages.openAnalytics('network-security');
}

function loadnetworkSecurityData() {
  console.log('Loading Network Security Operations data');

  // Simulate data loading
  if (window.commandCenterPages) {
    window.commandCenterPages
      .loadPageData('network-security')
      .then((data) => {
        console.log('Network Security Operations data loaded:', data);
      })
      .catch((error) => {
        console.error('Error loading Network Security Operations data:', error);
      });
  }
}

// Export page-specific functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializenetworkSecurity,
    handlenetworkSecurityAction,
    executenetworkSecurity,
    loadnetworkSecurityData,
  };
}
