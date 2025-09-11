/**
 * UI System Type Definitions
 */

export interface UIComponent {
  id: string;
  type: string;
  name: string;
  version: string;
  config: ComponentConfig;
  dependencies?: string[];
  lazy?: boolean;
}

export interface ComponentConfig {
  props?: Record<string, any>;
  styling?: ComponentStyling;
  behavior?: ComponentBehavior;
  responsive?: ResponsiveConfig;
}

export interface ComponentStyling {
  theme?: string;
  customCSS?: string;
  classes?: string[];
  variants?: Record<string, any>;
}

export interface ComponentBehavior {
  interactive?: boolean;
  realtime?: boolean;
  cacheable?: boolean;
  permissions?: string[];
}

export interface ResponsiveConfig {
  breakpoints?: {
    mobile: number;
    tablet: number;
    desktop: number;
    wide: number;
  };
  layouts?: {
    mobile?: LayoutConfig;
    tablet?: LayoutConfig;
    desktop?: LayoutConfig;
    wide?: LayoutConfig;
  };
}

export interface LayoutConfig {
  columns: number;
  rows?: number;
  gap?: number;
  padding?: number;
}

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  userId: string;
  widgets: DashboardWidget[];
  layout: DashboardLayout;
  theme: string;
  isDefault: boolean;
  permissions: DashboardPermissions;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardWidget {
  id: string;
  componentId: string;
  title: string;
  position: WidgetPosition;
  config: ComponentConfig;
  dataSource?: DataSourceConfig;
  refreshInterval?: number;
}

export interface WidgetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export interface DashboardLayout {
  type: 'grid' | 'flexbox' | 'absolute';
  columns: number;
  rowHeight: number;
  margin: [number, number];
  containerPadding: [number, number];
  responsive: boolean;
}

export interface DashboardPermissions {
  view: string[];
  edit: string[];
  share: string[];
  delete: string[];
}

export interface DataSourceConfig {
  type: 'api' | 'database' | 'realtime' | 'cached';
  endpoint?: string;
  query?: string;
  parameters?: Record<string, any>;
  transformation?: DataTransformation;
}

export interface DataTransformation {
  format?: 'json' | 'csv' | 'xml';
  mapping?: Record<string, string>;
  filters?: DataFilter[];
  aggregations?: DataAggregation[];
}

export interface DataFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'like';
  value: any;
}

export interface DataAggregation {
  field: string;
  function: 'sum' | 'avg' | 'count' | 'min' | 'max';
  groupBy?: string;
}

export interface UITheme {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  components: Record<string, ComponentTheme>;
  responsive: ResponsiveTheme;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  gradients?: Record<string, string>;
}

export interface ThemeTypography {
  fontFamily: {
    primary: string;
    secondary: string;
    monospace: string;
  };
  fontSizes: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  fontWeights: {
    light: number;
    normal: number;
    medium: number;
    bold: number;
  };
  lineHeights: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface ThemeSpacing {
  unit: number;
  scale: number[];
  layouts: {
    containerMaxWidth: string;
    sidebarWidth: string;
    headerHeight: string;
    footerHeight: string;
  };
}

export interface ComponentTheme {
  defaultVariant: string;
  variants: Record<string, ComponentVariant>;
}

export interface ComponentVariant {
  styles: Record<string, any>;
  props?: Record<string, any>;
}

export interface ResponsiveTheme {
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
    wide: string;
  };
  spacing: {
    mobile: ThemeSpacing;
    tablet: ThemeSpacing;
    desktop: ThemeSpacing;
    wide: ThemeSpacing;
  };
}

export interface UserPreferences {
  userId: string;
  theme: string;
  dashboards: {
    default: string;
    favorites: string[];
    recent: string[];
  };
  components: {
    favorites: string[];
    hidden: string[];
  };
  layout: {
    sidebarCollapsed: boolean;
    density: 'compact' | 'normal' | 'spacious';
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
  };
  notifications: {
    enabled: boolean;
    types: string[];
    frequency: 'realtime' | 'batched' | 'manual';
  };
}

export type ComponentType =
  | 'chart'
  | 'table'
  | 'form'
  | 'list'
  | 'card'
  | 'metric'
  | 'gauge'
  | 'map'
  | 'calendar'
  | 'kanban'
  | 'timeline'
  | 'chat'
  | 'document'
  | 'media';

export type ChartType =
  | 'line'
  | 'bar'
  | 'pie'
  | 'donut'
  | 'area'
  | 'scatter'
  | 'bubble'
  | 'heatmap'
  | 'treemap'
  | 'sankey'
  | 'funnel';

export interface UIEvent {
  type: string;
  componentId: string;
  payload: any;
  timestamp: Date;
  userId: string;
}

export interface UIManagerConfig {
  enableRealtime: boolean;
  enableAnalytics: boolean;
  enableAccessibility: boolean;
  maxWidgetsPerDashboard: number;
  cacheTimeout: number;
  defaultTheme: string;
}
