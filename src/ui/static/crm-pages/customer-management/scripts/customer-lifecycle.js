/**
 * Customer Lifecycle Management JavaScript
 * Advanced lifecycle orchestration with AI-powered predictions and automated journey management
 */

class CustomerLifecycleManager {
    constructor() {
        this.journeyStages = new Map();
        this.customerJourneys = new Map();
        this.automationRules = new Map();
        this.analytics = new Map();
        this.init();
    }

    init() {
        this.setupEventHandlers();
        this.loadLifecycleData();
        this.initializeJourneyStages();
        this.setupAutomationEngine();
        this.startAnalyticsEngine();
        console.log('Customer Lifecycle Manager initialized');
    }

    setupEventHandlers() {
        // Lifecycle-specific event handlers
        document.addEventListener('lifecycle:stage-changed', (e) => {
            this.handleStageChange(e.detail);
        });

        document.addEventListener('lifecycle:automation-triggered', (e) => {
            this.handleAutomationTrigger(e.detail);
        });

        // Journey stage interactions
        document.addEventListener('click', (e) => {
            if (e.target.matches('.journey-stage')) {
                this.selectJourneyStage(e.target);
            }
            
            if (e.target.matches('.configure-stage-btn')) {
                this.configureStage(e.target.dataset.stage);
            }
            
            if (e.target.matches('.automation-setup-btn')) {
                this.setupStageAutomation(e.target.dataset.stage);
            }
        });

        // Time period selector
        document.addEventListener('change', (e) => {
            if (e.target.matches('.time-period-selector')) {
                this.updateAnalyticsPeriod(e.target.value);
            }
        });
    }

    initializeJourneyStages() {
        // Initialize customer journey stages with business logic
        const stages = [
            {
                id: 'awareness',
                name: 'Awareness',
                description: 'Customer becomes aware of brand/product',
                icon: 'fas fa-lightbulb',
                order: 1,
                triggers: ['website_visit', 'content_engagement', 'social_interaction'],
                actions: ['content_marketing', 'seo_optimization', 'social_media'],
                duration: { min: 1, avg: 12, max: 30 }, // days
                conversionRate: 23.4,
                automationEnabled: true
            },
            {
                id: 'consideration',
                name: 'Consideration',
                description: 'Customer evaluates product/service options',
                icon: 'fas fa-search',
                order: 2,
                triggers: ['demo_request', 'pricing_page_visit', 'competitor_research'],
                actions: ['lead_nurturing', 'product_demos', 'case_studies'],
                duration: { min: 2, avg: 8, max: 21 },
                conversionRate: 45.7,
                automationEnabled: true
            },
            {
                id: 'decision',
                name: 'Decision',
                description: 'Customer makes purchase decision',
                icon: 'fas fa-handshake',
                order: 3,
                triggers: ['proposal_request', 'sales_meeting', 'trial_signup'],
                actions: ['sales_calls', 'proposal_review', 'contract_negotiation'],
                duration: { min: 1, avg: 5, max: 14 },
                conversionRate: 67.4,
                automationEnabled: true
            },
            {
                id: 'onboarding',
                name: 'Onboarding',
                description: 'Customer implementation and initial success',
                icon: 'fas fa-rocket',
                order: 4,
                triggers: ['contract_signed', 'payment_received', 'account_created'],
                actions: ['welcome_series', 'training_sessions', 'success_milestones'],
                duration: { min: 7, avg: 30, max: 90 },
                successRate: 91.2,
                automationEnabled: true
            },
            {
                id: 'growth',
                name: 'Growth',
                description: 'Customer expansion and value realization',
                icon: 'fas fa-chart-line',
                order: 5,
                triggers: ['feature_adoption', 'usage_milestone', 'success_metric'],
                actions: ['upsell_campaigns', 'feature_adoption', 'success_reviews'],
                duration: { min: 30, avg: 365, max: null }, // ongoing
                expansionRate: 34.8,
                automationEnabled: true
            },
            {
                id: 'advocacy',
                name: 'Advocacy',
                description: 'Customer becomes brand advocate and referrer',
                icon: 'fas fa-megaphone',
                order: 6,
                triggers: ['high_satisfaction', 'referral_made', 'testimonial_provided'],
                actions: ['referral_programs', 'case_study_creation', 'community_engagement'],
                duration: { min: 90, avg: null, max: null }, // ongoing
                advocacyRate: 18.5,
                automationEnabled: true
            }
        ];

        stages.forEach(stage => {
            this.journeyStages.set(stage.id, stage);
        });
    }

    setupAutomationEngine() {
        // Initialize automation rules for lifecycle management
        this.automationRules = new Map([
            ['awareness_to_consideration', {
                trigger: 'content_engagement_threshold',
                condition: { engagementScore: { min: 50 }, timeInStage: { min: 3 } },
                action: 'move_to_consideration',
                enabled: true
            }],
            ['consideration_to_decision', {
                trigger: 'demo_completed',
                condition: { demoScore: { min: 7 }, followUpResponseRate: { min: 0.8 } },
                action: 'move_to_decision',
                enabled: true
            }],
            ['decision_to_purchase', {
                trigger: 'proposal_accepted',
                condition: { proposalScore: { min: 8 }, negotiationComplete: true },
                action: 'move_to_onboarding',
                enabled: true
            }],
            ['onboarding_completion', {
                trigger: 'success_milestone_achieved',
                condition: { trainingComplete: true, firstValueRealized: true },
                action: 'move_to_growth',
                enabled: true
            }],
            ['growth_expansion', {
                trigger: 'expansion_opportunity',
                condition: { healthScore: { min: 80 }, usageGrowth: { min: 0.2 } },
                action: 'trigger_upsell_campaign',
                enabled: true
            }],
            ['advocacy_qualification', {
                trigger: 'high_satisfaction_sustained',
                condition: { npsScore: { min: 9 }, tenureMonths: { min: 12 } },
                action: 'move_to_advocacy',
                enabled: true
            }]
        ]);
    }

    async loadLifecycleData() {
        try {
            // Load customer lifecycle data
            const lifecycleData = await this.fetchLifecycleAnalytics();
            this.updateDashboardMetrics(lifecycleData);
            this.renderJourneyVisualization();
            this.updateStageMetrics();
        } catch (error) {
            console.error('Error loading lifecycle data:', error);
        }
    }

    async fetchLifecycleAnalytics() {
        // Simulate API call to fetch lifecycle analytics
        return {
            activeJourneys: 1247,
            automationRate: 87.5,
            avgLifecycleValue: 156780,
            progressionRate: 78.9,
            stageDistribution: {
                awareness: 342,
                consideration: 198,
                decision: 89,
                onboarding: 67,
                growth: 1247,
                advocacy: 234
            },
            conversionRates: {
                'awareness_to_consideration': 23.4,
                'consideration_to_decision': 45.7,
                'decision_to_purchase': 67.4,
                'purchase_to_advocacy': 34.8
            },
            avgStageDurations: {
                awareness: 12,
                consideration: 8,
                decision: 5,
                onboarding: 30,
                growth: 365
            }
        };
    }

    updateDashboardMetrics(data) {
        // Update main dashboard metrics
        const metrics = {
            'active-journeys': data.activeJourneys.toLocaleString(),
            'automation-rate': data.automationRate + '%',
            'avg-lifecycle-value': '$' + data.avgLifecycleValue.toLocaleString(),
            'progression-rate': data.progressionRate + '%'
        };

        Object.entries(metrics).forEach(([key, value]) => {
            const element = document.querySelector(`[data-metric="${key}"]`);
            if (element) {
                element.textContent = value;
            }
        });
    }

    renderJourneyVisualization() {
        // Update journey stage visualizations
        this.journeyStages.forEach((stage, stageId) => {
            const stageElement = document.querySelector(`[data-stage="${stageId}"]`);
            if (stageElement) {
                this.updateStageDisplay(stageElement, stage);
            }
        });
    }

    updateStageDisplay(element, stage) {
        // Update individual stage display
        const countElement = element.querySelector('.stage-count');
        const metricsElements = element.querySelectorAll('.metric-value');
        
        if (countElement) {
            // Simulate stage counts based on stage order
            const baseCounts = { awareness: 342, consideration: 198, decision: 89, onboarding: 67, growth: 1247, advocacy: 234 };
            countElement.textContent = baseCounts[stage.id] || 0;
        }

        // Update stage-specific metrics
        metricsElements.forEach((metricElement, index) => {
            switch (index) {
                case 0: // Conversion/Success Rate
                    const rate = stage.conversionRate || stage.successRate || stage.expansionRate || stage.advocacyRate || 0;
                    metricElement.textContent = rate + '%';
                    break;
                case 1: // Duration or Health Score
                    if (stage.id === 'growth') {
                        metricElement.textContent = '87/100'; // Health score
                    } else {
                        metricElement.textContent = (stage.duration.avg || 0) + ' days';
                    }
                    break;
            }
        });
    }

    updateStageMetrics() {
        // Update performance metrics for each stage transition
        const performanceItems = document.querySelectorAll('.performance-item');
        const transitions = [
            { name: 'Awareness → Consideration', rate: 23.4 },
            { name: 'Consideration → Decision', rate: 45.7 },
            { name: 'Decision → Purchase', rate: 67.4 },
            { name: 'Purchase → Advocacy', rate: 34.8 }
        ];

        performanceItems.forEach((item, index) => {
            if (transitions[index]) {
                const stageElement = item.querySelector('.performance-stage');
                const metricElement = item.querySelector('.performance-metric');
                const indicatorElement = item.querySelector('.performance-indicator');

                if (stageElement) stageElement.textContent = transitions[index].name;
                if (metricElement) metricElement.textContent = transitions[index].rate + '% conversion';
                
                // Update indicator based on performance
                if (indicatorElement) {
                    const rate = transitions[index].rate;
                    indicatorElement.className = 'performance-indicator ' + 
                        (rate >= 50 ? 'positive' : rate >= 30 ? 'neutral' : 'negative');
                }
            }
        });
    }

    handleStageChange(data) {
        // Handle customer lifecycle stage changes
        console.log('Customer stage changed:', data);
        
        const { customerId, fromStage, toStage, timestamp } = data;
        
        // Update customer journey record
        this.updateCustomerJourney(customerId, fromStage, toStage, timestamp);
        
        // Trigger stage-specific automation
        this.triggerStageAutomation(customerId, toStage);
        
        // Update analytics
        this.updateStageAnalytics(fromStage, toStage);
        
        // Refresh dashboard
        this.loadLifecycleData();
    }

    updateCustomerJourney(customerId, fromStage, toStage, timestamp) {
        // Update customer journey tracking
        let journey = this.customerJourneys.get(customerId) || {
            customerId,
            stages: [],
            currentStage: null,
            startDate: timestamp,
            lastUpdate: timestamp
        };

        journey.stages.push({
            stage: toStage,
            entryDate: timestamp,
            previousStage: fromStage
        });
        
        journey.currentStage = toStage;
        journey.lastUpdate = timestamp;
        
        this.customerJourneys.set(customerId, journey);
    }

    triggerStageAutomation(customerId, stage) {
        // Trigger automated actions for the new stage
        const stageConfig = this.journeyStages.get(stage);
        if (!stageConfig || !stageConfig.automationEnabled) return;

        // Execute stage-specific automation actions
        stageConfig.actions.forEach(action => {
            this.executeAutomationAction(customerId, stage, action);
        });
    }

    executeAutomationAction(customerId, stage, action) {
        // Execute specific automation action
        console.log(`Executing automation: ${action} for customer ${customerId} in stage ${stage}`);
        
        const actionMap = {
            'content_marketing': () => this.triggerContentMarketing(customerId),
            'lead_nurturing': () => this.triggerLeadNurturing(customerId),
            'product_demos': () => this.scheduleProductDemo(customerId),
            'sales_calls': () => this.scheduleSalesCall(customerId),
            'welcome_series': () => this.startWelcomeSeries(customerId),
            'training_sessions': () => this.scheduleTraining(customerId),
            'upsell_campaigns': () => this.triggerUpsellCampaign(customerId),
            'referral_programs': () => this.inviteToReferralProgram(customerId)
        };

        const actionFunction = actionMap[action];
        if (actionFunction) {
            actionFunction();
        }
    }

    // Automation action implementations
    triggerContentMarketing(customerId) {
        console.log(`Triggering content marketing for customer ${customerId}`);
        // Implementation for content marketing automation
    }

    triggerLeadNurturing(customerId) {
        console.log(`Starting lead nurturing sequence for customer ${customerId}`);
        // Implementation for lead nurturing automation
    }

    scheduleProductDemo(customerId) {
        console.log(`Scheduling product demo for customer ${customerId}`);
        // Implementation for demo scheduling
    }

    scheduleSalesCall(customerId) {
        console.log(`Scheduling sales call for customer ${customerId}`);
        // Implementation for sales call scheduling
    }

    startWelcomeSeries(customerId) {
        console.log(`Starting welcome email series for customer ${customerId}`);
        // Implementation for welcome series automation
    }

    scheduleTraining(customerId) {
        console.log(`Scheduling training sessions for customer ${customerId}`);
        // Implementation for training scheduling
    }

    triggerUpsellCampaign(customerId) {
        console.log(`Triggering upsell campaign for customer ${customerId}`);
        // Implementation for upsell automation
    }

    inviteToReferralProgram(customerId) {
        console.log(`Inviting customer ${customerId} to referral program`);
        // Implementation for referral program invitation
    }

    updateStageAnalytics(fromStage, toStage) {
        // Update analytics for stage transitions
        const transitionKey = `${fromStage}_to_${toStage}`;
        let analytics = this.analytics.get(transitionKey) || {
            count: 0,
            avgDuration: 0,
            conversionRate: 0
        };

        analytics.count += 1;
        this.analytics.set(transitionKey, analytics);
    }

    selectJourneyStage(stageElement) {
        // Handle journey stage selection
        document.querySelectorAll('.journey-stage').forEach(stage => {
            stage.classList.remove('selected');
        });
        
        stageElement.classList.add('selected');
        
        const stageId = stageElement.dataset.stage;
        this.showStageDetails(stageId);
    }

    showStageDetails(stageId) {
        // Show detailed stage information
        const stage = this.journeyStages.get(stageId);
        if (!stage) return;

        console.log('Showing details for stage:', stage);
        // Implementation to show stage details in modal or side panel
    }

    configureStage(stageId) {
        // Open stage configuration interface
        console.log('Configuring stage:', stageId);
        // Implementation for stage configuration modal
    }

    setupStageAutomation(stageId) {
        // Open automation setup for stage
        console.log('Setting up automation for stage:', stageId);
        // Implementation for automation configuration
    }

    updateAnalyticsPeriod(period) {
        // Update analytics for selected time period
        console.log('Updating analytics for period:', period);
        this.loadLifecycleData();
    }

    startAnalyticsEngine() {
        // Start real-time analytics processing
        setInterval(() => {
            this.processAnalytics();
        }, 30000); // Update every 30 seconds
    }

    processAnalytics() {
        // Process lifecycle analytics in real-time
        this.calculateConversionRates();
        this.updateProgressionMetrics();
        this.detectOptimizationOpportunities();
    }

    calculateConversionRates() {
        // Calculate stage conversion rates
        this.journeyStages.forEach((stage, stageId) => {
            // Calculate conversion rates based on customer journey data
            // Implementation for conversion rate calculations
        });
    }

    updateProgressionMetrics() {
        // Update stage progression metrics
        // Implementation for progression tracking
    }

    detectOptimizationOpportunities() {
        // Detect opportunities for lifecycle optimization
        // Implementation for AI-powered optimization detection
    }

    async exportLifecycleAnalytics(format = 'csv') {
        try {
            const analytics = await this.generateLifecycleReport();
            
            if (format === 'csv') {
                const csvData = this.convertAnalyticsToCSV(analytics);
                this.downloadFile(csvData, 'lifecycle-analytics.csv', 'text/csv');
            } else if (format === 'json') {
                const jsonData = JSON.stringify(analytics, null, 2);
                this.downloadFile(jsonData, 'lifecycle-analytics.json', 'application/json');
            }
            
        } catch (error) {
            console.error('Error exporting lifecycle analytics:', error);
        }
    }

    async generateLifecycleReport() {
        // Generate comprehensive lifecycle analytics report
        return {
            summary: {
                totalCustomers: this.customerJourneys.size,
                activeJourneys: 1247,
                avgLifecycleValue: 156780,
                completionRate: 78.9
            },
            stageMetrics: Array.from(this.journeyStages.values()),
            conversionRates: Array.from(this.analytics.entries()),
            trends: this.calculateTrends(),
            recommendations: this.generateRecommendations()
        };
    }

    calculateTrends() {
        // Calculate lifecycle trends
        return {
            conversionTrends: 'Improving',
            stageProgressionTrends: 'Stable',
            automationEfficiency: 'Increasing'
        };
    }

    generateRecommendations() {
        // Generate AI-powered recommendations
        return [
            'Optimize consideration stage with personalized content',
            'Implement predictive churn prevention in growth stage',
            'Enhance onboarding automation for faster time-to-value'
        ];
    }

    convertAnalyticsToCSV(analytics) {
        // Convert analytics to CSV format
        const headers = ['Metric', 'Value', 'Trend', 'Recommendation'];
        const rows = [
            ['Total Customers', analytics.summary.totalCustomers, '+12.5%', 'Continue current acquisition strategies'],
            ['Active Journeys', analytics.summary.activeJourneys, '+18.3%', 'Scale automation infrastructure'],
            ['Avg Lifecycle Value', '$' + analytics.summary.avgLifecycleValue, '+22.7%', 'Focus on high-value customer segments'],
            ['Completion Rate', analytics.summary.completionRate + '%', '+3.4%', 'Optimize low-performing stages']
        ];
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
}

// Add lifecycle-specific styles
const lifecycleStyles = `
<style>
.lifecycle-journey-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 2rem;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border-radius: 12px;
    margin-bottom: 2rem;
    overflow-x: auto;
}

.journey-stage {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    min-width: 200px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
}

.journey-stage:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.journey-stage.selected {
    border: 2px solid #3b82f6;
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.stage-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1rem;
}

.stage-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
}

.stage-header h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.25rem 0;
    text-align: center;
}

.stage-count {
    background: #f3f4f6;
    color: #374151;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
    font-weight: 500;
}

.stage-metrics {
    margin-bottom: 1rem;
}

.metric {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
}

.metric-label {
    color: #6b7280;
}

.metric-value {
    font-weight: 500;
    color: #1f2937;
}

.stage-actions {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.action-item {
    background: #f9fafb;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    font-size: 0.75rem;
    color: #374151;
    border-left: 3px solid #3b82f6;
}

.journey-arrow {
    color: #6b7280;
    font-size: 1.5rem;
    flex-shrink: 0;
}

.analytics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
}

.analytics-card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.analytics-card h4 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1.5rem;
}

.completion-stats {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.completion-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 8px;
}

.completion-label {
    font-size: 0.875rem;
    color: #6b7280;
}

.completion-value {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
}

.completion-trend {
    font-size: 0.75rem;
    font-weight: 500;
}

.completion-trend.positive {
    color: #059669;
}

.completion-trend.negative {
    color: #dc2626;
}

.performance-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.performance-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 8px;
}

.performance-stage {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1f2937;
}

.performance-metric {
    font-size: 0.875rem;
    color: #6b7280;
}

.performance-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
}

.performance-indicator.positive {
    background: #10b981;
}

.performance-indicator.neutral {
    background: #f59e0b;
}

.performance-indicator.negative {
    background: #ef4444;
}

.time-period-selector {
    padding: 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: white;
    color: #374151;
    font-size: 0.875rem;
}

@media (max-width: 768px) {
    .lifecycle-journey-container {
        flex-direction: column;
        align-items: stretch;
    }
    
    .journey-arrow {
        transform: rotate(90deg);
        align-self: center;
    }
    
    .analytics-grid {
        grid-template-columns: 1fr;
    }
    
    .completion-item,
    .performance-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
}
</style>
`;

// Inject lifecycle styles
document.head.insertAdjacentHTML('beforeend', lifecycleStyles);

// Initialize Customer Lifecycle Manager
document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.customerLifecycleManager === 'undefined') {
        window.customerLifecycleManager = new CustomerLifecycleManager();
    }
});