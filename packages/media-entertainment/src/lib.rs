#![deny(clippy::all)]

use napi::bindgen_prelude::*;
use napi_derive::napi;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;

// Core Media & Entertainment Management Data Structures
#[napi(object)]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MediaEntertainmentRecord {
  pub id: String,
  pub name: String,
  pub description: Option<String>,
  pub status: String,
  pub created_at: String,
  pub updated_at: String,
}

#[napi]
impl MediaEntertainmentRecord {
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


// Media & Entertainment Management Functions
#[napi]
pub fn calculate_efficiency(input: f64, output: f64) -> f64 {
    if input > 0.0 {
        (output / input) * 100.0
    } else {
        0.0
    }
}

#[napi]
pub fn validate_data_quality(data_points: Vec<f64>) -> bool {
    !data_points.is_empty() && data_points.iter().all(|&x| x >= 0.0)
}

#[napi]
pub fn calculate_trend(values: Vec<f64>) -> String {
    if values.len() < 2 {
        return "Insufficient data".to_string();
    }
    
    let first = values[0];
    let last = values[values.len() - 1];
    
    if last > first {
        "Increasing".to_string()
    } else if last < first {
        "Decreasing".to_string()
    } else {
        "Stable".to_string()
    }
}

// Additional utility functions
#[napi]
pub fn get_module_info() -> String {
    format!("Media & Entertainment Management Module v1.0.0 - Native NAPI-RS Implementation")
}

#[napi]
pub fn validate_media_entertainment_data(data: String) -> bool {
    !data.trim().is_empty() && data.len() <= 1000
}
