/**
 * Business Rules Engine - Workflow Management Page
 */

document.addEventListener('DOMContentLoaded', function () {
  console.log('Business Rules Engine page loaded');
  initializePage();
});

function initializePage() {
  const executeBtn = document.getElementById('executeBtn');
  if (executeBtn) {
    executeBtn.addEventListener('click', function () {
      executeWorkflow();
    });
  }

  const configureBtn = document.getElementById('configureBtn');
  if (configureBtn) {
    configureBtn.addEventListener('click', function () {
      configureWorkflow();
    });
  }

  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', function () {
      exportData();
    });
  }

  loadData();
}

async function loadData() {
  try {
    const response = await fetch('/api/workflow-management/business-rules/rules-engine');
    if (response.ok) {
      const data = await response.json();
      console.log('Data loaded:', data);
    }
  } catch (error) {
    console.error('Failed to load data:', error);
  }
}

function executeWorkflow() {
  console.log('Business Rules Engine execution triggered');

  fetch('/api/workflow-management/business-rules/rules-engine/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'execute', timestamp: new Date().toISOString() }),
  })
    .then((response) => response.json())
    .then((data) => console.log('Execution result:', data))
    .catch((error) => console.error('Execution error:', error));
}

function configureWorkflow() {
  console.log('Business Rules Engine configuration opened');
}

function exportData() {
  console.log('Business Rules Engine data export initiated');

  fetch('/api/workflow-management/business-rules/rules-engine/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ format: 'csv', timestamp: new Date().toISOString() }),
  })
    .then((response) => response.json())
    .then((data) => console.log('Export result:', data))
    .catch((error) => console.error('Export error:', error));
}
