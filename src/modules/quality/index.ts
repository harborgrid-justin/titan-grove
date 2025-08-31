/**
 * Quality Management Module
 * Comprehensive quality assurance and control functionality
 */

// Export all types
export * from './types';

// Export data access layer
export * from './data-access/repositories';

// Export business logic services
export * from './business-logic/quality-management/quality-service';

// Import shared utilities
import { DateUtils } from '../../shared/constants';

// Re-export existing interfaces for backward compatibility

export interface QualityPlan {
  id: string;
  planCode: string;
  name: string;
  description: string;
  itemIds: string[];
  inspectionPoints: InspectionPoint[];
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  effectiveDate: Date;
  createdDate: Date;
  lastReviewed?: Date;
  approvedBy?: string;
  version: string;
  qualityStandards: QualityStandard[];
}

export interface InspectionPoint {
  pointId: string;
  name: string;
  type: 'INCOMING' | 'IN_PROCESS' | 'FINAL' | 'CUSTOMER_RETURN' | 'SUPPLIER_AUDIT';
  mandatory: boolean;
  sampleSize: number;
  samplingMethod: 'RANDOM' | 'SYSTEMATIC' | 'STRATIFIED' | 'CLUSTER';
  criteria: QualityCriteria[];
  inspectionFrequency: 'EVERY_LOT' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'RANDOM';
  requiredCertifications: string[];
  estimatedTime: number;
}

export interface QualityCriteria {
  criteriaId: string;
  name: string;
  dataType: 'NUMERIC' | 'BOOLEAN' | 'TEXT' | 'CATEGORICAL';
  targetValue?: any;
  tolerance?: number;
  unit?: string;
  acceptanceLimits: {
    minimum?: number;
    maximum?: number;
    acceptableValues?: string[];
  };
  measurementMethod: string;
  criticalityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface QualityInspection {
  inspectionId: string;
  planId: string;
  pointId: string;
  lotNumber?: string;
  itemId: string;
  inspectorId: string;
  inspectionDate: Date;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  results: InspectionResult[];
  overallResult: 'PASS' | 'FAIL' | 'CONDITIONAL_PASS';
  defectsFound: QualityDefect[];
  correctiveActions: CorrectiveAction[];
  inspectionNotes: string;
  approvedBy?: string;
  approvalDate?: Date;
}

export interface InspectionResult {
  criteriaId: string;
  measuredValue: any;
  result: 'PASS' | 'FAIL' | 'WARNING';
  deviation?: number;
  comments?: string;
  measurementEquipment?: string;
  timestamp: Date;
}

export interface QualityDefect {
  defectId: string;
  defectCode: string;
  description: string;
  severity: 'MINOR' | 'MAJOR' | 'CRITICAL';
  category: string;
  rootCause?: string;
  quantity: number;
  location?: string;
  photos: string[];
  reportedBy: string;
  reportedDate: Date;
  status: 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'CLOSED';
}

export interface CorrectiveAction {
  actionId: string;
  defectId?: string;
  description: string;
  actionType: 'IMMEDIATE' | 'CORRECTIVE' | 'PREVENTIVE' | 'SYSTEMIC';
  assignedTo: string;
  dueDate: Date;
  completedDate?: Date;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  effectiveness?: 'NOT_EFFECTIVE' | 'PARTIALLY_EFFECTIVE' | 'EFFECTIVE';
  verifiedBy?: string;
  verificationDate?: Date;
}

export interface QualityStandard {
  standardId: string;
  name: string;
  issuingOrganization: string;
  version: string;
  effectiveDate: Date;
  requirements: string[];
  applicableProcesses: string[];
  auditFrequency: 'ANNUAL' | 'SEMI_ANNUAL' | 'QUARTERLY';
  certificationRequired: boolean;
}

export interface QualityMetric {
  metricId: string;
  metricName: string;
  metricType: 'DEFECT_RATE' | 'FIRST_PASS_YIELD' | 'CUSTOMER_SATISFACTION' | 'COST_OF_QUALITY' | 'SUPPLIER_PERFORMANCE';
  value: number;
  target: number;
  unit: string;
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  lastCalculated: Date;
  dataSource: string;
}

export interface SupplierQuality {
  supplierId: string;
  supplierName: string;
  qualityRating: number;
  performanceMetrics: {
    defectRate: number;
    onTimeDelivery: number;
    qualityScore: number;
    responseTime: number;
  };
  certifications: string[];
  lastAuditDate?: Date;
  nextAuditDate?: Date;
  qualityAgreement: QualityAgreement;
  improvementPlan?: ImprovementPlan;
}

export interface QualityAgreement {
  agreementId: string;
  supplierId: string;
  qualityRequirements: string[];
  inspectionRequirements: string[];
  deliveryStandards: string[];
  nonConformanceProcess: string;
  effectiveDate: Date;
  expirationDate: Date;
  penaltyClauses: string[];
}

export interface ImprovementPlan {
  planId: string;
  description: string;
  objectives: string[];
  actions: PlanAction[];
  timeline: number; // months
  expectedBenefits: string[];
  progressIndicators: string[];
  status: 'DRAFT' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface PlanAction {
  actionId: string;
  description: string;
  assignee: string;
  dueDate: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  resources: string[];
}

export interface QualityAudit {
  auditId: string;
  auditType: 'INTERNAL' | 'EXTERNAL' | 'SUPPLIER' | 'CUSTOMER' | 'REGULATORY';
  auditScope: string[];
  auditStandards: string[];
  auditTeam: AuditTeamMember[];
  plannedDate: Date;
  actualDate?: Date;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  findings: AuditFinding[];
  nonConformances: NonConformance[];
  overallRating: 'EXCELLENT' | 'GOOD' | 'SATISFACTORY' | 'NEEDS_IMPROVEMENT' | 'UNSATISFACTORY';
  recommendations: string[];
  followUpRequired: boolean;
  nextAuditDate?: Date;
}

export interface AuditTeamMember {
  memberId: string;
  name: string;
  role: 'LEAD_AUDITOR' | 'AUDITOR' | 'TECHNICAL_EXPERT' | 'OBSERVER';
  qualifications: string[];
  responsibilities: string[];
}

export interface AuditFinding {
  findingId: string;
  category: 'STRENGTH' | 'OBSERVATION' | 'NON_CONFORMANCE' | 'OPPORTUNITY';
  description: string;
  evidence: string[];
  standardReference: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  correctiveActionRequired: boolean;
}

export interface NonConformance {
  ncId: string;
  description: string;
  type: 'PRODUCT' | 'PROCESS' | 'SYSTEM' | 'DOCUMENTATION';
  severity: 'MINOR' | 'MAJOR' | 'CRITICAL';
  source: 'INTERNAL' | 'CUSTOMER' | 'SUPPLIER' | 'REGULATORY';
  rootCauseAnalysis: string;
  immediateAction: string;
  correctiveActions: CorrectiveAction[];
  preventiveActions: CorrectiveAction[];
  status: 'OPEN' | 'UNDER_INVESTIGATION' | 'CORRECTIVE_ACTION' | 'VERIFICATION' | 'CLOSED';
  reportedBy: string;
  reportedDate: Date;
  targetCloseDate: Date;
  actualCloseDate?: Date;
}

export class QualityManager {
  async createQualityPlan(plan: Omit<QualityPlan, 'id' | 'status' | 'createdDate' | 'version'>): Promise<QualityPlan> {
    const id = `qp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      ...plan,
      id,
      status: 'DRAFT',
      createdDate: new Date(),
      version: '1.0'
    };
  }

  async updateQualityPlan(planId: string, updates: Partial<QualityPlan>): Promise<QualityPlan> {
    console.log(`Updating quality plan ${planId}`);
    return {
      id: planId,
      planCode: 'QP-001',
      name: 'Updated Quality Plan',
      description: 'Updated description',
      itemIds: [],
      inspectionPoints: [],
      status: 'ACTIVE',
      effectiveDate: new Date(),
      createdDate: new Date(),
      version: '1.1',
      qualityStandards: [],
      ...updates
    };
  }

  async scheduleInspection(planId: string, pointId: string, scheduleDate: Date, inspectorId: string): Promise<QualityInspection> {
    const inspectionId = `qi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      inspectionId,
      planId,
      pointId,
      itemId: 'item_001',
      inspectorId,
      inspectionDate: scheduleDate,
      status: 'SCHEDULED',
      results: [],
      overallResult: 'PASS',
      defectsFound: [],
      correctiveActions: [],
      inspectionNotes: ''
    };
  }

  async conductInspection(inspectionId: string, results: InspectionResult[]): Promise<{
    inspectionId: string;
    overallResult: 'PASS' | 'FAIL' | 'CONDITIONAL_PASS';
    defectsFound: QualityDefect[];
    recommendedActions: string[];
    qualityScore: number;
  }> {
    console.log(`Conducting inspection ${inspectionId}`);
    
    const passCount = results.filter(r => r.result === 'PASS').length;
    const qualityScore = (passCount / results.length) * 100;
    
    let overallResult: 'PASS' | 'FAIL' | 'CONDITIONAL_PASS' = 'PASS';
    if (qualityScore < 70) {
      overallResult = 'FAIL';
    } else if (qualityScore < 90) {
      overallResult = 'CONDITIONAL_PASS';
    }

    const defectsFound: QualityDefect[] = results
      .filter(r => r.result === 'FAIL')
      .map(r => ({
        defectId: `def_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        defectCode: 'DEF001',
        description: `Failed criteria: ${r.criteriaId}`,
        severity: 'MAJOR' as const,
        category: 'Quality',
        quantity: 1,
        reportedBy: 'inspector_001',
        reportedDate: new Date(),
        status: 'OPEN' as const,
        photos: []
      }));

    return {
      inspectionId,
      overallResult,
      defectsFound,
      recommendedActions: [
        'Review process parameters',
        'Additional training for operators',
        'Calibrate measurement equipment'
      ],
      qualityScore
    };
  }

  async createCorrectiveAction(defectId: string, actionDetails: Omit<CorrectiveAction, 'actionId' | 'status' | 'defectId'>): Promise<CorrectiveAction> {
    const actionId = `ca_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      actionId,
      defectId,
      status: 'PLANNED',
      ...actionDetails
    };
  }

  async performRootCauseAnalysis(defectId: string, analysisMethod: '5_WHY' | 'FISHBONE' | 'FAULT_TREE' | 'PARETO'): Promise<{
    analysisId: string;
    method: string;
    rootCauses: Array<{
      cause: string;
      likelihood: number;
      impact: 'LOW' | 'MEDIUM' | 'HIGH';
      category: string;
    }>;
    recommendedActions: string[];
    preventiveMeasures: string[];
  }> {
    const analysisId = `rca_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      analysisId,
      method: analysisMethod,
      rootCauses: [
        {
          cause: 'Machine calibration drift',
          likelihood: 75,
          impact: 'HIGH',
          category: 'Equipment'
        },
        {
          cause: 'Operator training gap',
          likelihood: 40,
          impact: 'MEDIUM',
          category: 'Human Factors'
        }
      ],
      recommendedActions: [
        'Implement daily calibration checks',
        'Provide additional operator training',
        'Update standard operating procedures'
      ],
      preventiveMeasures: [
        'Install automatic calibration monitoring',
        'Create competency assessment program',
        'Establish preventive maintenance schedule'
      ]
    };
  }

  async generateQualityMetrics(timeframe: { startDate: Date; endDate: Date }): Promise<{
    metrics: QualityMetric[];
    trends: {
      overallQuality: 'IMPROVING' | 'STABLE' | 'DECLINING';
      defectTrend: 'IMPROVING' | 'STABLE' | 'DECLINING';
      customerSatisfaction: 'IMPROVING' | 'STABLE' | 'DECLINING';
    };
    benchmarks: Record<string, number>;
    recommendations: string[];
  }> {
    const metrics: QualityMetric[] = [
      {
        metricId: 'qm_001',
        metricName: 'First Pass Yield',
        metricType: 'FIRST_PASS_YIELD',
        value: 94.2,
        target: 95.0,
        unit: '%',
        period: 'MONTHLY',
        trend: 'IMPROVING',
        lastCalculated: new Date(),
        dataSource: 'Production System'
      },
      {
        metricId: 'qm_002',
        metricName: 'Defect Rate',
        metricType: 'DEFECT_RATE',
        value: 0.8,
        target: 0.5,
        unit: '%',
        period: 'MONTHLY',
        trend: 'DECLINING',
        lastCalculated: new Date(),
        dataSource: 'Quality System'
      }
    ];

    return {
      metrics,
      trends: {
        overallQuality: 'IMPROVING',
        defectTrend: 'IMPROVING',
        customerSatisfaction: 'STABLE'
      },
      benchmarks: {
        industryAvgFPY: 91.5,
        industryAvgDefectRate: 1.2,
        worldClassFPY: 99.0
      },
      recommendations: [
        'Focus on reducing variation in critical processes',
        'Implement statistical process control',
        'Enhance supplier quality requirements'
      ]
    };
  }

  async manageSupplierQuality(supplierId: string): Promise<SupplierQuality> {
    const qualityAgreement: QualityAgreement = {
      agreementId: `qa_${Date.now()}`,
      supplierId,
      qualityRequirements: ['ISO 9001 Certification', '99% quality conformance'],
      inspectionRequirements: ['Incoming inspection', 'Statistical sampling'],
      deliveryStandards: ['On-time delivery > 95%', 'Complete documentation'],
      nonConformanceProcess: 'Immediate notification and corrective action',
      effectiveDate: new Date(),
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      penaltyClauses: ['Quality penalties for defect rates > 2%']
    };

    return {
      supplierId,
      supplierName: 'ABC Manufacturing Co.',
      qualityRating: 4.2,
      performanceMetrics: {
        defectRate: 0.6,
        onTimeDelivery: 96.8,
        qualityScore: 94.3,
        responseTime: 2.1
      },
      certifications: ['ISO 9001:2015', 'AS9100D', 'IATF 16949'],
      lastAuditDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      nextAuditDate: new Date(Date.now() + 185 * 24 * 60 * 60 * 1000),
      qualityAgreement
    };
  }

  async planQualityAudit(auditType: QualityAudit['auditType'], scope: string[], standards: string[]): Promise<QualityAudit> {
    const auditId = `qa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const auditTeam: AuditTeamMember[] = [
      {
        memberId: 'auditor_001',
        name: 'Jane Smith',
        role: 'LEAD_AUDITOR',
        qualifications: ['ISO 9001 Lead Auditor', 'ASQ CQA'],
        responsibilities: ['Plan audit', 'Lead audit team', 'Report findings']
      }
    ];

    return {
      auditId,
      auditType,
      auditScope: scope,
      auditStandards: standards,
      auditTeam,
      plannedDate: DateUtils.addDays(new Date(), 30), // Use standard 30-day planning period
      status: 'PLANNED',
      findings: [],
      nonConformances: [],
      overallRating: 'GOOD',
      recommendations: [],
      followUpRequired: false
    };
  }

  async processNonConformance(ncDetails: Omit<NonConformance, 'ncId' | 'status' | 'reportedDate'>): Promise<NonConformance> {
    const ncId = `nc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      ncId,
      status: 'OPEN',
      reportedDate: new Date(),
      ...ncDetails
    };
  }

  async implementStatisticalProcessControl(processId: string, parameters: string[]): Promise<{
    controlCharts: Array<{
      parameter: string;
      chartType: 'X_BAR_R' | 'X_MR' | 'P' | 'NP' | 'C' | 'U';
      controlLimits: {
        ucl: number;
        lcl: number;
        centerLine: number;
      };
      status: 'IN_CONTROL' | 'OUT_OF_CONTROL' | 'WARNING';
      lastUpdate: Date;
    }>;
    processCapability: {
      cp: number;
      cpk: number;
      pp: number;
      ppk: number;
      sigma: number;
    };
    recommendations: string[];
  }> {
    const controlCharts = parameters.map(param => ({
      parameter: param,
      chartType: 'X_BAR_R' as const,
      controlLimits: {
        ucl: 110,
        lcl: 90,
        centerLine: 100
      },
      status: 'IN_CONTROL' as const,
      lastUpdate: new Date()
    }));

    return {
      controlCharts,
      processCapability: {
        cp: 1.33,
        cpk: 1.25,
        pp: 1.28,
        ppk: 1.20,
        sigma: 4.2
      },
      recommendations: [
        'Monitor process for special causes',
        'Investigate control limit violations',
        'Consider process improvement initiatives'
      ]
    };
  }

  async integrateWithProduction(productionOrderId: string): Promise<{
    qualityRequirements: QualityCriteria[];
    inspectionSchedule: Array<{
      inspectionPoint: string;
      scheduledTime: Date;
      inspector: string;
    }>;
    qualityHold: boolean;
    releaseAuthority: string;
  }> {
    console.log(`Integrating quality requirements with production order ${productionOrderId}`);
    
    return {
      qualityRequirements: [
        {
          criteriaId: 'crit_001',
          name: 'Dimensional Accuracy',
          dataType: 'NUMERIC',
          targetValue: 100,
          tolerance: 2,
          unit: 'mm',
          acceptanceLimits: { minimum: 98, maximum: 102 },
          measurementMethod: 'Caliper measurement',
          criticalityLevel: 'HIGH'
        }
      ],
      inspectionSchedule: [
        {
          inspectionPoint: 'First Article',
          scheduledTime: new Date(Date.now() + 60 * 60 * 1000),
          inspector: 'inspector_001'
        }
      ],
      qualityHold: false,
      releaseAuthority: 'quality_supervisor'
    };
  }
}

export const qualityManager = new QualityManager();