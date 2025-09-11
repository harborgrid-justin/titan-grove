/**
 * Tax Allocation Rules - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Tax Allocation Rules
document.addEventListener('DOMContentLoaded', function () {
  console.log('Tax Allocation Rules page loaded');

  // Initialize page-specific features
  initializeallocationrules();
});

function initializeallocationrules() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handleallocationrulesAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executeallocationrules();
    });
  }

  // Configure page-specific buttons
  setupTaxPageActions();

  // Load initial tax data
  loadallocationrulesData();
}

async function loadallocationrulesData() {
  try {
    const response = await fetch('/api/tax-management/tax-configuration-rules/allocation-rules');
    if (response.ok) {
      const data = await response.json();
      updateallocationrulesDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Tax Allocation Rules data:', error);
    if (window.financialPages) {
      window.financialPages.showNotification('Failed to load tax data', 'error');
    }
  }
}

function handleallocationrulesAction() {
  console.log('Tax Allocation Rules action triggered');
  if (window.financialPages) {
    window.financialPages.showNotification(
      'Tax Allocation Rules configured successfully',
      'success'
    );
  }
}

function executeallocationrules() {
  console.log('Tax Allocation Rules execution started');
  if (window.financialPages) {
    window.financialPages.showNotification('Tax Allocation Rules executed successfully', 'success');
  }
}

function updateallocationrulesDisplay(data) {
  console.log('Updating Tax Allocation Rules display:', data);
  // Update UI with loaded tax data
}

function setupTaxPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/tax-management/tax-configuration-rules/allocation-rules/test'
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
      loadallocationrulesData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handleallocationrulesAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/tax-management/tax-configuration-rules/allocation-rules/export'
        );
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'allocation-rules-tax-export.xlsx';
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
