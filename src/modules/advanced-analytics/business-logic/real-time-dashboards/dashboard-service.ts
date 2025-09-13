/**
 * Real-Time Dashboard Service - Feature #2
 * Enterprise-grade real-time dashboards and KPI monitoring
 * Competes with Oracle EBS Dashboard and Business Intelligence
 */

import { DashboardConfig, DashboardWidget } from '../../types';

export class DashboardService {
  private dashboards: Map<string, DashboardConfig> = new Map();
  private activeConnections: Map<string, WebSocket[]> = new Map();

  constructor() {
    this.initializeDefaultDashboards();
  }

  /**
   * Create executive dashboard with real-time KPIs
   */
  async createExecutiveDashboard(config: Partial<DashboardConfig>): Promise<DashboardConfig> {
    const dashboard: DashboardConfig = {
      dashboard_id: this.generateId(),
      title: config.title || 'Executive Dashboard',
      refresh_interval: config.refresh_interval || 30000, // 30 seconds
      access_control: config.access_control || ['executives'],
      theme: config.theme || 'corporate',
      widgets: [
        {
          widget_id: 'revenue-kpi',
          type: 'kpi',
          title: 'Total Revenue',
          data_source: 'financial_db',
          query: 'SELECT SUM(revenue) FROM transactions WHERE date >= CURRENT_DATE - INTERVAL 30 DAY',
          visualization_config: {
            format: 'currency',
            target: 10000000,
            status_thresholds: { good: 9000000, warning: 7000000 }
          },
          size: { width: 300, height: 200 },
          position: { x: 0, y: 0 }
        },
        {
          widget_id: 'profit-margin',
          type: 'gauge',
          title: 'Profit Margin %',
          data_source: 'financial_db',
          query: 'SELECT (SUM(revenue) - SUM(costs)) / SUM(revenue) * 100 as margin FROM financial_summary',
          visualization_config: {
            min: 0,
            max: 50,
            thresholds: [
              { value: 35, color: 'green', label: 'Excellent' },
              { value: 25, color: 'yellow', label: 'Good' },
              { value: 15, color: 'red', label: 'Poor' }
            ]
          },
          size: { width: 300, height: 300 },
          position: { x: 320, y: 0 }
        },
        {
          widget_id: 'sales-pipeline',
          type: 'funnel',
          title: 'Sales Pipeline',
          data_source: 'crm_db',
          query: 'SELECT stage, COUNT(*) as count, SUM(value) as total_value FROM opportunities GROUP BY stage',
          visualization_config: {
            stages: ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won']
          },
          size: { width: 400, height: 300 },
          position: { x: 640, y: 0 }
        }
      ]
    };

    this.dashboards.set(dashboard.dashboard_id, dashboard);
    return dashboard;
  }

  /**
   * Create operational dashboard for real-time monitoring
   */
  async createOperationalDashboard(): Promise<DashboardConfig> {
    const dashboard: DashboardConfig = {
      dashboard_id: this.generateId(),
      title: 'Operational Dashboard',
      refresh_interval: 15000, // 15 seconds
      access_control: ['operations', 'managers'],
      theme: 'dark',
      widgets: [
        {
          widget_id: 'system-health',
          type: 'chart',
          title: 'System Performance',
          data_source: 'monitoring_db',
          query: 'SELECT timestamp, cpu_usage, memory_usage, response_time FROM system_metrics WHERE timestamp >= NOW() - INTERVAL 1 HOUR',
          visualization_config: {
            chart_type: 'line',
            metrics: ['CPU Usage %', 'Memory Usage %', 'Response Time ms'],
            colors: ['#ff6b6b', '#4ecdc4', '#45b7d1']
          },
          size: { width: 600, height: 300 },
          position: { x: 0, y: 0 }
        },
        {
          widget_id: 'order-processing',
          type: 'kpi',
          title: 'Orders Processed Today',
          data_source: 'orders_db',
          query: 'SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURRENT_DATE AND status = "processed"',
          visualization_config: {
            format: 'number',
            target: 1000,
            comparison: 'yesterday'
          },
          size: { width: 200, height: 150 },
          position: { x: 620, y: 0 }
        },
        {
          widget_id: 'inventory-alerts',
          type: 'table',
          title: 'Low Inventory Alerts',
          data_source: 'inventory_db',
          query: 'SELECT product_name, current_stock, reorder_level FROM inventory WHERE current_stock <= reorder_level',
          visualization_config: {
            columns: ['Product', 'Current Stock', 'Reorder Level'],
            alert_column: 'current_stock',
            alert_threshold: 'reorder_level'
          },
          size: { width: 400, height: 250 },
          position: { x: 0, y: 320 }
        }
      ]
    };

    this.dashboards.set(dashboard.dashboard_id, dashboard);
    return dashboard;
  }

  /**
   * Create manufacturing dashboard with real-time metrics
   */
  async createManufacturingDashboard(): Promise<DashboardConfig> {
    const dashboard: DashboardConfig = {
      dashboard_id: this.generateId(),
      title: 'Manufacturing Dashboard',
      refresh_interval: 10000, // 10 seconds
      access_control: ['manufacturing', 'plant_managers'],
      theme: 'light',
      widgets: [
        {
          widget_id: 'oee-gauge',
          type: 'gauge',
          title: 'Overall Equipment Effectiveness (OEE)',
          data_source: 'manufacturing_db',
          query: 'SELECT AVG(availability * performance * quality) as oee FROM equipment_metrics WHERE timestamp >= NOW() - INTERVAL 1 HOUR',
          visualization_config: {
            min: 0,
            max: 100,
            unit: '%',
            thresholds: [
              { value: 85, color: 'green', label: 'World Class' },
              { value: 70, color: 'yellow', label: 'Good' },
              { value: 50, color: 'orange', label: 'Fair' },
              { value: 0, color: 'red', label: 'Poor' }
            ]
          },
          size: { width: 300, height: 300 },
          position: { x: 0, y: 0 }
        },
        {
          widget_id: 'production-schedule',
          type: 'chart',
          title: 'Production Schedule vs Actual',
          data_source: 'production_db',
          query: 'SELECT date, planned_units, actual_units FROM production_daily WHERE date >= CURRENT_DATE - INTERVAL 7 DAY',
          visualization_config: {
            chart_type: 'bar',
            series: ['Planned', 'Actual'],
            colors: ['#3498db', '#2ecc71']
          },
          size: { width: 500, height: 300 },
          position: { x: 320, y: 0 }
        },
        {
          widget_id: 'quality-metrics',
          type: 'kpi',
          title: 'First Pass Yield',
          data_source: 'quality_db',
          query: 'SELECT (COUNT(*) - SUM(CASE WHEN defects > 0 THEN 1 ELSE 0 END)) / COUNT(*) * 100 as fpy FROM quality_inspections WHERE DATE(inspection_date) = CURRENT_DATE',
          visualization_config: {
            format: 'percentage',
            target: 98,
            decimal_places: 2
          },
          size: { width: 200, height: 150 },
          position: { x: 840, y: 0 }
        }
      ]
    };

    this.dashboards.set(dashboard.dashboard_id, dashboard);
    return dashboard;
  }

  /**
   * Get real-time dashboard data
   */
  async getDashboardData(dashboardId: string): Promise<any> {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) {
      throw new Error(`Dashboard ${dashboardId} not found`);
    }

    const widgetData = await Promise.all(
      dashboard.widgets.map(async (widget) => {
        const data = await this.executeWidgetQuery(widget);
        return {
          widget_id: widget.widget_id,
          data,
          last_updated: new Date().toISOString()
        };
      })
    );

    return {
      dashboard_id: dashboardId,
      title: dashboard.title,
      widgets: widgetData,
      refresh_interval: dashboard.refresh_interval
    };
  }

  /**
   * Subscribe to real-time updates
   */
  async subscribeToUpdates(dashboardId: string, ws: WebSocket): Promise<void> {
    if (!this.activeConnections.has(dashboardId)) {
      this.activeConnections.set(dashboardId, []);
    }
    this.activeConnections.get(dashboardId)!.push(ws);

    // Set up periodic updates
    const interval = setInterval(async () => {
      if (ws.readyState === WebSocket.OPEN) {
        const data = await this.getDashboardData(dashboardId);
        ws.send(JSON.stringify({
          type: 'dashboard_update',
          data
        }));
      } else {
        clearInterval(interval);
        this.removeConnection(dashboardId, ws);
      }
    }, this.dashboards.get(dashboardId)?.refresh_interval || 30000);
  }

  /**
   * Create custom KPI widget
   */
  async createKPIWidget(config: {
    title: string;
    metric: string;
    target?: number;
    format: 'number' | 'currency' | 'percentage';
    data_source: string;
  }): Promise<DashboardWidget> {
    return {
      widget_id: this.generateId(),
      type: 'kpi',
      title: config.title,
      data_source: config.data_source,
      query: `SELECT ${config.metric} FROM dashboard_metrics WHERE metric_name = '${config.title}'`,
      visualization_config: {
        format: config.format,
        target: config.target,
        show_trend: true
      },
      size: { width: 250, height: 150 },
      position: { x: 0, y: 0 }
    };
  }

  // Private helper methods
  private initializeDefaultDashboards(): void {
    // Initialize with sample dashboards
  }

  private generateId(): string {
    return 'dash_' + Math.random().toString(36).substr(2, 9);
  }

  private async executeWidgetQuery(widget: DashboardWidget): Promise<any> {
    // Simulate database query execution
    switch (widget.type) {
      case 'kpi':
        return {
          value: Math.floor(Math.random() * 1000000),
          change: Math.random() * 20 - 10,
          status: Math.random() > 0.5 ? 'good' : 'warning'
        };
      case 'chart':
        return Array.from({length: 10}, (_, i) => ({
          x: i,
          y: Math.random() * 100
        }));
      case 'gauge':
        return {
          value: Math.random() * 100,
          status: Math.random() > 0.7 ? 'good' : Math.random() > 0.4 ? 'warning' : 'critical'
        };
      case 'table':
        return Array.from({length: 5}, (_, i) => ({
          id: i + 1,
          name: `Item ${i + 1}`,
          value: Math.floor(Math.random() * 1000),
          status: Math.random() > 0.5 ? 'active' : 'inactive'
        }));
      default:
        return {};
    }
  }

  private removeConnection(dashboardId: string, ws: WebSocket): void {
    const connections = this.activeConnections.get(dashboardId);
    if (connections) {
      const index = connections.indexOf(ws);
      if (index > -1) {
        connections.splice(index, 1);
      }
    }
  }
}