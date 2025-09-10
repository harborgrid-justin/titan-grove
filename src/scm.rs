use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct SupplyChainNode {
    pub node_id: String,
    pub node_type: String, // SUPPLIER, WAREHOUSE, DISTRIBUTION_CENTER, CUSTOMER
    pub location: String,
    pub capacity: f64,
    pub current_inventory: f64,
    pub lead_time_days: i32,
}

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct ShipmentRoute {
    pub route_id: String,
    pub origin: String,
    pub destination: String,
    pub distance_km: f64,
    pub transport_cost_per_km: f64,
    pub transit_time_hours: f64,
    pub capacity_limit: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct DemandForecast {
    pub product_id: String,
    pub period: String,
    pub forecasted_demand: f64,
    pub confidence_interval: f64,
    pub seasonal_factor: f64,
    pub trend_factor: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct ScmInventoryOptimization {
    pub product_id: String,
    pub current_stock: f64,
    pub optimal_stock_level: f64,
    pub reorder_point: f64,
    pub economic_order_quantity: f64,
    pub safety_stock: f64,
    pub stockout_risk: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct SupplyChainMetrics {
    pub total_cost: f64,
    pub average_lead_time: f64,
    pub fill_rate: f64,
    pub inventory_turnover: f64,
    pub supply_chain_efficiency: f64,
    pub carbon_footprint: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct ScmRiskAssessment {
    pub risk_type: String,
    pub probability: f64,
    pub impact_score: f64,
    pub risk_score: f64,
    pub mitigation_cost: f64,
    pub residual_risk: f64,
}

#[napi]
pub fn calculate_total_logistics_cost(
    transportation_cost: f64,
    warehousing_cost: f64,
    inventory_carrying_cost: f64,
    administrative_cost: f64,
) -> f64 {
    transportation_cost + warehousing_cost + inventory_carrying_cost + administrative_cost
}

#[napi]
pub fn calculate_optimal_route(
    routes: Vec<ShipmentRoute>,
    shipment_volume: f64,
) -> String {
    if routes.is_empty() {
        return "NO_ROUTE_FOUND".to_string();
    }
    
    let mut best_route = &routes[0];
    let mut best_cost = f64::MAX;
    
    for route in &routes {
        if route.capacity_limit >= shipment_volume {
            let total_cost = route.distance_km * route.transport_cost_per_km;
            if total_cost < best_cost {
                best_cost = total_cost;
                best_route = route;
            }
        }
    }
    
    best_route.route_id.clone()
}

#[napi]
pub fn calculate_demand_forecast(
    historical_demand: Vec<f64>,
    seasonal_factors: Vec<f64>,
    trend_factor: f64,
) -> f64 {
    if historical_demand.is_empty() {
        return 0.0;
    }
    
    // Simple moving average with trend and seasonality
    let moving_average: f64 = historical_demand.iter().sum::<f64>() / historical_demand.len() as f64;
    
    // Apply trend factor
    let trended_forecast = moving_average * (1.0 + trend_factor);
    
    // Apply seasonal factor (use average if provided)
    let seasonal_factor = if !seasonal_factors.is_empty() {
        seasonal_factors.iter().sum::<f64>() / seasonal_factors.len() as f64
    } else {
        1.0
    };
    
    trended_forecast * seasonal_factor
}

#[napi]
pub fn optimize_inventory_levels(
    annual_demand: f64,
    ordering_cost: f64,
    holding_cost_per_unit: f64,
    lead_time_days: f64,
    service_level: f64, // 0.0 to 1.0
) -> ScmInventoryOptimization {
    // Economic Order Quantity (EOQ)
    let eoq = if holding_cost_per_unit > 0.0 {
        ((2.0 * annual_demand * ordering_cost) / holding_cost_per_unit).sqrt()
    } else {
        0.0
    };
    
    // Daily demand
    let daily_demand = annual_demand / 365.0;
    
    // Reorder point (assuming normal distribution)
    let safety_stock = daily_demand * lead_time_days * service_level;
    let reorder_point = (daily_demand * lead_time_days) + safety_stock;
    
    // Optimal stock level (target inventory)
    let optimal_stock_level = reorder_point + (eoq / 2.0);
    
    // Stockout risk (simplified)
    let stockout_risk = 1.0 - service_level;
    
    ScmInventoryOptimization {
        product_id: "".to_string(), // To be set by caller
        current_stock: 0.0, // To be set by caller
        optimal_stock_level,
        reorder_point,
        economic_order_quantity: eoq,
        safety_stock,
        stockout_risk,
    }
}

#[napi]
pub fn calculate_supply_chain_resilience(
    supplier_diversification: f64,
    geographic_distribution: f64,
    inventory_buffer: f64,
    alternative_routes: i32,
) -> f64 {
    // Weighted resilience score (0-100)
    let diversification_score = supplier_diversification * 0.3;
    let geographic_score = geographic_distribution * 0.25;
    let inventory_score = inventory_buffer * 0.25;
    let routes_score = (alternative_routes as f64 * 10.0).min(100.0) * 0.2;
    
    diversification_score + geographic_score + inventory_score + routes_score
}

#[napi]
pub fn calculate_bullwhip_effect(
    demand_variance: f64,
    order_variance: f64,
) -> f64 {
    if demand_variance > 0.0 {
        order_variance / demand_variance
    } else {
        1.0
    }
}

#[napi]
pub fn calculate_supply_chain_carbon_footprint(
    transportation_emissions: f64,
    warehousing_emissions: f64,
    manufacturing_emissions: f64,
    packaging_emissions: f64,
) -> f64 {
    transportation_emissions + warehousing_emissions + manufacturing_emissions + packaging_emissions
}

#[napi]
pub fn optimize_network_design(
    nodes: Vec<SupplyChainNode>,
    demand_centers: Vec<f64>,
    fixed_costs: Vec<f64>,
) -> Vec<String> {
    if nodes.is_empty() {
        return Vec::new();
    }
    
    // Simple network optimization: select nodes with best capacity-to-cost ratio
    let mut node_efficiency: Vec<_> = nodes.iter()
        .zip(fixed_costs.iter())
        .map(|(node, &cost)| {
            let efficiency = if cost > 0.0 { node.capacity / cost } else { 0.0 };
            (node.node_id.clone(), efficiency)
        })
        .collect();
    
    // Sort by efficiency (descending)
    node_efficiency.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());
    
    // Select top nodes (up to half of available nodes)
    let selection_count = (nodes.len() / 2).max(1);
    node_efficiency.into_iter()
        .take(selection_count)
        .map(|(id, _)| id)
        .collect()
}

#[napi]
pub fn calculate_vendor_performance_score(
    quality_rating: f64,
    delivery_performance: f64,
    cost_competitiveness: f64,
    service_level: f64,
    innovation_score: f64,
) -> f64 {
    // Weighted vendor performance score
    (quality_rating * 0.25) +
    (delivery_performance * 0.25) +
    (cost_competitiveness * 0.20) +
    (service_level * 0.15) +
    (innovation_score * 0.15)
}

#[napi]
pub fn calculate_supply_risk_score(
    supplier_financial_stability: f64,
    geographic_concentration: f64,
    supplier_dependency: f64,
    political_stability: f64,
    natural_disaster_risk: f64,
) -> ScmRiskAssessment {
    // Calculate individual risk components (higher score = higher risk)
    let financial_risk = (100.0 - supplier_financial_stability) * 0.25;
    let geographic_risk = geographic_concentration * 0.20;
    let dependency_risk = supplier_dependency * 0.25;
    let political_risk = (100.0 - political_stability) * 0.15;
    let disaster_risk = natural_disaster_risk * 0.15;
    
    let total_risk_score = financial_risk + geographic_risk + dependency_risk + political_risk + disaster_risk;
    
    // Calculate probability and impact
    let probability = total_risk_score / 100.0;
    let impact_score = total_risk_score;
    
    ScmRiskAssessment {
        risk_type: "SUPPLY_DISRUPTION".to_string(),
        probability,
        impact_score,
        risk_score: total_risk_score,
        mitigation_cost: total_risk_score * 100.0, // Simplified cost calculation
        residual_risk: total_risk_score * 0.3, // Assuming 70% risk reduction with mitigation
    }
}

#[napi]
pub fn calculate_order_fulfillment_rate(
    orders_fulfilled_on_time: i32,
    total_orders: i32,
) -> f64 {
    if total_orders > 0 {
        (orders_fulfilled_on_time as f64 / total_orders as f64) * 100.0
    } else {
        0.0
    }
}

#[napi]
pub fn optimize_production_distribution(
    production_capacities: Vec<f64>,
    demand_requirements: Vec<f64>,
    transportation_costs: Vec<f64>,
) -> Vec<f64> {
    if production_capacities.is_empty() || demand_requirements.is_empty() {
        return Vec::new();
    }
    
    let total_capacity: f64 = production_capacities.iter().sum();
    let total_demand: f64 = demand_requirements.iter().sum();
    
    // Simple proportional allocation
    let allocation_ratio = if total_capacity > 0.0 {
        total_demand / total_capacity
    } else {
        0.0
    };
    
    production_capacities.iter()
        .map(|&capacity| capacity * allocation_ratio.min(1.0))
        .collect()
}

#[napi]
pub fn generate_supply_chain_metrics(
    nodes: Vec<SupplyChainNode>,
    routes: Vec<ShipmentRoute>,
    demand_forecast: f64,
) -> SupplyChainMetrics {
    // Calculate total transportation cost
    let total_transport_cost: f64 = routes.iter()
        .map(|r| r.distance_km * r.transport_cost_per_km)
        .sum();
    
    // Calculate average lead time
    let average_lead_time = if !nodes.is_empty() {
        nodes.iter().map(|n| n.lead_time_days as f64).sum::<f64>() / nodes.len() as f64
    } else {
        0.0
    };
    
    // Calculate total inventory
    let total_inventory: f64 = nodes.iter().map(|n| n.current_inventory).sum();
    
    // Calculate inventory turnover
    let inventory_turnover = if total_inventory > 0.0 {
        demand_forecast / total_inventory
    } else {
        0.0
    };
    
    // Calculate fill rate (simplified)
    let fill_rate = 95.0; // Would be calculated from actual data
    
    // Calculate efficiency score
    let supply_chain_efficiency = (fill_rate + (inventory_turnover * 10.0)) / 2.0;
    
    // Calculate carbon footprint (simplified)
    let carbon_footprint = total_transport_cost * 0.1; // Simplified calculation
    
    SupplyChainMetrics {
        total_cost: total_transport_cost,
        average_lead_time,
        fill_rate,
        inventory_turnover,
        supply_chain_efficiency,
        carbon_footprint,
    }
}