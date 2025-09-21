/**
 * Enterprise Performance Monitoring and Metrics System
 * Comprehensive performance tracking and business metrics
 */

import { v4 as uuidv4 } from 'uuid';
import { getLogger } from '../utils/enterprise-logger';
import { PERFORMANCE_CONSTANTS, BUSINESS_METRICS } from '../constants/business-constants';

// ============================================================================
// CORE PERFORMANCE INTERFACES
// ============================================================================

export interface PerformanceMetric {
  id: string;
  name: string;
  category: 'PERFORMANCE' | 'BUSINESS' | 'SYSTEM' | 'USER_EXPERIENCE';
  value: number;
  unit: 'ms' | 'seconds' | 'count' | 'bytes' | 'percentage' | 'rate' | 'currency';
  timestamp: Date;
  tags: Record<string, string>;
  threshold?: {
    warning: number;
    critical: number;
  };
}

export interface TimingMetric extends PerformanceMetric {
  startTime: number;
  endTime: number;
  duration: number;
  operation: string;
  success: boolean;
}

export interface BusinessMetric extends PerformanceMetric {
  dimension: string;
  aggregationType: 'SUM' | 'COUNT' | 'AVG' | 'MIN' | 'MAX' | 'LAST';
  period: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
}

export interface SystemMetric extends PerformanceMetric {
  resource: 'CPU' | 'MEMORY' | 'DISK' | 'NETWORK' | 'DATABASE';
  hostname: string;
  processId: number;
}

// ============================================================================
// PERFORMANCE TIMER
// ============================================================================

export class PerformanceTimer {
  private startTime: number;
  private endTime?: number;
  private metadata: Record<string, any> = {};

  constructor(
    private operation: string,
    private category: string = 'PERFORMANCE',
    metadata?: Record<string, any>
  ) {
    this.startTime = performance.now();
    this.metadata = metadata || {};
  }

  /**
   * Add metadata to the timer
   */
  addMetadata(key: string, value: any): void {
    this.metadata[key] = value;
  }

  /**
   * Stop the timer and return the timing metric
   */
  stop(success: boolean = true): TimingMetric {
    this.endTime = performance.now();
    const duration = this.endTime - this.startTime;

    const metric: TimingMetric = {
      id: uuidv4(),
      name: `${this.operation}_duration`,
      category: this.category as any,
      value: duration,
      unit: 'ms',
      timestamp: new Date(),
      tags: {
        operation: this.operation,
        success: success.toString(),
        ...this.metadata
      },
      startTime: this.startTime,
      endTime: this.endTime,
      duration,
      operation: this.operation,
      success,
      threshold: {
        warning: PERFORMANCE_CONSTANTS.ACCEPTABLE_RESPONSE_TIME_MS,
        critical: PERFORMANCE_CONSTANTS.CRITICAL_RESPONSE_TIME_MS
      }
    };

    // Automatically record the metric
    PerformanceMonitor.getInstance().recordMetric(metric);

    return metric;
  }

  /**
   * Get current duration without stopping
   */
  getCurrentDuration(): number {
    return performance.now() - this.startTime;
  }
}

// ============================================================================
// PERFORMANCE MONITOR
// ============================================================================

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private logger = getLogger('performance-monitor');
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private timers: Map<string, PerformanceTimer> = new Map();
  private alertThresholds: Map<string, { warning: number; critical: number }> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
      PerformanceMonitor.instance.initializeDefaultThresholds();
    }
    return PerformanceMonitor.instance;
  }

  private initializeDefaultThresholds(): void {
    // API response time thresholds
    this.setAlertThreshold('api_response_time', 
      PERFORMANCE_CONSTANTS.ACCEPTABLE_RESPONSE_TIME_MS, 
      PERFORMANCE_CONSTANTS.CRITICAL_RESPONSE_TIME_MS
    );

    // Database query thresholds
    this.setAlertThreshold('database_query_time',
      PERFORMANCE_CONSTANTS.DATABASE_TIMEOUT_MS / 2,
      PERFORMANCE_CONSTANTS.DATABASE_TIMEOUT_MS
    );

    // Business metric thresholds
    this.setAlertThreshold('customer_satisfaction',
      BUSINESS_METRICS.POOR_SATISFACTION,
      BUSINESS_METRICS.CRITICAL_SATISFACTION
    );
  }

  /**
   * Start a performance timer
   */
  startTimer(operation: string, category?: string, metadata?: Record<string, any>): string {
    const timerId = uuidv4();
    const timer = new PerformanceTimer(operation, category, metadata);
    this.timers.set(timerId, timer);
    return timerId;
  }

  /**
   * Stop a performance timer
   */
  stopTimer(timerId: string, success: boolean = true): TimingMetric | null {
    const timer = this.timers.get(timerId);
    if (!timer) {
      this.logger.warn('Timer not found', { timerId });
      return null;
    }

    const metric = timer.stop(success);
    this.timers.delete(timerId);

    return metric;
  }

  /**
   * Record a performance metric
   */
  recordMetric(metric: PerformanceMetric): void {
    const key = `${metric.category}_${metric.name}`;
    
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }
    
    this.metrics.get(key)!.push(metric);

    // Check against thresholds
    this.checkThresholds(metric);

    // Log metric for monitoring systems
    this.logger.logPerformance(metric.name, metric.value, {
      category: metric.category,
      unit: metric.unit,
      tags: metric.tags,
      metricId: metric.id
    });

    // Clean old metrics to prevent memory leaks
    this.cleanupOldMetrics(key);
  }

  /**
   * Set alert thresholds for a metric
   */
  setAlertThreshold(metricName: string, warning: number, critical: number): void {
    this.alertThresholds.set(metricName, { warning, critical });
  }

  /**
   * Check if a metric exceeds thresholds
   */
  private checkThresholds(metric: PerformanceMetric): void {
    const threshold = this.alertThresholds.get(metric.name) || metric.threshold;
    
    if (!threshold) return;

    if (metric.value >= threshold.critical) {
      this.logger.error('Critical performance threshold exceeded', undefined, {
        metricName: metric.name,
        value: metric.value,
        threshold: threshold.critical,
        category: metric.category,
        tags: metric.tags
      });
    } else if (metric.value >= threshold.warning) {
      this.logger.warn('Performance threshold warning', {
        metricName: metric.name,
        value: metric.value,
        threshold: threshold.warning,
        category: metric.category,
        tags: metric.tags
      });
    }
  }

  /**
   * Get metrics by category and time range
   */
  getMetrics(
    category?: string, 
    startTime?: Date, 
    endTime?: Date
  ): PerformanceMetric[] {
    const allMetrics: PerformanceMetric[] = [];
    
    for (const metrics of this.metrics.values()) {
      allMetrics.push(...metrics);
    }

    return allMetrics.filter(metric => {
      if (category && metric.category !== category) return false;
      if (startTime && metric.timestamp < startTime) return false;
      if (endTime && metric.timestamp > endTime) return false;
      return true;
    });
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(category?: string, timeRangeMinutes: number = 60): PerformanceSummary {
    const cutoffTime = new Date(Date.now() - timeRangeMinutes * 60 * 1000);
    const metrics = this.getMetrics(category, cutoffTime);

    const summary: PerformanceSummary = {
      totalMetrics: metrics.length,
      averageResponseTime: 0,
      slowestOperation: '',
      fastestOperation: '',
      errorRate: 0,
      throughput: 0,
      alertsTriggered: 0,
      timeRange: timeRangeMinutes,
      categories: {}
    };

    if (metrics.length === 0) return summary;

    // Calculate averages and extremes
    let totalResponseTime = 0;
    let slowestTime = 0;
    let fastestTime = Infinity;
    let errorCount = 0;

    const categoryStats: Record<string, any> = {};

    metrics.forEach(metric => {
      // Response time calculations
      if (metric.unit === 'ms' || metric.unit === 'seconds') {
        const timeInMs = metric.unit === 'seconds' ? metric.value * 1000 : metric.value;
        totalResponseTime += timeInMs;
        
        if (timeInMs > slowestTime) {
          slowestTime = timeInMs;
          summary.slowestOperation = metric.name;
        }
        
        if (timeInMs < fastestTime) {
          fastestTime = timeInMs;
          summary.fastestOperation = metric.name;
        }
      }

      // Error counting
      if (metric.tags?.success === 'false' || metric.tags?.status?.startsWith('5')) {
        errorCount++;
      }

      // Category statistics
      if (!categoryStats[metric.category]) {
        categoryStats[metric.category] = { count: 0, totalValue: 0 };
      }
      categoryStats[metric.category].count++;
      categoryStats[metric.category].totalValue += metric.value;

      // Alert counting
      const threshold = this.alertThresholds.get(metric.name) || metric.threshold;
      if (threshold && metric.value >= threshold.warning) {
        summary.alertsTriggered++;
      }
    });

    summary.averageResponseTime = totalResponseTime / metrics.length;
    summary.errorRate = (errorCount / metrics.length) * 100;
    summary.throughput = metrics.length / (timeRangeMinutes / 60); // per hour

    // Build category summary
    Object.keys(categoryStats).forEach(category => {
      const stats = categoryStats[category];
      summary.categories[category] = {
        count: stats.count,
        averageValue: stats.totalValue / stats.count
      };
    });

    return summary;
  }

  /**
   * Clean up old metrics to prevent memory leaks
   */
  private cleanupOldMetrics(key: string): void {
    const metrics = this.metrics.get(key);
    if (!metrics) return;

    // Keep only metrics from the last hour
    const cutoffTime = new Date(Date.now() - 60 * 60 * 1000);
    const recentMetrics = metrics.filter(metric => metric.timestamp > cutoffTime);
    
    // Keep maximum of 1000 metrics per key
    if (recentMetrics.length > 1000) {
      recentMetrics.splice(0, recentMetrics.length - 1000);
    }

    this.metrics.set(key, recentMetrics);
  }
}

export interface PerformanceSummary {
  totalMetrics: number;
  averageResponseTime: number;
  slowestOperation: string;
  fastestOperation: string;
  errorRate: number;
  throughput: number;
  alertsTriggered: number;
  timeRange: number;
  categories: Record<string, { count: number; averageValue: number }>;
}

// ============================================================================
// BUSINESS METRICS COLLECTOR
// ============================================================================

export class BusinessMetricsCollector {
  private monitor = PerformanceMonitor.getInstance();
  private logger = getLogger('business-metrics');

  /**
   * Record a business KPI
   */
  recordKPI(
    name: string,
    value: number,
    unit: string,
    dimension: string,
    tags: Record<string, string> = {}
  ): void {
    const metric: BusinessMetric = {
      id: uuidv4(),
      name,
      category: 'BUSINESS',
      value,
      unit: unit as any,
      timestamp: new Date(),
      tags,
      dimension,
      aggregationType: 'LAST',
      period: 'HOURLY'
    };

    this.monitor.recordMetric(metric);

    this.logger.logBusinessOperation(
      'KPI_RECORDED',
      'METRIC',
      metric.id,
      'SUCCESS',
      {
        kpiName: name,
        value,
        dimension,
        unit
      }
    );
  }

  /**
   * Record financial metric
   */
  recordFinancialMetric(
    metricType: 'REVENUE' | 'EXPENSE' | 'PROFIT' | 'CASH_FLOW',
    amount: number,
    currency: string = 'USD',
    period: string = 'DAILY'
  ): void {
    this.recordKPI(
      `financial_${metricType.toLowerCase()}`,
      amount,
      'currency',
      period,
      { currency, type: metricType }
    );
  }

  /**
   * Record operational metric
   */
  recordOperationalMetric(
    metricType: 'ORDERS_PROCESSED' | 'CUSTOMER_ACQUISITION' | 'USER_SESSIONS' | 'CONVERSION_RATE',
    value: number,
    tags: Record<string, string> = {}
  ): void {
    this.recordKPI(
      `operational_${metricType.toLowerCase()}`,
      value,
      metricType === 'CONVERSION_RATE' ? 'percentage' : 'count',
      'HOURLY',
      tags
    );
  }

  /**
   * Record customer satisfaction metric
   */
  recordCustomerSatisfaction(
    score: number,
    surveyType: string = 'GENERAL',
    customerId?: string
  ): void {
    this.recordKPI(
      'customer_satisfaction',
      score,
      'rate',
      'DAILY',
      {
        surveyType,
        ...(customerId && { customerId })
      }
    );
  }

  /**
   * Record system health metric
   */
  recordSystemHealth(
    component: string,
    healthScore: number,
    details: Record<string, any> = {}
  ): void {
    const metric: SystemMetric = {
      id: uuidv4(),
      name: 'system_health',
      category: 'SYSTEM',
      value: healthScore,
      unit: 'percentage',
      timestamp: new Date(),
      tags: {
        component,
        ...details
      },
      resource: component.toUpperCase() as any,
      hostname: process.env.HOSTNAME || 'unknown',
      processId: process.pid
    };

    this.monitor.recordMetric(metric);
  }
}

// ============================================================================
// PERFORMANCE DECORATORS
// ============================================================================

/**
 * Method decorator for automatic performance monitoring
 */
export function MonitorPerformance(
  operation?: string,
  category: string = 'PERFORMANCE'
) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const operationName = operation || `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      const timer = PerformanceMonitor.getInstance().startTimer(
        operationName,
        category,
        {
          className: target.constructor.name,
          methodName: propertyKey
        }
      );

      try {
        const result = await originalMethod.apply(this, args);
        PerformanceMonitor.getInstance().stopTimer(timer, true);
        return result;
      } catch (error) {
        PerformanceMonitor.getInstance().stopTimer(timer, false);
        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * Class decorator for monitoring all methods
 */
export function MonitorClass(category: string = 'PERFORMANCE') {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    const className = constructor.name;

    // Get all method names
    const methodNames = Object.getOwnPropertyNames(constructor.prototype)
      .filter(name => name !== 'constructor' && typeof constructor.prototype[name] === 'function');

    // Apply performance monitoring to each method
    methodNames.forEach(methodName => {
      const originalMethod = constructor.prototype[methodName];
      
      constructor.prototype[methodName] = async function (...args: any[]) {
        const timer = PerformanceMonitor.getInstance().startTimer(
          `${className}.${methodName}`,
          category
        );

        try {
          const result = await originalMethod.apply(this, args);
          PerformanceMonitor.getInstance().stopTimer(timer, true);
          return result;
        } catch (error) {
          PerformanceMonitor.getInstance().stopTimer(timer, false);
          throw error;
        }
      };
    });

    return constructor;
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Measure execution time of a function
 */
export async function measureExecutionTime<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<{ result: T; duration: number }> {
  const timer = new PerformanceTimer(operation);
  
  try {
    const result = await fn();
    const metric = timer.stop(true);
    return { result, duration: metric.duration };
  } catch (error) {
    timer.stop(false);
    throw error;
  }
}

/**
 * Create a performance checkpoint
 */
export function createCheckpoint(name: string, metadata?: Record<string, any>): void {
  PerformanceMonitor.getInstance().recordMetric({
    id: uuidv4(),
    name: `checkpoint_${name}`,
    category: 'PERFORMANCE',
    value: performance.now(),
    unit: 'ms',
    timestamp: new Date(),
    tags: metadata || {}
  });
}

// ============================================================================
// SINGLETON INSTANCES
// ============================================================================

export const performanceMonitor = PerformanceMonitor.getInstance();
export const businessMetrics = new BusinessMetricsCollector();

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  PerformanceMonitor,
  PerformanceTimer,
  BusinessMetricsCollector,
  performanceMonitor,
  businessMetrics,
  MonitorPerformance,
  MonitorClass,
  measureExecutionTime,
  createCheckpoint
};