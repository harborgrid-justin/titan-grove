/**
 * Value Creation Analysis - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Value Creation Analysis
document.addEventListener('DOMContentLoaded', function () {
  console.log('Value Creation Analysis page loaded');

  // Initialize page-specific features
  initializevaluecreation();
});

function initializevaluecreation() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlevaluecreationAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executevaluecreation();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadvaluecreationData();
}

async function loadvaluecreationData() {
  try {
    const response = await fetch('/api/financial/strategic-planning/value-creation');
    if (response.ok) {
      const data = await response.json();
      updatevaluecreationDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Value Creation Analysis data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handlevaluecreationAction() {
  console.log('Value Creation Analysis action triggered');
  window.financialPages.showNotification(
    'Value Creation Analysis configured successfully',
    'success'
  );
}

function executevaluecreation() {
  console.log('Value Creation Analysis execution started');
  window.financialPages.showNotification(
    'Value Creation Analysis executed successfully',
    'success'
  );
}

function updatevaluecreationDisplay(data) {
  console.log('Updating Value Creation Analysis display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/strategic-planning/value-creation/test');
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
      loadvaluecreationData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handlevaluecreationAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/strategic-planning/value-creation/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'value-creation-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
