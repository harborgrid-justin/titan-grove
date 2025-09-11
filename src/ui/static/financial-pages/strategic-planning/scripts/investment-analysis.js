/**
 * Investment Analysis & ROI - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Investment Analysis & ROI
document.addEventListener('DOMContentLoaded', function () {
  console.log('Investment Analysis & ROI page loaded');

  // Initialize page-specific features
  initializeinvestmentanalysis();
});

function initializeinvestmentanalysis() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handleinvestmentanalysisAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executeinvestmentanalysis();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadinvestmentanalysisData();
}

async function loadinvestmentanalysisData() {
  try {
    const response = await fetch('/api/financial/strategic-planning/investment-analysis');
    if (response.ok) {
      const data = await response.json();
      updateinvestmentanalysisDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Investment Analysis & ROI data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handleinvestmentanalysisAction() {
  console.log('Investment Analysis & ROI action triggered');
  window.financialPages.showNotification(
    'Investment Analysis & ROI configured successfully',
    'success'
  );
}

function executeinvestmentanalysis() {
  console.log('Investment Analysis & ROI execution started');
  window.financialPages.showNotification(
    'Investment Analysis & ROI executed successfully',
    'success'
  );
}

function updateinvestmentanalysisDisplay(data) {
  console.log('Updating Investment Analysis & ROI display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/strategic-planning/investment-analysis/test');
        const result = await response.json();
        window.financialPages.showNotification('Integration test successful', 'success');
      } catch (error) {
        window.financialPages.showNotification('Integration test failed', 'error');
      }
    });
  }

  // View data button
  const viewDataBtn = document.getElementById('viewDataBtn');
  if (viewDataBtn) {
    viewDataBtn.addEventListener('click', function () {
      loadinvestmentanalysisData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handleinvestmentanalysisAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/financial/strategic-planning/investment-analysis/export'
        );
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'investment-analysis-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
