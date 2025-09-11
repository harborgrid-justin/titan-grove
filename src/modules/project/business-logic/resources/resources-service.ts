/**
 * Project Resources Business Logic
 * Handles resource optimization, capacity planning, and performance management
 */

import type { ResourceCapacity, ResourceSkill, ResourceAllocation } from '../../types';

export class ProjectResourcesService {
  async optimizeResourceUtilization(timeframe: { startDate: Date; endDate: Date }): Promise<any> {
    const resources = await this.getResourceCapacityData(timeframe);
    const projects = await this.getActiveProjectsInTimeframe(timeframe);

    // Calculate current utilization
    const utilizationData = resources.map((resource) => {
      const totalAllocatedHours = this.calculateAllocatedHours(resource.id, timeframe);
      const utilizationPercentage = (totalAllocatedHours / resource.totalCapacity) * 100;

      return {
        resourceId: resource.id,
        name: resource.name,
        skill: resource.primarySkill,
        totalCapacity: resource.totalCapacity,
        allocatedHours: totalAllocatedHours,
        availableHours: resource.totalCapacity - totalAllocatedHours,
        utilizationPercentage: Math.round(utilizationPercentage),
        status: this.determineUtilizationStatus(utilizationPercentage),
      };
    });

    // Identify optimization opportunities
    const underutilized = utilizationData.filter((r) => r.utilizationPercentage < 70);
    const overutilized = utilizationData.filter((r) => r.utilizationPercentage > 95);
    const optimal = utilizationData.filter(
      (r) => r.utilizationPercentage >= 70 && r.utilizationPercentage <= 95
    );

    return {
      timeframe,
      resourceUtilization: utilizationData,
      summary: {
        totalResources: resources.length,
        averageUtilization: Math.round(
          utilizationData.reduce((sum, r) => sum + r.utilizationPercentage, 0) /
            utilizationData.length
        ),
        underutilized: underutilized.length,
        overutilized: overutilized.length,
        optimal: optimal.length,
      },
      optimizationOpportunities: this.generateOptimizationRecommendations(
        underutilized,
        overutilized
      ),
      rebalancingStrategies: await this.generateRebalancingStrategies(underutilized, overutilized),
    };
  }

  private async getResourceCapacityData(timeframe: any): Promise<any[]> {
    // Mock data - in real implementation would fetch from database
    return [
      {
        id: 'res_001',
        name: 'John Smith',
        primarySkill: 'Senior Developer',
        totalCapacity: 160, // hours per month
        hourlyRate: 150,
        location: 'New York',
      },
      {
        id: 'res_002',
        name: 'Jane Doe',
        primarySkill: 'Business Analyst',
        totalCapacity: 160,
        hourlyRate: 120,
        location: 'Remote',
      },
      {
        id: 'res_003',
        name: 'Mike Johnson',
        primarySkill: 'UI/UX Designer',
        totalCapacity: 160,
        hourlyRate: 100,
        location: 'San Francisco',
      },
    ];
  }

  private async getActiveProjectsInTimeframe(timeframe: any): Promise<string[]> {
    return ['proj_001', 'proj_002', 'proj_003'];
  }

  private calculateAllocatedHours(resourceId: string, timeframe: any): number {
    // Mock calculation - in real implementation would query allocations
    const allocations = {
      res_001: 152, // 95% utilized
      res_002: 96, // 60% utilized
      res_003: 128, // 80% utilized
    };
    return allocations[resourceId as keyof typeof allocations] || 80;
  }

  private determineUtilizationStatus(percentage: number): string {
    if (percentage < 70) return 'UNDERUTILIZED';
    if (percentage > 95) return 'OVERUTILIZED';
    return 'OPTIMAL';
  }

  private generateOptimizationRecommendations(underutilized: any[], overutilized: any[]): string[] {
    const recommendations = [];

    if (underutilized.length > 0) {
      recommendations.push(
        `${underutilized.length} resources are underutilized - consider additional project assignments`
      );
      underutilized.forEach((resource) => {
        recommendations.push(
          `Assign ${resource.availableHours} additional hours to ${resource.name} (${resource.skill})`
        );
      });
    }

    if (overutilized.length > 0) {
      recommendations.push(
        `${overutilized.length} resources are overutilized - redistribute workload to prevent burnout`
      );
      overutilized.forEach((resource) => {
        const excessHours = resource.allocatedHours - resource.totalCapacity * 0.95;
        recommendations.push(
          `Reduce ${resource.name}'s allocation by ${Math.round(excessHours)} hours`
        );
      });
    }

    return recommendations;
  }

  private async generateRebalancingStrategies(
    underutilized: any[],
    overutilized: any[]
  ): Promise<any[]> {
    const strategies = [];

    // Strategy 1: Direct reallocation
    for (const overRes of overutilized) {
      for (const underRes of underutilized) {
        if (this.skillsMatch(overRes.skill, underRes.skill)) {
          const transferHours = Math.min(
            overRes.allocatedHours - overRes.totalCapacity * 0.95,
            underRes.availableHours
          );

          if (transferHours > 0) {
            strategies.push({
              type: 'DIRECT_REALLOCATION',
              fromResource: overRes.name,
              toResource: underRes.name,
              hours: Math.round(transferHours),
              description: `Transfer ${Math.round(transferHours)} hours from ${overRes.name} to ${underRes.name}`,
            });
          }
        }
      }
    }

    // Strategy 2: Resource pooling
    if (underutilized.length > 1) {
      strategies.push({
        type: 'RESOURCE_POOLING',
        resources: underutilized.map((r) => r.name),
        availableHours: underutilized.reduce((sum, r) => sum + r.availableHours, 0),
        description: 'Create shared resource pool for new project assignments',
      });
    }

    return strategies;
  }

  private skillsMatch(skill1: string, skill2: string): boolean {
    // Simplified skill matching - in real implementation would be more sophisticated
    const skillGroups = [
      ['Senior Developer', 'Developer', 'Junior Developer'],
      ['Business Analyst', 'System Analyst'],
      ['UI/UX Designer', 'Graphic Designer'],
    ];

    return skillGroups.some((group) => group.includes(skill1) && group.includes(skill2));
  }

  async planResourceCapacity(planningHorizon: { months: number }): Promise<any> {
    const currentDate = new Date();
    const capacityPlan = [];

    for (let i = 0; i < planningHorizon.months; i++) {
      const month = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const monthStr = month.toISOString().substring(0, 7);

      const projectedDemand = await this.projectResourceDemand(month);
      const availableCapacity = await this.calculateAvailableCapacity(month);
      const gap = projectedDemand.totalHours - availableCapacity.totalHours;

      capacityPlan.push({
        month: monthStr,
        demand: projectedDemand,
        supply: availableCapacity,
        gap: gap,
        gapPercentage: Math.round((gap / projectedDemand.totalHours) * 100),
        recommendations: this.generateCapacityRecommendations(gap, month),
      });
    }

    return {
      planningHorizon,
      capacityPlan,
      summary: {
        averageUtilization: Math.round(
          capacityPlan.reduce(
            (sum, plan) => sum + (plan.supply.totalHours / plan.demand.totalHours) * 100,
            0
          ) / capacityPlan.length
        ),
        criticalMonths: capacityPlan.filter((plan) => Math.abs(plan.gapPercentage) > 20).length,
        totalGap: capacityPlan.reduce((sum, plan) => sum + Math.abs(plan.gap), 0),
      },
    };
  }

  private async projectResourceDemand(month: Date): Promise<any> {
    // Project resource demand for the month
    const baselineHours = 2000; // Base monthly demand
    const seasonalFactor = Math.sin((month.getMonth() / 12) * 2 * Math.PI) * 0.2 + 1; // Seasonal variation
    const totalHours = Math.round(baselineHours * seasonalFactor);

    return {
      totalHours,
      bySkill: {
        'Senior Developer': Math.round(totalHours * 0.3),
        Developer: Math.round(totalHours * 0.4),
        'Business Analyst': Math.round(totalHours * 0.15),
        'UI/UX Designer': Math.round(totalHours * 0.15),
      },
    };
  }

  private async calculateAvailableCapacity(month: Date): Promise<any> {
    const workingDaysInMonth = 22; // Average working days
    const hoursPerDay = 8;
    const resourceCount = {
      'Senior Developer': 3,
      Developer: 5,
      'Business Analyst': 2,
      'UI/UX Designer': 2,
    };

    const totalHours =
      Object.values(resourceCount).reduce((sum, count) => sum + count, 0) *
      workingDaysInMonth *
      hoursPerDay;

    return {
      totalHours,
      bySkill: Object.entries(resourceCount).reduce((acc, [skill, count]) => {
        acc[skill] = count * workingDaysInMonth * hoursPerDay;
        return acc;
      }, {} as any),
    };
  }

  private generateCapacityRecommendations(gap: number, month: Date): string[] {
    const recommendations = [];

    if (gap > 0) {
      // Demand exceeds supply
      recommendations.push('Consider hiring additional resources');
      recommendations.push('Evaluate contractor/freelancer options');
      recommendations.push('Prioritize projects and defer non-critical work');
    } else if (gap < -200) {
      // Significant oversupply
      recommendations.push('Opportunity for additional project work');
      recommendations.push('Consider training/upskilling initiatives');
      recommendations.push('Evaluate resource reallocation to other projects');
    }

    return recommendations;
  }

  async measureResourcePerformance(): Promise<any> {
    const resources = await this.getResourceCapacityData({
      startDate: new Date(),
      endDate: new Date(),
    });

    const performanceMetrics = resources.map((resource) => {
      const productivity = this.calculateProductivity(resource.id);
      const satisfaction = this.getResourceSatisfaction(resource.id);
      const utilization = this.calculateAllocatedHours(resource.id, {}) / resource.totalCapacity;

      return {
        resourceId: resource.id,
        name: resource.name,
        skill: resource.primarySkill,
        productivity: productivity,
        satisfaction: satisfaction,
        utilization: Math.round(utilization * 100),
        overallPerformance: Math.round((productivity + satisfaction + utilization * 100) / 3),
        recommendations: this.generatePerformanceRecommendations(
          productivity,
          satisfaction,
          utilization
        ),
      };
    });

    return {
      resourcePerformance: performanceMetrics,
      summary: {
        averageProductivity: Math.round(
          performanceMetrics.reduce((sum, r) => sum + r.productivity, 0) / performanceMetrics.length
        ),
        averageSatisfaction: Math.round(
          performanceMetrics.reduce((sum, r) => sum + r.satisfaction, 0) / performanceMetrics.length
        ),
        highPerformers: performanceMetrics.filter((r) => r.overallPerformance > 85).length,
      },
    };
  }

  private calculateProductivity(resourceId: string): number {
    // Mock productivity calculation - in real implementation would be based on actual metrics
    return Math.round(75 + Math.random() * 20); // 75-95% productivity
  }

  private getResourceSatisfaction(resourceId: string): number {
    // Mock satisfaction score - in real implementation would be from surveys/feedback
    return Math.round(70 + Math.random() * 25); // 70-95% satisfaction
  }

  private generatePerformanceRecommendations(
    productivity: number,
    satisfaction: number,
    utilization: number
  ): string[] {
    const recommendations = [];

    if (productivity < 80) {
      recommendations.push('Consider additional training or mentoring');
    }

    if (satisfaction < 75) {
      recommendations.push('Schedule one-on-one to discuss concerns and career development');
    }

    if (utilization > 0.95) {
      recommendations.push('Monitor workload to prevent burnout');
    } else if (utilization < 0.7) {
      recommendations.push('Identify opportunities for additional project assignments');
    }

    return recommendations;
  }

  async getResourceSkillMatrix(): Promise<any> {
    const resources = await this.getResourceCapacityData({});

    return {
      skillMatrix: resources.map((resource) => ({
        resourceId: resource.id,
        name: resource.name,
        primarySkill: resource.primarySkill,
        secondarySkills: this.getSecondarySkills(resource.id),
        proficiencyLevel: this.getProficiencyLevel(resource.id),
        certifications: this.getCertifications(resource.id),
        trainingNeeds: this.identifyTrainingNeeds(resource.id),
      })),
      skillGaps: this.identifySkillGaps(),
      trainingPriorities: this.prioritizeTraining(),
    };
  }

  private getSecondarySkills(resourceId: string): string[] {
    // Mock secondary skills
    const skillSets = {
      res_001: ['JavaScript', 'Python', 'Cloud Architecture'],
      res_002: ['SQL', 'Data Analysis', 'Process Modeling'],
      res_003: ['Figma', 'Adobe Creative Suite', 'User Research'],
    };
    return skillSets[resourceId as keyof typeof skillSets] || [];
  }

  private getProficiencyLevel(resourceId: string): Record<string, string> {
    return {
      'Primary Skill': 'EXPERT',
      'Secondary Skills': 'INTERMEDIATE',
    };
  }

  private getCertifications(resourceId: string): string[] {
    return ['Professional Certification', 'Industry Standard Certification'];
  }

  private identifyTrainingNeeds(resourceId: string): string[] {
    return ['New Technology Training', 'Leadership Development'];
  }

  private identifySkillGaps(): string[] {
    return ['DevOps expertise', 'AI/ML knowledge', 'Cloud security'];
  }

  private prioritizeTraining(): string[] {
    return ['Cloud computing fundamentals', 'Agile project management', 'Advanced analytics'];
  }
}

// Export singleton instance
export const projectResourcesService = new ProjectResourcesService();
