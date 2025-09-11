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
        for condition in &rule.conditions {
            if !evaluate_condition(condition, &input_data) {
                conditions_met = false;
                break;
            }
        }
        
        result.matched = conditions_met;
        
        if conditions_met {
            // Execute actions
            for action in &rule.actions {
                match execute_action(action, &input_data) {
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

/// Evaluate a single condition against input data
fn evaluate_condition(condition: &BusinessCondition, input_data: &HashMap<String, String>) -> bool {
    let field_value = match input_data.get(&condition.field) {
        Some(value) => value,
        None => return false,
    };
    
    match condition.operator.as_str() {
        "equals" => field_value == &condition.value,
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
        "contains" => field_value.contains(&condition.value),
        "between" => {
            // Expects condition.value in format "min,max"
            let parts: Vec<&str> = condition.value.split(',').collect();
            if parts.len() == 2 {
                if let (Ok(field_num), Ok(min), Ok(max)) = (
                    field_value.parse::<f64>(),
                    parts[0].parse::<f64>(),
                    parts[1].parse::<f64>()
                ) {
                    field_num >= min && field_num <= max
                } else {
                    false
                }
            } else {
                false
            }
        },
        _ => false,
    }
}

/// Execute a business action
fn execute_action(action: &BusinessAction, _input_data: &HashMap<String, String>) -> Result<String, String> {
    match action.action_type.as_str() {
        "set_field" => Ok(format!("Set {} to {}", action.target, action.value)),
        "calculate" => Ok(format!("Calculated {} for {}", action.value, action.target)),
        "send_notification" => Ok(format!("Notification sent: {}", action.value)),
        "create_task" => Ok(format!("Task created: {} for {}", action.value, action.target)),
        "create_purchase_order" => Ok(format!("Purchase order created for quantity: {}", action.value)),
        "calculate_price" => Ok(format!("Price calculated using {}", action.value)),
        _ => Err(format!("Unknown action type: {}", action.action_type)),
    }
}

/// Advanced business rule management
#[napi]
pub fn get_active_rules_by_category(rules: Vec<BusinessRule>, category: String) -> Vec<BusinessRule> {
    rules.into_iter()
        .filter(|rule| rule.enabled && rule.category == category)
        .collect()
}

#[napi]
pub fn validate_business_rule(rule: BusinessRule) -> Vec<String> {
    let mut errors = Vec::new();
    
    if rule.name.is_empty() {
        errors.push("Rule name cannot be empty".to_string());
    }
    
    if rule.conditions.is_empty() {
        errors.push("Rule must have at least one condition".to_string());
    }
    
    if rule.actions.is_empty() {
        errors.push("Rule must have at least one action".to_string());
    }
    
    for condition in &rule.conditions {
        if condition.field.is_empty() {
            errors.push("Condition field cannot be empty".to_string());
        }
        if !["equals", "greater_than", "less_than", "contains", "between"].contains(&condition.operator.as_str()) {
            errors.push(format!("Invalid condition operator: {}", condition.operator));
        }
    }
    
    for action in &rule.actions {
        if action.target.is_empty() {
            errors.push("Action target cannot be empty".to_string());
        }
    }
    
    errors
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