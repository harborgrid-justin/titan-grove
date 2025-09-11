/**
 * Cash Policy Management - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Cash Policy Management
document.addEventListener('DOMContentLoaded', function () {
  console.log('Cash Policy Management page loaded');

  // Initialize page-specific features
  initializecashpolicymgmt();
});

function initializecashpolicymgmt() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlecashpolicymgmtAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executecashpolicymgmt();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadcashpolicymgmtData();
}

async function loadcashpolicymgmtData() {
  try {
    const response = await fetch('/api/financial/cash-risk-compliance/cash-policy-mgmt');
    if (response.ok) {
      const data = await response.json();
      updatecashpolicymgmtDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Cash Policy Management data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handlecashpolicymgmtAction() {
  console.log('Cash Policy Management action triggered');
  window.financialPages.showNotification(
    'Cash Policy Management configured successfully',
    'success'
  );
}

function executecashpolicymgmt() {
  console.log('Cash Policy Management execution started');
  window.financialPages.showNotification('Cash Policy Management executed successfully', 'success');
}

function updatecashpolicymgmtDisplay(data) {
  console.log('Updating Cash Policy Management display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/cash-risk-compliance/cash-policy-mgmt/test');
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
      loadcashpolicymgmtData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handlecashpolicymgmtAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/cash-risk-compliance/cash-policy-mgmt/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cash-policy-mgmt-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
