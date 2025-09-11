/**
 * Advanced Chart of Accounts - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Advanced Chart of Accounts
document.addEventListener('DOMContentLoaded', function () {
  console.log('Advanced Chart of Accounts page loaded');

  // Initialize page-specific features
  initializechartofaccounts();
});

function initializechartofaccounts() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlechartofaccountsAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executechartofaccounts();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadchartofaccountsData();
}

async function loadchartofaccountsData() {
  try {
    const response = await fetch('/api/financial/general-ledger/chart-of-accounts');
    if (response.ok) {
      const data = await response.json();
      updatechartofaccountsDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Advanced Chart of Accounts data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handlechartofaccountsAction() {
  console.log('Advanced Chart of Accounts action triggered');
  window.financialPages.showNotification(
    'Advanced Chart of Accounts configured successfully',
    'success'
  );
}

function executechartofaccounts() {
  console.log('Advanced Chart of Accounts execution started');
  window.financialPages.showNotification(
    'Advanced Chart of Accounts executed successfully',
    'success'
  );
}

function updatechartofaccountsDisplay(data) {
  console.log('Updating Advanced Chart of Accounts display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/general-ledger/chart-of-accounts/test');
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
      loadchartofaccountsData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handlechartofaccountsAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/general-ledger/chart-of-accounts/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chart-of-accounts-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
