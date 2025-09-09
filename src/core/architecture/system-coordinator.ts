/**
 * System Coordinator
 * Orchestrates business and customer systems with integrated architecture
 */

import { Logger } from 'winston';
import { 
  BaseService, 
  ServiceContext, 
  ServiceResult 
} from './service-layer';
import { 
  BusinessSystemService, 
  BusinessSystemConfig 
} from './business-system';
import { 
  CustomerSystemService, 
  CustomerSystemConfig 
} from './customer-system';
import { 
  IntegrationLayerService, 
  IntegrationConfig, 
  IntegrationEvent 
} from './integration-layer';
import { healthThresholds } from '../config';

export interface SystemCoordinatorConfig {
  business: BusinessSystemConfig;
  customer: CustomerSystemConfig;
  integration: IntegrationConfig;
  enableCrossSystemValidation: boolean;
  enableSystemMonitoring: boolean;
  healthCheckInterval: number;
}

export interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  business: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    operationsRegistered: number;
    auditLogSize: number;
    recentFailures: number;
    complianceStatus: 'compliant' | 'warning' | 'violation';
  };
  customer: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    operationsRegistered: number;
    cacheSize: number;
    cacheHitRate: number;
    avgResponseTime: number;
  };
  integration: {
    eventHandlers: number;
    dataSyncRules: number;
    workflows: number;
    circuitBreakersOpen: number;
  };
  timestamp: Date;
}

export interface CrossSystemOperation {
  operationId: string;
  name: string;
  description: string;
  businessOperation?: string;
  customerOperation?: string;
  integrationWorkflow?: string;
  validationRules?: Array<{
    field: string;
    rule: string;
    message: string;
  }>;
}

export class SystemCoordinator extends BaseService {
  private config: SystemCoordinatorConfig;
  private businessSystem: BusinessSystemService;
  private customerSystem: CustomerSystemService;
  private integrationLayer: IntegrationLayerService;
  
  private crossSystemOperations: Map<string, CrossSystemOperation> = new Map();
  private healthCheckTimer?: NodeJS.Timeout;
  private lastHealthCheck?: SystemHealth;

  constructor(config: SystemCoordinatorConfig, logger: Logger) {
    super('SystemCoordinator', logger);
    this.config = config;

    // Initialize subsystems
    this.businessSystem = new BusinessSystemService(config.business, logger);
    this.customerSystem = new CustomerSystemService(config.customer, logger);
    this.integrationLayer = new IntegrationLayerService(
      config.integration,
      this.businessSystem,
      this.customerSystem,
      logger
    );

    // Start health monitoring if enabled
    if (config.enableSystemMonitoring) {
      this.startHealthMonitoring();
    }

    // Setup default cross-system event handlers
    this.setupDefaultEventHandlers();
  }

  /**
   * Initialize the system coordinator and all subsystems
   */
  async initialize(): Promise<ServiceResult<void>> {
    return this.executeWithMetrics(async () => {
      this.logger.info('Initializing System Coordinator');

      // Initialize default cross-system operations
      this.initializeDefaultOperations();

      // Setup integration workflows
      this.setupDefaultWorkflows();

      this.logger.info('System Coordinator initialized successfully');
      return void 0;
    }, { logger: this.logger });
  }

  /**
   * Register a cross-system operation that coordinates business and customer systems
   */
  registerCrossSystemOperation(operation: CrossSystemOperation): void {
    this.crossSystemOperations.set(operation.operationId, operation);
    
    this.logger.info('Registered cross-system operation', {
      operationId: operation.operationId,
      name: operation.name,
      hasBusinessOperation: !!operation.businessOperation,
      hasCustomerOperation: !!operation.customerOperation,
      hasIntegrationWorkflow: !!operation.integrationWorkflow
    });
  }

  /**
   * Execute a cross-system operation with coordination between business and customer systems
   */
  async executeCrossSystemOperation<TInput, TOutput>(
    operationId: string,
    input: TInput,
    context: ServiceContext
  ): Promise<ServiceResult<TOutput>> {
    const operation = this.crossSystemOperations.get(operationId);
    if (!operation) {
      return {
        success: false,
        error: {
          code: 'OPERATION_NOT_FOUND',
          message: `Cross-system operation ${operationId} not found`
        }
      };
    }

    const result = await this.executeWithMetrics(async () => {
      this.logger.info('Executing cross-system operation', {
        operationId,
        name: operation.name,
        userId: context.userId
      });

      // Validate input if validation rules are defined
      if (this.config.enableCrossSystemValidation && operation.validationRules) {
        const validation = this.validateCrossSystemInput(input, operation.validationRules);
        if (!validation.success) {
          throw new Error(validation.error?.message || 'Validation failed');
        }
      }

      let workResult: any = input;

      // Execute business operation if defined
      if (operation.businessOperation) {
        const businessResult = await this.businessSystem.executeBusinessOperation(
          operation.businessOperation,
          workResult,
          context
        );
        
        if (!businessResult.success) {
          throw new Error(businessResult.error?.message || 'Business operation failed');
        }
        
        workResult = businessResult.data;
        
        // Publish business operation completed event
        await this.publishSystemEvent({
          eventId: `${operationId}-business-${Date.now()}`,
          eventType: 'business.operation.completed',
          source: 'business',
          target: 'customer',
          timestamp: new Date(),
          payload: {
            operationId: operation.businessOperation,
            crossSystemOperationId: operationId,
            result: workResult
          }
        });
      }

      // Execute integration workflow if defined
      if (operation.integrationWorkflow) {
        const workflowResult = await this.integrationLayer.executeWorkflow(
          operation.integrationWorkflow,
          workResult,
          context
        );
        
        if (!workflowResult.success) {
          throw new Error(workflowResult.error?.message || 'Workflow failed');
        }
        
        workResult = workflowResult.data;
      }

      // Execute customer operation if defined
      if (operation.customerOperation) {
        const customerResult = await this.customerSystem.executeCustomerOperation(
          operation.customerOperation,
          workResult,
          context
        );
        
        if (!customerResult.success) {
          throw new Error(customerResult.error?.message || 'Customer operation failed');
        }
        
        workResult = customerResult.data;
        
        // Publish customer operation completed event
        await this.publishSystemEvent({
          eventId: `${operationId}-customer-${Date.now()}`,
          eventType: 'customer.operation.completed',
          source: 'customer',
          target: 'business',
          timestamp: new Date(),
          payload: {
            operationId: operation.customerOperation,
            crossSystemOperationId: operationId,
            result: workResult
          }
        });
      }

      return workResult as TOutput;
    }, context);
    
    return result;
  }

  /**
   * Get comprehensive system health across all subsystems
   */
  async getSystemHealth(): Promise<SystemHealth> {
    const businessHealth = this.businessSystem.getBusinessSystemHealth();
    const customerHealth = this.customerSystem.getCustomerSystemHealth();
    const integrationHealth = this.integrationLayer.getIntegrationHealth();

    // Determine business system status
    let businessStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (businessHealth.complianceStatus === 'violation' || businessHealth.recentFailures > healthThresholds.business.maxFailuresForViolation) {
      businessStatus = 'unhealthy';
    } else if (businessHealth.complianceStatus === 'warning' || businessHealth.recentFailures > healthThresholds.business.maxFailuresForWarning) {
      businessStatus = 'degraded';
    }

    // Determine customer system status
    let customerStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (customerHealth.avgResponseTime > healthThresholds.customer.maxResponseTimeForUnhealthy || customerHealth.cacheHitRate < healthThresholds.customer.minCacheHitRateForUnhealthy) {
      customerStatus = 'unhealthy';
    } else if (customerHealth.avgResponseTime > healthThresholds.customer.maxResponseTimeForDegraded || customerHealth.cacheHitRate < healthThresholds.customer.minCacheHitRateForDegraded) {
      customerStatus = 'degraded';
    }

    // Determine overall system status
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (businessStatus === 'unhealthy' || customerStatus === 'unhealthy') {
      overallStatus = 'unhealthy';
    } else if (businessStatus === 'degraded' || customerStatus === 'degraded') {
      overallStatus = 'degraded';
    }

    const circuitBreakersOpen = Object.values(integrationHealth.circuitBreakers)
      .filter(cb => cb.isOpen).length;

    const systemHealth: SystemHealth = {
      overall: overallStatus,
      business: {
        status: businessStatus,
        operationsRegistered: businessHealth.operationsRegistered,
        auditLogSize: businessHealth.auditLogSize,
        recentFailures: businessHealth.recentFailures,
        complianceStatus: businessHealth.complianceStatus
      },
      customer: {
        status: customerStatus,
        operationsRegistered: customerHealth.operationsRegistered,
        cacheSize: customerHealth.cacheSize,
        cacheHitRate: customerHealth.cacheHitRate,
        avgResponseTime: customerHealth.avgResponseTime
      },
      integration: {
        eventHandlers: integrationHealth.eventHandlers,
        dataSyncRules: integrationHealth.dataSyncRules,
        workflows: integrationHealth.workflows,
        circuitBreakersOpen
      },
      timestamp: new Date()
    };

    this.lastHealthCheck = systemHealth;
    return systemHealth;
  }

  /**
   * Get system metrics and analytics
   */
  async getSystemMetrics(): Promise<{
    business: any;
    customer: any;
    integration: any;
    crossSystem: {
      operationsRegistered: number;
      totalExecutions: number;
      averageExecutionTime: number;
      successRate: number;
    };
  }> {
    const businessMetrics = this.businessSystem.getMetrics();
    const customerMetrics = this.customerSystem.getMetrics();
    const coordinatorMetrics = this.getMetrics();

    return {
      business: businessMetrics,
      customer: customerMetrics,
      integration: this.integrationLayer.getIntegrationHealth(),
      crossSystem: {
        operationsRegistered: this.crossSystemOperations.size,
        totalExecutions: coordinatorMetrics.requestCount,
        averageExecutionTime: coordinatorMetrics.averageResponseTime,
        successRate: 1 - coordinatorMetrics.errorRate
      }
    };
  }

  /**
   * Shutdown the system coordinator and all subsystems
   */
  async shutdown(): Promise<ServiceResult<void>> {
    return this.executeWithMetrics(async () => {
      this.logger.info('Shutting down System Coordinator');

      // Stop health monitoring
      if (this.healthCheckTimer) {
        clearInterval(this.healthCheckTimer);
        this.healthCheckTimer = undefined;
      }

      this.logger.info('System Coordinator shutdown completed');
      return void 0;
    }, { logger: this.logger });
  }

  /**
   * Private helper methods
   */
  
  private validateCrossSystemInput(
    input: any,
    rules: Array<{ field: string; rule: string; message: string }>
  ): ServiceResult {
    const errors: string[] = [];

    for (const rule of rules) {
      const value = input[rule.field];
      
      switch (rule.rule) {
        case 'required':
          if (!value) {
            errors.push(rule.message);
          }
          break;
        case 'email':
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors.push(rule.message);
          }
          break;
        case 'positive_number':
          if (value && (typeof value !== 'number' || value <= 0)) {
            errors.push(rule.message);
          }
          break;
      }
    }

    if (errors.length > 0) {
      return {
        success: false,
        error: {
          code: 'CROSS_SYSTEM_VALIDATION_ERROR',
          message: 'Cross-system validation failed',
          details: errors
        }
      };
    }

    return { success: true };
  }

  private async publishSystemEvent(event: IntegrationEvent): Promise<void> {
    try {
      await this.integrationLayer.publishEvent(event);
    } catch (error) {
      this.logger.warn('Failed to publish system event', {
        eventType: event.eventType,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  private startHealthMonitoring(): void {
    this.healthCheckTimer = setInterval(async () => {
      try {
        const health = await this.getSystemHealth();
        
        if (health.overall !== 'healthy') {
          this.logger.warn('System health degraded', {
            overall: health.overall,
            business: health.business.status,
            customer: health.customer.status
          });
        }
      } catch (error) {
        this.logger.error('Health check failed', {
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }, this.config.healthCheckInterval);
  }

  private setupDefaultEventHandlers(): void {
    // Handle business to customer sync events
    this.integrationLayer.subscribeToEvent('business.data.updated', async (event) => {
      this.logger.debug('Handling business data update event', {
        eventId: event.eventId,
        payload: event.payload
      });
      
      // Implement default business to customer sync logic
    });

    // Handle customer to business sync events
    this.integrationLayer.subscribeToEvent('customer.data.updated', async (event) => {
      this.logger.debug('Handling customer data update event', {
        eventId: event.eventId,
        payload: event.payload
      });
      
      // Implement default customer to business sync logic
    });
  }

  private initializeDefaultOperations(): void {
    // Customer Order Processing - coordinates customer order with business fulfillment
    this.registerCrossSystemOperation({
      operationId: 'customer.order.process',
      name: 'Customer Order Processing',
      description: 'End-to-end order processing from customer to business fulfillment',
      customerOperation: 'customer.order.create',
      integrationWorkflow: 'order.processing.workflow',
      businessOperation: 'business.order.fulfill',
      validationRules: [
        { field: 'customerId', rule: 'required', message: 'Customer ID is required' },
        { field: 'items', rule: 'required', message: 'Order items are required' }
      ]
    });

    // Customer Support Case - coordinates customer inquiry with business support
    this.registerCrossSystemOperation({
      operationId: 'customer.support.case',
      name: 'Customer Support Case',
      description: 'Create and manage customer support cases across systems',
      customerOperation: 'customer.case.create',
      integrationWorkflow: 'support.case.workflow',
      businessOperation: 'business.case.assign'
    });

    // Financial Transaction - coordinates customer payment with business accounting
    this.registerCrossSystemOperation({
      operationId: 'financial.transaction.process',
      name: 'Financial Transaction Processing',
      description: 'Process financial transactions across customer and business systems',
      customerOperation: 'customer.payment.process',
      integrationWorkflow: 'payment.processing.workflow',
      businessOperation: 'business.accounting.record',
      validationRules: [
        { field: 'amount', rule: 'positive_number', message: 'Amount must be a positive number' },
        { field: 'customerId', rule: 'required', message: 'Customer ID is required' }
      ]
    });
  }

  private setupDefaultWorkflows(): void {
    // Order Processing Workflow
    this.integrationLayer.registerWorkflow({
      workflowId: 'order.processing.workflow',
      name: 'Order Processing Integration',
      description: 'Integrates customer order with business systems',
      trigger: {
        type: 'event',
        config: { eventType: 'customer.order.created' }
      },
      steps: [
        {
          stepId: 'validate-inventory',
          system: 'business',
          operation: 'business.inventory.check',
          errorHandling: 'stop'
        },
        {
          stepId: 'reserve-items',
          system: 'business',
          operation: 'business.inventory.reserve',
          errorHandling: 'rollback'
        },
        {
          stepId: 'update-customer',
          system: 'customer',
          operation: 'customer.order.confirm',
          errorHandling: 'retry'
        }
      ],
      errorPolicy: 'rollback'
    });

    // Support Case Workflow
    this.integrationLayer.registerWorkflow({
      workflowId: 'support.case.workflow',
      name: 'Support Case Integration',
      description: 'Routes customer support cases to appropriate business teams',
      trigger: {
        type: 'event',
        config: { eventType: 'customer.case.created' }
      },
      steps: [
        {
          stepId: 'categorize-case',
          system: 'business',
          operation: 'business.case.categorize',
          errorHandling: 'continue'
        },
        {
          stepId: 'assign-agent',
          system: 'business',
          operation: 'business.case.assign',
          errorHandling: 'retry'
        },
        {
          stepId: 'notify-customer',
          system: 'customer',
          operation: 'customer.notification.send',
          errorHandling: 'continue'
        }
      ],
      errorPolicy: 'best-effort'
    });

    // Payment Processing Workflow
    this.integrationLayer.registerWorkflow({
      workflowId: 'payment.processing.workflow',
      name: 'Payment Processing Integration',
      description: 'Processes payments across customer and business systems',
      trigger: {
        type: 'event',
        config: { eventType: 'customer.payment.initiated' }
      },
      steps: [
        {
          stepId: 'validate-payment',
          system: 'business',
          operation: 'business.payment.validate',
          errorHandling: 'stop'
        },
        {
          stepId: 'process-payment',
          system: 'business',
          operation: 'business.payment.process',
          errorHandling: 'stop'
        },
        {
          stepId: 'record-transaction',
          system: 'business',
          operation: 'business.accounting.record',
          errorHandling: 'retry'
        },
        {
          stepId: 'confirm-customer',
          system: 'customer',
          operation: 'customer.payment.confirm',
          errorHandling: 'continue'
        }
      ],
      errorPolicy: 'fail-fast'
    });
  }

  /**
   * Getters for subsystems (for direct access when needed)
   */
  getBusinessSystem(): BusinessSystemService {
    return this.businessSystem;
  }

  getCustomerSystem(): CustomerSystemService {
    return this.customerSystem;
  }

  getIntegrationLayer(): IntegrationLayerService {
    return this.integrationLayer;
  }
}