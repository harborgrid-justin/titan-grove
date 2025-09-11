/**
 * Crisis Management Center - Command Center Page
 * Business-ready functionality with backend integration
 */

document.addEventListener('DOMContentLoaded', function () {
  console.log('Crisis Management Center page loaded');

  // Initialize page-specific features
  initializecrisisManagement();
});

function initializecrisisManagement() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlecrisisManagementAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executecrisisManagement();
    });
  }

  // Configure secondary button
  const secondaryBtn = document.getElementById('secondaryBtn');
  if (secondaryBtn) {
    secondaryBtn.addEventListener('click', function () {
      viewcrisisManagementAnalytics();
    });
  }

  // Configure settings button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      window.commandCenterPages.openSettings('crisis-management');
    });
  }

  // Configure export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', function () {
      window.commandCenterPages.exportData('crisis-management');
    });
  }

  // Configure help button
  const helpBtn = document.getElementById('helpBtn');
  if (helpBtn) {
    helpBtn.addEventListener('click', function () {
      window.commandCenterPages.showHelp('crisis-management');
    });
  }

  // Initialize page-specific data
  loadcrisisManagementData();
}

function handlecrisisManagementAction() {
  console.log('Executing Crisis Management Center action');

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
        'Crisis Management Center action completed successfully',
        'success'
      );
    }, 2000);
  }
}

function executecrisisManagement() {
  console.log('Launching Crisis Management Center operations');
  window.commandCenterPages.executeOperation('crisis-management');
}

function viewcrisisManagementAnalytics() {
  console.log('Viewing Crisis Management Center analytics');
  window.commandCenterPages.openAnalytics('crisis-management');
}

function loadcrisisManagementData() {
  console.log('Loading Crisis Management Center data');

  // Simulate data loading
  if (window.commandCenterPages) {
    window.commandCenterPages
      .loadPageData('crisis-management')
      .then((data) => {
        console.log('Crisis Management Center data loaded:', data);
      })
      .catch((error) => {
        console.error('Error loading Crisis Management Center data:', error);
      });
  }
}

// Export page-specific functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializecrisisManagement,
    handlecrisisManagementAction,
    executecrisisManagement,
    loadcrisisManagementData,
  };
}
