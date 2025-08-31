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

export interface BusinessConfig {
  configureToOrder: ConfigureToOrderConfig;
  capitalAsset: CapitalAssetConfig;
  manufacturing: ManufacturingConfig;
  messageQueue: MessageQueueConfig;
  project: ProjectConfig;
  orderAnalytics: OrderAnalyticsConfig;
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