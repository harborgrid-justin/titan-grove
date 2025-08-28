/**
 * Project Portfolio Business Logic
 * Handles portfolio evaluation, prioritization, and analysis
 */

import type { ProjectFinancialAnalysis } from '../types';

export class ProjectPortfolioService {
  
  async evaluateProjectPortfolio(projects: string[]): Promise<any> {
    const projectEvaluations = [];
    
    for (const projectId of projects) {
      const financialAnalysis = await this.analyzeProjectFinancials(projectId);
      const strategicScore = await this.assessStrategicAlignment(projectId);
      const riskAssessment = await this.evaluateProjectRisk(projectId);
      const resourceAssessment = await this.assessResourceAvailability(projectId);
      
      const overallScore = (
        financialAnalysis.score * 0.35 +
        strategicScore * 0.25 +
        (100 - riskAssessment.score) * 0.25 + // Lower risk = higher score
        resourceAssessment.score * 0.15
      );
      
      projectEvaluations.push({
        projectId,
        scores: {
          financial: financialAnalysis.score,
          strategic: strategicScore,
          risk: riskAssessment.score,
          resource: resourceAssessment.score,
          overall: Math.round(overallScore)
        },
        details: {
          financialAnalysis,
          riskAssessment,
          resourceAssessment
        }
      });
    }
    
    // Sort by overall score (highest first)
    projectEvaluations.sort((a, b) => b.scores.overall - a.scores.overall);
    
    return {
      portfolioEvaluation: projectEvaluations,
      recommendations: this.generatePortfolioRecommendations(projectEvaluations),
      portfolioMetrics: this.calculatePortfolioMetrics(projectEvaluations)
    };
  }

  private async analyzeProjectFinancials(projectId: string): Promise<any> {
    const initialInvestment = 100000;
    const projectedCashFlows = [15000, 25000, 35000, 40000, 30000]; // 5 years
    const discountRate = 0.10;
    
    // Calculate NPV
    let npv = -initialInvestment;
    projectedCashFlows.forEach((cashFlow, year) => {
      npv += cashFlow / Math.pow(1 + discountRate, year + 1);
    });
    
    // Calculate IRR (simplified approximation)
    const totalCashFlow = projectedCashFlows.reduce((sum, cf) => sum + cf, 0);
    const irr = (totalCashFlow - initialInvestment) / initialInvestment / projectedCashFlows.length;
    
    // Calculate ROI
    const roi = (totalCashFlow - initialInvestment) / initialInvestment;
    
    // Calculate payback period
    let cumulativeCashFlow = 0;
    let paybackPeriod = 0;
    for (let i = 0; i < projectedCashFlows.length; i++) {
      cumulativeCashFlow += projectedCashFlows[i];
      if (cumulativeCashFlow >= initialInvestment) {
        paybackPeriod = i + 1 - (cumulativeCashFlow - initialInvestment) / projectedCashFlows[i];
        break;
      }
    }
    
    // Score based on financial metrics (0-100)
    let score = 0;
    if (npv > 0) score += 30;
    if (irr > 0.15) score += 25;
    if (roi > 0.20) score += 25;
    if (paybackPeriod < 3) score += 20;
    
    return {
      projectId,
      initialInvestment,
      npv: Math.round(npv),
      irr: Math.round(irr * 100) / 100,
      roi: Math.round(roi * 100) / 100,
      paybackPeriod: Math.round(paybackPeriod * 10) / 10,
      score: Math.min(100, score)
    };
  }

  private async assessStrategicAlignment(projectId: string): Promise<number> {
    // Strategic alignment assessment (0-100 score)
    const strategicCriteria = [
      { criterion: 'Market Opportunity', weight: 0.25, score: 85 },
      { criterion: 'Technology Innovation', weight: 0.20, score: 75 },
      { criterion: 'Competitive Advantage', weight: 0.20, score: 80 },
      { criterion: 'Customer Value', weight: 0.20, score: 90 },
      { criterion: 'Organizational Fit', weight: 0.15, score: 70 }
    ];
    
    const weightedScore = strategicCriteria.reduce((sum, item) => 
      sum + (item.score * item.weight), 0
    );
    
    return Math.round(weightedScore);
  }

  private async evaluateProjectRisk(projectId: string): Promise<any> {
    const riskCategories = [
      {
        category: 'Technical Risk',
        probability: 0.3, // 30% chance
        impact: 0.7, // 70% impact if occurs
        mitigation: 'Proof of concept development'
      },
      {
        category: 'Market Risk',
        probability: 0.4,
        impact: 0.8,
        mitigation: 'Market research and customer validation'
      },
      {
        category: 'Resource Risk',
        probability: 0.2,
        impact: 0.5,
        mitigation: 'Resource backup plan'
      },
      {
        category: 'Schedule Risk',
        probability: 0.5,
        impact: 0.6,
        mitigation: 'Agile methodology with regular checkpoints'
      }
    ];
    
    // Calculate overall risk score
    const overallRisk = riskCategories.reduce((sum, risk) => 
      sum + (risk.probability * risk.impact), 0
    ) / riskCategories.length;
    
    const riskScore = Math.round(overallRisk * 100);
    
    return {
      projectId,
      riskCategories,
      overallRiskLevel: riskScore > 50 ? 'HIGH' : riskScore > 25 ? 'MEDIUM' : 'LOW',
      score: riskScore,
      mitigationStrategies: riskCategories.map(r => r.mitigation)
    };
  }

  private async assessResourceAvailability(projectId: string): Promise<any> {
    const resourceRequirements = [
      { skill: 'Senior Developer', required: 2, available: 1.5, score: 75 },
      { skill: 'Business Analyst', required: 1, available: 1.2, score: 100 },
      { skill: 'UI/UX Designer', required: 1, available: 0.8, score: 80 },
      { skill: 'Project Manager', required: 1, available: 1.0, score: 100 }
    ];
    
    const averageScore = resourceRequirements.reduce((sum, req) => sum + req.score, 0) / resourceRequirements.length;
    
    return {
      projectId,
      resourceRequirements,
      overallAvailability: averageScore > 90 ? 'EXCELLENT' : averageScore > 75 ? 'GOOD' : averageScore > 50 ? 'ADEQUATE' : 'POOR',
      score: Math.round(averageScore),
      constraints: resourceRequirements.filter(req => req.score < 100).map(req => 
        `${req.skill}: Need ${req.required}, have ${req.available}`
      )
    };
  }

  async prioritizeProjects(projects: any[], constraints: {
    totalBudget: number;
    resourceConstraints: any[];
    strategicObjectives: string[];
  }): Promise<any> {
    const prioritizedProjects = projects
      .sort((a, b) => b.scores.overall - a.scores.overall)
      .map((project, index) => ({
        ...project,
        priority: index + 1,
        recommended: index < Math.ceil(projects.length * 0.6) // Top 60%
      }));
    
    const selectedProjects = this.optimizeProjectSelection(prioritizedProjects, constraints);
    
    return {
      totalProjects: projects.length,
      prioritizedProjects,
      selectedProjects,
      budgetUtilization: selectedProjects.reduce((sum: number, p: any) => sum + p.estimatedBudget, 0),
      unselectedProjects: prioritizedProjects.filter(p => !selectedProjects.includes(p)),
      portfolioBalance: this.analyzePortfolioBalance(selectedProjects)
    };
  }

  private optimizeProjectSelection(projects: any[], constraints: any): any[] {
    // Simplified optimization - select highest scoring projects within budget
    const selected = [];
    let remainingBudget = constraints.totalBudget;
    
    for (const project of projects) {
      const estimatedBudget = project.details?.financialAnalysis?.initialInvestment || 100000;
      if (remainingBudget >= estimatedBudget && selected.length < 5) { // Max 5 projects
        selected.push({
          ...project,
          estimatedBudget
        });
        remainingBudget -= estimatedBudget;
      }
    }
    
    return selected;
  }

  private analyzePortfolioBalance(selectedProjects: any[]): any {
    const riskDistribution = {
      low: selectedProjects.filter(p => p.details.riskAssessment.overallRiskLevel === 'LOW').length,
      medium: selectedProjects.filter(p => p.details.riskAssessment.overallRiskLevel === 'MEDIUM').length,
      high: selectedProjects.filter(p => p.details.riskAssessment.overallRiskLevel === 'HIGH').length
    };
    
    const averageROI = selectedProjects.reduce((sum, p) => 
      sum + (p.details?.financialAnalysis?.roi || 0), 0
    ) / selectedProjects.length;
    
    return {
      riskDistribution,
      averageROI: Math.round(averageROI * 100) / 100,
      totalProjects: selectedProjects.length,
      balanceScore: this.calculateBalanceScore(riskDistribution, averageROI)
    };
  }

  private calculateBalanceScore(riskDist: any, avgROI: number): number {
    // Balanced portfolio should have mix of risks and good ROI
    const riskBalance = Math.min(riskDist.low, riskDist.medium, riskDist.high) > 0 ? 25 : 0;
    const roiScore = avgROI > 0.25 ? 25 : avgROI > 0.15 ? 20 : 15;
    
    return riskBalance + roiScore;
  }

  private generatePortfolioRecommendations(evaluations: any[]): string[] {
    const recommendations = [];
    const highScoreProjects = evaluations.filter(e => e.scores.overall > 75).length;
    const lowScoreProjects = evaluations.filter(e => e.scores.overall < 50).length;
    
    if (highScoreProjects > 0) {
      recommendations.push(`Prioritize ${highScoreProjects} high-scoring projects for immediate execution`);
    }
    
    if (lowScoreProjects > 0) {
      recommendations.push(`Consider deferring or canceling ${lowScoreProjects} low-scoring projects`);
    }
    
    recommendations.push('Ensure portfolio balance across risk levels and strategic objectives');
    recommendations.push('Monitor resource constraints and adjust project timelines accordingly');
    
    return recommendations;
  }

  private calculatePortfolioMetrics(evaluations: any[]): any {
    const totalValue = evaluations.reduce((sum, e) => 
      sum + (e.details?.financialAnalysis?.initialInvestment || 0), 0);
    const averageScore = evaluations.reduce((sum, e) => sum + e.scores.overall, 0) / evaluations.length;
    
    return {
      totalProjects: evaluations.length,
      totalValue,
      averageOverallScore: Math.round(averageScore),
      riskProfile: this.calculateRiskProfile(evaluations),
      strategicAlignment: Math.round(evaluations.reduce((sum, e) => sum + e.scores.strategic, 0) / evaluations.length)
    };
  }

  private calculateRiskProfile(evaluations: any[]): any {
    const riskLevels = evaluations.map(e => e.details.riskAssessment.overallRiskLevel);
    return {
      high: riskLevels.filter(r => r === 'HIGH').length,
      medium: riskLevels.filter(r => r === 'MEDIUM').length,
      low: riskLevels.filter(r => r === 'LOW').length
    };
  }

  async generatePortfolioReport(portfolioId: string): Promise<any> {
    const projects = ['proj_001', 'proj_002', 'proj_003']; // Mock project IDs
    const evaluation = await this.evaluateProjectPortfolio(projects);
    
    return {
      portfolioId,
      reportDate: new Date(),
      summary: evaluation.portfolioMetrics,
      topProjects: evaluation.portfolioEvaluation.slice(0, 3),
      recommendations: evaluation.recommendations,
      riskAnalysis: this.calculateRiskProfile(evaluation.portfolioEvaluation),
      generatedBy: 'Portfolio Analytics Engine'
    };
  }
}

// Export singleton instance
export const projectPortfolioService = new ProjectPortfolioService();