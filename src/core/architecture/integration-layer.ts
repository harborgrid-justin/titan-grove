/**
 * Integration Layer Architecture
 * Provides standardized integration patterns between business and customer systems
 */

import { ServiceContext, ServiceResult } from './service-layer';
import { BusinessSystemService } from './business-system';
import { CustomerSystemService } from './customer-system';
import { Logger } from 'winston';
import { integrationConfig } from '../config';

export interface IntegrationConfig {
  enableEventBridge: boolean;
  enableDataSync: boolean;
  enableWorkflowOrchestration: boolean;
  maxRetryAttempts: number;
  retryDelayMs: number;
  circuitBreakerThreshold: number;
}

export interface IntegrationEvent {
  eventId: string;
  eventType: string;
  source: 'business' | 'customer';
  target: 'business' | 'customer' | 'external';
  timestamp: Date;
  payload: any;
  metadata?: {
    correlationId?: string;
    causationId?: string;
    version?: string;
  };
}

export interface DataSyncRule {
  ruleId: string;
  sourceSystem: 'business' | 'customer';
  targetSystem: 'business' | 'customer';
  dataType: string;
  syncDirection: 'unidirectional' | 'bidirectional';
  syncFrequency: 'realtime' | 'batch' | 'scheduled';
  conflictResolution: 'source-wins' | 'target-wins' | 'manual';
  transform?: (data: any) => any;
}

export interface WorkflowStep {
  stepId: string;
  system: 'business' | 'customer';
  operation: string;
  inputMapping?: { [key: string]: string };
  outputMapping?: { [key: string]: string };
  errorHandling: 'stop' | 'continue' | 'retry' | 'rollback';
}

export interface Workflow {
  workflowId: string;
  name: string;
  description: string;
  trigger: {
    type: 'event' | 'schedule' | 'manual';
    config: any;
  };
  steps: WorkflowStep[];
  errorPolicy: 'fail-fast' | 'best-effort' | 'rollback';
}

export class IntegrationLayerService {
  private config: IntegrationConfig;
  private logger: Logger;
  private businessSystem: BusinessSystemService;
  private customerSystem: CustomerSystemService;

  private eventHandlers: Map<string, Array<(event: IntegrationEvent) => Promise<void>>> = new Map();
  private dataSyncRules: Map<string, DataSyncRule> = new Map();
  private workflows: Map<string, Workflow> = new Map();
  private circuitBreakers: Map<string, { failures: number; lastFailure: Date; isOpen: boolean }> =
    new Map();

  constructor(
    config: IntegrationConfig,
    businessSystem: BusinessSystemService,
    customerSystem: CustomerSystemService,
    logger: Logger
  ) {
    this.config = config;
    this.businessSystem = businessSystem;
    this.customerSystem = customerSystem;
    this.logger = logger;
  }

  /**
   * Event Bridge - Publish and subscribe to integration events
   */
  async publishEvent(event: IntegrationEvent): Promise<ServiceResult<void>> {
    try {
      this.logger.info('Publishing integration event', {
        eventId: event.eventId,
        eventType: event.eventType,
        source: event.source,
        target: event.target,
      });

      const handlers = this.eventHandlers.get(event.eventType) || [];

      // Execute handlers in parallel
      const results = await Promise.allSettled(handlers.map((handler) => handler(event)));

      // Check for failures
      const failures = results.filter((result) => result.status === 'rejected');
      if (failures.length > 0) {
        this.logger.warn(`${failures.length} event handlers failed for event ${event.eventType}`, {
          eventId: event.eventId,
          failures: failures.map((f) => (f as PromiseRejectedResult).reason),
        });
      }

      return {
        success: true,
        metadata: {
          handlersExecuted: handlers.length,
          failures: failures.length,
        },
      };
    } catch (error) {
      this.logger.error('Failed to publish integration event', {
        eventId: event.eventId,
        error: error instanceof Error ? (error as Error).message : String(error),
      });

      return {
        success: false,
        error: {
          code: 'EVENT_PUBLISH_FAILED',
          message: 'Failed to publish integration event',
          details: error,
        },
      };
    }
  }

  /**
   * Subscribe to integration events
   */
  subscribeToEvent(eventType: string, handler: (event: IntegrationEvent) => Promise<void>): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }

    this.eventHandlers.get(eventType)!.push(handler);

    this.logger.info(`Subscribed to integration event: ${eventType}`);
  }

  /**
   * Register data synchronization rule
   */
  registerDataSyncRule(rule: DataSyncRule): void {
    this.dataSyncRules.set(rule.ruleId, rule);

    this.logger.info('Registered data sync rule', {
      ruleId: rule.ruleId,
      sourceSystem: rule.sourceSystem,
      targetSystem: rule.targetSystem,
      dataType: rule.dataType,
      syncDirection: rule.syncDirection,
    });
  }

  /**
   * Execute data synchronization
   */
  async executeDataSync(
    ruleId: string,
    data: any,
    context: ServiceContext
  ): Promise<ServiceResult<any>> {
    const rule = this.dataSyncRules.get(ruleId);
    if (!rule) {
      return {
        success: false,
        error: {
          code: 'SYNC_RULE_NOT_FOUND',
          message: `Data sync rule ${ruleId} not found`,
        },
      };
    }

    // Check circuit breaker
    const circuitKey = `sync:${ruleId}`;
    if (this.isCircuitOpen(circuitKey)) {
      return {
        success: false,
        error: {
          code: 'CIRCUIT_BREAKER_OPEN',
          message: 'Data sync temporarily unavailable due to repeated failures',
        },
      };
    }

    try {
      // Transform data if transformer is provided
      const transformedData = rule.transform ? rule.transform(data) : data;

      // Execute sync based on source and target systems
      let result: ServiceResult<any>;

      if (rule.sourceSystem === 'business' && rule.targetSystem === 'customer') {
        result = await this.syncBusinessToCustomer(rule, transformedData, context);
      } else if (rule.sourceSystem === 'customer' && rule.targetSystem === 'business') {
        result = await this.syncCustomerToBusiness(rule, transformedData, context);
      } else {
        result = {
          success: false,
          error: {
            code: 'INVALID_SYNC_DIRECTION',
            message: 'Invalid sync direction in rule configuration',
          },
        };
      }

      if (result.success) {
        this.resetCircuitBreaker(circuitKey);
      } else {
        this.recordCircuitBreakerFailure(circuitKey);
      }

      return result;
    } catch (error) {
      this.recordCircuitBreakerFailure(circuitKey);

      return {
        success: false,
        error: {
          code: 'DATA_SYNC_FAILED',
          message: 'Data synchronization failed',
          details: error,
        },
      };
    }
  }

  /**
   * Register workflow
   */
  registerWorkflow(workflow: Workflow): void {
    this.workflows.set(workflow.workflowId, workflow);

    this.logger.info('Registered workflow', {
      workflowId: workflow.workflowId,
      name: workflow.name,
      steps: workflow.steps.length,
      triggerType: workflow.trigger.type,
    });
  }

  /**
   * Execute workflow
   */
  async executeWorkflow(
    workflowId: string,
    input: any,
    context: ServiceContext
  ): Promise<ServiceResult<any>> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      return {
        success: false,
        error: {
          code: 'WORKFLOW_NOT_FOUND',
          message: `Workflow ${workflowId} not found`,
        },
      };
    }

    this.logger.info('Executing workflow', {
      workflowId,
      name: workflow.name,
      steps: workflow.steps.length,
    });

    const executionContext = {
      ...context,
      workflowId,
      executionId: `${workflowId}-${Date.now()}`,
    };

    let currentData = input;
    const stepResults: any[] = [];

    try {
      for (let i = 0; i < workflow.steps.length; i++) {
        const step = workflow.steps[i];

        this.logger.debug('Executing workflow step', {
          workflowId,
          stepId: step.stepId,
          stepIndex: i + 1,
          system: step.system,
        });

        // Map input data based on step configuration
        const stepInput = step.inputMapping
          ? this.mapData(currentData, step.inputMapping)
          : currentData;

        // Execute step
        let stepResult: ServiceResult<any>;

        if (step.system === 'business') {
          stepResult = await this.businessSystem.executeBusinessOperation(
            step.operation,
            stepInput,
            executionContext
          );
        } else {
          stepResult = await this.customerSystem.executeCustomerOperation(
            step.operation,
            stepInput,
            executionContext
          );
        }

        if (!stepResult.success) {
          // Handle step failure based on error handling policy
          switch (step.errorHandling) {
            case 'stop':
              return stepResult;
            case 'continue':
              this.logger.warn('Workflow step failed but continuing', {
                workflowId,
                stepId: step.stepId,
                error: stepResult.error,
              });
              stepResults.push({ step: step.stepId, success: false, error: stepResult.error });
              continue;
            case 'retry':
              // Implement retry logic
              const retryResult = await this.retryWorkflowStep(step, stepInput, executionContext);
              if (!retryResult.success) {
                if (workflow.errorPolicy === 'fail-fast') {
                  return retryResult;
                }
              } else {
                stepResult = retryResult;
              }
              break;
            case 'rollback':
              // Implement rollback logic
              await this.rollbackWorkflow(workflow, stepResults, executionContext);
              return stepResult;
          }
        }

        // Map output data based on step configuration
        currentData =
          step.outputMapping && stepResult.data
            ? this.mapData(stepResult.data, step.outputMapping)
            : stepResult.data;

        stepResults.push({
          step: step.stepId,
          success: stepResult.success,
          data: currentData,
        });
      }

      return {
        success: true,
        data: currentData,
        metadata: {
          stepsExecuted: stepResults.length,
          workflowId,
          executionId: executionContext.executionId,
        },
      };
    } catch (error) {
      this.logger.error('Workflow execution failed', {
        workflowId,
        error: error instanceof Error ? (error as Error).message : String(error),
      });

      return {
        success: false,
        error: {
          code: 'WORKFLOW_EXECUTION_FAILED',
          message: 'Workflow execution failed',
          details: { workflowId, stepResults, error },
        },
      };
    }
  }

  /**
   * Sync data from business system to customer system
   */
  private async syncBusinessToCustomer(
    rule: DataSyncRule,
    data: any,
    context: ServiceContext
  ): Promise<ServiceResult<any>> {
    // Implementation would depend on specific customer system capabilities
    // This is a placeholder for the actual sync logic
    this.logger.info('Syncing data from business to customer system', {
      ruleId: rule.ruleId,
      dataType: rule.dataType,
    });

    return {
      success: true,
      data: { synced: true, rule: rule.ruleId, direction: 'business-to-customer' },
    };
  }

  /**
   * Sync data from customer system to business system
   */
  private async syncCustomerToBusiness(
    rule: DataSyncRule,
    data: any,
    context: ServiceContext
  ): Promise<ServiceResult<any>> {
    // Implementation would depend on specific business system capabilities
    // This is a placeholder for the actual sync logic
    this.logger.info('Syncing data from customer to business system', {
      ruleId: rule.ruleId,
      dataType: rule.dataType,
    });

    return {
      success: true,
      data: { synced: true, rule: rule.ruleId, direction: 'customer-to-business' },
    };
  }

  /**
   * Circuit breaker implementation
   */
  private isCircuitOpen(key: string): boolean {
    const breaker = this.circuitBreakers.get(key);
    if (!breaker) return false;

    // Reset circuit breaker after timeout
    const timeoutMs = integrationConfig.circuitBreaker.timeoutMs;
    if (breaker.isOpen && Date.now() - breaker.lastFailure.getTime() > timeoutMs) {
      breaker.isOpen = false;
      breaker.failures = 0;
    }

    return breaker.isOpen;
  }

  private recordCircuitBreakerFailure(key: string): void {
    let breaker = this.circuitBreakers.get(key);
    if (!breaker) {
      breaker = { failures: 0, lastFailure: new Date(), isOpen: false };
      this.circuitBreakers.set(key, breaker);
    }

    breaker.failures++;
    breaker.lastFailure = new Date();

    if (breaker.failures >= integrationConfig.circuitBreaker.defaultThreshold) {
      breaker.isOpen = true;
      this.logger.warn(`Circuit breaker opened for ${key}`, {
        failures: breaker.failures,
        threshold: integrationConfig.circuitBreaker.defaultThreshold,
      });
    }
  }

  private resetCircuitBreaker(key: string): void {
    const breaker = this.circuitBreakers.get(key);
    if (breaker) {
      breaker.failures = 0;
      breaker.isOpen = false;
    }
  }

  /**
   * Map data based on mapping configuration
   */
  private mapData(data: any, mapping: { [key: string]: string }): any {
    const result: any = {};

    for (const [targetKey, sourceKey] of Object.entries(mapping)) {
      // Support dot notation for nested properties
      const value = sourceKey.split('.').reduce((obj, key) => obj?.[key], data);
      result[targetKey] = value;
    }

    return result;
  }

  /**
   * Retry workflow step
   */
  private async retryWorkflowStep(
    step: WorkflowStep,
    input: any,
    context: ServiceContext
  ): Promise<ServiceResult<any>> {
    for (let attempt = 1; attempt <= integrationConfig.retry.maxAttempts; attempt++) {
      this.logger.debug('Retrying workflow step', {
        stepId: step.stepId,
        attempt,
        maxAttempts: integrationConfig.retry.maxAttempts,
      });

      await new Promise((resolve) =>
        setTimeout(resolve, integrationConfig.retry.delayMs * attempt)
      );

      let result: ServiceResult<any>;

      if (step.system === 'business') {
        result = await this.businessSystem.executeBusinessOperation(step.operation, input, context);
      } else {
        result = await this.customerSystem.executeCustomerOperation(step.operation, input, context);
      }

      if (result.success) {
        return result;
      }

      if (attempt === integrationConfig.retry.maxAttempts) {
        return result;
      }
    }

    return {
      success: false,
      error: {
        code: 'MAX_RETRIES_EXCEEDED',
        message: 'Maximum retry attempts exceeded',
      },
    };
  }

  /**
   * Rollback workflow
   */
  private async rollbackWorkflow(
    workflow: Workflow,
    stepResults: any[],
    context: ServiceContext
  ): Promise<void> {
    this.logger.info('Rolling back workflow', {
      workflowId: workflow.workflowId,
      stepsToRollback: stepResults.length,
    });

    // Implement rollback logic based on completed steps
    // This would be specific to each operation and system
    for (const stepResult of stepResults.reverse()) {
      if (stepResult.success) {
        this.logger.debug('Rolling back workflow step', {
          stepId: stepResult.step,
          workflowId: workflow.workflowId,
        });
        // Implement specific rollback operations
      }
    }
  }

  /**
   * Get integration health metrics
   */
  getIntegrationHealth(): {
    eventHandlers: number;
    dataSyncRules: number;
    workflows: number;
    circuitBreakers: { [key: string]: { failures: number; isOpen: boolean } };
  } {
    const circuitBreakers: { [key: string]: { failures: number; isOpen: boolean } } = {};

    for (const [key, breaker] of this.circuitBreakers.entries()) {
      circuitBreakers[key] = {
        failures: breaker.failures,
        isOpen: breaker.isOpen,
      };
    }

    return {
      eventHandlers: Array.from(this.eventHandlers.values()).reduce(
        (sum, handlers) => sum + handlers.length,
        0
      ),
      dataSyncRules: this.dataSyncRules.size,
      workflows: this.workflows.size,
      circuitBreakers,
    };
  }
}
