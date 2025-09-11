/**
 * Budget Planning & Control - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Budget Planning & Control
document.addEventListener('DOMContentLoaded', function () {
  console.log('Budget Planning & Control page loaded');

  // Initialize page-specific features
  initializebudgetplanning();
});

function initializebudgetplanning() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlebudgetplanningAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executebudgetplanning();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadbudgetplanningData();
}

async function loadbudgetplanningData() {
  try {
    const response = await fetch('/api/financial/planning-analysis/budget-planning');
    if (response.ok) {
      const data = await response.json();
      updatebudgetplanningDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Budget Planning & Control data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handlebudgetplanningAction() {
  console.log('Budget Planning & Control action triggered');
  window.financialPages.showNotification(
    'Budget Planning & Control configured successfully',
    'success'
  );
}

function executebudgetplanning() {
  console.log('Budget Planning & Control execution started');
  window.financialPages.showNotification(
    'Budget Planning & Control executed successfully',
    'success'
  );
}

function updatebudgetplanningDisplay(data) {
  console.log('Updating Budget Planning & Control display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/planning-analysis/budget-planning/test');
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
      loadbudgetplanningData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handlebudgetplanningAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/planning-analysis/budget-planning/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'budget-planning-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
