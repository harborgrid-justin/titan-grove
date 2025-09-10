#![deny(clippy::all)]

use napi::bindgen_prelude::*;
use napi_derive::napi;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;

// Core Crisis & Emergency Management Data Structures
#[napi(object)]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CrisisManagementRecord {
  pub id: String,
  pub name: String,
  pub description: Option<String>,
  pub status: String,
  pub created_at: String,
  pub updated_at: String,
}

#[napi]
impl CrisisManagementRecord {
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


// Crisis & Emergency Management Functions
#[napi]
pub fn calculate_crisis_severity(impact_score: i32, urgency_score: i32, duration_hours: f64) -> String {
    let severity_score = impact_score * urgency_score + (duration_hours / 24.0) as i32;
    match severity_score {
        0..=10 => "Low".to_string(),
        11..=25 => "Medium".to_string(),
        26..=50 => "High".to_string(),
        _ => "Critical".to_string()
    }
}

#[napi]
pub fn calculate_recovery_time_objective(downtime_minutes: f64, max_acceptable_downtime: f64) -> bool {
    downtime_minutes <= max_acceptable_downtime
}

#[napi]
pub fn estimate_business_impact(revenue_per_hour: f64, downtime_hours: f64) -> f64 {
    revenue_per_hour * downtime_hours
}

// Additional utility functions
#[napi]
pub fn get_module_info() -> String {
    format!("Crisis & Emergency Management Module v1.0.0 - Native NAPI-RS Implementation")
}

#[napi]
pub fn validate_crisis_management_data(data: String) -> bool {
    !data.trim().is_empty() && data.len() <= 1000
}
