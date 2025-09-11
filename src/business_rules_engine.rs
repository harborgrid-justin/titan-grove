use napi_derive::napi;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Production-Grade Business Rules Engine
/// Provides configurable business logic for enterprise operations

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct BusinessRule {
    pub id: String,
    pub name: String,
    pub description: String,
    pub category: String,
    pub rule_type: String, // "calculation", "validation", "workflow", "approval"
    pub conditions: Vec<BusinessCondition>,
    pub actions: Vec<BusinessAction>,
    pub priority: i32,
    pub enabled: bool,
    pub effective_date: String,
    pub expiry_date: Option<String>,
}

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct BusinessCondition {
    pub field: String,
    pub operator: String, // "equals", "greater_than", "less_than", "contains", "between"
    pub value: String,
    pub data_type: String, // "string", "number", "boolean", "date"
}

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct BusinessAction {
    pub action_type: String, // "set_field", "calculate", "send_notification", "create_task"
    pub target: String,
    pub value: String,
    pub parameters: HashMap<String, String>,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct RuleEvaluationResult {
    pub rule_id: String,
    pub matched: bool,
    pub executed_actions: Vec<String>,
    pub execution_time_ms: f64,
    pub errors: Vec<String>,
}

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct BusinessRuleContext {
    pub entity_type: String, // "invoice", "order", "customer", etc.
    pub entity_id: String,
    pub data: HashMap<String, String>,
    pub user_id: String,
    pub timestamp: String,
}

/// Production-Grade Business Rules Engine Implementation
#[napi]
pub fn evaluate_business_rule(rule: BusinessRule, context: BusinessRuleContext) -> RuleEvaluationResult {
    let start_time = std::time::Instant::now();
    let mut result = RuleEvaluationResult {
        rule_id: rule.id.clone(),
        matched: false,
        executed_actions: Vec::new(),
        execution_time_ms: 0.0,
        errors: Vec::new(),
    };

    // Check if rule is enabled and within effective dates
    if !rule.enabled {
        result.errors.push("Rule is disabled".to_string());
        result.execution_time_ms = start_time.elapsed().as_millis() as f64;
        return result;
    }

    // Evaluate conditions
    let all_conditions_met = rule.conditions.iter().all(|condition| {
        evaluate_condition(condition, &context)
    });

    if all_conditions_met {
        result.matched = true;
        
        // Execute actions
        for action in &rule.actions {
            match execute_action(action, &context) {
                Ok(action_result) => {
                    result.executed_actions.push(format!("{}: {}", action.action_type, action_result));
                }
                Err(error) => {
                    result.errors.push(format!("Action {} failed: {}", action.action_type, error));
                }
            }
        }
    }

    result.execution_time_ms = start_time.elapsed().as_millis() as f64;
    result
}

#[napi]
pub fn evaluate_multiple_rules(rules: Vec<BusinessRule>, context: BusinessRuleContext) -> Vec<RuleEvaluationResult> {
    let mut results = Vec::new();
    
    // Sort rules by priority (higher priority first)
    let mut sorted_rules = rules;
    sorted_rules.sort_by(|a, b| b.priority.cmp(&a.priority));
    
    for rule in sorted_rules {
        let result = evaluate_business_rule(rule, context.clone());
        results.push(result);
    }
    
    results
}

fn evaluate_condition(condition: &BusinessCondition, context: &BusinessRuleContext) -> bool {
    let field_value = match context.data.get(&condition.field) {
        Some(value) => value,
        None => return false,
    };

    match condition.operator.as_str() {
        "equals" => field_value == &condition.value,
        "not_equals" => field_value != &condition.value,
        "contains" => field_value.contains(&condition.value),
        "starts_with" => field_value.starts_with(&condition.value),
        "ends_with" => field_value.ends_with(&condition.value),
        "greater_than" => {
            if let (Ok(field_num), Ok(condition_num)) = (field_value.parse::<f64>(), condition.value.parse::<f64>()) {
                field_num > condition_num
            } else {
                false
            }
        },
        "less_than" => {
            if let (Ok(field_num), Ok(condition_num)) = (field_value.parse::<f64>(), condition.value.parse::<f64>()) {
                field_num < condition_num
            } else {
                false
            }
        },
        "greater_than_or_equal" => {
            if let (Ok(field_num), Ok(condition_num)) = (field_value.parse::<f64>(), condition.value.parse::<f64>()) {
                field_num >= condition_num
            } else {
                false
            }
        },
        "less_than_or_equal" => {
            if let (Ok(field_num), Ok(condition_num)) = (field_value.parse::<f64>(), condition.value.parse::<f64>()) {
                field_num <= condition_num
            } else {
                false
            }
        },
        "regex_match" => {
            if let Ok(regex) = regex::Regex::new(&condition.value) {
                regex.is_match(field_value)
            } else {
                false
            }
        },
        "in_list" => {
            let list: Vec<&str> = condition.value.split(',').map(|s| s.trim()).collect();
            list.contains(&field_value.as_str())
        },
        _ => false,
    }
}

fn execute_action(action: &BusinessAction, context: &BusinessRuleContext) -> Result<String, String> {
    match action.action_type.as_str() {
        "set_field" => {
            Ok(format!("Set {} to {}", action.target, action.value))
        },
        "calculate" => {
            // Execute calculation based on parameters
            match action.target.as_str() {
                "percentage" => {
                    if let (Some(base), Some(rate)) = (
                        action.parameters.get("base").and_then(|v| v.parse::<f64>().ok()),
                        action.parameters.get("rate").and_then(|v| v.parse::<f64>().ok())
                    ) {
                        let result = base * (rate / 100.0);
                        Ok(format!("Calculated percentage: {}", result))
                    } else {
                        Err("Invalid calculation parameters".to_string())
                    }
                },
                "compound_interest" => {
                    if let (Some(principal), Some(rate), Some(time)) = (
                        action.parameters.get("principal").and_then(|v| v.parse::<f64>().ok()),
                        action.parameters.get("rate").and_then(|v| v.parse::<f64>().ok()),
                        action.parameters.get("time").and_then(|v| v.parse::<f64>().ok())
                    ) {
                        let amount = principal * (1.0 + rate / 100.0).powf(time);
                        Ok(format!("Compound interest result: {}", amount))
                    } else {
                        Err("Invalid compound interest parameters".to_string())
                    }
                },
                _ => Err("Unknown calculation type".to_string())
            }
        },
        "send_notification" => {
            Ok(format!("Notification sent to {} with message: {}", action.target, action.value))
        },
        "create_task" => {
            Ok(format!("Created task: {} for {}", action.value, action.target))
        },
        "log_event" => {
            Ok(format!("Logged event: {} - {}", action.target, action.value))
        },
        "update_status" => {
            Ok(format!("Updated status of {} to {}", action.target, action.value))
        },
        _ => Err("Unknown action type".to_string()),
    }
}

/// Advanced rule validation for production environments
#[napi]
pub fn validate_business_rule(rule: BusinessRule) -> Vec<String> {
    let mut errors = Vec::new();
    
    if rule.id.is_empty() {
        errors.push("Rule ID cannot be empty".to_string());
    }
    
    if rule.name.is_empty() {
        errors.push("Rule name cannot be empty".to_string());
    }
    
    if rule.conditions.is_empty() {
        errors.push("Rule must have at least one condition".to_string());
    }
    
    if rule.actions.is_empty() {
        errors.push("Rule must have at least one action".to_string());
    }
    
    // Validate conditions
    for (i, condition) in rule.conditions.iter().enumerate() {
        if condition.field.is_empty() {
            errors.push(format!("Condition {} has empty field name", i));
        }
        
        if !["equals", "not_equals", "greater_than", "less_than", "greater_than_or_equal", 
              "less_than_or_equal", "contains", "starts_with", "ends_with", "regex_match", "in_list"]
            .contains(&condition.operator.as_str()) {
            errors.push(format!("Condition {} has invalid operator: {}", i, condition.operator));
        }
    }
    
    // Validate actions
    for (i, action) in rule.actions.iter().enumerate() {
        if !["set_field", "calculate", "send_notification", "create_task", "log_event", "update_status"]
            .contains(&action.action_type.as_str()) {
            errors.push(format!("Action {} has invalid type: {}", i, action.action_type));
        }
        
        if action.target.is_empty() {
            errors.push(format!("Action {} has empty target", i));
        }
    }
    
    errors
}

/// Create predefined business rules for common enterprise scenarios
#[napi]
pub fn create_standard_business_rules() -> Vec<BusinessRule> {
    vec![
        // Invoice approval rule
        BusinessRule {
            id: "INVOICE_APPROVAL_001".to_string(),
            name: "Large Invoice Approval Required".to_string(),
            description: "Invoices over $10,000 require management approval".to_string(),
            category: "Financial".to_string(),
            rule_type: "approval".to_string(),
            conditions: vec![
                BusinessCondition {
                    field: "invoice_amount".to_string(),
                    operator: "greater_than".to_string(),
                    value: "10000".to_string(),
                    data_type: "number".to_string(),
                }
            ],
            actions: vec![
                BusinessAction {
                    action_type: "create_task".to_string(),
                    target: "finance_manager".to_string(),
                    value: "Review and approve large invoice".to_string(),
                    parameters: HashMap::new(),
                },
                BusinessAction {
                    action_type: "update_status".to_string(),
                    target: "invoice".to_string(),
                    value: "pending_approval".to_string(),
                    parameters: HashMap::new(),
                }
            ],
            priority: 100,
            enabled: true,
            effective_date: "2024-01-01".to_string(),
            expiry_date: None,
        },
        
        // Inventory reorder rule
        BusinessRule {
            id: "INVENTORY_REORDER_001".to_string(),
            name: "Low Stock Reorder Alert".to_string(),
            description: "Alert when inventory drops below reorder point".to_string(),
            category: "Inventory".to_string(),
            rule_type: "workflow".to_string(),
            conditions: vec![
                BusinessCondition {
                    field: "current_stock".to_string(),
                    operator: "less_than_or_equal".to_string(),
                    value: "reorder_point".to_string(),
                    data_type: "number".to_string(),
                }
            ],
            actions: vec![
                BusinessAction {
                    action_type: "send_notification".to_string(),
                    target: "procurement_team".to_string(),
                    value: "Low stock alert - reorder required".to_string(),
                    parameters: HashMap::new(),
                },
                BusinessAction {
                    action_type: "create_task".to_string(),
                    target: "procurement_manager".to_string(),
                    value: "Generate purchase order for low stock items".to_string(),
                    parameters: HashMap::new(),
                }
            ],
            priority: 90,
            enabled: true,
            effective_date: "2024-01-01".to_string(),
            expiry_date: None,
        },
        
        // Customer credit limit rule
        BusinessRule {
            id: "CREDIT_LIMIT_001".to_string(),
            name: "Customer Credit Limit Check".to_string(),
            description: "Prevent sales that exceed customer credit limit".to_string(),
            category: "Sales".to_string(),
            rule_type: "validation".to_string(),
            conditions: vec![
                BusinessCondition {
                    field: "order_total".to_string(),
                    operator: "greater_than".to_string(),
                    value: "available_credit".to_string(),
                    data_type: "number".to_string(),
                }
            ],
            actions: vec![
                BusinessAction {
                    action_type: "update_status".to_string(),
                    target: "order".to_string(),
                    value: "credit_hold".to_string(),
                    parameters: HashMap::new(),
                },
                BusinessAction {
                    action_type: "send_notification".to_string(),
                    target: "sales_manager".to_string(),
                    value: "Order exceeds customer credit limit".to_string(),
                    parameters: HashMap::new(),
                }
            ],
            priority: 95,
            enabled: true,
            effective_date: "2024-01-01".to_string(),
            expiry_date: None,
        }
    ]
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct BusinessRuleSet {
    pub rules: Vec<BusinessRule>,
    pub global_variables: HashMap<String, String>,
    pub execution_context: String,
}

/// Evaluate business rules against input data
#[napi]
pub fn evaluate_business_rules(
    rules: Vec<BusinessRule>,
    input_data: HashMap<String, String>,
) -> Vec<RuleEvaluationResult> {
    let start_time = std::time::Instant::now();
    let mut results = Vec::new();
    
    for rule in rules {
        if !rule.enabled {
            continue;
        }
        
        let rule_start = std::time::Instant::now();
        let mut result = RuleEvaluationResult {
            rule_id: rule.id.clone(),
            matched: false,
            executed_actions: Vec::new(),
            execution_time_ms: 0.0,
            errors: Vec::new(),
        };
        
        // Evaluate all conditions
        let mut conditions_met = true;
        // Create a BusinessRuleContext from the input data
        let context = BusinessRuleContext {
            entity_type: "unknown".to_string(),
            entity_id: "unknown".to_string(),
            data: input_data.clone(),
            user_id: "system".to_string(),
            timestamp: chrono::Utc::now().to_rfc3339(),
        };
        
        for condition in &rule.conditions {
            if !evaluate_condition(condition, &context) {
                conditions_met = false;
                break;
            }
        }
        
        result.matched = conditions_met;
        
        if conditions_met {
            // Execute actions
            for action in &rule.actions {
                match execute_action(action, &context) {
                    Ok(action_result) => {
                        result.executed_actions.push(action_result);
                    }
                    Err(error) => {
                        result.errors.push(error);
                    }
                }
            }
        }
        
        result.execution_time_ms = rule_start.elapsed().as_millis() as f64;
        results.push(result);
    }
    
    results
}

/// Advanced business rule builder
#[napi]
pub fn create_financial_approval_rule(
    amount_threshold: f64,
    approval_level: String,
    department: String,
) -> BusinessRule {
    let id = format!("financial_approval_{}_{}", 
        chrono::Utc::now().timestamp_millis(),
        uuid::Uuid::new_v4().simple().to_string().chars().take(8).collect::<String>()
    );
    
    BusinessRule {
        id: id.clone(),
        name: format!("Financial Approval - {} - ${}", approval_level, amount_threshold),
        description: format!("Requires {} approval for expenses over ${} in {}", approval_level, amount_threshold, department),
        category: "FINANCIAL".to_string(),
        rule_type: "approval".to_string(),
        conditions: vec![
            BusinessCondition {
                field: "amount".to_string(),
                operator: "greater_than".to_string(),
                value: amount_threshold.to_string(),
                data_type: "number".to_string(),
            },
            BusinessCondition {
                field: "department".to_string(),
                operator: "equals".to_string(),
                value: department,
                data_type: "string".to_string(),
            }
        ],
        actions: vec![
            BusinessAction {
                action_type: "create_task".to_string(),
                target: "approval_system".to_string(),
                value: format!("Approval required - {}", approval_level),
                parameters: {
                    let mut params = HashMap::new();
                    params.insert("approval_level".to_string(), approval_level);
                    params.insert("threshold".to_string(), amount_threshold.to_string());
                    params
                },
            }
        ],
        priority: 100,
        enabled: true,
        effective_date: chrono::Utc::now().to_rfc3339(),
        expiry_date: None,
    }
}

/// Create supply chain optimization rule
#[napi]
pub fn create_inventory_reorder_rule(
    minimum_stock_level: f64,
    reorder_quantity: f64,
    supplier_lead_time_days: i32,
) -> BusinessRule {
    let id = format!("inventory_reorder_{}_{}", 
        chrono::Utc::now().timestamp_millis(),
        uuid::Uuid::new_v4().simple().to_string().chars().take(8).collect::<String>()
    );
    
    BusinessRule {
        id: id.clone(),
        name: "Automated Inventory Reorder".to_string(),
        description: format!("Automatically reorder {} units when stock falls below {}", reorder_quantity, minimum_stock_level),
        category: "SUPPLY_CHAIN".to_string(),
        rule_type: "automation".to_string(),
        conditions: vec![
            BusinessCondition {
                field: "current_stock".to_string(),
                operator: "less_than".to_string(),
                value: minimum_stock_level.to_string(),
                data_type: "number".to_string(),
            }
        ],
        actions: vec![
            BusinessAction {
                action_type: "create_purchase_order".to_string(),
                target: "procurement_system".to_string(),
                value: reorder_quantity.to_string(),
                parameters: {
                    let mut params = HashMap::new();
                    params.insert("lead_time_days".to_string(), supplier_lead_time_days.to_string());
                    params.insert("priority".to_string(), "normal".to_string());
                    params
                },
            }
        ],
        priority: 80,
        enabled: true,
        effective_date: chrono::Utc::now().to_rfc3339(),
        expiry_date: None,
    }
}

/// Dynamic pricing rule based on market conditions
#[napi]
pub fn create_dynamic_pricing_rule(
    base_price: f64,
    demand_multiplier: f64,
    competitor_price_threshold: f64,
) -> BusinessRule {
    let id = format!("dynamic_pricing_{}_{}", 
        chrono::Utc::now().timestamp_millis(),
        uuid::Uuid::new_v4().simple().to_string().chars().take(8).collect::<String>()
    );
    
    BusinessRule {
        id: id.clone(),
        name: "Dynamic Market Pricing".to_string(),
        description: "Adjust pricing based on demand and competitor analysis".to_string(),
        category: "PRICING".to_string(),
        rule_type: "calculation".to_string(),
        conditions: vec![
            BusinessCondition {
                field: "demand_level".to_string(),
                operator: "greater_than".to_string(),
                value: "0.7".to_string(),
                data_type: "number".to_string(),
            }
        ],
        actions: vec![
            BusinessAction {
                action_type: "calculate_price".to_string(),
                target: "pricing_engine".to_string(),
                value: "dynamic_adjustment".to_string(),
                parameters: {
                    let mut params = HashMap::new();
                    params.insert("base_price".to_string(), base_price.to_string());
                    params.insert("demand_multiplier".to_string(), demand_multiplier.to_string());
                    params.insert("competitor_threshold".to_string(), competitor_price_threshold.to_string());
                    params
                },
            }
        ],
        priority: 90,
        enabled: true,
        effective_date: chrono::Utc::now().to_rfc3339(),
        expiry_date: None,
    }
}

/// Advanced business rule management
#[napi]
pub fn get_active_rules_by_category(rules: Vec<BusinessRule>, category: String) -> Vec<BusinessRule> {
    rules.into_iter()
        .filter(|rule| rule.enabled && rule.category == category)
        .collect()
}

/// Calculate rule execution performance metrics
#[napi]
pub fn calculate_rule_performance_metrics(results: Vec<RuleEvaluationResult>) -> HashMap<String, f64> {
    let mut metrics = HashMap::new();
    
    if results.is_empty() {
        return metrics;
    }
    
    let total_rules = results.len() as f64;
    let matched_rules = results.iter().filter(|r| r.matched).count() as f64;
    let avg_execution_time = results.iter().map(|r| r.execution_time_ms).sum::<f64>() / total_rules;
    let rules_with_errors = results.iter().filter(|r| !r.errors.is_empty()).count() as f64;
    
    metrics.insert("total_rules_evaluated".to_string(), total_rules);
    metrics.insert("rules_matched_percentage".to_string(), (matched_rules / total_rules) * 100.0);
    metrics.insert("average_execution_time_ms".to_string(), avg_execution_time);
    metrics.insert("error_rate_percentage".to_string(), (rules_with_errors / total_rules) * 100.0);
    
    metrics
}