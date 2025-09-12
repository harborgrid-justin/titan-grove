/**
 * Shared Constants and Utilities
 * Centralized constants used across multiple modules
 */

// Time constants for common date calculations
export const TIME_CONSTANTS = {
  MILLISECONDS_PER_DAY: 24 * 60 * 60 * 1000,
  DAYS_PER_MONTH: 30,
  DAYS_PER_YEAR: 365,
} as const;

// Common business constants
export const BUSINESS_CONSTANTS = {
  // Standard time periods
  STANDARD_PAYMENT_TERMS_DAYS: 30,
  STANDARD_REVIEW_PERIOD_DAYS: 30,
  STANDARD_RFQ_RESPONSE_DAYS: 14,

  // Performance thresholds
  OVERALLOCATION_THRESHOLD: 0.95, // 95% capacity threshold
  BUDGET_VARIANCE_WARNING: 0.2, // 20% over budget warning

  // Default ratios
  OVERHEAD_RATIO_DEFAULT: 0.15, // 15% overhead
  PREMIUM_SERVICE_MULTIPLIER: 0.15, // 15% premium

  // Quality thresholds
  MINIMUM_CONFIDENCE_LEVEL: 0.85, // 85% minimum confidence
  TARGET_EFFICIENCY_RATIO: 0.92, // 92% efficiency target
} as const;

// Service Analytics Constants
export const SERVICE_ANALYTICS_CONSTANTS = {
  // Service Recommendation Impact Values
  QUALITY_IMPROVEMENT_TARGET: 8.5, // percentage points
  COST_SAVINGS_DIAGNOSTIC_TOOLS: 125000, // annual savings
  COST_SAVINGS_RESOURCE_OPTIMIZATION: 85000, // from improved efficiency
  COST_SAVINGS_MOBILE_WORKFLOWS: 200000, // annual savings

  // Implementation Timelines (days)
  IMPLEMENTATION_TIME_DIAGNOSTIC_TOOLS: 45,
  IMPLEMENTATION_TIME_RESOURCE_EXPANSION: 60,
  IMPLEMENTATION_TIME_MOBILE_WORKFLOWS: 30,

  // Performance Thresholds
  RESOURCE_UTILIZATION_CURRENT: 78.9, // current percentage
  RESOURCE_UTILIZATION_OPTIMAL: 75.0, // target percentage
  TIME_REDUCTION_TARGET: 25, // percentage improvement
  CUSTOMER_SATISFACTION_GAIN: 0.3, // rating points

  // Oracle EBS Competitive Ratings (Centralized from demo files)
  ORACLE_EBS_DASHBOARD_RATING: 6.0,
  ORACLE_EBS_MOBILE_RATING: 4.0, // Updated from demo file hardcoded value
  ORACLE_EBS_OPTIMIZATION_RATING: 6.5, // Updated from demo file hardcoded value
  ORACLE_EBS_EMERGENCY_RATING: 7.0, // Updated from demo file hardcoded value
  ORACLE_EBS_ANALYTICS_RATING: 5.0, // Updated from demo file hardcoded value
  ORACLE_EBS_INTEGRATION_RATING: 6.8, // Updated from demo file hardcoded value

  TITAN_GROVE_DASHBOARD_RATING: 9.5,
  TITAN_GROVE_MOBILE_RATING: 9.2,
  TITAN_GROVE_OPTIMIZATION_RATING: 9.1, // Updated from demo file hardcoded value
  TITAN_GROVE_EMERGENCY_RATING: 9.3,
  TITAN_GROVE_ANALYTICS_RATING: 8.9, // Updated from demo file hardcoded value
  TITAN_GROVE_INTEGRATION_RATING: 9.0, // Updated from demo file hardcoded value

  // Business Value Metrics
  ORACLE_COMPETITIVE_COST_SAVINGS: 2850000, // Annual savings
  ORACLE_COMPETITIVE_EFFICIENCY_GAINS: 35.5, // Percentage improvement
  ORACLE_COMPETITIVE_REVENUE_INCREASE: 450000, // Additional revenue
  ORACLE_COMPETITIVE_RISK_REDUCTION: 65.0, // Percentage risk reduction
  ORACLE_COMPETITIVE_MIGRATION_COSTS: 750000,
  ORACLE_COMPETITIVE_ROI_MONTHS: 14, // months to payback

  // Service Metrics Mock Data (for development/demo) - Organized and Centralized
  MOCK_TOTAL_SERVICE_REQUESTS: 1247,
  MOCK_COMPLETED_WORK_ORDERS: 1183,
  MOCK_AVERAGE_RESOLUTION_TIME: 4.7, // hours
  MOCK_FIRST_TIME_FIX_RATE: 89.3, // percentage
  MOCK_CUSTOMER_SATISFACTION: 4.7, // 1-5 scale
  MOCK_ESCALATION_RATE: 2.1, // percentage
  MOCK_TECHNICIANS_ACTIVE: 45,
  MOCK_EQUIPMENT_UTILIZATION: 84.2, // percentage
  MOCK_TOTAL_SERVICE_REVENUE: 2847000,
  MOCK_SERVICE_COSTS: 2005000,
  MOCK_PROFIT_MARGIN: 29.6, // percentage
  MOCK_COST_PER_SERVICE_CALL: 1694,
} as const;

// Common date utilities using centralized constants
export const DateUtils = {
  addDays: (date: Date, days: number): Date => {
    return new Date(date.getTime() + days * TIME_CONSTANTS.MILLISECONDS_PER_DAY);
  },

  addMonths: (date: Date, months: number): Date => {
    return new Date(
      date.getTime() + months * TIME_CONSTANTS.DAYS_PER_MONTH * TIME_CONSTANTS.MILLISECONDS_PER_DAY
    );
  },

  getPaymentDueDate: (invoiceDate: Date, paymentTermsDays: number = 30): Date => {
    return DateUtils.addDays(invoiceDate, paymentTermsDays);
  },

  getForecastDate: (baseDate: Date, forecastDays: number): Date => {
    return DateUtils.addDays(baseDate, forecastDays);
  },
};

// ID generation utilities for consistent patterns
export const IdUtils = {
  generateProjectId: (): string => {
    return `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  generateContractId: (): string => {
    return `contract_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  generateInvoiceId: (): string => {
    return `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  generateTimeSheetId: (): string => {
    return `ts_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  generateContractNumber: (): string => {
    return `CON${Date.now().toString().slice(-6)}`;
  },

  generateInvoiceNumber: (): string => {
    return `INV${Date.now().toString().slice(-6)}`;
  },

  generateProjectNumber: (): string => {
    return `PRJ${Date.now().toString().slice(-6)}`;
  },
};

// Financial calculation utilities
export const FinancialUtils = {
  calculateTax: (amount: number, taxRate: number): number => {
    return amount * taxRate;
  },

  calculateOverhead: (totalCost: number, overheadRatio: number): number => {
    return totalCost * overheadRatio;
  },

  calculateProfitMargin: (revenue: number, costs: number): number => {
    return revenue > 0 ? (revenue - costs) / revenue : 0;
  },

  roundToCents: (amount: number): number => {
    return Math.round(amount * 100) / 100;
  },
};

// Performance calculation utilities
export const PerformanceUtils = {
  calculateHealthScore: (metrics: {
    schedule: number;
    cost: number;
    scope: number;
    quality: number;
    risk: number;
    satisfaction: number;
  }): number => {
    // Weighted average for overall health score
    const weights = {
      schedule: 0.25,
      cost: 0.25,
      scope: 0.2,
      quality: 0.15,
      risk: 0.1, // inverse weight since lower risk is better
      satisfaction: 0.05,
    };

    const normalizedRisk = 1 - metrics.risk; // invert risk for scoring
    const score =
      (metrics.schedule * weights.schedule +
        metrics.cost * weights.cost +
        metrics.scope * weights.scope +
        metrics.quality * weights.quality +
        normalizedRisk * weights.risk +
        metrics.satisfaction * weights.satisfaction) *
      100;

    return Math.round(Math.max(0, Math.min(100, score)));
  },

  isOverAllocated: (
    allocatedHours: number,
    totalCapacity: number,
    threshold: number = 0.95
  ): boolean => {
    return allocatedHours > totalCapacity * threshold;
  },

  calculateUtilization: (allocatedHours: number, totalCapacity: number): number => {
    return totalCapacity > 0 ? (allocatedHours / totalCapacity) * 100 : 0;
  },
};

// Business metrics calculation utilities
export const BusinessMetricsUtils = {
  /**
   * Calculate conversion rate as percentage
   */
  calculateConversionRate: (conversions: number, total: number): number => {
    return total > 0 ? conversions / total : 0;
  },

  /**
   * Calculate loss reason percentages from counts
   */
  calculateLossReasonPercentages: (
    lossReasons: Array<{ reason: string; count: number }>
  ): Array<{ reason: string; count: number; percentage: number }> => {
    const totalCount = lossReasons.reduce((sum, reason) => sum + reason.count, 0);
    return lossReasons.map((reason) => ({
      ...reason,
      percentage:
        totalCount > 0 ? FinancialUtils.roundToCents((reason.count / totalCount) * 100) : 0,
    }));
  },

  /**
   * Generate mock quote metrics based on configuration
   */
  generateMockQuoteMetrics: (config: {
    totalQuotes: number;
    totalQuoteValue: number;
    conversionRate: number;
    winRate: number;
    averageQuoteToCloseTime: number;
    priceLossReasonPercentage: number;
    competitorLossReasonPercentage: number;
    budgetLossReasonPercentage: number;
  }) => {
    const averageQuoteValue = config.totalQuoteValue / config.totalQuotes;

    // Calculate loss reasons based on percentages
    const totalLosses = Math.round(config.totalQuotes * (1 - config.winRate));
    const priceLosses = Math.round(totalLosses * (config.priceLossReasonPercentage / 100));
    const competitorLosses = Math.round(
      totalLosses * (config.competitorLossReasonPercentage / 100)
    );
    const budgetLosses = Math.round(totalLosses * (config.budgetLossReasonPercentage / 100));

    // Calculate remaining losses for other reasons
    const remainingLosses = totalLosses - priceLosses - competitorLosses - budgetLosses;
    const timingLosses = Math.round(remainingLosses * 0.6); // 60% of remaining
    const productLosses = remainingLosses - timingLosses;

    return {
      totalQuotes: config.totalQuotes,
      totalQuoteValue: config.totalQuoteValue,
      conversionRate: config.conversionRate,
      averageQuoteValue: FinancialUtils.roundToCents(averageQuoteValue),
      averageQuoteToCloseTime: config.averageQuoteToCloseTime,
      winRate: config.winRate,
      topLossReasons: BusinessMetricsUtils.calculateLossReasonPercentages([
        { reason: 'Price too high', count: priceLosses },
        { reason: 'Lost to competitor', count: competitorLosses },
        { reason: 'Budget constraints', count: budgetLosses },
        { reason: 'Timing not right', count: timingLosses },
        { reason: 'Product not suitable', count: productLosses },
      ]),
    };
  },
};

// Shipping and logistics calculation utilities
export const ShippingUtils = {
  /**
   * Calculate shipping carrier score based on weighted criteria
   */
  calculateCarrierScore: (
    costScore: number,
    speedScore: number,
    reliabilityScore: number,
    weights: { cost: number; speed: number; reliability: number } = {
      cost: 0.4,
      speed: 0.4,
      reliability: 0.2,
    }
  ): number => {
    return (
      costScore * weights.cost + speedScore * weights.speed + reliabilityScore * weights.reliability
    );
  },

  /**
   * Calculate insurance cost as percentage of insured value
   */
  calculateInsuranceCost: (insuredValue: number, insuranceRate: number = 0.005): number => {
    return insuredValue * insuranceRate;
  },

  /**
   * Calculate shipping weight from dimensions and density
   */
  calculateDimensionalWeight: (
    length: number,
    width: number,
    height: number,
    divisor: number = 139
  ): number => {
    return (length * width * height) / divisor;
  },
};

// Forecasting and analytics calculation utilities
export const ForecastingUtils = {
  /**
   * Generate forecast data with seasonal patterns and trends
   */
  generateForecastData: (
    baseValue: number,
    periods: number,
    seasonalAmplitude: number = 200,
    seasonalFrequency: number = 0.5,
    trendGrowth: number = 50,
    varianceBounds: { upper: number; lower: number } = { upper: 1.2, lower: 0.8 }
  ): Array<{
    period: Date;
    forecastValue: number;
    upperBound: number;
    lowerBound: number;
    variance: number;
  }> => {
    const forecastData = [];

    for (let i = 0; i < periods; i++) {
      const period = new Date();
      period.setMonth(period.getMonth() + i + 1);

      // Seasonal pattern using sine wave
      const seasonalValue = baseValue + Math.sin(i * seasonalFrequency) * seasonalAmplitude;
      const trend = i * trendGrowth;
      const noise = (Math.random() - 0.5) * 100;

      const forecastValue = seasonalValue + trend + noise;

      forecastData.push({
        period,
        forecastValue: Math.round(forecastValue),
        upperBound: Math.round(forecastValue * varianceBounds.upper),
        lowerBound: Math.round(forecastValue * varianceBounds.lower),
        variance: Math.round(Math.abs(noise)),
      });
    }

    return forecastData;
  },

  /**
   * Calculate confidence interval for forecast
   */
  calculateConfidenceInterval: (
    value: number,
    confidenceLevel: number = 0.95
  ): { upper: number; lower: number } => {
    const multiplier = confidenceLevel === 0.95 ? 1.96 : confidenceLevel === 0.99 ? 2.58 : 1.645;
    const margin = value * 0.1 * multiplier; // Assume 10% standard error

    return {
      upper: FinancialUtils.roundToCents(value + margin),
      lower: FinancialUtils.roundToCents(Math.max(0, value - margin)),
    };
  },
};

// Service Analytics Utilities
export const ServiceAnalyticsUtils = {
  /**
   * Generate standardized service recommendation
   */
  generateRecommendation: (
    type: 'QUALITY_ENHANCEMENT' | 'RESOURCE_OPTIMIZATION' | 'PROCESS_IMPROVEMENT',
    insightId?: string
  ) => {
    const baseId = `rec_${Date.now()}${insightId ? `_${insightId}` : '_standard'}`;

    switch (type) {
      case 'QUALITY_ENHANCEMENT':
        return {
          recommendationId: baseId,
          type,
          title: 'Implement Advanced Diagnostic Tools',
          description:
            'Deploy AI-powered diagnostic tools to improve first-time fix rates and reduce repeat service calls.',
          estimatedImpact: {
            qualityImprovement: SERVICE_ANALYTICS_CONSTANTS.QUALITY_IMPROVEMENT_TARGET,
            costSavings: SERVICE_ANALYTICS_CONSTANTS.COST_SAVINGS_DIAGNOSTIC_TOOLS,
            customerSatisfactionGain: SERVICE_ANALYTICS_CONSTANTS.CUSTOMER_SATISFACTION_GAIN,
          },
          implementationEffort: 'MEDIUM' as const,
          timeToImplement: SERVICE_ANALYTICS_CONSTANTS.IMPLEMENTATION_TIME_DIAGNOSTIC_TOOLS,
          requiredResources: ['IT Team', 'Training Team', 'Field Technicians'],
          status: 'NEW' as const,
          priority: 'HIGH' as const,
          category: 'Quality Improvement',
        };

      case 'RESOURCE_OPTIMIZATION':
        return {
          recommendationId: baseId,
          type,
          title: 'Expand Service Team Capacity',
          description: `Add additional field technicians to reduce utilization from current ${SERVICE_ANALYTICS_CONSTANTS.RESOURCE_UTILIZATION_CURRENT}% to optimal ${SERVICE_ANALYTICS_CONSTANTS.RESOURCE_UTILIZATION_OPTIMAL}%.`,
          estimatedImpact: {
            timeReduction: SERVICE_ANALYTICS_CONSTANTS.TIME_REDUCTION_TARGET,
            costSavings: SERVICE_ANALYTICS_CONSTANTS.COST_SAVINGS_RESOURCE_OPTIMIZATION,
            customerSatisfactionGain: SERVICE_ANALYTICS_CONSTANTS.CUSTOMER_SATISFACTION_GAIN - 0.1, // Slightly lower gain
          },
          implementationEffort: 'HIGH' as const,
          timeToImplement: SERVICE_ANALYTICS_CONSTANTS.IMPLEMENTATION_TIME_RESOURCE_EXPANSION,
          requiredResources: ['HR Team', 'Training Budget', 'Equipment'],
          status: 'NEW' as const,
          priority: 'HIGH' as const,
          category: 'Resource Management',
        };

      case 'PROCESS_IMPROVEMENT':
        return {
          recommendationId: baseId,
          type,
          title: 'Implement Mobile-First Service Workflows',
          description:
            'Transition to mobile-first service workflows to reduce paperwork and improve field efficiency.',
          estimatedImpact: {
            timeReduction: SERVICE_ANALYTICS_CONSTANTS.TIME_REDUCTION_TARGET - 5, // 20%
            costSavings: SERVICE_ANALYTICS_CONSTANTS.COST_SAVINGS_MOBILE_WORKFLOWS,
            qualityImprovement: 5,
          },
          implementationEffort: 'MEDIUM' as const,
          timeToImplement: SERVICE_ANALYTICS_CONSTANTS.IMPLEMENTATION_TIME_MOBILE_WORKFLOWS,
          requiredResources: ['Mobile Development Team', 'Training Team'],
          status: 'NEW' as const,
          priority: 'MEDIUM' as const,
          category: 'Digital Transformation',
        };
    }
  },

  /**
   * Generate Oracle EBS competitive comparison feature
   */
  generateOracleComparisonFeature: (
    feature: string,
    oracleRating: number,
    titanGroveRating: number,
    notes: string
  ) => ({
    feature,
    oracleEBSRating: oracleRating,
    titanGroveRating,
    advantage: titanGroveRating - oracleRating,
    notes,
  }),

  /**
   * Calculate overall competitive advantage
   */
  calculateCompetitiveAdvantage: (
    featureComparisons: Array<{
      oracleEBSRating: number;
      titanGroveRating: number;
    }>
  ) => {
    const oracleAverage =
      featureComparisons.reduce((sum, f) => sum + f.oracleEBSRating, 0) / featureComparisons.length;
    const titanGroveAverage =
      featureComparisons.reduce((sum, f) => sum + f.titanGroveRating, 0) /
      featureComparisons.length;

    return {
      oracle: FinancialUtils.roundToCents(oracleAverage),
      titanGrove: FinancialUtils.roundToCents(titanGroveAverage),
      competitiveAdvantage: FinancialUtils.roundToCents(titanGroveAverage - oracleAverage),
    };
  },

  /**
   * Generate standardized Oracle EBS business value metrics
   */
  getOracleEBSBusinessValue: () => ({
    costSavings: SERVICE_ANALYTICS_CONSTANTS.ORACLE_COMPETITIVE_COST_SAVINGS,
    efficiencyGains: SERVICE_ANALYTICS_CONSTANTS.ORACLE_COMPETITIVE_EFFICIENCY_GAINS,
    revenueIncrease: SERVICE_ANALYTICS_CONSTANTS.ORACLE_COMPETITIVE_REVENUE_INCREASE,
    riskReduction: SERVICE_ANALYTICS_CONSTANTS.ORACLE_COMPETITIVE_RISK_REDUCTION,
  }),

  /**
   * Get standardized Oracle EBS migration metrics
   */
  getOracleEBSMigrationMetrics: () => ({
    migrationComplexity: 'MEDIUM' as const,
    migrationTimeframe: 8, // months
    migrationCosts: SERVICE_ANALYTICS_CONSTANTS.ORACLE_COMPETITIVE_MIGRATION_COSTS,
    expectedROI: SERVICE_ANALYTICS_CONSTANTS.ORACLE_COMPETITIVE_ROI_MONTHS,
  }),

  /**
   * Generate mock service metrics for development/demo purposes
   * DEPRECATED: Use CentralizedDataProvider.getServiceMetrics() instead
   * This function is maintained for backward compatibility
   */
  generateMockServiceMetrics: () => {
    // Try to use centralized data provider if available
    try {
      const { dataProvider } = require('../utils/centralized-data-provider');
      return dataProvider.getServiceMetrics();
    } catch (error) {
      // Fallback to direct constants for backward compatibility
      return {
        // Volume metrics
        totalServiceRequests: SERVICE_ANALYTICS_CONSTANTS.MOCK_TOTAL_SERVICE_REQUESTS,
        completedWorkOrders: SERVICE_ANALYTICS_CONSTANTS.MOCK_COMPLETED_WORK_ORDERS,
        averageResolutionTime: SERVICE_ANALYTICS_CONSTANTS.MOCK_AVERAGE_RESOLUTION_TIME,

        // Quality metrics
        firstTimeFixRate: SERVICE_ANALYTICS_CONSTANTS.MOCK_FIRST_TIME_FIX_RATE,
        customerSatisfaction: SERVICE_ANALYTICS_CONSTANTS.MOCK_CUSTOMER_SATISFACTION,
        escalationRate: SERVICE_ANALYTICS_CONSTANTS.MOCK_ESCALATION_RATE,

        // Resource metrics
        resourceUtilization: SERVICE_ANALYTICS_CONSTANTS.RESOURCE_UTILIZATION_CURRENT,
        techniciansActive: SERVICE_ANALYTICS_CONSTANTS.MOCK_TECHNICIANS_ACTIVE,
        equipmentUtilization: SERVICE_ANALYTICS_CONSTANTS.MOCK_EQUIPMENT_UTILIZATION,

        // Financial metrics
        totalServiceRevenue: SERVICE_ANALYTICS_CONSTANTS.MOCK_TOTAL_SERVICE_REVENUE,
        serviceCosts: SERVICE_ANALYTICS_CONSTANTS.MOCK_SERVICE_COSTS,
        profitMargin: SERVICE_ANALYTICS_CONSTANTS.MOCK_PROFIT_MARGIN,
        costPerServiceCall: SERVICE_ANALYTICS_CONSTANTS.MOCK_COST_PER_SERVICE_CALL,
      };
    }
  },

  /**
   * Get competitive comparison data
   * DEPRECATED: Use CentralizedDataProvider.getCompetitiveComparison() instead
   * This function is maintained for backward compatibility
   */
  getOracleEBSCompetitiveComparison: () => {
    try {
      const { dataProvider } = require('../utils/centralized-data-provider');
      return dataProvider.getCompetitiveComparison();
    } catch (error) {
      // Fallback for backward compatibility
      return {
        oracle: {
          dashboardRating: SERVICE_ANALYTICS_CONSTANTS.ORACLE_EBS_DASHBOARD_RATING,
          mobileRating: SERVICE_ANALYTICS_CONSTANTS.ORACLE_EBS_MOBILE_RATING,
          overallRating: 5.9,
        },
        titanGrove: {
          dashboardRating: SERVICE_ANALYTICS_CONSTANTS.TITAN_GROVE_DASHBOARD_RATING,
          mobileRating: SERVICE_ANALYTICS_CONSTANTS.TITAN_GROVE_MOBILE_RATING,
          overallRating: 9.2,
        },
        businessValue: {
          costSavings: SERVICE_ANALYTICS_CONSTANTS.ORACLE_COMPETITIVE_COST_SAVINGS,
          efficiencyGains: SERVICE_ANALYTICS_CONSTANTS.ORACLE_COMPETITIVE_EFFICIENCY_GAINS,
          revenueIncrease: SERVICE_ANALYTICS_CONSTANTS.ORACLE_COMPETITIVE_REVENUE_INCREASE,
          riskReduction: SERVICE_ANALYTICS_CONSTANTS.ORACLE_COMPETITIVE_RISK_REDUCTION,
        }
      };
    }
  },
};
