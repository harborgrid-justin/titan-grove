/**
 * Session Management and Security System - Enterprise Grade
 * Implements Fix 28: Session management and security
 */

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getLogger } from '../../utils/enterprise-logger';
import { getJWTService } from './jwt-authentication';
import { getAuditService } from './audit-trail';

interface SessionData {
  sessionId: string;
  userId: string;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
  createdAt: Date;
  lastAccessedAt: Date;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
  deviceFingerprint?: string;
  isActive: boolean;
  maxIdleTimeMs: number;
  maxSessionTimeMs: number;
  loginAttempts: number;
  lastLoginAttempt?: Date;
  isLocked: boolean;
  lockExpiresAt?: Date;
  refreshToken?: string;
  csrfToken?: string;
  metadata: Record<string, any>;
}

interface SessionConfig {
  maxIdleTimeMs: number;         // 30 minutes default
  maxSessionTimeMs: number;      // 8 hours default  
  maxLoginAttempts: number;      // 5 attempts
  lockoutDurationMs: number;     // 15 minutes
  enableCSRFProtection: boolean;
  enableDeviceFingerprinting: boolean;
  enableConcurrentSessionLimit: boolean;
  maxConcurrentSessions: number; // 3 sessions per user
  secureCookies: boolean;
  sameSiteCookies: 'strict' | 'lax' | 'none';
  httpOnlyCookies: boolean;
  sessionCookieName: string;
  csrfCookieName: string;
}

interface LoginAttempt {
  userId: string;
  username: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  success: boolean;
  reason?: string;
  sessionId?: string;
}

export class SessionManager {
  private logger = getLogger('SessionManager');
  private activeSessions = new Map<string, SessionData>();
  private userSessions = new Map<string, Set<string>>(); // userId -> sessionIds
  private ipAttempts = new Map<string, LoginAttempt[]>();
  private config: SessionConfig;
  private cleanupInterval: NodeJS.Timeout;

  constructor(config: Partial<SessionConfig> = {}) {
    this.config = {
      maxIdleTimeMs: 30 * 60 * 1000,       // 30 minutes
      maxSessionTimeMs: 8 * 60 * 60 * 1000, // 8 hours
      maxLoginAttempts: 5,
      lockoutDurationMs: 15 * 60 * 1000,   // 15 minutes
      enableCSRFProtection: true,
      enableDeviceFingerprinting: true,
      enableConcurrentSessionLimit: true,
      maxConcurrentSessions: 3,
      secureCookies: true,
      sameSiteCookies: 'strict',
      httpOnlyCookies: true,
      sessionCookieName: 'titan-session',
      csrfCookieName: 'titan-csrf',
      ...config
    };

    // Clean up expired sessions every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredSessions();
    }, 5 * 60 * 1000);

    this.logger.logBusinessOperation(
      'SESSION_MANAGER_INITIALIZED',
      'SessionManager',
      '',
      'SUCCESS',
      {
        maxIdleTimeMs: this.config.maxIdleTimeMs,
        maxSessionTimeMs: this.config.maxSessionTimeMs,
        enableCSRFProtection: this.config.enableCSRFProtection
      }
    );
  }

  public async createSession(
    userId: string,
    username: string,
    email: string,
    roles: string[],
    permissions: string[],
    ipAddress: string,
    userAgent: string,
    deviceFingerprint?: string
  ): Promise<SessionData> {
    try {
      // Check for concurrent session limits
      if (this.config.enableConcurrentSessionLimit) {
        await this.enforceSessionLimits(userId);
      }

      const sessionId = uuidv4();
      const now = new Date();
      
      const sessionData: SessionData = {
        sessionId,
        userId,
        username,
        email,
        roles,
        permissions,
        createdAt: now,
        lastAccessedAt: now,
        expiresAt: new Date(now.getTime() + this.config.maxSessionTimeMs),
        ipAddress,
        userAgent,
        deviceFingerprint,
        isActive: true,
        maxIdleTimeMs: this.config.maxIdleTimeMs,
        maxSessionTimeMs: this.config.maxSessionTimeMs,
        loginAttempts: 0,
        isLocked: false,
        csrfToken: this.config.enableCSRFProtection ? this.generateCSRFToken() : undefined,
        metadata: {}
      };

      // Store session
      this.activeSessions.set(sessionId, sessionData);
      
      // Track user sessions
      if (!this.userSessions.has(userId)) {
        this.userSessions.set(userId, new Set());
      }
      this.userSessions.get(userId)!.add(sessionId);

      // Log session creation
      const auditService = getAuditService();
      await auditService.logAuditEvent(
        'SESSION_CREATED',
        'session',
        sessionId,
        'CREATE',
        'SUCCESS',
        {
          userId,
          ipAddress,
          userAgent,
          deviceFingerprint,
          metadata: {
            sessionDurationMs: this.config.maxSessionTimeMs,
            concurrentSessions: this.userSessions.get(userId)?.size || 0
          }
        }
      );

      return sessionData;

    } catch (error) {
      this.logger.logError('Failed to create session', error, {
        userId,
        username,
        ipAddress
      });
      throw error;
    }
  }

  public async getSession(sessionId: string): Promise<SessionData | null> {
    try {
      const session = this.activeSessions.get(sessionId);
      
      if (!session) {
        return null;
      }

      // Check if session is expired or inactive
      if (!this.isSessionValid(session)) {
        await this.destroySession(sessionId, 'EXPIRED');
        return null;
      }

      // Update last accessed time
      session.lastAccessedAt = new Date();
      this.activeSessions.set(sessionId, session);

      return session;

    } catch (error) {
      this.logger.logError('Failed to get session', error, { sessionId });
      return null;
    }
  }

  public async updateSession(sessionId: string, updates: Partial<SessionData>): Promise<boolean> {
    try {
      const session = this.activeSessions.get(sessionId);
      
      if (!session || !this.isSessionValid(session)) {
        return false;
      }

      // Apply updates
      Object.assign(session, updates);
      session.lastAccessedAt = new Date();
      
      this.activeSessions.set(sessionId, session);

      const auditService = getAuditService();
      await auditService.logAuditEvent(
        'SESSION_UPDATED',
        'session',
        sessionId,
        'UPDATE',
        'SUCCESS',
        {
          userId: session.userId,
          updates: Object.keys(updates)
        }
      );

      return true;

    } catch (error) {
      this.logger.logError('Failed to update session', error, { sessionId, updates });
      return false;
    }
  }

  public async destroySession(sessionId: string, reason: string = 'LOGOUT'): Promise<boolean> {
    try {
      const session = this.activeSessions.get(sessionId);
      
      if (!session) {
        return false;
      }

      // Remove from active sessions
      this.activeSessions.delete(sessionId);

      // Remove from user sessions
      const userSessionIds = this.userSessions.get(session.userId);
      if (userSessionIds) {
        userSessionIds.delete(sessionId);
        if (userSessionIds.size === 0) {
          this.userSessions.delete(session.userId);
        }
      }

      // Revoke refresh token if present
      if (session.refreshToken) {
        const jwtService = getJWTService();
        await jwtService.revokeRefreshToken(session.refreshToken);
      }

      const auditService = getAuditService();
      await auditService.logAuditEvent(
        'SESSION_DESTROYED',
        'session',
        sessionId,
        'DELETE',
        'SUCCESS',
        {
          userId: session.userId,
          reason,
          sessionDuration: Date.now() - session.createdAt.getTime(),
          ipAddress: session.ipAddress
        }
      );

      return true;

    } catch (error) {
      this.logger.logError('Failed to destroy session', error, { sessionId, reason });
      return false;
    }
  }

  public async destroyAllUserSessions(userId: string, except?: string): Promise<number> {
    try {
      const userSessionIds = this.userSessions.get(userId);
      
      if (!userSessionIds) {
        return 0;
      }

      let destroyedCount = 0;
      const sessionIds = Array.from(userSessionIds);

      for (const sessionId of sessionIds) {
        if (except && sessionId === except) {
          continue;
        }
        
        const destroyed = await this.destroySession(sessionId, 'ADMIN_LOGOUT');
        if (destroyed) {
          destroyedCount++;
        }
      }

      const auditService = getAuditService();
      await auditService.logAuditEvent(
        'ALL_USER_SESSIONS_DESTROYED',
        'session',
        userId,
        'DELETE',
        'SUCCESS',
        {
          userId,
          destroyedCount,
          exceptSessionId: except
        }
      );

      return destroyedCount;

    } catch (error) {
      this.logger.logError('Failed to destroy all user sessions', error, { userId, except });
      return 0;
    }
  }

  public async recordLoginAttempt(
    username: string,
    ipAddress: string,
    userAgent: string,
    success: boolean,
    userId?: string,
    reason?: string,
    sessionId?: string
  ): Promise<void> {
    try {
      const attempt: LoginAttempt = {
        userId: userId || '',
        username,
        ipAddress,
        userAgent,
        timestamp: new Date(),
        success,
        reason,
        sessionId
      };

      // Track IP-based attempts for rate limiting
      if (!this.ipAttempts.has(ipAddress)) {
        this.ipAttempts.set(ipAddress, []);
      }
      
      const ipAttemptList = this.ipAttempts.get(ipAddress)!;
      ipAttemptList.push(attempt);

      // Keep only recent attempts (last hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      this.ipAttempts.set(
        ipAddress,
        ipAttemptList.filter(a => a.timestamp > oneHourAgo)
      );

      // Update session login attempts if session exists
      if (sessionId) {
        const session = this.activeSessions.get(sessionId);
        if (session) {
          session.loginAttempts = success ? 0 : session.loginAttempts + 1;
          session.lastLoginAttempt = new Date();
          
          // Lock session if too many failed attempts
          if (session.loginAttempts >= this.config.maxLoginAttempts) {
            session.isLocked = true;
            session.lockExpiresAt = new Date(Date.now() + this.config.lockoutDurationMs);
          }
          
          this.activeSessions.set(sessionId, session);
        }
      }

      const auditService = getAuditService();
      await auditService.logSecurityEvent(
        'LOGIN_ATTEMPT',
        userId || username,
        success ? 'SUCCESS' : 'FAILURE',
        {
          username,
          ipAddress,
          userAgent,
          reason,
          sessionId
        }
      );

    } catch (error) {
      this.logger.logError('Failed to record login attempt', error, {
        username,
        ipAddress,
        success
      });
    }
  }

  public isIPRateLimited(ipAddress: string): boolean {
    const attempts = this.ipAttempts.get(ipAddress) || [];
    const recentFailures = attempts.filter(a => !a.success && a.timestamp > new Date(Date.now() - 60 * 60 * 1000));
    return recentFailures.length >= this.config.maxLoginAttempts;
  }

  public validateCSRFToken(sessionId: string, providedToken: string): boolean {
    if (!this.config.enableCSRFProtection) {
      return true;
    }

    const session = this.activeSessions.get(sessionId);
    return session?.csrfToken === providedToken;
  }

  public generateCSRFToken(): string {
    return uuidv4();
  }

  public getSessionStats() {
    const activeSessions = this.activeSessions.size;
    const activeUsers = this.userSessions.size;
    
    // Calculate average session duration
    let totalDuration = 0;
    let count = 0;
    
    for (const session of this.activeSessions.values()) {
      totalDuration += Date.now() - session.createdAt.getTime();
      count++;
    }
    
    const averageDurationMs = count > 0 ? totalDuration / count : 0;

    return {
      activeSessions,
      activeUsers,
      averageDurationMs,
      lockedSessions: Array.from(this.activeSessions.values()).filter(s => s.isLocked).length
    };
  }

  // Express middleware functions
  public sessionMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const sessionId = req.cookies[this.config.sessionCookieName];
        
        if (!sessionId) {
          (req as any).session = null;
          return next();
        }

        const session = await this.getSession(sessionId);
        
        if (!session) {
          // Clear invalid session cookie
          res.clearCookie(this.config.sessionCookieName);
          (req as any).session = null;
          return next();
        }

        // Validate CSRF token for state-changing operations
        if (this.config.enableCSRFProtection && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
          const csrfToken = req.headers['x-csrf-token'] as string;
          
          if (!this.validateCSRFToken(sessionId, csrfToken)) {
            return res.status(403).json({
              success: false,
              error: 'Invalid CSRF token'
            });
          }
        }

        // Attach session to request
        (req as any).session = session;
        
        // Set security headers
        this.setSecurityHeaders(res, session);
        
        next();

      } catch (error) {
        this.logger.logError('Session middleware error', error);
        (req as any).session = null;
        next();
      }
    };
  }

  public requireSession() {
    return (req: Request, res: Response, next: NextFunction) => {
      const session = (req as any).session as SessionData;
      
      if (!session || !session.isActive) {
        return res.status(401).json({
          success: false,
          error: 'Session required'
        });
      }
      
      if (session.isLocked) {
        return res.status(423).json({
          success: false,
          error: 'Session is locked due to security reasons'
        });
      }
      
      next();
    };
  }

  public requireRole(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const session = (req as any).session as SessionData;
      
      if (!session) {
        return res.status(401).json({
          success: false,
          error: 'Session required'
        });
      }
      
      const hasRole = roles.some(role => session.roles.includes(role));
      
      if (!hasRole) {
        return res.status(403).json({
          success: false,
          error: 'Insufficient role permissions'
        });
      }
      
      next();
    };
  }

  // Private methods
  private isSessionValid(session: SessionData): boolean {
    const now = new Date();
    
    // Check if session is active
    if (!session.isActive) {
      return false;
    }
    
    // Check absolute expiration
    if (session.expiresAt < now) {
      return false;
    }
    
    // Check idle timeout
    const idleTime = now.getTime() - session.lastAccessedAt.getTime();
    if (idleTime > session.maxIdleTimeMs) {
      return false;
    }
    
    // Check if session is locked and lock hasn't expired
    if (session.isLocked) {
      if (!session.lockExpiresAt || session.lockExpiresAt > now) {
        return false;
      } else {
        // Unlock expired lock
        session.isLocked = false;
        session.lockExpiresAt = undefined;
        session.loginAttempts = 0;
      }
    }
    
    return true;
  }

  private async enforceSessionLimits(userId: string): Promise<void> {
    const userSessionIds = this.userSessions.get(userId);
    
    if (!userSessionIds || userSessionIds.size < this.config.maxConcurrentSessions) {
      return;
    }

    // Find oldest session to terminate
    let oldestSession: SessionData | null = null;
    let oldestSessionId = '';

    for (const sessionId of userSessionIds) {
      const session = this.activeSessions.get(sessionId);
      if (session && (!oldestSession || session.createdAt < oldestSession.createdAt)) {
        oldestSession = session;
        oldestSessionId = sessionId;
      }
    }

    if (oldestSessionId) {
      await this.destroySession(oldestSessionId, 'CONCURRENT_SESSION_LIMIT');
    }
  }

  private setSecurityHeaders(res: Response, session: SessionData): void {
    // Set session cookie with security options
    res.cookie(this.config.sessionCookieName, session.sessionId, {
      maxAge: session.maxSessionTimeMs,
      httpOnly: this.config.httpOnlyCookies,
      secure: this.config.secureCookies,
      sameSite: this.config.sameSiteCookies
    });

    // Set CSRF token cookie if enabled
    if (this.config.enableCSRFProtection && session.csrfToken) {
      res.cookie(this.config.csrfCookieName, session.csrfToken, {
        maxAge: session.maxSessionTimeMs,
        httpOnly: false, // CSRF token needs to be accessible to JavaScript
        secure: this.config.secureCookies,
        sameSite: this.config.sameSiteCookies
      });
    }

    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  private cleanupExpiredSessions(): void {
    let cleanedCount = 0;
    const now = new Date();

    for (const [sessionId, session] of this.activeSessions.entries()) {
      if (!this.isSessionValid(session)) {
        this.destroySession(sessionId, 'EXPIRED');
        cleanedCount++;
      }
    }

    // Clean up old login attempts
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    for (const [ipAddress, attempts] of this.ipAttempts.entries()) {
      const recentAttempts = attempts.filter(a => a.timestamp > oneHourAgo);
      if (recentAttempts.length === 0) {
        this.ipAttempts.delete(ipAddress);
      } else {
        this.ipAttempts.set(ipAddress, recentAttempts);
      }
    }

    if (cleanedCount > 0) {
      this.logger.logBusinessOperation(
        'SESSION_CLEANUP_COMPLETED',
        'SessionManager',
        '',
        'SUCCESS',
        { cleanedCount, remainingSessions: this.activeSessions.size }
      );
    }
  }

  public async shutdown(): Promise<void> {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    // Destroy all active sessions
    const sessionIds = Array.from(this.activeSessions.keys());
    for (const sessionId of sessionIds) {
      await this.destroySession(sessionId, 'SHUTDOWN');
    }

    this.logger.logBusinessOperation(
      'SESSION_MANAGER_SHUTDOWN',
      'SessionManager',
      '',
      'SUCCESS',
      { destroyedSessions: sessionIds.length }
    );
  }
}

// Singleton instance
let sessionManager: SessionManager | null = null;

export function initializeSessionManager(config?: Partial<SessionConfig>): SessionManager {
  if (sessionManager) {
    throw new Error('Session manager already initialized');
  }
  
  sessionManager = new SessionManager(config);
  return sessionManager;
}

export function getSessionManager(): SessionManager {
  if (!sessionManager) {
    throw new Error('Session manager not initialized. Call initializeSessionManager first.');
  }
  return sessionManager;
}

export { SessionData, SessionConfig, LoginAttempt };