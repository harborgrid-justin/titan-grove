/**
 * Example Titan Grove Business Configuration
 * This file demonstrates the centralized business configuration system
 * that replaces hard-coded variables throughout the codebase.
 */

const config = {
  database: {
    // SQLite (default for development)
    type: 'sqlite',
    database: './data/titan_grove.db',
    
    // PostgreSQL configuration
    // type: 'postgresql',
    // host: 'localhost',
    // port: 5432,
    // database: 'titan_grove',
    // username: 'postgres',
    // password: 'password',
    // ssl: false,
    
    // Connection pool settings
    pool: {
      min: 2,
      max: 10,
      idleTimeout: 30000,
    },
    
    // Migration settings
    migrations: {
      directory: './migrations',
      tableName: 'migrations',
    },
  },

  server: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    host: 'localhost',
    
    // CORS settings
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true,
    },
    
    // Rate limiting
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // requests per window
    },
    
    // Security settings
    security: {
      helmet: true,
      jwt: {
        secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
        expiresIn: '1h',
      },
    },
    
    // Enable compression
    compression: true,
  },

  // Cache configuration
  cache: {
    type: 'memory', // 'memory', 'redis'
    ttl: 300, // 5 minutes default TTL
    maxKeys: 1000,
  },

  // Analytics configuration
  analytics: {
    enabled: false,
    metrics: {
      enabled: true,
      interval: 60000, // 1 minute
    },
  },

  // Cluster configuration
  cluster: {
    enabled: false,
    workers: require('os').cpus().length,
    gracefulTimeout: 5000,
  },

  // Logging configuration
  logging: {
    level: 'info', // 'error', 'warn', 'info', 'debug'
    format: 'simple', // 'simple', 'json'
  },

  // ================================
  // BUSINESS CONFIGURATION
  // Centralized business logic constants
  // ================================
  business: {
    
    // Configure-to-Order Service Configuration
    configureToOrder: {
      // Product Configuration Defaults
      defaultBasePrice: 1000,                    // Replaces hard-coded: 1000
      defaultBaseCost: 650,                      // Replaces hard-coded: 650
      defaultCostRatio: 0.65,                    // Replaces hard-coded: 0.65
      defaultLeadTimeBase: 14,                   // Replaces hard-coded: 14
      
      // Manufacturing Complexity Thresholds
      standardComplexityMaxOptions: 3,          // Replaces hard-coded: 3
      complexComplexityMaxOptions: 8,           // Replaces hard-coded: 8
      
      // Engineering Configuration
      engineeringHourlyRate: 150,               // Replaces hard-coded: 150
      defaultEngineeringDuration: 15,           // Replaces hard-coded: 15
      prototypeDevelopmentDuration: 10,         // Replaces hard-coded: 10
      productionPlanningDuration: 5,            // Replaces hard-coded: 5
      baseProjectTimeline: 30,                  // Replaces hard-coded: 30
      
      // Sample lead time calculations
      defaultSampleLeadTime: 7,                 // Replaces hard-coded: 7
    },

    // Capital Asset Management Configuration
    capitalAsset: {
      // ROI Analysis Scenarios
      roiScenarios: {
        baseCase: {
          probability: 60,                       // Replaces hard-coded: 60%
        },
        optimistic: {
          probability: 20,                       // Replaces hard-coded: 20%
        },
        pessimistic: {
          probability: 20,                       // Replaces hard-coded: 20%
        },
      },
      
      // Budget Allocation Recommendations
      budgetAllocations: {
        productionEquipment: 40,                 // Replaces hard-coded: 40%
        regulatoryCompliance: 20,                // Replaces hard-coded: 20%
        digitalTransformation: 15,               // Replaces hard-coded: 15%
      },
      
      // Default Analysis Parameters
      defaultDiscountRate: 0.08,                // New: 8%
      defaultAnalysisTimeHorizon: 5,            // New: 5 years
    },

    // Manufacturing Configuration
    manufacturing: {
      // BOM Management
      defaultBomComplexity: 0.65,               // Replaces hard-coded: 0.65
      
      // Production Lead Times (days)
      standardProductionLeadTime: 7,            // New configurable
      customProductionLeadTime: 21,             // New configurable
      
      // Cost Management Variance Thresholds (percentages)
      materialCostVarianceThreshold: 10,        // New: 10%
      laborCostVarianceThreshold: 15,           // New: 15%
    },

    // Message Queue Configuration
    messageQueue: {
      // Redis Configuration
      redis: {
        host: 'localhost',                       // Replaces hard-coded
        port: 6379,                             // Replaces hard-coded
        keyPrefix: 'titan-grove:',              // Replaces hard-coded
        retryDelayOnFailover: 1000,             // Replaces hard-coded: 1000
        maxRetriesPerRequest: 3,                // Replaces hard-coded: 3
        lazyConnect: true,
      },
      
      // Job Configuration
      defaultJobOptions: {
        removeOnComplete: 100,                  // Replaces hard-coded: 100
        removeOnFail: 50,                       // Replaces hard-coded: 50
        attempts: 3,                            // Replaces hard-coded: 3
        backoff: {
          type: 'exponential',                  // Replaces hard-coded
          delay: 2000,                          // Replaces hard-coded: 2000
        },
      },
      
      // Monitoring Configuration
      monitoring: {
        enabled: true,
        metricsRetentionDays: 7,                // Replaces hard-coded: 7
        alertThresholds: {
          queueDepth: 1000,                     // Replaces hard-coded: 1000
          processingTime: 30000,                // Replaces hard-coded: 30000
          errorRate: 0.1,                       // Replaces hard-coded: 0.1 (10%)
        },
      },
      
      // Dead Letter Queue
      deadLetterQueue: {
        enabled: true,
        maxRetries: 5,                          // Replaces hard-coded: 5
        retentionDays: 30,                      // Replaces hard-coded: 30
      },
      
      // Clustering
      clustering: {
        enabled: false,
        workers: 4,                             // Replaces hard-coded: 4
        concurrency: 10,                        // Replaces hard-coded: 10
      },
    },

    // Project Management Configuration
    project: {
      // Cost Performance Indicators
      costPerformanceThresholds: {
        budgetVarianceAlert: 0.1,               // New: 10% variance alert
        scheduleVarianceAlert: 0.15,            // New: 15% variance alert
      },
      
      // Default Billing Rates
      billing: {
        defaultHourlyRate: 125,                 // New configurable
        overtimeMultiplier: 1.5,                // New configurable
      },
    },

    // Order Analytics Configuration
    orderAnalytics: {
      // Credit and Risk Analysis
      defaultCreditUtilization: 0.65,          // Replaces hard-coded: 0.65
      
      // Performance Thresholds
      performanceThresholds: {
        scopeCompletion: 0.65,                  // Replaces hard-coded: 0.65
        qualityScore: 0.85,                     // New: 85%
        deliveryPerformance: 0.90,              // New: 90%
      },
    },
  },
};

module.exports = config;