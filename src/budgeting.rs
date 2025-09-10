use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct BudgetLine {
    pub line_id: String,
    pub account_code: String,
    pub department: String,
    pub budget_amount: f64,
    pub actual_amount: f64,
    pub variance_amount: f64,
    pub variance_percentage: f64,
    pub period: String,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct BudgetForecast {
    pub forecast_period: String,
    pub historical_data: Vec<f64>,
    pub forecasted_amount: f64,
    pub confidence_level: f64,
    pub growth_rate: f64,
    pub seasonal_adjustment: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct BudgetScenario {
    pub scenario_name: String,
    pub probability: f64,
    pub revenue_impact: f64,
    pub cost_impact: f64,
    pub net_impact: f64,
    pub risk_factors: Vec<String>,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct BudgetingMetrics {
    pub total_budget: f64,
    pub total_actual: f64,
    pub total_variance: f64,
    pub variance_percentage: f64,
    pub budget_accuracy: f64,
    pub forecast_accuracy: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct CapitalBudget {
    pub project_id: String,
    pub project_name: String,
    pub initial_investment: f64,
    pub expected_cash_flows: Vec<f64>,
    pub npv: f64,
    pub irr: f64,
    pub payback_period: f64,
    pub priority_score: f64,
}

#[napi]
pub fn calculate_budget_variance_analysis(
    budget_lines: Vec<BudgetLine>,
) -> BudgetingMetrics {
    let total_budget: f64 = budget_lines.iter().map(|b| b.budget_amount).sum();
    let total_actual: f64 = budget_lines.iter().map(|b| b.actual_amount).sum();
    let total_variance = total_actual - total_budget;
    
    let variance_percentage = if total_budget > 0.0 {
        (total_variance / total_budget) * 100.0
    } else {
        0.0
    };

    let budget_accuracy = if total_budget > 0.0 {
        100.0 - ((total_variance.abs() / total_budget) * 100.0)
    } else {
        0.0
    };

    BudgetingMetrics {
        total_budget,
        total_actual,
        total_variance,
        variance_percentage,
        budget_accuracy,
        forecast_accuracy: 85.0, // Would be calculated from historical data
    }
}

#[napi]
pub fn calculate_rolling_forecast(
    historical_data: Vec<f64>,
    periods_ahead: i32,
    trend_factor: f64,
) -> Vec<f64> {
    if historical_data.is_empty() {
        return Vec::new();
    }

    let mut forecasts = Vec::new();
    let base_value = historical_data.iter().sum::<f64>() / historical_data.len() as f64;
    
    for i in 0..periods_ahead {
        let trend_adjustment = 1.0 + (trend_factor * i as f64 / 12.0);
        let forecast = base_value * trend_adjustment;
        forecasts.push(forecast);
    }
    
    forecasts
}

#[napi]
pub fn calculate_budget_flex_analysis(
    fixed_costs: f64,
    variable_cost_per_unit: f64,
    planned_units: f64,
    actual_units: f64,
) -> f64 {
    let budgeted_total = fixed_costs + (variable_cost_per_unit * planned_units);
    let flexible_budget = fixed_costs + (variable_cost_per_unit * actual_units);
    flexible_budget - budgeted_total
}

#[napi]
pub fn calculate_zero_based_budget_score(
    activity_value_score: f64,
    cost_efficiency_score: f64,
    strategic_alignment_score: f64,
    risk_factor: f64,
) -> f64 {
    let weighted_score = (activity_value_score * 0.4) + 
                        (cost_efficiency_score * 0.3) + 
                        (strategic_alignment_score * 0.2) + 
                        (risk_factor * 0.1);
    weighted_score
}

#[napi]
pub fn optimize_budget_allocation(
    budget_requests: Vec<f64>,
    priority_scores: Vec<f64>,
    total_budget: f64,
) -> Vec<f64> {
    if budget_requests.is_empty() || priority_scores.is_empty() {
        return Vec::new();
    }

    // Create request-priority pairs and sort by priority
    let mut request_pairs: Vec<_> = budget_requests.into_iter()
        .zip(priority_scores.into_iter())
        .enumerate()
        .map(|(i, (request, priority))| (i, request, priority))
        .collect();

    request_pairs.sort_by(|a, b| b.2.partial_cmp(&a.2).unwrap());

    let mut allocations = vec![0.0; request_pairs.len()];
    let mut remaining_budget = total_budget;

    for (index, request, _priority) in request_pairs {
        let allocation = if remaining_budget >= request {
            remaining_budget -= request;
            request
        } else {
            let partial = remaining_budget;
            remaining_budget = 0.0;
            partial
        };
        allocations[index] = allocation;
    }

    allocations
}

#[napi]
pub fn calculate_budget_cycle_time(
    start_date: String, // Simplified - would parse dates
    approval_date: String,
    target_days: i32,
) -> f64 {
    // Simplified calculation - in reality would parse actual dates
    if start_date == approval_date {
        0.0
    } else {
        25.0 // Mock 25-day cycle time
    }
}

#[napi]
pub fn calculate_budget_accuracy_trend(
    actual_vs_budget_ratios: Vec<f64>,
) -> f64 {
    if actual_vs_budget_ratios.is_empty() {
        return 0.0;
    }

    // Calculate accuracy as proximity to 1.0 (perfect accuracy)
    let accuracy_scores: Vec<f64> = actual_vs_budget_ratios.iter()
        .map(|&ratio| 100.0 - (1.0 - ratio).abs() * 100.0)
        .collect();
    
    accuracy_scores.iter().sum::<f64>() / accuracy_scores.len() as f64
}

#[napi]
pub fn calculate_capital_budget_ranking(
    projects: Vec<CapitalBudget>,
    budget_limit: f64,
) -> Vec<String> {
    let mut ranked_projects = projects;
    
    // Sort by priority score (highest first)
    ranked_projects.sort_by(|a, b| b.priority_score.partial_cmp(&a.priority_score).unwrap());
    
    let mut selected_projects = Vec::new();
    let mut remaining_budget = budget_limit;
    
    for project in ranked_projects {
        if remaining_budget >= project.initial_investment {
            selected_projects.push(project.project_id);
            remaining_budget -= project.initial_investment;
        }
    }
    
    selected_projects
}

#[napi]
pub fn calculate_budget_performance_index(
    budget_variance_percentage: f64,
    forecast_accuracy: f64,
    cycle_time_performance: f64,
) -> f64 {
    let variance_score = 100.0 - budget_variance_percentage.abs();
    let combined_score = (variance_score * 0.4) + 
                        (forecast_accuracy * 0.4) + 
                        (cycle_time_performance * 0.2);
    combined_score.max(0.0).min(100.0)
}

#[napi]
pub fn calculate_budget_sensitivity_analysis(
    base_budget: f64,
    sensitivity_factors: Vec<f64>, // Percentage changes
) -> Vec<f64> {
    sensitivity_factors.iter()
        .map(|&factor| base_budget * (1.0 + factor / 100.0))
        .collect()
}