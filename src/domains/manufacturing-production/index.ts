/**
 * Manufacturing & Production Domain
 * Centralized business logic for manufacturing operations, quality control, and production scheduling
 */

import { manufacturingManager, ManufacturingManager } from '../../modules/manufacturing';
import { qualityManager, QualityManager } from '../../modules/quality';
import { BusinessConfig } from '../../types/business-config';

export interface ManufacturingProductionDomainConfig {
  production: {
    scheduling: {
      setupTimeBuffer: number;
      maintenanceWindow: number;
      capacityUtilization: number;
      rushOrderPremium: number;
    };
    costFactors: {
      laborCostPerHour: number;
      machineCostPerHour: number;
      materialWasteFactor: number;
      qualityControlCost: number;
    };
    efficiency: {
      targetOEE: number; // Overall Equipment Effectiveness
      minThroughput: number;
      maxDefectRate: number;
      downtimeThreshold: number;
    };
  };
  quality: {
    controlLimits: {
      upperControlLimit: number;
      lowerControlLimit: number;
      warningLimit: number;
    };
    sampling: {
      inspectionRate: number;
      batchSampleSize: number;
      criticalSampleSize: number;
    };
    defectCosts: {
      internalFailure: number;
      externalFailure: number;
      preventionCost: number;
      appraisalCost: number;
    };
  };
  bom: {
    complexity: {
      simpleThreshold: number;
      moderateThreshold: number;
      complexMultiplier: number;
    };
    costing: {
      materialMarkup: number;
      laborEfficiency: number;
      overheadAllocation: number;
    };
  };
}

/**
 * Core Business Logic Functions - Manufacturing & Production Domain
 * Consolidated from multiple manufacturing and quality services
 */
export class ManufacturingProductionBusinessLogic {
  
  /**
   * Calculate Overall Equipment Effectiveness (OEE)
   * Consolidated from production monitoring services
   */
  static calculateOEE(
    availableTime: number,
    downtime: number,
    actualProduction: number,
    targetProduction: number,
    goodParts: number,
    totalParts: number,
    config: ManufacturingProductionDomainConfig
  ): {
    availability: number;
    performance: number;
    quality: number;
    oee: number;
    category: 'excellent' | 'good' | 'acceptable' | 'poor';
  } {
    const operatingTime = availableTime - downtime;
    const availability = availableTime > 0 ? operatingTime / availableTime : 0;
    
    const performance = targetProduction > 0 ? actualProduction / targetProduction : 0;
    
    const quality = totalParts > 0 ? goodParts / totalParts : 0;
    
    const oee = availability * performance * quality;
    
    // Categorize OEE performance
    let category: 'excellent' | 'good' | 'acceptable' | 'poor';
    if (oee >= config.production.efficiency.targetOEE) {
      category = 'excellent';
    } else if (oee >= 0.75) {
      category = 'good';
    } else if (oee >= 0.60) {
      category = 'acceptable';
    } else {
      category = 'poor';
    }
    
    return {
      availability: availability * 100,
      performance: performance * 100,
      quality: quality * 100,
      oee: oee * 100,
      category
    };
  }

  /**
   * Calculate production cost with detailed breakdown
   * Advanced manufacturing cost analysis
   */
  static calculateProductionCost(
    bomItems: Array<{
      materialId: string;
      quantity: number;
      unitCost: number;
      scrapRate: number;
    }>,
    laborHours: number,
    machineHours: number,
    overheadRate: number,
    config: ManufacturingProductionDomainConfig
  ): {
    materialCost: number;
    laborCost: number;
    machineCost: number;
    overheadCost: number;
    qualityCost: number;
    totalCost: number;
    costBreakdown: { [key: string]: number };
  } {
    // Calculate material cost with waste factor
    const materialCost = bomItems.reduce((total, item) => {
      const adjustedQuantity = item.quantity * (1 + item.scrapRate + config.production.costFactors.materialWasteFactor);
      return total + (adjustedQuantity * item.unitCost * (1 + config.bom.costing.materialMarkup));
    }, 0);

    // Calculate labor cost with efficiency factor
    const laborCost = laborHours * config.production.costFactors.laborCostPerHour * 
                     (1 / config.bom.costing.laborEfficiency);

    // Calculate machine cost
    const machineCost = machineHours * config.production.costFactors.machineCostPerHour;

    // Calculate overhead cost
    const overheadCost = (materialCost + laborCost + machineCost) * overheadRate * 
                        config.bom.costing.overheadAllocation;

    // Calculate quality control cost
    const qualityCost = (materialCost + laborCost + machineCost) * 
                       config.production.costFactors.qualityControlCost;

    const totalCost = materialCost + laborCost + machineCost + overheadCost + qualityCost;

    const costBreakdown = {
      'Material': materialCost,
      'Labor': laborCost,
      'Machine': machineCost,
      'Overhead': overheadCost,
      'Quality': qualityCost
    };

    return {
      materialCost,
      laborCost,
      machineCost,
      overheadCost,
      qualityCost,
      totalCost,
      costBreakdown
    };
  }

  /**
   * Optimize production schedule using advanced algorithms
   * Production planning and optimization
   */
  static optimizeProductionSchedule(
    workOrders: Array<{
      id: string;
      productId: string;
      quantity: number;
      dueDate: Date;
      priority: number;
      setupTime: number;
      processingTime: number;
    }>,
    resources: Array<{
      id: string;
      capacity: number;
      availableHours: number;
      setupCost: number;
    }>,
    config: ManufacturingProductionDomainConfig
  ): {
    schedule: Array<{
      workOrderId: string;
      resourceId: string;
      startTime: Date;
      endTime: Date;
      utilization: number;
    }>;
    totalMakespan: number;
    resourceUtilization: number;
    onTimeDelivery: number;
  } {
    // Sort work orders by priority and due date
    const sortedOrders = [...workOrders].sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      return a.dueDate.getTime() - b.dueDate.getTime();
    });

    const schedule: Array<{
      workOrderId: string;
      resourceId: string;
      startTime: Date;
      endTime: Date;
      utilization: number;
    }> = [];

    // Resource availability tracking
    const resourceAvailability = resources.map(resource => ({
      id: resource.id,
      nextAvailableTime: new Date(),
      totalUsedTime: 0
    }));

    // Schedule each work order
    for (const order of sortedOrders) {
      let bestResource = null;
      let earliestTime = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // Far future

      // Find the best resource for this order
      for (let i = 0; i < resources.length; i++) {
        const resource = resources[i];
        const availability = resourceAvailability[i];
        
        const totalTime = order.setupTime + order.processingTime + 
                         config.production.scheduling.setupTimeBuffer;
        
        if (availability.totalUsedTime + totalTime <= 
            resource.availableHours * config.production.scheduling.capacityUtilization) {
          
          if (availability.nextAvailableTime < earliestTime) {
            earliestTime = availability.nextAvailableTime;
            bestResource = { resource, availabilityIndex: i };
          }
        }
      }

      if (bestResource) {
        const { resource, availabilityIndex } = bestResource;
        const availability = resourceAvailability[availabilityIndex];
        
        const totalTime = order.setupTime + order.processingTime + 
                         config.production.scheduling.setupTimeBuffer;
        
        const startTime = new Date(availability.nextAvailableTime);
        const endTime = new Date(startTime.getTime() + totalTime * 60 * 60 * 1000);
        
        schedule.push({
          workOrderId: order.id,
          resourceId: resource.id,
          startTime,
          endTime,
          utilization: totalTime / resource.availableHours
        });

        // Update resource availability
        availability.nextAvailableTime = endTime;
        availability.totalUsedTime += totalTime;
      }
    }

    // Calculate metrics
    const totalMakespan = schedule.length > 0 ? 
      Math.max(...schedule.map(s => s.endTime.getTime())) - 
      Math.min(...schedule.map(s => s.startTime.getTime())) : 0;

    const totalResourceCapacity = resources.reduce((sum, r) => sum + r.availableHours, 0);
    const totalUsedCapacity = resourceAvailability.reduce((sum, r) => sum + r.totalUsedTime, 0);
    const resourceUtilization = totalResourceCapacity > 0 ? totalUsedCapacity / totalResourceCapacity : 0;

    const onTimeOrders = schedule.filter(s => {
      const workOrder = workOrders.find(wo => wo.id === s.workOrderId);
      return workOrder ? s.endTime <= workOrder.dueDate : false;
    }).length;
    const onTimeDelivery = schedule.length > 0 ? onTimeOrders / schedule.length : 0;

    return {
      schedule,
      totalMakespan: totalMakespan / (1000 * 60 * 60), // Convert to hours
      resourceUtilization,
      onTimeDelivery
    };
  }

  /**
   * Calculate Six Sigma quality metrics
   * Advanced statistical quality control
   */
  static calculateSixSigmaMetrics(
    measurements: number[],
    targetValue: number,
    tolerances: { upper: number; lower: number },
    config: ManufacturingProductionDomainConfig
  ): {
    cpk: number;
    cp: number;
    sigma: number;
    defectRate: number;
    qualityLevel: string;
    recommendations: string[];
  } {
    if (measurements.length === 0) {
      return {
        cpk: 0, cp: 0, sigma: 0, defectRate: 1,
        qualityLevel: 'insufficient-data',
        recommendations: ['Need more measurement data']
      };
    }

    // Calculate basic statistics
    const mean = measurements.reduce((sum, val) => sum + val, 0) / measurements.length;
    const variance = measurements.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / 
                    (measurements.length - 1);
    const standardDeviation = Math.sqrt(variance);

    // Calculate process capability indices
    const upperSpec = tolerances.upper;
    const lowerSpec = tolerances.lower;
    const specRange = upperSpec - lowerSpec;
    
    const cp = specRange / (6 * standardDeviation);
    
    const cpkUpper = (upperSpec - mean) / (3 * standardDeviation);
    const cpkLower = (mean - lowerSpec) / (3 * standardDeviation);
    const cpk = Math.min(cpkUpper, cpkLower);

    // Calculate sigma level
    const sigma = Math.min(cpkUpper, cpkLower) * 3;

    // Estimate defect rate (simplified)
    const defectsUpper = measurements.filter(m => m > upperSpec).length;
    const defectsLower = measurements.filter(m => m < lowerSpec).length;
    const defectRate = (defectsUpper + defectsLower) / measurements.length;

    // Determine quality level
    let qualityLevel: string;
    if (sigma >= 6) {
      qualityLevel = 'six-sigma';
    } else if (sigma >= 5) {
      qualityLevel = 'five-sigma';
    } else if (sigma >= 4) {
      qualityLevel = 'four-sigma';
    } else if (sigma >= 3) {
      qualityLevel = 'three-sigma';
    } else {
      qualityLevel = 'below-standard';
    }

    // Generate recommendations
    const recommendations: string[] = [];
    if (cpk < 1.0) {
      recommendations.push('Process capability is below acceptable level - investigate root causes');
    }
    if (Math.abs(mean - targetValue) > standardDeviation) {
      recommendations.push('Process is not centered on target - adjust process parameters');
    }
    if (standardDeviation > specRange / 8) {
      recommendations.push('Process variation is too high - implement variation reduction initiatives');
    }
    if (defectRate > config.production.efficiency.maxDefectRate) {
      recommendations.push('Defect rate exceeds target - implement quality improvement program');
    }

    return {
      cpk,
      cp,
      sigma,
      defectRate,
      qualityLevel,
      recommendations
    };
  }
}

/**
 * Manufacturing & Production Domain Manager
 * Orchestrates all manufacturing, quality, and production operations
 */
export class ManufacturingProductionDomainManager {
  constructor(
    private config: ManufacturingProductionDomainConfig,
    private manufacturing: ManufacturingManager = manufacturingManager,
    private quality: QualityManager = qualityManager
  ) {}

  /**
   * Comprehensive manufacturing optimization analysis
   */
  async optimizeManufacturing(): Promise<{
    oeeAnalysis: any;
    costAnalysis: any;
    scheduleOptimization: any;
    qualityMetrics: any;
  }> {
    // Mock data for demonstration
    const oeeAnalysis = ManufacturingProductionBusinessLogic.calculateOEE(
      480, 45, 950, 1000, 920, 950, this.config
    );

    const costAnalysis = ManufacturingProductionBusinessLogic.calculateProductionCost(
      [
        { materialId: 'steel', quantity: 10, unitCost: 50, scrapRate: 0.02 },
        { materialId: 'paint', quantity: 2, unitCost: 25, scrapRate: 0.05 }
      ],
      8, 4, 0.25, this.config
    );

    const scheduleOptimization = ManufacturingProductionBusinessLogic.optimizeProductionSchedule(
      [
        {
          id: 'wo1', productId: 'prod1', quantity: 100, 
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          priority: 8, setupTime: 2, processingTime: 6
        }
      ],
      [
        { id: 'machine1', capacity: 100, availableHours: 40, setupCost: 200 }
      ],
      this.config
    );

    const qualityMetrics = ManufacturingProductionBusinessLogic.calculateSixSigmaMetrics(
      [4.8, 5.1, 4.9, 5.2, 4.7, 5.0, 4.9, 5.1, 4.8, 5.0],
      5.0,
      { upper: 5.5, lower: 4.5 },
      this.config
    );

    return {
      oeeAnalysis,
      costAnalysis,
      scheduleOptimization,
      qualityMetrics
    };
  }

  // Expose individual managers for specific operations
  get managers() {
    return {
      manufacturing: this.manufacturing,
      quality: this.quality
    };
  }
}

// Default configuration
export const defaultManufacturingProductionConfig: ManufacturingProductionDomainConfig = {
  production: {
    scheduling: {
      setupTimeBuffer: 0.25, // 25% buffer for setup
      maintenanceWindow: 2, // 2 hours daily maintenance
      capacityUtilization: 0.85, // 85% target utilization
      rushOrderPremium: 0.15 // 15% premium for rush orders
    },
    costFactors: {
      laborCostPerHour: 35,
      machineCostPerHour: 125,
      materialWasteFactor: 0.03,
      qualityControlCost: 0.05
    },
    efficiency: {
      targetOEE: 0.85, // 85% target OEE
      minThroughput: 0.80,
      maxDefectRate: 0.01, // 1% max defect rate
      downtimeThreshold: 0.05 // 5% max downtime
    }
  },
  quality: {
    controlLimits: {
      upperControlLimit: 3.0,
      lowerControlLimit: -3.0,
      warningLimit: 2.0
    },
    sampling: {
      inspectionRate: 0.10, // Inspect 10% of production
      batchSampleSize: 25,
      criticalSampleSize: 50
    },
    defectCosts: {
      internalFailure: 150, // Cost per internal defect
      externalFailure: 500, // Cost per external defect
      preventionCost: 25, // Cost per prevention activity
      appraisalCost: 50 // Cost per appraisal activity
    }
  },
  bom: {
    complexity: {
      simpleThreshold: 5, // Components
      moderateThreshold: 15, // Components
      complexMultiplier: 1.5 // Complexity cost multiplier
    },
    costing: {
      materialMarkup: 0.05, // 5% material markup
      laborEfficiency: 0.85, // 85% labor efficiency
      overheadAllocation: 1.2 // 120% overhead allocation
    }
  }
};

// Singleton instance
export const manufacturingProductionDomainManager = new ManufacturingProductionDomainManager(
  defaultManufacturingProductionConfig
);