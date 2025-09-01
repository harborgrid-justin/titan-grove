/**
 * Pricing Engine Service
 * Advanced pricing rules, discounting, and promotion management with Oracle EBS competitive features
 */

import type { 
  PricingRule,
  PricingCondition,
  PricingAction,
  Quote,
  QuoteLineItem,
  SalesOrder,
  OrderLineItem,
  ProductConfiguration
} from '../../types';

import {
  Priority
} from '../../types';

import { PricingEngineConfig } from '../../../../types/business-config';

export interface PriceList {
  id: string;
  name: string;
  description: string;
  currency: string;
  effectiveDate: Date;
  expirationDate?: Date;
  isActive: boolean;
  customerSegments: string[];
  territories: string[];
  channels: string[];
  priceListItems: PriceListItem[];
  discountStructure?: DiscountStructure;
  createdDate: Date;
  modifiedDate: Date;
  createdBy: string;
  modifiedBy: string;
}

export interface PriceListItem {
  id: string;
  priceListId: string;
  itemId: string;
  itemCode: string;
  unitOfMeasure: string;
  listPrice: number;
  minPrice?: number;
  maxPrice?: number;
  cost?: number;
  margin?: number;
  marginPercent?: number;
  effectiveDate: Date;
  expirationDate?: Date;
  isActive: boolean;
  priceBreaks?: PriceBreak[];
  currencyConversions?: CurrencyConversion[];
}

export interface PriceBreak {
  id: string;
  minQuantity: number;
  maxQuantity?: number;
  unitPrice: number;
  discountPercent?: number;
  discountAmount?: number;
}

export interface CurrencyConversion {
  currency: string;
  exchangeRate: number;
  convertedPrice: number;
  lastUpdated: Date;
}

export interface DiscountStructure {
  id: string;
  name: string;
  type: 'VOLUME' | 'CUSTOMER' | 'ITEM' | 'ORDER' | 'PROMOTIONAL';
  tiers: DiscountTier[];
  stackable: boolean;
  exclusions?: string[];
  effectiveDate: Date;
  expirationDate?: Date;
}

export interface DiscountTier {
  id: string;
  tierName: string;
  minValue: number;
  maxValue?: number;
  discountPercent?: number;
  discountAmount?: number;
  freeShipping?: boolean;
  freeItems?: FreeItem[];
}

export interface FreeItem {
  itemId: string;
  itemCode: string;
  freeQuantity: number;
  conditions?: PricingCondition[];
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'BUY_X_GET_Y' | 'FREE_SHIPPING' | 'BUNDLE';
  priority: number;
  effectiveDate: Date;
  expirationDate: Date;
  isActive: boolean;
  customerSegments?: string[];
  territories?: string[];
  channels?: string[];
  minimumOrderValue?: number;
  maximumDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  stackable: boolean;
  conditions: PricingCondition[];
  actions: PricingAction[];
  promotionCode?: string;
  autoApply: boolean;
  createdDate: Date;
  modifiedDate: Date;
  createdBy: string;
  modifiedBy: string;
}

export interface PricingContext {
  customerId?: string;
  customerSegment?: string;
  territory?: string;
  channel?: string;
  priceListId?: string;
  currency?: string;
  orderDate?: Date;
  orderType?: string;
  promotionCodes?: string[];
  volumeDiscountEligible?: boolean;
  contractId?: string;
  salesRepId?: string;
  warehouseId?: string;
  requestedDate?: Date;
}

export interface PricingResult {
  itemId: string;
  itemCode: string;
  quantity: number;
  listPrice: number;
  unitPrice: number;
  extendedPrice: number;
  totalDiscountAmount: number;
  totalDiscountPercent: number;
  appliedDiscounts: AppliedDiscount[];
  appliedPromotions: AppliedPromotion[];
  priceBreakApplied?: PriceBreak;
  warnings?: string[];
  errors?: string[];
  pricingTrace?: PricingTraceStep[];
}

export interface AppliedDiscount {
  id: string;
  name: string;
  type: string;
  discountPercent?: number;
  discountAmount: number;
  source: 'PRICE_LIST' | 'DISCOUNT_STRUCTURE' | 'PROMOTION' | 'MANUAL' | 'CONTRACT';
  priority: number;
}

export interface AppliedPromotion {
  promotionId: string;
  promotionName: string;
  promotionCode?: string;
  discountAmount: number;
  freeItems?: FreeItem[];
  appliedAt: 'LINE' | 'ORDER' | 'SHIPPING';
}

export interface PricingTraceStep {
  step: number;
  action: string;
  description: string;
  priceBeforeStep: number;
  priceAfterStep: number;
  discountApplied: number;
  ruleApplied?: string;
}

export class PricingEngineService {
  
  constructor(private config: PricingEngineConfig) {}
  
  // ================================
  // PRICE CALCULATION
  // ================================

  /**
   * Calculate pricing for quote line items
   */
  async calculateQuotePricing(
    quote: Quote,
    context?: PricingContext
  ): Promise<Quote> {
    
    const pricingContext: PricingContext = {
      customerId: quote.customerId,
      priceListId: quote.priceListId,
      currency: quote.currency,
      orderDate: quote.quoteDate,
      territory: quote.territory,
      salesRepId: quote.salesRepId,
      ...context
    };

    const pricedLineItems: QuoteLineItem[] = [];
    
    for (const lineItem of quote.lineItems) {
      const pricingResult = await this.calculateItemPricing(
        lineItem.itemId,
        lineItem.quantity,
        pricingContext
      );

      const pricedLineItem: QuoteLineItem = {
        ...lineItem,
        listPrice: pricingResult.listPrice,
        unitPrice: pricingResult.unitPrice,
        discountPercent: pricingResult.totalDiscountPercent,
        discountAmount: pricingResult.totalDiscountAmount,
        extendedPrice: pricingResult.extendedPrice,
        margin: pricingResult.unitPrice - (lineItem.costOfGoodsSold || 0),
        marginPercent: lineItem.costOfGoodsSold ? 
          ((pricingResult.unitPrice - lineItem.costOfGoodsSold) / pricingResult.unitPrice) * 100 : 0
      };

      pricedLineItems.push(pricedLineItem);
    }

    // Apply order-level promotions
    const orderLevelPromotions = await this.getOrderLevelPromotions(quote, pricingContext);
    const promotionResults = await this.applyOrderPromotions(pricedLineItems, orderLevelPromotions, pricingContext);

    // Calculate totals
    const subtotal = promotionResults.lineItems.reduce((sum, item) => sum + item.extendedPrice, 0);
    const totalDiscountAmount = promotionResults.orderDiscountAmount + 
      promotionResults.lineItems.reduce((sum, item) => sum + (item.discountAmount || 0), 0);

    return {
      ...quote,
      lineItems: promotionResults.lineItems,
      subtotal: Math.round(subtotal * 100) / 100,
      discountAmount: Math.round(totalDiscountAmount * 100) / 100,
      totalAmount: Math.round((subtotal + quote.taxAmount + quote.shippingAmount) * 100) / 100
    };
  }

  /**
   * Calculate pricing for sales order line items
   */
  async calculateOrderPricing(
    order: SalesOrder,
    context?: PricingContext
  ): Promise<SalesOrder> {
    
    const pricingContext: PricingContext = {
      customerId: order.customerId,
      priceListId: order.priceListId,
      currency: order.currency,
      orderDate: order.orderDate,
      territory: order.territory,
      salesRepId: order.salesRepId,
      contractId: order.contractId,
      ...context
    };

    const pricedLineItems: OrderLineItem[] = [];
    
    for (const lineItem of order.lineItems) {
      const pricingResult = await this.calculateItemPricing(
        lineItem.itemId,
        lineItem.quantity,
        pricingContext
      );

      const pricedLineItem: OrderLineItem = {
        ...lineItem,
        listPrice: pricingResult.listPrice,
        unitPrice: pricingResult.unitPrice,
        discountPercent: pricingResult.totalDiscountPercent,
        discountAmount: pricingResult.totalDiscountAmount,
        extendedPrice: pricingResult.extendedPrice,
        lineTotal: pricingResult.extendedPrice + (lineItem.taxAmount || 0),
        margin: pricingResult.unitPrice - (lineItem.costOfGoodsSold || 0)
      };

      pricedLineItems.push(pricedLineItem);
    }

    // Apply order-level discounts and promotions
    const orderPromotions = await this.getOrderLevelPromotions(order, pricingContext);
    const promotionResults = await this.applyOrderPromotions(pricedLineItems, orderPromotions, pricingContext);

    // Calculate totals
    const subtotal = promotionResults.lineItems.reduce((sum, item) => sum + item.extendedPrice, 0);
    const totalDiscountAmount = promotionResults.orderDiscountAmount + 
      promotionResults.lineItems.reduce((sum, item) => sum + (item.discountAmount || 0), 0);

    return {
      ...order,
      lineItems: promotionResults.lineItems,
      subtotal: Math.round(subtotal * 100) / 100,
      discountAmount: Math.round(totalDiscountAmount * 100) / 100,
      totalAmount: Math.round((subtotal + order.taxAmount + order.shippingAmount) * 100) / 100,
      balanceAmount: Math.round((subtotal + order.taxAmount + order.shippingAmount - order.paidAmount) * 100) / 100
    };
  }

  /**
   * Calculate pricing for individual item
   */
  async calculateItemPricing(
    itemId: string,
    quantity: number,
    context: PricingContext
  ): Promise<PricingResult> {
    
    const pricingTrace: PricingTraceStep[] = [];
    let currentPrice = 0;
    const appliedDiscounts: AppliedDiscount[] = [];
    const appliedPromotions: AppliedPromotion[] = [];

    // Step 1: Get base list price
    const priceListItem = await this.getPriceListItem(itemId, context.priceListId, context.currency);
    if (!priceListItem) {
      throw new Error(`No price found for item ${itemId} in price list ${context.priceListId}`);
    }

    currentPrice = priceListItem.listPrice;
    pricingTrace.push({
      step: 1,
      action: 'BASE_PRICE',
      description: `Base list price from price list ${context.priceListId}`,
      priceBeforeStep: 0,
      priceAfterStep: currentPrice,
      discountApplied: 0
    });

    // Step 2: Apply price breaks (volume pricing)
    const priceBreak = this.findApplicablePriceBreak(priceListItem.priceBreaks || [], quantity);
    if (priceBreak) {
      const priceBeforeBreak = currentPrice;
      currentPrice = priceBreak.unitPrice;
      pricingTrace.push({
        step: 2,
        action: 'PRICE_BREAK',
        description: `Volume pricing applied for quantity ${quantity}`,
        priceBeforeStep: priceBeforeBreak,
        priceAfterStep: currentPrice,
        discountApplied: priceBeforeBreak - currentPrice,
        ruleApplied: `Price break: ${priceBreak.minQuantity}+ units`
      });
    }

    // Step 3: Apply contract pricing
    if (context.contractId) {
      const contractPrice = await this.getContractPrice(itemId, context.contractId, quantity);
      if (contractPrice && contractPrice < currentPrice) {
        const priceBeforeContract = currentPrice;
        currentPrice = contractPrice;
        appliedDiscounts.push({
          id: `contract_${context.contractId}`,
          name: 'Contract Pricing',
          type: 'CONTRACT',
          discountAmount: priceBeforeContract - currentPrice,
          source: 'CONTRACT',
          priority: 1
        });
        pricingTrace.push({
          step: 3,
          action: 'CONTRACT_PRICE',
          description: `Contract pricing applied`,
          priceBeforeStep: priceBeforeContract,
          priceAfterStep: currentPrice,
          discountApplied: priceBeforeContract - currentPrice,
          ruleApplied: `Contract ${context.contractId}`
        });
      }
    }

    // Step 4: Apply customer-specific pricing rules
    const customerRules = await this.getCustomerPricingRules(context.customerId);
    for (const rule of customerRules) {
      if (this.evaluateRuleConditions(rule.conditions, { itemId, quantity, ...context })) {
        const discount = this.calculateRuleDiscount(rule.actions, currentPrice, quantity);
        if (discount > 0) {
          const priceBeforeRule = currentPrice;
          currentPrice -= discount;
          appliedDiscounts.push({
            id: rule.id,
            name: rule.name,
            type: rule.ruleType,
            discountAmount: discount,
            source: 'PRICE_LIST',
            priority: rule.priority
          });
          pricingTrace.push({
            step: 4,
            action: 'CUSTOMER_RULE',
            description: rule.description,
            priceBeforeStep: priceBeforeRule,
            priceAfterStep: currentPrice,
            discountApplied: discount,
            ruleApplied: rule.name
          });
        }
      }
    }

    // Step 5: Apply promotional pricing
    const itemPromotions = await this.getItemPromotions(itemId, context);
    for (const promotion of itemPromotions) {
      if (this.evaluatePromotionConditions(promotion.conditions, { itemId, quantity, ...context })) {
        const discount = this.calculatePromotionDiscount(promotion.actions, currentPrice, quantity);
        if (discount > 0) {
          const priceBeforePromo = currentPrice;
          currentPrice -= discount;
          appliedPromotions.push({
            promotionId: promotion.id,
            promotionName: promotion.name,
            promotionCode: promotion.promotionCode,
            discountAmount: discount,
            appliedAt: 'LINE'
          });
          pricingTrace.push({
            step: 5,
            action: 'PROMOTION',
            description: promotion.description,
            priceBeforeStep: priceBeforePromo,
            priceAfterStep: currentPrice,
            discountApplied: discount,
            ruleApplied: promotion.name
          });
        }
      }
    }

    // Step 6: Apply minimum price constraints
    if (priceListItem.minPrice && currentPrice < priceListItem.minPrice) {
      const priceBelowMin = currentPrice;
      currentPrice = priceListItem.minPrice;
      pricingTrace.push({
        step: 6,
        action: 'MIN_PRICE_CONSTRAINT',
        description: `Minimum price constraint applied`,
        priceBeforeStep: priceBelowMin,
        priceAfterStep: currentPrice,
        discountApplied: priceBelowMin - currentPrice,
        ruleApplied: `Minimum price: ${priceListItem.minPrice}`
      });
    }

    const extendedPrice = currentPrice * quantity;
    const totalDiscountAmount = (priceListItem.listPrice - currentPrice) * quantity;
    const totalDiscountPercent = priceListItem.listPrice > 0 ? 
      ((priceListItem.listPrice - currentPrice) / priceListItem.listPrice) * 100 : 0;

    return {
      itemId,
      itemCode: priceListItem.itemCode,
      quantity,
      listPrice: priceListItem.listPrice,
      unitPrice: Math.round(currentPrice * 100) / 100,
      extendedPrice: Math.round(extendedPrice * 100) / 100,
      totalDiscountAmount: Math.round(totalDiscountAmount * 100) / 100,
      totalDiscountPercent: Math.round(totalDiscountPercent * 100) / 100,
      appliedDiscounts,
      appliedPromotions,
      priceBreakApplied: priceBreak || undefined,
      pricingTrace
    };
  }

  // ================================
  // PROMOTION MANAGEMENT
  // ================================

  /**
   * Create new promotion
   */
  async createPromotion(promotionData: {
    name: string;
    description: string;
    type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'BUY_X_GET_Y' | 'FREE_SHIPPING' | 'BUNDLE';
    priority?: number;
    effectiveDate: Date;
    expirationDate: Date;
    customerSegments?: string[];
    territories?: string[];
    channels?: string[];
    minimumOrderValue?: number;
    maximumDiscount?: number;
    usageLimit?: number;
    stackable?: boolean;
    conditions: PricingCondition[];
    actions: PricingAction[];
    promotionCode?: string;
    autoApply?: boolean;
  }, createdBy: string): Promise<Promotion> {
    
    const promotion: Promotion = {
      id: `promo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: promotionData.name,
      description: promotionData.description,
      type: promotionData.type,
      priority: promotionData.priority || 100,
      effectiveDate: promotionData.effectiveDate,
      expirationDate: promotionData.expirationDate,
      isActive: true,
      customerSegments: promotionData.customerSegments,
      territories: promotionData.territories,
      channels: promotionData.channels,
      minimumOrderValue: promotionData.minimumOrderValue,
      maximumDiscount: promotionData.maximumDiscount,
      usageLimit: promotionData.usageLimit,
      usageCount: 0,
      stackable: promotionData.stackable || false,
      conditions: promotionData.conditions,
      actions: promotionData.actions,
      promotionCode: promotionData.promotionCode,
      autoApply: promotionData.autoApply || false,
      createdDate: new Date(),
      modifiedDate: new Date(),
      createdBy,
      modifiedBy: createdBy
    };

    return promotion;
  }

  /**
   * Apply promotion code to order
   */
  async applyPromotionCode(
    order: SalesOrder | Quote,
    promotionCode: string,
    context: PricingContext
  ): Promise<{
    success: boolean;
    promotion?: Promotion;
    discountAmount?: number;
    errorMessage?: string;
  }> {
    
    const promotion = await this.getPromotionByCode(promotionCode);
    if (!promotion) {
      return { success: false, errorMessage: 'Invalid promotion code' };
    }

    if (!promotion.isActive || new Date() > promotion.expirationDate) {
      return { success: false, errorMessage: 'Promotion code has expired' };
    }

    if (promotion.usageLimit && promotion.usageCount >= promotion.usageLimit) {
      return { success: false, errorMessage: 'Promotion code usage limit exceeded' };
    }

    // Check promotion conditions
    const orderValue = order.lineItems.reduce((sum, item) => sum + item.extendedPrice, 0);
    if (promotion.minimumOrderValue && orderValue < promotion.minimumOrderValue) {
      return { 
        success: false, 
        errorMessage: `Minimum order value of ${promotion.minimumOrderValue} required` 
      };
    }

    // Calculate promotion discount
    const discountAmount = this.calculatePromotionDiscount(
      promotion.actions, 
      orderValue, 
      order.lineItems.reduce((sum, item) => sum + item.quantity, 0)
    );

    if (promotion.maximumDiscount && discountAmount > promotion.maximumDiscount) {
      return {
        success: true,
        promotion,
        discountAmount: promotion.maximumDiscount
      };
    }

    return {
      success: true,
      promotion,
      discountAmount
    };
  }

  // ================================
  // HELPER METHODS
  // ================================

  private async getPriceListItem(
    itemId: string, 
    priceListId?: string, 
    currency?: string
  ): Promise<PriceListItem | null> {
    // Implementation would query price list tables
    // This is a mock implementation using centralized configuration
    const mockPricing = this.config.mockPricing;
    
    return {
      id: `pli_${itemId}`,
      priceListId: priceListId || 'default',
      itemId,
      itemCode: `ITEM_${itemId}`,
      unitOfMeasure: 'EA',
      listPrice: mockPricing.defaultListPrice,
      minPrice: mockPricing.defaultMinPrice,
      cost: mockPricing.defaultCost,
      margin: mockPricing.defaultListPrice - mockPricing.defaultCost,
      marginPercent: mockPricing.defaultMarginPercent,
      effectiveDate: new Date(),
      isActive: true,
      priceBreaks: [
        { 
          id: 'pb1', 
          minQuantity: mockPricing.priceBreaks.tier1MinQuantity, 
          unitPrice: mockPricing.priceBreaks.tier1UnitPrice 
        },
        { 
          id: 'pb2', 
          minQuantity: mockPricing.priceBreaks.tier2MinQuantity, 
          unitPrice: mockPricing.priceBreaks.tier2UnitPrice 
        },
        { 
          id: 'pb3', 
          minQuantity: mockPricing.priceBreaks.tier3MinQuantity, 
          unitPrice: mockPricing.priceBreaks.tier3UnitPrice 
        }
      ]
    };
  }

  private findApplicablePriceBreak(priceBreaks: PriceBreak[], quantity: number): PriceBreak | null {
    return priceBreaks
      .filter(pb => quantity >= pb.minQuantity && (!pb.maxQuantity || quantity <= pb.maxQuantity))
      .sort((a, b) => b.minQuantity - a.minQuantity)[0] || null;
  }

  private async getContractPrice(itemId: string, contractId: string, quantity: number): Promise<number | null> {
    // Implementation would query contract pricing tables
    return null;
  }

  private async getCustomerPricingRules(customerId?: string): Promise<PricingRule[]> {
    // Implementation would query customer-specific pricing rules
    return [];
  }

  private async getItemPromotions(itemId: string, context: PricingContext): Promise<Promotion[]> {
    // Implementation would query active promotions for item
    return [];
  }

  private async getOrderLevelPromotions(order: any, context: PricingContext): Promise<Promotion[]> {
    // Implementation would query order-level promotions
    return [];
  }

  private async getPromotionByCode(promotionCode: string): Promise<Promotion | null> {
    // Implementation would query promotion by code
    return null;
  }

  private evaluateRuleConditions(conditions: PricingCondition[], context: any): boolean {
    // Implementation would evaluate rule conditions
    return true;
  }

  private evaluatePromotionConditions(conditions: PricingCondition[], context: any): boolean {
    // Implementation would evaluate promotion conditions
    return true;
  }

  private calculateRuleDiscount(actions: PricingAction[], price: number, quantity: number): number {
    let totalDiscount = 0;
    for (const action of actions) {
      switch (action.actionType) {
        case 'ADD_DISCOUNT':
          if (action.valueType === 'PERCENTAGE') {
            totalDiscount += price * (action.value / 100);
          } else {
            totalDiscount += action.value;
          }
          break;
        case 'SET_PRICE':
          totalDiscount = Math.max(0, price - action.value);
          break;
      }
    }
    return totalDiscount;
  }

  private calculatePromotionDiscount(actions: PricingAction[], price: number, quantity: number): number {
    let totalDiscount = 0;
    for (const action of actions) {
      switch (action.actionType) {
        case 'ADD_DISCOUNT':
          if (action.valueType === 'PERCENTAGE') {
            totalDiscount += price * (action.value / 100);
          } else {
            totalDiscount += action.value;
          }
          break;
        case 'SET_PRICE':
          totalDiscount = Math.max(0, price - action.value);
          break;
      }
    }
    return totalDiscount;
  }

  private async applyOrderPromotions(
    lineItems: any[], 
    promotions: Promotion[], 
    context: PricingContext
  ): Promise<{
    lineItems: any[];
    orderDiscountAmount: number;
    appliedPromotions: AppliedPromotion[];
  }> {
    // Implementation would apply order-level promotions
    return {
      lineItems,
      orderDiscountAmount: 0,
      appliedPromotions: []
    };
  }
}

export const pricingEngineService = new PricingEngineService();