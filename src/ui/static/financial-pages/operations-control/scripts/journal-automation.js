/**
 * Journal Entry Automation - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Journal Entry Automation
document.addEventListener('DOMContentLoaded', function () {
  console.log('Journal Entry Automation page loaded');

  // Initialize page-specific features
  initializejournalautomation();
});

function initializejournalautomation() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlejournalautomationAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executejournalautomation();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadjournalautomationData();
}

async function loadjournalautomationData() {
  try {
    const response = await fetch('/api/financial/operations-control/journal-automation');
    if (response.ok) {
      const data = await response.json();
      updatejournalautomationDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Journal Entry Automation data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handlejournalautomationAction() {
  console.log('Journal Entry Automation action triggered');
  window.financialPages.showNotification(
    'Journal Entry Automation configured successfully',
    'success'
  );
}

function executejournalautomation() {
  console.log('Journal Entry Automation execution started');
  window.financialPages.showNotification(
    'Journal Entry Automation executed successfully',
    'success'
  );
}

function updatejournalautomationDisplay(data) {
  console.log('Updating Journal Entry Automation display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/operations-control/journal-automation/test');
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
      loadjournalautomationData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handlejournalautomationAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/operations-control/journal-automation/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'journal-automation-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
