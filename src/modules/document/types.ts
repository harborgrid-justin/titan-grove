/**
 * Document Management Module Types
 * Core interfaces and types for enterprise document management system
 */

// Core Document Types
export interface Document {
  id: string;
  documentNumber: string;
  title: string;
  description: string;
  type: 'CONTRACT' | 'POLICY' | 'PROCEDURE' | 'SPECIFICATION' | 'REPORT' | 'FORM' | 'OTHER';
  category: string;
  status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED' | 'OBSOLETE';
  version: string;
  language: string;
  format: 'PDF' | 'DOCX' | 'TXT' | 'HTML' | 'XML' | 'IMAGE' | 'OTHER';
  filePath: string;
  fileSize: number;
  checksum: string;
  author: string;
  owner: string;
  department: string;
  confidentiality: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
  retentionPeriod: number; // in years
  tags: string[];
  metadata: Record<string, any>;
  createdDate: Date;
  modifiedDate: Date;
  publishedDate?: Date;
  expirationDate?: Date;
  approvalHistory: DocumentApproval[];
  versions: DocumentVersion[];
  relatedDocuments: string[];
  permissions: DocumentPermission[];
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: string;
  filePath: string;
  fileSize: number;
  changes: string;
  createdBy: string;
  createdDate: Date;
  status: 'CURRENT' | 'SUPERSEDED' | 'ARCHIVED';
}

export interface DocumentApproval {
  id: string;
  documentId: string;
  version: string;
  approver: string;
  approvalDate: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN';
  comments?: string;
  digitalSignature?: string;
}

export interface DocumentPermission {
  id: string;
  documentId: string;
  principalType: 'USER' | 'GROUP' | 'ROLE';
  principalId: string;
  permission: 'READ' | 'WRITE' | 'DELETE' | 'APPROVE' | 'ADMIN';
  grantedBy: string;
  grantedDate: Date;
  expirationDate?: Date;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  templateType: 'WORD' | 'PDF' | 'FORM' | 'WORKFLOW';
  filePath: string;
  fields: TemplateField[];
  rules: TemplateRule[];
  isActive: boolean;
  createdBy: string;
  createdDate: Date;
}

export interface TemplateField {
  id: string;
  name: string;
  label: string;
  type: 'TEXT' | 'NUMBER' | 'DATE' | 'BOOLEAN' | 'SELECT' | 'MULTISELECT';
  required: boolean;
  defaultValue?: any;
  validationRules: string[];
  options?: string[];
}

export interface TemplateRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  parameters: Record<string, any>;
}

export interface DocumentWorkflow {
  id: string;
  name: string;
  description: string;
  documentType: string;
  isActive: boolean;
  steps: WorkflowStep[];
  createdBy: string;
  createdDate: Date;
}

export interface WorkflowStep {
  id: string;
  workflowId: string;
  stepNumber: number;
  name: string;
  type: 'REVIEW' | 'APPROVAL' | 'NOTIFICATION' | 'TASK' | 'CONDITION';
  assignee: string;
  durationDays: number;
  isRequired: boolean;
  conditions: WorkflowCondition[];
}

export interface WorkflowCondition {
  id: string;
  field: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS';
  value: any;
}

export interface DocumentRequest {
  id: string;
  requestType: 'NEW' | 'UPDATE' | 'REVIEW' | 'APPROVAL' | 'DELETION';
  documentId?: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  requestedBy: string;
  assignedTo: string;
  status: 'SUBMITTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
  dueDate: Date;
  requestedDate: Date;
  completedDate?: Date;
  attachments: string[];
}

export interface DocumentAudit {
  id: string;
  documentId: string;
  action: 'CREATED' | 'VIEWED' | 'DOWNLOADED' | 'MODIFIED' | 'APPROVED' | 'DELETED' | 'SHARED';
  performedBy: string;
  performedDate: Date;
  ipAddress: string;
  userAgent: string;
  details: Record<string, any>;
}

export interface DocumentLibrary {
  id: string;
  name: string;
  description: string;
  type: 'GENERAL' | 'PROJECT' | 'DEPARTMENT' | 'COMPLIANCE' | 'ARCHIVE';
  parentLibraryId?: string;
  path: string;
  permissions: LibraryPermission[];
  settings: LibrarySettings;
  createdBy: string;
  createdDate: Date;
}

export interface LibraryPermission {
  id: string;
  libraryId: string;
  principalType: 'USER' | 'GROUP' | 'ROLE';
  principalId: string;
  permission: 'READ' | 'CONTRIBUTE' | 'DESIGN' | 'FULL_CONTROL';
  inheritFromParent: boolean;
}

export interface LibrarySettings {
  versioning: boolean;
  approvalRequired: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
  retentionPolicy: string;
  autoClassification: boolean;
}

export interface DocumentSearch {
  query: string;
  filters: {
    type?: string;
    category?: string;
    status?: string;
    author?: string;
    department?: string;
    dateRange?: {
      from: Date;
      to: Date;
    };
    tags?: string[];
  };
  sortBy?: 'relevance' | 'date' | 'title' | 'author';
  sortOrder?: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

export interface DocumentSearchResult {
  documents: Document[];
  totalCount: number;
  facets: {
    types: Array<{ value: string; count: number }>;
    categories: Array<{ value: string; count: number }>;
    authors: Array<{ value: string; count: number }>;
    tags: Array<{ value: string; count: number }>;
  };
}