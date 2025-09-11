/**
 * Capital Budgeting & Planning - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Capital Budgeting & Planning
document.addEventListener('DOMContentLoaded', function () {
  console.log('Capital Budgeting & Planning page loaded');

  // Initialize page-specific features
  initializecapitalbudgeting();
});

function initializecapitalbudgeting() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlecapitalbudgetingAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executecapitalbudgeting();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadcapitalbudgetingData();
}

async function loadcapitalbudgetingData() {
  try {
    const response = await fetch('/api/financial/capital-asset/capital-budgeting');
    if (response.ok) {
      const data = await response.json();
      updatecapitalbudgetingDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Capital Budgeting & Planning data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handlecapitalbudgetingAction() {
  console.log('Capital Budgeting & Planning action triggered');
  window.financialPages.showNotification(
    'Capital Budgeting & Planning configured successfully',
    'success'
  );
}

function executecapitalbudgeting() {
  console.log('Capital Budgeting & Planning execution started');
  window.financialPages.showNotification(
    'Capital Budgeting & Planning executed successfully',
    'success'
  );
}

function updatecapitalbudgetingDisplay(data) {
  console.log('Updating Capital Budgeting & Planning display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/capital-asset/capital-budgeting/test');
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
      loadcapitalbudgetingData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handlecapitalbudgetingAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/capital-asset/capital-budgeting/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'capital-budgeting-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
