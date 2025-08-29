/**
 * Pricing Service
 * Handles pricing calculations, rate structures, and pricing models for leases
 */

export interface PricingModel {
  id: string;
  name: string;
  type: 'FIXED' | 'VARIABLE' | 'TIERED' | 'INDEXED';
  baseRate: number;
  rateAdjustments?: RateAdjustment[];
  effectiveDate: Date;
  expirationDate?: Date;
}

export interface RateAdjustment {
  id: string;
  type: 'CREDIT_RATING' | 'TERM_LENGTH' | 'ASSET_TYPE' | 'VOLUME_DISCOUNT';
  adjustmentPercent: number;
  condition: string;
}

export interface PricingQuote {
  id: string;
  customerId: string;
  assetType: string;
  assetValue: number;
  termMonths: number;
  pricingModel: PricingModel;
  basePayment: number;
  adjustedPayment: number;
  totalCost: number;
  effectiveRate: number;
  createdDate: Date;
  expirationDate: Date;
}

export class PricingService {
  /**
   * Calculate lease pricing based on asset value, term, and pricing model
   */
  async calculateLeasePricing(
    assetValue: number,
    termMonths: number,
    pricingModelId: string,
    customerId?: string
  ): Promise<PricingQuote> {
    // Implementation would fetch pricing model and calculate payments
    const baseRate = 0.05; // 5% example rate
    const monthlyPayment = (assetValue * baseRate) / 12;
    
    return {
      id: `pq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customerId: customerId || 'unknown',
      assetType: 'equipment',
      assetValue,
      termMonths,
      pricingModel: {
        id: pricingModelId,
        name: 'Standard Equipment Pricing',
        type: 'FIXED',
        baseRate,
        effectiveDate: new Date(),
      },
      basePayment: monthlyPayment,
      adjustedPayment: monthlyPayment,
      totalCost: monthlyPayment * termMonths,
      effectiveRate: baseRate,
      createdDate: new Date(),
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };
  }

  /**
   * Create and manage pricing models
   */
  async createPricingModel(model: Omit<PricingModel, 'id'>): Promise<PricingModel> {
    const id = `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { ...model, id };
  }

  /**
   * Apply rate adjustments based on customer profile and deal characteristics
   */
  async applyRateAdjustments(
    baseRate: number,
    adjustments: RateAdjustment[]
  ): Promise<number> {
    return adjustments.reduce((rate, adjustment) => {
      return rate + (rate * adjustment.adjustmentPercent / 100);
    }, baseRate);
  }

  /**
   * Generate pricing comparison across multiple models
   */
  async generatePricingComparison(
    assetValue: number,
    termMonths: number,
    modelIds: string[]
  ): Promise<PricingQuote[]> {
    const comparisons = await Promise.all(
      modelIds.map(modelId => 
        this.calculateLeasePricing(assetValue, termMonths, modelId)
      )
    );
    
    return comparisons.sort((a, b) => a.totalCost - b.totalCost);
  }
}

// Export singleton instance
export const pricingService = new PricingService();