import { EventEmitter } from 'events';
import { Logger } from 'winston';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { ServerConfig, HealthCheck, APIResponse } from '../types';
import { DatabaseManager } from '../database/DatabaseManager';
import { CacheManager } from '../cache/CacheManager';
import { AnalyticsManager } from '../analytics/AnalyticsManager';
import { SecurityManager } from '../security/SecurityManager';
import * as http from 'http';

export interface ServerDependencies {
  database: DatabaseManager;
  cache?: CacheManager;
  analytics?: AnalyticsManager;
  security: SecurityManager;
}

export class ServerManager extends EventEmitter {
  private config: ServerConfig;
  private logger: Logger;
  private app: Express;
  private server?: http.Server;
  private dependencies?: ServerDependencies;

  constructor(config: ServerConfig, logger: Logger) {
    super();
    this.config = config;
    this.logger = logger;
    this.app = express();
  }

  async initialize(dependencies: ServerDependencies): Promise<void> {
    this.dependencies = dependencies;
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    // Security middleware
    if (this.config.security?.helmet) {
      this.app.use(helmet());
    }

    // CORS
    if (this.config.cors) {
      this.app.use(cors(this.config.cors));
    }

    // Compression
    if (this.config.compression) {
      this.app.use(compression());
    }

    // Rate limiting
    if (this.config.rateLimit) {
      const limiter = rateLimit(this.config.rateLimit);
      this.app.use(limiter);
    }

    // Body parsing
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    // Request logging
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - startTime;
        this.logger.info(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
      });
      next();
    });
  }

  private setupRoutes(): void {
    // Serve React UI static assets
    this.app.use('/assets', express.static('dist/ui/assets'));

    // Serve React UI application for all non-API routes
    this.app.get('/', (req: Request, res: Response) => {
      res.sendFile(path.resolve('dist/ui/index.html'));
    });

    // Serve React UI for all SPA routes (catch-all for client-side routing)
    this.app.get(
      [
        '/dashboard',
        '/manufacturing',
        '/financials',
        '/hr-management',
        '/supply-chain',
        '/crm',
        '/business-intelligence',
        '/project-management',
        '/asset-management',
        '/compliance',
      ],
      (req: Request, res: Response) => {
        res.sendFile(path.resolve('dist/ui/index.html'));
      }
    );

    // Health check endpoint
    this.app.get('/health', async (req: Request, res: Response) => {
      const startTime = Date.now();
      try {
        const healthChecks = await this.performHealthChecks();
        const allHealthy = healthChecks.every((check) => check.status === 'healthy');

        const response: APIResponse = {
          success: allHealthy,
          data: healthChecks,
          meta: {
            executionTime: Date.now() - startTime,
          },
        };

        res.status(allHealthy ? 200 : 503).json(response);
      } catch (error) {
        const response: APIResponse = {
          success: false,
          error: {
            code: 'HEALTH_CHECK_FAILED',
            message: 'Health check failed',
            details: (error as Error).message,
          },
        };
        res.status(500).json(response);
      }
    });

    // API info endpoint
    this.app.get('/api/info', (req: Request, res: Response) => {
      const response: APIResponse = {
        success: true,
        data: {
          name: 'Titan Grove',
          version: '1.0.0',
          description: 'Enterprise-grade Node.js database and application platform',
          timestamp: new Date().toISOString(),
        },
      };
      res.json(response);
    });

    // UI System API endpoints
    this.app.use('/api/ui', this.createUIRoutes());

    // Database API endpoints
    this.app.use('/api/database', this.createDatabaseRoutes());

    // Cache API endpoints (if available)
    if (this.dependencies?.cache) {
      this.app.use('/api/cache', this.createCacheRoutes());
    }

    // Analytics API endpoints (if available)
    if (this.dependencies?.analytics) {
      this.app.use('/api/analytics', this.createAnalyticsRoutes());
    }

    // 404 handler
    this.app.use((req: Request, res: Response) => {
      const response: APIResponse = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Route ${req.originalUrl} not found`,
        },
      };
      res.status(404).json(response);
    });
  }

  private createDatabaseRoutes(): express.Router {
    const router = express.Router();

    // Execute raw query
    router.post('/query', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { sql, params } = req.body;

        if (!sql) {
          const response: APIResponse = {
            success: false,
            error: {
              code: 'MISSING_SQL',
              message: 'SQL query is required',
            },
          };
          return res.status(400).json(response);
        }

        const result = await this.dependencies!.database.query(sql, params);

        const response: APIResponse = {
          success: true,
          data: result,
        };

        res.json(response);
      } catch (error) {
        next(error);
      }
    });

    // Health check
    router.get('/health', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const health = await this.dependencies!.database.healthCheck();
        const response: APIResponse = {
          success: health.status === 'healthy',
          data: health,
        };
        res.json(response);
      } catch (error) {
        next(error);
      }
    });

    return router;
  }

  private createCacheRoutes(): express.Router {
    const router = express.Router();

    // Get cache value
    router.get('/:key', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { key } = req.params;
        const value = await this.dependencies!.cache!.get(key);

        const response: APIResponse = {
          success: true,
          data: { key, value },
        };

        res.json(response);
      } catch (error) {
        next(error);
      }
    });

    // Set cache value
    router.post('/', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { key, value, ttl } = req.body;

        if (!key || value === undefined) {
          const response: APIResponse = {
            success: false,
            error: {
              code: 'MISSING_PARAMS',
              message: 'Key and value are required',
            },
          };
          return res.status(400).json(response);
        }

        await this.dependencies!.cache!.set(key, value, ttl);

        const response: APIResponse = {
          success: true,
          data: { key, value, ttl },
        };

        res.json(response);
      } catch (error) {
        next(error);
      }
    });

    return router;
  }

  private createAnalyticsRoutes(): express.Router {
    const router = express.Router();

    // Track event
    router.post('/events', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const event = req.body;
        // TODO: Implement event tracking

        const response: APIResponse = {
          success: true,
          data: { message: 'Event tracked successfully' },
        };

        res.json(response);
      } catch (error) {
        next(error);
      }
    });

    return router;
  }

  private createUIRoutes(): express.Router {
    const router = express.Router();

    // Get available components
    router.get('/components', async (req: Request, res: Response, next: NextFunction) => {
      try {
        // TODO: Integrate with actual UIManager
        const components = [
          {
            id: 'line-chart',
            type: 'chart',
            name: 'Line Chart',
            version: '1.0.0',
            config: {
              behavior: { interactive: true, realtime: true },
              responsive: { breakpoints: { mobile: 320, tablet: 768, desktop: 1024, wide: 1440 } },
            },
          },
          {
            id: 'data-table',
            type: 'table',
            name: 'Data Table',
            version: '1.0.0',
            config: {
              behavior: { interactive: true, cacheable: true },
              responsive: { breakpoints: { mobile: 320, tablet: 768, desktop: 1024, wide: 1440 } },
            },
          },
          {
            id: 'kpi-card',
            type: 'metric',
            name: 'KPI Card',
            version: '1.0.0',
            config: {
              behavior: { realtime: true },
              responsive: { breakpoints: { mobile: 320, tablet: 768, desktop: 1024, wide: 1440 } },
            },
          },
        ];

        const response: APIResponse = {
          success: true,
          data: components,
        };

        res.json(response);
      } catch (error) {
        next(error);
      }
    });

    // Get available themes
    router.get('/themes', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const themes = [
          {
            id: 'modern',
            name: 'Modern',
            description: 'Clean, modern interface',
            colors: {
              primary: '#2563eb',
              secondary: '#64748b',
              accent: '#f59e0b',
            },
          },
        ];

        const response: APIResponse = {
          success: true,
          data: themes,
        };

        res.json(response);
      } catch (error) {
        next(error);
      }
    });

    // Get dashboard templates
    router.get('/dashboard/templates', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const templates = [
          {
            id: 'template-executive',
            name: 'Executive Dashboard',
            description: 'High-level KPIs and metrics for executives',
            preview: '/ui/previews/executive-dashboard.png',
          },
        ];

        const response: APIResponse = {
          success: true,
          data: templates,
        };

        res.json(response);
      } catch (error) {
        next(error);
      }
    });

    // Mock data endpoints for demo
    router.get('/data/revenue', async (req: Request, res: Response) => {
      const response: APIResponse = {
        success: true,
        data: {
          current: 2450000,
          previous: 2180000,
          trend: 'up',
          trendValue: 12.5,
        },
      };
      res.json(response);
    });

    router.get('/data/transactions', async (req: Request, res: Response) => {
      const response: APIResponse = {
        success: true,
        data: {
          rows: [
            {
              id: 'TXN-2024-001',
              customer: 'Acme Corporation',
              amount: 45250.0,
              date: '2024-01-15',
              status: 'Completed',
            },
            {
              id: 'TXN-2024-002',
              customer: 'TechStart Inc.',
              amount: 12800.0,
              date: '2024-01-14',
              status: 'Pending',
            },
          ],
          totalCount: 25,
        },
      };
      res.json(response);
    });

    return router;
  }

  private setupErrorHandling(): void {
    // Error handler
    this.app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
      this.logger.error('Request error:', error);

      const response: APIResponse = {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message:
            process.env.NODE_ENV === 'production' ? 'An internal error occurred' : error.message,
        },
      };

      res.status(500).json(response);
    });
  }

  private async performHealthChecks(): Promise<HealthCheck[]> {
    const checks: HealthCheck[] = [];

    // Database health
    if (this.dependencies?.database) {
      checks.push(await this.dependencies.database.healthCheck());
    }

    // Cache health
    if (this.dependencies?.cache) {
      checks.push(await this.dependencies.cache.healthCheck());
    }

    // Analytics health
    if (this.dependencies?.analytics) {
      checks.push(await this.dependencies.analytics.healthCheck());
    }

    return checks;
  }

  async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(this.config.port, this.config.host, () => {
        this.logger.info(`Server started on ${this.config.host}:${this.config.port}`);
        this.emit('started', this.config.port);
        resolve();
      });

      this.server.on('error', (error) => {
        this.logger.error('Server error:', error);
        this.emit('error', error);
        reject(error);
      });
    });
  }

  async stop(): Promise<void> {
    if (this.server) {
      return new Promise((resolve) => {
        this.server!.close(() => {
          this.logger.info('Server stopped');
          this.emit('stopped');
          resolve();
        });
      });
    }
  }

  async healthCheck(): Promise<HealthCheck> {
    return {
      service: 'server',
      status: this.server ? 'healthy' : 'unhealthy',
      timestamp: new Date(),
      details: {
        port: this.config.port,
        host: this.config.host,
      },
    };
  }
}
