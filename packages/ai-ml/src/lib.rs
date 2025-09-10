#![deny(clippy::all)]

use napi::bindgen_prelude::*;
use napi_derive::napi;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;

// Core AI/ML Management Data Structures
#[napi(object)]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AiMlRecord {
  pub id: String,
  pub name: String,
  pub description: Option<String>,
  pub status: String,
  pub created_at: String,
  pub updated_at: String,
}

#[napi]
impl AiMlRecord {
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


// AI/ML Management Functions
#[napi]
pub fn calculate_model_accuracy(true_positives: i32, true_negatives: i32, false_positives: i32, false_negatives: i32) -> f64 {
    let total = true_positives + true_negatives + false_positives + false_negatives;
    if total > 0 {
        ((true_positives + true_negatives) as f64 / total as f64) * 100.0
    } else {
        0.0
    }
}

#[napi]
pub fn calculate_model_precision(true_positives: i32, false_positives: i32) -> f64 {
    if true_positives + false_positives > 0 {
        (true_positives as f64 / (true_positives + false_positives) as f64) * 100.0
    } else {
        0.0
    }
}

#[napi]
pub fn calculate_training_cost(hours: f64, compute_units: f64, unit_cost: f64) -> f64 {
    hours * compute_units * unit_cost
}

// Additional utility functions
#[napi]
pub fn get_module_info() -> String {
    format!("AI/ML Management Module v1.0.0 - Native NAPI-RS Implementation")
}

#[napi]
pub fn validate_ai_ml_data(data: String) -> bool {
    !data.trim().is_empty() && data.len() <= 1000
}
