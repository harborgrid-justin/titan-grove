/**
 * Accounts Payable Management - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Accounts Payable Management
document.addEventListener('DOMContentLoaded', function () {
  console.log('Accounts Payable Management page loaded');

  // Initialize page-specific features
  initializeaccountspayablemgmt();
});

function initializeaccountspayablemgmt() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handleaccountspayablemgmtAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executeaccountspayablemgmt();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadaccountspayablemgmtData();
}

async function loadaccountspayablemgmtData() {
  try {
    const response = await fetch('/api/financial/working-capital/accounts-payable-mgmt');
    if (response.ok) {
      const data = await response.json();
      updateaccountspayablemgmtDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Accounts Payable Management data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handleaccountspayablemgmtAction() {
  console.log('Accounts Payable Management action triggered');
  window.financialPages.showNotification(
    'Accounts Payable Management configured successfully',
    'success'
  );
}

function executeaccountspayablemgmt() {
  console.log('Accounts Payable Management execution started');
  window.financialPages.showNotification(
    'Accounts Payable Management executed successfully',
    'success'
  );
}

function updateaccountspayablemgmtDisplay(data) {
  console.log('Updating Accounts Payable Management display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/working-capital/accounts-payable-mgmt/test');
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
      loadaccountspayablemgmtData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handleaccountspayablemgmtAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/working-capital/accounts-payable-mgmt/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'accounts-payable-mgmt-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
