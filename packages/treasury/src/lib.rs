#![deny(clippy::all)]

use napi_derive::napi;
use serde::{Deserialize, Serialize};
use chrono::Utc;
use uuid::Uuid;

// Core Treasury Management Data Structures
#[napi(object)]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TreasuryRecord {
  pub id: String,
  pub name: String,
  pub description: Option<String>,
  pub status: String,
  pub created_at: String,
  pub updated_at: String,
}

// Treasury Management Functions
#[napi]
pub fn create_treasury_record(name: String, description: Option<String>, status: String) -> TreasuryRecord {
    let now = Utc::now().to_rfc3339();
    TreasuryRecord {
      id: Uuid::new_v4().to_string(),
      name,
      description,
      status,
      created_at: now.clone(),
      updated_at: now,
    }
}

#[napi]
pub fn update_treasury_record_status(mut record: TreasuryRecord, new_status: String) -> TreasuryRecord {
    record.status = new_status;
    record.updated_at = Utc::now().to_rfc3339();
    record
}

#[napi]
pub fn calculate_cash_flow(inflows: Vec<f64>, outflows: Vec<f64>) -> f64 {
    let total_inflows: f64 = inflows.iter().sum();
    let total_outflows: f64 = outflows.iter().sum();
    total_inflows - total_outflows
}

#[napi]
pub fn calculate_investment_yield(initial_value: f64, current_value: f64, time_period: f64) -> f64 {
    ((current_value / initial_value).powf(1.0 / time_period) - 1.0) * 100.0
}

#[napi]
pub fn optimize_cash_position(target_balance: f64, current_balance: f64) -> String {
    let difference = target_balance - current_balance;
    if difference > 0.0 {
        format!("Need to increase cash by {:.2}", difference)
    } else if difference < 0.0 {
        format!("Excess cash of {:.2} available for investment", difference.abs())
    } else {
        "Cash position is optimal".to_string()
    }
}

// Additional utility functions
#[napi]
pub fn get_module_info() -> String {
    format!("Treasury Management Module v1.0.0 - Native NAPI-RS Implementation")
}

#[napi]
pub fn validate_treasury_data(data: String) -> bool {
    !data.trim().is_empty() && data.len() <= 1000
}