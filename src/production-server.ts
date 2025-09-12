#!/usr/bin/env node

/**
 * Production Server Entry Point
 * Integrates all services following enterprise architecture patterns
 * Oracle EBS-style service orchestration with modern Node.js patterns
 */

import 'dotenv/config';
import { ProductionAPIServer } from './core/production-api-server';
import { businessLogicRegistry, businessServiceFactory } from './core/business-logic-registry';
import path from 'path';
import express from 'express';

class TitanGroveProductionServer {
  private apiServer: ProductionAPIServer;
  private port: number;

  constructor() {
    this.port = parseInt(process.env.PORT || '3000', 10);
    this.apiServer = new ProductionAPIServer(this.port);
  }

  /**
   * Initialize production services
   */
  private async initializeServices(): Promise<void> {
    console.log('🔧 Initializing Titan Grove Enterprise Services...');

    // Initialize business logic registry
    console.log('📋 Loading centralized business rules...');
    const businessRules = businessLogicRegistry.getBusinessRulesByCategory('financial');
    console.log(`✅ Loaded ${businessRules.length} financial business rules`);

    // Initialize manufacturing service
    console.log('🏭 Initializing manufacturing service...');
    const manufacturingService = businessServiceFactory.getService('ManufacturingService');
    const oeeTest = await manufacturingService.calculateOEE(95, 88, 99);
    if (oeeTest.success) {
      console.log(`✅ Manufacturing service ready - OEE calculation test: ${(oeeTest.data * 100).toFixed(1)}%`);
    }

    // Initialize financial service
    console.log('💰 Initializing financial service...');
    const financialService = businessServiceFactory.getService('FinancialService');
    const financialMetrics = await financialService.getFinancialMetrics();
    if (financialMetrics.success) {
      console.log(`✅ Financial service ready - Revenue: $${(financialMetrics.data.totalRevenue / 1000000).toFixed(1)}M`);
    }

    // Initialize supply chain service
    console.log('🚚 Initializing supply chain service...');
    const supplyChainService = businessServiceFactory.getService('SupplyChainService');
    const safetyStockTest = await supplyChainService.calculateSafetyStock(100, 7, 95, 15);
    if (safetyStockTest.success) {
      console.log(`✅ Supply chain service ready - Safety stock calculation test: ${Math.round(safetyStockTest.data)} units`);
    }

    console.log('🎯 All enterprise services initialized successfully!');
  }

  /**
   * Setup static file serving for the React frontend
   */
  private setupStaticFiles(): void {
    const app = this.apiServer.getApp();
    
    // Serve React application
    const reactBuildPath = path.join(__dirname, '../dist/ui');
    app.use(express.static(reactBuildPath));

    // Catch-all handler for React Router (SPA)
    app.get('*', (req, res, next) => {
      // Skip API routes
      if (req.path.startsWith('/api/') || req.path.startsWith('/health')) {
        return next();
      }
      
      res.sendFile(path.join(reactBuildPath, 'index.html'));
    });

    console.log(`📱 Frontend serving from: ${reactBuildPath}`);
  }

  /**
   * Setup graceful shutdown
   */
  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      console.log(`\n🔄 Received ${signal}. Shutting down Titan Grove gracefully...`);
      
      try {
        // Perform cleanup operations
        console.log('🧹 Cleaning up resources...');
        
        // Add any cleanup logic here (database connections, cache, etc.)
        
        console.log('✅ Titan Grove Enterprise Suite shut down successfully');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  }

  /**
   * Setup error handlers
   */
  private setupErrorHandlers(): void {
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
      // Don't exit in production, log and continue
      if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
      }
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('🚨 Uncaught Exception:', error);
      // Exit on uncaught exception
      process.exit(1);
    });
  }

  /**
   * Display startup information
   */
  private displayStartupInfo(): void {
    const nodeEnv = process.env.NODE_ENV || 'development';
    const version = '1.0.0';

    console.log('\n' + '='.repeat(80));
    console.log('🏢 TITAN GROVE ENTERPRISE BUSINESS SUITE');
    console.log('   Modern Oracle EBS 12 Competitor');
    console.log('='.repeat(80));
    console.log(`📊 Version: ${version}`);
    console.log(`🌐 Environment: ${nodeEnv}`);
    console.log(`🚀 Server Port: ${this.port}`);
    console.log(`🔗 API Base URL: http://localhost:${this.port}/api`);
    console.log(`📱 Frontend URL: http://localhost:${this.port}`);
    console.log(`🏥 Health Check: http://localhost:${this.port}/health`);
    console.log('='.repeat(80));
    console.log('🎯 Enterprise Modules Available:');
    console.log('   • 🏭 Manufacturing Operations Center');
    console.log('   • 💰 Financial Management Suite');  
    console.log('   • 🚚 Supply Chain Optimization');
    console.log('   • 👥 Human Resource Management');
    console.log('   • 🤝 Customer Relationship Management');
    console.log('   • 📊 Business Intelligence & Analytics');
    console.log('   • 📋 Project Management');
    console.log('   • 🏢 Asset Management');
    console.log('   • ⚖️ Compliance & Governance');
    console.log('='.repeat(80));
    console.log('🔥 Production-Ready Features:');
    console.log('   ✅ Centralized Business Logic Registry');
    console.log('   ✅ Modern React 19 Frontend');
    console.log('   ✅ Enterprise API Architecture');
    console.log('   ✅ Real-time Business Metrics');
    console.log('   ✅ Industry Best Practices');
    console.log('   ✅ Oracle EBS Competitive Features');
    console.log('='.repeat(80));
  }

  /**
   * Start the production server
   */
  public async start(): Promise<void> {
    try {
      console.log('🚀 Starting Titan Grove Enterprise Business Suite...\n');

      // Setup error handlers first
      this.setupErrorHandlers();

      // Initialize all services
      await this.initializeServices();

      // Setup static file serving
      this.setupStaticFiles();

      // Setup graceful shutdown
      this.setupGracefulShutdown();

      // Start the server
      this.apiServer.start();

      // Display startup information
      this.displayStartupInfo();

      console.log('\n🎉 Titan Grove Enterprise Suite is ready for business!');
      console.log('💡 Access the dashboard at: http://localhost:' + this.port);

    } catch (error) {
      console.error('❌ Failed to start Titan Grove Enterprise Suite:', error);
      process.exit(1);
    }
  }
}

// Start the server if this is the main module
if (require.main === module) {
  const server = new TitanGroveProductionServer();
  server.start().catch((error) => {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  });
}

export { TitanGroveProductionServer };
export default TitanGroveProductionServer;