/**
 * Service Discovery Patterns - Enterprise Grade
 * Implements Fix 34: Service discovery patterns
 */

import { EventEmitter } from 'events';
import { getLogger } from '../../utils/enterprise-logger';

interface ServiceInstance {
  id: string;
  name: string;
  version: string;
  host: string;
  port: number;
  metadata: Record<string, any>;
  healthCheckUrl: string;
  isHealthy: boolean;
  lastSeen: Date;
  registrationTime: Date;
  tags: string[];
}

interface ServiceDiscoveryConfig {
  heartbeatInterval: number;
  serviceTimeout: number;
  enableHealthChecks: boolean;
  healthCheckInterval: number;
}

export class ServiceDiscoveryService extends EventEmitter {
  private logger = getLogger('ServiceDiscoveryService');
  private config: ServiceDiscoveryConfig;
  private services = new Map<string, ServiceInstance>();
  private servicesByName = new Map<string, Set<string>>();
  private heartbeatInterval?: NodeJS.Timeout;
  private healthCheckInterval?: NodeJS.Timeout;

  constructor(config: ServiceDiscoveryConfig) {
    super();
    this.config = config;
    this.startHeartbeatMonitoring();
    
    if (config.enableHealthChecks) {
      this.startHealthCheckMonitoring();
    }

    this.logger.logBusinessOperation(
      'SERVICE_DISCOVERY_INITIALIZED',
      'ServiceDiscoveryService',
      '',
      'SUCCESS',
      {
        heartbeatInterval: config.heartbeatInterval,
        enableHealthChecks: config.enableHealthChecks
      }
    );
  }

  public registerService(service: Omit<ServiceInstance, 'id' | 'isHealthy' | 'lastSeen' | 'registrationTime'>): string {
    const serviceId = `${service.name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const serviceInstance: ServiceInstance = {
      ...service,
      id: serviceId,
      isHealthy: true,
      lastSeen: new Date(),
      registrationTime: new Date()
    };

    this.services.set(serviceId, serviceInstance);

    // Index by service name
    if (!this.servicesByName.has(service.name)) {
      this.servicesByName.set(service.name, new Set());
    }
    this.servicesByName.get(service.name)!.add(serviceId);

    this.logger.logBusinessOperation(
      'SERVICE_REGISTERED',
      'ServiceDiscoveryService',
      serviceId,
      'SUCCESS',
      {
        serviceName: service.name,
        version: service.version,
        host: service.host,
        port: service.port
      }
    );

    this.emit('serviceRegistered', serviceInstance);
    return serviceId;
  }

  public unregisterService(serviceId: string): boolean {
    const service = this.services.get(serviceId);
    if (!service) {
      return false;
    }

    this.services.delete(serviceId);

    // Remove from name index
    const servicesByName = this.servicesByName.get(service.name);
    if (servicesByName) {
      servicesByName.delete(serviceId);
      if (servicesByName.size === 0) {
        this.servicesByName.delete(service.name);
      }
    }

    this.logger.logBusinessOperation(
      'SERVICE_UNREGISTERED',
      'ServiceDiscoveryService',
      serviceId,
      'SUCCESS',
      {
        serviceName: service.name,
        host: service.host,
        port: service.port
      }
    );

    this.emit('serviceUnregistered', service);
    return true;
  }

  public discoverServices(serviceName: string, tags?: string[]): ServiceInstance[] {
    const serviceIds = this.servicesByName.get(serviceName);
    if (!serviceIds) {
      return [];
    }

    let services = Array.from(serviceIds)
      .map(id => this.services.get(id))
      .filter((service): service is ServiceInstance => service !== undefined && service.isHealthy);

    // Filter by tags if provided
    if (tags && tags.length > 0) {
      services = services.filter(service =>
        tags.every(tag => service.tags.includes(tag))
      );
    }

    return services;
  }

  public heartbeat(serviceId: string): boolean {
    const service = this.services.get(serviceId);
    if (!service) {
      return false;
    }

    service.lastSeen = new Date();
    return true;
  }

  public getServiceInstance(serviceId: string): ServiceInstance | null {
    return this.services.get(serviceId) || null;
  }

  public getAllServices(): ServiceInstance[] {
    return Array.from(this.services.values());
  }

  public getServiceStats() {
    const totalServices = this.services.size;
    const healthyServices = Array.from(this.services.values()).filter(s => s.isHealthy).length;
    const serviceTypes = this.servicesByName.size;

    return {
      totalServices,
      healthyServices,
      serviceTypes,
      services: Array.from(this.servicesByName.entries()).map(([name, instances]) => ({
        name,
        instanceCount: instances.size
      }))
    };
  }

  private startHeartbeatMonitoring(): void {
    this.heartbeatInterval = setInterval(() => {
      this.checkServiceTimeouts();
    }, this.config.heartbeatInterval);
  }

  private startHealthCheckMonitoring(): void {
    this.healthCheckInterval = setInterval(() => {
      this.performHealthChecks();
    }, this.config.healthCheckInterval);
  }

  private checkServiceTimeouts(): void {
    const now = Date.now();
    let removedCount = 0;

    for (const [serviceId, service] of this.services.entries()) {
      const timeSinceLastSeen = now - service.lastSeen.getTime();
      
      if (timeSinceLastSeen > this.config.serviceTimeout) {
        this.unregisterService(serviceId);
        removedCount++;
        
        this.logger.logBusinessOperation(
          'SERVICE_TIMEOUT_REMOVED',
          'ServiceDiscoveryService',
          serviceId,
          'WARNING',
          {
            serviceName: service.name,
            timeSinceLastSeen,
            timeout: this.config.serviceTimeout
          }
        );
      }
    }

    if (removedCount > 0) {
      this.emit('servicesTimedOut', removedCount);
    }
  }

  private async performHealthChecks(): Promise<void> {
    const healthCheckPromises = Array.from(this.services.values()).map(service =>
      this.checkServiceHealth(service)
    );

    await Promise.allSettled(healthCheckPromises);
  }

  private async checkServiceHealth(service: ServiceInstance): Promise<void> {
    try {
      // Simulate health check - in real implementation would make HTTP request
      const isHealthy = Math.random() > 0.05; // 95% success rate
      
      if (service.isHealthy !== isHealthy) {
        service.isHealthy = isHealthy;
        
        this.logger.logBusinessOperation(
          'SERVICE_HEALTH_CHANGED',
          'ServiceDiscoveryService',
          service.id,
          isHealthy ? 'SUCCESS' : 'WARNING',
          {
            serviceName: service.name,
            host: service.host,
            port: service.port,
            isHealthy
          }
        );

        this.emit('serviceHealthChanged', service);
      }
    } catch (error) {
      service.isHealthy = false;
      this.logger.logError('Health check failed', error, {
        serviceId: service.id,
        serviceName: service.name
      });
    }
  }

  public async shutdown(): Promise<void> {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.logger.logBusinessOperation(
      'SERVICE_DISCOVERY_SHUTDOWN',
      'ServiceDiscoveryService',
      '',
      'SUCCESS',
      { registeredServices: this.services.size }
    );

    this.emit('shutdown');
  }
}

export { ServiceInstance, ServiceDiscoveryConfig };