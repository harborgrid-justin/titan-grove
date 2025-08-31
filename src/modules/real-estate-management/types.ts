/**
 * Real Estate Management Types
 * Comprehensive types for Fortune 100 grade real estate portfolio management
 */

// ================================
// CORE REAL ESTATE TYPES
// ================================

export interface RealEstateProperty {
  propertyId: string;
  propertyNumber: string;
  propertyName: string;
  description: string;
  
  // Property classification
  propertyType: 'OFFICE' | 'WAREHOUSE' | 'MANUFACTURING' | 'RETAIL' | 'MIXED_USE' | 'LAND';
  propertySubtype: string;
  assetClass: 'CORE' | 'CORE_PLUS' | 'VALUE_ADD' | 'OPPORTUNISTIC';
  
  // Location details
  location: {
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    coordinates: {
      latitude: number;
      longitude: number;
    };
    marketArea: string;
    submarket: string;
    zoning: string;
    accessibilityRating: number;
    transportationScore: number;
  };
  
  // Physical characteristics
  physical: {
    totalArea: number; // square feet
    rentableArea: number;
    usableArea: number;
    commonArea: number;
    buildingHeight: number; // floors
    yearBuilt: number;
    lastRenovated?: number;
    condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
    certifications: string[]; // LEED, Energy Star, etc.
  };
  
  // Financial information
  financial: {
    purchasePrice?: number;
    currentValue: number;
    assessedValue: number;
    appraisalDate: Date;
    currency: string;
    pricePerSquareFoot: number;
    annualPropertyTax: number;
    insurance: number;
    totalCostOfOwnership: number;
  };
  
  // Ownership details
  ownership: {
    ownershipType: 'OWNED' | 'LEASED' | 'JOINT_VENTURE' | 'PARTNERSHIP';
    acquisitionDate: Date;
    acquisitionType: 'PURCHASE' | 'LEASE' | 'BUILD' | 'INHERITANCE';
    ownerEntity: string;
    percentOwned: number;
    jointVenturePartners?: string[];
  };
  
  // Operational status
  operations: {
    operationalStatus: 'OPERATIONAL' | 'UNDER_CONSTRUCTION' | 'RENOVATION' | 'VACANT' | 'DISPOSED';
    occupancyStatus: 'FULLY_OCCUPIED' | 'PARTIALLY_OCCUPIED' | 'VACANT';
    primaryUse: string;
    operatingHours: string;
    parkingSpaces: number;
    amenities: string[];
  };
  
  // Performance metrics
  performance: {
    occupancyRate: number; // percentage
    leasingActivity: number; // square feet per month
    avgRentPerSquareFoot: number;
    netOperatingIncome: number; // annual
    capRate: number; // capitalization rate
    totalReturn: number; // percentage
    irr: number; // internal rate of return
    cashOnCashReturn: number;
  };
  
  // ESG and sustainability
  sustainability: {
    energyEfficiencyRating: string;
    carbonFootprint: number; // CO2 equivalent per year
    sustainabilityCertifications: string[];
    greenUpgradesPlan?: string[];
    utilityConsumption: {
      electricity: number; // kWh per year
      gas: number; // therms per year
      water: number; // gallons per year
    };
  };
  
  // Risk assessment
  risk: {
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    riskFactors: string[];
    naturalDisasterRisk: string[];
    marketRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    liquidity: 'HIGH' | 'MEDIUM' | 'LOW';
    insuranceCoverage: {
      propertyInsurance: number;
      liabilityInsurance: number;
      businessInterruption: number;
    };
  };
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface LeaseAgreement {
  leaseId: string;
  propertyId: string;
  leaseNumber: string;
  leaseName: string;
  
  // Tenant information
  tenant: {
    tenantId: string;
    tenantName: string;
    tenantType: 'CORPORATE' | 'GOVERNMENT' | 'INDIVIDUAL' | 'NON_PROFIT';
    industry: string;
    creditRating: string;
    contactInfo: {
      primaryContact: string;
      email: string;
      phone: string;
      address: string;
    };
  };
  
  // Lease terms
  terms: {
    leaseType: 'GROSS' | 'NET' | 'DOUBLE_NET' | 'TRIPLE_NET' | 'MODIFIED_GROSS';
    leaseStartDate: Date;
    leaseEndDate: Date;
    leaseTerm: number; // months
    renewalOptions: {
      numberOfOptions: number;
      renewalTermMonths: number;
      renewalRentAdjustment: number; // percentage
    }[];
    earlyTerminationClause?: {
      allowedAfterMonths: number;
      penaltyAmount: number;
      penaltyType: 'FIXED' | 'PERCENTAGE';
    };
  };
  
  // Space details
  space: {
    leasedArea: number; // square feet
    floorNumbers: number[];
    suiteNumbers: string[];
    parkingSpaces: number;
    storageSpace?: number;
    exclusiveUseAreas?: string[];
    sharedAreas?: string[];
  };
  
  // Rent structure
  rent: {
    baseRent: number; // annual
    rentPerSquareFoot: number; // annual
    rentEscalation: {
      escalationType: 'FIXED' | 'CPI' | 'PERCENTAGE' | 'STEPPED';
      escalationRate: number;
      escalationFrequency: 'ANNUAL' | 'BIENNIAL';
    };
    additionalRents: {
      operatingExpenses: number;
      propertyTaxes: number;
      insurance: number;
      utilities: number;
      maintenance: number;
      commonAreaMaintenance: number;
    };
    securityDeposit: number;
    keyMoney?: number;
  };
  
  // Payment terms
  payment: {
    paymentFrequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
    paymentDueDate: number; // day of month
    lateFeePercentage: number;
    gracePeriodDays: number;
    paymentMethod: string[];
  };
  
  // Responsibilities
  responsibilities: {
    landlordResponsibilities: string[];
    tenantResponsibilities: string[];
    maintenanceResponsibility: 'LANDLORD' | 'TENANT' | 'SHARED';
    utilitiesResponsibility: 'LANDLORD' | 'TENANT' | 'SHARED';
    insuranceRequirements: {
      generalLiability: number;
      propertyInsurance?: number;
      businessInterruption?: number;
    };
  };
  
  // Special clauses
  clauses: {
    useRestrictions: string[];
    assignmentSubletRights: 'FREELY_ASSIGNABLE' | 'LANDLORD_CONSENT' | 'PROHIBITED';
    improvements: {
      tenantImprovementsAllowance: number;
      approvalRequired: boolean;
      ownershipOfImprovements: 'LANDLORD' | 'TENANT';
    };
    rightOfFirstRefusal?: boolean;
    exclusivityClause?: string;
    coTenancyRequirements?: string[];
  };
  
  // Lease status and tracking
  status: {
    leaseStatus: 'DRAFT' | 'NEGOTIATING' | 'EXECUTED' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
    executionDate?: Date;
    commencementDate?: Date;
    occupancyDate?: Date;
    expirationDate: Date;
    noticeToVacateReceived?: Date;
    renewalNoticeDate?: Date;
  };
  
  // Performance tracking
  performance: {
    paymentHistory: {
      onTimePayments: number;
      latePayments: number;
      defaults: number;
      currentBalance: number;
    };
    tenantSatisfactionScore?: number;
    maintenanceRequests: number;
    renewalProbability: number; // percentage
  };
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface PropertyPortfolio {
  portfolioId: string;
  portfolioName: string;
  description: string;
  
  // Portfolio composition
  properties: {
    propertyId: string;
    propertyName: string;
    propertyType: string;
    currentValue: number;
    weight: number; // percentage of total portfolio value
    acquisitionDate: Date;
    performanceRank: number;
  }[];
  
  // Portfolio metrics
  metrics: {
    totalValue: number;
    totalArea: number; // square feet
    averageOccupancyRate: number;
    totalAnnualIncome: number;
    netOperatingIncome: number;
    portfolioYield: number;
    averageCapRate: number;
    totalReturn: number;
    riskAdjustedReturn: number;
    sharpeRatio: number;
  };
  
  // Geographic diversification
  geographic: {
    regions: {
      region: string;
      propertyCount: number;
      totalValue: number;
      percentage: number;
    }[];
    cities: {
      city: string;
      propertyCount: number;
      totalValue: number;
      percentage: number;
    }[];
    concentrationRisk: number;
  };
  
  // Property type diversification
  propertyTypes: {
    propertyType: string;
    propertyCount: number;
    totalValue: number;
    totalArea: number;
    avgOccupancyRate: number;
    avgCapRate: number;
    percentage: number;
  }[];
  
  // Performance analysis
  performance: {
    bestPerformers: {
      propertyId: string;
      propertyName: string;
      totalReturn: number;
      capRate: number;
    }[];
    worstPerformers: {
      propertyId: string;
      propertyName: string;
      totalReturn: number;
      capRate: number;
    }[];
    benchmarkComparison: {
      benchmark: string;
      portfolioReturn: number;
      benchmarkReturn: number;
      outperformance: number;
    }[];
  };
  
  // Risk analysis
  risk: {
    portfolioRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    concentrationRisk: number;
    marketRisk: number;
    liquidityRisk: number;
    geographicRisk: number;
    tenantConcentration: {
      topTenants: {
        tenantName: string;
        percentOfIncome: number;
        creditRating: string;
      }[];
      concentrationIndex: number;
    };
  };
  
  // Strategic objectives
  objectives: {
    targetReturn: number;
    targetOccupancyRate: number;
    targetGeographicMix: { region: string; targetPercentage: number }[];
    targetPropertyTypeMix: { propertyType: string; targetPercentage: number }[];
    acquisitionPipeline: {
      targetAcquisitions: number;
      estimatedValue: number;
      targetMarkets: string[];
    };
    dispositionPlan: {
      propertiesToSell: string[];
      estimatedValue: number;
      targetTimeline: string;
    };
  };
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface FacilityManagement {
  facilityId: string;
  propertyId: string;
  facilityName: string;
  
  // Facility details
  facility: {
    facilityType: 'OFFICE' | 'WAREHOUSE' | 'MANUFACTURING' | 'DATA_CENTER' | 'LABORATORY';
    totalArea: number;
    operationalArea: number;
    supportArea: number;
    capacity: {
      employees: number;
      equipment: number;
      storage: number; // cubic feet
    };
    operatingHours: {
      normalHours: string;
      extendedHours?: string;
      availability247?: boolean;
    };
  };
  
  // Space management
  spaceManagement: {
    spaceAllocation: {
      department: string;
      allocatedArea: number;
      utilization: number; // percentage
      costCenter: string;
    }[];
    spaceUtilization: {
      peakUtilization: number;
      averageUtilization: number;
      lowUtilization: number;
      utilizationByHour: { hour: number; utilization: number }[];
    };
    occupancyPlanning: {
      currentOccupancy: number;
      plannedOccupancy: number;
      maxCapacity: number;
      expansionPlan?: string;
    };
  };
  
  // Building systems
  buildingSystems: {
    hvac: {
      systemType: string;
      zones: number;
      efficiency: number;
      lastMaintenance: Date;
      nextMaintenance: Date;
      energyConsumption: number; // kWh per month
    };
    lighting: {
      systemType: string;
      automationLevel: 'MANUAL' | 'SCHEDULED' | 'OCCUPANCY_BASED' | 'SMART';
      energyConsumption: number; // kWh per month
    };
    security: {
      accessControlType: string;
      surveillanceSystem: string;
      alarmSystem: string;
      lastSecurityAudit: Date;
    };
    fire_safety: {
      sprinklerSystem: boolean;
      fireAlarms: boolean;
      emergencyExits: number;
      lastInspection: Date;
      nextInspection: Date;
    };
  };
  
  // Services and amenities
  services: {
    cleaning: {
      serviceProvider: string;
      frequency: string;
      cost: number; // monthly
      qualityRating: number;
    };
    maintenance: {
      maintenanceType: 'IN_HOUSE' | 'CONTRACTED' | 'HYBRID';
      serviceProviders: string[];
      preventiveMaintenanceSchedule: string;
      emergencyResponseTime: number; // hours
    };
    utilities: {
      electricity: { provider: string; monthlyAverage: number; rate: number };
      gas?: { provider: string; monthlyAverage: number; rate: number };
      water: { provider: string; monthlyAverage: number; rate: number };
      internet: { provider: string; speed: string; cost: number };
      phone: { provider: string; lines: number; cost: number };
    };
    amenities: {
      cafeteria: boolean;
      gym: boolean;
      conferenceRooms: number;
      parking: { total: number; assigned: number; visitor: number };
      childcare: boolean;
    };
  };
  
  // Compliance and certifications
  compliance: {
    buildingCodes: {
      compliance: boolean;
      lastInspection: Date;
      nextInspection: Date;
      violations: string[];
    };
    environmentalCompliance: {
      airQuality: boolean;
      wasteManagement: boolean;
      hazardousMaterials: boolean;
      certifications: string[];
    };
    accessibility: {
      adaCompliant: boolean;
      lastAudit: Date;
      improvements: string[];
    };
  };
  
  // Performance metrics
  performance: {
    operationalEfficiency: number; // percentage
    energyEfficiency: number; // kWh per square foot
    costPerSquareFoot: number; // annual
    tenantSatisfaction: number; // 1-10 scale
    maintenanceResponseTime: number; // hours
    uptimePercentage: number;
  };
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface SpaceOptimization {
  optimizationId: string;
  propertyId: string;
  optimizationName: string;
  
  // Current state analysis
  currentState: {
    totalArea: number;
    utilizableArea: number;
    currentUtilization: number;
    wastedSpace: number;
    inefficiencies: string[];
    costPerSquareFoot: number;
    occupancyRate: number;
  };
  
  // Optimization objectives
  objectives: {
    targetUtilization: number;
    costReductionTarget: number; // percentage
    efficiencyGainTarget: number; // percentage
    occupancyImprovement: number; // percentage
    priorities: ('COST_REDUCTION' | 'EFFICIENCY' | 'EMPLOYEE_SATISFACTION' | 'FLEXIBILITY')[];
  };
  
  // Space analysis
  spaceAnalysis: {
    spaceTypes: {
      spaceType: string;
      currentArea: number;
      utilization: number;
      costPerSquareFoot: number;
      optimizationPotential: number; // percentage
    }[];
    utilizationPatterns: {
      timeOfDay: { hour: number; utilization: number }[];
      dayOfWeek: { day: string; utilization: number }[];
      seasonal: { month: string; utilization: number }[];
    };
    bottlenecks: {
      location: string;
      issue: string;
      impact: 'LOW' | 'MEDIUM' | 'HIGH';
      solution: string;
    }[];
  };
  
  // Optimization scenarios
  scenarios: {
    scenarioName: string;
    description: string;
    changes: {
      area: string;
      currentUse: string;
      proposedUse: string;
      areaChange: number; // square feet
      investmentRequired: number;
    }[];
    expectedBenefits: {
      utilizationImprovement: number; // percentage
      costSavings: number; // annual
      efficiencyGain: number; // percentage
      occupancyIncrease: number; // percentage
    };
    implementation: {
      timeline: number; // weeks
      cost: number;
      disruption: 'LOW' | 'MEDIUM' | 'HIGH';
      riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    };
    roi: {
      paybackPeriod: number; // months
      netPresentValue: number;
      internalRateOfReturn: number;
    };
  }[];
  
  // Recommendations
  recommendations: {
    immediate: string[];
    shortTerm: string[]; // within 6 months
    longTerm: string[]; // 6+ months
    considerForFuture: string[];
  };
  
  // Implementation plan
  implementationPlan?: {
    selectedScenario: string;
    phases: {
      phase: number;
      description: string;
      startDate: Date;
      endDate: Date;
      cost: number;
      disruption: string;
      deliverables: string[];
    }[];
    totalCost: number;
    totalTimeline: number; // weeks
    riskMitigation: string[];
  };
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface MarketAnalysis {
  analysisId: string;
  marketArea: string;
  analysisDate: Date;
  
  // Market overview
  market: {
    marketName: string;
    marketType: 'PRIMARY' | 'SECONDARY' | 'TERTIARY';
    population: number;
    economicGrowthRate: number;
    unemploymentRate: number;
    medianIncome: number;
    majorEmployers: string[];
    economicDrivers: string[];
  };
  
  // Supply analysis
  supply: {
    totalInventory: number; // square feet
    vacantSpace: number;
    overallVacancyRate: number;
    newConstruction: {
      underConstruction: number;
      plannedConstruction: number;
      deliveriesThisYear: number;
      deliveriesNextYear: number;
    };
    absorptionRate: number; // square feet per year
    months_of_supply: number;
  };
  
  // Demand analysis
  demand: {
    demandDrivers: string[];
    netAbsorption: number; // square feet
    grossAbsorption: number;
    demandForecast: {
      nextYear: number;
      twoYears: number;
      fiveYears: number;
    };
    demandByTenantType: {
      tenantType: string;
      demandVolume: number; // square feet
      growthRate: number;
    }[];
  };
  
  // Pricing analysis
  pricing: {
    averageRent: number; // per square foot
    rentRange: {
      class_a: { min: number; max: number; average: number };
      class_b: { min: number; max: number; average: number };
      class_c: { min: number; max: number; average: number };
    };
    rentGrowthRate: number; // annual percentage
    rentForecast: {
      nextYear: number;
      twoYears: number;
      fiveYears: number;
    };
    concessions: {
      freeRentMonths: number;
      tenantImprovements: number; // per square foot
      otherConcessions: string[];
    };
  };
  
  // Investment analysis
  investment: {
    averageCapRate: number;
    capRateRange: { min: number; max: number };
    averagePricePerSquareFoot: number;
    transactionVolume: number; // annual dollar amount
    investmentActivityLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    majorInvestors: string[];
  };
  
  // Competitive analysis
  competition: {
    directCompetitors: {
      propertyName: string;
      rentPerSquareFoot: number;
      vacancyRate: number;
      yearBuilt: number;
      amenities: string[];
    }[];
    competitivePosition: 'PREMIUM' | 'COMPETITIVE' | 'VALUE';
    marketShare: number; // percentage
    differentiators: string[];
  };
  
  // Market trends
  trends: {
    emergingTrends: string[];
    technologyImpacts: string[];
    demographicShifts: string[];
    regulatoryChanges: string[];
    sustainabilityTrends: string[];
  };
  
  // Risk factors
  risks: {
    marketRisks: string[];
    economicRisks: string[];
    competitiveThreats: string[];
    regulatoryRisks: string[];
    environmentalRisks: string[];
  };
  
  // Opportunities
  opportunities: {
    growthOpportunities: string[];
    underservedSegments: string[];
    valueAddOpportunities: string[];
    developmentOpportunities: string[];
  };
  
  createdAt: Date;
  createdBy: string;
}

export interface PropertyValuation {
  valuationId: string;
  propertyId: string;
  valuationType: 'APPRAISAL' | 'BROKER_OPINION' | 'AUTOMATED_VALUATION' | 'INTERNAL_ASSESSMENT';
  valuationDate: Date;
  
  // Valuation approaches
  approaches: {
    costApproach?: {
      landValue: number;
      improvementCost: number;
      depreciation: number;
      totalValue: number;
      confidence: number; // percentage
    };
    incomeApproach?: {
      netOperatingIncome: number;
      capitalizationRate: number;
      totalValue: number;
      confidence: number;
    };
    salesComparison?: {
      comparableProperties: {
        propertyId: string;
        salePrice: number;
        pricePerSquareFoot: number;
        saleDate: Date;
        adjustments: Record<string, number>;
      }[];
      indicatedValue: number;
      confidence: number;
    };
  };
  
  // Final valuation
  finalValuation: {
    lowEstimate: number;
    highEstimate: number;
    mostLikelyValue: number;
    weightedAverage?: number;
    approachWeights?: {
      cost: number;
      income: number;
      sales: number;
    };
  };
  
  // Valuation assumptions
  assumptions: {
    marketConditions: string;
    propertyCondition: string;
    occupancyRate: number;
    rentRoll: boolean;
    marketRent: number;
    expenseRatio: number;
    capRate: number;
    discountRate: number;
  };
  
  // Market data
  marketData: {
    comparableSales: number;
    averageDaysOnMarket: number;
    marketTrend: 'INCREASING' | 'STABLE' | 'DECREASING';
    marketConditions: 'BUYER' | 'SELLER' | 'BALANCED';
  };
  
  // Risk assessment
  riskAssessment: {
    marketRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    propertySpecificRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    liquidityRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    overallRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    riskFactors: string[];
  };
  
  // Valuation confidence
  confidence: {
    overallConfidence: number; // percentage
    dataQuality: number;
    marketKnowledge: number;
    propertyInspection: boolean;
    limitations: string[];
  };
  
  // Appraiser information (if applicable)
  appraiser?: {
    name: string;
    license: string;
    company: string;
    experience: number; // years
    specializations: string[];
  };
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface OccupancyAnalysis {
  analysisId: string;
  propertyId: string;
  analysisDate: Date;
  analysisPeriod: {
    startDate: Date;
    endDate: Date;
  };
  
  // Current occupancy metrics
  currentOccupancy: {
    totalSpace: number; // square feet
    occupiedSpace: number;
    vacantSpace: number;
    occupancyRate: number; // percentage
    economicOccupancy: number; // percentage (accounting for rent loss)
    physicalOccupancy: number; // percentage
  };
  
  // Tenant analysis
  tenantAnalysis: {
    tenantCount: number;
    tenantMix: {
      tenantType: string;
      tenantCount: number;
      totalArea: number;
      percentOfSpace: number;
      averageRent: number;
    }[];
    tenantQuality: {
      creditRating: string;
      tenantCount: number;
      percentOfIncome: number;
    }[];
    tenantRetention: {
      averageTenancy: number; // months
      renewalRate: number; // percentage
      churnRate: number; // percentage
    };
  };
  
  // Lease expiration analysis
  leaseExpirations: {
    year: number;
    expiringLeases: number;
    expiringSquareFeet: number;
    percentOfIncome: number;
    renewalProbability: number; // percentage
  }[];
  
  // Vacancy analysis
  vacancyAnalysis: {
    vacantUnits: {
      unitNumber: string;
      squareFeet: number;
      lastOccupied: Date;
      marketingStatus: 'AVAILABLE' | 'UNDER_NEGOTIATION' | 'PENDING_LEASE';
      timeVacant: number; // days
      reasonForVacancy: string;
    }[];
    vacancyReasons: {
      reason: string;
      count: number;
      squareFeet: number;
    }[];
    averageTimeToLease: number; // days
    difficultToLease: string[]; // unit numbers
  };
  
  // Market positioning
  positioning: {
    competitivePosition: 'PREMIUM' | 'COMPETITIVE' | 'VALUE';
    rentCompetitiveness: number; // percentage vs market
    amenityCompetitiveness: 'SUPERIOR' | 'COMPETITIVE' | 'BELOW_MARKET';
    locationAdvantage: 'PRIME' | 'GOOD' | 'AVERAGE' | 'POOR';
  };
  
  // Occupancy trends
  trends: {
    historicalOccupancy: {
      period: string;
      occupancyRate: number;
      netAbsorption: number;
    }[];
    seasonalPatterns: {
      month: string;
      averageOccupancy: number;
      leasingActivity: number;
    }[];
    trendAnalysis: {
      occupancyTrend: 'IMPROVING' | 'STABLE' | 'DECLINING';
      leasingVelocity: 'INCREASING' | 'STABLE' | 'DECREASING';
      rentTrend: 'INCREASING' | 'STABLE' | 'DECREASING';
    };
  };
  
  // Performance metrics
  performance: {
    netOperatingIncome: number;
    incomePerSquareFoot: number;
    operatingExpenseRatio: number;
    totalReturn: number; // percentage
    occupancyVsMarket: number; // percentage variance
    rentVsMarket: number; // percentage variance
  };
  
  // Optimization recommendations
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
    capitalImprovements: {
      improvement: string;
      estimatedCost: number;
      expectedROI: number;
      timeline: string;
    }[];
  };
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface RealEstateForecast {
  forecastId: string;
  forecastName: string;
  forecastType: 'MARKET' | 'PROPERTY' | 'PORTFOLIO';
  marketArea?: string;
  propertyId?: string;
  portfolioId?: string;
  
  // Forecast horizon
  forecastPeriod: {
    startDate: Date;
    endDate: Date;
    forecastHorizon: number; // years
  };
  
  // Economic assumptions
  assumptions: {
    gdpGrowthRate: number;
    inflationRate: number;
    unemploymentRate: number;
    interestRates: {
      federalFunds: number;
      treasuryTenYear: number;
      commercialMortgage: number;
    };
    populationGrowth: number;
    employmentGrowth: number;
  };
  
  // Demand forecast
  demandForecast: {
    annualDemand: {
      year: number;
      demandSquareFeet: number;
      growthRate: number;
      confidenceInterval: { low: number; high: number };
    }[];
    demandDrivers: {
      driver: string;
      impact: 'HIGH' | 'MEDIUM' | 'LOW';
      description: string;
    }[];
    demandBySegment: {
      segment: string;
      currentDemand: number;
      forecastedDemand: number[];
      growthRate: number;
    }[];
  };
  
  // Supply forecast
  supplyForecast: {
    newSupply: {
      year: number;
      newDeliveries: number; // square feet
      pipelineProjects: number;
      confidenceLevel: number;
    }[];
    supplyConstraints: string[];
    developmentCosts: {
      year: number;
      costPerSquareFoot: number;
      landCosts: number;
      constructionCosts: number;
    }[];
  };
  
  // Rent forecast
  rentForecast: {
    rentProjections: {
      year: number;
      averageRent: number;
      rentGrowthRate: number;
      confidenceInterval: { low: number; high: number };
    }[];
    rentDrivers: string[];
    rentByClass: {
      propertyClass: string;
      currentRent: number;
      forecastedRent: number[];
    }[];
  };
  
  // Occupancy forecast
  occupancyForecast: {
    occupancyProjections: {
      year: number;
      occupancyRate: number;
      netAbsorption: number;
      vacancyRate: number;
    }[];
    occupancyDrivers: string[];
    cyclicalFactors: string[];
  };
  
  // Investment forecast
  investmentForecast: {
    capRateProjections: {
      year: number;
      averageCapRate: number;
      capRateRange: { low: number; high: number };
    }[];
    valueProjections: {
      year: number;
      averageValuePerSquareFoot: number;
      totalReturnForecast: number;
    }[];
    investmentVolume: {
      year: number;
      transactionVolume: number;
      activityLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    }[];
  };
  
  // Scenario analysis
  scenarios: {
    scenarioName: string;
    probability: number;
    description: string;
    keyAssumptions: Record<string, number>;
    outcomes: {
      rentGrowth: number;
      occupancyRate: number;
      totalReturn: number;
      capRate: number;
    };
  }[];
  
  // Risk assessment
  risks: {
    forecastRisks: string[];
    uncertainties: string[];
    sensitivityAnalysis: {
      variable: string;
      baseCase: number;
      pessimistic: number;
      optimistic: number;
      impact: 'HIGH' | 'MEDIUM' | 'LOW';
    }[];
  };
  
  // Model confidence
  confidence: {
    overallConfidence: number; // percentage
    dataQuality: number;
    modelAccuracy: number;
    limitations: string[];
    trackingMetrics: {
      metric: string;
      forecastAccuracy: number;
      bias: number;
    }[];
  };
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface PropertyInvestment {
  investmentId: string;
  propertyId: string;
  investmentType: 'ACQUISITION' | 'DEVELOPMENT' | 'RENOVATION' | 'CAPITAL_IMPROVEMENT';
  
  // Investment details
  investment: {
    totalInvestment: number;
    equityInvestment: number;
    debtFinancing: number;
    investmentDate: Date;
    investmentStrategy: 'CORE' | 'CORE_PLUS' | 'VALUE_ADD' | 'OPPORTUNISTIC';
    holdingPeriod: number; // years
    exitStrategy: 'HOLD' | 'SELL' | 'REFINANCE';
  };
  
  // Financial projections
  projections: {
    year: number;
    grossRent: number;
    operatingExpenses: number;
    netOperatingIncome: number;
    debtService: number;
    cashFlow: number;
    propertyValue: number;
  }[];
  
  // Return metrics
  returns: {
    irr: number; // internal rate of return
    equityMultiple: number;
    averageAnnualReturn: number;
    cashOnCashReturn: number;
    totalReturn: number;
    riskAdjustedReturn: number;
  };
  
  // Performance tracking
  performance: {
    actualVsProjected: {
      metric: string;
      projected: number;
      actual: number;
      variance: number;
    }[];
    keyPerformanceIndicators: {
      occupancyRate: number;
      rentGrowth: number;
      expenseGrowth: number;
      totalReturn: number;
    };
  };
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface MaintenanceContract {
  contractId: string;
  propertyId: string;
  contractName: string;
  
  // Contractor information
  contractor: {
    contractorId: string;
    contractorName: string;
    contractorType: 'GENERAL' | 'SPECIALIZED' | 'EMERGENCY';
    contactInfo: {
      primaryContact: string;
      email: string;
      phone: string;
      emergencyPhone?: string;
    };
    credentials: {
      license: string;
      insurance: string;
      bonding: string;
      certifications: string[];
    };
  };
  
  // Contract terms
  terms: {
    contractType: 'SERVICE_AGREEMENT' | 'MAINTENANCE_CONTRACT' | 'WORK_ORDER';
    startDate: Date;
    endDate: Date;
    renewalTerms: {
      autoRenewal: boolean;
      renewalPeriod?: number; // months
      noticePeriod?: number; // days
    };
    terminationClause: {
      noticePeriod: number; // days
      terminationFee?: number;
      conditions: string[];
    };
  };
  
  // Services covered
  services: {
    serviceCategory: string;
    serviceDescription: string;
    frequency: string;
    responseTime: number; // hours
    includedInContract: boolean;
    hourlyRate?: number;
    materialMarkup?: number;
  }[];
  
  // Pricing structure
  pricing: {
    contractValue: number;
    paymentStructure: 'FIXED' | 'TIME_AND_MATERIALS' | 'UNIT_PRICE' | 'PERFORMANCE_BASED';
    paymentSchedule: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY' | 'PER_SERVICE';
    escalationClause: {
      escalationType: 'CPI' | 'FIXED_PERCENTAGE' | 'NEGOTIATED';
      escalationRate?: number;
      escalationFrequency: 'ANNUAL' | 'BIENNIAL';
    };
  };
  
  // Performance standards
  performanceStandards: {
    responseTime: {
      emergency: number; // hours
      urgent: number;
      routine: number;
    };
    completionTime: {
      emergency: number;
      urgent: number;
      routine: number;
    };
    qualityStandards: string[];
    performanceMetrics: {
      metric: string;
      target: number;
      measurement: string;
    }[];
  };
  
  // Contract performance
  performance: {
    responseTimeCompliance: number; // percentage
    completionTimeCompliance: number;
    qualityRating: number; // 1-10 scale
    customerSatisfaction: number;
    costPerformance: {
      budgetedAmount: number;
      actualAmount: number;
      variance: number;
    };
  };
  
  status: 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED' | 'RENEWED';
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface CapitalImprovement {
  improvementId: string;
  propertyId: string;
  improvementName: string;
  description: string;
  
  // Improvement classification
  improvementType: 'RENOVATION' | 'EXPANSION' | 'UPGRADE' | 'REPLACEMENT' | 'NEW_CONSTRUCTION';
  improvementCategory: 'BUILDING_SYSTEMS' | 'INTERIOR' | 'EXTERIOR' | 'INFRASTRUCTURE' | 'AMENITIES';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  urgency: 'IMMEDIATE' | 'WITHIN_MONTH' | 'WITHIN_QUARTER' | 'WITHIN_YEAR' | 'PLANNED';
  
  // Business justification
  justification: {
    businessNeed: string;
    expectedBenefits: string[];
    consequencesOfDelay: string[];
    strategicAlignment: string;
    regulatoryRequirement: boolean;
  };
  
  // Financial details
  financial: {
    estimatedCost: number;
    approvedBudget?: number;
    actualCost?: number;
    fundingSource: 'OPERATING_BUDGET' | 'CAPITAL_BUDGET' | 'RESERVE_FUND' | 'LOAN' | 'TENANT_ALLOWANCE';
    costBreakdown: {
      materials: number;
      labor: number;
      permits: number;
      design: number;
      contingency: number;
    };
  };
  
  // Project details
  project: {
    scope: string[];
    specifications: Record<string, any>;
    affectedAreas: string[];
    impactOnOperations: 'NO_IMPACT' | 'MINIMAL' | 'MODERATE' | 'SIGNIFICANT';
    tenantImpact: 'NO_IMPACT' | 'MINIMAL' | 'MODERATE' | 'SIGNIFICANT';
  };
  
  // Timeline
  timeline: {
    plannedStartDate: Date;
    plannedEndDate: Date;
    actualStartDate?: Date;
    actualEndDate?: Date;
    duration: number; // days
    milestones: {
      milestone: string;
      plannedDate: Date;
      actualDate?: Date;
      status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
    }[];
  };
  
  // Contractors and vendors
  contractors: {
    contractorType: 'GENERAL' | 'SPECIALIZED' | 'SUBCONTRACTOR';
    contractorName: string;
    contractValue: number;
    startDate: Date;
    endDate: Date;
    performance: {
      qualityRating: number;
      timelineCompliance: number;
      budgetCompliance: number;
    };
  }[];
  
  // Permits and approvals
  permitsApprovals: {
    permitType: string;
    issuingAuthority: string;
    applicationDate?: Date;
    approvalDate?: Date;
    expirationDate?: Date;
    permitNumber?: string;
    status: 'NOT_REQUIRED' | 'APPLIED' | 'APPROVED' | 'EXPIRED' | 'REJECTED';
  }[];
  
  // Quality and compliance
  quality: {
    inspections: {
      inspectionType: string;
      inspectionDate: Date;
      inspector: string;
      result: 'PASSED' | 'FAILED' | 'CONDITIONAL';
      notes: string;
    }[];
    warranties: {
      component: string;
      warrantyPeriod: number; // months
      warrantyProvider: string;
      startDate: Date;
      endDate: Date;
    }[];
  };
  
  // Performance impact
  performanceImpact: {
    energyEfficiency: {
      beforeImprovement: number;
      afterImprovement?: number;
      projectedSavings: number; // annual
    };
    operatingCosts: {
      beforeImprovement: number;
      afterImprovement?: number;
      projectedSavings: number; // annual
    };
    propertyValue: {
      valueAddition: number;
      updatedAppraisal?: number;
    };
    tenantSatisfaction: {
      beforeRating?: number;
      afterRating?: number;
      improvementAreas: string[];
    };
  };
  
  // Return on investment
  roi: {
    totalInvestment: number;
    annualSavings: number;
    valueIncrease: number;
    paybackPeriod: number; // months
    netPresentValue: number;
    internalRateOfReturn: number;
  };
  
  status: 'PLANNED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface PropertyPerformance {
  performanceId: string;
  propertyId: string;
  reportingPeriod: {
    startDate: Date;
    endDate: Date;
    periodType: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  };
  
  // Financial performance
  financial: {
    grossRent: number;
    netRent: number;
    operatingExpenses: number;
    netOperatingIncome: number;
    cashFlow: number;
    totalReturn: number; // percentage
    capRate: number;
    operatingMargin: number; // percentage
  };
  
  // Operational performance
  operational: {
    occupancyRate: number; // percentage
    averageRent: number;
    rentPerSquareFoot: number;
    leasingVelocity: number; // square feet per month
    tenantRetentionRate: number; // percentage
    averageLeaseLength: number; // months
  };
  
  // Expense analysis
  expenses: {
    category: string;
    amount: number;
    percentOfIncome: number;
    perSquareFoot: number;
    budgetVariance: number; // percentage
  }[];
  
  // Benchmarking
  benchmarks: {
    peerComparison: {
      metric: string;
      propertyValue: number;
      peerAverage: number;
      percentile: number;
      ranking: number;
    }[];
    marketComparison: {
      metric: string;
      propertyValue: number;
      marketAverage: number;
      variance: number; // percentage
    }[];
  };
  
  // Key performance indicators
  kpis: {
    name: string;
    value: number;
    target: number;
    unit: string;
    trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];
  
  // Performance trends
  trends: {
    metric: string;
    currentValue: number;
    previousValue: number;
    changePercent: number;
    trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
    analysisComment: string;
  }[];
  
  createdAt: Date;
  createdBy: string;
}

export interface LocationAnalysis {
  analysisId: string;
  location: {
    address: string;
    coordinates: { latitude: number; longitude: number };
    city: string;
    state: string;
    zipCode: string;
  };
  
  // Location scoring
  locationScore: {
    overallScore: number; // 1-100
    accessibilityScore: number;
    amenityScore: number;
    transportationScore: number;
    safetyScore: number;
    economicScore: number;
  };
  
  // Demographics
  demographics: {
    population: number;
    populationGrowthRate: number; // annual percentage
    medianAge: number;
    medianHouseholdIncome: number;
    educationLevel: {
      highSchool: number; // percentage
      college: number;
      graduate: number;
    };
    employmentRate: number;
  };
  
  // Economic factors
  economic: {
    majorEmployers: { name: string; employees: number; industry: string }[];
    economicDiversification: number; // 1-10 scale
    unemploymentRate: number;
    averageWage: number;
    economicGrowthRate: number; // annual percentage
    businessClimate: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR';
  };
  
  // Transportation and accessibility
  transportation: {
    publicTransitAccess: boolean;
    transitScore: number; // 1-100
    walkabilityScore: number; // 1-100
    parkingAvailability: 'ABUNDANT' | 'ADEQUATE' | 'LIMITED' | 'POOR';
    highwayAccess: {
      majorHighways: string[];
      accessRating: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR';
    };
    airportDistance: number; // miles
  };
  
  // Amenities and services
  amenities: {
    shoppingCenters: number;
    restaurants: number;
    bankingServices: number;
    healthcareFacilities: number;
    recreationFacilities: number;
    educationalInstitutions: number;
    qualityOfLife: 'HIGH' | 'MEDIUM' | 'LOW';
  };
  
  // Market characteristics
  marketCharacteristics: {
    marketMaturity: 'EMERGING' | 'GROWTH' | 'MATURE' | 'DECLINING';
    competitiveness: 'LOW' | 'MEDIUM' | 'HIGH';
    barrierToEntry: 'LOW' | 'MEDIUM' | 'HIGH';
    regulatoryEnvironment: 'FAVORABLE' | 'NEUTRAL' | 'RESTRICTIVE';
  };
  
  // Risk factors
  risks: {
    naturalDisasterRisk: string[];
    crimeRate: 'LOW' | 'MEDIUM' | 'HIGH';
    environmentalConcerns: string[];
    regulatoryRisks: string[];
  };
  
  // Future outlook
  outlook: {
    growthPotential: 'HIGH' | 'MEDIUM' | 'LOW';
    developmentPlans: string[];
    infrastructureInvestments: string[];
    economicForecast: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  };
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface RentalYield {
  yieldId: string;
  propertyId: string;
  calculationDate: Date;
  
  // Rental income
  rentalIncome: {
    grossRentalIncome: number; // annual
    netRentalIncome: number; // annual after vacancy
    rentCollectionRate: number; // percentage
    otherIncome: number; // parking, laundry, etc.
  };
  
  // Property costs
  propertyCosts: {
    propertyTaxes: number; // annual
    insurance: number; // annual
    maintenance: number; // annual
    management: number; // annual
    utilities: number; // annual
    otherExpenses: number; // annual
    totalExpenses: number; // annual
  };
  
  // Yield calculations
  yields: {
    grossRentalYield: number; // percentage
    netRentalYield: number; // percentage
    cashYield: number; // percentage
    totalReturn: number; // percentage
    riskAdjustedReturn: number; // percentage
  };
  
  // Comparison metrics
  comparison: {
    marketAverageYield: number;
    peerAverageYield: number;
    benchmarkYield: number;
    relativePerformance: 'OUTPERFORMING' | 'MARKET' | 'UNDERPERFORMING';
  };
  
  // Factors affecting yield
  yieldFactors: {
    occupancyRate: number;
    rentGrowthRate: number;
    expenseGrowthRate: number;
    marketRentPremium: number; // percentage above/below market
    tenantQuality: 'HIGH' | 'MEDIUM' | 'LOW';
  };
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}