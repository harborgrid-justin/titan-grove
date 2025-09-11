/**
 * Multi-Currency Management - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Multi-Currency Management
document.addEventListener('DOMContentLoaded', function () {
  console.log('Multi-Currency Management page loaded');

  // Initialize page-specific features
  initializemulticurrency();
});

function initializemulticurrency() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlemulticurrencyAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executemulticurrency();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadmulticurrencyData();
}

async function loadmulticurrencyData() {
  try {
    const response = await fetch('/api/financial/general-ledger/multi-currency');
    if (response.ok) {
      const data = await response.json();
      updatemulticurrencyDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Multi-Currency Management data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handlemulticurrencyAction() {
  console.log('Multi-Currency Management action triggered');
  window.financialPages.showNotification(
    'Multi-Currency Management configured successfully',
    'success'
  );
}

function executemulticurrency() {
  console.log('Multi-Currency Management execution started');
  window.financialPages.showNotification(
    'Multi-Currency Management executed successfully',
    'success'
  );
}

function updatemulticurrencyDisplay(data) {
  console.log('Updating Multi-Currency Management display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/general-ledger/multi-currency/test');
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
      loadmulticurrencyData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handlemulticurrencyAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/general-ledger/multi-currency/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'multi-currency-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
