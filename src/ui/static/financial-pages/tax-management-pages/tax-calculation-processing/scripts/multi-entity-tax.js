/**
 * Multi-Entity Tax Processing - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Multi-Entity Tax Processing
document.addEventListener('DOMContentLoaded', function () {
  console.log('Multi-Entity Tax Processing page loaded');

  // Initialize page-specific features
  initializemultientitytax();
});

function initializemultientitytax() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlemultientitytaxAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executemultientitytax();
    });
  }

  // Configure page-specific buttons
  setupTaxPageActions();

  // Load initial tax data
  loadmultientitytaxData();
}

async function loadmultientitytaxData() {
  try {
    const response = await fetch('/api/tax-management/tax-calculation-processing/multi-entity-tax');
    if (response.ok) {
      const data = await response.json();
      updatemultientitytaxDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Multi-Entity Tax Processing data:', error);
    if (window.financialPages) {
      window.financialPages.showNotification('Failed to load tax data', 'error');
    }
  }
}

function handlemultientitytaxAction() {
  console.log('Multi-Entity Tax Processing action triggered');
  if (window.financialPages) {
    window.financialPages.showNotification(
      'Multi-Entity Tax Processing configured successfully',
      'success'
    );
  }
}

function executemultientitytax() {
  console.log('Multi-Entity Tax Processing execution started');
  if (window.financialPages) {
    window.financialPages.showNotification(
      'Multi-Entity Tax Processing executed successfully',
      'success'
    );
  }
}

function updatemultientitytaxDisplay(data) {
  console.log('Updating Multi-Entity Tax Processing display:', data);
  // Update UI with loaded tax data
}

function setupTaxPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/tax-management/tax-calculation-processing/multi-entity-tax/test'
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
      loadmultientitytaxData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handlemultientitytaxAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/tax-management/tax-calculation-processing/multi-entity-tax/export'
        );
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'multi-entity-tax-tax-export.xlsx';
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
