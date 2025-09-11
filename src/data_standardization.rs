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

/// Production-Grade Data Standardization Functions
#[napi]
pub fn standardize_data_record(data: HashMap<String, String>, rules: Vec<DataStandardizationRule>) -> Vec<ValidationResult> {
    let mut results = Vec::new();
    
    for rule in &rules {
        if let Some(value) = data.get(&rule.field_name) {
            let result = apply_standardization_rule(value, rule);
            results.push(result);
        } else {
            // Handle missing fields
            results.push(ValidationResult {
                field_name: rule.field_name.clone(),
                is_valid: rule.validation_rules.contains(&"required".to_string()) == false,
                original_value: "".to_string(),
                standardized_value: rule.default_value.clone().unwrap_or_default(),
                errors: if rule.validation_rules.contains(&"required".to_string()) {
                    vec!["Field is required but missing".to_string()]
                } else {
                    Vec::new()
                },
                warnings: vec!["Field not provided, using default value".to_string()],
                transformations_applied: if rule.default_value.is_some() {
                    vec!["default_value_applied".to_string()]
                } else {
                    Vec::new()
                },
            });
        }
    }
    
    results
}

#[napi]
pub fn validate_email(email: String) -> ValidationResult {
    let email_regex = Regex::new(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$").unwrap();
    let is_valid = email_regex.is_match(&email);
    
    ValidationResult {
        field_name: "email".to_string(),
        is_valid,
        original_value: email.clone(),
        standardized_value: email.to_lowercase(),
        errors: if !is_valid { vec!["Invalid email format".to_string()] } else { Vec::new() },
        warnings: Vec::new(),
        transformations_applied: vec!["lowercase".to_string()],
    }
}

#[napi]
pub fn validate_phone_number(phone: String) -> ValidationResult {
    let cleaned_phone = phone.chars()
        .filter(|c| c.is_ascii_digit())
        .collect::<String>();
    
    let is_valid = cleaned_phone.len() >= 10 && cleaned_phone.len() <= 15;
    
    let standardized = if cleaned_phone.len() == 10 {
        format!("({}) {}-{}", &cleaned_phone[0..3], &cleaned_phone[3..6], &cleaned_phone[6..10])
    } else if cleaned_phone.len() == 11 && cleaned_phone.starts_with('1') {
        format!("+1 ({}) {}-{}", &cleaned_phone[1..4], &cleaned_phone[4..7], &cleaned_phone[7..11])
    } else {
        cleaned_phone
    };
    
    ValidationResult {
        field_name: "phone".to_string(),
        is_valid,
        original_value: phone,
        standardized_value: standardized,
        errors: if !is_valid { vec!["Invalid phone number format".to_string()] } else { Vec::new() },
        warnings: Vec::new(),
        transformations_applied: vec!["format_standardization".to_string(), "digit_extraction".to_string()],
    }
}

#[napi]
pub fn standardize_address(address: String) -> ValidationResult {
    let mut standardized = address.trim().to_uppercase();
    let mut transformations = Vec::new();
    
    // Common address standardizations
    let replacements = [
        ("STREET", "ST"),
        ("AVENUE", "AVE"),
        ("BOULEVARD", "BLVD"),
        ("DRIVE", "DR"),
        ("ROAD", "RD"),
        ("LANE", "LN"),
        ("COURT", "CT"),
        ("PLACE", "PL"),
        ("APARTMENT", "APT"),
        ("SUITE", "STE"),
    ];
    
    for (full, abbrev) in &replacements {
        if standardized.contains(full) {
            standardized = standardized.replace(full, abbrev);
            transformations.push(format!("abbreviate_{}", full.to_lowercase()));
        }
    }
    
    ValidationResult {
        field_name: "address".to_string(),
        is_valid: !standardized.is_empty(),
        original_value: address,
        standardized_value: standardized,
        errors: Vec::new(),
        warnings: Vec::new(),
        transformations_applied: transformations,
    }
}

#[napi]
pub fn validate_currency_amount(amount_str: String) -> ValidationResult {
    // Remove currency symbols and formatting
    let cleaned = amount_str.chars()
        .filter(|c| c.is_ascii_digit() || *c == '.' || *c == '-')
        .collect::<String>();
    
    let is_valid = cleaned.parse::<f64>().is_ok();
    let standardized = if let Ok(amount) = cleaned.parse::<f64>() {
        format!("{:.2}", amount)
    } else {
        "0.00".to_string()
    };
    
    ValidationResult {
        field_name: "currency_amount".to_string(),
        is_valid,
        original_value: amount_str,
        standardized_value: standardized,
        errors: if !is_valid { vec!["Invalid currency amount".to_string()] } else { Vec::new() },
        warnings: Vec::new(),
        transformations_applied: vec!["currency_formatting".to_string(), "decimal_precision".to_string()],
    }
}

#[napi]
pub fn generate_data_quality_report(validation_results: Vec<ValidationResult>) -> DataQualityReport {
    let total_records = validation_results.len() as i32;
    let valid_records = validation_results.iter().filter(|r| r.is_valid).count() as i32;
    let invalid_records = total_records - valid_records;
    
    let data_quality_score = if total_records > 0 {
        (valid_records as f64 / total_records as f64) * 100.0
    } else {
        100.0
    };
    
    let mut field_quality_scores = HashMap::new();
    let mut field_counts = HashMap::new();
    let mut common_errors = Vec::new();
    
    for result in &validation_results {
        let field_name = &result.field_name;
        
        *field_counts.entry(field_name.clone()).or_insert(0) += 1;
        
        if result.is_valid {
            *field_quality_scores.entry(field_name.clone()).or_insert(0.0) += 1.0;
        }
        
        for error in &result.errors {
            if !common_errors.contains(error) && common_errors.len() < 10 {
                common_errors.push(error.clone());
            }
        }
    }
    
    // Convert field counts to percentages
    for (field_name, count) in field_counts {
        if let Some(valid_count) = field_quality_scores.get_mut(&field_name) {
            *valid_count = (*valid_count / count as f64) * 100.0;
        }
    }
    
    let suggestions = generate_data_quality_suggestions(&validation_results);
    
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

fn apply_standardization_rule(value: &str, rule: &DataStandardizationRule) -> ValidationResult {
    let mut result = ValidationResult {
        field_name: rule.field_name.clone(),
        is_valid: true,
        original_value: value.to_string(),
        standardized_value: value.to_string(),
        errors: Vec::new(),
        warnings: Vec::new(),
        transformations_applied: Vec::new(),
    };
    
    // Apply transformations
    if let Some(transformation) = &rule.transformation {
        match transformation.as_str() {
            "uppercase" => {
                result.standardized_value = result.standardized_value.to_uppercase();
                result.transformations_applied.push("uppercase".to_string());
            },
            "lowercase" => {
                result.standardized_value = result.standardized_value.to_lowercase();
                result.transformations_applied.push("lowercase".to_string());
            },
            "title_case" => {
                result.standardized_value = to_title_case(&result.standardized_value);
                result.transformations_applied.push("title_case".to_string());
            },
            "trim" => {
                result.standardized_value = result.standardized_value.trim().to_string();
                result.transformations_applied.push("trim".to_string());
            },
            _ => {}
        }
    }
    
    // Apply validations
    for validation in &rule.validation_rules {
        match validation.as_str() {
            "required" => {
                if result.standardized_value.is_empty() {
                    result.is_valid = false;
                    result.errors.push("Field is required".to_string());
                }
            },
            "email" => {
                let email_regex = Regex::new(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$").unwrap();
                if !email_regex.is_match(&result.standardized_value) {
                    result.is_valid = false;
                    result.errors.push("Invalid email format".to_string());
                }
            },
            "phone" => {
                let cleaned = result.standardized_value.chars()
                    .filter(|c| c.is_ascii_digit())
                    .collect::<String>();
                if cleaned.len() < 10 || cleaned.len() > 15 {
                    result.is_valid = false;
                    result.errors.push("Invalid phone number length".to_string());
                }
            },
            "numeric" => {
                if result.standardized_value.parse::<f64>().is_err() {
                    result.is_valid = false;
                    result.errors.push("Value must be numeric".to_string());
                }
            },
            _ => {}
        }
    }
    
    // Length validations
    if let Some(min_length) = rule.min_length {
        if result.standardized_value.len() < min_length as usize {
            result.is_valid = false;
            result.errors.push(format!("Minimum length is {}", min_length));
        }
    }
    
    if let Some(max_length) = rule.max_length {
        if result.standardized_value.len() > max_length as usize {
            result.is_valid = false;
            result.errors.push(format!("Maximum length is {}", max_length));
        }
    }
    
    // Value range validations
    if let (Some(min_value), Ok(parsed_value)) = (rule.min_value, result.standardized_value.parse::<f64>()) {
        if parsed_value < min_value {
            result.is_valid = false;
            result.errors.push(format!("Minimum value is {}", min_value));
        }
    }
    
    if let (Some(max_value), Ok(parsed_value)) = (rule.max_value, result.standardized_value.parse::<f64>()) {
        if parsed_value > max_value {
            result.is_valid = false;
            result.errors.push(format!("Maximum value is {}", max_value));
        }
    }
    
    // Allowed values validation
    if !rule.allowed_values.is_empty() && !rule.allowed_values.contains(&result.standardized_value) {
        result.is_valid = false;
        result.errors.push(format!("Value must be one of: {}", rule.allowed_values.join(", ")));
    }
    
    result
}

fn to_title_case(s: &str) -> String {
    s.split_whitespace()
        .map(|word| {
            let mut chars = word.chars();
            match chars.next() {
                None => String::new(),
                Some(first) => first.to_uppercase().collect::<String>() + &chars.as_str().to_lowercase(),
            }
        })
        .collect::<Vec<String>>()
        .join(" ")
}

fn generate_data_quality_suggestions(validation_results: &[ValidationResult]) -> Vec<String> {
    let mut suggestions = Vec::new();
    let mut error_counts = HashMap::new();
    
    // Count error types
    for result in validation_results {
        for error in &result.errors {
            *error_counts.entry(error.clone()).or_insert(0) += 1;
        }
    }
    
    // Generate suggestions based on common errors
    for (error, count) in error_counts {
        if count > validation_results.len() / 10 {  // More than 10% of records
            match error.as_str() {
                "Invalid email format" => {
                    suggestions.push("Consider implementing email validation at data entry point".to_string());
                },
                "Invalid phone number format" => {
                    suggestions.push("Standardize phone number input format across all systems".to_string());
                },
                "Field is required" => {
                    suggestions.push("Implement required field validation in user interfaces".to_string());
                },
                "Invalid currency amount" => {
                    suggestions.push("Use standard currency input controls to prevent formatting issues".to_string());
                },
                _ => {}
            }
        }
    }
    
    suggestions
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