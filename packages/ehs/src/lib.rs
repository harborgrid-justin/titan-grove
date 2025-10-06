#![deny(clippy::all)]

use napi::bindgen_prelude::*;
use napi_derive::napi;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;

// Core Environmental Health & Safety Data Structures
#[napi(object)]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EhsRecord {
  pub id: String,
  pub name: String,
  pub description: Option<String>,
  pub status: String,
  pub created_at: String,
  pub updated_at: String,
}

#[napi]
impl EhsRecord {
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


// Environmental Health & Safety Functions
// Note: Common utility functions (calculate_efficiency, validate_data_quality, calculate_trend)
// have been moved to the rust-common shared library to eliminate code duplication.
// They are now available in the backend/shared/rust-common package.

// Additional utility functions
#[napi]
pub fn get_module_info() -> String {
    format!("Environmental Health & Safety Module v1.0.0 - Native NAPI-RS Implementation")
}

#[napi]
pub fn validate_ehs_data(data: String) -> bool {
    !data.trim().is_empty() && data.len() <= 1000
}
