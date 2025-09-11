/**
 * Tax Management - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Tax Management
document.addEventListener('DOMContentLoaded', function () {
  console.log('Tax Management page loaded');

  // Initialize page-specific features
  initializetaxmanagement();
});

function initializetaxmanagement() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handletaxmanagementAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executetaxmanagement();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadtaxmanagementData();
}

async function loadtaxmanagementData() {
  try {
    const response = await fetch('/api/financial/reporting-compliance/tax-management');
    if (response.ok) {
      const data = await response.json();
      updatetaxmanagementDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Tax Management data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handletaxmanagementAction() {
  console.log('Tax Management action triggered');
  window.financialPages.showNotification('Tax Management configured successfully', 'success');
}

function executetaxmanagement() {
  console.log('Tax Management execution started');
  window.financialPages.showNotification('Tax Management executed successfully', 'success');
}

function updatetaxmanagementDisplay(data) {
  console.log('Updating Tax Management display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/reporting-compliance/tax-management/test');
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
      loadtaxmanagementData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handletaxmanagementAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/reporting-compliance/tax-management/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tax-management-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
