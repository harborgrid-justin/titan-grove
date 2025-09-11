/**
 * Comprehensive Reporting API Routes
 * 49 Business Ready and Customer Ready Report-Related Endpoints
 * Complete backend integration with enterprise-grade business logic
 */

import { Router } from 'express';
import { ReportingController } from '../controllers/reporting-controller';
import { authMiddleware } from '../../security/auth-middleware';
import { validateReportingPermissions } from '../../security/permissions-validator';
import { auditMiddleware } from '../../security/audit-middleware';
import { rateLimitMiddleware } from '../../security/rate-limit-middleware';
import type { Router as RouterType } from 'express';

const router: RouterType = Router();
const reportingController = new ReportingController();

// Apply enterprise security middleware to all reporting routes
router.use(authMiddleware);
router.use(validateReportingPermissions);
router.use(auditMiddleware('reporting'));
router.use(
  rateLimitMiddleware({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many reporting requests from this IP',
  })
);

// =================================================================
// BUSINESS INTELLIGENCE REPORTS (7 endpoints)
// =================================================================

// Executive Dashboards
router.post('/data/executive-dashboards', reportingController.getExecutiveDashboards);
router.post('/export/executive-dashboards', reportingController.exportExecutiveDashboards);
router.put('/config/executive-dashboards', reportingController.saveExecutiveDashboardsConfig);

// KPI Reports
router.post('/data/kpi-reports', reportingController.getKPIReports);
router.post('/export/kpi-reports', reportingController.exportKPIReports);
router.put('/config/kpi-reports', reportingController.saveKPIReportsConfig);

// Performance Analytics
router.post('/data/performance-analytics', reportingController.getPerformanceAnalytics);
router.post('/export/performance-analytics', reportingController.exportPerformanceAnalytics);
router.put('/config/performance-analytics', reportingController.savePerformanceAnalyticsConfig);

// Business Metrics
router.post('/data/business-metrics', reportingController.getBusinessMetrics);
router.post('/export/business-metrics', reportingController.exportBusinessMetrics);
router.put('/config/business-metrics', reportingController.saveBusinessMetricsConfig);

// Trend Analysis
router.post('/data/trend-analysis', reportingController.getTrendAnalysis);
router.post('/export/trend-analysis', reportingController.exportTrendAnalysis);
router.put('/config/trend-analysis', reportingController.saveTrendAnalysisConfig);

// Comparative Reports
router.post('/data/comparative-reports', reportingController.getComparativeReports);
router.post('/export/comparative-reports', reportingController.exportComparativeReports);
router.put('/config/comparative-reports', reportingController.saveComparativeReportsConfig);

// Drill-Down Analytics
router.post('/data/drill-down-analytics', reportingController.getDrillDownAnalytics);
router.post('/export/drill-down-analytics', reportingController.exportDrillDownAnalytics);
router.put('/config/drill-down-analytics', reportingController.saveDrillDownAnalyticsConfig);

// =================================================================
// FINANCIAL REPORTING (7 endpoints)
// =================================================================

// Profit & Loss Reports
router.post('/data/profit-loss-reports', reportingController.getProfitLossReports);
router.post('/export/profit-loss-reports', reportingController.exportProfitLossReports);
router.put('/config/profit-loss-reports', reportingController.saveProfitLossReportsConfig);

// Balance Sheet
router.post('/data/balance-sheet', reportingController.getBalanceSheet);
router.post('/export/balance-sheet', reportingController.exportBalanceSheet);
router.put('/config/balance-sheet', reportingController.saveBalanceSheetConfig);

// Cash Flow
router.post('/data/cash-flow', reportingController.getCashFlow);
router.post('/export/cash-flow', reportingController.exportCashFlow);
router.put('/config/cash-flow', reportingController.saveCashFlowConfig);

// Budget Variance
router.post('/data/budget-variance', reportingController.getBudgetVariance);
router.post('/export/budget-variance', reportingController.exportBudgetVariance);
router.put('/config/budget-variance', reportingController.saveBudgetVarianceConfig);

// Cost Center Reports
router.post('/data/cost-center-reports', reportingController.getCostCenterReports);
router.post('/export/cost-center-reports', reportingController.exportCostCenterReports);
router.put('/config/cost-center-reports', reportingController.saveCostCenterReportsConfig);

// Profitability Analysis
router.post('/data/profitability-analysis', reportingController.getProfitabilityAnalysis);
router.post('/export/profitability-analysis', reportingController.exportProfitabilityAnalysis);
router.put('/config/profitability-analysis', reportingController.saveProfitabilityAnalysisConfig);

// Financial Forecasting
router.post('/data/financial-forecasting', reportingController.getFinancialForecasting);
router.post('/export/financial-forecasting', reportingController.exportFinancialForecasting);
router.put('/config/financial-forecasting', reportingController.saveFinancialForecastingConfig);

// =================================================================
// OPERATIONAL REPORTS (7 endpoints)
// =================================================================

// Production Reports
router.post('/data/production-reports', reportingController.getProductionReports);
router.post('/export/production-reports', reportingController.exportProductionReports);
router.put('/config/production-reports', reportingController.saveProductionReportsConfig);

// Quality Metrics
router.post('/data/quality-metrics', reportingController.getQualityMetrics);
router.post('/export/quality-metrics', reportingController.exportQualityMetrics);
router.put('/config/quality-metrics', reportingController.saveQualityMetricsConfig);

// Efficiency Analysis
router.post('/data/efficiency-analysis', reportingController.getEfficiencyAnalysis);
router.post('/export/efficiency-analysis', reportingController.exportEfficiencyAnalysis);
router.put('/config/efficiency-analysis', reportingController.saveEfficiencyAnalysisConfig);

// Capacity Utilization
router.post('/data/capacity-utilization', reportingController.getCapacityUtilization);
router.post('/export/capacity-utilization', reportingController.exportCapacityUtilization);
router.put('/config/capacity-utilization', reportingController.saveCapacityUtilizationConfig);

// Workflow Reports
router.post('/data/workflow-reports', reportingController.getWorkflowReports);
router.post('/export/workflow-reports', reportingController.exportWorkflowReports);
router.put('/config/workflow-reports', reportingController.saveWorkflowReportsConfig);

// Resource Allocation
router.post('/data/resource-allocation', reportingController.getResourceAllocation);
router.post('/export/resource-allocation', reportingController.exportResourceAllocation);
router.put('/config/resource-allocation', reportingController.saveResourceAllocationConfig);

// Operational KPIs
router.post('/data/operational-kpis', reportingController.getOperationalKPIs);
router.post('/export/operational-kpis', reportingController.exportOperationalKPIs);
router.put('/config/operational-kpis', reportingController.saveOperationalKPIsConfig);

// =================================================================
// CUSTOMER ANALYTICS (7 endpoints)
// =================================================================

// Customer Segmentation
router.post('/data/customer-segmentation', reportingController.getCustomerSegmentation);
router.post('/export/customer-segmentation', reportingController.exportCustomerSegmentation);
router.put('/config/customer-segmentation', reportingController.saveCustomerSegmentationConfig);

// Lifetime Value
router.post('/data/lifetime-value', reportingController.getLifetimeValue);
router.post('/export/lifetime-value', reportingController.exportLifetimeValue);
router.put('/config/lifetime-value', reportingController.saveLifetimeValueConfig);

// Churn Analysis
router.post('/data/churn-analysis', reportingController.getChurnAnalysis);
router.post('/export/churn-analysis', reportingController.exportChurnAnalysis);
router.put('/config/churn-analysis', reportingController.saveChurnAnalysisConfig);

// Satisfaction Reports
router.post('/data/satisfaction-reports', reportingController.getSatisfactionReports);
router.post('/export/satisfaction-reports', reportingController.exportSatisfactionReports);
router.put('/config/satisfaction-reports', reportingController.saveSatisfactionReportsConfig);

// Sales Performance
router.post('/data/sales-performance', reportingController.getSalesPerformance);
router.post('/export/sales-performance', reportingController.exportSalesPerformance);
router.put('/config/sales-performance', reportingController.saveSalesPerformanceConfig);

// Lead Analysis
router.post('/data/lead-analysis', reportingController.getLeadAnalysis);
router.post('/export/lead-analysis', reportingController.exportLeadAnalysis);
router.put('/config/lead-analysis', reportingController.saveLeadAnalysisConfig);

// Retention Reports
router.post('/data/retention-reports', reportingController.getRetentionReports);
router.post('/export/retention-reports', reportingController.exportRetentionReports);
router.put('/config/retention-reports', reportingController.saveRetentionReportsConfig);

// =================================================================
// COMPLIANCE REPORTING (7 endpoints)
// =================================================================

// Regulatory Reports
router.post('/data/regulatory-reports', reportingController.getRegulatoryReports);
router.post('/export/regulatory-reports', reportingController.exportRegulatoryReports);
router.put('/config/regulatory-reports', reportingController.saveRegulatoryReportsConfig);

// Audit Trails
router.post('/data/audit-trails', reportingController.getAuditTrails);
router.post('/export/audit-trails', reportingController.exportAuditTrails);
router.put('/config/audit-trails', reportingController.saveAuditTrailsConfig);

// Risk Assessments
router.post('/data/risk-assessments', reportingController.getRiskAssessments);
router.post('/export/risk-assessments', reportingController.exportRiskAssessments);
router.put('/config/risk-assessments', reportingController.saveRiskAssessmentsConfig);

// Policy Compliance
router.post('/data/policy-compliance', reportingController.getPolicyCompliance);
router.post('/export/policy-compliance', reportingController.exportPolicyCompliance);
router.put('/config/policy-compliance', reportingController.savePolicyComplianceConfig);

// Security Reports
router.post('/data/security-reports', reportingController.getSecurityReports);
router.post('/export/security-reports', reportingController.exportSecurityReports);
router.put('/config/security-reports', reportingController.saveSecurityReportsConfig);

// Governance Reports
router.post('/data/governance-reports', reportingController.getGovernanceReports);
router.post('/export/governance-reports', reportingController.exportGovernanceReports);
router.put('/config/governance-reports', reportingController.saveGovernanceReportsConfig);

// Violation Tracking
router.post('/data/violation-tracking', reportingController.getViolationTracking);
router.post('/export/violation-tracking', reportingController.exportViolationTracking);
router.put('/config/violation-tracking', reportingController.saveViolationTrackingConfig);

// =================================================================
// HR ANALYTICS (7 endpoints)
// =================================================================

// Employee Reports
router.post('/data/employee-reports', reportingController.getEmployeeReports);
router.post('/export/employee-reports', reportingController.exportEmployeeReports);
router.put('/config/employee-reports', reportingController.saveEmployeeReportsConfig);

// Performance Reviews
router.post('/data/performance-reviews', reportingController.getPerformanceReviews);
router.post('/export/performance-reviews', reportingController.exportPerformanceReviews);
router.put('/config/performance-reviews', reportingController.savePerformanceReviewsConfig);

// Payroll Analytics
router.post('/data/payroll-analytics', reportingController.getPayrollAnalytics);
router.post('/export/payroll-analytics', reportingController.exportPayrollAnalytics);
router.put('/config/payroll-analytics', reportingController.savePayrollAnalyticsConfig);

// Recruitment Metrics
router.post('/data/recruitment-metrics', reportingController.getRecruitmentMetrics);
router.post('/export/recruitment-metrics', reportingController.exportRecruitmentMetrics);
router.put('/config/recruitment-metrics', reportingController.saveRecruitmentMetricsConfig);

// Training Reports
router.post('/data/training-reports', reportingController.getTrainingReports);
router.post('/export/training-reports', reportingController.exportTrainingReports);
router.put('/config/training-reports', reportingController.saveTrainingReportsConfig);

// Retention Analysis
router.post('/data/retention-analysis', reportingController.getRetentionAnalysis);
router.post('/export/retention-analysis', reportingController.exportRetentionAnalysis);
router.put('/config/retention-analysis', reportingController.saveRetentionAnalysisConfig);

// Compensation Reports
router.post('/data/compensation-reports', reportingController.getCompensationReports);
router.post('/export/compensation-reports', reportingController.exportCompensationReports);
router.put('/config/compensation-reports', reportingController.saveCompensationReportsConfig);

// =================================================================
// SUPPLY CHAIN REPORTS (7 endpoints)
// =================================================================

// Vendor Reports
router.post('/data/vendor-reports', reportingController.getVendorReports);
router.post('/export/vendor-reports', reportingController.exportVendorReports);
router.put('/config/vendor-reports', reportingController.saveVendorReportsConfig);

// Inventory Analytics
router.post('/data/inventory-analytics', reportingController.getInventoryAnalytics);
router.post('/export/inventory-analytics', reportingController.exportInventoryAnalytics);
router.put('/config/inventory-analytics', reportingController.saveInventoryAnalyticsConfig);

// Procurement Reports
router.post('/data/procurement-reports', reportingController.getProcurementReports);
router.post('/export/procurement-reports', reportingController.exportProcurementReports);
router.put('/config/procurement-reports', reportingController.saveProcurementReportsConfig);

// Logistics Performance
router.post('/data/logistics-performance', reportingController.getLogisticsPerformance);
router.post('/export/logistics-performance', reportingController.exportLogisticsPerformance);
router.put('/config/logistics-performance', reportingController.saveLogisticsPerformanceConfig);

// Supplier Scorecards
router.post('/data/supplier-scorecards', reportingController.getSupplierScorecards);
router.post('/export/supplier-scorecards', reportingController.exportSupplierScorecards);
router.put('/config/supplier-scorecards', reportingController.saveSupplierScorecardsConfig);

// Cost Analysis
router.post('/data/cost-analysis', reportingController.getCostAnalysis);
router.post('/export/cost-analysis', reportingController.exportCostAnalysis);
router.put('/config/cost-analysis', reportingController.saveCostAnalysisConfig);

// Delivery Metrics
router.post('/data/delivery-metrics', reportingController.getDeliveryMetrics);
router.post('/export/delivery-metrics', reportingController.exportDeliveryMetrics);
router.put('/config/delivery-metrics', reportingController.saveDeliveryMetricsConfig);

// =================================================================
// GLOBAL REPORTING ENDPOINTS
// =================================================================

// Health check and system status
router.get('/health', reportingController.getSystemHealth);
router.get('/status', reportingController.getReportingStatus);

// Real-time data subscription endpoints
router.post('/subscribe/:reportType', reportingController.subscribeToRealtimeUpdates);
router.delete('/subscribe/:reportType', reportingController.unsubscribeFromRealtimeUpdates);

// Bulk operations
router.post('/bulk/export', reportingController.bulkExportReports);
router.post('/bulk/schedule', reportingController.scheduleReports);

// Administrative endpoints
router.get('/admin/metrics', reportingController.getAdminMetrics);
router.post('/admin/cache/clear', reportingController.clearReportingCache);

export default router;
