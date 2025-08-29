/**
 * Procurement Planning Types
 * Type definitions for strategic procurement planning
 */

export interface ProcurementStrategy {
  id: string;
  strategyName: string;
  fiscalYear: string;
  agency: string;
  organizationCode: string;
  totalPlannedValue: number;
  strategicObjectives: StrategicObjective[];
  acquisitionCategories: AcquisitionCategory[];
  riskFactors: StrategicRisk[];
  performanceTargets: PerformanceTarget[];
  approvedBy: string;
  approvalDate: Date;
  status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'ACTIVE' | 'CLOSED';
}

export interface StrategicObjective {
  id: string;
  objectiveName: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  targetDate: Date;
  successMetrics: string[];
  ownerOrganization: string;
  dependencies: string[];
}

export interface AcquisitionCategory {
  id: string;
  categoryName: string;
  categoryCode: string;
  description: string;
  plannedSpend: number;
  acquisitionMethod: 'FULL_OPEN_COMPETITION' | 'LIMITED_SOURCES' | 'SOLE_SOURCE' | 'GSA_SCHEDULE' | 'IDIQ';
  incumbentContractors: string[];
  marketAnalysis: MarketAnalysis;
  recommendedStrategy: string;
}

export interface MarketAnalysis {
  marketSize: number;
  numberOfSuppliers: number;
  marketGrowthRate: number;
  competitiveLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  marketRisks: string[];
  opportunities: string[];
  threatAssessment: string[];
}

export interface StrategicRisk {
  id: string;
  riskType: 'BUDGET' | 'SCHEDULE' | 'PERFORMANCE' | 'MARKET' | 'REGULATORY' | 'TECHNOLOGY';
  description: string;
  probability: 'LOW' | 'MEDIUM' | 'HIGH';
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  riskScore: number;
  mitigationStrategy: string;
  ownerOrganization: string;
  monitoringFrequency: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
}

export interface PerformanceTarget {
  id: string;
  targetName: string;
  targetType: 'COST_SAVINGS' | 'CYCLE_TIME' | 'COMPETITION_RATE' | 'COMPLIANCE_SCORE' | 'QUALITY_RATING';
  currentBaseline: number;
  targetValue: number;
  targetDate: Date;
  measurmentUnit: string;
  reportingFrequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
}

export interface AcquisitionForecast {
  id: string;
  forecastPeriod: string;
  totalForecastValue: number;
  plannedAcquisitions: PlannedAcquisition[];
  budgetConstraints: BudgetConstraint[];
  resourceRequirements: ResourceRequirement[];
  dependencyAnalysis: DependencyAnalysis[];
  riskAssessment: ForecastRisk[];
}

export interface PlannedAcquisition {
  id: string;
  acquisitionName: string;
  description: string;
  categoryCode: string;
  estimatedValue: number;
  plannedAwardDate: Date;
  performancePeriod: string;
  acquisitionMethod: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  requirementsOwner: string;
  contractingOfficer: string;
  prerequisites: string[];
  milestones: AcquisitionMilestone[];
}

export interface AcquisitionMilestone {
  id: string;
  milestoneName: string;
  plannedDate: Date;
  description: string;
  deliverables: string[];
  responsibleParty: string;
  dependencies: string[];
}

export interface BudgetConstraint {
  fiscalYear: string;
  availableFunding: number;
  obligatedFunding: number;
  remainingFunding: number;
  fundingSources: FundingSource[];
  restrictions: string[];
}

export interface FundingSource {
  sourceId: string;
  sourceName: string;
  appropriation: string;
  amount: number;
  availabilityPeriod: string;
  restrictions: string[];
}

export interface ResourceRequirement {
  resourceType: 'CONTRACTING_OFFICER' | 'TECHNICAL_EXPERT' | 'LEGAL_COUNSEL' | 'PROGRAM_MANAGER' | 'SPECIALIST';
  requiredSkills: string[];
  certificationLevel: string;
  estimatedHours: number;
  timeframe: string;
  availability: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE';
}

export interface DependencyAnalysis {
  dependencyType: 'SEQUENTIAL' | 'PARALLEL' | 'CONDITIONAL' | 'RESOURCE_DEPENDENT';
  dependentAcquisition: string;
  prerequisiteAcquisition: string;
  description: string;
  impactIfDelayed: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  mitigationOptions: string[];
}

export interface ForecastRisk {
  riskId: string;
  riskCategory: 'FUNDING' | 'TIMELINE' | 'RESOURCE' | 'MARKET' | 'TECHNICAL' | 'REGULATORY';
  description: string;
  probability: number;
  impact: number;
  riskScore: number;
  affectedAcquisitions: string[];
  mitigationStrategy: string;
}

export interface CostAnalysis {
  id: string;
  analysisType: 'SHOULD_COST' | 'PRICE_ANALYSIS' | 'COST_COMPARISON' | 'LIFE_CYCLE_COST' | 'TOTAL_OWNERSHIP_COST';
  acquisitionId: string;
  baselineEstimate: number;
  marketPrice: number;
  governmentEstimate: number;
  negotiatedPrice?: number;
  varianceAnalysis: VarianceAnalysis[];
  costDrivers: CostDriver[];
  savingsOpportunities: SavingsOpportunity[];
}

export interface VarianceAnalysis {
  category: string;
  baselineAmount: number;
  actualAmount: number;
  variance: number;
  variancePercent: number;
  explanation: string;
}

export interface CostDriver {
  driverName: string;
  impactLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  controllable: boolean;
  mitigationStrategy?: string;
}

export interface SavingsOpportunity {
  opportunityType: 'VOLUME_DISCOUNT' | 'COMPETITION' | 'STANDARDIZATION' | 'CONSOLIDATION' | 'ALTERNATIVE_SOURCE';
  estimatedSavings: number;
  implementationCost: number;
  netSavings: number;
  timeToImplement: string;
  feasibility: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendations: string[];
}

export interface StrategicSourcing {
  id: string;
  sourcingStrategy: string;
  commodityCategory: string;
  totalSpend: number;
  supplierBase: SupplierAnalysis[];
  marketPosition: 'BUYER_ADVANTAGE' | 'BALANCED' | 'SUPPLIER_ADVANTAGE';
  sourcingRecommendations: SourcingRecommendation[];
  implementationPlan: ImplementationStep[];
  expectedBenefits: ExpectedBenefit[];
}

export interface SupplierAnalysis {
  supplierId: string;
  supplierName: string;
  marketShare: number;
  performanceRating: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  capabilities: string[];
  geographicPresence: string[];
  financialStability: 'STRONG' | 'ADEQUATE' | 'WEAK';
}

export interface SourcingRecommendation {
  recommendationType: 'CONSOLIDATE' | 'DIVERSIFY' | 'STANDARDIZE' | 'OUTSOURCE' | 'INSOURCE';
  description: string;
  expectedImpact: string;
  implementationComplexity: 'LOW' | 'MEDIUM' | 'HIGH';
  timeline: string;
  prerequisites: string[];
}

export interface ImplementationStep {
  stepNumber: number;
  stepName: string;
  description: string;
  duration: string;
  dependencies: string[];
  resources: string[];
  successCriteria: string[];
}

export interface ExpectedBenefit {
  benefitType: 'COST_REDUCTION' | 'QUALITY_IMPROVEMENT' | 'DELIVERY_IMPROVEMENT' | 'RISK_REDUCTION' | 'INNOVATION';
  quantifiedBenefit: number;
  timeframe: string;
  measurement: string;
  assumptions: string[];
}