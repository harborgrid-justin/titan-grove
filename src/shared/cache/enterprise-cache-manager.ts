/**
 * Enterprise Caching System with Redis Integration - Enterprise Grade
 * Implements Fix 32: Caching strategies (Redis integration)
 */

import Redis from 'ioredis';
import { getLogger } from '../../utils/enterprise-logger';
import { getAuditService } from '../security/audit-trail';

interface CacheConfig {
  redis: {
    host: string;
    port: number;
    password?: string;
    db: number;
    keyPrefix: string;
    connectTimeout: number;
    lazyConnect: boolean;
    retryDelayOnFailover: number;
    maxRetriesPerRequest: number;
    enableOfflineQueue: boolean;
  };
  defaultTTL: number;
  enableCompression: boolean;
  enableEncryption: boolean;
  maxKeyLength: number;
  maxValueSize: number; // in bytes
  enableMetrics: boolean;
  circuitBreaker: {
    enabled: boolean;
    failureThreshold: number;
    recoveryTimeout: number;
  };
}

interface CacheEntry<T = any> {
  value: T;
  createdAt: number;
  expiresAt?: number;
  accessCount: number;
  lastAccessedAt: number;
  tags: string[];
  compressed?: boolean;
  encrypted?: boolean;
  version: string;
}

interface CacheMetrics {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  errors: number;
  hitRate: number;
  averageResponseTime: number;
  memoryUsage: number;
  connectionStatus: 'connected' | 'disconnected' | 'error';
  lastError?: string;
}

interface CachePattern {
  pattern: string;
  description: string;
  ttl: number;
  tags: string[];
  strategy: 'write-through' | 'write-behind' | 'cache-aside' | 'refresh-ahead';
}

export class EnterpriseCacheManager {
  private logger = getLogger('EnterpriseCacheManager');
  private redis: Redis;
  private config: CacheConfig;
  private metrics: CacheMetrics;
  private cachePatterns = new Map<string, CachePattern>();
  private circuitBreakerState = { isOpen: false, failures: 0, lastFailureTime: 0 };
  private healthCheckInterval?: NodeJS.Timeout;

  constructor(config: CacheConfig) {
    this.config = config;
    this.initializeRedis();
    this.initializeMetrics();
    this.setupHealthChecks();
    this.setupCachePatterns();

    this.logger.logBusinessOperation(
      'CACHE_MANAGER_INITIALIZED',
      'EnterpriseCacheManager',
      '',
      'SUCCESS',
      {
        redisHost: config.redis.host,
        redisPort: config.redis.port,
        defaultTTL: config.defaultTTL,
        enableCompression: config.enableCompression,
        enableEncryption: config.enableEncryption
      }
    );
  }

  private initializeRedis(): void {
    this.redis = new Redis({
      host: this.config.redis.host,
      port: this.config.redis.port,
      password: this.config.redis.password,
      db: this.config.redis.db,
      keyPrefix: this.config.redis.keyPrefix,
      connectTimeout: this.config.redis.connectTimeout,
      lazyConnect: this.config.redis.lazyConnect,
      retryDelayOnFailover: this.config.redis.retryDelayOnFailover,
      maxRetriesPerRequest: this.config.redis.maxRetriesPerRequest,
      enableOfflineQueue: this.config.redis.enableOfflineQueue
    });

    // Redis event handlers
    this.redis.on('connect', () => {
      this.metrics.connectionStatus = 'connected';
      this.circuitBreakerState = { isOpen: false, failures: 0, lastFailureTime: 0 };
      this.logger.logBusinessOperation(
        'REDIS_CONNECTED',
        'EnterpriseCacheManager',
        '',
        'SUCCESS'
      );
    });

    this.redis.on('error', (error) => {
      this.metrics.connectionStatus = 'error';
      this.metrics.lastError = error.message;
      this.metrics.errors++;
      this.handleCircuitBreaker();
      
      this.logger.logError('Redis connection error', error);
    });

    this.redis.on('close', () => {
      this.metrics.connectionStatus = 'disconnected';
      this.logger.logBusinessOperation(
        'REDIS_DISCONNECTED',
        'EnterpriseCacheManager',
        '',
        'WARNING'
      );
    });
  }

  private initializeMetrics(): void {
    this.metrics = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      errors: 0,
      hitRate: 0,
      averageResponseTime: 0,
      memoryUsage: 0,
      connectionStatus: 'disconnected'
    };
  }

  private setupHealthChecks(): void {
    this.healthCheckInterval = setInterval(async () => {
      try {
        const start = Date.now();
        await this.redis.ping();
        const responseTime = Date.now() - start;
        
        this.updateMetrics('ping', responseTime);
        
        // Get memory usage
        const info = await this.redis.info('memory');
        const memoryMatch = info.match(/used_memory:(\d+)/);
        if (memoryMatch) {
          this.metrics.memoryUsage = parseInt(memoryMatch[1]);
        }

      } catch (error) {
        this.logger.logError('Cache health check failed', error);
        this.handleCircuitBreaker();
      }
    }, 30000); // Every 30 seconds
  }

  private setupCachePatterns(): void {
    // Define common caching patterns
    const patterns: CachePattern[] = [
      {
        pattern: 'user:*',
        description: 'User data caching',
        ttl: 3600, // 1 hour
        tags: ['user', 'profile'],
        strategy: 'write-through'
      },
      {
        pattern: 'session:*',
        description: 'User session data',
        ttl: 1800, // 30 minutes
        tags: ['session', 'auth'],
        strategy: 'cache-aside'
      },
      {
        pattern: 'api:response:*',
        description: 'API response caching',
        ttl: 300, // 5 minutes
        tags: ['api', 'response'],
        strategy: 'cache-aside'
      },
      {
        pattern: 'config:*',
        description: 'Application configuration',
        ttl: 7200, // 2 hours
        tags: ['config', 'system'],
        strategy: 'write-through'
      },
      {
        pattern: 'report:*',
        description: 'Generated reports',
        ttl: 86400, // 24 hours
        tags: ['reports', 'analytics'],
        strategy: 'write-behind'
      }
    ];

    for (const pattern of patterns) {
      this.cachePatterns.set(pattern.pattern, pattern);
    }
  }

  // Core caching methods
  public async get<T = any>(key: string, defaultValue?: T): Promise<T | null> {
    const startTime = Date.now();
    
    try {
      if (this.isCircuitBreakerOpen()) {
        this.logger.logBusinessOperation(
          'CACHE_CIRCUIT_BREAKER_OPEN',
          'EnterpriseCacheManager',
          key,
          'WARNING'
        );
        return defaultValue || null;
      }

      const cachedData = await this.redis.get(this.normalizeKey(key));
      
      if (cachedData) {
        const entry: CacheEntry<T> = JSON.parse(cachedData);
        
        // Check expiration
        if (entry.expiresAt && Date.now() > entry.expiresAt) {
          await this.delete(key);
          this.updateMetrics('miss', Date.now() - startTime);
          return defaultValue || null;
        }

        // Update access statistics
        entry.accessCount++;
        entry.lastAccessedAt = Date.now();
        await this.redis.set(this.normalizeKey(key), JSON.stringify(entry));

        // Decompress if needed
        let value = entry.value;
        if (entry.compressed) {
          value = await this.decompress(value);
        }

        // Decrypt if needed
        if (entry.encrypted) {
          value = await this.decrypt(value);
        }

        this.updateMetrics('hit', Date.now() - startTime);
        
        this.logger.logBusinessOperation(
          'CACHE_HIT',
          'EnterpriseCacheManager',
          key,
          'SUCCESS',
          { accessCount: entry.accessCount }
        );

        return value;
      }

      this.updateMetrics('miss', Date.now() - startTime);
      return defaultValue || null;

    } catch (error) {
      this.logger.logError('Cache get failed', error, { key });
      this.updateMetrics('error', Date.now() - startTime);
      this.handleCircuitBreaker();
      return defaultValue || null;
    }
  }

  public async set<T = any>(
    key: string,
    value: T,
    ttl?: number,
    tags: string[] = []
  ): Promise<boolean> {
    const startTime = Date.now();

    try {
      if (this.isCircuitBreakerOpen()) {
        return false;
      }

      // Validate key and value
      const normalizedKey = this.normalizeKey(key);
      if (normalizedKey.length > this.config.maxKeyLength) {
        throw new Error(`Cache key too long: ${normalizedKey.length} > ${this.config.maxKeyLength}`);
      }

      let processedValue = value;

      // Encrypt sensitive data
      if (this.config.enableEncryption && this.isSensitiveData(key, value)) {
        processedValue = await this.encrypt(processedValue);
      }

      // Compress large values
      const valueSize = JSON.stringify(processedValue).length;
      if (valueSize > this.config.maxValueSize) {
        throw new Error(`Cache value too large: ${valueSize} > ${this.config.maxValueSize}`);
      }

      let compressed = false;
      if (this.config.enableCompression && valueSize > 1024) { // Compress values > 1KB
        processedValue = await this.compress(processedValue);
        compressed = true;
      }

      const entry: CacheEntry<T> = {
        value: processedValue,
        createdAt: Date.now(),
        expiresAt: ttl ? Date.now() + (ttl * 1000) : undefined,
        accessCount: 0,
        lastAccessedAt: Date.now(),
        tags,
        compressed,
        encrypted: this.config.enableEncryption && this.isSensitiveData(key, value),
        version: '1.0'
      };

      // Set with TTL
      const effectiveTTL = ttl || this.getPatternTTL(key) || this.config.defaultTTL;
      await this.redis.setex(normalizedKey, effectiveTTL, JSON.stringify(entry));

      // Add to tag indexes for invalidation
      if (tags.length > 0) {
        await this.updateTagIndexes(key, tags);
      }

      this.updateMetrics('set', Date.now() - startTime);

      this.logger.logBusinessOperation(
        'CACHE_SET',
        'EnterpriseCacheManager',
        key,
        'SUCCESS',
        {
          ttl: effectiveTTL,
          compressed,
          encrypted: entry.encrypted,
          tags: tags.length,
          valueSize
        }
      );

      return true;

    } catch (error) {
      this.logger.logError('Cache set failed', error, { key, ttl });
      this.updateMetrics('error', Date.now() - startTime);
      this.handleCircuitBreaker();
      return false;
    }
  }

  public async delete(key: string): Promise<boolean> {
    const startTime = Date.now();

    try {
      if (this.isCircuitBreakerOpen()) {
        return false;
      }

      const normalizedKey = this.normalizeKey(key);
      const deleted = await this.redis.del(normalizedKey);
      
      this.updateMetrics('delete', Date.now() - startTime);

      if (deleted > 0) {
        this.logger.logBusinessOperation(
          'CACHE_DELETE',
          'EnterpriseCacheManager',
          key,
          'SUCCESS'
        );
      }

      return deleted > 0;

    } catch (error) {
      this.logger.logError('Cache delete failed', error, { key });
      this.updateMetrics('error', Date.now() - startTime);
      this.handleCircuitBreaker();
      return false;
    }
  }

  public async invalidateByPattern(pattern: string): Promise<number> {
    try {
      if (this.isCircuitBreakerOpen()) {
        return 0;
      }

      const keys = await this.redis.keys(this.normalizeKey(pattern));
      
      if (keys.length === 0) {
        return 0;
      }

      const deleted = await this.redis.del(...keys);

      this.logger.logBusinessOperation(
        'CACHE_PATTERN_INVALIDATED',
        'EnterpriseCacheManager',
        pattern,
        'SUCCESS',
        { deletedCount: deleted }
      );

      return deleted;

    } catch (error) {
      this.logger.logError('Pattern invalidation failed', error, { pattern });
      return 0;
    }
  }

  public async invalidateByTags(tags: string[]): Promise<number> {
    try {
      if (this.isCircuitBreakerOpen()) {
        return 0;
      }

      let allKeys: string[] = [];

      // Get keys for each tag
      for (const tag of tags) {
        const tagKeys = await this.redis.smembers(`tags:${tag}`);
        allKeys = allKeys.concat(tagKeys);
      }

      // Remove duplicates
      const uniqueKeys = [...new Set(allKeys)];

      if (uniqueKeys.length === 0) {
        return 0;
      }

      // Delete cache entries
      const deleted = await this.redis.del(...uniqueKeys);

      // Clean up tag indexes
      for (const tag of tags) {
        await this.redis.del(`tags:${tag}`);
      }

      this.logger.logAuditEvent(
        'CACHE_TAGS_INVALIDATED',
        'cache_invalidation',
        'SUCCESS',
        {
          tags,
          deletedCount: deleted
        }
      );

      return deleted;

    } catch (error) {
      this.logger.logError('Tag invalidation failed', error, { tags });
      return 0;
    }
  }

  // Advanced caching methods
  public async mget<T = any>(keys: string[]): Promise<Map<string, T | null>> {
    const results = new Map<string, T | null>();

    try {
      if (this.isCircuitBreakerOpen()) {
        for (const key of keys) {
          results.set(key, null);
        }
        return results;
      }

      const normalizedKeys = keys.map(key => this.normalizeKey(key));
      const cachedValues = await this.redis.mget(...normalizedKeys);

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const cachedData = cachedValues[i];

        if (cachedData) {
          const entry: CacheEntry<T> = JSON.parse(cachedData);
          
          if (!entry.expiresAt || Date.now() <= entry.expiresAt) {
            let value = entry.value;
            
            if (entry.compressed) {
              value = await this.decompress(value);
            }
            
            if (entry.encrypted) {
              value = await this.decrypt(value);
            }
            
            results.set(key, value);
          } else {
            results.set(key, null);
          }
        } else {
          results.set(key, null);
        }
      }

      return results;

    } catch (error) {
      this.logger.logError('Multi-get failed', error, { keyCount: keys.length });
      for (const key of keys) {
        results.set(key, null);
      }
      return results;
    }
  }

  public async mset(entries: Map<string, { value: any; ttl?: number; tags?: string[] }>): Promise<boolean> {
    try {
      if (this.isCircuitBreakerOpen()) {
        return false;
      }

      const pipeline = this.redis.pipeline();

      for (const [key, { value, ttl, tags = [] }] of entries.entries()) {
        const normalizedKey = this.normalizeKey(key);
        let processedValue = value;

        // Process value (encrypt/compress)
        if (this.config.enableEncryption && this.isSensitiveData(key, value)) {
          processedValue = await this.encrypt(processedValue);
        }

        const valueSize = JSON.stringify(processedValue).length;
        let compressed = false;
        
        if (this.config.enableCompression && valueSize > 1024) {
          processedValue = await this.compress(processedValue);
          compressed = true;
        }

        const entry: CacheEntry = {
          value: processedValue,
          createdAt: Date.now(),
          expiresAt: ttl ? Date.now() + (ttl * 1000) : undefined,
          accessCount: 0,
          lastAccessedAt: Date.now(),
          tags,
          compressed,
          encrypted: this.config.enableEncryption && this.isSensitiveData(key, value),
          version: '1.0'
        };

        const effectiveTTL = ttl || this.getPatternTTL(key) || this.config.defaultTTL;
        pipeline.setex(normalizedKey, effectiveTTL, JSON.stringify(entry));

        // Update tag indexes
        if (tags.length > 0) {
          for (const tag of tags) {
            pipeline.sadd(`tags:${tag}`, normalizedKey);
          }
        }
      }

      await pipeline.exec();

      this.logger.logBusinessOperation(
        'CACHE_MULTI_SET',
        'EnterpriseCacheManager',
        '',
        'SUCCESS',
        { entryCount: entries.size }
      );

      return true;

    } catch (error) {
      this.logger.logError('Multi-set failed', error, { entryCount: entries.size });
      return false;
    }
  }

  // Cache warming and preloading
  public async warmCache(warmingStrategy: {
    patterns: string[];
    dataLoader: (key: string) => Promise<any>;
    concurrency?: number;
  }): Promise<{ warmed: number; failed: number }> {
    const { patterns, dataLoader, concurrency = 10 } = warmingStrategy;
    let warmed = 0;
    let failed = 0;

    try {
      // Get all keys matching patterns
      const allKeys: string[] = [];
      for (const pattern of patterns) {
        const keys = await this.redis.keys(this.normalizeKey(pattern));
        allKeys.push(...keys);
      }

      // Process keys in batches
      const batches = this.chunkArray(allKeys, concurrency);

      for (const batch of batches) {
        const promises = batch.map(async (key) => {
          try {
            const data = await dataLoader(key);
            const pattern = this.findMatchingPattern(key);
            const ttl = pattern ? this.cachePatterns.get(pattern)?.ttl : undefined;
            
            await this.set(key, data, ttl);
            warmed++;
          } catch (error) {
            this.logger.logError('Cache warming failed for key', error, { key });
            failed++;
          }
        });

        await Promise.all(promises);
      }

      this.logger.logBusinessOperation(
        'CACHE_WARMING_COMPLETED',
        'EnterpriseCacheManager',
        '',
        'SUCCESS',
        { warmed, failed, patterns }
      );

    } catch (error) {
      this.logger.logError('Cache warming failed', error);
    }

    return { warmed, failed };
  }

  // Metrics and monitoring
  public getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  public async getCacheInfo(): Promise<any> {
    try {
      const info = await this.redis.info();
      const keyspace = await this.redis.info('keyspace');
      
      return {
        redis: {
          version: this.extractInfoValue(info, 'redis_version'),
          uptime: this.extractInfoValue(info, 'uptime_in_seconds'),
          connectedClients: this.extractInfoValue(info, 'connected_clients'),
          usedMemory: this.extractInfoValue(info, 'used_memory'),
          usedMemoryHuman: this.extractInfoValue(info, 'used_memory_human'),
          totalCommandsProcessed: this.extractInfoValue(info, 'total_commands_processed')
        },
        keyspace,
        metrics: this.metrics,
        patterns: Array.from(this.cachePatterns.entries()).map(([pattern, config]) => ({
          pattern,
          ...config
        }))
      };
    } catch (error) {
      this.logger.logError('Failed to get cache info', error);
      return null;
    }
  }

  // Cache cleanup and maintenance
  public async cleanup(): Promise<{ deletedExpired: number; deletedUnused: number }> {
    let deletedExpired = 0;
    let deletedUnused = 0;

    try {
      // Get all cache keys
      const keys = await this.redis.keys(this.normalizeKey('*'));
      
      const now = Date.now();
      const unusedThreshold = 7 * 24 * 60 * 60 * 1000; // 7 days

      for (const key of keys) {
        try {
          const cachedData = await this.redis.get(key);
          
          if (cachedData) {
            const entry: CacheEntry = JSON.parse(cachedData);
            
            // Remove expired entries
            if (entry.expiresAt && now > entry.expiresAt) {
              await this.redis.del(key);
              deletedExpired++;
              continue;
            }

            // Remove unused entries
            if (entry.accessCount === 0 && (now - entry.createdAt) > unusedThreshold) {
              await this.redis.del(key);
              deletedUnused++;
            }
          }
        } catch (error) {
          // Skip invalid entries
          await this.redis.del(key);
          deletedExpired++;
        }
      }

      this.logger.logBusinessOperation(
        'CACHE_CLEANUP_COMPLETED',
        'EnterpriseCacheManager',
        '',
        'SUCCESS',
        { deletedExpired, deletedUnused }
      );

    } catch (error) {
      this.logger.logError('Cache cleanup failed', error);
    }

    return { deletedExpired, deletedUnused };
  }

  // Private helper methods
  private normalizeKey(key: string): string {
    return key.replace(/[^a-zA-Z0-9:._-]/g, '_');
  }

  private getPatternTTL(key: string): number | undefined {
    for (const [pattern, config] of this.cachePatterns.entries()) {
      if (this.matchPattern(key, pattern)) {
        return config.ttl;
      }
    }
    return undefined;
  }

  private matchPattern(key: string, pattern: string): boolean {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return regex.test(key);
  }

  private findMatchingPattern(key: string): string | undefined {
    for (const pattern of this.cachePatterns.keys()) {
      if (this.matchPattern(key, pattern)) {
        return pattern;
      }
    }
    return undefined;
  }

  private updateMetrics(operation: 'hit' | 'miss' | 'set' | 'delete' | 'error' | 'ping', responseTime: number): void {
    this.metrics[operation === 'hit' ? 'hits' : operation === 'miss' ? 'misses' : operation === 'error' ? 'errors' : operation]++;
    
    if (operation !== 'error') {
      const totalRequests = this.metrics.hits + this.metrics.misses;
      this.metrics.hitRate = totalRequests > 0 ? (this.metrics.hits / totalRequests) * 100 : 0;
    }
    
    this.metrics.averageResponseTime = (this.metrics.averageResponseTime + responseTime) / 2;
  }

  private handleCircuitBreaker(): void {
    if (!this.config.circuitBreaker.enabled) return;

    this.circuitBreakerState.failures++;
    
    if (this.circuitBreakerState.failures >= this.config.circuitBreaker.failureThreshold) {
      this.circuitBreakerState.isOpen = true;
      this.circuitBreakerState.lastFailureTime = Date.now();
      
      this.logger.logBusinessOperation(
        'CACHE_CIRCUIT_BREAKER_OPENED',
        'EnterpriseCacheManager',
        '',
        'WARNING',
        { failures: this.circuitBreakerState.failures }
      );

      // Schedule recovery attempt
      setTimeout(() => {
        this.circuitBreakerState.isOpen = false;
        this.circuitBreakerState.failures = 0;
        this.logger.logBusinessOperation(
          'CACHE_CIRCUIT_BREAKER_RESET',
          'EnterpriseCacheManager',
          '',
          'SUCCESS'
        );
      }, this.config.circuitBreaker.recoveryTimeout);
    }
  }

  private isCircuitBreakerOpen(): boolean {
    return this.config.circuitBreaker.enabled && this.circuitBreakerState.isOpen;
  }

  private isSensitiveData(key: string, value: any): boolean {
    const sensitivePatterns = ['password', 'token', 'secret', 'key', 'auth', 'credential'];
    const keyLower = key.toLowerCase();
    
    return sensitivePatterns.some(pattern => keyLower.includes(pattern)) ||
           (typeof value === 'object' && value !== null && this.containsSensitiveFields(value));
  }

  private containsSensitiveFields(obj: any): boolean {
    const sensitiveFields = ['password', 'token', 'secret', 'privateKey', 'apiKey'];
    
    if (typeof obj === 'object' && obj !== null) {
      return Object.keys(obj).some(key => sensitiveFields.some(field => key.toLowerCase().includes(field)));
    }
    
    return false;
  }

  private async compress(value: any): Promise<any> {
    // Implement compression logic (e.g., using zlib)
    // For now, return value as-is
    return value;
  }

  private async decompress(value: any): Promise<any> {
    // Implement decompression logic
    return value;
  }

  private async encrypt(value: any): Promise<any> {
    // Implement encryption logic using the encryption service
    return value;
  }

  private async decrypt(value: any): Promise<any> {
    // Implement decryption logic
    return value;
  }

  private async updateTagIndexes(key: string, tags: string[]): Promise<void> {
    const pipeline = this.redis.pipeline();
    const normalizedKey = this.normalizeKey(key);
    
    for (const tag of tags) {
      pipeline.sadd(`tags:${tag}`, normalizedKey);
    }
    
    await pipeline.exec();
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  private extractInfoValue(info: string, key: string): string {
    const match = info.match(new RegExp(`${key}:(.+)`));
    return match ? match[1] : 'unknown';
  }

  public async shutdown(): Promise<void> {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    
    await this.redis.quit();
    
    this.logger.logBusinessOperation(
      'CACHE_MANAGER_SHUTDOWN',
      'EnterpriseCacheManager',
      '',
      'SUCCESS'
    );
  }
}

// Singleton instance
let cacheManager: EnterpriseCacheManager | null = null;

export function initializeCacheManager(config: CacheConfig): EnterpriseCacheManager {
  if (cacheManager) {
    throw new Error('Cache manager already initialized');
  }
  
  cacheManager = new EnterpriseCacheManager(config);
  return cacheManager;
}

export function getCacheManager(): EnterpriseCacheManager {
  if (!cacheManager) {
    throw new Error('Cache manager not initialized. Call initializeCacheManager first.');
  }
  return cacheManager;
}

export { CacheConfig, CacheEntry, CacheMetrics, CachePattern };