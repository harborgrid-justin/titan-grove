/**
 * Project & Service Domain
 * Centralized business logic for project management, service delivery, and customer support
 */

import { projectManager, ProjectManager } from '../../modules/project';
import { serviceManager, ServiceManager } from '../../modules/service';
import { BusinessConfig } from '../../types/business-config';

export interface ProjectServiceDomainConfig {
  project: {
    billingRates: {
      consultant: number;
      manager: number;
      architect: number;
      developer: number;
    };
    margins: {
      targetGrossMargin: number;
      minAcceptableMargin: number;
      premiumMargin: number;
    };
    resourceUtilization: {
      billableTarget: number;
      capacityBuffer: number;
      overallocationLimit: number;
    };
  };
  service: {
    slaTargets: {
      availability: number;
      responseTime: number; // hours
      resolutionTime: number; // hours
    };
    satisfactionTargets: {
      customerSatisfaction: number;
      firstCallResolution: number;
      escalationRate: number;
    };
  };
}

/**
 * Core Business Logic Functions - Project & Service Domain
 * Consolidated business calculations for project and service management
 */
export class ProjectServiceBusinessLogic {
  
  /**
   * Calculate project profitability analysis
   */
  static calculateProjectProfitability(
    projectRevenue: number,
    laborCosts: number,
    materialCosts: number,
    overheadCosts: number
  ): {
    revenue: number;
    totalCosts: number;
    grossProfit: number;
    grossMargin: number;
    profitabilityIndex: number;
  } {
    const totalCosts = laborCosts + materialCosts + overheadCosts;
    const grossProfit = projectRevenue - totalCosts;
    const grossMargin = grossProfit / projectRevenue;
    const profitabilityIndex = projectRevenue / totalCosts;

    return {
      revenue: projectRevenue,
      totalCosts,
      grossProfit,
      grossMargin,
      profitabilityIndex
    };
  }

  /**
   * Calculate resource utilization metrics
   */
  static calculateResourceUtilization(
    billableHours: number,
    availableHours: number,
    targetUtilization: number = 0.8
  ): {
    utilizationRate: number;
    efficiency: number;
    variance: number;
    status: 'under' | 'on-target' | 'over';
  } {
    const utilizationRate = billableHours / availableHours;
    const efficiency = utilizationRate / targetUtilization;
    const variance = utilizationRate - targetUtilization;

    let status: 'under' | 'on-target' | 'over';
    if (utilizationRate < targetUtilization * 0.9) status = 'under';
    else if (utilizationRate > targetUtilization * 1.1) status = 'over';
    else status = 'on-target';

    return {
      utilizationRate,
      efficiency,
      variance,
      status
    };
  }

  /**
   * Calculate service level metrics
   */
  static calculateServiceLevelMetrics(
    totalIncidents: number,
    resolvedOnTime: number,
    firstCallResolutions: number,
    escalations: number
  ): {
    slaCompliance: number;
    firstCallResolutionRate: number;
    escalationRate: number;
    overallEfficiency: number;
  } {
    const slaCompliance = resolvedOnTime / totalIncidents;
    const firstCallResolutionRate = firstCallResolutions / totalIncidents;
    const escalationRate = escalations / totalIncidents;
    const overallEfficiency = (slaCompliance + firstCallResolutionRate + (1 - escalationRate)) / 3;

    return {
      slaCompliance,
      firstCallResolutionRate,
      escalationRate,
      overallEfficiency
    };
  }
}

/**
 * Project & Service Domain Manager
 * Orchestrates all project and service-related modules with centralized business logic
 */
export class ProjectServiceDomainManager {
  private projectManager: ProjectManager;
  private serviceManager: ServiceManager;
  private config: ProjectServiceDomainConfig;

  constructor(config?: Partial<ProjectServiceDomainConfig>) {
    this.projectManager = projectManager;
    this.serviceManager = serviceManager;
    this.config = this.getDefaultConfig();
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  private getDefaultConfig(): ProjectServiceDomainConfig {
    return {
      project: {
        billingRates: {
          consultant: 150,
          manager: 200,
          architect: 250,
          developer: 120
        },
        margins: {
          targetGrossMargin: 0.35,
          minAcceptableMargin: 0.20,
          premiumMargin: 0.50
        },
        resourceUtilization: {
          billableTarget: 0.75,
          capacityBuffer: 0.15,
          overallocationLimit: 1.2
        }
      },
      service: {
        slaTargets: {
          availability: 0.999,
          responseTime: 2,
          resolutionTime: 8
        },
        satisfactionTargets: {
          customerSatisfaction: 4.5,
          firstCallResolution: 0.8,
          escalationRate: 0.1
        }
      }
    };
  }

  /**
   * Perform comprehensive project portfolio analysis
   */
  async performProjectPortfolioAnalysis(projectIds: string[]): Promise<any> {
    // Placeholder for project portfolio analysis business logic
    const sampleProject = {
      id: 'proj_001',
      revenue: 500000,
      laborCosts: 275000,
      materialCosts: 85000,
      overheadCosts: 65000
    };

    const profitability = ProjectServiceBusinessLogic.calculateProjectProfitability(
      sampleProject.revenue,
      sampleProject.laborCosts,
      sampleProject.materialCosts,
      sampleProject.overheadCosts
    );

    const utilization = ProjectServiceBusinessLogic.calculateResourceUtilization(1200, 1600, 0.75);

    return {
      totalProjects: projectIds.length,
      activeProjects: Math.floor(projectIds.length * 0.7),
      portfolioValue: 12500000,
      profitability,
      resourceMetrics: utilization,
      projectHealth: {
        onTrack: 0.68,
        atRisk: 0.22,
        delayed: 0.10
      }
    };
  }

  /**
   * Perform service delivery analysis
   */
  async performServiceDeliveryAnalysis(period: { startDate: Date; endDate: Date }): Promise<any> {
    // Placeholder for service delivery analysis
    const serviceMetrics = ProjectServiceBusinessLogic.calculateServiceLevelMetrics(1250, 1100, 950, 85);

    return {
      totalIncidents: 1250,
      resolvedIncidents: 1165,
      avgResponseTime: 1.8, // hours
      avgResolutionTime: 6.2, // hours
      serviceMetrics,
      customerSatisfaction: 4.3,
      availability: 0.998
    };
  }

  // Delegate to specific modules for operations
  getProjectManager(): ProjectManager {
    return this.projectManager;
  }

  getServiceManager(): ServiceManager {
    return this.serviceManager;
  }

  getDomainConfig(): ProjectServiceDomainConfig {
    return this.config;
  }
}

// Export singleton instance
export const projectServiceDomainManager = new ProjectServiceDomainManager();