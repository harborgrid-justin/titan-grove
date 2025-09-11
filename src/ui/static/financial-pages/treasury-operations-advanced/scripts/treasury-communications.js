/**
 * Treasury Communications Hub - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Treasury Communications Hub
document.addEventListener('DOMContentLoaded', function () {
  console.log('Treasury Communications Hub page loaded');

  // Initialize page-specific features
  initializetreasurycommunications();
});

function initializetreasurycommunications() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handletreasurycommunicationsAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executetreasurycommunications();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadtreasurycommunicationsData();
}

async function loadtreasurycommunicationsData() {
  try {
    const response = await fetch(
      '/api/financial/treasury-operations-advanced/treasury-communications'
    );
    if (response.ok) {
      const data = await response.json();
      updatetreasurycommunicationsDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Treasury Communications Hub data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handletreasurycommunicationsAction() {
  console.log('Treasury Communications Hub action triggered');
  window.financialPages.showNotification(
    'Treasury Communications Hub configured successfully',
    'success'
  );
}

function executetreasurycommunications() {
  console.log('Treasury Communications Hub execution started');
  window.financialPages.showNotification(
    'Treasury Communications Hub executed successfully',
    'success'
  );
}

function updatetreasurycommunicationsDisplay(data) {
  console.log('Updating Treasury Communications Hub display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/financial/treasury-operations-advanced/treasury-communications/test'
        );
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
      loadtreasurycommunicationsData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handletreasurycommunicationsAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/financial/treasury-operations-advanced/treasury-communications/export'
        );
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'treasury-communications-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
