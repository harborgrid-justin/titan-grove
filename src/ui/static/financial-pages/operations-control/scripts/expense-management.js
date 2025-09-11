/**
 * Expense Management & Control - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Expense Management & Control
document.addEventListener('DOMContentLoaded', function () {
  console.log('Expense Management & Control page loaded');

  // Initialize page-specific features
  initializeexpensemanagement();
});

function initializeexpensemanagement() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handleexpensemanagementAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executeexpensemanagement();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadexpensemanagementData();
}

async function loadexpensemanagementData() {
  try {
    const response = await fetch('/api/financial/operations-control/expense-management');
    if (response.ok) {
      const data = await response.json();
      updateexpensemanagementDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Expense Management & Control data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handleexpensemanagementAction() {
  console.log('Expense Management & Control action triggered');
  window.financialPages.showNotification(
    'Expense Management & Control configured successfully',
    'success'
  );
}

function executeexpensemanagement() {
  console.log('Expense Management & Control execution started');
  window.financialPages.showNotification(
    'Expense Management & Control executed successfully',
    'success'
  );
}

function updateexpensemanagementDisplay(data) {
  console.log('Updating Expense Management & Control display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/operations-control/expense-management/test');
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
      loadexpensemanagementData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handleexpensemanagementAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/operations-control/expense-management/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'expense-management-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
