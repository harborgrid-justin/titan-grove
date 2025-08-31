/**
 * Resource Optimization Types
 * Comprehensive types for Fortune 100 grade resource optimization and capacity planning
 */

// ================================
// CORE RESOURCE OPTIMIZATION TYPES
// ================================

export interface ResourceOptimization {
  optimizationId: string;
  optimizationName: string;
  description: string;
  optimizationType: 'PROJECT_BASED' | 'ENTERPRISE_WIDE' | 'DEPARTMENT_SPECIFIC' | 'SKILL_BASED' | 'COST_OPTIMIZATION';
  
  // Optimization scope
  scope: {
    organizationUnits: string[];
    projectIds: string[];
    resourceCategories: string[];
    timeHorizon: {
      startDate: Date;
      endDate: Date;
      planningHorizon: number; // months
    };
    geographicScope: string[];
  };
  
  // Optimization objectives
  objectives: {
    primaryObjective: 'MAXIMIZE_UTILIZATION' | 'MINIMIZE_COST' | 'OPTIMIZE_SKILLS_MATCH' | 'BALANCE_WORKLOAD' | 'MAXIMIZE_REVENUE';
    secondaryObjectives: string[];
    constraints: {
      budgetConstraints: {
        totalBudget?: number;
        departmentBudgets?: Record<string, number>;
        costCenter?: string;
      };
      timeConstraints: {
        projectDeadlines: Record<string, Date>;
        resourceAvailability: Record<string, { startDate: Date; endDate: Date }>;
        blackoutPeriods: { startDate: Date; endDate: Date; reason: string }[];
      };
      skillConstraints: {
        requiredSkills: string[];
        skillLevels: Record<string, 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'>;
        certificationRequirements: string[];
      };
      capacityConstraints: {
        maxUtilization: number; // percentage
        minUtilization: number; // percentage
        overtimeLimit: number; // hours per week
      };
    };
  };
  
  // Current state analysis
  currentState: {
    totalResources: number;
    averageUtilization: number; // percentage
    skillGaps: {
      skill: string;
      requiredCapacity: number;
      availableCapacity: number;
      gap: number;
      criticality: 'HIGH' | 'MEDIUM' | 'LOW';
    }[];
    costAnalysis: {
      totalResourceCost: number;
      costByCategory: Record<string, number>;
      costPerUtilization: number;
      benchmarkComparison: number; // percentage variance
    };
    performanceMetrics: {
      productivityIndex: number;
      qualityScore: number;
      customerSatisfaction: number;
      employeeSatisfaction: number;
    };
  };
  
  // Optimization scenarios
  scenarios: {
    scenarioName: string;
    description: string;
    changes: {
      resourceReallocation: {
        resourceId: string;
        fromProject?: string;
        toProject: string;
        allocation: number; // percentage
        effectiveDate: Date;
      }[];
      skillDevelopment: {
        resourceId: string;
        skill: string;
        currentLevel: string;
        targetLevel: string;
        trainingDuration: number; // hours
        trainingCost: number;
      }[];
      newHires: {
        role: string;
        skills: string[];
        quantity: number;
        startDate: Date;
        cost: number;
      }[];
      contractors: {
        skill: string;
        duration: number; // months
        cost: number;
        startDate: Date;
      }[];
    };
    projectedOutcomes: {
      utilizationImprovement: number; // percentage
      costImpact: number;
      skillGapReduction: number; // percentage
      productivityGain: number; // percentage
      riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    };
    implementation: {
      timeline: number; // weeks
      cost: number;
      complexity: 'LOW' | 'MEDIUM' | 'HIGH';
      prerequisites: string[];
      risks: {
        risk: string;
        probability: number;
        impact: string;
        mitigation: string;
      }[];
    };
  }[];
  
  // Recommended solution
  recommendedSolution: {
    selectedScenario: string;
    justification: string;
    expectedBenefits: {
      utilizationImprovement: number;
      costSavings: number;
      productivityGain: number;
      qualityImprovement: number;
      timeToMarket: number; // percentage improvement
    };
    implementationPlan: {
      phases: {
        phase: number;
        phaseName: string;
        duration: number; // weeks
        activities: string[];
        deliverables: string[];
        resources: string[];
      }[];
      budget: {
        category: string;
        amount: number;
      }[];
      timeline: {
        milestone: string;
        date: Date;
        dependencies: string[];
      }[];
    };
  };
  
  // Performance monitoring
  monitoring: {
    kpis: {
      kpi: string;
      baseline: number;
      target: number;
      current?: number;
      unit: string;
      frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    }[];
    dashboards: {
      dashboardName: string;
      metrics: string[];
      audience: string[];
      updateFrequency: string;
    }[];
    alerting: {
      metric: string;
      threshold: number;
      alertType: 'WARNING' | 'CRITICAL';
      recipients: string[];
    }[];
  };
  
  status: 'ANALYSIS' | 'SCENARIO_DEVELOPMENT' | 'REVIEW' | 'APPROVED' | 'IMPLEMENTATION' | 'MONITORING' | 'COMPLETED';
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface ResourceAssignment {
  assignmentId: string;
  resourceId: string;
  projectId: string;
  taskId?: string;
  
  // Assignment details
  assignment: {
    role: string;
    startDate: Date;
    endDate: Date;
    allocation: number; // percentage (0-100)
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    assignmentType: 'DEDICATED' | 'SHARED' | 'ON_DEMAND' | 'STANDBY';
  };
  
  // Resource details
  resource: {
    resourceId: string;
    resourceName: string;
    resourceType: 'EMPLOYEE' | 'CONTRACTOR' | 'CONSULTANT' | 'VENDOR' | 'EQUIPMENT';
    department: string;
    location: string;
    skills: {
      skill: string;
      level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
      certificationDate?: Date;
      expirationDate?: Date;
    }[];
    availability: {
      totalCapacity: number; // hours per week
      currentUtilization: number; // percentage
      availableCapacity: number; // hours per week
    };
    cost: {
      hourlyRate: number;
      costCenter: string;
      currency: string;
      additionalCosts?: {
        type: string;
        amount: number;
      }[];
    };
  };
  
  // Assignment requirements
  requirements: {
    requiredSkills: {
      skill: string;
      minimumLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
      mandatory: boolean;
    }[];
    workLocation: 'ON_SITE' | 'REMOTE' | 'HYBRID' | 'FLEXIBLE';
    securityClearance?: string;
    certifications?: string[];
    experience?: {
      domain: string;
      minimumYears: number;
    }[];
  };
  
  // Assignment fit analysis
  fitAnalysis: {
    overallFit: number; // percentage
    skillsMatch: {
      skill: string;
      required: string;
      actual: string;
      match: number; // percentage
    }[];
    gapAnalysis: {
      gap: string;
      severity: 'HIGH' | 'MEDIUM' | 'LOW';
      mitigation: string;
      trainingRequired?: {
        course: string;
        duration: number; // hours
        cost: number;
      };
    }[];
    riskAssessment: {
      risk: string;
      probability: number; // percentage
      impact: 'HIGH' | 'MEDIUM' | 'LOW';
      mitigation: string;
    }[];
  };
  
  // Performance tracking
  performance: {
    productivity: {
      plannedhours: number;
      actualHours: number;
      efficiency: number; // percentage
      qualityScore: number; // 1-10
    };
    deliverables: {
      deliverable: string;
      dueDate: Date;
      status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
      quality: number; // 1-10
    }[];
    feedback: {
      feedbackDate: Date;
      source: 'MANAGER' | 'PEER' | 'CLIENT' | 'SELF';
      rating: number; // 1-10
      comments: string;
    }[];
  };
  
  // Financial tracking
  financial: {
    budgetAllocated: number;
    actualCost: number;
    forecast: {
      period: string;
      forecastCost: number;
    }[];
    variance: {
      amount: number;
      percentage: number;
      explanation: string;
    };
  };
  
  status: 'PLANNED' | 'CONFIRMED' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface CapacityPlan {
  planId: string;
  planName: string;
  description: string;
  planningHorizon: {
    startDate: Date;
    endDate: Date;
    planningPeriods: number; // quarters or months
  };
  
  // Planning scope
  scope: {
    organizationalUnits: string[];
    resourceCategories: string[];
    geographicRegions: string[];
    businessLines: string[];
  };
  
  // Demand analysis
  demand: {
    projects: {
      projectId: string;
      projectName: string;
      priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
      resourceRequirements: {
        skill: string;
        level: string;
        quantity: number; // FTE
        startDate: Date;
        endDate: Date;
        flexibility: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
      }[];
      budgetApproved: boolean;
      probability: number; // percentage
    }[];
    operationalWork: {
      workType: string;
      resourceRequirements: {
        skill: string;
        level: string;
        baselineCapacity: number; // FTE
        seasonalVariation: number; // percentage
        growthRate: number; // annual percentage
      }[];
    }[];
    strategicInitiatives: {
      initiative: string;
      timeframe: string;
      resourceImpact: {
        skill: string;
        additionalCapacity: number; // FTE
        duration: number; // months
      }[];
    }[];
  };
  
  // Supply analysis
  supply: {
    currentWorkforce: {
      skill: string;
      level: string;
      currentCapacity: number; // FTE
      location: string;
      cost: number; // annual per FTE
      utilization: number; // percentage
      retention: {
        annualTurnoverRate: number; // percentage
        averageTenure: number; // years
        riskFactors: string[];
      };
    }[];
    recruitmentPipeline: {
      skill: string;
      level: string;
      candidatesInPipeline: number;
      averageHireTime: number; // weeks
      successRate: number; // percentage
      cost: number; // per hire
    }[];
    development: {
      skill: string;
      fromLevel: string;
      toLevel: string;
      developmentTime: number; // months
      successRate: number; // percentage
      cost: number; // per person
      currentInTraining: number;
    }[];
    contractors: {
      skill: string;
      level: string;
      availableCapacity: number; // FTE
      cost: number; // per FTE annually
      leadTime: number; // weeks
      contractDuration: {
        minimum: number; // months
        maximum: number; // months
      };
    }[];
  };
  
  // Gap analysis
  gapAnalysis: {
    period: string;
    skillGaps: {
      skill: string;
      level: string;
      demandFTE: number;
      supplyFTE: number;
      gapFTE: number;
      gapPercentage: number;
      criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
      impactAssessment: {
        projectsAtRisk: number;
        revenueAtRisk: number;
        deliveryDelays: number; // average weeks
      };
    }[];
    surplusAnalysis: {
      skill: string;
      level: string;
      surplusFTE: number;
      recommendations: string[];
      redeploymentOptions: {
        targetSkill: string;
        retrainingRequired: boolean;
        retrainingDuration: number; // months
        cost: number;
      }[];
    }[];
  }[];
  
  // Capacity strategies
  strategies: {
    strategyName: string;
    description: string;
    actions: {
      actionType: 'HIRE' | 'DEVELOP' | 'CONTRACT' | 'REDEPLOY' | 'OUTSOURCE' | 'AUTOMATE';
      details: {
        skill?: string;
        quantity?: number;
        timeline?: number; // months
        cost?: number;
        riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
      };
      expectedOutcome: string;
    }[];
    timeline: {
      phase: string;
      duration: number; // months
      milestones: string[];
    }[];
    investment: {
      category: string;
      amount: number;
      paybackPeriod?: number; // months
    }[];
    risks: {
      risk: string;
      probability: number; // percentage
      impact: string;
      mitigation: string;
    }[];
    metrics: {
      metric: string;
      baseline: number;
      target: number;
      timeline: string;
    }[];
  }[];
  
  // Financial analysis
  financial: {
    currentCosts: {
      salaries: number;
      benefits: number;
      contractors: number;
      training: number;
      overhead: number;
      total: number;
    };
    projectedCosts: {
      year: number;
      salaries: number;
      benefits: number;
      contractors: number;
      training: number;
      recruitment: number;
      total: number;
    }[];
    costOptimization: {
      opportunity: string;
      savings: number;
      implementationCost: number;
      timeline: string;
    }[];
    budgetRequests: {
      purpose: string;
      amount: number;
      justification: string;
      priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    }[];
  };
  
  // Monitoring and control
  governance: {
    reviewFrequency: 'MONTHLY' | 'QUARTERLY' | 'BIANNUALLY';
    stakeholders: {
      role: string;
      name: string;
      responsibilities: string[];
    }[];
    escalationCriteria: {
      trigger: string;
      threshold: number;
      escalationTo: string;
      action: string;
    }[];
    reporting: {
      reportType: string;
      frequency: string;
      audience: string[];
      format: string;
    }[];
  };
  
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'ACTIVE' | 'REVISION_REQUIRED' | 'ARCHIVED';
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface ResourceUtilization {
  utilizationId: string;
  analysisDate: Date;
  reportingPeriod: {
    startDate: Date;
    endDate: Date;
    periodType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  };
  
  // Overall utilization metrics
  overall: {
    totalResources: number;
    averageUtilization: number; // percentage
    targetUtilization: number; // percentage
    variance: number; // percentage points
    trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  };
  
  // Utilization by category
  byCategory: {
    category: string;
    resourceCount: number;
    utilization: number; // percentage
    targetUtilization: number; // percentage
    variance: number;
    trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
    topPerformers: {
      resourceId: string;
      resourceName: string;
      utilization: number;
    }[];
    underperformers: {
      resourceId: string;
      resourceName: string;
      utilization: number;
      reasons: string[];
    }[];
  }[];
  
  // Utilization by skill
  bySkill: {
    skill: string;
    level: string;
    resourceCount: number;
    demandHours: number;
    availableHours: number;
    utilizedHours: number;
    utilization: number; // percentage
    overallocation: number; // hours
    underutilization: number; // hours
    marketDemand: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];
  
  // Time-based analysis
  timeAnalysis: {
    period: string;
    utilization: number;
    productiveHours: number;
    nonProductiveHours: number;
    overtimeHours: number;
    idleTime: number;
    seasonalFactors: {
      factor: string;
      impact: number; // percentage
    }[];
  }[];
  
  // Project-based utilization
  projectUtilization: {
    projectId: string;
    projectName: string;
    allocatedResources: number;
    utilizedResources: number;
    utilization: number; // percentage
    efficiency: number; // actual vs planned hours
    qualityScore: number;
    resourceMix: {
      skill: string;
      planned: number;
      actual: number;
      variance: number;
    }[];
  }[];
  
  // Cost analysis
  costAnalysis: {
    totalResourceCost: number;
    productiveCost: number;
    nonproductiveCost: number;
    costPerProductiveHour: number;
    benchmarkCost: number;
    variance: number;
    costOptimizationOpportunities: {
      opportunity: string;
      potentialSavings: number;
      implementationCost: number;
      timeline: string;
    }[];
  };
  
  // Capacity insights
  capacityInsights: {
    bottlenecks: {
      skill: string;
      severity: 'HIGH' | 'MEDIUM' | 'LOW';
      impact: string;
      recommendations: string[];
    }[];
    surplusCapacity: {
      skill: string;
      excessCapacity: number; // FTE
      redeploymentOptions: string[];
      costOfIdleness: number;
    }[];
    demandPatterns: {
      pattern: string;
      description: string;
      predictability: 'HIGH' | 'MEDIUM' | 'LOW';
      planningImplications: string[];
    }[];
  };
  
  // Improvement recommendations
  recommendations: {
    category: 'RESOURCE_REALLOCATION' | 'SKILL_DEVELOPMENT' | 'PROCESS_IMPROVEMENT' | 'TECHNOLOGY' | 'ORGANIZATIONAL';
    recommendation: string;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    expectedImpact: {
      utilizationImprovement: number; // percentage points
      costSavings: number;
      timeline: string;
    };
    implementationComplexity: 'LOW' | 'MEDIUM' | 'HIGH';
    investmentRequired: number;
    risks: string[];
  }[];
  
  createdAt: Date;
  createdBy: string;
}

export interface SkillMatrix {
  matrixId: string;
  organizationUnit: string;
  matrixName: string;
  version: string;
  
  // Skill taxonomy
  skillTaxonomy: {
    category: string;
    subCategory: string;
    skills: {
      skillId: string;
      skillName: string;
      description: string;
      skillType: 'TECHNICAL' | 'FUNCTIONAL' | 'BEHAVIORAL' | 'LEADERSHIP' | 'INDUSTRY_SPECIFIC';
      importance: 'CRITICAL' | 'IMPORTANT' | 'USEFUL' | 'NICE_TO_HAVE';
      complexity: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
      certificationAvailable: boolean;
      trainingAvailable: boolean;
      marketDemand: 'HIGH' | 'MEDIUM' | 'LOW';
    }[];
  }[];
  
  // Skill levels definition
  skillLevels: {
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
    description: string;
    criteria: string[];
    typicalExperience: string;
    assessmentMethod: string[];
    certificationRequired?: boolean;
  }[];
  
  // Resource skills inventory
  resourceSkills: {
    resourceId: string;
    resourceName: string;
    role: string;
    department: string;
    skills: {
      skillId: string;
      skillName: string;
      currentLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
      assessmentDate: Date;
      assessmentMethod: 'SELF_ASSESSMENT' | 'MANAGER_REVIEW' | 'PEER_REVIEW' | 'CERTIFICATION' | 'TESTING';
      certifications: {
        certification: string;
        issuer: string;
        issueDate: Date;
        expirationDate?: Date;
        status: 'ACTIVE' | 'EXPIRED' | 'PENDING_RENEWAL';
      }[];
      experience: {
        projectName: string;
        duration: number; // months
        complexity: 'LOW' | 'MEDIUM' | 'HIGH';
        outcome: 'SUCCESSFUL' | 'PARTIALLY_SUCCESSFUL' | 'UNSUCCESSFUL';
      }[];
    }[];
  }[];
  
  // Skills gap analysis
  gapAnalysis: {
    skill: string;
    currentCapacity: {
      beginner: number;
      intermediate: number;
      advanced: number;
      expert: number;
      total: number;
    };
    requiredCapacity: {
      beginner: number;
      intermediate: number;
      advanced: number;
      expert: number;
      total: number;
    };
    gap: {
      beginner: number;
      intermediate: number;
      advanced: number;
      expert: number;
      total: number;
    };
    criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    businessImpact: string;
    recommendedActions: {
      action: 'HIRE' | 'TRAIN' | 'CONTRACT' | 'OUTSOURCE' | 'REDEPLOY';
      priority: 'IMMEDIATE' | 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM';
      estimatedCost: number;
      timeline: string;
      riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    }[];
  }[];
  
  // Development pathways
  developmentPaths: {
    pathId: string;
    pathName: string;
    fromSkill: string;
    fromLevel: string;
    toSkill: string;
    toLevel: string;
    prerequisites: string[];
    developmentSteps: {
      step: number;
      activity: string;
      duration: number; // weeks
      cost: number;
      provider: string;
      successRate: number; // percentage
    }[];
    totalDuration: number; // weeks
    totalCost: number;
    successFactors: string[];
    risks: string[];
  }[];
  
  // Skills demand forecasting
  demandForecast: {
    skill: string;
    currentDemand: number; // FTE
    forecastPeriods: {
      period: string;
      demandFTE: number;
      drivers: string[];
      confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    }[];
    trendAnalysis: {
      trend: 'INCREASING' | 'STABLE' | 'DECREASING';
      growthRate: number; // annual percentage
      marketFactors: string[];
      technologyImpact: string[];
    };
  }[];
  
  // Skills market analysis
  marketAnalysis: {
    skill: string;
    marketAvailability: 'ABUNDANT' | 'ADEQUATE' | 'SCARCE' | 'CRITICAL_SHORTAGE';
    averageSalary: {
      beginner: number;
      intermediate: number;
      advanced: number;
      expert: number;
    };
    competitionLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
    geographicFactors: {
      location: string;
      availability: string;
      costIndex: number;
    }[];
    trends: {
      salaryTrend: 'INCREASING' | 'STABLE' | 'DECREASING';
      demandTrend: 'INCREASING' | 'STABLE' | 'DECREASING';
      supplyTrend: 'INCREASING' | 'STABLE' | 'DECREASING';
    };
  }[];
  
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'ACTIVE' | 'UNDER_REVISION' | 'ARCHIVED';
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

// Additional supporting interfaces...

export interface WorkforceAnalytics {
  analyticsId: string;
  analysisDate: Date;
  reportingPeriod: {
    startDate: Date;
    endDate: Date;
  };
  
  workforce: {
    totalEmployees: number;
    employeeCategories: {
      category: string;
      count: number;
      percentage: number;
    }[];
    demographics: {
      averageAge: number;
      averageTenure: number; // years
      generationMix: {
        generation: string;
        percentage: number;
      }[];
    };
    turnover: {
      annualRate: number; // percentage
      voluntaryRate: number;
      involuntaryRate: number;
      costPerExit: number;
    };
  };
  
  performance: {
    productivityIndex: number;
    qualityScore: number;
    innovationIndex: number;
    customerSatisfaction: number;
    benchmarkComparison: {
      metric: string;
      ourValue: number;
      benchmarkValue: number;
      variance: number;
    }[];
  };
  
  capacity: {
    utilizationRate: number; // percentage
    overtimePercentage: number;
    capacityConstraints: string[];
    scalabilityFactor: number; // ability to scale up/down
  };
  
  cost: {
    totalWorkforceCost: number;
    costPerFTE: number;
    benefitsRatio: number; // benefits as % of salary
    recruitmentCost: number;
    trainingInvestment: number;
  };
  
  insights: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
    recommendations: string[];
  };
  
  createdAt: Date;
  createdBy: string;
}

export interface ResourceForecast {
  forecastId: string;
  forecastName: string;
  forecastHorizon: {
    startDate: Date;
    endDate: Date;
    periods: number;
  };
  
  methodology: {
    forecastMethod: 'STATISTICAL' | 'CAUSAL' | 'JUDGMENTAL' | 'HYBRID';
    dataInputs: string[];
    assumptions: string[];
    confidenceLevel: number; // percentage
  };
  
  demandForecast: {
    period: string;
    totalDemand: number; // FTE
    demandBySkill: {
      skill: string;
      demand: number;
      confidence: number;
    }[];
    demandDrivers: {
      driver: string;
      impact: number; // percentage
    }[];
  }[];
  
  supplyForecast: {
    period: string;
    totalSupply: number; // FTE
    supplyBySource: {
      source: 'INTERNAL' | 'EXTERNAL_HIRE' | 'CONTRACTOR' | 'DEVELOPMENT';
      supply: number;
      confidence: number;
    }[];
    constraints: string[];
  }[];
  
  gapProjection: {
    period: string;
    projectedGap: number; // FTE
    gapBySkill: {
      skill: string;
      gap: number;
      severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    }[];
    mitigationStrategies: string[];
  }[];
  
  scenarios: {
    scenarioName: string;
    probability: number; // percentage
    description: string;
    assumptions: Record<string, number>;
    outcomes: {
      totalDemand: number;
      totalSupply: number;
      gap: number;
    };
  }[];
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface ResourcePool {
  poolId: string;
  poolName: string;
  poolType: 'SHARED' | 'DEDICATED' | 'CENTER_OF_EXCELLENCE' | 'VIRTUAL';
  
  composition: {
    totalResources: number;
    resourceMix: {
      resourceType: string;
      count: number;
      utilizationRate: number;
    }[];
    skillComposition: {
      skill: string;
      level: string;
      count: number;
    }[];
  };
  
  governance: {
    poolManager: string;
    allocationPolicy: string;
    prioritizationCriteria: string[];
    conflictResolution: string;
  };
  
  performance: {
    utilizationRate: number;
    customerSatisfaction: number;
    responseTime: number; // hours to assign resource
    qualityScore: number;
  };
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface AllocationStrategy {
  strategyId: string;
  strategyName: string;
  strategyType: 'OPTIMIZATION_BASED' | 'RULE_BASED' | 'PRIORITY_BASED' | 'HYBRID';
  
  rules: {
    rule: string;
    priority: number;
    conditions: string[];
    actions: string[];
  }[];
  
  optimization: {
    objective: string;
    constraints: string[];
    algorithm: string;
    parameters: Record<string, any>;
  };
  
  performance: {
    allocationEfficiency: number;
    stakeholderSatisfaction: number;
    resourceUtilization: number;
  };
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface ResourceConstraint {
  constraintId: string;
  constraintType: 'AVAILABILITY' | 'SKILL' | 'LOCATION' | 'COST' | 'COMPLIANCE' | 'PREFERENCE';
  
  details: {
    resourceId?: string;
    constraint: string;
    severity: 'HARD' | 'SOFT';
    weight: number;
    violationCost?: number;
  };
  
  validity: {
    startDate: Date;
    endDate?: Date;
    recurring: boolean;
  };
  
  createdAt: Date;
  createdBy: string;
}

export interface OptimizationScenario {
  scenarioId: string;
  scenarioName: string;
  description: string;
  
  parameters: {
    objectiveFunction: string;
    constraints: string[];
    optimizationHorizon: number; // days
  };
  
  results: {
    objectiveValue: number;
    assignments: {
      resourceId: string;
      projectId: string;
      allocation: number;
    }[];
    metrics: {
      utilization: number;
      cost: number;
      satisfaction: number;
    };
  };
  
  sensitivity: {
    parameter: string;
    impact: number;
  }[];
  
  createdAt: Date;
  createdBy: string;
}

export interface ResourcePerformance {
  performanceId: string;
  resourceId: string;
  evaluationPeriod: {
    startDate: Date;
    endDate: Date;
  };
  
  metrics: {
    productivity: number;
    quality: number;
    efficiency: number;
    utilization: number;
    satisfaction: number;
  };
  
  goals: {
    goal: string;
    target: number;
    actual: number;
    variance: number;
  }[];
  
  feedback: {
    feedbackType: 'MANAGER' | 'PEER' | 'CLIENT' | 'SELF';
    rating: number;
    comments: string;
    date: Date;
  }[];
  
  development: {
    strengthsIdentified: string[];
    areasForImprovement: string[];
    developmentPlan: string[];
  };
  
  createdAt: Date;
  createdBy: string;
}

export interface CapacityAnalysis {
  analysisId: string;
  analysisDate: Date;
  
  currentCapacity: {
    totalCapacity: number; // FTE
    availableCapacity: number; // FTE
    utilizationRate: number; // percentage
  };
  
  demandAnalysis: {
    currentDemand: number; // FTE
    projectedDemand: number; // FTE
    seasonalVariation: number; // percentage
  };
  
  gapAnalysis: {
    capacityGap: number; // FTE
    gapSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    impactAssessment: string;
  };
  
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  
  createdAt: Date;
  createdBy: string;
}

export interface ResourceBenchmark {
  benchmarkId: string;
  benchmarkName: string;
  industrySegment: string;
  
  metrics: {
    metric: string;
    ourValue: number;
    benchmarkValue: number;
    percentile: number;
    gap: number;
  }[];
  
  insights: {
    strengths: string[];
    opportunities: string[];
    recommendations: string[];
  };
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface WorkloadDistribution {
  distributionId: string;
  analysisDate: Date;
  
  distribution: {
    resourceId: string;
    workload: number; // percentage
    capacity: number; // FTE
    projects: {
      projectId: string;
      allocation: number; // percentage
    }[];
  }[];
  
  balance: {
    overallocatedResources: string[];
    underutilizedResources: string[];
    optimalDistribution: {
      resourceId: string;
      recommendedAllocation: number;
    }[];
  };
  
  createdAt: Date;
  createdBy: string;
}