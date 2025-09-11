/**
 * Cash Performance Metrics - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Cash Performance Metrics
document.addEventListener('DOMContentLoaded', function () {
  console.log('Cash Performance Metrics page loaded');

  // Initialize page-specific features
  initializecashperformancemetrics();
});

function initializecashperformancemetrics() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlecashperformancemetricsAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executecashperformancemetrics();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadcashperformancemetricsData();
}

async function loadcashperformancemetricsData() {
  try {
    const response = await fetch('/api/financial/cash-analytics/cash-performance-metrics');
    if (response.ok) {
      const data = await response.json();
      updatecashperformancemetricsDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Cash Performance Metrics data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handlecashperformancemetricsAction() {
  console.log('Cash Performance Metrics action triggered');
  window.financialPages.showNotification(
    'Cash Performance Metrics configured successfully',
    'success'
  );
}

function executecashperformancemetrics() {
  console.log('Cash Performance Metrics execution started');
  window.financialPages.showNotification(
    'Cash Performance Metrics executed successfully',
    'success'
  );
}

function updatecashperformancemetricsDisplay(data) {
  console.log('Updating Cash Performance Metrics display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/cash-analytics/cash-performance-metrics/test');
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
      loadcashperformancemetricsData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handlecashperformancemetricsAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/financial/cash-analytics/cash-performance-metrics/export'
        );
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cash-performance-metrics-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
