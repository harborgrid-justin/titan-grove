use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct MaintenanceTask {
    pub task_id: String,
    pub asset_id: String,
    pub task_type: String,
    pub priority: String,
    pub estimated_hours: f64,
    pub estimated_cost: f64,
    pub due_date: i64,
    pub status: String,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct MaintenanceSchedule {
    pub schedule_id: String,
    pub asset_id: String,
    pub maintenance_type: String,
    pub frequency_days: i32,
    pub next_due_date: i64,
    pub estimated_duration_hours: f64,
    pub priority_score: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct MaintenanceMetrics {
    pub total_tasks: i32,
    pub completed_tasks: i32,
    pub overdue_tasks: i32,
    pub average_completion_time: f64,
    pub maintenance_cost_total: f64,
    pub equipment_uptime_percentage: f64,
    pub preventive_vs_reactive_ratio: f64,
}

#[napi]
pub fn calculate_maintenance_priority_score(
    asset_criticality: f64,
    days_overdue: i32,
    estimated_cost: f64,
    safety_impact: f64,
) -> f64 {
    let overdue_factor = if days_overdue > 0 {
        1.0 + (days_overdue as f64 * 0.1)
    } else {
        1.0
    };
    
    let cost_factor = (estimated_cost / 1000.0).min(2.0);
    
    ((asset_criticality * 0.4) + (safety_impact * 0.3) + (cost_factor * 0.3)) * overdue_factor
}

#[napi]
pub fn optimize_maintenance_schedule(
    tasks: Vec<MaintenanceTask>,
    available_hours_per_day: f64,
    max_days_ahead: i32,
) -> Vec<String> {
    let mut optimized_schedule = Vec::new();
    let mut daily_hours = vec![0.0; max_days_ahead as usize];
    
    // Sort tasks by priority (would need priority calculation in real implementation)
    let mut sorted_tasks = tasks;
    sorted_tasks.sort_by(|a, b| {
        let priority_a = match a.priority.as_str() {
            "CRITICAL" => 5.0,
            "HIGH" => 4.0,
            "MEDIUM" => 3.0,
            "LOW" => 2.0,
            _ => 1.0,
        };
        let priority_b = match b.priority.as_str() {
            "CRITICAL" => 5.0,
            "HIGH" => 4.0,
            "MEDIUM" => 3.0,
            "LOW" => 2.0,
            _ => 1.0,
        };
        priority_b.partial_cmp(&priority_a).unwrap()
    });
    
    // Schedule tasks
    for task in sorted_tasks {
        for day in 0..max_days_ahead as usize {
            if daily_hours[day] + task.estimated_hours <= available_hours_per_day {
                daily_hours[day] += task.estimated_hours;
                optimized_schedule.push(format!("Day {}: {}", day + 1, task.task_id));
                break;
            }
        }
    }
    
    optimized_schedule
}

#[napi]
pub fn calculate_equipment_uptime(
    total_operating_hours: f64,
    downtime_hours: f64,
) -> f64 {
    if total_operating_hours <= 0.0 {
        return 0.0;
    }
    
    let uptime_hours = total_operating_hours - downtime_hours;
    (uptime_hours / total_operating_hours) * 100.0
}

#[napi]
pub fn generate_maintenance_metrics(
    tasks: Vec<MaintenanceTask>,
    total_equipment_hours: f64,
    downtime_hours: f64,
) -> MaintenanceMetrics {
    let total_tasks = tasks.len() as i32;
    let completed_tasks = tasks.iter()
        .filter(|t| t.status == "COMPLETED")
        .count() as i32;
    
    let overdue_tasks = tasks.iter()
        .filter(|t| {
            let current_time = std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs() as i64;
            t.due_date < current_time && t.status != "COMPLETED"
        })
        .count() as i32;
    
    let maintenance_cost_total = tasks.iter()
        .map(|t| t.estimated_cost)
        .sum::<f64>();
    
    let equipment_uptime_percentage = calculate_equipment_uptime(total_equipment_hours, downtime_hours);
    
    // Simple calculation for preventive vs reactive maintenance
    let preventive_tasks = tasks.iter()
        .filter(|t| t.task_type == "PREVENTIVE")
        .count() as f64;
    let reactive_tasks = tasks.iter()
        .filter(|t| t.task_type == "REACTIVE")
        .count() as f64;
    
    let preventive_vs_reactive_ratio = if reactive_tasks > 0.0 {
        preventive_tasks / reactive_tasks
    } else {
        preventive_tasks
    };
    
    MaintenanceMetrics {
        total_tasks,
        completed_tasks,
        overdue_tasks,
        average_completion_time: 4.5, // Would calculate from actual data
        maintenance_cost_total,
        equipment_uptime_percentage,
        preventive_vs_reactive_ratio,
    }
}