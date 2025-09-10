use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct ComplianceFramework {
    pub id: String,
    pub framework_code: String,
    pub name: String,
    pub description: String,
    pub regulatory_body: String,
    pub applicable_regions: Vec<String>,
    pub requirements_count: i32,
    pub compliance_rate: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct ComplianceRequirement {
    pub requirement_id: String,
    pub title: String,
    pub description: String,
    pub category: String,
    pub mandatory: bool,
    pub assessment_frequency: String,
    pub compliance_status: String,
    pub last_assessment_score: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct ComplianceAssessment {
    pub framework_id: String,
    pub overall_compliance_rate: f64,
    pub risk_level: String,
    pub non_compliant_count: i32,
    pub recommendations: Vec<String>,
    pub next_assessment_date: String,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct AuditFinding {
    pub finding_id: String,
    pub category: String,
    pub description: String,
    pub risk_level: String,
    pub status: String,
    pub corrective_actions_count: i32,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct ComplianceMetrics {
    pub total_frameworks: i32,
    pub average_compliance_rate: f64,
    pub critical_findings: i32,
    pub overdue_actions: i32,
    pub training_compliance_rate: f64,
}

#[napi]
pub fn calculate_compliance_score(
    total_requirements: i32,
    compliant_requirements: i32,
    weighted_scores: Vec<f64>,
) -> f64 {
    if total_requirements == 0 {
        return 0.0;
    }

    // Basic compliance rate
    let basic_rate = (compliant_requirements as f64 / total_requirements as f64) * 100.0;
    
    // Weighted average if scores are provided
    if !weighted_scores.is_empty() {
        let weighted_avg: f64 = weighted_scores.iter().sum::<f64>() / weighted_scores.len() as f64;
        // Combine basic rate with weighted average (70% weighted, 30% basic)
        (weighted_avg * 0.7) + (basic_rate * 0.3)
    } else {
        basic_rate
    }
}

#[napi]
pub fn determine_compliance_risk_level(compliance_rate: f64, critical_findings: i32) -> String {
    match (compliance_rate, critical_findings) {
        (rate, findings) if rate >= 95.0 && findings == 0 => "LOW".to_string(),
        (rate, findings) if rate >= 85.0 && findings <= 2 => "MEDIUM".to_string(),
        (rate, findings) if rate >= 70.0 && findings <= 5 => "HIGH".to_string(),
        _ => "CRITICAL".to_string(),
    }
}

#[napi]
pub fn assess_framework_compliance(
    framework_id: String,
    requirements: Vec<ComplianceRequirement>,
) -> ComplianceAssessment {
    let total_requirements = requirements.len() as i32;
    let compliant_count = requirements
        .iter()
        .filter(|req| req.compliance_status == "COMPLIANT")
        .count() as i32;
    
    let non_compliant_count = total_requirements - compliant_count;
    
    // Calculate weighted scores for mandatory vs non-mandatory requirements
    let weighted_scores: Vec<f64> = requirements
        .iter()
        .map(|req| {
            let base_score = req.last_assessment_score;
            if req.mandatory {
                base_score * 1.5 // Weight mandatory requirements higher
            } else {
                base_score
            }
        })
        .collect();

    let overall_compliance_rate = calculate_compliance_score(
        total_requirements,
        compliant_count,
        weighted_scores,
    );

    // Count critical findings
    let critical_findings = requirements
        .iter()
        .filter(|req| req.compliance_status == "NON_COMPLIANT" && req.mandatory)
        .count() as i32;

    let risk_level = determine_compliance_risk_level(overall_compliance_rate, critical_findings);

    // Generate recommendations
    let mut recommendations = Vec::new();
    
    if overall_compliance_rate < 85.0 {
        recommendations.push("Implement comprehensive compliance improvement program".to_string());
    }
    
    if critical_findings > 0 {
        recommendations.push("Address critical mandatory requirement gaps immediately".to_string());
    }
    
    if non_compliant_count > total_requirements / 4 {
        recommendations.push("Review and update compliance processes and training".to_string());
    }

    // Next assessment date (quarterly for high/critical risk, annually for low/medium)
    let next_assessment_date = match risk_level.as_str() {
        "CRITICAL" | "HIGH" => {
            let date = chrono::Utc::now() + chrono::Duration::days(90); // 3 months
            date.format("%Y-%m-%d").to_string()
        },
        _ => {
            let date = chrono::Utc::now() + chrono::Duration::days(365); // 1 year
            date.format("%Y-%m-%d").to_string()
        }
    };

    ComplianceAssessment {
        framework_id,
        overall_compliance_rate,
        risk_level,
        non_compliant_count,
        recommendations,
        next_assessment_date,
    }
}

#[napi]
pub fn calculate_training_compliance_rate(
    total_employees: i32,
    employees_with_current_training: i32,
    overdue_renewals: i32,
) -> f64 {
    if total_employees == 0 {
        return 0.0;
    }

    // Calculate base compliance rate
    let base_rate = (employees_with_current_training as f64 / total_employees as f64) * 100.0;
    
    // Apply penalty for overdue renewals
    let penalty_rate = (overdue_renewals as f64 / total_employees as f64) * 100.0;
    
    // Reduce compliance rate by half the penalty rate
    (base_rate - (penalty_rate * 0.5)).max(0.0)
}

#[napi]
pub fn validate_requirement_compliance(
    requirement: ComplianceRequirement,
    evidence_count: i32,
    last_assessment_days_ago: i32,
) -> f64 {
    let mut score = 0.0;

    // Base score from compliance status
    score += match requirement.compliance_status.as_str() {
        "COMPLIANT" => 100.0,
        "UNDER_REVIEW" => 75.0,
        "NON_COMPLIANT" => 0.0,
        _ => 50.0,
    };

    // Evidence adequacy bonus/penalty
    let evidence_bonus = match evidence_count {
        0 => -20.0,
        1..=2 => 0.0,
        3..=5 => 10.0,
        _ => 20.0,
    };
    score += evidence_bonus;

    // Recency of assessment factor
    let assessment_frequency_days = match requirement.assessment_frequency.as_str() {
        "CONTINUOUS" => 30,
        "MONTHLY" => 30,
        "QUARTERLY" => 90,
        "ANNUAL" => 365,
        _ => 365,
    };

    let recency_factor = if last_assessment_days_ago <= assessment_frequency_days {
        1.0
    } else {
        1.0 - ((last_assessment_days_ago - assessment_frequency_days) as f64 / assessment_frequency_days as f64).min(0.5)
    };

    // Apply recency factor
    score *= recency_factor;

    // Mandatory requirement factor
    if requirement.mandatory {
        score *= 1.2; // Boost mandatory requirements
    }

    score.min(100.0).max(0.0)
}

#[napi]
pub fn generate_compliance_metrics(
    frameworks: Vec<ComplianceFramework>,
    findings: Vec<AuditFinding>,
    training_compliance_rate: f64,
) -> ComplianceMetrics {
    let total_frameworks = frameworks.len() as i32;
    
    let average_compliance_rate = if total_frameworks > 0 {
        frameworks.iter().map(|f| f.compliance_rate).sum::<f64>() / total_frameworks as f64
    } else {
        0.0
    };

    let critical_findings = findings
        .iter()
        .filter(|f| f.risk_level == "CRITICAL" && f.status != "CLOSED")
        .count() as i32;

    let overdue_actions = findings
        .iter()
        .map(|f| f.corrective_actions_count)
        .sum::<i32>();

    ComplianceMetrics {
        total_frameworks,
        average_compliance_rate,
        critical_findings,
        overdue_actions,
        training_compliance_rate,
    }
}

#[napi]
pub fn calculate_audit_score(
    total_requirements_checked: i32,
    requirements_passed: i32,
    minor_findings: i32,
    major_findings: i32,
    critical_findings: i32,
) -> f64 {
    if total_requirements_checked == 0 {
        return 0.0;
    }

    // Base score from passed requirements
    let base_score = (requirements_passed as f64 / total_requirements_checked as f64) * 100.0;
    
    // Apply penalties for findings
    let minor_penalty = minor_findings as f64 * 2.0;
    let major_penalty = major_findings as f64 * 5.0;
    let critical_penalty = critical_findings as f64 * 15.0;
    
    let total_penalty = minor_penalty + major_penalty + critical_penalty;
    
    (base_score - total_penalty).max(0.0)
}