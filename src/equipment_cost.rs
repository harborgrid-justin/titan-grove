use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct Equipment {
    pub equipment_id: String,
    pub equipment_type: String,
    pub acquisition_cost: f64,
    pub installation_cost: f64,
    pub annual_operating_cost: f64,
    pub annual_maintenance_cost: f64,
    pub useful_life_years: f64,
    pub salvage_value: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct CostAnalysis {
    pub equipment_id: String,
    pub total_acquisition_cost: f64,
    pub annual_total_cost: f64,
    pub lifecycle_cost: f64,
    pub cost_per_unit_output: f64,
    pub break_even_analysis: f64,
}

#[napi]
pub fn calculate_equipment_lifecycle_cost(
    acquisition_cost: f64,
    installation_cost: f64,
    annual_operating_cost: f64,
    annual_maintenance_cost: f64,
    useful_life_years: f64,
    salvage_value: f64,
    discount_rate: f64,
) -> f64 {
    let initial_cost = acquisition_cost + installation_cost;
    let annual_cost = annual_operating_cost + annual_maintenance_cost;
    
    let mut lifecycle_cost = initial_cost;
    
    // Present value of annual costs
    for year in 1..=(useful_life_years as i32) {
        let pv_annual_cost = annual_cost / (1.0 + discount_rate / 100.0).powi(year);
        lifecycle_cost += pv_annual_cost;
    }
    
    // Subtract present value of salvage
    let pv_salvage = salvage_value / (1.0 + discount_rate / 100.0).powi(useful_life_years as i32);
    lifecycle_cost - pv_salvage
}

#[napi]
pub fn calculate_equipment_productivity(
    actual_output: f64,
    design_capacity: f64,
    operating_hours: f64,
    available_hours: f64,
) -> f64 {
    let utilization = if available_hours > 0.0 {
        operating_hours / available_hours
    } else {
        0.0
    };
    
    let efficiency = if design_capacity > 0.0 {
        actual_output / design_capacity
    } else {
        0.0
    };
    
    utilization * efficiency * 100.0
}

#[napi]
pub fn calculate_maintenance_cost_optimization(
    preventive_maintenance_cost: f64,
    corrective_maintenance_cost: f64,
    downtime_cost_per_hour: f64,
    preventive_downtime_hours: f64,
    corrective_downtime_hours: f64,
) -> f64 {
    let total_preventive_cost = preventive_maintenance_cost + (preventive_downtime_hours * downtime_cost_per_hour);
    let total_corrective_cost = corrective_maintenance_cost + (corrective_downtime_hours * downtime_cost_per_hour);
    
    // Return cost savings of preventive vs corrective
    total_corrective_cost - total_preventive_cost
}

#[napi]
pub fn calculate_equipment_roi(
    equipment_cost: f64,
    annual_cost_savings: f64,
    annual_revenue_increase: f64,
    useful_life_years: f64,
) -> f64 {
    let annual_benefit = annual_cost_savings + annual_revenue_increase;
    let total_benefit = annual_benefit * useful_life_years;
    
    if equipment_cost > 0.0 {
        ((total_benefit - equipment_cost) / equipment_cost) * 100.0
    } else {
        0.0
    }
}

#[napi]
pub fn optimize_equipment_replacement_timing(
    current_maintenance_cost: f64,
    maintenance_cost_growth_rate: f64,
    new_equipment_cost: f64,
    efficiency_improvement: f64,
    years_to_analyze: i32,
) -> i32 {
    let mut best_year = 1;
    let mut best_savings = 0.0;
    
    for year in 1..=years_to_analyze {
        // Cumulative maintenance costs for old equipment
        let mut cumulative_old_cost = 0.0;
        for y in 1..=year {
            let annual_maintenance = current_maintenance_cost * (1.0 + maintenance_cost_growth_rate / 100.0).powi(y - 1);
            cumulative_old_cost += annual_maintenance;
        }
        
        // Cost of new equipment plus its maintenance
        let new_equipment_annual_maintenance = current_maintenance_cost * (1.0 - efficiency_improvement / 100.0);
        let new_equipment_total_cost = new_equipment_cost + (new_equipment_annual_maintenance * year as f64);
        
        let savings = cumulative_old_cost - new_equipment_total_cost;
        
        if savings > best_savings {
            best_savings = savings;
            best_year = year;
        }
    }
    
    best_year
}

#[napi]
pub fn generate_equipment_cost_analysis(
    equipment: Equipment,
    annual_output_units: f64,
    discount_rate: f64,
) -> CostAnalysis {
    let total_acquisition_cost = equipment.acquisition_cost + equipment.installation_cost;
    let annual_total_cost = equipment.annual_operating_cost + equipment.annual_maintenance_cost;
    
    let lifecycle_cost = calculate_equipment_lifecycle_cost(
        equipment.acquisition_cost,
        equipment.installation_cost,
        equipment.annual_operating_cost,
        equipment.annual_maintenance_cost,
        equipment.useful_life_years,
        equipment.salvage_value,
        discount_rate,
    );
    
    let total_output = annual_output_units * equipment.useful_life_years;
    let cost_per_unit_output = if total_output > 0.0 {
        lifecycle_cost / total_output
    } else {
        0.0
    };
    
    let break_even_analysis = if annual_total_cost > 0.0 {
        total_acquisition_cost / annual_total_cost
    } else {
        0.0
    };
    
    CostAnalysis {
        equipment_id: equipment.equipment_id,
        total_acquisition_cost,
        annual_total_cost,
        lifecycle_cost,
        cost_per_unit_output,
        break_even_analysis,
    }
}