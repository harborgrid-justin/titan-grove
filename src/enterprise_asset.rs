use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct EnterpriseAsset {
    pub asset_id: String,
    pub asset_type: String,
    pub location: String,
    pub acquisition_cost: f64,
    pub current_value: f64,
    pub lifecycle_stage: String,
    pub condition_rating: f64,
    pub utilization_rate: f64,
    pub annual_maintenance_cost: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct AssetLifecycleMetrics {
    pub total_cost_of_ownership: f64,
    pub remaining_useful_life: f64,
    pub replacement_timeline: i32,
    pub maintenance_efficiency: f64,
    pub asset_value_retention: f64,
}

#[napi]
pub fn calculate_total_cost_of_ownership(
    acquisition_cost: f64,
    annual_operating_costs: Vec<f64>,
    annual_maintenance_costs: Vec<f64>,
    disposal_value: f64,
    discount_rate: f64,
) -> f64 {
    let mut tco = acquisition_cost;
    
    for (year, (&operating, &maintenance)) in annual_operating_costs.iter()
        .zip(annual_maintenance_costs.iter())
        .enumerate() {
        let annual_cost = operating + maintenance;
        let present_value = annual_cost / (1.0 + discount_rate / 100.0).powi((year + 1) as i32);
        tco += present_value;
    }
    
    // Subtract present value of disposal value
    let years = annual_operating_costs.len() as i32;
    let pv_disposal = disposal_value / (1.0 + discount_rate / 100.0).powi(years);
    tco - pv_disposal
}

#[napi]
pub fn calculate_asset_reliability_score(
    uptime_percentage: f64,
    mtbf_hours: f64, // Mean Time Between Failures
    mttr_hours: f64, // Mean Time To Repair
) -> f64 {
    let availability_score = uptime_percentage;
    let reliability_score = (mtbf_hours / (mtbf_hours + mttr_hours)) * 100.0;
    (availability_score + reliability_score) / 2.0
}

#[napi]
pub fn optimize_replacement_schedule(
    assets: Vec<EnterpriseAsset>,
    budget_constraint: f64,
    replacement_costs: Vec<f64>,
) -> Vec<String> {
    if assets.is_empty() || replacement_costs.is_empty() {
        return Vec::new();
    }
    
    // Calculate replacement priority score
    let mut asset_priorities: Vec<_> = assets.iter()
        .zip(replacement_costs.iter())
        .map(|(asset, &cost)| {
            let age_factor = match asset.lifecycle_stage.as_str() {
                "END_OF_LIFE" => 100.0,
                "AGING" => 80.0,
                "MATURE" => 60.0,
                "PRIME" => 30.0,
                "NEW" => 10.0,
                _ => 50.0,
            };
            
            let condition_factor = 100.0 - asset.condition_rating;
            let utilization_factor = asset.utilization_rate;
            
            let priority_score = (age_factor + condition_factor + utilization_factor) / 3.0;
            (asset.asset_id.clone(), priority_score, cost)
        })
        .collect();
    
    // Sort by priority (descending) then by cost (ascending)
    asset_priorities.sort_by(|a, b| {
        b.1.partial_cmp(&a.1).unwrap()
            .then(a.2.partial_cmp(&b.2).unwrap())
    });
    
    // Select assets within budget
    let mut selected_assets = Vec::new();
    let mut remaining_budget = budget_constraint;
    
    for (asset_id, _priority, cost) in asset_priorities {
        if remaining_budget >= cost {
            selected_assets.push(asset_id);
            remaining_budget -= cost;
        }
    }
    
    selected_assets
}

#[napi]
pub fn calculate_asset_performance_index(
    actual_output: f64,
    design_capacity: f64,
    availability: f64,
    quality_rate: f64,
) -> f64 {
    let performance_rate = if design_capacity > 0.0 {
        (actual_output / design_capacity) * 100.0
    } else {
        0.0
    };
    
    // Overall Equipment Effectiveness (OEE) calculation
    (availability * performance_rate * quality_rate) / 10000.0 * 100.0
}

#[napi]
pub fn generate_asset_lifecycle_metrics(
    asset: EnterpriseAsset,
    useful_life_years: f64,
    age_years: f64,
) -> AssetLifecycleMetrics {
    let remaining_useful_life = (useful_life_years - age_years).max(0.0);
    let replacement_timeline = if remaining_useful_life <= 2.0 {
        1 // Replace within 1 year
    } else if remaining_useful_life <= 5.0 {
        2 // Replace within 2 years
    } else {
        5 // Replace within 5 years
    };
    
    let maintenance_efficiency = if asset.annual_maintenance_cost > 0.0 {
        (asset.utilization_rate / asset.annual_maintenance_cost * 1000.0).min(100.0)
    } else {
        100.0
    };
    
    let asset_value_retention = (asset.current_value / asset.acquisition_cost) * 100.0;
    
    AssetLifecycleMetrics {
        total_cost_of_ownership: asset.acquisition_cost + (asset.annual_maintenance_cost * age_years),
        remaining_useful_life,
        replacement_timeline,
        maintenance_efficiency,
        asset_value_retention,
    }
}