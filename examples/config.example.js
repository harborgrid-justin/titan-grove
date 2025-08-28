/**
 * Example Titan Grove Configuration
 * This file demonstrates various configuration options for Titan Grove
 */

const config = {
  database: {
    // SQLite (default for development)
    type: 'sqlite',
    database: './data/titan_grove.db',
    
    // PostgreSQL configuration
    // type: 'postgresql',
    // host: 'localhost',
    // port: 5432,
    // database: 'titan_grove',
    // username: 'postgres',
    // password: 'password',
    // ssl: false,
    
    // MySQL configuration
    // type: 'mysql',
    // host: 'localhost',
    // port: 3306,
    // database: 'titan_grove',
    // username: 'root',
    // password: 'password',
    
    // MongoDB configuration
    // type: 'mongodb',
    // host: 'localhost',
    // port: 27017,
    // database: 'titan_grove',
    
    // Connection pool settings
    pool: {
      min: 2,
      max: 10,
      idleTimeout: 30000,
    },
    
    // Migration settings
    migrations: {
      directory: './migrations',
      tableName: 'migrations',
    },
  },

  server: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    host: 'localhost',
    
    // CORS settings
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true,
    },
    
    // Rate limiting
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // requests per window
    },
    
    // Security settings
    security: {
      helmet: true,
      jwt: {
        secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
        expiresIn: '1h',
      },
    },
    
    // Enable compression
    compression: true,
  },

  // Optional: Cache configuration
  cache: {
    type: 'memory', // 'memory', 'redis'
    
    // Redis configuration
    // type: 'redis',
    // host: 'localhost',
    // port: 6379,
    
    ttl: 300, // 5 minutes default TTL
    maxKeys: 1000,
  },

  // Optional: Analytics configuration
  analytics: {
    enabled: false,
    
    // Elasticsearch configuration
    // elasticsearch: {
    //   host: 'localhost',
    //   port: 9200,
    //   index: 'titan-analytics',
    // },
    
    metrics: {
      enabled: true,
      interval: 60000, // 1 minute
    },
  },

  // Optional: Cluster configuration
  cluster: {
    enabled: false,
    workers: require('os').cpus().length,
    gracefulTimeout: 5000,
  },

  // Logging configuration
  logging: {
    level: 'info', // 'error', 'warn', 'info', 'debug'
    format: 'simple', // 'simple', 'json'
  },
};

module.exports = config;