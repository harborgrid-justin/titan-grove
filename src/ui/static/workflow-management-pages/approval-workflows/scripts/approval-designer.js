/**
 * Approval Designer - Workflow Management Page
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Approval Designer page loaded');
    initializePage();
});

function initializePage() {
    const executeBtn = document.getElementById('executeBtn');
    if (executeBtn) {
        executeBtn.addEventListener('click', function() {
            executeWorkflow();
        });
    }
    
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            configureWorkflow();
        });
    }

    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportData();
        });
    }
    
    loadData();
}

async function loadData() {
    try {
        const response = await fetch('/api/workflow-management/approval-workflows/approval-designer');
        if (response.ok) {
            const data = await response.json();
            console.log('Data loaded:', data);
        }
    } catch (error) {
        console.error('Failed to load data:', error);
    }
}

function executeWorkflow() {
    console.log('Approval Designer execution triggered');
    
    fetch('/api/workflow-management/approval-workflows/approval-designer/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'execute', timestamp: new Date().toISOString() })
    })
    .then(response => response.json())
    .then(data => console.log('Execution result:', data))
    .catch(error => console.error('Execution error:', error));
}

function configureWorkflow() {
    console.log('Approval Designer configuration opened');
}

function exportData() {
    console.log('Approval Designer data export initiated');
    
    fetch('/api/workflow-management/approval-workflows/approval-designer/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format: 'csv', timestamp: new Date().toISOString() })
    })
    .then(response => response.json())
    .then(data => console.log('Export result:', data))
    .catch(error => console.error('Export error:', error));
}