import { Sequelize, Options } from 'sequelize';

/**
 * Database Configuration for User Service using Sequelize
 * Supports PostgreSQL, MySQL, and SQLite
 */
export interface DatabaseConfig {
  dialect: 'postgres' | 'mysql' | 'sqlite';
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  storage?: string; // For SQLite
  logging?: boolean | ((sql: string) => void);
  pool?: {
    max?: number;
    min?: number;
    acquire?: number;
    idle?: number;
  };
}

// Default configuration from environment variables
const defaultConfig: DatabaseConfig = {
  dialect: (process.env.DB_DIALECT as 'postgres' | 'mysql' | 'sqlite') || 'sqlite',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'user_service',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  storage: process.env.DB_STORAGE || ':memory:', // For SQLite
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

/**
 * Create and configure Sequelize instance
 */
export function createSequelizeInstance(customConfig?: Partial<DatabaseConfig>): Sequelize {
  const config = { ...defaultConfig, ...customConfig };

  const sequelizeOptions: Options = {
    dialect: config.dialect,
    logging: config.logging,
    pool: config.pool,
  };

  let sequelize: Sequelize;

  if (config.dialect === 'sqlite') {
    sequelize = new Sequelize({
      ...sequelizeOptions,
      storage: config.storage,
    });
  } else {
    sequelize = new Sequelize(
      config.database!,
      config.username!,
      config.password!,
      {
        ...sequelizeOptions,
        host: config.host,
        port: config.port,
      }
    );
  }

  return sequelize;
}

// Export a default instance
export const sequelize = createSequelizeInstance();

// Export configuration for use in other modules
export const config = defaultConfig;