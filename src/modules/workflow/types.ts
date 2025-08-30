/**
 * Workflow Management Module Types
 * Core interfaces and types for workflow management system
 */

// Core Workflow Types
export interface WorkflowEntity {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'COMPLETED';
  createdDate: Date;
  modifiedDate: Date;
  createdBy: string;
  modifiedBy: string;
}

// Add more specific interfaces here
