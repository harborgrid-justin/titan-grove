#![deny(clippy::all)]

use napi::bindgen_prelude::*;
use napi_derive::napi;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;

// Core Healthcare Management Data Structures
#[napi(object)]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HealthcareRecord {
  pub id: String,
  pub name: String,
  pub description: Option<String>,
  pub status: String,
  pub created_at: String,
  pub updated_at: String,
}

#[napi]
impl HealthcareRecord {
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


// Healthcare Management Functions
#[napi]
pub fn calculate_bmi(weight_kg: f64, height_m: f64) -> f64 {
    weight_kg / (height_m * height_m)
}

#[napi]
pub fn calculate_patient_risk_score(age: i32, conditions: Vec<String>) -> i32 {
    let base_score = age / 10;
    let condition_score = conditions.len() as i32 * 5;
    base_score + condition_score
}

#[napi]
pub fn validate_insurance_coverage(procedure_cost: f64, coverage_percentage: f64) -> f64 {
    procedure_cost * (coverage_percentage / 100.0)
}

// Additional utility functions
#[napi]
pub fn get_module_info() -> String {
    format!("Healthcare Management Module v1.0.0 - Native NAPI-RS Implementation")
}

#[napi]
pub fn validate_healthcare_data(data: String) -> bool {
    !data.trim().is_empty() && data.len() <= 1000
}
