/**
 * Production-Grade Real-Time Integration Service
 * Provides comprehensive frontend-backend integration with NAPI-RS modules
 */

import { EventEmitter } from 'events';
import {
  ServiceResponse,
  ServiceRequest,
  ServiceIntegrationContext,
  ValidationError,
  BusinessRuleViolation,
} from '../shared/interfaces/service-integration';

// Import native modules
import {
import { v4 as uuidv4 } from 'uuid';
  evaluateBusinessRule,
  evaluateMultipleRules,
  validateBusinessRule,
  standardizeDataRecord,
  validateEmail,
  validatePhoneNumber,
  generateDataQualityReport,
  calculateCompoundInterest,
  calculateNetPresentValue,
  calculateEconomicOrderQuantity,
  calculateWeightedAverageCostOfCapital,
  calculateValueAtRisk,
} from '../../native';

export interface RealTimeEvent {
  type: string;
  module: string;
  operation: string;
  data: any;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

export interface BusinessProcessResult {
  processId: string;
  success: boolean;
  results: any[];
  validationErrors: ValidationError[];
  businessRuleViolations: BusinessRuleViolation[];
  dataQualityScore: number;
  executionMetrics: {
    totalTime: number;
    nativeExecutionTime: number;
    validationTime: number;
    businessRulesTime: number;
  };
}

export class ProductionIntegrationService extends EventEmitter {
  private activeConnections: Map<string, WebSocket> = new Map();
  private processCache: Map<string, any> = new Map();
  private metricsCollector: Map<string, number[]> = new Map();

  constructor() {
    super();
    this.setupPerformanceMonitoring();
  }

  /**
   * Process business data with full production-grade pipeline
   */
  async processBusinessData(
    request: ServiceRequest<any>,
    context: ServiceIntegrationContext
  ): Promise<ServiceResponse<BusinessProcessResult>> {
    const startTime = Date.now();
    const correlationId = request.correlationId || this.generateCorrelationId();

    try {
      // Step 1: Data Standardization
      const standardizationStart = Date.now();
      const standardizationRules = this.getStandardizationRules(request.data.entityType);
      const validationResults = standardizeDataRecord(request.data.data, standardizationRules);
      const standardizationTime = Date.now() - standardizationStart;

      // Step 2: Data Quality Assessment
      const qualityReport = generateDataQualityReport(validationResults);

      // Step 3: Business Rules Evaluation
      const rulesStart = Date.now();
      const businessRules = this.getBusinessRulesForEntity(request.data.entityType);
      const ruleContext = {
        entityType: request.data.entityType,
        entityId: request.data.entityId || 'new',
        data: request.data.data,
        userId: context.userId,
        timestamp: new Date().toISOString(),
      };

      const ruleResults = evaluateMultipleRules(businessRules, ruleContext);
      const businessRulesTime = Date.now() - rulesStart;

      // Step 4: Native Calculations (if applicable)
      const calculationStart = Date.now();
      const calculationResults = await this.performNativeCalculations(request.data, context);
      const nativeExecutionTime = Date.now() - calculationStart;

      // Step 5: Aggregate Results
      const businessProcessResult: BusinessProcessResult = {
        processId: correlationId,
        success: qualityReport.dataQualityScore >= 80, // Configurable threshold
        results: [
          {
            type: 'data_standardization',
            data: validationResults,
          },
          {
            type: 'quality_assessment',
            data: qualityReport,
          },
          {
            type: 'business_rules',
            data: ruleResults,
          },
          {
            type: 'calculations',
            data: calculationResults,
          },
        ],
        validationErrors: this.extractValidationErrors(validationResults),
        businessRuleViolations: this.extractBusinessRuleViolations(ruleResults),
        dataQualityScore: qualityReport.dataQualityScore,
        executionMetrics: {
          totalTime: Date.now() - startTime,
          nativeExecutionTime,
          validationTime: standardizationTime,
          businessRulesTime,
        },
      };

      // Step 6: Real-time Notifications
      this.emitRealTimeEvent({
        type: 'business_process_completed',
        module: request.data.entityType,
        operation: 'process_data',
        data: businessProcessResult,
        timestamp: new Date(),
        userId: context.userId,
        sessionId: context.sessionId,
      });

      // Step 7: Performance Metrics Collection
      this.recordMetrics('business_process', Date.now() - startTime);

      return {
        success: true,
        data: businessProcessResult,
        timestamp: new Date(),
        correlationId,
        executionTime: Date.now() - startTime,
      };
    } catch (error) {
      // Error handling with detailed context
      const errorResponse: ServiceResponse<BusinessProcessResult> = {
        success: false,
        error: {
          code: 'BUSINESS_PROCESS_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          details: {
            correlationId,
            context: context,
            timestamp: new Date().toISOString(),
          },
        },
        timestamp: new Date(),
        correlationId,
        executionTime: Date.now() - startTime,
      };

      // Emit error event for monitoring
      this.emitRealTimeEvent({
        type: 'business_process_error',
        module: 'integration_service',
        operation: 'process_data',
        data: errorResponse,
        timestamp: new Date(),
        userId: context.userId,
      });

      return errorResponse;
    }
  }

  /**
   * Perform native calculations based on entity type and data
   */
  private async performNativeCalculations(
    data: any,
    context: ServiceIntegrationContext
  ): Promise<any> {
    const calculations: any = {};

    try {
      // Financial calculations
      if (data.entityType === 'financial_transaction' || data.entityType === 'investment') {
        if (data.data.principal && data.data.rate && data.data.time) {
          calculations.compoundInterest = calculateCompoundInterest(
            parseFloat(data.data.principal),
            parseFloat(data.data.rate),
            parseInt(data.data.compoundingFrequency) || 12,
            parseFloat(data.data.time)
          );
        }

        if (data.data.cashFlows && data.data.discountRate) {
          const cashFlows = Array.isArray(data.data.cashFlows)
            ? data.data.cashFlows.map((cf) => parseFloat(cf))
            : [];
          calculations.netPresentValue = calculateNetPresentValue(
            cashFlows,
            parseFloat(data.data.discountRate)
          );
        }

        if (data.data.portfolioValue && data.data.volatility) {
          calculations.valueAtRisk = calculateValueAtRisk(
            parseFloat(data.data.portfolioValue),
            parseFloat(data.data.confidenceLevel) || 95.0,
            parseFloat(data.data.volatility),
            parseFloat(data.data.timeHorizon) || 1.0
          );
        }
      }

      // Inventory calculations
      if (data.entityType === 'inventory_item') {
        if (data.data.annualDemand && data.data.orderingCost && data.data.carryingCost) {
          calculations.economicOrderQuantity = calculateEconomicOrderQuantity(
            parseFloat(data.data.annualDemand),
            parseFloat(data.data.orderingCost),
            parseFloat(data.data.carryingCost)
          );
        }
      }

      // Corporate finance calculations
      if (data.entityType === 'corporate_finance') {
        if (
          data.data.equityWeight &&
          data.data.costOfEquity &&
          data.data.debtWeight &&
          data.data.costOfDebt &&
          data.data.taxRate
        ) {
          calculations.wacc = calculateWeightedAverageCostOfCapital(
            parseFloat(data.data.equityWeight),
            parseFloat(data.data.costOfEquity),
            parseFloat(data.data.debtWeight),
            parseFloat(data.data.costOfDebt),
            parseFloat(data.data.taxRate)
          );
        }
      }

      return calculations;
    } catch (error) {
      console.error('Error in native calculations:', error);
      return {
        error: 'Calculation error',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Real-time WebSocket integration
   */
  setupWebSocketConnection(ws: WebSocket, userId: string): void {
    const connectionId = `${userId}_${Date.now()}`;
    this.activeConnections.set(connectionId, ws);

    ws.on('message', async (message: string) => {
      try {
        const request = JSON.parse(message);
        const context: ServiceIntegrationContext = {
          userId,
          sessionId: connectionId,
          permissions: request.permissions || [],
          correlationId: this.generateCorrelationId(),
          requestTimestamp: new Date(),
        };

        const result = await this.processBusinessData(request, context);

        // Send result back through WebSocket
        ws.send(
          JSON.stringify({
            type: 'process_result',
            correlationId: context.correlationId,
            data: result,
          })
        );
      } catch (error) {
        ws.send(
          JSON.stringify({
            type: 'error',
            message: 'Failed to process request',
            error: error instanceof Error ? error.message : 'Unknown error',
          })
        );
      }
    });

    ws.on('close', () => {
      this.activeConnections.delete(connectionId);
    });

    // Send connection confirmation
    ws.send(
      JSON.stringify({
        type: 'connection_established',
        connectionId,
        timestamp: new Date().toISOString(),
      })
    );
  }

  /**
   * Emit real-time events to all connected clients
   */
  private emitRealTimeEvent(event: RealTimeEvent): void {
    const eventData = JSON.stringify({
      type: 'real_time_event',
      event,
    });

    // Send to all active WebSocket connections
    this.activeConnections.forEach((ws) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(eventData);
      }
    });

    // Emit internal event for other services
    this.emit('realTimeEvent', event);
  }

  /**
   * Get standardization rules for entity type
   */
  private getStandardizationRules(entityType: string): any[] {
    // This would typically come from a configuration service
    const ruleTemplates = {
      customer: [
        {
          field_name: 'email',
          rule_type: 'validate',
          validation_rules: ['required', 'email'],
          transformation: 'lowercase',
        },
        {
          field_name: 'phone',
          rule_type: 'format',
          validation_rules: ['phone'],
          transformation: 'normalize',
        },
        {
          field_name: 'name',
          rule_type: 'format',
          transformation: 'title_case',
          validation_rules: ['required'],
          min_length: 2,
          max_length: 100,
        },
      ],
      financial_transaction: [
        {
          field_name: 'amount',
          rule_type: 'validate',
          validation_rules: ['required', 'numeric'],
          min_value: 0.01,
          max_value: 1000000,
        },
        {
          field_name: 'currency',
          rule_type: 'validate',
          validation_rules: ['required'],
          allowed_values: ['USD', 'EUR', 'GBP', 'JPY', 'CAD'],
        },
      ],
    };

    return ruleTemplates[entityType] || [];
  }

  /**
   * Get business rules for entity type
   */
  private getBusinessRulesForEntity(entityType: string): any[] {
    // This would typically come from a rules engine configuration
    const ruleTemplates = {
      financial_transaction: [
        {
          id: 'LARGE_TRANSACTION_001',
          name: 'Large Transaction Review',
          description: 'Transactions over $10,000 require review',
          category: 'Financial',
          rule_type: 'approval',
          conditions: [
            {
              field: 'amount',
              operator: 'greater_than',
              value: '10000',
              data_type: 'number',
            },
          ],
          actions: [
            {
              action_type: 'create_task',
              target: 'finance_team',
              value: 'Review large transaction',
              parameters: {},
            },
          ],
          priority: 90,
          enabled: true,
          effective_date: '2024-01-01',
          expiry_date: null,
        },
      ],
    };

    return ruleTemplates[entityType] || [];
  }

  /**
   * Extract validation errors from validation results
   */
  private extractValidationErrors(validationResults: any[]): ValidationError[] {
    const errors: ValidationError[] = [];

    for (const result of validationResults) {
      if (!result.is_valid) {
        for (const error of result.errors) {
          errors.push({
            field: result.field_name,
            code: 'VALIDATION_ERROR',
            message: error,
            value: result.original_value,
          });
        }
      }
    }

    return errors;
  }

  /**
   * Extract business rule violations from rule results
   */
  private extractBusinessRuleViolations(ruleResults: any[]): BusinessRuleViolation[] {
    const violations: BusinessRuleViolation[] = [];

    for (const result of ruleResults) {
      if (result.errors && result.errors.length > 0) {
        for (const error of result.errors) {
          violations.push({
            ruleId: result.rule_id,
            ruleName: result.rule_id, // Would be better to have actual rule name
            message: error,
            severity: 'error',
          });
        }
      }
    }

    return violations;
  }

  /**
   * Setup performance monitoring
   */
  private setupPerformanceMonitoring(): void {
    setInterval(() => {
      // Collect and emit performance metrics
      const metrics = {};
      this.metricsCollector.forEach((values, key) => {
        if (values.length > 0) {
          metrics[key] = {
            count: values.length,
            average: values.reduce((a, b) => a + b, 0) / values.length,
            min: Math.min(...values),
            max: Math.max(...values),
          };
        }
      });

      this.emitRealTimeEvent({
        type: 'performance_metrics',
        module: 'integration_service',
        operation: 'metrics_collection',
        data: metrics,
        timestamp: new Date(),
      });

      // Clear metrics after emission
      this.metricsCollector.clear();
    }, 30000); // Every 30 seconds
  }

  /**
   * Record performance metrics
   */
  private recordMetrics(operation: string, executionTime: number): void {
    if (!this.metricsCollector.has(operation)) {
      this.metricsCollector.set(operation, []);
    }
    this.metricsCollector.get(operation)!.push(executionTime);
  }

  /**
   * Generate correlation ID
   */
  private generateCorrelationId(): string {
    return `corr_${Date.now()}_${uuidv4().substring(0, 8)}`;
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<ServiceResponse<any>> {
    try {
      // Test native module connectivity
      const testCalculation = calculateCompoundInterest(1000, 5, 12, 1);

      return {
        success: true,
        data: {
          status: 'healthy',
          nativeModules: 'operational',
          activeConnections: this.activeConnections.size,
          testCalculation,
          timestamp: new Date(),
        },
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'HEALTH_CHECK_FAILED',
          message: error instanceof Error ? error.message : 'Health check failed',
        },
        timestamp: new Date(),
      };
    }
  }
}
