/**
 * Oracle EBS Gap Analysis Dashboard JavaScript
 * 
 * Handles interactive functionality for the gap analysis dashboard
 */

class GapAnalysisDashboard {
    constructor() {
        this.currentAnalysisId = null;
        this.mockData = this.generateMockData();
        this.init();
    }

    init() {
        // Initialize the dashboard with mock data
        this.updateDashboard(this.mockData);
        
        // Set up event listeners
        this.setupEventListeners();
        
        console.log('🚀 Oracle EBS Gap Analysis Dashboard initialized');
    }

    setupEventListeners() {
        // Analysis type selector
        const analysisTypeSelect = document.getElementById('analysis-type');
        if (analysisTypeSelect) {
            analysisTypeSelect.addEventListener('change', this.onAnalysisTypeChange.bind(this));
        }
    }

    generateMockData() {
        return {
            analysisId: `gap_analysis_${Date.now()}`,
            timestamp: new Date(),
            analysisType: 'comprehensive',
            overallScore: {
                titanGrove: 8.4,
                oracleEbs: 6.2,
                gapPercentage: 35.5
            },
            domainAnalysis: [
                {
                    domain: 'financial',
                    category: 'Financial Management',
                    gapScore: 15.2,
                    advantages: [
                        'Superior user interface and usability',
                        'Real-time analytics capabilities',
                        'Modern API-first architecture',
                        'Mobile-responsive design'
                    ]
                },
                {
                    domain: 'scm',
                    category: 'Supply Chain Management',
                    gapScore: 22.8,
                    advantages: [
                        'Mobile-first design architecture',
                        'Superior user experience',
                        'Real-time collaboration features',
                        'Modern responsive interface'
                    ]
                },
                {
                    domain: 'manufacturing',
                    category: 'Manufacturing Excellence',
                    gapScore: 12.5,
                    advantages: [
                        'Superior configure-to-order experience',
                        'Modern MES interface',
                        'IoT and Industry 4.0 capabilities',
                        'Real-time manufacturing analytics'
                    ]
                },
                {
                    domain: 'analytics',
                    category: 'Business Intelligence & Analytics',
                    gapScore: 25.4,
                    advantages: [
                        'Modern visualization capabilities',
                        'Real-time data processing',
                        'Mobile-first analytics',
                        'AI-powered insights'
                    ]
                },
                {
                    domain: 'procurement',
                    category: 'Procurement Management',
                    gapScore: 16.2,
                    advantages: [
                        'Modern contract authoring',
                        'Better supplier collaboration',
                        'Advanced analytics and reporting'
                    ]
                },
                {
                    domain: 'hr',
                    category: 'Human Capital Management',
                    gapScore: 8.5,
                    criticalGaps: [
                        'Complex payroll configuration',
                        'Limited self-service options'
                    ]
                }
            ],
            usabilityGaps: [
                {
                    category: 'Mobile Accessibility',
                    severity: 'critical',
                    description: 'Oracle EBS has limited mobile support, Titan Grove is mobile-first',
                    affectedFeatures: ['Supply Chain', 'Manufacturing', 'Field Service'],
                    userImpact: 'Enables mobile workforce and real-time decision making'
                },
                {
                    category: 'User Interface Design',
                    severity: 'high',
                    description: 'Oracle EBS uses legacy Forms-based interface, while Titan Grove provides modern responsive web interface',
                    affectedFeatures: ['All user-facing modules'],
                    userImpact: 'Significantly improved user experience and productivity'
                },
                {
                    category: 'Navigation and Workflow',
                    severity: 'medium',
                    description: 'Complex navigation in Oracle EBS vs intuitive workflow in Titan Grove',
                    affectedFeatures: ['Financial Management', 'HR', 'Procurement'],
                    userImpact: 'Reduced training time and improved user adoption'
                }
            ],
            functionalityGaps: [
                {
                    category: 'Regulatory Compliance',
                    severity: 'high',
                    description: 'Need to match Oracle EBS compliance features for enterprise customers',
                    missingCapabilities: ['Advanced audit trails', 'Regulatory reporting'],
                    businessImpact: 'Critical for enterprise and government customers'
                },
                {
                    category: 'Multi-Language Support',
                    severity: 'medium',
                    description: 'Oracle EBS has extensive localization vs limited language support in Titan Grove',
                    missingCapabilities: ['Multi-language UI', 'Localized reporting', 'Regional compliance'],
                    businessImpact: 'Required for global enterprise customers'
                },
                {
                    category: 'Integration Capabilities',
                    severity: 'medium',
                    description: 'Titan Grove provides modern API-first architecture vs Oracle EBS legacy integration',
                    businessImpact: 'Better integration with modern systems and cloud services'
                }
            ],
            recommendations: [
                {
                    priority: 'high',
                    category: 'integration',
                    title: 'Develop Oracle EBS Migration Tools',
                    description: 'Create comprehensive migration tools to help customers transition from Oracle EBS',
                    implementationApproach: 'Build data migration utilities and compatibility layers',
                    estimatedEffort: '6-8 months',
                    expectedImpact: 'Accelerated customer adoption and reduced migration risk',
                    businessValue: 9,
                    technicalComplexity: 7
                },
                {
                    priority: 'high',
                    category: 'functionality',
                    title: 'Enhance Enterprise Compliance Features',
                    description: 'Implement advanced audit trails and regulatory reporting to match Oracle EBS',
                    implementationApproach: 'Build comprehensive compliance framework',
                    estimatedEffort: '4-6 months',
                    expectedImpact: 'Enable enterprise and government customer adoption',
                    businessValue: 8,
                    technicalComplexity: 8
                },
                {
                    priority: 'high',
                    category: 'usability',
                    title: 'Address Mobile Accessibility Gap',
                    description: 'Oracle EBS has limited mobile support, Titan Grove is mobile-first',
                    implementationApproach: 'Expand mobile capabilities across all modules',
                    estimatedEffort: '3-6 months',
                    expectedImpact: 'Enables mobile workforce and real-time decision making',
                    businessValue: 8,
                    technicalComplexity: 6
                }
            ],
            summary: {
                totalGapsIdentified: 12,
                criticalGaps: 2,
                usabilityGaps: 5,
                functionalityGaps: 7,
                recommendationsCount: 8,
                overallReadiness: 88,
                competitivePosition: 'superior'
            }
        };
    }

    updateDashboard(data) {
        // Update header scores
        this.updateElement('titan-score', data.overallScore.titanGrove.toFixed(1));
        this.updateElement('oracle-score', data.overallScore.oracleEbs.toFixed(1));
        this.updateElement('gap-percentage', `+${data.overallScore.gapPercentage.toFixed(1)}%`);

        // Update summary metrics
        this.updateElement('total-gaps', data.summary.totalGapsIdentified);
        this.updateElement('critical-gaps', data.summary.criticalGaps);
        this.updateElement('readiness-score', `${data.summary.overallReadiness}%`);
        this.updateElement('competitive-position', data.summary.competitivePosition.toUpperCase());

        console.log('📊 Dashboard updated with analysis results:', {
            analysisId: data.analysisId,
            overallScore: data.overallScore,
            competitivePosition: data.summary.competitivePosition
        });
    }

    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }

    onAnalysisTypeChange(event) {
        const selectedType = event.target.value;
        console.log('🔄 Analysis type changed to:', selectedType);
        
        // Update mock data based on selected type
        const updatedData = { ...this.mockData };
        updatedData.analysisType = selectedType;
        
        // Adjust data based on analysis type
        if (selectedType === 'usability') {
            updatedData.functionalityGaps = [];
            updatedData.summary.functionalityGaps = 0;
            updatedData.summary.totalGapsIdentified = updatedData.usabilityGaps.length;
        } else if (selectedType === 'functionality') {
            updatedData.usabilityGaps = [];
            updatedData.summary.usabilityGaps = 0;
            updatedData.summary.totalGapsIdentified = updatedData.functionalityGaps.length;
        }
        
        this.updateDashboard(updatedData);
    }

    async runGapAnalysis() {
        console.log('🚀 Starting new gap analysis...');
        
        // Update UI to show loading state
        const btnText = document.getElementById('analysis-btn-text');
        const spinner = document.getElementById('analysis-spinner');
        const analysisType = document.getElementById('analysis-type').value;
        
        if (btnText) btnText.textContent = 'Analyzing...';
        if (spinner) spinner.style.display = 'inline-block';

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Generate new mock analysis data
            const newAnalysisData = this.generateMockData();
            newAnalysisData.analysisType = analysisType;
            newAnalysisData.timestamp = new Date();
            
            // Add some randomness to scores for demonstration
            const variation = (Math.random() - 0.5) * 0.4;
            newAnalysisData.overallScore.titanGrove = Math.max(7.0, Math.min(9.5, 8.4 + variation));
            newAnalysisData.overallScore.oracleEbs = Math.max(5.5, Math.min(7.0, 6.2 + variation * 0.5));
            newAnalysisData.overallScore.gapPercentage = 
                ((newAnalysisData.overallScore.titanGrove - newAnalysisData.overallScore.oracleEbs) / 
                 newAnalysisData.overallScore.oracleEbs) * 100;
            
            // Update dashboard with new data
            this.updateDashboard(newAnalysisData);
            this.currentAnalysisId = newAnalysisData.analysisId;
            
            console.log('✅ Gap analysis completed:', {
                analysisId: newAnalysisData.analysisId,
                type: analysisType,
                titanGroveScore: newAnalysisData.overallScore.titanGrove,
                oracleEbsScore: newAnalysisData.overallScore.oracleEbs,
                gap: newAnalysisData.overallScore.gapPercentage
            });

            // Show success notification
            this.showNotification('Gap analysis completed successfully!', 'success');
            
        } catch (error) {
            console.error('❌ Error during gap analysis:', error);
            this.showNotification('Error running gap analysis. Please try again.', 'error');
        } finally {
            // Reset UI state
            if (btnText) btnText.textContent = 'Run New Analysis';
            if (spinner) spinner.style.display = 'none';
        }
    }

    async exportAnalysis(format) {
        console.log(`📤 Exporting analysis in ${format} format...`);
        
        try {
            if (!this.currentAnalysisId) {
                throw new Error('No analysis available to export');
            }

            // Simulate export functionality
            const exportData = {
                analysisId: this.currentAnalysisId,
                timestamp: new Date().toISOString(),
                format: format,
                data: this.mockData
            };

            let exportContent;
            let filename;
            let mimeType;

            switch (format) {
                case 'json':
                    exportContent = JSON.stringify(exportData, null, 2);
                    filename = `gap-analysis-${this.currentAnalysisId}.json`;
                    mimeType = 'application/json';
                    break;
                case 'csv':
                    exportContent = this.convertToCSV(exportData.data);
                    filename = `gap-analysis-${this.currentAnalysisId}.csv`;
                    mimeType = 'text/csv';
                    break;
                case 'pdf':
                    // For demo purposes, just generate a text report
                    exportContent = this.generateTextReport(exportData.data);
                    filename = `gap-analysis-${this.currentAnalysisId}.txt`;
                    mimeType = 'text/plain';
                    break;
                default:
                    throw new Error(`Unsupported format: ${format}`);
            }

            // Create download link
            this.downloadFile(exportContent, filename, mimeType);
            
            console.log(`✅ Analysis exported successfully as ${format}`);
            this.showNotification(`Analysis exported as ${format.toUpperCase()}`, 'success');

        } catch (error) {
            console.error('❌ Error exporting analysis:', error);
            this.showNotification(`Error exporting analysis: ${error.message}`, 'error');
        }
    }

    convertToCSV(data) {
        const headers = ['Domain', 'Feature Category', 'Gap Score', 'Advantages/Gaps'];
        const rows = [headers.join(',')];

        data.domainAnalysis.forEach(domain => {
            const advantages = domain.advantages ? domain.advantages.join('; ') : '';
            const gaps = domain.criticalGaps ? domain.criticalGaps.join('; ') : '';
            const content = advantages || gaps || 'N/A';
            
            rows.push([
                domain.domain,
                domain.category,
                domain.gapScore,
                `"${content}"`
            ].join(','));
        });

        return rows.join('\n');
    }

    generateTextReport(data) {
        return `
ORACLE EBS GAP ANALYSIS REPORT
==============================

Analysis ID: ${data.analysisId}
Timestamp: ${data.timestamp}
Analysis Type: ${data.analysisType}

OVERALL SCORES
--------------
Titan Grove: ${data.overallScore.titanGrove}/10
Oracle EBS: ${data.overallScore.oracleEbs}/10
Gap Percentage: +${data.overallScore.gapPercentage}%

SUMMARY
-------
Total Gaps: ${data.summary.totalGapsIdentified}
Critical Gaps: ${data.summary.criticalGaps}
Overall Readiness: ${data.summary.overallReadiness}%
Competitive Position: ${data.summary.competitivePosition.toUpperCase()}

DOMAIN ANALYSIS
---------------
${data.domainAnalysis.map(domain => 
    `${domain.category}: +${domain.gapScore}%\n  Advantages: ${domain.advantages ? domain.advantages.join(', ') : 'None'}\n  Gaps: ${domain.criticalGaps ? domain.criticalGaps.join(', ') : 'None'}`
).join('\n\n')}

TOP RECOMMENDATIONS
-------------------
${data.recommendations.slice(0, 3).map((rec, index) => 
    `${index + 1}. ${rec.title} (${rec.priority.toUpperCase()})\n   ${rec.description}\n   Effort: ${rec.estimatedEffort}`
).join('\n\n')}
`;
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }

    showNotification(message, type = 'info') {
        // Simple notification implementation
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 4px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            transition: opacity 0.3s;
            ${type === 'success' ? 'background: #42be65' : 
              type === 'error' ? 'background: #da1e28' : 
              'background: #0f62fe'}
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
}

// Global functions called by HTML
function runGapAnalysis() {
    if (window.gapAnalysisDashboard) {
        window.gapAnalysisDashboard.runGapAnalysis();
    }
}

function exportAnalysis(format) {
    if (window.gapAnalysisDashboard) {
        window.gapAnalysisDashboard.exportAnalysis(format);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.gapAnalysisDashboard = new GapAnalysisDashboard();
    console.log('🎯 Oracle EBS Gap Analysis Dashboard ready!');
});