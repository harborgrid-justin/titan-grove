#!/usr/bin/env node

/**
 * Generate 20 Additional Independent NAPI-RS Modules
 * Extends PR 121 with advanced enterprise and industry-specific modules
 */

const fs = require('fs');
const path = require('path');

// Define 20 additional independent modules for advanced enterprise coverage
const additionalModules = [
  {
    name: 'treasury',
    title: 'Treasury Management',
    description: 'Treasury and Cash Management module for Titan Grove - Native NAPI-RS implementation',
    keywords: ['treasury', 'cash-management', 'liquidity', 'investment', 'enterprise', 'napi-rs', 'native', 'rust']
  },
  {
    name: 'tax',
    title: 'Tax Management',
    description: 'Tax Planning and Compliance module for Titan Grove - Native NAPI-RS implementation',
    keywords: ['tax', 'compliance', 'planning', 'reporting', 'enterprise', 'napi-rs', 'native', 'rust']
  },
  {
    name: 'audit',
    title: 'Audit Management',
    description: 'Internal and External Audit Management module for Titan Grove - Native NAPI-RS implementation',
    keywords: ['audit', 'internal-audit', 'compliance', 'governance', 'enterprise', 'napi-rs', 'native', 'rust']
  },
  {
    name: 'legal',
    title: 'Legal Management',
    description: 'Legal Affairs and Contract Management module for Titan Grove - Native NAPI-RS implementation',
    keywords: ['legal', 'contracts', 'litigation', 'intellectual-property', 'enterprise', 'napi-rs', 'native', 'rust']
  },
  {
    name: 'insurance',
    title: 'Insurance Management',
    description: 'Insurance and Claims Management module for Titan Grove - Native NAPI-RS implementation',
    keywords: ['insurance', 'claims', 'underwriting', 'risk-transfer', 'enterprise', 'napi-rs', 'native', 'rust']
  },
  {
    name: 'sustainability',
    title: 'Sustainability Management',
    description: 'ESG and Sustainability Management module for Titan Grove - Native NAPI-RS implementation',
    keywords: ['sustainability', 'esg', 'environmental', 'social-governance', 'enterprise', 'napi-rs', 'native', 'rust']
  },
  {
    name: 'healthcare',
    title: 'Healthcare Management',
    description: 'Healthcare and Medical Management module for Titan Grove - Native NAPI-RS implementation',
    keywords: ['healthcare', 'medical', 'patient-management', 'hipaa', 'enterprise', 'napi-rs', 'native', 'rust']
  },
  {
    name: 'education',
    title: 'Education Management',
    description: 'Educational Institution Management module for Titan Grove - Native NAPI-RS implementation',
    keywords: ['education', 'learning', 'students', 'curriculum', 'enterprise', 'napi-rs', 'native', 'rust']
  },
  {
    name: 'retail',
    title: 'Retail Management',
    description: 'Retail Operations and Point-of-Sale module for Titan Grove - Native NAPI-RS implementation',
    keywords: ['retail', 'pos', 'merchandise', 'customer-experience', 'enterprise', 'napi-rs', 'native', 'rust']
  },
  {
    name: 'hospitality',
    title: 'Hospitality Management',
    description: 'Hotel and Hospitality Management module for Titan Grove - Native NAPI-RS implementation',
    keywords: ['hospitality', 'hotel', 'reservations', 'guest-services', 'enterprise', 'napi-rs', 'native', 'rust']
  },
  {
    name: 'energy',
    title: 'Energy Management',
    description: 'Energy and Utilities Management module for Titan Grove - Native NAPI-RS implementation',
    keywords: ['energy', 'utilities', 'renewable', 'smart-grid', 'enterprise', 'napi-rs', 'native', 'rust']
  },
  {
    name: 'transportation',
    title: 'Transportation Management',
    description: 'Transportation and Fleet Management module for Titan Grove - Native NAPI-RS implementation',
    keywords: ['transportation', 'fleet', 'routing', 'vehicle-management', 'enterprise', 'napi-rs', 'native', 'rust']
  },
  {
    name: 'real-estate',
    title: 'Real Estate Management',
    description: 'Real Estate and Property Management module for Titan Grove - Native NAPI-RS implementation',
    keywords: ['real-estate', 'property', 'leasing', 'facility-management', 'enterprise', 'napi-rs', 'native', 'rust']
  },
  {
    name: 'construction',
    title: 'Construction Management',
    description: 'Construction Project Management module for Titan Grove - Native NAPI-RS implementation',
    keywords: ['construction', 'building', 'project-management', 'safety', 'enterprise', 'napi-rs', 'native', 'rust']
  },
  {
    name: 'agriculture',
    title: 'Agriculture Management',
    description: 'Agricultural and Farm Management module for Titan Grove - Native NAPI-RS implementation',
    keywords: ['agriculture', 'farming', 'crop-management', 'livestock', 'enterprise', 'napi-rs', 'native', 'rust']
  },
  {
    name: 'government',
    title: 'Government Management',
    description: 'Government and Public Sector Management module for Titan Grove - Native NAPI-RS implementation',
    keywords: ['government', 'public-sector', 'citizen-services', 'transparency', 'enterprise', 'napi-rs', 'native', 'rust']
  },
  {
    name: 'nonprofit',
    title: 'Nonprofit Management',
    description: 'Nonprofit and NGO Management module for Titan Grove - Native NAPI-RS implementation',
    keywords: ['nonprofit', 'ngo', 'donations', 'volunteers', 'enterprise', 'napi-rs', 'native', 'rust']
  },
  {
    name: 'cybersecurity',
    title: 'Cybersecurity Management',
    description: 'Cybersecurity and Information Security module for Titan Grove - Native NAPI-RS implementation',
    keywords: ['cybersecurity', 'infosec', 'threat-detection', 'incident-response', 'enterprise', 'napi-rs', 'native', 'rust']
  },
  {
    name: 'blockchain',
    title: 'Blockchain Management',
    description: 'Blockchain and Digital Assets Management module for Titan Grove - Native NAPI-RS implementation',
    keywords: ['blockchain', 'cryptocurrency', 'smart-contracts', 'defi', 'enterprise', 'napi-rs', 'native', 'rust']
  },
  {
    name: 'iot',
    title: 'IoT Management',
    description: 'Internet of Things Device Management module for Titan Grove - Native NAPI-RS implementation',
    keywords: ['iot', 'devices', 'sensors', 'telemetry', 'enterprise', 'napi-rs', 'native', 'rust']
  }
];

// Template for package.json
const packageJsonTemplate = (module) => ({
  name: `@titan-grove/${module.name}`,
  version: "1.0.0",
  description: module.description,
  main: "index.js",
  types: "index.d.ts",
  scripts: {
    build: "napi build --platform --release --js index.js --dts index.d.ts",
    "build:debug": "napi build --platform --js index.js --dts index.d.ts",
    test: "node test.js",
    prepare: "npm run build"
  },
  keywords: module.keywords,
  author: "Titan Grove Team",
  license: "MIT",
  engines: {
    node: ">=18.0.0"
  },
  dependencies: {},
  devDependencies: {
    "@napi-rs/cli": "^2.18.4"
  },
  files: [
    "index.js",
    "index.d.ts",
    "*.node"
  ],
  napi: {
    name: `titan-grove-${module.name}`,
    triples: {
      defaults: true,
      additional: [
        "x86_64-unknown-linux-musl",
        "aarch64-unknown-linux-gnu", 
        "i686-pc-windows-msvc",
        "armv7-unknown-linux-gnueabihf",
        "aarch64-apple-darwin",
        "aarch64-pc-windows-msvc",
        "aarch64-unknown-linux-musl",
        "aarch64-linux-android",
        "x86_64-unknown-freebsd",
        "x86_64-unknown-linux-musl",
        "x86_64-pc-windows-msvc",
        "x86_64-apple-darwin"
      ]
    }
  }
});

// Template for Cargo.toml
const cargoTomlTemplate = (module) => `[package]
name = "titan-grove-${module.name}"
version = "1.0.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
napi = { version = "2.13.0", default-features = false, features = ["napi4"] }
napi-derive = "2.13.0"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
chrono = { version = "0.4", features = ["serde"] }
uuid = { version = "1.0", features = ["v4", "serde"] }

[build-dependencies]
napi-build = "2.0.1"
`;

// Template for build.rs
const buildRsTemplate = `extern crate napi_build;

fn main() {
  napi_build::setup();
}
`;

// Template for Rust lib.rs with domain-specific functions
const getLibRsTemplate = (module) => {
  const moduleTitle = module.title;
  const moduleName = module.name;
  const capitalizedModuleName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
  const underscoreModuleName = moduleName.replace(/-/g, '_');
  
  // Generate domain-specific functions based on module type
  let domainFunctions = '';
  
  switch(moduleName) {
    case 'treasury':
      domainFunctions = `
// Treasury Management Functions
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
}`;
      break;
    case 'tax':
      domainFunctions = `
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
}`;
      break;
    case 'healthcare':
      domainFunctions = `
// Healthcare Management Functions
#[napi]
pub fn calculate_bmi(weight_kg: f64, height_m: f64) -> f64 {
    weight_kg / (height_m * height_m)
}

#[napi]
pub fn calculate_patient_risk_score(age: i32, conditions: Vec<String>) -> i32 {
    let base_score = age / 10;
    let condition_score = conditions.len() as i32 * 5;
    base_score + condition_score
}

#[napi]
pub fn validate_insurance_coverage(procedure_cost: f64, coverage_percentage: f64) -> f64 {
    procedure_cost * (coverage_percentage / 100.0)
}`;
      break;
    case 'cybersecurity':
      domainFunctions = `
// Cybersecurity Management Functions
#[napi]
pub fn calculate_risk_score(vulnerabilities: i32, threat_level: i32) -> i32 {
    (vulnerabilities * threat_level).min(100)
}

#[napi]
pub fn validate_password_strength(password: String) -> bool {
    password.len() >= 8 && 
    password.chars().any(|c| c.is_uppercase()) &&
    password.chars().any(|c| c.is_lowercase()) &&
    password.chars().any(|c| c.is_numeric())
}

#[napi]
pub fn calculate_incident_severity(impact: i32, urgency: i32) -> String {
    match impact * urgency {
        1..=4 => "Low".to_string(),
        5..=12 => "Medium".to_string(),
        13..=20 => "High".to_string(),
        _ => "Critical".to_string()
    }
}`;
      break;
    default:
      domainFunctions = `
// ` + moduleTitle + ` Functions
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
}`;
  }

  return `#![deny(clippy::all)]

use napi::bindgen_prelude::*;
use napi_derive::napi;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;

// Core ` + moduleTitle + ` Data Structures
#[napi(object)]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ` + capitalizedModuleName + `Record {
  pub id: String,
  pub name: String,
  pub description: Option<String>,
  pub status: String,
  pub created_at: String,
  pub updated_at: String,
}

#[napi]
impl ` + capitalizedModuleName + `Record {
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

` + domainFunctions + `

// Additional utility functions
#[napi]
pub fn get_module_info() -> String {
    format!("` + moduleTitle + ` Module v1.0.0 - Native NAPI-RS Implementation")
}

#[napi]
pub fn validate_` + underscoreModuleName + `_data(data: String) -> bool {
    !data.trim().is_empty() && data.len() <= 1000
}
`;
};

// Template for index.js
const indexJsTemplate = (module) => `const { existsSync, readFileSync } = require('fs')
const { join } = require('path')

const { platform, arch } = process

let nativeBinding = null
let localFileExisted = false
let loadError = null

function isMusl() {
  // For Node 10
  if (!process.report || typeof process.report.getReport !== 'function') {
    try {
      const lddPath = require('child_process').execSync('which ldd').toString().trim()
      return readFileSync(lddPath, 'utf8').includes('musl')
    } catch (e) {
      return true
    }
  } else {
    const { glibcVersionRuntime } = process.report.getReport().header
    return !glibcVersionRuntime
  }
}

switch (platform) {
  case 'android':
    switch (arch) {
      case 'arm64':
        localFileExisted = existsSync(join(__dirname, 'titan-grove-${module.name}.android-arm64.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./titan-grove-${module.name}.android-arm64.node')
          } else {
            nativeBinding = require('@titan-grove/${module.name}-android-arm64')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm':
        localFileExisted = existsSync(join(__dirname, 'titan-grove-${module.name}.android-arm-eabi.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./titan-grove-${module.name}.android-arm-eabi.node')
          } else {
            nativeBinding = require('@titan-grove/${module.name}-android-arm-eabi')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(\`Unsupported architecture on Android \${arch}\`)
    }
    break
  case 'win32':
    switch (arch) {
      case 'x64':
        localFileExisted = existsSync(join(__dirname, 'titan-grove-${module.name}.win32-x64-msvc.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./titan-grove-${module.name}.win32-x64-msvc.node')
          } else {
            nativeBinding = require('@titan-grove/${module.name}-win32-x64-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'ia32':
        localFileExisted = existsSync(join(__dirname, 'titan-grove-${module.name}.win32-ia32-msvc.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./titan-grove-${module.name}.win32-ia32-msvc.node')
          } else {
            nativeBinding = require('@titan-grove/${module.name}-win32-ia32-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm64':
        localFileExisted = existsSync(join(__dirname, 'titan-grove-${module.name}.win32-arm64-msvc.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./titan-grove-${module.name}.win32-arm64-msvc.node')
          } else {
            nativeBinding = require('@titan-grove/${module.name}-win32-arm64-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(\`Unsupported architecture on Windows: \${arch}\`)
    }
    break
  case 'darwin':
    localFileExisted = existsSync(join(__dirname, 'titan-grove-${module.name}.darwin-universal.node'))
    try {
      if (localFileExisted) {
        nativeBinding = require('./titan-grove-${module.name}.darwin-universal.node')
      } else {
        nativeBinding = require('@titan-grove/${module.name}-darwin-universal')
      }
    } catch (e) {
      loadError = e
    }
    switch (arch) {
      case 'x64':
        localFileExisted = existsSync(join(__dirname, 'titan-grove-${module.name}.darwin-x64.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./titan-grove-${module.name}.darwin-x64.node')
          } else {
            nativeBinding = require('@titan-grove/${module.name}-darwin-x64')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm64':
        localFileExisted = existsSync(join(__dirname, 'titan-grove-${module.name}.darwin-arm64.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./titan-grove-${module.name}.darwin-arm64.node')
          } else {
            nativeBinding = require('@titan-grove/${module.name}-darwin-arm64')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(\`Unsupported architecture on macOS: \${arch}\`)
    }
    break
  case 'freebsd':
    if (arch !== 'x64') {
      throw new Error(\`Unsupported architecture on FreeBSD: \${arch}\`)
    }
    localFileExisted = existsSync(join(__dirname, 'titan-grove-${module.name}.freebsd-x64.node'))
    try {
      if (localFileExisted) {
        nativeBinding = require('./titan-grove-${module.name}.freebsd-x64.node')
      } else {
        nativeBinding = require('@titan-grove/${module.name}-freebsd-x64')
      }
    } catch (e) {
      loadError = e
    }
    break
  case 'linux':
    switch (arch) {
      case 'x64':
        if (isMusl()) {
          localFileExisted = existsSync(join(__dirname, 'titan-grove-${module.name}.linux-x64-musl.node'))
          try {
            if (localFileExisted) {
              nativeBinding = require('./titan-grove-${module.name}.linux-x64-musl.node')
            } else {
              nativeBinding = require('@titan-grove/${module.name}-linux-x64-musl')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = existsSync(join(__dirname, 'titan-grove-${module.name}.linux-x64-gnu.node'))
          try {
            if (localFileExisted) {
              nativeBinding = require('./titan-grove-${module.name}.linux-x64-gnu.node')
            } else {
              nativeBinding = require('@titan-grove/${module.name}-linux-x64-gnu')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 'arm64':
        if (isMusl()) {
          localFileExisted = existsSync(join(__dirname, 'titan-grove-${module.name}.linux-arm64-musl.node'))
          try {
            if (localFileExisted) {
              nativeBinding = require('./titan-grove-${module.name}.linux-arm64-musl.node')
            } else {
              nativeBinding = require('@titan-grove/${module.name}-linux-arm64-musl')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = existsSync(join(__dirname, 'titan-grove-${module.name}.linux-arm64-gnu.node'))
          try {
            if (localFileExisted) {
              nativeBinding = require('./titan-grove-${module.name}.linux-arm64-gnu.node')
            } else {
              nativeBinding = require('@titan-grove/${module.name}-linux-arm64-gnu')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 'arm':
        localFileExisted = existsSync(join(__dirname, 'titan-grove-${module.name}.linux-arm-gnueabihf.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./titan-grove-${module.name}.linux-arm-gnueabihf.node')
          } else {
            nativeBinding = require('@titan-grove/${module.name}-linux-arm-gnueabihf')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(\`Unsupported architecture on Linux: \${arch}\`)
    }
    break
  default:
    throw new Error(\`Unsupported OS: \${platform}, architecture: \${arch}\`)
}

if (!nativeBinding) {
  if (loadError) {
    throw loadError
  }
  throw new Error(\`Failed to load native binding\`)
}

module.exports = nativeBinding
`;

// Template for test.js
const testJsTemplate = (module) => {
  const capitalizedModuleName = module.name.charAt(0).toUpperCase() + module.name.slice(1);
  return `#!/usr/bin/env node

const { ` + capitalizedModuleName + `Record } = require('./index.js');

console.log('🧪 Testing @titan-grove/` + module.name + `');
console.log('===============================');

try {
  // Test record creation
  const record = new ` + capitalizedModuleName + `Record(
    'Test ` + module.title + `',
    'Test description for ` + module.title + `',
    'Active'
  );
  
  console.log('✅ Record creation:', record.name);
  
  // Test status update
  record.updateStatus('Updated');
  console.log('✅ Status update:', record.status);
  
  // Test age calculation
  const age = record.getAgeInDays();
  console.log('✅ Age calculation:', age, 'days');
  
  console.log('🎉 All tests passed for @titan-grove/` + module.name + `');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
`;
};

// Generate index.d.ts template
const indexDtsTemplate = (module) => {
  const capitalizedModuleName = module.name.charAt(0).toUpperCase() + module.name.slice(1);
  const underscoreModuleName = module.name.replace(/-/g, '_');
  return `/* tslint:disable */
/* eslint-disable */

/* auto-generated by NAPI-RS */

export interface ` + capitalizedModuleName + `Record {
  id: string
  name: string
  description?: string
  status: string
  createdAt: string
  updatedAt: string
}
export class ` + capitalizedModuleName + `Record {
  constructor(name: string, description?: string, status: string)
  updateStatus(newStatus: string): void
  getAgeInDays(): number
}
export function getModuleInfo(): string
export function validate` + underscoreModuleName + `_data(data: string): boolean
`;
};

console.log('🏗️  Generating 20 Additional Independent NAPI-RS Modules');
console.log('========================================================');
console.log('🎯 Extending enterprise coverage with advanced and industry-specific modules');
console.log('');

const packagesDir = path.join(__dirname, 'packages');

additionalModules.forEach((module, index) => {
  console.log(`📦 Creating module ${index + 1}/20: @titan-grove/${module.name}`);
  
  const moduleDir = path.join(packagesDir, module.name);
  const srcDir = path.join(moduleDir, 'src');
  
  // Create directories
  if (!fs.existsSync(moduleDir)) {
    fs.mkdirSync(moduleDir, { recursive: true });
  }
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir, { recursive: true });
  }
  
  // Generate files
  fs.writeFileSync(
    path.join(moduleDir, 'package.json'),
    JSON.stringify(packageJsonTemplate(module), null, 2)
  );
  
  fs.writeFileSync(
    path.join(moduleDir, 'Cargo.toml'),
    cargoTomlTemplate(module)
  );
  
  fs.writeFileSync(
    path.join(moduleDir, 'build.rs'),
    buildRsTemplate
  );
  
  fs.writeFileSync(
    path.join(srcDir, 'lib.rs'),
    getLibRsTemplate(module)
  );
  
  fs.writeFileSync(
    path.join(moduleDir, 'index.js'),
    indexJsTemplate(module)
  );
  
  fs.writeFileSync(
    path.join(moduleDir, 'index.d.ts'),
    indexDtsTemplate(module)
  );
  
  fs.writeFileSync(
    path.join(moduleDir, 'test.js'),
    testJsTemplate(module)
  );
  
  console.log(`   ✅ Generated @titan-grove/${module.name} - ${module.title}`);
});

console.log('');
console.log('🎉 Successfully Generated 20 Additional Modules!');
console.log('=================================================');
console.log('');
console.log('📋 New Module Summary:');
console.log('=====================');
additionalModules.forEach((module, index) => {
  console.log(`${index + 1}.  @titan-grove/${module.name} - ${module.title}`);
});

console.log('');
console.log('🔧 Next Steps:');
console.log('1. Build modules: for module in packages/*/; do (cd "$module" && npm install); done');
console.log('2. Test modules: node test-all-40-modules.js');
console.log('3. Publish: for module in packages/*/; do (cd "$module" && npm publish --access public); done');
console.log('');
console.log('🚀 Total Enterprise Coverage: 40 Independent NAPI-RS Modules');