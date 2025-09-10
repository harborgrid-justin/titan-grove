use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct Vehicle {
    pub vehicle_id: String,
    pub vehicle_type: String,
    pub capacity_weight: f64,
    pub capacity_volume: f64,
    pub fuel_efficiency: f64,
    pub operating_cost_per_km: f64,
    pub current_location: String,
    pub availability_status: String,
}

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct DeliveryRoute {
    pub route_id: String,
    pub vehicle_id: String,
    pub stops: Vec<String>,
    pub total_distance_km: f64,
    pub estimated_duration_hours: f64,
    pub total_cost: f64,
    pub delivery_priority: i32,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct RouteOptimization {
    pub optimized_routes: Vec<DeliveryRoute>,
    pub total_distance: f64,
    pub total_cost: f64,
    pub vehicles_used: i32,
    pub efficiency_score: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct FleetMetrics {
    pub total_vehicles: i32,
    pub active_vehicles: i32,
    pub fleet_utilization: f64,
    pub average_fuel_efficiency: f64,
    pub total_operating_cost: f64,
    pub maintenance_cost: f64,
    pub delivery_performance: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct ShippingCost {
    pub base_cost: f64,
    pub distance_cost: f64,
    pub weight_cost: f64,
    pub fuel_surcharge: f64,
    pub total_shipping_cost: f64,
    pub estimated_delivery_time: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct WarehouseLocation {
    pub warehouse_id: String,
    pub latitude: f64,
    pub longitude: f64,
    pub capacity: f64,
    pub current_inventory: f64,
    pub processing_cost_per_unit: f64,
}

#[napi]
pub fn calculate_delivery_distance(
    origin_lat: f64,
    origin_lng: f64,
    destination_lat: f64,
    destination_lng: f64,
) -> f64 {
    // Simplified Haversine formula for distance calculation
    let earth_radius = 6371.0; // Earth's radius in kilometers
    
    let lat1_rad = origin_lat.to_radians();
    let lat2_rad = destination_lat.to_radians();
    let delta_lat = (destination_lat - origin_lat).to_radians();
    let delta_lng = (destination_lng - origin_lng).to_radians();
    
    let a = (delta_lat / 2.0).sin().powi(2) +
            lat1_rad.cos() * lat2_rad.cos() * (delta_lng / 2.0).sin().powi(2);
    let c = 2.0 * a.sqrt().atan2((1.0 - a).sqrt());
    
    earth_radius * c
}

#[napi]
pub fn optimize_delivery_routes(
    vehicles: Vec<Vehicle>,
    delivery_addresses: Vec<String>,
    delivery_priorities: Vec<i32>,
) -> RouteOptimization {
    if vehicles.is_empty() || delivery_addresses.is_empty() {
        return RouteOptimization {
            optimized_routes: Vec::new(),
            total_distance: 0.0,
            total_cost: 0.0,
            vehicles_used: 0,
            efficiency_score: 0.0,
        };
    }
    
    // Simple route optimization: assign deliveries to vehicles based on capacity
    let mut routes = Vec::new();
    let mut total_distance = 0.0;
    let mut total_cost = 0.0;
    let mut vehicles_used = 0;
    
    // Group deliveries by priority and assign to available vehicles
    let deliveries_per_vehicle = (delivery_addresses.len() as f64 / vehicles.len() as f64).ceil() as usize;
    
    for (i, vehicle) in vehicles.iter().enumerate() {
        if vehicle.availability_status != "AVAILABLE" {
            continue;
        }
        
        let start_idx = i * deliveries_per_vehicle;
        let end_idx = (start_idx + deliveries_per_vehicle).min(delivery_addresses.len());
        
        if start_idx < delivery_addresses.len() {
            let route_stops = delivery_addresses[start_idx..end_idx].to_vec();
            let route_distance = route_stops.len() as f64 * 10.0; // Simplified: 10km per stop
            let route_cost = route_distance * vehicle.operating_cost_per_km;
            
            routes.push(DeliveryRoute {
                route_id: format!("ROUTE_{}", i + 1),
                vehicle_id: vehicle.vehicle_id.clone(),
                stops: route_stops,
                total_distance_km: route_distance,
                estimated_duration_hours: route_distance / 50.0, // 50 km/h average speed
                total_cost: route_cost,
                delivery_priority: delivery_priorities.get(start_idx).copied().unwrap_or(1),
            });
            
            total_distance += route_distance;
            total_cost += route_cost;
            vehicles_used += 1;
        }
    }
    
    let efficiency_score = if vehicles_used > 0 {
        (total_distance / vehicles_used as f64) * 0.1 // Simplified efficiency metric
    } else {
        0.0
    };
    
    RouteOptimization {
        optimized_routes: routes,
        total_distance,
        total_cost,
        vehicles_used,
        efficiency_score,
    }
}

#[napi]
pub fn calculate_logistics_shipping_cost(
    weight_kg: f64,
    distance_km: f64,
    shipping_class: String,
    fuel_price_per_liter: f64,
) -> ShippingCost {
    // Base cost calculation
    let base_cost = match shipping_class.as_str() {
        "EXPRESS" => 50.0,
        "STANDARD" => 25.0,
        "ECONOMY" => 15.0,
        _ => 20.0,
    };
    
    // Distance-based cost
    let distance_cost = distance_km * 0.8; // $0.80 per km
    
    // Weight-based cost
    let weight_cost = weight_kg * 1.5; // $1.50 per kg
    
    // Fuel surcharge (percentage of distance cost)
    let fuel_surcharge = distance_cost * (fuel_price_per_liter / 100.0);
    
    let total_cost = base_cost + distance_cost + weight_cost + fuel_surcharge;
    
    // Estimated delivery time based on shipping class
    let estimated_delivery_time = match shipping_class.as_str() {
        "EXPRESS" => distance_km / 80.0, // 80 km/h
        "STANDARD" => distance_km / 60.0, // 60 km/h
        "ECONOMY" => distance_km / 40.0, // 40 km/h
        _ => distance_km / 50.0, // 50 km/h
    };
    
    ShippingCost {
        base_cost,
        distance_cost,
        weight_cost,
        fuel_surcharge,
        total_shipping_cost: total_cost,
        estimated_delivery_time,
    }
}

#[napi]
pub fn calculate_fleet_utilization(
    vehicles: Vec<Vehicle>,
    active_routes: i32,
) -> f64 {
    let total_vehicles = vehicles.len() as f64;
    if total_vehicles > 0.0 {
        (active_routes as f64 / total_vehicles) * 100.0
    } else {
        0.0
    }
}

#[napi]
pub fn optimize_warehouse_allocation(
    warehouses: Vec<WarehouseLocation>,
    customer_locations: Vec<(f64, f64)>, // (lat, lng) pairs
    order_volumes: Vec<f64>,
) -> Vec<String> {
    if warehouses.is_empty() || customer_locations.is_empty() {
        return Vec::new();
    }
    
    let mut allocations = Vec::new();
    
    for (i, &(customer_lat, customer_lng)) in customer_locations.iter().enumerate() {
        let order_volume = order_volumes.get(i).copied().unwrap_or(1.0);
        
        // Find the best warehouse for this customer
        let mut best_warehouse_id = warehouses[0].warehouse_id.clone();
        let mut best_score = f64::MAX;
        
        for warehouse in &warehouses {
            // Check if warehouse has sufficient capacity
            if warehouse.current_inventory < order_volume {
                continue;
            }
            
            // Calculate distance
            let distance = calculate_delivery_distance(
                warehouse.latitude,
                warehouse.longitude,
                customer_lat,
                customer_lng,
            );
            
            // Calculate total cost (distance + processing)
            let total_cost = distance * 0.5 + (order_volume * warehouse.processing_cost_per_unit);
            
            if total_cost < best_score {
                best_score = total_cost;
                best_warehouse_id = warehouse.warehouse_id.clone();
            }
        }
        
        allocations.push(best_warehouse_id);
    }
    
    allocations
}

#[napi]
pub fn calculate_carbon_emissions(
    distance_km: f64,
    vehicle_fuel_efficiency: f64, // km per liter
    emission_factor: f64, // kg CO2 per liter
) -> f64 {
    if vehicle_fuel_efficiency > 0.0 {
        let fuel_consumed = distance_km / vehicle_fuel_efficiency;
        fuel_consumed * emission_factor
    } else {
        0.0
    }
}

#[napi]
pub fn optimize_load_planning(
    items: Vec<f64>, // Item weights
    vehicle_capacity: f64,
    max_items_per_load: i32,
) -> Vec<Vec<f64>> {
    if items.is_empty() {
        return Vec::new();
    }
    
    let mut loads = Vec::new();
    let mut current_load = Vec::new();
    let mut current_weight = 0.0;
    
    for item_weight in items {
        if current_weight + item_weight <= vehicle_capacity &&
           current_load.len() < max_items_per_load as usize {
            current_load.push(item_weight);
            current_weight += item_weight;
        } else {
            if !current_load.is_empty() {
                loads.push(current_load);
                current_load = Vec::new();
                current_weight = 0.0;
            }
            
            // Start new load with current item
            if item_weight <= vehicle_capacity {
                current_load.push(item_weight);
                current_weight = item_weight;
            }
        }
    }
    
    if !current_load.is_empty() {
        loads.push(current_load);
    }
    
    loads
}

#[napi]
pub fn calculate_delivery_time_window(
    distance_km: f64,
    average_speed_kmh: f64,
    loading_time_hours: f64,
    traffic_factor: f64,
) -> f64 {
    let base_travel_time = distance_km / average_speed_kmh;
    let adjusted_travel_time = base_travel_time * traffic_factor;
    adjusted_travel_time + loading_time_hours
}

#[napi]
pub fn generate_fleet_metrics(
    vehicles: Vec<Vehicle>,
    total_operating_cost: f64,
    maintenance_cost: f64,
) -> FleetMetrics {
    let total_vehicles = vehicles.len() as i32;
    
    let active_vehicles = vehicles.iter()
        .filter(|v| v.availability_status == "ACTIVE" || v.availability_status == "IN_TRANSIT")
        .count() as i32;
    
    let fleet_utilization = if total_vehicles > 0 {
        (active_vehicles as f64 / total_vehicles as f64) * 100.0
    } else {
        0.0
    };
    
    let average_fuel_efficiency = if !vehicles.is_empty() {
        vehicles.iter().map(|v| v.fuel_efficiency).sum::<f64>() / vehicles.len() as f64
    } else {
        0.0
    };
    
    // Mock delivery performance
    let delivery_performance = 92.5; // Would be calculated from actual delivery data
    
    FleetMetrics {
        total_vehicles,
        active_vehicles,
        fleet_utilization,
        average_fuel_efficiency,
        total_operating_cost,
        maintenance_cost,
        delivery_performance,
    }
}

#[napi]
pub fn calculate_last_mile_efficiency(
    total_deliveries: i32,
    successful_deliveries: i32,
    total_delivery_time: f64,
    total_distance: f64,
) -> f64 {
    let success_rate = if total_deliveries > 0 {
        (successful_deliveries as f64 / total_deliveries as f64) * 100.0
    } else {
        0.0
    };
    
    let time_efficiency = if total_delivery_time > 0.0 {
        (successful_deliveries as f64 / total_delivery_time) * 100.0
    } else {
        0.0
    };
    
    let distance_efficiency = if total_distance > 0.0 {
        (successful_deliveries as f64 / total_distance) * 10.0
    } else {
        0.0
    };
    
    // Weighted average of efficiency metrics
    (success_rate * 0.5) + (time_efficiency * 0.3) + (distance_efficiency * 0.2)
}