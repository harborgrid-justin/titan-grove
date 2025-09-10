use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct Investment {
    pub investment_id: String,
    pub asset_type: String,
    pub quantity: f64,
    pub purchase_price: f64,
    pub current_price: f64,
    pub market_value: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct PortfolioMetrics {
    pub total_value: f64,
    pub total_return: f64,
    pub volatility: f64,
    pub sharpe_ratio: f64,
    pub beta: f64,
}

#[napi]
pub fn calculate_portfolio_return(
    investments: Vec<Investment>,
) -> f64 {
    let total_invested: f64 = investments.iter().map(|i| i.purchase_price * i.quantity).sum();
    let total_current: f64 = investments.iter().map(|i| i.current_price * i.quantity).sum();
    
    if total_invested > 0.0 {
        ((total_current - total_invested) / total_invested) * 100.0
    } else {
        0.0
    }
}

#[napi]
pub fn calculate_sharpe_ratio(
    portfolio_return: f64,
    risk_free_rate: f64,
    portfolio_volatility: f64,
) -> f64 {
    if portfolio_volatility > 0.0 {
        (portfolio_return - risk_free_rate) / portfolio_volatility
    } else {
        0.0
    }
}