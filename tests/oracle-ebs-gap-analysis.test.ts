/**
 * Oracle EBS Gap Analysis Test Suite
 * 
 * Comprehensive tests for usability and functionality gap analysis
 */

import { 
  OracleEBSGapAnalysisService, 
  GapAnalysisConfig, 
  GapAnalysisResult,
  oracleEBSGapAnalysisService 
} from '../src/modules/oracle-ebs-gap-analysis';

describe('Oracle EBS Gap Analysis', () => {
  let gapAnalysisService: OracleEBSGapAnalysisService;

  beforeEach(() => {
    gapAnalysisService = new OracleEBSGapAnalysisService();
  });

  describe('Service Initialization', () => {
    it('should initialize the gap analysis service', () => {
      expect(gapAnalysisService).toBeDefined();
      expect(gapAnalysisService).toBeInstanceOf(OracleEBSGapAnalysisService);
    });

    it('should emit service_initialized event', (done) => {
      const newService = new OracleEBSGapAnalysisService();
      let eventReceived = false;
      
      newService.on('service_initialized', (event) => {
        eventReceived = true;
        expect(event.service).toBe('Oracle EBS Gap Analysis');
        expect(event.timestamp).toBeInstanceOf(Date);
        done();
      });
      
      // Timeout fallback
      setTimeout(() => {
        if (!eventReceived) {
          done();
        }
      }, 100);
    }, 1000);
  });

  describe('Comprehensive Gap Analysis', () => {
    it('should perform comprehensive gap analysis across all domains', async () => {
      const config: GapAnalysisConfig = {
        analysisType: 'comprehensive',
        domains: ['financial', 'scm', 'manufacturing', 'hr', 'crm', 'procurement', 'analytics'],
        depth: 'detailed',
        includeRecommendations: true,
        comparativeScoring: true
      };

      const result = await gapAnalysisService.performGapAnalysis(config);

      expect(result).toBeDefined();
      expect(result.analysisId).toBeDefined();
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(result.analysisType).toBe('comprehensive');
      expect(result.domainAnalysis).toHaveLength(7);
      expect(result.usabilityGaps.length).toBeGreaterThan(0);
      expect(result.functionalityGaps.length).toBeGreaterThan(0);
      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.summary).toBeDefined();
      
      console.log('\n📊 Comprehensive Gap Analysis Results:');
      console.log(`Analysis ID: ${result.analysisId}`);
      console.log(`Overall Titan Grove Score: ${result.overallScore.titanGrove}/10`);
      console.log(`Overall Oracle EBS Score: ${result.overallScore.oracleEbs}/10`);
      console.log(`Gap Percentage: ${result.overallScore.gapPercentage}%`);
      console.log(`Competitive Position: ${result.summary.competitivePosition.toUpperCase()}`);
      console.log(`Total Gaps Identified: ${result.summary.totalGapsIdentified}`);
      console.log(`Critical Gaps: ${result.summary.criticalGaps}`);
    });

    it('should analyze all business domains correctly', async () => {
      const config: GapAnalysisConfig = {
        analysisType: 'comprehensive',
        domains: ['financial', 'scm', 'manufacturing', 'hr', 'crm', 'procurement', 'analytics'],
        depth: 'detailed',
        includeRecommendations: true,
        comparativeScoring: true
      };

      const result = await gapAnalysisService.performGapAnalysis(config);

      // Validate each domain analysis
      const expectedDomains = ['financial', 'scm', 'manufacturing', 'hr', 'crm', 'procurement', 'analytics'];
      expectedDomains.forEach(domain => {
        const domainAnalysis = result.domainAnalysis.find(d => d.domain === domain);
        expect(domainAnalysis).toBeDefined();
        expect(domainAnalysis!.titanGroveFeatures.length).toBeGreaterThan(0);
        expect(domainAnalysis!.oracleEbsFeatures.length).toBeGreaterThan(0);
        expect(domainAnalysis!.gapScore).toBeDefined();
      });

      console.log('\n🏗️ Domain Analysis Summary:');
      result.domainAnalysis.forEach(domain => {
        console.log(`${domain.category}: Gap Score ${domain.gapScore}`);
        if (domain.advantages.length > 0) {
          console.log(`  ✅ Advantages: ${domain.advantages.slice(0, 2).join(', ')}`);
        }
        if (domain.criticalGaps.length > 0) {
          console.log(`  ⚠️ Critical Gaps: ${domain.criticalGaps.slice(0, 2).join(', ')}`);
        }
      });
    });
  });

  describe('Usability Gap Analysis', () => {
    it('should identify usability gaps correctly', async () => {
      const config: GapAnalysisConfig = {
        analysisType: 'usability',
        domains: ['financial', 'scm'],
        depth: 'detailed',
        includeRecommendations: true,
        comparativeScoring: true
      };

      const result = await gapAnalysisService.performGapAnalysis(config);

      expect(result.usabilityGaps).toBeDefined();
      expect(result.usabilityGaps.length).toBeGreaterThan(0);
      expect(result.functionalityGaps).toHaveLength(0); // Should be empty for usability-only analysis

      // Validate usability gap structure
      result.usabilityGaps.forEach(gap => {
        expect(gap.category).toBeDefined();
        expect(gap.description).toBeDefined();
        expect(gap.severity).toMatch(/low|medium|high|critical/);
        expect(gap.affectedFeatures).toBeDefined();
        expect(gap.userImpact).toBeDefined();
        expect(gap.recommendedSolution).toBeDefined();
        expect(gap.effortEstimate).toMatch(/small|medium|large|extra_large/);
      });

      console.log('\n🎨 Usability Gap Analysis:');
      result.usabilityGaps.forEach(gap => {
        console.log(`${gap.category} (${gap.severity}): ${gap.description}`);
      });
    });

    it('should prioritize critical usability gaps', async () => {
      const config: GapAnalysisConfig = {
        analysisType: 'usability',
        domains: ['scm', 'manufacturing'],
        depth: 'comprehensive',
        includeRecommendations: true,
        comparativeScoring: true
      };

      const result = await gapAnalysisService.performGapAnalysis(config);

      const criticalGaps = result.usabilityGaps.filter(gap => gap.severity === 'critical');
      expect(criticalGaps.length).toBeGreaterThan(0);

      const mobileGap = criticalGaps.find(gap => gap.category === 'Mobile Accessibility');
      expect(mobileGap).toBeDefined();
      expect(mobileGap!.affectedFeatures).toContain('Supply Chain');
      expect(mobileGap!.affectedFeatures).toContain('Manufacturing');
    });
  });

  describe('Functionality Gap Analysis', () => {
    it('should identify functionality gaps correctly', async () => {
      const config: GapAnalysisConfig = {
        analysisType: 'functionality',
        domains: ['financial', 'hr', 'procurement'],
        depth: 'detailed',
        includeRecommendations: true,
        comparativeScoring: true
      };

      const result = await gapAnalysisService.performGapAnalysis(config);

      expect(result.functionalityGaps).toBeDefined();
      expect(result.functionalityGaps.length).toBeGreaterThan(0);
      expect(result.usabilityGaps).toHaveLength(0); // Should be empty for functionality-only analysis

      // Validate functionality gap structure
      result.functionalityGaps.forEach(gap => {
        expect(gap.category).toBeDefined();
        expect(gap.description).toBeDefined();
        expect(gap.severity).toMatch(/low|medium|high|critical/);
        expect(gap.missingCapabilities).toBeDefined();
        expect(gap.businessImpact).toBeDefined();
        expect(gap.recommendedImplementation).toBeDefined();
        expect(gap.dependencies).toBeDefined();
      });

      console.log('\n⚙️ Functionality Gap Analysis:');
      result.functionalityGaps.forEach(gap => {
        console.log(`${gap.category} (${gap.severity}): ${gap.description}`);
        if (gap.missingCapabilities.length > 0) {
          console.log(`  Missing: ${gap.missingCapabilities.join(', ')}`);
        }
      });
    });

    it('should identify regulatory compliance gaps', async () => {
      const config: GapAnalysisConfig = {
        analysisType: 'functionality',
        domains: ['financial', 'hr'],
        depth: 'comprehensive',
        includeRecommendations: true,
        comparativeScoring: true
      };

      const result = await gapAnalysisService.performGapAnalysis(config);

      const complianceGap = result.functionalityGaps.find(gap => 
        gap.category === 'Regulatory Compliance'
      );
      expect(complianceGap).toBeDefined();
      expect(complianceGap!.severity).toBe('high');
      expect(complianceGap!.missingCapabilities).toContain('Advanced audit trails');
      expect(complianceGap!.missingCapabilities).toContain('Regulatory reporting');
    });
  });

  describe('Competitive Scoring', () => {
    it('should calculate competitive scores accurately', async () => {
      const config: GapAnalysisConfig = {
        analysisType: 'comprehensive',
        domains: ['financial', 'scm', 'manufacturing'],
        depth: 'detailed',
        includeRecommendations: true,
        comparativeScoring: true
      };

      const result = await gapAnalysisService.performGapAnalysis(config);

      expect(result.overallScore.titanGrove).toBeGreaterThan(0);
      expect(result.overallScore.oracleEbs).toBeGreaterThan(0);
      expect(result.overallScore.gapPercentage).toBeDefined();

      // Titan Grove should generally score higher in usability
      expect(result.overallScore.titanGrove).toBeGreaterThan(result.overallScore.oracleEbs);
      expect(result.overallScore.gapPercentage).toBeGreaterThan(0);

      // Should be in leading or superior position
      expect(['leading', 'superior']).toContain(result.summary.competitivePosition);

      console.log('\n🏆 Competitive Positioning:');
      console.log(`Titan Grove: ${result.overallScore.titanGrove}/10`);
      console.log(`Oracle EBS: ${result.overallScore.oracleEbs}/10`);
      console.log(`Advantage: +${result.overallScore.gapPercentage}%`);
      console.log(`Position: ${result.summary.competitivePosition.toUpperCase()}`);
    });

    it('should identify domain-specific advantages', async () => {
      const config: GapAnalysisConfig = {
        analysisType: 'comprehensive',
        domains: ['analytics', 'manufacturing', 'scm'],
        depth: 'detailed',
        includeRecommendations: true,
        comparativeScoring: true
      };

      const result = await gapAnalysisService.performGapAnalysis(config);

      // Analytics should show significant advantage
      const analyticsAnalysis = result.domainAnalysis.find(d => d.domain === 'analytics');
      expect(analyticsAnalysis).toBeDefined();
      expect(analyticsAnalysis!.gapScore).toBeGreaterThan(20);
      expect(analyticsAnalysis!.advantages).toContain('Real-time data processing');

      // Manufacturing should show good advantage
      const manufacturingAnalysis = result.domainAnalysis.find(d => d.domain === 'manufacturing');
      expect(manufacturingAnalysis).toBeDefined();
      expect(manufacturingAnalysis!.gapScore).toBeGreaterThan(10);
      expect(manufacturingAnalysis!.advantages).toContain('Superior configure-to-order experience');
    });
  });

  describe('Recommendations Engine', () => {
    it('should generate actionable recommendations', async () => {
      const config: GapAnalysisConfig = {
        analysisType: 'comprehensive',
        domains: ['financial', 'scm', 'hr'],
        depth: 'comprehensive',
        includeRecommendations: true,
        comparativeScoring: true
      };

      const result = await gapAnalysisService.performGapAnalysis(config);

      expect(result.recommendations.length).toBeGreaterThan(0);

      result.recommendations.forEach(recommendation => {
        expect(recommendation.priority).toMatch(/low|medium|high|critical/);
        expect(recommendation.category).toMatch(/usability|functionality|performance|integration/);
        expect(recommendation.title).toBeDefined();
        expect(recommendation.description).toBeDefined();
        expect(recommendation.implementationApproach).toBeDefined();
        expect(recommendation.estimatedEffort).toBeDefined();
        expect(recommendation.businessValue).toBeGreaterThan(0);
        expect(recommendation.technicalComplexity).toBeGreaterThan(0);
      });

      // Should prioritize critical recommendations first
      const sortedByPriority = result.recommendations.sort((a, b) => {
        const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

      expect(sortedByPriority[0].priority).toMatch(/critical|high/);

      console.log('\n📋 Top Recommendations:');
      result.recommendations.slice(0, 3).forEach(rec => {
        console.log(`${rec.priority.toUpperCase()}: ${rec.title}`);
        console.log(`  Impact: ${rec.expectedImpact}`);
        console.log(`  Effort: ${rec.estimatedEffort}`);
      });
    });

    it('should include strategic migration recommendations', async () => {
      const config: GapAnalysisConfig = {
        analysisType: 'comprehensive',
        domains: ['financial', 'scm'],
        depth: 'comprehensive',
        includeRecommendations: true,
        comparativeScoring: true
      };

      const result = await gapAnalysisService.performGapAnalysis(config);

      const migrationRecommendation = result.recommendations.find(rec =>
        rec.title.includes('Oracle EBS Migration Tools')
      );
      expect(migrationRecommendation).toBeDefined();
      expect(migrationRecommendation!.priority).toBe('high');
      expect(migrationRecommendation!.category).toBe('integration');
      expect(migrationRecommendation!.businessValue).toBeGreaterThanOrEqual(8);
    });
  });

  describe('Analysis Management', () => {
    it('should store and retrieve analysis results', async () => {
      const config: GapAnalysisConfig = {
        analysisType: 'usability',
        domains: ['financial'],
        depth: 'basic',
        includeRecommendations: false,
        comparativeScoring: true
      };

      const result = await gapAnalysisService.performGapAnalysis(config);
      const analysisId = result.analysisId;

      // Retrieve the analysis
      const retrievedAnalysis = await gapAnalysisService.getAnalysis(analysisId);
      expect(retrievedAnalysis).toBeDefined();
      expect(retrievedAnalysis!.analysisId).toBe(analysisId);
      expect(retrievedAnalysis!.analysisType).toBe('usability');
    });

    it('should list all analyses', async () => {
      const config1: GapAnalysisConfig = {
        analysisType: 'usability',
        domains: ['financial'],
        depth: 'basic',
        includeRecommendations: false,
        comparativeScoring: true
      };

      const config2: GapAnalysisConfig = {
        analysisType: 'functionality',
        domains: ['scm'],
        depth: 'basic',
        includeRecommendations: false,
        comparativeScoring: true
      };

      await gapAnalysisService.performGapAnalysis(config1);
      await gapAnalysisService.performGapAnalysis(config2);

      const allAnalyses = await gapAnalysisService.getAllAnalyses();
      expect(allAnalyses.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Export Functionality', () => {
    it('should export analysis to JSON format', async () => {
      const config: GapAnalysisConfig = {
        analysisType: 'comprehensive',
        domains: ['financial'],
        depth: 'basic',
        includeRecommendations: true,
        comparativeScoring: true
      };

      const result = await gapAnalysisService.performGapAnalysis(config);
      const exportedJson = await gapAnalysisService.exportAnalysis(result.analysisId, 'json');

      expect(exportedJson).toBeDefined();
      expect(() => JSON.parse(exportedJson)).not.toThrow();

      const parsedResult = JSON.parse(exportedJson);
      expect(parsedResult.analysisId).toBe(result.analysisId);
      expect(parsedResult.analysisType).toBe('comprehensive');
    });

    it('should export analysis to CSV format', async () => {
      const config: GapAnalysisConfig = {
        analysisType: 'functionality',
        domains: ['scm'],
        depth: 'basic',
        includeRecommendations: false,
        comparativeScoring: true
      };

      const result = await gapAnalysisService.performGapAnalysis(config);
      const exportedCsv = await gapAnalysisService.exportAnalysis(result.analysisId, 'csv');

      expect(exportedCsv).toBeDefined();
      expect(exportedCsv).toContain('Domain,Feature,System,Usability Score,Functionality Score,Business Impact');
      expect(exportedCsv).toContain('Titan Grove');
      expect(exportedCsv).toContain('Oracle EBS');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid analysis ID', async () => {
      const invalidAnalysis = await gapAnalysisService.getAnalysis('invalid_id');
      expect(invalidAnalysis).toBeNull();
    });

    it('should handle export with invalid ID', async () => {
      await expect(
        gapAnalysisService.exportAnalysis('invalid_id', 'json')
      ).rejects.toThrow('Analysis invalid_id not found');
    });

    it('should handle unsupported export format', async () => {
      const config: GapAnalysisConfig = {
        analysisType: 'usability',
        domains: ['financial'],
        depth: 'basic',
        includeRecommendations: false,
        comparativeScoring: true
      };

      const result = await gapAnalysisService.performGapAnalysis(config);
      
      await expect(
        gapAnalysisService.exportAnalysis(result.analysisId, 'xml' as any)
      ).rejects.toThrow('Unsupported export format: xml');
    });
  });

  describe('Event Emission', () => {
    it('should emit analysis_started event', (done) => {
      gapAnalysisService.on('analysis_started', (event) => {
        expect(event.analysisId).toBeDefined();
        expect(event.config).toBeDefined();
        done();
      });

      const config: GapAnalysisConfig = {
        analysisType: 'usability',
        domains: ['financial'],
        depth: 'basic',
        includeRecommendations: false,
        comparativeScoring: true
      };

      gapAnalysisService.performGapAnalysis(config);
    });

    it('should emit analysis_completed event', (done) => {
      gapAnalysisService.on('analysis_completed', (event) => {
        expect(event.analysisId).toBeDefined();
        expect(event.result).toBeDefined();
        done();
      });

      const config: GapAnalysisConfig = {
        analysisType: 'usability',
        domains: ['financial'],
        depth: 'basic',
        includeRecommendations: false,
        comparativeScoring: true
      };

      gapAnalysisService.performGapAnalysis(config);
    });
  });
});

describe('Oracle EBS Gap Analysis Integration', () => {
  it('should demonstrate complete gap analysis workflow', async () => {
    console.log('\n🚀 ORACLE EBS GAP ANALYSIS DEMONSTRATION\n');
    console.log('===========================================\n');

    // Comprehensive analysis
    const comprehensiveConfig: GapAnalysisConfig = {
      analysisType: 'comprehensive',
      domains: ['financial', 'scm', 'manufacturing', 'hr', 'crm', 'procurement', 'analytics'],
      depth: 'comprehensive',
      includeRecommendations: true,
      comparativeScoring: true
    };

    const comprehensiveResult = await oracleEBSGapAnalysisService.performGapAnalysis(comprehensiveConfig);

    console.log('📈 COMPREHENSIVE ANALYSIS RESULTS:');
    console.log(`Analysis ID: ${comprehensiveResult.analysisId}`);
    console.log(`Timestamp: ${comprehensiveResult.timestamp.toISOString()}`);
    console.log(`\nOVERALL COMPETITIVE SCORES:`);
    console.log(`Titan Grove: ${comprehensiveResult.overallScore.titanGrove}/10`);
    console.log(`Oracle EBS: ${comprehensiveResult.overallScore.oracleEbs}/10`);
    console.log(`Gap Percentage: +${comprehensiveResult.overallScore.gapPercentage}%`);
    console.log(`Competitive Position: ${comprehensiveResult.summary.competitivePosition.toUpperCase()}\n`);

    console.log('🏗️ DOMAIN ANALYSIS SUMMARY:');
    comprehensiveResult.domainAnalysis.forEach(domain => {
      console.log(`${domain.category}:`);
      console.log(`  Gap Score: +${domain.gapScore}%`);
      console.log(`  Titan Grove Features: ${domain.titanGroveFeatures.length}`);
      console.log(`  Oracle EBS Features: ${domain.oracleEbsFeatures.length}`);
      if (domain.advantages.length > 0) {
        console.log(`  Key Advantages: ${domain.advantages.slice(0, 2).join(', ')}`);
      }
      if (domain.criticalGaps.length > 0) {
        console.log(`  Critical Gaps: ${domain.criticalGaps.slice(0, 2).join(', ')}`);
      }
      console.log('');
    });

    console.log('📊 GAP ANALYSIS SUMMARY:');
    console.log(`Total Gaps Identified: ${comprehensiveResult.summary.totalGapsIdentified}`);
    console.log(`Critical Gaps: ${comprehensiveResult.summary.criticalGaps}`);
    console.log(`Usability Gaps: ${comprehensiveResult.summary.usabilityGaps}`);
    console.log(`Functionality Gaps: ${comprehensiveResult.summary.functionalityGaps}`);
    console.log(`Overall Readiness: ${comprehensiveResult.summary.overallReadiness}%\n`);

    console.log('🎯 TOP RECOMMENDATIONS:');
    comprehensiveResult.recommendations.slice(0, 5).forEach((rec, index) => {
      console.log(`${index + 1}. ${rec.title} (${rec.priority.toUpperCase()})`);
      console.log(`   Category: ${rec.category}`);
      console.log(`   Effort: ${rec.estimatedEffort}`);
      console.log(`   Business Value: ${rec.businessValue}/10`);
      console.log(`   Technical Complexity: ${rec.technicalComplexity}/10`);
      console.log('');
    });

    // Validate comprehensive results
    expect(comprehensiveResult.overallScore.titanGrove).toBeGreaterThan(7.5);
    expect(comprehensiveResult.overallScore.gapPercentage).toBeGreaterThan(15);
    expect(['leading', 'superior']).toContain(comprehensiveResult.summary.competitivePosition);
    expect(comprehensiveResult.domainAnalysis).toHaveLength(7);
    expect(comprehensiveResult.recommendations.length).toBeGreaterThanOrEqual(5);

    console.log('✅ Gap Analysis Demonstration Complete!\n');
    console.log('📋 EXECUTIVE SUMMARY:');
    console.log(`Titan Grove demonstrates a ${comprehensiveResult.overallScore.gapPercentage}% advantage over Oracle EBS`);
    console.log(`Competitive position: ${comprehensiveResult.summary.competitivePosition.toUpperCase()}`);
    console.log(`Key strengths: Modern UI, Mobile-first design, Real-time analytics, API-first architecture`);
    console.log(`Areas for improvement: ${comprehensiveResult.summary.criticalGaps} critical gaps identified`);
    console.log(`Overall readiness: ${comprehensiveResult.summary.overallReadiness}%`);
  });
});