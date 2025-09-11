/**
 * Enterprise Asset Management Types
 * Comprehensive types for Oracle Enterprise Asset Management competitive implementation
 */

// ================================
// CORE ASSET MANAGEMENT TYPES
// ================================

export interface Asset {
  assetId: string;
  assetNumber: string;
  assetName: string;
  description: string;
  assetType: 'EQUIPMENT' | 'MACHINERY' | 'VEHICLE' | 'BUILDING' | 'IT_ASSET' | 'INFRASTRUCTURE';
  category: string;
  subCategory: string;

  // Classification and hierarchy
  assetClass: 'PRODUCTION' | 'SUPPORT' | 'FACILITY' | 'IT' | 'SAFETY' | 'ENVIRONMENTAL';
  hierarchy: {
    parentAssetId?: string;
    level: number;
    path: string;
    children: string[];
  };

  // Technical specifications
  specifications: {
    manufacturer: string;
    model: string;
    serialNumber: string;
    partNumber?: string;
    capacity?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
      weight: number;
    };
    technicalSpecs: Record<string, any>;
  };

  // Location and installation
  location: {
    facilityId: string;
    facilityName: string;
    area: string;
    building?: string;
    floor?: string;
    room?: string;
    coordinates?: { lat: number; lng: number };
    address: string;
  };

  installationDetails: {
    installationDate: Date;
    commissioningDate?: Date;
    installedBy: string;
    installationCost: number;
  };

  // Financial information
  financialInfo: {
    purchasePrice: number;
    currentValue: number;
    depreciationMethod: 'STRAIGHT_LINE' | 'DECLINING_BALANCE' | 'SUM_OF_YEARS';
    depreciationRate: number;
    residualValue: number;
    totalCostOfOwnership: number;
  };

  // Operational status
  operationalStatus: {
    status: 'OPERATIONAL' | 'NON_OPERATIONAL' | 'MAINTENANCE' | 'RETIRED' | 'DISPOSED';
    condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';
    reliability: number; // 0-100%
    availability: number; // 0-100%
    utilizationRate: number; // 0-100%
  };

  // Maintenance information
  maintenanceInfo: {
    maintenanceStrategy: 'REACTIVE' | 'PREVENTIVE' | 'PREDICTIVE' | 'RUN_TO_FAILURE';
    criticalityRating: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    lastMaintenanceDate?: Date;
    nextMaintenanceDate?: Date;
    maintenanceCostYTD: number;
  };

  // Lifecycle information
  lifecycle: {
    lifecycleStage:
      | 'PLANNING'
      | 'PROCUREMENT'
      | 'INSTALLATION'
      | 'OPERATION'
      | 'MAINTENANCE'
      | 'DISPOSAL';
    expectedLifespan: number; // years
    remainingLife: number; // years
    replacementDate?: Date;
    disposalPlan?: string;
  };

  // Safety and compliance
  safetyInfo: {
    safetyClassification: 'STANDARD' | 'HAZARDOUS' | 'CRITICAL_SAFETY' | 'ENVIRONMENTAL';
    regulatoryRequirements: string[];
    certifications: {
      certificationType: string;
      issuer: string;
      issueDate: Date;
      expirationDate: Date;
      status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
    }[];
  };

  // Documentation
  documentation: {
    manuals: string[];
    drawings: string[];
    specifications: string[];
    warranties: string[];
    photos: string[];
  };

  // Relationships
  relationships: {
    dependencies: string[]; // Asset IDs this asset depends on
    dependents: string[]; // Asset IDs that depend on this asset
    spares: string[]; // Spare parts associated with this asset
  };

  createdBy: string;
  createdDate: Date;
  lastUpdated: Date;
}

export interface AssetHierarchy {
  hierarchyId: string;
  hierarchyName: string;
  hierarchyType: 'LOCATION' | 'FUNCTIONAL' | 'SYSTEM' | 'PROCESS';
  rootAssetId: string;

  structure: {
    level1: { id: string; name: string; type: string }[];
    level2: { id: string; name: string; type: string; parentId: string }[];
    level3: { id: string; name: string; type: string; parentId: string }[];
    level4: { id: string; name: string; type: string; parentId: string }[];
    level5: { id: string; name: string; type: string; parentId: string }[];
  };

  relationships: {
    parentChildRelations: { parentId: string; childId: string; relationshipType: string }[];
    systemConnections: { fromAssetId: string; toAssetId: string; connectionType: string }[];
  };

  visualRepresentation?: {
    diagramType: 'TREE' | 'NETWORK' | 'SCHEMATIC';
    layout: any;
    positions: Record<string, { x: number; y: number }>;
  };

  createdDate: Date;
  lastUpdated: Date;
}

export interface MaintenanceSchedule {
  scheduleId: string;
  assetId: string;
  scheduleName: string;
  scheduleType: 'CALENDAR_BASED' | 'USAGE_BASED' | 'CONDITION_BASED' | 'PREDICTIVE';

  // Schedule parameters
  frequency: {
    type: 'HOURS' | 'DAYS' | 'WEEKS' | 'MONTHS' | 'CYCLES' | 'MILEAGE';
    interval: number;
    tolerance?: number; // +/- days
  };

  // Maintenance details
  maintenanceType:
    | 'INSPECTION'
    | 'LUBRICATION'
    | 'REPLACEMENT'
    | 'REPAIR'
    | 'OVERHAUL'
    | 'CALIBRATION';
  workDescription: string;
  estimatedDuration: number; // hours

  // Planning information
  planningDetails: {
    leadTime: number; // days
    planningHorizon: number; // months
    autoGenerateWorkOrders: boolean;
    workOrderTemplate?: string;
  };

  // Resource requirements
  resources: {
    skillsRequired: string[];
    laborHours: number;
    specialTools: string[];
    requiredParts: {
      partNumber: string;
      quantity: number;
      critical: boolean;
    }[];
    estimatedCost: number;
  };

  // Schedule execution
  execution: {
    nextScheduledDate: Date;
    lastCompletedDate?: Date;
    totalCompletions: number;
    averageCompletionTime?: number;
    complianceRate: number; // percentage
  };

  // Performance tracking
  performance: {
    costPerExecution: number;
    effectivenessRating: number;
    downtime: number; // hours
    costSavings: number;
  };

  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'EXPIRED';
  createdBy: string;
  approvedBy?: string;
  createdDate: Date;
  lastUpdated: Date;
}

export interface WorkOrder {
  workOrderId: string;
  workOrderNumber: string;
  assetId: string;
  workOrderType: 'CORRECTIVE' | 'PREVENTIVE' | 'PREDICTIVE' | 'PROJECT' | 'EMERGENCY' | 'SHUTDOWN';

  // Work order details
  description: string;
  problemDescription?: string;
  workInstructions: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'EMERGENCY';

  // Scheduling
  scheduling: {
    requestedDate: Date;
    scheduledStartDate?: Date;
    scheduledEndDate?: Date;
    actualStartDate?: Date;
    actualEndDate?: Date;
    estimatedDuration: number; // hours
    actualDuration?: number; // hours
  };

  // Assignment
  assignment: {
    assignedTo?: string; // Person ID
    assignedTeam?: string; // Team ID
    assignedCraftSkills: string[];
    supervisorId?: string;
  };

  // Parts and materials
  materials: {
    requestedParts: {
      partNumber: string;
      description: string;
      quantity: number;
      unitCost: number;
      availability: 'AVAILABLE' | 'ORDER_REQUIRED' | 'BACKORDERED';
    }[];

    actualPartsUsed?: {
      partNumber: string;
      quantity: number;
      unitCost: number;
      issueDate: Date;
    }[];

    totalMaterialCost: number;
  };

  // Labor tracking
  labor: {
    plannedLabor: {
      craftSkill: string;
      estimatedHours: number;
      hourlyRate: number;
    }[];

    actualLabor?: {
      personId: string;
      craftSkill: string;
      startTime: Date;
      endTime: Date;
      hours: number;
      hourlyRate: number;
    }[];

    totalLaborCost: number;
  };

  // Safety and permits
  safety: {
    permitRequired: boolean;
    permits: {
      permitType: string;
      permitNumber: string;
      issueDate: Date;
      expirationDate: Date;
      status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
    }[];

    safetyProcedures: string[];
    hazardAnalysis?: string;
    lockoutTagout?: boolean;
  };

  // Quality and completion
  completion: {
    workCompleted: string;
    qualityChecks: {
      checkType: string;
      passed: boolean;
      comments?: string;
      inspectorId?: string;
    }[];

    completionCertification?: {
      certifiedBy: string;
      certificationDate: Date;
      remarks: string;
    };
  };

  // Follow-up
  followUp: {
    followUpRequired: boolean;
    followUpDate?: Date;
    followUpWorkOrder?: string;
    recommendedActions?: string[];
  };

  // Financial tracking
  costs: {
    budgetedCost: number;
    actualCost: number;
    variance: number;
    costBreakdown: {
      laborCost: number;
      materialCost: number;
      contractorCost: number;
      overheadCost: number;
    };
  };

  status:
    | 'CREATED'
    | 'PLANNED'
    | 'APPROVED'
    | 'RELEASED'
    | 'IN_PROGRESS'
    | 'HOLD'
    | 'COMPLETED'
    | 'CANCELLED';

  // History and audit
  history: {
    statusChanges: {
      fromStatus: string;
      toStatus: string;
      changeDate: Date;
      changedBy: string;
      reason?: string;
    }[];

    modifications: {
      fieldChanged: string;
      oldValue: any;
      newValue: any;
      changeDate: Date;
      changedBy: string;
    }[];
  };

  createdBy: string;
  createdDate: Date;
  lastUpdated: Date;
}

export interface AssetPerformance {
  performanceId: string;
  assetId: string;
  reportingPeriod: {
    startDate: Date;
    endDate: Date;
  };

  // Reliability metrics
  reliability: {
    mtbf: number; // Mean Time Between Failures (hours)
    mttr: number; // Mean Time To Repair (hours)
    failureRate: number; // failures per unit time
    reliabilityScore: number; // 0-100%

    failures: {
      failureDate: Date;
      failureMode: string;
      downtime: number;
      repairCost: number;
      rootCause?: string;
    }[];
  };

  // Availability metrics
  availability: {
    operationalTime: number; // hours
    totalTime: number; // hours
    availabilityPercentage: number;
    plannedDowntime: number; // hours
    unplannedDowntime: number; // hours

    downtimeEvents: {
      startTime: Date;
      endTime: Date;
      duration: number;
      reason: string;
      type: 'PLANNED' | 'UNPLANNED';
    }[];
  };

  // Utilization metrics
  utilization: {
    actualRunTime: number; // hours
    availableTime: number; // hours
    utilizationRate: number; // percentage
    idleTime: number; // hours

    operatingConditions: {
      averageLoad: number; // percentage of capacity
      peakLoad: number;
      cyclesPerformed: number;
      operatingHours: number;
    };
  };

  // Maintenance effectiveness
  maintenance: {
    totalMaintenanceCost: number;
    preventiveMaintenanceCost: number;
    correctiveMaintenanceCost: number;
    maintenanceHours: number;

    maintenanceEvents: {
      eventDate: Date;
      maintenanceType: string;
      duration: number;
      cost: number;
      effectiveness: number; // 1-10 scale
    }[];

    maintenanceRatio: number; // PM hours / total maintenance hours
  };

  // Cost performance
  costs: {
    operatingCost: number;
    maintenanceCost: number;
    totalCostOfOwnership: number;
    costPerOperatingHour: number;
    costPerUnit: number; // cost per unit of production

    costTrends: {
      period: string;
      operatingCost: number;
      maintenanceCost: number;
    }[];
  };

  // Performance indicators
  kpis: {
    oee: number; // Overall Equipment Effectiveness
    oae: number; // Overall Asset Effectiveness
    performanceScore: number;
    conditionScore: number;
    riskScore: number;
  };

  // Benchmarking
  benchmarks: {
    industryAverage?: {
      availability: number;
      mtbf: number;
      mttr: number;
      costPerHour: number;
    };

    internalBenchmark?: {
      bestPerformingAsset: string;
      performanceGap: number;
      improvementPotential: number;
    };
  };

  // Predictive insights
  predictions: {
    nextFailurePrediction?: {
      predictedDate: Date;
      confidence: number;
      failureMode: string;
    };

    maintenanceRecommendations: {
      recommendationType: string;
      priority: string;
      description: string;
      estimatedBenefit: number;
    }[];
  };

  lastUpdated: Date;
}

export interface MaintenancePlan {
  planId: string;
  planName: string;
  planType: 'ASSET_SPECIFIC' | 'ASSET_GROUP' | 'SYSTEM_WIDE' | 'FACILITY_WIDE';

  // Plan scope
  scope: {
    assetIds: string[];
    assetCategories: string[];
    facilities: string[];
    systems: string[];
  };

  // Strategic objectives
  objectives: {
    primaryObjective:
      | 'MINIMIZE_COST'
      | 'MAXIMIZE_AVAILABILITY'
      | 'EXTEND_LIFE'
      | 'IMPROVE_RELIABILITY';
    targetMetrics: {
      availability: number;
      reliability: number;
      costReduction: number;
      safetyImprovement: number;
    };

    timeHorizon: number; // months
  };

  // Maintenance strategies
  strategies: {
    assetId: string;
    strategy: 'REACTIVE' | 'PREVENTIVE' | 'PREDICTIVE' | 'RCM' | 'TPM';
    justification: string;
    implementationDate: Date;
  }[];

  // Resource planning
  resourcePlan: {
    laborRequirements: {
      skillType: string;
      hoursPerMonth: number;
      resourceCount: number;
    }[];

    budgetRequirements: {
      totalBudget: number;
      laborBudget: number;
      materialBudget: number;
      contractorBudget: number;
      capitalBudget: number;
    };

    inventoryRequirements: {
      criticalSpares: string[];
      stockingStrategy: 'MIN_MAX' | 'KANBAN' | 'JIT' | 'VENDOR_MANAGED';
      targetServiceLevel: number;
    };
  };

  // Implementation roadmap
  roadmap: {
    phases: {
      phaseNumber: number;
      phaseName: string;
      startDate: Date;
      endDate: Date;
      deliverables: string[];
      milestones: {
        milestoneName: string;
        date: Date;
        criteria: string;
      }[];
    }[];

    riskMitigation: {
      riskCategory: string;
      mitigationStrategy: string;
      contingencyPlan: string;
    }[];
  };

  // Performance monitoring
  monitoring: {
    kpiTargets: {
      kpiName: string;
      target: number;
      tolerance: number;
      reviewFrequency: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
    }[];

    reviewSchedule: {
      reviewType: 'TACTICAL' | 'STRATEGIC';
      frequency: string;
      participants: string[];
    }[];
  };

  status: 'DRAFT' | 'APPROVED' | 'ACTIVE' | 'SUSPENDED' | 'COMPLETED';
  approvedBy?: string;
  approvalDate?: Date;
  createdBy: string;
  createdDate: Date;
  lastUpdated: Date;
}

export interface AssetCondition {
  conditionId: string;
  assetId: string;
  assessmentDate: Date;
  assessmentType:
    | 'VISUAL'
    | 'VIBRATION'
    | 'THERMAL'
    | 'ULTRASONIC'
    | 'OIL_ANALYSIS'
    | 'PERFORMANCE';

  // Overall condition
  overallCondition: {
    rating: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';
    score: number; // 1-100
    trend: 'IMPROVING' | 'STABLE' | 'DETERIORATING';
  };

  // Component conditions
  componentConditions: {
    componentId: string;
    componentName: string;
    conditionRating: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';
    conditionScore: number;
    issues: {
      issueType: string;
      severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      description: string;
      recommendedAction: string;
    }[];
  }[];

  // Measurement data
  measurements: {
    parameter: string;
    value: number;
    unit: string;
    normalRange: { min: number; max: number };
    alertLevel: 'NORMAL' | 'CAUTION' | 'ALERT' | 'DANGER';
    trend: any[]; // Historical values
  }[];

  // Inspection findings
  findings: {
    findingId: string;
    category: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
    location: string;
    photos?: string[];
    recommendedAction: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  }[];

  // Recommendations
  recommendations: {
    recommendationType: 'IMMEDIATE_ACTION' | 'MONITOR' | 'SCHEDULE_MAINTENANCE' | 'INVESTIGATE';
    description: string;
    estimatedCost: number;
    timeline: string;
    consequences: string;
  }[];

  // Inspector information
  inspector: {
    inspectorId: string;
    inspectorName: string;
    qualifications: string[];
    certifications: string[];
  };

  // Historical comparison
  historicalComparison: {
    lastAssessmentDate?: Date;
    conditionChange: 'IMPROVED' | 'STABLE' | 'DETERIORATED';
    significantChanges: string[];
  };

  // Integration with other systems
  integration: {
    workOrdersGenerated: string[];
    maintenancePlansUpdated: string[];
    inventoryImpact: string[];
  };

  createdDate: Date;
  lastUpdated: Date;
}

export interface MaintenanceHistory {
  historyId: string;
  assetId: string;

  // Work order history
  workOrders: {
    workOrderId: string;
    workOrderNumber: string;
    workDate: Date;
    workType: 'CORRECTIVE' | 'PREVENTIVE' | 'PREDICTIVE' | 'MODIFICATION';
    description: string;
    cost: number;
    downtime: number; // hours
    effectivenessRating?: number; // 1-10
  }[];

  // Failure history
  failures: {
    failureId: string;
    failureDate: Date;
    failureMode: string;
    failureCause: string;
    impactSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    downtime: number;
    repairCost: number;
    preventiveActions: string[];
  }[];

  // Modification history
  modifications: {
    modificationId: string;
    modificationDate: Date;
    modificationType: 'UPGRADE' | 'RETROFIT' | 'IMPROVEMENT' | 'REPLACEMENT';
    description: string;
    cost: number;
    expectedBenefits: string[];
    actualResults?: string[];
  }[];

  // Cost history
  costHistory: {
    year: number;
    totalCost: number;
    preventiveCost: number;
    correctiveCost: number;
    modificationCost: number;
    laborCost: number;
    materialCost: number;
  }[];

  // Performance trends
  performanceTrends: {
    period: string;
    availability: number;
    reliability: number;
    maintainability: number;
    utilizationRate: number;
  }[];

  // Lessons learned
  lessonsLearned: {
    lessonId: string;
    category: string;
    description: string;
    impact: string;
    actionsTaken: string[];
    applicability: string[];
  }[];

  lastUpdated: Date;
}

export interface AssetAnalytics {
  analyticsId: string;
  reportType: 'PERFORMANCE' | 'COST' | 'RELIABILITY' | 'UTILIZATION' | 'LIFECYCLE' | 'PREDICTIVE';
  reportingPeriod: {
    startDate: Date;
    endDate: Date;
  };

  // Asset portfolio overview
  portfolioOverview?: {
    totalAssets: number;
    assetsByCategory: Record<string, number>;
    assetsByCondition: Record<string, number>;
    totalAssetValue: number;
    averageAssetAge: number;
  };

  // Performance analytics
  performanceData?: {
    overallEquipmentEffectiveness: number;
    availabilityRate: number;
    reliabilityMetrics: {
      mtbf: number;
      mttr: number;
      failureRate: number;
    };

    topPerformers: {
      assetId: string;
      assetName: string;
      performanceScore: number;
    }[];

    underPerformers: {
      assetId: string;
      assetName: string;
      performanceScore: number;
      issues: string[];
    }[];
  };

  // Cost analytics
  costData?: {
    totalMaintenanceCost: number;
    costPerAsset: number;
    costTrends: any[];

    costDistribution: {
      preventiveCost: number;
      correctiveCost: number;
      emergencyCost: number;
      laborCost: number;
      materialCost: number;
    };

    highestCostAssets: {
      assetId: string;
      assetName: string;
      totalCost: number;
    }[];
  };

  // Predictive analytics
  predictiveData?: {
    failurePredictions: {
      assetId: string;
      predictedFailureDate: Date;
      confidence: number;
      recommendedActions: string[];
    }[];

    maintenanceForecasting: {
      assetId: string;
      nextMaintenanceDate: Date;
      estimatedCost: number;
      priority: string;
    }[];

    optimizationOpportunities: {
      opportunityType: string;
      description: string;
      estimatedSavings: number;
      implementationEffort: 'LOW' | 'MEDIUM' | 'HIGH';
    }[];
  };

  // Risk analytics
  riskData?: {
    highRiskAssets: {
      assetId: string;
      riskScore: number;
      riskFactors: string[];
      mitigationActions: string[];
    }[];

    criticality: {
      criticalAssets: number;
      highCriticalityAssets: number;
      mediumCriticalityAssets: number;
      lowCriticalityAssets: number;
    };
  };

  // Insights and recommendations
  insights: {
    insightType: 'OPPORTUNITY' | 'RISK' | 'EFFICIENCY' | 'COST_OPTIMIZATION';
    title: string;
    description: string;
    impact: 'LOW' | 'MEDIUM' | 'HIGH';
    recommendedActions: string[];
    estimatedBenefit: number;
    implementationComplexity: 'LOW' | 'MEDIUM' | 'HIGH';
  }[];

  generatedDate: Date;
  lastUpdated: Date;
}

export interface PredictiveMaintenance {
  predictionId: string;
  assetId: string;
  predictionModel: 'STATISTICAL' | 'MACHINE_LEARNING' | 'PHYSICS_BASED' | 'HYBRID';

  // Data sources
  dataSources: {
    sourceType: 'SENSOR' | 'HISTORIAN' | 'INSPECTION' | 'MAINTENANCE_RECORDS';
    sourceId: string;
    dataPoints: number;
    dataQuality: 'HIGH' | 'MEDIUM' | 'LOW';
    lastUpdateDate: Date;
  }[];

  // Model configuration
  modelConfig: {
    algorithm: string;
    parameters: Record<string, any>;
    trainingDataSize: number;
    validationAccuracy: number;
    lastTrainingDate: Date;
  };

  // Current predictions
  predictions: {
    failureMode: string;
    probabilityOfFailure: number;
    timeToFailure: number; // hours
    confidenceInterval: { lower: number; upper: number };

    contributingFactors: {
      factor: string;
      importance: number; // 0-1
      currentValue: number;
      normalRange: { min: number; max: number };
    }[];

    recommendations: {
      action: string;
      urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'IMMEDIATE';
      estimatedCost: number;
      estimatedBenefit: number;
    }[];
  }[];

  // Anomaly detection
  anomalies: {
    detectionDate: Date;
    anomalyType: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    description: string;
    parameters: Record<string, number>;
    status: 'NEW' | 'ACKNOWLEDGED' | 'INVESTIGATED' | 'RESOLVED';
  }[];

  // Trend analysis
  trends: {
    parameter: string;
    trend: 'IMPROVING' | 'STABLE' | 'DEGRADING';
    changeRate: number;
    significance: 'LOW' | 'MEDIUM' | 'HIGH';
    historicalData: any[];
  }[];

  // Model performance
  modelPerformance: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    lastValidationDate: Date;

    predictionHistory: {
      predictionDate: Date;
      actualOutcome?: boolean;
      predictionAccuracy?: number;
    }[];
  };

  // Alerts and notifications
  alerts: {
    alertLevel: 'INFO' | 'WARNING' | 'CRITICAL';
    message: string;
    generatedDate: Date;
    acknowledged: boolean;
    acknowledgedBy?: string;
  }[];

  lastUpdated: Date;
}

export interface AssetReliability {
  reliabilityId: string;
  assetId: string;
  analysisType: 'WEIBULL' | 'EXPONENTIAL' | 'NORMAL' | 'LOGNORMAL';

  // Reliability parameters
  reliabilityParameters: {
    shape: number;
    scale: number;
    location?: number;
    mtbf: number; // Mean Time Between Failures
    characteristicLife: number;
  };

  // Failure data
  failureData: {
    totalFailures: number;
    totalOperatingTime: number;
    censoredData: boolean; // true if some data is incomplete

    failures: {
      failureTime: number; // hours of operation
      failureMode: string;
      severity: 'MINOR' | 'MAJOR' | 'CRITICAL';
      downtime: number;
    }[];
  };

  // Reliability metrics
  metrics: {
    reliability: number; // probability of success at time t
    availabilityInherent: number;
    availabilityOperational: number;
    maintainability: number;

    confidenceBounds: {
      lower: number;
      upper: number;
      confidenceLevel: number; // e.g., 0.95 for 95%
    };
  };

  // Life cycle analysis
  lifeCycleAnalysis: {
    phase: 'EARLY_LIFE' | 'USEFUL_LIFE' | 'WEAR_OUT';
    currentAge: number; // years
    expectedRemainingLife: number; // years
    replacementRecommendation: Date;

    bathtubCurveData: {
      time: number;
      failureRate: number;
    }[];
  };

  // Criticality analysis
  criticalityAnalysis: {
    operationalImpact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    safetyImpact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    environmentalImpact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    economicImpact: number; // cost per failure

    overallCriticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    criticalityMatrix: string;
  };

  // Improvement recommendations
  improvements: {
    improvementType:
      | 'DESIGN_CHANGE'
      | 'MAINTENANCE_STRATEGY'
      | 'OPERATING_PROCEDURE'
      | 'REPLACEMENT';
    description: string;
    expectedImprovement: number; // % increase in reliability
    implementationCost: number;
    paybackPeriod: number; // months
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
  }[];

  // Benchmarking
  benchmarking: {
    industryBenchmark?: {
      mtbf: number;
      availability: number;
      source: string;
    };

    internalBenchmark?: {
      bestInClass: string; // Asset ID
      performanceGap: number;
    };
  };

  analysisDate: Date;
  lastUpdated: Date;
}

export interface MaintenanceInventory {
  inventoryId: string;
  warehouseId: string;
  warehouseName: string;

  // Inventory overview
  overview: {
    totalItems: number;
    totalValue: number;
    categories: string[];
    turnoverRate: number;
    serviceLevel: number; // % of demands satisfied from stock
  };

  // Inventory items
  items: {
    itemId: string;
    partNumber: string;
    description: string;
    category: 'SPARE_PART' | 'CONSUMABLE' | 'TOOL' | 'SAFETY_EQUIPMENT' | 'LUBRICANT';

    // Stock information
    currentStock: number;
    unitOfMeasure: string;
    location: {
      bin: string;
      row?: string;
      section?: string;
    };

    // Planning parameters
    minimumStock: number;
    maximumStock: number;
    reorderPoint: number;
    economicOrderQuantity: number;
    safetyStock: number;

    // Supplier information
    preferredSupplier: {
      supplierId: string;
      supplierName: string;
      leadTime: number; // days
      unitPrice: number;
      minimumOrderQuantity: number;
    };

    // Asset associations
    applicableAssets: {
      assetId: string;
      consumptionRate?: number; // per month
      criticalityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    }[];

    // Financial data
    unitCost: number;
    totalValue: number;
    averageUsage: number; // per month
    lastIssueDate?: Date;

    // Status
    status: 'ACTIVE' | 'SLOW_MOVING' | 'OBSOLETE' | 'QUARANTINE';

    // Quality information
    qualityControl: {
      inspectionRequired: boolean;
      shelfLife?: number; // months
      storageRequirements?: string[];
      hazardousClassification?: string;
    };
  }[];

  // Inventory movements
  movements: {
    movementId: string;
    movementType: 'RECEIPT' | 'ISSUE' | 'TRANSFER' | 'ADJUSTMENT' | 'RETURN';
    partNumber: string;
    quantity: number;

    // Transaction details
    transactionDate: Date;
    workOrderId?: string;
    issuedTo?: string;
    reason: string;
    cost: number;

    // References
    documentNumber?: string;
    supplierInfo?: {
      supplierId: string;
      purchaseOrder: string;
      receipt: string;
    };
  }[];

  // Stock analysis
  stockAnalysis: {
    abcAnalysis: {
      aItems: number; // high value items
      bItems: number; // medium value items
      cItems: number; // low value items
    };

    velocityAnalysis: {
      fastMoving: number;
      mediumMoving: number;
      slowMoving: number;
      nonMoving: number;
    };

    stockouts: {
      partNumber: string;
      stockoutDate: Date;
      duration: number; // days
      impact: string;
    }[];

    excessStock: {
      partNumber: string;
      excessQuantity: number;
      excessValue: number;
      reason: string;
    }[];
  };

  // Procurement planning
  procurement: {
    pendingOrders: {
      partNumber: string;
      orderQuantity: number;
      expectedDelivery: Date;
      supplierId: string;
      orderValue: number;
    }[];

    reorderRecommendations: {
      partNumber: string;
      recommendedQuantity: number;
      urgency: 'LOW' | 'MEDIUM' | 'HIGH';
      justification: string;
    }[];
  };

  // Performance metrics
  performance: {
    inventoryTurnover: number;
    stockoutRate: number; // % of time out of stock
    fillRate: number; // % of demands filled immediately
    inventoryAccuracy: number; // % of items with correct quantities
    totalInventoryValue: number;

    monthlyMetrics: {
      month: string;
      receipts: number;
      issues: number;
      adjustments: number;
      value: number;
    }[];
  };

  lastUpdated: Date;
}
