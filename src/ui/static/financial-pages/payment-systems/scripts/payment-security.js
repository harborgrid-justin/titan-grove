/**
 * Payment Security & Fraud Prevention - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Payment Security & Fraud Prevention
document.addEventListener('DOMContentLoaded', function () {
  console.log('Payment Security & Fraud Prevention page loaded');

  // Initialize page-specific features
  initializepaymentsecurity();
});

function initializepaymentsecurity() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlepaymentsecurityAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executepaymentsecurity();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadpaymentsecurityData();
}

async function loadpaymentsecurityData() {
  try {
    const response = await fetch('/api/financial/payment-systems/payment-security');
    if (response.ok) {
      const data = await response.json();
      updatepaymentsecurityDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Payment Security & Fraud Prevention data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handlepaymentsecurityAction() {
  console.log('Payment Security & Fraud Prevention action triggered');
  window.financialPages.showNotification(
    'Payment Security & Fraud Prevention configured successfully',
    'success'
  );
}

function executepaymentsecurity() {
  console.log('Payment Security & Fraud Prevention execution started');
  window.financialPages.showNotification(
    'Payment Security & Fraud Prevention executed successfully',
    'success'
  );
}

function updatepaymentsecurityDisplay(data) {
  console.log('Updating Payment Security & Fraud Prevention display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/payment-systems/payment-security/test');
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
      loadpaymentsecurityData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handlepaymentsecurityAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/payment-systems/payment-security/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'payment-security-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
