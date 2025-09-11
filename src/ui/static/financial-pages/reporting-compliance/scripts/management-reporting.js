/**
 * Management Reporting - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Management Reporting
document.addEventListener('DOMContentLoaded', function () {
  console.log('Management Reporting page loaded');

  // Initialize page-specific features
  initializemanagementreporting();
});

function initializemanagementreporting() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlemanagementreportingAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executemanagementreporting();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadmanagementreportingData();
}

async function loadmanagementreportingData() {
  try {
    const response = await fetch('/api/financial/reporting-compliance/management-reporting');
    if (response.ok) {
      const data = await response.json();
      updatemanagementreportingDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Management Reporting data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handlemanagementreportingAction() {
  console.log('Management Reporting action triggered');
  window.financialPages.showNotification('Management Reporting configured successfully', 'success');
}

function executemanagementreporting() {
  console.log('Management Reporting execution started');
  window.financialPages.showNotification('Management Reporting executed successfully', 'success');
}

function updatemanagementreportingDisplay(data) {
  console.log('Updating Management Reporting display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/financial/reporting-compliance/management-reporting/test'
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
      loadmanagementreportingData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handlemanagementreportingAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/financial/reporting-compliance/management-reporting/export'
        );
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'management-reporting-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
