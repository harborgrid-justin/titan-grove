use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct DataPoint {
    pub metric_name: String,
    pub value: f64,
    pub timestamp: String,
    pub dimension: String,
    pub category: String,
}

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct KpiMetric {
    pub kpi_name: String,
    pub current_value: f64,
    pub target_value: f64,
    pub previous_value: f64,
    pub unit: String,
    pub trend: String,
    pub variance_percentage: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct TrendAnalysis {
    pub metric_name: String,
    pub trend_direction: String,
    pub trend_strength: f64,
    pub seasonal_pattern: bool,
    pub forecast_value: f64,
    pub confidence_interval: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct PerformanceDashboard {
    pub dashboard_name: String,
    pub kpis: Vec<KpiMetric>,
    pub overall_score: f64,
    pub alerts: Vec<String>,
    pub recommendations: Vec<String>,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct BusinessInsight {
    pub insight_type: String,
    pub description: String,
    pub impact_score: f64,
    pub confidence_level: f64,
    pub recommended_actions: Vec<String>,
    pub data_sources: Vec<String>,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct DataQualityReport {
    pub completeness_score: f64,
    pub accuracy_score: f64,
    pub consistency_score: f64,
    pub timeliness_score: f64,
    pub overall_quality_score: f64,
    pub issues_found: i32,
}

#[napi]
pub fn calculate_kpi_variance(
    current_value: f64,
    target_value: f64,
) -> f64 {
    if target_value != 0.0 {
        ((current_value - target_value) / target_value) * 100.0
    } else {
        0.0
    }
}

#[napi]
pub fn calculate_trend_strength(
    data_points: Vec<f64>,
) -> f64 {
    if data_points.len() < 2 {
        return 0.0;
    }
    
    // Simple linear regression slope calculation
    let n = data_points.len() as f64;
    let x_sum: f64 = (0..data_points.len()).map(|i| i as f64).sum();
    let y_sum: f64 = data_points.iter().sum();
    let xy_sum: f64 = data_points.iter().enumerate()
        .map(|(i, &y)| i as f64 * y)
        .sum();
    let x_squared_sum: f64 = (0..data_points.len())
        .map(|i| (i as f64).powi(2))
        .sum();
    
    let slope = if n * x_squared_sum - x_sum.powi(2) != 0.0 {
        (n * xy_sum - x_sum * y_sum) / (n * x_squared_sum - x_sum.powi(2))
    } else {
        0.0
    };
    
    // Normalize slope to 0-100 scale
    slope.abs().min(100.0)
}

#[napi]
pub fn detect_anomalies(
    data_points: Vec<f64>,
    threshold_multiplier: f64,
) -> Vec<i32> {
    if data_points.len() < 3 {
        return Vec::new();
    }
    
    // Calculate mean and standard deviation
    let mean = data_points.iter().sum::<f64>() / data_points.len() as f64;
    let variance = data_points.iter()
        .map(|&x| (x - mean).powi(2))
        .sum::<f64>() / data_points.len() as f64;
    let std_dev = variance.sqrt();
    
    let threshold = std_dev * threshold_multiplier;
    
    // Find anomalies
    let mut anomaly_indices = Vec::new();
    for (i, &value) in data_points.iter().enumerate() {
        if (value - mean).abs() > threshold {
            anomaly_indices.push(i as i32);
        }
    }
    
    anomaly_indices
}

#[napi]
pub fn calculate_bi_correlation_coefficient(
    x_values: Vec<f64>,
    y_values: Vec<f64>,
) -> f64 {
    if x_values.len() != y_values.len() || x_values.is_empty() {
        return 0.0;
    }
    
    let n = x_values.len() as f64;
    let x_mean = x_values.iter().sum::<f64>() / n;
    let y_mean = y_values.iter().sum::<f64>() / n;
    
    let numerator: f64 = x_values.iter().zip(y_values.iter())
        .map(|(&x, &y)| (x - x_mean) * (y - y_mean))
        .sum();
    
    let x_variance: f64 = x_values.iter()
        .map(|&x| (x - x_mean).powi(2))
        .sum();
    
    let y_variance: f64 = y_values.iter()
        .map(|&y| (y - y_mean).powi(2))
        .sum();
    
    let denominator = (x_variance * y_variance).sqrt();
    
    if denominator != 0.0 {
        numerator / denominator
    } else {
        0.0
    }
}

#[napi]
pub fn calculate_bi_moving_average(
    data_points: Vec<f64>,
    window_size: i32,
) -> Vec<f64> {
    if data_points.len() < window_size as usize || window_size <= 0 {
        return Vec::new();
    }
    
    let mut moving_averages = Vec::new();
    
    for i in (window_size - 1) as usize..data_points.len() {
        let window_start = i - (window_size - 1) as usize;
        let window_sum: f64 = data_points[window_start..=i].iter().sum();
        let average = window_sum / window_size as f64;
        moving_averages.push(average);
    }
    
    moving_averages
}

#[napi]
pub fn calculate_forecasted_value(
    historical_data: Vec<f64>,
    periods_ahead: i32,
) -> f64 {
    if historical_data.len() < 2 {
        return 0.0;
    }
    
    // Simple exponential smoothing
    let alpha = 0.3; // Smoothing parameter
    let mut forecast = historical_data[0];
    
    for &value in &historical_data[1..] {
        forecast = alpha * value + (1.0 - alpha) * forecast;
    }
    
    // Apply simple trend for multiple periods
    if periods_ahead > 1 {
        let trend = if historical_data.len() >= 2 {
            historical_data[historical_data.len() - 1] - historical_data[historical_data.len() - 2]
        } else {
            0.0
        };
        forecast += trend * (periods_ahead - 1) as f64;
    }
    
    forecast
}

#[napi]
pub fn calculate_bi_data_quality_score(
    total_records: i32,
    complete_records: i32,
    accurate_records: i32,
    consistent_records: i32,
    timely_records: i32,
) -> DataQualityReport {
    let completeness_score = if total_records > 0 {
        (complete_records as f64 / total_records as f64) * 100.0
    } else {
        0.0
    };
    
    let accuracy_score = if total_records > 0 {
        (accurate_records as f64 / total_records as f64) * 100.0
    } else {
        0.0
    };
    
    let consistency_score = if total_records > 0 {
        (consistent_records as f64 / total_records as f64) * 100.0
    } else {
        0.0
    };
    
    let timeliness_score = if total_records > 0 {
        (timely_records as f64 / total_records as f64) * 100.0
    } else {
        0.0
    };
    
    let overall_quality_score = (completeness_score + accuracy_score + consistency_score + timeliness_score) / 4.0;
    
    let issues_found = total_records - complete_records.min(accurate_records).min(consistent_records).min(timely_records);
    
    DataQualityReport {
        completeness_score,
        accuracy_score,
        consistency_score,
        timeliness_score,
        overall_quality_score,
        issues_found,
    }
}

#[napi]
pub fn calculate_performance_index(
    actual_values: Vec<f64>,
    target_values: Vec<f64>,
    weights: Vec<f64>,
) -> f64 {
    if actual_values.len() != target_values.len() || 
       actual_values.len() != weights.len() ||
       actual_values.is_empty() {
        return 0.0;
    }
    
    let mut weighted_performance = 0.0;
    let mut total_weight = 0.0;
    
    for i in 0..actual_values.len() {
        if target_values[i] != 0.0 {
            let performance = (actual_values[i] / target_values[i]) * 100.0;
            weighted_performance += performance * weights[i];
            total_weight += weights[i];
        }
    }
    
    if total_weight > 0.0 {
        weighted_performance / total_weight
    } else {
        0.0
    }
}

#[napi]
pub fn generate_business_insights(
    revenue_data: Vec<f64>,
    cost_data: Vec<f64>,
    customer_data: Vec<f64>,
) -> Vec<BusinessInsight> {
    let mut insights = Vec::new();
    
    // Revenue trend insight
    if revenue_data.len() >= 2 {
        let revenue_trend = calculate_trend_strength(revenue_data.clone());
        let revenue_growth = if revenue_data.len() >= 2 {
            ((revenue_data[revenue_data.len() - 1] - revenue_data[0]) / revenue_data[0]) * 100.0
        } else {
            0.0
        };
        
        if revenue_growth > 10.0 {
            insights.push(BusinessInsight {
                insight_type: "REVENUE_GROWTH".to_string(),
                description: format!("Revenue has grown by {:.1}% with strong trend strength", revenue_growth),
                impact_score: revenue_trend,
                confidence_level: 85.0,
                recommended_actions: vec![
                    "Investigate growth drivers".to_string(),
                    "Scale successful initiatives".to_string(),
                ],
                data_sources: vec!["REVENUE_DATA".to_string()],
            });
        }
    }
    
    // Cost optimization insight
    if !cost_data.is_empty() && !revenue_data.is_empty() {
        let avg_revenue = revenue_data.iter().sum::<f64>() / revenue_data.len() as f64;
        let avg_cost = cost_data.iter().sum::<f64>() / cost_data.len() as f64;
        let profit_margin = if avg_revenue > 0.0 {
            ((avg_revenue - avg_cost) / avg_revenue) * 100.0
        } else {
            0.0
        };
        
        if profit_margin < 20.0 {
            insights.push(BusinessInsight {
                insight_type: "COST_OPTIMIZATION".to_string(),
                description: format!("Profit margin is {:.1}%, below optimal range", profit_margin),
                impact_score: 20.0 - profit_margin,
                confidence_level: 90.0,
                recommended_actions: vec![
                    "Review cost structure".to_string(),
                    "Identify cost reduction opportunities".to_string(),
                ],
                data_sources: vec!["REVENUE_DATA".to_string(), "COST_DATA".to_string()],
            });
        }
    }
    
    insights
}

#[napi]
pub fn calculate_cohort_retention(
    cohort_sizes: Vec<i32>,
    retained_users: Vec<i32>,
) -> Vec<f64> {
    if cohort_sizes.len() != retained_users.len() {
        return Vec::new();
    }
    
    cohort_sizes.iter()
        .zip(retained_users.iter())
        .map(|(&size, &retained)| {
            if size > 0 {
                (retained as f64 / size as f64) * 100.0
            } else {
                0.0
            }
        })
        .collect()
}

#[napi]
pub fn calculate_conversion_funnel(
    funnel_steps: Vec<i32>,
) -> Vec<f64> {
    if funnel_steps.is_empty() {
        return Vec::new();
    }
    
    let initial_count = funnel_steps[0] as f64;
    if initial_count == 0.0 {
        return vec![0.0; funnel_steps.len()];
    }
    
    funnel_steps.iter()
        .map(|&count| (count as f64 / initial_count) * 100.0)
        .collect()
}

#[napi]
pub fn optimize_dashboard_layout(
    kpi_importance_scores: Vec<f64>,
    kpi_names: Vec<String>,
    max_display_items: i32,
) -> Vec<String> {
    if kpi_importance_scores.len() != kpi_names.len() {
        return Vec::new();
    }
    
    // Create (name, score) pairs and sort by importance
    let mut kpi_pairs: Vec<_> = kpi_names.into_iter()
        .zip(kpi_importance_scores.into_iter())
        .collect();
    
    kpi_pairs.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());
    
    // Return top KPIs up to max display limit
    kpi_pairs.into_iter()
        .take(max_display_items as usize)
        .map(|(name, _)| name)
        .collect()
}