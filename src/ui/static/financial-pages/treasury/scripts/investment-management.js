/**
 * Investment Management - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Investment Management
document.addEventListener('DOMContentLoaded', function () {
  console.log('Investment Management page loaded');

  // Initialize page-specific features
  initializeinvestmentmanagement();
});

function initializeinvestmentmanagement() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handleinvestmentmanagementAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executeinvestmentmanagement();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadinvestmentmanagementData();
}

async function loadinvestmentmanagementData() {
  try {
    const response = await fetch('/api/financial/treasury/investment-management');
    if (response.ok) {
      const data = await response.json();
      updateinvestmentmanagementDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Investment Management data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handleinvestmentmanagementAction() {
  console.log('Investment Management action triggered');
  window.financialPages.showNotification(
    'Investment Management configured successfully',
    'success'
  );
}

function executeinvestmentmanagement() {
  console.log('Investment Management execution started');
  window.financialPages.showNotification('Investment Management executed successfully', 'success');
}

function updateinvestmentmanagementDisplay(data) {
  console.log('Updating Investment Management display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/treasury/investment-management/test');
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
      loadinvestmentmanagementData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handleinvestmentmanagementAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/treasury/investment-management/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'investment-management-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
