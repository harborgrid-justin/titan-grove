/**
 * Centralized Data Provider
 * Provides a unified interface for all mock data, demo data, and configurable business constants
 * Eliminates hardcoded values scattered throughout the application
 */

import { SERVICE_ANALYTICS_CONSTANTS, BUSINESS_CONSTANTS } from '../shared/constants';

export interface ServiceMetrics {
  totalServiceRequests: number;
  completedWorkOrders: number;
  averageResolutionTime: number;
  firstTimeFixRate: number;
  customerSatisfaction: number;
  escalationRate: number;
  resourceUtilization: number;
  techniciansActive: number;
  equipmentUtilization: number;
  totalServiceRevenue: number;
  serviceCosts: number;
  profitMargin: number;
  costPerServiceCall: number;
}

export interface CompetitiveComparison {
  oracle: {
    dashboardRating: number;
    mobileRating: number;
    optimizationRating: number;
    emergencyRating: number;
    analyticsRating: number;
    integrationRating: number;
    overallRating: number;
  };
  titanGrove: {
    dashboardRating: number;
    mobileRating: number;
    optimizationRating: number;
    emergencyRating: number;
    analyticsRating: number;
    integrationRating: number;
    overallRating: number;
  };
  businessValue: {
    costSavings: number;
    efficiencyGains: number;
    revenueIncrease: number;
    riskReduction: number;
    migrationCosts: number;
    roiMonths: number;
  };
}

export interface WorkloadForecast {
  next7Days: number[];
  trend: 'INCREASING' | 'DECREASING' | 'STABLE';
  confidence: number;
}

export interface ResourceDemand {
  type: string;
  required: number;
  current: number;
  shortage: number;
}

export interface ServiceCommandCenterData {
  commandCenterId: string;
  name: string;
  region: string;
  status: string;
  activeServices: number;
  onlineResources: number;
  emergencyAlerts: number;
  performanceScore: number;
  serviceAreas: Array<{
    name: string;
    coverage: string;
    responseTime: number;
  }>;
  managedAssets: number;
  activeContracts: number;
}

/**
 * Centralized Data Provider Class
 * Single source of truth for all mock/demo/configurable data
 */
export class CentralizedDataProvider {
  private static instance: CentralizedDataProvider;
  
  /**
   * Singleton pattern to ensure single data source
   */
  public static getInstance(): CentralizedDataProvider {
    if (!CentralizedDataProvider.instance) {
      CentralizedDataProvider.instance = new CentralizedDataProvider();
    }
    return CentralizedDataProvider.instance;
  }

  /**
   * Get standardized service metrics
   * Replaces scattered hardcoded values in SERVICE_ANALYTICS_CONSTANTS
   */
  public getServiceMetrics(): ServiceMetrics {
    return {
      totalServiceRequests: this.getConfigValue('MOCK_TOTAL_SERVICE_REQUESTS', SERVICE_ANALYTICS_CONSTANTS.MOCK_TOTAL_SERVICE_REQUESTS),
      completedWorkOrders: this.getConfigValue('MOCK_COMPLETED_WORK_ORDERS', SERVICE_ANALYTICS_CONSTANTS.MOCK_COMPLETED_WORK_ORDERS),
      averageResolutionTime: this.getConfigValue('MOCK_AVERAGE_RESOLUTION_TIME', SERVICE_ANALYTICS_CONSTANTS.MOCK_AVERAGE_RESOLUTION_TIME),
      firstTimeFixRate: this.getConfigValue('MOCK_FIRST_TIME_FIX_RATE', SERVICE_ANALYTICS_CONSTANTS.MOCK_FIRST_TIME_FIX_RATE),
      customerSatisfaction: this.getConfigValue('MOCK_CUSTOMER_SATISFACTION', SERVICE_ANALYTICS_CONSTANTS.MOCK_CUSTOMER_SATISFACTION),
      escalationRate: this.getConfigValue('MOCK_ESCALATION_RATE', SERVICE_ANALYTICS_CONSTANTS.MOCK_ESCALATION_RATE),
      resourceUtilization: this.getConfigValue('RESOURCE_UTILIZATION_CURRENT', SERVICE_ANALYTICS_CONSTANTS.RESOURCE_UTILIZATION_CURRENT),
      techniciansActive: this.getConfigValue('MOCK_TECHNICIANS_ACTIVE', SERVICE_ANALYTICS_CONSTANTS.MOCK_TECHNICIANS_ACTIVE),
      equipmentUtilization: this.getConfigValue('MOCK_EQUIPMENT_UTILIZATION', SERVICE_ANALYTICS_CONSTANTS.MOCK_EQUIPMENT_UTILIZATION),
      totalServiceRevenue: this.getConfigValue('MOCK_TOTAL_SERVICE_REVENUE', SERVICE_ANALYTICS_CONSTANTS.MOCK_TOTAL_SERVICE_REVENUE),
      serviceCosts: this.getConfigValue('MOCK_SERVICE_COSTS', SERVICE_ANALYTICS_CONSTANTS.MOCK_SERVICE_COSTS),
      profitMargin: this.getConfigValue('MOCK_PROFIT_MARGIN', SERVICE_ANALYTICS_CONSTANTS.MOCK_PROFIT_MARGIN),
      costPerServiceCall: this.getConfigValue('MOCK_COST_PER_SERVICE_CALL', SERVICE_ANALYTICS_CONSTANTS.MOCK_COST_PER_SERVICE_CALL),
    };
  }

  /**
   * Get Oracle EBS competitive comparison data
   * Centralizes hardcoded comparison values from demo files
   */
  public getCompetitiveComparison(): CompetitiveComparison {
    return {
      oracle: {
        dashboardRating: this.getConfigValue('ORACLE_EBS_DASHBOARD_RATING', SERVICE_ANALYTICS_CONSTANTS.ORACLE_EBS_DASHBOARD_RATING),
        mobileRating: this.getConfigValue('ORACLE_EBS_MOBILE_RATING', SERVICE_ANALYTICS_CONSTANTS.ORACLE_EBS_MOBILE_RATING),
        optimizationRating: this.getConfigValue('ORACLE_EBS_OPTIMIZATION_RATING', SERVICE_ANALYTICS_CONSTANTS.ORACLE_EBS_OPTIMIZATION_RATING),
        emergencyRating: this.getConfigValue('ORACLE_EBS_EMERGENCY_RATING', SERVICE_ANALYTICS_CONSTANTS.ORACLE_EBS_EMERGENCY_RATING),
        analyticsRating: this.getConfigValue('ORACLE_EBS_ANALYTICS_RATING', SERVICE_ANALYTICS_CONSTANTS.ORACLE_EBS_ANALYTICS_RATING),
        integrationRating: this.getConfigValue('ORACLE_EBS_INTEGRATION_RATING', SERVICE_ANALYTICS_CONSTANTS.ORACLE_EBS_INTEGRATION_RATING),
        overallRating: this.getConfigValue('ORACLE_EBS_OVERALL_RATING', 5.9),
      },
      titanGrove: {
        dashboardRating: this.getConfigValue('TITAN_GROVE_DASHBOARD_RATING', SERVICE_ANALYTICS_CONSTANTS.TITAN_GROVE_DASHBOARD_RATING),
        mobileRating: this.getConfigValue('TITAN_GROVE_MOBILE_RATING', SERVICE_ANALYTICS_CONSTANTS.TITAN_GROVE_MOBILE_RATING),
        optimizationRating: this.getConfigValue('TITAN_GROVE_OPTIMIZATION_RATING', SERVICE_ANALYTICS_CONSTANTS.TITAN_GROVE_OPTIMIZATION_RATING),
        emergencyRating: this.getConfigValue('TITAN_GROVE_EMERGENCY_RATING', SERVICE_ANALYTICS_CONSTANTS.TITAN_GROVE_EMERGENCY_RATING),
        analyticsRating: this.getConfigValue('TITAN_GROVE_ANALYTICS_RATING', SERVICE_ANALYTICS_CONSTANTS.TITAN_GROVE_ANALYTICS_RATING),
        integrationRating: this.getConfigValue('TITAN_GROVE_INTEGRATION_RATING', SERVICE_ANALYTICS_CONSTANTS.TITAN_GROVE_INTEGRATION_RATING),
        overallRating: this.getConfigValue('TITAN_GROVE_OVERALL_RATING', 9.2),
      },
      businessValue: {
        costSavings: this.getConfigValue('ORACLE_COMPETITIVE_COST_SAVINGS', SERVICE_ANALYTICS_CONSTANTS.ORACLE_COMPETITIVE_COST_SAVINGS),
        efficiencyGains: this.getConfigValue('ORACLE_COMPETITIVE_EFFICIENCY_GAINS', SERVICE_ANALYTICS_CONSTANTS.ORACLE_COMPETITIVE_EFFICIENCY_GAINS),
        revenueIncrease: this.getConfigValue('ORACLE_COMPETITIVE_REVENUE_INCREASE', SERVICE_ANALYTICS_CONSTANTS.ORACLE_COMPETITIVE_REVENUE_INCREASE),
        riskReduction: this.getConfigValue('ORACLE_COMPETITIVE_RISK_REDUCTION', SERVICE_ANALYTICS_CONSTANTS.ORACLE_COMPETITIVE_RISK_REDUCTION),
        migrationCosts: this.getConfigValue('ORACLE_COMPETITIVE_MIGRATION_COSTS', SERVICE_ANALYTICS_CONSTANTS.ORACLE_COMPETITIVE_MIGRATION_COSTS),
        roiMonths: this.getConfigValue('ORACLE_COMPETITIVE_ROI_MONTHS', SERVICE_ANALYTICS_CONSTANTS.ORACLE_COMPETITIVE_ROI_MONTHS),
      },
    };
  }

  /**
   * Get workload forecast data
   * Centralizes hardcoded forecast values from demo files
   */
  public getWorkloadForecast(): WorkloadForecast {
    return {
      next7Days: this.getConfigValue('WORKLOAD_FORECAST_NEXT_7_DAYS', [32, 28, 35, 41, 38, 29, 33]),
      trend: this.getConfigValue('WORKLOAD_FORECAST_TREND', 'INCREASING') as 'INCREASING' | 'DECREASING' | 'STABLE',
      confidence: this.getConfigValue('WORKLOAD_FORECAST_CONFIDENCE', 87.5),
    };
  }

  /**
   * Get resource demand forecast
   * Centralizes hardcoded resource demand values from demo files
   */
  public getResourceDemand(): ResourceDemand[] {
    return this.getConfigValue('RESOURCE_DEMAND_FORECAST', [
      { type: 'HVAC Specialists', required: 12, current: 10, shortage: 2 },
      { type: 'Electrical Technicians', required: 8, current: 9, shortage: 0 },
      { type: 'General Maintenance', required: 15, current: 14, shortage: 1 }
    ]);
  }

  /**
   * Get service command center demo data
   * Centralizes hardcoded demo values from demo-service-command-center.js
   */
  public getServiceCommandCenterData(): ServiceCommandCenterData {
    return {
      commandCenterId: this.getConfigValue('DEMO_COMMAND_CENTER_ID', 'demo_center_001'),
      name: this.getConfigValue('DEMO_COMMAND_CENTER_NAME', 'Fortune 100 Global Service Operations'),
      region: this.getConfigValue('DEMO_COMMAND_CENTER_REGION', 'Global Enterprise'),
      status: this.getConfigValue('DEMO_COMMAND_CENTER_STATUS', 'ACTIVE'),
      activeServices: this.getConfigValue('DEMO_ACTIVE_SERVICES', 247),
      onlineResources: this.getConfigValue('DEMO_ONLINE_RESOURCES', 156),
      emergencyAlerts: this.getConfigValue('DEMO_EMERGENCY_ALERTS', 3),
      performanceScore: this.getConfigValue('DEMO_PERFORMANCE_SCORE', 94.7),
      serviceAreas: this.getConfigValue('DEMO_SERVICE_AREAS', [
        { name: 'North America', coverage: 'FULL', responseTime: 12 },
        { name: 'Europe', coverage: 'FULL', responseTime: 15 },
        { name: 'Asia Pacific', coverage: 'FULL', responseTime: 18 }
      ]),
      managedAssets: this.getConfigValue('DEMO_MANAGED_ASSETS', 12487),
      activeContracts: this.getConfigValue('DEMO_ACTIVE_CONTRACTS', 342),
    };
  }

  /**
   * Get quality prediction metrics
   * Centralizes hardcoded quality metrics from demo files
   */
  public getQualityPrediction() {
    return {
      firstTimeFixRate: {
        current: this.getConfigValue('QUALITY_FIRST_TIME_FIX_CURRENT', 89.3),
        predicted: this.getConfigValue('QUALITY_FIRST_TIME_FIX_PREDICTED', 92.1),
        confidence: this.getConfigValue('QUALITY_FIRST_TIME_FIX_CONFIDENCE', 84)
      },
      customerSatisfaction: {
        current: this.getConfigValue('QUALITY_CUSTOMER_SAT_CURRENT', 4.7),
        predicted: this.getConfigValue('QUALITY_CUSTOMER_SAT_PREDICTED', 4.8),
        confidence: this.getConfigValue('QUALITY_CUSTOMER_SAT_CONFIDENCE', 91)
      }
    };
  }

  /**
   * Get implementation timelines
   * Centralizes hardcoded timeline values
   */
  public getImplementationTimelines() {
    return {
      diagnosticTools: this.getConfigValue('IMPLEMENTATION_TIME_DIAGNOSTIC_TOOLS', SERVICE_ANALYTICS_CONSTANTS.IMPLEMENTATION_TIME_DIAGNOSTIC_TOOLS),
      resourceExpansion: this.getConfigValue('IMPLEMENTATION_TIME_RESOURCE_EXPANSION', SERVICE_ANALYTICS_CONSTANTS.IMPLEMENTATION_TIME_RESOURCE_EXPANSION),
      mobileWorkflows: this.getConfigValue('IMPLEMENTATION_TIME_MOBILE_WORKFLOWS', SERVICE_ANALYTICS_CONSTANTS.IMPLEMENTATION_TIME_MOBILE_WORKFLOWS),
    };
  }

  /**
   * Get cost savings data
   * Centralizes hardcoded cost savings values
   */
  public getCostSavings() {
    return {
      diagnosticTools: this.getConfigValue('COST_SAVINGS_DIAGNOSTIC_TOOLS', SERVICE_ANALYTICS_CONSTANTS.COST_SAVINGS_DIAGNOSTIC_TOOLS),
      resourceOptimization: this.getConfigValue('COST_SAVINGS_RESOURCE_OPTIMIZATION', SERVICE_ANALYTICS_CONSTANTS.COST_SAVINGS_RESOURCE_OPTIMIZATION),
      mobileWorkflows: this.getConfigValue('COST_SAVINGS_MOBILE_WORKFLOWS', SERVICE_ANALYTICS_CONSTANTS.COST_SAVINGS_MOBILE_WORKFLOWS),
    };
  }

  /**
   * Helper method to get configurable values from environment variables
   * Supports both development and production environments
   */
  private getConfigValue<T>(envKey: string, defaultValue: T): T {
    const envValue = process.env[`TG_${envKey}`] || process.env[envKey];
    
    if (envValue === undefined) {
      return defaultValue;
    }

    // Handle different data types
    if (typeof defaultValue === 'number') {
      const parsed = parseFloat(envValue);
      return (isNaN(parsed) ? defaultValue : parsed) as T;
    }

    if (typeof defaultValue === 'boolean') {
      return (envValue.toLowerCase() === 'true') as T;
    }

    if (Array.isArray(defaultValue)) {
      try {
        return JSON.parse(envValue) as T;
      } catch {
        return defaultValue;
      }
    }

    if (typeof defaultValue === 'object' && defaultValue !== null) {
      try {
        return JSON.parse(envValue) as T;
      } catch {
        return defaultValue;
      }
    }

    return envValue as T;
  }

  /**
   * Override data values programmatically (useful for A/B testing, multi-tenant, etc.)
   */
  private overrides: Map<string, any> = new Map();

  public setOverride(key: string, value: any): void {
    this.overrides.set(key, value);
  }

  public clearOverride(key: string): void {
    this.overrides.delete(key);
  }

  public clearAllOverrides(): void {
    this.overrides.clear();
  }

  /**
   * Get all available data for debugging/administration
   */
  public getAllData() {
    return {
      serviceMetrics: this.getServiceMetrics(),
      competitiveComparison: this.getCompetitiveComparison(),
      workloadForecast: this.getWorkloadForecast(),
      resourceDemand: this.getResourceDemand(),
      serviceCommandCenterData: this.getServiceCommandCenterData(),
      qualityPrediction: this.getQualityPrediction(),
      implementationTimelines: this.getImplementationTimelines(),
      costSavings: this.getCostSavings(),
      overrides: Object.fromEntries(this.overrides),
    };
  }
}

// Export singleton instance for easy usage
export const dataProvider = CentralizedDataProvider.getInstance();

// Export factory function for dependency injection
export function createDataProvider(): CentralizedDataProvider {
  return CentralizedDataProvider.getInstance();
}