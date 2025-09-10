use napi_derive::napi;
use serde::{Deserialize, Serialize};
use chrono::Utc;
use uuid::Uuid;

/// Account types in the financial system
#[derive(Serialize, Deserialize)]
#[napi(string_enum)]
pub enum AccountType {
    Asset,
    Liability,
    Equity,
    Revenue,
    Expense,
}

/// Financial account data structure
#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct Account {
    pub id: String,
    pub account_code: String,
    pub account_name: String,
    pub account_type: String,
    pub parent_account_id: Option<String>,
    pub current_balance: f64,
    pub debit_balance: f64,
    pub credit_balance: f64,
    pub is_active: bool,
    pub created_at: String,
    pub updated_at: String,
}

/// Journal entry for double-entry bookkeeping
#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct JournalEntry {
    pub id: String,
    pub entry_number: String,
    pub description: String,
    pub transaction_date: String,
    pub total_debit: f64,
    pub total_credit: f64,
    pub is_balanced: bool,
    pub created_by: String,
    pub status: String,
}

/// Individual line item in a journal entry
#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct JournalLineItem {
    pub id: String,
    pub journal_entry_id: String,
    pub account_id: String,
    pub description: String,
    pub debit_amount: f64,
    pub credit_amount: f64,
    pub reference_number: Option<String>,
}

/// Financial statement data
#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct FinancialStatement {
    pub statement_type: String,
    pub period_start: String,
    pub period_end: String,
    pub total_assets: f64,
    pub total_liabilities: f64,
    pub total_equity: f64,
    pub total_revenue: f64,
    pub total_expenses: f64,
    pub net_income: f64,
}

/// Account receivable record
#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct AccountReceivable {
    pub id: String,
    pub customer_id: String,
    pub invoice_number: String,
    pub invoice_amount: f64,
    pub amount_paid: f64,
    pub amount_due: f64,
    pub due_date: String,
    pub days_overdue: i32,
    pub aging_bucket: String,
}

/// Account payable record
#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct AccountPayable {
    pub id: String,
    pub vendor_id: String,
    pub invoice_number: String,
    pub invoice_amount: f64,
    pub amount_paid: f64,
    pub amount_due: f64,
    pub due_date: String,
    pub days_until_due: i32,
    pub discount_available: f64,
    pub discount_date: Option<String>,
}

/// Cash flow statement data
#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct CashFlowStatement {
    pub operating_cash_flow: f64,
    pub investing_cash_flow: f64,
    pub financing_cash_flow: f64,
    pub net_cash_flow: f64,
    pub beginning_cash: f64,
    pub ending_cash: f64,
    pub period_start: String,
    pub period_end: String,
}

/// Create a new financial account
#[napi]
pub fn create_account(
    account_code: String,
    account_name: String,
    account_type: String,
    parent_account_id: Option<String>,
) -> Account {
    let now = Utc::now().to_rfc3339();
    
    Account {
        id: Uuid::new_v4().to_string(),
        account_code,
        account_name,
        account_type,
        parent_account_id,
        current_balance: 0.0,
        debit_balance: 0.0,
        credit_balance: 0.0,
        is_active: true,
        created_at: now.clone(),
        updated_at: now,
    }
}

/// Calculate account balance
#[napi]
pub fn calculate_account_balance(debit_amount: f64, credit_amount: f64, account_type: String) -> f64 {
    match account_type.as_str() {
        "Asset" | "Expense" => debit_amount - credit_amount,
        "Liability" | "Equity" | "Revenue" => credit_amount - debit_amount,
        _ => 0.0,
    }
}

/// Create a journal entry with automatic balancing validation
#[napi]
pub fn create_journal_entry(
    description: String,
    transaction_date: String,
    line_items: Vec<JournalLineItem>,
) -> JournalEntry {
    let total_debit: f64 = line_items.iter().map(|item| item.debit_amount).sum();
    let total_credit: f64 = line_items.iter().map(|item| item.credit_amount).sum();
    let is_balanced = (total_debit - total_credit).abs() < 0.01;
    
    JournalEntry {
        id: Uuid::new_v4().to_string(),
        entry_number: format!("JE-{}", Utc::now().format("%Y%m%d-%H%M%S")),
        description,
        transaction_date,
        total_debit,
        total_credit,
        is_balanced,
        created_by: "system".to_string(),
        status: if is_balanced { "balanced".to_string() } else { "unbalanced".to_string() },
    }
}

/// Calculate financial ratios
#[napi]
pub fn calculate_current_ratio(current_assets: f64, current_liabilities: f64) -> f64 {
    if current_liabilities == 0.0 {
        0.0
    } else {
        current_assets / current_liabilities
    }
}

/// Calculate debt-to-equity ratio
#[napi]
pub fn calculate_debt_to_equity_ratio(total_debt: f64, total_equity: f64) -> f64 {
    if total_equity == 0.0 {
        0.0
    } else {
        total_debt / total_equity
    }
}

/// Calculate return on assets (ROA)
#[napi]
pub fn calculate_return_on_assets(net_income: f64, total_assets: f64) -> f64 {
    if total_assets == 0.0 {
        0.0
    } else {
        (net_income / total_assets) * 100.0
    }
}

/// Calculate return on equity (ROE)
#[napi]
pub fn calculate_return_on_equity(net_income: f64, total_equity: f64) -> f64 {
    if total_equity == 0.0 {
        0.0
    } else {
        (net_income / total_equity) * 100.0
    }
}

/// Calculate gross profit margin
#[napi]
pub fn calculate_gross_profit_margin(gross_profit: f64, revenue: f64) -> f64 {
    if revenue == 0.0 {
        0.0
    } else {
        (gross_profit / revenue) * 100.0
    }
}

/// Calculate net profit margin
#[napi]
pub fn calculate_net_profit_margin(net_income: f64, revenue: f64) -> f64 {
    if revenue == 0.0 {
        0.0
    } else {
        (net_income / revenue) * 100.0
    }
}

/// Calculate days sales outstanding (DSO)
#[napi]
pub fn calculate_days_sales_outstanding(accounts_receivable: f64, daily_sales: f64) -> f64 {
    if daily_sales == 0.0 {
        0.0
    } else {
        accounts_receivable / daily_sales
    }
}

/// Calculate accounts receivable aging
#[napi]
pub fn calculate_ar_aging(ar_records: Vec<AccountReceivable>) -> String {
    let mut current = 0.0;
    let mut thirty_days = 0.0;
    let mut sixty_days = 0.0;
    let mut ninety_days = 0.0;
    let mut over_ninety = 0.0;
    
    for record in ar_records {
        match record.days_overdue {
            0..=0 => current += record.amount_due,
            1..=30 => thirty_days += record.amount_due,
            31..=60 => sixty_days += record.amount_due,
            61..=90 => ninety_days += record.amount_due,
            _ => over_ninety += record.amount_due,
        }
    }
    
    let total = current + thirty_days + sixty_days + ninety_days + over_ninety;
    
    serde_json::json!({
        "current": current,
        "thirty_days": thirty_days,
        "sixty_days": sixty_days,
        "ninety_days": ninety_days,
        "over_ninety_days": over_ninety,
        "total": total
    }).to_string()
}

/// Calculate compound annual growth rate (CAGR)
#[napi]
pub fn calculate_cagr(beginning_value: f64, ending_value: f64, years: f64) -> f64 {
    if beginning_value <= 0.0 || years <= 0.0 {
        0.0
    } else {
        ((ending_value / beginning_value).powf(1.0 / years) - 1.0) * 100.0
    }
}

/// Calculate present value
#[napi]
pub fn calculate_present_value(future_value: f64, discount_rate: f64, periods: f64) -> f64 {
    future_value / (1.0 + discount_rate / 100.0).powf(periods)
}

/// Calculate future value
#[napi]
pub fn calculate_future_value(present_value: f64, interest_rate: f64, periods: f64) -> f64 {
    present_value * (1.0 + interest_rate / 100.0).powf(periods)
}

/// Generate financial statement
#[napi]
pub fn generate_financial_statement(
    period_start: String,
    period_end: String,
    accounts: Vec<Account>,
) -> FinancialStatement {
    let mut total_assets = 0.0;
    let mut total_liabilities = 0.0;
    let mut total_equity = 0.0;
    let mut total_revenue = 0.0;
    let mut total_expenses = 0.0;
    
    for account in accounts {
        match account.account_type.as_str() {
            "Asset" => total_assets += account.current_balance,
            "Liability" => total_liabilities += account.current_balance,
            "Equity" => total_equity += account.current_balance,
            "Revenue" => total_revenue += account.current_balance,
            "Expense" => total_expenses += account.current_balance,
            _ => {}
        }
    }
    
    let net_income = total_revenue - total_expenses;
    
    FinancialStatement {
        statement_type: "Comprehensive".to_string(),
        period_start,
        period_end,
        total_assets,
        total_liabilities,
        total_equity,
        total_revenue,
        total_expenses,
        net_income,
    }
}

/// Calculate working capital
#[napi]
pub fn calculate_working_capital(current_assets: f64, current_liabilities: f64) -> f64 {
    current_assets - current_liabilities
}

/// Calculate quick ratio (acid test)
#[napi]
pub fn calculate_quick_ratio(quick_assets: f64, current_liabilities: f64) -> f64 {
    if current_liabilities == 0.0 {
        0.0
    } else {
        quick_assets / current_liabilities
    }
}

/// Calculate inventory turnover ratio
#[napi]
pub fn calculate_inventory_turnover(cost_of_goods_sold: f64, average_inventory: f64) -> f64 {
    if average_inventory == 0.0 {
        0.0
    } else {
        cost_of_goods_sold / average_inventory
    }
}

/// Calculate break-even point
#[napi]
pub fn calculate_break_even_point(fixed_costs: f64, price_per_unit: f64, variable_cost_per_unit: f64) -> f64 {
    let contribution_margin = price_per_unit - variable_cost_per_unit;
    if contribution_margin == 0.0 {
        0.0
    } else {
        fixed_costs / contribution_margin
    }
}