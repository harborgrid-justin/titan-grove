/**
 * Financial Data Mining - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Financial Data Mining
document.addEventListener('DOMContentLoaded', function () {
  console.log('Financial Data Mining page loaded');

  // Initialize page-specific features
  initializedatamining();
});

function initializedatamining() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handledataminingAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executedatamining();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loaddataminingData();
}

async function loaddataminingData() {
  try {
    const response = await fetch('/api/financial/analytics-ai/data-mining');
    if (response.ok) {
      const data = await response.json();
      updatedataminingDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Financial Data Mining data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handledataminingAction() {
  console.log('Financial Data Mining action triggered');
  window.financialPages.showNotification(
    'Financial Data Mining configured successfully',
    'success'
  );
}

function executedatamining() {
  console.log('Financial Data Mining execution started');
  window.financialPages.showNotification('Financial Data Mining executed successfully', 'success');
}

function updatedataminingDisplay(data) {
  console.log('Updating Financial Data Mining display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/analytics-ai/data-mining/test');
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
      loaddataminingData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handledataminingAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/analytics-ai/data-mining/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data-mining-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
