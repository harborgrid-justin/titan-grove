#![deny(clippy::all)]

use napi::bindgen_prelude::*;
use napi_derive::napi;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;

// Core Data Science Platform Data Structures
#[napi(object)]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DataScienceRecord {
  pub id: String,
  pub name: String,
  pub description: Option<String>,
  pub status: String,
  pub created_at: String,
  pub updated_at: String,
}

#[napi]
impl DataScienceRecord {
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


// Data Science Platform Functions
#[napi]
pub fn calculate_correlation(x_values: Vec<f64>, y_values: Vec<f64>) -> f64 {
    if x_values.len() != y_values.len() || x_values.is_empty() {
        return 0.0;
    }
    
    let n = x_values.len() as f64;
    let sum_x: f64 = x_values.iter().sum();
    let sum_y: f64 = y_values.iter().sum();
    let sum_xy: f64 = x_values.iter().zip(y_values.iter()).map(|(x, y)| x * y).sum();
    let sum_x2: f64 = x_values.iter().map(|x| x * x).sum();
    let sum_y2: f64 = y_values.iter().map(|y| y * y).sum();
    
    let numerator = n * sum_xy - sum_x * sum_y;
    let denominator = ((n * sum_x2 - sum_x * sum_x) * (n * sum_y2 - sum_y * sum_y)).sqrt();
    
    if denominator != 0.0 {
        numerator / denominator
    } else {
        0.0
    }
}

#[napi]
pub fn calculate_standard_deviation(values: Vec<f64>) -> f64 {
    if values.is_empty() {
        return 0.0;
    }
    
    let mean: f64 = values.iter().sum::<f64>() / values.len() as f64;
    let variance: f64 = values.iter().map(|x| (x - mean).powi(2)).sum::<f64>() / values.len() as f64;
    variance.sqrt()
}

#[napi]
pub fn validate_data_quality_score(completeness: f64, accuracy: f64, consistency: f64) -> f64 {
    (completeness + accuracy + consistency) / 3.0
}

// Additional utility functions
#[napi]
pub fn get_module_info() -> String {
    format!("Data Science Platform Module v1.0.0 - Native NAPI-RS Implementation")
}

#[napi]
pub fn validate_data_science_data(data: String) -> bool {
    !data.trim().is_empty() && data.len() <= 1000
}
