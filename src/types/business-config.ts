/**
 * Business Configuration Types
 * Centralized configuration for all business logic constants
 */

export interface ConfigureToOrderConfig {
  // Product Configuration Defaults
  defaultBasePrice: number;
  defaultBaseCost: number;
  defaultCostRatio: number; // ratio for calculating costs from prices
  defaultLeadTimeBase: number; // days
  
  // Manufacturing Complexity Thresholds
  standardComplexityMaxOptions: number;
  complexComplexityMaxOptions: number;
  
  // Engineering Configuration
  engineeringHourlyRate: number;
  defaultEngineeringDuration: number; // days
  prototypeDevelopmentDuration: number; // days
  productionPlanningDuration: number; // days
  baseProjectTimeline: number; // days
  
  // Sample lead time calculations
  defaultSampleLeadTime: number; // days
}

export interface CapitalAssetConfig {
  // ROI Analysis Defaults
  roiScenarios: {
    baseCase: {
      probability: number;
    };
    optimistic: {
      probability: number;
    };
    pessimistic: {
      probability: number;
    };
  };
  
  // Budget Allocation Recommendations
  budgetAllocations: {
    productionEquipment: number; // percentage
    regulatoryCompliance: number; // percentage
    digitalTransformation: number; // percentage
  };
  
  // Default Analysis Parameters
  defaultDiscountRate: number;
  defaultAnalysisTimeHorizon: number; // years
}

export interface ManufacturingConfig {
  // BOM Management
  defaultBomComplexity: number;
  
  // Production Defaults
  standardProductionLeadTime: number; // days
  customProductionLeadTime: number; // days
  
  // Cost Management
  materialCostVarianceThreshold: number; // percentage
  laborCostVarianceThreshold: number; // percentage
  
  // Industry 4.0 Configuration
  industry40: {
    iot: {
      defaultSensorLatency: number; // milliseconds
      temperatureSensorLatency: number; // milliseconds
      vibrationSensorLatency: number; // milliseconds
      pressureSensorLatency: number; // milliseconds
    };
  };
  
  // Supply Chain Integration
  integration: {
    dataVolumes: {
      demandPlanningKb: number; // KB per sync
      productionDataKb: number; // KB per minute
      inventoryDataKb: number; // KB
      maintenanceDataKb: number; // KB
    };
    latencies: {
      demandPlanningMs: number; // milliseconds
      productionDataMs: number; // milliseconds
      inventoryDataMs: number; // milliseconds
      maintenanceDataMs: number; // milliseconds
    };
    reliability: {
      demandPlanningPercent: number; // percentage
      productionDataPercent: number; // percentage
      inventoryDataPercent: number; // percentage
      maintenanceDataPercent: number; // percentage
    };
    migrationValue: {
      immediateValue: number; // Cost savings year 1
      strategicValue: number; // 3-year strategic value
      futureValue: number; // 5-year future value
    };
  };
}

export interface MessageQueueConfig {
  // Redis Configuration
  redis: {
    host: string;
    port: number;
    keyPrefix: string;
    retryDelayOnFailover: number;
    maxRetriesPerRequest: number;
    lazyConnect: boolean;
  };
  
  // Job Configuration
  defaultJobOptions: {
    removeOnComplete: number;
    removeOnFail: number;
    attempts: number;
    backoff: {
      type: string;
      delay: number;
    };
  };
  
  // Monitoring Configuration
  monitoring: {
    enabled: boolean;
    metricsRetentionDays: number;
    alertThresholds: {
      queueDepth: number;
      processingTime: number; // milliseconds
      errorRate: number; // decimal (0.1 = 10%)
    };
  };
  
  // Dead Letter Queue
  deadLetterQueue: {
    enabled: boolean;
    maxRetries: number;
    retentionDays: number;
  };
  
  // Clustering
  clustering: {
    enabled: boolean;
    workers: number;
    concurrency: number;
  };
  
  // Dynamic Configuration Values
  dynamicConfig: {
    lowConcurrency: number;
    mediumConcurrency: number;
    highConcurrency: number;
    standardAttempts: number;
    highAttempts: number;
    criticalAttempts: number;
    standardBackoffDelay: number;
    highBackoffDelay: number;
    criticalBackoffDelay: number;
    mediumRetention: number;
    highRetention: number;
    criticalRetention: number;
  };
}

export interface ProjectConfig {
  // Cost Performance Indicators
  costPerformanceThresholds: {
    budgetVarianceAlert: number; // percentage (0.1 = 10%)
    scheduleVarianceAlert: number; // percentage
  };
  
  // Default Billing Rates
  billing: {
    defaultHourlyRate: number;
    overtimeMultiplier: number;
    standardTaxRate: number; // percentage (e.g., 0.08 = 8%)
    paymentTermsDays: number; // standard payment terms in days
  };
  
  // Financial Defaults
  financials: {
    defaultLaborRate: number; // hourly rate for labor calculations
    defaultMaterialCostPerProject: number; // typical material costs
    overheadRatio: number; // overhead as ratio of total cost
    profitMarginTarget: number; // target profit margin ratio
  };
  
  // Performance Metrics
  healthScoreThresholds: {
    schedulePerformanceTarget: number; // 1.0 = on schedule
    costPerformanceTarget: number; // 1.0 = on budget  
    scopeCompletionTarget: number; // ratio target
    qualityMetricsTarget: number; // quality ratio target
    riskScoreThreshold: number; // maximum acceptable risk
    teamSatisfactionTarget: number; // minimum team satisfaction
  };
  
  // Resource Management
  resources: {
    utilizationTarget: number; // target utilization percentage
    overallocationThreshold: number; // threshold for overallocation detection
    capacityBufferRatio: number; // buffer for capacity planning
  };
  
  // Reporting Defaults
  reporting: {
    forecastConfidenceDefault: number; // default confidence level
    reportingPeriodDays: number; // default reporting period
    scheduleVarianceDays: number; // default schedule variance
    budgetVarianceAmount: number; // default budget variance
  };
}

export interface OrderAnalyticsConfig {
  // Credit and Risk Analysis
  defaultCreditUtilization: number; // ratio
  
  // Performance Thresholds
  performanceThresholds: {
    scopeCompletion: number; // ratio (0.65 = 65%)
    qualityScore: number; // ratio
    deliveryPerformance: number; // ratio
  };
}

export interface WarehouseManagementConfig {
  // Operating Hours Configuration
  operatingHours: {
    weekday: {
      startTime: string;
      endTime: string;
      timeZone: string;
    };
    saturday: {
      startTime: string;
      endTime: string;
      timeZone: string;
    };
  };
  
  // Shift Configuration
  shifts: {
    day: {
      startTime: string;
      endTime: string;
      staffCount: number;
    };
    evening: {
      startTime: string;
      endTime: string;
      staffCount: number;
    };
    night: {
      startTime: string;
      endTime: string;
      staffCount: number;
    };
  };
  
  // Storage Area Defaults
  storageAreas: {
    bulk: {
      dimensions: {
        length: number; // feet
        width: number; // feet
        height: number; // feet
      };
      totalPositions: number;
      utilizationRate: number; // percentage
      turnoverRate: number; // times per year
    };
    rack: {
      dimensions: {
        length: number; // feet
        width: number; // feet
        height: number; // feet
      };
      totalPositions: number;
      utilizationRate: number; // percentage
      turnoverRate: number; // times per year
    };
  };
  
  // Dock Door Configuration
  dockDoors: {
    defaultCount: number;
    doorHeight: number; // feet
    doorWidth: number; // feet
    levelingDockDefault: boolean;
  };
}

export interface QuoteManagementConfig {
  // Quote Calculation Settings
  defaultExpirationDays: number;
  shippingRatePerPound: number; // shipping rate per pound
  mockWeightPerItem: number; // pounds per item for calculation
  
  // Approval Thresholds
  approvalThresholdAmount: number; // dollar amount requiring approval
  maxDiscountPercentWithoutApproval: number; // percentage
  
  // Tax and Fees
  standardTaxRate: number; // percentage (e.g., 8.5% = 0.085)
  currencyConversionRate: number; // USD to other currency rate
  
  // Mock Metrics Configuration (for demo/testing)
  mockMetrics: {
    conversionRate: number; // quote to order conversion rate
    averageQuoteToCloseTime: number; // days
    winRate: number; // percentage as decimal
    priceLossReasonPercentage: number; // percentage of losses due to price
    competitorLossReasonPercentage: number; // percentage of losses to competitors
    budgetLossReasonPercentage: number; // percentage of losses to budget constraints
  };
}

export interface OrderPromisingConfig {
  // Lead Time Defaults (in days)
  manufacturingLeadTime: number;
  procurementLeadTime: number;
  itemLeadTime: number;
  
  // Shipping Times by Method (in days)
  standardShippingTime: number;
  expressShippingTime: number;
  overnightShippingTime: number;
  
  // Buffer Days by Priority
  lowPriorityBufferDays: number;
  mediumPriorityBufferDays: number;
  highPriorityBufferDays: number;
  
  // Confidence Levels
  minConfidenceLevel: number; // minimum confidence (0.1 = 10%)
  maxConfidenceLevel: number; // maximum confidence (1.0 = 100%)
}

export interface ProcurementConfig {
  // Supplier Scoring Thresholds
  supplierQualityThreshold: number; // minimum quality score (0-100)
  supplierDeliveryThreshold: number; // minimum delivery performance (0-100)
  supplierCostThreshold: number; // minimum cost competitiveness (0-100)
  
  // Purchase Order Limits
  poApprovalThreshold: number; // dollar amount requiring approval
  maxPoValueWithoutApproval: number;
  
  // RFQ Configuration
  rfqResponseTimeoutDays: number; // days to wait for RFQ responses
  minSuppliersForRfq: number; // minimum suppliers required for RFQ
  
  // Contract Management
  contractRenewalNotificationDays: number; // days before contract expiry
  contractValueReviewThreshold: number; // dollar threshold for contract review
}

export interface PricingEngineConfig {
  // Mock Pricing Data (for demo/testing)
  mockPricing: {
    defaultListPrice: number;
    defaultMinPrice: number;
    defaultCost: number;
    defaultMarginPercent: number;
    priceBreaks: {
      tier1MinQuantity: number;
      tier1UnitPrice: number;
      tier2MinQuantity: number;
      tier2UnitPrice: number;
      tier3MinQuantity: number;
      tier3UnitPrice: number;
    };
  };
  
  // Pricing Rules
  maxDiscountPercent: number; // maximum discount allowed without approval
  minMarginPercent: number; // minimum margin required
  defaultMarkupMultiplier: number; // default markup from cost to price
}

export interface BusinessConfig {
  configureToOrder: ConfigureToOrderConfig;
  capitalAsset: CapitalAssetConfig;
  manufacturing: ManufacturingConfig;
  messageQueue: MessageQueueConfig;
  project: ProjectConfig;
  orderAnalytics: OrderAnalyticsConfig;
  warehouseManagement: WarehouseManagementConfig;
  quoteManagement: QuoteManagementConfig;
  orderPromising: OrderPromisingConfig;
  procurement: ProcurementConfig;
  pricingEngine: PricingEngineConfig;
}

// Extended Titan Configuration including business settings
export interface ExtendedTitanConfig {
  database: import('./index').DatabaseConfig;
  server: import('./index').ServerConfig;
  cache?: import('./index').CacheConfig;
  analytics?: import('./index').AnalyticsConfig;
  cluster?: import('./index').ClusterConfig;
  logging?: {
    level: 'error' | 'warn' | 'info' | 'debug';
    format: 'json' | 'simple';
  };
  business: BusinessConfig;
}