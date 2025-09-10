#![deny(clippy::all)]

use napi_derive::napi;

#[napi]
pub fn sum(a: i32, b: i32) -> i32 {
  a + b
}

// Export all the native modules
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

// Re-export all functions from modules
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