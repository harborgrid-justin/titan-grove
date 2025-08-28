import { Logger } from 'winston';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { SecurityContext } from '../types';

export class SecurityManager {
  private config: any;
  private logger: Logger;

  constructor(config: any, logger: Logger) {
    this.config = config || {};
    this.logger = logger;
  }

  async initialize(): Promise<void> {
    this.logger.info('Security manager initialized');
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateToken(payload: any, expiresIn?: string): string {
    if (!this.config.jwt?.secret) {
      throw new Error('JWT secret not configured');
    }

    return jwt.sign(payload, this.config.jwt.secret, {
      expiresIn: expiresIn || this.config.jwt.expiresIn || '1h',
    });
  }

  verifyToken(token: string): any {
    if (!this.config.jwt?.secret) {
      throw new Error('JWT secret not configured');
    }

    return jwt.verify(token, this.config.jwt.secret);
  }

  createSecurityContext(user?: any, session?: any): SecurityContext {
    return {
      user,
      session,
    };
  }

  hasPermission(context: SecurityContext, permission: string): boolean {
    return context.user?.permissions?.includes(permission) || false;
  }

  hasRole(context: SecurityContext, role: string): boolean {
    return context.user?.roles?.includes(role) || false;
  }
}
