/**
 * Enterprise API Security and CORS Middleware
 * Comprehensive security middleware for API endpoints
 */

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getLogger } from '../utils/enterprise-logger';
import { RateLimitError, AuthenticationError, AuthorizationError } from '../utils/error-handling';
import { performanceMonitor } from '../utils/performance-monitoring';
import { configManager } from '../utils/config-cache';

// ============================================================================
// SECURITY INTERFACES
// ============================================================================

export interface SecurityConfig {
  cors: {
    origins: string[];
    methods: string[];
    allowedHeaders: string[];
    credentials: boolean;
    maxAge: number;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
    skipSuccessfulRequests: boolean;
    skipFailedRequests: boolean;
  };
  headers: {
    frameOptions: 'DENY' | 'SAMEORIGIN' | 'ALLOW-FROM';
    contentTypeOptions: boolean;
    xssProtection: boolean;
    hsts: {
      enabled: boolean;
      maxAge: number;
      includeSubDomains: boolean;
      preload: boolean;
    };
  };
  authentication: {
    jwtSecret: string;
    tokenExpiry: string;
    refreshTokenExpiry: string;
    issuer: string;
    audience: string[];
  };
}

export interface AuthContext {
  userId: string;
  username: string;
  roles: string[];
  permissions: string[];
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  issuedAt: Date;
  expiresAt: Date;
}

export interface RateLimitStore {
  increment(key: string, windowMs: number): Promise<{ totalHits: number; resetTime: number }>;
  decrement?(key: string): Promise<void>;
  reset?(key: string): Promise<void>;
}

// ============================================================================
// CORS MIDDLEWARE
// ============================================================================

export class CorsMiddleware {
  private logger = getLogger('cors-middleware');
  private config: SecurityConfig['cors'];

  constructor(config?: Partial<SecurityConfig['cors']>) {
    this.config = {
      origins: configManager.get('CORS_ORIGINS', ['http://localhost:3000']),
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Origin',
        'X-Requested-With', 
        'Content-Type',
        'Accept',
        'Authorization',
        'X-API-Key',
        'X-Correlation-ID'
      ],
      credentials: true,
      maxAge: 86400, // 24 hours
      ...config
    };
  }

  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const timer = performanceMonitor.startTimer('cors_processing', 'SECURITY');
      
      const origin = req.headers.origin as string;
      
      // Check if origin is allowed
      if (this.isOriginAllowed(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      } else if (this.config.origins.includes('*')) {
        res.setHeader('Access-Control-Allow-Origin', '*');
      }

      // Set CORS headers
      res.setHeader('Access-Control-Allow-Methods', this.config.methods.join(', '));
      res.setHeader('Access-Control-Allow-Headers', this.config.allowedHeaders.join(', '));
      res.setHeader('Access-Control-Max-Age', this.config.maxAge.toString());
      
      if (this.config.credentials) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
      }

      // Log CORS request
      this.logger.debug('CORS request processed', {
        origin,
        method: req.method,
        allowed: this.isOriginAllowed(origin) || this.config.origins.includes('*')
      });

      // Handle preflight requests
      if (req.method === 'OPTIONS') {
        performanceMonitor.stopTimer(timer, true);
        return res.status(204).send();
      }

      performanceMonitor.stopTimer(timer, true);
      next();
    };
  }

  private isOriginAllowed(origin: string): boolean {
    if (!origin) return false;
    
    return this.config.origins.some(allowedOrigin => {
      if (allowedOrigin === '*') return true;
      if (allowedOrigin.includes('*')) {
        const pattern = allowedOrigin.replace(/\*/g, '.*');
        const regex = new RegExp(`^${pattern}$`);
        return regex.test(origin);
      }
      return allowedOrigin === origin;
    });
  }
}

// ============================================================================
// SECURITY HEADERS MIDDLEWARE
// ============================================================================

export class SecurityHeadersMiddleware {
  private logger = getLogger('security-headers');
  private config: SecurityConfig['headers'];

  constructor(config?: Partial<SecurityConfig['headers']>) {
    this.config = {
      frameOptions: 'DENY',
      contentTypeOptions: true,
      xssProtection: true,
      hsts: {
        enabled: true,
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: false
      },
      ...config
    };
  }

  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      // X-Frame-Options
      res.setHeader('X-Frame-Options', this.config.frameOptions);

      // X-Content-Type-Options
      if (this.config.contentTypeOptions) {
        res.setHeader('X-Content-Type-Options', 'nosniff');
      }

      // X-XSS-Protection
      if (this.config.xssProtection) {
        res.setHeader('X-XSS-Protection', '1; mode=block');
      }

      // Strict-Transport-Security
      if (this.config.hsts.enabled && req.secure) {
        let hstsHeader = `max-age=${this.config.hsts.maxAge}`;
        if (this.config.hsts.includeSubDomains) {
          hstsHeader += '; includeSubDomains';
        }
        if (this.config.hsts.preload) {
          hstsHeader += '; preload';
        }
        res.setHeader('Strict-Transport-Security', hstsHeader);
      }

      // Content-Security-Policy (basic)
      res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");

      // Referrer-Policy
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

      // Permissions-Policy
      res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

      this.logger.debug('Security headers applied', {
        userAgent: req.headers['user-agent'],
        secure: req.secure
      });

      next();
    };
  }
}

// ============================================================================
// RATE LIMITING MIDDLEWARE
// ============================================================================

export class InMemoryRateLimitStore implements RateLimitStore {
  private store: Map<string, { count: number; resetTime: number }> = new Map();

  async increment(key: string, windowMs: number): Promise<{ totalHits: number; resetTime: number }> {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetTime) {
      // New window
      const resetTime = now + windowMs;
      this.store.set(key, { count: 1, resetTime });
      return { totalHits: 1, resetTime };
    } else {
      // Increment existing
      entry.count++;
      this.store.set(key, entry);
      return { totalHits: entry.count, resetTime: entry.resetTime };
    }
  }

  async reset(key: string): Promise<void> {
    this.store.delete(key);
  }
}

export class RateLimitMiddleware {
  private logger = getLogger('rate-limit');
  private store: RateLimitStore;
  private config: SecurityConfig['rateLimit'];

  constructor(config?: Partial<SecurityConfig['rateLimit']>, store?: RateLimitStore) {
    this.config = {
      windowMs: configManager.get('RATE_LIMIT_WINDOW_MS', 60000), // 1 minute
      maxRequests: configManager.get('RATE_LIMIT_MAX_REQUESTS', 100),
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      ...config
    };
    this.store = store || new InMemoryRateLimitStore();
  }

  middleware(keyGenerator?: (req: Request) => string) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const timer = performanceMonitor.startTimer('rate_limit_check', 'SECURITY');
      
      try {
        const key = keyGenerator ? keyGenerator(req) : this.getDefaultKey(req);
        const result = await this.store.increment(key, this.config.windowMs);

        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', this.config.maxRequests);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, this.config.maxRequests - result.totalHits));
        res.setHeader('X-RateLimit-Reset', new Date(result.resetTime).toISOString());

        if (result.totalHits > this.config.maxRequests) {
          this.logger.warn('Rate limit exceeded', {
            key,
            totalHits: result.totalHits,
            limit: this.config.maxRequests,
            ip: req.ip,
            userAgent: req.headers['user-agent']
          });

          performanceMonitor.stopTimer(timer, false);
          
          throw new RateLimitError(
            'Rate limit exceeded',
            this.config.maxRequests,
            Math.ceil(this.config.windowMs / 1000)
          );
        }

        this.logger.debug('Rate limit check passed', {
          key,
          totalHits: result.totalHits,
          limit: this.config.maxRequests
        });

        performanceMonitor.stopTimer(timer, true);
        next();
      } catch (error) {
        performanceMonitor.stopTimer(timer, false);
        next(error);
      }
    };
  }

  private getDefaultKey(req: Request): string {
    // Use IP address as default key, but consider user ID if authenticated
    const userId = (req as any).user?.id;
    return userId || req.ip || 'unknown';
  }
}

// ============================================================================
// COMPOSITE SECURITY MIDDLEWARE
// ============================================================================

export class SecurityMiddleware {
  private corsMiddleware: CorsMiddleware;
  private securityHeaders: SecurityHeadersMiddleware;
  private rateLimiter: RateLimitMiddleware;

  constructor(config?: Partial<SecurityConfig>) {
    this.corsMiddleware = new CorsMiddleware(config?.cors);
    this.securityHeaders = new SecurityHeadersMiddleware(config?.headers);
    this.rateLimiter = new RateLimitMiddleware(config?.rateLimit);
  }

  /**
   * Get all security middleware in correct order
   */
  getAllMiddleware() {
    return [
      this.corsMiddleware.middleware(),
      this.securityHeaders.middleware(),
      this.rateLimiter.middleware()
    ];
  }

  /**
   * Get CORS middleware only
   */
  getCors() {
    return this.corsMiddleware.middleware();
  }

  /**
   * Get rate limiting middleware
   */
  getRateLimit() {
    return this.rateLimiter.middleware();
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  SecurityMiddleware,
  CorsMiddleware,
  SecurityHeadersMiddleware, 
  RateLimitMiddleware,
  InMemoryRateLimitStore,
};