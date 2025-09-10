use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct ReportMetrics {
    pub total_records: i32,
    pub processing_time_ms: f64,
    pub data_accuracy_score: f64,
    pub completeness_percentage: f64,
    pub report_size_mb: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct ReportingDataTransformation {
    pub source_format: String,
    pub target_format: String,
    pub transformation_rules: Vec<String>,
    pub success_rate: f64,
    pub processing_time: f64,
}

#[napi]
pub fn calculate_report_processing_time(
    data_volume_mb: f64,
    complexity_factor: f64,
    processing_power_factor: f64,
) -> f64 {
    let base_time = data_volume_mb * 0.1; // 0.1 seconds per MB
    let complexity_adjustment = base_time * complexity_factor;
    let final_time = complexity_adjustment / processing_power_factor;
    final_time.max(0.1) // Minimum 0.1 seconds
}

#[napi]
pub fn calculate_data_aggregation_efficiency(
    input_records: i32,
    output_records: i32,
    processing_time: f64,
) -> f64 {
    if processing_time > 0.0 && input_records > 0 {
        let compression_ratio = input_records as f64 / output_records as f64;
        let records_per_second = input_records as f64 / processing_time;
        (compression_ratio * records_per_second).min(100.0)
    } else {
        0.0
    }
}

#[napi]
pub fn optimize_report_caching(
    report_frequency: f64,    // Reports per day
    report_size_mb: f64,
    cache_hit_rate: f64,
    cache_cost_per_mb: f64,
) -> f64 {
    let daily_cache_volume = report_frequency * report_size_mb * cache_hit_rate;
    let cache_savings = daily_cache_volume * (1.0 - cache_cost_per_mb);
    cache_savings
}

#[napi]
pub fn calculate_report_accuracy_score(
    correct_values: i32,
    total_values: i32,
    critical_errors: i32,
    minor_errors: i32,
) -> f64 {
    if total_values == 0 {
        return 0.0;
    }
    
    let base_accuracy = (correct_values as f64 / total_values as f64) * 100.0;
    let critical_penalty = critical_errors as f64 * 5.0;
    let minor_penalty = minor_errors as f64 * 1.0;
    
    (base_accuracy - critical_penalty - minor_penalty).max(0.0)
}

#[napi]
pub fn generate_report_metrics(
    total_records: i32,
    processing_time_ms: f64,
    correct_records: i32,
    complete_records: i32,
    report_size_mb: f64,
) -> ReportMetrics {
    let data_accuracy_score = if total_records > 0 {
        (correct_records as f64 / total_records as f64) * 100.0
    } else {
        0.0
    };
    
    let completeness_percentage = if total_records > 0 {
        (complete_records as f64 / total_records as f64) * 100.0
    } else {
        0.0
    };
    
    ReportMetrics {
        total_records,
        processing_time_ms,
        data_accuracy_score,
        completeness_percentage,
        report_size_mb,
    }
}

#[napi]
pub fn optimize_data_transformation(
    source_records: i32,
    transformation_complexity: f64,
    target_format_efficiency: f64,
) -> ReportingDataTransformation {
    let base_processing_time = source_records as f64 * 0.001; // 1ms per record
    let complexity_adjusted_time = base_processing_time * transformation_complexity;
    let final_processing_time = complexity_adjusted_time / target_format_efficiency;
    
    let success_rate = (100.0 - transformation_complexity * 2.0).max(85.0);
    
    ReportingDataTransformation {
        source_format: "SOURCE".to_string(),
        target_format: "TARGET".to_string(),
        transformation_rules: vec!["RULE_1".to_string(), "RULE_2".to_string()],
        success_rate,
        processing_time: final_processing_time,
    }
}