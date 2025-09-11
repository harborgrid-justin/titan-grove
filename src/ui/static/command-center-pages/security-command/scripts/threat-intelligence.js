/**
 * Threat Intelligence Platform - Command Center Page
 * Business-ready functionality with backend integration
 */

document.addEventListener('DOMContentLoaded', function () {
  console.log('Threat Intelligence Platform page loaded');

  // Initialize page-specific features
  initializethreatIntelligence();
});

function initializethreatIntelligence() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlethreatIntelligenceAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executethreatIntelligence();
    });
  }

  // Configure secondary button
  const secondaryBtn = document.getElementById('secondaryBtn');
  if (secondaryBtn) {
    secondaryBtn.addEventListener('click', function () {
      viewthreatIntelligenceAnalytics();
    });
  }

  // Configure settings button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      window.commandCenterPages.openSettings('threat-intelligence');
    });
  }

  // Configure export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', function () {
      window.commandCenterPages.exportData('threat-intelligence');
    });
  }

  // Configure help button
  const helpBtn = document.getElementById('helpBtn');
  if (helpBtn) {
    helpBtn.addEventListener('click', function () {
      window.commandCenterPages.showHelp('threat-intelligence');
    });
  }

  // Initialize page-specific data
  loadthreatIntelligenceData();
}

function handlethreatIntelligenceAction() {
  console.log('Executing Threat Intelligence Platform action');

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
        'Threat Intelligence Platform action completed successfully',
        'success'
      );
    }, 2000);
  }
}

function executethreatIntelligence() {
  console.log('Launching Threat Intelligence Platform operations');
  window.commandCenterPages.executeOperation('threat-intelligence');
}

function viewthreatIntelligenceAnalytics() {
  console.log('Viewing Threat Intelligence Platform analytics');
  window.commandCenterPages.openAnalytics('threat-intelligence');
}

function loadthreatIntelligenceData() {
  console.log('Loading Threat Intelligence Platform data');

  // Simulate data loading
  if (window.commandCenterPages) {
    window.commandCenterPages
      .loadPageData('threat-intelligence')
      .then((data) => {
        console.log('Threat Intelligence Platform data loaded:', data);
      })
      .catch((error) => {
        console.error('Error loading Threat Intelligence Platform data:', error);
      });
  }
}

// Export page-specific functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializethreatIntelligence,
    handlethreatIntelligenceAction,
    executethreatIntelligence,
    loadthreatIntelligenceData,
  };
}
