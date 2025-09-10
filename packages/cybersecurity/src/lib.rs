#![deny(clippy::all)]

use napi::bindgen_prelude::*;
use napi_derive::napi;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;

// Core Cybersecurity Management Data Structures
#[napi(object)]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CybersecurityRecord {
  pub id: String,
  pub name: String,
  pub description: Option<String>,
  pub status: String,
  pub created_at: String,
  pub updated_at: String,
}

#[napi]
impl CybersecurityRecord {
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


// Cybersecurity Management Functions
#[napi]
pub fn calculate_risk_score(vulnerabilities: i32, threat_level: i32) -> i32 {
    (vulnerabilities * threat_level).min(100)
}

#[napi]
pub fn validate_password_strength(password: String) -> bool {
    password.len() >= 8 && 
    password.chars().any(|c| c.is_uppercase()) &&
    password.chars().any(|c| c.is_lowercase()) &&
    password.chars().any(|c| c.is_numeric())
}

#[napi]
pub fn calculate_incident_severity(impact: i32, urgency: i32) -> String {
    match impact * urgency {
        1..=4 => "Low".to_string(),
        5..=12 => "Medium".to_string(),
        13..=20 => "High".to_string(),
        _ => "Critical".to_string()
    }
}

// Additional utility functions
#[napi]
pub fn get_module_info() -> String {
    format!("Cybersecurity Management Module v1.0.0 - Native NAPI-RS Implementation")
}

#[napi]
pub fn validate_cybersecurity_data(data: String) -> bool {
    !data.trim().is_empty() && data.len() <= 1000
}
