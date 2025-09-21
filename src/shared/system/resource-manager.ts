/**
 * Enterprise Resource Management and Memory Optimization System
 * Implements Fix 36: Resource cleanup and memory management
 */

import { EventEmitter } from 'events';
import { getLogger } from '../../utils/enterprise-logger';

interface ResourceConfig {
  memoryMonitoring: {
    enabled: boolean;
    thresholdMB: number;
    checkInterval: number;
    gcThresholdMB: number;
    alertThresholdMB: number;
  };
  connectionPooling: {
    maxConnections: number;
    idleTimeout: number;
    maxLifetime: number;
    cleanupInterval: number;
  };
  cacheManagement: {
    maxSizeMB: number;
    ttlSeconds: number;
    cleanupInterval: number;
  };
  fileHandles: {
    maxOpenFiles: number;
    cleanupInterval: number;
  };
  processManagement: {
    maxChildProcesses: number;
    processTimeout: number;
    cleanupOrphans: boolean;
  };
}

interface MemoryStats {
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number; // Resident Set Size
  arrayBuffers: number;
  heapUsedMB: number;
  heapTotalMB: number;
  externalMB: number;
  rssMB: number;
}

interface ResourceStats {
  memory: MemoryStats;
  connections: {
    active: number;
    idle: number;
    total: number;
  };
  fileHandles: {
    open: number;
    max: number;
  };
  processes: {
    active: number;
    max: number;
  };
  caches: {
    sizeMB: number;
    entryCount: number;
  };
}

interface ResourceCleanupTask {
  id: string;
  name: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
  cleanup: () => Promise<void>;
  interval?: number;
  lastRun?: Date;
  enabled: boolean;
}

interface WeakRefEntry<T = any> {
  ref: WeakRef<T>;
  key: string;
  created: Date;
  lastAccessed: Date;
}

export class EnterpriseResourceManager extends EventEmitter {
  private logger = getLogger('EnterpriseResourceManager');
  private config: ResourceConfig;
  private cleanupTasks = new Map<string, ResourceCleanupTask>();
  private intervals: NodeJS.Timeout[] = [];
  private weakReferences = new Map<string, WeakRefEntry>();
  private connectionPool = new Map<string, any>();
  private fileHandles = new Set<any>();
  private childProcesses = new Map<string, any>();
  private resourceStats: ResourceStats;
  private finalizers = new FinalizationRegistry((key: string) => {
    this.handleResourceFinalization(key);
  });

  constructor(config: Partial<ResourceConfig> = {}) {
    super();
    this.config = {
      memoryMonitoring: {
        enabled: true,
        thresholdMB: 1024, // 1GB
        checkInterval: 30000, // 30 seconds
        gcThresholdMB: 512, // 512MB
        alertThresholdMB: 2048, // 2GB
        ...config.memoryMonitoring
      },
      connectionPooling: {
        maxConnections: 100,
        idleTimeout: 300000, // 5 minutes
        maxLifetime: 3600000, // 1 hour
        cleanupInterval: 60000, // 1 minute
        ...config.connectionPooling
      },
      cacheManagement: {
        maxSizeMB: 256,
        ttlSeconds: 3600,
        cleanupInterval: 300000, // 5 minutes
        ...config.cacheManagement
      },
      fileHandles: {
        maxOpenFiles: 1000,
        cleanupInterval: 60000, // 1 minute
        ...config.fileHandles
      },
      processManagement: {
        maxChildProcesses: 10,
        processTimeout: 300000, // 5 minutes
        cleanupOrphans: true,
        ...config.processManagement
      }
    };

    this.initializeResourceStats();
    this.setupDefaultCleanupTasks();
    this.startMonitoring();

    this.logger.logBusinessOperation(
      'RESOURCE_MANAGER_INITIALIZED',
      'EnterpriseResourceManager',
      '',
      'SUCCESS',
      {
        memoryThresholdMB: this.config.memoryMonitoring.thresholdMB,
        maxConnections: this.config.connectionPooling.maxConnections,
        maxCacheSizeMB: this.config.cacheManagement.maxSizeMB
      }
    );
  }

  private initializeResourceStats(): void {
    this.resourceStats = {
      memory: {
        heapUsed: 0,
        heapTotal: 0,
        external: 0,
        rss: 0,
        arrayBuffers: 0,
        heapUsedMB: 0,
        heapTotalMB: 0,
        externalMB: 0,
        rssMB: 0
      },
      connections: {
        active: 0,
        idle: 0,
        total: 0
      },
      fileHandles: {
        open: 0,
        max: this.config.fileHandles.maxOpenFiles
      },
      processes: {
        active: 0,
        max: this.config.processManagement.maxChildProcesses
      },
      caches: {
        sizeMB: 0,
        entryCount: 0
      }
    };
  }

  private setupDefaultCleanupTasks(): void {
    // Memory cleanup task
    this.registerCleanupTask({
      id: 'memory-cleanup',
      name: 'Memory Cleanup',
      priority: 'high',
      cleanup: this.performMemoryCleanup.bind(this),
      interval: this.config.memoryMonitoring.checkInterval,
      enabled: this.config.memoryMonitoring.enabled
    });

    // Connection pool cleanup
    this.registerCleanupTask({
      id: 'connection-cleanup',
      name: 'Connection Pool Cleanup',
      priority: 'normal',
      cleanup: this.cleanupConnections.bind(this),
      interval: this.config.connectionPooling.cleanupInterval,
      enabled: true
    });

    // File handle cleanup
    this.registerCleanupTask({
      id: 'file-handle-cleanup',
      name: 'File Handle Cleanup',
      priority: 'normal',
      cleanup: this.cleanupFileHandles.bind(this),
      interval: this.config.fileHandles.cleanupInterval,
      enabled: true
    });

    // Process cleanup
    this.registerCleanupTask({
      id: 'process-cleanup',
      name: 'Child Process Cleanup',
      priority: 'high',
      cleanup: this.cleanupProcesses.bind(this),
      interval: 60000, // 1 minute
      enabled: this.config.processManagement.cleanupOrphans
    });

    // Weak reference cleanup
    this.registerCleanupTask({
      id: 'weak-ref-cleanup',
      name: 'Weak Reference Cleanup',
      priority: 'low',
      cleanup: this.cleanupWeakReferences.bind(this),
      interval: 300000, // 5 minutes
      enabled: true
    });
  }

  private startMonitoring(): void {
    // Memory monitoring
    if (this.config.memoryMonitoring.enabled) {
      const memoryInterval = setInterval(() => {
        this.updateMemoryStats();
        this.checkMemoryThresholds();
      }, this.config.memoryMonitoring.checkInterval);
      
      this.intervals.push(memoryInterval);
    }

    // Start all cleanup task intervals
    for (const task of this.cleanupTasks.values()) {
      if (task.enabled && task.interval) {
        const taskInterval = setInterval(async () => {
          try {
            await this.executeCleanupTask(task.id);
          } catch (error) {
            this.logger.logError('Cleanup task failed', error, { taskId: task.id });
          }
        }, task.interval);
        
        this.intervals.push(taskInterval);
      }
    }
  }

  // Memory management methods
  public async performMemoryCleanup(): Promise<void> {
    const startTime = Date.now();
    const initialMemory = process.memoryUsage();

    try {
      // Clear weak references to garbage collected objects
      await this.cleanupWeakReferences();

      // Force garbage collection if available and memory usage is high
      if (global.gc && initialMemory.heapUsed > this.config.memoryMonitoring.gcThresholdMB * 1024 * 1024) {
        global.gc();
        this.logger.logBusinessOperation(
          'GARBAGE_COLLECTION_FORCED',
          'EnterpriseResourceManager',
          '',
          'SUCCESS',
          {
            beforeHeapMB: Math.round(initialMemory.heapUsed / 1024 / 1024),
            afterHeapMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
          }
        );
      }

      // Clear cached data if memory pressure is high
      if (initialMemory.heapUsed > this.config.memoryMonitoring.thresholdMB * 1024 * 1024) {
        await this.clearCaches();
      }

      const finalMemory = process.memoryUsage();
      const cleanupTime = Date.now() - startTime;
      const memoryFreed = initialMemory.heapUsed - finalMemory.heapUsed;

      this.logger.logBusinessOperation(
        'MEMORY_CLEANUP_COMPLETED',
        'EnterpriseResourceManager',
        '',
        'SUCCESS',
        {
          cleanupTimeMs: cleanupTime,
          memoryFreedMB: Math.round(memoryFreed / 1024 / 1024),
          beforeHeapMB: Math.round(initialMemory.heapUsed / 1024 / 1024),
          afterHeapMB: Math.round(finalMemory.heapUsed / 1024 / 1024)
        }
      );

    } catch (error) {
      this.logger.logError('Memory cleanup failed', error);
    }
  }

  public async cleanupConnections(): Promise<void> {
    let cleanedCount = 0;
    const now = Date.now();

    try {
      for (const [id, connection] of this.connectionPool.entries()) {
        const shouldCleanup = 
          (connection.lastUsed && now - connection.lastUsed > this.config.connectionPooling.idleTimeout) ||
          (connection.created && now - connection.created > this.config.connectionPooling.maxLifetime) ||
          !connection.isAlive;

        if (shouldCleanup) {
          try {
            if (connection.close) {
              await connection.close();
            }
            this.connectionPool.delete(id);
            cleanedCount++;
          } catch (closeError) {
            this.logger.logError('Failed to close connection', closeError, { connectionId: id });
          }
        }
      }

      this.updateConnectionStats();

      if (cleanedCount > 0) {
        this.logger.logBusinessOperation(
          'CONNECTIONS_CLEANED',
          'EnterpriseResourceManager',
          '',
          'SUCCESS',
          {
            cleanedCount,
            remainingConnections: this.connectionPool.size
          }
        );
      }

    } catch (error) {
      this.logger.logError('Connection cleanup failed', error);
    }
  }

  public async cleanupFileHandles(): Promise<void> {
    let cleanedCount = 0;

    try {
      for (const handle of this.fileHandles) {
        try {
          if (handle && typeof handle.close === 'function' && handle.destroyed !== true) {
            handle.close();
            this.fileHandles.delete(handle);
            cleanedCount++;
          }
        } catch (closeError) {
          this.logger.logError('Failed to close file handle', closeError);
          this.fileHandles.delete(handle); // Remove broken handle
        }
      }

      if (cleanedCount > 0) {
        this.logger.logBusinessOperation(
          'FILE_HANDLES_CLEANED',
          'EnterpriseResourceManager',
          '',
          'SUCCESS',
          {
            cleanedCount,
            remainingHandles: this.fileHandles.size
          }
        );
      }

      this.resourceStats.fileHandles.open = this.fileHandles.size;

    } catch (error) {
      this.logger.logError('File handle cleanup failed', error);
    }
  }

  public async cleanupProcesses(): Promise<void> {
    let cleanedCount = 0;
    const now = Date.now();

    try {
      for (const [id, processInfo] of this.childProcesses.entries()) {
        const shouldCleanup = 
          !processInfo.process || 
          processInfo.process.killed ||
          (processInfo.created && now - processInfo.created > this.config.processManagement.processTimeout);

        if (shouldCleanup) {
          try {
            if (processInfo.process && !processInfo.process.killed) {
              processInfo.process.kill('SIGTERM');
              
              // Force kill after 5 seconds if still running
              setTimeout(() => {
                if (!processInfo.process.killed) {
                  processInfo.process.kill('SIGKILL');
                }
              }, 5000);
            }
            
            this.childProcesses.delete(id);
            cleanedCount++;
            
          } catch (killError) {
            this.logger.logError('Failed to kill process', killError, { processId: id });
          }
        }
      }

      if (cleanedCount > 0) {
        this.logger.logBusinessOperation(
          'PROCESSES_CLEANED',
          'EnterpriseResourceManager',
          '',
          'SUCCESS',
          {
            cleanedCount,
            remainingProcesses: this.childProcesses.size
          }
        );
      }

      this.resourceStats.processes.active = this.childProcesses.size;

    } catch (error) {
      this.logger.logError('Process cleanup failed', error);
    }
  }

  public async cleanupWeakReferences(): Promise<void> {
    let cleanedCount = 0;

    try {
      for (const [key, entry] of this.weakReferences.entries()) {
        // Check if the weak reference is still valid
        const obj = entry.ref.deref();
        if (!obj) {
          this.weakReferences.delete(key);
          cleanedCount++;
        }
      }

      if (cleanedCount > 0) {
        this.logger.logBusinessOperation(
          'WEAK_REFERENCES_CLEANED',
          'EnterpriseResourceManager',
          '',
          'INFO',
          {
            cleanedCount,
            remainingReferences: this.weakReferences.size
          }
        );
      }

    } catch (error) {
      this.logger.logError('Weak reference cleanup failed', error);
    }
  }

  // Resource management methods
  public registerResource<T>(key: string, resource: T, cleanup?: () => void): void {
    // Create weak reference to track the resource
    const weakRef = new WeakRef(resource);
    this.weakReferences.set(key, {
      ref: weakRef,
      key,
      created: new Date(),
      lastAccessed: new Date()
    });

    // Register cleanup with FinalizationRegistry
    if (cleanup) {
      this.finalizers.register(resource, key, resource);
    }
  }

  public getResource<T>(key: string): T | null {
    const entry = this.weakReferences.get(key);
    if (entry) {
      const resource = entry.ref.deref();
      if (resource) {
        entry.lastAccessed = new Date();
        return resource as T;
      } else {
        // Resource has been garbage collected
        this.weakReferences.delete(key);
      }
    }
    return null;
  }

  public releaseResource(key: string): void {
    const entry = this.weakReferences.get(key);
    if (entry) {
      this.weakReferences.delete(key);
      
      // Try to get the resource one last time to perform cleanup
      const resource = entry.ref.deref();
      if (resource && typeof (resource as any).cleanup === 'function') {
        try {
          (resource as any).cleanup();
        } catch (error) {
          this.logger.logError('Resource cleanup failed', error, { resourceKey: key });
        }
      }
    }
  }

  // Connection pool management
  public addConnection(id: string, connection: any): void {
    if (this.connectionPool.size >= this.config.connectionPooling.maxConnections) {
      throw new Error('Maximum connection pool size exceeded');
    }

    this.connectionPool.set(id, {
      ...connection,
      created: Date.now(),
      lastUsed: Date.now(),
      isAlive: true
    });

    this.updateConnectionStats();
  }

  public getConnection(id: string): any {
    const connection = this.connectionPool.get(id);
    if (connection) {
      connection.lastUsed = Date.now();
      return connection;
    }
    return null;
  }

  public removeConnection(id: string): void {
    const connection = this.connectionPool.get(id);
    if (connection) {
      try {
        if (connection.close) {
          connection.close();
        }
      } catch (error) {
        this.logger.logError('Failed to close connection during removal', error, { connectionId: id });
      }
      
      this.connectionPool.delete(id);
      this.updateConnectionStats();
    }
  }

  // File handle management
  public trackFileHandle(handle: any): void {
    if (this.fileHandles.size >= this.config.fileHandles.maxOpenFiles) {
      throw new Error('Maximum file handles limit exceeded');
    }
    
    this.fileHandles.add(handle);
    this.resourceStats.fileHandles.open = this.fileHandles.size;
  }

  public untrackFileHandle(handle: any): void {
    this.fileHandles.delete(handle);
    this.resourceStats.fileHandles.open = this.fileHandles.size;
  }

  // Process management
  public trackChildProcess(id: string, process: any): void {
    if (this.childProcesses.size >= this.config.processManagement.maxChildProcesses) {
      throw new Error('Maximum child processes limit exceeded');
    }

    this.childProcesses.set(id, {
      process,
      created: Date.now(),
      id
    });

    this.resourceStats.processes.active = this.childProcesses.size;

    // Set up process event handlers
    process.on('exit', () => {
      this.childProcesses.delete(id);
      this.resourceStats.processes.active = this.childProcesses.size;
    });
  }

  // Cleanup task management
  public registerCleanupTask(task: ResourceCleanupTask): void {
    this.cleanupTasks.set(task.id, { ...task, lastRun: undefined });

    if (task.enabled && task.interval && this.intervals.length > 0) {
      // Start interval if monitoring is already running
      const taskInterval = setInterval(async () => {
        try {
          await this.executeCleanupTask(task.id);
        } catch (error) {
          this.logger.logError('Cleanup task failed', error, { taskId: task.id });
        }
      }, task.interval);
      
      this.intervals.push(taskInterval);
    }

    this.logger.logBusinessOperation(
      'CLEANUP_TASK_REGISTERED',
      'EnterpriseResourceManager',
      task.id,
      'SUCCESS',
      {
        name: task.name,
        priority: task.priority,
        interval: task.interval,
        enabled: task.enabled
      }
    );
  }

  public async executeCleanupTask(taskId: string): Promise<void> {
    const task = this.cleanupTasks.get(taskId);
    if (!task || !task.enabled) {
      return;
    }

    const startTime = Date.now();

    try {
      await task.cleanup();
      
      task.lastRun = new Date();
      this.cleanupTasks.set(taskId, task);

      const executionTime = Date.now() - startTime;

      this.logger.logBusinessOperation(
        'CLEANUP_TASK_EXECUTED',
        'EnterpriseResourceManager',
        taskId,
        'SUCCESS',
        {
          name: task.name,
          executionTimeMs: executionTime,
          priority: task.priority
        }
      );

    } catch (error) {
      this.logger.logError('Cleanup task execution failed', error, {
        taskId,
        taskName: task.name
      });
      throw error;
    }
  }

  // Monitoring and statistics
  public getResourceStats(): ResourceStats {
    this.updateMemoryStats();
    return { ...this.resourceStats };
  }

  public async generateResourceReport(): Promise<any> {
    const stats = this.getResourceStats();
    const cleanupTasks = Array.from(this.cleanupTasks.values());

    return {
      timestamp: new Date(),
      memory: {
        current: stats.memory,
        thresholds: {
          warning: this.config.memoryMonitoring.thresholdMB,
          critical: this.config.memoryMonitoring.alertThresholdMB,
          gcTrigger: this.config.memoryMonitoring.gcThresholdMB
        }
      },
      connections: {
        current: stats.connections,
        limits: {
          max: this.config.connectionPooling.maxConnections,
          idleTimeout: this.config.connectionPooling.idleTimeout,
          maxLifetime: this.config.connectionPooling.maxLifetime
        }
      },
      fileHandles: {
        current: stats.fileHandles,
        limit: this.config.fileHandles.maxOpenFiles
      },
      processes: {
        current: stats.processes,
        limit: this.config.processManagement.maxChildProcesses
      },
      cleanupTasks: cleanupTasks.map(task => ({
        id: task.id,
        name: task.name,
        priority: task.priority,
        enabled: task.enabled,
        interval: task.interval,
        lastRun: task.lastRun
      })),
      recommendations: this.generateRecommendations(stats)
    };
  }

  // Private utility methods
  private updateMemoryStats(): void {
    const usage = process.memoryUsage();
    
    this.resourceStats.memory = {
      heapUsed: usage.heapUsed,
      heapTotal: usage.heapTotal,
      external: usage.external,
      rss: usage.rss,
      arrayBuffers: usage.arrayBuffers,
      heapUsedMB: Math.round(usage.heapUsed / 1024 / 1024),
      heapTotalMB: Math.round(usage.heapTotal / 1024 / 1024),
      externalMB: Math.round(usage.external / 1024 / 1024),
      rssMB: Math.round(usage.rss / 1024 / 1024)
    };
  }

  private updateConnectionStats(): void {
    let active = 0;
    let idle = 0;

    for (const connection of this.connectionPool.values()) {
      if (connection.isActive) {
        active++;
      } else {
        idle++;
      }
    }

    this.resourceStats.connections = {
      active,
      idle,
      total: this.connectionPool.size
    };
  }

  private checkMemoryThresholds(): void {
    const heapUsedMB = this.resourceStats.memory.heapUsedMB;

    if (heapUsedMB > this.config.memoryMonitoring.alertThresholdMB) {
      this.emit('memoryAlert', {
        level: 'critical',
        usage: heapUsedMB,
        threshold: this.config.memoryMonitoring.alertThresholdMB
      });

      this.logger.logBusinessOperation(
        'MEMORY_ALERT_CRITICAL',
        'EnterpriseResourceManager',
        '',
        'CRITICAL',
        {
          heapUsedMB,
          threshold: this.config.memoryMonitoring.alertThresholdMB
        }
      );

    } else if (heapUsedMB > this.config.memoryMonitoring.thresholdMB) {
      this.emit('memoryAlert', {
        level: 'warning',
        usage: heapUsedMB,
        threshold: this.config.memoryMonitoring.thresholdMB
      });

      this.logger.logBusinessOperation(
        'MEMORY_ALERT_WARNING',
        'EnterpriseResourceManager',
        '',
        'WARNING',
        {
          heapUsedMB,
          threshold: this.config.memoryMonitoring.thresholdMB
        }
      );
    }
  }

  private async clearCaches(): Promise<void> {
    // This would integrate with cache managers to clear cached data
    this.emit('clearCaches', { reason: 'memory pressure' });
    
    this.logger.logBusinessOperation(
      'CACHES_CLEARED_MEMORY_PRESSURE',
      'EnterpriseResourceManager',
      '',
      'WARNING'
    );
  }

  private handleResourceFinalization(key: string): void {
    this.logger.logBusinessOperation(
      'RESOURCE_FINALIZED',
      'EnterpriseResourceManager',
      key,
      'INFO'
    );
  }

  private generateRecommendations(stats: ResourceStats): string[] {
    const recommendations: string[] = [];

    // Memory recommendations
    if (stats.memory.heapUsedMB > this.config.memoryMonitoring.thresholdMB) {
      recommendations.push('Consider reducing memory usage or increasing memory limits');
    }

    if (stats.memory.heapUsedMB / stats.memory.heapTotalMB > 0.9) {
      recommendations.push('Heap utilization is high - consider optimizing object lifecycle');
    }

    // Connection pool recommendations
    if (stats.connections.total > this.config.connectionPooling.maxConnections * 0.8) {
      recommendations.push('Connection pool usage is high - consider optimizing connection usage');
    }

    // File handle recommendations
    if (stats.fileHandles.open > this.config.fileHandles.maxOpenFiles * 0.8) {
      recommendations.push('File handle usage is high - ensure proper cleanup');
    }

    return recommendations;
  }

  public async shutdown(): Promise<void> {
    // Clear all intervals
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];

    // Execute final cleanup
    for (const task of this.cleanupTasks.values()) {
      if (task.enabled) {
        try {
          await task.cleanup();
        } catch (error) {
          this.logger.logError('Final cleanup task failed', error, { taskId: task.id });
        }
      }
    }

    // Clear all resources
    this.connectionPool.clear();
    this.fileHandles.clear();
    this.childProcesses.clear();
    this.weakReferences.clear();
    this.cleanupTasks.clear();

    this.logger.logBusinessOperation(
      'RESOURCE_MANAGER_SHUTDOWN',
      'EnterpriseResourceManager',
      '',
      'SUCCESS'
    );
  }
}

// Singleton instance
let resourceManager: EnterpriseResourceManager | null = null;

export function initializeResourceManager(config?: Partial<ResourceConfig>): EnterpriseResourceManager {
  if (resourceManager) {
    throw new Error('Resource manager already initialized');
  }
  
  resourceManager = new EnterpriseResourceManager(config);
  return resourceManager;
}

export function getResourceManager(): EnterpriseResourceManager {
  if (!resourceManager) {
    throw new Error('Resource manager not initialized. Call initializeResourceManager first.');
  }
  return resourceManager;
}

export { ResourceConfig, MemoryStats, ResourceStats, ResourceCleanupTask };