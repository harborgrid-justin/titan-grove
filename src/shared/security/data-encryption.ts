/**
 * Data Encryption and Secrets Management System - Enterprise Grade
 * Implements Fix 26: Data encryption and secrets management
 */

import crypto from 'crypto';
import { promisify } from 'util';
import { getLogger } from '../../utils/enterprise-logger';

interface EncryptionConfig {
  algorithm: string;
  keyLength: number;
  ivLength: number;
  tagLength: number;
  saltLength: number;
  iterations: number;
}

interface EncryptedData {
  encrypted: string;
  iv: string;
  tag?: string;
  salt?: string;
  algorithm: string;
  version: string;
}

interface SecretMetadata {
  id: string;
  name: string;
  type: 'api_key' | 'database_password' | 'certificate' | 'jwt_secret' | 'custom';
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  rotationInterval?: number; // in days
  lastRotated?: Date;
  isActive: boolean;
  environment: 'development' | 'staging' | 'production';
}

interface SecretValue {
  value: string;
  metadata: SecretMetadata;
}

export class DataEncryptionService {
  private logger = getLogger('DataEncryptionService');
  private config: EncryptionConfig;
  private masterKey: Buffer;
  private secrets = new Map<string, SecretValue>();
  private encryptionKeys = new Map<string, Buffer>();

  constructor(masterKeyBase64: string, config?: Partial<EncryptionConfig>) {
    this.config = {
      algorithm: 'aes-256-gcm',
      keyLength: 32, // 256 bits
      ivLength: 16,  // 128 bits
      tagLength: 16, // 128 bits
      saltLength: 32, // 256 bits
      iterations: 100000, // PBKDF2 iterations
      ...config
    };

    this.masterKey = Buffer.from(masterKeyBase64, 'base64');
    
    if (this.masterKey.length !== this.config.keyLength) {
      throw new Error(`Master key must be ${this.config.keyLength} bytes (${this.config.keyLength * 8} bits)`);
    }

    this.logger.logBusinessOperation(
      'ENCRYPTION_SERVICE_INITIALIZED',
      'DataEncryptionService',
      '',
      'SUCCESS',
      {
        algorithm: this.config.algorithm,
        keyLength: this.config.keyLength
      }
    );

    // Initialize with environment secrets
    this.loadEnvironmentSecrets();
  }

  // Data encryption/decryption methods
  public async encryptData(plaintext: string, associatedData?: string): Promise<EncryptedData> {
    try {
      const iv = crypto.randomBytes(this.config.ivLength);
      const cipher = crypto.createCipher(this.config.algorithm, this.masterKey);
      
      if (associatedData && cipher.setAAD) {
        cipher.setAAD(Buffer.from(associatedData, 'utf8'));
      }

      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const result: EncryptedData = {
        encrypted,
        iv: iv.toString('hex'),
        algorithm: this.config.algorithm,
        version: '1.0'
      };

      // Add authentication tag for GCM mode
      if (this.config.algorithm.includes('gcm')) {
        result.tag = cipher.getAuthTag().toString('hex');
      }

      this.logger.logSecurityEvent('DATA_ENCRYPTED', 'LOW', {
        algorithm: this.config.algorithm,
        dataLength: plaintext.length,
        hasAssociatedData: !!associatedData
      });

      return result;

    } catch (error) {
      this.logger.logError('Data encryption failed', error, {
        algorithm: this.config.algorithm,
        dataLength: plaintext?.length
      });
      throw error;
    }
  }

  public async decryptData(encryptedData: EncryptedData, associatedData?: string): Promise<string> {
    try {
      const iv = Buffer.from(encryptedData.iv, 'hex');
      const decipher = crypto.createDecipher(encryptedData.algorithm, this.masterKey);
      
      if (associatedData && decipher.setAAD) {
        decipher.setAAD(Buffer.from(associatedData, 'utf8'));
      }

      // Set authentication tag for GCM mode
      if (encryptedData.tag && decipher.setAuthTag) {
        decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
      }

      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      this.logger.logSecurityEvent('DATA_DECRYPTED', 'LOW', {
        algorithm: encryptedData.algorithm,
        version: encryptedData.version
      });

      return decrypted;

    } catch (error) {
      this.logger.logError('Data decryption failed', error, {
        algorithm: encryptedData.algorithm,
        version: encryptedData.version
      });
      throw error;
    }
  }

  // Password-based encryption for user data
  public async encryptWithPassword(plaintext: string, password: string): Promise<EncryptedData> {
    try {
      const salt = crypto.randomBytes(this.config.saltLength);
      const key = await this.deriveKeyFromPassword(password, salt);
      const iv = crypto.randomBytes(this.config.ivLength);

      const cipher = crypto.createCipheriv(this.config.algorithm, key, iv);
      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const result: EncryptedData = {
        encrypted,
        iv: iv.toString('hex'),
        salt: salt.toString('hex'),
        algorithm: this.config.algorithm,
        version: '1.0'
      };

      if (this.config.algorithm.includes('gcm')) {
        result.tag = cipher.getAuthTag().toString('hex');
      }

      return result;

    } catch (error) {
      this.logger.logError('Password-based encryption failed', error);
      throw error;
    }
  }

  public async decryptWithPassword(encryptedData: EncryptedData, password: string): Promise<string> {
    try {
      if (!encryptedData.salt) {
        throw new Error('Salt is required for password-based decryption');
      }

      const salt = Buffer.from(encryptedData.salt, 'hex');
      const key = await this.deriveKeyFromPassword(password, salt);
      const iv = Buffer.from(encryptedData.iv, 'hex');

      const decipher = crypto.createDecipheriv(encryptedData.algorithm, key, iv);

      if (encryptedData.tag) {
        decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
      }

      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;

    } catch (error) {
      this.logger.logError('Password-based decryption failed', error);
      throw error;
    }
  }

  // Secrets management
  public async storeSecret(
    name: string,
    value: string,
    type: SecretMetadata['type'] = 'custom',
    environment: SecretMetadata['environment'] = 'development',
    expiresAt?: Date,
    rotationInterval?: number
  ): Promise<string> {
    try {
      const secretId = this.generateSecretId();
      const encryptedValue = await this.encryptData(value, `secret:${name}:${environment}`);

      const metadata: SecretMetadata = {
        id: secretId,
        name,
        type,
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt,
        rotationInterval,
        isActive: true,
        environment
      };

      // Store encrypted secret value as string
      const secretValue: SecretValue = {
        value: JSON.stringify(encryptedValue),
        metadata
      };

      this.secrets.set(secretId, secretValue);

      this.logger.logAuditEvent(
        'SECRET_STORED',
        secretId,
        'SUCCESS',
        {
          name,
          type,
          environment,
          hasExpiration: !!expiresAt
        }
      );

      // Schedule rotation if applicable
      if (rotationInterval && rotationInterval > 0) {
        this.scheduleSecretRotation(secretId, rotationInterval);
      }

      return secretId;

    } catch (error) {
      this.logger.logError('Secret storage failed', error, { name, type, environment });
      throw error;
    }
  }

  public async getSecret(secretId: string): Promise<string | null> {
    try {
      const secretValue = this.secrets.get(secretId);
      
      if (!secretValue) {
        this.logger.logSecurityEvent('SECRET_NOT_FOUND', 'MEDIUM', { secretId });
        return null;
      }

      if (!secretValue.metadata.isActive) {
        this.logger.logSecurityEvent('INACTIVE_SECRET_ACCESS_ATTEMPT', 'MEDIUM', {
          secretId,
          name: secretValue.metadata.name
        });
        return null;
      }

      // Check expiration
      if (secretValue.metadata.expiresAt && secretValue.metadata.expiresAt < new Date()) {
        this.logger.logSecurityEvent('EXPIRED_SECRET_ACCESS_ATTEMPT', 'MEDIUM', {
          secretId,
          name: secretValue.metadata.name,
          expiresAt: secretValue.metadata.expiresAt
        });
        return null;
      }

      const encryptedData: EncryptedData = JSON.parse(secretValue.value);
      const decryptedValue = await this.decryptData(
        encryptedData,
        `secret:${secretValue.metadata.name}:${secretValue.metadata.environment}`
      );

      this.logger.logAuditEvent(
        'SECRET_ACCESSED',
        secretId,
        'SUCCESS',
        {
          name: secretValue.metadata.name,
          type: secretValue.metadata.type,
          environment: secretValue.metadata.environment
        }
      );

      return decryptedValue;

    } catch (error) {
      this.logger.logError('Secret retrieval failed', error, { secretId });
      return null;
    }
  }

  public async updateSecret(secretId: string, newValue: string): Promise<boolean> {
    try {
      const secretValue = this.secrets.get(secretId);
      
      if (!secretValue) {
        this.logger.logSecurityEvent('UPDATE_NONEXISTENT_SECRET', 'MEDIUM', { secretId });
        return false;
      }

      const encryptedValue = await this.encryptData(
        newValue,
        `secret:${secretValue.metadata.name}:${secretValue.metadata.environment}`
      );

      secretValue.value = JSON.stringify(encryptedValue);
      secretValue.metadata.updatedAt = new Date();
      secretValue.metadata.lastRotated = new Date();

      this.secrets.set(secretId, secretValue);

      this.logger.logAuditEvent(
        'SECRET_UPDATED',
        secretId,
        'SUCCESS',
        {
          name: secretValue.metadata.name,
          type: secretValue.metadata.type
        }
      );

      return true;

    } catch (error) {
      this.logger.logError('Secret update failed', error, { secretId });
      return false;
    }
  }

  public async revokeSecret(secretId: string): Promise<boolean> {
    try {
      const secretValue = this.secrets.get(secretId);
      
      if (!secretValue) {
        return false;
      }

      secretValue.metadata.isActive = false;
      secretValue.metadata.updatedAt = new Date();

      this.secrets.set(secretId, secretValue);

      this.logger.logAuditEvent(
        'SECRET_REVOKED',
        secretId,
        'SUCCESS',
        {
          name: secretValue.metadata.name,
          type: secretValue.metadata.type
        }
      );

      return true;

    } catch (error) {
      this.logger.logError('Secret revocation failed', error, { secretId });
      return false;
    }
  }

  public async rotateSecret(secretId: string, newValue: string): Promise<boolean> {
    try {
      const updated = await this.updateSecret(secretId, newValue);
      
      if (updated) {
        this.logger.logAuditEvent(
          'SECRET_ROTATED',
          secretId,
          'SUCCESS',
          { timestamp: new Date() }
        );
      }

      return updated;

    } catch (error) {
      this.logger.logError('Secret rotation failed', error, { secretId });
      return false;
    }
  }

  // Utility methods
  public generateEncryptionKey(): string {
    const key = crypto.randomBytes(this.config.keyLength);
    return key.toString('base64');
  }

  public hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(this.config.saltLength);
      crypto.pbkdf2(password, salt, this.config.iterations, this.config.keyLength, 'sha256', (err, derivedKey) => {
        if (err) reject(err);
        else {
          const result = salt.toString('hex') + ':' + derivedKey.toString('hex');
          resolve(result);
        }
      });
    });
  }

  public verifyPassword(password: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const [saltHex, hashHex] = hash.split(':');
      const salt = Buffer.from(saltHex, 'hex');
      
      crypto.pbkdf2(password, salt, this.config.iterations, this.config.keyLength, 'sha256', (err, derivedKey) => {
        if (err) reject(err);
        else {
          const isMatch = crypto.timingSafeEqual(derivedKey, Buffer.from(hashHex, 'hex'));
          resolve(isMatch);
        }
      });
    });
  }

  public getSecretMetadata(secretId: string): SecretMetadata | null {
    const secretValue = this.secrets.get(secretId);
    return secretValue ? { ...secretValue.metadata } : null;
  }

  public listSecrets(environment?: SecretMetadata['environment'], type?: SecretMetadata['type']): SecretMetadata[] {
    const results: SecretMetadata[] = [];

    for (const secretValue of this.secrets.values()) {
      if (environment && secretValue.metadata.environment !== environment) continue;
      if (type && secretValue.metadata.type !== type) continue;
      
      results.push({ ...secretValue.metadata });
    }

    return results.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Private methods
  private async deriveKeyFromPassword(password: string, salt: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, this.config.iterations, this.config.keyLength, 'sha256', (err, derivedKey) => {
        if (err) reject(err);
        else resolve(derivedKey);
      });
    });
  }

  private generateSecretId(): string {
    return `secret_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
  }

  private scheduleSecretRotation(secretId: string, intervalDays: number): void {
    const intervalMs = intervalDays * 24 * 60 * 60 * 1000;
    
    setTimeout(() => {
      this.logger.logBusinessOperation(
        'SECRET_ROTATION_DUE',
        'DataEncryptionService',
        secretId,
        'WARNING',
        { intervalDays }
      );
      
      // In a real implementation, this would trigger an automated rotation process
      // or send notifications to administrators
    }, intervalMs);
  }

  private loadEnvironmentSecrets(): void {
    // Load critical environment secrets
    const jwtSecret = process.env.JWT_SECRET;
    const dbPassword = process.env.DB_PASSWORD;
    const apiKeys = process.env.API_KEYS;

    if (jwtSecret) {
      this.storeSecret('jwt_secret', jwtSecret, 'jwt_secret', 'production');
    }
    
    if (dbPassword) {
      this.storeSecret('database_password', dbPassword, 'database_password', 'production');
    }

    if (apiKeys) {
      const keys = JSON.parse(apiKeys);
      for (const [name, key] of Object.entries(keys)) {
        this.storeSecret(`api_key_${name}`, key as string, 'api_key', 'production');
      }
    }
  }
}

// Singleton instance
let encryptionService: DataEncryptionService | null = null;

export function initializeEncryptionService(masterKeyBase64: string, config?: Partial<EncryptionConfig>): DataEncryptionService {
  if (encryptionService) {
    throw new Error('Encryption service already initialized');
  }
  
  encryptionService = new DataEncryptionService(masterKeyBase64, config);
  return encryptionService;
}

export function getEncryptionService(): DataEncryptionService {
  if (!encryptionService) {
    throw new Error('Encryption service not initialized. Call initializeEncryptionService first.');
  }
  return encryptionService;
}

export { EncryptionConfig, EncryptedData, SecretMetadata, SecretValue };