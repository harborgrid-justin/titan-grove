/**
 * Yard Management Types
 * Comprehensive types for Oracle Yard Management competitive implementation
 */

// ================================
// CORE YARD MANAGEMENT TYPES
// ================================

export interface YardFacility {
  facilityId: string;
  facilityName: string;
  facilityType: 'DISTRIBUTION_CENTER' | 'MANUFACTURING' | 'CROSS_DOCK' | 'TERMINAL';
  location: {
    address: string;
    coordinates: { lat: number; lng: number };
    timezone: string;
  };
  yardConfiguration: {
    totalYardSpace: number;
    numberOfDockDoors: number;
    trailerCapacity: number;
    yardSpaces: YardSpace[];
    dockDoors: DockDoor[];
  };
  operatingHours: {
    standard: { start: string; end: string };
    weekend?: { start: string; end: string };
    holiday?: { start: string; end: string };
  };
  securityConfiguration: {
    gateAccess: boolean;
    cameraSystem: boolean;
    accessControl: string[];
  };
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  createdDate: Date;
  lastUpdated: Date;
}

export interface DockDoor {
  doorId: string;
  doorNumber: string;
  facilityId: string;
  doorType: 'RECEIVING' | 'SHIPPING' | 'CROSS_DOCK' | 'MAINTENANCE';
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'BLOCKED';
  capabilities: {
    maxTrailerLength: number;
    maxWeight: number;
    equipmentType: string[];
    specialRequirements?: string[];
  };
  currentAssignment?: {
    trailerId: string;
    appointmentId: string;
    startTime: Date;
    estimatedEndTime: Date;
    operation: 'LOADING' | 'UNLOADING' | 'CROSS_DOCK';
  };
  schedule: AppointmentSchedule[];
  utilization: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  lastUpdated: Date;
}

export interface YardSpace {
  spaceId: string;
  spaceNumber: string;
  facilityId: string;
  spaceType: 'PARKING' | 'STAGING' | 'INSPECTION' | 'MAINTENANCE' | 'RESERVED';
  location: {
    coordinates: { x: number; y: number };
    zone: string;
    accessibility: 'DRIVE_THROUGH' | 'BACK_IN' | 'PARALLEL';
  };
  capacity: {
    maxTrailers: number;
    maxLength: number;
    maxWeight: number;
  };
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'BLOCKED';
  currentOccupancy?: {
    trailerId: string;
    checkInTime: Date;
    estimatedDepartureTime?: Date;
  };
  reservations: {
    reservationId: string;
    trailerId: string;
    startTime: Date;
    endTime: Date;
  }[];
  lastUpdated: Date;
}

export interface TrailerManagement {
  trailerId: string;
  trailerNumber: string;
  carrierId: string;
  carrierName: string;
  trailerType: 'DRY_VAN' | 'REFRIGERATED' | 'FLATBED' | 'TANKER' | 'INTERMODAL';
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  capacity: {
    maxWeight: number;
    maxVolume: number;
  };
  status: 'IN_YARD' | 'AT_DOCK' | 'IN_TRANSIT' | 'DEPARTED' | 'MAINTENANCE';
  location: {
    facilityId: string;
    yardSpaceId?: string;
    dockDoorId?: string;
    gatePosition?: string;
  };
  timeline: {
    gateInTime?: Date;
    yardAssignmentTime?: Date;
    dockAssignmentTime?: Date;
    operationStartTime?: Date;
    operationEndTime?: Date;
    gateOutTime?: Date;
  };
  cargo: {
    shipmentId?: string;
    orderIds: string[];
    cargoType: string;
    value: number;
    specialHandling?: string[];
  };
  appointments: {
    scheduledArrival?: Date;
    scheduledDeparture?: Date;
    appointmentId?: string;
  };
  compliance: {
    inspectionRequired: boolean;
    inspectionCompleted: boolean;
    complianceIssues?: string[];
  };
  createdDate: Date;
  lastUpdated: Date;
}

export interface AppointmentSchedule {
  appointmentId: string;
  facilityId: string;
  carrierId: string;
  carrierName: string;
  trailerId?: string;
  appointmentType: 'PICKUP' | 'DELIVERY' | 'LIVE_LOAD' | 'LIVE_UNLOAD' | 'DROP_TRAILER';
  scheduledTime: {
    date: Date;
    timeSlot: { start: string; end: string };
    duration: number; // minutes
  };
  requirements: {
    dockDoorType?: string;
    specialEquipment?: string[];
    laborRequirements?: number;
    spaceRequirements?: string[];
  };
  shipmentDetails: {
    shipmentId?: string;
    orderIds: string[];
    cargoType: string;
    weight: number;
    pieces: number;
    specialInstructions?: string;
  };
  status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  assignments: {
    dockDoorId?: string;
    yardSpaceId?: string;
    laborAssignments?: string[];
  };
  notifications: {
    reminderSent: boolean;
    confirmationSent: boolean;
    updatesEnabled: boolean;
  };
  actualTime?: {
    arrivalTime?: Date;
    startTime?: Date;
    endTime?: Date;
    departureTime?: Date;
  };
  createdBy: string;
  createdDate: Date;
  lastUpdated: Date;
}

export interface GateOperation {
  gateId: string;
  gateName: string;
  facilityId: string;
  gateType: 'INBOUND' | 'OUTBOUND' | 'BIDIRECTIONAL';
  operatingHours: {
    weekday: { start: string; end: string };
    weekend?: { start: string; end: string };
  };
  security: {
    accessControl: boolean;
    guardStation: boolean;
    cameras: boolean;
    weightScale: boolean;
  };
  operations: {
    operationId: string;
    trailerId: string;
    carrierId: string;
    operationType: 'CHECK_IN' | 'CHECK_OUT' | 'INSPECTION' | 'WEIGHING';
    timestamp: Date;
    duration: number;
    operatorId: string;
    documents: string[];
    issues?: string[];
  }[];
  performance: {
    averageProcessingTime: number;
    dailyThroughput: number;
    queueLength: number;
    utilization: number;
  };
  status: 'OPERATIONAL' | 'CLOSED' | 'MAINTENANCE';
  lastUpdated: Date;
}

export interface YardEquipment {
  equipmentId: string;
  equipmentType: 'YARD_TRACTOR' | 'FORKLIFT' | 'CRANE' | 'HOSTLER' | 'CONTAINER_HANDLER';
  equipmentNumber: string;
  facilityId: string;
  specifications: {
    capacity: number;
    maxReach?: number;
    maxHeight?: number;
    fuelType: 'DIESEL' | 'ELECTRIC' | 'PROPANE' | 'HYBRID';
  };
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'OUT_OF_SERVICE';
  currentAssignment?: {
    operatorId: string;
    taskId: string;
    taskType: 'TRAILER_SPOTTING' | 'CONTAINER_HANDLING' | 'CARGO_HANDLING';
    startTime: Date;
    estimatedEndTime: Date;
  };
  location: {
    currentPosition: { x: number; y: number };
    zone: string;
    lastKnownPosition: Date;
  };
  maintenance: {
    lastService: Date;
    nextService: Date;
    hoursOfOperation: number;
    maintenanceHistory: {
      date: Date;
      type: string;
      description: string;
      cost: number;
    }[];
  };
  utilization: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  createdDate: Date;
  lastUpdated: Date;
}

export interface YardOptimization {
  optimizationId: string;
  facilityId: string;
  optimizationType: 'SPACE_ALLOCATION' | 'DOCK_SCHEDULING' | 'TRAFFIC_FLOW' | 'EQUIPMENT_ROUTING';
  objectives: {
    minimizeWaitTime: boolean;
    maximizeUtilization: boolean;
    minimizeTravel: boolean;
    balanceWorkload: boolean;
  };
  constraints: {
    operatingHours: boolean;
    equipmentAvailability: boolean;
    laborCapacity: boolean;
    dockCapacity: boolean;
  };
  scenario: {
    timeHorizon: number; // hours
    demandForecast: any[];
    resourceConstraints: any[];
    priorityRules: any[];
  };
  recommendations: {
    spaceAllocations?: any[];
    dockAssignments?: any[];
    equipmentRouting?: any[];
    staffingLevels?: any[];
  };
  expectedBenefits: {
    waitTimeReduction: number;
    utilizationImprovement: number;
    costSavings: number;
    serviceImprovement: number;
  };
  implementationPlan: {
    phases: any[];
    timeline: any[];
    resources: any[];
  };
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'IMPLEMENTED';
  createdDate: Date;
  lastUpdated: Date;
}

export interface YardPerformanceMetrics {
  facilityId: string;
  reportingPeriod: {
    startDate: Date;
    endDate: Date;
  };
  dockUtilization: {
    averageUtilization: number;
    peakUtilization: number;
    utilizationByDoor: { doorId: string; utilization: number }[];
  };
  yardUtilization: {
    averageOccupancy: number;
    peakOccupancy: number;
    turnoverRate: number;
  };
  gateOperations: {
    averageProcessingTime: number;
    dailyThroughput: number;
    onTimePerformance: number;
  };
  trailerMetrics: {
    averageDwellTime: number;
    onTimeArrival: number;
    onTimeDeparture: number;
    noShowRate: number;
  };
  appointmentMetrics: {
    schedulingEfficiency: number;
    appointmentCompliance: number;
    reschedulingRate: number;
  };
  operationalEfficiency: {
    laborProductivity: number;
    equipmentUtilization: number;
    spaceUtilization: number;
  };
  costMetrics: {
    operatingCostPerTrailer: number;
    laborCostPerOperation: number;
    equipmentCostPerHour: number;
  };
  serviceMetrics: {
    customerSatisfaction: number;
    carrierSatisfaction: number;
    complaintRate: number;
  };
  lastUpdated: Date;
}
