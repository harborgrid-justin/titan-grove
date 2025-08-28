/**
 * Titan Grove - Basic Usage Example
 * This example shows how to create and start a basic Titan Grove instance
 */

import { TitanGrove } from '../src/index';

async function main() {
  try {
    // Create a basic configuration
    const config = {
      database: {
        type: 'sqlite' as const,
        database: './example.db',
      },
      server: {
        port: 3001,
        host: 'localhost',
        security: {
          jwt: {
            secret: 'example-secret-key',
          },
        },
      },
      logging: {
        level: 'info' as const,
      },
    };

    console.log('🚀 Creating Titan Grove instance...');
    
    // Create the Titan Grove instance
    const titan = new TitanGrove(config);

    // Set up event listeners
    titan.on('started', () => {
      console.log('✅ Titan Grove started successfully!');
      console.log(`🌐 Server running at: http://${config.server.host}:${config.server.port}`);
      console.log('📊 Available endpoints:');
      console.log(`   • Health: http://${config.server.host}:${config.server.port}/health`);
      console.log(`   • API Info: http://${config.server.host}:${config.server.port}/api/info`);
      console.log(`   • Database Query: POST http://${config.server.host}:${config.server.port}/api/database/query`);
    });

    titan.on('error', (error) => {
      console.error('❌ Titan Grove error:', error);
    });

    // Handle shutdown gracefully
    const shutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
      try {
        await titan.stop();
        console.log('✅ Shutdown complete');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    // Start the platform
    await titan.start();

    console.log('\n📚 Try these commands in another terminal:');
    console.log(`curl http://${config.server.host}:${config.server.port}/health`);
    console.log(`curl http://${config.server.host}:${config.server.port}/api/info`);
    console.log(`curl -X POST http://${config.server.host}:${config.server.port}/api/database/query \\`);
    console.log(`  -H "Content-Type: application/json" \\`);
    console.log(`  -d '{"sql": "SELECT 'Hello from Titan Grove!' as message"}'`);

  } catch (error) {
    console.error('❌ Failed to start Titan Grove:', error);
    process.exit(1);
  }
}

// Run the example
if (require.main === module) {
  main();
}