use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct Customer {
    pub customer_id: String,
    pub name: String,
    pub email: String,
    pub phone: String,
    pub company: String,
    pub total_purchases: f64,
    pub last_purchase_date: String,
    pub customer_tier: String,
}

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct Lead {
    pub lead_id: String,
    pub name: String,
    pub email: String,
    pub source: String,
    pub score: f64,
    pub status: String,
    pub created_date: String,
    pub estimated_value: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct CustomerScore {
    pub customer_id: String,
    pub purchase_frequency_score: f64,
    pub purchase_value_score: f64,
    pub loyalty_score: f64,
    pub engagement_score: f64,
    pub overall_score: f64,
    pub customer_segment: String,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct SalesOpportunity {
    pub opportunity_id: String,
    pub customer_id: String,
    pub estimated_value: f64,
    pub probability: f64,
    pub expected_value: f64,
    pub stage: String,
    pub close_date: String,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct CrmAnalytics {
    pub total_customers: i32,
    pub active_customers: i32,
    pub total_leads: i32,
    pub conversion_rate: f64,
    pub average_deal_size: f64,
    pub customer_lifetime_value: f64,
    pub churn_rate: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct SalesPerformance {
    pub sales_rep_id: String,
    pub deals_closed: i32,
    pub total_revenue: f64,
    pub conversion_rate: f64,
    pub average_deal_size: f64,
    pub performance_score: f64,
}

#[napi]
pub fn calculate_customer_lifetime_value(
    average_purchase_value: f64,
    purchase_frequency_per_year: f64,
    customer_lifespan_years: f64,
) -> f64 {
    average_purchase_value * purchase_frequency_per_year * customer_lifespan_years
}

#[napi]
pub fn calculate_lead_score(
    demographic_score: f64,
    behavioral_score: f64,
    engagement_score: f64,
    fit_score: f64,
) -> f64 {
    // Weighted lead scoring algorithm
    let demographic_weight = 0.25;
    let behavioral_weight = 0.30;
    let engagement_weight = 0.25;
    let fit_weight = 0.20;
    
    (demographic_score * demographic_weight) +
    (behavioral_score * behavioral_weight) +
    (engagement_score * engagement_weight) +
    (fit_score * fit_weight)
}

#[napi]
pub fn calculate_customer_score(
    days_since_last_purchase: i32,
    total_purchases: f64,
    purchase_frequency: i32,
    engagement_metrics: f64,
) -> CustomerScore {
    // Recency score (0-100, higher is better)
    let recency_score = match days_since_last_purchase {
        0..=30 => 100.0,
        31..=60 => 80.0,
        61..=90 => 60.0,
        91..=180 => 40.0,
        181..=365 => 20.0,
        _ => 10.0,
    };
    
    // Purchase value score (0-100)
    let purchase_value_score = (total_purchases / 1000.0).min(100.0);
    
    // Purchase frequency score (0-100)
    let purchase_frequency_score = ((purchase_frequency as f64 / 12.0) * 100.0).min(100.0);
    
    // Engagement score (already 0-100)
    let engagement_score = engagement_metrics.min(100.0);
    
    // Overall score calculation
    let overall_score = (recency_score * 0.3) +
                       (purchase_value_score * 0.3) +
                       (purchase_frequency_score * 0.25) +
                       (engagement_score * 0.15);
    
    let customer_segment = match overall_score {
        s if s >= 80.0 => "CHAMPION",
        s if s >= 60.0 => "LOYAL",
        s if s >= 40.0 => "POTENTIAL",
        s if s >= 20.0 => "AT_RISK",
        _ => "LOST",
    };
    
    CustomerScore {
        customer_id: "".to_string(), // To be set by caller
        purchase_frequency_score: purchase_frequency_score,
        purchase_value_score: purchase_value_score,
        loyalty_score: recency_score,
        engagement_score: engagement_score,
        overall_score,
        customer_segment: customer_segment.to_string(),
    }
}

#[napi]
pub fn calculate_churn_probability(
    days_since_last_purchase: i32,
    average_days_between_purchases: f64,
    purchase_trend: f64, // -1.0 to 1.0, negative is declining
    engagement_score: f64,
) -> f64 {
    // Base churn probability from recency
    let recency_factor = if average_days_between_purchases > 0.0 {
        (days_since_last_purchase as f64 / average_days_between_purchases).min(3.0)
    } else {
        1.0
    };
    
    // Trend factor (declining purchases increase churn risk)
    let trend_factor = if purchase_trend < 0.0 {
        1.0 + (-purchase_trend)
    } else {
        1.0 - (purchase_trend * 0.3)
    };
    
    // Engagement factor
    let engagement_factor = 1.0 - (engagement_score / 100.0);
    
    let churn_probability = (recency_factor * trend_factor * engagement_factor * 0.4).min(1.0);
    
    churn_probability
}

#[napi]
pub fn calculate_sales_conversion_rate(
    leads_converted: i32,
    total_leads: i32,
) -> f64 {
    if total_leads > 0 {
        (leads_converted as f64 / total_leads as f64) * 100.0
    } else {
        0.0
    }
}

#[napi]
pub fn calculate_opportunity_expected_value(
    estimated_value: f64,
    probability_percentage: f64,
) -> f64 {
    estimated_value * (probability_percentage / 100.0)
}

#[napi]
pub fn optimize_sales_territory(
    territories: Vec<String>,
    customer_values: Vec<f64>,
    sales_rep_capacities: Vec<f64>,
) -> Vec<String> {
    if territories.len() != customer_values.len() || territories.is_empty() {
        return Vec::new();
    }
    
    // Create territory-value pairs and sort by value (descending)
    let mut territory_value_pairs: Vec<_> = territories.into_iter()
        .zip(customer_values.into_iter())
        .collect();
    territory_value_pairs.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());
    
    // Simple round-robin assignment based on capacity
    let mut assignments = Vec::new();
    let mut capacity_index = 0;
    
    for (territory, _value) in territory_value_pairs {
        if capacity_index < sales_rep_capacities.len() {
            assignments.push(territory);
            capacity_index = (capacity_index + 1) % sales_rep_capacities.len();
        }
    }
    
    assignments
}

#[napi]
pub fn calculate_customer_acquisition_cost(
    total_marketing_spend: f64,
    total_sales_spend: f64,
    new_customers_acquired: i32,
) -> f64 {
    if new_customers_acquired > 0 {
        (total_marketing_spend + total_sales_spend) / new_customers_acquired as f64
    } else {
        0.0
    }
}

#[napi]
pub fn calculate_customer_retention_rate(
    customers_at_start: i32,
    customers_at_end: i32,
    new_customers: i32,
) -> f64 {
    if customers_at_start > 0 {
        let customers_retained = customers_at_end - new_customers;
        (customers_retained as f64 / customers_at_start as f64) * 100.0
    } else {
        0.0
    }
}

#[napi]
pub fn calculate_sales_pipeline_velocity(
    number_of_opportunities: i32,
    average_deal_size: f64,
    win_rate_percentage: f64,
    average_sales_cycle_days: f64,
) -> f64 {
    if average_sales_cycle_days > 0.0 {
        let pipeline_value = (number_of_opportunities as f64 * average_deal_size * win_rate_percentage / 100.0);
        pipeline_value / average_sales_cycle_days
    } else {
        0.0
    }
}

#[napi]
pub fn generate_crm_analytics(
    customers: Vec<Customer>,
    leads: Vec<Lead>,
    conversion_rate: f64,
) -> CrmAnalytics {
    let total_customers = customers.len() as i32;
    let total_leads = leads.len() as i32;
    
    // Count active customers (purchased in last year)
    let active_customers = customers.iter()
        .filter(|c| !c.last_purchase_date.is_empty()) // Simplified check
        .count() as i32;
    
    // Calculate average deal size
    let total_purchases: f64 = customers.iter().map(|c| c.total_purchases).sum();
    let average_deal_size = if total_customers > 0 {
        total_purchases / total_customers as f64
    } else {
        0.0
    };
    
    // Calculate customer lifetime value (simplified)
    let customer_lifetime_value = average_deal_size * 3.0; // Assuming 3 years average lifespan
    
    // Calculate churn rate (simplified - assuming 5% monthly churn)
    let churn_rate = 5.0;
    
    CrmAnalytics {
        total_customers,
        active_customers,
        total_leads,
        conversion_rate,
        average_deal_size,
        customer_lifetime_value,
        churn_rate,
    }
}

#[napi]
pub fn calculate_cross_sell_probability(
    customer_segment: String,
    product_affinity_score: f64,
    time_since_last_purchase: i32,
    previous_cross_sells: i32,
) -> f64 {
    // Base probability by segment
    let segment_probability = match customer_segment.as_str() {
        "CHAMPION" => 0.8,
        "LOYAL" => 0.6,
        "POTENTIAL" => 0.4,
        "AT_RISK" => 0.2,
        "LOST" => 0.1,
        _ => 0.3,
    };
    
    // Product affinity factor (0-1 scale)
    let affinity_factor = product_affinity_score / 100.0;
    
    // Recency factor (recent purchases increase probability)
    let recency_factor = if time_since_last_purchase <= 30 {
        1.0
    } else if time_since_last_purchase <= 90 {
        0.8
    } else if time_since_last_purchase <= 180 {
        0.6
    } else {
        0.3
    };
    
    // Previous success factor
    let success_factor = 1.0 + (previous_cross_sells as f64 * 0.1);
    
    (segment_probability * affinity_factor * recency_factor * success_factor).min(1.0)
}