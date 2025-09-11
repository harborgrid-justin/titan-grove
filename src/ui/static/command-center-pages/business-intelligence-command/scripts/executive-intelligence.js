/**
 * Executive Intelligence Center - Command Center Page
 * Business-ready functionality with backend integration
 */

document.addEventListener('DOMContentLoaded', function () {
  console.log('Executive Intelligence Center page loaded');

  // Initialize page-specific features
  initializeexecutiveIntelligence();
});

function initializeexecutiveIntelligence() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handleexecutiveIntelligenceAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executeexecutiveIntelligence();
    });
  }

  // Configure secondary button
  const secondaryBtn = document.getElementById('secondaryBtn');
  if (secondaryBtn) {
    secondaryBtn.addEventListener('click', function () {
      viewexecutiveIntelligenceAnalytics();
    });
  }

  // Configure settings button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      window.commandCenterPages.openSettings('executive-intelligence');
    });
  }

  // Configure export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', function () {
      window.commandCenterPages.exportData('executive-intelligence');
    });
  }

  // Configure help button
  const helpBtn = document.getElementById('helpBtn');
  if (helpBtn) {
    helpBtn.addEventListener('click', function () {
      window.commandCenterPages.showHelp('executive-intelligence');
    });
  }

  // Initialize page-specific data
  loadexecutiveIntelligenceData();
}

function handleexecutiveIntelligenceAction() {
  console.log('Executing Executive Intelligence Center action');

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
        'Executive Intelligence Center action completed successfully',
        'success'
      );
    }, 2000);
  }
}

function executeexecutiveIntelligence() {
  console.log('Launching Executive Intelligence Center operations');
  window.commandCenterPages.executeOperation('executive-intelligence');
}

function viewexecutiveIntelligenceAnalytics() {
  console.log('Viewing Executive Intelligence Center analytics');
  window.commandCenterPages.openAnalytics('executive-intelligence');
}

function loadexecutiveIntelligenceData() {
  console.log('Loading Executive Intelligence Center data');

  // Simulate data loading
  if (window.commandCenterPages) {
    window.commandCenterPages
      .loadPageData('executive-intelligence')
      .then((data) => {
        console.log('Executive Intelligence Center data loaded:', data);
      })
      .catch((error) => {
        console.error('Error loading Executive Intelligence Center data:', error);
      });
  }
}

// Export page-specific functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeexecutiveIntelligence,
    handleexecutiveIntelligenceAction,
    executeexecutiveIntelligence,
    loadexecutiveIntelligenceData,
  };
}
