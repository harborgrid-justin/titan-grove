use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct PricingModel {
    pub model_id: String,
    pub product_id: String,
    pub base_price: f64,
    pub cost_plus_margin: f64,
    pub competitive_price: f64,
    pub value_based_price: f64,
    pub recommended_price: f64,
    pub price_elasticity: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct DynamicPricing {
    pub base_price: f64,
    pub demand_multiplier: f64,
    pub competition_factor: f64,
    pub inventory_factor: f64,
    pub seasonal_factor: f64,
    pub optimized_price: f64,
    pub expected_margin: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct PricingCostAnalysis {
    pub product_id: String,
    pub direct_materials: f64,
    pub direct_labor: f64,
    pub manufacturing_overhead: f64,
    pub total_cost: f64,
    pub target_margin_percentage: f64,
    pub minimum_selling_price: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct PriceOptimization {
    pub current_price: f64,
    pub optimal_price: f64,
    pub price_change_percentage: f64,
    pub revenue_impact: f64,
    pub volume_impact: f64,
    pub profit_impact: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct CompetitorPricing {
    pub competitor_name: String,
    pub competitor_price: f64,
    pub market_share: f64,
    pub price_position: String, // ABOVE, BELOW, EQUAL
    pub competitive_advantage: f64,
}

#[napi]
pub fn calculate_cost_plus_pricing(
    total_cost: f64,
    desired_margin_percentage: f64,
) -> f64 {
    total_cost * (1.0 + desired_margin_percentage / 100.0)
}

#[napi]
pub fn calculate_value_based_pricing(
    customer_value_perception: f64,
    competitive_price: f64,
    value_premium_percentage: f64,
) -> f64 {
    let value_price = customer_value_perception * (1.0 + value_premium_percentage / 100.0);
    value_price.min(competitive_price * 1.2) // Cap at 20% above competition
}

#[napi]
pub fn optimize_dynamic_pricing(
    base_price: f64,
    demand_level: f64,      // 0.0 to 2.0, where 1.0 is normal
    inventory_level: f64,   // 0.0 to 1.0, where 1.0 is full stock
    competitor_prices: Vec<f64>,
    price_elasticity: f64,  // -1.0 to 0.0, where -1.0 is highly elastic
) -> DynamicPricing {
    // Demand adjustment
    let demand_multiplier = if demand_level > 1.0 {
        1.0 + ((demand_level - 1.0) * 0.3) // Up to 30% increase for high demand
    } else {
        1.0 - ((1.0 - demand_level) * 0.2) // Up to 20% decrease for low demand
    };

    // Competition factor
    let avg_competitor_price = if !competitor_prices.is_empty() {
        competitor_prices.iter().sum::<f64>() / competitor_prices.len() as f64
    } else {
        base_price
    };
    
    let competition_factor = if avg_competitor_price > 0.0 {
        (avg_competitor_price / base_price).min(1.2).max(0.8) // Limit to ±20%
    } else {
        1.0
    };

    // Inventory factor
    let inventory_factor = if inventory_level < 0.2 {
        1.1 // 10% premium for low inventory
    } else if inventory_level > 0.8 {
        0.95 // 5% discount for high inventory
    } else {
        1.0
    };

    let optimized_price = base_price * demand_multiplier * competition_factor * inventory_factor;
    let expected_margin = ((optimized_price - base_price) / base_price) * 100.0;

    DynamicPricing {
        base_price,
        demand_multiplier,
        competition_factor,
        inventory_factor,
        seasonal_factor: 1.0, // Could be added
        optimized_price,
        expected_margin,
    }
}

#[napi]
pub fn calculate_price_elasticity_impact(
    current_price: f64,
    new_price: f64,
    price_elasticity: f64,
    current_volume: f64,
) -> f64 {
    let price_change_percentage = ((new_price - current_price) / current_price) * 100.0;
    let volume_change_percentage = price_change_percentage * price_elasticity;
    let new_volume = current_volume * (1.0 + volume_change_percentage / 100.0);
    new_volume
}

#[napi]
pub fn calculate_break_even_price(
    fixed_costs: f64,
    variable_cost_per_unit: f64,
    expected_volume: f64,
) -> f64 {
    if expected_volume > 0.0 {
        (fixed_costs / expected_volume) + variable_cost_per_unit
    } else {
        0.0
    }
}

#[napi]
pub fn optimize_bundle_pricing(
    individual_prices: Vec<f64>,
    individual_costs: Vec<f64>,
    bundle_discount_percentage: f64,
) -> f64 {
    let total_price: f64 = individual_prices.iter().sum();
    let total_cost: f64 = individual_costs.iter().sum();
    let bundle_price = total_price * (1.0 - bundle_discount_percentage / 100.0);
    
    // Ensure bundle still maintains minimum margin
    let minimum_price = total_cost * 1.2; // 20% minimum margin
    bundle_price.max(minimum_price)
}

#[napi]
pub fn calculate_psychological_pricing(
    calculated_price: f64,
    pricing_strategy: String,
) -> f64 {
    match pricing_strategy.as_str() {
        "CHARM" => {
            // Price ending in 9 (e.g., $19.99)
            let rounded = calculated_price.floor();
            if rounded >= 10.0 {
                rounded - 0.01
            } else {
                (rounded * 10.0 - 1.0) / 10.0
            }
        },
        "PRESTIGE" => {
            // Round number pricing for luxury (e.g., $20.00)
            calculated_price.round()
        },
        "PENETRATION" => {
            // Aggressive low pricing
            calculated_price * 0.9
        },
        "SKIMMING" => {
            // Premium pricing
            calculated_price * 1.15
        },
        _ => calculated_price,
    }
}

#[napi]
pub fn analyze_price_sensitivity(
    historical_prices: Vec<f64>,
    historical_volumes: Vec<f64>,
) -> f64 {
    if historical_prices.len() != historical_volumes.len() || historical_prices.len() < 2 {
        return 0.0;
    }

    // Simple price elasticity calculation
    let mut elasticity_sum = 0.0;
    let mut valid_calculations = 0;

    for i in 1..historical_prices.len() {
        let price_change = (historical_prices[i] - historical_prices[i-1]) / historical_prices[i-1];
        let volume_change = (historical_volumes[i] - historical_volumes[i-1]) / historical_volumes[i-1];
        
        if price_change.abs() > 0.001 { // Avoid division by near-zero
            elasticity_sum += volume_change / price_change;
            valid_calculations += 1;
        }
    }

    if valid_calculations > 0 {
        elasticity_sum / valid_calculations as f64
    } else {
        -1.0 // Default moderate elasticity
    }
}

#[napi]
pub fn calculate_competitor_price_index(
    our_price: f64,
    competitor_prices: Vec<CompetitorPricing>,
) -> f64 {
    if competitor_prices.is_empty() {
        return 100.0;
    }

    let weighted_avg = competitor_prices.iter()
        .map(|comp| comp.competitor_price * comp.market_share)
        .sum::<f64>() / competitor_prices.iter()
        .map(|comp| comp.market_share)
        .sum::<f64>();

    (our_price / weighted_avg) * 100.0
}

#[napi]
pub fn optimize_tiered_pricing(
    base_cost: f64,
    volume_tiers: Vec<f64>,
    margin_percentages: Vec<f64>,
) -> Vec<f64> {
    if volume_tiers.len() != margin_percentages.len() {
        return Vec::new();
    }

    volume_tiers.iter()
        .zip(margin_percentages.iter())
        .map(|(&_volume, &margin)| base_cost * (1.0 + margin / 100.0))
        .collect()
}

#[napi]
pub fn calculate_promotional_pricing_impact(
    regular_price: f64,
    promotional_price: f64,
    promotion_duration_days: i32,
    baseline_volume: f64,
    price_elasticity: f64,
) -> f64 {
    let discount_percentage = ((regular_price - promotional_price) / regular_price) * 100.0;
    let volume_increase = baseline_volume * (discount_percentage.abs() * price_elasticity.abs() / 100.0);
    let promotion_revenue = promotional_price * (baseline_volume + volume_increase) * promotion_duration_days as f64;
    let regular_revenue = regular_price * baseline_volume * promotion_duration_days as f64;
    
    promotion_revenue - regular_revenue
}