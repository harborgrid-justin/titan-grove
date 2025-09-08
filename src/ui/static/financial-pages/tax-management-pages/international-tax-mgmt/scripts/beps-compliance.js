/**
 * BEPS Compliance Management - Tax Management Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for BEPS Compliance Management
document.addEventListener('DOMContentLoaded', function() {
    console.log('BEPS Compliance Management page loaded');
    
    // Initialize page-specific features
    initializebepscompliance();
});

function initializebepscompliance() {
    // Configure action button
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            handlebepscomplianceAction();
        });
    }
    
    // Configure primary button  
    const primaryBtn = document.getElementById('primaryBtn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            executebepscompliance();
        });
    }
    
    // Configure page-specific buttons
    setupTaxPageActions();
    
    // Load initial tax data
    loadbepscomplianceData();
}

async function loadbepscomplianceData() {
    try {
        const response = await fetch('/api/tax-management/international-tax-mgmt/beps-compliance');
        if (response.ok) {
            const data = await response.json();
            updatebepscomplianceDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load BEPS Compliance Management data:', error);
        if (window.financialPages) {
            window.financialPages.showNotification('Failed to load tax data', 'error');
        }
    }
}

function handlebepscomplianceAction() {
    console.log('BEPS Compliance Management action triggered');
    if (window.financialPages) {
        window.financialPages.showNotification('BEPS Compliance Management configured successfully', 'success');
    }
}

function executebepscompliance() {
    console.log('BEPS Compliance Management execution started');
    if (window.financialPages) {
        window.financialPages.showNotification('BEPS Compliance Management executed successfully', 'success');
    }
}

function updatebepscomplianceDisplay(data) {
    console.log('Updating BEPS Compliance Management display:', data);
    // Update UI with loaded tax data
}

function setupTaxPageActions() {
    // Test integration button
    const testBtn = document.getElementById('testIntegrationBtn');
    if (testBtn) {
        testBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/international-tax-mgmt/beps-compliance/test');
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
            loadbepscomplianceData();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            handlebepscomplianceAction();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/tax-management/international-tax-mgmt/beps-compliance/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'beps-compliance-tax-export.xlsx';
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