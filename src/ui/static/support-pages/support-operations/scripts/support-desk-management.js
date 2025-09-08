/**
 * Support Desk Management JavaScript Module
 * Handles agent management, queue optimization, and performance tracking
 */

class SupportDeskManager {
    constructor() {
        this.agents = new Map();
        this.queues = new Map();
        this.metrics = new Map();
        this.initialized = false;
        this.init();
    }

    async init() {
        try {
            await this.loadConfiguration();
            await this.loadAgents();
            await this.loadQueues();
            this.setupEventHandlers();
            this.initializeMetrics();
            this.setupRealTimeUpdates();
            this.initialized = true;
            console.log('Support Desk Manager initialized successfully');
        } catch (error) {
            console.error('Support Desk Manager initialization failed:', error);
        }
    }

    async loadConfiguration() {
        try {
            const response = await window.SupportPageManager.apiRequest('/api/v1/support/support-operations/config');
            this.config = response || {
                maxAgentsPerQueue: 10,
                maxQueueSize: 100,
                defaultSkillWeighting: 1.0,
                performanceUpdateInterval: 30000
            };
        } catch (error) {
            console.warn('Using default configuration');
            this.config = {
                maxAgentsPerQueue: 10,
                maxQueueSize: 100,
                defaultSkillWeighting: 1.0,
                performanceUpdateInterval: 30000
            };
        }
    }

    async loadAgents() {
        try {
            const response = await window.SupportPageManager.apiRequest('/api/v1/support/support-operations/agents');
            if (response && response.agents) {
                response.agents.forEach(agent => {
                    this.agents.set(agent.id, {
                        ...agent,
                        status: agent.status || 'available',
                        currentWorkload: agent.currentWorkload || 0,
                        skills: agent.skills || [],
                        performance: agent.performance || {}
                    });
                });
            }
        } catch (error) {
            console.error('Failed to load agents:', error);
            // Create sample data for demonstration
            this.createSampleAgents();
        }
    }

    async loadQueues() {
        try {
            const response = await window.SupportPageManager.apiRequest('/api/v1/support/support-operations/queues');
            if (response && response.queues) {
                response.queues.forEach(queue => {
                    this.queues.set(queue.id, {
                        ...queue,
                        currentSize: queue.currentSize || 0,
                        maxSize: queue.maxSize || this.config.maxQueueSize,
                        assignedAgents: queue.assignedAgents || [],
                        priority: queue.priority || 'medium'
                    });
                });
            }
        } catch (error) {
            console.error('Failed to load queues:', error);
            // Create sample data for demonstration
            this.createSampleQueues();
        }
    }

    setupEventHandlers() {
        // Add agent button
        document.getElementById('testIntegrationBtn')?.addEventListener('click', () => {
            this.testIntegration();
        });

        document.getElementById('viewDataBtn')?.addEventListener('click', () => {
            this.viewData();
        });

        document.getElementById('configureBtn')?.addEventListener('click', () => {
            this.configure();
        });

        document.getElementById('exportBtn')?.addEventListener('click', () => {
            this.exportData();
        });

        // Action buttons
        document.querySelectorAll('[data-action="create"][data-target="agent"]').forEach(btn => {
            btn.addEventListener('click', () => this.createAgent());
        });

        document.querySelectorAll('[data-action="optimize"][data-target="queue"]').forEach(btn => {
            btn.addEventListener('click', () => this.optimizeQueues());
        });

        document.querySelectorAll('[data-action="view"][data-target="analytics"]').forEach(btn => {
            btn.addEventListener('click', () => this.viewAnalytics());
        });

        document.querySelectorAll('[data-action="export"][data-target="report"]').forEach(btn => {
            btn.addEventListener('click', () => this.exportReport());
        });
    }

    initializeMetrics() {
        this.metrics.set('totalAgents', this.agents.size);
        this.metrics.set('activeAgents', Array.from(this.agents.values()).filter(a => a.status === 'available').length);
        this.metrics.set('totalQueues', this.queues.size);
        this.metrics.set('totalTickets', Array.from(this.queues.values()).reduce((sum, q) => sum + q.currentSize, 0));

        // Update metrics display
        this.updateMetricsDisplay();
    }

    setupRealTimeUpdates() {
        // Update metrics every 30 seconds
        setInterval(() => {
            this.updateMetrics();
        }, this.config.performanceUpdateInterval);

        // Listen for real-time updates
        if (window.SupportPageManager && window.SupportPageManager.websocket) {
            window.SupportPageManager.websocket.addEventListener('message', (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'support_desk_update') {
                    this.handleRealTimeUpdate(data);
                }
            });
        }
    }

    async testIntegration() {
        try {
            window.SupportPageManager.showNotification('Testing integration...', 'info');
            
            // Test API endpoints
            const tests = [
                { name: 'Agent API', endpoint: '/api/v1/support/support-operations/agents' },
                { name: 'Queue API', endpoint: '/api/v1/support/support-operations/queues' },
                { name: 'Metrics API', endpoint: '/api/v1/support/support-operations/metrics' },
                { name: 'Analytics API', endpoint: '/api/v1/support/support-operations/analytics' }
            ];

            let passed = 0;
            for (const test of tests) {
                try {
                    await window.SupportPageManager.apiRequest(test.endpoint);
                    passed++;
                    console.log(`✅ ${test.name} test passed`);
                } catch (error) {
                    console.error(`❌ ${test.name} test failed:`, error);
                }
            }

            const successRate = (passed / tests.length) * 100;
            const message = `Integration test completed: ${passed}/${tests.length} passed (${successRate.toFixed(1)}%)`;
            
            window.SupportPageManager.showNotification(message, 
                successRate === 100 ? 'success' : 'warning');
                
        } catch (error) {
            console.error('Integration test failed:', error);
            window.SupportPageManager.showNotification('Integration test failed', 'error');
        }
    }

    // Sample data creation methods
    createSampleAgents() {
        const sampleAgents = [
            {
                id: 'agent-1',
                name: 'Sarah Johnson',
                email: 'sarah.johnson@titangrove.com',
                skills: ['technical', 'escalation'],
                department: 'L2',
                status: 'available',
                currentWorkload: 0.7,
                performance: { ticketsResolved: 45, avgResolutionTime: 18, customerSatisfaction: 8.5 }
            },
            {
                id: 'agent-2',
                name: 'Mike Chen',
                email: 'mike.chen@titangrove.com',
                skills: ['billing', 'general'],
                department: 'L1',
                status: 'busy',
                currentWorkload: 0.9,
                performance: { ticketsResolved: 38, avgResolutionTime: 12, customerSatisfaction: 8.2 }
            },
            {
                id: 'agent-3',
                name: 'Emily Rodriguez',
                email: 'emily.rodriguez@titangrove.com',
                skills: ['technical', 'general'],
                department: 'L1',
                status: 'available',
                currentWorkload: 0.6,
                performance: { ticketsResolved: 52, avgResolutionTime: 15, customerSatisfaction: 8.8 }
            }
        ];

        sampleAgents.forEach(agent => {
            this.agents.set(agent.id, agent);
        });
    }

    createSampleQueues() {
        const sampleQueues = [
            {
                id: 'queue-1',
                name: 'Technical Support',
                currentSize: 12,
                maxSize: 50,
                assignedAgents: ['agent-1', 'agent-3'],
                priority: 'high',
                avgWaitTime: 15
            },
            {
                id: 'queue-2',
                name: 'Billing Support',
                currentSize: 8,
                maxSize: 30,
                assignedAgents: ['agent-2'],
                priority: 'medium',
                avgWaitTime: 10
            },
            {
                id: 'queue-3',
                name: 'General Support',
                currentSize: 5,
                maxSize: 25,
                assignedAgents: ['agent-2', 'agent-3'],
                priority: 'low',
                avgWaitTime: 5
            }
        ];

        sampleQueues.forEach(queue => {
            this.queues.set(queue.id, queue);
        });
    }

    updateMetrics() {
        this.metrics.set('totalAgents', this.agents.size);
        this.metrics.set('activeAgents', Array.from(this.agents.values()).filter(a => a.status === 'available').length);
        this.metrics.set('totalQueues', this.queues.size);
        this.metrics.set('totalTickets', Array.from(this.queues.values()).reduce((sum, q) => sum + q.currentSize, 0));
        
        this.updateMetricsDisplay();
    }

    updateMetricsDisplay() {
        // Update any displayed metrics on the page
        console.log('Metrics updated:', Object.fromEntries(this.metrics));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.supportDeskManager = new SupportDeskManager();
});