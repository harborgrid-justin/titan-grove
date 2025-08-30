/**
 * Shared Recommendation Generation Utilities
 * Common patterns for generating recommendations across modules
 */

import { Priority, RiskLevel } from '../../types/common';

export interface BaseRecommendationCriteria {
  performance: number;
  target: number;
  threshold: number;
}

export interface RecommendationContext {
  entityType: string;
  entityId: string;
  priority: Priority;
  riskLevel?: RiskLevel;
  metadata?: Record<string, any>;
}

/**
 * Base class for recommendation generators
 */
export abstract class BaseRecommendationGenerator<T extends BaseRecommendationCriteria> {
  
  protected generatePerformanceRecommendations(
    criteria: T,
    context: RecommendationContext
  ): string[] {
    const recommendations: string[] = [];
    const performanceRatio = criteria.performance / criteria.target;
    
    if (performanceRatio < criteria.threshold) {
      recommendations.push(this.getUnderperformanceRecommendation(performanceRatio, context));
      
      if (performanceRatio < 0.5) {
        recommendations.push(this.getCriticalActionRecommendation(context));
      }
    } else if (performanceRatio > 1.2) {
      recommendations.push(this.getOverperformanceRecommendation(context));
    }
    
    return recommendations;
  }
  
  protected abstract getUnderperformanceRecommendation(ratio: number, context: RecommendationContext): string;
  protected abstract getCriticalActionRecommendation(context: RecommendationContext): string;
  protected abstract getOverperformanceRecommendation(context: RecommendationContext): string;
  
  protected prioritizeRecommendations<T extends { priority: Priority }>(
    recommendations: T[]
  ): T[] {
    const priorityOrder = {
      [Priority.CRITICAL]: 0,
      [Priority.HIGH]: 1, 
      [Priority.MEDIUM]: 2,
      [Priority.LOW]: 3
    };
    
    return recommendations.sort((a, b) => 
      priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  }
}

/**
 * Generic recommendation utility functions
 */
export class RecommendationUtils {
  
  static generateResourceRecommendations(
    utilization: number,
    capacity: number,
    optimalRange: { min: number; max: number }
  ): string[] {
    const recommendations: string[] = [];
    const utilizationRate = utilization / capacity;
    
    if (utilizationRate < optimalRange.min) {
      recommendations.push('Increase resource assignments or consider resource reallocation');
      recommendations.push('Review capacity planning and optimize resource distribution');
    } else if (utilizationRate > optimalRange.max) {
      recommendations.push('Reduce workload to prevent overutilization');
      recommendations.push('Consider adding additional resources or extending timelines');
    }
    
    return recommendations;
  }
  
  static generateCostVarianceRecommendations(
    actualCost: number,
    budgetedCost: number,
    varianceThreshold: number = 0.1
  ): string[] {
    const recommendations: string[] = [];
    const variance = Math.abs(actualCost - budgetedCost) / budgetedCost;
    
    if (variance > varianceThreshold) {
      if (actualCost > budgetedCost) {
        recommendations.push('Implement cost control measures to address budget overrun');
        recommendations.push('Review spending patterns and identify cost optimization opportunities');
      } else {
        recommendations.push('Analyze underspend to identify potential budget reallocation opportunities');
      }
    }
    
    return recommendations;
  }
  
  static generateQualityRecommendations(
    qualityScore: number,
    targetScore: number,
    defectRate: number,
    maxDefectRate: number = 0.05
  ): string[] {
    const recommendations: string[] = [];
    
    if (qualityScore < targetScore) {
      recommendations.push('Improve quality processes and implement additional quality checks');
      recommendations.push('Provide additional training to improve quality outcomes');
    }
    
    if (defectRate > maxDefectRate) {
      recommendations.push('Investigate root causes of defects and implement corrective actions');
      recommendations.push('Review and strengthen quality assurance procedures');
    }
    
    return recommendations;
  }
}