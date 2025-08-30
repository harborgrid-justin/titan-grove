/**
 * Service Management Module Types
 * Core interfaces and types for service management system
 */

// Core Service Types
export interface ServiceEntity {
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
