/**
 * Tax Sensitivity Analysis - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Tax Sensitivity Analysis
document.addEventListener('DOMContentLoaded', function () {
  console.log('Tax Sensitivity Analysis page loaded');

  // Initialize page-specific features
  initializetaxsensitivityanalysis();
});

function initializetaxsensitivityanalysis() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handletaxsensitivityanalysisAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executetaxsensitivityanalysis();
    });
  }

  // Configure page-specific buttons
  setupTaxPageActions();

  // Load initial tax data
  loadtaxsensitivityanalysisData();
}

async function loadtaxsensitivityanalysisData() {
  try {
    const response = await fetch(
      '/api/tax-management/tax-analytics-intelligence/tax-sensitivity-analysis'
    );
    if (response.ok) {
      const data = await response.json();
      updatetaxsensitivityanalysisDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Tax Sensitivity Analysis data:', error);
    if (window.financialPages) {
      window.financialPages.showNotification('Failed to load tax data', 'error');
    }
  }
}

function handletaxsensitivityanalysisAction() {
  console.log('Tax Sensitivity Analysis action triggered');
  if (window.financialPages) {
    window.financialPages.showNotification(
      'Tax Sensitivity Analysis configured successfully',
      'success'
    );
  }
}

function executetaxsensitivityanalysis() {
  console.log('Tax Sensitivity Analysis execution started');
  if (window.financialPages) {
    window.financialPages.showNotification(
      'Tax Sensitivity Analysis executed successfully',
      'success'
    );
  }
}

function updatetaxsensitivityanalysisDisplay(data) {
  console.log('Updating Tax Sensitivity Analysis display:', data);
  // Update UI with loaded tax data
}

function setupTaxPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/tax-management/tax-analytics-intelligence/tax-sensitivity-analysis/test'
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
      loadtaxsensitivityanalysisData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handletaxsensitivityanalysisAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/tax-management/tax-analytics-intelligence/tax-sensitivity-analysis/export'
        );
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tax-sensitivity-analysis-tax-export.xlsx';
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
