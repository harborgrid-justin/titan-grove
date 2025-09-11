// Updated Risk Management Module - Using NAPI-RS Native Functions
import {
  calculateRiskScore,
  determineRiskLevel,
  createRiskAssessment,
  calculateResidualRisk,
  generateRiskMetrics,
  assessPortfolioRisk,
} from '../native';

// Export all types from native module
export * from '../native';

// Re-export for backward compatibility
export interface RiskAssessment {
  id: string;
  assessmentName: string;
  riskCategory: 'OPERATIONAL' | 'FINANCIAL' | 'STRATEGIC' | 'COMPLIANCE' | 'TECHNOLOGY';
  riskDescription: string;
  likelihood: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  impact: 'NEGLIGIBLE' | 'MINOR' | 'MODERATE' | 'MAJOR' | 'CATASTROPHIC';
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  owner: string;
  status: 'IDENTIFIED' | 'ASSESSED' | 'MITIGATED' | 'ACCEPTED' | 'TRANSFERRED';
  mitigation: RiskMitigation;
  assessmentDate: Date;
  reviewDate: Date;
  nextReviewDate: Date;
}

export interface RiskMitigation {
  strategy: 'AVOID' | 'REDUCE' | 'TRANSFER' | 'ACCEPT';
  actions: MitigationAction[];
  residualRiskScore: number;
  effectiveDate?: Date;
  cost?: number;
}

export interface MitigationAction {
  actionId: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
  completionDate?: Date;
}

export class RiskManager {
  /**
   * Create a new risk assessment using high-performance native calculations
   */
  async createRiskAssessment(
    assessment: Omit<RiskAssessment, 'id' | 'riskScore' | 'riskLevel'>
  ): Promise<RiskAssessment> {
    // Use native function for fast calculation
    const nativeAssessment = createRiskAssessment(
      assessment.assessmentName,
      assessment.riskCategory,
      assessment.riskDescription,
      assessment.likelihood,
      assessment.impact,
      assessment.owner,
      assessment.status
    );

    return {
      ...assessment,
      id: nativeAssessment.id,
      riskScore: nativeAssessment.riskScore,
      riskLevel: nativeAssessment.riskLevel as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    };
  }

  /**
   * Calculate risk score using native implementation
   */
  calculateRiskScore(likelihood: string, impact: string): number {
    return calculateRiskScore(likelihood, impact);
  }

  /**
   * Determine risk level using native implementation
   */
  determineRiskLevel(score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    return determineRiskLevel(score) as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }

  /**
   * Calculate residual risk after mitigation using native implementation
   */
  calculateResidualRisk(baseScore: number, mitigationEffectiveness: number): number {
    return calculateResidualRisk(baseScore, mitigationEffectiveness);
  }

  /**
   * Generate comprehensive risk report using native analytics
   */
  async generateRiskReport(category?: string): Promise<{
    totalRisks: number;
    riskDistribution: Record<string, number>;
    highRisks: RiskAssessment[];
    overdueMitigations: number;
    averageRiskScore: number;
    portfolioRiskScore: number;
  }> {
    console.log(`Generating native-powered risk report for category: ${category || 'All'}`);

    // This would normally fetch real data from database
    const mockRisks = [
      {
        id: 'risk_1',
        assessmentName: 'Sample Risk 1',
        riskCategory: 'OPERATIONAL',
        riskDescription: 'Sample description',
        likelihood: 'MEDIUM',
        impact: 'HIGH',
        riskScore: 12.0,
        riskLevel: 'HIGH',
        owner: 'risk_manager',
        status: 'ASSESSED',
      },
      {
        id: 'risk_2',
        assessmentName: 'Sample Risk 2',
        riskCategory: 'FINANCIAL',
        riskDescription: 'Sample description',
        likelihood: 'LOW',
        impact: 'MEDIUM',
        riskScore: 6.0,
        riskLevel: 'MEDIUM',
        owner: 'risk_manager',
        status: 'ASSESSED',
      },
    ];

    // Use native functions for high-performance calculations
    const metrics = generateRiskMetrics(mockRisks);
    const portfolioRiskScore = assessPortfolioRisk(mockRisks);

    return {
      totalRisks: metrics.totalRisks,
      riskDistribution: {
        LOW: metrics.riskDistribution.find((d) => d.level === 'LOW')?.count || 0,
        MEDIUM: metrics.riskDistribution.find((d) => d.level === 'MEDIUM')?.count || 0,
        HIGH: metrics.riskDistribution.find((d) => d.level === 'HIGH')?.count || 0,
        CRITICAL: metrics.riskDistribution.find((d) => d.level === 'CRITICAL')?.count || 0,
      },
      highRisks: [], // Would map from native results
      overdueMitigations: metrics.overdueMitigations,
      averageRiskScore: metrics.averageRiskScore,
      portfolioRiskScore,
    };
  }

  /**
   * Assess portfolio risk using native implementation
   */
  async assessPortfolioRisk(risks: any[]): Promise<number> {
    return assessPortfolioRisk(risks);
  }
}

export const riskManager = new RiskManager();
