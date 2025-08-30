/**
 * Advanced Supply Chain Planning Types
 * Oracle Advanced Supply Chain Planning competitive types and interfaces
 */

export interface DemandForecast {
  id: string;
  productId: string;
  productName: string;
  forecastPeriod: {
    startDate: Date;
    endDate: Date;
  };
  forecastMethod: 'MOVING_AVERAGE' | 'EXPONENTIAL_SMOOTHING' | 'LINEAR_REGRESSION' | 'NEURAL_NETWORK' | 'ENSEMBLE';
  forecastedDemand: number;
  confidence: number;
  actualDemand?: number;
  accuracy?: number;
  createdDate: Date;
  lastUpdated: Date;
}

export interface DemandPlan {
  id: string;
  planName: string;
  planningHorizon: {
    startDate: Date;
    endDate: Date;
  };
  planType: 'STRATEGIC' | 'TACTICAL' | 'OPERATIONAL';
  forecastMethod: 'AI_ML' | 'STATISTICAL' | 'MANUAL' | 'HYBRID';
  demandForecasts: DemandForecast[];
  totalDemand: number;
  planAccuracy: number;
  status: 'DRAFT' | 'ACTIVE' | 'OBSOLETE';
  createdBy: string;
  createdDate: Date;
}

export interface SupplyPlan {
  id: string;
  planName: string;
  demandPlanId: string;
  planningHorizon: {
    startDate: Date;
    endDate: Date;
  };
  supplyConstraints: SupplyConstraint[];
  plannedProduction: PlannedProduction[];
  plannedPurchases: PlannedPurchase[];
  inventoryPlan: InventoryPlan[];
  totalSupply: number;
  supplyGaps: SupplyGap[];
  status: 'DRAFT' | 'ACTIVE' | 'OBSOLETE';
  createdDate: Date;
}

export interface SupplyConstraint {
  constraintId: string;
  constraintType: 'CAPACITY' | 'MATERIAL' | 'LABOR' | 'EQUIPMENT' | 'REGULATORY';
  resourceId: string;
  resourceName: string;
  maxCapacity: number;
  availableCapacity: number;
  constraintLevel: 'HARD' | 'SOFT';
  priority: number;
}

export interface PlannedProduction {
  productId: string;
  productName: string;
  plannedQuantity: number;
  plannedStartDate: Date;
  plannedEndDate: Date;
  resourceRequirements: ResourceRequirement[];
  estimatedCost: number;
}

export interface PlannedPurchase {
  productId: string;
  productName: string;
  plannedQuantity: number;
  plannedOrderDate: Date;
  plannedReceiptDate: Date;
  supplierId: string;
  supplierName: string;
  estimatedCost: number;
}

export interface ResourceRequirement {
  resourceId: string;
  resourceType: 'LABOR' | 'EQUIPMENT' | 'MATERIAL';
  requiredQuantity: number;
  requiredDuration: number; // in hours
  skillRequirements?: string[];
}

export interface InventoryPlan {
  productId: string;
  productName: string;
  currentInventory: number;
  targetInventory: number;
  safetyStock: number;
  reorderPoint: number;
  projectedInventory: InventoryProjection[];
}

export interface InventoryProjection {
  date: Date;
  projectedQuantity: number;
  projectedValue: number;
  stockoutRisk: number;
}

export interface SupplyGap {
  productId: string;
  productName: string;
  gapDate: Date;
  demandQuantity: number;
  supplyQuantity: number;
  gapQuantity: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendedActions: string[];
}

export interface ProductionPlan {
  id: string;
  planName: string;
  supplyPlanId: string;
  planningHorizon: {
    startDate: Date;
    endDate: Date;
  };
  productionSchedules: ProductionSchedule[];
  capacityPlan: CapacityPlan;
  resourcePlan: ResourcePlan;
  totalCapacityUtilization: number;
  status: 'DRAFT' | 'ACTIVE' | 'OBSOLETE';
}

export interface ProductionSchedule {
  scheduleId: string;
  productId: string;
  productName: string;
  workCenterId: string;
  workCenterName: string;
  scheduledStartDate: Date;
  scheduledEndDate: Date;
  plannedQuantity: number;
  priority: number;
  dependencies: string[];
}

export interface CapacityPlan {
  planId: string;
  workCenterCapacity: WorkCenterCapacity[];
  laborCapacity: LaborCapacity[];
  equipmentCapacity: EquipmentCapacity[];
  overallUtilization: number;
  bottlenecks: Bottleneck[];
}

export interface WorkCenterCapacity {
  workCenterId: string;
  workCenterName: string;
  availableCapacity: number;
  plannedCapacity: number;
  utilizationRate: number;
  efficiency: number;
}

export interface LaborCapacity {
  skillId: string;
  skillName: string;
  availableHours: number;
  plannedHours: number;
  utilizationRate: number;
  laborCost: number;
}

export interface EquipmentCapacity {
  equipmentId: string;
  equipmentName: string;
  availableHours: number;
  plannedHours: number;
  utilizationRate: number;
  maintenanceSchedule: MaintenanceWindow[];
}

export interface MaintenanceWindow {
  startDate: Date;
  endDate: Date;
  maintenanceType: 'PREVENTIVE' | 'PREDICTIVE' | 'CORRECTIVE';
  impactedCapacity: number;
}

export interface Bottleneck {
  resourceId: string;
  resourceName: string;
  resourceType: 'WORK_CENTER' | 'LABOR' | 'EQUIPMENT' | 'MATERIAL';
  utilizationRate: number;
  constraintLevel: number;
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendations: string[];
}

export interface ResourcePlan {
  laborPlan: LaborPlan[];
  materialPlan: MaterialPlan[];
  equipmentPlan: EquipmentPlan[];
}

export interface LaborPlan {
  skillId: string;
  skillName: string;
  requiredHours: number;
  availableHours: number;
  utilizationRate: number;
  cost: number;
}

export interface MaterialPlan {
  materialId: string;
  materialName: string;
  requiredQuantity: number;
  availableQuantity: number;
  shortfall: number;
  cost: number;
}

export interface EquipmentPlan {
  equipmentId: string;
  equipmentName: string;
  requiredHours: number;
  availableHours: number;
  utilizationRate: number;
  maintenanceWindows: MaintenanceWindow[];
}

export interface DistributionPlan {
  id: string;
  planName: string;
  supplyPlanId: string;
  networkOptimization: NetworkOptimization;
  distributionStrategy: DistributionStrategy;
  shipmentPlan: ShipmentPlan[];
  inventoryPolicy: InventoryPolicy[];
  totalCost: number;
  serviceLevel: number;
  status: 'DRAFT' | 'ACTIVE' | 'OBSOLETE';
}

export interface NetworkOptimization {
  optimizationObjective: 'MINIMIZE_COST' | 'MAXIMIZE_SERVICE' | 'BALANCED';
  facilityOptimization: FacilityOptimization[];
  routeOptimization: RouteOptimization[];
  inventoryOptimization: InventoryOptimization;
}

export interface FacilityOptimization {
  facilityId: string;
  facilityName: string;
  location: GeographicLocation;
  capacity: number;
  utilizationRate: number;
  costPerUnit: number;
  serviceArea: GeographicArea[];
}

export interface RouteOptimization {
  routeId: string;
  origin: GeographicLocation;
  destination: GeographicLocation;
  mode: 'TRUCK' | 'RAIL' | 'AIR' | 'OCEAN' | 'INTERMODAL';
  distance: number;
  duration: number;
  cost: number;
  carbonFootprint: number;
}

export interface InventoryOptimization {
  productId: string;
  locationId: string;
  optimalInventoryLevel: number;
  reorderPoint: number;
  safetyStock: number;
  carryCost: number;
  stockoutCost: number;
}

export interface GeographicLocation {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface GeographicArea {
  areaId: string;
  boundary: GeographicLocation[];
  populationDensity: number;
  demandVolume: number;
}

export interface DistributionStrategy {
  strategyType: 'DIRECT_SHIP' | 'WAREHOUSE_FULFILLMENT' | 'CROSS_DOCK' | 'DROP_SHIP';
  serviceLevelTarget: number;
  costTarget: number;
  leadTimeTarget: number;
}

export interface ShipmentPlan {
  shipmentId: string;
  originLocationId: string;
  destinationLocationId: string;
  products: ShipmentProduct[];
  plannedShipDate: Date;
  plannedArrivalDate: Date;
  transportMode: 'TRUCK' | 'RAIL' | 'AIR' | 'OCEAN';
  estimatedCost: number;
}

export interface ShipmentProduct {
  productId: string;
  quantity: number;
  weight: number;
  volume: number;
}

export interface InventoryPolicy {
  productId: string;
  locationId: string;
  policyType: 'MIN_MAX' | 'EOQ' | 'JUST_IN_TIME' | 'KANBAN';
  minLevel: number;
  maxLevel: number;
  reorderPoint: number;
  reorderQuantity: number;
  reviewCycle: number; // in days
}

export interface ConstraintModel {
  constraintId: string;
  constraintName: string;
  constraintType: 'CAPACITY' | 'MATERIAL' | 'REGULATORY' | 'FINANCIAL' | 'QUALITY';
  resourceAffected: string;
  constraintValue: number;
  constraintUnit: string;
  hardConstraint: boolean;
  violationCost: number;
}

export interface PlanningScenario {
  scenarioId: string;
  scenarioName: string;
  baseScenarioId?: string;
  scenarioType: 'BASELINE' | 'WHAT_IF' | 'CONTINGENCY';
  assumptions: ScenarioAssumption[];
  demandAssumptions: DemandAssumption[];
  supplyAssumptions: SupplyAssumption[];
  results: ScenarioResults;
  createdDate: Date;
}

export interface ScenarioAssumption {
  assumptionId: string;
  assumptionType: 'DEMAND_CHANGE' | 'CAPACITY_CHANGE' | 'COST_CHANGE' | 'LEAD_TIME_CHANGE';
  affectedResource: string;
  assumptionValue: number;
  assumptionUnit: string;
  description: string;
}

export interface DemandAssumption {
  productId: string;
  demandChange: number;
  changeType: 'PERCENTAGE' | 'ABSOLUTE';
  effectiveDate: Date;
  duration: number; // in days
}

export interface SupplyAssumption {
  resourceId: string;
  capacityChange: number;
  changeType: 'PERCENTAGE' | 'ABSOLUTE';
  effectiveDate: Date;
  duration: number; // in days
}

export interface ScenarioResults {
  totalCost: number;
  serviceLevel: number;
  inventoryLevel: number;
  capacityUtilization: number;
  riskAssessment: RiskAssessment;
  kpis: ScenarioKPI[];
}

export interface RiskAssessment {
  overallRiskScore: number;
  riskFactors: RiskFactor[];
  mitigationStrategies: MitigationStrategy[];
}

export interface RiskFactor {
  riskId: string;
  riskType: 'SUPPLY_DISRUPTION' | 'DEMAND_VOLATILITY' | 'CAPACITY_SHORTAGE' | 'QUALITY_ISSUE';
  probability: number;
  impact: number;
  riskScore: number;
  description: string;
}

export interface MitigationStrategy {
  strategyId: string;
  riskId: string;
  strategyType: 'DIVERSIFY_SUPPLIERS' | 'INCREASE_INVENTORY' | 'IMPROVE_FLEXIBILITY' | 'CONTINGENCY_PLAN';
  implementationCost: number;
  riskReduction: number;
  description: string;
}

export interface ScenarioKPI {
  kpiName: string;
  kpiValue: number;
  kpiUnit: string;
  target: number;
  variance: number;
}

export interface SupplyChainNetwork {
  networkId: string;
  networkName: string;
  facilities: NetworkFacility[];
  transportationLanes: TransportationLane[];
  suppliers: NetworkSupplier[];
  customers: NetworkCustomer[];
  networkConfiguration: NetworkConfiguration;
  networkMetrics: NetworkMetrics;
}

export interface NetworkFacility {
  facilityId: string;
  facilityName: string;
  facilityType: 'MANUFACTURING' | 'WAREHOUSE' | 'DISTRIBUTION_CENTER' | 'CROSS_DOCK';
  location: GeographicLocation;
  capacity: FacilityCapacity;
  operatingCosts: OperatingCosts;
  serviceAreas: string[];
}

export interface FacilityCapacity {
  storageCapacity: number;
  throughputCapacity: number;
  availableCapacity: number;
  utilizationRate: number;
}

export interface OperatingCosts {
  fixedCosts: number;
  variableCosts: number;
  laborCosts: number;
  utilityCosts: number;
  totalCosts: number;
}

export interface TransportationLane {
  laneId: string;
  originFacilityId: string;
  destinationFacilityId: string;
  transportMode: 'TRUCK' | 'RAIL' | 'AIR' | 'OCEAN' | 'INTERMODAL';
  distance: number;
  transitTime: number;
  costPerUnit: number;
  capacity: number;
  utilization: number;
}

export interface NetworkSupplier {
  supplierId: string;
  supplierName: string;
  location: GeographicLocation;
  productsSupplied: string[];
  leadTime: number;
  capacity: number;
  qualityRating: number;
  costStructure: CostStructure;
}

export interface NetworkCustomer {
  customerId: string;
  customerName: string;
  location: GeographicLocation;
  demandProfile: CustomerDemandProfile;
  serviceRequirements: ServiceRequirements;
}

export interface CustomerDemandProfile {
  averageDemand: number;
  seasonality: SeasonalityPattern[];
  demandVolatility: number;
  growthRate: number;
}

export interface SeasonalityPattern {
  period: string;
  factor: number;
}

export interface ServiceRequirements {
  leadTimeRequirement: number;
  serviceLevel: number;
  qualityRequirements: string[];
  specialHandling: string[];
}

export interface CostStructure {
  unitCost: number;
  setupCost: number;
  transportationCost: number;
  qualityCost: number;
}

export interface NetworkConfiguration {
  optimizationObjective: 'MINIMIZE_COST' | 'MAXIMIZE_SERVICE' | 'MINIMIZE_RISK' | 'BALANCED';
  planningHorizon: number; // in days
  reviewCycle: number; // in days
  constraintParameters: ConstraintParameters;
}

export interface ConstraintParameters {
  maxFacilities: number;
  maxTransportationModes: number;
  budgetConstraint: number;
  serviceTargets: ServiceTargets;
}

export interface ServiceTargets {
  fillRate: number;
  onTimeDelivery: number;
  customerSatisfaction: number;
}

export interface NetworkMetrics {
  totalCost: number;
  serviceLevel: number;
  networkComplexity: number;
  riskExposure: number;
  sustainabilityScore: number;
  efficiency: EfficiencyMetrics;
}

export interface EfficiencyMetrics {
  assetUtilization: number;
  inventoryTurnover: number;
  transportationEfficiency: number;
  warehouseEfficiency: number;
}

export interface PlanningOptimization {
  optimizationId: string;
  optimizationType: 'DEMAND_PLANNING' | 'SUPPLY_PLANNING' | 'PRODUCTION_PLANNING' | 'DISTRIBUTION_PLANNING' | 'NETWORK_OPTIMIZATION';
  objective: OptimizationObjective;
  constraints: OptimizationConstraint[];
  variables: OptimizationVariable[];
  solution: OptimizationSolution;
  algorithm: 'LINEAR_PROGRAMMING' | 'GENETIC_ALGORITHM' | 'SIMULATED_ANNEALING' | 'MACHINE_LEARNING';
  executionTime: number;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
}

export interface OptimizationObjective {
  objectiveType: 'MINIMIZE' | 'MAXIMIZE';
  targetFunction: 'COST' | 'SERVICE_LEVEL' | 'UTILIZATION' | 'PROFIT' | 'RISK';
  weight: number;
}

export interface OptimizationConstraint {
  constraintId: string;
  constraintType: 'EQUALITY' | 'INEQUALITY';
  leftSide: string;
  operator: '=' | '<=' | '>=' | '<' | '>';
  rightSide: number;
  violationPenalty: number;
}

export interface OptimizationVariable {
  variableId: string;
  variableName: string;
  variableType: 'CONTINUOUS' | 'INTEGER' | 'BINARY';
  lowerBound: number;
  upperBound: number;
  currentValue: number;
}

export interface OptimizationSolution {
  objectiveValue: number;
  variableValues: VariableValue[];
  constraints: ConstraintStatus[];
  feasible: boolean;
  optimal: boolean;
  gap: number;
}

export interface VariableValue {
  variableId: string;
  value: number;
  reducedCost: number;
}

export interface ConstraintStatus {
  constraintId: string;
  slack: number;
  shadowPrice: number;
  binding: boolean;
}

export interface SupplyChainAnalytics {
  analyticsId: string;
  analysisType: 'PERFORMANCE' | 'PREDICTIVE' | 'PRESCRIPTIVE' | 'DIAGNOSTIC';
  timeFrame: {
    startDate: Date;
    endDate: Date;
  };
  metrics: AnalyticsMetrics;
  insights: AnalyticsInsight[];
  recommendations: AnalyticsRecommendation[];
  predictions: AnalyticsPrediction[];
}

export interface AnalyticsMetrics {
  demandAccuracy: number;
  supplyChainVelocity: number;
  inventoryTurnover: number;
  fillRate: number;
  onTimeDelivery: number;
  totalCost: number;
  customerSatisfaction: number;
  supplierPerformance: number;
}

export interface AnalyticsInsight {
  insightId: string;
  insightType: 'TREND' | 'ANOMALY' | 'CORRELATION' | 'PATTERN';
  description: string;
  confidence: number;
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  actionRequired: boolean;
}

export interface AnalyticsRecommendation {
  recommendationId: string;
  recommendationType: 'OPTIMIZATION' | 'RISK_MITIGATION' | 'COST_REDUCTION' | 'SERVICE_IMPROVEMENT';
  description: string;
  expectedBenefit: number;
  implementationCost: number;
  timeframe: number; // in days
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export interface AnalyticsPrediction {
  predictionId: string;
  predictionType: 'DEMAND_FORECAST' | 'SUPPLY_RISK' | 'COST_PROJECTION' | 'SERVICE_IMPACT';
  prediction: any;
  confidence: number;
  horizon: number; // in days
  accuracy?: number; // if historical data available
}