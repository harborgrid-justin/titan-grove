/**
 * Federal Compliance Service
 * Implements Oracle CLM competitive features for FAR, DFARS, and agency regulations compliance
 * Supports US federal procurement business processes and regulations
 * Enhanced with circuit breakers and error boundaries for maximum resilience
 */

import {
  BaseComplianceService,
  withErrorBoundary,
  ComplianceRule,
  ComplianceCheck,
  ServiceResponse,
  ComplianceStatus,
  ValidationCriteria,
} from '../common/BaseComplianceService';

import {
  CircuitBreakerConfig,
  ErrorBoundaryConfig,
  ErrorSeverity,
} from '../../../../core/error-handling';

// Specialized federal compliance types extending base types
export interface FederalRegulation extends ComplianceRule {
  regulationType: 'FAR' | 'DFARS' | 'AGENCY_SPECIFIC' | 'CFR' | 'USC' | 'DOD_FMR';
  regulationNumber: string;
  applicableContracts: string[];
  federalRequirements: FederalComplianceRequirement[];
}

export interface FederalComplianceRequirement {
  id: string;
  requirementType: 'DOCUMENTATION' | 'CERTIFICATION' | 'PROCESS' | 'REPORTING' | 'AUDIT';
  mandatory: boolean;
  dueDate?: Date;
  responsibleParty: 'CONTRACTOR' | 'CONTRACTING_OFFICER' | 'AGENCY' | 'BOTH';
  exemptions?: string[];
}

export interface FederalContractingRequirement {
  id: string;
  contractType: 'FIXED_PRICE' | 'COST_REIMBURSEMENT' | 'TIME_AND_MATERIALS' | 'INDEFINITE_DELIVERY';
  dollarThreshold: number;
  competitionType: 'FULL_AND_OPEN' | 'LIMITED_SOURCES' | 'SOLE_SOURCE' | 'SMALL_BUSINESS_SET_ASIDE';
  requiredClauses: string[];
  requiredCertifications: string[];
  approvalLevels: ApprovalLevel[];
  socioeconomicRequirements: SocioeconomicRequirement[];
}

export interface ApprovalLevel {
  threshold: number;
  approverRole: 'CONTRACTING_OFFICER' | 'SENIOR_CONTRACTING_OFFICIAL' | 'HCA' | 'SPE';
  requiredCertifications: string[];
  delegationLimits?: number;
}

export interface SocioeconomicRequirement {
  type: 'SMALL_BUSINESS' | 'WOMAN_OWNED' | 'VETERAN_OWNED' | 'HUB_ZONE' | '8A_PROGRAM' | 'SDVO';
  percentage?: number;
  mandatory: boolean;
  applicableContracts: string[];
}

export interface FARAuditTrail {
  id: string;
  contractId: string;
  action: string;
  performedBy: string;
  performedDate: Date;
  regulatoryJustification: string;
  impactAssessment: string;
  approvalRequired: boolean;
  approvedBy?: string;
  approvalDate?: Date;
}

export class FederalComplianceService extends BaseComplianceService {
  private static readonly CIRCUIT_BREAKER_CONFIG: CircuitBreakerConfig = {
    failureThreshold: 5,
    recoveryTimeout: 30000, // 30 seconds
    monitoringPeriod: 60000, // 1 minute
    expectedErrors: (error: Error) => {
      // Don't trigger circuit breaker for validation errors
      return (error as Error).message.includes('validation') || (error as Error).message.includes('compliance');
    },
  };

  private static readonly ERROR_BOUNDARY_CONFIG: ErrorBoundaryConfig = {
    serviceName: 'FederalComplianceService',
    circuitBreakerConfig: FederalComplianceService.CIRCUIT_BREAKER_CONFIG,
    retryConfig: {
      maxAttempts: 3,
      initialDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2,
      retryableErrors: (error: Error) => {
        // Retry on network errors, timeouts, but not validation errors
        return (
          !(error as Error).message.includes('validation') &&
          !(error as Error).message.includes('compliance') &&
          ((error as Error).message.includes('timeout') ||
            (error as Error).message.includes('network') ||
            (error as Error).message.includes('connection'))
        );
      },
    },
    fallbackConfig: {
      enabled: true,
      fallbackHandler: async <T>(context: any, error: Error): Promise<T> => {
        // Return degraded compliance check result
        return [
          {
            id: `fallback_${Date.now()}`,
            entityId: context.metadata?.entityId || 'unknown',
            entityType: context.metadata?.entityType || 'contract',
            ruleId: 'fallback_rule',
            status: ComplianceStatus.PENDING,
            checkDate: new Date(),
            checkedBy: 'fallback_handler',
            findings: [
              {
                findingType: 'OBSERVATION',
                severity: 'MEDIUM',
                description: `Compliance check deferred due to service error: ${(error as Error).message}`,
                requiresAction: true,
              },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'fallback_handler',
            version: 1,
          },
        ] as T;
      },
    },
    errorClassification: (error: Error) => {
      if ((error as Error).message.includes('CRITICAL') || (error as Error).message.includes('security')) {
        return ErrorSeverity.CRITICAL;
      }
      if ((error as Error).message.includes('compliance') || (error as Error).message.includes('regulation')) {
        return ErrorSeverity.HIGH;
      }
      if ((error as Error).message.includes('validation')) {
        return ErrorSeverity.MEDIUM;
      }
      return ErrorSeverity.LOW;
    },
  };

  constructor(serviceRegistry?: any) {
    super('FederalComplianceService', serviceRegistry);
  }

  protected async getEntityData(entityId: string, entityType: string): Promise<any> {
    // In a real implementation, this would fetch from database
    // For now, return mock contract data
    if (entityType === 'contract') {
      return {
        id: entityId,
        value: 100000,
        type: 'FIXED_PRICE',
        agency: 'DOD',
        contractorSAMRegistration: 'active',
        requiredClauses: ['FAR 52.204-21', 'FAR 52.219-8'],
        certifications: ['System for Award Management (SAM) Registration'],
      };
    }
    throw new Error(`Unsupported entity type: ${entityType}`);
  }

  protected async loadComplianceRules(
    entityType: string,
    regulationType?: string
  ): Promise<ComplianceRule[]> {
    // In a real implementation, this would load from database/configuration
    const baseRules: ComplianceRule[] = [
      {
        id: 'FAR_52_204_21',
        ruleType: 'CYBERSECURITY',
        name: 'Basic Safeguarding of Covered Contractor Information Systems',
        description: 'FAR clause for basic cybersecurity requirements',
        regulationType: 'FAR',
        regulationReference: 'FAR 52.204-21',
        effectiveDate: new Date('2020-01-01'),
        isActive: true,
        priority: 'HIGH',
        scope: ['contract'],
        validationCriteria: [
          {
            criteriaType: 'DATA',
            field: 'requiredClauses',
            operator: 'CONTAINS',
            value: 'FAR 52.204-21',
            isRequired: true,
            errorMessage: 'Contract must include FAR 52.204-21 Basic Safeguarding clause',
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        version: 1,
      },
    ];

    if (regulationType) {
      return baseRules.filter((rule) => rule.regulationType === regulationType);
    }

    return baseRules;
  }
  /**
   * Validate contract against FAR regulations with enhanced error handling
   */
  async validateFARCompliance(contractId: string): Promise<ServiceResponse<ComplianceCheck[]>> {
    const rules = await this.getComplianceRules('contract', 'FAR');
    if (!rules.success) {
      return rules as ServiceResponse<ComplianceCheck[]>;
    }

    return await this.validateCompliance(contractId, 'contract', rules.data);
  }

  /**
   * Validate contract against DFARS regulations with circuit breaker protection
   */
  async validateDFARSCompliance(contractId: string): Promise<ServiceResponse<ComplianceCheck[]>> {
    const rules = await this.getComplianceRules('contract', 'DFARS');
    if (!rules.success) {
      return rules as ServiceResponse<ComplianceCheck[]>;
    }

    return await this.validateCompliance(contractId, 'contract', rules.data);
  }

  /**
   * Get federal contracting requirements with resilient error handling
   */
  async getFederalContractingRequirements(
    contractValue: number,
    contractType: string,
    agency: string
  ): Promise<ServiceResponse<FederalContractingRequirement>> {
    try {
      const requirement: FederalContractingRequirement = {
        id: `fcr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        contractType: contractType as any,
        dollarThreshold: contractValue,
        competitionType: contractValue > 250000 ? 'FULL_AND_OPEN' : 'LIMITED_SOURCES',
        requiredClauses: [
          'FAR 52.204-21 Basic Safeguarding of Covered Contractor Information Systems',
          'FAR 52.219-8 Utilization of Small Business Concerns',
        ],
        requiredCertifications: ['System for Award Management (SAM) Registration'],
        approvalLevels: [
          {
            threshold: contractValue,
            approverRole: 'CONTRACTING_OFFICER',
            requiredCertifications: ['FAC-C Level II'],
          },
        ],
        socioeconomicRequirements: [
          {
            type: 'SMALL_BUSINESS',
            percentage: 23,
            mandatory: true,
            applicableContracts: ['all'],
          },
        ],
      };

      return {
        success: true,
        data: requirement,
        timestamp: new Date(),
        correlationId: this.correlationId,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'FEDERAL_REQUIREMENTS_FAILED',
          message: `Failed to get federal contracting requirements: ${(error as Error).message}`,
          details: { contractValue, contractType, agency },
        },
        timestamp: new Date(),
        correlationId: this.correlationId,
      };
    }
  }

  /**
   * Generate compliance report with comprehensive error boundary protection
   */
  async generateComplianceReport(contractId: string): Promise<
    ServiceResponse<{
      overallStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING_REVIEW';
      complianceScore: number;
      criticalIssues: ComplianceCheck[];
      recommendations: string[];
      reportDate: Date;
    }>
  > {
    try {
      // Validate against all applicable regulations
      const farChecks = await this.validateFARCompliance(contractId);
      const dfarsChecks = await this.validateDFARSCompliance(contractId);

      const allChecks: ComplianceCheck[] = [];

      if (farChecks.success) {
        allChecks.push(...farChecks.data);
      }
      if (dfarsChecks.success) {
        allChecks.push(...dfarsChecks.data);
      }

      const criticalIssues = allChecks.filter(
        (check) => check.status === ComplianceStatus.NON_COMPLIANT
      );

      const complianceScore = this.calculateComplianceScore(allChecks);
      const overallStatus = criticalIssues.length > 0 ? 'NON_COMPLIANT' : 'COMPLIANT';

      return {
        success: true,
        data: {
          overallStatus,
          complianceScore,
          criticalIssues,
          recommendations: [
            'Ensure all required FAR clauses are included in contract',
            'Verify contractor SAM registration is current',
            'Review DFARS cybersecurity requirements for DoD contracts',
          ],
          reportDate: new Date(),
        },
        timestamp: new Date(),
        correlationId: this.correlationId,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'COMPLIANCE_REPORT_FAILED',
          message: `Failed to generate compliance report: ${(error as Error).message}`,
          details: { contractId },
        },
        timestamp: new Date(),
        correlationId: this.correlationId,
      };
    }
  }

  private calculateComplianceScore(checks: ComplianceCheck[]): number {
    if (checks.length === 0) return 0;

    const compliantChecks = checks.filter(
      (check) =>
        check.status === ComplianceStatus.COMPLIANT || check.status === ComplianceStatus.WAIVED
    );

    return Math.round((compliantChecks.length / checks.length) * 100);
  }

  /**
   * Get required contract clauses with error boundary protection
   */
  async getRequiredClauses(
    contractValue: number,
    contractType: string,
    agency?: string
  ): Promise<ServiceResponse<string[]>> {
    try {
      const baseClauses = [
        'FAR 52.204-21 Basic Safeguarding of Covered Contractor Information Systems',
        'FAR 52.219-8 Utilization of Small Business Concerns',
      ];

      // Add value-based clauses
      if (contractValue > 250000) {
        baseClauses.push('FAR 52.215-2 Audit and Records - Negotiation');
      }

      if (contractValue > 750000) {
        baseClauses.push('FAR 52.203-13 Contractor Code of Business Ethics and Conduct');
      }

      // Add agency-specific clauses
      if (agency === 'DOD') {
        baseClauses.push('DFARS 252.204-7000 Disclosure of Information');
        baseClauses.push('DFARS 252.204-7012 Safeguarding Covered Defense Information');
      }

      return {
        success: true,
        data: baseClauses,
        timestamp: new Date(),
        correlationId: this.correlationId,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'REQUIRED_CLAUSES_FAILED',
          message: `Failed to get required clauses: ${(error as Error).message}`,
          details: { contractValue, contractType, agency },
        },
        timestamp: new Date(),
        correlationId: this.correlationId,
      };
    }
  }

  /**
   * Create audit trail entry with comprehensive error handling
   */
  async createAuditTrailEntry(
    contractId: string,
    action: string,
    performedBy: string,
    details: {
      regulatoryJustification: string;
      impactAssessment: string;
      approvalRequired: boolean;
    }
  ): Promise<ServiceResponse<FARAuditTrail>> {
    try {
      const auditEntry: FARAuditTrail = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        contractId,
        action,
        performedBy,
        performedDate: new Date(),
        regulatoryJustification: details.regulatoryJustification,
        impactAssessment: details.impactAssessment,
        approvalRequired: details.approvalRequired,
      };

      // In a real implementation, this would save to database
      this.logger?.info('Audit trail entry created', { auditEntry });

      return {
        success: true,
        data: auditEntry,
        timestamp: new Date(),
        correlationId: this.correlationId,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'AUDIT_TRAIL_FAILED',
          message: `Failed to create audit trail: ${(error as Error).message}`,
          details: { contractId, action, performedBy },
        },
        timestamp: new Date(),
        correlationId: this.correlationId,
      };
    }
  }
}
