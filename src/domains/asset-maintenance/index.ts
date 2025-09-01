/**
 * Asset & Maintenance Domain
 * Centralized business logic for asset management, maintenance, and real estate
 */

import { assetManager, AssetManager } from '../../modules/assets';
import { maintenanceManager, MaintenanceManager } from '../../modules/maintenance';
import { BusinessConfig } from '../../types/business-config';

export interface AssetMaintenanceDomainConfig {
  assets: {
    depreciationRates: {
      equipment: number;
      vehicles: number;
      buildings: number;
      technology: number;
    };
    maintenanceSchedules: {
      preventive: number; // weeks
      predictive: number; // weeks
      emergency: number; // hours
    };
    utilizationTargets: {
      equipment: number;
      vehicles: number;
      facilities: number;
    };
  };
  maintenance: {
    costFactors: {
      laborRate: number;
      partsMarkup: number;
      emergencyMultiplier: number;
    };
    kpis: {
      mtbf: number; // Mean Time Between Failures (hours)
      mttr: number; // Mean Time To Repair (hours)
      availability: number; // Target availability percentage
    };
  };
}

/**
 * Core Business Logic Functions - Asset & Maintenance Domain
 * Consolidated business calculations for asset and maintenance management
 */
export class AssetMaintenanceBusinessLogic {
  
  /**
   * Calculate asset depreciation
   */
  static calculateDepreciation(
    assetValue: number,
    depreciationRate: number,
    ageInYears: number,
    method: 'straight-line' | 'declining-balance' = 'straight-line'
  ): {
    annualDepreciation: number;
    accumulatedDepreciation: number;
    bookValue: number;
  } {
    let annualDepreciation: number;
    let accumulatedDepreciation: number;

    if (method === 'straight-line') {
      annualDepreciation = assetValue * depreciationRate;
      accumulatedDepreciation = annualDepreciation * ageInYears;
    } else {
      // Declining balance
      annualDepreciation = assetValue * depreciationRate;
      accumulatedDepreciation = assetValue * (1 - Math.pow(1 - depreciationRate, ageInYears));
    }

    return {
      annualDepreciation,
      accumulatedDepreciation: Math.min(accumulatedDepreciation, assetValue * 0.9), // Cap at 90%
      bookValue: assetValue - Math.min(accumulatedDepreciation, assetValue * 0.9)
    };
  }

  /**
   * Calculate maintenance cost analysis
   */
  static calculateMaintenanceCost(
    laborHours: number,
    laborRate: number,
    partsCost: number,
    partsMarkup: number = 1.2,
    isEmergency: boolean = false,
    emergencyMultiplier: number = 1.5
  ): {
    laborCost: number;
    partsCost: number;
    totalCost: number;
    isEmergency: boolean;
  } {
    const baseLaborCost = laborHours * laborRate;
    const adjustedPartsCost = partsCost * partsMarkup;
    
    const laborCost = isEmergency ? baseLaborCost * emergencyMultiplier : baseLaborCost;
    const totalCost = laborCost + adjustedPartsCost;

    return {
      laborCost,
      partsCost: adjustedPartsCost,
      totalCost,
      isEmergency
    };
  }

  /**
   * Calculate asset utilization metrics
   */
  static calculateUtilization(
    actualUsageHours: number,
    availableHours: number,
    targetUtilization: number = 0.8
  ): {
    utilizationRate: number;
    efficiency: number;
    targetGap: number;
    status: 'under' | 'on-target' | 'over';
  } {
    const utilizationRate = actualUsageHours / availableHours;
    const efficiency = utilizationRate / targetUtilization;
    const targetGap = utilizationRate - targetUtilization;

    let status: 'under' | 'on-target' | 'over';
    if (utilizationRate < targetUtilization * 0.9) status = 'under';
    else if (utilizationRate > targetUtilization * 1.1) status = 'over';
    else status = 'on-target';

    return {
      utilizationRate,
      efficiency,
      targetGap,
      status
    };
  }
}

/**
 * Asset & Maintenance Domain Manager
 * Orchestrates all asset and maintenance-related modules with centralized business logic
 */
export class AssetMaintenanceDomainManager {
  private assetManager: AssetManager;
  private maintenanceManager: MaintenanceManager;
  private config: AssetMaintenanceDomainConfig;

  constructor(config?: Partial<AssetMaintenanceDomainConfig>) {
    this.assetManager = assetManager;
    this.maintenanceManager = maintenanceManager;
    this.config = this.getDefaultConfig();
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  private getDefaultConfig(): AssetMaintenanceDomainConfig {
    return {
      assets: {
        depreciationRates: {
          equipment: 0.15,
          vehicles: 0.20,
          buildings: 0.05,
          technology: 0.25
        },
        maintenanceSchedules: {
          preventive: 12, // every 12 weeks
          predictive: 8,  // every 8 weeks
          emergency: 4    // within 4 hours
        },
        utilizationTargets: {
          equipment: 0.80,
          vehicles: 0.75,
          facilities: 0.90
        }
      },
      maintenance: {
        costFactors: {
          laborRate: 85, // per hour
          partsMarkup: 1.25,
          emergencyMultiplier: 1.8
        },
        kpis: {
          mtbf: 720,  // 30 days
          mttr: 4,    // 4 hours
          availability: 0.98
        }
      }
    };
  }

  /**
   * Perform comprehensive asset analysis
   */
  async performAssetAnalysis(assetPortfolio: string[]): Promise<any> {
    // Placeholder for asset analysis business logic
    const sampleAsset = {
      id: 'asset_001',
      value: 250000,
      age: 3,
      type: 'equipment'
    };

    const depreciation = AssetMaintenanceBusinessLogic.calculateDepreciation(
      sampleAsset.value,
      this.config.assets.depreciationRates.equipment,
      sampleAsset.age
    );

    const utilization = AssetMaintenanceBusinessLogic.calculateUtilization(1600, 2000, 0.8);

    return {
      totalAssets: assetPortfolio.length,
      totalValue: 5250000,
      depreciation,
      utilization,
      maintenanceMetrics: {
        scheduledMaintenance: 145,
        emergencyRepairs: 23,
        averageMTBF: this.config.maintenance.kpis.mtbf,
        averageMTTR: this.config.maintenance.kpis.mttr,
        availability: 0.96
      }
    };
  }

  // Delegate to specific modules for operations
  getAssetManager(): AssetManager {
    return this.assetManager;
  }

  getMaintenanceManager(): MaintenanceManager {
    return this.maintenanceManager;
  }

  getDomainConfig(): AssetMaintenanceDomainConfig {
    return this.config;
  }
}

// Export singleton instance
export const assetMaintenanceDomainManager = new AssetMaintenanceDomainManager();