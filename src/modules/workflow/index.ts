/**
 */

// Export all types
export * from './types';

// Export data access layer
export * from './data-access/repositories';

// Export business logic services
export * from './business-logic/workflow-management/workflow-service';

// Re-export existing interfaces for backward compatibility

export interface WorkflowDefinition {
  id: string;
  workflowCode: string;
  name: string;
  description: string;
  category: string;
  version: string;
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'DEPRECATED';
  steps: WorkflowStep[];
  triggers: WorkflowTrigger[];
  variables: WorkflowVariable[];
  createdDate: Date;
}

export interface WorkflowStep {
  stepId: string;
  stepName: string;
  stepType: 'APPROVAL' | 'NOTIFICATION' | 'TASK' | 'DECISION' | 'SYSTEM_ACTION';
  assigneeType: 'USER' | 'ROLE' | 'SYSTEM';
  assigneeId?: string;
  conditions?: WorkflowCondition[];
  timeoutHours?: number;
  nextSteps: string[];
}

export interface WorkflowTrigger {
  triggerId: string;
  triggerType: 'MANUAL' | 'SCHEDULED' | 'EVENT' | 'CONDITION';
  triggerConditions?: Record<string, any>;
  active: boolean;
}

export interface WorkflowVariable {
  variableId: string;
  name: string;
  dataType: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'DATE' | 'OBJECT';
  defaultValue?: any;
  required: boolean;
}

export interface WorkflowCondition {
  field: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS';
  value: any;
}

export interface WorkflowInstance {
  id: string;
  workflowId: string;
  instanceNumber: string;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'SUSPENDED';
  currentStepId: string;
  initiatedBy: string;
  startDate: Date;
  completionDate?: Date;
  variables: Record<string, any>;
  executionLog: WorkflowExecutionLog[];
}

export interface WorkflowExecutionLog {
  logId: string;
  stepId: string;
  action: string;
  performedBy: string;
  timestamp: Date;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  notes?: string;
}

export class WorkflowManager {
  async createWorkflowDefinition(
    workflow: Omit<WorkflowDefinition, 'id' | 'status' | 'createdDate'>
  ): Promise<WorkflowDefinition> {
    const id = `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      ...workflow,
      id,
      status: 'DRAFT',
      createdDate: new Date(),
    };
  }

  async startWorkflowInstance(
    workflowId: string,
    initiatedBy: string,
    variables: Record<string, any>
  ): Promise<WorkflowInstance> {
    const id = `wfi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const instanceNumber = `WFI${Date.now().toString().slice(-6)}`;

    return {
      id,
      workflowId,
      instanceNumber,
      status: 'RUNNING',
      currentStepId: 'step_001', // Would be the first step
      initiatedBy,
      startDate: new Date(),
      variables,
      executionLog: [],
    };
  }

  async executeWorkflowStep(
    instanceId: string,
    stepId: string,
    performedBy: string,
    action: string
  ): Promise<{
    status: 'SUCCESS' | 'FAILED';
    nextStep?: string;
    message: string;
  }> {
    console.log(`Executing workflow step ${stepId} for instance ${instanceId}`);
    return {
      status: 'SUCCESS',
      nextStep: 'step_002',
      message: 'Step completed successfully',
    };
  }

  async getWorkflowMetrics(workflowId?: string): Promise<{
    totalInstances: number;
    completedInstances: number;
    averageCompletionTime: number; // hours
    failureRate: number;
    activeInstances: number;
  }> {
    console.log(`Getting workflow metrics for ${workflowId || 'all workflows'}`);
    return {
      totalInstances: 150,
      completedInstances: 142,
      averageCompletionTime: 24.5,
      failureRate: 2.7,
      activeInstances: 8,
    };
  }
}

export const workflowManager = new WorkflowManager();
