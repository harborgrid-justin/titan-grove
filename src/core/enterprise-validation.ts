/**
 * Production-Grade Business Logic Validation Framework
 * Enterprise-level data validation, business rules enforcement, and compliance checking
 */

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  field: string;
  type: 'required' | 'format' | 'range' | 'custom' | 'compliance';
  condition: string | RegExp | ((value: any) => boolean);
  errorMessage: string;
  severity: 'error' | 'warning' | 'info';
  complianceStandard?: 'SOX' | 'GDPR' | 'ISO27001' | 'IFRS' | 'GAAP';
}

export interface ValidationResult {
  field: string;
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  ruleId: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  field: string;
  value?: any;
}

export interface ValidationWarning extends ValidationError {
  recommendation?: string;
}

export class EnterpriseValidationEngine {
  private rules: Map<string, ValidationRule[]> = new Map();

  constructor() {
    this.initializeStandardRules();
  }

  /**
   * Initialize production-grade validation rules for all business modules
   */
  private initializeStandardRules() {
    // Financial Module Rules
    this.addRules('financial', [
      {
        id: 'fin-001',
        name: 'Transaction Amount Validation',
        description: 'Validates financial transaction amounts are within acceptable ranges',
        field: 'amount',
        type: 'range',
        condition: (value: number) => value > 0 && value <= 10000000,
        errorMessage: 'Transaction amount must be between $0.01 and $10M',
        severity: 'error',
      },
      {
        id: 'fin-002',
        name: 'Account Code Format',
        description: 'Ensures account codes follow chart of accounts format',
        field: 'accountCode',
        type: 'format',
        condition: /^[0-9]{4}-[0-9]{3}$/,
        errorMessage: 'Account code must follow format XXXX-XXX',
        severity: 'error',
        complianceStandard: 'GAAP',
      },
      {
        id: 'fin-003',
        name: 'SOX Compliance Check',
        description: 'Validates transactions meet SOX requirements',
        field: 'transaction',
        type: 'compliance',
        condition: (transaction: any) => 
          transaction.approvalLevel && 
          transaction.auditTrail && 
          transaction.documentation,
        errorMessage: 'Transaction must include approval, audit trail, and documentation for SOX compliance',
        severity: 'error',
        complianceStandard: 'SOX',
      },
    ]);

    // HR Module Rules
    this.addRules('hr', [
      {
        id: 'hr-001',
        name: 'Employee ID Format',
        description: 'Validates employee ID follows company standard',
        field: 'employeeId',
        type: 'format',
        condition: /^EMP-[0-9]{6}$/,
        errorMessage: 'Employee ID must follow format EMP-XXXXXX',
        severity: 'error',
      },
      {
        id: 'hr-002',
        name: 'Salary Range Validation',
        description: 'Ensures salary is within acceptable range for position level',
        field: 'salary',
        type: 'custom',
        condition: (data: any) => {
          const { salary, positionLevel } = data;
          const ranges = {
            'junior': [30000, 70000],
            'mid': [60000, 120000],
            'senior': [100000, 200000],
            'executive': [180000, 500000],
          };
          const [min, max] = ranges[positionLevel as keyof typeof ranges] || [0, 0];
          return salary >= min && salary <= max;
        },
        errorMessage: 'Salary is outside acceptable range for position level',
        severity: 'warning',
      },
      {
        id: 'hr-003',
        name: 'PII Data Protection',
        description: 'Ensures personal data handling complies with GDPR',
        field: 'personalData',
        type: 'compliance',
        condition: (data: any) => 
          data.consentGiven && 
          data.dataRetentionPeriod && 
          data.encryptionApplied,
        errorMessage: 'Personal data must have consent, retention policy, and encryption',
        severity: 'error',
        complianceStandard: 'GDPR',
      },
    ]);

    // CRM Module Rules
    this.addRules('crm', [
      {
        id: 'crm-001',
        name: 'Customer Email Validation',
        description: 'Validates customer email format',
        field: 'email',
        type: 'format',
        condition: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        errorMessage: 'Invalid email format',
        severity: 'error',
      },
      {
        id: 'crm-002',
        name: 'Opportunity Value Range',
        description: 'Validates opportunity value is realistic',
        field: 'opportunityValue',
        type: 'range',
        condition: (value: number) => value >= 1000 && value <= 50000000,
        errorMessage: 'Opportunity value must be between $1,000 and $50M',
        severity: 'warning',
      },
    ]);

    // Manufacturing Module Rules
    this.addRules('manufacturing', [
      {
        id: 'mfg-001',
        name: 'Production Quantity Validation',
        description: 'Ensures production quantities are within capacity',
        field: 'quantity',
        type: 'range',
        condition: (value: number) => value > 0 && value <= 100000,
        errorMessage: 'Production quantity must be between 1 and 100,000 units',
        severity: 'error',
      },
      {
        id: 'mfg-002',
        name: 'Quality Standards Compliance',
        description: 'Validates products meet ISO quality standards',
        field: 'qualityMetrics',
        type: 'compliance',
        condition: (metrics: any) => 
          metrics.defectRate <= 0.01 && 
          metrics.testsPassed >= 95,
        errorMessage: 'Product must meet ISO quality standards (defect rate ≤ 1%, tests passed ≥ 95%)',
        severity: 'error',
        complianceStandard: 'ISO27001',
      },
    ]);
  }

  /**
   * Add validation rules for a specific module
   */
  addRules(module: string, rules: ValidationRule[]) {
    const existingRules = this.rules.get(module) || [];
    this.rules.set(module, [...existingRules, ...rules]);
  }

  /**
   * Validate data against business rules
   */
  async validateData(module: string, data: any): Promise<ValidationResult[]> {
    const moduleRules = this.rules.get(module) || [];
    const results: ValidationResult[] = [];

    for (const [field, value] of Object.entries(data)) {
      const fieldRules = moduleRules.filter(rule => rule.field === field || rule.field === module);
      const fieldResult: ValidationResult = {
        field,
        valid: true,
        errors: [],
        warnings: [],
      };

      for (const rule of fieldRules) {
        const isValid = this.evaluateRule(rule, value, data);
        
        if (!isValid) {
          const error: ValidationError = {
            ruleId: rule.id,
            message: rule.errorMessage,
            severity: rule.severity,
            field,
            value,
          };

          if (rule.severity === 'error') {
            fieldResult.errors.push(error);
            fieldResult.valid = false;
          } else {
            fieldResult.warnings.push(error as ValidationWarning);
          }
        }
      }

      results.push(fieldResult);
    }

    return results;
  }

  /**
   * Evaluate a single validation rule
   */
  private evaluateRule(rule: ValidationRule, value: any, context: any): boolean {
    try {
      switch (rule.type) {
        case 'required':
          return value !== null && value !== undefined && value !== '';
        
        case 'format':
          if (rule.condition instanceof RegExp) {
            return rule.condition.test(String(value));
          }
          return false;
        
        case 'range':
          if (typeof rule.condition === 'function') {
            return rule.condition(value);
          }
          return false;
        
        case 'custom':
        case 'compliance':
          if (typeof rule.condition === 'function') {
            return rule.condition(rule.field === rule.name ? context : value);
          }
          return false;
        
        default:
          return true;
      }
    } catch (error) {
      console.error(`Validation rule ${rule.id} failed with error:`, error);
      return false;
    }
  }

  /**
   * Generate compliance report
   */
  async generateComplianceReport(module: string, data: any[]): Promise<{
    totalRecords: number;
    compliantRecords: number;
    nonCompliantRecords: number;
    complianceRate: number;
    violationsByStandard: Record<string, number>;
    criticalViolations: ValidationError[];
  }> {
    const totalRecords = data.length;
    let compliantRecords = 0;
    const violationsByStandard: Record<string, number> = {};
    const criticalViolations: ValidationError[] = [];

    for (const record of data) {
      const validationResults = await this.validateData(module, record);
      const hasErrors = validationResults.some(result => result.errors.length > 0);
      
      if (!hasErrors) {
        compliantRecords++;
      }

      // Collect violations by compliance standard
      for (const result of validationResults) {
        for (const error of result.errors) {
          const rules = this.rules.get(module) || [];
          const rule = rules.find(r => r.id === error.ruleId);
          
          if (rule?.complianceStandard) {
            violationsByStandard[rule.complianceStandard] = 
              (violationsByStandard[rule.complianceStandard] || 0) + 1;
          }

          if (error.severity === 'error') {
            criticalViolations.push(error);
          }
        }
      }
    }

    return {
      totalRecords,
      compliantRecords,
      nonCompliantRecords: totalRecords - compliantRecords,
      complianceRate: (compliantRecords / totalRecords) * 100,
      violationsByStandard,
      criticalViolations,
    };
  }

  /**
   * Get all available rules for a module
   */
  getRules(module: string): ValidationRule[] {
    return this.rules.get(module) || [];
  }

  /**
   * Get compliance standards used by a module
   */
  getComplianceStandards(module: string): string[] {
    const rules = this.rules.get(module) || [];
    const standards = new Set<string>();
    
    rules.forEach(rule => {
      if (rule.complianceStandard) {
        standards.add(rule.complianceStandard);
      }
    });

    return Array.from(standards);
  }
}

// Singleton instance for global use
export const enterpriseValidator = new EnterpriseValidationEngine();

export default EnterpriseValidationEngine;