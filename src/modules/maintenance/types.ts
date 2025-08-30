/**
 * Maintenance Management Module Types
 * Core interfaces and types for maintenance management system
 */

// Core Maintenance Types
export interface MaintenanceEntity {
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
