import { EventEmitter } from 'events';
import type { Logger } from 'winston';
import { CacheConfig, HealthCheck } from '../types';
import * as Redis from 'ioredis';

export class CacheManager extends EventEmitter {
  private config: CacheConfig;
  private logger: Logger;
  private client:
    | Redis.Redis
    | Map<string, { value: any; ttl?: NodeJS.Timeout; expires?: number }>
    | null = null;

  constructor(config: CacheConfig, logger: Logger) {
    super();
    this.config = config;
    this.logger = logger;
  }

  async initialize(): Promise<void> {
    try {
      this.logger.info(`Initializing ${this.config.type} cache`);

      switch (this.config.type) {
        case 'redis':
          this.client = new Redis.Redis({
            host: this.config.host || 'localhost',
            port: this.config.port || 6379,
            lazyConnect: true,
          });

          this.client.on('connect', () => {
            this.logger.info('Redis cache connected');
            this.emit('connected');
          });

          this.client.on('error', (error) => {
            this.logger.error('Redis cache error:', error);
            this.emit('error', error);
          });

          await this.client.connect();
          break;

        case 'memory':
          this.client = new Map();
          this.logger.info('Memory cache initialized');
          this.emit('connected');
          break;

        case 'memcached':
          // For now, fallback to memory cache for memcached
          this.client = new Map();
          this.logger.warn('Memcached not implemented, using memory cache');
          this.emit('connected');
          break;

        default:
          throw new Error(`Unsupported cache type: ${this.config.type}`);
      }
    } catch (error) {
      this.logger.error('Cache initialization failed:', error);
      this.emit('error', error);
      throw error;
    }
  }

  async get(key: string): Promise<any> {
    try {
      if (!this.client) {
        throw new Error('Cache not initialized');
      }

      if (this.client instanceof Redis.Redis) {
        const value = await this.client.get(key);
        return value ? JSON.parse(value) : null;
      } else {
        // Memory cache
        const entry = this.client.get(key);
        if (!entry) return null;

        // Check expiration
        if (entry.expires && Date.now() > entry.expires) {
          this.client.delete(key);
          return null;
        }

        return entry.value;
      }
    } catch (error) {
      this.logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      if (!this.client) {
        throw new Error('Cache not initialized');
      }

      const effectiveTtl = ttl || this.config.ttl;

      if (this.client instanceof Redis.Redis) {
        const serializedValue = JSON.stringify(value);
        if (effectiveTtl) {
          await this.client.setex(key, effectiveTtl, serializedValue);
        } else {
          await this.client.set(key, serializedValue);
        }
      } else {
        // Memory cache
        const entry: any = { value };

        if (effectiveTtl) {
          entry.expires = Date.now() + effectiveTtl * 1000;
          entry.ttl = setTimeout(() => {
            if (this.client instanceof Map) {
              this.client.delete(key);
            }
          }, effectiveTtl * 1000);
        }

        // Clear existing timeout if any
        const existing = this.client.get(key);
        if (existing?.ttl) {
          clearTimeout(existing.ttl);
        }

        this.client.set(key, entry);

        // Enforce max keys limit for memory cache
        if (this.config.maxKeys && this.client.size > this.config.maxKeys) {
          const firstKey = this.client.keys().next().value;
          if (firstKey) {
            const firstEntry = this.client.get(firstKey);
            if (firstEntry?.ttl) clearTimeout(firstEntry.ttl);
            this.client.delete(firstKey);
          }
        }
      }

      this.logger.debug(`Cache set: ${key}`, { ttl: effectiveTtl });
    } catch (error) {
      this.logger.error(`Cache set error for key ${key}:`, error);
      throw error;
    }
  }

  async del(key: string): Promise<void> {
    try {
      if (!this.client) {
        throw new Error('Cache not initialized');
      }

      if (this.client instanceof Redis.Redis) {
        await this.client.del(key);
      } else {
        // Memory cache
        const entry = this.client.get(key);
        if (entry?.ttl) {
          clearTimeout(entry.ttl);
        }
        this.client.delete(key);
      }

      this.logger.debug(`Cache delete: ${key}`);
    } catch (error) {
      this.logger.error(`Cache delete error for key ${key}:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      if (!this.client) {
        throw new Error('Cache not initialized');
      }

      if (this.client instanceof Redis.Redis) {
        await this.client.flushdb();
      } else {
        // Memory cache - clear all timers first
        for (const entry of this.client.values()) {
          if (entry.ttl) {
            clearTimeout(entry.ttl);
          }
        }
        this.client.clear();
      }

      this.logger.info('Cache cleared');
    } catch (error) {
      this.logger.error('Cache clear error:', error);
      throw error;
    }
  }

  async keys(pattern?: string): Promise<string[]> {
    try {
      if (!this.client) {
        throw new Error('Cache not initialized');
      }

      if (this.client instanceof Redis.Redis) {
        return await this.client.keys(pattern || '*');
      } else {
        // Memory cache
        const allKeys = Array.from(this.client.keys());
        if (!pattern || pattern === '*') {
          return allKeys;
        }

        // Simple pattern matching for memory cache
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return allKeys.filter((key) => regex.test(key));
      }
    } catch (error) {
      this.logger.error(`Cache keys error:`, error);
      return [];
    }
  }

  async stop(): Promise<void> {
    try {
      if (this.client instanceof Redis.Redis) {
        await this.client.quit();
      } else if (this.client instanceof Map) {
        // Clear all timers
        for (const entry of this.client.values()) {
          if (entry.ttl) {
            clearTimeout(entry.ttl);
          }
        }
        this.client.clear();
      }

      this.client = null;
      this.logger.info('Cache stopped');
    } catch (error) {
      this.logger.error('Cache stop error:', error);
    }
  }

  async healthCheck(): Promise<HealthCheck> {
    try {
      if (!this.client) {
        return {
          service: 'cache',
          status: 'unhealthy',
          timestamp: new Date(),
          details: {
            type: this.config.type,
            error: 'Not initialized',
          },
        };
      }

      if (this.client instanceof Redis.Redis) {
        // Test Redis connection
        await this.client.ping();
        return {
          service: 'cache',
          status: 'healthy',
          timestamp: new Date(),
          details: {
            type: this.config.type,
            host: this.config.host,
            port: this.config.port,
          },
        };
      } else {
        // Memory cache is always healthy if initialized
        return {
          service: 'cache',
          status: 'healthy',
          timestamp: new Date(),
          details: {
            type: this.config.type,
            keyCount: this.client.size,
            maxKeys: this.config.maxKeys,
          },
        };
      }
    } catch (error) {
      this.logger.error('Cache health check error:', error);
      return {
        service: 'cache',
        status: 'unhealthy',
        timestamp: new Date(),
        details: {
          type: this.config.type,
          error: error instanceof Error ? (error as Error).message : 'Unknown error',
        },
      };
    }
  }
}
