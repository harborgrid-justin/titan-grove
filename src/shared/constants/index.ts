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