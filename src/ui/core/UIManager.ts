/**
 * UIManager - Central orchestrator for Titan Grove's dynamic UI system
 * Provides enterprise-grade UI management that outperforms Oracle EBS
 */

import { EventEmitter } from 'events';
import type { Logger } from 'winston';
import { ComponentRegistry } from './ComponentRegistry';
import { ThemeManager } from './ThemeManager';
import { DashboardManager } from '../dashboards/DashboardManager';
import { 
  UIComponent, 
  Dashboard, 
  UITheme, 
  UserPreferences, 
  UIEvent,
  DataSourceConfig,
  UIManagerConfig 
} from '../types';

export class UIManager extends EventEmitter {
  private config: UIManagerConfig;
  private logger: Logger;
  private componentRegistry: ComponentRegistry;
  private themeManager: ThemeManager;
  private dashboardManager: DashboardManager;
  private userPreferences: Map<string, UserPreferences> = new Map();
  private activeConnections: Map<string, any> = new Map();

  constructor(config: UIManagerConfig, logger: Logger) {
    super();
    this.config = config;
    this.logger = logger;
    
    // Initialize core managers
    this.componentRegistry = new ComponentRegistry(logger);
    this.themeManager = new ThemeManager(logger);
    this.dashboardManager = new DashboardManager(config, logger);
    
    this.setupEventHandlers();
  }

  /**
   * Initialize the UI system with components and themes
   */
  async initialize(): Promise<void> {
    this.logger.info('Initializing Titan Grove UI System...');
    
    // Load built-in components
    await this.loadBuiltinComponents();
    
    // Load built-in themes
    await this.loadBuiltinThemes();
    
    // Initialize dashboard system
    await this.dashboardManager.initialize();
    
    this.logger.info('UI System initialized successfully');
  }

  /**
   * Register a new UI component
   */
  async registerComponent(component: UIComponent): Promise<void> {
    await this.componentRegistry.register(component);
    this.emit('componentRegistered', component);
  }

  /**
   * Get available components for a user
   */
  async getAvailableComponents(userId: string): Promise<UIComponent[]> {
    const preferences = await this.getUserPreferences(userId);
    const allComponents = await this.componentRegistry.getAll();
    
    // Filter components based on user permissions and preferences
    return allComponents.filter(component => {
      // Check permissions
      if (component.config.behavior?.permissions) {
        // TODO: Implement permission checking
      }
      
      // Filter hidden components
      if (preferences.components.hidden.includes(component.id)) {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Create a new dashboard
   */
  async createDashboard(dashboard: Omit<Dashboard, 'id' | 'createdAt' | 'updatedAt'>): Promise<Dashboard> {
    const newDashboard = await this.dashboardManager.create(dashboard);
    this.emit('dashboardCreated', newDashboard);
    return newDashboard;
  }

  /**
   * Get user's dashboards
   */
  async getUserDashboards(userId: string): Promise<Dashboard[]> {
    return this.dashboardManager.getByUser(userId);
  }

  /**
   * Update dashboard
   */
  async updateDashboard(dashboardId: string, updates: Partial<Dashboard>): Promise<Dashboard> {
    const dashboard = await this.dashboardManager.update(dashboardId, updates);
    this.emit('dashboardUpdated', dashboard);
    
    // Notify connected clients
    this.broadcastToUser(dashboard.userId, 'dashboardUpdated', dashboard);
    
    return dashboard;
  }

  /**
   * Get component data with real-time updates
   */
  async getComponentData(
    componentId: string, 
    dataSource: DataSourceConfig, 
    userId: string
  ): Promise<any> {
    const component = await this.componentRegistry.get(componentId);
    if (!component) {
      throw new Error(`Component ${componentId} not found`);
    }

    // Get data based on source type
    let data: any;
    switch (dataSource.type) {
      case 'api':
        data = await this.fetchAPIData(dataSource);
        break;
      case 'database':
        data = await this.fetchDatabaseData(dataSource);
        break;
      case 'realtime':
        data = await this.setupRealtimeData(dataSource, userId);
        break;
      case 'cached':
        data = await this.getCachedData(dataSource);
        break;
      default:
        throw new Error(`Unsupported data source type: ${dataSource.type}`);
    }

    // Apply transformations
    if (dataSource.transformation) {
      data = this.transformData(data, dataSource.transformation);
    }

    return data;
  }

  /**
   * Apply theme to user session
   */
  async applyTheme(userId: string, themeId: string): Promise<UITheme> {
    const theme = await this.themeManager.getTheme(themeId);
    if (!theme) {
      throw new Error(`Theme ${themeId} not found`);
    }

    // Update user preferences
    const preferences = await this.getUserPreferences(userId);
    preferences.theme = themeId;
    await this.updateUserPreferences(userId, preferences);

    // Notify connected clients
    this.broadcastToUser(userId, 'themeChanged', theme);

    return theme;
  }

  /**
   * Get user preferences
   */
  async getUserPreferences(userId: string): Promise<UserPreferences> {
    if (!this.userPreferences.has(userId)) {
      // Load from storage or create default
      const defaultPreferences: UserPreferences = {
        userId,
        theme: this.config.defaultTheme,
        dashboards: {
          default: '',
          favorites: [],
          recent: []
        },
        components: {
          favorites: [],
          hidden: []
        },
        layout: {
          sidebarCollapsed: false,
          density: 'normal'
        },
        accessibility: {
          highContrast: false,
          largeText: false,
          reducedMotion: false
        },
        notifications: {
          enabled: true,
          types: ['system', 'alerts', 'updates'],
          frequency: 'realtime'
        }
      };
      
      this.userPreferences.set(userId, defaultPreferences);
    }

    return this.userPreferences.get(userId)!;
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    const current = await this.getUserPreferences(userId);
    const updated = { ...current, ...preferences };
    this.userPreferences.set(userId, updated);
    
    // Persist to storage
    // TODO: Implement persistence
    
    this.emit('preferencesUpdated', userId, updated);
    return updated;
  }

  /**
   * Handle real-time connection
   */
  handleWebSocketConnection(userId: string, connection: any): void {
    this.activeConnections.set(userId, connection);
    
    connection.on('close', () => {
      this.activeConnections.delete(userId);
    });

    connection.on('message', (message: string) => {
      try {
        const event: UIEvent = JSON.parse(message);
        event.userId = userId;
        event.timestamp = new Date();
        
        this.handleUIEvent(event);
      } catch (error) {
        this.logger.error('Invalid WebSocket message:', error);
      }
    });

    this.logger.info(`User ${userId} connected to real-time UI`);
  }

  /**
   * Handle UI events
   */
  private handleUIEvent(event: UIEvent): void {
    this.emit('uiEvent', event);
    
    // Handle specific event types
    switch (event.type) {
      case 'widgetInteraction':
        this.handleWidgetInteraction(event);
        break;
      case 'dashboardChange':
        this.handleDashboardChange(event);
        break;
      case 'componentError':
        this.handleComponentError(event);
        break;
      default:
        this.logger.debug(`Unhandled UI event type: ${event.type}`);
    }
  }

  /**
   * Broadcast message to specific user
   */
  private broadcastToUser(userId: string, type: string, data: any): void {
    const connection = this.activeConnections.get(userId);
    if (connection) {
      connection.send(JSON.stringify({ type, data, timestamp: new Date() }));
    }
  }

  /**
   * Load built-in components
   */
  private async loadBuiltinComponents(): Promise<void> {
    // Chart components
    await this.registerComponent({
      id: 'line-chart',
      type: 'chart',
      name: 'Line Chart',
      version: '1.0.0',
      config: {
        behavior: { interactive: true, realtime: true },
        responsive: {
          breakpoints: { mobile: 320, tablet: 768, desktop: 1024, wide: 1440 }
        }
      }
    });

    // Table component
    await this.registerComponent({
      id: 'data-table',
      type: 'table',
      name: 'Data Table',
      version: '1.0.0',
      config: {
        behavior: { interactive: true, cacheable: true },
        responsive: {
          breakpoints: { mobile: 320, tablet: 768, desktop: 1024, wide: 1440 }
        }
      }
    });

    // KPI Card
    await this.registerComponent({
      id: 'kpi-card',
      type: 'metric',
      name: 'KPI Card',
      version: '1.0.0',
      config: {
        behavior: { realtime: true },
        responsive: {
          breakpoints: { mobile: 320, tablet: 768, desktop: 1024, wide: 1440 }
        }
      }
    });

    this.logger.info('Built-in components loaded');
  }

  /**
   * Load built-in themes
   */
  private async loadBuiltinThemes(): Promise<void> {
    // Modern theme
    await this.themeManager.registerTheme({
      id: 'modern',
      name: 'Modern',
      description: 'Clean, modern interface',
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#f59e0b',
        background: '#ffffff',
        surface: '#f8fafc',
        text: {
          primary: '#0f172a',
          secondary: '#475569',
          disabled: '#94a3b8'
        },
        status: {
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6'
        }
      },
      typography: {
        fontFamily: {
          primary: 'Inter, sans-serif',
          secondary: 'Inter, sans-serif',
          monospace: 'JetBrains Mono, monospace'
        },
        fontSizes: {
          xs: '0.75rem',
          sm: '0.875rem',
          md: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          xxl: '1.5rem'
        },
        fontWeights: {
          light: 300,
          normal: 400,
          medium: 500,
          bold: 700
        },
        lineHeights: {
          tight: 1.25,
          normal: 1.5,
          relaxed: 1.75
        }
      },
      spacing: {
        unit: 4,
        scale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64],
        layouts: {
          containerMaxWidth: '1200px',
          sidebarWidth: '280px',
          headerHeight: '64px',
          footerHeight: '80px'
        }
      },
      components: {},
      responsive: {
        breakpoints: {
          mobile: '320px',
          tablet: '768px',
          desktop: '1024px',
          wide: '1440px'
        },
        spacing: {
          mobile: { unit: 4, scale: [0, 4, 8, 12, 16, 20], layouts: { containerMaxWidth: '100%', sidebarWidth: '240px', headerHeight: '56px', footerHeight: '64px' }},
          tablet: { unit: 4, scale: [0, 4, 8, 12, 16, 20, 24], layouts: { containerMaxWidth: '100%', sidebarWidth: '260px', headerHeight: '60px', footerHeight: '72px' }},
          desktop: { unit: 4, scale: [0, 4, 8, 12, 16, 20, 24, 32], layouts: { containerMaxWidth: '1200px', sidebarWidth: '280px', headerHeight: '64px', footerHeight: '80px' }},
          wide: { unit: 4, scale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48], layouts: { containerMaxWidth: '1400px', sidebarWidth: '320px', headerHeight: '72px', footerHeight: '88px' }}
        }
      }
    });

    this.logger.info('Built-in themes loaded');
  }

  /**
   * Setup event handlers
   */
  private setupEventHandlers(): void {
    this.componentRegistry.on('componentRegistered', (component) => {
      this.logger.info(`Component registered: ${component.name} (${component.id})`);
    });

    this.themeManager.on('themeRegistered', (theme) => {
      this.logger.info(`Theme registered: ${theme.name} (${theme.id})`);
    });
  }

  // Data fetching methods
  private async fetchAPIData(dataSource: DataSourceConfig): Promise<any> {
    // TODO: Implement API data fetching
    return {};
  }

  private async fetchDatabaseData(dataSource: DataSourceConfig): Promise<any> {
    // TODO: Implement database data fetching
    return {};
  }

  private async setupRealtimeData(dataSource: DataSourceConfig, userId: string): Promise<any> {
    // TODO: Implement real-time data setup
    return {};
  }

  private async getCachedData(dataSource: DataSourceConfig): Promise<any> {
    // TODO: Implement cached data retrieval
    return {};
  }

  private transformData(data: any, transformation: any): any {
    // TODO: Implement data transformation
    return data;
  }

  // Event handlers
  private handleWidgetInteraction(event: UIEvent): void {
    this.logger.debug(`Widget interaction: ${event.componentId}`, event.payload);
  }

  private handleDashboardChange(event: UIEvent): void {
    this.logger.debug(`Dashboard change: ${event.componentId}`, event.payload);
  }

  private handleComponentError(event: UIEvent): void {
    this.logger.error(`Component error: ${event.componentId}`, event.payload);
  }
}