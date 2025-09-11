/**
 * Condition-Based Management Types
 * Fortune 100 grade condition monitoring and predictive maintenance types
 */

// ================================
// CONDITION MONITORING TYPES
// ================================

export interface ConditionMonitoringSystem {
  monitoringId: string;
  assetId: string;
  systemName: string;
  monitoringType:
    | 'VIBRATION'
    | 'TEMPERATURE'
    | 'PRESSURE'
    | 'FLOW'
    | 'ELECTRICAL'
    | 'ACOUSTIC'
    | 'VISUAL'
    | 'MULTI_PARAMETER';

  // Sensor configuration
  sensors: {
    sensorId: string;
    sensorType: string;
    location: string;
    parameter: string;
    unit: string;
    samplingRate: number; // Hz
    accuracy: number; // percentage
    range: { min: number; max: number };
    calibrationDate: Date;
    nextCalibrationDate: Date;
  }[];

  // Data collection
  dataCollection: {
    collectionFrequency: 'CONTINUOUS' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'ON_DEMAND';
    dataRetentionPeriod: number; // days
    storageLocation: string;
    dataQuality: 'HIGH' | 'MEDIUM' | 'LOW';
    lastDataUpdate: Date;
  };

  // Baseline and thresholds
  baseline: {
    establishedDate: Date;
    baselineValues: Record<string, number>;
    normalOperatingRange: Record<string, { min: number; max: number }>;
    seasonalAdjustments?: Record<string, number>;
  };

  // Alert thresholds
  alertThresholds: {
    parameter: string;
    warningLevel: number;
    alertLevel: number;
    criticalLevel: number;
    emergencyLevel: number;
    trendThreshold: number; // rate of change
  }[];

  // Integration
  integration: {
    scadaSystem?: string;
    historyServer?: string;
    analyticsEngine?: string;
    maintenanceSystem: string;
    notificationSystem: string;
  };

  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'CALIBRATION';

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface PredictiveMaintenanceModel {
  modelId: string;
  assetId: string;
  modelName: string;
  modelType:
    | 'FAILURE_PREDICTION'
    | 'PERFORMANCE_DEGRADATION'
    | 'REMAINING_USEFUL_LIFE'
    | 'ANOMALY_DETECTION';

  // Model configuration
  configuration: {
    algorithm: 'REGRESSION' | 'CLASSIFICATION' | 'TIME_SERIES' | 'NEURAL_NETWORK' | 'ENSEMBLE';
    inputParameters: string[];
    targetVariable: string;
    predictionHorizon: number; // days
    updateFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  };

  // Training data
  trainingData: {
    dataSource: string;
    trainingPeriod: { startDate: Date; endDate: Date };
    recordCount: number;
    dataQuality: 'HIGH' | 'MEDIUM' | 'LOW';
    featureEngineering: string[];
    preprocessingSteps: string[];
  };

  // Model performance
  performance: {
    accuracy: number; // percentage
    precision: number;
    recall: number;
    f1Score: number;
    meanAbsoluteError?: number;
    rootMeanSquareError?: number;
    lastEvaluationDate: Date;
  };

  // Predictions
  currentPrediction: {
    predictionDate: Date;
    predictedValue: number;
    confidenceInterval: { lower: number; upper: number };
    probabilityOfFailure?: number;
    remainingUsefulLife?: number;
    recommendedAction: string;
  };

  // Model validation
  validation: {
    crossValidationScore: number;
    outOfSampleAccuracy: number;
    validationPeriod: { startDate: Date; endDate: Date };
    modelDrift: number; // percentage
    retrainingRequired: boolean;
    lastRetrainingDate?: Date;
  };

  // Alerts and notifications
  alerts: {
    alertType: 'PREDICTION_THRESHOLD' | 'MODEL_DRIFT' | 'DATA_QUALITY' | 'CONFIDENCE_LOW';
    threshold: number;
    recipients: string[];
    escalationRules: string[];
  }[];

  status: 'TRAINING' | 'ACTIVE' | 'DEPRECATED' | 'FAILED';

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface AssetHealthScore {
  healthScoreId: string;
  assetId: string;
  calculationDate: Date;

  // Overall health score
  overallScore: number; // 0-100
  healthGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  healthStatus: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';

  // Component scores
  componentScores: {
    componentId: string;
    componentName: string;
    score: number; // 0-100
    weight: number; // contribution to overall score
    status: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';
    lastInspectionDate?: Date;
    nextInspectionDue?: Date;
  }[];

  // Health indicators
  healthIndicators: {
    indicator: string;
    currentValue: number;
    normalRange: { min: number; max: number };
    trend: 'IMPROVING' | 'STABLE' | 'DEGRADING' | 'CRITICAL';
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    dataSource: string;
  }[];

  // Risk assessment
  riskAssessment: {
    failureRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    consequences: {
      safety: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      environmental: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      production: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      financial: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    };
    overallRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    mitigationRequired: boolean;
  };

  // Trends and projections
  trends: {
    historicalScores: {
      date: Date;
      score: number;
      grade: string;
    }[];
    trendAnalysis: {
      trend: 'IMPROVING' | 'STABLE' | 'DEGRADING';
      rate: number; // points per month
      projectedScore: number; // in 6 months
      confidenceLevel: number; // percentage
    };
  };

  // Recommendations
  recommendations: {
    priority: 'IMMEDIATE' | 'HIGH' | 'MEDIUM' | 'LOW';
    action: string;
    expectedImpact: number; // points improvement
    estimatedCost: number;
    timeline: string;
    responsible: string;
  }[];

  // Calculation methodology
  methodology: {
    calculationMethod: string;
    dataInputs: string[];
    weightingFactors: Record<string, number>;
    adjustmentFactors: Record<string, number>;
    lastCalibrationDate: Date;
  };

  createdAt: Date;
  createdBy: string;
}

export interface ConditionBasedAlert {
  alertId: string;
  assetId: string;
  alertType:
    | 'THRESHOLD_EXCEEDED'
    | 'TREND_DEVIATION'
    | 'ANOMALY_DETECTED'
    | 'PREDICTION_TRIGGERED'
    | 'HEALTH_DEGRADED';

  // Alert details
  alertDetails: {
    parameter: string;
    currentValue: number;
    thresholdValue: number;
    severity: 'INFO' | 'WARNING' | 'ALERT' | 'CRITICAL' | 'EMERGENCY';
    description: string;
    detectedAt: Date;
    source: string;
  };

  // Alert data
  triggerData: {
    sensorId?: string;
    measurementValue: number;
    measurementUnit: string;
    trendData?: {
      previousValue: number;
      changeRate: number;
      timeWindow: number; // hours
    };
    contextData?: Record<string, any>;
  };

  // Response requirements
  response: {
    responseRequired: boolean;
    responseTimeframe: number; // hours
    responseActions: string[];
    responsibleParty: string;
    escalationRules: {
      escalationLevel: number;
      timeToEscalate: number; // hours
      escalateTo: string;
    }[];
  };

  // Resolution
  resolution?: {
    resolvedAt: Date;
    resolvedBy: string;
    resolution: string;
    actionsTaken: string[];
    rootCause?: string;
    preventiveActions?: string[];
    followUpRequired: boolean;
  };

  // Impact assessment
  impact: {
    safetyImpact: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    productionImpact: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    environmentalImpact: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    financialImpact: number;
    reputationalImpact: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  };

  // Notification log
  notifications: {
    notificationId: string;
    recipient: string;
    method: 'EMAIL' | 'SMS' | 'PUSH' | 'VOICE' | 'DASHBOARD';
    sentAt: Date;
    acknowledged: boolean;
    acknowledgedAt?: Date;
    acknowledgedBy?: string;
  }[];

  status: 'OPEN' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'FALSE_ALARM';

  createdAt: Date;
  updatedAt: Date;
}

export interface MaintenanceOptimization {
  optimizationId: string;
  assetId: string;
  optimizationName: string;
  optimizationType: 'SCHEDULE' | 'STRATEGY' | 'RESOURCE' | 'COST' | 'RELIABILITY';

  // Current state analysis
  currentState: {
    maintenanceStrategy: string;
    annualCost: number;
    meanTimeBetweenFailure: number; // hours
    meanTimeToRepair: number; // hours
    availability: number; // percentage
    reliabilityMetrics: {
      uptime: number;
      downtime: number;
      failureRate: number;
      repairRate: number;
    };
  };

  // Optimization objectives
  objectives: {
    primaryObjective:
      | 'MINIMIZE_COST'
      | 'MAXIMIZE_AVAILABILITY'
      | 'OPTIMIZE_RELIABILITY'
      | 'REDUCE_RISK';
    targetMetrics: {
      costReduction: number; // percentage
      availabilityImprovement: number; // percentage
      reliabilityImprovement: number; // percentage
      riskReduction: number; // percentage
    };
    constraints: {
      budgetLimit?: number;
      downtimeLimit?: number; // hours per year
      resourceConstraints?: string[];
      complianceRequirements?: string[];
    };
  };

  // Optimization analysis
  analysis: {
    dataAnalysisPeriod: { startDate: Date; endDate: Date };
    failurePatterns: {
      failureMode: string;
      frequency: number;
      impact: string;
      rootCauses: string[];
    }[];
    costBreakdown: {
      preventiveCost: number;
      correctiveCost: number;
      downtimeCost: number;
      totalCost: number;
    };
    performanceGaps: {
      metric: string;
      currentValue: number;
      benchmarkValue: number;
      gap: number;
      improvementPotential: number;
    }[];
  };

  // Optimization scenarios
  scenarios: {
    scenarioName: string;
    description: string;
    changes: {
      maintenanceFrequency?: number;
      maintenanceType?: string;
      resourceAllocation?: Record<string, number>;
      technologyUpgrade?: string[];
    };
    projectedOutcomes: {
      costImpact: number;
      availabilityImpact: number;
      reliabilityImpact: number;
      riskImpact: string;
    };
    implementationRequirements: {
      investmentRequired: number;
      resourcesNeeded: string[];
      timeline: number; // months
      riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    };
    costBenefitAnalysis: {
      initialInvestment: number;
      annualSavings: number;
      paybackPeriod: number; // months
      netPresentValue: number;
      internalRateOfReturn: number;
    };
  }[];

  // Recommended strategy
  recommendedStrategy: {
    strategyName: string;
    description: string;
    benefits: string[];
    risks: string[];
    implementationPlan: {
      phases: {
        phase: number;
        description: string;
        duration: number; // months
        activities: string[];
        deliverables: string[];
      }[];
      resources: {
        resourceType: string;
        quantity: number;
        duration: number; // months
      }[];
      budget: {
        category: string;
        amount: number;
      }[];
    };
  };

  // Performance tracking
  tracking: {
    kpis: {
      kpi: string;
      baseline: number;
      target: number;
      current?: number;
      unit: string;
    }[];
    monitoringPlan: {
      metric: string;
      frequency: string;
      responsible: string;
      reportingTo: string;
    }[];
    reviewSchedule: {
      reviewType: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
      nextReview: Date;
      stakeholders: string[];
    };
  };

  status: 'ANALYSIS' | 'APPROVED' | 'IMPLEMENTATION' | 'MONITORING' | 'COMPLETED';

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface ReliabilityCenteredMaintenance {
  rcmId: string;
  assetId: string;
  rcmName: string;
  analysisDate: Date;

  // RCM methodology
  methodology: {
    standard: 'SAE_JA1011' | 'MSG_3' | 'ISO_14224' | 'CUSTOM';
    analysisTeam: string[];
    facilitator: string;
    reviewBoard: string[];
  };

  // Asset functions
  functions: {
    functionId: string;
    primaryFunction: string;
    secondaryFunctions: string[];
    performanceStandards: {
      parameter: string;
      specification: string;
      acceptableLimits: string;
    }[];
    operatingContext: string;
  }[];

  // Functional failures
  functionalFailures: {
    failureId: string;
    functionId: string;
    failureDescription: string;
    failureMode: string;
    failureCauses: string[];
    failureEffects: {
      localEffects: string[];
      systemEffects: string[];
      endEffects: string[];
    };
    consequences: {
      safety: 'NONE' | 'MINOR' | 'MAJOR' | 'CRITICAL';
      environmental: 'NONE' | 'MINOR' | 'MAJOR' | 'CRITICAL';
      operational: 'NONE' | 'MINOR' | 'MAJOR' | 'CRITICAL';
      nonOperational: 'NONE' | 'MINOR' | 'MAJOR' | 'CRITICAL';
    };
    riskPriority: number; // 1-10
  }[];

  // Maintenance tasks
  maintenanceTasks: {
    taskId: string;
    failureId: string;
    taskType: 'TIME_DIRECTED' | 'CONDITION_DIRECTED' | 'FAILURE_FINDING' | 'ONE_TIME_CHANGE';
    taskDescription: string;
    interval: {
      value: number;
      unit: 'HOURS' | 'DAYS' | 'MONTHS' | 'CYCLES' | 'USAGE_BASED';
    };
    duration: number; // hours
    resources: {
      laborHours: number;
      skillsRequired: string[];
      toolsRequired: string[];
      partsRequired: string[];
    };
    effectiveness: {
      preventionCapability: number; // percentage
      detectionCapability: number; // percentage
      costEffectiveness: 'HIGH' | 'MEDIUM' | 'LOW';
    };
    feasibility: {
      technical: 'FEASIBLE' | 'DIFFICULT' | 'NOT_FEASIBLE';
      economic: 'JUSTIFIED' | 'MARGINAL' | 'NOT_JUSTIFIED';
      organizational: 'ACCEPTABLE' | 'CHALLENGING' | 'NOT_ACCEPTABLE';
    };
  }[];

  // RCM decisions
  decisions: {
    decisionId: string;
    failureId: string;
    decisionLogic: string[];
    selectedStrategy:
      | 'SCHEDULED_RESTORATION'
      | 'SCHEDULED_DISCARD'
      | 'ON_CONDITION'
      | 'FAILURE_FINDING'
      | 'RUN_TO_FAILURE'
      | 'REDESIGN';
    justification: string;
    alternativesConsidered: string[];
    assumptions: string[];
  }[];

  // Living program
  livingProgram: {
    reviewFrequency: 'ANNUAL' | 'BIENNIAL' | 'TRIENNIAL';
    nextReviewDate: Date;
    performanceMonitoring: {
      metric: string;
      target: number;
      current?: number;
      trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
    }[];
    changeTriggers: string[];
    updateProcess: string;
  };

  // Cost-benefit analysis
  costBenefit: {
    currentMaintenanceCost: number;
    proposedMaintenanceCost: number;
    avoidedFailureCosts: number;
    implementationCosts: number;
    netBenefit: number;
    benefitCostRatio: number;
    paybackPeriod: number; // months
  };

  status: 'INITIAL_ANALYSIS' | 'REVIEW' | 'APPROVED' | 'IMPLEMENTED' | 'LIVING_PROGRAM';

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface FailureModeAnalysis {
  fmeaId: string;
  assetId: string;
  analysisName: string;
  analysisType: 'DESIGN_FMEA' | 'PROCESS_FMEA' | 'MAINTENANCE_FMEA';

  // Analysis scope
  scope: {
    systemBoundaries: string;
    analysisLevel: 'SYSTEM' | 'SUBSYSTEM' | 'COMPONENT';
    operatingConditions: string;
    missionProfile: string;
    excludedItems: string[];
  };

  // FMEA team
  team: {
    teamLeader: string;
    teamMembers: {
      name: string;
      role: string;
      expertise: string[];
    }[];
    reviewers: string[];
    approvers: string[];
  };

  // Failure modes
  failureModes: {
    itemId: string;
    itemName: string;
    function: string;
    failureMode: string;
    failureCauses: {
      cause: string;
      causeCategory:
        | 'DESIGN'
        | 'MANUFACTURING'
        | 'INSTALLATION'
        | 'OPERATION'
        | 'MAINTENANCE'
        | 'EXTERNAL';
      likelihood: number; // 1-10
    }[];
    failureEffects: {
      localEffect: string;
      nextLevelEffect: string;
      systemEffect: string;
      endUserEffect: string;
    };
    currentControls: {
      preventionControls: string[];
      detectionControls: string[];
      controlEffectiveness: 'HIGH' | 'MEDIUM' | 'LOW';
    };
    riskAssessment: {
      severity: number; // 1-10
      occurrence: number; // 1-10
      detection: number; // 1-10
      riskPriorityNumber: number; // S × O × D
    };
    recommendedActions: {
      action: string;
      actionCategory:
        | 'DESIGN_CHANGE'
        | 'PROCESS_CHANGE'
        | 'CONTROL_IMPROVEMENT'
        | 'MONITORING_ENHANCEMENT';
      responsibility: string;
      targetDate: Date;
      status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    }[];
    residualRisk: {
      severity: number;
      occurrence: number;
      detection: number;
      residualRPN: number;
    };
  }[];

  // Risk matrix
  riskMatrix: {
    riskLevel: 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW' | 'VERY_LOW';
    rpnRange: { min: number; max: number };
    actionRequired: string;
    approvalRequired: boolean;
    count: number;
  }[];

  // Critical failure modes
  criticalFailureModes: {
    failureModeId: string;
    criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    justification: string;
    immediateActions: string[];
    longTermActions: string[];
  }[];

  // Analysis results
  results: {
    totalFailureModes: number;
    highRiskFailureModes: number;
    averageRPN: number;
    riskReduction: number; // percentage after actions
    keyFindings: string[];
    lessons_learned: string[];
  };

  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'IMPLEMENTED' | 'UPDATED';

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface MaintenanceStrategy {
  strategyId: string;
  assetId: string;
  strategyName: string;
  strategyType: 'REACTIVE' | 'PREVENTIVE' | 'PREDICTIVE' | 'PROACTIVE' | 'RCM_BASED' | 'HYBRID';

  // Strategy definition
  definition: {
    description: string;
    applicableAssets: string[];
    operatingContext: string;
    businessObjectives: string[];
    constraints: string[];
  };

  // Maintenance mix
  maintenanceMix: {
    reactive: {
      percentage: number;
      applicability: string[];
      conditions: string[];
    };
    preventive: {
      percentage: number;
      timeBasedTasks: string[];
      usageBasedTasks: string[];
      intervals: Record<string, string>;
    };
    predictive: {
      percentage: number;
      technologies: string[];
      parameters: string[];
      algorithms: string[];
    };
    proactive: {
      percentage: number;
      rootCauseElimination: string[];
      designImprovements: string[];
      operatingPractices: string[];
    };
  };

  // Performance targets
  targets: {
    availability: number; // percentage
    reliability: {
      mtbf: number; // hours
      failureRate: number; // failures per year
      survivalProbability: number; // percentage at end of period
    };
    maintainability: {
      mttr: number; // hours
      maintenanceCompliance: number; // percentage
      firstTimeFixRate: number; // percentage
    };
    cost: {
      maintenanceCostRatio: number; // percentage of asset value
      costPerUnit: number;
      budgetVariance: number; // percentage
    };
  };

  // Implementation plan
  implementation: {
    phases: {
      phase: string;
      duration: number; // months
      activities: string[];
      deliverables: string[];
      resources: string[];
    }[];
    training: {
      program: string;
      audience: string[];
      duration: number; // hours
      certification: boolean;
    }[];
    technology: {
      systems: string[];
      tools: string[];
      integrations: string[];
      investmentRequired: number;
    };
    processes: {
      procedures: string[];
      workflows: string[];
      approvals: string[];
      documentation: string[];
    };
  };

  // Resource requirements
  resources: {
    personnel: {
      role: string;
      skillLevel: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
      certification: string[];
      fte: number; // full-time equivalent
    }[];
    tools: {
      tool: string;
      purpose: string;
      quantity: number;
      cost: number;
    }[];
    inventory: {
      partCategory: string;
      stockingLevel: 'NONE' | 'MINIMUM' | 'MODERATE' | 'HIGH';
      investmentRequired: number;
    }[];
  };

  // Risk assessment
  risks: {
    risk: string;
    category: 'TECHNICAL' | 'ORGANIZATIONAL' | 'FINANCIAL' | 'OPERATIONAL';
    probability: 'LOW' | 'MEDIUM' | 'HIGH';
    impact: 'LOW' | 'MEDIUM' | 'HIGH';
    mitigation: string;
    owner: string;
  }[];

  // Success metrics
  successMetrics: {
    metric: string;
    baseline: number;
    target: number;
    measurement: string;
    frequency: string;
    responsible: string;
  }[];

  // Review and improvement
  review: {
    reviewFrequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
    stakeholders: string[];
    successCriteria: string[];
    improvementProcess: string;
    benchmarking: {
      internal: boolean;
      external: boolean;
      sources: string[];
    };
  };

  status: 'DEVELOPMENT' | 'APPROVED' | 'PILOT' | 'IMPLEMENTATION' | 'ACTIVE' | 'REVIEW' | 'RETIRED';

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}
