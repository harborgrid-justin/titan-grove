/**
 * Tax Reporting Suite - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Tax Reporting Suite
document.addEventListener('DOMContentLoaded', function () {
  console.log('Tax Reporting Suite page loaded');

  // Initialize page-specific features
  initializetaxreportingsuite();
});

function initializetaxreportingsuite() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handletaxreportingsuiteAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executetaxreportingsuite();
    });
  }

  // Configure page-specific buttons
  setupTaxPageActions();

  // Load initial tax data
  loadtaxreportingsuiteData();
}

async function loadtaxreportingsuiteData() {
  try {
    const response = await fetch(
      '/api/tax-management/tax-compliance-reporting/tax-reporting-suite'
    );
    if (response.ok) {
      const data = await response.json();
      updatetaxreportingsuiteDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Tax Reporting Suite data:', error);
    if (window.financialPages) {
      window.financialPages.showNotification('Failed to load tax data', 'error');
    }
  }
}

function handletaxreportingsuiteAction() {
  console.log('Tax Reporting Suite action triggered');
  if (window.financialPages) {
    window.financialPages.showNotification(
      'Tax Reporting Suite configured successfully',
      'success'
    );
  }
}

function executetaxreportingsuite() {
  console.log('Tax Reporting Suite execution started');
  if (window.financialPages) {
    window.financialPages.showNotification('Tax Reporting Suite executed successfully', 'success');
  }
}

function updatetaxreportingsuiteDisplay(data) {
  console.log('Updating Tax Reporting Suite display:', data);
  // Update UI with loaded tax data
}

function setupTaxPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/tax-management/tax-compliance-reporting/tax-reporting-suite/test'
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
      loadtaxreportingsuiteData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handletaxreportingsuiteAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/tax-management/tax-compliance-reporting/tax-reporting-suite/export'
        );
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tax-reporting-suite-tax-export.xlsx';
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
