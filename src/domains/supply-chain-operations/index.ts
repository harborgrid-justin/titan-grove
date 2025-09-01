/**
 * Supply Chain & Operations Domain
 * Centralized business logic for supply chain management, procurement, inventory, and logistics
 */

import { scmManager, SCMManager } from '../../modules/scm';
import { procurementManager, ProcurementManager } from '../../modules/procurement';
import { inventoryManager, InventoryManager } from '../../modules/inventory';
import { BusinessConfig } from '../../types/business-config';

export interface SupplyChainOperationsDomainConfig {
  inventory: {
    safetyStockFactors: {
      highVolume: number;
      mediumVolume: number;
      lowVolume: number;
    };
    reorderPoints: {
      leadTimeBuffer: number;
      demandVariability: number;
      serviceLevel: number;
    };
    costFactors: {
      carryingCostRate: number;
      orderingCostBase: number;
      stockoutPenalty: number;
    };
  };
  procurement: {
    supplierScoring: {
      qualityWeight: number;
      deliveryWeight: number;
      costWeight: number;
      serviceWeight: number;
    };
    negotiationFactors: {
      volumeDiscountThreshold: number;
      paymentTermsDiscount: number;
      longTermContractDiscount: number;
    };
  };
  logistics: {
    routeOptimization: {
      distanceWeight: number;
      timeWeight: number;
      costWeight: number;
      capacityUtilization: number;
    };
    transportationCosts: {
      fuelSurcharge: number;
      handlingFee: number;
      insuranceRate: number;
    };
  };
}

/**
 * Core Business Logic Functions - Supply Chain & Operations Domain
 * Consolidated from multiple service files to centralize supply chain calculations
 */
export class SupplyChainOperationsBusinessLogic {
  
  /**
   * Calculate Economic Order Quantity (EOQ) with advanced parameters
   * Consolidated from inventory management services
   */
  static calculateEOQ(
    annualDemand: number,
    orderingCost: number,
    carryingCost: number,
    unitCost: number,
    config: SupplyChainOperationsDomainConfig
  ): {
    economicOrderQuantity: number;
    totalAnnualCost: number;
    orderFrequency: number;
    reorderPoint: number;
  } {
    // Basic EOQ formula with enhancements
    const basicEOQ = Math.sqrt((2 * annualDemand * orderingCost) / (carryingCost * unitCost));
    
    // Apply configuration adjustments
    const adjustedOrderingCost = orderingCost + config.inventory.costFactors.orderingCostBase;
    const adjustedCarryingCost = carryingCost * config.inventory.costFactors.carryingCostRate;
    
    const economicOrderQuantity = Math.sqrt(
      (2 * annualDemand * adjustedOrderingCost) / (adjustedCarryingCost * unitCost)
    );
    
    const totalAnnualCost = 
      (annualDemand / economicOrderQuantity) * adjustedOrderingCost +
      (economicOrderQuantity / 2) * adjustedCarryingCost * unitCost;
    
    const orderFrequency = annualDemand / economicOrderQuantity;
    
    // Calculate reorder point with safety stock
    const leadTimeDemand = annualDemand / 365 * config.inventory.reorderPoints.leadTimeBuffer;
    const safetyStock = leadTimeDemand * config.inventory.reorderPoints.demandVariability;
    const reorderPoint = leadTimeDemand + safetyStock;
    
    return {
      economicOrderQuantity: Math.round(economicOrderQuantity),
      totalAnnualCost,
      orderFrequency,
      reorderPoint: Math.round(reorderPoint)
    };
  }

  /**
   * Calculate comprehensive supplier performance score
   * Consolidated from procurement and supplier management services
   */
  static calculateSupplierScore(
    supplier: {
      qualityRating: number;
      deliveryPerformance: number;
      costCompetitiveness: number;
      serviceLevel: number;
      riskFactors: number;
    },
    config: SupplyChainOperationsDomainConfig
  ): {
    overallScore: number;
    category: 'strategic' | 'approved' | 'conditional' | 'rejected';
    recommendations: string[];
  } {
    const { qualityWeight, deliveryWeight, costWeight, serviceWeight } = config.procurement.supplierScoring;
    
    // Weighted scoring algorithm
    const overallScore = (
      (supplier.qualityRating * qualityWeight) +
      (supplier.deliveryPerformance * deliveryWeight) +
      (supplier.costCompetitiveness * costWeight) +
      (supplier.serviceLevel * serviceWeight)
    ) / (qualityWeight + deliveryWeight + costWeight + serviceWeight);
    
    // Risk-adjusted score
    const riskAdjustedScore = overallScore * (1 - supplier.riskFactors * 0.1);
    
    // Categorize supplier
    let category: 'strategic' | 'approved' | 'conditional' | 'rejected';
    if (riskAdjustedScore >= 85) {
      category = 'strategic';
    } else if (riskAdjustedScore >= 75) {
      category = 'approved';
    } else if (riskAdjustedScore >= 60) {
      category = 'conditional';
    } else {
      category = 'rejected';
    }
    
    // Generate recommendations
    const recommendations: string[] = [];
    if (supplier.qualityRating < 80) {
      recommendations.push('Implement quality improvement program');
    }
    if (supplier.deliveryPerformance < 85) {
      recommendations.push('Review delivery schedules and logistics');
    }
    if (supplier.costCompetitiveness < 70) {
      recommendations.push('Negotiate better pricing terms');
    }
    
    return {
      overallScore: riskAdjustedScore,
      category,
      recommendations
    };
  }

  /**
   * Optimize route planning with multiple constraints
   * Advanced logistics optimization algorithm
   */
  static optimizeRoutes(
    deliveries: Array<{
      id: string;
      location: { lat: number; lng: number };
      demand: number;
      timeWindow: { start: number; end: number };
      priority: number;
    }>,
    vehicles: Array<{
      id: string;
      capacity: number;
      costPerKm: number;
      maxDuration: number;
    }>,
    config: SupplyChainOperationsDomainConfig
  ): {
    routes: Array<{
      vehicleId: string;
      deliveries: string[];
      totalDistance: number;
      totalCost: number;
      utilization: number;
    }>;
    totalCost: number;
    efficiency: number;
  } {
    // Simplified route optimization algorithm (in practice, would use more sophisticated methods)
    const routes: Array<{
      vehicleId: string;
      deliveries: string[];
      totalDistance: number;
      totalCost: number;
      utilization: number;
    }> = [];
    
    const { distanceWeight, timeWeight, costWeight, capacityUtilization } = config.logistics.routeOptimization;
    
    // Assign deliveries to vehicles based on capacity and constraints
    let remainingDeliveries = [...deliveries];
    
    for (const vehicle of vehicles) {
      const route = {
        vehicleId: vehicle.id,
        deliveries: [] as string[],
        totalDistance: 0,
        totalCost: 0,
        utilization: 0
      };
      
      let currentCapacity = 0;
      let currentTime = 0;
      
      // Greedy assignment with optimization factors
      while (remainingDeliveries.length > 0 && currentCapacity < vehicle.capacity * capacityUtilization) {
        let bestDelivery: typeof deliveries[0] | null = null;
        let bestScore = -1;
        let bestIndex = -1;
        
        for (let i = 0; i < remainingDeliveries.length; i++) {
          const delivery = remainingDeliveries[i];
          
          if (currentCapacity + delivery.demand <= vehicle.capacity) {
            // Calculate delivery score based on multiple factors
            const distanceScore = 1 / (1 + Math.abs(delivery.location.lat - 0) + Math.abs(delivery.location.lng - 0));
            const timeScore = delivery.timeWindow.end > currentTime ? 1 : 0.5;
            const priorityScore = delivery.priority / 10;
            
            const score = (
              distanceScore * distanceWeight +
              timeScore * timeWeight +
              priorityScore * (1 - costWeight)
            );
            
            if (score > bestScore) {
              bestScore = score;
              bestDelivery = delivery;
              bestIndex = i;
            }
          }
        }
        
        if (bestDelivery) {
          route.deliveries.push(bestDelivery.id);
          currentCapacity += bestDelivery.demand;
          currentTime = Math.max(currentTime + 30, bestDelivery.timeWindow.start); // 30 min travel time
          remainingDeliveries.splice(bestIndex, 1);
        } else {
          break;
        }
      }
      
      // Calculate route metrics
      route.totalDistance = route.deliveries.length * 25; // Simplified distance calculation
      route.totalCost = route.totalDistance * vehicle.costPerKm + 
                       config.logistics.transportationCosts.fuelSurcharge +
                       config.logistics.transportationCosts.handlingFee;
      route.utilization = currentCapacity / vehicle.capacity;
      
      if (route.deliveries.length > 0) {
        routes.push(route);
      }
    }
    
    const totalCost = routes.reduce((sum, route) => sum + route.totalCost, 0);
    const totalDistance = routes.reduce((sum, route) => sum + route.totalDistance, 0);
    const efficiency = deliveries.length > 0 ? (deliveries.length - remainingDeliveries.length) / deliveries.length : 0;
    
    return {
      routes,
      totalCost,
      efficiency
    };
  }

  /**
   * Calculate inventory turnover and optimization metrics
   * Advanced inventory analytics
   */
  static calculateInventoryMetrics(
    items: Array<{
      id: string;
      category: string;
      annualUsage: number;
      averageInventory: number;
      unitCost: number;
      leadTime: number;
    }>,
    config: SupplyChainOperationsDomainConfig
  ): {
    overallTurnover: number;
    abcAnalysis: Array<{ id: string; category: 'A' | 'B' | 'C'; value: number }>;
    optimizationRecommendations: string[];
  } {
    // Calculate inventory turnover
    const totalAnnualUsage = items.reduce((sum, item) => sum + item.annualUsage * item.unitCost, 0);
    const totalAverageInventory = items.reduce((sum, item) => sum + item.averageInventory * item.unitCost, 0);
    const overallTurnover = totalAverageInventory > 0 ? totalAnnualUsage / totalAverageInventory : 0;
    
    // ABC Analysis
    const itemsWithValue = items.map(item => ({
      id: item.id,
      value: item.annualUsage * item.unitCost,
      percentage: 0
    }));
    
    itemsWithValue.sort((a, b) => b.value - a.value);
    
    let cumulativeValue = 0;
    const abcAnalysis = itemsWithValue.map(item => {
      cumulativeValue += item.value;
      const percentage = cumulativeValue / totalAnnualUsage;
      
      let category: 'A' | 'B' | 'C';
      if (percentage <= 0.8) {
        category = 'A'; // Top 80% of value
      } else if (percentage <= 0.95) {
        category = 'B'; // Next 15% of value
      } else {
        category = 'C'; // Bottom 5% of value
      }
      
      return {
        id: item.id,
        category,
        value: item.value
      };
    });
    
    // Generate optimization recommendations
    const optimizationRecommendations: string[] = [];
    
    if (overallTurnover < 6) {
      optimizationRecommendations.push('Overall inventory turnover is low - consider reducing stock levels');
    }
    
    const lowTurnoverItems = items.filter(item => {
      const turnover = item.averageInventory > 0 ? item.annualUsage / item.averageInventory : 0;
      return turnover < 4;
    });
    
    if (lowTurnoverItems.length > items.length * 0.2) {
      optimizationRecommendations.push('High number of slow-moving items - review stocking policies');
    }
    
    const highValueItems = abcAnalysis.filter(item => item.category === 'A').length;
    if (highValueItems > items.length * 0.3) {
      optimizationRecommendations.push('Consider more frequent ordering for high-value items');
    }
    
    return {
      overallTurnover,
      abcAnalysis,
      optimizationRecommendations
    };
  }
}

/**
 * Supply Chain & Operations Domain Manager
 * Orchestrates all supply chain, procurement, inventory, and logistics operations
 */
export class SupplyChainOperationsDomainManager {
  constructor(
    private config: SupplyChainOperationsDomainConfig,
    private scm: SCMManager = scmManager,
    private procurement: ProcurementManager = procurementManager,
    private inventory: InventoryManager = inventoryManager
  ) {}

  /**
   * Comprehensive supply chain optimization analysis
   */
  async optimizeSupplyChain(): Promise<{
    inventoryOptimization: any;
    supplierPerformance: any;
    routeOptimization: any;
    inventoryAnalytics: any;
  }> {
    // Mock data for demonstration
    const inventoryOptimization = SupplyChainOperationsBusinessLogic.calculateEOQ(
      10000, 250, 0.25, 50, this.config
    );

    const supplierPerformance = SupplyChainOperationsBusinessLogic.calculateSupplierScore(
      {
        qualityRating: 88,
        deliveryPerformance: 92,
        costCompetitiveness: 75,
        serviceLevel: 85,
        riskFactors: 0.15
      },
      this.config
    );

    const routeOptimization = SupplyChainOperationsBusinessLogic.optimizeRoutes(
      [
        { id: '1', location: { lat: 40.7128, lng: -74.0060 }, demand: 100, timeWindow: { start: 8, end: 17 }, priority: 8 },
        { id: '2', location: { lat: 40.7589, lng: -73.9851 }, demand: 150, timeWindow: { start: 9, end: 16 }, priority: 9 }
      ],
      [
        { id: 'truck1', capacity: 500, costPerKm: 2.5, maxDuration: 8 }
      ],
      this.config
    );

    const inventoryAnalytics = SupplyChainOperationsBusinessLogic.calculateInventoryMetrics(
      [
        { id: 'item1', category: 'raw-materials', annualUsage: 5000, averageInventory: 500, unitCost: 25, leadTime: 14 },
        { id: 'item2', category: 'finished-goods', annualUsage: 2000, averageInventory: 200, unitCost: 100, leadTime: 7 }
      ],
      this.config
    );

    return {
      inventoryOptimization,
      supplierPerformance,
      routeOptimization,
      inventoryAnalytics
    };
  }

  // Expose individual managers for specific operations
  get managers() {
    return {
      scm: this.scm,
      procurement: this.procurement,
      inventory: this.inventory
    };
  }
}

// Default configuration
export const defaultSupplyChainOperationsConfig: SupplyChainOperationsDomainConfig = {
  inventory: {
    safetyStockFactors: {
      highVolume: 0.15,
      mediumVolume: 0.25,
      lowVolume: 0.35
    },
    reorderPoints: {
      leadTimeBuffer: 14,
      demandVariability: 0.20,
      serviceLevel: 0.95
    },
    costFactors: {
      carryingCostRate: 0.25,
      orderingCostBase: 100,
      stockoutPenalty: 0.05
    }
  },
  procurement: {
    supplierScoring: {
      qualityWeight: 0.30,
      deliveryWeight: 0.25,
      costWeight: 0.25,
      serviceWeight: 0.20
    },
    negotiationFactors: {
      volumeDiscountThreshold: 100000,
      paymentTermsDiscount: 0.02,
      longTermContractDiscount: 0.05
    }
  },
  logistics: {
    routeOptimization: {
      distanceWeight: 0.40,
      timeWeight: 0.30,
      costWeight: 0.20,
      capacityUtilization: 0.85
    },
    transportationCosts: {
      fuelSurcharge: 50,
      handlingFee: 25,
      insuranceRate: 0.005
    }
  }
};

// Singleton instance
export const supplyChainOperationsDomainManager = new SupplyChainOperationsDomainManager(
  defaultSupplyChainOperationsConfig
);