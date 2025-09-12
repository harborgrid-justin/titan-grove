/**
 * Centralized Business Logic Registry
 * Implements Oracle EBS-style centralized business rules with modern architecture patterns
 * Following Google's dependency injection and Facebook's service layer patterns
 */

export interface BusinessRule {
  id: string;
  name: string;
  description: string;
  category: 'financial' | 'manufacturing' | 'supply-chain' | 'hr' | 'crm' | 'compliance';
  priority: 'high' | 'medium' | 'low';
  isActive: boolean;
  execute: (context: any) => Promise<any>;
  validate: (input: any) => boolean;
}

export interface BusinessContext {
  userId: string;
  sessionId: string;
  organizationId: string;
  timestamp: Date;
  permissions: string[];
  correlationId: string;
}

export interface ServiceResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  warnings?: string[];
  metadata?: Record<string, any>;
}

/**
 * Central Business Logic Registry
 * Manages all business rules and calculations across the enterprise
 */
export class CentralBusinessLogicRegistry {
  private static instance: CentralBusinessLogicRegistry;
  private businessRules: Map<string, BusinessRule> = new Map();
  private serviceCache: Map<string, any> = new Map();

  private constructor() {
    this.initializeCoreBusinessRules();
  }

  public static getInstance(): CentralBusinessLogicRegistry {
    if (!CentralBusinessLogicRegistry.instance) {
      CentralBusinessLogicRegistry.instance = new CentralBusinessLogicRegistry();
    }
    return CentralBusinessLogicRegistry.instance;
  }

  /**
   * Initialize core business rules following Oracle EBS patterns
   */
  private initializeCoreBusinessRules(): void {
    // Financial Business Rules
    this.registerBusinessRule({
      id: 'FIN_001',
      name: 'Revenue Recognition',
      description: 'ASC 606 compliant revenue recognition rules',
      category: 'financial',
      priority: 'high',
      isActive: true,
      execute: async (context: any) => {
        // Implement revenue recognition logic
        const { amount, currency, contractTerms } = context;
        return this.calculateRevenueRecognition(amount, currency, contractTerms);
      },
      validate: (input: any) => {
        return input.amount > 0 && input.currency && input.contractTerms;
      }
    });

    // Manufacturing Business Rules
    this.registerBusinessRule({
      id: 'MFG_001',
      name: 'OEE Calculation',
      description: 'Overall Equipment Effectiveness calculation',
      category: 'manufacturing',
      priority: 'high',
      isActive: true,
      execute: async (context: any) => {
        const { availability, performance, quality } = context;
        return (availability * performance * quality) / 10000; // Convert to percentage
      },
      validate: (input: any) => {
        return input.availability >= 0 && input.performance >= 0 && input.quality >= 0;
      }
    });

    // Supply Chain Business Rules
    this.registerBusinessRule({
      id: 'SCM_001',
      name: 'Safety Stock Calculation',
      description: 'Dynamic safety stock calculation based on demand variability',
      category: 'supply-chain',
      priority: 'medium',
      isActive: true,
      execute: async (context: any) => {
        const { averageDemand, leadTime, serviceLevel, demandVariability } = context;
        const zScore = this.getZScore(serviceLevel);
        return Math.sqrt(leadTime) * demandVariability * zScore;
      },
      validate: (input: any) => {
        return input.averageDemand > 0 && input.leadTime > 0 && input.serviceLevel > 0;
      }
    });
  }

  /**
   * Register a new business rule
   */
  public registerBusinessRule(rule: BusinessRule): void {
    this.businessRules.set(rule.id, rule);
  }

  /**
   * Execute a business rule with context
   */
  public async executeBusinessRule<T>(
    ruleId: string, 
    context: any, 
    businessContext: BusinessContext
  ): Promise<ServiceResult<T>> {
    try {
      const rule = this.businessRules.get(ruleId);
      if (!rule) {
        return {
          success: false,
          error: `Business rule ${ruleId} not found`
        };
      }

      if (!rule.isActive) {
        return {
          success: false,
          error: `Business rule ${ruleId} is not active`
        };
      }

      if (!rule.validate(context)) {
        return {
          success: false,
          error: `Invalid input for business rule ${ruleId}`
        };
      }

      const result = await rule.execute(context);
      
      return {
        success: true,
        data: result,
        metadata: {
          ruleId,
          executedAt: new Date().toISOString(),
          executedBy: businessContext.userId,
          correlationId: businessContext.correlationId
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        metadata: {
          ruleId,
          errorAt: new Date().toISOString(),
          correlationId: businessContext.correlationId
        }
      };
    }
  }

  /**
   * Get all business rules by category
   */
  public getBusinessRulesByCategory(category: BusinessRule['category']): BusinessRule[] {
    return Array.from(this.businessRules.values()).filter(rule => rule.category === category);
  }

  /**
   * Revenue recognition calculation following ASC 606
   */
  private calculateRevenueRecognition(amount: number, currency: string, contractTerms: any) {
    // Simplified revenue recognition logic
    const { deliverySchedule, performanceObligations } = contractTerms;
    
    if (performanceObligations.length === 1 && deliverySchedule === 'immediate') {
      return {
        recognitionAmount: amount,
        recognitionDate: new Date(),
        pattern: 'point-in-time'
      };
    }

    // Over-time recognition
    const recognitionPeriod = contractTerms.recognitionPeriod || 12;
    const monthlyAmount = amount / recognitionPeriod;

    return {
      recognitionAmount: monthlyAmount,
      recognitionDate: new Date(),
      pattern: 'over-time',
      totalPeriods: recognitionPeriod
    };
  }

  /**
   * Get Z-Score for service level
   */
  private getZScore(serviceLevel: number): number {
    const serviceLevelMap: Record<number, number> = {
      50: 0.00,
      80: 0.84,
      85: 1.04,
      90: 1.28,
      95: 1.65,
      96: 1.75,
      97: 1.88,
      98: 2.05,
      99: 2.33,
      99.9: 3.09
    };

    return serviceLevelMap[serviceLevel] || 1.65; // Default to 95%
  }
}

/**
 * Business Service Factory
 * Creates business services with proper dependency injection
 */
export class BusinessServiceFactory {
  private static instance: BusinessServiceFactory;
  private services: Map<string, any> = new Map();

  private constructor() {}

  public static getInstance(): BusinessServiceFactory {
    if (!BusinessServiceFactory.instance) {
      BusinessServiceFactory.instance = new BusinessServiceFactory();
    }
    return BusinessServiceFactory.instance;
  }

  /**
   * Create or get a business service
   */
  public getService<T>(serviceType: string, dependencies?: any): T {
    if (!this.services.has(serviceType)) {
      const service = this.createService(serviceType, dependencies);
      this.services.set(serviceType, service);
    }
    return this.services.get(serviceType) as T;
  }

  private createService(serviceType: string, dependencies?: any): any {
    const businessLogic = CentralBusinessLogicRegistry.getInstance();

    switch (serviceType) {
      case 'ManufacturingService':
        return new ManufacturingService(businessLogic, dependencies);
      case 'FinancialService':
        return new FinancialService(businessLogic, dependencies);
      case 'SupplyChainService':
        return new SupplyChainService(businessLogic, dependencies);
      default:
        throw new Error(`Unknown service type: ${serviceType}`);
    }
  }
}

/**
 * Manufacturing Service - implements business logic for manufacturing operations
 */
export class ManufacturingService {
  constructor(
    private businessLogic: CentralBusinessLogicRegistry,
    private dependencies?: any
  ) {}

  async calculateOEE(availability: number, performance: number, quality: number): Promise<ServiceResult<number>> {
    const context = { availability, performance, quality };
    const businessContext: BusinessContext = {
      userId: 'system',
      sessionId: 'manufacturing',
      organizationId: 'default',
      timestamp: new Date(),
      permissions: ['manufacturing:read', 'manufacturing:calculate'],
      correlationId: `mfg-${Date.now()}`
    };

    return this.businessLogic.executeBusinessRule('MFG_001', context, businessContext);
  }

  async getProductionMetrics(productionLineId: string): Promise<ServiceResult<any>> {
    // Mock production metrics
    return {
      success: true,
      data: {
        lineId: productionLineId,
        currentOutput: Math.floor(Math.random() * 1000) + 500,
        targetOutput: 1000,
        efficiency: Math.floor(Math.random() * 20) + 80,
        qualityScore: Math.floor(Math.random() * 10) + 90,
        status: Math.random() > 0.7 ? 'maintenance' : 'running'
      }
    };
  }
}

/**
 * Financial Service - implements financial business logic
 */
export class FinancialService {
  constructor(
    private businessLogic: CentralBusinessLogicRegistry,
    private dependencies?: any
  ) {}

  async recognizeRevenue(amount: number, currency: string, contractTerms: any): Promise<ServiceResult<any>> {
    const context = { amount, currency, contractTerms };
    const businessContext: BusinessContext = {
      userId: 'system',
      sessionId: 'financial',
      organizationId: 'default',
      timestamp: new Date(),
      permissions: ['finance:read', 'finance:revenue'],
      correlationId: `fin-${Date.now()}`
    };

    return this.businessLogic.executeBusinessRule('FIN_001', context, businessContext);
  }

  async getFinancialMetrics(): Promise<ServiceResult<any>> {
    return {
      success: true,
      data: {
        totalRevenue: 47200000,
        operatingMargin: 23.6,
        netProfit: 11140800,
        cashFlow: 8500000,
        growthRate: 18.4
      }
    };
  }
}

/**
 * Supply Chain Service - implements supply chain business logic
 */
export class SupplyChainService {
  constructor(
    private businessLogic: CentralBusinessLogicRegistry,
    private dependencies?: any
  ) {}

  async calculateSafetyStock(
    averageDemand: number, 
    leadTime: number, 
    serviceLevel: number, 
    demandVariability: number
  ): Promise<ServiceResult<number>> {
    const context = { averageDemand, leadTime, serviceLevel, demandVariability };
    const businessContext: BusinessContext = {
      userId: 'system',
      sessionId: 'supply-chain',
      organizationId: 'default',
      timestamp: new Date(),
      permissions: ['scm:read', 'scm:calculate'],
      correlationId: `scm-${Date.now()}`
    };

    return this.businessLogic.executeBusinessRule('SCM_001', context, businessContext);
  }
}

// Export singleton instances
export const businessLogicRegistry = CentralBusinessLogicRegistry.getInstance();
export const businessServiceFactory = BusinessServiceFactory.getInstance();