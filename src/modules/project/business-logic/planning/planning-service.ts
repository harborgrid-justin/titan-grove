/**
 * Project Planning Business Logic
 * Handles work planning, resource assignment, forecasting, and stakeholder communication
 */

import type { ResourceAllocation } from '../../types';

export class ProjectPlanningService {
  async planProjectWork(projectId: string): Promise<any> {
    // Work Breakdown Structure (WBS) planning
    const workPackages = [
      {
        id: 'wp_001',
        name: 'Project Initiation',
        level: 1,
        parentId: null,
        estimatedHours: 40,
        dependencies: [],
        milestones: ['Project Charter Approved'],
      },
      {
        id: 'wp_002',
        name: 'Requirements Analysis',
        level: 1,
        parentId: null,
        estimatedHours: 120,
        dependencies: ['wp_001'],
        milestones: ['Requirements Document Approved'],
      },
      {
        id: 'wp_003',
        name: 'System Design',
        level: 1,
        parentId: null,
        estimatedHours: 160,
        dependencies: ['wp_002'],
        milestones: ['Design Review Complete'],
      },
      {
        id: 'wp_004',
        name: 'Development',
        level: 1,
        parentId: null,
        estimatedHours: 400,
        dependencies: ['wp_003'],
        milestones: ['Code Complete', 'Unit Tests Pass'],
      },
    ];

    const totalEstimatedHours = workPackages.reduce((sum, wp) => sum + wp.estimatedHours, 0);
    const criticalPath = await this.calculateCriticalPath(projectId);

    return {
      projectId,
      workBreakdownStructure: workPackages,
      totalEstimatedHours,
      criticalPath,
      plannedDuration: Math.ceil(totalEstimatedHours / 40), // weeks assuming 40 hours/week
      resourceRequirements: await this.calculateResourceRequirements(workPackages),
    };
  }

  private async calculateResourceRequirements(workPackages: any[]): Promise<any> {
    const skillRequirements = {
      'Business Analyst': 80,
      'Solution Architect': 100,
      'Senior Developer': 200,
      Developer: 300,
      'QA Engineer': 120,
      'Project Manager': 40,
    };

    return {
      skillRequirements,
      totalResourceHours: Object.values(skillRequirements).reduce((sum, hours) => sum + hours, 0),
      peakResourcePeriod: 'Month 3-4',
      resourceConstraints: [
        'Limited Senior Developer availability',
        'QA Engineer needed part-time',
      ],
    };
  }

  async assignProjectResources(projectId: string, assignments: ResourceAllocation[]): Promise<any> {
    const resourceAssignments = [];
    const conflicts = [];

    for (const assignment of assignments) {
      const availability = await this.checkResourceAvailability(
        assignment.resourceId,
        assignment.startDate,
        assignment.endDate
      );

      if (availability >= assignment.allocationPercentage) {
        resourceAssignments.push({
          ...assignment,
          status: 'ASSIGNED',
          confirmedDate: new Date(),
        });
      } else {
        conflicts.push({
          ...assignment,
          status: 'CONFLICT',
          availablePercentage: availability,
          requestedPercentage: assignment.allocationPercentage,
        });
      }
    }

    return {
      projectId,
      successfulAssignments: resourceAssignments,
      conflicts,
      resourceUtilization: await this.calculateProjectResourceUtilization(projectId),
      recommendations: this.generateResourceRecommendations(conflicts),
    };
  }

  private async calculateProjectResourceUtilization(projectId: string): Promise<any> {
    return {
      averageUtilization: 82,
      byResource: [
        { resourceId: 'res_001', name: 'John Smith', utilization: 95, role: 'Senior Developer' },
        { resourceId: 'res_002', name: 'Jane Doe', utilization: 75, role: 'Business Analyst' },
      ],
      overallocated: ['res_001'],
      underutilized: ['res_002'],
    };
  }

  private generateResourceRecommendations(conflicts: any[]): string[] {
    const recommendations = [];

    if (conflicts.length > 0) {
      recommendations.push('Consider adjusting project timeline to resolve resource conflicts');
      recommendations.push('Evaluate alternative resources with similar skill sets');
      recommendations.push('Implement resource leveling to smooth allocation peaks');
    }

    return recommendations;
  }

  async forecastToCompletion(projectId: string): Promise<any> {
    const currentProgress = await this.calculateProjectProgress(projectId);
    const currentDate = new Date();
    const projectStartDate = new Date(currentDate.getTime() - 60 * 24 * 60 * 60 * 1000); // 60 days ago
    const daysElapsed = Math.floor(
      (currentDate.getTime() - projectStartDate.getTime()) / (24 * 60 * 60 * 1000)
    );

    // Calculate forecasting metrics
    const schedulePerformanceIndex = currentProgress / ((daysElapsed / 90) * 100); // Assuming 90-day project
    const forecastDuration = 90 / schedulePerformanceIndex;
    const remainingDays = forecastDuration - daysElapsed;

    const estimatedCompletionDate = new Date(
      currentDate.getTime() + remainingDays * 24 * 60 * 60 * 1000
    );

    // Cost forecasting
    const budgetSpent = 0.68; // 68% of budget spent
    const costPerformanceIndex = currentProgress / 100 / budgetSpent;
    const estimatedTotalCost = 100000 / costPerformanceIndex;

    return {
      projectId,
      forecastingDate: currentDate,
      currentProgress,
      scheduleForecasting: {
        schedulePerformanceIndex,
        estimatedCompletionDate,
        varianceInDays: remainingDays - (90 - daysElapsed),
        confidence: this.calculateForecastConfidence(schedulePerformanceIndex),
      },
      costForecasting: {
        costPerformanceIndex,
        estimatedTotalCost,
        budgetVariance: estimatedTotalCost - 100000,
        remainingBudget: estimatedTotalCost - 100000 * budgetSpent,
      },
      riskFactors: this.identifyForecastRisks(schedulePerformanceIndex, costPerformanceIndex),
      recommendations: this.generateForecastRecommendations(
        schedulePerformanceIndex,
        costPerformanceIndex
      ),
    };
  }

  private calculateForecastConfidence(spi: number): number {
    // Higher confidence when SPI is close to 1.0
    const deviation = Math.abs(1.0 - spi);
    return Math.max(0.5, 1.0 - deviation * 2);
  }

  private identifyForecastRisks(spi: number, cpi: number): string[] {
    const risks = [];

    if (spi < 0.9) risks.push('Schedule delay risk - project may finish late');
    if (cpi < 0.9) risks.push('Budget overrun risk - project may exceed budget');
    if (spi < 0.8 || cpi < 0.8)
      risks.push('Project in critical condition - immediate action required');

    return risks;
  }

  private generateForecastRecommendations(spi: number, cpi: number): string[] {
    const recommendations = [];

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

  async facilitateStakeholderCommunication(projectId: string): Promise<any> {
    const stakeholders = [
      {
        id: 'stakeholder_001',
        name: 'John Executive',
        role: 'Project Sponsor',
        communicationPreference: 'EXECUTIVE_SUMMARY',
        frequency: 'WEEKLY',
        interests: ['budget', 'timeline', 'risks'],
      },
      {
        id: 'stakeholder_002',
        name: 'Jane Customer',
        role: 'Customer Representative',
        communicationPreference: 'DETAILED_PROGRESS',
        frequency: 'BI_WEEKLY',
        interests: ['deliverables', 'quality', 'timeline'],
      },
      {
        id: 'stakeholder_003',
        name: 'Tech Team',
        role: 'Development Team',
        communicationPreference: 'TECHNICAL_DETAILS',
        frequency: 'DAILY',
        interests: ['tasks', 'blockers', 'technical_decisions'],
      },
    ];

    const communicationPlan = stakeholders.map((stakeholder) => ({
      stakeholderId: stakeholder.id,
      name: stakeholder.name,
      nextCommunication: this.calculateNextCommunicationDate(stakeholder.frequency),
      reportType: stakeholder.communicationPreference,
      customizedContent: this.generateStakeholderContent(projectId, stakeholder),
    }));

    return {
      projectId,
      stakeholders,
      communicationPlan,
      upcomingCommunications: communicationPlan.filter(
        (plan) => plan.nextCommunication <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      ),
    };
  }

  private calculateNextCommunicationDate(frequency: string): Date {
    const today = new Date();
    switch (frequency) {
      case 'DAILY':
        return new Date(today.getTime() + 24 * 60 * 60 * 1000);
      case 'WEEKLY':
        return new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'BI_WEEKLY':
        return new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
      default:
        return new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    }
  }

  private generateStakeholderContent(projectId: string, stakeholder: any): any {
    // Generate customized content based on stakeholder interests
    return {
      summary: `Project ${projectId} status update`,
      keyMetrics: stakeholder.interests,
      lastUpdated: new Date(),
    };
  }

  async calculateCriticalPath(projectId: string): Promise<any[]> {
    // Would calculate critical path based on task dependencies and durations
    return [
      { taskId: 'wp_001', name: 'Project Initiation', duration: 40 },
      { taskId: 'wp_002', name: 'Requirements Analysis', duration: 120 },
      { taskId: 'wp_003', name: 'System Design', duration: 160 },
      { taskId: 'wp_004', name: 'Development', duration: 400 },
    ];
  }

  async checkResourceAvailability(
    resourceId: string,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    // Would check resource calendar and existing allocations
    return 85; // 85% availability
  }

  async calculateProjectProgress(projectId: string): Promise<number> {
    // Would calculate based on completed work packages and milestones
    return 72; // 72% complete
  }

  async updateProjectSchedule(projectId: string, scheduleChanges: any[]): Promise<void> {
    // Would update project schedule in database
    console.log(`Updated schedule for project ${projectId} with ${scheduleChanges.length} changes`);
  }

  async generateProjectTimeline(projectId: string): Promise<any> {
    const workPlan = await this.planProjectWork(projectId);

    return {
      projectId,
      timeline: workPlan.workBreakdownStructure.map((wp: any, index: number) => ({
        ...wp,
        startWeek: index * 2 + 1,
        endWeek: index * 2 + Math.ceil(wp.estimatedHours / 40),
        status: index < 2 ? 'COMPLETED' : 'PLANNED',
      })),
      totalDuration: workPlan.plannedDuration,
      generatedAt: new Date(),
    };
  }
}

// Export singleton instance
export const projectPlanningService = new ProjectPlanningService();
