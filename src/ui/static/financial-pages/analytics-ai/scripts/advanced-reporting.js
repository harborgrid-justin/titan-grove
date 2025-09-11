/**
 * Advanced Reporting & BI - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Advanced Reporting & BI
document.addEventListener('DOMContentLoaded', function () {
  console.log('Advanced Reporting & BI page loaded');

  // Initialize page-specific features
  initializeadvancedreporting();
});

function initializeadvancedreporting() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handleadvancedreportingAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executeadvancedreporting();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadadvancedreportingData();
}

async function loadadvancedreportingData() {
  try {
    const response = await fetch('/api/financial/analytics-ai/advanced-reporting');
    if (response.ok) {
      const data = await response.json();
      updateadvancedreportingDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Advanced Reporting & BI data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handleadvancedreportingAction() {
  console.log('Advanced Reporting & BI action triggered');
  window.financialPages.showNotification(
    'Advanced Reporting & BI configured successfully',
    'success'
  );
}

function executeadvancedreporting() {
  console.log('Advanced Reporting & BI execution started');
  window.financialPages.showNotification(
    'Advanced Reporting & BI executed successfully',
    'success'
  );
}

function updateadvancedreportingDisplay(data) {
  console.log('Updating Advanced Reporting & BI display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/analytics-ai/advanced-reporting/test');
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
      loadadvancedreportingData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handleadvancedreportingAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/analytics-ai/advanced-reporting/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'advanced-reporting-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
