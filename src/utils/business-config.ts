import * as Joi from 'joi';
import { ExtendedTitanConfig, BusinessConfig } from '../types/business-config';

// Business configuration schema with production-grade defaults
const businessConfigSchema = Joi.object({
  configureToOrder: Joi.object({
    // Product Configuration Defaults
    defaultBasePrice: Joi.number().default(1000),
    defaultBaseCost: Joi.number().default(650),
    defaultCostRatio: Joi.number().min(0).max(1).default(0.65),
    defaultLeadTimeBase: Joi.number().default(14),
    
    // Manufacturing Complexity Thresholds
    standardComplexityMaxOptions: Joi.number().default(3),
    complexComplexityMaxOptions: Joi.number().default(8),
    
    // Engineering Configuration
    engineeringHourlyRate: Joi.number().default(150),
    defaultEngineeringDuration: Joi.number().default(15),
    prototypeDevelopmentDuration: Joi.number().default(10),
    productionPlanningDuration: Joi.number().default(5),
    baseProjectTimeline: Joi.number().default(30),
    
    // Sample lead time calculations
    defaultSampleLeadTime: Joi.number().default(7),
  }).default(),
  
  capitalAsset: Joi.object({
    // ROI Analysis Defaults
    roiScenarios: Joi.object({
      baseCase: Joi.object({
        probability: Joi.number().min(0).max(100).default(60),
      }).default(),
      optimistic: Joi.object({
        probability: Joi.number().min(0).max(100).default(20),
      }).default(),
      pessimistic: Joi.object({
        probability: Joi.number().min(0).max(100).default(20),
      }).default(),
    }).default(),
    
    // Budget Allocation Recommendations
    budgetAllocations: Joi.object({
      productionEquipment: Joi.number().min(0).max(100).default(40),
      regulatoryCompliance: Joi.number().min(0).max(100).default(20),
      digitalTransformation: Joi.number().min(0).max(100).default(15),
    }).default(),
    
    // Default Analysis Parameters
    defaultDiscountRate: Joi.number().min(0).default(0.08), // 8%
    defaultAnalysisTimeHorizon: Joi.number().default(5),
  }).default(),
  
  manufacturing: Joi.object({
    // BOM Management
    defaultBomComplexity: Joi.number().min(0).max(1).default(0.65),
    
    // Production Defaults
    standardProductionLeadTime: Joi.number().default(7),
    customProductionLeadTime: Joi.number().default(21),
    
    // Cost Management
    materialCostVarianceThreshold: Joi.number().min(0).default(10), // 10%
    laborCostVarianceThreshold: Joi.number().min(0).default(15), // 15%
    
    // Industry 4.0 Configuration
    industry40: Joi.object({
      iot: Joi.object({
        defaultSensorLatency: Joi.number().default(125), // milliseconds
        temperatureSensorLatency: Joi.number().default(12), // milliseconds
        vibrationSensorLatency: Joi.number().default(18), // milliseconds
        pressureSensorLatency: Joi.number().default(8), // milliseconds
      }).default(),
    }).default(),
    
    // Supply Chain Integration
    integration: Joi.object({
      dataVolumes: Joi.object({
        demandPlanningKb: Joi.number().default(1547), // KB per sync
        productionDataKb: Joi.number().default(2847), // KB per minute
        inventoryDataKb: Joi.number().default(256), // KB
        maintenanceDataKb: Joi.number().default(125), // KB
      }).default(),
      latencies: Joi.object({
        demandPlanningMs: Joi.number().default(150), // milliseconds
        productionDataMs: Joi.number().default(12), // milliseconds
        inventoryDataMs: Joi.number().default(180), // milliseconds
        maintenanceDataMs: Joi.number().default(35), // milliseconds
      }).default(),
      reliability: Joi.object({
        demandPlanningPercent: Joi.number().min(0).max(100).default(98.5), // percentage
        productionDataPercent: Joi.number().min(0).max(100).default(98.9), // percentage
        inventoryDataPercent: Joi.number().min(0).max(100).default(99.2), // percentage
        maintenanceDataPercent: Joi.number().min(0).max(100).default(97.8), // percentage
      }).default(),
      migrationValue: Joi.object({
        immediateValue: Joi.number().default(2500000), // Cost savings year 1
        strategicValue: Joi.number().default(8750000), // 3-year strategic value
        futureValue: Joi.number().default(15000000), // 5-year future value
      }).default(),
    }).default(),
  }).default(),
  
  warehouseManagement: Joi.object({
    // Operating Hours Configuration
    operatingHours: Joi.object({
      weekday: Joi.object({
        startTime: Joi.string().default('08:00'),
        endTime: Joi.string().default('17:00'),
        timeZone: Joi.string().default('EST'),
      }).default(),
      saturday: Joi.object({
        startTime: Joi.string().default('09:00'),
        endTime: Joi.string().default('13:00'),
        timeZone: Joi.string().default('EST'),
      }).default(),
    }).default(),
    
    // Shift Configuration
    shifts: Joi.object({
      day: Joi.object({
        startTime: Joi.string().default('08:00'),
        endTime: Joi.string().default('16:00'),
        staffCount: Joi.number().default(30),
      }).default(),
      evening: Joi.object({
        startTime: Joi.string().default('16:00'),
        endTime: Joi.string().default('24:00'),
        staffCount: Joi.number().default(15),
      }).default(),
      night: Joi.object({
        startTime: Joi.string().default('00:00'),
        endTime: Joi.string().default('08:00'),
        staffCount: Joi.number().default(5),
      }).default(),
    }).default(),
    
    // Storage Area Defaults
    storageAreas: Joi.object({
      bulk: Joi.object({
        dimensions: Joi.object({
          length: Joi.number().default(200), // feet
          width: Joi.number().default(100), // feet
          height: Joi.number().default(30), // feet
        }).default(),
        totalPositions: Joi.number().default(1000),
        utilizationRate: Joi.number().min(0).max(100).default(80), // percentage
        turnoverRate: Joi.number().default(12), // times per year
      }).default(),
      rack: Joi.object({
        dimensions: Joi.object({
          length: Joi.number().default(300), // feet
          width: Joi.number().default(150), // feet
          height: Joi.number().default(25), // feet
        }).default(),
        totalPositions: Joi.number().default(2000),
        utilizationRate: Joi.number().min(0).max(100).default(75), // percentage
        turnoverRate: Joi.number().default(24), // times per year
      }).default(),
    }).default(),
    
    // Dock Door Configuration
    dockDoors: Joi.object({
      defaultCount: Joi.number().default(10),
      doorHeight: Joi.number().default(9), // feet
      doorWidth: Joi.number().default(8), // feet
      levelingDockDefault: Joi.boolean().default(true),
    }).default(),
  }).default(),
  
  messageQueue: Joi.object({
    // Redis Configuration
    redis: Joi.object({
      host: Joi.string().default('localhost'),
      port: Joi.number().default(6379),
      keyPrefix: Joi.string().default('titan-grove:'),
      retryDelayOnFailover: Joi.number().default(1000),
      maxRetriesPerRequest: Joi.number().default(3),
      lazyConnect: Joi.boolean().default(true),
    }).default(),
    
    // Job Configuration
    defaultJobOptions: Joi.object({
      removeOnComplete: Joi.number().default(100),
      removeOnFail: Joi.number().default(50),
      attempts: Joi.number().default(3),
      backoff: Joi.object({
        type: Joi.string().default('exponential'),
        delay: Joi.number().default(2000),
      }).default(),
    }).default(),
    
    // Monitoring Configuration
    monitoring: Joi.object({
      enabled: Joi.boolean().default(true),
      metricsRetentionDays: Joi.number().default(7),
      alertThresholds: Joi.object({
        queueDepth: Joi.number().default(1000),
        processingTime: Joi.number().default(30000),
        errorRate: Joi.number().min(0).max(1).default(0.1),
      }).default(),
    }).default(),
    
    // Dead Letter Queue
    deadLetterQueue: Joi.object({
      enabled: Joi.boolean().default(true),
      maxRetries: Joi.number().default(5),
      retentionDays: Joi.number().default(30),
    }).default(),
    
    // Clustering
    clustering: Joi.object({
      enabled: Joi.boolean().default(false),
      workers: Joi.number().default(4),
      concurrency: Joi.number().default(10),
    }).default(),
    
    // Dynamic Configuration Values
    dynamicConfig: Joi.object({
      lowConcurrency: Joi.number().default(5),
      mediumConcurrency: Joi.number().default(10),
      highConcurrency: Joi.number().default(20),
      standardAttempts: Joi.number().default(2),
      highAttempts: Joi.number().default(3),
      criticalAttempts: Joi.number().default(5),
      standardBackoffDelay: Joi.number().default(1000),
      highBackoffDelay: Joi.number().default(1500),
      criticalBackoffDelay: Joi.number().default(2000),
      mediumRetention: Joi.number().default(100),
      highRetention: Joi.number().default(200),
      criticalRetention: Joi.number().default(500),
    }).default(),
  }).default(),
  
  project: Joi.object({
    // Cost Performance Indicators
    costPerformanceThresholds: Joi.object({
      budgetVarianceAlert: Joi.number().min(0).default(0.1), // 10%
      scheduleVarianceAlert: Joi.number().min(0).default(0.15), // 15%
    }).default(),
    
    // Default Billing Rates
    billing: Joi.object({
      defaultHourlyRate: Joi.number().default(125),
      overtimeMultiplier: Joi.number().default(1.5),
      standardTaxRate: Joi.number().min(0).max(1).default(0.08), // 8%
      paymentTermsDays: Joi.number().default(30), // Net 30
    }).default(),
    
    // Financial Defaults
    financials: Joi.object({
      defaultLaborRate: Joi.number().default(150), // hourly rate
      defaultMaterialCostPerProject: Joi.number().default(5000),
      overheadRatio: Joi.number().min(0).default(0.15), // 15% overhead
      profitMarginTarget: Joi.number().min(0).default(0.29), // 29% margin
    }).default(),
    
    // Performance Metrics
    healthScoreThresholds: Joi.object({
      schedulePerformanceTarget: Joi.number().default(0.95),
      costPerformanceTarget: Joi.number().default(1.02),
      scopeCompletionTarget: Joi.number().min(0).max(1).default(0.65),
      qualityMetricsTarget: Joi.number().min(0).max(1).default(0.92),
      riskScoreThreshold: Joi.number().min(0).max(1).default(0.15),
      teamSatisfactionTarget: Joi.number().min(0).max(1).default(0.88),
    }).default(),
    
    // Resource Management
    resources: Joi.object({
      utilizationTarget: Joi.number().min(0).max(100).default(78), // 78%
      overallocationThreshold: Joi.number().min(0).max(1).default(0.95), // 95%
      capacityBufferRatio: Joi.number().min(0).default(0.15), // 15% buffer
    }).default(),
    
    // Reporting Defaults
    reporting: Joi.object({
      forecastConfidenceDefault: Joi.number().min(0).max(1).default(0.85),
      reportingPeriodDays: Joi.number().default(45),
      scheduleVarianceDays: Joi.number().default(5),
      budgetVarianceAmount: Joi.number().default(7000),
    }).default(),
  }).default(),
  
  orderAnalytics: Joi.object({
    // Credit and Risk Analysis
    defaultCreditUtilization: Joi.number().min(0).max(1).default(0.65),
    
    // Performance Thresholds
    performanceThresholds: Joi.object({
      scopeCompletion: Joi.number().min(0).max(1).default(0.65),
      qualityScore: Joi.number().min(0).max(1).default(0.85),
      deliveryPerformance: Joi.number().min(0).max(1).default(0.90),
    }).default(),
  }).default(),
  
  quoteManagement: Joi.object({
    // Quote Calculation Settings
    defaultExpirationDays: Joi.number().default(30),
    shippingRatePerPound: Joi.number().default(5.50),
    mockWeightPerItem: Joi.number().default(2), // pounds per item
    
    // Approval Thresholds
    approvalThresholdAmount: Joi.number().default(10000),
    maxDiscountPercentWithoutApproval: Joi.number().min(0).max(100).default(15),
    
    // Tax and Fees
    standardTaxRate: Joi.number().min(0).max(1).default(0.085), // 8.5%
    currencyConversionRate: Joi.number().default(1.25), // USD to other currency
    
    // Mock Metrics Configuration
    mockMetrics: Joi.object({
      conversionRate: Joi.number().min(0).max(1).default(0.32), // 32%
      averageQuoteToCloseTime: Joi.number().default(18.5), // days
      winRate: Joi.number().min(0).max(1).default(0.28), // 28%
      priceLossReasonPercentage: Joi.number().min(0).max(100).default(34.8),
      competitorLossReasonPercentage: Joi.number().min(0).max(100).default(27.3),
      budgetLossReasonPercentage: Joi.number().min(0).max(100).default(18.2),
    }).default(),
  }).default(),
  
  orderPromising: Joi.object({
    // Lead Time Defaults (in days)
    manufacturingLeadTime: Joi.number().default(10),
    procurementLeadTime: Joi.number().default(7),
    itemLeadTime: Joi.number().default(5),
    
    // Shipping Times by Method (in days)
    standardShippingTime: Joi.number().default(10),
    expressShippingTime: Joi.number().default(7),
    overnightShippingTime: Joi.number().default(1),
    
    // Buffer Days by Priority
    lowPriorityBufferDays: Joi.number().default(3),
    mediumPriorityBufferDays: Joi.number().default(2),
    highPriorityBufferDays: Joi.number().default(1),
    
    // Confidence Levels
    minConfidenceLevel: Joi.number().min(0).max(1).default(0.1), // 10%
    maxConfidenceLevel: Joi.number().min(0).max(1).default(1.0), // 100%
  }).default(),
  
  procurement: Joi.object({
    // Supplier Scoring Thresholds
    supplierQualityThreshold: Joi.number().min(0).max(100).default(70),
    supplierDeliveryThreshold: Joi.number().min(0).max(100).default(80),
    supplierCostThreshold: Joi.number().min(0).max(100).default(75),
    
    // Purchase Order Limits
    poApprovalThreshold: Joi.number().default(5000),
    maxPoValueWithoutApproval: Joi.number().default(50000),
    
    // RFQ Configuration
    rfqResponseTimeoutDays: Joi.number().default(14),
    minSuppliersForRfq: Joi.number().default(3),
    
    // Contract Management
    contractRenewalNotificationDays: Joi.number().default(90),
    contractValueReviewThreshold: Joi.number().default(100000),
  }).default(),
  
  pricingEngine: Joi.object({
    // Mock Pricing Data
    mockPricing: Joi.object({
      defaultListPrice: Joi.number().default(100.00),
      defaultMinPrice: Joi.number().default(80.00),
      defaultCost: Joi.number().default(60.00),
      defaultMarginPercent: Joi.number().default(40.0),
      priceBreaks: Joi.object({
        tier1MinQuantity: Joi.number().default(10),
        tier1UnitPrice: Joi.number().default(95.00),
        tier2MinQuantity: Joi.number().default(50),
        tier2UnitPrice: Joi.number().default(90.00),
        tier3MinQuantity: Joi.number().default(100),
        tier3UnitPrice: Joi.number().default(85.00),
      }).default(),
    }).default(),
    
    // Pricing Rules
    maxDiscountPercent: Joi.number().min(0).max(100).default(20), // 20% max discount
    minMarginPercent: Joi.number().min(0).default(15), // 15% minimum margin
    defaultMarkupMultiplier: Joi.number().default(1.67), // 67% markup from cost
  }).default(),
  
  shipping: Joi.object({
    // Carrier scoring weights
    carrierScoring: Joi.object({
      costWeight: Joi.number().min(0).max(1).default(0.4), // 40%
      speedWeight: Joi.number().min(0).max(1).default(0.4), // 40%
      reliabilityWeight: Joi.number().min(0).max(1).default(0.2), // 20%
    }).default(),
    
    // Insurance and fees
    defaultInsuranceRate: Joi.number().min(0).default(0.005), // 0.5%
    dimensionalWeightDivisor: Joi.number().default(139),
    
    // Mock shipping rates
    mockRates: Joi.object({
      baseShippingCost: Joi.number().default(15.00),
      expressShippingMultiplier: Joi.number().default(1.5),
      overnightShippingMultiplier: Joi.number().default(3.0),
    }).default(),
  }).default(),
  
  forecasting: Joi.object({
    // Forecasting parameters
    defaultForecastPeriods: Joi.number().default(12), // 12 months
    seasonalAmplitude: Joi.number().default(200),
    seasonalFrequency: Joi.number().default(0.5),
    trendGrowthRate: Joi.number().default(50),
    
    // Variance and confidence intervals
    forecastVarianceBounds: Joi.object({
      upperMultiplier: Joi.number().default(1.2), // 20% above
      lowerMultiplier: Joi.number().default(0.8), // 20% below
    }).default(),
    
    // Mock forecasting data
    mockForecasting: Joi.object({
      baseOrderValue: Joi.number().default(1000),
      standardError: Joi.number().min(0).max(1).default(0.1), // 10%
    }).default(),
  }).default(),
});

// Extended configuration schema including existing + business config
const extendedConfigSchema = Joi.object({
  database: Joi.object({
    type: Joi.string().valid('postgresql', 'mysql', 'sqlite', 'mongodb', 'redis').required(),
    host: Joi.string().when('type', {
      is: Joi.string().valid('postgresql', 'mysql', 'mongodb', 'redis'),
      then: Joi.string().default('localhost'),
      otherwise: Joi.string().optional(),
    }),
    port: Joi.number().when('type', {
      is: 'postgresql',
      then: Joi.number().default(5432),
      otherwise: Joi.when('type', {
        is: 'mysql',
        then: Joi.number().default(3306),
        otherwise: Joi.when('type', {
          is: 'mongodb',
          then: Joi.number().default(27017),
          otherwise: Joi.when('type', {
            is: 'redis',
            then: Joi.number().default(6379),
            otherwise: Joi.number().optional(),
          }),
        }),
      }),
    }),
    database: Joi.string().when('type', {
      is: 'sqlite',
      then: Joi.string().default(':memory:'),
      otherwise: Joi.string().required(),
    }),
    username: Joi.string().when('type', {
      is: Joi.string().valid('postgresql', 'mysql'),
      then: Joi.string().required(),
      otherwise: Joi.string().optional(),
    }),
    password: Joi.string().when('type', {
      is: Joi.string().valid('postgresql', 'mysql'),
      then: Joi.string().required(),
      otherwise: Joi.string().optional(),
    }),
    url: Joi.string().optional(),
    ssl: Joi.alternatives([Joi.boolean(), Joi.object()]).default(false),
    pool: Joi.object({
      min: Joi.number().default(2),
      max: Joi.number().default(10),
      idleTimeout: Joi.number().default(30000),
    }).default(),
    migrations: Joi.object({
      directory: Joi.string().default('./migrations'),
      tableName: Joi.string().default('migrations'),
    }).default(),
  }).required(),

  server: Joi.object({
    port: Joi.number().default(3000),
    host: Joi.string().default('localhost'),
    cors: Joi.object({
      origin: Joi.alternatives([
        Joi.string(),
        Joi.array().items(Joi.string()),
        Joi.boolean(),
      ]).default('*'),
      credentials: Joi.boolean().default(false),
    }).default(),
    rateLimit: Joi.object({
      windowMs: Joi.number().default(15 * 60 * 1000), // 15 minutes
      max: Joi.number().default(100),
    }).default(),
    compression: Joi.boolean().default(true),
    security: Joi.object({
      helmet: Joi.boolean().default(true),
      jwt: Joi.object({
        secret: Joi.string().required(),
        expiresIn: Joi.string().default('1h'),
      }).optional(),
    }).default(),
  }).required(),

  cache: Joi.object({
    type: Joi.string().valid('memory', 'redis', 'memcached').default('memory'),
    host: Joi.string().when('type', {
      is: Joi.string().valid('redis', 'memcached'),
      then: Joi.string().default('localhost'),
      otherwise: Joi.string().optional(),
    }),
    port: Joi.number().when('type', {
      is: 'redis',
      then: Joi.number().default(6379),
      otherwise: Joi.when('type', {
        is: 'memcached',
        then: Joi.number().default(11211),
        otherwise: Joi.number().optional(),
      }),
    }),
    ttl: Joi.number().default(300), // 5 minutes
    maxKeys: Joi.number().default(1000),
  }).optional(),

  analytics: Joi.object({
    enabled: Joi.boolean().default(false),
    elasticsearch: Joi.object({
      host: Joi.string().required(),
      port: Joi.number().default(9200),
      index: Joi.string().default('titan-analytics'),
    }).when('enabled', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    metrics: Joi.object({
      enabled: Joi.boolean().default(true),
      interval: Joi.number().default(60000), // 1 minute
    }).default(),
  }).optional(),

  cluster: Joi.object({
    enabled: Joi.boolean().default(false),
    workers: Joi.number().default(require('os').cpus().length),
    gracefulTimeout: Joi.number().default(5000),
  }).optional(),

  logging: Joi.object({
    level: Joi.string().valid('error', 'warn', 'info', 'debug').default('info'),
    format: Joi.string().valid('json', 'simple').default('simple'),
  }).default(),
  
  // Business configuration
  business: businessConfigSchema.required(),
});

export function validateExtendedConfig(config: any): ExtendedTitanConfig {
  const { error, value } = extendedConfigSchema.validate(config, {
    allowUnknown: false,
    stripUnknown: true,
  });

  if (error) {
    throw new Error(`Invalid configuration: ${error.message}`);
  }

  return value as ExtendedTitanConfig;
}

export function loadBusinessConfig(): BusinessConfig {
  // Load business configuration from environment variables with fallbacks
  const config = {
    configureToOrder: {
      defaultBasePrice: process.env.CTO_DEFAULT_BASE_PRICE 
        ? parseInt(process.env.CTO_DEFAULT_BASE_PRICE, 10) 
        : undefined,
      defaultBaseCost: process.env.CTO_DEFAULT_BASE_COST
        ? parseInt(process.env.CTO_DEFAULT_BASE_COST, 10)
        : undefined,
      defaultCostRatio: process.env.CTO_DEFAULT_COST_RATIO
        ? parseFloat(process.env.CTO_DEFAULT_COST_RATIO)
        : undefined,
      defaultLeadTimeBase: process.env.CTO_DEFAULT_LEAD_TIME_BASE
        ? parseInt(process.env.CTO_DEFAULT_LEAD_TIME_BASE, 10)
        : undefined,
      standardComplexityMaxOptions: process.env.CTO_STANDARD_COMPLEXITY_MAX_OPTIONS
        ? parseInt(process.env.CTO_STANDARD_COMPLEXITY_MAX_OPTIONS, 10)
        : undefined,
      complexComplexityMaxOptions: process.env.CTO_COMPLEX_COMPLEXITY_MAX_OPTIONS
        ? parseInt(process.env.CTO_COMPLEX_COMPLEXITY_MAX_OPTIONS, 10)
        : undefined,
      engineeringHourlyRate: process.env.CTO_ENGINEERING_HOURLY_RATE
        ? parseInt(process.env.CTO_ENGINEERING_HOURLY_RATE, 10)
        : undefined,
    },
    capitalAsset: {
      roiScenarios: {
        baseCase: {
          probability: process.env.CAM_ROI_BASE_CASE_PROBABILITY
            ? parseInt(process.env.CAM_ROI_BASE_CASE_PROBABILITY, 10)
            : undefined,
        },
        optimistic: {
          probability: process.env.CAM_ROI_OPTIMISTIC_PROBABILITY
            ? parseInt(process.env.CAM_ROI_OPTIMISTIC_PROBABILITY, 10)
            : undefined,
        },
        pessimistic: {
          probability: process.env.CAM_ROI_PESSIMISTIC_PROBABILITY
            ? parseInt(process.env.CAM_ROI_PESSIMISTIC_PROBABILITY, 10)
            : undefined,
        },
      },
      budgetAllocations: {
        productionEquipment: process.env.CAM_BUDGET_PRODUCTION_EQUIPMENT
          ? parseInt(process.env.CAM_BUDGET_PRODUCTION_EQUIPMENT, 10)
          : undefined,
        regulatoryCompliance: process.env.CAM_BUDGET_REGULATORY_COMPLIANCE
          ? parseInt(process.env.CAM_BUDGET_REGULATORY_COMPLIANCE, 10)
          : undefined,
        digitalTransformation: process.env.CAM_BUDGET_DIGITAL_TRANSFORMATION
          ? parseInt(process.env.CAM_BUDGET_DIGITAL_TRANSFORMATION, 10)
          : undefined,
      },
    },
    manufacturing: {
      defaultBomComplexity: process.env.MFG_DEFAULT_BOM_COMPLEXITY
        ? parseFloat(process.env.MFG_DEFAULT_BOM_COMPLEXITY)
        : undefined,
      industry40: {
        iot: {
          defaultSensorLatency: process.env.MFG_INDUSTRY40_DEFAULT_SENSOR_LATENCY
            ? parseInt(process.env.MFG_INDUSTRY40_DEFAULT_SENSOR_LATENCY, 10)
            : undefined,
          temperatureSensorLatency: process.env.MFG_INDUSTRY40_TEMPERATURE_SENSOR_LATENCY
            ? parseInt(process.env.MFG_INDUSTRY40_TEMPERATURE_SENSOR_LATENCY, 10)
            : undefined,
          vibrationSensorLatency: process.env.MFG_INDUSTRY40_VIBRATION_SENSOR_LATENCY
            ? parseInt(process.env.MFG_INDUSTRY40_VIBRATION_SENSOR_LATENCY, 10)
            : undefined,
          pressureSensorLatency: process.env.MFG_INDUSTRY40_PRESSURE_SENSOR_LATENCY
            ? parseInt(process.env.MFG_INDUSTRY40_PRESSURE_SENSOR_LATENCY, 10)
            : undefined,
        },
      },
      integration: {
        dataVolumes: {
          demandPlanningKb: process.env.MFG_INTEGRATION_DEMAND_PLANNING_KB
            ? parseInt(process.env.MFG_INTEGRATION_DEMAND_PLANNING_KB, 10)
            : undefined,
          productionDataKb: process.env.MFG_INTEGRATION_PRODUCTION_DATA_KB
            ? parseInt(process.env.MFG_INTEGRATION_PRODUCTION_DATA_KB, 10)
            : undefined,
          inventoryDataKb: process.env.MFG_INTEGRATION_INVENTORY_DATA_KB
            ? parseInt(process.env.MFG_INTEGRATION_INVENTORY_DATA_KB, 10)
            : undefined,
          maintenanceDataKb: process.env.MFG_INTEGRATION_MAINTENANCE_DATA_KB
            ? parseInt(process.env.MFG_INTEGRATION_MAINTENANCE_DATA_KB, 10)
            : undefined,
        },
        latencies: {
          demandPlanningMs: process.env.MFG_INTEGRATION_DEMAND_PLANNING_MS
            ? parseInt(process.env.MFG_INTEGRATION_DEMAND_PLANNING_MS, 10)
            : undefined,
          productionDataMs: process.env.MFG_INTEGRATION_PRODUCTION_DATA_MS
            ? parseInt(process.env.MFG_INTEGRATION_PRODUCTION_DATA_MS, 10)
            : undefined,
          inventoryDataMs: process.env.MFG_INTEGRATION_INVENTORY_DATA_MS
            ? parseInt(process.env.MFG_INTEGRATION_INVENTORY_DATA_MS, 10)
            : undefined,
          maintenanceDataMs: process.env.MFG_INTEGRATION_MAINTENANCE_DATA_MS
            ? parseInt(process.env.MFG_INTEGRATION_MAINTENANCE_DATA_MS, 10)
            : undefined,
        },
        reliability: {
          demandPlanningPercent: process.env.MFG_INTEGRATION_DEMAND_PLANNING_RELIABILITY
            ? parseFloat(process.env.MFG_INTEGRATION_DEMAND_PLANNING_RELIABILITY)
            : undefined,
          productionDataPercent: process.env.MFG_INTEGRATION_PRODUCTION_DATA_RELIABILITY
            ? parseFloat(process.env.MFG_INTEGRATION_PRODUCTION_DATA_RELIABILITY)
            : undefined,
          inventoryDataPercent: process.env.MFG_INTEGRATION_INVENTORY_DATA_RELIABILITY
            ? parseFloat(process.env.MFG_INTEGRATION_INVENTORY_DATA_RELIABILITY)
            : undefined,
          maintenanceDataPercent: process.env.MFG_INTEGRATION_MAINTENANCE_DATA_RELIABILITY
            ? parseFloat(process.env.MFG_INTEGRATION_MAINTENANCE_DATA_RELIABILITY)
            : undefined,
        },
        migrationValue: {
          immediateValue: process.env.MFG_INTEGRATION_IMMEDIATE_VALUE
            ? parseInt(process.env.MFG_INTEGRATION_IMMEDIATE_VALUE, 10)
            : undefined,
          strategicValue: process.env.MFG_INTEGRATION_STRATEGIC_VALUE
            ? parseInt(process.env.MFG_INTEGRATION_STRATEGIC_VALUE, 10)
            : undefined,
          futureValue: process.env.MFG_INTEGRATION_FUTURE_VALUE
            ? parseInt(process.env.MFG_INTEGRATION_FUTURE_VALUE, 10)
            : undefined,
        },
      },
    },
    warehouseManagement: {
      operatingHours: {
        weekday: {
          startTime: process.env.WM_WEEKDAY_START_TIME,
          endTime: process.env.WM_WEEKDAY_END_TIME,
          timeZone: process.env.WM_WEEKDAY_TIMEZONE,
        },
        saturday: {
          startTime: process.env.WM_SATURDAY_START_TIME,
          endTime: process.env.WM_SATURDAY_END_TIME,
          timeZone: process.env.WM_SATURDAY_TIMEZONE,
        },
      },
      shifts: {
        day: {
          startTime: process.env.WM_DAY_SHIFT_START_TIME,
          endTime: process.env.WM_DAY_SHIFT_END_TIME,
          staffCount: process.env.WM_DAY_SHIFT_STAFF_COUNT
            ? parseInt(process.env.WM_DAY_SHIFT_STAFF_COUNT, 10)
            : undefined,
        },
        evening: {
          startTime: process.env.WM_EVENING_SHIFT_START_TIME,
          endTime: process.env.WM_EVENING_SHIFT_END_TIME,
          staffCount: process.env.WM_EVENING_SHIFT_STAFF_COUNT
            ? parseInt(process.env.WM_EVENING_SHIFT_STAFF_COUNT, 10)
            : undefined,
        },
        night: {
          startTime: process.env.WM_NIGHT_SHIFT_START_TIME,
          endTime: process.env.WM_NIGHT_SHIFT_END_TIME,
          staffCount: process.env.WM_NIGHT_SHIFT_STAFF_COUNT
            ? parseInt(process.env.WM_NIGHT_SHIFT_STAFF_COUNT, 10)
            : undefined,
        },
      },
      storageAreas: {
        bulk: {
          dimensions: {
            length: process.env.WM_BULK_STORAGE_LENGTH
              ? parseInt(process.env.WM_BULK_STORAGE_LENGTH, 10)
              : undefined,
            width: process.env.WM_BULK_STORAGE_WIDTH
              ? parseInt(process.env.WM_BULK_STORAGE_WIDTH, 10)
              : undefined,
            height: process.env.WM_BULK_STORAGE_HEIGHT
              ? parseInt(process.env.WM_BULK_STORAGE_HEIGHT, 10)
              : undefined,
          },
          totalPositions: process.env.WM_BULK_TOTAL_POSITIONS
            ? parseInt(process.env.WM_BULK_TOTAL_POSITIONS, 10)
            : undefined,
          utilizationRate: process.env.WM_BULK_UTILIZATION_RATE
            ? parseInt(process.env.WM_BULK_UTILIZATION_RATE, 10)
            : undefined,
          turnoverRate: process.env.WM_BULK_TURNOVER_RATE
            ? parseInt(process.env.WM_BULK_TURNOVER_RATE, 10)
            : undefined,
        },
        rack: {
          dimensions: {
            length: process.env.WM_RACK_STORAGE_LENGTH
              ? parseInt(process.env.WM_RACK_STORAGE_LENGTH, 10)
              : undefined,
            width: process.env.WM_RACK_STORAGE_WIDTH
              ? parseInt(process.env.WM_RACK_STORAGE_WIDTH, 10)
              : undefined,
            height: process.env.WM_RACK_STORAGE_HEIGHT
              ? parseInt(process.env.WM_RACK_STORAGE_HEIGHT, 10)
              : undefined,
          },
          totalPositions: process.env.WM_RACK_TOTAL_POSITIONS
            ? parseInt(process.env.WM_RACK_TOTAL_POSITIONS, 10)
            : undefined,
          utilizationRate: process.env.WM_RACK_UTILIZATION_RATE
            ? parseInt(process.env.WM_RACK_UTILIZATION_RATE, 10)
            : undefined,
          turnoverRate: process.env.WM_RACK_TURNOVER_RATE
            ? parseInt(process.env.WM_RACK_TURNOVER_RATE, 10)
            : undefined,
        },
      },
      dockDoors: {
        defaultCount: process.env.WM_DOCK_DOOR_COUNT
          ? parseInt(process.env.WM_DOCK_DOOR_COUNT, 10)
          : undefined,
        doorHeight: process.env.WM_DOCK_DOOR_HEIGHT
          ? parseInt(process.env.WM_DOCK_DOOR_HEIGHT, 10)
          : undefined,
        doorWidth: process.env.WM_DOCK_DOOR_WIDTH
          ? parseInt(process.env.WM_DOCK_DOOR_WIDTH, 10)
          : undefined,
        levelingDockDefault: process.env.WM_DOCK_LEVELING_DEFAULT
          ? process.env.WM_DOCK_LEVELING_DEFAULT === 'true'
          : undefined,
      },
    },
    messageQueue: {
      clustering: {
        workers: process.env.MQ_CLUSTER_WORKERS
          ? parseInt(process.env.MQ_CLUSTER_WORKERS, 10)
          : undefined,
        concurrency: process.env.MQ_CLUSTER_CONCURRENCY
          ? parseInt(process.env.MQ_CLUSTER_CONCURRENCY, 10)
          : undefined,
      },
      monitoring: {
        alertThresholds: {
          queueDepth: process.env.MQ_QUEUE_DEPTH_THRESHOLD
            ? parseInt(process.env.MQ_QUEUE_DEPTH_THRESHOLD, 10)
            : undefined,
          processingTime: process.env.MQ_PROCESSING_TIME_THRESHOLD
            ? parseInt(process.env.MQ_PROCESSING_TIME_THRESHOLD, 10)
            : undefined,
          errorRate: process.env.MQ_ERROR_RATE_THRESHOLD
            ? parseFloat(process.env.MQ_ERROR_RATE_THRESHOLD)
            : undefined,
        },
      },
      dynamicConfig: {
        lowConcurrency: process.env.MQ_LOW_CONCURRENCY
          ? parseInt(process.env.MQ_LOW_CONCURRENCY, 10)
          : undefined,
        mediumConcurrency: process.env.MQ_MEDIUM_CONCURRENCY
          ? parseInt(process.env.MQ_MEDIUM_CONCURRENCY, 10)
          : undefined,
        highConcurrency: process.env.MQ_HIGH_CONCURRENCY
          ? parseInt(process.env.MQ_HIGH_CONCURRENCY, 10)
          : undefined,
        standardAttempts: process.env.MQ_STANDARD_ATTEMPTS
          ? parseInt(process.env.MQ_STANDARD_ATTEMPTS, 10)
          : undefined,
        highAttempts: process.env.MQ_HIGH_ATTEMPTS
          ? parseInt(process.env.MQ_HIGH_ATTEMPTS, 10)
          : undefined,
        criticalAttempts: process.env.MQ_CRITICAL_ATTEMPTS
          ? parseInt(process.env.MQ_CRITICAL_ATTEMPTS, 10)
          : undefined,
        standardBackoffDelay: process.env.MQ_STANDARD_BACKOFF_DELAY
          ? parseInt(process.env.MQ_STANDARD_BACKOFF_DELAY, 10)
          : undefined,
        highBackoffDelay: process.env.MQ_HIGH_BACKOFF_DELAY
          ? parseInt(process.env.MQ_HIGH_BACKOFF_DELAY, 10)
          : undefined,
        criticalBackoffDelay: process.env.MQ_CRITICAL_BACKOFF_DELAY
          ? parseInt(process.env.MQ_CRITICAL_BACKOFF_DELAY, 10)
          : undefined,
        mediumRetention: process.env.MQ_MEDIUM_RETENTION
          ? parseInt(process.env.MQ_MEDIUM_RETENTION, 10)
          : undefined,
        highRetention: process.env.MQ_HIGH_RETENTION
          ? parseInt(process.env.MQ_HIGH_RETENTION, 10)
          : undefined,
        criticalRetention: process.env.MQ_CRITICAL_RETENTION
          ? parseInt(process.env.MQ_CRITICAL_RETENTION, 10)
          : undefined,
      },
    },
    project: {
      billing: {
        defaultHourlyRate: process.env.PROJ_DEFAULT_HOURLY_RATE
          ? parseInt(process.env.PROJ_DEFAULT_HOURLY_RATE, 10)
          : undefined,
        standardTaxRate: process.env.PROJ_STANDARD_TAX_RATE
          ? parseFloat(process.env.PROJ_STANDARD_TAX_RATE)
          : undefined,
        paymentTermsDays: process.env.PROJ_PAYMENT_TERMS_DAYS
          ? parseInt(process.env.PROJ_PAYMENT_TERMS_DAYS, 10)
          : undefined,
      },
      financials: {
        defaultLaborRate: process.env.PROJ_DEFAULT_LABOR_RATE
          ? parseInt(process.env.PROJ_DEFAULT_LABOR_RATE, 10)
          : undefined,
        defaultMaterialCostPerProject: process.env.PROJ_DEFAULT_MATERIAL_COST
          ? parseInt(process.env.PROJ_DEFAULT_MATERIAL_COST, 10)
          : undefined,
        overheadRatio: process.env.PROJ_OVERHEAD_RATIO
          ? parseFloat(process.env.PROJ_OVERHEAD_RATIO)
          : undefined,
        profitMarginTarget: process.env.PROJ_PROFIT_MARGIN_TARGET
          ? parseFloat(process.env.PROJ_PROFIT_MARGIN_TARGET)
          : undefined,
      },
      healthScoreThresholds: {
        schedulePerformanceTarget: process.env.PROJ_SCHEDULE_PERFORMANCE_TARGET
          ? parseFloat(process.env.PROJ_SCHEDULE_PERFORMANCE_TARGET)
          : undefined,
        costPerformanceTarget: process.env.PROJ_COST_PERFORMANCE_TARGET
          ? parseFloat(process.env.PROJ_COST_PERFORMANCE_TARGET)
          : undefined,
        scopeCompletionTarget: process.env.PROJ_SCOPE_COMPLETION_TARGET
          ? parseFloat(process.env.PROJ_SCOPE_COMPLETION_TARGET)
          : undefined,
        qualityMetricsTarget: process.env.PROJ_QUALITY_METRICS_TARGET
          ? parseFloat(process.env.PROJ_QUALITY_METRICS_TARGET)
          : undefined,
        riskScoreThreshold: process.env.PROJ_RISK_SCORE_THRESHOLD
          ? parseFloat(process.env.PROJ_RISK_SCORE_THRESHOLD)
          : undefined,
        teamSatisfactionTarget: process.env.PROJ_TEAM_SATISFACTION_TARGET
          ? parseFloat(process.env.PROJ_TEAM_SATISFACTION_TARGET)
          : undefined,
      },
      resources: {
        utilizationTarget: process.env.PROJ_UTILIZATION_TARGET
          ? parseInt(process.env.PROJ_UTILIZATION_TARGET, 10)
          : undefined,
        overallocationThreshold: process.env.PROJ_OVERALLOCATION_THRESHOLD
          ? parseFloat(process.env.PROJ_OVERALLOCATION_THRESHOLD)
          : undefined,
        capacityBufferRatio: process.env.PROJ_CAPACITY_BUFFER_RATIO
          ? parseFloat(process.env.PROJ_CAPACITY_BUFFER_RATIO)
          : undefined,
      },
      reporting: {
        forecastConfidenceDefault: process.env.PROJ_FORECAST_CONFIDENCE_DEFAULT
          ? parseFloat(process.env.PROJ_FORECAST_CONFIDENCE_DEFAULT)
          : undefined,
        reportingPeriodDays: process.env.PROJ_REPORTING_PERIOD_DAYS
          ? parseInt(process.env.PROJ_REPORTING_PERIOD_DAYS, 10)
          : undefined,
        scheduleVarianceDays: process.env.PROJ_SCHEDULE_VARIANCE_DAYS
          ? parseInt(process.env.PROJ_SCHEDULE_VARIANCE_DAYS, 10)
          : undefined,
        budgetVarianceAmount: process.env.PROJ_BUDGET_VARIANCE_AMOUNT
          ? parseInt(process.env.PROJ_BUDGET_VARIANCE_AMOUNT, 10)
          : undefined,
      },
    },
    orderAnalytics: {
      defaultCreditUtilization: process.env.OA_DEFAULT_CREDIT_UTILIZATION
        ? parseFloat(process.env.OA_DEFAULT_CREDIT_UTILIZATION)
        : undefined,
      performanceThresholds: {
        scopeCompletion: process.env.OA_SCOPE_COMPLETION_THRESHOLD
          ? parseFloat(process.env.OA_SCOPE_COMPLETION_THRESHOLD)
          : undefined,
      },
    },
    quoteManagement: {
      defaultExpirationDays: process.env.QM_DEFAULT_EXPIRATION_DAYS
        ? parseInt(process.env.QM_DEFAULT_EXPIRATION_DAYS, 10)
        : undefined,
      shippingRatePerPound: process.env.QM_SHIPPING_RATE_PER_POUND
        ? parseFloat(process.env.QM_SHIPPING_RATE_PER_POUND)
        : undefined,
      mockWeightPerItem: process.env.QM_MOCK_WEIGHT_PER_ITEM
        ? parseFloat(process.env.QM_MOCK_WEIGHT_PER_ITEM)
        : undefined,
      approvalThresholdAmount: process.env.QM_APPROVAL_THRESHOLD_AMOUNT
        ? parseFloat(process.env.QM_APPROVAL_THRESHOLD_AMOUNT)
        : undefined,
      maxDiscountPercentWithoutApproval: process.env.QM_MAX_DISCOUNT_PERCENT_WITHOUT_APPROVAL
        ? parseFloat(process.env.QM_MAX_DISCOUNT_PERCENT_WITHOUT_APPROVAL)
        : undefined,
      standardTaxRate: process.env.QM_STANDARD_TAX_RATE
        ? parseFloat(process.env.QM_STANDARD_TAX_RATE)
        : undefined,
      currencyConversionRate: process.env.QM_CURRENCY_CONVERSION_RATE
        ? parseFloat(process.env.QM_CURRENCY_CONVERSION_RATE)
        : undefined,
      mockMetrics: {
        conversionRate: process.env.QM_MOCK_CONVERSION_RATE
          ? parseFloat(process.env.QM_MOCK_CONVERSION_RATE)
          : undefined,
        averageQuoteToCloseTime: process.env.QM_MOCK_AVG_CLOSE_TIME
          ? parseFloat(process.env.QM_MOCK_AVG_CLOSE_TIME)
          : undefined,
        winRate: process.env.QM_MOCK_WIN_RATE
          ? parseFloat(process.env.QM_MOCK_WIN_RATE)
          : undefined,
        priceLossReasonPercentage: process.env.QM_MOCK_PRICE_LOSS_PERCENT
          ? parseFloat(process.env.QM_MOCK_PRICE_LOSS_PERCENT)
          : undefined,
        competitorLossReasonPercentage: process.env.QM_MOCK_COMPETITOR_LOSS_PERCENT
          ? parseFloat(process.env.QM_MOCK_COMPETITOR_LOSS_PERCENT)
          : undefined,
        budgetLossReasonPercentage: process.env.QM_MOCK_BUDGET_LOSS_PERCENT
          ? parseFloat(process.env.QM_MOCK_BUDGET_LOSS_PERCENT)
          : undefined,
      },
    },
    orderPromising: {
      manufacturingLeadTime: process.env.OP_MANUFACTURING_LEAD_TIME
        ? parseInt(process.env.OP_MANUFACTURING_LEAD_TIME, 10)
        : undefined,
      procurementLeadTime: process.env.OP_PROCUREMENT_LEAD_TIME
        ? parseInt(process.env.OP_PROCUREMENT_LEAD_TIME, 10)
        : undefined,
      itemLeadTime: process.env.OP_ITEM_LEAD_TIME
        ? parseInt(process.env.OP_ITEM_LEAD_TIME, 10)
        : undefined,
      standardShippingTime: process.env.OP_STANDARD_SHIPPING_TIME
        ? parseInt(process.env.OP_STANDARD_SHIPPING_TIME, 10)
        : undefined,
      expressShippingTime: process.env.OP_EXPRESS_SHIPPING_TIME
        ? parseInt(process.env.OP_EXPRESS_SHIPPING_TIME, 10)
        : undefined,
      overnightShippingTime: process.env.OP_OVERNIGHT_SHIPPING_TIME
        ? parseInt(process.env.OP_OVERNIGHT_SHIPPING_TIME, 10)
        : undefined,
      lowPriorityBufferDays: process.env.OP_LOW_PRIORITY_BUFFER_DAYS
        ? parseInt(process.env.OP_LOW_PRIORITY_BUFFER_DAYS, 10)
        : undefined,
      mediumPriorityBufferDays: process.env.OP_MEDIUM_PRIORITY_BUFFER_DAYS
        ? parseInt(process.env.OP_MEDIUM_PRIORITY_BUFFER_DAYS, 10)
        : undefined,
      highPriorityBufferDays: process.env.OP_HIGH_PRIORITY_BUFFER_DAYS
        ? parseInt(process.env.OP_HIGH_PRIORITY_BUFFER_DAYS, 10)
        : undefined,
      minConfidenceLevel: process.env.OP_MIN_CONFIDENCE_LEVEL
        ? parseFloat(process.env.OP_MIN_CONFIDENCE_LEVEL)
        : undefined,
      maxConfidenceLevel: process.env.OP_MAX_CONFIDENCE_LEVEL
        ? parseFloat(process.env.OP_MAX_CONFIDENCE_LEVEL)
        : undefined,
    },
    procurement: {
      supplierQualityThreshold: process.env.PROC_SUPPLIER_QUALITY_THRESHOLD
        ? parseInt(process.env.PROC_SUPPLIER_QUALITY_THRESHOLD, 10)
        : undefined,
      supplierDeliveryThreshold: process.env.PROC_SUPPLIER_DELIVERY_THRESHOLD
        ? parseInt(process.env.PROC_SUPPLIER_DELIVERY_THRESHOLD, 10)
        : undefined,
      supplierCostThreshold: process.env.PROC_SUPPLIER_COST_THRESHOLD
        ? parseInt(process.env.PROC_SUPPLIER_COST_THRESHOLD, 10)
        : undefined,
      poApprovalThreshold: process.env.PROC_PO_APPROVAL_THRESHOLD
        ? parseFloat(process.env.PROC_PO_APPROVAL_THRESHOLD)
        : undefined,
      maxPoValueWithoutApproval: process.env.PROC_MAX_PO_VALUE_WITHOUT_APPROVAL
        ? parseFloat(process.env.PROC_MAX_PO_VALUE_WITHOUT_APPROVAL)
        : undefined,
      rfqResponseTimeoutDays: process.env.PROC_RFQ_RESPONSE_TIMEOUT_DAYS
        ? parseInt(process.env.PROC_RFQ_RESPONSE_TIMEOUT_DAYS, 10)
        : undefined,
      minSuppliersForRfq: process.env.PROC_MIN_SUPPLIERS_FOR_RFQ
        ? parseInt(process.env.PROC_MIN_SUPPLIERS_FOR_RFQ, 10)
        : undefined,
      contractRenewalNotificationDays: process.env.PROC_CONTRACT_RENEWAL_NOTIFICATION_DAYS
        ? parseInt(process.env.PROC_CONTRACT_RENEWAL_NOTIFICATION_DAYS, 10)
        : undefined,
      contractValueReviewThreshold: process.env.PROC_CONTRACT_VALUE_REVIEW_THRESHOLD
        ? parseFloat(process.env.PROC_CONTRACT_VALUE_REVIEW_THRESHOLD)
        : undefined,
    },
    pricingEngine: {
      mockPricing: {
        defaultListPrice: process.env.PE_MOCK_DEFAULT_LIST_PRICE
          ? parseFloat(process.env.PE_MOCK_DEFAULT_LIST_PRICE)
          : undefined,
        defaultMinPrice: process.env.PE_MOCK_DEFAULT_MIN_PRICE
          ? parseFloat(process.env.PE_MOCK_DEFAULT_MIN_PRICE)
          : undefined,
        defaultCost: process.env.PE_MOCK_DEFAULT_COST
          ? parseFloat(process.env.PE_MOCK_DEFAULT_COST)
          : undefined,
        defaultMarginPercent: process.env.PE_MOCK_DEFAULT_MARGIN_PERCENT
          ? parseFloat(process.env.PE_MOCK_DEFAULT_MARGIN_PERCENT)
          : undefined,
        priceBreaks: {
          tier1MinQuantity: process.env.PE_MOCK_TIER1_MIN_QUANTITY
            ? parseInt(process.env.PE_MOCK_TIER1_MIN_QUANTITY, 10)
            : undefined,
          tier1UnitPrice: process.env.PE_MOCK_TIER1_UNIT_PRICE
            ? parseFloat(process.env.PE_MOCK_TIER1_UNIT_PRICE)
            : undefined,
          tier2MinQuantity: process.env.PE_MOCK_TIER2_MIN_QUANTITY
            ? parseInt(process.env.PE_MOCK_TIER2_MIN_QUANTITY, 10)
            : undefined,
          tier2UnitPrice: process.env.PE_MOCK_TIER2_UNIT_PRICE
            ? parseFloat(process.env.PE_MOCK_TIER2_UNIT_PRICE)
            : undefined,
          tier3MinQuantity: process.env.PE_MOCK_TIER3_MIN_QUANTITY
            ? parseInt(process.env.PE_MOCK_TIER3_MIN_QUANTITY, 10)
            : undefined,
          tier3UnitPrice: process.env.PE_MOCK_TIER3_UNIT_PRICE
            ? parseFloat(process.env.PE_MOCK_TIER3_UNIT_PRICE)
            : undefined,
        },
      },
      maxDiscountPercent: process.env.PE_MAX_DISCOUNT_PERCENT
        ? parseFloat(process.env.PE_MAX_DISCOUNT_PERCENT)
        : undefined,
      minMarginPercent: process.env.PE_MIN_MARGIN_PERCENT
        ? parseFloat(process.env.PE_MIN_MARGIN_PERCENT)
        : undefined,
      defaultMarkupMultiplier: process.env.PE_DEFAULT_MARKUP_MULTIPLIER
        ? parseFloat(process.env.PE_DEFAULT_MARKUP_MULTIPLIER)
        : undefined,
    },
    shipping: {
      carrierScoring: {
        costWeight: process.env.SHIP_CARRIER_COST_WEIGHT
          ? parseFloat(process.env.SHIP_CARRIER_COST_WEIGHT)
          : undefined,
        speedWeight: process.env.SHIP_CARRIER_SPEED_WEIGHT
          ? parseFloat(process.env.SHIP_CARRIER_SPEED_WEIGHT)
          : undefined,
        reliabilityWeight: process.env.SHIP_CARRIER_RELIABILITY_WEIGHT
          ? parseFloat(process.env.SHIP_CARRIER_RELIABILITY_WEIGHT)
          : undefined,
      },
      defaultInsuranceRate: process.env.SHIP_DEFAULT_INSURANCE_RATE
        ? parseFloat(process.env.SHIP_DEFAULT_INSURANCE_RATE)
        : undefined,
      dimensionalWeightDivisor: process.env.SHIP_DIMENSIONAL_WEIGHT_DIVISOR
        ? parseFloat(process.env.SHIP_DIMENSIONAL_WEIGHT_DIVISOR)
        : undefined,
      mockRates: {
        baseShippingCost: process.env.SHIP_MOCK_BASE_COST
          ? parseFloat(process.env.SHIP_MOCK_BASE_COST)
          : undefined,
        expressShippingMultiplier: process.env.SHIP_MOCK_EXPRESS_MULTIPLIER
          ? parseFloat(process.env.SHIP_MOCK_EXPRESS_MULTIPLIER)
          : undefined,
        overnightShippingMultiplier: process.env.SHIP_MOCK_OVERNIGHT_MULTIPLIER
          ? parseFloat(process.env.SHIP_MOCK_OVERNIGHT_MULTIPLIER)
          : undefined,
      },
    },
    forecasting: {
      defaultForecastPeriods: process.env.FC_DEFAULT_PERIODS
        ? parseInt(process.env.FC_DEFAULT_PERIODS, 10)
        : undefined,
      seasonalAmplitude: process.env.FC_SEASONAL_AMPLITUDE
        ? parseFloat(process.env.FC_SEASONAL_AMPLITUDE)
        : undefined,
      seasonalFrequency: process.env.FC_SEASONAL_FREQUENCY
        ? parseFloat(process.env.FC_SEASONAL_FREQUENCY)
        : undefined,
      trendGrowthRate: process.env.FC_TREND_GROWTH_RATE
        ? parseFloat(process.env.FC_TREND_GROWTH_RATE)
        : undefined,
      forecastVarianceBounds: {
        upperMultiplier: process.env.FC_UPPER_BOUND_MULTIPLIER
          ? parseFloat(process.env.FC_UPPER_BOUND_MULTIPLIER)
          : undefined,
        lowerMultiplier: process.env.FC_LOWER_BOUND_MULTIPLIER
          ? parseFloat(process.env.FC_LOWER_BOUND_MULTIPLIER)
          : undefined,
      },
      mockForecasting: {
        baseOrderValue: process.env.FC_MOCK_BASE_ORDER_VALUE
          ? parseFloat(process.env.FC_MOCK_BASE_ORDER_VALUE)
          : undefined,
        standardError: process.env.FC_MOCK_STANDARD_ERROR
          ? parseFloat(process.env.FC_MOCK_STANDARD_ERROR)
          : undefined,
      },
    },
  };

  // Validate and return with defaults applied
  const { value } = businessConfigSchema.validate(config);
  return value as BusinessConfig;
}

export function loadExtendedConfig(): ExtendedTitanConfig {
  // Load base configuration
  const baseConfig = {
    database: {
      type: (process.env.DB_TYPE as any) || 'sqlite',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
      database: process.env.DB_NAME || 'titan_grove',
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      url: process.env.DATABASE_URL,
    },
    server: {
      port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
      host: process.env.HOST || 'localhost',
      security: {
        jwt: {
          secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        },
      },
    },
    cache: process.env.REDIS_URL
      ? {
          type: 'redis' as const,
          host: process.env.REDIS_HOST || 'localhost',
          port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
        }
      : undefined,
    analytics: {
      enabled: process.env.ANALYTICS_ENABLED === 'true',
      elasticsearch: process.env.ELASTICSEARCH_URL
        ? {
            host: process.env.ELASTICSEARCH_HOST || 'localhost',
            port: process.env.ELASTICSEARCH_PORT
              ? parseInt(process.env.ELASTICSEARCH_PORT, 10)
              : 9200,
          }
        : undefined,
    },
    cluster: {
      enabled: process.env.CLUSTER_ENABLED === 'true',
    },
    business: loadBusinessConfig(),
  };

  return validateExtendedConfig(baseConfig);
}