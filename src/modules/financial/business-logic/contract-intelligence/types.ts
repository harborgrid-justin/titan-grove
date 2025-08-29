/**
 * Contract Intelligence Types
 * Type definitions for contract intelligence and analytics
 */

export interface ContractAnalytics {
  id: string;
  reportType: 'EXECUTIVE_DASHBOARD' | 'OPERATIONAL_METRICS' | 'COMPLIANCE_REPORT' | 'PERFORMANCE_ANALYSIS' | 'COST_ANALYSIS';
  generatedDate: Date;
  reportingPeriod: ReportingPeriod;
  organizationScope: string[];
  dataSource: string;
  metrics: ContractMetric[];
  insights: ContractInsight[];
  recommendations: string[];
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ReportingPeriod {
  startDate: Date;
  endDate: Date;
  periodType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'CUSTOM';
  fiscalYear?: string;
}

export interface ContractMetric {
  metricId: string;
  metricName: string;
  metricType: 'KPI' | 'OPERATIONAL' | 'FINANCIAL' | 'COMPLIANCE' | 'PERFORMANCE';
  currentValue: number;
  previousValue?: number;
  targetValue?: number;
  unit: string;
  trend: 'IMPROVING' | 'DECLINING' | 'STABLE';
  variancePercent: number;
  benchmarkValue?: number;
  category: string;
}

export interface ContractInsight {
  insightId: string;
  insightType: 'TREND_ANALYSIS' | 'ANOMALY_DETECTION' | 'PREDICTIVE' | 'COMPARATIVE' | 'ROOT_CAUSE';
  title: string;
  description: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  actionRequired: boolean;
  relatedMetrics: string[];
  generatedBy: 'AI_ENGINE' | 'ANALYST' | 'SYSTEM';
  confidence: number;
}

export interface ExecutiveDashboard {
  id: string;
  dashboardName: string;
  lastUpdated: Date;
  keyPerformanceIndicators: KPIWidget[];
  financialSummary: FinancialSummary;
  riskAlert: RiskAlert[];
  complianceStatus: ComplianceStatus;
  operationalMetrics: OperationalMetrics;
  strategicInitiatives: StrategicInitiative[];
}

export interface KPIWidget {
  kpiId: string;
  kpiName: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  trend: 'UP' | 'DOWN' | 'STABLE';
  performanceIndicator: 'EXCEEDS' | 'MEETS' | 'BELOW' | 'CRITICAL';
}

export interface FinancialSummary {
  totalContractValue: number;
  obligatedAmount: number;
  expendedAmount: number;
  remainingValue: number;
  plannedSavings: number;
  actualSavings: number;
  costAvoidance: number;
  budgetVariance: number;
  forecastAccuracy: number;
}

export interface RiskAlert {
  alertId: string;
  alertType: 'PERFORMANCE' | 'FINANCIAL' | 'COMPLIANCE' | 'OPERATIONAL' | 'SECURITY';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  affectedContracts: string[];
  recommendedActions: string[];
  escalationRequired: boolean;
}

export interface ComplianceStatus {
  overallScore: number;
  totalRegulations: number;
  compliantRegulations: number;
  nonCompliantRegulations: number;
  regulationsAtRisk: number;
  regulationCompliance: RegulationCompliance[];
  certificationStatus: CertificationStatus[];
}

export interface RegulationCompliance {
  regulationId: string;
  regulationName: string;
  complianceStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'AT_RISK' | 'UNDER_REVIEW';
  lastAuditDate: Date;
  nextAuditDate: Date;
}

export interface CertificationStatus {
  certificationId: string;
  certificationName: string;
  status: 'CURRENT' | 'EXPIRING' | 'EXPIRED' | 'SUSPENDED';
  expirationDate?: Date;
  renewalRequired: boolean;
}

export interface OperationalMetrics {
  cycleTimeMetrics: CycleTimeMetric[];
  workloadAnalysis: WorkloadAnalysis;
  resourceUtilization: ResourceUtilization[];
  qualityMetrics: QualityMetric[];
  productivityMetrics: ProductivityMetric[];
}

export interface CycleTimeMetric {
  processName: string;
  averageCycleTime: number;
  targetCycleTime: number;
  variance: number;
  bottlenecks: string[];
  improvementOpportunities: string[];
}

export interface WorkloadAnalysis {
  totalActiveContracts: number;
  newContractsThisPeriod: number;
  contractsClosedThisPeriod: number;
  averageContractsPerOfficer: number;
  workloadDistribution: { [officerId: string]: number };
  capacityUtilization: number;
}

export interface ResourceUtilization {
  resourceType: string;
  allocated: number;
  utilized: number;
  utilizationRate: number;
  efficiency: number;
  bottlenecks: string[];
}

export interface QualityMetric {
  qualityIndicator: string;
  currentScore: number;
  targetScore: number;
  defectRate: number;
  customerSatisfaction: number;
  improvementTrend: 'IMPROVING' | 'DECLINING' | 'STABLE';
}

export interface ProductivityMetric {
  productivityIndicator: string;
  outputPerPeriod: number;
  targetOutput: number;
  efficiency: number;
  resourceInput: number;
  productivityRatio: number;
}

export interface StrategicInitiative {
  initiativeId: string;
  initiativeName: string;
  description: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  progressPercent: number;
  targetDate: Date;
  expectedBenefits: string[];
  keyMilestones: Milestone[];
}

export interface Milestone {
  milestoneId: string;
  milestoneName: string;
  targetDate: Date;
  actualDate?: Date;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
  description: string;
}

export interface DataTransparency {
  dataSourceId: string;
  dataSourceName: string;
  lastUpdated: Date;
  dataQualityScore: number;
  recordCount: number;
  completenessPercent: number;
  accuracyPercent: number;
  timelinessScore: number;
  dataLineage: DataLineage[];
  dataGovernance: DataGovernance;
}

export interface DataLineage {
  sourceSystem: string;
  transformationSteps: string[];
  dataFlow: string;
  lastProcessed: Date;
  processingStatus: 'SUCCESS' | 'WARNING' | 'ERROR';
}

export interface DataGovernance {
  dataOwner: string;
  dataClassification: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
  retentionPolicy: string;
  accessControls: string[];
  complianceRequirements: string[];
}

export interface PredictiveAnalytics {
  modelId: string;
  modelName: string;
  modelType: 'REGRESSION' | 'CLASSIFICATION' | 'TIME_SERIES' | 'CLUSTERING' | 'NEURAL_NETWORK';
  predictionType: 'COST_OVERRUN' | 'SCHEDULE_DELAY' | 'PERFORMANCE_RISK' | 'COMPLIANCE_VIOLATION' | 'RENEWAL_LIKELIHOOD';
  predictions: Prediction[];
  modelAccuracy: number;
  lastTrainedDate: Date;
  nextRetrainingDate: Date;
}

export interface Prediction {
  predictionId: string;
  contractId: string;
  predictedOutcome: string;
  probability: number;
  confidenceInterval: { lower: number; upper: number };
  factors: PredictionFactor[];
  recommendedActions: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface PredictionFactor {
  factorName: string;
  importance: number;
  value: number;
  impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
}

export interface BenchmarkAnalysis {
  benchmarkId: string;
  benchmarkType: 'INDUSTRY' | 'GOVERNMENT' | 'PEER_AGENCY' | 'HISTORICAL' | 'BEST_PRACTICE';
  category: string;
  organizationMetric: number;
  benchmarkValue: number;
  percentile: number;
  gap: number;
  gapAnalysis: string;
  improvementOpportunities: string[];
}