use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct MarketingCampaign {
    pub campaign_id: String,
    pub campaign_name: String,
    pub budget: f64,
    pub actual_spend: f64,
    pub impressions: i32,
    pub clicks: i32,
    pub conversions: i32,
    pub revenue_attributed: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct MarketingMetrics {
    pub ctr: f64,           // Click-through rate
    pub conversion_rate: f64,
    pub cpc: f64,           // Cost per click
    pub cpa: f64,           // Cost per acquisition
    pub roi: f64,           // Return on investment
    pub roas: f64,          // Return on ad spend
}

#[napi]
pub fn calculate_marketing_roi(
    revenue_attributed: f64,
    marketing_spend: f64,
) -> f64 {
    if marketing_spend > 0.0 {
        ((revenue_attributed - marketing_spend) / marketing_spend) * 100.0
    } else {
        0.0
    }
}

#[napi]
pub fn calculate_customer_lifetime_value_marketing(
    average_purchase_value: f64,
    purchase_frequency: f64,
    customer_lifespan_months: f64,
) -> f64 {
    average_purchase_value * purchase_frequency * customer_lifespan_months
}

#[napi]
pub fn optimize_marketing_mix(
    channel_costs: Vec<f64>,
    channel_conversions: Vec<f64>,
    total_budget: f64,
) -> Vec<f64> {
    if channel_costs.is_empty() || channel_conversions.is_empty() {
        return Vec::new();
    }

    // Calculate efficiency (conversions per dollar) for each channel
    let mut channel_efficiency: Vec<_> = channel_costs.iter()
        .zip(channel_conversions.iter())
        .enumerate()
        .map(|(i, (&cost, &conversions))| {
            let efficiency = if cost > 0.0 { conversions / cost } else { 0.0 };
            (i, efficiency, cost)
        })
        .collect();

    // Sort by efficiency (descending)
    channel_efficiency.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());

    // Allocate budget proportionally to efficiency
    let mut allocations = vec![0.0; channel_costs.len()];
    let total_efficiency: f64 = channel_efficiency.iter().map(|(_, eff, _)| eff).sum();

    if total_efficiency > 0.0 {
        for (index, efficiency, _) in channel_efficiency {
            allocations[index] = total_budget * (efficiency / total_efficiency);
        }
    }

    allocations
}