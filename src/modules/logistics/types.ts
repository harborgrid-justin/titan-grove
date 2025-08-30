/**
 * Logistics Management Types
 * Comprehensive Oracle EBS competitive logistics management system types and interfaces
 */

// ================================
// CORE LOGISTICS TYPES
// ================================

export interface LogisticsProvider {
  id: string;
  name: string;
  code: string;
  type: 'CARRIER' | 'WAREHOUSE' | '3PL' | 'FREIGHT_FORWARDER';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  capabilities: LogisticsCapability[];
  serviceAgreements: ServiceAgreement[];
  performanceMetrics: ProviderPerformanceMetrics;
  contactInfo: ContactInfo;
  operatingRegions: GeographicRegion[];
  certifications: string[];
  contractDetails: ContractDetails;
  integrationConfig: IntegrationConfig;
  createdDate: Date;
  lastUpdated: Date;
}

export interface LogisticsCapability {
  capabilityId: string;
  capabilityType: 'TRANSPORTATION' | 'WAREHOUSING' | 'CROSS_DOCK' | 'VALUE_ADDED_SERVICES';
  description: string;
  capacity: number;
  unit: string;
  constraints: Record<string, any>;
  costStructure: CostStructure;
}

export interface ServiceAgreement {
  agreementId: string;
  serviceType: string;
  slaMetrics: SLAMetric[];
  pricingTiers: PricingTier[];
  effectiveDate: Date;
  expirationDate: Date;
  terms: string;
}

export interface ProviderPerformanceMetrics {
  onTimeDeliveryRate: number;
  averageTransitTime: number;
  damageRate: number;
  costPerShipment: number;
  customerSatisfactionScore: number;
  complianceScore: number;
  lastUpdated: Date;
}

// ================================
// TRANSPORTATION MANAGEMENT TYPES
// ================================

export interface TransportationOrder {
  orderId: string;
  orderNumber: string;
  orderType: 'PICKUP' | 'DELIVERY' | 'TRANSFER' | 'RETURN';
  status: TransportationOrderStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'EMERGENCY';
  
  // Origin and destination
  originLocation: Location;
  destinationLocation: Location;
  
  // Shipment details
  shipments: Shipment[];
  totalWeight: number;
  totalVolume: number;
  totalValue: number;
  
  // Service requirements
  serviceType: ServiceType;
  deliveryRequirements: DeliveryRequirements;
  specialInstructions: string;
  
  // Carrier information
  assignedCarrier?: LogisticsProvider;
  carrierService?: string;
  
  // Scheduling
  scheduledPickupDate: Date;
  scheduledDeliveryDate: Date;
  actualPickupDate?: Date;
  actualDeliveryDate?: Date;
  
  // Financial
  estimatedCost: number;
  actualCost?: number;
  billingDetails: BillingDetails;
  
  // Tracking
  trackingNumbers: string[];
  statusHistory: StatusHistory[];
  
  // Compliance and documentation
  requiredDocuments: Document[];
  customsInfo?: CustomsInfo;
  hazmatInfo?: HazmatInfo;
  
  createdBy: string;
  createdDate: Date;
  lastUpdated: Date;
}

export type TransportationOrderStatus = 
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'ASSIGNED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'EXCEPTION'
  | 'COMPLETED';

export interface Shipment {
  shipmentId: string;
  shipmentNumber: string;
  status: ShipmentStatus;
  packages: Package[];
  weight: number;
  volume: number;
  value: number;
  description: string;
  specialHandling: string[];
}

export type ShipmentStatus = 
  | 'CREATED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'EXCEPTION'
  | 'RETURNED';

export interface Package {
  packageId: string;
  trackingNumber: string;
  dimensions: Dimensions;
  weight: number;
  value: number;
  contents: string;
  packageType: 'BOX' | 'ENVELOPE' | 'TUBE' | 'PAK' | 'PALLET';
  hazmat: boolean;
  fragile: boolean;
}

// ================================
// WAREHOUSE MANAGEMENT TYPES
// ================================

export interface WarehouseOperation {
  operationId: string;
  operationType: WarehouseOperationType;
  status: WarehouseOperationStatus;
  warehouseId: string;
  orderId?: string;
  priority: Priority;
  
  // Operation details
  items: WarehouseItem[];
  fromLocation?: Location;
  toLocation?: Location;
  
  // Assignment and scheduling
  assignedWorker?: string;
  assignedEquipment?: Equipment[];
  scheduledStartTime: Date;
  scheduledEndTime: Date;
  actualStartTime?: Date;
  actualEndTime?: Date;
  
  // Instructions and requirements
  workInstructions: WorkInstruction[];
  qualityRequirements: QualityRequirement[];
  safetyRequirements: SafetyRequirement[];
  
  // Performance tracking
  expectedDuration: number;
  actualDuration?: number;
  accuracyRate?: number;
  
  createdDate: Date;
  lastUpdated: Date;
}

export type WarehouseOperationType = 
  | 'RECEIVING'
  | 'PUT_AWAY'
  | 'PICKING'
  | 'PACKING'
  | 'SHIPPING'
  | 'REPLENISHMENT'
  | 'CYCLE_COUNT'
  | 'CROSS_DOCK'
  | 'RETURN_PROCESSING'
  | 'VALUE_ADDED_SERVICE';

export type WarehouseOperationStatus = 
  | 'PLANNED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'ON_HOLD'
  | 'EXCEPTION';

export interface WarehouseItem {
  itemId: string;
  sku: string;
  description: string;
  quantity: number;
  unit: string;
  lotNumber?: string;
  serialNumbers?: string[];
  expirationDate?: Date;
  condition: 'NEW' | 'USED' | 'DAMAGED' | 'RETURNED';
  storageRequirements: StorageRequirement[];
}

export interface WorkInstruction {
  instructionId: string;
  type: 'PICKING' | 'PACKING' | 'HANDLING' | 'SAFETY' | 'QUALITY';
  priority: Priority;
  description: string;
  mediaAttachments: string[];
}

// ================================
// DISTRIBUTION MANAGEMENT TYPES
// ================================

export interface DistributionNetwork {
  networkId: string;
  name: string;
  description: string;
  networkType: 'REGIONAL' | 'NATIONAL' | 'INTERNATIONAL';
  
  // Network components
  distributionCenters: DistributionCenter[];
  transitRoutes: TransitRoute[];
  serviceAreas: ServiceArea[];
  
  // Performance metrics
  networkMetrics: NetworkPerformanceMetrics;
  costMetrics: NetworkCostMetrics;
  
  // Configuration
  operatingRules: OperatingRule[];
  flowPolicies: FlowPolicy[];
  
  status: 'ACTIVE' | 'INACTIVE' | 'UNDER_REVIEW';
  createdDate: Date;
  lastUpdated: Date;
}

export interface DistributionCenter {
  centerId: string;
  name: string;
  code: string;
  type: 'WAREHOUSE' | 'CROSS_DOCK' | 'CONSOLIDATION' | 'SORTATION';
  location: Location;
  
  // Capacity and capabilities
  storageCapacity: number;
  throughputCapacity: number;
  capabilities: WarehouseCapability[];
  operatingHours: OperatingHours;
  
  // Staffing and equipment
  staffing: StaffingPlan;
  equipment: Equipment[];
  
  // Performance
  utilizationRate: number;
  throughputRate: number;
  accuracyRate: number;
  costPerUnit: number;
}

export interface TransitRoute {
  routeId: string;
  routeName: string;
  routeType: 'DIRECT' | 'HUB_SPOKE' | 'MILK_RUN' | 'CROSS_DOCK';
  
  // Route definition
  originLocation: Location;
  destinationLocation: Location;
  intermediateStops: Location[];
  totalDistance: number;
  estimatedTransitTime: number;
  
  // Service characteristics
  serviceFrequency: ServiceFrequency;
  serviceLevel: ServiceLevel;
  capacity: RouteCapacity;
  
  // Costing
  costStructure: RouteCostStructure;
  
  // Performance
  performanceMetrics: RoutePerformanceMetrics;
  
  status: 'ACTIVE' | 'INACTIVE' | 'SEASONAL';
}

// ================================
// ROUTE OPTIMIZATION TYPES
// ================================

export interface RouteOptimizationRequest {
  requestId: string;
  optimizationType: 'DISTANCE' | 'TIME' | 'COST' | 'COMBINED';
  objectives: OptimizationObjective[];
  constraints: OptimizationConstraint[];
  
  // Input data
  vehicles: OptimizationVehicle[];
  stops: OptimizationStop[];
  depot: Location;
  
  // Parameters
  parameters: OptimizationParameters;
  
  // Results
  solutions: OptimizedRoute[];
  bestSolution?: OptimizedRoute;
  optimizationMetrics: OptimizationMetrics;
  
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  createdDate: Date;
  completedDate?: Date;
}

export interface OptimizedRoute {
  routeId: string;
  vehicleId: string;
  stops: OptimizedStop[];
  totalDistance: number;
  totalTime: number;
  totalCost: number;
  utilizationRate: number;
  feasible: boolean;
  sequence: number[];
}

export interface OptimizedStop {
  stopId: string;
  location: Location;
  arrivalTime: Date;
  departureTime: Date;
  serviceTime: number;
  waitTime: number;
  deliveryQuantity: number;
  pickupQuantity: number;
  sequenceNumber: number;
}

export interface OptimizationVehicle {
  vehicleId: string;
  vehicleType: string;
  capacity: VehicleCapacity;
  operatingHours: TimeWindow;
  startLocation: Location;
  endLocation: Location;
  costProfile: VehicleCostProfile;
  capabilities: string[];
}

// ================================
// FREIGHT MANAGEMENT TYPES
// ================================

export interface FreightShipment {
  shipmentId: string;
  shipmentNumber: string;
  shipmentType: 'LTL' | 'FTL' | 'PARCEL' | 'INTERMODAL' | 'AIR' | 'OCEAN';
  status: FreightShipmentStatus;
  
  // Shipment details
  commodities: FreightCommodity[];
  totalWeight: number;
  totalValue: number;
  pieces: number;
  
  // Locations and timing
  originLocation: Location;
  destinationLocation: Location;
  pickupDate: Date;
  deliveryDate: Date;
  transitTime: number;
  
  // Service requirements
  serviceRequirements: FreightServiceRequirement[];
  equipmentRequirements: EquipmentRequirement[];
  
  // Carrier and rates
  assignedCarrier: LogisticsProvider;
  rateQuotes: FreightRateQuote[];
  selectedRate?: FreightRateQuote;
  
  // Documentation
  billOfLading: BillOfLading;
  freightBill: FreightBill;
  proNumber: string;
  
  // Tracking and events
  trackingEvents: TrackingEvent[];
  milestones: ShipmentMilestone[];
  
  // Financial
  charges: FreightCharge[];
  totalCost: number;
  paymentTerms: PaymentTerms;
  
  createdDate: Date;
  lastUpdated: Date;
}

export type FreightShipmentStatus = 
  | 'QUOTE'
  | 'BOOKED'
  | 'DISPATCHED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'EXCEPTION'
  | 'INVOICED';

export interface FreightCommodity {
  commodityId: string;
  description: string;
  nmfcClass?: string;
  weight: number;
  pieces: number;
  value: number;
  dimensions: Dimensions;
  hazmat: boolean;
  packagingType: string;
  density: number;
}

export interface FreightRateQuote {
  quoteId: string;
  carrierId: string;
  carrierName: string;
  serviceType: string;
  transitTime: number;
  totalCost: number;
  charges: FreightCharge[];
  validUntil: Date;
  terms: string;
  quote_confidence: number;
}

// ================================
// LOGISTICS ANALYTICS TYPES
// ================================

export interface LogisticsKPI {
  kpiId: string;
  kpiName: string;
  kpiCategory: 'COST' | 'SERVICE' | 'EFFICIENCY' | 'QUALITY' | 'SUSTAINABILITY';
  description: string;
  
  // Measurement details
  currentValue: number;
  targetValue: number;
  unit: string;
  trend: 'IMPROVING' | 'DECLINING' | 'STABLE';
  
  // Time series data
  historicalData: KPIDataPoint[];
  benchmarkData: BenchmarkData[];
  
  // Configuration
  calculationMethod: string;
  updateFrequency: 'REAL_TIME' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  dataSource: string;
  
  // Alerting
  alertThresholds: AlertThreshold[];
  
  lastCalculated: Date;
  lastUpdated: Date;
}

export interface LogisticsReport {
  reportId: string;
  reportName: string;
  reportType: 'OPERATIONAL' | 'FINANCIAL' | 'PERFORMANCE' | 'COMPLIANCE' | 'EXCEPTION';
  reportCategory: string;
  
  // Report configuration
  parameters: ReportParameter[];
  filters: ReportFilter[];
  dateRange: DateRange;
  
  // Data and visualization
  datasets: ReportDataset[];
  visualizations: ReportVisualization[];
  
  // Scheduling and distribution
  schedule: ReportSchedule;
  distributionList: ReportRecipient[];
  
  // Generated reports
  reportInstances: ReportInstance[];
  
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  createdBy: string;
  createdDate: Date;
  lastUpdated: Date;
}

export interface LogisticsDashboard {
  dashboardId: string;
  dashboardName: string;
  dashboardType: 'EXECUTIVE' | 'OPERATIONAL' | 'TACTICAL' | 'STRATEGIC';
  
  // Layout and widgets
  layout: DashboardLayout;
  widgets: DashboardWidget[];
  
  // Data refresh
  refreshSettings: RefreshSettings;
  lastRefreshed: Date;
  
  // Access control
  accessLevel: 'PUBLIC' | 'RESTRICTED' | 'PRIVATE';
  authorizedUsers: string[];
  authorizedRoles: string[];
  
  createdBy: string;
  createdDate: Date;
  lastUpdated: Date;
}

// ================================
// SUPPORTING TYPES
// ================================

export interface Location {
  locationId?: string;
  name?: string;
  address: Address;
  coordinates?: GeoCoordinate;
  type: 'CUSTOMER' | 'WAREHOUSE' | 'DISTRIBUTION_CENTER' | 'HUB' | 'DEPOT';
  timeZone: string;
  operatingHours?: OperatingHours;
  contactInfo?: ContactInfo;
  constraints?: LocationConstraint[];
}

export interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  county?: string;
}

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface ContactInfo {
  contactName?: string;
  phone?: string;
  email?: string;
  alternatePhone?: string;
  emergencyContact?: string;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: 'IN' | 'CM' | 'FT' | 'M';
}

export interface TimeWindow {
  startTime: string; // HH:MM format
  endTime: string;   // HH:MM format
  dayOfWeek?: string[];
  timeZone: string;
}

export interface OperatingHours {
  monday?: TimeWindow;
  tuesday?: TimeWindow;
  wednesday?: TimeWindow;
  thursday?: TimeWindow;
  friday?: TimeWindow;
  saturday?: TimeWindow;
  sunday?: TimeWindow;
  holidays?: HolidaySchedule[];
}

export interface CostStructure {
  baseRate: number;
  rateType: 'PER_MILE' | 'PER_HOUR' | 'PER_UNIT' | 'FLAT_RATE' | 'PERCENTAGE';
  additionalCharges: AdditionalCharge[];
  discounts: Discount[];
  fuelSurcharge?: FuelSurcharge;
}

export interface ServiceType {
  serviceId: string;
  serviceName: string;
  serviceCode: string;
  category: 'STANDARD' | 'EXPRESS' | 'ECONOMY' | 'PREMIUM';
  deliveryCommitment: string;
  guaranteedService: boolean;
}

export interface DeliveryRequirements {
  signatureRequired: boolean;
  appointmentRequired: boolean;
  insideDelivery: boolean;
  liftgateRequired: boolean;
  residentialDelivery: boolean;
  deliveryNotification: boolean;
  specialInstructions: string;
}

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'EMERGENCY';

// Additional supporting interfaces would be defined here...
// This represents a comprehensive type system for Oracle EBS competitive logistics management

export interface BillingDetails {
  billToAccount: string;
  paymentTerms: PaymentTerms;
  currency: string;
  taxInfo: TaxInfo;
}

export interface PaymentTerms {
  net: number; // Net payment days
  discountPercent?: number;
  discountDays?: number;
  lateFeePenalty?: number;
}

export interface TaxInfo {
  taxExempt: boolean;
  taxId?: string;
  taxRate: number;
  taxType: string;
}

export interface StatusHistory {
  status: string;
  timestamp: Date;
  location?: Location;
  updatedBy: string;
  notes?: string;
}

export interface Document {
  documentId: string;
  documentType: string;
  documentName: string;
  required: boolean;
  url?: string;
  uploadedDate?: Date;
}

export interface CustomsInfo {
  customsValue: number;
  currency: string;
  dutyRate: number;
  harmonizedCode: string;
  countryOfOrigin: string;
  customsBroker?: string;
}

export interface HazmatInfo {
  hazmatClass: string;
  unNumber: string;
  properShippingName: string;
  packingGroup: string;
  emergencyContact: string;
}

// Additional supporting interfaces and types
export interface AdditionalCharge {
  chargeType: string;
  description: string;
  amount: number;
  percentage?: number;
}

export interface Discount {
  discountType: string;
  description: string;
  amount?: number;
  percentage?: number;
}

export interface FuelSurcharge {
  surchargeType: string;
  rate: number;
  calculation: string;
}

export interface LocationConstraint {
  constraintType: string;
  description: string;
  parameters: Record<string, any>;
}

export interface HolidaySchedule {
  holidayName: string;
  holidayDate: Date;
  operatingHours?: TimeWindow;
}

export interface TrackingEvent {
  eventId: string;
  eventType: string;
  timestamp: Date;
  location?: string;
  description: string;
}

export interface ShipmentMilestone {
  milestoneId: string;
  milestoneType: string;
  scheduledTime: Date;
  actualTime?: Date;
  status: string;
}

export interface FreightCharge {
  chargeType: string;
  description: string;
  amount: number;
}

export interface KPIDataPoint {
  timestamp: Date;
  value: number;
  context?: Record<string, any>;
}

export interface BenchmarkData {
  benchmarkSource: string;
  benchmarkValue: number;
  benchmarkDate: Date;
}

export interface AlertThreshold {
  thresholdType: 'WARNING' | 'CRITICAL';
  operator: '>' | '<' | '=' | '>=' | '<=';
  value: number;
  action: string;
}

export interface ReportParameter {
  parameterId: string;
  parameterName: string;
  parameterType: string;
  defaultValue?: any;
  required: boolean;
}

export interface ReportFilter {
  filterId: string;
  filterName: string;
  filterType: string;
  filterValue: any;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface ReportDataset {
  datasetId: string;
  datasetName: string;
  dataSource: string;
  query: string;
}

export interface ReportVisualization {
  visualizationId: string;
  visualizationType: string;
  configuration: Record<string, any>;
}

export interface ReportSchedule {
  scheduleId: string;
  frequency: string;
  nextRun: Date;
  recipients: string[];
}

export interface ReportRecipient {
  recipientId: string;
  recipientType: string;
  address: string;
}

export interface ReportInstance {
  instanceId: string;
  generatedDate: Date;
  status: string;
  fileUrl?: string;
}

export interface DashboardLayout {
  layoutId: string;
  layoutType: string;
  configuration: Record<string, any>;
}

export interface DashboardWidget {
  widgetId: string;
  widgetType: string;
  title: string;
  configuration: Record<string, any>;
  position: { x: number; y: number; width: number; height: number };
}

export interface RefreshSettings {
  autoRefresh: boolean;
  refreshInterval: number;
  lastRefresh: Date;
}

// Additional types for route optimization
export interface OptimizationParameters {
  maxIterations: number;
  convergenceThreshold: number;
  timeLimit: number;
  includeTrafficData?: boolean;
  considerRealTimeEvents?: boolean;
  populationSize?: number;
  coolingRate?: number;
  tabuTenure?: number;
  pheromoneEvaporation?: number;
}

export interface OptimizationMetrics {
  solutionTime: number;
  iterationsPerformed: number;
  improvementPercent: number;
  convergenceAchieved: boolean;
  qualityScore: number;
}

export interface VehicleCapacity {
  weight: number;
  volume: number;
  pallets?: number;
  pieces?: number;
}

export interface VehicleCostProfile {
  fixedCost: number;
  variableCostPerMile: number;
  variableCostPerHour: number;
  fuelCostPerMile: number;
}

export interface OptimizationObjective {
  objectiveType: string;
  weight: number;
  priority: number;
  target?: string;
}

export interface OptimizationConstraint {
  constraintType: string;
  description: string;
  parameters: Record<string, any>;
}

export interface OptimizationStop {
  stopId: string;
  location: Location;
  serviceTime: number;
  timeWindow?: TimeWindow;
  deliveryQuantity?: number;
  pickupQuantity?: number;
  priority?: number;
  specialRequirements?: string[];
}

// Additional types for warehouse management
export interface WarehouseCapability {
  capabilityType: string;
  description: string;
  capacity: number;
  available: boolean;
}

export interface ShiftPattern {
  shiftId: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  staffCount: number;
}

export interface SkillMatrix {
  workerId: string;
  skills: string[];
  certifications: string[];
  proficiencyLevel: number;
}

export interface DockAssignment {
  assignmentId: string;
  vehicleId: string;
  driverId?: string;
  arrivalTime: Date;
  departureTime?: Date;
  operationType: string;
}

export interface DockSchedule {
  scheduleId: string;
  timeSlot: TimeWindow;
  reserved: boolean;
  assignmentId?: string;
}

export interface WaveRule {
  ruleId: string;
  ruleName: string;
  ruleType: string;
  conditions: any[];
  actions: any[];
  priority: number;
  active: boolean;
}

export interface SortationCriteria {
  criteriaId: string;
  criteriaType: string;
  priority: number;
  configuration: Record<string, any>;
}

export interface AllocationRule {
  ruleId: string;
  ruleName: string;
  ruleType: string;
  conditions: any[];
  priority: number;
  active: boolean;
}

export interface WorkerAssignment {
  assignmentId: string;
  workerId: string;
  workerName: string;
  shiftId: string;
  assignedZones: string[];
  expectedProductivity: number;
}

export interface EquipmentAssignment {
  assignmentId: string;
  equipmentId: string;
  equipmentType: string;
  assignedWorker?: string;
  assignedZone?: string;
}

export interface SlottingObjective {
  objectiveType: string;
  weight: number;
  priority: number;
  description: string;
}

export interface SlottingConstraint {
  constraintType: string;
  description: string;
  parameters: Record<string, any>;
}

export interface CubingRule {
  ruleType: string;
  description: string;
  criteria: Record<string, any>;
}

export interface ItemSlot {
  itemId: string;
  locationId: string;
  slottingScore: number;
  velocity: number;
  pickFrequency: number;
}

export interface SlottingImpact {
  travelTimeReduction: number;
  pickingEfficiencyImprovement: number;
  spaceUtilizationImprovement: number;
  estimatedSavings: number;
}

export interface SlottingImplementationPlan {
  phases: ImplementationPhase[];
  estimatedDuration: number;
  resourceRequirements: Resource[];
}

export interface ImplementationPhase {
  phaseId: string;
  phaseName: string;
  duration: number;
  deliverables: string[];
  dependencies: string[];
}

export interface Resource {
  resourceId: string;
  resourceType: string;
  quantity: number;
  availability: string;
}

export interface CountFrequency {
  frequencyType: string;
  interval: number;
}

export interface CountTolerance {
  percentageTolerance: number;
  valueTolerance: number;
  unitTolerance: number;
}

export interface ItemToCount {
  itemId: string;
  locationId: string;
  expectedQuantity: number;
  countPriority: number;
}

export interface CounterAssignment {
  assignmentId: string;
  counterId: string;
  counterName: string;
  assignedItems: string[];
  expectedDuration: number;
}

export interface CountResult {
  countId: string;
  itemId: string;
  locationId: string;
  countedQuantity: number;
  countedBy: string;
  countedDate: Date;
}

export interface CountDiscrepancy {
  discrepancyId: string;
  itemId: string;
  locationId: string;
  expectedQuantity: number;
  countedQuantity: number;
  variance: number;
  variancePercent: number;
}

export interface InventoryAdjustment {
  adjustmentId: string;
  itemId: string;
  locationId: string;
  adjustmentQuantity: number;
  adjustmentReason: string;
  adjustmentDate: Date;
  approvedBy?: string;
}

export interface CountVariance {
  varianceType: string;
  totalVariance: number;
  varianceCount: number;
  averageVariance: number;
}

// Additional types for distribution management
export interface StrategyObjective {
  objectiveType: string;
  weight: number;
  target: string;
  priority: number;
}

export interface StrategyConstraint {
  constraintType: string;
  description: string;
  parameters: Record<string, any>;
}

export interface ServiceRequirement {
  requirementType: string;
  description: string;
  specification: string;
}

export interface NetworkTopology {
  topologyType: string;
  numberOfLayers: number;
  hubLocations?: Location[];
  spokeConnections?: any[];
  currentState?: any;
}

export interface FacilityRole {
  facilityId: string;
  roleType: string;
  capabilities: string[];
  capacity: number;
}

export interface InventoryPolicy {
  policyId: string;
  policyType: string;
  parameters: Record<string, any>;
  applicability: string[];
}

export interface PerformanceTarget {
  targetId: string;
  metricName: string;
  targetValue: number;
  timeframe: string;
}

export interface CostTarget {
  targetId: string;
  costCategory: string;
  targetAmount: number;
  timeframe: string;
}

export interface ServiceTarget {
  targetId: string;
  serviceMetric: string;
  targetLevel: number;
  timeframe: string;
}

export interface ImplementationPlan {
  phases: ImplementationPhase[];
  timeline: TimelineItem[];
  resources: Resource[];
  risks?: Risk[];
}

export interface TimelineItem {
  itemId: string;
  itemName: string;
  startDate: Date;
  endDate: Date;
  dependencies: string[];
}

export interface Risk {
  riskId: string;
  riskType: string;
  severity: string;
  probability: number;
  impact: string;
  mitigation: string;
}

export interface RiskAssessment {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  identifiedRisks: Risk[];
  mitigationPlans?: string[];
}

export interface NetworkAnalysis {
  totalFacilities: number;
  totalCapacity: number;
  geographicCoverage: number;
  averageUtilization: number;
  performanceMetrics: any;
}

export interface NetworkDesign {
  networkId: string;
  facilities: any[];
  routes: any[];
  capacities: any[];
  totalCost: number;
  serviceLevel: number;
  implementationComplexity: number;
}

export interface OptimizationScenario {
  scenarioId: string;
  scenarioName: string;
  scenarioType: string;
  parameters?: Record<string, any>;
}

export interface NetworkImpactAnalysis {
  costImpact: number;
  serviceImpact: number;
  riskImpact: number;
  implementationComplexity: number;
}

export interface InvestmentAnalysis {
  totalInvestment: number;
  paybackPeriod: number;
  netPresentValue: number;
  internalRateOfReturn: number;
}

export interface CostBenefitAnalysis {
  totalCosts: number;
  totalBenefits: number;
  benefitCostRatio: number;
  breakEvenPoint: number;
}

export interface GeographicScope {
  scopeType: string;
  regions: string[];
  countries: string[];
  exclusions: string[];
}

export interface ProductScope {
  productCategory: string;
  productLines: string[];
  exclusions: string[];
}

export interface ChannelScope {
  channelType: string;
  channelName: string;
  priority: number;
}

export interface FulfillmentRule {
  ruleId: string;
  ruleName: string;
  ruleType: string;
  conditions: RuleCondition[];
  actions: RuleAction[];
  priority: number;
  active: boolean;
}

export interface RuleCondition {
  field: string;
  operator: string;
  value?: any;
}

export interface RuleAction {
  action: string;
  parameters?: Record<string, any>;
}

export interface PriorityRule {
  ruleId: string;
  ruleName: string;
  conditions: RuleCondition[];
  priority: number;
  active: boolean;
}

export interface CapacityPlan {
  totalCapacity: number;
  allocatedCapacity: number;
  availableCapacity: number;
  capacityByFacility: FacilityCapacity[];
  bottlenecks: Bottleneck[];
}

export interface FacilityCapacity {
  facilityId: string;
  capacity: number;
  utilization: number;
  available: number;
}

export interface Bottleneck {
  bottleneckId: string;
  location: string;
  constraintType: string;
  impact: number;
  recommendation: string;
}

export interface ResourcePlan {
  totalResources: number;
  resourceByType: ResourceByType[];
  resourceByFacility: ResourceByFacility[];
  resourceGaps: ResourceGap[];
}

export interface ResourceByType {
  resourceType: string;
  totalQuantity: number;
  allocatedQuantity: number;
  availableQuantity: number;
}

export interface ResourceByFacility {
  facilityId: string;
  resources: ResourceAllocation[];
}

export interface ResourceAllocation {
  resourceType: string;
  quantity: number;
  utilization: number;
}

export interface ResourceGap {
  resourceType: string;
  facilityId?: string;
  gapQuantity: number;
  gapReason: string;
}

export interface PerformanceProjection {
  metricName: string;
  currentValue: number;
  projectedValue: number;
  improvementPercent: number;
  timeframe: string;
}

export interface CostProjection {
  costCategory: string;
  currentCost: number;
  projectedCost: number;
  variancePercent: number;
  timeframe: string;
}

export interface TrackingPoint {
  pointId: string;
  pointName: string;
  pointType: string;
  trackingType: string;
  dataCapture: string[];
}

export interface MonitoredMetric {
  metricId: string;
  metricName: string;
  metricType: string;
  calculationMethod: string;
  updateFrequency: string;
  threshold: {
    warning: number;
    critical: number;
  };
}

export interface AlertRule {
  ruleId: string;
  ruleName: string;
  ruleType: string;
  conditions: RuleCondition[];
  severity: string;
  actions: string[];
  active: boolean;
}

export interface SupplyChainStatus {
  overallHealth: string;
  totalShipments: number;
  onTimeDeliveryRate: number;
  averageInventoryLevel: number;
  activeExceptions: number;
  lastUpdated: Date;
}

export interface ActiveShipment {
  shipmentId: string;
  status: string;
  currentLocation: string;
  estimatedDelivery: Date;
  onTime: boolean;
}

export interface InventoryLevel {
  facilityId: string;
  itemId: string;
  currentLevel: number;
  targetLevel: number;
  status: string;
}

export interface CapacityUtilization {
  facilityId: string;
  utilizationType: string;
  currentUtilization: number;
  targetUtilization: number;
  status: string;
}

export interface PerformanceInsight {
  insightId: string;
  insightType: string;
  description: string;
  impact: string;
  recommendation: string;
  priority: number;
}

export interface ExceptionAlert {
  alertId: string;
  alertType: string;
  severity: string;
  description: string;
  affectedEntities: string[];
  timestamp: Date;
  status: string;
}

export interface PredictiveAlert {
  alertId: string;
  alertType: string;
  predictedEvent: string;
  probability: number;
  timeframe: string;
  recommendation: string;
}

export interface DashboardConfig {
  dashboardType: string;
  widgets: string[];
  refreshInterval: number;
}

export interface ReportingSchedule {
  dailyReports: string[];
  weeklyReports: string[];
  monthlyReports: string[];
  adhocReports: string[];
}

export interface SLAMetric {
  metricId: string;
  metricName: string;
  targetValue: number;
  unit: string;
  measurementFrequency: string;
}

export interface PricingTier {
  tierId: string;
  tierName: string;
  minVolume: number;
  maxVolume?: number;
  rate: number;
  discountPercent?: number;
}

export interface Equipment {
  equipmentId: string;
  equipmentType: string;
  make: string;
  model: string;
  capacity: number;
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'OUT_OF_SERVICE';
  currentLocation?: string;
  operatingHours?: number;
}

export interface QualityRequirement {
  requirementId: string;
  requirementType: string;
  description: string;
  mandatory: boolean;
  specification: string;
}

export interface SafetyRequirement {
  requirementId: string;
  requirementType: string;
  description: string;
  mandatory: boolean;
  specification: string;
}

export interface StorageRequirement {
  requirementType: string;
  description: string;
  parameters: Record<string, any>;
}

export interface ServiceArea {
  areaId: string;
  areaName: string;
  geographicBounds: any;
  serviceLevel: string;
  coverage: number;
}

export interface NetworkPerformanceMetrics {
  totalThroughput: number;
  averageTransitTime: number;
  onTimeDeliveryRate: number;
  networkUtilization: number;
  costPerUnit: number;
}

export interface NetworkCostMetrics {
  totalNetworkCost: number;
  costPerOrder: number;
  costPerMile: number;
  costPerPound: number;
  transportationCost: number;
  warehouseCost: number;
  handlingCost: number;
}

export interface OperatingRule {
  ruleId: string;
  ruleName: string;
  ruleType: string;
  conditions: any[];
  actions: any[];
  priority: number;
}

export interface FlowPolicy {
  policyId: string;
  policyName: string;
  policyType: string;
  rules: any[];
  applicability: string[];
}

export interface StaffingPlan {
  totalStaff: number;
  staffByShift: any[];
  staffBySkill: any[];
  staffByDepartment: any[];
}

export interface ServiceFrequency {
  frequency: number;
  unit: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  pattern: string;
}

export interface ServiceLevel {
  levelId: string;
  levelName: string;
  description: string;
  commitments: any[];
}

export interface RouteCapacity {
  weightCapacity: number;
  volumeCapacity: number;
  unitCapacity: number;
  utilizationRate: number;
}

export interface RouteCostStructure {
  fixedCost: number;
  variableCost: number;
  costPerMile: number;
  costPerHour: number;
  fuelCost: number;
}

export interface RoutePerformanceMetrics {
  averageSpeed: number;
  fuelEfficiency: number;
  onTimePerformance: number;
  costPerMile: number;
  utilizationRate: number;
}

export interface FreightServiceRequirement {
  requirementId: string;
  serviceType: string;
  description: string;
  mandatory: boolean;
}

export interface EquipmentRequirement {
  equipmentType: string;
  quantity: number;
  specifications: Record<string, any>;
  mandatory: boolean;
}

export interface BillOfLading {
  bolNumber: string;
  issueDate: Date;
  shipper: string;
  consignee: string;
  description: string;
  weight: number;
  pieces: number;
}

export interface FreightBill {
  billNumber: string;
  billDate: Date;
  amount: number;
  dueDate: Date;
  status: 'PENDING' | 'PAID' | 'DISPUTED';
}

// Additional missing types from route optimization
export interface ConstraintViolation {
  constraintType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  affectedEntity: string;
}

export interface SolutionMetrics {
  totalDistance: number;
  totalTime: number;
  totalCost: number;
  vehiclesUsed: number;
  averageUtilization: number;
  solutionQuality: number;
}

export interface OptimizationIteration {
  iteration: number;
  bestSolution: any;
  improvementPercent: number;
  timestamp: Date;
}

export interface ContainerOption {
  containerType: string;
  dimensions: Dimensions;
  capacity: VehicleCapacity;
  cost: number;
  available: number;
}

export interface LoadedContainer {
  containerId: string;
  containerType: string;
  capacity: VehicleCapacity;
  usedWeight: number;
  usedVolume: number;
  items: any[];
  loadingOrder: number;
}

export interface LoadingInstruction {
  instructionId: string;
  containerId: string;
  sequence: number;
  description: string;
  safety: string[];
}

export interface LoadObjective {
  objectiveType: string;
  weight: number;
  priority: number;
}

// Additional missing transportation types
export interface DiversificationRule {
  ruleId: string;
  ruleType: string;
  parameters: Record<string, any>;
}

export interface ContractTerms {
  contractLength: number;
  renewalOptions: number;
  terminationClause: string;
  performancePenalties: boolean;
}

export interface EvaluationCriteria {
  criterion: string;
  weight: number;
  type: 'QUANTITATIVE' | 'QUALITATIVE';
}

export interface LaneRate {
  laneId: string;
  origin: string;
  destination: string;
  rate: number;
  transitTime: number;
  minimumWeight?: number;
}

export interface AccessorialCharge {
  chargeType: string;
  description: string;
  rate: number;
  unit: string;
}

export interface DiscountStructure {
  volumeDiscounts: any[];
  loyaltyDiscounts: any[];
  seasonalDiscounts: any[];
}

export interface ServiceCommitment {
  commitmentType: string;
  description: string;
  value: any;
  penalty?: string;
}

export interface PerformanceGuarantee {
  metricName: string;
  guaranteedValue: number;
  penalty: string;
  measurement: string;
}

export interface EquipmentAvailability {
  equipmentType: string;
  totalUnits: number;
  availableUnits: number;
  utilizationRate: number;
}

export interface GeographicCoverage {
  regions: string[];
  states: string[];
  zipcodes: string[];
  exclusions: string[];
}

export interface ProposedContractTerms {
  contractLength: number;
  paymentTerms: PaymentTerms;
  serviceCommitments: ServiceCommitment[];
  penaltyClause: string;
}

export interface CarrierImplementationPlan {
  phases: any[];
  timeline: number;
  resources: any[];
  training: string[];
}

export interface CarrierEvaluationResult {
  carrierId: string;
  carrierName: string;
  totalScore: number;
  criteriaScores: CriteriaScore[];
  ranking: number;
  strengths: string[];
  weaknesses: string[];
  recommendation: 'AWARD' | 'CONSIDER' | 'REJECT';
}

export interface CriteriaScore {
  criterion: string;
  rawScore: number;
  weightedScore: number;
  weight: number;
}

export interface CarrierAwardRecommendation {
  carrierId: string;
  carrierName: string;
  awardType: 'PRIMARY' | 'BACKUP' | 'CONDITIONAL';
  rationale: string;
  conditions?: string[];
}

// This comprehensive type system provides the foundation for a complete
// Oracle EBS competitive logistics management system