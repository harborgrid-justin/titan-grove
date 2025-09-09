/**
 * Health & Medical Domain
 * Centralized business logic for healthcare operations, patient management, and clinical workflows
 */

import { BusinessConfig } from '../../types/business-config';

export interface HealthMedicalDomainConfig {
  patient: {
    demographics: {
      requiredFields: string[];
      optionalFields: string[];
      validationRules: { [key: string]: any };
    };
    privacy: {
      hipaaComplianceLevel: 'basic' | 'enhanced' | 'full';
      dataRetentionYears: number;
      auditLogRetention: number;
      encryptionRequired: boolean;
    };
    scheduling: {
      defaultAppointmentDuration: number; // minutes
      bufferTime: number; // minutes between appointments
      maxAdvanceBooking: number; // days
      cancellationPenalty: number; // hours before appointment
    };
  };
  clinical: {
    qualityMetrics: {
      patientSafetyThreshold: number;
      readmissionRateTarget: number;
      infectionRateTarget: number;
      medicationErrorTarget: number;
    };
    protocols: {
      criticalResultsNotification: number; // minutes
      labResultsReview: number; // hours
      prescriptionReview: number; // hours
      clinicalDecisionSupport: boolean;
    };
    outcomes: {
      qualityIndicators: string[];
      riskAssessmentFrequency: number; // days
      careplanReviewFrequency: number; // days
    };
  };
  billing: {
    coding: {
      icd10Required: boolean;
      cptRequired: boolean;
      hcpcsSupported: boolean;
      modifierValidation: boolean;
    };
    insurance: {
      verificationRequired: boolean;
      priorAuthRequired: string[]; // procedure codes requiring auth
      copayCollection: 'upfront' | 'after' | 'flexible';
      eligibilityCheckDays: number;
    };
    revenue: {
      daysInAR: number; // days in accounts receivable target
      collectionRate: number; // target collection rate
      denialRate: number; // target denial rate
      cashFlowTarget: number; // monthly target
    };
  };
  compliance: {
    hipaa: {
      breachNotificationHours: number;
      accessLogRetention: number; // days
      riskAssessmentFrequency: number; // months
      trainingRequiredHours: number; // annual
    };
    quality: {
      hedisReporting: boolean;
      cmsStarRating: boolean;
      jcahoCompliance: boolean;
      qualityMeasureFrequency: number; // months
    };
    safety: {
      adverseEventReporting: boolean;
      medicationReconciliation: boolean;
      fallPreventionProtocols: boolean;
      infectionControlMeasures: boolean;
    };
  };
}

/**
 * Core Business Logic Functions - Health & Medical Domain
 * Comprehensive healthcare business logic for patient care and operations
 */
export class HealthMedicalBusinessLogic {
  
  /**
   * Calculate Patient Risk Score
   * Advanced risk stratification for patient management
   */
  static calculatePatientRiskScore(
    patientData: {
      age: number;
      chronicConditions: string[];
      medications: number;
      priorAdmissions: number;
      labValues: { [key: string]: number };
      socialFactors: {
        insurance: 'medicare' | 'medicaid' | 'commercial' | 'uninsured';
        zipCode: string;
        supportSystem: 'strong' | 'moderate' | 'weak';
      };
    },
    config: HealthMedicalDomainConfig
  ): {
    riskScore: number;
    riskLevel: 'low' | 'moderate' | 'high' | 'critical';
    contributingFactors: string[];
    recommendations: string[];
    interventions: string[];
  } {
    let riskScore = 0;
    const contributingFactors: string[] = [];
    const recommendations: string[] = [];
    const interventions: string[] = [];

    // Age factor
    if (patientData.age >= 65) {
      riskScore += 15;
      contributingFactors.push('Advanced age (65+)');
    } else if (patientData.age >= 50) {
      riskScore += 8;
      contributingFactors.push('Middle age (50-64)');
    }

    // Chronic conditions factor
    const highRiskConditions = ['diabetes', 'heart-failure', 'copd', 'ckd', 'cancer'];
    const patientHighRiskConditions = patientData.chronicConditions.filter(
      condition => highRiskConditions.includes(condition)
    );
    riskScore += patientHighRiskConditions.length * 12;
    if (patientHighRiskConditions.length > 0) {
      contributingFactors.push(`High-risk conditions: ${patientHighRiskConditions.join(', ')}`);
    }

    // Polypharmacy factor
    if (patientData.medications >= 10) {
      riskScore += 20;
      contributingFactors.push('Polypharmacy (10+ medications)');
      recommendations.push('Medication reconciliation and review');
    } else if (patientData.medications >= 5) {
      riskScore += 10;
      contributingFactors.push('Multiple medications (5-9)');
    }

    // Prior admissions factor
    if (patientData.priorAdmissions >= 3) {
      riskScore += 25;
      contributingFactors.push('Frequent admissions (3+ in past year)');
      interventions.push('Care coordination and transition planning');
    } else if (patientData.priorAdmissions >= 1) {
      riskScore += 10;
      contributingFactors.push('Recent admission history');
    }

    // Social determinants
    if (patientData.socialFactors.insurance === 'uninsured') {
      riskScore += 15;
      contributingFactors.push('Uninsured status');
      interventions.push('Financial counseling and assistance programs');
    } else if (patientData.socialFactors.insurance === 'medicaid') {
      riskScore += 8;
      contributingFactors.push('Medicaid insurance');
    }

    if (patientData.socialFactors.supportSystem === 'weak') {
      riskScore += 12;
      contributingFactors.push('Limited social support');
      interventions.push('Social services consultation');
    }

    // Determine risk level
    let riskLevel: 'low' | 'moderate' | 'high' | 'critical';
    if (riskScore >= 70) {
      riskLevel = 'critical';
      interventions.push('Immediate care management enrollment');
      interventions.push('Weekly check-ins');
    } else if (riskScore >= 50) {
      riskLevel = 'high';
      interventions.push('Care management program');
      interventions.push('Monthly follow-ups');
    } else if (riskScore >= 25) {
      riskLevel = 'moderate';
      recommendations.push('Quarterly health assessments');
    } else {
      riskLevel = 'low';
      recommendations.push('Annual wellness visits');
    }

    return {
      riskScore,
      riskLevel,
      contributingFactors,
      recommendations,
      interventions
    };
  }

  /**
   * Calculate Quality Metrics for Healthcare Performance
   * HEDIS and CMS quality measure calculations
   */
  static calculateQualityMetrics(
    patientPopulation: Array<{
      id: string;
      age: number;
      conditions: string[];
      screenings: { [key: string]: Date };
      medications: string[];
      admissions: number;
      emergencyVisits: number;
    }>,
    config: HealthMedicalDomainConfig
  ): {
    qualityScores: { [measure: string]: number };
    populationHealth: {
      totalPatients: number;
      averageAge: number;
      chronicDiseasePrevalence: number;
      utilizationMetrics: any;
    };
    complianceMetrics: {
      preventiveScreening: number;
      medicationAdherence: number;
      careGaps: string[];
    };
  } {
    const qualityScores: { [measure: string]: number } = {};
    const totalPatients = patientPopulation.length;

    // Preventive Screening Compliance
    const diabetesPatients = patientPopulation.filter(p => p.conditions.includes('diabetes'));
    const diabetesWithA1C = diabetesPatients.filter(p => {
      const lastA1C = p.screenings['a1c'];
      return lastA1C && (Date.now() - lastA1C.getTime()) < (180 * 24 * 60 * 60 * 1000); // 6 months
    });
    qualityScores['diabetes_a1c_screening'] = diabetesPatients.length > 0 ? 
      (diabetesWithA1C.length / diabetesPatients.length) * 100 : 0;

    // Mammography Screening
    const eligibleWomen = patientPopulation.filter(p => p.age >= 50 && p.age <= 74);
    const mammographyCompliant = eligibleWomen.filter(p => {
      const lastMammogram = p.screenings['mammogram'];
      return lastMammogram && (Date.now() - lastMammogram.getTime()) < (730 * 24 * 60 * 60 * 1000); // 2 years
    });
    qualityScores['mammography_screening'] = eligibleWomen.length > 0 ? 
      (mammographyCompliant.length / eligibleWomen.length) * 100 : 0;

    // Colonoscopy Screening
    const eligibleForColon = patientPopulation.filter(p => p.age >= 50 && p.age <= 75);
    const colonoscopyCompliant = eligibleForColon.filter(p => {
      const lastColonoscopy = p.screenings['colonoscopy'];
      return lastColonoscopy && (Date.now() - lastColonoscopy.getTime()) < (3650 * 24 * 60 * 60 * 1000); // 10 years
    });
    qualityScores['colonoscopy_screening'] = eligibleForColon.length > 0 ? 
      (colonoscopyCompliant.length / eligibleForColon.length) * 100 : 0;

    // Population Health Metrics
    const averageAge = patientPopulation.reduce((sum, p) => sum + p.age, 0) / totalPatients;
    const chronicDiseaseCount = patientPopulation.filter(p => 
      p.conditions.some(c => ['diabetes', 'hypertension', 'heart-disease', 'copd'].includes(c))
    ).length;
    const chronicDiseasePrevalence = (chronicDiseaseCount / totalPatients) * 100;

    const utilizationMetrics = {
      averageAdmissions: patientPopulation.reduce((sum, p) => sum + p.admissions, 0) / totalPatients,
      averageEmergencyVisits: patientPopulation.reduce((sum, p) => sum + p.emergencyVisits, 0) / totalPatients,
      readmissionRate: patientPopulation.filter(p => p.admissions > 1).length / totalPatients
    };

    // Care Gaps Analysis
    const careGaps: string[] = [];
    if (qualityScores['diabetes_a1c_screening'] < 80) {
      careGaps.push('Diabetes A1C screening below target (80%)');
    }
    if (qualityScores['mammography_screening'] < 75) {
      careGaps.push('Mammography screening below target (75%)');
    }
    if (qualityScores['colonoscopy_screening'] < 70) {
      careGaps.push('Colorectal screening below target (70%)');
    }

    return {
      qualityScores,
      populationHealth: {
        totalPatients,
        averageAge,
        chronicDiseasePrevalence,
        utilizationMetrics
      },
      complianceMetrics: {
        preventiveScreening: (qualityScores['diabetes_a1c_screening'] + 
                             qualityScores['mammography_screening'] + 
                             qualityScores['colonoscopy_screening']) / 3,
        medicationAdherence: 85, // Placeholder - would calculate from medication fill data
        careGaps
      }
    };
  }

  /**
   * Calculate Revenue Cycle Performance
   * Healthcare financial performance analytics
   */
  static calculateRevenueCycleMetrics(
    claims: Array<{
      id: string;
      amount: number;
      serviceDate: Date;
      submissionDate: Date;
      paymentDate?: Date;
      denialDate?: Date;
      denialReason?: string;
      paymentAmount?: number;
    }>,
    config: HealthMedicalDomainConfig
  ): {
    financialMetrics: {
      totalCharges: number;
      totalCollections: number;
      collectionRate: number;
      daysInAR: number;
      denialRate: number;
    };
    performanceIndicators: {
      cashFlow: number;
      netCollectionRate: number;
      firstPassResolution: number;
      averageReimbursement: number;
    };
    recommendations: string[];
  } {
    const totalCharges = claims.reduce((sum, claim) => sum + claim.amount, 0);
    const paidClaims = claims.filter(claim => claim.paymentDate && claim.paymentAmount);
    const totalCollections = paidClaims.reduce((sum, claim) => sum + (claim.paymentAmount || 0), 0);
    const deniedClaims = claims.filter(claim => claim.denialDate);
    
    const collectionRate = totalCharges > 0 ? (totalCollections / totalCharges) * 100 : 0;
    const denialRate = claims.length > 0 ? (deniedClaims.length / claims.length) * 100 : 0;

    // Calculate Days in AR
    const unpaidClaims = claims.filter(claim => !claim.paymentDate && !claim.denialDate);
    const totalDaysOutstanding = unpaidClaims.reduce((sum, claim) => {
      const daysOutstanding = (Date.now() - claim.submissionDate.getTime()) / (1000 * 60 * 60 * 24);
      return sum + daysOutstanding;
    }, 0);
    const daysInAR = unpaidClaims.length > 0 ? totalDaysOutstanding / unpaidClaims.length : 0;

    // Performance Indicators
    const monthlyCharges = totalCharges / 12; // Assuming annual data
    const cashFlow = totalCollections / 12; // Monthly cash flow
    const netCollectionRate = totalCharges > 0 ? (totalCollections / (totalCharges - deniedClaims.reduce((sum, claim) => sum + claim.amount, 0))) * 100 : 0;
    
    const firstPassPaid = claims.filter(claim => 
      claim.paymentDate && !claim.denialDate
    ).length;
    const firstPassResolution = claims.length > 0 ? (firstPassPaid / claims.length) * 100 : 0;
    
    const averageReimbursement = paidClaims.length > 0 ? 
      paidClaims.reduce((sum, claim) => sum + (claim.paymentAmount || 0), 0) / paidClaims.length : 0;

    // Generate Recommendations
    const recommendations: string[] = [];
    if (collectionRate < config.billing.revenue.collectionRate * 100) {
      recommendations.push('Collection rate below target - review billing processes');
    }
    if (denialRate > config.billing.revenue.denialRate * 100) {
      recommendations.push('Denial rate above target - improve claim quality and coding');
    }
    if (daysInAR > config.billing.revenue.daysInAR) {
      recommendations.push('Days in AR above target - expedite claim follow-up');
    }
    if (firstPassResolution < 90) {
      recommendations.push('First pass resolution low - enhance prior authorization and eligibility verification');
    }

    return {
      financialMetrics: {
        totalCharges,
        totalCollections,
        collectionRate,
        daysInAR,
        denialRate
      },
      performanceIndicators: {
        cashFlow,
        netCollectionRate,
        firstPassResolution,
        averageReimbursement
      },
      recommendations
    };
  }

  /**
   * Clinical Decision Support Calculations
   * Evidence-based clinical recommendations and alerts
   */
  static generateClinicalDecisionSupport(
    patientData: {
      age: number;
      gender: 'M' | 'F';
      conditions: string[];
      medications: Array<{ name: string; dose: string; frequency: string }>;
      allergies: string[];
      labResults: { [key: string]: { value: number; date: Date; normal: boolean } };
      vitalSigns: { [key: string]: number };
    },
    config: HealthMedicalDomainConfig
  ): {
    alerts: Array<{ type: 'critical' | 'warning' | 'info'; message: string; recommendation: string }>;
    drugInteractions: Array<{ severity: 'major' | 'moderate' | 'minor'; drugs: string[]; description: string }>;
    clinicalGuidelines: Array<{ guideline: string; recommendation: string; evidence: string }>;
    preventiveCare: Array<{ service: string; overdue: boolean; nextDue: Date }>;
  } {
    const alerts: Array<{ type: 'critical' | 'warning' | 'info'; message: string; recommendation: string }> = [];
    const drugInteractions: Array<{ severity: 'major' | 'moderate' | 'minor'; drugs: string[]; description: string }> = [];
    const clinicalGuidelines: Array<{ guideline: string; recommendation: string; evidence: string }> = [];
    const preventiveCare: Array<{ service: string; overdue: boolean; nextDue: Date }> = [];

    // Critical Lab Value Alerts
    if (patientData.labResults['creatinine']?.value > 2.0) {
      alerts.push({
        type: 'critical',
        message: 'Elevated creatinine level indicates potential kidney dysfunction',
        recommendation: 'Review medications for nephrotoxicity and consider nephrology referral'
      });
    }

    if (patientData.labResults['potassium']?.value > 5.5) {
      alerts.push({
        type: 'critical',
        message: 'Severe hyperkalemia detected',
        recommendation: 'Immediate intervention required - consider EKG and treatment protocol'
      });
    }

    // Medication Interaction Checking
    const medications = patientData.medications.map(m => m.name.toLowerCase());
    if (medications.includes('warfarin') && medications.includes('aspirin')) {
      drugInteractions.push({
        severity: 'major',
        drugs: ['warfarin', 'aspirin'],
        description: 'Increased bleeding risk with concurrent use'
      });
    }

    // Clinical Guidelines
    if (patientData.conditions.includes('diabetes')) {
      if (!patientData.labResults['a1c'] || 
          (Date.now() - patientData.labResults['a1c'].date.getTime()) > (180 * 24 * 60 * 60 * 1000)) {
        clinicalGuidelines.push({
          guideline: 'ADA Diabetes Management',
          recommendation: 'A1C testing every 3-6 months for diabetic patients',
          evidence: 'Level A recommendation'
        });
      }
    }

    if (patientData.conditions.includes('hypertension') && patientData.vitalSigns['systolic'] > 140) {
      clinicalGuidelines.push({
        guideline: 'ACC/AHA Hypertension Guidelines',
        recommendation: 'Blood pressure above goal - consider medication adjustment',
        evidence: 'Class I recommendation'
      });
    }

    // Preventive Care Recommendations
    if (patientData.age >= 50 && patientData.gender === 'F') {
      const nextMammogram = new Date();
      nextMammogram.setFullYear(nextMammogram.getFullYear() + 1);
      preventiveCare.push({
        service: 'Mammography',
        overdue: false, // Would check against last screening date
        nextDue: nextMammogram
      });
    }

    if (patientData.age >= 65) {
      const nextColonoscopy = new Date();
      nextColonoscopy.setFullYear(nextColonoscopy.getFullYear() + 10);
      preventiveCare.push({
        service: 'Colonoscopy',
        overdue: false, // Would check against last screening date
        nextDue: nextColonoscopy
      });
    }

    return {
      alerts,
      drugInteractions,
      clinicalGuidelines,
      preventiveCare
    };
  }
}

/**
 * Health & Medical Domain Manager
 * Orchestrates all healthcare operations, patient care, and clinical workflows
 */
export class HealthMedicalDomainManager {
  constructor(
    private config: HealthMedicalDomainConfig
  ) {}

  /**
   * Comprehensive healthcare analytics and optimization
   */
  async optimizeHealthcareOperations(): Promise<{
    patientRiskAnalysis: any;
    qualityMetrics: any;
    revenueCycleAnalysis: any;
    clinicalDecisionSupport: any;
  }> {
    // Mock patient data for demonstration
    const patientRiskAnalysis = HealthMedicalBusinessLogic.calculatePatientRiskScore(
      {
        age: 72,
        chronicConditions: ['diabetes', 'hypertension', 'ckd'],
        medications: 8,
        priorAdmissions: 2,
        labValues: { creatinine: 1.8, a1c: 8.2 },
        socialFactors: {
          insurance: 'medicare',
          zipCode: '12345',
          supportSystem: 'moderate'
        }
      },
      this.config
    );

    const qualityMetrics = HealthMedicalBusinessLogic.calculateQualityMetrics(
      [
        {
          id: 'pt1', age: 65, conditions: ['diabetes'], 
          screenings: { a1c: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
          medications: ['metformin'], admissions: 0, emergencyVisits: 1
        }
      ],
      this.config
    );

    const revenueCycleAnalysis = HealthMedicalBusinessLogic.calculateRevenueCycleMetrics(
      [
        {
          id: 'claim1', amount: 1500, serviceDate: new Date('2024-01-15'),
          submissionDate: new Date('2024-01-17'), paymentDate: new Date('2024-02-10'),
          paymentAmount: 1200
        }
      ],
      this.config
    );

    const clinicalDecisionSupport = HealthMedicalBusinessLogic.generateClinicalDecisionSupport(
      {
        age: 68, gender: 'M', conditions: ['diabetes', 'hypertension'],
        medications: [{ name: 'metformin', dose: '500mg', frequency: 'BID' }],
        allergies: ['penicillin'], 
        labResults: { 
          a1c: { value: 7.2, date: new Date(), normal: false },
          creatinine: { value: 1.1, date: new Date(), normal: true }
        },
        vitalSigns: { systolic: 145, diastolic: 88 }
      },
      this.config
    );

    return {
      patientRiskAnalysis,
      qualityMetrics,
      revenueCycleAnalysis,
      clinicalDecisionSupport
    };
  }
}

// Default configuration
export const defaultHealthMedicalConfig: HealthMedicalDomainConfig = {
  patient: {
    demographics: {
      requiredFields: ['firstName', 'lastName', 'dateOfBirth', 'gender'],
      optionalFields: ['middleName', 'ssn', 'phone', 'email', 'address'],
      validationRules: {
        age: { min: 0, max: 120 },
        phone: '^[0-9]{10}$',
        email: '^[^@]+@[^@]+\\.[^@]+$'
      }
    },
    privacy: {
      hipaaComplianceLevel: 'full',
      dataRetentionYears: 7,
      auditLogRetention: 1095, // 3 years in days
      encryptionRequired: true
    },
    scheduling: {
      defaultAppointmentDuration: 30,
      bufferTime: 15,
      maxAdvanceBooking: 365,
      cancellationPenalty: 24
    }
  },
  clinical: {
    qualityMetrics: {
      patientSafetyThreshold: 95,
      readmissionRateTarget: 8.5, // percentage
      infectionRateTarget: 2.0, // percentage
      medicationErrorTarget: 0.5 // percentage
    },
    protocols: {
      criticalResultsNotification: 30, // minutes
      labResultsReview: 24, // hours
      prescriptionReview: 2, // hours
      clinicalDecisionSupport: true
    },
    outcomes: {
      qualityIndicators: ['mortality', 'readmission', 'infection', 'patient-satisfaction'],
      riskAssessmentFrequency: 30, // days
      careplanReviewFrequency: 90 // days
    }
  },
  billing: {
    coding: {
      icd10Required: true,
      cptRequired: true,
      hcpcsSupported: true,
      modifierValidation: true
    },
    insurance: {
      verificationRequired: true,
      priorAuthRequired: ['surgery', 'imaging', 'specialty-drugs'],
      copayCollection: 'upfront',
      eligibilityCheckDays: 30
    },
    revenue: {
      daysInAR: 45, // target days in accounts receivable
      collectionRate: 0.95, // 95% collection target
      denialRate: 0.05, // 5% denial rate target
      cashFlowTarget: 250000 // monthly target
    }
  },
  compliance: {
    hipaa: {
      breachNotificationHours: 24,
      accessLogRetention: 1095, // 3 years
      riskAssessmentFrequency: 12, // months
      trainingRequiredHours: 8 // annual
    },
    quality: {
      hedisReporting: true,
      cmsStarRating: true,
      jcahoCompliance: true,
      qualityMeasureFrequency: 3 // months
    },
    safety: {
      adverseEventReporting: true,
      medicationReconciliation: true,
      fallPreventionProtocols: true,
      infectionControlMeasures: true
    }
  }
};

// Singleton instance
export const healthMedicalDomainManager = new HealthMedicalDomainManager(
  defaultHealthMedicalConfig
);