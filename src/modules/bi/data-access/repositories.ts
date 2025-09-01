import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';

export class ReportRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class DashboardRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `dashboard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const reportRepository = new ReportRepository();
export const dashboardRepository = new DashboardRepository();
