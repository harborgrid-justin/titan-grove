/**
 * DashboardManager - Manages dynamic dashboards and widgets
 */

import { EventEmitter } from 'events';
import type { Logger } from 'winston';
import { Dashboard, DashboardWidget, UIManagerConfig } from '../types';

export class DashboardManager extends EventEmitter {
  private config: UIManagerConfig;
  private logger: Logger;
  private dashboards: Map<string, Dashboard> = new Map();
  private userDashboards: Map<string, string[]> = new Map();

  constructor(config: UIManagerConfig, logger: Logger) {
    super();
    this.config = config;
    this.logger = logger;
  }

  async initialize(): Promise<void> {
    this.logger.info('Initializing Dashboard Manager...');
    // TODO: Load dashboards from storage
  }

  /**
   * Create new dashboard
   */
  async create(dashboard: Omit<Dashboard, 'id' | 'createdAt' | 'updatedAt'>): Promise<Dashboard> {
    const id = this.generateId();
    const now = new Date();

    const newDashboard: Dashboard = {
      ...dashboard,
      id,
      createdAt: now,
      updatedAt: now,
    };

    // Validate dashboard
    this.validateDashboard(newDashboard);

    // Store dashboard
    this.dashboards.set(id, newDashboard);

    // Update user dashboard list
    const userDashboards = this.userDashboards.get(dashboard.userId) || [];
    userDashboards.push(id);
    this.userDashboards.set(dashboard.userId, userDashboards);

    this.logger.info(`Dashboard created: ${dashboard.name} (${id}) for user ${dashboard.userId}`);
    this.emit('dashboardCreated', newDashboard);

    return newDashboard;
  }

  /**
   * Get dashboard by ID
   */
  async get(dashboardId: string): Promise<Dashboard | null> {
    return this.dashboards.get(dashboardId) || null;
  }

  /**
   * Get dashboards for user
   */
  async getByUser(userId: string): Promise<Dashboard[]> {
    const dashboardIds = this.userDashboards.get(userId) || [];
    const dashboards: Dashboard[] = [];

    for (const id of dashboardIds) {
      const dashboard = this.dashboards.get(id);
      if (dashboard) {
        dashboards.push(dashboard);
      }
    }

    return dashboards.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  /**
   * Update dashboard
   */
  async update(dashboardId: string, updates: Partial<Dashboard>): Promise<Dashboard> {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) {
      throw new Error(`Dashboard ${dashboardId} not found`);
    }

    const updated = {
      ...dashboard,
      ...updates,
      id: dashboard.id, // Ensure ID can't be changed
      updatedAt: new Date(),
    };

    this.validateDashboard(updated);
    this.dashboards.set(dashboardId, updated);

    this.logger.info(`Dashboard updated: ${updated.name} (${dashboardId})`);
    this.emit('dashboardUpdated', updated);

    return updated;
  }

  /**
   * Delete dashboard
   */
  async delete(dashboardId: string): Promise<void> {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) {
      throw new Error(`Dashboard ${dashboardId} not found`);
    }

    // Remove from user's dashboard list
    const userDashboards = this.userDashboards.get(dashboard.userId) || [];
    const updatedList = userDashboards.filter((id) => id !== dashboardId);
    this.userDashboards.set(dashboard.userId, updatedList);

    // Remove dashboard
    this.dashboards.delete(dashboardId);

    this.logger.info(`Dashboard deleted: ${dashboard.name} (${dashboardId})`);
    this.emit('dashboardDeleted', dashboard);
  }

  /**
   * Add widget to dashboard
   */
  async addWidget(
    dashboardId: string,
    widget: Omit<DashboardWidget, 'id'>
  ): Promise<DashboardWidget> {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) {
      throw new Error(`Dashboard ${dashboardId} not found`);
    }

    // Check widget limit
    if (dashboard.widgets.length >= this.config.maxWidgetsPerDashboard) {
      throw new Error(
        `Maximum ${this.config.maxWidgetsPerDashboard} widgets allowed per dashboard`
      );
    }

    const widgetId = this.generateId('widget');
    const newWidget: DashboardWidget = {
      ...widget,
      id: widgetId,
    };

    dashboard.widgets.push(newWidget);
    dashboard.updatedAt = new Date();

    this.dashboards.set(dashboardId, dashboard);

    this.logger.info(`Widget added to dashboard ${dashboardId}: ${widget.title} (${widgetId})`);
    this.emit('widgetAdded', dashboard, newWidget);

    return newWidget;
  }

  /**
   * Update widget
   */
  async updateWidget(
    dashboardId: string,
    widgetId: string,
    updates: Partial<DashboardWidget>
  ): Promise<DashboardWidget> {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) {
      throw new Error(`Dashboard ${dashboardId} not found`);
    }

    const widgetIndex = dashboard.widgets.findIndex((w) => w.id === widgetId);
    if (widgetIndex === -1) {
      throw new Error(`Widget ${widgetId} not found in dashboard ${dashboardId}`);
    }

    const updated = {
      ...dashboard.widgets[widgetIndex],
      ...updates,
      id: widgetId, // Ensure ID can't be changed
    };

    dashboard.widgets[widgetIndex] = updated;
    dashboard.updatedAt = new Date();

    this.dashboards.set(dashboardId, dashboard);

    this.logger.info(`Widget updated: ${updated.title} (${widgetId}) in dashboard ${dashboardId}`);
    this.emit('widgetUpdated', dashboard, updated);

    return updated;
  }

  /**
   * Remove widget from dashboard
   */
  async removeWidget(dashboardId: string, widgetId: string): Promise<void> {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) {
      throw new Error(`Dashboard ${dashboardId} not found`);
    }

    const widgetIndex = dashboard.widgets.findIndex((w) => w.id === widgetId);
    if (widgetIndex === -1) {
      throw new Error(`Widget ${widgetId} not found in dashboard ${dashboardId}`);
    }

    const widget = dashboard.widgets[widgetIndex];
    dashboard.widgets.splice(widgetIndex, 1);
    dashboard.updatedAt = new Date();

    this.dashboards.set(dashboardId, dashboard);

    this.logger.info(`Widget removed: ${widget.title} (${widgetId}) from dashboard ${dashboardId}`);
    this.emit('widgetRemoved', dashboard, widget);
  }

  /**
   * Clone dashboard
   */
  async clone(dashboardId: string, newName: string, userId: string): Promise<Dashboard> {
    const original = this.dashboards.get(dashboardId);
    if (!original) {
      throw new Error(`Dashboard ${dashboardId} not found`);
    }

    const cloned: Omit<Dashboard, 'id' | 'createdAt' | 'updatedAt'> = {
      ...original,
      name: newName,
      userId,
      isDefault: false,
      // Generate new IDs for widgets
      widgets: original.widgets.map((widget) => ({
        ...widget,
        id: this.generateId('widget'),
      })),
    };

    return this.create(cloned);
  }

  /**
   * Get dashboard templates
   */
  async getTemplates(): Promise<Dashboard[]> {
    // Return built-in dashboard templates
    return [
      {
        id: 'template-executive',
        name: 'Executive Dashboard',
        description: 'High-level KPIs and metrics for executives',
        userId: 'system',
        widgets: [
          {
            id: 'exec-kpi-1',
            componentId: 'kpi-card',
            title: 'Revenue',
            position: { x: 0, y: 0, width: 3, height: 2 },
            config: {},
            dataSource: { type: 'api', endpoint: '/api/financial/revenue' },
          },
          {
            id: 'exec-chart-1',
            componentId: 'line-chart',
            title: 'Revenue Trend',
            position: { x: 3, y: 0, width: 6, height: 4 },
            config: {},
            dataSource: { type: 'api', endpoint: '/api/financial/revenue-trend' },
          },
        ],
        layout: {
          type: 'grid',
          columns: 12,
          rowHeight: 60,
          margin: [10, 10],
          containerPadding: [20, 20],
          responsive: true,
        },
        theme: 'modern',
        isDefault: false,
        permissions: {
          view: ['executive'],
          edit: ['executive'],
          share: ['executive'],
          delete: ['executive'],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  /**
   * Validate dashboard structure
   */
  private validateDashboard(dashboard: Dashboard): void {
    if (!dashboard.name?.trim()) {
      throw new Error('Dashboard name is required');
    }
    if (!dashboard.userId) {
      throw new Error('Dashboard userId is required');
    }
    if (!dashboard.layout) {
      throw new Error('Dashboard layout is required');
    }
    if (!Array.isArray(dashboard.widgets)) {
      throw new Error('Dashboard widgets must be an array');
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(prefix = 'dashboard'): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
