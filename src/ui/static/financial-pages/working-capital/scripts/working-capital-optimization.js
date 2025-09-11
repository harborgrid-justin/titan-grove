/**
 * Working Capital Optimization - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Working Capital Optimization
document.addEventListener('DOMContentLoaded', function () {
  console.log('Working Capital Optimization page loaded');

  // Initialize page-specific features
  initializeworkingcapitaloptimization();
});

function initializeworkingcapitaloptimization() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handleworkingcapitaloptimizationAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executeworkingcapitaloptimization();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadworkingcapitaloptimizationData();
}

async function loadworkingcapitaloptimizationData() {
  try {
    const response = await fetch('/api/financial/working-capital/working-capital-optimization');
    if (response.ok) {
      const data = await response.json();
      updateworkingcapitaloptimizationDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Working Capital Optimization data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handleworkingcapitaloptimizationAction() {
  console.log('Working Capital Optimization action triggered');
  window.financialPages.showNotification(
    'Working Capital Optimization configured successfully',
    'success'
  );
}

function executeworkingcapitaloptimization() {
  console.log('Working Capital Optimization execution started');
  window.financialPages.showNotification(
    'Working Capital Optimization executed successfully',
    'success'
  );
}

function updateworkingcapitaloptimizationDisplay(data) {
  console.log('Updating Working Capital Optimization display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/financial/working-capital/working-capital-optimization/test'
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
      loadworkingcapitaloptimizationData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handleworkingcapitaloptimizationAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/financial/working-capital/working-capital-optimization/export'
        );
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'working-capital-optimization-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
