use napi_derive::napi;

#[napi]
pub fn calculate_cash_flow_forecast(
    opening_balance: f64,
    projected_inflows: Vec<f64>,
    projected_outflows: Vec<f64>,
) -> f64 {
    let total_inflows: f64 = projected_inflows.iter().sum();
    let total_outflows: f64 = projected_outflows.iter().sum();
    opening_balance + total_inflows - total_outflows
}

#[napi]
pub fn calculate_liquidity_ratio(
    liquid_assets: f64,
    current_liabilities: f64,
) -> f64 {
    if current_liabilities > 0.0 {
        liquid_assets / current_liabilities
    } else {
        0.0
    }
}