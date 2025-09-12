/**
 * Real-Time Data Collection Service for Shop Floor Excellence
 * Phase 3 Implementation - IoT Integration and Live Production Monitoring
 */

import { EventEmitter } from 'events';

// Core business entities for real-time data collection
export interface IoTSensor {
  sensorId: string;
  workCenterId: string;
  sensorType: 'TEMPERATURE' | 'PRESSURE' | 'VIBRATION' | 'SPEED' | 'COUNT' | 'QUALITY';
  location: string;
  calibrationDate: Date;
  alertThresholds: {
    warningMin?: number;
    warningMax?: number;
    criticalMin?: number;
    criticalMax?: number;
  };
  isActive: boolean;
  lastReading?: SensorReading;
}

export interface SensorReading {
  sensorId: string;
  timestamp: Date;
  value: number;
  unit: string;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
  qualityFlag: 'GOOD' | 'QUESTIONABLE' | 'BAD';
}

export interface ProductionEvent {
  eventId: string;
  workOrderId: string;
  workCenterId: string;
  operationId: string;
  eventType: 'START' | 'COMPLETE' | 'PAUSE' | 'RESUME' | 'QUALITY_CHECK' | 'MAINTENANCE';
  timestamp: Date;
  operatorId?: string;
  quantityReported?: number;
  qualityStatus?: 'PASS' | 'FAIL' | 'REWORK';
  notes?: string;
}

export interface WorkCenterStatus {
  workCenterId: string;
  status: 'RUNNING' | 'IDLE' | 'DOWN' | 'MAINTENANCE' | 'CHANGEOVER';
  currentWorkOrder?: string;
  currentOperation?: string;
  utilizationPercent: number;
  efficiencyPercent: number;
  qualityPercent: number;
  lastUpdate: Date;
  alarmCount: number;
  runningTime: number; // in minutes
  downTime: number; // in minutes
}

export interface RealTimeAlert {
  alertId: string;
  alertType: 'QUALITY' | 'MAINTENANCE' | 'SAFETY' | 'EFFICIENCY' | 'CAPACITY';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  workCenterId: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
}

/**
 * Real-Time Data Collection Service
 * Handles IoT sensor integration, production event processing, and live monitoring
 */
export class RealTimeDataCollectionService extends EventEmitter {
  private sensors: Map<string, IoTSensor> = new Map();
  private workCenterStatuses: Map<string, WorkCenterStatus> = new Map();
  private activeAlerts: Map<string, RealTimeAlert> = new Map();
  private productionEvents: ProductionEvent[] = [];
  private dataCollectionInterval?: NodeJS.Timeout;
  
  constructor() {
    super();
    this.initializeDefaultSensors();
    // Initialize work center statuses immediately
    this.initializeWorkCenterStatuses();
    this.startRealTimeCollection();
  }

  /**
   * Initialize default IoT sensors for common work centers
   */
  private initializeDefaultSensors(): void {
    const defaultSensors: IoTSensor[] = [
      {
        sensorId: 'TEMP_001_CNC_01',
        workCenterId: 'CNC_MACHINING_CENTER_01',
        sensorType: 'TEMPERATURE',
        location: 'Spindle Motor',
        calibrationDate: new Date(),
        alertThresholds: { warningMax: 80, criticalMax: 95 },
        isActive: true
      },
      {
        sensorId: 'VIB_001_CNC_01',
        workCenterId: 'CNC_MACHINING_CENTER_01',
        sensorType: 'VIBRATION',
        location: 'Main Spindle',
        calibrationDate: new Date(),
        alertThresholds: { warningMax: 5.0, criticalMax: 8.0 },
        isActive: true
      },
      {
        sensorId: 'COUNT_001_ASM_01',
        workCenterId: 'ASSEMBLY_LINE_01',
        sensorType: 'COUNT',
        location: 'Output Counter',
        calibrationDate: new Date(),
        alertThresholds: { warningMin: 50, criticalMin: 30 },
        isActive: true
      },
      {
        sensorId: 'QUAL_001_ASM_01',
        workCenterId: 'ASSEMBLY_LINE_01',
        sensorType: 'QUALITY',
        location: 'Final Inspection',
        calibrationDate: new Date(),
        alertThresholds: { warningMin: 95, criticalMin: 90 },
        isActive: true
      }
    ];

    defaultSensors.forEach(sensor => {
      this.sensors.set(sensor.sensorId, sensor);
    });
  }

  /**
   * Initialize work center statuses immediately on startup
   */
  private initializeWorkCenterStatuses(): void {
    // Immediately collect initial sensor data and set up work center statuses
    this.collectSensorData();
    this.updateWorkCenterStatuses();
  }

  /**
   * Start real-time data collection from IoT sensors
   */
  private startRealTimeCollection(): void {
    this.dataCollectionInterval = setInterval(() => {
      this.collectSensorData();
      this.updateWorkCenterStatuses();
      this.processAlerts();
    }, 5000); // Collect data every 5 seconds
  }

  /**
   * Simulate IoT sensor data collection (in real implementation, this would connect to actual IoT devices)
   */
  private collectSensorData(): void {
    const now = new Date();
    
    this.sensors.forEach((sensor) => {
      if (!sensor.isActive) return;

      // Simulate sensor readings with realistic business logic
      const reading: SensorReading = {
        sensorId: sensor.sensorId,
        timestamp: now,
        value: this.generateRealisticSensorValue(sensor),
        unit: this.getSensorUnit(sensor.sensorType),
        status: 'NORMAL',
        qualityFlag: 'GOOD'
      };

      // Apply business rules for sensor status determination
      reading.status = this.evaluateSensorStatus(sensor, reading.value);
      reading.qualityFlag = this.evaluateDataQuality(sensor, reading.value);

      // Update sensor with latest reading
      sensor.lastReading = reading;

      // Generate alerts if thresholds are exceeded
      this.checkSensorAlerts(sensor, reading);

      // Emit real-time data event
      this.emit('sensorData', reading);
    });
  }

  /**
   * Generate realistic sensor values based on sensor type and business context
   */
  private generateRealisticSensorValue(sensor: IoTSensor): number {
    const baseValues = {
      'TEMPERATURE': 65 + Math.random() * 20, // 65-85°C typical for manufacturing
      'PRESSURE': 25 + Math.random() * 10,    // 25-35 PSI
      'VIBRATION': 2.5 + Math.random() * 2,   // 2.5-4.5 mm/s
      'SPEED': 1800 + Math.random() * 400,    // 1800-2200 RPM
      'COUNT': Math.floor(Math.random() * 100), // 0-100 parts per interval
      'QUALITY': 96 + Math.random() * 3       // 96-99% quality rate
    };

    return Number((baseValues[sensor.sensorType] || 0).toFixed(2));
  }

  /**
   * Get appropriate unit for sensor type
   */
  private getSensorUnit(sensorType: IoTSensor['sensorType']): string {
    const units = {
      'TEMPERATURE': '°C',
      'PRESSURE': 'PSI',
      'VIBRATION': 'mm/s',
      'SPEED': 'RPM',
      'COUNT': 'parts',
      'QUALITY': '%'
    };

    return units[sensorType] || '';
  }

  /**
   * Evaluate sensor status based on thresholds
   */
  private evaluateSensorStatus(sensor: IoTSensor, value: number): SensorReading['status'] {
    const thresholds = sensor.alertThresholds;
    
    if ((thresholds.criticalMax && value > thresholds.criticalMax) ||
        (thresholds.criticalMin && value < thresholds.criticalMin)) {
      return 'CRITICAL';
    }
    
    if ((thresholds.warningMax && value > thresholds.warningMax) ||
        (thresholds.warningMin && value < thresholds.warningMin)) {
      return 'WARNING';
    }
    
    return 'NORMAL';
  }

  /**
   * Evaluate data quality based on sensor characteristics
   */
  private evaluateDataQuality(sensor: IoTSensor, value: number): SensorReading['qualityFlag'] {
    // Business logic for data quality assessment
    const daysSinceCalibration = Math.floor((Date.now() - sensor.calibrationDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceCalibration > 365) {
      return 'QUESTIONABLE'; // Needs recalibration
    }
    
    // Check for impossible values that indicate sensor malfunction
    if (value <= 0 || value > 10000) {
      return 'BAD';
    }
    
    return 'GOOD';
  }

  /**
   * Check sensor readings against thresholds and generate alerts
   */
  private checkSensorAlerts(sensor: IoTSensor, reading: SensorReading): void {
    if (reading.status === 'CRITICAL' || reading.status === 'WARNING') {
      const alertId = `ALERT_${sensor.sensorId}_${Date.now()}`;
      
      const alert: RealTimeAlert = {
        alertId,
        alertType: this.mapSensorTypeToAlertType(sensor.sensorType),
        severity: reading.status === 'CRITICAL' ? 'CRITICAL' : 'WARNING',
        workCenterId: sensor.workCenterId,
        message: `${sensor.sensorType} sensor ${sensor.sensorId} reading ${reading.value}${reading.unit} exceeds threshold at ${sensor.location}`,
        timestamp: reading.timestamp,
        acknowledged: false
      };

      this.activeAlerts.set(alertId, alert);
      this.emit('alert', alert);
    }
  }

  /**
   * Map sensor types to alert types for business context
   */
  private mapSensorTypeToAlertType(sensorType: IoTSensor['sensorType']): RealTimeAlert['alertType'] {
    const mapping = {
      'TEMPERATURE': 'MAINTENANCE' as const,
      'PRESSURE': 'SAFETY' as const,
      'VIBRATION': 'MAINTENANCE' as const,
      'SPEED': 'EFFICIENCY' as const,
      'COUNT': 'EFFICIENCY' as const,
      'QUALITY': 'QUALITY' as const
    };

    return mapping[sensorType] || 'MAINTENANCE';
  }

  /**
   * Update work center statuses based on sensor data and production events
   */
  private updateWorkCenterStatuses(): void {
    const workCenterIds = new Set(Array.from(this.sensors.values()).map(s => s.workCenterId));
    
    workCenterIds.forEach(workCenterId => {
      const workCenterSensors = Array.from(this.sensors.values()).filter(s => s.workCenterId === workCenterId);
      const workCenterAlerts = Array.from(this.activeAlerts.values()).filter(a => a.workCenterId === workCenterId);
      
      const status: WorkCenterStatus = {
        workCenterId,
        status: this.determineWorkCenterStatus(workCenterSensors, workCenterAlerts),
        utilizationPercent: this.calculateUtilization(workCenterId),
        efficiencyPercent: this.calculateEfficiency(workCenterId),
        qualityPercent: this.calculateQualityRate(workCenterId),
        lastUpdate: new Date(),
        alarmCount: workCenterAlerts.filter(a => !a.acknowledged).length,
        runningTime: this.calculateRunningTime(workCenterId),
        downTime: this.calculateDownTime(workCenterId)
      };

      this.workCenterStatuses.set(workCenterId, status);
      this.emit('workCenterStatus', status);
    });
  }

  /**
   * Determine work center status based on sensors and alerts
   */
  private determineWorkCenterStatus(sensors: IoTSensor[], alerts: RealTimeAlert[]): WorkCenterStatus['status'] {
    const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL' && !a.acknowledged);
    const maintenanceAlerts = alerts.filter(a => a.alertType === 'MAINTENANCE' && !a.acknowledged);

    if (criticalAlerts.length > 0) {
      return 'DOWN';
    }
    
    if (maintenanceAlerts.length > 0) {
      return 'MAINTENANCE';
    }

    // Check if production is happening based on sensor data
    const productionSensors = sensors.filter(s => s.sensorType === 'COUNT' || s.sensorType === 'SPEED');
    const isProducing = productionSensors.some(s => s.lastReading && s.lastReading.value > 0);

    return isProducing ? 'RUNNING' : 'IDLE';
  }

  /**
   * Calculate work center utilization percentage
   */
  private calculateUtilization(workCenterId: string): number {
    // Business logic: Calculate based on actual vs. planned production time
    // For demo, simulate realistic utilization
    return Math.floor(75 + Math.random() * 20); // 75-95% utilization
  }

  /**
   * Calculate work center efficiency percentage
   */
  private calculateEfficiency(workCenterId: string): number {
    // Business logic: Calculate based on standard vs. actual production rates
    return Math.floor(80 + Math.random() * 15); // 80-95% efficiency
  }

  /**
   * Calculate quality rate percentage for work center
   */
  private calculateQualityRate(workCenterId: string): number {
    const qualitySensors = Array.from(this.sensors.values()).filter(
      s => s.workCenterId === workCenterId && s.sensorType === 'QUALITY'
    );

    if (qualitySensors.length > 0 && qualitySensors[0].lastReading) {
      return qualitySensors[0].lastReading.value;
    }

    return Math.floor(96 + Math.random() * 3); // 96-99% quality
  }

  /**
   * Calculate total running time for work center today
   */
  private calculateRunningTime(workCenterId: string): number {
    // Business logic: Sum up all production time intervals
    // For demo, simulate realistic running time
    return Math.floor(300 + Math.random() * 180); // 5-8 hours
  }

  /**
   * Calculate total down time for work center today
   */
  private calculateDownTime(workCenterId: string): number {
    // Business logic: Sum up all down time intervals
    return Math.floor(30 + Math.random() * 90); // 0.5-2 hours
  }

  /**
   * Process and escalate alerts based on business rules
   */
  private processAlerts(): void {
    const now = new Date();
    
    this.activeAlerts.forEach((alert) => {
      if (!alert.acknowledged) {
        const alertAge = now.getTime() - alert.timestamp.getTime();
        const alertAgeMinutes = alertAge / (1000 * 60);

        // Business rule: Escalate critical alerts after 5 minutes
        if (alert.severity === 'CRITICAL' && alertAgeMinutes > 5) {
          this.emit('alertEscalation', {
            ...alert,
            escalationLevel: 1,
            escalationReason: 'Critical alert unacknowledged for 5 minutes'
          });
        }

        // Business rule: Escalate warning alerts after 30 minutes
        if (alert.severity === 'WARNING' && alertAgeMinutes > 30) {
          this.emit('alertEscalation', {
            ...alert,
            escalationLevel: 1,
            escalationReason: 'Warning alert unacknowledged for 30 minutes'
          });
        }
      }
    });
  }

  /**
   * Record production event (operator input, automatic detection)
   */
  public recordProductionEvent(event: Omit<ProductionEvent, 'eventId' | 'timestamp'>): ProductionEvent {
    const productionEvent: ProductionEvent = {
      eventId: `EVENT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...event
    };

    this.productionEvents.push(productionEvent);
    this.emit('productionEvent', productionEvent);

    return productionEvent;
  }

  /**
   * Acknowledge an alert
   */
  public acknowledgeAlert(alertId: string, acknowledgedBy: string): boolean {
    const alert = this.activeAlerts.get(alertId);
    if (alert) {
      alert.acknowledged = true;
      this.emit('alertAcknowledged', { alertId, acknowledgedBy, timestamp: new Date() });
      return true;
    }
    return false;
  }

  /**
   * Get real-time dashboard data for shop floor
   */
  public getShopFloorDashboardData(): {
    workCenterStatuses: WorkCenterStatus[];
    activeAlerts: RealTimeAlert[];
    recentEvents: ProductionEvent[];
    kpis: {
      overallUtilization: number;
      overallEfficiency: number;
      overallQuality: number;
      totalActiveAlerts: number;
    };
  } {
    const workCenterStatuses = Array.from(this.workCenterStatuses.values());
    const activeAlerts = Array.from(this.activeAlerts.values()).filter(a => !a.acknowledged);
    const recentEvents = this.productionEvents.slice(-20); // Last 20 events

    // Calculate overall KPIs
    const overallUtilization = workCenterStatuses.length > 0 
      ? Math.round(workCenterStatuses.reduce((sum, wc) => sum + wc.utilizationPercent, 0) / workCenterStatuses.length)
      : 0;

    const overallEfficiency = workCenterStatuses.length > 0 
      ? Math.round(workCenterStatuses.reduce((sum, wc) => sum + wc.efficiencyPercent, 0) / workCenterStatuses.length)
      : 0;

    const overallQuality = workCenterStatuses.length > 0 
      ? Math.round(workCenterStatuses.reduce((sum, wc) => sum + wc.qualityPercent, 0) / workCenterStatuses.length)
      : 0;

    return {
      workCenterStatuses,
      activeAlerts,
      recentEvents,
      kpis: {
        overallUtilization,
        overallEfficiency,
        overallQuality,
        totalActiveAlerts: activeAlerts.length
      }
    };
  }

  /**
   * Get sensor data for specific work center
   */
  public getWorkCenterSensorData(workCenterId: string): SensorReading[] {
    return Array.from(this.sensors.values())
      .filter(sensor => sensor.workCenterId === workCenterId && sensor.lastReading)
      .map(sensor => sensor.lastReading!);
  }

  /**
   * Stop real-time data collection
   */
  public stop(): void {
    if (this.dataCollectionInterval) {
      clearInterval(this.dataCollectionInterval);
    }
  }
}