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

// PR 123: 30 Additional modules for ultimate enterprise coverage (90 total)
// Advanced Manufacturing & Production (5 modules)
pub mod advanced_manufacturing;
pub mod production_planning;
pub mod lean_manufacturing;
pub mod product_lifecycle;
pub mod factory_automation;

// Global Operations & Governance (5 modules)
pub mod international_trade;
pub mod multi_currency;
pub mod corporate_governance;
pub mod regulatory_compliance;
pub mod business_continuity;

// Financial Services & Fintech (5 modules)
pub mod algorithmic_trading;
pub mod credit_risk;
pub mod payment_processing;
pub mod investment_portfolio;
pub mod regulatory_reporting;

// Advanced Technology & Innovation (5 modules)
pub mod quantum_computing;
pub mod edge_computing;
pub mod augmented_reality;
pub mod neural_networks;
pub mod computer_vision;

// Industry 4.0 & Smart Systems (5 modules)
pub mod digital_twin;
pub mod smart_city;
pub mod autonomous_systems;
pub mod predictive_analytics;
pub mod smart_grid;

// Specialized Professional Services (5 modules)
pub mod professional_services;
pub mod research_development;
pub mod testing_validation;
pub mod advisory_consulting;
pub mod digital_forensics;

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

// PR 123: 30 Additional modules re-exports
// Advanced Manufacturing & Production
pub use advanced_manufacturing::*;
pub use production_planning::*;
pub use lean_manufacturing::*;
pub use product_lifecycle::*;
pub use factory_automation::*;

// Global Operations & Governance
pub use international_trade::*;
pub use multi_currency::*;
pub use corporate_governance::*;
pub use regulatory_compliance::*;
pub use business_continuity::*;

// Financial Services & Fintech
pub use algorithmic_trading::*;
pub use credit_risk::*;
pub use payment_processing::*;
pub use investment_portfolio::*;
pub use regulatory_reporting::*;

// Advanced Technology & Innovation
pub use quantum_computing::*;
pub use edge_computing::*;
pub use augmented_reality::*;
pub use neural_networks::*;
pub use computer_vision::*;

// Industry 4.0 & Smart Systems
pub use digital_twin::*;
pub use smart_city::*;
pub use autonomous_systems::*;
pub use predictive_analytics::*;
pub use smart_grid::*;

// Specialized Professional Services
pub use professional_services::*;
pub use research_development::*;
pub use testing_validation::*;
pub use advisory_consulting::*;
pub use digital_forensics::*;