// Advanced Analytics Types
export interface PredictiveAnalyticsRequest {
  dataSource: string;
  timeframe: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  metrics: string[];
  algorithm?: 'linear_regression' | 'random_forest' | 'neural_network' | 'arima';
  confidence?: number;
}

export interface PredictiveAnalyticsResult {
  predictions: Array<{
    date: string;
    metric: string;
    predicted_value: number;
    confidence_interval: { lower: number; upper: number };
    accuracy: number;
  }>;
  model_performance: {
    r_squared: number;
    mean_absolute_error: number;
    root_mean_square_error: number;
  };
  insights: string[];
}

export interface DashboardConfig {
  dashboard_id: string;
  title: string;
  widgets: DashboardWidget[];
  refresh_interval: number;
  access_control: string[];
  theme: 'light' | 'dark' | 'corporate';
}

export interface DashboardWidget {
  widget_id: string;
  type: 'chart' | 'kpi' | 'table' | 'map' | 'gauge' | 'funnel';
  title: string;
  data_source: string;
  query: string;
  visualization_config: any;
  size: { width: number; height: number };
  position: { x: number; y: number };
}

export interface ExecutiveReport {
  report_id: string;
  title: string;
  executive_summary: string;
  key_metrics: Array<{
    metric_name: string;
    current_value: number;
    previous_value: number;
    change_percentage: number;
    status: 'improving' | 'declining' | 'stable';
  }>;
  recommendations: string[];
  generated_at: Date;
  generated_by: string;
}

export interface DataMiningRequest {
  dataset: string;
  algorithm: 'clustering' | 'association_rules' | 'anomaly_detection' | 'classification';
  parameters: Record<string, any>;
  output_format: 'json' | 'csv' | 'pdf';
}

export interface MLModelTraining {
  model_name: string;
  algorithm: string;
  training_data: string;
  validation_data: string;
  hyperparameters: Record<string, any>;
  target_metric: string;
  auto_tune: boolean;
}