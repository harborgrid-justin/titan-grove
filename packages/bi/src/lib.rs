use napi_derive::napi;
use serde::{Deserialize, Serialize};
use chrono::Utc;
use uuid::Uuid;

/// Basic function for Business Intelligence
#[napi]
pub fn hello_bi() -> String {
    format!("Hello from Business Intelligence module!")
}

/// Sample calculation for Business Intelligence
#[napi]
pub fn calculate_sample(value: f64) -> f64 {
    value * 1.1 // Sample 10% increase
}

/// Get module info
#[napi]
pub fn get_module_info() -> String {
    serde_json::json!({
        "name": "bi",
        "title": "Business Intelligence",
        "version": "1.0.0",
        "timestamp": chrono::Utc::now().to_rfc3339()
    }).to_string()
}