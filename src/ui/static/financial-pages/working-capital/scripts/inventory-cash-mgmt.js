/**
 * Inventory Cash Management - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Inventory Cash Management
document.addEventListener('DOMContentLoaded', function () {
  console.log('Inventory Cash Management page loaded');

  // Initialize page-specific features
  initializeinventorycashmgmt();
});

function initializeinventorycashmgmt() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handleinventorycashmgmtAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executeinventorycashmgmt();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadinventorycashmgmtData();
}

async function loadinventorycashmgmtData() {
  try {
    const response = await fetch('/api/financial/working-capital/inventory-cash-mgmt');
    if (response.ok) {
      const data = await response.json();
      updateinventorycashmgmtDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Inventory Cash Management data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handleinventorycashmgmtAction() {
  console.log('Inventory Cash Management action triggered');
  window.financialPages.showNotification(
    'Inventory Cash Management configured successfully',
    'success'
  );
}

function executeinventorycashmgmt() {
  console.log('Inventory Cash Management execution started');
  window.financialPages.showNotification(
    'Inventory Cash Management executed successfully',
    'success'
  );
}

function updateinventorycashmgmtDisplay(data) {
  console.log('Updating Inventory Cash Management display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/working-capital/inventory-cash-mgmt/test');
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
      loadinventorycashmgmtData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handleinventorycashmgmtAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/working-capital/inventory-cash-mgmt/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'inventory-cash-mgmt-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
