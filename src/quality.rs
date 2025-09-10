use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct QualityMetrics {
    pub defect_rate: f64,
    pub first_pass_yield: f64,
    pub customer_satisfaction: f64,
    pub process_capability: f64,
    pub supplier_quality_rating: f64,
    pub overall_quality_score: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct DefectData {
    pub defect_id: String,
    pub defect_type: String,
    pub severity: String,
    pub detection_stage: String,
    pub root_cause: String,
    pub cost_impact: f64,
    pub occurrence_count: i32,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct ProcessCapability {
    pub process_name: String,
    pub cp: f64,        // Process Capability
    pub cpk: f64,       // Process Capability Index
    pub pp: f64,        // Process Performance
    pub ppk: f64,       // Process Performance Index
    pub sigma_level: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct QualityInspection {
    pub inspection_id: String,
    pub product_batch: String,
    pub inspector: String,
    pub total_units: i32,
    pub passed_units: i32,
    pub failed_units: i32,
    pub defects_found: Vec<DefectData>,
    pub inspection_score: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct SixSigmaAnalysis {
    pub process_name: String,
    pub dpmo: f64,      // Defects Per Million Opportunities
    pub sigma_level: f64,
    pub process_yield: f64,
    pub improvement_potential: f64,
    pub recommended_actions: Vec<String>,
}

#[napi]
pub fn calculate_defect_rate(total_units: i32, defective_units: i32) -> f64 {
    if total_units == 0 {
        return 0.0;
    }
    (defective_units as f64 / total_units as f64) * 100.0
}

#[napi]
pub fn calculate_first_pass_yield(total_units: i32, first_pass_units: i32) -> f64 {
    if total_units == 0 {
        return 0.0;
    }
    (first_pass_units as f64 / total_units as f64) * 100.0
}

#[napi]
pub fn calculate_process_capability(
    upper_spec_limit: f64,
    lower_spec_limit: f64,
    process_mean: f64,
    process_std_dev: f64,
) -> ProcessCapability {
    let spec_width = upper_spec_limit - lower_spec_limit;
    let process_spread = 6.0 * process_std_dev;
    
    // Cp - Process Capability (potential capability)
    let cp = spec_width / process_spread;
    
    // Cpk - Process Capability Index (actual capability)
    let cpu = (upper_spec_limit - process_mean) / (3.0 * process_std_dev);
    let cpl = (process_mean - lower_spec_limit) / (3.0 * process_std_dev);
    let cpk = cpu.min(cpl);
    
    // Pp and Ppk (performance indices, using actual process variation)
    let pp = cp; // Simplified - in practice, would use long-term std dev
    let ppk = cpk; // Simplified - in practice, would use long-term data
    
    // Sigma level calculation
    let sigma_level = cpk * 3.0 + 1.5; // Approximate conversion
    
    ProcessCapability {
        process_name: "Process".to_string(),
        cp,
        cpk,
        pp,
        ppk,
        sigma_level: sigma_level.max(0.0).min(6.0),
    }
}

#[napi]
pub fn calculate_dpmo(defects: i32, units: i32, opportunities_per_unit: i32) -> f64 {
    if units == 0 || opportunities_per_unit == 0 {
        return 0.0;
    }
    
    let total_opportunities = units as f64 * opportunities_per_unit as f64;
    (defects as f64 / total_opportunities) * 1_000_000.0
}

#[napi]
pub fn calculate_sigma_level(dpmo: f64) -> f64 {
    // Approximate sigma level calculation based on DPMO
    match dpmo {
        d if d >= 691_462.0 => 1.0,
        d if d >= 308_538.0 => 2.0,
        d if d >= 66_807.0 => 3.0,
        d if d >= 6_210.0 => 4.0,
        d if d >= 233.0 => 5.0,
        d if d >= 3.4 => 6.0,
        _ => 6.0,
    }
}

#[napi]
pub fn perform_six_sigma_analysis(
    process_name: String,
    defects: i32,
    units: i32,
    opportunities_per_unit: i32,
) -> SixSigmaAnalysis {
    let dpmo = calculate_dpmo(defects, units, opportunities_per_unit);
    let sigma_level = calculate_sigma_level(dpmo);
    let process_yield = ((1.0 - (dpmo / 1_000_000.0)) * 100.0).max(0.0);
    
    // Calculate improvement potential
    let target_sigma = 6.0;
    let improvement_potential = if sigma_level < target_sigma {
        ((target_sigma - sigma_level) / target_sigma) * 100.0
    } else {
        0.0
    };
    
    // Generate recommendations based on sigma level
    let recommended_actions = match sigma_level {
        s if s < 3.0 => vec![
            "Implement basic quality control measures".to_string(),
            "Establish process documentation and training".to_string(),
            "Focus on defect prevention rather than detection".to_string(),
        ],
        s if s < 4.0 => vec![
            "Implement statistical process control".to_string(),
            "Reduce process variation through automation".to_string(),
            "Establish supplier quality programs".to_string(),
        ],
        s if s < 5.0 => vec![
            "Focus on continuous improvement initiatives".to_string(),
            "Implement advanced quality planning".to_string(),
            "Develop predictive quality analytics".to_string(),
        ],
        _ => vec![
            "Maintain current excellence".to_string(),
            "Share best practices across organization".to_string(),
            "Focus on innovation and breakthrough improvements".to_string(),
        ],
    };
    
    SixSigmaAnalysis {
        process_name,
        dpmo,
        sigma_level,
        process_yield,
        improvement_potential,
        recommended_actions,
    }
}

#[napi]
pub fn calculate_customer_satisfaction_score(
    ratings: Vec<i32>,
    complaints: i32,
    total_customers: i32,
) -> f64 {
    if ratings.is_empty() || total_customers == 0 {
        return 0.0;
    }
    
    // Calculate average rating (assuming 1-10 scale)
    let avg_rating = ratings.iter().sum::<i32>() as f64 / ratings.len() as f64;
    let rating_score = (avg_rating / 10.0) * 100.0;
    
    // Apply penalty for complaints
    let complaint_rate = complaints as f64 / total_customers as f64;
    let complaint_penalty = complaint_rate * 20.0; // 20% penalty per 1% complaint rate
    
    (rating_score - complaint_penalty).max(0.0).min(100.0)
}

#[napi]
pub fn analyze_defect_patterns(defects: Vec<DefectData>) -> Vec<String> {
    if defects.is_empty() {
        return vec!["No defects to analyze".to_string()];
    }
    
    let mut patterns = Vec::new();
    
    // Count defects by type
    let mut type_counts: std::collections::HashMap<String, i32> = std::collections::HashMap::new();
    let mut severity_counts: std::collections::HashMap<String, i32> = std::collections::HashMap::new();
    let mut total_cost = 0.0;
    
    for defect in &defects {
        *type_counts.entry(defect.defect_type.clone()).or_insert(0) += defect.occurrence_count;
        *severity_counts.entry(defect.severity.clone()).or_insert(0) += defect.occurrence_count;
        total_cost += defect.cost_impact;
    }
    
    // Find most common defect type
    if let Some((most_common_type, count)) = type_counts.iter().max_by_key(|(_, &count)| count) {
        patterns.push(format!("Most common defect type: {} ({} occurrences)", most_common_type, count));
    }
    
    // Check for critical severity concentration
    let critical_count = severity_counts.get("CRITICAL").unwrap_or(&0);
    let total_defects: i32 = severity_counts.values().sum();
    
    if total_defects > 0 && (*critical_count as f64 / total_defects as f64) > 0.1 {
        patterns.push("High concentration of critical defects detected".to_string());
    }
    
    // Cost analysis
    if total_cost > 10000.0 {
        patterns.push(format!("High cost impact detected: ${:.2}", total_cost));
    }
    
    if patterns.is_empty() {
        patterns.push("No significant patterns detected".to_string());
    }
    
    patterns
}

#[napi]
pub fn calculate_supplier_quality_rating(
    delivered_batches: i32,
    defective_batches: i32,
    average_defect_rate: f64,
    on_time_delivery_rate: f64,
) -> f64 {
    if delivered_batches == 0 {
        return 0.0;
    }
    
    // Quality score (60% weight)
    let batch_quality = ((delivered_batches - defective_batches) as f64 / delivered_batches as f64) * 100.0;
    let defect_quality = (100.0 - average_defect_rate).max(0.0);
    let quality_score = (batch_quality + defect_quality) / 2.0;
    
    // Delivery score (40% weight)
    let delivery_score = on_time_delivery_rate;
    
    (quality_score * 0.6) + (delivery_score * 0.4)
}

#[napi]
pub fn generate_quality_metrics(
    inspections: Vec<QualityInspection>,
    defects: Vec<DefectData>,
    customer_ratings: Vec<i32>,
    customer_complaints: i32,
    total_customers: i32,
) -> QualityMetrics {
    // Calculate defect rate
    let total_units: i32 = inspections.iter().map(|i| i.total_units).sum();
    let total_defects: i32 = defects.iter().map(|d| d.occurrence_count).sum();
    let defect_rate = calculate_defect_rate(total_units, total_defects);
    
    // Calculate first pass yield
    let total_passed: i32 = inspections.iter().map(|i| i.passed_units).sum();
    let first_pass_yield = calculate_first_pass_yield(total_units, total_passed);
    
    // Calculate customer satisfaction
    let customer_satisfaction = calculate_customer_satisfaction_score(
        customer_ratings,
        customer_complaints,
        total_customers,
    );
    
    // Process capability (simplified - would need actual process data)
    let process_capability = if total_units > 0 {
        85.0 - (defect_rate * 2.0) // Simplified calculation
    } else {
        0.0
    }.max(0.0).min(100.0);
    
    // Supplier quality rating (simplified)
    let supplier_quality_rating = if total_units > 0 {
        90.0 - defect_rate
    } else {
        0.0
    }.max(0.0).min(100.0);
    
    // Overall quality score (weighted average)
    let overall_quality_score = (
        (first_pass_yield * 0.3) +
        (customer_satisfaction * 0.25) +
        (process_capability * 0.2) +
        (supplier_quality_rating * 0.15) +
        ((100.0 - defect_rate) * 0.1)
    ).max(0.0).min(100.0);
    
    QualityMetrics {
        defect_rate,
        first_pass_yield,
        customer_satisfaction,
        process_capability,
        supplier_quality_rating,
        overall_quality_score,
    }
}

#[napi]
pub fn calculate_quality_cost(
    prevention_costs: f64,
    appraisal_costs: f64,
    internal_failure_costs: f64,
    external_failure_costs: f64,
    total_revenue: f64,
) -> f64 {
    let total_quality_cost = prevention_costs + appraisal_costs + internal_failure_costs + external_failure_costs;
    
    if total_revenue > 0.0 {
        (total_quality_cost / total_revenue) * 100.0
    } else {
        0.0
    }
}