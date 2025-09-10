use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct RentalAsset {
    pub asset_id: String,
    pub asset_type: String,
    pub description: String,
    pub acquisition_cost: f64,
    pub current_value: f64,
    pub daily_rental_rate: f64,
    pub utilization_rate: f64,
    pub maintenance_cost_per_day: f64,
    pub condition_score: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct RentalPricing {
    pub base_daily_rate: f64,
    pub seasonal_adjustment: f64,
    pub demand_adjustment: f64,
    pub condition_adjustment: f64,
    pub recommended_rate: f64,
    pub competitive_position: String,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct UtilizationAnalysis {
    pub asset_id: String,
    pub total_available_days: i32,
    pub rented_days: i32,
    pub utilization_percentage: f64,
    pub revenue_generated: f64,
    pub lost_revenue_opportunity: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct RentalMetrics {
    pub total_assets: i32,
    pub average_utilization: f64,
    pub total_revenue: f64,
    pub total_maintenance_cost: f64,
    pub net_profit: f64,
    pub roi_percentage: f64,
    pub fleet_efficiency_score: f64,
}

#[napi]
pub fn calculate_optimal_rental_pricing(
    base_rate: f64,
    market_demand_factor: f64,
    seasonal_factor: f64,
    asset_condition_score: f64,
    competitor_rates: Vec<f64>,
) -> RentalPricing {
    let demand_adjustment = (market_demand_factor - 1.0) * 0.2; // Max 20% adjustment
    let seasonal_adjustment = (seasonal_factor - 1.0) * 0.15; // Max 15% adjustment
    let condition_adjustment = (asset_condition_score / 100.0) * 0.1; // Max 10% adjustment
    
    let adjusted_rate = base_rate * (1.0 + demand_adjustment + seasonal_adjustment + condition_adjustment);
    
    // Compare with competitor rates
    let avg_competitor_rate = if !competitor_rates.is_empty() {
        competitor_rates.iter().sum::<f64>() / competitor_rates.len() as f64
    } else {
        adjusted_rate
    };
    
    let competitive_position = if adjusted_rate < avg_competitor_rate * 0.9 {
        "BELOW_MARKET"
    } else if adjusted_rate > avg_competitor_rate * 1.1 {
        "ABOVE_MARKET"
    } else {
        "COMPETITIVE"
    };
    
    RentalPricing {
        base_daily_rate: base_rate,
        seasonal_adjustment: seasonal_factor,
        demand_adjustment: market_demand_factor,
        condition_adjustment: asset_condition_score,
        recommended_rate: adjusted_rate,
        competitive_position: competitive_position.to_string(),
    }
}

#[napi]
pub fn calculate_utilization_metrics(
    total_available_days: i32,
    rented_days: i32,
    daily_rate: f64,
) -> UtilizationAnalysis {
    let utilization_percentage = if total_available_days > 0 {
        (rented_days as f64 / total_available_days as f64) * 100.0
    } else {
        0.0
    };
    
    let revenue_generated = rented_days as f64 * daily_rate;
    let potential_revenue = total_available_days as f64 * daily_rate;
    let lost_revenue_opportunity = potential_revenue - revenue_generated;
    
    UtilizationAnalysis {
        asset_id: "".to_string(), // To be set by caller
        total_available_days,
        rented_days,
        utilization_percentage,
        revenue_generated,
        lost_revenue_opportunity,
    }
}

#[napi]
pub fn calculate_rental_roi(
    initial_investment: f64,
    annual_revenue: f64,
    annual_operating_costs: f64,
    depreciation: f64,
) -> f64 {
    let net_annual_income = annual_revenue - annual_operating_costs - depreciation;
    if initial_investment > 0.0 {
        (net_annual_income / initial_investment) * 100.0
    } else {
        0.0
    }
}

#[napi]
pub fn optimize_fleet_allocation(
    assets: Vec<RentalAsset>,
    demand_forecast: Vec<f64>, // Daily demand forecast
    target_utilization: f64,
) -> Vec<String> {
    if assets.is_empty() {
        return Vec::new();
    }
    
    // Calculate efficiency score for each asset
    let mut asset_efficiency: Vec<_> = assets.iter()
        .map(|asset| {
            let efficiency = (asset.utilization_rate * asset.daily_rental_rate) / 
                           (asset.maintenance_cost_per_day + 1.0);
            (asset.asset_id.clone(), efficiency)
        })
        .collect();
    
    // Sort by efficiency (descending)
    asset_efficiency.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());
    
    // Select assets to meet target utilization
    let total_demand: f64 = demand_forecast.iter().sum();
    let daily_average_demand = total_demand / demand_forecast.len() as f64;
    
    let required_capacity = daily_average_demand / (target_utilization / 100.0);
    let assets_needed = (required_capacity / assets.len() as f64).ceil() as usize;
    
    asset_efficiency.into_iter()
        .take(assets_needed)
        .map(|(id, _)| id)
        .collect()
}

#[napi]
pub fn calculate_maintenance_scheduling(
    asset_condition_scores: Vec<f64>,
    usage_hours: Vec<f64>,
    maintenance_thresholds: Vec<f64>,
) -> Vec<i32> {
    if asset_condition_scores.is_empty() {
        return Vec::new();
    }
    
    asset_condition_scores.iter()
        .zip(usage_hours.iter())
        .zip(maintenance_thresholds.iter())
        .enumerate()
        .filter_map(|(i, ((&condition, &usage), &threshold))| {
            if condition < 70.0 || usage > threshold {
                Some(i as i32) // Return asset index
            } else {
                None
            }
        })
        .collect()
}

#[napi]
pub fn calculate_depreciation_schedule(
    initial_value: f64,
    useful_life_years: f64,
    salvage_value: f64,
    depreciation_method: String,
) -> f64 {
    match depreciation_method.as_str() {
        "STRAIGHT_LINE" => {
            if useful_life_years > 0.0 {
                (initial_value - salvage_value) / useful_life_years
            } else {
                0.0
            }
        },
        "DECLINING_BALANCE" => {
            let rate = 2.0 / useful_life_years; // Double declining balance
            initial_value * rate
        },
        "UNITS_OF_PRODUCTION" => {
            // Simplified - would need actual usage data
            (initial_value - salvage_value) * 0.1 // 10% per period
        },
        _ => {
            // Default to straight line
            if useful_life_years > 0.0 {
                (initial_value - salvage_value) / useful_life_years
            } else {
                0.0
            }
        }
    }
}

#[napi]
pub fn calculate_demand_forecasting(
    historical_demand: Vec<f64>,
    seasonal_factors: Vec<f64>,
    trend_factor: f64,
    periods_ahead: i32,
) -> Vec<f64> {
    if historical_demand.is_empty() {
        return Vec::new();
    }
    
    let base_demand = historical_demand.iter().sum::<f64>() / historical_demand.len() as f64;
    let mut forecasts = Vec::new();
    
    for i in 0..periods_ahead {
        let seasonal_factor = if !seasonal_factors.is_empty() {
            seasonal_factors[i as usize % seasonal_factors.len()]
        } else {
            1.0
        };
        
        let trend_adjustment = 1.0 + (trend_factor * i as f64 / 12.0); // Monthly trend
        let forecast = base_demand * seasonal_factor * trend_adjustment;
        forecasts.push(forecast);
    }
    
    forecasts
}

#[napi]
pub fn optimize_pricing_strategy(
    current_rates: Vec<f64>,
    utilization_rates: Vec<f64>,
    target_utilization: f64,
    price_elasticity: f64,
) -> Vec<f64> {
    if current_rates.is_empty() || utilization_rates.is_empty() {
        return Vec::new();
    }
    
    let mut optimized_rates = Vec::new();
    
    for i in 0..current_rates.len().min(utilization_rates.len()) {
        let current_rate = current_rates[i];
        let current_util = utilization_rates[i];
        
        // Calculate price adjustment based on utilization gap
        let utilization_gap = target_utilization - current_util;
        let price_adjustment = utilization_gap * price_elasticity;
        
        // Apply adjustment (negative gap = lower price to increase demand)
        let new_rate = current_rate * (1.0 - price_adjustment / 100.0);
        optimized_rates.push(new_rate.max(current_rate * 0.7)); // Minimum 70% of current rate
    }
    
    optimized_rates
}

#[napi]
pub fn calculate_break_even_utilization(
    fixed_costs: f64,
    variable_cost_per_day: f64,
    daily_rental_rate: f64,
    days_in_period: i32,
) -> f64 {
    let contribution_per_day = daily_rental_rate - variable_cost_per_day;
    if contribution_per_day > 0.0 {
        let break_even_days = fixed_costs / contribution_per_day;
        (break_even_days / days_in_period as f64) * 100.0
    } else {
        100.0 // Cannot break even
    }
}

#[napi]
pub fn generate_rental_metrics(
    assets: Vec<RentalAsset>,
    total_maintenance_cost: f64,
) -> RentalMetrics {
    let total_assets = assets.len() as i32;
    
    let average_utilization = if !assets.is_empty() {
        assets.iter().map(|a| a.utilization_rate).sum::<f64>() / assets.len() as f64
    } else {
        0.0
    };
    
    // Calculate total revenue (assuming annual)
    let total_revenue: f64 = assets.iter()
        .map(|a| a.daily_rental_rate * a.utilization_rate * 365.0 / 100.0)
        .sum();
    
    let net_profit = total_revenue - total_maintenance_cost;
    
    let total_investment: f64 = assets.iter().map(|a| a.acquisition_cost).sum();
    let roi_percentage = if total_investment > 0.0 {
        (net_profit / total_investment) * 100.0
    } else {
        0.0
    };
    
    let fleet_efficiency_score = (average_utilization + roi_percentage) / 2.0;
    
    RentalMetrics {
        total_assets,
        average_utilization,
        total_revenue,
        total_maintenance_cost,
        net_profit,
        roi_percentage,
        fleet_efficiency_score,
    }
}