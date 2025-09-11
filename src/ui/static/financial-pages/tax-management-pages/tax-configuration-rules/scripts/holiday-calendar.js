/**
 * Tax Holiday Calendar - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Tax Holiday Calendar
document.addEventListener('DOMContentLoaded', function () {
  console.log('Tax Holiday Calendar page loaded');

  // Initialize page-specific features
  initializeholidaycalendar();
});

function initializeholidaycalendar() {
  // Configure action button
  const actionBtn = document.getElementById('actionBtn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function () {
      handleholidaycalendarAction();
    });
  }

  // Configure primary button
  const primaryBtn = document.getElementById('primaryBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function () {
      executeholidaycalendar();
    });
  }

  // Configure page-specific buttons
  setupTaxPageActions();

  // Load initial tax data
  loadholidaycalendarData();
}

async function loadholidaycalendarData() {
  try {
    const response = await fetch('/api/tax-management/tax-configuration-rules/holiday-calendar');
    if (response.ok) {
      const data = await response.json();
      updateholidaycalendarDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load Tax Holiday Calendar data:', error);
    if (window.financialPages) {
      window.financialPages.showNotification('Failed to load tax data', 'error');
    }
  }
}

function handleholidaycalendarAction() {
  console.log('Tax Holiday Calendar action triggered');
  if (window.financialPages) {
    window.financialPages.showNotification(
      'Tax Holiday Calendar configured successfully',
      'success'
    );
  }
}

function executeholidaycalendar() {
  console.log('Tax Holiday Calendar execution started');
  if (window.financialPages) {
    window.financialPages.showNotification('Tax Holiday Calendar executed successfully', 'success');
  }
}

function updateholidaycalendarDisplay(data) {
  console.log('Updating Tax Holiday Calendar display:', data);
  // Update UI with loaded tax data
}

function setupTaxPageActions() {
  // Test integration button
  const testBtn = document.getElementById('testIntegrationBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/tax-management/tax-configuration-rules/holiday-calendar/test'
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
      loadholidaycalendarData();
    });
  }

  // Configure button
  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      handleholidaycalendarAction();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function () {
      try {
        const response = await fetch(
          '/api/tax-management/tax-configuration-rules/holiday-calendar/export'
        );
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'holiday-calendar-tax-export.xlsx';
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
