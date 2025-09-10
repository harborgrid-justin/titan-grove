#![deny(clippy::all)]

use napi::bindgen_prelude::*;
use napi_derive::napi;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;

// Core Tax Management Data Structures
#[napi(object)]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TaxRecord {
  pub id: String,
  pub name: String,
  pub description: Option<String>,
  pub status: String,
  pub created_at: String,
  pub updated_at: String,
}

#[napi]
impl TaxRecord {
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


// Tax Management Functions
#[napi]
pub fn calculate_corporate_tax(taxable_income: f64, tax_rate: f64) -> f64 {
    taxable_income * (tax_rate / 100.0)
}

#[napi]
pub fn estimate_quarterly_payment(annual_income: f64, tax_rate: f64) -> f64 {
    (annual_income * (tax_rate / 100.0)) / 4.0
}

#[napi]
pub fn validate_tax_compliance(deductions: Vec<f64>, income: f64) -> bool {
    let total_deductions: f64 = deductions.iter().sum();
    total_deductions <= income * 0.3 // Simple compliance check
}

// Additional utility functions
#[napi]
pub fn get_module_info() -> String {
    format!("Tax Management Module v1.0.0 - Native NAPI-RS Implementation")
}

#[napi]
pub fn validate_tax_data(data: String) -> bool {
    !data.trim().is_empty() && data.len() <= 1000
}
