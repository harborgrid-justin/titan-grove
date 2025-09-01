/**
 * Service Command Center Module
 * Centralized service operations hub for Fortune 100 Oracle EBS competitive implementation
 * 
 * Provides unified command and control for all service operations:
 * - Real-time service operations dashboard
 * - Centralized resource management
 * - Service analytics and KPIs
 * - Mobile command center
 * - Service workflow automation
 */

export * from './business-logic/service-command-center-service';
export * from './business-logic/service-dashboard-service';
export * from './business-logic/service-analytics-service';
export * from './business-logic/mobile-command-service';
export * from './types';

// Main service exports
export {
  ServiceCommandCenterService,
  serviceCommandCenterService,
  createServiceCommandCenterService
} from './business-logic/service-command-center-service';

export {
  ServiceDashboardService,
  serviceDashboardService
} from './business-logic/service-dashboard-service';

export {
  ServiceAnalyticsService,
  serviceAnalyticsService
} from './business-logic/service-analytics-service';

export {
  MobileCommandService,
  mobileCommandService
} from './business-logic/mobile-command-service';

// API router export
export { default as serviceCommandCenterAPI } from './api';