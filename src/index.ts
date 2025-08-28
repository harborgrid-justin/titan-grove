import 'dotenv/config';
import { TitanGrove } from './core/TitanGrove';
import { loadConfig } from './utils/config';

async function main() {
  try {
    // Load configuration
    const config = loadConfig();

    // Create TitanGrove instance
    const titan = new TitanGrove(config);

    // Set up graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      try {
        await titan.stop();
        process.exit(0);
      } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });

    // Start the platform
    await titan.start();

    console.log(`🚀 Titan Grove v${titan.version} started successfully!`);
    console.log(`📊 Database: ${config.database.type}`);
    console.log(`🌐 Server: http://${config.server.host}:${config.server.port}`);
    if (config.cache) {
      console.log(`💾 Cache: ${config.cache.type}`);
    }
    if (config.analytics?.enabled) {
      console.log(`📈 Analytics: enabled`);
    }
    if (config.cluster?.enabled) {
      console.log(`⚡ Cluster: ${config.cluster.workers || 'auto'} workers`);
    }
  } catch (error) {
    console.error('Failed to start Titan Grove:', error);
    process.exit(1);
  }
}

// Only run if this is the main module
if (require.main === module) {
  main();
}

export { TitanGrove } from './core/TitanGrove';
export * from './types';
