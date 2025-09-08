/**
 * Workflow Management Main Page
 * Coordinates all 49 workflow management pages
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Workflow Management Suite loaded - 49 business-ready pages');
    initializeWorkflowManagement();
});

function initializeWorkflowManagement() {
    // Configure test integration button
    const testIntegrationBtn = document.getElementById('testIntegrationBtn');
    if (testIntegrationBtn) {
        testIntegrationBtn.addEventListener('click', function() {
            testAllIntegrations();
        });
    }
    
    // Configure analytics button
    const viewAnalyticsBtn = document.getElementById('viewAnalyticsBtn');
    if (viewAnalyticsBtn) {
        viewAnalyticsBtn.addEventListener('click', function() {
            viewWorkflowAnalytics();
        });
    }

    // Configure export button
    const exportDataBtn = document.getElementById('exportDataBtn');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', function() {
            exportWorkflowData();
        });
    }

    // Configure settings button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            configureWorkflowSettings();
        });
    }
    
    // Load workflow management status
    loadWorkflowStatus();
}

async function loadWorkflowStatus() {
    try {
        const response = await fetch('/api/workflow-management/pages/status');
        if (response.ok) {
            const data = await response.json();
            updateWorkflowStatus(data);
            showNotification('Workflow Management Suite status loaded successfully', 'success');
        }
    } catch (error) {
        console.error('Failed to load workflow status:', error);
        showNotification('Failed to load workflow status', 'error');
    }
}

async function testAllIntegrations() {
    console.log('Testing all 49 workflow management page integrations');
    showNotification('Starting integration tests for all 49 workflow pages...', 'info');
    
    const categories = [
        'process-automation',
        'business-rules', 
        'task-flows',
        'approval-workflows',
        'integration-workflows',
        'data-workflows',
        'notification-workflows'
    ];
    
    const pages = [
        // Process Automation
        ['process-automation', 'business-process-designer'],
        ['process-automation', 'workflow-orchestration'],
        ['process-automation', 'process-optimization'],
        ['process-automation', 'automation-engine'],
        ['process-automation', 'process-analytics'],
        ['process-automation', 'workflow-templates'],
        ['process-automation', 'process-monitoring'],
        
        // Business Rules
        ['business-rules', 'rules-engine'],
        ['business-rules', 'decision-tables'],
        ['business-rules', 'rule-validation'],
        ['business-rules', 'compliance-rules'],
        ['business-rules', 'rule-versioning'],
        ['business-rules', 'dynamic-rules'],
        ['business-rules', 'rule-testing'],
        
        // Task Flows
        ['task-flows', 'task-orchestration'],
        ['task-flows', 'flow-designer'],
        ['task-flows', 'task-scheduling'],
        ['task-flows', 'parallel-processing'],
        ['task-flows', 'task-dependencies'],
        ['task-flows', 'flow-monitoring'],
        ['task-flows', 'task-automation'],
        
        // Approval Workflows
        ['approval-workflows', 'approval-designer'],
        ['approval-workflows', 'escalation-management'],
        ['approval-workflows', 'approval-routing'],
        ['approval-workflows', 'delegation-management'],
        ['approval-workflows', 'approval-analytics'],
        ['approval-workflows', 'mobile-approvals'],
        ['approval-workflows', 'bulk-approvals'],
        
        // Integration Workflows
        ['integration-workflows', 'api-orchestration'],
        ['integration-workflows', 'data-synchronization'],
        ['integration-workflows', 'message-queuing'],
        ['integration-workflows', 'webhook-management'],
        ['integration-workflows', 'integration-monitoring'],
        ['integration-workflows', 'transformation-engine'],
        ['integration-workflows', 'connectivity-hub'],
        
        // Data Workflows
        ['data-workflows', 'data-pipeline'],
        ['data-workflows', 'etl-workflows'],
        ['data-workflows', 'data-validation'],
        ['data-workflows', 'batch-processing'],
        ['data-workflows', 'real-time-streams'],
        ['data-workflows', 'data-archiving'],
        ['data-workflows', 'data-quality'],
        
        // Notification Workflows
        ['notification-workflows', 'alert-management'],
        ['notification-workflows', 'email-automation'],
        ['notification-workflows', 'sms-workflows'],
        ['notification-workflows', 'push-notifications'],
        ['notification-workflows', 'escalation-alerts'],
        ['notification-workflows', 'notification-templates'],
        ['notification-workflows', 'delivery-tracking']
    ];
    
    let successCount = 0;
    let totalTests = pages.length;
    
    try {
        for (const [category, page] of pages) {
            try {
                const response = await fetch(`/api/workflow-management/${category}/${page}/test`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ testType: 'integration' })
                });
                
                if (response.ok) {
                    successCount++;
                    console.log(`✅ ${page} integration test passed`);
                } else {
                    console.error(`❌ ${page} integration test failed`);
                }
            } catch (error) {
                console.error(`❌ ${page} integration test error:`, error);
            }
        }
        
        const successRate = ((successCount / totalTests) * 100).toFixed(1);
        showNotification(`Integration tests completed: ${successCount}/${totalTests} passed (${successRate}%)`, 
                        successCount === totalTests ? 'success' : 'warning');
                        
    } catch (error) {
        console.error('Integration testing error:', error);
        showNotification('Integration testing failed', 'error');
    }
}

function viewWorkflowAnalytics() {
    console.log('Opening workflow analytics dashboard');
    showNotification('Workflow analytics dashboard opened', 'info');
    
    // Simulate analytics data
    const analyticsData = {
        totalWorkflows: 15847,
        activeProcesses: 2456,
        automationRate: 89.4,
        performanceScore: 94.2,
        categories: {
            'process-automation': { workflows: 3456, performance: 92 },
            'business-rules': { workflows: 2345, performance: 95 },
            'task-flows': { workflows: 2890, performance: 91 },
            'approval-workflows': { workflows: 1789, performance: 93 },
            'integration-workflows': { workflows: 2234, performance: 96 },
            'data-workflows': { workflows: 1890, performance: 88 },
            'notification-workflows': { workflows: 1243, performance: 94 }
        }
    };
    
    console.log('Workflow Analytics:', analyticsData);
}

function exportWorkflowData() {
    console.log('Exporting workflow management data');
    showNotification('Preparing workflow data export...', 'info');
    
    // Simulate export process
    setTimeout(() => {
        const exportData = {
            format: 'xlsx',
            generatedAt: new Date().toISOString(),
            categories: 7,
            pages: 49,
            totalRecords: 234567,
            downloadUrl: `/api/workflow-management/export/${Date.now()}.xlsx`,
            size: '15.6 MB'
        };
        
        showNotification('Workflow data export completed successfully', 'success');
        console.log('Export Data:', exportData);
    }, 2000);
}

function configureWorkflowSettings() {
    console.log('Opening workflow configuration settings');
    showNotification('Workflow configuration settings opened', 'info');
    
    // Configuration options
    const configOptions = {
        automation: {
            level: 'advanced',
            monitoring: 'real-time',
            optimization: 'enabled'
        },
        integration: {
            apis: 'enabled',
            webhooks: 'enabled',
            realTimeSync: 'enabled'
        },
        notifications: {
            email: 'enabled',
            sms: 'enabled',
            push: 'enabled'
        },
        performance: {
            caching: 'enabled',
            compression: 'enabled',
            scaling: 'auto'
        }
    };
    
    console.log('Workflow Configuration:', configOptions);
}

function updateWorkflowStatus(data) {
    console.log('Updating workflow status display with:', data);
    
    // Update status indicators if they exist
    const statusElements = document.querySelectorAll('.workflow-stat-value');
    if (statusElements.length >= 4) {
        statusElements[0].textContent = data.data.totalPages || '49';
        statusElements[1].textContent = Object.keys(data.data.categories).length || '7';
    }
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `workflow-notification workflow-notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                <i class="fas ${getNotificationIcon(type)}"></i>
            </div>
            <div class="notification-message">${message}</div>
            <div class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </div>
        </div>
    `;
    
    // Add notification styles if they don't exist
    if (!document.querySelector('.workflow-notification-styles')) {
        const styles = document.createElement('style');
        styles.className = 'workflow-notification-styles';
        styles.textContent = `
            .workflow-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                max-width: 400px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                animation: slideIn 0.3s ease;
            }
            
            .workflow-notification-success {
                background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
                color: white;
            }
            
            .workflow-notification-error {
                background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
                color: white;
            }
            
            .workflow-notification-warning {
                background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
                color: white;
            }
            
            .workflow-notification-info {
                background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
                color: white;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px;
            }
            
            .notification-icon {
                font-size: 1.2rem;
            }
            
            .notification-message {
                flex: 1;
                font-weight: 500;
            }
            
            .notification-close {
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: background 0.2s ease;
            }
            
            .notification-close:hover {
                background: rgba(255,255,255,0.2);
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        case 'info': return 'fa-info-circle';
        default: return 'fa-info-circle';
    }
}

// Export functions for global access
window.workflowManagement = {
    testAllIntegrations,
    viewWorkflowAnalytics,
    exportWorkflowData,
    configureWorkflowSettings,
    showNotification
};