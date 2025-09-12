import 'dotenv/config';
import { TitanGrove } from './business-suite';
import { loadConfig, loadExtendedConfig } from './utils/config';

async function main() {
  try {
    // Load configuration - adapted for Business Suite
    const legacyConfig = loadConfig();

    // Transform legacy config to business suite config
    const businessConfig = {
      database: {
        ...legacyConfig.database,
        type:
          legacyConfig.database?.type === 'redis'
            ? 'sqlite'
            : legacyConfig.database?.type || 'sqlite',
      },
      server: legacyConfig.server,
      modules: {
        financial: true,
        hr: true,
        crm: true,
        scm: true,
        project: true,
        bi: true,
      },
      multiTenant: { enabled: false },
      auditLogging: { enabled: true, level: 'basic' as const },
    };

    // Create Titan Grove Business Suite instance
    const titan = new TitanGrove(businessConfig);

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

    // Start the Business Suite
    await titan.start();

    console.log(`🏢 Titan Grove Enterprise Business Suite v1.0.0 started successfully!`);
    console.log(`📊 Database: ${businessConfig.database?.type || 'sqlite'}`);
    console.log(
      `🌐 Server: http://${businessConfig.server?.host || 'localhost'}:${businessConfig.server?.port || 3000}`
    );
    console.log(`📦 Business Modules: Financial, HR, CRM, SCM, Project, BI`);
    console.log(`🎯 Oracle EBS 12 Competitor - Enterprise Business Suite Ready!`);
  } catch (error) {
    console.error('Failed to start Titan Grove Business Suite:', error);
    process.exit(1);
  }
}

// Only run if this is the main module
if (require.main === module) {
  main();
}

// Export the Business Suite and all modules - following tree-shaking best practices
export { TitanGrove } from './business-suite';
export * from './business-suite';
export * from './types';

// Re-export core functionality
export * from './core';
export * from './shared';
