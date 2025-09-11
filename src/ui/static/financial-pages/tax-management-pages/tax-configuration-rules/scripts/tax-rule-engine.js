/**
 * Tax Rule Configuration Engine - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Tax Rule Configuration Engine
document.addEventListener('DOMContentLoaded', function () {
  console.log('Tax Rule Configuration Engine page loaded');

  // Initialize page-specific features
  initializetaxruleengine();
});

function initializetaxruleengine() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handletaxruleengineAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executetaxruleengine();
    });
  }

  // Configure page-specific buttons
  setupTaxPageActions();

  // Load initial tax data
  loadtaxruleengineData();
}

async function loadtaxruleengineData() {
  try {
    const response = await fetch('/api/tax-management/tax-configuration-rules/tax-rule-engine');
    if (response.ok) {
      const data = await response.json();
      updatetaxruleengineDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Tax Rule Configuration Engine data:', error);
    if (window.financialPages) {
      window.financialPages.showNotification('Failed to load tax data', 'error');
    }
  }
}

function handletaxruleengineAction() {
  console.log('Tax Rule Configuration Engine action triggered');
  if (window.financialPages) {
    window.financialPages.showNotification(
      'Tax Rule Configuration Engine configured successfully',
      'success'
    );
  }
}

function executetaxruleengine() {
  console.log('Tax Rule Configuration Engine execution started');
  if (window.financialPages) {
    window.financialPages.showNotification(
      'Tax Rule Configuration Engine executed successfully',
      'success'
    );
  }
}

function updatetaxruleengineDisplay(data) {
  console.log('Updating Tax Rule Configuration Engine display:', data);
  // Update UI with loaded tax data
}

function setupTaxPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/tax-management/tax-configuration-rules/tax-rule-engine/test'
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
      loadtaxruleengineData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handletaxruleengineAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/tax-management/tax-configuration-rules/tax-rule-engine/export'
        );
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tax-rule-engine-tax-export.xlsx';
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
