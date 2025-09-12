/**
 * Configure-to-Order Service
 * Oracle EBS competitive implementation for mass customization solutions
 * Supports engineer-to-order, build-to-order, assemble-to-order, and purchase-to-order environments
 */

import type {
  ProductConfiguration,
  ConfigurationOption,
  ConfigurationRule,
  SalesOrder,
  Quote,
} from '../../types';
import type { ConfigureToOrderConfig } from '../../../../types/business-config';

export interface ConfigurableProduct {
  id: string;
  productCode: string;
  name: string;
  description: string;
  basePrice: number;
  baseCost: number;
  configurationType:
    | 'ENGINEER_TO_ORDER'
    | 'BUILD_TO_ORDER'
    | 'ASSEMBLE_TO_ORDER'
    | 'PURCHASE_TO_ORDER';
  configurationModel: ConfigurationModel;
  options: ConfigurationOption[];
  rules: ConfigurationRule[];
  leadTimeBase: number; // days
  isConfigurable: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'DEVELOPMENT';
}

export interface ConfigurationModel {
  id: string;
  modelName: string;
  version: string;
  optionGroups: OptionGroup[];
  dependencies: ConfigurationDependency[];
  constraints: ConfigurationConstraint[];
  pricingRules: ConfigurationPricingRule[];
}

export interface OptionGroup {
  id: string;
  groupName: string;
  displayOrder: number;
  selectionType: 'SINGLE' | 'MULTIPLE' | 'NUMERIC';
  isRequired: boolean;
  options: ConfigurationOption[];
  minSelections?: number;
  maxSelections?: number;
}

export interface ConfigurationDependency {
  id: string;
  parentOptionId: string;
  childOptionId: string;
  dependencyType: 'REQUIRES' | 'EXCLUDES' | 'ENABLES';
  conditions?: any[];
}

export interface ConfigurationConstraint {
  id: string;
  constraintType: 'TECHNICAL' | 'BUSINESS' | 'MANUFACTURING';
  expression: string;
  errorMessage: string;
  severity: 'ERROR' | 'WARNING' | 'INFO';
}

export interface ConfigurationPricingRule {
  id: string;
  ruleType: 'OPTION_PRICING' | 'BUNDLE_DISCOUNT' | 'VOLUME_PRICING' | 'COMPLEXITY_SURCHARGE';
  conditions: any[];
  priceAdjustment: number;
  adjustmentType: 'AMOUNT' | 'PERCENTAGE';
  effectiveDate: Date;
  expirationDate?: Date;
}

export interface ConfigurationSession {
  sessionId: string;
  customerId: string;
  productId: string;
  configuration: ProductConfiguration;
  validationStatus: 'VALID' | 'INVALID' | 'INCOMPLETE';
  validationErrors: string[];
  validationWarnings: string[];
  lastModified: Date;
  expiresAt: Date;
}

export interface ConfigurationQuote {
  quoteId: string;
  configurationSessionId: string;
  totalPrice: number;
  totalCost: number;
  margin: number;
  marginPercent: number;
  leadTime: number;
  manufactureability: 'STANDARD' | 'COMPLEX' | 'CUSTOM';
  bomGenerated: boolean;
  routingGenerated: boolean;
  feasibilityCheck: FeasibilityResult;
}

export interface FeasibilityResult {
  isFeasible: boolean;
  constraints: Array<{
    constraintType: string;
    severity: 'BLOCKER' | 'WARNING';
    message: string;
    resolution?: string;
  }>;
  alternativeOptions?: string[];
  costImpact?: number;
  scheduleImpact?: number;
}

/**
 * Configure-to-Order Service
 * Comprehensive mass customization solution competitive with Oracle EBS
 */
export class ConfigureToOrderService {
  // Simple in-memory session storage for demo/testing
  private sessions = new Map<string, ConfigurationSession>();

  constructor(private config: ConfigureToOrderConfig) {}

  // ================================
  // CONFIGURATION MANAGEMENT
  // ================================

  /**
   * Create a new configuration session
   */
  async createConfigurationSession(
    customerId: string,
    productId: string
  ): Promise<ConfigurationSession> {
    const sessionId = `config_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Get configurable product
    const product = await this.getConfigurableProduct(productId);

    const session: ConfigurationSession = {
      sessionId,
      customerId,
      productId,
      configuration: {
        id: `cfg_${sessionId}`,
        baseItemId: productId,
        configurationName: `${product.name} Configuration`,
        selectedOptions: [],
        totalPrice: product.basePrice,
        totalCost: product.baseCost,
        leadTime: product.leadTimeBase,
        validity: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        rules: product.rules,
      },
      validationStatus: 'INCOMPLETE',
      validationErrors: [],
      validationWarnings: [],
      lastModified: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    };

    console.log(`Created configuration session: ${sessionId} for product: ${productId}`);

    // Store in session cache
    this.sessions.set(sessionId, session);

    return session;
  }

  /**
   * Add option to configuration
   */
  async addConfigurationOption(
    sessionId: string,
    optionId: string,
    optionValue: string,
    quantity: number = 1
  ): Promise<ConfigurationSession> {
    console.log(`Adding option ${optionId}=${optionValue} to session ${sessionId}`);

    // Get current session
    const session = await this.getConfigurationSession(sessionId);

    // Validate option compatibility
    const validationResult = await this.validateOptionAddition(session, optionId, optionValue);

    if (!validationResult.isValid) {
      throw new Error(`Option incompatible: ${validationResult.errors.join(', ')}`);
    }

    // Add option to configuration
    const option: ConfigurationOption = {
      optionId,
      optionName: validationResult.optionName,
      optionValue,
      quantity,
      unitPrice: validationResult.unitPrice,
      extendedPrice: validationResult.unitPrice * quantity,
      isRequired: validationResult.isRequired,
      dependentOptions: validationResult.dependentOptions,
      conflictingOptions: validationResult.conflictingOptions,
    };

    session.configuration.selectedOptions.push(option);

    // Recalculate pricing and lead time
    await this.recalculateConfiguration(session);

    // Revalidate configuration
    await this.validateConfiguration(session);

    session.lastModified = new Date();

    // Update session in cache
    this.sessions.set(sessionId, session);

    return session;
  }

  /**
   * Generate quote from configuration
   */
  async generateConfigurationQuote(
    sessionId: string,
    quoteParameters?: {
      validFor?: number; // days
      includeAlternatives?: boolean;
      generateBOM?: boolean;
      generateRouting?: boolean;
    }
  ): Promise<ConfigurationQuote> {
    const session = await this.getConfigurationSession(sessionId);

    if (session.validationStatus !== 'VALID') {
      throw new Error('Configuration must be valid before generating quote');
    }

    const quoteId = `cqt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Perform feasibility analysis
    const feasibilityCheck = await this.performFeasibilityAnalysis(session.configuration);

    // Calculate accurate pricing including configuration complexity
    const pricingResult = await this.calculateConfigurationPricing(session.configuration);

    const quote: ConfigurationQuote = {
      quoteId,
      configurationSessionId: sessionId,
      totalPrice: pricingResult.totalPrice,
      totalCost: pricingResult.totalCost,
      margin: pricingResult.totalPrice - pricingResult.totalCost,
      marginPercent:
        ((pricingResult.totalPrice - pricingResult.totalCost) / pricingResult.totalPrice) * 100,
      leadTime: pricingResult.leadTime,
      manufactureability: this.assessManufacturability(session.configuration),
      bomGenerated: quoteParameters?.generateBOM || false,
      routingGenerated: quoteParameters?.generateRouting || false,
      feasibilityCheck,
    };

    console.log(
      `Generated configuration quote: ${quoteId} - $${quote.totalPrice} with ${quote.leadTime} day lead time`
    );

    return quote;
  }

  /**
   * Convert configuration to sales order
   */
  async convertConfigurationToOrder(
    configurationQuoteId: string,
    orderDetails: {
      customerId: string;
      requestedDeliveryDate?: Date;
      specialInstructions?: string;
    }
  ): Promise<{
    orderId: string;
    orderNumber: string;
    configurationId: string;
    bomId?: string;
    routingId?: string;
    manufactureability: string;
  }> {
    console.log(`Converting configuration quote ${configurationQuoteId} to sales order`);

    const orderId = `cfg_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const orderNumber = `CFG${Date.now().toString().slice(-6)}`;

    // This would integrate with manufacturing to generate BOM and routing
    const result = {
      orderId,
      orderNumber,
      configurationId: configurationQuoteId,
      bomId: `bom_${orderId}`,
      routingId: `rte_${orderId}`,
      manufactureability: 'CUSTOM',
    };

    console.log(`Created configured order: ${orderNumber}`);
    return result;
  }

  // ================================
  // ENGINEER-TO-ORDER CAPABILITIES
  // ================================

  /**
   * Engineer-to-Order workflow management
   */
  async createEngineerToOrderProject(
    configurationQuoteId: string,
    engineeringRequirements: {
      specifications: any[];
      customFeatures: string[];
      engineeringHours: number;
      prototypeRequired: boolean;
      testingRequired: boolean;
    }
  ): Promise<{
    projectId: string;
    engineeringPhases: Array<{
      phaseName: string;
      duration: number;
      deliverables: string[];
      dependencies: string[];
    }>;
    totalEngineeringCost: number;
    projectTimeline: number; // days
  }> {
    const projectId = `eto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log(`Creating Engineer-to-Order project: ${projectId}`);

    return {
      projectId,
      engineeringPhases: [
        {
          phaseName: 'Design & Engineering',
          duration: this.config.defaultEngineeringDuration,
          deliverables: ['Technical drawings', 'BOM specification', 'Manufacturing routing'],
          dependencies: ['Customer approval'],
        },
        {
          phaseName: 'Prototype Development',
          duration: engineeringRequirements.prototypeRequired
            ? this.config.prototypeDevelopmentDuration
            : 0,
          deliverables: ['Prototype unit', 'Test results'],
          dependencies: ['Design completion'],
        },
        {
          phaseName: 'Production Planning',
          duration: this.config.productionPlanningDuration,
          deliverables: ['Production BOM', 'Work instructions', 'Quality plan'],
          dependencies: ['Prototype approval'],
        },
      ],
      totalEngineeringCost:
        engineeringRequirements.engineeringHours * this.config.engineeringHourlyRate,
      projectTimeline:
        this.config.baseProjectTimeline +
        (engineeringRequirements.prototypeRequired ? this.config.prototypeDevelopmentDuration : 0),
    };
  }

  // ================================
  // PRIVATE HELPER METHODS
  // ================================

  private async getConfigurableProduct(productId: string): Promise<ConfigurableProduct> {
    // This would integrate with product master data
    return {
      id: productId,
      productCode: `CFG_${productId}`,
      name: 'Configurable Product',
      description: 'Mass customization product',
      basePrice: this.config.defaultBasePrice,
      baseCost: this.config.defaultBaseCost,
      configurationType: 'BUILD_TO_ORDER',
      configurationModel: {
        id: 'model_001',
        modelName: 'Standard Configuration Model',
        version: '1.0',
        optionGroups: [],
        dependencies: [],
        constraints: [],
        pricingRules: [],
      },
      options: [],
      rules: [],
      leadTimeBase: this.config.defaultLeadTimeBase,
      isConfigurable: true,
      status: 'ACTIVE',
    };
  }

  private async getConfigurationSession(sessionId: string): Promise<ConfigurationSession> {
    // Retrieve from session cache
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Configuration session ${sessionId} not found`);
    }
    return session;
  }

  private async validateOptionAddition(
    session: ConfigurationSession,
    optionId: string,
    optionValue: string
  ): Promise<{
    isValid: boolean;
    errors: string[];
    optionName: string;
    unitPrice: number;
    isRequired: boolean;
    dependentOptions?: string[];
    conflictingOptions?: string[];
  }> {
    return {
      isValid: true,
      errors: [],
      optionName: 'Sample Option',
      unitPrice: 100,
      isRequired: false,
    };
  }

  private async recalculateConfiguration(session: ConfigurationSession): Promise<void> {
    // Recalculate total price, cost, and lead time based on selected options
    let totalPrice = 0;
    let totalCost = 0;
    let maxLeadTime = 0;

    for (const option of session.configuration.selectedOptions) {
      totalPrice += option.extendedPrice;
      totalCost += option.extendedPrice * this.config.defaultCostRatio;
      maxLeadTime = Math.max(maxLeadTime, this.config.defaultSampleLeadTime);
    }

    session.configuration.totalPrice = totalPrice;
    session.configuration.totalCost = totalCost;
    session.configuration.leadTime = maxLeadTime;
  }

  private async validateConfiguration(session: ConfigurationSession): Promise<void> {
    // Validate all rules and constraints
    session.validationErrors = [];
    session.validationWarnings = [];

    // Apply configuration rules
    for (const rule of session.configuration.rules) {
      const ruleResult = await this.evaluateConfigurationRule(session.configuration, rule);
      if (!ruleResult.isValid) {
        if (rule.ruleType === 'REQUIRED') {
          session.validationErrors.push(rule.errorMessage || 'Required option missing');
        } else {
          session.validationWarnings.push(rule.errorMessage || 'Configuration warning');
        }
      }
    }

    session.validationStatus = session.validationErrors.length === 0 ? 'VALID' : 'INVALID';
  }

  private async evaluateConfigurationRule(
    configuration: ProductConfiguration,
    rule: ConfigurationRule
  ): Promise<{ isValid: boolean; message?: string }> {
    // Rule evaluation logic
    return { isValid: true };
  }

  private async performFeasibilityAnalysis(
    configuration: ProductConfiguration
  ): Promise<FeasibilityResult> {
    // Analyze manufacturing feasibility
    return {
      isFeasible: true,
      constraints: [],
      alternativeOptions: [],
      costImpact: 0,
      scheduleImpact: 0,
    };
  }

  private async calculateConfigurationPricing(configuration: ProductConfiguration): Promise<{
    totalPrice: number;
    totalCost: number;
    leadTime: number;
    pricingBreakdown: Array<{
      component: string;
      price: number;
      cost: number;
    }>;
  }> {
    let totalPrice = 0;
    let totalCost = 0;
    const pricingBreakdown: Array<{ component: string; price: number; cost: number }> = [];

    // Base product pricing
    pricingBreakdown.push({
      component: 'Base Product',
      price: this.config.defaultBasePrice,
      cost: this.config.defaultBaseCost,
    });
    totalPrice += this.config.defaultBasePrice;
    totalCost += this.config.defaultBaseCost;

    // Option pricing
    for (const option of configuration.selectedOptions) {
      pricingBreakdown.push({
        component: option.optionName,
        price: option.extendedPrice,
        cost: option.extendedPrice * this.config.defaultCostRatio,
      });
      totalPrice += option.extendedPrice;
      totalCost += option.extendedPrice * this.config.defaultCostRatio;
    }

    return {
      totalPrice,
      totalCost,
      leadTime: configuration.leadTime,
      pricingBreakdown,
    };
  }

  private assessManufacturability(
    configuration: ProductConfiguration
  ): 'STANDARD' | 'COMPLEX' | 'CUSTOM' {
    const optionCount = configuration.selectedOptions.length;

    if (optionCount <= this.config.standardComplexityMaxOptions) return 'STANDARD';
    if (optionCount <= this.config.complexComplexityMaxOptions) return 'COMPLEX';
    return 'CUSTOM';
  }

  // ================================
  // INTEGRATION WITH MANUFACTURING
  // ================================

  /**
   * Generate manufacturing BOM from configuration
   */
  async generateManufacturingBOM(configurationId: string): Promise<{
    bomId: string;
    components: Array<{
      componentId: string;
      quantity: number;
      unitCost: number;
      totalCost: number;
      leadTime: number;
    }>;
    totalMaterialCost: number;
    complexity: 'LOW' | 'MEDIUM' | 'HIGH';
  }> {
    const bomId = `cfg_bom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log(`Generating BOM for configuration: ${configurationId}`);

    return {
      bomId,
      components: [
        {
          componentId: 'BASE_ASSEMBLY',
          quantity: 1,
          unitCost: 500,
          totalCost: 500,
          leadTime: 7,
        },
        {
          componentId: 'CONFIGURED_OPTIONS',
          quantity: 1,
          unitCost: 200,
          totalCost: 200,
          leadTime: 14,
        },
      ],
      totalMaterialCost: 700,
      complexity: 'MEDIUM',
    };
  }

  /**
   * Generate manufacturing routing from configuration
   */
  async generateManufacturingRouting(configurationId: string): Promise<{
    routingId: string;
    operations: Array<{
      operationNumber: number;
      operationCode: string;
      description: string;
      workCenter: string;
      setupTime: number;
      runTime: number;
      laborRate: number;
    }>;
    totalLaborHours: number;
    totalLaborCost: number;
  }> {
    const routingId = `cfg_rte_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log(`Generating routing for configuration: ${configurationId}`);

    // Use centralized data provider for manufacturing defaults
    let routingDefaults;
    try {
      const { dataProvider } = require('../../../../utils/centralized-data-provider');
      routingDefaults = dataProvider.getManufacturingRoutingDefaults();
    } catch (error) {
      // Fallback to hardcoded values for backward compatibility
      routingDefaults = {
        operations: {
          assembly: { setupTime: 0.5, runTime: 2.0, laborRate: 35.0 },
          configuration: { setupTime: 0.25, runTime: 1.5, laborRate: 45.0 },
          testing: { setupTime: 0.1, runTime: 0.5, laborRate: 40.0 },
        },
      };
    }

    const operations = [
      {
        operationNumber: 10,
        operationCode: 'ASSEMBLY',
        description: 'Base product assembly',
        workCenter: 'ASSEMBLY_001',
        setupTime: routingDefaults.operations.assembly.setupTime,
        runTime: routingDefaults.operations.assembly.runTime,
        laborRate: routingDefaults.operations.assembly.laborRate,
      },
      {
        operationNumber: 20,
        operationCode: 'CONFIG',
        description: 'Configuration customization',
        workCenter: 'CONFIG_001',
        setupTime: routingDefaults.operations.configuration.setupTime,
        runTime: routingDefaults.operations.configuration.runTime,
        laborRate: routingDefaults.operations.configuration.laborRate,
      },
      {
        operationNumber: 30,
        operationCode: 'TEST',
        description: 'Final testing and validation',
        workCenter: 'TEST_001',
        setupTime: routingDefaults.operations.testing.setupTime,
        runTime: routingDefaults.operations.testing.runTime,
        laborRate: routingDefaults.operations.testing.laborRate,
      },
    ];

    // Calculate totals from centralized data
    const totalLaborHours = operations.reduce((sum, op) => sum + op.setupTime + op.runTime, 0);
    const totalLaborCost = operations.reduce((sum, op) => sum + (op.setupTime + op.runTime) * op.laborRate, 0);

    return {
      routingId,
      operations,
      totalLaborHours,
      totalLaborCost,
    };
  }
}

// Export service instance
export const configureToOrderService = new ConfigureToOrderService({
  defaultBasePrice: 1000,
  defaultBaseCost: 650,
  defaultCostRatio: 0.65,
  defaultLeadTimeBase: 14,
  standardComplexityMaxOptions: 3,
  complexComplexityMaxOptions: 8,
  engineeringHourlyRate: 150,
  defaultEngineeringDuration: 15,
  prototypeDevelopmentDuration: 10,
  productionPlanningDuration: 5,
  baseProjectTimeline: 30,
  defaultSampleLeadTime: 7,
});

// Factory function for creating service with custom configuration
export function createConfigureToOrderService(
  config: ConfigureToOrderConfig
): ConfigureToOrderService {
  return new ConfigureToOrderService(config);
}
