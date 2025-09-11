/**
 * Customer Relationship Management Module Types
 * Core interfaces and types for CRM system
 */

// Core CRM Types
export interface Customer {
  id: string;
  customerNumber: string;
  name: string;
  type: 'INDIVIDUAL' | 'COMPANY';
  industry?: string;
  email: string;
  phone: string;
  website?: string;
  address: CRMAddress;
  status: 'PROSPECT' | 'ACTIVE' | 'INACTIVE' | 'CHURNED';
  assignedSalesRep?: string;
  createdDate: Date;
  lastContactDate?: Date;
  totalRevenue: number;
}

export interface CRMAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  email: string;
  phone: string;
  source: 'WEBSITE' | 'REFERRAL' | 'COLD_CALL' | 'MARKETING' | 'TRADE_SHOW' | 'OTHER';
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
  score: number;
  assignedTo?: string;
  notes: string;
  createdDate: Date;
  lastActivityDate?: Date;
}

export interface Opportunity {
  id: string;
  name: string;
  customerId: string;
  amount: number;
  probability: number;
  stage:
    | 'PROSPECTING'
    | 'QUALIFICATION'
    | 'PROPOSAL'
    | 'NEGOTIATION'
    | 'CLOSED_WON'
    | 'CLOSED_LOST';
  expectedCloseDate: Date;
  actualCloseDate?: Date;
  ownerId: string;
  description: string;
  competitors: string[];
  products: OpportunityProduct[];
}

export interface OpportunityProduct {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

export interface SupportCase {
  id: string;
  caseNumber: string;
  customerId: string;
  subject: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_CUSTOMER' | 'RESOLVED' | 'CLOSED';
  assignedTo?: string;
  createdDate: Date;
  resolvedDate?: Date;
  category: 'TECHNICAL' | 'BILLING' | 'GENERAL' | 'FEATURE_REQUEST';
  resolution?: string;
}

export interface Activity {
  id: string;
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'TASK' | 'NOTE';
  subject: string;
  description: string;
  relatedTo: {
    type: 'CUSTOMER' | 'LEAD' | 'OPPORTUNITY' | 'CASE';
    id: string;
  };
  assignedTo: string;
  dueDate?: Date;
  completedDate?: Date;
  status: 'PLANNED' | 'COMPLETED' | 'CANCELLED';
}

// Lead Management Types (from business-logic services)
export interface LeadScoringCriteria {
  demographic: number;
  behavioral: number;
  firmographic: number;
  engagement: number;
}

export interface LeadNurturingCampaign {
  id: string;
  name: string;
  description: string;
  triggerConditions: string[];
  emailTemplates: EmailTemplate[];
  durationDays: number;
  isActive: boolean;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  scheduleDelay: number; // days
}

// Customer Management Types
export interface CustomerSegment {
  id: string;
  name: string;
  criteria: SegmentationCriteria;
  customerCount: number;
  averageValue: number;
  isActive: boolean;
}

export interface SegmentationCriteria {
  revenueMin?: number;
  revenueMax?: number;
  industries?: string[];
  geographies?: string[];
  purchaseBehavior?: string[];
  engagementLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface CustomerHealthScore {
  customerId: string;
  score: number; // 0-100
  factors: HealthScoreFactor[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendations: string[];
  lastCalculated: Date;
}

export interface HealthScoreFactor {
  factor: string;
  weight: number;
  score: number;
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
}

// Sales Pipeline Types
export interface SalesForecast {
  period: string;
  totalPipeline: number;
  weightedPipeline: number;
  committedForecast: number;
  bestCaseForecast: number;
  closedWon: number;
  forecastAccuracy: number;
}

export interface SalesQuota {
  id: string;
  salesRepId: string;
  period: string;
  quotaAmount: number;
  actualAmount: number;
  attainment: number; // percentage
  isActive: boolean;
}

// Service Management Types
export interface ServiceLevel {
  id: string;
  name: string;
  description: string;
  responseTime: number; // minutes
  resolutionTime: number; // hours
  availability: number; // percentage
  escalationRules: EscalationRule[];
}

export interface EscalationRule {
  id: string;
  triggerCondition: string;
  escalateToRole: string;
  escalateAfterMinutes: number;
  isActive: boolean;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  viewCount: number;
  helpfulVotes: number;
  createdBy: string;
  createdDate: Date;
  lastModified: Date;
  isPublished: boolean;
}

// Analytics and Reporting Types
export interface CRMAnalytics {
  salesMetrics: {
    totalRevenue: number;
    newCustomers: number;
    pipelineValue: number;
    winRate: number;
    averageDealSize: number;
    salesCycle: number;
  };
  customerMetrics: {
    totalCustomers: number;
    activeCustomers: number;
    churnRate: number;
    customerLifetimeValue: number;
    customerSatisfaction: number;
    netPromoterScore: number;
  };
  serviceMetrics: {
    totalCases: number;
    resolvedCases: number;
    averageResolutionTime: number;
    firstCallResolution: number;
    customerSatisfaction: number;
    escalationRate: number;
  };
}

export interface DashboardWidget {
  id: string;
  type: 'CHART' | 'TABLE' | 'KPI' | 'LIST';
  title: string;
  dataSource: string;
  configuration: Record<string, any>;
  position: { x: number; y: number; width: number; height: number };
  permissions: string[];
}

// Marketing Integration Types
export interface Campaign {
  id: string;
  name: string;
  type: 'EMAIL' | 'SOCIAL' | 'CONTENT' | 'EVENT' | 'WEBINAR';
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  startDate: Date;
  endDate?: Date;
  budget: number;
  actualSpend: number;
  targetAudience: CampaignAudience;
  metrics: CampaignMetrics;
}

export interface CampaignAudience {
  segmentIds: string[];
  estimatedReach: number;
  targetCriteria: Record<string, any>;
}

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  leads: number;
  conversions: number;
  cost: number;
  roi: number;
}
