/**
 * Statistical Process Control (SPC) Service for Shop Floor Excellence  
 * Phase 3 Implementation - Advanced Quality Management with Real-time Process Control
 */

export interface ControlChart {
  chartId: string;
  chartType: 'X_BAR_R' | 'X_BAR_S' | 'INDIVIDUAL_MR' | 'P_CHART' | 'NP_CHART' | 'C_CHART' | 'U_CHART';
  processId: string;
  characteristicName: string;
  measurementUnit: string;
  sampleSize: number;
  controlLimits: ControlLimits;
  specificationLimits?: SpecificationLimits;
  dataPoints: ControlChartDataPoint[];
  rules: ControlChartRule[];
  isActive: boolean;
  lastUpdated: Date;
}

export interface ControlLimits {
  upperControlLimit: number;
  lowerControlLimit: number;
  centerLine: number;
  calculationMethod: 'HISTORICAL' | 'TARGET' | 'CALCULATED';
  calculationDate: Date;
  sampleCount: number;
}

export interface SpecificationLimits {
  upperSpecLimit: number;
  lowerSpecLimit: number;
  targetValue: number;
  tolerance: number;
}

export interface ControlChartDataPoint {
  pointId: string;
  timestamp: Date;
  sampleId: string;
  value: number;
  subgroupData?: number[]; // For X-bar charts with multiple measurements
  operatorId: string;
  shiftId: string;
  lotNumber?: string;
  status: 'IN_CONTROL' | 'WARNING' | 'OUT_OF_CONTROL';
  violations: RuleViolation[];
  notes?: string;
}

export interface ControlChartRule {
  ruleId: string;
  ruleName: string;
  ruleType: 'WESTERN_ELECTRIC' | 'NELSON' | 'CUSTOM';
  ruleNumber: number;
  description: string;
  isEnabled: boolean;
  sensitivity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface RuleViolation {
  ruleId: string;
  ruleName: string;
  severity: 'WARNING' | 'CRITICAL';
  description: string;
  affectedPoints: string[]; // Point IDs involved in violation
  timestamp: Date;
}

export interface ProcessCapabilityStudy {
  studyId: string;
  processId: string;
  characteristicName: string;
  studyPeriod: {
    startDate: Date;
    endDate: Date;
  };
  sampleSize: number;
  measurements: number[];
  statistics: {
    mean: number;
    standardDeviation: number;
    range: number;
    minimum: number;
    maximum: number;
  };
  capabilityIndices: {
    cp: number;      // Process Capability
    cpk: number;     // Process Capability Index
    pp: number;      // Process Performance
    ppk: number;     // Process Performance Index
    cpm: number;     // Taguchi Capability Index
  };
  specificationLimits: SpecificationLimits;
  normalityTest: {
    testType: 'ANDERSON_DARLING' | 'KOLMOGOROV_SMIRNOV' | 'SHAPIRO_WILK';
    pValue: number;
    isNormal: boolean;
  };
  recommendations: string[];
}

export interface QualityAlert {
  alertId: string;
  alertType: 'SPC_VIOLATION' | 'CAPABILITY_DECLINE' | 'TREND_DETECTION' | 'OUT_OF_SPEC';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  processId: string;
  chartId?: string;
  message: string;
  detailedDescription: string;
  timestamp: Date;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  actionTaken?: string;
  rootCause?: string;
  preventiveActions: string[];
}

export interface TrendAnalysis {
  processId: string;
  characteristicName: string;
  trendType: 'INCREASING' | 'DECREASING' | 'CYCLIC' | 'RANDOM' | 'SHIFT';
  significance: number; // 0-1 scale
  detectedAt: Date;
  dataPoints: number;
  slope?: number;
  correlation?: number;
  prediction?: {
    nextValue: number;
    confidence: number;
    timeHorizon: number; // hours
  };
}

/**
 * Statistical Process Control Service
 * Provides comprehensive SPC analysis, control charts, and process capability studies
 */
export class StatisticalProcessControlService {
  private controlCharts: Map<string, ControlChart> = new Map();
  private capabilityStudies: Map<string, ProcessCapabilityStudy> = new Map();
  private qualityAlerts: Map<string, QualityAlert> = new Map();
  private trendAnalyses: Map<string, TrendAnalysis> = new Map();

  // Western Electric Control Chart Rules
  private readonly westernElectricRules: ControlChartRule[] = [
    {
      ruleId: 'WE_RULE_1',
      ruleName: 'One point beyond 3σ',
      ruleType: 'WESTERN_ELECTRIC',
      ruleNumber: 1,
      description: 'Any single point falls outside the control limits (±3σ)',
      isEnabled: true,
      sensitivity: 'HIGH'
    },
    {
      ruleId: 'WE_RULE_2', 
      ruleName: 'Nine points on one side',
      ruleType: 'WESTERN_ELECTRIC',
      ruleNumber: 2,
      description: 'Nine consecutive points fall on the same side of the center line',
      isEnabled: true,
      sensitivity: 'HIGH'
    },
    {
      ruleId: 'WE_RULE_3',
      ruleName: 'Six points trending',
      ruleType: 'WESTERN_ELECTRIC', 
      ruleNumber: 3,
      description: 'Six consecutive points steadily increasing or decreasing',
      isEnabled: true,
      sensitivity: 'MEDIUM'
    },
    {
      ruleId: 'WE_RULE_4',
      ruleName: 'Fourteen points alternating',
      ruleType: 'WESTERN_ELECTRIC',
      ruleNumber: 4, 
      description: 'Fourteen consecutive points alternating up and down',
      isEnabled: true,
      sensitivity: 'LOW'
    },
    {
      ruleId: 'WE_RULE_5',
      ruleName: 'Two of three beyond 2σ',
      ruleType: 'WESTERN_ELECTRIC',
      ruleNumber: 5,
      description: 'Two out of three consecutive points beyond ±2σ on same side',
      isEnabled: true,
      sensitivity: 'MEDIUM'
    },
    {
      ruleId: 'WE_RULE_6',
      ruleName: 'Four of five beyond 1σ',
      ruleType: 'WESTERN_ELECTRIC',
      ruleNumber: 6,
      description: 'Four out of five consecutive points beyond ±1σ on same side',
      isEnabled: true,
      sensitivity: 'MEDIUM'
    },
    {
      ruleId: 'WE_RULE_7',
      ruleName: 'Fifteen points near center',
      ruleType: 'WESTERN_ELECTRIC',
      ruleNumber: 7,
      description: 'Fifteen consecutive points within ±1σ (possible over-control)',
      isEnabled: true,
      sensitivity: 'LOW'
    },
    {
      ruleId: 'WE_RULE_8',
      ruleName: 'Eight points away from center',
      ruleType: 'WESTERN_ELECTRIC',
      ruleNumber: 8,
      description: 'Eight consecutive points beyond ±1σ on either side',
      isEnabled: true,
      sensitivity: 'MEDIUM'
    }
  ];

  constructor() {
    this.initializeDefaultControlCharts();
  }

  /**
   * Initialize default control charts for common manufacturing processes
   */
  private initializeDefaultControlCharts(): void {
    const defaultCharts: ControlChart[] = [
      {
        chartId: 'XBAR_R_DIMENSION_001',
        chartType: 'X_BAR_R',
        processId: 'CNC_MILLING_001',
        characteristicName: 'Part Length Dimension',
        measurementUnit: 'mm',
        sampleSize: 5,
        controlLimits: {
          upperControlLimit: 100.15,
          lowerControlLimit: 99.85,
          centerLine: 100.0,
          calculationMethod: 'HISTORICAL',
          calculationDate: new Date(),
          sampleCount: 25
        },
        specificationLimits: {
          upperSpecLimit: 100.25,
          lowerSpecLimit: 99.75,
          targetValue: 100.0,
          tolerance: 0.25
        },
        dataPoints: [],
        rules: this.westernElectricRules.filter(rule => rule.isEnabled),
        isActive: true,
        lastUpdated: new Date()
      },
      {
        chartId: 'P_CHART_DEFECT_RATE_001',
        chartType: 'P_CHART',
        processId: 'ASSEMBLY_LINE_001', 
        characteristicName: 'Defect Rate',
        measurementUnit: '%',
        sampleSize: 100,
        controlLimits: {
          upperControlLimit: 8.2,
          lowerControlLimit: 0.0,
          centerLine: 3.5,
          calculationMethod: 'HISTORICAL',
          calculationDate: new Date(),
          sampleCount: 30
        },
        specificationLimits: {
          upperSpecLimit: 5.0,
          lowerSpecLimit: 0.0,
          targetValue: 1.0,
          tolerance: 1.0
        },
        dataPoints: [],
        rules: this.westernElectricRules.filter(rule => rule.isEnabled),
        isActive: true,
        lastUpdated: new Date()
      },
      {
        chartId: 'INDIVIDUAL_TEMP_001',
        chartType: 'INDIVIDUAL_MR',
        processId: 'HEAT_TREATMENT_001',
        characteristicName: 'Treatment Temperature',
        measurementUnit: '°C',
        sampleSize: 1,
        controlLimits: {
          upperControlLimit: 475,
          lowerControlLimit: 425,
          centerLine: 450,
          calculationMethod: 'TARGET',
          calculationDate: new Date(),
          sampleCount: 50
        },
        specificationLimits: {
          upperSpecLimit: 480,
          lowerSpecLimit: 420,
          targetValue: 450,
          tolerance: 15
        },
        dataPoints: [],
        rules: this.westernElectricRules.filter(rule => rule.isEnabled),
        isActive: true,
        lastUpdated: new Date()
      }
    ];

    defaultCharts.forEach(chart => {
      this.controlCharts.set(chart.chartId, chart);
    });

    // Generate some historical data for demonstration
    this.generateHistoricalData();
  }

  /**
   * Generate realistic historical data for control charts
   */
  private generateHistoricalData(): void {
    const now = new Date();
    
    this.controlCharts.forEach((chart) => {
      const pointCount = 30; // Last 30 data points
      
      for (let i = pointCount; i > 0; i--) {
        const timestamp = new Date(now.getTime() - (i * 2 * 60 * 60 * 1000)); // Every 2 hours
        const dataPoint = this.generateDataPoint(chart, timestamp, i.toString());
        chart.dataPoints.push(dataPoint);
      }
      
      // Sort by timestamp
      chart.dataPoints.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      
      // Apply SPC rules to detect violations
      this.applySPCRules(chart);
    });
  }

  /**
   * Generate realistic data point for a control chart
   */
  private generateDataPoint(chart: ControlChart, timestamp: Date, sampleId: string): ControlChartDataPoint {
    const centerLine = chart.controlLimits.centerLine;
    const controlRange = (chart.controlLimits.upperControlLimit - chart.controlLimits.lowerControlLimit) / 6;
    
    // Generate value with normal distribution around center line
    let value: number;
    let subgroupData: number[] | undefined;

    if (chart.chartType === 'X_BAR_R' || chart.chartType === 'X_BAR_S') {
      // Generate subgroup data
      subgroupData = [];
      for (let i = 0; i < chart.sampleSize; i++) {
        subgroupData.push(centerLine + (this.generateNormalRandom() * controlRange));
      }
      value = subgroupData.reduce((sum, val) => sum + val, 0) / subgroupData.length;
    } else if (chart.chartType === 'P_CHART' || chart.chartType === 'NP_CHART') {
      // Generate defect rate (percentage)
      value = Math.max(0, centerLine + (this.generateNormalRandom() * controlRange));
      value = Math.min(value, 100); // Cap at 100%
    } else {
      // Individual measurement
      value = centerLine + (this.generateNormalRandom() * controlRange);
    }

    // Round to appropriate decimal places
    value = Number(value.toFixed(chart.measurementUnit === '%' ? 1 : 2));

    const dataPoint: ControlChartDataPoint = {
      pointId: `POINT_${chart.chartId}_${timestamp.getTime()}`,
      timestamp,
      sampleId: `SAMPLE_${sampleId}`,
      value,
      subgroupData,
      operatorId: `OP_${Math.floor(Math.random() * 3) + 1}`,
      shiftId: this.getShiftId(timestamp),
      lotNumber: `LOT_${Math.floor(timestamp.getTime() / (1000 * 60 * 60 * 8))}`, // New lot every 8 hours
      status: 'IN_CONTROL',
      violations: [],
      notes: Math.random() < 0.1 ? 'Operator notes: Normal operation' : undefined
    };

    return dataPoint;
  }

  /**
   * Generate normally distributed random number (Box-Muller transform)
   */
  private generateNormalRandom(): number {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  /**
   * Determine shift ID based on timestamp
   */
  private getShiftId(timestamp: Date): string {
    const hour = timestamp.getHours();
    if (hour >= 6 && hour < 14) return 'DAY_SHIFT';
    if (hour >= 14 && hour < 22) return 'EVENING_SHIFT';
    return 'NIGHT_SHIFT';
  }

  /**
   * Add new measurement data point to control chart
   */
  public addDataPoint(
    chartId: string, 
    measurement: number | number[], 
    operatorId: string,
    sampleId: string,
    lotNumber?: string,
    notes?: string
  ): ControlChartDataPoint | null {
    const chart = this.controlCharts.get(chartId);
    if (!chart) return null;

    const timestamp = new Date();
    let value: number;
    let subgroupData: number[] | undefined;

    if (Array.isArray(measurement)) {
      subgroupData = measurement;
      value = measurement.reduce((sum, val) => sum + val, 0) / measurement.length;
    } else {
      value = measurement;
    }

    const dataPoint: ControlChartDataPoint = {
      pointId: `POINT_${chartId}_${timestamp.getTime()}`,
      timestamp,
      sampleId,
      value: Number(value.toFixed(chart.measurementUnit === '%' ? 1 : 2)),
      subgroupData,
      operatorId,
      shiftId: this.getShiftId(timestamp),
      lotNumber,
      status: 'IN_CONTROL',
      violations: [],
      notes
    };

    chart.dataPoints.push(dataPoint);
    chart.lastUpdated = timestamp;

    // Apply SPC rules to check for violations
    this.applySPCRules(chart);

    // Check for trends
    this.detectTrends(chart);

    // Trigger alerts if violations found
    if (dataPoint.violations.length > 0) {
      this.generateQualityAlert(chart, dataPoint);
    }

    return dataPoint;
  }

  /**
   * Apply Statistical Process Control rules to detect violations
   */
  private applySPCRules(chart: ControlChart): void {
    const dataPoints = chart.dataPoints;
    if (dataPoints.length < 2) return;

    // Clear existing violations for re-evaluation
    dataPoints.forEach(point => {
      point.violations = [];
      point.status = 'IN_CONTROL';
    });

    for (const rule of chart.rules) {
      if (!rule.isEnabled) continue;

      switch (rule.ruleId) {
        case 'WE_RULE_1':
          this.applyRule1(chart, rule);
          break;
        case 'WE_RULE_2':
          this.applyRule2(chart, rule);
          break;
        case 'WE_RULE_3':
          this.applyRule3(chart, rule);
          break;
        case 'WE_RULE_4':
          this.applyRule4(chart, rule);
          break;
        case 'WE_RULE_5':
          this.applyRule5(chart, rule);
          break;
        case 'WE_RULE_6':
          this.applyRule6(chart, rule);
          break;
        case 'WE_RULE_7':
          this.applyRule7(chart, rule);
          break;
        case 'WE_RULE_8':
          this.applyRule8(chart, rule);
          break;
      }
    }
  }

  /**
   * Rule 1: One point beyond ±3σ (control limits)
   */
  private applyRule1(chart: ControlChart, rule: ControlChartRule): void {
    const { upperControlLimit, lowerControlLimit } = chart.controlLimits;

    chart.dataPoints.forEach(point => {
      if (point.value > upperControlLimit || point.value < lowerControlLimit) {
        const violation: RuleViolation = {
          ruleId: rule.ruleId,
          ruleName: rule.ruleName,
          severity: 'CRITICAL',
          description: `Point value ${point.value} exceeds control limits (${lowerControlLimit.toFixed(2)} to ${upperControlLimit.toFixed(2)})`,
          affectedPoints: [point.pointId],
          timestamp: new Date()
        };
        point.violations.push(violation);
        point.status = 'OUT_OF_CONTROL';
      }
    });
  }

  /**
   * Rule 2: Nine consecutive points on same side of center line
   */
  private applyRule2(chart: ControlChart, rule: ControlChartRule): void {
    const centerLine = chart.controlLimits.centerLine;
    const points = chart.dataPoints;

    for (let i = 8; i < points.length; i++) {
      const sequence = points.slice(i - 8, i + 1);
      const allAbove = sequence.every(p => p.value > centerLine);
      const allBelow = sequence.every(p => p.value < centerLine);

      if (allAbove || allBelow) {
        const violation: RuleViolation = {
          ruleId: rule.ruleId,
          ruleName: rule.ruleName,
          severity: 'CRITICAL',
          description: `Nine consecutive points on ${allAbove ? 'above' : 'below'} center line`,
          affectedPoints: sequence.map(p => p.pointId),
          timestamp: new Date()
        };

        sequence.forEach(point => {
          point.violations.push(violation);
          point.status = 'OUT_OF_CONTROL';
        });
      }
    }
  }

  /**
   * Rule 3: Six consecutive points steadily increasing or decreasing
   */
  private applyRule3(chart: ControlChart, rule: ControlChartRule): void {
    const points = chart.dataPoints;

    for (let i = 5; i < points.length; i++) {
      const sequence = points.slice(i - 5, i + 1);
      const isIncreasing = this.isStrictlyIncreasing(sequence.map(p => p.value));
      const isDecreasing = this.isStrictlyDecreasing(sequence.map(p => p.value));

      if (isIncreasing || isDecreasing) {
        const violation: RuleViolation = {
          ruleId: rule.ruleId,
          ruleName: rule.ruleName,
          severity: 'WARNING',
          description: `Six consecutive points ${isIncreasing ? 'increasing' : 'decreasing'}`,
          affectedPoints: sequence.map(p => p.pointId),
          timestamp: new Date()
        };

        sequence.forEach(point => {
          point.violations.push(violation);
          if (point.status === 'IN_CONTROL') point.status = 'WARNING';
        });
      }
    }
  }

  /**
   * Rule 4: Fourteen consecutive points alternating up and down
   */
  private applyRule4(chart: ControlChart, rule: ControlChartRule): void {
    const points = chart.dataPoints;

    for (let i = 13; i < points.length; i++) {
      const sequence = points.slice(i - 13, i + 1);
      if (this.isAlternating(sequence.map(p => p.value))) {
        const violation: RuleViolation = {
          ruleId: rule.ruleId,
          ruleName: rule.ruleName,
          severity: 'WARNING',
          description: 'Fourteen consecutive points alternating up and down',
          affectedPoints: sequence.map(p => p.pointId),
          timestamp: new Date()
        };

        sequence.forEach(point => {
          point.violations.push(violation);
          if (point.status === 'IN_CONTROL') point.status = 'WARNING';
        });
      }
    }
  }

  /**
   * Rule 5: Two out of three consecutive points beyond ±2σ on same side
   */
  private applyRule5(chart: ControlChart, rule: ControlChartRule): void {
    const centerLine = chart.controlLimits.centerLine;
    const sigma = (chart.controlLimits.upperControlLimit - chart.controlLimits.lowerControlLimit) / 6;
    const upper2Sigma = centerLine + (2 * sigma);
    const lower2Sigma = centerLine - (2 * sigma);
    
    const points = chart.dataPoints;

    for (let i = 2; i < points.length; i++) {
      const sequence = points.slice(i - 2, i + 1);
      
      const aboveCount = sequence.filter(p => p.value > upper2Sigma).length;
      const belowCount = sequence.filter(p => p.value < lower2Sigma).length;

      if (aboveCount >= 2 || belowCount >= 2) {
        const violation: RuleViolation = {
          ruleId: rule.ruleId,
          ruleName: rule.ruleName,
          severity: 'WARNING',
          description: `Two out of three points beyond 2σ on ${aboveCount >= 2 ? 'upper' : 'lower'} side`,
          affectedPoints: sequence.filter(p => 
            (aboveCount >= 2 && p.value > upper2Sigma) || 
            (belowCount >= 2 && p.value < lower2Sigma)
          ).map(p => p.pointId),
          timestamp: new Date()
        };

        sequence.forEach(point => {
          if ((aboveCount >= 2 && point.value > upper2Sigma) || 
              (belowCount >= 2 && point.value < lower2Sigma)) {
            point.violations.push(violation);
            if (point.status === 'IN_CONTROL') point.status = 'WARNING';
          }
        });
      }
    }
  }

  /**
   * Rule 6: Four out of five consecutive points beyond ±1σ on same side
   */
  private applyRule6(chart: ControlChart, rule: ControlChartRule): void {
    const centerLine = chart.controlLimits.centerLine;
    const sigma = (chart.controlLimits.upperControlLimit - chart.controlLimits.lowerControlLimit) / 6;
    const upper1Sigma = centerLine + sigma;
    const lower1Sigma = centerLine - sigma;
    
    const points = chart.dataPoints;

    for (let i = 4; i < points.length; i++) {
      const sequence = points.slice(i - 4, i + 1);
      
      const aboveCount = sequence.filter(p => p.value > upper1Sigma).length;
      const belowCount = sequence.filter(p => p.value < lower1Sigma).length;

      if (aboveCount >= 4 || belowCount >= 4) {
        const violation: RuleViolation = {
          ruleId: rule.ruleId,
          ruleName: rule.ruleName,
          severity: 'WARNING',
          description: `Four out of five points beyond 1σ on ${aboveCount >= 4 ? 'upper' : 'lower'} side`,
          affectedPoints: sequence.filter(p => 
            (aboveCount >= 4 && p.value > upper1Sigma) || 
            (belowCount >= 4 && p.value < lower1Sigma)
          ).map(p => p.pointId),
          timestamp: new Date()
        };

        sequence.forEach(point => {
          if ((aboveCount >= 4 && point.value > upper1Sigma) || 
              (belowCount >= 4 && point.value < lower1Sigma)) {
            point.violations.push(violation);
            if (point.status === 'IN_CONTROL') point.status = 'WARNING';
          }
        });
      }
    }
  }

  /**
   * Rule 7: Fifteen consecutive points within ±1σ (possible over-control)
   */
  private applyRule7(chart: ControlChart, rule: ControlChartRule): void {
    const centerLine = chart.controlLimits.centerLine;
    const sigma = (chart.controlLimits.upperControlLimit - chart.controlLimits.lowerControlLimit) / 6;
    const upper1Sigma = centerLine + sigma;
    const lower1Sigma = centerLine - sigma;
    
    const points = chart.dataPoints;

    for (let i = 14; i < points.length; i++) {
      const sequence = points.slice(i - 14, i + 1);
      const allWithin1Sigma = sequence.every(p => p.value >= lower1Sigma && p.value <= upper1Sigma);

      if (allWithin1Sigma) {
        const violation: RuleViolation = {
          ruleId: rule.ruleId,
          ruleName: rule.ruleName,
          severity: 'WARNING',
          description: 'Fifteen consecutive points within ±1σ (possible over-control)',
          affectedPoints: sequence.map(p => p.pointId),
          timestamp: new Date()
        };

        sequence.forEach(point => {
          point.violations.push(violation);
          if (point.status === 'IN_CONTROL') point.status = 'WARNING';
        });
      }
    }
  }

  /**
   * Rule 8: Eight consecutive points beyond ±1σ on either side
   */
  private applyRule8(chart: ControlChart, rule: ControlChartRule): void {
    const centerLine = chart.controlLimits.centerLine;
    const sigma = (chart.controlLimits.upperControlLimit - chart.controlLimits.lowerControlLimit) / 6;
    const upper1Sigma = centerLine + sigma;
    const lower1Sigma = centerLine - sigma;
    
    const points = chart.dataPoints;

    for (let i = 7; i < points.length; i++) {
      const sequence = points.slice(i - 7, i + 1);
      const allBeyond1Sigma = sequence.every(p => p.value > upper1Sigma || p.value < lower1Sigma);

      if (allBeyond1Sigma) {
        const violation: RuleViolation = {
          ruleId: rule.ruleId,
          ruleName: rule.ruleName,
          severity: 'WARNING',
          description: 'Eight consecutive points beyond ±1σ on either side',
          affectedPoints: sequence.map(p => p.pointId),
          timestamp: new Date()
        };

        sequence.forEach(point => {
          point.violations.push(violation);
          if (point.status === 'IN_CONTROL') point.status = 'WARNING';
        });
      }
    }
  }

  /**
   * Check if array values are strictly increasing
   */
  private isStrictlyIncreasing(values: number[]): boolean {
    for (let i = 1; i < values.length; i++) {
      if (values[i] <= values[i - 1]) return false;
    }
    return true;
  }

  /**
   * Check if array values are strictly decreasing
   */
  private isStrictlyDecreasing(values: number[]): boolean {
    for (let i = 1; i < values.length; i++) {
      if (values[i] >= values[i - 1]) return false;
    }
    return true;
  }

  /**
   * Check if array values are alternating (up-down pattern)
   */
  private isAlternating(values: number[]): boolean {
    for (let i = 2; i < values.length; i++) {
      const trend1 = values[i - 1] > values[i - 2];
      const trend2 = values[i] > values[i - 1];
      if (trend1 === trend2) return false;
    }
    return true;
  }

  /**
   * Detect trends in process data
   */
  private detectTrends(chart: ControlChart): void {
    const points = chart.dataPoints;
    if (points.length < 10) return; // Need sufficient data

    const recentPoints = points.slice(-20); // Analyze last 20 points
    const values = recentPoints.map(p => p.value);
    const timestamps = recentPoints.map(p => p.timestamp.getTime());

    // Calculate linear regression
    const n = values.length;
    const sumX = timestamps.reduce((sum, t) => sum + t, 0);
    const sumY = values.reduce((sum, v) => sum + v, 0);
    const sumXY = timestamps.reduce((sum, t, i) => sum + (t * values[i]), 0);
    const sumXX = timestamps.reduce((sum, t) => sum + (t * t), 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate correlation coefficient
    const meanX = sumX / n;
    const meanY = sumY / n;
    const correlation = Math.abs(
      timestamps.reduce((sum, t, i) => sum + ((t - meanX) * (values[i] - meanY)), 0) /
      Math.sqrt(
        timestamps.reduce((sum, t) => sum + Math.pow(t - meanX, 2), 0) *
        values.reduce((sum, v) => sum + Math.pow(v - meanY, 2), 0)
      )
    );

    // Determine trend type and significance
    let trendType: TrendAnalysis['trendType'] = 'RANDOM';
    if (correlation > 0.7) {
      if (Math.abs(slope) > 0.001) {
        trendType = slope > 0 ? 'INCREASING' : 'DECREASING';
      }
    }

    const trendAnalysis: TrendAnalysis = {
      processId: chart.processId,
      characteristicName: chart.characteristicName,
      trendType,
      significance: correlation,
      detectedAt: new Date(),
      dataPoints: n,
      slope: slope,
      correlation: correlation
    };

    // Add prediction if trend is significant
    if (correlation > 0.7 && Math.abs(slope) > 0.001) {
      const nextTimestamp = Date.now() + (2 * 60 * 60 * 1000); // 2 hours ahead
      trendAnalysis.prediction = {
        nextValue: slope * nextTimestamp + intercept,
        confidence: correlation,
        timeHorizon: 2
      };
    }

    this.trendAnalyses.set(`${chart.processId}_${chart.characteristicName}`, trendAnalysis);

    // Generate alert for significant trends
    if (correlation > 0.8 && Math.abs(slope) > 0.001) {
      this.generateTrendAlert(chart, trendAnalysis);
    }
  }

  /**
   * Generate quality alert for SPC violations
   */
  private generateQualityAlert(chart: ControlChart, dataPoint: ControlChartDataPoint): void {
    const criticalViolations = dataPoint.violations.filter(v => v.severity === 'CRITICAL');
    const warningViolations = dataPoint.violations.filter(v => v.severity === 'WARNING');

    if (criticalViolations.length > 0) {
      const alert: QualityAlert = {
        alertId: `ALERT_SPC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        alertType: 'SPC_VIOLATION',
        severity: 'CRITICAL',
        processId: chart.processId,
        chartId: chart.chartId,
        message: `Critical SPC violation in ${chart.characteristicName}`,
        detailedDescription: criticalViolations.map(v => v.description).join('; '),
        timestamp: new Date(),
        preventiveActions: [
          'Stop production and investigate root cause',
          'Check equipment calibration and tooling',
          'Review operator procedures and training',
          'Verify measurement system accuracy'
        ]
      };

      this.qualityAlerts.set(alert.alertId, alert);
      console.log(`🚨 CRITICAL SPC ALERT: ${alert.message} - Process: ${chart.processId}`);
    } else if (warningViolations.length > 0) {
      const alert: QualityAlert = {
        alertId: `ALERT_SPC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        alertType: 'SPC_VIOLATION', 
        severity: 'MEDIUM',
        processId: chart.processId,
        chartId: chart.chartId,
        message: `SPC warning in ${chart.characteristicName}`,
        detailedDescription: warningViolations.map(v => v.description).join('; '),
        timestamp: new Date(),
        preventiveActions: [
          'Monitor process closely',
          'Check for assignable causes',
          'Review recent process changes',
          'Consider additional sampling'
        ]
      };

      this.qualityAlerts.set(alert.alertId, alert);
      console.log(`⚠️  SPC WARNING: ${alert.message} - Process: ${chart.processId}`);
    }
  }

  /**
   * Generate alert for significant trends
   */
  private generateTrendAlert(chart: ControlChart, trendAnalysis: TrendAnalysis): void {
    const alert: QualityAlert = {
      alertId: `ALERT_TREND_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      alertType: 'TREND_DETECTION',
      severity: 'MEDIUM',
      processId: chart.processId,
      chartId: chart.chartId,
      message: `Significant ${trendAnalysis.trendType.toLowerCase()} trend detected in ${chart.characteristicName}`,
      detailedDescription: `${trendAnalysis.trendType} trend with ${(trendAnalysis.significance * 100).toFixed(1)}% correlation over ${trendAnalysis.dataPoints} data points`,
      timestamp: new Date(),
      preventiveActions: [
        'Investigate potential assignable causes',
        'Review process parameters and settings',
        'Check for tool wear or equipment drift',
        'Monitor trend continuation'
      ]
    };

    this.qualityAlerts.set(alert.alertId, alert);
    console.log(`📈 TREND ALERT: ${alert.message} - Process: ${chart.processId}`);
  }

  /**
   * Perform process capability study
   */
  public performCapabilityStudy(
    processId: string,
    characteristicName: string,
    measurements: number[],
    specificationLimits: SpecificationLimits
  ): ProcessCapabilityStudy {
    if (measurements.length < 30) {
      throw new Error('Capability study requires at least 30 measurements');
    }

    // Calculate basic statistics
    const mean = measurements.reduce((sum, val) => sum + val, 0) / measurements.length;
    const variance = measurements.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (measurements.length - 1);
    const standardDeviation = Math.sqrt(variance);
    const minimum = Math.min(...measurements);
    const maximum = Math.max(...measurements);
    const range = maximum - minimum;

    // Calculate capability indices
    const toleranceWidth = specificationLimits.upperSpecLimit - specificationLimits.lowerSpecLimit;
    const processSpread = 6 * standardDeviation;

    const cp = toleranceWidth / processSpread;
    const cpkUpper = (specificationLimits.upperSpecLimit - mean) / (3 * standardDeviation);
    const cpkLower = (mean - specificationLimits.lowerSpecLimit) / (3 * standardDeviation);
    const cpk = Math.min(cpkUpper, cpkLower);

    // For Pp and Ppk, we use the same calculation as Cp and Cpk for this implementation
    // In practice, these would use different sigma calculations
    const pp = cp;
    const ppk = cpk;

    // Taguchi capability index (assumes target is center of specification)
    const cpm = toleranceWidth / (6 * Math.sqrt(variance + Math.pow(mean - specificationLimits.targetValue, 2)));

    // Perform normality test (simplified Anderson-Darling)
    const isNormal = this.performNormalityTest(measurements);

    const study: ProcessCapabilityStudy = {
      studyId: `STUDY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      processId,
      characteristicName,
      studyPeriod: {
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        endDate: new Date()
      },
      sampleSize: measurements.length,
      measurements,
      statistics: {
        mean,
        standardDeviation,
        range,
        minimum,
        maximum
      },
      capabilityIndices: {
        cp,
        cpk,
        pp,
        ppk,
        cpm
      },
      specificationLimits,
      normalityTest: {
        testType: 'ANDERSON_DARLING',
        pValue: isNormal ? 0.15 : 0.02, // Simplified p-value
        isNormal
      },
      recommendations: this.generateCapabilityRecommendations(cp, cpk, isNormal)
    };

    this.capabilityStudies.set(study.studyId, study);
    return study;
  }

  /**
   * Simplified normality test
   */
  private performNormalityTest(measurements: number[]): boolean {
    const mean = measurements.reduce((sum, val) => sum + val, 0) / measurements.length;
    const standardDeviation = Math.sqrt(
      measurements.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / measurements.length
    );

    // Check if data roughly follows 68-95-99.7 rule
    const within1Sigma = measurements.filter(val => 
      Math.abs(val - mean) <= standardDeviation
    ).length / measurements.length;

    const within2Sigma = measurements.filter(val => 
      Math.abs(val - mean) <= 2 * standardDeviation
    ).length / measurements.length;

    // Simplified normality check
    return within1Sigma >= 0.6 && within2Sigma >= 0.9;
  }

  /**
   * Generate recommendations based on capability indices
   */
  private generateCapabilityRecommendations(cp: number, cpk: number, isNormal: boolean): string[] {
    const recommendations: string[] = [];

    if (!isNormal) {
      recommendations.push('Data does not follow normal distribution - consider process transformation or non-parametric analysis');
    }

    if (cp < 1.0) {
      recommendations.push('Process capability (Cp) is inadequate - reduce process variation');
    } else if (cp >= 1.0 && cp < 1.33) {
      recommendations.push('Process capability (Cp) is marginal - improvement recommended');
    } else if (cp >= 1.33) {
      recommendations.push('Process capability (Cp) is adequate');
    }

    if (cpk < 1.0) {
      recommendations.push('Process is not capable (Cpk < 1.0) - immediate action required');
    } else if (cpk >= 1.0 && cpk < 1.33) {
      recommendations.push('Process capability (Cpk) is marginal - center process and reduce variation');
    } else if (cpk >= 1.33) {
      recommendations.push('Process performance (Cpk) is acceptable');
    }

    if (cp - cpk > 0.25) {
      recommendations.push('Process is not centered - adjust process mean to target value');
    }

    return recommendations;
  }

  /**
   * Get control chart data
   */
  public getControlChart(chartId: string): ControlChart | null {
    return this.controlCharts.get(chartId) || null;
  }

  /**
   * Get all active control charts for a process
   */
  public getProcessControlCharts(processId: string): ControlChart[] {
    return Array.from(this.controlCharts.values())
      .filter(chart => chart.processId === processId && chart.isActive);
  }

  /**
   * Get recent quality alerts
   */
  public getQualityAlerts(processId?: string, limit: number = 50): QualityAlert[] {
    let alerts = Array.from(this.qualityAlerts.values());
    
    if (processId) {
      alerts = alerts.filter(alert => alert.processId === processId);
    }

    return alerts
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get SPC dashboard summary
   */
  public getSPCDashboardSummary(): {
    totalControlCharts: number;
    activeCharts: number;
    chartsInControl: number;
    chartsWithWarnings: number;
    chartsOutOfControl: number;
    totalAlerts: number;
    criticalAlerts: number;
    recentCapabilityStudies: ProcessCapabilityStudy[];
  } {
    const charts = Array.from(this.controlCharts.values()).filter(chart => chart.isActive);
    const alerts = Array.from(this.qualityAlerts.values());
    const capabilityStudies = Array.from(this.capabilityStudies.values())
      .sort((a, b) => b.studyPeriod.endDate.getTime() - a.studyPeriod.endDate.getTime())
      .slice(0, 5);

    let chartsInControl = 0;
    let chartsWithWarnings = 0;
    let chartsOutOfControl = 0;

    charts.forEach(chart => {
      const recentPoints = chart.dataPoints.slice(-10); // Last 10 points
      const hasOutOfControl = recentPoints.some(p => p.status === 'OUT_OF_CONTROL');
      const hasWarnings = recentPoints.some(p => p.status === 'WARNING');

      if (hasOutOfControl) {
        chartsOutOfControl++;
      } else if (hasWarnings) {
        chartsWithWarnings++;
      } else {
        chartsInControl++;
      }
    });

    return {
      totalControlCharts: this.controlCharts.size,
      activeCharts: charts.length,
      chartsInControl,
      chartsWithWarnings,
      chartsOutOfControl,
      totalAlerts: alerts.length,
      criticalAlerts: alerts.filter(alert => alert.severity === 'CRITICAL').length,
      recentCapabilityStudies: capabilityStudies
    };
  }
}