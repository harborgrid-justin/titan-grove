/**
 * Enterprise Configuration Management System
 * Centralized configuration with environment support and validation
 */

import { v4 as uuidv4 } from 'uuid';
import { getLogger } from '../utils/enterprise-logger';
import { ValidationResult, ValidationError } from '../types/enterprise-types';
import { SYSTEM_CONSTANTS, PERFORMANCE_CONSTANTS } from '../constants/business-constants';

// ============================================================================
// CONFIGURATION INTERFACES
// ============================================================================

export interface ConfigurationValue {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  environment: 'development' | 'staging' | 'production' | 'test' | 'all';
  category: 'database' | 'cache' | 'api' | 'security' | 'business' | 'system';
  description: string;
  isSecret: boolean;
  isRequired: boolean;
  defaultValue?: any;
  validation?: ConfigValidationRule;
  lastUpdated: Date;
  updatedBy: string;
}

export interface ConfigValidationRule {
  min?: number;
  max?: number;
  pattern?: string;
  allowedValues?: any[];
  customValidator?: (value: any) => ValidationError | null;
}

export interface ConfigurationSchema {
  name: string;
  version: string;
  environment: string;
  values: Map<string, ConfigurationValue>;
  metadata: {
    loadedAt: Date;
    source: 'file' | 'environment' | 'database' | 'remote';
    checksum: string;
  };
}

// ============================================================================
// CACHE INTERFACES
// ============================================================================

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  maxSize?: number; // Maximum number of entries
  compression?: boolean;
  encryption?: boolean;
  tags?: string[];
  namespace?: string;
}

export interface CacheEntry<T = any> {
  key: string;
  value: T;
  createdAt: Date;
  expiresAt: Date;
  accessCount: number;
  lastAccessed: Date;
  size: number;
  tags: string[];
  namespace: string;
}

export interface CacheStatistics {
  totalEntries: number;
  hitCount: number;
  missCount: number;
  hitRate: number;
  totalSize: number;
  averageAccessTime: number;
  expiredEntries: number;
  evictedEntries: number;
}

// ============================================================================
// CONFIGURATION MANAGER
// ============================================================================

export class ConfigurationManager {
  private static instance: ConfigurationManager;
  private logger = getLogger('config-manager');
  private schemas: Map<string, ConfigurationSchema> = new Map();
  private watchers: Map<string, ((value: any) => void)[]> = new Map();
  private reloadInterval?: NodeJS.Timeout;

  static getInstance(): ConfigurationManager {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = new ConfigurationManager();
      ConfigurationManager.instance.loadDefaultConfiguration();
    }
    return ConfigurationManager.instance;
  }

  private loadDefaultConfiguration(): void {
    const schema = this.createDefaultSchema();
    this.schemas.set('default', schema);
    
    // Start configuration reload monitoring
    this.startReloadMonitoring();
  }

  private createDefaultSchema(): ConfigurationSchema {
    const values = new Map<string, ConfigurationValue>();

    // Database configuration
    this.addConfigValue(values, {
      key: 'DATABASE_URL',
      value: process.env.DATABASE_URL || 'postgresql://localhost:5432/titangrove',
      type: 'string',
      environment: 'all',
      category: 'database',
      description: 'Primary database connection string',
      isSecret: true,
      isRequired: true,
      lastUpdated: new Date(),
      updatedBy: 'system'
    });

    this.addConfigValue(values, {
      key: 'DATABASE_POOL_SIZE',
      value: parseInt(process.env.DATABASE_POOL_SIZE || '10'),
      type: 'number',
      environment: 'all',
      category: 'database',
      description: 'Database connection pool size',
      isSecret: false,
      isRequired: false,
      defaultValue: 10,
      validation: { min: 1, max: 100 },
      lastUpdated: new Date(),
      updatedBy: 'system'
    });

    // Cache configuration
    this.addConfigValue(values, {
      key: 'CACHE_TTL_SECONDS',
      value: parseInt(process.env.CACHE_TTL_SECONDS || '3600'),
      type: 'number',
      environment: 'all',
      category: 'cache',
      description: 'Default cache TTL in seconds',
      isSecret: false,
      isRequired: false,
      defaultValue: SYSTEM_CONSTANTS.DEFAULT_CACHE_TTL_SECONDS,
      validation: { min: 60, max: 86400 },
      lastUpdated: new Date(),
      updatedBy: 'system'
    });

    // API configuration
    this.addConfigValue(values, {
      key: 'API_RATE_LIMIT',
      value: parseInt(process.env.API_RATE_LIMIT || '1000'),
      type: 'number',
      environment: 'all',
      category: 'api',
      description: 'API rate limit per hour',
      isSecret: false,
      isRequired: false,
      defaultValue: 1000,
      validation: { min: 100, max: 100000 },
      lastUpdated: new Date(),
      updatedBy: 'system'
    });

    // Security configuration
    this.addConfigValue(values, {
      key: 'JWT_SECRET',
      value: process.env.JWT_SECRET || this.generateSecretKey(),
      type: 'string',
      environment: 'all',
      category: 'security',
      description: 'JWT signing secret',
      isSecret: true,
      isRequired: true,
      validation: { min: 32 },
      lastUpdated: new Date(),
      updatedBy: 'system'
    });

    // Business configuration
    this.addConfigValue(values, {
      key: 'BUSINESS_HOURS',
      value: JSON.parse(process.env.BUSINESS_HOURS || '{"start": "09:00", "end": "17:00", "timezone": "UTC"}'),
      type: 'object',
      environment: 'all',
      category: 'business',
      description: 'Business operating hours',
      isSecret: false,
      isRequired: false,
      defaultValue: { start: '09:00', end: '17:00', timezone: 'UTC' },
      lastUpdated: new Date(),
      updatedBy: 'system'
    });

    return {
      name: 'default',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      values,
      metadata: {
        loadedAt: new Date(),
        source: 'environment',
        checksum: this.calculateChecksum(values)
      }
    };
  }

  private addConfigValue(map: Map<string, ConfigurationValue>, config: ConfigurationValue): void {
    // Validate the configuration value
    const validation = this.validateConfigValue(config);
    if (!validation.isValid) {
      this.logger.error(`Invalid configuration for ${config.key}`, undefined, {
        key: config.key,
        errors: validation.errors
      });
      return;
    }

    map.set(config.key, config);
  }

  private validateConfigValue(config: ConfigurationValue): ValidationResult {
    const errors: ValidationError[] = [];

    // Required field validation
    if (config.isRequired && (config.value === undefined || config.value === null || config.value === '')) {
      errors.push({
        field: config.key,
        code: 'REQUIRED_CONFIG',
        message: `Configuration ${config.key} is required`
      });
    }

    // Type validation
    if (config.value !== undefined && config.value !== null) {
      const actualType = Array.isArray(config.value) ? 'array' : typeof config.value;
      if (actualType !== config.type) {
        errors.push({
          field: config.key,
          code: 'TYPE_MISMATCH',
          message: `Configuration ${config.key} must be of type ${config.type}, got ${actualType}`
        });
      }
    }

    // Custom validation
    if (config.validation) {
      const rule = config.validation;
      
      if (rule.min !== undefined && typeof config.value === 'number' && config.value < rule.min) {
        errors.push({
          field: config.key,
          code: 'MIN_VALUE',
          message: `Configuration ${config.key} must be at least ${rule.min}`
        });
      }

      if (rule.max !== undefined && typeof config.value === 'number' && config.value > rule.max) {
        errors.push({
          field: config.key,
          code: 'MAX_VALUE',
          message: `Configuration ${config.key} must not exceed ${rule.max}`
        });
      }

      if (rule.pattern && typeof config.value === 'string') {
        const regex = new RegExp(rule.pattern);
        if (!regex.test(config.value)) {
          errors.push({
            field: config.key,
            code: 'PATTERN_MISMATCH',
            message: `Configuration ${config.key} does not match required pattern`
          });
        }
      }

      if (rule.allowedValues && !rule.allowedValues.includes(config.value)) {
        errors.push({
          field: config.key,
          code: 'INVALID_VALUE',
          message: `Configuration ${config.key} must be one of: ${rule.allowedValues.join(', ')}`
        });
      }

      if (rule.customValidator) {
        const customError = rule.customValidator(config.value);
        if (customError) {
          errors.push(customError);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: []
    };
  }

  /**
   * Get configuration value
   */
  get<T = any>(key: string, defaultValue?: T, schemaName: string = 'default'): T {
    const schema = this.schemas.get(schemaName);
    if (!schema) {
      this.logger.warn(`Configuration schema not found: ${schemaName}`);
      return defaultValue as T;
    }

    const config = schema.values.get(key);
    if (!config) {
      this.logger.warn(`Configuration not found: ${key}`);
      return defaultValue as T;
    }

    return config.value as T;
  }

  /**
   * Set configuration value
   */
  set(key: string, value: any, schemaName: string = 'default'): void {
    const schema = this.schemas.get(schemaName);
    if (!schema) {
      this.logger.error(`Configuration schema not found: ${schemaName}`);
      return;
    }

    const existingConfig = schema.values.get(key);
    if (!existingConfig) {
      this.logger.error(`Configuration not found: ${key}`);
      return;
    }

    const updatedConfig: ConfigurationValue = {
      ...existingConfig,
      value,
      lastUpdated: new Date(),
      updatedBy: 'runtime'
    };

    const validation = this.validateConfigValue(updatedConfig);
    if (!validation.isValid) {
      this.logger.error(`Invalid configuration value for ${key}`, undefined, {
        errors: validation.errors
      });
      return;
    }

    schema.values.set(key, updatedConfig);
    schema.metadata.checksum = this.calculateChecksum(schema.values);

    // Notify watchers
    this.notifyWatchers(key, value);

    this.logger.info(`Configuration updated: ${key}`, { key, value: this.maskSecretValue(updatedConfig) });
  }

  /**
   * Watch for configuration changes
   */
  watch(key: string, callback: (value: any) => void): void {
    if (!this.watchers.has(key)) {
      this.watchers.set(key, []);
    }
    this.watchers.get(key)!.push(callback);
  }

  /**
   * Get all configuration for a category
   */
  getByCategory(category: string, schemaName: string = 'default'): Map<string, any> {
    const schema = this.schemas.get(schemaName);
    if (!schema) {
      return new Map();
    }

    const result = new Map<string, any>();
    
    for (const [key, config] of schema.values) {
      if (config.category === category) {
        result.set(key, config.value);
      }
    }

    return result;
  }

  private notifyWatchers(key: string, value: any): void {
    const callbacks = this.watchers.get(key);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(value);
        } catch (error) {
          this.logger.error(`Error in configuration watcher for ${key}`, error as Error);
        }
      });
    }
  }

  private generateSecretKey(): string {
    return uuidv4() + uuidv4().replace(/-/g, '');
  }

  private calculateChecksum(values: Map<string, ConfigurationValue>): string {
    const data = Array.from(values.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, config]) => `${key}:${JSON.stringify(config.value)}`)
      .join('|');
    
    // Simple checksum - in production use proper hash function
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  private maskSecretValue(config: ConfigurationValue): any {
    if (config.isSecret && typeof config.value === 'string') {
      return config.value.substring(0, 4) + '***';
    }
    return config.value;
  }

  private startReloadMonitoring(): void {
    // Check for configuration changes every 30 seconds
    this.reloadInterval = setInterval(() => {
      this.checkForConfigChanges();
    }, 30000);
  }

  private checkForConfigChanges(): void {
    // In production, this would check external configuration sources
    // for changes and reload as needed
    this.logger.debug('Checking for configuration changes');
  }

  /**
   * Stop configuration monitoring
   */
  stop(): void {
    if (this.reloadInterval) {
      clearInterval(this.reloadInterval);
      this.reloadInterval = undefined;
    }
  }
}

// ============================================================================
// ENTERPRISE CACHE MANAGER
// ============================================================================

export class CacheManager {
  private static instance: CacheManager;
  private logger = getLogger('cache-manager');
  private cache: Map<string, CacheEntry> = new Map();
  private statistics: CacheStatistics = {
    totalEntries: 0,
    hitCount: 0,
    missCount: 0,
    hitRate: 0,
    totalSize: 0,
    averageAccessTime: 0,
    expiredEntries: 0,
    evictedEntries: 0
  };
  private cleanupInterval?: NodeJS.Timeout;
  private maxSize: number;
  private defaultTTL: number;

  constructor(maxSize: number = 10000) {
    this.maxSize = maxSize;
    this.defaultTTL = SYSTEM_CONSTANTS.DEFAULT_CACHE_TTL_SECONDS;
    this.startCleanupTask();
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  /**
   * Set a value in cache
   */
  set<T>(key: string, value: T, options: CacheOptions = {}): void {
    const ttl = options.ttl || this.defaultTTL;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttl * 1000);

    // Check if we need to evict entries
    if (this.cache.size >= this.maxSize) {
      this.evictOldestEntries(Math.floor(this.maxSize * 0.1)); // Evict 10%
    }

    const entry: CacheEntry<T> = {
      key,
      value,
      createdAt: now,
      expiresAt,
      accessCount: 0,
      lastAccessed: now,
      size: this.calculateSize(value),
      tags: options.tags || [],
      namespace: options.namespace || 'default'
    };

    // Remove existing entry if it exists
    if (this.cache.has(key)) {
      const oldEntry = this.cache.get(key)!;
      this.statistics.totalSize -= oldEntry.size;
    } else {
      this.statistics.totalEntries++;
    }

    this.cache.set(key, entry);
    this.statistics.totalSize += entry.size;

    this.logger.debug(`Cache set: ${key}`, {
      key,
      namespace: entry.namespace,
      size: entry.size,
      ttl,
      tags: entry.tags
    });
  }

  /**
   * Get a value from cache
   */
  get<T>(key: string): T | null {
    const startTime = performance.now();
    const entry = this.cache.get(key) as CacheEntry<T>;

    if (!entry) {
      this.statistics.missCount++;
      this.updateHitRate();
      return null;
    }

    // Check if expired
    if (entry.expiresAt < new Date()) {
      this.cache.delete(key);
      this.statistics.expiredEntries++;
      this.statistics.totalEntries--;
      this.statistics.totalSize -= entry.size;
      this.statistics.missCount++;
      this.updateHitRate();
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = new Date();
    
    this.statistics.hitCount++;
    this.updateHitRate();
    
    const accessTime = performance.now() - startTime;
    this.updateAverageAccessTime(accessTime);

    this.logger.debug(`Cache hit: ${key}`, {
      key,
      accessCount: entry.accessCount,
      accessTime
    });

    return entry.value;
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    // Check if expired
    if (entry.expiresAt < new Date()) {
      this.cache.delete(key);
      this.statistics.expiredEntries++;
      this.statistics.totalEntries--;
      this.statistics.totalSize -= entry.size;
      return false;
    }
    
    return true;
  }

  /**
   * Delete a value from cache
   */
  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    this.cache.delete(key);
    this.statistics.totalEntries--;
    this.statistics.totalSize -= entry.size;

    this.logger.debug(`Cache delete: ${key}`, { key });
    return true;
  }

  /**
   * Clear cache by namespace or tags
   */
  clear(namespace?: string, tags?: string[]): number {
    let deletedCount = 0;

    for (const [key, entry] of this.cache) {
      let shouldDelete = false;

      if (namespace && entry.namespace === namespace) {
        shouldDelete = true;
      }

      if (tags && tags.some(tag => entry.tags.includes(tag))) {
        shouldDelete = true;
      }

      if (!namespace && !tags) {
        shouldDelete = true; // Clear all
      }

      if (shouldDelete) {
        this.cache.delete(key);
        this.statistics.totalEntries--;
        this.statistics.totalSize -= entry.size;
        deletedCount++;
      }
    }

    this.logger.info(`Cache cleared`, {
      namespace,
      tags,
      deletedCount
    });

    return deletedCount;
  }

  /**
   * Get cache statistics
   */
  getStatistics(): CacheStatistics {
    return { ...this.statistics };
  }

  /**
   * Get or set with factory function
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    let value = this.get<T>(key);
    
    if (value !== null) {
      return value;
    }

    // Generate value and cache it
    value = await factory();
    this.set(key, value, options);
    
    return value;
  }

  private calculateSize(value: any): number {
    // Simple size calculation - in production use proper size calculation
    if (typeof value === 'string') {
      return value.length * 2; // Approximate UTF-16 size
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value).length * 2;
    }
    
    return 8; // Approximate size for numbers, booleans, etc.
  }

  private evictOldestEntries(count: number): void {
    const entries = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.lastAccessed.getTime() - b.lastAccessed.getTime());

    for (let i = 0; i < Math.min(count, entries.length); i++) {
      const [key, entry] = entries[i];
      this.cache.delete(key);
      this.statistics.evictedEntries++;
      this.statistics.totalEntries--;
      this.statistics.totalSize -= entry.size;
    }

    this.logger.debug(`Evicted ${count} cache entries`);
  }

  private updateHitRate(): void {
    const total = this.statistics.hitCount + this.statistics.missCount;
    this.statistics.hitRate = total > 0 ? (this.statistics.hitCount / total) * 100 : 0;
  }

  private updateAverageAccessTime(newTime: number): void {
    const total = this.statistics.hitCount;
    if (total === 1) {
      this.statistics.averageAccessTime = newTime;
    } else {
      this.statistics.averageAccessTime = 
        ((this.statistics.averageAccessTime * (total - 1)) + newTime) / total;
    }
  }

  private startCleanupTask(): void {
    // Clean expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredEntries();
    }, 5 * 60 * 1000);
  }

  private cleanupExpiredEntries(): void {
    const now = new Date();
    let expiredCount = 0;

    for (const [key, entry] of this.cache) {
      if (entry.expiresAt < now) {
        this.cache.delete(key);
        this.statistics.expiredEntries++;
        this.statistics.totalEntries--;
        this.statistics.totalSize -= entry.size;
        expiredCount++;
      }
    }

    if (expiredCount > 0) {
      this.logger.debug(`Cleaned up ${expiredCount} expired cache entries`);
    }
  }

  /**
   * Stop cache cleanup tasks
   */
  stop(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = undefined;
    }
  }
}

// ============================================================================
// SINGLETON INSTANCES
// ============================================================================

export const configManager = ConfigurationManager.getInstance();
export const cacheManager = CacheManager.getInstance();

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Get configuration value with type safety
 */
export function getConfig<T = any>(key: string, defaultValue?: T): T {
  return configManager.get(key, defaultValue);
}

/**
 * Cache decorator for methods
 */
export function Cacheable(options: CacheOptions & { keyGenerator?: (...args: any[]) => string } = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const keyGenerator = options.keyGenerator || ((...args) => `${target.constructor.name}.${propertyKey}:${JSON.stringify(args)}`);
      const cacheKey = keyGenerator(...args);

      return await cacheManager.getOrSet(cacheKey, async () => {
        return await originalMethod.apply(this, args);
      }, options);
    };

    return descriptor;
  };
}

export default {
  ConfigurationManager,
  CacheManager,
  configManager,
  cacheManager,
  getConfig,
  Cacheable
};