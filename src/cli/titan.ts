#!/usr/bin/env node

async function main() {
  const { Command } = await import('commander');
  const chalk = (await import('chalk')).default;

  const program = new Command();

  program
    .name('titan')
    .description('Titan Grove - Enterprise-grade Node.js database and application platform')
    .version('1.0.0');

  // Server management commands
  const serverCommand = program.command('server').description('Server management commands');

  serverCommand
    .command('start')
    .description('Start the Titan Grove server')
    .option('-c, --config <path>', 'Configuration file path')
    .option('-p, --port <port>', 'Server port', '3000')
    .option('--cluster', 'Enable cluster mode')
    .action(async (options) => {
      console.log(chalk.blue('🚀 Starting Titan Grove server...'));

      try {
        const { dynamicImport } = await import('../shared/utils/async-pattern-converter');
        
        const TitanGroveModule = await dynamicImport('../dist/index.js');
        const configModule = await dynamicImport('../dist/utils/config.js');
        
        const TitanGrove = TitanGroveModule.TitanGrove || TitanGroveModule.default?.TitanGrove;
        const loadConfig = configModule.loadConfig || configModule.default?.loadConfig;

        const config = loadConfig();
        if (options.port) {
          config.server.port = parseInt(options.port, 10);
        }
        if (options.cluster) {
          config.cluster = { enabled: true };
        }

        const titan = new TitanGrove(config);
        await titan.start();

        console.log(chalk.green('✅ Server started successfully!'));
      } catch (error) {
        console.error(chalk.red('❌ Failed to start server:'), (error as Error).message);
        process.exit(1);
      }
    });

  serverCommand
    .command('stop')
    .description('Stop the Titan Grove server')
    .action(() => {
      console.log(chalk.yellow('🛑 Stopping server...'));
      // TODO: Implement server stop logic
    });

  serverCommand
    .command('status')
    .description('Check server status')
    .action(async () => {
      console.log(chalk.blue('📊 Checking server status...'));

      try {
        const response = await fetch('http://localhost:3000/health');
        const health = await response.json();

        console.log(chalk.green('✅ Server is healthy'));
        console.log(JSON.stringify(health, null, 2));
      } catch (error) {
        console.error('Operation failed:', error);
        console.log(chalk.red('❌ Server is not responding'));
      }
    });

  // Info command
  program
    .command('info')
    .description('Show Titan Grove information')
    .action(() => {
      console.log(chalk.blue('📋 Titan Grove Information'));
      console.log(`Version: ${chalk.green('1.0.0')}`);
      console.log(
        `Description: ${chalk.white('Enterprise-grade Node.js database and application platform')}`
      );
      console.log(`Repository: ${chalk.cyan('https://github.com/harborgrid-justin/titan-grove')}`);
    });

  // Health check command
  program
    .command('health')
    .description('Check system health')
    .action(async () => {
      console.log(chalk.blue('🏥 Running health checks...'));

      try {
        const response = await fetch('http://localhost:3000/health');
        const health = (await response.json()) as any;

        if (health.success) {
          console.log(chalk.green('✅ All systems healthy'));
        } else {
          console.log(chalk.yellow('⚠️  Some systems degraded'));
        }

        health.data.forEach((check: any) => {
          const status =
            check.status === 'healthy'
              ? chalk.green('✅')
              : check.status === 'degraded'
                ? chalk.yellow('⚠️')
                : chalk.red('❌');
          console.log(`${status} ${check.service}: ${check.status}`);
        });
      } catch (error) {
        console.error(chalk.red('❌ Health check failed:'), (error as Error).message);
      }
    });

  program.parse(process.argv);
}

main().catch(console.error);
