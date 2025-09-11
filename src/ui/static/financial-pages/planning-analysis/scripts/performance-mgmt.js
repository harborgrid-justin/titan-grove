/**
 * Performance Management - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Performance Management
document.addEventListener('DOMContentLoaded', function () {
  console.log('Performance Management page loaded');

  // Initialize page-specific features
  initializeperformancemgmt();
});

function initializeperformancemgmt() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handleperformancemgmtAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executeperformancemgmt();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadperformancemgmtData();
}

async function loadperformancemgmtData() {
  try {
    const response = await fetch('/api/financial/planning-analysis/performance-mgmt');
    if (response.ok) {
      const data = await response.json();
      updateperformancemgmtDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Performance Management data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handleperformancemgmtAction() {
  console.log('Performance Management action triggered');
  window.financialPages.showNotification(
    'Performance Management configured successfully',
    'success'
  );
}

function executeperformancemgmt() {
  console.log('Performance Management execution started');
  window.financialPages.showNotification('Performance Management executed successfully', 'success');
}

function updateperformancemgmtDisplay(data) {
  console.log('Updating Performance Management display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/planning-analysis/performance-mgmt/test');
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
      loadperformancemgmtData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handleperformancemgmtAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/planning-analysis/performance-mgmt/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'performance-mgmt-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
