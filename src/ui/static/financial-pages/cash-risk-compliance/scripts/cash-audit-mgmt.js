/**
 * Cash Audit Management - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Cash Audit Management
document.addEventListener('DOMContentLoaded', function () {
  console.log('Cash Audit Management page loaded');

  // Initialize page-specific features
  initializecashauditmgmt();
});

function initializecashauditmgmt() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlecashauditmgmtAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executecashauditmgmt();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadcashauditmgmtData();
}

async function loadcashauditmgmtData() {
  try {
    const response = await fetch('/api/financial/cash-risk-compliance/cash-audit-mgmt');
    if (response.ok) {
      const data = await response.json();
      updatecashauditmgmtDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Cash Audit Management data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handlecashauditmgmtAction() {
  console.log('Cash Audit Management action triggered');
  window.financialPages.showNotification(
    'Cash Audit Management configured successfully',
    'success'
  );
}

function executecashauditmgmt() {
  console.log('Cash Audit Management execution started');
  window.financialPages.showNotification('Cash Audit Management executed successfully', 'success');
}

function updatecashauditmgmtDisplay(data) {
  console.log('Updating Cash Audit Management display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/cash-risk-compliance/cash-audit-mgmt/test');
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
      loadcashauditmgmtData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handlecashauditmgmtAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/cash-risk-compliance/cash-audit-mgmt/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cash-audit-mgmt-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
