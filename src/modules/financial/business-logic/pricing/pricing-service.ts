/**
 * Pricing Service
 * Handles pricing calculations, rate structures, and pricing models for leases
 * Enhanced with message queue and cache integration
 */

import { StandardServiceBase } from '../../../shared/utils/standard-service-base';
import { ServiceIntegrationContext } from '../../../shared/interfaces/service-integration';
import { MessagePayload, QueueType } from '../../../core/message-queue/types';

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

export class PricingService extends StandardServiceBase {
  
  constructor(context?: ServiceIntegrationContext) {
    if (context) {
      super(context);
    } else {
      // Fallback for backward compatibility - will be replaced with proper initialization
      super({
        messageQueue: null as any,
        cache: null as any,
        logger: console as any,
        config: {
          serviceName: 'pricing-service',
          cacheConfig: { defaultTTL: 600, keyPrefix: 'pricing' },
          messageQueueConfig: { 
            defaultPriority: 1, 
            retryAttempts: 3,
            compliance: { dataClassification: 'CONFIDENTIAL', auditRequired: true }
          }
        }
      });
    }
  }

  /**
   * Handle message processing for pricing operations
   */
  async processMessage(message: MessagePayload): Promise<any> {
    this.markMessageProcessed();
    
    switch (message.type) {
      case 'CALCULATE_PRICING':
        return await this.calculateLeasePricing(
          message.data.assetValue,
          message.data.termMonths,
          message.data.pricingModelId,
          message.data.customerId
        );
      case 'UPDATE_PRICING_MODEL':
        return await this.updatePricingModel(message.data.modelId, message.data.updates);
      case 'PRICING_COMPARISON':
        return await this.generatePricingComparison(
          message.data.assetValue,
          message.data.termMonths,
          message.data.modelIds
        );
      default:
        throw new Error(`Unknown pricing message type: ${message.type}`);
    }
  }

  /**
   * Get queue types this service handles
   */
  getHandledQueueTypes(): QueueType[] {
    return [QueueType.FINANCIAL];
  }

  /**
   * Calculate lease pricing with caching and queue integration
   */
  async calculateLeasePricing(
    assetValue: number,
    termMonths: number,
    pricingModelId: string,
    customerId?: string
  ): Promise<PricingQuote> {
    return this.executeWithMetrics(async () => {
      const cacheKey = `pricing:${assetValue}:${termMonths}:${pricingModelId}:${customerId || 'default'}`;
      
      return this.executeWithCache(cacheKey, async () => {
        // Implementation would fetch pricing model and calculate payments
        const baseRate = 0.05; // 5% example rate
        const monthlyPayment = (assetValue * baseRate) / 12;
        
        const quote: PricingQuote = {
          id: this.generateId('pq'),
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

        // Send notification about pricing calculation
        if (this.messageQueue) {
          await this.sendMessage(
            QueueType.AUDIT,
            'PRICING_CALCULATED',
            { quoteId: quote.id, assetValue, termMonths, customerId },
            { compliance: { auditRequired: true, dataClassification: 'CONFIDENTIAL' } }
          );
        }

        return quote;
      }, this.getCacheTTL('pricing'));
    });
  }

  /**
   * Create and manage pricing models
   */
  async createPricingModel(model: Omit<PricingModel, 'id'>): Promise<PricingModel> {
    return this.executeWithMetrics(async () => {
      const id = this.generateId('pm');
      const pricingModel = { ...model, id };

      // Cache the new pricing model
      await this.setCached(`model:${id}`, pricingModel, this.getCacheTTL('model'));

      // Send notification about model creation
      if (this.messageQueue) {
        await this.sendMessage(
          QueueType.FINANCIAL,
          'PRICING_MODEL_CREATED',
          { modelId: id, name: model.name, type: model.type },
          { compliance: { auditRequired: true, dataClassification: 'INTERNAL' } }
        );
      }

      return pricingModel;
    });
  }

  /**
   * Update existing pricing model
   */
  async updatePricingModel(modelId: string, updates: Partial<PricingModel>): Promise<PricingModel> {
    return this.executeWithMetrics(async () => {
      // Get existing model (may be from cache)
      const existing = await this.getCached(`model:${modelId}`);
      const updatedModel = { ...existing, ...updates, id: modelId };

      // Update cache
      await this.setCached(`model:${modelId}`, updatedModel, this.getCacheTTL('model'));

      // Send notification about model update
      if (this.messageQueue) {
        await this.sendMessage(
          QueueType.FINANCIAL,
          'PRICING_MODEL_UPDATED',
          { modelId, updates },
          { compliance: { auditRequired: true, dataClassification: 'INTERNAL' } }
        );
      }

      return updatedModel;
    });
  }

  /**
   * Apply rate adjustments based on customer profile and deal characteristics
   */
  async applyRateAdjustments(
    baseRate: number,
    adjustments: RateAdjustment[]
  ): Promise<number> {
    return this.executeWithMetrics(async () => {
      const adjustedRate = adjustments.reduce((rate, adjustment) => {
        return rate + (rate * adjustment.adjustmentPercent / 100);
      }, baseRate);

      // Log adjustment calculation for audit
      if (this.messageQueue) {
        await this.sendMessage(
          QueueType.AUDIT,
          'RATE_ADJUSTMENT_APPLIED',
          { baseRate, adjustedRate, adjustments: adjustments.map(a => a.type) },
          { compliance: { auditRequired: true, dataClassification: 'INTERNAL' } }
        );
      }

      return adjustedRate;
    });
  }

  /**
   * Generate pricing comparison across multiple models
   */
  async generatePricingComparison(
    assetValue: number,
    termMonths: number,
    modelIds: string[]
  ): Promise<PricingQuote[]> {
    return this.executeWithMetrics(async () => {
      const cacheKey = `comparison:${assetValue}:${termMonths}:${modelIds.sort().join(',')}`;
      
      return this.executeWithCache(cacheKey, async () => {
        const comparisons = await Promise.all(
          modelIds.map(modelId => 
            this.calculateLeasePricing(assetValue, termMonths, modelId)
          )
        );
        
        const sortedComparisons = comparisons.sort((a, b) => a.totalCost - b.totalCost);

        // Send notification about comparison generation
        if (this.messageQueue) {
          await this.sendMessage(
            QueueType.ANALYTICS,
            'PRICING_COMPARISON_GENERATED',
            { 
              assetValue, 
              termMonths, 
              modelCount: modelIds.length, 
              bestQuoteId: sortedComparisons[0]?.id 
            }
          );
        }

        return sortedComparisons;
      }, this.getCacheTTL('comparison'));
    });
  }

  /**
   * Service-specific health check
   */
  protected async performServiceSpecificHealthCheck(): Promise<Record<string, any> | null> {
    return {
      pricing: 'operational',
      modelsLoaded: true,
      calculationEngine: 'available'
    };
  }
}

// Export singleton instance - will be properly initialized with context
export let pricingService: PricingService;

// Factory function to create properly initialized service
export function createPricingService(context?: ServiceIntegrationContext): PricingService {
  pricingService = new PricingService(context);
  return pricingService;
}

// For backward compatibility, create a basic instance
if (!pricingService) {
  pricingService = new PricingService();
}