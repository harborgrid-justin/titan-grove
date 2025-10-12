/**
 * Models Index
 * Exports all Sequelize models for the User Service
 */

import { sequelize } from '../config/database';
import User from './User.model';

// Export models
export { User };

// Export sequelize instance
export { sequelize };

/**
 * Initialize all models and their associations
 */
export async function initializeModels(): Promise<void> {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync all models (in production, use migrations instead)
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: false });
      console.log('Database models synchronized.');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  await sequelize.close();
  console.log('Database connection closed.');
}
