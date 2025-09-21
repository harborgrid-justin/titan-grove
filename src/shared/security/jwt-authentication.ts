/**
 * JWT Authentication and Authorization System - Enterprise Grade
 * Implements Fix 25: JWT authentication and authorization
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { getLogger } from '../../utils/enterprise-logger';
import { v4 as uuidv4 } from 'uuid';

interface UserClaims {
  userId: string;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
  sessionId: string;
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}

interface RefreshTokenData {
  userId: string;
  sessionId: string;
  deviceId?: string;
  userAgent?: string;
  ipAddress?: string;
  createdAt: Date;
  lastUsed: Date;
  expiresAt: Date;
}

interface AuthenticationResult {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: UserClaims;
  expiresIn?: number;
  error?: string;
  sessionId?: string;
}

interface AuthorizationConfig {
  resource: string;
  action: string;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  allowOwner?: boolean;
  ownerField?: string;
}

export class JWTAuthenticationService {
  private logger = getLogger('JWTAuthenticationService');
  private accessTokenSecret: string;
  private refreshTokenSecret: string;
  private accessTokenExpiry: string;
  private refreshTokenExpiry: string;
  private issuer: string;
  private audience: string;
  private activeRefreshTokens = new Map<string, RefreshTokenData>();
  private blacklistedTokens = new Set<string>();

  constructor(config: {
    accessTokenSecret: string;
    refreshTokenSecret: string;
    accessTokenExpiry?: string;
    refreshTokenExpiry?: string;
    issuer?: string;
    audience?: string;
  }) {
    this.accessTokenSecret = config.accessTokenSecret;
    this.refreshTokenSecret = config.refreshTokenSecret;
    this.accessTokenExpiry = config.accessTokenExpiry || '15m';
    this.refreshTokenExpiry = config.refreshTokenExpiry || '7d';
    this.issuer = config.issuer || 'titan-grove';
    this.audience = config.audience || 'titan-grove-api';

    // Clean up expired refresh tokens every hour
    setInterval(() => {
      this.cleanupExpiredTokens();
    }, 60 * 60 * 1000);
  }

  public async authenticateUser(
    username: string,
    password: string,
    deviceId?: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<AuthenticationResult> {
    const sessionId = uuidv4();
    
    try {
      // In a real implementation, this would query the user database
      const user = await this.getUserByUsername(username);
      
      if (!user) {
        this.logger.logSecurityEvent('AUTHENTICATION_FAILED', 'MEDIUM', {
          username,
          reason: 'USER_NOT_FOUND',
          ipAddress,
          userAgent
        });
        
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      
      if (!isPasswordValid) {
        this.logger.logSecurityEvent('AUTHENTICATION_FAILED', 'MEDIUM', {
          userId: user.id,
          username,
          reason: 'INVALID_PASSWORD',
          ipAddress,
          userAgent
        });
        
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }

      // Create tokens
      const accessToken = await this.generateAccessToken({
        userId: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        permissions: user.permissions,
        sessionId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + this.getExpirySeconds(this.accessTokenExpiry),
        iss: this.issuer,
        aud: this.audience
      });

      const refreshToken = await this.generateRefreshToken(user.id, sessionId);

      // Store refresh token data
      const refreshTokenData: RefreshTokenData = {
        userId: user.id,
        sessionId,
        deviceId,
        userAgent,
        ipAddress,
        createdAt: new Date(),
        lastUsed: new Date(),
        expiresAt: new Date(Date.now() + this.getExpiryMilliseconds(this.refreshTokenExpiry))
      };

      this.activeRefreshTokens.set(refreshToken, refreshTokenData);

      this.logger.logAuditEvent(
        'USER_AUTHENTICATION_SUCCESS',
        user.id,
        'SUCCESS',
        {
          username: user.username,
          sessionId,
          deviceId,
          ipAddress,
          userAgent
        }
      );

      return {
        success: true,
        accessToken,
        refreshToken,
        user: {
          userId: user.id,
          username: user.username,
          email: user.email,
          roles: user.roles,
          permissions: user.permissions,
          sessionId,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + this.getExpirySeconds(this.accessTokenExpiry),
          iss: this.issuer,
          aud: this.audience
        },
        expiresIn: this.getExpirySeconds(this.accessTokenExpiry),
        sessionId
      };

    } catch (error) {
      this.logger.logError('Authentication error', error, {
        username,
        sessionId,
        ipAddress
      });

      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  }

  public async refreshAccessToken(refreshToken: string): Promise<AuthenticationResult> {
    try {
      if (this.blacklistedTokens.has(refreshToken)) {
        this.logger.logSecurityEvent('REFRESH_TOKEN_BLACKLISTED', 'HIGH', {
          refreshToken: refreshToken.substring(0, 20) + '...'
        });
        
        return {
          success: false,
          error: 'Invalid refresh token'
        };
      }

      const tokenData = this.activeRefreshTokens.get(refreshToken);
      if (!tokenData) {
        this.logger.logSecurityEvent('REFRESH_TOKEN_NOT_FOUND', 'MEDIUM', {
          refreshToken: refreshToken.substring(0, 20) + '...'
        });
        
        return {
          success: false,
          error: 'Invalid refresh token'
        };
      }

      if (tokenData.expiresAt < new Date()) {
        this.activeRefreshTokens.delete(refreshToken);
        this.logger.logSecurityEvent('REFRESH_TOKEN_EXPIRED', 'LOW', {
          userId: tokenData.userId,
          sessionId: tokenData.sessionId
        });
        
        return {
          success: false,
          error: 'Refresh token expired'
        };
      }

      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, this.refreshTokenSecret) as any;
      
      if (decoded.userId !== tokenData.userId || decoded.sessionId !== tokenData.sessionId) {
        this.logger.logSecurityEvent('REFRESH_TOKEN_MISMATCH', 'HIGH', {
          userId: tokenData.userId,
          sessionId: tokenData.sessionId
        });
        
        return {
          success: false,
          error: 'Invalid refresh token'
        };
      }

      // Get updated user data
      const user = await this.getUserById(tokenData.userId);
      if (!user) {
        this.logger.logSecurityEvent('REFRESH_TOKEN_USER_NOT_FOUND', 'MEDIUM', {
          userId: tokenData.userId,
          sessionId: tokenData.sessionId
        });
        
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Generate new access token
      const accessToken = await this.generateAccessToken({
        userId: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        permissions: user.permissions,
        sessionId: tokenData.sessionId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + this.getExpirySeconds(this.accessTokenExpiry),
        iss: this.issuer,
        aud: this.audience
      });

      // Update last used time
      tokenData.lastUsed = new Date();
      this.activeRefreshTokens.set(refreshToken, tokenData);

      this.logger.logAuditEvent(
        'ACCESS_TOKEN_REFRESHED',
        user.id,
        'SUCCESS',
        {
          sessionId: tokenData.sessionId,
          deviceId: tokenData.deviceId
        }
      );

      return {
        success: true,
        accessToken,
        user: {
          userId: user.id,
          username: user.username,
          email: user.email,
          roles: user.roles,
          permissions: user.permissions,
          sessionId: tokenData.sessionId,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + this.getExpirySeconds(this.accessTokenExpiry),
          iss: this.issuer,
          aud: this.audience
        },
        expiresIn: this.getExpirySeconds(this.accessTokenExpiry)
      };

    } catch (error) {
      this.logger.logError('Token refresh error', error, {
        refreshToken: refreshToken.substring(0, 20) + '...'
      });

      return {
        success: false,
        error: 'Token refresh failed'
      };
    }
  }

  public async revokeRefreshToken(refreshToken: string): Promise<boolean> {
    try {
      const tokenData = this.activeRefreshTokens.get(refreshToken);
      
      if (tokenData) {
        this.activeRefreshTokens.delete(refreshToken);
        this.blacklistedTokens.add(refreshToken);

        this.logger.logAuditEvent(
          'REFRESH_TOKEN_REVOKED',
          tokenData.userId,
          'SUCCESS',
          {
            sessionId: tokenData.sessionId,
            deviceId: tokenData.deviceId
          }
        );
      }

      return true;
    } catch (error) {
      this.logger.logError('Token revocation error', error);
      return false;
    }
  }

  public async revokeAllUserTokens(userId: string): Promise<boolean> {
    try {
      let revokedCount = 0;

      for (const [token, data] of this.activeRefreshTokens.entries()) {
        if (data.userId === userId) {
          this.activeRefreshTokens.delete(token);
          this.blacklistedTokens.add(token);
          revokedCount++;
        }
      }

      this.logger.logAuditEvent(
        'ALL_USER_TOKENS_REVOKED',
        userId,
        'SUCCESS',
        { revokedCount }
      );

      return true;
    } catch (error) {
      this.logger.logError('Bulk token revocation error', error, { userId });
      return false;
    }
  }

  public verifyAccessToken(token: string): UserClaims | null {
    try {
      if (this.blacklistedTokens.has(token)) {
        return null;
      }

      const decoded = jwt.verify(token, this.accessTokenSecret) as UserClaims;
      
      // Validate token structure
      if (!decoded.userId || !decoded.sessionId || !decoded.roles || !decoded.permissions) {
        return null;
      }

      return decoded;
    } catch (error) {
      this.logger.logSecurityEvent('ACCESS_TOKEN_VERIFICATION_FAILED', 'LOW', {
        token: token.substring(0, 20) + '...',
        error: error.message
      });
      return null;
    }
  }

  public checkAuthorization(user: UserClaims, config: AuthorizationConfig, resourceOwnerId?: string): boolean {
    try {
      // Check if user has required roles
      if (config.requiredRoles && config.requiredRoles.length > 0) {
        const hasRole = config.requiredRoles.some(role => user.roles.includes(role));
        if (!hasRole) {
          this.logger.logSecurityEvent('AUTHORIZATION_FAILED', 'MEDIUM', {
            userId: user.userId,
            resource: config.resource,
            action: config.action,
            reason: 'MISSING_ROLE',
            requiredRoles: config.requiredRoles,
            userRoles: user.roles
          });
          return false;
        }
      }

      // Check if user has required permissions
      if (config.requiredPermissions && config.requiredPermissions.length > 0) {
        const hasPermission = config.requiredPermissions.some(permission => 
          user.permissions.includes(permission)
        );
        if (!hasPermission) {
          this.logger.logSecurityEvent('AUTHORIZATION_FAILED', 'MEDIUM', {
            userId: user.userId,
            resource: config.resource,
            action: config.action,
            reason: 'MISSING_PERMISSION',
            requiredPermissions: config.requiredPermissions,
            userPermissions: user.permissions
          });
          return false;
        }
      }

      // Check if user is the owner of the resource
      if (config.allowOwner && resourceOwnerId) {
        if (user.userId === resourceOwnerId) {
          return true;
        }
      }

      return true;
    } catch (error) {
      this.logger.logError('Authorization check error', error, {
        userId: user.userId,
        resource: config.resource,
        action: config.action
      });
      return false;
    }
  }

  // Express middleware functions
  public authenticateMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({
            success: false,
            error: 'Missing or invalid authorization header'
          });
        }

        const token = authHeader.substring(7);
        const user = this.verifyAccessToken(token);

        if (!user) {
          return res.status(401).json({
            success: false,
            error: 'Invalid or expired token'
          });
        }

        // Add user to request object
        (req as any).user = user;
        next();
      } catch (error) {
        this.logger.logError('Authentication middleware error', error);
        return res.status(500).json({
          success: false,
          error: 'Authentication error'
        });
      }
    };
  }

  public authorizeMiddleware(config: AuthorizationConfig) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = (req as any).user as UserClaims;
        
        if (!user) {
          return res.status(401).json({
            success: false,
            error: 'User not authenticated'
          });
        }

        let resourceOwnerId: string | undefined;
        if (config.allowOwner && config.ownerField) {
          resourceOwnerId = req.params[config.ownerField] || req.body[config.ownerField];
        }

        const isAuthorized = this.checkAuthorization(user, config, resourceOwnerId);

        if (!isAuthorized) {
          return res.status(403).json({
            success: false,
            error: 'Insufficient permissions'
          });
        }

        next();
      } catch (error) {
        this.logger.logError('Authorization middleware error', error);
        return res.status(500).json({
          success: false,
          error: 'Authorization error'
        });
      }
    };
  }

  // Private helper methods
  private async generateAccessToken(claims: UserClaims): Promise<string> {
    return jwt.sign(claims, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
      issuer: this.issuer,
      audience: this.audience
    });
  }

  private async generateRefreshToken(userId: string, sessionId: string): Promise<string> {
    return jwt.sign(
      { userId, sessionId },
      this.refreshTokenSecret,
      {
        expiresIn: this.refreshTokenExpiry,
        issuer: this.issuer,
        audience: this.audience
      }
    );
  }

  private getExpirySeconds(expiry: string): number {
    const unit = expiry.slice(-1);
    const value = parseInt(expiry.slice(0, -1));
    
    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 60 * 60;
      case 'd': return value * 24 * 60 * 60;
      default: return 900; // 15 minutes default
    }
  }

  private getExpiryMilliseconds(expiry: string): number {
    return this.getExpirySeconds(expiry) * 1000;
  }

  private async getUserByUsername(username: string): Promise<any> {
    // This would typically query your user database
    // For now, return a mock user for demonstration
    return {
      id: 'user_123',
      username,
      email: `${username}@example.com`,
      passwordHash: await bcrypt.hash('password', 10),
      roles: ['user'],
      permissions: ['read:own_profile', 'write:own_profile']
    };
  }

  private async getUserById(userId: string): Promise<any> {
    // This would typically query your user database
    // For now, return a mock user for demonstration
    return {
      id: userId,
      username: 'testuser',
      email: 'testuser@example.com',
      roles: ['user'],
      permissions: ['read:own_profile', 'write:own_profile']
    };
  }

  private cleanupExpiredTokens(): void {
    const now = new Date();
    let cleanedCount = 0;

    for (const [token, data] of this.activeRefreshTokens.entries()) {
      if (data.expiresAt < now) {
        this.activeRefreshTokens.delete(token);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.logger.logBusinessOperation(
        'CLEANUP_EXPIRED_TOKENS',
        'JWTAuthenticationService',
        '',
        'SUCCESS',
        { cleanedCount, remaining: this.activeRefreshTokens.size }
      );
    }
  }
}

// Singleton instance
let jwtService: JWTAuthenticationService | null = null;

export function initializeJWTService(config: {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiry?: string;
  refreshTokenExpiry?: string;
  issuer?: string;
  audience?: string;
}): JWTAuthenticationService {
  if (jwtService) {
    throw new Error('JWT service already initialized');
  }
  
  jwtService = new JWTAuthenticationService(config);
  return jwtService;
}

export function getJWTService(): JWTAuthenticationService {
  if (!jwtService) {
    throw new Error('JWT service not initialized. Call initializeJWTService first.');
  }
  return jwtService;
}

export { UserClaims, RefreshTokenData, AuthenticationResult, AuthorizationConfig };