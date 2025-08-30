/**
 * Field Service Management Types
 * Comprehensive types for Oracle Field Service competitive implementation
 */

// ================================
// CORE FIELD SERVICE TYPES
// ================================

export interface ServiceRequest {
  requestId: string;
  requestNumber: string;
  customerId: string;
  customerName: string;
  contactInfo: {
    primaryContact: string;
    phone: string;
    email: string;
    alternativeContact?: string;
  };
  serviceAddress: {
    address: string;
    coordinates: { lat: number; lng: number; };
    accessInstructions?: string;
    siteContact?: string;
  };
  requestType: 'INSTALLATION' | 'REPAIR' | 'MAINTENANCE' | 'INSPECTION' | 'EMERGENCY' | 'CONSULTATION';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'EMERGENCY';
  description: string;
  problemCategory: string;
  assetId?: string;
  assetInfo?: {
    serialNumber: string;
    modelNumber: string;
    manufacturer: string;
    installationDate?: Date;
    warrantyStatus: 'ACTIVE' | 'EXPIRED' | 'VOID';
  };
  preferredSchedule: {
    preferredDate?: Date;
    timeWindow?: { start: string; end: string; };
    availability: string;
  };
  skillsRequired: string[];
  estimatedDuration: number; // minutes
  contractId?: string;
  serviceLevel: 'STANDARD' | 'PREMIUM' | 'EMERGENCY' | 'CONTRACT';
  status: 'NEW' | 'ACKNOWLEDGED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD';
  createdBy: string;
  createdDate: Date;
  lastUpdated: Date;
}

export interface WorkOrder {
  workOrderId: string;
  workOrderNumber: string;
  serviceRequestId: string;
  customerId: string;
  type: 'INSTALLATION' | 'REPAIR' | 'MAINTENANCE' | 'INSPECTION' | 'EMERGENCY' | 'PREVENTIVE';
  title: string;
  description: string;
  instructions: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'EMERGENCY';
  
  // Asset information
  assetId?: string;
  assetDetails?: {
    serialNumber: string;
    modelNumber: string;
    location: string;
    condition: 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';
  };
  
  // Assignment and scheduling
  assignedTechnician?: {
    technicianId: string;
    technicianName: string;
    skills: string[];
    certifications: string[];
  };
  teamAssignment?: {
    teamId: string;
    teamMembers: string[];
    leadTechnician: string;
  };
  
  scheduledStart: Date;
  scheduledEnd: Date;
  estimatedDuration: number; // minutes
  
  // Parts and materials
  requiredParts: {
    partNumber: string;
    partDescription: string;
    quantity: number;
    unitPrice: number;
    availability: 'IN_STOCK' | 'ORDER_REQUIRED' | 'BACKORDERED';
  }[];
  
  materialCost: number;
  laborCost: number;
  totalCost: number;
  
  // Tools and equipment
  requiredTools: string[];
  specialEquipment?: string[];
  
  // Service location
  serviceAddress: {
    address: string;
    coordinates: { lat: number; lng: number; };
    accessInstructions?: string;
    siteContact?: string;
  };
  
  // Status and tracking
  status: 'CREATED' | 'SCHEDULED' | 'DISPATCHED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  
  // Execution details
  actualStart?: Date;
  actualEnd?: Date;
  actualDuration?: number;
  travelTime?: number;
  
  // Resolution
  resolutionCode?: string;
  resolutionDescription?: string;
  workPerformed?: string;
  partsUsed?: {
    partNumber: string;
    quantity: number;
    serialNumbers?: string[];
  }[];
  
  // Follow-up
  followUpRequired: boolean;
  followUpDate?: Date;
  followUpInstructions?: string;
  
  // Quality and satisfaction
  qualityCheckPassed?: boolean;
  customerSignature?: string;
  customerFeedback?: {
    rating: number;
    comments: string;
  };
  
  // Integration
  integrationData?: {
    externalSystemId?: string;
    syncStatus: 'PENDING' | 'SYNCED' | 'FAILED';
    lastSync?: Date;
  };
  
  createdBy: string;
  createdDate: Date;
  lastUpdated: Date;
}

export interface ServiceTechnician {
  technicianId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mobilePhone: string;
  
  // Qualifications
  skills: {
    skillId: string;
    skillName: string;
    proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
    yearsExperience: number;
  }[];
  
  certifications: {
    certificationId: string;
    certificationName: string;
    issuingOrganization: string;
    issueDate: Date;
    expirationDate?: Date;
    status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
  }[];
  
  // Work assignment
  serviceTerritory: {
    territoryId: string;
    territoryName: string;
    geoFence: any; // GeoJSON polygon
    travelRadius: number; // miles/km
  };
  
  homeBase: {
    address: string;
    coordinates: { lat: number; lng: number; };
  };
  
  workingHours: {
    schedule: {
      [key: string]: { start: string; end: string; }; // Monday, Tuesday, etc.
    };
    availability: 'FULL_TIME' | 'PART_TIME' | 'ON_CALL' | 'CONTRACTOR';
    timeZone: string;
  };
  
  // Equipment and inventory
  assignedVehicle?: {
    vehicleId: string;
    vehicleNumber: string;
    make: string;
    model: string;
    year: number;
    gpsEnabled: boolean;
  };
  
  mobileInventory: {
    capacity: number;
    currentStock: {
      partNumber: string;
      quantity: number;
      value: number;
    }[];
    stockValue: number;
  };
  
  tools: {
    toolId: string;
    toolName: string;
    serialNumber?: string;
    condition: 'GOOD' | 'FAIR' | 'NEEDS_REPAIR';
  }[];
  
  // Performance metrics
  performance: {
    completionRate: number;
    onTimeRate: number;
    firstTimeFixRate: number;
    customerSatisfactionScore: number;
    utilizationRate: number;
  };
  
  // Current status
  status: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE' | 'OFF_DUTY';
  currentLocation?: {
    coordinates: { lat: number; lng: number; };
    address: string;
    timestamp: Date;
  };
  
  currentAssignment?: {
    workOrderId: string;
    estimatedCompletion: Date;
    status: 'EN_ROUTE' | 'ON_SITE' | 'IN_PROGRESS';
  };
  
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'TERMINATED';
  hireDate: Date;
  createdDate: Date;
  lastUpdated: Date;
}

export interface ServiceContract {
  contractId: string;
  contractNumber: string;
  customerId: string;
  customerName: string;
  contractType: 'MAINTENANCE' | 'WARRANTY' | 'SERVICE_LEVEL' | 'PARTS_LABOR' | 'COMPREHENSIVE';
  
  // Contract terms
  startDate: Date;
  endDate: Date;
  renewalTerms: {
    autoRenewal: boolean;
    renewalPeriod?: number; // months
    renewalNotice?: number; // days
  };
  
  // Service coverage
  serviceLevel: {
    responseTime: number; // hours
    resolutionTime: number; // hours
    availability: '8x5' | '24x7' | 'BUSINESS_HOURS' | 'CUSTOM';
    coverage: 'REMOTE' | 'ON_SITE' | 'BOTH';
  };
  
  // Assets covered
  coveredAssets: {
    assetId: string;
    serialNumber: string;
    modelNumber: string;
    location: string;
    coverage: 'PARTS' | 'LABOR' | 'PARTS_LABOR' | 'PREVENTIVE' | 'COMPREHENSIVE';
  }[];
  
  // Financial terms
  contractValue: number;
  billingFrequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  paymentTerms: string;
  
  // Service inclusions
  includedServices: {
    serviceType: string;
    description: string;
    quantity?: number;
    frequency?: string;
  }[];
  
  excludedServices: string[];
  
  // Performance metrics
  performanceMetrics: {
    metricName: string;
    target: number;
    current: number;
    unit: string;
  }[];
  
  // Contact information
  customerContacts: {
    contactType: 'PRIMARY' | 'BILLING' | 'TECHNICAL' | 'ESCALATION';
    name: string;
    title: string;
    phone: string;
    email: string;
  }[];
  
  status: 'DRAFT' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'TERMINATED';
  createdBy: string;
  approvedBy?: string;
  createdDate: Date;
  lastUpdated: Date;
}

export interface ServiceAppointment {
  appointmentId: string;
  workOrderId: string;
  technicianId: string;
  customerId: string;
  
  // Scheduling details
  scheduledDate: Date;
  timeWindow: {
    start: string;
    end: string;
    duration: number; // minutes
  };
  
  appointmentType: 'INSTALLATION' | 'REPAIR' | 'MAINTENANCE' | 'CONSULTATION' | 'FOLLOW_UP';
  
  // Location
  serviceAddress: {
    address: string;
    coordinates: { lat: number; lng: number; };
    accessInstructions?: string;
    parkingInstructions?: string;
  };
  
  // Requirements
  skillsRequired: string[];
  toolsRequired: string[];
  partsRequired: {
    partNumber: string;
    quantity: number;
    critical: boolean;
  }[];
  
  // Customer preferences
  customerPreferences: {
    preferredTechnician?: string;
    languagePreference?: string;
    specialInstructions?: string;
    contactMethod: 'PHONE' | 'SMS' | 'EMAIL';
  };
  
  // Status and tracking
  status: 'SCHEDULED' | 'CONFIRMED' | 'EN_ROUTE' | 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED' | 'NO_SHOW';
  
  // Actual execution
  actualArrival?: Date;
  actualStart?: Date;
  actualEnd?: Date;
  travelTime?: number;
  
  // Communication
  notifications: {
    confirmationSent: boolean;
    reminderSent: boolean;
    arrivalNotificationSent: boolean;
    completionNotificationSent: boolean;
  };
  
  // Rescheduling history
  rescheduleHistory: {
    originalDate: Date;
    newDate: Date;
    reason: string;
    requestedBy: 'CUSTOMER' | 'TECHNICIAN' | 'DISPATCHER';
    timestamp: Date;
  }[];
  
  createdBy: string;
  createdDate: Date;
  lastUpdated: Date;
}

export interface FieldInventory {
  inventoryId: string;
  locationId: string;
  locationType: 'WAREHOUSE' | 'VAN' | 'TECHNICIAN' | 'CUSTOMER_SITE';
  
  // Location details
  locationDetails: {
    name: string;
    address?: string;
    coordinates?: { lat: number; lng: number; };
    managerId?: string;
  };
  
  // Inventory items
  items: {
    partNumber: string;
    description: string;
    category: string;
    manufacturer: string;
    unitOfMeasure: string;
    
    // Stock levels
    currentStock: number;
    minimumStock: number;
    maximumStock: number;
    reorderPoint: number;
    reorderQuantity: number;
    
    // Financial
    unitCost: number;
    totalValue: number;
    
    // Tracking
    serialNumbers?: string[];
    batchNumbers?: string[];
    expirationDate?: Date;
    
    // Location specifics
    binLocation?: string;
    status: 'AVAILABLE' | 'RESERVED' | 'QUARANTINE' | 'OBSOLETE';
  }[];
  
  // Capacity and utilization
  totalCapacity: number;
  currentUtilization: number;
  utilizationPercentage: number;
  
  // Replenishment
  replenishmentSchedule: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ON_DEMAND';
    lastReplenishment: Date;
    nextReplenishment: Date;
    supplierInfo: {
      supplierId: string;
      supplierName: string;
      leadTime: number; // days
    };
  };
  
  // Movement tracking
  recentMovements: {
    movementId: string;
    movementType: 'RECEIPT' | 'ISSUE' | 'TRANSFER' | 'RETURN' | 'ADJUSTMENT';
    partNumber: string;
    quantity: number;
    fromLocation?: string;
    toLocation?: string;
    workOrderId?: string;
    technicianId?: string;
    timestamp: Date;
    reason: string;
  }[];
  
  lastUpdated: Date;
}

export interface ServicePerformance {
  performanceId: string;
  reportingPeriod: {
    startDate: Date;
    endDate: Date;
  };
  
  // Service metrics
  serviceMetrics: {
    totalServiceRequests: number;
    completedServiceRequests: number;
    completionRate: number;
    averageResponseTime: number; // hours
    averageResolutionTime: number; // hours
    firstTimeFixRate: number;
    reopenRate: number;
  };
  
  // Technician performance
  technicianMetrics: {
    technicianId: string;
    technicianName: string;
    completedJobs: number;
    onTimeArrival: number;
    customerSatisfaction: number;
    utilizationRate: number;
    productivityScore: number;
  }[];
  
  // Customer satisfaction
  customerSatisfaction: {
    totalSurveys: number;
    averageRating: number;
    responseRate: number;
    satisfactionByCategory: {
      category: string;
      rating: number;
    }[];
    netPromoterScore?: number;
  };
  
  // Financial metrics
  financialMetrics: {
    totalRevenue: number;
    averageJobValue: number;
    laborCosts: number;
    partsCosts: number;
    totalCosts: number;
    profitMargin: number;
  };
  
  // Asset metrics
  assetMetrics: {
    totalAssetsServiced: number;
    averageAssetAge: number;
    assetAvailability: number;
    maintenanceCostPerAsset: number;
  };
  
  // Operational efficiency
  operationalMetrics: {
    scheduleEfficiency: number;
    travelTimeOptimization: number;
    partsAvailability: number;
    toolUtilization: number;
  };
  
  lastUpdated: Date;
}

export interface CustomerPortal {
  portalId: string;
  customerId: string;
  
  // Portal configuration
  configuration: {
    branding: {
      logo: string;
      colors: Record<string, string>;
      customCSS?: string;
    };
    features: {
      serviceRequestSubmission: boolean;
      appointmentScheduling: boolean;
      workOrderTracking: boolean;
      invoiceAccess: boolean;
      knowledgeBase: boolean;
      chatSupport: boolean;
    };
  };
  
  // User accounts
  users: {
    userId: string;
    username: string;
    email: string;
    role: 'ADMIN' | 'USER' | 'VIEWER';
    permissions: string[];
    lastLogin?: Date;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  }[];
  
  // Service requests
  serviceRequests: {
    requestId: string;
    status: string;
    submittedDate: Date;
    description: string;
    priority: string;
    assignedTechnician?: string;
    scheduledDate?: Date;
  }[];
  
  // Knowledge base
  knowledgeBase: {
    articles: {
      articleId: string;
      title: string;
      category: string;
      content: string;
      views: number;
      helpful: number;
      notHelpful: number;
      lastUpdated: Date;
    }[];
    
    faqs: {
      question: string;
      answer: string;
      category: string;
      views: number;
    }[];
  };
  
  // Communication
  notifications: {
    notificationId: string;
    type: 'SERVICE_UPDATE' | 'APPOINTMENT_REMINDER' | 'INVOICE_AVAILABLE' | 'SYSTEM_MAINTENANCE';
    title: string;
    message: string;
    read: boolean;
    timestamp: Date;
  }[];
  
  // Analytics
  usageAnalytics: {
    totalLogins: number;
    averageSessionDuration: number;
    mostUsedFeatures: string[];
    supportTicketsCreated: number;
    satisfactionRating?: number;
  };
  
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdDate: Date;
  lastUpdated: Date;
}

export interface ServiceAnalytics {
  analyticsId: string;
  reportType: 'OPERATIONAL' | 'FINANCIAL' | 'CUSTOMER' | 'TECHNICIAN' | 'ASSET' | 'PREDICTIVE';
  reportingPeriod: {
    startDate: Date;
    endDate: Date;
  };
  
  // Operational analytics
  operationalData?: {
    totalServiceRequests: number;
    serviceRequestsByType: Record<string, number>;
    serviceRequestsByPriority: Record<string, number>;
    averageResponseTime: number;
    averageResolutionTime: number;
    slaComplianceRate: number;
  };
  
  // Financial analytics
  financialData?: {
    totalRevenue: number;
    revenueByServiceType: Record<string, number>;
    totalCosts: number;
    laborCosts: number;
    partsCosts: number;
    travelCosts: number;
    profitMargin: number;
    costPerServiceRequest: number;
  };
  
  // Customer analytics
  customerData?: {
    totalCustomers: number;
    newCustomers: number;
    customerRetentionRate: number;
    customerSatisfactionScore: number;
    netPromoterScore: number;
    complaintsReceived: number;
    complaintResolutionTime: number;
  };
  
  // Technician analytics
  technicianData?: {
    totalTechnicians: number;
    averageUtilizationRate: number;
    productivityScore: number;
    skillsGapAnalysis: Record<string, number>;
    trainingCompletionRate: number;
    turnoverRate: number;
  };
  
  // Asset analytics
  assetData?: {
    totalAssetsManaged: number;
    assetsByCategory: Record<string, number>;
    averageAssetAge: number;
    assetReliabilityScore: number;
    maintenanceCostTrends: any[];
    assetDowntime: number;
  };
  
  // Predictive analytics
  predictiveData?: {
    demandForecast: any[];
    maintenancePredict: any[];
    partsDemandForecast: any[];
    resourceOptimization: any[];
    riskAssessment: any[];
  };
  
  // Insights and recommendations
  insights: {
    insightType: 'OPPORTUNITY' | 'RISK' | 'EFFICIENCY' | 'COST_SAVING';
    title: string;
    description: string;
    impact: 'LOW' | 'MEDIUM' | 'HIGH';
    recommendedAction: string;
    estimatedBenefit?: number;
  }[];
  
  generatedDate: Date;
  lastUpdated: Date;
}

export interface MobileWorkforce {
  workforceId: string;
  
  // Mobile application configuration
  mobileAppConfig: {
    version: string;
    features: {
      offlineMode: boolean;
      gpsTracking: boolean;
      barcodeScanners: boolean;
      digitalSignature: boolean;
      photoCapture: boolean;
      timeTracking: boolean;
    };
    
    syncSettings: {
      syncFrequency: number; // minutes
      offlineStorageLimit: number; // MB
      dataRetentionPeriod: number; // days
    };
  };
  
  // Technician devices
  devices: {
    deviceId: string;
    technicianId: string;
    deviceType: 'SMARTPHONE' | 'TABLET' | 'LAPTOP' | 'RUGGED_DEVICE';
    manufacturer: string;
    model: string;
    operatingSystem: string;
    appVersion: string;
    lastSync: Date;
    batteryLevel?: number;
    gpsEnabled: boolean;
    status: 'ACTIVE' | 'INACTIVE' | 'LOST' | 'DAMAGED';
  }[];
  
  // Real-time tracking
  realTimeTracking: {
    technicianId: string;
    currentLocation: {
      coordinates: { lat: number; lng: number; };
      accuracy: number; // meters
      timestamp: Date;
    };
    status: 'AVAILABLE' | 'EN_ROUTE' | 'ON_SITE' | 'BREAK' | 'OFFLINE';
    currentWorkOrder?: string;
    estimatedArrival?: Date;
  }[];
  
  // Communication channels
  communication: {
    channels: {
      channelType: 'VOICE' | 'SMS' | 'PUSH_NOTIFICATION' | 'IN_APP_MESSAGING';
      enabled: boolean;
      configuration: Record<string, any>;
    }[];
    
    emergencyProtocol: {
      escalationLevels: {
        level: number;
        notificationMethod: string;
        recipients: string[];
        timeoutMinutes: number;
      }[];
    };
  };
  
  // Performance monitoring
  performanceMonitoring: {
    responseTimeTracking: boolean;
    productivityMetrics: boolean;
    customerFeedbackCollection: boolean;
    qualityAssurance: boolean;
  };
  
  lastUpdated: Date;
}

export interface DispatchOptimization {
  optimizationId: string;
  optimizationDate: Date;
  
  // Optimization parameters
  parameters: {
    timeHorizon: number; // hours
    objectives: {
      minimizeTravelTime: boolean;
      maximizeUtilization: boolean;
      balanceWorkload: boolean;
      prioritizeUrgent: boolean;
      minimizeCost: boolean;
    };
    
    constraints: {
      technicianSkills: boolean;
      workingHours: boolean;
      maxTravelDistance: number; // miles
      serviceTimeWindows: boolean;
      partAvailability: boolean;
    };
  };
  
  // Input data
  inputData: {
    availableTechnicians: {
      technicianId: string;
      location: { lat: number; lng: number; };
      skills: string[];
      workingHours: { start: string; end: string; };
      currentWorkload: number;
    }[];
    
    pendingWorkOrders: {
      workOrderId: string;
      location: { lat: number; lng: number; };
      priority: string;
      estimatedDuration: number;
      skillsRequired: string[];
      timeWindow?: { start: string; end: string; };
    }[];
  };
  
  // Optimization results
  results: {
    assignments: {
      technicianId: string;
      workOrders: {
        workOrderId: string;
        sequence: number;
        scheduledStart: Date;
        scheduledEnd: Date;
        travelTime: number;
      }[];
      totalTravelTime: number;
      utilizationRate: number;
    }[];
    
    unassignedWorkOrders: {
      workOrderId: string;
      reason: string;
      suggestedAction: string;
    }[];
    
    optimizationMetrics: {
      totalTravelTime: number;
      averageUtilization: number;
      workloadBalance: number;
      costOptimization: number;
      serviceLevel: number;
    };
  };
  
  // Implementation
  implementationStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'IMPLEMENTED';
  approvedBy?: string;
  implementationDate?: Date;
  
  // Performance tracking
  actualResults?: {
    actualTravelTime: number;
    actualUtilization: number;
    varianceFromOptimal: number;
    customerSatisfaction: number;
  };
  
  lastUpdated: Date;
}

export interface ServiceWarranty {
  warrantyId: string;
  warrantyNumber: string;
  assetId: string;
  customerId: string;
  
  // Warranty details
  warrantyType: 'MANUFACTURER' | 'EXTENDED' | 'SERVICE_PLAN' | 'COMPREHENSIVE';
  
  coverage: {
    parts: boolean;
    labor: boolean;
    travel: boolean;
    emergencyService: boolean;
    preventiveMaintenance: boolean;
  };
  
  terms: {
    startDate: Date;
    endDate: Date;
    duration: number; // months
    transferable: boolean;
    renewable: boolean;
  };
  
  // Service level
  serviceLevel: {
    responseTime: number; // hours
    resolutionTime: number; // hours
    availability: string; // e.g., "24x7", "8x5"
    onSiteService: boolean;
  };
  
  // Financial terms
  cost: number;
  deductible?: number;
  maxClaimAmount?: number;
  
  // Warranty provider
  provider: {
    providerId: string;
    providerName: string;
    contactInfo: {
      phone: string;
      email: string;
      website?: string;
    };
  };
  
  // Claims history
  claims: {
    claimId: string;
    claimNumber: string;
    claimDate: Date;
    issueDescription: string;
    claimAmount: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
    resolution?: string;
    closureDate?: Date;
  }[];
  
  // Asset information
  assetDetails: {
    serialNumber: string;
    modelNumber: string;
    manufacturer: string;
    installationDate: Date;
    purchasePrice: number;
  };
  
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'CLAIMED' | 'SUSPENDED';
  
  // Notifications
  expirationReminders: {
    notificationDate: Date;
    notificationSent: boolean;
    recipient: string;
  }[];
  
  createdBy: string;
  createdDate: Date;
  lastUpdated: Date;
}