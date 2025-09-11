/**
 * Business Validation Utilities
 * Common validation patterns used across business modules
 */

// Validation utilities for business entities
export const ValidationUtils = {
  // Financial validations
  isValidAmount: (amount: number): boolean => {
    return typeof amount === 'number' && amount >= 0 && isFinite(amount);
  },

  isValidPercentage: (value: number): boolean => {
    return typeof value === 'number' && value >= 0 && value <= 100;
  },

  isValidRatio: (ratio: number): boolean => {
    return typeof ratio === 'number' && ratio >= 0 && ratio <= 1;
  },

  // Date validations
  isValidDateRange: (startDate: Date, endDate: Date): boolean => {
    return startDate instanceof Date && endDate instanceof Date && startDate <= endDate;
  },

  isFutureDate: (date: Date): boolean => {
    return date instanceof Date && date > new Date();
  },

  // Business entity validations
  isValidProjectStatus: (status: string): boolean => {
    const validStatuses = ['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED'];
    return validStatuses.includes(status);
  },

  isValidPriority: (priority: string): boolean => {
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    return validPriorities.includes(priority);
  },

  // String validations
  isNonEmptyString: (value: string): boolean => {
    return typeof value === 'string' && value.trim().length > 0;
  },

  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // ID validations
  isValidId: (id: string): boolean => {
    return typeof id === 'string' && id.trim().length > 0;
  },

  // Threshold validations for performance metrics
  isWithinThreshold: (actual: number, target: number, thresholdPercent: number): boolean => {
    const variance = Math.abs(actual - target) / target;
    return variance <= thresholdPercent / 100;
  },
};

// Error message generators for consistent error handling
export const ErrorMessages = {
  INVALID_AMOUNT: (field: string) => `${field} must be a valid positive number`,
  INVALID_PERCENTAGE: (field: string) => `${field} must be between 0 and 100`,
  INVALID_RATIO: (field: string) => `${field} must be between 0 and 1`,
  INVALID_DATE_RANGE: 'End date must be after start date',
  INVALID_FUTURE_DATE: (field: string) => `${field} must be a future date`,
  REQUIRED_FIELD: (field: string) => `${field} is required`,
  INVALID_STATUS: (field: string, validValues: string[]) =>
    `${field} must be one of: ${validValues.join(', ')}`,
  INVALID_EMAIL: 'Must be a valid email address',
  THRESHOLD_EXCEEDED: (field: string, threshold: number) =>
    `${field} exceeds acceptable threshold of ${threshold}%`,
};

// Business rule validators
export const BusinessRules = {
  // Project management rules
  validateProjectBudget: (
    budget: number,
    actualCost: number = 0
  ): { valid: boolean; message?: string } => {
    if (!ValidationUtils.isValidAmount(budget)) {
      return { valid: false, message: ErrorMessages.INVALID_AMOUNT('Budget') };
    }
    if (actualCost > budget * 1.2) {
      // 20% over budget threshold
      return { valid: false, message: 'Actual cost exceeds budget by more than 20%' };
    }
    return { valid: true };
  },

  // Resource allocation rules
  validateResourceAllocation: (allocation: number): { valid: boolean; message?: string } => {
    if (!ValidationUtils.isValidPercentage(allocation)) {
      return { valid: false, message: ErrorMessages.INVALID_PERCENTAGE('Resource allocation') };
    }
    if (allocation > 100) {
      return { valid: false, message: 'Resource allocation cannot exceed 100%' };
    }
    return { valid: true };
  },

  // Financial performance rules
  validateProfitMargin: (
    revenue: number,
    costs: number
  ): { valid: boolean; message?: string; margin: number } => {
    if (!ValidationUtils.isValidAmount(revenue) || !ValidationUtils.isValidAmount(costs)) {
      return { valid: false, message: 'Revenue and costs must be valid amounts', margin: 0 };
    }
    if (revenue === 0) {
      return { valid: false, message: 'Revenue cannot be zero', margin: 0 };
    }
    const margin = (revenue - costs) / revenue;
    return { valid: true, margin };
  },
};
