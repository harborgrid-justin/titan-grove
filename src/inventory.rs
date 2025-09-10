use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct InventoryItem {
    pub item_id: String,
    pub item_code: String,
    pub description: String,
    pub category: String,
    pub unit_cost: f64,
    pub current_stock: i32,
    pub reserved_stock: i32,
    pub available_stock: i32,
    pub reorder_point: i32,
    pub max_stock_level: i32,
    pub abc_classification: String,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct EOQCalculation {
    pub item_id: String,
    pub economic_order_quantity: i32,
    pub total_annual_cost: f64,
    pub ordering_cost_component: f64,
    pub holding_cost_component: f64,
    pub order_frequency: f64,
    pub optimal_cycle_time_days: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct SafetyStockCalculation {
    pub item_id: String,
    pub safety_stock: i32,
    pub service_level: f64,
    pub demand_variability: f64,
    pub lead_time_variability: f64,
    pub reorder_point: i32,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct ABCAnalysis {
    pub item_id: String,
    pub annual_usage_value: f64,
    pub percentage_of_total_value: f64,
    pub cumulative_percentage: f64,
    pub abc_class: String,
    pub management_priority: String,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct InventoryMetrics {
    pub total_items: i32,
    pub total_value: f64,
    pub inventory_turnover: f64,
    pub days_sales_outstanding: f64,
    pub stockout_risk_items: i32,
    pub excess_stock_items: i32,
    pub abc_distribution: Vec<ABCClassDistribution>,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct ABCClassDistribution {
    pub class: String,
    pub item_count: i32,
    pub value_percentage: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct InventoryOptimization {
    pub item_id: String,
    pub current_cost: f64,
    pub optimized_cost: f64,
    pub potential_savings: f64,
    pub recommended_order_quantity: i32,
    pub recommended_safety_stock: i32,
    pub optimization_actions: Vec<String>,
}

#[napi]
pub fn calculate_eoq(
    annual_demand: f64,
    ordering_cost: f64,
    holding_cost_rate: f64,
    unit_cost: f64,
) -> EOQCalculation {
    if annual_demand <= 0.0 || ordering_cost <= 0.0 || holding_cost_rate <= 0.0 || unit_cost <= 0.0 {
        return EOQCalculation {
            item_id: "unknown".to_string(),
            economic_order_quantity: 0,
            total_annual_cost: 0.0,
            ordering_cost_component: 0.0,
            holding_cost_component: 0.0,
            order_frequency: 0.0,
            optimal_cycle_time_days: 0.0,
        };
    }

    let holding_cost_per_unit = unit_cost * holding_cost_rate;
    
    // EOQ Formula: sqrt(2 * D * S / H)
    let eoq = ((2.0 * annual_demand * ordering_cost) / holding_cost_per_unit).sqrt();
    let economic_order_quantity = eoq.round() as i32;
    
    // Calculate cost components
    let order_frequency = annual_demand / eoq;
    let ordering_cost_component = order_frequency * ordering_cost;
    let holding_cost_component = (eoq / 2.0) * holding_cost_per_unit;
    let total_annual_cost = ordering_cost_component + holding_cost_component;
    
    // Optimal cycle time in days
    let optimal_cycle_time_days = (eoq / annual_demand) * 365.0;
    
    EOQCalculation {
        item_id: "unknown".to_string(),
        economic_order_quantity,
        total_annual_cost,
        ordering_cost_component,
        holding_cost_component,
        order_frequency,
        optimal_cycle_time_days,
    }
}

#[napi]
pub fn calculate_safety_stock(
    lead_time_days: f64,
    daily_demand_mean: f64,
    daily_demand_std_dev: f64,
    lead_time_std_dev: f64,
    service_level: f64,
) -> SafetyStockCalculation {
    // Z-score for service level (approximation)
    let z_score = match service_level {
        sl if sl >= 0.999 => 3.09,
        sl if sl >= 0.99 => 2.33,
        sl if sl >= 0.975 => 1.96,
        sl if sl >= 0.95 => 1.645,
        sl if sl >= 0.90 => 1.28,
        _ => 1.645, // Default to 95%
    };
    
    // Safety stock calculation considering both demand and lead time variability
    let demand_variance = daily_demand_std_dev.powi(2);
    let lead_time_variance = lead_time_std_dev.powi(2);
    
    let safety_stock_variance = 
        (lead_time_days * demand_variance) + 
        (daily_demand_mean.powi(2) * lead_time_variance);
    
    let safety_stock = z_score * safety_stock_variance.sqrt();
    let safety_stock_units = safety_stock.round().max(0.0) as i32;
    
    // Reorder point = average demand during lead time + safety stock
    let average_lead_time_demand = daily_demand_mean * lead_time_days;
    let reorder_point = (average_lead_time_demand + safety_stock).round() as i32;
    
    // Calculate variability metrics
    let demand_variability = daily_demand_std_dev / daily_demand_mean;
    let lead_time_variability = lead_time_std_dev / lead_time_days;
    
    SafetyStockCalculation {
        item_id: "unknown".to_string(),
        safety_stock: safety_stock_units,
        service_level,
        demand_variability,
        lead_time_variability,
        reorder_point,
    }
}

#[napi]
pub fn perform_abc_analysis(items: Vec<InventoryItem>, annual_demands: Vec<f64>) -> Vec<ABCAnalysis> {
    if items.len() != annual_demands.len() {
        return Vec::new();
    }

    // Calculate annual usage value for each item
    let mut item_values: Vec<(usize, f64)> = items
        .iter()
        .enumerate()
        .map(|(i, item)| {
            let annual_demand = annual_demands.get(i).unwrap_or(&0.0);
            let annual_value = annual_demand * item.unit_cost;
            (i, annual_value)
        })
        .collect();

    // Sort by value in descending order
    item_values.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());

    let total_value: f64 = item_values.iter().map(|(_, value)| value).sum();
    let mut cumulative_value = 0.0;
    let mut results = Vec::new();

    for (original_index, annual_value) in item_values {
        let percentage_of_total = if total_value > 0.0 {
            (annual_value / total_value) * 100.0
        } else {
            0.0
        };

        cumulative_value += annual_value;
        let cumulative_percentage = if total_value > 0.0 {
            (cumulative_value / total_value) * 100.0
        } else {
            0.0
        };

        // Classify items based on cumulative percentage
        let (abc_class, management_priority) = match cumulative_percentage {
            cp if cp <= 80.0 => ("A".to_string(), "High - Tight control and frequent review".to_string()),
            cp if cp <= 95.0 => ("B".to_string(), "Medium - Normal control and periodic review".to_string()),
            _ => ("C".to_string(), "Low - Simple control and annual review".to_string()),
        };

        if let Some(item) = items.get(original_index) {
            results.push(ABCAnalysis {
                item_id: item.item_id.clone(),
                annual_usage_value: annual_value,
                percentage_of_total_value: percentage_of_total,
                cumulative_percentage,
                abc_class,
                management_priority,
            });
        }
    }

    results
}

#[napi]
pub fn calculate_inventory_turnover(
    cost_of_goods_sold: f64,
    average_inventory_value: f64,
) -> f64 {
    if average_inventory_value > 0.0 {
        cost_of_goods_sold / average_inventory_value
    } else {
        0.0
    }
}

#[napi]
pub fn calculate_days_sales_outstanding(
    average_inventory_value: f64,
    daily_cost_of_goods_sold: f64,
) -> f64 {
    if daily_cost_of_goods_sold > 0.0 {
        average_inventory_value / daily_cost_of_goods_sold
    } else {
        0.0
    }
}

#[napi]
pub fn identify_stockout_risk_items(items: Vec<InventoryItem>, lead_time_days: i32) -> Vec<String> {
    let mut at_risk_items = Vec::new();
    
    for item in items {
        let available_stock = item.current_stock - item.reserved_stock;
        
        // Calculate if item will stock out before next delivery
        let daily_usage = if item.reorder_point > 0 {
            item.reorder_point as f64 / (lead_time_days as f64)
        } else {
            1.0 // Assume minimum daily usage
        };
        
        let days_of_stock = available_stock as f64 / daily_usage;
        
        // Flag items with less than lead time worth of stock
        if days_of_stock < lead_time_days as f64 * 1.5 {
            at_risk_items.push(item.item_id);
        }
    }
    
    at_risk_items
}

#[napi]
pub fn identify_excess_stock_items(items: Vec<InventoryItem>, months_threshold: i32) -> Vec<String> {
    let mut excess_items = Vec::new();
    
    for item in items {
        let available_stock = item.current_stock - item.reserved_stock;
        
        // Simple heuristic: if stock > max_level * threshold_multiplier
        let threshold_multiplier = months_threshold as f64 / 12.0; // Convert months to year fraction
        let excess_threshold = (item.max_stock_level as f64 * threshold_multiplier) as i32;
        
        if available_stock > excess_threshold && excess_threshold > 0 {
            excess_items.push(item.item_id);
        }
    }
    
    excess_items
}

#[napi]
pub fn generate_inventory_metrics(
    items: Vec<InventoryItem>,
    annual_demands: Vec<f64>,
    cost_of_goods_sold: f64,
) -> InventoryMetrics {
    let total_items = items.len() as i32;
    
    // Calculate total inventory value
    let total_value: f64 = items.iter().map(|item| {
        (item.current_stock as f64) * item.unit_cost
    }).sum();
    
    // Calculate inventory turnover
    let inventory_turnover = calculate_inventory_turnover(cost_of_goods_sold, total_value);
    
    // Calculate days sales outstanding
    let daily_cogs = cost_of_goods_sold / 365.0;
    let days_sales_outstanding = calculate_days_sales_outstanding(total_value, daily_cogs);
    
    // Identify at-risk items
    let stockout_risk_items = identify_stockout_risk_items(items.clone(), 30).len() as i32;
    let excess_stock_items = identify_excess_stock_items(items.clone(), 6).len() as i32;
    
    // Generate ABC distribution
    let abc_analysis = perform_abc_analysis(items, annual_demands);
    let mut abc_distribution = std::collections::HashMap::new();
    let mut abc_values = std::collections::HashMap::new();
    
    for analysis in abc_analysis {
        *abc_distribution.entry(analysis.abc_class.clone()).or_insert(0) += 1;
        *abc_values.entry(analysis.abc_class).or_insert(0.0) += analysis.percentage_of_total_value;
    }
    
    let abc_distribution: Vec<ABCClassDistribution> = abc_distribution
        .into_iter()
        .map(|(class, count)| ABCClassDistribution {
            value_percentage: *abc_values.get(&class).unwrap_or(&0.0),
            class,
            item_count: count,
        })
        .collect();
    
    InventoryMetrics {
        total_items,
        total_value,
        inventory_turnover,
        days_sales_outstanding,
        stockout_risk_items,
        excess_stock_items,
        abc_distribution,
    }
}

#[napi]
pub fn optimize_inventory_item(
    item: InventoryItem,
    annual_demand: f64,
    ordering_cost: f64,
    holding_cost_rate: f64,
    lead_time_days: f64,
    service_level: f64,
) -> InventoryOptimization {
    // Calculate current costs
    let current_holding_cost = (item.current_stock as f64 / 2.0) * item.unit_cost * holding_cost_rate;
    let current_ordering_cost = if annual_demand > 0.0 {
        (annual_demand / item.current_stock as f64) * ordering_cost
    } else {
        ordering_cost
    };
    let current_cost = current_holding_cost + current_ordering_cost;
    
    // Calculate optimal EOQ
    let eoq_calc = calculate_eoq(annual_demand, ordering_cost, holding_cost_rate, item.unit_cost);
    
    // Calculate optimal safety stock
    let daily_demand = annual_demand / 365.0;
    let safety_calc = calculate_safety_stock(
        lead_time_days,
        daily_demand,
        daily_demand * 0.2, // Assume 20% demand variability
        lead_time_days * 0.1, // Assume 10% lead time variability
        service_level,
    );
    
    let optimized_cost = eoq_calc.total_annual_cost;
    let potential_savings = current_cost - optimized_cost;
    
    // Generate optimization actions
    let mut actions = Vec::new();
    
    if eoq_calc.economic_order_quantity != item.current_stock {
        actions.push(format!(
            "Adjust order quantity from {} to {}",
            item.current_stock,
            eoq_calc.economic_order_quantity
        ));
    }
    
    if safety_calc.safety_stock != item.reorder_point {
        actions.push(format!(
            "Update reorder point from {} to {}",
            item.reorder_point,
            safety_calc.reorder_point
        ));
    }
    
    if potential_savings > current_cost * 0.1 {
        actions.push("Significant cost savings opportunity identified".to_string());
    }
    
    if actions.is_empty() {
        actions.push("Current inventory parameters are near optimal".to_string());
    }
    
    InventoryOptimization {
        item_id: item.item_id,
        current_cost,
        optimized_cost,
        potential_savings,
        recommended_order_quantity: eoq_calc.economic_order_quantity,
        recommended_safety_stock: safety_calc.safety_stock,
        optimization_actions: actions,
    }
}