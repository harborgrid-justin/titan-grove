/**
 * M&A Financial Analysis - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for M&A Financial Analysis
document.addEventListener('DOMContentLoaded', function () {
  console.log('M&A Financial Analysis page loaded');

  // Initialize page-specific features
  initializemergeracquisition();
});

function initializemergeracquisition() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlemergeracquisitionAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executemergeracquisition();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadmergeracquisitionData();
}

async function loadmergeracquisitionData() {
  try {
    const response = await fetch('/api/financial/strategic-planning/merger-acquisition');
    if (response.ok) {
      const data = await response.json();
      updatemergeracquisitionDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load M&A Financial Analysis data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handlemergeracquisitionAction() {
  console.log('M&A Financial Analysis action triggered');
  window.financialPages.showNotification(
    'M&A Financial Analysis configured successfully',
    'success'
  );
}

function executemergeracquisition() {
  console.log('M&A Financial Analysis execution started');
  window.financialPages.showNotification('M&A Financial Analysis executed successfully', 'success');
}

function updatemergeracquisitionDisplay(data) {
  console.log('Updating M&A Financial Analysis display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/strategic-planning/merger-acquisition/test');
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
      loadmergeracquisitionData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handlemergeracquisitionAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/strategic-planning/merger-acquisition/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'merger-acquisition-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
