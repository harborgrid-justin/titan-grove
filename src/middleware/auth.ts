/**
 * Authentication Middleware
 * Standardized authentication for both business and customer systems
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Logger } from 'winston';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    roles: string[];
    permissions: string[];
    system: 'business' | 'customer';
    tenantId?: string;
  };
}

export interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  enableBusinessAuth: boolean;
  enableCustomerAuth: boolean;
  publicPaths: string[];
}

export class AuthenticationService {
  private config: AuthConfig;
  private logger: Logger;

  constructor(config: AuthConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
  }

  /**
   * Generate JWT token for business user
   */
  generateBusinessToken(user: {
    id: string;
    email: string;
    roles: string[];
    permissions: string[];
    tenantId?: string;
  }): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        roles: user.roles,
        permissions: user.permissions,
        system: 'business',
        tenantId: user.tenantId
      },
      this.config.jwtSecret,
      { expiresIn: this.config.jwtExpiresIn }
    );
  }

  /**
   * Generate JWT token for customer user
   */
  generateCustomerToken(user: {
    id: string;
    email: string;
    permissions?: string[];
  }): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        roles: ['customer'],
        permissions: user.permissions || ['customer:basic'],
        system: 'customer'
      },
      this.config.jwtSecret,
      { expiresIn: this.config.jwtExpiresIn }
    );
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.config.jwtSecret);
    } catch (error) {
      this.logger.warn('Token verification failed', {
        error: error instanceof Error ? error.message : String(error)
      });
      return null;
    }
  }

  /**
   * Check if path is public (doesn't require authentication)
   */
  isPublicPath(path: string): boolean {
    return this.config.publicPaths.some(publicPath => {
      // Support wildcard patterns
      if (publicPath.endsWith('*')) {
        return path.startsWith(publicPath.slice(0, -1));
      }
      return path === publicPath;
    });
  }
}

// Default authentication configuration
const defaultAuthConfig: AuthConfig = {
  jwtSecret: process.env.JWT_SECRET || 'titan-grove-default-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  enableBusinessAuth: true,
  enableCustomerAuth: true,
  publicPaths: [
    '/health',
    '/api/public/*',
    '/api/auth/login',
    '/api/auth/register',
    '/api/customer/register',
    '/api/customer/login'
  ]
};

// Create authentication service instance
const authService = new AuthenticationService(
  defaultAuthConfig,
  console as any // Will be replaced with proper logger
);

/**
 * Authentication middleware factory
 */
export function authenticate(options: {
  required?: boolean;
  systems?: ('business' | 'customer')[];
  permissions?: string[];
} = {}) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const {
      required = true,
      systems = ['business', 'customer'],
      permissions = []
    } = options;

    // Skip authentication for public paths
    if (authService.isPublicPath(req.path)) {
      return next();
    }

    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      if (!required) {
        return next();
      }
      return res.status(401).json({
        success: false,
        error: {
          code: 'MISSING_TOKEN',
          message: 'Authorization token is required'
        }
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = authService.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired token'
        }
      });
    }

    // Check if user's system is allowed
    if (!systems.includes(decoded.system)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'SYSTEM_NOT_ALLOWED',
          message: `Access denied for ${decoded.system} system`
        }
      });
    }

    // Check permissions if specified
    if (permissions.length > 0) {
      const userPermissions = decoded.permissions || [];
      const hasRequiredPermission = permissions.some(permission =>
        userPermissions.includes(permission) ||
        userPermissions.includes('admin') ||
        (decoded.system === 'business' && userPermissions.includes('business:admin'))
      );

      if (!hasRequiredPermission) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'INSUFFICIENT_PERMISSIONS',
            message: 'Insufficient permissions for this operation'
          }
        });
      }
    }

    // Attach user information to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      roles: decoded.roles || [],
      permissions: decoded.permissions || [],
      system: decoded.system,
      tenantId: decoded.tenantId
    };

    next();
  };
}

/**
 * Business system authentication middleware
 */
export const authenticateBusiness = authenticate({
  required: true,
  systems: ['business']
});

/**
 * Customer system authentication middleware
 */
export const authenticateCustomer = authenticate({
  required: true,
  systems: ['customer']
});

/**
 * Optional authentication middleware (allows both authenticated and anonymous access)
 */
export const authenticateOptional = authenticate({
  required: false,
  systems: ['business', 'customer']
});

/**
 * Admin authentication middleware
 */
export const authenticateAdmin = authenticate({
  required: true,
  systems: ['business'],
  permissions: ['admin', 'business:admin']
});

export { AuthenticationService, authService };