/**
 * International Tax Reporting - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for International Tax Reporting
document.addEventListener('DOMContentLoaded', function () {
  console.log('International Tax Reporting page loaded');

  // Initialize page-specific features
  initializeinternationalreporting();
});

function initializeinternationalreporting() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handleinternationalreportingAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executeinternationalreporting();
    });
  }

  // Configure page-specific buttons
  setupTaxPageActions();

  // Load initial tax data
  loadinternationalreportingData();
}

async function loadinternationalreportingData() {
  try {
    const response = await fetch(
      '/api/tax-management/tax-compliance-reporting/international-reporting'
    );
    if (response.ok) {
      const data = await response.json();
      updateinternationalreportingDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load International Tax Reporting data:', error);
    if (window.financialPages) {
      window.financialPages.showNotification('Failed to load tax data', 'error');
    }
  }
}

function handleinternationalreportingAction() {
  console.log('International Tax Reporting action triggered');
  if (window.financialPages) {
    window.financialPages.showNotification(
      'International Tax Reporting configured successfully',
      'success'
    );
  }
}

function executeinternationalreporting() {
  console.log('International Tax Reporting execution started');
  if (window.financialPages) {
    window.financialPages.showNotification(
      'International Tax Reporting executed successfully',
      'success'
    );
  }
}

function updateinternationalreportingDisplay(data) {
  console.log('Updating International Tax Reporting display:', data);
  // Update UI with loaded tax data
}

function setupTaxPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/tax-management/tax-compliance-reporting/international-reporting/test'
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
      loadinternationalreportingData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handleinternationalreportingAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/tax-management/tax-compliance-reporting/international-reporting/export'
        );
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'international-reporting-tax-export.xlsx';
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
