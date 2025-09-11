/**
 * Service Command Center Types
 * Type definitions for Fortune 100 Oracle EBS Service Command Center competitive implementation
 */

// ================================
// CORE COMMAND CENTER TYPES
// ================================

export interface ServiceCommandCenter {
  commandCenterId: string;
  name: string;
  description: string;
  region: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'OFFLINE';

  // Operational metrics
  activeServices: number;
  onlineResources: number;
  emergencyAlerts: number;
  performanceScore: number;

  // Service coverage
  serviceAreas: ServiceArea[];
  managedAssets: number;
  activeContracts: number;

  createdDate: Date;
  lastUpdated: Date;
}

export interface ServiceArea {
  areaId: string;
  name: string;
  coordinates: { lat: number; lng: number; radius: number };
  coverage: 'FULL' | 'PARTIAL' | 'LIMITED';
  responseTime: number; // minutes
  activeWorkOrders: number;
  availableTechnicians: number;
}

// ================================
// DASHBOARD & ANALYTICS TYPES
// ================================

export interface ServiceDashboard {
  dashboardId: string;
  userId: string;
  role: 'DISPATCHER' | 'MANAGER' | 'EXECUTIVE' | 'TECHNICIAN';

  // Real-time KPIs
  realTimeKPIs: ServiceKPIs;

  // Widget configuration
  widgets: DashboardWidget[];

  // Alert configuration
  alertSettings: AlertSettings;

  lastRefreshed: Date;
}

export interface ServiceKPIs {
  // Operational metrics
  totalActiveWorkOrders: number;
  averageResponseTime: number; // minutes
  firstTimeFixRate: number; // percentage
  customerSatisfactionScore: number; // 1-10

  // Resource utilization
  technicianUtilization: number; // percentage
  assetAvailability: number; // percentage
  inventoryTurnover: number;

  // Financial metrics
  serviceRevenue: number;
  serviceCosts: number;
  profitMargin: number;

  // Quality metrics
  completionRate: number; // percentage
  reopenRate: number; // percentage
  escalationRate: number; // percentage

  // Trend data
  trends: {
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    data: { date: Date; value: number }[];
  }[];
}

export interface DashboardWidget {
  widgetId: string;
  type: 'KPI' | 'CHART' | 'MAP' | 'LIST' | 'ALERT' | 'CALENDAR';
  title: string;
  size: 'SMALL' | 'MEDIUM' | 'LARGE' | 'FULL_WIDTH';
  position: { row: number; col: number };
  config: any;
  refreshInterval: number; // seconds
}

export interface AlertSettings {
  enabled: boolean;
  thresholds: {
    emergencyAlerts: boolean;
    responseTimeDelay: number; // minutes
    resourceShortage: number; // percentage
    customerSatisfactionDrop: number; // score
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    dashboard: boolean;
  };
}

// ================================
// RESOURCE MANAGEMENT TYPES
// ================================

export interface ServiceResource {
  resourceId: string;
  resourceType: 'TECHNICIAN' | 'VEHICLE' | 'EQUIPMENT' | 'INVENTORY' | 'FACILITY';
  name: string;
  status: 'AVAILABLE' | 'ASSIGNED' | 'UNAVAILABLE' | 'MAINTENANCE';

  // Location and availability
  currentLocation?: { lat: number; lng: number; address: string };
  availability: {
    start: Date;
    end: Date;
    capacity: number; // percentage
  };

  // Skills and capabilities
  skills: string[];
  certifications: string[];
  serviceRadius: number; // miles

  // Performance metrics
  performanceMetrics: {
    completionRate: number;
    averageRating: number;
    responseTime: number;
    utilizationRate: number;
  };

  // Assignment tracking
  currentAssignments: string[]; // work order IDs
  scheduleConflicts: boolean;

  lastUpdated: Date;
}

// ================================
// MOBILE COMMAND CENTER TYPES
// ================================

export interface MobileCommandInterface {
  sessionId: string;
  userId: string;
  deviceInfo: {
    deviceId: string;
    platform: 'iOS' | 'Android' | 'Web';
    version: string;
    capabilities: string[];
  };

  // Location services
  gpsEnabled: boolean;
  currentLocation?: { lat: number; lng: number; accuracy: number };
  locationHistory: { timestamp: Date; lat: number; lng: number }[];

  // Offline capabilities
  offlineMode: boolean;
  syncPending: boolean;
  lastSyncTime: Date;

  // Active context
  activeWorkOrders: string[];
  nearbyResources: ServiceResource[];
  emergencyMode: boolean;
}

// ================================
// ANALYTICS & REPORTING TYPES
// ================================

export interface ServiceAnalytics {
  analyticsId: string;
  reportType: 'OPERATIONAL' | 'FINANCIAL' | 'PERFORMANCE' | 'PREDICTIVE' | 'COMPARATIVE';

  // Analysis period
  period: {
    start: Date;
    end: Date;
    granularity: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  };

  // Metrics and insights
  metrics: ServiceMetrics;
  insights: ServiceInsight[];
  recommendations: ServiceRecommendation[];

  // Competitive analysis
  oracleComparison?: OracleEBSComparison;

  generatedDate: Date;
  generatedBy: string;
}

export interface ServiceMetrics {
  // Volume metrics
  totalServiceRequests: number;
  completedWorkOrders: number;
  averageResolutionTime: number;

  // Quality metrics
  firstTimeFixRate: number;
  customerSatisfaction: number;
  escalationRate: number;

  // Resource metrics
  resourceUtilization: number;
  techniciansActive: number;
  equipmentUtilization: number;

  // Financial metrics
  totalServiceRevenue: number;
  serviceCosts: number;
  profitMargin: number;
  costPerServiceCall: number;
}

export interface ServiceInsight {
  insightId: string;
  type: 'TREND' | 'ANOMALY' | 'OPPORTUNITY' | 'RISK' | 'OPTIMIZATION';
  title: string;
  description: string;
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number; // percentage
  actionable: boolean;
  relatedMetrics: string[];
  generatedDate: Date;
}

export interface ServiceRecommendation {
  recommendationId: string;
  type: 'RESOURCE_OPTIMIZATION' | 'PROCESS_IMPROVEMENT' | 'COST_REDUCTION' | 'QUALITY_ENHANCEMENT';
  title: string;
  description: string;

  // Impact assessment
  estimatedImpact: {
    costSavings?: number;
    timeReduction?: number;
    qualityImprovement?: number;
    customerSatisfactionGain?: number;
  };

  // Implementation details
  implementationEffort: 'LOW' | 'MEDIUM' | 'HIGH';
  timeToImplement: number; // days
  requiredResources: string[];

  // Status tracking
  status: 'NEW' | 'REVIEWED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  assignedTo?: string;
  dueDate?: Date;

  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: string;
}

// ================================
// ORACLE EBS COMPETITIVE TYPES
// ================================

export interface OracleEBSComparison {
  comparisonId: string;
  comparisonDate: Date;

  // Feature comparison
  featureComparison: {
    feature: string;
    oracleEBSRating: number; // 1-10
    titanGroveRating: number; // 1-10
    advantage: number; // difference
    notes: string;
  }[];

  // Overall competitive position
  overallRating: {
    oracle: number;
    titanGrove: number;
    competitiveAdvantage: number;
  };

  // Business value analysis
  businessValue: {
    costSavings: number;
    efficiencyGains: number;
    revenueIncrease: number;
    riskReduction: number;
  };

  // Migration assessment
  migrationComplexity: 'LOW' | 'MEDIUM' | 'HIGH';
  migrationTimeframe: number; // months
  migrationCosts: number;
  expectedROI: number; // months to payback
}

// ================================
// WORKFLOW & AUTOMATION TYPES
// ================================

export interface ServiceWorkflow {
  workflowId: string;
  name: string;
  description: string;
  type: 'SERVICE_REQUEST' | 'WORK_ORDER' | 'ESCALATION' | 'APPROVAL' | 'NOTIFICATION';

  // Workflow definition
  steps: WorkflowStep[];
  triggers: WorkflowTrigger[];
  conditions: WorkflowCondition[];

  // Status and metrics
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  executionCount: number;
  averageExecutionTime: number;
  successRate: number;

  createdDate: Date;
  lastExecuted?: Date;
}

export interface WorkflowStep {
  stepId: string;
  order: number;
  name: string;
  type: 'ASSIGNMENT' | 'NOTIFICATION' | 'APPROVAL' | 'VALIDATION' | 'INTEGRATION' | 'DECISION';
  config: any;
  timeoutMinutes?: number;
  retryCount?: number;
}

export interface WorkflowTrigger {
  triggerId: string;
  name: string;
  type: 'EVENT' | 'SCHEDULE' | 'CONDITION' | 'MANUAL';
  config: any;
  enabled: boolean;
}

export interface WorkflowCondition {
  conditionId: string;
  expression: string;
  action: 'CONTINUE' | 'SKIP' | 'BRANCH' | 'STOP' | 'ESCALATE';
  parameters: any;
}

// ================================
// INTEGRATION TYPES
// ================================

export interface ServiceIntegration {
  integrationId: string;
  systemName: string;
  integrationType:
    | 'FIELD_SERVICE'
    | 'ASSET_MANAGEMENT'
    | 'MAINTENANCE'
    | 'CRM'
    | 'ERP'
    | 'ORACLE_EBS';

  // Connection details
  connectionStatus: 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'MAINTENANCE';
  endpointUrl: string;
  authMethod: 'API_KEY' | 'OAUTH' | 'BASIC' | 'CERTIFICATE';

  // Data synchronization
  dataMapping: {
    sourceField: string;
    targetField: string;
    transformation?: string;
  }[];

  syncFrequency: 'REAL_TIME' | 'HOURLY' | 'DAILY' | 'WEEKLY';
  lastSyncTime: Date;
  syncErrors: number;

  // Performance metrics
  responseTime: number; // milliseconds
  throughput: number; // transactions per hour
  errorRate: number; // percentage
}
