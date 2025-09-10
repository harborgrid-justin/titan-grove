use napi_derive::napi;

#[napi]
pub fn calculate_customer_satisfaction_index(
    satisfaction_scores: Vec<f64>,
    weights: Vec<f64>,
) -> f64 {
    if satisfaction_scores.len() != weights.len() || satisfaction_scores.is_empty() {
        return 0.0;
    }

    let weighted_sum: f64 = satisfaction_scores.iter()
        .zip(weights.iter())
        .map(|(score, weight)| score * weight)
        .sum();
    
    let total_weight: f64 = weights.iter().sum();
    
    if total_weight > 0.0 {
        weighted_sum / total_weight
    } else {
        0.0
    }
}

#[napi]
pub fn calculate_net_promoter_score(
    promoter_count: i32,
    detractor_count: i32,
    total_responses: i32,
) -> f64 {
    if total_responses > 0 {
        let promoter_percentage = (promoter_count as f64 / total_responses as f64) * 100.0;
        let detractor_percentage = (detractor_count as f64 / total_responses as f64) * 100.0;
        promoter_percentage - detractor_percentage
    } else {
        0.0
    }
}