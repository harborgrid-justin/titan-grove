/**
 * Rental Management Types
 * Comprehensive types for Fortune 100 grade rental asset management
 */

// ================================
// CORE RENTAL ASSET TYPES
// ================================

export interface RentalAsset {
  rentalAssetId: string;
  assetId: string; // Reference to base asset
  assetNumber: string;
  assetName: string;
  description: string;
  
  // Asset classification
  assetCategory: 'EQUIPMENT' | 'VEHICLE' | 'MACHINERY' | 'TOOL' | 'TECHNOLOGY' | 'FURNITURE';
  assetType: string;
  assetSubtype: string;
  
  // Specifications
  specifications: {
    manufacturer: string;
    model: string;
    year: number;
    serialNumber: string;
    capacity?: string;
    dimensions?: {
      length: number;
      width: number;
      height: number;
      weight: number;
    };
    technicalSpecs: Record<string, any>;
  };
  
  // Rental configuration
  rentalConfig: {
    isRentable: boolean;
    minimumRentalPeriod: number; // hours
    maximumRentalPeriod: number; // hours
    advanceBookingDays: number;
    blackoutPeriods: {
      startDate: Date;
      endDate: Date;
      reason: string;
    }[];
  };
  
  // Location and availability
  location: {
    currentLocation: string;
    homeLocation: string;
    isTransportable: boolean;
    transportationCost?: number;
    availabilityZone: string[];
  };
  
  // Condition and maintenance
  condition: {
    overallCondition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'OUT_OF_SERVICE';
    lastInspectionDate: Date;
    nextInspectionDate: Date;
    maintenanceSchedule: string;
    isOperational: boolean;
    knownIssues: string[];
  };
  
  // Financial information
  financial: {
    acquisitionCost: number;
    currentValue: number;
    depreciationRate: number; // percentage per year
    insuranceValue: number;
    targetUtilization: number; // percentage
    targetRevenue: number; // annual
  };
  
  // Rental pricing
  pricing: {
    hourlyRate: number;
    dailyRate: number;
    weeklyRate: number;
    monthlyRate: number;
    seasonalRates?: {
      season: string;
      multiplier: number;
    }[];
    damageDeposit: number;
    deliveryFee?: number;
  };
  
  // Usage tracking
  usage: {
    totalRentalHours: number;
    totalRentals: number;
    averageRentalDuration: number; // hours
    lastRentalDate?: Date;
    utilizationRate: number; // percentage
    revenueGenerated: number; // total lifetime
  };
  
  // Compliance and certifications
  compliance: {
    requiredCertifications: string[];
    currentCertifications: {
      certification: string;
      issueDate: Date;
      expirationDate: Date;
      issuingAuthority: string;
    }[];
    safetyRequirements: string[];
    operatorRequirements: string[];
  };
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface RentalAgreement {
  agreementId: string;
  agreementNumber: string;
  rentalAssetId: string;
  customerId: string;
  
  // Customer information
  customer: {
    customerId: string;
    customerName: string;
    customerType: 'INDIVIDUAL' | 'CORPORATE' | 'GOVERNMENT' | 'NON_PROFIT';
    contactInfo: {
      primaryContact: string;
      email: string;
      phone: string;
      address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
      };
    };
    creditInfo: {
      creditRating?: string;
      creditLimit?: number;
      paymentTerms: string;
      requiresDeposit: boolean;
    };
  };
  
  // Rental terms
  rentalTerms: {
    startDate: Date;
    endDate: Date;
    duration: number; // hours
    renewalOptions: {
      numberOfRenewals: number;
      renewalDuration: number; // hours each
      renewalRate?: number;
    }[];
    earlyTermination: {
      allowed: boolean;
      penaltyType: 'FIXED' | 'PERCENTAGE' | 'NONE';
      penaltyAmount?: number;
      noticeRequired: number; // hours
    };
  };
  
  // Pricing and billing
  pricing: {
    baseRate: number;
    rateType: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
    totalBaseAmount: number;
    additionalCharges: {
      chargeType: string;
      description: string;
      amount: number;
    }[];
    discounts: {
      discountType: string;
      description: string;
      amount: number;
    }[];
    totalAmount: number;
    taxRate: number;
    totalWithTax: number;
  };
  
  // Deposits and fees
  deposits: {
    securityDeposit: number;
    damageDeposit: number;
    cleaningDeposit?: number;
    totalDeposits: number;
    depositStatus: 'PENDING' | 'RECEIVED' | 'PARTIAL' | 'REFUNDED';
  };
  
  // Delivery and pickup
  logistics: {
    deliveryRequired: boolean;
    deliveryAddress?: string;
    deliveryDate?: Date;
    deliveryTime?: string;
    pickupDate?: Date;
    pickupTime?: string;
    transportationCost: number;
    specialInstructions?: string;
  };
  
  // Terms and conditions
  terms: {
    useRestrictions: string[];
    operatorRequirements: string[];
    maintenanceResponsibility: 'CUSTOMER' | 'RENTAL_COMPANY' | 'SHARED';
    insuranceRequirements: {
      generalLiability: number;
      propertyDamage: number;
      workersCompensation?: number;
      additionalInsured: boolean;
    };
    liabilityLimits: {
      propertyDamage: number;
      personalInjury: number;
      businessInterruption?: number;
    };
  };
  
  // Agreement status
  status: {
    agreementStatus: 'DRAFT' | 'PENDING_APPROVAL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'BREACHED';
    signedDate?: Date;
    approvedBy?: string;
    activationDate?: Date;
    completionDate?: Date;
    cancellationDate?: Date;
    cancellationReason?: string;
  };
  
  // Performance tracking
  performance: {
    onTimeDelivery: boolean;
    onTimeReturn: boolean;
    conditionAtReturn: string;
    damageReported: boolean;
    damageDescription?: string;
    customerSatisfaction?: number; // 1-10 scale
    paymentHistory: {
      onTimePayments: number;
      latePayments: number;
      totalDue: number;
      totalPaid: number;
      outstandingBalance: number;
    };
  };
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface RentalFleet {
  fleetId: string;
  fleetName: string;
  description: string;
  
  // Fleet composition
  assets: {
    rentalAssetId: string;
    assetName: string;
    assetCategory: string;
    currentStatus: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'OUT_OF_SERVICE';
    utilizationRate: number;
    revenueContribution: number;
  }[];
  
  // Fleet metrics
  metrics: {
    totalAssets: number;
    availableAssets: number;
    rentedAssets: number;
    maintenanceAssets: number;
    outOfServiceAssets: number;
    averageAge: number; // years
    totalValue: number;
    fleetUtilization: number; // percentage
    revenueGenerated: number; // annual
    profitability: number; // percentage
  };
  
  // Performance by category
  categoryPerformance: {
    category: string;
    assetCount: number;
    utilization: number;
    revenue: number;
    profitMargin: number;
    customerSatisfaction: number;
  }[];
  
  // Maintenance summary
  maintenance: {
    scheduledMaintenanceItems: number;
    overdueMaintenanceItems: number;
    maintenanceCostPerAsset: number;
    downtimePercentage: number;
    maintenanceEfficiency: number;
  };
  
  // Financial performance
  financial: {
    totalRevenue: number;
    operatingExpenses: number;
    maintenanceCosts: number;
    depreciationExpense: number;
    netIncome: number;
    returnOnAssets: number; // percentage
    revenuePerAsset: number;
  };
  
  // Optimization opportunities
  optimization: {
    underutilizedAssets: string[];
    overutilizedAssets: string[];
    acquisitionRecommendations: {
      assetType: string;
      estimatedDemand: number;
      expectedROI: number;
    }[];
    disposalRecommendations: {
      assetId: string;
      reason: string;
      estimatedValue: number;
    }[];
  };
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface RentalUtilization {
  utilizationId: string;
  rentalAssetId?: string;
  fleetId?: string;
  analysisDate: Date;
  analysisPeriod: {
    startDate: Date;
    endDate: Date;
  };
  
  // Utilization metrics
  utilization: {
    totalAvailableHours: number;
    totalRentedHours: number;
    utilizationRate: number; // percentage
    targetUtilization: number; // percentage
    utilizationVariance: number; // percentage difference from target
    peakUtilization: number; // highest utilization in period
    averageUtilization: number; // average across period
  };
  
  // Temporal patterns
  patterns: {
    hourlyUtilization: {
      hour: number;
      averageUtilization: number;
    }[];
    dailyUtilization: {
      day: string;
      averageUtilization: number;
    }[];
    monthlyUtilization: {
      month: string;
      averageUtilization: number;
    }[];
    seasonalTrends: {
      season: string;
      utilizationRate: number;
      demandPattern: string;
    }[];
  };
  
  // Customer analysis
  customerAnalysis: {
    totalCustomers: number;
    repeatCustomers: number;
    newCustomers: number;
    customerRetentionRate: number;
    averageRentalDuration: number;
    customerSegmentation: {
      segment: string;
      customerCount: number;
      utilizationContribution: number; // percentage
    }[];
  };
  
  // Revenue impact
  revenueImpact: {
    actualRevenue: number;
    potentialRevenue: number; // if 100% utilized
    lostRevenue: number; // due to underutilization
    revenueOpportunity: number; // potential improvement
    revenuePerUtilizationPoint: number;
  };
  
  // Factors affecting utilization
  factors: {
    demandFactors: string[];
    supplyConstraints: string[];
    seasonalFactors: string[];
    competitiveFactors: string[];
    operationalFactors: string[];
  };
  
  // Improvement recommendations
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
    investmentRequired: {
      recommendation: string;
      estimatedCost: number;
      expectedReturn: number;
      paybackPeriod: number; // months
    }[];
  };
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface RentalRevenue {
  revenueId: string;
  rentalAssetId?: string;
  fleetId?: string;
  reportingPeriod: {
    startDate: Date;
    endDate: Date;
    periodType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  };
  
  // Revenue breakdown
  revenue: {
    rentalRevenue: number;
    deliveryRevenue: number;
    damageCharges: number;
    lateFees: number;
    additionalServices: number;
    totalGrossRevenue: number;
    discountsGiven: number;
    totalNetRevenue: number;
  };
  
  // Pricing analysis
  pricing: {
    averageHourlyRate: number;
    averageDailyRate: number;
    pricingEffectiveness: number; // percentage
    priceRealization: number; // actual vs list price
    competitivePricing: {
      ourRate: number;
      marketRate: number;
      pricePositioning: 'PREMIUM' | 'COMPETITIVE' | 'DISCOUNT';
    };
  };
  
  // Customer revenue analysis
  customerRevenue: {
    topCustomers: {
      customerId: string;
      customerName: string;
      revenue: number;
      percentOfTotal: number;
      averageOrderValue: number;
    }[];
    customerSegments: {
      segment: string;
      customerCount: number;
      revenue: number;
      averageRevenue: number;
    }[];
    newCustomerRevenue: number;
    repeatCustomerRevenue: number;
  };
  
  // Revenue trends
  trends: {
    monthOverMonth: number; // percentage change
    yearOverYear: number; // percentage change
    trendDirection: 'GROWING' | 'STABLE' | 'DECLINING';
    seasonalVariation: number; // coefficient of variation
    growthRate: number; // annualized
  };
  
  // Profitability analysis
  profitability: {
    grossProfit: number;
    grossMargin: number; // percentage
    operatingExpenses: number;
    maintenanceCosts: number;
    depreciationExpense: number;
    netProfit: number;
    netMargin: number; // percentage
    returnOnAssets: number; // percentage
  };
  
  // Performance against targets
  targets: {
    revenueTarget: number;
    actualRevenue: number;
    variance: number; // percentage
    utilizationTarget: number;
    actualUtilization: number;
    revenuePerAsset: number;
    targetRevenuePerAsset: number;
  };
  
  createdAt: Date;
  createdBy: string;
}

export interface RentalMaintenance {
  maintenanceId: string;
  rentalAssetId: string;
  maintenanceType: 'PREVENTIVE' | 'CORRECTIVE' | 'PREDICTIVE' | 'EMERGENCY' | 'RENTAL_PREP';
  
  // Maintenance details
  maintenance: {
    scheduledDate: Date;
    actualDate?: Date;
    duration: number; // hours
    description: string;
    workPerformed: string[];
    partsUsed: {
      partNumber: string;
      partName: string;
      quantity: number;
      unitCost: number;
      totalCost: number;
    }[];
    laborHours: number;
    laborCost: number;
    totalCost: number;
  };
  
  // Service provider
  serviceProvider: {
    providerType: 'IN_HOUSE' | 'CONTRACTED' | 'MANUFACTURER';
    providerName: string;
    technician: string;
    certifications: string[];
    contactInfo: {
      phone: string;
      email: string;
    };
  };
  
  // Asset condition
  condition: {
    preMaintenanceCondition: string;
    postMaintenanceCondition: string;
    issuesFound: string[];
    issuesResolved: string[];
    recommendedActions: string[];
    nextMaintenanceDue: Date;
  };
  
  // Quality and compliance
  quality: {
    workQualityRating: number; // 1-10 scale
    complianceChecklist: {
      item: string;
      compliant: boolean;
      notes?: string;
    }[];
    certificationUpdated: boolean;
    warrantyImpact: string;
  };
  
  // Impact on availability
  availability: {
    downtimeHours: number;
    lostRentalOpportunities: number;
    estimatedRevenueImpact: number;
    customerImpact: 'NONE' | 'MINOR' | 'MODERATE' | 'SIGNIFICANT';
    rescheduleRequired: boolean;
  };
  
  // Follow-up actions
  followUp: {
    followUpRequired: boolean;
    followUpDate?: Date;
    followUpActions: string[];
    warrantyWork: boolean;
    vendorNotificationRequired: boolean;
  };
  
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DEFERRED';
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface RentalCustomer {
  customerId: string;
  customerNumber: string;
  customerName: string;
  customerType: 'INDIVIDUAL' | 'CORPORATE' | 'GOVERNMENT' | 'NON_PROFIT';
  
  // Contact information
  contactInfo: {
    primaryContact: string;
    alternateContact?: string;
    email: string;
    phone: string;
    mobilePhone?: string;
    fax?: string;
    billingAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    shippingAddress?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  
  // Business information
  businessInfo: {
    industry: string;
    businessSize: 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
    yearEstablished?: number;
    annualRevenue?: number;
    employeeCount?: number;
    taxId?: string;
    businessLicense?: string;
  };
  
  // Credit and financial
  creditInfo: {
    creditRating?: string;
    creditLimit: number;
    paymentTerms: string;
    requiresDeposit: boolean;
    depositAmount: number;
    paymentMethod: string;
    bankingInfo?: {
      bankName: string;
      routingNumber: string;
      accountNumber: string; // encrypted
    };
  };
  
  // Rental history
  rentalHistory: {
    firstRentalDate: Date;
    lastRentalDate?: Date;
    totalRentals: number;
    totalRentalValue: number;
    averageOrderValue: number;
    preferredAssetCategories: string[];
    frequencyPattern: 'OCCASIONAL' | 'REGULAR' | 'FREQUENT' | 'CONTINUOUS';
  };
  
  // Customer preferences
  preferences: {
    preferredDeliveryMethod: string;
    preferredPaymentMethod: string;
    communicationPreferences: {
      email: boolean;
      phone: boolean;
      sms: boolean;
      mail: boolean;
    };
    specialRequirements: string[];
    notes: string;
  };
  
  // Performance metrics
  performance: {
    paymentHistory: {
      onTimePayments: number;
      latePayments: number;
      totalPaid: number;
      averagePaymentDelay: number; // days
    };
    assetCareHistory: {
      damageIncidents: number;
      lateReturns: number;
      earlyReturns: number;
      averageConditionRating: number;
    };
    customerSatisfaction: {
      overallRating: number; // 1-10 scale
      serviceRating: number;
      equipmentRating: number;
      pricingRating: number;
      feedbackCount: number;
    };
  };
  
  // Customer segmentation
  segmentation: {
    customerTier: 'PREMIUM' | 'STANDARD' | 'BASIC';
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    lifetimeValue: number;
    profitability: 'HIGH' | 'MEDIUM' | 'LOW';
    growthPotential: 'HIGH' | 'MEDIUM' | 'LOW';
  };
  
  // Relationship management
  relationship: {
    accountManager?: string;
    relationshipStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'TERMINATED';
    lastContactDate?: Date;
    nextFollowUpDate?: Date;
    specialOffers: string[];
    contractedRates: boolean;
  };
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface RentalPricing {
  pricingId: string;
  rentalAssetId?: string;
  assetCategory?: string;
  pricingStrategy: string;
  
  // Base pricing structure
  basePricing: {
    hourlyRate: number;
    dailyRate: number;
    weeklyRate: number;
    monthlyRate: number;
    discountThresholds: {
      duration: number; // hours
      discountPercentage: number;
    }[];
  };
  
  // Dynamic pricing factors
  dynamicFactors: {
    demandMultiplier: number;
    seasonalMultiplier: number;
    competitiveAdjustment: number;
    utilizationAdjustment: number;
    customerTierDiscount: number;
    volumeDiscount: number;
  };
  
  // Market pricing
  marketPricing: {
    competitorRates: {
      competitor: string;
      rate: number;
      lastUpdated: Date;
    }[];
    marketAverage: number;
    ourPositioning: 'PREMIUM' | 'COMPETITIVE' | 'VALUE';
    priceElasticity: number;
  };
  
  // Pricing optimization
  optimization: {
    currentRevenue: number;
    optimizedRate: number;
    projectedRevenue: number;
    utilizationImpact: number;
    confidenceLevel: number; // percentage
    recommendedAction: 'INCREASE' | 'DECREASE' | 'MAINTAIN';
  };
  
  // Special pricing
  specialPricing: {
    promotionalRates: {
      promotion: string;
      discountPercentage: number;
      validFrom: Date;
      validTo: Date;
      conditions: string[];
    }[];
    contractRates: {
      customerId: string;
      customerName: string;
      contractedRate: number;
      contractExpiry: Date;
    }[];
    bulkRates: {
      minimumQuantity: number;
      discountPercentage: number;
    }[];
  };
  
  // Additional charges
  additionalCharges: {
    deliveryFee: number;
    pickupFee: number;
    afterHoursFee: number;
    cancelationFee: number;
    damageAssessmentFee: number;
    cleaningFee: number;
    expediteFee: number;
  };
  
  // Pricing performance
  performance: {
    priceRealization: number; // percentage of list price actually achieved
    averageTransactionValue: number;
    pricingVariance: number; // standard deviation
    customerPriceAcceptance: number; // percentage
    negotiationFrequency: number; // percentage of deals negotiated
  };
  
  effectiveDate: Date;
  expirationDate?: Date;
  approvedBy: string;
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface RentalPerformance {
  performanceId: string;
  rentalAssetId?: string;
  fleetId?: string;
  customerId?: string;
  reportingPeriod: {
    startDate: Date;
    endDate: Date;
    periodType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  };
  
  // Financial performance
  financial: {
    totalRevenue: number;
    revenueGrowth: number; // percentage
    profitMargin: number; // percentage
    returnOnAssets: number; // percentage
    revenuePerAsset: number;
    costPerRental: number;
    averageOrderValue: number;
  };
  
  // Operational performance
  operational: {
    utilizationRate: number; // percentage
    availability: number; // percentage
    onTimeDeliveryRate: number; // percentage
    customerSatisfactionScore: number; // 1-10 scale
    assetTurnover: number; // rentals per asset
    averageRentalDuration: number; // hours
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
  
  // Customer metrics
  customerMetrics: {
    newCustomerCount: number;
    customerRetentionRate: number; // percentage
    customerLifetimeValue: number;
    repeatCustomerRate: number; // percentage
    customerComplaintRate: number; // percentage
    netPromoterScore: number;
  };
  
  // Asset performance
  assetPerformance: {
    topPerformingAssets: {
      assetId: string;
      assetName: string;
      utilizationRate: number;
      revenue: number;
    }[];
    underperformingAssets: {
      assetId: string;
      assetName: string;
      utilizationRate: number;
      revenue: number;
      issues: string[];
    }[];
  };
  
  // Maintenance performance
  maintenance: {
    plannedMaintenanceCompliance: number; // percentage
    emergencyMaintenanceRate: number; // percentage
    maintenanceCostPerAsset: number;
    downtimePercentage: number;
    maintenanceEfficiency: number; // percentage
  };
  
  // Market performance
  market: {
    marketShare: number; // percentage
    competitivePosition: 'LEADER' | 'CHALLENGER' | 'FOLLOWER';
    pricePremium: number; // percentage above/below market
    demandCapture: number; // percentage of available demand
  };
  
  // Trends and forecasts
  trends: {
    revenueProjection: {
      nextMonth: number;
      nextQuarter: number;
      nextYear: number;
    };
    utilizationTrend: 'INCREASING' | 'STABLE' | 'DECREASING';
    seasonalFactors: {
      season: string;
      expectedVariance: number; // percentage
    }[];
  };
  
  createdAt: Date;
  createdBy: string;
}

export interface RentalContract {
  contractId: string;
  contractNumber: string;
  customerId: string;
  contractType: 'MASTER_AGREEMENT' | 'SPECIFIC_RENTAL' | 'MAINTENANCE_AGREEMENT';
  
  // Contract terms
  contractTerms: {
    startDate: Date;
    endDate: Date;
    duration: number; // months
    renewalOptions: {
      automaticRenewal: boolean;
      renewalPeriod?: number; // months
      renewalNoticeRequired: number; // days
    };
    terminationClause: {
      earlyTerminationAllowed: boolean;
      terminationNotice: number; // days
      terminationPenalty?: number;
    };
  };
  
  // Pricing and discounts
  pricing: {
    contractRates: {
      assetCategory: string;
      discountPercentage: number;
      fixedRate?: number;
    }[];
    volumeCommitments: {
      assetCategory: string;
      minimumVolume: number; // rental hours
      additionalDiscount: number;
    }[];
    paymentTerms: string;
    invoicingFrequency: 'MONTHLY' | 'QUARTERLY' | 'PER_RENTAL';
  };
  
  // Service levels
  serviceLevels: {
    priorityBooking: boolean;
    guaranteedAvailability: number; // percentage
    maxResponseTime: number; // hours for support
    deliveryCommitment: string;
    maintenanceInclusion: string[];
  };
  
  // Performance commitments
  commitments: {
    uptimeGuarantee: number; // percentage
    serviceQualityMetrics: {
      metric: string;
      target: number;
      penalty?: number;
    }[];
    customerSatisfactionTarget: number;
  };
  
  // Financial terms
  financial: {
    creditLimit: number;
    securityDeposit: number;
    insuranceRequirements: {
      generalLiability: number;
      propertyDamage: number;
      additionalInsured: boolean;
    };
    billingAddress: string;
    paymentMethod: string;
  };
  
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface EquipmentRental {
  equipmentRentalId: string;
  rentalAgreementId: string;
  equipmentId: string;
  
  // Equipment details
  equipment: {
    equipmentType: string;
    model: string;
    serialNumber: string;
    specifications: Record<string, any>;
    operatingInstructions: string;
    safetyRequirements: string[];
  };
  
  // Rental specifics
  rentalDetails: {
    rentalStartDate: Date;
    rentalEndDate: Date;
    actualStartDate?: Date;
    actualEndDate?: Date;
    operatorProvided: boolean;
    operatorCertification?: string;
    fuelIncluded: boolean;
    maintenanceIncluded: boolean;
  };
  
  // Delivery and setup
  logistics: {
    deliveryRequired: boolean;
    setupRequired: boolean;
    deliveryAddress?: string;
    setupInstructions?: string;
    accessRequirements?: string[];
    specialHandling?: string[];
  };
  
  // Usage monitoring
  usage: {
    meterReadingStart?: number;
    meterReadingEnd?: number;
    actualUsage?: number;
    usageType: 'HOURS' | 'MILES' | 'CYCLES' | 'DAYS';
    overageCharges?: number;
    fuelConsumed?: number;
  };
  
  // Condition tracking
  condition: {
    preRentalInspection: {
      inspectionDate: Date;
      inspector: string;
      overallCondition: string;
      damageNoted: string[];
      photos: string[];
    };
    postRentalInspection?: {
      inspectionDate: Date;
      inspector: string;
      overallCondition: string;
      damageNoted: string[];
      photos: string[];
      customerNotified: boolean;
    };
  };
  
  status: 'RESERVED' | 'DELIVERED' | 'IN_USE' | 'RETURNED' | 'INSPECTING' | 'COMPLETED';
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface FleetOptimization {
  optimizationId: string;
  fleetId: string;
  analysisDate: Date;
  
  // Current fleet analysis
  currentFleet: {
    totalAssets: number;
    utilizationRate: number; // percentage
    averageAge: number; // years
    totalValue: number;
    annualRevenue: number;
    profitability: number; // percentage
  };
  
  // Optimization objectives
  objectives: {
    targetUtilization: number;
    targetROI: number;
    targetCustomerSatisfaction: number;
    costReductionTarget: number; // percentage
    revenueGrowthTarget: number; // percentage
  };
  
  // Asset analysis
  assetAnalysis: {
    categoryPerformance: {
      category: string;
      assetCount: number;
      utilization: number;
      profitability: number;
      demandTrend: 'GROWING' | 'STABLE' | 'DECLINING';
    }[];
    individualPerformance: {
      assetId: string;
      utilizationRank: number;
      profitabilityRank: number;
      condition: string;
      recommendation: 'KEEP' | 'UPGRADE' | 'REPLACE' | 'DISPOSE';
    }[];
  };
  
  // Market demand analysis
  demandAnalysis: {
    currentDemand: {
      category: string;
      demandLevel: 'HIGH' | 'MEDIUM' | 'LOW';
      seasonality: number; // coefficient of variation
      growthRate: number; // percentage
    }[];
    unmetDemand: {
      category: string;
      estimatedDemand: number; // rental hours
      revenueOpportunity: number;
    }[];
    futureDemand: {
      category: string;
      projectedGrowth: number; // percentage over next 2 years
      confidenceLevel: number; // percentage
    }[];
  };
  
  // Optimization scenarios
  scenarios: {
    scenarioName: string;
    description: string;
    changes: {
      action: 'ADD' | 'REMOVE' | 'REPLACE' | 'UPGRADE';
      assetCategory: string;
      quantity: number;
      investmentRequired: number;
    }[];
    projectedOutcomes: {
      utilizationImprovement: number; // percentage
      revenueIncrease: number;
      profitabilityIncrease: number; // percentage
      customerSatisfactionImpact: number;
    };
    financialProjection: {
      initialInvestment: number;
      annualRevenue: number;
      annualCosts: number;
      paybackPeriod: number; // months
      roi: number; // percentage
      npv: number;
    };
  }[];
  
  // Recommendations
  recommendations: {
    immediate: {
      action: string;
      priority: 'HIGH' | 'MEDIUM' | 'LOW';
      expectedImpact: string;
      implementationCost: number;
    }[];
    shortTerm: {
      action: string;
      timeline: string;
      investmentRequired: number;
      expectedReturn: number;
    }[];
    longTerm: {
      action: string;
      timeline: string;
      strategicValue: string;
      riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    }[];
  };
  
  // Implementation plan
  implementationPlan?: {
    selectedScenario: string;
    phases: {
      phase: number;
      description: string;
      timeline: number; // months
      investmentRequired: number;
      expectedBenefits: string[];
    }[];
    riskMitigation: string[];
    successMetrics: {
      metric: string;
      baseline: number;
      target: number;
      timeline: number; // months
    }[];
  };
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface RentalAnalytics {
  analyticsId: string;
  analysisType: 'ASSET' | 'FLEET' | 'CUSTOMER' | 'MARKET' | 'FINANCIAL';
  reportingPeriod: {
    startDate: Date;
    endDate: Date;
  };
  
  // Performance analytics
  performance: {
    kpiTrends: {
      metric: string;
      currentValue: number;
      previousValue: number;
      changePercent: number;
      trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
    }[];
    benchmarks: {
      metric: string;
      ourValue: number;
      industryAverage: number;
      topQuartile: number;
      positioning: 'LEADER' | 'ABOVE_AVERAGE' | 'AVERAGE' | 'BELOW_AVERAGE';
    }[];
  };
  
  // Predictive analytics
  predictions: {
    demandForecast: {
      assetCategory: string;
      currentDemand: number;
      predictedDemand: number[];
      confidence: number; // percentage
      factors: string[];
    }[];
    utilizationForecast: {
      assetId: string;
      predictedUtilization: number[];
      seasonalAdjustment: number;
      trendAdjustment: number;
    }[];
    revenueForecast: {
      period: string;
      predictedRevenue: number;
      confidenceInterval: { low: number; high: number };
    }[];
  };
  
  // Customer insights
  customerInsights: {
    segmentAnalysis: {
      segment: string;
      customerCount: number;
      revenueContribution: number;
      profitability: number;
      growthPotential: 'HIGH' | 'MEDIUM' | 'LOW';
    }[];
    churnAnalysis: {
      churnRate: number; // percentage
      churnReasons: { reason: string; percentage: number }[];
      atRiskCustomers: {
        customerId: string;
        riskScore: number;
        churnProbability: number;
      }[];
    };
    satisfactionDrivers: {
      factor: string;
      importance: number; // 1-10 scale
      currentRating: number; // 1-10 scale
      improvementPotential: number;
    }[];
  };
  
  // Operational insights
  operationalInsights: {
    bottleneckAnalysis: {
      process: string;
      impactLevel: 'HIGH' | 'MEDIUM' | 'LOW';
      frequencyOccurrence: number; // percentage
      solution: string;
    }[];
    maintenancePatterns: {
      assetCategory: string;
      averageMaintenanceFrequency: number; // days
      costPattern: 'INCREASING' | 'STABLE' | 'DECREASING';
      predictiveOpportunities: string[];
    }[];
    seasonalityAnalysis: {
      assetCategory: string;
      peakSeasons: string[];
      utilizationVariation: number; // coefficient of variation
      pricingOpportunities: string[];
    }[];
  };
  
  // Financial insights
  financialInsights: {
    profitabilityAnalysis: {
      assetCategory: string;
      grossMargin: number;
      netMargin: number;
      contributionMargin: number;
      improvement_opportunities: string[];
    }[];
    costDriverAnalysis: {
      costCategory: string;
      percentOfTotal: number;
      trend: 'INCREASING' | 'STABLE' | 'DECREASING';
      controlActions: string[];
    }[];
    pricingOptimization: {
      assetCategory: string;
      currentRate: number;
      optimizedRate: number;
      revenueImpact: number;
      demandImpact: number;
    }[];
  };
  
  // Recommendations
  recommendations: {
    strategic: string[];
    operational: string[];
    financial: string[];
    immediate: string[];
  };
  
  createdAt: Date;
  createdBy: string;
}

export interface RentalReservation {
  reservationId: string;
  customerId: string;
  rentalAssetId: string;
  
  // Reservation details
  reservation: {
    reservationDate: Date;
    requestedStartDate: Date;
    requestedEndDate: Date;
    duration: number; // hours
    reservationType: 'FIRM' | 'TENTATIVE' | 'OPTION';
    priority: 'STANDARD' | 'HIGH' | 'EMERGENCY';
  };
  
  // Asset allocation
  allocation: {
    allocationMethod: 'SPECIFIC_ASSET' | 'ASSET_CATEGORY' | 'ANY_AVAILABLE';
    alternatives: string[]; // alternative asset IDs
    substitutionAllowed: boolean;
    upgradePossible: boolean;
    downgradeAcceptable: boolean;
  };
  
  // Logistics requirements
  logistics: {
    deliveryRequired: boolean;
    deliveryLocation?: string;
    deliveryTimeWindow?: {
      earliest: Date;
      latest: Date;
    };
    pickupLocation?: string;
    pickupTimeWindow?: {
      earliest: Date;
      latest: Date;
    };
    specialRequirements?: string[];
  };
  
  // Pricing information
  pricing: {
    quotedRate: number;
    rateType: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
    estimatedTotal: number;
    depositRequired: number;
    priceValidUntil: Date;
    discountsApplied: {
      discountType: string;
      amount: number;
    }[];
  };
  
  // Confirmation details
  confirmation: {
    confirmed: boolean;
    confirmationDate?: Date;
    confirmationNumber?: string;
    confirmedAssetId?: string;
    finalRate?: number;
    contractGenerated?: boolean;
  };
  
  // Status tracking
  status: {
    reservationStatus: 'PENDING' | 'CONFIRMED' | 'MODIFIED' | 'CANCELLED' | 'COMPLETED';
    availabilityStatus: 'AVAILABLE' | 'WAIT_LIST' | 'NOT_AVAILABLE';
    lastStatusChange: Date;
    statusChangeReason?: string;
    notificationsSent: string[];
  };
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface RentalBilling {
  billingId: string;
  rentalAgreementId: string;
  customerId: string;
  billingPeriod: {
    startDate: Date;
    endDate: Date;
  };
  
  // Invoice details
  invoice: {
    invoiceNumber: string;
    invoiceDate: Date;
    dueDate: Date;
    billingType: 'RENTAL_CHARGES' | 'ADDITIONAL_SERVICES' | 'DAMAGE_CHARGES' | 'LATE_FEES';
  };
  
  // Line items
  lineItems: {
    itemType: 'RENTAL_CHARGE' | 'DELIVERY_FEE' | 'PICKUP_FEE' | 'DAMAGE_CHARGE' | 'LATE_FEE' | 'CLEANING_FEE';
    description: string;
    quantity: number;
    rate: number;
    amount: number;
    taxable: boolean;
    assetId?: string;
  }[];
  
  // Financial summary
  financialSummary: {
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    totalAmount: number;
    previousBalance: number;
    paymentsReceived: number;
    adjustments: number;
    newBalance: number;
  };
  
  // Payment information
  payment: {
    paymentMethod: string;
    paymentTerms: string;
    paymentStatus: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'WRITTEN_OFF';
    paymentDate?: Date;
    amountPaid?: number;
    paymentReference?: string;
    lateFeeApplied?: number;
  };
  
  // Billing address
  billingAddress: {
    companyName: string;
    contactName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // Collections information
  collections?: {
    collectionStatus: 'CURRENT' | 'PAST_DUE' | 'COLLECTIONS' | 'LEGAL';
    daysOverdue: number;
    collectionActions: {
      action: string;
      date: Date;
      result: string;
    }[];
    collectionNotes: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}