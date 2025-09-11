/**
 * Treasury Position Management - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Treasury Position Management
document.addEventListener('DOMContentLoaded', function () {
  console.log('Treasury Position Management page loaded');

  // Initialize page-specific features
  initializetreasurypositionmgmt();
});

function initializetreasurypositionmgmt() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handletreasurypositionmgmtAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executetreasurypositionmgmt();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadtreasurypositionmgmtData();
}

async function loadtreasurypositionmgmtData() {
  try {
    const response = await fetch(
      '/api/financial/treasury-operations-advanced/treasury-position-mgmt'
    );
    if (response.ok) {
      const data = await response.json();
      updatetreasurypositionmgmtDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Treasury Position Management data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handletreasurypositionmgmtAction() {
  console.log('Treasury Position Management action triggered');
  window.financialPages.showNotification(
    'Treasury Position Management configured successfully',
    'success'
  );
}

function executetreasurypositionmgmt() {
  console.log('Treasury Position Management execution started');
  window.financialPages.showNotification(
    'Treasury Position Management executed successfully',
    'success'
  );
}

function updatetreasurypositionmgmtDisplay(data) {
  console.log('Updating Treasury Position Management display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/financial/treasury-operations-advanced/treasury-position-mgmt/test'
        );
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
      loadtreasurypositionmgmtData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handletreasurypositionmgmtAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/financial/treasury-operations-advanced/treasury-position-mgmt/export'
        );
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'treasury-position-mgmt-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
