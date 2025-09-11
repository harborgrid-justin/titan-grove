use napi_derive::napi;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use regex::Regex;

/// Production-Grade Data Standardization and Validation Engine
/// Provides comprehensive data cleaning, validation, and transformation

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct DataStandardizationRule {
    pub field_name: String,
    pub rule_type: String, // "format", "validate", "transform", "enrich"
    pub pattern: Option<String>, // Regex pattern for validation/formatting
    pub transformation: Option<String>, // "uppercase", "lowercase", "title_case", "normalize"
    pub validation_rules: Vec<String>, // e.g., "required", "email", "phone", "numeric"
    pub default_value: Option<String>,
    pub allowed_values: Vec<String>, // For enumeration validation
    pub min_length: Option<i32>,
    pub max_length: Option<i32>,
    pub min_value: Option<f64>,
    pub max_value: Option<f64>,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct ValidationResult {
    pub field_name: String,
    pub is_valid: bool,
    pub original_value: String,
    pub standardized_value: String,
    pub errors: Vec<String>,
    pub warnings: Vec<String>,
    pub transformations_applied: Vec<String>,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct DataQualityReport {
    pub total_records: i32,
    pub valid_records: i32,
    pub invalid_records: i32,
    pub data_quality_score: f64,
    pub field_quality_scores: HashMap<String, f64>,
    pub common_errors: Vec<String>,
    pub suggestions: Vec<String>,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct BusinessDataProfile {
    pub entity_type: String, // "customer", "product", "transaction", "employee"
    pub required_fields: Vec<String>,
    pub standardization_rules: Vec<DataStandardizationRule>,
    pub business_logic_validations: Vec<String>,
    pub data_enrichment_sources: Vec<String>,
}

/// Standardize and validate business data
#[napi]
pub fn standardize_business_data(
    data: HashMap<String, String>,
    rules: Vec<DataStandardizationRule>,
) -> Vec<ValidationResult> {
    let mut results = Vec::new();
    
    for rule in &rules {
        let field_value = data.get(&rule.field_name).cloned().unwrap_or_default();
        let mut result = ValidationResult {
            field_name: rule.field_name.clone(),
            is_valid: true,
            original_value: field_value.clone(),
            standardized_value: field_value.clone(),
            errors: Vec::new(),
            warnings: Vec::new(),
            transformations_applied: Vec::new(),
        };
        
        // Apply transformations
        if let Some(transformation) = &rule.transformation {
            result.standardized_value = apply_transformation(&result.standardized_value, transformation);
            result.transformations_applied.push(transformation.clone());
        }
        
        // Apply validations
        for validation_rule in &rule.validation_rules {
            if let Some(error) = validate_field(&result.standardized_value, validation_rule, rule) {
                result.errors.push(error);
                result.is_valid = false;
            }
        }
        
        // Apply pattern validation
        if let Some(pattern) = &rule.pattern {
            if !validate_pattern(&result.standardized_value, pattern) {
                result.errors.push(format!("Value does not match required pattern: {}", pattern));
                result.is_valid = false;
            }
        }
        
        // Apply business logic validations
        apply_business_validations(&mut result, rule);
        
        results.push(result);
    }
    
    results
}

/// Create standardized customer data profile
#[napi]
pub fn create_customer_data_profile() -> BusinessDataProfile {
    BusinessDataProfile {
        entity_type: "customer".to_string(),
        required_fields: vec![
            "customer_id".to_string(),
            "first_name".to_string(),
            "last_name".to_string(),
            "email".to_string(),
            "phone".to_string(),
            "address".to_string(),
        ],
        standardization_rules: vec![
            DataStandardizationRule {
                field_name: "email".to_string(),
                rule_type: "validate".to_string(),
                pattern: Some(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$".to_string()),
                transformation: Some("lowercase".to_string()),
                validation_rules: vec!["required".to_string(), "email".to_string()],
                default_value: None,
                allowed_values: vec![],
                min_length: Some(5),
                max_length: Some(255),
                min_value: None,
                max_value: None,
            },
            DataStandardizationRule {
                field_name: "phone".to_string(),
                rule_type: "format".to_string(),
                pattern: Some(r"^\+?1?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$".to_string()),
                transformation: Some("normalize_phone".to_string()),
                validation_rules: vec!["required".to_string(), "phone".to_string()],
                default_value: None,
                allowed_values: vec![],
                min_length: Some(10),
                max_length: Some(15),
                min_value: None,
                max_value: None,
            },
            DataStandardizationRule {
                field_name: "first_name".to_string(),
                rule_type: "transform".to_string(),
                pattern: None,
                transformation: Some("title_case".to_string()),
                validation_rules: vec!["required".to_string(), "alpha".to_string()],
                default_value: None,
                allowed_values: vec![],
                min_length: Some(1),
                max_length: Some(50),
                min_value: None,
                max_value: None,
            },
            DataStandardizationRule {
                field_name: "last_name".to_string(),
                rule_type: "transform".to_string(),
                pattern: None,
                transformation: Some("title_case".to_string()),
                validation_rules: vec!["required".to_string(), "alpha".to_string()],
                default_value: None,
                allowed_values: vec![],
                min_length: Some(1),
                max_length: Some(50),
                min_value: None,
                max_value: None,
            },
        ],
        business_logic_validations: vec![
            "validate_customer_creditworthiness".to_string(),
            "check_duplicate_customer".to_string(),
            "validate_tax_id".to_string(),
        ],
        data_enrichment_sources: vec![
            "credit_bureau".to_string(),
            "address_validation_service".to_string(),
            "social_media_profiles".to_string(),
        ],
    }
}

/// Create financial transaction data profile
#[napi]
pub fn create_financial_transaction_profile() -> BusinessDataProfile {
    BusinessDataProfile {
        entity_type: "financial_transaction".to_string(),
        required_fields: vec![
            "transaction_id".to_string(),
            "amount".to_string(),
            "currency".to_string(),
            "transaction_date".to_string(),
            "account_number".to_string(),
            "transaction_type".to_string(),
        ],
        standardization_rules: vec![
            DataStandardizationRule {
                field_name: "amount".to_string(),
                rule_type: "validate".to_string(),
                pattern: Some(r"^\d+(\.\d{2})?$".to_string()),
                transformation: Some("format_currency".to_string()),
                validation_rules: vec!["required".to_string(), "numeric".to_string(), "positive".to_string()],
                default_value: None,
                allowed_values: vec![],
                min_length: None,
                max_length: None,
                min_value: Some(0.01),
                max_value: Some(1000000000.0),
            },
            DataStandardizationRule {
                field_name: "currency".to_string(),
                rule_type: "validate".to_string(),
                pattern: Some(r"^[A-Z]{3}$".to_string()),
                transformation: Some("uppercase".to_string()),
                validation_rules: vec!["required".to_string()],
                default_value: Some("USD".to_string()),
                allowed_values: vec!["USD".to_string(), "EUR".to_string(), "GBP".to_string(), "JPY".to_string(), "CAD".to_string()],
                min_length: Some(3),
                max_length: Some(3),
                min_value: None,
                max_value: None,
            },
            DataStandardizationRule {
                field_name: "transaction_type".to_string(),
                rule_type: "validate".to_string(),
                pattern: None,
                transformation: Some("uppercase".to_string()),
                validation_rules: vec!["required".to_string()],
                default_value: None,
                allowed_values: vec![
                    "DEBIT".to_string(),
                    "CREDIT".to_string(),
                    "TRANSFER".to_string(),
                    "PAYMENT".to_string(),
                    "REFUND".to_string(),
                    "FEE".to_string(),
                ],
                min_length: None,
                max_length: None,
                min_value: None,
                max_value: None,
            },
        ],
        business_logic_validations: vec![
            "validate_account_balance".to_string(),
            "check_fraud_patterns".to_string(),
            "validate_transaction_limits".to_string(),
            "check_regulatory_compliance".to_string(),
        ],
        data_enrichment_sources: vec![
            "exchange_rate_service".to_string(),
            "merchant_category_codes".to_string(),
            "geolocation_service".to_string(),
        ],
    }
}

/// Generate comprehensive data quality report
#[napi]
pub fn generate_data_quality_report(validation_results: Vec<ValidationResult>) -> DataQualityReport {
    let total_records = validation_results.len() as i32;
    if total_records == 0 {
        return DataQualityReport {
            total_records: 0,
            valid_records: 0,
            invalid_records: 0,
            data_quality_score: 0.0,
            field_quality_scores: HashMap::new(),
            common_errors: vec![],
            suggestions: vec![],
        };
    }
    
    let valid_records = validation_results.iter().filter(|r| r.is_valid).count() as i32;
    let invalid_records = total_records - valid_records;
    let data_quality_score = (valid_records as f64 / total_records as f64) * 100.0;
    
    // Calculate field-level quality scores
    let mut field_quality_scores = HashMap::new();
    let mut field_counts: HashMap<String, (i32, i32)> = HashMap::new(); // (valid, total)
    
    for result in &validation_results {
        let entry = field_counts.entry(result.field_name.clone()).or_insert((0, 0));
        entry.1 += 1; // total
        if result.is_valid {
            entry.0 += 1; // valid
        }
    }
    
    for (field, (valid, total)) in field_counts {
        let score = (valid as f64 / total as f64) * 100.0;
        field_quality_scores.insert(field, score);
    }
    
    // Collect common errors
    let mut error_counts: HashMap<String, i32> = HashMap::new();
    for result in &validation_results {
        for error in &result.errors {
            *error_counts.entry(error.clone()).or_insert(0) += 1;
        }
    }
    
    let mut common_errors: Vec<(String, i32)> = error_counts.into_iter().collect();
    common_errors.sort_by(|a, b| b.1.cmp(&a.1));
    let common_errors: Vec<String> = common_errors.into_iter().take(5).map(|(error, _)| error).collect();
    
    // Generate suggestions
    let suggestions = generate_data_quality_suggestions(&validation_results, data_quality_score);
    
    DataQualityReport {
        total_records,
        valid_records,
        invalid_records,
        data_quality_score,
        field_quality_scores,
        common_errors,
        suggestions,
    }
}

/// Advanced data transformation function
#[napi]
pub fn apply_advanced_data_transformations(
    data: HashMap<String, String>,
    transformation_type: String,
) -> HashMap<String, String> {
    let mut transformed_data = data.clone();
    
    match transformation_type.as_str() {
        "business_address_standardization" => {
            if let Some(address) = transformed_data.get_mut("address") {
                *address = standardize_business_address(address);
            }
        },
        "financial_amount_normalization" => {
            for (key, value) in transformed_data.iter_mut() {
                if key.contains("amount") || key.contains("price") || key.contains("cost") {
                    *value = normalize_financial_amount(value);
                }
            }
        },
        "date_time_standardization" => {
            for (key, value) in transformed_data.iter_mut() {
                if key.contains("date") || key.contains("time") {
                    *value = standardize_datetime(value);
                }
            }
        },
        "contact_information_cleanup" => {
            if let Some(phone) = transformed_data.get_mut("phone") {
                *phone = normalize_phone_number(phone);
            }
            if let Some(email) = transformed_data.get_mut("email") {
                *email = normalize_email(email);
            }
        },
        _ => {}
    }
    
    transformed_data
}

// Helper functions for data transformations and validations

fn apply_transformation(value: &str, transformation: &str) -> String {
    match transformation {
        "uppercase" => value.to_uppercase(),
        "lowercase" => value.to_lowercase(),
        "title_case" => {
            value.split_whitespace()
                .map(|word| {
                    let mut chars = word.chars();
                    match chars.next() {
                        None => String::new(),
                        Some(first) => first.to_uppercase().collect::<String>() + &chars.as_str().to_lowercase(),
                    }
                })
                .collect::<Vec<String>>()
                .join(" ")
        },
        "normalize_phone" => normalize_phone_number(value),
        "format_currency" => format_currency_amount(value),
        _ => value.to_string(),
    }
}

fn validate_field(value: &str, validation_rule: &str, rule: &DataStandardizationRule) -> Option<String> {
    match validation_rule {
        "required" => {
            if value.trim().is_empty() {
                Some("Field is required".to_string())
            } else {
                None
            }
        },
        "email" => {
            let email_regex = Regex::new(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$").unwrap();
            if !email_regex.is_match(value) {
                Some("Invalid email format".to_string())
            } else {
                None
            }
        },
        "phone" => {
            let phone_regex = Regex::new(r"^\+?1?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$").unwrap();
            if !phone_regex.is_match(value) {
                Some("Invalid phone format".to_string())
            } else {
                None
            }
        },
        "numeric" => {
            if value.parse::<f64>().is_err() {
                Some("Must be a valid number".to_string())
            } else {
                None
            }
        },
        "alpha" => {
            if !value.chars().all(|c| c.is_alphabetic() || c.is_whitespace()) {
                Some("Must contain only letters".to_string())
            } else {
                None
            }
        },
        "positive" => {
            if let Ok(num) = value.parse::<f64>() {
                if num <= 0.0 {
                    Some("Must be a positive number".to_string())
                } else {
                    None
                }
            } else {
                Some("Must be a valid positive number".to_string())
            }
        },
        _ => None,
    }
}

fn validate_pattern(value: &str, pattern: &str) -> bool {
    match Regex::new(pattern) {
        Ok(regex) => regex.is_match(value),
        Err(_) => false,
    }
}

fn apply_business_validations(result: &mut ValidationResult, rule: &DataStandardizationRule) {
    // Check length constraints
    if let Some(min_length) = rule.min_length {
        if result.standardized_value.len() < min_length as usize {
            result.errors.push(format!("Value too short (minimum {} characters)", min_length));
            result.is_valid = false;
        }
    }
    
    if let Some(max_length) = rule.max_length {
        if result.standardized_value.len() > max_length as usize {
            result.errors.push(format!("Value too long (maximum {} characters)", max_length));
            result.is_valid = false;
        }
    }
    
    // Check value constraints
    if let (Some(min_value), Ok(num_value)) = (rule.min_value, result.standardized_value.parse::<f64>()) {
        if num_value < min_value {
            result.errors.push(format!("Value too low (minimum {})", min_value));
            result.is_valid = false;
        }
    }
    
    if let (Some(max_value), Ok(num_value)) = (rule.max_value, result.standardized_value.parse::<f64>()) {
        if num_value > max_value {
            result.errors.push(format!("Value too high (maximum {})", max_value));
            result.is_valid = false;
        }
    }
    
    // Check allowed values
    if !rule.allowed_values.is_empty() && !rule.allowed_values.contains(&result.standardized_value) {
        result.errors.push(format!("Invalid value. Allowed values: {:?}", rule.allowed_values));
        result.is_valid = false;
    }
}

fn standardize_business_address(address: &str) -> String {
    let mut standardized = address.to_uppercase();
    
    // Common abbreviations
    let replacements = [
        ("STREET", "ST"),
        ("AVENUE", "AVE"),
        ("BOULEVARD", "BLVD"),
        ("ROAD", "RD"),
        ("DRIVE", "DR"),
        ("COURT", "CT"),
        ("APARTMENT", "APT"),
        ("SUITE", "STE"),
        ("NORTH", "N"),
        ("SOUTH", "S"),
        ("EAST", "E"),
        ("WEST", "W"),
    ];
    
    for (full, abbrev) in replacements.iter() {
        standardized = standardized.replace(full, abbrev);
    }
    
    standardized
}

fn normalize_financial_amount(amount: &str) -> String {
    // Remove currency symbols and normalize to decimal format
    let cleaned = amount.replace(['$', '€', '£', '¥', ','], "");
    match cleaned.parse::<f64>() {
        Ok(num) => format!("{:.2}", num),
        Err(_) => amount.to_string(),
    }
}

fn standardize_datetime(datetime: &str) -> String {
    // Attempt to parse common date formats and return ISO format
    // This is a simplified implementation
    datetime.to_string()
}

fn normalize_phone_number(phone: &str) -> String {
    // Remove all non-digit characters
    let digits: String = phone.chars().filter(|c| c.is_ascii_digit()).collect();
    
    // Format as (XXX) XXX-XXXX if US number
    if digits.len() == 10 {
        format!("({}) {}-{}", &digits[0..3], &digits[3..6], &digits[6..10])
    } else if digits.len() == 11 && digits.starts_with('1') {
        format!("+1 ({}) {}-{}", &digits[1..4], &digits[4..7], &digits[7..11])
    } else {
        phone.to_string()
    }
}

fn normalize_email(email: &str) -> String {
    email.trim().to_lowercase()
}

fn format_currency_amount(amount: &str) -> String {
    match amount.parse::<f64>() {
        Ok(num) => format!("{:.2}", num),
        Err(_) => amount.to_string(),
    }
}

fn generate_data_quality_suggestions(results: &[ValidationResult], quality_score: f64) -> Vec<String> {
    let mut suggestions = Vec::new();
    
    if quality_score < 70.0 {
        suggestions.push("Data quality is below acceptable threshold. Consider implementing automated validation".to_string());
    }
    
    if quality_score < 90.0 {
        suggestions.push("Review data entry processes and provide better training".to_string());
    }
    
    let fields_with_errors: Vec<&str> = results.iter()
        .filter(|r| !r.errors.is_empty())
        .map(|r| r.field_name.as_str())
        .collect();
    
    if !fields_with_errors.is_empty() {
        suggestions.push(format!("Focus on improving data quality for fields: {:?}", fields_with_errors));
    }
    
    suggestions.push("Consider implementing real-time data validation".to_string());
    suggestions.push("Set up automated data quality monitoring".to_string());
    
    suggestions
}