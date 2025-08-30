/**
 * Procurement Management Module Types
 * Core interfaces and types for procurement management system
 */

import { CommonStatus, AuditFields } from '../../types/common';

// Core Procurement Types
export interface ProcurementEntity extends AuditFields {
  id: string;
  name: string;
  description: string;
  status: CommonStatus;
}

// Add more specific interfaces here
