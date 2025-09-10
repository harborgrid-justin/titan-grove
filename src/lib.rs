#![deny(clippy::all)]

use napi_derive::napi;

#[napi]
pub fn sum(a: i32, b: i32) -> i32 {
  a + b
}

// Export all the native modules
// Original 10 modules from PR #117
pub mod risk;
pub mod compliance;
pub mod document;
pub mod workflow;
pub mod quality;
pub mod inventory;
pub mod integration;
pub mod maintenance;
pub mod assets;
pub mod calculations;

// New 20 modules for enhanced NAPI-RS coverage
pub mod procurement;
pub mod orders;
pub mod financial;
pub mod hr;
pub mod manufacturing;
pub mod crm;
pub mod scm;
pub mod project;
pub mod service;
pub mod bi;
pub mod logistics;
pub mod field_service;
pub mod real_estate;
pub mod rental;
pub mod capital_asset;
pub mod enterprise_asset;
pub mod equipment_cost;
pub mod yard_management;
pub mod resource_optimization;
pub mod reporting;

// Additional 20 modules for comprehensive enterprise coverage
pub mod accounting;
pub mod budgeting;
pub mod tax;
pub mod audit;
pub mod pricing;
pub mod sales;
pub mod marketing;
pub mod banking;
pub mod investment;
pub mod treasury;
pub mod vendor;
pub mod customer;
pub mod training;
pub mod performance;
pub mod planning;
pub mod sustainability;
pub mod analytics;

// Re-export all functions from modules
// Original modules
pub use risk::*;
pub use compliance::*;
pub use document::*;
pub use workflow::*;
pub use quality::*;
pub use inventory::*;
pub use integration::*;
pub use maintenance::*;
pub use assets::*;
pub use calculations::*;

// New modules
pub use procurement::*;
pub use orders::*;
pub use financial::*;
pub use hr::*;
pub use manufacturing::*;
pub use crm::*;
pub use scm::*;
pub use project::*;
pub use service::*;
pub use bi::*;
pub use logistics::*;
pub use field_service::*;
pub use real_estate::*;
pub use rental::*;
pub use capital_asset::*;
pub use enterprise_asset::*;
pub use equipment_cost::*;
pub use yard_management::*;
pub use resource_optimization::*;
pub use reporting::*;

// Additional 20 modules
pub use accounting::*;
pub use budgeting::*;
pub use tax::*;
pub use audit::*;
pub use pricing::*;
pub use sales::*;
pub use marketing::*;
pub use banking::*;
pub use investment::*;
pub use treasury::*;
pub use vendor::*;
pub use customer::*;
pub use training::*;
pub use performance::*;
pub use planning::*;
pub use sustainability::*;
pub use analytics::*;