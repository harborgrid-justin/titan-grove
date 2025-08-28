import { Logger } from 'winston';
import cluster from 'cluster';
import { ClusterConfig } from '../types';

export class ClusterManager {
  private config: ClusterConfig;
  private logger: Logger;

  constructor(config: ClusterConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
  }

  async start(workerFunction: () => Promise<void>): Promise<void> {
    if (cluster.isPrimary) {
      const numWorkers = this.config.workers || require('os').cpus().length;
      this.logger.info(`Starting ${numWorkers} worker processes`);

      // Fork workers
      for (let i = 0; i < numWorkers; i++) {
        cluster.fork();
      }

      // Handle worker events
      cluster.on('exit', (worker, code, signal) => {
        this.logger.warn(`Worker ${worker.process.pid} died (${signal || code}). Restarting...`);
        cluster.fork();
      });

      cluster.on('listening', (worker, address) => {
        this.logger.info(
          `Worker ${worker.process.pid} listening on ${address.address}:${address.port}`
        );
      });
    } else {
      // Worker process - start the application
      await workerFunction();
    }
  }

  async stop(): Promise<void> {
    if (cluster.isPrimary) {
      this.logger.info('Shutting down cluster');

      // Graceful shutdown of workers
      for (const id in cluster.workers) {
        const worker = cluster.workers[id];
        if (worker) {
          worker.kill('SIGTERM');
        }
      }

      // Wait for graceful timeout
      await new Promise((resolve) => {
        setTimeout(resolve, this.config.gracefulTimeout || 5000);
      });

      process.exit(0);
    }
  }
}
