use napi_derive::napi;
use serde::{Deserialize, Serialize};
use chrono::Utc;
use uuid::Uuid;

/// Basic function for Document Management
#[napi]
pub fn hello_document() -> String {
    format!("Hello from Document Management module!")
}

/// Sample calculation for Document Management
#[napi]
pub fn calculate_sample(value: f64) -> f64 {
    value * 1.1 // Sample 10% increase
}

/// Get module info
#[napi]
pub fn get_module_info() -> String {
    serde_json::json!({
        "name": "document",
        "title": "Document Management",
        "version": "1.0.0",
        "timestamp": chrono::Utc::now().to_rfc3339()
    }).to_string()
}