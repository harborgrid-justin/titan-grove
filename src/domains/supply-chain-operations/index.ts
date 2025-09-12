/**
 * Supply Chain & Operations Domain
 * Centralized business logic for supply chain management, procurement, inventory, and logistics
 *
 * @author Titan Grove Development Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { scmManager, SCMManager } from '../../modules/scm';
import { procurementManager, ProcurementManager } from '../../modules/procurement';
import { inventoryManager, InventoryManager } from '../../modules/inventory';
import { BusinessConfig } from '../../types/business-config';

/**
 * Custom error classes for supply chain domain-specific error handling
 */
export class SupplyChainDomainError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'SupplyChainDomainError';
  }
}

export class InvalidInventoryParametersError extends SupplyChainDomainError {
  constructor(details: any) {
    super('Invalid inventory parameters provided', 'INVALID_INVENTORY_PARAMETERS', details);
  }
}

export class SupplierEvaluationError extends SupplyChainDomainError {
  constructor(details: any) {
    super('Supplier evaluation calculation failed', 'SUPPLIER_EVALUATION_ERROR', details);
  }
}

export class LogisticsOptimizationError extends SupplyChainDomainError {
  constructor(details: any) {
    super('Logistics optimization calculation failed', 'LOGISTICS_OPTIMIZATION_ERROR', details);
  }
}

/**
 * Supply chain parameters validation utilities
 */
export class SupplyChainParametersValidator {
  /**
   * Validates EOQ calculation parameters
   * @param params - The EOQ parameters to validate
   * @throws {InvalidInventoryParametersError} If parameters are invalid
   */
  static validateEOQParameters(params: {
    annualDemand: number;
    orderingCost: number;
    carryingCost: number;
    unitCost: number;
  }): void {
    const errors: string[] = [];

    if (typeof params.annualDemand !== 'number' || params.annualDemand <= 0) {
      errors.push('Annual demand must be a positive number');
    }

    if (typeof params.orderingCost !== 'number' || params.orderingCost <= 0) {
      errors.push('Ordering cost must be a positive number');
    }

    if (typeof params.carryingCost !== 'number' || params.carryingCost <= 0) {
      errors.push('Carrying cost must be a positive number');
    }

    if (typeof params.unitCost !== 'number' || params.unitCost <= 0) {
      errors.push('Unit cost must be a positive number');
    }

    // Business logic validations
    if (params.carryingCost > params.unitCost) {
      errors.push('Carrying cost cannot exceed unit cost');
    }

    if (params.orderingCost > params.unitCost * 1000) {
      errors.push('Ordering cost seems unreasonably high compared to unit cost');
    }

    if (errors.length > 0) {
      throw new InvalidInventoryParametersError({ errors, providedParams: params });
    }
  }

  /**
   * Validates supplier scoring parameters
   * @param suppliers - The supplier data to validate
   * @throws {SupplierEvaluationError} If supplier data is invalid
   */
  static validateSupplierScoringParameters(
    suppliers: Array<{
      id: string;
      qualityScore: number;
      deliveryScore: number;
      costScore: number;
      serviceScore: number;
    }>
  ): void {
    if (!Array.isArray(suppliers) || suppliers.length === 0) {
      throw new SupplierEvaluationError({
        message: 'Suppliers must be a non-empty array',
        providedSuppliers: suppliers,
      });
    }

    suppliers.forEach((supplier, index) => {
      const errors: string[] = [];

      if (!supplier.id || typeof supplier.id !== 'string') {
        errors.push(`Supplier at index ${index} must have a valid ID`);
      }

      ['qualityScore', 'deliveryScore', 'costScore', 'serviceScore'].forEach((scoreField) => {
        const score = supplier[scoreField as keyof typeof supplier];
        if (typeof score !== 'number' || score < 0 || score > 100) {
          errors.push(`${scoreField} at index ${index} must be a number between 0 and 100`);
        }
      });

      if (errors.length > 0) {
        throw new SupplierEvaluationError({ errors, supplierIndex: index, supplier });
      }
    });
  }
}

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
 * Production-grade business logic with comprehensive error handling and validation
 *
 * This class centralizes all supply chain calculations and provides standardized
 * business logic across the supply chain and operations domain.
 */
export class SupplyChainOperationsBusinessLogic {
  private static readonly EOQ_CALCULATION_CONSTANTS = {
    DAYS_PER_YEAR: 365,
    EOQ_FORMULA_MULTIPLIER: 2,
    MIN_SAFETY_STOCK_FACTOR: 0.1,
    MAX_SAFETY_STOCK_FACTOR: 0.5,
  } as const;

  private static readonly SUPPLIER_SCORING_WEIGHTS = {
    DEFAULT_QUALITY_WEIGHT: 0.3,
    DEFAULT_DELIVERY_WEIGHT: 0.25,
    DEFAULT_COST_WEIGHT: 0.25,
    DEFAULT_SERVICE_WEIGHT: 0.2,
  } as const;

  /**
   * Calculate Economic Order Quantity (EOQ) with advanced validation and error handling
   *
   * Implements the classic EOQ model with modern enhancements including safety stock
   * calculations, lead time considerations, and configurable cost factors. Provides
   * comprehensive inventory optimization analysis.
   *
   * @param inventoryDemandParameters - Annual demand and cost parameters
   * @param domainConfig - Domain-specific configuration for calculations
   * @returns Comprehensive EOQ analysis with optimization metrics
   * @throws {InvalidInventoryParametersError} When parameters are invalid
   *
   * @example
   * ```typescript
   * const eoqAnalysis = SupplyChainOperationsBusinessLogic.calculateEconomicOrderQuantity(
   *   {
   *     annualDemand: 12000,
   *     orderingCost: 50,
   *     carryingCost: 2.5,
   *     unitCost: 10
   *   },
   *   domainConfig
   * );
   * ```
   */
  static calculateEconomicOrderQuantity(
    inventoryDemandParameters: {
      annualDemand: number;
      orderingCost: number;
      carryingCost: number;
      unitCost: number;
    },
    domainConfig: SupplyChainOperationsDomainConfig
  ): {
    economicOrderQuantity: number;
    totalAnnualCost: number;
    orderFrequency: number;
    reorderPoint: number;
    safetyStockLevel: number;
    analysisDetails: {
      basicEOQ: number;
      adjustedOrderingCost: number;
      adjustedCarryingCost: number;
      leadTimeDemand: number;
      costBreakdown: {
        orderingCosts: number;
        carryingCosts: number;
      };
    };
  } {
    // Input validation
    SupplyChainParametersValidator.validateEOQParameters(inventoryDemandParameters);

    try {
      const { annualDemand, orderingCost, carryingCost, unitCost } = inventoryDemandParameters;

      // Calculate basic EOQ using classic formula
      const basicEOQCalculation = this.calculateBasicEOQ(
        annualDemand,
        orderingCost,
        carryingCost,
        unitCost
      );

      // Apply domain configuration adjustments
      const adjustedCostParameters = this.calculateAdjustedCostParameters(
        orderingCost,
        carryingCost,
        domainConfig
      );

      // Calculate optimized EOQ with adjustments
      const optimizedEOQ = this.calculateOptimizedEOQ(
        annualDemand,
        adjustedCostParameters.orderingCost,
        adjustedCostParameters.carryingCost,
        unitCost
      );

      // Calculate total annual cost
      const totalAnnualCostCalculation = this.calculateTotalAnnualInventoryCost(
        annualDemand,
        optimizedEOQ,
        adjustedCostParameters.orderingCost,
        adjustedCostParameters.carryingCost,
        unitCost
      );

      // Calculate order frequency
      const orderFrequencyPerYear = this.calculateOrderFrequency(annualDemand, optimizedEOQ);

      // Calculate reorder point with safety stock
      const reorderPointAnalysis = this.calculateReorderPointWithSafetyStock(
        annualDemand,
        domainConfig
      );

      return {
        economicOrderQuantity: optimizedEOQ,
        totalAnnualCost: totalAnnualCostCalculation.totalCost,
        orderFrequency: orderFrequencyPerYear,
        reorderPoint: reorderPointAnalysis.reorderPoint,
        safetyStockLevel: reorderPointAnalysis.safetyStock,
        analysisDetails: {
          basicEOQ: basicEOQCalculation,
          adjustedOrderingCost: adjustedCostParameters.orderingCost,
          adjustedCarryingCost: adjustedCostParameters.carryingCost,
          leadTimeDemand: reorderPointAnalysis.leadTimeDemand,
          costBreakdown: totalAnnualCostCalculation.breakdown,
        },
      };
    } catch (error) {
      if (error instanceof InvalidInventoryParametersError) {
        throw error;
      }

      throw new SupplyChainDomainError(
        'Failed to calculate Economic Order Quantity',
        'EOQ_CALCULATION_ERROR',
        { originalError: error, parameters: inventoryDemandParameters }
      );
    }
  }

  /**
   * Calculate basic EOQ using classic formula
   * @private
   */
  private static calculateBasicEOQ(
    annualDemand: number,
    orderingCost: number,
    carryingCost: number,
    unitCost: number
  ): number {
    return Math.sqrt(
      (this.EOQ_CALCULATION_CONSTANTS.EOQ_FORMULA_MULTIPLIER * annualDemand * orderingCost) /
        (carryingCost * unitCost)
    );
  }

  /**
   * Calculate adjusted cost parameters based on domain configuration
   * @private
   */
  private static calculateAdjustedCostParameters(
    baseOrderingCost: number,
    baseCarryingCost: number,
    domainConfig: SupplyChainOperationsDomainConfig
  ): { orderingCost: number; carryingCost: number } {
    const adjustedOrderingCost =
      baseOrderingCost + domainConfig.inventory.costFactors.orderingCostBase;
    const adjustedCarryingCost =
      baseCarryingCost * domainConfig.inventory.costFactors.carryingCostRate;

    return {
      orderingCost: adjustedOrderingCost,
      carryingCost: adjustedCarryingCost,
    };
  }

  /**
   * Calculate optimized EOQ with adjusted parameters
   * @private
   */
  private static calculateOptimizedEOQ(
    annualDemand: number,
    adjustedOrderingCost: number,
    adjustedCarryingCost: number,
    unitCost: number
  ): number {
    return Math.sqrt(
      (this.EOQ_CALCULATION_CONSTANTS.EOQ_FORMULA_MULTIPLIER *
        annualDemand *
        adjustedOrderingCost) /
        (adjustedCarryingCost * unitCost)
    );
  }

  /**
   * Calculate total annual inventory cost
   * @private
   */
  private static calculateTotalAnnualInventoryCost(
    annualDemand: number,
    economicOrderQuantity: number,
    orderingCost: number,
    carryingCost: number,
    unitCost: number
  ): { totalCost: number; breakdown: { orderingCosts: number; carryingCosts: number } } {
    const annualOrderingCosts = (annualDemand / economicOrderQuantity) * orderingCost;
    const annualCarryingCosts = (economicOrderQuantity / 2) * carryingCost * unitCost;

    return {
      totalCost: annualOrderingCosts + annualCarryingCosts,
      breakdown: {
        orderingCosts: annualOrderingCosts,
        carryingCosts: annualCarryingCosts,
      },
    };
  }

  /**
   * Calculate order frequency per year
   * @private
   */
  private static calculateOrderFrequency(
    annualDemand: number,
    economicOrderQuantity: number
  ): number {
    return annualDemand / economicOrderQuantity;
  }

  /**
   * Calculate reorder point with safety stock considerations
   * @private
   */
  private static calculateReorderPointWithSafetyStock(
    annualDemand: number,
    domainConfig: SupplyChainOperationsDomainConfig
  ): { reorderPoint: number; safetyStock: number; leadTimeDemand: number } {
    const dailyDemand = annualDemand / this.EOQ_CALCULATION_CONSTANTS.DAYS_PER_YEAR;
    const leadTimeDemand = dailyDemand * domainConfig.inventory.reorderPoints.leadTimeBuffer;
    const safetyStock = leadTimeDemand * domainConfig.inventory.reorderPoints.demandVariability;
    const reorderPoint = leadTimeDemand + safetyStock;

    return {
      reorderPoint,
      safetyStock,
      leadTimeDemand,
    };
  }

  /**
   * Calculate comprehensive supplier performance evaluation with detailed scoring
   *
   * Evaluates suppliers across multiple dimensions including quality, delivery,
   * cost competitiveness, and service level. Applies risk adjustments and provides
   * strategic categorization with actionable recommendations.
   *
   * @param supplierPerformanceMetrics - Comprehensive supplier performance data
   * @param domainConfig - Domain-specific configuration for supplier evaluation
   * @returns Detailed supplier evaluation with scoring and recommendations
   * @throws {SupplierEvaluationError} When evaluation fails
   *
   * @example
   * ```typescript
   * const supplierEvaluation = SupplyChainOperationsBusinessLogic.calculateSupplierPerformanceEvaluation(
   *   {
   *     qualityRating: 85,
   *     deliveryPerformance: 90,
   *     costCompetitiveness: 80,
   *     serviceLevel: 88,
   *     riskFactors: 0.15
   *   },
   *   domainConfig
   * );
   * ```
   */
  static calculateSupplierPerformanceEvaluation(
    supplierPerformanceMetrics: {
      qualityRating: number;
      deliveryPerformance: number;
      costCompetitiveness: number;
      serviceLevel: number;
      riskFactors: number;
    },
    domainConfig: SupplyChainOperationsDomainConfig
  ): {
    overallPerformanceScore: number;
    riskAdjustedScore: number;
    supplierCategory: 'strategic' | 'approved' | 'conditional' | 'rejected';
    strategicRecommendations: string[];
    evaluationDetails: {
      scoringBreakdown: {
        qualityContribution: number;
        deliveryContribution: number;
        costContribution: number;
        serviceContribution: number;
      };
      riskImpact: number;
      categoryThresholds: {
        strategic: number;
        approved: number;
        conditional: number;
      };
    };
  } {
    // Input validation
    this.validateSupplierPerformanceMetrics(supplierPerformanceMetrics);

    try {
      const scoringWeights = domainConfig.procurement.supplierScoring;

      // Calculate weighted performance score with detailed breakdown
      const scoringBreakdown = this.calculateSupplierScoringBreakdown(
        supplierPerformanceMetrics,
        scoringWeights
      );

      const overallPerformanceScore = this.calculateWeightedSupplierScore(
        scoringBreakdown,
        scoringWeights
      );

      // Apply risk adjustment
      const riskAdjustmentCalculation = this.calculateSupplierRiskAdjustment(
        overallPerformanceScore,
        supplierPerformanceMetrics.riskFactors
      );

      // Determine supplier category based on risk-adjusted score
      const supplierCategorization = this.determineSupplierCategory(
        riskAdjustmentCalculation.riskAdjustedScore
      );

      // Generate strategic recommendations
      const strategicRecommendations = this.generateSupplierPerformanceRecommendations(
        supplierPerformanceMetrics,
        riskAdjustmentCalculation.riskAdjustedScore,
        supplierCategorization.category
      );

      return {
        overallPerformanceScore,
        riskAdjustedScore: riskAdjustmentCalculation.riskAdjustedScore,
        supplierCategory: supplierCategorization.category,
        strategicRecommendations,
        evaluationDetails: {
          scoringBreakdown,
          riskImpact: riskAdjustmentCalculation.riskImpact,
          categoryThresholds: supplierCategorization.thresholds,
        },
      };
    } catch (error) {
      if (error instanceof SupplierEvaluationError) {
        throw error;
      }

      throw new SupplyChainDomainError(
        'Failed to calculate supplier performance evaluation',
        'SUPPLIER_EVALUATION_ERROR',
        { originalError: error, metrics: supplierPerformanceMetrics }
      );
    }
  }

  /**
   * Validate supplier performance metrics
   * @private
   */
  private static validateSupplierPerformanceMetrics(metrics: {
    qualityRating: number;
    deliveryPerformance: number;
    costCompetitiveness: number;
    serviceLevel: number;
    riskFactors: number;
  }): void {
    const errors: string[] = [];

    // Validate performance ratings (should be 0-100)
    ['qualityRating', 'deliveryPerformance', 'costCompetitiveness', 'serviceLevel'].forEach(
      (metric) => {
        const value = metrics[metric as keyof typeof metrics];
        if (typeof value !== 'number' || value < 0 || value > 100) {
          errors.push(`${metric} must be a number between 0 and 100`);
        }
      }
    );

    // Validate risk factors (should be 0-1)
    if (
      typeof metrics.riskFactors !== 'number' ||
      metrics.riskFactors < 0 ||
      metrics.riskFactors > 1
    ) {
      errors.push('Risk factors must be a number between 0 and 1');
    }

    if (errors.length > 0) {
      throw new SupplierEvaluationError({ errors, providedMetrics: metrics });
    }
  }

  /**
   * Calculate detailed scoring breakdown for supplier evaluation
   * @private
   */
  private static calculateSupplierScoringBreakdown(
    metrics: {
      qualityRating: number;
      deliveryPerformance: number;
      costCompetitiveness: number;
      serviceLevel: number;
    },
    weights: {
      qualityWeight: number;
      deliveryWeight: number;
      costWeight: number;
      serviceWeight: number;
    }
  ): {
    qualityContribution: number;
    deliveryContribution: number;
    costContribution: number;
    serviceContribution: number;
  } {
    return {
      qualityContribution: metrics.qualityRating * weights.qualityWeight,
      deliveryContribution: metrics.deliveryPerformance * weights.deliveryWeight,
      costContribution: metrics.costCompetitiveness * weights.costWeight,
      serviceContribution: metrics.serviceLevel * weights.serviceWeight,
    };
  }

  /**
   * Calculate weighted supplier score
   * @private
   */
  private static calculateWeightedSupplierScore(
    scoringBreakdown: {
      qualityContribution: number;
      deliveryContribution: number;
      costContribution: number;
      serviceContribution: number;
    },
    weights: {
      qualityWeight: number;
      deliveryWeight: number;
      costWeight: number;
      serviceWeight: number;
    }
  ): number {
    const totalWeightedScore =
      scoringBreakdown.qualityContribution +
      scoringBreakdown.deliveryContribution +
      scoringBreakdown.costContribution +
      scoringBreakdown.serviceContribution;

    const totalWeights =
      weights.qualityWeight + weights.deliveryWeight + weights.costWeight + weights.serviceWeight;

    return totalWeights > 0 ? totalWeightedScore / totalWeights : 0;
  }

  /**
   * Calculate risk adjustment for supplier score
   * @private
   */
  private static calculateSupplierRiskAdjustment(
    baseScore: number,
    riskFactors: number
  ): { riskAdjustedScore: number; riskImpact: number } {
    const RISK_IMPACT_MULTIPLIER = 0.1;
    const riskImpact = riskFactors * RISK_IMPACT_MULTIPLIER;
    const riskAdjustedScore = baseScore * (1 - riskImpact);

    return {
      riskAdjustedScore: Math.max(0, riskAdjustedScore),
      riskImpact,
    };
  }

  /**
   * Determine supplier category based on risk-adjusted score
   * @private
   */
  private static determineSupplierCategory(riskAdjustedScore: number): {
    category: 'strategic' | 'approved' | 'conditional' | 'rejected';
    thresholds: { strategic: number; approved: number; conditional: number };
  } {
    const CATEGORY_THRESHOLDS = {
      STRATEGIC: 85,
      APPROVED: 75,
      CONDITIONAL: 60,
    } as const;

    let category: 'strategic' | 'approved' | 'conditional' | 'rejected';

    if (riskAdjustedScore >= CATEGORY_THRESHOLDS.STRATEGIC) {
      category = 'strategic';
    } else if (riskAdjustedScore >= CATEGORY_THRESHOLDS.APPROVED) {
      category = 'approved';
    } else if (riskAdjustedScore >= CATEGORY_THRESHOLDS.CONDITIONAL) {
      category = 'conditional';
    } else {
      category = 'rejected';
    }

    return {
      category,
      thresholds: {
        strategic: CATEGORY_THRESHOLDS.STRATEGIC,
        approved: CATEGORY_THRESHOLDS.APPROVED,
        conditional: CATEGORY_THRESHOLDS.CONDITIONAL,
      },
    };
  }

  /**
   * Generate strategic recommendations for supplier performance
   * @private
   */
  private static generateSupplierPerformanceRecommendations(
    metrics: {
      qualityRating: number;
      deliveryPerformance: number;
      costCompetitiveness: number;
      serviceLevel: number;
      riskFactors: number;
    },
    riskAdjustedScore: number,
    category: 'strategic' | 'approved' | 'conditional' | 'rejected'
  ): string[] {
    const recommendations: string[] = [];

    const PERFORMANCE_THRESHOLDS = {
      EXCELLENT: 90,
      GOOD: 80,
      ACCEPTABLE: 70,
      POOR: 60,
    } as const;

    // Quality-based recommendations
    if (metrics.qualityRating < PERFORMANCE_THRESHOLDS.GOOD) {
      recommendations.push('Implement quality improvement program with supplier');
    }

    // Delivery-based recommendations
    if (metrics.deliveryPerformance < PERFORMANCE_THRESHOLDS.GOOD) {
      recommendations.push('Establish delivery performance monitoring and improvement plans');
    }

    // Cost-based recommendations
    if (metrics.costCompetitiveness < PERFORMANCE_THRESHOLDS.GOOD) {
      recommendations.push('Negotiate cost reduction initiatives or explore alternative suppliers');
    }

    // Service-based recommendations
    if (metrics.serviceLevel < PERFORMANCE_THRESHOLDS.GOOD) {
      recommendations.push('Enhance service level agreements and communication protocols');
    }

    // Risk-based recommendations
    if (metrics.riskFactors > 0.2) {
      recommendations.push('Develop risk mitigation strategies and contingency plans');
    }

    // Category-specific recommendations
    switch (category) {
      case 'strategic':
        recommendations.push(
          'Consider long-term partnership agreements and collaborative innovation'
        );
        break;
      case 'approved':
        recommendations.push('Monitor performance regularly and explore expansion opportunities');
        break;
      case 'conditional':
        recommendations.push('Implement performance improvement plan with specific milestones');
        break;
      case 'rejected':
        recommendations.push('Phase out relationship and identify alternative suppliers');
        break;
    }

    return recommendations;
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

    const { distanceWeight, timeWeight, costWeight, capacityUtilization } =
      config.logistics.routeOptimization;

    // Assign deliveries to vehicles based on capacity and constraints
    const remainingDeliveries = [...deliveries];

    for (const vehicle of vehicles) {
      const route = {
        vehicleId: vehicle.id,
        deliveries: [] as string[],
        totalDistance: 0,
        totalCost: 0,
        utilization: 0,
      };

      let currentCapacity = 0;
      let currentTime = 0;

      // Greedy assignment with optimization factors
      while (
        remainingDeliveries.length > 0 &&
        currentCapacity < vehicle.capacity * capacityUtilization
      ) {
        let bestDelivery: (typeof deliveries)[0] | null = null;
        let bestScore = -1;
        let bestIndex = -1;

        for (let i = 0; i < remainingDeliveries.length; i++) {
          const delivery = remainingDeliveries[i];

          if (currentCapacity + delivery.demand <= vehicle.capacity) {
            // Calculate delivery score based on multiple factors
            const distanceScore =
              1 / (1 + Math.abs(delivery.location.lat - 0) + Math.abs(delivery.location.lng - 0));
            const timeScore = delivery.timeWindow.end > currentTime ? 1 : 0.5;
            const priorityScore = delivery.priority / 10;

            const score =
              distanceScore * distanceWeight +
              timeScore * timeWeight +
              priorityScore * (1 - costWeight);

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
      route.totalCost =
        route.totalDistance * vehicle.costPerKm +
        config.logistics.transportationCosts.fuelSurcharge +
        config.logistics.transportationCosts.handlingFee;
      route.utilization = currentCapacity / vehicle.capacity;

      if (route.deliveries.length > 0) {
        routes.push(route);
      }
    }

    const totalCost = routes.reduce((sum, route) => sum + route.totalCost, 0);
    const totalDistance = routes.reduce((sum, route) => sum + route.totalDistance, 0);
    const efficiency =
      deliveries.length > 0
        ? (deliveries.length - remainingDeliveries.length) / deliveries.length
        : 0;

    return {
      routes,
      totalCost,
      efficiency,
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
    const totalAverageInventory = items.reduce(
      (sum, item) => sum + item.averageInventory * item.unitCost,
      0
    );
    const overallTurnover =
      totalAverageInventory > 0 ? totalAnnualUsage / totalAverageInventory : 0;

    // ABC Analysis
    const itemsWithValue = items.map((item) => ({
      id: item.id,
      value: item.annualUsage * item.unitCost,
      percentage: 0,
    }));

    itemsWithValue.sort((a, b) => b.value - a.value);

    let cumulativeValue = 0;
    const abcAnalysis = itemsWithValue.map((item) => {
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
        value: item.value,
      };
    });

    // Generate optimization recommendations
    const optimizationRecommendations: string[] = [];

    if (overallTurnover < 6) {
      optimizationRecommendations.push(
        'Overall inventory turnover is low - consider reducing stock levels'
      );
    }

    const lowTurnoverItems = items.filter((item) => {
      const turnover = item.averageInventory > 0 ? item.annualUsage / item.averageInventory : 0;
      return turnover < 4;
    });

    if (lowTurnoverItems.length > items.length * 0.2) {
      optimizationRecommendations.push(
        'High number of slow-moving items - review stocking policies'
      );
    }

    const highValueItems = abcAnalysis.filter((item) => item.category === 'A').length;
    if (highValueItems > items.length * 0.3) {
      optimizationRecommendations.push('Consider more frequent ordering for high-value items');
    }

    return {
      overallTurnover,
      abcAnalysis,
      optimizationRecommendations,
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
      10000,
      250,
      0.25,
      50,
      this.config
    );

    const supplierPerformance = SupplyChainOperationsBusinessLogic.calculateSupplierScore(
      {
        qualityRating: 88,
        deliveryPerformance: 92,
        costCompetitiveness: 75,
        serviceLevel: 85,
        riskFactors: 0.15,
      },
      this.config
    );

    const routeOptimization = SupplyChainOperationsBusinessLogic.optimizeRoutes(
      [
        {
          id: '1',
          location: { lat: 40.7128, lng: -74.006 },
          demand: 100,
          timeWindow: { start: 8, end: 17 },
          priority: 8,
        },
        {
          id: '2',
          location: { lat: 40.7589, lng: -73.9851 },
          demand: 150,
          timeWindow: { start: 9, end: 16 },
          priority: 9,
        },
      ],
      [{ id: 'truck1', capacity: 500, costPerKm: 2.5, maxDuration: 8 }],
      this.config
    );

    const inventoryAnalytics = SupplyChainOperationsBusinessLogic.calculateInventoryMetrics(
      [
        {
          id: 'item1',
          category: 'raw-materials',
          annualUsage: 5000,
          averageInventory: 500,
          unitCost: 25,
          leadTime: 14,
        },
        {
          id: 'item2',
          category: 'finished-goods',
          annualUsage: 2000,
          averageInventory: 200,
          unitCost: 100,
          leadTime: 7,
        },
      ],
      this.config
    );

    return {
      inventoryOptimization,
      supplierPerformance,
      routeOptimization,
      inventoryAnalytics,
    };
  }

  // Expose individual managers for specific operations
  get managers() {
    return {
      scm: this.scm,
      procurement: this.procurement,
      inventory: this.inventory,
    };
  }
}

// Default configuration
export const defaultSupplyChainOperationsConfig: SupplyChainOperationsDomainConfig = {
  inventory: {
    safetyStockFactors: {
      highVolume: 0.15,
      mediumVolume: 0.25,
      lowVolume: 0.35,
    },
    reorderPoints: {
      leadTimeBuffer: 14,
      demandVariability: 0.2,
      serviceLevel: 0.95,
    },
    costFactors: {
      carryingCostRate: 0.25,
      orderingCostBase: 100,
      stockoutPenalty: 0.05,
    },
  },
  procurement: {
    supplierScoring: {
      qualityWeight: 0.3,
      deliveryWeight: 0.25,
      costWeight: 0.25,
      serviceWeight: 0.2,
    },
    negotiationFactors: {
      volumeDiscountThreshold: 100000,
      paymentTermsDiscount: 0.02,
      longTermContractDiscount: 0.05,
    },
  },
  logistics: {
    routeOptimization: {
      distanceWeight: 0.4,
      timeWeight: 0.3,
      costWeight: 0.2,
      capacityUtilization: 0.85,
    },
    transportationCosts: {
      fuelSurcharge: 50,
      handlingFee: 25,
      insuranceRate: 0.005,
    },
  },
};

// Singleton instance
export const supplyChainOperationsDomainManager = new SupplyChainOperationsDomainManager(
  defaultSupplyChainOperationsConfig
);
