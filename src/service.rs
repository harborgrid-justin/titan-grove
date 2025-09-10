use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct ServiceTicket {
    pub ticket_id: String,
    pub customer_id: String,
    pub category: String,
    pub priority: String,
    pub status: String,
    pub created_date: String,
    pub resolved_date: String,
    pub assigned_agent: String,
    pub description: String,
}

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct ServiceAgent {
    pub agent_id: String,
    pub name: String,
    pub skill_level: i32,
    pub current_workload: i32,
    pub max_capacity: i32,
    pub specializations: Vec<String>,
    pub performance_rating: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct ServiceLevelMetrics {
    pub average_response_time: f64,
    pub average_resolution_time: f64,
    pub first_call_resolution_rate: f64,
    pub customer_satisfaction_score: f64,
    pub sla_compliance_rate: f64,
    pub ticket_volume: i32,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct TicketPrioritization {
    pub ticket_id: String,
    pub priority_score: f64,
    pub estimated_effort: f64,
    pub customer_tier: String,
    pub urgency_level: String,
    pub business_impact: String,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct WorkloadDistribution {
    pub agent_id: String,
    pub assigned_tickets: i32,
    pub workload_percentage: f64,
    pub efficiency_score: f64,
    pub recommended_assignments: i32,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct ServiceAnalytics {
    pub total_tickets: i32,
    pub resolved_tickets: i32,
    pub pending_tickets: i32,
    pub escalated_tickets: i32,
    pub average_resolution_time: f64,
    pub customer_satisfaction: f64,
    pub agent_utilization: f64,
}

#[napi]
pub fn calculate_ticket_priority_score(
    customer_tier: String,
    issue_severity: String,
    business_impact: String,
    time_sensitivity: i32, // hours until deadline
) -> f64 {
    // Customer tier score (0-40 points)
    let tier_score = match customer_tier.as_str() {
        "ENTERPRISE" => 40.0,
        "PREMIUM" => 30.0,
        "STANDARD" => 20.0,
        "BASIC" => 10.0,
        _ => 5.0,
    };
    
    // Severity score (0-30 points)
    let severity_score = match issue_severity.as_str() {
        "CRITICAL" => 30.0,
        "HIGH" => 22.5,
        "MEDIUM" => 15.0,
        "LOW" => 7.5,
        _ => 5.0,
    };
    
    // Business impact score (0-20 points)
    let impact_score = match business_impact.as_str() {
        "SYSTEM_DOWN" => 20.0,
        "MAJOR_FUNCTIONALITY" => 15.0,
        "MINOR_FUNCTIONALITY" => 10.0,
        "COSMETIC" => 5.0,
        _ => 2.0,
    };
    
    // Time sensitivity score (0-10 points)
    let urgency_score = match time_sensitivity {
        0..=2 => 10.0,   // 0-2 hours
        3..=8 => 7.5,    // 3-8 hours
        9..=24 => 5.0,   // 9-24 hours
        25..=72 => 2.5,  // 1-3 days
        _ => 1.0,        // > 3 days
    };
    
    tier_score + severity_score + impact_score + urgency_score
}

#[napi]
pub fn calculate_sla_compliance(
    resolved_within_sla: i32,
    total_tickets: i32,
) -> f64 {
    if total_tickets > 0 {
        (resolved_within_sla as f64 / total_tickets as f64) * 100.0
    } else {
        0.0
    }
}

#[napi]
pub fn calculate_first_call_resolution_rate(
    resolved_on_first_contact: i32,
    total_contacts: i32,
) -> f64 {
    if total_contacts > 0 {
        (resolved_on_first_contact as f64 / total_contacts as f64) * 100.0
    } else {
        0.0
    }
}

#[napi]
pub fn optimize_agent_assignment(
    agents: Vec<ServiceAgent>,
    ticket_category: String,
    required_skill_level: i32,
) -> String {
    let mut best_agent_id = "UNASSIGNED".to_string();
    let mut best_score = 0.0;
    
    for agent in &agents {
        // Check if agent has capacity
        if agent.current_workload >= agent.max_capacity {
            continue;
        }
        
        // Check skill level requirement
        if agent.skill_level < required_skill_level {
            continue;
        }
        
        // Check specialization match
        let specialization_bonus = if agent.specializations.contains(&ticket_category) {
            20.0
        } else {
            0.0
        };
        
        // Calculate assignment score
        let workload_factor = 100.0 - ((agent.current_workload as f64 / agent.max_capacity as f64) * 100.0);
        let skill_factor = agent.skill_level as f64 * 10.0;
        let performance_factor = agent.performance_rating;
        
        let total_score = workload_factor + skill_factor + performance_factor + specialization_bonus;
        
        if total_score > best_score {
            best_score = total_score;
            best_agent_id = agent.agent_id.clone();
        }
    }
    
    best_agent_id
}

#[napi]
pub fn calculate_service_customer_satisfaction_score(
    rating_sum: f64,
    number_of_ratings: i32,
) -> f64 {
    if number_of_ratings > 0 {
        rating_sum / number_of_ratings as f64
    } else {
        0.0
    }
}

#[napi]
pub fn calculate_resolution_time_sla(
    priority: String,
    complexity: String,
) -> f64 {
    // Base SLA times in hours
    let priority_hours = match priority.as_str() {
        "CRITICAL" => 4.0,
        "HIGH" => 8.0,
        "MEDIUM" => 24.0,
        "LOW" => 72.0,
        _ => 48.0,
    };
    
    // Complexity multiplier
    let complexity_multiplier = match complexity.as_str() {
        "SIMPLE" => 1.0,
        "MEDIUM" => 1.5,
        "COMPLEX" => 2.0,
        "VERY_COMPLEX" => 3.0,
        _ => 1.5,
    };
    
    priority_hours * complexity_multiplier
}

#[napi]
pub fn calculate_escalation_probability(
    current_resolution_time: f64,
    sla_target_time: f64,
    agent_skill_level: i32,
    ticket_complexity: String,
) -> f64 {
    // Time factor (higher if approaching or past SLA)
    let time_factor = if sla_target_time > 0.0 {
        (current_resolution_time / sla_target_time).min(2.0)
    } else {
        1.0
    };
    
    // Skill factor (lower skill increases escalation probability)
    let skill_factor = 1.0 - (agent_skill_level as f64 / 10.0).min(1.0);
    
    // Complexity factor
    let complexity_factor = match ticket_complexity.as_str() {
        "SIMPLE" => 0.1,
        "MEDIUM" => 0.3,
        "COMPLEX" => 0.6,
        "VERY_COMPLEX" => 0.8,
        _ => 0.4,
    };
    
    let escalation_probability = (time_factor * 0.5 + skill_factor * 0.3 + complexity_factor * 0.2).min(1.0);
    escalation_probability
}

#[napi]
pub fn optimize_service_capacity(
    historical_ticket_volume: Vec<i32>,
    peak_hour_multiplier: f64,
    target_response_time: f64,
) -> i32 {
    if historical_ticket_volume.is_empty() {
        return 1;
    }
    
    // Calculate average and peak volumes
    let average_volume = historical_ticket_volume.iter().sum::<i32>() as f64 / historical_ticket_volume.len() as f64;
    let peak_volume = average_volume * peak_hour_multiplier;
    
    // Estimate required agents (assuming each agent can handle 8 tickets per day)
    let tickets_per_agent_per_hour = 1.0; // 8 tickets per 8-hour day
    let required_agents = (peak_volume / tickets_per_agent_per_hour).ceil() as i32;
    
    required_agents.max(1)
}

#[napi]
pub fn calculate_agent_productivity(
    tickets_resolved: i32,
    hours_worked: f64,
    quality_score: f64,
) -> f64 {
    if hours_worked > 0.0 {
        let productivity = (tickets_resolved as f64 / hours_worked) * (quality_score / 100.0);
        productivity
    } else {
        0.0
    }
}

#[napi]
pub fn calculate_service_cost_per_ticket(
    total_service_cost: f64,
    tickets_handled: i32,
) -> f64 {
    if tickets_handled > 0 {
        total_service_cost / tickets_handled as f64
    } else {
        0.0
    }
}

#[napi]
pub fn generate_service_analytics(
    tickets: Vec<ServiceTicket>,
    target_resolution_time: f64,
) -> ServiceAnalytics {
    let total_tickets = tickets.len() as i32;
    
    let resolved_tickets = tickets.iter()
        .filter(|t| t.status == "RESOLVED" || t.status == "CLOSED")
        .count() as i32;
    
    let pending_tickets = tickets.iter()
        .filter(|t| t.status == "OPEN" || t.status == "IN_PROGRESS")
        .count() as i32;
    
    let escalated_tickets = tickets.iter()
        .filter(|t| t.status == "ESCALATED")
        .count() as i32;
    
    // Mock average resolution time calculation
    let average_resolution_time = target_resolution_time * 0.8; // Assuming 80% of target
    
    // Mock customer satisfaction
    let customer_satisfaction = 85.0; // Would be calculated from actual ratings
    
    // Mock agent utilization
    let agent_utilization = 75.0; // Would be calculated from actual agent data
    
    ServiceAnalytics {
        total_tickets,
        resolved_tickets,
        pending_tickets,
        escalated_tickets,
        average_resolution_time,
        customer_satisfaction,
        agent_utilization,
    }
}

#[napi]
pub fn calculate_service_efficiency_score(
    actual_resolution_time: f64,
    target_resolution_time: f64,
    first_call_resolution_rate: f64,
    customer_satisfaction: f64,
) -> f64 {
    // Time efficiency (0-40 points)
    let time_efficiency = if target_resolution_time > 0.0 {
        ((target_resolution_time / actual_resolution_time).min(2.0) * 20.0).min(40.0)
    } else {
        20.0
    };
    
    // FCR score (0-30 points)
    let fcr_score = (first_call_resolution_rate / 100.0) * 30.0;
    
    // Satisfaction score (0-30 points)
    let satisfaction_score = (customer_satisfaction / 100.0) * 30.0;
    
    time_efficiency + fcr_score + satisfaction_score
}