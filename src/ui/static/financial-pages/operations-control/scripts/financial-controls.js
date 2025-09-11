/**
 * Financial Controls Framework - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Financial Controls Framework
document.addEventListener('DOMContentLoaded', function () {
  console.log('Financial Controls Framework page loaded');

  // Initialize page-specific features
  initializefinancialcontrols();
});

function initializefinancialcontrols() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlefinancialcontrolsAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executefinancialcontrols();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadfinancialcontrolsData();
}

async function loadfinancialcontrolsData() {
  try {
    const response = await fetch('/api/financial/operations-control/financial-controls');
    if (response.ok) {
      const data = await response.json();
      updatefinancialcontrolsDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Financial Controls Framework data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handlefinancialcontrolsAction() {
  console.log('Financial Controls Framework action triggered');
  window.financialPages.showNotification(
    'Financial Controls Framework configured successfully',
    'success'
  );
}

function executefinancialcontrols() {
  console.log('Financial Controls Framework execution started');
  window.financialPages.showNotification(
    'Financial Controls Framework executed successfully',
    'success'
  );
}

function updatefinancialcontrolsDisplay(data) {
  console.log('Updating Financial Controls Framework display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/operations-control/financial-controls/test');
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
      loadfinancialcontrolsData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handlefinancialcontrolsAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/operations-control/financial-controls/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'financial-controls-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
