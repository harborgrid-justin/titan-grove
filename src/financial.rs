use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct Account {
    pub account_id: String,
    pub account_number: String,
    pub account_name: String,
    pub account_type: String,
    pub balance: f64,
    pub currency: String,
    pub is_active: bool,
}

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct Transaction {
    pub transaction_id: String,
    pub account_id: String,
    pub amount: f64,
    pub transaction_type: String,
    pub description: String,
    pub transaction_date: String,
    pub reference_number: String,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct BudgetAnalysis {
    pub budget_category: String,
    pub budgeted_amount: f64,
    pub actual_amount: f64,
    pub variance: f64,
    pub variance_percentage: f64,
    pub status: String,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct CashFlowProjection {
    pub period: String,
    pub opening_balance: f64,
    pub total_inflows: f64,
    pub total_outflows: f64,
    pub net_cash_flow: f64,
    pub closing_balance: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct FinancialRatios {
    pub current_ratio: f64,
    pub quick_ratio: f64,
    pub debt_to_equity: f64,
    pub return_on_assets: f64,
    pub return_on_equity: f64,
    pub gross_profit_margin: f64,
    pub net_profit_margin: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct FinancialReport {
    pub report_type: String,
    pub period: String,
    pub total_revenue: f64,
    pub total_expenses: f64,
    pub gross_profit: f64,
    pub net_income: f64,
    pub ebitda: f64,
}

#[napi]
pub fn calculate_account_balance(transactions: Vec<Transaction>) -> f64 {
    transactions.iter().map(|t| {
        match t.transaction_type.as_str() {
            "CREDIT" | "DEPOSIT" | "INCOME" => t.amount,
            "DEBIT" | "WITHDRAWAL" | "EXPENSE" => -t.amount,
            _ => 0.0,
        }
    }).sum()
}

#[napi]
pub fn calculate_budget_variance(
    budgeted_amount: f64,
    actual_amount: f64,
) -> BudgetAnalysis {
    let variance = actual_amount - budgeted_amount;
    let variance_percentage = if budgeted_amount != 0.0 {
        (variance / budgeted_amount) * 100.0
    } else {
        0.0
    };
    
    let status = match variance_percentage {
        v if v <= -20.0 => "SIGNIFICANTLY_UNDER",
        v if v < -5.0 => "UNDER_BUDGET",
        v if v <= 5.0 => "ON_TARGET",
        v if v <= 20.0 => "OVER_BUDGET",
        _ => "SIGNIFICANTLY_OVER",
    };
    
    BudgetAnalysis {
        budget_category: "".to_string(), // To be set by caller
        budgeted_amount,
        actual_amount,
        variance,
        variance_percentage,
        status: status.to_string(),
    }
}

#[napi]
pub fn calculate_cash_flow_projection(
    opening_balance: f64,
    inflows: Vec<f64>,
    outflows: Vec<f64>,
) -> CashFlowProjection {
    let total_inflows: f64 = inflows.iter().sum();
    let total_outflows: f64 = outflows.iter().sum();
    let net_cash_flow = total_inflows - total_outflows;
    let closing_balance = opening_balance + net_cash_flow;
    
    CashFlowProjection {
        period: "".to_string(), // To be set by caller
        opening_balance,
        total_inflows,
        total_outflows,
        net_cash_flow,
        closing_balance,
    }
}

#[napi]
pub fn calculate_financial_ratios(
    current_assets: f64,
    current_liabilities: f64,
    quick_assets: f64,
    total_debt: f64,
    total_equity: f64,
    total_assets: f64,
    net_income: f64,
    revenue: f64,
    cost_of_goods_sold: f64,
) -> FinancialRatios {
    let current_ratio = if current_liabilities != 0.0 {
        current_assets / current_liabilities
    } else {
        0.0
    };
    
    let quick_ratio = if current_liabilities != 0.0 {
        quick_assets / current_liabilities
    } else {
        0.0
    };
    
    let debt_to_equity = if total_equity != 0.0 {
        total_debt / total_equity
    } else {
        0.0
    };
    
    let return_on_assets = if total_assets != 0.0 {
        (net_income / total_assets) * 100.0
    } else {
        0.0
    };
    
    let return_on_equity = if total_equity != 0.0 {
        (net_income / total_equity) * 100.0
    } else {
        0.0
    };
    
    let gross_profit = revenue - cost_of_goods_sold;
    let gross_profit_margin = if revenue != 0.0 {
        (gross_profit / revenue) * 100.0
    } else {
        0.0
    };
    
    let net_profit_margin = if revenue != 0.0 {
        (net_income / revenue) * 100.0
    } else {
        0.0
    };
    
    FinancialRatios {
        current_ratio,
        quick_ratio,
        debt_to_equity,
        return_on_assets,
        return_on_equity,
        gross_profit_margin,
        net_profit_margin,
    }
}

#[napi]
pub fn calculate_depreciation_straight_line(
    asset_cost: f64,
    salvage_value: f64,
    useful_life_years: f64,
) -> f64 {
    if useful_life_years > 0.0 {
        (asset_cost - salvage_value) / useful_life_years
    } else {
        0.0
    }
}

#[napi]
pub fn calculate_depreciation_declining_balance(
    book_value: f64,
    depreciation_rate: f64,
) -> f64 {
    book_value * depreciation_rate
}

#[napi]
pub fn calculate_loan_payment(
    principal: f64,
    annual_interest_rate: f64,
    loan_term_years: f64,
) -> f64 {
    if annual_interest_rate == 0.0 {
        return principal / (loan_term_years * 12.0);
    }
    
    let monthly_rate = annual_interest_rate / 100.0 / 12.0;
    let num_payments = loan_term_years * 12.0;
    
    let monthly_payment = principal * 
        (monthly_rate * (1.0 + monthly_rate).powf(num_payments)) /
        ((1.0 + monthly_rate).powf(num_payments) - 1.0);
        
    monthly_payment
}

#[napi]
pub fn calculate_financial_break_even_point(
    fixed_costs: f64,
    variable_cost_per_unit: f64,
    selling_price_per_unit: f64,
) -> f64 {
    let contribution_margin = selling_price_per_unit - variable_cost_per_unit;
    if contribution_margin > 0.0 {
        fixed_costs / contribution_margin
    } else {
        0.0
    }
}

#[napi]
pub fn calculate_cost_of_capital(
    cost_of_debt: f64,
    cost_of_equity: f64,
    market_value_debt: f64,
    market_value_equity: f64,
    tax_rate: f64,
) -> f64 {
    let total_value = market_value_debt + market_value_equity;
    if total_value == 0.0 {
        return 0.0;
    }
    
    let weight_debt = market_value_debt / total_value;
    let weight_equity = market_value_equity / total_value;
    
    let after_tax_cost_debt = cost_of_debt * (1.0 - tax_rate / 100.0);
    
    (weight_debt * after_tax_cost_debt) + (weight_equity * cost_of_equity)
}

#[napi]
pub fn calculate_economic_value_added(
    net_operating_profit_after_tax: f64,
    invested_capital: f64,
    cost_of_capital: f64,
) -> f64 {
    let capital_charge = invested_capital * (cost_of_capital / 100.0);
    net_operating_profit_after_tax - capital_charge
}

#[napi]
pub fn generate_financial_report(
    revenue: f64,
    cost_of_goods_sold: f64,
    operating_expenses: f64,
    interest_expense: f64,
    tax_expense: f64,
    depreciation_expense: f64,
) -> FinancialReport {
    let gross_profit = revenue - cost_of_goods_sold;
    let operating_income = gross_profit - operating_expenses;
    let ebit = operating_income; // Earnings Before Interest and Taxes
    let ebitda = ebit + depreciation_expense; // Add back depreciation
    let net_income = ebit - interest_expense - tax_expense;
    
    FinancialReport {
        report_type: "INCOME_STATEMENT".to_string(),
        period: "".to_string(), // To be set by caller
        total_revenue: revenue,
        total_expenses: cost_of_goods_sold + operating_expenses + interest_expense + tax_expense,
        gross_profit,
        net_income,
        ebitda,
    }
}

#[napi]
pub fn calculate_working_capital_ratio(
    current_assets: f64,
    current_liabilities: f64,
) -> f64 {
    current_assets - current_liabilities
}

#[napi]
pub fn calculate_financial_inventory_turnover(
    cost_of_goods_sold: f64,
    average_inventory: f64,
) -> f64 {
    if average_inventory > 0.0 {
        cost_of_goods_sold / average_inventory
    } else {
        0.0
    }
}

#[napi]
pub fn calculate_financial_days_sales_outstanding(
    accounts_receivable: f64,
    annual_sales: f64,
) -> f64 {
    if annual_sales > 0.0 {
        (accounts_receivable / annual_sales) * 365.0
    } else {
        0.0
    }
}