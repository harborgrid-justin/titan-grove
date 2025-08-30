/**
 * Shared Metrics Types
 * Common metric interfaces used across different modules
 */

import { RiskLevel, PerformanceLevel } from '../../types/common';

/**
 * Base metric interface with common fields
 */
export interface BaseMetric {
  id: string;
  name: string;
  currentValue: number;
  targetValue?: number;
  unit: string;
  lastUpdated: Date;
  trend?: 'IMPROVING' | 'DECLINING' | 'STABLE';
}

/**
 * Resource utilization metrics
 */
export interface ResourceUtilization {
  resourceType: string;
  allocated: number;
  utilized: number;
  utilizationRate: number;
  efficiency: number;
  bottlenecks: string[];
}

/**
 * Quality metrics
 */
export interface QualityMetric {
  qualityIndicator: string;
  currentScore: number;
  targetScore: number;
  defectRate: number;
  customerSatisfaction: number;
  improvementTrend: 'IMPROVING' | 'DECLINING' | 'STABLE';
}

/**
 * Productivity metrics
 */
export interface ProductivityMetric {
  productivityIndicator: string;
  outputPerPeriod: number;
  targetOutput: number;
  efficiency: number;
  resourceInput: number;
  productivityRatio: number;
}

/**
 * Performance analysis interface
 */
export interface PerformanceAnalysis {
  analysisId: string;
  analysisType: string;
  performanceLevel: PerformanceLevel;
  riskLevel: RiskLevel;
  recommendations: string[];
  improvementOpportunities: string[];
  benchmarkComparison?: {
    benchmarkValue: number;
    variance: number;
    percentile: number;
  };
}

/**
 * Key Performance Indicator (KPI) interface
 */
export interface KPI extends BaseMetric {
  kpiType: 'OPERATIONAL' | 'FINANCIAL' | 'QUALITY' | 'STRATEGIC';
  status: 'ON_TARGET' | 'WARNING' | 'CRITICAL';
  variance: number;
  variancePercentage: number;
}