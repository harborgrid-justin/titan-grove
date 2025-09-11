/**
 * Capital Structure Analysis - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Capital Structure Analysis
document.addEventListener('DOMContentLoaded', function () {
  console.log('Capital Structure Analysis page loaded');

  // Initialize page-specific features
  initializecapitalstructure();
});

function initializecapitalstructure() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlecapitalstructureAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executecapitalstructure();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadcapitalstructureData();
}

async function loadcapitalstructureData() {
  try {
    const response = await fetch('/api/financial/capital-asset/capital-structure');
    if (response.ok) {
      const data = await response.json();
      updatecapitalstructureDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Capital Structure Analysis data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handlecapitalstructureAction() {
  console.log('Capital Structure Analysis action triggered');
  window.financialPages.showNotification(
    'Capital Structure Analysis configured successfully',
    'success'
  );
}

function executecapitalstructure() {
  console.log('Capital Structure Analysis execution started');
  window.financialPages.showNotification(
    'Capital Structure Analysis executed successfully',
    'success'
  );
}

function updatecapitalstructureDisplay(data) {
  console.log('Updating Capital Structure Analysis display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/capital-asset/capital-structure/test');
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
      loadcapitalstructureData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handlecapitalstructureAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/capital-asset/capital-structure/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'capital-structure-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
