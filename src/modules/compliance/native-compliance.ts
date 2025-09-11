// Updated Compliance Management Module - Using NAPI-RS Native Functions
import {
  calculateComplianceScore,
  determineComplianceRiskLevel,
  assessFrameworkCompliance,
  calculateTrainingComplianceRate,
  validateRequirementCompliance,
  generateComplianceMetrics,
  calculateAuditScore,
} from '../native';

// Re-export native types and functions
export * from '../native';

export class ComplianceManager {
  /**
   * Calculate compliance score using high-performance native implementation
   */
  calculateComplianceScore(
    totalRequirements: number,
    compliantRequirements: number,
    weightedScores: number[]
  ): number {
    return calculateComplianceScore(totalRequirements, compliantRequirements, weightedScores);
  }

  /**
   * Determine compliance risk level using native calculations
   */
  determineComplianceRiskLevel(complianceRate: number, criticalFindings: number): string {
    return determineComplianceRiskLevel(complianceRate, criticalFindings);
  }

  /**
   * Assess framework compliance using native implementation
   */
  async assessFrameworkCompliance(frameworkId: string, requirements: any[]): Promise<any> {
    console.log(`Assessing compliance for framework ${frameworkId} using native implementation`);
    return assessFrameworkCompliance(frameworkId, requirements);
  }

  /**
   * Calculate training compliance rate using native algorithms
   */
  calculateTrainingComplianceRate(
    totalEmployees: number,
    employeesWithCurrentTraining: number,
    overdueRenewals: number
  ): number {
    return calculateTrainingComplianceRate(
      totalEmployees,
      employeesWithCurrentTraining,
      overdueRenewals
    );
  }

  /**
   * Generate comprehensive compliance metrics using native analytics
   */
  async generateComplianceMetrics(
    frameworks: any[],
    findings: any[],
    trainingComplianceRate: number
  ): Promise<any> {
    return generateComplianceMetrics(frameworks, findings, trainingComplianceRate);
  }

  /**
   * Calculate audit score using native implementation
   */
  calculateAuditScore(
    totalRequirementsChecked: number,
    requirementsPassed: number,
    minorFindings: number,
    majorFindings: number,
    criticalFindings: number
  ): number {
    return calculateAuditScore(
      totalRequirementsChecked,
      requirementsPassed,
      minorFindings,
      majorFindings,
      criticalFindings
    );
  }
}

export const complianceManager = new ComplianceManager();
