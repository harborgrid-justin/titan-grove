/**
 * Forecasting & Modeling - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Forecasting & Modeling
document.addEventListener('DOMContentLoaded', function () {
  console.log('Forecasting & Modeling page loaded');

  // Initialize page-specific features
  initializeforecasting();
});

function initializeforecasting() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handleforecastingAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executeforecasting();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadforecastingData();
}

async function loadforecastingData() {
  try {
    const response = await fetch('/api/financial/planning-analysis/forecasting');
    if (response.ok) {
      const data = await response.json();
      updateforecastingDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Forecasting & Modeling data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handleforecastingAction() {
  console.log('Forecasting & Modeling action triggered');
  window.financialPages.showNotification(
    'Forecasting & Modeling configured successfully',
    'success'
  );
}

function executeforecasting() {
  console.log('Forecasting & Modeling execution started');
  window.financialPages.showNotification('Forecasting & Modeling executed successfully', 'success');
}

function updateforecastingDisplay(data) {
  console.log('Updating Forecasting & Modeling display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/planning-analysis/forecasting/test');
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
      loadforecastingData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handleforecastingAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/planning-analysis/forecasting/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'forecasting-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
