use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct YardSpace {
    pub space_id: String,
    pub area_sqm: f64,
    pub capacity_units: i32,
    pub current_occupancy: i32,
    pub space_type: String,
    pub hourly_rate: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct SpaceOptimization {
    pub total_space_utilized: f64,
    pub utilization_percentage: f64,
    pub revenue_optimization: f64,
    pub recommended_layout: Vec<String>,
}

#[napi]
pub fn calculate_yard_utilization(
    total_capacity: i32,
    current_occupancy: i32,
) -> f64 {
    if total_capacity > 0 {
        (current_occupancy as f64 / total_capacity as f64) * 100.0
    } else {
        0.0
    }
}

#[napi]
pub fn optimize_container_placement(
    container_sizes: Vec<f64>,
    yard_capacity: f64,
    priority_scores: Vec<f64>,
) -> Vec<i32> {
    let mut placement_order = Vec::new();
    let mut remaining_capacity = yard_capacity;
    
    // Create container indices with priorities
    let mut containers: Vec<_> = container_sizes.iter()
        .zip(priority_scores.iter())
        .enumerate()
        .map(|(i, (&size, &priority))| (i, size, priority))
        .collect();
    
    // Sort by priority (descending), then by size (ascending for efficiency)
    containers.sort_by(|a, b| b.2.partial_cmp(&a.2).unwrap().then(a.1.partial_cmp(&b.1).unwrap()));
    
    for (index, size, _priority) in containers {
        if remaining_capacity >= size {
            placement_order.push(index as i32);
            remaining_capacity -= size;
        }
    }
    
    placement_order
}

#[napi]
pub fn calculate_space_efficiency_score(
    spaces: Vec<YardSpace>,
) -> f64 {
    if spaces.is_empty() {
        return 0.0;
    }
    
    let total_utilization: f64 = spaces.iter()
        .map(|space| calculate_yard_utilization(space.capacity_units, space.current_occupancy))
        .sum();
    
    total_utilization / spaces.len() as f64
}

#[napi]
pub fn optimize_yard_revenue(
    spaces: Vec<YardSpace>,
    demand_forecast: Vec<f64>,
) -> f64 {
    let mut total_revenue = 0.0;
    
    for (i, space) in spaces.iter().enumerate() {
        let demand = demand_forecast.get(i).copied().unwrap_or(0.0);
        let utilization = calculate_yard_utilization(space.capacity_units, space.current_occupancy);
        
        // Calculate potential revenue based on utilization and rates
        let potential_revenue = (utilization / 100.0) * space.hourly_rate * 24.0 * 30.0; // Monthly
        total_revenue += potential_revenue * (demand / 100.0);
    }
    
    total_revenue
}

#[napi]
pub fn calculate_turnaround_time_optimization(
    arrival_times: Vec<f64>,
    service_times: Vec<f64>,
    yard_capacity: i32,
) -> f64 {
    if arrival_times.is_empty() || service_times.is_empty() {
        return 0.0;
    }
    
    // Simple queue analysis
    let avg_arrival_rate = arrival_times.len() as f64 / arrival_times.iter().sum::<f64>();
    let avg_service_rate = service_times.len() as f64 / service_times.iter().sum::<f64>();
    
    // Utilization factor
    let rho = avg_arrival_rate / avg_service_rate;
    
    if rho < 1.0 && yard_capacity > 0 {
        // M/M/c queue approximation for average waiting time
        let avg_wait_time = rho / (yard_capacity as f64 * avg_service_rate * (1.0 - rho));
        avg_wait_time
    } else {
        999.0 // System overloaded
    }
}