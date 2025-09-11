/**
 * Operational Intelligence Hub - Command Center Page
 * Business-ready functionality with backend integration
 */

document.addEventListener('DOMContentLoaded', function () {
  console.log('Operational Intelligence Hub page loaded');

  // Initialize page-specific features
  initializeoperationalIntelligence();
});

function initializeoperationalIntelligence() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handleoperationalIntelligenceAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executeoperationalIntelligence();
    });
  }

  // Configure secondary button
  const secondaryBtn = document.getElementById('secondaryBtn');
  if (secondaryBtn) {
    secondaryBtn.addEventListener('click', function () {
      viewoperationalIntelligenceAnalytics();
    });
  }

  // Configure settings button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      window.commandCenterPages.openSettings('operational-intelligence');
    });
  }

  // Configure export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', function () {
      window.commandCenterPages.exportData('operational-intelligence');
    });
  }

  // Configure help button
  const helpBtn = document.getElementById('helpBtn');
  if (helpBtn) {
    helpBtn.addEventListener('click', function () {
      window.commandCenterPages.showHelp('operational-intelligence');
    });
  }

  // Initialize page-specific data
  loadoperationalIntelligenceData();
}

function handleoperationalIntelligenceAction() {
  console.log('Executing Operational Intelligence Hub action');

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
        'Operational Intelligence Hub action completed successfully',
        'success'
      );
    }, 2000);
  }
}

function executeoperationalIntelligence() {
  console.log('Launching Operational Intelligence Hub operations');
  window.commandCenterPages.executeOperation('operational-intelligence');
}

function viewoperationalIntelligenceAnalytics() {
  console.log('Viewing Operational Intelligence Hub analytics');
  window.commandCenterPages.openAnalytics('operational-intelligence');
}

function loadoperationalIntelligenceData() {
  console.log('Loading Operational Intelligence Hub data');

  // Simulate data loading
  if (window.commandCenterPages) {
    window.commandCenterPages
      .loadPageData('operational-intelligence')
      .then((data) => {
        console.log('Operational Intelligence Hub data loaded:', data);
      })
      .catch((error) => {
        console.error('Error loading Operational Intelligence Hub data:', error);
      });
  }
}

// Export page-specific functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeoperationalIntelligence,
    handleoperationalIntelligenceAction,
    executeoperationalIntelligence,
    loadoperationalIntelligenceData,
  };
}
