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