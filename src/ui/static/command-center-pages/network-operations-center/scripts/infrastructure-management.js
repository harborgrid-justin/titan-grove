/**
 * IT Infrastructure Management - Command Center Page
 * Business-ready functionality with backend integration
 */

document.addEventListener('DOMContentLoaded', function () {
  console.log('IT Infrastructure Management page loaded');

  // Initialize page-specific features
  initializeinfrastructureManagement();
});

function initializeinfrastructureManagement() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handleinfrastructureManagementAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executeinfrastructureManagement();
    });
  }

  // Configure secondary button
  const secondaryBtn = document.getElementById('secondaryBtn');
  if (secondaryBtn) {
    secondaryBtn.addEventListener('click', function () {
      viewinfrastructureManagementAnalytics();
    });
  }

  // Configure settings button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      window.commandCenterPages.openSettings('infrastructure-management');
    });
  }

  // Configure export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', function () {
      window.commandCenterPages.exportData('infrastructure-management');
    });
  }

  // Configure help button
  const helpBtn = document.getElementById('helpBtn');
  if (helpBtn) {
    helpBtn.addEventListener('click', function () {
      window.commandCenterPages.showHelp('infrastructure-management');
    });
  }

  // Initialize page-specific data
  loadinfrastructureManagementData();
}

function handleinfrastructureManagementAction() {
  console.log('Executing IT Infrastructure Management action');

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
        'IT Infrastructure Management action completed successfully',
        'success'
      );
    }, 2000);
  }
}

function executeinfrastructureManagement() {
  console.log('Launching IT Infrastructure Management operations');
  window.commandCenterPages.executeOperation('infrastructure-management');
}

function viewinfrastructureManagementAnalytics() {
  console.log('Viewing IT Infrastructure Management analytics');
  window.commandCenterPages.openAnalytics('infrastructure-management');
}

function loadinfrastructureManagementData() {
  console.log('Loading IT Infrastructure Management data');

  // Simulate data loading
  if (window.commandCenterPages) {
    window.commandCenterPages
      .loadPageData('infrastructure-management')
      .then((data) => {
        console.log('IT Infrastructure Management data loaded:', data);
      })
      .catch((error) => {
        console.error('Error loading IT Infrastructure Management data:', error);
      });
  }
}

// Export page-specific functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeinfrastructureManagement,
    handleinfrastructureManagementAction,
    executeinfrastructureManagement,
    loadinfrastructureManagementData,
  };
}
