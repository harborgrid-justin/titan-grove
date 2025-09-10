#![deny(clippy::all)]

use napi::bindgen_prelude::*;
use napi_derive::napi;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;

// Core Cloud Infrastructure Management Data Structures
#[napi(object)]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CloudInfrastructureRecord {
  pub id: String,
  pub name: String,
  pub description: Option<String>,
  pub status: String,
  pub created_at: String,
  pub updated_at: String,
}

#[napi]
impl CloudInfrastructureRecord {
  #[napi(constructor)]
  pub fn new(name: String, description: Option<String>, status: String) -> Self {
    let now = Utc::now().to_rfc3339();
    Self {
      id: Uuid::new_v4().to_string(),
      name,
      description,
      status,
      created_at: now.clone(),
      updated_at: now,
    }
  }

  #[napi]
  pub fn update_status(&mut self, new_status: String) {
    self.status = new_status;
    self.updated_at = Utc::now().to_rfc3339();
  }

  #[napi]
  pub fn get_age_in_days(&self) -> Result<i64> {
    let created = DateTime::parse_from_rfc3339(&self.created_at)
      .map_err(|e| Error::new(Status::InvalidArg, format!("Invalid date format: {}", e)))?;
    let now = Utc::now();
    Ok((now - created.with_timezone(&Utc)).num_days())
  }
}


// Cloud Infrastructure Management Functions
#[napi]
pub fn calculate_cloud_cost(cpu_hours: f64, memory_gb_hours: f64, storage_gb_hours: f64, cpu_rate: f64, memory_rate: f64, storage_rate: f64) -> f64 {
    (cpu_hours * cpu_rate) + (memory_gb_hours * memory_rate) + (storage_gb_hours * storage_rate)
}

#[napi]
pub fn calculate_resource_utilization(used_resources: f64, total_resources: f64) -> f64 {
    if total_resources > 0.0 {
        (used_resources / total_resources) * 100.0
    } else {
        0.0
    }
}

#[napi]
pub fn estimate_scaling_requirements(current_load: f64, target_load: f64, current_instances: i32) -> i32 {
    if current_load > 0.0 {
        ((target_load / current_load) * current_instances as f64).ceil() as i32
    } else {
        current_instances
    }
}

// Additional utility functions
#[napi]
pub fn get_module_info() -> String {
    format!("Cloud Infrastructure Management Module v1.0.0 - Native NAPI-RS Implementation")
}

#[napi]
pub fn validate_cloud_infrastructure_data(data: String) -> bool {
    !data.trim().is_empty() && data.len() <= 1000
}
