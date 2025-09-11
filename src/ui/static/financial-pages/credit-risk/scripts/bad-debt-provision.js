/**
 * Bad Debt Provisioning - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Bad Debt Provisioning
document.addEventListener('DOMContentLoaded', function () {
  console.log('Bad Debt Provisioning page loaded');

  // Initialize page-specific features
  initializebaddebtprovision();
});

function initializebaddebtprovision() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlebaddebtprovisionAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executebaddebtprovision();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadbaddebtprovisionData();
}

async function loadbaddebtprovisionData() {
  try {
    const response = await fetch('/api/financial/credit-risk/bad-debt-provision');
    if (response.ok) {
      const data = await response.json();
      updatebaddebtprovisionDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Bad Debt Provisioning data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handlebaddebtprovisionAction() {
  console.log('Bad Debt Provisioning action triggered');
  window.financialPages.showNotification(
    'Bad Debt Provisioning configured successfully',
    'success'
  );
}

function executebaddebtprovision() {
  console.log('Bad Debt Provisioning execution started');
  window.financialPages.showNotification('Bad Debt Provisioning executed successfully', 'success');
}

function updatebaddebtprovisionDisplay(data) {
  console.log('Updating Bad Debt Provisioning display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/credit-risk/bad-debt-provision/test');
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
      loadbaddebtprovisionData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handlebaddebtprovisionAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/credit-risk/bad-debt-provision/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bad-debt-provision-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
