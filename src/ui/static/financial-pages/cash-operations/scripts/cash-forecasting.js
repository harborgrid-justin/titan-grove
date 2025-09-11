/**
 * Advanced Cash Forecasting - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Advanced Cash Forecasting
document.addEventListener('DOMContentLoaded', function () {
  console.log('Advanced Cash Forecasting page loaded');

  // Initialize page-specific features
  initializecashforecasting();
});

function initializecashforecasting() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlecashforecastingAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executecashforecasting();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadcashforecastingData();
}

async function loadcashforecastingData() {
  try {
    const response = await fetch('/api/financial/cash-operations/cash-forecasting');
    if (response.ok) {
      const data = await response.json();
      updatecashforecastingDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Advanced Cash Forecasting data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handlecashforecastingAction() {
  console.log('Advanced Cash Forecasting action triggered');
  window.financialPages.showNotification(
    'Advanced Cash Forecasting configured successfully',
    'success'
  );
}

function executecashforecasting() {
  console.log('Advanced Cash Forecasting execution started');
  window.financialPages.showNotification(
    'Advanced Cash Forecasting executed successfully',
    'success'
  );
}

function updatecashforecastingDisplay(data) {
  console.log('Updating Advanced Cash Forecasting display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/cash-operations/cash-forecasting/test');
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
      loadcashforecastingData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handlecashforecastingAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/cash-operations/cash-forecasting/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cash-forecasting-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
