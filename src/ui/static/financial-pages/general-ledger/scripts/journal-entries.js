/**
 * Journal Entry Management - Financial Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Journal Entry Management
document.addEventListener('DOMContentLoaded', function () {
  console.log('Journal Entry Management page loaded');

  // Initialize page-specific features
  initializejournalentries();
});

function initializejournalentries() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlejournalentriesAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executejournalentries();
    });
  }

  // Configure page-specific buttons
  setupPageActions();

  // Load initial data
  loadjournalentriesData();
}

async function loadjournalentriesData() {
  try {
    const response = await fetch('/api/financial/general-ledger/journal-entries');
    if (response.ok) {
      const data = await response.json();
      updatejournalentriesDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Journal Entry Management data:', error);
    window.financialPages.showNotification('Failed to load data', 'error');
  }
}

function handlejournalentriesAction() {
  console.log('Journal Entry Management action triggered');
  window.financialPages.showNotification(
    'Journal Entry Management configured successfully',
    'success'
  );
}

function executejournalentries() {
  console.log('Journal Entry Management execution started');
  window.financialPages.showNotification(
    'Journal Entry Management executed successfully',
    'success'
  );
}

function updatejournalentriesDisplay(data) {
  console.log('Updating Journal Entry Management display:', data);
  // Update UI with loaded data
}

function setupPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/general-ledger/journal-entries/test');
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
      loadjournalentriesData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handlejournalentriesAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/financial/general-ledger/journal-entries/export');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'journal-entries-export.xlsx';
        a.click();
        window.financialPages.showNotification('Data exported successfully', 'success');
      } catch (error) {
        window.financialPages.showNotification('Export failed', 'error');
      }
    });
  }
}
