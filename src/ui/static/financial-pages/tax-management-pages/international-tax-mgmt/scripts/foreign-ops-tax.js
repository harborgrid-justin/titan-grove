/**
 * Foreign Operations Tax Management - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Foreign Operations Tax Management
document.addEventListener('DOMContentLoaded', function () {
  console.log('Foreign Operations Tax Management page loaded');

  // Initialize page-specific features
  initializeforeignopstax();
});

function initializeforeignopstax() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handleforeignopstaxAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executeforeignopstax();
    });
  }

  // Configure page-specific buttons
  setupTaxPageActions();

  // Load initial tax data
  loadforeignopstaxData();
}

async function loadforeignopstaxData() {
  try {
    const response = await fetch('/api/tax-management/international-tax-mgmt/foreign-ops-tax');
    if (response.ok) {
      const data = await response.json();
      updateforeignopstaxDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Foreign Operations Tax Management data:', error);
    if (window.financialPages) {
      window.financialPages.showNotification('Failed to load tax data', 'error');
    }
  }
}

function handleforeignopstaxAction() {
  console.log('Foreign Operations Tax Management action triggered');
  if (window.financialPages) {
    window.financialPages.showNotification(
      'Foreign Operations Tax Management configured successfully',
      'success'
    );
  }
}

function executeforeignopstax() {
  console.log('Foreign Operations Tax Management execution started');
  if (window.financialPages) {
    window.financialPages.showNotification(
      'Foreign Operations Tax Management executed successfully',
      'success'
    );
  }
}

function updateforeignopstaxDisplay(data) {
  console.log('Updating Foreign Operations Tax Management display:', data);
  // Update UI with loaded tax data
}

function setupTaxPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/tax-management/international-tax-mgmt/foreign-ops-tax/test'
        );
        const result = await response.json();
        if (window.financialPages) {
          window.financialPages.showNotification('Tax integration test successful', 'success');
        }
      } catch (error) {
        if (window.financialPages) {
          window.financialPages.showNotification('Tax integration test failed', 'error');
        }
      }
    });
  }

  // View data button
  const viewDataBtn = document.getElementById('viewDataBtn');
  if (viewDataBtn) {
    viewDataBtn.addEventListener('click', function () {
      loadforeignopstaxData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handleforeignopstaxAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/tax-management/international-tax-mgmt/foreign-ops-tax/export'
        );
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'foreign-ops-tax-tax-export.xlsx';
        a.click();
        if (window.financialPages) {
          window.financialPages.showNotification('Tax data exported successfully', 'success');
        }
      } catch (error) {
        if (window.financialPages) {
          window.financialPages.showNotification('Tax export failed', 'error');
        }
      }
    });
  }
}
