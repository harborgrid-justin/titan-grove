/**
 * Common Types and Interfaces
 * Shared types to reduce code duplication across modules
 */

/**
 * Standard audit fields for all business entities
 */
export interface AuditFields {
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

/**
 * Common status values used across modules
 */
export enum CommonStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

/**
 * Common priority levels
 */
export enum Priority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

/**
 * Standard service response wrapper
 */
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: Date;
  correlationId?: string;
}

/**
 * Common search and pagination parameters
 */
export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  pageSize?: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Standard address format used across modules
 */
export interface Address {
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Contact information structure
 */
export interface ContactInfo {
  email?: string;
  phone?: string;
  mobile?: string;
  fax?: string;
  website?: string;
}

/**
 * Money/Currency representation
 */
export interface Money {
  amount: number;
  currency: string; // ISO 4217 currency code
}

/**
 * File attachment information
 */
export interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
}

/**
 * Generic configuration item
 */
export interface ConfigItem {
  key: string;
  value: string;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
  description?: string;
  category?: string;
  isRequired?: boolean;
  isSecret?: boolean;
}

/**
 * Time period specification
 */
export interface TimePeriod {
  startDate: Date;
  endDate: Date;
  timezone?: string;
}

/**
 * Generic approval workflow status
 */
export interface ApprovalStatus {
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  comments?: string;
  approvalLevel: number;
  nextApprover?: string;
}