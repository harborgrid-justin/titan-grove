/**
 * Message Queue Monitoring
 * Comprehensive monitoring and alerting for message queues
 */

import { EventEmitter } from 'events';
import { Logger } from 'winston';
import { createLogger } from '../../utils/logger';
import {
  QueueMetrics,
  QueueAlert,
  MessageQueueConfig
} from './types';

export interface MonitoringConfig {
  metricsInterval: number; // milliseconds
  alertThresholds: {
    queueDepth: number;
    processingTime: number;
    errorRate: number;
    memoryUsage: number;
    cpuUsage: number;
  };
  retention: {
    metricsHours: number;
    alertsDays: number;
  };
}

export interface TimeSeriesMetric {
  timestamp: Date;
  value: number;
  queueName: string;
  metricType: string;
}

export interface HealthStatus {
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  overallScore: number;
  queueStatuses: Map<string, {
    status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
    score: number;
    issues: string[];
  }>;
  systemMetrics: {
    totalQueues: number;
    totalMessages: number;
    totalProcessedToday: number;
    averageProcessingTime: number;
    errorRate: number;
  };
  lastUpdated: Date;
}

export class QueueMonitor extends EventEmitter {
  private logger: Logger;
  private config: MonitoringConfig;
  private metrics: Map<string, TimeSeriesMetric[]> = new Map();
  private alerts: QueueAlert[] = [];
  private healthStatus: HealthStatus;
  private monitoringInterval?: NodeJS.Timeout;
  private isMonitoring = false;

  constructor(config: MonitoringConfig) {
    super();
    this.config = config;
    this.logger = createLogger({ level: 'info' });
    this.healthStatus = this.initializeHealthStatus();
  }

  /**
   * Start monitoring queues
   */
  start(): void {
    if (this.isMonitoring) {
      this.logger.warn('Monitoring already started');
      return;
    }

    this.logger.info('Starting queue monitoring');
    this.isMonitoring = true;

    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
    }, this.config.metricsInterval);

    // Start health checks
    setInterval(() => {
      this.performHealthCheck();
    }, 60000); // Every minute

    // Clean up old metrics
    setInterval(() => {
      this.cleanupOldMetrics();
    }, 3600000); // Every hour

    this.emit('monitoringStarted');
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    if (!this.isMonitoring) {
      return;
    }

    this.logger.info('Stopping queue monitoring');
    this.isMonitoring = false;

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }

    this.emit('monitoringStopped');
  }

  /**
   * Record queue metrics
   */
  recordMetrics(queueName: string, metrics: QueueMetrics): void {
    const timestamp = new Date();

    // Record various metrics as time series
    this.recordMetric(queueName, 'active', metrics.active, timestamp);
    this.recordMetric(queueName, 'waiting', metrics.waiting, timestamp);
    this.recordMetric(queueName, 'completed', metrics.completed, timestamp);
    this.recordMetric(queueName, 'failed', metrics.failed, timestamp);
    this.recordMetric(queueName, 'delayed', metrics.delayed, timestamp);
    this.recordMetric(queueName, 'throughput', metrics.throughput.messagesPerSecond, timestamp);
    this.recordMetric(queueName, 'processing_time', metrics.throughput.averageProcessingTime, timestamp);
    this.recordMetric(queueName, 'cpu_usage', metrics.performance.cpuUsage, timestamp);
    this.recordMetric(queueName, 'memory_usage', metrics.performance.memoryUsage, timestamp);

    // Check for alerts
    this.checkAlertConditions(queueName, metrics);

    this.logger.debug(`Recorded metrics for queue ${queueName}`, { metrics });
  }

  /**
   * Get metrics for a specific queue
   */
  getQueueMetrics(queueName: string, metricType: string, hours: number = 1): TimeSeriesMetric[] {
    const key = `${queueName}:${metricType}`;
    const allMetrics = this.metrics.get(key) || [];
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);

    return allMetrics.filter(metric => metric.timestamp >= cutoff);
  }

  /**
   * Get current health status
   */
  getHealthStatus(): HealthStatus {
    return { ...this.healthStatus };
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): QueueAlert[] {
    return this.alerts.filter(alert => !alert.resolvedAt);
  }

  /**
   * Get all alerts (including resolved)
   */
  getAllAlerts(): QueueAlert[] {
    return [...this.alerts];
  }

  /**
   * Acknowledge an alert
   */
  acknowledgeAlert(alertId: string, acknowledgedBy: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert && !alert.acknowledgedAt) {
      alert.acknowledgedAt = new Date();
      alert.acknowledgedBy = acknowledgedBy;
      this.logger.info(`Alert ${alertId} acknowledged by ${acknowledgedBy}`);
      this.emit('alertAcknowledged', alert);
      return true;
    }
    return false;
  }

  /**
   * Resolve an alert
   */
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert && !alert.resolvedAt) {
      alert.resolvedAt = new Date();
      this.logger.info(`Alert ${alertId} resolved`);
      this.emit('alertResolved', alert);
      return true;
    }
    return false;
  }

  /**
   * Generate monitoring dashboard data
   */
  getDashboardData(): any {
    const activeAlerts = this.getActiveAlerts();
    const recentMetrics: Record<string, any> = {};

    // Get recent metrics for all queues
    for (const [key] of this.metrics) {
      const [queueName, metricType] = key.split(':');
      if (!recentMetrics[queueName]) {
        recentMetrics[queueName] = {};
      }
      
      const metrics = this.getQueueMetrics(queueName, metricType, 0.25); // Last 15 minutes
      if (metrics.length > 0) {
        const latest = metrics[metrics.length - 1];
        recentMetrics[queueName][metricType] = {
          current: latest.value,
          trend: this.calculateTrend(metrics),
          sparkline: metrics.map(m => ({ x: m.timestamp, y: m.value }))
        };
      }
    }

    return {
      healthStatus: this.healthStatus,
      activeAlerts: activeAlerts.length,
      totalAlerts: this.alerts.length,
      metrics: recentMetrics,
      alertsByQueue: this.groupAlertsByQueue(activeAlerts),
      systemSummary: {
        totalQueues: this.healthStatus.systemMetrics.totalQueues,
        totalMessages: this.healthStatus.systemMetrics.totalMessages,
        averageProcessingTime: this.healthStatus.systemMetrics.averageProcessingTime,
        errorRate: this.healthStatus.systemMetrics.errorRate
      }
    };
  }

  /**
   * Export metrics for external systems
   */
  exportMetrics(format: 'json' | 'csv' | 'prometheus' = 'json'): string {
    switch (format) {
      case 'json':
        return this.exportJSON();
      case 'csv':
        return this.exportCSV();
      case 'prometheus':
        return this.exportPrometheus();
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  // Private methods

  private initializeHealthStatus(): HealthStatus {
    return {
      status: 'HEALTHY',
      overallScore: 100,
      queueStatuses: new Map(),
      systemMetrics: {
        totalQueues: 0,
        totalMessages: 0,
        totalProcessedToday: 0,
        averageProcessingTime: 0,
        errorRate: 0
      },
      lastUpdated: new Date()
    };
  }

  private recordMetric(queueName: string, metricType: string, value: number, timestamp: Date): void {
    const key = `${queueName}:${metricType}`;
    const metrics = this.metrics.get(key) || [];
    
    metrics.push({
      timestamp,
      value,
      queueName,
      metricType
    });

    // Keep only recent metrics
    const cutoff = new Date(timestamp.getTime() - this.config.retention.metricsHours * 60 * 60 * 1000);
    const filteredMetrics = metrics.filter(m => m.timestamp >= cutoff);
    
    this.metrics.set(key, filteredMetrics);
  }

  private collectMetrics(): void {
    // This would be called by the MessageQueueManager
    // For now, just emit an event that metrics should be collected
    this.emit('collectMetrics');
  }

  private performHealthCheck(): void {
    const queueStatuses = new Map();
    let totalScore = 0;
    let queueCount = 0;

    // Calculate health scores for each queue
    for (const [key] of this.metrics) {
      const [queueName] = key.split(':');
      if (!queueStatuses.has(queueName)) {
        const score = this.calculateQueueHealthScore(queueName);
        const status = this.getStatusFromScore(score);
        const issues = this.identifyQueueIssues(queueName);

        queueStatuses.set(queueName, { status, score, issues });
        totalScore += score;
        queueCount++;
      }
    }

    // Calculate overall health
    const overallScore = queueCount > 0 ? totalScore / queueCount : 100;
    const overallStatus = this.getStatusFromScore(overallScore);

    this.healthStatus = {
      status: overallStatus,
      overallScore,
      queueStatuses,
      systemMetrics: this.calculateSystemMetrics(),
      lastUpdated: new Date()
    };

    this.logger.debug('Health check completed', { 
      status: overallStatus, 
      score: overallScore, 
      queues: queueCount 
    });

    this.emit('healthCheckCompleted', this.healthStatus);
  }

  private calculateQueueHealthScore(queueName: string): number {
    let score = 100;

    // Check various health indicators
    const recentMetrics = {
      waiting: this.getQueueMetrics(queueName, 'waiting', 0.25),
      failed: this.getQueueMetrics(queueName, 'failed', 1),
      processing_time: this.getQueueMetrics(queueName, 'processing_time', 0.25),
      memory_usage: this.getQueueMetrics(queueName, 'memory_usage', 0.25)
    };

    // Penalize for high queue depth
    if (recentMetrics.waiting.length > 0) {
      const avgWaiting = recentMetrics.waiting.reduce((sum, m) => sum + m.value, 0) / recentMetrics.waiting.length;
      if (avgWaiting > this.config.alertThresholds.queueDepth) {
        score -= Math.min(30, (avgWaiting / this.config.alertThresholds.queueDepth) * 10);
      }
    }

    // Penalize for high error rate
    if (recentMetrics.failed.length > 0) {
      const recentFailed = recentMetrics.failed[recentMetrics.failed.length - 1].value;
      if (recentFailed > 0) {
        score -= Math.min(40, recentFailed * 5);
      }
    }

    // Penalize for slow processing
    if (recentMetrics.processing_time.length > 0) {
      const avgProcessingTime = recentMetrics.processing_time.reduce((sum, m) => sum + m.value, 0) / recentMetrics.processing_time.length;
      if (avgProcessingTime > this.config.alertThresholds.processingTime) {
        score -= Math.min(20, (avgProcessingTime / this.config.alertThresholds.processingTime) * 10);
      }
    }

    // Penalize for high memory usage
    if (recentMetrics.memory_usage.length > 0) {
      const avgMemoryUsage = recentMetrics.memory_usage.reduce((sum, m) => sum + m.value, 0) / recentMetrics.memory_usage.length;
      if (avgMemoryUsage > this.config.alertThresholds.memoryUsage) {
        score -= Math.min(15, (avgMemoryUsage / this.config.alertThresholds.memoryUsage) * 5);
      }
    }

    return Math.max(0, Math.min(100, score));
  }

  private getStatusFromScore(score: number): 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY' {
    if (score >= 80) return 'HEALTHY';
    if (score >= 50) return 'DEGRADED';
    return 'UNHEALTHY';
  }

  private identifyQueueIssues(queueName: string): string[] {
    const issues: string[] = [];
    
    // Check for specific issues based on recent metrics
    const recentWaiting = this.getQueueMetrics(queueName, 'waiting', 0.25);
    if (recentWaiting.length > 0) {
      const avgWaiting = recentWaiting.reduce((sum, m) => sum + m.value, 0) / recentWaiting.length;
      if (avgWaiting > this.config.alertThresholds.queueDepth) {
        issues.push(`High queue depth: ${Math.round(avgWaiting)} messages`);
      }
    }

    const recentFailed = this.getQueueMetrics(queueName, 'failed', 1);
    if (recentFailed.length > 0 && recentFailed[recentFailed.length - 1].value > 0) {
      issues.push(`Recent failures: ${recentFailed[recentFailed.length - 1].value} in last hour`);
    }

    return issues;
  }

  private calculateSystemMetrics(): HealthStatus['systemMetrics'] {
    let totalQueues = 0;
    let totalMessages = 0;
    let totalProcessedToday = 0;
    let totalProcessingTime = 0;
    let totalFailed = 0;
    let totalCompleted = 0;
    let processingTimeCount = 0;

    const uniqueQueues = new Set();
    for (const [key] of this.metrics) {
      const [queueName, metricType] = key.split(':');
      uniqueQueues.add(queueName);

      if (metricType === 'waiting' || metricType === 'active') {
        const recentMetrics = this.getQueueMetrics(queueName, metricType, 0.1);
        if (recentMetrics.length > 0) {
          totalMessages += recentMetrics[recentMetrics.length - 1].value;
        }
      }

      if (metricType === 'completed') {
        const todayMetrics = this.getQueueMetrics(queueName, metricType, 24);
        totalProcessedToday += todayMetrics.reduce((sum, m) => sum + m.value, 0);
        totalCompleted += todayMetrics.length > 0 ? todayMetrics[todayMetrics.length - 1].value : 0;
      }

      if (metricType === 'failed') {
        const todayMetrics = this.getQueueMetrics(queueName, metricType, 24);
        totalFailed += todayMetrics.length > 0 ? todayMetrics[todayMetrics.length - 1].value : 0;
      }

      if (metricType === 'processing_time') {
        const recentMetrics = this.getQueueMetrics(queueName, metricType, 1);
        if (recentMetrics.length > 0) {
          totalProcessingTime += recentMetrics.reduce((sum, m) => sum + m.value, 0);
          processingTimeCount += recentMetrics.length;
        }
      }
    }

    totalQueues = uniqueQueues.size;
    const averageProcessingTime = processingTimeCount > 0 ? totalProcessingTime / processingTimeCount : 0;
    const errorRate = (totalCompleted + totalFailed) > 0 ? totalFailed / (totalCompleted + totalFailed) : 0;

    return {
      totalQueues,
      totalMessages,
      totalProcessedToday,
      averageProcessingTime,
      errorRate
    };
  }

  private checkAlertConditions(queueName: string, metrics: QueueMetrics): void {
    const now = new Date();

    // Check queue depth
    if (metrics.waiting > this.config.alertThresholds.queueDepth) {
      this.createAlert({
        queueName,
        alertType: 'QUEUE_DEPTH',
        severity: metrics.waiting > this.config.alertThresholds.queueDepth * 2 ? 'CRITICAL' : 'HIGH',
        message: `Queue depth exceeded threshold: ${metrics.waiting} > ${this.config.alertThresholds.queueDepth}`,
        details: { 
          currentDepth: metrics.waiting, 
          threshold: this.config.alertThresholds.queueDepth,
          timestamp: now
        }
      });
    }

    // Check processing time
    if (metrics.throughput.averageProcessingTime > this.config.alertThresholds.processingTime) {
      this.createAlert({
        queueName,
        alertType: 'PROCESSING_DELAY',
        severity: 'MEDIUM',
        message: `Processing time exceeded threshold: ${metrics.throughput.averageProcessingTime}ms > ${this.config.alertThresholds.processingTime}ms`,
        details: { 
          currentTime: metrics.throughput.averageProcessingTime, 
          threshold: this.config.alertThresholds.processingTime,
          timestamp: now
        }
      });
    }

    // Check error rate
    if (metrics.failed > 0 && metrics.completed > 0) {
      const errorRate = metrics.failed / (metrics.failed + metrics.completed);
      if (errorRate > this.config.alertThresholds.errorRate) {
        this.createAlert({
          queueName,
          alertType: 'HIGH_ERROR_RATE',
          severity: errorRate > this.config.alertThresholds.errorRate * 2 ? 'CRITICAL' : 'HIGH',
          message: `Error rate exceeded threshold: ${(errorRate * 100).toFixed(2)}% > ${this.config.alertThresholds.errorRate * 100}%`,
          details: { 
            errorRate, 
            threshold: this.config.alertThresholds.errorRate,
            failed: metrics.failed,
            completed: metrics.completed,
            timestamp: now
          }
        });
      }
    }

    // Check memory usage
    if (metrics.performance.memoryUsage > this.config.alertThresholds.memoryUsage) {
      this.createAlert({
        queueName,
        alertType: 'RESOURCE_EXHAUSTED',
        severity: 'HIGH',
        message: `Memory usage exceeded threshold: ${metrics.performance.memoryUsage}MB > ${this.config.alertThresholds.memoryUsage}MB`,
        details: { 
          memoryUsage: metrics.performance.memoryUsage, 
          threshold: this.config.alertThresholds.memoryUsage,
          timestamp: now
        }
      });
    }
  }

  private createAlert(alertData: Omit<QueueAlert, 'id' | 'triggeredAt'>): void {
    // Check if similar alert already exists and is not resolved
    const existingAlert = this.alerts.find(alert => 
      alert.queueName === alertData.queueName &&
      alert.alertType === alertData.alertType &&
      !alert.resolvedAt &&
      (Date.now() - alert.triggeredAt.getTime()) < 300000 // 5 minutes
    );

    if (existingAlert) {
      // Update existing alert details
      existingAlert.details = { ...existingAlert.details, ...alertData.details };
      return;
    }

    const alert: QueueAlert = {
      ...alertData,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      triggeredAt: new Date()
    };

    this.alerts.push(alert);
    this.logger.warn(`New alert created: ${alert.message}`, { alert });
    this.emit('alertCreated', alert);
  }

  private cleanupOldMetrics(): void {
    const cutoff = new Date(Date.now() - this.config.retention.metricsHours * 60 * 60 * 1000);
    
    for (const [key, metrics] of this.metrics) {
      const filteredMetrics = metrics.filter(m => m.timestamp >= cutoff);
      if (filteredMetrics.length !== metrics.length) {
        this.metrics.set(key, filteredMetrics);
      }
    }

    // Cleanup old alerts
    const alertCutoff = new Date(Date.now() - this.config.retention.alertsDays * 24 * 60 * 60 * 1000);
    this.alerts = this.alerts.filter(alert => alert.triggeredAt >= alertCutoff);

    this.logger.debug('Cleaned up old metrics and alerts');
  }

  private calculateTrend(metrics: TimeSeriesMetric[]): 'up' | 'down' | 'stable' {
    if (metrics.length < 2) return 'stable';
    
    const first = metrics[0].value;
    const last = metrics[metrics.length - 1].value;
    const changePercent = Math.abs((last - first) / first) * 100;
    
    if (changePercent < 5) return 'stable';
    return last > first ? 'up' : 'down';
  }

  private groupAlertsByQueue(alerts: QueueAlert[]): Record<string, QueueAlert[]> {
    const grouped: Record<string, QueueAlert[]> = {};
    for (const alert of alerts) {
      if (!grouped[alert.queueName]) {
        grouped[alert.queueName] = [];
      }
      grouped[alert.queueName].push(alert);
    }
    return grouped;
  }

  private exportJSON(): string {
    return JSON.stringify({
      healthStatus: this.healthStatus,
      metrics: Array.from(this.metrics.entries()).map(([key, metrics]) => ({
        key,
        metrics: metrics.slice(-100) // Last 100 data points
      })),
      alerts: this.alerts,
      exportedAt: new Date()
    }, null, 2);
  }

  private exportCSV(): string {
    const lines = ['timestamp,queue_name,metric_type,value'];
    
    for (const [key, metrics] of this.metrics) {
      const [queueName, metricType] = key.split(':');
      for (const metric of metrics.slice(-1000)) { // Last 1000 data points
        lines.push(`${metric.timestamp.toISOString()},${queueName},${metricType},${metric.value}`);
      }
    }
    
    return lines.join('\n');
  }

  private exportPrometheus(): string {
    const lines: string[] = [];
    const now = Date.now();
    
    for (const [key, metrics] of this.metrics) {
      const [queueName, metricType] = key.split(':');
      const latest = metrics[metrics.length - 1];
      
      if (latest) {
        lines.push(`# HELP titan_grove_queue_${metricType} Queue ${metricType} metric`);
        lines.push(`# TYPE titan_grove_queue_${metricType} gauge`);
        lines.push(`titan_grove_queue_${metricType}{queue="${queueName}"} ${latest.value} ${now}`);
      }
    }
    
    return lines.join('\n');
  }
}