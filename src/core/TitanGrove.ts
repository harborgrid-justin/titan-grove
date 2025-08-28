import { EventEmitter } from 'events';
import { Logger } from 'winston';
import { TitanConfig, HealthCheck } from '../types';
import { DatabaseManager } from '../database/DatabaseManager';
import { ServerManager } from '../server/ServerManager';
import { CacheManager } from '../cache/CacheManager';
import { AnalyticsManager } from '../analytics/AnalyticsManager';
import { SecurityManager } from '../security/SecurityManager';
import { ClusterManager } from '../server/ClusterManager';
import { createLogger } from '../utils/logger';
import { validateConfig } from '../utils/config';

export class TitanGrove extends EventEmitter {
  private config: TitanConfig;
  private logger: Logger;
  private databaseManager: DatabaseManager;
  private serverManager: ServerManager;
  private cacheManager?: CacheManager;
  private analyticsManager?: AnalyticsManager;
  private securityManager: SecurityManager;
  private clusterManager?: ClusterManager;
  private initialized = false;
  private started = false;

  constructor(config: TitanConfig) {
    super();
    this.config = validateConfig(config);
    this.logger = createLogger(this.config.logging);

    // Initialize core managers
    this.databaseManager = new DatabaseManager(this.config.database, this.logger);
    this.serverManager = new ServerManager(this.config.server, this.logger);
    this.securityManager = new SecurityManager(this.config.server.security, this.logger);

    // Initialize optional managers
    if (this.config.cache) {
      this.cacheManager = new CacheManager(this.config.cache, this.logger);
    }

    if (this.config.analytics) {
      this.analyticsManager = new AnalyticsManager(this.config.analytics, this.logger);
    }

    if (this.config.cluster?.enabled) {
      this.clusterManager = new ClusterManager(this.config.cluster, this.logger);
    }

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    // Database events
    this.databaseManager.on('connected', () => {
      this.logger.info('Database connected successfully');
      this.emit('database:connected');
    });

    this.databaseManager.on('disconnected', () => {
      this.logger.info('Database disconnected');
      this.emit('database:disconnected');
    });

    this.databaseManager.on('error', (error: Error) => {
      this.logger.error('Database error:', error);
      this.emit('database:error', error);
    });

    // Server events
    this.serverManager.on('started', (port: number) => {
      this.logger.info(`Server started on port ${port}`);
      this.emit('server:started', port);
    });

    this.serverManager.on('stopped', () => {
      this.logger.info('Server stopped');
      this.emit('server:stopped');
    });

    this.serverManager.on('error', (error: Error) => {
      this.logger.error('Server error:', error);
      this.emit('server:error', error);
    });

    // Cache events
    if (this.cacheManager) {
      this.cacheManager.on('connected', () => {
        this.logger.info('Cache connected successfully');
        this.emit('cache:connected');
      });

      this.cacheManager.on('error', (error: Error) => {
        this.logger.error('Cache error:', error);
        this.emit('cache:error', error);
      });
    }

    // Analytics events
    if (this.analyticsManager) {
      this.analyticsManager.on('connected', () => {
        this.logger.info('Analytics engine connected');
        this.emit('analytics:connected');
      });

      this.analyticsManager.on('error', (error: Error) => {
        this.logger.error('Analytics error:', error);
        this.emit('analytics:error', error);
      });
    }
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      this.logger.warn('TitanGrove already initialized');
      return;
    }

    try {
      this.logger.info('Initializing TitanGrove...');

      // Initialize database
      await this.databaseManager.initialize();

      // Initialize cache if configured
      if (this.cacheManager) {
        await this.cacheManager.initialize();
      }

      // Initialize analytics if configured
      if (this.analyticsManager) {
        await this.analyticsManager.initialize();
      }

      // Initialize security
      await this.securityManager.initialize();

      // Initialize server
      await this.serverManager.initialize({
        database: this.databaseManager,
        cache: this.cacheManager,
        analytics: this.analyticsManager,
        security: this.securityManager,
      });

      this.initialized = true;
      this.logger.info('TitanGrove initialized successfully');
      this.emit('initialized');
    } catch (error) {
      this.logger.error('Failed to initialize TitanGrove:', error);
      this.emit('error', error);
      throw error;
    }
  }

  async start(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }

    if (this.started) {
      this.logger.warn('TitanGrove already started');
      return;
    }

    try {
      if (this.clusterManager) {
        // Start in cluster mode
        await this.clusterManager.start(() => this.startSingleInstance());
      } else {
        // Start single instance
        await this.startSingleInstance();
      }

      this.started = true;
      this.logger.info('TitanGrove started successfully');
      this.emit('started');
    } catch (error) {
      this.logger.error('Failed to start TitanGrove:', error);
      this.emit('error', error);
      throw error;
    }
  }

  private async startSingleInstance(): Promise<void> {
    await this.serverManager.start();
  }

  async stop(): Promise<void> {
    if (!this.started) {
      this.logger.warn('TitanGrove not started');
      return;
    }

    try {
      this.logger.info('Stopping TitanGrove...');

      // Stop server
      await this.serverManager.stop();

      // Stop cluster if enabled
      if (this.clusterManager) {
        await this.clusterManager.stop();
      }

      // Stop analytics
      if (this.analyticsManager) {
        await this.analyticsManager.stop();
      }

      // Stop cache
      if (this.cacheManager) {
        await this.cacheManager.stop();
      }

      // Stop database
      await this.databaseManager.stop();

      this.started = false;
      this.logger.info('TitanGrove stopped successfully');
      this.emit('stopped');
    } catch (error) {
      this.logger.error('Error stopping TitanGrove:', error);
      this.emit('error', error);
      throw error;
    }
  }

  async restart(): Promise<void> {
    await this.stop();
    await this.start();
  }

  async healthCheck(): Promise<HealthCheck[]> {
    const checks: HealthCheck[] = [];

    // Database health
    try {
      const dbHealth = await this.databaseManager.healthCheck();
      checks.push(dbHealth);
    } catch (error) {
      checks.push({
        service: 'database',
        status: 'unhealthy',
        timestamp: new Date(),
        details: { error: (error as Error).message },
      });
    }

    // Server health
    try {
      const serverHealth = await this.serverManager.healthCheck();
      checks.push(serverHealth);
    } catch (error) {
      checks.push({
        service: 'server',
        status: 'unhealthy',
        timestamp: new Date(),
        details: { error: (error as Error).message },
      });
    }

    // Cache health
    if (this.cacheManager) {
      try {
        const cacheHealth = await this.cacheManager.healthCheck();
        checks.push(cacheHealth);
      } catch (error) {
        checks.push({
          service: 'cache',
          status: 'unhealthy',
          timestamp: new Date(),
          details: { error: (error as Error).message },
        });
      }
    }

    // Analytics health
    if (this.analyticsManager) {
      try {
        const analyticsHealth = await this.analyticsManager.healthCheck();
        checks.push(analyticsHealth);
      } catch (error) {
        checks.push({
          service: 'analytics',
          status: 'unhealthy',
          timestamp: new Date(),
          details: { error: (error as Error).message },
        });
      }
    }

    return checks;
  }

  // Getter methods for accessing managers
  get database(): DatabaseManager {
    return this.databaseManager;
  }

  get server(): ServerManager {
    return this.serverManager;
  }

  get cache(): CacheManager | undefined {
    return this.cacheManager;
  }

  get analytics(): AnalyticsManager | undefined {
    return this.analyticsManager;
  }

  get security(): SecurityManager {
    return this.securityManager;
  }

  // Status getters
  get isInitialized(): boolean {
    return this.initialized;
  }

  get isStarted(): boolean {
    return this.started;
  }

  get version(): string {
    return require('../../package.json').version;
  }
}
