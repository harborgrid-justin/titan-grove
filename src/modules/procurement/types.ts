/**
 * Procurement Management Module Types
 * Core interfaces and types for procurement management system
 */

// Core Procurement Types
export interface ProcurementEntity {
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
