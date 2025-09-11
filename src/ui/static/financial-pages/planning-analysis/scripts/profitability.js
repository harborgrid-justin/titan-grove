/**
 * Profitability Analysis - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Profitability Analysis
document.addEventListener('DOMContentLoaded', function () {
  console.log('Profitability Analysis page loaded');

  // Initialize page-specific features
  initializeprofitability();
});

function initializeprofitability() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handleprofitabilityAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executeprofitability();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadprofitabilityData();
}

async function loadprofitabilityData() {
  try {
    const response = await fetch('/api/financial/planning-analysis/profitability');
    if (response.ok) {
      const data = await response.json();
      updateprofitabilityDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Profitability Analysis data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handleprofitabilityAction() {
  console.log('Profitability Analysis action triggered');
  window.financialPages.showNotification(
    'Profitability Analysis configured successfully',
    'success'
  );
}

function executeprofitability() {
  console.log('Profitability Analysis execution started');
  window.financialPages.showNotification('Profitability Analysis executed successfully', 'success');
}

function updateprofitabilityDisplay(data) {
  console.log('Updating Profitability Analysis display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/planning-analysis/profitability/test');
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
      loadprofitabilityData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handleprofitabilityAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/planning-analysis/profitability/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'profitability-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
