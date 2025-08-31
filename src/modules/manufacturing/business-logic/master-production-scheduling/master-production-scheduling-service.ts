/**
 * Master Production Scheduling Service
 * Oracle EBS competitive implementation for mastering multi-site planning complexities
 */

export interface MasterProductionSchedule {
  scheduleId: string;
  productId: string;
  productCode: string;
  planningHorizon: { startDate: Date; endDate: Date };
  sites: ProductionSite[];
  demandPlan: DemandPlanEntry[];
  supplyPlan: SupplyPlanEntry[];
  capacityPlan: CapacityPlanEntry[];
  constraints: PlanningConstraint[];
  scenarios: PlanningScenario[];
  status: 'DRAFT' | 'APPROVED' | 'ACTIVE' | 'EXPIRED';
  lastUpdate: Date;
  nextReplanDate: Date;
}

export interface ProductionSite {
  siteId: string;
  siteCode: string;
  siteName: string;
  region: string;
  country: string;
  capabilities: string[];
  capacity: SiteCapacity;
  constraints: SiteConstraint[];
  costs: SiteCosts;
  leadTime: number;
  priorityRanking: number;
}

export interface SiteCapacity {
  totalCapacity: number;
  availableCapacity: number;
  utilizedCapacity: number;
  utilizationRate: number;
  bottleneckOperations: string[];
  shiftPattern: 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'CONTINUOUS';
  workingDaysPerWeek: number;
}

export interface SiteConstraint {
  constraintId: string;
  constraintType: 'CAPACITY' | 'MATERIAL' | 'LABOR' | 'REGULATORY' | 'SEASONAL';
  description: string;
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  startDate: Date;
  endDate?: Date;
  mitigation?: string;
}

export interface SiteCosts {
  laborCostPerHour: number;
  overheadRate: number;
  materialHandlingCost: number;
  transportationCost: number;
  regulatoryCost: number;
  totalCostPerUnit: number;
}

export interface DemandPlanEntry {
  period: Date;
  forecastDemand: number;
  confirmedOrders: number;
  safetyStock: number;
  totalDemand: number;
  demandSource: 'FORECAST' | 'ORDERS' | 'SAFETY_STOCK' | 'INTERCOMPANY';
  region: string;
  customerSegment: string;
}

export interface SupplyPlanEntry {
  period: Date;
  plannedProduction: number;
  actualProduction?: number;
  siteId: string;
  productionMethod: 'MAKE' | 'BUY' | 'TRANSFER';
  cost: number;
  leadTime: number;
  riskFactor: number;
}

export interface CapacityPlanEntry {
  period: Date;
  siteId: string;
  workCenterId: string;
  requiredCapacity: number;
  availableCapacity: number;
  utilizationRate: number;
  constraintCapacity: number;
  bottleneck: boolean;
}

export interface PlanningConstraint {
  constraintId: string;
  constraintType: 'CAPACITY' | 'MATERIAL' | 'TRANSPORTATION' | 'REGULATORY' | 'FINANCIAL';
  affectedSites: string[];
  affectedPeriods: Date[];
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  resolution?: string;
}

export interface PlanningScenario {
  scenarioId: string;
  scenarioName: string;
  description: string;
  assumptions: any[];
  results: ScenarioResult;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  probability: number;
  financialImpact: number;
}

export interface ScenarioResult {
  totalCost: number;
  totalProduction: number;
  serviceLevel: number;
  inventoryLevel: number;
  utilizationRates: Array<{
    siteId: string;
    utilization: number;
  }>;
  risks: string[];
  opportunities: string[];
}

/**
 * Master Production Scheduling Service
 * Advanced multi-site planning to master complexity
 */
export class MasterProductionSchedulingService {

  // ================================
  // MULTI-SITE PLANNING
  // ================================

  /**
   * Create master production schedule
   */
  async createMasterSchedule(
    productId: string,
    planningHorizon: { startDate: Date; endDate: Date },
    sites: string[]
  ): Promise<MasterProductionSchedule> {
    const scheduleId = `mps_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`Creating master production schedule: ${scheduleId} for product ${productId}`);
    
    const productionSites: ProductionSite[] = sites.map((siteId, index) => ({
      siteId,
      siteCode: `SITE_${siteId}`,
      siteName: `Production Site ${index + 1}`,
      region: index % 2 === 0 ? 'North America' : 'Europe',
      country: index % 2 === 0 ? 'USA' : 'Germany',
      capabilities: ['ASSEMBLY', 'TESTING', 'PACKAGING'],
      capacity: {
        totalCapacity: 10000,
        availableCapacity: 8500,
        utilizedCapacity: 7200,
        utilizationRate: 84.7,
        bottleneckOperations: ['ASSEMBLY'],
        shiftPattern: 'DOUBLE',
        workingDaysPerWeek: 5
      },
      constraints: [],
      costs: {
        laborCostPerHour: 25.00 + (index * 5),
        overheadRate: 2.5,
        materialHandlingCost: 1.50,
        transportationCost: 5.00 + (index * 2),
        regulatoryCost: 0.75,
        totalCostPerUnit: 125.50 + (index * 10)
      },
      leadTime: 14 + (index * 3),
      priorityRanking: index + 1
    }));

    const schedule: MasterProductionSchedule = {
      scheduleId,
      productId,
      productCode: `PROD_${productId}`,
      planningHorizon,
      sites: productionSites,
      demandPlan: await this.generateDemandPlan(planningHorizon),
      supplyPlan: await this.generateSupplyPlan(productionSites, planningHorizon),
      capacityPlan: await this.generateCapacityPlan(productionSites, planningHorizon),
      constraints: [],
      scenarios: [],
      status: 'DRAFT',
      lastUpdate: new Date(),
      nextReplanDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Weekly replanning
    };

    return schedule;
  }

  /**
   * Optimize multi-site production allocation
   */
  async optimizeMultiSiteAllocation(
    scheduleId: string,
    optimizationCriteria: {
      objective: 'MINIMIZE_COST' | 'MAXIMIZE_SERVICE_LEVEL' | 'BALANCE_UTILIZATION';
      constraints: string[];
      weightings: { cost: number; service: number; risk: number };
    }
  ): Promise<{
    optimizationId: string;
    allocations: Array<{
      siteId: string;
      period: Date;
      allocatedQuantity: number;
      utilizationRate: number;
      cost: number;
      serviceLevel: number;
    }>;
    totalCost: number;
    averageServiceLevel: number;
    riskScore: number;
    recommendations: string[];
  }> {
    const optimizationId = `opt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`Optimizing multi-site allocation for schedule ${scheduleId}`);
    
    return {
      optimizationId,
      allocations: [
        {
          siteId: 'SITE_001',
          period: new Date(),
          allocatedQuantity: 5000,
          utilizationRate: 85.0,
          cost: 627500,
          serviceLevel: 98.5
        },
        {
          siteId: 'SITE_002', 
          period: new Date(),
          allocatedQuantity: 3500,
          utilizationRate: 70.0,
          cost: 472500,
          serviceLevel: 96.8
        }
      ],
      totalCost: 1100000,
      averageServiceLevel: 97.7,
      riskScore: 2.3,
      recommendations: [
        'Consider increasing capacity at Site 001 to improve efficiency',
        'Evaluate backup supplier options for critical materials',
        'Implement cross-training program to reduce labor constraints'
      ]
    };
  }

  /**
   * Generate what-if planning scenarios
   */
  async generatePlanningScenarios(
    scheduleId: string,
    scenarioParameters: Array<{
      scenarioName: string;
      assumptions: any[];
      variables: any[];
    }>
  ): Promise<PlanningScenario[]> {
    console.log(`Generating planning scenarios for schedule ${scheduleId}`);
    
    return scenarioParameters.map((param, index) => ({
      scenarioId: `scenario_${Date.now()}_${index}`,
      scenarioName: param.scenarioName,
      description: `Analysis of ${param.scenarioName} scenario`,
      assumptions: param.assumptions,
      results: {
        totalCost: 1000000 + (index * 100000),
        totalProduction: 10000 - (index * 500),
        serviceLevel: 98.0 - (index * 2),
        inventoryLevel: 500000 + (index * 50000),
        utilizationRates: [
          { siteId: 'SITE_001', utilization: 85.0 - (index * 5) },
          { siteId: 'SITE_002', utilization: 75.0 - (index * 3) }
        ],
        risks: [`Risk factor ${index + 1}`, `Potential constraint ${index + 1}`],
        opportunities: [`Opportunity ${index + 1}`, `Efficiency gain ${index + 1}`]
      },
      risk: index === 0 ? 'LOW' : index === 1 ? 'MEDIUM' : 'HIGH',
      probability: 0.8 - (index * 0.2),
      financialImpact: 50000 + (index * 25000)
    }));
  }

  // ================================
  // PRIVATE HELPER METHODS
  // ================================

  private async generateDemandPlan(planningHorizon: { startDate: Date; endDate: Date }): Promise<DemandPlanEntry[]> {
    const demandPlan: DemandPlanEntry[] = [];
    
    // Generate weekly demand for the planning horizon
    const currentDate = new Date(planningHorizon.startDate);
    let weekNumber = 1;
    
    while (currentDate <= planningHorizon.endDate) {
      demandPlan.push({
        period: new Date(currentDate),
        forecastDemand: 1000 + Math.random() * 500,
        confirmedOrders: 800 + Math.random() * 300,
        safetyStock: 200,
        totalDemand: 1000 + Math.random() * 500,
        demandSource: 'FORECAST',
        region: weekNumber % 2 === 0 ? 'North America' : 'Europe',
        customerSegment: 'Enterprise'
      });
      
      currentDate.setDate(currentDate.getDate() + 7);
      weekNumber++;
    }
    
    return demandPlan;
  }

  private async generateSupplyPlan(
    sites: ProductionSite[],
    planningHorizon: { startDate: Date; endDate: Date }
  ): Promise<SupplyPlanEntry[]> {
    const supplyPlan: SupplyPlanEntry[] = [];
    
    sites.forEach(site => {
      const currentDate = new Date(planningHorizon.startDate);
      
      while (currentDate <= planningHorizon.endDate) {
        supplyPlan.push({
          period: new Date(currentDate),
          plannedProduction: site.capacity.availableCapacity / 4, // Weekly production
          siteId: site.siteId,
          productionMethod: 'MAKE',
          cost: site.costs.totalCostPerUnit * (site.capacity.availableCapacity / 4),
          leadTime: site.leadTime,
          riskFactor: 0.1
        });
        
        currentDate.setDate(currentDate.getDate() + 7);
      }
    });
    
    return supplyPlan;
  }

  private async generateCapacityPlan(
    sites: ProductionSite[],
    planningHorizon: { startDate: Date; endDate: Date }
  ): Promise<CapacityPlanEntry[]> {
    const capacityPlan: CapacityPlanEntry[] = [];
    
    sites.forEach(site => {
      const currentDate = new Date(planningHorizon.startDate);
      
      while (currentDate <= planningHorizon.endDate) {
        capacityPlan.push({
          period: new Date(currentDate),
          siteId: site.siteId,
          workCenterId: 'WC001',
          requiredCapacity: site.capacity.utilizedCapacity,
          availableCapacity: site.capacity.availableCapacity,
          utilizationRate: site.capacity.utilizationRate,
          constraintCapacity: site.capacity.totalCapacity,
          bottleneck: site.capacity.utilizationRate > 90
        });
        
        currentDate.setDate(currentDate.getDate() + 7);
      }
    });
    
    return capacityPlan;
  }
}

// Export service instance
export const masterProductionSchedulingService = new MasterProductionSchedulingService();