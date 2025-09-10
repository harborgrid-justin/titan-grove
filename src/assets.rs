use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct Asset {
    pub asset_id: String,
    pub asset_code: String,
    pub asset_name: String,
    pub asset_type: String,
    pub acquisition_cost: f64,
    pub acquisition_date: i64,
    pub useful_life_years: i32,
    pub current_book_value: f64,
    pub accumulated_depreciation: f64,
    pub status: String,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct DepreciationCalculation {
    pub asset_id: String,
    pub method: String,
    pub annual_depreciation: f64,
    pub monthly_depreciation: f64,
    pub remaining_book_value: f64,
    pub years_remaining: f64,
    pub fully_depreciated_date: i64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct AssetMetrics {
    pub total_assets: i32,
    pub total_acquisition_cost: f64,
    pub total_current_value: f64,
    pub total_depreciation: f64,
    pub average_asset_age_years: f64,
    pub assets_due_for_replacement: i32,
    pub return_on_assets: f64,
}

#[napi]
pub fn calculate_straight_line_depreciation(
    acquisition_cost: f64,
    salvage_value: f64,
    useful_life_years: i32,
    years_in_service: f64,
) -> DepreciationCalculation {
    let depreciable_amount = acquisition_cost - salvage_value;
    let annual_depreciation = if useful_life_years > 0 {
        depreciable_amount / useful_life_years as f64
    } else {
        0.0
    };
    
    let monthly_depreciation = annual_depreciation / 12.0;
    let total_depreciation = annual_depreciation * years_in_service;
    let remaining_book_value = (acquisition_cost - total_depreciation).max(salvage_value);
    let years_remaining = (useful_life_years as f64 - years_in_service).max(0.0);
    
    // Calculate fully depreciated date
    let current_timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;
    
    let days_to_full_depreciation = (years_remaining * 365.0) as i64;
    let fully_depreciated_date = current_timestamp + (days_to_full_depreciation * 24 * 60 * 60);
    
    DepreciationCalculation {
        asset_id: "unknown".to_string(),
        method: "STRAIGHT_LINE".to_string(),
        annual_depreciation,
        monthly_depreciation,
        remaining_book_value,
        years_remaining,
        fully_depreciated_date,
    }
}

#[napi]
pub fn calculate_declining_balance_depreciation(
    acquisition_cost: f64,
    depreciation_rate: f64,
    years_in_service: f64,
) -> DepreciationCalculation {
    let annual_depreciation_rate = depreciation_rate / 100.0;
    let remaining_factor = (1.0 - annual_depreciation_rate).powf(years_in_service);
    let current_book_value = acquisition_cost * remaining_factor;
    let _total_depreciation = acquisition_cost - current_book_value;
    let annual_depreciation = current_book_value * annual_depreciation_rate;
    let monthly_depreciation = annual_depreciation / 12.0;
    
    // Estimate years to full depreciation (when book value < 10% of original cost)
    let target_value = acquisition_cost * 0.1;
    let years_remaining = if current_book_value > target_value {
        (target_value / current_book_value).ln() / (1.0 - annual_depreciation_rate).ln()
    } else {
        0.0
    };
    
    let current_timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;
    
    let days_to_target = (years_remaining * 365.0) as i64;
    let fully_depreciated_date = current_timestamp + (days_to_target * 24 * 60 * 60);
    
    DepreciationCalculation {
        asset_id: "unknown".to_string(),
        method: "DECLINING_BALANCE".to_string(),
        annual_depreciation,
        monthly_depreciation,
        remaining_book_value: current_book_value,
        years_remaining,
        fully_depreciated_date,
    }
}

#[napi]
pub fn calculate_asset_age_years(acquisition_date: i64) -> f64 {
    let current_timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;
    
    let age_seconds = current_timestamp - acquisition_date;
    let age_days = age_seconds / (24 * 60 * 60);
    age_days as f64 / 365.0
}

#[napi]
pub fn calculate_asset_utilization_rate(
    actual_usage_hours: f64,
    available_hours: f64,
) -> f64 {
    if available_hours <= 0.0 {
        return 0.0;
    }
    
    (actual_usage_hours / available_hours * 100.0).min(100.0)
}

#[napi]
pub fn assess_asset_replacement_need(
    asset: Asset,
    maintenance_cost_annual: f64,
    downtime_cost_annual: f64,
    replacement_threshold_percentage: f64,
) -> bool {
    let asset_age = calculate_asset_age_years(asset.acquisition_date);
    let age_ratio = asset_age / asset.useful_life_years as f64;
    
    // Calculate total cost of ownership
    let total_annual_cost = maintenance_cost_annual + downtime_cost_annual;
    let cost_ratio = total_annual_cost / asset.acquisition_cost;
    
    // Replacement criteria
    let age_criterion = age_ratio > 0.8; // Asset is 80% through useful life
    let cost_criterion = cost_ratio > (replacement_threshold_percentage / 100.0);
    let book_value_criterion = asset.current_book_value < (asset.acquisition_cost * 0.2);
    
    age_criterion || cost_criterion || book_value_criterion
}

#[napi]
pub fn calculate_return_on_assets(
    net_income: f64,
    total_asset_value: f64,
) -> f64 {
    if total_asset_value <= 0.0 {
        return 0.0;
    }
    
    (net_income / total_asset_value) * 100.0
}

#[napi]
pub fn generate_asset_metrics(
    assets: Vec<Asset>,
    annual_net_income: f64,
) -> AssetMetrics {
    let total_assets = assets.len() as i32;
    
    let total_acquisition_cost = assets.iter()
        .map(|a| a.acquisition_cost)
        .sum::<f64>();
    
    let total_current_value = assets.iter()
        .map(|a| a.current_book_value)
        .sum::<f64>();
    
    let total_depreciation = assets.iter()
        .map(|a| a.accumulated_depreciation)
        .sum::<f64>();
    
    // Calculate average asset age
    let total_age_years = assets.iter()
        .map(|a| calculate_asset_age_years(a.acquisition_date))
        .sum::<f64>();
    
    let average_asset_age_years = if total_assets > 0 {
        total_age_years / total_assets as f64
    } else {
        0.0
    };
    
    // Count assets due for replacement (simplified criteria)
    let assets_due_for_replacement = assets.iter()
        .filter(|a| {
            let age = calculate_asset_age_years(a.acquisition_date);
            let age_ratio = age / a.useful_life_years as f64;
            age_ratio > 0.85 || a.current_book_value < (a.acquisition_cost * 0.15)
        })
        .count() as i32;
    
    let return_on_assets = calculate_return_on_assets(annual_net_income, total_current_value);
    
    AssetMetrics {
        total_assets,
        total_acquisition_cost,
        total_current_value,
        total_depreciation,
        average_asset_age_years,
        assets_due_for_replacement,
        return_on_assets,
    }
}

#[napi]
pub fn optimize_asset_portfolio(
    assets: Vec<Asset>,
    budget_constraint: f64,
    replacement_priority_threshold: f64,
) -> Vec<String> {
    let mut recommendations = Vec::new();
    let mut total_replacement_cost = 0.0;
    
    // Sort assets by replacement priority (age, condition, cost)
    let mut prioritized_assets: Vec<(Asset, f64)> = assets.into_iter()
        .map(|asset| {
            let age = calculate_asset_age_years(asset.acquisition_date);
            let age_factor = age / asset.useful_life_years as f64;
            let book_value_factor = 1.0 - (asset.current_book_value / asset.acquisition_cost);
            let priority_score = (age_factor * 0.6) + (book_value_factor * 0.4);
            (asset, priority_score)
        })
        .collect();
    
    prioritized_assets.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());
    
    for (asset, priority_score) in prioritized_assets {
        if priority_score > replacement_priority_threshold {
            let estimated_replacement_cost = asset.acquisition_cost * 1.1; // Assume 10% inflation
            
            if total_replacement_cost + estimated_replacement_cost <= budget_constraint {
                recommendations.push(format!(
                    "Replace {} (Priority: {:.2}) - Est. Cost: ${:.2}",
                    asset.asset_code, priority_score, estimated_replacement_cost
                ));
                total_replacement_cost += estimated_replacement_cost;
            } else {
                recommendations.push(format!(
                    "Defer replacement of {} due to budget constraints",
                    asset.asset_code
                ));
            }
        } else {
            recommendations.push(format!(
                "Continue using {} (Priority: {:.2})",
                asset.asset_code, priority_score
            ));
        }
    }
    
    if recommendations.is_empty() {
        recommendations.push("No immediate asset actions required".to_string());
    }
    
    recommendations
}