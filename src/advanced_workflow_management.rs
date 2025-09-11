use napi_derive::napi;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Advanced Production-Grade Workflow Management System
/// Provides sophisticated business process automation and orchestration

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct WorkflowDefinition {
    pub id: String,
    pub name: String,
    pub description: String,
    pub category: String, // "approval", "processing", "notification", "integration"
    pub version: String,
    pub steps: Vec<WorkflowStep>,
    pub triggers: Vec<WorkflowTrigger>,
    pub conditions: Vec<WorkflowCondition>,
    pub escalation_rules: Vec<EscalationRule>,
    pub sla_hours: f64,
    pub priority: i32,
    pub enabled: bool,
    pub created_date: String,
    pub last_modified: String,
}

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct WorkflowStep {
    pub step_id: String,
    pub name: String,
    pub step_type: String, // "manual", "automatic", "approval", "integration", "decision"
    pub assigned_role: String,
    pub assigned_user: Option<String>,
    pub estimated_duration_hours: f64,
    pub dependencies: Vec<String>, // Other step IDs that must complete first
    pub actions: Vec<WorkflowAction>,
    pub approval_required: bool,
    pub parallel_execution: bool,
    pub retry_on_failure: bool,
    pub max_retries: i32,
}

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct WorkflowAction {
    pub action_type: String, // "send_email", "create_record", "update_field", "call_api", "run_calculation"
    pub target: String,
    pub parameters: HashMap<String, String>,
    pub execution_order: i32,
}

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct WorkflowTrigger {
    pub trigger_type: String, // "schedule", "event", "manual", "api", "data_change"
    pub schedule_expression: Option<String>, // Cron expression for scheduled triggers
    pub event_name: Option<String>,
    pub conditions: Vec<String>,
}

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct WorkflowCondition {
    pub field: String,
    pub operator: String,
    pub value: String,
    pub condition_group: String, // For grouping AND/OR conditions
}

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct EscalationRule {
    pub step_id: String,
    pub escalation_level: i32,
    pub time_threshold_hours: f64,
    pub escalate_to_role: String,
    pub escalate_to_user: Option<String>,
    pub notification_template: String,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct WorkflowInstance {
    pub instance_id: String,
    pub workflow_id: String,
    pub status: String, // "pending", "in_progress", "completed", "failed", "cancelled"
    pub current_step: String,
    pub started_at: String,
    pub completed_at: Option<String>,
    pub initiated_by: String,
    pub data: HashMap<String, String>,
    pub step_history: Vec<WorkflowStepExecution>,
    pub sla_breach: bool,
    pub escalations_triggered: i32,
}

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct WorkflowStepExecution {
    pub step_id: String,
    pub status: String, // "pending", "in_progress", "completed", "failed", "skipped"
    pub assigned_to: String,
    pub started_at: Option<String>,
    pub completed_at: Option<String>,
    pub duration_hours: Option<f64>,
    pub comments: Option<String>,
    pub decision: Option<String>, // For approval/decision steps
    pub retry_count: i32,
    pub error_message: Option<String>,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct WorkflowAnalytics {
    pub workflow_id: String,
    pub total_instances: i32,
    pub completed_instances: i32,
    pub failed_instances: i32,
    pub average_completion_time_hours: f64,
    pub sla_compliance_percentage: f64,
    pub bottleneck_steps: Vec<String>,
    pub most_common_failures: Vec<String>,
    pub efficiency_score: f64,
}

/// Create a financial approval workflow
#[napi]
pub fn create_financial_approval_workflow(
    amount_threshold: f64,
    department: String,
    approval_hierarchy: Vec<String>,
) -> WorkflowDefinition {
    let workflow_id = format!("financial_approval_{}_{}", 
        chrono::Utc::now().timestamp_millis(),
        uuid::Uuid::new_v4().simple().to_string().chars().take(8).collect::<String>()
    );
    
    let mut steps = vec![
        WorkflowStep {
            step_id: "initial_review".to_string(),
            name: "Initial Request Review".to_string(),
            step_type: "manual".to_string(),
            assigned_role: "department_manager".to_string(),
            assigned_user: None,
            estimated_duration_hours: 2.0,
            dependencies: vec![],
            actions: vec![
                WorkflowAction {
                    action_type: "send_email".to_string(),
                    target: "department_manager".to_string(),
                    parameters: {
                        let mut params = HashMap::new();
                        params.insert("template".to_string(), "approval_request".to_string());
                        params
                    },
                    execution_order: 1,
                }
            ],
            approval_required: true,
            parallel_execution: false,
            retry_on_failure: false,
            max_retries: 0,
        }
    ];
    
    // Add approval steps based on hierarchy
    for (index, approver_role) in approval_hierarchy.iter().enumerate() {
        steps.push(WorkflowStep {
            step_id: format!("approval_level_{}", index + 1),
            name: format!("{} Approval", approver_role),
            step_type: "approval".to_string(),
            assigned_role: approver_role.clone(),
            assigned_user: None,
            estimated_duration_hours: 4.0,
            dependencies: if index == 0 { 
                vec!["initial_review".to_string()] 
            } else { 
                vec![format!("approval_level_{}", index)] 
            },
            actions: vec![
                WorkflowAction {
                    action_type: "send_email".to_string(),
                    target: approver_role.clone(),
                    parameters: {
                        let mut params = HashMap::new();
                        params.insert("template".to_string(), "approval_required".to_string());
                        params.insert("threshold".to_string(), amount_threshold.to_string());
                        params
                    },
                    execution_order: 1,
                }
            ],
            approval_required: true,
            parallel_execution: false,
            retry_on_failure: false,
            max_retries: 0,
        });
    }
    
    // Final processing step
    steps.push(WorkflowStep {
        step_id: "final_processing".to_string(),
        name: "Process Approved Request".to_string(),
        step_type: "automatic".to_string(),
        assigned_role: "system".to_string(),
        assigned_user: None,
        estimated_duration_hours: 0.5,
        dependencies: vec![format!("approval_level_{}", approval_hierarchy.len())],
        actions: vec![
            WorkflowAction {
                action_type: "create_record".to_string(),
                target: "financial_system".to_string(),
                parameters: {
                    let mut params = HashMap::new();
                    params.insert("record_type".to_string(), "approved_expense".to_string());
                    params
                },
                execution_order: 1,
            },
            WorkflowAction {
                action_type: "send_email".to_string(),
                target: "requester".to_string(),
                parameters: {
                    let mut params = HashMap::new();
                    params.insert("template".to_string(), "approval_granted".to_string());
                    params
                },
                execution_order: 2,
            },
        ],
        approval_required: false,
        parallel_execution: false,
        retry_on_failure: true,
        max_retries: 3,
    });
    
    WorkflowDefinition {
        id: workflow_id,
        name: format!("Financial Approval - {} - ${}", department, amount_threshold),
        description: format!("Multi-level approval workflow for financial expenses over ${} in {}", amount_threshold, department),
        category: "approval".to_string(),
        version: "1.0".to_string(),
        steps,
        triggers: vec![
            WorkflowTrigger {
                trigger_type: "event".to_string(),
                schedule_expression: None,
                event_name: Some("expense_request_submitted".to_string()),
                conditions: vec![
                    format!("amount > {}", amount_threshold),
                    format!("department == '{}'", department),
                ],
            }
        ],
        conditions: vec![
            WorkflowCondition {
                field: "amount".to_string(),
                operator: "greater_than".to_string(),
                value: amount_threshold.to_string(),
                condition_group: "main".to_string(),
            },
            WorkflowCondition {
                field: "department".to_string(),
                operator: "equals".to_string(),
                value: department,
                condition_group: "main".to_string(),
            },
        ],
        escalation_rules: vec![
            EscalationRule {
                step_id: "initial_review".to_string(),
                escalation_level: 1,
                time_threshold_hours: 24.0,
                escalate_to_role: "senior_manager".to_string(),
                escalate_to_user: None,
                notification_template: "escalation_approval_delay".to_string(),
            }
        ],
        sla_hours: 72.0,
        priority: 100,
        enabled: true,
        created_date: chrono::Utc::now().to_rfc3339(),
        last_modified: chrono::Utc::now().to_rfc3339(),
    }
}

/// Create a customer onboarding workflow
#[napi]
pub fn create_customer_onboarding_workflow() -> WorkflowDefinition {
    let workflow_id = format!("customer_onboarding_{}_{}", 
        chrono::Utc::now().timestamp_millis(),
        uuid::Uuid::new_v4().simple().to_string().chars().take(8).collect::<String>()
    );
    
    WorkflowDefinition {
        id: workflow_id,
        name: "Customer Onboarding Process".to_string(),
        description: "Complete customer onboarding with verification, setup, and welcome activities".to_string(),
        category: "processing".to_string(),
        version: "2.1".to_string(),
        steps: vec![
            WorkflowStep {
                step_id: "document_collection".to_string(),
                name: "Collect Required Documents".to_string(),
                step_type: "manual".to_string(),
                assigned_role: "customer_service".to_string(),
                assigned_user: None,
                estimated_duration_hours: 4.0,
                dependencies: vec![],
                actions: vec![
                    WorkflowAction {
                        action_type: "send_email".to_string(),
                        target: "customer".to_string(),
                        parameters: {
                            let mut params = HashMap::new();
                            params.insert("template".to_string(), "document_request".to_string());
                            params
                        },
                        execution_order: 1,
                    }
                ],
                approval_required: false,
                parallel_execution: false,
                retry_on_failure: true,
                max_retries: 2,
            },
            WorkflowStep {
                step_id: "identity_verification".to_string(),
                name: "Verify Customer Identity".to_string(),
                step_type: "integration".to_string(),
                assigned_role: "compliance".to_string(),
                assigned_user: None,
                estimated_duration_hours: 1.0,
                dependencies: vec!["document_collection".to_string()],
                actions: vec![
                    WorkflowAction {
                        action_type: "call_api".to_string(),
                        target: "identity_verification_service".to_string(),
                        parameters: {
                            let mut params = HashMap::new();
                            params.insert("service_endpoint".to_string(), "/api/verify-identity".to_string());
                            params
                        },
                        execution_order: 1,
                    }
                ],
                approval_required: false,
                parallel_execution: false,
                retry_on_failure: true,
                max_retries: 3,
            },
            WorkflowStep {
                step_id: "credit_check".to_string(),
                name: "Perform Credit Assessment".to_string(),
                step_type: "integration".to_string(),
                assigned_role: "risk_assessment".to_string(),
                assigned_user: None,
                estimated_duration_hours: 0.5,
                dependencies: vec!["identity_verification".to_string()],
                actions: vec![
                    WorkflowAction {
                        action_type: "call_api".to_string(),
                        target: "credit_bureau_service".to_string(),
                        parameters: {
                            let mut params = HashMap::new();
                            params.insert("service_endpoint".to_string(), "/api/credit-check".to_string());
                            params
                        },
                        execution_order: 1,
                    },
                    WorkflowAction {
                        action_type: "run_calculation".to_string(),
                        target: "risk_scoring_engine".to_string(),
                        parameters: {
                            let mut params = HashMap::new();
                            params.insert("calculation_type".to_string(), "customer_risk_score".to_string());
                            params
                        },
                        execution_order: 2,
                    },
                ],
                approval_required: false,
                parallel_execution: true,
                retry_on_failure: true,
                max_retries: 2,
            },
            WorkflowStep {
                step_id: "account_setup".to_string(),
                name: "Create Customer Accounts".to_string(),
                step_type: "automatic".to_string(),
                assigned_role: "system".to_string(),
                assigned_user: None,
                estimated_duration_hours: 0.25,
                dependencies: vec!["credit_check".to_string()],
                actions: vec![
                    WorkflowAction {
                        action_type: "create_record".to_string(),
                        target: "customer_database".to_string(),
                        parameters: {
                            let mut params = HashMap::new();
                            params.insert("record_type".to_string(), "customer_account".to_string());
                            params
                        },
                        execution_order: 1,
                    },
                    WorkflowAction {
                        action_type: "create_record".to_string(),
                        target: "billing_system".to_string(),
                        parameters: {
                            let mut params = HashMap::new();
                            params.insert("record_type".to_string(), "billing_account".to_string());
                            params
                        },
                        execution_order: 2,
                    },
                ],
                approval_required: false,
                parallel_execution: false,
                retry_on_failure: true,
                max_retries: 3,
            },
            WorkflowStep {
                step_id: "welcome_communication".to_string(),
                name: "Send Welcome Package".to_string(),
                step_type: "automatic".to_string(),
                assigned_role: "marketing".to_string(),
                assigned_user: None,
                estimated_duration_hours: 0.1,
                dependencies: vec!["account_setup".to_string()],
                actions: vec![
                    WorkflowAction {
                        action_type: "send_email".to_string(),
                        target: "customer".to_string(),
                        parameters: {
                            let mut params = HashMap::new();
                            params.insert("template".to_string(), "welcome_package".to_string());
                            params
                        },
                        execution_order: 1,
                    },
                ],
                approval_required: false,
                parallel_execution: false,
                retry_on_failure: true,
                max_retries: 2,
            },
        ],
        triggers: vec![
            WorkflowTrigger {
                trigger_type: "event".to_string(),
                schedule_expression: None,
                event_name: Some("new_customer_application".to_string()),
                conditions: vec!["application_status == 'submitted'".to_string()],
            }
        ],
        conditions: vec![
            WorkflowCondition {
                field: "application_status".to_string(),
                operator: "equals".to_string(),
                value: "submitted".to_string(),
                condition_group: "main".to_string(),
            }
        ],
        escalation_rules: vec![
            EscalationRule {
                step_id: "document_collection".to_string(),
                escalation_level: 1,
                time_threshold_hours: 48.0,
                escalate_to_role: "senior_customer_service".to_string(),
                escalate_to_user: None,
                notification_template: "onboarding_delay".to_string(),
            },
            EscalationRule {
                step_id: "identity_verification".to_string(),
                escalation_level: 2,
                time_threshold_hours: 24.0,
                escalate_to_role: "compliance_manager".to_string(),
                escalate_to_user: None,
                notification_template: "verification_delay".to_string(),
            },
        ],
        sla_hours: 120.0, // 5 business days
        priority: 80,
        enabled: true,
        created_date: chrono::Utc::now().to_rfc3339(),
        last_modified: chrono::Utc::now().to_rfc3339(),
    }
}

/// Start a workflow instance
#[napi]
pub fn start_workflow_instance(
    workflow_id: String,
    initiated_by: String,
    initial_data: HashMap<String, String>,
) -> WorkflowInstance {
    let instance_id = format!("instance_{}_{}", 
        chrono::Utc::now().timestamp_millis(),
        uuid::Uuid::new_v4().simple().to_string().chars().take(8).collect::<String>()
    );
    
    WorkflowInstance {
        instance_id,
        workflow_id,
        status: "in_progress".to_string(),
        current_step: "initial_step".to_string(),
        started_at: chrono::Utc::now().to_rfc3339(),
        completed_at: None,
        initiated_by,
        data: initial_data,
        step_history: vec![],
        sla_breach: false,
        escalations_triggered: 0,
    }
}

/// Complete a workflow step
#[napi]
pub fn complete_workflow_step(
    mut instance: WorkflowInstance,
    step_id: String,
    assigned_to: String,
    decision: Option<String>,
    comments: Option<String>,
) -> WorkflowInstance {
    let now = chrono::Utc::now().to_rfc3339();
    
    // Find and update the step in history or create new entry
    if let Some(step_execution) = instance.step_history.iter_mut().find(|s| s.step_id == step_id) {
        step_execution.status = "completed".to_string();
        step_execution.completed_at = Some(now.clone());
        step_execution.decision = decision;
        step_execution.comments = comments;
        
        // Calculate duration if started
        if let Some(started_at) = &step_execution.started_at {
            if let (Ok(started), Ok(completed)) = (
                chrono::DateTime::parse_from_rfc3339(started_at),
                chrono::DateTime::parse_from_rfc3339(&now)
            ) {
                let duration = completed.signed_duration_since(started);
                step_execution.duration_hours = Some(duration.num_milliseconds() as f64 / 3600000.0);
            }
        }
    } else {
        // Create new step execution record
        instance.step_history.push(WorkflowStepExecution {
            step_id: step_id.clone(),
            status: "completed".to_string(),
            assigned_to,
            started_at: Some(now.clone()),
            completed_at: Some(now),
            duration_hours: Some(0.1), // Minimal duration for immediate completion
            comments,
            decision,
            retry_count: 0,
            error_message: None,
        });
    }
    
    // Update current step and overall status
    instance.current_step = "next_step".to_string(); // This would be determined by workflow logic
    
    // Check if workflow is complete
    if step_id == "final_step" {
        instance.status = "completed".to_string();
        instance.completed_at = Some(chrono::Utc::now().to_rfc3339());
    }
    
    instance
}

/// Calculate workflow performance analytics
#[napi]
pub fn calculate_workflow_analytics(
    workflow_id: String,
    instances: Vec<WorkflowInstance>,
) -> WorkflowAnalytics {
    let total_instances = instances.len() as i32;
    if total_instances == 0 {
        return WorkflowAnalytics {
            workflow_id,
            total_instances: 0,
            completed_instances: 0,
            failed_instances: 0,
            average_completion_time_hours: 0.0,
            sla_compliance_percentage: 0.0,
            bottleneck_steps: vec![],
            most_common_failures: vec![],
            efficiency_score: 0.0,
        };
    }
    
    let completed_instances = instances.iter().filter(|i| i.status == "completed").count() as i32;
    let failed_instances = instances.iter().filter(|i| i.status == "failed").count() as i32;
    
    // Calculate average completion time for completed instances
    let completed_durations: Vec<f64> = instances.iter()
        .filter(|i| i.status == "completed" && i.completed_at.is_some())
        .filter_map(|i| {
            if let (Ok(started), Ok(completed)) = (
                chrono::DateTime::parse_from_rfc3339(&i.started_at),
                chrono::DateTime::parse_from_rfc3339(i.completed_at.as_ref().unwrap())
            ) {
                let duration = completed.signed_duration_since(started);
                Some(duration.num_milliseconds() as f64 / 3600000.0)
            } else {
                None
            }
        })
        .collect();
    
    let average_completion_time_hours = if !completed_durations.is_empty() {
        completed_durations.iter().sum::<f64>() / completed_durations.len() as f64
    } else {
        0.0
    };
    
    // Calculate SLA compliance
    let sla_compliant = instances.iter().filter(|i| !i.sla_breach).count() as f64;
    let sla_compliance_percentage = (sla_compliant / total_instances as f64) * 100.0;
    
    // Identify bottleneck steps (steps with longest average duration)
    let mut step_durations: HashMap<String, Vec<f64>> = HashMap::new();
    for instance in &instances {
        for step in &instance.step_history {
            if let Some(duration) = step.duration_hours {
                step_durations.entry(step.step_id.clone())
                    .or_insert_with(Vec::new)
                    .push(duration);
            }
        }
    }
    
    let mut bottleneck_steps: Vec<(String, f64)> = step_durations.iter()
        .map(|(step_id, durations)| {
            let avg_duration = durations.iter().sum::<f64>() / durations.len() as f64;
            (step_id.clone(), avg_duration)
        })
        .collect();
    bottleneck_steps.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());
    let bottleneck_steps: Vec<String> = bottleneck_steps.into_iter().take(3).map(|(id, _)| id).collect();
    
    // Find most common failures
    let mut failure_counts: HashMap<String, i32> = HashMap::new();
    for instance in &instances {
        for step in &instance.step_history {
            if let Some(error) = &step.error_message {
                *failure_counts.entry(error.clone()).or_insert(0) += 1;
            }
        }
    }
    
    let mut most_common_failures: Vec<(String, i32)> = failure_counts.into_iter().collect();
    most_common_failures.sort_by(|a, b| b.1.cmp(&a.1));
    let most_common_failures: Vec<String> = most_common_failures.into_iter().take(3).map(|(error, _)| error).collect();
    
    // Calculate efficiency score (combination of completion rate, SLA compliance, and speed)
    let completion_rate = (completed_instances as f64 / total_instances as f64) * 100.0;
    let speed_score = if average_completion_time_hours > 0.0 { 
        100.0 / (1.0 + average_completion_time_hours / 24.0) // Penalize longer completion times
    } else { 
        100.0 
    };
    let efficiency_score = (completion_rate * 0.4) + (sla_compliance_percentage * 0.4) + (speed_score * 0.2);
    
    WorkflowAnalytics {
        workflow_id,
        total_instances,
        completed_instances,
        failed_instances,
        average_completion_time_hours,
        sla_compliance_percentage,
        bottleneck_steps,
        most_common_failures,
        efficiency_score,
    }
}

/// Get workflow instances requiring escalation
#[napi]
pub fn get_workflows_requiring_escalation(
    instances: Vec<WorkflowInstance>,
    current_time: String,
) -> Vec<WorkflowInstance> {
    instances.into_iter()
        .filter(|instance| {
            if instance.status != "in_progress" {
                return false;
            }
            
            // Check if any step is overdue for escalation
            if let Ok(current_dt) = chrono::DateTime::parse_from_rfc3339(&current_time) {
                for step in &instance.step_history {
                    if step.status == "in_progress" || step.status == "pending" {
                        if let Some(started_at) = &step.started_at {
                            if let Ok(started_dt) = chrono::DateTime::parse_from_rfc3339(started_at) {
                                let duration = current_dt.signed_duration_since(started_dt);
                                let hours_elapsed = duration.num_milliseconds() as f64 / 3600000.0;
                                
                                // Simple escalation threshold of 24 hours
                                if hours_elapsed > 24.0 {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
            
            false
        })
        .collect()
}

/// Optimize workflow performance
#[napi]
pub fn optimize_workflow_performance(
    mut workflow: WorkflowDefinition,
    analytics: WorkflowAnalytics,
) -> WorkflowDefinition {
    // Reduce estimated durations for bottleneck steps
    for step_id in &analytics.bottleneck_steps {
        if let Some(step) = workflow.steps.iter_mut().find(|s| s.step_id == *step_id) {
            step.estimated_duration_hours *= 0.8; // Reduce by 20%
            step.parallel_execution = true; // Enable parallel execution where possible
        }
    }
    
    // Adjust SLA based on historical performance
    if analytics.average_completion_time_hours > 0.0 {
        workflow.sla_hours = (analytics.average_completion_time_hours * 1.2).max(workflow.sla_hours * 0.8);
    }
    
    // Add retry logic for steps with common failures
    if !analytics.most_common_failures.is_empty() {
        for step in &mut workflow.steps {
            if step.step_type == "integration" || step.step_type == "automatic" {
                step.retry_on_failure = true;
                step.max_retries = 3;
            }
        }
    }
    
    workflow.version = format!("{}.{}", 
        workflow.version, 
        chrono::Utc::now().timestamp_millis() % 1000
    );
    workflow.last_modified = chrono::Utc::now().to_rfc3339();
    
    workflow
}