#!/usr/bin/env ts-node

/**
 * Database Setup and Seeding Script
 * 
 * This script initializes the database connection, creates tables, and seeds initial data.
 * Usage: npx ts-node scripts/setup-database.ts
 */

import * as dotenv from 'dotenv';
import { DatabaseManager } from '../src/database/DatabaseManager';
import { getLogger } from '../src/utils/enterprise-logger';

// Load environment variables
dotenv.config();

const logger = getLogger('database-setup');

async function setupDatabase() {
  logger.info('Starting database setup...');

  const config = {
    type: process.env.DB_TYPE || 'postgresql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'titan_grove',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    url: process.env.DATABASE_URL,
  };

  logger.info('Database configuration:', {
    type: config.type,
    host: config.host,
    port: config.port,
    database: config.database,
    username: config.username,
  });

  const dbManager = new DatabaseManager(config as any, logger as any);

  try {
    // Initialize database connection
    logger.info('Initializing database connection...');
    await dbManager.initialize();
    logger.info('✅ Database connection established successfully');

    // Test the connection
    logger.info('Testing database connection...');
    const healthCheck = await dbManager.healthCheck();
    logger.info('Health check result:', healthCheck);

    // Run migrations (create tables)
    logger.info('Running database migrations...');
    await dbManager.migrate();
    logger.info('✅ Database migrations completed');

    // Seed the database
    logger.info('Seeding database with initial data...');
    await dbManager.seed();
    logger.info('✅ Database seeding completed successfully');

    // Verify data
    logger.info('Verifying seeded data...');
    const usersResult = await dbManager.query('SELECT COUNT(*) as count FROM users');
    const customersResult = await dbManager.query('SELECT COUNT(*) as count FROM customers');
    const productsResult = await dbManager.query('SELECT COUNT(*) as count FROM products');
    const ordersResult = await dbManager.query('SELECT COUNT(*) as count FROM orders');

    logger.info('Data verification:', {
      users: usersResult.data[0]?.count || 0,
      customers: customersResult.data[0]?.count || 0,
      products: productsResult.data[0]?.count || 0,
      orders: ordersResult.data[0]?.count || 0,
    });

    // Get sample user data
    logger.info('Fetching sample user data...');
    const users = await dbManager.query('SELECT username, email, role, system FROM users LIMIT 5');
    logger.info('Sample users:', users.data);

    logger.info('');
    logger.info('========================================');
    logger.info('✅ Database setup completed successfully!');
    logger.info('========================================');
    logger.info('');
    logger.info('Test credentials:');
    logger.info('  Admin Login:');
    logger.info('    Username: admin');
    logger.info('    Password: admin123');
    logger.info('');
    logger.info('  Enterprise Login:');
    logger.info('    Username: enterprise');
    logger.info('    Password: enterprise123');
    logger.info('');
    logger.info('  Test User Login:');
    logger.info('    Username: testuser');
    logger.info('    Password: test123');
    logger.info('========================================');

    await dbManager.stop();
    process.exit(0);
  } catch (error) {
    logger.error('Database setup failed:', error as Error);
    await dbManager.stop();
    process.exit(1);
  }
}

// Run the setup
setupDatabase().catch((error) => {
  logger.error('Unhandled error during database setup:', error);
  process.exit(1);
});
