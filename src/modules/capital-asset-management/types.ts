/**
 * Capital Asset Management Types
 * Comprehensive types for Fortune 100 grade capital asset management
 */

// ================================
// CORE CAPITAL ASSET TYPES
// ================================

export interface CapitalAsset {
  capitalAssetId: string;
  assetId: string; // Reference to base asset
  assetNumber: string;
  assetName: string;
  description: string;

  // Capital classification
  capitalClass:
    | 'PRODUCTION_EQUIPMENT'
    | 'IT_INFRASTRUCTURE'
    | 'FACILITY'
    | 'VEHICLE'
    | 'REAL_ESTATE';
  assetCategory: string;
  priorityLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  strategicImportance: 'CRITICAL' | 'IMPORTANT' | 'STANDARD';

  // Financial information
  capitalValue: {
    originalCost: number;
    currentBookValue: number;
    marketValue?: number;
    replacementCost?: number;
    totalCostOfOwnership: number;
    depreciationMethod: 'STRAIGHT_LINE' | 'DECLINING_BALANCE' | 'UNITS_OF_PRODUCTION';
    usefulLife: number; // in years
    salvageValue: number;
  };

  // Investment tracking
  investment: {
    investmentId: string;
    approvalDate: Date;
    budgetAllocated: number;
    actualSpent: number;
    roi: number; // Return on Investment percentage
    paybackPeriod: number; // in months
    npv: number; // Net Present Value
    irr: number; // Internal Rate of Return
  };

  // Performance metrics
  performance: {
    utilization: number; // percentage
    productivity: number;
    efficiency: number;
    availability: number;
    downtime: number; // hours per year
    maintenanceCost: number; // annual
    operatingCost: number; // annual
  };

  // Lifecycle information
  lifecycle: {
    acquisitionDate: Date;
    commissionDate?: Date;
    lastMajorUpgrade?: Date;
    plannedReplacementDate?: Date;
    disposalDate?: Date;
    currentPhase: 'PLANNING' | 'ACQUISITION' | 'COMMISSION' | 'OPERATION' | 'UPGRADE' | 'DISPOSAL';
    remainingLife: number; // in years
  };

  // Location and assignment
  location: {
    facilityId: string;
    costCenter: string;
    department: string;
    responsibleManager: string;
    businessUnit: string;
  };

  // Compliance and risk
  compliance: {
    regulatoryRequirements: string[];
    complianceStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING_REVIEW';
    lastAuditDate?: Date;
    nextAuditDate?: Date;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  };

  // Audit fields
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface CapitalInvestment {
  investmentId: string;
  investmentName: string;
  description: string;

  // Investment classification
  investmentType: 'NEW_ACQUISITION' | 'REPLACEMENT' | 'EXPANSION' | 'UPGRADE' | 'MAINTENANCE';
  category: 'GROWTH' | 'MAINTENANCE' | 'REGULATORY' | 'STRATEGIC';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

  // Financial details
  financial: {
    requestedAmount: number;
    approvedAmount?: number;
    actualSpent: number;
    currency: string;
    budgetYear: number;
    costCenter: string;
    accountCode: string;
  };

  // Business justification
  businessCase: {
    strategicAlignment: string;
    businessNeed: string;
    expectedBenefits: string[];
    riskMitigation: string[];
    alternativesConsidered: string[];
  };

  // Financial analysis
  analysis: {
    roi: number;
    paybackPeriod: number;
    npv: number;
    irr: number;
    discountRate: number;
    cashFlowProjections: {
      year: number;
      cashFlow: number;
      cumulativeCashFlow: number;
    }[];
  };

  // Approval workflow
  approvals: {
    currentStage: string;
    requiredApprovals: string[];
    approvalHistory: ApprovalRecord[];
    finalApprovalDate?: Date;
    finalApprover?: string;
  };

  // Implementation
  implementation: {
    plannedStartDate: Date;
    plannedCompletionDate: Date;
    actualStartDate?: Date;
    actualCompletionDate?: Date;
    projectManager: string;
    milestones: ImplementationMilestone[];
    status: 'PROPOSED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  };

  // Performance tracking
  performance: {
    budgetVariance: number;
    scheduleVariance: number;
    scopeChanges: number;
    qualityMetrics: Record<string, number>;
    benefitRealization: number; // percentage
  };

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface InvestmentProposal {
  proposalId: string;
  proposalName: string;
  description: string;

  // Proposal details
  requestor: {
    employeeId: string;
    name: string;
    department: string;
    email: string;
  };

  // Investment request
  investment: {
    requestedAmount: number;
    currency: string;
    urgency: 'IMMEDIATE' | 'HIGH' | 'MEDIUM' | 'LOW';
    expectedStartDate: Date;
    expectedDuration: number; // in months
  };

  // Business justification
  justification: {
    businessNeed: string;
    strategicAlignment: string;
    expectedBenefits: string[];
    consequencesOfNotInvesting: string[];
    alternativesConsidered: string[];
  };

  // Technical details
  technical: {
    specifications: Record<string, any>;
    preferredVendors: string[];
    technicalRequirements: string[];
    integrationRequirements: string[];
  };

  // Risk assessment
  risks: {
    identifiedRisks: RiskAssessment[];
    mitigationStrategies: string[];
    overallRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  };

  // Status and workflow
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN';
  submissionDate?: Date;
  reviewDeadline?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface ROIAnalysis {
  analysisId: string;
  assetId: string;
  investmentId: string;

  // Analysis parameters
  analysisDate: Date;
  analysisType: 'INITIAL' | 'ANNUAL_REVIEW' | 'POST_IMPLEMENTATION';
  timeHorizon: number; // in years
  discountRate: number;

  // Financial metrics
  metrics: {
    roi: number; // percentage
    paybackPeriod: number; // in months
    npv: number;
    irr: number;
    profitabilityIndex: number;
    breakEvenPoint: number; // in months
  };

  // Cash flow analysis
  cashFlows: {
    initialInvestment: number;
    annualCashFlows: {
      year: number;
      revenue: number;
      costs: number;
      netCashFlow: number;
      cumulativeNetCashFlow: number;
      presentValue: number;
    }[];
    terminalValue?: number;
  };

  // Sensitivity analysis
  sensitivity: {
    scenarios: {
      name: string;
      probability: number;
      roi: number;
      npv: number;
    }[];
    keyVariables: {
      variable: string;
      baseValue: number;
      sensitivityRange: {
        change: number; // percentage
        roiImpact: number;
        npvImpact: number;
      }[];
    }[];
  };

  // Assumptions and notes
  assumptions: string[];
  limitations: string[];
  recommendations: string[];

  createdAt: Date;
  createdBy: string;
}

export interface CapitalBudget {
  budgetId: string;
  budgetName: string;
  description: string;

  // Budget period
  fiscalYear: number;
  startDate: Date;
  endDate: Date;

  // Budget allocation
  totalBudget: number;
  allocatedBudget: number;
  committedBudget: number;
  spentBudget: number;
  availableBudget: number;

  // Category breakdown
  categories: {
    category: string;
    budgetAmount: number;
    allocatedAmount: number;
    spentAmount: number;
    commitments: number;
    variance: number;
  }[];

  // Department/division breakdown
  divisions: {
    divisionId: string;
    divisionName: string;
    budgetAmount: number;
    allocatedAmount: number;
    spentAmount: number;
    utilizationRate: number;
  }[];

  // Approval and governance
  approvalStatus: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'ACTIVE' | 'CLOSED';
  approver: string;
  approvalDate?: Date;

  // Performance tracking
  performance: {
    budgetUtilization: number; // percentage
    spendRate: number; // monthly average
    forecastAccuracy: number; // percentage
    varianceAnalysis: {
      favorableVariance: number;
      unfavorableVariance: number;
      majorVariances: {
        item: string;
        budgeted: number;
        actual: number;
        variance: number;
        explanation: string;
      }[];
    };
  };

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface CapitalExpenditure {
  expenditureId: string;
  investmentId: string;
  assetId?: string;

  // Expenditure details
  description: string;
  category: string;
  amount: number;
  currency: string;
  expenditureDate: Date;

  // Approval and authorization
  approvalReference: string;
  approver: string;
  approvalDate: Date;

  // Accounting details
  accounting: {
    costCenter: string;
    accountCode: string;
    journalEntry: string;
    invoiceNumber?: string;
    vendorId?: string;
    poNumber?: string;
  };

  // Classification
  expenditureType: 'CAPITAL' | 'OPERATING' | 'MAINTENANCE';
  assetImpact: 'NEW_ASSET' | 'ASSET_IMPROVEMENT' | 'REPLACEMENT' | 'DISPOSAL';

  // Status and tracking
  status: 'PLANNED' | 'COMMITTED' | 'ACTUAL' | 'ACCRUED';
  paymentStatus: 'PENDING' | 'PAID' | 'PARTIAL' | 'CANCELLED';

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface InvestmentPortfolio {
  portfolioId: string;
  portfolioName: string;
  description: string;

  // Portfolio composition
  investments: {
    investmentId: string;
    investmentName: string;
    amount: number;
    weight: number; // percentage of total portfolio
    category: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    status: string;
  }[];

  // Portfolio metrics
  metrics: {
    totalValue: number;
    totalReturn: number; // percentage
    riskAdjustedReturn: number;
    portfolioRisk: number;
    diversificationIndex: number;
    sharpeRatio: number;
  };

  // Performance analysis
  performance: {
    periodicReturns: {
      period: string;
      return: number;
      benchmark: number;
      alpha: number;
    }[];
    riskMetrics: {
      volatility: number;
      beta: number;
      maxDrawdown: number;
      valueAtRisk: number;
    };
  };

  // Strategic allocation
  targetAllocation: {
    category: string;
    targetPercentage: number;
    currentPercentage: number;
    variance: number;
  }[];

  // Rebalancing
  rebalancing: {
    lastRebalanceDate: Date;
    nextRebalanceDate: Date;
    rebalanceThreshold: number; // percentage deviation
    rebalanceHistory: {
      date: Date;
      reason: string;
      changes: {
        investment: string;
        fromWeight: number;
        toWeight: number;
        amount: number;
      }[];
    }[];
  };

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface CapitalAssetPerformance {
  performanceId: string;
  assetId: string;
  reportingPeriod: {
    startDate: Date;
    endDate: Date;
    periodType: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  };

  // Financial performance
  financial: {
    revenue: number;
    operatingCost: number;
    maintenanceCost: number;
    netIncome: number;
    roi: number;
    cashFlow: number;
  };

  // Operational performance
  operational: {
    utilization: number; // percentage
    efficiency: number; // percentage
    productivity: number;
    quality: number; // percentage
    availability: number; // percentage
    downtime: number; // hours
  };

  // Key performance indicators
  kpis: {
    name: string;
    value: number;
    target: number;
    unit: string;
    trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
    benchmark?: number;
  }[];

  // Benchmarking
  benchmarks: {
    internal: {
      peerAssets: string[];
      ranking: number;
      percentile: number;
    };
    external?: {
      industryAverage: number;
      industryRanking?: number;
      source: string;
    };
  };

  // Performance trends
  trends: {
    metric: string;
    currentValue: number;
    previousPeriodValue: number;
    changePercent: number;
    trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  }[];

  createdAt: Date;
  createdBy: string;
}

export interface ApprovalWorkflow {
  workflowId: string;
  investmentId: string;
  workflowType: 'CAPITAL_INVESTMENT' | 'BUDGET_REQUEST' | 'EXPENDITURE_APPROVAL';

  // Workflow definition
  workflow: {
    stages: {
      stageId: string;
      stageName: string;
      sequence: number;
      approverRole: string;
      approvalThreshold?: number;
      isParallel: boolean;
      isOptional: boolean;
    }[];
    currentStage: string;
    overallStatus: 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  };

  // Approval history
  approvals: ApprovalRecord[];

  // Escalation rules
  escalation: {
    escalationThreshold: number; // hours
    escalationTo: string;
    maxEscalations: number;
    currentEscalationLevel: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface ApprovalRecord {
  approvalId: string;
  stage: string;
  approver: {
    employeeId: string;
    name: string;
    role: string;
    email: string;
  };
  decision: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DELEGATED';
  approvalDate?: Date;
  comments?: string;
  delegatedTo?: string;
  conditions?: string[];

  createdAt: Date;
}

export interface InvestmentMetrics {
  metricsId: string;
  periodType: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  reportingPeriod: {
    startDate: Date;
    endDate: Date;
  };

  // Portfolio-level metrics
  portfolio: {
    totalInvestments: number;
    totalValue: number;
    averageROI: number;
    riskAdjustedReturn: number;
    portfolioVolatility: number;
  };

  // Performance metrics by category
  byCategory: {
    category: string;
    investmentCount: number;
    totalValue: number;
    averageROI: number;
    bestPerformer: {
      investmentId: string;
      roi: number;
    };
    worstPerformer: {
      investmentId: string;
      roi: number;
    };
  }[];

  // Risk metrics
  risk: {
    portfolioRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    concentrationRisk: number;
    diversificationIndex: number;
    correlationMatrix: Record<string, Record<string, number>>;
  };

  // Trend analysis
  trends: {
    investmentVolume: {
      period: string;
      value: number;
      change: number;
    }[];
    performanceTrend: {
      period: string;
      averageROI: number;
      change: number;
    }[];
  };

  createdAt: Date;
  createdBy: string;
}

export interface CapitalPlan {
  planId: string;
  planName: string;
  description: string;

  // Planning horizon
  planningHorizon: {
    startDate: Date;
    endDate: Date;
    years: number;
  };

  // Strategic objectives
  objectives: {
    objective: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    targetValue: number;
    currentValue: number;
    gap: number;
    initiatives: string[];
  }[];

  // Investment pipeline
  pipeline: {
    investmentId: string;
    investmentName: string;
    category: string;
    estimatedCost: number;
    plannedYear: number;
    quarter?: number;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    status: 'CONCEPTUAL' | 'PLANNING' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED';
    dependencies: string[];
  }[];

  // Annual breakdown
  annualPlans: {
    year: number;
    totalBudget: number;
    allocatedBudget: number;
    investmentCount: number;
    majorInvestments: string[];
    strategicInitiatives: string[];
  }[];

  // Resource requirements
  resourceRequirements: {
    resourceType: string;
    requiredQuantity: number;
    availableQuantity: number;
    gap: number;
    acquisitionPlan: string;
  }[];

  // Risk assessment
  risks: {
    risk: string;
    probability: number;
    impact: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    mitigation: string;
    owner: string;
  }[];

  // Approval and governance
  governance: {
    approvalBoard: string[];
    reviewFrequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
    lastReviewDate: Date;
    nextReviewDate: Date;
    approvalStatus: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'ACTIVE';
  };

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface AssetAcquisition {
  acquisitionId: string;
  assetId?: string; // Set after asset is created
  investmentId: string;

  // Acquisition details
  acquisitionType: 'PURCHASE' | 'LEASE' | 'BUILD' | 'TRANSFER';
  acquisitionMethod: 'DIRECT_PURCHASE' | 'RFP' | 'AUCTION' | 'LEASE_AGREEMENT';

  // Vendor information
  vendor: {
    vendorId: string;
    vendorName: string;
    contactPerson: string;
    contractNumber?: string;
  };

  // Financial terms
  terms: {
    purchasePrice: number;
    currency: string;
    paymentTerms: string;
    warranties: string[];
    serviceAgreements: string[];
    deliveryTerms: string;
  };

  // Timeline
  timeline: {
    orderDate: Date;
    expectedDeliveryDate: Date;
    actualDeliveryDate?: Date;
    installationDate?: Date;
    commissioningDate?: Date;
    acceptanceDate?: Date;
  };

  // Quality and compliance
  quality: {
    inspectionRequired: boolean;
    inspectionDate?: Date;
    inspectionResults?: string;
    complianceCertificates: string[];
    acceptanceStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CONDITIONAL';
  };

  // Documentation
  documents: {
    documentType: string;
    documentName: string;
    documentUrl: string;
    uploadDate: Date;
  }[];

  status:
    | 'PLANNING'
    | 'ORDERED'
    | 'IN_TRANSIT'
    | 'DELIVERED'
    | 'INSTALLED'
    | 'COMMISSIONED'
    | 'ACCEPTED';

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

// Supporting interfaces
export interface RiskAssessment {
  riskId: string;
  riskDescription: string;
  category: 'FINANCIAL' | 'TECHNICAL' | 'OPERATIONAL' | 'REGULATORY' | 'STRATEGIC';
  probability: number; // 0-100
  impact: number; // 0-100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  mitigation: string;
  owner: string;
  status: 'IDENTIFIED' | 'ASSESSED' | 'MITIGATED' | 'MONITORED' | 'CLOSED';
}

export interface ImplementationMilestone {
  milestoneId: string;
  milestoneName: string;
  description: string;
  plannedDate: Date;
  actualDate?: Date;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'CANCELLED';
  dependencies: string[];
  deliverables: string[];
  responsible: string;
  notes?: string;
}
