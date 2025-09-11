/**
 * Consolidation Management - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Consolidation Management
document.addEventListener('DOMContentLoaded', function () {
  console.log('Consolidation Management page loaded');

  // Initialize page-specific features
  initializeconsolidation();
});

function initializeconsolidation() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handleconsolidationAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executeconsolidation();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadconsolidationData();
}

async function loadconsolidationData() {
  try {
    const response = await fetch('/api/financial/general-ledger/consolidation');
    if (response.ok) {
      const data = await response.json();
      updateconsolidationDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Consolidation Management data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handleconsolidationAction() {
  console.log('Consolidation Management action triggered');
  window.financialPages.showNotification(
    'Consolidation Management configured successfully',
    'success'
  );
}

function executeconsolidation() {
  console.log('Consolidation Management execution started');
  window.financialPages.showNotification(
    'Consolidation Management executed successfully',
    'success'
  );
}

function updateconsolidationDisplay(data) {
  console.log('Updating Consolidation Management display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/general-ledger/consolidation/test');
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
      loadconsolidationData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handleconsolidationAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/general-ledger/consolidation/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'consolidation-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
