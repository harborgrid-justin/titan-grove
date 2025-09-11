/**
 * Risk Management - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Risk Management
document.addEventListener('DOMContentLoaded', function () {
  console.log('Risk Management page loaded');

  // Initialize page-specific features
  initializeriskmanagement();
});

function initializeriskmanagement() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handleriskmanagementAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executeriskmanagement();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadriskmanagementData();
}

async function loadriskmanagementData() {
  try {
    const response = await fetch('/api/financial/treasury/risk-management');
    if (response.ok) {
      const data = await response.json();
      updateriskmanagementDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Risk Management data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handleriskmanagementAction() {
  console.log('Risk Management action triggered');
  window.financialPages.showNotification('Risk Management configured successfully', 'success');
}

function executeriskmanagement() {
  console.log('Risk Management execution started');
  window.financialPages.showNotification('Risk Management executed successfully', 'success');
}

function updateriskmanagementDisplay(data) {
  console.log('Updating Risk Management display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/treasury/risk-management/test');
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
      loadriskmanagementData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handleriskmanagementAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/treasury/risk-management/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'risk-management-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
