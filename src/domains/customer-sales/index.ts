/**
 * Customer & Sales Domain
 * Centralized business logic for CRM, sales operations, and order processing
 */

import { crmManager, CRMManager } from '../../modules/crm';
import { orderManager, OrderManager } from '../../modules/orders';
import { BusinessConfig } from '../../types/business-config';

export interface CustomerSalesDomainConfig {
  sales: {
    commissionRates: {
      base: number;
      premium: number;
      enterprise: number;
    };
    discountRules: {
      volumeDiscount: number;
      loyaltyDiscount: number;
      seasonalDiscount: number;
    };
    pricingTiers: {
      bronze: { markup: number; minOrder: number; };
      silver: { markup: number; minOrder: number; };
      gold: { markup: number; minOrder: number; };
    };
  };
  customer: {
    segmentation: {
      smallBusiness: { revenueMax: number; };
      midMarket: { revenueMin: number; revenueMax: number; };
      enterprise: { revenueMin: number; };
    };
  };
}

/**
 * Core Business Logic Functions - Customer & Sales Domain
 * Consolidated business calculations for sales and customer management
 */
export class CustomerSalesBusinessLogic {
  
  /**
   * Calculate sales commission based on deal size and type
   */
  static calculateCommission(dealValue: number, commissionRate: number = 0.05): number {
    return dealValue * commissionRate;
  }

  /**
   * Calculate pricing with discounts
   */
  static calculatePricingWithDiscounts(basePrice: number, discounts: {
    volume?: number;
    loyalty?: number;
    seasonal?: number;
  }): {
    basePrice: number;
    totalDiscount: number;
    finalPrice: number;
    discountBreakdown: any;
  } {
    const volumeDiscount = basePrice * (discounts.volume || 0);
    const loyaltyDiscount = basePrice * (discounts.loyalty || 0);
    const seasonalDiscount = basePrice * (discounts.seasonal || 0);
    
    const totalDiscount = volumeDiscount + loyaltyDiscount + seasonalDiscount;
    
    return {
      basePrice,
      totalDiscount,
      finalPrice: basePrice - totalDiscount,
      discountBreakdown: {
        volume: volumeDiscount,
        loyalty: loyaltyDiscount,
        seasonal: seasonalDiscount
      }
    };
  }

  /**
   * Calculate customer lifetime value
   */
  static calculateCustomerLifetimeValue(
    averageOrderValue: number,
    orderFrequency: number,
    customerLifespan: number
  ): number {
    return averageOrderValue * orderFrequency * customerLifespan;
  }
}

/**
 * Customer & Sales Domain Manager
 * Orchestrates all customer and sales-related modules with centralized business logic
 */
export class CustomerSalesDomainManager {
  private crmManager: CRMManager;
  private orderManager: OrderManager;
  private config: CustomerSalesDomainConfig;

  constructor(config?: Partial<CustomerSalesDomainConfig>) {
    this.crmManager = crmManager;
    this.orderManager = orderManager;
    this.config = this.getDefaultConfig();
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  private getDefaultConfig(): CustomerSalesDomainConfig {
    return {
      sales: {
        commissionRates: {
          base: 0.03,
          premium: 0.05,
          enterprise: 0.07
        },
        discountRules: {
          volumeDiscount: 0.10,
          loyaltyDiscount: 0.05,
          seasonalDiscount: 0.15
        },
        pricingTiers: {
          bronze: { markup: 1.2, minOrder: 1000 },
          silver: { markup: 1.5, minOrder: 5000 },
          gold: { markup: 2.0, minOrder: 10000 }
        }
      },
      customer: {
        segmentation: {
          smallBusiness: { revenueMax: 100000 },
          midMarket: { revenueMin: 100000, revenueMax: 1000000 },
          enterprise: { revenueMin: 1000000 }
        }
      }
    };
  }

  /**
   * Perform comprehensive sales analysis
   */
  async performSalesAnalysis(period: { startDate: Date; endDate: Date }): Promise<any> {
    // Placeholder for sales analysis business logic
    return {
      totalRevenue: 2500000,
      totalOrders: 850,
      averageOrderValue: 2941.18,
      conversionRate: 0.24,
      customerAcquisitionCost: 125,
      customerLifetimeValue: CustomerSalesBusinessLogic.calculateCustomerLifetimeValue(2941.18, 4, 3),
      topPerformers: [
        { rep: 'Alice Johnson', revenue: 485000, commission: 24250 },
        { rep: 'Bob Smith', revenue: 398000, commission: 19900 }
      ]
    };
  }

  // Delegate to specific modules for operations
  getCRMManager(): CRMManager {
    return this.crmManager;
  }

  getOrderManager(): OrderManager {
    return this.orderManager;
  }

  getDomainConfig(): CustomerSalesDomainConfig {
    return this.config;
  }
}

// Export singleton instance
export const customerSalesDomainManager = new CustomerSalesDomainManager();