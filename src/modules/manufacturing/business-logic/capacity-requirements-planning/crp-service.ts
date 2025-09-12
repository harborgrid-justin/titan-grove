/**
 * Capacity Requirements Planning (CRP) Service - Phase 2 Implementation
 * Advanced CRP engine for work center load analysis, bottleneck identification, and resource leveling
 * Oracle EBS competitive implementation for complex capacity planning scenarios
 */

export interface CRPParameters {
  planningHorizon: { startDate: Date; endDate: Date };
  timeUnitType: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  includeSetupTime: boolean;
  includeQueueTime: boolean;
  includeWaitTime: boolean;
  capacityTolerance: number; // percentage
  overloadThreshold: number; // percentage above capacity
  underloadThreshold: number; // percentage below capacity
}

export interface WorkCenter {
  workCenterId: string;
  workCenterCode: string;
  workCenterName: string;
  department: string;
  costCenter: string;
  capacity: WorkCenterCapacity;
  efficiency: number;
  utilization: number;
  operatingCalendar: OperatingCalendar;
  resources: WorkCenterResource[];
  alternativeWorkCenters: string[];
}

export interface WorkCenterCapacity {
  standardCapacity: number; // hours per time unit
  maximumCapacity: number;
  availableCapacity: number;
  utilizationTarget: number; // target utilization percentage
  shiftPatterns: ShiftPattern[];
  holidays: Date[];
  maintenanceWindows: MaintenanceWindow[];
}

export interface ShiftPattern {
  shiftId: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  hoursPerShift: number;
  daysOfWeek: number[]; // 0 = Sunday, 1 = Monday, etc.
  breaks: BreakPeriod[];
}

export interface BreakPeriod {
  startTime: string;
  endTime: string;
  paid: boolean;
}

export interface MaintenanceWindow {
  maintenanceId: string;
  startDate: Date;
  endDate: Date;
  plannedDuration: number; // hours
  maintenanceType: 'PREVENTIVE' | 'CORRECTIVE' | 'PREDICTIVE';
  impactOnCapacity: number; // percentage reduction
}

export interface OperatingCalendar {
  calendarId: string;
  workDays: number[]; // days of week
  standardWorkHours: number;
  holidays: Date[];
  exceptions: CalendarException[];
}

export interface CalendarException {
  date: Date;
  exceptionType: 'HOLIDAY' | 'SHUTDOWN' | 'REDUCED_HOURS' | 'OVERTIME';
  hoursAvailable?: number;
}

export interface WorkCenterResource {
  resourceId: string;
  resourceType: 'LABOR' | 'MACHINE' | 'TOOL' | 'FIXTURE';
  resourceCode: string;
  resourceName: string;
  quantity: number;
  costPerHour: number;
  skills: string[];
  certifications: string[];
  availability: ResourceAvailability;
}

export interface ResourceAvailability {
  availableHours: number;
  scheduledHours: number;
  overtimeHours: number;
  unavailableHours: number;
  utilization: number;
}

export interface CRPLoadProfile {
  workCenterId: string;
  planningPeriods: CRPPeriodLoad[];
  totalRequiredHours: number;
  totalAvailableHours: number;
  overallUtilization: number;
  bottleneckRating: 'NONE' | 'MINOR' | 'MODERATE' | 'MAJOR' | 'CRITICAL';
  loadVariability: number;
  recommendations: CRPRecommendation[];
}

export interface CRPPeriodLoad {
  periodDate: Date;
  requiredHours: number;
  availableHours: number;
  loadPercentage: number;
  overloadHours: number;
  underloadHours: number;
  operations: OperationLoad[];
  bottleneck: boolean;
  feasible: boolean;
}

export interface OperationLoad {
  operationId: string;
  operationNumber: number;
  productionOrderId: string;
  itemCode: string;
  operationDescription: string;
  setupHours: number;
  runHours: number;
  queueHours: number;
  totalHours: number;
  scheduledStartDate: Date;
  scheduledEndDate: Date;
  priority: number;
  critical: boolean;
}

export interface CRPRecommendation {
  recommendationId: string;
  workCenterId: string;
  recommendationType: 'CAPACITY_INCREASE' | 'LOAD_LEVELING' | 'ALTERNATIVE_ROUTING' | 'OVERTIME' | 'SUBCONTRACT' | 'RESCHEDULE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  expectedImpact: string;
  implementationCost: number;
  timeToImplement: number; // days
  affectedPeriods: Date[];
  alternativeWorkCenters?: string[];
  additionalCapacity?: number;
}

export interface BottleneckAnalysis {
  analysisId: string;
  analysisDate: Date;
  planningHorizon: { startDate: Date; endDate: Date };
  bottlenecks: BottleneckInfo[];
  systemConstraints: SystemConstraint[];
  throughputAnalysis: ThroughputAnalysis;
  recommendations: BottleneckRecommendation[];
}

export interface BottleneckInfo {
  workCenterId: string;
  workCenterName: string;
  bottleneckSeverity: 'MINOR' | 'MODERATE' | 'MAJOR' | 'CRITICAL';
  averageUtilization: number;
  peakUtilization: number;
  overloadPeriods: number;
  impactOnThroughput: number;
  constraintDuration: number; // days
  affectedOperations: string[];
  rootCauses: string[];
}

export interface SystemConstraint {
  constraintId: string;
  constraintType: 'CAPACITY' | 'MATERIAL' | 'POLICY' | 'MARKET' | 'PARADIGM';
  description: string;
  impact: number; // percentage impact on system throughput
  frequency: number; // how often constraint is active
  variability: number; // consistency of constraint impact
}

export interface ThroughputAnalysis {
  systemThroughput: number; // units per time period
  theoreticalMaxThroughput: number;
  throughputEfficiency: number; // percentage
  bottleneckUtilization: number;
  nonBottleneckUtilization: number;
  systemCycleTime: number; // time units
  workInProgress: number; // number of units
  inventoryTurns: number;
}

export interface BottleneckRecommendation {
  recommendationId: string;
  priority: number;
  action: string;
  expectedThroughputIncrease: number;
  investmentRequired: number;
  paybackPeriod: number; // months
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  implementationSteps: string[];
}

export interface CRPRunResults {
  runId: string;
  runDate: Date;
  parameters: CRPParameters;
  workCentersAnalyzed: number;
  operationsAnalyzed: number;
  bottlenecksIdentified: number;
  overloadPeriods: number;
  underloadPeriods: number;
  averageUtilization: number;
  feasibilityScore: number;
  recommendations: number;
  performance: {
    processingTimeMs: number;
    memoryUsageMb: number;
    workCentersPerSecond: number;
  };
}

export class CapacityRequirementsPlanningService {
  private workCenters: Map<string, WorkCenter> = new Map();
  private loadProfiles: Map<string, CRPLoadProfile> = new Map();
  private plannedOperations: OperationLoad[] = [];
  
  /**
   * Execute comprehensive CRP analysis
   */
  async runCRP(parameters: CRPParameters): Promise<CRPRunResults> {
    const startTime = Date.now();
    const runId = `crp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`🏭 Starting CRP Analysis ${runId} for planning horizon ${parameters.planningHorizon.startDate.toISOString().split('T')[0]} to ${parameters.planningHorizon.endDate.toISOString().split('T')[0]}`);
    
    try {
      // Step 1: Initialize work centers and load data
      await this.initializeWorkCenters(parameters);
      await this.loadPlannedOperations(parameters);
      
      // Step 2: Calculate capacity requirements for each work center
      for (const [workCenterId, workCenter] of this.workCenters) {
        console.log(`Analyzing capacity for work center: ${workCenter.workCenterName}`);
        await this.calculateWorkCenterLoad(workCenterId, parameters);
      }
      
      // Step 3: Identify bottlenecks
      const bottleneckAnalysis = await this.performBottleneckAnalysis(parameters);
      
      // Step 4: Generate recommendations
      await this.generateCapacityRecommendations(parameters);
      
      // Step 5: Validate feasibility
      const feasibilityScore = await this.calculateFeasibilityScore();
      
      const endTime = Date.now();
      const processingTime = endTime - startTime;
      
      const results: CRPRunResults = {
        runId,
        runDate: new Date(),
        parameters,
        workCentersAnalyzed: this.workCenters.size,
        operationsAnalyzed: this.plannedOperations.length,
        bottlenecksIdentified: bottleneckAnalysis.bottlenecks.length,
        overloadPeriods: this.countOverloadPeriods(),
        underloadPeriods: this.countUnderloadPeriods(),
        averageUtilization: this.calculateAverageUtilization(),
        feasibilityScore,
        recommendations: this.countRecommendations(),
        performance: {
          processingTimeMs: processingTime,
          memoryUsageMb: process.memoryUsage().heapUsed / 1024 / 1024,
          workCentersPerSecond: this.workCenters.size / (processingTime / 1000)
        }
      };
      
      console.log(`✅ CRP Analysis ${runId} completed in ${processingTime}ms`);
      console.log(`📊 Analyzed ${results.workCentersAnalyzed} work centers, ${results.operationsAnalyzed} operations`);
      console.log(`🚨 Found ${results.bottlenecksIdentified} bottlenecks, feasibility score: ${results.feasibilityScore.toFixed(1)}%`);
      
      return results;
      
    } catch (error) {
      console.error(`❌ CRP Analysis ${runId} failed:`, error);
      throw error;
    }
  }
  
  /**
   * Calculate load profile for specific work center
   */
  private async calculateWorkCenterLoad(workCenterId: string, parameters: CRPParameters): Promise<void> {
    const workCenter = this.workCenters.get(workCenterId);
    if (!workCenter) return;
    
    const timeBuckets = this.generateTimeBuckets(parameters);
    const periodLoads: CRPPeriodLoad[] = [];
    
    for (const period of timeBuckets) {
      // Get operations scheduled for this period
      const operationsInPeriod = this.plannedOperations.filter(op => 
        this.isOperationInPeriod(op, period, parameters.timeUnitType)
      );
      
      // Calculate required hours
      const requiredHours = operationsInPeriod.reduce((sum, op) => sum + op.totalHours, 0);
      
      // Calculate available hours for this period
      const availableHours = await this.calculateAvailableHours(workCenter, period, parameters.timeUnitType);
      
      // Calculate load percentage
      const loadPercentage = availableHours > 0 ? (requiredHours / availableHours) * 100 : 0;
      
      // Determine overload/underload
      const overloadHours = Math.max(0, requiredHours - availableHours);
      const underloadHours = Math.max(0, availableHours - requiredHours);
      
      // Check if this is a bottleneck period
      const bottleneck = loadPercentage > parameters.overloadThreshold;
      const feasible = loadPercentage <= parameters.capacityTolerance;
      
      const periodLoad: CRPPeriodLoad = {
        periodDate: period,
        requiredHours,
        availableHours,
        loadPercentage,
        overloadHours,
        underloadHours,
        operations: operationsInPeriod,
        bottleneck,
        feasible
      };
      
      periodLoads.push(periodLoad);
    }
    
    // Calculate overall metrics
    const totalRequiredHours = periodLoads.reduce((sum, p) => sum + p.requiredHours, 0);
    const totalAvailableHours = periodLoads.reduce((sum, p) => sum + p.availableHours, 0);
    const overallUtilization = totalAvailableHours > 0 ? (totalRequiredHours / totalAvailableHours) * 100 : 0;
    
    // Determine bottleneck rating
    const bottleneckRating = this.determineBottleneckRating(overallUtilization, periodLoads);
    
    // Calculate load variability
    const loadVariability = this.calculateLoadVariability(periodLoads);
    
    const loadProfile: CRPLoadProfile = {
      workCenterId,
      planningPeriods: periodLoads,
      totalRequiredHours,
      totalAvailableHours,
      overallUtilization,
      bottleneckRating,
      loadVariability,
      recommendations: []
    };
    
    this.loadProfiles.set(workCenterId, loadProfile);
  }
  
  /**
   * Perform comprehensive bottleneck analysis
   */
  private async performBottleneckAnalysis(parameters: CRPParameters): Promise<BottleneckAnalysis> {
    const analysisId = `bottleneck_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const bottlenecks: BottleneckInfo[] = [];
    
    // Analyze each work center for bottleneck characteristics
    for (const [workCenterId, loadProfile] of this.loadProfiles) {
      const workCenter = this.workCenters.get(workCenterId);
      if (!workCenter) continue;
      
      if (loadProfile.bottleneckRating !== 'NONE') {
        const overloadPeriods = loadProfile.planningPeriods.filter(p => p.bottleneck).length;
        const averageUtilization = loadProfile.overallUtilization;
        const peakUtilization = Math.max(...loadProfile.planningPeriods.map(p => p.loadPercentage));
        
        const bottleneckInfo: BottleneckInfo = {
          workCenterId,
          workCenterName: workCenter.workCenterName,
          bottleneckSeverity: loadProfile.bottleneckRating as any,
          averageUtilization,
          peakUtilization,
          overloadPeriods,
          impactOnThroughput: this.calculateThroughputImpact(loadProfile),
          constraintDuration: this.calculateConstraintDuration(loadProfile),
          affectedOperations: this.getAffectedOperations(loadProfile),
          rootCauses: this.identifyRootCauses(loadProfile)
        };
        
        bottlenecks.push(bottleneckInfo);
      }
    }
    
    // Sort bottlenecks by severity and impact
    bottlenecks.sort((a, b) => {
      const severityOrder: Record<string, number> = { 'CRITICAL': 0, 'MAJOR': 1, 'MODERATE': 2, 'MINOR': 3 };
      if (severityOrder[a.bottleneckSeverity] !== severityOrder[b.bottleneckSeverity]) {
        return severityOrder[a.bottleneckSeverity] - severityOrder[b.bottleneckSeverity];
      }
      return b.impactOnThroughput - a.impactOnThroughput;
    });
    
    // Calculate system throughput analysis
    const throughputAnalysis = await this.calculateSystemThroughput(bottlenecks);
    
    // Generate bottleneck-specific recommendations
    const recommendations = await this.generateBottleneckRecommendations(bottlenecks);
    
    return {
      analysisId,
      analysisDate: new Date(),
      planningHorizon: parameters.planningHorizon,
      bottlenecks,
      systemConstraints: [], // Would be calculated based on constraint theory
      throughputAnalysis,
      recommendations
    };
  }
  
  /**
   * Generate capacity planning recommendations
   */
  private async generateCapacityRecommendations(parameters: CRPParameters): Promise<void> {
    for (const [workCenterId, loadProfile] of this.loadProfiles) {
      const recommendations: CRPRecommendation[] = [];
      
      // Check for consistent overload
      const overloadPeriods = loadProfile.planningPeriods.filter(p => p.overloadHours > 0);
      if (overloadPeriods.length > loadProfile.planningPeriods.length * 0.3) {
        recommendations.push({
          recommendationId: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          workCenterId,
          recommendationType: 'CAPACITY_INCREASE',
          severity: 'HIGH',
          description: `Work center consistently overloaded in ${overloadPeriods.length} periods`,
          expectedImpact: 'Increase throughput by 20-30%',
          implementationCost: 50000,
          timeToImplement: 30,
          affectedPeriods: overloadPeriods.map(p => p.periodDate),
          additionalCapacity: 20
        });
      }
      
      // Check for load variability
      if (loadProfile.loadVariability > 50) {
        recommendations.push({
          recommendationId: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          workCenterId,
          recommendationType: 'LOAD_LEVELING',
          severity: 'MEDIUM',
          description: 'High load variability detected, consider load leveling',
          expectedImpact: 'Improve efficiency by 10-15%',
          implementationCost: 10000,
          timeToImplement: 14,
          affectedPeriods: []
        });
      }
      
      // Check for underutilization
      const averageLoad = loadProfile.overallUtilization;
      if (averageLoad < parameters.underloadThreshold) {
        recommendations.push({
          recommendationId: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          workCenterId,
          recommendationType: 'ALTERNATIVE_ROUTING',
          severity: 'LOW',
          description: 'Work center underutilized, consider routing more operations here',
          expectedImpact: 'Better resource utilization',
          implementationCost: 2000,
          timeToImplement: 7,
          affectedPeriods: []
        });
      }
      
      loadProfile.recommendations = recommendations;
    }
  }
  
  /**
   * Initialize work centers with capacity data
   */
  private async initializeWorkCenters(parameters: CRPParameters): Promise<void> {
    // This would typically load from database
    // For demo, create sample work centers
    const sampleWorkCenters = [
      {
        id: 'WC001',
        code: 'ASSEMBLY-01',
        name: 'Final Assembly Line 1',
        department: 'Assembly',
        standardCapacity: 160, // hours per week
        efficiency: 85
      },
      {
        id: 'WC002', 
        code: 'MACHINE-01',
        name: 'CNC Machining Center 1',
        department: 'Machining',
        standardCapacity: 120,
        efficiency: 92
      },
      {
        id: 'WC003',
        code: 'WELD-01',
        name: 'Welding Station 1',
        department: 'Fabrication',
        standardCapacity: 80,
        efficiency: 88
      }
    ];
    
    for (const wc of sampleWorkCenters) {
      const workCenter: WorkCenter = {
        workCenterId: wc.id,
        workCenterCode: wc.code,
        workCenterName: wc.name,
        department: wc.department,
        costCenter: `CC-${wc.department.toUpperCase()}`,
        capacity: {
          standardCapacity: wc.standardCapacity,
          maximumCapacity: wc.standardCapacity * 1.2,
          availableCapacity: wc.standardCapacity * wc.efficiency / 100,
          utilizationTarget: 85,
          shiftPatterns: [{
            shiftId: 'DAY_SHIFT',
            shiftName: 'Day Shift',
            startTime: '08:00',
            endTime: '17:00',
            hoursPerShift: 8,
            daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
            breaks: [
              { startTime: '10:00', endTime: '10:15', paid: true },
              { startTime: '12:00', endTime: '13:00', paid: false },
              { startTime: '15:00', endTime: '15:15', paid: true }
            ]
          }],
          holidays: [],
          maintenanceWindows: []
        },
        efficiency: wc.efficiency,
        utilization: 0,
        operatingCalendar: {
          calendarId: `CAL_${wc.code}`,
          workDays: [1, 2, 3, 4, 5],
          standardWorkHours: 8,
          holidays: [],
          exceptions: []
        },
        resources: [],
        alternativeWorkCenters: []
      };
      
      this.workCenters.set(wc.id, workCenter);
    }
  }
  
  /**
   * Load planned operations from MRP results
   */
  private async loadPlannedOperations(parameters: CRPParameters): Promise<void> {
    // This would typically load from MRP planned orders and routing data
    // For demo, create sample operations
    const sampleOperations: OperationLoad[] = [
      {
        operationId: 'OP001',
        operationNumber: 10,
        productionOrderId: 'PO001',
        itemCode: 'BIKE-RED',
        operationDescription: 'Frame Assembly',
        setupHours: 2,
        runHours: 8,
        queueHours: 4,
        totalHours: 14,
        scheduledStartDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        scheduledEndDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        priority: 1,
        critical: true
      },
      {
        operationId: 'OP002',
        operationNumber: 20,
        productionOrderId: 'PO001',
        itemCode: 'BIKE-RED',
        operationDescription: 'Machining',
        setupHours: 1,
        runHours: 6,
        queueHours: 2,
        totalHours: 9,
        scheduledStartDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
        scheduledEndDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        priority: 2,
        critical: false
      }
    ];
    
    this.plannedOperations = sampleOperations;
  }
  
  /**
   * Generate time buckets for capacity analysis
   */
  private generateTimeBuckets(parameters: CRPParameters): Date[] {
    const buckets: Date[] = [];
    const current = new Date(parameters.planningHorizon.startDate);
    
    while (current <= parameters.planningHorizon.endDate) {
      buckets.push(new Date(current));
      
      switch (parameters.timeUnitType) {
        case 'DAILY':
          current.setDate(current.getDate() + 1);
          break;
        case 'WEEKLY':
          current.setDate(current.getDate() + 7);
          break;
        case 'MONTHLY':
          current.setMonth(current.getMonth() + 1);
          break;
      }
    }
    
    return buckets;
  }
  
  /**
   * Check if operation falls within the specified time period
   */
  private isOperationInPeriod(operation: OperationLoad, period: Date, timeUnit: string): boolean {
    const periodEnd = new Date(period);
    
    switch (timeUnit) {
      case 'DAILY':
        periodEnd.setDate(periodEnd.getDate() + 1);
        break;
      case 'WEEKLY':
        periodEnd.setDate(periodEnd.getDate() + 7);
        break;
      case 'MONTHLY':
        periodEnd.setMonth(periodEnd.getMonth() + 1);
        break;
    }
    
    return operation.scheduledStartDate >= period && operation.scheduledStartDate < periodEnd;
  }
  
  /**
   * Calculate available hours for work center in time period
   */
  private async calculateAvailableHours(workCenter: WorkCenter, period: Date, timeUnit: string): Promise<number> {
    let baseHours = 0;
    
    switch (timeUnit) {
      case 'DAILY':
        baseHours = workCenter.capacity.standardCapacity / 5; // assuming 5-day week
        break;
      case 'WEEKLY':
        baseHours = workCenter.capacity.standardCapacity;
        break;
      case 'MONTHLY':
        baseHours = workCenter.capacity.standardCapacity * 4.33; // average weeks per month
        break;
    }
    
    // Apply efficiency factor
    const availableHours = baseHours * (workCenter.efficiency / 100);
    
    return availableHours;
  }
  
  /**
   * Determine bottleneck rating based on utilization and load patterns
   */
  private determineBottleneckRating(utilization: number, periods: CRPPeriodLoad[]): 'NONE' | 'MINOR' | 'MODERATE' | 'MAJOR' | 'CRITICAL' {
    const overloadPeriods = periods.filter(p => p.bottleneck).length;
    const totalPeriods = periods.length;
    const overloadRatio = overloadPeriods / totalPeriods;
    
    if (utilization > 120 || overloadRatio > 0.5) return 'CRITICAL';
    if (utilization > 110 || overloadRatio > 0.3) return 'MAJOR';
    if (utilization > 100 || overloadRatio > 0.2) return 'MODERATE';
    if (utilization > 95 || overloadRatio > 0.1) return 'MINOR';
    return 'NONE';
  }
  
  /**
   * Calculate load variability coefficient
   */
  private calculateLoadVariability(periods: CRPPeriodLoad[]): number {
    if (periods.length === 0) return 0;
    
    const loads = periods.map(p => p.loadPercentage);
    const mean = loads.reduce((sum, load) => sum + load, 0) / loads.length;
    const variance = loads.reduce((sum, load) => sum + Math.pow(load - mean, 2), 0) / loads.length;
    const standardDeviation = Math.sqrt(variance);
    
    return mean > 0 ? (standardDeviation / mean) * 100 : 0;
  }
  
  // Additional helper methods for calculations...
  
  /**
   * Get CRP results for specific work center
   */
  async getCRPResults(workCenterId: string): Promise<CRPLoadProfile | null> {
    return this.loadProfiles.get(workCenterId) || null;
  }
  
  /**
   * Get all bottleneck work centers
   */
  async getBottleneckWorkCenters(): Promise<CRPLoadProfile[]> {
    return Array.from(this.loadProfiles.values())
      .filter(profile => profile.bottleneckRating !== 'NONE')
      .sort((a, b) => {
        const severityOrder: Record<string, number> = { 'CRITICAL': 0, 'MAJOR': 1, 'MODERATE': 2, 'MINOR': 3 };
        return severityOrder[a.bottleneckRating] - severityOrder[b.bottleneckRating];
      });
  }
  
  /**
   * Calculate system-wide feasibility score
   */
  private async calculateFeasibilityScore(): Promise<number> {
    const totalWorkCenters = this.workCenters.size;
    if (totalWorkCenters === 0) return 100;
    
    let feasibleWorkCenters = 0;
    
    for (const loadProfile of this.loadProfiles.values()) {
      const feasiblePeriods = loadProfile.planningPeriods.filter(p => p.feasible).length;
      const totalPeriods = loadProfile.planningPeriods.length;
      
      if (totalPeriods > 0 && (feasiblePeriods / totalPeriods) >= 0.8) {
        feasibleWorkCenters++;
      }
    }
    
    return (feasibleWorkCenters / totalWorkCenters) * 100;
  }
  
  // Placeholder implementations for missing methods
  private calculateThroughputImpact(loadProfile: CRPLoadProfile): number {
    return loadProfile.overallUtilization > 100 ? (loadProfile.overallUtilization - 100) * 0.5 : 0;
  }
  
  private calculateConstraintDuration(loadProfile: CRPLoadProfile): number {
    return loadProfile.planningPeriods.filter(p => p.bottleneck).length;
  }
  
  private getAffectedOperations(loadProfile: CRPLoadProfile): string[] {
    const operations: string[] = [];
    for (const period of loadProfile.planningPeriods) {
      for (const op of period.operations) {
        operations.push(op.operationId);
      }
    }
    return [...new Set(operations)];
  }
  
  private identifyRootCauses(loadProfile: CRPLoadProfile): string[] {
    const causes: string[] = [];
    if (loadProfile.overallUtilization > 110) causes.push('Insufficient capacity');
    if (loadProfile.loadVariability > 50) causes.push('Uneven workload distribution');
    return causes;
  }
  
  private async calculateSystemThroughput(bottlenecks: BottleneckInfo[]): Promise<ThroughputAnalysis> {
    // Simplified throughput analysis
    return {
      systemThroughput: 100,
      theoreticalMaxThroughput: 120,
      throughputEfficiency: 83.3,
      bottleneckUtilization: bottlenecks.length > 0 ? bottlenecks[0].averageUtilization : 0,
      nonBottleneckUtilization: 75,
      systemCycleTime: 10,
      workInProgress: 50,
      inventoryTurns: 12
    };
  }
  
  private async generateBottleneckRecommendations(bottlenecks: BottleneckInfo[]): Promise<BottleneckRecommendation[]> {
    return bottlenecks.map((bottleneck, index) => ({
      recommendationId: `br_${Date.now()}_${index}`,
      priority: index + 1,
      action: `Increase capacity at ${bottleneck.workCenterName}`,
      expectedThroughputIncrease: 15,
      investmentRequired: 25000,
      paybackPeriod: 8,
      riskLevel: 'MEDIUM',
      implementationSteps: ['Evaluate current capacity', 'Source additional equipment', 'Train operators']
    }));
  }
  
  private countOverloadPeriods(): number {
    let count = 0;
    for (const profile of this.loadProfiles.values()) {
      count += profile.planningPeriods.filter(p => p.overloadHours > 0).length;
    }
    return count;
  }
  
  private countUnderloadPeriods(): number {
    let count = 0;
    for (const profile of this.loadProfiles.values()) {
      count += profile.planningPeriods.filter(p => p.underloadHours > 0).length;
    }
    return count;
  }
  
  private calculateAverageUtilization(): number {
    const profiles = Array.from(this.loadProfiles.values());
    if (profiles.length === 0) return 0;
    
    const totalUtilization = profiles.reduce((sum, profile) => sum + profile.overallUtilization, 0);
    return totalUtilization / profiles.length;
  }
  
  private countRecommendations(): number {
    let count = 0;
    for (const profile of this.loadProfiles.values()) {
      count += profile.recommendations.length;
    }
    return count;
  }
}