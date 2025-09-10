use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct SustainabilityMetrics {
    pub carbon_footprint: f64,
    pub energy_consumption: f64,
    pub waste_generated: f64,
    pub water_usage: f64,
    pub renewable_energy_percentage: f64,
}

#[napi]
pub fn calculate_carbon_footprint(
    scope1_emissions: f64,
    scope2_emissions: f64,
    scope3_emissions: f64,
) -> f64 {
    scope1_emissions + scope2_emissions + scope3_emissions
}

#[napi]
pub fn calculate_esg_score(
    environmental_score: f64,
    social_score: f64,
    governance_score: f64,
) -> f64 {
    (environmental_score * 0.4) + (social_score * 0.3) + (governance_score * 0.3)
}

#[napi]
pub fn calculate_sustainability_roi(
    sustainability_investment: f64,
    cost_savings: f64,
    revenue_increase: f64,
) -> f64 {
    if sustainability_investment > 0.0 {
        ((cost_savings + revenue_increase - sustainability_investment) / sustainability_investment) * 100.0
    } else {
        0.0
    }
}