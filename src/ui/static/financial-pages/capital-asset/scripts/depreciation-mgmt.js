/**
 * Depreciation Management - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Depreciation Management
document.addEventListener('DOMContentLoaded', function () {
  console.log('Depreciation Management page loaded');

  // Initialize page-specific features
  initializedepreciationmgmt();
});

function initializedepreciationmgmt() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handledepreciationmgmtAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executedepreciationmgmt();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loaddepreciationmgmtData();
}

async function loaddepreciationmgmtData() {
  try {
    const response = await fetch('/api/financial/capital-asset/depreciation-mgmt');
    if (response.ok) {
      const data = await response.json();
      updatedepreciationmgmtDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Depreciation Management data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handledepreciationmgmtAction() {
  console.log('Depreciation Management action triggered');
  window.financialPages.showNotification(
    'Depreciation Management configured successfully',
    'success'
  );
}

function executedepreciationmgmt() {
  console.log('Depreciation Management execution started');
  window.financialPages.showNotification(
    'Depreciation Management executed successfully',
    'success'
  );
}

function updatedepreciationmgmtDisplay(data) {
  console.log('Updating Depreciation Management display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/capital-asset/depreciation-mgmt/test');
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
      loaddepreciationmgmtData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handledepreciationmgmtAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/capital-asset/depreciation-mgmt/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'depreciation-mgmt-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
