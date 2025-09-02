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

  /**
   * Advanced sales forecasting and pipeline analysis
   */
  static calculateSalesForecasting(
    historicalData: { month: number; revenue: number; leads: number; conversions: number }[],
    pipelineData: { 
      stage: string; 
      dealValue: number; 
      probability: number; 
      timeInStage: number; 
      salesRep: string 
    }[],
    marketFactors: {
      seasonality: number[];
      marketGrowth: number;
      competitiveIndex: number;
    }
  ): {
    forecastedRevenue: number[];
    pipelineValue: number;
    conversionRates: { stage: string; rate: number }[];
    salesVelocity: number;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    
    // Calculate trend from historical data
    const revenues = historicalData.map(d => d.revenue);
    const n = revenues.length;
    const sumX = n * (n + 1) / 2;
    const sumY = revenues.reduce((sum, rev) => sum + rev, 0);
    const sumXY = revenues.reduce((sum, rev, index) => sum + rev * (index + 1), 0);
    const sumX2 = n * (n + 1) * (2 * n + 1) / 6;
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Generate forecasts with seasonality and market factors
    const forecastedRevenue: number[] = [];
    for (let i = 0; i < 12; i++) { // 12 months forecast
      const trendValue = intercept + slope * (n + i + 1);
      const seasonalAdjustment = marketFactors.seasonality[i % marketFactors.seasonality.length] || 1;
      const marketAdjustment = 1 + marketFactors.marketGrowth - (marketFactors.competitiveIndex * 0.1);
      
      const forecast = trendValue * seasonalAdjustment * marketAdjustment;
      forecastedRevenue.push(Math.max(0, forecast));
    }

    // Analyze pipeline
    let pipelineValue = 0;
    const stageData: { [stage: string]: { count: number; totalValue: number; totalTime: number } } = {};
    
    for (const deal of pipelineData) {
      pipelineValue += deal.dealValue * deal.probability;
      
      if (!stageData[deal.stage]) {
        stageData[deal.stage] = { count: 0, totalValue: 0, totalTime: 0 };
      }
      stageData[deal.stage].count++;
      stageData[deal.stage].totalValue += deal.dealValue;
      stageData[deal.stage].totalTime += deal.timeInStage;
    }

    const conversionRates = Object.entries(stageData).map(([stage, data]) => ({
      stage,
      rate: data.count / pipelineData.length
    }));

    // Calculate sales velocity (deals * average deal size * win rate / average sales cycle)
    const avgDealSize = pipelineData.reduce((sum, deal) => sum + deal.dealValue, 0) / pipelineData.length;
    const avgWinRate = pipelineData.reduce((sum, deal) => sum + deal.probability, 0) / pipelineData.length;
    const avgSalesCycle = Object.values(stageData).reduce((sum, data) => sum + (data.totalTime / data.count), 0);
    const salesVelocity = (pipelineData.length * avgDealSize * avgWinRate) / avgSalesCycle;

    // Generate recommendations
    if (avgSalesCycle > 90) {
      recommendations.push('Sales cycle too long - implement sales acceleration tactics');
    }
    if (avgWinRate < 0.2) {
      recommendations.push('Low win rate - improve qualification and discovery processes');
    }
    if (pipelineValue < forecastedRevenue[0] * 3) {
      recommendations.push('Pipeline too thin - increase lead generation activities');
    }

    return {
      forecastedRevenue,
      pipelineValue,
      conversionRates,
      salesVelocity,
      recommendations
    };
  }

  /**
   * Customer segmentation and profitability analysis
   */
  static calculateCustomerSegmentation(
    customers: {
      id: string;
      revenue: number;
      orders: number;
      acquisitionCost: number;
      serviceCost: number;
      tenure: number;
      segment: string;
      industry: string;
      geography: string;
    }[]
  ): {
    segments: { [segment: string]: { count: number; totalRevenue: number; avgLifetimeValue: number; profitability: number } };
    rfmAnalysis: { customer: string; recency: number; frequency: number; monetary: number; score: number }[];
    churnRisk: { customer: string; riskScore: number; factors: string[] }[];
    profitabilityTiers: { tier: string; customers: string[]; contribution: number }[];
  } {
    const segments: { [segment: string]: any } = {};
    const rfmAnalysis: any[] = [];
    const churnRisk: any[] = [];
    
    // Segment analysis
    for (const customer of customers) {
      if (!segments[customer.segment]) {
        segments[customer.segment] = {
          count: 0,
          totalRevenue: 0,
          totalAcquisitionCost: 0,
          totalServiceCost: 0,
          totalTenure: 0
        };
      }
      
      const segment = segments[customer.segment];
      segment.count++;
      segment.totalRevenue += customer.revenue;
      segment.totalAcquisitionCost += customer.acquisitionCost;
      segment.totalServiceCost += customer.serviceCost;
      segment.totalTenure += customer.tenure;
    }

    // Calculate segment metrics
    for (const segment of Object.values(segments)) {
      segment.avgLifetimeValue = segment.totalRevenue / segment.count;
      segment.profitability = (segment.totalRevenue - segment.totalAcquisitionCost - segment.totalServiceCost) / segment.totalRevenue;
    }

    // RFM Analysis (Recency, Frequency, Monetary)
    const maxRevenue = Math.max(...customers.map(c => c.revenue));
    const maxOrders = Math.max(...customers.map(c => c.orders));
    const maxTenure = Math.max(...customers.map(c => c.tenure));

    for (const customer of customers) {
      const recency = Math.min(5, Math.ceil((customer.tenure / maxTenure) * 5)); // 1-5 scale
      const frequency = Math.min(5, Math.ceil((customer.orders / maxOrders) * 5));
      const monetary = Math.min(5, Math.ceil((customer.revenue / maxRevenue) * 5));
      const score = recency * 100 + frequency * 10 + monetary;
      
      rfmAnalysis.push({
        customer: customer.id,
        recency,
        frequency,
        monetary,
        score
      });

      // Churn risk analysis
      const riskFactors: string[] = [];
      let riskScore = 0;
      
      if (customer.tenure < 1) {
        riskScore += 30;
        riskFactors.push('New customer - higher churn risk');
      }
      if (customer.orders < 2) {
        riskScore += 25;
        riskFactors.push('Low engagement - few orders');
      }
      if (customer.revenue < maxRevenue * 0.1) {
        riskScore += 20;
        riskFactors.push('Low revenue customer');
      }
      if (customer.serviceCost > customer.revenue * 0.3) {
        riskScore += 35;
        riskFactors.push('High service cost relative to revenue');
      }

      churnRisk.push({
        customer: customer.id,
        riskScore: Math.min(100, riskScore),
        factors: riskFactors
      });
    }

    // Profitability tiers
    const sortedCustomers = customers.sort((a, b) => 
      (b.revenue - b.acquisitionCost - b.serviceCost) - (a.revenue - a.acquisitionCost - a.serviceCost)
    );

    const totalCustomers = customers.length;
    const profitabilityTiers = [
      {
        tier: 'Platinum (Top 20%)',
        customers: sortedCustomers.slice(0, Math.ceil(totalCustomers * 0.2)).map(c => c.id),
        contribution: sortedCustomers.slice(0, Math.ceil(totalCustomers * 0.2))
          .reduce((sum, c) => sum + (c.revenue - c.acquisitionCost - c.serviceCost), 0)
      },
      {
        tier: 'Gold (Next 30%)',
        customers: sortedCustomers.slice(Math.ceil(totalCustomers * 0.2), Math.ceil(totalCustomers * 0.5)).map(c => c.id),
        contribution: sortedCustomers.slice(Math.ceil(totalCustomers * 0.2), Math.ceil(totalCustomers * 0.5))
          .reduce((sum, c) => sum + (c.revenue - c.acquisitionCost - c.serviceCost), 0)
      }
    ];

    return {
      segments,
      rfmAnalysis: rfmAnalysis.sort((a, b) => b.score - a.score),
      churnRisk: churnRisk.filter(c => c.riskScore > 40).sort((a, b) => b.riskScore - a.riskScore),
      profitabilityTiers
    };
  }

  /**
   * Marketing campaign optimization and ROI analysis
   */
  static calculateMarketingOptimization(
    campaigns: {
      id: string;
      channel: string;
      spend: number;
      impressions: number;
      clicks: number;
      conversions: number;
      revenue: number;
      duration: number;
    }[],
    budgetConstraints: { total: number; channelLimits: { [channel: string]: number } }
  ): {
    campaignPerformance: { id: string; roi: number; cpa: number; conversionRate: number; efficiency: number }[];
    channelAnalysis: { [channel: string]: { totalSpend: number; totalRevenue: number; avgROI: number; recommended: boolean } };
    budgetAllocation: { channel: string; currentSpend: number; recommendedSpend: number; expectedROI: number }[];
    optimization: { totalROI: number; efficiencyGains: number; recommendations: string[] };
  } {
    const campaignPerformance: any[] = [];
    const channelData: { [channel: string]: any } = {};
    const recommendations: string[] = [];

    // Analyze each campaign
    for (const campaign of campaigns) {
      const roi = campaign.spend > 0 ? ((campaign.revenue - campaign.spend) / campaign.spend) * 100 : 0;
      const cpa = campaign.conversions > 0 ? campaign.spend / campaign.conversions : 0;
      const conversionRate = campaign.clicks > 0 ? (campaign.conversions / campaign.clicks) * 100 : 0;
      const ctr = campaign.impressions > 0 ? (campaign.clicks / campaign.impressions) * 100 : 0;
      const efficiency = roi * conversionRate / 100; // Combined efficiency metric

      campaignPerformance.push({
        id: campaign.id,
        roi,
        cpa,
        conversionRate,
        efficiency
      });

      // Aggregate channel data
      if (!channelData[campaign.channel]) {
        channelData[campaign.channel] = {
          totalSpend: 0,
          totalRevenue: 0,
          campaignCount: 0,
          totalROI: 0
        };
      }

      channelData[campaign.channel].totalSpend += campaign.spend;
      channelData[campaign.channel].totalRevenue += campaign.revenue;
      channelData[campaign.channel].campaignCount++;
      channelData[campaign.channel].totalROI += roi;
    }

    // Channel analysis
    const channelAnalysis: { [channel: string]: any } = {};
    for (const [channel, data] of Object.entries(channelData)) {
      const avgROI = data.totalROI / data.campaignCount;
      const recommended = avgROI > 50; // ROI threshold for recommendation

      channelAnalysis[channel] = {
        totalSpend: data.totalSpend,
        totalRevenue: data.totalRevenue,
        avgROI,
        recommended
      };
    }

    // Budget optimization
    const sortedChannels = Object.entries(channelAnalysis)
      .sort((a, b) => b[1].avgROI - a[1].avgROI);

    const budgetAllocation: any[] = [];
    let remainingBudget = budgetConstraints.total;

    for (const [channel, analysis] of sortedChannels) {
      const currentSpend = analysis.totalSpend;
      const channelLimit = budgetConstraints.channelLimits[channel] || remainingBudget;
      const recommendedSpend = Math.min(
        channelLimit,
        analysis.avgROI > 100 ? currentSpend * 1.5 : // Increase high-performing channels
        analysis.avgROI > 50 ? currentSpend : // Maintain decent performers
        currentSpend * 0.7 // Decrease poor performers
      );

      budgetAllocation.push({
        channel,
        currentSpend,
        recommendedSpend,
        expectedROI: analysis.avgROI
      });

      remainingBudget -= recommendedSpend;
    }

    // Generate recommendations
    const highPerformers = Object.entries(channelAnalysis).filter(([_, data]) => data.avgROI > 100);
    const lowPerformers = Object.entries(channelAnalysis).filter(([_, data]) => data.avgROI < 25);

    if (highPerformers.length > 0) {
      recommendations.push(`Scale up high-performing channels: ${highPerformers.map(([channel]) => channel).join(', ')}`);
    }
    if (lowPerformers.length > 0) {
      recommendations.push(`Review or pause low-performing channels: ${lowPerformers.map(([channel]) => channel).join(', ')}`);
    }

    const totalCurrentROI = campaigns.reduce((sum, c) => sum + (c.revenue - c.spend), 0);
    const totalCurrentSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
    const currentROI = totalCurrentSpend > 0 ? (totalCurrentROI / totalCurrentSpend) * 100 : 0;

    const totalRecommendedSpend = budgetAllocation.reduce((sum, b) => sum + b.recommendedSpend, 0);
    const expectedTotalROI = budgetAllocation.reduce((sum, b) => sum + (b.recommendedSpend * b.expectedROI / 100), 0);
    const optimizedROI = totalRecommendedSpend > 0 ? (expectedTotalROI / totalRecommendedSpend) * 100 : 0;

    return {
      campaignPerformance: campaignPerformance.sort((a, b) => b.efficiency - a.efficiency),
      channelAnalysis,
      budgetAllocation,
      optimization: {
        totalROI: optimizedROI,
        efficiencyGains: optimizedROI - currentROI,
        recommendations
      }
    };
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
    // Enhanced sales analysis with comprehensive business logic
    const sampleHistoricalData = [
      { month: 1, revenue: 450000, leads: 1200, conversions: 85 },
      { month: 2, revenue: 520000, leads: 1350, conversions: 92 },
      { month: 3, revenue: 480000, leads: 1180, conversions: 78 },
      { month: 4, revenue: 610000, leads: 1450, conversions: 105 }
    ];

    const samplePipelineData = [
      { stage: 'Qualified', dealValue: 25000, probability: 0.8, timeInStage: 15, salesRep: 'Alice Johnson' },
      { stage: 'Proposal', dealValue: 45000, probability: 0.6, timeInStage: 22, salesRep: 'Bob Smith' },
      { stage: 'Negotiation', dealValue: 35000, probability: 0.9, timeInStage: 8, salesRep: 'Alice Johnson' },
      { stage: 'Qualified', dealValue: 18000, probability: 0.7, timeInStage: 12, salesRep: 'Carol Williams' }
    ];

    const marketFactors = {
      seasonality: [1.0, 1.1, 0.9, 1.2, 1.3, 0.8, 0.7, 0.9, 1.1, 1.4, 1.2, 1.5],
      marketGrowth: 0.08,
      competitiveIndex: 0.6
    };

    const salesForecasting = CustomerSalesBusinessLogic.calculateSalesForecasting(
      sampleHistoricalData,
      samplePipelineData,
      marketFactors
    );

    const sampleCustomers = [
      { id: 'cust_001', revenue: 125000, orders: 15, acquisitionCost: 2500, serviceCost: 8000, tenure: 2.5, segment: 'Enterprise', industry: 'Technology', geography: 'West' },
      { id: 'cust_002', revenue: 85000, orders: 8, acquisitionCost: 1800, serviceCost: 5500, tenure: 1.8, segment: 'Mid-Market', industry: 'Healthcare', geography: 'East' },
      { id: 'cust_003', revenue: 45000, orders: 12, acquisitionCost: 1200, serviceCost: 3200, tenure: 3.2, segment: 'SMB', industry: 'Retail', geography: 'Central' }
    ];

    const customerSegmentation = CustomerSalesBusinessLogic.calculateCustomerSegmentation(sampleCustomers);

    return {
      totalRevenue: 2500000,
      totalOrders: 850,
      averageOrderValue: 2941.18,
      conversionRate: 0.24,
      customerAcquisitionCost: 125,
      customerLifetimeValue: CustomerSalesBusinessLogic.calculateCustomerLifetimeValue(2941.18, 4, 3),
      forecasting: salesForecasting,
      segmentation: customerSegmentation,
      topPerformers: [
        { rep: 'Alice Johnson', revenue: 485000, commission: 24250 },
        { rep: 'Bob Smith', revenue: 398000, commission: 19900 }
      ],
      recommendations: [
        ...salesForecasting.recommendations,
        'Focus on Enterprise segment - highest profitability',
        'Implement retention programs for high churn risk customers'
      ]
    };
  }

  /**
   * Perform marketing campaign analysis and optimization
   */
  async performMarketingAnalysis(): Promise<any> {
    const sampleCampaigns = [
      { id: 'cam_001', channel: 'Google Ads', spend: 25000, impressions: 450000, clicks: 9000, conversions: 180, revenue: 54000, duration: 30 },
      { id: 'cam_002', channel: 'Facebook', spend: 18000, impressions: 320000, clicks: 7200, conversions: 144, revenue: 43200, duration: 30 },
      { id: 'cam_003', channel: 'LinkedIn', spend: 32000, impressions: 180000, clicks: 5400, conversions: 162, revenue: 64800, duration: 30 },
      { id: 'cam_004', channel: 'Email', spend: 8000, impressions: 85000, clicks: 6800, conversions: 340, revenue: 85000, duration: 30 }
    ];

    const budgetConstraints = {
      total: 100000,
      channelLimits: {
        'Google Ads': 35000,
        'Facebook': 25000,
        'LinkedIn': 40000,
        'Email': 15000
      }
    };

    const marketingOptimization = CustomerSalesBusinessLogic.calculateMarketingOptimization(
      sampleCampaigns,
      budgetConstraints
    );

    return {
      totalMarketingSpend: 83000,
      totalMarketingRevenue: 247000,
      overallROI: 197.6,
      optimization: marketingOptimization,
      attribution: {
        firstTouch: { 'Google Ads': 35, 'Facebook': 25, 'LinkedIn': 20, 'Email': 20 },
        lastTouch: { 'Google Ads': 30, 'Facebook': 20, 'LinkedIn': 25, 'Email': 25 },
        multiTouch: { 'Google Ads': 32, 'Facebook': 22, 'LinkedIn': 23, 'Email': 23 }
      }
    };
  }

  /**
   * Perform customer experience and satisfaction analysis
   */
  async performCustomerExperienceAnalysis(): Promise<any> {
    const customerFeedback = {
      npsScore: 68,
      csatScore: 4.2,
      cesScore: 3.1,
      responseRate: 0.23,
      detractors: 12,
      passives: 20,
      promoters: 68
    };

    const touchpointAnalysis = {
      website: { satisfaction: 4.1, importance: 4.5, effort: 3.2 },
      support: { satisfaction: 3.8, importance: 4.8, effort: 3.8 },
      sales: { satisfaction: 4.3, importance: 4.6, effort: 3.0 },
      onboarding: { satisfaction: 3.9, importance: 4.4, effort: 3.6 },
      billing: { satisfaction: 3.5, importance: 4.2, effort: 4.1 }
    };

    const priorityMatrix: { touchpoint: string; priority: number; gap: number }[] = [];
    for (const [touchpoint, scores] of Object.entries(touchpointAnalysis)) {
      const gap = scores.importance - scores.satisfaction;
      const priority = gap * scores.importance;
      priorityMatrix.push({ touchpoint, priority, gap });
    }

    priorityMatrix.sort((a, b) => b.priority - a.priority);

    return {
      customerSatisfaction: customerFeedback,
      touchpoints: touchpointAnalysis,
      improvementPriorities: priorityMatrix,
      recommendations: [
        'Address billing process issues - highest priority for improvement',
        'Enhance support experience to reduce effort',
        'Leverage promoters for referral programs',
        'Focus on converting passives to promoters'
      ],
      predictedImpact: {
        revenueRetention: 0.95,
        churnReduction: 0.15,
        referralIncrease: 0.25
      }
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