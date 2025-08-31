/**
 * BI Module Data Access Layer
 * Repositories for BI entities
 */

import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';
import { generateId } from '../../../shared/utils/id-generator';
import type {
  Dashboard,
  Widget,
  DataSource,
  Report,
  ReportSchedule,
  KPI,
  AnalyticsMetric
} from '../types';

/**
 * Dashboard Repository
 */
export class DashboardRepository extends BaseRepositoryImpl<Dashboard> {
  protected generateId(): string {
    return generateId('dashboard');
  }
}

/**
 * Widget Repository
 */
export class WidgetRepository extends BaseRepositoryImpl<Widget> {
  protected generateId(): string {
    return generateId('widget');
  }
}

/**
 * Data Source Repository
 */
export class DataSourceRepository extends BaseRepositoryImpl<DataSource> {
  protected generateId(): string {
    return generateId('datasource');
  }
}

/**
 * Report Repository
 */
export class ReportRepository extends BaseRepositoryImpl<Report> {
  protected generateId(): string {
    return generateId('report');
  }
}

/**
 * KPI Repository
 */
export class KPIRepository extends BaseRepositoryImpl<KPI> {
  protected generateId(): string {
    return generateId('kpi');
  }
}

// Export singleton instances
export const dashboardRepository = new DashboardRepository();
export const widgetRepository = new WidgetRepository();
export const dataSourceRepository = new DataSourceRepository();
export const reportRepository = new ReportRepository();
export const kpiRepository = new KPIRepository();