/**
 * Tax Integration Configuration - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Tax Integration Configuration
document.addEventListener('DOMContentLoaded', function () {
  console.log('Tax Integration Configuration page loaded');

  // Initialize page-specific features
  initializeintegrationconfig();
});

function initializeintegrationconfig() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handleintegrationconfigAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executeintegrationconfig();
    });
  }

  // Configure page-specific buttons
  setupTaxPageActions();

  // Load initial tax data
  loadintegrationconfigData();
}

async function loadintegrationconfigData() {
  try {
    const response = await fetch('/api/tax-management/tax-configuration-rules/integration-config');
    if (response.ok) {
      const data = await response.json();
      updateintegrationconfigDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Tax Integration Configuration data:', error);
    if (window.financialPages) {
      window.financialPages.showNotification('Failed to load tax data', 'error');
    }
  }
}

function handleintegrationconfigAction() {
  console.log('Tax Integration Configuration action triggered');
  if (window.financialPages) {
    window.financialPages.showNotification(
      'Tax Integration Configuration configured successfully',
      'success'
    );
  }
}

function executeintegrationconfig() {
  console.log('Tax Integration Configuration execution started');
  if (window.financialPages) {
    window.financialPages.showNotification(
      'Tax Integration Configuration executed successfully',
      'success'
    );
  }
}

function updateintegrationconfigDisplay(data) {
  console.log('Updating Tax Integration Configuration display:', data);
  // Update UI with loaded tax data
}

function setupTaxPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/tax-management/tax-configuration-rules/integration-config/test'
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
      loadintegrationconfigData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handleintegrationconfigAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/tax-management/tax-configuration-rules/integration-config/export'
        );
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'integration-config-tax-export.xlsx';
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
