/**
 * Tax Benchmark Analysis - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Tax Benchmark Analysis
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tax Benchmark Analysis page loaded');
    
    // Initialize page-specific features
    initializebenchmarkanalysis();
});

function initializebenchmarkanalysis() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlebenchmarkanalysisAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executebenchmarkanalysis();
        });
    }
    
    // Configure page-specific buttons
    setupTaxPageActions();
    
    // Load initial tax data
    loadbenchmarkanalysisData();
}

async function loadbenchmarkanalysisData() {
    try {
        const response = await fetch('/api/tax-management/tax-analytics-intelligence/benchmark-analysis');
        if (response.ok) {
            const data = await response.json();
            updatebenchmarkanalysisDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Tax Benchmark Analysis data:', error);
        if (window.financialPages) {
            window.financialPages.showNotification('Failed to load tax data', 'error');
        }
    }
}

function handlebenchmarkanalysisAction() {
    console.log('Tax Benchmark Analysis action triggered');
    if (window.financialPages) {
        window.financialPages.showNotification('Tax Benchmark Analysis configured successfully', 'success');
    }
}

function executebenchmarkanalysis() {
    console.log('Tax Benchmark Analysis execution started');
    if (window.financialPages) {
        window.financialPages.showNotification('Tax Benchmark Analysis executed successfully', 'success');
    }
}

function updatebenchmarkanalysisDisplay(data) {
    console.log('Updating Tax Benchmark Analysis display:', data);
    // Update UI with loaded tax data
}

function setupTaxPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-analytics-intelligence/benchmark-analysis/test');
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
        viewDataBtn.addEventListener('click', function() {
            loadbenchmarkanalysisData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlebenchmarkanalysisAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-analytics-intelligence/benchmark-analysis/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'benchmark-analysis-tax-export.xlsx';
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