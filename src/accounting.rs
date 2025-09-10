use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct GeneralLedgerEntry {
    pub entry_id: String,
    pub account_code: String,
    pub account_name: String,
    pub debit_amount: f64,
    pub credit_amount: f64,
    pub description: String,
    pub transaction_date: String,
    pub reference_number: String,
}

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct AccountsPayable {
    pub vendor_id: String,
    pub invoice_number: String,
    pub invoice_amount: f64,
    pub due_date: String,
    pub payment_terms: String,
    pub discount_available: f64,
    pub status: String,
}

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct AccountsReceivable {
    pub customer_id: String,
    pub invoice_number: String,
    pub invoice_amount: f64,
    pub outstanding_amount: f64,
    pub due_date: String,
    pub days_outstanding: i32,
    pub aging_bucket: String,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct JournalEntry {
    pub journal_id: String,
    pub posting_date: String,
    pub description: String,
    pub entries: Vec<GeneralLedgerEntry>,
    pub total_debits: f64,
    pub total_credits: f64,
    pub is_balanced: bool,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct AccountingPeriod {
    pub period_id: String,
    pub start_date: String,
    pub end_date: String,
    pub status: String,
    pub total_revenue: f64,
    pub total_expenses: f64,
    pub net_income: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct ChartOfAccounts {
    pub account_code: String,
    pub account_name: String,
    pub account_type: String,
    pub parent_account: String,
    pub is_active: bool,
    pub current_balance: f64,
}

#[napi]
pub fn calculate_journal_entry_balance(
    entries: Vec<GeneralLedgerEntry>,
) -> JournalEntry {
    let total_debits: f64 = entries.iter().map(|e| e.debit_amount).sum();
    let total_credits: f64 = entries.iter().map(|e| e.credit_amount).sum();
    let is_balanced = (total_debits - total_credits).abs() < 0.01; // Allow for rounding

    JournalEntry {
        journal_id: "".to_string(), // To be set by caller
        posting_date: "".to_string(), // To be set by caller
        description: "".to_string(), // To be set by caller
        entries,
        total_debits,
        total_credits,
        is_balanced,
    }
}

#[napi]
pub fn calculate_aging_analysis(
    receivables: Vec<AccountsReceivable>,
) -> Vec<f64> {
    let mut aging_buckets = vec![0.0; 5]; // 0-30, 31-60, 61-90, 91-120, 120+

    for ar in receivables {
        let bucket_index = match ar.days_outstanding {
            0..=30 => 0,
            31..=60 => 1,
            61..=90 => 2,
            91..=120 => 3,
            _ => 4,
        };
        aging_buckets[bucket_index] += ar.outstanding_amount;
    }

    aging_buckets
}

#[napi]
pub fn calculate_accounting_days_sales_outstanding(
    total_receivables: f64,
    daily_sales: f64,
) -> f64 {
    if daily_sales > 0.0 {
        total_receivables / daily_sales
    } else {
        0.0
    }
}

#[napi]
pub fn calculate_payable_discount_value(
    payables: Vec<AccountsPayable>,
) -> f64 {
    payables.iter()
        .filter(|ap| ap.status == "DISCOUNT_AVAILABLE")
        .map(|ap| ap.discount_available)
        .sum()
}

#[napi]
pub fn calculate_account_reconciliation(
    book_balance: f64,
    bank_balance: f64,
    outstanding_deposits: f64,
    outstanding_checks: f64,
) -> f64 {
    let adjusted_bank_balance = bank_balance + outstanding_deposits - outstanding_checks;
    book_balance - adjusted_bank_balance
}

#[napi]
pub fn calculate_gross_margin(
    revenue: f64,
    cost_of_goods_sold: f64,
) -> f64 {
    if revenue > 0.0 {
        ((revenue - cost_of_goods_sold) / revenue) * 100.0
    } else {
        0.0
    }
}

#[napi]
pub fn calculate_working_capital(
    current_assets: f64,
    current_liabilities: f64,
) -> f64 {
    current_assets - current_liabilities
}

#[napi]
pub fn calculate_quick_ratio(
    current_assets: f64,
    inventory: f64,
    current_liabilities: f64,
) -> f64 {
    if current_liabilities > 0.0 {
        (current_assets - inventory) / current_liabilities
    } else {
        0.0
    }
}

#[napi]
pub fn calculate_debt_to_equity_ratio(
    total_debt: f64,
    total_equity: f64,
) -> f64 {
    if total_equity > 0.0 {
        total_debt / total_equity
    } else {
        0.0
    }
}

#[napi]
pub fn generate_trial_balance(
    chart_of_accounts: Vec<ChartOfAccounts>,
) -> Vec<ChartOfAccounts> {
    // Filter active accounts with non-zero balances
    chart_of_accounts.into_iter()
        .filter(|account| account.is_active && account.current_balance.abs() > 0.01)
        .collect()
}

#[napi]
pub fn calculate_period_closing_entries(
    revenue_accounts: Vec<f64>,
    expense_accounts: Vec<f64>,
) -> f64 {
    let total_revenue: f64 = revenue_accounts.iter().sum();
    let total_expenses: f64 = expense_accounts.iter().sum();
    total_revenue - total_expenses // Net income
}

#[napi]
pub fn calculate_bad_debt_provision(
    total_receivables: f64,
    historical_bad_debt_rate: f64,
) -> f64 {
    total_receivables * (historical_bad_debt_rate / 100.0)
}