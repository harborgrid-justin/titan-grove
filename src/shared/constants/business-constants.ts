/**
 * Centralized Business Constants and Magic Numbers
 * Enterprise-grade configuration for all hard-coded values
 */

// ============================================================================
// FINANCIAL CONSTANTS
// ============================================================================

export const FINANCIAL_CONSTANTS = {
  // Interest rates and percentages  
  DEFAULT_INTEREST_RATE: 0.05, // 5%
  HIGH_RISK_RATE: 0.15, // 15%
  LOW_RISK_RATE: 0.02, // 2%
  
  // Currency and monetary
  DEFAULT_CURRENCY: 'USD',
  MAX_TRANSACTION_AMOUNT: 1000000, // $1M
  MIN_TRANSACTION_AMOUNT: 0.01, // 1 cent
  
  // Credit and scoring
  EXCELLENT_CREDIT_SCORE: 750,
  GOOD_CREDIT_SCORE: 650,
  FAIR_CREDIT_SCORE: 550,
  POOR_CREDIT_SCORE: 450,
  
  // Financial calculations
  DAYS_IN_YEAR: 365,
  MONTHS_IN_YEAR: 12,
  QUARTERS_IN_YEAR: 4,
} as const;

// ============================================================================
// MANUFACTURING CONSTANTS
// ============================================================================

export const MANUFACTURING_CONSTANTS = {
  // Production metrics
  TARGET_OEE: 0.85, // Overall Equipment Effectiveness 85%
  MINIMUM_OEE: 0.60, // 60%
  EXCELLENT_OEE: 0.95, // 95%
  
  // Quality thresholds
  ACCEPTABLE_DEFECT_RATE: 0.01, // 1%
  TARGET_DEFECT_RATE: 0.005, // 0.5%
  CRITICAL_DEFECT_RATE: 0.05, // 5%
  
  // Safety and compliance
  MAX_TEMPERATURE_CELSIUS: 85,
  MIN_TEMPERATURE_CELSIUS: 15,
  MAX_PRESSURE_PSI: 150,
  SAFETY_MARGIN_FACTOR: 1.2,
  
  // Production planning
  DEFAULT_LEAD_TIME_DAYS: 14,
  RUSH_ORDER_MULTIPLIER: 2.0,
  BATCH_SIZE_MINIMUM: 100,
  BATCH_SIZE_OPTIMAL: 1000,
} as const;

// ============================================================================
// PERFORMANCE AND RELIABILITY CONSTANTS
// ============================================================================

export const PERFORMANCE_CONSTANTS = {
  // Response times (milliseconds)
  API_TIMEOUT_MS: 30000, // 30 seconds
  DATABASE_TIMEOUT_MS: 10000, // 10 seconds
  CACHE_TIMEOUT_MS: 5000, // 5 seconds
  
  // Retry and circuit breaker
  MAX_RETRY_ATTEMPTS: 3,
  CIRCUIT_BREAKER_THRESHOLD: 5,
  BACKOFF_MULTIPLIER: 1.5,
  
  // Performance thresholds
  ACCEPTABLE_RESPONSE_TIME_MS: 2000, // 2 seconds
  EXCELLENT_RESPONSE_TIME_MS: 500, // 500ms
  CRITICAL_RESPONSE_TIME_MS: 10000, // 10 seconds
  
  // System health
  HIGH_CPU_THRESHOLD: 0.80, // 80%
  HIGH_MEMORY_THRESHOLD: 0.85, // 85%
  DISK_SPACE_WARNING: 0.90, // 90%
  DISK_SPACE_CRITICAL: 0.95, // 95%
} as const;

// ============================================================================
// BUSINESS METRICS AND THRESHOLDS  
// ============================================================================

export const BUSINESS_METRICS = {
  // Confidence and reliability
  HIGH_CONFIDENCE_THRESHOLD: 0.9, // 90%
  MEDIUM_CONFIDENCE_THRESHOLD: 0.7, // 70%
  LOW_CONFIDENCE_THRESHOLD: 0.5, // 50%
  
  // Risk assessment
  LOW_RISK_SCORE: 0.3, // 30%
  MEDIUM_RISK_SCORE: 0.6, // 60%
  HIGH_RISK_SCORE: 0.8, // 80%
  CRITICAL_RISK_SCORE: 0.95, // 95%
  
  // Customer satisfaction
  EXCELLENT_SATISFACTION: 4.5, // out of 5
  GOOD_SATISFACTION: 3.5,
  POOR_SATISFACTION: 2.5,
  CRITICAL_SATISFACTION: 2.0,
  
  // Operational efficiency
  TARGET_EFFICIENCY: 0.85, // 85%
  MINIMUM_EFFICIENCY: 0.60, // 60%
  EXCELLENT_EFFICIENCY: 0.95, // 95%
} as const;

// ============================================================================
// INVENTORY AND SUPPLY CHAIN CONSTANTS
// ============================================================================

export const INVENTORY_CONSTANTS = {
  // Stock levels
  REORDER_POINT_MULTIPLIER: 1.5,
  SAFETY_STOCK_MULTIPLIER: 2.0,
  MAX_STOCK_MULTIPLIER: 4.0,
  
  // Demand forecasting
  FORECAST_ACCURACY_TARGET: 0.85, // 85%
  SEASONAL_FACTOR_MAX: 2.0,
  TREND_FACTOR_MAX: 1.5,
  
  // Supplier performance
  ON_TIME_DELIVERY_TARGET: 0.95, // 95%
  QUALITY_ACCEPTANCE_TARGET: 0.98, // 98%
  COST_VARIANCE_THRESHOLD: 0.05, // 5%
  
  // Logistics
  MAX_SHIPPING_DAYS: 30,
  STANDARD_SHIPPING_DAYS: 7,
  EXPRESS_SHIPPING_DAYS: 3,
  DAMAGE_RATE_THRESHOLD: 0.02, // 2%
} as const;

// ============================================================================
// HUMAN RESOURCES CONSTANTS
// ============================================================================

export const HR_CONSTANTS = {
  // Performance ratings
  OUTSTANDING_PERFORMANCE: 5,
  EXCEEDS_EXPECTATIONS: 4,
  MEETS_EXPECTATIONS: 3,
  BELOW_EXPECTATIONS: 2,
  UNSATISFACTORY: 1,
  
  // Turnover and retention
  HIGH_TURNOVER_RATE: 0.15, // 15%
  ACCEPTABLE_TURNOVER_RATE: 0.10, // 10%
  LOW_TURNOVER_RATE: 0.05, // 5%
  
  // Training and development
  MIN_TRAINING_HOURS_YEAR: 40,
  RECOMMENDED_TRAINING_HOURS: 80,
  LEADERSHIP_TRAINING_HOURS: 120,
  
  // Compensation
  MERIT_INCREASE_TARGET: 0.03, // 3%
  COST_OF_LIVING_ADJUSTMENT: 0.025, // 2.5%
  BONUS_PERCENTAGE_TARGET: 0.10, // 10%
} as const;

// ============================================================================
// SYSTEM AND TECHNICAL CONSTANTS
// ============================================================================

export const SYSTEM_CONSTANTS = {
  // Pagination and limits
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 1000,
  MIN_PAGE_SIZE: 10,
  
  // File and data limits
  MAX_FILE_SIZE_MB: 50,
  MAX_UPLOAD_SIZE_MB: 100,
  MAX_EXPORT_RECORDS: 100000,
  
  // Cache settings
  DEFAULT_CACHE_TTL_SECONDS: 3600, // 1 hour
  SHORT_CACHE_TTL_SECONDS: 300, // 5 minutes
  LONG_CACHE_TTL_SECONDS: 86400, // 24 hours
  
  // Security
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  MAX_LOGIN_ATTEMPTS: 5,
  ACCOUNT_LOCKOUT_MINUTES: 30,
  SESSION_TIMEOUT_MINUTES: 60,
} as const;

// ============================================================================
// COMPLIANCE AND REGULATORY CONSTANTS
// ============================================================================

export const COMPLIANCE_CONSTANTS = {
  // Data retention (days)
  FINANCIAL_RECORDS_RETENTION: 2555, // 7 years
  EMPLOYEE_RECORDS_RETENTION: 2190, // 6 years  
  AUDIT_LOG_RETENTION: 1095, // 3 years
  SYSTEM_LOG_RETENTION: 365, // 1 year
  
  // Privacy and security
  DATA_ENCRYPTION_KEY_LENGTH: 256,
  PASSWORD_HASH_ROUNDS: 12,
  API_RATE_LIMIT_PER_HOUR: 1000,
  MAX_CONCURRENT_SESSIONS: 5,
  
  // Audit thresholds
  SIGNIFICANT_TRANSACTION_AMOUNT: 10000, // $10K
  LARGE_DATA_EXPORT_THRESHOLD: 10000, // 10K records
  PRIVILEGED_ACCESS_MONITORING: true,
} as const;

// ============================================================================
// COMPOSITE CONSTANTS (derived from base constants)
// ============================================================================

export const DERIVED_CONSTANTS = {
  // Risk scoring matrix
  RISK_MATRIX: {
    LOW: {
      min: 0,
      max: BUSINESS_METRICS.LOW_RISK_SCORE,
      action: 'ACCEPT'
    },
    MEDIUM: {
      min: BUSINESS_METRICS.LOW_RISK_SCORE,
      max: BUSINESS_METRICS.MEDIUM_RISK_SCORE, 
      action: 'MONITOR'
    },
    HIGH: {
      min: BUSINESS_METRICS.MEDIUM_RISK_SCORE,
      max: BUSINESS_METRICS.HIGH_RISK_SCORE,
      action: 'MITIGATE'
    },
    CRITICAL: {
      min: BUSINESS_METRICS.HIGH_RISK_SCORE,
      max: 1.0,
      action: 'IMMEDIATE_ACTION'
    }
  },
  
  // Performance scoring
  PERFORMANCE_BANDS: {
    EXCELLENT: { min: 0.90, color: 'green', status: 'OPTIMAL' },
    GOOD: { min: 0.75, color: 'blue', status: 'ACCEPTABLE' },
    FAIR: { min: 0.60, color: 'yellow', status: 'ATTENTION' },
    POOR: { min: 0.40, color: 'orange', status: 'ACTION_REQUIRED' },
    CRITICAL: { min: 0, color: 'red', status: 'IMMEDIATE_ACTION' }
  }
} as const;

// ============================================================================
// UTILITY FUNCTIONS FOR CONSTANT ACCESS
// ============================================================================

export class BusinessConstants {
  /**
   * Get risk level based on score
   */
  static getRiskLevel(score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    const matrix = DERIVED_CONSTANTS.RISK_MATRIX;
    
    if (score <= matrix.LOW.max) return 'LOW';
    if (score <= matrix.MEDIUM.max) return 'MEDIUM'; 
    if (score <= matrix.HIGH.max) return 'HIGH';
    return 'CRITICAL';
  }

  /**
   * Get performance band based on score
   */
  static getPerformanceBand(score: number) {
    const bands = DERIVED_CONSTANTS.PERFORMANCE_BANDS;
    
    if (score >= bands.EXCELLENT.min) return bands.EXCELLENT;
    if (score >= bands.GOOD.min) return bands.GOOD;
    if (score >= bands.FAIR.min) return bands.FAIR;
    if (score >= bands.POOR.min) return bands.POOR;
    return bands.CRITICAL;
  }

  /**
   * Validate against system limits
   */
  static validateSystemLimits(type: string, value: number): boolean {
    switch (type) {
      case 'pageSize':
        return value >= SYSTEM_CONSTANTS.MIN_PAGE_SIZE && 
               value <= SYSTEM_CONSTANTS.MAX_PAGE_SIZE;
      case 'fileSize':
        return value <= SYSTEM_CONSTANTS.MAX_FILE_SIZE_MB * 1024 * 1024;
      case 'passwordLength':
        return value >= SYSTEM_CONSTANTS.PASSWORD_MIN_LENGTH &&
               value <= SYSTEM_CONSTANTS.PASSWORD_MAX_LENGTH;
      default:
        return true;
    }
  }
}

// Export all constants as a single object for easy access
export const ALL_CONSTANTS = {
  FINANCIAL: FINANCIAL_CONSTANTS,
  MANUFACTURING: MANUFACTURING_CONSTANTS,
  PERFORMANCE: PERFORMANCE_CONSTANTS,
  BUSINESS: BUSINESS_METRICS,
  INVENTORY: INVENTORY_CONSTANTS,
  HR: HR_CONSTANTS,
  SYSTEM: SYSTEM_CONSTANTS,
  COMPLIANCE: COMPLIANCE_CONSTANTS,
  DERIVED: DERIVED_CONSTANTS,
} as const;

export default ALL_CONSTANTS;