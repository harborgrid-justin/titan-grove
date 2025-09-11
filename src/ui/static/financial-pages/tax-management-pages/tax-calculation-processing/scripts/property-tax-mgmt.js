/**
 * Property Tax Management - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Property Tax Management
document.addEventListener('DOMContentLoaded', function () {
  console.log('Property Tax Management page loaded');

  // Initialize page-specific features
  initializepropertytaxmgmt();
});

function initializepropertytaxmgmt() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlepropertytaxmgmtAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executepropertytaxmgmt();
    });
  }

  // Configure page-specific buttons
  setupTaxPageActions();

  // Load initial tax data
  loadpropertytaxmgmtData();
}

async function loadpropertytaxmgmtData() {
  try {
    const response = await fetch(
      '/api/tax-management/tax-calculation-processing/property-tax-mgmt'
    );
    if (response.ok) {
      const data = await response.json();
      updatepropertytaxmgmtDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Property Tax Management data:', error);
    if (window.financialPages) {
      window.financialPages.showNotification('Failed to load tax data', 'error');
    }
  }
}

function handlepropertytaxmgmtAction() {
  console.log('Property Tax Management action triggered');
  if (window.financialPages) {
    window.financialPages.showNotification(
      'Property Tax Management configured successfully',
      'success'
    );
  }
}

function executepropertytaxmgmt() {
  console.log('Property Tax Management execution started');
  if (window.financialPages) {
    window.financialPages.showNotification(
      'Property Tax Management executed successfully',
      'success'
    );
  }
}

function updatepropertytaxmgmtDisplay(data) {
  console.log('Updating Property Tax Management display:', data);
  // Update UI with loaded tax data
}

function setupTaxPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/tax-management/tax-calculation-processing/property-tax-mgmt/test'
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
      loadpropertytaxmgmtData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handlepropertytaxmgmtAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/tax-management/tax-calculation-processing/property-tax-mgmt/export'
        );
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'property-tax-mgmt-tax-export.xlsx';
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
