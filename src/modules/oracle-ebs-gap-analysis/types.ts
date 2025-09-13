/**
 * Oracle EBS Gap Analysis Types
 * 
 * Type definitions for gap analysis functionality
 */

export * from './business-logic/gap-analysis-service';

// Additional utility types
export interface GapAnalysisMetrics {
  totalAnalyses: number;
  averageGapScore: number;
  commonGaps: string[];
  trendAnalysis: {
    usabilityTrend: 'improving' | 'declining' | 'stable';
    functionalityTrend: 'improving' | 'declining' | 'stable';
    overallTrend: 'improving' | 'declining' | 'stable';
  };
}

export interface CompetitivePositioning {
  overall: number;
  categories: {
    usability: number;
    functionality: number;
    performance: number;
    cost: number;
    support: number;
  };
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface BenchmarkData {
  system: string;
  version: string;
  scores: {
    usability: number;
    functionality: number;
    performance: number;
    reliability: number;
    security: number;
  };
  marketShare: number;
  customerSatisfaction: number;
  totalCostOfOwnership: number;
}

export interface MigrationAnalysis {
  complexity: 'low' | 'medium' | 'high' | 'very_high';
  estimatedEffort: string;
  keyRisks: string[];
  migrationPath: {
    phases: string[];
    timeline: string;
    resources: string[];
  };
  businessCase: {
    costs: number;
    benefits: number;
    roi: number;
    paybackPeriod: string;
  };
}