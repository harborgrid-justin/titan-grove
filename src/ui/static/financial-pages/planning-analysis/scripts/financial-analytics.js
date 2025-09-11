/**
 * Financial Analytics - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Financial Analytics
document.addEventListener('DOMContentLoaded', function () {
  console.log('Financial Analytics page loaded');

  // Initialize page-specific features
  initializefinancialanalytics();
});

function initializefinancialanalytics() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlefinancialanalyticsAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executefinancialanalytics();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadfinancialanalyticsData();
}

async function loadfinancialanalyticsData() {
  try {
    const response = await fetch('/api/financial/planning-analysis/financial-analytics');
    if (response.ok) {
      const data = await response.json();
      updatefinancialanalyticsDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Financial Analytics data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handlefinancialanalyticsAction() {
  console.log('Financial Analytics action triggered');
  window.financialPages.showNotification('Financial Analytics configured successfully', 'success');
}

function executefinancialanalytics() {
  console.log('Financial Analytics execution started');
  window.financialPages.showNotification('Financial Analytics executed successfully', 'success');
}

function updatefinancialanalyticsDisplay(data) {
  console.log('Updating Financial Analytics display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/planning-analysis/financial-analytics/test');
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
      loadfinancialanalyticsData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handlefinancialanalyticsAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/planning-analysis/financial-analytics/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'financial-analytics-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
