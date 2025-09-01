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
  BUDGET_VARIANCE_WARNING: 0.20, // 20% over budget warning
  
  // Default ratios
  OVERHEAD_RATIO_DEFAULT: 0.15, // 15% overhead
  PREMIUM_SERVICE_MULTIPLIER: 0.15, // 15% premium
  
  // Quality thresholds
  MINIMUM_CONFIDENCE_LEVEL: 0.85, // 85% minimum confidence
  TARGET_EFFICIENCY_RATIO: 0.92, // 92% efficiency target
} as const;

// Common date utilities using centralized constants
export const DateUtils = {
  addDays: (date: Date, days: number): Date => {
    return new Date(date.getTime() + days * TIME_CONSTANTS.MILLISECONDS_PER_DAY);
  },
  
  addMonths: (date: Date, months: number): Date => {
    return new Date(date.getTime() + months * TIME_CONSTANTS.DAYS_PER_MONTH * TIME_CONSTANTS.MILLISECONDS_PER_DAY);
  },
  
  getPaymentDueDate: (invoiceDate: Date, paymentTermsDays: number = 30): Date => {
    return DateUtils.addDays(invoiceDate, paymentTermsDays);
  },
  
  getForecastDate: (baseDate: Date, forecastDays: number): Date => {
    return DateUtils.addDays(baseDate, forecastDays);
  }
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
  }
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
  }
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
      scope: 0.20,
      quality: 0.15,
      risk: 0.10, // inverse weight since lower risk is better
      satisfaction: 0.05
    };
    
    const normalizedRisk = 1 - metrics.risk; // invert risk for scoring
    const score = (
      metrics.schedule * weights.schedule +
      metrics.cost * weights.cost +
      metrics.scope * weights.scope +
      metrics.quality * weights.quality +
      normalizedRisk * weights.risk +
      metrics.satisfaction * weights.satisfaction
    ) * 100;
    
    return Math.round(Math.max(0, Math.min(100, score)));
  },
  
  isOverAllocated: (allocatedHours: number, totalCapacity: number, threshold: number = 0.95): boolean => {
    return allocatedHours > (totalCapacity * threshold);
  },
  
  calculateUtilization: (allocatedHours: number, totalCapacity: number): number => {
    return totalCapacity > 0 ? (allocatedHours / totalCapacity) * 100 : 0;
  }
};

// Business metrics calculation utilities
export const BusinessMetricsUtils = {
  /**
   * Calculate conversion rate as percentage
   */
  calculateConversionRate: (conversions: number, total: number): number => {
    return total > 0 ? (conversions / total) : 0;
  },

  /**
   * Calculate loss reason percentages from counts
   */
  calculateLossReasonPercentages: (lossReasons: Array<{ reason: string; count: number }>): Array<{ reason: string; count: number; percentage: number }> => {
    const totalCount = lossReasons.reduce((sum, reason) => sum + reason.count, 0);
    return lossReasons.map(reason => ({
      ...reason,
      percentage: totalCount > 0 ? FinancialUtils.roundToCents((reason.count / totalCount) * 100) : 0
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
    const competitorLosses = Math.round(totalLosses * (config.competitorLossReasonPercentage / 100));
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
        { reason: 'Product not suitable', count: productLosses }
      ])
    };
  }
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
    weights: { cost: number; speed: number; reliability: number } = { cost: 0.4, speed: 0.4, reliability: 0.2 }
  ): number => {
    return (costScore * weights.cost) + (speedScore * weights.speed) + (reliabilityScore * weights.reliability);
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
  calculateDimensionalWeight: (length: number, width: number, height: number, divisor: number = 139): number => {
    return (length * width * height) / divisor;
  }
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
        variance: Math.round(Math.abs(noise))
      });
    }
    
    return forecastData;
  },

  /**
   * Calculate confidence interval for forecast
   */
  calculateConfidenceInterval: (value: number, confidenceLevel: number = 0.95): { upper: number; lower: number } => {
    const multiplier = confidenceLevel === 0.95 ? 1.96 : (confidenceLevel === 0.99 ? 2.58 : 1.645);
    const margin = value * 0.1 * multiplier; // Assume 10% standard error
    
    return {
      upper: FinancialUtils.roundToCents(value + margin),
      lower: FinancialUtils.roundToCents(Math.max(0, value - margin))
    };
  }
};