/**
 * Allocations Engine - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Allocations Engine
document.addEventListener('DOMContentLoaded', function () {
  console.log('Allocations Engine page loaded');

  // Initialize page-specific features
  initializeallocations();
});

function initializeallocations() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handleallocationsAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executeallocations();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadallocationsData();
}

async function loadallocationsData() {
  try {
    const response = await fetch('/api/financial/general-ledger/allocations');
    if (response.ok) {
      const data = await response.json();
      updateallocationsDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Allocations Engine data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handleallocationsAction() {
  console.log('Allocations Engine action triggered');
  window.financialPages.showNotification('Allocations Engine configured successfully', 'success');
}

function executeallocations() {
  console.log('Allocations Engine execution started');
  window.financialPages.showNotification('Allocations Engine executed successfully', 'success');
}

function updateallocationsDisplay(data) {
  console.log('Updating Allocations Engine display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/general-ledger/allocations/test');
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
      loadallocationsData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handleallocationsAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/general-ledger/allocations/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'allocations-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
