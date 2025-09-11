import Joi from 'joi';
import { TitanConfig } from '../types';

// Re-export extended configuration loaders
export { loadExtendedConfig, loadBusinessConfig, validateExtendedConfig } from './business-config';

const configSchema = Joi.object({
  database: Joi.object({
    type: Joi.string().valid('postgresql', 'mysql', 'sqlite', 'mongodb', 'redis').required(),
    host: Joi.string().when('type', {
      is: Joi.string().valid('postgresql', 'mysql', 'mongodb', 'redis'),
      then: Joi.string().default('localhost'),
      otherwise: Joi.string().optional(),
    }),
    port: Joi.number().when('type', {
      is: 'postgresql',
      then: Joi.number().default(5432),
      otherwise: Joi.when('type', {
        is: 'mysql',
        then: Joi.number().default(3306),
        otherwise: Joi.when('type', {
          is: 'mongodb',
          then: Joi.number().default(27017),
          otherwise: Joi.when('type', {
            is: 'redis',
            then: Joi.number().default(6379),
            otherwise: Joi.number().optional(),
          }),
        }),
      }),
    }),
    database: Joi.string().when('type', {
      is: 'sqlite',
      then: Joi.string().default(':memory:'),
      otherwise: Joi.string().required(),
    }),
    username: Joi.string().when('type', {
      is: Joi.string().valid('postgresql', 'mysql'),
      then: Joi.string().required(),
      otherwise: Joi.string().optional(),
    }),
    password: Joi.string().when('type', {
      is: Joi.string().valid('postgresql', 'mysql'),
      then: Joi.string().required(),
      otherwise: Joi.string().optional(),
    }),
    url: Joi.string().optional(),
    ssl: Joi.alternatives([Joi.boolean(), Joi.object()]).default(false),
    pool: Joi.object({
      min: Joi.number().default(2),
      max: Joi.number().default(10),
      idleTimeout: Joi.number().default(30000),
    }).default(),
    migrations: Joi.object({
      directory: Joi.string().default('./migrations'),
      tableName: Joi.string().default('migrations'),
    }).default(),
  }).required(),

  server: Joi.object({
    port: Joi.number().default(3000),
    host: Joi.string().default('localhost'),
    cors: Joi.object({
      origin: Joi.alternatives([
        Joi.string(),
        Joi.array().items(Joi.string()),
        Joi.boolean(),
      ]).default('*'),
      credentials: Joi.boolean().default(false),
    }).default(),
    rateLimit: Joi.object({
      windowMs: Joi.number().default(15 * 60 * 1000), // 15 minutes
      max: Joi.number().default(100),
    }).default(),
    compression: Joi.boolean().default(true),
    security: Joi.object({
      helmet: Joi.boolean().default(true),
      jwt: Joi.object({
        secret: Joi.string().required(),
        expiresIn: Joi.string().default('1h'),
      }).optional(),
    }).default(),
  }).required(),

  cache: Joi.object({
    type: Joi.string().valid('memory', 'redis', 'memcached').default('memory'),
    host: Joi.string().when('type', {
      is: Joi.string().valid('redis', 'memcached'),
      then: Joi.string().default('localhost'),
      otherwise: Joi.string().optional(),
    }),
    port: Joi.number().when('type', {
      is: 'redis',
      then: Joi.number().default(6379),
      otherwise: Joi.when('type', {
        is: 'memcached',
        then: Joi.number().default(11211),
        otherwise: Joi.number().optional(),
      }),
    }),
    ttl: Joi.number().default(300), // 5 minutes
    maxKeys: Joi.number().default(1000),
  }).optional(),

  analytics: Joi.object({
    enabled: Joi.boolean().default(false),
    elasticsearch: Joi.object({
      host: Joi.string().required(),
      port: Joi.number().default(9200),
      index: Joi.string().default('titan-analytics'),
    }).when('enabled', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    metrics: Joi.object({
      enabled: Joi.boolean().default(true),
      interval: Joi.number().default(60000), // 1 minute
    }).default(),
  }).optional(),

  cluster: Joi.object({
    enabled: Joi.boolean().default(false),
    workers: Joi.number().default(require('os').cpus().length),
    gracefulTimeout: Joi.number().default(5000),
  }).optional(),

  logging: Joi.object({
    level: Joi.string().valid('error', 'warn', 'info', 'debug').default('info'),
    format: Joi.string().valid('json', 'simple').default('simple'),
  }).default(),
});

export function validateConfig(config: any): TitanConfig {
  const { error, value } = configSchema.validate(config, {
    allowUnknown: false,
    stripUnknown: true,
  });

  if (error) {
    throw new Error(`Invalid configuration: ${error.message}`);
  }

  return value as TitanConfig;
}

export function loadConfig(): TitanConfig {
  // Try to load from environment variables or config file
  const config = {
    database: {
      type: (process.env.DB_TYPE as any) || 'sqlite',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
      database: process.env.DB_NAME || 'titan_grove',
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      url: process.env.DATABASE_URL,
    },
    server: {
      port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
      host: process.env.HOST || 'localhost',
      security: {
        jwt: {
          secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        },
      },
    },
    cache: process.env.REDIS_URL
      ? {
          type: 'redis' as const,
          host: process.env.REDIS_HOST || 'localhost',
          port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
        }
      : undefined,
    analytics: {
      enabled: process.env.ANALYTICS_ENABLED === 'true',
      elasticsearch: process.env.ELASTICSEARCH_URL
        ? {
            host: process.env.ELASTICSEARCH_HOST || 'localhost',
            port: process.env.ELASTICSEARCH_PORT
              ? parseInt(process.env.ELASTICSEARCH_PORT, 10)
              : 9200,
          }
        : undefined,
    },
    cluster: {
      enabled: process.env.CLUSTER_ENABLED === 'true',
    },
  };

  return validateConfig(config);
}
