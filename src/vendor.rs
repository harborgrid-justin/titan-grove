use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct Vendor {
    pub vendor_id: String,
    pub vendor_name: String,
    pub performance_score: f64,
    pub reliability_rating: f64,
    pub cost_competitiveness: f64,
}

#[napi]
pub fn calculate_vendor_performance_score(
    quality_rating: f64,
    delivery_performance: f64,
    cost_effectiveness: f64,
    responsiveness: f64,
) -> f64 {
    (quality_rating * 0.3) + (delivery_performance * 0.3) + 
    (cost_effectiveness * 0.25) + (responsiveness * 0.15)
}

#[napi]
pub fn optimize_vendor_selection(
    vendors: Vec<Vendor>,
    budget_constraint: f64,
) -> Vec<String> {
    let mut sorted_vendors = vendors;
    sorted_vendors.sort_by(|a, b| b.performance_score.partial_cmp(&a.performance_score).unwrap());
    
    sorted_vendors.into_iter()
        .take(5)
        .map(|v| v.vendor_id)
        .collect()
}