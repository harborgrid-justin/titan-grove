/**
 * Inventory Replenishment Business Logic
 * Handles automatic replenishment, demand forecasting, and inventory optimization
 */

import { Priority } from '../../../../types/common';
import { 
  ReplenishmentRule,
  ReplenishmentRecommendation,
  DemandForecastData,
  InventoryOptimizationResult
} from '../../types';

export class InventoryReplenishmentService {
  
  /**
   * Automatic Replenishment Planning
   */
  async generateReplenishmentPlan(criteria: {
    warehouseId?: string;
    itemCategory?: string;
    abcClass?: 'A' | 'B' | 'C';
    priority?: Priority;
    planningHorizon?: number; // days
  }): Promise<ReplenishmentRecommendation[]> {
    console.log('Generating comprehensive replenishment plan', criteria);
    
    // Get items that need replenishment
    const itemsNeedingReplenishment = await this.identifyReplenishmentItems(criteria);
    
    const recommendations: ReplenishmentRecommendation[] = [];
    
    for (const item of itemsNeedingReplenishment) {
      const recommendation = await this.calculateReplenishmentRecommendation(item);
      recommendations.push(recommendation);
    }
    
    // Sort by priority and projected stockout date
    return recommendations.sort((a, b) => {
      const priorityOrder: Record<Priority, number> = { 
        [Priority.CRITICAL]: 0, 
        [Priority.HIGH]: 1, 
        [Priority.MEDIUM]: 2, 
        [Priority.LOW]: 3 
      };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      // Sort by stockout date if same priority
      if (a.projectedStockoutDate && b.projectedStockoutDate) {
        return a.projectedStockoutDate.getTime() - b.projectedStockoutDate.getTime();
      }
      
      return 0;
    });
  }

  private async identifyReplenishmentItems(criteria: any): Promise<Array<{
    itemId: string;
    itemCode: string;
    itemDescription: string;
    warehouseId: string;
    warehouseName: string;
    currentStock: number;
    reorderPoint: number;
    abcClass: string;
  }>> {
    console.log('Identifying items needing replenishment', criteria);
    
    // Mock implementation - would query actual inventory data
    return [
      {
        itemId: 'item_001',
        itemCode: 'WIDGET-A',
        itemDescription: 'Premium Widget Type A',
        warehouseId: 'wh_001',
        warehouseName: 'Main Distribution Center',
        currentStock: 45,
        reorderPoint: 50,
        abcClass: 'A'
      },
      {
        itemId: 'item_002', 
        itemCode: 'COMPONENT-B',
        itemDescription: 'Component B Assembly',
        warehouseId: 'wh_001',
        warehouseName: 'Main Distribution Center',
        currentStock: 12,
        reorderPoint: 25,
        abcClass: 'B'
      }
    ];
  }

  private async calculateReplenishmentRecommendation(item: any): Promise<ReplenishmentRecommendation> {
    // Get replenishment rule for item
    const rule = await this.getReplenishmentRule(item.itemId, item.warehouseId);
    
    // Get demand forecast
    const demandForecast = await this.getDemandForecast(item.itemId, item.warehouseId, 30);
    
    // Calculate suggested order quantity
    const { suggestedQuantity, reasoning } = await this.calculateOptimalOrderQuantity(
      item.itemId,
      item.currentStock,
      demandForecast,
      rule
    );
    
    // Determine priority based on stockout risk
    const priority = this.calculateReplenishmentPriority(
      item.currentStock,
      rule.reorderPoint,
      demandForecast.averageDailyDemand,
      rule.leadTimeDays
    );
    
    // Calculate projected stockout date
    const projectedStockoutDate = this.calculateStockoutDate(
      item.currentStock,
      demandForecast.averageDailyDemand
    );
    
    return {
      id: `repl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      itemId: item.itemId,
      itemCode: item.itemCode,
      itemDescription: item.itemDescription,
      warehouseId: item.warehouseId,
      warehouseName: item.warehouseName,
      currentStock: item.currentStock,
      projectedStock: item.currentStock - (demandForecast.averageDailyDemand * rule.leadTimeDays),
      reorderPoint: rule.reorderPoint,
      suggestedOrderQuantity: suggestedQuantity,
      economicOrderQuantity: rule.economicOrderQuantity,
      priority,
      reasonCode: reasoning,
      projectedStockoutDate,
      supplierLeadTime: rule.leadTimeDays,
      estimatedCost: suggestedQuantity * demandForecast.unitCost,
      annualDemand: demandForecast.annualDemand,
      demandVariability: demandForecast.variability,
      serviceLevel: 95.0
    };
  }

  private async getReplenishmentRule(itemId: string, warehouseId: string): Promise<ReplenishmentRule> {
    console.log(`Getting replenishment rule for item ${itemId} in warehouse ${warehouseId}`);
    
    // Mock replenishment rule
    return {
      id: `rule_${itemId}`,
      itemId,
      warehouseId,
      ruleType: 'REORDER_POINT',
      reorderPoint: 50,
      minimumStock: 25,
      maximumStock: 200,
      economicOrderQuantity: 100,
      reviewPeriodDays: 7,
      leadTimeDays: 14,
      safetyStock: 20,
      isActive: true
    };
  }

  private async getDemandForecast(itemId: string, warehouseId: string, days: number): Promise<{
    averageDailyDemand: number;
    annualDemand: number;
    variability: number;
    unitCost: number;
  }> {
    console.log(`Getting demand forecast for item ${itemId} over ${days} days`);
    
    // Mock demand forecast calculation
    const dailyDemand = 5.2; // units per day
    const variability = 0.25; // 25% coefficient of variation
    
    return {
      averageDailyDemand: dailyDemand,
      annualDemand: dailyDemand * 365,
      variability,
      unitCost: 12.50
    };
  }

  private async calculateOptimalOrderQuantity(
    itemId: string,
    currentStock: number,
    demand: any,
    rule: ReplenishmentRule
  ): Promise<{ suggestedQuantity: number; reasoning: string }> {
    let suggestedQuantity = rule.economicOrderQuantity;
    let reasoning = 'EOQ-based order quantity';
    
    // Adjust for current stock level and demand
    const stockDeficit = Math.max(0, rule.reorderPoint - currentStock);
    const leadTimeDemand = demand.averageDailyDemand * rule.leadTimeDays;
    
    // If we're below reorder point, order enough to cover deficit plus EOQ
    if (currentStock <= rule.reorderPoint) {
      suggestedQuantity = Math.max(rule.economicOrderQuantity, stockDeficit + leadTimeDemand);
      reasoning = 'Below reorder point - increased quantity to prevent stockout';
    }
    
    // Consider maximum stock constraint
    if (currentStock + suggestedQuantity > rule.maximumStock) {
      suggestedQuantity = rule.maximumStock - currentStock;
      reasoning = 'Limited by maximum stock level';
    }
    
    console.log(`Calculated optimal order quantity for ${itemId}: ${suggestedQuantity} (${reasoning})`);
    
    return { suggestedQuantity: Math.max(0, Math.round(suggestedQuantity)), reasoning };
  }

  private calculateReplenishmentPriority(
    currentStock: number,
    reorderPoint: number,
    averageDailyDemand: number,
    leadTimeDays: number
  ): Priority {
    const daysOfStock = currentStock / averageDailyDemand;
    
    if (daysOfStock <= leadTimeDays) {
      return Priority.CRITICAL; // Will stockout during lead time
    } else if (currentStock <= reorderPoint * 0.8) {
      return Priority.HIGH; // Below 80% of reorder point
    } else if (currentStock <= reorderPoint) {
      return Priority.MEDIUM; // Below reorder point
    } else {
      return Priority.LOW; // Above reorder point
    }
  }

  private calculateStockoutDate(currentStock: number, averageDailyDemand: number): Date | undefined {
    if (averageDailyDemand <= 0) return undefined;
    
    const daysToStockout = currentStock / averageDailyDemand;
    
    if (daysToStockout <= 365) { // Only return if within a year
      const stockoutDate = new Date();
      stockoutDate.setDate(stockoutDate.getDate() + Math.floor(daysToStockout));
      return stockoutDate;
    }
    
    return undefined;
  }

  /**
   * Demand Forecasting Engine
   */
  async generateDemandForecast(
    itemId: string,
    warehouseId: string,
    forecastMethod: DemandForecastData['forecastMethod'],
    periodsToForecast: number = 12
  ): Promise<DemandForecastData[]> {
    console.log(`Generating ${forecastMethod} demand forecast for item ${itemId}`);
    
    // Get historical demand data
    const historicalData = await this.getHistoricalDemand(itemId, warehouseId, 24); // 24 periods of history
    
    const forecasts: DemandForecastData[] = [];
    
    for (let i = 1; i <= periodsToForecast; i++) {
      const forecastPeriod = new Date();
      forecastPeriod.setMonth(forecastPeriod.getMonth() + i);
      
      let forecastQuantity = 0;
      let confidence = 75;
      
      switch (forecastMethod) {
        case 'MOVING_AVERAGE':
          ({ forecast: forecastQuantity, confidence } = this.calculateMovingAverage(historicalData, 3));
          break;
        case 'EXPONENTIAL_SMOOTHING':
          ({ forecast: forecastQuantity, confidence } = this.calculateExponentialSmoothing(historicalData, 0.3));
          break;
        case 'LINEAR_REGRESSION':
          ({ forecast: forecastQuantity, confidence } = this.calculateLinearRegression(historicalData, i));
          break;
        case 'SEASONAL_DECOMPOSITION':
          ({ forecast: forecastQuantity, confidence } = this.calculateSeasonalForecast(historicalData, i));
          break;
      }
      
      forecasts.push({
        itemId,
        warehouseId,
        forecastPeriod,
        forecastQuantity: Math.max(0, Math.round(forecastQuantity)),
        trendFactor: this.calculateTrendFactor(historicalData),
        seasonalFactor: this.calculateSeasonalFactor(historicalData, i),
        forecastMethod,
        confidence
      });
    }
    
    return forecasts;
  }

  private async getHistoricalDemand(itemId: string, warehouseId: string, periods: number): Promise<number[]> {
    console.log(`Getting ${periods} periods of historical demand for item ${itemId}`);
    
    // Mock historical demand data with some seasonality and trend
    const baselineDemand = 100;
    const data: number[] = [];
    
    for (let i = 0; i < periods; i++) {
      const trend = i * 2; // Growing trend
      const seasonal = Math.sin((i * Math.PI) / 6) * 20; // Seasonal pattern
      const noise = (Math.random() - 0.5) * 30; // Random variation
      const demand = Math.max(0, baselineDemand + trend + seasonal + noise);
      data.push(Math.round(demand));
    }
    
    return data;
  }

  private calculateMovingAverage(data: number[], periods: number): { forecast: number; confidence: number } {
    const recent = data.slice(-periods);
    const forecast = recent.reduce((sum, val) => sum + val, 0) / periods;
    const confidence = 70; // Lower confidence for simple moving average
    
    return { forecast, confidence };
  }

  private calculateExponentialSmoothing(data: number[], alpha: number): { forecast: number; confidence: number } {
    let forecast = data[0];
    
    for (let i = 1; i < data.length; i++) {
      forecast = alpha * data[i] + (1 - alpha) * forecast;
    }
    
    return { forecast, confidence: 80 };
  }

  private calculateLinearRegression(data: number[], periodsAhead: number): { forecast: number; confidence: number } {
    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    
    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += data[i];
      sumXY += i * data[i];
      sumX2 += i * i;
    }
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    const forecast = intercept + slope * (n + periodsAhead - 1);
    const confidence = 85; // Higher confidence for regression
    
    return { forecast, confidence };
  }

  private calculateSeasonalForecast(data: number[], periodsAhead: number): { forecast: number; confidence: number } {
    // Simplified seasonal decomposition
    const seasonalPeriod = 12; // Assuming monthly data with annual seasonality
    const seasonalIndex = periodsAhead % seasonalPeriod;
    const historicalSeasonalValues = data.filter((_, index) => index % seasonalPeriod === seasonalIndex);
    
    const averageSeasonal = historicalSeasonalValues.reduce((sum, val) => sum + val, 0) / historicalSeasonalValues.length;
    const overallAverage = data.reduce((sum, val) => sum + val, 0) / data.length;
    const trend = this.calculateTrendFactor(data);
    
    const forecast = (averageSeasonal + trend * periodsAhead);
    
    return { forecast, confidence: 90 };
  }

  private calculateTrendFactor(data: number[]): number {
    const midpoint = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, midpoint);
    const secondHalf = data.slice(midpoint);
    
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    
    return (secondAvg - firstAvg) / midpoint; // Trend per period
  }

  private calculateSeasonalFactor(data: number[], period: number): number {
    const seasonalPeriod = 12;
    const seasonalIndex = period % seasonalPeriod;
    const overallAverage = data.reduce((sum, val) => sum + val, 0) / data.length;
    
    // Get values for the same seasonal period
    const seasonalValues = data.filter((_, index) => index % seasonalPeriod === seasonalIndex);
    const seasonalAverage = seasonalValues.reduce((sum, val) => sum + val, 0) / seasonalValues.length;
    
    return seasonalAverage / overallAverage; // Seasonal index
  }

  /**
   * Inventory Optimization
   */
  async optimizeInventoryPolicies(criteria: {
    warehouseId?: string;
    itemCategory?: string;
    abcClass?: 'A' | 'B' | 'C';
    targetServiceLevel?: number;
  }): Promise<InventoryOptimizationResult[]> {
    console.log('Optimizing inventory policies', criteria);
    
    const items = await this.getItemsForOptimization(criteria);
    const optimizationResults: InventoryOptimizationResult[] = [];
    
    for (const item of items) {
      const result = await this.optimizeItemPolicy(item, criteria.targetServiceLevel || 95);
      optimizationResults.push(result);
    }
    
    return optimizationResults.sort((a, b) => 
      b.projectedImprovements.costSavings - a.projectedImprovements.costSavings
    );
  }

  private async getItemsForOptimization(criteria: any): Promise<Array<{ itemId: string }>> {
    console.log('Getting items for optimization', criteria);
    return [
      { itemId: 'item_001' },
      { itemId: 'item_002' },
      { itemId: 'item_003' }
    ];
  }

  private async optimizeItemPolicy(item: any, targetServiceLevel: number): Promise<InventoryOptimizationResult> {
    const currentRule = await this.getReplenishmentRule(item.itemId, 'wh_001');
    const demandData = await this.getDemandForecast(item.itemId, 'wh_001', 30);
    
    // Calculate optimized policy using inventory optimization algorithms
    const optimizedReorderPoint = this.calculateOptimalReorderPoint(
      demandData.averageDailyDemand,
      currentRule.leadTimeDays,
      demandData.variability,
      targetServiceLevel
    );
    
    const optimizedOrderQuantity = this.calculateOptimalOrderQuantity2(
      demandData.annualDemand,
      demandData.unitCost * 0.25, // Carrying cost (25% of item cost)
      150 // Ordering cost
    );
    
    const optimizedSafetyStock = this.calculateOptimalSafetyStock(
      demandData.averageDailyDemand,
      currentRule.leadTimeDays,
      demandData.variability,
      targetServiceLevel
    );
    
    // Calculate projected improvements
    const currentInventoryValue = (currentRule.reorderPoint + currentRule.economicOrderQuantity / 2) * demandData.unitCost;
    const optimizedInventoryValue = (optimizedReorderPoint + optimizedOrderQuantity / 2) * demandData.unitCost;
    const inventoryReduction = ((currentInventoryValue - optimizedInventoryValue) / currentInventoryValue) * 100;
    
    return {
      itemId: item.itemId,
      currentPolicy: {
        reorderPoint: currentRule.reorderPoint,
        orderQuantity: currentRule.economicOrderQuantity,
        safetyStock: currentRule.safetyStock
      },
      optimizedPolicy: {
        reorderPoint: optimizedReorderPoint,
        orderQuantity: optimizedOrderQuantity,
        safetyStock: optimizedSafetyStock
      },
      projectedImprovements: {
        inventoryReduction: Math.max(0, inventoryReduction),
        serviceLevelImprovement: Math.max(0, targetServiceLevel - 92.0), // Assume current service level is 92%
        costSavings: Math.max(0, (currentInventoryValue - optimizedInventoryValue) * 0.25) // Annual carrying cost savings
      },
      riskFactors: this.identifyOptimizationRisks(currentRule, {
        reorderPoint: optimizedReorderPoint,
        orderQuantity: optimizedOrderQuantity,
        safetyStock: optimizedSafetyStock
      })
    };
  }

  private calculateOptimalReorderPoint(
    averageDemand: number,
    leadTime: number,
    variability: number,
    serviceLevel: number
  ): number {
    const zScore = this.getServiceLevelZScore(serviceLevel);
    const leadTimeDemand = averageDemand * leadTime;
    const demandStdDev = averageDemand * variability;
    const leadTimeVariability = Math.sqrt(leadTime) * demandStdDev;
    
    return Math.round(leadTimeDemand + (zScore * leadTimeVariability));
  }

  private calculateOptimalOrderQuantity2(annualDemand: number, carryingCost: number, orderingCost: number): number {
    // Economic Order Quantity (EOQ) formula
    return Math.round(Math.sqrt((2 * annualDemand * orderingCost) / carryingCost));
  }

  private calculateOptimalSafetyStock(
    averageDemand: number,
    leadTime: number,
    variability: number,
    serviceLevel: number
  ): number {
    const zScore = this.getServiceLevelZScore(serviceLevel);
    const demandStdDev = averageDemand * variability;
    const leadTimeVariability = Math.sqrt(leadTime) * demandStdDev;
    
    return Math.round(zScore * leadTimeVariability);
  }

  private getServiceLevelZScore(serviceLevel: number): number {
    // Simplified z-score lookup for common service levels
    const zScores: { [key: number]: number } = {
      90: 1.28,
      95: 1.65,
      98: 2.05,
      99: 2.33,
      99.5: 2.58
    };
    
    return zScores[serviceLevel] || 1.65; // Default to 95%
  }

  private identifyOptimizationRisks(currentPolicy: any, optimizedPolicy: any): string[] {
    const risks: string[] = [];
    
    if (optimizedPolicy.reorderPoint < currentPolicy.reorderPoint * 0.7) {
      risks.push('Significant reduction in reorder point may increase stockout risk');
    }
    
    if (optimizedPolicy.safetyStock < currentPolicy.safetyStock * 0.5) {
      risks.push('Lower safety stock increases vulnerability to demand spikes');
    }
    
    if (optimizedPolicy.orderQuantity > currentPolicy.orderQuantity * 1.5) {
      risks.push('Larger order quantities may strain cash flow and storage capacity');
    }
    
    return risks;
  }
}

// Export singleton instance
export const inventoryReplenishmentService = new InventoryReplenishmentService();