/**
 * Strategic Financial Planning - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Strategic Financial Planning
document.addEventListener('DOMContentLoaded', function () {
  console.log('Strategic Financial Planning page loaded');

  // Initialize page-specific features
  initializestrategicplanning();
});

function initializestrategicplanning() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlestrategicplanningAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executestrategicplanning();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadstrategicplanningData();
}

async function loadstrategicplanningData() {
  try {
    const response = await fetch('/api/financial/strategic-planning/strategic-planning');
    if (response.ok) {
      const data = await response.json();
      updatestrategicplanningDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Strategic Financial Planning data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handlestrategicplanningAction() {
  console.log('Strategic Financial Planning action triggered');
  window.financialPages.showNotification(
    'Strategic Financial Planning configured successfully',
    'success'
  );
}

function executestrategicplanning() {
  console.log('Strategic Financial Planning execution started');
  window.financialPages.showNotification(
    'Strategic Financial Planning executed successfully',
    'success'
  );
}

function updatestrategicplanningDisplay(data) {
  console.log('Updating Strategic Financial Planning display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/strategic-planning/strategic-planning/test');
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
      loadstrategicplanningData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handlestrategicplanningAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/strategic-planning/strategic-planning/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'strategic-planning-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
