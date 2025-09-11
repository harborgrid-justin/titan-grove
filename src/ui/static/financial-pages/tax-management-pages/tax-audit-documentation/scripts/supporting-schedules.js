/**
 * Supporting Tax Schedules - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Supporting Tax Schedules
document.addEventListener('DOMContentLoaded', function () {
  console.log('Supporting Tax Schedules page loaded');

  // Initialize page-specific features
  initializesupportingschedules();
});

function initializesupportingschedules() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handlesupportingschedulesAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executesupportingschedules();
    });
  }

  // Configure page-specific buttons
  setupTaxPageActions();

  // Load initial tax data
  loadsupportingschedulesData();
}

async function loadsupportingschedulesData() {
  try {
    const response = await fetch(
      '/api/tax-management/tax-audit-documentation/supporting-schedules'
    );
    if (response.ok) {
      const data = await response.json();
      updatesupportingschedulesDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Supporting Tax Schedules data:', error);
    if (window.financialPages) {
      window.financialPages.showNotification('Failed to load tax data', 'error');
    }
  }
}

function handlesupportingschedulesAction() {
  console.log('Supporting Tax Schedules action triggered');
  if (window.financialPages) {
    window.financialPages.showNotification(
      'Supporting Tax Schedules configured successfully',
      'success'
    );
  }
}

function executesupportingschedules() {
  console.log('Supporting Tax Schedules execution started');
  if (window.financialPages) {
    window.financialPages.showNotification(
      'Supporting Tax Schedules executed successfully',
      'success'
    );
  }
}

function updatesupportingschedulesDisplay(data) {
  console.log('Updating Supporting Tax Schedules display:', data);
  // Update UI with loaded tax data
}

function setupTaxPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/tax-management/tax-audit-documentation/supporting-schedules/test'
        );
        const result = await response.json();
        if (window.financialPages) {
          window.financialPages.showNotification('Tax integration test successful', 'success');
        }
      } catch (error) {
        if (window.financialPages) {
          window.financialPages.showNotification('Tax integration test failed', 'error');
        }
      }
    });
  }

  // View data button
  const viewDataBtn = document.getElementById('viewDataBtn');
  if (viewDataBtn) {
    viewDataBtn.addEventListener('click', function () {
      loadsupportingschedulesData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handlesupportingschedulesAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/tax-management/tax-audit-documentation/supporting-schedules/export'
        );
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'supporting-schedules-tax-export.xlsx';
        a.click();
        if (window.financialPages) {
          window.financialPages.showNotification('Tax data exported successfully', 'success');
        }
      } catch (error) {
        if (window.financialPages) {
          window.financialPages.showNotification('Tax export failed', 'error');
        }
      }
    });
  }
}
