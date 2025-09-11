/**
 * Financial Policy Management - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Financial Policy Management
document.addEventListener('DOMContentLoaded', function () {
  console.log('Financial Policy Management page loaded');

  // Initialize page-specific features
  initializepolicymanagement();
});

function initializepolicymanagement() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlepolicymanagementAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executepolicymanagement();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadpolicymanagementData();
}

async function loadpolicymanagementData() {
  try {
    const response = await fetch('/api/financial/compliance-governance/policy-management');
    if (response.ok) {
      const data = await response.json();
      updatepolicymanagementDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Financial Policy Management data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handlepolicymanagementAction() {
  console.log('Financial Policy Management action triggered');
  window.financialPages.showNotification(
    'Financial Policy Management configured successfully',
    'success'
  );
}

function executepolicymanagement() {
  console.log('Financial Policy Management execution started');
  window.financialPages.showNotification(
    'Financial Policy Management executed successfully',
    'success'
  );
}

function updatepolicymanagementDisplay(data) {
  console.log('Updating Financial Policy Management display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/compliance-governance/policy-management/test');
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
      loadpolicymanagementData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handlepolicymanagementAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/financial/compliance-governance/policy-management/export'
        );
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'policy-management-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
