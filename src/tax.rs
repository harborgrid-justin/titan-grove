use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct TaxCalculation {
    pub jurisdiction: String,
    pub tax_type: String,
    pub taxable_amount: f64,
    pub tax_rate: f64,
    pub tax_amount: f64,
    pub effective_rate: f64,
    pub exemptions: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct SalesTaxResult {
    pub base_amount: f64,
    pub tax_jurisdictions: Vec<TaxCalculation>,
    pub total_tax: f64,
    pub total_amount: f64,
    pub tax_percentage: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct IncomeTaxProjection {
    pub gross_income: f64,
    pub deductions: f64,
    pub taxable_income: f64,
    pub tax_brackets: Vec<TaxBracket>,
    pub total_tax: f64,
    pub effective_rate: f64,
    pub marginal_rate: f64,
}

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct TaxBracket {
    pub min_income: f64,
    pub max_income: f64,
    pub tax_rate: f64,
    pub tax_amount: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct TaxCompliance {
    pub filing_status: String,
    pub due_dates: Vec<String>,
    pub compliance_score: f64,
    pub penalties_assessed: f64,
    pub interest_charges: f64,
    pub total_liability: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct TaxPlanningStrategy {
    pub strategy_name: String,
    pub potential_savings: f64,
    pub implementation_cost: f64,
    pub net_benefit: f64,
    pub risk_level: String,
    pub time_horizon: String,
}

#[napi]
pub fn calculate_sales_tax(
    base_amount: f64,
    tax_rates: Vec<f64>, // Multiple jurisdictions
    tax_types: Vec<String>,
) -> SalesTaxResult {
    let mut jurisdictions = Vec::new();
    let mut total_tax = 0.0;

    for (i, &rate) in tax_rates.iter().enumerate() {
        let tax_amount = base_amount * (rate / 100.0);
        total_tax += tax_amount;

        let jurisdiction_name = format!("JURISDICTION_{}", i + 1);
        let tax_type = tax_types.get(i).cloned().unwrap_or_else(|| "SALES_TAX".to_string());

        jurisdictions.push(TaxCalculation {
            jurisdiction: jurisdiction_name,
            tax_type,
            taxable_amount: base_amount,
            tax_rate: rate,
            tax_amount,
            effective_rate: rate,
            exemptions: 0.0,
        });
    }

    let tax_percentage = if base_amount > 0.0 {
        (total_tax / base_amount) * 100.0
    } else {
        0.0
    };

    SalesTaxResult {
        base_amount,
        tax_jurisdictions: jurisdictions,
        total_tax,
        total_amount: base_amount + total_tax,
        tax_percentage,
    }
}

#[napi]
pub fn calculate_progressive_income_tax(
    gross_income: f64,
    deductions: f64,
    tax_brackets: Vec<TaxBracket>,
) -> IncomeTaxProjection {
    let taxable_income = (gross_income - deductions).max(0.0);
    let mut total_tax = 0.0;
    let mut calculated_brackets = Vec::new();
    let mut remaining_income = taxable_income;
    let mut marginal_rate = 0.0;

    for bracket in tax_brackets {
        if remaining_income <= 0.0 {
            break;
        }

        let bracket_width = bracket.max_income - bracket.min_income;
        let taxable_in_bracket = remaining_income.min(bracket_width);
        let tax_in_bracket = taxable_in_bracket * (bracket.tax_rate / 100.0);
        
        total_tax += tax_in_bracket;
        remaining_income -= taxable_in_bracket;
        marginal_rate = bracket.tax_rate;

        calculated_brackets.push(TaxBracket {
            min_income: bracket.min_income,
            max_income: bracket.max_income,
            tax_rate: bracket.tax_rate,
            tax_amount: tax_in_bracket,
        });
    }

    let effective_rate = if taxable_income > 0.0 {
        (total_tax / taxable_income) * 100.0
    } else {
        0.0
    };

    IncomeTaxProjection {
        gross_income,
        deductions,
        taxable_income,
        tax_brackets: calculated_brackets,
        total_tax,
        effective_rate,
        marginal_rate,
    }
}

#[napi]
pub fn calculate_depreciation_tax_benefit(
    asset_cost: f64,
    depreciation_rate: f64,
    tax_rate: f64,
    years: i32,
) -> f64 {
    let annual_depreciation = asset_cost * (depreciation_rate / 100.0);
    let total_depreciation = annual_depreciation * years as f64;
    let tax_benefit = total_depreciation * (tax_rate / 100.0);
    tax_benefit
}

#[napi]
pub fn calculate_tax_loss_carryforward(
    current_year_loss: f64,
    previous_losses: Vec<f64>,
    carryforward_limit: f64,
    years_limit: i32,
) -> f64 {
    let total_losses = current_year_loss + previous_losses.iter().sum::<f64>();
    total_losses.min(carryforward_limit)
}

#[napi]
pub fn calculate_estimated_tax_payments(
    projected_annual_tax: f64,
    withholdings: f64,
    safe_harbor_percentage: f64,
) -> f64 {
    let required_payment = projected_annual_tax * (safe_harbor_percentage / 100.0);
    let remaining_payment = (required_payment - withholdings).max(0.0);
    remaining_payment / 4.0 // Quarterly payments
}

#[napi]
pub fn calculate_tax_penalty(
    underpayment_amount: f64,
    penalty_rate: f64,
    days_late: i32,
) -> f64 {
    let daily_penalty_rate = penalty_rate / 100.0 / 365.0;
    underpayment_amount * daily_penalty_rate * days_late as f64
}

#[napi]
pub fn calculate_alternative_minimum_tax(
    regular_taxable_income: f64,
    amt_adjustments: f64,
    amt_exemption: f64,
    amt_rate: f64,
) -> f64 {
    let amt_income = regular_taxable_income + amt_adjustments;
    let amt_taxable_income = (amt_income - amt_exemption).max(0.0);
    let amt_tax = amt_taxable_income * (amt_rate / 100.0);
    amt_tax
}

#[napi]
pub fn optimize_tax_strategy(
    current_tax_liability: f64,
    strategies: Vec<TaxPlanningStrategy>,
    risk_tolerance: String,
) -> Vec<String> {
    let risk_filter = match risk_tolerance.as_str() {
        "LOW" => vec!["LOW"],
        "MEDIUM" => vec!["LOW", "MEDIUM"],
        "HIGH" => vec!["LOW", "MEDIUM", "HIGH"],
        _ => vec!["LOW"],
    };

    let mut filtered_strategies: Vec<_> = strategies.into_iter()
        .filter(|s| risk_filter.contains(&s.risk_level.as_str()))
        .collect();

    // Sort by net benefit (descending)
    filtered_strategies.sort_by(|a, b| b.net_benefit.partial_cmp(&a.net_benefit).unwrap());

    // Return top strategies
    filtered_strategies.into_iter()
        .take(5)
        .map(|s| s.strategy_name)
        .collect()
}

#[napi]
pub fn calculate_international_tax_credit(
    foreign_tax_paid: f64,
    foreign_source_income: f64,
    total_income: f64,
    domestic_tax_rate: f64,
) -> f64 {
    let foreign_tax_limit = (foreign_source_income / total_income) * 
                           (total_income * domestic_tax_rate / 100.0);
    foreign_tax_paid.min(foreign_tax_limit)
}

#[napi]
pub fn calculate_section_199a_deduction(
    qualified_business_income: f64,
    taxable_income: f64,
    filing_status: String,
) -> f64 {
    let base_deduction = qualified_business_income * 0.2; // 20% deduction
    
    // Simplified income limits based on filing status
    let income_limit = match filing_status.as_str() {
        "MARRIED_FILING_JOINTLY" => 329800.0,
        "SINGLE" => 164900.0,
        _ => 164900.0,
    };
    
    if taxable_income <= income_limit {
        base_deduction
    } else {
        // Phase-out calculation (simplified)
        let excess = taxable_income - income_limit;
        let reduction_factor = (excess / 50000.0).min(1.0);
        base_deduction * (1.0 - reduction_factor)
    }
}

#[napi]
pub fn generate_tax_compliance_report(
    tax_calculations: Vec<TaxCalculation>,
    filing_deadlines: Vec<String>,
) -> TaxCompliance {
    let total_liability: f64 = tax_calculations.iter().map(|t| t.tax_amount).sum();
    let compliance_score = 95.0; // Would be calculated based on actual compliance metrics
    
    TaxCompliance {
        filing_status: "CURRENT".to_string(),
        due_dates: filing_deadlines,
        compliance_score,
        penalties_assessed: 0.0,
        interest_charges: 0.0,
        total_liability,
    }
}