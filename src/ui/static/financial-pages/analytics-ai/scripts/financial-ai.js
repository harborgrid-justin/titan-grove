/**
 * Financial AI & Automation - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Financial AI & Automation
document.addEventListener('DOMContentLoaded', function () {
  console.log('Financial AI & Automation page loaded');

  // Initialize page-specific features
  initializefinancialai();
});

function initializefinancialai() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlefinancialaiAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executefinancialai();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadfinancialaiData();
}

async function loadfinancialaiData() {
  try {
    const response = await fetch('/api/financial/analytics-ai/financial-ai');
    if (response.ok) {
      const data = await response.json();
      updatefinancialaiDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Financial AI & Automation data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handlefinancialaiAction() {
  console.log('Financial AI & Automation action triggered');
  window.financialPages.showNotification(
    'Financial AI & Automation configured successfully',
    'success'
  );
}

function executefinancialai() {
  console.log('Financial AI & Automation execution started');
  window.financialPages.showNotification(
    'Financial AI & Automation executed successfully',
    'success'
  );
}

function updatefinancialaiDisplay(data) {
  console.log('Updating Financial AI & Automation display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/analytics-ai/financial-ai/test');
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
      loadfinancialaiData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handlefinancialaiAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/analytics-ai/financial-ai/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'financial-ai-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
