/**
 * Orders Management Module Types
 * Core interfaces and types for orders management system
 */

// Core Orders Types
export interface OrdersEntity {
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
