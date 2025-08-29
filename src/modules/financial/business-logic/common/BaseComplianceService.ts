/**
 * Base Compliance Service with built-in error boundaries and circuit breakers
 * Centralized compliance logic for reuse across all compliance services
 */

import {
  BaseService,
  withErrorBoundary,
  ComplianceRule,
  ComplianceCheck,
  ComplianceStatus,
  ValidationCriteria,
  ServiceResponse,
  PaginationRequest,
  PaginationResponse,
  AlertSeverity
} from '../../../../core/error-handling';

// Re-export common types for easier importing
export {
  BaseService,
  withErrorBoundary,
  ComplianceRule,
  ComplianceCheck,
  ComplianceStatus,
  ValidationCriteria,
  ServiceResponse,
  PaginationRequest,
  PaginationResponse,
  AlertSeverity
} from '../../../../core/error-handling';

export abstract class BaseComplianceService extends BaseService {
  constructor(
    serviceName: string,
    protected readonly serviceRegistry?: any
  ) {
    super(serviceName, serviceRegistry);
  }

  async validateCompliance(
    entityId: string,
    entityType: string,
    rules: ComplianceRule[]
  ): Promise<ServiceResponse<ComplianceCheck[]>> {
    if (!this.errorBoundary) {
      // Fallback implementation without error boundary
      try {
        const checks: ComplianceCheck[] = [];
        for (const rule of rules) {
          const check = await this.performRuleCheck(entityId, entityType, rule);
          checks.push(check);
        }
        return {
          success: true,
          data: checks,
          timestamp: new Date(),
          correlationId: this.correlationId
        };
      } catch (error) {
        this.logger?.error(`Compliance validation failed for ${entityType}:${entityId}`, error);
        return {
          success: false,
          error: {
            code: 'COMPLIANCE_VALIDATION_FAILED',
            message: `Failed to validate compliance: ${(error as Error).message}`,
            details: { entityId, entityType, rulesCount: rules.length }
          },
          timestamp: new Date(),
          correlationId: this.correlationId
        };
      }
    }

    // Use error boundary if available
    return await this.errorBoundary.execute(
      async () => {
        const checks: ComplianceCheck[] = [];
        for (const rule of rules) {
          const check = await this.performRuleCheck(entityId, entityType, rule);
          checks.push(check);
        }
        return {
          success: true,
          data: checks,
          timestamp: new Date(),
          correlationId: this.correlationId
        };
      },
      {
        service: this.constructor.name,
        operation: 'validateCompliance',
        timestamp: new Date(),
        metadata: { entityId, entityType, rulesCount: rules.length }
      }
    ).catch(error => ({
      success: false,
      error: {
        code: 'COMPLIANCE_VALIDATION_FAILED',
        message: `Failed to validate compliance: ${error.message}`,
        details: { entityId, entityType, rulesCount: rules.length }
      },
      timestamp: new Date(),
      correlationId: this.correlationId
    }));
  }

  protected async performRuleCheck(
    entityId: string,
    entityType: string,
    rule: ComplianceRule
  ): Promise<ComplianceCheck> {
    const checkId = `${rule.id}_${entityId}_${Date.now()}`;
    
    try {
      // Get entity data for validation
      const entityData = await this.getEntityData(entityId, entityType);
      
      // Perform validation against rule criteria
      const validationResults = await this.validateAgainstCriteria(
        entityData,
        rule.validationCriteria
      );

      // Check for exemptions
      const exemption = await this.checkExemptions(entityData, rule);

      const status = this.determineComplianceStatus(validationResults, exemption);

      return {
        id: checkId,
        entityId,
        entityType,
        ruleId: rule.id,
        status,
        checkDate: new Date(),
        checkedBy: this.serviceName,
        findings: validationResults.violations,
        evidence: validationResults.evidence,
        nextReviewDate: this.calculateNextReviewDate(rule, status),
        exemptionApplied: exemption,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: this.serviceName,
        version: 1
      } as ComplianceCheck;

    } catch (error) {
      // Return a failed compliance check
      return {
        id: checkId,
        entityId,
        entityType,
        ruleId: rule.id,
        status: ComplianceStatus.NON_COMPLIANT,
        checkDate: new Date(),
        checkedBy: this.serviceName,
        findings: [{
          findingType: 'VIOLATION',
          severity: AlertSeverity.HIGH,
          description: `Error during compliance check: ${(error as Error).message}`,
          requiresAction: true
        }],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: this.serviceName,
        version: 1
      } as ComplianceCheck;
    }
  }

  protected abstract getEntityData(entityId: string, entityType: string): Promise<any>;

  protected async validateAgainstCriteria(
    entityData: any,
    criteria: ValidationCriteria[]
  ): Promise<{
    isCompliant: boolean;
    violations: any[];
    evidence: any[];
  }> {
    const violations: any[] = [];
    const evidence: any[] = [];
    
    for (const criterion of criteria) {
      try {
        const result = await this.evaluateCriterion(entityData, criterion);
        
        if (!result.isValid && criterion.isRequired) {
          violations.push({
            findingType: 'VIOLATION',
            severity: AlertSeverity.MEDIUM,
            description: criterion.errorMessage || `Validation failed for ${criterion.field}`,
            requiresAction: true
          });
        }
        
        if (result.evidence) {
          evidence.push(result.evidence);
        }
      } catch (error) {
        violations.push({
          findingType: 'VIOLATION',
          severity: AlertSeverity.HIGH,
          description: `Validation error for ${criterion.field}: ${(error as Error).message}`,
          requiresAction: true
        });
      }
    }

    return {
      isCompliant: violations.length === 0,
      violations,
      evidence
    };
  }

  protected async evaluateCriterion(
    entityData: any,
    criterion: ValidationCriteria
  ): Promise<{
    isValid: boolean;
    evidence?: any;
  }> {
    const fieldValue = this.getNestedValue(entityData, criterion.field);
    
    switch (criterion.operator) {
      case 'EQUALS':
        return { isValid: fieldValue === criterion.value };
      case 'NOT_EQUALS':
        return { isValid: fieldValue !== criterion.value };
      case 'GREATER_THAN':
        return { isValid: Number(fieldValue) > Number(criterion.value) };
      case 'LESS_THAN':
        return { isValid: Number(fieldValue) < Number(criterion.value) };
      case 'CONTAINS':
        return { isValid: String(fieldValue).includes(String(criterion.value)) };
      case 'REGEX':
        const regex = new RegExp(criterion.value);
        return { isValid: regex.test(String(fieldValue)) };
      case 'EXISTS':
        return { isValid: fieldValue !== undefined && fieldValue !== null };
      default:
        throw new Error(`Unsupported validation operator: ${criterion.operator}`);
    }
  }

  protected getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  protected async checkExemptions(entityData: any, rule: ComplianceRule): Promise<any> {
    if (!rule.exemptions) {
      return undefined;
    }

    for (const exemption of rule.exemptions) {
      const exemptionResult = await this.validateAgainstCriteria(
        entityData,
        exemption.conditions
      );
      
      if (exemptionResult.isCompliant) {
        return {
          exemptionId: `exemption_${rule.id}_${Date.now()}`,
          justification: exemption.justification,
          approvedBy: 'system_auto_exemption',
          approvalDate: new Date()
        };
      }
    }

    return undefined;
  }

  protected determineComplianceStatus(
    validationResults: any,
    exemption: any
  ): ComplianceStatus {
    if (exemption) {
      return ComplianceStatus.WAIVED;
    }
    
    return validationResults.isCompliant 
      ? ComplianceStatus.COMPLIANT 
      : ComplianceStatus.NON_COMPLIANT;
  }

  protected calculateNextReviewDate(rule: ComplianceRule, status: ComplianceStatus): Date {
    const baseDate = new Date();
    let daysToAdd = 90; // Default quarterly review

    // Adjust based on rule priority and current status
    if (rule.priority === 'CRITICAL') {
      daysToAdd = 30;
    } else if (rule.priority === 'HIGH') {
      daysToAdd = 60;
    }

    if (status === ComplianceStatus.NON_COMPLIANT) {
      daysToAdd = Math.min(daysToAdd / 2, 14); // More frequent reviews for non-compliant
    }

    baseDate.setDate(baseDate.getDate() + daysToAdd);
    return baseDate;
  }

  async getComplianceRules(
    entityType: string,
    regulationType?: string
  ): Promise<ServiceResponse<ComplianceRule[]>> {
    if (!this.errorBoundary) {
      // Fallback implementation
      try {
        const rules = await this.loadComplianceRules(entityType, regulationType);
        return {
          success: true,
          data: rules,
          timestamp: new Date(),
          correlationId: this.correlationId
        };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'COMPLIANCE_RULES_LOAD_FAILED',
            message: `Failed to load compliance rules: ${(error as Error).message}`,
            details: { entityType, regulationType }
          },
          timestamp: new Date(),
          correlationId: this.correlationId
        };
      }
    }

    // Use error boundary if available
    return await this.errorBoundary.execute(
      async () => {
        const rules = await this.loadComplianceRules(entityType, regulationType);
        return {
          success: true,
          data: rules,
          timestamp: new Date(),
          correlationId: this.correlationId
        };
      },
      {
        service: this.constructor.name,
        operation: 'getComplianceRules',
        timestamp: new Date(),
        metadata: { entityType, regulationType }
      }
    ).catch(error => ({
      success: false,
      error: {
        code: 'COMPLIANCE_RULES_LOAD_FAILED',
        message: `Failed to load compliance rules: ${error.message}`,
        details: { entityType, regulationType }
      },
      timestamp: new Date(),
      correlationId: this.correlationId
    }));
  }

  protected abstract loadComplianceRules(
    entityType: string,
    regulationType?: string
  ): Promise<ComplianceRule[]>;
}