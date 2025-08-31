/**
 * Capital Asset Management Module
 * Fortune 100 grade capital asset tracking, investment analysis, and ROI management
 * 
 * Provides comprehensive capital asset management capabilities including:
 * - Capital investment tracking and approval workflows
 * - ROI analysis and performance measurement
 * - Capital planning and budgeting
 * - Asset acquisition lifecycle management
 * - Investment portfolio optimization
 * - Capital expenditure reporting and analytics
 */

export * from './business-logic/capital-asset-service';
export * from './types';

// Core capital asset management functionality
export { CapitalAssetService, capitalAssetService } from './business-logic/capital-asset-service';

// Types
export type {
  CapitalAsset,
  CapitalInvestment,
  InvestmentProposal,
  ROIAnalysis,
  CapitalBudget,
  CapitalExpenditure,
  InvestmentPortfolio,
  CapitalAssetPerformance,
  ApprovalWorkflow,
  InvestmentMetrics,
  CapitalPlan,
  AssetAcquisition
} from './types';