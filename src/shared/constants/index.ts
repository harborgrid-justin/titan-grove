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