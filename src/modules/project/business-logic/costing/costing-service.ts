/**
 * Project Costing Business Logic
 * Handles activity-based costing, cost tracking, and expenditure analysis
 */

import type { ProjectBudget } from '../types';

export class ProjectCostingService {
  
  async implementActivityBasedCosting(projectId: string): Promise<any> {
    // Activity-based costing allocates costs based on activities and their cost drivers
    const activities = [
      {
        activityId: 'act_001',
        name: 'Requirements Analysis',
        costDriver: 'analysis_hours',
        costDriverQuantity: 40,
        costPerUnit: 120,
        totalCost: 4800,
        resources: ['business_analyst', 'senior_developer']
      },
      {
        activityId: 'act_002',
        name: 'System Design',
        costDriver: 'design_hours',
        costDriverQuantity: 60,
        costPerUnit: 150,
        totalCost: 9000,
        resources: ['architect', 'senior_developer']
      },
      {
        activityId: 'act_003',
        name: 'Development',
        costDriver: 'development_hours',
        costDriverQuantity: 200,
        costPerUnit: 100,
        totalCost: 20000,
        resources: ['developer', 'junior_developer']
      },
      {
        activityId: 'act_004',
        name: 'Testing',
        costDriver: 'testing_hours',
        costDriverQuantity: 80,
        costPerUnit: 90,
        totalCost: 7200,
        resources: ['qa_engineer', 'test_automation']
      }
    ];
    
    const totalProjectCost = activities.reduce((sum, activity) => sum + activity.totalCost, 0);
    
    return {
      projectId,
      costingMethod: 'Activity-Based Costing',
      activities,
      totalCost: totalProjectCost,
      costBreakdown: {
        directLabor: totalProjectCost * 0.75,
        overhead: totalProjectCost * 0.15,
        materials: totalProjectCost * 0.10
      },
      costPerformanceMetrics: {
        costPerHour: totalProjectCost / activities.reduce((sum, act) => sum + act.costDriverQuantity, 0),
        efficiencyRatio: 0.92 // Actual vs planned efficiency
      }
    };
  }

  async trackProjectBasedCosts(projectId: string): Promise<any> {
    const costCategories = [
      {
        category: 'LABOR',
        budgeted: 50000,
        actual: 47500,
        committed: 52000,
        variance: -2500,
        variancePercentage: -5.0
      },
      {
        category: 'MATERIALS',
        budgeted: 15000,
        actual: 16200,
        committed: 15800,
        variance: 1200,
        variancePercentage: 8.0
      },
      {
        category: 'EQUIPMENT',
        budgeted: 8000,
        actual: 7800,
        committed: 8000,
        variance: -200,
        variancePercentage: -2.5
      },
      {
        category: 'TRAVEL',
        budgeted: 5000,
        actual: 4200,
        committed: 4500,
        variance: -800,
        variancePercentage: -16.0
      }
    ];
    
    const totalBudgeted = costCategories.reduce((sum, cat) => sum + cat.budgeted, 0);
    const totalActual = costCategories.reduce((sum, cat) => sum + cat.actual, 0);
    const totalVariance = totalActual - totalBudgeted;
    
    return {
      projectId,
      costTrackingDate: new Date(),
      costCategories,
      summary: {
        totalBudgeted,
        totalActual,
        totalCommitted: costCategories.reduce((sum, cat) => sum + cat.committed, 0),
        totalVariance,
        variancePercentage: (totalVariance / totalBudgeted) * 100,
        costPerformanceIndex: totalBudgeted / totalActual
      },
      alerts: this.generateCostAlerts(costCategories)
    };
  }

  private generateCostAlerts(costCategories: any[]): any[] {
    const alerts = [];
    
    for (const category of costCategories) {
      if (Math.abs(category.variancePercentage) > 10) {
        alerts.push({
          type: category.variancePercentage > 0 ? 'OVER_BUDGET' : 'UNDER_BUDGET',
          category: category.category,
          variancePercentage: category.variancePercentage,
          message: `${category.category} is ${Math.abs(category.variancePercentage).toFixed(1)}% ${
            category.variancePercentage > 0 ? 'over' : 'under'
          } budget`
        });
      }
    }
    
    return alerts;
  }

  async analyzeExpenditureVsForecast(projectId: string): Promise<any> {
    const monthlyData = [];
    const startDate = new Date(2024, 0, 1); // January 2024
    
    for (let i = 0; i < 12; i++) {
      const month = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      const forecasted = 10000 + (Math.random() * 2000 - 1000); // Base forecast with variation
      const actual = forecasted + (Math.random() * 4000 - 2000); // Actual with variance
      
      monthlyData.push({
        month: month.toISOString().substring(0, 7),
        forecasted: Math.round(forecasted),
        actual: Math.round(actual),
        variance: Math.round(actual - forecasted),
        variancePercentage: ((actual - forecasted) / forecasted * 100).toFixed(1)
      });
    }
    
    const totalForecasted = monthlyData.reduce((sum, item) => sum + item.forecasted, 0);
    const totalActual = monthlyData.reduce((sum, item) => sum + item.actual, 0);
    
    return {
      projectId,
      analysisType: 'Expenditure vs Forecast Analysis',
      monthlyData,
      summary: {
        totalForecasted,
        totalActual,
        totalVariance: totalActual - totalForecasted,
        forecastAccuracy: (1 - Math.abs(totalActual - totalForecasted) / totalForecasted) * 100,
        trendAnalysis: this.analyzeCostTrend(monthlyData)
      }
    };
  }

  private analyzeCostTrend(monthlyData: any[]): string {
    const recentMonths = monthlyData.slice(-3);
    const averageVariance = recentMonths.reduce((sum, item) => sum + parseFloat(item.variancePercentage), 0) / 3;
    
    if (averageVariance > 5) return 'OVER_BUDGET_TREND';
    if (averageVariance < -5) return 'UNDER_BUDGET_TREND';
    return 'ON_TRACK';
  }

  async trackProgressAndProfitability(projectId: string): Promise<any> {
    const currentProgress = await this.calculateProjectProgress(projectId);
    const budgetUtilization = 0.68; // 68% of budget used
    const timeElapsed = 0.75; // 75% of project timeline elapsed
    
    const performanceIndicators = {
      schedulePerformanceIndex: currentProgress / (timeElapsed * 100), // SPI
      costPerformanceIndex: (currentProgress / 100) / budgetUtilization, // CPI
      estimateAtCompletion: 100000 / (currentProgress / 100), // EAC
      estimateToComplete: (100000 / (currentProgress / 100)) - (100000 * budgetUtilization) // ETC
    };
    
    return {
      projectId,
      progressTracking: {
        currentProgress,
        budgetUtilization,
        timeElapsed,
        performanceIndicators
      },
      profitabilityTracking: {
        riskFactors: this.assessProfitabilityRisk(performanceIndicators)
      },
      recommendations: this.generateCostRecommendations(performanceIndicators)
    };
  }

  private assessProfitabilityRisk(indicators: any): string[] {
    const risks = [];
    
    if (indicators.costPerformanceIndex < 0.9) {
      risks.push('Cost overrun risk - CPI below 0.9');
    }
    
    if (indicators.schedulePerformanceIndex < 0.9) {
      risks.push('Schedule delay risk - SPI below 0.9');
    }
    
    if (indicators.estimateAtCompletion > 110000) {
      risks.push('Budget overrun risk - EAC exceeds approved budget');
    }
    
    return risks;
  }

  private generateCostRecommendations(indicators: any): string[] {
    const recommendations = [];
    
    if (indicators.costPerformanceIndex < 1.0) {
      recommendations.push('Review cost control measures and identify cost-saving opportunities');
    }
    
    if (indicators.schedulePerformanceIndex < 1.0) {
      recommendations.push('Consider resource reallocation to accelerate critical path activities');
    }
    
    recommendations.push('Monitor cost trends weekly and adjust forecasts accordingly');
    
    return recommendations;
  }

  async calculateProjectProgress(projectId: string): Promise<number> {
    // Would calculate based on completed tasks/milestones
    return 72; // 72% complete
  }

  async getCostCategoryBreakdown(projectId: string): Promise<any> {
    const costData = await this.trackProjectBasedCosts(projectId);
    return {
      projectId,
      breakdown: costData.costCategories,
      totalCosts: costData.summary.totalActual,
      largestCategory: costData.costCategories.reduce((max, cat) => 
        cat.actual > max.actual ? cat : max, costData.costCategories[0]),
      generatedAt: new Date()
    };
  }

  async updateCostCategory(
    projectId: string,
    category: ProjectBudget['category'],
    actualAmount: number
  ): Promise<void> {
    // Would update cost category in database
    console.log(`Updated ${category} cost for project ${projectId}: $${actualAmount}`);
  }

  async generateCostForecast(projectId: string, periodMonths: number = 6): Promise<any> {
    const currentCosts = await this.trackProjectBasedCosts(projectId);
    const monthlyBurn = currentCosts.summary.totalActual / 6; // Assuming 6 months elapsed
    
    const forecast = [];
    for (let i = 1; i <= periodMonths; i++) {
      const month = new Date();
      month.setMonth(month.getMonth() + i);
      forecast.push({
        month: month.toISOString().substring(0, 7),
        forecastedCost: Math.round(monthlyBurn * (1 + Math.random() * 0.1)), // +/-10% variation
        cumulativeCost: Math.round(currentCosts.summary.totalActual + (monthlyBurn * i))
      });
    }
    
    return {
      projectId,
      forecastPeriod: `${periodMonths} months`,
      monthlyBurnRate: Math.round(monthlyBurn),
      forecast,
      generatedAt: new Date()
    };
  }
}

// Export singleton instance
export const projectCostingService = new ProjectCostingService();