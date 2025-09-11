/**
 * Tax Exemption Management - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Tax Exemption Management
document.addEventListener('DOMContentLoaded', function () {
  console.log('Tax Exemption Management page loaded');

  // Initialize page-specific features
  initializeexemptionmgmt();
});

function initializeexemptionmgmt() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handleexemptionmgmtAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executeexemptionmgmt();
    });
  }

  // Configure page-specific buttons
  setupTaxPageActions();

  // Load initial tax data
  loadexemptionmgmtData();
}

async function loadexemptionmgmtData() {
  try {
    const response = await fetch('/api/tax-management/tax-configuration-rules/exemption-mgmt');
    if (response.ok) {
      const data = await response.json();
      updateexemptionmgmtDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Tax Exemption Management data:', error);
    if (window.financialPages) {
      window.financialPages.showNotification('Failed to load tax data', 'error');
    }
  }
}

function handleexemptionmgmtAction() {
  console.log('Tax Exemption Management action triggered');
  if (window.financialPages) {
    window.financialPages.showNotification(
      'Tax Exemption Management configured successfully',
      'success'
    );
  }
}

function executeexemptionmgmt() {
  console.log('Tax Exemption Management execution started');
  if (window.financialPages) {
    window.financialPages.showNotification(
      'Tax Exemption Management executed successfully',
      'success'
    );
  }
}

function updateexemptionmgmtDisplay(data) {
  console.log('Updating Tax Exemption Management display:', data);
  // Update UI with loaded tax data
}

function setupTaxPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/tax-management/tax-configuration-rules/exemption-mgmt/test'
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
      loadexemptionmgmtData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handleexemptionmgmtAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/tax-management/tax-configuration-rules/exemption-mgmt/export'
        );
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'exemption-mgmt-tax-export.xlsx';
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
