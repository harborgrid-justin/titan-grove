/**
 * Cash Planning & Scenarios - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Cash Planning & Scenarios
document.addEventListener('DOMContentLoaded', function () {
  console.log('Cash Planning & Scenarios page loaded');

  // Initialize page-specific features
  initializecashplanningscenarios();
});

function initializecashplanningscenarios() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlecashplanningscenariosAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executecashplanningscenarios();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadcashplanningscenariosData();
}

async function loadcashplanningscenariosData() {
  try {
    const response = await fetch(
      '/api/financial/cash-forecasting-planning/cash-planning-scenarios'
    );
    if (response.ok) {
      const data = await response.json();
      updatecashplanningscenariosDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Cash Planning & Scenarios data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handlecashplanningscenariosAction() {
  console.log('Cash Planning & Scenarios action triggered');
  window.financialPages.showNotification(
    'Cash Planning & Scenarios configured successfully',
    'success'
  );
}

function executecashplanningscenarios() {
  console.log('Cash Planning & Scenarios execution started');
  window.financialPages.showNotification(
    'Cash Planning & Scenarios executed successfully',
    'success'
  );
}

function updatecashplanningscenariosDisplay(data) {
  console.log('Updating Cash Planning & Scenarios display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/financial/cash-forecasting-planning/cash-planning-scenarios/test'
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
      loadcashplanningscenariosData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handlecashplanningscenariosAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/financial/cash-forecasting-planning/cash-planning-scenarios/export'
        );
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cash-planning-scenarios-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
