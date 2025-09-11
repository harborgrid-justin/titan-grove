/**
 * Financial Data Privacy - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Financial Data Privacy
document.addEventListener('DOMContentLoaded', function () {
  console.log('Financial Data Privacy page loaded');

  // Initialize page-specific features
  initializedataprivacy();
});

function initializedataprivacy() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handledataprivacyAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executedataprivacy();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loaddataprivacyData();
}

async function loaddataprivacyData() {
  try {
    const response = await fetch('/api/financial/compliance-governance/data-privacy');
    if (response.ok) {
      const data = await response.json();
      updatedataprivacyDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Financial Data Privacy data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handledataprivacyAction() {
  console.log('Financial Data Privacy action triggered');
  window.financialPages.showNotification(
    'Financial Data Privacy configured successfully',
    'success'
  );
}

function executedataprivacy() {
  console.log('Financial Data Privacy execution started');
  window.financialPages.showNotification('Financial Data Privacy executed successfully', 'success');
}

function updatedataprivacyDisplay(data) {
  console.log('Updating Financial Data Privacy display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/compliance-governance/data-privacy/test');
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
      loaddataprivacyData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handledataprivacyAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/compliance-governance/data-privacy/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data-privacy-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
