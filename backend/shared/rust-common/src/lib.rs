use napi_derive::napi;

/// Common utility functions shared across all NAPI-RS modules

/// Calculate efficiency as a percentage from input and output values
#[napi]
pub fn calculate_efficiency(input: f64, output: f64) -> f64 {
    if input > 0.0 {
        (output / input) * 100.0
    } else {
        0.0
    }
}

/// Validate that data points are non-empty and all non-negative
#[napi]
pub fn validate_data_quality(data_points: Vec<f64>) -> bool {
    !data_points.is_empty() && data_points.iter().all(|&x| x >= 0.0)
}

/// Calculate trend from a series of values
#[napi]
pub fn calculate_trend(values: Vec<f64>) -> String {
    if values.len() < 2 {
        return "Insufficient data".to_string();
    }
    
    let first = values[0];
    let last = values[values.len() - 1];
    
    if last > first {
        "Increasing".to_string()
    } else if last < first {
        "Decreasing".to_string()
    } else {
        "Stable".to_string()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_calculate_efficiency() {
        assert_eq!(calculate_efficiency(100.0, 80.0), 80.0);
        assert_eq!(calculate_efficiency(0.0, 80.0), 0.0);
        assert_eq!(calculate_efficiency(50.0, 100.0), 200.0);
    }

    #[test]
    fn test_validate_data_quality() {
        assert!(validate_data_quality(vec![1.0, 2.0, 3.0]));
        assert!(!validate_data_quality(vec![]));
        assert!(!validate_data_quality(vec![1.0, -2.0, 3.0]));
    }

    #[test]
    fn test_calculate_trend() {
        assert_eq!(calculate_trend(vec![1.0, 2.0, 3.0]), "Increasing");
        assert_eq!(calculate_trend(vec![3.0, 2.0, 1.0]), "Decreasing");
        assert_eq!(calculate_trend(vec![2.0, 2.0]), "Stable");
        assert_eq!(calculate_trend(vec![1.0]), "Insufficient data");
    }
}
