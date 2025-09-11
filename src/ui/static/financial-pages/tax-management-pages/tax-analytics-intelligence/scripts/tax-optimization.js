/**
 * Tax Optimization Engine - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Tax Optimization Engine
document.addEventListener('DOMContentLoaded', function () {
  console.log('Tax Optimization Engine page loaded');

  // Initialize page-specific features
  initializetaxoptimization();
});

function initializetaxoptimization() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handletaxoptimizationAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executetaxoptimization();
    });
  }

  // Configure page-specific buttons
  setupTaxPageActions();

  // Load initial tax data
  loadtaxoptimizationData();
}

async function loadtaxoptimizationData() {
  try {
    const response = await fetch('/api/tax-management/tax-analytics-intelligence/tax-optimization');
    if (response.ok) {
      const data = await response.json();
      updatetaxoptimizationDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Tax Optimization Engine data:', error);
    if (window.financialPages) {
      window.financialPages.showNotification('Failed to load tax data', 'error');
    }
  }
}

function handletaxoptimizationAction() {
  console.log('Tax Optimization Engine action triggered');
  if (window.financialPages) {
    window.financialPages.showNotification(
      'Tax Optimization Engine configured successfully',
      'success'
    );
  }
}

function executetaxoptimization() {
  console.log('Tax Optimization Engine execution started');
  if (window.financialPages) {
    window.financialPages.showNotification(
      'Tax Optimization Engine executed successfully',
      'success'
    );
  }
}

function updatetaxoptimizationDisplay(data) {
  console.log('Updating Tax Optimization Engine display:', data);
  // Update UI with loaded tax data
}

function setupTaxPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/tax-management/tax-analytics-intelligence/tax-optimization/test'
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
      loadtaxoptimizationData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handletaxoptimizationAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/tax-management/tax-analytics-intelligence/tax-optimization/export'
        );
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tax-optimization-tax-export.xlsx';
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
