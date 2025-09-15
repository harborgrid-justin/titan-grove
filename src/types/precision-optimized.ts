/**
 * TypeScript interfaces matching the refined precision Rust modules
 * 
 * Precision Strategy:
 * - number (default): For JavaScript compatibility (64-bit IEEE 754)
 * - Specialized types: For specific use cases requiring precision annotations
 */

// Analytics Module Interfaces (optimized for f32)
export interface AnalyticsModel {
  model_id: string;
  model_type: string;
  accuracy: number;      // f32 in Rust
  precision: number;     // f32 in Rust  
  recall: number;        // f32 in Rust
  f1_score: number;      // f32 in Rust
}

// Performance Module Interfaces (optimized for f32)  
export interface KPI {
  kpi_id: string;
  kpi_name: string;
  current_value: number; // f32 in Rust
  target_value: number;  // f32 in Rust
  unit: string;
  frequency: string;
}

// Manufacturing Module Interfaces (mixed precision)
export interface ProductionOrder {
  order_id: string;
  product_id: string;
  quantity_planned: number;   // f32 in Rust - quantities
  quantity_produced: number;  // f32 in Rust - quantities
  start_date: string;
  end_date: string;
  status: string;
  priority: number;
}

export interface WorkCenter {
  work_center_id: string;
  name: string;
  capacity_per_hour: number;    // f32 in Rust - capacity metrics
  efficiency_rate: number;      // f32 in Rust - efficiency metrics
  availability_hours: number;   // f32 in Rust - time metrics
  current_utilization: number;  // f32 in Rust - utilization metrics
}

export interface MaterialComponent {
  component_id: string;
  quantity_required: number;  // f32 in Rust - quantities
  unit_cost: number;         // f64 in Rust - precise financial
  total_cost: number;        // f64 in Rust - precise financial
  lead_time_days: number;
}

export interface ManufacturingQualityMetrics {
  batch_id: string;
  total_units: number;
  defective_units: number;
  defect_rate: number;        // f32 in Rust - quality percentage
  first_pass_yield: number;   // f32 in Rust - yield metric
  rework_rate: number;        // f32 in Rust - rate metric
  scrap_rate: number;         // f32 in Rust - rate metric
}

// Supply Chain Module Interfaces (mixed precision)
export interface SupplyChainNode {
  node_id: string;
  node_type: string; // SUPPLIER, WAREHOUSE, DISTRIBUTION_CENTER, CUSTOMER
  location: string;
  capacity: number;           // f32 in Rust - capacity metrics
  current_inventory: number;  // f32 in Rust - inventory quantities
  lead_time_days: number;
}

export interface ShipmentRoute {
  route_id: string;
  origin: string;
  destination: string;
  distance_km: number;          // f32 in Rust - distance metrics
  transport_cost_per_km: number; // f64 in Rust - financial calculations
  transit_time_hours: number;   // f32 in Rust - time metrics
  capacity_limit: number;       // f32 in Rust - capacity
  transport_mode: string;       // TRUCK, RAIL, AIR, SHIP
}

export interface SupplyChainMetrics {
  total_cost: number;              // f64 in Rust - financial
  average_lead_time: number;       // f32 in Rust - time metrics
  fill_rate: number;               // f32 in Rust - percentage
  inventory_turnover: number;      // f32 in Rust - ratio
  supply_chain_efficiency: number; // f32 in Rust - efficiency
  carbon_footprint: number;        // f32 in Rust - environmental
}

// Inventory Module Interfaces (mixed precision)
export interface InventoryItem {
  item_id: string;
  item_code: string;
  description: string;
  category: string;
  unit_cost: number;       // f64 in Rust - precise financial
  current_stock: number;   // i32 in Rust - exact counts
  reserved_stock: number;  // i32 in Rust - exact counts
  available_stock: number; // i32 in Rust - exact counts
  reorder_point: number;   // i32 in Rust - exact counts
  max_stock_level: number; // i32 in Rust - exact counts
  abc_classification: string;
}

export interface EOQCalculation {
  item_id: string;
  economic_order_quantity: number; // i32 in Rust - exact quantities
  total_annual_cost: number;       // f64 in Rust - financial
  ordering_cost_component: number; // f64 in Rust - financial
  holding_cost_component: number;  // f64 in Rust - financial
  order_frequency: number;         // f32 in Rust - frequency
  optimal_cycle_time_days: number; // f32 in Rust - time
}

// Quality Module Interfaces (optimized for f32)
export interface QualityMetrics {
  defect_rate: number;              // f32 in Rust - percentages
  first_pass_yield: number;         // f32 in Rust - yield
  customer_satisfaction: number;    // f32 in Rust - scores
  process_capability: number;       // f32 in Rust - capability
  supplier_quality_rating: number;  // f32 in Rust - ratings
  overall_quality_score: number;    // f32 in Rust - scores
}

export interface ProcessCapability {
  process_name: string;
  cp: number;         // f32 in Rust - capability
  cpk: number;        // f32 in Rust - capability index
  pp: number;         // f32 in Rust - performance
  ppk: number;        // f32 in Rust - performance index
  sigma_level: number; // f32 in Rust - sigma calculations
}

export interface DefectData {
  defect_id: string;
  defect_type: string;
  severity: string;
  detection_stage: string;
  root_cause: string;
  cost_impact: number;     // f64 in Rust - financial impact
  occurrence_count: number; // i32 in Rust - exact counts
}

// Industrial Robotics Module Interfaces (optimized for f32)
export interface IndustrialRoboticsData {
  id: string;
  name: string;
  module_type: string;
  metrics: number[];       // Vec<f32> in Rust - sensor data
  status: string;
  timestamp: string;
}

export interface IndustrialRoboticsAnalytics {
  performance_score: number; // f32 in Rust - performance
  efficiency_rating: string;
  compliance_status: boolean;
  optimization_suggestions: string[];
}

export interface Threshold {
  metric: string;
  min_value: number;     // f32 in Rust - thresholds
  max_value: number;     // f32 in Rust - thresholds
  critical_level: number; // f32 in Rust - critical levels
}

// API Function Signatures (matching Rust functions)
export interface PrecisionOptimizedAPI {
  // Analytics functions (f32 optimized)
  calculate_model_accuracy(tp: number, tn: number, fp: number, fn: number): number;
  calculate_regression_metrics(actual: number[], predicted: number[]): number;
  calculate_predictive_accuracy(predictions: number[], actuals: number[]): number;
  
  // Performance functions (f32 optimized)
  calculate_kpi_performance(current: number, target: number, higher_better: boolean): number;
  calculate_balanced_scorecard(fin: number, cust: number, proc: number, learn: number): number;
  
  // Manufacturing functions (mixed precision)
  calculate_production_capacity(centers: WorkCenter[], planned_hours: number): number;
  calculate_oee_score(availability: number, performance: number, quality: number): number;
  
  // Supply chain functions (mixed precision)
  generate_supply_chain_metrics(nodes: SupplyChainNode[], routes: ShipmentRoute[], demand: number): SupplyChainMetrics;
  
  // Quality functions (f32 optimized)
  // Industrial robotics functions (f32 optimized)
  calculate_industrial_robotics_metrics(input: number): number;
  process_industrial_robotics_data(data: number[]): number[];
}

// Type guards for precision validation
export const isPrecisionOptimized = {
  isAnalyticsMetric: (value: number): boolean => {
    // f32 range check: approximately ±3.4e38 with ~7 decimal digits precision
    return Math.abs(value) <= 3.4e38 && Number.isFinite(value);
  },
  
  isFinancialValue: (value: number): boolean => {
    // f64 precision check for financial values
    return Number.isFinite(value) && Math.abs(value) <= Number.MAX_SAFE_INTEGER;
  },
  
  isIntegerCount: (value: number): boolean => {
    // Integer validation for exact counts
    return Number.isInteger(value) && value >= 0;
  }
};

// Precision conversion utilities
export const PrecisionUtils = {
  /**
   * Convert high-precision financial value to display format
   */
  formatFinancial: (value: number, decimals: number = 2): string => {
    return value.toFixed(decimals);
  },
  
  /**
   * Convert performance metric to display format (lower precision)
   */
  formatMetric: (value: number, decimals: number = 1): string => {
    return value.toFixed(decimals);
  },
  
  /**
   * Validate precision requirements for different data types
   */
  validatePrecision: (value: number, type: 'financial' | 'metric' | 'count'): boolean => {
    switch (type) {
      case 'financial':
        return isPrecisionOptimized.isFinancialValue(value);
      case 'metric':
        return isPrecisionOptimized.isAnalyticsMetric(value);
      case 'count':
        return isPrecisionOptimized.isIntegerCount(value);
      default:
        return false;
    }
  }
};