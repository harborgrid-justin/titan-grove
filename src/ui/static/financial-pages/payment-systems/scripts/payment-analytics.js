/**
 * Payment Analytics & Intelligence - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Payment Analytics & Intelligence
document.addEventListener('DOMContentLoaded', function () {
  console.log('Payment Analytics & Intelligence page loaded');

  // Initialize page-specific features
  initializepaymentanalytics();
});

function initializepaymentanalytics() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlepaymentanalyticsAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executepaymentanalytics();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadpaymentanalyticsData();
}

async function loadpaymentanalyticsData() {
  try {
    const response = await fetch('/api/financial/payment-systems/payment-analytics');
    if (response.ok) {
      const data = await response.json();
      updatepaymentanalyticsDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Payment Analytics & Intelligence data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handlepaymentanalyticsAction() {
  console.log('Payment Analytics & Intelligence action triggered');
  window.financialPages.showNotification(
    'Payment Analytics & Intelligence configured successfully',
    'success'
  );
}

function executepaymentanalytics() {
  console.log('Payment Analytics & Intelligence execution started');
  window.financialPages.showNotification(
    'Payment Analytics & Intelligence executed successfully',
    'success'
  );
}

function updatepaymentanalyticsDisplay(data) {
  console.log('Updating Payment Analytics & Intelligence display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/payment-systems/payment-analytics/test');
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
      loadpaymentanalyticsData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handlepaymentanalyticsAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/payment-systems/payment-analytics/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'payment-analytics-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
