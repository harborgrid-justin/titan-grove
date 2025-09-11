/**
 * Equipment Cost Analysis Types
 * Comprehensive types for Fortune 100 grade equipment cost analysis and optimization
 */

// ================================
// CORE COST ANALYSIS TYPES
// ================================

export interface EquipmentCostProfile {
  costProfileId: string;
  equipmentId: string;
  equipmentName: string;
  equipmentCategory: string;

  // Cost classification
  costClassification: {
    primaryCostCenter: string;
    secondaryCostCenters: string[];
    costType: 'CAPEX' | 'OPEX' | 'MIXED';
    budgetCategory: string;
    accountingCode: string;
  };

  // Acquisition costs
  acquisitionCosts: {
    purchasePrice: number;
    shippingCosts: number;
    installationCosts: number;
    commissioningCosts: number;
    trainingCosts: number;
    initialSpareParts: number;
    warrantyExtension?: number;
    totalAcquisitionCost: number;
  };

  // Operating costs (annual)
  operatingCosts: {
    energy: {
      electricity: number;
      fuel: number;
      other: number;
      total: number;
    };
    labor: {
      operators: number;
      supervisors: number;
      support: number;
      total: number;
    };
    materials: {
      consumables: number;
      supplies: number;
      lubricants: number;
      total: number;
    };
    utilities: {
      water: number;
      compressed_air: number;
      steam: number;
      other: number;
      total: number;
    };
    overhead: {
      facility: number;
      insurance: number;
      administration: number;
      total: number;
    };
    totalOperatingCosts: number;
  };

  // Maintenance costs (annual)
  maintenanceCosts: {
    preventive: {
      laborHours: number;
      laborRate: number;
      laborCost: number;
      parts: number;
      materials: number;
      contracts: number;
      total: number;
    };
    corrective: {
      laborHours: number;
      laborRate: number;
      laborCost: number;
      parts: number;
      materials: number;
      emergencyFees: number;
      total: number;
    };
    predictive: {
      monitoring: number;
      analysis: number;
      software: number;
      total: number;
    };
    outsourced: {
      serviceContracts: number;
      emergencyServices: number;
      specializedWork: number;
      total: number;
    };
    totalMaintenanceCosts: number;
  };

  // Downtime costs
  downtimeCosts: {
    plannedDowntime: {
      hoursPerYear: number;
      lostProductionValue: number;
      opportunityCost: number;
      total: number;
    };
    unplannedDowntime: {
      hoursPerYear: number;
      lostProductionValue: number;
      emergencyResponseCost: number;
      qualityImpactCost: number;
      customerImpactCost: number;
      total: number;
    };
    totalDowntimeCosts: number;
  };

  // End-of-life costs
  endOfLifeCosts: {
    decommissioningCosts: number;
    disposalCosts: number;
    environmentalRemediation: number;
    siteRestoration: number;
    residualValue: number; // negative if equipment has salvage value
    totalEndOfLifeCosts: number;
  };

  // Cost performance metrics
  performanceMetrics: {
    costPerUnit: number; // cost per unit of production
    costPerHour: number; // cost per operating hour
    maintenanceRatio: number; // maintenance cost / acquisition cost
    reliabilityCost: number; // cost of unreliability
    efficiencyCost: number; // cost of inefficiency
    complianceCost: number; // regulatory and compliance costs
  };

  // Time period for analysis
  analysisPeriod: {
    startDate: Date;
    endDate: Date;
    analysisYears: number;
    discountRate: number;
    inflationRate: number;
  };

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface TotalCostOfOwnership {
  tcoId: string;
  equipmentId: string;
  analysisName: string;
  analysisDate: Date;

  // Analysis parameters
  parameters: {
    analysisHorizon: number; // years
    discountRate: number; // percentage
    inflationRate: number; // percentage
    taxRate: number; // percentage
    analysisMethod: 'NPV' | 'LEVELIZED' | 'SIMPLE';
  };

  // Cost components summary
  costSummary: {
    totalAcquisitionCost: number;
    totalOperatingCosts: number; // NPV
    totalMaintenanceCosts: number; // NPV
    totalDowntimeCosts: number; // NPV
    totalEndOfLifeCosts: number; // NPV
    totalCostOfOwnership: number; // NPV
  };

  // Annual cost breakdown
  annualCosts: {
    year: number;
    acquisitionCost: number;
    operatingCost: number;
    maintenanceCost: number;
    downtimeCost: number;
    endOfLifeCost: number;
    totalCost: number;
    presentValue: number;
    cumulativePV: number;
  }[];

  // Cost per unit analysis
  unitCostAnalysis: {
    unitsProduced: number; // total over lifecycle
    costPerUnit: number;
    productionCapacity: number; // annual
    utilizationRate: number; // percentage
    costPerCapacityUnit: number;
  };

  // Sensitivity analysis
  sensitivityAnalysis: {
    scenarios: {
      scenarioName: string;
      probability: number;
      assumptions: Record<string, number>;
      totalCost: number;
      variance: number; // percentage from base case
    }[];
    variables: {
      variable: string;
      baseValue: number;
      sensitivityRange: {
        change: number; // percentage
        costImpact: number;
        impactPercentage: number;
      }[];
    }[];
  };

  // Risk analysis
  riskAnalysis: {
    costRisks: {
      risk: string;
      probability: number; // percentage
      impact: number; // cost impact
      riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      mitigation: string;
    }[];
    contingencyRecommendation: number; // percentage of total cost
    confidenceLevel: number; // percentage
  };

  // Benchmarking
  benchmarking: {
    industryAverage: number;
    bestInClass: number;
    worstInClass: number;
    percentileRanking: number;
    benchmarkSource: string;
    competitivePosition: 'BEST_IN_CLASS' | 'ABOVE_AVERAGE' | 'AVERAGE' | 'BELOW_AVERAGE';
  };

  // Recommendations
  recommendations: {
    immediate: {
      action: string;
      costImpact: number;
      implementationCost: number;
      paybackPeriod: number; // months
    }[];
    shortTerm: {
      action: string;
      costImpact: number;
      implementationCost: number;
      timeline: number; // months
    }[];
    longTerm: {
      action: string;
      costImpact: number;
      strategicValue: string;
    }[];
  };

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface CostBenchmark {
  benchmarkId: string;
  benchmarkName: string;
  equipmentCategory: string;
  industrySegment: string;

  // Benchmark data
  benchmarkData: {
    dataPoints: number;
    dataSource: string;
    dataQuality: 'HIGH' | 'MEDIUM' | 'LOW';
    lastUpdated: Date;
    geographicScope: string[];
  };

  // Cost metrics
  costMetrics: {
    metric: string;
    unit: string;
    percentiles: {
      p10: number; // best in class
      p25: number;
      p50: number; // median
      p75: number;
      p90: number; // worst in class
    };
    average: number;
    standardDeviation: number;
  }[];

  // Performance correlation
  performanceCorrelation: {
    metric: string;
    costCorrelation: number; // correlation coefficient
    performanceRange: {
      low: number;
      median: number;
      high: number;
    };
    costRange: {
      low: number;
      median: number;
      high: number;
    };
  }[];

  // Industry factors
  industryFactors: {
    factor: string;
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    description: string;
    quantification?: number;
  }[];

  // Regional variations
  regionalVariations: {
    region: string;
    costMultiplier: number;
    factors: string[];
    dataPoints: number;
  }[];

  // Trending data
  trends: {
    year: number;
    averageCost: number;
    change: number; // percentage year over year
    drivingFactors: string[];
  }[];

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface LifecycleCostAnalysis {
  analysisId: string;
  equipmentId: string;
  analysisName: string;

  // Lifecycle phases
  phases: {
    phaseName: string;
    startYear: number;
    endYear: number;
    duration: number; // years
    description: string;
    majorActivities: string[];
    costProfile: {
      capitalCosts: number;
      operatingCosts: number; // annual average
      maintenanceCosts: number; // annual average
      totalPhaseCost: number; // NPV
    };
  }[];

  // Cost evolution
  costEvolution: {
    year: number;
    phase: string;
    capitalCosts: number;
    operatingCosts: number;
    maintenanceCosts: number;
    cumulativeCosts: number;
    inflationAdjustedCosts: number;
    presentValue: number;
  }[];

  // Key cost drivers by phase
  costDrivers: {
    phase: string;
    drivers: {
      driver: string;
      costImpact: number;
      percentOfPhase: number;
      controllability: 'HIGH' | 'MEDIUM' | 'LOW';
      optimization_potential: number; // percentage
    }[];
  }[];

  // Lifecycle optimization
  optimization: {
    currentStrategy: string;
    alternativeStrategies: {
      strategyName: string;
      description: string;
      costImpact: number;
      riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
      implementationComplexity: 'LOW' | 'MEDIUM' | 'HIGH';
      benefits: string[];
      drawbacks: string[];
    }[];
    recommendedStrategy: string;
  };

  // Replacement analysis
  replacementAnalysis: {
    optimalReplacementYear: number;
    replacementTriggers: {
      trigger: string;
      threshold: number;
      currentValue: number;
      probability: number; // percentage
    }[];
    replacementCost: number;
    replacementBenefits: {
      benefit: string;
      annualValue: number;
      totalValue: number; // NPV
    }[];
  };

  // Economic indicators
  economicIndicators: {
    netPresentValue: number;
    annualizedCost: number; // levelized cost
    internalRateOfReturn: number;
    paybackPeriod: number; // years
    profitabilityIndex: number;
    economicLife: number; // years
  };

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface CostOptimization {
  optimizationId: string;
  equipmentId?: string;
  fleetId?: string;
  optimizationName: string;

  // Current state analysis
  currentState: {
    totalAnnualCost: number;
    costBreakdown: {
      category: string;
      amount: number;
      percentage: number;
    }[];
    inefficiencies: {
      area: string;
      wastedCost: number;
      rootCauses: string[];
    }[];
    benchmarkPosition: string;
  };

  // Optimization objectives
  objectives: {
    costReductionTarget: number; // percentage
    qualityMaintenance: boolean;
    timelineConstraints: number; // months
    budgetConstraints: number;
    riskTolerance: 'LOW' | 'MEDIUM' | 'HIGH';
    strategicPriorities: string[];
  };

  // Optimization opportunities
  opportunities: {
    opportunityId: string;
    opportunityName: string;
    category: 'PROCUREMENT' | 'OPERATING' | 'MAINTENANCE' | 'ENERGY' | 'LABOR' | 'PROCESS';
    description: string;
    annualSavings: number;
    implementationCost: number;
    paybackPeriod: number; // months
    difficulty: 'LOW' | 'MEDIUM' | 'HIGH';
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    dependencies: string[];
    prerequisites: string[];
  }[];

  // Optimization scenarios
  scenarios: {
    scenarioName: string;
    description: string;
    includedOpportunities: string[];
    totalImplementationCost: number;
    totalAnnualSavings: number;
    netPresentValue: number;
    riskProfile: 'LOW' | 'MEDIUM' | 'HIGH';
    implementationTimeline: number; // months
    successProbability: number; // percentage
  }[];

  // Implementation roadmap
  roadmap: {
    selectedScenario: string;
    phases: {
      phase: number;
      phaseName: string;
      duration: number; // months
      opportunities: string[];
      investmentRequired: number;
      expectedSavings: number;
      milestones: {
        milestone: string;
        targetDate: Date;
        successCriteria: string;
      }[];
    }[];
    criticalPath: string[];
    resourceRequirements: {
      resourceType: string;
      requiredCapacity: number;
      duration: number; // months
      cost: number;
    }[];
  };

  // Performance tracking
  tracking: {
    kpis: {
      kpi: string;
      baseline: number;
      target: number;
      currentValue?: number;
      unit: string;
    }[];
    reviewSchedule: {
      reviewType: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
      nextReviewDate: Date;
      stakeholders: string[];
    };
    escalationTriggers: {
      metric: string;
      threshold: number;
      action: string;
    }[];
  };

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface CostBreakdown {
  breakdownId: string;
  equipmentId: string;
  breakdownType: 'FUNCTIONAL' | 'TEMPORAL' | 'ORGANIZATIONAL' | 'ACTIVITY_BASED';
  reportingPeriod: {
    startDate: Date;
    endDate: Date;
    periodType: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  };

  // Hierarchical cost structure
  costHierarchy: {
    level1: {
      categoryName: string;
      totalCost: number;
      percentage: number;
      level2: {
        subcategoryName: string;
        totalCost: number;
        percentage: number;
        level3?: {
          itemName: string;
          totalCost: number;
          percentage: number;
          details: string;
        }[];
      }[];
    }[];
  };

  // Cost by function
  functionalBreakdown: {
    function: string;
    directCosts: number;
    indirectCosts: number;
    allocatedCosts: number;
    totalCosts: number;
    percentage: number;
    costDriver: string;
  }[];

  // Cost by time period
  temporalBreakdown: {
    period: string;
    costs: {
      category: string;
      amount: number;
    }[];
    totalCost: number;
    variance: number; // compared to budget/previous period
  }[];

  // Variable vs fixed costs
  variabilityAnalysis: {
    fixedCosts: {
      category: string;
      amount: number;
      percentage: number;
    }[];
    variableCosts: {
      category: string;
      amount: number;
      percentage: number;
      variabilityFactor: string;
    }[];
    totalFixedCosts: number;
    totalVariableCosts: number;
    breakEvenPoint?: number;
  };

  // Cost allocation methods
  allocationMethods: {
    method: string;
    allocatedAmount: number;
    allocationBasis: string;
    accuracy: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];

  // Trend analysis
  trendAnalysis: {
    category: string;
    currentPeriodCost: number;
    previousPeriodCost: number;
    changeAmount: number;
    changePercentage: number;
    trend: 'INCREASING' | 'STABLE' | 'DECREASING';
    drivingFactors: string[];
  }[];

  createdAt: Date;
  createdBy: string;
}

export interface CostVarianceAnalysis {
  varianceAnalysisId: string;
  equipmentId: string;
  analysisName: string;
  reportingPeriod: {
    startDate: Date;
    endDate: Date;
  };

  // Budget vs actual analysis
  budgetVariance: {
    category: string;
    budgetedAmount: number;
    actualAmount: number;
    variance: number;
    variancePercentage: number;
    varianceType: 'FAVORABLE' | 'UNFAVORABLE';
    significanceLevel: 'MATERIAL' | 'MODERATE' | 'MINOR';
  }[];

  // Volume variance
  volumeVariance: {
    category: string;
    standardCostPerUnit: number;
    budgetedVolume: number;
    actualVolume: number;
    volumeVariance: number;
    varianceImpact: number;
    explanation: string;
  }[];

  // Price/rate variance
  priceVariance: {
    category: string;
    budgetedRate: number;
    actualRate: number;
    quantity: number;
    priceVariance: number;
    varianceImpact: number;
    marketFactors: string[];
  }[];

  // Efficiency variance
  efficiencyVariance: {
    category: string;
    standardEfficiency: number;
    actualEfficiency: number;
    efficiencyVariance: number;
    varianceImpact: number;
    rootCauses: string[];
    corrective_actions: string[];
  }[];

  // Mix variance (for multi-product scenarios)
  mixVariance?: {
    product: string;
    budgetedMix: number; // percentage
    actualMix: number; // percentage
    standardCost: number;
    mixVariance: number;
    varianceImpact: number;
  }[];

  // Variance root cause analysis
  rootCauseAnalysis: {
    variance: string;
    primaryCauses: {
      cause: string;
      impact: number; // percentage of variance
      controllability: 'CONTROLLABLE' | 'PARTIALLY_CONTROLLABLE' | 'UNCONTROLLABLE';
      actionRequired: string;
    }[];
    systemicIssues: string[];
    oneTimeEvents: string[];
  }[];

  // Corrective actions
  correctiveActions: {
    action: string;
    targetVariance: string;
    expectedImpact: number;
    implementationCost: number;
    timeline: number; // weeks
    responsible: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
  }[];

  // Performance indicators
  performanceIndicators: {
    indicator: string;
    target: number;
    actual: number;
    variance: number;
    trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  }[];

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface CostForecast {
  forecastId: string;
  equipmentId?: string;
  equipmentCategory?: string;
  forecastName: string;
  forecastDate: Date;

  // Forecast parameters
  parameters: {
    forecastHorizon: number; // years
    forecastFrequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
    confidenceLevel: number; // percentage
    modelType: 'STATISTICAL' | 'CAUSAL' | 'JUDGMENTAL' | 'HYBRID';
    assumptions: string[];
  };

  // Historical data basis
  historicalBasis: {
    dataPoints: number;
    dataQuality: 'HIGH' | 'MEDIUM' | 'LOW';
    seasonalityDetected: boolean;
    trendPattern: 'INCREASING' | 'DECREASING' | 'STABLE' | 'CYCLICAL';
    dataPeriod: {
      startDate: Date;
      endDate: Date;
    };
  };

  // Cost forecasts by category
  costForecasts: {
    category: string;
    historicalAverage: number;
    forecastPeriods: {
      period: string;
      forecastValue: number;
      confidenceInterval: {
        lower: number;
        upper: number;
      };
      growthRate: number; // percentage
    }[];
  }[];

  // Total cost forecast
  totalForecast: {
    period: string;
    totalCost: number;
    breakdown: {
      category: string;
      amount: number;
      percentage: number;
    }[];
    confidenceInterval: {
      lower: number;
      upper: number;
    };
    keyAssumptions: string[];
  }[];

  // Scenario forecasts
  scenarios: {
    scenarioName: string;
    probability: number; // percentage
    description: string;
    assumptions: Record<string, number>;
    forecastValues: {
      period: string;
      totalCost: number;
      variance: number; // percentage from base case
    }[];
  }[];

  // Cost drivers and factors
  costDrivers: {
    driver: string;
    currentValue: number;
    forecastValues: number[];
    elasticity: number; // cost response to driver changes
    confidenceLevel: number;
    dataSource: string;
  }[];

  // Forecast accuracy tracking
  accuracyTracking: {
    previousForecasts: {
      forecastDate: Date;
      forecastValue: number;
      actualValue?: number;
      accuracy?: number; // percentage
      bias?: number; // percentage
    }[];
    overallAccuracy: number; // percentage
    averageBias: number; // percentage
    improvementAreas: string[];
  };

  // Risk factors
  riskFactors: {
    risk: string;
    probability: number; // percentage
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    costImpact: number;
    mitigation: string;
  }[];

  // Forecast recommendations
  recommendations: {
    immediate: string[];
    budgetPlanning: string[];
    riskMitigation: string[];
    processImprovements: string[];
  };

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface CostCenter {
  costCenterId: string;
  costCenterName: string;
  costCenterCode: string;
  description: string;

  // Organizational hierarchy
  hierarchy: {
    parentCostCenter?: string;
    childCostCenters: string[];
    businessUnit: string;
    department: string;
    manager: string;
    budgetOwner: string;
  };

  // Budget information
  budget: {
    annualBudget: number;
    approvedBudget: number;
    revisedBudget?: number;
    budgetPeriod: {
      startDate: Date;
      endDate: Date;
    };
    budgetCategories: {
      category: string;
      budgetAmount: number;
      spentToDate: number;
      committed: number;
      available: number;
    }[];
  };

  // Cost allocation
  costAllocation: {
    directCosts: {
      category: string;
      amount: number;
      allocation_method: 'DIRECT_ASSIGNMENT';
    }[];
    indirectCosts: {
      category: string;
      amount: number;
      allocation_method: 'ACTIVITY_BASED' | 'PROPORTIONAL' | 'DRIVER_BASED';
      allocationBasis: string;
      allocationRate: number;
    }[];
    totalAllocatedCosts: number;
  };

  // Equipment assignments
  equipmentAssignments: {
    equipmentId: string;
    equipmentName: string;
    assignmentType: 'PRIMARY' | 'SECONDARY' | 'SHARED';
    allocationPercentage: number;
    costResponsibility: 'FULL' | 'PARTIAL' | 'NONE';
  }[];

  // Performance metrics
  performanceMetrics: {
    budgetUtilization: number; // percentage
    costVariance: number;
    costPerUnit?: number;
    benchmarkComparison: {
      metric: string;
      ourValue: number;
      benchmarkValue: number;
      variance: number;
    }[];
  };

  // Approval authorities
  approvalAuthorities: {
    level: string;
    approver: string;
    limit: number;
    requiresSecondaryApproval: boolean;
    delegationAllowed: boolean;
  }[];

  status: 'ACTIVE' | 'INACTIVE' | 'CLOSED';

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface CostDriver {
  driverId: string;
  driverName: string;
  driverType: 'VOLUME' | 'COMPLEXITY' | 'CAPABILITY' | 'EFFICIENCY' | 'EXTERNAL';

  // Driver characteristics
  characteristics: {
    unit: string;
    measurability: 'HIGH' | 'MEDIUM' | 'LOW';
    controllability: 'HIGH' | 'MEDIUM' | 'LOW';
    predictability: 'HIGH' | 'MEDIUM' | 'LOW';
    dataAvailability: 'REAL_TIME' | 'PERIODIC' | 'LIMITED';
  };

  // Cost relationships
  costRelationships: {
    affectedCostCategories: string[];
    relationshipType: 'LINEAR' | 'EXPONENTIAL' | 'LOGARITHMIC' | 'STEP' | 'COMPLEX';
    elasticity: number; // percentage change in cost for 1% change in driver
    correlationCoefficient: number;
    statisticalSignificance: number; // p-value
  };

  // Historical data
  historicalData: {
    period: string;
    driverValue: number;
    relatedCosts: number;
    costPerDriverUnit: number;
  }[];

  // Benchmarking
  benchmarking: {
    industryAverage: number;
    bestInClass: number;
    ourPerformance: number;
    percentileRanking: number;
    improvementPotential: number;
  };

  // Optimization opportunities
  optimization: {
    currentEfficiency: number; // percentage
    targetEfficiency: number; // percentage
    improvementActions: {
      action: string;
      expectedImprovement: number;
      implementationCost: number;
      timeline: number; // months
    }[];
    riskFactors: string[];
  };

  // Forecasting
  forecasting: {
    forecastMethod: string;
    forecastAccuracy: number; // percentage
    futureValues: {
      period: string;
      forecastValue: number;
      confidenceInterval: { lower: number; upper: number };
    }[];
    assumptions: string[];
  };

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface CostReduction {
  reductionId: string;
  initiativeName: string;
  equipmentId?: string;
  costCenterId?: string;

  // Initiative details
  initiative: {
    description: string;
    category: 'PROCUREMENT' | 'PROCESS' | 'TECHNOLOGY' | 'ORGANIZATIONAL' | 'DESIGN';
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    complexity: 'HIGH' | 'MEDIUM' | 'LOW';
    sponsor: string;
    champion: string;
    team: string[];
  };

  // Financial impact
  financialImpact: {
    targetSavings: {
      oneTime: number;
      annual: number;
      totalLifetime: number;
    };
    actualSavings: {
      oneTime?: number;
      annual?: number;
      totalToDate?: number;
    };
    implementationCosts: {
      capitalInvestment: number;
      operatingCosts: number;
      totalImplementationCost: number;
    };
    paybackPeriod: number; // months
    netPresentValue: number;
    internalRateOfReturn: number;
  };

  // Implementation plan
  implementationPlan: {
    phases: {
      phase: number;
      phaseName: string;
      startDate: Date;
      endDate: Date;
      milestones: {
        milestone: string;
        targetDate: Date;
        status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
      }[];
      deliverables: string[];
      resources: {
        resourceType: string;
        allocation: number;
        cost: number;
      }[];
    }[];
    criticalPath: string[];
    dependencies: {
      dependency: string;
      type: 'INTERNAL' | 'EXTERNAL';
      risk: 'LOW' | 'MEDIUM' | 'HIGH';
    }[];
  };

  // Risk assessment
  risks: {
    risk: string;
    probability: number; // percentage
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    financialImpact: number;
    mitigation: string;
    contingency: string;
    owner: string;
  }[];

  // Performance tracking
  tracking: {
    kpis: {
      kpi: string;
      target: number;
      actual?: number;
      unit: string;
      frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    }[];
    progress: {
      overallProgress: number; // percentage
      phaseProgress: {
        phase: string;
        progress: number; // percentage
      }[];
    };
    issues: {
      issue: string;
      severity: 'HIGH' | 'MEDIUM' | 'LOW';
      status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
      owner: string;
    }[];
  };

  // Benefits realization
  benefitsRealization: {
    realizationRate: number; // percentage of target achieved
    realizationTrend: 'AHEAD' | 'ON_TRACK' | 'BEHIND';
    sustainabilityRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    sustainabilityPlan: string[];
  };

  status: 'IDENTIFIED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD';

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface EquipmentProcurementCost {
  procurementCostId: string;
  equipmentId: string;
  procurementId?: string;

  // Procurement details
  procurement: {
    procurementMethod: 'RFP' | 'RFQ' | 'DIRECT' | 'AUCTION' | 'FRAMEWORK';
    supplierCount: number;
    selectedSupplier: string;
    contractType: 'LUMP_SUM' | 'UNIT_PRICE' | 'COST_PLUS' | 'TIME_MATERIALS';
  };

  // Cost breakdown
  costs: {
    equipmentCost: number;
    freight: number;
    insurance: number;
    customs: number;
    installation: number;
    commissioning: number;
    training: number;
    documentation: number;
    spares: number;
    warranty: number;
    financing: number;
    projectManagement: number;
    contingency: number;
    totalCost: number;
  };

  // Cost comparison
  comparison: {
    budgetedCost: number;
    variance: number; // percentage
    marketPrice: number;
    negotiatedSavings: number;
    valueEngineering: number;
    totalSavings: number;
  };

  // Payment terms
  paymentTerms: {
    paymentSchedule: {
      milestone: string;
      percentage: number;
      amount: number;
      dueDate: Date;
    }[];
    earlyPaymentDiscount?: number;
    latePenalty?: number;
    retentionPercentage?: number;
  };

  // Cost risks
  risks: {
    risk: string;
    probability: number; // percentage
    costImpact: number;
    mitigation: string;
  }[];

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface OperatingCostAnalysis {
  analysisId: string;
  equipmentId: string;
  analysisDate: Date;
  reportingPeriod: {
    startDate: Date;
    endDate: Date;
  };

  // Energy costs
  energyCosts: {
    electricity: {
      consumption: number; // kWh
      rate: number; // per kWh
      demandCharges: number;
      totalCost: number;
      efficiency: number; // kWh per unit output
    };
    fuel: {
      consumption: number; // gallons/liters
      rate: number; // per unit
      totalCost: number;
      efficiency: number; // units per unit output
    };
    other: {
      type: string;
      consumption: number;
      rate: number;
      totalCost: number;
    }[];
    totalEnergyCost: number;
  };

  // Labor costs
  laborCosts: {
    operators: {
      hours: number;
      rate: number; // per hour
      overtime: number;
      benefits: number;
      totalCost: number;
    };
    supervisors: {
      allocation: number; // percentage of time
      totalCost: number;
    };
    support: {
      hours: number;
      rate: number;
      totalCost: number;
    };
    totalLaborCost: number;
  };

  // Material costs
  materialCosts: {
    consumables: {
      category: string;
      quantity: number;
      unitCost: number;
      totalCost: number;
    }[];
    supplies: {
      category: string;
      quantity: number;
      unitCost: number;
      totalCost: number;
    }[];
    totalMaterialCost: number;
  };

  // Overhead costs
  overheadCosts: {
    facility: {
      rent: number;
      utilities: number;
      insurance: number;
      security: number;
      totalFacilityCost: number;
    };
    administrative: {
      management: number;
      accounting: number;
      legal: number;
      other: number;
      totalAdministrativeCost: number;
    };
    totalOverheadCost: number;
  };

  // Cost per unit analysis
  unitCostAnalysis: {
    unitsProduced: number;
    totalOperatingCost: number;
    costPerUnit: number;
    targetCostPerUnit: number;
    variance: number; // percentage
  };

  // Benchmarking
  benchmarking: {
    industryAverage: number;
    bestInClass: number;
    percentileRanking: number;
    competitiveGap: number;
  };

  // Improvement opportunities
  improvements: {
    category: string;
    currentCost: number;
    potentialSaving: number;
    implementationCost: number;
    paybackPeriod: number; // months
    difficulty: 'LOW' | 'MEDIUM' | 'HIGH';
  }[];

  createdAt: Date;
  createdBy: string;
}

export interface MaintenanceCostAnalysis {
  analysisId: string;
  equipmentId: string;
  analysisDate: Date;
  reportingPeriod: {
    startDate: Date;
    endDate: Date;
  };

  // Maintenance cost breakdown
  costBreakdown: {
    preventiveMaintenance: {
      laborHours: number;
      laborCost: number;
      partsCost: number;
      contractCost: number;
      totalCost: number;
    };
    correctiveMaintenance: {
      laborHours: number;
      laborCost: number;
      partsCost: number;
      emergencyFees: number;
      totalCost: number;
    };
    predictiveMaintenance: {
      monitoringCost: number;
      analysisCost: number;
      softwareCost: number;
      totalCost: number;
    };
    totalMaintenanceCost: number;
  };

  // Maintenance metrics
  metrics: {
    maintenanceRatio: number; // maintenance cost / asset value
    costPerMaintenanceHour: number;
    costPerUnit: number; // per unit of production
    preventiveRatio: number; // preventive / total maintenance
    emergencyRatio: number; // emergency / total maintenance
  };

  // Cost drivers
  costDrivers: {
    driver: string;
    costImpact: number;
    frequency: number;
    unitCost: number;
    totalCost: number;
    controllability: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];

  // Failure cost analysis
  failureCostAnalysis: {
    failureMode: string;
    frequency: number; // failures per year
    repairCost: number; // average per failure
    downtimeCost: number; // average per failure
    totalFailureCost: number; // annual
    preventionCost: number; // to prevent this failure mode
    costBenefit: number; // prevention vs failure cost
  }[];

  // Optimization opportunities
  optimizationOpportunities: {
    opportunity: string;
    category: 'STRATEGY' | 'PROCESS' | 'TECHNOLOGY' | 'SOURCING';
    currentCost: number;
    optimizedCost: number;
    potentialSaving: number;
    implementationCost: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    timeline: number; // months
  }[];

  // Benchmarking
  benchmarking: {
    metric: string;
    ourValue: number;
    industryAverage: number;
    bestInClass: number;
    gap: number;
    improvementPotential: number;
  }[];

  // Recommendations
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
    investmentRequired: {
      action: string;
      cost: number;
      expectedReturn: number;
      payback: number; // months
    }[];
  };

  createdAt: Date;
  createdBy: string;
}

export interface CostPerformanceIndicator {
  kpiId: string;
  kpiName: string;
  category: 'FINANCIAL' | 'OPERATIONAL' | 'STRATEGIC' | 'QUALITY';

  // KPI definition
  definition: {
    description: string;
    formula: string;
    unit: string;
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
    dataSource: string;
  };

  // Performance data
  performance: {
    period: string;
    actualValue: number;
    targetValue: number;
    thresholdValues: {
      excellent: number;
      good: number;
      acceptable: number;
      poor: number;
    };
    variance: number; // percentage
    trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  }[];

  // Benchmarking
  benchmarking: {
    industryAverage: number;
    topQuartile: number;
    bottomQuartile: number;
    ourPerformance: number;
    percentileRanking: number;
  };

  // Action triggers
  actionTriggers: {
    triggerCondition: string;
    threshold: number;
    action: string;
    escalationLevel: string;
    responsible: string;
  }[];

  // Improvement tracking
  improvements: {
    initiativeName: string;
    startDate: Date;
    expectedImpact: number;
    actualImpact?: number;
    status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
  }[];

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}
