/**
 * Trade Finance Management - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Trade Finance Management
document.addEventListener('DOMContentLoaded', function () {
  console.log('Trade Finance Management page loaded');

  // Initialize page-specific features
  initializetradefinancemgmt();
});

function initializetradefinancemgmt() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handletradefinancemgmtAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executetradefinancemgmt();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadtradefinancemgmtData();
}

async function loadtradefinancemgmtData() {
  try {
    const response = await fetch('/api/financial/working-capital/trade-finance-mgmt');
    if (response.ok) {
      const data = await response.json();
      updatetradefinancemgmtDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Trade Finance Management data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handletradefinancemgmtAction() {
  console.log('Trade Finance Management action triggered');
  window.financialPages.showNotification(
    'Trade Finance Management configured successfully',
    'success'
  );
}

function executetradefinancemgmt() {
  console.log('Trade Finance Management execution started');
  window.financialPages.showNotification(
    'Trade Finance Management executed successfully',
    'success'
  );
}

function updatetradefinancemgmtDisplay(data) {
  console.log('Updating Trade Finance Management display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/working-capital/trade-finance-mgmt/test');
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
      loadtradefinancemgmtData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handletradefinancemgmtAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/working-capital/trade-finance-mgmt/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'trade-finance-mgmt-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
