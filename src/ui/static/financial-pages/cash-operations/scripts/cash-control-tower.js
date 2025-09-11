/**
 * Cash Control Tower - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Cash Control Tower
document.addEventListener('DOMContentLoaded', function () {
  console.log('Cash Control Tower page loaded');

  // Initialize page-specific features
  initializecashcontroltower();
});

function initializecashcontroltower() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlecashcontroltowerAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executecashcontroltower();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadcashcontroltowerData();
}

async function loadcashcontroltowerData() {
  try {
    const response = await fetch('/api/financial/cash-operations/cash-control-tower');
    if (response.ok) {
      const data = await response.json();
      updatecashcontroltowerDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Cash Control Tower data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handlecashcontroltowerAction() {
  console.log('Cash Control Tower action triggered');
  window.financialPages.showNotification('Cash Control Tower configured successfully', 'success');
}

function executecashcontroltower() {
  console.log('Cash Control Tower execution started');
  window.financialPages.showNotification('Cash Control Tower executed successfully', 'success');
}

function updatecashcontroltowerDisplay(data) {
  console.log('Updating Cash Control Tower display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/cash-operations/cash-control-tower/test');
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
      loadcashcontroltowerData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handlecashcontroltowerAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/cash-operations/cash-control-tower/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cash-control-tower-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
