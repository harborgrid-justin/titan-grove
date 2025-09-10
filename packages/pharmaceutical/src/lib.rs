#![deny(clippy::all)]

use napi::bindgen_prelude::*;
use napi_derive::napi;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;

// Core Pharmaceutical & Life Sciences Data Structures
#[napi(object)]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PharmaceuticalRecord {
  pub id: String,
  pub name: String,
  pub description: Option<String>,
  pub status: String,
  pub created_at: String,
  pub updated_at: String,
}

#[napi]
impl PharmaceuticalRecord {
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


// Pharmaceutical & Life Sciences Functions
#[napi]
pub fn calculate_clinical_trial_success_rate(successful_trials: i32, total_trials: i32) -> f64 {
    if total_trials > 0 {
        (successful_trials as f64 / total_trials as f64) * 100.0
    } else {
        0.0
    }
}

#[napi]
pub fn calculate_drug_development_cost(phase1_cost: f64, phase2_cost: f64, phase3_cost: f64, regulatory_cost: f64) -> f64 {
    phase1_cost + phase2_cost + phase3_cost + regulatory_cost
}

#[napi]
pub fn validate_regulatory_compliance(requirements_met: i32, total_requirements: i32) -> bool {
    requirements_met >= total_requirements
}

// Additional utility functions
#[napi]
pub fn get_module_info() -> String {
    format!("Pharmaceutical & Life Sciences Module v1.0.0 - Native NAPI-RS Implementation")
}

#[napi]
pub fn validate_pharmaceutical_data(data: String) -> bool {
    !data.trim().is_empty() && data.len() <= 1000
}
