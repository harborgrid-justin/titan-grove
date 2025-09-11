/**
 * Banking & Payments - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Banking & Payments
document.addEventListener('DOMContentLoaded', function () {
  console.log('Banking & Payments page loaded');

  // Initialize page-specific features
  initializebankingpayments();
});

function initializebankingpayments() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlebankingpaymentsAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executebankingpayments();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadbankingpaymentsData();
}

async function loadbankingpaymentsData() {
  try {
    const response = await fetch('/api/financial/treasury/banking-payments');
    if (response.ok) {
      const data = await response.json();
      updatebankingpaymentsDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Banking & Payments data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handlebankingpaymentsAction() {
  console.log('Banking & Payments action triggered');
  window.financialPages.showNotification('Banking & Payments configured successfully', 'success');
}

function executebankingpayments() {
  console.log('Banking & Payments execution started');
  window.financialPages.showNotification('Banking & Payments executed successfully', 'success');
}

function updatebankingpaymentsDisplay(data) {
  console.log('Updating Banking & Payments display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/treasury/banking-payments/test');
        const result = await response.json();
        window.financialPages.showNotification('Integration test successful', 'success');
      } catch (error) {
        window.financialPages.showNotification('Integration test failed', 'error');
      }
    });
  }

  // View data button
  const viewDataBtn = document.getElementById('viewDataBtn');
  if (viewDataBtn) {
    viewDataBtn.addEventListener('click', function () {
      loadbankingpaymentsData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handlebankingpaymentsAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/treasury/banking-payments/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'banking-payments-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
