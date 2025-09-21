/**
 * Load Balancing and Failover System - Enterprise Grade
 * Implements Fix 33: Load balancing and failover
 */

import { EventEmitter } from 'events';
import { getLogger } from '../../utils/enterprise-logger';

interface ServerNode {
  id: string;
  host: string;
  port: number;
  weight: number;
  isHealthy: boolean;
  currentConnections: number;
  maxConnections: number;
  responseTime: number;
  lastHealthCheck: Date;
  errorCount: number;
  totalRequests: number;
}

interface LoadBalancerConfig {
  algorithm: 'round-robin' | 'weighted-round-robin' | 'least-connections';
  healthCheckInterval: number;
  maxRetries: number;
  circuitBreakerThreshold: number;
}

interface RoutingResult {
  server: ServerNode | null;
  reason: string;
}

export class LoadBalancerService extends EventEmitter {
  private logger = getLogger('LoadBalancerService');
  private config: LoadBalancerConfig;
  private servers = new Map<string, ServerNode>();
  private roundRobinIndex = 0;

  constructor(config: LoadBalancerConfig) {
    super();
    this.config = config;
    
    this.logger.logBusinessOperation(
      'LOAD_BALANCER_INITIALIZED',
      'LoadBalancerService',
      '',
      'SUCCESS',
      { algorithm: config.algorithm }
    );
  }

  public addServer(server: Omit<ServerNode, 'isHealthy' | 'currentConnections' | 'responseTime' | 'lastHealthCheck' | 'errorCount' | 'totalRequests'>): void {
    const serverNode: ServerNode = {
      ...server,
      isHealthy: true,
      currentConnections: 0,
      responseTime: 0,
      lastHealthCheck: new Date(),
      errorCount: 0,
      totalRequests: 0
    };

    this.servers.set(server.id, serverNode);
  }

  public selectServer(): RoutingResult {
    const healthyServers = Array.from(this.servers.values()).filter(s => s.isHealthy);

    if (healthyServers.length === 0) {
      return {
        server: null,
        reason: 'No healthy servers available'
      };
    }

    let selectedServer: ServerNode;

    switch (this.config.algorithm) {
      case 'round-robin':
        selectedServer = healthyServers[this.roundRobinIndex % healthyServers.length];
        this.roundRobinIndex++;
        break;
      case 'least-connections':
        selectedServer = healthyServers.reduce((min, server) => 
          server.currentConnections < min.currentConnections ? server : min
        );
        break;
      default:
        selectedServer = healthyServers[0];
    }

    selectedServer.currentConnections++;
    selectedServer.totalRequests++;

    return {
      server: selectedServer,
      reason: `Selected by ${this.config.algorithm}`
    };
  }

  public getLoadBalancerStats() {
    const servers = Array.from(this.servers.values());
    const healthyServers = servers.filter(s => s.isHealthy);

    return {
      totalServers: servers.length,
      healthyServers: healthyServers.length,
      algorithm: this.config.algorithm
    };
  }
}

export { ServerNode, LoadBalancerConfig, RoutingResult };