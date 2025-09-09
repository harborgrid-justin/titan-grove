use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct RiskAssessment {
  pub id: String,
  pub assessment_name: String,
  pub risk_category: String,
  pub risk_description: String,
  pub likelihood: String,
  pub impact: String,
  pub risk_score: f64,
  pub risk_level: String,
  pub owner: String,
  pub status: String,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct RiskMitigation {
  pub strategy: String,
  pub actions: Vec<MitigationAction>,
  pub residual_risk_score: f64,
  pub cost: Option<f64>,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct MitigationAction {
  pub action_id: String,
  pub description: String,
  pub assigned_to: String,
  pub status: String,
  pub priority: String,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct RiskMetrics {
  pub total_risks: i32,
  pub risk_distribution: Vec<RiskDistribution>,
  pub high_risks: Vec<RiskAssessment>,
  pub overdue_mitigations: i32,
  pub average_risk_score: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct RiskDistribution {
  pub level: String,
  pub count: i32,
  pub percentage: f64,
}

#[napi]
pub fn calculate_risk_score(likelihood: String, impact: String) -> f64 {
    let likelihood_score = match likelihood.as_str() {
        "VERY_LOW" => 1.0,
        "LOW" => 2.0,
        "MEDIUM" => 3.0,
        "HIGH" => 4.0,
        "VERY_HIGH" => 5.0,
        _ => 3.0, // default to medium
    };

    let impact_score = match impact.as_str() {
        "NEGLIGIBLE" => 1.0,
        "MINOR" => 2.0,
        "MODERATE" => 3.0,
        "MAJOR" => 4.0,
        "CATASTROPHIC" => 5.0,
        _ => 3.0, // default to moderate
    };

    likelihood_score * impact_score
}

#[napi]
pub fn determine_risk_level(score: f64) -> String {
    match score {
        s if s <= 6.0 => "LOW".to_string(),
        s if s <= 12.0 => "MEDIUM".to_string(),
        s if s <= 20.0 => "HIGH".to_string(),
        _ => "CRITICAL".to_string(),
    }
}

#[napi]
pub fn create_risk_assessment(
    assessment_name: String,
    risk_category: String,
    risk_description: String,
    likelihood: String,
    impact: String,
    owner: String,
    status: String,
) -> RiskAssessment {
    let id = format!("risk_{}_{}", 
        chrono::Utc::now().timestamp_millis(),
        uuid::Uuid::new_v4().simple().to_string().chars().take(9).collect::<String>()
    );
    
    let risk_score = calculate_risk_score(likelihood.clone(), impact.clone());
    let risk_level = determine_risk_level(risk_score);

    RiskAssessment {
        id,
        assessment_name,
        risk_category,
        risk_description,
        likelihood,
        impact,
        risk_score,
        risk_level,
        owner,
        status,
    }
}

#[napi]
pub fn calculate_residual_risk(base_score: f64, mitigation_effectiveness: f64) -> f64 {
    if mitigation_effectiveness < 0.0 || mitigation_effectiveness > 1.0 {
        return base_score; // No mitigation if effectiveness is invalid
    }
    
    base_score * (1.0 - mitigation_effectiveness)
}

#[napi]
pub fn generate_risk_metrics(risks: Vec<RiskAssessment>) -> RiskMetrics {
    let total_risks = risks.len() as i32;
    let total_score: f64 = risks.iter().map(|r| r.risk_score).sum();
    let average_risk_score = if total_risks > 0 { total_score / total_risks as f64 } else { 0.0 };

    // Calculate distribution
    let mut low_count = 0;
    let mut medium_count = 0;
    let mut high_count = 0;
    let mut critical_count = 0;

    let mut high_risks = Vec::new();

    for risk in &risks {
        match risk.risk_level.as_str() {
            "LOW" => low_count += 1,
            "MEDIUM" => medium_count += 1,
            "HIGH" => {
                high_count += 1;
                high_risks.push(risk.clone());
            },
            "CRITICAL" => {
                critical_count += 1;
                high_risks.push(risk.clone());
            },
            _ => {}
        }
    }

    let distribution = vec![
        RiskDistribution {
            level: "LOW".to_string(),
            count: low_count,
            percentage: if total_risks > 0 { (low_count as f64 / total_risks as f64) * 100.0 } else { 0.0 },
        },
        RiskDistribution {
            level: "MEDIUM".to_string(),
            count: medium_count,
            percentage: if total_risks > 0 { (medium_count as f64 / total_risks as f64) * 100.0 } else { 0.0 },
        },
        RiskDistribution {
            level: "HIGH".to_string(),
            count: high_count,
            percentage: if total_risks > 0 { (high_count as f64 / total_risks as f64) * 100.0 } else { 0.0 },
        },
        RiskDistribution {
            level: "CRITICAL".to_string(),
            count: critical_count,
            percentage: if total_risks > 0 { (critical_count as f64 / total_risks as f64) * 100.0 } else { 0.0 },
        },
    ];

    RiskMetrics {
        total_risks,
        risk_distribution: distribution,
        high_risks,
        overdue_mitigations: 3, // This would be calculated from actual data
        average_risk_score,
    }
}

#[napi]
pub fn assess_portfolio_risk(risks: Vec<RiskAssessment>) -> f64 {
    if risks.is_empty() {
        return 0.0;
    }

    // Calculate weighted portfolio risk using various risk levels
    let mut weighted_score = 0.0;
    let mut total_weight = 0.0;

    for risk in &risks {
        let weight = match risk.risk_level.as_str() {
            "CRITICAL" => 4.0,
            "HIGH" => 3.0,
            "MEDIUM" => 2.0,
            "LOW" => 1.0,
            _ => 1.0,
        };

        weighted_score += risk.risk_score * weight;
        total_weight += weight;
    }

    if total_weight > 0.0 {
        weighted_score / total_weight
    } else {
        0.0
    }
}