/**
 * Centralized Service Registry with built-in error boundaries and circuit breakers
 * Provides dependency injection, service discovery, and centralized error handling
 */

import { ErrorBoundary, ErrorBoundaryConfig } from './ErrorBoundary';
import { Logger } from 'winston';
import { EventEmitter } from 'events';

export interface ServiceMetadata {
  name: string;
  version: string;
  description?: string;
  dependencies?: string[];
  healthCheckEndpoint?: string;
  tags?: string[];
}

export interface ServiceConfig {
  metadata: ServiceMetadata;
  errorBoundaryConfig?: ErrorBoundaryConfig;
  singleton?: boolean;
  lazy?: boolean;
}

export interface ServiceHealth {
  serviceName: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  lastCheck: Date;
  details?: Record<string, any>;
  errorBoundaryMetrics?: any;
  circuitBreakerMetrics?: any;
}

export abstract class BaseService extends EventEmitter {
  protected errorBoundary?: ErrorBoundary;
  protected logger?: Logger;
  protected correlationId?: string;

  constructor(
    protected readonly serviceName: string,
    protected readonly serviceRegistry?: ServiceRegistry
  ) {
    super();
  }

  async initialize(): Promise<void> {
    // Override in concrete services
  }

  async destroy(): Promise<void> {
    // Override in concrete services
  }

  async healthCheck(): Promise<ServiceHealth> {
    return {
      serviceName: this.serviceName,
      status: 'healthy',
      lastCheck: new Date(),
      errorBoundaryMetrics: this.errorBoundary?.getMetrics(),
      circuitBreakerMetrics: this.errorBoundary?.getCircuitBreakerMetrics()
    };
  }

  setErrorBoundary(errorBoundary: ErrorBoundary): void {
    this.errorBoundary = errorBoundary;
  }

  setLogger(logger: Logger): void {
    this.logger = logger;
  }

  protected getDependency<T extends BaseService>(serviceName: string): T {
    if (!this.serviceRegistry) {
      throw new Error(`Service registry not available for ${this.serviceName}`);
    }
    return this.serviceRegistry.getService<T>(serviceName);
  }
}

export class ServiceRegistry extends EventEmitter {
  private services = new Map<string, BaseService>();
  private serviceConfigs = new Map<string, ServiceConfig>();
  private serviceFactories = new Map<string, () => BaseService>();
  private initializedServices = new Set<string>();

  constructor(private readonly logger?: Logger) {
    super();
  }

  register<T extends BaseService>(
    serviceFactory: () => T,
    config: ServiceConfig
  ): void {
    const serviceName = config.metadata.name;
    
    if (this.serviceFactories.has(serviceName)) {
      throw new Error(`Service ${serviceName} is already registered`);
    }

    this.serviceFactories.set(serviceName, serviceFactory);
    this.serviceConfigs.set(serviceName, config);
    
    this.logger?.info(`Service registered: ${serviceName}`, { metadata: config.metadata });
    this.emit('service:registered', serviceName, config);
  }

  getService<T extends BaseService>(serviceName: string): T {
    let service = this.services.get(serviceName) as T;
    
    if (!service) {
      service = this.createService<T>(serviceName);
    }

    return service;
  }

  private createService<T extends BaseService>(serviceName: string): T {
    const factory = this.serviceFactories.get(serviceName);
    const config = this.serviceConfigs.get(serviceName);
    
    if (!factory || !config) {
      throw new Error(`Service ${serviceName} not found in registry`);
    }

    this.logger?.info(`Creating service instance: ${serviceName}`);
    
    const service = factory() as T;
    service.setLogger(this.logger!);
    
    // Set up error boundary if configured
    if (config.errorBoundaryConfig) {
      const errorBoundary = new ErrorBoundary({
        ...config.errorBoundaryConfig,
        serviceName,
        logger: this.logger
      });
      service.setErrorBoundary(errorBoundary);
    }

    // Store service instance if singleton
    if (config.singleton !== false) {
      this.services.set(serviceName, service);
    }

    this.emit('service:created', serviceName, service);
    return service;
  }

  async initializeService(serviceName: string): Promise<void> {
    if (this.initializedServices.has(serviceName)) {
      return;
    }

    const config = this.serviceConfigs.get(serviceName);
    if (!config) {
      throw new Error(`Service configuration not found: ${serviceName}`);
    }

    // Initialize dependencies first
    if (config.metadata.dependencies) {
      for (const dependency of config.metadata.dependencies) {
        await this.initializeService(dependency);
      }
    }

    this.logger?.info(`Initializing service: ${serviceName}`);
    
    const service = this.getService(serviceName);
    
    try {
      await service.initialize();
      this.initializedServices.add(serviceName);
      this.logger?.info(`Service initialized successfully: ${serviceName}`);
      this.emit('service:initialized', serviceName, service);
    } catch (error) {
      this.logger?.error(`Failed to initialize service: ${serviceName}`, error);
      this.emit('service:initialization_failed', serviceName, error);
      throw error;
    }
  }

  async initializeAll(): Promise<void> {
    const serviceNames = Array.from(this.serviceConfigs.keys());
    
    for (const serviceName of serviceNames) {
      const config = this.serviceConfigs.get(serviceName);
      if (config && !config.lazy) {
        await this.initializeService(serviceName);
      }
    }
  }

  async destroyService(serviceName: string): Promise<void> {
    const service = this.services.get(serviceName);
    if (service) {
      this.logger?.info(`Destroying service: ${serviceName}`);
      
      try {
        await service.destroy();
        this.services.delete(serviceName);
        this.initializedServices.delete(serviceName);
        this.logger?.info(`Service destroyed successfully: ${serviceName}`);
        this.emit('service:destroyed', serviceName);
      } catch (error) {
        this.logger?.error(`Failed to destroy service: ${serviceName}`, error);
        this.emit('service:destruction_failed', serviceName, error);
        throw error;
      }
    }
  }

  async destroyAll(): Promise<void> {
    const serviceNames = Array.from(this.services.keys());
    
    for (const serviceName of serviceNames) {
      await this.destroyService(serviceName);
    }
  }

  async healthCheck(): Promise<ServiceHealth[]> {
    const healthChecks: ServiceHealth[] = [];
    
    for (const [serviceName, service] of this.services.entries()) {
      try {
        const health = await service.healthCheck();
        healthChecks.push(health);
      } catch (error) {
        healthChecks.push({
          serviceName,
          status: 'unhealthy',
          lastCheck: new Date(),
          details: { error: (error as Error).message }
        });
      }
    }

    return healthChecks;
  }

  getServiceNames(): string[] {
    return Array.from(this.serviceConfigs.keys());
  }

  getServiceConfig(serviceName: string): ServiceConfig | undefined {
    return this.serviceConfigs.get(serviceName);
  }

  isServiceRegistered(serviceName: string): boolean {
    return this.serviceFactories.has(serviceName);
  }

  isServiceInitialized(serviceName: string): boolean {
    return this.initializedServices.has(serviceName);
  }
}