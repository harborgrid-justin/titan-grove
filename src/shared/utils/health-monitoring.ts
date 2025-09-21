/**
 * Enterprise Health Check and Monitoring System
 * Comprehensive system health monitoring and status endpoints
 */

import { v4 as uuidv4 } from 'uuid';
import { getLogger } from '../utils/enterprise-logger';
import { PERFORMANCE_CONSTANTS } from '../constants/business-constants';
import { performanceMonitor } from './performance-monitoring';

// ============================================================================
// HEALTH CHECK INTERFACES
// ============================================================================

export interface HealthCheckResult {
  name: string;
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY' | 'UNKNOWN';
  responseTime: number;
  message?: string;
  details?: Record<string, any>;
  lastChecked: Date;
  endpoint?: string;
}

export interface SystemHealthStatus {
  overall: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  timestamp: Date;
  version: string;
  environment: string;
  uptime: number;
  checks: HealthCheckResult[];
  metrics: {
    totalChecks: number;
    healthyChecks: number;
    unhealthyChecks: number;
    averageResponseTime: number;
  };
}

export interface HealthCheckConfig {
  name: string;
  type: 'DATABASE' | 'EXTERNAL_API' | 'CACHE' | 'QUEUE' | 'FILE_SYSTEM' | 'CUSTOM';
  endpoint?: string;
  timeout: number;
  interval: number;
  retryCount: number;
  enabled: boolean;
  customCheck?: () => Promise<HealthCheckResult>;
}

// ============================================================================
// INDIVIDUAL HEALTH CHECKERS
// ============================================================================

export abstract class BaseHealthChecker {
  protected logger = getLogger('health-checker');

  constructor(
    protected config: HealthCheckConfig
  ) {}

  abstract performCheck(): Promise<HealthCheckResult>;

  async executeCheck(): Promise<HealthCheckResult> {
    const startTime = performance.now();
    
    try {
      const result = await Promise.race([
        this.performCheck(),
        this.createTimeoutPromise()
      ]);
      
      result.responseTime = performance.now() - startTime;
      result.lastChecked = new Date();
      
      return result;
    } catch (error) {
      const responseTime = performance.now() - startTime;
      
      this.logger.error(`Health check failed for ${this.config.name}`, error as Error, {
        checkName: this.config.name,
        responseTime,
        checkType: this.config.type
      });

      return {
        name: this.config.name,
        status: 'UNHEALTHY',
        responseTime,
        message: (error as Error).message || 'Health check failed',
        details: { error: (error as Error).stack },
        lastChecked: new Date(),
        endpoint: this.config.endpoint
      };
    }
  }

  private createTimeoutPromise(): Promise<HealthCheckResult> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Health check timeout after ${this.config.timeout}ms`));
      }, this.config.timeout);
    });
  }
}

export class DatabaseHealthChecker extends BaseHealthChecker {
  async performCheck(): Promise<HealthCheckResult> {
    // Simulate database connection check
    // In real implementation, this would test actual database connectivity
    const isHealthy = await this.testDatabaseConnection();
    
    return {
      name: this.config.name,
      status: isHealthy ? 'HEALTHY' : 'UNHEALTHY',
      responseTime: 0, // Will be set by executeCheck
      message: isHealthy ? 'Database connection successful' : 'Database connection failed',
      details: {
        connectionPool: 'active',
        maxConnections: 100,
        activeConnections: 15
      },
      lastChecked: new Date(),
      endpoint: this.config.endpoint
    };
  }

  private async testDatabaseConnection(): Promise<boolean> {
    // Mock implementation - replace with actual database check
    await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
    return Math.random() > 0.1; // 90% success rate
  }
}

export class ExternalApiHealthChecker extends BaseHealthChecker {
  async performCheck(): Promise<HealthCheckResult> {
    const isHealthy = await this.testApiEndpoint();
    
    return {
      name: this.config.name,
      status: isHealthy ? 'HEALTHY' : 'UNHEALTHY',
      responseTime: 0,
      message: isHealthy ? 'API endpoint responding' : 'API endpoint unreachable',
      details: {
        endpoint: this.config.endpoint,
        method: 'GET',
        expectedStatus: 200
      },
      lastChecked: new Date(),
      endpoint: this.config.endpoint
    };
  }

  private async testApiEndpoint(): Promise<boolean> {
    try {
      // Mock API call - replace with actual HTTP request
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
      return Math.random() > 0.05; // 95% success rate
    } catch (error) {
      return false;
    }
  }
}

export class CacheHealthChecker extends BaseHealthChecker {
  async performCheck(): Promise<HealthCheckResult> {
    const cacheMetrics = await this.getCacheMetrics();
    const isHealthy = cacheMetrics.hitRate > 0.8 && cacheMetrics.memoryUsage < 0.9;
    
    return {
      name: this.config.name,
      status: isHealthy ? 'HEALTHY' : (cacheMetrics.hitRate > 0.5 ? 'DEGRADED' : 'UNHEALTHY'),
      responseTime: 0,
      message: isHealthy ? 'Cache operating normally' : 'Cache performance degraded',
      details: cacheMetrics,
      lastChecked: new Date()
    };
  }

  private async getCacheMetrics(): Promise<any> {
    // Mock cache metrics - replace with actual cache client
    return {
      hitRate: Math.random() * 0.4 + 0.6, // 60-100%
      missRate: Math.random() * 0.4,
      memoryUsage: Math.random() * 0.3 + 0.5, // 50-80%
      connectedClients: Math.floor(Math.random() * 50) + 10,
      totalKeys: Math.floor(Math.random() * 10000) + 1000
    };
  }
}

export class FileSystemHealthChecker extends BaseHealthChecker {
  async performCheck(): Promise<HealthCheckResult> {
    const fsMetrics = await this.getFileSystemMetrics();
    const isHealthy = fsMetrics.diskUsage < 0.9 && fsMetrics.inodeUsage < 0.9;
    
    return {
      name: this.config.name,
      status: isHealthy ? 'HEALTHY' : (fsMetrics.diskUsage < 0.95 ? 'DEGRADED' : 'UNHEALTHY'),
      responseTime: 0,
      message: isHealthy ? 'File system healthy' : 'File system space low',
      details: fsMetrics,
      lastChecked: new Date()
    };
  }

  private async getFileSystemMetrics(): Promise<any> {
    // Mock file system metrics - replace with actual fs checks
    return {
      diskUsage: Math.random() * 0.4 + 0.5, // 50-90%
      inodeUsage: Math.random() * 0.3 + 0.4, // 40-70%
      availableSpace: '50GB',
      totalSpace: '500GB',
      readLatency: Math.random() * 10 + 1, // 1-11ms
      writeLatency: Math.random() * 15 + 2 // 2-17ms
    };
  }
}

// ============================================================================
// HEALTH MONITOR MAIN CLASS
// ============================================================================

export class HealthMonitor {
  private static instance: HealthMonitor;
  private logger = getLogger('health-monitor');
  private checkers: Map<string, BaseHealthChecker> = new Map();
  private lastResults: Map<string, HealthCheckResult> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private startTime: Date = new Date();

  static getInstance(): HealthMonitor {
    if (!HealthMonitor.instance) {
      HealthMonitor.instance = new HealthMonitor();
      HealthMonitor.instance.initializeDefaultCheckers();
    }
    return HealthMonitor.instance;
  }

  private initializeDefaultCheckers(): void {
    // Database health checker
    this.registerChecker({
      name: 'database',
      type: 'DATABASE',
      timeout: 5000,
      interval: 30000, // 30 seconds
      retryCount: 3,
      enabled: true,
      endpoint: 'postgresql://localhost:5432'
    });

    // Cache health checker  
    this.registerChecker({
      name: 'cache',
      type: 'CACHE',
      timeout: 3000,
      interval: 15000, // 15 seconds
      retryCount: 2,
      enabled: true
    });

    // File system health checker
    this.registerChecker({
      name: 'filesystem',
      type: 'FILE_SYSTEM',
      timeout: 2000,
      interval: 60000, // 60 seconds
      retryCount: 1,
      enabled: true
    });

    // External API health checker example
    this.registerChecker({
      name: 'external-service',
      type: 'EXTERNAL_API',
      endpoint: 'https://api.example.com/health',
      timeout: 10000,
      interval: 45000, // 45 seconds
      retryCount: 3,
      enabled: true
    });
  }

  /**
   * Register a new health checker
   */
  registerChecker(config: HealthCheckConfig): void {
    if (!config.enabled) {
      this.logger.info(`Health checker disabled: ${config.name}`);
      return;
    }

    let checker: BaseHealthChecker;

    switch (config.type) {
      case 'DATABASE':
        checker = new DatabaseHealthChecker(config);
        break;
      case 'EXTERNAL_API':
        checker = new ExternalApiHealthChecker(config);
        break;
      case 'CACHE':
        checker = new CacheHealthChecker(config);
        break;
      case 'FILE_SYSTEM':
        checker = new FileSystemHealthChecker(config);
        break;
      case 'CUSTOM':
        if (!config.customCheck) {
          throw new Error('Custom health check function required for CUSTOM type');
        }
        checker = new CustomHealthChecker(config);
        break;
      default:
        throw new Error(`Unsupported health check type: ${config.type}`);
    }

    this.checkers.set(config.name, checker);

    // Start periodic checking
    const intervalId = setInterval(async () => {
      await this.performSingleCheck(config.name);
    }, config.interval);

    this.intervals.set(config.name, intervalId);

    // Perform initial check
    this.performSingleCheck(config.name);

    this.logger.info(`Registered health checker: ${config.name}`, {
      type: config.type,
      interval: config.interval,
      timeout: config.timeout
    });
  }

  /**
   * Unregister a health checker
   */
  unregisterChecker(name: string): void {
    const interval = this.intervals.get(name);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(name);
    }

    this.checkers.delete(name);
    this.lastResults.delete(name);

    this.logger.info(`Unregistered health checker: ${name}`);
  }

  /**
   * Perform a single health check
   */
  async performSingleCheck(name: string): Promise<HealthCheckResult | null> {
    const checker = this.checkers.get(name);
    if (!checker) {
      this.logger.warn(`Health checker not found: ${name}`);
      return null;
    }

    try {
      const result = await checker.executeCheck();
      this.lastResults.set(name, result);

      // Log health status changes
      const previousResult = this.lastResults.get(name);
      if (!previousResult || previousResult.status !== result.status) {
        this.logger.info(`Health status changed for ${name}`, {
          checkName: name,
          previousStatus: previousResult?.status,
          newStatus: result.status,
          responseTime: result.responseTime
        });
      }

      return result;
    } catch (error) {
      this.logger.error(`Health check execution failed for ${name}`, error as Error);
      return null;
    }
  }

  /**
   * Perform all health checks
   */
  async performAllChecks(): Promise<HealthCheckResult[]> {
    const checkPromises = Array.from(this.checkers.keys()).map(name => 
      this.performSingleCheck(name)
    );

    const results = await Promise.allSettled(checkPromises);
    return results
      .filter(result => result.status === 'fulfilled' && result.value !== null)
      .map(result => (result as PromiseFulfilledResult<HealthCheckResult>).value);
  }

  /**
   * Get system health status
   */
  async getSystemHealth(): Promise<SystemHealthStatus> {
    const checks = await this.performAllChecks();
    const uptime = Date.now() - this.startTime.getTime();

    const healthyChecks = checks.filter(check => check.status === 'HEALTHY').length;
    const unhealthyChecks = checks.filter(check => check.status === 'UNHEALTHY').length;
    const degradedChecks = checks.filter(check => check.status === 'DEGRADED').length;

    let overallStatus: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
    
    if (unhealthyChecks > 0) {
      overallStatus = 'UNHEALTHY';
    } else if (degradedChecks > 0) {
      overallStatus = 'DEGRADED';
    } else {
      overallStatus = 'HEALTHY';
    }

    const averageResponseTime = checks.length > 0 
      ? checks.reduce((sum, check) => sum + check.responseTime, 0) / checks.length 
      : 0;

    return {
      overall: overallStatus,
      timestamp: new Date(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime,
      checks,
      metrics: {
        totalChecks: checks.length,
        healthyChecks,
        unhealthyChecks,
        averageResponseTime
      }
    };
  }

  /**
   * Get last cached results without performing new checks
   */
  getCachedHealth(): SystemHealthStatus {
    const checks = Array.from(this.lastResults.values());
    const uptime = Date.now() - this.startTime.getTime();

    const healthyChecks = checks.filter(check => check.status === 'HEALTHY').length;
    const unhealthyChecks = checks.filter(check => check.status === 'UNHEALTHY').length;
    const degradedChecks = checks.filter(check => check.status === 'DEGRADED').length;

    let overallStatus: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
    
    if (unhealthyChecks > 0) {
      overallStatus = 'UNHEALTHY';
    } else if (degradedChecks > 0) {
      overallStatus = 'DEGRADED';
    } else {
      overallStatus = 'HEALTHY';
    }

    const averageResponseTime = checks.length > 0 
      ? checks.reduce((sum, check) => sum + check.responseTime, 0) / checks.length 
      : 0;

    return {
      overall: overallStatus,
      timestamp: new Date(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime,
      checks,
      metrics: {
        totalChecks: checks.length,
        healthyChecks,
        unhealthyChecks,
        averageResponseTime
      }
    };
  }

  /**
   * Get specific health check result
   */
  getHealthCheck(name: string): HealthCheckResult | null {
    return this.lastResults.get(name) || null;
  }

  /**
   * Stop all health checks
   */
  stopAllChecks(): void {
    this.intervals.forEach((interval, name) => {
      clearInterval(interval);
      this.logger.info(`Stopped health checker: ${name}`);
    });
    
    this.intervals.clear();
  }
}

// ============================================================================
// CUSTOM HEALTH CHECKER
// ============================================================================

export class CustomHealthChecker extends BaseHealthChecker {
  async performCheck(): Promise<HealthCheckResult> {
    if (!this.config.customCheck) {
      throw new Error('Custom check function not provided');
    }

    return await this.config.customCheck();
  }
}

// ============================================================================
// HEALTH CHECK UTILITIES
// ============================================================================

/**
 * Create a simple readiness probe
 */
export function createReadinessProbe(): () => Promise<boolean> {
  const healthMonitor = HealthMonitor.getInstance();
  
  return async () => {
    const health = await healthMonitor.getSystemHealth();
    return health.overall !== 'UNHEALTHY';
  };
}

/**
 * Create a simple liveness probe
 */
export function createLivenessProbe(): () => boolean {
  const startTime = Date.now();
  
  return () => {
    // Simple check - if process has been running and memory usage isn't excessive
    const uptime = Date.now() - startTime;
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = memoryUsage.heapUsed / 1024 / 1024;
    
    return uptime > 1000 && heapUsedMB < 1000; // Running > 1s and < 1GB heap
  };
}

/**
 * Create startup probe
 */
export function createStartupProbe(requiredCheckers: string[] = []): () => Promise<boolean> {
  const healthMonitor = HealthMonitor.getInstance();
  
  return async () => {
    if (requiredCheckers.length === 0) {
      return true; // No specific requirements
    }

    const results = await Promise.all(
      requiredCheckers.map(name => healthMonitor.performSingleCheck(name))
    );

    return results.every(result => result && result.status === 'HEALTHY');
  };
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const healthMonitor = HealthMonitor.getInstance();

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  HealthMonitor,
  BaseHealthChecker,
  DatabaseHealthChecker,
  ExternalApiHealthChecker,
  CacheHealthChecker,
  FileSystemHealthChecker,
  CustomHealthChecker,
  healthMonitor,
  createReadinessProbe,
  createLivenessProbe,
  createStartupProbe
};