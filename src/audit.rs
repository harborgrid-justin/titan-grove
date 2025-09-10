use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct AuditTrail {
    pub audit_id: String,
    pub entity_type: String,
    pub entity_id: String,
    pub action: String,
    pub old_value: String,
    pub new_value: String,
    pub user_id: String,
    pub timestamp: String,
    pub ip_address: String,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct AuditReportFinding {
    pub finding_id: String,
    pub audit_type: String,
    pub severity: String,
    pub description: String,
    pub recommendation: String,
    pub status: String,
    pub risk_score: f64,
    pub due_date: String,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct ComplianceCheck {
    pub check_id: String,
    pub regulation: String,
    pub requirement: String,
    pub compliance_status: String,
    pub evidence_score: f64,
    pub last_verified: String,
    pub next_review: String,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct AuditReport {
    pub report_id: String,
    pub audit_period: String,
    pub total_findings: i32,
    pub critical_findings: i32,
    pub high_findings: i32,
    pub medium_findings: i32,
    pub low_findings: i32,
    pub overall_score: f64,
    pub compliance_percentage: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct ControlFramework {
    pub control_id: String,
    pub control_name: String,
    pub control_type: String,
    pub effectiveness_rating: f64,
    pub testing_frequency: String,
    pub last_test_date: String,
    pub deficiencies: i32,
}

#[napi]
pub fn calculate_audit_risk_score(
    inherent_risk: f64,
    control_risk: f64,
    detection_risk: f64,
) -> f64 {
    // Audit risk model: AR = IR × CR × DR
    (inherent_risk / 100.0) * (control_risk / 100.0) * (detection_risk / 100.0) * 100.0
}

#[napi]
pub fn assess_internal_control_effectiveness(
    controls: Vec<ControlFramework>,
) -> f64 {
    if controls.is_empty() {
        return 0.0;
    }

    let total_effectiveness: f64 = controls.iter()
        .map(|c| c.effectiveness_rating)
        .sum();
    
    total_effectiveness / controls.len() as f64
}

#[napi]
pub fn calculate_compliance_coverage(
    requirements_met: i32,
    total_requirements: i32,
) -> f64 {
    if total_requirements > 0 {
        (requirements_met as f64 / total_requirements as f64) * 100.0
    } else {
        0.0
    }
}

#[napi]
pub fn analyze_audit_trail_patterns(
    audit_trails: Vec<AuditTrail>,
    suspicious_actions: Vec<String>,
) -> Vec<String> {
    let mut flagged_users = Vec::new();
    let mut user_action_counts: std::collections::HashMap<String, i32> = std::collections::HashMap::new();

    for trail in audit_trails {
        if suspicious_actions.contains(&trail.action) {
            *user_action_counts.entry(trail.user_id.clone()).or_insert(0) += 1;
        }
    }

    // Flag users with suspicious activity above threshold
    for (user_id, count) in user_action_counts {
        if count > 5 { // Threshold for suspicious activity
            flagged_users.push(user_id);
        }
    }

    flagged_users
}

#[napi]
pub fn calculate_data_integrity_score(
    total_records: i32,
    corrupted_records: i32,
    missing_records: i32,
    duplicate_records: i32,
) -> f64 {
    if total_records == 0 {
        return 0.0;
    }

    let quality_records = total_records - corrupted_records - missing_records - duplicate_records;
    (quality_records as f64 / total_records as f64) * 100.0
}

#[napi]
pub fn generate_sox_compliance_score(
    financial_controls_score: f64,
    it_controls_score: f64,
    disclosure_controls_score: f64,
    management_assessment_score: f64,
) -> f64 {
    // Weighted SOX compliance score
    (financial_controls_score * 0.40) +
    (it_controls_score * 0.25) +
    (disclosure_controls_score * 0.20) +
    (management_assessment_score * 0.15)
}

#[napi]
pub fn calculate_audit_sampling_size(
    population_size: i32,
    confidence_level: f64,
    tolerable_error_rate: f64,
    expected_error_rate: f64,
) -> i32 {
    // Simplified audit sampling calculation
    let z_score: f64 = match confidence_level {
        95.0 => 1.96,
        99.0 => 2.58,
        90.0 => 1.65,
        _ => 1.96,
    };

    let p = expected_error_rate / 100.0;
    let e = tolerable_error_rate / 100.0;
    
    let sample_size = (z_score.powi(2) * p * (1.0 - p)) / e.powi(2);
    
    // Finite population correction
    let adjusted_size = sample_size / (1.0 + (sample_size / population_size as f64));
    
    adjusted_size.ceil() as i32
}

#[napi]
pub fn assess_fraud_risk_indicators(
    financial_pressure_score: f64,
    opportunity_score: f64,
    rationalization_score: f64,
) -> f64 {
    // Fraud triangle assessment
    let fraud_risk = (financial_pressure_score * 0.4) +
                    (opportunity_score * 0.4) +
                    (rationalization_score * 0.2);
    
    fraud_risk.min(100.0)
}

#[napi]
pub fn calculate_control_deficiency_impact(
    deficiency_severity: String,
    process_criticality: f64,
    frequency_of_operation: f64,
) -> f64 {
    let severity_multiplier = match deficiency_severity.as_str() {
        "CRITICAL" => 4.0,
        "HIGH" => 3.0,
        "MEDIUM" => 2.0,
        "LOW" => 1.0,
        _ => 1.0,
    };

    severity_multiplier * process_criticality * frequency_of_operation / 100.0
}

#[napi]
pub fn optimize_audit_schedule(
    audit_areas: Vec<String>,
    risk_scores: Vec<f64>,
    available_hours: f64,
    estimated_hours: Vec<f64>,
) -> Vec<String> {
    if audit_areas.is_empty() || risk_scores.is_empty() || estimated_hours.is_empty() {
        return Vec::new();
    }

    // Create area-risk-hours tuples and sort by risk score
    let mut audit_priorities: Vec<_> = audit_areas.into_iter()
        .zip(risk_scores.into_iter())
        .zip(estimated_hours.into_iter())
        .map(|((area, risk), hours)| (area, risk, hours))
        .collect();

    audit_priorities.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());

    let mut selected_audits = Vec::new();
    let mut remaining_hours = available_hours;

    for (area, _risk, hours) in audit_priorities {
        if remaining_hours >= hours {
            selected_audits.push(area);
            remaining_hours -= hours;
        }
    }

    selected_audits
}

#[napi]
pub fn generate_audit_report_summary(
    findings: Vec<AuditReportFinding>,
    report_id: String,
    audit_period: String,
) -> AuditReport {
    let total_findings = findings.len() as i32;
    
    let mut critical_findings = 0;
    let mut high_findings = 0;
    let mut medium_findings = 0;
    let mut low_findings = 0;

    for finding in &findings {
        match finding.severity.as_str() {
            "CRITICAL" => critical_findings += 1,
            "HIGH" => high_findings += 1,
            "MEDIUM" => medium_findings += 1,
            "LOW" => low_findings += 1,
            _ => low_findings += 1,
        }
    }

    // Calculate overall score based on findings
    let penalty_score = (critical_findings * 10) + (high_findings * 5) + 
                       (medium_findings * 2) + low_findings;
    let overall_score = (100.0 - penalty_score as f64).max(0.0);

    let compliance_percentage = if total_findings == 0 {
        100.0
    } else {
        ((total_findings - critical_findings - high_findings) as f64 / total_findings as f64) * 100.0
    };

    AuditReport {
        report_id,
        audit_period,
        total_findings,
        critical_findings,
        high_findings,
        medium_findings,
        low_findings,
        overall_score,
        compliance_percentage,
    }
}