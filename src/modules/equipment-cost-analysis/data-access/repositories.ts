/**
 * Equipment Cost Analysis Data Access Layer
 * Production-grade repositories for equipment cost analysis and optimization
 */

import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';
import { generateId } from '../../../shared/utils/id-generator';
import type {
  EquipmentCostProfile,
  TotalCostOfOwnership,
  CostBenchmark,
  LifecycleCostAnalysis,
  CostOptimization,
  CostBreakdown,
  CostVarianceAnalysis,
  CostForecast,
  CostCenter,
  CostDriver,
  CostReduction,
  EquipmentProcurementCost,
  OperatingCostAnalysis,
  MaintenanceCostAnalysis,
  CostPerformanceIndicator
} from '../types';

/**
 * Equipment Cost Profile Repository
 * Manages comprehensive equipment cost profiles and tracking
 */
export class EquipmentCostProfileRepository extends BaseRepositoryImpl<EquipmentCostProfile> {
  protected generateId(): string {
    return generateId('equipment_cost_profile');
  }

  /**
   * Find cost profiles by equipment
   */
  async findByEquipmentId(equipmentId: string): Promise<EquipmentCostProfile[]> {
    return this.items.filter(profile => profile.equipmentId === equipmentId);
  }

  /**
   * Find cost profiles by category
   */
  async findByEquipmentCategory(category: string): Promise<EquipmentCostProfile[]> {
    return this.items.filter(profile => profile.equipmentCategory === category);
  }

  /**
   * Find cost profiles by cost center
   */
  async findByCostCenter(costCenter: string): Promise<EquipmentCostProfile[]> {
    return this.items.filter(profile => 
      profile.costClassification.primaryCostCenter === costCenter ||
      profile.costClassification.secondaryCostCenters.includes(costCenter)
    );
  }

  /**
   * Find cost profiles by cost type
   */
  async findByCostType(costType: EquipmentCostProfile['costClassification']['costType']): Promise<EquipmentCostProfile[]> {
    return this.items.filter(profile => profile.costClassification.costType === costType);
  }

  /**
   * Find high-cost equipment profiles
   */
  async findHighCostProfiles(threshold: number): Promise<EquipmentCostProfile[]> {
    return this.items.filter(profile => 
      profile.acquisitionCosts.totalAcquisitionCost >= threshold
    );
  }

  /**
   * Get total acquisition cost by category
   */
  async getTotalAcquisitionCostByCategory(category: string): Promise<number> {
    const profiles = await this.findByEquipmentCategory(category);
    return profiles.reduce((total, profile) => 
      total + profile.acquisitionCosts.totalAcquisitionCost, 0
    );
  }
}

/**
 * Total Cost of Ownership Repository
 * Manages TCO calculations and lifecycle analysis
 */
export class TotalCostOfOwnershipRepository extends BaseRepositoryImpl<TotalCostOfOwnership> {
  protected generateId(): string {
    return generateId('tco_analysis');
  }

  /**
   * Find TCO analyses by equipment
   */
  async findByEquipmentId(equipmentId: string): Promise<TotalCostOfOwnership[]> {
    return this.items.filter(tco => tco.equipmentId === equipmentId);
  }

  /**
   * Find TCO analyses by analysis period
   */
  async findByAnalysisPeriod(years: number): Promise<TotalCostOfOwnership[]> {
    return this.items.filter(tco => tco.analysisPeriod.totalYears === years);
  }

  /**
   * Get latest TCO analysis for equipment
   */
  async getLatestTCOForEquipment(equipmentId: string): Promise<TotalCostOfOwnership | null> {
    const tcoAnalyses = await this.findByEquipmentId(equipmentId);
    if (tcoAnalyses.length === 0) return null;

    return tcoAnalyses.reduce((latest, current) => 
      current.analysisDate > latest.analysisDate ? current : latest
    );
  }

  /**
   * Find TCO analyses above threshold
   */
  async findTCOAboveThreshold(threshold: number): Promise<TotalCostOfOwnership[]> {
    return this.items.filter(tco => tco.totalCostOfOwnership >= threshold);
  }

  /**
   * Calculate average TCO by equipment category
   */
  async getAverageTCOByCategory(category: string): Promise<number> {
    const equipmentTCOs = this.items.filter(tco => tco.equipmentCategory === category);
    if (equipmentTCOs.length === 0) return 0;

    const totalTCO = equipmentTCOs.reduce((sum, tco) => sum + tco.totalCostOfOwnership, 0);
    return totalTCO / equipmentTCOs.length;
  }
}

/**
 * Cost Benchmark Repository
 * Manages cost benchmarking and performance comparison
 */
export class CostBenchmarkRepository extends BaseRepositoryImpl<CostBenchmark> {
  protected generateId(): string {
    return generateId('cost_benchmark');
  }

  /**
   * Find benchmarks by equipment type
   */
  async findByEquipmentType(equipmentType: string): Promise<CostBenchmark[]> {
    return this.items.filter(benchmark => benchmark.equipmentType === equipmentType);
  }

  /**
   * Find benchmarks by industry
   */
  async findByIndustry(industry: string): Promise<CostBenchmark[]> {
    return this.items.filter(benchmark => benchmark.industry === industry);
  }

  /**
   * Find benchmarks by benchmark type
   */
  async findByBenchmarkType(type: CostBenchmark['benchmarkType']): Promise<CostBenchmark[]> {
    return this.items.filter(benchmark => benchmark.benchmarkType === type);
  }

  /**
   * Get current benchmarks for equipment type
   */
  async getCurrentBenchmarks(equipmentType: string): Promise<CostBenchmark[]> {
    const now = new Date();
    return this.items.filter(benchmark => 
      benchmark.equipmentType === equipmentType &&
      benchmark.validFrom <= now &&
      (!benchmark.validTo || benchmark.validTo >= now)
    );
  }

  /**
   * Find performance outliers
   */
  async findPerformanceOutliers(
    equipmentType: string,
    deviationThreshold: number = 20
  ): Promise<CostBenchmark[]> {
    const benchmarks = await this.findByEquipmentType(equipmentType);
    return benchmarks.filter(benchmark => 
      Math.abs(benchmark.performance.varianceFromBenchmark) >= deviationThreshold
    );
  }
}

/**
 * Lifecycle Cost Analysis Repository
 * Manages equipment lifecycle cost projections and analysis
 */
export class LifecycleCostAnalysisRepository extends BaseRepositoryImpl<LifecycleCostAnalysis> {
  protected generateId(): string {
    return generateId('lifecycle_analysis');
  }

  /**
   * Find analyses by equipment
   */
  async findByEquipmentId(equipmentId: string): Promise<LifecycleCostAnalysis[]> {
    return this.items.filter(analysis => analysis.equipmentId === equipmentId);
  }

  /**
   * Find analyses by lifecycle stage
   */
  async findByLifecycleStage(stage: LifecycleCostAnalysis['currentStage']): Promise<LifecycleCostAnalysis[]> {
    return this.items.filter(analysis => analysis.currentStage === stage);
  }

  /**
   * Find analyses by expected lifecycle
   */
  async findByExpectedLifecycle(minYears: number, maxYears: number): Promise<LifecycleCostAnalysis[]> {
    return this.items.filter(analysis => 
      analysis.expectedLifecycle >= minYears && analysis.expectedLifecycle <= maxYears
    );
  }

  /**
   * Find equipment nearing replacement
   */
  async findEquipmentNearingReplacement(monthsAhead: number = 12): Promise<LifecycleCostAnalysis[]> {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() + monthsAhead);

    return this.items.filter(analysis => 
      analysis.plannedReplacementDate && 
      analysis.plannedReplacementDate <= cutoffDate
    );
  }

  /**
   * Get lifecycle cost summary for equipment category
   */
  async getLifecycleCostSummaryByCategory(category: string): Promise<{
    count: number;
    averageLifecycle: number;
    totalLifecycleCost: number;
    averageAnnualCost: number;
  }> {
    const analyses = this.items.filter(analysis => analysis.equipmentCategory === category);
    
    if (analyses.length === 0) {
      return {
        count: 0,
        averageLifecycle: 0,
        totalLifecycleCost: 0,
        averageAnnualCost: 0
      };
    }

    const totalLifecycle = analyses.reduce((sum, analysis) => sum + analysis.expectedLifecycle, 0);
    const totalCost = analyses.reduce((sum, analysis) => sum + analysis.totalLifecycleCost, 0);

    return {
      count: analyses.length,
      averageLifecycle: totalLifecycle / analyses.length,
      totalLifecycleCost: totalCost,
      averageAnnualCost: totalCost / analyses.length
    };
  }
}

/**
 * Cost Optimization Repository
 * Manages cost reduction opportunities and optimization strategies
 */
export class CostOptimizationRepository extends BaseRepositoryImpl<CostOptimization> {
  protected generateId(): string {
    return generateId('cost_optimization');
  }

  /**
   * Find optimizations by equipment
   */
  async findByEquipmentId(equipmentId: string): Promise<CostOptimization[]> {
    return this.items.filter(optimization => optimization.equipmentId === equipmentId);
  }

  /**
   * Find optimizations by category
   */
  async findByOptimizationCategory(category: CostOptimization['optimizationCategory']): Promise<CostOptimization[]> {
    return this.items.filter(optimization => optimization.optimizationCategory === category);
  }

  /**
   * Find optimizations by status
   */
  async findByImplementationStatus(status: CostOptimization['implementation']['status']): Promise<CostOptimization[]> {
    return this.items.filter(optimization => optimization.implementation.status === status);
  }

  /**
   * Find high-impact optimizations
   */
  async findHighImpactOptimizations(minSavings: number): Promise<CostOptimization[]> {
    return this.items.filter(optimization => 
      optimization.projectedSavings.annualSavings >= minSavings
    );
  }

  /**
   * Get optimization potential by category
   */
  async getOptimizationPotentialByCategory(category: string): Promise<{
    totalOpportunities: number;
    totalPotentialSavings: number;
    averageSavingsPerOpportunity: number;
    implementedSavings: number;
    remainingPotential: number;
  }> {
    const optimizations = this.items.filter(opt => opt.equipmentCategory === category);
    
    if (optimizations.length === 0) {
      return {
        totalOpportunities: 0,
        totalPotentialSavings: 0,
        averageSavingsPerOpportunity: 0,
        implementedSavings: 0,
        remainingPotential: 0
      };
    }

    const totalPotential = optimizations.reduce((sum, opt) => 
      sum + opt.projectedSavings.annualSavings, 0
    );

    const implementedSavings = optimizations
      .filter(opt => opt.implementation.status === 'COMPLETED')
      .reduce((sum, opt) => sum + opt.actualSavings.annualSavings, 0);

    return {
      totalOpportunities: optimizations.length,
      totalPotentialSavings: totalPotential,
      averageSavingsPerOpportunity: totalPotential / optimizations.length,
      implementedSavings,
      remainingPotential: totalPotential - implementedSavings
    };
  }
}

/**
 * Cost Variance Analysis Repository
 * Manages budget vs actual cost analysis and variance reporting
 */
export class CostVarianceAnalysisRepository extends BaseRepositoryImpl<CostVarianceAnalysis> {
  protected generateId(): string {
    return generateId('cost_variance');
  }

  /**
   * Find variance analyses by equipment
   */
  async findByEquipmentId(equipmentId: string): Promise<CostVarianceAnalysis[]> {
    return this.items.filter(analysis => analysis.equipmentId === equipmentId);
  }

  /**
   * Find variance analyses by period
   */
  async findByAnalysisPeriod(startDate: Date, endDate: Date): Promise<CostVarianceAnalysis[]> {
    return this.items.filter(analysis => 
      analysis.analysisPeriod.startDate >= startDate && 
      analysis.analysisPeriod.endDate <= endDate
    );
  }

  /**
   * Find significant variances
   */
  async findSignificantVariances(thresholdPercentage: number = 10): Promise<CostVarianceAnalysis[]> {
    return this.items.filter(analysis => 
      Math.abs(analysis.totalVariance.variancePercentage) >= thresholdPercentage
    );
  }

  /**
   * Find unfavorable variances
   */
  async findUnfavorableVariances(): Promise<CostVarianceAnalysis[]> {
    return this.items.filter(analysis => analysis.totalVariance.varianceAmount > 0);
  }

  /**
   * Get variance summary by category
   */
  async getVarianceSummaryByCategory(category: string): Promise<{
    totalAnalyses: number;
    averageVariancePercentage: number;
    totalVarianceAmount: number;
    favorableVariances: number;
    unfavorableVariances: number;
  }> {
    const analyses = this.items.filter(analysis => analysis.equipmentCategory === category);
    
    if (analyses.length === 0) {
      return {
        totalAnalyses: 0,
        averageVariancePercentage: 0,
        totalVarianceAmount: 0,
        favorableVariances: 0,
        unfavorableVariances: 0
      };
    }

    const totalVariancePercentage = analyses.reduce((sum, analysis) => 
      sum + analysis.totalVariance.variancePercentage, 0
    );

    const totalVarianceAmount = analyses.reduce((sum, analysis) => 
      sum + analysis.totalVariance.varianceAmount, 0
    );

    const favorableCount = analyses.filter(analysis => 
      analysis.totalVariance.varianceAmount < 0
    ).length;

    return {
      totalAnalyses: analyses.length,
      averageVariancePercentage: totalVariancePercentage / analyses.length,
      totalVarianceAmount,
      favorableVariances: favorableCount,
      unfavorableVariances: analyses.length - favorableCount
    };
  }
}

/**
 * Cost Forecast Repository
 * Manages cost forecasting and predictive analysis
 */
export class CostForecastRepository extends BaseRepositoryImpl<CostForecast> {
  protected generateId(): string {
    return generateId('cost_forecast');
  }

  /**
   * Find forecasts by equipment
   */
  async findByEquipmentId(equipmentId: string): Promise<CostForecast[]> {
    return this.items.filter(forecast => forecast.equipmentId === equipmentId);
  }

  /**
   * Find forecasts by forecast period
   */
  async findByForecastPeriod(years: number): Promise<CostForecast[]> {
    return this.items.filter(forecast => forecast.forecastPeriod.years === years);
  }

  /**
   * Get latest forecast for equipment
   */
  async getLatestForecast(equipmentId: string): Promise<CostForecast | null> {
    const forecasts = await this.findByEquipmentId(equipmentId);
    if (forecasts.length === 0) return null;

    return forecasts.reduce((latest, current) => 
      current.forecastDate > latest.forecastDate ? current : latest
    );
  }

  /**
   * Find forecasts with high confidence
   */
  async findHighConfidenceForecasts(minConfidence: number = 80): Promise<CostForecast[]> {
    return this.items.filter(forecast => forecast.confidenceLevel >= minConfidence);
  }

  /**
   * Get forecast accuracy metrics
   */
  async getForecastAccuracyMetrics(): Promise<{
    totalForecasts: number;
    averageAccuracy: number;
    highAccuracyForecasts: number;
    lowAccuracyForecasts: number;
  }> {
    const completedForecasts = this.items.filter(forecast => 
      forecast.actualVsForecast && forecast.actualVsForecast.accuracyPercentage !== undefined
    );

    if (completedForecasts.length === 0) {
      return {
        totalForecasts: 0,
        averageAccuracy: 0,
        highAccuracyForecasts: 0,
        lowAccuracyForecasts: 0
      };
    }

    const totalAccuracy = completedForecasts.reduce((sum, forecast) => 
      sum + (forecast.actualVsForecast?.accuracyPercentage || 0), 0
    );

    const highAccuracyCount = completedForecasts.filter(forecast => 
      (forecast.actualVsForecast?.accuracyPercentage || 0) >= 90
    ).length;

    return {
      totalForecasts: completedForecasts.length,
      averageAccuracy: totalAccuracy / completedForecasts.length,
      highAccuracyForecasts: highAccuracyCount,
      lowAccuracyForecasts: completedForecasts.length - highAccuracyCount
    };
  }
}

/**
 * Cost Performance Indicator Repository
 * Manages cost-related KPIs and performance metrics
 */
export class CostPerformanceIndicatorRepository extends BaseRepositoryImpl<CostPerformanceIndicator> {
  protected generateId(): string {
    return generateId('cost_kpi');
  }

  /**
   * Find KPIs by equipment
   */
  async findByEquipmentId(equipmentId: string): Promise<CostPerformanceIndicator[]> {
    return this.items.filter(kpi => kpi.equipmentId === equipmentId);
  }

  /**
   * Find KPIs by indicator type
   */
  async findByIndicatorType(type: CostPerformanceIndicator['indicatorType']): Promise<CostPerformanceIndicator[]> {
    return this.items.filter(kpi => kpi.indicatorType === type);
  }

  /**
   * Find KPIs by performance status
   */
  async findByPerformanceStatus(status: CostPerformanceIndicator['performance']['status']): Promise<CostPerformanceIndicator[]> {
    return this.items.filter(kpi => kpi.performance.status === status);
  }

  /**
   * Find underperforming KPIs
   */
  async findUnderperformingKPIs(): Promise<CostPerformanceIndicator[]> {
    return this.items.filter(kpi => 
      kpi.performance.status === 'BELOW_TARGET' || 
      kpi.performance.status === 'CRITICAL'
    );
  }

  /**
   * Get KPI summary dashboard
   */
  async getKPISummaryDashboard(): Promise<{
    totalKPIs: number;
    onTarget: number;
    aboveTarget: number;
    belowTarget: number;
    critical: number;
    averagePerformance: number;
  }> {
    const total = this.items.length;
    if (total === 0) {
      return {
        totalKPIs: 0,
        onTarget: 0,
        aboveTarget: 0,
        belowTarget: 0,
        critical: 0,
        averagePerformance: 0
      };
    }

    const statusCounts = this.items.reduce((counts, kpi) => {
      counts[kpi.performance.status] = (counts[kpi.performance.status] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const totalPerformance = this.items.reduce((sum, kpi) => 
      sum + kpi.performance.achievementPercentage, 0
    );

    return {
      totalKPIs: total,
      onTarget: statusCounts['ON_TARGET'] || 0,
      aboveTarget: statusCounts['ABOVE_TARGET'] || 0,
      belowTarget: statusCounts['BELOW_TARGET'] || 0,
      critical: statusCounts['CRITICAL'] || 0,
      averagePerformance: totalPerformance / total
    };
  }
}

// Export singleton instances for use throughout the application
export const equipmentCostProfileRepository = new EquipmentCostProfileRepository();
export const totalCostOfOwnershipRepository = new TotalCostOfOwnershipRepository();
export const costBenchmarkRepository = new CostBenchmarkRepository();
export const lifecycleCostAnalysisRepository = new LifecycleCostAnalysisRepository();
export const costOptimizationRepository = new CostOptimizationRepository();
export const costVarianceAnalysisRepository = new CostVarianceAnalysisRepository();
export const costForecastRepository = new CostForecastRepository();
export const costPerformanceIndicatorRepository = new CostPerformanceIndicatorRepository();