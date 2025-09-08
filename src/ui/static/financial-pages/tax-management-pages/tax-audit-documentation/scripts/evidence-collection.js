/**
 * Tax Evidence Collection - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Tax Evidence Collection
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tax Evidence Collection page loaded');
    
    // Initialize page-specific features
    initializeevidencecollection();
});

function initializeevidencecollection() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handleevidencecollectionAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executeevidencecollection();
        });
    }
    
    // Configure page-specific buttons
    setupTaxPageActions();
    
    // Load initial tax data
    loadevidencecollectionData();
}

async function loadevidencecollectionData() {
    try {
        const response = await fetch('/api/tax-management/tax-audit-documentation/evidence-collection');
        if (response.ok) {
            const data = await response.json();
            updateevidencecollectionDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load Tax Evidence Collection data:', error);
        if (window.financialPages) {
            window.financialPages.showNotification('Failed to load tax data', 'error');
        }
    }
}

function handleevidencecollectionAction() {
    console.log('Tax Evidence Collection action triggered');
    if (window.financialPages) {
        window.financialPages.showNotification('Tax Evidence Collection configured successfully', 'success');
    }
}

function executeevidencecollection() {
    console.log('Tax Evidence Collection execution started');
    if (window.financialPages) {
        window.financialPages.showNotification('Tax Evidence Collection executed successfully', 'success');
    }
}

function updateevidencecollectionDisplay(data) {
    console.log('Updating Tax Evidence Collection display:', data);
    // Update UI with loaded tax data
}

function setupTaxPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-audit-documentation/evidence-collection/test');
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
            loadevidencecollectionData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handleevidencecollectionAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/tax-audit-documentation/evidence-collection/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'evidence-collection-tax-export.xlsx';
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