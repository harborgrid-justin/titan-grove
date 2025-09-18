use napi_derive::napi;
use serde::{Deserialize, Serialize};

/// Fortune 100 Data Standardization Engine
/// Provides enterprise-grade data standardization, cleansing, and normalization

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct DataStandardizationRule {
    pub rule_id: String,
    pub rule_name: String,
    pub source_format: String,
    pub target_format: String,
    pub transformation_logic: String,
    pub validation_rules: Vec<String>,
    pub is_active: bool,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct StandardizationResult {
    pub original_data: String,
    pub standardized_data: String,
    pub transformations_applied: Vec<String>,
    pub validation_passed: bool,
    pub quality_score: f64,
    pub processing_time_ms: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct FortuneDataProfile {
    pub data_type: String,
    pub total_records: i32,
    pub valid_records: i32,
    pub invalid_records: i32,
    pub duplicate_records: i32,
    pub completeness_percentage: f64,
    pub accuracy_percentage: f64,
    pub consistency_percentage: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct MultiCurrencyStandardization {
    pub base_currency: String,
    pub target_currency: String,
    pub exchange_rate: f64,
    pub conversion_date: String,
    pub amount_base: f64,
    pub amount_converted: f64,
    pub conversion_fee: f64,
}

/// Fortune 100 Data Standardization Functions
#[napi]
pub fn standardize_fortune_financial_data(raw_data: String) -> StandardizationResult {
    let start_time = std::time::Instant::now();
    
    // Fortune 100 financial data standardization
    let mut transformations = Vec::new();
    let mut standardized = raw_data.clone();
    
    // Currency standardization
    if standardized.contains("USD") || standardized.contains("$") {
        standardized = standardized.replace("$", "USD ");
        transformations.push("CURRENCY_SYMBOL_TO_ISO_CODE".to_string());
    }
    
    // Date standardization (ISO 8601)
    if standardized.contains("/") {
        // Convert MM/DD/YYYY to YYYY-MM-DD
        standardized = standardize_date_format(&standardized);
        transformations.push("DATE_FORMAT_ISO8601".to_string());
    }
    
    // Number standardization
    standardized = standardized.replace(",", ""); // Remove thousand separators
    transformations.push("NUMBER_FORMAT_DECIMAL".to_string());
    
    // Data cleansing
    standardized = standardized.trim().to_string();
    transformations.push("WHITESPACE_TRIMMED".to_string());
    
    let validation_passed = validate_standardized_data(&standardized);
    let quality_score = calculate_data_quality_score(&raw_data, &standardized);
    
    StandardizationResult {
        original_data: raw_data,
        standardized_data: standardized,
        transformations_applied: transformations,
        validation_passed,
        quality_score,
        processing_time_ms: start_time.elapsed().as_millis() as f64,
    }
}

#[napi]
pub fn standardize_multi_currency_transaction(
    amount: f64,
    source_currency: String,
    target_currency: String,
) -> MultiCurrencyStandardization {
    // Fortune 100 multi-currency standardization with real exchange rates simulation
    let exchange_rate = get_simulated_exchange_rate(&source_currency, &target_currency);
    let converted_amount = amount * exchange_rate;
    let conversion_fee = converted_amount * 0.0025; // 0.25% standard fee
    
    MultiCurrencyStandardization {
        base_currency: source_currency,
        target_currency,
        exchange_rate,
        conversion_date: chrono::Utc::now().format("%Y-%m-%d").to_string(),
        amount_base: amount,
        amount_converted: converted_amount,
        conversion_fee,
    }
}

#[napi]
pub fn profile_fortune_dataset(dataset: Vec<String>) -> FortuneDataProfile {
    let total_records = dataset.len() as i32;
    let mut valid_records = 0;
    let mut duplicate_records = 0;
    let mut completeness_score = 0.0;
    
    // Fortune 100 data profiling analysis
    let mut seen_records = std::collections::HashSet::new();
    
    for record in &dataset {
        if !record.trim().is_empty() && record.len() > 5 {
            valid_records += 1;
            completeness_score += 1.0;
        }
        
        if seen_records.contains(record) {
            duplicate_records += 1;
        } else {
            seen_records.insert(record.clone());
        }
    }
    
    let completeness_percentage = if total_records > 0 {
        (completeness_score / total_records as f64) * 100.0
    } else {
        0.0
    };
    
    // Fortune 100 quality metrics
    let accuracy_percentage = calculate_accuracy_percentage(&dataset);
    let consistency_percentage = calculate_consistency_percentage(&dataset);
    
    FortuneDataProfile {
        data_type: "ENTERPRISE_DATASET".to_string(),
        total_records,
        valid_records,
        invalid_records: total_records - valid_records,
        duplicate_records,
        completeness_percentage,
        accuracy_percentage,
        consistency_percentage,
    }
}

#[napi]
pub fn create_data_standardization_rule(
    rule_name: String,
    source_format: String,
    target_format: String,
    transformation_logic: String,
) -> DataStandardizationRule {
    DataStandardizationRule {
        rule_id: uuid::Uuid::new_v4().to_string(),
        rule_name,
        source_format,
        target_format,
        transformation_logic,
        validation_rules: vec![
            "NOT_NULL".to_string(),
            "MIN_LENGTH_5".to_string(),
            "MAX_LENGTH_1000".to_string(),
            "FORMAT_VALID".to_string(),
        ],
        is_active: true,
    }
}

#[napi]
pub fn execute_enterprise_data_cleansing(raw_data: String) -> String {
    let mut cleansed = raw_data;
    
    // Fortune 100 data cleansing pipeline
    // Remove HTML tags
    cleansed = regex::Regex::new(r"<[^>]*>").unwrap()
        .replace_all(&cleansed, "").to_string();
    
    // Standardize phone numbers (US format)
    cleansed = regex::Regex::new(r"\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})")
        .unwrap()
        .replace_all(&cleansed, "($1) $2-$3")
        .to_string();
    
    // Standardize email addresses (lowercase)
    cleansed = regex::Regex::new(r"([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})")
        .unwrap()
        .replace_all(&cleansed, |caps: &regex::Captures| {
            caps[1].to_lowercase()
        })
        .to_string();
    
    // Remove extra whitespace
    cleansed = regex::Regex::new(r"\s+").unwrap()
        .replace_all(&cleansed, " ").to_string();
    
    cleansed.trim().to_string()
}

// Helper functions
fn standardize_date_format(data: &str) -> String {
    // Convert MM/DD/YYYY to YYYY-MM-DD
    regex::Regex::new(r"(\d{1,2})/(\d{1,2})/(\d{4})")
        .unwrap()
        .replace_all(data, "$3-$1-$2")
        .to_string()
}

fn validate_standardized_data(data: &str) -> bool {
    // Fortune 100 validation criteria
    !data.is_empty() && 
    data.len() >= 5 && 
    data.len() <= 10000 &&
    !data.contains("<script>") &&
    !data.contains("DROP TABLE")
}

fn calculate_data_quality_score(original: &str, standardized: &str) -> f64 {
    let completeness = if !standardized.is_empty() { 25.0 } else { 0.0 };
    let accuracy = if standardized.len() >= original.len() { 25.0 } else { 15.0 };
    let consistency = 25.0; // Assume consistent after standardization
    let validity = if validate_standardized_data(standardized) { 25.0 } else { 10.0 };
    
    completeness + accuracy + consistency + validity
}

fn get_simulated_exchange_rate(from: &str, to: &str) -> f64 {
    // Simulated Fortune 100 exchange rates
    match (from, to) {
        ("USD", "EUR") => 0.85,
        ("USD", "GBP") => 0.73,
        ("USD", "JPY") => 110.0,
        ("USD", "CAD") => 1.25,
        ("EUR", "USD") => 1.18,
        ("GBP", "USD") => 1.37,
        ("JPY", "USD") => 0.0091,
        ("CAD", "USD") => 0.80,
        _ => 1.0, // Same currency or default
    }
}

fn calculate_accuracy_percentage(dataset: &[String]) -> f64 {
    let mut accurate_records = 0;
    
    for record in dataset {
        // Simple accuracy check - has structured data
        if record.contains("{") || record.contains(",") || record.contains(":") {
            accurate_records += 1;
        }
    }
    
    if dataset.is_empty() {
        0.0
    } else {
        (accurate_records as f64 / dataset.len() as f64) * 100.0
    }
}

fn calculate_consistency_percentage(dataset: &[String]) -> f64 {
    if dataset.len() < 2 {
        return 100.0;
    }
    
    let first_format = analyze_data_format(&dataset[0]);
    let mut consistent_records = 1;
    
    for record in dataset.iter().skip(1) {
        let format = analyze_data_format(record);
        if format == first_format {
            consistent_records += 1;
        }
    }
    
    (consistent_records as f64 / dataset.len() as f64) * 100.0
}

fn analyze_data_format(data: &str) -> String {
    if data.contains("{") && data.contains("}") {
        "JSON".to_string()
    } else if data.contains(",") && data.split(',').count() > 2 {
        "CSV".to_string()
    } else if data.contains("=") {
        "KEY_VALUE".to_string()
    } else {
        "TEXT".to_string()
    }
}