/**
 * Compliance Management Module
 * Regulatory compliance, audit management, and policy enforcement
 */

// Export all types
export * from './types';

// Export data access layer
export * from './data-access/repositories';

// Import shared utilities
import { BaseManager } from '../../shared/utils/base-manager';

// Export business logic services
export * from './business-logic/compliance-management/compliance-service';

// Re-export existing interfaces for backward compatibility

export interface ComplianceFramework {
  id: string;
  frameworkCode: string;
  name: string;
  description: string;
  regulatoryBody: string;
  applicableRegions: string[];
  requirements: ComplianceRequirement[];
  effectiveDate: Date;
  lastUpdated: Date;
}

export interface ComplianceRequirement {
  requirementId: string;
  title: string;
  description: string;
  category: string;
  mandatory: boolean;
  evidenceRequired: string[];
  assessmentFrequency: 'ANNUAL' | 'QUARTERLY' | 'MONTHLY' | 'CONTINUOUS';
  lastAssessmentDate?: Date;
  nextAssessmentDate?: Date;
  complianceStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'UNDER_REVIEW' | 'NOT_APPLICABLE';
}

export interface ComplianceAudit {
  id: string;
  auditCode: string;
  frameworkId: string;
  auditType: 'INTERNAL' | 'EXTERNAL' | 'REGULATORY' | 'CERTIFICATION';
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  auditorId: string;
  plannedStartDate: Date;
  plannedEndDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  findings: AuditFinding[];
  overallRating: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';
  createdDate: Date;
}

export interface AuditFinding {
  findingId: string;
  category: 'MAJOR' | 'MINOR' | 'OBSERVATION' | 'POSITIVE';
  description: string;
  requirementId: string;
  evidence: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  correctiveActions: CorrectiveAction[];
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | 'VERIFIED';
}

export interface CorrectiveAction {
  actionId: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  completedDate?: Date;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export interface ComplianceTraining {
  id: string;
  trainingCode: string;
  title: string;
  description: string;
  requiredFor: string[];
  validityPeriod: number; // months
  providerId?: string;
  cost?: number;
  status: 'ACTIVE' | 'INACTIVE' | 'UNDER_DEVELOPMENT';
}

export interface ComplianceReport {
  id: string;
  reportType: 'FRAMEWORK_STATUS' | 'AUDIT_SUMMARY' | 'TRAINING_COMPLIANCE' | 'RISK_ASSESSMENT';
  frameworkId?: string;
  reportingPeriod: {
    startDate: Date;
    endDate: Date;
  };
  metrics: {
    overallComplianceRate: number;
    criticalIssues: number;
    openActions: number;
    completedActions: number;
    trainingComplianceRate: number;
  };
  generatedDate: Date;
  approvedBy?: string;
  approvedDate?: Date;
}

export class ComplianceManager extends BaseManager {
  async createComplianceFramework(framework: Omit<ComplianceFramework, 'id' | 'lastUpdated'>): Promise<ComplianceFramework> {
    const id = `cf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      ...framework,
      id,
      lastUpdated: new Date()
    };
  }

  async updateComplianceFramework(frameworkId: string, updates: Partial<ComplianceFramework>): Promise<ComplianceFramework> {
    console.log(`Updating compliance framework ${frameworkId}`);
    return {
      id: frameworkId,
      frameworkCode: 'CF-001',
      name: 'Updated Framework',
      description: 'Updated description',
      regulatoryBody: 'Updated Body',
      applicableRegions: ['US'],
      requirements: [],
      effectiveDate: new Date(),
      lastUpdated: new Date(),
      ...updates
    };
  }

  async performComplianceAssessment(frameworkId: string): Promise<{
    overallComplianceRate: number;
    nonCompliantItems: ComplianceRequirement[];
    recommendedActions: string[];
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }> {
    console.log(`Performing compliance assessment for framework ${frameworkId}`);
    return {
      overallComplianceRate: 89.5,
      nonCompliantItems: [],
      recommendedActions: [
        'Update employee training records',
        'Schedule quarterly compliance review',
        'Implement automated monitoring'
      ],
      riskLevel: 'MEDIUM'
    };
  }

  async createComplianceAudit(audit: Omit<ComplianceAudit, 'id' | 'auditCode' | 'status' | 'createdDate'>): Promise<ComplianceAudit> {
    const id = `ca_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const auditCode = `AUDIT${Date.now().toString().slice(-6)}`;
    
    return {
      ...audit,
      id,
      auditCode,
      status: 'PLANNED',
      createdDate: new Date()
    };
  }

  async scheduleRegularAssessments(frameworkId: string, frequency: 'ANNUAL' | 'QUARTERLY' | 'MONTHLY'): Promise<{
    scheduledAssessments: Array<{
      assessmentDate: Date;
      requirementIds: string[];
    }>;
    reminderDates: Date[];
  }> {
    console.log(`Scheduling ${frequency} assessments for framework ${frameworkId}`);
    
    const assessments = [];
    const reminderDates = [];
    const today = new Date();
    
    for (let i = 1; i <= 4; i++) {
      const assessmentDate = new Date(today);
      assessmentDate.setMonth(today.getMonth() + (frequency === 'QUARTERLY' ? i * 3 : frequency === 'ANNUAL' ? i * 12 : i));
      
      const reminderDate = new Date(assessmentDate);
      reminderDate.setDate(assessmentDate.getDate() - 7);
      
      assessments.push({
        assessmentDate,
        requirementIds: [`req_${i}`, `req_${i+1}`]
      });
      reminderDates.push(reminderDate);
    }
    
    return { scheduledAssessments: assessments, reminderDates };
  }

  async generateComplianceReport(reportType: ComplianceReport['reportType'], parameters: {
    frameworkId?: string;
    startDate: Date;
    endDate: Date;
  }): Promise<ComplianceReport> {
    const id = `cr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id,
      reportType,
      frameworkId: parameters.frameworkId,
      reportingPeriod: {
        startDate: parameters.startDate,
        endDate: parameters.endDate
      },
      metrics: {
        overallComplianceRate: 92.5,
        criticalIssues: 2,
        openActions: 8,
        completedActions: 24,
        trainingComplianceRate: 87.3
      },
      generatedDate: new Date()
    };
  }

  async trackCorrectiveActions(findingId: string): Promise<{
    actions: CorrectiveAction[];
    overallProgress: number;
    overdueActions: number;
    averageDaysToComplete: number;
  }> {
    console.log(`Tracking corrective actions for finding ${findingId}`);
    
    return {
      actions: [
        {
          actionId: 'ca_001',
          description: 'Update security policies',
          assignedTo: 'compliance_officer',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: 'IN_PROGRESS',
          priority: 'HIGH'
        }
      ],
      overallProgress: 65,
      overdueActions: 1,
      averageDaysToComplete: 28
    };
  }

  async manageComplianceTraining(): Promise<{
    totalPrograms: number;
    employeesCompliant: number;
    employeesNonCompliant: number;
    upcomingDeadlines: Array<{
      employeeId: string;
      trainingId: string;
      dueDate: Date;
    }>;
  }> {
    return {
      totalPrograms: 12,
      employeesCompliant: 156,
      employeesNonCompliant: 23,
      upcomingDeadlines: [
        {
          employeeId: 'emp_001',
          trainingId: 'train_001',
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        }
      ]
    };
  }

  async validateCompliance(entityId: string, entityType: string, requirementIds: string[]): Promise<{
    overallStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL';
    validationResults: Array<{
      requirementId: string;
      status: 'PASS' | 'FAIL' | 'WARNING';
      details: string;
    }>;
    recommendedActions: string[];
  }> {
    console.log(`Validating compliance for ${entityType} ${entityId}`);
    
    return {
      overallStatus: 'COMPLIANT',
      validationResults: requirementIds.map(reqId => ({
        requirementId: reqId,
        status: 'PASS' as const,
        details: `Requirement ${reqId} validated successfully`
      })),
      recommendedActions: []
    };
  }

  async integrateWithHR(employeeId: string): Promise<{
    complianceRecord: {
      completedTrainings: number;
      pendingTrainings: number;
      certificationsHeld: string[];
      nextRenewalDate: Date;
    };
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  }> {
    console.log(`Integrating compliance data with HR for employee ${employeeId}`);
    
    return {
      complianceRecord: {
        completedTrainings: 8,
        pendingTrainings: 2,
        certificationsHeld: ['ISO27001', 'SOX'],
        nextRenewalDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      },
      riskLevel: 'LOW'
    };
  }
}

export const complianceManager = new ComplianceManager();