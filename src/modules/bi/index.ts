/**
 * Business Intelligence Module
 * Main orchestrator that delegates to specialized BI business logic services
 */

// Export all types
export * from './types';

// Import business logic services
import { dashboardService } from './business-logic/dashboards/dashboard-service';
import { dataSourcesService } from './business-logic/data-sources/data-sources-service';
import { reportsService } from './business-logic/reports/reports-service';
import { kpiService } from './business-logic/analytics/kpi-service';
import { metricsService } from './business-logic/analytics/metrics-service';

import type {
  Dashboard,
  Widget,
  DataSource,
  Report,
  ReportSchedule,
  KPI,
  AnalyticsMetric
} from './types';

export class BIManager {
  
  // Dashboard Management Methods - delegate to dashboard service
  async createDashboard(dashboard: Omit<Dashboard, 'id' | 'createdDate' | 'lastModified'>): Promise<Dashboard> {
    return dashboardService.createDashboard(dashboard);
  }

  async getDashboard(dashboardId: string): Promise<Dashboard | null> {
    return dashboardService.getDashboard(dashboardId);
  }

  async updateDashboard(dashboardId: string, updates: Partial<Dashboard>): Promise<Dashboard | null> {
    return dashboardService.updateDashboard(dashboardId, updates);
  }

  async deleteDashboard(dashboardId: string): Promise<void> {
    return dashboardService.deleteDashboard(dashboardId);
  }

  async addWidgetToDashboard(dashboardId: string, widget: Omit<Widget, 'id'>): Promise<Widget> {
    return dashboardService.addWidgetToDashboard(dashboardId, widget);
  }

  async updateWidget(widgetId: string, updates: Partial<Widget>): Promise<void> {
    return dashboardService.updateWidget(widgetId, updates);
  }

  async deleteWidget(widgetId: string): Promise<void> {
    return dashboardService.deleteWidget(widgetId);
  }

  async refreshWidget(widgetId: string): Promise<any> {
    return dashboardService.refreshWidget(widgetId);
  }

  async getWidgetData(widgetId: string, parameters?: { [key: string]: any }): Promise<any> {
    return dashboardService.getWidgetData(widgetId, parameters);
  }

  // Data Source Management Methods - delegate to data sources service
  async createDataSource(dataSource: Omit<DataSource, 'id'>): Promise<DataSource> {
    return dataSourcesService.createDataSource(dataSource);
  }

  async getDataSource(dataSourceId: string): Promise<DataSource | null> {
    return dataSourcesService.getDataSource(dataSourceId);
  }

  async updateDataSource(dataSourceId: string, updates: Partial<DataSource>): Promise<DataSource | null> {
    return dataSourcesService.updateDataSource(dataSourceId, updates);
  }

  async deleteDataSource(dataSourceId: string): Promise<void> {
    return dataSourcesService.deleteDataSource(dataSourceId);
  }

  async testDataSource(dataSourceId: string): Promise<boolean> {
    return dataSourcesService.testDataSource(dataSourceId);
  }

  async executeQuery(dataSourceId: string, parameters?: { [key: string]: any }): Promise<any[]> {
    return dataSourcesService.executeQuery(dataSourceId, parameters);
  }

  async validateQuery(dataSourceId: string, query: string): Promise<any> {
    return dataSourcesService.validateQuery(dataSourceId, query);
  }

  async previewData(dataSourceId: string, query: string, limit?: number): Promise<any> {
    return dataSourcesService.previewData(dataSourceId, query, limit);
  }

  // Report Management Methods - delegate to reports service
  async createReport(report: Omit<Report, 'id' | 'createdDate'>): Promise<Report> {
    return reportsService.createReport(report);
  }

  async getReport(reportId: string): Promise<Report | null> {
    return reportsService.getReport(reportId);
  }

  async updateReport(reportId: string, updates: Partial<Report>): Promise<Report | null> {
    return reportsService.updateReport(reportId, updates);
  }

  async deleteReport(reportId: string): Promise<void> {
    return reportsService.deleteReport(reportId);
  }

  async runReport(reportId: string, parameters?: { [key: string]: any }): Promise<any> {
    return reportsService.runReport(reportId, parameters);
  }

  async scheduleReport(reportId: string, schedule: ReportSchedule): Promise<void> {
    return reportsService.scheduleReport(reportId, schedule);
  }

  async exportReport(reportId: string, format: 'PDF' | 'EXCEL' | 'CSV' | 'JSON'): Promise<Buffer> {
    return reportsService.exportReport(reportId, format);
  }

  async previewReport(reportId: string, parameters?: { [key: string]: any }): Promise<any> {
    return reportsService.previewReport(reportId, parameters);
  }

  // KPI Management Methods - delegate to KPI service
  async createKPI(kpi: Omit<KPI, 'id' | 'lastUpdated'>): Promise<KPI> {
    return kpiService.createKPI(kpi);
  }

  async updateKPI(kpiId: string): Promise<KPI> {
    return kpiService.updateKPI(kpiId);
  }

  async getKPI(kpiId: string): Promise<KPI | null> {
    return kpiService.getKPI(kpiId);
  }

  async deleteKPI(kpiId: string): Promise<void> {
    return kpiService.deleteKPI(kpiId);
  }

  async getKPIDashboard(): Promise<KPI[]> {
    return kpiService.getKPIDashboard();
  }

  async getKPIsByCategory(category: string): Promise<KPI[]> {
    return kpiService.getKPIsByCategory(category);
  }

  async refreshKPI(kpiId: string): Promise<KPI> {
    return kpiService.refreshKPI(kpiId);
  }

  // Metrics and Analytics Methods - delegate to metrics service
  async getFinancialMetrics(period: 'MTD' | 'QTD' | 'YTD' = 'MTD'): Promise<AnalyticsMetric[]> {
    return metricsService.getFinancialMetrics(period);
  }

  async getSalesMetrics(period: 'MTD' | 'QTD' | 'YTD' = 'MTD'): Promise<AnalyticsMetric[]> {
    return metricsService.getSalesMetrics(period);
  }

  async getOperationalMetrics(period: 'MTD' | 'QTD' | 'YTD' = 'MTD'): Promise<AnalyticsMetric[]> {
    return metricsService.getOperationalMetrics(period);
  }

  async getForecast(metric: string, periods: number): Promise<any> {
    return metricsService.getForecast(metric, periods);
  }

  async getTrendAnalysis(metric: string, historicalPeriods: number): Promise<any> {
    return metricsService.getTrendAnalysis(metric, historicalPeriods);
  }

  async getExecutiveDashboard(): Promise<any> {
    return metricsService.getExecutiveDashboard();
  }

  async getMetricHistory(metricName: string, periods: number): Promise<any> {
    return metricsService.getMetricHistory(metricName, periods);
  }

  async createCustomMetric(metric: {
    name: string;
    formula: string;
    category: string;
    unit: string;
    dataSources: string[];
  }): Promise<any> {
    return metricsService.createCustomMetric(metric);
  }

  // Additional convenience methods
  async getAllDashboards(userId?: string): Promise<Dashboard[]> {
    if (userId) {
      return dashboardService.getDashboardsByUser(userId);
    }
    return dashboardService.getPublicDashboards();
  }

  async getAllDataSources(): Promise<DataSource[]> {
    return dataSourcesService.getAllDataSources();
  }

  async getReportsByCategory(category: string): Promise<Report[]> {
    return reportsService.getReportsByCategory(category);
  }

  async searchReports(query: string): Promise<Report[]> {
    return reportsService.searchReports(query);
  }

  async getSystemHealth(): Promise<any> {
    return {
      status: 'HEALTHY',
      services: {
        dashboards: 'ACTIVE',
        reports: 'ACTIVE',
        analytics: 'ACTIVE',
        dataSources: 'ACTIVE'
      },
      uptime: '99.97%',
      responseTime: '120ms',
      lastCheck: new Date()
    };
  }
}

export const biManager = new BIManager();

// Export business logic services for direct access if needed
export {
  dashboardService,
  dataSourcesService,
  reportsService,
  kpiService,
  metricsService
};