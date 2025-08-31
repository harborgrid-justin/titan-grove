import Joi from 'joi';
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
    },
    project: {
      billing: {
        defaultHourlyRate: process.env.PROJ_DEFAULT_HOURLY_RATE
          ? parseInt(process.env.PROJ_DEFAULT_HOURLY_RATE, 10)
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