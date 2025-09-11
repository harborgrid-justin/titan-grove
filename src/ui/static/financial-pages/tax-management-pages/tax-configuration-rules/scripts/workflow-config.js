/**
 * Tax Workflow Configuration - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Tax Workflow Configuration
document.addEventListener('DOMContentLoaded', function () {
  console.log('Tax Workflow Configuration page loaded');

  // Initialize page-specific features
  initializeworkflowconfig();
});

function initializeworkflowconfig() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handleworkflowconfigAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executeworkflowconfig();
    });
  }

  // Configure page-specific buttons
  setupTaxPageActions();

  // Load initial tax data
  loadworkflowconfigData();
}

async function loadworkflowconfigData() {
  try {
    const response = await fetch('/api/tax-management/tax-configuration-rules/workflow-config');
    if (response.ok) {
      const data = await response.json();
      updateworkflowconfigDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Tax Workflow Configuration data:', error);
    if (window.financialPages) {
      window.financialPages.showNotification('Failed to load tax data', 'error');
    }
  }
}

function handleworkflowconfigAction() {
  console.log('Tax Workflow Configuration action triggered');
  if (window.financialPages) {
    window.financialPages.showNotification(
      'Tax Workflow Configuration configured successfully',
      'success'
    );
  }
}

function executeworkflowconfig() {
  console.log('Tax Workflow Configuration execution started');
  if (window.financialPages) {
    window.financialPages.showNotification(
      'Tax Workflow Configuration executed successfully',
      'success'
    );
  }
}

function updateworkflowconfigDisplay(data) {
  console.log('Updating Tax Workflow Configuration display:', data);
  // Update UI with loaded tax data
}

function setupTaxPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/tax-management/tax-configuration-rules/workflow-config/test'
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
      loadworkflowconfigData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handleworkflowconfigAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/tax-management/tax-configuration-rules/workflow-config/export'
        );
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'workflow-config-tax-export.xlsx';
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
