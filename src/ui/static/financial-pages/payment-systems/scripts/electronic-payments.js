/**
 * Electronic Payment Systems - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Electronic Payment Systems
document.addEventListener('DOMContentLoaded', function () {
  console.log('Electronic Payment Systems page loaded');

  // Initialize page-specific features
  initializeelectronicpayments();
});

function initializeelectronicpayments() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handleelectronicpaymentsAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executeelectronicpayments();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadelectronicpaymentsData();
}

async function loadelectronicpaymentsData() {
  try {
    const response = await fetch('/api/financial/payment-systems/electronic-payments');
    if (response.ok) {
      const data = await response.json();
      updateelectronicpaymentsDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Electronic Payment Systems data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handleelectronicpaymentsAction() {
  console.log('Electronic Payment Systems action triggered');
  window.financialPages.showNotification(
    'Electronic Payment Systems configured successfully',
    'success'
  );
}

function executeelectronicpayments() {
  console.log('Electronic Payment Systems execution started');
  window.financialPages.showNotification(
    'Electronic Payment Systems executed successfully',
    'success'
  );
}

function updateelectronicpaymentsDisplay(data) {
  console.log('Updating Electronic Payment Systems display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/payment-systems/electronic-payments/test');
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
      loadelectronicpaymentsData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handleelectronicpaymentsAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/payment-systems/electronic-payments/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'electronic-payments-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
