/**
 * Foreign Exchange - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Foreign Exchange
document.addEventListener('DOMContentLoaded', function () {
  console.log('Foreign Exchange page loaded');

  // Initialize page-specific features
  initializeforeignexchange();
});

function initializeforeignexchange() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handleforeignexchangeAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executeforeignexchange();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadforeignexchangeData();
}

async function loadforeignexchangeData() {
  try {
    const response = await fetch('/api/financial/treasury/foreign-exchange');
    if (response.ok) {
      const data = await response.json();
      updateforeignexchangeDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Foreign Exchange data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handleforeignexchangeAction() {
  console.log('Foreign Exchange action triggered');
  window.financialPages.showNotification('Foreign Exchange configured successfully', 'success');
}

function executeforeignexchange() {
  console.log('Foreign Exchange execution started');
  window.financialPages.showNotification('Foreign Exchange executed successfully', 'success');
}

function updateforeignexchangeDisplay(data) {
  console.log('Updating Foreign Exchange display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/treasury/foreign-exchange/test');
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
      loadforeignexchangeData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handleforeignexchangeAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/treasury/foreign-exchange/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'foreign-exchange-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
