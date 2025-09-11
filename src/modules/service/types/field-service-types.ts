/**
 * Field Service Management Types
 * Comprehensive Oracle EBS competitive field service types and interfaces
 */

// ================================
// CORE ENUMS
// ================================

export enum TechnicianStatus {
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  ON_CALL = 'ON_CALL',
  OFF_DUTY = 'OFF_DUTY',
  IN_TRANSIT = 'IN_TRANSIT',
  ON_BREAK = 'ON_BREAK',
  EMERGENCY = 'EMERGENCY',
}

export enum ServiceType {
  INSTALLATION = 'INSTALLATION',
  MAINTENANCE = 'MAINTENANCE',
  REPAIR = 'REPAIR',
  INSPECTION = 'INSPECTION',
  CALIBRATION = 'CALIBRATION',
  EMERGENCY = 'EMERGENCY',
  PREVENTIVE = 'PREVENTIVE',
  CORRECTIVE = 'CORRECTIVE',
}

export enum WorkOrderStatus {
  SCHEDULED = 'SCHEDULED',
  DISPATCHED = 'DISPATCHED',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  POSTPONED = 'POSTPONED',
  REQUIRES_APPROVAL = 'REQUIRES_APPROVAL',
}

export enum SkillLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
  MASTER = 'MASTER',
}

export enum Priority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  CRITICAL = 'CRITICAL',
  EMERGENCY = 'EMERGENCY',
}

// ================================
// TECHNICIAN MANAGEMENT
// ================================

export interface Technician {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  status: TechnicianStatus;
  location: GeoLocation;
  homeBase: ServiceLocation;
  serviceArea: ServiceArea;
  skills: TechnicianSkill[];
  certifications: Certification[];
  tools: Tool[];
  vehicle?: ServiceVehicle;
  schedule: WorkSchedule;
  performance: TechnicianPerformance;
  availability: AvailabilityWindow[];
  preferredWorkTypes: ServiceType[];
  languagesSpoken: string[];
  emergencyContact: EmergencyContact;
  hireDate: Date;
  createdDate: Date;
  lastUpdated: Date;
}

export interface TechnicianSkill {
  skillId: string;
  skillName: string;
  category: string;
  level: SkillLevel;
  certificationRequired: boolean;
  lastAssessed: Date;
  assessmentScore: number;
  validUntil?: Date;
  certifyingBody?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  certificationNumber: string;
  issueDate: Date;
  expirationDate?: Date;
  renewalRequired: boolean;
  renewalPeriod?: number; // months
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING_RENEWAL' | 'SUSPENDED';
  attachments: string[];
}

export interface Tool {
  id: string;
  name: string;
  type: string;
  serialNumber: string;
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'OUT_OF_SERVICE';
  lastCalibratedDate?: Date;
  nextCalibrationDate?: Date;
  assignedDate: Date;
  returnDate?: Date;
}

export interface ServiceVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  fuelType: 'GASOLINE' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
  capacity: VehicleCapacity;
  gpsTracker?: GPSDevice;
  maintenanceSchedule: MaintenanceSchedule;
  currentMileage: number;
  lastServiceDate?: Date;
  nextServiceDate?: Date;
}

export interface VehicleCapacity {
  maxWeight: number;
  weightUnit: 'LBS' | 'KG';
  storageVolume: number;
  volumeUnit: 'CUBIC_FEET' | 'CUBIC_METERS';
  passengerCapacity: number;
}

export interface GPSDevice {
  deviceId: string;
  imei: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  lastUpdate: Date;
  batteryLevel?: number;
}

// ================================
// SCHEDULING & OPTIMIZATION
// ================================

export interface WorkSchedule {
  id: string;
  technicianId: string;
  scheduleType: 'REGULAR' | 'OVERTIME' | 'ON_CALL' | 'FLEXIBLE';
  startDate: Date;
  endDate?: Date;
  workingHours: WorkingHours[];
  timeZone: string;
  maxHoursPerDay: number;
  maxHoursPerWeek: number;
  breakDuration: number; // minutes
  lunchDuration: number; // minutes
  overtimeEligible: boolean;
}

export interface WorkingHours {
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isWorkingDay: boolean;
}

export interface AvailabilityWindow {
  id: string;
  technicianId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  availabilityType: 'AVAILABLE' | 'BUSY' | 'TENTATIVE' | 'OUT_OF_OFFICE' | 'TRAINING';
  reason?: string;
  workOrderId?: string;
  location?: GeoLocation;
}

export interface SchedulingConstraint {
  constraintId: string;
  type: 'SKILL_REQUIREMENT' | 'LOCATION' | 'TIME_WINDOW' | 'RESOURCE' | 'PRIORITY' | 'SLA';
  description: string;
  weight: number; // 1-10, higher = more important
  isMandatory: boolean;
  parameters: Record<string, any>;
}

export interface SchedulingOptimization {
  optimizationId: string;
  requestDate: Date;
  parameters: OptimizationParameters;
  results: OptimizationResult;
  processingTime: number; // milliseconds
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
}

export interface OptimizationParameters {
  dateRange: DateRange;
  objectives: OptimizationObjective[];
  constraints: SchedulingConstraint[];
  technicianIds?: string[];
  serviceAreaIds?: string[];
  workOrderIds?: string[];
  includeTravel: boolean;
  maxIterations?: number;
}

export interface OptimizationObjective {
  type:
    | 'MINIMIZE_TRAVEL'
    | 'MAXIMIZE_UTILIZATION'
    | 'MINIMIZE_OVERTIME'
    | 'MAXIMIZE_SLA_COMPLIANCE'
    | 'BALANCE_WORKLOAD';
  weight: number; // 0-1, sum of all weights should be 1
  priority: number; // 1-10
}

export interface OptimizationResult {
  totalScore: number;
  assignments: TechnicianAssignment[];
  unassignedWorkOrders: string[];
  metrics: OptimizationMetrics;
  recommendations: string[];
  alternativeScenarios?: AlternativeScenario[];
}

export interface TechnicianAssignment {
  technicianId: string;
  workOrderIds: string[];
  scheduledRoute: RouteSegment[];
  totalTravelTime: number; // minutes
  totalServiceTime: number; // minutes
  utilizationRate: number; // percentage
  overtimeRequired: boolean;
  estimatedCompletionTime: Date;
}

export interface RouteSegment {
  sequenceNumber: number;
  type: 'WORK_ORDER' | 'TRAVEL' | 'BREAK' | 'LUNCH' | 'DEPOT_RETURN';
  workOrderId?: string;
  location: GeoLocation;
  startTime: Date;
  endTime: Date;
  travelDistance?: number; // miles or km
  travelTime?: number; // minutes
}

// ================================
// COMMON TYPES
// ================================

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number; // meters
  altitude?: number; // meters
  timestamp: Date;
  address?: Address;
  geofenceIds?: string[];
}

export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  formattedAddress?: string;
}

export interface ServiceLocation {
  id: string;
  name: string;
  type: 'DEPOT' | 'WAREHOUSE' | 'OFFICE' | 'CUSTOMER_SITE' | 'STORAGE';
  address: Address;
  location: GeoLocation;
  contactInfo: ContactInfo;
  operatingHours: OperatingHours;
  facilities: Facility[];
}

export interface ServiceArea {
  id: string;
  name: string;
  description: string;
  boundaries: GeoCoordinate[];
  zipCodes: string[];
  coverageRadius?: number; // miles or km
  isActive: boolean;
  assignedTechnicians: string[];
  travelTimes: TravelTimeMatrix;
}

export interface TravelTimeMatrix {
  [fromLocationId: string]: {
    [toLocationId: string]: {
      distance: number; // miles or km
      duration: number; // minutes
      lastUpdated: Date;
    };
  };
}

export interface ContactInfo {
  primaryPhone: string;
  secondaryPhone?: string;
  email?: string;
  website?: string;
  contactPerson?: string;
}

export interface OperatingHours {
  timezone: string;
  schedule: DailyHours[];
  holidays: string[];
  specialHours: SpecialHours[];
}

export interface DailyHours {
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  isOpen: boolean;
  openTime?: string; // HH:MM
  closeTime?: string; // HH:MM
  breaks?: BreakPeriod[];
}

export interface BreakPeriod {
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  description: string;
}

export interface SpecialHours {
  date: Date;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
  reason: string;
}

export interface Facility {
  type: 'PARTS_STORAGE' | 'VEHICLE_PARKING' | 'TOOLS_STORAGE' | 'OFFICE' | 'TRAINING_ROOM';
  capacity: number;
  isAvailable: boolean;
  lastUpdated: Date;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  address?: Address;
}

export interface MaintenanceSchedule {
  vehicleId: string;
  intervals: MaintenanceInterval[];
  nextService: Date;
  lastService?: Date;
  overdue: boolean;
}

export interface MaintenanceInterval {
  type: 'OIL_CHANGE' | 'TIRE_ROTATION' | 'INSPECTION' | 'BRAKE_SERVICE' | 'TRANSMISSION' | 'ANNUAL';
  intervalMiles?: number;
  intervalMonths?: number;
  lastPerformed?: Date;
  nextDue?: Date;
  cost?: number;
}

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
}

export interface TechnicianPerformance {
  technicianId: string;
  period: DateRange;
  metrics: PerformanceMetrics;
  kpis: PerformanceKPI[];
  trends: PerformanceTrend[];
  goals: PerformanceGoal[];
  lastUpdated: Date;
}

export interface PerformanceMetrics {
  totalWorkOrders: number;
  completedWorkOrders: number;
  cancelledWorkOrders: number;
  avgResponseTime: number; // minutes
  avgCompletionTime: number; // minutes
  firstCallResolution: number; // percentage
  customerSatisfaction: number; // 1-5 scale
  utilizationRate: number; // percentage
  overtimeHours: number;
  milesDriven: number;
  revenueGenerated: number;
  costsIncurred: number;
  profitMargin: number; // percentage
}

export interface PerformanceKPI {
  kpiId: string;
  name: string;
  category: 'EFFICIENCY' | 'QUALITY' | 'CUSTOMER_SERVICE' | 'FINANCIAL';
  currentValue: number;
  targetValue: number;
  unit: string;
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  lastMeasured: Date;
}

export interface PerformanceTrend {
  metric: string;
  values: TrendPoint[];
  trendDirection: 'UP' | 'DOWN' | 'STABLE';
  changePercent: number;
}

export interface TrendPoint {
  date: Date;
  value: number;
}

export interface PerformanceGoal {
  goalId: string;
  name: string;
  description: string;
  metric: string;
  targetValue: number;
  currentValue: number;
  deadline: Date;
  status: 'ON_TRACK' | 'AT_RISK' | 'BEHIND' | 'ACHIEVED';
  weight: number; // importance 1-10
}

export interface OptimizationMetrics {
  totalDistance: number;
  totalTravelTime: number;
  avgUtilizationRate: number;
  slaComplianceRate: number;
  totalOvertimeHours: number;
  costEfficiency: number;
  customerSatisfactionPrediction: number;
}

export interface AlternativeScenario {
  scenarioId: string;
  name: string;
  description: string;
  score: number;
  tradeoffs: string[];
  assignments: TechnicianAssignment[];
}
