/**
 * Project-specific recommendation generator
 * Extends base recommendation generator for project management use cases
 */

import { Priority, RiskLevel } from '../../../types/common';
import { 
  BaseRecommendationGenerator, 
  BaseRecommendationCriteria, 
  RecommendationContext,
  RecommendationUtils
} from '../../../shared/utils/recommendation-generator';

export interface ProjectRecommendationCriteria extends BaseRecommendationCriteria {
  projectType?: string;
  budgetStatus?: 'ON_BUDGET' | 'OVER_BUDGET' | 'UNDER_BUDGET';
  scheduleStatus?: 'ON_SCHEDULE' | 'DELAYED' | 'AHEAD_OF_SCHEDULE';
}

export class ProjectRecommendationGenerator extends BaseRecommendationGenerator<ProjectRecommendationCriteria> {
  
  protected getUnderperformanceRecommendation(ratio: number, context: RecommendationContext): string {
    const baseRecommendation = context.entityType === 'PROJECT' 
      ? 'Review project execution and resource allocation'
      : 'Analyze performance gaps and implement corrective measures';
      
    if (ratio < 0.5) {
      return `${baseRecommendation} - Performance significantly below target (${Math.round(ratio * 100)}%)`;
    }
    
    return `${baseRecommendation} - Performance below target (${Math.round(ratio * 100)}%)`;
  }
  
  protected getCriticalActionRecommendation(context: RecommendationContext): string {
    switch (context.entityType) {
      case 'PROJECT':
        return 'Consider project restructuring or additional resources - Critical performance gap detected';
      case 'RESOURCE':
        return 'Immediate intervention required - Provide additional training or support';
      case 'PORTFOLIO':
        return 'Portfolio rebalancing needed - Consider deferring or canceling low-performing projects';
      default:
        return 'Immediate corrective action required';
    }
  }
  
  protected getOverperformanceRecommendation(context: RecommendationContext): string {
    return 'Performance exceeds target - Consider optimizing resources or raising targets';
  }
  
  /**
   * Generate project performance recommendations
   */
  generateProjectPerformanceRecommendations(
    productivity: number,
    satisfaction: number,
    utilization: number
  ): string[] {
    const recommendations: string[] = [];
    
    if (productivity < 75) {
      recommendations.push('Provide additional training or mentoring');
      recommendations.push('Review task complexity and assignment suitability');
    }
    
    if (satisfaction < 75) {
      recommendations.push('Conduct one-on-one feedback session');
      recommendations.push('Review workload and work-life balance');
    }
    
    if (utilization < 0.7) {
      recommendations.push('Increase project assignments');
      recommendations.push('Consider cross-training for additional skills');
    } else if (utilization > 0.95) {
      recommendations.push('Reduce workload to prevent burnout');
      recommendations.push('Redistribute some responsibilities');
    }
    
    return recommendations;
  }
  
  /**
   * Generate portfolio recommendations
   */
  generatePortfolioRecommendations(evaluations: Array<{ scores: { overall: number }}>): string[] {
    const recommendations: string[] = [];
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
  
  /**
   * Generate forecast recommendations based on SPI and CPI
   */
  generateForecastRecommendations(spi: number, cpi: number): string[] {
    const recommendations: string[] = [];
    
    if (spi < 1.0) {
      recommendations.push('Accelerate critical path activities');
      recommendations.push('Consider adding resources to delayed tasks');
    }
    
    if (cpi < 1.0) {
      recommendations.push('Implement cost control measures');
      recommendations.push('Review scope to identify potential reductions');
    }
    
    return recommendations;
  }
  
  /**
   * Generate cost-related recommendations
   */
  generateCostRecommendations(indicators: { 
    costPerformanceIndex: number; 
    schedulePerformanceIndex: number;
  }): string[] {
    // Use the shared utility for cost variance recommendations
    const costRecommendations = RecommendationUtils.generateCostVarianceRecommendations(
      indicators.costPerformanceIndex < 1.0 ? 110 : 90, // Simulated actual vs budget
      100,
      0.1
    );
    
    const scheduleRecommendations: string[] = [];
    if (indicators.schedulePerformanceIndex < 1.0) {
      scheduleRecommendations.push('Accelerate critical path activities');
      scheduleRecommendations.push('Consider additional resources for delayed tasks');
    }
    
    return [...costRecommendations, ...scheduleRecommendations];
  }
}