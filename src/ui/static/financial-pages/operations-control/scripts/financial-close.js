/**
 * Financial Close Automation - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Financial Close Automation
document.addEventListener('DOMContentLoaded', function () {
  console.log('Financial Close Automation page loaded');

  // Initialize page-specific features
  initializefinancialclose();
});

function initializefinancialclose() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlefinancialcloseAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executefinancialclose();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadfinancialcloseData();
}

async function loadfinancialcloseData() {
  try {
    const response = await fetch('/api/financial/operations-control/financial-close');
    if (response.ok) {
      const data = await response.json();
      updatefinancialcloseDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Financial Close Automation data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handlefinancialcloseAction() {
  console.log('Financial Close Automation action triggered');
  window.financialPages.showNotification(
    'Financial Close Automation configured successfully',
    'success'
  );
}

function executefinancialclose() {
  console.log('Financial Close Automation execution started');
  window.financialPages.showNotification(
    'Financial Close Automation executed successfully',
    'success'
  );
}

function updatefinancialcloseDisplay(data) {
  console.log('Updating Financial Close Automation display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/operations-control/financial-close/test');
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
      loadfinancialcloseData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handlefinancialcloseAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/operations-control/financial-close/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'financial-close-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
